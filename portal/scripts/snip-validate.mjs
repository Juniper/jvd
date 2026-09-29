#!/usr/bin/env node
/**
 * snip-validate.mjs — deterministic enforcement of SNIP-CONTRACT.md.
 *
 * Shares the parser with generate-snips.mjs (./snip-parse.mjs) so parsing and
 * validation have a single source of truth. Severity is two-level:
 *   - a NEW or CHANGED snip must satisfy the whole contract (findings = errors);
 *   - a legacy (unchanged) snip is grandfathered while its JVD's
 *     _snip-library.json says seenOnValidation: "partial" (findings = warnings),
 *     and becomes strict once that flips to "complete".
 *
 * Usage:
 *   node portal/scripts/snip-validate.mjs                 # validate all; changed vs origin/main are strict
 *   node portal/scripts/snip-validate.mjs --base <ref>    # pick the diff base
 *   node portal/scripts/snip-validate.mjs --all-strict    # treat every snip as strict
 */

import { promises as fs } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseSnip, CODES, VARIANT_FAMILIES, classifySelector } from "./snip-parse.mjs";
import { extractBgpCapabilities } from "./bgp-capabilities.mjs";
import { extractIflCapabilities } from "./ifl-capabilities.mjs";
import { extractGrCapabilities } from "./gr-capabilities.mjs";
import { extractConfiguredCapabilities, configuredCapabilityProblems, capabilityRequirementProblems, capabilityFacts } from "./transport-capabilities.mjs";
import { resolveVariant, groupHasMembers, bodyIdentity } from "./variant-resolve.mjs";
import { extractConstructs } from "./config-references.mjs";
import { resolveDependency, dependencyPath } from "./dependency-resolve.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");

// The seenOnValidation ratchet governs Seen-on APPLICABILITY only. Other
// contract debt (Topic, Variables, Pair-with, ...) is enforced on change, not
// escalated by flipping a JVD to "complete".
const APPLICABILITY_CODES = new Set([
  CODES.MISSING_HEADER,
  CODES.SEEN_ON_APPROXIMATION,
  CODES.SEEN_ON_UNKNOWN_DEVICE,
  CODES.SEEN_ON_NON_DEVICE_TOKEN,
  CODES.SEEN_ON_NATIVE_EMPTY,
  CODES.MISSING_SEEN_ON_BUCKET,
  CODES.MISSING_SEEN_ON_SECTION,
]);

// Variant relationship integrity is a completeness property, not Seen-on debt:
// once a JVD is `complete`, every variant finding is an error regardless of
// whether the member or consumer file itself changed.
const VARIANT_CODES = new Set([
  CODES.VARIANT_MALFORMED,
  CODES.VARIANT_PROVIDES_UNKNOWN_FAMILY,
  CODES.VARIANT_PROVIDES_MISMATCH,
  CODES.VARIANT_UNKNOWN_NAMESPACE,
  CODES.VARIANT_UNKNOWN_CAPABILITY,
  CODES.VARIANT_MIXED_SELECTOR,
  CODES.VARIANT_UNRESOLVED,
  CODES.VARIANT_AMBIGUOUS,
  CODES.VARIANT_DEVICE_OVERLAP,
  CODES.VARIANT_GROUP_EMPTY,
]);

const VARIANT_FAMILY_SET = new Set(VARIANT_FAMILIES);

/**
 * severity(code, { changed, seenOnValidation }) -> "error" | "warn".
 * - changed/new snip: any finding is an error (must satisfy the full contract).
 * - legacy + partial: warn (grandfathered).
 * - legacy + complete: Seen-on applicability findings and all variant-integrity
 *   findings escalate to error; other contract debt stays a warning.
 */
