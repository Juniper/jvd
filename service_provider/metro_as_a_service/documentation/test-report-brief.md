# Test Report Brief — Metro as a Service (MEF 3.0)

> Markdown conversion of the published *Test Report Brief: Metro as a Service MEF
> 3.0* (`test-report-brief-JVD-AWAN-METRO-EBS-MEF-03-02`). Faithful text mirror of
> the published PDF for reference and for grounding the portal's Design & Planner.
> All test results are transcribed as published.

## Introduction

Metro as a Service (MaaS) introduces the first supplier-approved comprehensive
validation of MEF 3.0 compliance conducted over a production-emulated network. The
Metro as a Service MEF 3.0 JVD enhances the solution established with the Metro
Ethernet Business Services JVD, qualifying **over 12,000 MEF 3.0 end-to-end test
cases** across all featured E-Line, E-LAN, E-Tree, and Access E-Line (E-Access)
services.

Key benefits to service providers: seamless interoperability, faster
time-to-market, and guaranteed service quality. The primary devices under test are
MEF 3.0-certified products: **ACX7024, ACX7100, ACX7509, and MX304**.

## Equipment Information

Validated with **Iometrix** — the official MEF test laboratory — in accordance
with the MEF 3.0 Test Plan for Service Attributes and Traffic Management.

- **Product models:** ACX7100-48L, ACX7100-32C, ACX7509, MX304, MX204, ACX710,
  ACX5448
- **Software version:** 23.2R2 (Junos OS and Junos OS Evolved)
- **Test infrastructure:** Iometrix Lab in the Sky (Network-as-a-Service,
  cloud-based, x86 whitebox virtual test probes)

## Test Objectives and Categories

The MEF 3.0 test cases are qualified across the transport and services
architectures and fall into four major categories:

- **Functional Service Attributes and Parameters** — service functionalities and
  attributes per service type (EVCs, VLAN handling, service multiplexing);
  verifies correct mapping of CE-VLAN ID, CoS, EVC service attributes.
- **Layer 2 Control Protocol (L2CP) and Service OAM (SOAM) Frame Behavior** —
  correct tunneling/forwarding of control and management frames (CCM, LBM, LTM,
  LTR) per MEF network operation and maintenance standards.
- **Bandwidth Profile Attributes and Parameters** — CIR, EIR, and traffic
  policing to ensure adherence to agreed-upon bandwidth allocations.
- **Service Performance Attributes and Parameters** — latency, jitter, Frame Loss
  Ratio (FLR), and availability per specified SLAs across unicast, multicast, and
  broadcast traffic.

## Test Topology

The MaaS MEF JVD leverages two foundational components: the physical infrastructure
introduced in the Metro EBS JVD and the Iometrix Lab in the Sky testing
infrastructure. The design integrates traditional Metro ring architectures using
multi-instance IS-IS with Metro fabrics.

- **Underlay:** Segment Routing (SR) MPLS.
- **Traffic engineering:** Flex-Algo provides lightweight TE. Transport classes are
  associated with Flex-Algo tunnels to create network slices established by lowest
  delay, best TE metrics, or preferred IGP metrics.
- **Three paths:** **Gold** (Delay metric), **Bronze** (TE metric), and **Best
  Effort** (IGP metric). Each VPN service is selectively mapped to specific
  Flex-Algos using BGP extended color-community attributes for color-aware traffic
  steering. A cascade-style resolution scheme allows Gold to fail over to Bronze
  and Bronze to fail over to Best Effort.

## Platforms Tested (Devices Under Test)

Access platforms: ACX7024, ACX7100-48L, ACX710, ACX5448, MX204. Aggregation/spine:
ACX7100-32C (metro fabric) and ACX7509 with MX10003 as metro distribution routers
in the ring. Metro Edge Gateway (border leaf): ACX7509 and ACX7100-32C. Metro
core: PTX10001-36MR. Multi-services edge: MX304.

**Table 1 — Topology Abstract (Devices Under Test)**

