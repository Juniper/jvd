/**
 * snip-validate.test.mjs — contract-enforcement tests (node --test, zero deps).
 *
 *   node --test portal/scripts/snip-validate.test.mjs
 */
import test from "node:test";
import assert from "node:assert/strict";
import { parseSnip, CODES } from "./snip-parse.mjs";
import { validateSnipText, resolveToken, severity, parseSnipLibraryMeta } from "./snip-validate.mjs";

const codes = (findings) => findings.map((f) => f.code);

const INVENTORY = {
  relSet: new Set(["mse1_mx304", "mse2_mx304", "dc1-dc2_ott/dc1_borderleaf1"]),
  basenameCount: new Map([
    ["mse1_mx304", 1],
    ["mse2_mx304", 1],
    ["dc1_borderleaf1", 2], // ambiguous basename across two scenarios
  ]),
};

function snip({ topic = "Something valid", seenJunos = "mse1_mx304", seenEvo = "(none)", pair = "none", vars = "Variables: none", body = "routing-options {\n    autonomous-system 65000;\n}" }) {
  return (
    `/*\n * Topic:   ${topic}\n * Seen on:\n *   Junos: ${seenJunos}\n *   EVO:   ${seenEvo}\n` +
    ` * Pair with:\n *  - ${pair}\n * ${vars}\n */\n${body}\n`
  );
}

test("clean snip produces no findings", () => {
  const findings = validateSnipText(snip({}), { inventory: INVENTORY, snipIndex: new Set() });
  assert.deepEqual(findings, []);
});

test("multiline Topic is detected", () => {
  const text = `/*\n * Topic:   first line wraps to\n *          a second physical line\n * Seen on:\n *   Junos: mse1_mx304\n *   EVO:   (none)\n */\nrouting-options {\n    autonomous-system 65000;\n}\n`;
  assert.ok(codes(parseSnip(text).diagnostics).includes(CODES.TOPIC_MULTILINE));
});

test("path / see token in Seen on is a non-device token", () => {
  const text = snip({ seenEvo: "see evo/transport/rib-groups.conf" });
  const found = codes(validateSnipText(text, { inventory: INVENTORY, snipIndex: new Set() }));
  assert.ok(found.includes(CODES.SEEN_ON_NON_DEVICE_TOKEN));
});

test("unknown device token is flagged against the inventory", () => {
  const text = snip({ seenJunos: "nonexistent_router" });
  const found = codes(validateSnipText(text, { inventory: INVENTORY, snipIndex: new Set() }));
  assert.ok(found.includes(CODES.SEEN_ON_UNKNOWN_DEVICE));
});

test("unresolved Pair with is flagged", () => {
  const text = snip({ pair: "junos/policy/does-not-exist.conf (missing)" });
  const found = codes(validateSnipText(text, { inventory: INVENTORY, snipIndex: new Set(["junos/policy/real.conf"]) }));
  assert.ok(found.includes(CODES.PAIR_WITH_UNRESOLVED));
});

test("approximation prose in Seen on is flagged", () => {
  const text = snip({ seenEvo: "(all EVO PEs)" });
  assert.ok(codes(parseSnip(text).diagnostics).includes(CODES.SEEN_ON_APPROXIMATION));
});

test("inventory resolution: scenario-qualified path and unique basename resolve; ambiguous does not", () => {
  assert.equal(resolveToken("mse1_mx304", INVENTORY), "ok");
  assert.equal(resolveToken("dc1-dc2_ott/dc1_borderleaf1", INVENTORY), "ok");
  assert.equal(resolveToken("dc1_borderleaf1", INVENTORY), "ambiguous");
  assert.equal(resolveToken("ghost", INVENTORY), "unknown");
});

test("undeclared and unused variables are flagged", () => {
  const text = snip({ vars: "Variables:\n *   $DECLARED_UNUSED   e.g. 1", body: "routing-options {\n    router-id $USED_UNDECLARED;\n}" });
  const found = codes(validateSnipText(text, { inventory: INVENTORY, snipIndex: new Set() }));
  assert.ok(found.includes(CODES.VARIABLE_UNDECLARED));
  assert.ok(found.includes(CODES.VARIABLE_UNUSED));
});

