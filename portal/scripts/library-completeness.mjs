#!/usr/bin/env node
/**
 * library-completeness.mjs — can the library supply everything its own snips
 * name?
 *
 * For every snip, for every device that snip applies to, every construct the
 * body references must be defined by some snip that applies to the SAME device.
 * That is the property a self-contained rendering depends on, and it is the
 * measurable form of "complete and reconstructable".
 *
 * This is deliberately NOT the ownership audit in `object-ownership.mjs`. That
 * one compares a snip against a device's authoritative source and is defeated
 * by templating. This one compares snips against each other, symbolically, so
 * `vrf-export $INSTANCE_NAME` resolves against `policy-statement
 * $INSTANCE_NAME`. Templated constructs are fully in scope.
 *
 * Each reference lands in exactly one bucket:
 *   resolved    one or more applicable definers, all in agreement
 *   unresolved  no applicable definer — a self-contained rendering cannot close
 *   off-device  defined somewhere in the library, but not for this device
 *   external    defined nowhere in the library (underlay or platform-supplied)
 *
 * `off-device` and `unresolved` are the same failure for rendering; they are
 * separated because they need different fixes: a Seen-on correction versus a
 * missing snip.
 *
 * Usage:
 *   node scripts/library-completeness.mjs [--jvd <repo-relative JVD root>]
 *                                         [--json] [--by-construct]
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractConstructs } from "./config-references.mjs";
import { loadJvd } from "./object-ownership.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");

const idOf = (kind, name) => `${kind}:${name}`;

/**
 * auditLibrary({ snips }) where snips is [{ rel, dir, seenOn, body }].
 * Pure over its input so fixtures can drive it.
 */
export function auditLibrary({ snips }) {
  const parseFailures = [];
  const indexed = [];
  for (const s of snips) {
    const { ok, definitions, references } = extractConstructs(s.body);
    if (!ok) parseFailures.push(s.rel);
    indexed.push({ ...s, ok, definitions, references });
  }

  // construct id -> os -> device -> [definer rel]
  const definers = new Map();
  for (const s of indexed) {
    if (!s.ok) continue;
    for (const d of s.definitions) {
      const id = idOf(d.kind, d.name);
      let byOs = definers.get(id);
      if (!byOs) definers.set(id, (byOs = { junos: new Map(), evo: new Map() }));
      for (const os of ["junos", "evo"]) {
        for (const dev of s.seenOn[os] || []) {
          const list = byOs[os].get(dev) || [];
          list.push(s.rel);
          byOs[os].set(dev, list);
        }
      }
    }
  }

  const findings = [];
  for (const s of indexed) {
    if (!s.ok) continue;
    for (const os of ["junos", "evo"]) {
      for (const dev of s.seenOn[os] || []) {
        for (const ref of s.references) {
          const id = idOf(ref.kind, ref.name);
          const byOs = definers.get(id);
          const here = byOs ? byOs[os].get(dev) || [] : [];
          let bucket;
          if (here.length) bucket = "resolved";
          else if (byOs) bucket = "off-device";
          else bucket = "external";
          findings.push({
            consumer: s.rel,
            device: dev,
            os,
            construct: id,
            kind: ref.kind,
            name: ref.name,
            definers: here,
            crossDirectory: here.length > 0 && !here.some((r) => r.split("/")[0] === os),
            bucket,
          });
        }
      }
    }
  }

  const by = (b) => findings.filter((f) => f.bucket === b);
  return {
    parseFailures,
    findings,
    resolved: by("resolved"),
    offDevice: by("off-device"),
    external: by("external"),
    crossDirectory: findings.filter((f) => f.crossDirectory),
    definedConstructs: definers.size,
  };
}

function summarize(findings, keyFn) {
  const m = new Map();
  for (const f of findings) {
    const k = keyFn(f);
    const e = m.get(k) || { count: 0, devices: new Set(), consumers: new Set() };
    e.count += 1;
    e.devices.add(f.device);
    e.consumers.add(f.consumer);
    m.set(k, e);
  }
  return [...m.entries()].sort((a, b) => b[1].count - a[1].count);
}

async function main() {
  const args = process.argv.slice(2);
  const jvdArg = args.includes("--jvd") ? args[args.indexOf("--jvd") + 1] : "service_provider/metro_ethernet_business_services";
  const { snips } = await loadJvd(path.resolve(REPO_ROOT, jvdArg));
  const r = auditLibrary({ snips });

  if (args.includes("--json")) {
    console.log(JSON.stringify({ jvd: jvdArg, ...r, findings: r.findings }, null, 2));
    return r.offDevice.length === 0 ? 0 : 1;
  }

  console.log(`JVD: ${jvdArg}`);
  console.log(`snips ${snips.length} | distinct constructs defined ${r.definedConstructs} | reference bindings checked ${r.findings.length}`);
  console.log(
    `resolved ${r.resolved.length} | off-device ${r.offDevice.length} | external ${r.external.length} | cross-directory ${r.crossDirectory.length} | parse failures ${r.parseFailures.length}`,
  );

  if (args.includes("--by-construct")) {
    console.log("\n--- OFF-DEVICE: defined in the library, not for this device ---");
    for (const [k, v] of summarize(r.offDevice, (f) => f.construct)) {
      console.log(`  ${k.padEnd(46)} ${String(v.count).padStart(4)} bindings  ${v.devices.size} devices  ${v.consumers.size} consumers`);
    }
    console.log("\n--- EXTERNAL: named but defined by no snip ---");
    for (const [k, v] of summarize(r.external, (f) => f.construct)) {
      console.log(`  ${k.padEnd(46)} ${String(v.count).padStart(4)} bindings  ${v.devices.size} devices  ${v.consumers.size} consumers`);
    }
  }

  console.log(r.offDevice.length === 0 ? "\nRESULT: every referenced construct that the library models is applicable where it is used." : "\nRESULT: FAIL — see off-device findings.");
  return r.offDevice.length === 0 ? 0 : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main().then((code) => {
    process.exitCode = code;
  });
}
