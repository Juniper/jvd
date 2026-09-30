import test from "node:test";
import assert from "node:assert/strict";
import { sourceTree } from "./generate-bindings.mjs";
import {
  peerFeatures,
  vpwsEndpoints,
  corroborateVpws,
  joinVpws,
  bgpEndpoints,
  corroborateBgp,
  joinBgp,
  resolvePeerContext,
  vpnEndpoints,
  joinVpn,
  cfmEndpoints,
  joinCfm,
  createPeerAnalysis,
  kompellaEndpoints,
  joinKompella,
  ldpEndpoints,
  joinLdp,
  ethernetSegmentEndpoints,
  joinEthernetSegments,
  topologyEndpoints,
  matchPeerGlob,
} from "./snip-peers.mjs";
import { occurrenceMap } from "./generate-bindings.mjs";

test("peer globs match literal characters and stars without regex backtracking", () => {
  for (const [pattern, value, expected] of [
    ["a*b", "ab", true],
    ["a*b", "axyzb", true],
    ["a*b", "axyzc", false],
    ["*", "", true],
    ["a**b*", "abmore", true],
    ["ae*.0", "ae12.0", true],
    ["ae*.0", "ae12x0", false],
    ["a*".repeat(22) + "b", "a".repeat(48) + "c", false],
    ["a*".repeat(22) + "b", "a".repeat(48) + "b", true],
  ])
    assert.equal(matchPeerGlob(pattern, value), expected, `${pattern}: ${value}`);
  const budget = { remaining: 12 };
  assert.equal(matchPeerGlob("a*", "abc", budget), true);
  assert.equal(matchPeerGlob("a*", "abc", budget), null);
  const name = "a".repeat(2000);
  const pattern = `<${"a*".repeat(600)}b>`;
  const source = sourceTree(
    `groups { GR { routing-instances { ${pattern} { vrf-target target:1:1; } } } } routing-instances { apply-groups GR; ${name} { instance-type vrf; } }`,
  );
  assert.equal(
    resolvePeerContext(source, source.nodes[1].children[1]).reason,
    "group-pattern-budget-exceeded",
  );
});

test("unresolved VPWS candidates remain visible unless known constraints exclude them", () => {
  const make = (device, local, remote, rt = "target:65000:1", uncertain = false) => ({
    device,
    text: `${uncertain ? "policy-options { community RT { members target:65000:1; } policy-statement IMPORT { term t { from { protocol bgp; community RT; } then accept; } } }" : ""} routing-instances { S { instance-type evpn-vpws; interface ae1.1; vrf-target ${rt}; ${uncertain ? "vrf-import IMPORT;" : ""} protocols { evpn { interface ae1.1 { vpws-service-id { local ${local}; remote ${remote}; } } } } } }`,
  });
  const left = make("left", 1, 2);
  const right = make("right", 2, 1);
  const competitor = make("possible-right", 2, 1, "target:65000:1", true);
  for (const sources of [
    [left, right, competitor],
    [competitor, right, left],
  ]) {
    const outcomes = joinVpws(
      sources.flatMap((source) => vpwsEndpoints(sourceTree(source.text), source.device)),
    );
    assert.ok(outcomes.every((outcome) => outcome.status === "unresolved"));
    const body = left.text;
    const template = { relative: "junos/routing-instances/left.conf", body, normalized: body };
    const analysis = createPeerAnalysis({ sources, templates: [template] });
    for (const source of sources)
      analysis.observe({
        body,
        device: source.device,
        measured: occurrenceMap(body, sourceTree(source.text)),
      });
    assert.equal(analysis.summary()[template.relative].status, "unresolved");
  }
  for (const unrelated of [
    make("other", 3, 4, "target:65000:1", true),
    make("other", 2, 1, "target:65000:99", true),
  ]) {
    const outcomes = joinVpws(
      [left, right, unrelated].flatMap((source) =>
        vpwsEndpoints(sourceTree(source.text), source.device),
      ),
    );
    assert.ok(
      outcomes
        .filter((outcome) => outcome.endpoint.device !== "other")
        .every((outcome) => outcome.status === "corroborated"),
    );
  }
});

