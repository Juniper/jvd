import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Github,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Layers,
  X,
  FileCode,
} from "lucide-react";
import {
  snipBundle,
  matchesQuery,
  buildTree,
  REPO_BLOB_BASE,
  titleize,
  type SnipRecord,
  type BrowseMode,
  type GroupNode,
} from "@/lib/snips";
import { BROWSE_MODES } from "@/lib/snips";

// ---------------------------------------------------------------------------
// URL state — single source of truth for shareable links.
// Hash format:  #snips?mode=tech&q=bgp&os=evo&jvd=bbe&id=...
// ---------------------------------------------------------------------------

type UrlState = {
  mode: BrowseMode;
  q: string;
  osKey: "" | "junos" | "evo";
  jvd: string;
  id: string;
};

function parseHash(): UrlState {
  const h = typeof window !== "undefined" ? window.location.hash : "";
  const qIdx = h.indexOf("?");
  const params = new URLSearchParams(qIdx >= 0 ? h.slice(qIdx + 1) : "");
  const mode = (params.get("mode") as BrowseMode) || "jvd";
  return {
    mode: ["jvd", "tech", "usecase"].includes(mode) ? mode : "jvd",
    q: params.get("q") || "",
    osKey: (params.get("os") as UrlState["osKey"]) || "",
    jvd: params.get("jvd") || "",
    id: params.get("id") || "",
  };
}

function writeHash(state: UrlState) {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams();
  if (state.mode !== "jvd") params.set("mode", state.mode);
  if (state.q) params.set("q", state.q);
  if (state.osKey) params.set("os", state.osKey);
  if (state.jvd) params.set("jvd", state.jvd);
  if (state.id) params.set("id", state.id);
  const qs = params.toString();

  const currentHash = window.location.hash || "";
  const inSnipSection = currentHash.startsWith("#snips");

  // Don't hijack the URL: only write a #snips hash when the user is already
  // viewing the Snip Library section (or has snip-specific state worth
  // persisting, like a selected snip or active filters). Otherwise leave
  // whatever hash the rest of the page is using (#home, #catalog, etc.) alone.
  if (!inSnipSection && !qs) return;

  const next = qs ? `#snips?${qs}` : "#snips";
  if (currentHash !== next) {
    window.history.replaceState(null, "", next);
  }
}

// ---------------------------------------------------------------------------
// Small UI atoms
// ---------------------------------------------------------------------------

