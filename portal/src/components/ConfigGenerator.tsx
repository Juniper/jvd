import { useEffect, useMemo, useRef, useState } from "react";
import {
  Cpu,
  Download,
  Copy,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Plus,
  X,
} from "lucide-react";
import { snipBundle, type SnipRecord, type SnipVariable } from "@/lib/snips";
import { track } from "@/lib/analytics";
import maasCatalog from "@/data/generator/metro_as_a_service.json";
import {
  type GenCatalog,
  type GenOsKey,
  type GenSelection,
  type VarSpec,
  resolveOsBlock,
  resolveSnipIds,
  resolveRoleSnipIds,
  resolveEtreeSnipIds,
  attributeOptions,
  vlanModes,
  collectVariables,
  renderConfig,
  mergeJunosConfig,
  classifyVar,
  collectVariables,
  endpointValues,
  instanceValues,
  siteInstanceValues,
  fxcUnitSpecs,
  expandVlanRange,
  type FxcEntry,
  bumpInt,
  validateSpec,
} from "@/lib/generator";

const CATALOG = maasCatalog as unknown as GenCatalog;
const ROLES = CATALOG.variableRoles;
const IFACE_SPEC = CATALOG.interfaceSpec;
const VAR_SPECS = (CATALOG.varSpecs ?? {}) as Record<string, unknown>;
const ROUTE_POLICY = (CATALOG.routePolicySnips ?? {}) as Partial<
  Record<GenOsKey, Record<string, string>>
>;
/** Variables computed automatically (never shown as editable form fields). */
const DERIVED_VARS = new Set(
  Object.keys(CATALOG.derivedVars ?? {}).filter((k) => !k.startsWith("_")),
);
/** Friendly labels for the VPN color options. */
const COLOR_POLICY_LABELS: Record<string, string> = {
  gold: "Gold — priority / low-latency",
  bronze: "Bronze — TE path",
};

/** PWHT color options (batch-level: one color per generated batch). */
const PWHT_COLORS = ["uncolored", "gold", "bronze"] as const;
const PWHT_COLOR_LABELS: Record<string, string> = {
  uncolored: "Uncolored (best-effort)",
  gold: "Gold — priority / low-latency",
  bronze: "Bronze — TE path",
};
/** Variables the PWHT fan-out computes automatically (not user form fields). */
const PWHT_COMPUTED = new Set([
  "UNIT",
  "PS_SERVICE",
  "VLAN_LIST_START",
  "VLAN_LIST_END",
  "COLOR_COMM",
]);
/** Variables the EVPN-FXC per-UNI entry list drives (not shown as form fields). */
const FXC_ENTRY_VARS = new Set([
  "UNIT",
  "VLAN",
  "VLAN_LIST",
  "SVLAN",
  "INPUT_VID",
  "ESI_ID",
  "LOCAL_VID",
  "REMOTE_VID",
]);

/**
 * Compute the value map for one PWHT role instance in the transport×service
 * fan-out. Transport vars (PS IFD, VC-ID, PW labels) bump per PW (t); the
 * access side carries the whole VLAN range on one unit (vlan-id-list); the
 * headend side has one service unit + ELAN per VLAN (bumped by the global
 * service index i). ESIs/RD increment per service.
 */
function pwhtInstanceValues(
  role: "access" | "headend",
  base: Record<string, string>,
  transportVars: Set<string>,
  t: number,
  s: number,
  S: number,
  baseVlan: number,
  colorComm: string,
): Record<string, string> {
  const rangeStart = baseVlan + t * S;
  const vlan = rangeStart + s;
  const i = t * S + s;
  const out: Record<string, string> = { ...base };
  for (const k of Object.keys(out)) if (transportVars.has(k)) out[k] = bumpInt(out[k], t);
  if (role === "access") {
    out.UNIT = String(rangeStart);
    out.VLAN_LIST_START = String(rangeStart);
    out.VLAN_LIST_END = String(rangeStart + S - 1);
    out.VLAN = String(rangeStart);
    if (colorComm) out.COLOR_COMM = colorComm;
  } else {
    out.VLAN = String(vlan);
    out.PS_SERVICE = String(vlan);
    out.UNIT = String(vlan);
    for (const k of ["RD", "VESI_ID", "ESI_ID"])
      if (base[k] !== undefined) out[k] = bumpInt(base[k], i);
  }
  return out;
}

/** The validated field spec for a bare var name (skips the `_note` key). */
function specFor(bare: string): VarSpec | undefined {
  const s = VAR_SPECS[bare];
  return s && typeof s === "object" && "type" in (s as object)
    ? (s as VarSpec)
    : undefined;
}


const JVDS = [
  {
    id: "metro_as_a_service",
    label: CATALOG.jvdLabel,
    available: true,
    tagline: "MEF Carrier Ethernet services",
  },
];

const HOMING_LABELS: Record<string, string> = {
  "single-homed": "Single-homed",
  multihomed: "Multihomed (all-active ESI)",
  root: "Root (multihomed)",
  leaf: "Leaf (single-homed)",
};
const COLOR_LABELS: Record<string, string> = {
  "color-blind": "Color-blind",
  "color-aware": "Color-aware",
};
const OS_LABELS: Record<GenOsKey, string> = { evo: "Junos EVO", junos: "Junos" };

/** Friendly names for the cryptic $VARs (the `_VID` suffix is misleading). */
const VAR_LABELS: Record<string, string> = {
  INSTANCE_NAME: "service instance name",
  VRF_TARGET: "route-target",
  RD: "route-distinguisher",
  AC_INTF: "attachment-circuit interface",
  UNIT: "unit",
  VLAN: "UNI VLAN-id",
  UNIT_1: "UNI 1 unit",
  UNIT_2: "UNI 2 unit",
  VLAN_1: "UNI 1 VLAN-id",
  VLAN_2: "UNI 2 VLAN-id",
  INPUT_VID: "normalized S-VLAN (push)",
  INPUT_VID_1: "UNI 1 S-VLAN (push)",
  INPUT_VID_2: "UNI 2 S-VLAN (push)",
  ESI_ID_1: "UNI 1 ESI value",
  ESI_ID_2: "UNI 2 ESI value",
  LOCAL_VID: "vpws-service-id · local",
  REMOTE_VID: "vpws-service-id · remote",
  SITE_ID: "L2VPN site-id · local",
  REMOTE_SITE_ID: "L2VPN site-id · remote",
  VC_ID: "virtual-circuit-id",
  ESI_ID: "ESI value",
  FILTER_NAME: "UNI filter name",
  MTU: "physical MTU",
  PS_TRANSPORT: "PS interface (IFD)",
  PS_SERVICE: "PS service unit",
  PS_ANCHOR: "PS anchor (LT)",
  PW_LABEL_IN: "PW label · incoming",
  PW_LABEL_OUT: "PW label · outgoing",
  PW_NEIGHBOR: "PW neighbor",
  VESI_ID: "PS virtual-ESI",
};
const varLabel = (name: string) => VAR_LABELS[name.replace(/^\$/, "")] ?? name;

/** Soft validation warning for a field value (undefined = valid/unvalidated).
 *  Domain-aware: dropdown choices, numeric ranges, interface slot ranges. */
function formatError(bare: string, value: string | undefined): string | undefined {
  return validateSpec(value, specFor(bare), IFACE_SPEC);
}

/** A short hint describing the validated domain of a field (for interface /
 *  numeric-range fields). undefined = no hint. */
function fieldHint(bare: string): string | undefined {
  const spec = specFor(bare);
  if (spec?.type === "interface" && IFACE_SPEC)
    return `${IFACE_SPEC.media.join(" / ")} · 0/0/0`;
  if (spec?.type === "range") return `${spec.min}–${spec.max}`;
  return undefined;
}

type OsChoice = GenOsKey | "none";

type StepId =
  | "jvd"
  | "family"
  | "mux"
  | "deployment"
  | "endpoints"
  | "attributes"
  | "params";

const STEP_TITLES: Record<StepId, string> = {
  jvd: "Choose a JVD",
  family: "Service type",
  mux: "Service profile",
  deployment: "Deployment",
  endpoints: "Endpoints",
  attributes: "Service attributes",
  params: "Parameters",
};

const STEPS: StepId[] = [
  "jvd",
  "family",
  "mux",
  "deployment",
  "endpoints",
  "attributes",
  "params",
];

/** Role-based families (PWHT) skip mux/deployment/endpoint selection — the
 *  two roles are fixed — so they use a shorter step flow. */
const STEPS_ROLE: StepId[] = ["jvd", "family", "attributes", "params"];

type Selection = {
  jvd?: string;
  familyId?: string;
  muxId?: string;
  deploymentId?: string;
  osA?: GenOsKey;
  osB?: OsChoice;
  homing?: string;
  vlanMode?: string;
  rtPolicy?: string;
  pwColor?: string;
  color?: string;
  cos: boolean;
  firewall: boolean;
};

/** Bump a trailing integer so PE-B defaults differ from PE-A. */
function bumpB(example: string): string {
  const m = example.match(/^(.*?)(\d+)$/);
  return m ? m[1] + String(parseInt(m[2], 10) + 1) : example;
}

/** VLAN-ids are 1–4094 (Junos hard limit). Soft-validate an EVPN-FXC entry's
 *  VLAN / range / S-VLAN inputs (which bypass the varSpec-driven VarField
 *  validation); returns a warning message or undefined. */
