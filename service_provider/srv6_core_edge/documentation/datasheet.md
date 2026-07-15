# JVD Datasheet — SP Core and Edge SRv6

> Quick-reference datasheet for the **SP Core and Edge SRv6** Juniper Validated
> Design (`jvd-sp-core-edge-srv6-01-01`, Phase 1). Critical facts only; for depth
> see the published JVD on juniper.net and the companion docs in this folder.

## At a glance

A service-provider core and edge that transports L3 and L2 business services over
an **SRv6 µSID (NEXT-CSID)** data plane with **IS-IS Flexible Algorithm**
transport. SRv6 replaces MPLS/LDP/RSVP with IPv6 encapsulation, enabling locator
summarization across domains, multiple transport planes (Flex-Algo), and unified
encapsulation end to end.

| | |
|---|---|
| **JVD** | SP Core and Edge SRv6 — `jvd-sp-core-edge-srv6-01-01` (Phase 1) |
| **Track** | Service Provider — Core & Edge |
| **Architecture** | Two-region SP core/edge (AS 65001 / Area 1000 and AS 65000 / Area 0000), IS-IS L2 per region + inter-AS BGP Option C; MSE in a BGP-only domain |
| **Transport** | SRv6 µSID over IS-IS L2; Flex-Algo FA-0 (IGP) / FA-128 (delay) / FA-129 (TE); TI-LFA + MLA; locator summarization; Transport Classes |
| **Services** | GRT (Internet), L3VPN (µDT4/µDT6/µDT46), EVPN E-Line / VPWS (µDX2) |
| **Addressing** | IPv6-only underlay (LLA on links); SRv6 locators from 5f00::/16 (RFC 9602); IPv4 only inside VPNs |
| **Validation** | 100+ test cases per DUT; scale to 8-9K L3VPN, 3.3-4K EVPN-VPWS, 9K locators/µA |
| **Min. validated software** | Junos OS / Junos OS Evolved **24.4R2** — see juniper.net for the current validated matrix |

## Device roles

| Role | In the network |
|---|---|
| **Edge (PE)** | Terminates GRT / L3VPN / EVPN E-Line services; PE-CE direct or IRB attachment. |
| **Core Router (CR)** | SRv6 IS-IS core transit; also the redundant **BGP route reflectors**. |
| **Border Router (BR)** | Inter-AS Option C between regions; SRv6 locator summarization at the domain boundary. |
| **Multi-Service Edge (MSE)** | Service termination in a BGP-only domain; uses SRv6 **dynamic tunnels** for SID resolution without an IS-IS locator TLV. |
| **CPE (helper)** | Customer premises; virtual-router attachment toward the PE/MSE. |

## Featured platforms

Devices under test (Phase 1). For the current validated platform + software
matrix, see the published JVD page on juniper.net.

| Role | Device(s) | Chip | Min. validated software |
|---|---|---|---|
| Edge (EDGE1/2) | MX480 | Trio 4 (EA) | Junos OS 24.4R2 |
| Edge (EDGE3) | MX480 | Trio 5 (ZT) | Junos OS 24.4R2 |
| Core Router (CR1) | MX10004 | Trio 6 (YT) | Junos OS 24.4R2 |
| Core Router (CR2) | MX2010 | Trio 5 (ZT) | Junos OS 24.4R2 |
| Border Router (BR1) | PTX10002-36QDD | Express 5 (BX) | Junos OS Evolved 24.4R2 |
| Border Router (BR2) | MX304 | Trio 6 (YT) | Junos OS 24.4R2 |
| Multi-Service Edge (MSE1/2) | MX480, MX304 | Trio 5/6 | Junos OS 24.4R2 |
| CPE (helper) | MX240 | — | Junos OS 24.4R2 |

## Protocols

**Underlay / transport**
- SRv6 µSID (NEXT-CSID) data plane; locators from 5f00::/16 (RFC 9602)
- IS-IS Level 2 (wide metrics, IPv6 unicast topology, LLA links)
- Flexible Algorithm: FA-0 (IGP), FA-128 (delay, dynamic via TWAMP-Light), FA-129 (TE)
- Per-Flex-Algo µN (node) and µA (adjacency) SIDs; ASLA TE/delay metrics; FAPM
- TI-LFA (link + node, soft node-protection) + Micro-Loop Avoidance (MLA)
- BFD (adjacency) + micro-BFD (LAG); increased MTU (9192 / 9106)
- SRv6 locator summarization at domain boundaries; Transport Classes (color ↔ Flex-Algo)

