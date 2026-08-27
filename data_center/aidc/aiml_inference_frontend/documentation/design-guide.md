>
> Faithful markdown conversion of the published PDF:
> [AI Data Center Frontend Fabric for Inference with HPE Juniper QFX switches, Apstra Data Center Director, and AMD Instinct MI300X GPUs — Juniper Validated Design (JVD)](https://www.juniper.net/documentation/us/en/software/jvd/ai-dc-inference-apstra-amd/index.html).
> The PDF on juniper.net is the source of truth. Solution-summary and topology
> diagrams are referred out to the published PDF by figure number and caption. The
> configuration files are in
> [`../configuration/conf/`](../configuration/conf/) and the JVD GitHub repo.

# AI Data Center Frontend Fabric for Inference — HPE Juniper QFX, Apstra Data Center Director, and AMD Instinct MI300X GPUs (JVD)

Juniper Networks Validated Designs provide you with a comprehensive, end-to-end
blueprint for deploying Juniper solutions in your network. These designs are
created by Juniper's expert engineers and tested to ensure they meet your
requirements. Using a validated design, you can reduce the risk of costly
mistakes, save time and money, and ensure that your network is optimized for
maximum performance.

## About this Document

This document describes the design requirements, architecture, implementation
approach, and validation methodology for an AI inference frontend fabric built
with HPE Juniper Networks QFX switches, HPE Juniper Apstra Data Center Director,
and AMD Instinct™ MI300X GPU systems. This JVD also introduces the newest
QFX5140-24CD8O switch as a key frontend leaf node for production of AI inference
deployments.

All validation tests were conducted in Juniper's AI Innovation Lab in Sunnyvale,
CA, USA, where Juniper collaborates closely with customers and technology partners
to develop AI solutions and test deployments for a range of AI applications,
infrastructure architectures, and models.

Modern AI inference environments require predictable latency, scalable throughput,
and efficient resource utilization to support high query volumes and maintain a
consistent user experience. As inference deployments transition from
experimentation to production, the frontend network becomes increasingly important
in enabling reliable communication between inference clients, load balancing
services, and GPU-accelerated compute infrastructure. The AI Inference Network
Design with HPE Juniper Networks QFX switches, and AMD Instinct™ MI300X GPUs
demonstrates how a standards-based Ethernet frontend fabric can efficiently support
AI inference workloads while maintaining predictable performance characteristics.

The solution provides a benchmark-focused reference architecture for AI inference
environments and demonstrates how modern Ethernet-based frontend networks can
support production inference deployments. Through inference performance
benchmarking and frontend network characterization, the solution offers practical
guidance on infrastructure design, software frameworks, operational
considerations, and validated deployment approaches for AI inference workloads.

## Solution Benefits

JVDs are prescriptive blueprints for building data center fabrics using
repeatable, validated, predictable, and well-documented network architecture
solutions with guidelines for successful deployment. Each solution is designed,
tested, and documented by Juniper Networks experts with all the necessary
implementation details, including hardware components, software versions,
connectivity, and configuration steps.

To become a validated solution and be approved for publication, a JVD must pass
rigorous testing with real world workloads and applications. Testing includes
validating the design topology, configuration steps, and product interoperability
so that the solution can be deployed with low risk and predictable behavior.

The core benefits of a JVD solution can be summarized as:

- **Qualified Deployments** — Qualified network design blueprints for data center
  fabrics that follow best practices, meet the requirements of the specific use
  case, and make deployment quicker, simpler, and more reliable.
- **Scalable** — Solutions that can scale beyond the initial design and support the
  adoption of different hardware platforms based on customer requirements.
- **Risk Mitigation** — Prescriptive implementation guidance helps ensure the right
  products, software versions, architecture, and deployment steps are used.
- **Systematically Verified** — Tested solutions use automated and manual
  validation to verify performance and reliability of the components.
- **Predictability** — Detailed testing and documentation of solution capabilities
  and limitations help ensure expected behavior when implemented according to the
  JVD guidelines.
- **Repeatability** — Repeatable network designs allow customers to benefit from
  validated deployment patterns and lessons learned through lab testing and field
  experience.
- **Reliability** — JVD solutions are validated with real traffic and are qualified
  to operate as designed after deployment.
- **Accelerated Deployment** — Step-by-step guidance, automation, and prebuilt
  integrations simplify and accelerate deployment while reducing risk.
- **Accelerated Decision-Making** — Predefined combinations of products, software,
  and architecture reduce the effort required to select components and define the
  network design.
- **Best Practice Networks** — JVDs provide known design characteristics and
  performance profiles that help customers make informed decisions about their
  network.

For inference environments, the frontend fabric connects inference clients, load
balancing services, benchmark tools, and GPU inference servers while supporting
predictable service behavior and operational visibility.

This benchmark-driven JVD describes an inference frontend fabric using HPE Juniper
Networks QFX switches, HPE Juniper Apstra Data Center Director for intent-based
deployment and operations, and AMD Instinct™ MI300X with Connect X7 NICs GPU
systems as inference endpoints. The QFX5140-24CD8O is introduced as a key frontend
leaf node for production inference deployments.

The design validates how a standards-based IP Ethernet frontend fabric can support
inference workloads, while still allowing the fabric to provide the bandwidth,
resiliency, and operational visibility required for production inference
environments.

The solution includes implementation guidance, benchmark methodology, telemetry
guidance, in a repeatable approach for validating inference performance and
frontend fabric behavior.

### Table 1: Inference Fabric Validated Solution Benefits

| Area | Inference Requirement |
|------|-----------------------|
| High-performance inference frontend | Provides high-bandwidth frontend connectivity for inference clients, benchmark tools, load balancing services, and AMD Instinct™ MI300X inference servers. |
| Predictable user experience | Focuses on latency-sensitive inference metrics that influence user-perceived responsiveness. |
| Standards-based Ethernet | Uses a standards-based IP Ethernet fabric design for frontend inference traffic, avoiding dependency on specialized RDMA mechanisms in the validated inference path. |
| Operational simplicity | Uses HPE Juniper Apstra Data Center Director for intent-based data center fabric deployment, validation, and operations. |
| Benchmark reproducibility | Documents benchmark tools, software stack, test matrix, and telemetry to support repeatable inference performance validation. |
| Frontend fabric observability | Correlates inference-serving metrics with frontend fabric telemetry to help operators understand application and network behavior under benchmark load. |
| Path for future services | Provides a base frontend design that can be extended in later updates to include EVPN/VXLAN, multitenancy, and more complex scenarios. |

## Solution Requirements

AI inference is the process of using a trained model to generate predictions,
responses, classifications, summaries, or other outputs from new input data. In
the context of Large Language Models (LLMs), inference typically involves receiving
a user prompt or application request, processing the request through a
model-serving framework, and returning generated tokens as a response.

In production inference environments, the user experience is strongly influenced by
how quickly the system begins responding, how smoothly tokens are generated, and
how consistently the service performs under concurrent request load. These
application-level requirements directly affect the frontend fabric because
inference clients, API gateways, benchmark tools, load balancers, and
model-serving endpoints depend on predictable network connectivity.

### Inference Requirements

Inference differs from model training in both workflow and network behavior.
Training workloads commonly generate large volumes of GPU-to-GPU traffic across
backend fabrics optimized for distributed communication. Inference workloads, by
contrast, are commonly dominated by request/response traffic between clients,
applications, API gateways, load balancers, and inference servers.

For this reason, the frontend fabric for inference is evaluated primarily on its
ability to provide predictable latency, scalable bandwidth, resilient connectivity,
and operational visibility.

#### Table 2: Solution Requirements

| Area | Inference Requirement | Frontend Fabric Impact |
|------|-----------------------|------------------------|
| Latency | Inference services must respond quickly to user or application requests. | The frontend fabric must provide predictable forwarding latency and avoid unnecessary packet loss, queueing, or congestion that could increase response time. |
| Throughput | Inference environments must support high request concurrency and high token generation rates. | The fabric must provide scalable bandwidth between clients, load balancers, and inference servers, so traffic growth does not become a bottleneck. |
| Request distribution | Inference services may scale across multiple GPU servers or model-serving endpoints. | The frontend design must support connectivity to direct inference endpoints and optional load balancing services such as Envoy. |
| Availability | Inference services are commonly production-facing and user-facing. | The frontend design should support resilient paths, stable reachability, and operational visibility across the fabric. |
| Operational simplicity | Inference deployments must be easy to deploy, validate, monitor, and scale. | Intent-based automation and standardized fabric designs reduce deployment complexity and help maintain consistent operations. |

### Inference Traffic Patterns

Inference traffic patterns can vary depending on model size, serving architecture,
parallelism strategy, and deployment model. Some inference deployments may include
GPU-to-GPU communication, KV cache-related traffic, storage access, or other
inference scenarios. This JVD focuses specifically on the frontend inference path,
where traffic is primarily composed of client requests, optional load balancer
distribution, and response delivery.

In this JVD, inference traffic enters the frontend fabric from benchmark or client
systems and is sent either directly to an inference server or to an Envoy load
balancer. When Envoy is used, it provides a single frontend endpoint and
distributes requests across multiple model-serving endpoints running on AMD
Instinct™ MI300X GPU systems.

#### Table 3: AI Training and AI Inference Traffic Comparison

| Characteristic | AI Training | AI Inference |
|----------------|-------------|--------------|
| Primary traffic pattern | GPU-to-GPU communication. | Client/API-to-inference-server communication. |
| Main fabric focus | GPU backend fabric. | Frontend fabric. |
| Common communication model | Collective operations such as all-reduce or all-to-all. | Request/response flows between clients, load balancers, and model-serving endpoints. |
| Typical network technologies | RoCEv2, backend congestion control, rail optimization, and lossless or near-lossless design. | IP Ethernet frontend connectivity, request distribution, latency, throughput, and observability. |
| Common performance indicators | Measure how efficiently the system trains a model, including how efficiently the system uses compute, network, and storage resources. May include overall job or training time, collective communication performance, and workload throughput. | Evaluate how efficiently the system responds to user or application queries. More closely tied to user experience — response time, consistency, and request-handling efficiency (for example, Time to first response/output, Request Latency). |

### Validated Models

To characterize performance across multiple inference scenarios, the solution
validates a range of commonly deployed Large Language Models (LLMs) with different
model sizes and inference characteristics. This allows the benchmark methodology to
evaluate how model scale, request concurrency, GPU utilization, and frontend fabric
behavior interact under different workload profiles.

#### Table 4: Validated Models

| Model | Role in Validation | Expected Inference Characteristic |
|-------|--------------------|-----------------------------------|
| Llama 3.1 8B | Represents a smaller LLM profile. | Lower latency, higher request concurrency, and smaller memory footprint. |
| Llama 3.3 70B | Represents a larger-scale LLM profile. | Higher compute and memory requirements; useful for validating larger model-serving behavior. |
| Qwen 2.5 72B | Represents an alternative large model architecture. | Useful for validating model diversity and advanced conversational or reasoning workload behavior. |

The solution validates inference performance using AMD Instinct™ MI300X GPU systems
and NVIDIA GenAI-Perf as the benchmark load generation tool.

Although NVIDIA GenAI-Perf originates from the NVIDIA ecosystem, it is used in this
solution as an inference benchmarking and workload generation tool for services
running on AMD Instinct MI300X GPU systems. It was selected due to its maturity,
feature completeness, and successful operational integration within the validated
Juniper lab environment.

## Inference Frontend Solution Architecture

Figure 1 summarizes the validated solution components, architecture, workflow,
performance metrics, and solution highlights.

*Figure 1: AI Inference Network Design with Juniper QFX switches and AMD Instinct™
MI300X GPUs solution summary (see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/ai-dc-inference-apstra-amd/index.html)).*

