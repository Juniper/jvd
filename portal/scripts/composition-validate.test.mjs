import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateMatrix, formDevices, closeTuple, resolveRole } from "./composition-validate.mjs";

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

// --- role parameters vs correlated identities ---

const roleMatrix = {
  roles: { an: "a" },
  forms: [],
  identityVariables: { constructs: ["policy-statement:$INSTANCE_NAME"] },
  roleBindings: {
    bindings: [
      {
        construct: "community:$COLOR",
        families: ["e-lan"],
        provider: { junos: "junos/gold.conf" },
        alternatives: { junos: ["junos/bronze.conf"] },
        rationale: "tier choice",
      },
    ],
  },
  unboundRoleParameters: [{ construct: "policy-statement:$EXPORT_POL", families: ["l3vpn"], reason: "not interchangeable" }],
};

test("a bound role parameter resolves to its declared provider", () => {
  const index = new Map([snip("junos/gold.conf"), snip("junos/bronze.conf")]);
  const r = resolveRole({ construct: "community:$COLOR", family: "e-lan", os: "junos", device: "d1", matrix: roleMatrix, snipIndex: index });
  assert.equal(r.status, "ok");
  assert.equal(r.selected, "junos/gold.conf");
});

test("a provider that does not apply to the device fails, never falls back", () => {
  const index = new Map([snip("junos/gold.conf", { junos: ["other"], evo: [] })]);
  const r = resolveRole({ construct: "community:$COLOR", family: "e-lan", os: "junos", device: "d1", matrix: roleMatrix, snipIndex: index });
  assert.equal(r.status, "inapplicable");
});

test("a declared-unbound role parameter fails closed with its reason", () => {
  const r = resolveRole({ construct: "policy-statement:$EXPORT_POL", family: "l3vpn", os: "junos", device: "d1", matrix: roleMatrix, snipIndex: new Map() });
  assert.equal(r.status, "unbound");
  assert.match(r.detail, /not interchangeable/);
});

test("a correlated identity is not treated as a role parameter", () => {
  const r = resolveRole({ construct: "policy-statement:$INSTANCE_NAME", family: "l3vpn", os: "junos", device: "d1", matrix: roleMatrix, snipIndex: new Map() });
  assert.equal(r.status, "not-a-role");
});

test("one spelling can be an identity in one kind and a role in another", () => {
  const identities = MATRIX.identityVariables.constructs;
  const roles = MATRIX.roleBindings.bindings.map((b) => b.construct);
  assert.ok(identities.includes("policy-statement:$INSTANCE_NAME"));
  assert.ok(roles.includes("community:$INSTANCE_NAME"));
  // Same name, different kind: they must never collide.
  assert.equal(identities.filter((i) => roles.includes(i)).length, 0);
});

test("a device-scoped binding wins over a family-wide one", () => {
  const m = {
    ...roleMatrix,
    roleBindings: {
      bindings: [
        { construct: "community:$COLOR", families: ["e-lan"], provider: { junos: "junos/gold.conf" }, rationale: "default" },
        { construct: "community:$COLOR", families: ["e-lan"], devices: ["d1"], provider: { junos: "junos/bronze.conf" }, rationale: "device" },
      ],
    },
  };
  const index = new Map([snip("junos/gold.conf"), snip("junos/bronze.conf")]);
  assert.equal(resolveRole({ construct: "community:$COLOR", family: "e-lan", os: "junos", device: "d1", matrix: m, snipIndex: index }).selected, "junos/bronze.conf");
  assert.equal(resolveRole({ construct: "community:$COLOR", family: "e-lan", os: "junos", device: "d9", matrix: m, snipIndex: index }).status, "inapplicable");
});

test("a construct may not be both bound and declared unbound for a family", () => {
  const m = {
    roles: {},
    forms: [],
    roleBindings: { bindings: [{ construct: "x:$Y", families: ["l3vpn"], provider: { junos: "junos/a.conf" }, rationale: "r" }] },
    unboundRoleParameters: [{ construct: "x:$Y", families: ["l3vpn"], reason: "r" }],
  };
  assert.ok(validateMatrix(m, idxOf("junos/a.conf")).some((p) => /both bound and declared unbound/.test(p)));
});

