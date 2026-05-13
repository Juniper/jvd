#!/usr/bin/env node
/**
 * generate-snips.mjs — regenerate portal/src/data/snips.json
 *
 * Walks `**\/configuration/snips/{junos,evo}/<category>/<name>.conf` across
 * every JVD folder, parses the standard 5-section header
 * (Topic / Seen on / Highlights / Pair with / Variables), highlights the
 * body with shiki at build-time, and writes a single bundle consumed by
 * the Snip Library section of the portal.
 *
 * Auto-discovery: any new JVD that drops conformant snips into
 * configuration/snips/ will be picked up on the next build with no
 * code changes. The use-case map (jvd-usecase-map.json) takes one
 * optional one-liner per JVD to surface it under the "Use case"
 * browse mode.
 *
 * Usage:
 *   node portal/scripts/generate-snips.mjs            # regenerate
 *   node portal/scripts/generate-snips.mjs --check    # CI guard (exit !=0 if stale)
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const PORTAL_DIR = path.join(REPO_ROOT, "portal");
const OUT_PATH = path.join(PORTAL_DIR, "src", "data", "snips.json");
const USECASE_MAP_PATH = path.join(__dirname, "jvd-usecase-map.json");
const TECH_MAP_PATH = path.join(__dirname, "snip-tech-map.json");
const CATALOG_PATH = path.join(PORTAL_DIR, "src", "data", "jvds.json");

const CHECK_ONLY = process.argv.includes("--check");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function readJson(p) {
  const txt = await fs.readFile(p, "utf8");
  return JSON.parse(txt);
}

function stripUnderscoreKeys(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !k.startsWith("_")));
}

/** Recursively list files under `dir` matching `predicate(absPath)`. */
async function walk(dir, predicate, out = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (e) {
    if (e.code === "ENOENT") return out;
    throw e;
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      // Skip hidden dirs and node_modules to keep the walk fast on big repos
      if (ent.name.startsWith(".") || ent.name === "node_modules") continue;
      await walk(full, predicate, out);
    } else if (ent.isFile() && predicate(full)) {
      out.push(full);
    }
  }
  return out;
}