test("VPN completeness retains potential incoming or outgoing flows from unresolved policies", () => {
  const make = (device, rt) => ({
    kind: "ip-vpn-membership",
    device,
    reason: null,
    routing: { status: "resolved", imports: [rt], exports: [rt] },
  });
  const left = make("left", "target:1:1");
  const right = make("right", "target:1:1");
  const unknown = {
    ...make("unknown", "target:1:1"),
    reason: "import-policy-semantics",
    routing: {
      status: "unresolved",
      reason: "import-policy-semantics",
      imports: null,
      exports: ["target:1:1"],
    },
  };
  assert.ok(joinVpn([left, right, unknown]).every((outcome) => outcome.status === "unresolved"));
  const unrelated = {
    ...unknown,
    routing: { ...unknown.routing, imports: ["target:1:99"], exports: ["target:1:99"] },
  };
  assert.ok(
    joinVpn([left, right, unrelated])
      .filter((outcome) => outcome.endpoint.device !== "unknown")
      .every((outcome) => outcome.status === "corroborated"),
  );
});

test("LDP transport and routing identity use effective context with direct/inherited parity", () => {
  const make = (
    device,
    local,
    remote,
    prefix = "",
    settings = "",
    routing = `router-id ${local};`,
  ) => ({
    device,
    text: `${prefix} interfaces { lo0 { unit 0 { family inet { address ${local}/32; } } } } routing-options { ${routing} } protocols { ldp { ${settings} interface lo0.0; } l2circuit { neighbor ${remote} { interface ae1.1 { virtual-circuit-id 100; } } } }`,
  });
  const right = make("right", "192.0.2.2", "192.0.2.1");
  for (const settings of ["transport-address interface;", "disable;"]) {
    const direct = make("left", "192.0.2.1", "192.0.2.2", "", settings);
    const inherited = make(
      "left",
      "192.0.2.1",
      "192.0.2.2",
      `groups { GR { protocols { ldp { ${settings} } } } } apply-groups GR;`,
    );
    for (const left of [direct, inherited]) {
      const endpoints = [left, right].flatMap((source) =>
        ldpEndpoints(sourceTree(source.text), source.device),
      );
      assert.equal(endpoints[0].reason, "unresolved-ldp-transport");
      assert.ok(joinLdp(endpoints).every((outcome) => outcome.status === "unresolved"));
    }
  }
  const inherited = make(
    "left",
    "192.0.2.1",
    "192.0.2.2",
    "groups { GR { routing-options { router-id 192.0.2.1; } protocols { ldp { transport-address router-id; } } } } apply-groups GR;",
    "",
    "autonomous-system 65000;",
  );
  const endpoints = [inherited, right].flatMap((source) =>
    ldpEndpoints(sourceTree(source.text), source.device),
  );
  assert.equal(endpoints[0].localAddress, "192.0.2.1");
  assert.ok(joinLdp(endpoints).every((outcome) => outcome.status === "corroborated"));
});

test("unexpanded wildcard and intermediate nested inheritance cannot certify BGP", () => {
  const left =
    "groups { GR { protocols { bgp { group <*> { local-as 65099; } } } } } interfaces { lo0 { unit 0 { family inet { address 192.0.2.1/32; } } } } routing-options { autonomous-system 65000; } protocols { bgp { apply-groups GR; group G { type external; local-address 192.0.2.1; peer-as 65001; family inet { unicast; } neighbor 192.0.2.2; } } }";
  const right = bgpEndpoint("right", "192.0.2.2", "192.0.2.1", 65001, 65000);
  const endpoints = bgpEndpoints(sourceTree(left), "left");
  assert.equal(endpoints[0].reason, "inherited-peer-context");
  assert.ok(joinBgp([...endpoints, right]).every((outcome) => outcome.status === "unresolved"));
  for (const keyword of ["apply-groups", "apply-groups-except"]) {
    const source = sourceTree(
      `groups { OUTER { protocols { ${keyword} INNER; bgp { hold-time 10; } } } INNER { protocols { bgp { local-address 192.0.2.99; } } } } apply-groups OUTER; protocols { bgp { hold-time 30; } }`,
    );
    assert.equal(
      resolvePeerContext(source, source.nodes[2].children[0]).reason,
      "nested-group-inheritance",
    );
  }
});

