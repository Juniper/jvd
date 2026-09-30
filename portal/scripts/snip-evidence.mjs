import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  bindingsFreshness,
  generateBindings,
  readBindingsInputs,
  sourceTree,
  occurrenceMap,
} from "./generate-bindings.mjs";
import { parseSnip } from "./snip-parse.mjs";
import { createPeerAnalysis } from "./snip-peers.mjs";
import { parseLibraryValidation } from "./snip-validate.mjs";
import { readValidationChanges, selectEvidenceChecks } from "./validation-scope.mjs";
import { confinedPath, readConfinedFile, writeConfinedFile } from "./snip-files.mjs";

const scripts = path.dirname(fileURLToPath(import.meta.url));
const digest = (value) => crypto.createHash("sha256").update(value).digest("hex");

export function peerProvenance(inputs) {
  return {
    ...inputs.generatedFrom,
    peerToolsSha256: digest(
      JSON.stringify(
        ["snip-peers.mjs", "snip-evidence.mjs"].map((name) => [
          name,
          digest(fs.readFileSync(path.join(scripts, name))),
        ]),
      ),
    ),
  };
}

export function generatePeerEvidence(configuration) {
  const inputs = readBindingsInputs(configuration);
  const analysis = createPeerAnalysis(inputs);
  generateBindings(configuration, { onMeasurement: analysis.observe });
  return { schemaVersion: 1, generatedFrom: peerProvenance(inputs), snips: analysis.summary() };
}

export function countClaim(record) {
  const byDevice = Object.fromEntries(
    Object.entries(record.count).sort(([left], [right]) => left.localeCompare(right, "en")),
  );
  return { byDevice, total: Object.values(byDevice).reduce((sum, value) => sum + value, 0) };
}

export function materializeCountHeader(text, claim) {
  const terminator = text.match(/\n[ \t]*\*\/[ \t]*(?:\r?\n|$)/);
  assert.ok(terminator, "Cannot materialize a missing header");
  const boundary = terminator.index + terminator[0].length;
  const header = text.slice(0, boundary);
  const body = text.slice(boundary);
  const newline = header.includes("\r\n") ? "\r\n" : "\n";
  const lines = header.split(newline);
  const start = lines.findIndex((line) => /^\s*\* Count\s*:/.test(line));
  const rows = [
    " * Count:",
    ...Object.entries(claim.byDevice)
      .sort(([left], [right]) => left.localeCompare(right, "en"))
      .map(([device, count]) => ` *   ${device} ${count}`),
    ` *   total ${claim.total}`,
  ];
  if (start >= 0) {
    let end = start + 1;
    while (end < lines.length && /^\s*\*\s{2,}\S/.test(lines[end])) end++;
    lines.splice(start, end - start, ...rows);
  } else {
    const seen = lines.findIndex((line) => /^\s*\* Seen on\s*:/.test(line));
    assert.ok(seen >= 0, "Cannot insert Count without Seen on");
    let end = seen + 1;
    while (end < lines.length && /^\s*\*\s+(Junos|EVO)\s*:/.test(lines[end])) end++;
    assert.equal(end - seen, 3, "Count requires both Seen-on rows");
    lines.splice(end, 0, ...rows);
  }
  const result = lines.join(newline) + body;
  const parsed = parseSnip(result);
  assert.ok(
    !parsed.diagnostics.some((finding) => finding.code.startsWith("COUNT_")),
    "Invalid generated Count",
  );
  assert.deepEqual(JSON.parse(JSON.stringify(parsed.header.count)), claim);
  assert.equal(parseSnip(text).body, parsed.body, "Count materialization changed the body");
  return result;
}

export function materializeCounts(configuration) {
  configuration = fs.realpathSync(configuration);
  const inputs = readBindingsInputs(configuration);
  const evidence = JSON.parse(readConfinedFile(configuration, "snips/_bindings.json", "utf8"));
  const findings = validateBindingsEvidence(evidence, inputs, { compareHeaders: false });
  assert.deepEqual(findings, [], "Cannot materialize stale or inconsistent Count evidence");
  const updates = inputs.templates.map((template) => ({
    file: template.file,
    before: template.text,
    after: materializeCountHeader(template.text, countClaim(evidence.snips[template.relative])),
  }));
  const proposed = {
    ...inputs,
    templates: inputs.templates.map((template, index) => ({
      ...template,
      text: updates[index].after,
    })),
  };
  assert.deepEqual(
    validateBindingsEvidence(evidence, proposed, { requireHeaders: true }),
    [],
    "Invalid proposed Count headers",
  );
  for (const update of updates)
    if (update.before !== update.after)
      writeConfinedFile(configuration, update.file, update.after, { expectedText: update.before });
  return { changed: updates.filter((update) => update.before !== update.after).length };
}

