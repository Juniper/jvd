import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { loadJvd } from "./object-ownership.mjs";
import { parseSnip } from "./snip-parse.mjs";
import { createOccurrenceResolver } from "./dependency-resolve.mjs";
import { closeOccurrenceTuple, validateMatrix, bindSelection, verifyOccurrenceEmission } from "./composition-validate.mjs";
import { bodyIdentity } from "./variant-resolve.mjs";
import { sourceTree } from "./generate-bindings.mjs";

const scripts = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(scripts, "../..");
const defaultRoot = path.join(repo, "service_provider/metro_ethernet_business_services");
const digest = text => createHash("sha256").update(text).digest("hex");

export async function buildOccurrencePlan({ root = defaultRoot, device, entrySets = ["isis", "flex-algo-definitions", "colour-resolution"], service }) {
  assert.match(device, /^[a-z0-9][a-z0-9_-]*$/i, "Invalid device token");
  const sourceText = await fs.readFile(path.join(root, "configuration/conf", `${device}.conf`), "utf8");
  const { snips } = await loadJvd(root);
  const matrixText = await fs.readFile(path.join(root, "configuration/snips/_composition.json"), "utf8");
  const matrix = JSON.parse(matrixText);
  const exclusionsText = await fs.readFile(path.join(root, 'configuration/snips/_source-exclusions.json'), 'utf8').catch(error => { if (error.code === 'ENOENT') return 'null'; throw error; });
  const exclusions = JSON.parse(exclusionsText);
  const snipIndex = new Map(snips.map(snip => [snip.rel, snip]));
  assert.deepEqual(validateMatrix(matrix, snipIndex), []);
  const buckets = new Set(snips.flatMap(snip => ["junos", "evo"].filter(os => snip.seenOn[os]?.includes(device))));
  assert.equal(buckets.size, 1, "Device OS must be unambiguous in validated applicability");
  const os = [...buckets][0];
  const headers = new Map();
  const inputs = [];
  for (const snip of snips) {
    const text = await fs.readFile(path.join(root, "configuration/snips", snip.rel), "utf8");
    headers.set(snip.rel, parseSnip(text).header);
    inputs.push([snip.rel, digest(text)]);
  }
  const variantMembers = snips.filter(snip => headers.get(snip.rel).variantGroup).map(snip => ({ rel: snip.rel, os: snip.dir, jvd: "mebs", group: headers.get(snip.rel).variantGroup.name, provides: headers.get(snip.rel).variantGroup.provides, seenOn: snip.seenOn, bodyId: bodyIdentity(snip.body) }));
  const form = service ? matrix.forms.find(form => form.id === service.form && form.status === 'supported') : null;
  if (service) assert.ok(form && form.family === 'e-tree' && service.instanceName && service.attachment && ['root', 'leaf'].includes(service.role), 'E-Tree form, instance, attachment and role are required');
  const paths = service ? [...(form.entry.junos ?? []), ...(form.entry.evo ?? [])] : [...new Set(entrySets.flatMap(name => {
    assert.ok(Array.isArray(matrix.occurrenceEntrySets?.[name]), `Unknown entry set: ${name}`);
    return matrix.occurrenceEntrySets[name];
  }))];
  assert.ok(paths.every(rel => snipIndex.has(rel)), "Entry path does not exist");
  const resolver = createOccurrenceResolver({ sourceText, device, os, snips, exclusions });
  const entries = paths.flatMap(rel => resolver.occurrences(rel)).filter(row => !service || row.binding.INSTANCE_NAME === service.instanceName);
  assert.ok(entries.length, "No exact source entry occurrences");
  const closure = closeOccurrenceTuple({ entries, resolver, sourceSha256: resolver.sourceSha256, bindings: matrix.occurrenceBindings ?? [], headers, snipIndex, variantMembers, device, os, sourceRequirements: matrix.sourceRequirements ?? [], entrySets: matrix.occurrenceEntrySets ?? {}, capabilityRequirements: matrix.capabilityRequirements ?? {} });
  if (service) for (const consumer of entries) {
    const references = consumer.references.filter(row => row.kind === 'logical-interface');
    if (!references.length) closure.failures.push({ kind: 'service-attachment-missing', from: consumer.id });
    for (const reference of references) {
      if (reference.name !== service.attachment) { closure.failures.push({ kind: 'service-attachment-mismatch', from: consumer.id, detail: reference.name }); continue; }
      const edge = closure.edges.find(edge => edge.from === consumer.id && edge.reference?.nodeId === reference.nodeId && edge.reference?.wordIndex === reference.wordIndex);
      const provider = closure.included.find(row => row.id === edge?.to);
      if (!provider) { closure.failures.push({ kind: 'service-provider-unresolved', from: consumer.id }); continue; }
      const result = bindSelection({ consumer: { body: consumer.rendered }, provider: { body: provider.rendered }, reference, selection: { role: service.role, consumerBinding: {}, binding: {} }, family: 'e-tree' });
      if (result.status !== 'ok') closure.failures.push({ kind: `service-${result.status}`, from: consumer.id });
    }
  }
  const source = sourceTree(sourceText, { device, exclusions });
  const descendants = node => [node, ...(node.children ?? []).flatMap(descendants)];
  const requested = service ? source.nodes.filter(node => node.words[0] === 'routing-instances').flatMap(node => node.children.filter(child => child.words[0] === service.instanceName).flatMap(descendants)) : source.nodes.flatMap(node => node.words[0] === "protocols"
    ? (node.children ?? []).filter(child => ["isis", "isis-instance"].includes(child.words[0])).flatMap(descendants)
    : node.words[0] === "routing-options"
      ? (node.children ?? []).filter(child => ['flex-algorithm', 'resolution', 'transport-class'].includes(child.words[0])).flatMap(descendants) : []);
  const rendered = resolver.render({ ids: closure.included.map(row => row.id), sourceSha256: resolver.sourceSha256 });
  assert.equal(rendered.status, "ok");
  const emittedIds = new Set(rendered.emittedSourceIds);
  const excludedRequestedIds = requested.filter(row => source.excludedIds.has(row.id)).map(row => row.id);
  const uncoveredIds = requested.filter(row => !source.excludedIds.has(row.id) && !emittedIds.has(row.id)).map(row => row.id);
  if (uncoveredIds.length) closure.failures.push({ kind: "requested-source-coverage-gap", sourceIds: uncoveredIds });
  const emission = verifyOccurrenceEmission({ closure, rendered, resolver, headers, snipIndex, bindings: matrix.occurrenceBindings ?? [], variantMembers, device, os, sourceRequirements: matrix.sourceRequirements ?? [], entrySets: matrix.occurrenceEntrySets ?? {} });
  closure.failures.push(...emission.failures);
  const canonicalId = id => rendered.aliases[id] ?? id;
  const dependencies = [...new Map(closure.edges.map(edge => {
    const canonical = { ...edge, from: canonicalId(edge.from), to: canonicalId(edge.to) };
    return [JSON.stringify(canonical), canonical];
  })).values()];
  const registry = await fs.readFile(path.join(scripts, "snip-instance-registry.json"), "utf8");
  const tooling = await Promise.all(["generate-occurrence-plans.mjs", "generate-bindings.mjs", "composition-validate.mjs", "dependency-resolve.mjs", "config-references.mjs", "config-objects.mjs", "transport-capabilities.mjs", "snip-parse.mjs", "variant-resolve.mjs"].map(async name => [name, digest(await fs.readFile(path.join(scripts, name)))]));
  return {
    schemaVersion: 2,
    device,
    os,
    entrySets: service ? [] : entrySets,
    ...(service ? { service } : {}),
    status: closure.failures.length ? "blocked" : "ready",
    scope: service ? 'Source-deployed E-Tree service with explicitly selected attachment/role and recursively resolved dependencies; not a complete-device or operational validation.' : "Source-deployed IS-IS/Flex-Algo plus colour resolution, including configured resolution schemes, transport classes and verified prerequisites; not a complete-device or operational validation.",
    sourceSha256: resolver.sourceSha256,
    inputsSha256: digest(JSON.stringify([resolver.sourceSha256, digest(matrixText), digest(exclusionsText), digest(registry), tooling, inputs.sort(([left], [right]) => left.localeCompare(right))])),
    tooling: Object.fromEntries(tooling),
    coverage: { denominatorBasis: service ? 'Archived selected routing instance, independent of selected snippets' : 'Archived IS-IS, named IS-IS, Flex-Algo, resolution and transport-class subtrees, independent of selected entry sets', requestedSourceIds: requested.map(row => row.id), requestedStatements: requested.length, eligibleStatements: requested.length - excludedRequestedIds.length, excludedRequestedIds, coveredStatements: requested.length - excludedRequestedIds.length - uncoveredIds.length, uncoveredIds },
    prerequisiteCoverage: { requiredStatements: emission.requiredStatementCount, emittedStatements: emission.emittedStatementCount, edgeCount: dependencies.length, failures: emission.failures },
    exclusions: source.exclusions,
    snippets: [...new Set(rendered.occurrences.map(row => row.rel))].sort(),
    entries: [...new Set(entries.map(row => canonicalId(row.id)))].sort(),
    occurrences: rendered.occurrences,
    occurrenceAliases: rendered.aliases,
    dependencies,
    failures: closure.failures,
    configuration: closure.failures.length ? null : rendered.body + "\n",
    configurationSha256: closure.failures.length ? null : digest(rendered.body + "\n"),
  };
}

