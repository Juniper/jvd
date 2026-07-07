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

/**
 * A UNI VLAN-handling mode (single VLAN vs VLAN-map normalization, and later
 * QinQ / bundle variants). Each mode maps a homing key to the interface snip
 * that implements it. When an OS block declares `uni.modes`, the wizard shows
 * a "VLAN handling" selector and the interface is resolved from the chosen
 * mode; otherwise the flat `interface` map is used (legacy single-mode).
 */
export type UniMode = {
  id: string;
  label: string;
  description: string;
  interface: Record<string, string>; // homing key -> snip id (relative to jvd)
};

export type GenOsBlock = {
  service: string[];
  interface: Record<string, string>; // homing key -> snip id (relative to jvd)
  interfaceExtras: string[];
  filter: Record<string, string>; // color key -> snip id (relative to jvd)
  uni?: { modes: UniMode[] };
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
  varSpecs?: Record<string, VarSpec>;
  interfaceSpec?: InterfaceSpec;
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
  /** Vars that stay the SAME across service instances (N-count) — e.g. the
   *  physical port, MTU, filter name. Everything else increments per instance. */
  instanceConstant?: string[];
};

/**
 * Validated domain for a single variable. Drives the field UI (dropdown vs
 * bounded number vs structured interface) and the soft "not JVD-validated"
 * warning. Anything not covered here is a free text field.
 */
export type VarSpec =
  | { type: "enum"; values: string[] }
  | { type: "range"; min: number; max: number }
  | { type: "interface" }
  | { type: "rd" }
  | { type: "rt" }
  | { type: "esi" }
  | { type: "name" }
  | { type: "text" };

/** Validated attachment-circuit interface domain for the JVD's PE platforms. */
export type InterfaceSpec = {
  media: string[];
  fpcMax: number;
  picMax: number;
  portMax: number;
  channelMax: number;
  aeMax: number;
};

const RD_RT_RE = /^(\d{1,3}(\.\d{1,3}){3}|\d+):\d+$/;
const ESI_RE = /^([0-9a-fA-F]{2}:){9}[0-9a-fA-F]{2}$/;
const NAME_RE = /^[A-Za-z0-9_-]+$/;

/**
 * Validate one interface string against the platform capability table.
 * Returns a warning message when the media type or a slot/pic/port index is
 * outside the JVD-validated domain, else undefined. Catches e.g. et-99/99/99
 * (port 99 > portMax) that a shape-only regex would accept.
 */
export function validateInterface(
  value: string,
  spec: InterfaceSpec,
): string | undefined {
  const ae = value.match(/^ae(\d+)$/);
  if (ae) {
    if (!spec.media.includes("ae")) return "aggregated interfaces not validated here";
    return Number(ae[1]) > spec.aeMax
      ? `ae index > ${spec.aeMax} — not JVD-validated`
      : undefined;
  }
  const m = value.match(/^([a-z]{2,3})-(\d+)\/(\d+)\/(\d+)(?::(\d+))?$/);
  if (!m) return `expected e.g. ${spec.media[0]}-0/0/0 or ae0`;
  const [, media, fpc, pic, port, ch] = m;
  if (!spec.media.includes(media))
    return `port-type "${media}" not in ${spec.media.join("/")}`;
  if (Number(fpc) > spec.fpcMax) return `FPC ${fpc} > ${spec.fpcMax} — not JVD-validated`;
  if (Number(pic) > spec.picMax) return `PIC ${pic} > ${spec.picMax} — not JVD-validated`;
  if (Number(port) > spec.portMax)
    return `port ${port} > ${spec.portMax} — not JVD-validated`;
  if (ch !== undefined && Number(ch) > spec.channelMax)
    return `channel ${ch} > ${spec.channelMax} — not JVD-validated`;
  return undefined;
}

/**
 * Validate a value against its spec. Returns a soft warning message (the
 * config still renders) or undefined when the value is within the validated
 * JVD domain. Empty values are treated as valid (unfilled, not wrong).
 */
