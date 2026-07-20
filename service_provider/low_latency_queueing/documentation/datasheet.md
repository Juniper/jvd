# JVD Datasheet — Low Latency QoS Design for 5G

> Quick-reference datasheet for the **Low Latency QoS Design for 5G** Juniper
> Validated Design (`jvd-5g-fh-cos-llq-02-04`). Critical facts only; for depth see
> the published JVD on juniper.net and the companion docs in this folder.

## At a glance

A 5G xHaul (Fronthaul / Midhaul / Backhaul) Class-of-Service design that preserves
ultra-low latency for critical O-RAN eCPRI flows using **Low Latency Queuing (LLQ)**
and a **multi-level priority, eight-queue** CoS model on the ACX7000 series. CoS is
validated end-to-end across EVPN, L3VPN, BGP-VPLS, and L2Circuit services over a
**Seamless MPLS + Segment Routing (IS-IS SR / BGP-LU)** transport.

| | |
|---|---|
| **JVD** | Low Latency QoS Design for 5G — `jvd-5g-fh-cos-llq-02-04` |
| **Track** | Service Provider — 5G xHaul / Mobile Backhaul |
| **Architecture** | Spine-leaf fronthaul access + midhaul/backhaul rings; joint 4G L3MBH + 5G xHaul on one physical network; O-RAN split 7.2x (O-DU co-located with O-CU at HSR); Inter-AS (AS 63535 / AS 63536) Option B/C |
| **Transport** | Seamless MPLS with BGP-LU (inter-AS/inter-domain); IS-IS SR (L1 access, L2 agg/core); TI-LFA, BFD, Micro-Loop Avoidance |
| **CoS model** | Eight queues / eight forwarding classes aligned to O-RAN Multiple Priority Queue + TSN Profile A: LLQ + Shaped Priority Queues + Weighted Fair Queues |
| **Services** | EVPN-VPWS (+ FXC), EVPN-ELAN, BGP-VPLS, L2Circuit, L3VPN — with A/A multihoming, FAT-PW, E-OAM |
| **Classification** | Behavior Aggregate (802.1p/DSCP/EXP), Fixed, and Multifield (eCPRI/PTPoE/OAM) |
| **Validation** | 581 test cases passed per DUT (ACX7024, ACX7100-32C, ACX7509); LLQ ≤4–6µs avg (≤10µs per-node goal), preserved under congestion |
| **Min. validated software** | Junos OS **23.4R2** / Junos OS Evolved **23.4R2-EVO** — see juniper.net for the current validated matrix |

## Device roles

| Role | In the network |
|---|---|
| **Access Node / Cell Site Router (CSR)** | Aggregates O-RU traffic (5G + legacy 4G) at the cell site; L2 fronthaul + L3 MBH attachment; ingress classification/rewrite. |
| **Aggregation / Hub Site Router (HSR)** | Aggregates multiple CSRs; O-DU/O-CU connectivity; route reflectors for the access fronthaul segment; inter-AS Option B/C. |
| **Aggregation (helper)** | Midhaul/backhaul transport between HSR and core. |
| **Core Router (CR)** | SR-MPLS core transit; redundant route reflectors. |
| **Services Aggregation Gateway (SAG)** | Service edge toward the 5GC/EPC (UPF); inter-AS Option-B peering to HSR. |

## Featured platforms

Devices under test. Use the minimum validated release; regression re-validates on
newer releases. For the current validated platform + software matrix, see the
published JVD page on juniper.net.

| Role | Device(s) | Min. validated software |
|---|---|---|
| Access Node / CSR | ACX7024 (AN4), ACX7100-48L (AN1, AN3) | Junos OS Evolved 23.4R2 |
| Aggregation / HSR | ACX7509 (AG1.1), ACX7100-32C (AG1.2) | Junos OS Evolved 23.4R2 |
| Aggregation (helper) | MX204 (AG2.1/AG2.2) | Junos OS 23.4R2 |
| Aggregation (helper) | MX480 (AG3.1/AG3.2) | Junos OS 23.4R2 |
| Core | PTX10001-36MR (CR1, CR2) | Junos OS Evolved 23.4R2 |
| Services Aggregation Gateway | MX304 | Junos OS 23.4R2 |

*Primary CoS DUTs: ACX7024 (CSR), ACX7100-32C (HSR), ACX7509 (HSR). LLQ requires
Junos OS Evolved 23.3R1+ on ACX7000; eight-level port QoS from 24.3R1.*

## Protocols

**Underlay / transport**
- Seamless MPLS with BGP Labeled Unicast (BGP-LU) at border nodes (inter-AS eBGP-LU)
- IS-IS Segment Routing — Level 1 (access) and Level 2 (aggregation/core)
- TI-LFA (loose-mode node redundancy), BFD, Micro-Loop Avoidance
- Inter-AS Option B / Option C between AS 63535 and AS 63536

