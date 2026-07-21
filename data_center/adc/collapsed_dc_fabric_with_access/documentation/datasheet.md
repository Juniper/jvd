# Collapsed Data Center Fabric with Access Switches — Datasheet

> **Juniper Validated Design Extension (JVDE)** · slug `collapsed-access` · collapsed fabric + EX4400 access layer
> Quick-reference for the Collapsed Fabric with Access Switches JVDE. Grounds the [BYOAI](../configuration/snips/byoai/README.md) Design mode.

## At a glance

A **JVD Extension** that adds an **EX4400-48MP access-switch layer** to the [Collapsed Data Center Fabric](../../collapsed_dc_fabric/) to multiply port count (1GbE / 2.5GbE). The access pair is its own direct 2-node EVPN-VXLAN fabric, multihomed **up** to the collapsed leaf pair with an all-active ESI-LAG; servers attach to the access layer. Managed by Juniper Apstra.

| | |
|---|---|
| **JVD / slug** | Collapsed DC Fabric with Access Switches (JVDE) · `collapsed-access` |
| **Track** | Data Center — Apstra Data Center (ADC) |
| **Architecture** | Base collapsed fabric (2 switches) + EX4400 access pair; both tiers ERB EVPN-VXLAN |
| **Underlay / overlay** | Per-tier direct eBGP underlay + eBGP EVPN overlay (collapsed `l3clos-l`/`l3clos-l-evpn`; access `l3clos-a`/`l3clos-a-evpn`); BFD on both |
| **Access VTEP** | EX4400 runs a VLAN-aware MAC-VRF, `vtep-source-interface lo0.0`, `forwarding-options evpn-vxlan` + `vxlan-routing overlay-ecmp` |
| **Interconnect** | All-active ESI-LAG access↔collapsed-leaf uplink; all-active ESI-LAG server↔access |
| **Automation** | Juniper Apstra 4.2.1 |
| **Min. validated software** | Collapsed spine **Junos OS 22.2R3-S3**; EX4400 access **Junos OS 22.4R3**; Apstra **4.2.1**. See juniper.net for the current matrix. |

## Device roles (as shipped in this folder)

| Role | Device(s) | OS | Hostnames | Loopback | AS |
|------|-----------|----|-----------|----------|----|
| Collapsed-spine leaf pair | **QFX5120-48Y** | Junos | `leaf1`, `leaf2` | 192.168.253.0 / .1 | 64800 / 64801 |
| Access switch pair | **EX4400-48MP** | Junos | `access1`, `access2` | 192.168.253.2 / .3 | 64802 / 64803 |
| External router | MX204 | Junos | — | — | — |

> The base collapsed fabric validates five collapsed-spine platforms; only the **EX4400-48MP** was validated for the access-switch role. The shipped configs use the QFX5120-48Y collapsed baseline.

## Protocols & functions

- **Two direct 2-node EVPN fabrics:** the collapsed leaves peer directly (`l3clos-l` / `l3clos-l-evpn`); the access pair peers directly (`l3clos-a` / `l3clos-a-evpn`). Each tier is eBGP underlay + eBGP EVPN overlay with BFD.
- **Access VTEP:** each EX4400 is an EVPN-VXLAN VTEP — VLAN-aware MAC-VRF (`evpn-1`), `vtep-source-interface lo0.0`, `forwarding-options evpn-vxlan shared-tunnels`, `vxlan-routing overlay-ecmp`.
- **ESI-LAG interconnect:** all-active ESI-LAG links the access pair **up** to the collapsed leaves and links **servers down** to the access pair — matching ESI value + LACP system-id on both members.
- **Anycast IRB:** the collapsed leaves provide the anycast L3 gateways.
- **Resilience:** BFD (underlay 1000 ms, overlay 3000 ms); ECMP.

## Use cases

| Use case | Fit |
|----------|-----|
| **Port expansion** | Add ~1 rack of 1GbE / 2.5GbE ports to a collapsed fabric |
| **Budget access layer** | EX4400-48MP as a cost-conscious 1GbE access tier |
| **Small DC growth** | Grow beyond a bare 2-switch collapsed fabric without a full 3-stage design |

## Key results (highlights)

- Multihomed access / access-to-spine link failure convergence **< 50 ms**; node reboot **< 500 ms**.
- Scale: 2,000 VLANs/VNIs/IRBs per leaf; 10,000 total MAC-IP.

## Design concepts (jump-to)

- **Two-tier direct EVPN fabrics** → [design guide § Fabric characteristics](design-guide.md#fabric-characteristics).
- **EX4400 access VTEP + ESI-LAG interconnect** → [design guide § Fabric characteristics](design-guide.md#fabric-characteristics).
- **Convergence & scale** → [test report brief § Performance](test-report-brief.md#performance).

## References

- **Portal:** [JVD portal](https://juniper.github.io/jvd/portal/) (Discover · Learn · Design · Build)
- **Companion docs:** [solution-overview.md](solution-overview.md) · [design-guide.md](design-guide.md) · [test-report-brief.md](test-report-brief.md)
- **Configs / snips:** [`../configuration/conf/`](../configuration/conf/) · [`../configuration/snips/`](../configuration/snips/) · [BYOAI assistant](../configuration/snips/byoai/README.md)
- **Base JVD:** [Collapsed Data Center Fabric](../../collapsed_dc_fabric/) · scale up: [3-stage data center](../../3stage_dc/).
