import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createHash } from 'node:crypto';
import { readBindingsInputs, generateBindings, bindingsFreshness } from "./generate-bindings.mjs";
import {
  validateBindingsEvidence,
  verifyCountEvidence,
  generatePeerEvidence,
  verifyPeerEvidence,
  evidenceClaimChanged,
  materializeCountHeader,
  materializeCounts,
  materializePeerHeader,
  materializePeers,
  verifyEnrolledEvidence,
  countClaim,
} from "./snip-evidence.mjs";
import { selectEvidenceChecks } from "./validation-scope.mjs";
import { parseLibraryValidation, validateSnipText } from "./snip-validate.mjs";
import { parseSnip } from './snip-parse.mjs';
import { confinedPath, readConfinedFile, writeConfinedFile } from "./snip-files.mjs";

test("evidence filesystem rejects symlink escapes and replaces regular files atomically", (context) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "confined-evidence-"));
  context.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  const root = path.join(temporary, "configuration");
  fs.mkdirSync(root);
  const outside = path.join(temporary, "outside.txt");
  fs.writeFileSync(outside, "sentinel");
  const output = path.join(root, "output.json");
  fs.symlinkSync(outside, output);
  assert.throws(() => readConfinedFile(root, "output.json"), /Symbolic links/);
  assert.throws(() => writeConfinedFile(root, "output.json", "changed"), /Symbolic links/);
  assert.throws(() => confinedPath(root, "../outside.txt"), /escapes/);
  fs.symlinkSync(temporary, path.join(root, "linked-parent"));
  assert.throws(
    () => writeConfinedFile(root, "linked-parent/outside.txt", "changed"),
    /Symbolic links/,
  );
  fs.unlinkSync(output);
  fs.linkSync(outside, output);
  writeConfinedFile(root, "output.json", "replacement", { expectedText: "sentinel" });
  assert.equal(fs.readFileSync(outside, "utf8"), "sentinel");
  assert.equal(readConfinedFile(root, "output.json", "utf8"), "replacement");
  assert.throws(
    () => writeConfinedFile(root, "output.json", "bad", { expectedText: "stale" }),
    /changed during generation/,
  );
  assert.equal(readConfinedFile(root, "output.json", "utf8"), "replacement");
  fs.symlinkSync(path.join(temporary, "absent"), path.join(root, "dangling.json"));
  assert.throws(() => writeConfinedFile(root, "dangling.json", "bad"), /Symbolic links/);
  assert.ok(!fs.readdirSync(root).some((file) => file.startsWith(".snip-")));
});

test("materialization and peer generation reject linked assets without changing external targets", (context) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "evidence-symlinks-"));
  context.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  const configuration = path.join(temporary, "configuration");
  fs.mkdirSync(path.join(configuration, "conf"), { recursive: true });
  fs.mkdirSync(path.join(configuration, "snips/junos/interfaces"), { recursive: true });
  const source = path.join(configuration, "conf/device.conf");
  fs.writeFileSync(source, "interfaces { ae1 { unit 0 { family inet; } } }");
  const snippet = path.join(configuration, "snips/junos/interfaces/unit.conf");
  const text =
    "/*\n * Topic: Unit\n * Seen on:\n *   Junos: device\n *   EVO: (none)\n */\ninterfaces { $IFD { unit $UNIT { family inet; } } }\n";
  fs.writeFileSync(snippet, text);
  const ledger = path.join(configuration, "snips/_bindings.json");
  fs.writeFileSync(ledger, JSON.stringify(generateBindings(configuration)));
  const outside = path.join(temporary, "outside.conf");
  fs.writeFileSync(outside, text);
  fs.unlinkSync(snippet);
  fs.symlinkSync(outside, snippet);
  assert.throws(() => materializeCounts(configuration), /Symbolic links/);
  assert.equal(fs.readFileSync(outside, "utf8"), text);
  fs.unlinkSync(snippet);
  fs.writeFileSync(snippet, text);
  const peerOutput = path.join(configuration, "snips/_peers.json");
  fs.symlinkSync(outside, peerOutput);
  const script = fileURLToPath(new URL("./snip-evidence.mjs", import.meta.url));
  assert.throws(
    () =>
      execFileSync(
        process.execPath,
        [script, "--configuration", configuration, "--generate-peers"],
        { stdio: "pipe" },
      ),
    (error) => /Symbolic links/.test(error.stderr.toString()),
  );
  assert.equal(fs.readFileSync(outside, "utf8"), text);
  fs.unlinkSync(peerOutput);
  fs.unlinkSync(source);
  fs.symlinkSync(outside, source);
  assert.throws(() => readBindingsInputs(configuration), /Symbolic links/);
});

