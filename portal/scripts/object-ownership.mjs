#!/usr/bin/env node
/**
 * object-ownership.mjs — prove that every named configuration object in a JVD's
 * authoritative source has exactly one applicable snip that reconstructs it.
 *
 * Ownership is decided the same way applicability is decided everywhere else in
 * this repo: a snip owns an object ON A DEVICE iff the snip's body defines that
 * object AND the device is named in the snip's `Seen on:` row for the device's
 * OS. Storage directory is never part of that test; it is reported only so that
 * cross-directory selections stay visible.
 *
 * When several applicable snips define the same object, they are partitioned by
 * the canonical text of that object, matching `variant-resolve.mjs`: identical
 * bodies are equivalent representations of one construct and the same-directory
 * one is selected, while DIFFERING bodies are ambiguous and fail. Storage can
 * never hide a differing body.
 *
 * The proof is structural, not textual: both sides are parsed by
 * `config-objects.mjs` and compared as canonical statement trees. A parse
 * failure on either side is reported as unproven, never as equal.
 *
 * An object present in source that no snip owns is reported either way, but is
 * split by whether anything in that device's configuration references it. An
 * unowned object that IS referenced breaks self-contained composition and
 * fails. An unowned object that nothing references cannot be reached by any
 * emitted configuration; it is reported as a coverage gap without failing.
 *
 * Coverage is bounded to the selectors in `OBJECT_SELECTORS`. Hierarchies
 * outside that list are NOT audited, and this script must not be read as a
 * whole-configuration audit.
 *
 * Usage:
 *   node scripts/object-ownership.mjs [--jvd <repo-relative JVD root>] [--json]
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseSnip } from "./snip-parse.mjs";
import { parseConfig, findObjects, findPolicerReferences } from "./config-objects.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");

/**
 * The audited hierarchies. Each entry names an object class whose instances are
 * globally named within a device, so "exactly one owner" is a meaningful claim.
 * `kind` drives reference checking; `path` is matched word-for-word, with `*`
 * capturing the object name.
 */
export const OBJECT_SELECTORS = [
  {
    key: "firewall-family-any-filter",
    label: "firewall family any filter",
    kind: "filter",
    path: [["firewall"], ["family", "any"], ["filter", "*"]],
  },
  {
    key: "firewall-policer",
    label: "firewall policer",
    kind: "policer",
    path: [["firewall"], ["policer", "*"]],
  },
];

const POLICER_SELECTOR = "firewall-policer";

const objectKey = (selectorKey, name) => `${selectorKey}:${name}`;

/**
 * Index every audited object in one configuration text.
 * Returns `{ ok, objects }` where `objects` maps objectKey -> array of
 * occurrences. More than one occurrence means the text really defines the
 * object twice; occurrences are never merged.
 */
export function indexObjects(text, selectors = OBJECT_SELECTORS) {
  const { nodes, ok } = parseConfig(text);
  const objects = new Map();
  if (!ok) return { ok: false, objects, nodes: [] };
  for (const sel of selectors) {
    for (const found of findObjects(nodes, sel.path)) {
      const key = objectKey(sel.key, found.name);
      const entry = {
        selector: sel.key,
        name: found.name,
        node: found.node,
        canonical: found.canonical,
        refs: sel.kind === "filter" ? findPolicerReferences(found.node) : [],
      };
      const list = objects.get(key);
      if (list) list.push(entry);
      else objects.set(key, [entry]);
    }
  }
  return { ok: true, objects, nodes };
}

/**
 * How many statements elsewhere in a configuration mention `name`, ignoring the
 * object's own definition subtree. Zero means nothing can reach the object.
 */
function countReferences(nodes, name, definitions) {
  const excluded = new Set(definitions);
  let count = 0;
  const walk = (level) => {
    for (const node of level) {
      if (excluded.has(node)) continue;
      if (node.words.includes(name)) count += 1;
      if (node.children) walk(node.children);
    }
  };
  walk(nodes);
  return count;
}

/**
 * Core audit. Pure over its inputs so fixtures can drive it.
 *
 *   sources: [{ device, os, text }]
 *   snips:   [{ rel, dir, seenOn: { junos: [], evo: [] }, body }]
 *
 * Every row is one (device, object) pair observed in source or claimed by a
 * snip. `equal` is null whenever the comparison could not be performed.
 */
