import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { parseConfig, canonicalize } from './config-objects.mjs';
import { parseSnip } from './snip-parse.mjs';

const scripts = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(scripts, '../..');
const registryPath = path.join(scripts, 'snip-instance-registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const keywords = new Set(registry.instanceKeywords);
const containers = new Set(registry.bareNameContainers);
const contextLeafPaths = registry.contextLeafPaths ?? [];
const variablePattern = /\$\{([A-Z][A-Z0-9_]*)\}|\$([A-Z][A-Z0-9_]*)/g;
const digest = text => crypto.createHash('sha256').update(text).digest('hex');
const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const key = node => (node.inactive ? 'inactive: ' : '') + node.words.join(' ') + (node.children === null ? ';' : '');

export function bindLine(template, concrete, binding) {
  let cursor = 0;
  let pattern = '';
  const local = new Set();
  for (const match of template.matchAll(variablePattern)) {
    pattern += escape(template.slice(cursor, match.index));
    const name = match[1] ?? match[2];
    if (Object.hasOwn(binding, name)) pattern += escape(binding[name]);
    else if (local.has(name)) pattern += `\\k<${name}>`;
    else {
      pattern += `(?<${name}>"(?:\\\\.|[^"\\\\])*"|[^\\s;{}]+?)`;
      local.add(name);
    }
    cursor = match.index + match[0].length;
  }
  pattern += escape(template.slice(cursor));
  const matched = new RegExp(`^${pattern}$`).exec(concrete);
  return matched ? { ...binding, ...matched.groups } : null;
}

function isInstance(node, container) {
  return node.children !== null && (node.words.length >= 2 && keywords.has(node.words[0]) || node.words.length === 1 && containers.has(container));
}

function extraSiblingsAllowed(depth, concrete, used, container, sealed, trail, template) {
  if (sealed) return false;
  if (depth <= 1) return true;
  const follows = (nodes, suffix) => suffix.length > 0 && nodes.length > 0 && nodes.every(node => node.words[0] === suffix[0]
    && (suffix.length === 1 ? node.children === null : node.children !== null && follows(node.children, suffix.slice(1))));
  if (contextLeafPaths.some(path => trail.every((keyword, index) => path[index] === keyword) && follows(template, path.slice(trail.length)))) return true;
  if (container === 'isis' || container === 'isis-instance') return true;
  const instances = new Set();
  concrete.forEach((node, index) => {
    if (node.children === null) return;
    if (node.words.length >= 2 && keywords.has(node.words[0]) || node.words.length === 1 && containers.has(container)) instances.add(index);
  });
  if ([...instances].some(index => used.has(index))) return true;
  return concrete.every((_, index) => used.has(index) || instances.has(index));
}

function* assignments(template, position, concrete, used, binding, consumed, depth, container, budget, sealed = false, trail = []) {
  if (position === template.length) {
    if (used.size === concrete.length || extraSiblingsAllowed(depth, concrete, used, container, sealed, trail, template)) yield { binding, consumed };
    return;
  }
  const current = template[position];
  for (let index = 0; index < concrete.length; index++) {
    const candidate = concrete[index];
    if (used.has(index) || (current.children === null) !== (candidate.children === null)) continue;
    const nextBinding = bindLine(key(current), key(candidate), binding);
    if (!nextBinding) continue;
    const nextUsed = new Set([...used, index]);
    if (current.children === null) {
      yield* assignments(template, position + 1, concrete, nextUsed, nextBinding, [...consumed, candidate.id], depth, container, budget, sealed, trail);
    } else {
      const childContext = container === 'interfaces' && candidate.children.some(child => child.words[0] === 'unit') || current.words[0] === 'neighbor' && container === 'l2circuit' || current.words[0] === 'maintenance-domain';
      const childSealed = sealed || isInstance(candidate, container) && !childContext;
      for (const child of assignments(current.children, 0, candidate.children, new Set(), nextBinding, [], depth + 1, candidate.words[0], budget, childSealed, [...trail, candidate.words[0]])) {
        yield* assignments(template, position + 1, concrete, nextUsed, child.binding, [...consumed, candidate.id, ...child.consumed], depth, container, budget, sealed, trail);
      }
    }
    if (budget.remaining <= 0) return;
  }
}

export function resolveSourceExclusions({ source, sourceSha256, device, document }) {
  if (!document) return { ids: new Set(), records: [] };
  assert.equal(document.schemaVersion, 1, 'Unknown source exclusion schema');
  assert.ok(Array.isArray(document.entries));
  const records = [];
  const ids = new Set();
  const entryIds = new Set();
  for (const entry of document.entries) {
    assert.ok(entry.id && !entryIds.has(entry.id), 'Duplicate/missing exclusion identity');
    entryIds.add(entry.id);
    assert.equal(entry.classification, 'excluded-source-defect');
    assert.ok(entry.approvedBy && entry.approvedOn && entry.reason && Array.isArray(entry.hierarchy) && entry.hierarchy.length, 'Exclusion requires human approval, reason and hierarchy');
    if (entry.device !== device) continue;
    assert.equal(entry.sourceSha256, sourceSha256, `Stale exclusion: ${entry.id}`);
    const matches = source.index.filter(node => {
      const hierarchy = [];
      let current = node;
      while (current) {
        hierarchy.unshift((current.inactive ? 'inactive: ' : '') + current.words.join(' '));
        current = current.parent === null ? null : source.index[current.parent];
      }
      return JSON.stringify(hierarchy) === JSON.stringify(entry.hierarchy);
    });
    assert.equal(matches.length, 1, `Exclusion must identify exactly one source root: ${entry.id}`);
    const selected = [];
    const visit = node => { selected.push(node.id); ids.add(node.id); for (const child of node.children ?? []) visit(child); };
    visit(matches[0]);
    records.push({ ...entry, sourceIds: selected });
  }
  return { ids, records };
}

export function sourceTree(text, { device, exclusions } = {}) {
  const parsed = parseConfig(text);
  assert.ok(parsed.ok, 'Configuration failed structural parsing');
  const index = [];
  const walk = (nodes, parent) => {
    for (const node of nodes) {
      node.id = index.length;
      node.parent = parent;
      index.push(node);
      if (node.children) walk(node.children, node.id);
    }
  };
  walk(parsed.nodes, null);
  const source = { nodes: parsed.nodes, index };
  const excluded = resolveSourceExclusions({ source, sourceSha256: digest(text), device, document: exclusions });
  return { ...source, excludedIds: excluded.ids, exclusions: excluded.records };
}

export function occurrenceMap(body, source, limit = 2000000) {
  const template = parseConfig(body);
  assert.ok(template.ok, 'Template failed structural parsing');
  const variables = [...new Set([...body.matchAll(variablePattern)].map(match => match[1] ?? match[2]))].sort();
  const budget = { remaining: limit };
  const occurrences = new Map();
  for (const match of assignments(template.nodes, 0, source.nodes, new Set(), {}, [], 0, null, budget)) {
    budget.remaining--;
    assert.ok(budget.remaining > 0, 'Occurrence enumeration truncated');
    const ids = match.consumed.sort((left, right) => left - right);
    if (ids.some(id => source.excludedIds?.has(id))) continue;
    const identity = ids.join(',');
    if (!occurrences.has(identity)) occurrences.set(identity, { sourceIds: ids, bindings: new Map() });
    const values = variables.map(variable => {
      assert.ok(Object.hasOwn(match.binding, variable), `Missing binding ${variable}`);
      return match.binding[variable];
    });
    occurrences.get(identity).bindings.set(JSON.stringify(values), values);
  }
  const ordered = (nodes, depth = 0) => {
    const result = nodes.map(node => [key(node), node.children === null ? null : ordered(node.children, depth + 1)]);
    return depth <= 1 ? result.sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0) : result;
  };
  const instances = [];
  for (const occurrence of occurrences.values()) {
    const consumed = new Set(occurrence.sourceIds);
    const project = nodes => nodes.filter(node => consumed.has(node.id)).map(node => ({ ...node, children: node.children === null ? null : project(node.children) }));
    const expected = JSON.stringify(ordered(project(source.nodes)));
    const bindings = [...occurrence.bindings.entries()].sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0);
    const representative = bindings.find(([, values]) => {
      const binding = Object.fromEntries(variables.map((variable, index) => [variable, values[index]]));
      const rendered = body.replace(variablePattern, (_, braced, bare) => binding[braced ?? bare]);
      const parsed = parseConfig(rendered);
      return parsed.ok && JSON.stringify(ordered(parsed.nodes)) === expected;
    });
    if (representative) instances.push({ sourceIds: occurrence.sourceIds, binding: representative[1], equivalentBindings: occurrence.bindings.size });
  }
  instances.sort((left, right) => JSON.stringify(left.binding).localeCompare(JSON.stringify(right.binding), 'en'));
  return { variables, instances };
}