### Frontend Fabric Components

The frontend fabric in this solution includes both hardware and software components
for switching, automation, compute, and application load balancing, as well as
benchmarking components required to validate AI inference traffic.

The following table describes the components included in the validated solution.

#### Table 6: Frontend Fabric Components

| Validated Components | Role in Solution | Description |
|----------------------|------------------|-------------|
| HPE Juniper Networks QFX5130-32CD, QFX5140-24CD8O, QFX5240-64OD | Frontend leaf node | Provides frontend connectivity for compute devices and client applications. |
| HPE Juniper Networks QFX5220-32CD, QFX5230-64CD, QFX5240-64OD | Frontend spine node | Provides the spine layer for the three-stage Clos frontend fabric, enabling redundant high-speed connectivity between the leaf and spine nodes. |
| HPE Juniper Apstra Data Center Director | Intent-based automation | Used to simplify fabric deployment and provide operational consistency. |
| AMD Instinct MI300X GPU servers | Inference compute nodes running model-serving frameworks. | Two AMD MI300X systems are used, each with eight AMD Instinct MI300X GPUs. The systems run SGLang and host the GPU-backed model-serving endpoints. |
| ConnectX-7 NICs | Frontend NICs on the AMD MI300X systems. | Provide 400G frontend connectivity from the MI300X inference servers to the QFX-based frontend fabric. |
| Lambda scalers | Client, benchmark, and load balancing hosts. | Two scaler systems are used. These systems include dual RTX 5000 Ada GPUs and ConnectX-6 frontend NICs. |
| Lambda-Scaler-01 | Envoy load balancer host. | Runs Envoy inside a container and distributes query traffic across the MI300X systems running SGLang. |
| Lambda-Scaler-02 | GenAI-Perf benchmark host. | Runs NVIDIA GenAI-Perf inside a container to generate high-volume inference traffic and collect inference performance metrics. |
| Envoy Proxy | Optional load balancer in front of SGLang inference endpoints. | Used for scale-out request distribution across multiple AMD MI300X inference servers. |
| SGLang | Inference serving framework running on the AMD Instinct MI300X GPU servers. | Loads and runs the validated LLMs on the MI300X systems. It processes inference requests through GPU-backed worker processes to generate responses. In the JVD test environment, each GPU-backed worker runs a local model instance on one AMD Instinct MI300X GPU. |
| SGLang Router | Request routing component running on the AMD Instinct MI300X GPU servers. | Receives inference requests from GenAI-Perf directly or through Envoy and distributes them to local SGLang worker processes on the MI300X server. The router listens on the service port used by the benchmark tests and keeps worker distribution local to the inference server. |
| NVIDIA GenAI-Perf | Inference load generation and benchmark collection tool. | NVIDIA GenAI-Perf is used as the benchmark load generator in the validated lab environment. |

