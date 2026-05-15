# AI/ML Multitenancy Backend — Configuration Snippets

Reusable, templated config fragments extracted from the sanitized JVD
configurations under [conf/](../conf/). Each snippet contains:

- A 5-section header (Topic, Variant, Seen on, Highlights, Pair with, Variables).
- `$VARIABLE` placeholders for tunable values; see [_variables.md](_variables.md)
  for the master glossary.

## Topology

![Tenant isolation with EVPN Type-5 IP-VRFs and per-tenant VNIs](../../images/multitenancy-vni-separation.png)

> Refer to the topology when reading any snippet — every device in this JVD is a
> **Juniper QFX5240-64OD** running **Junos OS Evolved**. Two device roles appear
> in the headers: leafs (`GPU-R{1,2}-L{1,2}`, AS 208–211) and spines
> (`spine{1,2,3,4}`, AS 108–111).

## Layout

```
snips/
├── _variables.md
└── evo/
    ├── bootstrap/      # System base, FPC buffer monitor, gRPC TLS cert
    ├── interfaces/     # Fabric P2P 400G breakout, AC sub-ports, IRB anycast, lo0
    ├── transport/      # eBGP underlay, eBGP EVPN overlay, ECMP DLB flowlet, IPv6 RA
    ├── policy/         # CLOS loop-prevention, redistribution, communities, PFE LB
    ├── cos/            # RoCEv2 lossless (DSCP, PFC priority 3, ECN, schedulers)
    ├── services/       # Per-tenant VRF with EVPN type-5 ip-prefix-routes
    └── oam/            # LLDP, L2-learning telemetry, RSTP-disable
```

There is no `junos/` sibling tree — all eight devices in this JVD run Junos OS
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

Six snips contain both leaf-role and spine-role syntactic variants in a single
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
- [evo/transport/bgp-ebgp-evpn-overlay.conf](evo/transport/bgp-ebgp-evpn-overlay.conf)
- [evo/transport/routing-options-ecmp-frr.conf](evo/transport/routing-options-ecmp-frr.conf)
- [evo/policy/clos-loop-prevention.conf](evo/policy/clos-loop-prevention.conf)
- [evo/policy/allpodnetworks-direct-redistribution.conf](evo/policy/allpodnetworks-direct-redistribution.conf)
- [evo/policy/community-definitions.conf](evo/policy/community-definitions.conf)

## Templated values — `$VAR` placeholders

Identifiers that vary per deployment (loopback addresses, BGP AS numbers,
tenant VNIs, attachment-circuit interfaces, anycast MAC, etc.) appear as
`$VAR` placeholders in the body of every snippet. JVD-wide constants
(forwarding-class names, scheduler-map names, DSCP code-points, the
`mgmt_junos` instance name) are left literal because they ARE the
abstraction the JVD documents.

Each snippet header includes a `Variables:` section listing the placeholders
it uses, with example values from the device the snippet was extracted from.
See [`_variables.md`](_variables.md) for the full glossary.

The leading `/* ... */` header block is treated as documentation —
placeholder text inside the header survives rendering verbatim, so the doc
remains readable in both source and rendered form.

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
| [evo/bootstrap/system-grpc-netconf.conf](evo/bootstrap/system-grpc-netconf.conf) | System base — netconf/SSH, gRPC extension-service over TLS, mgmt instance |
| [evo/bootstrap/chassis-buffer-monitor.conf](evo/bootstrap/chassis-buffer-monitor.conf) | Per-FPC traffic-manager buffer-monitor for AI/RoCE fabric visibility |
| [evo/bootstrap/security-grpc-cert.conf](evo/bootstrap/security-grpc-cert.conf) | Local TLS certificate for the gRPC extension-service listener |

### Interfaces

| Snip | Purpose |
|---|---|
| [evo/interfaces/fabric-p2p-400g-breakout.conf](evo/interfaces/fabric-p2p-400g-breakout.conf) | 400G breakout to 2x sub-ports for fabric P2P /31 links (MTU 9216/9170) |
| [evo/interfaces/tenant-gpu-server-link.conf](evo/interfaces/tenant-gpu-server-link.conf) | Per-tenant GPU-server-facing 400G sub-port with dual-stack /31 |
| [evo/interfaces/irb-tenant-gateway.conf](evo/interfaces/irb-tenant-gateway.conf) | IRB anycast gateway per tenant — MTU 9000, shared virtual MAC |
| [evo/interfaces/loopback-leaf.conf](evo/interfaces/loopback-leaf.conf) | Leaf loopback — primary unit (underlay/overlay) + per-VRF units |
| [evo/interfaces/loopback-spine.conf](evo/interfaces/loopback-spine.conf) | Spine loopback — single unit serving both underlay router-id and EVPN overlay |

