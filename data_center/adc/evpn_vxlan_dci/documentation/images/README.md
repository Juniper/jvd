# Documentation figures — EVPN-VXLAN Data Center Interconnect (DCI)

Figures extracted from the published Juniper Validated Design PDFs and used by the markdown design corpus in this folder. Diagrams © Juniper Networks; reproduced from the public JVD documents on juniper.net.

| File | Figure | Source |
|------|--------|--------|
| [`dci-ott-design.png`](dci-ott-design.png) | Over-the-Top (OTT) design — two 3-stage data centers, L2 stretch tenant VXLAN tunnels across an ISP L2 handoff, MACSEC-capable border leaves | *Solution Overview*, Figure 1 |
| [`dci-type2-seamless-design.png`](dci-type2-seamless-design.png) | Type 2 seamless stitching — 3-stage ↔ collapsed fabric; local VXLAN tunnels terminate at border leaves, DCI VXLAN tunnels between sites | *Solution Overview*, Figure 2 |
| [`dci-type2-type5-seamless-design.png`](dci-type2-type5-seamless-design.png) | Type 2 + Type 5 seamless stitching — 3-stage ↔ 5-stage fabric; L2 and L3 local VXLAN tunnels terminate at border leaves | *Solution Overview*, Figure 3 |

Referenced from [solution-overview.md](../solution-overview.md).

## Regenerating

Figures are extracted from the source PDFs with `pdfimages -png` (embedded rasters). The source PDFs are not stored in the repo — they are the published documents on juniper.net. Clean design diagrams are also available at the JVD's top-level [`../../images/`](../../images/).
