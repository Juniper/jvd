import { useEffect, useMemo, useState } from "react";
import {
  Cpu,
  Download,
  Copy,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { snipBundle, type SnipRecord, type SnipVariable } from "@/lib/snips";
import maasCatalog from "@/data/generator/metro_as_a_service.json";
import {
  type GenCatalog,
  type GenOsKey,
  type GenSelection,
  type VarSpec,
  resolveOsBlock,
  resolveSnipIds,
  resolveRoleSnipIds,
  attributeOptions,
  vlanModes,
  collectVariables,
  renderConfig,
  mergeJunosConfig,
  classifyVar,
  endpointValues,
  instanceValues,
  gridInstanceValues,
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
  INPUT_VID: "normalized S-VLAN (push)",
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
  color?: string;
  cos: boolean;
  firewall: boolean;
};

/** Bump a trailing integer so PE-B defaults differ from PE-A. */
function bumpB(example: string): string {
  const m = example.match(/^(.*?)(\d+)$/);
  return m ? m[1] + String(parseInt(m[2], 10) + 1) : example;
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
  const [pwCount, setPwCount] = useState(1);

  const family = CATALOG.families.find((f) => f.id === sel.familyId);
  const mux = family?.multiplexing.find((m) => m.id === sel.muxId);
  const deployment = mux?.deployments.find((d) => d.id === sel.deploymentId);
  const osOptions = deployment ? (Object.keys(deployment.os) as GenOsKey[]) : [];

  // Role-based families (PWHT) render one config per fixed role (Access /
  // Headend) instead of the symmetric PE-A / PE-B model.
  const roleBased = !!family?.roleBased;
  const roles = family?.roles ?? [];

  const twoPe = sel.osB && sel.osB !== "none";

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
          os: sel.osB as GenOsKey,
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

  const attrsComplete = roleBased
    ? true
    : Boolean(
        sel.homing && (modeOpts.length === 0 || vlanMode) && (!sel.firewall || sel.color),
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
          sel.homing &&
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

  const idsA = useMemo(
    () => {
      if (roleBased)
        return roles[0]
          ? resolveRoleSnipIds(CATALOG, roles[0], { cos: sel.cos, firewall: false })
          : [];
      return complete && sel.osA ? resolveSnipIds(CATALOG, selFor(sel.osA)) : [];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [complete, sel, roleBased],
  );
  const idsB = useMemo(
    () => {
      if (roleBased)
        return roles[1]
          ? resolveRoleSnipIds(CATALOG, roles[1], { cos: sel.cos, firewall: false })
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

  const sharedFields = unionVars.filter(
    (v) =>
      !DERIVED_VARS.has(v.name.replace(/^\$/, "")) &&
      classifyVar(v.name, ROLES).kind === "shared",
  );
  const perFields = unionVars.filter((v) => {
    if (DERIVED_VARS.has(v.name.replace(/^\$/, ""))) return false;
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
  const perFieldsA = roleBased
    ? perFields.filter((v) => varsInA.has(v.name.replace(/^\$/, "")))
    : perFields;
  const perFieldsB = roleBased
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
    sel.color,
    sel.cos,
    sel.firewall,
  ]);
  useEffect(() => {
    const sh: Record<string, string> = {};
    const a: Record<string, string> = {};
    const b: Record<string, string> = {};
    if (roleBased) {
      // Asymmetric roles: each side's default comes from ITS OWN snips (access
      // AC_INTF = et-0/0/12, headend AC_INTF = ae10; no distinct-bump/mirror).
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
  const renderA = useMemo(() => {
    if (!complete || idsA.length === 0) return null;
    return renderConfig(idsA, endpointValues(names, ROLES, shared, perA, perB), byId, {
      stripUniFilter: !sel.firewall,
      stripVrfExport: rtPolicy === "rt-only",
      derived: CATALOG.derivedVars,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete, idsA, shared, perA, perB, byId]);
  const renderB = useMemo(() => {
    if (!complete || !twoPe || idsB.length === 0) return null;
    return renderConfig(idsB, endpointValues(names, ROLES, shared, perB, perA), byId, {
      stripUniFilter: !sel.firewall,
      stripVrfExport: rtPolicy === "rt-only",
      derived: CATALOG.derivedVars,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete, twoPe, idsB, shared, perA, perB, byId]);

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
            ? sel.cos
              ? "CoS"
              : "no CoS"
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
    setPwCount(1);
    setStep(0);
  };

  const download = () => {
    if (!fullText) return;
    // Emit all service instances, merged into one consolidated hierarchy per
    // endpoint. Symmetric families: a 1-D batch of `count` services. Role-based
    // (PWHT): a 2-D grid of `pwCount` transport PWs × `count` services each —
    // transport vars bump per PW, service vars bump globally so every EVPN-ELAN
    // stays unique.
    const S = roleBased ? 1 : Math.max(1, Math.min(count, 500));
    const T = 1;
    const transportVars = family?.transportVars ?? [];
    const shift = (m: Record<string, string>, t: number, i: number) =>
      roleBased
        ? gridInstanceValues(m, ROLES, transportVars, t, i)
        : instanceValues(m, ROLES, i);
    const aBodies: string[] = [];
    const bBodies: string[] = [];
    for (let t = 0; t < T; t++) {
      for (let s = 0; s < S; s++) {
        const i = t * S + s;
        const sh = shift(shared, t, i);
        const a = shift(perA, t, i);
        const b = shift(perB, t, i);
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
    const total = T * S;
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
    await navigator.clipboard.writeText(fullText + "\n");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const peLabel = (os: GenOsKey | undefined, tag: string) =>
    os ? `${tag} · ${OS_LABELS[os]}` : tag;
  // Endpoint column / section tags — role names for PWHT, PE-A/PE-B otherwise.
  const tagA = roleBased ? roles[0]?.label ?? "Access" : "PE-A";
  const tagB = roleBased ? roles[1]?.label ?? "Headend" : "PE-B";

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
                <div className="rounded-md border border-border bg-background p-3 text-[11px] text-muted-foreground">
                  Generating a single service (one transport PW, one VLAN).
                  Multi-PW batch generation (N transport PWs ×
                  VLANs-per-PW with vlan-id-list + color) is coming next.
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
                      {peLabel(sel.osB as GenOsKey, tagB)}
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
                  className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                >
                  <Download className="h-3 w-3" /> .conf
                </button>
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
                    # {peLabel(sel.osB as GenOsKey, tagB)}
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