export function severity(code, { changed, seenOnValidation }) {
  if (code.startsWith("COUNT_") || code.startsWith("PEERS_")) return "error";
  // A cross-directory selection is evidence-backed and legitimate; it is
  // surfaced so audits can see it, never to block.
  if (code === CODES.VARIANT_CROSS_DIRECTORY) return "warn";
  if (changed) return "error";
  if (seenOnValidation === "complete" && (APPLICABILITY_CODES.has(code) || VARIANT_CODES.has(code))) return "error";
  return "warn";
}

/** Build a device inventory from a JVD's configuration/conf tree (recursive). */
export async function buildInventory(jvdRoot) {
  const confDir = path.join(jvdRoot, "configuration", "conf");
  const relSet = new Set();
  const basenameCount = new Map();
  async function walk(dir, base) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch (e) {
      if (e.code === "ENOENT") return;
      throw e;
    }
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name.startsWith(".")) continue;
        await walk(full, base ? `${base}/${ent.name}` : ent.name);
      } else if (ent.isFile() && ent.name.endsWith(".conf")) {
        const stem = ent.name.slice(0, -".conf".length);
        const rel = base ? `${base}/${stem}` : stem;
        relSet.add(rel);
        basenameCount.set(stem, (basenameCount.get(stem) || 0) + 1);
      }
    }
  }
  await walk(confDir, "");
  return { relSet, basenameCount };
}

/** Resolve a Seen-on token: valid iff it maps to exactly one source config. */
export function resolveToken(tok, inventory) {
  if (inventory.relSet.has(tok)) return "ok"; // exact relative path (scenario-qualified or flat)
  const n = inventory.basenameCount.get(tok) || 0;
  if (n === 1) return "ok"; // unique basename
  if (n > 1) return "ambiguous";
  return "unknown";
}

/**
 * Canonicalize a template-variable token so its braced and bare spellings are
 * one logical name: `$FOO` and `${FOO}` both normalize to `$FOO`.
 */
export function normalizeVar(tok) {
  return tok.replace(/[{}]/g, "");
}

/** Extract JVD template variables (uppercase-led $VARS, braced or bare) from a body. */
export function bodyVariables(body) {
  const set = new Set();
  for (const m of body.matchAll(/\$\{[A-Z][A-Z0-9_]*\}|\$[A-Z][A-Z0-9_]*/g)) set.add(normalizeVar(m[0]));
  return set;
}

/** Declared variable names, split on "/" for combined declarations (braced or bare). */
function declaredVariables(variables) {
  const set = new Set();
  for (const v of variables || []) {
    for (const part of v.name.split("/")) {
      const t = normalizeVar(part.trim());
      if (t) set.add(t);
    }
  }
  return set;
}

/**
 * Member validation: a member's declared `Provides:` must equal the selectable
 * capability set structurally present in its body. Unknown declared families are
 * reported separately by the parser (VARIANT_PROVIDES_UNKNOWN_FAMILY), so the
 * mismatch check compares only the valid declared families against the body.
 *
 * A member publishes exactly one selector vocabulary. When it declares
 * namespaced capabilities the comparison runs against the matching structural
 * scanner instead of the BGP one; mixing is rejected by the parser.
 */
export function validateVariantMember({ variantGroup, body, capabilityRequirements = {} }) {
  const findings = [];
  if (!variantGroup) return findings;
  const tokens = variantGroup.provides || [];
  const kinds = tokens.map((t) => classifySelector(t));
  const declaredCaps = new Set(tokens.filter((_, i) => kinds[i].kind === "capability"));
  if (declaredCaps.size > 0) {
    const actual = new Set([
      ...extractIflCapabilities(body || ""),
      ...extractGrCapabilities(body || ""),
      ...extractConfiguredCapabilities(body || "", capabilityRequirements[variantGroup.name]),
    ]);
    const equal = declaredCaps.size === actual.size && [...actual].every((c) => declaredCaps.has(c));
    if (!equal) {
      findings.push({
        code: CODES.VARIANT_PROVIDES_MISMATCH,
        detail: `declared=[${[...declaredCaps].join(",")}] body=[${[...actual].join(",")}]`,
      });
    }
    return findings;
  }
  const declared = new Set(tokens.filter((f) => VARIANT_FAMILY_SET.has(f)));
  const actual = new Set(extractBgpCapabilities(body || ""));
  const equal = declared.size === actual.size && [...actual].every((c) => declared.has(c));
  if (!equal) {
    findings.push({
      code: CODES.VARIANT_PROVIDES_MISMATCH,
      detail: `declared=[${[...declared].join(",")}] body=[${[...actual].join(",")}]`,
    });
  }
  return findings;
}

