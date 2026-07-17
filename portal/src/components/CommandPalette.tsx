import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Network, FileCode, Cpu, Tag, CornerDownLeft, ArrowRight } from "lucide-react";
import {
  searchAll,
  groupHits,
  hitHref,
  didYouMean,
  starterTerms,
  countSnipMatches,
  type SearchHit,
  type ResultKind,
} from "@/lib/search";
import { track } from "@/lib/analytics";

const KIND_ICON: Record<ResultKind, typeof Search> = {
  jvd: Network,
  snip: FileCode,
  tech: Cpu,
  usecase: Tag,
};

const GROUP_LABEL: Record<ResultKind, string> = {
  jvd: "Validated Designs",
  snip: "Config Snips",
  tech: "Technologies",
  usecase: "Use Cases",
};

type Props = {
  open: boolean;
  onClose: () => void;
  /** JVD picked — parent scrolls to the catalog and pre-filters to it. */
  onPickJvd: (hit: SearchHit) => void;
};

export default function CommandPalette({ open, onClose, onPickJvd }: Props) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Reset + focus when opened.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      track("search-open");
      // focus after paint
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const starters = useMemo(() => starterTerms(), []);
  const grouped = useMemo(() => groupHits(searchAll(query)), [query]);
  const snipTotal = useMemo(() => countSnipMatches(query), [query]);
  const suggestions = useMemo(
    () => (query.trim() && grouped.total === 0 ? didYouMean(query) : []),
    [query, grouped.total],
  );

  // Flat, ordered list of selectable hits (for keyboard nav).
  const flat = useMemo<SearchHit[]>(
    () => [...grouped.jvds, ...grouped.snips, ...grouped.techs, ...grouped.usecases],
    [grouped],
  );

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  const go = (hit: SearchHit) => {
    track(`search-open-${hit.kind}`);
    if (hit.kind === "jvd") {
      onPickJvd(hit);
    } else {
      window.location.hash = hitHref(hit);
    }
    onClose();
  };

  // "See all N snips" → open the Config Explorer filtered by this query.
  const seeAllSnips = () => {
    track("search-see-all-snips");
    window.location.hash = `#snips?q=${encodeURIComponent(query.trim())}`;
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, Math.max(0, flat.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = flat[active];
      if (hit) go(hit);
    }
  };

  // Keep the active row scrolled into view.
  const setRow = (el: HTMLButtonElement | null, isActive: boolean) => {
    if (isActive && el) el.scrollIntoView({ block: "nearest" });
  };

  let rowIndex = -1;
  const renderGroup = (kind: ResultKind, hits: SearchHit[]) => {
    if (hits.length === 0) return null;
    const Icon = KIND_ICON[kind];
    return (
      <div key={kind} className="py-1">
        <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {GROUP_LABEL[kind]}
        </div>
        {hits.map((hit) => {
          rowIndex += 1;
          const idx = rowIndex;
          const isActive = idx === active;
          return (
            <button
              key={hit.key}
              ref={(el) => setRow(el, isActive)}
              type="button"
              onClick={() => go(hit)}
              onMouseEnter={() => setActive(idx)}
              className={
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors " +
                (isActive ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-surface-2")
              }
            >
              <Icon className={"h-4 w-4 shrink-0 " + (isActive ? "text-primary" : "text-muted-foreground")} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  <Highlight text={hit.title} query={query} />
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  <Highlight text={hit.subtitle} query={query} />
                </span>
              </span>
              {isActive && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-primary" />}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 p-4 pt-[10vh] backdrop-blur-sm"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search the portal"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search designs, snips, technologies…"
            aria-label="Search designs, snips, technologies"
            className="h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="p-2">
              <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Try searching
              </div>
              <div className="flex flex-wrap gap-2 px-3 py-2">
                {starters.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/60"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="px-3 pt-2 text-[11px] text-muted-foreground">
                Search across {GROUP_LABEL.jvd.toLowerCase()}, {GROUP_LABEL.snip.toLowerCase()},{" "}
                {GROUP_LABEL.tech.toLowerCase()}, and {GROUP_LABEL.usecase.toLowerCase()}.
              </div>
            </div>
          ) : grouped.total === 0 ? (
            <div className="px-3 py-8 text-center text-xs text-muted-foreground">
              No matches for “{query}”.
              {suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <span>Did you mean</span>
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        track("search-did-you-mean");
                        setQuery(s);
                      }}
                      className="rounded-md border border-border bg-surface px-2 py-0.5 font-medium text-primary transition-colors hover:border-primary/60"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {renderGroup("jvd", grouped.jvds)}
              {renderGroup("snip", grouped.snips)}
              {snipTotal > grouped.snips.length && (
                <button
                  type="button"
                  onClick={seeAllSnips}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium text-primary transition-colors hover:bg-surface-2"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                  See all {snipTotal} config snips in the Explorer
                </button>
              )}
              {renderGroup("tech", grouped.techs)}
              {renderGroup("usecase", grouped.usecases)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Bold the matched query terms within a result label (plain text, no HTML
// injection — parts are rendered as React children).
function Highlight({ text, query }: { text: string; query: string }) {
  const ts = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!ts.length) return <>{text}</>;
  const esc = ts
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length);
  const re = new RegExp(`(${esc.join("|")})`, "ig");
  const set = new Set(ts);
  return (
    <>
      {text.split(re).map((p, i) =>
        set.has(p.toLowerCase()) ? (
          <mark key={i} className="rounded-sm bg-primary/20 text-foreground">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}
