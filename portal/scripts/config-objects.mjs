/**
 * config-objects.mjs — bounded object extractor for Junos/EVO configuration.
 *
 * This is NOT a complete Junos parser and must never be described as one. It
 * understands exactly four lexical things — comments, double-quoted strings,
 * balanced braces, and `;`-terminated statements — and carries every other
 * character through verbatim as statement content. That is enough to lift a
 * NAMED object out of a hierarchy and compare it structurally, and it is not
 * enough to interpret configuration semantics.
 *
 * Differences from `bgp-capabilities.mjs`, which is the repo's other structural
 * scanner: that scanner DISCARDS quoted-string contents (fail-safe for deciding
 * whether a capability is present, lossy for reconstruction). Reconstruction
 * needs every statement preserved, so this module keeps quoted spans verbatim
 * as single words and cannot share that tokenizer.
 *
 * Guarantees
 *  - No configuration statement is ever dropped. Only comments are discarded.
 *  - Statement ORDER is preserved. Junos filter terms are order-significant, so
 *    canonical output is order-sensitive by design.
 *  - Malformed input fails closed (`ok:false`), never partially.
 *
 * Normalization applied by `canonicalize`, and nothing else:
 *  - CRLF and lone CR become LF.
 *  - Indentation is regenerated from structural depth.
 *  - Runs of insignificant whitespace between words become one space.
 *  - `[ … ]` list bracket spacing is regularized (brackets are their own words).
 * Values, names, quoting, `inactive:` marking and ordering are untouched.
 *
 * Snip bodies are templated, so `${VAR}` is read as one word rather than as a
 * brace pair. Junos configuration has no `${` construct, so this cannot
 * misread real configuration.
 */

/** CRLF and lone CR become LF. Applied before any structural reading. */
export function normalizeNewlines(text) {
  return String(text).replace(/\r\n?/g, "\n");
}

/**
 * Tokenize into `{`, `}`, `;`, `[`, `]` and words. Comments (`/* *\/`, `#`, and
 * Junos `##` annotations) are dropped. A double-quoted span — including its
 * quotes and `\` escapes — is kept verbatim and glued to the word being built,
 * so `description "a b";` yields `description`, `"a b"`, `;`.
 *
 * Returns `{ toks, ok }`; `ok` is false for an unterminated comment or string.
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
      let j = i + 1;
      let closed = false;
      while (j < n) {
        if (text[j] === "\\") {
          j += 2;
          continue;
        }
        if (text[j] === '"') {
          closed = true;
          j++;
          break;
        }
        j++;
      }
      if (!closed) {
        ok = false;
        break;
      }
      word += text.slice(i, j);
      i = j;
      continue;
    }
    if (c === "$" && text[i + 1] === "{") {
      const close = text.indexOf("}", i + 2);
      if (close === -1) {
        ok = false;
        break;
      }
      word += text.slice(i, close + 1);
      i = close + 1;
      continue;
    }
    if (c === "{" || c === "}" || c === ";" || c === "[" || c === "]") {
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
 * Build a statement tree. Each node is `{ words, inactive, children }`, with
 * `children === null` for a leaf. An `inactive:` prefix marks the statement and
 * its subtree. Unbalanced input, a stray `}`, or a dangling unterminated
 * statement all return `ok:false`.
 */
function parseChildren(toks, start, expectClose) {
  const nodes = [];
  let i = start;
  let words = [];
  let inactive = false;
  while (i < toks.length) {
    const t = toks[i];
    if (t === "}") {
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
      // A `;` closing a block (`filter x { … };`) carries no words: not a statement.
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
  if (expectClose || words.length) return { nodes, next: i, ok: false };
  return { nodes, next: i, ok: true };
}

/** parseConfig(text) -> `{ nodes, ok }`. `ok:false` means nothing may be trusted. */
export function parseConfig(text) {
  const src = normalizeNewlines(text);
  const { toks, ok: tokOk } = tokenize(src);
  if (!tokOk) return { nodes: [], ok: false };
  const root = parseChildren(toks, 0, false);
  return { nodes: root.nodes, ok: root.ok };
}

function renderNodes(nodes, depth, out) {
  const pad = "  ".repeat(depth);
  for (const node of nodes) {
    const head = (node.inactive ? "inactive: " : "") + node.words.join(" ");
    if (node.children === null) {
      out.push(`${pad}${head};`);
    } else {
      out.push(`${pad}${head} {`);
      renderNodes(node.children, depth + 1, out);
      out.push(`${pad}}`);
    }
  }
}

/** Deterministic text for a node list. Equal strings mean structurally equal config. */
export function canonicalize(nodes) {
  const out = [];
  renderNodes(nodes, 0, out);
  return out.join("\n");
}

/** Deterministic text for one object, including its own header line and braces. */
export function canonicalizeObject(node) {
  return canonicalize([node]);
}

function matchWords(words, matcher) {
  if (words.length !== matcher.length) return null;
  let name = null;
  for (let i = 0; i < matcher.length; i++) {
    if (matcher[i] === "*") name = words[i];
    else if (matcher[i] !== words[i]) return null;
  }
  return { name };
}

/**
 * Find every node reachable by an exact path of word-matchers, e.g.
 * `[["firewall"], ["family","any"], ["filter","*"]]`. Exactly one `*` per path
 * names the object. Inactive ancestors are skipped: a deactivated hierarchy
 * defines nothing.
 *
 * Returns `[{ name, path, node, canonical }]` in document order. Multiple
 * entries with the same name mean the source really does define it more
 * than once — that is reported, never collapsed.
 */
export function findObjects(nodes, path) {
  const found = [];
  const walk = (level, idx, trail) => {
    const matcher = path[idx];
    for (const node of level) {
      if (node.inactive) continue;
      const m = matchWords(node.words, matcher);
      if (!m) continue;
      const nextTrail = [...trail, node.words.join(" ")];
      if (idx === path.length - 1) {
        found.push({
          name: m.name,
          path: nextTrail.join(" "),
          node,
          canonical: canonicalizeObject(node),
        });
      } else if (node.children) {
        walk(node.children, idx + 1, nextTrail);
      }
    }
  };
  walk(nodes, 0, []);
  return found;
}

/**
 * Policer names referenced from within a filter subtree. Junos spells the action
 * either flat (`then policer NAME;`) or blocked (`then { policer NAME; }`), and
 * both reach here as a leaf ending in `policer NAME`. Inactive statements
 * reference nothing.
 */
export function findPolicerReferences(node) {
  const refs = [];
  const walk = (n) => {
    if (n.inactive) return;
    if (n.children === null) {
      const w = n.words;
      if (w.length >= 2 && w[w.length - 2] === "policer") refs.push(w[w.length - 1]);
    } else {
      for (const c of n.children) walk(c);
    }
  };
  if (node.children) for (const c of node.children) walk(c);
  return [...new Set(refs)];
}
