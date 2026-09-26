import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { resolveDependency, createOccurrenceResolver, twinRel, dependencyPath } from "./dependency-resolve.mjs";

const snip = (rel, seenOn, body) => ({ rel, dir: rel.split("/")[0], seenOn, body });
const idx = (...snips) => new Map(snips.map((s) => [s.rel, s]));
const BODY_A = "firewall {\n    policer P {\n        then discard;\n    }\n}";
const BODY_B = "firewall {\n    policer P {\n        then accept;\n    }\n}";

test('IRB service selection uses the explicit gateway interface and rejects ambiguous companions', () => {
  const seenOn = { junos: ['fixture'], evo: [] };
  const snips = [
    snip('junos/vrf.conf', seenOn, 'routing-instances { TENANT { instance-type vrf; interface irb.10; } }'),
    snip('junos/service.conf', seenOn, 'routing-instances { $NAME { instance-type mac-vrf; vlans { V { l3-interface irb.$UNIT; } } } }'),
  ];
  const sourceText = 'interfaces { irb { unit 10 { family inet; } } } ' + snips[0].body + ' routing-instances { OTHER_NAME { instance-type mac-vrf; vlans { V { l3-interface irb.10; } } } TENANT_L2 { instance-type mac-vrf; vlans { V { l3-interface irb.20; } } } }';
  const check = text => {
    const resolver = createOccurrenceResolver({ sourceText: text, device: 'fixture', os: 'junos', snips });
    return resolver.resolveRelated({ consumerId: resolver.occurrences(snips[0].rel)[0].id, sourceSha256: resolver.sourceSha256, kind: 'irb-service', candidates: [snips[1].rel] });
  };
  const result = check(sourceText);
  assert.equal(result.status, 'ok');
  assert.equal(result.selected.length, 1);
  assert.equal(result.selected[0].binding.NAME, 'OTHER_NAME');
  assert.equal(check(sourceText.replace('l3-interface irb.20', 'l3-interface irb.10')).status, 'ambiguous-irb-service');
  assert.equal(check(sourceText.replace('l3-interface irb.10', 'l3-interface irb.30')).status, 'missing-irb-service');
});

test('VRF community selection follows actual policies rather than instance spelling', () => {
  const seenOn = { junos: ['fixture'], evo: [] };
  const snips = [
    snip('junos/vrf.conf', seenOn, 'routing-instances { V1 { instance-type vrf; vrf-import ACTUAL; } }'),
    snip('junos/community.conf', seenOn, 'policy-options { community $NAME members target:1:$ID; }'),
  ];
  const sourceText = snips[0].body + ' policy-options { policy-statement ACTUAL { term match { from community UNRELATED_NAME; then accept; } } community V1 members target:1:1; community UNRELATED_NAME members target:1:2; }';
  const resolver = createOccurrenceResolver({ sourceText, device: 'fixture', os: 'junos', snips });
  const consumer = resolver.occurrences(snips[0].rel)[0];
  const request = { consumerId: consumer.id, sourceSha256: resolver.sourceSha256, kind: 'policy-community', candidates: [snips[1].rel] };
  const result = resolver.resolveRelated(request);
  assert.equal(result.status, 'ok');
  assert.equal(result.selected.length, 1);
  assert.equal(result.selected[0].binding.NAME, 'UNRELATED_NAME');
  assert.ok(result.requiredSourceIds.length > result.selected[0].sourceIds.length);
  const missingSource = sourceText.replace('community UNRELATED_NAME members target:1:2;', '');
  const missing = createOccurrenceResolver({ sourceText: missingSource, device: 'fixture', os: 'junos', snips });
  assert.equal(missing.resolveRelated({ ...request, consumerId: missing.occurrences(snips[0].rel)[0].id, sourceSha256: missing.sourceSha256 }).status, 'missing-source-definition');
});

