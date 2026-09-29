import assert from "node:assert/strict";
import { isIP } from "node:net";
import { parseConfig } from "./config-objects.mjs";
import { sourceTree } from "./generate-bindings.mjs";

const children = (node, keyword) =>
  (node.children ?? []).filter((child) => !child.inactive && child.words[0] === keyword);
const single = (node, keyword) => {
  const found = children(node, keyword);
  return found.length === 1 ? found[0] : null;
};
const scalar = (node, keyword) => {
  const found = single(node, keyword);
  return found?.children === null && found.words.length === 2 ? found.words[1] : null;
};
const values = (words) => words.filter((word) => word !== "[" && word !== "]");
const target = (value) => /^target:[0-9.]+:[0-9]+$/.test(value);

export function matchPeerGlob(glob, value, budget = { remaining: 1000000 }) {
  const work = (glob.length + 1) * (value.length + 1);
  if (work > budget.remaining) return null;
  budget.remaining -= work;
  let previous = new Uint8Array(value.length + 1);
  previous[0] = 1;
  for (const token of glob) {
    const current = new Uint8Array(value.length + 1);
    if (token === "*") current[0] = previous[0];
    for (let column = 1; column <= value.length; column++) {
      current[column] =
        token === "*"
          ? current[column - 1] || previous[column]
          : Number(token === value[column - 1] && previous[column - 1] === 1);
    }
    previous = current;
  }
  return previous[value.length] === 1;
}

export function resolvePeerContext(source, node) {
  const root = { children: source.nodes };
  const ancestors = [];
  for (
    let current = node;
    current;
    current = current.parent === null ? null : source.index[current.parent]
  )
    ancestors.unshift(current);
  const definitions = single(root, "groups")?.children ?? [];
  const layers = [node];
  const references = new Set();
  const patternBudget = { remaining: 1000000 };
  let reason = null;
  const matches = (pattern, value) => {
    if (pattern === value) return true;
    if (!pattern.startsWith("<") || !pattern.endsWith(">")) return false;
    const glob = pattern.slice(1, -1);
    if (/[^A-Za-z0-9_.*:/-]/.test(glob)) {
      reason = "unsupported-group-pattern";
      return false;
    }
    const matched = matchPeerGlob(glob, value, patternBudget);
    if (matched === null) reason = "group-pattern-budget-exceeded";
    return matched === true;
  };
  for (const scope of [...ancestors].reverse().concat(root)) {
    if (children(scope, "apply-groups-except").length) reason = "group-exclusion-semantics";
    for (const reference of children(scope, "apply-groups")) {
      for (const name of values(reference.words.slice(1))) {
        if (references.has(name)) continue;
        references.add(name);
        const groups = definitions.filter((group) => !group.inactive && group.words[0] === name);
        if (groups.length !== 1) {
          reason = "unresolved-group-reference";
          continue;
        }
        if (
          children(groups[0], "apply-groups").length ||
          children(groups[0], "apply-groups-except").length
        )
          reason = "nested-group-inheritance";
        let candidates = [groups[0]];
        for (const ancestor of ancestors) {
          if (
            candidates.some(
              (candidate) =>
                children(candidate, "apply-groups").length ||
                children(candidate, "apply-groups-except").length,
            )
          )
            reason = "nested-group-inheritance";
          candidates = candidates.flatMap((candidate) =>
            (candidate.children ?? []).filter(
              (child) =>
                !child.inactive &&
                child.words.length === ancestor.words.length &&
                child.words.every((word, index) => matches(word, ancestor.words[index])),
            ),
          );
          if (candidates.length > 1) {
            reason = "ambiguous-group-projection";
            break;
          }
        }
        if (candidates.length === 1) {
          const inspect = (inherited) => {
            if (inherited.inactive) return;
            if (inherited.words.some((word) => word.startsWith("<")))
              reason = "unresolved-inherited-wildcard";
            if (["apply-groups", "apply-groups-except"].includes(inherited.words[0]))
              reason = "nested-group-inheritance";
            for (const child of inherited.children ?? []) inspect(child);
          };
          for (const child of candidates[0].children ?? []) inspect(child);
          layers.push(candidates[0]);
        }
      }
    }
  }
  const scalarKeywords = new Set([
    "local-address",
    "local-as",
    "peer-as",
    "type",
    "hold-time",
    "tcp-mss",
    "instance-type",
    "vrf-target",
    "vrf-import",
    "vrf-export",
    "local",
    "remote",
    "encapsulation-type",
    "site-identifier",
    "remote-site-id",
  ]);
  const merge = (primary, fallback) => {
    if (primary.children === null || fallback.children === null || primary.inactive) return primary;
    const merged = [...primary.children];
    for (const inherited of fallback.children) {
      if (inherited.inactive) continue;
      if (
        scalarKeywords.has(inherited.words[0]) &&
        merged.some(
          (local) =>
            local.words[0] === inherited.words[0] &&
            (local.children === null) !== (inherited.children === null),
        )
      ) {
        reason = "unsupported-inherited-scalar-form";
        continue;
      }
      if (["apply-groups", "apply-groups-except"].includes(inherited.words[0])) {
        reason = "nested-group-inheritance";
        continue;
      }
      const index = merged.findIndex(
        (local) =>
          local.words.join(" ") === inherited.words.join(" ") ||
          (local.children === null &&
            inherited.children === null &&
            scalarKeywords.has(local.words[0]) &&
            local.words[0] === inherited.words[0]),
      );
      if (index < 0) merged.push(inherited);
      else merged[index] = merge(merged[index], inherited);
    }
    return { ...primary, children: merged };
  };
  const resolved = layers.reduce(merge);
  return {
    node: {
      ...resolved,
      children:
        resolved.children?.filter(
          (child) => !["apply-groups", "apply-groups-except"].includes(child.words[0]),
        ) ?? null,
    },
    reason,
  };
}