The configuration files used for these components are available in the Juniper JVD
GitHub repository:
<https://github.com/Juniper/jvd/tree/main/data_center/aidc/aiml_inference_frontend>

### Frontend Fabric Topology

The validated frontend fabric topology follows a three-stage Clos leaf-spine IP
fabric architecture with a 3:1 subscription factor.

Figure 3 shows the high-level frontend fabric topology used during testing.

*Figure 3: AI Inference Frontend Fabric Topology (see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/ai-dc-inference-apstra-amd/index.html)).*

The topology used to validate the design included 4 leaf nodes and 2 spine nodes.
As described in Table 6, we validated QFX5130-32CD, QFX5140-24CD8O and QFX5240-64OD
in the leaf node role, and QFX5220-32CD, QFX5230-64CD and QFX5240-64OD in the spine
role.

Each frontend leaf connects to both spine nodes using 2 x 400GbE Ethernet links,
providing redundant and scalable connectivity across the frontend fabric.

The AMD Instinct MI300X GPU servers connect to leaf nodes 3 and 4 using 400GbE
Ethernet links with Connect X7 NICs.

The Lambda scaler devices running Envoy Proxy and GenAI-Perf connect to leaf nodes
1 and 2 using 100GbE Ethernet links with ConnectX-6 NICs.

