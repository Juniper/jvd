# JVD Datasheet — Metro Fabric and Broadband Edge

> Quick-reference datasheet for the **Metro Fabric and Broadband Edge (BBE)**
> Juniper Validated Design (`JVD-METRO-BBE-01-01`, Phase 1 / BBE 01-01). Critical
> facts only; for depth see the published JVD on juniper.net and the companion docs
> in this folder.

## At a glance

Metro Fabric and Broadband Edge validates a **Distributed Broadband Aggregation
Solution (DBAS)** — a Cloud Metro spine-leaf fabric that modularizes access,
aggregation, and BNG functions across compact platforms, bringing subscriber traffic
to distributed and centralized BNGs over EVPN Pseudowire Headend Termination (PWHT).

| | |
|---|---|
| **JVD** | Metro Fabric and Broadband Edge — `JVD-METRO-BBE-01-01` (Phase 1) |
| **Track** | Metro / Broadband Edge |
| **Architecture** | Distributed Broadband Aggregation Solution (DBAS): Cloud Metro spine-leaf fabric with Access Nodes (leaves), Aggregation Nodes (spines), and distributed BNGs |
| **Transport** | SR-MPLS underlay over per-domain (Metro / Aggregation / Core) IS-IS instances; iBGP-LU between domains; TI-LFA fast reroute |
| **Overlay / services** | EVPN-VPWS (E-LINE) PWHT with and without EVPN-FXC; PPPoE and IPoE (v4/v6) subscriber termination |
| **BNG redundancy** | Stateless Rapid Reconnect (RR) — primary model; N:1 Stateful (N<4) also validated |
| **Validation** | Over **120 test cases per DUT**; 128k subscriber scale; failover across access / aggregation / core and single & dual BNG failure |
| **Min. validated software** | Junos OS / Junos OS Evolved **24.2R2** (see juniper.net for the current validated matrix) |

## Device roles

| Role | In the network |
|---|---|
| **Access Node (AN)** | Leaf that terminates L2 subscriber access (switch/PON facing) and transports sessions over EVPN-VPWS into the fabric; all-active ESI-LAG multihoming. |
| **Aggregation Node (AGN)** | Spine of the Cloud Metro fabric; aggregates access leaves and provides ECMP-protected transport toward the BNGs and core. |
| **Broadband Network Gateway (BNG)** | Terminates PPPoE/IPoE subscribers via PWHT pseudowires; provides per-subscriber H-QoS, RADIUS auth, and stateless RR redundancy in pairs. |
| **Core Router (CR)** | SR-MPLS core interconnect and inter-domain (eBGP / off-net) boundary. |
| **Switch (SW)** | Access-side L2 switch / PON emulation point connecting subscribers (via test generator) to the ANs (helper role). |

## Featured platforms

Minimum validated software per role. The JVD is re-validated on newer releases
through ongoing regression; for the **current** validated platform + software
matrix, see the published JVD page on juniper.net (linked below).

| Role | Device(s) | Min. validated software |
|---|---|---|
| Access Node (AN) | ACX7024, ACX7100-48L | Junos OS Evolved 24.2R2 |
| Aggregation Node (AGN) | ACX7100-32C | Junos OS Evolved 24.2R2 |
| BNG | MX304, MX204, MX10004, MX480 | Junos OS 24.2R2 |
| Core Router (CR) | PTX10004 | Junos OS Evolved 24.2R2 |
| Switch (SW) | QFX5120-32C, QFX5210-64C | Junos OS 24.2R2 |

> The BBE track is phased; this datasheet reflects **Phase 1 (BBE 01-01)**. Later
> phases add functional scope and platforms — see each phase's juniper.net page for
> its validated matrix. (The design guide's topology figures label the helper
> switches EX4200-48T / QFX5100-48S; the test-report DUT table and this repo's
> configs use QFX5120-32C / QFX5210-64C.)

## Protocols

**Underlay / transport**
- IS-IS (per-domain L2 instances: Metro, Metro Aggregation, Core)
- Segment Routing MPLS (SR-MPLS)
- TI-LFA (link / node protection); BFD
- ECMP load balancing

**Inter-domain transport**
- iBGP Labeled Unicast (iBGP-LU) — propagates BNG/AN loopbacks across domains
- eBGP toward the off-net domain

**Overlay / services**
- EVPN-VPWS (E-LINE) with PWHT — per-Access-Node transport
- EVPN Flexible Cross Connect (FXC) — multiplexes access nodes on shared EVPN transport
- MP-BGP (EVPN family) for the service overlay
- MP-BGP VPNv4 / VPNv6 — Internet routes into subscriber VRF instances

