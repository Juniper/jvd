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
  MISSING_SEEN_ON_SECTION: "MISSING_SEEN_ON_SECTION",
  SEEN_ON_NON_DEVICE_TOKEN: "SEEN_ON_NON_DEVICE_TOKEN",
  SEEN_ON_APPROXIMATION: "SEEN_ON_APPROXIMATION",
  SEEN_ON_UNKNOWN_DEVICE: "SEEN_ON_UNKNOWN_DEVICE",
  PAIR_WITH_UNRESOLVED: "PAIR_WITH_UNRESOLVED",
  VARIABLE_UNDECLARED: "VARIABLE_UNDECLARED",
  VARIABLE_UNUSED: "VARIABLE_UNUSED",
  UNKNOWN_HEADER_SECTION: "UNKNOWN_HEADER_SECTION",
  LEGACY_HEADER_SECTION: "LEGACY_HEADER_SECTION",
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

// Canonical field labels for fuzzy misspelling detection.
const KNOWN_LABELS = ["topic", "seen on", "highlights", "pair with", "variables", "jvd service mapping"];

/** Bounded Levenshtein distance for short header labels. */
function editDistance(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 3;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

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

    // Reserved relationship fields have no schema yet and MUST NOT appear.
    // Detect them regardless of the current section and drop out so their
    // bullets are not miscaptured as dependencies.
    if (/^\s{0,1}(Peers with|Augments with|Variant group)\b\s*:/i.test(line)) {
      diag(CODES.UNKNOWN_HEADER_SECTION, trimmed);
      section = null;
      continue;
    }

    // Section headers (case-insensitive on the keyword). Match on the de-starred
    // line so the keyword must sit at the header's own indent level.
    const sec = line.match(
      /^\s{0,1}(Topic|Apply-groups?|Seen on|Highlights|Pair with|Variables|JVD service mapping|Variant|Role)\b\s*:?\s*(.*)$/i,
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
      } else if (key === "variant" || key === "role") {
        // Deprecated legacy fields: consumed (not captured) and flagged for migration.
        diag(CODES.LEGACY_HEADER_SECTION, trimmed);
        section = null;
      }
      const orderIdx = SECTION_ORDER.indexOf(section);
      if (orderIdx >= 0) {
        if (orderIdx < maxOrderSeen) diag(CODES.INVALID_SECTION_ORDER, section);
        if (orderIdx > maxOrderSeen) maxOrderSeen = orderIdx;
      }
      continue;
    }

    // A misspelling of a known field (edit distance <= 2) — flag it and leave the
    // current section so its bullets are not miscaptured. Device rows excluded.
    const labelMatch = line.match(/^\s{0,1}([A-Za-z][A-Za-z0-9 -]{1,24})\s*:/);
    if (labelMatch && !/^\s{0,2}(Junos|EVO)\s*:/i.test(line)) {
      const label = labelMatch[1].trim().toLowerCase().replace(/\s+/g, " ");
      if (KNOWN_LABELS.some((k) => editDistance(label, k) <= 2)) {
        diag(CODES.UNKNOWN_HEADER_SECTION, trimmed);
        section = null;
        continue;
      }
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
        let noneMarker = false;
        let hadParen = false;
        let deviceCount = 0;
        for (const tok of so[2].split(/\s+/).filter(Boolean)) {
          if (tok.startsWith("(")) {
            const selfClosing = /\)[,;]?$/.test(tok);
            if (/^\(none\)[,;]?$/i.test(tok)) {
              noneMarker = true;
              continue;
            }
            // Any non-(none) parenthetical (platform annotation or prose) is an
            // approximation. Device capture is preserved: a self-closing token
            // keeps reading, a prose note stops the line (unchanged behaviour).
            hadParen = true;
            diag(CODES.SEEN_ON_APPROXIMATION, `${bucket}: ${tok}`);
            if (selfClosing) continue;
            break;
          }
          if (!/^[A-Za-z0-9]/.test(tok)) continue;
          const clean = tok.replace(/[,;]+$/, "");
          // `/` is left for inventory resolution (scenario-qualified identities are valid).
          if (clean === "see" || clean.endsWith(".conf")) {
            diag(CODES.SEEN_ON_NON_DEVICE_TOKEN, `${bucket}: ${clean}`);
          } else if (APPROX_WORDS.test(clean)) {
            diag(CODES.SEEN_ON_APPROXIMATION, `${bucket}: ${clean}`);
          }
          seenOn[bucket].push(clean);
          deviceCount++;
        }
        // `(none)` must stand alone; a bucket must not be empty.
        if (noneMarker && deviceCount > 0) diag(CODES.SEEN_ON_APPROXIMATION, `${bucket}: (none) with devices`);
        if (!noneMarker && !hadParen && deviceCount === 0) diag(CODES.SEEN_ON_APPROXIMATION, `${bucket}: empty`);
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
      const v = trimmed.match(/^(\$[A-Z0-9_]+(?:\s*\/\s*\$[A-Z0-9_]+)*)(?:\s+(.*))?$/);
      if (v) {
        const example = (v[2] || "").replace(/^e\.g\.\s*/i, "").trim();
        variables.push({ name: v[1].trim(), example });
      }
      continue;
    }

    if (section === "jvd-service-mapping") {
      jvdServiceMapping.push(line.replace(/\s+$/, ""));
      continue;
    }
  }

  while (jvdServiceMapping.length && jvdServiceMapping[jvdServiceMapping.length - 1] === "") {
    jvdServiceMapping.pop();
  }

  if (!topic) {
    warnings.push("missing-topic");
    diag(CODES.MISSING_TOPIC);
  }
  // Seen-on is required; once present, both OS buckets must appear.
  if (!seenOnSectionPresent) {
    diag(CODES.MISSING_SEEN_ON_SECTION);
  } else {
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
