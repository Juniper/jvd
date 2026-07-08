# Documentation images

Figures used by the Metro as a Service documentation. Three groups:

## `images/` — shared curated figures (high-resolution)

Used by [`solution-overview.md`](../solution-overview.md) and
[`test-report-brief.md`](../test-report-brief.md).

| File | Figure | Used by |
| --- | --- | --- |
| `maas-reference-architecture.jpg` | Full reference architecture — dual-AS SR-MPLS metro (fabric + multi-ring), multi-instance IS-IS, Flex-Algo/color transport, all services under test | solution-overview.md, test-report-brief.md |
| `maas-featured-devices.png` | Featured devices — Metro Fabric + Metro Multi-Ring topology with device roles and platform legend | test-report-brief.md |

## `images/design-guide/` — design-guide figures

`dg-<page>-<index>.png` — extracted inline from the source Design Guide PDF at
their original positions and referenced from [`design-guide.md`](../design-guide.md).
Regenerate with `pymupdf4llm` (`write_images=True`) from the published PDF.

## `test-reports/images/` — test-report figures

`mef-eline-*.png` — diagrams from the detailed E-Line MEF test report, referenced
from [`test-reports/e-line.md`](../test-reports/e-line.md).

---

The JVD landing page also carries a topology diagram at
[`../../images/Metro-MEF-Topology.png`](../../images/Metro-MEF-Topology.png).