test('related interface selection pins parent identity and all actual LAG members', () => {
  const seenOn = { junos: ['fixture'], evo: [] };
  const sourceText = 'interfaces { ae1 { mtu 9192; aggregated-ether-options { minimum-links 1; } unit 0 { family inet; } unit 100 { family bridge; } } ae2 { mtu 9192; aggregated-ether-options { minimum-links 1; } unit 0 { family inet; } } et-0/0/0 { ether-options { 802.3ad ae1; } } et-0/0/1 { gigether-options { 802.3ad ae1; } } et-0/0/2 { ether-options { 802.3ad ae2; } } }';
  const snips = [
    snip('junos/unit.conf', seenOn, 'interfaces { $IFD { unit 0 { family inet; } } }'),
    snip('junos/parent.conf', seenOn, 'interfaces { $IFD { mtu 9192; aggregated-ether-options { minimum-links 1; } } }'),
    snip('junos/wrong-parent.conf', seenOn, 'interfaces { ae2 { mtu 9192; aggregated-ether-options { minimum-links 1; } } }'),
    snip('junos/ether.conf', seenOn, 'interfaces { $IFD { ether-options { 802.3ad $AE; } } }'),
    snip('junos/gigether.conf', seenOn, 'interfaces { $IFD { gigether-options { 802.3ad $AE; } } }'),
  ];
  const resolver = createOccurrenceResolver({ sourceText, device: 'fixture', os: 'junos', snips });
  const consumer = resolver.occurrences(snips[0].rel).find(row => row.binding.IFD === 'ae1');
  const request = { consumerId: consumer.id, sourceSha256: resolver.sourceSha256 };
  const parent = resolver.resolveRelated({ ...request, kind: 'interface-parent', candidates: [snips[1].rel] });
  assert.equal(parent.status, 'ok');
  assert.equal(parent.selected.length, 1);
  assert.equal(parent.selected[0].binding.IFD, 'ae1');
  assert.ok(!parent.selected[0].rendered.includes('unit 100'));
  assert.equal(resolver.resolveRelated({ ...request, kind: 'interface-parent', candidates: [snips[2].rel] }).status, 'unavailable');
  const members = resolver.resolveRelated({ ...request, kind: 'lag-member', candidates: [snips[3].rel, snips[4].rel] });
  assert.equal(members.status, 'ok');
  assert.deepEqual(members.selected.map(row => row.binding.IFD).sort(), ['et-0/0/0', 'et-0/0/1']);
  assert.equal(resolver.resolveRelated({ ...request, kind: 'lag-member', candidates: [snips[3].rel] }).status, 'unavailable');
  assert.equal(resolver.resolveRelated({ ...request, kind: 'interface-parent', candidates: [snips[1].rel], sourceSha256: 'stale' }).status, 'stale-source');
});

test('chassis PIC context preserves independent occurrences and sealed child fragments', async () => {
  const { sourceTree, occurrenceMap } = await import('./generate-bindings.mjs');
  const template = 'chassis { fpc $FPC { pic $PIC { tunnel-services; } } }';
  const source = 'chassis { fpc 0 { pic 0 { tunnel-services; port 0 { speed 100g; } } pic 1 { tunnel-services; } } fpc 1 { pic 2 { tunnel-services; } } }';
  assert.equal(occurrenceMap(template, sourceTree(source)).instances.length, 3);
  for (const [body, concrete] of [
    ['chassis { fpc 0 { pic 0 { port 0 { speed 100g; } } } }', 'chassis { fpc 0 { pic 0 { port 0 { speed 100g; } port 1 { speed 10g; } } } }'],
    ['chassis { fpc 0 { pic 0 { tunnel-services { bandwidth 40g; } } } }', 'chassis { fpc 0 { pic 0 { tunnel-services { bandwidth 40g; } port 0 { speed 100g; } } } }'],
    ['chassis { fpc 0 { pic 0 { port 0 { speed 100g; } } } }', 'chassis { fpc 0 { pic 0 { port 0 { speed 100g; number-of-sub-ports 4; } } } }'],
    ['chassis { fpc 0 { pic 0 { tunnel-services { bandwidth 40g; } } } }', 'chassis { fpc 0 { pic 0 { tunnel-services { bandwidth 40g; tunnel-port 1 { bandwidth 10g; } } } } }'],
    ['other { fpc 0 { pic 0 { tunnel-services; } } }', 'other { fpc 0 { pic 0 { tunnel-services; port 0 { speed 100g; } } } }'],
  ]) assert.equal(occurrenceMap(body, sourceTree(concrete)).instances.length, 0);
});