test("severity: changed is always error; legacy is partial-warn / complete-error", () => {
  assert.equal(severity(CODES.SEEN_ON_APPROXIMATION, { changed: true, seenOnValidation: "partial" }), "error");
  assert.equal(severity(CODES.SEEN_ON_APPROXIMATION, { changed: false, seenOnValidation: "partial" }), "warn");
  assert.equal(severity(CODES.SEEN_ON_APPROXIMATION, { changed: false, seenOnValidation: "complete" }), "error");
});

test("scenario-qualified path token resolves end-to-end (no non-device / unknown finding)", () => {
  const text = snip({ seenJunos: "dc1-dc2_ott/dc1_borderleaf1" });
  const found = codes(validateSnipText(text, { inventory: INVENTORY, snipIndex: new Set() }));
  assert.ok(!found.includes(CODES.SEEN_ON_NON_DEVICE_TOKEN));
  assert.ok(!found.includes(CODES.SEEN_ON_UNKNOWN_DEVICE));
});

test("a reserved field after Pair with does not leak its bullets into dependencies", () => {
  const text =
    `/*\n * Topic:   x\n * Seen on:\n *   Junos: mse1_mx304\n *   EVO:   (none)\n` +
    ` * Pair with:\n *  - junos/policy/real.conf\n * Peers with:\n *  - junos/other/leaked.conf\n */\n` +
    `routing-options {\n    autonomous-system 65000;\n}\n`;
  const parsed = parseSnip(text);
  assert.ok(codes(parsed.diagnostics).includes(CODES.UNKNOWN_HEADER_SECTION));
  assert.deepEqual(parsed.header.pairWith, ["junos/policy/real.conf"]);
});

test("a completely absent Seen on section is flagged", () => {
  const text = `/*\n * Topic:   no seen on\n * Highlights:\n *  - stuff\n */\nrouting-options {\n    autonomous-system 65000;\n}\n`;
  assert.ok(codes(parseSnip(text).diagnostics).includes(CODES.MISSING_SEEN_ON_SECTION));
});

test("the complete ratchet escalates only Seen-on applicability findings", () => {
  // Non-applicability debt stays a warning even under complete.
  assert.equal(severity(CODES.TOPIC_MULTILINE, { changed: false, seenOnValidation: "complete" }), "warn");
  assert.equal(severity(CODES.VARIABLE_UNUSED, { changed: false, seenOnValidation: "complete" }), "warn");
  // Applicability debt escalates.
  assert.equal(severity(CODES.SEEN_ON_UNKNOWN_DEVICE, { changed: false, seenOnValidation: "complete" }), "error");
});

test("a bare variable declaration (no example) is accepted", () => {
  const text = snip({ vars: "Variables:\n *   $BARE", body: "routing-options {\n    router-id $BARE;\n}" });
  const found = codes(validateSnipText(text, { inventory: INVENTORY, snipIndex: new Set() }));
  assert.ok(!found.includes(CODES.VARIABLE_UNDECLARED));
  assert.ok(!found.includes(CODES.VARIABLE_UNUSED));
});

// --- Braced vs bare variable equivalence ($FOO === ${FOO}) ---

test("braced use of a bare-declared variable is neither undeclared nor unused", () => {
  const text = snip({ vars: "Variables:\n *   $FOO   e.g. 1", body: "routing-options {\n    router-id ${FOO};\n}" });
  const found = codes(validateSnipText(text, { inventory: INVENTORY, snipIndex: new Set() }));
  assert.ok(!found.includes(CODES.VARIABLE_UNDECLARED));
  assert.ok(!found.includes(CODES.VARIABLE_UNUSED));
});

test("bare use of a braced-declared variable is neither undeclared nor unused", () => {
  const text = snip({ vars: "Variables:\n *   ${FOO}   e.g. 1", body: "routing-options {\n    router-id $FOO;\n}" });
  const found = codes(validateSnipText(text, { inventory: INVENTORY, snipIndex: new Set() }));
  assert.ok(!found.includes(CODES.VARIABLE_UNDECLARED));
  assert.ok(!found.includes(CODES.VARIABLE_UNUSED));
});

test("braced-only declaration and braced-only use resolve to one variable", () => {
  const text = snip({ vars: "Variables:\n *   ${FOO}   e.g. 1", body: "routing-options {\n    router-id ${FOO};\n}" });
  const found = codes(validateSnipText(text, { inventory: INVENTORY, snipIndex: new Set() }));
  assert.ok(!found.includes(CODES.VARIABLE_UNDECLARED));
  assert.ok(!found.includes(CODES.VARIABLE_UNUSED));
});