const LOCAL_PROTOCOL_LEAVES = {
  bgp: [
    "bgp-error-tolerance",
    "hold-time",
    "multipath",
    "path-selection",
    "precision-timers",
    "tcp-mss",
  ],
  evpn: [
    "flow-label",
    "flow-label-receive-static",
    "flow-label-static",
    "flow-label-transmit-static",
  ],
  vpls: ["flow-label-receive", "flow-label-transmit"],
  l2vpn: ["flow-label-receive", "flow-label-transmit"],
  l2circuit: [
    "local-switching/interface/end-interface/interface",
    "local-switching/interface/ignore-mtu-mismatch",
    "neighbor/interface/flow-label-receive",
    "neighbor/interface/flow-label-transmit",
    "neighbor/interface/pseudowire-status-tlv/hot-standby-vc-on",
    "neighbor/interface/switchover-delay",
  ],
  isis: [
    "apply-groups",
    "export",
    "net",
    "level",
    "level/max-lsp-size",
    "level/purge-originator",
    "level/wide-metrics-only",
    "backup-spf-options/use-post-convergence-lfa",
    "backup-spf-options/use-source-packet-routing",
    "interface/family/bfd-liveness-detection/minimum-interval",
    "interface/family/bfd-liveness-detection/multiplier",
    "interface/family/bfd-liveness-detection/no-adaptation",
    "interface/lsp-interval",
    "interface/max-hello-size",
    "interface/passive",
    "overload/advertise-high-metrics",
    "overload/timeout",
    "source-packet-routing",
    "source-packet-routing/explicit-null",
    "source-packet-routing/flex-algorithm",
    "source-packet-routing/node-segment/ipv4-index",
    "source-packet-routing/node-segment/ipv6-index",
    "source-packet-routing/sensor-based-stats/per-sid",
    "source-packet-routing/strict-asla-based-flex-algorithm",
    "source-packet-routing/traffic-statistics/statistics-granularity",
    "spf-options/delay",
    "spf-options/holddown",
    "spf-options/rapid-runs",
    "spf-options/microloop-avoidance/post-convergence-path/delay",
    "traffic-engineering/advertisement/application-specific/all-applications",
  ],
  esis: ["disable"],
  ldp: ["interface"],
  mpls: [
    "admin-groups/*",
    "icmp-tunneling",
    "interface",
    "ipv6-tunneling",
    "label-range/srgb-label-range",
    "lsp-external-controller",
    "no-propagate-ttl",
  ],
  oam: [
    "ethernet/connectivity-fault-management/maintenance-domain/maintenance-association/continuity-check/interval",
  ],
  "source-packet-routing": ["lsp-external-controller"],
};

function supportedLocalProtocol(node) {
  const allowed = new Set(
    LOCAL_PROTOCOL_LEAVES[node.words[0] === "isis-instance" ? "isis" : node.words[0]] ?? [],
  );
  if (["isis", "isis-instance"].includes(node.words[0])) {
    for (const option of ["minimum-interval", "multiplier", "no-adaptation"])
      allowed.add(`interface/bfd-liveness-detection/${option}`);
  }
  const inspect = (children, trail = []) =>
    children
      .filter((child) => !child.inactive)
      .every((child) => {
        const keyword = trail.join("/") === "admin-groups" ? "*" : child.words[0];
        const next = [...trail, keyword];
        return child.children === null
          ? allowed.has(next.join("/"))
          : child.children.length > 0 && inspect(child.children, next);
      });
  return node.children?.length > 0 && inspect(node.children);
}

export function peerFeatures(body) {
  const parsed = parseConfig(body);
  assert.ok(parsed.ok, "Peer classification requires a valid template");
  const features = new Set();
  const groupBody = parsed.nodes.some((node) => node.words[0] === "groups");
  const contains = (node, predicate) =>
    !node.inactive &&
    (predicate(node) || (node.children ?? []).some((child) => contains(child, predicate)));
  const visit = (nodes, trail = []) => {
    for (const node of nodes) {
      if (node.inactive) continue;
      const keyword = node.words[0];
      if (keyword === "instance-type" && !groupBody) features.add(`vpn:${node.words[1]}`);
      if (trail.at(-1) === "protocols") {
        if (keyword === "bgp" && contains(node, (child) => child.words[0] === "allow"))
          features.add("dynamic-bgp");
        const active = (node.children ?? []).filter((child) => !child.inactive);
        const localSwitching =
          keyword === "l2circuit" &&
          active.length &&
          active.every((child) => child.words[0] === "local-switching");
        const disabled =
          keyword === "esis" && active.length === 1 && active[0].words.join(" ") === "disable";
        const neighbor = contains(
          node,
          (child) => child.words[0] === "neighbor" && !child.words[1]?.startsWith("<"),
        );
        const interfaceActivation = contains(
          node,
          (child) =>
            child.words[0] === "interface" &&
            !child.words[1]?.startsWith("<") &&
            !children(child, "passive").length,
        );
        const defaultOnly =
          (["bgp", "l2circuit"].includes(keyword) && !neighbor) ||
          (["isis", "isis-instance"].includes(keyword) && !interfaceActivation) ||
          (["evpn", "vpls", "l2vpn"].includes(keyword) && groupBody) ||
          (keyword === "oam" && !contains(node, (child) => child.words[0] === "mep")) ||
          (keyword === "ldp" &&
            active.every(
              (child) =>
                child.words[0] === "interface" && /^lo0\.[0-9]+$/.test(child.words[1] ?? ""),
            )) ||
          (["mpls", "source-packet-routing"].includes(keyword) &&
            !contains(node, (child) => ["label-switched-path", "path"].includes(child.words[0])));
        if (!(localSwitching || disabled || defaultOnly) || !supportedLocalProtocol(node))
          features.add(`protocol:${keyword}`);
      }
      if (["esi", "lacp"].includes(keyword) && !groupBody) features.add(keyword);
      if (node.children) visit(node.children, [...trail, keyword]);
    }
  };
  visit(parsed.nodes);
  if (groupBody && features.size) features.add("group-definition");
  const localRoots = new Set([
    "chassis",
    "class-of-service",
    "firewall",
    "forwarding-options",
    "policy-options",
    "routing-options",
    "interfaces",
    "bridge-domains",
    "routing-instances",
    "protocols",
    "groups",
    "apply-groups",
  ]);
  if (parsed.nodes.some((node) => !localRoots.has(node.words[0])))
    features.add("unclassified-construct");
  return [...features].sort();
}

function communityTargets(root, name) {
  const policyOptions = single(root, "policy-options");
  const definitions = children(policyOptions ?? {}, "community").filter(
    (node) => node.words[1] === name,
  );
  if (definitions.length !== 1) return null;
  const context = root.source
    ? resolvePeerContext(root.source, definitions[0])
    : { node: definitions[0] };
  if (context.reason) return null;
  const definition = context.node;
  let members;
  if (definition.children === null && definition.words[2] === "members")
    members = values(definition.words.slice(3));
  else {
    const rows = children(definition, "members");
    if (
      rows.length !== 1 ||
      definition.children.some((node) => !node.inactive && node.words[0] !== "members")
    )
      return null;
    members = values(rows[0].words.slice(1));
  }
  if (
    !members.length ||
    members.some((member) => !target(member) && !/^color:[0-9]+:[0-9]+$/.test(member))
  )
    return null;
  return members.filter(target);
}

function exportTargets(root, policyName) {
  const definitions = children(single(root, "policy-options") ?? {}, "policy-statement").filter(
    (node) => node.words[1] === policyName,
  );
  if (definitions.length !== 1) return null;
  const context = root.source
    ? resolvePeerContext(root.source, definitions[0])
    : { node: definitions[0] };
  if (context.reason) return null;
  const terms = context.node.children.filter((node) => !node.inactive);
  const targets = new Set();
  for (const term of terms) {
    if (
      term.words[0] !== "term" ||
      term.children === null ||
      term.children.some((node) => !node.inactive && node.words[0] !== "then")
    )
      return null;
    const then = single(term, "then");
    if (!then) return null;
    const actions = then.children ?? [{ words: then.words.slice(1), children: null }];
    let accepted = false;
    for (const action of actions.filter((node) => !node.inactive)) {
      if (action.children !== null) return null;
      if (action.words.join(" ") === "accept") accepted = true;
      else if (action.words[0] === "community" && action.words[1] === "add") {
        for (const name of values(action.words.slice(2))) {
          const resolved = communityTargets(root, name);
          if (resolved === null) return null;
          for (const value of resolved) targets.add(value);
        }
      } else return null;
    }
    if (accepted) return targets.size ? [...targets].sort() : null;
    return null;
  }
  return null;
}

