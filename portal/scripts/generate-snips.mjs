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
import { parseSnip } from "./snip-parse.mjs";

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
// `parseSnip` lives in ./snip-parse.mjs — the single source of truth shared
// with snip-validate.mjs. The generator uses { header, body, warnings }; the
// separate { diagnostics } channel is consumed only by the validator.

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
// Family comes from the snip's category (directory) via snip-tech-map.json,
// with one semantic override: EVPN snips authored under transport/ are overlay
// services, not underlay transport. Subfamily (2nd level) is resolved per-snip
// against its OWN family's ordered keyword rules (first match wins); an
// unmatched snip falls to that family's named default bucket rather than
// echoing the family name.

function deriveTechFamily(name, category, techMap) {
  if (category === "transport" && /evpn/i.test(name)) return "Service Overlay";
  return techMap[category] || "General";
}

const SUBFAMILY_BY_FAMILY = {
  "Transport & Underlay": {
    default: "Routing & Forwarding",
    rules: [
      [/isis-srv6/, "IS-IS / SRv6"],
      [/isis-sr\b|isis.*sr-mpls/, "IS-IS / SR-MPLS"],
      [/isis|ti-lfa|node-sid/, "IS-IS"],
      [/ospf/, "OSPF"],
      [/srv6/, "SRv6"],
      [/segment-routing|sr-mpls|sr-mapping/, "SR-MPLS"],
      [/rsvp|mpls-lsp|mpls-transit|-te\b/, "RSVP / MPLS-TE"],
      [/ldp/, "LDP"],
      [/mpls/, "MPLS"],
      [/pim|mvpn|multicast/, "Multicast Routing"],
      [/underlay|-ebgp|bgp-fabric/, "BGP Underlay"],
      [/ibgp|bgp-internal|-rr\b|rr-client|route-reflector|core-mesh|overlay/, "iBGP / Overlay"],
      [/ecmp|load-balanc|hash|dlb|flowlet|pplb/, "ECMP / Load-Balancing"],
      [/inter-as|scaleout|vrf/, "Inter-AS / Scale-Out"],
    ],
  },
  "Service Overlay": {
    default: "Other Services",
    rules: [
      [/evpn-vpws/, "EVPN-VPWS"],
      [/evpn-elan|evpn-mac-vrf|mac-vrf/, "EVPN-ELAN"],
      [/evpn/, "EVPN"],
      [/l3vpn|type5|l3-interconnect/, "L3VPN"],
      [/l2vpn|kompella/, "BGP L2VPN (Kompella)"],
      [/l2circuit|l2ckt|pseudowire/, "L2Circuit / Pseudowire"],
      [/vpls|bridge-domain|virtual-switch|-lsw\b/, "VPLS / Bridge"],
      [/mvpn|oism/, "Multicast VPN"],
      [/virtual-router|vxlan-translation/, "Virtual Router / VXLAN"],
      [/srv6/, "SRv6"],
    ],
  },
  Interfaces: {
    default: "Physical & Logical",
    rules: [
      [/irb/, "IRB / Gateways"],
      [/loopback|lo0/, "Loopback"],
      [/vlan-ccc|ethernet-ccc/, "CCC / L2 Cross-Connect"],
      [/vlan-bridge|vlan-vxlan|bridge/, "Bridge Domains"],
      [/esi-lag|-ae-|^ae|dwdm-ae|lag|lacp/, "Aggregated Ethernet / LAG"],
      [/coherent|optics|dwdm/, "Optical Ports"],
      [/mtu/, "MTU"],
      [/fabric|uplink|p2p|breakout|physical-/, "Fabric & Uplinks"],
      [/pe-ce/, "PE-CE Links"],
      [/pseudowire/, "Pseudowire-Headend"],
      [/st0|tunnel|ike/, "Tunnel Interfaces"],
      [/trunk|access|external-vlan|flexible-vlan|vlan-normaliz|subinterface|subunit|cpe|server|tenant/, "Access / Trunk Ports"],
    ],
  },
  "Policy & Routing": {
    default: "Routing Policy",
    rules: [
      [/communit/, "Communities"],
      [/route-filter|prefix-list|-med\b/, "Route Filters"],
      [/load-balanc|pplb|pfe-load|per-packet/, "Load-Balancing Policy"],
      [/loop-prevention|clos-loop|allow-loopback|next-hop-self|nonzero-loopback/, "BGP Policy"],
      [/import|export|-rt\b|rt-export|vpn-rt|redistribut|hub-spoke/, "VPN Route Policy"],
      [/filter/, "Fabric Filters"],
    ],
  },
  "QoS / CoS": {
    default: "CoS Building Blocks",
    rules: [
      [/classif/, "Classifiers"],
      [/rewrit/, "Rewrite Rules"],
      [/scheduler|-sched|shaper|drop-profile|congestion|dcqcn/, "Schedulers & Congestion"],
      [/rocev2|rdma|lossless/, "RoCEv2 / Lossless"],
      [/forwarding-class/, "Forwarding Classes"],
    ],
  },
  "Firewall & Policing": {
    default: "Filters",
    rules: [
      [/color/, "Color / CCC Filters"],
      [/fbf|tlb-redirect|ipsec-lb|filter-based/, "Filter-Based Forwarding"],
      [/ecpri|fronthaul/, "Fronthaul Filters"],
      [/multicast/, "Multicast Filters"],
      [/policer|ddos/, "Policers / DDoS"],
      [/stateless|ipv4|ipv6/, "Stateless Filters"],
    ],
  },
  "Security & IPsec": {
    default: "Security",
    rules: [
      [/ipsec|ike|st0|tunnel/, "IPsec / IKE"],
      [/zone|screen|security-policy/, "Security Policies"],
    ],
  },
  "OAM & Telemetry": {
    default: "OAM",
    rules: [
      [/cfm|y1731|y-1731/, "CFM / Y.1731"],
      [/twamp/, "TWAMP"],
      [/lldp/, "LLDP"],
      [/rstp|spanning-tree|\bstp\b/, "Spanning Tree"],
      [/router-advertis|ipv6-router/, "Router Advertisement"],
      [/telemetry|gnmi|grpc|sensor/, "Streaming Telemetry"],
      [/bfd/, "BFD"],
    ],
  },
  "Subscriber & BNG": {
    default: "Subscriber",
    rules: [
      [/radius/, "RADIUS / AAA"],
      [/dynamic-profile|dp-auto/, "Dynamic Profiles"],
      [/dhcp|address-assignment/, "DHCP / Address Assignment"],
      [/pppoe|ipoe/, "PPPoE / IPoE"],
    ],
  },
  "Apply-groups": {
    default: "General Groups",
    rules: [
      [/isis/, "IS-IS Groups"],
      [/l3vpn|vrf/, "L3VPN Groups"],
      [/srv6/, "SRv6 Groups"],
      [/edge|core|intf/, "Interface Groups"],
      [/bgp/, "BGP Groups"],
      [/pw|fatpw|l2ckt/, "Pseudowire Groups"],
    ],
  },
  Chassis: {
    default: "Chassis",
    rules: [
      [/fpc|pic|tunnel-services/, "FPC / PIC"],
      [/aggregated-devices|ae-count/, "Aggregated Devices"],
      [/redundancy|graceful|nsr|gres/, "Redundancy"],
    ],
  },
};

