> Faithful markdown conversion of the published PDF:
> [JVD Test Report Brief: Metro Ethernet Business Services (03-01)](https://www.juniper.net/documentation/us/en/software/jvd/test-report-brief-metro-ebs-03-01.pdf).
> The PDF on juniper.net is the source of truth. Exhaustive per-event convergence
> tables are condensed to category summaries; see the published document for full results.

# JVD Test Report Brief: Metro Ethernet Business Services

**Version:** test-report-brief-metro-ebs-03-01 (April 2024)

## Introduction

This Juniper Validated Design testing focused on evaluating the design of Metro Ethernet Business Services, specifically for E-Line/ELAN/E-Access metro services based on a next-generation Seamless Segment Routing transport infrastructure, incorporating ACX7024 (DUT), ACX7100-48L (DUT), MX204, ACX5448, and ACX710 as access nodes. The ACX7100-32C (DUT) and ACX7509 (DUT) platforms support lean edge solutions, offering connectivity options into cloud compute complexes. The MX304 (DUT) supports multiservices edge (MSE) functionality to facilitate complex connectivity and Internet access. PTX10001-36MR supports core and peering roles.

The solution delivers the integration of traditional metro ring architectures with multi-instance ISIS, Flex-Algo Prefix Metric (FAPM) into NG SR-MPLS metro fabrics leveraging inter-domain transport class and Inter-AS BGP-CT with end-to-end multi-domain service mapping. Connectivity options for port (EPL) and VLAN (EVPL) IEEE 802.1q/QinQ based EVCs supporting end-to-end active-active highly available services including EVPN-VPWS/FXC/EVPN-ELAN and co-existing with traditional VPN services including multi-site VPLS, hot-standby L2Circuit, L2VPN and L3VPN with DIA (Dedicated Internet Access). Legacy static PWs are migrated to an Anycast Floating PW (AFPW) solution, leveraging Anycast-SID for L2 QinQ connectivity. Layer 2 services include E-OAM performance monitoring.

## Platforms Tested

| Role | Platform | OS |
|------|----------|-----|
| Access Node AN1 | MX204 | Junos 23.2R2 |
| Access Node AN2 | ACX5448 | Junos 23.2R2 |
| Access Node AN3 (DUT) | ACX7100-48L | EVO 23.2R2 |
| Access Node AN4 | ACX710 | Junos 23.2R2 |
| Aggregation AG1.1, AG1.2 | ACX7100-32C | EVO 23.2R2 |
| Metro Edge Gateway MEG1 (DUT) | ACX7100-32C | EVO 23.2R2 |
| Metro Edge Gateway MEG2 (DUT) | ACX7509 | EVO 23.2R2 |
| Core Router CR1, CR2 | PTX10001-36MR | EVO 23.2R2 |
| Multiservice Edge MSE1, MSE2 (DUT) | MX304 | Junos 23.2R2 |
| Metro Distribution Router MDR1 | ACX7509 | EVO 23.2R2 |
| Metro Distribution Router MDR2 | MX10003 | Junos 23.2R2 |
| Metro Access MA2, MA4, MA5 | MX204 | Junos 23.2R2 |
| Metro Access MA3 | ACX7100-48L | EVO 23.2R2 |
| Metro Access MA1.1, MA1.2 (DUT) | ACX7024 | EVO 23.2R2 |
| UNI-A1, UNI-B1 | ACX5448 | Junos 23.2R2 |
| MEC switches | QFX5110-48S | Junos 23.2R2 |

**Qualification:** Junos OS Release 23.2R2 and Junos OS Evolved Release 23.2R2.

## Scale and Service Details

Key DUT scale numbers (services per device):

| Feature | AN3 (ACX7100-48L) | MEG1 (ACX7100-32C) | MEG2 (ACX7509) | MSE1/2 (MX304) | MA1.1/1.2 (ACX7024) |
|---------|-------------------|--------------------|----|----|----|
| EVPN-VPWS SH | 200 | — | — | — | — |
| EVPN-FXC SH (vlan-unaware) | 500 | — | — | 500 | — |
| EVPN-FXC MH (vlan-aware) | — | 50 | 50 | — | 50 |
| EVPN-VPWS A/A MH | 1,400 | 1,000 | 1,000 | — | 400 |
| EVPN-ELAN MH (vlan-bundle) | 200 | 200 | 200 | — | — |
| EVPN-ELAN MH (vlan-based) | 100 | 100 | 100 | — | 100 |
| EVPN-ETREE | — | — | — | 1,000 | — |
| EVPN Type-5 | 50 | 50 | 50 | 50 | — |
| EVPN Anycast IRB | 25 | 25 | 25 | 25 | — |
| Floating PW | — | — | — | 100 | 100 |
| L2Circuit Hot Standby | 1,000 | 1,000 | 1,000 | — | — |
| VPLS | 300 | 200 | 100 | — | 200 |
| L3VPN (BGPv4/v6/OSPF) | 100 | — | — | 1,100 | — |
| CFM UP MEP | 1,000 | — | — | — | — |

Route/FIB scale: AN3 ~31K BGP / ~65K FIB; MSE ~113K BGP / ~966K FIB.

## Convergence Results Summary

> Full per-event convergence tables are in the published PDF. Summary below.

### Metro Fabric (Intra-AS)

Services tested: EVPN-VPWS, EVPN-ELAN, L2Circuit, L3VPN (color-aware and color-agnostic).

| Service | Typical convergence | Worst case |
|---------|-------------------|------------|
| EVPN-VPWS | 0–1 ms | ~50 ms (AG-MEG link event) |
| EVPN-ELAN | 0–3 ms | ~87 ms |
| L2Circuit | 0–5 ms | ~2.9 s (hot-standby manual failover) |
| L3VPN | 0–3 ms | — |

### Metro Multi-Ring (Intra-AS)

Services tested: BGP-VPLS, EVPN-ETREE, Floating PW, L3VPN.

| Service | Typical convergence | Worst case |
|---------|-------------------|------------|
| BGP-VPLS | 0–23 ms | ~115 ms (inter-ring MA-MA) |
| EVPN-ETREE | 0–49 ms | ~178 ms (inter-ring MA-MA) |
| Floating PW | 0–37 ms | ~67 ms |
| L3VPN | 0–50 ms | — |

### End-to-End Inter-AS

Services spanning fabric + multi-ring across BGP autonomous systems.

| Service | Typical convergence | Worst case |
|---------|-------------------|------------|
| EVPN-VPWS | 0–55 ms | — |
| EVPN-ELAN | 0–13 ms | ~1,100 ms (ESI LAG disable) |
| L2VPN | 0–39 ms | — |
| VPLS | 0–88 ms | — |
| L3VPN | 0–50 ms | — |
| MEG-MEC events | 232–915 ms | CE-facing (DLNH + ELP recommended) |

## High-Level Features Tested

**Common features:**
- Seamless SR-MPLS with TI-LFA
- Flexible Algorithm with ASLA
- Co-existence of SR-MPLS BGP-LU and BGP-CT inter-AS
- End-to-end color-aware traffic steering (network slicing)
- Intra-domain Transport Class tunneling with service mapping
- Inter-domain color awareness with BGP Classful Transport
- Color-aware and color-agnostic path selection for all services
- Intent-based routing with delay and TE color mapping
- Strict and Cascade resolution schemes

**Metro Fabric features:**
- Lean Edge services aggregation
- Metro Edge Gateway with MEC interconnectivity
- Optimized forwarding over 2-stage MPLS fabric
- EVPN-FXC (aware + unaware), EVPN-VPWS, EVPN-ELAN
- L2Circuit, L2VPN, BGP-VPLS
- DIA: L3VPN, EVPN Type-5
- All-Active ESI LAG (3×PE)
- Active-Active and Hot-Standby services
- Policer scale

**Metro Ring features:**
- Multi-Instance ISIS (blue and green rings)
- FAPM leaking across ISIS instances
- Intra-domain Transport Class service mapping
- Floating PW with Anycast-SID
- EVPN-ETREE, EVPN-FXC, EVPN-VPWS, EVPN-ELAN, L2Circuit, L2VPN, BGP-VPLS
- Local Switching (LSW) for EVPN-VPWS and L2Circuit
- L3VPN with Internet access

## Traffic Methodology

Custom IMIX: 64B (weight 3), 128B (weight 16), 256B (weight 6). Per-service traffic loads tested with aggregate FPS per service type and 512-byte fixed-size validation streams.

## Event Testing

- Restart/kill of critical Junos/EVO processes
- Device reboot impact assessment
- Interface flap events
- Configuration deletion/addition for node/network stability
- Protocol session clearing

## Known Limitations

- DLNH and ELP for EVPN A/A multi-homing: supported on MX; ACX7000 targets 24.3R1-EVO
- BGP-PIC (preserve-nexthop-hierarchy): supported on MX; ACX7000 targets 24.2R1-EVO
- BGP-CT validated on all DUTs; not required for color-agnostic deployments
- Simultaneous ECMP + FRR on ACX7000: planned for 24.1R1-EVO
- EVPN-MPLS recursive route underlay flap: resolved with preserve-nexthop-hierarchy + multipath-resolve

---

## Sources

- Published PDF: [test-report-brief-metro-ebs-03-01.pdf](https://www.juniper.net/documentation/us/en/software/jvd/test-report-brief-metro-ebs-03-01.pdf)
- Companion docs: [`design-guide.md`](design-guide.md), [`solution-overview-03-01.md`](solution-overview-03-01.md), [`test-report-brief-03-03.md`](test-report-brief-03-03.md)
- Configs: [`../configuration/conf/`](../configuration/conf/)
