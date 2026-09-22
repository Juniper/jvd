import { test } from "node:test";
import assert from "node:assert/strict";
import { auditOwnership, indexObjects, deriveDeviceOs } from "./object-ownership.mjs";

// A miniature JVD that reproduces the real MEBS firewall shape: one compound
// owner for a device whose policer body differs, one atomic filter owner shared
// across an OS boundary, and one policer owner shared across the same boundary.

const FILTER = `firewall {
    family any {
        filter F {
            interface-specific;
            term t1 {
                then policer P;
            }
        }
    }
}`;

const policer = (burst) => `firewall {
    policer P {
        if-exceeding {
            bandwidth-limit 50m;
            burst-size-limit ${burst};
        }
        then discard;
    }
}`;

const merge = (...blocks) =>
  `firewall {\n${blocks
    .map((b) => b.replace(/^firewall \{\n/, "").replace(/\n\}$/, ""))
    .join("\n")}\n}`;

// A logical-interface binding, so the filter is reachable exactly as it is in
// the real configs. Without a binding an object is dead config, which the audit
// classifies differently on purpose.
const BINDING = `interfaces {
    et-0/0/0 {
        unit 0 {
            family any {
                filter {
                    input F;
                }
            }
        }
    }
}`;

const SRC_COMPOUND = `${merge(FILTER, policer("10m"))}\n${BINDING}`; // d1
const SRC_SHARED = `${merge(FILTER, policer("2m"))}\n${BINDING}`; //    d2, d3

const snipCompound = {
  rel: "junos/firewall/compound.conf",
  dir: "junos",
  seenOn: { junos: ["d1"], evo: [] },
  body: merge(FILTER, policer("10m")),
};
const snipFilter = {
  rel: "evo/firewall/filter.conf",
  dir: "evo",
  seenOn: { junos: ["d2"], evo: ["d3"] },
  body: FILTER,
};
const snipPolicer = {
  rel: "evo/firewall/policers.conf",
  dir: "evo",
  seenOn: { junos: ["d2"], evo: ["d3"] },
  body: policer("2m"),
};

const sources = [
  { device: "d1", os: "junos", text: SRC_COMPOUND },
  { device: "d2", os: "junos", text: SRC_SHARED },
  { device: "d3", os: "evo", text: SRC_SHARED },
];

const row = (result, device, key) => result.rows.find((r) => r.device === device && r.objectKey === key);

test("a complete library passes with one owner per device object", () => {
  const r = auditOwnership({ sources, snips: [snipCompound, snipFilter, snipPolicer] });
  assert.equal(r.ok, true);
  assert.equal(r.unownedReferenced.length, 0);
  assert.equal(r.ambiguousOwners.length, 0);
  assert.equal(r.mismatched.length, 0);
  assert.equal(r.widened.length, 0);
  assert.equal(r.unresolvedRefs.length, 0);
});

test("a compound owner reconstructs the device it is seen on", () => {
  const r = auditOwnership({ sources, snips: [snipCompound, snipFilter, snipPolicer] });
  const f = row(r, "d1", "firewall-family-any-filter:F");
  assert.equal(f.selected, "junos/firewall/compound.conf");
  assert.equal(f.sourceCount, 1);
  assert.equal(f.reconstructedCount, 1);
  assert.equal(f.equal, true);
  const p = row(r, "d1", "firewall-policer:P");
  assert.equal(p.selected, "junos/firewall/compound.conf");
  assert.equal(p.equal, true);
  assert.equal(p.crossDirectory, false);
});

test("an atomic owner reconstructs, and serving the other OS is flagged cross-directory", () => {
  const r = auditOwnership({ sources, snips: [snipCompound, snipFilter, snipPolicer] });
  const junosSide = row(r, "d2", "firewall-family-any-filter:F");
  assert.equal(junosSide.selected, "evo/firewall/filter.conf");
  assert.equal(junosSide.equal, true);
  assert.equal(junosSide.crossDirectory, true);

  const evoSide = row(r, "d3", "firewall-family-any-filter:F");
  assert.equal(evoSide.equal, true);
  assert.equal(evoSide.crossDirectory, false);
});

test("the compound device never receives the shared policer body", () => {
  const r = auditOwnership({ sources, snips: [snipCompound, snipFilter, snipPolicer] });
  assert.equal(row(r, "d1", "firewall-policer:P").selected, "junos/firewall/compound.conf");
  assert.match(indexObjects(snipCompound.body).objects.get("firewall-policer:P")[0].canonical, /burst-size-limit 10m;/);
  assert.match(indexObjects(snipPolicer.body).objects.get("firewall-policer:P")[0].canonical, /burst-size-limit 2m;/);
});

test("a filter's policer reference resolves to exactly one applicable owner", () => {
  const r = auditOwnership({ sources, snips: [snipCompound, snipFilter, snipPolicer] });
  const refs = r.refFindings.filter((f) => f.policer === "P");
  assert.equal(refs.length, 3);
  assert.ok(refs.every((f) => f.resolved && f.selected));
  assert.equal(refs.find((f) => f.device === "d1").selected, "junos/firewall/compound.conf");
  assert.equal(refs.find((f) => f.device === "d3").selected, "evo/firewall/policers.conf");
});

