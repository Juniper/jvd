import { test } from 'node:test';
import assert from 'node:assert/strict';
import { affectedSnippets, selectCorpusCase, classifyChanges, readCorpusScope } from './validation-scope.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const snip = (rel, body = 'system { host-name test; }', header = {}) => ({ rel, body, header });
const scope = (before, after, changed, matrix = {}) => affectedSnippets({ before, after, changed, matrix });

test('changed providers select transitive consumers but not unrelated entries', () => {
  const provider = snip('junos/provider.conf');
  const consumer = snip('junos/consumer.conf', undefined, { pairWith: [provider.rel] });
  const root = snip('junos/root.conf', undefined, { pairWith: [consumer.rel] });
  const unrelated = snip('junos/unrelated.conf');
  const records = [provider, consumer, root, unrelated];
  assert.deepEqual(scope(records, records, [provider.rel]), new Set([provider.rel, consumer.rel, root.rel]));
});

test('old edges retain consumers after a provider or dependency is deleted', () => {
  const provider = snip('junos/provider.conf');
  const consumer = snip('junos/consumer.conf', undefined, { pairWith: [provider.rel] });
  assert.deepEqual(scope([provider, consumer], [snip(consumer.rel)], [provider.rel]), new Set([provider.rel, consumer.rel]));
});

test('new typed providers invalidate consumers even without an existing edge', () => {
  const consumer = snip('junos/policy.conf', 'policy-options { policy-statement TEST { then { community add TARGET; accept; } } }');
  const provider = snip('junos/community.conf', 'policy-options { community TARGET members 65000:1; }');
  assert.ok(scope([consumer], [consumer, provider], [provider.rel]).has(consumer.rel));
});

test('all variant alternatives and cross-OS equivalents participate in impact', () => {
  const native = snip('junos/provider.conf', undefined, { variantGroup: { name: 'overlay' } });
  const alternative = snip('evo/provider.conf', undefined, { variantGroup: { name: 'overlay' } });
  const consumer = snip('junos/consumer.conf', undefined, { variantRequires: [{ group: 'overlay' }] });
  const paired = snip('junos/paired.conf', undefined, { pairWith: [native.rel] });
  const records = [native, alternative, consumer, paired];
  assert.deepEqual(scope(records, records, [alternative.rel]), new Set([alternative.rel, consumer.rel, paired.rel]));
});

test('matrix relations and source requirements include every candidate', () => {
  const records = ['entry', 'parent', 'member', 'witness'].map(name => snip(`junos/${name}.conf`));
  const matrix = {
    occurrenceBindings: [{ consumer: records[0].rel, providers: [records[1].rel, records[2].rel] }],
    sourceRequirements: [{ consumer: records[0].rel, entrySet: 'protocol' }],
    occurrenceEntrySets: { protocol: [records[3].rel] },
  };
  for (const provider of records.slice(1)) assert.ok(scope(records, records, [provider.rel], matrix).has(records[0].rel));
});

test('unresolved dependencies fall back to the full corpus', () => {
  const records = [snip('junos/consumer.conf', undefined, { pairWith: ['junos/missing.conf'] })];
  assert.equal(scope(records, records, []), null);
  assert.equal(selectCorpusCase(null, ['junos/anything.conf']), true);
  assert.equal(selectCorpusCase(new Set(), null), false);
  assert.equal(selectCorpusCase(new Set(['junos/changed.conf']), null), true);
  assert.equal(selectCorpusCase(new Set(), ['junos/anything.conf']), false);
});

test('change classification distinguishes source inputs from documentation and derived catalogs', () => {
  const jvd = 'service_provider/example';
  const snippet = `${jvd}/configuration/snips/junos/interfaces/example.conf`;
  assert.equal(classifyChanges(['CHANGELOG.md'], jvd).mode, 'none');
  assert.equal(classifyChanges(['other/jvd/configuration/snips/junos/example.conf', 'portal/public/snips.json'], jvd).mode, 'none');
  assert.deepEqual(classifyChanges([snippet, 'portal/src/data/snips.json'], jvd).paths, [snippet]);
  for (const file of [`${jvd}/configuration/conf/device.conf`, `${jvd}/configuration/snips/_bindings.md`, `${jvd}/configuration/snips/_source-exclusions.json`, `${jvd}/configuration/snips/_composition.json`, 'portal/public/snips.json', 'portal/bun.lock', 'portal/scripts/new-helper.mjs', '.github/SNIP-CONTRACT.md', 'unclassified-input']) {
    assert.equal(classifyChanges([file], jvd).mode, 'full', file);
  }
  assert.equal(classifyChanges([snippet, 'other/jvd/configuration/snips/evo/renamed.conf'], jvd).mode, 'snippets');
});

