import { useEffect, useMemo, useState } from "react";
import jvds from "@/data/jvds.json";
import { ArrowRight, Github, ExternalLink, Network, Layers, Info, Sparkles, Wrench, type LucideIcon } from "lucide-react";
import brandLogo from "@/assets/hpe-juniper-networking.avif";
import SnipLibrary from "@/components/SnipLibrary";
import ByoaiSection from "@/components/ByoaiSection";
import ConfigGenerator from "@/components/ConfigGenerator";
import { snipBundle } from "@/lib/snips";

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
  { label: "About", href: "#about" },
];

// The site as a journey: Discover → Explore → Design → Build. Each rung links
// to its section so the four tools read as stages, not competing alternatives.
const LADDER = [
  {
    stage: "Discover",
    title: "JVD Catalog",
    desc: "Find the validated design that fits your requirements.",
    href: "#catalog",
  },
  {
    stage: "Explore",
    title: "Config Explorer",
    desc: "Drill into the reusable, provenance-tracked config building blocks.",
    href: "#snips",
  },
  {
    stage: "Design",
    title: "Design & Planner",
    desc: "Ask design and scaling questions grounded in the validated JVDs.",
    href: "#byoai",
  },
  {
    stage: "Build",
    title: "Service Config Generator",
    desc: "Render download-ready, JVD-validated service configuration.",
    href: "#generator",
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

export default function JvdPortal() {
  const data = jvds as Jvd[];
  const [areaF, setAreaF] = useState<string | null>(null);
  const [platformF, setPlatformF] = useState<string | null>(null);
  const [osF, setOsF] = useState<string | null>(null);

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

  const filtered = useMemo(
    () =>
      data.filter((j) => {
        if (areaF && j.area !== areaF) return false;
        if (platformF && !j.platforms.some((p) => familyOf(p) === platformF)) return false;
        if (osF && !j.os.includes(osF)) return false;
        return true;
      }),
    [data, areaF, platformF, osF],
  );

  const stats = [
    { label: "Validated Designs", value: "60+" },
    { label: "Reusable Config Templates", value: `${Math.floor(snipBundle.counts.total / 50) * 50}+` },
    { label: "Platforms Validated", value: "25+" },
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
      {/* Marquee */}
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
          <a href="#home" className="flex items-center gap-2 font-semibold tracking-tight">
            <img src={brandLogo} alt="" className="h-7 w-auto" style={{ filter: "invert(1) brightness(1.1)" }} />
            <span>JVD Portal</span>
          </a>
          <nav className="hidden gap-8 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href="https://github.com/Juniper/jvd"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:border-primary/60"
          >
            <Github className="h-3.5 w-3.5" /> GitHub
          </a>
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
        <div className="mx-auto max-w-7xl px-6 py-28 md:py-36">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Reference Architecture
            </span>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">
              Juniper Validated Designs
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              End-to-end designs extensively validated in Juniper labs — topology, configuration,
              and validation guidance for data center, WAN, optical, security, and service provider
              networks.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#catalog"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Browse Catalog <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/Juniper/jvd"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium hover:border-primary/60"
              >
                <Github className="h-4 w-4" /> View on GitHub
              </a>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-4 md:max-w-xl">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-border bg-surface px-5 py-5"
                >
                  <div className="text-3xl font-semibold tracking-tight text-primary">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Journey ladder — Discover → Explore → Design → Build */}
          <div id="how" className="mt-24 scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight">
              Find it. Learn it. Plan it. Build it.
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Four stages, one path. Discover the right design, explore how it&apos;s
              built, plan it against your requirements, then generate validated config.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {LADDER.map((s, i) => (
                <a
                  key={s.href}
                  href={s.href}
                  className="group relative rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary/60"
                >
                  <div className="flex items-center gap-2 text-primary">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/40 text-xs font-semibold">
                      {i + 1}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      {s.stage}
                    </span>
                  </div>
                  <div className="mt-3 font-semibold tracking-tight">{s.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Open <ArrowRight className="h-3 w-3" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                Step 1 · Discover
              </div>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight">JVD Catalog</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse the {data.length} validated designs in this GitHub catalog. Visit{" "}
                <a
                  href="https://www.juniper.net/documentation/validated-designs/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  juniper.net
                </a>{" "}
                for the full Juniper library of 60+ JVDs.
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filtered.length} of {data.length}
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <FilterRow label="Area" options={AREAS} value={areaF} onChange={setAreaF} />
            <FilterRow label="Platform" options={PLATFORMS} value={platformF} onChange={setPlatformF} />
            <FilterRow label="OS" options={OS_OPTIONS} value={osF} onChange={setOsF} />
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((j) => {
              const families = Array.from(new Set(j.platforms.map(familyOf))).filter(Boolean);
              const hasSnips = SNIP_JVD_IDS.has(j.id);
              const steps: StepPill[] = [];
              if (hasSnips)
                steps.push({ href: `#snips?jvd=${j.id}`, label: "Explore", Icon: Layers });
              if (BYOAI_JVD_IDS.has(j.id))
                steps.push({ href: `#byoai?jvd=${j.id}`, label: "Design", Icon: Sparkles });
              if (BUILD_JVD_IDS.has(j.id))
                steps.push({ href: `#generator?jvd=${j.id}`, label: "Build", Icon: Wrench });
              return (
                <article
                  key={j.id}
                  className="group flex flex-col rounded-lg border border-border bg-surface p-6 transition-colors hover:border-primary/50"
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
                  <a
                    href={`${REPO_BASE}${j.repoPath}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-between rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors group-hover:border-primary/60 group-hover:text-primary"
                  >
                    View JVD
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </article>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="mt-12 rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              No JVDs match the selected filters.
            </div>
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
            Step 4 · Build
          </div>
          <div className="mt-1 flex items-center gap-2">
            <h2 className="text-3xl font-semibold tracking-tight">Service Configuration Generator</h2>
            <span className="inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Beta
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            A deterministic config builder: pick a service, choose your
            options, fill in the parameters, and download validated Junos /
            Junos EVO configuration rendered straight from the JVD snip library.
            Metro-as-a-Service E-Line, E-LAN and E-Tree are live — more services
            and JVDs are being added. Scoped to validated <em>services</em>; for
            broader design and platform questions, use the Design &amp; Planner.
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

      {/* About */}
      <section id="about" className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight">About</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Juniper Validated Designs are end-to-end, extensively-tested reference architectures
              built and verified by Juniper engineering. Each JVD bundles topology, configuration,
              and validation guidance so teams can deploy with confidence and reduce risk on
              critical network rollouts.
            </p>
            <a
              href="https://www.juniper.net/documentation/validated-designs/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Read the JVD documentation <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {AREAS.filter((a) => (areaCounts[a] ?? 0) > 0).map((a) => (
              <a
                key={a}
                href={AREA_DOC_LINKS[a]}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-border bg-surface p-4 text-left transition-colors hover:border-primary/60"
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
