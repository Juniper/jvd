#!/usr/bin/env node
/**
 * composition-validate.mjs — check the canonical composition matrix, then audit
 * every supported tuple it declares.
 *
 * The matrix (`configuration/snips/_composition.json`) is the denominator for
 * completeness. It does NOT restate device applicability: supported devices are
 * resolved from each entry snippet's Seen-on rows, so Seen-on stays the single
 * source of truth and the two cannot disagree.
 *
 * A tuple is (form, os, device, tier). Its closure is the union of the entry
 * snippets, their recursive direct `Pair with` dependencies, their recursive
 * variant dependencies, and the recursive definers of every typed named
 * reference in everything included. Selection uses the shared resolvers, so a
 * tuple fails closed on ambiguity or unavailability rather than guessing.
 *
 * Usage:
 *   node scripts/composition-validate.mjs [--jvd <root>] [--audit] [--json]
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseSnip } from "./snip-parse.mjs";
import { resolveVariant, bodyIdentity } from "./variant-resolve.mjs";
import { resolveDependency, dependencyPath } from "./dependency-resolve.mjs";
import { extractConstructs, extractConstructOccurrences } from "./config-references.mjs";
import { loadJvd } from "./object-ownership.mjs";
import { parseConfig, canonicalize } from "./config-objects.mjs";
import { bindLine, sourceTree } from "./generate-bindings.mjs";
import { capabilityRequirementProblems, configuredCapabilityProblems } from "./transport-capabilities.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const STATUSES = new Set(["supported", "incomplete", "intentionally-unsupported", "deprecated"]);
const OS_MODES = new Set(["Junos", "EVO", "MIXED"]);
const INTERFACE_RELATIONS = new Set(['interface-parent', 'lag-member', 'policy-community', 'irb-service']);

function supportsInterfaceRelation(body, kind, provider = false) {
  const parsed = parseConfig(body);
  if (!parsed.ok) return false;
  if (kind === 'irb-service') return provider
    ? extractConstructOccurrences(body).definitions.some(row => row.kind === 'routing-instance')
    : extractConstructOccurrences(body).references.some(row => row.kind === 'logical-interface' && row.name.startsWith('irb.'));
  if (kind === 'policy-community') return provider
    ? extractConstructOccurrences(body).definitions.some(row => row.kind === 'community')
    : parsed.nodes.some(node => !node.inactive && node.words[0] === 'routing-instances' && node.children?.some(instance => !instance.inactive && instance.children?.some(leaf => !leaf.inactive && ['vrf-import', 'vrf-export'].includes(leaf.words[0]))));
  const interfaces = parsed.nodes.filter(node => !node.inactive && node.words.join(' ') === 'interfaces').flatMap(node => node.children ?? []).filter(node => !node.inactive && node.children !== null);
  if (!provider) return interfaces.length > 0;
  return interfaces.some(node => kind === 'interface-parent'
    ? node.children.some(child => child.words[0] !== 'unit')
    : node.children.some(child => !child.inactive && ['ether-options', 'gigether-options'].includes(child.words[0]) && child.children?.some(leaf => !leaf.inactive && leaf.words[0] === '802.3ad')));
}

export function flexAlgorithms(body) {
  const parsed = parseConfig(body);
  const definitions = new Set();
  const participation = new Set();
  const walk = (nodes, trail) => {
    for (const node of nodes) {
      if (node.inactive) continue;
      if (trail.length === 1 && trail[0] === "routing-options" && node.words[0] === "flex-algorithm") definitions.add(node.words[1]);
      if (trail.length === 3 && trail[0] === "protocols" && /^(isis|isis-instance)(?: |$)/.test(trail[1]) && trail[2] === "source-packet-routing" && node.words[0] === "flex-algorithm") {
        for (const word of node.words.slice(1)) if (/^\d+$/.test(word)) participation.add(word);
      }
      if (node.children) walk(node.children, [...trail, node.words.join(" ")]);
    }
  };
  if (parsed.ok) walk(parsed.nodes, []);
  return { definitions: [...definitions], participation: [...participation] };
}

export function resolutionTransportColors(body) {
  const parsed = parseConfig(body);
  const colors = new Set();
  const visit = (nodes, trail) => {
    for (const node of nodes) {
      if (node.inactive) continue;
      if (trail[0] === 'routing-options' && trail[1] === 'resolution' && node.words[0] === 'resolution-ribs') {
        for (const word of node.words.slice(1)) {
          const match = word.match(/^junos-rti-tc-(\d+)\.inet6?\.3$/);
          if (match) colors.add(match[1]);
        }
      }
      if (node.children) visit(node.children, [...trail, node.words.join(' ')]);
    }
  };
  if (parsed.ok) visit(parsed.nodes, []);
  return [...colors].sort();
}

function sourceWitnesses({ consumer, requirement, resolver, entrySets }) {
  const candidates = (entrySets[requirement.entrySet] ?? []).flatMap(rel => resolver.occurrences(rel));
  if (requirement.kind === 'resolution-transport-class') {
    return resolutionTransportColors(consumer.rendered).map(color => {
      const matching = candidates.filter(row => extractConstructOccurrences(row.rendered).definitions.some(definition => definition.kind === 'transport-class' && definition.name === color));
      const groups = new Map();
      for (const row of matching) groups.set(JSON.stringify([row.sourceIds, row.rendered]), [...(groups.get(JSON.stringify([row.sourceIds, row.rendered])) ?? []), row]);
      return { key: `resolution-transport-class:${color}`, witnesses: groups.size === 1 ? [...groups.values()][0].sort((left, right) => Number(!left.rel.startsWith(`${consumer.os}/`)) - Number(!right.rel.startsWith(`${consumer.os}/`)) || left.rel.localeCompare(right.rel)).slice(0, 1) : [], ambiguous: groups.size > 1 };
    });
  }
  return flexAlgorithms(consumer.rendered).definitions.map(algorithm => ({ key: `isis-flex-algorithm:${algorithm}`, witnesses: candidates.filter(row => flexAlgorithms(row.rendered).participation.includes(algorithm)) }));
}

/** Structural checks on the matrix itself. Returns a list of problem strings. */
export function validateMatrix(matrix, snipIndex) {
  const problems = capabilityRequirementProblems(matrix.capabilityRequirements);
  const ids = new Set();
  const aliases = new Map();

  for (const f of matrix.forms) {
    if (ids.has(f.id)) problems.push(`duplicate form id: ${f.id}`);
    ids.add(f.id);
    if (!STATUSES.has(f.status)) problems.push(`${f.id}: unknown status ${f.status}`);
    if (f.status !== "supported" && !f.reason) problems.push(`${f.id}: status ${f.status} requires a reason`);
    if (!OS_MODES.has(f.osMode)) problems.push(`${f.id}: unknown osMode ${f.osMode}`);
    for (const a of f.aliases || []) {
      const lower = a.toLowerCase();
      if (aliases.has(lower)) problems.push(`alias "${a}" claimed by ${aliases.get(lower)} and ${f.id}`);
      aliases.set(lower, f.id);
    }
    for (const r of f.roles || []) {
      if (!matrix.roles[r]) problems.push(`${f.id}: role ${r} is not in the role vocabulary`);
    }

    const entries = [...(f.entry?.junos || []), ...(f.entry?.evo || [])];
    for (const rel of entries) {
      if (rel.includes("*")) problems.push(`${f.id}: pattern entry "${rel}" may not be declared`);
      else if (!snipIndex.has(rel)) problems.push(`${f.id}: entry snippet does not resolve: ${rel}`);
    }
    if (f.status === "supported" && entries.length === 0) {
      problems.push(`${f.id}: status supported but no entry snippet`);
    }
    // A declared OS mode must not claim a side it has no entry for.
    if (f.status === "supported") {
      if (f.osMode === "Junos" && (f.entry.evo || []).length) problems.push(`${f.id}: osMode Junos but has an EVO entry`);
      if (f.osMode === "EVO" && (f.entry.junos || []).length) problems.push(`${f.id}: osMode EVO but has a Junos entry`);
    }
    for (const p of f.pairedConstructs || []) {
      if (p.startsWith("variant:")) continue;
      if (!ids.has(p) && !matrix.forms.some((x) => x.id === p)) problems.push(`${f.id}: paired construct ${p} is not a form id`);
    }
  }

  // Role bindings: every declared provider must exist, and a construct may not
  // be both bound and declared unbound for the same family.
  const bound = new Map();
  for (const b of matrix.roleBindings?.bindings || []) {
    if (!b.rationale) problems.push(`role binding ${b.construct}: rationale required`);
    if (b.selection === "required") {
      // An operator choice: no default, but every offered provider must resolve.
      if (b.provider) problems.push(`role binding ${b.construct}: a required choice may not declare a default provider`);
      let n = 0;
      for (const os of ["junos", "evo"]) {
        for (const rel of b.providers?.[os] || []) {
          n += 1;
          if (!snipIndex.has(rel)) problems.push(`role binding ${b.construct}: choice does not resolve: ${rel}`);
        }
      }
      if (n < 2) problems.push(`role binding ${b.construct}: a required choice needs at least two providers`);
    } else {
      for (const os of ["junos", "evo"]) {
        if (!b.provider?.[os]) continue; // a device-scoped binding may cover one OS only
        const all = [b.provider[os], ...(b.alternatives?.[os] || [])];
        for (const rel of all) {
          if (!snipIndex.has(rel)) problems.push(`role binding ${b.construct}: provider does not resolve: ${rel}`);
        }
      }
      if (!b.provider?.junos && !b.provider?.evo) problems.push(`role binding ${b.construct}: no provider`);
    }
    for (const fam of b.families) bound.set(`${b.construct}\u0000${fam}`, b);
  }
  for (const u of matrix.unboundRoleParameters || []) {
    if (!u.reason) problems.push(`unbound role parameter ${u.construct}: reason required`);
    for (const fam of u.families) {
      const conflict = bound.get(`${u.construct}\u0000${fam}`);
      // A device-scoped binding legitimately carves an exception out of an
      // otherwise unbound family; a family-wide one contradicts it.
      if (conflict && !conflict.devices) {
        problems.push(`${u.construct} is both bound and declared unbound for family ${fam}`);
      }
    }
  }
  // An identity variable may never also be a role parameter.
  for (const c of matrix.identityVariables?.constructs || []) {
    if ((matrix.roleBindings?.bindings || []).some((b) => b.construct === c)) {
      problems.push(`${c} is declared both a correlated identity and a role parameter`);
    }
  }
  const occurrenceKeys = new Set();
  for (const binding of matrix.occurrenceBindings || []) {
    const key = `${binding.consumer}:${binding.kind}`;
    if (occurrenceKeys.has(key)) problems.push(`duplicate occurrence binding: ${key}`);
    occurrenceKeys.add(key);
    const consumer = snipIndex.get(binding.consumer);
    const relation = INTERFACE_RELATIONS.has(binding.kind);
    if (!consumer) problems.push(`occurrence consumer does not resolve: ${binding.consumer}`);
    else if (relation ? !supportsInterfaceRelation(consumer.body, binding.kind) : !extractConstructOccurrences(consumer.body).references.some(row => row.kind === binding.kind)) problems.push(`occurrence binding has no reference: ${key}`);
    if (relation && (binding.scope !== 'object' || binding.declaredDependency !== undefined && (binding.kind === 'interface-parent' || binding.unbound !== 'required'))) problems.push(`occurrence relation ${key}: invalid declared relation mapping`);
    if (!["object", "whole"].includes(binding.scope)) problems.push(`occurrence binding ${key}: invalid scope`);
    if (binding.unbound !== undefined && binding.unbound !== "required") problems.push(`occurrence binding ${key}: invalid unbound mode`);
    if (!Array.isArray(binding.providers) || !binding.providers.length) problems.push(`occurrence binding ${key}: no providers`);
    if (binding.preferObject !== undefined && (typeof binding.preferObject !== 'boolean' || binding.scope !== 'whole' || relation)) problems.push(`occurrence binding ${key}: invalid object preference`);
    if (binding.declaredDependency !== undefined && (typeof binding.declaredDependency !== 'string' || binding.scope !== (relation ? 'object' : 'whole') || !binding.providers?.includes(binding.declaredDependency))) {
      problems.push(`occurrence binding ${key}: invalid declared dependency mapping`);
    }
    for (const rel of binding.providers || []) {
      const provider = snipIndex.get(rel);
      if (!provider) problems.push(`occurrence provider does not resolve: ${rel}`);
      else if (relation ? !supportsInterfaceRelation(provider.body, binding.kind, true) : !extractConstructOccurrences(provider.body).definitions.some(row => row.kind === binding.kind)) problems.push(`occurrence provider does not define ${binding.kind}: ${rel}`);
    }
  }
  for (const requirement of matrix.sourceRequirements || []) {
    const consumer = snipIndex.get(requirement.consumer);
    const resolution = requirement.kind === 'resolution-transport-class';
    if (!consumer || !(resolution ? resolutionTransportColors(consumer.body).length : flexAlgorithms(consumer.body).definitions.length)) problems.push(`invalid source-requirement consumer: ${requirement.consumer}`);
    if (!['isis-flex-algorithm', 'resolution-transport-class'].includes(requirement.kind)) problems.push(`unknown source-requirement kind: ${requirement.kind}`);
    if (resolution && (requirement.basis !== 'functional-necessity' || !requirement.evidence?.device || !requirement.evidence?.date)) problems.push(`functional requirement needs evidence: ${requirement.consumer}`);
    const entries = matrix.occurrenceEntrySets?.[requirement.entrySet];
    if (!Array.isArray(entries) || !entries.length || entries.some(rel => !snipIndex.has(rel))) problems.push(`invalid source-requirement entry set: ${requirement.entrySet}`);
  }
  return problems;
}

