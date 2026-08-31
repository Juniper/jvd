import { test } from "node:test";
import assert from "node:assert/strict";
import { parseSnip, CODES } from "./snip-parse.mjs";
import { resolveVariant } from "./variant-resolve.mjs";
import {
  severity,
  validateSnipText,
  validateVariantMember,
  validateVariantConsumer,
  validateVariantOverlap,
} from "./snip-validate.mjs";

// --- helpers -------------------------------------------------------------
const codes = (r) => r.diagnostics.map((d) => d.code);

/** A member descriptor for the resolver. */
const M = (over = {}) => ({
  jvd: "J1",
  os: "junos",
  group: "mebs-bgp-overlay",
  provides: ["evpn", "l2vpn"],
  seenOn: { junos: ["an1_mx204"], evo: [] },
  rel: "junos/transport/a.conf",
  ...over,
});

const memberSnip = (provides, bodyFamilies) => `/*
 * Topic:   overlay member
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   (none)
 * Variant group: mebs-bgp-overlay
 *   Provides: ${provides}
 * Highlights:
 *  - member
 */
protocols {
    bgp {
        group G {
${bodyFamilies.map((f) => `            family ${f} { signaling; }`).join("\n")}
        }
    }
}`;

// --- resolver (1-5, 11, 12) ---------------------------------------------
test("1. compatible member resolves", () => {
  const r = resolveVariant({ group: "mebs-bgp-overlay", families: ["evpn"], targetDevice: "an1_mx204", targetOS: "junos", consumerJvd: "J1", members: [M()] });
  assert.equal(r.status, "ok");
});

test("2. wrong OS is unavailable", () => {
  const r = resolveVariant({ group: "mebs-bgp-overlay", families: ["evpn"], targetDevice: "an1_mx204", targetOS: "evo", consumerJvd: "J1", members: [M()] });
  assert.equal(r.status, "unavailable");
});

test("3. missing requested family is unavailable", () => {
  const r = resolveVariant({ group: "mebs-bgp-overlay", families: ["inet-vpn"], targetDevice: "an1_mx204", targetOS: "junos", consumerJvd: "J1", members: [M()] });
  assert.equal(r.status, "unavailable");
});

test("4. two applicable members are ambiguous", () => {
  const r = resolveVariant({ group: "mebs-bgp-overlay", families: ["evpn"], targetDevice: "an1_mx204", targetOS: "junos", consumerJvd: "J1", members: [M(), M({ rel: "junos/transport/b.conf" })] });
  assert.equal(r.status, "ambiguous");
});

test("5. a no-BGP device is unavailable", () => {
  const r = resolveVariant({ group: "mebs-bgp-overlay", families: ["evpn"], targetDevice: "ma2_mx204", targetOS: "junos", consumerJvd: "J1", members: [M()] });
  assert.equal(r.status, "unavailable");
});

test("11. atomic multi-family requires one member providing all families", () => {
  const both = M({ provides: ["evpn", "l2vpn"] });
  assert.equal(resolveVariant({ group: "mebs-bgp-overlay", families: ["evpn", "l2vpn"], targetDevice: "an1_mx204", targetOS: "junos", consumerJvd: "J1", members: [both] }).status, "ok");
  const onlyOne = M({ provides: ["evpn"] });
  assert.equal(resolveVariant({ group: "mebs-bgp-overlay", families: ["evpn", "l2vpn"], targetDevice: "an1_mx204", targetOS: "junos", consumerJvd: "J1", members: [onlyOne] }).status, "unavailable");
});

test("12. same group name in another JVD is ignored", () => {
  const r = resolveVariant({ group: "mebs-bgp-overlay", families: ["evpn"], targetDevice: "an1_mx204", targetOS: "junos", consumerJvd: "J2", members: [M({ jvd: "J1" })] });
  assert.equal(r.status, "unavailable");
});

