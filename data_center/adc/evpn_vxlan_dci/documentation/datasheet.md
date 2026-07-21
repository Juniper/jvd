# EVPN-VXLAN Data Center Interconnect (DCI) — Datasheet

> **JVD-DCI-MULTISITE-01-01** · slug `evpn-dci` · EVPN-VXLAN interconnect across multiple data centers
> Quick-reference for the DCI JVD. Grounds the [BYOAI](../configuration/snips/byoai/README.md) Design mode.

## At a glance

A validated Juniper Validated Design **Extension (JVDE)** that stretches EVPN/VXLAN fabrics across data centers using three techniques — **Over-the-Top (OTT)**, **Type 2 seamless stitching**, and **Type 2 + Type 5 seamless stitching** — with **MACSEC** between border-leaf gateways. The design builds on the 3-stage, 5-stage, and collapsed-fabric data center JVDs and is provisioned with Juniper Apstra (MACSEC and BFD applied via configlet).

| | |
|---|---|
| **JVD / slug** | EVPN-VXLAN Data Center Interconnect · `evpn-dci` |
| **Track** | Data Center — Apstra Data Center (ADC) |
| **Architecture** | ERB EVPN-VXLAN fabrics interconnected at border-leaf gateways |
| **DCI techniques** | OTT (all-leaf VXLAN stretch) · Type 2 seamless stitching (selective L2) · Type 2 + Type 5 seamless stitching (L2 + L3 context) |
| **Transport** | Border-leaf DCI over interconnect (ISP) switches; interface-level CCC + MPLS/L2-circuit in the lab (QFX10002-36Q) |
| **Security** | MACSEC between border-leaf gateways (`gcm-aes-xpn-128`, static-CAK) on OTT and Type 2 |
| **Automation** | Juniper Apstra 5.0.0-64 (MACSEC + BFD via configlet) |
| **Validation** | 3 mutually-exclusive test beds; intra/inter-VLAN and inter-VRF flows; failure/convergence; 8-hour longevity |
| **Min. validated software** | Junos OS / Junos OS Evolved **23.4R2-S4**; Juniper Apstra **5.0.0-64**. See juniper.net for the current matrix. |

## Interconnect scenarios (as shipped in this folder)

The configurations in [`../configuration/conf/`](../configuration/conf/) capture only the **additional** configuration required for each DCI technique. Operational essentials (root password, DNS, FTP, and site-specific settings) are intentionally omitted and must be added per deployment.

| Scenario | Folder | Interconnects | Border-leaf gateways |
|----------|--------|---------------|----------------------|
| **OTT** | [`dc1-dc2_ott`](../configuration/conf/dc1-dc2_ott/) | 3-stage DC1 ↔ 3-stage DC2 | DC1 QFX5130-32CD · DC2 QFX5700 |
| **Type 2 seamless** | [`dc1-dc3_type2_seamless`](../configuration/conf/dc1-dc3_type2_seamless/) | 3-stage DC1 ↔ DC3 | DC1 QFX5130-32CD |
| **Type 2 + Type 5 seamless** | [`dc1-dc4_type2_type5_seamless`](../configuration/conf/dc1-dc4_type2_type5_seamless/) | 3-stage DC1 ↔ 5-stage DC4 | DC1 QFX5130-32CD · DC4 QFX5130-48C |

> The published JVDE test bed used QFX5700 and PTX10001-36MR as 3-stage border leaves and QFX5120-48YM collapsed-fabric leaves; JVDs validate multiple hardware combinations. The rendered configs in this folder represent one such combination — see [`../README.md`](../README.md) for the exact per-file hardware.

## Device roles

| Role | Function in the network |
|------|-------------------------|
| **Spine** | ERB EVPN-VXLAN spine; leaf-spine underlay eBGP; overlay route reflection to leaves |
| **Server / ESI leaf** | Access leaf; single-homed or ESI-LAG multihomed host connectivity; VXLAN VTEP |
| **Border leaf (gateway)** | DCI gateway; forms DCI overlay eBGP to remote border leaves; VXLAN stitching / translation VNI; MACSEC termination |
| **Super spine** | 5-stage DC4 super-spine interconnecting compute / storage / services PODs |

## Featured platforms

Software = minimum validated release; regression re-validates on newer releases (see juniper.net for the current set).

