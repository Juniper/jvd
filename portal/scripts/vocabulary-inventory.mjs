import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { parseSnip } from './snip-parse.mjs';
import { parseConfig, canonicalize } from './config-objects.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const variablePattern = /\$\{([A-Z][A-Z0-9_]*)\}|\$([A-Z][A-Z0-9_]*)/g;
const digest = value => createHash('sha256').update(value).digest('hex');
const logicalName = name => name.replace(/^\$\{?/, '').replace(/\}$/, '');
const names = text => [...text.matchAll(variablePattern)].map(match => match[1] ?? match[2]);
const sorted = values => [...new Set(values)].sort();
const walk = root => fs.existsSync(root) ? fs.readdirSync(root, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name)).flatMap(entry => entry.isDirectory() ? walk(path.join(root, entry.name)) : [path.join(root, entry.name)]) : [];

export function templateFacts(body) {
  const parsed = parseConfig(body);
  if (!parsed.ok) return { parsed: false, variables: sorted(names(body)), contexts: {}, bodyHash: digest(body), shapeHash: null };
  const canonical = canonicalize(parsed.nodes);
  const renames = new Map();
  const shape = canonical.replace(variablePattern, (_, braced, bare) => {
    const name = braced ?? bare;
    if (!renames.has(name)) renames.set(name, `VAR${renames.size + 1}`);
    return `$${renames.get(name)}`;
  });
  const contexts = {};
  const normalize = text => text.replace(variablePattern, '$VAR');
  const visit = (nodes, trail) => {
    for (const node of nodes) {
      const statement = (node.inactive ? 'inactive: ' : '') + node.words.join(' ');
      const tokens = names(statement);
      tokens.forEach((name, slot) => {
        (contexts[name] ??= []).push(`${[...trail, normalize(statement)].join(' > ')} [variable-slot ${slot + 1}/${tokens.length}]`);
      });
      if (node.children) visit(node.children, [...trail, normalize(statement)]);
    }
  };
  visit(parsed.nodes, []);
  return { parsed: true, topBlock: parsed.nodes[0]?.words[0] ?? null, variables: sorted(renames.keys()), contexts: Object.fromEntries(Object.entries(contexts).map(([name, rows]) => [name, sorted(rows)])), bodyHash: digest(canonical), shapeHash: digest(shape) };
}

