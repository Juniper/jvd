> Faithful markdown conversion of the published PDF:
> [JVD Solution Overview: Metro Ethernet Business Services (03-01)](https://www.juniper.net/documentation/us/en/software/jvd/sol-overview-metro-ebs-03-01.pdf).
> The PDF on juniper.net is the source of truth.

# JVD Solution Overview: Metro Ethernet Business Services

**Version:** sol-overview-metro-ebs-03-01 (April 2024)

## Executive Summary

The Metro Ethernet Business Services Juniper Validated Design (JVD) addresses traditional L2 Business Access and Dedicated Internet Access services while incorporating modern service delivery protocols, including EVPN-VPWS, EVPN Flexible Cross Connect, EVPN-ETREE, and EVPN-ELAN. The topology, built using the Juniper Cloud Metro portfolio, deploys an infrastructure designed to support metro access multi-ring topologies and a two-stage metro fabric spine-and-leaf design. The reference architecture is based on modern Carrier Ethernet Metro Area Networks (MAN) and takes into consideration the transformation required to facilitate diverse new services, applications, and use cases.

The new architecture, known as Cloud Metro, carries several important characteristics in the amalgamation of service and content providers. These shifting industry trends demand massive bandwidth and service scale increase while supporting more complex metro workloads. A major goal of Cloud Metro is the adaptation of cloud principles into metro networks, including the array of EVPN technologies, SR-MPLS/SRv6, and machinery to support inter-domain traffic engineering or seamless architectures across disparate networks. This is a differentiating factor that characterizes requirements for supporting any-to-any connectivity models or building infrastructures that become access agnostic while blending with virtualized network functions and devices.

The solution architectures and services proposed in the Metro Ethernet Business Services JVD are part of the network modernization journey and challenges faced by many operators. Our modern converged network infrastructures and technologies stand ready to meet the demands of the new metro. The JVD proposes the solution blueprints to make every connection count.

## Solution Overview

The Metro Ethernet Business Services JVD addresses the network modernization journey, which includes multiple developing use cases. A crucial aspect of the overall solution is enabling flexibility to support heterogeneous customer architectures within the same validated design with the following major attributes:

- Seamless SR-MPLS with TI-LFA
- Flexible Algorithm Application Specific Link Attribute (ASLA)
- Co-Existence of Seamless SR-MPLS BGP-LU and BGP-CT Inter-AS solutions
- End-to-end color-aware Traffic Steering (a la Network "Lite-Slicing")
- Intra-domain Transport Class tunneling with Service Mapping
- Inter-domain color awareness with BGP Classful Transport
- Services include color-aware and color-agnostic path selection
- Intent-based routing with Color Mapping based on Delay and TE metrics
- Color agnostic services take IGP metric paths (inet.3)
- Strict Resolution Scheme (no fallback) + Cascade Fallback Gold fail back Bronze and Bronze fallback to Best Effort
- Alignment with MEF 3.0 standards for service characteristics and attributes

Over twenty use cases are covered for delivering Metro Ethernet services. Traditional Layer 2 VPN services are included with L2Circuit with hot-standby, L2VPN, and VPLS showing the ability to coexist with newer EVPN-VPWS, EVPN-FXC, EVPN-ELAN, and EVPN-ETREE services — over common modern Metro ring and fabric infrastructures. In addition, the Floating PW solution delivers a massive upgrade to legacy static L2Circuit by leveraging Anycast-SID with all-active virtual ESI (vESI) for active-active multi-homing. Layer 3 services are supported with traditional L3VPN, EVPN-ELAN Type 5, and EVPN integrated routing and bridging (IRB) Virtual Gateway Address (VGA) models. High-availability services are included, such as A/A EVPN and Hot-Standby L2CKT.

## MEF Standards Alignment

An important focus of the Metro Ethernet Business Services JVD involves alignment with Metro Ethernet Forum (MEF) standards. The MEF is an industry consortium dedicated to accelerating the adoption of Carrier Ethernet services and technologies. Its primary purposes and goals revolve around standardization, interoperability, and innovation within the Ethernet ecosystem. The MEF works to develop and promote standards for Carrier Ethernet services, ensure interoperability between Carrier Ethernet networks and equipment from different vendors, foster innovation by promoting the development of new technologies and services based on Carrier Ethernet, and educate the market about the benefits and capabilities of Carrier Ethernet services.

## Featured Platforms

The Juniper Networks MEF 3.0 certified **MX304** leverages the next-generation Trio 6 chipset that is designed with the highest performance, efficiency, and agility requirements to meet cloud-era scale and network demand. The compact 2RU modular 4.8T platform delivers the advanced feature set required for the most sophisticated multiservice edge roles.

The **ACX7000 Family** is purpose-built to support the Cloud Metro evolution with a consistent advanced feature set across the complete portfolio. The MEF 3.0 certified **ACX7509** compact modular metro router delivers an innovative centralized chassis architecture, designed to reduce failures, optimize power efficiency, and support the diverse speeds and feeds required for the interconnectivity into the featured Multi-access Edge Computing (MEC) complexes.

The MEF 3.0 certified **ACX7100-48L** and **ACX7100-32C** are 4.8T 1RU platforms supporting dense capacity and provide 400GbE metro access and aggregation. The JVD selected ACX7100-48L for access fabric and multi-ring attachments and ACX7100-32C for the roles of fabric spine and metro edge gateway with border leaf service termination functionality.

The MEF 3.0 certified **ACX7024** temperature-rated 360G platform is ideally situated for metro access roles and supports the advanced feature set of the ACX7000 family portfolio.

---

## Sources

- Published PDF: [sol-overview-metro-ebs-03-01.pdf](https://www.juniper.net/documentation/us/en/software/jvd/sol-overview-metro-ebs-03-01.pdf)
- Companion docs: [`solution-overview-03-03.md`](solution-overview-03-03.md), [`design-guide.md`](design-guide.md), [`test-report-brief-03-01.md`](test-report-brief-03-01.md)
- Configs: [`../configuration/conf/`](../configuration/conf/)
