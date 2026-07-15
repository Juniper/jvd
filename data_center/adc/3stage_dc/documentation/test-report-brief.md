# Test Report Brief — 3-Stage Data Center Reference Design with Juniper Apstra

> **JVD-DCFABRIC-3STAGE-02-01** · Juniper Validated Design · IPv4 underlay (baseline flavor)
> Source: *JVD Test Report Brief: 3-Stage Data Center Reference Design with Juniper Apstra* (juniper.net, V2.1).
> Companion docs: [design-guide.md](design-guide.md) · [solution-overview.md](solution-overview.md) · [datasheet.md](datasheet.md)

## Introduction

This test report brief contains qualification test-report data for the 3-Stage Data Center Reference Design with Juniper Apstra JVD. The qualification covers blueprint deployment, incremental configuration push, telemetry/analytics checking, data validation, and traffic flow. The design is based on an **ERB (Type 2 and Type 5) EVPN/VXLAN** fabric with spine, server-leaf, and border-leaf devices. Qualification objectives include validating blueprint deployment, device upgrade, incremental config pushes/provisioning, telemetry/analytics checking, failure-mode analysis, and verification of host traffic.

## Platforms tested

*Table 1 — Tested platforms (all Junos OS Release 23.4R2-S3; AOS 4.2.1).*

| Role | Platform |
|------|----------|
| DC1-SNGL-LEAF1 | QFX5120-48Y-8C |
| DC1-ESI1-LEAF1 | QFX5120-48Y-8C \| QFX5110-48S-4C |
| DC1-ESI1-LEAF2 | QFX5120-48Y-8C \| QFX5110-48S-4C |
| DC1-BRDR-LEAF1 | QFX10002-36Q \| QFX5130-32CD \| QFX5700 \| ACX7100-48L \| ACX7100-32C \| PTX10001-36MR |
| DC1-BRDR-LEAF2 | QFX10002-36Q \| QFX5130-32CD \| QFX5700 \| ACX7100-48L \| ACX7100-32C \| PTX10001-36MR |
| DC1-SPINE1 | QFX5220-32CD \| QFX5120-32CD |
| DC1-SPINE2 | QFX5220-32CD \| QFX5120-32CD |
| TOR_SWITCH | QFX10002-36Q |
| DC1-EXTERNAL-Router | MX304 |
| AOS | Apstra 4.2.1 |

**Version qualification history:** qualified in **Junos OS Release 23.4R2-S3** and **Apstra AOS 4.2.1**.

## Scale numbers (Table 2)

Per-leaf and fabric-wide scale exercised during multidimensional testing (not device maximums):

| Feature | Tested scale |
|---------|--------------|
| VN / VLAN / IRB count (single leaf) | 500 each |
| Single-leaf local MAC-IP host entries | 2,500 |
| ESI-leaf VLAN count | 1,500 |
| ESI-leaf local MAC-IP host entries | 7,500 (per leaf) |
| DC1 total MAC-IP count | 17,500 |
| DC1 total NDP entry count | 1,400 |
| VNI per leaf node | 500 |
| VTEP per leaf node | 6 |
| ESI per leaf node | 4 |
| BGP routing-table per leaf node | 363,000 |
| EVPN table size per leaf node | 44,000 |

## Performance numbers (Table 3)

| Event | Result |
|-------|--------|
| Multihomed access-link failure | Traffic recovery < 750 ms |
| Leaf-to-spine link failure | Traffic recovery < 500 ms |
| Dual-homed node reboot | Traffic loss impact < 500 ms |
| Single-node BGP protocol flap | Traffic loss impact < 150 ms |
| Global MAC-learning init (20k entries) | < 10 s |

## High-level features tested (Table 4, summarized)

Single-homed and multi-homed (ESI/LACP) access links; up to 2,000 VLANs per access interface / AE bundle distributed between Blue and Red VRFs; border-leaf pair with per-VRF BGP peering to a Generic System for inter-VRF, external DHCP and external hosts; **eBGP underlay and overlay**; **IP ECMP with fast-reroute**; **BFD** (1 s / 3 s default AOS timers); **MAC-VRF** (VLAN-aware, 1 VNI per VLAN); **Layer-3 IRB** (anycast, 9000-byte MTU); EP-style access interfaces; **Type-2 and Type-5 routing**; per-VRF **DHCP relay**; LLDP; duplicate-MAC detection; BGP graceful restart. Nodes span single leaf, ESI leaf pair, border-leaf pair, and all fabric devices as applicable.

## Tested events (Table 5, summarized)

- **Apstra deployment steps** — agent profiles, pristine configs, logical devices / interface maps / device profiles (leaf, spine, external router, emulated servers), rack types (ESI leaf pair + 4 servers, single leaf, border leaf), rack templates, blueprint create/commit, resource-pool assignment, cabling-map check, overlay routing zones, EVPN loopbacks, virtual networks, overlay commit + control-plane validation.
- **NSX-T** — prepare NSX-T elements, build NSX↔Junos communication via Apstra, verify Geneve tunnels up, verify overlay connectivity.
- **Resiliency / negative** — device state changes (undeploy/drain/pristine + redeploy), remove/add tenants, reboot devices (incl. NSX Edge node), server-link failure, multihomed-link failure, leaf-to-spine link failure, process restart, MAC move (incl. vMotion), deactivate BGP on leaf, reset DHCP bindings, 8-hour longevity, extended negative testing, fabric device upgrade from Apstra.

## Traffic profiles (Table 6, summarized)

Intra-VRF, inter-VRF, and external traffic paths across single and ESI leaves (IPv4 and IPv6), each at **1000 pps** with **random 256–1024-byte** packets — e.g. `dc1sleaf1_red_to_allred` (intra-VRF), `dc1sleaf1_red_to_allblue` (inter-VRF), `External_routes_to_all_blue` (external).

## Known limitations

- **MAC-VRF on QFX5120 / QFX5110 leaves** requires `set forwarding-options evpn-vxlan shared-tunnels`. After Apstra applies it, the device must be **rebooted**; Apstra reports an anomaly until the manual reboot is done.
- **QFX10002 as a border leaf with DHCP relay** requires the `no-snooping` parameter via an Apstra configlet, e.g. `set routing-instances blue forwarding-options dhcp-relay no-snoop`.

## Sources

- *JVD Test Report Brief: 3-Stage Data Center Reference Design with Juniper Apstra* — JVD-DCFABRIC-3STAGE-02-01 (juniper.net Validated Designs).
- Full test-bed configuration archive: contact your Juniper Networks representative.
- Companion: [design-guide.md](design-guide.md), [solution-overview.md](solution-overview.md), [datasheet.md](datasheet.md).
