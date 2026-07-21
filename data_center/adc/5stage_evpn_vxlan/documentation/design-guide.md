# Design Guide — 5-Stage EVPN-VXLAN Data Center

> **JVD-DCFABRIC-5STAGE-01-01** · Juniper Validated Design · Published 2025-05-23
> Source: *5-Stage EVPN-VXLAN Data Center — Juniper Validated Design (JVD)* (juniper.net).
> Companion docs: [solution-overview.md](solution-overview.md) · [test-report-brief.md](test-report-brief.md) · [datasheet.md](datasheet.md)

## About this document

This document details a Juniper Validated Design (JVD) to provision a **5-stage EVPN/VXLAN fabric** with Juniper Apstra using Apstra's Data Center Architecture design feature — two super spines, and PODs with spines, server leaves, and border leaves. It is intended for an audience familiar with Junos OS, QFX switches, and Juniper Apstra, and references the [3-Stage Data Center Design with Juniper Apstra](../../3stage_dc/).

## Solution benefits

JVDs are a prescriptive blueprint for building a data center fabric with well-documented capabilities and appropriate product selection, passing rigorous testing with real-world workloads. **Juniper Apstra** is a multi-vendor, intent-based networking system (IBNS) that provides closed-loop automation and assurance — translating vendor-agnostic intent into device-specific configuration and continuously validating that network state does not deviate from intent.

## Use case and reference architecture

The 5-stage design is similar to the 3-stage design with the addition of a **super spine** layer, enabling large-scale data centers with large datastores and the compute nodes that connect to them. Each super spine connects to each spine in a POD, so multiple PODs can attach to the super spines. A POD (spine + leaf layers) is the equivalent of a 3-stage fabric.

> **Note.** The JVD validates the 5-stage design where racks are in the same lab location. While the design has been deployed to interconnect data centers over dark fiber, this should be done cautiously with attention to latency — contact your Juniper representative.

## Solution architecture

The 5-stage fabric is an ERB EVPN-VXLAN design. The super spines perform IP forwarding and route relaying only (lean super spines / lean spines — no VXLAN encapsulation). Provisioning is done through Apstra's Data Center reference design, which generates native config and applies Intent-Based Analytics for real-time insight.

> **Note.** PODs hosting border leaves can be directly connected to the super spine, but those border leaves must then be configured manually (not yet supported in the Apstra Data Center reference design).

### Hardware and software

*Table 1 — platform positioning and roles:*

| Solution | Server leaf | Border leaf | Spine | Super spine |
|----------|-------------|-------------|-------|-------------|
| 5-stage EVPN/VXLAN (ERB) | QFX5120-48YM, QFX5130-32CD (EVO) | QFX5130-48C (EVO) | QFX5220-32CD (EVO), QFX5210-64C, QFX5120-32C | QFX5230-64CD (EVO) |

*Table 2 — software:*

| Juniper product | Software / image version |
|-----------------|--------------------------|
| Juniper Apstra | 5.0.0-64 |
| Junos OS / Junos OS Evolved | 23.4R2-S3 |

> **Apstra 5.0 workaround.** During testing, Apstra generated incremental "Check gRPC Reset count" anomalies; the workaround disables the gRPC telemetry flag (`gRPC_enabled = 0` in `/etc/aos/aos.conf`, then `service aos restart`) so telemetry is collected via NETCONF instead.

### Validated functionality

- 5-stage CLOS ERB EVPN-VXLAN; single-homed and ESI multihomed servers (LACP + ESI on aggregated interfaces).
- **eBGP underlay and overlay**, with **BFD on both**; ECMP across the fabric.
- EVPN **Type 2 and Type 5** routes; **symmetric IRB** with anycast IP on L3-enabled leaves; IPv4 and IPv6.
- **OISM multicast** (Bridge Domain Not Everywhere / enhanced OISM) on leaves for intra-fabric and external multicast via border-leaf PIM gateways.
- **ECN and PFC QoS** profiles for **RoCEv2** congestion management (DCQCN).
- DHCP, loopback firewall filter, duplicate-MAC detection.
- Inter-VRF connectivity via an external router (route leaking through Apstra connectivity templates).

## Configuration walkthrough (highlights)

