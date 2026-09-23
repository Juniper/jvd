/**
 * ifl-capabilities.mjs — bounded structural scanner for logical-interface
 * selector capabilities.
 *
 * Companion to bgp-capabilities.mjs. That module answers "which BGP address
 * families does this body carry"; this one answers "which logical-interface
 * construct does this body define". Both feed VARIANT_PROVIDES_MISMATCH so a
 * member can never advertise a capability its body does not structurally
 * contain.
 *
 * `ifl` is the repository's established scope token for a logical interface.
 */

/** The closed capability vocabulary, in canonical output order. */
export const IFL_CAPABILITIES = ["ifl:irb"];

/** Strip comments and quoted strings so their contents are never read as structure. */
function strip(body) {
  let out = "";
  for (let i = 0; i < body.length; i++) {
    const two = body.slice(i, i + 2);
    if (two === "/*") {
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

/**
 * Return the text inside the first brace block whose header line's last word
 * before `{` equals `word`, searching only at the given text's own level.
 */
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
 * extractIflCapabilities(body) -> deterministic, deduplicated array of the
 * logical-interface capabilities structurally present in `body`.
 *
 * `ifl:irb` requires an active `interfaces { irb { unit <n> { … } } }`
 * hierarchy: an IRB interface device alone, with no logical unit, defines no
 * usable logical interface and therefore publishes nothing.
 */
export function extractIflCapabilities(body) {
  if (typeof body !== "string" || body.length === 0) return [];
  const text = strip(body);
  const interfaces = blockOf(text, "interfaces");
  if (!interfaces) return [];
  const irb = blockOf(interfaces, "irb");
  if (!irb) return [];
  const out = new Set();
  if (/(^|[\s{};])unit\s+\S+\s*\{/.test(irb)) out.add("ifl:irb");
  return IFL_CAPABILITIES.filter((c) => out.has(c));
}