test("dynamic BGP and unknown protocol settings remain unresolved, never local-only", () => {
  for (const body of [
    "protocols { bgp { group CLIENTS { type internal; allow 192.0.2.0/24; } } }",
    "protocols { bgp { future-session-option enabled; } }",
    "protocols { isis { future-neighbor-mode enabled; } }",
    "protocols { oam { future-session remote; } }",
  ]) {
    const source = { device: "router", text: body };
    const template = { relative: "junos/protocols/fixture.conf", body, normalized: body };
    const analysis = createPeerAnalysis({ sources: [source], templates: [template] });
    analysis.observe({
      body,
      device: source.device,
      measured: occurrenceMap(body, sourceTree(body)),
    });
    assert.equal(analysis.summary()[template.relative].status, "unresolved", body);
    assert.equal(analysis.summary()[template.relative].peersWith, undefined);
  }
  assert.deepEqual(peerFeatures("protocols { bgp { hold-time 10; tcp-mss 4096; } }"), []);
});

test("VPWS cannot publish an edge whose remote endpoint lacks multihoming proof", () => {
  const make = (device, local, remote) => ({
    device,
    text: `routing-instances { S { instance-type evpn-vpws; interface ae1.1; vrf-target target:65000:1; protocols { evpn { interface ae1.1 { vpws-service-id { local ${local}; remote ${remote}; } } } } } }`,
  });
  const sources = [make("left", 1, 2), make("duplicate", 1, 2), make("right", 2, 1)];
  for (const population of [sources, [...sources].reverse()]) {
    const outcomes = joinVpws(
      population.flatMap((source) => vpwsEndpoints(sourceTree(source.text), source.device)),
    );
    assert.ok(outcomes.every((outcome) => outcome.status === "unresolved"));
    const body = sources[0].text;
    const template = { relative: "junos/routing-instances/left.conf", body, normalized: body };
    const analysis = createPeerAnalysis({ sources: population, templates: [template] });
    for (const source of population)
      analysis.observe({
        body,
        device: source.device,
        measured: occurrenceMap(body, sourceTree(source.text)),
      });
    assert.equal(analysis.summary()[template.relative].status, "unresolved");
  }
});

test("VPN membership checks incoming-only as well as outgoing-only relationships", () => {
  const make = (device, imports, exports) => ({
    kind: "ip-vpn-membership",
    device,
    reason: null,
    routing: { status: "resolved", imports, exports },
  });
  const endpoints = [
    make("left", ["target:1:1", "target:1:2"], ["target:1:1"]),
    make("right", ["target:1:1"], ["target:1:1"]),
    make("sender", ["target:1:3"], ["target:1:2"]),
  ];
  for (const population of [endpoints, [...endpoints].reverse()]) {
    const result = joinVpn(population);
    assert.equal(
      result.find((outcome) => outcome.endpoint.device === "left").reason,
      "directional-vpn-membership",
    );
    assert.equal(
      result.find((outcome) => outcome.endpoint.device === "sender").reason,
      "directional-vpn-membership",
    );
  }
  assert.ok(joinVpn(endpoints.slice(0, 2)).every((outcome) => outcome.status === "corroborated"));
});

