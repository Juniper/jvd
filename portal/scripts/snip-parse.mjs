/**
 * snip-parse.mjs — single source of truth for parsing a snip's 5-section header.
 *
 * Used by both generate-snips.mjs (to build snips.json) and snip-validate.mjs
 * (to enforce SNIP-CONTRACT.md). `header`, `body`, and `warnings` reproduce the
 * generator's long-standing behaviour exactly; `diagnostics` is a separate,
 * additive channel of typed contract findings that the generator ignores.
 */

/** Stable, machine-readable contract error codes. */
export const CODES = {
  MISSING_HEADER: "MISSING_HEADER",
  MISSING_TOPIC: "MISSING_TOPIC",
  TOPIC_MULTILINE: "TOPIC_MULTILINE",
  MISSING_SEEN_ON_BUCKET: "MISSING_SEEN_ON_BUCKET",
  SEEN_ON_NON_DEVICE_TOKEN: "SEEN_ON_NON_DEVICE_TOKEN",
  SEEN_ON_APPROXIMATION: "SEEN_ON_APPROXIMATION",
  SEEN_ON_UNKNOWN_DEVICE: "SEEN_ON_UNKNOWN_DEVICE",
  PAIR_WITH_UNRESOLVED: "PAIR_WITH_UNRESOLVED",
  VARIABLE_UNDECLARED: "VARIABLE_UNDECLARED",
  VARIABLE_UNUSED: "VARIABLE_UNUSED",
  UNKNOWN_HEADER_SECTION: "UNKNOWN_HEADER_SECTION",
  INVALID_SECTION_ORDER: "INVALID_SECTION_ORDER",
};

const SECTION_ORDER = [
  "topic",
  "seen-on",
  "highlights",
  "pair-with",
  "variables",
  "jvd-service-mapping",
];

// Bare prose words that must never be read as device tokens.
const APPROX_WORDS = /^(all|other|others|remaining|various|etc|devices|nodes|node|pes|pe|routers|router)$/i;

/**
 * Parse the standard snip header. Returns { header, body, warnings, diagnostics }.
 *
 * Header format (C-style block at the very top of the file):
 *   /\*
 *    * Topic:   <one-liner>
 *    * Seen on:
 *    *   Junos: <space-separated device tokens>
 *    *   EVO:   <space-separated device tokens>
 *    * Highlights:        (optional)
 *    * Pair with:         (optional)
 *    * Variables (...):    (optional)
 *    *\/
 *   <body>
 */