test("repeated mixed braced/bare uses do not duplicate a declaration or finding", () => {
  const text = snip({ vars: "Variables:\n *   $FOO   e.g. 1", body: "routing-options {\n    router-id $FOO;\n    description ${FOO}-${FOO};\n}" });
  const found = codes(validateSnipText(text, { inventory: INVENTORY, snipIndex: new Set() }));
  assert.ok(!found.includes(CODES.VARIABLE_UNDECLARED));
  assert.ok(!found.includes(CODES.VARIABLE_UNUSED));
});

test("a genuinely undeclared braced variable is still flagged", () => {
  const text = snip({ vars: "Variables: none", body: "routing-options {\n    router-id ${FOO};\n}" });
  const found = validateSnipText(text, { inventory: INVENTORY, snipIndex: new Set() });
  const undecl = found.filter((f) => f.code === CODES.VARIABLE_UNDECLARED);
  assert.equal(undecl.length, 1);
  assert.equal(undecl[0].detail, "$FOO");
});

test("a declared-but-unused variable is flagged regardless of declaration spelling", () => {
  const text = snip({ vars: "Variables:\n *   ${FOO}   e.g. 1", body: "routing-options {\n    autonomous-system 65000;\n}" });
  const found = validateSnipText(text, { inventory: INVENTORY, snipIndex: new Set() });
  const unused = found.filter((f) => f.code === CODES.VARIABLE_UNUSED);
  assert.equal(unused.length, 1);
  assert.equal(unused[0].detail, "$FOO");
});

test("bare-only variables are unaffected by brace normalization (no regression)", () => {
  const text = snip({ vars: "Variables:\n *   $A / $B   e.g. 1", body: "routing-options {\n    router-id $A;\n    autonomous-system $B;\n}" });
  const found = codes(validateSnipText(text, { inventory: INVENTORY, snipIndex: new Set() }));
  assert.ok(!found.includes(CODES.VARIABLE_UNDECLARED));
  assert.ok(!found.includes(CODES.VARIABLE_UNUSED));
});

// --- Topic physical-line enforcement (backslash continuation is not canonical) ---

test("a canonical one-physical-line Topic is clean", () => {
  assert.ok(!codes(parseSnip(snip({})).diagnostics).includes(CODES.TOPIC_MULTILINE));
});

test("a Topic continued with a trailing backslash still emits TOPIC_MULTILINE", () => {
  const text = `/*\n * Topic:   first physical line \\\n *          a second physical line\n * Seen on:\n *   Junos: mse1_mx304\n *   EVO:   (none)\n */\nrouting-options {\n    autonomous-system 65000;\n}\n`;
  assert.ok(codes(parseSnip(text).diagnostics).includes(CODES.TOPIC_MULTILINE));
});

test("a wrapped Topic continuation does not leak into the following section", () => {
  const text = `/*\n * Topic:   first physical line \\\n *          a second physical line\n * Seen on:\n *   Junos: mse1_mx304\n *   EVO:   (none)\n */\nrouting-options {\n    autonomous-system 65000;\n}\n`;
  const { header } = parseSnip(text);
  assert.equal(header.seenOn.junos[0], "mse1_mx304");
  assert.ok(!header.topic.includes("second physical line"));
});

test("TOPIC_MULTILINE stays a warning under complete and errors only on change", () => {
  assert.equal(severity(CODES.TOPIC_MULTILINE, { changed: false, seenOnValidation: "complete" }), "warn");
  assert.equal(severity(CODES.TOPIC_MULTILINE, { changed: true, seenOnValidation: "partial" }), "error");
});

test("_snip-library.json metadata: valid parses, malformed throws", () => {
  assert.equal(parseSnipLibraryMeta('{"schemaVersion":1,"seenOnValidation":"complete"}'), "complete");
  assert.throws(() => parseSnipLibraryMeta("{ not json"));
  assert.throws(() => parseSnipLibraryMeta('{"schemaVersion":2,"seenOnValidation":"partial"}'));
  assert.throws(() => parseSnipLibraryMeta('{"schemaVersion":1,"seenOnValidation":"typo"}'));
});

