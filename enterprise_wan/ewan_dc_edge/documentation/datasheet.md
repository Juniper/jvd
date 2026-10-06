# Enterprise Data Center Edge — Datasheet

> Seamless interconnect of EVPN-VXLAN data center fabrics with EVPN-MPLS WAN services on MX Series data center edge routers.

## At a glance

| Field | Value |
|-------|-------|
| JVD | Enterprise Data Center Edge |
| Slug | `ewan_dc_edge` |
| Track | Enterprise WAN |
| Architecture | Spine-and-leaf EVPN-VXLAN data center; MX data center edge/gateway stitching to an EVPN-MPLS WAN; single-homed WAN edge for campus and branch |
| Transport | OSPF, LDP, MPLS, LFA / remote LFA, BFD, ECMP |
| Service families | EVPN-VXLAN to EVPN-MPLS interconnect: VLAN-based, VLAN bundle, VLAN-aware bundle |
| Validation | All three EVPN service models at scale, all-active multihoming in the data center, single-homed WAN edge, failure and convergence events |
| Min. validated software | Junos OS 23.2R2 / Junos OS Evolved 23.2R2 (see [juniper.net](https://www.juniper.net/documentation/us/en/software/jvd/jvd-ewan-evpn-gw-01-01/validated-platforms.html) for the current matrix) |

## Device roles

| Role | Function |
|------|----------|
| Data center edge / gateway | Terminates the data center VXLAN tunnels and stitches EVPN-VXLAN to EVPN-MPLS using a single MAC forwarding table, without logical tunnel interfaces |
| WAN edge | Single-homed campus / branch PE; terminates EVPN-MPLS services toward the remote L2 domain |
| P router | MPLS transport in the enterprise WAN backbone |
| Data center spine | Fabric spine for the EVPN-VXLAN overlay |
| Data center leaf | Connects servers; encapsulates traffic in EVPN-VXLAN; all-active ESI multihoming toward top-of-rack |
| Data center top of rack | Access switching for hosts behind the leaves |

## Featured platforms

| Role | Device(s) | Min. validated software |
|------|-----------|------------------------|
| Data center edge | MX480, MX10003 | Junos OS 23.2R2 |
| WAN edge | MX204, ACX5448-D | Junos OS 23.2R2 |
| P router | PTX10003-80C, ACX7100-48L | Junos OS Evolved 23.2R2 |
| Data center spine | QFX5200 | Junos OS 23.2R2 |
| Data center leaf | QFX5120 | Junos OS 23.2R2 |
| Data center top of rack | QFX5120 | Junos OS 23.2R2 |

The configurations in this repository were captured during the initial validation on Junos OS / Junos OS Evolved 21.4R2, with ACX5448-M (WAN edge), PTX10001-36MR (P) and EX4200-48T (top of rack). See the [JVD README](../README.md#hardware).

## Protocols

**WAN transport:** OSPF, LDP, MPLS, ECMP, LACP / AE bundles

**High availability:** LFA (link / node) and remote LFA, BFD, all-active ESI multihoming in the data center

**Overlay / services:** EVPN-MPLS in the WAN with iBGP for EVPN signalling and route reflection; EVPN-VXLAN in the data center with eBGP underlay and iBGP overlay; EVPN-VXLAN to EVPN-MPLS interconnect on the data center edge

**Addressing and L2:** IPv4, IPv6, VLAN (802.1Q)

## Services & use cases

### Services

| Service type | What it delivers | Means of delivery |
|--------------|-----------------|-------------------|
| VLAN-based | One VLAN per EVPN instance between the data center and campus / branch sites | EVPN-VXLAN in the fabric, interconnected to EVPN-MPLS on the data center edge |
| VLAN bundle | Several VLANs sharing one EVPN instance | EVPN-VXLAN / EVPN-MPLS VLAN-bundle instances |
| VLAN-aware bundle | Several VLANs in one instance with per-VLAN bridge domains | Virtual-switch instances with EVPN interconnect |

### Intent-based use cases

| Connectivity intent | Service | Transport intent | Resiliency |
|---------------------|---------|------------------|------------|
| Campus / branch to data center L2 extension | VLAN-based, VLAN bundle or VLAN-aware bundle | LDP-signalled MPLS over OSPF with LFA / remote LFA | All-active multihoming in the data center; single-homed WAN edge |
| Data center to data center over the WAN | Same three service models | Same MPLS transport | Same |

These compose the validated scenarios in the [design guide](design-guide.md#solution-validation-goals) and [test report](test-report-brief.md#high-level-features-tested).

### Validated scale

| Feature | DC edge (MX10003 / MX480) | Leaf (QFX5120) | WAN edge (MX204) | WAN edge (ACX5448-D) |
|---------|---:|---:|---:|---:|
| VLANs | 3,503 | 3,503 | 2,152 | 3,453 |
| MAC addresses | 41,000 | 34,000 | 34,000 | 41,900 |
| Switching instances | 1,500 | 1,500 | — | — |
| Bridge domains | 2,217 | 2,217 | 1,460 | 757 |
| VTEPs | 4,503 | 1,506 | — | — |
| ESIs | 48 | 48 | — | — |
| IRB (CRB model) | 2,153 | — | — | — |

Full figures, traffic profiles and convergence scenarios: [test report](test-report-brief.md#scale-and-performance-data).

## Design concepts

**Data center fabric:** spine-and-leaf EVPN-VXLAN with an eBGP underlay and iBGP overlay; leaves encapsulate host traffic in VXLAN toward the data center edge. See [Solution Design and Architecture](design-guide.md#solution-design-and-architecture).

**Gateway stitching:** the data center edge removes the VXLAN header, performs one forwarding lookup in a single MAC FIB, and re-encapsulates in EVPN-MPLS — no logical tunnel interfaces or packet recirculation. See [Packet Flow](design-guide.md#packet-flow).

**WAN backbone:** OSPF with LFA / remote LFA, LDP label distribution, and iBGP for EVPN signalling; WAN edge devices are single-homed.

**Out of scope:** active-active WAN edge, EVPN-VXLAN to EVPN-VXLAN or to VPLS stitching, and Apstra management. See [Solution Validation Non-Goals](design-guide.md#solution-validation-non-goals).

## References

- [Enterprise Data Center Edge JVD](https://www.juniper.net/documentation/us/en/software/jvd/jvd-ewan-evpn-gw-01-01/index.html)
- [Juniper Validated Designs](https://www.juniper.net/documentation/validated-designs/)
- [JVD Portal — Discover / Learn / Design / Build](https://juniper.github.io/jvd/portal/)
- [Design guide](design-guide.md) · [Solution overview](solution-overview.md) · [Test report brief](test-report-brief.md)
- [Configuration files](../configuration/conf/) · [Configuration snippets](../configuration/snips/README.md)