function importTargets(root, policyName) {
  const definitions = children(single(root, "policy-options") ?? {}, "policy-statement").filter(
    (node) => node.words[1] === policyName,
  );
  if (definitions.length !== 1) return null;
  const context = root.source
    ? resolvePeerContext(root.source, definitions[0])
    : { node: definitions[0] };
  if (context.reason) return null;
  const targets = new Set();
  for (const term of context.node.children.filter((node) => !node.inactive)) {
    if (
      term.words[0] !== "term" ||
      term.children === null ||
      term.children.some((node) => !node.inactive && !["from", "then"].includes(node.words[0]))
    )
      return null;
    const then = single(term, "then");
    const actions =
      then?.children ?? (then ? [{ words: then.words.slice(1), children: null }] : []);
    const action = actions.filter((node) => !node.inactive);
    if (action.length !== 1 || action[0].children !== null) return null;
    const from = single(term, "from");
    if (!from && action[0].words.join(" ") === "reject")
      return targets.size ? [...targets].sort() : null;
    if (!from || action[0].words.join(" ") !== "accept") return null;
    const conditions = from.children ?? [{ words: from.words.slice(1), children: null }];
    if (conditions.length !== 1 || conditions[0].words[0] !== "community") return null;
    for (const name of values(conditions[0].words.slice(1))) {
      const resolved = communityTargets(root, name);
      if (!resolved || resolved.length !== 1) return null;
      targets.add(resolved[0]);
    }
  }
  return targets.size ? [...targets].sort() : null;
}

export function effectiveTargets(root, instance) {
  const rows = children(instance, "vrf-target");
  if (
    rows.length > 1 ||
    (rows.length &&
      (rows[0].children !== null || rows[0].words.length !== 2 || !target(rows[0].words[1])))
  )
    return { status: "unresolved", reason: "target-semantics" };
  let imports = rows.length ? [rows[0].words[1]] : null;
  let exports = imports;
  let reason = null;
  if (children(instance, "vrf-import").length) {
    const name = scalar(instance, "vrf-import");
    imports = name && importTargets(root, name);
    if (!imports) reason = "import-policy-semantics";
  }
  if (children(instance, "vrf-export").length) {
    const name = scalar(instance, "vrf-export");
    exports = name && exportTargets(root, name);
    if (!exports) reason ??= "export-policy-semantics";
  }
  if (!imports || !exports) reason ??= "missing-effective-targets";
  if (reason) return { status: "unresolved", reason, imports, exports };
  return { status: "resolved", imports, exports };
}

function possibleRouteFlow(from, to) {
  const trusted = (endpoint) => !endpoint.reason || endpoint.reason === endpoint.routing?.reason;
  const exports = trusted(from) ? from.routing?.exports : null;
  const imports = trusted(to) ? to.routing?.imports : null;
  return exports == null || imports == null || exports.some((target) => imports.includes(target));
}

function esiIdentifier(esi) {
  const identifiers = (esi?.children ?? []).filter(
    (node) =>
      !node.inactive &&
      node.children === null &&
      node.words.length === 1 &&
      /^(?:[0-9a-f]{2}:){9}[0-9a-f]{2}$/i.test(node.words[0]),
  );
  return identifiers.length === 1 ? identifiers[0].words[0] : null;
}

function attachmentSegments(source, interfaces) {
  const root = { children: source.nodes };
  const segments = [];
  for (const name of interfaces) {
    const position = name.lastIndexOf(".");
    const ifdName = position < 0 ? name : name.slice(0, position);
    const unitName = position < 0 ? null : name.slice(position + 1);
    const rawIfd = single(root, "interfaces")?.children?.filter(
      (node) => !node.inactive && node.words[0] === ifdName,
    );
    if (rawIfd?.length !== 1) return [];
    const effective = resolvePeerContext(source, rawIfd[0]);
    if (effective.reason) return [];
    const unit = children(effective.node, "unit").find((node) => node.words[1] === unitName);
    const esi = (unit && single(unit, "esi")) || single(effective.node, "esi");
    const identifier = esiIdentifier(esi);
    if (
      !/^(?:[0-9a-f]{2}:){9}[0-9a-f]{2}$/i.test(identifier ?? "") ||
      /^00(?::00){9}$/.test(identifier)
    )
      return [];
    segments.push(identifier.toLowerCase());
  }
  return [...new Set(segments)].sort();
}

export function vpwsEndpoints(source, device) {
  const root = { children: source.nodes, source };
  const endpoints = [];
  const instances = single(root, "routing-instances");
  for (const rawInstance of instances?.children ?? []) {
    if (rawInstance.inactive || scalar(rawInstance, "instance-type") !== "evpn-vpws") continue;
    const effective = resolvePeerContext(source, rawInstance);
    const instance = effective.node;
    const protocols = single(instance, "protocols");
    const evpn = protocols && single(protocols, "evpn");
    if (!evpn) continue;
    const inheritance =
      effective.reason ||
      [instance, protocols, evpn].some(
        (node) =>
          children(node, "apply-groups").length || children(node, "apply-groups-except").length,
      );
    const routing = effectiveTargets(root, instance);
    const definitions = [...children(evpn, "interface"), ...children(evpn, "group")];
    for (const attachment of definitions) {
      const service = single(
        attachment,
        attachment.words[0] === "group" ? "service-id" : "vpws-service-id",
      );
      const local = service && scalar(service, "local");
      const remote = service && scalar(service, "remote");
      const interfaces =
        attachment.words[0] === "group"
          ? children(attachment, "interface").map((node) => node.words[1])
          : [attachment.words[1]];
      const interfaceOwners = children(instance, "interface").map((node) => node.words[1]);
      let reason = inheritance
        ? "inherited-peer-context"
        : routing.status !== "resolved"
          ? routing.reason
          : null;
      if (
        !service ||
        !/^[0-9]+$/.test(local ?? "") ||
        !/^[0-9]+$/.test(remote ?? "") ||
        !interfaces.length ||
        (attachment.words[0] !== "group" &&
          interfaces.some((name) => !interfaceOwners.includes(name)))
      )
        reason = "incomplete-service-endpoint";
      if (
        [attachment, service ?? {}].some(
          (node) =>
            children(node, "apply-groups").length || children(node, "apply-groups-except").length,
        )
      )
        reason = "inherited-peer-context";
      if (source.excludedIds?.has(instance.id) || source.excludedIds?.has(service?.id)) continue;
      endpoints.push({
        kind: "evpn-vpws",
        device,
        instance: instance.words[0],
        sourceId: service?.id ?? attachment.id,
        local,
        remote,
        interfaces,
        segments: attachmentSegments(source, interfaces),
        mode: children(evpn, "flexible-cross-connect-vlan-unaware").length
          ? "vlan-unaware"
          : "vlan-aware",
        routing,
        reason,
      });
    }
  }
  return endpoints;
}

