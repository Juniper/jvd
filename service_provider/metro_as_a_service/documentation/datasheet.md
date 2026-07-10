# JVD Datasheet — Metro as a Service (MEF 3.0)

> Quick-reference datasheet for the **Metro as a Service (MaaS)** Juniper Validated
> Design (`metro-ebs-mef-03-02`). Critical facts only; for depth see the published
> JVD on juniper.net and the companion docs in this folder.

## At a glance

Metro as a Service extends the Metro Ethernet Business Services design by
validating a dense L2/L3 Carrier Ethernet service portfolio, end to end, across
intra-domain and inter-AS regions, over a segment-routing Cloud Metro transport
foundation.

| | |
|---|---|
| **JVD** | Metro as a Service — `metro-ebs-mef-03-02` |
| **Track** | Metro Ethernet Business Services (Metro EBS) |
| **Architecture** | Cloud Metro: metro access multi-ring + two-stage metro fabric (spine/leaf) across two autonomous systems |
| **Transport** | SR-MPLS underlay over multi-instance IS-IS; TI-LFA; Flexible Algorithm; color-aware Transport Classes; inter-AS BGP-LU + BGP-CT |
| **Service families** | E-Line, E-LAN, E-Tree, Access E-Line, plus Layer 3 / Internet access |
| **Validation** | Applicable MEF 3.0 service requirements — more than **12,000 MEF 3.0 test cases**, using the Iometrix "Lab in the Sky" test infrastructure |
| **Min. validated software** | Junos OS / Junos OS Evolved **23.2R2** (see juniper.net for the current validated matrix) |

## Device roles

| Role | In the network |
|---|---|
| **Metro Access Node (AN / MA)** | Terminates customer UNIs at the edge — fabric access leaf (AN) and multi-ring access node (MA). |
| **Lean Spine / Aggregation (AG)** | Spine of the two-stage metro fabric; aggregates access leaves. |
| **Metro Edge Gateway (MEG)** | Border-leaf; extends advanced L2/L3 services and cloud / edge-compute interconnect toward subscribers. |
| **Multi-Services Edge (MSE)** | High-scale L2/L3 service termination — PWHT, hosted Internet VRF, and complex service interconnect. |
| **Metro Distribution Router (MDR)** | Inter-ring distribution across the multi-ring access domain. |
| **Core (CR)** | SR-MPLS core and peering between metro domains and the wider network. |

## Featured platforms

Minimum validated software per role. The JVD is re-validated on newer releases
through ongoing regression; for the **current** validated platform + software
matrix, see the published JVD page on juniper.net (linked below).

| Role | Device(s) | Min. validated software |
|---|---|---|
| Access Leaf (AN) | ACX7100-48L, ACX710, ACX5448, MX204 | 23.2R2 |
| Lean Spine (AG) | ACX7100-32C | 23.2R2 |
| Metro Edge Gateway (MEG) | ACX7509, ACX7100-32C | 23.2R2 |
| Core (CR) | PTX10001-36MR | 23.2R2 |
| Multi-Services Edge (MSE) | MX304 | 23.2R2 |
| Metro Distribution Router (MDR) | MX10003, ACX7509 | 23.2R2 |
| Metro Access Node (MA) | ACX7024, ACX7100-48L, MX204 | 23.2R2 |

The primary devices under test — ACX7024, ACX7100, ACX7509, and MX304 — are MEF
3.0-certified products on the MEF registry (a product-level certification,
separate from the JVD validation).

> The Metro EBS track spans multiple JVDs/phases (e.g. `03-01` foundation, `03-03`
> platform refresh) that may feature different platforms and releases. This
> datasheet reflects the `metro-ebs-mef-03-02` set; see each phase's juniper.net
> page for its validated matrix.

## Protocols

**Underlay / transport**
- IS-IS (multi-instance across fabric + ring domains)
- Segment Routing MPLS (SR-MPLS), SRGB
- TI-LFA (link / node protection); BFD / micro-BFD
- Flexible Algorithm (delay & TE metrics); Flex-Algo Prefix Metric (FAPM)
- Transport Classes — Gold (delay), Bronze (TE), Best-Effort (IGP); cascade resolution

**Inter-domain transport**
- BGP Labeled Unicast (BGP-LU)
- BGP Classful Transport (BGP-CT)
- Color-aware traffic steering; service mapping to transport classes

**Overlay / services**
- EVPN-VPWS; EVPN-FXC (VLAN-aware / VLAN-unaware)
- EVPN-ELAN (VLAN-based, VLAN-bundle, Type-5); EVPN-ETREE
- BGP-VPLS, L2Circuit, L2VPN
- Floating Pseudowire with Anycast-SID; Local Switching (LSW)
- Layer 3 / Internet access: EVPN-ELAN Type-5 (validated at L2), L3VPN, EVPN Anycast IRB

**Routing & policy**
- MP-BGP (EVPN, L2VPN, VPLS, L3VPN families)
- Route Reflectors (redundant)
- BGP color-community mapping; community-based routing policy

