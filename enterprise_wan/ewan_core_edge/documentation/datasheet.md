# Enterprise WAN Core and Edge — Datasheet

> MPLS-based enterprise WAN backbone delivering VPLS, L2 Circuit, L3VPN, and NGMVPN services across campus, branch, and data center locations.

## At a glance

| Field | Value |
|-------|-------|
| JVD | Enterprise WAN Core and Edge |
| Slug | `ewan_core_edge` |
| Track | Enterprise WAN |
| Architecture | Dual-core MPLS backbone with PE WAN edge and CE L2/L3 edge |
| Transport | LDP, MPLS, OSPF area 0, LFA/FRR, BFD, ECMP |
| Service families | VPLS, L2 Circuit, L3VPN (native + hub-spoke), NGMVPN |
| Validation | All test cases pass; link-failure convergence < 80 ms |
| Min. validated software | Junos OS 22.3R1-S1 / Junos OS Evolved 22.3R1-S1 (see [juniper.net](https://www.juniper.net/documentation/us/en/software/jvd/jvd-ewan-core-edge-01/validated-platforms.html) for current matrix) |

## Device roles

| Role | Function |
|------|----------|
| WAN Edge (PE) | Terminates L2/L3 VPN services from campus and branch locations; applies HQoS; connects to core via MPLS/LDP |
| Core / P Router | MPLS transport backbone; iBGP route reflector for all PE devices |
| L2/L3 Edge (CE) | Customer-facing edge device at campus/branch; connects to WAN edge via eBGP or L2 handoff |

## Featured platforms

| Role | Device(s) | Min. validated software |
|------|-----------|------------------------|
| WAN Edge | MX304, MX10008, ACX7509, ACX7100-48L | Junos OS 22.3R1-S1 / Junos OS Evolved 22.3R1-S1 |
| Core / P | PTX10003-80C, PTX10008 | Junos OS Evolved 22.3R1-S1 |
| L2/L3 Edge (CE) | ACX7100-48L, MX480 | Junos OS 22.3R1-S1 / Junos OS Evolved 22.3R1-S1 |

## Protocols

**Transport / underlay:** OSPF area 0, LDP, MPLS, ECMP, LACP/AE bundles

**High availability:** Loop-Free Alternate (LFA) node-link-protection, BFD (10 ms intervals), Graceful Restart, VRRP (Active/Standby)

**Overlay / services:** BGP-VPLS, L2 Circuit (CCC encapsulation), L3VPN (iBGP inet-vpn + l2vpn signaling), NGMVPN with S-PMSI, native PIM multicast, IGMPv2 snooping

**Routing & policy:** iBGP with route reflection (dual RR), eBGP (CE-PE), Q-in-Q VLAN separation

**QoS:** Hierarchical QoS at IFD/IFL/queue levels

## Services & use cases

### Services

| Service type | What it delivers | Means of delivery |
|--------------|-----------------|-------------------|
| VPLS | Multi-point L2 connectivity across WAN (many-to-many) | BGP-VPLS with bridge domains |
| L2 Circuit | Point-to-point L2 connectivity | CCC encapsulation over MPLS |
| L3VPN | L3 routing between sites (native + hub-spoke) | iBGP inet-vpn with VRF instances |
| L3VPN + VRRP | Resilient L3VPN with gateway redundancy | L3VPN with VRRP Active/Standby |
| NGMVPN | Multicast video transport (surveillance cameras) | NG-MVPN with LDP-based S-PMSI tunnels |

### Validated scale

| Feature | Scale |
|---------|-------|
| VPLS instances | 1,000 |
| L2 Circuits | 4,000 |
| L3VPN (Hub & Spoke) | 1,000 |
| VRF instances | 2,000 |
| eBGP sessions | 2,000 |
| VLANs/bridge domains | 7,000+ |
| MAC addresses | 50,000 |
| Multicast (*,G)/(S,G) | 10,300 |
| NGMVPN instances | 100 |

## Design concepts

**Transport:** Dual-core MPLS backbone using OSPF area 0 for IGP reachability and LDP for label distribution. All core and edge links carry `family mpls`. ECMP provides load balancing across equal-cost paths.

**High availability:** LFA with node-link-protection on every OSPF interface provides sub-50 ms reroute on link failure. BFD at 10 ms intervals detects failures rapidly. LAG (ae) bundles with LACP provide link-level redundancy. Validated link-failure convergence: < 40 ms; AE port failure: < 4 ms.

**Overlay services:** WAN edge routers terminate all VPN services. The dual P routers serve as iBGP route reflectors (BGP cluster) distributing VPNv4 and L2VPN routes to all PE devices. CE devices connect via eBGP or L2 handoff.

**Multicast:** Native PIM multicast and NGMVPN with S-PMSI for enterprise surveillance/monitoring use cases. IGMPv2 snooping at the edge.

## References

- [Enterprise WAN Core and Edge JVD](https://www.juniper.net/documentation/us/en/software/jvd/jvd-ewan-core-edge-01/index.html)
- [Juniper Validated Designs](https://www.juniper.net/documentation/validated-designs/)
- [JVD Portal — Discover / Learn / Design / Build](https://juniper.github.io/jvd/portal/)
- [Configuration files](../configuration/conf/)
