/**
 * dependency-resolve.mjs — deterministic, fail-closed resolution of a direct
 * `Pair with:` dependency for one target device.
 *
 * `variant-resolve.mjs` answers "which member of this variant group does this
 * device get?". This answers the other half: "the consumer names ONE snip as a
 * same-device prerequisite — can that prerequisite actually be supplied here?"
 * Both use one applicability model, so validation, completeness analysis and
 * composition cannot drift apart.
 *
 * The candidate set is the named target plus its path twin — the same relative
 * path under the other OS directory — because that is the library's own notion
 * of a second representation of one snip. Nothing else is considered: an
 * unrelated snip is never substituted just because a body happens to match.
 *
 * Statuses, one per case:
 *   unresolved-path  the named path is not a snip in this library
 *   ok               exactly one distinct applicable body; `viaEquivalent` is
 *                    set when the selected representation is not the one named
 *   ambiguous        two distinct applicable bodies — never silently picked
 *   unavailable      nothing applicable. `alternative` records whether a twin
 *                    exists whose body DIFFERS, which is the case that must not
 *                    be substituted: emitting it would emit different config
 *
 * A whole snip is the unit here, so equivalence is whole-body equivalence. Two
 * snips that agree on one object but emit different additional objects are NOT
 * equivalent, because including either emits everything it carries.
 */
import { bodyIdentity } from "./variant-resolve.mjs";
import { createHash } from "node:crypto";
import { sourceTree, occurrenceMap, bindLine } from "./generate-bindings.mjs";
import { extractConstructOccurrences } from "./config-references.mjs";
import { canonicalize, parseConfig } from "./config-objects.mjs";

