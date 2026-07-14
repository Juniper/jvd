# JVD Datasheet — Metro Ethernet Business Services

> Quick-reference datasheet for the **Metro Ethernet Business Services (Metro EBS)**
> Juniper Validated Design (`metro-ebs-03-01` / `metro-ebs-03-03`). Critical facts
> only; for depth see the published JVD on juniper.net and the companion docs in
> this folder.

## At a glance

Metro Ethernet Business Services validates a dense L2/L3 Carrier Ethernet
service portfolio across intra-domain and inter-AS regions, over a segment-routing
Cloud Metro transport foundation composed of metro access multi-ring topologies
and a two-stage metro fabric spine-and-leaf design.

| | |
|---|---|
| **JVD** | Metro Ethernet Business Services — `metro-ebs-03-01` (foundation) / `metro-ebs-03-03` (platform refresh) |
| **Track** | Metro Ethernet Business Services (Metro EBS) |
| **Architecture** | Cloud Metro: two-stage metro fabric (spine/leaf) + metro access multi-ring across two autonomous systems |
| **Transport** | SR-MPLS underlay over multi-instance IS-IS; TI-LFA; Flexible Algorithm with ASLA; color-aware Transport Classes; inter-AS BGP-LU + BGP-CT |
| **Service families** | E-Line, E-LAN, E-Tree, E-Access, Internet Access (L3VPN / EVPN Type-5) |
| **Validation** | 20+ discrete service scenarios; convergence, resiliency, scale, and performance across all services and domains |
| **Min. validated software** | Junos OS / Junos OS Evolved **23.2R2** (03-01) and **24.2R2S1** (03-03) — see juniper.net for the current validated matrix |

## Device roles

| Role | In the network |
|---|---|
| **Access Node (AN)** | Terminates customer UNIs at the metro edge — fabric access leaf. Supports EVPN-VPWS, EVPN-FXC, EVPN-ELAN, L2Circuit, L3VPN. |
| **Aggregation / Lean Spine (AG)** | Spine of the two-stage metro fabric; aggregates access leaves; pure transport. |
| **Metro Edge Gateway (MEG)** | Border-leaf; extends advanced L2/L3 services, Multi-access Edge Compute (MEC) interconnect, route reflector for fabric. |
| **Multiservice Edge (MSE)** | High-scale L2/L3 service termination — PWHT, Floating PW, EVPN-ETREE, Dedicated Internet Access (Internet-VRF), route reflector. |
| **Metro Distribution Router (MDR)** | Inter-ring distribution across the multi-ring access domain; transport route reflector (BGP-LU, BGP-CT). |
| **Core Router (CR)** | SR-MPLS core and peering between metro domains and the wider network. |
| **Metro Access (MA)** | Multi-ring access node; services include EVPN-VPWS, EVPN-FXC, EVPN-ELAN, Floating PW, BGP-VPLS, local switching. |

## Featured platforms

Minimum validated software per role. The JVD is re-validated on newer releases
through ongoing regression; for the **current** validated platform + software
matrix, see the published JVD page on juniper.net.

### 03-01 (Foundation — Junos/EVO 23.2R2)

| Role | Device(s) | Min. validated software |
|---|---|---|
| Access Node (AN) | ACX7100-48L (DUT), MX204, ACX5448, ACX710 | 23.2R2 / 23.2R2-EVO |
| Aggregation (AG) | ACX7100-32C | 23.2R2-EVO |
| Metro Edge Gateway (MEG) | ACX7100-32C (DUT), ACX7509 (DUT) | 23.2R2-EVO |
| Multiservice Edge (MSE) | MX304 (DUT) | 23.2R2 |
| Metro Distribution Router (MDR) | MX10003, ACX7509 | 23.2R2 / 23.2R2-EVO |
| Core Router (CR) | PTX10001-36MR | 23.2R2-EVO |
| Metro Access (MA) | ACX7024 (DUT), ACX7100-48L, MX204 | 23.2R2-EVO / 23.2R2 |

### 03-03 (Platform Refresh — Junos/EVO 24.2R2S1)

