# AI Data Center Multitenancy with EVPN/VXLAN — Datasheet

> **JVD-AICLUSTERDC-EVPNType5-01-04** · slug `aiml-mtb` · GPU backend fabric for GPUaaS multitenancy
> Quick-reference for the AI/ML Multitenancy JVD. Grounds the [BYOAI](../configuration/snips/byoai/README.md) Design mode.

## At a glance

A validated **EVPN/VXLAN GPU backend fabric** that delivers **GPU as a Service (GPUaaS)** with secure multi-tenant isolation for AI/ML training and inference — a lossless RoCEv2 fabric on a rail-optimized 3-stage Clos of Juniper QFX5240-series switches.

| | |
|---|---|
| **JVD / slug** | AI Data Center Multitenancy with EVPN/VXLAN · `aiml-mtb` |
| **Track** | Data Center — AI (AIDC) |
| **Architecture** | 3-stage Clos, rail-optimized stripe; pure **EVPN Type-5** (IP-VRF per tenant) |
| **Transport** | IPv6 link-local (unnumbered) eBGP underlay + eBGP EVPN overlay; VXLAN; IPv4 overlay via **RFC 5549** |
| **AI fabric** | **RoCEv2** lossless; **DCQCN** (PFC + ECN); **DLB** (Dynamic Load Balancing); **IPv6 SLAAC** GPU addressing |
| **Tenancy** | Server Isolation & GPU Isolation |
| **Validation** | GPU backend fabric — control/forwarding plane, per-tenant RoCEv2, congestion, DLB, fault tolerance (AI Innovation Lab) |
| **Min. validated software** | Junos OS Evolved **23.4X100-D31** (recommended 23.4X100-D31.6-EVO). See juniper.net for the current matrix. |

## Device roles (GPU backend fabric)

| Role | Function in the network |
|------|-------------------------|
| **Spine** (lean) | IP forwarding between leaves; pure-L3 eBGP Clos; no VTEP/services |
| **Leaf** | Per-tenant EVPN Type-5 IP-VRF, IRB anycast gateway, GPU-server rail links; RoCEv2 lossless + DLB |

## Featured platforms

Software = minimum validated release; regression re-validates on newer releases (see juniper.net for the current set).

| Fabric role | Device(s) | Min. validated software |
|-------------|-----------|--------------------------|
| GPU Backend Leaf | **QFX5240-64OD** (also QFX5230-64CD, QFX5130-32CD tested) | Junos OS Evolved 23.4X100-D31 |
| GPU Backend Spine | **QFX5240-64OD / QFX5240-64CD** (also QFX5230-64CD) | Junos OS Evolved 23.4X100-D31 |

**GPU servers validated:** NVIDIA **H100** DGX (CUDA 12.6, NCCL 2.23.4) · AMD **MI300X** (RCCL, ROCm 6.3.3). **Storage:** Vast. **Traffic generation:** Ixia (IxOS 10.25). Leaf↔spine 400G×2; leaf↔server 1×200G rail-optimized.

## Protocols & functions

- **Underlay / transport:** IPv6 link-local (unnumbered) fabric; **eBGP auto-discovery** peering; ECMP.
- **Overlay / services:** eBGP EVPN; VXLAN; **EVPN Type-5** (IP-prefix) routes; one **IP-VRF per tenant** → L3 VNI; IPv4-over-IPv6 via **RFC 5549**.
- **Addressing:** **IPv6 SLAAC** for GPU-server interfaces (via IPv6 Router Advertisement `rio-prefix`); static IPv4/IPv6 also supported.
- **AI-fabric performance:** **RoCEv2** lossless transport; **DCQCN** = PFC + ECN (alpha-per-queue, PFC XON limit, ECN-marked stats, PFC watchdog); **DLB** (HashBucketSize, selective DLB for DSCP flows) instead of traditional ECMP.
- **Assurance:** buffer-monitor telemetry, L2-learning telemetry, LLDP, gRPC streaming.

## Services & use cases

| Service | What it delivers | Means of delivery |
|---------|------------------|-------------------|
| **Per-tenant IP-VRF (EVPN Type-5)** | Secure L3 tenant isolation on a shared GPU backend | `ip-prefix-routes` VRF, per-tenant VNI, IRB anycast gateway, GPU-server rail links |

**Intent-based use cases** compose *tenant isolation model* (Server Isolation vs GPU Isolation) × *EVPN Type-5 IP-VRF* × *RoCEv2 lossless transport* (DCQCN + DLB) × *rail-optimized placement*. See the [design guide](design-guide.md) and [test report brief](test-report-brief.md).

## Design concepts (jump-to)

- **Rail-optimized stripe** — rails, stripes, 1:1 subscription, max GPUs/stripe → [design guide § Solution architecture](design-guide.md#rail-optimized-stripe-architecture).
- **Multitenancy** — Server vs GPU isolation → [design guide § Multitenancy models](design-guide.md#multitenancy-models).
- **Type-5 EVPN/VXLAN** — IP-VRF per tenant, IPv6 underlay + RFC 5549 → [design guide § Solution implementation](design-guide.md#solution-implementation-type-5-evpnvxlan).
- **Congestion & load balancing** — DCQCN (PFC/ECN), DLB → [design guide § Recommendations](design-guide.md#recommendations).

## References

- **JVD page (juniper.net):** [AI Data Center Multitenancy with EVPN/VXLAN](https://www.juniper.net/documentation/us/en/software/jvd/jvd-ai-dc-evpn-multitenancy/index.html)
- **Validated Designs index:** https://www.juniper.net/documentation/us/en/software/jvd/
- **Portal:** [JVD portal](https://juniper.github.io/jvd/portal/) (Discover · Learn · Design · Build) — Config Generator at [#generator](https://juniper.github.io/jvd/portal/#generator)
- **Companion docs:** [solution-overview.md](solution-overview.md) · [design-guide.md](design-guide.md) · [test-report-brief.md](test-report-brief.md)
- **Configs / snips:** [`../configuration/conf/`](../configuration/conf/) · [`../configuration/snips/`](../configuration/snips/) · [BYOAI assistant](../configuration/snips/byoai/README.md)