test('PS occurrences bind the same transport device, anchor PIC and sufficient chassis allocation', () => {
  const seenOn = { junos: ['fixture'], evo: [] };
  const snips = [
    snip('junos/service.conf', seenOn, 'interfaces { $PS { anchor-point { $ANCHOR; } unit $UNIT { encapsulation vlan-bridge; vlan-id $VLAN; } } }'),
    snip('junos/transport.conf', seenOn, 'interfaces { $PS { anchor-point { $ANCHOR; } unit 0 { encapsulation ethernet-ccc; } } }'),
    snip('junos/capacity.conf', seenOn, 'chassis { pseudowire-service { device-count $COUNT; } }'),
    snip('junos/tunnel.conf', seenOn, 'chassis { fpc $FPC { pic $PIC { tunnel-services; } } }'),
  ];
  const source = 'chassis { pseudowire-service { device-count 100; } fpc 0 { pic 0 { tunnel-services; } pic 1 { tunnel-services; } } } interfaces { ps0 { anchor-point { lt-0/0/0; } unit 0 { encapsulation ethernet-ccc; } unit 100 { encapsulation vlan-bridge; vlan-id 200; } } ps7 { anchor-point { lt-0/1/0; } unit 0 { encapsulation ethernet-ccc; } unit 900 { encapsulation vlan-bridge; vlan-id 300; } } }';
  const resolveAll = sourceText => {
    const resolver = createOccurrenceResolver({ sourceText, device: 'fixture', os: 'junos', snips });
    return resolver.occurrences('junos/service.conf').flatMap(consumer => consumer.references.map(reference => ({ consumer, reference, result: resolver.resolve({ consumerId: consumer.id, sourceSha256: resolver.sourceSha256, ...reference, candidates: [{ 'logical-interface': 'junos/transport.conf', 'ps-device-capacity': 'junos/capacity.conf', 'tunnel-pic': 'junos/tunnel.conf' }[reference.kind]] }) })));
  };
  for (const { consumer, reference, result } of resolveAll(source)) {
    assert.equal(result.status, 'ok');
    if (reference.kind === 'logical-interface') assert.equal(result.selected.binding.PS, consumer.binding.PS);
    if (reference.kind === 'tunnel-pic') assert.equal(`${result.selected.binding.FPC}/${result.selected.binding.PIC}`, consumer.binding.ANCHOR.slice(3).split('/').slice(0, 2).join('/'));
  }
  assert.ok(resolveAll(source.replace('device-count 100', 'device-count 7')).some(row => row.result.status === 'insufficient-ps-capacity'));
  assert.ok(resolveAll(source.replace('lt-0/1/0;', 'lt-1/0/0;')).some(row => row.result.status === 'missing-source-definition'));
  assert.ok(resolveAll(source.replace('unit 0 { encapsulation ethernet-ccc; }', '')).some(row => row.reference.name === 'ps0.0' && row.result.status === 'missing-source-definition'));
  assert.ok(resolveAll(source.replace('device-count 100', 'device-count 2').replaceAll('ps7', 'ps1')).some(row => row.result.status === 'insufficient-ps-capacity'));
});