/** Deterministic JSON.stringify (sorted keys) so --check is stable. */
function stableStringify(value) {
  return JSON.stringify(value, null, 2) + "\n";
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// ---------------------------------------------------------------------------
// Parser for the 5-section header
// ---------------------------------------------------------------------------

/**
 * Parse the standard snip header. Returns { header, body, warnings }.
 *
 * Header format (C-style block at the very top of the file):
 *   /\*
 *    * Topic:   <one-liner>
 *    * Seen on:
 *    *   Junos: <space-separated device tokens>
 *    *   EVO:   <space-separated device tokens>
 *    *
 *    * Highlights:        (optional)
 *    *  - bullet
 *    *
 *    * Pair with:         (optional)
 *    *  - <relpath under snips/>
 *    *
 *    * Variables (...):    (optional)
 *    *   $VAR    e.g. <example>
 *    *\/
 *   <body>
 */
function parseSnip(text) {
  const warnings = [];
  // Find the leading /* ... */ block. Must start at byte 0 (allowing leading whitespace lines).
  const m = text.match(/^\s*\/\*([\s\S]*?)\*\/\s*\n?/);
  if (!m) {
    return { warnings: ["missing-header"], header: null, body: text.trim() };
  }
  const headerBlock = m[1];
  const body = text.slice(m[0].length).trimEnd();

  // Strip the leading " * " from each header line.
  const rawLines = headerBlock.split("\n").map((l) => l.replace(/^\s*\*\s?/, ""));

  // Walk lines, classifying by section.
  let section = null;
  let topic = "";
  const seenOn = { junos: [], evo: [] };
  const highlights = [];
  const pairWith = [];
  const variables = [];

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Section headers (case-insensitive on the keyword).
    // "Apply-group" is accepted as a synonym for "Topic" — apply-group snips
    // are routinely headed with "Apply-group: GR-NAME" since the group name
    // IS the topic.
    const sec = trimmed.match(/^(Topic|Apply-groups?|Seen on|Highlights|Pair with|Variables)\b\s*:?\s*(.*)$/i);
    if (sec) {
      const key = sec[1].toLowerCase();
      if (key === "topic" || key === "apply-group" || key === "apply-groups") {
        topic = key.startsWith("apply-group") ? `Apply-group: ${sec[2].trim()}` : sec[2].trim();
        section = "topic";
      } else if (key === "seen on") {
        section = "seen-on";
      } else if (key === "highlights") {
        section = "highlights";
      } else if (key === "pair with") {
        section = "pair-with";
      } else if (key === "variables") {
        section = "variables";
      }
      continue;
    }

    if (section === "seen-on") {
      const so = trimmed.match(/^(Junos|EVO)\s*:\s*(.*)$/i);
      if (so) {
        const bucket = so[1].toLowerCase() === "evo" ? "evo" : "junos";
        for (const tok of so[2].split(/\s+/).filter(Boolean)) seenOn[bucket].push(tok);
      }
      continue;
    }

    if (section === "highlights") {
      const b = trimmed.match(/^-\s*(.*)$/);
      if (b) highlights.push(b[1].trim());
      else if (highlights.length) highlights[highlights.length - 1] += " " + trimmed;
      continue;
    }

    if (section === "pair-with") {
      const b = trimmed.match(/^-\s*(.*)$/);
      if (b) pairWith.push(b[1].trim());
      continue;
    }

    if (section === "variables") {
      // e.g.  "$LOOPBACK_V4         e.g. 192.168.0.7"
      // or    "$RR_AGN1_V4 / $RR_AGN2_V4   e.g. 192.168.0.5 / 192.168.0.6"
      const v = trimmed.match(/^(\$[A-Z0-9_]+(?:\s*\/\s*\$[A-Z0-9_]+)*)\s+(.*)$/);
      if (v) {
        const example = v[2].replace(/^e\.g\.\s*/i, "").trim();
        variables.push({ name: v[1].trim(), example });
      }
      continue;
    }
  }

  if (!topic) warnings.push("missing-topic");

  return {
    warnings,
    header: { topic, seenOn, highlights, pairWith, variables },
    body,
  };
}

// ---------------------------------------------------------------------------
// Path interpretation: snips/{junos|evo}/<category>/<name>.conf
// ---------------------------------------------------------------------------

function interpretSnipPath(absPath) {
  const rel = path.relative(REPO_ROOT, absPath).split(path.sep).join("/");
  // Find the segment "configuration/snips/<os>/<category>/<file>"
  const parts = rel.split("/");
  const snipsIdx = parts.indexOf("snips");
  if (snipsIdx < 0 || snipsIdx + 3 >= parts.length) return null;
  const osDir = parts[snipsIdx + 1];
  const category = parts[snipsIdx + 2];
  const file = parts[snipsIdx + 3];
  if (!file.endsWith(".conf")) return null;
  if (osDir !== "junos" && osDir !== "evo") return null; // skip byoai/, _variables.md, etc.

  // JVD root = everything before configuration/
  const configIdx = parts.indexOf("configuration");
  if (configIdx <= 0) return null;
  const jvdParts = parts.slice(0, configIdx);
  const jvd = jvdParts[jvdParts.length - 1];
  const jvdRepoPath = jvdParts.join("/");

  return {
    jvd,
    jvdRepoPath,
    os: osDir === "evo" ? "Junos EVO" : "Junos",
    osKey: osDir,
    category,
    name: file.replace(/\.conf$/, ""),
    relPath: rel,
  };
}

// ---------------------------------------------------------------------------
// Technology family / subfamily derivation
// ---------------------------------------------------------------------------

