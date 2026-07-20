# JVD Test Report Brief — Low Latency QoS Design for 5G

> Markdown conversion of the published *JVD Test Report Brief: Low Latency QoS
> Design for 5G Solution* (`test-report-brief-5g-fh-cos-llq-02-04`, V1.0/240808).
> The PDF on juniper.net is the source of truth. The published brief contains
> ~85 exhaustive per-scenario latency tables (every DUT × frame size × traffic
> pattern × congestion state); those are **condensed** here to per-category
> summaries with representative samples. See the published brief for every row and
> the packet captures.

## Introduction

This JVD is focused on CoS operations and performance requirements to ensure the
integrity of critical 5G Fronthaul traffic flowing between radio unit (RU) and
distributed unit (DU) emulated devices, facilitated by the CSR (ACX7024),
ACX7100-32C (HSR), and ACX7509 (HSR). Additional validation includes MX304 as the
SAG for end-to-end MBH traffic flows. This profile includes new ACX7000
capabilities for ultra-low latency workloads with LLQ (low latency queuing) and
additional O-RAN traffic profiles with multi-level priority QoS.

## Platforms Tested

| Role | Platform | OS |
|---|---|---|
| AN1 | ACX7100-48L | Junos OS Evolved Release 23.4R2 |
| AN4 | ACX7024 | Junos OS Evolved Release 23.4R2 |
| AN3 | ACX7100-48L | Junos OS Evolved Release 23.4R2 |
| AG1.1 | ACX7509 | Junos OS Evolved Release 23.4R2 |
| AG1.2 | ACX7100-32C | Junos OS Evolved Release 23.4R2 |
| AG2.1 | MX204 | Junos OS Release 23.4R2 |
| AG2.2 | MX204 | Junos OS Release 23.4R2 |
| AG3.1 | MX480 | Junos OS Release 23.4R2 |
| AG3.2 | MX480 | Junos OS Release 23.4R2 |

The topology also includes PTX10001-36MR (CR1, CR2) as Core and MX304 as the
Services Aggregation Gateway (SAG). See the [design guide](design-guide.md) for the
full role/platform mapping and the [datasheet](datasheet.md) for the featured
platforms table.

### Version Qualification History

This JVD has been qualified using **Junos OS Release 23.4R2** and **Junos OS
Evolved Release 23.4R2-EVO**.

## Validation Results

5G xHaul infrastructure defines strict latency budgets, particularly in the
Fronthaul segment. Total latency factors the number of hops — for example,
EVPN-VPWS with 3 hops measured **15.1µs, amounting to ~5µs per hop** in the
fronthaul segment. Across all DUTs (ACX7024, ACX7100-32C, ACX7509) and all
scenarios, the per-device average latency was measured **below the 10µs objective,
with the majority ≤6µs**, and the low-latency queue preserved its budget even under
congestion causing traffic discard.

**Headline result:** ACX7024 (CSR), ACX7100-32C (HSR), and ACX7509 (HSR) each
**successfully passed all 581 test cases** curated to support the reference
architecture.

### Latency Test Topologies

- **Topology 1 (a/b/c)** — individual DUT performance (ACX7024 as CSR;
  ACX7100-32C and ACX7509 as HSR) standalone. Spirent emulates O-RU and O-DU
  (self-latency excluded). Traffic: IP bursts and steady streams at 64B, 512B,
  1500B. Best representation of individual device performance.
- **Topology 2 (a/b)** — point-to-point EVPN-VPWS between CSR (ACX7024) and HSR
  (ACX7100-32C / ACX7509), 2-hop, both RU/DU emulated.
- **Topology 3** — EVPN-VPWS active-active multihoming, single CSR DUT to a pair
  of HSRs via all-active ESI LAG, with a physical DU (QFX5120) as a 3rd hop.

Each topology was tested across: traffic only on the LLQ; non-congested continuous;
congested continuous (1-queue and 2-queue congestion); non-congested burst;
congested burst; and with a port-level shaper (1G/3G).

### Representative Latency Results

**Topology 1a — ACX7024 (CSR), LLQ only, no background traffic (10G, continuous):**

| Frame Size | Min (µs) | Ave (µs) | Max (µs) |
|---|---|---|---|
| 64 B | 5.83 | 6.18 | 9.54 |
| 512 B | 5.78 | 6.13 | 9.55 |
| 1500 B | 5.09 | 5.31 | 6.61 |

**Topology 1a — ACX7024, LLQ under 1-queue congestion (strict-high oversubscribed
to discard):** LLQ average preserved ≤6.2µs.