async function main() {
  const args = process.argv.slice(2);
  const devices = args.flatMap((argument, index) => argument === "--device" ? [args[index + 1]] : []);
  assert.ok(devices.length && devices.every(Boolean), "Supply --device <validated-token>");
  const value = option => args.includes(option) ? args[args.indexOf(option) + 1] : undefined;
  const output = value('--out-dir');
  assert.ok(output && !output.startsWith('--'), 'Supply --out-dir <private-evidence-directory>');
  const destination = path.resolve(output);
  const relative = path.relative(path.resolve(scripts, '../..'), destination);
  assert.ok(relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative), 'Validation plans must be written outside the public repository');
  if (!args.includes('--check')) await fs.mkdir(destination, { recursive: true });
  const service = value('--service') ? { form: value('--service'), instanceName: value('--instance'), attachment: value('--attachment'), role: value('--role') } : undefined;
  for (const device of [...new Set(devices)]) {
    const plan = await buildOccurrencePlan({ device, service });
    const json = JSON.stringify(plan, null, 2) + "\n";
    const markdown = [
      `# Source-bound ${service ? 'E-Tree' : 'IS-IS/Flex-Algo plus colour resolution'} plan: ${device}`, "",
      `Status: ${plan.status}`, `Scope: ${plan.scope}`, `Source SHA-256: ${plan.sourceSha256}`, `Inputs SHA-256: ${plan.inputsSha256}`, "",
      `Feature coverage: ${plan.coverage.coveredStatements}/${plan.coverage.eligibleStatements}; excluded: ${plan.coverage.excludedRequestedIds.length}`,
      `Prerequisite emission: ${plan.prerequisiteCoverage.emittedStatements}/${plan.prerequisiteCoverage.requiredStatements}; failures: ${plan.prerequisiteCoverage.failures.length}`, "",
      "## Occurrences", "",
      ...plan.occurrences.map(row => `- ${row.id}: ${row.rel} ${JSON.stringify(row.binding)}`), "",
      "## Configuration", "",
      ...(plan.configuration ? ["```junos", plan.configuration.trimEnd(), "```"] : ["No configuration: the dependency plan is blocked.", ...plan.failures.map(row => JSON.stringify(row))]), "",
    ].join("\n");
    for (const [extension, content] of [["json", json], ["md", markdown]]) {
      const file = path.join(destination, `${service ? 'etree' : 'isis'}-plan-${device}.${extension}`);
      if (args.includes("--check")) assert.equal(await fs.readFile(file, "utf8"), content, `Stale occurrence plan: ${file}`);
      else await fs.writeFile(file, content);
    }
    console.log(JSON.stringify({ device, status: plan.status, occurrences: plan.occurrences.length, failures: plan.failures }));
    if (plan.status !== "ready") process.exitCode = 1;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();