// --- member validation (8, 9) -------------------------------------------
test("8. declared capability absent from body -> mismatch", () => {
  const f = validateVariantMember({ variantGroup: { name: "g", provides: ["evpn", "l2vpn", "inet-vpn"] }, body: "protocols { bgp { group G { family evpn { signaling; } family l2vpn { signaling; } } } }" });
  assert.deepEqual(f.map((x) => x.code), [CODES.VARIANT_PROVIDES_MISMATCH]);
});

test("9. body capability omitted from Provides -> mismatch", () => {
  const f = validateVariantMember({ variantGroup: { name: "g", provides: ["evpn"] }, body: "protocols { bgp { group G { family evpn { signaling; } family l2vpn { signaling; } } } }" });
  assert.deepEqual(f.map((x) => x.code), [CODES.VARIANT_PROVIDES_MISMATCH]);
});

test("member: exact Provides == body -> no finding", () => {
  const f = validateVariantMember({ variantGroup: { name: "g", provides: ["evpn", "l2vpn"] }, body: "protocols { bgp { group G { family evpn { signaling; } family l2vpn { signaling; } } } }" });
  assert.deepEqual(f, []);
});

// --- group overlap (10) --------------------------------------------------
test("10. same-device member overlap -> VARIANT_DEVICE_OVERLAP", () => {
  const members = [
    { os: "junos", group: "g", seenOn: { junos: ["an1_mx204"], evo: [] }, rel: "junos/transport/a.conf", variantGroup: { name: "g" } },
    { os: "junos", group: "g", seenOn: { junos: ["an1_mx204"], evo: [] }, rel: "junos/transport/b.conf", variantGroup: { name: "g" } },
  ];
  const f = validateVariantOverlap({ os: "junos", variantGroup: { name: "g" }, seenOn: { junos: ["an1_mx204"], evo: [] }, selfRel: "junos/transport/a.conf", members });
  assert.deepEqual(f.map((x) => x.code), [CODES.VARIANT_DEVICE_OVERLAP]);
});

// --- consumer validation (7 + unresolved/ambiguous/group_empty) ----------
test("7. a service without a variant requirement selects no overlay", () => {
  assert.deepEqual(validateVariantConsumer({ os: "junos", seenOn: { junos: ["an1_mx204"], evo: [] }, variantRequires: [], jvd: "J1", members: [M()] }), []);
});

test("consumer: unresolved when no member covers the device", () => {
  const f = validateVariantConsumer({ os: "junos", seenOn: { junos: ["an3"], evo: [] }, variantRequires: [{ group: "mebs-bgp-overlay", families: ["evpn"] }], jvd: "J1", members: [M()] });
  assert.deepEqual(f.map((x) => x.code), [CODES.VARIANT_UNRESOLVED]);
});

test("consumer: ambiguous when two members cover the device", () => {
  const f = validateVariantConsumer({ os: "junos", seenOn: { junos: ["an1_mx204"], evo: [] }, variantRequires: [{ group: "mebs-bgp-overlay", families: ["evpn"] }], jvd: "J1", members: [M(), M({ rel: "junos/transport/b.conf" })] });
  assert.deepEqual(f.map((x) => x.code), [CODES.VARIANT_AMBIGUOUS]);
});

test("consumer: referenced group with no members -> VARIANT_GROUP_EMPTY", () => {
  const f = validateVariantConsumer({ os: "junos", seenOn: { junos: ["an1_mx204"], evo: [] }, variantRequires: [{ group: "ghost", families: ["evpn"] }], jvd: "J1", members: [M()] });
  assert.deepEqual(f.map((x) => x.code), [CODES.VARIANT_GROUP_EMPTY]);
});

// --- parser (6, 13, 14, 15, 17) + well-formed ---------------------------
test("6. ordinary Pair with remains unchanged", () => {
  const text = `/*
 * Topic:   x
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   (none)
 * Pair with:
 *  - junos/transport/rib-groups.conf
 */
protocols { bgp { } }`;
  const { header } = parseSnip(text);
  assert.deepEqual(header.pairWith, ["junos/transport/rib-groups.conf"]);
  assert.equal(header.variantGroup, null);
  assert.deepEqual(header.variantRequires, []);
});

