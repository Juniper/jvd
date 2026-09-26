import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PORTAL = path.resolve(HERE, "..");
const BUNDLE = path.join(PORTAL, "src", "data", "snips.json");
const EXPORT = path.join(PORTAL, "public", "snips.json");

const read = (p) => JSON.parse(readFileSync(p, "utf8"));

// Recomputed independently of the generator. A verifier that imported the
// generator's own helper would agree with it even when both are wrong.
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    const out = {};
    for (const k of Object.keys(value).sort()) out[k] = canonical(value[k]);
    return out;
  }
  return value;
}
const digestOf = (v) =>
  createHash("sha256").update(JSON.stringify(canonical(v)), "utf8").digest("hex");

const NON_RECORD = ["bodyHtml", "recordSha256", "parseWarnings"];
const recordDigest = (r) =>
  digestOf(Object.fromEntries(Object.entries(r).filter(([k]) => !NON_RECORD.includes(k))));

const DIGEST_EXCLUDED = ["generatedAt", "exportDigest", "publishedCommit"];
const exportSubject = (b) =>
  Object.fromEntries(Object.entries(b).filter(([k]) => !DIGEST_EXCLUDED.includes(k)));

/* ------------------------------ the export ------------------------------- */

test("the published export exists and is a superset-free lean copy", () => {
  const bundle = read(BUNDLE);
  const exp = read(EXPORT);
  assert.equal(exp.snips.length, bundle.snips.length);
  assert.equal(exp.parseWarnings, undefined, "build diagnostics must not be published");
  for (const s of exp.snips) assert.equal(s.bodyHtml, undefined, `${s.id} carries bodyHtml`);
});

test("the export keeps every field of every record, bar presentation", () => {
  // A sample proves nothing about the other thousand records, and dropping one
  // field from one record is exactly how applicability goes missing.
  const bundle = read(BUNDLE);
  const exp = read(EXPORT);
  const byId = new Map(exp.snips.map((s) => [s.id, s]));
  for (const source of bundle.snips) {
    const published = byId.get(source.id);
    assert.ok(published, `${source.id} missing from the export`);
    const { bodyHtml, parseWarnings, ...expected } = source;
    assert.equal(
      JSON.stringify(published),
      JSON.stringify(expected),
      `${source.id} differs between bundle and export`,
    );
  }
});

test("the export digest verifies when recomputed independently", () => {
  const exp = read(EXPORT);
  assert.equal(digestOf(exportSubject(exp)), exp.exportDigest);
});

test("the export digest ignores the timestamp and the deployment stamp", () => {
  // Otherwise identical content would hash differently every run, and stamping
  // at deploy time would invalidate what it stamped.
  const exp = read(EXPORT);
  const moved = { ...exp, generatedAt: "1999-01-01T00:00:00.000Z", publishedCommit: "deadbeef" };
  assert.equal(digestOf(exportSubject(moved)), exp.exportDigest);
});

test("tampering with the export is detectable", () => {
  const exp = read(EXPORT);
  for (const mutate of [
    (b) => (b.snips[0].body += "\nset system host-name attacker"),
    (b) => b.snips[0].seenOn.evo.push("ghost_device"),
    (b) => (b.snips[0].id += "-renamed"),
  ]) {
    const t = structuredClone(exp);
    mutate(t);
    assert.notEqual(digestOf(exportSubject(t)), exp.exportDigest);
  }
});

/* ---------------------------- record provenance -------------------------- */

test("every record's digest verifies when recomputed independently", () => {
  const snips = read(BUNDLE).snips;
  assert.ok(snips.length > 1000, `only ${snips.length} snips`);
  for (const s of snips) {
    assert.equal(recordDigest(s), s.recordSha256, `${s.id} digest does not verify`);
  }
});

test("a record digest covers metadata, not only the body", () => {
  // A changed Seen-on row decides which device a snip lands on. A body-only
  // hash would pass it through silently.
  const s = read(BUNDLE).snips.find((x) => x.seenOn?.evo?.length && x.pairWith?.length);
  assert.ok(s, "no record with applicability and dependencies to check");
  for (const mutate of [
    (r) => r.seenOn.evo.push("ghost_device"),
    (r) => r.pairWith.pop(),
    (r) => (r.id += "-renamed"),
    (r) => (r.path += ".bak"),
  ]) {
    const t = structuredClone(s);
    mutate(t);
    assert.notEqual(recordDigest(t), s.recordSha256);
  }
});

test("a record digest ignores pre-rendered presentation", () => {
  const s = read(BUNDLE).snips[0];
  const t = structuredClone(s);
  t.bodyHtml = "<pre>rendered differently</pre>";
  assert.equal(recordDigest(t), s.recordSha256);
});

/* ------------------------ the source digest's scope ---------------------- */

test("the source digest is recomputable from the whole .conf files", () => {
  const bundle = read(BUNDLE);
  const repoRoot = path.resolve(PORTAL, "..");
  const whole = bundle.snips
    .map((s) => [s.path, readFileSync(path.join(repoRoot, s.path), "utf8")])
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  const recomputed = createHash("sha256")
    .update(whole.map(([rel, text]) => `${rel}\n${text}`).join("\n\u0000\n"), "utf8")
    .digest("hex");
  assert.equal(recomputed, bundle.snippetSourceDigest);
});

test("the source digest is not a body-only digest", () => {
  // The earlier implementation hashed parsed bodies, which left Seen-on and
  // Pair-with -- both header-only -- outside a digest named for the sources.
  // This asserts the two are distinguishable, so that version cannot pass.
  const bundle = read(BUNDLE);
  const bodyOnly = createHash("sha256")
    .update(
      bundle.snips
        .map((s) => `${s.path}\n${s.body}`)
        .sort()
        .join("\n\u0000\n"),
      "utf8",
    )
    .digest("hex");
  assert.notEqual(bodyOnly, bundle.snippetSourceDigest);
});

/* ------------------------- the gate actually gates ----------------------- */

test("--check fails on a stale export and does not repair it", () => {
  const original = readFileSync(EXPORT, "utf8");
  try {
    const stale = JSON.parse(original);
    stale.counts = { ...stale.counts, total: stale.counts.total + 1 };
    writeFileSync(EXPORT, JSON.stringify(stale, null, 2) + "\n");
    const r = spawnSync("node", [path.join(HERE, "generate-snips.mjs"), "--check"], {
      encoding: "utf8",
    });
    assert.notEqual(r.status, 0, "--check passed on a stale export");
    assert.match(`${r.stderr}${r.stdout}`, /public\/snips\.json is missing or out of date/);
    assert.equal(
      readFileSync(EXPORT, "utf8"),
      JSON.stringify(stale, null, 2) + "\n",
      "--check rewrote the export instead of reporting it",
    );
  } finally {
    writeFileSync(EXPORT, original);
  }
});

test("--check fails on a missing export", () => {
  const original = readFileSync(EXPORT, "utf8");
  try {
    rmSync(EXPORT);
    const r = spawnSync("node", [path.join(HERE, "generate-snips.mjs"), "--check"], {
      encoding: "utf8",
    });
    assert.notEqual(r.status, 0, "--check passed with no export at all");
  } finally {
    writeFileSync(EXPORT, original);
  }
});