/**
 * Role resolution for one construct on one device. Returns the provider snip,
 * or a reason the tuple must fail closed. A provider that does not apply to the
 * device is a failure, never a silent fallback.
 */
export function resolveRole({ construct, family, os, device, matrix, snipIndex }) {
  const candidates = (matrix.roleBindings?.bindings || []).filter((b) => b.construct === construct && b.families.includes(family));
  // A device-scoped binding is more specific than a family-wide one and wins.
  const binding = candidates.find((b) => (b.devices || []).includes(device)) ?? candidates.find((b) => !b.devices);
  if (binding) {
    if (binding.selection === "required") {
      // The operator supplies this the way they supply any other required
      // value; the library only has to offer at least one applicable choice.
      const applicable = (binding.providers?.[os] || []).filter((rel) => (snipIndex.get(rel)?.seenOn?.[os] || []).includes(device));
      if (applicable.length === 0) return { status: "no-applicable-choice", detail: binding.construct };
      return { status: "choice-required", choices: applicable.sort() };
    }
    const rel = binding.provider[os];
    const s = snipIndex.get(rel);
    if (!s) return { status: "unresolved", detail: rel };
    if (!(s.seenOn[os] || []).includes(device)) return { status: "inapplicable", detail: rel };
    return { status: "ok", selected: rel };
  }
  const unbound = (matrix.unboundRoleParameters || []).find((u) => u.construct === construct && u.families.includes(family));
  if (unbound) return { status: "unbound", detail: unbound.reason };
  return { status: "not-a-role" };
}

