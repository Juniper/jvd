# Documentation figures — AI Data Center Frontend Fabric for Inference

Figures extracted from the published Juniper Validated Design PDFs and used by the markdown design corpus in this folder. Diagrams © Juniper Networks; reproduced from the public JVD documents on juniper.net.

| File | Figure | Source |
|------|--------|--------|
| [`solution-summary.png`](solution-summary.png) | Validated solution components, architecture, inference workflow, key performance metrics, and highlights | *Solution Overview / Design Guide*, Figure 1 |
| [`frontend-fabric-topology.png`](frontend-fabric-topology.png) | 3-stage Clos frontend fabric — 4 leaf + 2 spine, link speeds, Lambda Scaler / Envoy / GenAI-Perf and AMD MI300X placement, Apstra + OOB management | *Design Guide / Test Report*, Figure 2/3 |
| [`inference-traffic-flow.png`](inference-traffic-flow.png) | GenAI-Perf, Envoy, and SGLang inference traffic flow — single node (direct) and multinode (Envoy) paths with example addressing/ports | *Design Guide*, Figure 4 |
| [`ttft-comparison.png`](ttft-comparison.png) | Time to First Token by model — single node SGLang vs multinode Envoy | *Test Report*, Figure 5 |
| [`tps-comparison.png`](tps-comparison.png) | Output token throughput by model — single node SGLang vs multinode Envoy | *Test Report*, Figure 6 |

Referenced from [solution-overview.md](../solution-overview.md), [design-guide.md](../design-guide.md), and [test-report-brief.md](../test-report-brief.md).

## Regenerating

Full-graphic figures are extracted from the source PDFs with `pdfimages -all` (embedded rasters); composited diagram/chart pages are rendered with `pdftoppm -png` and cropped to the figure. The source PDFs are not stored in the repo — they are the published documents on juniper.net.
