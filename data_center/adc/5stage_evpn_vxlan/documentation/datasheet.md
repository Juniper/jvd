# 5-Stage EVPN-VXLAN Data Center — Datasheet

> **JVD-DCFABRIC-5STAGE-01-01** · slug `5stage` · web-scale multi-POD EVPN-VXLAN ERB fabric
> Quick-reference for the 5-Stage Data Center JVD. Grounds the [BYOAI](../configuration/snips/byoai/README.md) Design mode.

## At a glance

A validated **5-stage EVPN-VXLAN ERB fabric** — **lean super spines** above multiple PODs (**Compute**, **Storage**, **Services**), each POD a 3-stage fabric. Super spines and POD spines forward IP and relay routes only (no VXLAN encapsulation). Managed by Juniper Apstra, the design targets large data centers where compute and storage scale beyond a single POD and where **RoCEv2** and **multicast** must traverse PODs deterministically.

| | |
|---|---|
| **JVD / slug** | 5-Stage EVPN-VXLAN Data Center · `5stage` |
| **Track** | Data Center — Apstra Data Center (ADC) |
| **Architecture** | 5-stage CLOS ERB EVPN-VXLAN; lean super spines + lean spines; Compute / Storage / Services PODs |
| **Underlay / overlay** | eBGP underlay + eBGP EVPN overlay (single ASN per POD; one ASN for super spines); BFD on both; ECMP |
| **Routing** | EVPN Type 2 + Type 5; symmetric IRB anycast; IPv4 + IPv6 |
| **Multicast** | Optimized Intersubnet Multicast (enhanced OISM / BDNE), SBD irb.3500, PIM/IGMP/OSPF, border-leaf PIM EVPN gateway (Classic L3) |
| **Storage** | RoCEv2 congestion management (DCQCN — PFC + ECN QoS) |
| **Automation** | Juniper Apstra 5.0.0-64 (OISM, QoS, firewall filters applied via configlet) |
| **Min. validated software** | Junos OS / Junos OS Evolved **23.4R2-S3**; Apstra **5.0.0-64**. See juniper.net for the current matrix. |

## Device roles (as shipped in this folder)

The configurations in [`../configuration/conf/`](../configuration/conf/) cover the super spines and the three PODs.

| Role | Device(s) | OS | Hostnames |
|------|-----------|----|-----------|
| Super spine pair | **QFX5230-64CD** | EVO | `superspine1/2` |
| Compute POD spine | **QFX5210-64C** | Junos | `compute-spine1/2` |
| Compute POD leaf | **QFX5120-48YM** | Junos | `compute-leaf1/2` |
| Storage POD spine | **QFX5220-32CD** | EVO | `storage-spine1/2` |
| Storage POD leaf | **QFX5130-32CD** | EVO | `storage-leaf1/2` |
| Services POD spine | **QFX5210-64C** | Junos | `services-spine1/2` |
| Services POD leaf (border) | **QFX5130-48C** | EVO | `services-leaf1/2` |
| External gateway | MX series | Junos | — |

> The published test bed also validated **QFX5120-32C** as an alternate spine (compute POD spine in the DUT table); the rendered configs in this folder use the platforms above. JVDs validate multiple hardware combinations — see [`../README.md`](../README.md) for exact per-file hardware.

## Protocols & functions

- **Underlay / overlay:** eBGP underlay and eBGP EVPN overlay; BFD on both; ECMP across the fabric. Super spines / POD spines are IP-only (lean).
- **ERB routing:** EVPN Type 2 (MAC/IP) + Type 5 (IP-prefix); symmetric IRB with anycast gateways; IPv4 + IPv6 dual stack.
- **Multicast (OISM):** enhanced OISM with Bridge Domain Not Everywhere; Supplemental Bridge Domain (irb.3500); PIM + IGMP snooping + OSPF per tenant VRF; `conserve-mcast-routes-in-pfe` on QFX5130 leaves; `pim-evpn-gateway` on border leaves (Classic L3 to external RP).
- **RoCEv2:** DCQCN — Priority-Based Flow Control (PFC) + Explicit Congestion Notification (ECN); CoS drop-profiles tuned so ECN triggers before PFC.
- **Services:** DHCP relay; Routing-Engine loopback protection firewall filter; duplicate-MAC detection; storm control.
- **Scale/mem:** EVO host-profile (`forwarding-profile host-profile`) for higher MAC scale.

## Use cases

| Use case | What it delivers |
|----------|------------------|
| **Web-scale multi-POD** | Compute, Storage, and Services PODs under one Apstra blueprint with any-to-any connectivity |
| **Storage (RoCEv2)** | Lossless storage transport with PFC + ECN congestion management |
| **Multicast** | Efficient intra-fabric and external multicast via enhanced OISM + border-leaf PIM gateway |
| **Workload mobility** | Migrate applications across PODs preserving IP/MAC; A/S applications across PODs |

## Key results (highlights)

- Validation detected **no issues**; all performance parameters within threshold across three scale scenarios (50 / 500 / 1000 VLAN-VNIs with IRB).
- QFX5130 L3 overlay next-hop limit (~28,000) is the first scale limit reached.
- 8-hour longevity plus extended negative testing (process restarts, link/laser flaps) passed.

## Design concepts (jump-to)

- **Lean super spines / PODs** → [design guide § Use case and reference architecture](design-guide.md#use-case-and-reference-architecture).
- **Enhanced OISM (BDNE)** → [design guide § Optimized Intersubnet Multicast (OISM)](design-guide.md#optimized-intersubnet-multicast-oism).
- **RoCEv2 DCQCN** → [design guide § RoCEv2 congestion management (DCQCN)](design-guide.md#rocev2-congestion-management-dcqcn).
- **Scale results** → [test report brief § Performance and scale](test-report-brief.md#performance-and-scale).

## References

- **Validated Designs index (juniper.net):** https://www.juniper.net/documentation/us/en/software/jvd/jvd-dcfabric-5-stage/
- **Portal:** [JVD portal](https://juniper.github.io/jvd/portal/) (Discover · Learn · Design · Build)
- **Companion docs:** [solution-overview.md](solution-overview.md) · [design-guide.md](design-guide.md) · [test-report-brief.md](test-report-brief.md)
- **Configs / snips:** [`../configuration/conf/`](../configuration/conf/) · [`../configuration/snips/`](../configuration/snips/) · [BYOAI assistant](../configuration/snips/byoai/README.md)
- **Related JVDs:** [3-stage data center](../../3stage_dc/) (the POD baseline) · [EVPN-VXLAN DCI](../../evpn_vxlan_dci/) (interconnect).
