import { useEffect, useMemo, useState } from "react";
import jvds from "@/data/jvds.json";
import { ArrowRight, Github, ExternalLink, Network, Layers, Info, Search, Sparkles, Wrench, PlugZap, Bell, type LucideIcon } from "lucide-react";
import brandLogo from "@/assets/hpe-juniper-networking.avif";
import SnipLibrary from "@/components/SnipLibrary";
import ByoaiSection from "@/components/ByoaiSection";
import ConfigGenerator from "@/components/ConfigGenerator";
import CommandPalette from "@/components/CommandPalette";
import { CatalogCarousel } from "@/components/CatalogCarousel";
import { snipBundle } from "@/lib/snips";
import { track } from "@/lib/analytics";
import { searchJvdIds, didYouMean, type SearchHit } from "@/lib/search";

type Jvd = {
  id: string;
  name: string;
  area: string;
  description: string;
  platforms: string[];
  os: string[];
  repoPath: string;
};

const AREAS = ["Data Center", "Enterprise WAN", "Optical", "Security", "Service Provider", "Automation"];

const AREA_DOC_LINKS: Record<string, string> = {
  "Data Center": "https://www.juniper.net/documentation/validated-designs/us/en/data-center/",
  "Enterprise WAN": "https://www.juniper.net/documentation/validated-designs/us/en/enterprise-wan/",
  "Optical": "https://www.juniper.net/documentation/validated-designs/us/en/service-provider-edge/",
  "Security": "https://www.juniper.net/documentation/validated-designs/us/en/security/",
  "Service Provider": "https://www.juniper.net/documentation/validated-designs/us/en/service-provider-edge/",
  "Automation": "https://www.juniper.net/documentation/validated-designs/",
};
const PLATFORMS = ["MX", "QFX", "PTX", "ACX", "SRX", "EX"];
const OS_OPTIONS = ["Junos", "Junos EVO"];
const NAV = [
  { label: "Home", href: "#home" },
  { label: "Catalog", href: "#catalog" },
  { label: "Explorer", href: "#snips" },
  { label: "Design", href: "#byoai" },
  { label: "Generator", href: "#generator" },
  { label: "Deploy", href: "#mcp" },
  { label: "Why JVDs", href: "#about" },
];

// True when focus is in a text field, so the "/" shortcut doesn't hijack typing.
function isTypingTarget(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

// The site as a journey: Discover → Explore → Design → Build. Each rung links
// to its section so the four tools read as stages, not competing alternatives.
const LADDER = [
  {
    stage: "Discover",
    title: "JVD Catalog",
    desc: "Find the validated architecture that fits your requirements.",
    href: "#catalog",
    cta: "Discover JVDs",
  },
  {
    stage: "Explore",
    title: "Config Explorer",
    desc: "Explore reusable config building blocks traced to their source JVDs.",
    href: "#snips",
    cta: "Explore Configs",
  },
  {
    stage: "Learn & Design",
    title: "JVD AI Assistant",
    desc: "Explore architecture and design with AI grounded in complete JVD content.",
    href: "#byoai",
    cta: "Start Designing",
  },
  {
    stage: "Build",
    title: "Config Generator",
    desc: "Create deterministic configuration from validated JVD building blocks.",
    href: "#generator",
    cta: "Build Something",
  },
  {
    stage: "Deploy",
    title: "JVD MCP Server",
    desc: "Bring validated JVD knowledge and configuration into AI automation.",
    href: "#mcp",
    comingSoon: true,
    cta: "Deploy It!",
  },
];

const SNIP_JVD_IDS = new Set(snipBundle.jvds.map((j) => j.id));
// Which onward steps each JVD supports, so the catalog can show live pills.
const BYOAI_JVD_IDS = new Set((snipBundle.byoaiJvds ?? []).map((b) => b.jvd));
const BUILD_JVD_IDS = new Set(["metro_as_a_service"]);
type StepPill = { href: string; label: string; Icon: LucideIcon };

const REPO_BASE = "https://github.com/Juniper/jvd/tree/main/";

const MARQUEE_TAGS = [
  "EVPN-VXLAN","Apstra","3-Stage Clos","RoCEv2","BGP-CT","EVPN-VPWS","Cloud Metro","MX",
  "AI & HPC","Flex-Algo","Floating Pseudowire","5-Stage Clos","MEF 3.0","Low Latency",
  "SR-MPLS","BNG","Connected Security","QFX","Super Spine","GPU Backend","Inter-domain",
  "EVPN-ELAN","Metro Fabric","CSDS","DCI","Multitenancy","TI-LFA","O-RAN","Port Fan-Out",
  "PTX","IPoDWDM","SRv6 µSID","Telemetry","5G xHaul","Anycast-SID","Scale-Out IPsec",
  "L3VPN","sFlow","Traffic Engineering","ACX","400G","EVPN-ETREE","Junos EVO",
  "Collapsed Fabric","High Availability","VPLS","MACSEC","GPUaaS","YANG","AI Fabric",
  "CGNAT","Rail-Optimized","800G","Scale-Out NAT","SRX","Junos",
];

function familyOf(p: string): string {
  return p.replace(/[\s-]?\d.*$/, "").trim();
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors " +
        (active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-surface text-muted-foreground border-border hover:border-primary/60 hover:text-foreground")
      }
    >
      {label}
    </button>
  );
}

