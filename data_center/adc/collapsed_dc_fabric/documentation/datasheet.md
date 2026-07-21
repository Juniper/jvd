# Collapsed Data Center Fabric — Datasheet

> **JVD-DCFABRIC-COLLAPSED-01-02** · slug `collapsed` · two-switch EVPN-VXLAN collapsed-spine fabric
> Quick-reference for the Collapsed Data Center Fabric JVD. Grounds the [BYOAI](../configuration/snips/byoai/README.md) Design mode.

## At a glance

A validated **two-switch EVPN-VXLAN collapsed-spine fabric** for small data centers — the two switches perform spine, leaf, and border-leaf roles simultaneously and peer **directly** (no separate spine tier). ERB overlay with anycast IRB, ESI-LAG multihoming, and border-gateway connectivity to an external router. Managed by Juniper Apstra.

| | |
|---|---|
| **JVD / slug** | Collapsed Data Center Fabric · `collapsed` |
| **Track** | Data Center — Apstra Data Center (ADC) |
| **Architecture** | Collapsed spine (2 switches = spine + leaf + border leaf); ERB EVPN-VXLAN |
| **Underlay / overlay** | eBGP underlay (`l3clos-l`, direct leaf-to-leaf) + eBGP EVPN overlay (`l3clos-l-evpn`, over loopbacks); BFD on both; ECMP fast re-route |
| **Routing** | VLAN-aware MAC-VRF (1 VNI per VLAN); symmetric anycast IRB; EVPN Type-2 + Type-5; per-VRF eBGP to external router |
| **Multihoming** | ESI-LAG (AE bundle + ESI + LACP) to dual-home servers / access switches |
| **Automation** | Juniper Apstra 4.2.1 |
| **Min. validated software** | Junos OS **23.4R2-S3**; Apstra **4.2.1**. See juniper.net for the current matrix. |

## Device roles (as shipped in this folder)

The configurations in [`../configuration/conf/`](../configuration/conf/) cover the two collapsed-spine leaves.

| Role | Device(s) | OS | Hostnames | Loopback | AS |
|------|-----------|----|-----------|----------|----|
| Collapsed-spine leaf pair | **QFX5120-48Y** | Junos | `leaf1`, `leaf2` | 192.168.253.0 / .1 | 64800 / 64801 |
| External router | MX204 | Junos | — | — | — |

> The JVD validates **five** collapsed-spine platforms — QFX5120-48Y, QFX5130-32CD, QFX5700, ACX7100-48L, PTX10001-36MR — for the same role; the shipped configs use the QFX5120-48Y baseline. See [`../README.md`](../README.md).

## Protocols & functions

- **Direct peering:** with no spine, the two leaves form the fabric — eBGP underlay over point-to-point links and an eBGP EVPN overlay over loopbacks (multihop ttl 1) between the two switches.
- **ERB routing:** VLAN-aware MAC-VRF (`evpn-1`), 1 VXLAN VNI per VLAN; symmetric anycast IRB gateways; EVPN Type-2 (MAC/IP) + Type-5 (IP-prefix).
- **Multihoming:** ESI-LAG (AE + ESI + LACP) for dual-homed servers/access switches; 2 ESI per leaf validated.
- **Border / external:** each tenant VRF (Red / Blue) runs eBGP (`l3rtr`) to an external MX204 for inter-VRF and external connectivity — the collapsed switches are the border-leaf gateways.
- **Resilience:** BFD on underlay + overlay (500 ms / 1000 ms); IP ECMP with fast re-route.

## Use cases

| Use case | Fit |
|----------|-----|
| **Edge / ROBO** | Small-footprint HA fabric for remote and branch sites |
| **Single-rack POD** | A rack-scale fabric within a larger data center |
| **Test lab / starter** | Low-cost Apstra-managed fabric to learn intent-based operations |
| **L2 extension** | Extend L2 domains to remote sites over EVPN |

## Key results (highlights)

- Access link failure convergence **< 50 ms**; node reboot / BGP flap **< 500 ms**.
- Global MAC initialization for 20k entries **< 10 s**.
- Scale: 2,000 VLANs/VNIs/IRBs per leaf; 10,000 total MAC-IP.

## Design concepts (jump-to)

- **Collapsed spine / direct peering** → [design guide § Use case and reference architecture](design-guide.md#use-case-and-reference-architecture).
- **Fabric characteristics** → [design guide § Fabric characteristics](design-guide.md#fabric-characteristics).
- **Features & scale** → [test report brief § High-level features tested](test-report-brief.md#high-level-features-tested).

## References

- **JVD page (juniper.net):** https://www.juniper.net/documentation/us/en/software/jvd/jvd-collapsed-dc-fabric-with-apstra/index.html
- **Portal:** [JVD portal](https://juniper.github.io/jvd/portal/) (Discover · Learn · Design · Build)
- **Companion docs:** [solution-overview.md](solution-overview.md) · [design-guide.md](design-guide.md) · [test-report-brief.md](test-report-brief.md)
- **Configs / snips:** [`../configuration/conf/`](../configuration/conf/) · [`../configuration/snips/`](../configuration/snips/) · [BYOAI assistant](../configuration/snips/byoai/README.md)
- **Related JVDs:** [3-stage data center](../../3stage_dc/) (scale up) · Collapsed Fabric with Access Switches JVDE (more ports).
