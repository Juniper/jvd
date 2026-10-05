// DIAGNOSTIC structural check for a detached JVD qualification record, runnable from this checkout without
// builder access. It is deliberately NOT a release gate: a candidate cannot carry the verifier or policy that
// decides whether it is trusted. Release acceptance (`accept.mjs --mode release`) runs in the trusted builder with
// the builder's policy and a verified detached attestation. This script therefore never evaluates attestations;
// it reports authenticated=false and release=false unconditionally, while still failing (exit 1) on any missing or
// invalid structural release content so an incomplete record cannot pass as "fine".
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const sha256 = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const option = name => process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : undefined;
const HEX64 = /^[0-9a-f]{64}$/;
const HEX40 = /^[0-9a-f]{40}$/;

const file = option('--record');
if (!file) { console.error('Usage: node .github/scripts/accept-qualification.mjs --record <record.json> [--policy <trust-policy.json>]   (diagnostic structural check only; not release acceptance)'); process.exit(2); }
if (process.argv.includes('--allow-unauthenticated') || process.argv.includes('--mode')) { console.error('this script is diagnostic-only; it has no release mode and no authentication bypass'); process.exit(2); }
const bytes = fs.readFileSync(path.resolve(file));
const record = JSON.parse(bytes.toString('utf8'));
const policy = JSON.parse(fs.readFileSync(path.resolve(option('--policy') ?? path.join(root, '.github/qualification/trust-policy.json')), 'utf8'));

const problems = [];
if (policy?.version !== 1 || !Array.isArray(policy?.requiredChecks) || !Array.isArray(policy?.requiredIndependent) || !Array.isArray(policy?.requiredEvidence)) problems.push('trust policy copy is unusable');
if (problems.length) { console.log(JSON.stringify({ accepted: false, authenticated: false, release: false, problems }, null, 2)); process.exit(1); }

