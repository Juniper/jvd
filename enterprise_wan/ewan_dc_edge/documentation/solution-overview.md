> Complete Markdown conversion of [sol-overview-ewan-evpn-gw-01-01.pdf](https://www.juniper.net/documentation/us/en/software/jvd/sol-overview-ewan-evpn-gw-01-01.pdf). No content is summarized. The source PDF is authoritative.

<!-- Source PDF page 1 -->

![Solution overview cover photo](images/solution-overview-cover-photo.png)
## Juniper® Validated Design
# JVD Solution Overview: Enterprise Data Center Edge
## Executive Summary
Modern enterprises run business-critical applications in multiple private and public data centers. They use WANs to connect their data

centers and provide access to users in remote campus and branch locations. This JVD explains seamlessly interconnecting data centers, or data centers and campus and branch locations over an MPLS-based WAN. It validates the seamless interconnect of Ethernet VPN
Multiprotocol Label Switching (EVPN-MPLS) with Ethernet VPN-Virtual Extensible LAN (EVPN-VXLAN).

## Solution Overview
Different protocols stacks are used in WANs and data center networks to provide Layer 2 (L2) connectivity. VXLAN or EVPN over

VXLAN has become a de facto standard to build scalable L2 data center fabrics. Enterprise WANs utilize MPLS services such as L2VPN, VPLS, and EVPN to connect campus and branch locations to the data center resources. EVPN-MPLS has become the dominant technology for enabling connectivity between enterprise campus and branch offices. It is replacing the legacy VPLS interconnect model.

The advantages of an EVPN-MPLS-based WAN services include:

- Multihoming

- Rapid convergence

- Active/active or active/standby attachment points

- BGP-based MAC learning

Data center edge/gateway devices process all network traffic that enters and exits the data center. They connect the enterprise data center to the WAN and interconnect the EVPN-VXLAN tunnels in the data center with the EVPN-MPLS tunnels in the WAN. This JVD uses MX480 and MX10003 Universal Edge routers as data center edge/gateway devices because they can perform seamless EVPN-VXLAN to EVPN-MPLS stitching.

![Solution overview publication footer](images/solution-overview-publication-footer.jpeg)

Send feedback to: design-center-comments@juniper.net V1.0/231221/sol-overview-ewan-evpn-gw-01-01

## Sources

- Published PDF: [sol-overview-ewan-evpn-gw-01-01.pdf](https://www.juniper.net/documentation/us/en/software/jvd/sol-overview-ewan-evpn-gw-01-01.pdf)
- Companion documents: [design-guide.md](design-guide.md), [test-report-brief.md](test-report-brief.md)