test("VPN directionality agrees with an independent exhaustive three-device graph", () => {
  const devices = ["one", "two", "three"];
  const edges = devices.flatMap((from) =>
    devices.filter((to) => from !== to).map((to) => [from, to]),
  );
  for (let mask = 0; mask < 2 ** edges.length; mask++) {
    const enabled = edges.filter((edge, index) => mask & (1 << index));
    const endpoints = devices.map((device) => ({
      kind: "ip-vpn-membership",
      device,
      reason: null,
      routing: {
        status: "resolved",
        exports: edges.flatMap(([from], index) =>
          from === device && mask & (1 << index) ? [`target:65000:${index}`] : [],
        ),
        imports: edges.flatMap(([, to], index) =>
          to === device && mask & (1 << index) ? [`target:65000:${index}`] : [],
        ),
      },
    }));
    for (const population of [endpoints, [...endpoints].reverse()]) {
      for (const outcome of joinVpn(population)) {
        const device = outcome.endpoint.device;
        const outgoing = enabled
          .filter(([from]) => from === device)
          .map(([, to]) => to)
          .sort();
        const incoming = enabled
          .filter(([, to]) => to === device)
          .map(([from]) => from)
          .sort();
        const expected =
          outgoing.length > 0 && JSON.stringify(outgoing) === JSON.stringify(incoming);
        assert.equal(outcome.status === "corroborated", expected, `${mask}: ${device}`);
      }
    }
  }
});

test("static BGP matches cannot hide dynamic neighbors or disabled sessions", () => {
  const make = (device, local, remote, asn, peer, extra = "") => ({
    device,
    text: `interfaces { lo0 { unit 0 { family inet { address ${local}/32; } } } } routing-options { autonomous-system ${asn}; } protocols { bgp { ${extra} group G { type external; local-address ${local}; peer-as ${peer}; family inet { unicast; } neighbor ${remote}; } } }`,
  });
  const right = make("right", "192.0.2.2", "192.0.2.1", 65001, 65000);
  for (const extra of ["group DYNAMIC { type internal; allow 198.51.100.0/24; }", "disable;"]) {
    const left = make("left", "192.0.2.1", "192.0.2.2", 65000, 65001, extra);
    const sources = [left, right];
    const body = left.text.slice(left.text.indexOf("protocols"));
    const template = { relative: "junos/protocols/mixed.conf", body, normalized: body };
    const analysis = createPeerAnalysis({ sources, templates: [template] });
    for (const source of sources)
      analysis.observe({
        body,
        device: source.device,
        measured: occurrenceMap(body, sourceTree(source.text)),
      });
    assert.equal(analysis.summary()[template.relative].status, "unresolved", extra);
  }
  const source = sourceTree(
    "groups { GR { protocols { bgp { local-as 65099; } } } } protocols { bgp { apply-groups GR; local-as 65000 { no-prepend-global-as; } } }",
  );
  assert.equal(
    resolvePeerContext(source, source.nodes[1].children[0]).reason,
    "unsupported-inherited-scalar-form",
  );
});

function endpoint(
  device,
  local,
  remote,
  { rd = "1:1", rt = "target:65000:1", extra = "", policy = "" } = {},
) {
  const text = `${policy} routing-instances { service-${device} { instance-type evpn-vpws; interface ae1.1; route-distinguisher ${rd}; vrf-target ${rt}; ${extra} protocols { evpn { interface ae1.1 { vpws-service-id { local ${local}; remote ${remote}; } } } } } }`;
  return vpwsEndpoints(sourceTree(text), device)[0];
}

test("VPWS requires complementary IDs, mutual targets and distinct devices, not equal RD or local names", () => {
  const left = endpoint("left", 1, 2);
  assert.equal(corroborateVpws(left, endpoint("right", 2, 1, { rd: "2:7" })), true);
  assert.equal(corroborateVpws(left, endpoint("right", 1, 2)), false);
  assert.equal(corroborateVpws(left, endpoint("right", 2, 1, { rt: "target:65000:2" })), false);
  assert.equal(corroborateVpws(left, endpoint("left", 2, 1)), false);
});

test("VPWS resolves explicit export policy targets and does not confuse colour with RT", () => {
  const policy =
    "policy-options { community SERVICE { members target:65000:9; } community GOLD { members color:0:4000; } policy-statement EXPORT { term a { then { community add SERVICE; community add GOLD; accept; } } term b { then reject; } } }";
  const left = endpoint("left", 1, 2, { extra: "vrf-export EXPORT;", policy });
  assert.deepEqual(left.routing.exports, ["target:65000:9"]);
  assert.equal(corroborateVpws(left, endpoint("right", 2, 1)), false);
  const conditional = endpoint("left", 1, 2, {
    extra: "vrf-export EXPORT;",
    policy: policy.replace("term a { then", "term a { from protocol bgp; then"),
  });
  assert.equal(conditional.reason, "export-policy-semantics");
});

