import { test } from "node:test";
import assert from "node:assert/strict";
import { extractConstructs, canonicalName } from "./config-references.mjs";
import { auditLibrary } from "./library-completeness.mjs";

const defs = (body) => extractConstructs(body).definitions.map((d) => `${d.kind}:${d.name}`);
const refs = (body) => extractConstructs(body).references.map((r) => `${r.kind}:${r.name}`);

test("${FOO} and $FOO are the same construct name", () => {
  assert.equal(canonicalName("${FOO}"), "$FOO");
  assert.equal(canonicalName("${INSTANCE_NAME}_RT"), "$INSTANCE_NAME_RT");
  assert.equal(canonicalName("PLAIN"), "PLAIN");
});

test("definitions are recognised for each modelled kind", () => {
  assert.deepEqual(defs("firewall { family any { filter F { interface-specific; } } }"), ["filter:F"]);
  assert.deepEqual(defs("firewall { policer P { then discard; } }"), ["policer:P"]);
  assert.deepEqual(defs("policy-options { policy-statement PS { term a { then accept; } } }"), ["policy-statement:PS"]);
  assert.deepEqual(defs("policy-options { prefix-list PL { 10.0.0.0/8; } }"), ["prefix-list:PL"]);
  assert.deepEqual(defs("groups { GR-X { interfaces { <*> { mtu 9102; } } } }"), ["group:GR-X"]);
  assert.deepEqual(defs("routing-instances { RI { instance-type vrf; } }"), ["routing-instance:RI"]);
  assert.deepEqual(defs("class-of-service { schedulers { SC { priority high; } } }"), ["scheduler:SC"]);
  assert.deepEqual(defs("class-of-service { scheduler-maps { SM { forwarding-class BE scheduler SC; } } }"), ["scheduler-map:SM"]);
});

test("a community is a definition in both its block and leaf spellings", () => {
  assert.deepEqual(defs("policy-options { community CM members target:1:1; }"), ["community:CM"]);
  assert.deepEqual(defs("policy-options { community CM { members target:1:1; } }"), ["community:CM"]);
});

test("a community definition leaf is not also read as a reference", () => {
  assert.deepEqual(refs("policy-options { community CM members target:1:1; }"), []);
});

test("references are recognised for each modelled kind", () => {
  assert.deepEqual(refs("firewall { family any { filter F { term t { then policer P; } } } }"), ["policer:P"]);
  assert.deepEqual(refs("interfaces { et-0/0/0 { unit 0 { family any { filter { input F; } } } } }"), ["filter:F"]);
  assert.deepEqual(refs("routing-instances { RI { vrf-export PS; } }"), ["policy-statement:PS"]);
  assert.deepEqual(refs("routing-instances { RI { vrf-import PS2; } }"), ["policy-statement:PS2"]);
  assert.deepEqual(refs("protocols { bgp { group G { export PS3; } } }"), ["policy-statement:PS3"]);
  assert.deepEqual(refs("policy-options { policy-statement P { term a { from { prefix-list PL; } } } }"), ["prefix-list:PL"]);
  assert.deepEqual(refs("interfaces { et-0/0/0 { apply-groups GR-X; } }"), ["group:GR-X"]);
  assert.deepEqual(refs("class-of-service { interfaces { et-0/0/0 { scheduler-map SM; } } }"), ["scheduler-map:SM"]);
});

test("a community reference is found in its add and match spellings", () => {
  assert.deepEqual(refs("policy-options { policy-statement P { term a { then { community add CM; } } } }"), ["community:CM"]);
  assert.deepEqual(refs("policy-options { policy-statement P { term a { from { community CM2; } } } }"), ["community:CM2"]);
});

test("a bracketed list yields every name", () => {
  assert.deepEqual(refs("policy-options { policy-statement P { term a { from { community [ A B C ]; } } } }"), [
    "community:A",
    "community:B",
    "community:C",
  ]);
  assert.deepEqual(refs("protocols { bgp { group G { export [ P1 P2 ]; } } }"), ["policy-statement:P1", "policy-statement:P2"]);
});

// `vrf-target import target:63536:22222` must not read as a policy reference.
test("a route-target value is not a policy reference", () => {
  assert.deepEqual(refs("routing-instances { RI { vrf-target import target:63536:22222; } }"), []);
  assert.deepEqual(refs("routing-instances { RI { vrf-target target:1:1; } }"), []);
});

test("vrf-export is not read by the bare export rule", () => {
  assert.deepEqual(refs("routing-instances { RI { vrf-export PS; } }"), ["policy-statement:PS"]);
});