export function validateBindingsEvidence(
  result,
  inputs,
  { requireHeaders = false, requireToolProvenance = true, compareHeaders = true } = {},
) {
  const findings = [];
  const freshness = bindingsFreshness(result, inputs);
  for (const field of freshness.differences) {
    if (field !== "toolsSha256" || requireToolProvenance)
      findings.push({ code: "COUNT_STALE_EVIDENCE", detail: field });
  }
  const inventory = new Set(inputs.sources.map((source) => source.device));
  for (const template of inputs.templates) {
    const record = result.snips?.[template.relative];
    const fail = (detail) =>
      findings.push({ code: "COUNT_INVALID_EVIDENCE", snip: template.relative, detail });
    if (!record || !Array.isArray(record.variables) || !record.count || !record.instances) {
      fail("missing measurement");
      continue;
    }
    if (
      new Set(record.variables).size !== record.variables.length ||
      record.variables.some((variable) => !/^[A-Z][A-Z0-9_]*$/.test(variable))
    )
      fail("invalid variable names");
    for (const [device, count] of Object.entries(record.count)) {
      const instances = record.instances[device];
      if (
        !inventory.has(device) ||
        !Number.isSafeInteger(count) ||
        count <= 0 ||
        !Array.isArray(instances) ||
        instances.length !== count
      ) {
        fail(`invalid population: ${device}`);
        continue;
      }
      if (
        instances.some(
          (instance) =>
            !Array.isArray(instance.binding) ||
            instance.binding.length !== record.variables.length ||
            instance.binding.some((value) => typeof value !== "string") ||
            !Number.isSafeInteger(instance.equivalentBindings) ||
            instance.equivalentBindings < 1,
        )
      )
        fail(`invalid bindings: ${device}`);
    }
    if (Object.keys(record.instances).some((device) => !Object.hasOwn(record.count, device)))
      fail("instances without Count");
    const expected = countClaim(record);
    if (!Number.isSafeInteger(expected.total)) fail("unsafe total");
    const { header, diagnostics } = parseSnip(template.text);
    if (!header) {
      fail("missing header");
      continue;
    }
    for (const finding of diagnostics.filter(({ code }) => code.startsWith("COUNT_")))
      findings.push({ ...finding, snip: template.relative });
    const seen = [...new Set([...header.seenOn.junos, ...header.seenOn.evo])].sort();
    if (JSON.stringify(seen) !== JSON.stringify(Object.keys(record.count).sort()))
      fail("Count and Seen on differ");
    if (requireHeaders && !header.count)
      findings.push({ code: "COUNT_MISSING_HEADER", snip: template.relative });
    if (compareHeaders && header.count) {
      try {
        assert.deepEqual(JSON.parse(JSON.stringify(header.count)), expected);
      } catch {
        findings.push({ code: "COUNT_HEADER_MISMATCH", snip: template.relative });
      }
    }
  }
  return findings;
}

export function verifyCountEvidence(
  configuration,
  { remeasure = false, requireHeaders = false, selected = null } = {},
) {
  const inputs = readBindingsInputs(configuration);
  const evidence = JSON.parse(readConfinedFile(configuration, "snips/_bindings.json", "utf8"));
  const findings = validateBindingsEvidence(evidence, inputs, { requireHeaders });
  if (remeasure) {
    const templates = inputs.templates.filter(
      (template) => selected === null || selected.has(template.relative),
    );
    for (const source of inputs.sources) {
      const tree = sourceTree(source.text, {
        device: source.device,
        exclusions: inputs.exclusions,
      });
      const cache = new Map();
      for (const template of templates) {
        if (!cache.has(template.normalized))
          cache.set(template.normalized, occurrenceMap(template.normalized, tree));
        const actual = cache.get(template.normalized);
        const instances = template.sourceOS && template.sourceOS !== source.os ? [] : actual.instances;
        const record = evidence.snips?.[template.relative];
        try {
          assert.deepEqual(record?.variables, actual.variables);
          assert.equal(record?.count[source.device] ?? 0, instances.length);
          assert.deepEqual(
            record?.instances[source.device] ?? [],
            instances.map(({ binding, equivalentBindings }) => ({
              binding,
              equivalentBindings,
            })),
          );
        } catch {
          findings.push({
            code: "COUNT_SOURCE_MISMATCH",
            snip: template.relative,
            device: source.device,
          });
        }
      }
    }
  }
  return {
    verification: remeasure
      ? "source remeasurement; not an independent audit"
      : "freshness and consistency only",
    findings,
  };
}