// Integrity and exact subject binding (commit AND tree), clean candidate, clean producer.
if (record.recordVersion !== 1 || record.kind !== 'jvd-qualification-record') problems.push('unsupported record');
if ('signature' in record) problems.push('record carries an embedded signature field; authentication must be a detached attestation');
if (record.recordSha256 !== sha256(JSON.stringify({ ...record, recordSha256: undefined }))) problems.push('record digest mismatch');
const tree = git(['rev-parse', 'HEAD^{tree}']);
const commit = git(['rev-parse', 'HEAD']);
if (record.subject?.tree !== tree) problems.push(`record names tree ${record.subject?.tree}, candidate tree is ${tree}`);
if (record.subject?.commit !== commit) problems.push(`record names commit ${record.subject?.commit}, candidate commit is ${commit}`);
if (git(['status', '--porcelain']) !== '') problems.push('candidate working tree is dirty; acceptance binds the committed tree only');
if (record.subject?.dirty) problems.push('record was produced from a dirty tree');
if (record.subject?.repository !== policy.subject?.repository) problems.push(`record subject repository ${JSON.stringify(record.subject?.repository ?? null)} is not ${policy.subject?.repository}`);
if (record.builder?.repository !== policy.builder?.repository) problems.push(`record builder ${JSON.stringify(record.builder?.repository ?? null)} is not ${policy.builder?.repository}`);
if (!HEX40.test(record.builder?.commit ?? '')) problems.push('record does not bind an exact builder revision');
if (record.builder?.dirty !== false) problems.push('record was produced by a dirty builder tree');
for (const name of policy.requiredRules ?? []) if (!HEX64.test(record.rules?.[name] ?? '')) problems.push(`required rule identity missing: ${name}`);
for (const name of policy.requiredLocks ?? []) if (!HEX64.test(record.locks?.[name] ?? '')) problems.push(`required lock identity missing: ${name}`);
// Artifact and input hashes against this checkout.
const artifacts = Object.entries(record.artifacts ?? {});
const inputs = Object.entries(record.inputs ?? {});
if (!artifacts.length) problems.push('record binds no public artifacts');
if (!inputs.length) problems.push('record binds no source inputs');
for (const [relative, digest] of [...artifacts, ...inputs]) {
  const target = path.join(root, relative);
  if (!fs.existsSync(target)) problems.push(`missing: ${relative}`);
  else if (sha256(fs.readFileSync(target)) !== digest) problems.push(`hash mismatch: ${relative}`);
}
// Complete passing builder checks and PASS result.
for (const name of policy.requiredChecks) {
  const check = Array.isArray(record.checks) ? record.checks.find(row => row.name === name) : undefined;
  if (!check) problems.push(`required qualification check missing: ${name}`);
  else if (check.status !== 'pass') problems.push(`required qualification check ${name}: ${check.status}`);
}
if (record.result !== 'PASS') problems.push(`qualification result ${record.result}`);
// Evidence references (addresses + hashes; bytes live in the private evidence home).
const evidence = Array.isArray(record.evidence) ? record.evidence : [];
for (const row of evidence) if (typeof row?.name !== 'string' || typeof row?.location !== 'string' || !HEX64.test(row?.bytesSha256 ?? '') || !(Number.isInteger(row?.bytes) && row.bytes > 0)) problems.push(`evidence reference invalid: ${JSON.stringify(row?.name ?? null)}`);
for (const suffix of policy.requiredEvidence) if (!evidence.some(row => typeof row?.name === 'string' && row.name.endsWith(suffix))) problems.push(`required evidence missing: ${suffix}`);
for (const pattern of policy.requiredEvidencePatterns ?? []) if (!evidence.some(row => typeof row?.name === 'string' && new RegExp(pattern).test(row.name))) problems.push(`required evidence missing: ${pattern}`);
// Independent qualification bound into the record.
const audit = record.independentAudit;
if (!audit || typeof audit !== 'object') problems.push('independent qualification missing from the record');
else {
  const verifier = audit.verifier;
  if (!verifier || typeof verifier.repository !== 'string' || !HEX40.test(verifier.commit ?? '') || verifier.dirty !== false || !HEX64.test(verifier.scriptsSha256 ?? '')) problems.push('independent verifier revision is not bound');
  for (const name of policy.requiredIndependent) {
    const section = audit[name];
    if (!section || typeof section !== 'object') { problems.push(`independent qualification missing: ${name}`); continue; }
    if (name === 'evidenceRetrieval') { if (section.verified !== true || section.objects !== evidence.length) problems.push('evidence retrieval verification is not bound'); continue; }
    if (name === 'reviewEvidence') { if (section.verified !== true || !HEX64.test(section.set ?? '') || typeof section.store !== 'string' || section.objects !== evidence.filter(row => /\/review\//.test(row.name)).length) problems.push('review evidence set is not bound by pin'); continue; }
    if (section.result !== 'PASS') problems.push(`independent qualification ${name}: ${section.result ?? 'no result'}`);
    if (!HEX64.test(section.outputSha256 ?? '')) problems.push(`independent qualification ${name}: output digest missing`);
    if (name === 'dependencies' && (section.findings !== 0 || section.passed !== section.cases || !(section.cases > 0))) problems.push('independent dependency qualification did not pass every case');
    if (name !== 'dependencies' && section.failures !== 0) problems.push(`independent ${name} qualification reported failures`);
    if (name === 'relationshipsRetrieved' && (section.equalToCanonical !== true || !evidence.some(row => row.bytesSha256 === section.ledgerSha256))) problems.push('retrieved-evidence relationship qualification is not bound to the canonical result and evidence');
  }
}
// Freshness.
if (policy.maxRecordAgeDays !== undefined) {
  const produced = Date.parse(record.producedAt ?? '');
  if (!Number.isFinite(produced)) problems.push('record has no valid producedAt');
  else if (produced > Date.now() + 5 * 60 * 1000) problems.push('record producedAt is in the future');
  else if (Date.now() - produced > policy.maxRecordAgeDays * 86400000) problems.push(`record is older than ${policy.maxRecordAgeDays} days`);
}

console.log(JSON.stringify({ accepted: problems.length === 0, authenticated: false, release: false, mode: 'diagnostic (structural only; release acceptance runs in the trusted builder with a verified detached attestation)', tree, commit, problems }, null, 2));
process.exit(problems.length ? 1 : 0);