test("registered byte-identical mirrors partition OS evidence without dropping source matches", context => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mirror-evidence-'));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'conf'));
  const body = 'routing-options { router-id $ROUTER_ID; }\n';
  const pair = { junos: 'junos/routing-options/id.conf', evo: 'evo/routing-options/id-copy.conf' };
  for (const [directory, device, address] of [['junos', 'first', '192.0.2.1'], ['evo', 'second', '192.0.2.2']]) {
    fs.mkdirSync(path.dirname(path.join(root, 'snips', pair[directory])), { recursive: true });
    fs.writeFileSync(path.join(root, 'conf', `${device}.conf`), `routing-options { router-id ${address}; }`);
    fs.writeFileSync(path.join(root, 'snips', pair[directory]), `/*\n * Topic: Router ID\n * Seen on:\n *   Junos: ${directory === 'junos' ? device : '(none)'}\n *   EVO: ${directory === 'evo' ? device : '(none)'}\n * Variables:\n *   $ROUTER_ID e.g. ${address}\n */\n${body}`);
  }
  const metadata = path.join(root, 'snips/_snip-library.json');
  fs.writeFileSync(metadata, JSON.stringify({ schemaVersion: 1, osScopedMirrors: [pair] }));
  const result = generateBindings(root);
  assert.deepEqual(result.snips[pair.junos].count, { first: 1 });
  assert.deepEqual(result.snips[pair.evo].count, { second: 1 });
  fs.writeFileSync(path.join(root, 'snips/_bindings.json'), JSON.stringify(result));
  assert.deepEqual(verifyCountEvidence(root, { remeasure: true }).findings, []);
  const inputs = readBindingsInputs(root);
  assert.equal(inputs.templates.filter(template => template.sourceOS).length, 2);
  fs.writeFileSync(metadata, JSON.stringify({ schemaVersion: 1 }));
  const unscoped = generateBindings(root);
  assert.deepEqual(unscoped.snips[pair.junos].count, { first: 1, second: 1 });
  assert.notEqual(result.generatedFrom.inputsSha256, unscoped.generatedFrom.inputsSha256);
  fs.writeFileSync(metadata, JSON.stringify({ schemaVersion: 1, osScopedMirrors: [pair] }));
  for (const [directory, device, iface] of [['junos', 'first', 'ae1'], ['evo', 'second', 'ae2']]) {
    const file = path.join(root, 'snips', pair[directory]);
    const protocol = 'protocols { isis { interface $IFD { point-to-point; } } }\n';
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(body, protocol).replace('$ROUTER_ID e.g.', '$IFD e.g.'));
    fs.writeFileSync(path.join(root, 'conf', `${device}.conf`), protocol.replace('$IFD', iface));
  }
  const peers = generatePeerEvidence(root);
  for (const [directory, device] of [['junos', 'first'], ['evo', 'second']]) {
    const record = peers.snips[pair[directory]];
    assert.equal(record.status, 'unresolved');
    assert.ok(record.reasons.length);
    for (const reason of record.reasons) assert.deepEqual(reason.devices, [device]);
  }
  fs.appendFileSync(path.join(root, 'snips', pair.evo), 'routing-options { autonomous-system 65000; }\n');
  assert.throws(() => readBindingsInputs(root), /Mirror bodies differ/);
});