test("well-formed member parses variantGroup", () => {
  const { header, diagnostics } = parseSnip(memberSnip("evpn, l2vpn", ["evpn", "l2vpn"]));
  assert.deepEqual(header.variantGroup, { name: "mebs-bgp-overlay", provides: ["evpn", "l2vpn"] });
  assert.deepEqual(diagnostics, []);
});

test("well-formed consumer parses atomic multi-family requirement", () => {
  const text = `/*
 * Topic:   consumer
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   (none)
 * Pair with:
 *  - variant:mebs-bgp-overlay families=inet-vpn,inet6-vpn
 */
protocols { bgp { } }`;
  const { header } = parseSnip(text);
  assert.deepEqual(header.variantRequires, [{ group: "mebs-bgp-overlay", families: ["inet-vpn", "inet6-vpn"] }]);
  assert.deepEqual(header.pairWith, []);
});

test("13. malformed member syntax (bad group name) -> VARIANT_MALFORMED", () => {
  const text = `/*
 * Topic:   x
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   (none)
 * Variant group: Bad_Name
 *   Provides: evpn
 */
protocols { bgp { } }`;
  assert.ok(codes(parseSnip(text)).includes(CODES.VARIANT_MALFORMED));
});

test("14. malformed consumer bullet (singular family=) -> VARIANT_MALFORMED, not pairWith", () => {
  const text = `/*
 * Topic:   x
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   (none)
 * Pair with:
 *  - variant:mebs-bgp-overlay family=evpn
 */
protocols { bgp { } }`;
  const { header, diagnostics } = parseSnip(text);
  assert.ok(diagnostics.map((d) => d.code).includes(CODES.VARIANT_MALFORMED));
  assert.deepEqual(header.pairWith, []);
  assert.deepEqual(header.variantRequires, []);
});

test("15. unknown capability -> UNKNOWN_FAMILY (Provides) and MALFORMED (requires)", () => {
  const providesText = `/*
 * Topic:   x
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   (none)
 * Variant group: mebs-bgp-overlay
 *   Provides: evpn, bogus
 */
protocols { bgp { group G { family evpn { signaling; } } } }`;
  assert.ok(codes(parseSnip(providesText)).includes(CODES.VARIANT_PROVIDES_UNKNOWN_FAMILY));

  const requiresText = `/*
 * Topic:   x
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   (none)
 * Pair with:
 *  - variant:mebs-bgp-overlay families=bogus
 */
protocols { bgp { } }`;
  const { header, diagnostics } = parseSnip(requiresText);
  assert.ok(diagnostics.map((d) => d.code).includes(CODES.VARIANT_MALFORMED));
  assert.deepEqual(header.variantRequires, []);
});

test("17. backward-compatible parsing with no variant fields", () => {
  const text = `/*
 * Topic:   plain
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   (none)
 */
protocols { bgp { } }`;
  const { header } = parseSnip(text);
  assert.equal(header.variantGroup, null);
  assert.deepEqual(header.variantRequires, []);
});

// misplaced Variant group (after Highlights) -> INVALID_SECTION_ORDER
test("Variant group after Highlights -> INVALID_SECTION_ORDER", () => {
  const text = `/*
 * Topic:   x
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   (none)
 * Highlights:
 *  - foo
 * Variant group: mebs-bgp-overlay
 *   Provides: evpn
 */
protocols { bgp { group G { family evpn { signaling; } } } }`;
  assert.ok(codes(parseSnip(text)).includes(CODES.INVALID_SECTION_ORDER));
});

// --- validateSnipText wiring (16) ---------------------------------------
test("16. variant bullets never trigger PAIR_WITH_UNRESOLVED", () => {
  const text = `/*
 * Topic:   x
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   (none)
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 */
protocols { bgp { } }`;
  const findings = validateSnipText(text, { snipIndex: new Set() });
  assert.ok(!findings.map((f) => f.code).includes(CODES.PAIR_WITH_UNRESOLVED));
});