const SUBFAMILY_RULES = [
  // Order matters — first match wins. Keys are case-insensitive substrings of the snip name.
  { match: /isis-srv6/, label: "IS-IS / SRv6" },
  { match: /isis-sr/, label: "IS-IS / SR-MPLS" },
  { match: /isis/, label: "IS-IS" },
  { match: /ospf/, label: "OSPF" },
  { match: /srv6/, label: "SRv6" },
  { match: /segment-routing|sr-mpls|mpls-sr/, label: "SR-MPLS" },
  { match: /bgp-overlay-rr/, label: "BGP Overlay (Route Reflector)" },
  { match: /bgp-overlay-pe/, label: "BGP Overlay (PE)" },
  { match: /bgp-overlay/, label: "BGP Overlay" },
  { match: /bgp-underlay|bgp-fabric/, label: "BGP Underlay" },
  { match: /labeled-unicast|bgp-lu/, label: "BGP-LU" },
  { match: /routing-options/, label: "Routing Options" },
  { match: /evpn-vpws/, label: "EVPN-VPWS" },
  { match: /evpn-elan|evpn-mac-vrf/, label: "EVPN-ELAN" },
  { match: /evpn/, label: "EVPN" },
  { match: /l3vpn/, label: "L3VPN" },
  { match: /vpls/, label: "VPLS" },
  { match: /ps-pseudowire/, label: "Pseudowire-Headend" },
  { match: /ae-vlan-bridge|^ae[-_]/, label: "Aggregated Ethernet" },
  { match: /^lag|lacp/, label: "LAG / LACP" },
  { match: /chassis|fpc|tunnel-services/, label: "Chassis" },
  { match: /dynamic-profile|dp-auto/, label: "Dynamic Profiles" },
  { match: /radius/, label: "RADIUS" },
  { match: /address-assignment|dhcp/, label: "DHCP / Address Assignment" },
  { match: /bfd/, label: "BFD" },
  { match: /telemetry|^oam/, label: "Telemetry / OAM" },
  { match: /policer|firewall/, label: "Firewall / Policer" },
  { match: /scheduler|classifier|rewrite|cos/, label: "CoS" },
  { match: /^policy|prefix-list|community/, label: "Policy" },
];

function deriveSubfamily(name, category) {
  for (const r of SUBFAMILY_RULES) {
    if (r.match.test(name)) return r.label;
  }
  // Fallback: title-case the category
  return category.replace(/(^|-)(\w)/g, (_, sep, c) => (sep ? " " : "") + c.toUpperCase());
}

// ---------------------------------------------------------------------------
// Pair-with resolution (same JVD, then optional cross-JVD by exact match)
// ---------------------------------------------------------------------------

