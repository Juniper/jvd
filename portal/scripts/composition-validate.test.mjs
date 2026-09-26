import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateMatrix, formDevices, closeTuple, closeOccurrenceTuple, resolveRole, flexAlgorithms, verifyOccurrenceEmission, unboundSelectionProblems } from "./composition-validate.mjs";
import { createOccurrenceResolver } from "./dependency-resolve.mjs";
import { parseSnip } from "./snip-parse.mjs";
import { resolveVariant } from "./variant-resolve.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const MATRIX = JSON.parse(
  fs.readFileSync(
    path.join(REPO_ROOT, "service_provider/metro_ethernet_business_services/configuration/snips/_composition.json"),
    "utf8",
  ),
);

const snip = (rel, seenOn = { junos: ["d1"], evo: [] }) => [rel, { rel, dir: rel.split("/")[0], seenOn, body: "" }];
const idxOf = (...rels) => new Map(rels.map((r) => snip(r)));

test('VLAN-bundle and VPLS downstream attachments close all claimed source occurrences', async () => {
  const root = path.join(REPO_ROOT, 'service_provider/metro_ethernet_business_services');
  const { loadJvd } = await import('./object-ownership.mjs');
  const { snips } = await loadJvd(root);
  const snipIndex = new Map(snips.map(row => [row.rel, row]));
  const headers = new Map(snips.map(row => [row.rel, parseSnip(fs.readFileSync(path.join(root, 'configuration/snips', row.rel), 'utf8')).header]));
  const variantMembers = snips.filter(row => headers.get(row.rel).variantGroup).map(row => ({ ...row, os: row.dir, jvd: 'mebs', group: headers.get(row.rel).variantGroup.name, provides: headers.get(row.rel).variantGroup.provides }));
  const consumers = ['evo/routing-instances/vpls/ri-bgp-vpls-export.conf', 'junos/routing-instances/vpls/ri-bgp-vpls-export.conf', 'evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle-export.conf'];
  for (const os of ['junos', 'evo']) for (const device of [...new Set(consumers.flatMap(rel => headers.get(rel).seenOn[os]))]) {
    const resolver = createOccurrenceResolver({ sourceText: fs.readFileSync(path.join(root, 'configuration/conf', `${device}.conf`), 'utf8'), device, os, snips });
    for (const rel of consumers.filter(rel => headers.get(rel).seenOn[os].includes(device))) {
      const entries = resolver.occurrences(rel);
      assert.ok(entries.length);
      const args = { entries, resolver, sourceSha256: resolver.sourceSha256, headers, snipIndex, variantMembers, device, os, bindings: MATRIX.occurrenceBindings, capabilityRequirements: MATRIX.capabilityRequirements };
      const closure = closeOccurrenceTuple(args);
      assert.deepEqual(closure.failures, [], `${device}:${rel}`);
      const rendered = resolver.render({ ids: closure.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
      assert.deepEqual(verifyOccurrenceEmission({ ...args, closure, rendered }).failures, [], `${device}:${rel}`);
    }
  }
});

test('MEBS shared IRB companion declarations close every claimed source occurrence', async () => {
  const root = path.join(REPO_ROOT, 'service_provider/metro_ethernet_business_services');
  const { loadJvd } = await import('./object-ownership.mjs');
  const { snips } = await loadJvd(root);
  const snipIndex = new Map(snips.map(row => [row.rel, row]));
  const headers = new Map(snips.map(row => [row.rel, parseSnip(fs.readFileSync(path.join(root, 'configuration/snips', row.rel), 'utf8')).header]));
  const variantMembers = snips.filter(row => headers.get(row.rel).variantGroup).map(row => ({ ...row, os: row.dir, jvd: 'mebs', group: headers.get(row.rel).variantGroup.name, provides: headers.get(row.rel).variantGroup.provides }));
  for (const binding of MATRIX.occurrenceBindings.filter(row => row.kind === 'irb-service')) for (const os of ['junos', 'evo']) for (const device of headers.get(binding.consumer).seenOn[os]) {
    const resolver = createOccurrenceResolver({ sourceText: fs.readFileSync(path.join(root, 'configuration/conf', `${device}.conf`), 'utf8'), device, os, snips });
    const entries = resolver.occurrences(binding.consumer);
    assert.ok(entries.length);
    const args = { entries, resolver, sourceSha256: resolver.sourceSha256, headers, snipIndex, variantMembers, device, os, bindings: MATRIX.occurrenceBindings, capabilityRequirements: MATRIX.capabilityRequirements };
    const closure = closeOccurrenceTuple(args);
    assert.deepEqual(closure.failures, [], device);
    for (const entry of entries) assert.ok(closure.edges.some(edge => edge.from === entry.id && edge.requirement === binding.declaredDependency && edge.relation === 'irb-service'));
    const rendered = resolver.render({ ids: closure.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
    assert.deepEqual(verifyOccurrenceEmission({ ...args, closure, rendered }).failures, [], device);
  }
});

test('MEBS indirect community requirements close every declared VRF occurrence', async () => {
  const root = path.join(REPO_ROOT, 'service_provider/metro_ethernet_business_services');
  const { loadJvd } = await import('./object-ownership.mjs');
  const { snips } = await loadJvd(root);
  const snipIndex = new Map(snips.map(row => [row.rel, row]));
  const headers = new Map(snips.map(row => [row.rel, parseSnip(fs.readFileSync(path.join(root, 'configuration/snips', row.rel), 'utf8')).header]));
  const variantMembers = snips.filter(row => headers.get(row.rel).variantGroup).map(row => ({ ...row, os: row.dir, jvd: 'mebs', group: headers.get(row.rel).variantGroup.name, provides: headers.get(row.rel).variantGroup.provides }));
  const rel = 'junos/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy-auto-export.conf';
  for (const device of headers.get(rel).seenOn.junos) {
    const resolver = createOccurrenceResolver({ sourceText: fs.readFileSync(path.join(root, 'configuration/conf', `${device}.conf`), 'utf8'), device, os: 'junos', snips });
    const entries = resolver.occurrences(rel);
    assert.ok(entries.length);
    const args = { entries, resolver, sourceSha256: resolver.sourceSha256, headers, snipIndex, variantMembers, device, os: 'junos', bindings: MATRIX.occurrenceBindings, capabilityRequirements: MATRIX.capabilityRequirements };
    const closure = closeOccurrenceTuple(args);
    assert.deepEqual(closure.failures, [], device);
    for (const entry of entries) assert.ok(closure.edges.some(edge => edge.from === entry.id && edge.requirement === 'junos/policy-options/community/cm-l3vpn-bgpv4.conf' && edge.relation === 'policy-community'));
    const rendered = resolver.render({ ids: closure.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
    assert.deepEqual(verifyOccurrenceEmission({ ...args, closure, rendered }).failures, [], device);
  }
});

test('a retained interface declaration selects each source-bound provider form', () => {
  const snips = [
    { ...snip('junos/service.conf')[1], body: 'routing-instances { SERVICE { interface et-0/0/0.1; interface et-0/0/1.2; } }' },
    { ...snip('junos/plain.conf')[1], body: 'interfaces { $IFD { unit $UNIT { family bridge; } } }' },
    { ...snip('junos/described.conf')[1], body: 'interfaces { $IFD { unit $UNIT { description "service"; family bridge; } } }' },
  ];
  const sourceText = snips[0].body + ' interfaces { et-0/0/0 { unit 1 { family bridge; } } et-0/0/1 { unit 2 { description "service"; family bridge; } } }';
  const resolver = createOccurrenceResolver({ sourceText, device: 'd1', os: 'junos', snips });
  const binding = { consumer: snips[0].rel, kind: 'logical-interface', scope: 'whole', declaredDependency: snips[1].rel, providers: [snips[1].rel, snips[2].rel], unbound: 'required' };
  const args = { entries: resolver.occurrences(snips[0].rel), resolver, sourceSha256: resolver.sourceSha256, device: 'd1', os: 'junos', headers: new Map([[snips[0].rel, { pairWith: [snips[1].rel] }]]), snipIndex: new Map(snips.map(row => [row.rel, row])), bindings: [binding] };
  assert.equal(args.entries.length, 1);
  const closure = closeOccurrenceTuple(args);
  assert.deepEqual(closure.failures, []);
  assert.equal(closure.edges.filter(edge => edge.requirement === snips[1].rel).length, 2);
  const rendered = resolver.render({ ids: closure.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
  assert.deepEqual(verifyOccurrenceEmission({ ...args, closure, rendered }).failures, []);
  const missing = { ...closure, edges: closure.edges.slice(1) };
  assert.ok(verifyOccurrenceEmission({ ...args, closure: missing, rendered }).failures.some(row => row.kind === 'declared-prerequisite-not-planned'));
  assert.ok(closeOccurrenceTuple({ ...args, bindings: [{ ...binding, providers: [snips[1].rel] }] }).failures.length);
});

test('occurrence bindings include matching parent settings and every physical member', () => {
  const snips = [
    { ...snip('junos/unit.conf')[1], body: 'interfaces { $IFD { unit 0 { family inet; } } }' },
    { ...snip('junos/parent.conf')[1], body: 'interfaces { $IFD { mtu 9192; aggregated-ether-options { minimum-links 1; } } }' },
    { ...snip('junos/member.conf')[1], body: 'interfaces { $IFD { apply-groups MEMBER; ether-options { 802.3ad $AE; } } }' },
    { ...snip('junos/group.conf')[1], body: 'groups { MEMBER { interfaces { <*> { traps; } } } }' },
  ];
  const sourceText = 'interfaces { ae1 { mtu 9192; aggregated-ether-options { minimum-links 1; } unit 0 { family inet; } unit 100 { family bridge; } } ae2 { mtu 9192; aggregated-ether-options { minimum-links 1; } unit 0 { family inet; } } et-0/0/0 { apply-groups MEMBER; ether-options { 802.3ad ae1; } } et-0/0/1 { apply-groups MEMBER; ether-options { 802.3ad ae1; } } et-0/0/2 { apply-groups MEMBER; ether-options { 802.3ad ae2; } } } ' + snips[3].body;
  const bindings = [
    { consumer: snips[0].rel, kind: 'interface-parent', scope: 'object', providers: [snips[1].rel] },
    { consumer: snips[0].rel, kind: 'lag-member', scope: 'object', providers: [snips[2].rel], declaredDependency: snips[2].rel, unbound: 'required' },
  ];
  const resolver = createOccurrenceResolver({ sourceText, device: 'd1', os: 'junos', snips });
  const args = { entries: resolver.occurrences(snips[0].rel).filter(row => row.binding.IFD === 'ae1'), resolver, sourceSha256: resolver.sourceSha256, bindings, device: 'd1', os: 'junos', snipIndex: new Map(snips.map(row => [row.rel, row])), headers: new Map([[snips[0].rel, { pairWith: [snips[2].rel] }], [snips[2].rel, { pairWith: [snips[3].rel] }]]) };
  assert.equal(args.entries.length, 1);
  const closure = closeOccurrenceTuple(args);
  assert.deepEqual(closure.failures, []);
  assert.equal(closure.included.filter(row => row.rel === snips[2].rel).length, 2);
  assert.equal(closure.edges.filter(edge => edge.requirement === snips[2].rel).length, 2);
  assert.ok(closeOccurrenceTuple({ ...args, bindings: [...bindings, bindings[0]] }).failures.some(row => row.kind === 'ambiguous-interface-relation'));
  assert.ok(closeOccurrenceTuple({ ...args, bindings: bindings.map(row => ({ ...row, providers: [] })) }).failures.some(row => row.kind === 'relation-unresolved-path'));
  assert.ok(closure.included.some(row => row.rel === snips[3].rel));
  const rendered = resolver.render({ ids: closure.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
  assert.ok(!rendered.body.includes('ae2') && !rendered.body.includes('unit 100'));
  assert.deepEqual(verifyOccurrenceEmission({ ...args, closure, rendered }).failures, []);
  const missingDeclaration = { ...closure, edges: closure.edges.filter(edge => edge.requirement !== snips[2].rel) };
  assert.ok(verifyOccurrenceEmission({ ...args, closure: missingDeclaration, rendered }).failures.some(row => row.kind === 'declared-prerequisite-not-planned'));
  const unbound = closeTuple({ entries: [snips[0].rel], device: 'd1', os: 'junos', snipIndex: args.snipIndex, headers: new Map(snips.map(row => [row.rel, args.headers.get(row.rel) ?? {}])), constructs: new Map(), variantMembers: [], definers: new Map(), matrix: { occurrenceBindings: bindings } });
  assert.equal(unbound.failures.filter(row => row.kind === 'occurrence-selection-required').length, 2);
  assert.deepEqual(unboundSelectionProblems(unbound), []);
  for (const rel of [snips[1].rel, snips[2].rel]) {
    const omitted = closure.included.find(row => row.rel === rel);
    const reduced = { ...closure, included: closure.included.filter(row => row.id !== omitted.id), edges: closure.edges.filter(edge => edge.to !== omitted.id && edge.from !== omitted.id) };
    const output = resolver.render({ ids: reduced.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
    assert.ok(verifyOccurrenceEmission({ ...args, closure: reduced, rendered: output }).failures.some(row => row.kind === 'related-source-not-emitted'));
  }
});

test('scheduler maps select all six source definitions through existing occurrence bindings', () => {
  const root = path.join(REPO_ROOT, 'service_provider/metro_ethernet_business_services/configuration');
  const rels = ['junos', 'evo'].flatMap(os => [
    `${os}/class-of-service/scheduler-maps/sm-6class-mapping.conf`,
    `${os}/class-of-service/schedulers/sc-2-priority-model.conf`,
    `${os}/class-of-service/forwarding-classes/fc-6queue-model.conf`,
  ]);
  const parsed = rels.map(rel => ({ rel, ...parseSnip(fs.readFileSync(path.join(root, 'snips', rel), 'utf8')) }));
  const snips = parsed.map(row => ({ rel: row.rel, dir: row.rel.split('/')[0], seenOn: row.header.seenOn, body: row.body }));
  const headers = new Map(parsed.map(row => [row.rel, row.header]));
  const snipIndex = new Map(snips.map(row => [row.rel, row]));
  let checked = 0;
  for (const file of fs.readdirSync(path.join(root, 'conf')).filter(file => file.endsWith('.conf'))) {
    const device = file.slice(0, -5);
    const os = ['junos', 'evo'].find(bucket => parsed[0].header.seenOn[bucket].includes(device));
    assert.ok(os, device);
    const sourceText = fs.readFileSync(path.join(root, 'conf', file), 'utf8');
    const resolver = createOccurrenceResolver({ sourceText, device, os, snips });
    for (const rel of rels.filter(rel => rel.includes('/scheduler-maps/'))) {
      const declared = `${rel.split('/')[0]}/class-of-service/schedulers/sc-2-priority-model.conf`;
      assert.ok(headers.get(rel).pairWith.includes(declared), 'The required scheduler declaration must remain');
      const args = { entries: resolver.occurrences(rel), resolver, sourceSha256: resolver.sourceSha256, device, os, headers, snipIndex, bindings: MATRIX.occurrenceBindings };
      assert.equal(args.entries.length, 1, `${rel}:${device}`);
      const closure = closeOccurrenceTuple(args);
      assert.deepEqual(closure.failures, [], `${rel}:${device}`);
      const schedulerReferences = args.entries[0].references.filter(reference => reference.kind === 'scheduler');
      assert.equal(schedulerReferences.length, 6);
      assert.equal(new Set(schedulerReferences.map(reference => reference.name)).size, 6);
      const providers = closure.included.filter(row => row.rel.includes('/schedulers/'));
      assert.equal(providers.length, 1);
      assert.ok(closure.edges.some(edge => edge.requirement === declared && edge.to === providers[0].id));
      for (const reference of schedulerReferences) {
        const resolution = resolver.resolve({ consumerId: args.entries[0].id, sourceSha256: resolver.sourceSha256, ...reference, candidates: [providers[0].rel], scope: 'whole' });
        assert.equal(resolution.status, 'ok');
        assert.ok(resolution.targetSourceIds.every(id => providers[0].sourceIds.includes(id)));
      }
      assert.ok(closure.included.some(row => row.rel.includes('/forwarding-classes/')));
      const rendered = resolver.render({ ids: closure.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
      assert.deepEqual(verifyOccurrenceEmission({ ...args, closure, rendered }).failures, []);
      const missing = resolver.render({ ids: closure.included.filter(row => row.id !== providers[0].id).map(row => row.id), sourceSha256: resolver.sourceSha256 });
      assert.ok(verifyOccurrenceEmission({ ...args, closure, rendered: missing }).failures.length);
      const withoutProvider = new Map(snipIndex);
      withoutProvider.delete(providers[0].rel);
      assert.ok(closeOccurrenceTuple({ ...args, snipIndex: withoutProvider }).failures.some(row => row.kind === 'dependency-invalid-binding'));
      const badScope = MATRIX.occurrenceBindings.map(binding => binding.consumer === rel && binding.kind === 'scheduler' ? { ...binding, scope: 'object' } : binding);
      assert.ok(closeOccurrenceTuple({ ...args, bindings: badScope }).failures.some(row => row.kind === 'dependency-invalid-binding'));
      if (providers[0].rel !== declared) {
        const noSelection = MATRIX.occurrenceBindings.map(binding => binding.consumer === rel && binding.kind === 'scheduler' ? { ...binding, declaredDependency: undefined } : binding);
        assert.ok(closeOccurrenceTuple({ ...args, bindings: noSelection }).failures.some(row => row.kind === 'dependency-unavailable'));
      }
      checked++;
    }
  }
  assert.equal(checked, 40);
});

test('MEBS parent and member bindings close every claimed unit occurrence', async () => {
  const root = path.join(REPO_ROOT, 'service_provider/metro_ethernet_business_services');
  const { loadJvd } = await import('./object-ownership.mjs');
  const { snips } = await loadJvd(root);
  const snipIndex = new Map(snips.map(row => [row.rel, row]));
  const headers = new Map(snips.map(row => [row.rel, parseSnip(fs.readFileSync(path.join(root, 'configuration/snips', row.rel), 'utf8')).header]));
  const variantMembers = snips.filter(row => headers.get(row.rel).variantGroup).map(row => ({ ...row, os: row.dir, jvd: 'mebs', group: headers.get(row.rel).variantGroup.name, provides: headers.get(row.rel).variantGroup.provides }));
  const consumers = [...new Set(MATRIX.occurrenceBindings.filter(row => ['interface-parent', 'lag-member'].includes(row.kind)).map(row => row.consumer))];
  assert.ok(consumers.length);
  let checked = 0;
  let aggregateCount = 0;
  let plainMemberCount = 0;
  for (const os of ['junos', 'evo']) for (const device of [...new Set(consumers.flatMap(rel => headers.get(rel).seenOn[os]))]) {
    const sourceText = fs.readFileSync(path.join(root, 'configuration/conf', `${device}.conf`), 'utf8');
    const resolver = createOccurrenceResolver({ sourceText, device, os, snips });
    for (const rel of consumers.filter(rel => headers.get(rel).seenOn[os].includes(device))) {
      const entries = resolver.occurrences(rel);
      assert.ok(entries.length, `${device}:${rel}`);
      const args = { entries, resolver, sourceSha256: resolver.sourceSha256, headers, snipIndex, variantMembers, device, os, bindings: MATRIX.occurrenceBindings, capabilityRequirements: MATRIX.capabilityRequirements };
      const closure = closeOccurrenceTuple(args);
      assert.deepEqual(closure.failures, [], `${device}:${rel}`);
      if (rel === 'junos/interfaces/core-isis-mpls.conf') {
        aggregateCount += entries.length;
        for (const entry of entries) {
          const selected = resolver.resolveRelated({ consumerId: entry.id, sourceSha256: resolver.sourceSha256, kind: 'lag-member', candidates: MATRIX.occurrenceBindings.find(row => row.consumer === rel && row.kind === 'lag-member').providers });
          assert.equal(selected.status, 'ok');
          assert.equal(selected.selected.length, 1);
          for (const member of selected.selected) {
            assert.ok(closure.edges.some(edge => edge.from === entry.id && edge.to === member.id && edge.requirement === 'junos/interfaces/ifd-core-lag-member.conf'));
            if (member.rel === 'evo/interfaces/ifd-lag-member-ether.conf') {
              assert.equal(device, 'meg2_acx7509');
              assert.equal(entry.binding.CORE_PHYS, 'ae4');
              assert.equal(headers.get(member.rel).pairWith.length, 0);
              assert.ok(!member.rendered.includes('apply-groups'));
              plainMemberCount++;
            }
          }
        }
      }
      const rendered = resolver.render({ ids: closure.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
      assert.deepEqual(verifyOccurrenceEmission({ ...args, closure, rendered }).failures, [], `${device}:${rel}`);
      checked += entries.length;
    }
  }
  assert.ok(checked > 0);
  assert.equal(aggregateCount, 28);
  assert.equal(plainMemberCount, 1);
});

test('MEBS interface repairs retain declarations and reconstruct every affected source occurrence', async () => {
  const root = path.join(REPO_ROOT, 'service_provider/metro_ethernet_business_services');
  const { loadJvd } = await import('./object-ownership.mjs');
  const { snips } = await loadJvd(root);
  const snipIndex = new Map(snips.map(row => [row.rel, row]));
  const headers = new Map(snips.map(row => [row.rel, parseSnip(fs.readFileSync(path.join(root, 'configuration/snips', row.rel), 'utf8')).header]));
  const variantMembers = snips.filter(row => headers.get(row.rel).variantGroup).map(row => ({ ...row, os: row.dir, jvd: 'mebs', group: headers.get(row.rel).variantGroup.name, provides: headers.get(row.rel).variantGroup.provides }));
  const consumers = ['evo/protocols/isis-srmpls-tilfa.conf', 'evo/protocols/l2circuit-lsw.conf', 'evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf', 'junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based.conf'];
  for (const os of ['junos', 'evo']) for (const device of [...new Set(consumers.flatMap(rel => headers.get(rel).seenOn[os]))]) {
    const resolver = createOccurrenceResolver({ sourceText: fs.readFileSync(path.join(root, 'configuration/conf', `${device}.conf`), 'utf8'), device, os, snips });
    for (const rel of consumers.filter(rel => headers.get(rel).seenOn[os].includes(device))) {
      const entries = resolver.occurrences(rel);
      assert.ok(entries.length);
      const binding = MATRIX.occurrenceBindings.find(row => row.consumer === rel && row.kind === 'logical-interface');
      assert.ok(headers.get(rel).pairWith.includes(binding.declaredDependency));
      const args = { entries, resolver, sourceSha256: resolver.sourceSha256, headers, snipIndex, variantMembers, device, os, bindings: MATRIX.occurrenceBindings, capabilityRequirements: MATRIX.capabilityRequirements };
      const closure = closeOccurrenceTuple(args);
      assert.deepEqual(closure.failures, [], `${device}:${rel}`);
      for (const entry of entries) for (const reference of entry.references.filter(row => row.kind === 'logical-interface')) assert.ok(closure.edges.some(edge => edge.from === entry.id && edge.requirement === binding.declaredDependency && edge.reference?.name === reference.name));
      const rendered = resolver.render({ ids: closure.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
      assert.deepEqual(verifyOccurrenceEmission({ ...args, closure, rendered }).failures, [], `${device}:${rel}`);
    }
  }
});

test('declared variable providers collectively satisfy references without dropping dependencies', () => {
  const snips = [
    { ...snip('junos/consumer.conf')[1], body: 'protocols { bgp { group TEST { import [ A B ]; } } }' },
    { ...snip('junos/accept.conf')[1], body: 'policy-options { policy-statement $POLICY { then accept; } }' },
    { ...snip('junos/reject.conf')[1], body: 'policy-options { policy-statement $POLICY { then reject; } }' },
    { ...snip('junos/extra.conf')[1], body: 'policy-options { policy-statement REQUIRED { then accept; } }' },
  ];
  const sourceText = 'protocols { bgp { group TEST { import [ A B ]; } } } policy-options { policy-statement A { then accept; } policy-statement B { then reject; } }';
  const check = (source, pairWith, bindings = []) => {
    const resolver = createOccurrenceResolver({ sourceText: source, device: 'd1', os: 'junos', snips });
    const args = { entries: resolver.occurrences(snips[0].rel), resolver, sourceSha256: resolver.sourceSha256, device: 'd1', os: 'junos', snipIndex: new Map(snips.map(row => [row.rel, row])), headers: new Map([[snips[0].rel, { pairWith }]]), bindings };
    assert.equal(args.entries.length, 1);
    const closure = closeOccurrenceTuple(args);
    const rendered = resolver.render({ ids: closure.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
    return { closure, verification: verifyOccurrenceEmission({ ...args, closure, rendered }) };
  };
  const pairWith = [snips[1].rel, snips[2].rel];
  const result = check(sourceText, pairWith);
  assert.deepEqual(result.closure.failures, []);
  assert.deepEqual(result.verification.failures, []);
  assert.deepEqual(result.closure.edges.map(edge => edge.requirement).sort(), [...pairWith].sort());
  const typedRule = { consumer: snips[0].rel, kind: 'policy-statement', providers: [snips[2].rel], scope: 'whole' };
  const typed = check(sourceText, [snips[1].rel], [typedRule]);
  assert.deepEqual(typed.closure.failures, []);
  assert.deepEqual(typed.verification.failures, []);
  assert.ok(typed.closure.edges.some(edge => edge.requirement === snips[1].rel));
  assert.ok(typed.closure.edges.some(edge => edge.reference?.name === 'B'));
  assert.ok(check(sourceText, [snips[1].rel], [{ ...typedRule, providers: [snips[1].rel] }]).closure.failures.length);
  assert.ok(check(sourceText, pairWith.slice(0, 1)).closure.failures.length);
  assert.ok(check(sourceText.replace('policy-statement B { then reject; }', ''), pairWith).closure.failures.length);
  assert.ok(check(sourceText, [...pairWith, snips[3].rel]).closure.failures.some(row => row.kind === 'dependency-source-unavailable'));
});

test('PS anchor context must be planned and emitted, not merely present in the source', () => {
  const snips = [
    { ...snip('junos/service.conf')[1], body: 'interfaces { $IFD { unit $UNIT { encapsulation vlan-bridge; vlan-id $VLAN; } } }' },
    { ...snip('junos/transport.conf')[1], body: 'interfaces { $IFD { unit 0 { encapsulation ethernet-ccc; } } }' },
    { ...snip('junos/capacity.conf')[1], body: 'chassis { pseudowire-service { device-count $COUNT; } }' },
    { ...snip('junos/tunnel.conf')[1], body: 'chassis { fpc $FPC { pic $PIC { tunnel-services; } } }' },
    { ...snip('junos/anchor.conf')[1], body: 'interfaces { $IFD { anchor-point { $ANCHOR; } } }' },
  ];
  const sourceText = 'chassis { pseudowire-service { device-count 100; } fpc 0 { pic 0 { tunnel-services; } } } interfaces { ps0 { anchor-point { lt-0/0/0; } unit 0 { encapsulation ethernet-ccc; } unit 100 { encapsulation vlan-bridge; vlan-id 200; } } ps1 { anchor-point { lt-0/0/0; } unit 0 { encapsulation ethernet-ccc; } } }';
  const resolver = createOccurrenceResolver({ sourceText, device: 'd1', os: 'junos', snips });
  const args = { entries: resolver.occurrences(snips[0].rel), resolver, sourceSha256: resolver.sourceSha256, device: 'd1', os: 'junos', snipIndex: new Map(snips.map(row => [row.rel, row])), headers: new Map(), bindings: [] };
  const check = entries => {
    const closure = closeOccurrenceTuple({ ...args, entries });
    const rendered = resolver.render({ ids: closure.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
    const verification = verifyOccurrenceEmission({ ...args, closure, rendered });
    return { closure, verification };
  };
  const missing = check(args.entries);
  assert.ok(missing.closure.failures.some(row => row.kind === 'required-context-not-planned'));
  assert.ok(missing.verification.failures.some(row => row.kind === 'required-context-not-emitted'));
  const anchors = resolver.occurrences(snips[4].rel);
  const correct = check([...args.entries, anchors.find(row => row.binding.IFD === 'ps0')]);
  assert.deepEqual(correct.closure.failures, []);
  assert.deepEqual(correct.verification.failures, []);
  assert.ok(check([...args.entries, anchors.find(row => row.binding.IFD === 'ps1')]).verification.failures.some(row => row.kind === 'required-context-not-emitted'));
});

test('PS service occurrences emit matching transport, capacity and tunnel prerequisites', () => {
  const root = path.join(REPO_ROOT, 'service_provider/metro_ethernet_business_services/configuration');
  const rels = ['junos/interfaces/ifl-ps-vlan-bridge-esi.conf', 'junos/interfaces/ifd-ps-transport.conf', 'junos/chassis/pseudowire-service.conf', 'junos/chassis/tunnel-services.conf'];
  const parsed = rels.map(rel => ({ rel, ...parseSnip(fs.readFileSync(path.join(root, 'snips', rel), 'utf8')) }));
  const snips = parsed.map(row => ({ rel: row.rel, dir: 'junos', body: row.body, seenOn: row.header.seenOn }));
  const headers = new Map(parsed.map(row => [row.rel, row.header]));
  const snipIndex = new Map(snips.map(row => [row.rel, row]));
  for (const device of ['mse1_mx304', 'mse2_mx304']) {
    const sourceText = fs.readFileSync(path.join(root, 'conf', `${device}.conf`), 'utf8');
    const resolver = createOccurrenceResolver({ sourceText, device, os: 'junos', snips });
    const entries = resolver.occurrences(rels[0]);
    assert.equal(entries.length, 110);
    assert.equal(resolver.occurrences(rels[1]).length, 20);
    const args = { entries, resolver, sourceSha256: resolver.sourceSha256, headers, snipIndex, device, os: 'junos', bindings: [] };
    const closure = closeOccurrenceTuple(args);
    assert.deepEqual(closure.failures, []);
    for (const entry of entries) {
      const transportEdge = closure.edges.find(edge => edge.from === entry.id && edge.requirement === rels[1]);
      const transport = closure.included.find(row => row.id === transportEdge.to);
      assert.equal(transport.binding.PS_INTF, entry.binding.PS_INTF);
      assert.notEqual(entry.binding.UNIT, '0');
      assert.match(transport.rendered, /unit 0 \{/);
    }
    const rendered = resolver.render({ ids: closure.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
    assert.equal((rendered.body.match(/tunnel-services;/g) ?? []).length, 1);
    assert.equal((rendered.body.match(/device-count 100;/g) ?? []).length, 1);
    assert.equal((rendered.body.match(/anchor-point/g) ?? []).length, 20);
    assert.deepEqual(verifyOccurrenceEmission({ ...args, closure, rendered }).failures, []);
    const single = closeOccurrenceTuple({ ...args, entries: entries.slice(0, 1) });
    const correct = single.included.find(row => row.rel === rels[1]);
    const wrong = resolver.occurrences(rels[1]).find(row => row.binding.PS_INTF !== correct.binding.PS_INTF);
    const tampered = { ...single, included: single.included.map(row => row.id === correct.id ? wrong : row), edges: single.edges.map(edge => ({ ...edge, from: edge.from === correct.id ? wrong.id : edge.from, to: edge.to === correct.id ? wrong.id : edge.to })) };
    const tamperedOutput = resolver.render({ ids: tampered.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
    assert.ok(verifyOccurrenceEmission({ ...args, closure: tampered, rendered: tamperedOutput }).failures.some(row => row.kind === 'required-occurrence-not-emitted'));
    for (const os of ['junos', 'evo']) {
      const rel = `${os}/interfaces/ifl-vlan-bridge-esi.conf`;
      const generic = parseSnip(fs.readFileSync(path.join(root, 'snips', rel), 'utf8'));
      const expanded = [...snips, { rel, dir: os, body: generic.body, seenOn: generic.header.seenOn }];
      const genericResolver = createOccurrenceResolver({ sourceText, device, os: 'junos', snips: expanded });
      const genericEntries = genericResolver.occurrences(rel).filter(row => row.references.some(reference => reference.kind === 'ps-device-capacity'));
      assert.equal(genericEntries.length, 110);
      const genericArgs = { ...args, entries: genericEntries, resolver: genericResolver, headers: new Map([...headers, [rel, generic.header]]), snipIndex: new Map(expanded.map(row => [row.rel, row])), bindings: MATRIX.occurrenceBindings };
      const genericClosure = closeOccurrenceTuple(genericArgs);
      assert.deepEqual(genericClosure.failures, []);
    }
    const insufficient = createOccurrenceResolver({ sourceText: sourceText.replace('device-count 100;', 'device-count 1;'), device, os: 'junos', snips });
    const failed = closeOccurrenceTuple({ ...args, entries: insufficient.occurrences(rels[0]).slice(0, 1), resolver: insufficient, sourceSha256: insufficient.sourceSha256 });
    assert.ok(failed.failures.some(row => row.kind === 'declared-occurrence-insufficient-ps-capacity'));
  }
});

test('MCP-reported FAT-PW, physical-member and filter consumers close every claimed source occurrence', async () => {
  const root = path.join(REPO_ROOT, 'service_provider/metro_ethernet_business_services');
  const { loadJvd } = await import('./object-ownership.mjs');
  const { snips } = await loadJvd(root);
  const snipIndex = new Map(snips.map(row => [row.rel, row]));
  const headers = new Map(snips.map(row => [row.rel, parseSnip(fs.readFileSync(path.join(root, 'configuration/snips', row.rel), 'utf8')).header]));
  const variantMembers = snips.filter(row => headers.get(row.rel).variantGroup).map(row => ({ ...row, os: row.dir, jvd: 'mebs', group: headers.get(row.rel).variantGroup.name, provides: headers.get(row.rel).variantGroup.provides }));
  const consumers = ['evo/routing-instances/apply-groups/gr-fatpw-label.conf', 'junos/routing-instances/apply-groups/gr-fatpw-label.conf', 'evo/routing-instances/apply-groups/gr-l3vpn-fatpw-label.conf', ...['junos', 'evo'].flatMap(os => [`${os}/interfaces/ifd-core-lag-member.conf`, `${os}/interfaces/ifl-vlan-ccc-vlan-map-filter.conf`])];
  const exclusions = JSON.parse(fs.readFileSync(path.join(root, 'configuration/snips/_source-exclusions.json')));
  for (const os of ['junos', 'evo']) {
    const devices = [...new Set(consumers.flatMap(rel => headers.get(rel).seenOn[os]))];
    for (const device of devices) {
      const resolver = createOccurrenceResolver({ sourceText: fs.readFileSync(path.join(root, 'configuration/conf', `${device}.conf`), 'utf8'), device, os, snips, exclusions });
      for (const rel of consumers.filter(rel => headers.get(rel).seenOn[os].includes(device))) {
        const args = { entries: resolver.occurrences(rel), resolver, sourceSha256: resolver.sourceSha256, device, os, headers, snipIndex, variantMembers, bindings: MATRIX.occurrenceBindings, capabilityRequirements: MATRIX.capabilityRequirements };
        assert.ok(args.entries.length, `${rel}:${device}: missing source occurrence`);
        const closure = closeOccurrenceTuple(args);
        assert.deepEqual(closure.failures, [], `${rel}:${device}`);
        const rendered = resolver.render({ ids: closure.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
        assert.deepEqual(verifyOccurrenceEmission({ ...args, closure, rendered }).failures, [], `${rel}:${device}`);
        if (rel.includes('vlan-map-filter')) {
          assert.ok(closure.included.some(row => row.rel === 'evo/firewall/filter-family-any-50mb.conf'));
          assert.ok(closure.included.some(row => row.rel.endsWith('/firewall/policers.conf')));
        }
      }
    }
  }
});

test('residual root application and default-import classifier reconstruct with declared prerequisites', async () => {
  const root = path.join(REPO_ROOT, 'service_provider/metro_ethernet_business_services/configuration');
  const { sourceTree, occurrenceMap } = await import('./generate-bindings.mjs');
  const cases = [
    { rel: 'junos/apply-groups/gr-ae-interface-mtu.conf', device: 'an1_mx204', os: 'junos', expected: /apply-groups \[ AE-INTERFACE-MTU \];/ },
    { rel: 'evo/class-of-service/classifiers/cl-6class-exp-import-default.conf', device: 'an3_acx7100-48l', os: 'evo', expected: /import default;/ },
  ];
  const load = rel => ({ rel, ...parseSnip(fs.readFileSync(path.join(root, 'snips', rel), 'utf8')) });
  for (const fixture of cases) {
    const consumer = load(fixture.rel);
    const providers = consumer.header.pairWith.map(load);
    for (const file of fs.readdirSync(path.join(root, 'conf')).filter(file => file.endsWith('.conf'))) {
      const sourceText = fs.readFileSync(path.join(root, 'conf', file), 'utf8');
      const matches = occurrenceMap(consumer.body, sourceTree(sourceText));
      assert.equal(matches.instances.length, file === `${fixture.device}.conf` ? 1 : 0, `${fixture.rel}:${file}`);
    }
    const parsed = [consumer, ...providers];
    const snips = parsed.map(row => ({ rel: row.rel, dir: row.rel.split('/')[0], body: row.body, seenOn: row.header.seenOn }));
    const resolver = createOccurrenceResolver({ sourceText: fs.readFileSync(path.join(root, 'conf', `${fixture.device}.conf`), 'utf8'), device: fixture.device, os: fixture.os, snips });
    const args = { entries: resolver.occurrences(fixture.rel), resolver, sourceSha256: resolver.sourceSha256, device: fixture.device, os: fixture.os, snipIndex: new Map(snips.map(row => [row.rel, row])), headers: new Map(parsed.map(row => [row.rel, row.header])), bindings: [] };
    const closure = closeOccurrenceTuple(args);
    assert.deepEqual(closure.failures, [], fixture.rel);
    for (const provider of providers) assert.ok(closure.included.some(row => row.rel === provider.rel));
    const rendered = resolver.render({ ids: closure.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
    assert.match(rendered.body, fixture.expected);
    assert.deepEqual(verifyOccurrenceEmission({ ...args, closure, rendered }).failures, [], fixture.rel);
  }
});

test('unbound gate requires a matching actionable input for every fail-closed tuple', () => {
  const failure = { kind: 'occurrence-selection-required', from: 'consumer', detail: 'logical-interface:$AC' };
  const input = { from: 'consumer', construct: failure.detail, selection: 'source-occurrence-or-explicit-input', choices: ['provider'] };
  assert.deepEqual(unboundSelectionProblems({ failures: [failure], requiredInputs: [input] }), []);
  for (const requiredInputs of [[], [{ ...input, choices: [] }], [{ ...input, from: 'other' }], [{ ...input, construct: 'other' }], [{ ...input, selection: undefined }]]) {
    assert.equal(unboundSelectionProblems({ failures: [failure], requiredInputs }).length, 1);
  }
  assert.equal(unboundSelectionProblems({ failures: [failure, { ...failure, kind: 'dependency-unavailable' }], requiredInputs: [input] }).length, 1);
});

test('emission verification rejects a missing prerequisite even with complete feature coverage', () => {
  const snips = [
    { ...snip('junos/consumer.conf')[1], body: 'protocols { isis { export POLICY; } }' },
    { ...snip('junos/policy.conf')[1], body: 'policy-options { policy-statement POLICY { then accept; } }' },
  ];
  const resolver = createOccurrenceResolver({ sourceText: snips.map(row => row.body).join('\n'), device: 'd1', os: 'junos', snips });
  const headers = new Map([[snips[0].rel, parseSnip('/*\n * Topic: Consumer\n * Pair with:\n *  - junos/policy.conf\n */\n' + snips[0].body).header], [snips[1].rel, {}]]);
  const args = { entries: resolver.occurrences(snips[0].rel), resolver, sourceSha256: resolver.sourceSha256, headers, snipIndex: new Map(snips.map(row => [row.rel, row])), bindings: [], device: 'd1', os: 'junos' };
  const closure = closeOccurrenceTuple(args);
  assert.deepEqual(closure.failures, []);
  const rendered = resolver.render({ ids: closure.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
  assert.deepEqual(verifyOccurrenceEmission({ ...args, closure, rendered }).failures, []);
  const corrupted = { ...rendered, body: rendered.body.replace('then accept;', 'then reject;') };
  assert.notEqual(corrupted.body, rendered.body);
  assert.ok(verifyOccurrenceEmission({ ...args, closure, rendered: corrupted }).failures.some(row => row.kind === 'rendered-source-projection-mismatch'));
  const formatted = { ...rendered, body: '\n' + rendered.body.replaceAll('  ', '    ') + '\n' };
  assert.deepEqual(verifyOccurrenceEmission({ ...args, closure, rendered: formatted }).failures, []);
  const missing = resolver.render({ ids: args.entries.map(row => row.id), sourceSha256: resolver.sourceSha256 });
  assert.ok(verifyOccurrenceEmission({ ...args, closure, rendered: missing }).failures.some(row => row.kind === 'required-occurrence-not-emitted'));
  assert.ok(verifyOccurrenceEmission({ ...args, closure: { ...closure, edges: [] }, rendered }).failures.some(row => row.kind === 'declared-prerequisite-not-planned'));
  const duplicate = structuredClone(rendered);
  duplicate.occurrences[1].contributedSourceIds.push(duplicate.occurrences[0].contributedSourceIds[0]);
  assert.ok(verifyOccurrenceEmission({ ...args, closure, rendered: duplicate }).failures.some(row => row.kind === 'duplicate-source-emission'));
});

test('both closures reject missing configured capability declarations for consumers and members', () => {
  const token = 'transport:colour-classes';
  const consumer = { ...snip('junos/consumer.conf')[1], body: 'routing-options { resolution { scheme x { resolution-ribs junos-rti-tc-101.inet.3; } } }' };
  const provider = { ...snip('junos/provider.conf')[1], body: 'routing-options { transport-class { name fast { color 101; } } }' };
  const snips = [consumer, provider];
  const headers = new Map([[consumer.rel, { variantRequires: [{ group: 'transport-form', families: [token] }] }], [provider.rel, { variantGroup: { name: 'transport-form', provides: [token] } }]]);
  const capabilityRequirements = { 'transport-form': { [token]: { colours: ['101'] } } };
  const resolver = createOccurrenceResolver({ sourceText: snips.map(row => row.body).join('\n'), device: 'd1', os: 'junos', snips });
  const args = { device: 'd1', os: 'junos', headers, snipIndex: new Map(snips.map(row => [row.rel, row])), variantMembers: [{ ...provider, os: 'junos', jvd: 'mebs', group: 'transport-form', provides: [token] }], constructs: new Map(), definers: new Map() };
  for (const rel of [consumer.rel, provider.rel]) {
    const bound = { ...args, entries: resolver.occurrences(rel), resolver, sourceSha256: resolver.sourceSha256, bindings: [] };
    assert.deepEqual(closeTuple({ ...args, entries: [rel], matrix: { capabilityRequirements } }).failures, []);
    assert.deepEqual(closeOccurrenceTuple({ ...bound, capabilityRequirements }).failures, []);
    for (const missing of [undefined, null, {}, { other: capabilityRequirements['transport-form'] }]) {
      for (const matrix of [undefined, {}, { capabilityRequirements: missing }]) {
        assert.ok(closeTuple({ ...args, entries: [rel], matrix }).failures.some(row => row.kind === 'capability-mismatch'), `${rel}: missing symbolic declaration`);
      }
      assert.ok(closeOccurrenceTuple({ ...bound, capabilityRequirements: missing }).failures.some(row => row.kind === 'source-capability-mismatch'), `${rel}: missing bound declaration`);
    }
  }
});

test('resolution requires emitted transport-class witnesses even without named references', () => {
  const resolution = { ...snip('junos/resolution.conf')[1], body: 'routing-options { resolution { scheme gold { resolution-ribs [ junos-rti-tc-4000.inet.3 junos-rti-tc-6000.inet.3 ]; mapping-community color:0:4000; } } }' };
  const transport = { ...snip('junos/transport.conf')[1], body: 'routing-options { transport-class { name gold { color 4000; } name bronze { color 6000; } } }' };
  const snips = [resolution, transport];
  const resolver = createOccurrenceResolver({ sourceText: snips.map(row => row.body).join('\n'), device: 'd1', os: 'junos', snips });
  const args = { entries: resolver.occurrences(resolution.rel), resolver, sourceSha256: resolver.sourceSha256, device: 'd1', os: 'junos', snipIndex: new Map(snips.map(row => [row.rel, row])), headers: new Map(), bindings: [], entrySets: { transport: [transport.rel] }, sourceRequirements: [{ consumer: resolution.rel, kind: 'resolution-transport-class', basis: 'functional-necessity', entrySet: 'transport', evidence: { device: 'lab-fixture', date: '2026-09-23' } }] };
  const closure = closeOccurrenceTuple(args);
  assert.deepEqual(closure.failures, []);
  assert.equal(closure.edges.filter(row => row.basis === 'functional-necessity').length, 2);
  const rendered = resolver.render({ ids: closure.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
  assert.deepEqual(verifyOccurrenceEmission({ ...args, closure, rendered }).failures, []);
  const missing = resolver.render({ ids: args.entries.map(row => row.id), sourceSha256: resolver.sourceSha256 });
  assert.ok(verifyOccurrenceEmission({ ...args, closure, rendered: missing }).failures.some(row => row.kind === 'required-occurrence-not-emitted'));
  assert.ok(closeOccurrenceTuple({ ...args, entrySets: { transport: [] } }).failures.some(row => row.kind === 'source-requirement-unavailable'));
});

test("all resolution headers conserve policy edges and resolve transport providers without matrix relationships", () => {
  const root = path.join(REPO_ROOT, "service_provider/metro_ethernet_business_services/configuration");
  const load = rel => ({ rel, ...parseSnip(fs.readFileSync(path.join(root, "snips", rel), "utf8")) });
  const members = ["junos/routing-options/transport-class.conf", "evo/routing-options/transport-class.conf", "junos/routing-options/transport-class-fallback-none.conf", "junos/routing-options/transport-class-gold-bronze-anycast.conf", "junos/routing-options/transport-class-gold-local-bronze-anycast.conf"].map(rel => {
    const parsed = load(rel);
    return { rel, jvd: "mebs", os: rel.split("/")[0], body: parsed.body, seenOn: parsed.header.seenOn, group: parsed.header.variantGroup.name, provides: parsed.header.variantGroup.provides };
  });
  const checkedDevices = new Set();
  for (const form of ["", "-l3vpn-rib", "-l3vpn-rib-v6-first"]) for (const os of ["junos", "evo"]) {
    const consumer = load(`${os}/routing-options/resolution-transport-class${form}.conf`);
    const highlights = consumer.header.highlights.join("\n");
    if (!form) assert.match(highlights, /require same-device transport-class definitions for gold \(colour 4000\) and bronze \(colour 6000\)/);
    assert.deepEqual(consumer.header.variantRequires, [{ group: "mebs-colour-transport", families: ["transport:colour-classes"] }]);
    assert.deepEqual(consumer.header.pairWith, form ? [`${os}/policy-options/policy-statement/ps-multipath.conf`] : []);
    if (os === "junos" && !form) {
      assert.match(highlights, /required provider depends on the device/);
      assert.match(highlights, /`junos\/routing-options\/transport-class-fallback-none\.conf` on an4_acx710/);
      assert.match(highlights, /`junos\/routing-options\/transport-class\.conf` on the other listed Junos devices/);
      assert.match(highlights, /alternatives, not cumulative prerequisites/);
    }
    for (const device of consumer.header.seenOn[os]) {
      checkedDevices.add(device);
      const suffix = { an4_acx710: "-fallback-none", mse1_mx304: "-gold-local-bronze-anycast", mse2_mx304: "-gold-bronze-anycast" }[device] ?? "";
      const provider = load(`${os}/routing-options/transport-class${suffix}.conf`);
      const selectedSnips = [consumer, provider, ...consumer.header.pairWith.map(load)];
      assert.ok(provider.header.seenOn[os].includes(device));
      const request = { group: consumer.header.variantRequires[0].group, selectors: consumer.header.variantRequires[0].families, consumerJvd: "mebs", targetDevice: device, targetOS: os, members };
      const selected = resolveVariant(request);
      assert.equal(selected.status, "ok", device);
      assert.equal(selected.member.rel, provider.rel, device);
      assert.equal(selected.crossDirectory, false, device);
      assert.equal(resolveVariant({ ...request, members: members.filter(row => !row.seenOn[os].includes(device)) }).status, "unavailable", device);
      assert.equal(resolveVariant({ ...request, members: [...members, { ...selected.member, rel: `${os}/conflicting.conf`, body: selected.member.body.replace("color 6000;", "color 6000; description conflict;") }] }).status, "ambiguous", device);
      const requirement = MATRIX.sourceRequirements.find(row => row.consumer === consumer.rel && row.kind === "resolution-transport-class");
      assert.ok(requirement, consumer.rel);
      assert.ok(MATRIX.occurrenceEntrySets[requirement.entrySet].includes(provider.rel));
      const resolver = createOccurrenceResolver({
        sourceText: fs.readFileSync(path.join(root, "conf", `${device}.conf`), "utf8"),
        device, os,
        snips: selectedSnips.map(row => ({ rel: row.rel, body: row.body, seenOn: row.header.seenOn })),
      });
      assert.equal(resolver.occurrences(consumer.rel).length, 1, `${device}: resolution`);
      assert.equal(resolver.occurrences(provider.rel).length, 1, `${device}: required provider`);
      const closureArgs = {
        entries: resolver.occurrences(consumer.rel), resolver, sourceSha256: resolver.sourceSha256,
        device, os, bindings: [], variantMembers: members, capabilityRequirements: MATRIX.capabilityRequirements,
        headers: new Map(selectedSnips.map(row => [row.rel, row.header])),
        snipIndex: new Map(selectedSnips.map(row => [row.rel, { rel: row.rel, dir: os, body: row.body, seenOn: row.header.seenOn }])),
      };
      const closure = closeOccurrenceTuple(closureArgs);
      assert.deepEqual(closure.failures, [], device);
      assert.ok(closure.included.some(row => row.rel === provider.rel), device);
      for (const fixed of consumer.header.pairWith) assert.ok(closure.included.some(row => row.rel === fixed), `${device}: retained ${fixed}`);
      const rendered = resolver.render({ ids: closure.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
      assert.deepEqual(verifyOccurrenceEmission({ ...closureArgs, closure, rendered }).failures, [], device);
      const missing = resolver.render({ ids: closureArgs.entries.map(row => row.id), sourceSha256: resolver.sourceSha256 });
      assert.ok(verifyOccurrenceEmission({ ...closureArgs, closure, rendered: missing }).failures.some(row => row.kind === "required-occurrence-not-emitted"), device);
    }
  }
  assert.equal(checkedDevices.size, 17);
});

test("filter applicability and policer closure reconstruct on all seven devices including AN1", () => {
  const root = path.join(REPO_ROOT, "service_provider/metro_ethernet_business_services/configuration");
  const paths = ["evo/firewall/filter-family-any-50mb.conf", "evo/firewall/policers.conf", "junos/firewall/policers.conf"];
  const parsed = paths.map(rel => ({ rel, ...parseSnip(fs.readFileSync(path.join(root, "snips", rel), "utf8")) }));
  const snips = parsed.map(row => ({ rel: row.rel, dir: row.rel.split('/')[0], body: row.body, seenOn: row.header.seenOn }));
  const headers = new Map(parsed.map(row => [row.rel, row.header]));
  const snipIndex = new Map(snips.map(row => [row.rel, row]));
  const variantMembers = parsed.slice(1).map(row => ({ rel: row.rel, os: row.rel.split('/')[0], jvd: 'mebs', group: row.header.variantGroup.name, provides: row.header.variantGroup.provides, body: row.body, seenOn: row.header.seenOn }));
  let checked = 0;
  for (const os of ['junos', 'evo']) for (const device of parsed[0].header.seenOn[os]) {
    const resolver = createOccurrenceResolver({ sourceText: fs.readFileSync(path.join(root, 'conf', `${device}.conf`), 'utf8'), device, os, snips });
    const args = { entries: resolver.occurrences(paths[0]), resolver, sourceSha256: resolver.sourceSha256, device, os, headers, snipIndex, variantMembers, bindings: MATRIX.occurrenceBindings, capabilityRequirements: MATRIX.capabilityRequirements };
    assert.equal(args.entries.length, 1);
    const closure = closeOccurrenceTuple(args);
    assert.deepEqual(closure.failures, [], device);
    const provider = device === 'an1_mx204' ? paths[2] : paths[1];
    assert.ok(closure.included.some(row => row.rel === provider));
    const rendered = resolver.render({ ids: closure.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
    assert.deepEqual(verifyOccurrenceEmission({ ...args, closure, rendered }).failures, [], device);
    assert.equal((rendered.body.match(/filter 50MB_filter\s*\{/g) ?? []).length, 1);
    if (device === 'an1_mx204') assert.match(rendered.body, /burst-size-limit 10m;/);
    const wrong = structuredClone(MATRIX.capabilityRequirements);
    wrong['mebs-rate-limit-policers']['firewall:policers'].policers.push('not-in-source');
    assert.ok(closeOccurrenceTuple({ ...args, capabilityRequirements: wrong }).failures.some(row => row.kind === 'source-capability-mismatch'));
    checked++;
  }
  assert.equal(checked, 7);
});

test("parsed variant prerequisites reach both closures and traverse member dependencies", () => {
  const parse = (metadata, body) => parseSnip(`/*\n * Topic: Test construct\n * Seen on:\n *   Junos: d1\n *   EVO: (none)\n${metadata}\n */\n${body}`);
  const consumer = parse(" * Pair with:\n *  - variant:test-overlay families=evpn", "routing-instances { TEST { instance-type evpn; } }");
  const provider = parse(" * Variant group: test-overlay\n *   Provides: evpn\n * Pair with:\n *  - junos/missing.conf", "protocols { bgp { group TEST { family evpn { signaling; } } } }");
  assert.deepEqual(consumer.header.pairWith, []);
  assert.equal(consumer.header.variantRequires.length, 1);
  const snips = [consumer, provider].map((parsed, index) => ({ rel: index ? "junos/overlay.conf" : "junos/consumer.conf", dir: "junos", body: parsed.body, seenOn: parsed.header.seenOn }));
  const snipIndex = new Map(snips.map(row => [row.rel, row]));
  const headers = new Map([[snips[0].rel, consumer.header], [snips[1].rel, provider.header]]);
  const variantMembers = [{ ...snips[1], os: "junos", jvd: "mebs", group: provider.header.variantGroup.name, provides: provider.header.variantGroup.provides }];
  const args = { device: "d1", os: "junos", snipIndex, headers, variantMembers };
  const symbolic = closeTuple({ ...args, entries: [snips[0].rel], constructs: new Map(), definers: new Map() });
  assert.ok(symbolic.included.includes(snips[1].rel));
  assert.ok(symbolic.failures.some(row => row.kind === "dependency-unresolved-path"));
  const resolver = createOccurrenceResolver({ sourceText: snips.map(row => row.body).join("\n"), device: "d1", os: "junos", snips });
  const boundArgs = { ...args, entries: resolver.occurrences(snips[0].rel), resolver, sourceSha256: resolver.sourceSha256, bindings: [] };
  const bound = closeOccurrenceTuple(boundArgs);
  assert.ok(bound.included.some(row => row.rel === snips[1].rel));
  assert.ok(bound.failures.some(row => row.kind === "dependency-unresolved-path"));
  assert.ok(closeOccurrenceTuple({ ...boundArgs, variantMembers: [] }).failures.some(row => row.kind.startsWith("variant-")));
  assert.ok(closeTuple({ ...args, entries: [snips[0].rel], constructs: new Map(), definers: new Map(), variantMembers: [] }).failures.some(row => row.kind.startsWith("variant-")));
});

test("Flex-Algo prerequisites require matching active protocol participation", () => {
  assert.deepEqual(flexAlgorithms("protocols { isis-instance metro-a { source-packet-routing { flex-algorithm [ 128 129 ]; } } }" ).participation, ["128", "129"]);
  assert.deepEqual(flexAlgorithms("protocols { inactive: isis { source-packet-routing { flex-algorithm [ 128 ]; } } }" ).participation, []);
  const snips = [
    { rel: "junos/fad.conf", seenOn: { junos: ["fixture"] }, body: "routing-options { flex-algorithm 128 { color 4000; } }" },
    { rel: "junos/isis.conf", seenOn: { junos: ["fixture"] }, body: "protocols { isis { source-packet-routing { flex-algorithm [ 129 ]; } } }" },
  ];
  const resolver = createOccurrenceResolver({ sourceText: snips.map(row => row.body).join("\n"), device: "fixture", os: "junos", snips });
  const result = closeOccurrenceTuple({ entries: resolver.occurrences("junos/fad.conf"), resolver, sourceSha256: resolver.sourceSha256, bindings: [], sourceRequirements: [{ consumer: "junos/fad.conf", kind: "isis-flex-algorithm", entrySet: "isis" }], entrySets: { isis: ["junos/isis.conf"] } });
  assert.equal(result.failures[0].kind, "source-requirement-unavailable");
});

test("bound closure preserves repeated provider instances and their complete bindings", () => {
  const sourceText = "interfaces { ae82 { unit 1 { family iso; } unit 2 { family iso; } } } policy-options { policy-statement export_a { then accept; } policy-statement export_b { then reject; } } protocols { isis-instance metro-a { interface ae82.1 { point-to-point; } export export_b; } isis-instance metro-b { interface ae82.2 { point-to-point; } export export_a; } }";
  const makeSnip = (rel, body) => ({ rel, body, seenOn: { junos: [], evo: ["mdr1"] } });
  const resolver = createOccurrenceResolver({ sourceText, device: "mdr1", os: "evo", snips: [
    makeSnip("evo/consumer.conf", "protocols { isis-instance $ISIS_INSTANCE { interface $CORE_INTF { point-to-point; } export $EXPORT_POLICY; } }"),
    makeSnip("evo/interface.conf", "interfaces { $IFD { unit $UNIT { family iso; } } }"),
    makeSnip("evo/accept.conf", "policy-options { policy-statement $POLICY { then accept; } }"),
    makeSnip("evo/reject.conf", "policy-options { policy-statement $POLICY { then reject; } }"),
  ] });
  const entries = resolver.occurrences("evo/consumer.conf");
  const bindings = [
    { consumer: "evo/consumer.conf", kind: "logical-interface", scope: "object", providers: ["evo/interface.conf"] },
    { consumer: "evo/consumer.conf", kind: "policy-statement", scope: "object", providers: ["evo/accept.conf", "evo/reject.conf"] },
  ];
  const args = { entries, bindings, resolver, sourceSha256: resolver.sourceSha256 };
  const result = closeOccurrenceTuple(args);
  assert.deepEqual(result.failures, []);
  assert.equal(result.included.length, 6);
  assert.equal(result.edges.length, 4);
  const rendered = resolver.render({ ids: result.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
  assert.equal(rendered.status, "ok");
  assert.equal((rendered.body.match(/unit 1/g) ?? []).length, 1);
  assert.equal((rendered.body.match(/unit 2/g) ?? []).length, 1);
  assert.equal((rendered.body.match(/isis-instance metro-/g) ?? []).length, 2);
  assert.equal(resolver.render({ ids: ["invented"], sourceSha256: resolver.sourceSha256 }).status, "unknown-occurrence");
  assert.equal(resolver.render({ ids: [], sourceSha256: "old" }).status, "stale-source");
  assert.deepEqual(result.included.filter(row => row.rel === "evo/interface.conf").map(row => row.binding.UNIT).sort(), ["1", "2"]);
  assert.deepEqual(closeOccurrenceTuple({ ...args, entries: [...entries].reverse() }).included, result.included);
  assert.equal(closeOccurrenceTuple({ ...args, bindings: [] }).failures.length, 4);
  assert.ok(closeOccurrenceTuple({ ...args, bindings: [...bindings, bindings[0]] }).failures.some(row => row.kind === "ambiguous-reference-rule"));
  assert.ok(closeOccurrenceTuple({ ...args, sourceSha256: "old" }).failures.every(row => row.kind === "occurrence-stale-source"));
  assert.equal(closeOccurrenceTuple({ ...args, entries: [{ ...entries[0], id: "invented" }] }).failures[0].kind, "unknown-entry-occurrence");
});

test("bound reference cycles fail instead of declaring closure", () => {
  const resolver = createOccurrenceResolver({
    sourceText: "groups { FIRST { apply-groups SECOND; } SECOND { apply-groups FIRST; } }",
    device: "fixture", os: "junos",
    snips: [{ rel: "junos/groups.conf", seenOn: { junos: ["fixture"] }, body: "groups { $GROUP { apply-groups $PARENT; } }" }],
  });
  const result = closeOccurrenceTuple({ entries: resolver.occurrences("junos/groups.conf"), resolver, sourceSha256: resolver.sourceSha256, bindings: [{ consumer: "junos/groups.conf", kind: "group", scope: "object", providers: ["junos/groups.conf"] }] });
  assert.ok(result.failures.some(row => row.kind === "reference-cycle"));
});

test("declared bound dependencies require an exact referenced or unique occurrence", () => {
  const snips = [
    { rel: "junos/root.conf", body: "protocols { isis { net 49.0001; } }", seenOn: { junos: ["fixture"] }, dir: "junos" },
    { rel: "junos/interface.conf", body: "interfaces { ae1 { unit $UNIT { family iso; } } }", seenOn: { junos: ["fixture"] }, dir: "junos" },
  ];
  const resolver = createOccurrenceResolver({ sourceText: "protocols { isis { net 49.0001; } } interfaces { ae1 { unit 1 { family iso; } unit 2 { family iso; } } }", device: "fixture", os: "junos", snips });
  const result = closeOccurrenceTuple({ entries: resolver.occurrences("junos/root.conf"), resolver, sourceSha256: resolver.sourceSha256, bindings: [], snipIndex: new Map(snips.map(row => [row.rel, row])), headers: new Map([["junos/root.conf", { pairWith: ["junos/interface.conf"] }]]), device: "fixture", os: "junos" });
  assert.equal(result.scope, "typed-and-declared-dependencies");
  assert.equal(result.failures[0].kind, "unbound-functional-dependency");
  assert.equal(result.included.length, 1);
});

test("occurrence rules are validated and never silently choose unbound attachments", () => {
  const consumer = { ...snip("junos/service.conf")[1], body: "routing-instances { SERVICE { interface $IFD.$UNIT; } }" };
  const provider = { ...snip("junos/interface.conf")[1], body: "interfaces { $IFD { unit $UNIT { family bridge; } } }" };
  const index = new Map([[consumer.rel, consumer], [provider.rel, provider]]);
  const rule = { consumer: consumer.rel, kind: "logical-interface", scope: "object", providers: [provider.rel], unbound: "required" };
  const matrix = { roles: {}, forms: [], occurrenceBindings: [rule] };
  assert.deepEqual(validateMatrix(matrix, index), []);
  assert.ok(validateMatrix({ ...matrix, occurrenceBindings: [rule, rule] }, index).some(row => row.includes("duplicate occurrence")));
  assert.ok(validateMatrix({ ...matrix, occurrenceBindings: [{ ...rule, providers: [consumer.rel] }] }, index).some(row => row.includes("does not define")));
  assert.ok(validateMatrix({ ...matrix, occurrenceBindings: [{ ...rule, scope: "guess" }] }, index).some(row => row.includes("invalid scope")));
  const result = closeTuple({ entries: [consumer.rel], device: "d1", os: "junos", snipIndex: index, headers: new Map([[consumer.rel, {}]]), constructs: new Map(), variantMembers: [], definers: new Map(), matrix, family: "e-tree" });
  assert.ok(result.failures.some(row => row.kind === "occurrence-no-applicable-provider"));
  assert.deepEqual(result.included, [consumer.rel]);
});

test("E-Tree choices exclude routed units and remain unresolved until bound", () => {
  const make = (rel, body) => ({ ...snip(rel)[1], body });
  const consumer = make("junos/service.conf", "routing-instances { SERVICE { interface $IFD.$UNIT; } }");
  const routed = make("junos/core.conf", "interfaces { $IFD { unit $UNIT { family inet; family iso; } } }");
  const leaf = make("junos/leaf.conf", "interfaces { $IFD { unit $UNIT { encapsulation vlan-bridge; etree-ac-role leaf; } } }");
  const matrix = { occurrenceBindings: [{ consumer: consumer.rel, kind: "logical-interface", scope: "object", providers: [routed.rel, leaf.rel], unbound: "required" }] };
  const result = closeTuple({ entries: [consumer.rel], device: "d1", os: "junos", snipIndex: new Map([consumer, routed, leaf].map(row => [row.rel, row])), headers: new Map([consumer, routed, leaf].map(row => [row.rel, {}])), constructs: new Map(), variantMembers: [], definers: new Map(), matrix, family: "e-tree" });
  assert.deepEqual(result.requiredInputs[0].choices, [leaf.rel]);
  assert.ok(result.failures.some(row => row.kind === "occurrence-selection-required"));
});

test("explicit E-Tree selection binds role, identity and VLAN before traversing prerequisites", () => {
  const make = (rel, body) => ({ ...snip(rel)[1], body });
  const consumer = make('junos/service.conf', 'routing-instances { $INSTANCE_NAME { interface $AC_INTF.$UNIT; vlan-id $VLAN; } }');
  const provider = make('junos/leaf.conf', 'interfaces { $IFD { unit $UNIT { encapsulation vlan-bridge; vlan-id $VLAN; etree-ac-role leaf; } } }');
  const badChoice = make('junos/broken.conf', provider.body);
  const dependency = make('junos/base.conf', 'system { host-name PE; }');
  const index = new Map([consumer, provider, badChoice, dependency].map(row => [row.rel, row]));
  const key = `${consumer.rel}:logical-interface:$AC_INTF.$UNIT`;
  const selection = { provider: provider.rel, role: 'leaf', consumerBinding: { INSTANCE_NAME: 'TREE', AC_INTF: 'xe-0/1/4', UNIT: '2000', VLAN: '2000' }, binding: { IFD: 'xe-0/1/4', UNIT: '2000', VLAN: '2000' } };
  const args = { entries: [consumer.rel], device: 'd1', os: 'junos', snipIndex: index, headers: new Map([[consumer.rel, {}], [provider.rel, { pairWith: [dependency.rel] }], [badChoice.rel, { pairWith: ['junos/missing.conf'] }], [dependency.rel, {}]]), constructs: new Map(), variantMembers: [], definers: new Map(), family: 'e-tree', matrix: { occurrenceBindings: [{ consumer: consumer.rel, kind: 'logical-interface', scope: 'object', providers: [provider.rel, badChoice.rel], unbound: 'required' }] }, selections: { [key]: selection } };
  const result = closeTuple(args);
  assert.deepEqual(result.failures, []);
  assert.ok(result.included.includes(dependency.rel));
  assert.ok(!result.included.includes(badChoice.rel));
  assert.match(result.rendered[provider.rel], /etree-ac-role leaf/);
  for (const [change, expected] of [[{ role: 'root' }, 'role-mismatch'], [{ binding: { ...selection.binding, UNIT: '2001' } }, 'identity-mismatch'], [{ binding: { ...selection.binding, VLAN: '2001' } }, 'vlan-mismatch'], [{ binding: { ...selection.binding, IFD: 'bad; injected' } }, 'invalid-binding']]) {
    assert.ok(closeTuple({ ...args, selections: { [key]: { ...selection, ...change } } }).failures.some(row => row.kind === `occurrence-${expected}`));
  }
  args.headers.set(provider.rel, { pairWith: ['junos/missing.conf'] });
  assert.ok(closeTuple(args).failures.some(row => row.kind === 'dependency-unresolved-path'));
});

test('whole-interface slots expose binding constraints and preserve nested required inputs', () => {
  const make = (rel, body) => ({ ...snip(rel)[1], body });
  const consumer = make('junos/service.conf', 'routing-instances { SERVICE { interface $AC_INTF; } }');
  const provider = make('junos/unit.conf', 'interfaces { $IFD { unit $UNIT { family bridge; } } }');
  const parent = make('junos/parent.conf', 'interfaces { $IFD { mtu 9192; } }');
  const matrix = { occurrenceBindings: [
    { consumer: consumer.rel, kind: 'logical-interface', scope: 'object', providers: [provider.rel], unbound: 'required' },
    { consumer: provider.rel, kind: 'interface-parent', scope: 'object', providers: [parent.rel] },
  ] };
  const args = { entries: [consumer.rel], device: 'd1', os: 'junos', snipIndex: new Map([consumer, provider, parent].map(row => [row.rel, row])), headers: new Map([consumer, provider, parent].map(row => [row.rel, {}])), constructs: new Map(), variantMembers: [], definers: new Map(), matrix, family: 'e-lan' };
  const result = closeTuple(args);
  assert.deepEqual(result.failures.map(row => row.kind), ['occurrence-selection-required']);
  assert.deepEqual(unboundSelectionProblems(result), []);
  assert.deepEqual(result.requiredInputs[0].choices, [provider.rel]);
  assert.deepEqual(result.requiredInputs[0].bindingConstraints[0].consumerBinding, { AC_INTF: '$IFD.$UNIT' });
  assert.ok(result.requiredInputs[0].providerRequiredInputs[provider.rel].some(row => row.construct === 'interface-parent:source-occurrence'));
  const selectionKey = `${consumer.rel}:logical-interface:$AC_INTF`;
  const selection = { provider: provider.rel, consumerBinding: { AC_INTF: 'ae1.100' }, binding: { IFD: 'ae1', UNIT: '100' } };
  const suppliedArgs = { ...args, matrix: { occurrenceBindings: [matrix.occurrenceBindings[0]] }, selections: { [selectionKey]: selection } };
  assert.deepEqual(closeTuple(suppliedArgs).failures, []);
  const wrong = closeTuple({ ...suppliedArgs, selections: { [selectionKey]: { ...selection, binding: { IFD: 'ae2', UNIT: '100' } } } });
  assert.ok(wrong.failures.some(row => row.kind === 'occurrence-identity-mismatch'));
  args.headers.set(provider.rel, { pairWith: ['junos/missing.conf'] });
  assert.ok(unboundSelectionProblems(closeTuple(args)).some(row => row.kind === 'occurrence-provider-closure-failed'));
  args.headers.set(provider.rel, {});
  args.snipIndex.set(consumer.rel, { ...consumer, body: 'routing-instances { SERVICE { interface irb.10; } }' });
  args.snipIndex.set(provider.rel, { ...provider, body: 'interfaces { ae1 { unit 20 { family bridge; } } }' });
  assert.ok(closeTuple(args).failures.some(row => row.kind === 'occurrence-no-applicable-provider'));
});

test('the unbound composition CI command accepts only validated required selections', async () => {
  const { spawnSync } = await import('node:child_process');
  const script = path.join(REPO_ROOT, 'portal/scripts/composition-validate.mjs');
  const result = spawnSync(process.execPath, [script, '--audit', '--expect-required-inputs'], { cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /unbound required-input verification: PASS/);
  assert.doesNotMatch(result.stdout, /occurrence-no-applicable-provider|occurrence-provider-closure-failed/);
  const strict = spawnSync(process.execPath, [script, '--audit'], { cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 });
  assert.equal(strict.status, 1, 'Strict mode must not label missing selections complete');
  assert.match(strict.stdout, /occurrence-selection-required/);
});

test("literal policy references constrain provider identities and check provider prerequisites", () => {
  const make = (rel, body) => ({ ...snip(rel)[1], body });
  const consumer = make("junos/consumer.conf", "protocols { isis { export FLOAT-PW-CONDITIONAL; } }");
  const unrelated = make("junos/unrelated.conf", "policy-options { policy-statement OTHER { then accept; } }");
  const candidate = make("junos/conditional.conf", "policy-options { policy-statement $POLICY_NAME { then accept; } }");
  const matrix = { occurrenceBindings: [{ consumer: consumer.rel, kind: "policy-statement", scope: "object", providers: [unrelated.rel, candidate.rel], unbound: "required" }] };
  const args = { entries: [consumer.rel], device: "d1", os: "junos", snipIndex: new Map([consumer, unrelated, candidate].map(row => [row.rel, row])), headers: new Map([consumer, unrelated, candidate].map(row => [row.rel, {}])), constructs: new Map(), variantMembers: [], definers: new Map(), matrix, family: "underlay" };
  const result = closeTuple(args);
  assert.deepEqual(result.requiredInputs[0].choices, [candidate.rel]);
  assert.deepEqual(result.requiredInputs[0].bindingConstraints[0].binding, { POLICY_NAME: "FLOAT-PW-CONDITIONAL" });
  args.headers.set(candidate.rel, { pairWith: ["junos/missing.conf"] });
  const blocked = closeTuple(args);
  assert.ok(blocked.failures.some(row => row.kind === "occurrence-provider-closure-failed"));
});

test("typed references prefer complete object-only providers, not unrelated compound output", () => {
  const make = (rel, body) => ({ ...snip(rel)[1], body });
  const consumer = make('junos/consumer.conf', 'protocols { isis { export REMOTE; } }');
  const focused = make('junos/focused.conf', 'policy-options { policy-statement REMOTE { then accept; } }');
  const compound = make('junos/compound.conf', 'policy-options { policy-statement REMOTE { then accept; } policy-statement LOCAL { then reject; } }');
  const other = make('junos/other.conf', 'policy-options { policy-statement REMOTE { then reject; } }');
  const snipIndex = new Map([consumer, focused, compound, other].map(row => [row.rel, row]));
  const definers = new Map([['policy-statement:REMOTE', { junos: new Map([['d1', [focused.rel, compound.rel]]]), evo: new Map() }]]);
  const args = { entries: [consumer.rel], device: 'd1', os: 'junos', snipIndex, headers: new Map([...snipIndex.keys()].map(rel => [rel, {}])), constructs: new Map([[consumer.rel, { references: [{ kind: 'policy-statement', name: 'REMOTE' }] }]]), variantMembers: [], definers };
  assert.deepEqual(closeTuple(args).included, [consumer.rel, focused.rel]);
  definers.get('policy-statement:REMOTE').junos.get('d1').push(other.rel);
  assert.ok(closeTuple(args).failures.some(row => row.kind === 'reference-ambiguous'));
});
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

test('validation plan CLI requires a private output directory', async () => {
  const { spawnSync } = await import('node:child_process');
  const script = path.join(REPO_ROOT, 'portal/scripts/generate-occurrence-plans.mjs');
  for (const args of [[], ['--out-dir', path.join(REPO_ROOT, 'portal/public')]]) {
    const result = spawnSync(process.execPath, [script, '--device', 'mdr1_acx7509', ...args], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /private-evidence-directory|outside the public repository/);
  }
});

test("removing colour resolution selections cannot shrink the archived plan denominator", async () => {
  const { buildOccurrencePlan } = await import("./generate-occurrence-plans.mjs");
  for (const device of ["mdr1_acx7509", "meg2_acx7509"]) {
    const complete = await buildOccurrencePlan({ device });
    const omitted = await buildOccurrencePlan({ device, entrySets: ["isis", "flex-algo-definitions"] });
    assert.deepEqual(omitted.coverage.requestedSourceIds, complete.coverage.requestedSourceIds);
    assert.equal(omitted.coverage.requestedStatements, complete.coverage.requestedStatements);
    assert.equal(omitted.status, "blocked");
    assert.equal(omitted.configuration, null);
    assert.ok(omitted.coverage.uncoveredIds.length > 0);
    assert.ok(omitted.failures.some(row => row.kind === "requested-source-coverage-gap"));
  }
});

test("both ACX7509 source plans cover every requested IS-IS and Flex-Algo statement", async () => {
  const { buildOccurrencePlan } = await import("./generate-occurrence-plans.mjs");
  for (const device of ["mdr1_acx7509", "meg2_acx7509"]) {
    const plan = await buildOccurrencePlan({ device });
    assert.equal(plan.status, "ready", JSON.stringify(plan.failures));
    assert.deepEqual(plan.coverage.uncoveredIds, []);
    assert.equal(plan.coverage.coveredStatements, plan.coverage.requestedStatements);
    assert.ok(plan.coverage.requestedStatements > 100);
    assert.ok(plan.entrySets.includes('colour-resolution'));
    assert.ok(plan.snippets.some(rel => rel.includes('/resolution-transport-class')));
    assert.match(plan.configuration, /scheme gold-to-bronze/);
    assert.deepEqual(plan.prerequisiteCoverage.failures, []);
    const contributed = plan.occurrences.flatMap(row => row.contributedSourceIds);
    assert.equal(new Set(contributed).size, contributed.length);
    assert.equal(plan.prerequisiteCoverage.requiredStatements, plan.prerequisiteCoverage.emittedStatements);
    assert.doesNotMatch(plan.configuration, /\$\{?[A-Z][A-Z0-9_]*/);
    if (device === "mdr1_acx7509") {
      assert.match(plan.configuration, /isis-instance metro-a/);
      assert.match(plan.configuration, /isis-instance metro-b/);
    }
  }
});

test("source-bound E-Tree plans validate all four device attachments and reject the opposite role", async () => {
  const { buildOccurrencePlan } = await import('./generate-occurrence-plans.mjs');
  for (const device of ['ma4_mx204', 'ma5_mx204', 'mse1_mx304', 'mse2_mx304']) {
    const edge = device.startsWith('ma');
    const service = { form: 'evpn-etree', instanceName: 'evpn_group_80_1000', attachment: edge ? 'xe-0/1/4.2999' : 'ae10.2999', role: edge ? 'leaf' : 'root' };
    const plan = await buildOccurrencePlan({ device, service });
    assert.equal(plan.status, 'ready', `${device}: ${JSON.stringify(plan.failures)}`);
    assert.deepEqual(plan.coverage.uncoveredIds, []);
    assert.match(plan.configuration, /evpn-etree/);
    assert.match(plan.configuration, new RegExp(`etree-ac-role ${service.role}`));
    assert.ok(plan.occurrences.some(row => row.rel.includes('bgp-overlay')));
    const invalid = await buildOccurrencePlan({ device, service: { ...service, role: edge ? 'root' : 'leaf' } });
    assert.equal(invalid.status, 'blocked');
    assert.equal(invalid.configuration, null);
    assert.ok(invalid.failures.some(row => row.kind === 'service-role-mismatch'));
  }
});