test("Count and Peers enrollment is independent and complete fields cannot disappear", () => {
  const meta = parseLibraryValidation(
    '{"schemaVersion":1,"seenOnValidation":"partial","countValidation":"complete","peersValidation":"partial"}',
  );
  assert.equal(meta.countValidation, "complete");
  assert.throws(() =>
    parseLibraryValidation(
      '{"schemaVersion":1,"seenOnValidation":"partial","countValidation":"typo"}',
    ),
  );
  const findings = validateSnipText(
    "/*\n * Topic: x\n * Seen on:\n *   Junos: device\n *   EVO: (none)\n */\nfoo;",
    { countValidation: "complete", peersValidation: "complete" },
  );
  assert.deepEqual(
    findings.map((finding) => finding.code),
    ["COUNT_MISSING_HEADER", "PEERS_MISSING_HEADER"],
  );
  const text =
    "/*\n * Topic: x\n * Seen on:\n *   Junos: device\n *   EVO: (none)\n * Count:\n *   device 1\n *   total 1\n * Peers with: n/a\n */\nfoo;";
  assert.deepEqual(
    validateSnipText(text, { enforceEvidenceEnrollment: true }).map((finding) => finding.code),
    ["COUNT_NOT_ENROLLED", "PEERS_NOT_ENROLLED"],
  );
});

test("evidence enrollment selects a second JVD and refuses deleted or downgraded registration", () => {
  const registered = {
    "service_provider/first": { countValidation: "complete" },
    "data_center/second": { countValidation: "partial", peersValidation: "partial" },
  };
  const selected = selectEvidenceChecks({
    before: registered,
    after: registered,
    paths: ["data_center/second/configuration/conf/device.conf"],
  });
  assert.deepEqual(
    selected.jobs.map(({ jvd, mode }) => [jvd, mode]),
    [
      ["service_provider/first", "none"],
      ["data_center/second", "full"],
    ],
  );
  assert.equal(
    selectEvidenceChecks({ before: registered, after: {}, paths: [] }).findings.length,
    3,
  );
  assert.equal(
    selectEvidenceChecks({
      before: registered,
      after: { ...registered, "service_provider/first": { countValidation: "partial" } },
      paths: [],
    }).findings.length,
    1,
  );
  assert.ok(
    selectEvidenceChecks({
      before: registered,
      after: registered,
      paths: ["portal/scripts/snip-peers.mjs"],
    }).jobs.every((job) => job.mode === "full"),
  );
});

test("metadata cannot redirect enrolled verification or override its mode", (context) => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), "evidence-routing-"));
  context.after(() => fs.rmSync(repo, { recursive: true, force: true }));
  execFileSync("git", ["init", "--quiet", repo]);
  for (const name of ["first", "second"]) {
    const configuration = path.join(repo, "service_provider", name, "configuration");
    fs.mkdirSync(path.join(configuration, "conf"), { recursive: true });
    fs.mkdirSync(path.join(configuration, "snips/junos/interfaces"), { recursive: true });
    fs.writeFileSync(
      path.join(configuration, "conf/device.conf"),
      "interfaces { ae1 { unit 0 { family inet; } unit 1 { family inet; } } }",
    );
    const snippet = path.join(configuration, "snips/junos/interfaces/unit.conf");
    const text =
      "/*\n * Topic: Unit\n * Seen on:\n *   Junos: device\n *   EVO: (none)\n */\ninterfaces { $IFD { unit $UNIT { family inet; } } }\n";
    fs.writeFileSync(snippet, text);
    const ledger = generateBindings(configuration);
    if (name === "first") {
      ledger.snips["junos/interfaces/unit.conf"].count.device = 1;
      ledger.snips["junos/interfaces/unit.conf"].instances.device.pop();
    }
    fs.writeFileSync(path.join(configuration, "snips/_bindings.json"), JSON.stringify(ledger));
    fs.writeFileSync(
      snippet,
      materializeCountHeader(text, countClaim(ledger.snips["junos/interfaces/unit.conf"])),
    );
    fs.writeFileSync(
      path.join(configuration, "snips/_snip-library.json"),
      JSON.stringify({
        schemaVersion: 1,
        seenOnValidation: "complete",
        countValidation: "complete",
        jvd: "service_provider/second",
        mode: "none",
        selected: [],
      }),
    );
  }
  const result = verifyEnrolledEvidence(repo);
  assert.deepEqual(
    result.checks.map((check) => check.jvd),
    ["service_provider/first", "service_provider/second"],
  );
  assert.ok(result.checks.every((check) => check.verification.startsWith("source remeasurement")));
  assert.deepEqual(
    result.findings.map(({ code, jvd }) => ({ code, jvd })),
    [{ code: "COUNT_SOURCE_MISMATCH", jvd: "service_provider/first" }],
  );
  const selection = selectEvidenceChecks({
    before: {},
    after: {
      "service_provider/first": {
        countValidation: "complete",
        jvd: "../other",
        mode: "none",
        selected: [],
      },
    },
  });
  assert.deepEqual(Object.keys(selection.jobs[0]).sort(), [
    "countValidation",
    "jvd",
    "mode",
    "peersValidation",
  ]);
  assert.equal(selection.jobs[0].jvd, "service_provider/first");
  assert.equal(selection.jobs[0].mode, "full");
});

