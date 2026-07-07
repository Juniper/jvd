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
  /** Per-homing service override (relative snip ids). When a homing key is
   *  present its service snips replace the default `service` list — EVPN-FXC
   *  uses this so single-homed = VLAN-unaware and multihomed = VLAN-aware. */
  serviceByHoming?: Record<string, string[]>;
  interface: Record<string, string>; // homing key -> snip id (relative to jvd)
  interfaceExtras: string[];
  filter: Record<string, string>; // color key -> snip id (relative to jvd)
  uni?: { modes: UniMode[] };
  /** Per-deployment CoS binding override (relative snip ids). When absent the
   *  global catalog.cosSnips[os] set is used. EVPN-FXC uses this to bind CoS to
   *  both bundled VLAN units instead of the single-unit default. */
  cosSnips?: string[];
};

export type GenDeployment = {
  id: string;
  label: string;
  description: string;
  available?: boolean;
  /** Multi-UNI deployment (EVPN-FXC): one service bundles N VLAN UNIs on one
   *  port. The wizard shows a "VLAN UNIs" count and fans out the single-UNI
   *  snips, bumping only `uniVars`; the merger consolidates them. */
  multiUni?: boolean;
  /** Variables that increment per bundled UNI (unit, vlan, and on VLAN-aware
   *  the S-VLAN + ESI). Everything else is constant across the bundle. */
  uniVars?: string[];
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
  /** Asymmetric role-based families (e.g. PWHT) render one config per role
   *  instead of the symmetric PE-A / PE-B model. */
  roleBased?: boolean;
  roles?: GenRole[];
  /** Variables that increment per transport PW (not per service) in the
   *  two-dimensional PWHT fan-out — the PS IFD, VC-ID, PW labels. */
  transportVars?: string[];
  /** PWHT color: the community-definition snip + color→community-name map. */
  colorCommDef?: string;
  colorComms?: Record<string, string>;
};

/** One endpoint role of a role-based family (e.g. PWHT Access vs Headend).
 *  Unlike symmetric E-Line PEs, each role has its own snip bundle + OS. */
export type GenRole = {
  id: string;
  label: string;
  os: GenOsKey;
  service: string[];
  interface: string[];
  /** Alternate interface snip(s) used when a PW carries a VLAN range
   *  (vlan-id-list) instead of a single VLAN. */
  interfaceList?: string[];
  cosSnips?: string[];
  filter?: string;
};

export type GenCatalog = {
  jvd: string;
  jvdLabel: string;
  version: number;
  tiers: Record<string, { label: string; description: string }>;
  cosSnips: Record<GenOsKey, string[]>;
  /** VRF route-export policy snips, per OS, keyed by color id (gold/bronze). */
  routePolicySnips?: Partial<Record<GenOsKey, Record<string, string>>>;
  /** Variables auto-derived from other variables (not shown as form fields). */
  derivedVars?: Record<string, DerivedVar>;
  variableRoles: VariableRoles;
  varSpecs?: Record<string, VarSpec>;
  interfaceSpec?: InterfaceSpec;
  families: GenFamily[];
};

/** A variable whose value is computed from another variable's value. */
export type DerivedVar = { from: string; prefix?: string; suffix?: string };

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
  | { type: "ip" }
  | { type: "psintf" }
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
const IP_RE = /^\d{1,3}(\.\d{1,3}){3}$/;
const PS_INTF_RE = /^ps\d+$/;

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
    case "ip":
      return IP_RE.test(value) ? undefined : "expected an IPv4 address";
    case "psintf":
      return PS_INTF_RE.test(value)
        ? undefined
        : "expected a PS interface (e.g. ps22)";
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

/** Increment the trailing integer of a value by `by` (0 = unchanged),
 *  preserving zero-padding width (so an ESI byte …:01 bumps to …:02, not …:2,
 *  and an RD :40004 → :40005). */
export function bumpInt(value: string, by: number): string {
  if (by === 0) return value;
  const m = value.match(/^(.*?)(\d+)$/);
  if (!m) return value;
  const width = m[2].length;
  return m[1] + String(parseInt(m[2], 10) + by).padStart(width, "0");
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
 * Shift a value map to the Nth bundled UNI of a multi-UNI service (EVPN-FXC):
 * only `uniVars` (unit, vlan, and on VLAN-aware the S-VLAN + ESI) increment by
 * `i`; every other variable (instance name, RD, route-target, port, filter,
 * service-id) stays constant so the N renders merge into ONE service carrying
 * N UNIs. UNI 0 = the values the user entered.
 */
export function uniInstanceValues(
  values: Record<string, string>,
  uniVars: string[],
  i: number,
): Record<string, string> {
  const bump = new Set(uniVars);
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(values)) {
    out[k] = bump.has(k) ? bumpInt(v, i) : v;
  }
  return out;
}