export function auditOwnership({ sources, snips, selectors = OBJECT_SELECTORS }) {
  const parseFailures = [];
  const rows = [];
  const widened = [];

  const snipIndex = snips.map((s) => {
    const { ok, objects } = indexObjects(s.body, selectors);
    if (!ok) parseFailures.push({ where: "snip", id: s.rel });
    return { ...s, ok, objects };
  });

  for (const src of sources) {
    const { ok, objects: srcObjects, nodes: srcNodes } = indexObjects(src.text, selectors);
    if (!ok) {
      parseFailures.push({ where: "source", id: src.device });
      continue;
    }

    // Every object key this device could be involved in: present in source, or
    // claimed by a snip that names this device. Claims without source are how a
    // snip widens ownership, so they must appear too.
    const keys = new Set(srcObjects.keys());
    const claims = new Map();
    for (const snip of snipIndex) {
      if (!snip.ok) continue;
      if (!(snip.seenOn[src.os] || []).includes(src.device)) continue;
      for (const key of snip.objects.keys()) {
        keys.add(key);
        const list = claims.get(key);
        if (list) list.push(snip);
        else claims.set(key, [snip]);
      }
    }

    for (const key of [...keys].sort()) {
      const srcList = srcObjects.get(key) || [];
      const owners = claims.get(key) || [];
      const ownerNames = owners.map((o) => o.rel);

      // Applicable owners are equivalent when the object they emit is
      // byte-identical after canonicalization; only differing bodies are
      // ambiguous. Among equivalents the same-directory one is selected.
      const bodies = new Map();
      for (const o of owners) {
        const defs = o.objects.get(key);
        const body = defs.map((d) => d.canonical).join("\n");
        const bucket = bodies.get(body);
        if (bucket) bucket.push(o);
        else bodies.set(body, [o]);
      }
      const ambiguous = bodies.size > 1;
      let selected = null;
      if (bodies.size === 1) {
        const equivalents = [...bodies.values()][0];
        selected = equivalents.find((o) => o.dir === src.os) || equivalents[0];
      }

      let equal = null;
      if (srcList.length === 1 && selected) {
        const claimed = selected.objects.get(key);
        equal = claimed.length === 1 && claimed[0].canonical === srcList[0].canonical;
      }
      if (srcList.length === 0 && owners.length > 0) {
        widened.push({ device: src.device, os: src.os, objectKey: key, owners: ownerNames });
      }
      rows.push({
        device: src.device,
        os: src.os,
        objectKey: key,
        selector: key.slice(0, key.indexOf(":")),
        name: key.slice(key.indexOf(":") + 1),
        sourceCount: srcList.length,
        sourceReferences: srcList.length ? countReferences(srcNodes, srcList[0].name, srcList.map((d) => d.node)) : 0,
        owners: ownerNames,
        selected: selected ? selected.rel : null,
        equivalentOwners: selected ? ownerNames.filter((r) => r !== selected.rel) : [],
        ambiguous,
        distinctBodies: bodies.size,
        reconstructedCount: selected ? selected.objects.get(key).length : 0,
        equal,
        crossDirectory: Boolean(selected) && selected.dir !== src.os,
        refs: srcList.length ? srcList[0].refs : selected ? selected.objects.get(key)[0].refs : [],
      });
    }
  }

  const byDeviceKey = new Map(rows.map((r) => [`${r.device}\u0000${r.objectKey}`, r]));
  const refFindings = [];
  for (const row of rows) {
    for (const ref of row.refs) {
      const target = byDeviceKey.get(`${row.device}\u0000${objectKey(POLICER_SELECTOR, ref)}`);
      refFindings.push({
        device: row.device,
        from: row.objectKey,
        policer: ref,
        owners: target ? target.owners : [],
        selected: target ? target.selected : null,
        sourceCount: target ? target.sourceCount : 0,
        equal: target ? target.equal : null,
        resolved: Boolean(target && target.selected && !target.ambiguous && target.equal === true),
      });
    }
  }

  const unowned = rows.filter((r) => r.sourceCount > 0 && r.owners.length === 0);
  const unownedReferenced = unowned.filter((r) => r.sourceReferences > 0);
  const unownedUnreferenced = unowned.filter((r) => r.sourceReferences === 0);
  const ambiguousOwners = rows.filter((r) => r.ambiguous);
  const duplicateInSource = rows.filter((r) => r.sourceCount > 1);
  const duplicateInOwner = rows.filter((r) => r.reconstructedCount > 1);
  const mismatched = rows.filter((r) => r.sourceCount > 0 && r.selected && r.equal !== true);
  const crossDirectory = rows.filter((r) => r.crossDirectory);
  const unresolvedRefs = refFindings.filter((f) => !f.resolved);

  return {
    ok:
      parseFailures.length === 0 &&
      unownedReferenced.length === 0 &&
      ambiguousOwners.length === 0 &&
      duplicateInSource.length === 0 &&
      duplicateInOwner.length === 0 &&
      mismatched.length === 0 &&
      widened.length === 0 &&
      unresolvedRefs.length === 0,
    rows,
    parseFailures,
    unowned,
    unownedReferenced,
    unownedUnreferenced,
    ambiguousOwners,
    duplicateInSource,
    duplicateInOwner,
    mismatched,
    widened,
    crossDirectory,
    refFindings,
    unresolvedRefs,
  };
}