function resolvePairWith(rawList, ownJvd, indexByJvdRel) {
  const resolved = [];
  for (const raw of rawList) {
    // raw looks like "evo/transport/bgp-overlay-pe-an.conf" — relative to snips/
    const cleaned = raw.replace(/^snips\//, "").replace(/^\//, "");
    const candidates = [
      `${ownJvd}::${cleaned}`,
      // future: cross-JVD lookups could be tried here
    ];
    let id = null;
    for (const c of candidates) {
      if (indexByJvdRel.has(c)) {
        id = indexByJvdRel.get(c);
        break;
      }
    }
    resolved.push({ raw, id });
  }
  return resolved;
}

// ---------------------------------------------------------------------------
// Shiki highlighting (build-time)
// ---------------------------------------------------------------------------

let _shikiHighlighter = null;
async function getHighlighter() {
  if (_shikiHighlighter) return _shikiHighlighter;
  let createHighlighter;
  try {
    ({ createHighlighter } = await import("shiki"));
  } catch (e) {
    console.warn(
      "[generate-snips] shiki not installed — body HTML will be plain <pre>. " +
        "Run `bun add -D shiki` in portal/ to enable syntax highlighting.",
    );
    return null;
  }
  _shikiHighlighter = await createHighlighter({
    themes: ["github-dark-default"],
    // Junos hierarchical config has no first-class grammar; "apache" gives
    // decent highlighting for {, }, comments, and strings.
    langs: ["apache"],
  });
  return _shikiHighlighter;
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function highlightBody(body) {
  const hl = await getHighlighter();
  if (!hl) {
    return `<pre class="shiki"><code>${escapeHtml(body)}</code></pre>`;
  }
  return hl.codeToHtml(body, {
    lang: "apache",
    theme: "github-dark-default",
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const usecaseMap = stripUnderscoreKeys(await readJson(USECASE_MAP_PATH));
  const techMap = stripUnderscoreKeys(await readJson(TECH_MAP_PATH));

  // jvds.json drives the JVD label + area lookup
  let catalog = [];
  try {
    catalog = await readJson(CATALOG_PATH);
  } catch {
    /* catalog absent — labels will fall back to slugs */
  }
  const jvdMeta = new Map();
  for (const j of catalog) {
    jvdMeta.set(j.id, { label: j.name, area: j.area, repoPath: j.repoPath });
  }

  // Walk all snip files
  const files = await walk(REPO_ROOT, (p) =>
    /\/configuration\/snips\/(junos|evo)\/[^/]+\/[^/]+\.conf$/.test(p.split(path.sep).join("/")),
  );
  files.sort();

  // Also collect _variables.md per JVD
  const variableGlossaries = [];
  const varFiles = await walk(REPO_ROOT, (p) =>
    /\/configuration\/snips\/_variables\.md$/.test(p.split(path.sep).join("/")),
  );
  for (const vf of varFiles) {
    const interp = (() => {
      const rel = path.relative(REPO_ROOT, vf).split(path.sep).join("/");
      const parts = rel.split("/");
      const cfg = parts.indexOf("configuration");
      if (cfg <= 0) return null;
      return { jvd: parts[cfg - 1] };
    })();
    if (!interp) continue;
    variableGlossaries.push({
      jvd: interp.jvd,
      markdown: await fs.readFile(vf, "utf8"),
    });
  }

  // Detect BYOAI-equipped JVDs. A JVD is BYOAI-equipped if it has
  // configuration/snips/byoai/<slug>-byoai-prompt.txt — the bootstrap
  // prompt the AI launch URL points at.
  const byoaiJvds = [];
  const promptFiles = await walk(REPO_ROOT, (p) =>
    /\/configuration\/snips\/byoai\/[^/]+-byoai-prompt\.txt$/.test(p.split(path.sep).join("/")),
  );
  for (const pf of promptFiles) {
    const rel = path.relative(REPO_ROOT, pf).split(path.sep).join("/");
    const parts = rel.split("/");
    const cfg = parts.indexOf("configuration");
    if (cfg <= 0) continue;
    const jvd = parts[cfg - 1];
    byoaiJvds.push({
      jvd,
      promptPath: rel,
      promptUrl: `https://raw.githubusercontent.com/Juniper/jvd/main/${rel}`,
    });
  }
  byoaiJvds.sort((a, b) => a.jvd.localeCompare(b.jvd));

  // Pass 1: parse + collect, build cross-ref index
  const records = [];
  const indexByJvdRel = new Map(); // "<jvd>::<os>/<cat>/<name>.conf" -> id
  const allWarnings = [];

  for (const file of files) {
    const interp = interpretSnipPath(file);
    if (!interp) continue;
    const text = await fs.readFile(file, "utf8");
    const { header, body, warnings } = parseSnip(text);
    if (warnings.length) {
      for (const w of warnings) {
        allWarnings.push({ file: interp.relPath, warning: w });
      }
    }

    const meta = jvdMeta.get(interp.jvd) || {};
    const usecases = usecaseMap[interp.jvd] || (meta.area ? [meta.area] : []);
    const techFamily = techMap[interp.category] || "Other";
    const subfamily = deriveSubfamily(interp.name, interp.category);

    const id = `${interp.jvd}/${interp.osKey}/${interp.category}/${interp.name}`;
    indexByJvdRel.set(`${interp.jvd}::${interp.osKey}/${interp.category}/${interp.name}.conf`, id);

    records.push({
      id,
      jvd: interp.jvd,
      jvdLabel: meta.label || interp.jvd,
      area: meta.area || null,
      os: interp.os,
      osKey: interp.osKey,
      category: interp.category,
      name: interp.name,
      path: interp.relPath,
      topic: header?.topic || "",
      seenOn: header?.seenOn || { junos: [], evo: [] },
      highlights: header?.highlights || [],
      pairWith: [], // filled in pass 2
      variables: header?.variables || [],
      body,
      bodyHtml: "", // filled below
      bytes: Buffer.byteLength(body, "utf8"),
      lineCount: body.split("\n").length,
      techFamily,
      subfamily,
      usecases,
      parseWarnings: warnings,
    });
  }

  // Pass 2: resolve pair-with refs and highlight bodies (highlight is awaited serially
  // so shiki inits once)
  for (const r of records) {
    const text = await fs.readFile(path.join(REPO_ROOT, r.path), "utf8");
    const parsed = parseSnip(text);
    r.pairWith = resolvePairWith(parsed.header?.pairWith || [], r.jvd, indexByJvdRel);
    r.bodyHtml = await highlightBody(r.body);
  }

  // Build summary indexes
  const categories = [...new Set(records.map((r) => r.category))].sort();
  const techFamilies = [...new Set(records.map((r) => r.techFamily))].sort();
  const usecases = [...new Set(records.flatMap((r) => r.usecases))].sort();

  const jvdsSummary = [];
  const seenJvds = new Map();
  for (const r of records) {
    if (!seenJvds.has(r.jvd)) {
      seenJvds.set(r.jvd, {
        id: r.jvd,
        label: r.jvdLabel,
        area: r.area,
        repoPath: jvdMeta.get(r.jvd)?.repoPath || null,
        counts: { junos: 0, evo: 0, total: 0 },
      });
    }
    const s = seenJvds.get(r.jvd);
    s.counts[r.osKey]++;
    s.counts.total++;
  }
  for (const v of seenJvds.values()) jvdsSummary.push(v);
  jvdsSummary.sort((a, b) => a.label.localeCompare(b.label));

  const bundle = {
    generatedAt: new Date().toISOString(),
    counts: {
      total: records.length,
      junos: records.filter((r) => r.osKey === "junos").length,
      evo: records.filter((r) => r.osKey === "evo").length,
      jvds: jvdsSummary.length,
    },
    categories,
    techFamilies,
    usecases,
    jvds: jvdsSummary,
    snips: records,
    variableGlossaries: variableGlossaries.sort((a, b) => a.jvd.localeCompare(b.jvd)),
    byoaiJvds,
    parseWarnings: allWarnings,
  };

  const newJson = stableStringify(bundle);

  if (CHECK_ONLY) {
    let oldJson = "";
    try {
      oldJson = await fs.readFile(OUT_PATH, "utf8");
    } catch {
      /* missing */
    }
    // Strip the volatile generatedAt timestamp before comparing so re-runs
    // on identical input compare equal.
    const stripTs = (s) => s.replace(/"generatedAt":\s*"[^"]+",?\n?/, "");
    if (stripTs(oldJson) !== stripTs(newJson)) {
      console.error(
        `[generate-snips --check] snips.json is out of date. Run: node portal/scripts/generate-snips.mjs`,
      );
      process.exit(2);
    }
    if (allWarnings.length) {
      console.error(`[generate-snips --check] ${allWarnings.length} parse warning(s):`);
      for (const w of allWarnings) console.error(`  ${w.warning}: ${w.file}`);
      process.exit(3);
    }
    console.log(`[generate-snips --check] OK (${records.length} snips, ${jvdsSummary.length} JVDs)`);
    return;
  }

  await fs.writeFile(OUT_PATH, newJson, "utf8");
  console.log(
    `[generate-snips] wrote ${OUT_PATH} — ${records.length} snips, ` +
      `${jvdsSummary.length} JVDs, ${allWarnings.length} warning(s).`,
  );
  if (allWarnings.length) {
    for (const w of allWarnings) console.log(`  ${w.warning}: ${w.file}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