export function corroborateVpws(left, right) {
  if (
    left.reason ||
    right.reason ||
    left.device === right.device ||
    left.kind !== "evpn-vpws" ||
    right.kind !== "evpn-vpws" ||
    left.mode !== right.mode
  )
    return false;
  if (left.local !== right.remote || left.remote !== right.local) return false;
  return (
    left.routing.exports.some((value) => right.routing.imports.includes(value)) &&
    right.routing.exports.some((value) => left.routing.imports.includes(value))
  );
}

function requireQualifiedPeers(outcomes) {
  const qualified = new Set(
    outcomes
      .filter((outcome) => outcome.status === "corroborated")
      .map((outcome) => outcome.endpoint),
  );
  const byEndpoint = new Map(outcomes.map((outcome) => [outcome.endpoint, outcome]));
  let rejected;
  do {
    rejected = outcomes.filter(
      (outcome) =>
        qualified.has(outcome.endpoint) &&
        outcome.peers.some(
          (peer) => !qualified.has(peer) || !byEndpoint.get(peer)?.peers.includes(outcome.endpoint),
        ),
    );
    for (const outcome of rejected) qualified.delete(outcome.endpoint);
  } while (rejected.length);
  return outcomes.map((outcome) =>
    outcome.status === "corroborated" && !qualified.has(outcome.endpoint)
      ? { ...outcome, status: "unresolved", reason: "unresolved-peer-counterpart" }
      : outcome,
  );
}

export function joinVpws(endpoints) {
  const index = new Map();
  const uncertain = new Map();
  for (const endpoint of endpoints) {
    if (endpoint.reason) {
      const key = JSON.stringify([
        endpoint.kind,
        endpoint.mode,
        endpoint.local ?? null,
        endpoint.remote ?? null,
      ]);
      if (!uncertain.has(key)) uncertain.set(key, []);
      uncertain.get(key).push(endpoint);
      continue;
    }
    for (const rt of endpoint.routing.imports) {
      const key = JSON.stringify([endpoint.mode, endpoint.local, endpoint.remote, rt]);
      if (!index.has(key)) index.set(key, []);
      index.get(key).push(endpoint);
    }
  }
  return requireQualifiedPeers(
    endpoints.map((endpoint) => {
      if (endpoint.reason)
        return { endpoint, status: "unresolved", reason: endpoint.reason, peers: [] };
      const potential = [endpoint.remote, null].flatMap((local) =>
        [endpoint.local, null].flatMap(
          (remote) =>
            uncertain.get(JSON.stringify([endpoint.kind, endpoint.mode, local, remote])) ?? [],
        ),
      );
      if (
        potential.some(
          (candidate) =>
            candidate.device !== endpoint.device &&
            possibleRouteFlow(endpoint, candidate) &&
            possibleRouteFlow(candidate, endpoint),
        )
      ) {
        return { endpoint, status: "unresolved", reason: "unresolved-potential-peer", peers: [] };
      }
      const candidates = new Set(
        endpoint.routing.exports.flatMap(
          (rt) =>
            index.get(JSON.stringify([endpoint.mode, endpoint.remote, endpoint.local, rt])) ?? [],
        ),
      );
      const peers = [...candidates].filter((candidate) => corroborateVpws(endpoint, candidate));
      const multihomed =
        peers.length > 1 &&
        new Set(peers.map((peer) => peer.device)).size === peers.length &&
        peers[0].segments?.length &&
        peers.every((peer) => JSON.stringify(peer.segments) === JSON.stringify(peers[0].segments));
      return {
        endpoint,
        peers,
        status: peers.length === 1 || multihomed ? "corroborated" : "unresolved",
        reason:
          peers.length === 0
            ? "counterpart-not-found"
            : peers.length > 1 && !multihomed
              ? "multiple-endpoints-require-multihoming-proof"
              : null,
      };
    }),
  );
}

export function vpnEndpoints(source, device) {
  const root = { children: source.nodes, source };
  const endpoints = [];
  for (const raw of single(root, "routing-instances")?.children ?? []) {
    if (raw.inactive || raw.children === null) continue;
    const context = resolvePeerContext(source, raw);
    const instance = context.node;
    const type = scalar(instance, "instance-type");
    if (!["vrf", "evpn", "mac-vrf", "virtual-switch", "vpls"].includes(type)) continue;
    const protocols = single(instance, "protocols") ?? {};
    const evpn = single(protocols, "evpn");
    const vpls = single(protocols, "vpls");
    if (vpls && children(vpls, "neighbor").length) continue;
    const kind =
      type === "vrf"
        ? evpn
          ? "evpn-type5-membership"
          : "ip-vpn-membership"
        : evpn
          ? "evpn-l2-membership"
          : vpls
            ? "bgp-vpls-membership"
            : null;
    if (!kind) continue;
    const routing = effectiveTargets(root, instance);
    let reason = context.reason || (routing.status !== "resolved" ? routing.reason : null);
    if (source.excludedIds?.has(raw.id)) continue;
    endpoints.push({ kind, device, sourceId: raw.id, instance: raw.words[0], routing, reason });
  }
  return endpoints;
}

export function kompellaEndpoints(source, device) {
  const root = { children: source.nodes, source };
  const endpoints = [];
  for (const raw of single(root, "routing-instances")?.children ?? []) {
    if (raw.inactive || scalar(raw, "instance-type") !== "l2vpn") continue;
    const context = resolvePeerContext(source, raw);
    const instance = context.node;
    const protocol = single(single(instance, "protocols") ?? {}, "l2vpn");
    if (!protocol) continue;
    const routing = effectiveTargets(root, instance);
    for (const site of children(protocol, "site")) {
      for (const attachment of children(site, "interface")) {
        const local = scalar(site, "site-identifier");
        const remote = scalar(attachment, "remote-site-id");
        const mode = scalar(protocol, "encapsulation-type");
        let reason = context.reason || (routing.status !== "resolved" ? routing.reason : null);
        if (!local || !remote || !/^[0-9]+$/.test(local) || !/^[0-9]+$/.test(remote) || !mode)
          reason = "incomplete-kompella-site-identity";
        if (source.excludedIds?.has(attachment.id)) continue;
        endpoints.push({
          kind: "kompella-l2vpn",
          device,
          instance: raw.words[0],
          sourceId: attachment.id,
          local,
          remote,
          mode,
          routing,
          reason,
          interfaces: [attachment.words[1]],
        });
      }
    }
  }
  return endpoints;
}

export function joinKompella(endpoints) {
  const converted = endpoints.map((endpoint) => ({ ...endpoint, kind: "evpn-vpws" }));
  const originals = new Map(converted.map((endpoint, index) => [endpoint, endpoints[index]]));
  return joinVpws(converted).map((outcome) => ({
    ...outcome,
    endpoint: originals.get(outcome.endpoint),
    peers: outcome.peers.map((peer) => originals.get(peer)),
  }));
}