export function inventoryVocabulary(root = repo) {
  const constructGlossary = JSON.parse(fs.readFileSync(path.join(root, '.github/glossary/snip-glossary.json')));
  const variableGlossary = JSON.parse(fs.readFileSync(path.join(root, '.github/glossary/var-glossary.json')));
  const files = ['automation', 'data_center', 'enterprise_wan', 'optical', 'security', 'service_provider'].flatMap(area => walk(path.join(root, area))).filter(file => /\/configuration\/snips\/(junos|evo)\/.+\.conf$/.test(file));
  const records = [];
  const variableIndex = new Map();
  const dictionaries = new Map();
  const inputs = {};
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const rel = path.relative(root, file);
    const jvd = rel.split('/configuration/snips/')[0];
    inputs[rel] = digest(text);
    const parsed = parseSnip(text);
    const facts = templateFacts(parsed.body);
    const declared = sorted(parsed.header.variables.map(row => logicalName(row.name)));
    const name = path.basename(file, '.conf');
    const key = facts.topBlock ? `${facts.topBlock}/${name}` : null;
    const record = { path: rel, jvd, os: rel.split('/snips/')[1].split('/')[0], constructKey: key, topic: parsed.header.topic, bodyHash: facts.bodyHash, shapeHash: facts.shapeHash, parsed: facts.parsed, declared, used: facts.variables, declaredOnly: declared.filter(value => !facts.variables.includes(value)), usedOnly: facts.variables.filter(value => !declared.includes(value)), glossaryRegistered: key !== null && Object.hasOwn(constructGlossary.constructs, key) };
    records.push(record);
    if (!dictionaries.has(jvd)) {
      const dictionary = `${jvd}/configuration/snips/_variables.md`;
      const full = path.join(root, dictionary);
      const lines = fs.existsSync(full) ? fs.readFileSync(full, 'utf8').split('\n') : [];
      if (lines.length) inputs[dictionary] = digest(lines.join('\n'));
      dictionaries.set(jvd, { path: dictionary, lines });
    }
    const dictionary = dictionaries.get(jvd);
    for (const variable of sorted([...declared, ...facts.variables])) {
      if (!variableIndex.has(variable)) variableIndex.set(variable, { name: variable, registered: Object.hasOwn(variableGlossary.variables, variable), approvedDefinition: variableGlossary.variables[variable] ?? null, occurrences: [], contexts: new Set(), dictionaries: [] });
      const entry = variableIndex.get(variable);
      const declaration = parsed.header.variables.find(row => logicalName(row.name) === variable);
      entry.occurrences.push({ path: rel, jvd, declared: declared.includes(variable), used: facts.variables.includes(variable), example: declaration?.example ?? null, declarationLines: text.split('\n').flatMap((line, index) => /^\s*\*/.test(line) && names(line).includes(variable) ? [{ line: index + 1, text: line.trim() }] : []) });
      for (const context of facts.contexts[variable] ?? []) entry.contexts.add(context);
      if (!entry.dictionaries.some(row => row.path === dictionary.path)) {
        const matches = dictionary.lines.flatMap((line, index) => names(line).includes(variable) ? [{ line: index + 1, text: line.trim() }] : []);
        if (matches.length) entry.dictionaries.push({ path: dictionary.path, matches });
      }
    }
  }
  for (const file of ['.github/glossary/snip-glossary.json', '.github/glossary/var-glossary.json']) inputs[file] = digest(fs.readFileSync(path.join(root, file)));
  const keys = sorted(records.map(row => row.constructKey).filter(Boolean));
  const constructs = keys.map(key => {
    const examples = records.filter(row => row.constructKey === key);
    const hashes = sorted(examples.map(row => row.bodyHash));
    const shapes = sorted(examples.map(row => row.shapeHash).filter(Boolean));
    return { key, registered: Object.hasOwn(constructGlossary.constructs, key), approvedDefinition: constructGlossary.constructs[key] ?? null, examples: examples.map(row => ({ path: row.path, topic: row.topic, bodyHash: row.bodyHash, shapeHash: row.shapeHash })), bodyForms: hashes.length, structuralForms: shapes.length, proposedAction: shapes.length > 1 ? 'review-form-collision-before-name-reuse' : Object.hasOwn(constructGlossary.constructs, key) ? 'confirm-against-live-example' : 'propose-registration-after-semantic-review' };
  });
  const variables = [...variableIndex.values()].sort((left, right) => left.name.localeCompare(right.name)).map(row => ({ ...row, contexts: sorted(row.contexts), proposedMeaningEvidence: row.dictionaries.flatMap(dictionary => dictionary.matches.filter(match => match.text.startsWith('|')).map(match => ({ path: dictionary.path, line: match.line, declaration: match.text }))), proposedAction: row.registered ? 'confirm-usage-agrees-with-approved-meaning' : 'review-existing-vocabulary-and-source-examples-before-registration' }));
  const contextGroups = new Map();
  for (const variable of variables) for (const context of variable.contexts) {
    if (!contextGroups.has(context)) contextGroups.set(context, []);
    contextGroups.get(context).push(variable.name);
  }
  const variableCandidates = [...contextGroups].filter(([, values]) => new Set(values).size > 1).map(([context, values]) => ({ context, names: sorted(values), interpretation: 'same structural slot only; NOT semantic equivalence or approved aliases' }));
  const shapeGroups = new Map();
  for (const record of records.filter(row => row.shapeHash)) {
    if (!shapeGroups.has(record.shapeHash)) shapeGroups.set(record.shapeHash, []);
    shapeGroups.get(record.shapeHash).push(record);
  }
  const constructCandidates = [...shapeGroups].filter(([, rows]) => new Set(rows.map(row => row.constructKey)).size > 1).map(([shapeHash, rows]) => ({ shapeHash, keys: sorted(rows.map(row => row.constructKey)), examples: rows.map(row => row.path), interpretation: 'same normalized template shape; function and variable meaning must still be checked' }));
  return { schemaVersion: 1, status: 'PROPOSED-REVIEW-INVENTORY-NOT-A-GLOSSARY', source: 'live snippet files and per-JVD dictionaries, not cached catalog', inputs, summary: { snipFiles: records.length, jvds: sorted(records.map(row => row.jvd)).length, constructKeys: keys.length, normalizedBodyForms: sorted(records.map(row => row.bodyHash)).length, variableRenamedShapes: shapeGroups.size, declaredNames: sorted(records.flatMap(row => row.declared)).length, bodyNames: sorted(records.flatMap(row => row.used)).length, combinedNames: variables.length, registeredConstructs: Object.keys(constructGlossary.constructs).length, registeredVariables: Object.keys(variableGlossary.variables).length, registeredUsedVariables: variables.filter(row => row.registered && row.occurrences.some(item => item.used)).length, unregisteredConstructKeys: constructs.filter(row => !row.registered).length, unregisteredVariables: variables.filter(row => !row.registered).length, multiFormConstructKeys: constructs.filter(row => row.structuralForms > 1).length, variableCandidateGroups: variableCandidates.length, constructCandidateGroups: constructCandidates.length }, snips: records, proposedConstructReview: constructs, proposedVariableReview: variables, variableCandidates, constructCandidates };
}

