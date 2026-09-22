#!/usr/bin/env node
/**
 * composition-validate.mjs — check the canonical composition matrix, then audit
 * every supported tuple it declares.
 *
 * The matrix (`configuration/snips/_composition.json`) is the denominator for
 * completeness. It does NOT restate device applicability: supported devices are
 * resolved from each entry snippet's Seen-on rows, so Seen-on stays the single
 * source of truth and the two cannot disagree.
 *
 * A tuple is (form, os, device, tier). Its closure is the union of the entry
 * snippets, their recursive direct `Pair with` dependencies, their recursive
 * variant dependencies, and the recursive definers of every typed named
 * reference in everything included. Selection uses the shared resolvers, so a
 * tuple fails closed on ambiguity or unavailability rather than guessing.
 *
 * Usage:
 *   node scripts/composition-validate.mjs [--jvd <root>] [--audit] [--json]
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseSnip } from "./snip-parse.mjs";
import { resolveVariant, bodyIdentity } from "./variant-resolve.mjs";
import { resolveDependency, dependencyPath } from "./dependency-resolve.mjs";
import { extractConstructs } from "./config-references.mjs";
import { loadJvd } from "./object-ownership.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const STATUSES = new Set(["supported", "incomplete", "intentionally-unsupported", "deprecated"]);
const OS_MODES = new Set(["Junos", "EVO", "MIXED"]);

/** Structural checks on the matrix itself. Returns a list of problem strings. */
export function validateMatrix(matrix, snipIndex) {
  const problems = [];
  const ids = new Set();
  const aliases = new Map();

  for (const f of matrix.forms) {
    if (ids.has(f.id)) problems.push(`duplicate form id: ${f.id}`);
    ids.add(f.id);
    if (!STATUSES.has(f.status)) problems.push(`${f.id}: unknown status ${f.status}`);
    if (f.status !== "supported" && !f.reason) problems.push(`${f.id}: status ${f.status} requires a reason`);
    if (!OS_MODES.has(f.osMode)) problems.push(`${f.id}: unknown osMode ${f.osMode}`);
    for (const a of f.aliases || []) {
      const lower = a.toLowerCase();
      if (aliases.has(lower)) problems.push(`alias "${a}" claimed by ${aliases.get(lower)} and ${f.id}`);
      aliases.set(lower, f.id);
    }
    for (const r of f.roles || []) {
      if (!matrix.roles[r]) problems.push(`${f.id}: role ${r} is not in the role vocabulary`);
    }

    const entries = [...(f.entry?.junos || []), ...(f.entry?.evo || [])];
    for (const rel of entries) {
      if (rel.includes("*")) problems.push(`${f.id}: pattern entry "${rel}" may not be declared`);
      else if (!snipIndex.has(rel)) problems.push(`${f.id}: entry snippet does not resolve: ${rel}`);
    }
    if (f.status === "supported" && entries.length === 0) {
      problems.push(`${f.id}: status supported but no entry snippet`);
    }
    // A declared OS mode must not claim a side it has no entry for.
    if (f.status === "supported") {
      if (f.osMode === "Junos" && (f.entry.evo || []).length) problems.push(`${f.id}: osMode Junos but has an EVO entry`);
      if (f.osMode === "EVO" && (f.entry.junos || []).length) problems.push(`${f.id}: osMode EVO but has a Junos entry`);
    }
    for (const p of f.pairedConstructs || []) {
      if (p.startsWith("variant:")) continue;
      if (!ids.has(p) && !matrix.forms.some((x) => x.id === p)) problems.push(`${f.id}: paired construct ${p} is not a form id`);
    }
  }
  return problems;
}

/** Devices a supported form reaches, resolved from its entry snippets' Seen-on. */
export function formDevices(form, snipIndex) {
  const out = [];
  for (const os of ["junos", "evo"]) {
    for (const rel of form.entry?.[os] || []) {
      const s = snipIndex.get(rel);
      if (!s) continue;
      for (const bucket of ["junos", "evo"]) {
        for (const dev of s.seenOn[bucket] || []) out.push({ os: bucket, device: dev, entry: rel });
      }
    }
  }
  // De-duplicate (os, device) while keeping every entry that reaches it.
  const seen = new Map();
  for (const t of out) {
    const k = `${t.os}\u0000${t.device}`;
    if (!seen.has(k)) seen.set(k, { os: t.os, device: t.device, entries: [] });
    seen.get(k).entries.push(t.entry);
  }
  return [...seen.values()].sort((a, b) => `${a.os}${a.device}`.localeCompare(`${b.os}${b.device}`));
}

/**
 * Closure for one tuple. Returns `{ included, failures }` where each failure
 * names its kind so the ledger can group by root cause.
 */
