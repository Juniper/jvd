/**
 * Type definitions and small helpers for the Snip Library section.
 * Mirrors the shape produced by portal/scripts/generate-snips.mjs.
 */

import bundle from "@/data/snips.json";

export type SnipOs = "Junos" | "Junos EVO";
export type SnipOsKey = "junos" | "evo";

export type SnipPairRef = { raw: string; id: string | null };
export type SnipVariable = { name: string; example: string };

export type SnipRecord = {
  id: string;
  jvd: string;
  jvdLabel: string;
  area: string | null;
  os: SnipOs;
  osKey: SnipOsKey;
  category: string;
  name: string;
  path: string;
  topic: string;
  seenOn: { junos: string[]; evo: string[] };
  highlights: string[];
  pairWith: SnipPairRef[];
  variables: SnipVariable[];
  body: string;
  bodyHtml: string;
  bytes: number;
  lineCount: number;
  techFamily: string;
  subfamily: string;
  usecases: string[];
  parseWarnings: string[];
};

export type SnipJvdSummary = {
  id: string;
  label: string;
  area: string | null;
  repoPath: string | null;
  counts: { junos: number; evo: number; total: number };
};

export type SnipBundle = {
  generatedAt: string;
  counts: { total: number; junos: number; evo: number; jvds: number };
  categories: string[];
  techFamilies: string[];
  usecases: string[];
  jvds: SnipJvdSummary[];
  snips: SnipRecord[];
  variableGlossaries: { jvd: string; markdown: string }[];
  byoaiJvds: { jvd: string; promptPath: string; promptUrl: string }[];
  parseWarnings: { file: string; warning: string }[];
};

export const snipBundle = bundle as unknown as SnipBundle;

export const REPO_BLOB_BASE = "https://github.com/Juniper/jvd/blob/main/";

/** Title-case a slug-like string ("apply-groups" → "Apply Groups"). */
export function titleize(s: string): string {
  return s
    .split(/[-_]+/)
    .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : ""))
    .join(" ");
}

/** Lowercased substring search across topic + name + highlights + variables + body. */
export function matchesQuery(s: SnipRecord, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  if (s.topic.toLowerCase().includes(needle)) return true;
  if (s.name.toLowerCase().includes(needle)) return true;
  if (s.subfamily.toLowerCase().includes(needle)) return true;
  if (s.highlights.some((h) => h.toLowerCase().includes(needle))) return true;
  if (s.variables.some((v) => v.name.toLowerCase().includes(needle))) return true;
  if (s.body.toLowerCase().includes(needle)) return true;
  return false;
}

export type BrowseMode = "jvd" | "tech" | "usecase";

export const BROWSE_MODES: { id: BrowseMode; label: string }[] = [
  { id: "jvd", label: "JVD" },
  { id: "tech", label: "Technology" },
  { id: "usecase", label: "Use Case" },
];

export type GroupNode = {
  id: string;
  label: string;
  count: number;
  children?: GroupNode[];
  snipIds?: string[];
};

/** Build the tree shown in the left accordion for a given browse mode. */
export function buildTree(snips: SnipRecord[], mode: BrowseMode): GroupNode[] {
  if (mode === "jvd") {
    // Area → JVD → Category → snip
    const byArea = new Map<string, Map<string, Map<string, SnipRecord[]>>>();
    for (const s of snips) {
      const area = s.area || "Other";
      if (!byArea.has(area)) byArea.set(area, new Map());
      const byJvd = byArea.get(area)!;
      if (!byJvd.has(s.jvd)) byJvd.set(s.jvd, new Map());
      const byCat = byJvd.get(s.jvd)!;
      if (!byCat.has(s.category)) byCat.set(s.category, []);
      byCat.get(s.category)!.push(s);
    }
    return [...byArea.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([area, jvdMap]) => ({
        id: `area:${area}`,
        label: area,
        count: [...jvdMap.values()].reduce(
          (n, catMap) => n + [...catMap.values()].reduce((m, arr) => m + arr.length, 0),
          0,
        ),
        children: [...jvdMap.entries()]
          .sort(([, a], [, b]) => (a.values().next().value?.[0]?.jvdLabel ?? "").localeCompare(b.values().next().value?.[0]?.jvdLabel ?? ""))
          .map(([jvdId, catMap]) => {
            const label = catMap.values().next().value?.[0]?.jvdLabel ?? jvdId;
            return {
              id: `jvd:${jvdId}`,
              label,
              count: [...catMap.values()].reduce((n, arr) => n + arr.length, 0),
              children: [...catMap.entries()]
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([cat, arr]) => ({
                  id: `cat:${jvdId}:${cat}`,
                  label: titleize(cat),
                  count: arr.length,
                  snipIds: arr.map((s) => s.id),
                })),
            };
          }),
      }));
  }

  if (mode === "tech") {
    // Tech family → subfamily → snip
    const byFam = new Map<string, Map<string, SnipRecord[]>>();
    for (const s of snips) {
      if (!byFam.has(s.techFamily)) byFam.set(s.techFamily, new Map());
      const sub = byFam.get(s.techFamily)!;
      if (!sub.has(s.subfamily)) sub.set(s.subfamily, []);
      sub.get(s.subfamily)!.push(s);
    }
    return [...byFam.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([fam, subMap]) => ({
        id: `tech:${fam}`,
        label: fam,
        count: [...subMap.values()].reduce((n, arr) => n + arr.length, 0),
        children: [...subMap.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([sub, arr]) => ({
            id: `sub:${fam}:${sub}`,
            label: sub,
            count: arr.length,
            snipIds: arr.map((s) => s.id),
          })),
      }));
  }

  // mode === "usecase": Use case → JVD → snip
  const byUse = new Map<string, Map<string, SnipRecord[]>>();
  for (const s of snips) {
    const tags = s.usecases.length ? s.usecases : ["Untagged"];
    for (const u of tags) {
      if (!byUse.has(u)) byUse.set(u, new Map());
      const byJvd = byUse.get(u)!;
      if (!byJvd.has(s.jvd)) byJvd.set(s.jvd, []);
      byJvd.get(s.jvd)!.push(s);
    }
  }
  return [...byUse.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([use, jvdMap]) => ({
      id: `use:${use}`,
      label: use,
      count: [...jvdMap.values()].reduce((n, arr) => n + arr.length, 0),
      children: [...jvdMap.entries()]
        .sort(([, a], [, b]) => (a[0]?.jvdLabel ?? "").localeCompare(b[0]?.jvdLabel ?? ""))
        .map(([jvdId, arr]) => ({
          id: `useJvd:${use}:${jvdId}`,
          label: arr[0]?.jvdLabel ?? jvdId,
          count: arr.length,
          snipIds: arr.map((s) => s.id),
        })),
    }));
}
