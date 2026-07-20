# JVD Test Report Brief — Metro Fabric and Broadband Edge

> Faithful markdown conversion of the published *JVD Test Report Brief: Metro
> Fabric and Broadband Edge* (`test-report-brief-JVD-METRO-BBE-01-01`). The PDF
> on juniper.net is the source of truth. The exhaustive per-stream convergence
> matrices (Tables 4–11, hundreds of rows) are condensed here to per-category
> ranges; see the published brief for every individual stream measurement.

## Introduction

This JVD testing evaluates the design of a distributed metro BBE solution involving
**Segment-Routing (SR) MPLS**-based **EVPN PWHT** (Pseudowire Headend Termination)
into BNGs, with BNG redundancy provided through **Rapid Reconnect (RR)** features in
a spine-leaf environment. Aggregation Nodes ("spines", AGNs), Access Nodes
("leaves", ANs), and BNG functions are modularized and handled independently by
separate platforms, providing a cost-effective, scalable solution.

The primary focus is to provide **Seamless Broadband Services (SBS)** to subscribers
during link/node failures across access/aggregation/core and during BNG node
failure with minimal traffic disruption.

Subscriber sessions received on ANs are transported over **EVPN-VPWS PWHT**
(with/without FXC) and terminated into subscriber VRF instances of BNGs distributed
across the aggregation and core domains. On the access side, EVPN-VPWS without FXC is
enabled with **all-active** multihoming; **single-active** multihoming is used on
BNG nodes.

**IS-IS SR-MPLS** is the underlay transport. **BGP-LU** propagates BNG/AN loopbacks
across domains; **BGP VPNv4/v6** advertises Internet routes into specific subscriber
VRF instances. BNGs are enabled with **PPPoE(v4/v6)** and **IPoE(v4/v6)** dynamic
dual-tagged VLAN profiles with stateless RR (packet-triggered recovery with dynamic
IPs for DHCP subscribers). A **RADIUS** server authenticates all PPPoE and DHCP
subscribers.

Products used for the roles:

- **ACX7024 and ACX7100** as Access Nodes (ANs)
- **ACX7100** as Aggregation Nodes (AGNs)
- **MX304, MX204, MX10004, MX480** as four BNGs distributed across aggregation and core
- **PTX10004** as core router
- **QFX5120-32C and QFX5210-64C** as switches connected to ANs and PON (emulated via Ixia RT)

## Platforms and Roles

*Table 1. Platforms Used*

| Tag | Role | Model | Junos OS | Line card | RE | Fabric (cb) | DUT / Helper | Additional |
|---|---|---|---|---|---|---|---|---|
| R0 | AN1 | ACX7024 | EVO 24.2R2 | — | ACX7024-CHAS | ACX7024-CB | DUT | |
| R1 | AN2 | ACX7100-48L | EVO 24.2R2 | — | RE-JNP-7100 | JNP7100-48L-CHAS | DUT | |
| R2 | AN3 | ACX7100-48L | EVO 24.2R2 | — | RE-JNP-7100 | JNP7100-48L-CHAS | DUT | |
| R3 | AN4 | ACX7100-48L | EVO 24.2R2 | — | RE-JNP-7100 | JNP7100-48L-CHAS | DUT | |
| R4 | AN5 | ACX7100-48L | EVO 24.2R2 | — | RE-JNP-7100 | JNP7100-48L-CHAS | DUT | |
| R5 | AGN1 | ACX7100-32C | EVO 24.2R2 | — | RE-JNP-7100 | JNP7100-32C-CHAS | Helper | |
| R6 | AGN2 | ACX7100-32C | EVO 24.2R2 | — | RE-JNP-7100 | JNP7100-32C-CHAS | Helper | |
| R7 | BNG1 | MX304 | 24.2R2 | JNP304-LMIC16-BASE | JNP304-RE-S | JNP304-CHAS | DUT | |
| R8 | BNG2 | MX204 | 24.2R2 | PROTO-ASSEMBLY | RE-S-1600x8 | JNP204-CHAS | DUT | |
| R9 | BNG3 | MX10004 | 24.2R2 | LC480 and LC9600 | RE X10 | JNP10K-RE1 | DUT | |
| R10 | BNG4 | MX480 | 24.2R2 | MPC7E and MPC10E | RE-S-X6-128G-S-S | SCBE3-MX-S | DUT | |
| R11 | CR1 | PTX10004 | EVO 24.2R2 | LC1202 | JNP10K-RE1-E128 | JNP10K-RE1-E128 | Helper | |
| R12 | SW1 | QFX5120-32C | 24.2R2 | — | QFX5120-32C-CHAS | — | Helper | |
| R13 | SW2 | QFX5210-64C | 24.2R2 | — | QFX5210-64C-CHAS | — | Helper | |
| H0 | SERVER | LINUX (Ubuntu 5.4.0-190) | — | — | — | — | Helper | RADIUS server |
| RT0 | TGEN | IXIA (9.30.3001.12) | — | — | — | — | Helper | IPoE/PPPoE clients |

