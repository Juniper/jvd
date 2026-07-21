# Solution Overview — Scale-Out IPsec Solution for Enterprises

> Faithful markdown conversion of the published Juniper Validated Design
> **Solution Overview: Scale-Out IPsec Solution for Enterprises**
> (`sol-overview-MSE-SCALEOUT-IPSEC-ENT-01-01`, V1.0). The PDF on
> juniper.net is the source of truth. This document is the **Enterprise**
> framing of the shared CSDS ScaleOut architecture; see
> [solution-overview-mobile-sp.md](solution-overview-mobile-sp.md) for the
> Mobile Service Provider framing.

## Executive Summary

The Juniper Scale-Out Security Services Solution is a scalable IPsec Security
Gateway for use in central offices or for data centres in Enterprises or Managed
Security Providers. It defines a common security services capability set — IKE
and IPsec — to be used in MX Series Router Provider Edge (PE) deployments for
Enterprises in conjunction with vSRX or SRX4600 security products. It leverages
the scale-out network architecture and automation for tight integration between
the routing and security services elements. The solution is developed in
collaboration with the Juniper Automated WAN Solutions and Juniper Connected
Security groups.

The solution delivers the following values:

- Common security services delivery for MX Series Routers
- Economical and performant Scale-Out architecture delivered by adding more
  security appliances in a pay-as-you-grow approach
- Service velocity and flexibility with improved Time to Market (TTM)
- Operational simplicity with automation and automatic responses to changes in
  the services layer
- Improved return on investment by bringing IPsec security services to MX Series
  Router platforms without services capability
- Broad security service support with IKE (for peer authentication) and IPsec
  (for encrypted and authenticated communications), as well as stateful firewall
  (SRX Series Firewalls are stateful solutions)
- Support for physical and virtual security appliances

![Scale-Out Security Services Architecture](images/CSDS-general.png)

*Figure 1. Scale-Out Security Services architecture (general CSDS view).*

## Solution Overview

The Juniper Scale-Out security services solution delivers a scalable solution
for security services, scaling on your business needs, to enable security at high
speed and high rate without requiring a large chassis. The services layer can
scale physically or virtually from small to large security performance needs. The
typical use cases it covers are:

- IPsec Security Gateway for main sites
- IPsec Security Gateway for data centers

The solution is composed of a forwarding layer and a service layer. Optionally, a
distribution layer can be introduced if the required connectivity is larger than
the forwarding layer. It leverages the Juniper portfolio with a standards-based
routing architecture using BGP and BFD, ECMP and TLB on the forwarding layer for
both IPv4 and IPv6, and all the noted IPsec security services on the service
layer. The architecture is composed of:

- **Forwarding layer:** MX Series Router, validated with MX304
- **Service layer:** SRX Series Firewalls, validated with SRX4600 and Virtual SRX (vSRX)
- **Distribution layer:** QFX Series (optional, not part of this JVD)

Solution details:

- The forwarding layer is composed of MX304. It proposes either standalone
  (Single router) or redundancy between two routers of the same model (Dual MX
  Series Routers). It uses either ECMP Consistent Hashing (CHASH) or Traffic Load
  Balancing (TLB with Health Checking) to decide the path of traffic toward the
  service layer.
- In the security layer, vSRX and SRX4600 are deployed as standalone or a cluster
  pair using Multinode High Availability (MNHA — Layer 3 cluster redundancy with
  session synchronization). The tested security feature, IPsec, is used as a
  central security gateway.
- The tested configuration and version for MX Series Router is **Junos OS Release
  23.4R2**, the base required for the TLB feature (RE-based TLB on MX304/MX10004
  starting Junos OS Release 23.4R2). ECMP can be used instead of TLB beginning
  with Junos OS Release 23.2R2. For SRX Series Firewalls, no specific version is
  required except MNHA support (introduced in Junos OS Release 22.3R1, validated
  here with Junos OS Release 23.4R2 in active/backup).
- All communication between platforms uses eBGP and distributed BFD for fast
  error detection between the MX Series Router and SRX Series Firewalls and
  between MX Series Router pairs and other network peers.

### Table 1: Summary of Test Plan and Platforms Mapping

| Load-Balancing Method | Junos OS Release for MX | Number of MX Series Routers | Security Features | SRX Standalone | SRXs MNHA Cluster |
|---|---|---|---|---|---|
| ECMP with Consistent Hashing | 23.4R2 | Single MX | IPsec | Yes | No |
| Traffic Load Balancer (TLB) with Health Checking | 23.4R2 | Single MX | IPsec | Yes | Yes |
| Traffic Load Balancer (TLB) with Health Checking | 23.4R2 | Dual MX | IPsec | Yes | Yes |

## Sources

- Published JVD: *Scale-Out IPsec Solution for Enterprises — JVD Solution Overview*
  (`sol-overview-MSE-SCALEOUT-IPSEC-ENT-01-01`), juniper.net validated designs.
- Companion docs in this folder: [design-guide-enterprise.md](design-guide-enterprise.md),
  [test-report-brief-enterprise.md](test-report-brief-enterprise.md),
  [datasheet.md](datasheet.md).
- Configurations: [../configuration/conf](../configuration/conf).