const VLAN_MIN = 1;
const VLAN_MAX = 4094;
function vlanIdInRange(v: string): boolean {
  if (!/^\d+$/.test(v)) return false;
  const n = Number(v);
  return n >= VLAN_MIN && n <= VLAN_MAX;
}
function fxcEntryVlanError(
  e: FxcEntry,
  mode: "unaware" | "aware",
  awareMap: boolean,
): string | undefined {
  const single = mode === "aware" || e.kind === "single";
  if (single) {
    if (e.vlan && !vlanIdInRange(e.vlan)) return `VLAN-id must be ${VLAN_MIN}–${VLAN_MAX}`;
  } else if (e.range) {
    const m = e.range.match(/^\s*(\d+)\s*-\s*(\d+)\s*$/);
    if (!m) {
      if (!vlanIdInRange(e.range)) return `VLAN-id must be ${VLAN_MIN}–${VLAN_MAX}`;
    } else {
      const a = Number(m[1]);
      const b = Number(m[2]);
      if (a < VLAN_MIN || b > VLAN_MAX || b < a)
        return `range must be within ${VLAN_MIN}–${VLAN_MAX}`;
    }
  }
  const svlanShown =
    (mode === "aware" && awareMap) || (mode === "unaware" && e.kind === "range");
  if (svlanShown && e.svlan && !vlanIdInRange(e.svlan))
    return `S-VLAN must be ${VLAN_MIN}–${VLAN_MAX}`;
  return undefined;
}

/** VLAN-ids an EVPN-FXC entry occupies (single/aware = one; range = expanded). */
function fxcEntryVlans(e: FxcEntry, mode: "unaware" | "aware"): number[] {
  if (mode === "aware" || e.kind === "single") {
    const n = Number(e.vlan);
    return Number.isInteger(n) ? [n] : [];
  }
  return expandVlanRange(e.range);
}

/** Ids of EVPN-FXC entries whose VLAN-ids collide with an earlier entry. A
 *  duplicate unit/VLAN silently merges into a single UNI, so flag it. */
function fxcOverlapIds(
  entries: (FxcEntry & { id: number })[],
  mode: "unaware" | "aware",
): Set<number> {
  const firstSeen = new Map<number, number>();
  const bad = new Set<number>();
  for (const e of entries) {
    for (const v of fxcEntryVlans(e, mode)) {
      if (firstSeen.has(v)) bad.add(e.id);
      else firstSeen.set(v, e.id);
    }
  }
  return bad;
}

function Chip({
  label,
  sub,
  active,
  disabled,
  onClick,
}: {
  label: string;
  sub?: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
        disabled
          ? "cursor-not-allowed border-dashed border-border opacity-50"
          : active
            ? "border-primary bg-primary/10"
            : "border-border bg-background hover:border-primary/50",
      ].join(" ")}
    >
      <span>
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {sub && <span className="mt-0.5 block text-xs text-muted-foreground">{sub}</span>}
      </span>
      {!disabled && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
    </button>
  );
}

function VarField({
  name,
  value,
  onChange,
  hint,
  error,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  error?: string;
}) {
  const bare = name.replace(/^\$/, "");
  const spec = specFor(bare);
  const inputCls = [
    "mt-1 h-9 w-full rounded-md border bg-background px-3 font-mono text-sm text-foreground focus:outline-none",
    error
      ? "border-red-500/60 focus:border-red-500"
      : "border-border focus:border-primary/60",
  ].join(" ");
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-foreground">{varLabel(name)}</span>
        <span className="font-mono text-[10px] text-muted-foreground/70">{name}</span>
      </span>
      {(hint || error) && (
        <span className="flex items-baseline justify-between gap-2">
          <span className="text-[10px] text-muted-foreground/70">{hint}</span>
          {error && (
            <span className="text-[10px] font-semibold text-red-600 dark:text-red-400">
              {error}
            </span>
          )}
        </span>
      )}
      {spec?.type === "enum" ? (
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        >
          {Array.from(new Set([value, ...spec.values].filter(Boolean))).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
              {!spec.values.includes(opt) ? " (custom)" : ""}
            </option>
          ))}
        </select>
      ) : (
        <input
          value={value ?? ""}
          inputMode={spec?.type === "range" ? "numeric" : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      )}
    </label>
  );
}

