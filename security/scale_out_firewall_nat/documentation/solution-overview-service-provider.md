# Solution Overview — Scale-Out Stateful Firewall and CGNAT for SP Edge

> Faithful markdown conversion of the published Juniper Validated Design
> **Solution Overview: Scale-Out Stateful Firewall and CGNAT for SP Edge**
> (`sol-overview-mse-cgnat-offbox-01-01`, V1.0). The PDF on juniper.net is the
> source of truth. This document is the **Service Provider Edge** framing of the
> shared Connected Security Distributed Services (CSDS) scale-out architecture;
> see [solution-overview-enterprise.md](solution-overview-enterprise.md) for the
> Enterprise framing.

## Executive Summary

The Juniper Scale-Out Security Services solution is a common security services
complex featuring a Stateful Firewall and Carrier Grade NAT (CGNAT) for use in
the fixed and wireless Multiservice Edge (MSE) and Broadband Edge (BBE)
deployments for Service Providers and Mobile Service Operators. This security
services complex leverages the scale-out network architecture and automation with
tight integration between the routing and security services elements, represented
by MX universal routers and SRX next-generation firewalls. This provides the best
routing and security stacks for optimal performance and total cost of ownership.
The scale-out approach offers advantages over scale-up by integrating security
engines directly into the routing nodes, including pay-as-you-grow pricing,
flexibility to handle unpredictable traffic growth, high availability with
sub-second restoration for stateful traffic flows, and optimal operational
preferences for a choice of physical or virtual nodes.

![Scale-Out Security Services Solution at Provider Edge](images/ScaleOut-SP-SFW-CGNAT-general.png)

*Figure 1. Scale-Out Security Services Solution at the Provider Edge.*

## Solution Overview

This JVD outlines the Juniper Scale-Out Security Services solution, which can
seamlessly integrate with the MSE and BBE network solutions and enables the
following security services:

- Stateful Firewall (SFW)
- CGNAT

The solution comprises dedicated forwarding and service layers, with an optional
distribution layer to enhance scalability and optimize port usage and bandwidth.
The scale-out architecture is designed to leverage Juniper's portfolio using
standards-based routing protocols featuring BGP and BFD, ECMP with consistent
hashing (CHASH), and the traffic load balancer (TLB) function in the forwarding
layer. Meanwhile, the service layer is comprised of all the noted security
services.

This JVD validation is performed with **Junos OS Release 23.4R2** and encompassed
the following Juniper hardware:

- **Forwarding layer:** MX Series Routers, validated with MX304
- **Service layer:** SRX Series Firewalls, validated with SRX4600 and Virtual SRX (vSRX)
- **Distribution layer:** QFX Series (optional, not part of this JVD)

## Sources

- Published JVD: *Scale-Out Stateful Firewall and CGNAT for SP Edge — JVD Solution
  Overview* (`sol-overview-mse-cgnat-offbox-01-01`), juniper.net validated
  designs.
- Companion docs in this folder: [design-guide-service-provider.md](design-guide-service-provider.md),
  [test-report-brief-service-provider.md](test-report-brief-service-provider.md),
  [datasheet.md](datasheet.md).
- Configurations: [../configuration/conf](../configuration/conf).
