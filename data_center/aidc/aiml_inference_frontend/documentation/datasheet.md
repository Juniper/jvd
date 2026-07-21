# AI Data Center Frontend Fabric for Inference — Datasheet

> **JVD-AICLUSTERDC-AIMLINF-01-01** · slug `aiml-inf` · standards-based Ethernet frontend fabric for AI inference
> Quick-reference for the AI Inference Frontend JVD. Grounds the [BYOAI](../configuration/snips/byoai/README.md) Design mode.

## At a glance

A validated **3-stage Clos Ethernet IP frontend fabric** that connects AI **inference clients, Envoy load balancers, and AMD Instinct MI300X GPU servers** over HPE Juniper QFX switches managed by HPE Juniper Apstra Data Center Director. The design characterizes production inference performance (TTFT / TPS) across single node and multinode (Envoy scale-out) paths, and introduces the **QFX5140-24CD8O** as a frontend leaf platform.

| | |
|---|---|
| **JVD / slug** | AI Data Center Frontend Fabric for Inference · `aiml-inf` |
| **Track** | Data Center — AI (AIDC) |
| **Architecture** | 3-stage Clos leaf-spine IP fabric; 3:1 subscription; 4 leaf + 2 spine validated |
| **Transport** | eBGP leaf-spine underlay; /31 point-to-point (10.0.5.0/24); 400GbE / 800GbE fabric; ECMP |
| **Inference path** | Standards-based IP Ethernet frontend; **SGLang** serving; optional **Envoy** load balancer; **NVIDIA GenAI-Perf** benchmark |
| **Automation** | HPE Juniper Apstra Data Center Director (intent-based deploy + operate) |
| **Validation** | Inference-serving benchmark (TTFT, ITL, TPS, request latency/throughput) across 20 test cases in the AI Innovation Lab |
| **Min. validated software** | Junos OS Evolved **25.2X100-D20.4-EVO**; Apstra Data Center Director **6.1**. See juniper.net for the current matrix. |

## Device roles

| Role | Function in the network |
|------|-------------------------|
| **Spine** | 3-stage Clos spine; eBGP leaf-spine IP forwarding; redundant high-speed leaf interconnect |
| **Leaf** (client-facing) | Connects Lambda Scaler hosts running GenAI-Perf and the Envoy load balancer (100GbE, ConnectX-6) |
| **Leaf** (GPU-facing) | Connects AMD Instinct MI300X inference servers (400GbE, ConnectX-7) |

## Featured platforms

Software = minimum validated release; regression re-validates on newer releases (see juniper.net for the current set).

| Fabric role | Device(s) | Min. validated software |
|-------------|-----------|--------------------------|
| Frontend leaf | **QFX5130-32CD**, **QFX5140-24CD8O**, **QFX5240-64OD** | Junos OS Evolved 25.2X100-D20.4-EVO |
| Frontend spine | **QFX5220-32CD**, **QFX5230-64CD**, **QFX5240-64OD** | Junos OS Evolved 25.2X100-D20.4-EVO |

**Inference compute:** 2 × AMD Instinct **MI300X** servers (8 GPUs each), ConnectX-7 400G NICs, Ubuntu 22.04.5 LTS. **Client/LB hosts:** 2 × Lambda Scaler (dual RTX 5000 Ada, ConnectX-6 100G). **Serving stack:** SGLang 0.4.5 · SGLang Router 0.1.4 · Envoy 1.35.3 · NVIDIA GenAI-Perf 0.0.11.

## Protocols & functions

- **Underlay / transport:** eBGP between leaf and spine; /31 point-to-point links; ECMP across the Clos; 400GbE / 800GbE fabric links.
- **Fabric automation:** HPE Juniper Apstra Data Center Director assigns IP addressing, ASNs, and fabric parameters, then deploys per-device configuration.
- **Inference serving:** SGLang data-parallel serving (one model instance per GPU); SGLang Router distributes requests to local GPU-backed workers (service port 30000); optional Envoy frontend endpoint (port 8000) for scale-out request distribution.
- **Benchmarking:** NVIDIA GenAI-Perf generates inference load and collects TTFT, TTFO, TTST, ITL, Output TPS (and per-user), request latency, and request throughput.

## Inference flows & use cases

| Inference flow | What it delivers | Means of delivery |
|----------------|------------------|-------------------|
| **Single node** | Baseline responsiveness/throughput for one inference server | GenAI-Perf → SGLang Router (direct, port 30000) → local GPU workers |
| **Multinode (Envoy)** | Scale-out inference across multiple servers behind one frontend endpoint | GenAI-Perf → Envoy (port 8000) → multiple MI300X SGLang servers → local GPU workers |

**Validated workloads** compose *model family* (Llama 3.1 8B · Llama 3.3 70B · Qwen 2.5 72B) × *precision* (FP16 · FP8) × *context profile* (short · long) × *serving path* (single node · multinode Envoy) — 20 benchmark test cases. See the [design guide](design-guide.md) and [test report brief](test-report-brief.md).

## Key results (highlights)

- Multinode Envoy scale-out increased output token throughput for **every** matched model and context profile.
- Llama 3.1 8B FP16 short context scaled ~**2.07×** (85.7k → 177.8k tokens/sec) from single node to multinode.
- Short-context TTFT was generally in the few-hundred-millisecond range; long-context and larger models increased TTFT (prefill-bound).

## Design concepts (jump-to)

- **Frontend fabric topology** — 3-stage Clos, 3:1 subscription, eBGP underlay → [design guide § Frontend fabric topology](design-guide.md#frontend-fabric-topology).
- **Validated inference flows** — single node vs multinode Envoy, SGLang Router/worker behavior → [design guide § Validated inference flows](design-guide.md#validated-inference-flows).
- **Benchmark methodology** — GenAI-Perf parameters and metrics → [design guide § Benchmark testing methodology](design-guide.md#benchmark-testing-methodology).
- **Results** — TTFT and TPS comparison → [test report brief § Inference performance results](test-report-brief.md#inference-performance-results).

## References

- **JVD page (juniper.net):** [AI Data Center Frontend Fabric for Inference](https://www.juniper.net/documentation/us/en/software/jvd/jvd-ai-dc-inference-apstra-amd/index.html)
- **Validated Designs index:** https://www.juniper.net/documentation/us/en/software/jvd/
- **Portal:** [JVD portal](https://juniper.github.io/jvd/portal/) (Discover · Learn · Design · Build)
- **Companion docs:** [solution-overview.md](solution-overview.md) · [design-guide.md](design-guide.md) · [test-report-brief.md](test-report-brief.md)
- **Configs / snips:** [`../configuration/conf/`](../configuration/conf/) · [`../configuration/snips/`](../configuration/snips/) · [BYOAI assistant](../configuration/snips/byoai/README.md)
- **Companion JVD:** [AI/ML Multitenancy Backend Fabric](../../aiml_multitenancy_backend/) — the GPU-to-GPU backend network for training workloads.
