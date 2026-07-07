/**
 * JVD Config Generator — deterministic render engine.
 *
 * Pure, testable functions that turn a wizard selection (family →
 * multiplexing → deployment → OS → attributes → tier) into an ordered
 * list of snip IDs, and render those snips (with variable substitution)
 * into a downloadable Junos / Junos EVO configuration.
 *
 * No AI. The decision tree lives in src/data/generator/<jvd>.json; the
 * snip bodies + variables come from src/data/snips.json (via lib/snips).
 */

import type { SnipRecord, SnipVariable } from "@/lib/snips";

export type GenOsKey = "evo" | "junos";

export type GenOsBlock = {
  service: string[];
  interface: Record<string, string>; // homing key -> snip id (relative to jvd)
  interfaceExtras: string[];
  filter: Record<string, string>; // color key -> snip id (relative to jvd)
};

export type GenDeployment = {
  id: string;
  label: string;
  description: string;
  available?: boolean;
  os: Partial<Record<GenOsKey, GenOsBlock>>;
};

export type GenMux = {
  id: string;
  label: string;
  description: string;
  deployments: GenDeployment[];
};

export type GenFamily = {
  id: string;
  label: string;
  tagline: string;
  description: string;
  available: boolean;
  multiplexing: GenMux[];
};

export type GenCatalog = {
  jvd: string;
  jvdLabel: string;
  version: number;
  tiers: Record<string, { label: string; description: string }>;
  cosSnips: Record<GenOsKey, string[]>;
  variableRoles: VariableRoles;
  families: GenFamily[];
};

/**
 * Classifies each $VAR for two-endpoint rendering:
 *  - shared: identical on both PEs (route-target, instance name, …)
 *  - mirrored pairs: each PE's local value; the partner is the OTHER PE's
 *    local value (e.g. PE-A remote-site-id = PE-B site-id)
 *  - anything not listed = per-endpoint (each PE has its own)
 */
export type VariableRoles = {
  shared: string[];
  mirrored: [string, string][];
  /** Per-endpoint vars that MUST differ between PEs (e.g. RD). */
  distinctPerEndpoint?: string[];
};

export type VarKind =
  | "shared"
  | "mirrored-primary"
  | "mirrored-secondary"
  | "per-endpoint";

/** Classify a variable name (with or without leading $). */
export function classifyVar(
  name: string,
  roles: VariableRoles,
): { kind: VarKind; partner?: string } {
  const bare = name.replace(/^\$/, "");
  if (roles.shared.includes(bare)) return { kind: "shared" };
  for (const [a, b] of roles.mirrored) {
    if (bare === a) return { kind: "mirrored-primary", partner: b };
    if (bare === b) return { kind: "mirrored-secondary", partner: a };
  }
  return { kind: "per-endpoint" };
}

/**
 * Build the concrete value map for one endpoint. `shared` applies to both
 * PEs; `own` holds this PE's per-endpoint + mirrored-primary values;
 * `other` supplies the far PE's values so mirrored-secondary vars
 * (REMOTE_*) resolve to the far end's local value.
 */
export function endpointValues(
  varNames: string[],
  roles: VariableRoles,
  shared: Record<string, string>,
  own: Record<string, string>,
  other: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = { ...shared, ...own };
  for (const name of varNames) {
    const bare = name.replace(/^\$/, "");
    const c = classifyVar(bare, roles);
    if (c.kind === "mirrored-secondary" && c.partner && other[c.partner] !== undefined) {
      out[bare] = other[c.partner];
    }
  }
  return out;
}

export type GenSelection = {
  familyId: string;
  muxId: string;
  deploymentId: string;
  os: GenOsKey;
  homing: string; // key into osBlock.interface
  cos: boolean; // include CoS binding snips (classifiers, scheduler binding)
  firewall: boolean; // include the UNI firewall filter
  color: string; // key into osBlock.filter (required when firewall = true)
};

/** Walk the catalog to the OS block for a (family, mux, deployment, os). */
export function resolveOsBlock(
  catalog: GenCatalog,
  sel: Pick<GenSelection, "familyId" | "muxId" | "deploymentId" | "os">,
): GenOsBlock | null {
  const fam = catalog.families.find((f) => f.id === sel.familyId);
  const mux = fam?.multiplexing.find((m) => m.id === sel.muxId);
  const dep = mux?.deployments.find((d) => d.id === sel.deploymentId);
  return dep?.os[sel.os] ?? null;
}

