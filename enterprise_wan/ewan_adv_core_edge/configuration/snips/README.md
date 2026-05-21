# EWAN Advanced Core/Edge — Snip Library

Templated configuration snippets extracted from the `ewan_adv_core_edge` Juniper Validated Design.

## Design Overview

- **Use case:** MPLS/EVPN enterprise WAN with advanced services at scale
- **Platforms:** MX304, MX10004, MX480 (Junos) · ACX7509, ACX7100-48L, PTX10003, PTX10001-36MR (EVO)
- **Software:** Junos OS / Junos OS Evolved 23.4R2
- **Scale:** ~2000 EVPN service instances per PE, 8-class CoS, OAM on every service

## Library Structure

```
snips/
├── junos/                  # Junos OS (MX304, MX10004, MX480)
│   ├── bootstrap/          # Platform prerequisites
│   ├── cos/                # Class-of-service (classifiers, queues, rewrite)
│   ├── ddos-mitigation/    # FlowSpec and traffic steering
│   ├── firewall/           # Stateless PBR filters
│   ├── interfaces/         # Physical, LAG, IRB, loopback
│   ├── oam/                # 802.1ag CFM and SLA measurement
│   ├── policy/             # Load-balance and redistribution policies
│   ├── services/           # EVPN-VPWS, ELAN, VRF instances
│   └── transport/          # BGP, OSPF-SR, MPLS LSP, RSVP-TE, hash
├── evo/                    # Junos OS Evolved (ACX7509, ACX7100, PTX)
│   ├── bootstrap/          # Platform prerequisites (network-services enhanced-ip)
│   ├── cos/                # Class-of-service
│   ├── ddos-mitigation/    # FlowSpec
│   ├── firewall/           # Stateless PBR filters
│   ├── interfaces/         # Physical, LAG, IRB, loopback
│   ├── oam/                # 802.1ag CFM and SLA measurement
│   ├── policy/             # Load-balance and redistribution policies
│   ├── services/           # EVPN-VPWS, mac-vrf, VRF instances
│   └── transport/          # BGP, OSPF-SR, MPLS LSP, LDP-SR, mapping-server, hash
└── _variables.md           # Variable reference table
```

## Key OS Differences (Junos vs EVO)

| Feature | Junos | EVO |
|---------|-------|-----|
| ELAN instance type | `instance-type evpn` | `instance-type mac-vrf` |
| Network services mode | Implicit (MX) | `chassis { network-services enhanced-ip; }` required |
| SR mapping server | N/A (not configured) | `source-packet-routing { mapping-server ... }` |
| LDP-SR coexistence | N/A (RSVP-TE used) | `ldp { track-igp-metric; }` with SR preference |

## How to Use

1. Pick the snip matching your service type and OS
2. Replace `$VARIABLE` placeholders with your site values (see `_variables.md`)
3. Each snip's header comment lists which other snips it pairs with
4. Start with `bootstrap/` → `transport/` → `interfaces/` → `services/` → `cos/` → `oam/`

## Snip Count

| Category | Junos | EVO | Total |
|----------|-------|-----|-------|
| bootstrap | 1 | 1 | 2 |
| cos | 3 | 3 | 6 |
| ddos-mitigation | 1 | 1 | 2 |
| firewall | 1 | 1 | 2 |
| interfaces | 5 | 5 | 10 |
| oam | 2 | 2 | 4 |
| policy | 1 | 1 | 2 |
| services | 5 | 4 | 9 |
| transport | 5 | 6 | 11 |
| **Total** | **24** | **24** | **48** |