export function vocabularyPreflight(inventory, selectedPaths, decisions = []) {
  const issues = [];
  const constructs = new Map(inventory.proposedConstructReview.map(row => [row.key, row]));
  const variables = new Map(inventory.proposedVariableReview.map(row => [row.name, row]));
  const justified = (kind, name, snip) => decisions.some(decision => decision.kind === kind && decision.name === name && decision.status === 'approved' && typeof decision.reviewedBy === 'string' && decision.reviewedBy.trim() && typeof decision.reason === 'string' && decision.reason.trim() && decision.snipHashes?.[snip.path] === inventory.inputs[snip.path] && Array.isArray(decision.examinedExamples) && decision.examinedExamples.length > 0 && decision.examinedExamples.every(example => /^.+\/configuration\/snips\/(junos|evo)\/.+\.conf$/.test(example.path) && Object.hasOwn(inventory.inputs, example.path) && typeof example.sha256 === 'string' && example.sha256 === inventory.inputs[example.path]));
  for (const file of selectedPaths) {
    const snip = inventory.snips.find(row => row.path === file);
    if (!snip) { issues.push({ code: 'VOCABULARY_INPUT_MISSING', path: file }); continue; }
    const construct = constructs.get(snip.constructKey);
    if ((!construct?.registered || construct.structuralForms > 1) && !justified('construct', snip.constructKey, snip)) issues.push({ code: construct?.registered ? 'CONSTRUCT_FORM_REVIEW_REQUIRED' : 'CONSTRUCT_UNREGISTERED', path: file, name: snip.constructKey });
    for (const name of sorted([...snip.declared, ...snip.used])) {
      if (!variables.get(name)?.registered && !justified('variable', name, snip)) issues.push({ code: 'VARIABLE_UNREGISTERED', path: file, name });
    }
    for (const name of snip.declaredOnly) issues.push({ code: 'VARIABLE_DECLARED_ONLY', path: file, name });
    for (const name of snip.usedOnly) issues.push({ code: 'VARIABLE_USED_ONLY', path: file, name });
  }
  return { passed: issues.length === 0, selectedFiles: selectedPaths.length, scope: 'Vocabulary registration and recorded form-review evidence only; not proof of semantic identity, source reconstruction, applicability or dependencies.', issues };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const option = process.argv.indexOf('--out');
  if (option < 0 || !process.argv[option + 1]) throw new Error('Supply --out <review-inventory.json>; curated glossaries are never written by this tool');
  const destination = path.resolve(process.argv[option + 1]);
  if (destination === repo || destination.startsWith(repo + path.sep)) throw new Error('Write review artifacts outside the JVD repository; source, curated and published files are not inventory outputs');
  const inventory = inventoryVocabulary();
  if (process.argv.includes('--check-changes')) {
    const baseIndex = process.argv.indexOf('--base');
    const base = baseIndex >= 0 ? process.argv[baseIndex + 1] : 'HEAD';
    if (!base || base.startsWith('-')) throw new Error('Supply a valid --base revision');
    const git = args => execFileSync('git', args, { cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    const files = sorted([...git(['diff', '--name-only', '--diff-filter=ACMR', '-z', base, '--']).split('\0'), ...git(['ls-files', '--others', '--exclude-standard', '-z']).split('\0')].filter(file => /\/configuration\/snips\/(junos|evo)\/.+\.conf$/.test(file)));
    const decisionIndex = process.argv.indexOf('--decisions');
    const decisions = decisionIndex >= 0 ? JSON.parse(fs.readFileSync(path.resolve(process.argv[decisionIndex + 1]), 'utf8')).decisions : [];
    if (!Array.isArray(decisions)) throw new Error('Decision document must contain a decisions array');
    inventory.preflight = vocabularyPreflight(inventory, files, decisions);
    process.exitCode = inventory.preflight.passed ? 0 : 1;
  }
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, JSON.stringify(inventory, null, 2) + '\n');
  console.log(JSON.stringify(inventory.summary, null, 2));
  if (inventory.preflight) console.log(JSON.stringify({ preflight: { ...inventory.preflight, issues: inventory.preflight.issues.length } }, null, 2));
}