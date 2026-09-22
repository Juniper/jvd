#!/usr/bin/env node
/**
 * generate-tiers.mjs — write TIERS.md from the canonical composition matrix.
 *
 * TIERS is a generated artifact, not a second source of truth. Every snippet
 * path it names is resolved through the same closure the composition audit
 * uses, so a reference can never drift away from the library again: a category
 * rename breaks the build instead of silently emitting a dead path.
 *
 * Tier semantics:
 *   minimum         the entry snippets for the form, and nothing else
 *   self-contained  the recursive closure: entry snippets, direct dependencies,
 *                   variant selections and the definers of every named
 *                   reference, with required operator choices listed as inputs
 *   as-deployed     self-contained plus the validated baselines the JVD runs
 *   with-overlay    compatibility alias, kept so existing asks keep working;
 *                   it means self-contained for a BGP-signalled form
 *
 * Usage: node scripts/generate-tiers.mjs [--jvd <root>] [--check]
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseSnip } from "./snip-parse.mjs";
import { bodyIdentity } from "./variant-resolve.mjs";
import { extractConstructs } from "./config-references.mjs";
import { loadJvd } from "./object-ownership.mjs";
import { formDevices, closeTuple, selectEntries } from "./composition-validate.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");

const TIER_BLURB = {
  minimum: "Only the service construct. Assumes the PE already runs the underlay and the overlay the service needs.",
  "self-contained": "Everything the emitted configuration names, resolved recursively for the target device.",
  "as-deployed": "The self-contained set plus the validated baselines this JVD runs on that device.",
};

export async function buildTiers(root) {
  const { snips } = await loadJvd(root);
  const snipIndex = new Map(snips.map((s) => [s.rel, s]));
  const matrix = JSON.parse(await fs.readFile(path.join(root, "configuration/snips/_composition.json"), "utf8"));

  const headers = new Map();
  const constructs = new Map();
  for (const s of snips) {
    headers.set(s.rel, parseSnip(await fs.readFile(path.join(root, "configuration/snips", s.rel), "utf8")).header);
    constructs.set(s.rel, extractConstructs(s.body));
  }
  const variantMembers = snips
    .filter((s) => headers.get(s.rel).variantGroup)
    .map((s) => ({
      rel: s.rel,
      os: s.dir,
      jvd: "mebs",
      group: headers.get(s.rel).variantGroup.name,
      provides: headers.get(s.rel).variantGroup.provides,
      seenOn: s.seenOn,
      bodyId: bodyIdentity(s.body),
    }));
  const definers = new Map();
  for (const s of snips) {
    for (const d of constructs.get(s.rel).definitions) {
      const id = `${d.kind}:${d.name}`;
      let m = definers.get(id);
      if (!m) definers.set(id, (m = { junos: new Map(), evo: new Map() }));
      for (const os of ["junos", "evo"]) {
        for (const dev of s.seenOn[os] || []) {
          const l = m[os].get(dev) || [];
          l.push(s.rel);
          m[os].set(dev, l);
        }
      }
    }
  }

  const out = [];
  out.push("# Configuration form tiers");
  out.push("");
  out.push("<!-- GENERATED FROM configuration/snips/_composition.json by portal/scripts/generate-tiers.mjs. Do not edit by hand: run `npm --prefix portal run tiers`. -->");
  out.push("");
  out.push("This file tells the assistant which snippet files to include for each service");
  out.push("form at each tier. It is generated from the composition matrix, so every path");
  out.push("below resolves to a real snippet and every device listed is one the form is");
  out.push("validated on.");
  out.push("");
  out.push("## What the tiers mean");
  out.push("");
  out.push("| Tier | What it includes |");
  out.push("|---|---|");
  for (const [t, b] of Object.entries(TIER_BLURB)) out.push(`| \`${t}\` | ${b} |`);
  out.push("| `with-overlay` | Compatibility alias. For a BGP-signalled form it means `self-contained`, which already pulls in that device's overlay form. |");
  out.push("");
  out.push("A tier never implies that a larger closure is a minimal protocol requirement.");
  out.push("If a form's overlay, variant or dependency cannot be resolved for the target");
  out.push("device, the request fails closed: say so and generate nothing for it.");
  out.push("");
  out.push("## Required operator inputs");
  out.push("");
  out.push("Some constructs are a choice, not a default. Ask for them; never preselect.");
  out.push("");
  out.push("Each choice applies only to the service families listed against it. A");
  out.push("service whose family is not listed binds its provider deterministically");
  out.push("and must not be asked to choose.");
  out.push("");
  for (const b of matrix.roleBindings.bindings.filter((x) => x.selection === "required")) {
    const fams = (b.families ?? []).map((f) => `\`${f}\``).join(", ") || "(none)";
    out.push(`- **${b.construct}** — applies to ${fams} only. ${b.rationale}`);
  }
  out.push("");
  out.push("---");
  out.push("");

  for (const f of matrix.forms) {
    out.push(`## ${f.aliases[0]}`);
    out.push("");
    if (f.status !== "supported") {
      out.push(`**Not generatable.** ${f.reason}`);
      out.push("");
      out.push("---");
      out.push("");
      continue;
    }
    out.push(`Family ${f.family}, form ${f.form}. OS mode ${f.osMode}. Attachment: ${f.attachment}.`);
    out.push("");
    const devs = formDevices(f, snipIndex);
    for (const t of devs) {
      const pick = selectEntries(t.entries, t.os, snipIndex);
      const r = closeTuple({
        entries: pick.selected,
        device: t.device,
        os: t.os,
        snipIndex,
        headers,
        constructs,
        variantMembers,
        definers,
        matrix,
        family: f.family,
      });
      out.push(`### ${t.device} (${t.os})`);
      out.push("");
      out.push(`- \`minimum\`: ${pick.selected.map((e) => `\`${e}\``).join(", ")}`);
      const extra = r.included.filter((x) => !pick.selected.includes(x));
      out.push(
        `- \`self-contained\`: the above${extra.length ? ` plus ${extra.map((e) => `\`${e}\``).join(", ")}` : " — it names nothing further"}`,
      );
      if (r.requiredInputs.length) {
        for (const q of r.requiredInputs) {
          out.push(`  - ask for **${q.construct}**, one of ${q.choices.map((c) => `\`${c}\``).join(", ")}`);
        }
      }
      out.push("- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.");
      out.push("");
    }
    out.push("---");
    out.push("");
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

async function main() {
  const args = process.argv.slice(2);
  const jvdArg = args.includes("--jvd") ? args[args.indexOf("--jvd") + 1] : "service_provider/metro_ethernet_business_services";
  const root = path.resolve(REPO_ROOT, jvdArg);
  const target = path.join(root, "configuration/snips/byoai/TIERS.md");
  const text = await buildTiers(root);
  if (args.includes("--check")) {
    const current = await fs.readFile(target, "utf8").catch(() => "");
    if (current === text) {
      console.log("[generate-tiers --check] OK");
      return 0;
    }
    console.log("[generate-tiers --check] TIERS.md is out of date. Run: npm --prefix portal run tiers");
    return 1;
  }
  await fs.writeFile(target, text);
  console.log(`[generate-tiers] wrote ${target} — ${text.split("\n").length} lines`);
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main().then((c) => {
    process.exitCode = c;
  });
}
