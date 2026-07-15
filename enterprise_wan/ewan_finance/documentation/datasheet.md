# JVD Datasheet — Enterprise WAN for Finance & Stock Exchange

> Quick-reference datasheet for the **Enterprise WAN for Finance & Stock
> Exchange** Juniper Validated Design (`jvd-ewan-finance-01-01`). Critical
> facts only; for depth see the published JVD on juniper.net and the
> companion docs in this folder.

## At a glance

An ultra-low-latency, multicast-centric enterprise WAN for financial trading
and market-data distribution. **NG-MVPN in SPT-only mode** (BGP Type-5 /
Type-7) carries market-data feeds over an **MPLS / RSVP-TE** core with
**OSPF** underlay; **EVPN Active/Standby** ESI multihoming provides
redundancy; **TWAMP** assures SLAs; and **CoS multifield classifiers** give
multicast strict-high priority — engineered for zero loss, no reordering, and
deterministic delivery.

| | |
|---|---|
| **JVD** | Enterprise WAN for Finance & Stock Exchange — `jvd-ewan-finance-01-01` |
| **Track** | Enterprise WAN |
| **Architecture** | Three layers — WAN Edge (RP / First Hop Router), Access Point (far-end PE), Access (Customer Router); stock-exchange server → L2 switch → SP core → CR → subscribers |
| **Transport** | MPLS with RSVP-TE; OSPF underlay; RSVP-TE P2MP provider tunnels for multicast |
| **Services** | NG-MVPN (SPT-only, market data), EVPN virtual-switch (A/S ESI), L3VPN (unicast), virtual-router (CR PE-CE) |
| **Multicast** | PIM Sparse Mode + Static / Anycast RP; NG-MVPN SPT-only; BGP Type-5 (Source-Active) / Type-7 (Join) |
| **Assurance** | TWAMP SLA monitoring (AP ↔ CR); CoS multifield classifiers (strict-high for multicast) |
| **Validation** | Scale: 10 L3VPN/EVPN + 10 NG-MVPN instances, 1000 multicast groups, 50K OSPF routes per WAN-edge instance |
| **Min. validated software** | Junos OS / Junos OS Evolved **24.4R2** — see juniper.net for the current matrix |

## Device roles

| Role | In the network |
|---|---|
| **WAN Edge** | Source-side PE and Rendezvous Point (First Hop Router from the multicast source); NG-MVPN sender, EVPN A/S ESI. |
| **Access Point (AP)** | Far-end PE toward the customer; NG-MVPN, TWAMP server. |
| **Customer Router (CR)** | Customer-facing gateway; virtual-router PE-CE context (eBGP to AP, PIM-SM), TWAMP client. |
| **Provider (P)** | MPLS/RSVP core transit; also the iBGP route reflectors. |
| **L2/L3 Edge** | Access bridging (VLAN bridge-domain, LAG) toward the stock-exchange server. |

## Featured platforms

Devices under test / validated during initial qualification. For the current
validated platform + software matrix, see the published JVD page.

| Role | Device(s) | Min. validated software |
|---|---|---|
| WAN Edge | MX304, MX10008, MX10004 | Junos OS 24.4R2 |
| Access Point | MX304, MX10004 | Junos OS 24.4R2 |
| Customer Router | ACX7100-48L, MX480 | Junos OS Evolved / Junos OS 24.4R2 |
| Provider (P) / RR | PTX10003, PTX10001-36MR | Junos OS Evolved 24.4R2 |
| L2/L3 Edge | ACX7100-48L | Junos OS Evolved 24.4R2 |
| Traffic generator | IXIA (IxOS 9.30.3001.12) | — |

## Protocols

**Underlay / transport**
- OSPF (single-area underlay, TE extensions, link protection, BFD)
- MPLS with RSVP-TE signaling; RSVP-TE **P2MP** provider tunnels for multicast
- MPLS Fast Reroute (FRR) for sub-second protection

