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

test("consumer: cross-OS Seen-on bucket is validated against its own-OS member", () => {
  // evo-file consumer with a Junos-bucket device must resolve that device
  // against a Junos member — the file OS must not suppress the other bucket.
  const f = validateVariantConsumer({ os: "evo", seenOn: { junos: ["an1_mx204"], evo: [] }, variantRequires: [{ group: "mebs-bgp-overlay", families: ["evpn"] }], jvd: "J1", members: [M()] });
  assert.deepEqual(f, []);
});

test("consumer: cross-OS Seen-on device with no covering member -> VARIANT_UNRESOLVED", () => {
  // The old file-OS-only validator would iterate the empty evo bucket and miss
  // this; both-bucket iteration must catch the uncovered Junos-bucket device.
  const f = validateVariantConsumer({ os: "evo", seenOn: { junos: ["an3"], evo: [] }, variantRequires: [{ group: "mebs-bgp-overlay", families: ["evpn"] }], jvd: "J1", members: [M()] });
  assert.deepEqual(f.map((x) => x.code), [CODES.VARIANT_UNRESOLVED]);
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

// --- Namespaced selector capabilities (ifl:) -----------------------------
const irbSnip = (provides, body) => `/*
 * Topic:   irb logical interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 * Variant group: mebs-irb-form
 *   Provides: ${provides}
 * Highlights:
 *  - member
 */
${body}`;

const IRB_BODY = `interfaces {
    irb {
        unit $UNIT {
            family inet {
                address $IRB_ADDR;
            }
        }
    }
}`;

test("C1. existing bare BGP Provides is unchanged", () => {
  const { header, diagnostics } = parseSnip(memberSnip("evpn, l2vpn", ["evpn", "l2vpn"]));
  assert.deepEqual(diagnostics.map((d) => d.code), []);
  assert.deepEqual(header.variantGroup.provides, ["evpn", "l2vpn"]);
});

test("C2. valid ifl:irb member parses and matches its body", () => {
  const { header, diagnostics } = parseSnip(irbSnip("ifl:irb", IRB_BODY));
  assert.deepEqual(diagnostics.map((d) => d.code), []);
  assert.deepEqual(header.variantGroup.provides, ["ifl:irb"]);
  assert.deepEqual(validateVariantMember({ variantGroup: header.variantGroup, body: IRB_BODY }), []);
});

test("C3. unknown namespace is rejected", () => {
  const { diagnostics } = parseSnip(irbSnip("iface:irb", IRB_BODY));
  assert.ok(diagnostics.map((d) => d.code).includes(CODES.VARIANT_UNKNOWN_NAMESPACE));
});

test("C4. unknown capability inside a known namespace is rejected", () => {
  const { diagnostics } = parseSnip(irbSnip("ifl:bogus", IRB_BODY));
  assert.ok(diagnostics.map((d) => d.code).includes(CODES.VARIANT_UNKNOWN_CAPABILITY));
});

test("C5. mixing a family and a capability is rejected", () => {
  const { diagnostics } = parseSnip(irbSnip("evpn, ifl:irb", IRB_BODY));
  assert.ok(diagnostics.map((d) => d.code).includes(CODES.VARIANT_MIXED_SELECTOR));
});

test("C6. declaring ifl:irb without an irb unit in the body is a mismatch", () => {
  const body = "interfaces {\n    irb {\n    }\n}";
  const { header } = parseSnip(irbSnip("ifl:irb", body));
  assert.deepEqual(
    validateVariantMember({ variantGroup: header.variantGroup, body }).map((f) => f.code),
    [CODES.VARIANT_PROVIDES_MISMATCH],
  );
});

test("C7. consumer keyword must match the selector kind", () => {
  const bad = (b) => parseSnip(`/*
 * Topic:   consumer
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 * Pair with:
 *  - ${b}
 */
routing-instances { X { instance-type vrf; } }`).diagnostics.map((d) => d.code);
  assert.ok(bad("variant:mebs-irb-form families=ifl:irb").includes(CODES.VARIANT_MALFORMED));
  assert.ok(bad("variant:mebs-bgp-overlay capabilities=evpn").includes(CODES.VARIANT_MALFORMED));
  assert.deepEqual(bad("variant:mebs-irb-form capabilities=ifl:irb"), []);
  assert.deepEqual(bad("variant:mebs-bgp-overlay families=evpn"), []);
});

// Device-conditioned resolution: the two IRB forms are one group, selected by
// exact Seen-on membership. Mirrors the real MEBS corpus.
const IRB_INET = {
  jvd: "mebs", os: "evo", group: "mebs-irb-form", provides: ["ifl:irb"],
  seenOn: { junos: ["mse1_mx304", "mse2_mx304"], evo: ["an3_acx7100-48l"] },
  rel: "evo/interfaces/ifl-irb-inet.conf",
};
const IRB_VGA = {
  jvd: "mebs", os: "evo", group: "mebs-irb-form", provides: ["ifl:irb"],
  seenOn: { junos: [], evo: ["meg1_acx7100-32c", "meg2_acx7509"] },
  rel: "evo/interfaces/ifl-irb-virtual-gateway.conf",
};

test("C8. an3 resolves to the plain-inet IRB form", () => {
  const r = resolveVariant({ group: "mebs-irb-form", families: ["ifl:irb"], targetDevice: "an3_acx7100-48l", targetOS: "evo", consumerJvd: "mebs", members: [IRB_INET, IRB_VGA] });
  assert.equal(r.status, "ok");
  assert.equal(r.member.rel, "evo/interfaces/ifl-irb-inet.conf");
});

test("C9. meg1 and meg2 resolve to the virtual-gateway IRB form", () => {
  for (const d of ["meg1_acx7100-32c", "meg2_acx7509"]) {
    const r = resolveVariant({ group: "mebs-irb-form", families: ["ifl:irb"], targetDevice: d, targetOS: "evo", consumerJvd: "mebs", members: [IRB_INET, IRB_VGA] });
    assert.equal(r.status, "ok");
    assert.equal(r.member.rel, "evo/interfaces/ifl-irb-virtual-gateway.conf");
  }
});

test("C10. an unlisted device fails closed as unavailable", () => {
  const r = resolveVariant({ group: "mebs-irb-form", families: ["ifl:irb"], targetDevice: "ma3_acx7100-48l", targetOS: "evo", consumerJvd: "mebs", members: [IRB_INET, IRB_VGA] });
  assert.equal(r.status, "unavailable");
});

test("C11. overlapping device membership fails closed as ambiguous", () => {
  const clash = { ...IRB_VGA, seenOn: { junos: [], evo: ["an3_acx7100-48l"] }, rel: "evo/interfaces/other.conf" };
  const r = resolveVariant({ group: "mebs-irb-form", families: ["ifl:irb"], targetDevice: "an3_acx7100-48l", targetOS: "evo", consumerJvd: "mebs", members: [IRB_INET, clash] });
  assert.equal(r.status, "ambiguous");
});

test("C12. device overlap inside one group is reported", () => {
  const clash = { ...IRB_VGA, seenOn: { junos: [], evo: ["an3_acx7100-48l"] }, rel: "evo/interfaces/other.conf" };
  const f = validateVariantOverlap({ os: "evo", variantGroup: { name: "mebs-irb-form" }, seenOn: IRB_INET.seenOn, selfRel: IRB_INET.rel, members: [IRB_INET, clash] });
  assert.deepEqual(f.map((x) => x.code), [CODES.VARIANT_DEVICE_OVERLAP]);
});

// --- Applicability governs selection; equivalence collapses, never admits ---
import { bodyIdentity } from "./variant-resolve.mjs";

const BODY_A = "interfaces {\n    irb {\n        unit 0 {\n            family inet;\n        }\n    }\n}";
const BODY_B = "interfaces {\n    irb {\n        unit 0 {\n            family inet6;\n        }\n    }\n}";
const mem = (over) => ({ jvd: "J", os: "evo", group: "g", provides: ["x"], seenOn: { junos: [], evo: ["d1"] }, body: BODY_A, rel: "evo/a.conf", ...over });
const NATIVE = mem({});
const FOREIGN = mem({ os: "junos", rel: "junos/a.conf" });
const R = (members, over = {}) =>
  resolveVariant({ group: "g", selectors: ["x"], targetDevice: "d1", targetOS: "evo", consumerJvd: "J", members, ...over });

test("D1. identical bodies collapse; the same-directory representation is preferred", () => {
  const r = R([NATIVE, FOREIGN]);
  assert.equal(r.status, "ok");
  assert.equal(r.member.rel, "evo/a.conf");
  assert.equal(r.crossDirectory, false);
});

test("D2. a lone exact-device other-directory representation is selected and flagged", () => {
  const r = R([FOREIGN]);
  assert.equal(r.status, "ok");
  assert.equal(r.member.rel, "junos/a.conf");
  assert.equal(r.crossDirectory, true);
});

test("D3. same- and other-directory candidates with DIFFERENT bodies are ambiguous", () => {
  const r = R([NATIVE, mem({ os: "junos", rel: "junos/a.conf", body: BODY_B })]);
  assert.equal(r.status, "ambiguous");
});

test("D4. two other-directory candidates with different bodies are ambiguous", () => {
  const r = R([mem({ os: "junos", rel: "junos/a.conf" }), mem({ os: "junos", rel: "junos/b.conf", body: BODY_B })]);
  assert.equal(r.status, "ambiguous");
});

test("D5. candidate order cannot change the result", () => {
  const a = R([NATIVE, FOREIGN]);
  const b = R([FOREIGN, NATIVE]);
  assert.equal(a.member.rel, b.member.rel);
  const c = R([NATIVE, mem({ os: "junos", rel: "junos/a.conf", body: BODY_B })]);
  const d = R([mem({ os: "junos", rel: "junos/a.conf", body: BODY_B }), NATIVE]);
  assert.equal(c.status, d.status);
});

test("D6. an identical body that does not name the device is never admitted", () => {
  const elsewhere = mem({ os: "junos", rel: "junos/a.conf", seenOn: { junos: ["d9"], evo: ["d9"] } });
  assert.equal(R([elsewhere]).status, "unavailable");
});

test("D7. CRLF and LF versions of one emitted body are equivalent", () => {
  assert.equal(bodyIdentity(BODY_A), bodyIdentity(BODY_A.replace(/\n/g, "\r\n")));
  assert.equal(bodyIdentity(BODY_A), bodyIdentity(BODY_A.split("\n").map((l) => l + "   ").join("\n") + "\n\n"));
  const r = R([NATIVE, mem({ os: "junos", rel: "junos/a.conf", body: BODY_A.replace(/\n/g, "\r\n") })]);
  assert.equal(r.status, "ok");
});

test("D8. a configuration difference remains distinct", () => {
  assert.notEqual(bodyIdentity(BODY_A), bodyIdentity(BODY_B));
  assert.notEqual(bodyIdentity(BODY_A), bodyIdentity(BODY_A.replace("unit 0", "unit $UNIT")));
});

test("D9. exact-device Seen-on membership is still mandatory, and JVD still bounds selection", () => {
  assert.equal(R([mem({ seenOn: { junos: [], evo: [] } })]).status, "unavailable");
  assert.equal(R([NATIVE], { consumerJvd: "OTHER" }).status, "unavailable");
  assert.equal(R([NATIVE], { selectors: ["y"] }).status, "unavailable");
});

test("D10. an unknown body identity is never assumed equivalent", () => {
  const noBody = { jvd: "J", os: "junos", group: "g", provides: ["x"], seenOn: { junos: [], evo: ["d1"] }, rel: "junos/a.conf" };
  assert.equal(R([NATIVE, noBody]).status, "ambiguous");
});

test("D11. families is still accepted as a deprecated alias for selectors", () => {
  const a = resolveVariant({ group: "g", families: ["x"], targetDevice: "d1", targetOS: "evo", consumerJvd: "J", members: [NATIVE] });
  assert.equal(a.status, "ok");
});

test("D12. both external syntaxes map into one neutral selector model", () => {
  const p = (b) => parseSnip(`/*
 * Topic:   consumer
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 * Pair with:
 *  - ${b}
 */
routing-instances { X { instance-type vrf; } }`).header.variantRequires[0];
  assert.deepEqual(p("variant:g families=evpn"), { group: "g", families: ["evpn"] });
  assert.deepEqual(p("variant:g capabilities=ifl:irb"), { group: "g", families: ["ifl:irb"] });
});

test("D13. a cross-directory selection is reported, and never blocks", () => {
  const f = validateVariantConsumer({
    os: "evo", seenOn: { junos: [], evo: ["d1"] },
    variantRequires: [{ group: "g", families: ["x"] }], jvd: "J", members: [FOREIGN],
  });
  assert.deepEqual(f.map((x) => x.code), [CODES.VARIANT_CROSS_DIRECTORY]);
  assert.equal(severity(CODES.VARIANT_CROSS_DIRECTORY, { changed: true, seenOnValidation: "complete" }), "warn");
});

test("D14. overlap: identical bodies coexist, differing bodies clash, across directories", () => {
  const withId = (m) => ({ ...m, bodyId: bodyIdentity(m.body) });
  const nat = withId(NATIVE);
  const twin = withId(FOREIGN);
  const other = withId(mem({ os: "junos", rel: "junos/a.conf", body: BODY_B }));
  assert.deepEqual(
    validateVariantOverlap({ os: "evo", variantGroup: { name: "g" }, seenOn: nat.seenOn, selfRel: nat.rel, members: [nat, twin] }),
    [],
  );
  assert.deepEqual(
    validateVariantOverlap({ os: "evo", variantGroup: { name: "g" }, seenOn: nat.seenOn, selfRel: nat.rel, members: [nat, other] })
      .map((x) => x.code),
    [CODES.VARIANT_DEVICE_OVERLAP],
  );
});
