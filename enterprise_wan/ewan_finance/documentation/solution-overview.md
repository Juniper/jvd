> Faithful markdown conversion of the published PDF:
> **JVD Solution Overview: Enterprise WAN for Finance and Stock Exchange**
> (`SOL-OVERVIEW-JVD-EWAN-FINANCE-01-01`). The PDF on juniper.net is the
> source of truth.

# JVD Solution Overview: Enterprise WAN for Finance & Stock Exchange

## Executive Summary

Stock exchange networks are among the most latency-sensitive and
performance-critical environments. This JVD meets stringent requirements to
ensure fair, deterministic, and ultra-fast trade execution with a WAN
infrastructure built from the Juniper Networks ACX7100 Cloud Metro Router
series, MX480, MX304, and MX10000 series. Key requirements include:

- Zero packet loss
- No packet reordering
- Deterministic packet delivery
- Low latency
- High availability and redundancy
- Security and segmentation
- Performance monitoring

Multicast traffic is fundamental to stock exchange networks — it is used for
the efficient, simultaneous distribution of real-time market data (quotes,
trades, order-book updates) to many trading participants, ensuring fairness
because all clients receive the same data at nearly the same time. Because
multicast typically uses UDP (no retransmission), packet loss must be
minimized through a reliable, lossless network design.

![Overview of the finance and stock exchange network](images/finance-network-overview.png)
*Figure 1. Overview of the finance and stock exchange network — two identical market-data feeds serve brokerage clients over a private WAN.*

## Solution Overview

To satisfy these requirements the solution uses **PIM Sparse Mode with a
Static RP** (the First Hop Router is directly connected to the multicast
source) and implements **NG-MVPN in shortest-path-tree-only (SPT-only)
mode** to carry the market-data feeds to broker clients. In SPT-only mode,
NG-MVPN delivers feeds directly from the source PE (at the stock-exchange
edge) to the broker/trading clients across the MPLS core, eliminating shared
trees and rendezvous-point switching. **BGP-based signaling (Type-5
Source-Active and Type-7 Join routes)** lets egress PEs immediately join the
source-specific tree, so multicast flows along the most efficient MPLS path
with minimal latency and jitter.

The solution uses NG-MVPN, MPLS, and IP-VPN, with **RSVP-TE** for optimized
transport and **OSPF** as the underlay routing protocol. This ensures
deterministic, low-latency delivery while removing the complexity of
traditional PIM/MSDP multicast. NG-MVPN SPT-only enhances performance,
scalability, and reliability via hardware-based replication (P2MP LSPs or
ingress replication), QoS for strict-priority traffic (LLQ / strict-high),
and fast convergence through MPLS FRR and BGP failover.

**TWAMP** is implemented for SLA monitoring between Access Points and
Customer Routers, and **EVPN** provides **Active/Standby** redundancy for
high availability of critical financial data. **Class of Service** is
configured with multifield classifiers that give multicast traffic
strict-high priority and a lower priority to all remaining services.

![Network architecture of finance and stock exchange](images/solution-architecture.png)
*Figure 2. Network architecture of the finance and stock exchange WAN.*

In this JVD the next generation of ACX Series and MX Series platforms
introduces support for the 100G access segment. The **ACX7100-48L** Cloud
Metro Router acts as a CPE device, and the **MX480, MX304, MX10004, and
MX10008** function as PE devices.

---

## Sources

- Published PDF: **JVD Solution Overview: Enterprise WAN for Finance and Stock Exchange** (`SOL-OVERVIEW-JVD-EWAN-FINANCE-01-01`), on [juniper.net Validated Designs](https://www.juniper.net/documentation/us/en/software/jvd/jvd-ewan-finance-01-01/)
- Companion docs: [`design-guide.md`](design-guide.md), [`test-report-brief.md`](test-report-brief.md), [`datasheet.md`](datasheet.md)
- Configs: [`../configuration/conf/`](../configuration/conf/)