**Overlay / services**
- EVPN-VPWS (primary fronthaul C/U-plane delivery) — single-homed and A/A multihoming
- EVPN Flexible Cross Connect (FXC) — single-homed and A/A multihoming
- EVPN-ELAN — A/A multihoming; EVPN Virtual Gateway Address (VGA) IRB anycast
- BGP-VPLS (single-homed); L2Circuit (MBH)
- L3VPN — fronthaul M-plane, midhaul/backhaul C/U-plane; IPv4 and IPv6
- FAT-PW (flow-aware transport pseudowire label); Ethernet OAM / CFM (E-OAM PM)

**Class of Service**
- Eight forwarding classes / eight queues: FC-SIGNALING (Q7), FC-LLQ (Q6),
  FC-REALTIME (Q5), FC-HIGH (Q4), FC-CONTROL (Q3), FC-MEDIUM (Q2), FC-LOW (Q1),
  FC-BEST-EFFORT (Q0)
- Multi-level priority (low-latency / strict-high / high / medium-high / medium-low
  / low; eight levels from 24.3R1); LLQ dedicated VOQ→EGQ path
- Classifiers: Behavior Aggregate (802.1p, DSCP, DSCPv6, EXP), Fixed, Multifield
  (eCPRI 0xAEFE, PTPoE 0x88F7, CFM 0x8902)
- Rewrite: 802.1p, DSCP, DSCPv6, EXP (outer-tag rewrite, inner C-TAG preserved)
- Shaping (PIR) on priority queues; WFQ transmit-rate on low queues; port shaping;
  FADT dynamic buffer management

**OAM & assurance**
- Ethernet CFM / E-OAM performance monitoring; BFD
- eCPRI message types: Remote Memory Access (T4), Delay Measurement (T5), Remote
  Reset (T6), Event Indication (T7)

## Services & use cases

A **use case** composes: *connectivity intent* (fronthaul / midhaul / backhaul) ×
*service* (EVPN-VPWS/FXC/ELAN, BGP-VPLS, L2Circuit, L3VPN) × *traffic priority*
(forwarding class / queue) × *resiliency* (single-homed or A/A multihoming). The
JVD composes 12 validated xHaul use cases — see the
[design guide](design-guide.md) and [test report brief](test-report-brief.md).

### Services

| Service | What it delivers | Means of delivery |
|---|---|---|
| EVPN-VPWS (+ FXC) | Point-to-point L2 for 5G fronthaul C/U-plane | SR-MPLS; SH or A/A MH; FAT-PW, E-OAM |
| EVPN-ELAN | Multipoint L2 with anycast IRB | A/A MH; EVPN VGA IRB |
| BGP-VPLS | Multipoint L2 for MBH | SR-MPLS, single-homed |
| L2Circuit | Point-to-point L2 for MBH | SR-MPLS; FAT-PW |
| L3VPN | IPv4/IPv6 for M-plane and midhaul/backhaul C/U-plane | SR-MPLS; anycast IRB multihoming |

### Intent-based use cases

| Connectivity intent | Service | Priority (queue) | Resiliency |
|---|---|---|---|
| 5G Fronthaul C/U-plane (eCPRI) | EVPN-VPWS / FXC | FC-LLQ (Q6) | SH or A/A MH |
| 5G Fronthaul M-plane | L3VPN | FC-MEDIUM/CONTROL | A/A MH |
| 5G Midhaul DU→SAG | EVPN IRB anycast + L3VPN | FC-REALTIME (Q5) | A/A MH |
| L2 MBH | L2Circuit / EVPN-VPWS / BGP-VPLS | FC-HIGH/MED/LOW | SH |
| L3 MBH (4G) | L3VPN | BA (all classes) | — |

## Design concepts

| Area | What the JVD covers |
|---|---|
| **Transport** | Seamless MPLS + IS-IS SR (L1/L2), BGP-LU border nodes, inter-AS Option B/C, TI-LFA/BFD/MLA |
| **CoS model** | 8-queue O-RAN Multiple Priority Queue + TSN Profile A; LLQ + shaped PQs + WFQ; latency budgets |
| **Classification & rewrite** | BA / Fixed / Multifield; 802.1p·DSCP·EXP mapping; outer-tag rewrite, inner-tag preservation |
| **Scheduling & buffers** | Shaping-rate vs transmit-rate interaction; VOQ→EGQ hierarchy; FADT dynamic buffers |
| **Latency preservation** | ≤10µs/node goal; LLQ ≤4–6µs measured under congestion; per-hop ~3–5µs multi-hop |
| **Services** | EVPN-VPWS/FXC/ELAN, BGP-VPLS, L2Circuit, L3VPN; A/A multihoming; FAT-PW; E-OAM |

## References

- **JVD page (juniper.net):** *Low Latency QoS Design for 5G Solution* — search
  "5G Fronthaul CoS LLQ" on the [Juniper Validated Designs](https://www.juniper.net/documentation/product/us/en/juniper-validated-designs/) index.
- **Companion docs:** [solution-overview.md](solution-overview.md) ·
  [design-guide.md](design-guide.md) · [test-report-brief.md](test-report-brief.md)
- **Configurations:** [`../configuration/conf`](../configuration/conf) ·
  [`../configuration/set`](../configuration/set) ·
  [`../configuration/snips`](../configuration/snips)
- **Figures:** [images/](images) — see [images/README.md](images/README.md)