function seenOnText(junosRow, evoRow) {
  return `/*\n * Topic:   x\n * Seen on:\n *   Junos: ${junosRow}\n *   EVO:   ${evoRow}\n */\nrouting-options {\n    autonomous-system 65000;\n}\n`;
}

test("Seen on: empty bucket, (none) with a device, and (all) are all flagged", () => {
  assert.ok(codes(parseSnip(seenOnText("", "(none)")).diagnostics).includes(CODES.SEEN_ON_APPROXIMATION));
  assert.ok(codes(parseSnip(seenOnText("(none) mse1_mx304", "(none)")).diagnostics).includes(CODES.SEEN_ON_APPROXIMATION));
  assert.ok(codes(parseSnip(seenOnText("(all)", "(none)")).diagnostics).includes(CODES.SEEN_ON_APPROXIMATION));
  // A lone (none) bucket is valid.
  const clean = codes(parseSnip(seenOnText("mse1_mx304", "(none)")).diagnostics);
  assert.ok(!clean.includes(CODES.SEEN_ON_APPROXIMATION));
});

test("deprecated Variant/Role fields are reported as LEGACY_HEADER_SECTION", () => {
  const text = `/*\n * Topic:   x\n * Variant: Junos OS\n * Seen on:\n *   Junos: mse1_mx304\n *   EVO:   (none)\n */\nrouting-options {\n    autonomous-system 65000;\n}\n`;
  assert.ok(codes(parseSnip(text).diagnostics).includes(CODES.LEGACY_HEADER_SECTION));
});

test("a misspelled known field is flagged and does not leak bullets", () => {
  const text =
    `/*\n * Topic:   x\n * Seen on:\n *   Junos: mse1_mx304\n *   EVO:   (none)\n` +
    ` * Pair with:\n *  - junos/policy/real.conf\n * Highlihgts:\n *  - junos/other/leaked.conf\n */\n` +
    `routing-options {\n    autonomous-system 65000;\n}\n`;
  const parsed = parseSnip(text);
  assert.ok(codes(parsed.diagnostics).includes(CODES.UNKNOWN_HEADER_SECTION));
  assert.deepEqual(parsed.header.pairWith, ["junos/policy/real.conf"]);
});

test("MISSING_HEADER escalates under a complete library", () => {
  assert.equal(severity(CODES.MISSING_HEADER, { changed: false, seenOnValidation: "complete" }), "error");
});

test("canonical order: JVD service mapping before Variables is valid", () => {
  const text =
    `/*\n * Topic:   x\n * Seen on:\n *   Junos: mse1_mx304\n *   EVO:   (none)\n` +
    ` * JVD service mapping:\n *   E-Line -> evpn-vpws\n * Variables: none\n */\n` +
    `routing-options {\n    autonomous-system 65000;\n}\n`;
  assert.ok(!codes(parseSnip(text).diagnostics).includes(CODES.INVALID_SECTION_ORDER));
});

test("Variables before JVD service mapping is out of order", () => {
  const text =
    `/*\n * Topic:   x\n * Seen on:\n *   Junos: mse1_mx304\n *   EVO:   (none)\n` +
    ` * Variables: none\n * JVD service mapping:\n *   E-Line -> evpn-vpws\n */\n` +
    `routing-options {\n    autonomous-system 65000;\n}\n`;
  assert.ok(codes(parseSnip(text).diagnostics).includes(CODES.INVALID_SECTION_ORDER));
});

test("body prose beginning `apply-groups ` does not overwrite Topic", () => {
  const text =
    `/*\n * Topic:   Edge LAG with EVPN ESI multihoming\n * Seen on:\n *   Junos: mse1_mx304\n *   EVO:   (none)\n` +
    ` *\n * Common edge knobs come from\n * apply-groups GR-EDGE-INTF-MH (see apply-groups/gr-edge-intf-mh).\n */\n` +
    `interfaces {\n    ae11 {\n    }\n}\n`;
  const parsed = parseSnip(text);
  assert.equal(parsed.header.topic, "Edge LAG with EVPN ESI multihoming");
  assert.ok(!codes(parsed.diagnostics).includes(CODES.INVALID_SECTION_ORDER));
});