export function closeTuple({ entries, device, os, snipIndex, headers, constructs, variantMembers, definers }) {
  const included = new Set();
  const failures = [];
  const stack = [...entries];
  while (stack.length) {
    const rel = stack.pop();
    if (included.has(rel)) continue;
    included.add(rel);
    const h = headers.get(rel);
    if (!h) continue;

    for (const bullet of h.pairWith || []) {
      const raw = String(bullet).replace(/^-\s*/, "").trim();
      if (/^none$/i.test(raw) || !raw) continue;
      if (raw.startsWith("variant:")) {
        const m = raw.match(/variant:([a-z0-9-]+)\s+(?:families|capabilities)=(\S+)/);
        if (!m) {
          failures.push({ kind: "variant-malformed", from: rel, detail: raw });
          continue;
        }
        const r = resolveVariant({
          group: m[1],
          selectors: m[2].split(","),
          targetDevice: device,
          targetOS: os,
          consumerJvd: "mebs",
          members: variantMembers.filter((x) => x.group === m[1]),
        });
        if (r.status !== "ok") failures.push({ kind: `variant-${r.status}`, from: rel, detail: m[1] });
        else stack.push(r.member.rel);
        continue;
      }
      const target = dependencyPath(raw);
      if (!target) continue;
      const r = resolveDependency({ targetRel: target, targetDevice: device, targetOS: os, index: snipIndex });
      if (r.status !== "ok") failures.push({ kind: `dependency-${r.status}`, from: rel, detail: target, alternative: r.alternative });
      else stack.push(r.selected);
    }

    for (const ref of constructs.get(rel)?.references || []) {
      const id = `${ref.kind}:${ref.name}`;
      const byOs = definers.get(id);
      const here = byOs ? byOs[os].get(device) || [] : [];
      if (here.length === 0) {
        failures.push({ kind: byOs ? "reference-off-device" : "reference-external", from: rel, detail: id });
        continue;
      }
      const bodies = new Map();
      for (const d of here) {
        const b = bodyIdentity(snipIndex.get(d).body);
        if (!bodies.has(b)) bodies.set(b, []);
        bodies.get(b).push(d);
      }
      if (bodies.size > 1) {
        failures.push({ kind: "reference-ambiguous", from: rel, detail: id, members: here });
        continue;
      }
      const reps = [...bodies.values()][0].sort();
      stack.push(reps.find((d) => d.split("/")[0] === os) ?? reps[0]);
    }
  }
  return { included: [...included].sort(), failures };
}

async function main() {
  const args = process.argv.slice(2);
  const jvdArg = args.includes("--jvd") ? args[args.indexOf("--jvd") + 1] : "service_provider/metro_ethernet_business_services";
  const root = path.resolve(REPO_ROOT, jvdArg);
  const { snips } = await loadJvd(root);
  const snipIndex = new Map(snips.map((s) => [s.rel, s]));

  const matrix = JSON.parse(await fs.readFile(path.join(root, "configuration/snips/_composition.json"), "utf8"));
  const problems = validateMatrix(matrix, snipIndex);

  console.log(`composition matrix: ${matrix.forms.length} advertised service forms, ${matrix.nonServiceAsks.length} non-service asks`);
  const byStatus = new Map();
  for (const f of matrix.forms) byStatus.set(f.status, (byStatus.get(f.status) || 0) + 1);
  console.log(`status: ${[...byStatus].map(([k, v]) => `${k}=${v}`).join(" ")}`);
  if (problems.length) {
    console.log(`\nMATRIX PROBLEMS (${problems.length}):`);
    for (const p of problems) console.log(`  ${p}`);
  } else {
    console.log("matrix: OK");
  }

  if (!args.includes("--audit")) return problems.length ? 1 : 0;

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

  let tuples = 0;
  let clean = 0;
  const ledger = new Map();
  const byFamily = new Map();
  let sizeSum = 0;
  let sizeMax = 0;
  for (const f of matrix.forms) {
    if (f.status !== "supported") continue;
    for (const t of formDevices(f, snipIndex)) {
      for (const tier of f.tiers) {
        tuples += 1;
        const r = closeTuple({
          entries: t.entries,
          device: t.device,
          os: t.os,
          snipIndex,
          headers,
          constructs,
          variantMembers,
          definers,
        });
        sizeSum += r.included.length;
        sizeMax = Math.max(sizeMax, r.included.length);
        const fam = byFamily.get(f.family) || { total: 0, clean: 0 };
        fam.total += 1;
        if (r.failures.length === 0) {
          clean += 1;
          fam.clean += 1;
        }
        byFamily.set(f.family, fam);
        for (const x of r.failures) {
          const key = `${x.kind}\u0000${x.detail}`;
          const e = ledger.get(key) || { kind: x.kind, detail: x.detail, tuples: 0, forms: new Set(), consumers: new Set(), devices: new Set() };
          e.tuples += 1;
          e.forms.add(f.id);
          e.consumers.add(x.from);
          e.devices.add(`${t.os}:${t.device}`);
          ledger.set(key, e);
        }
      }
    }
  }

  console.log(`\nsupported tuples (form x device x tier): ${tuples}`);
  console.log(`CLEAN ${clean}  FAIL-CLOSED ${tuples - clean}  (${tuples ? ((100 * clean) / tuples).toFixed(1) : 0}% closed)`);
  console.log(`mean closure ${tuples ? (sizeSum / tuples).toFixed(1) : 0} snippets, max ${sizeMax}`);
  console.log("\nby family:");
  for (const [fam, v] of [...byFamily].sort()) console.log(`  ${fam.padEnd(12)} ${v.clean}/${v.total} closed`);
  console.log(`\nroot causes (${ledger.size}):`);
  for (const e of [...ledger.values()].sort((a, b) => b.tuples - a.tuples)) {
    console.log(`  ${e.kind.padEnd(26)} ${String(e.tuples).padStart(4)} tuples  ${e.detail}`);
    console.log(`  ${"".padEnd(26)}      forms=${[...e.forms].join(",")}  devices=${e.devices.size}  consumers=${[...e.consumers].length}`);
  }
  return problems.length ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main().then((c) => {
    process.exitCode = c;
  });
}
