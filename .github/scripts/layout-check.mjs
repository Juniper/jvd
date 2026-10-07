// Layout guardrail for pull requests. Only content the change adds or renames is checked, so untouched existing
// JVDs never fail. A JVD folder that does not exist at the base is new and must meet the folder rules; any image the
// change adds inside a JVD must live under images/ or documentation/images/. Reads git objects only; writes nothing.
import { execFileSync } from 'node:child_process';

const option = name => process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : undefined;
const base = option('--base');
const head = option('--head') ?? 'HEAD';
if (!base) { console.error('Usage: node .github/scripts/layout-check.mjs --base <ref> [--head <ref>]'); process.exit(2); }

const git = args => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const exists = (ref, path) => { try { execFileSync('git', ['cat-file', '-e', `${ref}:${path}`], { stdio: 'ignore' }); return true; } catch { return false; } };

// Same JVD discovery as the portal catalog: one folder level below each area root.
const AREAS = ['data_center/adc', 'data_center/aidc', 'enterprise_wan', 'optical', 'security', 'service_provider'];
const NOT_A_JVD = new Set(['images', 'scripts', 'automation']);
const IMAGE = /\.(png|jpe?g|gif|svg|webp)$/i;
const SNAKE = /^[a-z0-9]+(_[a-z0-9]+)*$/;

function jvdOf(file) {
  for (const area of AREAS) {
    if (!file.startsWith(`${area}/`)) continue;
    const parts = file.slice(area.length + 1).split('/');
    if (parts.length < 2 || NOT_A_JVD.has(parts[0]) || parts[0].startsWith('.')) return null;
    return { root: `${area}/${parts[0]}`, name: parts[0], relative: parts.slice(1).join('/') };
  }
  return null;
}

const added = git(['diff', '--name-status', '-M', '--diff-filter=AR', `${base}...${head}`])
  .split('\n').filter(Boolean).map(line => line.split('\t').at(-1));

const problems = [];
const newJvds = new Map();
for (const file of added) {
  const jvd = jvdOf(file);
  if (!jvd) continue;
  if (!exists(base, jvd.root)) newJvds.set(jvd.root, jvd.name);
  if (IMAGE.test(file) && !/^(documentation\/)?images\//.test(jvd.relative)) problems.push(`${file}: images belong under ${jvd.root}/images/ or ${jvd.root}/documentation/images/`);
}

if (newJvds.size) {
  const catalog = JSON.parse(git(['show', `${head}:portal/src/data/jvds.json`]));
  const listed = new Set(catalog.map(entry => entry.repoPath));
  for (const [root, name] of newJvds) {
    if (!SNAKE.test(name)) problems.push(`${root}: JVD folder name must be lowercase snake_case`);
    if (!exists(head, `${root}/README.md`)) problems.push(`${root}: missing README.md`);
    if (!exists(head, `${root}/configuration/conf`) && !exists(head, `${root}/configuration/set`)) problems.push(`${root}: missing configuration/conf or configuration/set`);
    if (!listed.has(root)) problems.push(`${root}: not listed in portal/src/data/jvds.json`);
  }
}

console.log(`layout check: ${added.length} added or renamed file(s), ${newJvds.size} new JVD folder(s)`);
for (const problem of problems) console.log(`::error::${problem}`);
process.exit(problems.length ? 1 : 0);
