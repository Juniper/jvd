# Design Guide — EVPN-VXLAN Data Center Interconnect (DCI)

> **JVD-DCI-MULTISITE-01-01** · Juniper Validated Design Extension (JVDE) · Published 2025-11-12
> Source: *EVPN-VXLAN Data Center Interconnect Design with Juniper Apstra — Juniper Validated Design Extension (JVDE)* (juniper.net).
> Companion docs: [solution-overview.md](solution-overview.md) · [test-report-brief.md](test-report-brief.md) · [datasheet.md](datasheet.md)

## About this document

This document details a Juniper Validated Design Extension (JVDE) to provision **EVPN-VXLAN Data Center Interconnect (DCI)** for data center fabrics built with Juniper Apstra. It is an extension of the **3-stage**, **5-stage**, and **Collapsed Fabric** data center JVDs, and provides detailed guidance for deploying DCI between data centers using Juniper Apstra. The audience is expected to be familiar with Junos OS, QFX Series switches, and Juniper Apstra.

## Solution benefits

A JVDE is a prescriptive blueprint for building upon a JVD data center fabric to meet a specific use case — making the resulting building block a "known quantity" that can be deployed quickly, simply, and reliably. Each JVDE goes through the New Product Initiative (NPI) testing framework and is verified by a suite of automated testing tools. The underlying fabric plus any products and services listed are tested for end-to-end functionality with the prescribed Junos OS releases.

**Juniper Apstra** is a multi-vendor, intent-based networking system (IBNS) that provides closed-loop automation and assurance. It translates vendor-agnostic business intent into device-specific configuration, validates intent continuously, and simplifies data center interconnection — unifying multiple data centers while isolating failure domains for high availability.

## Use case and reference architecture

The DCI JVDE covers multiple data center designs (3-stage, collapsed fabric, and 5-stage) and interconnects them using recommended Juniper border-leaf switches. There are several ways to achieve DCI; this JVDE focuses on three key techniques.

### Over-the-Top (OTT) with MACSEC

The two data centers are connected using a Layer 2 switch and form a Layer 2 stretch for tenants provisioned with VRFs. VXLAN/VNI tunnels are formed between **all** leaf devices in both data centers, and the Layer 2 switches merely switch packets between them. Because tunnel count grows with the VXLAN/VNI and tenant count, OTT is better suited to smaller data centers that are not prone to change.

### EVPN-VXLAN Type 2 Seamless Stitching (with MACSEC)

In contrast to OTT, tunnels are **not** formed across all leaf devices; only a **subset** of VLAN/VNIs are selectively stretched between sites. Local VLAN/VXLAN tunnels terminate at the border-leaf switches, and new DCI VXLAN tunnels are formed between the data centers. Tunnels are not formed automatically each time a leaf is added, which increases scale performance and simplifies the Layer 2 extension configuration. QFX5700 and QFX5120-48YM are used to provide MACSEC between the two data centers.

### EVPN-VXLAN Type 2 and Type 5 Seamless Stitching

An extension of Type 2 seamless stitching in which the **Layer 3 context** is stretched across data centers. As an example, the 3-stage and 5-stage data centers are interconnected to form this design.

## Solution architecture

The JVDE focuses on the **border-leaf switches** used to interconnect each fabric. The interconnect switches used to connect data centers can be any switch/router that supports the interconnect functionality; for lab validation, **QFX10002-36Q** were used (their configuration is out of scope, though statement references are provided where necessary).

> **Note.** Each DCI design was configured and tested in isolation. OTT is a mutually exclusive design — all VXLAN tunnels are formed and stretched across data centers and cannot be mixed with seamless stitching (Apstra also prevents mixing OTT with other interconnect designs). Type 2 and Type 5 traffic, however, can be configured and mixed.

### Hardware and software

*Table 1 — platform positioning and roles:*

| Solution | Server leaf switches | Border-leaf switches | Spine | Super spine |
|----------|----------------------|----------------------|-------|-------------|
| 3-stage EVPN/VXLAN (ERB) | QFX5120-48Y-8C, QFX5110-48S | QFX5700 (EVO), PTX10001-36MR | QFX5220-32CD (EVO), QFX5120-32C | — |
| Collapsed Fabric* | QFX5120-48YM | — | — | — |
| 5-stage EVPN/VXLAN (ERB) | QFX5120-48YM, QFX5130-32CD (EVO) | QFX5130-48C (EVO) | QFX5220-32CD (EVO), QFX5210-64C, QFX5120-32C | QFX5230-64CD (EVO) |

\* Switches in a collapsed fabric perform the roles of spine, leaf, and border leaf.

*Table 2 — software:*

| Juniper product | Software / image version |
|-----------------|--------------------------|
| Juniper Apstra | 5.0.0-64 |
| Junos OS / Junos OS Evolved | 23.4R2-S4 |

### Validated functionality

- Deployment of the three DCI methods using Apstra (3-stage↔3-stage OTT; 3-stage↔collapsed seamless; 3-stage↔5-stage Type 5 seamless).
- Provisioning of L2/L3 switches to interconnect data centers.
- ECMP for Type 2 and Type 5 route peering; EVPN route propagation via overlay eBGP so remote leaves reach routes in remote PODs/leaves.
- Both **IPv4 and IPv6** routing between data centers.
- **BFD** for the DCI overlay (applied via configlet).
- IRB within and across PODs/data centers for inter-subnet forwarding.
- Inter-VRF route leaking to reach routes in DCI-connected data centers.
- **MACSEC** (via configlets) between the 3-stage data center (QFX5700 border leaves) and the collapsed fabric (QFX5120-48YM leaves).

## Configuration walkthrough