/**
 * Two-dimensional fan-out for role-based families (PWHT): a grid of
 * `transport` × `service` instances. `transportVars` (the PS IFD, VC-ID, PW
 * labels) increment by the transport index `t`; every other non-constant
 * variable increments by the global service index `i` (so each EVPN-ELAN is
 * unique across all transport PWs); instanceConstant vars stay fixed.
 */
export function gridInstanceValues(
  values: Record<string, string>,
  roles: VariableRoles,
  transportVars: string[],
  t: number,
  i: number,
): Record<string, string> {
  const constant = new Set(roles.instanceConstant ?? []);
  const transport = new Set(transportVars);
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(values)) {
    if (transport.has(k)) out[k] = bumpInt(v, t);
    else if (constant.has(k)) out[k] = v;
    else out[k] = bumpInt(v, i);
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
  rtPolicy?: string; // "rt-only" (strip vrf-export) or a color id (gold/bronze)
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

/**
 * Resolve the ordered jvd-qualified snip IDs for one role of a role-based
 * family (e.g. PWHT Access or Headend). Order: service(s) → interface(s) →
 * (if firewall) filter → (if CoS) CoS snips. De-duped + jvd-qualified.
 */
export function resolveRoleSnipIds(
  catalog: GenCatalog,
  role: GenRole,
  opts: { cos: boolean; firewall: boolean },
): string[] {
  const rel: string[] = [...role.service, ...role.interface];
  if (opts.firewall && role.filter) rel.push(role.filter);
  if (opts.cos && role.cosSnips) rel.push(...role.cosSnips);
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
  rel.push(...(osb.serviceByHoming?.[sel.homing] ?? osb.service));
  // Colored VRF export: pull the gold/bronze policy that defines the
  // `vrf-export` policy-statement the service references.
  if (sel.rtPolicy && sel.rtPolicy !== "rt-only") {
    const pol = catalog.routePolicySnips?.[sel.os]?.[sel.rtPolicy];
    if (pol) rel.push(pol);
  }
  const iface = osInterfaceMap(osb, sel.vlanMode)[sel.homing];
  if (iface) rel.push(iface);
  rel.push(...osb.interfaceExtras);
  if (sel.firewall) {
    const filter = osb.filter[sel.color];
    if (filter) rel.push(filter);
  }
  if (sel.cos) {
    rel.push(...(osb.cosSnips ?? catalog.cosSnips[sel.os] ?? []));
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

/** Remove the `vrf-export <policy>;` line from a service body. Used in the
 *  "route-target only" mode, where the RT alone drives import/export and no
 *  export policy is defined. */
function stripVrfExport(body: string): string {
  return body.replace(/\n?[^\S\n]*vrf-export\s+\S+;/g, "");
}

/** Remove a bare `community <name>;` binding line (e.g. an uncolored PWHT
 *  l2circuit). Leaves `community <name> members …;` definitions untouched. */
function stripCommunity(body: string): string {
  return body.replace(/\n?[^\S\n]*community\s+\S+;/g, "");
}

/** Compute auto-derived variable values (e.g. POLICY_NAME = INSTANCE_NAME,
 *  VPN_RT_COMM = INSTANCE_NAME + "_RT") from the resolved base values. */
function applyDerived(
  values: Record<string, string>,
  derived?: Record<string, DerivedVar>,
): Record<string, string> {
  if (!derived) return values;
  const out = { ...values };
  for (const [key, d] of Object.entries(derived)) {
    if (key.startsWith("_") || !d || !d.from) continue;
    const base = values[d.from];
    if (base !== undefined && base !== "")
      out[key] = `${d.prefix ?? ""}${base}${d.suffix ?? ""}`;
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
  opts?: {
    stripUniFilter?: boolean;
    stripVrfExport?: boolean;
    stripCommunity?: boolean;
    derived?: Record<string, DerivedVar>;
  },
): RenderResult {
  // Normalise value keys to bare names (no leading $), then fold in any
  // auto-derived variables (policy name, RT community, …).
  const norm: Record<string, string> = {};
  for (const [k, v] of Object.entries(values)) {
    norm[k.startsWith("$") ? k.slice(1) : k] = v;
  }
  const resolved = applyDerived(norm, opts?.derived);

  const blocks: string[] = [];
  const used: string[] = [];
  for (const id of snipIds) {
    const snip = byId.get(id);
    if (!snip) continue;
    used.push(id);
    const shortPath = `${snip.osKey}/${snip.category}/${snip.name}.conf`;
    let body = substitute(stripHeader(snip.body), resolved);
    // Drop the inline UNI filter binding on interface snips when the user
    // opted out of the firewall filter (else it dangles).
    if (opts?.stripUniFilter && snip.category === "interfaces") {
      body = stripUniFilterBinding(body);
    }
    // Route-target-only mode: drop the vrf-export policy reference.
    if (opts?.stripVrfExport && snip.category === "services") {
      body = stripVrfExport(body);
    }
    // Uncolored PWHT: drop the l2circuit color-community binding.
    if (opts?.stripCommunity && snip.category === "services") {
      body = stripCommunity(body);
    }
    // Normalise interface snips under an `interfaces { … }` wrapper so they
    // merge with each other into one physical-interface stanza. Some snips
    // already carry the wrapper — don't double-wrap those.
    if (snip.category === "interfaces" && !/^\s*interfaces\s*\{/.test(body)) {
      body = `interfaces {\n${body}\n}`;
    }
    // CoS snips belong under `class-of-service { … }` (classifiers, rewrite
    // rules, and the per-interface binding) — not under `[edit interfaces]`.
    if (snip.category === "cos" && !/^\s*class-of-service\s*\{/.test(body)) {
      body = `class-of-service {\n${body}\n}`;
    }
    const rendered = body.replace(/\s+$/, "");
    blocks.push(`/* snips/${shortPath} */\n${rendered}`);
  }

  const text = blocks.join("\n\n") + "\n";
  const missing = Array.from(new Set(text.match(/\$\{?[A-Z_][A-Z0-9_]*\}?/g) ?? []));
  return { text, missing, usedSnipIds: used };
}

/* ------------------------------------------------------------------ *
 * Junos config merger
 *
 * Folds a concatenation of rendered snip bodies into one proper Junos
 * hierarchy: same-key stanzas merge (so N services on one physical port
 * become a single `et-0/0/13 { … }` carrying N units + one `mtu`), and
 * identical leaf statements de-duplicate (the physical MTU, the firewall
 * filter definition, the CoS classifiers are emitted once). This is the
 * deterministic equivalent of hand-consolidating the config before load.
 * ------------------------------------------------------------------ */

type JBlock = { type: "block"; key: string; children: JNode[] };
type JLeaf = { type: "leaf"; key: string };
type JNode = JBlock | JLeaf;

/** Tokenise + parse Junos text into a node tree (blocks and leaf statements). */
function parseJunos(text: string): JNode[] {
  const tokens = text.match(/\{|\}|;|[^\s{};]+/g) ?? [];
  const root: JBlock = { type: "block", key: "", children: [] };
  const stack: JBlock[] = [root];
  let buf: string[] = [];
  for (const t of tokens) {
    if (t === "{") {
      const node: JBlock = { type: "block", key: buf.join(" "), children: [] };
      stack[stack.length - 1].children.push(node);
      stack.push(node);
      buf = [];
    } else if (t === "}") {
      if (stack.length > 1) stack.pop();
      buf = [];
    } else if (t === ";") {
      if (buf.length) stack[stack.length - 1].children.push({ type: "leaf", key: buf.join(" ") });
      buf = [];
    } else {
      buf.push(t);
    }
  }
  return root.children;
}

/** Merge a list of sibling nodes: same-key blocks combine their children
 *  (recursively); identical leaves collapse to one. Order is preserved. */
function mergeJunosNodes(nodes: JNode[]): JNode[] {
  const order: string[] = [];
  const byKey = new Map<string, JNode>();
  for (const n of nodes) {
    const existing = byKey.get(n.key);
    if (!existing) {
      byKey.set(
        n.key,
        n.type === "block"
          ? { type: "block", key: n.key, children: [...n.children] }
          : { type: "leaf", key: n.key },
      );
      order.push(n.key);
    } else if (existing.type === "block" && n.type === "block") {
      existing.children.push(...n.children);
    }
    // leaf duplicate, or leaf/block key clash: keep the first, drop the rest.
  }
  return order.map((k) => {
    const n = byKey.get(k)!;
    if (n.type === "block") n.children = mergeJunosNodes(n.children);
    return n;
  });
}

/** Emit a node tree back to indented Junos text (leaf statements first, then
 *  nested blocks — order-independent for these stanzas and reads cleaner). */
function emitJunos(nodes: JNode[], indent = ""): string {
  const lines: string[] = [];
  for (const n of nodes) if (n.type === "leaf") lines.push(`${indent}${n.key};`);
  for (const n of nodes) {
    if (n.type === "block") {
      lines.push(`${indent}${n.key} {`);
      lines.push(emitJunos(n.children, indent + "    "));
      lines.push(`${indent}}`);
    }
  }
  return lines.filter((l) => l !== "").join("\n");
}

/**
 * Consolidate rendered Junos snip text into one merged hierarchy. Strips
 * `/* … *\/` provenance comments, parses, merges same-key stanzas, and
 * re-emits. Safe to run on a single service (collapses the split physical
 * interface + MTU) or on an N-service batch (nests all units under one port).
 */
export function mergeJunosConfig(text: string): string {
  const noComments = text.replace(/\/\*[\s\S]*?\*\//g, " ");
  const merged = mergeJunosNodes(parseJunos(noComments));
  return emitJunos(merged) + "\n";
}