function filesBelow(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? filesBelow(path.join(directory, entry.name)) : entry.name.endsWith('.conf') ? [path.join(directory, entry.name)] : []).sort();
}

export function generateBindings(configuration) {
  const sourceRoot = path.join(configuration, 'conf');
  const snipsRoot = path.join(configuration, 'snips');
  const sources = filesBelow(sourceRoot).map(file => ({ device: path.relative(sourceRoot, file).replace(/\.conf$/, '').split(path.sep).join('/'), file, text: fs.readFileSync(file, 'utf8') }));
  const exclusionsPath = path.join(snipsRoot, '_source-exclusions.json');
  const exclusions = fs.existsSync(exclusionsPath) ? JSON.parse(fs.readFileSync(exclusionsPath, 'utf8')) : null;
  const trees = sources.map(source => ({ ...source, tree: sourceTree(source.text, { device: source.device, exclusions }) }));
  const snips = {};
  const inputs = [];
  if (exclusions) inputs.push(['snips/_source-exclusions.json', digest(JSON.stringify(exclusions))]);
  for (const source of sources) inputs.push([`conf/${source.device}.conf`, digest(fs.readFileSync(source.file))]);
  const bodyCache = new Map();
  for (const file of [...filesBelow(path.join(snipsRoot, 'evo')), ...filesBelow(path.join(snipsRoot, 'junos'))].sort()) {
    const relative = path.relative(snipsRoot, file).split(path.sep).join('/');
    const text = fs.readFileSync(file, 'utf8');
    const { body } = parseSnip(text);
    const parsed = parseConfig(body);
    assert.ok(parsed.ok, relative);
    const normalized = canonicalize(parsed.nodes);
    inputs.push([`snips/${relative}`, digest(normalized)]);
    if (!bodyCache.has(normalized)) {
      const count = {};
      const instances = {};
      let variables;
      for (const source of trees) {
        const measured = occurrenceMap(normalized, source.tree);
        variables = measured.variables;
        if (measured.instances.length) {
          count[source.device] = measured.instances.length;
          instances[source.device] = measured.instances.map(({ binding, equivalentBindings }) => ({ binding, equivalentBindings }));
        }
      }
      bodyCache.set(normalized, { variables, count, instances });
    }
    snips[relative] = bodyCache.get(normalized);
  }
  return { schema: 2, jvd: path.basename(path.dirname(configuration)), generatedFrom: { inputsSha256: digest(JSON.stringify(inputs)), registryVersion: registry.version, registrySha256: digest(fs.readFileSync(registryPath)), devices: sources.length, snips: Object.keys(snips).length }, deviceInventory: sources.map(source => source.device), snips };
}