test("Count provenance excludes derived headers but includes source, body and implementation", (context) => {
  const configuration = fs.mkdtempSync(path.join(os.tmpdir(), "snip-evidence-"));
  context.after(() => fs.rmSync(configuration, { recursive: true, force: true }));
  fs.mkdirSync(path.join(configuration, "conf"));
  fs.mkdirSync(path.join(configuration, "snips/junos/interfaces"), { recursive: true });
  const source = path.join(configuration, "conf/device.conf");
  const template = path.join(configuration, "snips/junos/interfaces/unit.conf");
  const header = "/*\n * Topic: Unit\n * Seen on:\n *   Junos: device\n *   EVO: (none)\n";
  const body = "interfaces { $IFD { unit $UNIT { family inet; } } }";
  fs.writeFileSync(
    source,
    "interfaces { ae1 { unit 0 { family inet; } unit 1 { family inet; } } }",
  );
  fs.writeFileSync(template, header + " */\n" + body);
  const identities = [];
  const measured = generateBindings(configuration, {
    onMeasurement: (result) =>
      identities.push(result.measured.instances.map((instance) => instance.sourceIds)),
  });
  assert.equal(measured.snips["junos/interfaces/unit.conf"].count.device, 2);
  assert.equal(identities[0].length, 2);
  assert.notDeepEqual(identities[0][0], identities[0][1]);
  assert.equal(bindingsFreshness(measured, readBindingsInputs(configuration)).fresh, true);
  const peerEvidence = generatePeerEvidence(configuration);
  fs.writeFileSync(path.join(configuration, "snips/_peers.json"), JSON.stringify(peerEvidence));
  assert.deepEqual(verifyPeerEvidence(configuration, { remeasure: true }).findings, []);
  const falsePeers = structuredClone(peerEvidence);
  falsePeers.snips["junos/interfaces/unit.conf"].peersWith = { state: "none" };
  fs.writeFileSync(path.join(configuration, "snips/_peers.json"), JSON.stringify(falsePeers));
  assert.ok(
    verifyPeerEvidence(configuration, { remeasure: true }).findings.some(
      (finding) => finding.code === "PEERS_SOURCE_MISMATCH",
    ),
  );
  assert.deepEqual(validateBindingsEvidence(measured, readBindingsInputs(configuration)), []);
  assert.equal(
    validateBindingsEvidence(measured, readBindingsInputs(configuration), {
      requireHeaders: true,
    })[0].code,
    "COUNT_MISSING_HEADER",
  );
  fs.writeFileSync(template, header + " * Count:\n *   device 2\n *   total 2\n */\n" + body);
  assert.equal(bindingsFreshness(measured, readBindingsInputs(configuration)).fresh, true);
  assert.deepEqual(
    validateBindingsEvidence(measured, readBindingsInputs(configuration), { requireHeaders: true }),
    [],
  );
  const tampered = structuredClone(measured);
  tampered.snips["junos/interfaces/unit.conf"].count.device = 1;
  tampered.snips["junos/interfaces/unit.conf"].instances.device.pop();
  fs.writeFileSync(template, header + " * Count:\n *   device 1\n *   total 1\n */\n" + body);
  fs.writeFileSync(path.join(configuration, "snips/_bindings.json"), JSON.stringify(tampered));
  assert.deepEqual(verifyCountEvidence(configuration).findings, []);
  assert.ok(
    verifyCountEvidence(configuration, { remeasure: true }).findings.some(
      (finding) => finding.code === "COUNT_SOURCE_MISMATCH",
    ),
  );
  const legacy = structuredClone(measured);
  delete legacy.generatedFrom.toolsSha256;
  assert.deepEqual(bindingsFreshness(legacy, readBindingsInputs(configuration)).differences, [
    "toolsSha256",
  ]);
  fs.writeFileSync(template, header + " */\n" + body.replace("inet;", "inet6;"));
  assert.ok(
    bindingsFreshness(measured, readBindingsInputs(configuration)).differences.includes(
      "inputsSha256",
    ),
  );
  fs.writeFileSync(template, header + " */\n" + body);
  fs.appendFileSync(source, "\n");
  assert.ok(
    bindingsFreshness(measured, readBindingsInputs(configuration)).differences.includes(
      "inputsSha256",
    ),
  );
});

