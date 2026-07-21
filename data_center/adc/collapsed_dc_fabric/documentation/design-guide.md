# Design Guide — Collapsed Data Center Fabric

> **JVD-DCFABRIC-COLLAPSED-01-02** · Juniper Validated Design · collapsed-spine EVPN-VXLAN
> Source: *Collapsed Data Center Fabric with Juniper Apstra — Juniper Validated Design (JVD)* (juniper.net).
> Companion docs: [solution-overview.md](solution-overview.md) · [test-report-brief.md](test-report-brief.md) · [datasheet.md](datasheet.md)

## About this document

This document provides an overview of the steps to provision a **Collapsed Data Center Fabric with Juniper Apstra** — two switches in a collapsed-spine architecture. It is intended for an audience familiar with Junos OS, QFX Series switches, and Juniper Apstra.

## Solution benefits

The Collapsed Data Center Fabric JVD is designed for scenarios where a 3-stage data center network would be an unreasonably large investment. Use cases include:

- Remote sites and branch office data center networks
- Extending current L2 domains to remote sites through EVPN
- Single-rack PODs within a larger data center
- Deployments where low budget, space, or power constraints are a primary consideration
- Small data center networks needing high availability

**Juniper Apstra** is a multi-vendor, intent-based network fabric management solution that provides closed-loop automation and assurance — translating business intent into device-specific configuration and continuously self-validating against intent.

## Use case and reference architecture

The topology is created in Juniper Apstra. The JVD is a **two-switch** network fabric for small deployments; the switches perform the roles of spine, leaf, and border leaf simultaneously, enabling high availability with a minimum of switch hardware (resource constraints limit real-world expandability).

- For more ports than two collapsed switches provide via access switches, see the **Collapsed Fabric with Apstra and Access Switches JVDE**.
- For more fabric ports, see the **3-Stage Data Center Design with Juniper Apstra JVD**.

The design uses **EVPN-VXLAN for the control plane and eBGP for both underlay and overlay** signaling, so leaf switches discover remote hosts without flooding the overlay with ARP/ND. Because the collapsed switches serve all fabric roles including border leaf, they are tested to serve as **anycast gateways** as well as **gateways to external networks** (DCI features).

## Solution architecture

### Hardware and software

The following switches are validated for the collapsed-spine role (baseline used in the walkthrough is **QFX5120-48Y**):

| Role | Validated platforms |
|------|---------------------|
| Collapsed spine (×2) | QFX5120-48Y, QFX5130-32CD, QFX5700, ACX7100-48L, PTX10001-36MR |
| External router | MX204 |

| Juniper product | Software / version |
|-----------------|--------------------|
| Juniper Apstra | 4.2.1 |
| Junos OS | 23.4R2-S3 |

### Fabric characteristics

- **Direct leaf-to-leaf peering** — with no separate spine tier, the two collapsed switches peer directly: an eBGP **underlay** (`l3clos-l`, over point-to-point links) and an eBGP **EVPN overlay** (`l3clos-l-evpn`, over loopbacks, multihop ttl 1) between the two leaves.
- **ERB overlay** — symmetric IRB with anycast gateways on both switches; a VLAN-aware **MAC-VRF** (`evpn-1`) with one VXLAN VNI per VLAN.
- **ESI-LAG multihoming** — AE bundles with ESI + LACP to dual-home servers/access switches across both collapsed switches.
- **External / border** — each tenant VRF peers via eBGP (`l3rtr`) to an external router (MX204) for inter-VRF and external connectivity; the collapsed switches act as border-leaf gateways.
- **Resilience** — BFD on underlay and overlay (500 ms / 1000 ms timers); IP ECMP with fast re-route.

## Configuration walkthrough

The fabric is provisioned through Apstra (logical devices, interface maps, a **collapsed-spine** rack type and template, a blueprint with IP/ASN pools, then routing zones (VRFs), virtual networks (VLAN/VNI), and connectivity templates to hosts and the external router). Apstra's Data Center reference design renders native Junos config for both switches.

## Recommendations

- Junos OS **23.4R2-S3** is the recommended version (updated from 22.2R3-S3 in revision 01-02).
- The collapsed fabric is ideal where a 3-stage fabric is oversized; scale beyond two switches with the Access-Switches JVDE or move to the 3-stage design.

## Revision history

| Date | Version | Description |
|------|---------|-------------|
| April 2024 | JVD-DCFABRIC-COLLAPSED-01-01 | Initial publish |
| January 2025 | JVD-DCFABRIC-COLLAPSED-01-02 | Recommended Junos version updated to 23.4R2-S3 (from 22.2R3-S3) |

## Sources

- *Collapsed Data Center Fabric with Juniper Apstra — Juniper Validated Design (JVD)* — JVD-DCFABRIC-COLLAPSED-01-02 (juniper.net).
- Companion: [solution-overview.md](solution-overview.md), [test-report-brief.md](test-report-brief.md), [datasheet.md](datasheet.md).