> **NOTE:** Additional NICs and link speeds may be added in future updates of this
> JVD.

HPE Juniper Apstra Data Center Director assigns the fabric IP addressing,
autonomous system numbers, and other network parameters, and then creates and
deploys the fabric configuration. The point-to-point links between leaf and spine
nodes are assigned /31 addresses from the 10.0.5.0/24 address range, as shown in
Figure 3.

*Figure 3 (Implementation Details): AI Inference Frontend Fabric Implementation
Details (see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/ai-dc-inference-apstra-amd/index.html)).*

The fabric uses eBGP between leaf and spine nodes to provide IP reachability, path
redundancy, and equal-cost forwarding across the Clos topology.

## Validated Inference flows

The inference traffic flows include two primary modes, as shown in Figure 4:

- Single-node inference
- Multi-node (Load balanced) inference

The following sections describe each in more detail.

> **NOTE:** These workflows assume that each validated model instance fits a single
> GPU. More complex serving models, including distributed inference, multi-GPU model
> parallelism, may be explored in future updates of this JVD.

*Figure 4: GenAI-Perf, Envoy, and SGLang Inference Traffic Flow (see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/ai-dc-inference-apstra-amd/index.html)).*

### Single-node Inference

GenAI-Perf sends inference requests directly to an SGLang endpoint running on a
specific MI300X inference server. This mode is useful for validating single-server
inference behavior, establishing baseline, and confirming the performance
characteristics of an individual inference endpoint before introducing external
load balancing.

