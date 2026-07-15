# Documentation figures — AI Data Center Multitenancy with EVPN/VXLAN

Figures extracted from the published Juniper Validated Design PDF and used by the markdown design corpus in this folder. Diagrams © Juniper Networks; reproduced from the public JVD document on juniper.net.

| File | Figure | Source |
|------|--------|--------|
| [`reference-design.jpg`](reference-design.jpg) | AI JVD reference design — frontend, GPU backend, and storage backend fabrics (QFX5130 / QFX5240 / QFX5220), NVIDIA + AMD GPU servers, WEKA + Vast storage | *AI Data Center Multitenancy with EVPN/VXLAN — JVD*, Figure 1 |
| [`rail-optimized-stripe.jpg`](rail-optimized-stripe.jpg) | Rails in a rail-optimized architecture — the Nth GPU on each server connects to the Nth leaf (Nth rail), 8 rails | *AI Data Center Multitenancy with EVPN/VXLAN — JVD*, Figure 9 |

Referenced from [design-guide.md](../design-guide.md).

## Regenerating

Figures are extracted from the source PDF with `pdfimages -all` (embedded rasters), then copied here with descriptive names. The source PDF is not stored in the repo — it is the published document on juniper.net.
