# JVD Solution Overview: Enterprise WAN Core and Edge

## Executive Summary

A large enterprise network can include multiple campus and branch locations. These remote locations need to connect to the enterprise core and enterprise data center network to access various business-critical applications. Some business-critical applications can also run in public cloud provider data centers. An enterprise WAN (EWAN) must ensure that remote users can access these applications reliably and without any performance penalty. The remote campus and branch locations use Layer 2/Layer 3 VPN services to access the business-critical applications running in the enterprise private data center, and to communicate with each other. The remote users can also connect to public cloud providers and access applications such as Office365 and Microsoft Teams. The connection to the enterprise data center network that runs the business-critical applications must be resilient and reliable.

## Solution Overview

This solution validates Virtual Private LAN services (VPLS), Layer 2 Circuits (L2CKT), and L3VPN connections between the remote campus and branch network locations and an enterprise data center across a private WAN backbone network. The VPN connections can use a many-to-many or a hub-spoke design, where traffic from the campus and branch networks passes through a central HQ device that acts as a hub. The VPN connections can be single-homed, or multi-homed to avoid single points of failure. The WAN edge devices use QoS to control bandwidth and WAN traffic is transported using MPLS. Multicast video traffic from multiple surveillance cameras can be transported using NGMVPN multicast tunnels.

This JVD provides a reference architecture and solution for establishing seamless L2/L3 connectivity between remote campus networks and an enterprise data center. ACX7100-48L, ACX7509 Universal Metro routers and MX304 Universal Edge routers are used as enterprise WAN edge routers to provide a seamless connection between segments.

## About JVD

Juniper Validated Design (JVD) is a cross-functional collaboration between Juniper Solution Architects and Test teams to develop coherent multidimensional solutions for domain-specific use cases. The JVD team is comprised of technical leaders in the industry with a wealth of experience supporting complex customer use cases. The scenarios selected for validation are based on industry standards to solve critical business needs with practical designs that are fully supported at publication.

## Solution Architecture

A reference architecture is selected for validation after ongoing cadence with Juniper global theaters and deep analysis of customer use cases. The design concepts deployed are formulated around best practices, leveraging relevant technologies to deliver the solution scope. Key Performance Indicators (KPI) are identified as part of an extensive test plan that focuses on functionality, performance integrity, and service delivery.

Once the physical infrastructure required to support the validation is built, the design is sanity-checked and optimized. Our test teams conduct a series of rigorous validation to prove solution viability, capturing and recording results. Throughout the validation process, our engineers engage with software developers to quickly address any issues found. Unsupported features are excluded from the validation.
