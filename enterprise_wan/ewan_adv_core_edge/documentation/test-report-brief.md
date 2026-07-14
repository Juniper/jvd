> Faithful markdown conversion of the published PDF:
> [JVD Test Report Brief: Enterprise WAN Advanced Core and Edge Services](https://www.juniper.net/documentation/us/en/software/jvd/test-report-brief-ewan-adv-core-edge-svc-01.pdf).
> The PDF on juniper.net is the source of truth. Exhaustive per-event tables are
> condensed to summaries; see the published document for full results.

# JVD Test Report Brief: Enterprise WAN Advanced Core and Edge Services

**Version:** test-report-brief-ewan-adv-core-edge-svc-01 (July 2024)

## Introduction

This JVD testing focused on migrating to EVPN-MPLS, EVPN-VPWS, and EVPN Type-5 routes over a mix of MPLS (LDP) and Segment Routing underlay transport in a private enterprise WAN. The PTX10001-36MR and PTX10003-80C serve the core, and MX304, MX10004, ACX7100-48L, and ACX7509 serve as WAN edge devices.

## Platforms Tested

### Table 1: Platforms Tested

| Role | Model | Line card | Helper/DUT | Software |
|------|-------|-----------|-----------|----------|
| WANEdge1 | MX304 | — | **DUT** | Junos OS 23.4R2 |
| WANEdge2 | MX10004 | LC480 and LC9600 | Helper | Junos OS 23.4R2 |
| P1 (RR1) | PTX10003-80C | — | Helper | Junos OS Evolved 23.4R2.2 |
| P2 (RR2) | PTX10001-36MR | — | Helper | Junos OS Evolved 23.4R2.2 |
| WANEdge3 | ACX7509 | JNP-FPC-20Y and JNP-FPC-16C | **DUT** | Junos OS Evolved 23.4R2 |
| WANEdge4 | ACX7100-48L | — | **DUT** | Junos OS Evolved 23.4R2 |

**Qualification:** Junos OS Release 23.4R2 and Junos OS Evolved Release 23.4R2.

DUTs: MX304 (WANEdge1), ACX7509 (WANEdge3), ACX7100-48L (WANEdge4). The PTX P/RR nodes and MX10004 serve as helpers. A helper ACX7100-48L or MX480 acts as an L2-mode switch for dual-homing validation.

## Scale and Performance Data

### Table 2: Scale Numbers for the DUTs (per WAN Edge)

Each WAN Edge (MX304, MX10004, ACX7509, ACX7100-48L) carries the same target scale:

| Service / Feature | Scale |
|-------------------|-------|
| Total EVPN Instances | 2,700 |
| EVPN-VPWS Active/Active Multihoming | 700 |
| EVPN-VPWS Single-homing | 300 |
| EVPN-VPWS with FXC Multihoming | 500 |
| EVPN-ELAN SH VLAN-based (Type 2 & 3) | 175 |
| EVPN-ELAN SH VLAN-based (Type 5) | 175 |
| EVPN-ELAN SH VLAN-bundle (Type 2 & 3) | 350 |
| EVPN-ELAN MH VLAN-based (Type 2 & 3) | 100 |
| EVPN-ELAN MH VLAN-based (Type 5) | 150 |
| EVPN-ELAN MH VLAN-bundle (Type 2 & 3) | 250 |
| CFM sessions @140ms (SH only) | 175 |
| MAC Addresses | 5.4K |
| ARP records (EVPN Type-5 only) | 1,150 |
| FlowSpec rules | 10 |
| Static FBF rules | 10 |
| uRPF strict/loose policies | 100 |

## Convergence Data

Convergence is measured for EVPN services (EVPN-VPWS, EVPN-ELAN, EVPN Type-5) under link-failure and node-failure events. Worst-case results are reported.

> Convergence with WAN Edge → L2/L3 Edge (CE-PE) link failures is planned for a future version of this JVD.

### Table 3 & 4: Convergence Summary (worst-case, milliseconds)

| Event class | EVPN-VPWS | EVPN-ELAN | EVPN Type-5 |
|-------------|-----------|-----------|-------------|
| Core-facing link failure (WAN Edge → P) | ~5–130 | ~27–130 | ~5–35 |
| WAN Edge node failure | ~535–1,470 | ~1,226–3,993 | ~586–3,370 |

Core-facing link failures restore in **~60 ms average** (LFA local protection). Node failures show higher convergence via the global convergence path, measured with 2,700 EVPN services per node.

## Features Tested

**Transport / underlay:** MPLS LDP with OSPF + TI-LFA; SR with OSPF + TI-LFA; LDP/SR interworking via SR Mapping Server (P-routers only); iBGP PE↔RR; BFD; LFA/FRR; ECMP; BGP-PIC edge; BGP multipath allow-protection.

**Overlay services:** EVPN-VPWS (SH + A/A MH), EVPN-VPWS FXC (MH), EVPN-ELAN (VLAN-based + VLAN-bundle, Type 2/3 and Type 5, SH + MH), EVPN Type-5 (L3 with IRB + IP Virtual Gateway).

**CoS:** HQoS at the IFD level (ACX7K only).

**Security:** MACsec (core links); BGP FlowSpec DDoS protection (RFC 8955); unicast RPF; stateless firewall filters (accept / policer / reject).

**OAM:** CFM (802.1ag) for per-service continuity; BFD.

## Event Testing (negative triggers)

- Restart / kill of critical Junos / Junos OS Evolved processes
- FPC / PIC reloads
- Instance deactivate / activate
- Add / delete configuration stanzas
- Control- and data-plane daemon enable/disable

## Known Limitations

- No SRTE / SRv6
- No VPLS → EVPN-MPLS migration
- HQoS on AE interface on Junos OS not supported (PR 50676 / 24.1R1)
- EVPN-VPWS (and FXC) multihoming with single-active not supported
- BGP FlowSpec match conditions not supported on ACX7000: Flow Label, Port, Packet Length, IPv6 Fragment, Prefix-Offset
- No multicast; no dynamic CE↔WAN-Edge routing (both out of scope)

---

## Sources

- Published PDF: [test-report-brief-ewan-adv-core-edge-svc-01.pdf](https://www.juniper.net/documentation/us/en/software/jvd/test-report-brief-ewan-adv-core-edge-svc-01.pdf)
- Companion docs: [`design-guide.md`](design-guide.md), [`solution-overview.md`](solution-overview.md), [`datasheet.md`](datasheet.md)
- Configs: [`../configuration/conf/`](../configuration/conf/)