export function validateSpec(
  value: string | undefined,
  spec: VarSpec | undefined,
  ifaceSpec: InterfaceSpec | undefined,
): string | undefined {
  if (!spec || value === undefined || value === "") return undefined;
  switch (spec.type) {
    case "enum":
      return spec.values.includes(value)
        ? undefined
        : `not a validated value (${spec.values.join(", ")})`;
    case "range": {
      if (!/^\d+$/.test(value)) return "expected a number";
      const n = Number(value);
      return n < spec.min || n > spec.max
        ? `outside validated range ${spec.min}–${spec.max}`
        : undefined;
    }
    case "interface":
      return ifaceSpec ? validateInterface(value, ifaceSpec) : undefined;
    case "rd":
      return RD_RT_RE.test(value) ? undefined : "expected <ip|asn>:<number>";
    case "rt":
      return RD_RT_RE.test(value) ? undefined : "expected <ip|asn>:<number>";
    case "esi":
      return ESI_RE.test(value) ? undefined : "expected a 10-byte ESI (00:…:01)";
    case "name":
      return NAME_RE.test(value) ? undefined : "letters, digits, _ or - only";
    default:
      return undefined;
  }
}


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

/** Increment the trailing integer of a value by `by` (0 = unchanged). */
export function bumpInt(value: string, by: number): string {
  if (by === 0) return value;
  const m = value.match(/^(.*?)(\d+)$/);
  return m ? m[1] + String(parseInt(m[2], 10) + by) : value;
}

/**
 * Shift a value map to the Nth service instance: every variable's trailing
 * integer is incremented by `i`, except those listed as instanceConstant
 * (physical port, MTU, filter name, …). Instance 0 = unchanged (the values
 * the user entered are the starting point for service #1).
 */
export function instanceValues(
  values: Record<string, string>,
  roles: VariableRoles,
  i: number,
): Record<string, string> {
  const constant = new Set(roles.instanceConstant ?? []);
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(values)) {
    out[k] = constant.has(k) ? v : bumpInt(v, i);
  }
  return out;
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
  vlanMode?: string; // id of the chosen uni.mode (when the OS block has them)
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

/** The VLAN-handling modes an OS block offers (empty when it has none). */
export function vlanModes(osb: GenOsBlock): UniMode[] {
  return osb.uni?.modes ?? [];
}

/** The homing→snip interface map for the chosen VLAN mode (or the flat/legacy
 *  map when the block has no `uni.modes`). */
export function osInterfaceMap(
  osb: GenOsBlock,
  vlanMode?: string,
): Record<string, string> {
  if (osb.uni) {
    const mode =
      osb.uni.modes.find((m) => m.id === vlanMode) ?? osb.uni.modes[0];
    return mode?.interface ?? {};
  }
  return osb.interface;
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
  const iface = osInterfaceMap(osb, sel.vlanMode)[sel.homing];
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

/** The homing / color attribute options that are valid for a given OS block
 *  (homing depends on the chosen VLAN mode when the block has `uni.modes`). */
export function attributeOptions(
  osb: GenOsBlock,
  vlanMode?: string,
): {
  homing: string[];
  color: string[];
} {
  return {
    homing: Object.keys(osInterfaceMap(osb, vlanMode)),
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

/**
 * Remove the UNI firewall-filter binding from an interface body. The JVD
 * interface snips carry the filter binding inline as `family <fam> { filter {
 * input f_…; } }`; when the user opts out of the UNI filter we skip the filter
 * definition snip, so the binding must be dropped too (else it references a
 * filter that no longer exists). Collapses the family stanza to `family <fam>;`.
 */
function stripUniFilterBinding(body: string): string {
  return body.replace(
    /(family\s+[\w-]+)\s*\{\s*filter\s*\{[^{}]*\}\s*\}/g,
    "$1;",
  );
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
  opts?: { stripUniFilter?: boolean },
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
    let body = substitute(stripHeader(snip.body), norm);
    // Drop the inline UNI filter binding on interface snips when the user
    // opted out of the firewall filter (else it dangles).
    if (opts?.stripUniFilter && snip.category === "interfaces") {
      body = stripUniFilterBinding(body);
    }
    const rendered = body.replace(/\s+$/, "");
    blocks.push(`/* snips/${shortPath} */\n${rendered}`);
  }

  const text = blocks.join("\n\n") + "\n";
  const missing = Array.from(new Set(text.match(/\$\{?[A-Z_][A-Z0-9_]*\}?/g) ?? []));
  return { text, missing, usedSnipIds: used };
}