test("a templated reference resolves symbolically and keeps its suffix", () => {
  const body = "policy-options { policy-statement $INSTANCE_NAME { term a { then { community add ${INSTANCE_NAME}_RT; } } } }";
  assert.deepEqual(defs(body), ["policy-statement:$INSTANCE_NAME"]);
  assert.deepEqual(refs(body), ["community:$INSTANCE_NAME_RT"]);
});

test("kind comes from the keyword, so a shared name is two constructs", () => {
  const body = "routing-instances { $INSTANCE_NAME { vrf-export $INSTANCE_NAME; } }";
  assert.deepEqual(defs(body), ["routing-instance:$INSTANCE_NAME"]);
  assert.deepEqual(refs(body), ["policy-statement:$INSTANCE_NAME"]);
});

test("a deactivated statement defines and references nothing", () => {
  assert.deepEqual(defs("groups { inactive: GR-X { mtu 9102; } }"), []);
  assert.deepEqual(refs("interfaces { et-0/0/0 { inactive: apply-groups GR-X; } }"), []);
});

test("an unparseable body yields nothing and is flagged", () => {
  const r = extractConstructs("firewall { policer P {");
  assert.equal(r.ok, false);
  assert.deepEqual(r.definitions, []);
  assert.deepEqual(r.references, []);
});

test("a repeated reference is reported once", () => {
  const body = "protocols { bgp { group A { export PS; } group B { export PS; } } }";
  assert.deepEqual(refs(body), ["policy-statement:PS"]);
});

// --- library closure ---

const snip = (rel, seenOn, body) => ({ rel, dir: rel.split("/")[0], seenOn, body });

test("a reference resolves when a definer applies to the same device", () => {
  const r = auditLibrary({
    snips: [
      snip("junos/a.conf", { junos: ["d1"], evo: [] }, "routing-instances { RI { vrf-export PS; } }"),
      snip("junos/b.conf", { junos: ["d1"], evo: [] }, "policy-options { policy-statement PS { term a { then accept; } } }"),
    ],
  });
  assert.equal(r.resolved.length, 1);
  assert.equal(r.offDevice.length, 0);
  assert.equal(r.external.length, 0);
  assert.deepEqual(r.resolved[0].definers, ["junos/b.conf"]);
});

test("a definer that does not cover the device is off-device, not external", () => {
  const r = auditLibrary({
    snips: [
      snip("junos/a.conf", { junos: ["d1", "d2"], evo: [] }, "routing-instances { RI { vrf-export PS; } }"),
      snip("junos/b.conf", { junos: ["d1"], evo: [] }, "policy-options { policy-statement PS { term a { then accept; } } }"),
    ],
  });
  assert.equal(r.resolved.length, 1);
  assert.deepEqual(r.offDevice.map((f) => f.device), ["d2"]);
  assert.equal(r.external.length, 0);
});

test("a construct no snip defines is external", () => {
  const r = auditLibrary({
    snips: [snip("junos/a.conf", { junos: ["d1"], evo: [] }, "routing-instances { RI { vrf-export PS; } }")],
  });
  assert.equal(r.external.length, 1);
  assert.equal(r.offDevice.length, 0);
});

test("a definer in the other directory resolves and is flagged cross-directory", () => {
  const r = auditLibrary({
    snips: [
      snip("junos/a.conf", { junos: ["d1"], evo: [] }, "routing-instances { RI { vrf-export PS; } }"),
      snip("evo/b.conf", { junos: ["d1"], evo: [] }, "policy-options { policy-statement PS { term a { then accept; } } }"),
    ],
  });
  assert.equal(r.resolved.length, 1);
  assert.equal(r.crossDirectory.length, 1);
});

test("a same-named construct of another kind does not satisfy a reference", () => {
  const r = auditLibrary({
    snips: [
      snip("junos/a.conf", { junos: ["d1"], evo: [] }, "routing-instances { RI { vrf-export SHARED; } }"),
      snip("junos/b.conf", { junos: ["d1"], evo: [] }, "routing-instances { SHARED { instance-type vrf; } }"),
    ],
  });
  assert.equal(r.external.length, 1);
  assert.equal(r.external[0].construct, "policy-statement:SHARED");
});

test("an unparseable snip is reported and contributes nothing", () => {
  const r = auditLibrary({ snips: [snip("junos/a.conf", { junos: ["d1"], evo: [] }, "firewall { policer P {")] });
  assert.deepEqual(r.parseFailures, ["junos/a.conf"]);
  assert.equal(r.findings.length, 0);
});
