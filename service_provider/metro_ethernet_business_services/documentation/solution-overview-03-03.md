> Faithful markdown conversion of the published PDF:
> [JVD Solution Overview: Metro Ethernet Business Services (03-03)](https://www.juniper.net/documentation/us/en/software/jvd/solution-overview-metro-ebs-03-03.pdf).
> The PDF on juniper.net is the source of truth.

# JVD Solution Brief: Metro Ethernet Business Services

**Version:** solution-overview-metro-ebs-03-03 (2025)

## Executive Summary

The Metro Ethernet Business Services (EBS) Juniper Validated Design (JVD) addresses traditional L2 Business Access and Dedicated Internet Access services while incorporating modern service delivery protocols, including EVPN-VPWS, EVPN Flexible Cross Connect, EVPN-ETREE, and EVPN-ELAN. The topology, built using the Juniper Cloud Metro portfolio, deploys an infrastructure designed to support metro access multi-ring topologies and a two-stage metro fabric spine-and-leaf design. The reference architecture is based on modern Carrier Ethernet Metro Area Networks (MAN) and takes into consideration the transformation required to facilitate diverse new services, applications, and use cases.

The new architecture, known as Cloud Metro, carries several important characteristics in the amalgamation of service and content providers. These shifting industry trends demand massive bandwidth and increase service scale while supporting more complex metro workloads. A major goal of Cloud Metro is the adaptation of cloud principles into metro networks, including the array of EVPN technologies, SR-MPLS/SRv6, and machinery to support inter-domain traffic engineering or seamless architecture across disparate networks. This is a differentiating factor that characterizes requirements for supporting any-to-any connectivity models or building infrastructures that become access agnostic while blending with virtualized network functions and devices.

The solution architecture and services proposed in the Metro EBS JVD are part of the network modernization journey, addressing challenges faced by many operators. Our modern converged network infrastructures and technologies stand ready to meet the demands of the new metro. The JVD proposes the solution blueprints to make every connection count.

## What's New in METRO-EBS-03-03?

This release of the Metro EBS JVD introduces updated hardware platforms to reflect the continued evolution of metro requirements. The updates provide higher bandwidth, throughput, and scale, while unifying the architecture on a simplified power-optimized platform set. These enhancements align with current customer deployments and prepare the metro for 400G and future service growth.

- **MSE Update:** MX10004 with the LC9600 line card replaces MX304. Provides a higher 400G/800G scale, modular service edge capabilities, and investment protection.
- **MEG Update:** ACX7348 replaces ACX7100-32C and ACX7509. Compact, high-performance metro edge platform that is MEF 3.0 certified for business services.
- **MDR Update:** PTX10001-36MR replaces the prior mix of MX10003 and ACX7509. Hyperscale density for metro data routing and DCI.

These updates simplify the platform footprint, ensure feature consistency and align with modern Cloud Metro use cases.

## Solution Overview

The Metro Ethernet Business Services JVD addresses the network modernization journey, which includes multiple developing use cases. A crucial aspect of the overall solution is enabling flexibility to support heterogeneous customer architectures within the same validated design with the following major attributes:

- Seamless Segment Routing MPLS (SR-MPLS) with Topology Independent Loop-Free Alternate (TI-LFA)
- Flexible Algorithm Application-Specific Link Attribute (ASLA)
- Co-Existence of seamless SR-MPLS, BGP-LU and BGP-CT Inter-AS solutions
- Network slicing with end-to-end color-aware traffic steering
- Intra-domain Transport Class tunneling with service mapping
- Inter-domain color awareness with BGP Classful Transport
- Services include color-aware and color-agnostic path selection
- Intent-based routing with color mapping based on Delay and TE metrics
- Color agnostic services take IGP metric paths (inet.3)
- Strict Resolution Scheme (no fallback) and Cascade Resolution Scheme (fallback gold to bronze and bronze to best effort paths)
- Alignment with MEF 3.0 standards for service characteristics and attributes

Over 20 discrete service scenarios are covered for delivering metro Ethernet services. Traditional Layer 2 VPN services are included with L2Circuit, L2VPN, and VPLS, while demonstrating coexistence with newer EVPN-VPWS, EVPN-FXC, EVPN-ELAN, and EVPN-ETREE services — over common modern Metro ring and fabric infrastructures. In addition, the Floating Pseudowire (PW) solution delivers a massive upgrade to legacy static L2Circuit by leveraging Anycast-SID with all-active virtual ESI (vESI) for active-active multi-homing. The layer 3 services are supported with traditional L3VPN, EVPN-ELAN Type 5, and EVPN integrated routing and bridging (IRB) Virtual Gateway Address (VGA) models. The high-availability services include Active-Active EVPN and Hot-Standby L2CKT.

## Platform Updates

### MX10004 with LC9600 — Multiservice Edge (MSE)

Replaces MX304 in the role of Multiservice Edge (MSE) termination for dense L2/L3 VPN termination, Dedicated Internet Access (DIA), inter-domain communications, policy/QoS, and high scale at the network edge.

Key platform features and technical differentiators:

- Powered by Juniper Trio 6 custom silicon architecture, LC9600 integrates six Juniper YT ASICs (1.6 Tbps each) for 9.6 Tbps per slot
- System capacity: 38.4 Tbps in a compact 7RU chassis when fully populated with LC9600
- High-density connectivity: 24 × QSFP56-DD (400G/100G), breakout up to 96 × 100G, with integrated MACsec and full PTP timing; ~768K queues per slot enable granular QoS
- SLA-oriented scale: Hierarchical QoS and deep queuing enable fine-grained shaping/policing per service or customer; timing accuracy supports deterministic, MEF-aligned metro behaviors
- Operational efficiency and growth: Compact 400G-ready edge reduces space and footprint, while maintaining dense throughput and scale. Trio/Junos continuity simplifies migration and automation across EVPN and traditional VPN services

### ACX7348 — Metro Edge Gateway (MEG)

Replaces ACX7100-32C and ACX7509 in the Metro Edge Gateway (MEG) role, aggregating metro access fabrics, terminating border-leaf VPN services, and providing SLA-grade business service delivery at the metro edge.

Key platform features and technical differentiators:

- Juniper Express 5 custom silicon delivering 12.8 Tbps throughput in a compact, fixed-form 1RU
- Port flexibility: 32 × QSFP28-DD (supporting 400GbE, 100GbE via breakout, and 10/25/50GbE) accommodating diverse metro optics and speeds
- MEF 3.0 certified for Carrier Ethernet business services — validated for E-Line, E-LAN, E-Tree, E-Access, and Internet Access
- MACsec on all ports with integrated IEEE 1588v2 PTP for timing-sensitive metro and mobile transport
- Low power consumption (~680 W typical) with front-to-back airflow optimized for standard metro colocation environments
- Junos OS Evolved consistency with the ACX7000 family ensures unified operational tooling, automation, and feature parity across metro roles

### PTX10001-36MR — Metro Distribution Router (MDR)

Replaces the prior mix of MX10003 and ACX7509 in the Metro Distribution Router (MDR) role, interconnecting metro rings and providing inter-domain transport.

Key platform features and technical differentiators:

- Juniper Express 5 custom silicon: 14.4 Tbps in a compact 2RU fixed-form, with 36 × QSFP28-DD ports supporting 400GbE, 100GbE, and breakout configurations
- Designed for dense metro distribution and DCI — hyperscale routing table capacity with large buffer depth for graceful traffic absorption during convergence
- SR-MPLS, IS-IS multi-instance, Flex-Algo, and BGP-CT/LU interworking validated for seamless inter-ring and inter-AS transport
- Timing: IEEE 1588v2 PTP boundary clock and MACsec on all ports
- Power-optimized: typically under 950 W, front-to-back airflow; minimal rack footprint for high-density metro colocation
- Junos OS Evolved — consistent operational model, telemetry, and automation with the rest of the Cloud Metro portfolio

## Validated Platform Summary

| Role | Platform (03-01) | Platform (03-03) | OS |
|------|-----------------|-----------------|-----|
| Access Node (AN) | MX204, ACX5448, ACX7100-48L, ACX710 | MX204, ACX5448, ACX7100-48L, ACX710 | Junos / EVO 23.2R2 |
| Aggregation (AG) | ACX7100-32C | ACX7100-32C | EVO 23.2R2 |
| Metro Edge Gateway (MEG) | ACX7100-32C, ACX7509 | **ACX7348** | EVO 24.2R1 |
| Multiservice Edge (MSE) | MX304 | **MX10004 + LC9600** | Junos 24.2R1 |
| Metro Distribution Router (MDR) | MX10003, ACX7509 | **PTX10001-36MR** | EVO 24.2R1 |
| Core Router (CR) | PTX10001-36MR | PTX10001-36MR | EVO 23.2R2 |
| Metro Access (MA) | ACX7024, ACX7100-48L, MX204 | ACX7024, ACX7100-48L, MX204 | Junos / EVO 23.2R2 |

---

## Sources

- Published PDF: [solution-overview-metro-ebs-03-03.pdf](https://www.juniper.net/documentation/us/en/software/jvd/solution-overview-metro-ebs-03-03.pdf)
- Companion docs: [`solution-overview-03-01.md`](solution-overview-03-01.md), [`design-guide.md`](design-guide.md), [`test-report-brief-03-03.md`](test-report-brief-03-03.md)
- Configs: [`../configuration/conf/`](../configuration/conf/)