// --- severity (18, 19) ---------------------------------------------------
test("18. complete-JVD severity blocks unchanged member integrity failures", () => {
  assert.equal(severity(CODES.VARIANT_PROVIDES_MISMATCH, { changed: false, seenOnValidation: "complete" }), "error");
  assert.equal(severity(CODES.VARIANT_DEVICE_OVERLAP, { changed: false, seenOnValidation: "complete" }), "error");
});

test("19. partial legacy severity preserves the ratchet", () => {
  assert.equal(severity(CODES.VARIANT_PROVIDES_MISMATCH, { changed: false, seenOnValidation: "partial" }), "warn");
  assert.equal(severity(CODES.VARIANT_PROVIDES_MISMATCH, { changed: true, seenOnValidation: "partial" }), "error");
});

// 20. Bounded capability-scanner cases are covered in bgp-capabilities.test.mjs.

// --- Finding 1: Provides completeness / placement / duplication ----------
test("F1: Variant group with no Provides -> VARIANT_MALFORMED", () => {
  const text = `/*
 * Topic:   x
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   (none)
 * Variant group: mebs-bgp-overlay
 */
protocols { bgp { group G { family evpn { signaling; } } } }`;
  const { header, diagnostics } = parseSnip(text);
  assert.ok(diagnostics.map((d) => d.code).includes(CODES.VARIANT_MALFORMED));
  assert.deepEqual(header.variantGroup, { name: "mebs-bgp-overlay", provides: [] });
});

test("F1: empty group + no capability body still flags (no silent pass)", () => {
  const text = `/*
 * Topic:   x
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   (none)
 * Variant group: mebs-bgp-overlay
 */
protocols { bgp { } }`;
  assert.ok(codes(parseSnip(text)).includes(CODES.VARIANT_MALFORMED));
});

test("F1: misplaced Provides (no member section) -> VARIANT_MALFORMED", () => {
  const text = `/*
 * Topic:   x
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   (none)
 *   Provides: evpn
 */
protocols { bgp { } }`;
  assert.ok(codes(parseSnip(text)).includes(CODES.VARIANT_MALFORMED));
});

test("F1: duplicate Provides -> VARIANT_MALFORMED, first kept", () => {
  const text = `/*
 * Topic:   x
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   (none)
 * Variant group: mebs-bgp-overlay
 *   Provides: evpn
 *   Provides: l2vpn
 */
protocols { bgp { group G { family evpn { signaling; } } } }`;
  const { header, diagnostics } = parseSnip(text);
  assert.ok(diagnostics.map((d) => d.code).includes(CODES.VARIANT_MALFORMED));
  assert.deepEqual(header.variantGroup.provides, ["evpn"]);
});

test("F1: duplicate Variant group -> VARIANT_MALFORMED, first kept", () => {
  const text = `/*
 * Topic:   x
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   (none)
 * Variant group: first-group
 *   Provides: evpn
 * Variant group: second-group
 *   Provides: l2vpn
 */
protocols { bgp { group G { family evpn { signaling; } } } }`;
  const { header, diagnostics } = parseSnip(text);
  assert.ok(diagnostics.map((d) => d.code).includes(CODES.VARIANT_MALFORMED));
  assert.equal(header.variantGroup.name, "first-group");
  assert.deepEqual(header.variantGroup.provides, ["evpn"]);
});

// --- Finding 2: wrong-OS group is UNRESOLVED, not GROUP_EMPTY ------------
test("F2: group exists only under other OS -> UNRESOLVED (not GROUP_EMPTY)", () => {
  const junosMember = M({ os: "junos", seenOn: { junos: ["an1_mx204"], evo: [] } });
  const f = validateVariantConsumer({
    os: "evo",
    seenOn: { junos: [], evo: ["ma1-1_acx7024"] },
    variantRequires: [{ group: "mebs-bgp-overlay", families: ["evpn"] }],
    jvd: "J1",
    members: [junosMember],
  });
  assert.deepEqual(f.map((x) => x.code), [CODES.VARIANT_UNRESOLVED]);
});