// --- negatives ---

test("NEGATIVE duplicate owner: two applicable snips with DIFFERING bodies are ambiguous", () => {
  const rival = { ...snipFilter, rel: "junos/firewall/rival.conf", dir: "junos", body: FILTER.replace("term t1", "term t2") };
  const r = auditOwnership({ sources, snips: [snipCompound, snipFilter, rival, snipPolicer] });
  assert.equal(r.ok, false);
  assert.equal(r.ambiguousOwners.length, 2); // d2 and d3
  assert.equal(r.ambiguousOwners[0].distinctBodies, 2);
  assert.equal(r.ambiguousOwners[0].selected, null);
});

test("an identical twin is an equivalent representation, not a duplicate owner", () => {
  const twin = { ...snipFilter, rel: "junos/firewall/filter.conf", dir: "junos" };
  const r = auditOwnership({ sources, snips: [snipCompound, snipFilter, twin, snipPolicer] });
  assert.equal(r.ok, true);
  assert.equal(r.ambiguousOwners.length, 0);
  const junosSide = row(r, "d2", "firewall-family-any-filter:F");
  assert.equal(junosSide.distinctBodies, 1);
  assert.equal(junosSide.selected, "junos/firewall/filter.conf"); // same-directory preferred
  assert.deepEqual(junosSide.equivalentOwners, ["evo/firewall/filter.conf"]);
  assert.equal(junosSide.crossDirectory, false);
  assert.equal(row(r, "d3", "firewall-family-any-filter:F").selected, "evo/firewall/filter.conf");
});

test("equivalence is decided by the emitted object, never by directory", () => {
  const rival = { ...snipFilter, rel: "junos/firewall/rival.conf", dir: "junos", body: FILTER.replace("interface-specific;", "") };
  const r = auditOwnership({ sources, snips: [snipCompound, snipFilter, rival, snipPolicer] });
  const junosSide = row(r, "d2", "firewall-family-any-filter:F");
  assert.equal(junosSide.ambiguous, true);
  assert.equal(junosSide.selected, null); // same-directory preference cannot hide it
});

test("NEGATIVE missing owner: a referenced source object no snip claims fails", () => {
  const r = auditOwnership({ sources, snips: [snipCompound, snipPolicer] });
  assert.equal(r.ok, false);
  assert.deepEqual(
    r.unowned.map((u) => `${u.device} ${u.objectKey}`),
    ["d2 firewall-family-any-filter:F", "d3 firewall-family-any-filter:F"],
  );
});

test("an unowned object nothing references is reported without failing", () => {
  const withDead = `${SRC_SHARED}\nfirewall {\n    family any {\n        filter DEAD {\n            interface-specific;\n        }\n    }\n}`;
  const r = auditOwnership({
    sources: [{ device: "d2", os: "junos", text: withDead }],
    snips: [snipFilter, snipPolicer],
  });
  assert.equal(r.ok, true);
  assert.deepEqual(r.unownedUnreferenced.map((u) => u.objectKey), ["firewall-family-any-filter:DEAD"]);
  assert.equal(r.unownedReferenced.length, 0);
});

test("a referenced unowned object is distinguished from an unreferenced one", () => {
  const r = auditOwnership({ sources, snips: [snipCompound, snipPolicer] });
  assert.equal(row(r, "d2", "firewall-family-any-filter:F").sourceReferences, 1); // the interface binding
  assert.equal(r.unownedUnreferenced.length, 0);
  assert.equal(r.unownedReferenced.length, 2);
});

test("NEGATIVE body mismatch: a wrong body is reported, never accepted", () => {
  const wrong = { ...snipFilter, body: FILTER.replace("interface-specific;", "") };
  const r = auditOwnership({ sources, snips: [snipCompound, wrong, snipPolicer] });
  assert.equal(r.ok, false);
  assert.equal(r.mismatched.length, 2);
  assert.equal(row(r, "d2", "firewall-family-any-filter:F").equal, false);
});

test("NEGATIVE wrong policer generation: the 2m body does not satisfy the 10m device", () => {
  const widened = { ...snipPolicer, seenOn: { junos: ["d1", "d2"], evo: ["d3"] } };
  const r = auditOwnership({ sources, snips: [snipCompound, snipFilter, widened] });
  assert.equal(r.ok, false);
  const p = row(r, "d1", "firewall-policer:P");
  assert.equal(p.ambiguous, true);
  assert.equal(p.distinctBodies, 2);
});