### Transport

| Snip | Purpose |
|---|---|
| [evo/transport/bgp-ebgp-fabric-underlay.conf](evo/transport/bgp-ebgp-fabric-underlay.conf) | eBGP fabric underlay — leaf↔spine /31 sessions, multipath, BFD 1s *(LEAF + SPINE variants)* |
| [evo/transport/bgp-ebgp-evpn-overlay.conf](evo/transport/bgp-ebgp-evpn-overlay.conf) | eBGP EVPN overlay — loopback-to-loopback, multihop, signaling loops 2 *(LEAF + SPINE variants)* |
| [evo/transport/routing-options-ecmp-frr.conf](evo/transport/routing-options-ecmp-frr.conf) | Routing-options — router-id, AS, ECMP fast-reroute, chained-composite-NH *(LEAF + SPINE variants)* |
| [evo/transport/ecmp-dlb-flowlet.conf](evo/transport/ecmp-dlb-flowlet.conf) | ECMP DLB (Dynamic Load Balancing) flowlet — AI fabric load spreading |
| [evo/transport/router-advertisement.conf](evo/transport/router-advertisement.conf) | IPv6 Router Advertisement on tenant GPU-server-facing interfaces |

### Policy

| Snip | Purpose |
|---|---|
| [evo/policy/clos-loop-prevention.conf](evo/policy/clos-loop-prevention.conf) | eBGP CLOS loop-prevention — spine tags outbound, leaf rejects tagged inbound *(LEAF + SPINE variants)* |
| [evo/policy/allpodnetworks-direct-redistribution.conf](evo/policy/allpodnetworks-direct-redistribution.conf) | AllPodNetworks — direct-route redistribution into BGP with community tagging *(LEAF + SPINE variants)* |
| [evo/policy/community-definitions.conf](evo/policy/community-definitions.conf) | BGP community definitions — tier markers, default redistribution, per-tenant *(LEAF + SPINE variants)* |
| [evo/policy/tenant-community-export.conf](evo/policy/tenant-community-export.conf) | Per-tenant export policies — `AllPodNetworks-tenant-N` + `BGP-AOS-Policy-tenant-N` |
| [evo/policy/pfe-load-balance.conf](evo/policy/pfe-load-balance.conf) | PFE per-packet load-balance policy (referenced by forwarding-table export) |

### CoS

| Snip | Purpose |
|---|---|
| [evo/cos/rdma-rocev2-lossless.conf](evo/cos/rdma-rocev2-lossless.conf) | RoCEv2 lossless CoS — DSCP classifier, PFC priority 3, ECN, lossless buffers, schedulers |

### Services

| Snip | Purpose |
|---|---|
| [evo/services/evpn-vrf-ip-prefix-routes.conf](evo/services/evpn-vrf-ip-prefix-routes.conf) | Per-tenant VRF with EVPN type-5 ip-prefix-routes (VXLAN encap) |

### OAM

| Snip | Purpose |
|---|---|
| [evo/oam/lldp-interface-all.conf](evo/oam/lldp-interface-all.conf) | LLDP enabled on all interfaces with descriptive port-id reporting |
| [evo/oam/l2-learning-telemetry.conf](evo/oam/l2-learning-telemetry.conf) | L2-learning telemetry — stream remote MAC entries via gRPC |
| [evo/oam/rstp-disable.conf](evo/oam/rstp-disable.conf) | RSTP disabled on spine — pure L3 device, no L2 loop protection needed |

## Scope

Snippets are **excerpts**, not standalone configs. They:

- Preserve their original Junos hierarchy (e.g. an `evo/services/evpn-vrf-ip-prefix-routes.conf`
  snippet contains the `routing-instances { … }` wrapper so it's syntactically
  valid in context).
- Are extracted from real, validated config in [`../conf/`](../conf/).
- Are **not exhaustive** — only the most pedagogically valuable patterns are
  extracted. The full configurations remain in [`../conf/`](../conf/) for
  complete reference.

## Pairing with documentation

The patterns shown here are described and validated in the
[AI Data Center Multitenancy with EVPN/VXLAN JVD](https://www.juniper.net/documentation/us/en/software/jvd/jvd-ai-dc-evpn-multitenancy/index.html)
and specifically the
[GPU Backend Fabric design page](https://www.juniper.net/documentation/us/en/software/jvd/jvd-ai-dc-evpn-multitenancy/evpnvxlan_gpu_backend_fabric_gpu_multitenancy.html).
