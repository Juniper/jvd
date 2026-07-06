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
import { snipBundle, type SnipRecord } from "@/lib/snips";
import maasCatalog from "@/data/generator/metro_as_a_service.json";
import {
  type GenCatalog,
  type GenOsKey,
  resolveOsBlock,
  resolveSnipIds,
  attributeOptions,
  collectVariables,
  renderConfig,
} from "@/lib/generator";

const CATALOG = maasCatalog as unknown as GenCatalog;

/** JVDs available in the generator. Only MaaS has a catalog today. */
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

type StepId =
  | "jvd"
  | "family"
  | "mux"
  | "deployment"
  | "os"
  | "attributes"
  | "params";

const STEP_TITLES: Record<StepId, string> = {
  jvd: "Choose a JVD",
  family: "Service type",
  mux: "Service profile",
  deployment: "Deployment",
  os: "Device OS",
  attributes: "Service attributes",
  params: "Parameters",
};

const STEPS: StepId[] = [
  "jvd",
  "family",
  "mux",
  "deployment",
  "os",
  "attributes",
  "params",
];

type Selection = {
  jvd?: string;
  familyId?: string;
  muxId?: string;
  deploymentId?: string;
  os?: GenOsKey;
  homing?: string;
  color?: string;
  cos: boolean;
};

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