export function ldpEndpoints(source, device) {
  const root = { children: source.nodes };
  const rawRouting = single(root, "routing-options");
  const rawLdp = single(single(root, "protocols") ?? {}, "ldp");
  const routingContext = rawRouting
    ? resolvePeerContext(source, rawRouting)
    : { node: {}, reason: "missing-routing-options" };
  const ldpContext = rawLdp
    ? resolvePeerContext(source, rawLdp)
    : { node: {}, reason: "missing-ldp" };
  const routing = routingContext.node;
  const ldp = ldpContext.node;
  const localAddress = addressKey(scalar(routing, "router-id"));
  const configuredAddresses = source.index.filter(
    (node) =>
      !node.inactive &&
      node.words[0] === "address" &&
      addressKey(node.words[1]?.split("/")[0]) === localAddress,
  );
  const transport = ldp && scalar(ldp, "transport-address");
  const transportReason =
    routingContext.reason ||
    ldpContext.reason ||
    children(ldp, "disable").length ||
    (children(ldp, "transport-address").length > 0 && !transport) ||
    !localAddress ||
    configuredAddresses.length !== 1 ||
    (transport && transport !== "router-id")
      ? "unresolved-ldp-transport"
      : null;
  const endpoints = [];
  const append = (node, peer, vcId, kind, contextReason, instance) => {
    let reason = contextReason || transportReason;
    const peerAddress = addressKey(peer);
    if (!peerAddress || !/^[0-9]+$/.test(vcId ?? "")) reason = "incomplete-pseudowire-identity";
    if (source.excludedIds?.has(node.id)) return;
    endpoints.push({
      kind,
      device,
      sourceId: node.id,
      instance,
      localAddress,
      peerAddress,
      vcId,
      reason,
    });
  };
  const rawCircuit = single(single(root, "protocols") ?? {}, "l2circuit");
  if (rawCircuit) {
    const context = resolvePeerContext(source, rawCircuit);
    for (const neighbor of children(context.node, "neighbor")) {
      for (const attachment of children(neighbor, "interface")) {
        append(
          attachment,
          neighbor.words[1],
          scalar(attachment, "virtual-circuit-id"),
          "l2circuit",
          context.reason,
        );
        for (const backup of children(attachment, "backup-neighbor"))
          append(
            backup,
            backup.words[1],
            scalar(backup, "virtual-circuit-id") ?? scalar(attachment, "virtual-circuit-id"),
            "l2circuit",
            context.reason,
          );
      }
    }
  }
  for (const raw of single(root, "routing-instances")?.children ?? []) {
    if (raw.inactive || raw.children === null) continue;
    const context = resolvePeerContext(source, raw);
    const vpls = single(single(context.node, "protocols") ?? {}, "vpls");
    if (!vpls) continue;
    for (const neighbor of children(vpls, "neighbor"))
      append(
        neighbor,
        neighbor.words[1],
        scalar(vpls, "vpls-id"),
        "ldp-vpls",
        context.reason,
        raw.words[0],
      );
  }
  return endpoints;
}

export function joinLdp(endpoints) {
  const index = new Map();
  for (const endpoint of endpoints) {
    const key = JSON.stringify([
      endpoint.kind,
      endpoint.localAddress,
      endpoint.peerAddress,
      endpoint.vcId,
    ]);
    if (!index.has(key)) index.set(key, []);
    index.get(key).push(endpoint);
  }
  return endpoints.map((endpoint) => {
    if (endpoint.reason)
      return { endpoint, status: "unresolved", reason: endpoint.reason, peers: [] };
    const peers = (
      index.get(
        JSON.stringify([endpoint.kind, endpoint.peerAddress, endpoint.localAddress, endpoint.vcId]),
      ) ?? []
    ).filter((peer) => peer.device !== endpoint.device && !peer.reason);
    return {
      endpoint,
      peers,
      status: peers.length === 1 ? "corroborated" : "unresolved",
      reason:
        peers.length === 0
          ? "counterpart-not-found"
          : peers.length > 1
            ? "ambiguous-pseudowire-counterpart"
            : null,
    };
  });
}

export function joinVpn(endpoints) {
  const index = new Map();
  const exporters = new Map();
  const uncertain = new Map();
  for (const endpoint of endpoints) {
    if (endpoint.reason) {
      if (!uncertain.has(endpoint.kind)) uncertain.set(endpoint.kind, []);
      uncertain.get(endpoint.kind).push(endpoint);
      continue;
    }
    for (const rt of endpoint.routing.imports) {
      const key = JSON.stringify([endpoint.kind, rt]);
      if (!index.has(key)) index.set(key, new Set());
      index.get(key).add(endpoint);
    }
    for (const rt of endpoint.routing.exports) {
      const key = JSON.stringify([endpoint.kind, rt]);
      if (!exporters.has(key)) exporters.set(key, new Set());
      exporters.get(key).add(endpoint);
    }
  }
  return endpoints.map((endpoint) => {
    if (endpoint.reason)
      return { endpoint, status: "unresolved", reason: endpoint.reason, peers: [] };
    if (
      (uncertain.get(endpoint.kind) ?? []).some(
        (candidate) =>
          candidate.device !== endpoint.device &&
          (possibleRouteFlow(endpoint, candidate) || possibleRouteFlow(candidate, endpoint)),
      )
    ) {
      return { endpoint, status: "unresolved", reason: "unresolved-potential-peer", peers: [] };
    }
    const candidates = new Set(
      endpoint.routing.exports.flatMap((rt) => [
        ...(index.get(JSON.stringify([endpoint.kind, rt])) ?? []),
      ]),
    );
    const outgoing = [...candidates].filter((candidate) => candidate.device !== endpoint.device);
    const peers = outgoing.filter((candidate) =>
      candidate.routing.exports.some((rt) => endpoint.routing.imports.includes(rt)),
    );
    const incoming = new Set(
      endpoint.routing.imports
        .flatMap((rt) => [...(exporters.get(JSON.stringify([endpoint.kind, rt])) ?? [])])
        .filter((candidate) => candidate.device !== endpoint.device),
    );
    const directional =
      outgoing.length !== peers.length ||
      [...incoming].some((candidate) => !peers.includes(candidate));
    return {
      endpoint,
      peers,
      status: peers.length && !directional ? "corroborated" : "unresolved",
      reason: directional
        ? "directional-vpn-membership"
        : peers.length
          ? null
          : "counterpart-not-found",
    };
  });
}

const addressKey = (value) => {
  if (isIP(value ?? "") === 4) return value;
  if (isIP(value ?? "") === 6) return new URL(`http://[${value}]/`).hostname;
  return null;
};

function asNumber(value) {
  if (/^[0-9]+$/.test(value ?? "") && Number(value) <= 4294967295) return String(Number(value));
  const parts = value?.match(/^([0-9]+)\.([0-9]+)$/);
  if (parts && Number(parts[1]) <= 65535 && Number(parts[2]) <= 65535)
    return String(Number(parts[1]) * 65536 + Number(parts[2]));
  return null;
}