**Inter-domain transport**
- Inter-AS BGP Option C (multi-hop eBGP, next-hop unchanged)
- SRv6 locator + loopback summary exchange between ASes, redistributed into IS-IS
- SRv6 dynamic tunnels (SID resolution over non-IS-IS routes, for MSE)

**Overlay / services**
- GRT — IPv4/IPv6 Internet via dynamic µDT46 SID (FA-0)
- L3VPN (SAFI 128) — per-VRF µDT4/µDT6/µDT46 SID (static or dynamic); per-VRF and per-prefix Flex-Algo mapping
- EVPN E-Line / VPWS (µDX2) — single-active and all-active multihoming; per-service Flex-Algo mapping
- L3VPN PE-CE via direct interface or IRB gateway

**Routing & control plane**
- iBGP with CR route reflectors; multi-AFI (IPv4/IPv6 unicast, VPN-IPv4/IPv6, EVPN, RT-constraint)
- RFC 9252 BGP SRv6 services; RFC 8950 IPv6 next-hop for IPv4 NLRIs; TCP-AO on all sessions

**OAM & assurance**
- TWAMP-Light (dynamic link-delay measurement feeding FA-128)
- BFD / micro-BFD

## Services & use cases

A **use case** composes: *service* (GRT / L3VPN / EVPN E-Line) × *transport plane*
(Flex-Algo FA-0 / FA-128 / FA-129) × *SID assignment* (static or dynamic) ×
*resiliency* (single-active / all-active multihoming, TI-LFA).

### Services

| Service | What it delivers | Means of delivery |
|---|---|---|
| GRT (Internet) | IPv4/IPv6 global reachability | µDT46 SID over FA-0 |
| L3VPN | IPv4/IPv6 VPN, per-VRF SLA plane | µDT4/µDT6/µDT46 SID, per-VRF Flex-Algo |
| EVPN E-Line (VPWS) | Point-to-point L2 | µDX2 SID, SA / AA multihoming |

### Intent-based use cases

| Intent | Service | Transport plane | Resiliency |
|---|---|---|---|
| Internet access | GRT | FA-0 (IGP) | TI-LFA |
| VPN, best-effort | L3VPN | FA-0 | TI-LFA |
| VPN, low-delay | L3VPN | FA-128 (delay) | TI-LFA |
| VPN, traffic-engineered | L3VPN | FA-129 (TE) | TI-LFA |
| L2 point-to-point | EVPN E-Line | FA-0/128/129 | SA or AA multihoming |
| Cross-region service | any | inter-AS Option C | locator summarization + dynamic tunnels |

## Design concepts

| Area | What the JVD covers |
|---|---|
| **SRv6 underlay** | µSID (NEXT-CSID); IS-IS L2 + Flex-Algo; per-FA locators; addressing scheme (5f00::/16) |
| **Traffic planes** | FA-0 (IGP) / FA-128 (delay) / FA-129 (TE); per-VRF and per-prefix service mapping |
| **Resiliency** | TI-LFA (link/node) + MLA; BFD/micro-BFD; sub-50 ms restoration |
| **Inter-domain** | Inter-AS Option C; locator + loopback summarization; SRv6 dynamic tunnels |
| **Control plane** | iBGP RR (CR nodes); multi-AFI SRv6 services (RFC 9252); TCP-AO |
| **Assurance** | TWAMP-Light dynamic delay measurement feeding the delay Flex-Algo |

## References

- **JVD page (juniper.net):** [SP Core and Edge SRv6 JVD](https://www.juniper.net/documentation/us/en/software/jvd/jvd-sp-core-edge-srv6-01-01/index.html)
- **Validated Designs index:** [juniper.net/documentation/validated-designs](https://www.juniper.net/documentation/validated-designs/)
- **JVD Portal:** [juniper.github.io/jvd/portal](https://juniper.github.io/jvd/portal/) (Discover / Learn / Design / Build)
- **Solution Overview:** [sol-overview-sp-core-edge-srv6-01-01.pdf](https://www.juniper.net/documentation/us/en/software/jvd/sol-overview-sp-core-edge-srv6-01-01.pdf)
- **Test Report Brief:** [test-report-brief-sp-core-edge-srv6-01-01.pdf](https://www.juniper.net/documentation/us/en/software/jvd/test-report-brief-sp-core-edge-srv6-01-01.pdf)
- **Configs & snips:** [GitHub — srv6_core_edge](https://github.com/Juniper/jvd/tree/main/service_provider/srv6_core_edge/configuration)