In the example shown in Figure 4, GenAI-Perf runs on Lambda Scaler 2 using IP
address 10.10.1.34. For direct testing, GenAI-Perf sends inference requests
directly to the SGLang Router running on MI300-01 using destination port 30000. The
destination address shown for this direct path is 10.10.5.25.

This traffic path bypasses Envoy and targets the MI300X inference server directly.
The result is a simpler traffic pattern that is useful for isolating the performance
of a single server, a single model-serving instance, and the frontend fabric path
between the benchmark host and the inference endpoint.

#### Table 7: Single-node Inference Summary

| Field | Example / Purpose |
|-------|-------------------|
| Source | GenAI-Perf client host |
| Example source address | 10.10.1.34 |
| Destination | MI300X inference server |
| Example destination address | 10.10.5.25 |
| Destination port | 30000 for SGLang Router service port |
| Traffic behavior | GenAI-Perf sends requests directly to one inference server. |
| Purpose | Single-server baseline and isolated inference endpoint validation. |

### Multi-node (Load Balanced) Inference

In multi-node load balanced inference, GenAI-Perf sends inference requests to an
Envoy endpoint rather than directly to an MI300X inference server. Envoy then
distributes requests across available MI300X inference servers running model serving
endpoints. After a request reaches an inference server, the SGLang Router distributes
it to local GPU-backed workers, as described in the single-node inference flow.

This mode represents a production-style inference deployment model where users or
applications access a single frontend service endpoint while inference capacity is
distributed across multiple servers.

In the example shown in Figure 4, GenAI-Perf runs on Lambda Scaler 2 using IP
address 10.10.1.34 and sends traffic to Envoy running on Lambda Scaler 1 using IP
address 10.10.1.28. The Envoy frontend endpoint listens on destination port 8000.
After receiving a request, Envoy forwards the request to one of the MI300X inference
servers.

The diagram shows Envoy forwarding traffic to two inference servers: MI300-01 using
destination address 10.10.5.25 and destination port 30000; MI300-02 using
destination address 10.10.6.27 and destination port 30000.

In this mode, the source address seen by the MI300X inference servers is the Envoy
host. This allows the benchmark client to target a single frontend endpoint while
Envoy performs request distribution across the inference servers.

#### Table 8: Multi-node (Load Balanced) Inference Summary

| Field | Example / Purpose |
|-------|-------------------|
| Source | GenAI-Perf client host |
| Example source address | 10.10.1.34 |
| Frontend endpoint | Envoy load balancer |
| Example Envoy address | 10.10.1.28 |
| Envoy frontend port | 8000 |
| Backend endpoints | MI300X inference servers running SGLang |
| Example server 1 | MI300-01, 10.10.15.25, destination port 30000 |
| Example server 2 | MI300-02, 10.10.6.27, destination port 30000 |
| Traffic behavior | GenAI-Perf sends requests to Envoy. Envoy forwards requests to inference servers. |
| Purpose | Scale-out inference validation across multiple inference servers. |

### SGLang Router and Worker Behavior

In SGLang-based tests, each AMD Instinct MI300X system runs SGLang in data-parallel
serving mode. The selected LLM is loaded once per GPU, resulting in eight local
GPU-backed model instances per server. Each MI300X server runs one SGLang Router,
which receives incoming inference requests and distributes them across local SGLang
worker processes.

The SGLang Router listens for incoming inference requests on the service port used
by the test, shown as port 30000 in the test diagram. After receiving a request, the
router forwards the request internally to one of the local GPU-backed workers.

Each worker is associated with one GPU and hosts one local model instance. In the
example topology, workers listen locally using loopback addressing and ports in the
3100X range, where X represents the local worker index.

Worker traffic is local to the MI300X server and is not frontend fabric traffic. The
frontend fabric carries requests to the SGLang Router; after that, the router
distributes each request internally. This distinction is important because the
frontend fabric validation focuses on the client-to-router or Envoy-to-router
traffic path, not on loopback traffic inside the inference server.

#### Table 9: SGLang Router and Worker Behavior

| Layer | Function |
|-------|----------|
| GenAI-Perf | Generates inference benchmark traffic toward either a direct inference endpoint or an Envoy endpoint. |
| Envoy Load Balancer | Optionally distributes incoming requests across multiple MI300X inference servers. |
| SGLang Router | Receives inference requests on the MI300X server and routes them to local GPU-backed workers. |
| SGLang Workers | Run model instances on GPUs and process inference requests. |