test("body prose beginning `Variant of ` is not a legacy field", () => {
  const text =
    `/*\n * Apply-group: GR-EDGE-INTF-MH\n * Seen on:\n *   Junos: mse1_mx304\n *   EVO:   (none)\n` +
    ` *\n * Variant of GR-EDGE-INTF for multi-homed edge interfaces (no\n * hold-time configured).\n */\n` +
    `groups {\n    GR-EDGE-INTF-MH {\n    }\n}\n`;
  assert.ok(!codes(parseSnip(text).diagnostics).includes(CODES.LEGACY_HEADER_SECTION));
});

test("real Apply-group: and Variant: fields are still recognized", () => {
  const apply = `/*\n * Apply-group: GR-EDGE-INTF\n * Seen on:\n *   Junos: mse1_mx304\n *   EVO:   (none)\n */\ngroups {\n    GR-EDGE-INTF {\n    }\n}\n`;
  assert.equal(parseSnip(apply).header.topic, "Apply-group: GR-EDGE-INTF");
  const variant = `/*\n * Topic:   x\n * Variant: Junos OS\n * Seen on:\n *   Junos: mse1_mx304\n *   EVO:   (none)\n */\nrouting-options {\n    autonomous-system 65000;\n}\n`;
  assert.ok(codes(parseSnip(variant).diagnostics).includes(CODES.LEGACY_HEADER_SECTION));
});

test("Variables with a `(...)` annotation and no colon parses but is legacy syntax", () => {
  const text =
    `/*\n * Topic:   x\n * Seen on:\n *   Junos: mse1_mx304\n *   EVO:   (none)\n` +
    ` * Variables (none \u2014 literal)\n */\nforwarding-options {\n    multicast-replication;\n}\n`;
  const found = codes(parseSnip(text).diagnostics);
  assert.ok(found.includes(CODES.LEGACY_HEADER_SYNTAX));
  assert.ok(!found.includes(CODES.UNKNOWN_HEADER_SECTION));
  assert.ok(!found.includes(CODES.LEGACY_HEADER_SECTION));
});

test("a `(annotation):` header (colon present) is canonical, not legacy syntax", () => {
  const text =
    `/*\n * Topic:   x\n * Seen on:\n *   Junos: mse1_mx304\n *   EVO:   (none)\n` +
    ` * Variables (example values from mse1_mx304):\n *   $VAR   e.g. 1\n */\n` +
    `routing-options {\n    router-id $VAR;\n}\n`;
  assert.ok(!codes(parseSnip(text).diagnostics).includes(CODES.LEGACY_HEADER_SYNTAX));
});

test("LEGACY_HEADER_SYNTAX errors on change, warns when legacy", () => {
  assert.equal(severity(CODES.LEGACY_HEADER_SYNTAX, { changed: true, seenOnValidation: "partial" }), "error");
  assert.equal(severity(CODES.LEGACY_HEADER_SYNTAX, { changed: false, seenOnValidation: "partial" }), "warn");
  // Not an applicability code: stays a warning even under complete.
  assert.equal(severity(CODES.LEGACY_HEADER_SYNTAX, { changed: false, seenOnValidation: "complete" }), "warn");
});

test("Pair with carries a `(...)` annotation before its colon", () => {
  const text =
    `/*\n * Topic:   x\n * Seen on:\n *   Junos: mse1_mx304\n *   EVO:   (none)\n` +
    ` * Highlights:\n *  - a highlight\n * Pair with (same-device dependencies):\n *  - junos/policy/real.conf\n */\n` +
    `routing-options {\n    autonomous-system 65000;\n}\n`;
  const parsed = parseSnip(text);
  assert.deepEqual(parsed.header.highlights, ["a highlight"]);
  assert.deepEqual(parsed.header.pairWith, ["junos/policy/real.conf"]);
});

test("a `Pair with junos/...` prose sentence is not a Pair with header", () => {
  const text =
    `/*\n * Topic:   x\n * Seen on:\n *   Junos: mse1_mx304\n *   EVO:   (none)\n` +
    ` *\n * Pair with junos/cos/schedulers.conf for the matching\n * scheduler-map definitions.\n` +
    ` * Pair with:\n *  - junos/cos/schedulers.conf\n */\nrouting-options {\n    autonomous-system 65000;\n}\n`;
  assert.deepEqual(parseSnip(text).header.pairWith, ["junos/cos/schedulers.conf"]);
});
