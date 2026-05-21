# Snip Library — Enterprise WAN for Finance & Stock Exchange

Templated config-snippet library extracted from `ewan_finance/configuration/conf/`.

## JVD Summary

**Enterprise WAN for Finance and Stock Exchange** — ultra-low-latency multicast transport
using NG-MVPN SPT-only (BGP Type-5/7), RSVP-TE P2MP provider-tunnels,
EVPN Active/Standby with ESI multihoming, and TWAMP end-to-end monitoring.

## Platforms

| Device | Platform | OS | Role |
|--------|----------|------|------|
| wanedge1_mx304 | MX304 | Junos | WAN Edge (ESI LAG, EVPN, MVPN sender) |
| wanedge2_mx10004 | MX10004 | Junos | WAN Edge (ESI LAG, EVPN, MVPN sender) |
| ap1_mx304 | MX304 | Junos | Aggregation/PE (TWAMP server, MVPN) |
| ap2_mx10004 | MX10004 | Junos | Aggregation/PE (TWAMP server, MVPN) |
| cr1_acx7100-48l | ACX7100-48L | EVO | Core Router (TWAMP client, virtual-router) |
| cr2_mx480 | MX480 | Junos | Core Router (TWAMP client, virtual-router) |
| p1_ptx10003-80c | PTX10003-80C | EVO | P-router (MPLS/RSVP transit) |
| p2_ptx10001-36mr | PTX10001-36MR | EVO | P-router (MPLS/RSVP transit) |
| l2-l3_edge_acx7100 | ACX7100 | EVO | L2/L3 Edge (VLAN bridge, LAG) |

## Layout

```
snips/
├── _variables.md
├── README.md
├── junos/
│   ├── bootstrap/
│   │   └── chassis-config.conf
│   ├── cos/
│   │   └── exp-classifiers-schedulers.conf
│   ├── firewall/
│   │   └── multicast-fwd-cache-filter.conf
│   ├── interfaces/
│   │   ├── flexible-vlan-subinterface.conf
│   │   ├── irb-l3-gateway.conf
│   │   ├── lag-esi-lacp.conf
│   │   ├── loopback-multi-af.conf
│   │   └── physical-p2p-mpls.conf
│   ├── multicast/
│   │   └── forwarding-multicast-tuning.conf
│   ├── oam/
│   │   ├── lldp-discovery.conf
│   │   ├── twamp-client.conf
│   │   └── twamp-server.conf
│   ├── policy/
│   │   ├── protocol-redistribution.conf
│   │   └── route-filter-med.conf
│   ├── services/
│   │   ├── evpn-virtual-switch-esi.conf
│   │   ├── mvpn-instance.conf
│   │   ├── virtual-router-instance.conf
│   │   └── vrf-l3vpn.conf
│   └── transport/
│       ├── ibgp-core-mesh.conf
│       ├── mpls-lsp-p2mp.conf
│       ├── ospf-te-protection.conf
│       └── rsvp-signaling.conf
└── evo/
    ├── bootstrap/
    │   └── chassis-config.conf
    ├── cos/
    │   └── exp-classifiers-schedulers.conf
    ├── interfaces/
    │   ├── flexible-vlan-subinterface.conf
    │   ├── lag-lacp.conf
    │   ├── loopback-multi-af.conf
    │   ├── physical-p2p-mpls.conf
    │   └── vlan-bridge-domain.conf
    ├── oam/
    │   ├── lldp-discovery.conf
    │   └── twamp-client.conf
    ├── policy/
    │   ├── protocol-redistribution.conf
    │   └── route-filter-med.conf
    ├── services/
    │   └── virtual-router-instance.conf
    └── transport/
        ├── ibgp-core-mesh.conf
        ├── mpls-interfaces.conf
        ├── ospf-te-protection.conf
        └── rsvp-signaling.conf
```

## Categories