/**
 * Resolve the ordered list of jvd-qualified snip IDs for a full selection.
 * Order: service(s) → attachment-circuit interface → interface extras →
 * (if firewall) UNI firewall filter → (if CoS) CoS binding snips.
 */
export function resolveSnipIds(catalog: GenCatalog, sel: GenSelection): string[] {
  const osb = resolveOsBlock(catalog, sel);
  if (!osb) return [];
  const rel: string[] = [];
  rel.push(...osb.service);
  const iface = osb.interface[sel.homing];
  if (iface) rel.push(iface);
  rel.push(...osb.interfaceExtras);
  if (sel.firewall) {
    const filter = osb.filter[sel.color];
    if (filter) rel.push(filter);
  }
  if (sel.cos) {
    rel.push(...(catalog.cosSnips[sel.os] ?? []));
  }
  // De-dupe while preserving order, then qualify with the jvd prefix.
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of rel) {
    const qualified = `${catalog.jvd}/${r}`;
    if (!seen.has(qualified)) {
      seen.add(qualified);
      out.push(qualified);
    }
  }
  return out;
}

/** The homing / color attribute options that are valid for a given OS block. */
export function attributeOptions(osb: GenOsBlock): {
  homing: string[];
  color: string[];
} {
  return {
    homing: Object.keys(osb.interface),
    color: Object.keys(osb.filter),
  };
}

/** Unique variables (name + example) across a set of snips, first example wins. */
export function collectVariables(
  snipIds: string[],
  byId: Map<string, SnipRecord>,
): SnipVariable[] {
  const out: SnipVariable[] = [];
  const seen = new Set<string>();
  for (const id of snipIds) {
    const snip = byId.get(id);
    if (!snip) continue;
    for (const v of snip.variables) {
      if (!seen.has(v.name)) {
        seen.add(v.name);
        out.push(v);
      }
    }
  }
  return out;
}

/** Strip a leading C-style /* … *\/ doc header if one is present. */
function stripHeader(body: string): string {
  const t = body.replace(/^\uFEFF?\s*/, "");
  if (t.startsWith("/*")) {
    const end = t.indexOf("*/");
    if (end !== -1) return t.slice(end + 2).replace(/^\s*\n/, "");
  }
  return body;
}

/** Substitute ${VAR} then $VAR for every provided value (longest key first). */
function substitute(body: string, values: Record<string, string>): string {
  let out = body;
  const names = Object.keys(values).sort((a, b) => b.length - a.length);
  for (const name of names) {
    const val = values[name];
    if (val === undefined || val === "") continue;
    const bare = name.startsWith("$") ? name.slice(1) : name;
    out = out.split(`\${${bare}}`).join(val).split(`$${bare}`).join(val);
  }
  return out;
}

export type RenderResult = {
  text: string;
  /** Variable names still present as $VAR after substitution. */
  missing: string[];
  /** The snip IDs that were rendered, in order. */
  usedSnipIds: string[];
};

/**
 * Render the resolved snips into one config blob. Each snip is prefixed
 * with a `/* snips/<path> *\/` provenance comment; its own doc header is
 * stripped. `values` maps variable names (with or without leading $) to
 * concrete values.
 */
export function renderConfig(
  snipIds: string[],
  values: Record<string, string>,
  byId: Map<string, SnipRecord>,
): RenderResult {
  // Normalise value keys to bare names (no leading $).
  const norm: Record<string, string> = {};
  for (const [k, v] of Object.entries(values)) {
    norm[k.startsWith("$") ? k.slice(1) : k] = v;
  }

  const blocks: string[] = [];
  const used: string[] = [];
  for (const id of snipIds) {
    const snip = byId.get(id);
    if (!snip) continue;
    used.push(id);
    const shortPath = `${snip.osKey}/${snip.category}/${snip.name}.conf`;
    const rendered = substitute(stripHeader(snip.body), norm).replace(/\s+$/, "");
    blocks.push(`/* snips/${shortPath} */\n${rendered}`);
  }

  const text = blocks.join("\n\n") + "\n";
  const missing = Array.from(new Set(text.match(/\$\{?[A-Z_][A-Z0-9_]*\}?/g) ?? []));
  return { text, missing, usedSnipIds: used };
}
