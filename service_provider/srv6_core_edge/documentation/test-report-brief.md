> Faithful markdown conversion of the published PDF:
> [JVD Test Report Brief: SP Core-Edge SRv6](https://www.juniper.net/documentation/us/en/software/jvd/test-report-brief-sp-core-edge-srv6-01-01.pdf).
> The PDF on juniper.net is the source of truth. Exhaustive per-event tables are
> condensed to summaries; see the published document for full results.

# JVD Test Report Brief: SP Core-Edge SRv6

## Introduction

This JVD validates an SRv6 µSID core/edge for the transport of L3 and L2 business services in a service-provider network, focused on GRT, L3VPN, and EVPN E-Line (VPWS) over SRv6 Flex-Algo (Phase 1, without SRv6-TE).

## Platforms Tested

### Table 1: Devices Under Test

| Role | Platform | DUT/Helper | Software |
|------|----------|-----------|----------|
| EDGE1 | MX480 (Trio 4, EA) | DUT | Junos OS 24.4R2 |
| EDGE2 | MX480 (Trio 4, EA) | DUT | Junos OS 24.4R2 |
| EDGE3 | MX480 (Trio 5, ZT) | DUT | Junos OS 24.4R2 |
| CR1 | MX10004 (Trio 6, YT) | DUT | Junos OS 24.4R2 |
| CR2 | MX2010 (Trio 5, ZT) | DUT | Junos OS 24.4R2 |
| BR1 | PTX10002-36QDD (Express 5, BX) | DUT | Junos OS Evolved 24.4R2 |
| BR2 | MX304 (Trio 6, YT) | DUT | Junos OS 24.4R2 |
| MSE1 | MX480 (Trio 5, ZT) | DUT | Junos OS 24.4R2 |
| MSE2 | MX304 (Trio 6, YT) | DUT | Junos OS 24.4R2 |
| CPE1–CPE4 | MX240 | Helper | Junos OS 24.4R2 |
| Traffic generator | IXIA | Helper | IxOS 9.3.0 |

**Qualification:** Junos OS Release 24.4R2 and Junos OS Evolved Release 24.4R2.

## Scale and Performance Data

### Table 2: Configured Test Scale

| Feature | Configured scale |
|---------|------------------|
| Node SIDs (µN) | 3,000 |
| Adjacency SIDs (µA) | 9,000 |
| SRv6 Locators | 3,000 |
| EVPN-VPWS instances | 3,300 |
| SRv6-L3VPN (µDT4/µDT6/µDT46) | 9,000 |

## Traffic Profile

L3VPN and EVPN-VPWS streams tested per Flex-Algo (FA-0 / FA-128 / FA-129), static and dynamic SID, single-active and all-active multihoming. 128-byte frames; per-stream loads from 5,000 fps up to ~276,000 fps (FA-0 L3VPN aggregate).

## Convergence Test Results

### Table 4: Convergence Summary (milliseconds)

> Condensed — worst-case per event class. See the published PDF for the full per-event, per-Flex-Algo table.

| Event class | EVPN-VPWS Single-Active MH | EVPN-VPWS Active-Active MH |
|-------------|---------------------------|---------------------------|
| Core link disable (e.g. EDGE3–CR2) | ~2.4–3.7 ms | ~0–3.3 ms |

Link failure and restoration are well within the **≤ 50 ms** target, achieved by SRv6 TI-LFA with backup core paths preprogrammed in each transit node's PFE.

## Features Tested

**Transport:** SRv6 µSID (NEXT-CSID); IS-IS L2 + Flex-Algo (FA-0 IGP, FA-128 delay via TWAMP-Light, FA-129 TE); TI-LFA (link/node) + MLA; SRv6 locator summarization; Transport Classes; inter-AS Option C.

**Services:** GRT (µDT46, FA-0); L3VPN (µDT4/µDT6/µDT46, static + dynamic SID, per-VRF and per-prefix Flex-Algo mapping, SRv6 dynamic tunnels for MSE); EVPN E-Line / VPWS (µDX2, single-active and all-active multihoming); L3VPN with direct PE-CE and IRB PE-CE.

**Control plane:** iBGP with CR route reflectors; multi-AFI (IPv4/IPv6 unicast, VPN-IPv4/IPv6, EVPN, RT-constraint); TCP-AO; RFC 8950 next-hop encoding.

## Event Testing (negative triggers)

- Restart / kill of critical Junos / Junos OS Evolved processes
- Device reboot; configuration restore
- Single link and single node failure resiliency
- IS-IS / BGP convergence under scale

## Known Limitations (test non-goals)

SRv6-TE; IS-IS multi-instance (Instance ID TLV #7); EVPN E-LAN / EVPN-VPWS PWHT; MPLS↔µSRv6 migration; classic SID / µSID co-existence; UPA; FBF/CBF; CoS; network slicing; PCEP; MVPN; HA (GR/GRES/NSR); BGP-only IPv6 fabrics.

---

## Sources

- Published PDF: [test-report-brief-sp-core-edge-srv6-01-01.pdf](https://www.juniper.net/documentation/us/en/software/jvd/test-report-brief-sp-core-edge-srv6-01-01.pdf)
- Companion docs: [`design-guide.md`](design-guide.md), [`solution-overview.md`](solution-overview.md), [`datasheet.md`](datasheet.md)
- Configs: [`../configuration/conf/`](../configuration/conf/)
