/**
 * config-references.mjs — which named constructs a configuration body DEFINES
 * and which ones it REFERENCES.
 *
 * This is the companion to `config-objects.mjs`. That module answers "does this
 * snip reconstruct the object in a device's source?", which needs literal names
 * and is therefore defeated by templating. This module answers a different
 * question — "does the emitted configuration name something another snip must
 * supply?" — which is resolved template against template: a body emitting
 * `vrf-export $INSTANCE_NAME` resolves against a body defining
 * `policy-statement $INSTANCE_NAME`. No source values are involved, so
 * templated constructs are fully in scope here.
 *
 * Both tables below are derived from the statement shapes actually present in
 * the repository's snip corpus, not from the Junos grammar at large. A shape
 * that does not occur is not listed, and nothing is inferred.
 *
 * A construct identity is (kind, name). Name alone is not an identity: in this
 * corpus a per-service policy-statement and the routing-instance it serves
 * deliberately share a name, and a policy term can collide with a prefix-list.
 * The kind always comes from the statement keyword, never from a guess.
 */
import { parseConfig } from "./config-objects.mjs";

/** `${FOO}` and `$FOO` are the same construct name. */
export function canonicalName(name) {
  return String(name).replace(/\$\{([A-Za-z_][\w]*)\}/g, "$$$1");
}

const BRACKETS = new Set(["[", "]"]);
/** Modifiers that sit between a reference keyword and the names it carries. */
const MODIFIERS = new Set(["add", "delete", "set"]);

/**
 * Reference shapes. `keyword` is matched as a contiguous word sequence inside a
 * leaf statement; every following word is a referenced name unless it is a
 * bracket or a modifier. `parent`, when present, must equal the immediately
 * enclosing block header. `atStart` pins the keyword to word 0, which is what
 * keeps `vrf-target import target:63536:22222` from reading as a policy
 * reference.
 */
const REFERENCE_RULES = [
  { kind: "policer", keyword: ["policer"] },
  { kind: "filter", keyword: ["input"], parent: "filter" },
  { kind: "filter", keyword: ["output"], parent: "filter" },
  { kind: "policy-statement", keyword: ["vrf-export"] },
  { kind: "policy-statement", keyword: ["vrf-import"] },
  { kind: "policy-statement", keyword: ["import-policy"] },
  { kind: "policy-statement", keyword: ["export-policy"] },
  { kind: "policy-statement", keyword: ["export"], atStart: true },
  { kind: "policy-statement", keyword: ["import"], atStart: true },
  { kind: "prefix-list", keyword: ["prefix-list"] },
  { kind: "community", keyword: ["community"] },
  { kind: "group", keyword: ["apply-groups"] },
  { kind: "group", keyword: ["apply-groups-except"] },
  { kind: "scheduler-map", keyword: ["scheduler-map"] },
  { kind: "scheduler", keyword: ["scheduler"] },
];

function isCommunityDefinitionLeaf(words) {
  return words[0] === "community" && words[2] === "members";
}

/** Index of the first occurrence of `seq` in `words`, or -1. */
function indexOfSeq(words, seq) {
  for (let i = 0; i + seq.length <= words.length; i++) {
    let hit = true;
    for (let j = 0; j < seq.length; j++) {
      if (words[i + j] !== seq[j]) {
        hit = false;
        break;
      }
    }
    if (hit) return i;
  }
  return -1;
}

/**
 * Definition shapes, matched on block headers (plus the one leaf form Junos uses
 * for a community). `trail` is the list of enclosing block headers.
 */
function definitionOf(node, trail) {
  const w = node.words;
  const parent = trail[trail.length - 1] || "";
  if (node.children === null) {
    // `community NAME members ...;`
    if (isCommunityDefinitionLeaf(w)) return { kind: "community", name: w[1] };
    return null;
  }
  if (w.length === 2 && w[0] === "filter" && parent.startsWith("family")) return { kind: "filter", name: w[1] };
  if (w.length === 2 && w[0] === "policer" && parent === "firewall") return { kind: "policer", name: w[1] };
  if (w.length === 2 && w[0] === "policy-statement") return { kind: "policy-statement", name: w[1] };
  if (w.length === 2 && w[0] === "prefix-list") return { kind: "prefix-list", name: w[1] };
  if (w.length === 2 && w[0] === "community") return { kind: "community", name: w[1] };
  if (w.length === 1 && trail.length === 1 && trail[0] === "groups") return { kind: "group", name: w[0] };
  if (w.length === 1 && parent === "schedulers") return { kind: "scheduler", name: w[0] };
  if (w.length === 1 && parent === "scheduler-maps") return { kind: "scheduler-map", name: w[0] };
  if (w.length === 2 && parent === "classifiers") return { kind: "classifier", name: w[1] };
  if (w.length === 1 && trail.length === 1 && trail[0] === "routing-instances") return { kind: "routing-instance", name: w[0] };
  return null;
}

function walkNodes(nodes, trail, visit) {
  for (const node of nodes) {
    if (node.inactive) continue; // a deactivated statement defines and references nothing
    visit(node, trail);
    if (node.children) walkNodes(node.children, [...trail, node.words.join(" ")], visit);
  }
}

/**
 * extractConstructs(body) -> { ok, definitions, references }
 *
 * Each entry is `{ kind, name }` with the name canonicalized. `ok:false` means
 * the body did not parse and neither list may be trusted.
 */
export function extractConstructs(body) {
  const { nodes, ok } = parseConfig(body);
  if (!ok) return { ok: false, definitions: [], references: [] };

  const definitions = [];
  const defNodes = new Set();
  walkNodes(nodes, [], (node, trail) => {
    const d = definitionOf(node, trail);
    if (d) {
      definitions.push({ kind: d.kind, name: canonicalName(d.name) });
      defNodes.add(node);
    }
  });

  const references = [];
  const seen = new Set();
  walkNodes(nodes, [], (node, trail) => {
    if (node.children !== null) return; // references are always leaf statements
    if (defNodes.has(node)) return;
    const w = node.words;
    const parent = trail[trail.length - 1] || "";
    for (const rule of REFERENCE_RULES) {
      if (rule.parent && parent !== rule.parent) continue;
      const at = indexOfSeq(w, rule.keyword);
      if (at === -1) continue;
      if (rule.atStart && at !== 0) continue;
      for (const raw of w.slice(at + rule.keyword.length)) {
        if (BRACKETS.has(raw) || MODIFIERS.has(raw)) continue;
        const name = canonicalName(raw);
        const key = `${rule.kind}\u0000${name}`;
        if (seen.has(key)) continue;
        seen.add(key);
        references.push({ kind: rule.kind, name });
      }
      break; // one keyword classifies a statement; later rules must not re-read it
    }
  });

  return { ok: true, definitions, references };
}
