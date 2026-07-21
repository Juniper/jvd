# AI Data Center Frontend Fabric for Inference — Configuration Snippets

Reusable, templated config fragments extracted from the sanitized JVD
configurations under [conf/](../conf/). Each snippet contains:

- A 5-section header (Topic, Variant, Seen on, Highlights, Pair with, Variables).
- `$VARIABLE` placeholders for tunable values; see [_variables.md](_variables.md)
  for the master glossary.

## Topology

![AI Inference Frontend Fabric topology](../../images/inference-frontend-topology.png)

> Refer to the topology when reading any snippet. Every device in this JVD runs
> **Junos OS Evolved**. Two device roles appear in the headers: leafs
> (`leaf1`–`leaf4`, QFX5130-32CD) and spines (`spine1`–`spine2`, QFX5220-32CD).
> The fabric is a 3-stage Clos with a pure IPv4 eBGP underlay — there is **no**
> EVPN/VXLAN overlay in this frontend design.

## Layout

```
snips/
├── _variables.md
└── evo/
    ├── bootstrap/      # System base + gRPC TLS cert (Apstra onboarding)
    ├── interfaces/     # Fabric P2P /31 (breakout + direct), access trunk, IRB, lo0
    ├── transport/      # eBGP fabric underlay, routing-options ECMP/FRR
    ├── policy/         # CLOS loop-prevention, direct redistribution, communities, PFE LB
    ├── services/       # Frontend cluster VLAN (L2 domain + L3 gateway)
    └── oam/            # LLDP, L2-learning telemetry, RSTP
```

There is no `junos/` sibling tree — all six devices in this JVD run Junos OS
Evolved, so every snip lives under `evo/` and carries a
`Variant: Evolved-OS (EVO)` header tag.

## Snippet headers — `Seen on:` and `Pair with:`

Every snippet starts with a C-style comment header containing two
cross-reference fields:

- **`Seen on:`** — every device in [`../conf/`](../conf/) that contains this
  exact pattern, split by OS family. Because all devices here are EVO, the
  `Junos:` line is always `(none)` and the `EVO:` line lists the specific
  leafs / spines / both that carry the pattern.
- **`Pair with:`** — other snippets in this library that work together to
  deliver the same end-to-end function. All `Pair with:` references are
  reciprocal.

## LEAF vs SPINE combined snips

Five snips contain both leaf-role and spine-role syntactic variants in a single
file, delimited by clearly-marked sections:

```
/* --- LEAF variant --- */
... leaf-side body ...

/* --- SPINE variant --- */
... spine-side body ...
```

Pick the section matching the role you're configuring at deploy time. This
keeps the dependency graph (`Pair with:` references) unified across roles
rather than fragmenting into two parallel snip trees.

The combined snips are:

- [evo/transport/bgp-ebgp-fabric-underlay.conf](evo/transport/bgp-ebgp-fabric-underlay.conf)
- [evo/policy/allpodnetworks-direct-redistribution.conf](evo/policy/allpodnetworks-direct-redistribution.conf)
- [evo/policy/clos-loop-prevention.conf](evo/policy/clos-loop-prevention.conf)
- [evo/interfaces/fabric-p2p-links.conf](evo/interfaces/fabric-p2p-links.conf)
- [evo/oam/rstp-fabric.conf](evo/oam/rstp-fabric.conf)

## Templated values — `$VAR` placeholders

Identifiers that vary per deployment (loopback addresses, BGP AS numbers, /31
link addresses, VLAN IDs, access-port interfaces, etc.) appear as `$VAR`
placeholders in the body of every snippet. JVD-wide constants (policy names such
as `PFE-LB` / `BGP-AOS-Policy`, community names, the `mgmt_junos` instance name,
the `aos_grpc` certificate name) are left literal because they ARE the
abstraction the JVD documents.

Each snippet header includes a `Variables:` section listing the placeholders it
uses, with example values from the device the snippet was extracted from. See
[`_variables.md`](_variables.md) for the full glossary.

To render a snippet with concrete values:

```bash
~/git-scripts/snips_render.py evo/transport/bgp-ebgp-fabric-underlay.conf vars.json > rendered.conf
```

To list every placeholder a snippet uses:

