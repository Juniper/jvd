import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateMatrix, formDevices, closeTuple } from "./composition-validate.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const MATRIX = JSON.parse(
  fs.readFileSync(
    path.join(REPO_ROOT, "service_provider/metro_ethernet_business_services/configuration/snips/_composition.json"),
    "utf8",
  ),
);

const snip = (rel, seenOn = { junos: ["d1"], evo: [] }) => [rel, { rel, dir: rel.split("/")[0], seenOn, body: "" }];
const idxOf = (...rels) => new Map(rels.map((r) => snip(r)));
const base = () => ({
  roles: { an: "access node" },
  forms: [
    {
      id: "f1",
      family: "e-line",
      aliases: ["Form One"],
      osMode: "MIXED",
      roles: ["an"],
      entry: { junos: ["junos/a.conf"], evo: [] },
      tiers: ["minimum"],
      status: "supported",
    },
  ],
});

test("the shipped MEBS matrix validates against the live snip tree", async () => {
  const { loadJvd } = await import("./object-ownership.mjs");
  const { snips } = await loadJvd(path.join(REPO_ROOT, "service_provider/metro_ethernet_business_services"));
  assert.deepEqual(validateMatrix(MATRIX, new Map(snips.map((s) => [s.rel, s]))), []);
});

test("every MENU-advertised form appears exactly once", () => {
  const ids = MATRIX.forms.map((f) => f.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(MATRIX.forms.length, 17);
});

test("a non-supported status must carry a reason", () => {
  const m = base();
  m.forms[0].status = "incomplete";
  assert.ok(validateMatrix(m, idxOf("junos/a.conf")).some((p) => /requires a reason/.test(p)));
  m.forms[0].reason = "no entry snippet yet";
  assert.deepEqual(validateMatrix(m, idxOf("junos/a.conf")), []);
});

test("an unsupported form stays visible rather than disappearing", () => {
  const incomplete = MATRIX.forms.filter((f) => f.status !== "supported");
  assert.ok(incomplete.length > 0);
  for (const f of incomplete) assert.ok(f.reason && f.reason.length > 10);
});

test("a pattern entry can never count as supported", () => {
  const m = base();
  m.forms[0].entry.junos = ["junos/interfaces/ifd-ae-lacp*.conf"];
  assert.ok(validateMatrix(m, idxOf("junos/a.conf")).some((p) => /pattern entry/.test(p)));
});

test("an entry snippet that does not resolve fails validation", () => {
  const m = base();
  assert.ok(validateMatrix(m, new Map()).some((p) => /does not resolve/.test(p)));
});

test("a supported form with no entry snippet fails validation", () => {
  const m = base();
  m.forms[0].entry = { junos: [], evo: [] };
  assert.ok(validateMatrix(m, new Map()).some((p) => /no entry snippet/.test(p)));
});

test("duplicate ids and conflicting aliases fail validation", () => {
  const m = base();
  m.forms.push({ ...m.forms[0] });
  const p = validateMatrix(m, idxOf("junos/a.conf"));
  assert.ok(p.some((x) => /duplicate form id/.test(x)));
  assert.ok(p.some((x) => /claimed by/.test(x)));
});

test("an unknown role fails validation", () => {
  const m = base();
  m.forms[0].roles = ["nope"];
  assert.ok(validateMatrix(m, idxOf("junos/a.conf")).some((p) => /not in the role vocabulary/.test(p)));
});

test("a single-OS form may not declare an entry for the other OS", () => {
  const m = base();
  m.forms[0].osMode = "EVO";
  assert.ok(validateMatrix(m, idxOf("junos/a.conf")).some((p) => /osMode EVO but has a Junos entry/.test(p)));
});

test("MIXED stays a constraint and is never resolved by the matrix itself", () => {
  const mixed = MATRIX.forms.filter((f) => f.osMode === "MIXED" && f.status === "supported");
  assert.ok(mixed.length > 0);
  // A MIXED form carries entries for both sides, or records why it does not.
  for (const f of mixed) {
    const both = (f.entry.junos || []).length > 0 && (f.entry.evo || []).length > 0;
    assert.ok(both || f.note, `${f.id}: one-sided MIXED form must explain itself`);
  }
});

test("a paired construct must name a real form or a variant requirement", () => {
  const m = base();
  m.forms[0].pairedConstructs = ["does-not-exist"];
  assert.ok(validateMatrix(m, idxOf("junos/a.conf")).some((p) => /is not a form id/.test(p)));
  m.forms[0].pairedConstructs = ["variant:mebs-bgp-overlay families=evpn"];
  assert.deepEqual(validateMatrix(m, idxOf("junos/a.conf")), []);
});

test("devices are resolved from Seen-on, never restated in the matrix", () => {
  for (const f of MATRIX.forms) {
    assert.equal(f.devices, undefined, `${f.id} must not restate devices`);
  }
  const index = new Map([snip("junos/a.conf", { junos: ["d1", "d2"], evo: ["d3"] })]);
  const devs = formDevices({ entry: { junos: ["junos/a.conf"], evo: [] } }, index);
  assert.deepEqual(
    devs.map((d) => `${d.os}:${d.device}`),
    ["evo:d3", "junos:d1", "junos:d2"],
  );
});

test("tuple closure fails closed on an unresolvable dependency", () => {
  const index = new Map([snip("junos/a.conf"), snip("junos/dep.conf", { junos: ["other"], evo: [] })]);
  const headers = new Map([
    ["junos/a.conf", { pairWith: ["- junos/dep.conf"] }],
    ["junos/dep.conf", { pairWith: [] }],
  ]);
  const constructs = new Map([
    ["junos/a.conf", { references: [] }],
    ["junos/dep.conf", { references: [] }],
  ]);
  const r = closeTuple({
    entries: ["junos/a.conf"],
    device: "d1",
    os: "junos",
    snipIndex: index,
    headers,
    constructs,
    variantMembers: [],
    definers: new Map(),
  });
  assert.equal(r.failures.length, 1);
  assert.equal(r.failures[0].kind, "dependency-unavailable");
});

test("tuple closure is order-independent and de-duplicates", () => {
  const index = new Map([snip("junos/a.conf"), snip("junos/b.conf")]);
  const headers = new Map([
    ["junos/a.conf", { pairWith: ["- junos/b.conf"] }],
    ["junos/b.conf", { pairWith: ["- junos/a.conf"] }],
  ]);
  const constructs = new Map([
    ["junos/a.conf", { references: [] }],
    ["junos/b.conf", { references: [] }],
  ]);
  const args = { device: "d1", os: "junos", snipIndex: index, headers, constructs, variantMembers: [], definers: new Map() };
  const one = closeTuple({ entries: ["junos/a.conf"], ...args });
  const two = closeTuple({ entries: ["junos/b.conf"], ...args });
  assert.deepEqual(one.included, two.included);
  assert.deepEqual(one.included, ["junos/a.conf", "junos/b.conf"]);
});