The fabric is provisioned via Apstra (logical devices, interface maps, racks, POD templates, a pod-based blueprint). For a 5-stage rack-based template, a **Single ASN allocation schema** is chosen — all spines in a POD share one ASN, and all super spines share another — with **MP-eBGP-EVPN** as the overlay control protocol. IPv4/IPv6 dual stack is selected for underlay and overlay links. Features Apstra 5.0 does not render natively (OISM, ECN/PFC QoS, loopback/firewall filters) are applied via **configlets**.

For Junos EVO devices, a host-profile is set to allocate memory for higher MAC scale:

```
set system packet-forwarding-options forwarding-profile host-profile
```

### Optimized Intersubnet Multicast (OISM)

OISM optimizes L2/L3 multicast in ERB overlays using a **Supplemental Bridge Domain (SBD)** — a dedicated VLAN/IRB (irb.3500 in this JVD) distinct from revenue VLANs, through which remote tenant bridge domains are reachable. This JVD uses **enhanced OISM (BDNE)** so revenue bridge domains need not exist on every leaf. OISM requires **OSPF** on the SBD IRB in each tenant VRF; PIM and IGMP are configured on the leaves.

- **Server / compute leaf:** `enhanced-oism`, SBD `irb.3500`, PIM passive with `accept-remote-source` on the SBD IRB, IGMP snooping proxy, OSPF on lo0.3 + irb.3500 (all other interfaces passive).

  ```
  set forwarding-options multicast-replication evpn irb enhanced-oism
  set routing-instances blue protocols evpn oism supplemental-bridge-domain-irb irb.3500
  set routing-instances blue protocols pim interface irb.3500 accept-remote-source
  set routing-instances blue protocols ospf area 0 interface irb.3500
  ```

- **Storage leaf (QFX5130-32CD):** additionally `conserve-mcast-routes-in-pfe` in the OISM-enabled MAC-VRF to conserve PFE table space (installs only L3 multicast routes).

  ```
  set routing-instances evpn-1 multicast-snooping-options oism conserve-mcast-routes-in-pfe
  ```

- **Border leaf (PIM EVPN gateway):** `pim-evpn-gateway`, connects to the external PIM router via the **Classic L3** method (external RP static); revenue bridge domains `distributed-dr`, SBD standard mode.

  ```
  set routing-instances blue protocols evpn oism pim-evpn-gateway
  set routing-instances blue protocols pim rp static address 100.100.100.100
  set routing-instances blue protocols pim interface irb.1400 distributed-dr
  ```

### RoCEv2 congestion management (DCQCN)

The Compute/Storage/Services design must carry storage traffic reliably. **DCQCN** combines **PFC** (Priority-Based Flow Control — PAUSE per traffic priority) and **ECN** (marks packets at congestion, prompting the source to throttle). Parameters are tuned so ECN triggers before PFC. QoS is applied via configlet on the leaves:

```
set class-of-service drop-profiles dp0 interpolate fill-level 10
set class-of-service drop-profiles dp0 interpolate fill-level 50
set class-of-service drop-profiles dp0 interpolate drop-probability 0
set class-of-service drop-profiles dp0 interpolate drop-probability 20
```

## Results summary

Functional testing on the validated DUTs (Junos OS 23.4R2-S3, Apstra 5.0) detected no issues; all performance parameters were within threshold. The L3 overlay next-hop limit of 28,000 on QFX5130 is reached before other scale limitations. Three scale scenarios were run (50 / 500 / 1000 VLAN-VNIs with IRB).

## Recommendations

- Junos OS **23.4R2-S3** is the minimum recommended version.
- Extending EVPN across multiple PODs in one Apstra blueprint enables any-to-any connectivity, workload redistribution, pod maintenance, and A/S applications across PODs while preserving IP/MAC.
- Apstra 5.0 **custom telemetry + probes** monitor non-native configlet-deployed config (e.g. OSPF for OISM).

## Revision history

| Date | Version | Description |
|------|---------|-------------|
| January 2025 | JVD-DCFABRIC-5STAGE-01-01 | Initial publish |

## Sources

- *5-Stage EVPN-VXLAN Data Center — Juniper Validated Design (JVD)* — JVD-DCFABRIC-5STAGE-01-01 (juniper.net).
- Companion: [solution-overview.md](solution-overview.md), [test-report-brief.md](test-report-brief.md), [datasheet.md](datasheet.md).
