# Design Guide — Collapsed Data Center Fabric with Access Switches

> **Juniper Validated Design Extension (JVDE)** · collapsed fabric + EX4400 access layer
> Source: *Collapsed Data Center Fabric with Juniper Apstra and Access Switches — Juniper Validated Design Extension (JVDE)* (juniper.net).
> Companion docs: [solution-overview.md](solution-overview.md) · [test-report-brief.md](test-report-brief.md) · [datasheet.md](datasheet.md)

## About this document

This document provides an overview of the steps to provision the **Collapsed Fabric with Access Switches and Juniper Apstra JVDE**. It extends the [base Collapsed Data Center Fabric JVD](../../collapsed_dc_fabric/) by adding an access-switch layer for port expansion. Use this JVDE when you want the collapsed fabric topology but need more access-switch interfaces. The audience is expected to be familiar with Junos OS, QFX and EX Series switches, and Juniper Apstra.

## Solution benefits

JVDs are prescriptive network building blocks tested with real-world workloads. **JVDEs** build upon JVDs to extend them — here, adding an access-switch layer for port expansion. This JVDE includes the configuration for both the original collapsed fabric and the access-switch functionality it introduces. For scenarios requiring more 10GbE+ ports than the collapsed fabric provides, Juniper recommends the [3-Stage Data Center Design](../../3stage_dc/).

## Use case and reference architecture

The topology is ERB-based and created with Juniper Apstra. The base collapsed fabric is a two-switch network (spine + leaf + border-leaf collapsed into two switches); this JVDE adds an **access-switch layer** to add a modest number of 1GbE / 2.5GbE ports.

- Only the **EX4400-48MP** platform was validated for the access-switch role — a deliberate, budget-conscious choice for adding 1GbE ports.
- For customers needing more 10GbE+ ports, use a collapsed fabric with higher-port-count switches or the 3-Stage Data Center Design.

## Solution architecture

### Hardware and software

| Role | Validated platforms | OS |
|------|---------------------|----|
| Collapsed spine (×2) | QFX5120-48Y, QFX5130-32CD, QFX5700, ACX7100-48L, PTX10001-36MR | Junos OS 22.2R3-S3 |
| Access switch (×2) | EX4400-48MP | Junos OS 22.4R3 |
| External router | MX204 | Junos OS 22.2R3-S3 |
| Apstra | — | 4.2.1 |

### Fabric characteristics

- **Two tiers, each a direct 2-node EVPN fabric.** The collapsed leaves peer directly with each other (`l3clos-l` underlay + `l3clos-l-evpn` overlay); the access pair likewise peers directly with each other (`l3clos-a` underlay + `l3clos-a-evpn` overlay). Both tiers run eBGP underlay + eBGP EVPN overlay.
- **Access switches are EVPN-VXLAN VTEPs.** Each EX4400 runs a VLAN-aware MAC-VRF (`evpn-1`), sources VXLAN from `lo0.0`, and enables `forwarding-options evpn-vxlan shared-tunnels` + `vxlan-routing overlay-ecmp`.
- **ESI-LAG interconnect.** The access pair is multihomed **up** to the collapsed leaf pair with an all-active ESI-LAG, and servers are multihomed **down** to the access pair with all-active ESI-LAGs — matching ESI value and LACP system-id on both members of each bundle.
- **Resilience.** BFD on underlay (1000 ms) and overlay (3000 ms); ECMP; anycast IRB gateways on the collapsed leaves.

## Configuration walkthrough

Provisioning is through Apstra (the base collapsed-fabric blueprint, then the access-switch rack additions). Apstra renders native Junos config for the collapsed leaves (QFX) and the EX4400 access switches. The access-switch snippets in this folder capture the added access-tier config (access-tier eBGP, MAC-VRF, EVPN-VXLAN forwarding) and the ESI-LAG interconnect between the tiers.

## Recommendations

- Junos OS **22.2R3-S3** is the minimum recommended version for the collapsed spine; the EX4400 access switches were validated on **22.4R3**.
- Use this JVDE for cost-efficient 1GbE / 2.5GbE port expansion; move to the 3-stage design when higher-speed port scale is required.

## Sources

- *Collapsed Data Center Fabric with Juniper Apstra and Access Switches — JVDE* (juniper.net).
- Companion: [solution-overview.md](solution-overview.md), [test-report-brief.md](test-report-brief.md), [datasheet.md](datasheet.md).