| Category | Junos | EVO | Description |
|----------|:-----:|:---:|-------------|
| bootstrap | 1 | 1 | Chassis hardware, aggregated-devices, FPC/PIC config |
| interfaces | 5 | 5 | Physical P2P, LAG (ESI/LACP), IRB, loopback, VLAN bridge |
| transport | 4 | 4 | iBGP, MPLS LSP/P2MP, OSPF-TE, RSVP signaling |
| policy | 2 | 2 | Protocol redistribution, route-filter MED |
| cos | 1 | 1 | EXP classifiers, forwarding classes, schedulers |
| firewall | 1 | — | Multicast forwarding-cache filter with CoS marking |
| oam | 3 | 2 | LLDP, TWAMP server, TWAMP client |
| services | 4 | 1 | MVPN, EVPN virtual-switch, VRF L3VPN, virtual-router |
| multicast | 1 | — | Forwarding-options resolve/mismatch rate tuning |
| **Total** | **22** | **16** | **38 files** |

## Junos ↔ EVO Sibling Pairs

Patterns that appear on both OS families have a full-body file under each tree.

| Snip | Junos | EVO |
|------|-------|-----|
| chassis-config | `junos/bootstrap/` | `evo/bootstrap/` |
| physical-p2p-mpls | `junos/interfaces/` | `evo/interfaces/` |
| loopback-multi-af | `junos/interfaces/` | `evo/interfaces/` |
| flexible-vlan-subinterface | `junos/interfaces/` | `evo/interfaces/` |
| ibgp-core-mesh | `junos/transport/` | `evo/transport/` |
| ospf-te-protection | `junos/transport/` | `evo/transport/` |
| rsvp-signaling | `junos/transport/` | `evo/transport/` |
| protocol-redistribution | `junos/policy/` | `evo/policy/` |
| route-filter-med | `junos/policy/` | `evo/policy/` |
| exp-classifiers-schedulers | `junos/cos/` | `evo/cos/` |
| lldp-discovery | `junos/oam/` | `evo/oam/` |
| twamp-client | `junos/oam/` | `evo/oam/` |
| virtual-router-instance | `junos/services/` | `evo/services/` |

## Junos-Only Patterns

| Snip | Why Junos-only |
|------|----------------|
| irb-l3-gateway | EVPN multihoming with IRB + static MAC (WAN edge role) |
| lag-esi-lacp | ESI single-active DF election (WAN edge role) |
| mpls-lsp-p2mp | P2MP LSP template + named LSPs (PE/sender role) |
| multicast-fwd-cache-filter | Multicast CoS marking at L3 ingress |
| forwarding-multicast-tuning | PFE resolve/mismatch rate (MX-specific knob) |
| twamp-server | Reflector on AP nodes |
| evpn-virtual-switch-esi | EVPN MPLS virtual-switch + bridge-domain |
| mvpn-instance | NG-MVPN VRF with hot-root-standby |
| vrf-l3vpn | L3VPN VRF with eBGP CE peering |

## EVO-Only Patterns

| Snip | Why EVO-only |
|------|--------------|
| lag-lacp | Simple LACP LAG without ESI (L2/L3 edge role) |
| vlan-bridge-domain | L2-only VLAN membership (L2/L3 edge role) |
| mpls-interfaces | MPLS interface enablement (P-router role) |

## Key Design Patterns

1. **NG-MVPN SPT-only with hot-root-standby** — Each WAN edge runs 10 MVPN instances
   with sender-based-rpf and source-tree standby for sub-second multicast failover.

2. **EVPN Active/Standby with ESI multihoming** — Per-VLAN ESI on ae0 units enables
   per-service designated-forwarder election between wanedge1 and wanedge2.

3. **TWAMP end-to-end monitoring** — AP nodes run TWAMP servers; CR nodes probe every
   VRF with 100 probes/second for continuous latency/jitter measurement.

4. **4-class EXP QoS with strict-high LLQ** — FC-LLQ (queue 2) carries stock-exchange
   multicast with strict-high priority for deterministic low-latency forwarding.

5. **RSVP-TE P2MP provider-tunnels** — Multicast transport uses pre-established P2MP
   LSPs with link-protection and aggressive reoptimization.

## Usage

Each `.conf` file is self-documenting — open any file and read the 5-section header
for context, highlights, related snips, and variable examples. Replace `$VARIABLES`
with your site-specific values (see `_variables.md` for the full glossary).