#### Table 10: Example SGLang Worker Mapping

| Worker | Local Address | Local Port |
|--------|---------------|------------|
| Worker 0 | 127.0.0.1 | 31000 |
| Worker 1 | 127.0.0.1 | 31001 |
| Worker 2 | 127.0.0.1 | 31002 |
| Worker 3 | 127.0.0.1 | 31003 |
| Worker 4 | 127.0.0.1 | 31004 |
| Worker 5 | 127.0.0.1 | 31005 |
| Worker 6 | 127.0.0.1 | 31006 |
| Worker 7 | 127.0.0.1 | 31007 |

## Benchmarking Testing Methodology

The validated benchmark methodology uses NVIDIA GenAI-Perf to generate high volumes
of inference for each of the models described in the Validated Models section.

Both single-node and multi-node load balanced scenarios as described in the
Validated Inference flows section.

All the test scenarios were completed following these steps:

1. Generates benchmark inference requests from the client host using GenAI-Perf
   either directly to an MI300X inference server or to the Envoy Load Balancer. When
   generating benchmark inference requests the following parameters were adjusted to
   extract the best performance, and the following inference metrics were collected:

#### Table 11: GenAI-Perf Inference request parameters

| Parameter | Description |
|-----------|-------------|
| Concurrency | Number of simultaneous inference requests or active request streams generated during the benchmark test. Increasing concurrency helps evaluate how the inference service behaves under higher demand. |
| Number of Requests | Total number of inference requests generated during the benchmark run. This value determines the size of the test sample used to calculate performance metrics. |
| Input Sequence Length (ISL) [tokens] | Number of input tokens included in each request or prompt sent to the inference service. |
| Output Sequence Length (OSL) [tokens] | Number of output tokens generated by the model in each response. |
| Warm-up | Number of initial requests sent before the measured benchmark run begins. These requests are not included in the final reported performance results. Warm-up helps reduce the effect of startup behavior, model initialization, caching, and other transient conditions. |

ISL represents the prompt size, while OSL represents the generated response size. In
general, larger ISL values increase the amount of input the model must process
before generating the first token, while larger OSL values increase the amount of
generated output produced during the response.

2. Collect and analyze inference performance metrics generated by GenAI-Perf.

The following inference performance metrics were included:

#### Table 12: Inference Performance Metrics

| Category | Metric | Description |
|----------|--------|-------------|
| Responsiveness | Time to First Token (TTFT) | Measured in milliseconds. Elapsed time between request submission and the first generated token. Indicates perceived responsiveness and interactive user experience. |
| Responsiveness | Time to First Output (TTFO) | Measured in milliseconds. Elapsed time between request submission and the first output received by the client. For streaming text generation, this is often closely related to TTFT. |
| Request Latency | Request Latency | Measured in milliseconds. Total elapsed time from request submission to completed response. Captures full user-facing response time. |
| Streaming Performance | Time to Second Token (TTST) | Measured in milliseconds. Elapsed time between request submission and the second generated token. Helps characterize early streaming behavior after the first token is returned. |
| Streaming Performance | Inter-Token Latency (ITL) | Measured in milliseconds. Delay between generated output tokens during response streaming. Indicates response smoothness and token generation consistency. |
| Throughput | Output Tokens per Second (TPS) | Measured in tokens per second. Rate of output token generation by the system. Measures aggregate inference throughput and serving efficiency. |
| Throughput | Output Tokens per Second per User | Measured in tokens per second per user. Average output token generation rate experienced by each concurrent user or request stream. |
| Throughput | Request Throughput | Measured in requests per second. Number of inference requests completed by the system per second. Indicates how many requests the service can handle under benchmark load. |

The test results can be found in the AI Data Center Frontend Fabric for Inference
with HPE Juniper QFX switches, Apstra Data Center Director, and AMD Instinct MI300X
GPUs — Juniper Validated Design (JVD) Test Report.

## Validated Hardware and Software Components

The following table summarizes the software versions tested and validated by role
for this JVD.

### Table 13: Validated Hardware and Software

