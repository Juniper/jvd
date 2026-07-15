# Solution Overview — AI Data Center Multitenancy with EVPN/VXLAN

> **JVD-AICLUSTERDC-EVPNType5-01-04** · Juniper Validated Design · GPU backend fabric (GPUaaS)
> Source: *JVD Solution Overview: AI Data Center Multitenancy with EVPN/VXLAN* (juniper.net, V2).
> Companion docs: [design-guide.md](design-guide.md) · [test-report-brief.md](test-report-brief.md) · [datasheet.md](datasheet.md)

## Executive summary

Designing infrastructure for AI services introduces unique challenges: high-performance GPUs for AI training and inference drive massive data volumes and stringent performance demands. AI networks must support large-scale traffic flows, minimize latency and packet loss, and enable predictable workload completion times — requiring not only high-performance hardware and software but also precise configuration and design. This JVD provides validated designs and best practices for deploying **EVPN/VXLAN fabrics that enable GPU as a Service (GPUaaS) and multitenancy** in AI data centers, avoiding vendor lock-in across backend, frontend, and storage fabrics.

## Solution overview

The AI Data Center Multitenancy with EVPN/VXLAN JVD defines best practices, solution components, and configuration guidelines for deploying an **EVPN/VXLAN GPU backend fabric** — based on Juniper QFX Series switches — that supports GPUaaS. The complete AI data center solution comprises three fabrics: **Front-end**, **Storage Backend**, and **GPU Backend**; this JVD focuses on the **GPU Backend fabric**.

**GPU as a Service (GPUaaS)** provides on-demand access to GPU compute, letting multiple teams share data center resources with centralized management and secure isolation. **GPU multitenancy** lets multiple tenants share GPU resources within a common infrastructure — GPUs can be assigned even across servers, each tenant operating in an isolated environment. The fabric must support both:

- **Server Isolation** multitenancy — one or more whole servers assigned to a tenant.
- **GPU Isolation** multitenancy — individual GPUs within a server allocated to different tenants.

## EVPN-VXLAN design approaches

EVPN-VXLAN is the foundation for scalable multitenant GPU backend fabrics, supporting two approaches:

- **Pure Type-5** (IP-VRFs only).
- **VLAN-aware** (MAC-VRFs with symmetric IRB).

Both provide tenant isolation, but the **Type-5 model is better suited for large-scale AI training** — jobs span many servers and GPUs communicate directly over IP with high-throughput, low-latency paths, so Type-5's streamlined IP routing (avoiding MAC learning) is ideal for performance and operational simplicity. Type-5 enables flexible segmentation for both GPU-level and server-level isolation, mapping network isolation boundaries directly to the resource-allocation model.

Performance is further enhanced by a **Rail-Optimized Stripe Architecture** combined with advanced congestion management and load balancing: **DCQCN** (Data Center Quantized Congestion Notification), **PFC** (Priority-Based Flow Control), **ECN** (Explicit Congestion Notification), and **DLB** (Dynamic Load Balancing).

## Benefits

- **Qualified deployments** — prescriptive, best-practice blueprints that deploy quickly and reliably.
- **Scalable** — scales beyond the initial design and supports different hardware platforms.
- **Risk mitigation** — prescriptive implementation guidelines (right products, software versions, architecture, deployment steps).
- **Standards-based** — avoids vendor lock-in across frontend, GPU backend, and storage backend fabrics.

## Sources

- *JVD Solution Overview: AI Data Center Multitenancy with EVPN/VXLAN* — JVD-AICLUSTERDC-EVPNType5-01-04 (juniper.net Validated Designs).
- Companion: [design-guide.md](design-guide.md), [test-report-brief.md](test-report-brief.md), [datasheet.md](datasheet.md).
