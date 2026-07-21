# Test Report Brief — EVPN-VXLAN Data Center Interconnect (DCI)

> **JVD-DCI-MULTISITE-01-01** · Juniper Validated Design Extension (JVDE) · test report brief (V1.0/250327)
> Source: *JVD Test Report Brief: Datacenter Interconnect Design with Juniper Apstra* (juniper.net).
> Companion docs: [solution-overview.md](solution-overview.md) · [design-guide.md](design-guide.md) · [datasheet.md](datasheet.md)

## Introduction

This report outlines the qualification testing of the **Data Center Interconnect (DCI) Reference Design with Juniper Apstra**. It is based on three DCI methods that reuse the blueprints from the prior 3-Stage, 5-Stage, and Collapsed Fabric JVDs. The prerequisite for this effort is deployment and understanding of those three prior JVD implementations; this report does not re-cover their individual design elements.

DCI testing covered:

- **3-Stage-DC1 → L2 OTT interconnect → 3-Stage-DC2**
- **3-Stage-DC1 → seamless stitching with translation VNIs (Type 2 only) → Collapsed Fabric-DC3**
- **3-Stage-DC1 → seamless stitching with translation VNIs (Type 5 and Type 2) → 5-Stage-DC4** (one Type-5-only POD and two T2/T5 PODs)

Qualification objectives included blueprint deployment, incremental provisioning, telemetry/analytics checking, performance/convergence characterization, failure-mode analysis, and verification of host traffic.

## Test topology

Three mutually exclusive test beds — one per DCI technique — each connected the two fabrics through interconnect (ISP) switches (QFX10002-36Q), with an **IXIA** traffic generator on the test ports connected to the leaves.

*Table 2 — platforms, controllers, and roles (devices under test):*

| Tag | Role | Model | OS |
|-----|------|-------|----|
| DC1_BL1 / DC1_BL2 | 3-stage POD1 border leaf 1 / 2 | QFX5700 | Junos OS Evolved 23.4R2-S4 |
| DC2_BL1 / DC2_BL2 | 3-stage POD2 border leaf 1 / 2 | PTX10001-36MR | Junos OS Evolved 23.4R2-S4 |
| DC3_BL1 / DC3_BL2 | Collapsed fabric leaf 1 / 2 | QFX5120-48YM | Junos OS 23.4R2-S4 |
| DC4_BL1 / DC4_BL2 | 5-stage services leaf 1 / 2 | QFX5130-48C | Junos OS Evolved 23.4R2-S4 |

### VLAN / VRF grouping

Tenants are organized into **RED**, **BLUE**, and **GREEN** VRFs, with common ranges (stretched to both sites) and per-site unique ranges. GREEN is a **Type-5-only** VRF. Both IPv4 and IPv6 subnets are provisioned per VLAN group (e.g. RED_COMMON 400–599 → 10.0.x.0/24; BLUE_COMMON 1400–1599 → 10.10.x.0/24; GREEN_SUB 2500–2899 → 10.25/10.27.0.0/24).

## High-level features validated

*Table 7 — high-level features:*

| Feature | Node(s) | Description |
|---------|---------|-------------|
| L2 OTT interconnect | QFX5700 and PTX10001 | Interconnect method between 3-Stage DC1 and DC2 |
| VXLAN-to-VXLAN seamless stitching | QFX5700 and QFX5120 | Interconnect method between 3-Stage DC1 and Collapsed Fabric DC3 |
| T2 and T5 VXLAN-to-VXLAN stitching | QFX5700 and QFX5130 | Interconnect method between 3-Stage DC1 and 5-Stage DC4 |
| ECMP | All leaves and border gateways | Via multihomed interconnect gateways |
| MAC-VRF EVI · VLAN-aware service type | All leaves | Supported Apstra EVI method / service type |
| IPv4 and IPv6 | All leaves | Overlay host connectivity |
| Asymmetric IRB | All leaves | Default Apstra IRB method |
| Type 2 / Type 5 coexistence | All leaves | Apstra option to include Type 5 host routes |
| System monitoring via AOS (telemetry) | All devices | Probes to report anomalies |
| Selective tenant interconnectivity | All border gateways | Only a subset of VNs extended |
| MACSEC at borders | QFX5700, QFX5120, QFX5130 | Encryption on DCI links for 3-Stage and Collapsed Fabric |
| Translation VNI | All border gateways | Same VLAN in Site A / Site B uses different VNIs |
| MAC mobility | All leaves | MAC host moves across data centers |
| BFD | All leaves and border gateways | Border-gateway BFD on underlay and overlay |