test("VPWS inherited, missing and competing endpoints remain unresolved", () => {
  const left = endpoint("left", 1, 2);
  const right = endpoint("right", 2, 1);
  assert.equal(joinVpws([left, right])[0].status, "corroborated");
  assert.equal(joinVpws([left])[0].reason, "counterpart-not-found");
  assert.equal(
    joinVpws([left, right, endpoint("other", 2, 1)])[0].reason,
    "multiple-endpoints-require-multihoming-proof",
  );
  assert.equal(
    endpoint("left", 1, 2, { extra: "apply-groups GR;" }).reason,
    "inherited-peer-context",
  );
});

test("peer classification retains all protocol and group families, not only implemented VPWS", () => {
  for (const protocol of ["isis", "isis-instance", "ospf", "ldp", "pcep", "esis"]) {
    assert.ok(
      peerFeatures(`protocols { ${protocol} { interface ae1.0; } }`).includes(
        `protocol:${protocol}`,
      ),
    );
  }
  for (const protocol of ["bgp", "l2circuit"])
    assert.ok(
      peerFeatures(`protocols { ${protocol} { neighbor $REMOTE; } }`).includes(
        `protocol:${protocol}`,
      ),
    );
  assert.ok(
    peerFeatures("protocols { mpls { label-switched-path PATH { to 192.0.2.1; } } }").includes(
      "protocol:mpls",
    ),
  );
  assert.ok(peerFeatures("protocols { oam { mep 1; } }").includes("protocol:oam"));
  assert.ok(
    peerFeatures("groups { GR { protocols { bgp { neighbor $REMOTE; } } } }").includes(
      "group-definition",
    ),
  );
  assert.deepEqual(
    peerFeatures(
      "groups { GR { protocols { isis { interface <*> { bfd-liveness-detection { minimum-interval 100; } } } } } }",
    ),
    [],
  );
  assert.deepEqual(peerFeatures("policy-options { community RT { members target:1:1; } }"), []);
  assert.deepEqual(peerFeatures("unknown { x; }"), ["unclassified-construct"]);
  assert.deepEqual(
    peerFeatures(
      "protocols { l2circuit { local-switching { interface ae1.1 { end-interface { interface ae2.2; } } } } }",
    ),
    [],
  );
  assert.deepEqual(peerFeatures("protocols { esis { disable; } }"), []);
});

function bgpEndpoint(device, local, remote, localAS, peerAS, extra = "") {
  const text = `interfaces { lo0 { unit 0 { family inet { address ${local}/32; } } } } routing-options { autonomous-system ${localAS}; } protocols { bgp { group GROUP-${device} { type external; local-address ${local}; peer-as ${peerAS}; family inet { unicast; } neighbor ${remote} { ${extra} } } } }`;
  return bgpEndpoints(sourceTree(text), device)[0];
}

test("BGP corroborates reciprocal addresses and AS with neighbor overrides, not group names", () => {
  const left = bgpEndpoint("left", "192.0.2.1", "192.0.2.2", 65000, 65001);
  const right = bgpEndpoint("right", "192.0.2.2", "192.0.2.1", 65001, 65000);
  assert.equal(corroborateBgp(left, right), true);
  assert.equal(
    corroborateBgp(left, bgpEndpoint("right", "192.0.2.2", "192.0.2.1", 65002, 65000)),
    false,
  );
  assert.equal(
    corroborateBgp(
      left,
      bgpEndpoint("right", "192.0.2.2", "192.0.2.1", 65002, 65000, "local-as 65001;"),
    ),
    true,
  );
  assert.equal(joinBgp([left])[0].reason, "counterpart-not-found");
  assert.equal(
    joinBgp([left, right, { ...right, device: "duplicate" }])[0].reason,
    "ambiguous-bgp-counterpart",
  );
});