```bash
~/git-scripts/snips_render.py --extract evo/transport/bgp-ebgp-fabric-underlay.conf
```

## Snip index

### Bootstrap

| Snip | Purpose |
|---|---|
| [evo/bootstrap/system-grpc-apstra.conf](evo/bootstrap/system-grpc-apstra.conf) | System base — host-name, mgmt instance, gRPC extension-service over TLS |
| [evo/bootstrap/security-grpc-cert.conf](evo/bootstrap/security-grpc-cert.conf) | Local TLS certificate for the gRPC extension-service listener |

### Interfaces

| Snip | Purpose |
|---|---|
| [evo/interfaces/fabric-p2p-links.conf](evo/interfaces/fabric-p2p-links.conf) | Fabric P2P /31 links — leaf 400G breakout sub-ports + spine direct ports *(LEAF + SPINE variants)* |
| [evo/interfaces/server-access-trunk.conf](evo/interfaces/server-access-trunk.conf) | Server/client access port — jumbo trunk into the frontend cluster VLAN |
| [evo/interfaces/irb-cluster-gateway.conf](evo/interfaces/irb-cluster-gateway.conf) | IRB L3 gateway for the frontend cluster VLAN — MTU 9000 |
| [evo/interfaces/loopback.conf](evo/interfaces/loopback.conf) | Loopback lo0.0 — underlay router-id / eBGP anchor |

### Transport

| Snip | Purpose |
|---|---|
| [evo/transport/bgp-ebgp-fabric-underlay.conf](evo/transport/bgp-ebgp-fabric-underlay.conf) | eBGP fabric underlay — leaf↔spine /31 sessions, multipath, BFD 1s *(LEAF + SPINE variants)* |
| [evo/transport/routing-options-ecmp-frr.conf](evo/transport/routing-options-ecmp-frr.conf) | Routing-options — router-id, local AS, ECMP fast-reroute, PFE-LB export |

### Policy

| Snip | Purpose |
|---|---|
| [evo/policy/community-definitions.conf](evo/policy/community-definitions.conf) | BGP community definitions — tier marker + default direct redistribution |
| [evo/policy/allpodnetworks-direct-redistribution.conf](evo/policy/allpodnetworks-direct-redistribution.conf) | AllPodNetworks direct redistribution + BGP-AOS-Policy umbrella *(LEAF + SPINE variants)* |
| [evo/policy/clos-loop-prevention.conf](evo/policy/clos-loop-prevention.conf) | eBGP CLOS loop-prevention — spine tags outbound, leaf rejects tagged *(LEAF + SPINE variants)* |
| [evo/policy/pfe-load-balance.conf](evo/policy/pfe-load-balance.conf) | PFE per-packet load-balance policy (referenced by forwarding-table export) |

### Services

| Snip | Purpose |
|---|---|
| [evo/services/frontend-cluster-vlan.conf](evo/services/frontend-cluster-vlan.conf) | Frontend cluster VLAN — L2 broadcast domain + L3 gateway binding |

### OAM

| Snip | Purpose |
|---|---|
| [evo/oam/lldp-interface-all.conf](evo/oam/lldp-interface-all.conf) | LLDP on all interfaces — neighbor discovery for fabric validation |
| [evo/oam/l2-learning-telemetry.conf](evo/oam/l2-learning-telemetry.conf) | L2-learning telemetry — stream remote MAC entries via gRPC (leaf-only) |
| [evo/oam/rstp-fabric.conf](evo/oam/rstp-fabric.conf) | RSTP — leaf edge/BPDU-guard on access ports, disabled on spines *(LEAF + SPINE variants)* |

## Scope

These snippets are representative, grounded extractions from the six validated
device configs — not an exhaustive dump. They capture the recurring building
blocks of the frontend fabric (eBGP underlay, Apstra fabric policy, jumbo P2P
links, per-leaf cluster VLAN + IRB gateway, and telemetry). Full rendered
per-device configurations live in [`../conf/`](../conf/).

## Pairing with the documentation

Read these snippets alongside the [design guide](../../documentation/design-guide.md)
and the published JVD:
<https://www.juniper.net/documentation/us/en/software/jvd/jvd-ai-dc-inference-apstra-amd/index.html>.