**Subscriber management**
- PPPoE (v4/v6) dynamic dual-tagged VLAN profiles
- IPoE (v4/v6) dynamic dual-tagged VLAN profiles
- RADIUS authentication (PPPoE and DHCP); RADIUS-driven VRF steering and QoS profiles
- Dynamic VLAN / dynamic IP subscribers; VLAN (802.1q), QinQ (802.1ad)

**High availability**
- Stateless Rapid Reconnect (packet-triggered recovery, dynamic IPs for DHCP)
- N:1 Stateful (N<4) with ALQ/BLQ lease sync and PFE oversubscription
- EVPN multihoming — all-active (access ESI-LAG), single-active (BNG PS, DF election)

**Quality of Service**
- Per-subscriber hierarchical QoS (four-queue L4 model: Best Effort, Assured
  Forwarding, Expedited Forwarding, Voice)
- Voice strict-high priority (5% transmit-rate, 10 ms temporal buffer); policing at
  100 / 200 Mb/s; DSCP marking / BA classification

## Services & use cases

The JVD delivers residential and business broadband access over a distributed metro
fabric. A **use case** composes four dimensions: *access type* (PPPoE / IPoE) ×
*service* (EVPN-VPWS PWHT, with or without FXC) × *placement* (distributed vs central
BNG) × *resiliency* (stateless RR / N:1 stateful / ESI-LAG).

### Services

| Service | What it delivers | Means of delivery |
|---|---|---|
| **Residential broadband** | 100 / 200 / 500 Mbps subscriber services with per-subscriber H-QoS | PPPoE or IPoE over EVPN-VPWS PWHT (with/without FXC) |
| **Business broadband** | 100 Mbps business subscriber access | PPPoE or IPoE over EVPN-VPWS PWHT |
| **BNG redundancy** | Sub-session subscriber recovery on BNG failure | Stateless Rapid Reconnect; N:1 Stateful (N<4) |
| **Wholesale (framework)** | LAC and MPLS VPN for wholesale delivery | EVPN transport (referenced; see Metro EBS JVD) |

### Intent-based use cases

| Use case | Access × service | Placement | Resiliency |
|---|---|---|---|
| Residential dual-stack access | IPoE (v4/v6) — EVPN-VPWS PWHT | Distributed BNG pair | Stateless RR + ESI-LAG all-active |
| Residential PPPoE access | PPPoE (v4/v6) — EVPN-VPWS PWHT | Distributed / central BNG | Stateless RR |
| Dense access multiplexing | IPoE / PPPoE — EVPN-VPWS **FXC** PWHT | Aggregated onto shared EVPN transport | Stateless RR + ESI-LAG |
| Central BNG termination | IPoE / PPPoE — PWHT into core BNG | Central (MX10004 / MX480) | Dual-BNG group backup |

This composes the JVD's validated failover scenarios — AGN failure, single and dual
BNG failure, ESI-LAG failover, and AN-to-core link failure; see the
[design guide](design-guide.md) and [test report brief](test-report-brief.md).

## Design concepts

- **Distributed spine-leaf fabric** — [DBAS reference architecture](design-guide.md#use-case-and-reference-architecture)
- **SR-MPLS underlay + per-domain IS-IS** — [network architecture](design-guide.md#network-architecture)
- **EVPN-VPWS PWHT overlay (with/without FXC)** — [architecture functional layers](design-guide.md#architecture-functional-layers)
- **BNG redundancy (Stateless RR / N:1 Stateful)** — [redundancy models](design-guide.md#bbebng-redundancy-models)
- **Per-subscriber H-QoS** — [QoS consideration](design-guide.md#qos-consideration-for-bng-subscribers)

## References

- **Juniper.net JVD page:** [Metro Fabric and Broadband Edge — Juniper Validated Design](https://www.juniper.net/documentation/us/en/software/jvd/jvd-metro-fabric-and-broadband-edge/index.html)
- **Validated designs index:** <https://www.juniper.net/documentation/us/en/software/jvd/>
- **Companion docs:** [solution-overview.md](solution-overview.md) · [design-guide.md](design-guide.md) · [test-report-brief.md](test-report-brief.md)
- **Configurations / snips:** [`../configuration/conf`](../configuration/conf) · [`../configuration/set`](../configuration/set) · [`../configuration/snips`](../configuration/snips)
- **Related JVD:** *Scale-Out Stateful Firewall and CGNAT for SP Edge* (seamless CGNAT integration)