**High availability**
- EVPN multihoming (all-active & single-active); Ethernet Segment / ESI-LAG; designated forwarder
- Anycast PW (vESI); L2Circuit hot-standby

**OAM & assurance**
- Service OAM / CFM (CCM, LBM, LTM, LTR); L2CP handling
- Performance monitoring (frame delay, delay variation, frame loss)
- Bandwidth profiles & policing (CIR / EIR); Class of Service

## Services & use cases

The JVD delivers the four MEF Carrier Ethernet service types plus Layer 3 /
Internet access. A **use case** composes four dimensions: *connectivity intent*
(what is connected) × *service* (means of delivery) × *transport intent* (the
color / SLA path) × *resiliency* (homing model).

### Services

| Service type | What it delivers | Means of delivery |
|---|---|---|
| **E-Line** (point-to-point) | Private line / EVPL between two sites, a cloud on-ramp, or a backhaul link | EVPN-VPWS, EVPN-FXC, L2Circuit, L2VPN, BGP-VPLS (VPWS), Floating PW |
| **E-LAN** (multipoint) | Multi-site enterprise LAN / any-to-any business connectivity | EVPN-ELAN (VLAN-based, VLAN-bundle, Type-5), BGP-VPLS |
| **E-Tree** (rooted-multipoint) | Hub-and-spoke where leaf sites reach the roots but not each other | EVPN-ETREE |
| **Access E-Line** (wholesale) | Operator-to-operator Ethernet access handoff (UNI to NNI) | EVPN-VPWS / L2Circuit local switching |
| **Layer 3 / Internet** | Internet access extended to Layer 2 services; routed IP connectivity | EVPN-ELAN Type-5 (validated at L2); L3VPN and EVPN Anycast IRB (supported models, outside MEF 3.0 scope) |

### Intent-based use cases

Transport intent is selected per VPN service — **best-effort** (IGP), **Bronze**
(TE metric), or **Gold** (lowest-delay Flex-Algo), with cascade fallback; L3VPN can
map specific routes to a color.

| Use case | Service (means of delivery) | Transport intent | Resiliency |
|---|---|---|---|
| Site-to-site private line | E-Line — EVPN-VPWS / L2Circuit | Best-effort, Bronze, or Gold | Single-homed / all-active / hot-standby |
| Low-latency access to edge compute (MEC) at the MEG | E-Line — EVPN-VPWS / FXC | Gold (lowest delay) | All-active multihoming |
| Multi-site business LAN with shared MEC access | E-LAN — EVPN-ELAN | Per-service color (tiered) | All-active multihoming |
| Layer 2 service with Layer 3 Internet access | EVPN-ELAN Type-5 (toward the MSE) | Per-service color | All-active multihoming |
| Hub-and-spoke / content distribution | E-Tree — EVPN-ETREE | Best-effort or color | Active-active roots |
| Wholesale Ethernet access handoff | Access E-Line — EVPN-VPWS / L2CCC local switching | Best-effort | Single-homed |
| Traffic-engineered inter-AS transport | Any service mapped to Bronze | Bronze (TE), inter-AS BGP-CT | Per service |
| Low-latency connectivity for edge inference / AI (emerging) | E-Line / E-LAN to MEC | Gold (lowest delay) | All-active multihoming |

Together these compose the **19 specific validated use cases** in the JVD. See the
design guide and test report brief for the full matrix (service, homing, placement,
endpoints).

## Design concepts

The design breaks into these areas — use this to jump to the part you need help with.

- **Underlay & transport** — SR-MPLS over multi-instance IS-IS; TI-LFA; the
  two-stage metro fabric and multi-ring access topology.
- **Traffic engineering & network slicing** — Flexible Algorithm + Transport
  Classes (Gold / Bronze / Best-Effort) + color-aware steering and cascade
  resolution.
- **Overlay & service delivery** — EVPN service models (VPWS / FXC / ELAN / ETREE)
  and legacy service coexistence.
- **Routing policy & control plane** — MP-BGP overlay, Route Reflector design,
  inter-AS BGP-CT, and color-community / service mapping.
- **High availability** — EVPN multihoming, ESI-LAG, Anycast PW, and hot-standby.

## References

- **Published JVD (juniper.net):** <https://www.juniper.net/documentation/us/en/software/jvd/jvd-metro-ebs-mef-03-02/index.html>
- **All Juniper Validated Designs:** <https://www.juniper.net/documentation/validated-designs/>
- **JVD portal** (Discover · Learn · Design · Build): <https://juniper.github.io/jvd/portal/>
- **Design guide:** [`design-guide.md`](design-guide.md)
- **Solution overview:** [`solution-overview.md`](solution-overview.md)
- **Test report brief:** [`test-report-brief.md`](test-report-brief.md)
- **Configurations:** [`../configuration/conf`](../configuration/conf)
- **Snip library:** [`../configuration/snips`](../configuration/snips)
