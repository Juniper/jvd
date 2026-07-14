> Faithful markdown conversion of the published PDF:
> [JVD Solution Overview: Enterprise WAN Advanced Core and Edge Services](https://www.juniper.net/documentation/us/en/software/jvd/sol-overview-ewan-adv-core-edge-svc-01.pdf).
> The PDF on juniper.net is the source of truth.

# JVD Solution Overview: Enterprise WAN Advanced Core and Edge Services

**Version:** sol-overview-ewan-adv-core-edge-svc-01 (July 2024)

## Executive Summary

An enterprise WAN is vital for connecting multiple disparate sites within an enterprise, allowing seamless communication and collaboration. This Enterprise WAN Advanced Core and Edge Services validated design introduces a validated solution for a more simplified and secure EWAN infrastructure. This JVD utilizes advanced protocols like Ethernet virtual private network (EVPN) and segment routing (SR) to reduce network complexity while ensuring reliability, stability, and Layer 2 / Layer 3 VPN connectivity between enterprise sites. This solution also provides advanced network security via MACsec functionality ensuring data integrity and DDoS protection, thereby preventing malicious traffic flows from spreading across the entire WAN. Overall, the solution offers numerous benefits, including enhanced network stability, security, and scalability, all while reducing operational costs.

## Solution Overview

This JVD covers migration scenarios from legacy L2/L3 services to advanced VPN services based on an EVPN and SR underlay infrastructure. Essentially, EVPN over Segment Routing is used as a universal method to enable L2/L3 multipoint-to-multipoint and L2 point-to-point connections, replacing a range of traditionally used L3VPN, L2VPN, Martini L2 circuits, and Virtual Private LAN service (VPLS) offerings. This JVD emphasizes the utilization of the latest Juniper Networks products with embedded MACsec functionality, enhanced network security, and data integrity.

The latest Juniper ACX and MX platforms are deployed to support various port speeds to build a simpler and more secure EWAN infrastructure. This JVD outlines the preferred choice of **MX304, MX10004, and ACX7000 series** routers as enterprise WAN Edge devices, while **PTX10000 series** routers act as the backbone of the private WAN and aims to validate all the platforms as part of a coherent enterprise WAN solution. This solution introduces DDoS protection mechanisms, such as BGP FlowSpec at the edge, to safeguard edge devices against ICMP flood attacks. Unicast reverse-path forwarding (unicast RPF) is also activated to protect against attacks originating from unexpected source addresses.

## Key Benefits

- **Simplification** — EVPN + SR replace L3VPN, L2VPN, Martini L2 circuits, and VPLS with a single unified service protocol
- **Security** — embedded MACsec (L2 encryption on core links), BGP FlowSpec DDoS protection, unicast RPF
- **Reliability** — TI-LFA fast reroute, BFD-triggered FRR, BGP-PIC edge, ECMP with N+1 backup protection
- **Migration path** — LDP/SR coexistence via SR Mapping Server enables gradual transport modernization
- **Scale** — validated at 2,700 EVPN instances per WAN edge across L2 and L3 services

---

## Sources

- Published PDF: [sol-overview-ewan-adv-core-edge-svc-01.pdf](https://www.juniper.net/documentation/us/en/software/jvd/sol-overview-ewan-adv-core-edge-svc-01.pdf)
- Companion docs: [`design-guide.md`](design-guide.md), [`test-report-brief.md`](test-report-brief.md), [`datasheet.md`](datasheet.md)
- Configs: [`../configuration/conf/`](../configuration/conf/)
