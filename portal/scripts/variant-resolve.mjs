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
 * Among applicable members, one stored under the target OS is preferred. A
 * member stored under the other directory is selected only when no
 * same-directory member is applicable — a cross-directory selection, flagged so
 * audits can report it. Zero applicable members is unavailable (fail closed);
 * more than one at the winning tier is ambiguous. The first arbitrary member is
 * never chosen, and selection never crosses device or JVD.
 *
 * Member descriptor shape:
 *   { jvd, os: "junos"|"evo", group, provides: string[], seenOn: { junos:[], evo:[] } }
 */

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
  const applicable = (members || []).filter(
    (m) =>
      m.jvd === consumerJvd &&
      m.group === group &&
      (m.seenOn?.[targetOS] || []).includes(targetDevice) &&
      wanted.every((f) => (m.provides || []).includes(f)),
  );
  const native = applicable.filter((m) => m.os === targetOS);
  const tier = native.length ? native : applicable;
  if (tier.length === 1) {
    return { status: "ok", member: tier[0], crossDirectory: tier[0].os !== targetOS };
  }
  if (tier.length === 0) return { status: "unavailable", member: null };
  return { status: "ambiguous", members: tier };
}

/**
 * True if the referenced group has any member in the consumer's JVD, regardless
 * of OS. Group existence is JVD-scoped: a group that exists only under the other
 * OS is present-but-incompatible (VARIANT_UNRESOLVED), not empty.
 */
export function groupHasMembers({ group, consumerJvd, members }) {
  return (members || []).some((m) => m.jvd === consumerJvd && m.group === group);
}
