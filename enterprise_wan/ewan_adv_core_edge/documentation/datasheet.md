# JVD Datasheet — Enterprise WAN Advanced Core and Edge Services

> Quick-reference datasheet for the **Enterprise WAN Advanced Core and Edge
> Services** Juniper Validated Design (`ewan-adv-core-edge-svc-01`). Critical
> facts only; for depth see the published JVD on juniper.net and the companion
> docs in this folder.

## At a glance

An MPLS-based enterprise WAN backbone that delivers EVPN-VPWS, EVPN-ELAN, and
EVPN Type-5 (IP-VRF) services at scale over a mixed SR + LDP transport, with
MACsec encryption and BGP-FlowSpec DDoS protection. EVPN + Segment Routing
replace legacy L3VPN, L2VPN, Martini L2 circuits, and VPLS with a single unified
service protocol.

| | |
|---|---|
| **JVD** | Enterprise WAN Advanced Core and Edge Services — `ewan-adv-core-edge-svc-01` |
| **Track** | Enterprise WAN (EWAN) |
| **Architecture** | MPLS backbone; PE WAN-edge + PTX core/route-reflector; EVPN-MPLS unified service overlay |
| **Transport** | OSPF underlay; Segment Routing + LDP coexistence via SR Mapping Server; TI-LFA; BFD-triggered FRR; BGP-PIC edge; ECMP N+1 |
| **Services** | EVPN-VPWS (E-Line), EVPN-FXC, EVPN-ELAN (Type 2/3 & Type 5), EVPN Type-5 L3 (IP-VRF) |
| **Security** | MACsec (core links); BGP FlowSpec (RFC 8955) DDoS; unicast RPF; stateless firewall filters |
| **Validation** | 132 test cases; 2,700 EVPN instances per WAN edge; SH + all-active MH across all service types |
| **Min. validated software** | Junos OS / Junos OS Evolved **23.4R2** (P routers 23.4R2.2-EVO) — see juniper.net for the current validated matrix |

## Device roles

| Role | In the network |
|---|---|
| **WAN Edge (PE)** | Terminates CE connections; hosts EVPN-VPWS / ELAN / Type-5 services, HQoS, IRB gateways, MACsec, DDoS filters. |
| **Core / P router** | SR-MPLS backbone transport between WAN edges; also the **iBGP route reflectors**; runs the SR Mapping Server for LDP/SR interworking. |
| **L2-mode helper switch** | ACX7100-48L or MX480 configured as an L2 switch to validate dual-homed CE connectivity. |

## Featured platforms

Minimum validated software per role. The JVD is re-validated on newer releases
through ongoing regression; for the **current** validated platform + software
matrix, see the published JVD page on juniper.net.

| Role | Device(s) | DUT? | Min. validated software |
|---|---|---|---|
| WAN Edge 1 | MX304 | **DUT** | Junos OS 23.4R2 |
| WAN Edge 2 | MX10004 (LC480 / LC9600) | Helper | Junos OS 23.4R2 |
| WAN Edge 3 | ACX7509 | **DUT** | Junos OS Evolved 23.4R2 |
| WAN Edge 4 | ACX7100-48L | **DUT** | Junos OS Evolved 23.4R2 |
| Core / P1 (RR1) | PTX10003-80C | Helper | Junos OS Evolved 23.4R2.2 |
| Core / P2 (RR2) | PTX10001-36MR | Helper | Junos OS Evolved 23.4R2.2 |

The MX and ACX platforms feature embedded MACsec across the portfolio.

## Protocols

**Underlay / transport**
- OSPF (single area)
- Segment Routing (SR-MPLS) with OSPF; SRGB
- MPLS LDP (legacy transport, coexisting with SR)
- LDP/SR interworking via **SR Mapping Server (SRMS)** on P-routers
- TI-LFA (link/node protection); LFA/FRR; BFD
- BGP-PIC edge (`routing-options protect core`); BGP multipath allow-protection (ECMP N+1)

**Overlay / services**
- EVPN-VPWS (E-Line, point-to-point); single-homed + all-active multihomed (ESI LAG)
- EVPN-FXC (Flexible Cross-Connect, multi-AC); all-active multihomed
- EVPN-ELAN (multipoint L2); VLAN-based and VLAN-bundle; Type 2/3 and Type 5; SH + MH
- EVPN Type-5 (L3 / IP-VRF); IRB gateway + **IP Virtual Gateway** (replaces VRRP for dual-homing)