/**
 * Consumer validation: for every device in BOTH of the consumer's exact
 * `Seen on:` buckets — each keyed by its own bucket OS — every atomic variant
 * requirement must resolve to exactly one member. The consumer file's
 * directory OS never suppresses the other bucket (cross-OS Seen-on is common
 * for MEBS services). A referenced group with no members anywhere in this JVD
 * is GROUP_EMPTY; a group that exists but matches no OS/device/families is
 * UNRESOLVED; more than one is AMBIGUOUS. All fail closed.
 */
export function validateVariantConsumer({ os, seenOn, variantRequires, jvd, members }) {
  const findings = [];
  if (!variantRequires || variantRequires.length === 0) return findings;
  for (const req of variantRequires) {
    if (!groupHasMembers({ group: req.group, consumerJvd: jvd, members })) {
      findings.push({ code: CODES.VARIANT_GROUP_EMPTY, detail: `${req.group} (${os})` });
      continue;
    }
    for (const bucketOS of ["junos", "evo"]) {
      const devices = (seenOn && seenOn[bucketOS]) || [];
      for (const dev of devices) {
        const r = resolveVariant({
          group: req.group,
          selectors: req.families,
          targetDevice: dev,
          targetOS: bucketOS,
          consumerJvd: jvd,
          members,
        });
        const keyword = (req.families || []).some((t) => classifySelector(t).kind === "capability")
          ? "capabilities"
          : "families";
        const detail = `${req.group} ${dev} ${keyword}=${req.families.join(",")}`;
        if (r.status === "unavailable") findings.push({ code: CODES.VARIANT_UNRESOLVED, detail });
        else if (r.status === "ambiguous") findings.push({ code: CODES.VARIANT_AMBIGUOUS, detail });
        else if (r.crossDirectory)
          findings.push({
            code: CODES.VARIANT_CROSS_DIRECTORY,
            detail: `${detail} -> ${r.member.rel} (stored under ${r.member.os})`,
          });
      }
    }
  }
  return findings;
}

/**
 * Group validation: within one JVD and group, a target device must map to at
 * most one distinct emitted body — evaluated across BOTH storage directories,
 * because storage is not part of applicability. Two members naming the same
 * device in the same target-OS row are duplicate representations when their
 * normalized bodies match, and an overlap when they differ. `otherOsFormId` is
 * never consulted. Returns overlap findings for the member identified by
 * `selfRel`.
 */
export function validateVariantOverlap({ os, variantGroup, seenOn, selfRel, members }) {
  const findings = [];
  if (!variantGroup || !members) return findings;
  const self = members.find((m) => m.rel === selfRel);
  const selfId = self?.bodyId ?? null;
  for (const bucket of ["junos", "evo"]) {
    for (const dev of (seenOn && seenOn[bucket]) || []) {
      const clash = members.some(
        (m) =>
          m.rel !== selfRel &&
          m.group === variantGroup.name &&
          (m.seenOn?.[bucket] || []).includes(dev) &&
          // Identical emitted bodies are one representation, not a clash.
          (selfId === null || m.bodyId === undefined || m.bodyId !== selfId),
      );
      if (clash)
        findings.push({
          code: CODES.VARIANT_DEVICE_OVERLAP,
          detail: `${dev} in ${variantGroup.name} (${bucket})`,
        });
    }
  }
  return findings;
}