| Platform Role | Role | Device | Release |
| --- | --- | --- | --- |
| Access Leaf | AN | ACX7100-48L (DUT), ACX710, ACX5448, MX204 | 23.2R2 |
| Lean Spine | AG1 | ACX7100-32C | 23.2R2 |
| Lean Edge Border Leaf | MEG | Metro Edge Gateway: ACX7509 (DUT), ACX7100-32C (DUT) | 23.2R2 |
| Core | CR | PTX10001-36MR | 23.2R2 |
| Multi-Services Edge | MSE | MX304 (DUT) | 23.2R2 |
| Metro Distribution Router | MDR | MX10003, ACX7509 (DUT) | 23.2R2 |
| Metro Access Node | MA | ACX7024 (DUT), ACX7100-48L (DUT), MX204 | 23.2R2 |

**Version qualification:** Junos OS and Junos OS Evolved Release 23.2R2.

> **Scale and Performance Data.** Validated KPIs are multi-dimensional and reflect
> observations that reasonably represent solution capabilities; they do not
> indicate the maximum scale/performance of individual tested devices. For
> uni-dimensional per-SKU data and the latest comprehensive report, contact a
> Juniper Networks representative.

## High-Level Features Tested

- EVPN-VPWS
- EVPN-FXC (aware + unaware)
- EVPN-ELAN (VLAN-based, VLAN-bundle)
- EVPN-ETREE
- L2Circuit, L2VPN, BGP-VPLS
- Floating PW with Anycast-SID
- Local Switching (LSW) EVPN-VPWS & L2Circuit
- Service OAM
- Layer 2 Control Protocol (L2CP)
- Performance (frame delay, mean frame delay, frame delay variation, frame loss)
- Class of Service & Policing

Metro Ethernet use cases delivered: **E-Line** (EPL, EVPL), **E-LAN** (EP-LAN,
EVP-LAN), **E-Tree** (EP-TREE, EVP-TREE), **Access E-Line** (UNI to NNI), and
**Internet Access** (IP service to IPVC endpoints).

## Test Status

Aligned with MEF 3.0 mandatory certification requirements per the **MEF 91 Carrier
Ethernet Test Requirements** standard. Test cases are **mandatory** or
**conditional mandatory** (only mandatory when certain optional attributes are
used). The architecture supports additional MEF-defined features beyond the
unconditional mandatory certification criteria; some optional attributes (e.g. UNI
resiliency) are covered to preserve the intentionality of the JVD.

## Test Results

### E-Line (point-to-point)

The E-Line protocol suite includes EVPN-VPWS, EVPN Flexible Cross Connect (FXC),
BGP-VPLS (as point-to-point), L2Circuit, Floating PW, and L2VPN. The profile
implements 11 distinct E-Line use cases.

- **EPL** — port-based "all-to-one bundling"; dedicated, transparent data path.
- **EVPL** — like EPL but supports service multiplexing (VLAN-based), allowing
  multiple services on one physical UNI.

**Table 2 — EVPL Services**

| # | Service | VPN Type | High Availability | Service Instantiation | Testcase count |
| --- | --- | --- | --- | --- | ---: |
| 1 | E-Line | EVPN-VPWS_EDGE | Single-Homed / Active-Active Multihoming | Inter-AS Fabric to Ring | 460 |
| 2 | E-Line | EVPN-VPWS-MH-E2E | Active-Active Multihoming | Intra-AS Intra-Fabric | 460 |
| 3 | E-Line | EVPN-VPWS-SH-fabric | Single-Homed | Intra-AS Intra-Fabric | 460 |
| 4 | E-Line | EVPN Flexible Cross-Connect VLAN Aware | Active-Active Multihoming | Inter-AS Fabric to Ring | 460 |
| 5 | E-Line | EVPN Flexible Cross-Connect VLAN Unaware | Single-Homed | Inter-AS Fabric to MSE | 460 |
| 6 | E-Line | Layer 2 Circuit | Hot-Standby | Intra-AS Metro Fabric | 460 |
| 7 | E-Line | L2VPN VLAN-based | Single-Homed | Inter-AS Fabric to Ring | 460 |
| 8 | E-Line | BGP-VPLS VPWS | Single-Homed | Intra-AS Inter-Rings | 460 |
| 9 | E-Line | Floating Pseudowire | Anycast | Intra-AS Metro Ring | 460 |

**Table 3 — EPL Services**

| # | Service | VPN Type | High Availability | Service Instantiation | Testcase count |
| --- | --- | --- | --- | --- | ---: |
| 1 | E-Line | EVPN-VPWS Port Based | Single-Homed | Inter-AS Fabric to Ring | 508 |
| 2 | E-Line | L2VPN Port Based | Single-Homed | Inter-AS Fabric to Ring | 508 |