export function bindingsMarkdown(result) {
  const rows = Object.entries(result.snips);
  const instances = rows.flatMap(([, snip]) => Object.values(snip.instances).flat());
  const number = value => value.toLocaleString('en-US');
  const lines = [
    '# Snippet instance counts and bindings', '',
    'Generated by `npm --prefix portal run snips:bindings` from authoritative',
    'configuration and snippet bodies. `snips:bindings:check` verifies currency.', '',
    'An instance is a distinct set of consumed source statements, not a matcher',
    'assignment. Repeated occurrences remain separate even when their values agree.',
    'Every recorded instance has a consistent binding that reconstructs the selected',
    'source statements in order. Context-wrapper ordering is not significant.', '',
    'These records include exact source matches independently of `Seen on` claims.',
    'Applicability auditing must compare the two in both directions. These tables',
    'do not prove that all source configuration has been extracted.', '',
    '## Equivalent bindings', '',
    'The representative is the lexically first binding that passes ordered',
    'reconstruction. `equivalentBindings` counts distinct structural assignments',
    'to the same source occurrence; it never inflates Count and does not authorize',
    'reordering policy terms or substituting one semantic object for another.', '',
    '| | |', '|---|---|',
    `| Snippets | ${rows.length} |`, `| Devices | ${result.deviceInventory.length} |`,
    `| Snippet/device pairs with at least one instance | ${number(rows.reduce((sum, [, snip]) => sum + Object.keys(snip.count).length, 0))} |`,
    `| Instances counted | ${number(instances.length)} |`,
    `| Structural assignments represented | ${number(instances.reduce((sum, instance) => sum + instance.equivalentBindings, 0))} |`, '',
    '## Instances per snippet', '', '| Snippet | Devices | Instances | Variables |', '|---|---:|---:|---|',
  ];
  for (const [name, snip] of rows) lines.push(`| \`${name}\` | ${Object.keys(snip.count).length} | ${number(Object.values(snip.count).reduce((sum, count) => sum + count, 0))} | ${snip.variables.map(variable => `\`$${variable}\``).join(', ') || '_none_'} |`);
  lines.push('', '## Snippets with equivalent bindings', '', '| Snippet | Device | Instances | Maximum assignments per instance |', '|---|---|---:|---:|');
  for (const [name, snip] of rows) for (const [device, records] of Object.entries(snip.instances)) {
    const ambiguous = records.filter(record => record.equivalentBindings > 1);
    if (ambiguous.length) lines.push(`| \`${name}\` | ${device} | ${ambiguous.length} | ${Math.max(...ambiguous.map(record => record.equivalentBindings))} |`);
  }
  lines.push('', '## Example instance per snippet', '', '| Snippet | Device | Binding |', '|---|---|---|');
  for (const [name, snip] of rows) {
    const [device, records] = Object.entries(snip.instances)[0] ?? [];
    if (!device) continue;
    const binding = Object.fromEntries(snip.variables.map((variable, index) => [variable, records[0].binding[index]]));
    lines.push(`| \`${name}\` | ${device} | \`${JSON.stringify(binding).replace(/\|/g, '&#124;')}\` |`);
  }
  return lines.join('\n') + '\n';
}

