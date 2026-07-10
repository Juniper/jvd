# JVD Datasheet — Metro as a Service (MEF 3.0)

> A concise, structured summary of the **Metro as a Service (MaaS)** Juniper
> Validated Design. It is the fast "what's in this JVD" reference and the
> grounding source for the portal's Design & Planner (BYOAI Design mode). For
> depth, see [`design-guide.md`](design-guide.md),
> [`solution-overview.md`](solution-overview.md), and
> [`test-report-brief.md`](test-report-brief.md).

## At a glance

Metro as a Service extends the Metro Ethernet Business Services design by
validating a dense L2/L3 Carrier Ethernet service portfolio, end to end, across
intra-domain and inter-AS regions, over a segment-routing Cloud Metro
transport foundation.

| | |
|---|---|
| **Track** | Metro Ethernet Business Services (Metro EBS) — Metro as a Service phase |
| **Architecture** | Cloud Metro: metro access multi-ring + two-stage metro fabric (spine/leaf) across two autonomous systems |
| **Transport** | SR-MPLS underlay, IS-IS, TI-LFA; Flexible Algorithm; color-aware Transport Classes; inter-AS BGP-LU + BGP-CT |
| **Service families** | E-Line, E-LAN, E-Tree, Access E-Line (E-Access) |
| **Validation** | Featured services validated against applicable MEF 3.0 service requirements — more than **12,000 MEF 3.0 test cases** |

## Functional roles

The architecture is described by functional role; consult the current JVD for the
exact platform mapping.

- **Metro Access Node (AN / MA)** — ring and fabric access.
- **Aggregation / Fabric Spine & Lean Spine (AG)** — two-stage fabric.
- **Metro Edge Gateway (MEG)** — border-leaf; extends advanced service and cloud
  interconnect toward subscribers.
- **Metro Service Edge (MSE)** — high-scale L2/L3 termination, PWHT, hosted
  Internet VRF, BNG-class functions.
- **Metro Distribution Router (MDR)** — inter-ring distribution.
- **Core / cloud interconnect** — SP core, Internet, and cloud on-ramp.

## Featured platforms

The primary devices under test are MEF 3.0-certified products: **ACX7024,
ACX7100, ACX7509, and MX304** (product-level MEF 3.0 certification is a separate,
platform-specific claim; consult the current JVD for the validated platform,
software, scale, and configuration set).

## Services and implementations

| MEF service type | Implemented with |
|---|---|
| **E-Line** (point-to-point) | EVPN-VPWS, EVPN-FXC (VLAN-aware / VLAN-unaware), L2Circuit, L2VPN, BGP-VPLS (VPWS), Floating Pseudowire |
| **E-LAN** (multipoint-to-multipoint) | EVPN-ELAN (VLAN-based, VLAN-bundle, Type-5), BGP-VPLS |
| **E-Tree** (rooted-multipoint) | EVPN-ETREE |
| **Access E-Line** (wholesale access) | EVPN-VPWS local switching, L2Circuit local switching |

Modern EVPN service models coexist with established L2Circuit, L2VPN, VPLS, and
BGP-VPLS services over the common transport foundation.

## Transport foundation

- **Underlay:** Segment Routing MPLS with IS-IS; TI-LFA for fast reroute;
  multi-instance IS-IS across ring and fabric domains.
- **Traffic engineering:** Flexible Algorithm (delay and TE metrics), Flex-Algo
  Prefix Metric (FAPM), color-aware Transport Classes.
- **Inter-domain:** seamless SR-MPLS via BGP Labeled Unicast (BGP-LU) and BGP
  Classful Transport (BGP-CT); end-to-end service mapping.
- **High availability:** EVPN multihoming (all-active and single-active), ESI-LAG,
  Floating Pseudowire with Anycast-SID.

## Validation

The Metro as a Service phase validated the featured services against applicable
MEF 3.0 service requirements through more than **12,000 MEF 3.0 test cases**,
executed by HPE Juniper using the Iometrix "Lab in the Sky" testing
infrastructure. Validation covered five categories: functional behavior, service
OAM (SOAM), Layer 2 control protocol (L2CP) handling, bandwidth profiles (BWP),
and service performance.

> This JVD validation is not MEF service certification, which is a separate
> process. Product-level MEF 3.0 certification of specific platforms on the MEF
> registry is a separate, legitimate claim.

## Not in the validated baseline

SRv6, Multi-Path TE (MPTE), and Compute-Aware Traffic Steering (CATS) are
forward-looking directions and are **not** part of this JVD's validated baseline.
The validated transport is SR-MPLS.

## Go deeper

- [`design-guide.md`](design-guide.md) — full architecture, per-service config examples, results.
- [`solution-overview.md`](solution-overview.md) — executive summary, benefits, objectives.
- [`test-report-brief.md`](test-report-brief.md) — platforms/DUT, test categories, conformance results.
- Published JVD: <https://www.juniper.net/documentation/us/en/software/jvd/jvd-metro-ebs-mef-03-02/index.html>
- Validated configs: [`../configuration/conf`](../configuration/conf) · snip library: [`../configuration/snips`](../configuration/snips)
