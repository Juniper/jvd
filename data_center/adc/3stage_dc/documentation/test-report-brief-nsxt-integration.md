# Test Report Brief — 3-Stage Data Center Design with Juniper Apstra and VMware NSX-T

> **Juniper Validated Design Extension (JVDE)** · NSX-T Inline Mode · V2.0
> Source: *JVDE Test Report Brief: 3-Stage Data Center Design with Juniper Apstra and VMware NSX-T* (juniper.net).
> Companion docs: [design-guide-nsxt-integration.md](design-guide-nsxt-integration.md) · [solution-overview-nsxt-integration.md](solution-overview-nsxt-integration.md) · [datasheet-nsxt-integration.md](datasheet-nsxt-integration.md)

## Introduction

This test report brief contains qualification data for the 3-Stage Data Center Design with Juniper Apstra and VMware NSX-T JVDE. The design is an **ERB (Type-2 and Type-5) EVPN/VXLAN** fabric with spine, server-leaf, border-leaf, and **NSX-T Edge Gateway** devices. NSX-T Data Center implements three integrated planes (management, control, data) across NSX Manager and transport nodes. The Juniper fabric is viewed as an *external network* linked to the NSX overlay through a **Tier-0 router / NSX Edge**.

## Platforms tested

*Table 1 — Tested platforms (all Junos OS Release 22.2R3-S3; AOS 4.2.1).*

| Role | Platform |
|------|----------|
| DC1-SNGL-LEAF1 | QFX5120-48Y-8C |
| DC1-ESI1-LEAF1 | QFX5120-48Y-8C \| QFX5110-48S-4C \| EX4400-MP |
| DC1-ESI1-LEAF2 | QFX5120-48Y-8C \| QFX5110-48S-4C \| EX4400-MP |
| DC1-BRDR-LEAF1 | QFX10002-36Q \| QFX5130-32CD \| QFX5700 \| ACX7100-48L \| ACX7100-32C \| PTX10001-36MR |
| DC1-BRDR-LEAF2 | QFX10002-36Q \| QFX5130-32CD \| QFX5700 \| ACX7100-48L \| ACX7100-32C \| PTX10001-36MR |
| DC1-SPINE1 / DC1-SPINE2 | QFX5220-32CD \| QFX5120-32CD |
| TOR_SWITCH | QFX10002-36Q |
| DC1-EXTERNAL-Router | MX304 |
| AOS | Apstra 4.2.1 |

**Version qualification history:** qualified in **Junos OS Release 22.2R3-S3** and **Apstra AOS 4.2.1**.

## Scale numbers (Table 2)

Same multidimensional scale envelope as the base flavor: VN/VLAN/IRB 500 per single leaf; ESI-leaf VLAN 1,500; ESI-leaf local MAC-IP 7,500/leaf; DC1 total MAC-IP 17,500; DC1 total NDP 1,400; VNI/leaf 500; VTEP/leaf 6; ESI/leaf 4; BGP routing-table/leaf 363,000; EVPN table/leaf 44,000. (Not device maximums.)

## Performance numbers (Table 3)

| Event | Result |
|-------|--------|
| Multihomed access-link failure | Traffic recovery < 750 ms |
| Leaf-to-spine link failure | Traffic recovery < 500 ms |
| Dual-homed node reboot | Traffic loss impact < 500 ms |
| Single-node BGP protocol flap | Traffic loss impact < 150 ms |
| Global MAC-learning init (20k entries) | < 10 s |

## High-level features tested (Table 4, summarized)

All the base-flavor features — single/multi-homed access (ESI/LACP), border-leaf pair, eBGP underlay+overlay, IP ECMP with fast-reroute, BFD (1 s / 3 s), MAC-VRF (VLAN-aware, 1 VNI/VLAN), L3 IRB (anycast, 9000 MTU), EP-style access, Type-2/Type-5 routing, per-VRF DHCP relay, LLDP, duplicate-MAC detection, BGP graceful restart — **plus the NSX-T-specific feature:**

- **NSX-T uplink profiles for edge and host nodes** (border leaves) — border-leaf peering with the NSX Edge node to provide connectivity between NSX transport zones and to Apstra fabric hosts.

## Tested events (Table 5, summarized)

The full Apstra deployment flow (agent profiles → pristine configs → logical devices/interface maps/device profiles → rack types/templates → blueprint create/commit → resource + interface-map assignment → cabling check → overlay routing zones → EVPN loopbacks → virtual networks → overlay commit), **plus NSX-T steps**: prepare NSX-T elements; build NSX↔Junos communication via Apstra; verify NSX-T **Geneve tunnels** up; verify overlay connectivity. Resiliency/negative tests: device state changes, remove/add tenants, reboot devices (incl. NSX Edge node → transport-zone recovery), server-link/multihomed/leaf-to-spine link failure, process restart, MAC move (incl. vMotion), deactivate BGP on leaf, reset DHCP bindings, 8-hour longevity, extended negative testing, fabric device upgrade from Apstra.

## Traffic profiles (Table 6, summarized)

Intra-VRF, inter-VRF, and external paths across single and ESI leaves (IPv4 and IPv6), each at **1000 pps** with **random 256–1024-byte** packets.

## Known limitations

- **MAC-VRF on QFX5120 / QFX5110 leaves** requires `set forwarding-options evpn-vxlan shared-tunnels`; the device must then be **rebooted** (Apstra reports an anomaly until the manual reboot).
- **QFX10002 as a border leaf with DHCP relay** requires `no-snooping` via an Apstra configlet, e.g. `set routing-instances blue forwarding-options dhcp-relay no-snoop`.

## Sources

- *JVDE Test Report Brief: 3-Stage Data Center Design with Juniper Apstra and VMware NSX-T*, V2.0 (juniper.net Validated Designs).
- Full test-bed configuration archive: contact your Juniper Networks representative.
- Companion: [design-guide-nsxt-integration.md](design-guide-nsxt-integration.md), [solution-overview-nsxt-integration.md](solution-overview-nsxt-integration.md), [datasheet-nsxt-integration.md](datasheet-nsxt-integration.md).