function bgpScopeEndpoints(source, device, root, routingScope, addressTable, globalAS) {
  const protocols = single(root, "protocols");
  const rawBgp = protocols && single(protocols, "bgp");
  if (!rawBgp) return [];
  const effective = resolvePeerContext(source, rawBgp);
  const bgp = effective.node;
  const routing = single(root, "routing-options") ?? {};
  const defaultAS = asNumber(scalar(routing, "autonomous-system")) ?? globalAS;
  const addresses = new Map();
  for (const values of addressTable.values())
    for (const key of values) addresses.set(key, (addresses.get(key) ?? 0) + 1);
  const endpoints = [];
  for (const group of children(bgp, "group")) {
    for (const neighbor of children(group, "neighbor")) {
      const scopes = [neighbor, group, bgp];
      const setting = (keyword) => {
        const owner = scopes.find((node) => children(node, keyword).length);
        return owner ? scalar(owner, keyword) : null;
      };
      const localAddress = addressKey(setting("local-address"));
      const peerAddress = addressKey(neighbor.words[1]);
      const localAS = asNumber(setting("local-as")) ?? defaultAS;
      const peerAS =
        asNumber(setting("peer-as")) ?? (setting("type") === "internal" ? defaultAS : null);
      const familyOwner = scopes.find((node) => children(node, "family").length);
      const families = children(familyOwner ?? {}, "family")
        .filter((node) => node.words[1] !== "route-target")
        .flatMap((node) =>
          (node.children ?? [])
            .filter((child) => !child.inactive)
            .map((child) => `${node.words[1]}/${child.words[0]}`),
        )
        .sort();
      let reason = null;
      if (!localAddress || !peerAddress || !localAS || !peerAS || !families.length)
        reason = "incomplete-bgp-identity";
      if (
        scopes.some((node) => children(node, "disable").length || children(node, "shutdown").length)
      )
        reason = "disabled-bgp-endpoint";
      if (children(group, "allow").length) reason = "dynamic-bgp-neighbors";
      if (localAddress && addresses.get(localAddress) !== 1)
        reason = "ambiguous-bgp-address-ownership";
      if (
        effective.reason ||
        [bgp, group, neighbor, routing].some(
          (node) =>
            children(node, "apply-groups").length || children(node, "apply-groups-except").length,
        )
      )
        reason = "inherited-peer-context";
      if (
        children(routing, "confederation").length ||
        scopes.some((node) => children(node, "local-as").some((child) => child.children !== null))
      )
        reason = "unsupported-as-semantics";
      if (source.excludedIds?.has(neighbor.id)) continue;
      endpoints.push({
        kind: "bgp",
        device,
        routingScope,
        sourceId: neighbor.id,
        group: group.words[1],
        localAddress,
        peerAddress,
        localAS,
        peerAS,
        families,
        reason,
      });
    }
  }
  return endpoints;
}

export function bgpEndpoints(source, device) {
  const root = { children: source.nodes };
  const addressTable = new Map();
  for (const ifd of single(root, "interfaces")?.children ?? []) {
    if (ifd.inactive) continue;
    for (const unit of children(ifd, "unit")) {
      const addresses = children(unit, "family")
        .filter((node) => ["inet", "inet6"].includes(node.words[1]))
        .flatMap((family) =>
          children(family, "address")
            .map((address) => addressKey(address.words[1]?.split("/")[0]))
            .filter(Boolean),
        );
      addressTable.set(`${ifd.words[0]}.${unit.words[1]}`, addresses);
    }
  }
  const instances = (single(root, "routing-instances")?.children ?? []).filter(
    (node) => !node.inactive && node.children !== null,
  );
  const assigned = new Set(
    instances.flatMap((instance) => children(instance, "interface").map((node) => node.words[1])),
  );
  const globalAS = asNumber(scalar(single(root, "routing-options") ?? {}, "autonomous-system"));
  const endpoints = bgpScopeEndpoints(
    source,
    device,
    root,
    null,
    new Map([...addressTable].filter(([name]) => !assigned.has(name))),
    globalAS,
  );
  for (const instance of instances) {
    if (!single(single(instance, "protocols") ?? {}, "bgp")) continue;
    const owned = new Map(
      children(instance, "interface").map((node) => [
        node.words[1],
        addressTable.get(node.words[1]) ?? [],
      ]),
    );
    endpoints.push(
      ...bgpScopeEndpoints(source, device, instance, instance.words[0], owned, globalAS),
    );
  }
  return endpoints;
}

export function corroborateBgp(left, right) {
  return (
    !left.reason &&
    !right.reason &&
    left.kind === "bgp" &&
    right.kind === "bgp" &&
    left.device !== right.device &&
    left.localAddress === right.peerAddress &&
    right.localAddress === left.peerAddress &&
    left.localAS === right.peerAS &&
    right.localAS === left.peerAS &&
    left.families.some((family) => right.families.includes(family))
  );
}

export function joinBgp(endpoints) {
  const index = new Map();
  for (const endpoint of endpoints) {
    const key = JSON.stringify([endpoint.localAddress, endpoint.peerAddress]);
    if (!index.has(key)) index.set(key, []);
    index.get(key).push(endpoint);
  }
  return endpoints.map((endpoint) => {
    if (endpoint.reason)
      return { endpoint, status: "unresolved", reason: endpoint.reason, peers: [] };
    if (
      (index.get(JSON.stringify([endpoint.localAddress, endpoint.peerAddress])) ?? []).length !== 1
    )
      return { endpoint, status: "unresolved", reason: "ambiguous-bgp-address-scope", peers: [] };
    const peers = (
      index.get(JSON.stringify([endpoint.peerAddress, endpoint.localAddress])) ?? []
    ).filter((candidate) => corroborateBgp(endpoint, candidate));
    return {
      endpoint,
      peers,
      status: peers.length === 1 ? "corroborated" : "unresolved",
      reason:
        peers.length === 0
          ? "counterpart-not-found"
          : peers.length > 1
            ? "ambiguous-bgp-counterpart"
            : null,
    };
  });
}