| Frame / Pattern | Min (µs) | Ave (µs) | Max (µs) |
|---|---|---|---|
| 64 B continuous | 5.83 | 6.17 | 12.44 |
| 512 B continuous | 5.78 | 6.02 | 10.95 |
| 1500 B continuous | 5.09 | 5.26 | 11.34 |
| 64 B burst | 5.09 | 5.16 | 11.39 |
| 1500 B burst | 5.09 | 5.16 | 11.39 |

**Topology 1b — ACX7100-32C (HSR)** and **Topology 1c — ACX7509 (HSR)** produced
comparable or better results: LLQ averages of ~4.4–5.5µs without background traffic
and ~4.9µs under strict-high congestion, with all queues maintained below the 10µs
average goal.

**Topologies 2 and 3 (eCPRI over EVPN-VPWS, multi-hop):** per-hop averages of
~3–5µs even during heavy congestion causing loss in multiple priority queues
(1-queue and 2-queue congestion scenarios). As port speed increases (10GbE → 100GbE),
transmission delay decreases while the LLQ preserves the strict latency budget.

### eCPRI Validation Summary

eCPRI latency was measured across continuous and burst patterns, non-congested and
1-/2-queue congestion scenarios, and multiple port speeds. eCPRI flows mapped to
the low-latency queue consistently preserved the latency budget in line with the
FC-LLQ results above. O-RAN/eCPRI message-type behaviors validated include Remote
Memory Access (Type 4), Delay Measurement (Type 5 — one-way delay estimation),
Remote Reset (Type 6), and Event Indication (Type 7).

### CoS Summarized Results

All CoS functional test-case scenarios **passed**. Across Fixed, Behavior
Aggregate, and Multifield classification, traffic was correctly mapped to the
forwarding class (Queue Match), scheduler rates were honored, codepoints were
rewritten (802.1p / DSCP / EXP), and inner/outer tag bits were preserved
end-to-end. Services validated: EVPN-VPWS, EVPN-FXC, L2Circuit, VPLS, EVPN-ELAN,
EVPN IRB anycast (VGA) with L3VPN multihoming, and Layer 2 Bridge Domain with
Anycast static MAC/IP to L3VPN. Multifield classifiers correctly matched eCPRI,
PTP, and OAM traffic types.

## Traffic Profiles

Custom iMIX definitions used equal-weight frame sizes of 64, 128, 256, 512, 1024,
1500, 2000 bytes (iMIX-1), and a jumbo variant adding 9000 bytes. Traffic-load
distribution used representative streams at **1000 pps / 1500-byte frames** per
service and forwarding class, spanning: L2 Midhaul L2Circuit and VPLS; 5G Fronthaul
EVPN-VPWS-SH (Fixed → LLQ); EVPN-FXC-MH; L3 MBH L3VPN IPv4/IPv6 (BA across all
eight classes); L2 MBH VPLS and EVPN-VPWS (BA); 5G Fronthaul EVPN-FXC-SH (BA across
all classes); and 5G Midhaul L3VPN-IRB over EVPN/Bridge-Domain IPv4/IPv6 (Fixed and
BA).

## Features Tested

AE/LACP · IS-IS, IS-IS-SR · L2Circuit, VPLS · IBGP, EBGP · BFD · CFM ·
L3VPN-OSPF, L3VPN-BGP · TI-LFA · MP-BGP · BGP-LU · EVPN-VPWS SH and Active-Active
MH · EVPN-FXC SH and Active-Active MH · EVPN-ELAN Active-Active MH · FAT-PW ·
L3VPN Anycast with VLANs & static ARP · L3VPN Anycast with EVPN-ELAN · Classifiers
(DSCP, DSCPv6, Fixed, MF, 802.1P, EXP) · Rewrite-rules (DSCP, DSCPv6, 802.1P, EXP)
· Scheduling · Shaping · Rate-limiting.

## Event Testing

The following negative/stress events were tested to assess impact on service and
traffic:

- Restart or kill of critical Junos / Junos Evolved processes.
- Device reboot.
- Interface flap events.
- Deletion or configuration of QoS configuration.
- Deactivate / activate QoS configuration.
- Clearing protocol sessions (protocol session flap).

## Sources

- Published: *JVD Test Report Brief: Low Latency QoS Design for 5G Solution*
  (`test-report-brief-5g-fh-cos-llq-02-04`, V1.0/240808) — juniper.net.
- Companion documents in this folder: [solution-overview.md](solution-overview.md),
  [design-guide.md](design-guide.md), [datasheet.md](datasheet.md).
- Configurations: [`../configuration/conf`](../configuration/conf),
  [`../configuration/snips`](../configuration/snips).