/** Devices a supported form reaches, resolved from its entry snippets' Seen-on. */
export function formDevices(form, snipIndex) {
  const out = [];
  for (const os of ["junos", "evo"]) {
    for (const rel of form.entry?.[os] || []) {
      const s = snipIndex.get(rel);
      if (!s) continue;
      for (const bucket of ["junos", "evo"]) {
        for (const dev of s.seenOn[bucket] || []) out.push({ os: bucket, device: dev, entry: rel });
      }
    }
  }
  // De-duplicate (os, device) while keeping every entry that reaches it.
  const seen = new Map();
  for (const t of out) {
    const k = `${t.os}\u0000${t.device}`;
    if (!seen.has(k)) seen.set(k, { os: t.os, device: t.device, entries: [] });
    seen.get(k).entries.push(t.entry);
  }
  return [...seen.values()].sort((a, b) => `${a.os}${a.device}`.localeCompare(`${b.os}${b.device}`));
}

/**
 * Reduce the entry snippets that reach a device to what should actually be
 * emitted. Several entries may name the same device across OS rows; equivalent
 * representations collapse to the same-directory one, and differing bodies are
 * ambiguous rather than emitted together.
 */
export function selectEntries(entries, os, snipIndex) {
  const bodies = new Map();
  for (const rel of entries) {
    const s = snipIndex.get(rel);
    if (!s) continue;
    const id = bodyIdentity(s.body);
    if (!bodies.has(id)) bodies.set(id, []);
    bodies.get(id).push(s);
  }
  if (bodies.size === 0) return { status: "unavailable", selected: [] };
  if (bodies.size > 1) return { status: "ambiguous", selected: [...entries].sort() };
  const reps = [...bodies.values()][0];
  const chosen = reps.find((s) => s.dir === os) ?? reps[0];
  return { status: "ok", selected: [chosen.rel], crossDirectory: chosen.dir !== os };
}

/**
 * Closure for one tuple. Returns `{ included, failures }` where each failure
 * names its kind so the ledger can group by root cause.
 */
function declaredDependencies({ header, device, os, snipIndex, variantMembers = [], consumer, bindings = [] }) {
  const dependencies = [];
  for (const requirement of header?.variantRequires || []) {
    const result = resolveVariant({ group: requirement.group, selectors: requirement.families, targetDevice: device, targetOS: os, consumerJvd: "mebs", members: variantMembers.filter(member => member.group === requirement.group) });
    dependencies.push({ requirement: `variant:${requirement.group}`, target: result.member?.rel, failure: result.status === "ok" ? null : `variant-${result.status}` });
  }
  for (const bullet of header?.pairWith || []) {
    const raw = String(bullet).replace(/^-\s*/, "").trim();
    if (!raw || /^none$/i.test(raw)) continue;
    const targetRel = dependencyPath(raw);
    const mapped = bindings.filter(binding => binding.consumer === consumer && binding.declaredDependency === targetRel);
    if (mapped.length) {
      const binding = mapped[0];
      if (mapped.length !== 1 || binding.scope !== (INTERFACE_RELATIONS.has(binding.kind) ? 'object' : 'whole') || !Array.isArray(binding.providers) || !binding.providers.includes(targetRel) || binding.providers.some(rel => !snipIndex.has(rel))) {
        dependencies.push({ requirement: raw, failure: 'dependency-invalid-binding' });
        continue;
      }
      if (INTERFACE_RELATIONS.has(binding.kind)) {
        dependencies.push({ requirement: raw, target: targetRel, relationBinding: binding, failure: binding.unbound === 'required' ? null : 'dependency-invalid-binding' });
        continue;
      }
      if (binding.unbound === 'required') {
        dependencies.push({ requirement: raw, target: targetRel, occurrenceBinding: binding, failure: null });
        continue;
      }
      const applicable = binding.providers.map(rel => snipIndex.get(rel)).filter(provider => provider?.seenOn?.[os]?.includes(device));
      const bodies = new Set(applicable.map(provider => bodyIdentity(provider.body)));
      applicable.sort((left, right) => Number(left.dir !== os) - Number(right.dir !== os) || left.rel.localeCompare(right.rel));
      dependencies.push({ requirement: raw, target: applicable[0]?.rel, failure: bodies.size === 1 ? null : bodies.size ? 'dependency-ambiguous' : 'dependency-unavailable' });
      continue;
    }
    const result = resolveDependency({ targetRel, targetDevice: device, targetOS: os, index: snipIndex });
    dependencies.push({ requirement: raw, target: result.selected, failure: result.status === "ok" ? null : `dependency-${result.status}`, alternative: result.alternative });
  }
  return dependencies;
}

function bridgeAttachment(body) {
  const parsed = parseConfig(body);
  const interfaces = parsed.nodes.find(node => node.words[0] === "interfaces" && !node.inactive);
  return !!interfaces?.children?.some(parent => !parent.inactive && parent.children?.some(unit => !unit.inactive && unit.words[0] === "unit" && unit.children?.some(node => !node.inactive && node.words.join(" ") === "encapsulation vlan-bridge")));
}

function definesOnly(body, kind, name) {
  const definitions = extractConstructOccurrences(body).definitions.filter(row => row.kind === kind && row.name === name);
  if (definitions.length !== 1) return false;
  const tree = sourceTree(body);
  const allowed = new Set();
  const visit = node => { allowed.add(node.id); for (const child of node.children ?? []) visit(child); };
  visit(tree.index[definitions[0].nodeId]);
  let parent = tree.index[definitions[0].nodeId].parent;
  while (parent !== null) { allowed.add(parent); parent = tree.index[parent].parent; }
  return allowed.size === tree.index.length;
}