## Version Qualification History

This JVD was qualified in **Junos OS Evolved Release 24.2R2** (and Junos OS 24.2R2
on the MX BNG platforms).

## Scale and Performance Data

*Table 2. Scale and Service Details (per BNG)*

| Feature | Each AN Access | BNG1 (non-failure) | BNG2 (non-failure) | BNG (during failure) |
|---|---|---|---|---|
| IPv4 RIB / FIB | N/A | 8100 | 8100 | 16200 |
| IPv6 RIB / FIB | N/A | 8100 | 8100 | 16200 |
| Total RIB / FIB | N/A | 16200 | 16200 | 32400 |
| PPPoE v4 / v6 (E-LINE-PWHT) | N/A | 4000 | 4000 | 8000 |
| PPPoE v4 / v6 (E-LINE-FXC-PWHT) | N/A | 50 | 50 | 100 |
| IPoE v4 / v6 (E-LINE-PWHT) | N/A | 4000 | 4000 | 8000 |
| IPoE v4 / v6 (E-LINE-FXC-PWHT) | N/A | 50 | 50 | 100 |
| VLANs | S-VLANs = 15, C-VLANs = 8100 | 16200 | 16200 | 32400 |
| ELINE-PWHT (routing instances) | 10 | 20 | 20 | 20 |
| ELINE-FXC-PWHT (routing instances) | 2 | 4 | 4 | 4 |

Traffic profiles (Table 3) generate per-stream loads of **10.24 / 128** (BNG1 /
BNG2 non-failure) across ~28 PPPoE and DHCP (v4/v6), VPWS and FXC, SW1/SW2,
left-right and right-left streams.

## Convergence Data (condensed)

Convergence is measured per subscriber stream across failure and restoration events.
The published brief lists every stream individually (Tables 4–11); the ranges below
summarize each category. **Failover** events reflect time to converge all recovered
sessions onto the backup BNG; **link/node** events reflect underlay/access reroute.

*Table 4. Single BNG Failure / Restoration (ms)*

| Event | Stream category | Convergence range (ms) |
|---|---|---|
| BNG1 failover | PPPoE (VPWS) | ~26,500–28,300 |
| BNG1 failover | PPPoE (FXC) | ~17,300–19,800 |
| BNG1 failover | DHCP (VPWS) | ~19,700–22,900 |
| BNG1 failover | DHCP (FXC) | ~3,900–7,700 |
| BNG1 restoration | PPPoE (VPWS) | ~27,500–28,200 |
| BNG1 restoration | PPPoE (FXC) | ~22,500–25,200 |
| BNG1 restoration | DHCP (VPWS) | ~13,600–15,700 |
| BNG1 restoration | DHCP (FXC) | ~42–421 |

*Table 5. Dual BNG (BNG1 + BNG2) Failure / Restoration (ms)*