export function cfmEndpoints(source, device) {
  const root = { children: source.nodes };
  let cfm = root;
  for (const keyword of ["protocols", "oam", "ethernet", "connectivity-fault-management"])
    cfm = cfm && single(cfm, keyword);
  if (!cfm) return [];
  const attachments = serviceAttachments(source, device);
  const endpoints = [];
  for (const domain of children(cfm, "maintenance-domain")) {
    for (const association of children(domain, "maintenance-association")) {
      for (const mep of children(association, "mep")) {
        const level = scalar(domain, "level");
        const domainFormat = scalar(domain, "name-format");
        const associationFormat = scalar(association, "short-name-format");
        const associationId = association.words[1];
        const local = mep.words[1];
        const remote = children(mep, "remote-mep").map((node) => node.words[1]);
        const direction = scalar(mep, "direction");
        const attached = [...(attachments.get(scalar(mep, "interface")) ?? [])];
        const service = attached.length === 1 ? attached[0] : null;
        let reason = null;
        if (
          domainFormat !== "none" ||
          associationFormat !== "2octet" ||
          !/^[0-7]$/.test(level ?? "") ||
          !/^[0-9]+$/.test(associationId) ||
          Number(associationId) > 65535
        )
          reason = "unsupported-cfm-wire-identity";
        if (
          !/^[0-9]+$/.test(local) ||
          Number(local) < 1 ||
          Number(local) > 8191 ||
          remote.some(
            (value) => !/^[0-9]+$/.test(value) || Number(value) < 1 || Number(value) > 8191,
          )
        )
          reason = "invalid-cfm-mep-id";
        if (!["up", "down"].includes(direction)) reason = "unsupported-cfm-direction";
        if (!service || service.reason) reason = "unresolved-cfm-service-context";
        const context = resolvePeerContext(source, mep);
        if (context.reason || context.node.children.some((node) => !mep.children.includes(node)))
          reason = "inherited-cfm-context";
        if (source.excludedIds?.has(mep.id)) continue;
        endpoints.push({
          kind: "cfm",
          device,
          sourceId: mep.id,
          domain: domain.words[1],
          association: associationId,
          wire: JSON.stringify([level, domainFormat, Number(associationId)]),
          local: String(Number(local)),
          remote: remote.map((value) => String(Number(value))),
          direction,
          service,
          reason,
        });
      }
    }
  }
  return endpoints;
}

export function joinCfm(endpoints) {
  const index = new Map();
  for (const endpoint of endpoints) {
    const key = JSON.stringify([endpoint.wire, endpoint.local]);
    if (!index.has(key)) index.set(key, []);
    index.get(key).push(endpoint);
  }
  return endpoints.map((endpoint) => {
    if (endpoint.reason)
      return { endpoint, status: "unresolved", reason: endpoint.reason, peers: [] };
    const peers = [];
    let reason = endpoint.remote.length ? null : "cfm-no-explicit-remote-mep";
    for (const remote of endpoint.remote) {
      const candidates = (index.get(JSON.stringify([endpoint.wire, remote])) ?? []).filter(
        (candidate) =>
          candidate.device !== endpoint.device &&
          !candidate.reason &&
          candidate.service.kind === endpoint.service.kind &&
          candidate.service.routing.exports.some((rt) =>
            endpoint.service.routing.imports.includes(rt),
          ) &&
          endpoint.service.routing.exports.some((rt) =>
            candidate.service.routing.imports.includes(rt),
          ) &&
          (endpoint.service.kind !== "evpn-vpws" ||
            corroborateVpws(endpoint.service, candidate.service)),
      );
      if (candidates.length !== 1)
        reason = candidates.length ? "ambiguous-cfm-counterpart" : "counterpart-not-found";
      else if (!candidates[0].remote.includes(endpoint.local))
        reason = "directional-cfm-monitoring";
      else peers.push(candidates[0]);
    }
    return { endpoint, peers, status: reason ? "unresolved" : "corroborated", reason };
  });
}

function serviceAttachments(source, device) {
  const attachments = new Map();
  const add = (name, service) => {
    if (!attachments.has(name)) attachments.set(name, new Set());
    attachments.get(name).add(service);
  };
  for (const service of vpnEndpoints(source, device)) {
    const collect = (node) => {
      if (node.inactive) return;
      if (node.words[0] === "interface" && node.words[1]) add(node.words[1], service);
      for (const child of node.children ?? []) collect(child);
    };
    collect(source.index[service.sourceId]);
  }
  for (const service of vpwsEndpoints(source, device))
    for (const name of service.interfaces) add(name, service);
  return attachments;
}

export function ethernetSegmentEndpoints(source, device) {
  const attachments = serviceAttachments(source, device);
  const root = { children: source.nodes };
  const endpoints = [];
  for (const ifd of single(root, "interfaces")?.children ?? []) {
    if (ifd.inactive || ifd.children === null) continue;
    for (const owner of [ifd, ...children(ifd, "unit")]) {
      const esi = single(owner, "esi");
      if (!esi) continue;
      const identifier = esiIdentifier(esi);
      const mode = children(esi, "single-active").length ? "single-active" : "all-active";
      const name = owner === ifd ? ifd.words[0] : `${ifd.words[0]}.${owner.words[1]}`;
      const services = [
        ...new Set(
          [...attachments]
            .filter(([attachment]) =>
              owner === ifd ? attachment.startsWith(`${name}.`) : attachment === name,
            )
            .flatMap(([, values]) => [...values]),
        ),
      ];
      let reason = null;
      if (
        !/^(?:[0-9a-f]{2}:){9}[0-9a-f]{2}$/i.test(identifier ?? "") ||
        /^00(?::00){9}$/i.test(identifier ?? "")
      )
        reason = "invalid-ethernet-segment-identity";
      if (!services.length || services.some((service) => service.reason))
        reason = "unresolved-ethernet-segment-service";
      if (source.excludedIds?.has(esi.id)) continue;
      endpoints.push({
        kind: "ethernet-segment",
        device,
        sourceId: esi.id,
        identifier: identifier?.toLowerCase(),
        mode,
        services,
        reason,
      });
    }
  }
  return endpoints;
}

export function joinEthernetSegments(endpoints) {
  const index = new Map();
  for (const endpoint of endpoints) {
    if (!index.has(endpoint.identifier)) index.set(endpoint.identifier, []);
    index.get(endpoint.identifier).push(endpoint);
  }
  return endpoints.map((endpoint) => {
    if (endpoint.reason)
      return { endpoint, status: "unresolved", reason: endpoint.reason, peers: [] };
    const peers = (index.get(endpoint.identifier) ?? []).filter(
      (peer) =>
        peer.device !== endpoint.device &&
        !peer.reason &&
        peer.mode === endpoint.mode &&
        endpoint.services.some((local) =>
          peer.services.some(
            (remote) =>
              local.kind === remote.kind &&
              local.routing.exports.some((rt) => remote.routing.imports.includes(rt)) &&
              remote.routing.exports.some((rt) => local.routing.imports.includes(rt)),
          ),
        ),
    );
    return {
      endpoint,
      peers,
      status: peers.length ? "corroborated" : "unresolved",
      reason: peers.length ? null : "ethernet-segment-counterpart-not-found",
    };
  });
}

export function topologyEndpoints(source, device) {
  const endpoints = [];
  const visit = (nodes, trail = []) => {
    for (const node of nodes) {
      if (
        node.inactive ||
        source.excludedIds?.has(node.id) ||
        trail[0] === "groups" ||
        node.words[0] === "groups"
      )
        continue;
      const kind = node.words[0];
      const protocol = trail.find((value) => ["isis", "isis-instance", "ospf"].includes(value));
      if (protocol && kind === "interface" && !children(node, "passive").length)
        endpoints.push({
          kind: protocol,
          device,
          sourceId: node.id,
          reason: "physical-topology-not-in-configuration",
        });
      if (kind === "lacp")
        endpoints.push({
          kind: "lacp",
          device,
          sourceId: node.id,
          reason: "lacp-remote-actor-not-configured",
        });
      if (kind === "pce" && trail.at(-1) === "pcep")
        endpoints.push({
          kind: "pcep",
          device,
          sourceId: node.id,
          destination: scalar(node, "destination-ipv4-address"),
          reason: "pcep-server-role-not-resolved",
        });
      if (node.children) visit(node.children, [...trail, kind]);
    }
  };
  visit(source.nodes);
  return endpoints;
}