## Events and triggers

Testing exercised provisioning of each DCI method via Apstra; intra-VLAN / inter-VLAN / inter-VRF connectivity across data centers; MACSEC enablement via configlet; ECMP bandwidth optimization; VNI translation; VLAN and VNI-interconnect add/remove at single and all endpoints; DCI link failure, border-gateway reboot/undeploy-redeploy, process restart (routing / l2-learning / chassis-control), BGP underlay and overlay failure; MAC move across DCI; and longevity runs with continual link/process failures.

## Flow-path behavior

*Table 8 — DCI flow path (chosen path per flow type):*

| DCI method | Inter-VLAN | Intra-VLAN | Inter-VRF |
|------------|-----------|-----------|-----------|
| OTT | Type 5 stitching | Type 2 stitching | Default route to external gateway, then Type 5 to remote leaf |
| Type 2 seamless | — | Type 2 stitching | Default route to external gateway, then Type 2 from border leaf to remote leaf |
| Type 2 + Type 5 seamless | Type 5 stitching | Type 2 stitching | Default route to external gateway, then Type 5 to remote border leaf |

## Performance and scale

*Table 3 — scale per DCI method (representative, not maximum):*

| Interconnect | VLAN VNIs w/ IRB | DCI VTEPs | Stretched VNIs | Global MAC | Global MAC-IP | BGP total paths | BGP active paths |
|--------------|------------------|-----------|----------------|------------|---------------|-----------------|------------------|
| DC1↔DC2 (OTT + MACSEC) | 800 | 30 | — | 60,000 | 98,715 | 904,785 | 430,329 |
| DC1↔DC3 (Type 2 + MACSEC) | 600 | — | 500 | 16,000 | 25,409 | 191,354 | 95,680 |
| DC1↔DC4 (Type 2 + Type 5) | 1,000 | — | 800 | 27,090 | 50,953 | 412,073 | 235,558 |

For Type 2 + Type 5 seamless stitching, scale depends on the overlay next-hop limit of the QFX5130-48C. Longevity runs (8 hours) sustained multi-million-frame streams per flow across all three interconnects with **zero frame loss** on matched Tx/Rx counts.

## Results summary

The provisioning and validation of all three DCI methods showed **no anomalies in terms of traffic loss**. Key observations:

1. MACSEC functionality showed no issues; traffic was encrypted end to end.
2. For Type 2 seamless stitching, extra overlay routes were advertised to the collapsed-fabric leaves; a configlet policy stopped route re-advertisement.
3. Seamless stitching **requires a logical full mesh** (eBGP) between all border-leaf gateways to prevent issues during node/link failure on a primary border leaf acting as Designated Forwarder.
4. During link failure, convergence was **under 5 seconds** for all three methods (overlay BFD improved convergence).
5. For MAC moves of ~2,000 MACs between data centers, convergence was approximately **3 seconds** for all three methods.

Overall, validation testing detected no issues, and all performance parameters were within threshold and performed as expected.

## Test non-goals

Provisioning of the underlying data centers, ISP switch configuration, SFLOW, SNMP, management VRF, and applying pristine configs were explicitly out of scope.

## Sources

- *JVD Test Report Brief: Datacenter Interconnect Design with Juniper Apstra* — JVD-DCI-MULTISITE-01-01 (juniper.net).
- Companion: [solution-overview.md](solution-overview.md), [design-guide.md](design-guide.md), [datasheet.md](datasheet.md).
