/**
 * Portal search — deterministic, phrase-exact matching with a fuzzy
 * "did you mean" fallback only when there are zero matches.
 *
 * Design (locked after real-world testing):
 *   - Matching is plain SUBSTRING, evaluated PER SOURCE. A design/snip matches a
 *     query only if some SINGLE source (a field, or one snip) contains every
 *     query term. This is phrase-exact and prevents cross-snip "token scatter"
 *     (e.g. "transport-class" no longer matches a JVD that merely has a
 *     "transport" snip and a separate "class-of-service" snip).
 *   - No fuzzy/prefix in normal matching, so results are predictable and stay
 *     consistent with the Config Explorer.
 *   - Fuzzy (edit-distance) is used ONLY to suggest "did you mean X?" when a
 *     query returns nothing — never to broaden real results.
 *
 * Signals per design: name, area, platforms, description, README text, its
 * use-cases / technologies, and each of its snips (individually).
 */

import jvds from "@/data/jvds.json";
import readmes from "@/data/jvd-readmes.json";
import { snipBundle, titleize } from "@/lib/snips";

export type ResultKind = "jvd" | "snip" | "tech" | "usecase";

export type SearchHit = {
  key: string;
  kind: ResultKind;
  refId: string;
  title: string;
  subtitle: string;
  score: number;
  jvd?: string;
};

type Jvd = {
  id: string;
  name: string;
  area: string;
  description: string;
  platforms: string[];
  os: string[];
};

const README: Record<string, string> = readmes as Record<string, string>;

// ---- normalization ---------------------------------------------------------

function terms(query: string): string[] {
  return query.toLowerCase().trim().split(/\s+/).filter(Boolean);
}

/** True when `text` contains every query term as a substring. */
function allIn(text: string, ts: string[]): boolean {
  for (const t of ts) if (!text.includes(t)) return false;
  return true;
}

// ---- precomputed corpora (built once) --------------------------------------

type MetaSource = { t: string; score: number };
type JvdEntry = {
  id: string;
  name: string;
  area: string;
  meta: MetaSource[];
  tags: string[]; // use-cases + technologies present in this JVD's snips
  snipTexts: string[];
};
type SnipEntry = {
  id: string;
  jvd: string;
  refId: string;
  title: string;
  subtitle: string;
  nameLc: string;
  topicLc: string;
  structLc: string;
  text: string; // full searchable blob (incl. body)
};

type Corpus = {
  jvdEntries: JvdEntry[];
  snipEntries: SnipEntry[];
  techs: string[];
  usecases: string[];
  vocab: string[];
};

let corpus: Corpus | null = null;

function build(): Corpus {
  const perJvdTags = new Map<string, Set<string>>();
  const perJvdSnipText = new Map<string, string[]>();
  const snipEntries: SnipEntry[] = [];

  for (const s of snipBundle.snips) {
    const struct = [
      s.topic,
      s.category,
      s.techFamily,
      s.subfamily,
      ...s.usecases,
      ...s.highlights,
      ...s.variables.map((v) => v.name),
    ]
      .join(" ")
      .toLowerCase();
    const text = `${s.name} ${struct} ${s.body}`.toLowerCase();

    snipEntries.push({
      id: `snip:${s.id}`,
      jvd: s.jvd,
      refId: s.id,
      title: s.name,
      subtitle: `${s.jvdLabel} · ${titleize(s.category)}`,
      nameLc: s.name.toLowerCase(),
      topicLc: s.topic.toLowerCase(),
      structLc: struct,
      text,
    });

    if (!perJvdTags.has(s.jvd)) perJvdTags.set(s.jvd, new Set());
    const tagSet = perJvdTags.get(s.jvd)!;
    tagSet.add(s.techFamily.toLowerCase());
    for (const u of s.usecases) tagSet.add(u.toLowerCase());

    if (!perJvdSnipText.has(s.jvd)) perJvdSnipText.set(s.jvd, []);
    perJvdSnipText.get(s.jvd)!.push(text);
  }

  const jvdEntries: JvdEntry[] = (jvds as Jvd[]).map((j) => ({
    id: j.id,
    name: j.name,
    area: j.area,
    meta: [
      { t: j.name.toLowerCase(), score: 100 },
      { t: j.platforms.join(" ").toLowerCase(), score: 90 },
      { t: j.area.toLowerCase(), score: 60 },
      { t: j.description.toLowerCase(), score: 55 },
      { t: (README[j.id] ?? "").toLowerCase(), score: 45 },
    ],
    tags: [...(perJvdTags.get(j.id) ?? [])],
    snipTexts: perJvdSnipText.get(j.id) ?? [],
  }));

  const techs = snipBundle.techFamilies;
  const usecases = snipBundle.usecases;

  // Vocabulary for "did you mean" — the terms a user is likely reaching for.
  // Store whole phrases AND their word tokens (so "evpn-vxlan" also yields the
  // reachable word "vxlan").
  const vocab = new Set<string>();
  const addVocab = (s: string) => {
    const lc = s.toLowerCase().trim();
    if (lc.length > 2) vocab.add(lc);
    for (const w of lc.split(/[^a-z0-9]+/)) if (w.length > 2) vocab.add(w);
  };
  for (const t of techs) addVocab(t);
  for (const u of usecases) addVocab(u);
  for (const c of snipBundle.categories) addVocab(c);
  for (const s of snipBundle.snips) {
    addVocab(s.name);
    addVocab(s.subfamily);
    addVocab(s.topic);
  }
  for (const j of jvds as Jvd[]) {
    for (const p of j.platforms) addVocab(p);
    addVocab(j.name);
  }
  vocab.delete("");

  corpus = { jvdEntries, snipEntries, techs, usecases, vocab: [...vocab] };
  return corpus;
}