test("every declared provider in the shipped matrix resolves and carries a rationale", () => {
  for (const b of MATRIX.roleBindings.bindings) {
    assert.ok(b.rationale && b.rationale.length > 20, `${b.construct} needs a rationale`);
  }
  for (const u of MATRIX.unboundRoleParameters) {
    assert.ok(u.reason && u.reason.length > 20, `${u.construct} needs a reason`);
  }
});

// --- required operator choices ---

const choiceMatrix = {
  roles: {},
  forms: [],
  roleBindings: {
    bindings: [
      {
        construct: "community:$TIER",
        families: ["e-lan"],
        selection: "required",
        providers: { junos: ["junos/gold.conf", "junos/bronze.conf"] },
        rationale: "the operator states the service tier, there is no default",
      },
    ],
  },
};

test("a required choice offers the applicable providers and never picks one", () => {
  const index = new Map([snip("junos/gold.conf"), snip("junos/bronze.conf")]);
  const r = resolveRole({ construct: "community:$TIER", family: "e-lan", os: "junos", device: "d1", matrix: choiceMatrix, snipIndex: index });
  assert.equal(r.status, "choice-required");
  assert.deepEqual(r.choices, ["junos/bronze.conf", "junos/gold.conf"]);
  assert.equal(r.selected, undefined);
});

test("a required choice offers only the providers applicable to the device", () => {
  const index = new Map([snip("junos/gold.conf"), snip("junos/bronze.conf", { junos: ["other"], evo: [] })]);
  const r = resolveRole({ construct: "community:$TIER", family: "e-lan", os: "junos", device: "d1", matrix: choiceMatrix, snipIndex: index });
  assert.deepEqual(r.choices, ["junos/gold.conf"]);
});

test("a required choice with nothing applicable fails rather than closing empty", () => {
  const index = new Map([snip("junos/gold.conf", { junos: ["x"], evo: [] }), snip("junos/bronze.conf", { junos: ["y"], evo: [] })]);
  const r = resolveRole({ construct: "community:$TIER", family: "e-lan", os: "junos", device: "d1", matrix: choiceMatrix, snipIndex: index });
  assert.equal(r.status, "no-applicable-choice");
});

test("a required choice may not declare a default, and needs at least two options", () => {
  const withDefault = { ...choiceMatrix, roleBindings: { bindings: [{ ...choiceMatrix.roleBindings.bindings[0], provider: { junos: "junos/gold.conf" } }] } };
  assert.ok(validateMatrix(withDefault, idxOf("junos/gold.conf", "junos/bronze.conf")).some((p) => /may not declare a default/.test(p)));

  const single = { ...choiceMatrix, roleBindings: { bindings: [{ ...choiceMatrix.roleBindings.bindings[0], providers: { junos: ["junos/gold.conf"] } }] } };
  assert.ok(validateMatrix(single, idxOf("junos/gold.conf")).some((p) => /at least two providers/.test(p)));
});

test("a required choice is recorded as an input, not a failure", () => {
  const index = new Map([snip("junos/a.conf"), snip("junos/gold.conf"), snip("junos/bronze.conf")]);
  const r = closeTuple({
    entries: ["junos/a.conf"],
    device: "d1",
    os: "junos",
    snipIndex: index,
    headers: new Map([["junos/a.conf", { pairWith: [] }]]),
    constructs: new Map([["junos/a.conf", { references: [{ kind: "community", name: "$TIER" }] }]]),
    variantMembers: [],
    definers: new Map(),
    matrix: choiceMatrix,
    family: "e-lan",
  });
  assert.deepEqual(r.failures, []);
  assert.equal(r.requiredInputs.length, 1);
  assert.deepEqual(r.requiredInputs[0].choices, ["junos/bronze.conf", "junos/gold.conf"]);
});

test("the shipped matrix leaves no role parameter unbound", () => {
  assert.deepEqual(MATRIX.unboundRoleParameters, []);
});