/**
 * Validate one snip's text. Returns typed findings (code + detail), before
 * severity classification. `inventory` and `snipIndex` (Set of resolvable
 * "<os>/<category>/<name>.conf" for the JVD) enable the context-dependent checks.
 * `os`, `jvd`, `members`, and `selfRel` enable cross-snip variant checks.
 */
export function validateSnipText(text, { inventory, snipIndex, os, jvd, members, selfRel, capabilityRequirements = {}, countValidation, peersValidation, enforceEvidenceEnrollment = false, dependencyIndex } = {}) {
  const { header, body, diagnostics } = parseSnip(text);
  const findings = [...diagnostics];
  if (!header) return findings;

  if (enforceEvidenceEnrollment && header.count && !countValidation) findings.push({ code: "COUNT_NOT_ENROLLED" });
  if (enforceEvidenceEnrollment && header.peersWith && !peersValidation) findings.push({ code: "PEERS_NOT_ENROLLED" });
  if (countValidation === "complete" && !header.count) findings.push({ code: CODES.COUNT_MISSING_HEADER });
  if (peersValidation === "complete" && !header.peersWith) findings.push({ code: CODES.PEERS_MISSING_HEADER });
  const seenDevices = new Set([...header.seenOn.junos, ...header.seenOn.evo]);
  if (header.count) {
    const countDevices = Object.keys(header.count.byDevice);
    if (countDevices.length !== seenDevices.size || countDevices.some((device) => !seenDevices.has(device))) {
      findings.push({ code: CODES.COUNT_SEEN_ON_MISMATCH, detail: "nonzero Count devices must equal Seen on" });
    }
    if (inventory) {
      for (const device of countDevices) {
        if (resolveToken(device, inventory) !== "ok") findings.push({ code: CODES.COUNT_UNKNOWN_DEVICE, detail: device });
      }
    }
  }
  for (const group of header.peersWith?.groups || []) {
    if (inventory) {
      for (const device of [...group.left, ...group.right]) {
        if (resolveToken(device, inventory) !== "ok") findings.push({ code: CODES.PEERS_UNKNOWN_DEVICE, detail: device });
      }
    }
    for (const left of group.left) {
      for (const right of group.right) {
        if (!seenDevices.has(left) && !seenDevices.has(right)) {
          findings.push({ code: CODES.PEERS_NOT_APPLICABLE_DEVICE, detail: `${left} <-> ${right}` });
        }
      }
    }
  }

  // SEEN_ON_UNKNOWN_DEVICE — resolve each device token against the inventory.
  if (inventory) {
    for (const bucket of ["junos", "evo"]) {
      for (const tok of header.seenOn[bucket]) {
        if (tok === "see" || tok.endsWith(".conf")) continue; // already SEEN_ON_NON_DEVICE_TOKEN
        const r = resolveToken(tok, inventory);
        if (r !== "ok") findings.push({ code: CODES.SEEN_ON_UNKNOWN_DEVICE, detail: `${bucket}: ${tok} (${r})` });
      }
    }
  }

  // SEEN_ON_NATIVE_EMPTY — an OS-specific snip must list at least one device in
  // its own-OS bucket (a `junos/**` snip needs a Junos device; `evo/**` an EVO
  // device). Cross-OS entries stay legal as long as the native bucket is filled.
  if (os && Array.isArray(header.seenOn?.[os]) && header.seenOn[os].length === 0) {
    findings.push({ code: CODES.SEEN_ON_NATIVE_EMPTY, detail: `${os} bucket is empty` });
  }

  // PAIR_WITH_UNRESOLVED — every declared path must resolve to a real snip.
  if (snipIndex) {
    for (const raw of header.pairWith) {
      const p = raw.replace(/^-\s*/, "").split(/\s+/)[0].replace(/[(),;]+$/, "");
      if (!p || p.toLowerCase() === "none") continue;
      if (!snipIndex.has(p)) findings.push({ code: CODES.PAIR_WITH_UNRESOLVED, detail: p });
    }
  }

  if (dependencyIndex) {
    const constructs = extractConstructs(body);
    const requirements = constructs.references.filter(reference => reference.kind === "route-distinguisher-id");
    if (Object.values(capabilityRequirements).some(selectors => selectors && Object.hasOwn(selectors, 'cos:schedulers'))) {
      requirements.push(...capabilityFacts(body).requiredSchedulers.map(name => ({ kind: 'scheduler', name })));
    }
    for (const requirement of requirements) {
      const defines = candidate => requirement.kind === 'scheduler'
        ? extractConfiguredCapabilities(candidate, { 'cos:schedulers': { schedulers: [requirement.name] } }).includes('cos:schedulers')
        : extractConstructs(candidate).definitions.filter(definition => definition.kind === requirement.kind && definition.name === requirement.name).length === 1;
      if (defines(body)) continue;
      for (const targetOS of ["junos", "evo"]) for (const targetDevice of header.seenOn[targetOS]) {
        const supplied = header.pairWith.some(bullet => {
          const targetRel = dependencyPath(bullet);
          if (!targetRel) return false;
          const resolution = resolveDependency({ targetRel, targetDevice, targetOS, index: dependencyIndex });
          return resolution.status === "ok" && defines(dependencyIndex.get(resolution.selected).body);
        }) || (requirement.kind === 'scheduler' && header.variantRequires.some(request => {
          const resolution = resolveVariant({ group: request.group, selectors: request.families, consumerJvd: jvd, targetDevice, targetOS, members: members ?? [] });
          if (resolution.status !== 'ok') return false;
          const provider = dependencyIndex.get(resolution.member.snipRel ?? resolution.member.rel);
          return !!provider && defines(provider.body) && validateVariantMember({ variantGroup: { name: resolution.member.group, provides: resolution.member.provides }, body: provider.body, capabilityRequirements }).length === 0;
        }));
        if (!supplied) findings.push({ code: "PAIR_WITH_MISSING_REQUIREMENT", detail: `${requirement.kind}:${requirement.name} on ${targetDevice} (${targetOS})` });
      }
    }
  }

  // VARIABLE_UNDECLARED / VARIABLE_UNUSED
  const used = bodyVariables(body);
  const declared = declaredVariables(header.variables);
  for (const v of used) if (!declared.has(v)) findings.push({ code: CODES.VARIABLE_UNDECLARED, detail: v });
  for (const v of declared) if (!used.has(v)) findings.push({ code: CODES.VARIABLE_UNUSED, detail: v });

  // Variant member integrity (declared Provides == structural capabilities).
  for (const fd of validateVariantMember({ variantGroup: header.variantGroup, body, capabilityRequirements })) findings.push(fd);
  for (const detail of configuredCapabilityProblems(header, body, capabilityRequirements)) findings.push({ code: CODES.VARIANT_PROVIDES_MISMATCH, detail });

  // Cross-snip variant checks require JVD context (os + members).
  if (os && members) {
    for (const fd of validateVariantOverlap({ os, variantGroup: header.variantGroup, seenOn: header.seenOn, selfRel, members })) {
      findings.push(fd);
    }
    for (const fd of validateVariantConsumer({ os, seenOn: header.seenOn, variantRequires: header.variantRequires, jvd, members })) {
      findings.push(fd);
    }
  }

  return findings;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function isSnipConf(rel) {
  const p = rel.split("/");
  const i = p.indexOf("snips");
  return i >= 0 && (p[i + 1] === "junos" || p[i + 1] === "evo") && rel.endsWith(".conf");
}

/** OS bucket for a snip path, explicitly; null for an unexpected path. */
function osOfRel(rel) {
  if (rel.includes("/snips/junos/")) return "junos";
  if (rel.includes("/snips/evo/")) return "evo";
  return null;
}

/** JVD root dir for a snip path (…/<jvd>/configuration/snips/…). */
function jvdRootForSnip(absPath) {
  const parts = absPath.split(path.sep);
  const ci = parts.indexOf("configuration");
  if (ci <= 0) return null;
  return parts.slice(0, ci).join(path.sep);
}

/** Parse + validate _snip-library.json content. Throws on malformed metadata. */
export function parseSnipLibraryMeta(raw, label = "_snip-library.json") {
  return parseLibraryValidation(raw, label).seenOnValidation;
}

export function parseLibraryValidation(raw, label = "_snip-library.json") {
  let meta;
  try {
    meta = JSON.parse(raw);
  } catch (e) {
    throw new Error(`${label}: invalid JSON (${e.message})`);
  }
  if (!meta || typeof meta !== "object" || Array.isArray(meta) || meta.schemaVersion !== 1) throw new Error(`${label}: unsupported schemaVersion`);
  if (meta.seenOnValidation !== "partial" && meta.seenOnValidation !== "complete") {
    throw new Error(`${label}: invalid seenOnValidation ${JSON.stringify(meta.seenOnValidation)}`);
  }
  for (const field of ["countValidation", "peersValidation"]) {
    if (Object.hasOwn(meta, field) && meta[field] !== "partial" && meta[field] !== "complete") throw new Error(`${label}: invalid ${field}`);
  }
  return meta;
}

async function readSeenOnValidation(jvdRoot) {
  const p = path.join(jvdRoot, "configuration", "snips", "_snip-library.json");
  let raw;
  try {
    raw = await fs.readFile(p, "utf8");
  } catch (e) {
    if (e.code === "ENOENT") return { seenOnValidation: "partial" };
    throw e;
  }
  return parseLibraryValidation(raw, p);
}

async function walkSnips(dir, out = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name.startsWith(".") || ent.name === "node_modules") continue;
      await walkSnips(full, out);
    } else if (ent.isFile() && isSnipConf(full.split(path.sep).join("/"))) {
      out.push(full);
    }
  }
  return out;
}