test("human-approved exclusions reject exact providers and parent fragments without mutating source", () => {
  const sourceText = 'interfaces { et-0/0/16 { description "fake"; mtu 9192; unit 0 { family iso; } } } protocols { isis { interface et-0/0/16.0 { point-to-point; } } }';
  const snips = [
    snip('junos/parent.conf', { junos: ['fixture'] }, 'interfaces { et-0/0/16 { description "fake"; mtu 9192; } }'),
    snip('junos/unit.conf', { junos: ['fixture'] }, 'interfaces { et-0/0/16 { unit 0 { family iso; } } }'),
    snip('junos/isis.conf', { junos: ['fixture'] }, 'protocols { isis { interface et-0/0/16.0 { point-to-point; } } }'),
  ];
  const exclusions = { schemaVersion: 1, entries: [{ id: 'fake', classification: 'excluded-source-defect', device: 'fixture', sourceSha256: createHash('sha256').update(sourceText).digest('hex'), hierarchy: ['interfaces', 'et-0/0/16'], approvedBy: 'Human reviewer', approvedOn: '2026-09-23', reason: 'Fixture adjudication' }] };
  const raw = createOccurrenceResolver({ sourceText, device: 'fixture', os: 'junos', snips });
  assert.equal(raw.occurrences('junos/parent.conf').length, 1);
  const resolver = createOccurrenceResolver({ sourceText, device: 'fixture', os: 'junos', snips, exclusions });
  assert.equal(resolver.occurrences('junos/parent.conf').length, 0);
  assert.equal(resolver.occurrences('junos/unit.conf').length, 0);
  const consumer = resolver.occurrences('junos/isis.conf')[0];
  assert.equal(resolver.resolve({ consumerId: consumer.id, sourceSha256: resolver.sourceSha256, ...consumer.references[0], candidates: ['junos/unit.conf'] }).status, 'excluded-source-defect');
  assert.throws(() => createOccurrenceResolver({ sourceText: sourceText + ' ', device: 'fixture', os: 'junos', snips, exclusions }), /Stale exclusion/);
  assert.throws(() => createOccurrenceResolver({ sourceText, device: 'fixture', os: 'junos', snips, exclusions: { ...exclusions, entries: [{ ...exclusions.entries[0], approvedBy: '' }] } }), /human approval/);
});

const occurrenceSource = "interfaces { ae82 { unit 1 { family iso; } unit 2 { family iso; } } } policy-options { policy-statement export_a { then accept; } policy-statement export_b { then reject; } } protocols { isis-instance metro-a { interface ae82.1 { point-to-point; } export export_b; } isis-instance metro-b { interface ae82.2 { point-to-point; } export export_a; } }";
const occurrenceSnips = () => [
  snip("evo/consumer.conf", { junos: [], evo: ["mdr1"] }, "protocols { isis-instance $ISIS_INSTANCE { interface $CORE_INTF { point-to-point; } export $EXPORT_POLICY; } }"),
  snip("evo/interface.conf", { junos: [], evo: ["mdr1"] }, "interfaces { $IFD { unit $UNIT { family iso; } } }"),
  snip("junos/interface.conf", { junos: [], evo: ["mdr1"] }, "interfaces { $IFD { unit $UNIT { family iso; } } }"),
  snip("evo/export-a.conf", { junos: [], evo: ["mdr1"] }, "policy-options { policy-statement $POLICY { then accept; } }"),
  snip("evo/export-b.conf", { junos: [], evo: ["mdr1"] }, "policy-options { policy-statement $POLICY { then reject; } }"),
];

test("occurrence resolver binds interfaces and export policies separately on one device", () => {
  const resolver = createOccurrenceResolver({ sourceText: occurrenceSource, device: "mdr1", os: "evo", snips: occurrenceSnips() });
  const consumers = resolver.occurrences("evo/consumer.conf");
  assert.equal(consumers.length, 2);
  const selected = [];
  for (const consumer of consumers) {
    for (const reference of consumer.references) {
      const candidates = reference.kind === "logical-interface" ? ["junos/interface.conf", "evo/interface.conf"] : ["evo/export-a.conf", "evo/export-b.conf"];
      const result = resolver.resolve({ consumerId: consumer.id, sourceSha256: resolver.sourceSha256, ...reference, candidates });
      assert.equal(result.status, "ok");
      assert.equal(result.reference.name, reference.name);
      selected.push(result.selected);
      if (reference.kind === "logical-interface") {
        assert.equal(result.selected.rel, "evo/interface.conf");
        assert.equal(result.equivalents.length, 1);
        assert.equal(`ae82.${result.selected.binding.UNIT}`, consumer.binding.CORE_INTF);
      } else assert.equal(result.selected.binding.POLICY, consumer.binding.EXPORT_POLICY);
    }
  }
  assert.equal(new Set(selected.map(row => row.id)).size, 4);
});

