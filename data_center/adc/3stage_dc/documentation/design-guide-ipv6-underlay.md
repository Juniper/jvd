# Design Guide — EVPN-VXLAN 3-Stage Data Center with IPv6 Underlay (Juniper Apstra)

> **JVD-DCFABRIC-3STAGE-IPV6-01-01** · Juniper Validated Design · **IPv6 underlay** variant · 2026-Q1
> Source: *EVPN VXLAN 3-Stage IPv6 Data Center with Apstra — Juniper Validated Design*.
> **Status note:** this is the newest flavor of the 3-Stage Data Center JVD and extends the published [IPv4 base design guide](design-guide.md); some content references features/releases current at the time of writing (Junos 25.2, Apstra 6.1). Confirm against the latest published document on juniper.net.
> Companion: [design-guide.md](design-guide.md) (IPv4 base) · [datasheet.md](datasheet.md#version-history)

## About this document

This JVD covers the 3-stage data center **ERB** architecture with an **IPv6 underlay**, implementing EVPN-VXLAN over IPv6 on Juniper switches, deployed with Juniper Apstra. It follows the existing [3-Stage EVPN/VXLAN Fabric with Juniper Apstra JVD](design-guide.md) (which covers the IPv4 fabric) and adds the IPv6 underlay + overlay solution and features. Per-role configuration templates are on GitHub.

> **Nomenclature:** *Edge-routed bridging (ERB)* = distributed VXLAN routing with EVPN (distributed-gateways model).

## Why IPv6 underlay

Main drivers for IPv6 adoption:

- **Exponential growth** of IoT devices and AI workloads demanding IPv6's massive scalability.
- **Government / public-sector mandates** for IPv6.
- **Major cloud-provider native IPv6 support** (AWS, Azure, Google Cloud).

With 128-bit addressing, IPv6 offers massive scalability and native IPsec. Using **IPv6 link-local addressing in the fabric** reduces operational overhead, eliminates managing global IPv4 addresses on links, and prevents address exhaustion. Juniper Apstra acts as the Intent-Based Networking platform that automates IPAM and streamlines BGP neighbor discovery/configuration.

## How this variant differs from the IPv4 base

| Aspect | IPv4 base ([design-guide.md](design-guide.md)) | **IPv6 underlay (this variant)** |
|--------|------------------------------------------------|----------------------------------|
| Underlay addressing | IPv4 /31 P2P links; IPv6 for loopback only | **IPv6 link-local (unnumbered) fabric interfaces** |
| BGP fabric peering | eBGP over IPv4 P2P | **BGP unnumbered / auto-discovery** over IPv6 link-local (neighbor auto-discovered; no manual per-link addressing) |
| IPv4 overlay reachability | Native IPv4 next-hops | **IPv4 routes advertised via IPv6 next-hops (RFC 5549)** |
| Overlay | EVPN-VXLAN (Type-2/Type-5) | EVPN-VXLAN with **IPv6 overlay on IPv6 underlay** |
| IRB | Asymmetric IRB, anycast | **Asymmetric IRB with IPv6 underlay** (available in Junos 25.2) |
| Apstra IPAM | Manual/pool-based IPv4 | **Apstra 6.1** provides IPv6 assignment + BGP config (BGP unnumbered configlet not required when Apstra 6.1 manages it) |

**BGP unnumbered with IPv6:** the IPv6 underlay uses IPv6 link-local addresses on unnumbered interfaces with BGP neighbor auto-discovery, advertising IPv4 overlay routes via IPv6 next-hops (RFC 5549). Where Apstra does not manage it, a BGP-unnumbered configlet can be applied in Apstra — a snippet is provided in Appendix A of the source document. Starting with **Apstra 6.1**, IPv6 underlay is supported on all applicable devices and BGP unnumbered/auto-discovery is handled by Apstra.

## Reference architecture & hardware

Same 3-stage ERB roles (lean spine / server leaf / border leaf). Baseline: **QFX5220-32CD** spine, **QFX5130-32CD** border leaf, **QFX5120-48Y** server leaf.

*Table 1 — Supporting devices:*

| Role | Devices |
|------|---------|
| Server Leaf | QFX5120-48Y / QFX5120-48YM |
| Border Leaf | QFX5130-32CD / QFX5130E-32CD · QFX5700 / QFX5700E |
| Spine | QFX5220-32CD |

*Table 2 — Reference-design hardware & software:*

| Product | Role | Software |
|---------|------|----------|
| QFX5220-32CD | Spine | Junos OS Evolved Release **25.2X100-D30** |
| QFX5120-48Y | Server Leaf | Junos OS Release **25.2R2.6** |
| QFX5130-32CD | Border Leaf | Junos OS Evolved Release **25.2X100-D30** |

## Validated functionality (IPv6-specific highlights)

- **IPv6 underlay** (with Apstra 6.1 providing IPv6 assignment and BGP configuration; BGP unnumbered configlet then unnecessary).
- **BGP unnumbered peering** over IPv6 link-local (auto-discovery) for the underlay, with RFC 5549 IPv4-over-IPv6 next-hops.
- **IPv6 overlay with IPv6 underlay** — EVPN-VXLAN control/data plane over the IPv6 fabric.
- **Asymmetric IRB with IPv6 underlay** (available in Junos 25.2).
- Standard Junos data center features deployed via Apstra (MAC-VRF, Type-2/Type-5 EVPN, anycast IRB, ESI multihoming, DHCP relay, LLDP, telemetry) — as in the base flavor.
- **Apstra configlets** and **Apstra probes** for customized configuration and assurance (see source Tables 5 and 6).
- **Appendix B** — loopback firewall filters to protect the routing engine (RE).

## Configuration walkthrough & verification

The walkthrough builds the fabric through Apstra (device onboarding, logical devices / interface maps, racks/templates, blueprint, resource assignment, overlay routing zones, virtual networks) with the IPv6 underlay differences noted above, followed by a Verification section and a Junos configuration overview. The **rendered per-device configs live in [`../configuration/conf/`](../configuration/conf/)** and the templated building blocks in [`../configuration/snips/`](../configuration/snips/).

> **Note (QFX5120):** both virtual-switch and MAC-VRF are supported; see the source guide for the default next-hop table sizing (8K on QFX5120) and `default switch` guidance for blueprints created prior to Apstra 4.2.

## Sources

- *EVPN VXLAN 3-Stage IPv6 Data Center with Apstra — Juniper Validated Design*, JVD-DCFABRIC-3STAGE-IPV6-01-01 (2026-Q1).
- Related: [AI-DC EVPN multitenancy JVD — IPv6 link-local underlay](https://www.juniper.net/documentation/us/en/software/jvd/jvd-ai-dc-evpn-multitenancy/) (referenced for BGP unnumbered / RFC 5549).
- Rendered configs: [`../configuration/conf/`](../configuration/conf/). Base flavor: [design-guide.md](design-guide.md).