| Role | New Platform | Replaces | Min. validated software |
|---|---|---|---|
| Metro Edge Gateway (MEG) | **ACX7348** (DUT) | ACX7100-32C, ACX7509 | 24.2R2S1-EVO |
| Multiservice Edge (MSE) | **MX10004 + LC9600** (DUT) | MX304 | 24.2R2S1 |
| Metro Distribution Router (MDR) | **PTX10001-36MR** | MX10003, ACX7509 | 24.2R2S1-EVO |

All other roles (AN, AG, CR, MA) re-validated at 24.2R2S1 with the same platforms.

The primary devices under test — ACX7024, ACX7100, ACX7348, ACX7509, MX304, MX10004 — are
MEF 3.0-certified products on the MEF registry (a product-level certification,
separate from the JVD validation).

## Protocols

**Underlay / transport**
- IS-IS (multi-instance across fabric + ring domains)
- Segment Routing MPLS (SR-MPLS), SRGB
- TI-LFA (link / node protection); BFD (300 ms detection)
- Flexible Algorithm with Application Specific Link Attributes (ASLA)
- Flex-Algo Prefix Metric (FAPM) for inter-domain leaking
- Transport Classes — Gold (delay), Bronze (TE), Best-Effort (IGP); cascade resolution

**Inter-domain transport**
- BGP Labeled Unicast (BGP-LU) for seamless SR-MPLS inter-IGP and inter-AS
- BGP Classful Transport (BGP-CT)
- Color-aware traffic steering; service mapping to transport classes
- Strict Resolution Scheme (no fallback) + Cascade (gold→bronze→best-effort)

**Overlay / services**
- EVPN-VPWS (E-Line: EPL, EVPL); single-homed and all-active multi-homed (ESI LAG, 3×PE)
- EVPN-FXC (Flexible Cross-Connect: VLAN-aware / VLAN-unaware)
- EVPN-ELAN (E-LAN: vlan-based, vlan-bundle, EP-LAN)
- EVPN-ETREE (E-Tree: hub-spoke, root/leaf)
- EVPN Type-5 (L3 Internet access via IRB)
- EVPN Anycast IRB (Virtual Gateway Address)
- Floating Pseudowire with Anycast-SID and vESI for active-active (legacy L2CKT migration)
- BGP-VPLS (multi-site L2 connectivity)
- L2VPN; L2Circuit with hot-standby; Local Switching (E-Access / E-NNI)
- L3VPN (BGPv4, BGPv6, OSPF) with Dedicated Internet Access (Internet-VRF)

**Routing & policy**
- MP-BGP (EVPN, L2VPN, VPLS, L3VPN, inet-vpn, inet6-vpn families)
- Redundant Route Reflectors (transport RR via MDR; services RR via MSE; combined via MEG)
- Community-based routing policy; BGP color-community mapping
- Route Target Constraint (RTC)

**High availability**
- EVPN multihoming (all-active ESI LAG, 3×PE); designated forwarder
- Anycast Floating PW (vESI); L2Circuit hot-standby
- TI-LFA fast reroute; PE link protection for EBGP-LU/BGP-CT

**OAM & assurance**
- Ethernet OAM / CFM (CCM, LBM, LTM); UP MEP (1,000 scale on AN3)
- Performance monitoring (frame delay, delay variation, frame loss)
- Flow Aware Transport Label (FAT-PW)
- Class of Service (deployed; QoS model included but not the testing focus)

## Services & use cases

The JVD delivers the five MEF Carrier Ethernet service types plus Layer 3 /
Internet access. A **use case** composes four dimensions: *connectivity intent*
(what is connected) × *service* (means of delivery) × *transport intent* (the
color / SLA path) × *resiliency* (homing model).

### Services

| Service type | What it delivers | Means of delivery |
|---|---|---|
| E-Line (EPL / EVPL) | Point-to-point L2 connectivity | EVPN-VPWS, L2Circuit, L2VPN |
| E-LAN (EP-LAN / EVP-LAN) | Multipoint L2 connectivity | EVPN-ELAN, BGP-VPLS |
| E-Tree (EP-Tree / EVP-Tree) | Rooted-multipoint hub-and-spoke | EVPN-ETREE |
| E-Access (Access EPL / EVPL) | Wholesale UNI-to-NNI | EVPN-VPWS LSW, L2Circuit LSW |
| Internet Access | L3 IP connectivity / DIA | L3VPN (Internet-VRF), EVPN Type-5, EVPN Anycast IRB |