/**
 * Derive device -> OS from the library's own Seen-on rows, which are the
 * repository's OS assertion. A device named under both rows is a conflict and
 * is reported rather than guessed.
 */
export function deriveDeviceOs(snips) {
  const seen = new Map();
  for (const s of snips) {
    for (const os of ["junos", "evo"]) {
      for (const dev of s.seenOn[os] || []) {
        const cur = seen.get(dev);
        if (!cur) seen.set(dev, new Set([os]));
        else cur.add(os);
      }
    }
  }
  const os = new Map();
  const conflicts = [];
  for (const [dev, set] of seen) {
    if (set.size === 1) os.set(dev, [...set][0]);
    else conflicts.push({ device: dev, rows: [...set].sort() });
  }
  return { os, conflicts };
}

async function walkConf(dir, base, out) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (e) {
    if (e.code === "ENOENT") return;
    throw e;
  }
  for (const ent of entries) {
    if (ent.name.startsWith(".")) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) await walkConf(full, base ? `${base}/${ent.name}` : ent.name, out);
    else if (ent.isFile() && ent.name.endsWith(".conf")) {
      const stem = ent.name.slice(0, -".conf".length);
      out.push({ device: base ? `${base}/${stem}` : stem, file: full });
    }
  }
}

async function walkSnips(dir, base, out) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (e) {
    if (e.code === "ENOENT") return;
    throw e;
  }
  for (const ent of entries) {
    if (ent.name.startsWith(".") || ent.name === "byoai") continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) await walkSnips(full, base ? `${base}/${ent.name}` : ent.name, out);
    else if (ent.isFile() && ent.name.endsWith(".conf")) out.push({ rel: `${base}/${ent.name}`, file: full });
  }
}

export async function loadJvd(jvdRoot) {
  const confFiles = [];
  await walkConf(path.join(jvdRoot, "configuration", "conf"), "", confFiles);
  const snipFiles = [];
  await walkSnips(path.join(jvdRoot, "configuration", "snips"), "", snipFiles);

  const snips = [];
  for (const f of snipFiles) {
    const parsed = parseSnip(await fs.readFile(f.file, "utf8"));
    if (!parsed.header) continue;
    snips.push({
      rel: f.rel,
      dir: f.rel.split("/")[0],
      seenOn: parsed.header.seenOn,
      body: parsed.body,
    });
  }

  const { os, conflicts } = deriveDeviceOs(snips);
  const sources = [];
  const unknownOs = [];
  for (const c of confFiles) {
    const deviceOs = os.get(c.device);
    if (!deviceOs) {
      unknownOs.push(c.device);
      continue;
    }
    sources.push({ device: c.device, os: deviceOs, text: await fs.readFile(c.file, "utf8") });
  }
  return { sources, snips, osConflicts: conflicts, unknownOs };
}