test("BGP refuses inherited, implicit or ambiguous address identities", () => {
  assert.equal(
    bgpEndpoint("left", "192.0.2.1", "192.0.2.2", 65000, 65001, "apply-groups GR;").reason,
    "inherited-peer-context",
  );
  const text =
    "routing-options { autonomous-system 65000; } protocols { bgp { group G { type external; peer-as 65001; family inet { unicast; } neighbor 192.0.2.2; } } }";
  assert.equal(bgpEndpoints(sourceTree(text), "left")[0].reason, "incomplete-bgp-identity");
  assert.equal(
    corroborateBgp(
      {
        ...bgpEndpoint("left", "192.0.2.1", "192.0.2.2", 65000, 65001),
        reason: "ambiguous-bgp-address-ownership",
      },
      bgpEndpoint("right", "192.0.2.2", "192.0.2.1", 65001, 65000),
    ),
    false,
  );
});

test("peer context projects only relevant applied groups and preserves explicit precedence", () => {
  const source = sourceTree(
    "apply-groups [ IRRELEVANT DEFAULTS ]; groups { IRRELEVANT { protocols { isis { overload; } } } DEFAULTS { protocols { bgp { hold-time 10; local-address 192.0.2.1; } } } } protocols { bgp { hold-time 30; } }",
  );
  const bgp = source.nodes.find((node) => node.words[0] === "protocols").children[0];
  const result = resolvePeerContext(source, bgp);
  assert.equal(result.reason, null);
  assert.deepEqual(
    result.node.children.map((node) => node.words),
    [
      ["hold-time", "30"],
      ["local-address", "192.0.2.1"],
    ],
  );
});

test("peer context supports simple Junos group wildcards but rejects overlapping projections", () => {
  const source = sourceTree(
    "groups { GR { routing-instances { <service_*> { vrf-target target:1:1; } } } } routing-instances { apply-groups GR; service_1 { instance-type evpn-vpws; } }",
  );
  const instance = source.nodes.find((node) => node.words[0] === "routing-instances").children[1];
  assert.equal(resolvePeerContext(source, instance).reason, null);
  source.nodes[0].children[0].children[0].children.push({ words: ["<*>"], children: [] });
  assert.equal(resolvePeerContext(source, instance).reason, "ambiguous-group-projection");
  const nested = sourceTree(
    "apply-groups GR; groups { GR { apply-groups OTHER; protocols { bgp { hold-time 10; } } } } protocols { bgp { } }",
  );
  assert.equal(
    resolvePeerContext(nested, nested.nodes[2].children[0]).reason,
    "nested-group-inheritance",
  );
});

test("FXC group interfaces do not require duplicate routing-instance attachments", () => {
  const source = sourceTree(
    "routing-instances { X { instance-type evpn-vpws; vrf-target target:1:1; protocols { evpn { flexible-cross-connect-vlan-unaware; group fxc { interface ae1.1; interface ae1.2; service-id { local 1; remote 2; } } } } } }",
  );
  const endpoint = vpwsEndpoints(source, "device")[0];
  assert.equal(endpoint.reason, null);
  assert.deepEqual(endpoint.interfaces, ["ae1.1", "ae1.2"]);
});

test("VPWS multiple candidates require the same nonzero configured Ethernet segment", () => {
  const left = endpoint("left", 1, 2);
  const right = { ...endpoint("right", 2, 1), segments: ["00:01:02:03:04:05:06:07:08:09"] };
  const other = { ...right, device: "other" };
  assert.equal(joinVpws([left, right, other])[0].status, "corroborated");
  assert.equal(joinVpws([left, right, { ...other, segments: [] }])[0].status, "unresolved");
});

test("VPN membership preserves directionality and does not join incompatible control planes", () => {
  const make = (device, rt) =>
    vpnEndpoints(
      sourceTree(`routing-instances { ${device} { instance-type vrf; vrf-target ${rt}; } }`),
      device,
    )[0];
  const left = make("left", "target:65000:1");
  const right = make("right", "target:65000:1");
  assert.equal(joinVpn([left, right])[0].status, "corroborated");
  assert.equal(
    joinVpn([left, { ...right, kind: "evpn-type5-membership" }])[0].status,
    "unresolved",
  );
  const asymmetric = { ...right, routing: { ...right.routing, exports: ["target:65000:2"] } };
  assert.equal(joinVpn([left, asymmetric])[0].reason, "directional-vpn-membership");
});