function getCorpus(): Corpus {
  return corpus ?? build();
}

// ---- matching --------------------------------------------------------------

function matchJvds(ts: string[]): SearchHit[] {
  const hits: SearchHit[] = [];
  for (const j of getCorpus().jvdEntries) {
    let best = 0;
    for (const m of j.meta) if (m.t && allIn(m.t, ts)) best = Math.max(best, m.score);
    if (best < 70) for (const tag of j.tags) if (allIn(tag, ts)) { best = Math.max(best, 70); break; }
    if (best < 35) for (const st of j.snipTexts) if (allIn(st, ts)) { best = 35; break; }
    if (best > 0) {
      hits.push({ key: `jvd:${j.id}`, kind: "jvd", refId: j.id, title: j.name, subtitle: j.area, score: best });
    }
  }
  return hits.sort((a, b) => b.score - a.score);
}

function matchSnips(ts: string[], query: string): SearchHit[] {
  const joined = query.toLowerCase().trim();
  const seen = new Set<string>();
  const hits: SearchHit[] = [];
  for (const s of getCorpus().snipEntries) {
    if (!allIn(s.text, ts)) continue;
    let score = 30;
    if (s.nameLc === joined) score = 200;
    else if (allIn(s.nameLc, ts)) score = 120;
    else if (allIn(s.topicLc, ts)) score = 90;
    else if (allIn(s.structLc, ts)) score = 70;
    hits.push({ key: s.id, kind: "snip", refId: s.refId, title: s.title, subtitle: s.subtitle, score, jvd: s.jvd });
  }
  hits.sort((a, b) => b.score - a.score || a.title.length - b.title.length);
  // Collapse Junos/EVO variants (same name · JVD · category).
  const out: SearchHit[] = [];
  for (const h of hits) {
    const k = `${h.title}:${h.subtitle}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(h);
  }
  return out;
}

function matchConcepts(ts: string[], list: string[], kind: ResultKind): SearchHit[] {
  return list
    .filter((x) => allIn(x.toLowerCase(), ts))
    .map((x) => ({
      key: `${kind}:${x}`,
      kind,
      refId: x,
      title: x,
      subtitle: kind === "tech" ? "Technology" : "Use case",
      score: 80,
    }));
}

/** Ranked global search across all kinds. */
export function searchAll(query: string): SearchHit[] {
  const ts = terms(query);
  if (!ts.length) return [];
  const c = getCorpus();
  return [
    ...matchJvds(ts),
    ...matchSnips(ts, query),
    ...matchConcepts(ts, c.techs, "tech"),
    ...matchConcepts(ts, c.usecases, "usecase"),
  ];
}

/** JVD ids matching a query (for the catalog filter). null = no active query. */
export function searchJvdIds(query: string): Set<string> | null {
  const ts = terms(query);
  if (!ts.length) return null;
  return new Set(matchJvds(ts).map((h) => h.refId));
}

export type GroupedHits = {
  jvds: SearchHit[];
  snips: SearchHit[];
  techs: SearchHit[];
  usecases: SearchHit[];
  total: number;
};

export function groupHits(hits: SearchHit[], perGroup = 6): GroupedHits {
  const jvds = hits.filter((h) => h.kind === "jvd").slice(0, perGroup);
  const snips = hits.filter((h) => h.kind === "snip").slice(0, perGroup);
  const techs = hits.filter((h) => h.kind === "tech").slice(0, 4);
  const usecases = hits.filter((h) => h.kind === "usecase").slice(0, 4);
  return { jvds, snips, techs, usecases, total: jvds.length + snips.length + techs.length + usecases.length };
}

/** Total snip matches for a query (so the palette can offer "see all N"). */
export function countSnipMatches(query: string): number {
  const ts = terms(query);
  if (!ts.length) return 0;
  return matchSnips(ts, query).length;
}

/** High-signal starter terms shown in the empty search palette for discovery.
 *  Curated, then filtered to those that actually return results. */
export function starterTerms(): string[] {
  const candidates = [
    "EVPN-VXLAN",
    "BGP",
    "SRv6",
    "Pseudowire",
    "Flex-Algo",
    "CGNAT",
    "IRB",
    "Multicast",
    "MACsec",
    "EVPN-ELAN",
  ];
  return candidates.filter((c) => searchAll(c).length > 0).slice(0, 8);
}

// ---- did-you-mean (fuzzy, zero-result only) --------------------------------

// Optimal string alignment (Damerau-Levenshtein with adjacent transpositions),
// bounded by `max`. Transposition costs 1, so "bpg" → "bgp" is distance 1.
function osaDistance(a: string, b: string, max: number): number {
  const al = a.length, bl = b.length;
  if (Math.abs(al - bl) > max) return max + 1;
  const d: number[][] = Array.from({ length: al + 1 }, () => new Array(bl + 1).fill(0));
  for (let i = 0; i <= al; i++) d[i][0] = i;
  for (let j = 0; j <= bl; j++) d[0][j] = j;
  for (let i = 1; i <= al; i++) {
    let rowMin = Infinity;
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
      if (d[i][j] < rowMin) rowMin = d[i][j];
    }
    if (rowMin > max) return max + 1;
  }
  return d[al][bl];
}

/**
 * Up to `limit` nearest vocabulary terms to a zero-result query, best first.
 * Compares the longest query word; ranks by edit distance, then shared prefix,
 * then shorter term. Empty when nothing is close enough.
 */
export function didYouMean(query: string, limit = 5): string[] {
  const ts = terms(query);
  if (!ts.length) return [];
  const word = ts.reduce((a, b) => (b.length > a.length ? b : a), "");
  if (word.length < 3) return [];
  const max = word.length <= 4 ? 1 : 2;
  const cands: { v: string; d: number; pfx: number }[] = [];
  for (const v of getCorpus().vocab) {
    if (v === word || v.includes(word)) continue;
    const d = osaDistance(word, v, max);
    if (d > max) continue;
    let pfx = 0;
    while (pfx < word.length && pfx < v.length && word[pfx] === v[pfx]) pfx++;
    cands.push({ v, d, pfx });
  }
  cands.sort((a, b) => a.d - b.d || b.pfx - a.pfx || a.v.length - b.v.length || a.v.localeCompare(b.v));
  return cands.slice(0, limit).map((c) => c.v);
}

/** Where a hit navigates to (hash for snips/tech/usecase; catalog for JVDs). */
export function hitHref(hit: SearchHit): string {
  switch (hit.kind) {
    case "snip":
      return `#snips?id=${encodeURIComponent(hit.refId)}`;
    case "tech":
      return `#snips?mode=tech&q=${encodeURIComponent(hit.refId)}`;
    case "usecase":
      return `#snips?mode=usecase&q=${encodeURIComponent(hit.refId)}`;
    case "jvd":
    default:
      return "#catalog";
  }
}