test("display-only edits do not require measurement but edited generated claims do", () => {
  const text =
    "/*\n * Topic: x\n * Seen on:\n *   Junos: device\n *   EVO: (none)\n * Count:\n *   device 1\n *   total 1\n */\nfoo;";
  assert.equal(evidenceClaimChanged(text, text.replace("Topic: x", "Topic: y")), false);
  assert.equal(evidenceClaimChanged(text, text.replace("device 1", "device 2")), true);
  assert.equal(evidenceClaimChanged(text, text.replace("foo;", "bar;")), true);
});

test('peer headers preserve bodies, mappings and dependencies and refresh idempotently', () => {
  for (const newline of ['\n', '\r\n']) {
    const body = `routing-options {${newline}\trouter-id 192.0.2.1;${newline}}  ${newline}${newline}`;
    const text = ['/*', ' * Topic: Router ID', ' * Seen on:', ' *   Junos: first', ' *   EVO: (none)', ' * Count:', ' *   first 1', ' *   total 1', ' * Pair with:', ' *  - junos/system/required.conf', ' * JVD service mapping:', ' *   Existing role and example', ' * Variables: none', ' */', ''].join(newline) + body;
    const claims = [{ state: 'not-applicable' }, { state: 'none' }, { state: 'groups', groups: [{ left: ['first'], right: ['second'] }] }];
    let current = text;
    for (const claim of claims) {
      const updated = materializePeerHeader(current, claim);
      assert.ok(updated.endsWith(body));
      assert.deepEqual(parseSnip(updated).header.peersWith, claim);
      assert.equal(materializePeerHeader(updated, claim), updated);
      assert.ok(updated.includes(' *   Existing role and example'));
      assert.ok(updated.includes(' *  - junos/system/required.conf'));
      current = updated;
    }
    assert.throws(() => materializePeerHeader(text, { state: 'groups', groups: [] }));
    assert.throws(() => materializePeerHeader(text, { state: 'groups', groups: [{ left: ['first'], right: ['first'] }] }));
    assert.throws(() => materializePeerHeader(text, { state: 'unresolved' }));
  }
});

test('peer publication requires pinned explicit approval and refuses unresolved claims before writing', context => {
  const configuration = fs.mkdtempSync(path.join(os.tmpdir(), 'peer-publish-'));
  context.after(() => fs.rmSync(configuration, { recursive: true, force: true }));
  fs.mkdirSync(path.join(configuration, 'conf'));
  fs.mkdirSync(path.join(configuration, 'snips/junos'), { recursive: true });
  const bodies = { 'junos/local.conf': 'routing-options { router-id 192.0.2.1; }', 'junos/held.conf': 'protocols { isis { interface ae1.0 { point-to-point; } } }' };
  for (const [rel, body] of Object.entries(bodies)) fs.writeFileSync(path.join(configuration, 'snips', rel), `/*\n * Topic: Fixture\n * Seen on:\n *   Junos: first\n *   EVO: (none)\n * Variables: none\n */\n${body}\n`);
  fs.writeFileSync(path.join(configuration, 'conf/first.conf'), Object.values(bodies).join('\n'));
  const peerFile = path.join(configuration, 'snips/_peers.json');
  fs.writeFileSync(peerFile, JSON.stringify(generatePeerEvidence(configuration)));
  const approval = { evidenceSha256: createHash('sha256').update(fs.readFileSync(peerFile)).digest('hex'), snips: ['junos/local.conf'] };
  const before = fs.readFileSync(path.join(configuration, 'snips/junos/local.conf'), 'utf8');
  assert.throws(() => materializePeers(configuration), /approval required/);
  assert.throws(() => materializePeers(configuration, { ...approval, evidenceSha256: '0'.repeat(64) }), /evidence changed/);
  assert.throws(() => materializePeers(configuration, { ...approval, snips: [...approval.snips, 'junos/held.conf'] }), /Unverified/);
  assert.throws(() => materializePeers(configuration, { ...approval, snips: [...approval.snips, 'junos/missing.conf'] }), /Unverified/);
  assert.equal(fs.readFileSync(path.join(configuration, 'snips/junos/local.conf'), 'utf8'), before);
  assert.deepEqual(materializePeers(configuration, approval), { approved: 1, changed: 1 });
  assert.deepEqual(materializePeers(configuration, approval), { approved: 1, changed: 0 });
  assert.equal(parseSnip(fs.readFileSync(path.join(configuration, 'snips/junos/held.conf'), 'utf8')).header.peersWith, undefined);
  assert.deepEqual(verifyPeerEvidence(configuration, { remeasure: true }).findings, []);
  fs.appendFileSync(path.join(configuration, 'conf/first.conf'), '\n');
  assert.throws(() => materializePeers(configuration, approval), /stale or invalid/);
});