function deriveSubfamily(name, family) {
  const cfg = SUBFAMILY_BY_FAMILY[family];
  // Small families (NAT / CGNAT, Multicast, High Availability, General) have no
  // rule table — the family name is the single bucket.
  if (!cfg) return family;
  for (const [re, label] of cfg.rules) {
    if (re.test(name)) return label;
  }
  return cfg.default;
}

// ---------------------------------------------------------------------------
// Pair-with resolution (same JVD, then optional cross-JVD by exact match)
// ---------------------------------------------------------------------------

function resolvePairWith(rawList, ownJvd, indexByJvdRel) {
  const resolved = [];
  for (const raw of rawList) {
    // raw looks like "evo/transport/bgp-overlay-pe-an.conf" or
    // "junos/services/evpn-type5.conf  (L3 RT-5 half on the same irb.<N>...)"
    // — split path from optional parenthetical note so the path can
    // still resolve to a snip id even when there's an inline reason.
    const m = raw.match(/^([^\s(]+\.conf)\s*(?:\(([^)]*)\))?\s*(.*)$/);
    let pathPart;
    let note = null;
    if (m) {
      pathPart = m[1];
      const paren = (m[2] || "").trim();
      const trailing = (m[3] || "").trim();
      note = [paren, trailing].filter(Boolean).join(" ").trim() || null;
    } else {
      pathPart = raw;
    }
    const cleaned = pathPart.replace(/^snips\//, "").replace(/^\//, "");
    const candidates = [`${ownJvd}::${cleaned}`];
    let id = null;
    for (const c of candidates) {
      if (indexByJvdRel.has(c)) {
        id = indexByJvdRel.get(c);
        break;
      }
    }
    resolved.push({ raw, id, note });
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
  // prompt the AI launch URL points at. We also mirror the prompt
  // (and any sibling files the prompt references — *.txt and *.md
  // alongside it) into portal/public/byoai/<jvd>/ so they ship via
  // the GitHub Pages CDN, which has stronger caching headers and
  // lower latency than raw.githubusercontent.com.
  const byoaiJvds = [];
  const promptFiles = await walk(REPO_ROOT, (p) =>
    /\/configuration\/snips\/byoai\/[^/]+-byoai-prompt\.txt$/.test(p.split(path.sep).join("/")),
  );
  const PUBLIC_BYOAI_ROOT = path.join(PORTAL_DIR, "public", "byoai");
  // Pages base path mirrors vite.config.ts `base: "/jvd/portal/"`,
  // and Pages serves it under https://juniper.github.io/jvd/portal/
  const PAGES_BYOAI_BASE = "https://juniper.github.io/jvd/portal/byoai";

  // Wipe the mirror clean each run so deletions in source propagate.
  await fs.rm(PUBLIC_BYOAI_ROOT, { recursive: true, force: true });

  for (const pf of promptFiles) {
    const rel = path.relative(REPO_ROOT, pf).split(path.sep).join("/");
    const parts = rel.split("/");
    const cfg = parts.indexOf("configuration");
    if (cfg <= 0) continue;
    const jvd = parts[cfg - 1];
    const sourceDir = path.dirname(pf);
    const promptFile = path.basename(pf);

    // Mirror every .txt and .md file living next to the prompt (these are
    // the docs the prompt itself references — snips bundle, MENU.md, etc).
    // Skip executables (make-*.sh, *.py) — not user-facing.
    const mirrorEntries = await fs.readdir(sourceDir, { withFileTypes: true });
    const mirrorTargetDir = path.join(PUBLIC_BYOAI_ROOT, jvd);
    await fs.mkdir(mirrorTargetDir, { recursive: true });
    for (const ent of mirrorEntries) {
      if (!ent.isFile()) continue;
      if (!/\.(txt|md|json)$/i.test(ent.name)) continue;
      const srcPath = path.join(sourceDir, ent.name);
      const dstPath = path.join(mirrorTargetDir, ent.name);
      // Rewrite raw.githubusercontent.com URLs that point INTO this
      // BYOAI folder so the AI's follow-on fetches also hit the Pages
      // CDN copy. Source files (raw.gh path → JVD config repo) are
      // left untouched; we only rewrite URLs that target THIS folder.
      const rawPrefix = `https://raw.githubusercontent.com/Juniper/jvd/main/${parts.slice(0, cfg + 1).join("/")}/snips/byoai/`;
      const pagesPrefix = `${PAGES_BYOAI_BASE}/${jvd}/`;
      let content = await fs.readFile(srcPath, "utf8");
      if (content.includes(rawPrefix)) {
        content = content.split(rawPrefix).join(pagesPrefix);
      }
      // CORPUS-A exception, scoped to jvd-*-snips.md ONLY: Configuration mode
      // fetches the snip bundle from the committed raw.githubusercontent source,
      // never the Pages mirror. Undo the general rewrite for that one URL so the
      // portal-facing prompt keeps the raw bundle URL.
      const escapedPagesPrefix = pagesPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      content = content.replace(
        new RegExp(`${escapedPagesPrefix}(jvd-[a-z0-9-]+-snips\\.md)`, "g"),
        `${rawPrefix}$1`,
      );
      await fs.writeFile(dstPath, content);
    }

    // Synthesize a hardened VS Code prompt-file (<slug>.prompt.md) derived
    // from the canonical bootstrap prompt. It inlines the guide so it is pinned
    // and self-contained. This is a build artifact: it stays in sync with the
    // .txt on every run and powers the portal's "Open in VS Code" install link.
    //
    // It runs in `agent` mode with a single-tool whitelist: `fetch`. VS Code
    // only attaches tools in agent mode (the `ask` agent ignores a `tools`
    // list), so agent mode is required for the assistant to retrieve the
    // published JVD corpus (documentation + snip bundle) it is instructed to
    // load. The explicit `tools` list REPLACES the default agent toolset, so
    // the assistant gets ONLY read-only web fetch — no file-editing and no
    // terminal tools are granted, preserving the hardened read-only posture.
    const slug = promptFile.replace(/^jvd-/, "").replace(/-byoai-prompt\.txt$/, "");
    const vscodePromptName = `jvd-${slug}`;
    const vscodePromptFile = `${slug}.prompt.md`;
    const label = (jvdMeta.get(jvd)?.label || jvd).replace(/'/g, "''");
    const promptBody = await fs.readFile(pf, "utf8");
    // VS Code always has the fetch tool here, so scope out the inlined no-web
    // fallbacks (paste / limited mode / confirm-first) that exist for other clients.
    const vscodeRuntimeNote =
      "> VS Code runtime: you have a live web-fetch tool, so you always have web\n" +
      "> access here. When the task calls for the corpus (datasheet, design docs,\n" +
      "> snip bundle), fetch it immediately and silently, then answer with\n" +
      "> citations. The no-web fallbacks described later — pasting files, \"limited\n" +
      "> mode,\" or confirming a fetch first — are for clients without fetch and\n" +
      "> don't apply here.\n";
    const vscodePromptMd =
      "---\n" +
      `description: '${label} — Juniper Validated Design BYOAI assistant: config generation and design Q&A grounded in the validated snip library.'\n` +
      `name: ${vscodePromptName}\n` +
      "agent: agent\n" +
      "tools: ['fetch']\n" +
      "---\n\n" +
      vscodeRuntimeNote +
      "\n" +
      promptBody;
    await fs.writeFile(path.join(mirrorTargetDir, vscodePromptFile), vscodePromptMd);

    byoaiJvds.push({
      jvd,
      promptPath: rel,
      // Pages-mirrored URL (preferred): served from CDN with strong caching.
      promptUrl: `${PAGES_BYOAI_BASE}/${jvd}/${promptFile}`,
      // Raw GitHub URL (kept as fallback / source-of-truth pointer).
      rawUrl: `https://raw.githubusercontent.com/Juniper/jvd/main/${rel}`,
      // Synthesized VS Code prompt-file (ask mode) — powers the portal's
      // "Open in VS Code" install link (vscode:chat-prompt/install?url=…).
      vscodePromptUrl: `${PAGES_BYOAI_BASE}/${jvd}/${vscodePromptFile}`,
      vscodePromptName,
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
    const techFamily = deriveTechFamily(interp.name, interp.category, techMap);
    const subfamily = deriveSubfamily(interp.name, techFamily);

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
      otherOsFormId: null, // filled in pass 2 (cross-OS sibling by jvd+category+name)
      topic: header?.topic || "",
      seenOn: header?.seenOn || { junos: [], evo: [] },
      highlights: header?.highlights || [],
      pairWith: [], // filled in pass 2
      variables: header?.variables || [],
      jvdServiceMapping: header?.jvdServiceMapping || [],
      // Variant metadata is emitted only when authored, so records without it
      // stay byte-identical and snips.json does not churn.
      ...(header?.variantGroup ? { variantGroup: header.variantGroup } : {}),
      ...(header?.variantRequires && header.variantRequires.length
        ? { variantRequires: header.variantRequires }
        : {}),
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
    // Derived cross-OS navigation only — NOT an assertion that bodies are identical.
    const otherOs = r.osKey === "junos" ? "evo" : "junos";
    r.otherOsFormId = indexByJvdRel.get(`${r.jvd}::${otherOs}/${r.category}/${r.name}.conf`) || null;
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
