import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveDependency, twinRel, dependencyPath } from "./dependency-resolve.mjs";

const snip = (rel, seenOn, body) => ({ rel, dir: rel.split("/")[0], seenOn, body });
const idx = (...snips) => new Map(snips.map((s) => [s.rel, s]));
const BODY_A = "firewall {\n    policer P {\n        then discard;\n    }\n}";
const BODY_B = "firewall {\n    policer P {\n        then accept;\n    }\n}";

test("twinRel flips the OS directory and nothing else", () => {
  assert.equal(twinRel("junos/firewall/policers.conf"), "evo/firewall/policers.conf");
  assert.equal(twinRel("evo/a/b/c.conf"), "junos/a/b/c.conf");
  assert.equal(twinRel("byoai/x.conf"), null);
});

test("dependencyPath strips the bullet and trailing prose", () => {
  assert.equal(dependencyPath("- junos/a/b.conf   (defines the thing)"), "junos/a/b.conf");
  assert.equal(dependencyPath("none"), null);
  assert.equal(dependencyPath("- none"), null);
});

// Case 1 — applicable exactly as named.
test("a target that names the device resolves to itself", () => {
  const t = snip("junos/t.conf", { junos: ["d1"], evo: [] }, BODY_A);
  const r = resolveDependency({ targetRel: "junos/t.conf", targetDevice: "d1", targetOS: "junos", index: idx(t) });
  assert.equal(r.status, "ok");
  assert.equal(r.selected, "junos/t.conf");
  assert.equal(r.viaEquivalent, false);
  assert.equal(r.crossDirectory, false);
});

// Case 2 — inapplicable as named, byte-equivalent twin applies.
test("an equivalent twin supplies the dependency and is marked", () => {
  const named = snip("junos/t.conf", { junos: ["d9"], evo: [] }, BODY_A);
  const twin = snip("evo/t.conf", { junos: [], evo: ["d1"] }, BODY_A);
  const r = resolveDependency({ targetRel: "junos/t.conf", targetDevice: "d1", targetOS: "evo", index: idx(named, twin) });
  assert.equal(r.status, "ok");
  assert.equal(r.selected, "evo/t.conf");
  assert.equal(r.viaEquivalent, true);
  assert.equal(r.crossDirectory, false);
});

test("an equivalent representation stored under the other directory is cross-directory", () => {
  const named = snip("junos/t.conf", { junos: [], evo: ["d1"] }, BODY_A);
  const r = resolveDependency({ targetRel: "junos/t.conf", targetDevice: "d1", targetOS: "evo", index: idx(named) });
  assert.equal(r.status, "ok");
  assert.equal(r.selected, "junos/t.conf");
  assert.equal(r.crossDirectory, true);
});

// Case 3 — inapplicable, and the only alternative emits a DIFFERENT body.
test("a different-body twin is never substituted", () => {
  const named = snip("junos/t.conf", { junos: ["d9"], evo: [] }, BODY_A);
  const twin = snip("evo/t.conf", { junos: [], evo: ["d1"] }, BODY_B);
  const r = resolveDependency({ targetRel: "junos/t.conf", targetDevice: "d1", targetOS: "junos", index: idx(named, twin) });
  assert.equal(r.status, "unavailable");
  assert.equal(r.alternative, "twin-differs");
});

// Case 4 — nothing applicable at all.
test("no applicable representation is unavailable", () => {
  const named = snip("junos/t.conf", { junos: ["d9"], evo: [] }, BODY_A);
  const r = resolveDependency({ targetRel: "junos/t.conf", targetDevice: "d1", targetOS: "junos", index: idx(named) });
  assert.equal(r.status, "unavailable");
  assert.equal(r.alternative, "no-twin");
});

// Case 5 — two distinct applicable bodies.
test("two applicable representations with different bodies are ambiguous", () => {
  const named = snip("junos/t.conf", { junos: ["d1"], evo: [] }, BODY_A);
  const twin = snip("evo/t.conf", { junos: ["d1"], evo: [] }, BODY_B);
  const r = resolveDependency({ targetRel: "junos/t.conf", targetDevice: "d1", targetOS: "junos", index: idx(named, twin) });
  assert.equal(r.status, "ambiguous");
  assert.deepEqual(r.members, ["evo/t.conf", "junos/t.conf"]);
});

test("two applicable representations with the same body are not ambiguous", () => {
  const named = snip("junos/t.conf", { junos: ["d1"], evo: [] }, BODY_A);
  const twin = snip("evo/t.conf", { junos: ["d1"], evo: [] }, BODY_A);
  const r = resolveDependency({ targetRel: "junos/t.conf", targetDevice: "d1", targetOS: "junos", index: idx(named, twin) });
  assert.equal(r.status, "ok");
  assert.equal(r.selected, "junos/t.conf");
  assert.deepEqual(r.equivalents, ["evo/t.conf"]);
});

test("a path that is not a snip is unresolved, not unavailable", () => {
  const r = resolveDependency({ targetRel: "junos/missing.conf", targetDevice: "d1", targetOS: "junos", index: idx() });
  assert.equal(r.status, "unresolved-path");
});

test("selection is order-independent", () => {
  const a = snip("junos/t.conf", { junos: ["d1"], evo: [] }, BODY_A);
  const b = snip("evo/t.conf", { junos: ["d1"], evo: [] }, BODY_A);
  const one = resolveDependency({ targetRel: "junos/t.conf", targetDevice: "d1", targetOS: "junos", index: idx(a, b) });
  const two = resolveDependency({ targetRel: "junos/t.conf", targetDevice: "d1", targetOS: "junos", index: idx(b, a) });
  assert.deepEqual(one, two);
});

test("line-ending differences do not make two representations distinct", () => {
  const named = snip("junos/t.conf", { junos: ["d1"], evo: [] }, BODY_A);
  const twin = snip("evo/t.conf", { junos: ["d1"], evo: [] }, BODY_A.replace(/\n/g, "\r\n"));
  assert.equal(resolveDependency({ targetRel: "junos/t.conf", targetDevice: "d1", targetOS: "junos", index: idx(named, twin) }).status, "ok");
});

test("a whole-snip dependency is not satisfied by partial body agreement", () => {
  const named = snip("junos/t.conf", { junos: ["d9"], evo: [] }, BODY_A);
  const twin = snip("evo/t.conf", { junos: [], evo: ["d1"] }, `${BODY_A}\ninterfaces {\n    et-0/0/0 {\n        mtu 9192;\n    }\n}`);
  const r = resolveDependency({ targetRel: "junos/t.conf", targetDevice: "d1", targetOS: "evo", index: idx(named, twin) });
  assert.equal(r.status, "unavailable");
  assert.equal(r.alternative, "twin-differs");
});