export default function ConfigGenerator() {
  const byId = useMemo(() => {
    const m = new Map<string, SnipRecord>();
    for (const s of snipBundle.snips) m.set(s.id, s);
    return m;
  }, []);

  const [sel, setSel] = useState<Selection>({ cos: true });
  const [vars, setVars] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(0);

  const family = CATALOG.families.find((f) => f.id === sel.familyId);
  const mux = family?.multiplexing.find((m) => m.id === sel.muxId);
  const deployment = mux?.deployments.find((d) => d.id === sel.deploymentId);
  const osOptions = deployment ? (Object.keys(deployment.os) as GenOsKey[]) : [];
  const osBlock =
    sel.familyId && sel.muxId && sel.deploymentId && sel.os
      ? resolveOsBlock(CATALOG, {
          familyId: sel.familyId,
          muxId: sel.muxId,
          deploymentId: sel.deploymentId,
          os: sel.os,
        })
      : null;
  const attrs = osBlock ? attributeOptions(osBlock) : { homing: [], color: [] };

  const attrsComplete = Boolean(sel.homing && (!sel.cos || sel.color));
  const currentStep = STEPS[Math.min(step, STEPS.length - 1)];

  const complete = Boolean(
    sel.familyId &&
      sel.muxId &&
      sel.deploymentId &&
      sel.os &&
      sel.homing &&
      (!sel.cos || sel.color),
  );

  const resolvedIds = useMemo(() => {
    if (!complete) return [];
    return resolveSnipIds(CATALOG, {
      familyId: sel.familyId!,
      muxId: sel.muxId!,
      deploymentId: sel.deploymentId!,
      os: sel.os!,
      homing: sel.homing!,
      color: sel.color ?? "",
      cos: sel.cos,
    });
  }, [complete, sel]);

  const variables = useMemo(
    () => collectVariables(resolvedIds, byId),
    [resolvedIds, byId],
  );

  const pathKey = JSON.stringify([
    sel.familyId,
    sel.muxId,
    sel.deploymentId,
    sel.os,
    sel.homing,
    sel.color,
    sel.cos,
  ]);
  useEffect(() => {
    const seed: Record<string, string> = {};
    for (const v of variables) seed[v.name] = v.example;
    setVars(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathKey]);

  const render = useMemo(() => {
    if (!complete || resolvedIds.length === 0) return null;
    return renderConfig(resolvedIds, vars, byId);
  }, [complete, resolvedIds, vars, byId]);

  // Update selection, clearing downstream fields, then advance one step.
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
      case "os":
        return sel.os ? OS_LABELS[sel.os] : null;
      case "attributes":
        return attrsComplete
          ? [
              HOMING_LABELS[sel.homing!] ?? sel.homing,
              sel.cos
                ? `With CoS · ${COLOR_LABELS[sel.color!] ?? sel.color}`
                : "Service only",
            ].join(" · ")
          : null;
      default:
        return null;
    }
  };

  const crumbs = STEPS.slice(0, step).filter((id) => crumbValue(id) !== null);

  const reset = () => {
    setSel({ cos: true });
    setVars({});
    setStep(0);
  };

  const download = () => {
    if (!render) return;
    const fname = `maas-${sel.familyId}-${sel.deploymentId}-${sel.os}.conf`;
    const blob = new Blob([render.text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fname;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    if (!render) return;
    await navigator.clipboard.writeText(render.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_minmax(22rem,32rem)]">
      {/* Left: the wizard (one step at a time) */}
      <div className="rounded-lg border border-border bg-surface p-6">
        {/* Breadcrumb of prior choices */}
        {crumbs.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-1.5 text-xs">
            {crumbs.map((id, i) => (
              <span key={id} className="flex items-center gap-1.5">
                <button
                  onClick={() => setStep(STEPS.indexOf(id))}
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

        {/* Header: back + step counter + start over */}
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
              Step {step + 1} of {STEPS.length} · {STEP_TITLES[currentStep]}
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

        {/* Current step body */}
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
                    "os",
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
                onClick={() =>
                  advance({ familyId: f.id }, [
                    "muxId",
                    "deploymentId",
                    "os",
                    "homing",
                    "color",
                  ])
                }
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
                  advance({ muxId: m.id }, ["deploymentId", "os", "homing", "color"])
                }
              />
            ))}

          {currentStep === "deployment" &&
            mux?.deployments.map((d) => (
              <Chip
                key={d.id}
                label={d.label}
                sub={d.description}
                active={sel.deploymentId === d.id}
                onClick={() => advance({ deploymentId: d.id }, ["os", "homing", "color"])}
              />
            ))}

          {currentStep === "os" &&
            (["junos", "evo"] as GenOsKey[]).map((os) => (
              <Chip
                key={os}
                label={OS_LABELS[os]}
                sub={
                  osOptions.includes(os)
                    ? os === "evo"
                      ? "ACX 7xxx"
                      : "MX, ACX 5xxx / 710"
                    : "not validated for this service"
                }
                active={sel.os === os}
                disabled={!osOptions.includes(os)}
                onClick={() => advance({ os }, ["homing", "color"])}
              />
            ))}

          {currentStep === "attributes" && osBlock && (
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-xs font-medium text-foreground">Homing</div>
                <div className="space-y-2">
                  {attrs.homing.map((h) => (
                    <Chip
                      key={h}
                      label={HOMING_LABELS[h] ?? h}
                      active={sel.homing === h}
                      onClick={() => setSel((p) => ({ ...p, homing: h }))}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs font-medium text-foreground">
                  Class of Service
                </div>
                <div className="space-y-2">
                  <Chip
                    label="With CoS"
                    sub="Classifiers, scheduler binding + UNI firewall filter"
                    active={sel.cos}
                    onClick={() => setSel((p) => ({ ...p, cos: true }))}
                  />
                  <Chip
                    label="Service only"
                    sub="Routing-instance + interface (minimum)"
                    active={!sel.cos}
                    onClick={() => setSel((p) => ({ ...p, cos: false, color: undefined }))}
                  />
                </div>
              </div>

              {sel.cos && (
                <div>
                  <div className="mb-2 text-xs font-medium text-foreground">Color mode</div>
                  <div className="space-y-2">
                    {attrs.color.map((c) => (
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
            <div>
              {variables.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No variables for this selection — the config on the right is ready.
                </p>
              ) : (
                <>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Prefilled with lab-safe example values — edit any field for your
                    deployment. The config updates live on the right.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {variables.map((v) => (
                      <label key={v.name} className="block">
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {v.name}
                        </span>
                        <input
                          value={vars[v.name] ?? ""}
                          onChange={(e) =>
                            setVars((p) => ({ ...p, [v.name]: e.target.value }))
                          }
                          className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 font-mono text-sm text-foreground focus:border-primary/60 focus:outline-none"
                        />
                      </label>
                    ))}
                  </div>
                </>
              )}
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
            {render && (
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
              {render && render.missing.length > 0 && (
                <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-[11px] text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>Unfilled variables: {render.missing.join(", ")}.</span>
                </div>
              )}
              <pre className="mt-3 max-h-[32rem] overflow-auto rounded-md border border-border bg-background p-3 text-[11px] leading-relaxed text-foreground">
                {render?.text}
              </pre>
              <div className="mt-2 text-[11px] text-muted-foreground">
                {resolvedIds.length} snip{resolvedIds.length === 1 ? "" : "s"} ·{" "}
                {sel.cos ? "with-cos" : "minimum"} tier · rendered client-side from the
                JVD snip library
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
