// Public acceptance check for a detached JVD qualification record.
// Reads only this checkout, the record passed in and the trust policy committed under .github/qualification/.
// Needs no builder access or credentials. Every condition below must hold independently; a signature never
// substitutes for a missing check, a wrong tree or a stale record. `--allow-unauthenticated` is a diagnostic
// mode that tolerates a *null* signature only and is never release acceptance.
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
const KNOWN_SIGNATURE_FORMATS = ['sigstore-bundle'];

const file = option('--record');
if (!file) { console.error('Usage: node .github/scripts/accept-qualification.mjs --record <record.json> [--policy <trust-policy.json>] [--allow-unauthenticated]'); process.exit(2); }
const diagnostic = process.argv.includes('--allow-unauthenticated');
const record = JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
const policy = JSON.parse(fs.readFileSync(path.resolve(option('--policy') ?? path.join(root, '.github/qualification/trust-policy.json')), 'utf8'));

const policyProblems = [];
if (policy?.version !== 1) policyProblems.push(`unsupported trust policy version ${JSON.stringify(policy?.version ?? null)}`);
if (typeof policy?.subject?.repository !== 'string' || typeof policy?.builder?.repository !== 'string') policyProblems.push('trust policy must name subject and builder repositories');
if (!Array.isArray(policy?.signers)) policyProblems.push('trust policy signers must be a list');
for (const key of ['requiredChecks', 'requiredRules', 'requiredLocks', 'requiredEvidence']) if (!Array.isArray(policy?.[key]) || !policy[key].length) policyProblems.push(`trust policy ${key} must be a nonempty list`);
if (policyProblems.length) { console.log(JSON.stringify({ accepted: false, authenticated: false, problems: policyProblems.map(p => `trust policy: ${p}`) }, null, 2)); process.exit(1); }

const problems = [];
// 11. Integrity and non-substitution: digest, exact tree AND commit, clean candidate, clean producer.
if (record.recordVersion !== 1 || record.kind !== 'jvd-qualification-record') problems.push('unsupported record');
if (record.recordSha256 !== sha256(JSON.stringify({ ...record, recordSha256: undefined, signature: undefined }))) problems.push('record digest mismatch');
const tree = git(['rev-parse', 'HEAD^{tree}']);
const commit = git(['rev-parse', 'HEAD']);
if (record.subject?.tree !== tree) problems.push(`record names tree ${record.subject?.tree}, candidate tree is ${tree}`);
if (record.subject?.commit !== commit) problems.push(`record names commit ${record.subject?.commit}, candidate commit is ${commit}`);
if (git(['status', '--porcelain']) !== '') problems.push('candidate working tree is dirty; acceptance binds the committed tree only');
if (record.subject?.dirty) problems.push('record was produced from a dirty tree');
// 3/9. Subject binding.
if (record.subject?.repository !== policy.subject.repository) problems.push(`record subject repository ${JSON.stringify(record.subject?.repository ?? null)} is not ${policy.subject.repository}`);
// 4. Builder binding.
if (record.builder?.repository !== policy.builder.repository) problems.push(`record builder ${JSON.stringify(record.builder?.repository ?? null)} is not ${policy.builder.repository}`);
if (!HEX40.test(record.builder?.commit ?? '')) problems.push('record does not bind an exact builder revision');
if (record.builder?.dirty !== false) problems.push('record was produced by a dirty builder tree');
// 5. Rules / toolchain / lock identities.
for (const name of policy.requiredRules) if (!HEX64.test(record.rules?.[name] ?? '')) problems.push(`required rule identity missing: ${name}`);
for (const name of policy.requiredLocks) if (!HEX64.test(record.locks?.[name] ?? '')) problems.push(`required lock identity missing: ${name}`);
// 8/9. Artifact and input hashes against this checkout.
const artifacts = Object.entries(record.artifacts ?? {});
const inputs = Object.entries(record.inputs ?? {});
if (!artifacts.length) problems.push('record binds no public artifacts');
if (!inputs.length) problems.push('record binds no source inputs');
for (const [relative, digest] of [...artifacts, ...inputs]) {
  const target = path.join(root, relative);
  if (!fs.existsSync(target)) problems.push(`missing: ${relative}`);
  else if (sha256(fs.readFileSync(target)) !== digest) problems.push(`hash mismatch: ${relative}`);
}
// 6/7. Complete, passing check inventory and PASS result.
for (const name of policy.requiredChecks) {
  const check = Array.isArray(record.checks) ? record.checks.find(row => row.name === name) : undefined;
  if (!check) problems.push(`required qualification check missing: ${name}`);
  else if (check.status !== 'pass') problems.push(`required qualification check ${name}: ${check.status}`);
}
if (record.result !== 'PASS') problems.push(`qualification result ${record.result}`);
// 10. Evidence references (addresses + hashes; the bytes live in the private evidence home).
const evidence = Array.isArray(record.evidence) ? record.evidence : [];
for (const row of evidence) if (typeof row?.name !== 'string' || typeof row?.location !== 'string' || !HEX64.test(row?.bytesSha256 ?? '') || !(Number.isInteger(row?.bytes) && row.bytes > 0)) problems.push(`evidence reference invalid: ${JSON.stringify(row?.name ?? null)}`);
for (const suffix of policy.requiredEvidence) if (!evidence.some(row => typeof row?.name === 'string' && row.name.endsWith(suffix))) problems.push(`required evidence missing: ${suffix}`);
for (const pattern of policy.requiredEvidencePatterns ?? []) if (!evidence.some(row => typeof row?.name === 'string' && new RegExp(pattern).test(row.name))) problems.push(`required evidence missing: ${pattern}`);
// 11. Staleness.
if (policy.maxRecordAgeDays !== undefined) {
  const produced = Date.parse(record.producedAt ?? '');
  if (!Number.isFinite(produced)) problems.push('record has no valid producedAt');
  else if (produced > Date.now() + 5 * 60 * 1000) problems.push('record producedAt is in the future');
  else if (Date.now() - produced > policy.maxRecordAgeDays * 86400000) problems.push(`record is older than ${policy.maxRecordAgeDays} days`);
}
// 1/2. Authentication: decided here against the policy, never by fields inside the record. No verifier for any
// format is available in this environment yet, so every populated signature fails closed.
let authenticated = false;
const signature = record.signature;
if (signature === null || signature === undefined) {
  if (!diagnostic) problems.push('record is not authenticated by a trusted identity');
} else if (typeof signature !== 'object' || Array.isArray(signature)) problems.push('malformed signature');
else if (!KNOWN_SIGNATURE_FORMATS.includes(signature.format)) problems.push(`unsupported signature format ${JSON.stringify(signature.format ?? null)}`);
else if (!policy.signers.length) problems.push('trust policy approves no signer; release acceptance is not possible');
else problems.push(`no verifier available for ${signature.format}; authentication cannot be established`);

console.log(JSON.stringify({ accepted: problems.length === 0, authenticated, mode: diagnostic ? 'diagnostic (unauthenticated records tolerated; not release acceptance)' : 'strict', tree, commit, policySigners: policy.signers.length, problems }, null, 2));
process.exit(problems.length ? 1 : 0);