test('incomplete or malformed dependency inputs cannot yield a partial pass', () => {
  const invalid = snip('junos/invalid.conf', 'interfaces {');
  assert.equal(scope([invalid], [invalid], [invalid.rel]), null);
  const records = [snip('junos/entry.conf')];
  assert.equal(scope(records, records, [], { sourceRequirements: [{ consumer: records[0].rel, entrySet: 'missing' }] }), null);
});

test('git selection includes deleted files and rejects missing bases', () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'validation-scope-'));
  const git = args => execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  try {
    git(['init', '-q']);
    git(['config', 'user.email', 'test@example.invalid']);
    git(['config', 'user.name', 'Validation fixture']);
    const jvd = 'service_provider/example';
    const relative = `${jvd}/configuration/snips/junos/system/example.conf`;
    fs.mkdirSync(path.dirname(path.join(repoRoot, relative)), { recursive: true });
    fs.writeFileSync(path.join(repoRoot, relative), '/*\nTopic: fixture\nSeen on: fixture\nPair with: none\n*/\nsystem { host-name fixture; }\n');
    git(['add', '.']);
    git(['commit', '-qm', 'fixture']);
    const base = git(['rev-parse', 'HEAD']).trim();
    fs.unlinkSync(path.join(repoRoot, relative));
    const selected = readCorpusScope({ repoRoot, jvd, base });
    assert.notEqual(selected.mode, 'none');
    assert.ok(selected.affected === null || selected.affected.has('junos/system/example.conf'));
    assert.throws(() => readCorpusScope({ repoRoot, jvd, base: 'missing-base' }));
    assert.equal(readCorpusScope({ repoRoot, jvd }).mode, 'full');
  } finally {
    fs.rmSync(repoRoot, { recursive: true, force: true });
  }
});

test('real Git changes select a provider and consumers without selecting unrelated cases', () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'validation-impact-'));
  const git = args => execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const jvd = 'service_provider/example';
  const prefix = `${jvd}/configuration/snips/`;
  const write = (rel, dependency = null, hostname = 'fixture') => {
    const target = path.join(repoRoot, prefix, rel);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `/*\n * Topic: fixture\n * Seen on:\n *   Junos: fixture\n *   EVO: (none)\n * Pair with:\n *   - ${dependency ?? 'none'}\n */\nsystem { host-name ${hostname}; }\n`);
  };
  try {
    git(['init', '-q']);
    git(['config', 'user.email', 'test@example.invalid']);
    git(['config', 'user.name', 'Validation fixture']);
    write('junos/provider.conf');
    write('junos/consumer.conf', 'junos/provider.conf');
    write('junos/unrelated.conf');
    git(['add', '.']);
    git(['commit', '-qm', 'fixture']);
    const base = git(['rev-parse', 'HEAD']).trim();
    assert.equal(readCorpusScope({ repoRoot, jvd, base }).mode, 'none');
    write('junos/provider.conf', null, 'changed');
    let selected = readCorpusScope({ repoRoot, jvd, base });
    assert.equal(selected.mode, 'snippets');
    assert.deepEqual(selected.affected, new Set(['junos/provider.conf', 'junos/consumer.conf']));
    assert.equal(selectCorpusCase(selected.affected, ['junos/unrelated.conf']), false);
    write('junos/consumer.conf');
    selected = readCorpusScope({ repoRoot, jvd, base });
    assert.ok(selected.affected.has('junos/consumer.conf'));
    fs.renameSync(path.join(repoRoot, prefix, 'junos/provider.conf'), path.join(repoRoot, prefix, 'junos/renamed.conf'));
    selected = readCorpusScope({ repoRoot, jvd, base });
    assert.equal(selected.mode, 'snippets');
    for (const rel of ['junos/provider.conf', 'junos/renamed.conf', 'junos/consumer.conf']) assert.ok(selected.affected.has(rel));
  } finally {
    fs.rmSync(repoRoot, { recursive: true, force: true });
  }
});