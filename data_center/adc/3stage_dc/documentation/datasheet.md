# 3-Stage Data Center Design with Juniper Apstra — Datasheet

> **JVD-DCFABRIC-3STAGE-02-01** · slug `3stage-dc` · EVPN-VXLAN ERB fabric managed by Juniper Apstra
> Quick-reference for the 3-Stage Data Center JVD and its variants. Grounds the [BYOAI](../configuration/snips/byoai/README.md) Design mode.

## At a glance

A prescriptive 3-stage (spine / leaf) EVPN-VXLAN data center fabric — Juniper's "standard-candle" data center design — built and operated with **Juniper Apstra** intent-based automation, using an **edge-routed bridging (ERB)** architecture with anycast IRB gateways.

| | |
|---|---|
| **JVD / slug** | 3-Stage Data Center Design with Juniper Apstra · `3stage-dc` |
| **Track** | Data Center (ADC) |
| **Architecture** | 3-stage Clos, ERB (distributed VXLAN routing with EVPN) |
| **Transport** | eBGP underlay + eBGP EVPN overlay; VXLAN data plane |
| **Services** | L2 MAC-VRF (EVPN-VXLAN, Type-2) · L3 VRF (EVPN Type-5 ip-prefix) |
| **Orchestration** | Juniper Apstra (Day-0/1/2, telemetry, IBA analytics) |
| **Validation** | Blueprint deployment, scale, failure-mode, traffic, upgrade — ERB Type-2 + Type-5 |
| **Min. validated software** | Junos OS **23.4R2-S3** + Apstra **4.2.1** (base flavor). See juniper.net for the current matrix. |

## Device roles

| Role | Function in the network |
|------|-------------------------|
| **Spine** (lean) | IP forwarding and route relaying between leaves; no VTEP termination |
| **Server Leaf** | Learns/advertises local MACs via BGP EVPN; hosts MAC-VRF + L3 VRF; single- and multi-homed (ESI/LACP) server access |
| **Border Leaf** | Server-leaf functions **plus** gateway to external networks / DCI (external router peering, NSX-T edge, MACsec, deep buffers) |

## Featured platforms

Baseline devices (\*) plus qualified alternates. Software = minimum validated release; regression re-validates on newer releases (see juniper.net for the current set).

| Role | Devices (\* = baseline) | Min. validated software |
|------|--------------------------|--------------------------|
| Spine | **QFX5220-32CD\*** · QFX5120-32C · QFX5210-64CD · QFX5200-32C | Junos OS Evolved 23.4R2-S3 |
| Server Leaf | **QFX5120-48Y-8C\*** · QFX5110-48S · EX4400-24MP# | Junos OS 23.4R2-S3 (EX4400: 22.4R3.25) |
| Border Leaf | **QFX5130-32CD\*** · QFX5700 · ACX7100-48L · ACX7100-32C · PTX10001-36MR · QFX10002-36Q | Junos OS / Junos OS Evolved 23.4R2-S3 |
| External router | MX304 / MX204 | Junos OS 23.4R2-S3 |

> \# EX4400 has a fabric-wide scale limitation; contact your Juniper account representative.

## Protocols & functions

- **Underlay / transport:** eBGP Clos underlay; BFD (1 s / 3 s); IP ECMP with fast-reroute.
- **Overlay / services:** eBGP EVPN overlay; VXLAN; EVPN **Type-2** (MAC/IP) and **Type-5** (ip-prefix) routes; MAC-VRF (VLAN-aware, 1 VNI per VLAN).
- **Layer-3:** asymmetric **anycast IRB** (same address/MAC per VLAN/VNI across leaves, 9000-byte MTU); inter-VRF via external router (route leaking through Apstra connectivity templates).
- **Access:** ESI **all-active multihoming** with LACP; EP-style access interfaces; single-homed trunks.
- **Resiliency:** duplicate-MAC detection; BGP graceful restart.
- **Services / assurance:** per-VRF DHCP relay; LLDP; Apstra telemetry, Flow Data, and IBA analytics.

## Services & use cases