export function verifyPeerEvidence(
  configuration,
  { remeasure = false, requireHeaders = false, selected = null } = {},
) {
  const inputs = readBindingsInputs(configuration);
  const evidence = JSON.parse(readConfinedFile(configuration, "snips/_peers.json", "utf8"));
  const findings = [];
  if (
    evidence.schemaVersion !== 1 ||
    JSON.stringify(evidence.generatedFrom) !== JSON.stringify(peerProvenance(inputs))
  )
    findings.push({ code: "PEERS_STALE_EVIDENCE" });
  if (
    JSON.stringify(Object.keys(evidence.snips ?? {}).sort()) !==
    JSON.stringify(inputs.templates.map((template) => template.relative).sort())
  )
    findings.push({ code: "PEERS_INVALID_INVENTORY" });
  for (const template of inputs.templates) {
    const record = evidence.snips?.[template.relative];
    const header = parseSnip(template.text).header;
    const fail = (code) => findings.push({ code, snip: template.relative });
    if (!record || !["verified", "unresolved"].includes(record.status)) {
      fail("PEERS_INVALID_EVIDENCE");
      continue;
    }
    if (record.status === "unresolved") {
      if (!Array.isArray(record.reasons) || !record.reasons.length || record.peersWith)
        fail("PEERS_INVALID_EVIDENCE");
      if (requireHeaders || header?.peersWith) fail("PEERS_UNRESOLVED_CLAIM");
    } else {
      if (
        !record.peersWith ||
        !["groups", "none", "not-applicable"].includes(record.peersWith.state)
      )
        fail("PEERS_INVALID_EVIDENCE");
      if (requireHeaders && !header?.peersWith) fail("PEERS_MISSING_HEADER");
      if (header?.peersWith) {
        try {
          assert.deepEqual(header.peersWith, record.peersWith);
        } catch {
          fail("PEERS_HEADER_MISMATCH");
        }
      }
    }
  }
  if (remeasure) {
    const analysis = createPeerAnalysis(inputs);
    const templates = inputs.templates.filter(
      (template) => selected === null || selected.has(template.relative),
    );
    const bodies = new Set(templates.map((template) => template.normalized));
    for (const source of inputs.sources) {
      const tree = sourceTree(source.text, {
        device: source.device,
        exclusions: inputs.exclusions,
      });
      for (const body of bodies)
        analysis.observe({ body, device: source.device, measured: occurrenceMap(body, tree) });
    }
    const actual = analysis.summary();
    for (const template of templates) {
      try {
        assert.deepEqual(evidence.snips?.[template.relative], actual[template.relative]);
      } catch {
        findings.push({ code: "PEERS_SOURCE_MISMATCH", snip: template.relative });
      }
    }
  }
  return {
    verification: remeasure
      ? "source remeasurement; not an independent audit"
      : "freshness and consistency only",
    findings,
  };
}

export function evidenceClaimChanged(before, after) {
  const previous = parseSnip(before);
  const current = parseSnip(after);
  return (
    previous.body !== current.body ||
    JSON.stringify(previous.header?.count) !== JSON.stringify(current.header?.count) ||
    JSON.stringify(previous.header?.peersWith) !== JSON.stringify(current.header?.peersWith)
  );
}

