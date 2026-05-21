# 3-Stage EVPN/VXLAN Data Center — Snip Library

Templated configuration snippets extracted from the `3stage_dc` Juniper Validated Design.

## Design Overview

- **Use case:** 3-Stage EVPN/VXLAN Data Center with Edge-Routed Bridging (ERB) overlay
- **Platforms:** QFX5120-48Y, QFX5120-32C (Junos) · QFX5220-32CD, QFX5130-32CD, ACX7100-48L, PTX10001-36MR, QFX5700 (EVO)
- **Software:** Junos OS / Junos OS Evolved
- **Orchestration:** Juniper Apstra (all configurations are Apstra-generated)
- **Topology:** Lean spine (2×) → leaf (2× ESI-leaf, 1× server-leaf) + border-leaf (2×)
- **Underlay:** eBGP with unique ASN per device, point-to-point /31 links
- **Overlay:** eBGP EVPN (multihop, no-nexthop-change) with VXLAN encapsulation
- **Multi-tenancy:** 3 VRFs (red, blue, green) with EVPN Type-5 ip-prefix-routes
- **Scale:** ~2200 VLANs across leaf devices, ESI all-active multi-homing

## Library Structure

```
snips/
├── junos/                  # Junos OS (QFX5120-48Y, QFX5120-32C)
│   ├── bootstrap/          # Chassis port-speed, gRPC certificate
│   ├── interfaces/         # Fabric uplinks, loopback, IRB, LAG-ESI, VXLAN domain
│   ├── transport/          # eBGP underlay, eBGP EVPN overlay, ECMP, shared-tunnels
│   ├── policy/             # AOS policies, loop-prevention, communities, route-filters
│   ├── services/           # VRF (ip-prefix-routes), MAC-VRF (vlan-aware)
│   └── oam/               # LLDP, sFlow, RSTP, L2-learning telemetry, RA
├── evo/                    # Junos OS Evolved (QFX5220, QFX5130, ACX7100, PTX10001)
│   ├── bootstrap/          # Chassis port-speed, gRPC certificate
│   ├── interfaces/         # Fabric uplinks, loopback, IRB, external-VLAN
│   ├── transport/          # eBGP underlay, eBGP EVPN overlay, ECMP
│   ├── policy/             # AOS policies, loop-prevention, communities, route-filters
│   ├── services/           # VRF (ip-prefix-routes)
│   └── oam/               # LLDP, sFlow, RSTP, L2-learning telemetry, RA
└── _variables.md           # Variable reference table
```

## Key OS Differences (Junos vs EVO)

| Feature | Junos (QFX5120) | EVO (QFX5220/5130) |
|---------|-----------------|---------------------|
| MAC-VRF instance | `instance-type mac-vrf` with vlans stanza | Not used (flat EVPN model) |
| Shared tunnels | `forwarding-options evpn-vxlan shared-tunnels` | Not present |
| VXLAN routing | `routing-options forwarding-table vxlan-routing` | Not present |
| IRB anycast MAC | `virtual-gateway-accept-data` + `mac 00:1c:73:00:00:01` | Native anycast (no explicit MAC) |
| ESI LAG | Full ae + lacp system-id + esi config | Border-leaf uses flexible-vlan instead |
| Chassis aggregated-devices | `chassis aggregated-devices ethernet device-count` | Not used |
| Fabric port speed | Set in `chassis fpc pic port speed` | Set per-interface `speed` knob |

## How to Use

1. Pick the snip matching your function and OS
2. Replace `$VARIABLE` placeholders with your site values (see `_variables.md`)
3. Each snip's header comment lists which other snips it pairs with
4. Deployment order: `bootstrap/` → `interfaces/` → `transport/` → `policy/` → `services/` → `oam/`
5. Apstra users: these snips document what Apstra generates — use as reference or for manual overrides

## Snip Count

| Category | Junos | EVO | Total |
|----------|-------|-----|-------|
| bootstrap | 2 | 2 | 4 |
| interfaces | 7 | 4 | 11 |
| transport | 4 | 3 | 7 |
| policy | 9 | 9 | 18 |
| services | 2 | 1 | 3 |
| oam | 5 | 5 | 10 |
| **Total** | **29** | **24** | **53** |
