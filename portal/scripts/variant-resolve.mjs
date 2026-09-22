/**
 * variant-resolve.mjs — deterministic, fail-closed resolution of a consumer's
 * `variant:` requirement to exactly one publishing member.
 *
 * Applicability and storage are separate facts. A member is **applicable** to a
 * target when it is the same JVD, the same variant group, provides every
 * requested selector, and names that exact device in the target OS's `Seen on:`
 * row. The member's directory records the dialect its body is written in; it
 * never establishes or withholds applicability, and body equality, filename
 * similarity and `otherOsFormId` are never substitutes for an explicit device
 * token.
 *
 * Among applicable members, those emitting the same normalized body are one
 * logical representation; a same-directory representation is preferred only
 * after equivalence is established. Two applicable members with different
 * bodies are ambiguous whatever their directories, so directory preference can
 * never hide a differing body. Zero applicable members is unavailable (fail
 * closed). The first arbitrary member is never chosen, selection is independent
 * of candidate order, and it never crosses device or JVD.
 *
 * Member descriptor shape:
 *   { jvd, os: "junos"|"evo", group, provides: string[], seenOn: { junos:[], evo:[] } }
 */

import { createHash } from "node:crypto";

/**
 * bodyIdentity(body) -> stable id for an emitted configuration body.
 *
 * Normalization, exhaustively: CRLF and lone CR become LF; trailing spaces and
 * tabs are removed from each line; trailing blank lines are removed. Nothing
 * else is touched — no statement is ignored and no variable is elided, so two
 * bodies share an identity only when they emit the same configuration. The
 * header is not part of a body, so header differences are excluded by
 * construction.
 */
export function bodyIdentity(body) {
  const norm = String(body ?? "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => l.replace(/[ \t]+$/, ""))
    .join("\n")
    .replace(/\n+$/, "");
  return createHash("sha256").update(norm).digest("hex");
}

/** A member's logical representation id, or a unique sentinel when unknown. */
function identityOf(m, i) {
  if (m.bodyId) return m.bodyId;
  if (typeof m.body === "string") return bodyIdentity(m.body);
  // Unknown identity can never be proven equivalent to anything else, so it
  // stays distinct and a second candidate makes the requirement ambiguous.
  return `unknown:${m.rel ?? i}`;
}

/**
 * `selectors` carries the requested tokens; `families` is a deprecated alias
 * kept so existing callers and serialized data keep working. Tokens are opaque,
 * so an address family and a namespaced capability resolve identically.
 */
export function resolveVariant({
  group,
  selectors,
  families,
  targetDevice,
  targetOS,
  consumerJvd,
  members,
}) {
  const wanted = selectors ?? families ?? [];
  // Storage is not part of applicability: every exact-device candidate counts,
  // whichever directory holds it.
  const applicable = (members || [])
    .filter(
      (m) =>
        m.jvd === consumerJvd &&
        m.group === group &&
        (m.seenOn?.[targetOS] || []).includes(targetDevice) &&
        wanted.every((f) => (m.provides || []).includes(f)),
    )
    .map((m, i) => ({ m, id: identityOf(m, i) }))
    .sort((a, b) => String(a.m.rel).localeCompare(String(b.m.rel)));

  if (applicable.length === 0) return { status: "unavailable", member: null };

  const bodies = new Map();
  for (const c of applicable) {
    if (!bodies.has(c.id)) bodies.set(c.id, []);
    bodies.get(c.id).push(c.m);
  }
  // Equivalence may collapse candidates that were already applicable; it never
  // admits one that was not.
  if (bodies.size > 1) {
    return { status: "ambiguous", members: applicable.map((c) => c.m) };
  }

  const reps = [...bodies.values()][0];
  const native = reps.find((m) => m.os === targetOS);
  const chosen = native ?? reps[0];
  return { status: "ok", member: chosen, crossDirectory: chosen.os !== targetOS };
}

/**
 * True if the referenced group has any member in the consumer's JVD, regardless
 * of OS. Group existence is JVD-scoped: a group that exists only under the other
 * OS is present-but-incompatible (VARIANT_UNRESOLVED), not empty.
 */
export function groupHasMembers({ group, consumerJvd, members }) {
  return (members || []).some((m) => m.jvd === consumerJvd && m.group === group);
}