function changedSet(base) {
  const names = new Set();
  const add = (out) => out.split("\n").filter(Boolean).forEach((f) => names.add(f));
  try {
    add(execFileSync("git", ["diff", "--name-only", "--diff-filter=d", `${base}...HEAD`], {
      cwd: REPO_ROOT,
      encoding: "utf8",
    }));
  } catch (e) {
    // Fail closed: an enforcement command must not silently grandfather everything.
    throw new Error(`cannot resolve validation base '${base}': ${e.message}. Pass --base <ref> or --all-strict.`);
  }
  // Include staged + unstaged working-tree changes and untracked files, so a
  // snip being authored is validated strictly regardless of commit state.
  try {
    add(execFileSync("git", ["diff", "--name-only", "--diff-filter=d", "HEAD"], { cwd: REPO_ROOT, encoding: "utf8" }));
  } catch {
    /* HEAD may be unborn */
  }
  try {
    add(execFileSync("git", ["ls-files", "--others", "--exclude-standard"], { cwd: REPO_ROOT, encoding: "utf8" }));
  } catch {
    /* ignore */
  }
  return names;
}

async function main() {
  const argv = process.argv.slice(2);
  const allStrict = argv.includes("--all-strict");
  const baseIdx = argv.indexOf("--base");
  const base = baseIdx >= 0 ? argv[baseIdx + 1] : "origin/main";

  const files = await walkSnips(REPO_ROOT);
  const changed = allStrict ? null : changedSet(base);

  const invCache = new Map();
  const capabilityCache = new Map();
  const sovCache = new Map();
  const indexCache = new Map(); // jvdRoot -> Set of "<os>/<category>/<name>.conf"
  const membersByJvd = new Map(); // jvdRoot -> [member descriptors]
  const dependenciesByJvd = new Map();

  // Pre-build per-JVD snip index for Pair-with resolution, and the variant
  // member index for cross-snip variant resolution.
  for (const f of files) {
    const jvdRoot = jvdRootForSnip(f);
    if (!jvdRoot) continue;
    if (!indexCache.has(jvdRoot)) indexCache.set(jvdRoot, new Set());
    const rel = f.split(path.sep).join("/");
    const i = rel.indexOf("/snips/");
    indexCache.get(jvdRoot).add(rel.slice(i + "/snips/".length));

    const relRepo = path.relative(REPO_ROOT, f).split(path.sep).join("/");
    const os = osOfRel(relRepo);
    const parsedForMember = parseSnip(await fs.readFile(f, "utf8"));
    const { header } = parsedForMember;
    if (!dependenciesByJvd.has(jvdRoot)) dependenciesByJvd.set(jvdRoot, new Map());
    const relative = rel.slice(i + "/snips/".length);
    dependenciesByJvd.get(jvdRoot).set(relative, { rel: relative, dir: os, seenOn: header?.seenOn, body: parsedForMember.body });
    if (os && header?.variantGroup) {
      if (!membersByJvd.has(jvdRoot)) membersByJvd.set(jvdRoot, []);
      membersByJvd.get(jvdRoot).push({
        jvd: jvdRoot,
        os,
        group: header.variantGroup.name,
        provides: header.variantGroup.provides,
        seenOn: header.seenOn,
        variantGroup: header.variantGroup,
        bodyId: bodyIdentity(parsedForMember.body),
        rel: relRepo,
        snipRel: relative,
      });
    }
  }

  let errors = 0;
  let warns = 0;
  const lines = [];

  for (const f of files) {
    const jvdRoot = jvdRootForSnip(f);
    if (!jvdRoot) continue;
    if (!invCache.has(jvdRoot)) invCache.set(jvdRoot, await buildInventory(jvdRoot));
    if (!capabilityCache.has(jvdRoot)) {
      let requirements = {};
      try { requirements = JSON.parse(await fs.readFile(path.join(jvdRoot, 'configuration/snips/_composition.json'), 'utf8')).capabilityRequirements ?? {}; }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
      const problems = capabilityRequirementProblems(requirements);
      if (problems.length) throw new Error(`${jvdRoot}: ${problems.join('; ')}`);
      capabilityCache.set(jvdRoot, requirements);
    }
    if (!sovCache.has(jvdRoot)) sovCache.set(jvdRoot, await readSeenOnValidation(jvdRoot));
    const inventory = invCache.get(jvdRoot);
    const validation = sovCache.get(jvdRoot);
    const seenOnValidation = validation.seenOnValidation;
    const snipIndex = indexCache.get(jvdRoot);

    const rel = path.relative(REPO_ROOT, f).split(path.sep).join("/");
    const isChanged = allStrict || (changed ? changed.has(rel) : false);
    const os = osOfRel(rel);

    const text = await fs.readFile(f, "utf8");
    const findings = validateSnipText(text, {
      inventory,
      snipIndex,
      os,
      jvd: jvdRoot,
      members: membersByJvd.get(jvdRoot) || [],
      selfRel: rel,
      capabilityRequirements: capabilityCache.get(jvdRoot),
      countValidation: validation.countValidation,
      peersValidation: validation.peersValidation,
      enforceEvidenceEnrollment: true,
      dependencyIndex: dependenciesByJvd.get(jvdRoot),
    });
    for (const fd of findings) {
      const sev = severity(fd.code, { changed: isChanged, seenOnValidation });
      if (sev === "error") errors++;
      else warns++;
      lines.push(`${sev === "error" ? "ERROR" : "warn "}  ${fd.code}  ${rel}${fd.detail ? `  [${fd.detail}]` : ""}`);
    }
  }

  lines.sort();
  for (const l of lines) console.log(l);
  console.log(`\n[snip-validate] ${errors} error(s), ${warns} warning(s) across ${files.length} snips.`);
  process.exit(errors > 0 ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(2);
  });
}
