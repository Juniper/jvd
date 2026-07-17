// reconcile-platforms.mjs — reconcile each JVD's platform pills from ALL sources.
//
// Pipeline position: run AFTER generate-catalog.sh (which seeds `platforms` from
// the Juniper validated-platforms API). This step then UNIONS in the models
// found in the JVD's README and its config filenames, applies curated overrides,
// and writes jvds.json back.
//
// Rules:
//   - Union API ∪ README ∪ config-filename models. Keep every API device (the
//     full tested variety) — this never drops an API model on its own.
//   - Reject role-names (need a >=3-digit model number, so MX304/SRX4600 stay
//     but roles like MX1/SRX1A drop).
//   - Collapse dash-suffixed truncations from prose (README "QFX5130" when a
//     fuller "QFX5130-32CD" exists) — but never collapse an API model away.
//   - Apply jvd-platform-overrides.json (exclude confirmed-wrong, add gaps).
//   - Print a report: what was added, what an override removed, and which pills
//     are API-only (uncorroborated by README/config) as review candidates.
//
// Usage: node portal/scripts/reconcile-platforms.mjs [targetJvdsJson]
//   targetJvdsJson defaults to portal/src/data/jvds.json. generate-catalog.sh
//   passes a temp path in --check mode.

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..");
const JVDS = process.argv[2] ? resolve(process.argv[2]) : join(HERE, "..", "src", "data", "jvds.json");
const OVERRIDES_PATH = join(HERE, "jvd-platform-overrides.json");

const MODEL_RE = /\b(ACX|QFX|PTX|MX|SRX|EX)[ -]?[0-9][0-9A-Za-z-]*/g;
const canon = (s) => s.toUpperCase().replace(/\s/g, "");
const isModel = (m) => {
  const n = m.match(/^[A-Z]+[ -]?([0-9]+)/);
  return !!n && n[1].length >= 3;
};

function extractModels(text) {
  const out = new Set();
  for (const m of text.matchAll(MODEL_RE)) {
    const c = canon(m[0]);
    if (isModel(c)) out.add(c);
  }
  return out;
}

// Drop dash-suffixed truncations (QFX5130 when QFX5130-32CD exists), but never
// remove a model that the API listed.
function collapse(models, apiSet) {
  const a = [...models];
  return a.filter((x) => apiSet.has(x) || !a.some((y) => y !== x && y.startsWith(x + "-")));
}

const jvds = JSON.parse(readFileSync(JVDS, "utf8"));
const overrides = existsSync(OVERRIDES_PATH) ? JSON.parse(readFileSync(OVERRIDES_PATH, "utf8")) : {};

const report = [];
for (const j of jvds) {
  const api = new Set(j.platforms.map(canon));

  let readmeText = "";
  try {
    readmeText = readFileSync(join(REPO, j.repoPath, "README.md"), "utf8");
  } catch {
    /* no README */
  }
  const confDir = join(REPO, j.repoPath, "configuration", "conf");
  let confText = "";
  try {
    if (existsSync(confDir)) confText = readdirSync(confDir).join(" ").toUpperCase();
  } catch {
    /* no configs */
  }

  const readme = extractModels(readmeText);
  const conf = extractModels(confText);

  const union = new Set([...api, ...readme, ...conf]);
  const ov = overrides[j.id] || {};
  for (const x of ov.exclude || []) union.delete(canon(x));
  for (const x of ov.add || []) union.add(canon(x));

  const final = collapse([...union], api).sort();
  const finalSet = new Set(final);

  report.push({
    id: j.id,
    added: final.filter((m) => !api.has(m)),
    removed: [...api].filter((m) => !finalSet.has(m)),
    apiOnly: final.filter((m) => api.has(m) && !readme.has(m) && !conf.has(m)),
  });
  j.platforms = final;
}

writeFileSync(JVDS, JSON.stringify(jvds, null, 2) + "\n", "utf8");

console.error("=== changes ===");
for (const r of report) {
  if (!r.added.length && !r.removed.length) continue;
  console.error(`\n${r.id}`);
  if (r.added.length) console.error("  + added:   " + r.added.join(", "));
  if (r.removed.length) console.error("  − removed: " + r.removed.join(", ") + "  (override)");
}
console.error("\n=== API-only pills (not in README/config) — review candidates ===");
for (const r of report) {
  if (r.apiOnly.length) console.error(`  ${r.id}: ${r.apiOnly.join(", ")}`);
}
