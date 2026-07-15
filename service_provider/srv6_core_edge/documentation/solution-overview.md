> Faithful markdown conversion of the published PDF:
> [JVD Solution Overview: SP Core-Edge SRv6 Phase-1](https://www.juniper.net/documentation/us/en/software/jvd/sol-overview-sp-core-edge-srv6-01-01.pdf).
> The PDF on juniper.net is the source of truth.

# JVD Solution Overview: SP Core-Edge SRv6 (Phase 1)

## Executive Summary

This JVD gives a high-level description and outlines requirements for a service-provider network using SRv6 µSID as underlying transport, incorporating requirements received from customers aiming for SRv6 µSID transport. Solution validation uses a phased approach, with each phase adding functional scope and new platforms. The scope of this SRv6 JVD phase is limited to multi-domain network transport with multiple transport planes realized via SRv6 Flex-Algo (without traffic engineering), at the services level — with particular focus on L3VPN (traditional L3VPN with SAFI 128, and EVPN Type-5 based L3VPN with SAFI 70) and L2 services (EVPN E-Line / VPWS).

## Solution Overview

**Objective:** Basic SRv6 µSID transport with services — L3VPN and EVPN E-Line with Flex-Algo and multihoming; TI-LFA/MLA with dynamic and static µA (Adj-SID); L3VPN and EVPN E-Line (VPWS) service resolution over non-IS-IS routes (SRv6 dynamic tunnels).

> **Phase-1 validated scope** (per the design guide and test report) is **GRT, L3VPN (µDT4/µDT6/µDT46), and EVPN E-Line (VPWS, µDX2)** over SRv6 Flex-Algo. Some items named in this overview (e.g. EVPN E-LAN) describe the broader multi-phase roadmap and are **test non-goals** in Phase 1.

**Architecture — topology roles:** AN (Access Node), AG (Aggregation Node), CR (Core Router), BR (Border Router), MSE (Multi-Service Edge).

### Table 1: Platform Positioning for SRv6 JVD (multi-phase roadmap)

| AN | AG | CR | BR | MSE |
|----|----|----|----|-----|
| ACX7024, ACX7024-XL, ACX7332, ACX7348, ACX7509 | ACX7100-32C, ACX7100-48L | MX (EA/YT/ZT) | BR1: PTX10002-36QDD; BR2: MX (YT/ZT) | MX (EA) |

> The AN/AG access platforms above are the roadmap positioning. The **Phase-1 devices under test** are listed in the [design guide](design-guide.md) Table 1 (MX480 / MX10004 / MX2010 / MX304 / PTX10002-36QDD).

## Key Benefits

The solution delivers SRv6 µSID-based transport architecture, including Flex-Algo Prefix Metric (FAPM) and inter-domain designs with SRv6 locator summarization and Transport Classes, with end-to-end multi-domain service mapping.

- **Scalability** — SRv6 locator summarization at domain boundaries
- **Simplicity** — one transport (SRv6) replaces LDP/RSVP; reachability via IS-IS
- **Flexibility** — multiple transport planes via Flex-Algo (FA-0 IGP, FA-128 delay, FA-129 TE)
- **Resilience** — TI-LFA + MLA for sub-50 ms restoration

---

## Sources

- Published PDF: [sol-overview-sp-core-edge-srv6-01-01.pdf](https://www.juniper.net/documentation/us/en/software/jvd/sol-overview-sp-core-edge-srv6-01-01.pdf)
- Companion docs: [`design-guide.md`](design-guide.md), [`test-report-brief.md`](test-report-brief.md), [`datasheet.md`](datasheet.md)
- Configs: [`../configuration/conf/`](../configuration/conf/)
