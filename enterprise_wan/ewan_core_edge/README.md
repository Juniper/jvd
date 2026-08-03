# Enterprise WAN Core and Edge

> Reliable MPLS/SR-based enterprise WAN connecting branch, campus, and data center locations with Juniper MX, ACX, and PTX platforms.

Discover how to create a reliable network design for an enterprise WAN edge and core network with Juniper's validated design. Seamlessly connect your branch and campus locations with enterprise data centers and public cloud provider data centers.

## Highlights

- MPLS/Segment Routing transport with RSVP-TE and SR-MPLS options
- L3VPN and EVPN overlay services for multi-site connectivity
- Multi-vendor WAN edge with MX, ACX, and PTX platforms
- Sub-50ms convergence with TI-LFA and BFD

* JVD document: <https://www.juniper.net/documentation/us/en/software/jvd/jvd-ewan-core-edge-01/index.html>
* Solution overview: <https://www.juniper.net/documentation/us/en/software/jvd/sol-overview-ewan-core-edge-01.pdf>
* Test report: <https://www.juniper.net/documentation/us/en/software/jvd/testreportbrief-ewan-core-edge-01.pdf>

## Hardware

| Juniper Product | Role | Software |
|---|---|---|
| **MX304** | WAN Edge 1 | Junos OS |
| **MX10008** | WAN Edge 2 | Junos OS |
| **ACX7509** | WAN Edge 3 | Junos OS Evolved |
| **ACX7100-48L** | WAN Edge 4 | Junos OS Evolved |
| **PTX10003-80C** | Core / P1 (Route Reflector) | Junos OS Evolved |
| **PTX10001-36MR** | Core / P2 (Route Reflector) | Junos OS Evolved |
| **ACX7100-48L** | L2/L3 Edge 1 (CE) | Junos OS Evolved |
| **MX480** | L2/L3 Edge 2 (CE) | Junos OS |

This JVD is regressively validated across multiple Junos and Junos OS
Evolved releases. For the complete list of validated software versions,
see
[Validated Platforms](https://www.juniper.net/documentation/us/en/software/jvd/jvd-ewan-core-edge-01/validated-platforms.html).

## Configurations

| File | Role |
|---|---|
| [`wanedge1_mx304.conf`](configuration/conf/wanedge1_mx304.conf) | WAN Edge 1 (MX304) |
| [`wanedge2_mx10008.conf`](configuration/conf/wanedge2_mx10008.conf) | WAN Edge 2 (MX10008) |
| [`wanedge3_acx7509.conf`](configuration/conf/wanedge3_acx7509.conf) | WAN Edge 3 (ACX7509) |
| [`wanedge4_acx7100-48l.conf`](configuration/conf/wanedge4_acx7100-48l.conf) | WAN Edge 4 (ACX7100-48L) |
| [`p1_ptx10003.conf`](configuration/conf/p1_ptx10003.conf) | Core / P1 — Route Reflector (PTX10003-80C) |
| [`p2_ptx10001-36mr.conf`](configuration/conf/p2_ptx10001-36mr.conf) | Core / P2 — Route Reflector (PTX10001-36MR) |
| [`ce1_acx7100-48l.conf`](configuration/conf/ce1_acx7100-48l.conf) | L2/L3 Edge 1 (ACX7100-48L) |
| [`ce2_mx480.conf`](configuration/conf/ce2_mx480.conf) | L2/L3 Edge 2 (MX480) |