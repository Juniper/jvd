# Documentation images

Figures referenced by the Metro as a Service documentation. Drop the exported
PNG/SVG figures here and update the links in the markdown to point at
`images/<file>`.

Until a dedicated export is added, the docs reference the existing JVD topology
diagram at [`../../images/Metro-MEF-Topology.png`](../../images/Metro-MEF-Topology.png).

## Figures to add

| Suggested filename | Source | Used by |
| --- | --- | --- |
| `maas-reference-topology.png` | Design Guide — reference topology | design-guide.md, solution-overview.md |
| `sr-mpls-flex-algo-transport.png` | Design Guide — transport classes (Gold/Bronze/Best Effort) | design-guide.md |
| `metro-edge-gateway.png` | Design Guide — MEG border-leaf placement | design-guide.md |
| `mef-service-types.png` | Design Guide — E-Line/E-LAN/E-Tree/E-Access EVC topologies | design-guide.md |

> Figures cannot be extracted from the source PDFs automatically; export them from
> the published JVD and place them here, then swap the markdown links from
> `../images/Metro-MEF-Topology.png` to the local `images/<file>` equivalents.
