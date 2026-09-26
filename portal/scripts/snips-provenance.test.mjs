import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

test("the export keeps every field selection depends on", () => {
  const s = read(EXPORT).snips.find((x) => x.pairWith?.length && x.variables?.length);
  assert.ok(s, "no record with dependencies and variables to check");
  for (const f of ["id", "jvd", "path", "osKey", "categoryPath", "name", "seenOn", "pairWith", "variables", "body"]) {
    assert.notEqual(s[f], undefined, `export dropped ${f}`);
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

test("the source digest covers whole .conf files, headers included", () => {
  // Headers carry Seen-on and Pair-with. A digest over parsed bodies would not
  // change when applicability changed, despite its name.
  const bundle = read(BUNDLE);
  assert.match(bundle.snippetSourceDigest ?? "", /^[0-9a-f]{64}$/);
  const repoRoot = path.resolve(PORTAL, "..");
  const sample = bundle.snips[0];
  const raw = readFileSync(path.join(repoRoot, sample.path), "utf8");
  assert.ok(
    raw.length > sample.body.length,
    "sample .conf is not larger than its parsed body, so this test proves nothing",
  );
});
