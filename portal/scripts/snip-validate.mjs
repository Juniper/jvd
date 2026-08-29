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
import { parseSnip, CODES } from "./snip-parse.mjs";

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
  CODES.MISSING_SEEN_ON_BUCKET,
  CODES.MISSING_SEEN_ON_SECTION,
]);

/**
 * severity(code, { changed, seenOnValidation }) -> "error" | "warn".
 * - changed/new snip: any finding is an error (must satisfy the full contract).
 * - legacy + partial: warn (grandfathered).
 * - legacy + complete: only Seen-on applicability findings escalate to error;
 *   the flag describes Seen-on integrity, not the whole contract.
 */
export function severity(code, { changed, seenOnValidation }) {
  if (changed) return "error";
  if (seenOnValidation === "complete" && APPLICABILITY_CODES.has(code)) return "error";
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

/** Extract JVD template variables (uppercase-led $VARS) from a body. */
export function bodyVariables(body) {
  const set = new Set();
  for (const m of body.matchAll(/\$[A-Z][A-Z0-9_]*/g)) set.add(m[0]);
  return set;
}

/** Declared variable names, split on "/" for combined declarations. */
function declaredVariables(variables) {
  const set = new Set();
  for (const v of variables || []) {
    for (const part of v.name.split("/")) {
      const t = part.trim();
      if (t) set.add(t);
    }
  }
  return set;
}

/**
 * Validate one snip's text. Returns typed findings (code + detail), before
 * severity classification. `inventory` and `snipIndex` (Set of resolvable
 * "<os>/<category>/<name>.conf" for the JVD) enable the context-dependent checks.
 */
export function validateSnipText(text, { inventory, snipIndex } = {}) {
  const { header, body, diagnostics } = parseSnip(text);
  const findings = [...diagnostics];
  if (!header) return findings;

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

  // PAIR_WITH_UNRESOLVED — every declared path must resolve to a real snip.
  if (snipIndex) {
    for (const raw of header.pairWith) {
      const p = raw.replace(/^-\s*/, "").split(/\s+/)[0].replace(/[(),;]+$/, "");
      if (!p || p.toLowerCase() === "none") continue;
      if (!snipIndex.has(p)) findings.push({ code: CODES.PAIR_WITH_UNRESOLVED, detail: p });
    }
  }

  // VARIABLE_UNDECLARED / VARIABLE_UNUSED
  const used = bodyVariables(body);
  const declared = declaredVariables(header.variables);
  for (const v of used) if (!declared.has(v)) findings.push({ code: CODES.VARIABLE_UNDECLARED, detail: v });
  for (const v of declared) if (!used.has(v)) findings.push({ code: CODES.VARIABLE_UNUSED, detail: v });

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

/** JVD root dir for a snip path (…/<jvd>/configuration/snips/…). */
function jvdRootForSnip(absPath) {
  const parts = absPath.split(path.sep);
  const ci = parts.indexOf("configuration");
  if (ci <= 0) return null;
  return parts.slice(0, ci).join(path.sep);
}

/** Parse + validate _snip-library.json content. Throws on malformed metadata. */
export function parseSnipLibraryMeta(raw, label = "_snip-library.json") {
  let meta;
  try {
    meta = JSON.parse(raw);
  } catch (e) {
    throw new Error(`${label}: invalid JSON (${e.message})`);
  }
  if (meta.schemaVersion !== 1) throw new Error(`${label}: unsupported schemaVersion ${JSON.stringify(meta.schemaVersion)}`);
  if (meta.seenOnValidation !== "partial" && meta.seenOnValidation !== "complete") {
    throw new Error(`${label}: invalid seenOnValidation ${JSON.stringify(meta.seenOnValidation)}`);
  }
  return meta.seenOnValidation;
}

async function readSeenOnValidation(jvdRoot) {
  const p = path.join(jvdRoot, "configuration", "snips", "_snip-library.json");
  let raw;
  try {
    raw = await fs.readFile(p, "utf8");
  } catch (e) {
    if (e.code === "ENOENT") return "partial"; // genuinely absent = default partial
    throw e;
  }
  return parseSnipLibraryMeta(raw, p);
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
  const sovCache = new Map();
  const indexCache = new Map(); // jvdRoot -> Set of "<os>/<category>/<name>.conf"

  // Pre-build per-JVD snip index for Pair-with resolution.
  for (const f of files) {
    const jvdRoot = jvdRootForSnip(f);
    if (!jvdRoot) continue;
    if (!indexCache.has(jvdRoot)) indexCache.set(jvdRoot, new Set());
    const rel = f.split(path.sep).join("/");
    const i = rel.indexOf("/snips/");
    indexCache.get(jvdRoot).add(rel.slice(i + "/snips/".length));
  }

  let errors = 0;
  let warns = 0;
  const lines = [];

  for (const f of files) {
    const jvdRoot = jvdRootForSnip(f);
    if (!jvdRoot) continue;
    if (!invCache.has(jvdRoot)) invCache.set(jvdRoot, await buildInventory(jvdRoot));
    if (!sovCache.has(jvdRoot)) sovCache.set(jvdRoot, await readSeenOnValidation(jvdRoot));
    const inventory = invCache.get(jvdRoot);
    const seenOnValidation = sovCache.get(jvdRoot);
    const snipIndex = indexCache.get(jvdRoot);

    const rel = path.relative(REPO_ROOT, f).split(path.sep).join("/");
    const isChanged = allStrict || (changed ? changed.has(rel) : false);

    const text = await fs.readFile(f, "utf8");
    const findings = validateSnipText(text, { inventory, snipIndex });
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