export function createOccurrenceResolver({ sourceText, device, os, snips, exclusions }) {
  const digest = value => createHash("sha256").update(value).digest("hex");
  const sourceSha256 = digest(sourceText);
  const tree = sourceTree(sourceText, { device, exclusions });
  const exclusionsSha256 = digest(JSON.stringify(exclusions ?? null));
  const constructs = extractConstructOccurrences(sourceText);
  const catalog = new Map(snips.map(snip => [snip.rel, structuredClone(snip)]));
  const measured = new Map();
  const instances = new Map();
  const subtreeIds = node => [node.id, ...(node.children ?? []).flatMap(subtreeIds)];
  const definitions = constructs.definitions.map(definition => ({ ...definition, sourceIds: subtreeIds(tree.index[definition.nodeId]) }));
  const measure = rel => {
    if (measured.has(rel)) return measured.get(rel);
    const snip = catalog.get(rel);
    if (!snip || !(snip.seenOn?.[os] ?? []).includes(device)) return [];
    const matches = occurrenceMap(snip.body, tree);
    const bodySha256 = digest(snip.body);
    const records = matches.instances.map(match => {
      const binding = Object.fromEntries(matches.variables.map((variable, index) => [variable, match.binding[index]]));
      const rendered = snip.body.replace(/\$\{([A-Z][A-Z0-9_]*)\}|\$([A-Z][A-Z0-9_]*)/g, (_, braced, bare) => binding[braced ?? bare]);
      const id = digest(JSON.stringify([device, sourceSha256, exclusionsSha256, rel, bodySha256, match.sourceIds, binding]));
      const references = constructs.references.filter(reference => match.sourceIds.includes(reference.nodeId));
      const requiredContextSourceIds = [...new Set(references.filter(reference => reference.kind === 'tunnel-pic').flatMap(reference => {
        const parent = tree.index[tree.index[reference.nodeId].parent];
        return (parent?.children ?? []).filter(node => !node.inactive && node.words.join(' ') === 'anchor-point').flatMap(subtreeIds);
      }))].sort((left, right) => left - right);
      const record = { id, rel, device, os, sourceSha256, bodySha256, sourceIds: match.sourceIds, binding, equivalentBindings: match.equivalentBindings, rendered: canonicalize(parseConfig(rendered).nodes), references, requiredContextSourceIds };
      instances.set(id, record);
      return record;
    });
    measured.set(rel, records);
    return records;
  };
  const occurrences = rel => structuredClone(measure(rel));
  const resolve = ({ consumerId, sourceSha256: expectedHash, nodeId, wordIndex, candidates, scope = "whole", preferObject = false }) => {
    if (expectedHash !== sourceSha256) return { status: "stale-source" };
    if (!["whole", "object"].includes(scope)) return { status: "invalid-scope" };
    const consumer = instances.get(consumerId);
    if (!consumer) return { status: "unknown-occurrence" };
    const reference = consumer.references.find(row => row.nodeId === nodeId && row.wordIndex === wordIndex);
    if (!reference) return { status: "unknown-reference" };
    if (!Array.isArray(candidates) || !candidates.length) return { status: "unavailable" };
    const unknown = candidates.filter(rel => !catalog.has(rel));
    if (unknown.length) return { status: "unresolved-path", members: [...new Set(unknown)].sort() };
    const targets = definitions.filter(row => row.kind === reference.kind && row.name === reference.name);
    if (!targets.length) return { status: "missing-source-definition", reference: structuredClone(reference) };
    if (targets.length !== 1) return { status: "ambiguous-source-definition", reference: structuredClone(reference) };
    const target = targets[0];
    if (target.sourceIds.some(id => tree.excludedIds.has(id))) return { status: "excluded-source-defect", reference: structuredClone(reference) };
    if (reference.kind === 'ps-device-capacity') {
      const capacity = tree.index[target.nodeId].words[1];
      if (!/^\d+$/.test(capacity ?? '') || !Number.isSafeInteger(Number(capacity)) || Number(capacity) <= reference.minimumExclusive) {
        return { status: 'insufficient-ps-capacity', reference: structuredClone(reference), capacity };
      }
    }
    if (['prefix-list', 'community', 'policer'].includes(reference.kind) && target.sourceIds.every(id => consumer.sourceIds.includes(id))) {
      return { status: 'ok', internal: true, selected: structuredClone(consumer), reference: structuredClone(reference), targetSourceIds: [...target.sourceIds], equivalents: [] };
    }
    const allowed = new Set(target.sourceIds);
    let parent = tree.index[target.nodeId].parent;
    while (parent !== null) {
      allowed.add(parent);
      parent = tree.index[parent].parent;
    }
    let providers = [...new Set(candidates)].flatMap(measure).filter(provider => target.sourceIds.every(id => provider.sourceIds.includes(id)) && (scope !== "object" || provider.sourceIds.every(id => allowed.has(id))));
    if (preferObject) {
      const focused = providers.filter(provider => provider.sourceIds.every(id => allowed.has(id)));
      if (focused.length) providers = focused;
    }
    if (!providers.length) return { status: "unavailable", reference: structuredClone(reference) };
    const groups = new Map();
    for (const provider of providers) {
      const identity = JSON.stringify([provider.sourceIds, provider.rendered]);
      if (!groups.has(identity)) groups.set(identity, []);
      groups.get(identity).push(provider);
    }
    if (groups.size !== 1) return { status: "ambiguous", members: providers.map(row => row.id).sort(), reference: structuredClone(reference) };
    const equivalents = [...groups.values()][0].sort((left, right) => left.rel.localeCompare(right.rel));
    const selected = equivalents.find(row => row.rel.startsWith(`${os}/`)) ?? equivalents[0];
    return { status: "ok", selected: structuredClone(selected), equivalents: equivalents.filter(row => row.id !== selected.id).map(row => row.id), reference: structuredClone(reference), targetSourceIds: [...target.sourceIds] };
  };
  const resolveRelated = ({ consumerId, sourceSha256: expectedHash, kind, candidates }) => {
    if (expectedHash !== sourceSha256) return { status: 'stale-source' };
    if (!['interface-parent', 'lag-member', 'policy-community', 'irb-service'].includes(kind)) return { status: 'invalid-relation' };
    const consumer = instances.get(consumerId);
    if (!consumer) return { status: 'unknown-occurrence' };
    if (!Array.isArray(candidates) || !candidates.length || candidates.some(rel => !catalog.has(rel))) return { status: 'unresolved-path' };
    const interfaces = tree.nodes.filter(node => !node.inactive && node.words.join(' ') === 'interfaces').flatMap(node => node.children ?? []);
    const parents = interfaces.filter(node => !node.inactive && consumer.sourceIds.includes(node.id));
    if (['interface-parent', 'lag-member'].includes(kind) && !parents.length) return { status: 'no-interface-context' };
    const targets = [];
    const witnesses = new Set();
    if (kind === 'irb-service') {
      const references = consumer.references.filter(row => row.kind === 'logical-interface' && /^irb\.\d+$/.test(row.name));
      if (!references.length) return { status: 'missing-irb-reference' };
      const services = tree.nodes.filter(node => !node.inactive && node.words[0] === 'routing-instances').flatMap(node => node.children ?? []).filter(node => !node.inactive);
      const gatewayNames = service => {
        const direct = (service.children ?? []).filter(node => !node.inactive && node.words[0] === 'routing-interface').map(node => node.words[1]);
        const nested = (service.children ?? []).filter(node => !node.inactive && ['bridge-domains', 'vlans'].includes(node.words[0])).flatMap(node => node.children ?? []).filter(node => !node.inactive)
          .flatMap(node => node.children ?? []).filter(node => !node.inactive && ['routing-interface', 'l3-interface'].includes(node.words[0])).map(node => node.words[1]);
        return [...direct, ...nested];
      };
      for (const reference of references) {
        const interfaces = definitions.filter(row => row.kind === 'logical-interface' && row.name === reference.name);
        if (interfaces.length !== 1) return { status: interfaces.length ? 'ambiguous-source-definition' : 'missing-source-definition', reference };
        for (const id of [reference.nodeId, ...interfaces[0].sourceIds]) witnesses.add(id);
        const matching = services.filter(service => !consumer.sourceIds.includes(service.id) && gatewayNames(service).includes(reference.name));
        if (matching.length !== 1) return { status: matching.length ? 'ambiguous-irb-service' : 'missing-irb-service', reference };
        if (!targets.some(target => target.node.id === matching[0].id)) targets.push({ node: matching[0], sourceIds: subtreeIds(matching[0]) });
      }
      if ([...witnesses].some(id => tree.excludedIds.has(id))) return { status: 'excluded-source-defect' };
    }
    if (kind === 'policy-community') {
      const patterns = candidates.flatMap(rel => extractConstructOccurrences(catalog.get(rel).body).definitions.filter(row => row.kind === 'community').map(row => row.name));
      const policyReferences = consumer.references.filter(row => row.kind === 'policy-statement' && row.trail.length === 2 && row.trail[0] === 'routing-instances' && ['vrf-import', 'vrf-export'].includes(tree.index[row.nodeId].words[0]));
      if (!policyReferences.length || !patterns.length) return { status: 'missing-policy-reference' };
      for (const reference of policyReferences) {
        const policies = definitions.filter(row => row.kind === 'policy-statement' && row.name === reference.name);
        if (policies.length !== 1) return { status: policies.length ? 'ambiguous-source-definition' : 'missing-source-definition', reference };
        const policy = policies[0];
        for (const id of [reference.nodeId, ...policy.sourceIds]) witnesses.add(id);
        const communities = constructs.references.filter(row => row.kind === 'community' && policy.sourceIds.includes(row.nodeId) && patterns.some(pattern => bindLine(pattern, row.name, {}) !== null));
        for (const community of communities) {
          const found = definitions.filter(row => row.kind === 'community' && row.name === community.name);
          if (found.length !== 1) return { status: found.length ? 'ambiguous-source-definition' : 'missing-source-definition', reference: community };
          if (!targets.some(target => target.node.id === found[0].nodeId)) targets.push({ node: tree.index[found[0].nodeId], sourceIds: found[0].sourceIds });
        }
      }
      if (!targets.length) return { status: 'missing-community-reference' };
      if ([...witnesses].some(id => tree.excludedIds.has(id))) return { status: 'excluded-source-defect' };
    }
    for (const parent of parents) {
      if (kind === 'interface-parent') {
        const children = (parent.children ?? []).filter(node => node.words[0] !== 'unit');
        if (children.length) targets.push({ node: parent, sourceIds: [parent.id, ...children.flatMap(subtreeIds)] });
      } else if (parent.children?.some(node => !node.inactive && node.words[0] === 'aggregated-ether-options')) {
        const members = interfaces.filter(node => !node.inactive && node.children?.some(options => !options.inactive && ['ether-options', 'gigether-options'].includes(options.words[0]) && options.children?.some(leaf => !leaf.inactive && leaf.words.join(' ') === `802.3ad ${parent.words[0]}`)));
        if (!members.length) return { status: 'missing-source-members', interface: parent.words[0] };
        for (const member of members) targets.push({ node: member, sourceIds: subtreeIds(member) });
      }
    }
    const selected = new Map();
    const requiredSourceIds = new Set(witnesses);
    for (const target of targets) {
      for (const id of target.sourceIds) requiredSourceIds.add(id);
      if (target.sourceIds.some(id => tree.excludedIds.has(id))) return { status: 'excluded-source-defect', interface: target.node.words[0] };
      if (target.sourceIds.every(id => consumer.sourceIds.includes(id))) continue;
      const allowed = new Set(target.sourceIds);
      let ancestor = target.node.parent;
      while (ancestor !== null) { allowed.add(ancestor); ancestor = tree.index[ancestor].parent; }
      const providers = [...new Set(candidates)].flatMap(measure).filter(provider => target.sourceIds.every(id => provider.sourceIds.includes(id)) && provider.sourceIds.every(id => allowed.has(id)));
      if (!providers.length) return { status: 'unavailable', interface: target.node.words[0], targetSourceIds: target.sourceIds };
      const groups = new Map();
      for (const provider of providers) {
        const identity = JSON.stringify([provider.sourceIds, provider.rendered]);
        groups.set(identity, [...(groups.get(identity) ?? []), provider]);
      }
      if (groups.size !== 1) return { status: 'ambiguous', interface: target.node.words[0], members: providers.map(row => row.id) };
      const equivalent = [...groups.values()][0].sort((left, right) => Number(!left.rel.startsWith(`${os}/`)) - Number(!right.rel.startsWith(`${os}/`)) || left.rel.localeCompare(right.rel));
      selected.set(equivalent[0].id, equivalent[0]);
    }
    return { status: 'ok', selected: structuredClone([...selected.values()]), requiredSourceIds: [...requiredSourceIds].sort((left, right) => left - right) };
  };
  const render = ({ ids, sourceSha256: expectedHash }) => {
    if (expectedHash !== sourceSha256) return { status: "stale-source" };
    if (!Array.isArray(ids) || ids.some(id => !instances.has(id))) return { status: "unknown-occurrence" };
    const selected = [...new Set(ids)].map(id => instances.get(id));
    const groups = new Map();
    for (const occurrence of selected) {
      const key = JSON.stringify([occurrence.sourceIds, occurrence.rendered]);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(occurrence);
    }
    const aliases = {};
    const representatives = [];
    for (const equivalents of groups.values()) {
      equivalents.sort((left, right) => Number(!left.rel.startsWith(`${os}/`)) - Number(!right.rel.startsWith(`${os}/`)) || left.rel.localeCompare(right.rel) || left.id.localeCompare(right.id));
      const representative = equivalents[0];
      for (const occurrence of equivalents) aliases[occurrence.id] = representative.id;
      representatives.push(representative);
    }
    representatives.sort((left, right) => left.id.localeCompare(right.id));
    const sourceIds = new Set();
    const emitted = representatives.map(occurrence => {
      const contributedSourceIds = occurrence.sourceIds.filter(id => !sourceIds.has(id));
      for (const id of contributedSourceIds) sourceIds.add(id);
      return { ...occurrence, contributedSourceIds };
    });
    const project = nodes => nodes.filter(node => sourceIds.has(node.id)).map(node => ({ ...node, children: node.children === null ? null : project(node.children) }));
    return { status: "ok", sourceSha256, body: canonicalize(project(tree.nodes)), occurrences: structuredClone(emitted), aliases, emittedSourceIds: [...sourceIds].sort((left, right) => left - right) };
  };
  return { sourceSha256, occurrences, resolve, resolveRelated, render };
}

