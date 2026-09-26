import { test } from "node:test";
import assert from "node:assert/strict";
import { extractConstructs, extractConstructOccurrences, canonicalName } from "./config-references.mjs";
import { auditLibrary } from "./library-completeness.mjs";

const defs = (body) => extractConstructs(body).definitions.map((d) => `${d.kind}:${d.name}`);
const refs = (body) => extractConstructs(body).references.map((r) => `${r.kind}:${r.name}`);

test('MAC-VRF VLAN attachments and L3 gateways are exact logical-interface references', () => {
  const result = extractConstructOccurrences('routing-instances { V { instance-type mac-vrf; vlans { VLAN { interface ae1.100; l3-interface irb.100; } } } }');
  assert.deepEqual(result.references.map(row => [row.kind, row.name]), [['logical-interface', 'ae1.100'], ['logical-interface', 'irb.100']]);
});

test('local-switching pins both circuit endpoints and bridge domains pin attachment and IRB', () => {
  const body = 'protocols { l2circuit { local-switching { interface et-0/0/5.3000 { end-interface { interface et-0/0/51.4010; } ignore-mtu-mismatch; } } } } bridge-domains { BD { interface xe-0/0/3:1.4050; routing-interface irb.4050; } }';
  assert.deepEqual(extractConstructOccurrences(body).references.map(row => [row.kind, row.name]), [
    ['logical-interface', 'et-0/0/5.3000'], ['logical-interface', 'et-0/0/51.4010'],
    ['logical-interface', 'xe-0/0/3:1.4050'], ['logical-interface', 'irb.4050'],
  ]);
  assert.deepEqual(extractConstructOccurrences('groups { UNUSED { bridge-domains { BD { interface xe-0/0/3:1.4050; } } } } protocols { inactive: l2circuit { local-switching { interface et-0/0/5.3000; } } }').references, []);
});

test('EXP classifier default import is built-in, not a routing-policy reference', () => {
  const classifier = 'class-of-service { classifiers { exp EXP { import default; forwarding-class BE { loss-priority low code-points 000; } } } }';
  assert.deepEqual(refs(classifier), []);
  assert.deepEqual(extractConstructOccurrences(classifier).references, []);
  const policyImport = 'protocols { bgp { group TRANSIT { import default; } } }';
  assert.deepEqual(refs(policyImport), ['policy-statement:default']);
  assert.deepEqual(extractConstructOccurrences(policyImport).references.map(row => [row.kind, row.name]), [['policy-statement', 'default']]);
});

test("occurrence extraction retains distinct named-process reference slots", () => {
  const body = "protocols { isis-instance metro-a { interface ae82.1 { point-to-point; } export [ COMMON export_isis_metro_b_ribs ]; } isis-instance metro-b { interface ae82.2 { point-to-point; } export [ COMMON export_isis_metro_a_ribs ]; } }";
  const result = extractConstructOccurrences(body);
  assert.equal(result.ok, true);
  assert.equal(result.references.length, 6);
  const common = result.references.filter(row => row.name === "COMMON");
  assert.equal(common.length, 2);
  assert.notEqual(common[0].nodeId, common[1].nodeId);
  assert.notDeepEqual(common[0].trail, common[1].trail);
  assert.deepEqual(common.map(row => row.wordIndex), [2, 2]);
  assert.deepEqual(result.references.filter(row => row.kind === "logical-interface").map(row => row.name), ["ae82.1", "ae82.2"]);
});

test("logical units are definitions, while service attachments are references", () => {
  const body = "interfaces { $IFD { unit $UNIT { family bridge; } } } routing-instances { SERVICE { interface ${IFD}.${UNIT}; bridge-domains { VLAN { interface ae1.2; } } } }";
  const result = extractConstructOccurrences(body);
  assert.deepEqual(result.definitions.filter(row => row.kind === "logical-interface").map(row => row.name), ["$IFD.$UNIT"]);
  assert.deepEqual(result.references.filter(row => row.kind === "logical-interface").map(row => row.name), ["$IFD.$UNIT", "ae1.2"]);
  assert.equal(extractConstructs(body).references.length, 0);
});