test("occurrence resolver rejects stale sources, wrong slots, unknown identities and wrong providers", () => {
  const resolver = createOccurrenceResolver({ sourceText: occurrenceSource, device: "mdr1", os: "evo", snips: occurrenceSnips() });
  const consumer = resolver.occurrences("evo/consumer.conf")[0];
  const reference = consumer.references.find(row => row.kind === "logical-interface");
  const request = { consumerId: consumer.id, sourceSha256: resolver.sourceSha256, ...reference, candidates: ["evo/interface.conf"] };
  assert.equal(resolver.resolve({ ...request, sourceSha256: "old" }).status, "stale-source");
  assert.equal(resolver.resolve({ ...request, consumerId: "invented" }).status, "unknown-occurrence");
  assert.equal(resolver.resolve({ ...request, wordIndex: 99 }).status, "unknown-reference");
  assert.equal(resolver.resolve({ ...request, candidates: ["evo/export-a.conf"] }).status, "unavailable");
  assert.equal(resolver.resolve({ ...request, candidates: ["evo/missing.conf"] }).status, "unresolved-path");
  const second = resolver.occurrences("evo/consumer.conf")[1];
  assert.equal(resolver.resolve({ ...request, consumerId: second.id }).status, "unknown-reference");
  consumer.binding.CORE_INTF = "ae82.999";
  assert.notEqual(resolver.occurrences("evo/consumer.conf")[0].binding.CORE_INTF, "ae82.999");
});

test("a compound provider is not equivalent to a focused occurrence", () => {
  const snips = occurrenceSnips();
  snips.push(snip("evo/compound.conf", { junos: [], evo: ["mdr1"] }, "interfaces { ae82 { unit 1 { family iso; } unit 2 { family iso; } } }"));
  const resolver = createOccurrenceResolver({ sourceText: occurrenceSource, device: "mdr1", os: "evo", snips });
  const consumer = resolver.occurrences("evo/consumer.conf")[0];
  const reference = consumer.references.find(row => row.kind === "logical-interface");
  assert.equal(resolver.resolve({ consumerId: consumer.id, sourceSha256: resolver.sourceSha256, ...reference, candidates: ["evo/interface.conf", "evo/compound.conf"] }).status, "ambiguous");
  const request = { consumerId: consumer.id, sourceSha256: resolver.sourceSha256, ...reference, candidates: ["evo/interface.conf", "evo/compound.conf"], scope: "object" };
  assert.equal(resolver.resolve(request).selected.rel, "evo/interface.conf");
  assert.equal(resolver.resolve({ ...request, scope: 'whole', preferObject: true }).selected.rel, 'evo/interface.conf');
  assert.equal(resolver.resolve({ ...request, candidates: ['evo/compound.conf'], scope: 'whole', preferObject: true }).selected.rel, 'evo/compound.conf');
  assert.equal(resolver.resolve({ ...request, candidates: ["evo/compound.conf"] }).status, "unavailable");
  assert.equal(resolver.resolve({ ...request, scope: "guess" }).status, "invalid-scope");
});

