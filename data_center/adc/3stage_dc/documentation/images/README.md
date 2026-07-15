# Documentation figures — 3-Stage Data Center

Figures extracted from the published Juniper Validated Design PDFs and used by the markdown design corpus in this folder. Diagrams © Juniper Networks; reproduced from the public JVD documents on juniper.net.

## Base flavor (IPv4 underlay)

| File | Figure | Source document |
|------|--------|-----------------|
| [`base/reference-architecture.png`](base/reference-architecture.png) | 3-Stage reference architecture — spine / server-leaf / border-leaf roles with baseline device models and single / ESI / border-leaf-pair rack types | *3-Stage EVPN/VXLAN Fabric with Juniper Apstra — JVD* |
| [`base/lab-topology.jpg`](base/lab-topology.jpg) | 3-Stage lab topology — DC1 spines, single leaf, ESI leaf pairs (AE1/AE2 ESI), border leaves, external router, and test ports (TP1–TP17) | *3-Stage EVPN/VXLAN Fabric with Juniper Apstra — JVD* |

Referenced from [design-guide.md](../design-guide.md).

## NSX-T integration variant

| File | Figure | Source document |
|------|--------|-----------------|
| [`nsxt/reference-topology.png`](nsxt/reference-topology.png) | 3-Stage reference topology with VMware NSX-T — DC1/DC2 fabric, NSX Edge, vCenter, NSX-T Manager, and ESXi servers | *3-Stage Data Center Design with Juniper Apstra and VMware NSX-T (Inline Mode) — JVDE* |

Referenced from [design-guide-nsxt-integration.md](../design-guide-nsxt-integration.md).

## IPv6 underlay variant

No figures are mirrored for the IPv6 underlay variant — its source is a pre-publication Word document. Add topology figures here once the IPv6 underlay JVD (`JVD-DCFABRIC-3STAGE-IPV6-01-01`) is published as a PDF on juniper.net.

## Regenerating

Figures are extracted from the source PDFs with `pdfimages -all` (embedded rasters) or `pdftoppm -png` (vector-diagram pages), then copied here with descriptive names. The source PDFs are not stored in the repo — they are the published documents on juniper.net.