**Multicast**
- PIM Sparse Mode with Static RP (FHR directly connected to the source)
- Anycast RP (loopback RP advertised by both dual-homed PEs)
- NG-MVPN, **SPT-only** mode; BGP signaling — Type-5 (Source-Active), Type-7 (Join)
- Multicast forwarding-cache tuning (resolve-rate / RPF-mismatch-rate)

**Overlay / services**
- NG-MVPN multicast VRF (market-data feeds)
- EVPN virtual-switch with **Single-Active (A/S)** ESI multihoming + IRB gateway
- L3VPN (inet-vpn) unicast VRFs, eBGP PE-CE
- Virtual-router PE-CE context on the CR (eBGP to AP, PIM-SM, MED path steering)

**Routing & policy**
- iBGP core mesh / route reflection (inet-vpn, inet-mvpn, evpn families); eBGP PE-CE
- MED-based path steering; OSPF ↔ BGP redistribution policies

**High availability**
- EVPN Single-Active ESI-LAG (immediate failover, predictive forwarding)
- Dual identical market-data feeds (Feed A / Feed B) over diverse groups and paths
- MPLS FRR + BGP failover

**OAM & assurance**
- TWAMP (Control + Test) SLA monitoring between AP and CR
- LLDP neighbor discovery
- CoS: multifield classifiers, forwarding classes, schedulers, drop profiles (strict-high / LLQ for multicast)

## Services & use cases

### Services

| Service | What it delivers | Means of delivery |
|---|---|---|
| NG-MVPN | Real-time market-data multicast | SPT-only, RSVP-TE P2MP, BGP Type-5/7 |
| EVPN virtual-switch | L2 with A/S redundancy | ESI-LAG Single-Active + IRB |
| L3VPN | Unicast order/transaction connectivity | inet-vpn VRF, eBGP PE-CE |
| Virtual-router | CR PE-CE routing context | eBGP to AP, PIM-SM, MED steering |

### Intent-based use cases

A **use case** composes: *connectivity intent* (market-data distribution vs
order transaction) × *service* (NG-MVPN / EVPN / L3VPN) × *SLA intent*
(strict-high multicast vs best-effort) × *resiliency* (Single-Active ESI,
MPLS FRR, dual feeds).

| Intent | Service | SLA | Resiliency |
|---|---|---|---|
| Market-data feed distribution | NG-MVPN (SPT-only) | strict-high / LLQ | dual feeds + MPLS FRR |
| Order / transaction (buy/sell) | L3VPN unicast | AF / prioritized | ESI A/S + BGP failover |
| Data-center L2 redundancy | EVPN virtual-switch | — | Single-Active ESI-LAG |
| SLA assurance | TWAMP | latency / loss / jitter | continuous monitoring |

## Design concepts

| Area | What the JVD covers |
|---|---|
| **Multicast transport** | NG-MVPN SPT-only; RSVP-TE P2MP; PIM-SM + Static/Anycast RP; Type-5/7 signaling |
| **Redundancy** | EVPN Single-Active ESI-LAG; dual market-data feeds; MPLS FRR + BGP failover |
| **Underlay** | OSPF + RSVP-TE + MPLS; deterministic, low-latency forwarding |
| **QoS** | Multifield classifiers; strict-high / LLQ for multicast; scheduler + drop-profile pipeline |
| **Assurance** | TWAMP SLA (AP ↔ CR); LLDP |

## References

- **JVD page (juniper.net):** [Enterprise WAN for Finance & Stock Exchange JVD](https://www.juniper.net/documentation/us/en/software/jvd/jvd-ewan-finance-01-01/)
- **Validated Designs index:** [juniper.net/documentation/validated-designs](https://www.juniper.net/documentation/validated-designs/)
- **JVD Portal:** [juniper.github.io/jvd/portal](https://juniper.github.io/jvd/portal/) (Discover / Learn / Design / Build)
- **Solution Overview:** [`solution-overview.md`](solution-overview.md)
- **Design Guide:** [`design-guide.md`](design-guide.md)
- **Test Report Brief:** [`test-report-brief.md`](test-report-brief.md)
- **Configs & snips:** [GitHub — ewan_finance](https://github.com/Juniper/jvd/tree/main/enterprise_wan/ewan_finance/configuration)
