/**
 * snip-validate.test.mjs — contract-enforcement tests (node --test, zero deps).
 *
 *   node --test portal/scripts/snip-validate.test.mjs
 */
import test from "node:test";
import assert from "node:assert/strict";
import { parseSnip, CODES } from "./snip-parse.mjs";
import { validateSnipText, resolveToken, severity } from "./snip-validate.mjs";

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