function cfmEndpoint(device, local, remote, domain = "LOCAL_NAME", rt = "target:1:1") {
  const text = `routing-instances { ${device} { instance-type evpn; interface ae1.1; vrf-target ${rt}; protocols { evpn { } } } } protocols { oam { ethernet { connectivity-fault-management { maintenance-domain ${domain} { level 5; name-format none; maintenance-association 100 { short-name-format 2octet; mep ${local} { interface ae1.1; direction up; remote-mep ${remote} { } } } } } } } }`;
  return cfmEndpoints(sourceTree(text), device)[0];
}

test("CFM uses wire identities and service context rather than local domain names", () => {
  const left = cfmEndpoint("left", 1, 2, "LEFT_NAME");
  const right = cfmEndpoint("right", 2, 1, "RIGHT_NAME");
  assert.equal(joinCfm([left, right])[0].status, "corroborated");
  assert.equal(
    joinCfm([left, cfmEndpoint("right", 2, 1, "LEFT_NAME", "target:1:2")])[0].reason,
    "counterpart-not-found",
  );
  assert.equal(
    joinCfm([left, { ...right, wire: "different-association" }])[0].reason,
    "counterpart-not-found",
  );
});

test("CFM one-way monitoring and duplicate MEP ownership never become symmetric claims", () => {
  const left = cfmEndpoint("left", 1, 2);
  const right = cfmEndpoint("right", 2, 3);
  assert.equal(joinCfm([left, right])[0].reason, "directional-cfm-monitoring");
  assert.equal(
    joinCfm([left, right, { ...right, device: "other" }])[0].reason,
    "ambiguous-cfm-counterpart",
  );
});

test("peer claims require exact selected source endpoints and all template instances examined", () => {
  const body =
    "protocols { bgp { group $GROUP { type external; local-address $LOCAL; peer-as $AS; family inet { unicast; } neighbor $REMOTE; } } }";
  const make = (device, local, remote, localAS, peerAS) => ({
    device,
    text: `interfaces { lo0 { unit 0 { family inet { address ${local}/32; } } } } routing-options { autonomous-system ${localAS}; } ${body.replace("$GROUP", device).replace("$LOCAL", local).replace("$AS", peerAS).replace("$REMOTE", remote)}`,
  });
  const sources = [
    make("left", "192.0.2.1", "192.0.2.2", "65000", "65001"),
    make("right", "192.0.2.2", "192.0.2.1", "65001", "65000"),
  ];
  const templates = [{ relative: "junos/protocols/bgp.conf", body, normalized: body }];
  const analysis = createPeerAnalysis({ sources, templates });
  assert.equal(analysis.summary()[templates[0].relative].status, "unresolved");
  for (const source of sources)
    analysis.observe({
      body,
      device: source.device,
      measured: occurrenceMap(body, sourceTree(source.text)),
    });
  assert.deepEqual(analysis.summary()[templates[0].relative], {
    status: "verified",
    peersWith: { state: "groups", groups: [{ left: ["left"], right: ["right"] }] },
  });
  const unrelated = createPeerAnalysis({ sources, templates });
  unrelated.observe({ body, device: "left", measured: { instances: [{ sourceIds: [0] }] } });
  assert.equal(unrelated.summary()[templates[0].relative].status, "unresolved");
});

test("Kompella requires complementary site IDs and keeps service type distinct", () => {
  const make = (device, local, remote) =>
    kompellaEndpoints(
      sourceTree(
        `routing-instances { ${device} { instance-type l2vpn; vrf-target target:1:1; protocols { l2vpn { encapsulation-type ethernet; site SITE { site-identifier ${local}; interface ae1.1 { remote-site-id ${remote}; } } } } } }`,
      ),
      device,
    )[0];
  const left = make("left", 1, 2);
  const right = make("right", 2, 1);
  assert.equal(joinKompella([left, right])[0].status, "corroborated");
  assert.equal(joinKompella([left, make("right", 3, 1)])[0].status, "unresolved");
  assert.equal(joinKompella([left, right])[0].peers[0].kind, "kompella-l2vpn");
});