export default function ConfigGenerator() {
  const byId = useMemo(() => {
    const m = new Map<string, SnipRecord>();
    for (const s of snipBundle.snips) m.set(s.id, s);
    return m;
  }, []);

  const [sel, setSel] = useState<Selection>({ cos: true, firewall: true });
  const [shared, setShared] = useState<Record<string, string>>({});
  const [perA, setPerA] = useState<Record<string, string>>({});
  const [perB, setPerB] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(1);
  const [siteCount, setSiteCount] = useState(2);
  const [pwCount, setPwCount] = useState(1);
  // E-Tree: the root is single-homed (1 root PE) or multihomed (a 2-node
  // all-active ESI pair); `leafCount` fans out single-homed leaf PEs.
  const [rootMultihomed, setRootMultihomed] = useState(true);
  const [leafCount, setLeafCount] = useState(2);
  // EVPN-FXC per-UNI VLAN entry list (+ a stable id for React keys) and the
  // VLAN-aware map toggle (matching vlan-id vs input/output vlan-map).
  const [fxcEntries, setFxcEntries] = useState<(FxcEntry & { id: number })[]>([]);
  const [awareMap, setAwareMap] = useState(true);
  const fxcIdRef = useRef(1);

  const family = CATALOG.families.find((f) => f.id === sel.familyId);
  const mux = family?.multiplexing.find((m) => m.id === sel.muxId);
  const deployment = mux?.deployments.find((d) => d.id === sel.deploymentId);
  const osOptions = deployment ? (Object.keys(deployment.os) as GenOsKey[]) : [];
  // EVPN-FXC = one service bundling a per-UNI VLAN entry list (declared early:
  // the field filters below reference it).
  const multiUni = !!deployment?.multiUni;
  // Multi-site EVI (EVPN-ELAN / BGP-VPLS): one shared service replicated across
  // N self-contained PE sites. `count` doubles as the site count.
  const multiSite = !!deployment?.multiSite;
  // BGP-VPLS: site-range + label-block-size must scale to the number of sites.
  const isVpls = !!deployment?.id?.includes("vpls");
  // E-Tree (rooted-multipoint): one EVI split into a Root PE + N Leaf PEs.
  const isEtree = !!deployment?.etree;

  // Role-based families (PWHT) render one config per fixed role (Access /
  // Headend) instead of the symmetric PE-A / PE-B model.
  const roleBased = !!family?.roleBased;
  const roles = family?.roles ?? [];
  // Asymmetric two-pane deployments (PWHT roles, E-Tree root/leaf): each pane's
  // fields + defaults come from its OWN snips, not a symmetric bump/mirror.
  const asym = roleBased || isEtree;

  const twoPe = isEtree || (!!sel.osB && sel.osB !== "none");

  const osBlockA =
    sel.familyId && sel.muxId && sel.deploymentId && sel.osA
      ? resolveOsBlock(CATALOG, {
          familyId: sel.familyId,
          muxId: sel.muxId,
          deploymentId: sel.deploymentId,
          os: sel.osA,
        })
      : null;
  const osBlockB =
    twoPe && sel.familyId && sel.muxId && sel.deploymentId
      ? resolveOsBlock(CATALOG, {
          familyId: sel.familyId,
          muxId: sel.muxId,
          deploymentId: sel.deploymentId,
          os: (isEtree ? sel.osA : sel.osB) as GenOsKey,
        })
      : null;

  // VLAN-handling modes = intersection of both endpoints' modes (some snips
  // only exist on one OS, so a mode is offered only when both PEs support it).
  const modesA = osBlockA ? vlanModes(osBlockA) : [];
  const modesB = osBlockB ? vlanModes(osBlockB) : null;
  const modeOpts = modesB
    ? modesA.filter((m) => modesB.some((x) => x.id === m.id))
    : modesA;
  // Effective (derived) VLAN mode: the user's pick if still valid, else the
  // first available mode. Undefined when the deployment has no modes at all.
  const vlanMode =
    modeOpts.length > 0
      ? modeOpts.some((m) => m.id === sel.vlanMode)
        ? sel.vlanMode
        : modeOpts[0].id
      : undefined;

  // VRF route-export: "route-target only" vs a colored export policy. Colors
  // are the intersection of what both PEs' OS support (Junos = gold only).
  const colorPolA = sel.osA ? Object.keys(ROUTE_POLICY[sel.osA] ?? {}) : [];
  const colorPolB =
    twoPe && sel.osB && sel.osB !== "none"
      ? Object.keys(ROUTE_POLICY[sel.osB as GenOsKey] ?? {})
      : null;
  const colorPolOpts = colorPolB
    ? colorPolA.filter((c) => colorPolB.includes(c))
    : colorPolA;
  // Only offer the choice when the deployment's service actually emits a
  // `vrf-export` (i.e. it's RT-policy driven).
  const serviceHasVrfExport = Boolean(
    osBlockA?.service.some((rel) =>
      /vrf-export/.test(byId.get(`${CATALOG.jvd}/${rel}`)?.body ?? ""),
    ),
  );
  const rtPolicyApplies = serviceHasVrfExport && colorPolOpts.length > 0;
  // Effective route policy: "rt-only" (default, strips vrf-export) or a valid
  // color id. Falls back to rt-only when the pick isn't supported.
  const rtPolicy = !rtPolicyApplies
    ? "rt-only"
    : sel.rtPolicy && colorPolOpts.includes(sel.rtPolicy)
      ? sel.rtPolicy
      : "rt-only";

  // Attribute options = intersection of both endpoints (or just A when single),
  // for the currently-selected VLAN mode.
  const attrsA = osBlockA
    ? attributeOptions(osBlockA, vlanMode)
    : { homing: [], color: [] };
  const attrsB = osBlockB ? attributeOptions(osBlockB, vlanMode) : null;
  const homingOpts = attrsB
    ? attrsA.homing.filter((h) => attrsB.homing.includes(h))
    : attrsA.homing;
  const colorOpts = attrsB
    ? attrsA.color.filter((c) => attrsB.color.includes(c))
    : attrsA.color;

  // Multi-UNI (EVPN-FXC): the VLAN-unaware/aware mode selector already implies
  // homing (unaware = single-homed, aware = multihomed all-active ESI), so
  // auto-resolve homing from the chosen mode and hide the redundant selector.
  useEffect(() => {
    if (deployment?.multiUni && homingOpts.length >= 1 && sel.homing !== homingOpts[0]) {
      setSel((p) => ({ ...p, homing: homingOpts[0] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deployment, homingOpts.join(",")]);

  const attrsComplete = roleBased
    ? true
    : Boolean(
        (sel.homing || isEtree) && (modeOpts.length === 0 || vlanMode) && (!sel.firewall || sel.color),
      );
  const steps = roleBased ? STEPS_ROLE : STEPS;
  const currentStep = steps[Math.min(step, steps.length - 1)];
  const complete = roleBased
    ? Boolean(sel.familyId && roles.length >= 2)
    : Boolean(
        sel.familyId &&
          sel.muxId &&
          sel.deploymentId &&
          sel.osA &&
          (sel.homing || isEtree) &&
          (modeOpts.length === 0 || vlanMode) &&
          (!sel.firewall || sel.color),
      );

  const selFor = (os: GenOsKey): GenSelection => ({
    familyId: sel.familyId!,
    muxId: sel.muxId!,
    deploymentId: sel.deploymentId!,
    os,
    homing: sel.homing!,
    vlanMode,
    rtPolicy,
    color: sel.color ?? "",
    cos: sel.cos,
    firewall: sel.firewall,
  });

  // PWHT batch color (uncolored / gold / bronze) → community name for the ACX
  // l2circuit + whether to pull the community-definition snip.
  const pwColor = roleBased ? sel.pwColor ?? "uncolored" : "uncolored";
  const pwColorComm =
    roleBased && pwColor !== "uncolored"
      ? family?.colorComms?.[pwColor] ?? ""
      : "";
  const qd = (rel: string[]) => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const r of rel) {
      const id = `${CATALOG.jvd}/${r}`;
      if (!seen.has(id)) {
        seen.add(id);
        out.push(id);
      }
    }
    return out;
  };

  const idsA = useMemo(
    () => {
      if (roleBased) {
        const r = roles[0];
        if (!r) return [];
        const useList = count > 1; // vlan-id-list when a PW carries >1 VLAN
        return qd([
          ...r.service,
          ...(useList && r.interfaceList ? r.interfaceList : r.interface),
          ...(pwColorComm && family?.colorCommDef ? [family.colorCommDef] : []),
          ...(sel.cos ? r.cosSnips ?? [] : []),
        ]);
      }
      if (isEtree)
        return complete && sel.osA && osBlockA
          ? resolveEtreeSnipIds(CATALOG, osBlockA, sel.osA as GenOsKey, "root", {
              rootMultihomed,
              rtPolicy,
              firewall: sel.firewall,
              color: sel.color ?? "",
              cos: sel.cos,
            })
          : [];
      return complete && sel.osA ? resolveSnipIds(CATALOG, selFor(sel.osA)) : [];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [complete, sel, roleBased, count, pwColorComm, rootMultihomed],
  );
  const idsB = useMemo(
    () => {
      if (roleBased)
        return roles[1]
          ? resolveRoleSnipIds(CATALOG, roles[1], { cos: sel.cos, firewall: false })
          : [];
      if (isEtree)
        return complete && sel.osA && osBlockB
          ? resolveEtreeSnipIds(CATALOG, osBlockB, sel.osA as GenOsKey, "leaf", {
              rootMultihomed,
              rtPolicy,
              firewall: sel.firewall,
              color: sel.color ?? "",
              cos: sel.cos,
            })
          : [];
      return complete && twoPe ? resolveSnipIds(CATALOG, selFor(sel.osB as GenOsKey)) : [];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [complete, sel, roleBased],
  );

  // Union of variables across both endpoints.
  const unionVars: SnipVariable[] = useMemo(() => {
    const seen = new Set<string>();
    const out: SnipVariable[] = [];
    for (const v of [...collectVariables(idsA, byId), ...collectVariables(idsB, byId)]) {
      if (!seen.has(v.name)) {
        seen.add(v.name);
        out.push(v);
      }
    }
    return out;
  }, [idsA, idsB, byId]);

  const sharedFields = unionVars.filter((v) => {
    const bare = v.name.replace(/^\$/, "");
    if (DERIVED_VARS.has(bare) || (roleBased && PWHT_COMPUTED.has(bare))) return false;
    // The UNI filter name is only meaningful when the firewall filter is on.
    if (bare === "FILTER_NAME" && !sel.firewall) return false;
    // EVPN-FXC drives per-UNI VLAN/unit/ESI/service-id from the entry list.
    if (multiUni && FXC_ENTRY_VARS.has(bare)) return false;
    return classifyVar(v.name, ROLES).kind === "shared";
  });
  const perFields = unionVars.filter((v) => {
    const bare = v.name.replace(/^\$/, "");
    if (DERIVED_VARS.has(bare) || (roleBased && PWHT_COMPUTED.has(bare))) return false;
    if (bare === "FILTER_NAME" && !sel.firewall) return false;
    if (multiUni && FXC_ENTRY_VARS.has(bare)) return false;
    const k = classifyVar(v.name, ROLES).kind;
    return k === "per-endpoint" || k === "mirrored-primary";
  });
  // For role-based families, each column shows only the variables its own role
  // actually uses (the access side has no PS/RD/vESI fields, etc.).
  const varsInA = useMemo(
    () => new Set(collectVariables(idsA, byId).map((v) => v.name.replace(/^\$/, ""))),
    [idsA, byId],
  );
  const varsInB = useMemo(
    () => new Set(collectVariables(idsB, byId).map((v) => v.name.replace(/^\$/, ""))),
    [idsB, byId],
  );
  const perFieldsA = asym
    ? perFields.filter((v) => varsInA.has(v.name.replace(/^\$/, "")))
    : perFields;
  const perFieldsB = asym
    ? perFields.filter((v) => varsInB.has(v.name.replace(/^\$/, "")))
    : perFields;

  const pathKey = JSON.stringify([
    sel.familyId,
    sel.muxId,
    sel.deploymentId,
    sel.osA,
    sel.osB,
    sel.homing,
    vlanMode,
    rtPolicy,
    sel.pwColor,
    rootMultihomed,
    count > 1,
    sel.color,
    sel.cos,
    sel.firewall,
  ]);
  useEffect(() => {
    const sh: Record<string, string> = {};
    const a: Record<string, string> = {};
    const b: Record<string, string> = {};
    if (asym) {
      // Asymmetric panes: each side's default comes from ITS OWN snips (access
      // AC_INTF = et-0/0/12, headend ae10; E-Tree root ae10, leaf xe-0/1/5;
      // no distinct-bump/mirror).
      const exA = new Map(
        collectVariables(idsA, byId).map((v) => [v.name.replace(/^\$/, ""), v.example]),
      );
      const exB = new Map(
        collectVariables(idsB, byId).map((v) => [v.name.replace(/^\$/, ""), v.example]),
      );
      for (const v of unionVars) {
        const bare = v.name.replace(/^\$/, "");
        if (classifyVar(v.name, ROLES).kind === "shared")
          sh[bare] = exA.get(bare) ?? exB.get(bare) ?? v.example;
        else {
          a[bare] = exA.get(bare) ?? v.example;
          b[bare] = exB.get(bare) ?? v.example;
        }
      }
    } else {
      for (const v of unionVars) {
        const bare = v.name.replace(/^\$/, "");
        const kind = classifyVar(v.name, ROLES).kind;
        if (kind === "shared") sh[bare] = v.example;
        else if (kind !== "mirrored-secondary") {
          a[bare] = v.example;
          // Only vars that MUST differ (the service-id mirror, RD) get bumped on
          // PE-B; everything else (UNI VLAN, unit, interface) defaults the same.
          const mustDiffer =
            kind === "mirrored-primary" ||
            (ROLES.distinctPerEndpoint ?? []).includes(bare);
          b[bare] = mustDiffer ? bumpB(v.example) : v.example;
        }
      }
    }
    setShared(sh);
    setPerA(a);
    setPerB(b);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathKey]);

  const names = unionVars.map((v) => v.name);
  const transportVars = useMemo(
    () => new Set(family?.transportVars ?? []),
    [family],
  );
  const baseVlan = Number(shared.VLAN) || 0;
  const fxcMode: "unaware" | "aware" =
    sel.deploymentId === "evpn-fxc-aware" ? "aware" : "unaware";
  // Entries whose VLAN-ids collide (a duplicate unit/VLAN silently merges into
  // one UNI). Used to flag the fields and block download.
  const fxcOverlap = useMemo(
    () => (multiUni ? fxcOverlapIds(fxcEntries, fxcMode) : new Set<number>()),
    [multiUni, fxcEntries, fxcMode],
  );
  // Seed the EVPN-FXC entry list with one single-VLAN UNI whenever an FXC
  // deployment is (re)selected.
  useEffect(() => {
    if (!multiUni) return;
    fxcIdRef.current = 1;
    setFxcEntries([
      { id: fxcIdRef.current++, kind: "single", vlan: "1000", range: "", svlan: "", breakout: false },
    ]);
    setAwareMap(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel.deploymentId, multiUni]);
  // Render one EVPN-FXC PE from the per-UNI entry list. PE-A renders ranges
  // collapsed (vlan-id-list); PE-B (isBreakout) can break a range into per-VLAN
  // units. Each unit renders interface + service-member (+ filter/CoS) snips;
  // the merger folds them into one instance + one port.
  const fxcRender = (os: GenOsKey, isBreakout: boolean, base: Record<string, string>) => {
    const specs = fxcUnitSpecs(fxcMode, os, isBreakout, fxcEntries, awareMap, base);
    const serviceRel =
      fxcMode === "aware"
        ? "evo/services/evpn-fxc-vlan-aware-1"
        : `${os}/services/evpn-fxc-vlan-unaware-1`;
    const bodies: string[] = [];
    const miss = new Set<string>();
    for (const spec of specs) {
      const rel = [spec.interfaceRel, serviceRel];
      if (sel.firewall) rel.push(`${os}/firewall/filter-ccc-color-blind`);
      if (sel.cos)
        rel.push(`${os}/cos/classifiers`, `${os}/cos/cos-binding-ieee8021p`, `${os}/cos/rewrite-rules`);
      const ids = rel.map((r) => `${CATALOG.jvd}/${r}`);
      const r = renderConfig(ids, { ...base, ...spec.values }, byId, {
        stripUniFilter: !sel.firewall,
        stripVrfExport: rtPolicy === "rt-only",
        derived: CATALOG.derivedVars,
      });
      bodies.push(r.text);
      r.missing.forEach((m) => miss.add(m));
    }
    return { text: bodies.join("\n"), missing: [...miss], usedSnipIds: [] };
  };
  const renderA = useMemo(() => {
    if (!complete || idsA.length === 0) return null;
    if (roleBased)
      return renderConfig(
        idsA,
        pwhtInstanceValues("access", { ...shared, ...perA }, transportVars, 0, 0, count, baseVlan, pwColorComm),
        byId,
        { stripUniFilter: !sel.firewall, stripCommunity: !pwColorComm },
      );
    const baseA = endpointValues(names, ROLES, shared, perA, perB);
    if (multiUni) return fxcRender(sel.osA as GenOsKey, false, baseA);
    return renderConfig(idsA, baseA, byId, {
      stripUniFilter: !sel.firewall,
      stripVrfExport: rtPolicy === "rt-only",
      derived: CATALOG.derivedVars,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete, idsA, shared, perA, perB, byId, roleBased, count, pwColorComm, multiUni, fxcEntries, awareMap, sel.firewall, sel.cos]);
  const renderB = useMemo(() => {
    if (!complete || !twoPe || idsB.length === 0) return null;
    if (roleBased)
      return renderConfig(
        idsB,
        pwhtInstanceValues("headend", { ...shared, ...perB }, transportVars, 0, 0, count, baseVlan, ""),
        byId,
        { stripUniFilter: !sel.firewall },
      );
    const baseB = endpointValues(names, ROLES, shared, perB, perA);
    if (multiUni) return fxcRender(sel.osB as GenOsKey, true, baseB);
    return renderConfig(idsB, baseB, byId, {
      stripUniFilter: !sel.firewall,
      stripVrfExport: rtPolicy === "rt-only",
      derived: CATALOG.derivedVars,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete, twoPe, idsB, shared, perA, perB, byId, roleBased, count, pwColorComm, multiUni, fxcEntries, awareMap, sel.firewall, sel.cos]);

  // Merged, consolidated config for display/copy (single previewed service).
  const mergedA = useMemo(
    () => (renderA ? mergeJunosConfig(renderA.text) : null),
    [renderA],
  );
  const mergedB = useMemo(
    () => (renderB ? mergeJunosConfig(renderB.text) : null),
    [renderB],
  );

  const fullText = [mergedA, mergedB].filter(Boolean).join("\n\n");
  const missing = Array.from(
    new Set([...(renderA?.missing ?? []), ...(renderB?.missing ?? [])]),
  );

  const peLabel = (os: GenOsKey | undefined, tag: string) =>
    os ? `${tag} \u00b7 ${OS_LABELS[os]}` : tag;
  // Endpoint column / section tags \u2014 role names for PWHT, per-site labels for
  // multipoint EVIs, PE-A/PE-B otherwise.
  const tagA = roleBased ? roles[0]?.label ?? "Access" : isEtree ? "Root" : multiSite ? "Site A" : "PE-A";
  const tagB = roleBased ? roles[1]?.label ?? "Headend" : isEtree ? "Leaf" : multiSite ? "Site B" : "PE-B";

  // Templated (portable) variant: the same snip set rendered with NO value
  // substitution so every $VAR stays a placeholder, prefixed with a variable
  // dictionary (name = current/example value). Downloaded as a separate file.
  const templateText = useMemo(() => {
    if (!complete) return null;
    const ids = [...idsA, ...(twoPe ? idsB : [])];
    if (ids.length === 0) return null;
    const opts = {
      stripUniFilter: !sel.firewall,
      stripVrfExport: rtPolicy === "rt-only",
    };
    const aTpl = idsA.length
      ? mergeJunosConfig(renderConfig(idsA, {}, byId, opts).text)
      : "";
    const bTpl =
      twoPe && idsB.length
        ? mergeJunosConfig(renderConfig(idsB, {}, byId, opts).text)
        : "";
    const cur = { ...shared, ...perA, ...perB } as Record<string, string>;
    const dict = collectVariables(ids, byId)
      .map((v) => {
        const bare = v.name.replace(/^\$/, "");
        const ex = cur[bare] ?? v.example ?? "";
        const pad = " ".repeat(Math.max(1, 22 - v.name.length));
        return `#   ${v.name}${pad}= ${ex}`;
      })
      .join("\n");
    const header =
      `# EVPN service template \u2014 replace each $VAR below with your values.\n` +
      `# ===== variables =====\n${dict}\n# ======================\n`;
    const body = [
      aTpl && (twoPe ? `/* ===== ${peLabel(sel.osA, tagA)} ===== */\n${aTpl}` : aTpl),
      bTpl && `/* ===== ${peLabel(sel.osB as GenOsKey, tagB)} ===== */\n${bTpl}`,
    ]
      .filter(Boolean)
      .join("\n\n");
    return `${header}\n${body}\n`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete, idsA, idsB, twoPe, byId, sel, rtPolicy, shared, perA, perB, tagA, tagB]);

  // Field-level validation: per-PE values that must differ but are identical.
  // Keyed by bare var name so the error renders inline next to that field.
  const fieldErrors: Record<string, string> = {};
  if (twoPe) {
    for (const bare of ROLES.distinctPerEndpoint ?? []) {
      if (perA[bare] !== undefined && perA[bare] === perB[bare]) {
        fieldErrors[bare] = `${varLabel(bare)} should differ per PE`;
      }
    }
    for (const [primary] of ROLES.mirrored) {
      if (perA[primary] !== undefined && perA[primary] === perB[primary]) {
        fieldErrors[primary] = `${varLabel(primary).replace(/ · local$/, "")} should be unique`;
      }
    }
  }

  // Shared-field consistency — PWHT uses anycast PW labels, so incoming and
  // outgoing must match.
  const sharedErrors: Record<string, string> = {};
  if (
    roleBased &&
    shared.PW_LABEL_IN &&
    shared.PW_LABEL_OUT &&
    shared.PW_LABEL_IN !== shared.PW_LABEL_OUT
  ) {
    sharedErrors.PW_LABEL_IN = "anycast — in/out must match";
    sharedErrors.PW_LABEL_OUT = "anycast — in/out must match";
  }
  // BGP-VPLS scaling: both the site-range and the label-block-size must be at
  // least the number of sites in the domain (sites per instance).
  if (multiSite && isVpls) {
    if (shared.SITE_RANGE && Number(shared.SITE_RANGE) < siteCount)
      sharedErrors.SITE_RANGE = `must be ≥ sites per instance (${siteCount})`;
    if (shared.LABEL_BLOCK_SIZE && Number(shared.LABEL_BLOCK_SIZE) < siteCount)
      sharedErrors.LABEL_BLOCK_SIZE = `must be ≥ sites per instance (${siteCount})`;
  }

  const advance = (patch: Partial<Selection>, clears: (keyof Selection)[]) => {
    setSel((prev) => {
      const next = { ...prev, ...patch };
      for (const k of clears) if (!(k in patch)) delete next[k];
      return next;
    });
    setStep((s) => s + 1);
  };

  const crumbValue = (id: StepId): string | null => {
    switch (id) {
      case "jvd":
        return sel.jvd ? JVDS.find((j) => j.id === sel.jvd)?.label ?? null : null;
      case "family":
        return family?.label ?? null;
      case "mux":
        return mux?.label ?? null;
      case "deployment":
        return deployment?.label ?? null;
      case "endpoints":
        return sel.osA
          ? twoPe
            ? `${OS_LABELS[sel.osA]} ↔ ${OS_LABELS[sel.osB as GenOsKey]}`
            : `${OS_LABELS[sel.osA]} (single)`
          : null;
      case "attributes":
        return attrsComplete
          ? roleBased
            ? [pwColor === "uncolored" ? "Uncolored" : `${pwColor[0].toUpperCase()}${pwColor.slice(1)}`, sel.cos ? "CoS" : "no CoS"]
                .filter(Boolean)
                .join(" · ")
            : [
              HOMING_LABELS[sel.homing!] ?? sel.homing,
              vlanMode ? modeOpts.find((m) => m.id === vlanMode)?.label : null,
              rtPolicyApplies
                ? rtPolicy === "rt-only"
                  ? "Uncolored"
                  : `${rtPolicy[0].toUpperCase()}${rtPolicy.slice(1)} policy`
                : null,
              sel.cos ? "CoS" : "no CoS",
              sel.firewall
                ? `filter (${COLOR_LABELS[sel.color!] ?? sel.color})`
                : "no filter",
            ]
              .filter(Boolean)
              .join(" · ")
          : null;
      default:
        return null;
    }
  };
  const crumbs = steps.slice(0, step).filter((id) => crumbValue(id) !== null);

  const reset = () => {
    setSel({ cos: true, firewall: true });
    setShared({});
    setPerA({});
    setPerB({});
    setCount(1);
    setSiteCount(2);
    setPwCount(1);
    setRootMultihomed(true);
    setLeafCount(2);
    setFxcEntries([]);
    setStep(0);
  };

  const fxcUpdate = (id: number, patch: Partial<FxcEntry>) =>
    setFxcEntries((es) => es.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const fxcAdd = () =>
    setFxcEntries((es) => {
      // Seed the new UNI at max(existing VLAN) + 1 so bundled UNIs don't collide
      // (identical units merge into one, which looked like "only the first UNI").
      const used = es.flatMap((e) => fxcEntryVlans(e, fxcMode));
      const next = Math.min(VLAN_MAX, (used.length ? Math.max(...used) : 999) + 1);
      return [
        ...es,
        {
          id: fxcIdRef.current++,
          kind: "single",
          vlan: String(next),
          range: "",
          svlan: "",
          breakout: false,
        },
      ];
    });
  const fxcRemove = (id: number) =>
    setFxcEntries((es) => (es.length > 1 ? es.filter((e) => e.id !== id) : es));

  const download = () => {
    if (!fullText) return;
    if (multiUni && fxcOverlap.size > 0) return;
    track(`generator-download-${sel.familyId}`);
    // E-Tree (rooted-multipoint): ONE EVI = root PE(s) + N leaf PEs. A multihomed
    // root is an all-active ESI PAIR (2 root PEs that SHARE one ESI — so the ESI
    // is constant, only the route-distinguisher differs). Leaves are single-homed;
    // `leafCount` fans them out. Every node is a separate device, merged on its
    // own; the RD bumps per node (roots from the root pane's RD, leaves from the
    // leaf pane's).
    if (isEtree) {
      const os = sel.osA as GenOsKey;
      const roots = rootMultihomed ? 2 : 1;
      const leaves = Math.max(1, Math.min(leafCount, 64));
      const rootBase = endpointValues(names, ROLES, shared, perA, perB);
      const leafBase = endpointValues(names, ROLES, shared, perB, perA);
      const sects: string[] = [];
      const opts = {
        stripUniFilter: !sel.firewall,
        stripVrfExport: rtPolicy === "rt-only",
        derived: CATALOG.derivedVars,
      };
      for (let r = 0; r < roots; r++) {
        if (!idsA.length) break;
        // Roots share the ESI (all-active pair) — bump only the RD.
        const vals = { ...rootBase, RD: bumpInt(rootBase.RD ?? "", r) };
        const body = renderConfig(idsA, vals, byId, opts).text;
        const label = roots > 1 ? `Root ${r + 1}` : "Root";
        sects.push(`/* ===== ${label} \u00b7 ${OS_LABELS[os]} ===== */\n${mergeJunosConfig(body)}`);
      }
      for (let l = 0; l < leaves; l++) {
        if (!idsB.length) break;
        const vals = { ...leafBase, RD: bumpInt(leafBase.RD ?? "", l) };
        const body = renderConfig(idsB, vals, byId, opts).text;
        const label = leaves > 1 ? `Leaf ${l + 1}` : "Leaf";
        sects.push(`/* ===== ${label} \u00b7 ${OS_LABELS[os]} ===== */\n${mergeJunosConfig(body)}`);
      }
      const text = sects.join("\n\n") + "\n";
      const fname = `maas-e-tree-evpn-etree-${roots}root-${leaves}leaf.conf`;
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fname;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    // Multipoint EVI (EVPN-ELAN / BGP-VPLS): a 2-D fan-out — `count` independent
    // instances (EVIs / VPLS domains) × `siteCount` self-contained PE sites per
    // instance. Each site is a DIFFERENT device, merged on its own (never across
    // sites). Instance-level vars (instance name, VLAN, bridge-domain, RT) bump
    // per instance; `siteVars` (route-distinguisher — unique per PE — and the
    // local ESI / VPLS site-identifier) bump per site. Within an instance, site 1
    // uses Site A (osA); when a second OS is picked, sites 2+ use Site B (osB) so
    // a mixed EVO/Junos mesh renders.
    if (multiSite) {
      const I = Math.max(1, Math.min(count, 64));
      const S = Math.max(1, Math.min(siteCount, 64));
      const siteVars = deployment?.siteVars ?? ["RD", "ESI_ID"];
      const originRD = perA.RD ?? perB.RD ?? "";
      const sects: string[] = [];
      for (let i = 0; i < I; i++) {
        const shI = instanceValues(shared, ROLES, i);
        const perAI = instanceValues(perA, ROLES, i);
        const perBI = instanceValues(perB, ROLES, i);
        for (let s = 0; s < S; s++) {
          const useB = twoPe && s >= 1;
          const ids = useB ? idsB : idsA;
          if (!ids.length) continue;
          const os = (useB ? sel.osB : sel.osA) as GenOsKey;
          const base = useB
            ? endpointValues(names, ROLES, shI, perBI, perAI)
            : endpointValues(names, ROLES, shI, perAI, perBI);
          const vals = siteInstanceValues(base, siteVars, s);
          // Guarantee a globally-unique RD across the whole instance × site grid.
          if (originRD) vals.RD = bumpInt(originRD, i * S + s);
          const body = renderConfig(ids, vals, byId, {
            stripUniFilter: !sel.firewall,
            stripVrfExport: rtPolicy === "rt-only",
            derived: CATALOG.derivedVars,
          }).text;
          const label =
            I > 1
              ? `Instance ${i + 1} \u00b7 Site ${s + 1} \u00b7 ${OS_LABELS[os]}`
              : `Site ${s + 1} \u00b7 ${OS_LABELS[os]}`;
          sects.push(`/* ===== ${label} ===== */\n${mergeJunosConfig(body)}`);
        }
      }
      const text = sects.join("\n\n") + "\n";
      const grid = I > 1 ? `-x${I}x${S}` : `-sites${S}`;
      const fname = `maas-${sel.familyId}-${sel.deploymentId}${grid}.conf`;
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fname;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    // Emit all service instances, merged into one consolidated hierarchy per
    // endpoint. Symmetric families (E-Line): a 1-D batch of `count` services.
    // PWHT: an ASYMMETRIC fan-out — the access side renders once per transport
    // PW (one l2circuit + one vlan-id-list unit), the headend renders once per
    // VLAN (transport stanzas dedupe per-PW via the merger; service stanzas are
    // per-VLAN). Two knobs: pwCount PWs × count VLANs-per-PW.
    const aBodies: string[] = [];
    const bBodies: string[] = [];
    let total = 1;
    if (roleBased) {
      const S = Math.max(1, Math.min(count, 500));
      const T = Math.max(1, Math.min(pwCount, 100));
      total = T * S;
      const accessBase = { ...shared, ...perA };
      const headendBase = { ...shared, ...perB };
      for (let t = 0; t < T; t++) {
        if (idsA.length)
          aBodies.push(
            renderConfig(
              idsA,
              pwhtInstanceValues("access", accessBase, transportVars, t, 0, S, baseVlan, pwColorComm),
              byId,
              { stripUniFilter: !sel.firewall, stripCommunity: !pwColorComm },
            ).text,
          );
        for (let s = 0; s < S; s++) {
          if (idsB.length)
            bBodies.push(
              renderConfig(
                idsB,
                pwhtInstanceValues("headend", headendBase, transportVars, t, s, S, baseVlan, ""),
                byId,
                { stripUniFilter: !sel.firewall },
              ).text,
            );
        }
      }
    } else if (multiUni) {
      // EVPN-FXC: ONE service bundling the per-UNI VLAN entry list. Render each
      // PE from its entries (PE-A collapsed, PE-B may break out ranges); the
      // merger folds them into one instance + one port.
      total = 1;
      const baseA = endpointValues(names, ROLES, shared, perA, perB);
      const baseB = endpointValues(names, ROLES, shared, perB, perA);
      if (idsA.length) aBodies.push(fxcRender(sel.osA as GenOsKey, false, baseA).text);
      if (twoPe && idsB.length) bBodies.push(fxcRender(sel.osB as GenOsKey, true, baseB).text);
    } else {
      const S = Math.max(1, Math.min(count, 500));
      total = S;
      for (let i = 0; i < S; i++) {
        const sh = instanceValues(shared, ROLES, i);
        const a = instanceValues(perA, ROLES, i);
        const b = instanceValues(perB, ROLES, i);
        if (idsA.length)
          aBodies.push(
            renderConfig(idsA, endpointValues(names, ROLES, sh, a, b), byId, {
              stripUniFilter: !sel.firewall,
              stripVrfExport: rtPolicy === "rt-only",
              derived: CATALOG.derivedVars,
            }).text,
          );
        if (twoPe && idsB.length)
          bBodies.push(
            renderConfig(idsB, endpointValues(names, ROLES, sh, b, a), byId, {
              stripUniFilter: !sel.firewall,
              stripVrfExport: rtPolicy === "rt-only",
              derived: CATALOG.derivedVars,
            }).text,
          );
      }
    }
    const sections: string[] = [];
    if (aBodies.length) {
      const merged = mergeJunosConfig(aBodies.join("\n"));
      sections.push(
        twoPe ? `/* ===== ${peLabel(sel.osA, tagA)} ===== */\n${merged}` : merged,
      );
    }
    if (bBodies.length) {
      const merged = mergeJunosConfig(bBodies.join("\n"));
      sections.push(`/* ===== ${peLabel(sel.osB as GenOsKey, tagB)} ===== */\n${merged}`);
    }
    const text = sections.join("\n\n") + "\n";
    const fname = `maas-${sel.familyId}-${sel.deploymentId ?? "pwht"}${total > 1 ? `-x${total}` : ""}.conf`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fname;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    if (!fullText) return;
    track(`generator-copy-${sel.familyId}`);
    await navigator.clipboard.writeText(fullText + "\n");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadTemplate = () => {
    if (!templateText) return;
    track(`generator-template-${sel.familyId}`);
    const blob = new Blob([templateText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `maas-${sel.familyId}-${sel.deploymentId ?? "pwht"}-template.conf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_minmax(22rem,34rem)]">
      {/* Left: the wizard */}
      <div className="rounded-lg border border-border bg-surface p-6">
        {crumbs.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-1.5 text-xs">
            {crumbs.map((id, i) => (
              <span key={id} className="flex items-center gap-1.5">
                <button
                  onClick={() => setStep(steps.indexOf(id))}
                  className="rounded-full border border-border bg-background px-2.5 py-0.5 text-muted-foreground hover:border-primary/50 hover:text-primary"
                  title={`Back to ${STEP_TITLES[id]}`}
                >
                  {crumbValue(id)}
                </button>
                {i < crumbs.length - 1 && (
                  <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                )}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-primary"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Back
              </button>
            )}
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Step {step + 1} of {steps.length} · {STEP_TITLES[currentStep]}
            </span>
          </div>
          {step > 0 && (
            <button
              onClick={reset}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
            >
              <RotateCcw className="h-3 w-3" /> Start over
            </button>
          )}
        </div>

        <div className="mt-4 space-y-3">
          {currentStep === "jvd" &&
            JVDS.map((j) => (
              <Chip
                key={j.id}
                label={j.available ? j.label : `${j.label} — coming soon`}
                sub={j.tagline}
                active={sel.jvd === j.id}
                disabled={!j.available}
                onClick={() =>
                  advance({ jvd: j.id }, [
                    "familyId",
                    "muxId",
                    "deploymentId",
                    "osA",
                    "osB",
                    "homing",
                    "color",
                  ])
                }
              />
            ))}

          {currentStep === "family" &&
            CATALOG.families.map((f) => (
              <Chip
                key={f.id}
                label={f.available ? f.label : `${f.label} — coming soon`}
                sub={`${f.tagline} · ${f.description}`}
                active={sel.familyId === f.id}
                disabled={!f.available}
                onClick={() => {
                  if (f.roleBased && f.roles) {
                    // Role-based (PWHT): fix the two role OSes, skip
                    // mux/deployment/endpoints, jump straight to attributes.
                    setSel((p) => ({
                      ...p,
                      familyId: f.id,
                      muxId: undefined,
                      deploymentId: undefined,
                      osA: f.roles![0].os,
                      osB: f.roles![1].os,
                      homing: undefined,
                      vlanMode: undefined,
                      rtPolicy: undefined,
                      pwColor: "uncolored",
                      color: undefined,
                      firewall: false,
                      cos: true,
                    }));
                    setStep((s) => s + 1);
                  } else {
                    advance({ familyId: f.id }, [
                      "muxId",
                      "deploymentId",
                      "osA",
                      "osB",
                      "homing",
                      "color",
                    ]);
                  }
                }}
              />
            ))}

          {currentStep === "mux" &&
            family?.multiplexing.map((m) => (
              <Chip
                key={m.id}
                label={m.label}
                sub={m.description}
                active={sel.muxId === m.id}
                onClick={() =>
                  advance({ muxId: m.id }, [
                    "deploymentId",
                    "osA",
                    "osB",
                    "homing",
                    "color",
                  ])
                }
              />
            ))}

          {currentStep === "deployment" &&
            mux?.deployments.map((d) => {
              const dAvailable = d.available !== false;
              return (
                <Chip
                  key={d.id}
                  label={dAvailable ? d.label : `${d.label} — coming soon`}
                  sub={d.description}
                  active={sel.deploymentId === d.id}
                  disabled={!dAvailable}
                  onClick={() =>
                    advance({ deploymentId: d.id }, ["osA", "osB", "homing", "color"])
                  }
                />
              );
            })}

          {currentStep === "endpoints" && (
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-xs font-medium text-foreground">
                  PE-A (device OS)
                </div>
                <div className="space-y-2">
                  {(["junos", "evo"] as GenOsKey[]).map((os) => (
                    <Chip
                      key={os}
                      label={OS_LABELS[os]}
                      sub={osOptions.includes(os) ? undefined : "not validated for this service"}
                      active={sel.osA === os}
                      disabled={!osOptions.includes(os)}
                      onClick={() => setSel((p) => ({ ...p, osA: os }))}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 text-xs font-medium text-foreground">
                  PE-B (far endpoint)
                </div>
                <div className="space-y-2">
                  <Chip
                    label="Single device only"
                    sub="Generate just PE-A (brownfield add)"
                    active={sel.osB === "none"}
                    onClick={() => setSel((p) => ({ ...p, osB: "none" }))}
                  />
                  {(["junos", "evo"] as GenOsKey[]).map((os) => (
                    <Chip
                      key={os}
                      label={OS_LABELS[os]}
                      sub={osOptions.includes(os) ? "Match identifiers automatically" : "not validated for this service"}
                      active={sel.osB === os}
                      disabled={!osOptions.includes(os)}
                      onClick={() => setSel((p) => ({ ...p, osB: os }))}
                    />
                  ))}
                </div>
              </div>
              <button
                disabled={!sel.osA || !sel.osB}
                onClick={() => setStep((s) => s + 1)}
                className={[
                  "inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium",
                  sel.osA && sel.osB
                    ? "border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                    : "cursor-not-allowed border border-border text-muted-foreground opacity-60",
                ].join(" ")}
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {currentStep === "attributes" && roleBased && (
            <div className="space-y-4">
              <div className="rounded-md border border-border bg-background p-3 text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground">
                  {roles[0]?.label} ↔ {roles[1]?.label}
                </span>
                <br />
                Two fixed roles — one config each (the headend applies to both
                anycast MX). UNI firewall filter is deferred for PWHT.
              </div>
              <div>
                <div className="mb-2 text-xs font-medium text-foreground">
                  Class of Service
                </div>
                <div className="space-y-2">
                  <Chip
                    label="With CoS"
                    sub="Classifiers, IEEE 802.1p + MPLS binding, rewrite rules"
                    active={sel.cos}
                    onClick={() => setSel((p) => ({ ...p, cos: true }))}
                  />
                  <Chip
                    label="Without CoS"
                    sub="Skip class-of-service"
                    active={!sel.cos}
                    onClick={() => setSel((p) => ({ ...p, cos: false }))}
                  />
                </div>
              </div>
              {family?.colorComms && (
                <div>
                  <div className="mb-2 text-xs font-medium text-foreground">
                    Transport color{" "}
                    <span className="font-normal text-muted-foreground">
                      — one per batch
                    </span>
                  </div>
                  <div className="space-y-2">
                    {PWHT_COLORS.map((c) => (
                      <Chip
                        key={c}
                        label={PWHT_COLOR_LABELS[c]}
                        sub={
                          c === "uncolored"
                            ? "No community on the l2circuit"
                            : `community ${family.colorComms![c]} on each PW`
                        }
                        active={pwColor === c}
                        onClick={() => setSel((p) => ({ ...p, pwColor: c }))}
                      />
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={() => setStep((s) => s + 1)}
                className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
              >
                Continue to parameters <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {currentStep === "attributes" && !roleBased && osBlockA && (
            <div className="space-y-4">
              {!multiUni && !isEtree && (
                <div>
                  <div className="mb-2 text-xs font-medium text-foreground">Homing</div>
                  <div className="space-y-2">
                    {homingOpts.map((h) => (
                      <Chip
                        key={h}
                        label={HOMING_LABELS[h] ?? h}
                        active={sel.homing === h}
                        onClick={() => setSel((p) => ({ ...p, homing: h }))}
                      />
                    ))}
                  </div>
                </div>
              )}
              {isEtree && (
                <div>
                  <div className="mb-2 text-xs font-medium text-foreground">Root redundancy</div>
                  <div className="space-y-2">
                    <Chip
                      label="Multihomed root"
                      sub="Two root PEs sharing one all-active ESI"
                      active={rootMultihomed}
                      onClick={() => setRootMultihomed(true)}
                    />
                    <Chip
                      label="Single-homed root"
                      sub="One root PE (no ESI)"
                      active={!rootMultihomed}
                      onClick={() => setRootMultihomed(false)}
                    />
                  </div>
                </div>
              )}
              {modeOpts.length > 0 && (
                <div>
                  <div className="mb-2 text-xs font-medium text-foreground">
                    VLAN handling
                  </div>
                  <div className="space-y-2">
                    {modeOpts.map((m) => (
                      <Chip
                        key={m.id}
                        label={m.label}
                        sub={m.description}
                        active={vlanMode === m.id}
                        onClick={() => setSel((p) => ({ ...p, vlanMode: m.id }))}
                      />
                    ))}
                  </div>
                </div>
              )}
              {rtPolicyApplies && (
                <div>
                  <div className="mb-2 text-xs font-medium text-foreground">
                    VRF route-export
                  </div>
                  <div className="space-y-2">
                    <Chip
                      label="Uncolored (route-target only)"
                      sub="vrf-target only — no color community (best-effort)"
                      active={rtPolicy === "rt-only"}
                      onClick={() => setSel((p) => ({ ...p, rtPolicy: "rt-only" }))}
                    />
                    <Chip
                      label="Color community"
                      sub="Export policy adds a traffic-class color community (+ RT)"
                      active={rtPolicy !== "rt-only"}
                      onClick={() =>
                        setSel((p) => ({ ...p, rtPolicy: colorPolOpts[0] }))
                      }
                    />
                    {rtPolicy !== "rt-only" && (
                      <select
                        value={rtPolicy}
                        onChange={(e) =>
                          setSel((p) => ({ ...p, rtPolicy: e.target.value }))
                        }
                        className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:border-primary/60 focus:outline-none"
                      >
                        {colorPolOpts.map((c) => (
                          <option key={c} value={c}>
                            {COLOR_POLICY_LABELS[c] ?? c}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              )}
              <div>
                <div className="mb-2 text-xs font-medium text-foreground">
                  Class of Service
                </div>
                <div className="space-y-2">
                  <Chip
                    label="With CoS"
                    sub="Classifiers, IEEE 802.1p binding + rewrite rules"
                    active={sel.cos}
                    onClick={() => setSel((p) => ({ ...p, cos: true }))}
                  />
                  <Chip
                    label="Without CoS"
                    sub="Skip class-of-service"
                    active={!sel.cos}
                    onClick={() => setSel((p) => ({ ...p, cos: false }))}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 text-xs font-medium text-foreground">
                  UNI firewall filter
                </div>
                <div className="space-y-2">
                  <Chip
                    label="With filter"
                    sub="Bandwidth-profile policer at the customer UNI"
                    active={sel.firewall}
                    onClick={() => setSel((p) => ({ ...p, firewall: true }))}
                  />
                  <Chip
                    label="Without filter"
                    sub="No UNI policer"
                    active={!sel.firewall}
                    onClick={() => setSel((p) => ({ ...p, firewall: false, color: undefined }))}
                  />
                </div>
              </div>
              {sel.firewall && (
                <div>
                  <div className="mb-2 text-xs font-medium text-foreground">Color mode</div>
                  <div className="space-y-2">
                    {colorOpts.map((c) => (
                      <Chip
                        key={c}
                        label={COLOR_LABELS[c] ?? c}
                        active={sel.color === c}
                        onClick={() => setSel((p) => ({ ...p, color: c }))}
                      />
                    ))}
                  </div>
                </div>
              )}
              <button
                disabled={!attrsComplete}
                onClick={() => setStep((s) => s + 1)}
                className={[
                  "mt-2 inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium",
                  attrsComplete
                    ? "border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                    : "cursor-not-allowed border border-border text-muted-foreground opacity-60",
                ].join(" ")}
              >
                Continue to parameters <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {currentStep === "params" && (
            <div className="space-y-5">
              {roleBased ? (
                <div className="rounded-md border border-border bg-background p-3">
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 text-xs font-medium text-foreground">
                      Transport PWs
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={pwCount}
                        onChange={(e) =>
                          setPwCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))
                        }
                        className="h-8 w-16 rounded-md border border-border bg-surface px-2 font-mono text-sm text-foreground focus:border-primary/60 focus:outline-none"
                      />
                    </label>
                    <span className="text-muted-foreground">×</span>
                    <label className="flex items-center gap-2 text-xs font-medium text-foreground">
                      VLANs / PW
                      <input
                        type="number"
                        min={1}
                        max={500}
                        value={count}
                        onChange={(e) =>
                          setCount(Math.max(1, Math.min(500, Number(e.target.value) || 1)))
                        }
                        className="h-8 w-16 rounded-md border border-border bg-surface px-2 font-mono text-sm text-foreground focus:border-primary/60 focus:outline-none"
                      />
                    </label>
                    <span className="text-[11px] font-medium text-primary">
                      = {pwCount * count} EVPN-ELAN{pwCount * count > 1 ? "s" : ""}
                    </span>
                  </div>
                  <span className="mt-2 block text-[11px] text-muted-foreground">
                    Values below are the starting service. Each PW gets its own
                    PS interface, VC-ID and PW labels; VLANs increment globally
                    ({count > 1 ? "vlan-id-list per PW" : "one vlan-id per PW"}).
                    The download includes all {pwCount * count}.
                  </span>
                </div>
              ) : multiUni ? (
                <div className="space-y-3 rounded-md border border-border bg-background p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">
                      VLAN UNIs
                      <span className="ml-1 font-normal text-muted-foreground">
                        {fxcMode === "aware"
                          ? "— each an attachment circuit in the instance"
                          : "— bundled into one FXC group"}
                      </span>
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {fxcEntries.length} entr{fxcEntries.length === 1 ? "y" : "ies"}
                    </span>
                  </div>
                  {fxcMode === "aware" && (
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: false, label: "Matching VLAN" },
                        { id: true, label: "VLAN-map (S-VLAN push)" },
                      ].map((o) => (
                        <button
                          key={String(o.id)}
                          onClick={() => setAwareMap(o.id)}
                          className={[
                            "rounded-md border px-2.5 py-1 text-[11px]",
                            awareMap === o.id
                              ? "border-primary/40 bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:bg-surface",
                          ].join(" ")}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="space-y-2">
                    {fxcEntries.map((e) => {
                      const vlanErr =
                        fxcEntryVlanError(e, fxcMode, awareMap) ??
                        (fxcOverlap.has(e.id)
                          ? "duplicate VLAN-id — each UNI must be unique"
                          : undefined);
                      return (
                      <div
                        key={e.id}
                        className={[
                          "flex flex-wrap items-center gap-2 rounded border bg-surface p-2",
                          vlanErr ? "border-red-500/50" : "border-border/60",
                        ].join(" ")}
                      >
                        {fxcMode === "unaware" && (
                          <div className="flex overflow-hidden rounded-md border border-border">
                            {(["single", "range"] as const).map((k) => (
                              <button
                                key={k}
                                onClick={() => fxcUpdate(e.id, { kind: k })}
                                className={[
                                  "px-2 py-1 text-[11px] capitalize",
                                  e.kind === k
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-background",
                                ].join(" ")}
                              >
                                {k}
                              </button>
                            ))}
                          </div>
                        )}
                        {fxcMode === "aware" || e.kind === "single" ? (
                          <input
                            value={e.vlan}
                            onChange={(ev) => fxcUpdate(e.id, { vlan: ev.target.value })}
                            placeholder="VLAN-id"
                            className="h-8 w-24 rounded-md border border-border bg-background px-2 font-mono text-sm text-foreground focus:border-primary/60 focus:outline-none"
                          />
                        ) : (
                          <input
                            value={e.range}
                            onChange={(ev) => fxcUpdate(e.id, { range: ev.target.value })}
                            placeholder="800-809"
                            className="h-8 w-28 rounded-md border border-border bg-background px-2 font-mono text-sm text-foreground focus:border-primary/60 focus:outline-none"
                          />
                        )}
                        {((fxcMode === "aware" && awareMap) ||
                          (fxcMode === "unaware" && e.kind === "range")) && (
                          <input
                            value={e.svlan}
                            onChange={(ev) => fxcUpdate(e.id, { svlan: ev.target.value })}
                            placeholder={fxcMode === "aware" ? "S-VLAN" : "push S-VLAN (opt)"}
                            className="h-8 w-32 rounded-md border border-border bg-background px-2 font-mono text-sm text-foreground focus:border-primary/60 focus:outline-none"
                          />
                        )}
                        {fxcMode === "unaware" && e.kind === "range" && (
                          <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <input
                              type="checkbox"
                              checked={e.breakout}
                              onChange={(ev) => fxcUpdate(e.id, { breakout: ev.target.checked })}
                              className="h-3.5 w-3.5 accent-primary"
                            />
                            break out on far PE
                          </label>
                        )}
                        <button
                          onClick={() => fxcRemove(e.id)}
                          disabled={fxcEntries.length <= 1}
                          className="ml-auto text-muted-foreground hover:text-foreground disabled:opacity-30"
                          title="Remove UNI"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {vlanErr && (
                          <span className="w-full text-[10px] font-semibold text-red-600 dark:text-red-400">
                            {vlanErr}
                          </span>
                        )}
                      </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={fxcAdd}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs text-foreground hover:bg-surface"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add {fxcMode === "aware" ? "VLAN" : "UNI"}
                  </button>
                  <span className="block text-[11px] text-muted-foreground">
                    {fxcMode === "unaware"
                      ? "Single = one vlan-id; Range = vlan-id-list (add a push S-VLAN for QinQ). \u201cBreak out on far PE\u201d expands the range into per-VLAN units on PE-B."
                      : awareMap
                        ? "Each VLAN is a multihomed AC with input/output vlan-map to its S-VLAN; ESI + vpws-service-id increment per UNI."
                        : "Each VLAN is a multihomed AC matched end-to-end (no vlan-map); ESI + vpws-service-id increment per UNI."}
                  </span>
                </div>
              ) : isEtree ? (
                <div className="space-y-2 rounded-md border border-border bg-background p-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="text-xs font-medium text-foreground">
                      Number of leaves
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={64}
                      value={leafCount}
                      onChange={(e) =>
                        setLeafCount(Math.max(1, Math.min(64, Number(e.target.value) || 1)))
                      }
                      className="h-8 w-20 rounded-md border border-border bg-surface px-2 font-mono text-sm text-foreground focus:border-primary/60 focus:outline-none"
                    />
                    <span className="text-[11px] font-medium text-primary">
                      {rootMultihomed ? 2 : 1} root{rootMultihomed ? "s" : ""} + {leafCount} lea
                      {leafCount === 1 ? "f" : "ves"}
                    </span>
                  </div>
                  <span className="block text-[11px] text-muted-foreground">
                    One EVPN E-Tree EVI. The preview shows a Root PE + a Leaf PE;
                    the download emits {rootMultihomed ? "both roots (all-active ESI pair)" : "the root"}{" "}
                    plus every leaf, each its own PE section with a unique
                    route-distinguisher.
                  </span>
                </div>
              ) : multiSite ? (
                <div className="space-y-2 rounded-md border border-border bg-background p-3">
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 text-xs font-medium text-foreground">
                      {isVpls ? "VPLS instances" : "Instances (EVIs)"}
                      <input
                        type="number"
                        min={1}
                        max={64}
                        value={count}
                        onChange={(e) =>
                          setCount(Math.max(1, Math.min(64, Number(e.target.value) || 1)))
                        }
                        className="h-8 w-16 rounded-md border border-border bg-surface px-2 font-mono text-sm text-foreground focus:border-primary/60 focus:outline-none"
                      />
                    </label>
                    <span className="text-muted-foreground">×</span>
                    <label className="flex items-center gap-2 text-xs font-medium text-foreground">
                      Sites / instance
                      <input
                        type="number"
                        min={1}
                        max={64}
                        value={siteCount}
                        onChange={(e) =>
                          setSiteCount(Math.max(1, Math.min(64, Number(e.target.value) || 1)))
                        }
                        className="h-8 w-16 rounded-md border border-border bg-surface px-2 font-mono text-sm text-foreground focus:border-primary/60 focus:outline-none"
                      />
                    </label>
                    <span className="text-[11px] font-medium text-primary">
                      = {count * siteCount} PE config{count * siteCount > 1 ? "s" : ""}
                    </span>
                  </div>
                  <span className="block text-[11px] text-muted-foreground">
                    The preview shows two representative PEs of instance 1. The
                    download emits each instance × site as an independent PE
                    section (unique route-distinguisher per PE
                    {count > 1
                      ? "; instance name, VLAN, bridge-domain + route-target increment per instance"
                      : ""}
                    ).
                  </span>
                  {isVpls && (
                    <span className="block text-[11px] text-muted-foreground">
                      For VPLS, <span className="font-mono">site-range</span> and{" "}
                      <span className="font-mono">label-block-size</span> must be ≥
                      sites per instance ({siteCount}).
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3 rounded-md border border-border bg-background p-3">
                  <label className="text-xs font-medium text-foreground">
                    Number of services
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={count}
                    onChange={(e) =>
                      setCount(Math.max(1, Math.min(500, Number(e.target.value) || 1)))
                    }
                    className="h-8 w-20 rounded-md border border-border bg-surface px-2 font-mono text-sm text-foreground focus:border-primary/60 focus:outline-none"
                  />
                  <span className="text-[11px] text-muted-foreground">
                    {count > 1
                      ? `The values below are service #1. Services #2–${count} increment automatically; the download includes all ${count}.`
                      : "The values below are your service. Increase the count to generate a numbered batch."}
                  </span>
                </div>
              )}

              {sharedFields.length > 0 && (
                <div>
                  <div className="mb-2 text-xs font-medium text-foreground">
                    Shared{" "}
                    <span className="font-normal text-muted-foreground">
                      {roleBased ? "— common to both roles" : "— identical on both PEs"}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {sharedFields.map((v) => {
                      const bare = v.name.replace(/^\$/, "");
                      return (
                        <VarField
                          key={v.name}
                          name={v.name}
                          hint={fieldHint(bare)}
                          error={formatError(bare, shared[bare]) ?? sharedErrors[bare]}
                          value={shared[bare]}
                          onChange={(val) => setShared((p) => ({ ...p, [bare]: val }))}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <div className="mb-2 text-xs font-medium text-foreground">
                    {peLabel(sel.osA, tagA)}
                  </div>
                  <div className="space-y-3">
                    {perFieldsA.map((v) => {
                      const bare = v.name.replace(/^\$/, "");
                      const mirror = classifyVar(v.name, ROLES).kind === "mirrored-primary";
                      return (
                        <VarField
                          key={v.name}
                          name={v.name}
                          hint={mirror ? "(far-end remote auto-set)" : fieldHint(bare)}
                          error={formatError(bare, perA[bare]) ?? fieldErrors[bare]}
                          value={perA[bare]}
                          onChange={(val) => setPerA((p) => ({ ...p, [bare]: val }))}
                        />
                      );
                    })}
                  </div>
                </div>
                {twoPe && (
                  <div>
                    <div className="mb-2 text-xs font-medium text-foreground">
                      {peLabel((isEtree ? sel.osA : sel.osB) as GenOsKey, tagB)}
                    </div>
                    <div className="space-y-3">
                      {perFieldsB.map((v) => {
                        const bare = v.name.replace(/^\$/, "");
                        const mirror =
                          classifyVar(v.name, ROLES).kind === "mirrored-primary";
                        return (
                          <VarField
                            key={v.name}
                            name={v.name}
                              hint={mirror ? "(far-end remote auto-set)" : fieldHint(bare)}
                            error={formatError(bare, perB[bare]) ?? fieldErrors[bare]}
                            value={perB[bare]}
                            onChange={(val) => setPerB((p) => ({ ...p, [bare]: val }))}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: output */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Generated config
            </span>
            {fullText && (
              <div className="flex gap-2">
                <button
                  onClick={copy}
                  className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-primary"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={download}
                  disabled={multiUni && fxcOverlap.size > 0}
                  title={
                    multiUni && fxcOverlap.size > 0
                      ? "Resolve duplicate UNI VLAN-ids before downloading"
                      : undefined
                  }
                  className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Download className="h-3 w-3" /> .conf
                </button>
                {templateText && (
                  <button
                    onClick={downloadTemplate}
                    title="Download a $VAR template + variable dictionary"
                    className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-primary"
                  >
                    <Download className="h-3 w-3" /> template
                  </button>
                )}
              </div>
            )}
          </div>

          {!complete ? (
            <div className="mt-4 flex flex-col items-center justify-center rounded-md border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
              <Cpu className="mb-2 h-6 w-6 text-muted-foreground/60" />
              Work through the steps and the validated config appears here.
            </div>
          ) : (
            <>
              {missing.length > 0 && (
                <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-[11px] text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>Unfilled variables: {missing.join(", ")}.</span>
                </div>
              )}
              {renderA && (
                <div className="mt-3">
                  <div className="mb-1 text-[11px] font-semibold text-primary">
                    # {peLabel(sel.osA, tagA)}
                  </div>
                  <pre className="max-h-[24rem] overflow-auto rounded-md border border-border bg-background p-3 text-[11px] leading-relaxed text-foreground">
                    {mergedA}
                  </pre>
                </div>
              )}
              {renderB && (
                <div className="mt-4">
                  <div className="mb-1 text-[11px] font-semibold text-primary">
                    # {peLabel((isEtree ? sel.osA : sel.osB) as GenOsKey, tagB)}
                  </div>
                  <pre className="max-h-[24rem] overflow-auto rounded-md border border-border bg-background p-3 text-[11px] leading-relaxed text-foreground">
                    {mergedB}
                  </pre>
                </div>
              )}
              <div className="mt-2 text-[11px] text-muted-foreground">
                {count > 1 || (roleBased && pwCount > 1)
                  ? `Previewing service 1${roleBased && pwCount > 1 ? " (PW 1)" : ""} · `
                  : ""}
                {roleBased
                  ? `${tagA} + ${tagB}`
                  : twoPe
                    ? "2 endpoints · matched identifiers"
                    : "single device"}{" "}
                ·{" "}
                {[sel.cos && "CoS", sel.firewall && "firewall filter"]
                  .filter(Boolean)
                  .join(" + ") || "service only"}{" "}
                · rendered client-side from the JVD snip library
              </div>
              {roleBased && pwCount * count > 1 && (
                <div className="mt-1 text-[11px] font-medium text-primary">
                  Download includes all {pwCount * count} EVPN-ELANs ({pwCount}{" "}
                  transport PW{pwCount > 1 ? "s" : ""} × {count} service
                  {count > 1 ? "s" : ""}).
                </div>
              )}
              {!roleBased && count > 1 && (
                <div className="mt-1 text-[11px] font-medium text-primary">
                  Download includes all {count} services (#2–{count} auto-incremented).
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