export function verifyEnrolledEvidence(repoRoot, base) {
  const changes = base ? readValidationChanges({ repoRoot, base }) : null;
  const git =
    changes?.git ??
    ((args) =>
      execFileSync("git", args, { cwd: repoRoot, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }));
  const currentPaths = git(["ls-files", "--cached", "--others", "--exclude-standard", "-z"])
    .split("\0")
    .filter((file) => file.endsWith("/configuration/snips/_snip-library.json"));
  const previousPaths = changes
    ? git(["ls-tree", "-r", "--name-only", "-z", changes.ancestor])
        .split("\0")
        .filter((file) => file.endsWith("/configuration/snips/_snip-library.json"))
    : [];
  const jvdOf = (file) => file.slice(0, -"/configuration/snips/_snip-library.json".length);
  const after = Object.fromEntries(
    [...new Set(currentPaths)]
      .filter((file) => fs.existsSync(path.join(repoRoot, file)))
      .map((file) => [
        jvdOf(file),
        parseLibraryValidation(readConfinedFile(repoRoot, file, "utf8"), file),
      ]),
  );
  const before = Object.fromEntries(
    previousPaths.map((file) => [
      jvdOf(file),
      parseLibraryValidation(git(["show", `${changes.ancestor}:${file}`]), file),
    ]),
  );
  const selection = selectEvidenceChecks({ before, after, paths: changes?.paths ?? null });
  const findings = [...selection.findings];
  const checks = [];
  const previousFiles = changes
    ? new Set(git(["ls-tree", "-r", "--name-only", "-z", changes.ancestor]).split("\0"))
    : new Set();
  for (const job of selection.jobs) {
    const configuration = path.join(repoRoot, job.jvd, "configuration");
    let selected = null;
    if (job.mode === "snippets") {
      const prefix = `${job.jvd}/configuration/snips/`;
      selected = new Set(
        changes.paths
          .filter(
            (file) =>
              file.startsWith(prefix) &&
              /\/(junos|evo)\/.*\.conf$/.test(file) &&
              fs.existsSync(path.join(repoRoot, file)),
          )
          .filter(
            (file) =>
              !previousFiles.has(file) ||
              evidenceClaimChanged(
                git(["show", `${changes.ancestor}:${file}`]),
                fs.readFileSync(path.join(repoRoot, file), "utf8"),
              ),
          )
          .map((file) => file.slice(prefix.length)),
      );
    }
    const remeasure = job.mode === "full" || (job.mode === "snippets" && selected.size > 0);
    for (const field of ["countValidation", "peersValidation"]) {
      if (!job[field]) continue;
      const verifier = field === "countValidation" ? verifyCountEvidence : verifyPeerEvidence;
      try {
        const result = verifier(configuration, {
          remeasure,
          selected,
          requireHeaders: job[field] === "complete",
        });
        findings.push(...result.findings.map((finding) => ({ ...finding, jvd: job.jvd })));
        checks.push({
          jvd: job.jvd,
          field,
          verification: result.verification,
          selected: selected?.size ?? "all",
        });
      } catch (error) {
        findings.push({
          code: "EVIDENCE_CHECK_FAILED",
          jvd: job.jvd,
          field,
          detail: error.message,
        });
      }
    }
  }
  return { checks, findings };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes("--enrolled")) {
    const basePosition = args.indexOf("--base");
    const result = verifyEnrolledEvidence(
      path.resolve(scripts, "../.."),
      basePosition < 0 ? undefined : args[basePosition + 1],
    );
    console.log(JSON.stringify(result, null, 2));
    if (result.findings.length) process.exitCode = 1;
  } else {
    const position = args.indexOf("--configuration");
    if (position < 0 || !args[position + 1]) throw new Error("--configuration is required");
    const configuration = path.resolve(args[position + 1]);
    if (args.includes("--materialize-count")) {
      console.log(JSON.stringify(materializeCounts(configuration)));
    } else if (args.includes("--generate-peers")) {
      const output = confinedPath(configuration, "snips/_peers.json", { allowMissing: true });
      const result = generatePeerEvidence(configuration);
      writeConfinedFile(configuration, output, JSON.stringify(result, null, 2) + "\n");
      console.log(`Generated peer evidence for ${Object.keys(result.snips).length} snippets`);
    } else {
      const verifier = args.includes("--peers") ? verifyPeerEvidence : verifyCountEvidence;
      const result = verifier(configuration, {
        remeasure: args.includes("--remeasure"),
        requireHeaders: args.includes("--require-headers"),
      });
      console.log(JSON.stringify(result, null, 2));
      if (result.findings.length) process.exitCode = 1;
    }
  }
}
