import { parseConfig } from "./config-objects.mjs";
import { extractConstructOccurrences } from "./config-references.mjs";

const fields = { "transport:colour-classes": "colours", "transport:mpls-admin-groups": "adminGroups", "firewall:policers": "policers" };
const literal = value => typeof value === "string" && /^[A-Za-z0-9_.-]+$/.test(value);
const number = value => typeof value === "string" && /^\d+$/.test(value);

export function validCapabilityRequirement(token, requirement) {
  const field = fields[token];
  if (!field || !requirement || Object.keys(requirement).length !== 1) return false;
  const values = requirement[field];
  if (field === "adminGroups") return !!values && !Array.isArray(values) && typeof values === "object" && Object.keys(values).length > 0 && Object.entries(values).every(([name, value]) => literal(name) && number(value));
  return Array.isArray(values) && values.length > 0 && new Set(values).size === values.length && values.every(field === "colours" ? number : literal);
}

export function capabilityRequirementProblems(requirements = {}) {
  if (!requirements || typeof requirements !== "object" || Array.isArray(requirements)) return ["capabilityRequirements must be a group-keyed object"];
  return Object.entries(requirements).flatMap(([group, selectors]) => {
    if (!/^[a-z0-9-]+$/.test(group) || !selectors || typeof selectors !== "object" || Array.isArray(selectors) || !Object.keys(selectors).length) return [`Invalid capability group: ${group}`];
    return Object.entries(selectors).filter(([token, requirement]) => !validCapabilityRequirement(token, requirement)).map(([token]) => `Invalid capability requirement: ${group}/${token}`);
  });
}

export function capabilityFacts(body) {
  const parsed = parseConfig(body);
  const facts = { ok: parsed.ok, colours: [], adminGroups: [], policers: [], requiredColours: [], requiredAdminGroups: [], requiredPolicers: [] };
  const walk = (nodes, trail) => {
    for (const node of nodes) {
      if (node.inactive) continue;
      const location = trail.join("/");
      if (location === "routing-options/transport-class" && node.words.length === 2 && node.words[0] === "name") {
        const colors = (node.children ?? []).filter(child => !child.inactive && child.words[0] === "color");
        if (colors.length === 1 && colors[0].children === null && colors[0].words.length === 2 && number(colors[0].words[1])) facts.colours.push({ name: node.words[1], value: colors[0].words[1] });
      }
      if (location === "protocols/mpls/admin-groups" && node.children === null && node.words.length === 2 && literal(node.words[0]) && number(node.words[1])) facts.adminGroups.push({ name: node.words[0], value: node.words[1] });
      if (location === "firewall" && node.children !== null && node.words.length === 2 && node.words[0] === "policer" && literal(node.words[1])) facts.policers.push(node.words[1]);
      if (trail[0] === "routing-options" && trail[1] === "resolution" && node.words[0] === "resolution-ribs") {
        for (const word of node.words.slice(1)) { const match = word.match(/^junos-rti-tc-(\d+)\.inet6?\.3$/); if (match) facts.requiredColours.push(match[1]); }
      }
      if (location === "routing-options" && node.words[0] === "flex-algorithm" && (node.children ?? []).some(child => !child.inactive && child.words[0] === "use-transport-class")) facts.requiredColours.push(...node.children.filter(child => !child.inactive && child.words[0] === "color" && number(child.words[1])).map(child => child.words[1]));
      if (trail[0] === "routing-options" && trail[1]?.startsWith("flex-algorithm ") && node.words[0] === "admin-group") facts.requiredAdminGroups.push(...node.words.slice(2).filter(literal));
      if (node.children) walk(node.children, [...trail, node.words.join(" ")]);
    }
  };
  if (parsed.ok) {
    walk(parsed.nodes, []);
    facts.requiredPolicers = extractConstructOccurrences(body).references.filter(reference => reference.kind === 'policer' && reference.trail[0] !== 'groups' && literal(reference.name)).map(reference => reference.name);
  }
  return facts;
}

export function extractConfiguredCapabilities(body, requirements = {}) {
  const facts = capabilityFacts(body);
  if (!facts.ok) return [];
  return Object.entries(requirements).filter(([token, requirement]) => {
    if (!validCapabilityRequirement(token, requirement)) return false;
    if (token === "transport:colour-classes") return requirement.colours.every(value => facts.colours.filter(row => row.value === value).length === 1) && facts.colours.every(row => facts.colours.filter(other => other.name === row.name).length === 1);
    if (token === "transport:mpls-admin-groups") return Object.entries(requirement.adminGroups).every(([name, value]) => facts.adminGroups.filter(row => row.name === name).length === 1 && facts.adminGroups.some(row => row.name === name && row.value === value));
    return requirement.policers.every(name => facts.policers.filter(value => value === name).length === 1);
  }).map(([token]) => token);
}

export function configuredCapabilityProblems(header, body, requirements = {}) {
  const problems = [];
  const facts = capabilityFacts(body);
  for (const request of header.variantRequires ?? []) for (const token of request.families) {
    if (!fields[token]) continue;
    const requirement = requirements?.[request.group]?.[token];
    if (!validCapabilityRequirement(token, requirement)) { problems.push(`Missing or invalid declaration: ${request.group}/${token}`); continue; }
    const requested = token === "transport:colour-classes" ? facts.requiredColours : token === "transport:mpls-admin-groups" ? facts.requiredAdminGroups : facts.requiredPolicers;
    const declared = token === "transport:colour-classes" ? requirement.colours : token === "transport:mpls-admin-groups" ? Object.keys(requirement.adminGroups) : requirement.policers;
    if (!facts.ok || requested.some(value => !declared.includes(value))) problems.push(`Consumer reference not covered by ${request.group}/${token}`);
  }
  if (header.variantGroup) for (const token of header.variantGroup.provides) {
    if (!fields[token]) continue;
    if (!extractConfiguredCapabilities(body, requirements?.[header.variantGroup.name]).includes(token)) problems.push(`Member does not establish ${header.variantGroup.name}/${token}`);
  }
  return problems;
}