E-Line MEF 3.0 conformance (Service Attributes, 20 cases; Traffic Management, 17
cases) across EPL and EVPL: **all applicable cases PASS**.

### E-LAN (multipoint-to-multipoint)

Protocol suite: EVPN-ELAN and BGP-VPLS. Five distinct E-LAN use cases.

- **EP-LAN** — port-based "all-to-one bundling"; all port traffic maps to one EVC.
- **EVP-LAN** — supports service multiplexing and shared bandwidth; multiple EVCs
  per UNI.

**Table 6 — EVP-LAN Services**

| # | Service | VPN Type | High Availability | Service Instantiation | Testcase count |
| --- | --- | --- | --- | --- | ---: |
| 1 | E-LAN | EVPN-ELAN VLAN-based | Active-Active Multihoming | Inter-AS Fabric to Ring | 1149 |
| 2 | E-LAN | EVPN-ELAN VLAN Bundle | Active-Active Multihoming | Intra-AS Metro Fabric | 478 |
| 3 | E-LAN | EVPN-ELAN Type 5 | Active-Active Multihoming | Inter-AS Fabric to MSE | 1139 |
| 4 | E-LAN | BGP-VPLS | Single-Homed | Inter-AS Fabric to Ring | 1149 |

**Table 7 — EP-LAN Services**

| # | Service | VPN Type | High Availability | Service Instantiation | Testcase count |
| --- | --- | --- | --- | --- | ---: |
| 1 | E-LAN | EVPN-ELAN Port Based | Active-Active Multihoming | Inter-AS Fabric to Ring | 1266 |

E-LAN MEF 3.0 conformance (Service Attributes, 21 cases; Traffic Management, 17
cases) across EP-LAN and EVP-LAN: **all applicable cases PASS**.

### E-Tree (rooted-multipoint)

Protocol suite: EVPN-ETREE with single or dual root nodes. Root sites can reach
any leaf; leaf-to-leaf communication is forbidden; root-to-root is allowed for
redundancy. EP-Tree is supported but not included in validation.

**Table 10 — E-Tree Service**

| # | Service | VPN Type | High Availability | Service Instantiation | Testcase count |
| --- | --- | --- | --- | --- | ---: |
| 1 | E-Tree | EVPN-ETREE | Active-Active Multihoming Root | Intra-AS Metro Ring | 1129 |

E-Tree MEF 3.0 conformance (Service Attributes, 27 cases; Traffic Management, 16
cases) for EVP-Tree: **all applicable cases PASS**.

### Access E-Line (E-Access)

Defined by MEF 51 as a wholesale Ethernet access service using Operator Virtual
Connections (OVCs) to associate ENNI endpoint(s) to UNI endpoint(s). Delivered
with local-switched services: L2CCC with L2Circuit local-switching and EVPN-VPWS
local-switching. At the transit point (MA5, MX204), an S-TAG is mapped to the OVC
endpoint toward MA3 (ACX7100-48L) to support INNI-to-INNI connectivity; C-TAGs and
CoS markings are preserved.

**Table 13 — Access E-Line Services**

| # | Service | VPN Type | High Availability | Service Instantiation | Testcase count |
| --- | --- | --- | --- | --- | ---: |
| 1 | Access E-Line | EVPN-VPWS Local-Switching | Single-Homed | Metro Ring | 396 |
| 2 | Access E-Line | Layer 2 Circuit (L2CCC) Local-Switching | Single-Homed | Metro Ring | 396 |

Access E-Line MEF 3.0 conformance (Service Attributes and Traffic Management, both
UNI→ENNI and ENNI→UNI): **all applicable cases PASS**.

## Overall result

Over 12,000 MEF 3.0 test cases executed across E-Line, E-LAN, E-Tree, and Access
E-Line using Iometrix Lab in the Sky. **All included test cases passed without
exception.** The five categories validated: Functional Service Attributes, L2CP
Frame Behaviors, Service OAM Functionalities, Bandwidth Profile Attributes, and
Service Performance Attributes.

## Sources

- Test report: <https://www.juniper.net/documentation/us/en/software/jvd/test-report-brief-metro-ebs-mef-03-02.pdf>
- Companion docs: [`solution-overview.md`](solution-overview.md), [`design-guide.md`](design-guide.md)
