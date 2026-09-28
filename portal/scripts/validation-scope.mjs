import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dependencyPath } from './dependency-resolve.mjs';
import { extractConstructOccurrences } from './config-references.mjs';
import { parseSnip } from './snip-parse.mjs';

const catalogs = new Set(['portal/src/data/snips.json', 'portal/public/snips.json']);

export function classifyChanges(paths, jvd) {
  const primary = paths.some(file => /\/configuration\/(?:snips|conf|set)\//.test(file));
  const snippets = [];
  for (const file of paths) {
    if (file.startsWith(`${jvd}/configuration/`)) {
      if (file.startsWith(`${jvd}/configuration/snips/`) && /\/(?:junos|evo)\/.*\.conf$/.test(file)) snippets.push(file);
      else return { mode: 'full', reason: 'JVD source or configuration metadata changed', paths: [] };
    } else if (/\/configuration\/(?:snips|conf|set)\//.test(file)) {
      continue;
    } else if (catalogs.has(file)) {
      if (!primary) return { mode: 'full', reason: 'Catalog changed without configuration source changes', paths: [] };
    } else if (!/^(?:CHANGELOG\.md|README\.md|LICENSE|NOTICE)$/.test(file) && !/\/documentation\//.test(file) && !/\/README\.md$/.test(file)) {
      return { mode: 'full', reason: 'Shared or unclassified input changed', paths: [] };
    }
  }
  return { mode: snippets.length ? 'snippets' : 'none', reason: snippets.length ? 'Changed snippets and possible consumers' : 'No configuration changes in this JVD', paths: snippets };
}

export function affectedSnippets({ before, after, changed, matrix }) {
  const reverse = new Map();
  const connect = (consumer, provider) => {
    if (!reverse.has(provider)) reverse.set(provider, new Set());
    reverse.get(provider).add(consumer);
  };
  for (const snapshot of [before, after]) {
    const index = new Map(snapshot.map(snip => [snip.rel, snip]));
    const constructs = new Map(snapshot.map(snip => [snip.rel, extractConstructOccurrences(snip.body)]));
    for (const snip of snapshot) {
      if (!snip.header || !constructs.get(snip.rel).ok) return null;
      const providers = new Set();
      for (const bullet of snip.header.pairWith ?? []) {
        if (/^(?:-\s*)?none$/i.test(bullet.trim())) continue;
        const target = dependencyPath(bullet);
        if (!target || !index.has(target)) return null;
        providers.add(target);
        const twin = target.replace(/^(junos|evo)\//, os => os === 'junos/' ? 'evo/' : 'junos/');
        if (index.has(twin)) providers.add(twin);
      }
      for (const requirement of snip.header.variantRequires ?? []) {
        const members = snapshot.filter(candidate => candidate.header?.variantGroup?.name === requirement.group);
        if (!members.length) return null;
        for (const member of members) providers.add(member.rel);
      }
      for (const binding of matrix?.occurrenceBindings ?? []) {
        if (binding.consumer === snip.rel) {
          if (!Array.isArray(binding.providers)) return null;
          for (const provider of binding.providers) providers.add(provider);
        }
      }
      for (const requirement of matrix?.sourceRequirements ?? []) {
        if (requirement.consumer === snip.rel) {
          const entries = matrix.occurrenceEntrySets?.[requirement.entrySet];
          if (!Array.isArray(entries)) return null;
          for (const provider of entries) providers.add(provider);
        }
      }
      const referenceKinds = new Set(constructs.get(snip.rel).references.map(reference => reference.kind));
      for (const candidate of snapshot) {
        if (constructs.get(candidate.rel).definitions.some(definition => referenceKinds.has(definition.kind))) providers.add(candidate.rel);
      }
      for (const provider of providers) {
        if (!index.has(provider)) return null;
        connect(snip.rel, provider);
      }
    }
  }
  const affected = new Set(changed);
  for (const provider of affected) for (const consumer of reverse.get(provider) ?? []) affected.add(consumer);
  return affected;
}

export function selectCorpusCase(scope, roots) {
  return scope === null || (roots === null ? scope.size > 0 : roots.some(root => scope.has(root)));
}

export function readCorpusScope({ repoRoot, jvd, base }) {
  if (!base) return { mode: 'full', reason: 'Default full validation', affected: null };
  const git = args => execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
  const baseCommit = git(['rev-parse', '--verify', '--end-of-options', `${base}^{commit}`]).trim();
  const ancestor = git(['merge-base', baseCommit, 'HEAD']).trim();
  const paths = [...new Set([
    ...git(['diff', '--name-only', '--no-renames', '-z', ancestor, 'HEAD']).split('\0'),
    ...git(['diff', '--name-only', '--no-renames', '-z', 'HEAD']).split('\0'),
    ...git(['ls-files', '--others', '--exclude-standard', '-z']).split('\0'),
  ].filter(Boolean))];
  const decision = classifyChanges(paths, jvd);
  if (decision.mode !== 'snippets') return { ...decision, affected: decision.mode === 'full' ? null : new Set() };
  const prefix = `${jvd}/configuration/snips/`;
  const currentFiles = git(['ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', prefix]).split('\0')
    .filter(file => /\/(?:junos|evo)\/.*\.conf$/.test(file) && fs.existsSync(path.join(repoRoot, file)));
  const record = (file, text) => ({ rel: file.slice(prefix.length), ...parseSnip(text) });
  const after = [...new Set(currentFiles)].map(file => record(file, fs.readFileSync(path.join(repoRoot, file), 'utf8')));
  const before = new Map(after.map(snip => [snip.rel, snip]));
  const previousFiles = new Set(git(['ls-tree', '-r', '--name-only', '-z', ancestor, '--', prefix]).split('\0'));
  for (const file of decision.paths) {
    if (previousFiles.has(file)) before.set(file.slice(prefix.length), record(file, git(['show', `${ancestor}:${file}`])));
    else before.delete(file.slice(prefix.length));
  }
  const matrixPath = path.join(repoRoot, prefix, '_composition.json');
  const matrix = fs.existsSync(matrixPath) ? JSON.parse(fs.readFileSync(matrixPath, 'utf8')) : {};
  const affected = affectedSnippets({ before: [...before.values()], after, changed: decision.paths.map(file => file.slice(prefix.length)), matrix });
  return { ...decision, mode: affected === null ? 'full' : 'snippets', reason: affected === null ? 'Dependency scope is incomplete; checking the whole JVD' : decision.reason, affected };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const jvd = args.includes('--jvd') ? args[args.indexOf('--jvd') + 1] : null;
  const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : null;
  if (!jvd || !base) throw new Error('--jvd and --base are required');
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const scope = readCorpusScope({ repoRoot, jvd, base });
  console.log(`required=${scope.mode !== 'none'}`);
  console.log(`mode=${scope.mode}`);
  console.error(`[validation scope] ${jvd}: ${scope.reason}; affected snippets: ${scope.affected?.size ?? 'all'}`);
}