export function bindSelection({ consumer, provider, reference, selection, family }) {
  const render = (body, values, configuration = true) => {
    const rendered = body.replace(/\$\{([A-Z][A-Z0-9_]*)\}|\$([A-Z][A-Z0-9_]*)/g, (_, braced, bare) => {
      const value = values?.[braced ?? bare];
      if (typeof value !== 'string' || !value.length || /[{};\r\n]/.test(value)) throw Error(`Missing or unsafe binding: ${braced ?? bare}`);
      return value;
    });
    const parsed = parseConfig(rendered);
    if (configuration && !parsed.ok || /\$\{?[A-Z]/.test(rendered)) throw Error('Invalid rendered template');
    return rendered;
  };
  try {
    const consumerBody = render(consumer.body, selection.consumerBinding);
    const providerBody = render(provider.body, selection.binding);
    const name = render(reference.name, selection.consumerBinding, false);
    const definitions = extractConstructOccurrences(providerBody).definitions.filter(row => row.kind === reference.kind && row.name === name);
    if (definitions.length !== 1) return { status: 'identity-mismatch' };
    if (family === 'e-tree' && reference.kind === 'logical-interface') {
      if (!['root', 'leaf'].includes(selection.role)) return { status: 'role-required' };
      const tree = sourceTree(providerBody);
      const unit = tree.index[definitions[0].nodeId];
      const role = unit.children?.find(row => !row.inactive && row.words[0] === 'etree-ac-role')?.words[1];
      if (role !== selection.role) return { status: 'role-mismatch' };
      if (!unit.children?.some(row => !row.inactive && row.words.join(' ') === 'encapsulation vlan-bridge')) return { status: 'attachment-mismatch' };
      const service = parseConfig(consumerBody).nodes.find(row => row.words[0] === 'routing-instances')?.children?.[0];
      const vlan = service?.children?.find(row => row.words[0] === 'vlan-id')?.words[1];
      if (!vlan || unit.children.find(row => row.words[0] === 'vlan-id')?.words[1] !== vlan) return { status: 'vlan-mismatch' };
    }
    return { status: 'ok', consumerBody, providerBody, name, binding: selection.binding };
  } catch (error) {
    return { status: 'invalid-binding', detail: error.message };
  }
}

export function closeTuple({ entries, device, os, snipIndex, headers, constructs, variantMembers, definers, matrix, family, choiceTrail = [], selections = {} }) {
  const included = new Set();
  const failures = [];
  const requiredInputs = [];
  const rendered = new Map();
  const stack = [...entries];
  while (stack.length) {
    const rel = stack.pop();
    if (included.has(rel)) continue;
    included.add(rel);
    const h = headers.get(rel);
    if (!h) continue;
    for (const detail of configuredCapabilityProblems(h, snipIndex.get(rel).body, matrix?.capabilityRequirements ?? {})) failures.push({ kind: 'capability-mismatch', from: rel, detail });

    for (const dependency of declaredDependencies({ header: h, device, os, snipIndex, variantMembers, consumer: rel, bindings: matrix?.occurrenceBindings })) {
      if (dependency.failure) failures.push({ kind: dependency.failure, from: rel, detail: dependency.requirement, alternative: dependency.alternative });
      else if (!dependency.occurrenceBinding && !dependency.relationBinding) stack.push(dependency.target);
    }

    for (const binding of (matrix?.occurrenceBindings ?? []).filter(row => row.consumer === rel && INTERFACE_RELATIONS.has(row.kind))) {
      const choices = binding.providers.filter(provider => snipIndex.get(provider)?.seenOn?.[os]?.includes(device));
      const construct = `${binding.kind}:source-occurrence`;
      requiredInputs.push({ construct, from: rel, choices, selection: 'source-occurrence-or-explicit-input', scope: binding.scope });
      failures.push({ kind: 'occurrence-selection-required', from: rel, detail: construct });
    }
    const occurrenceBindings = (matrix?.occurrenceBindings || []).filter(binding => binding.consumer === rel && binding.unbound === "required" && !INTERFACE_RELATIONS.has(binding.kind));
    for (const requirement of (matrix?.sourceRequirements || []).filter(row => row.consumer === rel)) {
      if (requirement.kind === 'resolution-transport-class') {
        for (const color of resolutionTransportColors(snipIndex.get(rel).body)) {
          const choices = (matrix.occurrenceEntrySets?.[requirement.entrySet] ?? []).filter(provider => (snipIndex.get(provider)?.seenOn?.[os] ?? []).includes(device) && extractConstructOccurrences(snipIndex.get(provider).body).definitions.some(row => row.kind === 'transport-class' && row.name === color));
          requiredInputs.push({ construct: `resolution-transport-class:${color}`, from: rel, choices, basis: requirement.basis });
          failures.push({ kind: 'functional-selection-required', from: rel, detail: color });
        }
        continue;
      }
      for (const algorithm of flexAlgorithms(snipIndex.get(rel).body).definitions) {
        const choices = (matrix.occurrenceEntrySets?.[requirement.entrySet] || []).filter(provider => (snipIndex.get(provider)?.seenOn?.[os] || []).includes(device) && flexAlgorithms(snipIndex.get(provider).body).participation.includes(algorithm));
        if (!choices.length) failures.push({ kind: "source-requirement-unavailable", from: rel, detail: algorithm });
        else requiredInputs.push({ construct: `isis-flex-algorithm:${algorithm}`, from: rel, choices, selection: "source-occurrence-or-explicit-input" });
      }
    }
    for (const binding of occurrenceBindings) {
      for (const ref of extractConstructOccurrences(snipIndex.get(rel).body).references.filter(ref => ref.kind === binding.kind)) {
        const constraints = [];
        for (const provider of binding.providers || []) {
          const candidate = snipIndex.get(provider);
          if (!(candidate?.seenOn?.[os] || []).includes(device)) continue;
          if (family === "e-tree" && binding.kind === "logical-interface" && !bridgeAttachment(candidate.body)) continue;
          for (const definition of extractConstructOccurrences(candidate.body).definitions.filter(row => row.kind === ref.kind)) {
            const values = bindLine(definition.name, ref.name, {});
            if (values !== null) constraints.push({ provider, definition: definition.name, reference: ref.name, binding: values });
            else if (/^\$(?:[A-Z][A-Z0-9_]*|\{[A-Z][A-Z0-9_]*\})$/.test(ref.name)) {
              const consumerBinding = bindLine(ref.name, definition.name, {});
              if (consumerBinding !== null) constraints.push({ provider, definition: definition.name, reference: ref.name, binding: {}, consumerBinding });
            }
          }
        }
        const choices = [...new Set(constraints.map(row => row.provider))].sort();
        if (!choices.length) { failures.push({ kind: "occurrence-no-applicable-provider", from: rel, detail: `${ref.kind}:${ref.name}` }); continue; }
        const selection = selections[`${rel}:${ref.kind}:${ref.name}`];
        if (selection) {
          if (!choices.includes(selection.provider)) { failures.push({ kind: 'occurrence-invalid-selection', from: rel, detail: ref.name }); continue; }
          const bound = bindSelection({ consumer: snipIndex.get(rel), provider: snipIndex.get(selection.provider), reference: ref, selection, family });
          if (bound.status !== 'ok') { failures.push({ kind: `occurrence-${bound.status}`, from: rel, detail: ref.name }); continue; }
          if ((rendered.has(rel) && rendered.get(rel) !== bound.consumerBody) || (rendered.has(selection.provider) && rendered.get(selection.provider) !== bound.providerBody)) {
            failures.push({ kind: 'occurrence-binding-conflict', from: rel, detail: selection.provider }); continue;
          }
          rendered.set(rel, bound.consumerBody);
          rendered.set(selection.provider, bound.providerBody);
          stack.push(selection.provider);
          continue;
        }
        const providerFailures = [];
        const providerRequiredInputs = {};
        for (const provider of choices) {
          if ([...choiceTrail, rel].includes(provider)) { providerFailures.push({ provider, kind: "choice-cycle" }); continue; }
          const result = closeTuple({ entries: [provider], device, os, snipIndex, headers, constructs, variantMembers, definers, matrix, family, choiceTrail: [...choiceTrail, rel], selections });
          if (result.requiredInputs.length) providerRequiredInputs[provider] = result.requiredInputs;
          providerFailures.push(...unboundSelectionProblems(result).map(failure => ({ provider, ...failure })));
        }
        requiredInputs.push({ construct: `${ref.kind}:${ref.name}`, from: rel, choices, bindingConstraints: constraints, selection: "source-occurrence-or-explicit-input", scope: binding.scope, ...(Object.keys(providerRequiredInputs).length ? { providerRequiredInputs } : {}) });
        failures.push({ kind: "occurrence-selection-required", from: rel, detail: `${ref.kind}:${ref.name}` });
        if (providerFailures.length) failures.push({ kind: "occurrence-provider-closure-failed", from: rel, detail: `${ref.kind}:${ref.name}`, providerFailures });
      }
    }
    for (const ref of constructs.get(rel)?.references || []) {
      if (occurrenceBindings.some(binding => binding.kind === ref.kind)) continue;
      const id = `${ref.kind}:${ref.name}`;
      // A role parameter is a slot: it is never resolved by name equality.
      if (matrix && ref.name.includes("$")) {
        const role = resolveRole({ construct: id, family, os, device, matrix, snipIndex });
        if (role.status === "ok") {
          stack.push(role.selected);
          continue;
        }
        if (role.status === "choice-required") {
          // Closes, but the operator must pick; recorded like any required input.
          requiredInputs.push({ construct: id, from: rel, choices: role.choices });
          continue;
        }
        if (role.status !== "not-a-role") {
          failures.push({ kind: `role-${role.status}`, from: rel, detail: id });
          continue;
        }
      }
      const byOs = definers.get(id);
      const applicable = byOs ? byOs[os].get(device) || [] : [];
      const focused = applicable.filter(provider => definesOnly(snipIndex.get(provider).body, ref.kind, ref.name));
      const here = focused.length ? focused : applicable;
      if (here.length === 0) {
        failures.push({ kind: byOs ? "reference-off-device" : "reference-external", from: rel, detail: id });
        continue;
      }
      const bodies = new Map();
      for (const d of here) {
        const b = bodyIdentity(snipIndex.get(d).body);
        if (!bodies.has(b)) bodies.set(b, []);
        bodies.get(b).push(d);
      }
      if (bodies.size > 1) {
        failures.push({ kind: "reference-ambiguous", from: rel, detail: id, members: here });
        continue;
      }
      const reps = [...bodies.values()][0].sort();
      stack.push(reps.find((d) => d.split("/")[0] === os) ?? reps[0]);
    }
  }
  return { included: [...included].sort(), failures, requiredInputs, rendered: Object.fromEntries(rendered) };
}

function occurrenceReferenceRules(consumer, reference, bindings, snipIndex) {
  const rules = bindings.filter(rule => rule.consumer === consumer.rel && rule.kind === reference.kind);
  if (rules.length || reference.basis !== 'functional-necessity') return rules;
  const providers = [...(snipIndex?.values() ?? [])].filter(snip => extractConstructOccurrences(snip.body).definitions
    .some(definition => definition.kind === reference.kind && bindLine(definition.name, reference.name, {}) !== null)).map(snip => snip.rel);
  return [{ consumer: consumer.rel, kind: reference.kind, scope: 'whole', providers }];
}

export function closeOccurrenceTuple({ entries, resolver, bindings, sourceSha256, headers, snipIndex, variantMembers = [], device, os, sourceRequirements = [], entrySets = {}, capabilityRequirements = {} }) {
  if (sourceSha256 !== resolver.sourceSha256) return { sourceSha256, scope: "typed-references", included: [], edges: [], failures: [{ kind: "occurrence-stale-source" }] };
  const included = new Map();
  const edges = [];
  const failures = [];
  const stack = [];
  for (const entry of entries) {
    const occurrences = resolver.occurrences(entry.rel);
    const occurrence = occurrences.find(row => row.id === entry.id);
    if (!occurrence) failures.push({ kind: "unknown-entry-occurrence", from: entry.rel, id: entry.id });
    else stack.push(occurrence);
  }
  while (stack.length) {
    const consumer = stack.pop();
    if (included.has(consumer.id)) continue;
    included.set(consumer.id, consumer);
    for (const detail of configuredCapabilityProblems(headers?.get(consumer.rel) ?? {}, consumer.rendered, capabilityRequirements ?? {})) failures.push({ kind: 'source-capability-mismatch', from: consumer.id, detail });
    for (const rule of bindings.filter(row => row.consumer === consumer.rel && INTERFACE_RELATIONS.has(row.kind))) {
      if (bindings.filter(row => row.consumer === consumer.rel && row.kind === rule.kind).length !== 1) { failures.push({ kind: 'ambiguous-interface-relation', from: consumer.id, relation: rule.kind }); continue; }
      if (rule.scope !== 'object' || rule.declaredDependency !== undefined && (rule.kind === 'interface-parent' || rule.unbound !== 'required' || !rule.providers?.includes(rule.declaredDependency))) { failures.push({ kind: 'invalid-interface-relation', from: consumer.id, relation: rule.kind }); continue; }
      const result = resolver.resolveRelated({ consumerId: consumer.id, sourceSha256, kind: rule.kind, candidates: rule.providers });
      if (result.status !== 'ok') { failures.push({ kind: `relation-${result.status}`, from: consumer.id, relation: rule.kind, result }); continue; }
      if (rule.declaredDependency && !result.requiredSourceIds.length) failures.push({ kind: 'dependency-reference-unavailable', from: consumer.id, detail: rule.declaredDependency });
      for (const selected of result.selected) {
        edges.push({ from: consumer.id, to: selected.id, relation: rule.kind, scope: rule.scope, targetSourceIds: selected.sourceIds, ...(rule.declaredDependency ? { requirement: rule.declaredDependency } : {}) });
        stack.push(selected);
      }
    }
    const declaredReferences = new Set();
    const deferredReferenceFailures = [];
    for (const requirement of sourceRequirements.filter(row => row.consumer === consumer.rel)) {
      const required = sourceWitnesses({ consumer, requirement, resolver, entrySets });
      if (!['isis-flex-algorithm', 'resolution-transport-class'].includes(requirement.kind) || !required.length || !Array.isArray(entrySets[requirement.entrySet])) {
        failures.push({ kind: "invalid-source-requirement", from: consumer.id });
        continue;
      }
      for (const item of required) {
        if (!item.witnesses.length) failures.push({ kind: item.ambiguous ? 'source-requirement-ambiguous' : "source-requirement-unavailable", from: consumer.id, detail: item.key });
        for (const witness of item.witnesses) {
          edges.push({ from: consumer.id, to: witness.id, requirement: item.key, scope: requirement.kind === 'resolution-transport-class' ? 'functional-necessity' : "source-participation", ...(requirement.basis ? { basis: requirement.basis } : {}) });
          stack.push(witness);
        }
      }
    }
    if (headers) for (const dependency of declaredDependencies({ header: headers.get(consumer.rel), device, os, snipIndex, variantMembers, consumer: consumer.rel, bindings })) {
      if (dependency.failure) { failures.push({ kind: dependency.failure, from: consumer.id, detail: dependency.requirement }); continue; }
      if (dependency.relationBinding) continue;
      if (dependency.occurrenceBinding) {
        const rule = dependency.occurrenceBinding;
        const references = consumer.references.filter(row => row.kind === rule.kind);
        if (!references.length) failures.push({ kind: 'dependency-reference-unavailable', from: consumer.id, detail: dependency.requirement });
        for (const reference of references) {
          const result = resolver.resolve({ consumerId: consumer.id, sourceSha256, ...reference, candidates: rule.providers, scope: rule.scope, preferObject: rule.preferObject });
          if (result.status !== 'ok') { failures.push({ kind: `declared-occurrence-${result.status}`, from: consumer.id, detail: dependency.requirement, reference }); continue; }
          declaredReferences.add(`${reference.nodeId}:${reference.wordIndex}`);
          if (result.internal) continue;
          edges.push({ from: consumer.id, to: result.selected.id, requirement: dependency.requirement, reference, targetSourceIds: result.targetSourceIds, scope: rule.scope });
          stack.push(result.selected);
        }
        continue;
      }
      const target = dependency.target;
      const definitions = extractConstructOccurrences(snipIndex.get(target).body).definitions;
      const matched = new Map();
      const referenceFailures = [];
      const relevantReferences = consumer.references.filter(row => definitions.some(definition => definition.kind === row.kind && bindLine(definition.name, row.name, {}) !== null));
      for (const reference of relevantReferences) {
        const result = resolver.resolve({ consumerId: consumer.id, sourceSha256, ...reference, candidates: [target], scope: "whole" });
        if (result.status === "ok") {
          matched.set(result.selected.id, result.selected);
          declaredReferences.add(`${reference.nodeId}:${reference.wordIndex}`);
        } else {
          referenceFailures.push({ kind: `declared-occurrence-${result.status}`, from: consumer.id, reference, detail: target });
        }
      }
      if (relevantReferences.length && !matched.size) {
        failures.push(...referenceFailures);
        continue;
      }
      for (const failure of referenceFailures) {
        if (failure.kind === 'declared-occurrence-unavailable') deferredReferenceFailures.push(failure);
        else failures.push(failure);
      }
      const candidates = matched.size ? [...matched.values()] : resolver.occurrences(target);
      if (!matched.size && candidates.length !== 1) {
        failures.push({ kind: candidates.length ? "unbound-functional-dependency" : "dependency-source-unavailable", from: consumer.id, detail: target });
        continue;
      }
      for (const selected of candidates) {
        edges.push({ from: consumer.id, to: selected.id, requirement: dependency.requirement, scope: "whole" });
        stack.push(selected);
      }
    }
    const satisfiedReferences = new Set(declaredReferences);
    for (const reference of consumer.references) {
      if (declaredReferences.has(`${reference.nodeId}:${reference.wordIndex}`)) continue;
      const rules = occurrenceReferenceRules(consumer, reference, bindings, snipIndex);
      if (rules.length !== 1) {
        failures.push({ kind: rules.length ? "ambiguous-reference-rule" : "missing-reference-rule", from: consumer.id, reference });
        continue;
      }
      const rule = rules[0];
      const result = resolver.resolve({ consumerId: consumer.id, sourceSha256, nodeId: reference.nodeId, wordIndex: reference.wordIndex, candidates: rule.providers, scope: rule.scope, preferObject: rule.preferObject });
      if (result.status !== "ok") {
        failures.push({ kind: `occurrence-${result.status}`, from: consumer.id, reference, result });
        continue;
      }
      satisfiedReferences.add(`${reference.nodeId}:${reference.wordIndex}`);
      if (result.internal) continue;
      edges.push({ from: consumer.id, to: result.selected.id, reference, targetSourceIds: result.targetSourceIds, scope: rule.scope });
      stack.push(result.selected);
    }
    failures.push(...deferredReferenceFailures.filter(failure => !satisfiedReferences.has(`${failure.reference.nodeId}:${failure.reference.wordIndex}`)));
  }
  const plannedSourceIds = new Set([...included.values()].flatMap(row => row.sourceIds));
  for (const consumer of included.values()) {
    const missing = consumer.requiredContextSourceIds.filter(id => !plannedSourceIds.has(id));
    if (missing.length) failures.push({ kind: 'required-context-not-planned', from: consumer.id, sourceIds: missing });
  }
  const visiting = new Set();
  const visited = new Set();
  const visit = id => {
    if (visiting.has(id)) {
      failures.push({ kind: "reference-cycle", from: id });
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const edge of edges.filter(edge => edge.from === id)) visit(edge.to);
    visiting.delete(id);
    visited.add(id);
  };
  for (const id of included.keys()) visit(id);
  edges.sort((left, right) => `${left.from}:${left.reference?.nodeId ?? left.requirement}:${left.reference?.wordIndex ?? ""}:${left.to}`.localeCompare(`${right.from}:${right.reference?.nodeId ?? right.requirement}:${right.reference?.wordIndex ?? ""}:${right.to}`));
  return { sourceSha256, scope: headers ? "typed-and-declared-dependencies" : "typed-references", included: [...included.values()].sort((left, right) => left.id.localeCompare(right.id)), edges, failures };
}

export function verifyOccurrenceEmission({ closure, rendered, resolver, headers, snipIndex, bindings, variantMembers = [], device, os, sourceRequirements = [], entrySets = {} }) {
  const failures = [];
  const emitted = new Map((rendered.occurrences ?? []).map(row => [row.id, row]));
  const counts = new Map();
  for (const occurrence of rendered.occurrences ?? []) for (const id of occurrence.contributedSourceIds ?? []) counts.set(id, (counts.get(id) ?? 0) + 1);
  for (const [id, count] of counts) if (count !== 1) failures.push({ kind: 'duplicate-source-emission', sourceId: id, count });
  const parsedOutput = parseConfig(rendered.body ?? '');
  const countNodes = nodes => nodes.reduce((sum, node) => sum + 1 + countNodes(node.children ?? []), 0);
  if (!parsedOutput.ok || countNodes(parsedOutput.nodes) !== counts.size) failures.push({ kind: 'rendered-statement-accounting-mismatch' });
  const expected = resolver.render({ ids: closure.included.map(row => row.id), sourceSha256: closure.sourceSha256 });
  if (expected.status !== 'ok' || rendered.sourceSha256 !== closure.sourceSha256 || !parsedOutput.ok || canonicalize(parsedOutput.nodes) !== expected.body) failures.push({ kind: 'rendered-source-projection-mismatch' });
  if (expected.status === 'ok' && (counts.size !== expected.emittedSourceIds.length || expected.emittedSourceIds.some(id => !counts.has(id)))) failures.push({ kind: 'emitted-source-identity-mismatch' });
  const requiredIds = new Set();
  const requireOccurrence = (occurrence, from, requirement) => {
    for (const id of occurrence.sourceIds) requiredIds.add(id);
    const representative = emitted.get(rendered.aliases?.[occurrence.id]);
    if (!representative || JSON.stringify(representative.sourceIds) !== JSON.stringify(occurrence.sourceIds) || representative.rendered !== occurrence.rendered) {
      failures.push({ kind: 'required-occurrence-not-emitted', from, requirement, occurrenceId: occurrence.id });
      return;
    }
    const missing = occurrence.sourceIds.filter(id => !counts.has(id));
    if (missing.length) failures.push({ kind: 'required-source-not-emitted', from, requirement, sourceIds: missing });
  };
  for (const consumer of closure.included) {
    requireOccurrence(consumer, consumer.id, 'selected-occurrence');
    for (const rule of bindings.filter(row => row.consumer === consumer.rel && INTERFACE_RELATIONS.has(row.kind))) {
      if (bindings.filter(row => row.consumer === consumer.rel && row.kind === rule.kind).length !== 1) { failures.push({ kind: 'ambiguous-interface-relation', from: consumer.id, relation: rule.kind }); continue; }
      if (rule.scope !== 'object' || rule.declaredDependency !== undefined && (rule.kind === 'interface-parent' || rule.unbound !== 'required' || !rule.providers?.includes(rule.declaredDependency))) { failures.push({ kind: 'invalid-interface-relation', from: consumer.id, relation: rule.kind }); continue; }
      const result = resolver.resolveRelated({ consumerId: consumer.id, sourceSha256: closure.sourceSha256, kind: rule.kind, candidates: rule.providers });
      if (result.status !== 'ok') { failures.push({ kind: `relation-${result.status}`, from: consumer.id, relation: rule.kind, result }); continue; }
      if (rule.declaredDependency && !result.requiredSourceIds.length) failures.push({ kind: 'dependency-reference-unavailable', from: consumer.id, requirement: rule.declaredDependency });
      for (const id of result.requiredSourceIds) requiredIds.add(id);
      const missing = result.requiredSourceIds.filter(id => !counts.has(id));
      if (missing.length) failures.push({ kind: 'related-source-not-emitted', from: consumer.id, relation: rule.kind, sourceIds: missing });
      for (const selected of result.selected) {
        if (rule.declaredDependency && !closure.edges.some(edge => edge.from === consumer.id && edge.to === selected.id && edge.requirement === rule.declaredDependency && edge.relation === rule.kind)) failures.push({ kind: 'declared-prerequisite-not-planned', from: consumer.id, requirement: rule.declaredDependency });
        requireOccurrence(selected, consumer.id, rule.kind);
      }
    }
    const authoritative = resolver.occurrences(consumer.rel).find(row => row.id === consumer.id);
    if (!authoritative) failures.push({ kind: 'unknown-context-occurrence', from: consumer.id });
    else {
      for (const id of authoritative.requiredContextSourceIds) requiredIds.add(id);
      const missing = authoritative.requiredContextSourceIds.filter(id => !counts.has(id));
      if (missing.length) failures.push({ kind: 'required-context-not-emitted', from: consumer.id, sourceIds: missing });
    }
    for (const dependency of declaredDependencies({ header: headers?.get(consumer.rel), device, os, snipIndex, variantMembers, consumer: consumer.rel, bindings })) {
      if (dependency.failure) { failures.push({ kind: dependency.failure, from: consumer.id, requirement: dependency.requirement }); continue; }
      if (dependency.relationBinding) continue;
      if (dependency.occurrenceBinding) {
        const rule = dependency.occurrenceBinding;
        const references = consumer.references.filter(row => row.kind === rule.kind);
        if (!references.length) failures.push({ kind: 'dependency-reference-unavailable', from: consumer.id, requirement: dependency.requirement });
        for (const reference of references) {
          const result = resolver.resolve({ consumerId: consumer.id, sourceSha256: closure.sourceSha256, ...reference, candidates: rule.providers, scope: rule.scope, preferObject: rule.preferObject });
          if (result.status !== 'ok') { failures.push({ kind: `prerequisite-${result.status}`, from: consumer.id, reference }); continue; }
          if (result.internal) continue;
          const edge = closure.edges.find(row => row.from === consumer.id && row.to === result.selected.id && row.requirement === dependency.requirement && row.reference?.nodeId === reference.nodeId && row.reference?.wordIndex === reference.wordIndex);
          if (!edge) failures.push({ kind: 'declared-prerequisite-not-planned', from: consumer.id, requirement: dependency.requirement, reference });
          requireOccurrence(result.selected, consumer.id, dependency.requirement);
        }
        continue;
      }
      const targets = closure.edges.filter(edge => edge.from === consumer.id && edge.requirement === dependency.requirement);
      if (!targets.length) failures.push({ kind: 'declared-prerequisite-not-planned', from: consumer.id, requirement: dependency.requirement });
      for (const edge of targets) {
        const target = closure.included.find(row => row.id === edge.to);
        if (!target || target.rel !== dependency.target) failures.push({ kind: 'declared-prerequisite-mismatch', from: consumer.id, requirement: dependency.requirement });
        else requireOccurrence(target, consumer.id, dependency.requirement);
      }
    }
    for (const reference of consumer.references) {
      const declared = closure.edges.filter(edge => edge.from === consumer.id && edge.requirement && edge.scope === 'whole').map(edge => closure.included.find(row => row.id === edge.to)).filter(Boolean);
      const resolved = declared.map(provider => resolver.resolve({ consumerId: consumer.id, sourceSha256: closure.sourceSha256, ...reference, candidates: [provider.rel], scope: 'whole' })).find(result => result.status === 'ok');
      if (resolved) {
        if (!resolved.internal) requireOccurrence(resolved.selected, consumer.id, reference);
        continue;
      }
      const rules = occurrenceReferenceRules(consumer, reference, bindings, snipIndex);
      if (rules.length !== 1) { failures.push({ kind: 'prerequisite-rule-unresolved', from: consumer.id, reference }); continue; }
      const result = resolver.resolve({ consumerId: consumer.id, sourceSha256: closure.sourceSha256, ...reference, candidates: rules[0].providers, scope: rules[0].scope, preferObject: rules[0].preferObject });
      if (result.status !== 'ok') failures.push({ kind: `prerequisite-${result.status}`, from: consumer.id, reference });
      else if (!result.internal) requireOccurrence(result.selected, consumer.id, reference);
    }
    for (const requirement of sourceRequirements.filter(row => row.consumer === consumer.rel)) {
      for (const item of sourceWitnesses({ consumer, requirement, resolver, entrySets })) {
        if (!item.witnesses.length) failures.push({ kind: 'source-prerequisite-unresolved', from: consumer.id, requirement: item.key });
        for (const witness of item.witnesses) requireOccurrence(witness, consumer.id, item.key);
      }
    }
  }
  for (const edge of closure.edges) {
    if (!closure.included.some(row => row.id === edge.from) || !closure.included.some(row => row.id === edge.to)) failures.push({ kind: 'dangling-prerequisite-edge', from: edge.from, to: edge.to });
  }
  return { failures, requiredStatementCount: requiredIds.size, emittedStatementCount: counts.size, prerequisiteEdges: closure.edges.length };
}

export function unboundSelectionProblems(result) {
  return result.failures.filter(failure => failure.kind !== 'occurrence-selection-required' || !result.requiredInputs.some(input => input.from === failure.from && input.construct === failure.detail && input.selection === 'source-occurrence-or-explicit-input' && Array.isArray(input.choices) && input.choices.length > 0));
}

async function main() {
  const args = process.argv.slice(2);
  const jvdArg = args.includes("--jvd") ? args[args.indexOf("--jvd") + 1] : "service_provider/metro_ethernet_business_services";
  const root = path.resolve(REPO_ROOT, jvdArg);
  const { snips } = await loadJvd(root);
  const snipIndex = new Map(snips.map((s) => [s.rel, s]));

  const matrix = JSON.parse(await fs.readFile(path.join(root, "configuration/snips/_composition.json"), "utf8"));
  const problems = validateMatrix(matrix, snipIndex);

  console.log(`composition matrix: ${matrix.forms.length} advertised service forms, ${matrix.nonServiceAsks.length} non-service asks`);
  const byStatus = new Map();
  for (const f of matrix.forms) byStatus.set(f.status, (byStatus.get(f.status) || 0) + 1);
  console.log(`status: ${[...byStatus].map(([k, v]) => `${k}=${v}`).join(" ")}`);
  if (problems.length) {
    console.log(`\nMATRIX PROBLEMS (${problems.length}):`);
    for (const p of problems) console.log(`  ${p}`);
  } else {
    console.log("matrix: OK");
  }

  if (!args.includes("--audit")) return problems.length ? 1 : 0;

  const headers = new Map();
  const constructs = new Map();
  for (const s of snips) {
    headers.set(s.rel, parseSnip(await fs.readFile(path.join(root, "configuration/snips", s.rel), "utf8")).header);
    constructs.set(s.rel, extractConstructs(s.body));
  }
  const variantMembers = snips
    .filter((s) => headers.get(s.rel).variantGroup)
    .map((s) => ({
      rel: s.rel,
      os: s.dir,
      jvd: "mebs",
      group: headers.get(s.rel).variantGroup.name,
      provides: headers.get(s.rel).variantGroup.provides,
      seenOn: s.seenOn,
      bodyId: bodyIdentity(s.body),
    }));
  const definers = new Map();
  for (const s of snips) {
    for (const d of constructs.get(s.rel).definitions) {
      const id = `${d.kind}:${d.name}`;
      let m = definers.get(id);
      if (!m) definers.set(id, (m = { junos: new Map(), evo: new Map() }));
      for (const os of ["junos", "evo"]) {
        for (const dev of s.seenOn[os] || []) {
          const l = m[os].get(dev) || [];
          l.push(s.rel);
          m[os].set(dev, l);
        }
      }
    }
  }

  let tuples = 0;
  let clean = 0;
  const ledger = new Map();
  const byFamily = new Map();
  let sizeSum = 0;
  let sizeMax = 0;
  const boundInputs = args.includes('--bound-inputs') ? JSON.parse(await fs.readFile(path.resolve(args[args.indexOf('--bound-inputs') + 1]), 'utf8')) : [];
  const boundPlans = new Map();
  let boundTuples = 0;
  const tupleResults = [];
  for (const f of matrix.forms) {
    if (f.status !== "supported") continue;
    for (const t of formDevices(f, snipIndex)) {
      for (const tier of f.tiers) {
        tuples += 1;
        const pick = selectEntries(t.entries, t.os, snipIndex);
        const selections = {};
        const supplied = boundInputs.filter(input => input.form === f.id && input.device === t.device);
        let boundFailure;
        if (supplied.length > 1) boundFailure = 'ambiguous-bound-input';
        else if (supplied.length === 1) {
          const input = supplied[0];
          const key = JSON.stringify(input);
          if (!boundPlans.has(key)) {
            const { buildOccurrencePlan } = await import('./generate-occurrence-plans.mjs');
            boundPlans.set(key, await buildOccurrencePlan({ root, device: t.device, service: { form: f.id, instanceName: input.instanceName, attachment: input.attachment, role: input.role } }));
          }
          const plan = boundPlans.get(key);
          if (plan.status !== 'ready' || plan.sourceSha256 !== input.sourceSha256) boundFailure = 'invalid-bound-source-plan';
          else {
            boundTuples++;
            for (const entryId of plan.entries) {
              const consumer = plan.occurrences.find(row => row.id === entryId);
              for (const templateRef of extractConstructOccurrences(snipIndex.get(consumer.rel).body).references.filter(row => row.kind === 'logical-interface')) {
                const edge = plan.dependencies.find(row => row.from === entryId && row.reference?.kind === 'logical-interface' && row.reference.name === input.attachment);
                const provider = plan.occurrences.find(row => row.id === edge?.to);
                if (!provider) { boundFailure = 'missing-bound-provider'; continue; }
                selections[`${consumer.rel}:${templateRef.kind}:${templateRef.name}`] = { provider: provider.rel, binding: provider.binding, consumerBinding: consumer.binding, role: input.role };
              }
            }
          }
        }
        const r = closeTuple({
          entries: pick.selected,
          device: t.device,
          os: t.os,
          snipIndex,
          headers,
          constructs,
          variantMembers,
          definers,
          matrix,
          family: f.family,
          selections,
        });
        if (boundFailure) r.failures.push({ kind: boundFailure, from: f.id, detail: t.device });
        if (pick.status !== "ok") r.failures.push({ kind: `entry-${pick.status}`, from: f.id, detail: t.entries.join(",") });
        tupleResults.push({ form: f.id, device: t.device, os: t.os, tier, failures: r.failures, requiredInputs: r.requiredInputs, unexpectedFailures: unboundSelectionProblems(r) });
        sizeSum += r.included.length;
        sizeMax = Math.max(sizeMax, r.included.length);
        const fam = byFamily.get(f.family) || { total: 0, clean: 0 };
        fam.total += 1;
        if (r.failures.length === 0) {
          clean += 1;
          fam.clean += 1;
        }
        byFamily.set(f.family, fam);
        for (const x of r.failures) {
          const key = `${x.kind}\u0000${x.detail}`;
          const e = ledger.get(key) || { kind: x.kind, detail: x.detail, tuples: 0, forms: new Set(), consumers: new Set(), devices: new Set() };
          e.tuples += 1;
          e.forms.add(f.id);
          e.consumers.add(x.from);
          e.devices.add(`${t.os}:${t.device}`);
          ledger.set(key, e);
        }
      }
    }
  }

  console.log(`\nsupported tuples (form x device x tier): ${tuples}`);
  if (boundInputs.length) console.log(`explicit source-bound tuples checked: ${boundTuples}; unbound behavior unchanged`);
  console.log(`CLEAN ${clean}  FAIL-CLOSED ${tuples - clean}  (${tuples ? ((100 * clean) / tuples).toFixed(1) : 0}% closed)`);
  console.log(`mean closure ${tuples ? (sizeSum / tuples).toFixed(1) : 0} snippets, max ${sizeMax}`);
  console.log("\nby family:");
  for (const [fam, v] of [...byFamily].sort()) console.log(`  ${fam.padEnd(12)} ${v.clean}/${v.total} closed`);
  console.log(`\nroot causes (${ledger.size}):`);
  for (const e of [...ledger.values()].sort((a, b) => b.tuples - a.tuples)) {
    console.log(`  ${e.kind.padEnd(26)} ${String(e.tuples).padStart(4)} tuples  ${e.detail}`);
    console.log(`  ${"".padEnd(26)}      forms=${[...e.forms].join(",")}  devices=${e.devices.size}  consumers=${[...e.consumers].length}`);
  }
  const expectSelections = args.includes('--expect-required-inputs');
  const passed = !problems.length && tuples > 0 && (expectSelections
    ? !boundInputs.length && tupleResults.every(row => row.unexpectedFailures.length === 0)
    : clean === tuples);
  if (args.includes('--report')) await fs.writeFile(path.resolve(args[args.indexOf('--report') + 1]), JSON.stringify({ mode: expectSelections ? 'unbound-required-inputs' : 'closed', passed, tuples, clean, failClosed: tuples - clean, matrixProblems: problems, results: tupleResults }, null, 2) + '\n');
  if (expectSelections) console.log(`unbound required-input verification: ${passed ? 'PASS' : 'FAIL'}; ${tupleResults.filter(row => row.failures.length && !row.unexpectedFailures.length).length} tuples expose required selections`);
  return passed ? 0 : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main().then((c) => {
    process.exitCode = c;
  });
}
