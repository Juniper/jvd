/**
 * bgp-capabilities.mjs — bounded structural scanner for BGP selector capabilities.
 *
 * This is deliberately NOT a general Junos parser. It tokenizes a snip body
 * (comment-, quoted-string-, and brace-aware), locates the active
 * `protocols bgp` hierarchy, walks its active descendants, and reports only the
 * five frozen selector capabilities. `route-target` is intentionally excluded:
 * it is a scaling optimisation, never a service selector.
 *
 * Shared by the validator (for VARIANT_PROVIDES_MISMATCH) and reusable by later
 * variant-aware tooling.
 */

/** The closed capability vocabulary, in canonical output order. */
export const BGP_CAPABILITIES = ["evpn", "l2vpn", "inet-vpn", "inet6-vpn", "labeled-unicast"];

/**
 * Tokenize a configuration body into structural tokens: `{`, `}`, `;`, and
 * bare words. Comments (`/* *\/` and `#`) and double-quoted strings (with `\`
 * escapes) are skipped so their contents can never be read as structure.
 */
function tokenize(text) {
  const toks = [];
  let word = "";
  let i = 0;
  const n = text.length;
  let ok = true;
  const flush = () => {
    if (word) {
      toks.push(word);
      word = "";
    }
  };
  while (i < n) {
    const c = text[i];
    if (c === "/" && text[i + 1] === "*") {
      flush();
      i += 2;
      let closed = false;
      while (i < n) {
        if (text[i] === "*" && text[i + 1] === "/") {
          closed = true;
          i += 2;
          break;
        }
        i++;
      }
      if (!closed) {
        ok = false;
        break;
      }
      continue;
    }
    if (c === "#") {
      flush();
      while (i < n && text[i] !== "\n") i++;
      continue;
    }
    if (c === '"') {
      flush();
      i++;
      let closed = false;
      while (i < n) {
        if (text[i] === "\\") {
          i += 2;
          continue;
        }
        if (text[i] === '"') {
          closed = true;
          i++;
          break;
        }
        i++;
      }
      if (!closed) {
        ok = false;
        break;
      }
      continue;
    }
    if (c === "{" || c === "}" || c === ";") {
      flush();
      toks.push(c);
      i++;
      continue;
    }
    if (c === " " || c === "\t" || c === "\n" || c === "\r") {
      flush();
      i++;
      continue;
    }
    word += c;
    i++;
  }
  flush();
  return { toks, ok };
}

/**
 * Build a lightweight statement tree from tokens. Each node is
 * `{ words, inactive, children }` where `children` is null for a leaf. An
 * `inactive:` prefix marks the following statement (and its whole subtree)
 * inactive. Returns `{ nodes, next, ok }`; `ok` is false for unbalanced input
 * (unterminated block, a stray `}`, or a dangling statement with no `;`/`{}`),
 * so malformed input fails safe.
 */
function parseChildren(toks, start, expectClose) {
  const nodes = [];
  let i = start;
  let words = [];
  let inactive = false;
  while (i < toks.length) {
    const t = toks[i];
    if (t === "}") {
      // A pending statement with no terminator before the close is malformed.
      if (!expectClose || words.length) return { nodes, next: i + 1, ok: false };
      return { nodes, next: i + 1, ok: true };
    }
    if (t === "{") {
      const sub = parseChildren(toks, i + 1, true);
      if (!sub.ok) return { nodes, next: sub.next, ok: false };
      nodes.push({ words, inactive, children: sub.nodes });
      words = [];
      inactive = false;
      i = sub.next;
      continue;
    }
    if (t === ";") {
      if (words.length) nodes.push({ words, inactive, children: null });
      words = [];
      inactive = false;
      i++;
      continue;
    }
    if (words.length === 0 && t === "inactive:") {
      inactive = true;
      i++;
      continue;
    }
    words.push(t);
    i++;
  }
  // Unterminated block, or a dangling statement at EOF, fails safe.
  if (expectClose || words.length) return { nodes, next: i, ok: false };
  return { nodes, next: i, ok: true };
}

function hasActiveLabeledUnicast(children) {
  // `labeled-unicast` may be a block (`labeled-unicast { ... }`) or a leaf
  // (`labeled-unicast;`); either form counts.
  return children.some((c) => !c.inactive && c.words[0] === "labeled-unicast");
}

/** Recursively collect capabilities from an active node within the BGP block. */
function walkNode(node, out) {
  if (node.inactive) return;
  const w = node.words;
  if (w[0] === "family") {
    const fam = w[1];
    if (fam === "evpn") out.add("evpn");
    else if (fam === "l2vpn") out.add("l2vpn");
    else if (fam === "inet-vpn") out.add("inet-vpn");
    else if (fam === "inet6-vpn") out.add("inet6-vpn");
    else if (fam === "inet" || fam === "inet6") {
      if (node.children && hasActiveLabeledUnicast(node.children)) out.add("labeled-unicast");
    }
    // route-target is deliberately not a capability.
  }
  if (node.children) for (const c of node.children) walkNode(c, out);
}

/**
 * extractBgpCapabilities(body) -> deterministic, deduplicated array of the
 * selector capabilities structurally present under the active top-level
 * `protocols bgp` hierarchy. Malformed input returns [] rather than inventing
 * capabilities.
 */
export function extractBgpCapabilities(body) {
  if (typeof body !== "string" || body.length === 0) return [];
  const { toks, ok: tokOk } = tokenize(body);
  if (!tokOk) return [];
  const root = parseChildren(toks, 0, false);
  if (!root.ok) return [];
  const out = new Set();
  for (const p of root.nodes) {
    if (p.inactive || p.words[0] !== "protocols" || !p.children) continue;
    for (const b of p.children) {
      if (b.inactive || b.words[0] !== "bgp" || !b.children) continue;
      for (const child of b.children) walkNode(child, out);
    }
  }
  return BGP_CAPABILITIES.filter((c) => out.has(c));
}
