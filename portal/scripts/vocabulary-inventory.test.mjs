import { test } from 'node:test';
import assert from 'node:assert/strict';
import { templateFacts, vocabularyPreflight } from './vocabulary-inventory.mjs';

test('template shapes retain repeated-variable identity, constants and order', () => {
  const first = templateFacts('routing-options { router-id $LOOPBACK; autonomous-system $AS; }');
  assert.equal(first.shapeHash, templateFacts('routing-options { router-id ${ID}; autonomous-system $ASN; }').shapeHash);
  assert.notEqual(first.shapeHash, templateFacts('routing-options { router-id $SAME; autonomous-system $SAME; }').shapeHash);
  assert.notEqual(first.shapeHash, templateFacts('routing-options { autonomous-system $AS; router-id $LOOPBACK; }').shapeHash);
  assert.notEqual(templateFacts('foo 1;').shapeHash, templateFacts('foo 2;').shapeHash);
});

test('variables retain distinct operand slots and exclude native lowercase variables', () => {
  const facts = templateFacts('routing-instances { $INSTANCE { route-distinguisher $ADMIN:$ASSIGNED; description $junos-interface-name; } }');
  assert.deepEqual(facts.variables, ['ADMIN', 'ASSIGNED', 'INSTANCE']);
  assert.match(facts.contexts.ADMIN[0], /variable-slot 1\/2/);
  assert.match(facts.contexts.ASSIGNED[0], /variable-slot 2\/2/);
});

test('unparseable bodies cannot nominate structural equivalents', () => {
  const facts = templateFacts('interfaces { $IFD {');
  assert.equal(facts.parsed, false);
  assert.equal(facts.shapeHash, null);
  assert.deepEqual(facts.variables, ['IFD']);
});

test('preflight requires registration or fresh approved example-backed justification', () => {
  const file = 'area/design/configuration/snips/junos/system/new.conf';
  const example = 'area/design/configuration/snips/junos/system/example.conf';
  const inventory = { inputs: { [file]: 'current', [example]: 'example' }, snips: [{ path: file, constructKey: 'system/new', declared: ['NAME'], used: ['NAME'], declaredOnly: [], usedOnly: [] }], proposedConstructReview: [{ key: 'system/new', registered: false, structuralForms: 1 }], proposedVariableReview: [{ name: 'NAME', registered: false }] };
  assert.equal(vocabularyPreflight(inventory, [file]).issues.length, 2);
  const decisions = [['construct', 'system/new'], ['variable', 'NAME']].map(([kind, name]) => ({ kind, name, status: 'approved', reviewedBy: 'human reviewer', reason: 'Reviewed the actual examples; the new meaning is distinct.', snipHashes: { [file]: 'current' }, examinedExamples: [{ path: example, sha256: 'example' }] }));
  assert.equal(vocabularyPreflight(inventory, [file], decisions).passed, true);
  for (const mutation of [{ status: 'proposed' }, { reason: '' }, { reviewedBy: '' }, { snipHashes: { [file]: 'stale' } }, { examinedExamples: [] }, { examinedExamples: [{ path: example, sha256: 'stale' }] }, { examinedExamples: [{ path: file.replace('new.conf', 'absent.conf') }] }]) {
    assert.equal(vocabularyPreflight(inventory, [file], decisions.map(row => ({ ...row, ...mutation }))).passed, false);
  }
  assert.equal(vocabularyPreflight(inventory, ['missing.conf']).passed, false);
});