### Intent-based use cases

| Connectivity intent | Services | Transport intent | Resiliency |
|---|---|---|---|
| Site-to-site (intra-fabric) | EVPN-VPWS, EVPN-FXC, EVPN-ELAN, L2Circuit | Gold / Bronze / Best-Effort | Single-homed, A/A ESI 3×PE |
| Site-to-site (inter-ring) | Floating PW, EVPN-VPWS, BGP-VPLS, L2VPN | Gold / Bronze / Best-Effort | A/A Anycast-SID vESI |
| Site-to-MEC/edge-compute | EVPN-VPWS, EVPN-ELAN, EVPN-FXC | Gold / Bronze / Best-Effort | A/A ESI via MEG |
| Multi-site LAN | EVPN-ELAN, BGP-VPLS | Gold / Bronze / Best-Effort | A/A MH |
| Hub-spoke (E-Tree) | EVPN-ETREE | Gold / Bronze / Best-Effort | Root + leaf topology |
| Wholesale handoff (E-Access) | EVPN-VPWS LSW, L2Circuit LSW | Color-agnostic | Local switching |
| Internet access / DIA | L3VPN, EVPN Type-5, EVPN Anycast IRB | Gold / Bronze / Best-Effort | Internet-VRF model |
| End-to-end inter-AS | All of the above | BGP-CT color-mapped | Cross-domain via BGP-LU/CT |

These compose the **20+ validated service scenarios** documented in the design guide.

## Design concepts

| Area | What the JVD covers |
|---|---|
| **Underlay & transport** | SR-MPLS + Flex-Algo; multi-instance IS-IS; FAPM inter-domain leaking; Transport Classes |
| **Traffic engineering & slicing** | Color-aware service mapping; Cascade resolution (gold→bronze→BE); BGP-CT for inter-AS color |
| **Metro Fabric** | 2-stage Clos (spine/leaf); EBGP underlay; MEG as border-leaf + MEC gateway |
| **Metro Multi-Ring** | Multi-instance IS-IS (blue/green); MDR for inter-ring leaking; MSE for services RR |
| **Overlay & service delivery** | Dense L2/L3 portfolio; MEF 3.0 alignment; all services color-aware + color-agnostic |
| **Routing policy & control plane** | Redundant RR strategy (transport vs services); community tagging; loop prevention; RTC |
| **High availability** | ESI LAG A/A (3×PE); Floating PW Anycast-SID; L2CKT hot-standby; TI-LFA FRR |

## References

- **JVD page (juniper.net):** [Metro EBS JVD](https://www.juniper.net/documentation/us/en/software/jvd/jvd-metro-ebs-03-01/index.html) | [03-03 update](https://www.juniper.net/documentation/us/en/software/jvd/jvd-metro-ebs-03-03/index.html)
- **Validated Designs index:** [juniper.net/documentation/validated-designs](https://www.juniper.net/documentation/validated-designs/)
- **JVD Portal:** [juniper.github.io/jvd/portal](https://juniper.github.io/jvd/portal/) (Discover / Learn / Design / Build)
- **Solution Overview:** [03-01 PDF](https://www.juniper.net/documentation/us/en/software/jvd/sol-overview-metro-ebs-03-01.pdf) | [03-03 PDF](https://www.juniper.net/documentation/us/en/software/jvd/solution-overview-metro-ebs-03-03.pdf)
- **Test Report Brief:** [03-01 PDF](https://www.juniper.net/documentation/us/en/software/jvd/test-report-brief-metro-ebs-03-01.pdf) | [03-03 PDF](https://www.juniper.net/documentation/us/en/software/jvd/test-report-brief-metro-ebs-03-03.pdf)
- **Configs & snips:** [GitHub — metro_ethernet_business_services](https://github.com/Juniper/jvd/tree/main/service_provider/metro_ethernet_business_services/configuration)