/** The same relative path under the other OS directory, or null. */
export function twinRel(rel) {
  const slash = rel.indexOf("/");
  if (slash === -1) return null;
  const dir = rel.slice(0, slash);
  if (dir !== "junos" && dir !== "evo") return null;
  return `${dir === "junos" ? "evo" : "junos"}/${rel.slice(slash + 1)}`;
}

/**
 * resolveDependency({ targetRel, targetDevice, targetOS, index })
 *
 * `index` is a Map of rel -> { rel, dir, seenOn, body }. Returns a result whose
 * `status` is one of the four above. Selection is deterministic: among equally
 * applicable equivalent representations the one stored under the target OS wins,
 * and otherwise candidates are ordered by path.
 */
export function resolveDependency({ targetRel, targetDevice, targetOS, index }) {
  const named = index.get(targetRel);
  if (!named) return { status: "unresolved-path", targetRel };

  const twin = index.get(twinRel(targetRel) ?? "\u0000");
  const candidates = twin ? [named, twin] : [named];
  const applies = (s) => (s.seenOn?.[targetOS] || []).includes(targetDevice);
  const applicable = candidates.filter(applies).sort((a, b) => a.rel.localeCompare(b.rel));

  if (applicable.length === 0) {
    const differing = twin && bodyIdentity(twin.body) !== bodyIdentity(named.body);
    return {
      status: "unavailable",
      targetRel,
      alternative: twin ? (differing ? "twin-differs" : "twin-equivalent-but-inapplicable") : "no-twin",
    };
  }

  const bodies = new Map();
  for (const c of applicable) {
    const id = bodyIdentity(c.body);
    if (!bodies.has(id)) bodies.set(id, []);
    bodies.get(id).push(c);
  }
  if (bodies.size > 1) {
    return { status: "ambiguous", targetRel, members: applicable.map((c) => c.rel) };
  }

  // The dependency means "emit what the named snip emits", so only a
  // representation with that exact body can stand in for it.
  const namedId = bodyIdentity(named.body);
  const [onlyId, reps] = [...bodies.entries()][0];
  if (onlyId !== namedId) {
    return { status: "unavailable", targetRel, alternative: "twin-differs" };
  }

  const selected = reps.find((c) => c.dir === targetOS) ?? reps[0];
  return {
    status: "ok",
    targetRel,
    selected: selected.rel,
    viaEquivalent: selected.rel !== targetRel,
    crossDirectory: selected.dir !== targetOS,
    equivalents: reps.filter((c) => c.rel !== selected.rel).map((c) => c.rel),
  };
}

/** The `Pair with:` bullet's path, stripped of trailing prose. Empty for `none`. */
export function dependencyPath(bullet) {
  const p = String(bullet).replace(/^-\s*/, "").split(/\s+/)[0].replace(/[(),;]+$/, "");
  if (!p || p.toLowerCase() === "none") return null;
  return p;
}