function Pill({
  children,
  tone = "muted",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "muted" | "primary" | "outline";
  className?: string;
}) {
  const styles =
    tone === "primary"
      ? "border-primary/30 bg-primary/10 text-primary"
      : tone === "outline"
        ? "border-border bg-transparent text-muted-foreground"
        : "border-transparent bg-surface-2 text-foreground/80";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${styles} ${className}`}
    >
      {children}
    </span>
  );
}

function ModeToggle({ value, onChange }: { value: BrowseMode; onChange: (v: BrowseMode) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-surface p-1 text-xs">
      {BROWSE_MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={
            "rounded-md px-3 py-1.5 font-medium transition-colors " +
            (value === m.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground")
          }
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

function OsFilter({
  value,
  onChange,
}: {
  value: UrlState["osKey"];
  onChange: (v: UrlState["osKey"]) => void;
}) {
  const items: { id: UrlState["osKey"]; label: string }[] = [
    { id: "", label: "All OS" },
    { id: "junos", label: "Junos" },
    { id: "evo", label: "Junos EVO" },
  ];
  return (
    <div className="inline-flex rounded-lg border border-border bg-surface p-1 text-xs">
      {items.map((i) => (
        <button
          key={i.id || "all"}
          onClick={() => onChange(i.id)}
          className={
            "rounded-md px-2.5 py-1.5 font-medium transition-colors " +
            (value === i.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground")
          }
        >
          {i.label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Accordion tree (recursive)
// ---------------------------------------------------------------------------

function TreeNode({
  node,
  depth,
  expanded,
  toggle,
  selectedId,
  onSelectSnip,
  visibleIds,
  snipById,
}: {
  node: GroupNode;
  depth: number;
  expanded: Set<string>;
  toggle: (id: string) => void;
  selectedId: string;
  onSelectSnip: (id: string) => void;
  visibleIds: Set<string>;
  snipById: Map<string, SnipRecord>;
}) {
  // Filter the tree against visibleIds (a snip-id allow-list from the search/OS filter)
  const visibleSnipIds = node.snipIds?.filter((id) => visibleIds.has(id)) ?? [];
  const visibleChildren =
    node.children?.map((c) => ({
      child: c,
      visibleCount: visibleCountOf(c, visibleIds),
    })) ?? [];
  const visibleCount =
    visibleSnipIds.length + visibleChildren.reduce((n, c) => n + c.visibleCount, 0);
  if (visibleCount === 0) return null;

  const isOpen = expanded.has(node.id);
  const isLeafGroup = !!node.snipIds;

  const padding = { paddingLeft: `${0.5 + depth * 0.75}rem` };

  return (
    <div>
      <button
        onClick={() => toggle(node.id)}
        className={
          "group flex w-full items-center gap-2 rounded-md py-1.5 pr-3 text-left text-sm transition-colors hover:bg-surface-2 " +
          (depth === 0 ? "font-semibold text-foreground" : "font-medium text-foreground/90")
        }
        style={padding}
      >
        {isOpen ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        )}
        <span className="flex-1 truncate">{node.label}</span>
        <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          {visibleCount}
        </span>
      </button>

      {isOpen && (
        <div>
          {visibleChildren.map(
            ({ child, visibleCount: vc }) =>
              vc > 0 && (
                <TreeNode
                  key={child.id}
                  node={child}
                  depth={depth + 1}
                  expanded={expanded}
                  toggle={toggle}
                  selectedId={selectedId}
                  onSelectSnip={onSelectSnip}
                  visibleIds={visibleIds}
                  snipById={snipById}
                />
              ),
          )}
          {isLeafGroup &&
            visibleSnipIds.map((id) => {
              const s = snipById.get(id);
              if (!s) return null;
              const active = id === selectedId;
              return (
                <button
                  key={id}
                  onClick={() => onSelectSnip(id)}
                  className={
                    "flex w-full items-start gap-2 rounded-md py-1.5 pr-3 text-left text-xs transition-colors " +
                    (active
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-surface-2 hover:text-foreground")
                  }
                  style={{ paddingLeft: `${0.5 + (depth + 1) * 0.75 + 0.875}rem` }}
                >
                  <FileCode
                    className={
                      "mt-0.5 h-3 w-3 shrink-0 " + (active ? "text-primary" : "text-muted-foreground/60")
                    }
                  />
                  <span className="flex-1">
                    <span className="block truncate font-mono text-[11px] text-foreground/90">
                      {s.name}
                    </span>
                    <span className="block truncate text-[10px] text-muted-foreground">
                      {s.topic || "—"}
                    </span>
                  </span>
                  <span
                    className={
                      "mt-0.5 rounded px-1 py-0.5 text-[9px] font-semibold " +
                      (s.osKey === "evo"
                        ? "bg-primary/15 text-primary"
                        : "bg-surface-2 text-muted-foreground")
                    }
                  >
                    {s.osKey === "evo" ? "EVO" : "Junos"}
                  </span>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}

function visibleCountOf(node: GroupNode, visible: Set<string>): number {
  let n = 0;
  if (node.snipIds) for (const id of node.snipIds) if (visible.has(id)) n++;
  if (node.children) for (const c of node.children) n += visibleCountOf(c, visible);
  return n;
}

function collectGroupIds(nodes: GroupNode[], out: string[] = []): string[] {
  for (const n of nodes) {
    out.push(n.id);
    if (n.children) collectGroupIds(n.children, out);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Detail pane
// ---------------------------------------------------------------------------

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* ignore */
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:border-primary/60 hover:text-primary"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" /> Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" /> Copy
        </>
      )}
    </button>
  );
}

function SnipDetail({
  snip,
  onSelectSnip,
  snipById,
}: {
  snip: SnipRecord;
  onSelectSnip: (id: string) => void;
  snipById: Map<string, SnipRecord>;
}) {
  const githubUrl = REPO_BLOB_BASE + snip.path;
  const copyText =
    `/* Source: ${snip.path} @ Juniper/jvd */\n` +
    `/* JVD: ${snip.jvdLabel}  |  OS: ${snip.os}  |  Category: ${titleize(snip.category)} */\n\n` +
    snip.body;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-5">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="primary">{snip.jvdLabel}</Pill>
          <Pill tone="outline">{snip.os}</Pill>
          <Pill>{titleize(snip.category)}</Pill>
          <Pill>{snip.subfamily}</Pill>
        </div>
        <h2 className="mt-3 text-xl font-semibold leading-snug tracking-tight">
          {snip.topic || snip.name}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="font-mono">{snip.path}</span>
          <span>·</span>
          <span>
            {snip.lineCount} lines · {(snip.bytes / 1024).toFixed(1)} KB
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <CopyButton text={copyText} />
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:border-primary/60 hover:text-primary"
          >
            <Github className="h-3.5 w-3.5" /> View on GitHub <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {(snip.seenOn.junos.length > 0 || snip.seenOn.evo.length > 0) && (
          <Section title="Seen on">
            {snip.seenOn.junos.length > 0 && (
              <div className="mb-2">
                <span className="mr-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Junos
                </span>
                {snip.seenOn.junos.map((d) => (
                  <code
                    key={d}
                    className="mr-1 inline-block rounded bg-surface-2 px-1.5 py-0.5 text-[11px] font-mono text-foreground/85"
                  >
                    {d}
                  </code>
                ))}
              </div>
            )}
            {snip.seenOn.evo.length > 0 && (
              <div>
                <span className="mr-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  EVO
                </span>
                {snip.seenOn.evo.map((d) => (
                  <code
                    key={d}
                    className="mr-1 inline-block rounded bg-surface-2 px-1.5 py-0.5 text-[11px] font-mono text-foreground/85"
                  >
                    {d}
                  </code>
                ))}
              </div>
            )}
          </Section>
        )}

        {snip.highlights.length > 0 && (
          <Section title="Highlights">
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-foreground/85">
              {snip.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </Section>
        )}

        {snip.pairWith.length > 0 && (
          <Section title="Pair with">
            <ul className="space-y-1 text-sm">
              {snip.pairWith.map((p, i) => {
                const target = p.id ? snipById.get(p.id) : null;
                if (target) {
                  return (
                    <li key={i}>
                      <button
                        onClick={() => onSelectSnip(target.id)}
                        className="text-left text-primary hover:underline"
                      >
                        {target.name}
                        <span className="ml-2 text-[11px] text-muted-foreground">
                          {titleize(target.category)} · {target.os}
                        </span>
                      </button>
                    </li>
                  );
                }
                return (
                  <li key={i} className="text-muted-foreground">
                    <code className="font-mono text-[12px]">{p.raw}</code>
                  </li>
                );
              })}
            </ul>
          </Section>
        )}

        {snip.jvdServiceMapping && snip.jvdServiceMapping.length > 0 && (
          <Section title="JVD service mapping">
            <pre className="overflow-x-auto whitespace-pre rounded-md border border-border bg-surface px-3 py-2 font-mono text-xs leading-relaxed text-foreground/85">
{snip.jvdServiceMapping.join("\n")}
            </pre>
          </Section>
        )}

        {snip.variables.length > 0 && (
          <Section title="Variables">
            <div className="overflow-hidden rounded-md border border-border">
              <table className="w-full text-xs">
                <tbody>
                  {snip.variables.map((v, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-b-0 odd:bg-surface even:bg-background"
                    >
                      <td className="w-1/3 px-3 py-1.5 font-mono text-foreground">{v.name}</td>
                      <td className="px-3 py-1.5 font-mono text-muted-foreground">{v.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        <Section title="Configuration">
          <div className="snip-body overflow-x-auto rounded-md border border-border">
            <div dangerouslySetInnerHTML={{ __html: snip.bodyHtml }} />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default function SnipLibrary() {
  const allSnips = snipBundle.snips;
  const snipById = useMemo(() => new Map(allSnips.map((s) => [s.id, s])), [allSnips]);

  const [hashState, setHashState] = useState<UrlState>(() =>
    typeof window !== "undefined" ? parseHash() : { mode: "jvd", q: "", osKey: "", jvd: "", id: "" },
  );

  const [mode, setMode] = useState<BrowseMode>(hashState.mode);
  const [query, setQuery] = useState<string>(hashState.q);
  const [osKey, setOsKey] = useState<UrlState["osKey"]>(hashState.osKey);
  const [jvdF, setJvdF] = useState<string>(hashState.jvd);
  const [selectedId, setSelectedId] = useState<string>(hashState.id);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Listen to hashchange (back button etc.)
  useEffect(() => {
    const handler = () => {
      const next = parseHash();
      setHashState(next);
      setMode(next.mode);
      setQuery(next.q);
      setOsKey(next.osKey);
      setJvdF(next.jvd);
      setSelectedId(next.id);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  // Persist state to URL when relevant bits change
  useEffect(() => {
    writeHash({ mode, q: query, osKey, jvd: jvdF, id: selectedId });
  }, [mode, query, osKey, jvdF, selectedId]);

  // Filter snips → visibleIds
  const visibleSnips = useMemo(
    () =>
      allSnips.filter((s) => {
        if (osKey && s.osKey !== osKey) return false;
        if (jvdF && s.jvd !== jvdF) return false;
        if (!matchesQuery(s, query)) return false;
        return true;
      }),
    [allSnips, osKey, jvdF, query],
  );
  const visibleIds = useMemo(() => new Set(visibleSnips.map((s) => s.id)), [visibleSnips]);

  const tree = useMemo(() => buildTree(allSnips, mode), [allSnips, mode]);

  // Auto-expand: top level always; if a single top group, also expand its children
  useEffect(() => {
    setExpanded((prev) => {
      const next = new Set(prev);
      // First time on this mode? Open top level by default.
      const topIds = tree.map((n) => n.id);
      if (topIds.every((id) => !prev.has(id)) && topIds.length <= 4) {
        for (const id of topIds) next.add(id);
      }
      return next;
    });
  }, [tree]);

  // Auto-expand the path to the selected snip so it's visible
  useEffect(() => {
    if (!selectedId) return;
    const path = findPathToSnip(tree, selectedId);
    if (!path.length) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      for (const id of path) next.add(id);
      return next;
    });
  }, [selectedId, tree]);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const expandAll = () => setExpanded(new Set(collectGroupIds(tree)));
  const collapseAll = () => setExpanded(new Set());

  const selectedSnip = selectedId ? snipById.get(selectedId) : null;

  return (
    <section id="snips" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <h2 className="text-3xl font-semibold tracking-tight">Snip Library</h2>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Browse {snipBundle.counts.total} reusable configuration snips extracted from{" "}
              {snipBundle.counts.jvds} JVD libraries — Junos and Junos EVO. Each snip carries its
              source provenance, variable glossary, and pair-with references back to GitHub.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {visibleSnips.length} of {snipBundle.counts.total}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ModeToggle value={mode} onChange={setMode} />
          <OsFilter value={osKey} onChange={setOsKey} />
          <div className="relative min-w-[16rem] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topic, variable, body…"
              className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/60 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="flex gap-2 text-xs">
            <button
              onClick={expandAll}
              className="rounded-md border border-border bg-surface px-2.5 py-1.5 font-medium text-muted-foreground hover:text-foreground"
            >
              Expand all
            </button>
            <button
              onClick={collapseAll}
              className="rounded-md border border-border bg-surface px-2.5 py-1.5 font-medium text-muted-foreground hover:text-foreground"
            >
              Collapse all
            </button>
          </div>
        </div>

        {/* Active filter chips (jvd) */}
        {jvdF && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Filtered to JVD:</span>
            <button
              onClick={() => setJvdF("")}
              className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-primary hover:border-primary/60"
            >
              {snipById.get(visibleSnips[0]?.id)?.jvdLabel ?? jvdF}
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Two-pane layout */}
        <div className="mt-8 grid min-h-[36rem] grid-cols-1 gap-6 lg:grid-cols-[minmax(20rem,24rem)_1fr]">
          {/* Left: tree */}
          <div className="rounded-lg border border-border bg-surface/40 p-3">
            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
              {tree.length === 0 ? (
                <div className="px-2 py-8 text-center text-sm text-muted-foreground">
                  No snips loaded.
                </div>
              ) : (
                tree.map((n) => (
                  <TreeNode
                    key={n.id}
                    node={n}
                    depth={0}
                    expanded={expanded}
                    toggle={toggle}
                    selectedId={selectedId}
                    onSelectSnip={setSelectedId}
                    visibleIds={visibleIds}
                    snipById={snipById}
                  />
                ))
              )}
              {visibleSnips.length === 0 && (
                <div className="mt-4 rounded-md border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                  No snips match your filters.
                </div>
              )}
            </div>
          </div>

          {/* Right: detail */}
          <div className="rounded-lg border border-border bg-surface/40">
            {selectedSnip ? (
              <SnipDetail
                snip={selectedSnip}
                onSelectSnip={setSelectedId}
                snipById={snipById}
              />
            ) : (
              <div className="flex h-full min-h-[28rem] flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                <FileCode className="h-10 w-10 text-muted-foreground/50" />
                <div>
                  <p className="text-sm font-medium text-foreground">Pick a snip to view</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Browse by{" "}
                    <span className="font-medium text-foreground/80">
                      {BROWSE_MODES.find((m) => m.id === mode)?.label}
                    </span>{" "}
                    on the left, or switch browse mode above.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function findPathToSnip(tree: GroupNode[], snipId: string, trail: string[] = []): string[] {
  for (const n of tree) {
    const here = [...trail, n.id];
    if (n.snipIds?.includes(snipId)) return here;
    if (n.children) {
      const sub = findPathToSnip(n.children, snipId, here);
      if (sub.length) return sub;
    }
  }
  return [];
}
