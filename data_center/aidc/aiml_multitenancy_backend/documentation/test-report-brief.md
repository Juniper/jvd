# Test Report Brief — AI Data Center Multitenancy with EVPN/VXLAN

> **JVD-AICLUSTERDC-EVPNType5-01-04** · Juniper Validated Design · GPU backend fabric
> Source: *JVD Test Report Brief: AI Data Center Multitenancy with EVPN/VXLAN* (juniper.net).
> Companion docs: [design-guide.md](design-guide.md) · [solution-overview.md](solution-overview.md) · [datasheet.md](datasheet.md)

## Introduction

This brief contains qualification results for the AI Data Center Multitenancy with EVPN/VXLAN JVD **GPU Backend fabric**, which provides the infrastructure for GPU-to-GPU communication using **RDMA over Converged Ethernet (RoCEv2)**. The GPU backend fabric is designed as a near-lossless fabric — maximum throughput, minimal latency, minimal network interference for AI traffic. Two multitenancy types are tested: **Server Isolation** (whole servers dedicated to a tenant) and **GPU Isolation** (individual GPUs within a server assigned to different tenants).

### Key tests

- IPv6 underlay BGP operation using **BGP auto-discovery (unnumbered)** peering.
- **IPv6 SLAAC** (Stateless Address Autoconfiguration) for dynamic IPv6 addressing of GPU-server interfaces.
- IPv6 overlay BGP operation; IPv6/IPv4 BGP overlay with EVPN family signaling.
- EVPN-VXLAN control plane with **Type-5 routes (L3 IP-VRFs)**; forwarding-plane IP reachability between IP-VRF instances; pure Type-5 route advertising and installation per tenant IP-VRF.
- Per-tenant end-to-end **RoCEv2** traffic.
- Congestion management using **DCQCN**; load balancing using **DLB**.
- Fault-tolerance testing (link/node failures, failover behavior).

## Test topology

The AI cluster lab has three fabrics — Frontend (IP), Backend Storage (IP), and Backend GPU (IP or EVPN/VXLAN). **Testing for this JVD was limited to the GPU Backend fabric** with EVPN/VXLAN and EVPN BGP Type-5 routes, IPv6 BGP-unnumbered underlay, and both **IPv4 (RFC 5549)** and **IPv6** overlays. Functional testing used RoCEv2 traffic from an IXIA generator; performance testing combined AMD and NVIDIA GPU servers with QFX5240s in leaf and spine roles.

*Table 1 — Topology and devices:*

| Layer | Devices |
|-------|---------|
| Spine | QFX5240-64OD · QFX5230-64CD |
| Leaf | QFX5240-64OD · QFX5230-64CD · 3× QFX5130-32CD |

Leaf↔spine links are **400G × 2**; leaf↔GPU-server links are **1 × 200G**, connected in a rail-optimized architecture. Server-to-leaf connectivity was tested with static IPv4, static IPv6, and SLAAC-assigned IPv6.

*Table 2 — Platforms, controllers, and roles (all Junos OS Evolved 23.4X100-D31):*

| Tag | Role | Model |
|-----|------|-------|
| R0 | Leaf1 | QFX5240-64OD |
| R1 | Leaf2 | QFX5230-64CD |
| R2–R4 | Leaf3–5 | QFX5130-32CD / QFX5130-32QD |
| R5–R6 | Spine1–2 | QFX5240-64OD |
| R7–R8 | Spine3–4 | QFX5230-64CD |
| RT0 | Traffic gen | Ixia (IxOS 10.25) |
| H100-01…04 | GPU server | NVIDIA H100 — CUDA 12.6, NCCL 2.23.4 |
| MI300-01…04 | GPU server | AMD MI300X — RCCL, ROCm 6.3.3 |

## Test plan goals

- Validate **IPv6-only underlay** with BGP-unnumbered auto-discovery peering.
- Validate EVPN-VXLAN **IPv4 overlay** route advertisements using IPv6 next-hops (**RFC 5549**).
- Validate IPv4 and IPv6 **RoCEv2** flows.
- Validate the latest congestion-management knobs (fine-tuning in the 23.4 release):
  - **Optimal alpha-per-queue** setting (dynamic alpha at queue level).
  - **PFC XON limit** for ingress ports.
  - **New CLI stats for ECN-marked packets** per congested queue.
  - **Optimal PFC watchdog** parameters (detect/mitigate PFC pause storms).
- Validate the latest **DLB** optimizations for RoCEv2:
  - **DLB HashBucketSize** (better flow distribution across ECMP links).
  - **Selective DLB for DSCP flows** (prioritize RoCEv2 flows by RDMA opcode via firewall filters + egress-quantization).

## Congestion management (DCQCN)

DCQCN is the industry-standard method for end-to-end congestion control in RoCEv2 environments, combining **ECN** (marking) and **PFC** (per-priority pause) to keep the fabric lossless. Testing exercised the RoCEv2 (UDP dst port 4791) path end-to-end across VTEPs through the VXLAN-EVPN fabric, profiling congestion thresholds to identify optimal values for maximum job performance.

## Sources

- *JVD Test Report Brief: AI Data Center Multitenancy with EVPN/VXLAN* — JVD-AICLUSTERDC-EVPNType5-01-04 (juniper.net Validated Designs).
- Full test-bed configuration archive: contact your Juniper Networks representative.
- Companion: [design-guide.md](design-guide.md), [solution-overview.md](solution-overview.md), [datasheet.md](datasheet.md).
