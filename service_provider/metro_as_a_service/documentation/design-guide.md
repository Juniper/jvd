# Metro as a Service (MEF 3.0) — JVD Design Guide

> Markdown conversion of the published *Metro as a Service MEF 3.0 — Juniper
> Validated Design* (full Design Guide, published 2025-10-12). This is a faithful
> text mirror of the published PDF for reference and for grounding the portal's
> Design & Planner. Exhaustive per-requirement PASS / tested-checkbox tables from
> the source are condensed into summaries that point back to the published guide;
> all narrative, architecture, and representative configuration examples are
> transcribed as published. Full multi-device configurations live in
> [`../configuration/conf/`](../configuration/conf/) and are linked rather than
> duplicated here.

## Table of Contents

1. [About this Document](#about-this-document)
2. [Solution Benefits](#solution-benefits)
3. [Use Case and Reference Architecture](#use-case-and-reference-architecture)
4. [Validation Framework](#validation-framework)
5. [Test Objectives](#test-objectives)
6. [Solution Architecture](#solution-architecture)
7. [Results Summary](#results-summary)
8. [Recommendations](#recommendations)
9. [Revision History](#revision-history)
10. [Sources](#sources)

---

## About this Document

This Juniper Validated Design (JVD) provides a comprehensive validation of MEF 3.0
compliance for Carrier Ethernet business services delivered over a modern Cloud
Metro architecture. Metro as a Service (MaaS) enhances the Metro Ethernet Business
Services (Metro EBS) JVD by qualifying **over 12,000 MEF 3.0 end-to-end test
cases** across all featured E-Line, E-LAN, E-Tree, and Access E-Line (E-Access)
services, validated with **Iometrix**, the official MEF test laboratory.

The document is intended for network architects, service-provider design
engineers, and operations teams designing and deploying MEF-conformant Carrier
Ethernet services on the Juniper Cloud Metro portfolio (ACX, MX, PTX).

---

## Solution Benefits

The MaaS architecture addresses three core challenges facing service providers
modernizing their metro networks.

### Challenge 1 — Inefficient Traffic Flow → Metro Edge Gateway (MEG)

Traditional metro designs hairpin subscriber traffic through centralized
aggregation, creating suboptimal paths and concentrating state. The MaaS design
introduces the **Metro Edge Gateway (MEG)** as a border-leaf function at the
boundary between the metro access rings and the metro fabric. The MEG provides an
efficient inter-domain hand-off (fabric-to-ring, ring-to-MSE), localizes service
edge functions, and enables scale-out of the services edge without forcing all
traffic through the core.

### Challenge 2 — Modernizing the Transport Underlay

Legacy LDP/RSVP MPLS underlays are operationally heavy and slow to converge. MaaS
modernizes the underlay with **Segment Routing MPLS (SR-MPLS)** and **Flex-Algo**
for lightweight traffic engineering. Multi-instance IS-IS integrates the
traditional metro ring domains with the metro fabric domain, and SR provides
source-routed, deterministic paths with fast convergence and simplified state.

### Challenge 3 — Adopting Cloud Principles

Metro networks must adopt cloud operating principles — automation, horizontal
scale, service abstraction, and access-agnostic connectivity. MaaS layers a rich
**EVPN** service portfolio (EVPN-VPWS, EVPN-FXC, EVPN-ELAN, EVPN-ETREE) over the
SR-MPLS underlay, and uses **transport classes** with **color-aware steering** to
map services to network slices (Gold / Bronze / Best Effort). This blends
retro-metro concepts with modern cloud adaptation, supporting X-to-Anything
connectivity models.

---

## Use Case and Reference Architecture

### Metro Ethernet Forum (MEF)

The Metro Ethernet Forum defines the standards and framework for delivering and
characterizing Carrier Ethernet services. MEF 3.0 certification for Operators
involves end-to-end compliance of production network services. Deploying
MEF-certified equipment and adhering to MEF standards ensures service offerings
meet rigorous, interoperable performance criteria.

### MEF 3.0 Key Standards

The design and validation reference the following MEF standards:

| Standard | Scope |
| --- | --- |
| MEF 91 | Carrier Ethernet Test Requirements (certification test framework) |
| MEF 6.3 | Subscriber Ethernet Services Definitions |
| MEF 10.4 | Subscriber Ethernet Services Attributes |
| MEF 26.2 | External Network Network Interface (ENNI) and Operator Service Attributes |
| MEF 51 | Operator Ethernet Services Definitions (Access E-Line / E-Access) |
| MEF 62 | Multi-CEN L2CP (Layer 2 Control Protocol) |
| MEF 65 | Carrier Ethernet Class of Service |
| MEF 30.1 | Service OAM Fault Management |
| MEF 35.1 | Service OAM Performance Monitoring |
| MEF 45.1 | Multi-CEN L2CP Implementation |
| MEF 23.2 | Carrier Ethernet Class of Service — Phase 3 |
| MEF 48.1 | Service Activation Testing |

### Carrier Ethernet Subscriber Models

**Table 1 — Carrier Ethernet Service Types (Subscriber Models)**

| Service Type | EVC Topology | Port-based (all-to-one) | VLAN-based (multiplexed) |
| --- | --- | --- | --- |
| E-Line | Point-to-Point | EPL | EVPL |
| E-LAN | Multipoint-to-Multipoint | EP-LAN | EVP-LAN |
| E-Tree | Rooted-Multipoint | EP-Tree | EVP-Tree |
| E-Access | Point-to-Point (OVC, UNI↔ENNI) | Access EPL | Access EVPL |

### Key Service Attributes

- **Service Multiplexing** — multiple EVCs on a single UNI (VLAN-based services).
- **Bundling** — multiple CE-VLAN IDs mapped to a single EVC.
- **All-to-One Bundling** — all CE-VLAN IDs on a UNI map to a single EVC
  (port-based services); mutually exclusive with service multiplexing.
- **EVC (Ethernet Virtual Connection)** — the association of two or more UNIs.
- **CE-VLAN ID / CoS** — customer VLAN identity and class of service preserved
  across the EVC per service configuration.

**Table 2 — Service Multiplexing / Bundling Combinations**

| Attribute combination | E-Line | E-LAN | E-Tree |
| --- | --- | --- | --- |
| All-to-One Bundling (port-based) | EPL | EP-LAN | EP-Tree |
| Service Multiplexing (VLAN-based) | EVPL | EVP-LAN | EVP-Tree |
| Bundling (multiple CE-VLANs per EVC) | supported | supported | supported |

### Use Cases

The JVD delivers **19 validated service use cases** spanning E-Line, E-LAN,
E-Tree, and Access E-Line — see [Table 3 — Services Under Test](#services-under-test)
for the complete list with VPN type, high-availability model, service
instantiation, and endpoints.

### Test Bed

The physical infrastructure is inherited from the Metro EBS JVD (metro access
multi-ring topology + metro fabric spine-and-leaf) and integrated with the
**Iometrix Lab in the Sky** Network-as-a-Service test infrastructure (cloud-based
x86 whitebox virtual test probes).

### Platforms / Devices Under Test

**Table 4 — Featured Devices**

| Role | Device(s) | Software |
| --- | --- | --- |
| Access Node (AN) / Metro Access (MA) | ACX7024, ACX7100-48L, ACX710, ACX5448, MX204 | 23.2R2 |
| Lean Spine (AG1) | ACX7100-32C | 23.2R2 |
| Metro Edge Gateway (MEG, border leaf) | ACX7509, ACX7100-32C | 23.2R2 |
| Core (CR) | PTX10001-36MR | 23.2R2 |
| Multi-Services Edge (MSE) | MX304 | 23.2R2 |
| Metro Distribution Router (MDR) | MX10003, ACX7509 | 23.2R2 |

MEF 3.0-certified primary DUTs: **ACX7024, ACX7100, ACX7509, MX304**. Version
qualification: Junos OS and Junos OS Evolved **Release 23.2R2**.

_Figure: Metro as a Service reference topology —
[`../images/Metro-MEF-Topology.png`](../images/Metro-MEF-Topology.png)._

---

## Validation Framework

Testing is aligned with MEF 3.0 mandatory certification requirements per the
**MEF 91 Carrier Ethernet Test Requirements** standard. Test cases are classified
as **mandatory** or **conditional mandatory** (mandatory only when certain optional
attributes are configured). The architecture supports additional MEF-defined
features beyond the unconditional mandatory criteria; select optional attributes
(e.g. UNI resiliency) are covered to preserve the intentionality of the JVD.

Test cases fall into four categories, executed across all services:

1. **Functional Service Attributes and Parameters** — EVC behavior, VLAN handling,
   service multiplexing/bundling, CE-VLAN ID/CoS mapping.
2. **Layer 2 Control Protocol (L2CP) and Service OAM (SOAM) Frame Behavior** —
   tunneling/forwarding of control and management frames (CCM, LBM, LTM, LTR).
3. **Bandwidth Profile Attributes and Parameters** — CIR/EIR policing (TrTCM).
4. **Service Performance Attributes and Parameters** — frame delay, mean frame
   delay, frame delay variation (jitter), frame loss ratio, availability.

---

## Test Objectives

### Goals

- Validate end-to-end MEF 3.0 conformance for all featured Carrier Ethernet
  service types over a production-emulated Cloud Metro network.
- Demonstrate service multiplexing, bundling, and all-to-one bundling behaviors.
- Validate high-availability models: single-homed, active-active multihoming,
  hot-standby, and anycast.
- Validate SR-MPLS + Flex-Algo transport with color-aware steering and cascade
  failover across Gold / Bronze / Best Effort transport classes.

### Non-Goals

- Maximum per-device scale/performance characterization (KPIs are
  multi-dimensional and representative, not per-SKU maxima).
- EP-Tree service validation (E-Tree is validated as EVP-Tree; EP-Tree is
  supported but not included).
- Features outside the MEF 3.0 certification scope for the tested service set.

### Services Under Test

**Table 3 — Services Under Test (19 services)**

| # | Service Type | VPN Type | High Availability | Instantiation | Representative Endpoints |
| --- | --- | --- | --- | --- | --- |
| 1 | E-Line (EVPL) | EVPN-VPWS_EDGE | Single-Homed / A-A MH | Inter-AS Fabric→Ring | AN1 / AN2 |
| 2 | E-Line (EVPL) | EVPN-VPWS-MH-E2E | Active-Active MH | Intra-AS Intra-Fabric | AN2 / AN3 |
| 3 | E-Line (EVPL) | EVPN-VPWS-SH-fabric | Single-Homed | Intra-AS Intra-Fabric | AN1 / AN3 |
| 4 | E-Line (EVPL) | EVPN-FXC VLAN-Aware | Active-Active MH | Inter-AS Fabric→Ring | MA1.1 / MA1.2 |
| 5 | E-Line (EVPL) | EVPN-FXC VLAN-Unaware | Single-Homed | Inter-AS Fabric→MSE | AN3 / MSE1 |
| 6 | E-Line (EVPL) | Layer 2 Circuit | Hot-Standby | Intra-AS Metro Fabric | AN3 → MEG1/MEG2 |
| 7 | E-Line (EVPL) | L2VPN VLAN-based (Kompella) | Single-Homed | Inter-AS Fabric→Ring | AN1 / AN2 |
| 8 | E-Line (EVPL) | BGP-VPLS VPWS | Single-Homed | Intra-AS Inter-Rings | MA1.2 / MA5 |
| 9 | E-Line (EVPL) | Floating Pseudowire | Anycast | Intra-AS Metro Ring | MSE1 / MSE2 / MA1.2 |
| 10 | E-Line (EPL) | EVPN-VPWS Port-Based | Single-Homed | Inter-AS Fabric→Ring | AN1 / AN2 |
| 11 | E-Line (EPL) | L2VPN Port-Based | Single-Homed | Inter-AS Fabric→Ring | AN1 / AN2 |
| 12 | E-LAN (EVP-LAN) | EVPN-ELAN VLAN-based | Active-Active MH | Inter-AS Fabric→Ring | AN1 / MEG |
| 13 | E-LAN (EVP-LAN) | EVPN-ELAN VLAN Bundle | Active-Active MH | Intra-AS Metro Fabric | AN1 / AN2 |
| 14 | E-LAN (EVP-LAN) | EVPN-ELAN Type 5 (IRB) | Active-Active MH | Inter-AS Fabric→MSE | MEG / MSE |
| 15 | E-LAN (EVP-LAN) | BGP-VPLS | Single-Homed | Inter-AS Fabric→Ring | MA1.2 / MA5 |
| 16 | E-LAN (EP-LAN) | EVPN-ELAN Port-Based | Active-Active MH | Inter-AS Fabric→Ring | AN1 / AN2 |
| 17 | E-Tree (EVP-Tree) | EVPN-ETREE | A-A MH Root | Intra-AS Metro Ring | Root MSE1/MSE2; Leaf MA4/MA5 |
| 18 | Access E-Line | EVPN-VPWS Local-Switching | Single-Homed | Metro Ring | MA5 / MA3 |
| 19 | Access E-Line | Layer 2 Circuit (L2CCC) Local-Switching | Single-Homed | Metro Ring | MA5 / MA3 |

---

## Solution Architecture

### Transport: SR-MPLS, Flex-Algo, and Color

The underlay uses **Segment Routing MPLS** with **multi-instance IS-IS** to bind
the metro ring domains to the metro fabric. **Flex-Algo** provides lightweight
traffic engineering by computing constrained topologies:

- **Gold** — Flex-Algo optimized on the **delay** metric (lowest latency).
- **Bronze** — Flex-Algo optimized on the **TE** metric.
- **Best Effort** — standard **IGP** metric.

Each VPN service is mapped to a specific Flex-Algo/transport class using **BGP
extended color-community** attributes for **color-aware steering**. A cascade
resolution scheme provides failover: **Gold → Bronze → Best Effort**.

### E-Line (EPL / EVPL)

Point-to-point services delivered with EVPN-VPWS, EVPN-FXC, BGP-VPLS (as p2p),
L2Circuit, Floating PW, and L2VPN.

**EVPN-VPWS (EVPL)** — MEG1/MEG2 example:

```junos
# MEG1 / MEG2 — EVPN-VPWS instance
interfaces {
    ae67 {
        unit 4000 {
            encapsulation vlan-ccc;
            vlan-id 4000;
        }
    }
}
routing-instances {
    EVPN-VPWS {
        instance-type evpn-vpws;
        protocols evpn {
            interface ae67.4000 {
                vpws-service-id {
                    local 2;
                    remote 1;
                }
            }
        }
        route-distinguisher 10.0.0.6:33300;
        vrf-target target:100:33300;
    }
}
```

**EVPN-FXC VLAN-Aware** — MA1.1 / MA1.2 example (flexible cross-connect,
VLAN-aware, per-EVC units):

```junos
interfaces {
    ae12 {
        flexible-vlan-tagging;
        unit 4001 {
            encapsulation vlan-ccc;
            vlan-id 4001;
            input-vlan-map push;
        }
        unit 4002 {
            encapsulation vlan-ccc;
            vlan-id 4002;
            input-vlan-map push;
        }
    }
}
routing-instances {
    FXC-VLAN-AWARE {
        instance-type evpn-vpws;
        protocols evpn {
            interface ae12.4001;
            interface ae12.4002;
        }
        # flexible-cross-connect vlan-aware
    }
}
```

**EVPN-FXC VLAN-Unaware** — AN3 / MSE1 example (all VLANs into one FXC group):

```junos
interfaces {
    et-0/0/13 {
        encapsulation ethernet-ccc;
        unit 0;
    }
}
routing-instances {
    FXC-VLAN-UNAWARE {
        instance-type evpn-vpws;
        protocols evpn {
            interface et-0/0/13.0 {
                # group fxc, service-id <id>
            }
        }
    }
}
```

**L2Circuit hot-standby** — AN3 toward MEG1 (primary) and MEG2 (backup):

```junos
protocols {
    l2circuit {
        neighbor 10.0.0.61 {          # MEG1 — primary
            interface ae3.4006 {
                virtual-circuit-id 4006;
            }
        }
        neighbor 10.0.0.62 {          # MEG2 — backup
            interface ae3.4006 {
                virtual-circuit-id 4006;
                backup-neighbor 10.0.0.62 hot-standby;
            }
        }
    }
}
```

**L2VPN (Kompella)** — site-identifier based:

```junos
routing-instances {
    L2VPN {
        instance-type l2vpn;
        protocols l2vpn {
            site CE1 {
                site-identifier 1;
                interface ae1.0;
            }
        }
    }
}
```

**BGP-VPLS as VPWS** — virtual-switch with small site-range:

```junos
routing-instances {
    VPLS-VPWS {
        instance-type virtual-switch;
        protocols vpls {
            site-range 2;
            label-block-size 2;
            site SITE1 { site-identifier 1; }
        }
    }
}
```

**Floating Pseudowire (Anycast)** — MSE1 / MSE2 anchored on `lt-` with anycast SID
and EVPN-ELAN stitching:

```junos
interfaces {
    ps22 {
        anchor-point lt-0/0/0;        # anycast anchor
        unit 0 {
            # floating PW terminated into EVPN-ELAN (stitching)
        }
    }
}
```

### E-LAN (EP-LAN / EVP-LAN)

Multipoint services delivered with EVPN-ELAN and BGP-VPLS.

**EVPN-ELAN VLAN-based** — AN1 (edge, `vlan-id none`) and MEG (MAC-VRF,
VLAN-based):

```junos
# AN1 — edge
routing-instances {
    BD_evpn_group_90_4011 {
        instance-type evpn;
        vlan-id none;
        protocols evpn { }
    }
}
# MEG — MAC-VRF vlan-based
routing-instances {
    MAC_VRF_90 {
        instance-type mac-vrf;
        service-type vlan-based;
        bridge-domains {
            BD_evpn_group_90_4011 { vlan-id 4011; }
        }
    }
}
```

**EVPN-ELAN VLAN-Bundle** — `vlan-id-list` bundling multiple CE-VLANs into one EVC.

**EVPN-ELAN Type-5 (IRB)** — IP-VRF with IRB, e.g. `METRO_L3VPN_4075` VGA:

```junos
routing-instances {
    METRO_L3VPN_4075 {
        instance-type vrf;
        interface irb.4075;
        # EVPN Type-5 routes (IP prefix advertisement)
    }
}
```

**BGP-VPLS (E-LAN)** — `vpls_group_103_4012`, larger site scale:

```junos
routing-instances {
    vpls_group_103_4012 {
        instance-type virtual-switch;
        protocols vpls {
            site-range 10;
            label-block-size 8;
        }
    }
}
```

### E-Tree (EVP-Tree)

Rooted-multipoint delivered with EVPN-ETREE. Root sites reach any leaf;
leaf-to-leaf is forbidden; root-to-root is permitted for redundancy. Roots may be
dual (active-active multihoming) for redundancy.

**Root** — MSE1 / MSE2, `etree-ac-role root`:

```junos
interfaces {
    ae10 {
        unit 0 {
            # root attachment circuit
        }
    }
}
routing-instances {
    EVPN-ETREE {
        instance-type evpn;
        protocols evpn {
            evpn-etree;
            interface ae10.0 {
                etree-ac-role root;
            }
        }
    }
}
```

**Leaf** — MA4 / MA5, `etree-ac-role leaf`:

```junos
routing-instances {
    EVPN-ETREE {
        instance-type evpn;
        protocols evpn {
            evpn-etree;
            interface xe-0/1/5.0 {
                etree-ac-role leaf;
            }
        }
    }
}
```

### Access E-Line (E-Access)

Per MEF 51, a wholesale Ethernet access service associating ENNI endpoint(s) to
UNI endpoint(s) via Operator Virtual Connections (OVCs). Delivered with
local-switched services (EVPN-VPWS local-switching and L2Circuit local-switching /
L2CCC). At the transit point (MA5, MX204), an S-TAG is mapped to the OVC endpoint
toward MA3 (ACX7100-48L); C-TAGs and CoS markings are preserved.

**MA3 — VLAN range with S-TAG push:**

```junos
interfaces {
    ae0 {
        flexible-vlan-tagging;
        unit 4082 {
            encapsulation vlan-ccc;
            vlan-id-list 2500-2599;
            input-vlan-map {
                push;
                vlan-id 4082;          # S-TAG
            }
        }
    }
}
```

**L2CCC local-switching** — cross-connect two local interfaces at the transit
node:

```junos
protocols {
    connections {
        interface-switch ACCESS-ELINE {
            interface ae5.4082;
            interface ae3.4082;
        }
    }
}
```

> The examples above are representative excerpts. Full, per-device configurations
> for every service are in [`../configuration/conf/`](../configuration/conf/)
> (hierarchical Junos) and [`../configuration/set/`](../configuration/set/)
> (set-format), with templated snippets in
> [`../configuration/snips/`](../configuration/snips/).

---

## Results Summary

All four validation categories passed across all 19 services. Over 12,000 MEF 3.0
test cases were executed via Iometrix Lab in the Sky.

- **Functional Service Attributes** — PASS across E-Line, E-LAN, E-Tree, Access
  E-Line (EVC behavior, VLAN handling, multiplexing/bundling, CE-VLAN ID/CoS).
- **L2CP Frame Behaviors** — PASS. L2CP handled per MEF forwarding profiles
  (discard / peer / pass-to-EVC) per protocol; correct disposition of the MEF
  L2CP address ranges validated.
- **Service OAM** — PASS. CCM, loopback (LBM/LBR), and linktrace (LTM/LTR)
  validated for connectivity and fault management.
- **Bandwidth Profile Attributes** — PASS. Two-Rate Three-Color Marker (TrTCM)
  policing validated in both **color-blind** and **color-aware** modes (CIR/CBS +
  EIR/EBS; green/yellow/red disposition).
- **Service Performance Attributes** — PASS. Frame delay, mean frame delay, frame
  delay variation (jitter), frame loss ratio, and availability met the specified
  SLA thresholds.

> **Note on coverage tables.** The published guide includes exhaustive
> per-requirement conformance matrices (MEF requirement coverage tables, tested /
> not-tested markers per service attribute and traffic-management case). Every
> included requirement is marked **PASS** or is an explicit **tested / not-tested**
> scope marker. Those matrices are condensed here to the category summaries above;
> consult the published JVD for the full per-requirement checkboxes.

---

## Recommendations

- Deploy SR-MPLS with Flex-Algo for lightweight, deterministic transport slicing;
  use color-aware steering to map services to Gold / Bronze / Best Effort classes
  with cascade failover.
- Use the Metro Edge Gateway (MEG) border-leaf function to localize the services
  edge and provide efficient inter-domain hand-off between metro fabric and rings.
- Prefer EVPN-based services (EVPN-VPWS, EVPN-FXC, EVPN-ELAN, EVPN-ETREE) for
  active-active multihoming, faster convergence, and cloud-aligned operations;
  retain L2Circuit / L2VPN / BGP-VPLS where interoperability or existing
  deployments require them.
- Validate bandwidth profiles with TrTCM in the mode (color-blind or color-aware)
  that matches the wholesale/retail contract.
- Standardize on Release 23.2R2 (or later qualified) across the tested platform
  set for MEF 3.0 conformance.

---

## Revision History

| Date | Description |
| --- | --- |
| February 2025 | Initial publication of the Metro as a Service MEF 3.0 JVD. |
| October 12, 2025 | Published Design Guide revision (this document). |

---

## Sources

- JVD document: <https://www.juniper.net/documentation/us/en/software/jvd/jvd-metro-ebs-mef-03-02/index.html>
- Companion docs: [`solution-overview.md`](solution-overview.md),
  [`test-report-brief.md`](test-report-brief.md)
- Configurations: [`../configuration/`](../configuration/)
- Topology diagram: [`../images/Metro-MEF-Topology.png`](../images/Metro-MEF-Topology.png)