test("render collapses exact cross-OS source occurrences and assigns each emitted source ID once", () => {
  const body = 'routing-options { flex-algorithm 128 { color 4000; use-transport-class; } flex-algorithm 129 { color 6000; use-transport-class; } }';
  const snips = ['junos', 'evo'].map(os => snip(`${os}/flex.conf`, { junos: [], evo: ['fixture'] }, body));
  const resolver = createOccurrenceResolver({ sourceText: body, device: 'fixture', os: 'evo', snips });
  const entries = snips.flatMap(row => resolver.occurrences(row.rel));
  assert.equal(entries.length, 2);
  const result = resolver.render({ ids: entries.map(row => row.id), sourceSha256: resolver.sourceSha256 });
  assert.equal(result.status, 'ok');
  assert.equal((result.body.match(/flex-algorithm 128/g) ?? []).length, 1);
  assert.equal((result.body.match(/flex-algorithm 129/g) ?? []).length, 1);
  assert.equal(result.occurrences.length, 1);
  assert.equal(result.occurrences[0].rel, 'evo/flex.conf');
  const ids = result.occurrences.flatMap(row => row.contributedSourceIds);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(result.aliases[entries.find(row => row.rel === 'junos/flex.conf').id], result.occurrences[0].id);
});

test("changed consumer bodies cannot reuse an occurrence identity", () => {
  const snips = occurrenceSnips();
  const before = createOccurrenceResolver({ sourceText: occurrenceSource, device: "mdr1", os: "evo", snips });
  const consumer = before.occurrences("evo/consumer.conf")[0];
  snips[0].body += "\n";
  const after = createOccurrenceResolver({ sourceText: occurrenceSource, device: "mdr1", os: "evo", snips });
  after.occurrences("evo/consumer.conf");
  assert.equal(after.resolve({ consumerId: consumer.id, sourceSha256: after.sourceSha256, ...consumer.references[0], candidates: ["evo/interface.conf"] }).status, "unknown-occurrence");
});

test("a compound policy satisfies its own complete prefix-list reference", () => {
  const body = 'policy-options { prefix-list LOOPBACK { 1.1.0.10/32; 1.1.10.10/32; } policy-statement IMPORT { term LOCAL { from { prefix-list LOOPBACK; } then reject; } } }';
  const resolver = createOccurrenceResolver({ sourceText: body, device: 'fixture', os: 'junos', snips: [snip('junos/policy.conf', { junos: ['fixture'] }, body)] });
  const consumer = resolver.occurrences('junos/policy.conf')[0];
  const reference = consumer.references.find(row => row.kind === 'prefix-list');
  const result = resolver.resolve({ consumerId: consumer.id, sourceSha256: resolver.sourceSha256, ...reference, candidates: ['junos/policy.conf'], scope: 'object' });
  assert.equal(result.status, 'ok');
  assert.equal(result.internal, true);
});

test("a selected filter permits sibling filters but never omitted terms", () => {
  const sourceText = "interfaces { lo0 { unit 0 { family inet6 { filter { input ACCESS; } } } } } firewall { family inet6 { filter ACCESS { interface-specific; term ALL { then accept; } } filter OTHER { term DROP { then discard; } } } }";
  const consumer = snip("junos/loopback.conf", { junos: ["fixture"] }, "interfaces { lo0 { unit 0 { family inet6 { filter { input ACCESS; } } } } }");
  const provider = snip("junos/access.conf", { junos: ["fixture"] }, "firewall { family inet6 { filter ACCESS { interface-specific; term ALL { then accept; } } } }");
  const resolver = createOccurrenceResolver({ sourceText, device: "fixture", os: "junos", snips: [consumer, provider] });
  const occurrence = resolver.occurrences(consumer.rel)[0];
  assert.equal(resolver.resolve({ consumerId: occurrence.id, sourceSha256: resolver.sourceSha256, ...occurrence.references[0], candidates: [provider.rel], scope: "object" }).status, "ok");
  const changed = createOccurrenceResolver({ sourceText: sourceText.replace("interface-specific;", "interface-specific; term FIRST { then discard; }"), device: "fixture", os: "junos", snips: [consumer, provider] });
  assert.equal(changed.occurrences(provider.rel).length, 0);
});

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