| Device / Software | Role | Version / Release |
|-------------------|------|-------------------|
| QFX devices | Frontend leaf and spine nodes | 25.2X100-D20.4-EVO |
| AMD MI300X server | Inference GPU server | Ubuntu 22.04.5 LTS; 6.8.0-111-generic |
| HPE Juniper Apstra Data Center Director | Fabric automation and operations | 6.1 |
| SGLang | Inference serving framework | 0.4.5 |
| SGLang Router | Request routing across local GPU-backed workers | 0.1.4 |
| Envoy Proxy Service | Load balancing across MI300X inference servers | 1.35.3 |
| NVIDIA GenAI-Perf | Inference benchmark load generator | Nvidia GenAI-Perf 0.0.11 |
| Models | Inference workloads used to validate performance across different model sizes, concurrency levels, latency profiles, and frontend fabric traffic patterns. | Llama 3.1 8B, Llama 3.3 70B, Qwen 2.5 72B |

> **NOTE:** The Juniper products and software versions listed above pertain to the
> latest validated configuration for this JVD. Different hardware models and software
> versions may be tested and added to future design recommendations.

## Validated Optics Summary

### Table 14: Validated Frontend Fabric Optics

Each row lists a component optic and its peer-component optic across a validated
link.

| Part number | Optics / Cable Name | Device Model | Device Role | Peer Part number | Peer Optics / Cable | Peer Device Model | Peer Device Role |
|-------------|---------------------|--------------|-------------|------------------|---------------------|-------------------|------------------|
| 740-058734 | QSFP-100GBASE-SR4 | QFX5130-32CD, QFX5140-24CD8O, QFX5240-64OD | Leaf Node | 740-061405 | QSFP-100GBASE-SR4 | lambda-scaler | Envoy Load Balancer / GenAI-Perf client |
| 740-061405 | QSFP-100GBASE-SR4-T2 | QFX5130-32CD, QFX5140-24CD8O, QFX5240-64OD | Leaf Node | 740-061405 | QSFP-100GBASE-SR4 | lambda-scaler | Envoy Load Balancer / GenAI-Perf client |
| 740-174933 | OSFP-800G-DR8-2-P | QFX5130-32CD, QFX5140-24CD8O, QFX5240-64OD | Leaf Node | 740-085351 | QSFP56-DD-400GBASE-DR4 | QFX5220-32CD, QFX5230-64CD, QFX5240-64OD | Spine Node |
| 740-085351 | QSFP56-DD-400GBASE-DR4 | QFX5130-32CD, QFX5140-24CD8O, QFX5240-64OD | Leaf Node | 740-085351 | QSFP56-DD-400GBASE-DR4 | QFX5220-32CD, QFX5230-64CD, QFX5240-64OD | Spine Node |
| 740-169887 | QSFP-400G-DR4-2 | QFX5140-24CD8O | Leaf Node | 740-169887 | QSFP-400G-DR4-2 | AMD MI300 ConnectX-7 | GPU Server |
| 740-058734 | QSFP-100GBASE-SR4 | QFX5130-32CD, QFX5140-24CD8O, QFX5240-64OD | Leaf Node | 740-061405 | QSFP-100GBASE-SR4 | lambda-scaler | Envoy Load Balancer / GenAI-Perf client |

## Recommendations

Use QFX5130-32CD, QFX5140-24CD8O, or QFX5240-64OD switches as frontend leaf nodes.

Use QFX5220-32CD, QFX5230-64CD or QFX5240-64OD switches as frontend spine nodes.

Use HPE Juniper Apstra Data Center Director to automate deployment and monitor the
frontend fabric.

Implement the solution following the minimum recommended software releases:

- All QFX devices: Junos OS Evolved 25.2X100-D20.4-EVO
- HPE Juniper Apstra Data Center Director: 6.1

To replicate the benchmarking testing described in this document use:

- SGLang 0.4.5
- SGLang Router 0.1.4
- Envoy Proxy Service 1.35.3
- NVIDIA GenAI-Perf 0.0.11
- Llama 3.1 8B, Llama 3.3 70B, and Qwen 2.5 72B

## Revision History

| Date | Version | Description |
|------|---------|-------------|
| June 2026 | JVD-AIDC-INFERENCE-01-01 | Initial JVD. |

---

## Sources

- Published document: [AI Data Center Frontend Fabric for Inference JVD](https://www.juniper.net/documentation/us/en/software/jvd/ai-dc-inference-apstra-amd/index.html)
- Companion docs: [`solution-overview.md`](solution-overview.md), [`test-report-brief.md`](test-report-brief.md), [`datasheet.md`](datasheet.md)
- Configs: [`../configuration/conf/`](../configuration/conf/)