| Fabric role | Device(s) | Min. validated software |
|-------------|-----------|--------------------------|
| Spine (DC1) | **QFX5220-32CD** | Junos OS Evolved 23.4R2-S4 |
| Server / ESI leaf | **QFX5120-48Y**, QFX5120-48Y-8C | Junos OS 23.4R2-S4 |
| Border leaf | **QFX5130-32CD**, **QFX5700**, QFX5130-48C, PTX10001-36MR | Junos OS Evolved 23.4R2-S4 |
| DC4 super spine | **QFX5230-64CD** | Junos OS Evolved 23.4R2-S4 |
| DC4 POD spines | **QFX5210-64C**, QFX5220-32CD | Junos OS / Junos OS Evolved 23.4R2-S4 |
| Collapsed-fabric leaf | QFX5120-48YM | Junos OS 23.4R2-S4 |
| Interconnect (ISP) switch | QFX10002-36Q *(out of scope)* | — |

## Protocols & functions

- **Underlay / overlay:** ERB EVPN-VXLAN within each fabric; **DCI overlay eBGP** between border-leaf gateways (logical full mesh required for seamless stitching).
- **Stitching:** EVPN **Type 2** (MAC/IP) and **Type 5** (IP-prefix) route stitching; `interconnect` route target + route distinguisher; **interconnected-vni-list** and **translation VNI** where site VNIs differ.
- **DCI transport:** interface-level CCC + MPLS/L2-circuit on interconnect switches (lab); any L2/L3 transport that supports interconnect is acceptable.
- **Security:** MACSEC `connectivity-association` (`gcm-aes-xpn-128`, static-CAK) at border gateways; IFD-level on platforms without IFL MACSEC (e.g. QFX5700).
- **Resilience:** ECMP across multihomed gateways; **BFD** on DCI overlay (`minimum-interval 3000 multiplier 3`, via configlet); asymmetric IRB; MAC mobility across DCI.
- **Addressing:** IPv4 and IPv6 overlay host connectivity; RED / BLUE / GREEN (Type-5-only) tenant VRFs.

## Interconnect flows & use cases

| Flow | Path |
|------|------|
| **Intra-VLAN** | Type 2 (MAC/IP) stitched between sites; translation VNI applied at border leaf when VNIs differ |
| **Inter-VLAN** | Type 5 (IP-prefix) route in the tenant VRF |
| **Inter-VRF** | Default route to external gateway (MX304) for inter-VRF routing, then Type 2 / Type 5 back to the remote leaf/border leaf |

## Key results (highlights)

- All three DCI methods validated with **no traffic-loss anomalies**; MACSEC encrypted end-to-end.
- Link-failure convergence **< 5 seconds** for all methods (overlay BFD applied).
- MAC move of ~2,000 hosts across DCI converged in **~3 seconds**.
- Seamless stitching **requires** a logical full mesh of border-leaf eBGP sessions (DF resilience).

## Design concepts (jump-to)

- **Three DCI techniques** → [design guide § Use case and reference architecture](design-guide.md#use-case-and-reference-architecture).
- **Seamless stitching essentials** (full mesh, translation VNI, Type 5) → [design guide § Seamless stitching essentials](design-guide.md#seamless-stitching-essentials).
- **MACSEC / BFD configlets** → [design guide § Additional configurations](design-guide.md#additional-configurations).
- **Flow-path behavior & scale** → [test report brief § Flow-path behavior](test-report-brief.md#flow-path-behavior).

## References

- **Validated Designs index (juniper.net):** https://www.juniper.net/documentation/validated-designs/us/en/data-center/
- **Portal:** [JVD portal](https://juniper.github.io/jvd/portal/) (Discover · Learn · Design · Build)
- **Companion docs:** [solution-overview.md](solution-overview.md) · [design-guide.md](design-guide.md) · [test-report-brief.md](test-report-brief.md)
- **Configs / snips:** [`../configuration/conf/`](../configuration/conf/) · [`../configuration/snips/`](../configuration/snips/) · [BYOAI assistant](../configuration/snips/byoai/README.md)
- **Baseline JVDs:** [3-stage data center](../../3stage_dc/) · [5-stage EVPN-VXLAN](../../5stage_evpn_vxlan/) · collapsed data center fabric.
