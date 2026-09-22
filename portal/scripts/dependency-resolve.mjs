/**
 * dependency-resolve.mjs — deterministic, fail-closed resolution of a direct
 * `Pair with:` dependency for one target device.
 *
 * `variant-resolve.mjs` answers "which member of this variant group does this
 * device get?". This answers the other half: "the consumer names ONE snip as a
 * same-device prerequisite — can that prerequisite actually be supplied here?"
 * Both use one applicability model, so validation, completeness analysis and
 * composition cannot drift apart.
 *
 * The candidate set is the named target plus its path twin — the same relative
 * path under the other OS directory — because that is the library's own notion
 * of a second representation of one snip. Nothing else is considered: an
 * unrelated snip is never substituted just because a body happens to match.
 *
 * Statuses, one per case:
 *   unresolved-path  the named path is not a snip in this library
 *   ok               exactly one distinct applicable body; `viaEquivalent` is
 *                    set when the selected representation is not the one named
 *   ambiguous        two distinct applicable bodies — never silently picked
 *   unavailable      nothing applicable. `alternative` records whether a twin
 *                    exists whose body DIFFERS, which is the case that must not
 *                    be substituted: emitting it would emit different config
 *
 * A whole snip is the unit here, so equivalence is whole-body equivalence. Two
 * snips that agree on one object but emit different additional objects are NOT
 * equivalent, because including either emits everything it carries.
 */
import { bodyIdentity } from "./variant-resolve.mjs";

/** The same relative path under the other OS directory, or null. */
export function twinRel(rel) {
  const slash = rel.indexOf("/");
  if (slash === -1) return null;
  const dir = rel.slice(0, slash);
  if (dir !== "junos" && dir !== "evo") return null;
  return `${dir === "junos" ? "evo" : "junos"}/${rel.slice(slash + 1)}`;
}

/**
 * resolveDependency({ targetRel, targetDevice, targetOS, index })
 *
 * `index` is a Map of rel -> { rel, dir, seenOn, body }. Returns a result whose
 * `status` is one of the four above. Selection is deterministic: among equally
 * applicable equivalent representations the one stored under the target OS wins,
 * and otherwise candidates are ordered by path.
 */
export function resolveDependency({ targetRel, targetDevice, targetOS, index }) {
  const named = index.get(targetRel);
  if (!named) return { status: "unresolved-path", targetRel };

  const twin = index.get(twinRel(targetRel) ?? "\u0000");
  const candidates = twin ? [named, twin] : [named];
  const applies = (s) => (s.seenOn?.[targetOS] || []).includes(targetDevice);
  const applicable = candidates.filter(applies).sort((a, b) => a.rel.localeCompare(b.rel));

  if (applicable.length === 0) {
    const differing = twin && bodyIdentity(twin.body) !== bodyIdentity(named.body);
    return {
      status: "unavailable",
      targetRel,
      alternative: twin ? (differing ? "twin-differs" : "twin-equivalent-but-inapplicable") : "no-twin",
    };
  }

  const bodies = new Map();
  for (const c of applicable) {
    const id = bodyIdentity(c.body);
    if (!bodies.has(id)) bodies.set(id, []);
    bodies.get(id).push(c);
  }
  if (bodies.size > 1) {
    return { status: "ambiguous", targetRel, members: applicable.map((c) => c.rel) };
  }

  // The dependency means "emit what the named snip emits", so only a
  // representation with that exact body can stand in for it.
  const namedId = bodyIdentity(named.body);
  const [onlyId, reps] = [...bodies.entries()][0];
  if (onlyId !== namedId) {
    return { status: "unavailable", targetRel, alternative: "twin-differs" };
  }

  const selected = reps.find((c) => c.dir === targetOS) ?? reps[0];
  return {
    status: "ok",
    targetRel,
    selected: selected.rel,
    viaEquivalent: selected.rel !== targetRel,
    crossDirectory: selected.dir !== targetOS,
    equivalents: reps.filter((c) => c.rel !== selected.rel).map((c) => c.rel),
  };
}

/** The `Pair with:` bullet's path, stripped of trailing prose. Empty for `none`. */
export function dependencyPath(bullet) {
  const p = String(bullet).replace(/^-\s*/, "").split(/\s+/)[0].replace(/[(),;]+$/, "");
  if (!p || p.toLowerCase() === "none") return null;
  return p;
}
