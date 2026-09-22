/**
 * gr-capabilities.mjs — bounded structural scanner for configuration-group
 * selector capabilities.
 *
 * Companion to bgp-capabilities.mjs and ifl-capabilities.mjs. A member may only
 * advertise a group capability its body structurally defines, so
 * VARIANT_PROVIDES_MISMATCH still holds for groups.
 *
 * `gr` is the repository's established prefix for a configuration group
 * (.github/glossary/snip-glossary.json).
 */

/** The closed capability vocabulary, in canonical output order. */
export const GR_CAPABILITIES = ["gr:edge-intf-mh"];

/** Group name defined by each capability. */
const GROUP_OF = { "gr:edge-intf-mh": "GR-EDGE-INTF-MH" };

/** Strip comments and quoted strings so their contents are never read as structure. */
function strip(body) {
  let out = "";
  for (let i = 0; i < body.length; i++) {
    if (body.slice(i, i + 2) === "/*") {
      const end = body.indexOf("*/", i + 2);
      i = end === -1 ? body.length : end + 1;
      continue;
    }
    if (body[i] === "#") {
      const end = body.indexOf("\n", i);
      i = end === -1 ? body.length : end - 1;
      continue;
    }
    if (body[i] === '"') {
      i += 1;
      while (i < body.length && body[i] !== '"') i += body[i] === "\\" ? 2 : 1;
      continue;
    }
    out += body[i];
  }
  return out;
}

/** Text inside the first brace block headed by `word`, or null. */
function blockOf(text, word) {
  const re = new RegExp(`(^|[\\s{};])${word}\\s*\\{`, "g");
  let m;
  while ((m = re.exec(text)) !== null) {
    let depth = 1;
    let i = re.lastIndex;
    for (; i < text.length && depth > 0; i++) {
      if (text[i] === "{") depth += 1;
      else if (text[i] === "}") depth -= 1;
    }
    if (depth === 0) return text.slice(re.lastIndex, i - 1);
  }
  return null;
}

/**
 * extractGrCapabilities(body) -> deterministic, deduplicated array of the
 * configuration-group capabilities structurally present in `body`.
 *
 * A capability requires an active `groups { <NAME> { … } }` hierarchy whose
 * group block is non-empty: a declared but empty group configures nothing.
 */
export function extractGrCapabilities(body) {
  if (typeof body !== "string" || body.length === 0) return [];
  const groups = blockOf(strip(body), "groups");
  if (!groups) return [];
  const out = new Set();
  for (const cap of GR_CAPABILITIES) {
    const inner = blockOf(groups, GROUP_OF[cap]);
    if (inner !== null && inner.trim().length > 0) out.add(cap);
  }
  return GR_CAPABILITIES.filter((c) => out.has(c));
}