| Event | Stream category | Convergence range (ms) |
|---|---|---|
| BNG1 & BNG2 failover | PPPoE (VPWS) | ~73,600–81,900 |
| BNG1 & BNG2 failover | PPPoE (FXC) | ~73,200–75,900 |
| BNG1 & BNG2 failover | DHCP (VPWS) | ~38,600–45,400 |
| BNG1 & BNG2 failover | DHCP (FXC) | ~24,300–27,900 |
| BNG2 restoration | PPPoE (VPWS/FXC) | ~54,200–70,800 |
| BNG2 restoration | DHCP (VPWS) | ~31,700–74,300 |
| BNG2 restoration | DHCP (FXC) | ~15–49,400 |
| BNG1 restoration | PPPoE (VPWS/FXC) | ~61,400–70,800 |
| BNG1 restoration | DHCP (VPWS) | ~19,200–21,300 |
| BNG1 restoration | DHCP (FXC) | ~50–80 |

*Table 6. Link Failure Towards Switch (ms)*

| Event | Stream category | Convergence range (ms) |
|---|---|---|
| SW1–AN1 link down | VPWS (PPPoE/DHCP) | 0.7–7.7 |
| SW1–AN1 link down | FXC | 0 |
| SW1–AN1 link up | VPWS | 0–103 |
| SW2–AN3 link down | VPWS | 0 |
| SW2–AN3 link down | FXC | 833 |
| SW2–AN3 link up | VPWS / FXC | 0–61.9 |

*Table 7. Node Failure (ms)*

| Event | Stream category | Convergence range (ms) |
|---|---|---|
| AN1 node failure | VPWS | 96.9–125.7 |
| AN1 node failure | FXC | 0 |
| AN2 node failure | VPWS | 10.4–152.6 |
| AN2 node failure | FXC | 372.8 |
| AN3 node failure | VPWS | 9–152.3 |
| AN3 node failure | FXC | 327.3–327.4 |
| AN node restore | VPWS / FXC | 0–33 |

*Table 8. Link Failure Towards Core (ms)*

| Event | Stream category | Convergence range (ms) |
|---|---|---|
| AN1–AGN1 down / up | all streams | 0.5 |
| AN3–AGN1 down / up | all streams | 0.5 |

Core link failures are mitigated by MPLS FRR (TI-LFA) with the backup path
preprogrammed in the AN PFE, giving sub-millisecond convergence.

## High-Level Features Tested

- EVPN E-LINE (EVPN-VPWS) with and without FXC
- EVPN Headend Termination (PWHT) into BNG
- IS-IS SR-MPLS, MP-BGP, iBGP-LU, eBGP, BFD, Route Reflection, IPv4, IPv6
- ESI-LAG, VLAN (802.1q)
- VLAN QinQ (802.1ad)
- PPPoE (v4/v6), IPoE (v4/v6)
- Stateless RR (packet-triggered recovery with dynamic IPs for DHCPv4/v6 subscribers)

## Event Testing

- Restart of critical Junos OS / Junos OS Evolved processes and assessment of impact
- Device reboot to evaluate network impact
- Interface up/down to evaluate traffic impact
- Deletion or configuration of various configuration stanzas to evaluate node and
  network stability
- Clearing protocol sessions to simulate session flap and assess service/traffic impact

## Known Limitations

When IPv4 and IPv6 subscribers with the **same MAC on the same VLAN** are present, on
BNG1→BNG2 failover traffic recovers for either IPv4 **or** IPv6 only; the other
recovers only after DHCP lease expiry.

## Sources

- Published JVD: [Metro Fabric and Broadband Edge — Juniper Validated Design](https://www.juniper.net/documentation/us/en/software/jvd/jvd-metro-fabric-and-broadband-edge/index.html)
- Test Report Brief PDF: <https://www.juniper.net/documentation/us/en/software/jvd/test-report-brief-metro-fabric-and-broadband-edge.pdf>
- Companion docs: [solution-overview.md](solution-overview.md) · [design-guide.md](design-guide.md) · [datasheet.md](datasheet.md)
- Configurations: [`../configuration/conf`](../configuration/conf) · [`../configuration/set`](../configuration/set) · [`../configuration/snips`](../configuration/snips)
