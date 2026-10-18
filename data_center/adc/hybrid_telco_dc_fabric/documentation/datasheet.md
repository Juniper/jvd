# Telco Cloud and EVPN-VXLAN Data Center Fabric — Datasheet

> **JVD-TELCO-DC-01-01** · slug `hybrid-telco-dc-fabric` · IPv6 EVPN-VXLAN bridged-overlay fabric managed by HPE Networking Apstra Data Center Director
> Quick-reference for the Telco Cloud Data Center Fabric JVD.

## At a glance

A 3-stage (spine / leaf) EVPN-VXLAN data center fabric for private telco clouds. Multi-tenant 5G core CNFs, enterprise VNFs and other workloads run on bare-metal servers, virtual machines and Kubernetes clusters. They connect either through host-based routing with Juniper Cloud-Native Router (JCNR) or through SR-IOV with Q-in-Q. An offramp gateway handles inter-VRF routing, inter-tenant connectivity and connectivity to external networks.

| | |
|---|---|
| **JVD / slug** | Telco Cloud and EVPN-VXLAN Data Center Fabric Using HPE Networking Apstra Data Center Director · `hybrid-telco-dc-fabric` |
| **Track** | Data Center (ADC) |
| **Architecture** | 3-stage Clos, Bridged Overlay (BO) with Anycast IRB gateways on the border leaf switches |
| **Transport** | IPv6 eBGP underlay + IPv6 eBGP EVPN overlay; VXLAN data plane |
| **Workload connectivity** | JCNR host-based routing over MPLS-over-UDP · SR-IOV with Q-in-Q (S-VLAN/C-VLAN) |
| **Orchestration** | Apstra Data Center Director 6.2 (fabric); Apstra Freeform (offramp gateway) |
| **Validation** | Apstra deployment, hardware and optics, feature, traffic-workflow and resiliency validation |
| **Min. validated software** | Junos OS Evolved **25.2X100-D30** (QFX) · Junos OS Evolved **25.4R1-S1** (PTX) · Apstra **6.2** · JCNR **25.2**. See juniper.net for the current matrix. |

## Device roles

| Role | Function in the network |
|------|-------------------------|
| **Spine** (lean) | Connects the server leaf and border leaf switches |
| **Server leaf** | Hosts the compute; Layer 2 bridging into the EVPN-VXLAN fabric; ESI-LAG connectivity to compute nodes |
| **Border leaf** | Anycast IRB gateways (Layer 3 within a VRF); connects the fabric to the offramp gateway |
| **Offramp gateway** | Terminates MPLS-over-UDP and Q-in-Q services; inter-VRF route leaking, inter-tenant routing and policy enforcement; route exchange with external networks |
| **Virtual Route Reflector (vRR)** | Runs on the Kubernetes controller nodes; reflects VPN routes between JCNR instances and the offramp gateway |
| **Bare-metal servers** | SR-IOV and JCNR workloads (Kubernetes, VMs, bare metal) |

## Featured platforms

| Role | Device(s) | Min. validated software |
|------|-----------|--------------------------|
| Spine | QFX5230-64CD | Junos OS Evolved 25.2X100-D30 |
| Server leaf | QFX5130-48C | Junos OS Evolved 25.2X100-D30 |
| Border leaf | QFX5130-32CD | Junos OS Evolved 25.2X100-D30 |
| Offramp gateway | PTX10002-36QDD | Junos OS Evolved 25.4R1-S1 |
| Bare-metal servers | HPE DL360 Gen · DELL PowerEdge R750 | Ubuntu 22.04.4 LTS · Kubernetes v1.35.1 · JCNR 25.2 |

> The design guide recommends two PTX10002-36QDD offramp gateways in production; the validated design deploys one.

## Protocols

- **Underlay:** IPv6 eBGP between leaf and spine switches, with addresses assigned by Apstra (/127). ECMP (multipath) and BFD on the eBGP sessions.
- **Overlay:** IPv6 eBGP EVPN. VXLAN. MAC-VRF instances (VLAN-aware and VLAN-bundle) with overlapping VLANs and VNIs across tenants. EVPN Type-2 and Type-5 routes, with IRB only on the border leaf switches.
- **Layer 3:** Anycast IRB on the border leaf switches. Symmetric IRB mode for JCNR and SR-IOV routing zones and asymmetric for the vRR network. `crb-proxy-mac` on the leaf switches.
- **Workload overlays:** JCNR MPLS-over-UDP tunnels to the offramp gateway, with iBGP to the vRR carrying VPN routes. SR-IOV Q-in-Q (802.1ad), where the S-VLAN maps to a VNI and the C-VLAN is preserved.
- **Routing policy:** inter-VRF route leaking and route-target–based export policy on the offramp gateway.
- **High availability:** ESI-LAG multihoming. `df-election-granularity per-esi` for active-standby multihoming. BFD.

## Services & use cases

| Service | What it delivers | Means of delivery |
|---------|------------------|-------------------|
| **JCNR host-based overlay** | Per-tenant Layer 3 connectivity for Kubernetes workloads | JCNR (cRPD + DPDK vRouter) MPLS-over-UDP to the offramp gateway; vRR route reflection |
| **SR-IOV network overlay** | High-throughput, low-latency workload connectivity with overlapping C-VLANs and IP addresses | Q-in-Q tagging; S-VLAN mapped to a VNI across the bridged overlay; termination on the offramp gateway |
| **Inter-tenant / inter-VRF connectivity** | Controlled connectivity between tenants and between JCNR and SR-IOV domains | Centralized route leaking and policy enforcement on the offramp gateway |

**Intent-based use cases** compose *workload type* (JCNR, SR-IOV) × *scope* (same tenant and network, same tenant and different network, inter-tenant) × *resiliency* (ESI-LAG, BFD, failure and restart scenarios). The validated design covers eight traffic workflow scenarios; see the [design guide](design-guide.md#traffic-workflow-scenarios).

## Design concepts (jump-to)

- **Fabric:** IPv6 underlay and overlay, bridged overlay, border leaf routing. See [Solution Architecture](design-guide.md#solution-architecture).
- **Compute networking:** JCNR host-based routing and SR-IOV network-based overlays. See [Compute Networking](design-guide.md#compute-networking).
- **Offramp gateway:** MPLS-over-UDP and Q-in-Q termination, and the physical loopback construct. See [Offramp Gateway](design-guide.md#offramp-gateway).
- **Control plane:** vRR and centralized inter-VRF reachability. See [Virtual Route Reflector (vRR)](design-guide.md#virtual-route-reflector-vrr).
- **Apstra provisioning:** IPv6 fabric, routing zones, switching zones and virtual networks. See [Solution Walkthrough](design-guide.md#solution-walkthrough).
- **Results:** See [Results Summary and Analysis](design-guide.md#results-summary-and-analysis).

## References

- **JVD page (juniper.net):** [Telco Cloud and EVPN-VXLAN Data Center Fabric Using HPE Networking Apstra Data Center Director](https://www.juniper.net/documentation/us/en/software/jvd/jvd-hybrid-telco-dcfabric/index.html)
- **Validated Designs index:** https://www.juniper.net/documentation/us/en/software/jvd/
- **Portal:** [JVD portal](https://juniper.github.io/jvd/portal/)
- **Companion docs:** [design-guide.md](design-guide.md)
- **Configs:** [`../configuration/conf/`](../configuration/conf/) · [`../configuration/set/`](../configuration/set/)
