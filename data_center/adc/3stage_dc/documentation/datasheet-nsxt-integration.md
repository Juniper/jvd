# 3-Stage Data Center with Juniper Apstra + VMware NSX-T — Datasheet

> **Juniper Validated Design Extension (JVDE)** · NSX-T Inline Mode · builds on [`3stage-dc`](datasheet.md)
> Quick-reference for the NSX-T integration flavor of the 3-Stage Data Center JVD.

## At a glance

A validated **VMware NSX-T (Inline Mode)** integration on top of the 3-Stage EVPN-VXLAN fabric: the NSX-T Edge terminates on the border leaves, Geneve tunnels are converted to EVPN-VXLAN, and Juniper Apstra correlates the physical underlay with the NSX-T virtual overlay.

| | |
|---|---|
| **JVD** | 3-Stage Data Center Design with Juniper Apstra and VMware NSX-T (JVDE) |
| **Mode** | NSX-T **Inline Mode** |
| **Base fabric** | 3-Stage EVPN-VXLAN ERB ([datasheet.md](datasheet.md)) |
| **Integration point** | NSX-T Edge node terminates on **border leaves**; Geneve ↔ EVPN-VXLAN |
| **Overlay routing** | NSX-T **T0 / T1** gateways; eBGP peering T0 ↔ border leaves (left/right uplink for resiliency); static routes |
| **Apstra role** | vSphere + NSX-T Manager added as External Network Providers / Virtual Infra; IBA underlay↔overlay correlation |
| **Min. validated software** | Junos OS **22.2R3-S3** · Apstra **4.2.1** · NSX-T **3.2** · ESXi **7.0.2**. See juniper.net for the current matrix. |

## Software components

| Component | Version |
|-----------|---------|
| Junos OS / Junos OS Evolved | 22.2R3-S3 (spine/border Evolved 22.2R3-S3.13; leaf 22.2R3-S3.18) |
| Juniper Apstra | AOS 4.2.1-207 |
| NSX-T Edge | nsx-edge-3.2.1.0.0.19232403 |
| NSX-Manager | 3.2.0.1.0.19232396 |
| vSphere Client | 7.0.2 |
| ESXi | 7.0.2, 17630552 or later |

## Featured platforms

Same fabric roles as the base flavor (\* = baseline): **QFX5220-32CD\*** spine; **QFX5120-48Y-8C\*** server leaf (+ QFX5110-48S, EX4400-MP); **QFX5130-32CD\*** border leaf (+ QFX5700, ACX7100-48L, ACX7100-32C, PTX10001-36MR, QFX10002-36Q). External router: MX304. All validated on Junos OS 22.2R3-S3.

## What the integration delivers

| Capability | Delivered by |
|------------|--------------|
| **North-South** (NSX Edge ↔ fabric) | eBGP peering between NSX-T **T0** and border leaves; Geneve tunnels terminate on border leaves and are converted to EVPN-VXLAN |
| **East-West** (fabric hosts ↔ NSX-managed hosts) | Overlay VLAN L2 virtual network associated to a Routing Zone across all fabric leaves |
| **Visibility** | Apstra gathers NSX-T inventory (hosts, clusters, VMs, port groups, vDS/N-vDS, NICs) via the NSX-T API; VM/port/ToR connectivity visibility |
| **Assurance** | Underlay/overlay correlation via **IBA analytics**; fabric-side anomaly detection |
| **Accelerated deployment** | Fabric readied (LAG, MTU, VLAN) per NSX-T transport-node requirements |

## Benefits (validated)

1. Apstra connects to the NSX-T API to gather inventory of hosts, clusters, VMs, port groups, vDS/N-vDS, and NICs.
2. Operator visibility into VMs, VM ports, and ToR connectivity.
3. Issue identification across fabric and virtual infrastructure.
4. Underlay/overlay correlation visibility via IBA analytics.
5. Accelerated NSX-T deployment (fabric ready for LAG/MTU/VLAN).

## References

- **Companion docs:** [design-guide-nsxt-integration.md](design-guide-nsxt-integration.md) · [solution-overview-nsxt-integration.md](solution-overview-nsxt-integration.md) · [test-report-brief-nsxt-integration.md](test-report-brief-nsxt-integration.md)
- **Base flavor:** [datasheet.md](datasheet.md) · [design-guide.md](design-guide.md)
- **Validated Designs index:** https://www.juniper.net/documentation/us/en/software/jvd/
- **Portal:** [JVD portal](https://juniper.github.io/jvd/portal/) · **Configs / snips:** [`../configuration/`](../configuration/)
