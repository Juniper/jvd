// generate-readmes.mjs — extract each JVD's README.md to plain text for search.
//
// Writes portal/src/data/jvd-readmes.json  ({ [jvdId]: "plain text …" }).
// The catalog/palette search matches designs on their README prose (a
// deterministic substring signal), so this keeps that data in sync with the repo.
//
// Usage: node portal/scripts/generate-readmes.mjs

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..");
const jvds = JSON.parse(readFileSync(join(HERE, "..", "src", "data", "jvds.json"), "utf8"));
const OUT = join(HERE, "..", "src", "data", "jvd-readmes.json");

// Reduce markdown to searchable plain text: drop code fences, tables markup,
// link/image syntax, and heading/emphasis punctuation; collapse whitespace.
function toPlainText(md) {
  return md
    .replace(/```[\s\S]*?```/g, " ") // fenced code
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links → text
    .replace(/^[#>*\-+|]+/gm, " ") // heading/quote/list/table markers
    .replace(/[*_~]/g, " ") // emphasis
    .replace(/\|/g, " ") // table pipes
    .replace(/\s+/g, " ")
    .trim();
}

const out = {};
for (const j of jvds) {
  const p = join(REPO, j.repoPath, "README.md");
  if (existsSync(p)) out[j.id] = toPlainText(readFileSync(p, "utf8"));
}

writeFileSync(OUT, JSON.stringify(out) + "\n", "utf8");
console.log(`Wrote ${OUT} — ${Object.keys(out).length} READMEs`);
