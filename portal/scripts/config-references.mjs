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

function referencesOf(node, trail) {
  if (node.children !== null || isCommunityDefinitionLeaf(node.words)) return [];
  if (trail.length === 3 && trail[0] === 'class-of-service' && trail[1] === 'classifiers' && trail[2].startsWith('exp ') && node.words.join(' ') === 'import default') return [];
  const parent = trail.at(-1) || "";
  for (const rule of REFERENCE_RULES) {
    if (rule.parent && parent !== rule.parent) continue;
    const at = indexOfSeq(node.words, rule.keyword);
    if (at === -1 || rule.atStart && at !== 0) continue;
    return node.words.flatMap((raw, wordIndex) => wordIndex < at + rule.keyword.length || BRACKETS.has(raw) || MODIFIERS.has(raw)
      ? [] : [{ kind: rule.kind, name: canonicalName(raw), wordIndex }]);
  }
  return [];
}

export function extractConstructOccurrences(body) {
  const parsed = parseConfig(body);
  if (!parsed.ok) return { ok: false, definitions: [], references: [] };
  const definitions = [];
  const references = [];
  const subscriberDevices = parsed.nodes.filter(node => !node.inactive && node.words.join(' ') === 'interfaces')
    .flatMap(node => node.children ?? []).filter(node => !node.inactive && /^ps\d+$/.test(node.words.join(' ')));
  const minimumPsCapacity = Math.max(subscriberDevices.length, ...subscriberDevices.map(node => Number(node.words[0].slice(2))));
  let nextId = 0;
  const walk = (nodes, trail, inactive = false, parentNode = null) => {
    for (const node of nodes) {
      const nodeId = nextId++;
      const disabled = inactive || node.inactive;
      if (!disabled) {
        const definition = definitionOf(node, trail);
        if (definition) definitions.push({ ...definition, name: canonicalName(definition.name), nodeId, trail });
        if (trail.length === 1 && trail[0] === "policy-options" && node.words[0] === "condition" && node.children !== null) {
          definitions.push({ kind: "condition", name: canonicalName(node.words[1]), nodeId, trail });
        }
        if (trail.join('/') === 'routing-options/rib-groups' && node.words.length === 1 && node.children !== null) {
          definitions.push({ kind: 'rib-group', name: canonicalName(node.words[0]), nodeId, trail });
        }
        if (trail.join('/') === 'routing-options/transport-class' && node.words[0] === 'name' && node.children !== null) {
          const color = node.children.find(child => !child.inactive && child.words[0] === 'color');
          if (color) definitions.push({ kind: 'transport-class', name: canonicalName(color.words[1]), nodeId, trail });
        }
        if (trail.length === 2 && trail[0] === 'routing-options' && trail[1].startsWith('flex-algorithm ') && node.words[0] === 'color' && parentNode?.children?.some(child => !child.inactive && child.words[0] === 'use-transport-class')) {
          references.push({ kind: 'transport-class', name: canonicalName(node.words[1]), nodeId, wordIndex: 1, trail });
        }
        if (node.children === null && node.words[0] === 'rib-group' && node.words.length >= 2 && ['routing-options', 'protocols'].includes(trail[0])) {
          references.push({ kind: 'rib-group', name: canonicalName(node.words.at(-1)), nodeId, wordIndex: node.words.length - 1, trail });
        }
        if (trail.length === 2 && trail[0] === "interfaces" && node.words[0] === "unit" && node.children !== null) {
          definitions.push({ kind: "logical-interface", name: canonicalName(`${trail[1]}.${node.words[1]}`), nodeId, trail });
          if (/^ps\d+$/.test(trail[1])) {
            const anchors = parentNode.children.filter(child => !child.inactive && child.words.join(' ') === 'anchor-point')
              .flatMap(child => child.children ?? []).filter(child => !child.inactive);
            const anchor = anchors.length === 1 && anchors[0].children === null && anchors[0].words.join(' ').match(/^lt-(\d+)\/(\d+)\/\d+$/);
            if (node.words[1] !== '0') references.push({ kind: 'logical-interface', name: `${trail[1]}.0`, nodeId, wordIndex: -1, trail, basis: 'functional-necessity' });
            references.push({ kind: 'ps-device-capacity', name: 'global', nodeId, wordIndex: -2, trail, minimumExclusive: minimumPsCapacity, basis: 'functional-necessity' });
            references.push({ kind: 'tunnel-pic', name: anchor ? `${anchor[1]}/${anchor[2]}` : `invalid-anchor:${trail[1]}`, nodeId, wordIndex: -3, trail, basis: 'functional-necessity' });
          }
        }
        if (trail.join('/') === 'chassis/pseudowire-service' && node.words[0] === 'device-count' && node.children === null) {
          definitions.push({ kind: 'ps-device-capacity', name: 'global', nodeId, trail });
        }
        if (trail.length === 3 && trail[0] === 'chassis' && trail[1].startsWith('fpc ') && trail[2].startsWith('pic ') && node.words[0] === 'tunnel-services') {
          definitions.push({ kind: 'tunnel-pic', name: canonicalName(`${trail[1].slice(4)}/${trail[2].slice(4)}`), nodeId, trail });
        }
        const protocolInterface = trail.length === 2 && trail[0] === "protocols" && /^(isis|isis-instance|ldp)(?: |$)/.test(trail[1]);
        const circuitInterface = trail.length === 3 && trail[0] === "protocols" && trail[1] === "l2circuit" && trail[2].startsWith("neighbor ");
        const localCircuitInterface = trail[0] === 'protocols' && trail[1] === 'l2circuit' && trail[2] === 'local-switching'
          && (trail.length === 3 || trail.length === 5 && trail[3].startsWith('interface ') && trail[4] === 'end-interface');
        const bridgeInterface = trail.length === 2 && trail[0] === 'bridge-domains';
        const serviceInterface = trail[0] === "routing-instances" && (trail.length === 2 || trail.length === 4 && ['bridge-domains', 'vlans'].includes(trail[2]));
        if (node.words.length === 2 && (node.words[0] === 'interface' && (protocolInterface || serviceInterface || circuitInterface || localCircuitInterface || bridgeInterface)
          || ['routing-interface', 'l3-interface'].includes(node.words[0]) && (serviceInterface || bridgeInterface))) {
          references.push({ kind: "logical-interface", name: canonicalName(node.words[1]), nodeId, wordIndex: 1, trail });
          if (circuitInterface && node.children !== null) definitions.push({ kind: "l2circuit-interface", name: canonicalName(node.words[1]), nodeId, trail });
        }
        if (node.children === null && trail[0] === "policy-options") {
          if (node.words[0] === "condition" && trail[1]?.startsWith("policy-statement ")) references.push({ kind: "condition", name: canonicalName(node.words[1]), nodeId, wordIndex: 1, trail });
          if (trail[1]?.startsWith("condition ") && trail.at(-1) === "ccc" && node.words.length === 1 && node.words[0] !== "table") {
            references.push({ kind: "l2circuit-interface", name: canonicalName(node.words[0]), nodeId, wordIndex: 0, trail });
          }
        }
        for (const reference of referencesOf(node, trail)) references.push({ ...reference, nodeId, trail });
      }
      if (node.children) walk(node.children, [...trail, node.words.join(" ")], disabled, node);
    }
  };
  walk(parsed.nodes, []);
  return { ok: true, definitions, references };
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
    for (const { kind, name } of referencesOf(node, trail)) {
      const key = `${kind}\u0000${name}`;
      if (seen.has(key)) continue;
      seen.add(key);
      references.push({ kind, name });
    }
  });

  return { ok: true, definitions, references };
}