function selfTest() {
  const source = sourceTree('interfaces { ae1 { mtu 9192; unit 0 { family inet; } unit 1 { family inet; } } }');
  const repeated = occurrenceMap('interfaces { $IFD { unit $UNIT { family inet; } } }', source);
  assert.equal(repeated.instances.length, 2);
  assert.deepEqual(repeated.instances.map(instance => instance.binding), [['ae1', '0'], ['ae1', '1']]);
  assert.equal(occurrenceMap('interfaces { $IFD { unit $UNIT { family inet; } } }', sourceTree('interfaces { ae1 { unit 0 { family inet; family inet6; } } }')).instances.length, 0);
  assert.equal(occurrenceMap('policy-options { policy-statement X { term first { then accept; } } }', sourceTree('policy-options { policy-statement X { term first { then accept; } term last { then reject; } } }')).instances.length, 0);
  assert.deepEqual(bindLine('neighbor $PE local-address $PE;', 'neighbor 1.1.1.1 local-address 1.1.1.1;', {}), { PE: '1.1.1.1' });
  assert.equal(bindLine('neighbor $PE local-address $PE;', 'neighbor 1.1.1.1 local-address 2.2.2.2;', {}), null);
  assert.deepEqual(bindLine('description $DESC;', 'description "a b";', {}), { DESC: '"a b"' });
  assert.equal(occurrenceMap('foo;', sourceTree('foo; foo;')).instances.length, 2);
  assert.equal(occurrenceMap('groups { GR { protocols { isis { interface ae1.0 { point-to-point; } spf-options { delay 50; } } } } }', sourceTree('groups { GR { protocols { isis { interface ae1.0 { point-to-point; } spf-options { delay 50; } overload { timeout 300; } } } } }')).instances.length, 0);
  assert.equal(occurrenceMap('protocols { isis { source-packet-routing; } }', sourceTree('protocols { isis { source-packet-routing; net 49.0001; interface ae1.0 { point-to-point; } } }')).instances.length, 1);
  assert.equal(occurrenceMap('protocols { isis { net 49.0001; } }', sourceTree('protocols { isis { net 49.0001; level 2 wide-metrics-only; } }')).instances.length, 1);
  assert.equal(occurrenceMap('routing-instances { V { instance-type evpn-vpws; protocols { evpn { interface ae1.100 { vpws-service-id { local 1; remote 2; } } } } interface ae1.100; } }', sourceTree('routing-instances { V { instance-type evpn-vpws; protocols { evpn { interface ae1.100 { vpws-service-id { local 1; remote 2; } } control-word; } } interface ae1.100; } }')).instances.length, 0);
  assert.equal(occurrenceMap('interfaces { ae1 { unit 0 { family inet { address 1.1.1.1/32; } } } }', sourceTree('interfaces { ae1 { unit 0 { family inet { address 1.1.1.2/32; } } } }')).instances.length, 0);
  assert.equal(occurrenceMap('interfaces { ae1 { unit 0 { family inet; } unit 1 { family inet; } } }', sourceTree('interfaces { ae1 { unit 0 { family inet; } } }')).instances.length, 0);
  assert.equal(occurrenceMap('interfaces { ae1 { unit 0 { family inet { address 1.1.1.1/32; } } } }', sourceTree('interfaces { ae1 { unit 0 { family inet { address 1.1.1.1/32; address 2.2.2.2/32; } } } }')).instances.length, 0);
  assert.equal(occurrenceMap('policy-options { policy-statement X { term first { then accept; } term last { then reject; } } }', sourceTree('policy-options { policy-statement X { term last { then reject; } term first { then accept; } } }')).instances.length, 0);
  assert.throws(() => occurrenceMap('foo;', sourceTree('foo;'), 1), /truncated/);
  assert.equal(occurrenceMap('interfaces { ae1 { mtu 9192; } }', sourceTree('interfaces { ae1 { mtu 9192; unit 0 { family inet; } } }')).instances.length, 1);
  assert.equal(occurrenceMap('protocols { l2circuit { neighbor 1.1.1.1 { interface ae1.1 { virtual-circuit-id 1; } } } }', sourceTree('protocols { l2circuit { neighbor 1.1.1.1 { interface ae1.1 { virtual-circuit-id 1; } interface ae1.2 { virtual-circuit-id 2; } } } }')).instances.length, 1);
  assert.equal(occurrenceMap('protocols { l2circuit { neighbor 1.1.1.1 { interface ae1.1 { virtual-circuit-id 1; } } } }', sourceTree('protocols { l2circuit { neighbor 1.1.1.1 { interface ae1.1 { virtual-circuit-id 1; control-word; } } } }')).instances.length, 0);
  console.log('Bindings self-test: 20 checks passed (9 positive, 11 negative)');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  selfTest();
  if (!process.argv.includes('--self-test')) {
    const rootIndex = process.argv.indexOf('--configuration');
    const configuration = rootIndex < 0 ? path.join(repo, 'service_provider/metro_ethernet_business_services/configuration') : path.resolve(process.argv[rootIndex + 1]);
    const outputIndex = process.argv.indexOf('--out');
    const output = outputIndex < 0 ? path.join(configuration, 'snips/_bindings.json') : path.resolve(process.argv[outputIndex + 1]);
    const result = generateBindings(configuration);
    const { snips, ...metadata } = result;
    const text = '{\n' + Object.entries(metadata).map(([name, value]) => ` ${JSON.stringify(name)}: ${JSON.stringify(value)},\n`).join('') + ' "snips": {\n' + Object.entries(snips).map(([name, value]) => `  ${JSON.stringify(name)}: ${JSON.stringify(value)}`).join(',\n') + '\n }\n}\n';
    const markdownPath = output.replace(/\.json$/, '.md');
    const markdown = bindingsMarkdown(result);
    if (process.argv.includes('--check')) {
      if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== text || !fs.existsSync(markdownPath) || fs.readFileSync(markdownPath, 'utf8') !== markdown) {
        console.error(`Bindings are stale: ${output}`);
        process.exitCode = 1;
      } else console.log(`Bindings check: ${result.generatedFrom.snips} snippets, ${result.generatedFrom.devices} devices`);
    } else {
      fs.writeFileSync(output, text);
      fs.writeFileSync(markdownPath, markdown);
      console.log(`Generated ${result.generatedFrom.snips} snippet bindings across ${result.generatedFrom.devices} devices: ${output}`);
    }
  }
}