test("NEGATIVE widened ownership: claiming a device whose source lacks the object fails", () => {
  const widened = { ...snipFilter, seenOn: { junos: ["d2"], evo: ["d3", "d4"] } };
  const r = auditOwnership({
    sources: [...sources, { device: "d4", os: "evo", text: merge(policer("2m")) }],
    snips: [snipCompound, widened, { ...snipPolicer, seenOn: { junos: ["d2"], evo: ["d3", "d4"] } }],
  });
  assert.equal(r.ok, false);
  assert.deepEqual(r.widened.map((w) => `${w.device} ${w.objectKey}`), ["d4 firewall-family-any-filter:F"]);
});

test("NEGATIVE duplicate definition in source is reported, not collapsed", () => {
  const doubled = `${merge(FILTER, policer("2m"), policer("2m"))}\n${BINDING}`;
  const r = auditOwnership({
    sources: [{ device: "d2", os: "junos", text: doubled }],
    snips: [snipFilter, snipPolicer],
  });
  assert.equal(r.ok, false);
  assert.equal(r.duplicateInSource.length, 1);
  assert.equal(row(r, "d2", "firewall-policer:P").sourceCount, 2);
});

test("NEGATIVE an owner defining the same object twice is reported", () => {
  const doubled = { ...snipPolicer, body: merge(policer("2m"), policer("2m")) };
  const r = auditOwnership({ sources, snips: [snipCompound, snipFilter, doubled] });
  assert.equal(r.ok, false);
  assert.ok(r.duplicateInOwner.length > 0);
});

test("NEGATIVE unparseable input is unproven, never equal", () => {
  const broken = { ...snipFilter, body: FILTER.slice(0, -1) };
  const r = auditOwnership({ sources, snips: [snipCompound, broken, snipPolicer] });
  assert.equal(r.ok, false);
  assert.deepEqual(r.parseFailures, [{ where: "snip", id: "evo/firewall/filter.conf" }]);
  assert.equal(row(r, "d2", "firewall-family-any-filter:F").selected, null);
});

test("a templated ${VAR} body is parseable and is not read as a brace pair", () => {
  const templated = `firewall {\n    family any {\n        filter \${FILTER_NAME} {\n            interface-specific;\n        }\n    }\n}`;
  const { ok, objects } = indexObjects(templated);
  assert.equal(ok, true);
  assert.deepEqual([...objects.keys()], ["firewall-family-any-filter:${FILTER_NAME}"]);
});

test("a templated owner body is unproven, never equal and never a mismatch", () => {
  const templatedOwner = { ...snipPolicer, body: policer("$BURST") };
  const r = auditOwnership({ sources, snips: [snipCompound, snipFilter, templatedOwner] });
  const p = row(r, "d2", "firewall-policer:P");
  assert.equal(p.templated, true);
  assert.equal(p.equal, null);
  assert.equal(r.mismatched.length, 0);
  assert.equal(r.templatedUnproven.length, 2); // d2 and d3
  assert.equal(r.ok, false); // unproven cannot pass as proven
});

test("a selector whose object names are templated is reported unsupported", () => {
  const templatedName = { ...snipFilter, body: FILTER.replace("filter F", "filter $NAME") };
  const r = auditOwnership({ sources, snips: [snipCompound, templatedName, snipPolicer] });
  assert.deepEqual(r.templatedNameSelectors, ["firewall-family-any-filter"]);
  assert.equal(r.ok, false);
});

// --- line endings ---

test("CRLF snips prove LF sources and vice versa", () => {
  const toCrlf = (s) => s.replace(/\n/g, "\r\n");
  const crlfSnips = [snipCompound, snipFilter, snipPolicer].map((s) => ({ ...s, body: toCrlf(s.body) }));
  assert.equal(auditOwnership({ sources, snips: crlfSnips }).ok, true);

  const crlfSources = sources.map((s) => ({ ...s, text: toCrlf(s.text) }));
  assert.equal(auditOwnership({ sources: crlfSources, snips: [snipCompound, snipFilter, snipPolicer] }).ok, true);
  assert.equal(auditOwnership({ sources: crlfSources, snips: crlfSnips }).ok, true);
});

test("line-ending normalization does not hide a real difference", () => {
  const toCrlf = (s) => s.replace(/\n/g, "\r\n");
  const wrong = { ...snipFilter, body: toCrlf(FILTER.replace("term t1", "term t2")) };
  assert.equal(auditOwnership({ sources, snips: [snipCompound, wrong, snipPolicer] }).ok, false);
});

// --- OS derivation ---

test("device OS comes from Seen-on rows, and both-row devices are a conflict", () => {
  const { os, conflicts } = deriveDeviceOs([snipCompound, snipFilter, snipPolicer]);
  assert.equal(os.get("d1"), "junos");
  assert.equal(os.get("d2"), "junos");
  assert.equal(os.get("d3"), "evo");
  assert.deepEqual(conflicts, []);

  const bad = deriveDeviceOs([snipFilter, { ...snipPolicer, seenOn: { junos: [], evo: ["d2"] } }]);
  assert.deepEqual(bad.conflicts, [{ device: "d2", rows: ["evo", "junos"] }]);
  assert.equal(bad.os.has("d2"), false);
});