test("LDP pseudowires require reciprocal transport and VC identity", () => {
  const make = (device, local, remote, vc) =>
    ldpEndpoints(
      sourceTree(
        `interfaces { lo0 { unit 0 { family inet { address ${local}/32; } } } } routing-options { router-id ${local}; } protocols { ldp { interface lo0.0; } l2circuit { neighbor ${remote} { interface ae1.1 { virtual-circuit-id ${vc}; } } } }`,
      ),
      device,
    )[0];
  const left = make("left", "192.0.2.1", "192.0.2.2", 100);
  const right = make("right", "192.0.2.2", "192.0.2.1", 100);
  assert.equal(joinLdp([left, right])[0].status, "corroborated");
  assert.equal(
    joinLdp([left, make("right", "192.0.2.2", "192.0.2.1", 200)])[0].status,
    "unresolved",
  );
  assert.equal(joinLdp([left, { ...right, kind: "ldp-vpls" }])[0].status, "unresolved");
});

test("Ethernet segments require nonzero identity, compatible mode and service context", () => {
  const make = (device, rt) =>
    ethernetSegmentEndpoints(
      sourceTree(
        `interfaces { ae1 { esi { 00:01:02:03:04:05:06:07:08:09; single-active; } unit 1 { family bridge; } } } routing-instances { V { instance-type evpn; interface ae1.1; vrf-target ${rt}; protocols { evpn { } } } }`,
      ),
      device,
    )[0];
  const left = make("left", "target:1:1");
  assert.equal(joinEthernetSegments([left, make("right", "target:1:1")])[0].status, "corroborated");
  assert.equal(joinEthernetSegments([left, make("right", "target:1:2")])[0].status, "unresolved");
  assert.equal(
    joinEthernetSegments([left, { ...make("right", "target:1:1"), mode: "all-active" }])[0].status,
    "unresolved",
  );
});

test("active link protocols require topology while passive interfaces and local defaults do not define peers", () => {
  const source = sourceTree(
    "protocols { isis { interface ae1.0 { point-to-point; } interface lo0.0 { passive; } } }",
  );
  assert.equal(topologyEndpoints(source, "device").length, 1);
  assert.equal(
    topologyEndpoints(source, "device")[0].reason,
    "physical-topology-not-in-configuration",
  );
  assert.deepEqual(peerFeatures("protocols { isis { interface lo0.0 { passive; } } }"), []);
  assert.deepEqual(peerFeatures("protocols { ldp { interface lo0.0; } }"), []);
  assert.deepEqual(
    peerFeatures(
      "protocols { oam { ethernet { connectivity-fault-management { maintenance-domain MD { maintenance-association MA { continuity-check { interval 1s; } } } } } } }",
    ),
    [],
  );
});

test("VRF BGP endpoints retain routing scope and do not grant global address ownership", () => {
  const body =
    "interfaces { ae1 { unit 1 { family inet { address 192.0.2.1/30; } } } } routing-options { autonomous-system 65000; } routing-instances { CUSTOMER { instance-type vrf; interface ae1.1; protocols { bgp { group CE { local-address 192.0.2.1; peer-as 65001; family inet { unicast; } neighbor 192.0.2.2; } } } } }";
  const result = bgpEndpoints(sourceTree(body), "pe");
  assert.equal(result.length, 1);
  assert.equal(result[0].routingScope, "CUSTOMER");
  assert.equal(result[0].reason, null);
  assert.equal(
    joinBgp([result[0], { ...result[0], routingScope: "OTHER" }])[0].reason,
    "ambiguous-bgp-address-scope",
  );
  assert.deepEqual(peerFeatures("routing-instances { apply-groups GR; }"), []);
});