| Service | What it delivers | Means of delivery |
|---------|------------------|-------------------|
| **L2 EVPN-VXLAN (MAC-VRF)** | Layer-2 tenant segmentation across the fabric | VLAN-aware MAC-VRF, per-VNI route-targets, anycast IRB |
| **L3 VRF (EVPN Type-5)** | Layer-3 tenant isolation + external/WAN exit | `ip-prefix-routes` VRF, IRB gateway, border-leaf eBGP to external router |

**Intent-based use cases** compose *tenant connectivity* (RED / BLUE VRFs, VLANs 400–649 / 3500–3749) × *service* (L2 bridging, L3 routing) × *resiliency* (ESI multihoming, ECMP, BFD) × *edge* (external router, NSX-T, DCI). See the [design guide](design-guide.md) and [test report brief](test-report-brief.md) for the validated set.

## Version history

The IPv4 base flavor (`JVD-DCFABRIC-3STAGE-02-01`) evolved across releases:

| Version | Date | Software | Notes |
|---------|------|----------|-------|
| v1 | 2023-Q3 | Junos 22.2R3-S3 · Apstra 4.x | Original 3-Stage Fabric with Juniper Apstra |
| v2 | 2024-Q1 | Junos 22.2R3-S3 · Apstra 4.2.1 | JVD-DCFABRIC-3STAGE-02-01 |
| **v2.1** | 2025-Q1 (pub. 2025-05-23) | **Junos 23.4R2-S3** · Apstra 4.2.1 | Recommended Junos updated to 23.4R2-S3 from 22.2R3-S3 — **current published base** |

## Variants (flavors)

| Flavor | JVD ID | Software | Distinguishing feature | Docs |
|--------|--------|----------|------------------------|------|
| **IPv4 underlay (base)** | JVD-DCFABRIC-3STAGE-02-01 | Junos 23.4R2-S3 · Apstra 4.2.1 | IPv4 /31 fabric; IPv6 for loopback only | [design-guide.md](design-guide.md) |
| **NSX-T integration** | JVDE (Inline Mode) | Junos 22.2R3-S3 · Apstra 4.2.1 · NSX-T 3.2 | VMware NSX-T edge terminates on border leaves; Geneve↔EVPN-VXLAN; T0/T1 BGP peering | [design-guide-nsxt-integration.md](design-guide-nsxt-integration.md) · [datasheet-nsxt-integration.md](datasheet-nsxt-integration.md) |
| **IPv6 underlay** | JVD-DCFABRIC-3STAGE-IPV6-01-01 | Junos 25.2 · Apstra 6.1 | IPv6 link-local (unnumbered) fabric, BGP auto-discovery, RFC 5549 | [design-guide-ipv6-underlay.md](design-guide-ipv6-underlay.md) |

> The repo's snip library and rendered configs represent the **IPv4 base flavor** (ERB EVPN-VXLAN, spine/leaf/border-leaf).

## Design concepts (jump-to)

- **Underlay** — eBGP Clos, lean spines, ECMP + fast-reroute, BFD → [design guide § Solution architecture](design-guide.md#solution-architecture).
- **Overlay** — eBGP EVPN, Type-2 / Type-5, MAC-VRF → [design guide § Validated functionality](design-guide.md#validated-functionality).
- **Layer-3 / IRB** — asymmetric anycast IRB, inter-VRF via external router.
- **Access / HA** — ESI multihoming, LACP, duplicate-MAC detection.
- **Operations** — Apstra Day-0/1/2, telemetry, IBA analytics, upgrades.

## References

- **JVD page (juniper.net):** [3-Stage EVPN/VXLAN Fabric with Juniper Apstra](https://www.juniper.net/documentation/us/en/software/jvd/jvd-3-stage-datacenterdesign-with-juniper-apstra/index.html)
- **Validated Designs index:** https://www.juniper.net/documentation/us/en/software/jvd/
- **Portal:** [JVD portal](https://juniper.github.io/jvd/portal/) (Discover · Learn · Design · Build) — Config Generator at [#generator](https://juniper.github.io/jvd/portal/#generator)
- **Companion docs:** [solution-overview.md](solution-overview.md) · [design-guide.md](design-guide.md) · [test-report-brief.md](test-report-brief.md)
- **Configs / snips:** [`../configuration/conf/`](../configuration/conf/) · [`../configuration/snips/`](../configuration/snips/) · [BYOAI assistant](../configuration/snips/byoai/README.md)
