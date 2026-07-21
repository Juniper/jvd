# Solution Overview — Scale-Out Stateful Firewall and Source NAT for Enterprise

> Faithful markdown conversion of the published Juniper Validated Design
> **Solution Overview: Scale-Out Stateful Firewall and Source NAT for Enterprise**
> (`sol-overview-mse-cgnat-offbox-01-01`, V1.0). The PDF on juniper.net is the
> source of truth. This document is the **Enterprise** framing of the shared
> Connected Security Distributed Services (CSDS) scale-out architecture; see
> [solution-overview-service-provider.md](solution-overview-service-provider.md)
> for the Service Provider Edge framing.

## Executive Summary

The Juniper Scale-Out Security Services solution is a common security services
complex featuring Stateful Firewall and Source NAT for use in MX Series Router
Provider Edge (PE) deployments for enterprises in conjunction with vSRX or
SRX4600 security products. It leverages the scale-out network architecture and
automation for tight integration between the routing and security services
elements. This solution is developed in collaboration with the Juniper Automated
WAN Solutions and Juniper Connected Security groups.

The solution delivers the following values:

- Common security services delivery for MX platforms
- Economical and performant Scale-Out architecture delivered by adding more
  security appliances in a pay-as-you-grow approach
- Service velocity and flexibility with improved Time to Market (TTM)
- Operational simplicity with automation and automatic responses to changes in
  the services layer
- Increase in return on investment by bringing security services to platforms
  without services capability
- Broad security service support with NAT and Stateful Firewall support for
  physical and virtual security appliances

![Scale-Out Security Services Solution](images/CSDS-general.png)

*Figure 1. Scale-Out Security Services Solution.*

## Solution Overview

The Juniper Scale-Out Security Services solution delivers a scalable solution for
security services for customer and business needs. It enables security at high
speed and high rate without requiring a large chassis. The services layer can
scale physically or virtually to handle any performance need, from small to
large. The typical use cases it covers are:

- Stateful Firewall (SFW)
- Stateful Firewall (SFW) and Source NAT (SNAT)

> **Note:** Both SFW and SNAT are often used together on enterprise Internet
> access.

This solution comprises a forwarding layer and a service layer. Optionally, a
distribution layer can be introduced if the required connectivity is larger than
the forwarding layer. It leverages the Juniper portfolio with standards-based
routing protocols using BGP and BFD, ECMP and TLB on the forwarding layer for
both IPv4 and IPv6, and all the noted security services on the service layer.

This JVD validation is performed with **Junos OS Release 23.4R2** and encompassed
the following Juniper hardware:

- **Forwarding layer:** MX Series Routers, validated with MX304
- **Service layer:** SRX Series Firewalls, validated with SRX4600 and Virtual SRX (vSRX)
- **Distribution layer:** QFX Series (optional, not part of this JVD)

Solution details:

- The solution matrix of this test comprises MX304. It proposes either standalone
  (Single router) or redundancy between two routers of the same model (Dual MX).
  It uses either ECMP Consistent Hashing (CHASH) along with the MX Service
  Redundancy Daemon (SRD) or Traffic Load Balancing (ECMP with Health Checking)
  to decide the traffic path toward the service layer.
- For the security layer, the tested platforms are vSRX and SRX4600, deployed as
  standalone or a cluster pair using Multi-Node High Availability (MNHA — Layer 3
  cluster redundancy with session synchronization). Tested security features are
  SFW and SNAT. Other Layer 7 security functions may perform very similarly but
  are not included here.
- The tested configuration and version are **Junos OS Release 23.4R2** for all
  platforms. For MX Series Routers, this Junos version is the base required for
  the TLB feature (TLB-based RE on MX304/MX10004 starting Junos OS Release
  23.4R2). ECMP with SRD can also be used instead of TLB beginning with Junos OS
  Release 23.2R2. For SRX Series Firewalls, no specific version is required except
  support of active/active MNHA (introduced in Junos OS Release 22.3R1, validated
  here with Junos OS Release 23.4R2 using active/backup).
- All communication between platforms uses eBGP and distributed BFD for fast
  error detection (between MX Series Router and SRX Series Firewall, and between
  MX Series Router pairs and other network peers).

### Table 1: Test Plan Summary and Platforms Mapping

| Load-Balancing Method | Junos OS Release for LB | Number of MX Series Routers | Security Features | SRX/vSRX Standalone | SRX/vSRX MNHA Cluster |
|---|---|---|---|---|---|
| ECMP with Consistent Hashing | 23.4R2 | Single MX Series Router | SFW/CGNAT | Yes | No |
| ECMP with Consistent Hashing | 23.4R2 | Dual MX Series Router (SRD) | SFW/CGNAT | No | Yes |
| Traffic Load Balancer (TLB) with Health Checking | 23.4R2 | Single MX Series Router | SFW/CGNAT | Yes | Yes |
| Traffic Load Balancer (TLB) with Health Checking | 23.4R2 | Dual MX Series Router | SFW/CGNAT | Yes | Yes |

## Sources

- Published JVD: *Scale-Out Stateful Firewall and Source NAT for Enterprise — JVD
  Solution Overview* (`sol-overview-mse-cgnat-offbox-01-01`), juniper.net
  validated designs.
- Companion docs in this folder: [design-guide-enterprise.md](design-guide-enterprise.md),
  [test-report-brief-enterprise.md](test-report-brief-enterprise.md),
  [datasheet.md](datasheet.md).
- Configurations: [../configuration/conf](../configuration/conf).