export function createPeerAnalysis(inputs) {
  const byDevice = new Map();
  const endpoints = {
    vpws: [],
    bgp: [],
    vpn: [],
    cfm: [],
    kompella: [],
    ldp: [],
    segments: [],
    topology: [],
  };
  for (const source of inputs.sources) {
    const tree = sourceTree(source.text, { device: source.device, exclusions: inputs.exclusions });
    endpoints.vpws.push(...vpwsEndpoints(tree, source.device));
    endpoints.bgp.push(...bgpEndpoints(tree, source.device));
    endpoints.vpn.push(...vpnEndpoints(tree, source.device));
    endpoints.cfm.push(...cfmEndpoints(tree, source.device));
    endpoints.kompella.push(...kompellaEndpoints(tree, source.device));
    endpoints.ldp.push(...ldpEndpoints(tree, source.device));
    endpoints.segments.push(...ethernetSegmentEndpoints(tree, source.device));
    endpoints.topology.push(...topologyEndpoints(tree, source.device));
  }
  const outcomes = requireQualifiedPeers([
    ...joinVpws(endpoints.vpws),
    ...joinBgp(endpoints.bgp),
    ...joinVpn(endpoints.vpn),
    ...joinCfm(endpoints.cfm),
    ...joinKompella(endpoints.kompella),
    ...joinLdp(endpoints.ldp),
    ...joinEthernetSegments(endpoints.segments),
    ...endpoints.topology.map((endpoint) => ({
      endpoint,
      status: "unresolved",
      reason: endpoint.reason,
      peers: [],
    })),
  ]);
  for (const outcome of outcomes) {
    const device = outcome.endpoint.device;
    if (!byDevice.has(device)) byDevice.set(device, new Map());
    const index = byDevice.get(device);
    if (!index.has(outcome.endpoint.sourceId)) index.set(outcome.endpoint.sourceId, []);
    index.get(outcome.endpoint.sourceId).push(outcome);
  }
  const requiredKinds = (features) => {
    const required = [];
    const unresolved = [];
    const hasVpn = features.some((feature) => feature.startsWith("vpn:"));
    for (const feature of features) {
      if (feature === "vpn:evpn-vpws") required.push(["evpn-vpws"]);
      else if (feature === "vpn:l2vpn") required.push(["kompella-l2vpn"]);
      else if (feature === "vpn:vrf")
        required.push([
          features.includes("protocol:evpn") ? "evpn-type5-membership" : "ip-vpn-membership",
        ]);
      else if (feature.startsWith("vpn:"))
        required.push(["evpn-l2-membership", "bgp-vpls-membership", "ldp-vpls"]);
      else if (feature === "protocol:bgp") required.push(["bgp"]);
      else if (feature === "protocol:oam") required.push(["cfm"]);
      else if (feature === "protocol:l2circuit") required.push(["l2circuit"]);
      else if (feature === "esi") required.push(["ethernet-segment"]);
      else if (feature === "lacp") required.push(["lacp"]);
      else if (
        ["protocol:isis", "protocol:isis-instance", "protocol:ospf", "protocol:pcep"].includes(
          feature,
        )
      )
        required.push([feature.slice("protocol:".length)]);
      else if (
        hasVpn &&
        ["protocol:evpn", "protocol:l2vpn", "protocol:vpls", "apply-groups"].includes(feature)
      )
        continue;
      else if (feature === "apply-groups" && features.includes("protocol:bgp")) continue;
      else unresolved.push(feature);
    }
    return { required, unresolved };
  };
  const bodies = new Map();
  for (const template of inputs.templates) {
    if (bodies.has(template.normalized)) continue;
    const features = peerFeatures(template.body);
    const { required, unresolved } = requiredKinds(features);
    bodies.set(template.normalized, {
      features,
      required,
      unresolved,
      instances: 0,
      examined: new Set(),
      pairs: new Set(),
      reasons: new Map(),
    });
  }
  const observe = ({ body, device, measured }) => {
    const result = bodies.get(body);
    assert.ok(result, "Unknown peer template");
    assert.ok(
      inputs.sources.some((source) => source.device === device) && !result.examined.has(device),
      "Unknown or duplicate peer measurement device",
    );
    result.examined.add(device);
    result.instances += measured.instances.length;
    const index = byDevice.get(device) ?? new Map();
    for (const instance of measured.instances) {
      const reported = new Set();
      const record = (reason, sourceId) => {
        if (reported.has(reason)) return;
        reported.add(reason);
        if (!result.reasons.has(reason))
          result.reasons.set(reason, {
            reason,
            instances: 0,
            devices: new Set(),
            witness: { device, sourceId },
          });
        const finding = result.reasons.get(reason);
        finding.instances++;
        finding.devices.add(device);
      };
      const selected = instance.sourceIds.flatMap((sourceId) => index.get(sourceId) ?? []);
      for (const feature of result.unresolved)
        record(`rule-coverage:${feature}`, instance.sourceIds.at(-1));
      for (const kinds of result.required) {
        const candidates = selected.filter((outcome) => kinds.includes(outcome.endpoint.kind));
        if (!candidates.length)
          record(`endpoint-not-resolved:${kinds.join("|")}`, instance.sourceIds.at(-1));
        for (const outcome of candidates) {
          if (outcome.status !== "corroborated") record(outcome.reason, outcome.endpoint.sourceId);
          else {
            for (const peer of outcome.peers)
              result.pairs.add(JSON.stringify([device, peer.device].sort()));
          }
        }
      }
    }
  };
  const summary = () =>
    Object.fromEntries(
      inputs.templates.map((template) => {
        const result = bodies.get(template.normalized);
        const reasons = [...result.reasons.values()]
          .map((finding) => ({ ...finding, devices: [...finding.devices].sort() }))
          .sort((left, right) => left.reason.localeCompare(right.reason, "en"));
        if (result.examined.size !== inputs.sources.length)
          reasons.push({
            reason: "incomplete-source-population",
            instances: result.instances,
            devices: inputs.sources
              .map((source) => source.device)
              .filter((device) => !result.examined.has(device)),
          });
        if (!result.instances)
          reasons.push({ reason: "no-source-instances", instances: 0, devices: [] });
        const peersWith =
          result.features.length === 0
            ? { state: "not-applicable" }
            : {
                state: "groups",
                groups: [...result.pairs].sort().map((pair) => {
                  const [left, right] = JSON.parse(pair);
                  return { left: [left], right: [right] };
                }),
              };
        if (!reasons.length && peersWith.state === "groups" && !peersWith.groups.length)
          reasons.push({
            reason: "no-corroborated-relationship",
            instances: result.instances,
            devices: [],
          });
        return [
          template.relative,
          reasons.length
            ? { status: "unresolved", features: result.features, reasons }
            : { status: "verified", peersWith },
        ];
      }),
    );
  return { observe, summary };
}
