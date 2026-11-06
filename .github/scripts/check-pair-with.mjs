// Every snippet's `Pair with:` header must equal its published catalog record: fixed entries by their full text,
// variant selectors by group and values. A header changed without regenerating the catalog fails here. Reads the
// checkout only; writes nothing.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const CATALOG = 'portal/public/snips.json';
// Header block, field keywords and variant grammar as the canonical snippet header parser reads them.
const HEADER = /^\s*\/\*([\s\S]*?)\n[ \t]*\*\/\s*\n?/;
const FIELD = /^\s{0,1}(Topic|Apply-groups?|Seen on|Count|Highlights|Pair with|Peers with|Variables|JVD service mapping|Variant|Role)\s*(?:(\([^)]*\))\s*(:)?|(:))\s*(.*)$/i;
const VARIANT = /^variant\s*:\s*([a-z0-9-]+)\s+(families|capabilities)=([a-z0-9,:\-]+)$/;

function headerPairWith(text) {
  const fixed = [];
  const variants = [];
  const block = HEADER.exec(text)?.[1] ?? '';
  let inPairWith = false;
  for (const line of block.replace(/\r\n?/g, '\n').split('\n').map(row => row.replace(/^\s*\*\s?/, ''))) {
    const field = FIELD.exec(line);
    if (field) { inPairWith = field[1].toLowerCase() === 'pair with'; continue; }
    const bullet = inPairWith && /^-\s*(.*)$/.exec(line.trim());
    if (!bullet) continue;
    const entry = bullet[1].trim();
    const variant = VARIANT.exec(entry);
    if (variant) variants.push({ group: variant[1], families: [...new Set(variant[3].split(',').filter(Boolean))] });
    else if (!/^(variant|required)\s*:/i.test(entry)) fixed.push(entry);
  }
  return { fixed, variants };
}

const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
const records = new Map(catalog.snips.map(record => [record.path, record]));
const files = execFileSync('git', ['ls-files', '-z', '--', '*/configuration/snips/junos/*.conf', '*/configuration/snips/evo/*.conf'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).split('\0').filter(Boolean);
const failures = [];
for (const file of files) {
  const record = records.get(file);
  records.delete(file);
  if (!record) { failures.push([file, 'no catalog record']); continue; }
  const header = headerPairWith(fs.readFileSync(file, 'utf8'));
  const fixed = (record.pairWith ?? []).map(entry => entry.raw);
  if (JSON.stringify(header.fixed) !== JSON.stringify(fixed)) failures.push([file, `Pair with ${JSON.stringify(header.fixed)}, catalog ${JSON.stringify(fixed)}`]);
  const variants = (record.variantRequires ?? []).map(({ group, families }) => ({ group, families }));
  if (JSON.stringify(header.variants) !== JSON.stringify(variants)) failures.push([file, `variant entries ${JSON.stringify(header.variants)}, catalog ${JSON.stringify(variants)}`]);
}
for (const file of records.keys()) failures.push([file, 'catalog record without a snippet file']);

for (const [file, detail] of failures.slice(0, 50)) console.log(`::error file=${file}::${detail}`);
if (failures.length) {
  console.error(`${failures.length} Pair with difference(s) between snippet headers and ${CATALOG}; regenerate the catalog after any header change.`);
  process.exit(1);
}
console.log(`Pair with matches ${CATALOG} for ${files.length} snippets`);