function MarqueeTag({ label }: { label: string }) {
  return (
    <span className="mx-1.5 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      {label}
    </span>
  );
}

// Decorative animated network mesh for the hero right side (pure SVG + CSS).
function HeroNetwork() {
  const nodes: [number, number][] = [
    [80, 90], [210, 60], [360, 120], [140, 210], [280, 230],
    [420, 260], [90, 340], [230, 370], [380, 400], [320, 320],
  ];
  const links: [number, number][] = [
    [0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5],
    [3, 6], [4, 7], [5, 8], [6, 7], [7, 9], [9, 8], [4, 9], [2, 4],
  ];
  const accent = new Set([1, 4, 8]);
  return (
    <svg viewBox="0 0 500 500" fill="none" className="h-full w-full">
      <g className="hero-net text-primary">
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a][0]} y1={nodes[a][1]}
            x2={nodes[b][0]} y2={nodes[b][1]}
            stroke="currentColor"
            strokeWidth={1.2}
            strokeOpacity={0.3}
          />
        ))}
        {nodes.map(([x, y], i) => (
          <g key={i}>
            {accent.has(i) && (
              <>
                <circle cx={x} cy={y} r={16} fill="currentColor" opacity={0.08} />
                <circle
                  cx={x} cy={y} r={10}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity={0.4}
                  className="hero-ping"
                  style={{ animationDelay: `${i * 0.6}s` }}
                />
              </>
            )}
            <circle
              cx={x} cy={y} r={accent.has(i) ? 5.5 : 3}
              fill="currentColor"
              className="hero-node"
              style={{ animationDelay: `${(i % 5) * 0.7}s` }}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

function JvdCard({ j, className = "" }: { j: Jvd; className?: string }) {
  const families = Array.from(new Set(j.platforms.map(familyOf))).filter(Boolean);
  const steps: StepPill[] = [];
  if (SNIP_JVD_IDS.has(j.id))
    steps.push({ href: `#snips?jvd=${j.id}`, label: "Learn", Icon: Layers });
  if (BYOAI_JVD_IDS.has(j.id))
    steps.push({ href: `#byoai?jvd=${j.id}`, label: "Design", Icon: Sparkles });
  if (BUILD_JVD_IDS.has(j.id))
    steps.push({ href: `#generator?jvd=${j.id}`, label: "Build", Icon: Wrench });
  return (
    <article
      className={
        "premium-card lift group flex flex-col rounded-xl border border-border bg-surface p-6 " +
        className
      }
    >
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
          {j.area}
        </span>
        {steps.length > 0 && (
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {steps.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                title={`${label} this JVD`}
              >
                <Icon className="h-3 w-3" /> {label}
              </a>
            ))}
          </div>
        )}
      </div>
      <h3 className="mt-4 text-base font-semibold leading-snug">{j.name}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
        {j.description || "Reference architecture and validated configuration."}
      </p>
      {(families.length > 0 || j.os.length > 0) && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {families.map((p) => (
            <span
              key={p}
              className="rounded border border-transparent bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-foreground/80"
            >
              {p}
            </span>
          ))}
          {j.os.map((o) => (
            <span
              key={o}
              className="rounded border border-border bg-transparent px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {o}
            </span>
          ))}
        </div>
      )}
      <div className="mt-6 flex-1" />
      <div className="grid grid-cols-2 gap-2">
        <a
          href={`${REPO_BASE}${j.repoPath}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("jvd-github")}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium transition-colors group-hover:border-primary/60 hover:text-primary"
          title="View this JVD's configs on GitHub"
        >
          <Github className="h-3.5 w-3.5" /> GitHub
        </a>
        <a
          href={AREA_DOC_LINKS[j.area] ?? "https://www.juniper.net/documentation/validated-designs/"}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("jvd-juniper")}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium transition-colors group-hover:border-primary/60 hover:text-primary"
          title={`Browse ${j.area} JVDs on juniper.net`}
        >
          JVD Docs <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}

export default function JvdPortal() {
  const data = jvds as Jvd[];
  const [areaF, setAreaF] = useState<string | null>(null);
  const [platformF, setPlatformF] = useState<string | null>(null);
  const [osF, setOsF] = useState<string | null>(null);
  const [queryF, setQueryF] = useState("");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Global shortcut: ⌘K / Ctrl+K toggles search; "/" opens it (unless typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === "/" && !isTypingTarget(e.target)) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Scrollspy: highlight the nav entry for whichever section owns the viewport.
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.href.slice(1))).filter(
      (el): el is HTMLElement => !!el,
    );
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top) setActiveSection(top.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // A JVD chosen from the palette: clear filters, pre-fill the catalog search
  // with its name so its card shows, and jump to the catalog.
  const pickJvd = (hit: SearchHit) => {
    setAreaF(null);
    setPlatformF(null);
    setOsF(null);
    setQueryF(hit.title);
    window.location.hash = "#catalog";
  };

  // Deep links like "#snips?jvd=x" carry a query the browser can't anchor-scroll
  // to (no element id matches "snips?jvd=x"), so scroll the base section into
  // view ourselves whenever such a hash is set.
  useEffect(() => {
    const scrollToDeepLink = () => {
      const h = window.location.hash;
      const qIdx = h.indexOf("?");
      if (qIdx < 0) return;
      const el = document.getElementById(h.slice(1, qIdx));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    scrollToDeepLink();
    window.addEventListener("hashchange", scrollToDeepLink);
    return () => window.removeEventListener("hashchange", scrollToDeepLink);
  }, []);

  const filtered = useMemo(() => {
    // Text query is resolved through the full-text index so a design matches by
    // the technologies, use-cases and snips it actually contains — not just its
    // name/description. Chips (area/platform/os) still filter on metadata.
    const matchIds = searchJvdIds(queryF);
    return data.filter((j) => {
      if (areaF && j.area !== areaF) return false;
      if (platformF && !j.platforms.some((p) => familyOf(p) === platformF)) return false;
      if (osF && !j.os.includes(osF)) return false;
      if (matchIds && !matchIds.has(j.id)) return false;
      return true;
    });
  }, [data, areaF, platformF, osF, queryF]);

  // Suggest near terms only when a typed query returns nothing.
  const catalogSuggestions = useMemo(
    () => (queryF.trim() && filtered.length === 0 ? didYouMean(queryF) : []),
    [queryF, filtered.length],
  );

  // Shuffle once per load so the idle marquee interleaves areas/platforms
  // instead of scrolling through them in source (grouped) order.
  const shuffledData = useMemo(() => {
    const a = [...data];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, [data]);

  const stats = [
    { label: "Validated Designs", value: "60+" },
    { label: "Config Snippets", value: `${Math.floor(snipBundle.counts.total / 25) * 25}+` },
    { label: "Validated Platforms", value: "25+" },
  ];

  const areaCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    AREAS.forEach((a) => (counts[a] = 0));
    data.forEach((j) => {
      counts[j.area] = (counts[j.area] ?? 0) + 1;
    });
    return counts;
  }, [data]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Technologies marquee */}
      <div className="marquee-pause overflow-hidden border-b border-border bg-surface">
        <div className="marquee-track flex w-max whitespace-nowrap py-2">
          {[...MARQUEE_TAGS, ...MARQUEE_TAGS].map((t, i) => (
            <MarqueeTag key={`${t}-${i}`} label={t} />
          ))}
        </div>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#home" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
            <img src={brandLogo} alt="" className="h-7 w-auto" style={{ filter: "invert(1) brightness(1.1)" }} />
            <span className="whitespace-nowrap">JVD Portal</span>
          </a>
          <nav className="hidden items-center gap-5 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                data-active={activeSection === n.href.slice(1)}
                className="nav-link whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Search"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/60 hover:text-foreground"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">Search</span>
              <kbd className="hidden rounded border border-border px-1 text-[10px] xl:inline">⌘K</kbd>
            </button>
            <a
              href="https://github.com/Juniper/jvd"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:border-primary/60"
            >
              <Github className="h-3.5 w-3.5" /> <span className="hidden xl:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative overflow-hidden border-b border-border"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -10%, color-mix(in oklab, var(--color-primary) 18%, transparent), transparent)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 hidden h-[620px] w-[620px] md:block"
          style={{
            WebkitMaskImage: "radial-gradient(circle at 70% 35%, white, transparent 72%)",
            maskImage: "radial-gradient(circle at 70% 35%, white, transparent 72%)",
          }}
        >
          <HeroNetwork />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-28 md:py-36">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Reference Architecture
            </span>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">
              Juniper Validated Designs
            </h1>
            <p className="mt-2 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              Build with Confidence.
            </p>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              End-to-end network architectures validated in Juniper labs, with the
              topology, configuration, and guidance teams need to deploy with confidence.
            </p>

            {/* Primary action: open the global search palette */}
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Search JVDs, technologies, and config snippets"
              className="group mt-10 flex w-full max-w-2xl items-center gap-3 rounded-xl border border-border bg-surface px-5 py-4 text-left transition-colors hover:border-primary/60"
            >
              <Search className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              <span className="flex-1 text-base text-muted-foreground">
                Search JVDs, technologies, config snippets…
              </span>
              <kbd className="hidden shrink-0 rounded border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground sm:inline">
                ⌘K
              </kbd>
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              Searches designs, config snippets, technologies, use cases, and platforms.
            </p>

            <div className="mt-16 grid grid-cols-3 gap-4 md:max-w-xl">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="premium-card rounded-xl border border-border bg-surface px-5 py-6"
                >
                  <div className="text-4xl font-semibold tracking-tight text-primary">
                    {s.value}
                  </div>
                  <div className="mt-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Journey ladder */}
          <div id="how" className="mt-24 scroll-mt-24">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Learn. Design. Automate.
            </h2>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
              <span className="font-medium text-foreground">Explore Juniper Validated Designs in a new way.</span>{" "}
              Find the right architecture, examine how it is built, design against
              your requirements, generate validated configuration, and connect it to
              automation. Five stages, one journey.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-5">
              {LADDER.map((s, i) => (
                <a
                  key={s.href}
                  href={s.href}
                  className={
                    "premium-card lift glow group relative flex flex-col rounded-xl border border-border bg-surface px-5 pt-5 pb-4 " +
                    ((s as any).comingSoon ? "opacity-75 hover:opacity-100" : "")
                  }
                >
                  <div
                    className={
                      "flex gap-x-2.5 " +
                      ((s as any).comingSoon ? "flex-wrap items-center gap-y-1.5" : "items-start")
                    }
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-base font-bold uppercase tracking-wide text-primary">
                      {s.stage}
                    </span>
                    {(s as any).comingSoon && (
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
                        Soon
                      </span>
                    )}
                  </div>
                  <div className="mt-3 text-[15px] font-semibold tracking-tight text-foreground">{s.title}</div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  <div className="flex-1" />
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                    {s.cta}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              ))}
            </div>
            <p className="mt-6 text-center text-lg font-medium tracking-tight text-foreground md:text-xl">
              AI for reasoning. Validated engineering for deployment.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                Stage 1 · Discover
              </div>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight">JVD Catalog</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Explore the {data.length} validated designs available in this portal. Visit{" "}
                <a
                  href="https://www.juniper.net/documentation/validated-designs/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  juniper.net
                </a>{" "}
                for the complete library of 60+ JVDs.
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {areaF || platformF || osF || queryF.trim()
                ? `Showing ${filtered.length} of ${data.length}`
                : <>{data.length} designs &middot; <span className="hidden sm:inline">hover to pause</span><span className="sm:hidden">swipe to browse</span> &middot; use filters to narrow</>}
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <div className="search-accent relative max-w-xl rounded-lg border">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
              <input
                type="search"
                value={queryF}
                onChange={(e) => setQueryF(e.target.value)}
                onFocus={() => track("catalog-search")}
                placeholder="Search designs by tech, use case, or platform…"
                aria-label="Search the JVD catalog"
                className="w-full rounded-lg border-0 bg-transparent py-3 pl-11 pr-3 text-base outline-none placeholder:text-muted-foreground"
              />
            </div>
            <FilterRow label="Area" options={AREAS} value={areaF} onChange={setAreaF} />
            <FilterRow label="Platform" options={PLATFORMS} value={platformF} onChange={setPlatformF} />
            <FilterRow label="OS" options={OS_OPTIONS} value={osF} onChange={setOsF} />
          </div>

          {areaF || platformF || osF || queryF.trim() ? (
            <>
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((j) => (
                  <JvdCard key={j.id} j={j} />
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="mt-12 rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                  No JVDs match your search or filters.
                  {catalogSuggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                      <span>Did you mean</span>
                      {catalogSuggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            track("catalog-did-you-mean");
                            setQueryF(s);
                          }}
                          className="rounded-md border border-border bg-surface px-2 py-0.5 font-medium text-primary transition-colors hover:border-primary/60"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <CatalogCarousel
              items={[...shuffledData, ...shuffledData]}
              renderCard={(j) => <JvdCard j={j} className="h-full w-full" />}
            />
          )}
        </div>
      </section>

      {/* Snip Library */}
      <SnipLibrary />

      {/* BYOAI */}
      <ByoaiSection />

      {/* Generator */}
      <section id="generator" className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            Stage 4 · Build
          </div>
          <div className="mt-1 flex items-center gap-2">
            <h2 className="text-3xl font-semibold tracking-tight">Validated Service Configuration Generator</h2>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Beta
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Choose a validated service, select the options covered by the solution,
            enter deployment parameters, and download Junos or Junos EVO configuration
            rendered directly from the JVD config library. Metro-as-a-Service E-Line,
            E-LAN, E-Tree, and PWHT are available now, with additional services and
            JVDs being added.
          </p>
          <p className="mt-3 max-w-2xl text-sm font-medium text-foreground">
            Deterministic generation from validated JVD building blocks &mdash; not AI-generated configuration.
          </p>

          <div className="mt-5 flex max-w-2xl items-start gap-2 rounded-md border border-border bg-surface p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              Configurations are strictly based on what was built and validated
              in the JVD. Some otherwise-supported service, platform, or feature
              combinations may not appear here because they were not covered by
              the validated design.
            </span>
          </div>

          <ConfigGenerator />
        </div>
      </section>

      {/* Stage 5: JVD MCP Server */}
      <section id="mcp" className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            Stage 5 · Deploy
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-surface to-surface p-8">
            <div className="flex flex-col items-start gap-5 sm:flex-row">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                <PlugZap className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold tracking-tight">JVD MCP Server</h2>
                  <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                    Coming soon
                  </span>
                </div>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  Bring Juniper Validated Designs into your AI agent. Search
                  validated config snippets, query design documentation, and launch
                  deterministic configuration workflows without leaving your
                  assistant. Pair the JVD MCP Server with the Junos MCP Server to
                  move from grounded design to network automation.
                </p>
                <a
                  href="https://github.com/Juniper/jvd"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track("mcp-notify")}
                  className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Bell className="h-4 w-4" />
                  Watch on GitHub for Updates
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why JVDs */}
      <section id="about" className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight">Why JVDs</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Network designs are more trustworthy when the architecture, configuration,
              scale, and expected behavior have been validated together. Juniper Validated
              Designs package that engineering work into end-to-end reference
              architectures that help teams reduce design uncertainty, accelerate
              implementation, and lower rollout risk.
            </p>
            <a
              href="https://www.juniper.net/documentation/validated-designs/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Explore the full Juniper Validated Design library <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {AREAS.filter((a) => (areaCounts[a] ?? 0) > 0).map((a) => (
              <a
                key={a}
                href={AREA_DOC_LINKS[a]}
                target="_blank"
                rel="noreferrer"
                className="premium-card lift rounded-xl border border-border bg-surface p-4 text-left"
              >
                <div className="text-2xl font-semibold tracking-tight text-primary">
                  {areaCounts[a]}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{a}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <Network className="h-5 w-5 text-primary" />
              JVD Portal
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              An index of Juniper Validated Designs.
            </p>
          </div>
          <FooterCol
            title="Resources"
            links={[
              { label: "GitHub Repo", href: "https://github.com/Juniper/jvd" },
              {
                label: "JVD Docs",
                href: "https://www.juniper.net/documentation/validated-designs/",
              },
              { label: "Apstra", href: "https://www.juniper.net/us/en/products/network-automation/apstra.html" },
            ]}
          />
          <FooterCol
            title="Areas"
            links={[
              { label: "Data Center", href: "#catalog" },
              { label: "Enterprise WAN", href: "#catalog" },
              { label: "Optical", href: "#catalog" },
              { label: "Security", href: "#catalog" },
              { label: "Service Provider", href: "#catalog" },
            ]}
          />
          <FooterCol
            title="Connect"
            links={[
              { label: "Juniper.net", href: "https://www.juniper.net" },
              { label: "Report a problem", href: "https://github.com/Juniper/jvd/issues/new/choose" },
            ]}
          />
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Juniper Networks, Inc.</span>
            <span>
              Built and maintained by the Juniper Validated Design team.{" "}
              <a
                href="https://github.com/Juniper/jvd/issues/new/choose"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-foreground"
              >
                Report a problem
              </a>
              .
            </span>
          </div>
        </div>
      </footer>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onPickJvd={pickJvd}
      />
    </div>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-20 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <Chip label="All" active={value === null} onClick={() => onChange(null)} />
      {options.map((o) => (
        <Chip
          key={o}
          label={o}
          active={value === o}
          onClick={() => onChange(value === o ? null : o)}
        />
      ))}
    </div>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-foreground">{title}</div>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