export function parseSnip(text) {
  const warnings = [];
  const diagnostics = [];
  const diag = (code, detail) => diagnostics.push(detail ? { code, detail } : { code });

  // Find the leading /* ... */ block. Must start at byte 0 (allowing leading whitespace lines).
  const m = text.match(/^\s*\/\*([\s\S]*?)\*\/\s*\n?/);
  if (!m) {
    diag(CODES.MISSING_HEADER);
    return { warnings: ["missing-header"], diagnostics, header: null, body: text.trim() };
  }
  const headerBlock = m[1];
  const body = text.slice(m[0].length).trimEnd();

  // Strip the leading " * " from each header line.
  const rawLines = headerBlock.split("\n").map((l) => l.replace(/^\s*\*\s?/, ""));

  // Walk lines, classifying by section.
  let section = null;
  let topic = "";
  let topicMultilineFlagged = false;
  let maxOrderSeen = -1;
  let seenOnSectionPresent = false;
  const seenOnRows = { junos: false, evo: false };
  const seenOn = { junos: [], evo: [] };
  const highlights = [];
  const pairWith = [];
  const variables = [];
  const jvdServiceMapping = [];

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (section === "jvd-service-mapping" && jvdServiceMapping.length) {
        jvdServiceMapping.push("");
      }
      continue;
    }

    // Section headers (case-insensitive on the keyword). Match on the de-starred
    // line so the keyword must sit at the header's own indent level.
    const sec = line.match(
      /^\s{0,1}(Topic|Apply-groups?|Seen on|Highlights|Pair with|Variables|JVD service mapping)\b\s*:?\s*(.*)$/i,
    );
    if (sec) {
      const key = sec[1].toLowerCase();
      if (key === "topic" || key === "apply-group" || key === "apply-groups") {
        topic = key.startsWith("apply-group") ? `Apply-group: ${sec[2].trim()}` : sec[2].trim();
        section = "topic";
      } else if (key === "seen on") {
        section = "seen-on";
        seenOnSectionPresent = true;
      } else if (key === "highlights") {
        section = "highlights";
      } else if (key === "pair with") {
        section = "pair-with";
      } else if (key === "variables") {
        section = "variables";
      } else if (key === "jvd service mapping") {
        section = "jvd-service-mapping";
      }
      const orderIdx = SECTION_ORDER.indexOf(section);
      if (orderIdx >= 0) {
        if (orderIdx < maxOrderSeen) diag(CODES.INVALID_SECTION_ORDER, section);
        if (orderIdx > maxOrderSeen) maxOrderSeen = orderIdx;
      }
      continue;
    }

    if (section === "topic") {
      // A non-empty line after the Topic keyword, before any new section, is a
      // wrapped continuation the parser cannot capture.
      if (!topicMultilineFlagged) {
        diag(CODES.TOPIC_MULTILINE, trimmed);
        topicMultilineFlagged = true;
      }
      continue;
    }

    if (section === "seen-on") {
      const so = trimmed.match(/^(Junos|EVO)\s*:\s*(.*)$/i);
      if (so) {
        const bucket = so[1].toLowerCase() === "evo" ? "evo" : "junos";
        seenOnRows[bucket] = true;
        for (const tok of so[2].split(/\s+/).filter(Boolean)) {
          if (tok.startsWith("(")) {
            // Self-contained parenthetical like "(ACX7100-32C)" is a per-device
            // platform annotation — skip and keep reading. Otherwise it begins a
            // prose note like "(all EVO PEs)" — an approximation; stop there.
            if (/\)[,;]?$/.test(tok)) continue;
            if (!/^\(none\)?$/i.test(tok)) diag(CODES.SEEN_ON_APPROXIMATION, `${bucket}: ${so[2].trim()}`);
            break;
          }
          if (!/^[A-Za-z0-9]/.test(tok)) continue;
          const clean = tok.replace(/[,;]+$/, "");
          // Contract findings — do NOT alter what gets pushed (keeps snips.json stable).
          if (clean === "see" || clean.includes("/") || clean.endsWith(".conf")) {
            diag(CODES.SEEN_ON_NON_DEVICE_TOKEN, `${bucket}: ${clean}`);
          } else if (APPROX_WORDS.test(clean)) {
            diag(CODES.SEEN_ON_APPROXIMATION, `${bucket}: ${clean}`);
          }
          seenOn[bucket].push(clean);
        }
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
      const v = trimmed.match(/^(\$[A-Z0-9_]+(?:\s*\/\s*\$[A-Z0-9_]+)*)\s+(.*)$/);
      if (v) {
        const example = v[2].replace(/^e\.g\.\s*/i, "").trim();
        variables.push({ name: v[1].trim(), example });
      }
      continue;
    }

    if (section === "jvd-service-mapping") {
      jvdServiceMapping.push(line.replace(/\s+$/, ""));
      continue;
    }

    // Not inside any recognised section: a "Word:" line here is an unknown
    // header section (device rows Junos:/EVO: sit at deeper indent and are
    // handled above, so they never reach here).
    if (section === null && /^\s{0,1}[A-Za-z][A-Za-z0-9 /-]*\s*:/.test(line)) {
      diag(CODES.UNKNOWN_HEADER_SECTION, trimmed);
    }
  }

  while (jvdServiceMapping.length && jvdServiceMapping[jvdServiceMapping.length - 1] === "") {
    jvdServiceMapping.pop();
  }

  if (!topic) {
    warnings.push("missing-topic");
    diag(CODES.MISSING_TOPIC);
  }
  // Both OS buckets are required once a Seen-on section exists.
  if (seenOnSectionPresent) {
    if (!seenOnRows.junos) diag(CODES.MISSING_SEEN_ON_BUCKET, "Junos");
    if (!seenOnRows.evo) diag(CODES.MISSING_SEEN_ON_BUCKET, "EVO");
  }

  return {
    warnings,
    diagnostics,
    header: { topic, seenOn, highlights, pairWith, variables, jvdServiceMapping },
    body,
  };
}