test("Count materialization is idempotent and preserves body bytes and existing mapping", () => {
  for (const newline of ["\n", "\r\n"]) {
    const body = `interfaces {${newline}\tlo0 { unit 0 { family inet; } }${newline}}  ${newline}${newline}`;
    const text =
      [
        "/*",
        " * Topic: x",
        " * Seen on:",
        " *   Junos: device",
        " *   EVO: (none)",
        " *",
        " * JVD service mapping:",
        " *   Existing role and example",
        " * Variables: none",
        " */",
        "",
      ].join(newline) + body;
    const claim = { byDevice: { device: 2 }, total: 2 };
    const result = materializeCountHeader(text, claim);
    assert.ok(result.endsWith(body));
    assert.ok(result.includes(" *   Existing role and example"));
    assert.equal(materializeCountHeader(result, claim), result);
    assert.ok(
      materializeCountHeader(result, { byDevice: { device: 3 }, total: 3 }).includes(
        " *   total 3",
      ),
    );
  }
});

test("Count refresh replaces an old projection only after validating fresh evidence", (context) => {
  const configuration = fs.mkdtempSync(path.join(os.tmpdir(), "count-refresh-"));
  context.after(() => fs.rmSync(configuration, { recursive: true, force: true }));
  fs.mkdirSync(path.join(configuration, "conf"));
  fs.mkdirSync(path.join(configuration, "snips/junos/interfaces"), { recursive: true });
  const source = path.join(configuration, "conf/device.conf");
  const snippet = path.join(configuration, "snips/junos/interfaces/unit.conf");
  const ledger = path.join(configuration, "snips/_bindings.json");
  const body = "interfaces { $IFD { unit $UNIT { family inet; } } }\n";
  fs.writeFileSync(
    snippet,
    "/*\n * Topic: Unit\n * Seen on:\n *   Junos: device\n *   EVO: (none)\n */\n" + body,
  );
  fs.writeFileSync(source, "interfaces { ae1 { unit 0 { family inet; } } }");
  fs.writeFileSync(ledger, JSON.stringify(generateBindings(configuration)));
  assert.equal(materializeCounts(configuration).changed, 1);
  const before = fs.readFileSync(snippet, "utf8");
  fs.writeFileSync(
    source,
    "interfaces { ae1 { unit 0 { family inet; } unit 1 { family inet; } } }",
  );
  assert.throws(() => materializeCounts(configuration), /stale or inconsistent/);
  assert.equal(fs.readFileSync(snippet, "utf8"), before);
  fs.writeFileSync(ledger, JSON.stringify(generateBindings(configuration)));
  assert.equal(materializeCounts(configuration).changed, 1);
  assert.ok(fs.readFileSync(snippet, "utf8").includes(" *   total 2"));
  assert.ok(fs.readFileSync(snippet, "utf8").endsWith(body));
  assert.equal(materializeCounts(configuration).changed, 0);
  assert.deepEqual(
    verifyCountEvidence(configuration, { remeasure: true, requireHeaders: true }).findings,
    [],
  );
});
