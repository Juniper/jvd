/**
 * variant-resolve.mjs — deterministic, fail-closed resolution of a consumer's
 * `variant:` requirement to exactly one publishing member.
 *
 * A member is compatible only when it is the same JVD, same variant-group name,
 * same target OS, lists the target device in its exact `Seen on:` bucket, and
 * provides every requested family (atomic all-of). Zero matches is unavailable
 * (fail closed); more than one is ambiguous (fail closed). The first arbitrary
 * member is never chosen, and substitution never crosses OS, device, or JVD.
 *
 * Member descriptor shape:
 *   { jvd, os: "junos"|"evo", group, provides: string[], seenOn: { junos:[], evo:[] } }
 */

export function resolveVariant({ group, families, targetDevice, targetOS, consumerJvd, members }) {
  const matches = (members || []).filter(
    (m) =>
      m.jvd === consumerJvd &&
      m.group === group &&
      m.os === targetOS &&
      (m.seenOn?.[targetOS] || []).includes(targetDevice) &&
      families.every((f) => (m.provides || []).includes(f)),
  );
  if (matches.length === 1) return { status: "ok", member: matches[0] };
  if (matches.length === 0) return { status: "unavailable", member: null };
  return { status: "ambiguous", members: matches };
}

/**
 * True if the referenced group has any member in the consumer's JVD, regardless
 * of OS. Group existence is JVD-scoped: a group that exists only under the other
 * OS is present-but-incompatible (VARIANT_UNRESOLVED), not empty.
 */
export function groupHasMembers({ group, consumerJvd, members }) {
  return (members || []).some((m) => m.jvd === consumerJvd && m.group === group);
}