async function main() {
  const args = process.argv.slice(2);
  const jvdArg = args.includes("--jvd") ? args[args.indexOf("--jvd") + 1] : "service_provider/metro_ethernet_business_services";
  const asJson = args.includes("--json");
  const jvdRoot = path.resolve(REPO_ROOT, jvdArg);

  const { sources, snips, osConflicts, unknownOs } = await loadJvd(jvdRoot);
  const result = auditOwnership({ sources, snips });

  if (asJson) {
    console.log(JSON.stringify({ jvd: jvdArg, osConflicts, unknownOs, ...result }, null, 2));
    return result.ok && osConflicts.length === 0 ? 0 : 1;
  }

  console.log(`JVD: ${jvdArg}`);
  console.log(`devices: ${sources.length}  snips: ${snips.length}  audited hierarchies: ${OBJECT_SELECTORS.map((s) => s.label).join(", ")}`);
  if (unknownOs.length) console.log(`devices with no OS assertion in any Seen-on row (not audited): ${unknownOs.join(" ")}`);
  if (osConflicts.length) console.log(`OS CONFLICTS: ${osConflicts.map((c) => `${c.device} [${c.rows.join(",")}]`).join(" ")}`);

  const involved = result.rows.filter((r) => r.sourceCount > 0 || r.owners.length > 0);
  console.log("");
  console.log("device                os    object                                       src ref sel                                            rec eq   xdir");
  for (const r of involved) {
    const owner = r.ambiguous ? `AMBIGUOUS(${r.distinctBodies}) ${r.owners.join(",")}` : r.selected || "(NONE)";
    const eq = r.equal === true ? "OK  " : r.equal === false ? "DIFF" : r.sourceCount === 0 ? "n/a " : "?   ";
    console.log(
      `${r.device.padEnd(21)} ${r.os.padEnd(5)} ${r.objectKey.padEnd(44)} ${String(r.sourceCount).padEnd(3)} ${String(r.sourceReferences).padEnd(3)} ${owner.padEnd(46)} ${String(r.reconstructedCount).padEnd(3)} ${eq} ${r.crossDirectory ? "yes" : "no"}`,
    );
    if (r.equivalentOwners.length) console.log(`${" ".repeat(32)}equivalent representation also applicable: ${r.equivalentOwners.join(", ")}`);
  }

  console.log("");
  console.log("--- filter -> policer references ---");
  for (const f of result.refFindings) {
    console.log(
      `${f.device.padEnd(21)} ${f.from.padEnd(44)} -> ${f.policer.padEnd(18)} owner=${f.selected || "(NONE)"} ${f.resolved ? "RESOLVED" : "UNRESOLVED"}`,
    );
  }

  console.log("");
  console.log(
    `parse failures ${result.parseFailures.length} | unowned+referenced ${result.unownedReferenced.length} | unowned+unreferenced ${result.unownedUnreferenced.length} | ambiguous owners ${result.ambiguousOwners.length} | duplicate in source ${result.duplicateInSource.length} | duplicate in owner ${result.duplicateInOwner.length} | body mismatches ${result.mismatched.length} | widened ${result.widened.length} | unresolved refs ${result.unresolvedRefs.length} | cross-directory ${result.crossDirectory.length}`,
  );
  for (const p of result.parseFailures) console.log(`UNPARSED      ${p.where} ${p.id}`);
  for (const u of result.unownedReferenced) console.log(`UNOWNED(ref)  ${u.device} ${u.objectKey} referenced ${u.sourceReferences}x`);
  for (const u of result.unownedUnreferenced) console.log(`UNOWNED(dead) ${u.device} ${u.objectKey} referenced 0x — unreachable, reported not failed`);
  for (const d of result.ambiguousOwners) console.log(`AMBIGUOUS     ${d.device} ${d.objectKey} <- ${d.owners.join(", ")}`);
  for (const d of result.duplicateInSource) console.log(`SRC-DUPLICATE ${d.device} ${d.objectKey} x${d.sourceCount}`);
  for (const d of result.duplicateInOwner) console.log(`OWNER-DUP     ${d.device} ${d.objectKey} x${d.reconstructedCount} in ${d.selected}`);
  for (const m of result.mismatched) console.log(`MISMATCH      ${m.device} ${m.objectKey} <- ${m.selected}`);
  for (const w of result.widened) console.log(`WIDENED       ${w.device} ${w.objectKey} <- ${w.owners.join(", ")}`);
  console.log(result.ok && osConflicts.length === 0 ? "RESULT: PASS (within audited hierarchies)" : "RESULT: FAIL");
  return result.ok && osConflicts.length === 0 ? 0 : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main().then((code) => {
    process.exitCode = code;
  });
}
