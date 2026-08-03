# EWAN Core & Edge — Snip Library

Templated configuration snippets extracted from the **Enterprise WAN Core & Edge** Juniper Validated Design (JVD-EWAN-Edge-Core-01-01).

## Topology

![EWAN Core & Edge Topology](../../documentation/images/ewan-core-edge-topology.png)

## Layout

```
snips/
├── _variables.md
├── junos/
│   ├── bootstrap/
│   │   ├── chassis.conf
│   │   └── forwarding-options-hash.conf
│   ├── cos/
│   │   └── classifiers-forwarding-classes.conf
│   ├── interfaces/
│   │   ├── ae-lag-access.conf
│   │   └── ae-lag-core.conf
│   ├── policy/
│   │   ├── bgp-to-ospf.conf
│   │   ├── hub-spoke-community.conf
│   │   └── hub-spoke-import-export.conf
│   ├── services/
│   │   ├── l2ckt-pseudowire.conf
│   │   ├── l3vpn-vrf-spoke.conf
│   │   ├── l3vpn-vrf-vrrp.conf
│   │   ├── ngmvpn-vrf.conf
│   │   └── vpls-virtual-switch.conf
│   └── transport/
│       ├── bgp-ibgp-rr-client.conf
│       ├── ldp.conf
│       ├── mpls-lsp.conf
│       ├── ospf-lfa.conf
│       └── pim-sparse.conf
└── evo/
    ├── bootstrap/
    │   ├── chassis.conf
    │   └── forwarding-options-hash.conf
    ├── interfaces/
    │   ├── ae-lag-access.conf
    │   └── ae-lag-core.conf
    ├── policy/
    │   └── redistribute-vpn.conf
    ├── services/
    │   ├── l2ckt-pseudowire.conf
    │   ├── l3vpn-vrf-vrrp.conf
    │   ├── ngmvpn-hub-adv.conf
    │   ├── ngmvpn-spoke-adv.conf
    │   ├── ngmvpn-vrf.conf
    │   └── vpls-virtual-switch.conf
    └── transport/
        ├── bgp-ibgp-rr.conf
        ├── ldp.conf
        ├── mpls-transit.conf
        ├── ospf-lfa.conf
        └── pim-sparse-rp.conf
```

## Sub-folder table

| Category | Purpose | Snip count |
|----------|---------|-----------|
| **services** | L3VPN, VPLS, L2CKT, NGMVPN routing-instances and pseudowires | 11 |
| **transport** | BGP, OSPF, LDP, MPLS, PIM — underlay and control plane | 10 |
| **interfaces** | LAG definitions (core and access-facing) | 4 |
| **policy** | Routing policies, communities, import/export | 4 |
| **cos** | DSCP/802.1p classifiers, forwarding-classes | 1 |
| **bootstrap** | Chassis, forwarding-options hash-key | 4 |

## Snippet headers

Every snip uses the standard 5-section header:

- **Seen on** — which devices (and OS) deploy this pattern.
- **Pair with** — same-device dependencies (other snips that must co-exist).
- **Highlights** — non-obvious knobs, scale notes, interop details.
- **Variables** — `$VAR` placeholders with example values from the JVD.

## Templated values

Variables follow the `$UPPER_SNAKE_CASE` convention. See [`_variables.md`](_variables.md) for the full glossary.

To render a snip with example values:
```bash
python3 /Users/ksbrown/git-jvd-builder/engine/snips_render.py \
    enterprise_wan/ewan_core_edge/configuration/snips/junos/services/l3vpn-vrf-vrrp.conf
```

## Snip index

### Services

| Snip | Description | OS |
|------|-------------|-----|
| `l3vpn-vrf-vrrp` | L3VPN VRF with VRRP, eBGP CE, vrf-target | Junos + EVO |
| `l3vpn-vrf-spoke` | L3VPN Hub-and-Spoke spoke VRF (asymmetric import/export) | Junos |
| `vpls-virtual-switch` | VPLS with LDP signaling, FAT pseudowire | Junos + EVO |
| `l2ckt-pseudowire` | L2CKT with hot-standby backup PE | Junos + EVO |
| `ngmvpn-vrf` | Next-Gen Multicast VPN (MVPN + PIM + OSPF CE + ldp-p2mp) | Junos + EVO |
| `ngmvpn-hub-adv` | NGMVPN Hub→Spoke VRF (vrf-import spoke, export null) | EVO |
| `ngmvpn-spoke-adv` | NGMVPN Spoke→Hub VRF (vrf-import null, export hub) | EVO |

### Transport

| Snip | Description | OS |
|------|-------------|-----|
| `bgp-ibgp-rr-client` | iBGP to RR with inet-vpn/l2vpn/RT families + BFD | Junos |
| `bgp-ibgp-rr` | iBGP Route Reflector with cluster-id + multipath | EVO |
| `ospf-lfa` | OSPF with remote-backup LFA, per-prefix, node-link-protection | Junos + EVO |
| `ldp` | LDP with auto-targeted-session + P2MP for NGMVPN | Junos + EVO |
| `mpls-lsp` | RSVP-TE LSPs with entropy-label | Junos |
| `mpls-transit` | MPLS interface enablement (P-router transit) | EVO |
| `pim-sparse` | PIM sparse-mode with static RP (PE) | Junos |
| `pim-sparse-rp` | PIM local RP (P-router acts as RP) | EVO |

### Policy

| Snip | Description | OS |
|------|-------------|-----|
| `bgp-to-ospf` | BGP→OSPF redistribution for NGMVPN | Junos |
| `redistribute-vpn` | VPN→CE redistribution for hub-spoke | EVO |
| `hub-spoke-community` | Hub/Spoke RT community definitions | Junos |
| `hub-spoke-import-export` | Hub/Spoke vrf-import/export policies | Junos |

### CoS

| Snip | Description | OS |
|------|-------------|-----|
| `classifiers-forwarding-classes` | DSCP + 802.1p classifiers, 8 FCs | Junos |

### Interfaces

| Snip | Description | OS |
|------|-------------|-----|
| `ae-lag-core` | Core LAG (LACP, family inet + mpls) | Junos + EVO |
| `ae-lag-access` | Access LAG (flexible-vlan-tagging, LACP system-id) | Junos + EVO |

### Bootstrap

| Snip | Description | OS |
|------|-------------|-----|
| `chassis` | Aggregated-devices count (+ enhanced-ip on EVO) | Junos + EVO |
| `forwarding-options-hash` | MPLS/multiservice ECMP hash + entropy-label | Junos + EVO |

## Scope

These snippets are grounded excerpts from the validated JVD configuration files. They represent the **building blocks** deployed at scale (5,614 routing-instances, 4,094 bridge-domains, ~500 L2CKTs per PE). They are not exhaustive — per-device interface addressing and instance-specific values are parameterized. Use them as templates for generating new instances of the same service patterns.

## Pairing with documentation

- [Design Guide](../../documentation/design-guide.md)
- [Solution Overview](../../documentation/solution-overview.md)
- [Test Report Brief](../../documentation/test-report-brief.md)
- [Datasheet](../../documentation/datasheet.md)
- [Juniper JVD Landing Page](https://www.juniper.net/us/en/solutions/validation/enterprise-wan.html)