DCI is provisioned primarily through the Juniper Apstra UI (blueprint links, routing policies, connectivity templates, DCI gateway/interconnect domains). MACSEC and BFD are applied through **configlets** because Apstra 5.0 does not natively support them. The subsections below capture the CLI-level essentials rendered onto the devices.

### Interconnect (ISP) switches

The choice of connectivity between data centers depends on latency, convergence, transport type, and hardware. For simplicity the lab uses **interface-level switching (CCC)** on two QFX10002-36Q, with border leaves connected over 10G links; MPLS and L2-circuit provide the Layer 2 cross-connect (MPLS and L2-circuit licenses required).

- Interfaces use circuit cross-connect (CCC) encapsulation `ethernet-ccc`, with logical unit 0 `family ccc`.
- A `protocols connections interface-switch` stitches the two CCC interfaces.
- The `mpls` protocol is enabled for the Layer 2 cross-connect to work.

```
interfaces xe-0/0/18:0 {
    description "OTT:DC1-BL1 to DC2-BL1";
    mtu 9216;
    encapsulation ethernet-ccc;
    unit 0 { family ccc; }
}
protocols {
    connections { interface-switch DC1-DC2 { interface xe-0/0/18:0.0; interface xe-0/0/18:2.0; } }
    mpls { interface all; }
    lldp { interface all; }
}
```

### Seamless stitching essentials

- Overlay connectivity is created under **Blueprint > Staged > DCI**. OTT uses *Over the Top / External Gateway*; seamless stitching uses *Integrated Interconnect*, which ensures a distinct interconnect ESI in each data center.
- **Logical full mesh** eBGP between all border-leaf gateways is **mandatory** for seamless stitching, so that a Designated Forwarder (DF) role change on a primary border leaf does not black-hole routes.
- **Translation VNI** — where the same VLAN uses different VNIs in each data center, the border leaf translates the VNI while forwarding, provided the translated VNI is in the interconnected VNI list:

  ```
  set routing-instances evpn-1 protocols evpn interconnect interconnected-vni-list 41400
  set routing-instances evpn-1 vlans vn1400 vxlan translation-vni 41400
  ```

- For **Type 5** stitching, enabling Layer 3 for the stretched virtual networks requires the VRF to be enabled on the Layer-3 policy tab with an associated routing policy. Apstra then applies the interconnect route target and route distinguisher to stitch EVPN Type 5 routes (the same interconnect route target must be applied in the remote data center):

  ```
  evpn {
      interconnect {
          vrf-target target:65655L:22222;
          route-distinguisher 192.168.255.2:65530;
      }
  }
  ```

- **Collapsed fabric adjustment** — during Type 2 validation, Apstra omitted the DCI overlay EVPN BGP export policy on the collapsed-fabric leaves that stops advertising overlay routes between collapsed leaves (it was applied on 3-stage spines). A configlet applied a `LEAF_TO_LEAF_EVPN_OUT` policy that rejects the DCI L2/L3 target communities between collapsed leaves.

### Additional configurations

- **MACSEC** — applied via configlet using a property set (the same configlet serves OTT and Type 2). Uses `connectivity-association dci_macsec`, `cipher-suite gcm-aes-xpn-128`, `security-mode static-cak` with a pre-shared CKN/CAK. On platforms such as QFX5700 that do not support IFL-level MACSEC, it is applied at the physical interface (IFD).

  ```
  security {
      macsec {
          connectivity-association dci_macsec {
              cipher-suite gcm-aes-xpn-128;
              security-mode static-cak;
              pre-shared-key { ckn <hex>; cak "<encrypted>"; }
          }
          interfaces { et-0/0/0:0 { connectivity-association dci_macsec; } }
      }
  }
  ```

- **EVPN Type 5 host routes** — enabling *host-specific routes* in Apstra Fabric Settings advertises host /32 (and /128) routes rather than only the virtual-network subnet prefix (disabled by default; increases route scale).
- **BFD for overlay** — applied via configlet on the DCI overlay BGP session to improve convergence: `set protocols bgp group evpn-gw bfd-liveness-detection minimum-interval 3000 multiplier 3`.

## DCI verification (summary)

The design guide walks intra-VLAN, inter-VLAN, and inter-VRF flows for each technique, showing how routes are chosen:

- **Intra-VLAN** — resolved via **Type 2** MAC/IP routes (translation VNI applied at the border leaf when VNIs differ between sites).
- **Inter-VLAN** — resolved via **Type 5** IP-prefix routes in the tenant VRF.
- **Inter-VRF** — the leaf holds only a **default route** to the border leaf; traffic is sent to the external gateway (MX304) for inter-VRF routing, then returns and follows a Type 2 or Type 5 route to the remote leaf/border leaf.

## Recommendations

- Junos OS **23.4R2-S4** is the minimum version supported on the listed hardware.
- The **Translation VNI** feature stitches VNIs between data centers that use different VNI IDs for the same VLAN.
- Adding **MACSEC** on supported hardware (QFX5700 or QFX5120-48YM) at the border gateways encrypts inter-data-center traffic and enhances security.
- Several factors — latency, convergence, transport type (L2/L3), and hardware — influence the choice of interconnect transport; those decisions are outside the scope of this document (the lab uses interface-level CCC for simplicity).

## Revision history

| Date | Version | Description |
|------|---------|-------------|
| March 2025 | JVD-DCI-MULTISITE-01-01 | Initial publish |
| November 2025 | JVD-DCI-MULTISITE-01-01 | Minor updates |

## Sources

- *EVPN-VXLAN Data Center Interconnect Design with Juniper Apstra — JVDE* — JVD-DCI-MULTISITE-01-01 (juniper.net).
- Companion: [solution-overview.md](solution-overview.md), [test-report-brief.md](test-report-brief.md), [datasheet.md](datasheet.md).
