# JVD Solution Overview — Metro as a Service (MEF 3.0)

> Markdown conversion of the published *JVD Solution Overview: Metro as a Service
> MEF 3.0* (`sol-overview-JVD-AWAN-METRO-EBS-MEF-03-02`). Source of truth is the
> published PDF on juniper.net; this is a faithful text mirror for reference and
> for grounding the portal's Design & Planner.

## Executive Summary

The Metro Ethernet Business Services solution validates a comprehensive
multidimensional architecture with best practices for designing and implementing
a dense services L2/L3 portfolio across intra-domain and inter-AS regions. Metro
Ethernet follows the standards and framework defined by the Metro Ethernet Forum
(MEF) for the delivery and characterization of services. The MEF 3.0
certification for Operators involves the end-to-end compliance of production
network services. By deploying MEF-certified equipment and adhering to MEF
standards, providers can ensure that service offerings meet rigorous performance
criteria and customer expectations.

## Solution Overview

Metro as a Service (MaaS) by Juniper Networks introduces the first
supplier-approved comprehensive validation of MEF 3.0 compliance conducted over a
production-emulated network. The Metro as a Service Juniper Validated Design
enhances the solution established with the Metro Ethernet Business Services JVD by
qualifying **over 12,000 MEF 3.0 test cases** end-to-end across all featured
E-Line, E-LAN, E-Tree, and Access E-Line (E-Access) services.

Key benefits to Service Providers:

- **Seamless Interoperability** — MEF 3.0 certified products work well with other
  MEF-compliant systems, reducing integration complexity and making it easier to
  deliver reliable, multi-vendor services.
- **Faster Time-to-Market** — MEF-compliant solutions come pre-tested with
  industry standards, enabling service providers to deploy new services quickly,
  stay competitive, and meet customer demands efficiently.
- **Guaranteed Service Quality** — MEF 3.0 standards include stringent
  performance, security, and reliability benchmarks, allowing providers to
  deliver high-quality, dependable services and maintain customer trust.

The primary devices under test are MEF 3.0-certified products: **ACX7024,
ACX7100, ACX7509, and MX304**.

The Metro Ethernet Business Services JVD addresses traditional L2 Business Access
and Dedicated Internet Access services while incorporating modern service
delivery protocols, including EVPN-VPWS, EVPN Flexible Cross Connect, EVPN-ETREE,
and EVPN-ELAN. The topology, built upon the Juniper Cloud Metro portfolio,
deploys an infrastructure designed to support metro access multi-ring topologies
and metro fabric scale-out spine-and-leaf design. The reference architecture is
based on modern Carrier Ethernet Metro Area Networks (MAN) and takes into
consideration the transformation required to facilitate diverse new services,
applications, and use cases.

The Cloud Metro concept carries several important characteristics in the
amalgamation of service and content providers. These shifting industry trends
demand massive bandwidth and service scale increases while supporting more complex
metro workloads. The JVD establishes the bridge between retro-metro concepts and
the modern adaptation of cloud principles into metro networks. This includes the
array of EVPN technologies, SR-MPLS/SRv6, and machinery to support inter-domain
traffic engineering or seamless architectures across disparate networks. This
differentiating factor characterizes requirements for supporting X-to-Anything
connectivity models or building infrastructures that become access agnostic while
blending with virtualized network functions and devices.

_Figure 1: Metro as a Service Network Topology — see
[`images/`](images/) and the JVD topology diagram at
[`../images/Metro-MEF-Topology.png`](../images/Metro-MEF-Topology.png)._

## Crucial objectives

- **Service Performance** — validate bandwidth (using MEF bandwidth-profile
  service attributes), latency, jitter (delay variation), frame loss, and QoS
  compliance with the capability to differentiate between traffic types. Ensures
  consistent and predictable network performance to meet SLAs.
- **Service Activation** — ensure accurate service setup, provisioning,
  multiplexing, and bundling. Validation of service multiplexing and bundling
  capabilities that ensure EVCs and CE-VLANs can be managed over a single UNI.
- **Standards Conformance** — ensures Carrier Ethernet services deliver all
  defined EVC types (E-Line, E-LAN, E-Tree, Access E-Line), enabling
  compatibility and seamless operation in multi-vendor and multi-provider
  environments.
- **Reliability and Resiliency** — test for service continuity, protection, and
  rapid failover. Protection mechanisms are built into both underlay and overlay
  network design.
- **Service Assurance** — verify monitoring, fault detection, and Service OAM
  (Operations, Administration, and Maintenance) capabilities.

## Sources

- JVD document: <https://www.juniper.net/documentation/us/en/software/jvd/jvd-metro-ebs-mef-03-02/index.html>
- Solution overview: <https://www.juniper.net/documentation/us/en/software/jvd/solution-overview-metro-ebs-mef-03-02.pdf>
- Test report: <https://www.juniper.net/documentation/us/en/software/jvd/test-report-brief-metro-ebs-mef-03-02.pdf>
- Companion docs: [`design-guide.md`](design-guide.md), [`test-report-brief.md`](test-report-brief.md)