test("inactive ancestors do not emit occurrences or shift later source IDs", async () => {
  const { sourceTree } = await import("./generate-bindings.mjs");
  const body = "protocols { inactive: isis-instance metro-a { interface ae1.1 { passive; } } isis-instance metro-b { interface ae1.2 { passive; } } }";
  const result = extractConstructOccurrences(body);
  assert.equal(result.references.length, 1);
  const row = result.references[0];
  assert.equal(row.name, "ae1.2");
  assert.deepEqual(sourceTree(body).index[row.nodeId].words, ["interface", "ae1.2"]);
  assert.deepEqual(extractConstructOccurrences("interfaces {"), { ok: false, definitions: [], references: [] });
});

test("floating-PW condition traces the transport circuit rather than its service unit", () => {
  const result = extractConstructOccurrences("policy-options { policy-statement FLOAT-PW-CONDITIONAL { term ps-conditional { from { condition Floating-PW-Condition; } then accept; } } condition Floating-PW-Condition { if-route-exists { address-family { ccc { ps0.0; table mpls.0; } } } } } protocols { l2circuit { neighbor 1.1.0.18 { interface ps0.0 { virtual-circuit-id 1001; } } } } routing-instances { FLOATING { interface ps0.300; } }");
  assert.deepEqual(result.definitions.filter(row => row.kind === "condition").map(row => row.name), ["Floating-PW-Condition"]);
  assert.deepEqual(result.definitions.filter(row => row.kind === "l2circuit-interface").map(row => row.name), ["ps0.0"]);
  assert.deepEqual(result.references.map(row => [row.kind, row.name]), [["condition", "Floating-PW-Condition"], ["l2circuit-interface", "ps0.0"], ["logical-interface", "ps0.0"], ["logical-interface", "ps0.300"]]);
});

test("interface-route RIB-group application resolves a typed group identity", () => {
  const result = extractConstructOccurrences('routing-options { interface-routes { rib-group inet RG-LOCAL-LOOPBACK; } rib-groups { RG-LOCAL-LOOPBACK { import-rib [ inet.0 inet.3 ]; } } }');
  assert.deepEqual(result.definitions.filter(row => row.kind === 'rib-group').map(row => row.name), ['RG-LOCAL-LOOPBACK']);
  assert.deepEqual(result.references.filter(row => row.kind === 'rib-group').map(row => row.name), ['RG-LOCAL-LOOPBACK']);
});

test("Flex-Algo transport-class references use configured colors, not provider filenames", () => {
  const result = extractConstructOccurrences('routing-options { flex-algorithm 128 { color 4000; use-transport-class; } transport-class { name gold { color 4000; tunnel-egress { end-point 1.1.0.10; } } } }');
  assert.deepEqual(result.references.filter(row => row.kind === 'transport-class').map(row => row.name), ['4000']);
  assert.deepEqual(result.definitions.filter(row => row.kind === 'transport-class').map(row => row.name), ['4000']);
});

test("LDP loopback participation carries its logical-interface dependency", () => {
  const result = extractConstructOccurrences('protocols { ldp { interface lo0.0; } }');
  assert.deepEqual(result.references.map(row => [row.kind, row.name]), [['logical-interface', 'lo0.0']]);
});

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

test('a literal resolution mapping-community is not a named policy community', () => {
  const body = 'routing-options { resolution { scheme gold-to-bronze { resolution-ribs [ junos-rti-tc-4000.inet.3 junos-rti-tc-6000.inet.3 ]; mapping-community color:0:4000; } } }';
  assert.deepEqual(extractConstructOccurrences(body).references.filter(row => row.kind === 'community'), []);
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