**Routing & control plane**
- iBGP overlay (EVPN + inet flow families) to redundant PTX route reflectors
- BGP FlowSpec (family inet flow) for dynamic DDoS filter injection

**High availability**
- EVPN all-active multihoming (ESI LAG); designated forwarder
- TI-LFA fast reroute; BFD-triggered FRR; BGP-PIC edge; ECMP N+1

**Quality of service**
- Hierarchical CoS (HQoS) at the IFD level (ACX7K); 8-class model

**OAM & assurance**
- Connectivity Fault Management (CFM, 802.1ag) per VPN instance — used with all SH EVPN-VPWS
- BFD

**Security**
- MACsec (L2 encryption on core links between WAN Edge and P nodes)
- BGP FlowSpec (RFC 8955) — integrates with Corero / Netscout DDoS complexes
- Unicast RPF (strict/loose); stateless firewall filters (accept / policer / reject)

## Services & use cases

The JVD delivers a unified EVPN service portfolio. A **use case** composes:
*connectivity intent* (what is connected) × *service* (EVPN service type) ×
*homing* (single vs all-active multihomed) × *security* (MACsec / FlowSpec).

### Services

| Service type | What it delivers | Means of delivery |
|---|---|---|
| E-Line (point-to-point L2) | Branch-to-HQ / site-to-site L2 | EVPN-VPWS, EVPN-FXC |
| E-LAN (multipoint L2) | Multi-site L2 broadcast domain | EVPN-ELAN (VLAN-based / VLAN-bundle, Type 2/3) |
| L3 VPN (IP) | Routed site interconnect / DC gateway | EVPN Type-5 with IRB + IP Virtual Gateway |

### Intent-based use cases

| Connectivity intent | Services | Homing | Security |
|---|---|---|---|
| Branch-to-HQ L2 | EVPN-VPWS, EVPN-FXC | SH or A/A MH | MACsec core + CFM |
| Multi-site campus LAN | EVPN-ELAN (Type 2/3) | SH or A/A MH | MACsec core |
| Campus-to-DC L3 | EVPN Type-5 + IRB / IP Virtual Gateway | Dual-homed (IP VGW) | MACsec + uRPF |
| Cloud/DC gateway | EVPN Type-5, EVPN-ELAN Type 5 | A/A MH | FlowSpec DDoS + uRPF |
| Legacy migration | EVPN-MPLS over SR+LDP | — | SR Mapping Server interworking |

These compose the JVD's validated scenarios across **132 test cases**.

## Design concepts

| Area | What the JVD covers |
|---|---|
| **Underlay & transport** | OSPF + SR-MPLS; LDP/SR coexistence via SRMS; TI-LFA; BGP-PIC edge; ECMP N+1 |
| **Overlay & service delivery** | EVPN unified service (VPWS / ELAN / Type-5); IRB + IP Virtual Gateway for L3 |
| **Routing & control plane** | iBGP to redundant PTX route reflectors; EVPN + FlowSpec families |
| **High availability** | All-active ESI multihoming; LFA/FRR; BFD-triggered fast failover |
| **Quality of service** | Hierarchical CoS (HQoS) at IFD level on ACX7K |
| **Security** | MACsec core encryption; BGP FlowSpec DDoS; unicast RPF; stateless filters |

## References

- **JVD page (juniper.net):** [EWAN Advanced Core Edge JVD](https://www.juniper.net/documentation/us/en/software/jvd/jvd-ewan-adv-core-edge-svc-01/index.html)
- **Validated Designs index:** [juniper.net/documentation/validated-designs](https://www.juniper.net/documentation/validated-designs/)
- **JVD Portal:** [juniper.github.io/jvd/portal](https://juniper.github.io/jvd/portal/) (Discover / Learn / Design / Build)
- **Solution Overview:** [sol-overview-ewan-adv-core-edge-svc-01.pdf](https://www.juniper.net/documentation/us/en/software/jvd/sol-overview-ewan-adv-core-edge-svc-01.pdf)
- **Test Report Brief:** [test-report-brief-ewan-adv-core-edge-svc-01.pdf](https://www.juniper.net/documentation/us/en/software/jvd/test-report-brief-ewan-adv-core-edge-svc-01.pdf)
- **Configs & snips:** [GitHub — ewan_adv_core_edge](https://github.com/Juniper/jvd/tree/main/enterprise_wan/ewan_adv_core_edge/configuration)
