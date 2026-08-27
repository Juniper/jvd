>
> Faithful markdown conversion of the published Juniper Validated Design
> **Juniper Scale-Out Stateful Firewall and Source NAT for Enterprise — JVD**
> (`jvd-mse-cgnat-offbox-ent-01-01`, published 2025-05-29). The PDF on
> juniper.net is the source of truth. The design narrative, validation
> framework, and load-balancing details are reproduced in full. Figures
> (architecture, topology, and flow diagrams) are referred out to the
> published PDF by number and caption. The exhaustive per-device
> **Configuration Examples** section is summarized and linked to
> [`../configuration/conf`](../configuration/conf) rather than reproduced
> inline.
>
> This is the **Enterprise** framing of the shared CSDS Scale-Out
> architecture. The forwarding/load-balancing architecture, platforms, and
> validated topologies are common with the Service Provider (CGNAT) variant;
> the Enterprise variant validates **Stateful Firewall (SFW)** and **Source
> NAT (SNAT, NAPT44)**, whereas the Service Provider variant validates SFW and
> Carrier-Grade NAT (CGNAT).

# Juniper Scale-Out Stateful Firewall and Source NAT for Enterprise — Design Guide

Juniper Networks Validated Designs provide you with a comprehensive, end-to-end
blueprint for deploying Juniper solutions in your network. These designs are
created by Juniper's expert engineers and tested to ensure they meet your
requirements. Using a validated design, you can reduce the risk of costly
mistakes, save time and money, and ensure that your network is optimized for
maximum performance.

## Table of Contents

- [About this Document](#about-this-document)
- [Solution Benefits](#solution-benefits)
- [Reference Architecture](#reference-architecture)
- [Topologies Tested](#topologies-tested)
- [Validation Framework](#validation-framework)
- [Event Testing](#event-testing)
- [Solution Details](#solution-details)
- [Results Summary and Analysis](#results-summary-and-analysis)
- [Recommendations](#recommendations)
- [Sources](#sources)

## About this Document

This document covers Juniper Scale-Out Security Services Solution delivering a scalable solution for security services, scaling on the business needs to enable security at high speed and high rate without using large chassis. This solution can scale small virtual to large security performances and scaling needs.


## Solution Benefits

Juniper Scale-Out Security Services Solution is based on a scalable, distributed security architecture and design that fully decouples the forwarding and security services layers. This approach enables existing Juniper MX Series Router to act as an intelligent forwarding engine and load balancer with path redundancy capability. It leverages existing and future SRX Series Firewalls in standalone or high availability pairs to extend more capacity and resiliency.


*Figure 1: Juniper Scale-out general architecture — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*

Figure 1 on page 2 shows automation and management for the provisioning and configuration of each element. However, the management framework is not described in this JVD. Junos OS configuration for MX Series Routers and SRX Series Firewalls is well known for its automation possibilities, and numerous methods that exist (from simple copy/paste to ansible with Jinja2 templates, etc.) and none is exposed here as each administrator may prefer their own method. Instead, Junos OS configuration is shared to explain their usage.

Also, central management with Security Director Cloud or Security Director on premise is proposed for managing the common security policies or objects on all the SRX/vSRX Series Firewalls. However, they are not required for using such Scale-Out solution. This simplifies the use of common security configurations for the security service layer.


### Use Cases

This Juniper Validated Design (JVD) describes following Enterprise uses cases:

- Stateful Firewall (SFW)

- Stateful Firewall (SFW) and Source NAT (SNAT)


> **NOTE:** Both SFW and SNAT are often used together on enterprise Internet access.


## Reference Architecture

This JVD covers a combination of network architectures where MX Series Routers and SRX Series Firewalls are connected in either single or double configurations (see Figure 2 on page 4). It uses network redundancy mechanisms to provide flow resiliency between the MX Series Router Forwarding Layer and SRX Series Firewall Services Layer (MNHA, aka L3 cluster is explained later in the document). On configuring dual MX Series Router with ECMP, a Service Redundancy Daemon (SRD) is used to monitor the failure events that triggers a failover to the second MX Series Router. Note this is not needed with Traffic Load Balancer (TLB). Also, BFD protocol is used to capture a failover mechanism from the routing point of view when any other failure occurs. SRX’s MNHA allows to synchronize sessions (stateful sessions) between the two nodes so that the existing traffic and tunnels can continue uninterrupted.

Figure 2 on page 4 shows the four main topologies covered in the JVD, combining single or dual MX Series Routers with standalone MNHA for SRX Series Firewalls, each on a particular load balancing mechanism (ECMP or TLB). It uses three SRX Series Firewalls for the first topology and doubles them to three pairs of firewalls for the other topologies.


*Figure 2: Validated Topologies — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*

There are certain trade-offs with each of the architectural choices coming to complexity, high availability, feature parity and backward compatibility with earlier Junos OS releases. In general, complexity increases as more redundancy is added. For example, SRX MNHA pairs introduce some specificity in traffic switchover between MNHA node. There are certain dependencies for which load balancing method is used on the MX Series Routers (namely ECMP Consistent Hashing or TLB). This selection of topologies covers the most important considerations from simple to more redundancy scenarios.

- ECMP CHASH is simpler to use as it is only routing based, however, it is limited in failover
capabilities.

- TLB is more focused on the services to load balance, offers more redundancy capabilities, and can be
multiplied with different local groups. It is useful when there is a need to combine different use cases with the same architecture.


### Table 1: Validated Features Combination

| Load-Balancing Method | Junos OS for MX Series Router | Number of MX Series Routers | Security Features | SRX Standalone | SRX MNHA Cluster |
|---|---|---|---|---|---|
| ECMP with Consistent Hashing | 23.4R2 | Single MX | SFW / SNAT | Yes | No |
| | | Dual MX (SRD) | SFW / SNAT | No | Yes |
| Traffic Load Balancer (TLB) with Health Checking | 23.4R2 | Single MX | SFW / SNAT | Yes | Yes |
| | | Dual MX | SFW / SNAT | Yes | Yes |

The following networking features are deployed and validated in this JVD:

- Dynamic Routing using BGP

- Dynamic fault detection using BFD

- Load Balancing of sessions across multiple SRX Series Firewalls in the standalone or high availability
environment

- Load Balancing using ECMP Consistent Hashing (CHASH, first appeared in Junos OS Release 13.3R3)

- Load Balancing using Traffic Load Balancer on the MX Series Router (TLB, first appeared in Junos OS
Release 16.1R6)

- MX series routers redundancy using SRD between two MX Series Routers with ECMP CHASH

- MX series routers redundancy using BGP Dynamic Routing between two MX Series Routers with
TLB

- SRX Series Firewalls redundancy using Multi-Node High Availability (MNHA) as Active or Backup
with sessions synchronization

- Dual stack solution with IPv4 and IPv6

- Stateful Firewall (SFW) is validated with simple long protocol sessions (HTTP, UDP). Applications and
Advanced Security features (AppID, IDP, URL filtering and other layer 7 features) are not used as part of this JVD.

- Source NAT (SNAT) is using NAPT44

Each JVD is tested with the following platforms:

- Routing and Load Balancer: MX304 with Junos OS Release 23.4R2

- Security Services: vSRX and SRX4600 with Junos OS Release 23.4R2


#### vSRX Setup and Sizing

This JVD focuses only on the functional aspect of the solution such as a powerful server is not required for hosting the vSRX(s), and vSRX size is not dependent on the JVD results. For real time performances, high end servers (like Dell or HPE servers with Intel Gold or AMK 9K CPUs, 256GB RAM and ConnectX6 or X7 or later interfaces) with large vSRX sizing are proposed (such as 16 vCPU and 32GB RAM). For more information about the vSRX requirements, see https://www.juniper.net/ documentation/us/en/software/vsrx/vsrx-consolidated-deployment-guide/vsrx-kvm/topics/concept/ security-vsrx-kvm-understanding.html or https://www.juniper.net/documentation/us/en/software/vsrx/ vsrx-consolidated-deployment-guide/vsrx-vmware/topics/concept/security-vsrx-vmware-overview.html


## Topologies Tested

The topologies tested with MX Series Routers and SRX Series Firewalls combinations are as follows:


### Topology 1 – ECMP CHASH – Single MX Series Router with Scaled Out Standalone SRXs (Multiple Individual SRX Series Firewalls)

This topology is simple and least redundant. The resiliency is provided at MX Series Router, with a redundant RE, PSU, etc however, there is no protection against MX-node failure. There is no backup of the MX Series Router and there are no sessions synchronization between the SRX Series Firewalls.


*Figure 3: Topology 1 – ECMP CHASH - Single MX Series Router, Standalone SRXs — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*

However, it helps to understand how this architecture works. Typically, you can opt for more redundancy. If you are not concerned about stateful failover and may want to augment security service capacities by adding more SRX series firewalls, then the application sessions may be short lived (a redundancy mechanism may be handled at an application level not requiring any session sync between two different firewalls).

- Pros: Simplicity and scaling with each individual SRX Series Firewalls

- Cons: No redundancy


### Topology 2 – ECMP CHASH – Dual MX Series Router with Scaled-Out MNHA SRX Pairs (Multiple Pairs of SRX Series Firewalls)

This topology does offer redundancy for the MX Series Routers and for each SRX Series Firewall. The dual MX Series Router uses an SRD mechanism to monitor the physical elements of the network and/or the MX Series Router itself, as well as any other routing and system event that may need to trigger a failover to the other MX Series Router.


*Figure 4: Topology 1 – ECMP CHASH - Dual MX with SRD, SRX MNHA Pairs — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*

In case of a network failure detected by an active MX Series Router, the second MX Series Router takes over the active role and all traffic is redirected to this active MX Series Router. It means the traffic sent to the previously backup SRX Series Firewall is becoming master of the MNHA pair. This architecture allows the use of only one SRX Series Firewalls of a pair at a time, basically the SRX Series Firewalls connected to the same MX Series Router. However, in case of any failover, the traffic continues the second node of each MNHA pair.

On the SRX Series Firewalls side, Multi-Node High Availability (MNHA) allows both SRX Series Firewalls to handle and synchronize the sessions and offer any requested security services on both the firewalls. Since this topology uses SRG0 (active/active) as cluster mode, there is no need to failover the MNHA SRX Series Firewall pair to the redundant SRX Series Firewall when the MX Series Router detects a

failure. The session synchronization in the MNHA pair ensures that the redundant SRX Series Firewall assumes responsibility for the sessions previously processed by the other SRX Series Firewall while maintaining session state. Note that, when an SRX Series Firewall detects a failure, a failover occurs in the MNHA pair.

- Pros: Simple redundancy and scaling with each SRX Series Firewall pair

- Cons: half of the architecture is active at a time


### Topology 3 – TLB – Single MX Series Router Scaled-Out MNHA SRX Pairs (Multiple Pairs of SRX Firewalls)

This topology does offer redundancy for the SRX series firewalls and not for the MX Series Routers, though this one may have a second Routing Engine (RE) installed in the appropriate slot. In that case, this solution does not use two MX Series Routers chassis.


*Figure 5: Topology 3 – TLB - Single MX, SRX MNHA Pairs — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*

MNHA offers session synchronization within a cluster and helps with any failure scenario. As explained before, the second SRX of each pair handles any traffic started on the first SRX before fail over of the MX Series Router happened.

- Pros: Redundancy and scaling with each SRX Series Firewalls pair

- Cons: No redundancy on the router (except using dual RE)


### Topology 4 – TLB – Dual MX Series Routers Scaled-Out MNHA SRX Pairs (Multiple Pairs of SRX Firewalls)

This topology offers redundancy for both the MX Series Routers and SRX Series Firewalls and takes advantage of having all the components used at the same time. Any failover scenario can be covered.


*Figure 6: Topology 4 – TLB - Dual MX Series Router, SRX MNHA Pairs — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*

The MX Series Router can handle traffic on any of the two routers, while SRX Series Firewalls can be used either in the Active or Backup role and even in the Active-Active role, making use of both nodes at the same time. This augments the capacity of the network during normal operation. However, this leaves one node active at a time when a failure occurs (in case of single MNHA cluster).

Each SRX Series Firewall is connected to both MX Series Routers. If any of one node fails within a cluster, all other SRX Series Firewalls pairs might have an independent failover from the other SRX Series Firewalls pairs and the MX Series Router.

- Pros: Full redundancy and scaling for MX Series Router and SRX Series Firewall pairs.

- Cons: More interfaces used on the MX Series Router if directly connected. Then, an optional
distribution layer can cover more connectivity needs when SRX Series Firewall count augments.


## Validation Framework


### Test Objectives

The test objective is to validate the Scale-Out architecture, showing the various topologies with single or dual MX Series Router and multiple SRX Series Firewalls, and demonstrating its ability to respond to various use cases while being able to scale.

The different features offered by routing, and the two main load balancing methods, using different platform sizes for MX Series Router and/or SRX Series Firewalls, using high availability of the various components, offer a wide range of possibilities. This document focuses on the four main topologies, which covers different use cases proposed in this document.

The configuration examples (shown later) illustrate the important parts in the configuration to achieve these results. A complete configuration can be delivered on demand.


### Test Bed Topology

The network design follows the examples described with four topologies. As explained in the configuration example later, some key elements need to be put in place, like the network IP scheme to make it simple to understand and the BGP peering between the MX Series Router, the external Gateway (if any), and with each SRX Series Firewalls.

To test this architecture, you need an MX Series Router as the base system, and several physical SRX or vSRX Series Firewalls on a hypervisor system. These can use scripts to launch and onboard the physical and virtual SRX firewalls and copy configurations from the configuration examples given below.

One MX Series Router is the minimum for testing Load Balancing, as well as Standalone SRXs in the distributed sessions.

Two MX Series Router are needed to provide routing redundancy, and some SRX Series Firewalls (of same model) in MNHA pairs allow to test the sessions synchronization and traffic resiliency.

Figure 7 on page 12 shows a test bed for single MX Series Router and ECMP CHASH and an example of IP addressing used during testing. Note the aggregate interfaces used (ae) indicating a dual attachment of each SRX Series Firewall to the MX Series Router platforms. A gateway router is used to bring the traffic to/from the clients and Internet.


*Figure 7: Test bed – ECMP CHASH - Single MX Series Router, Standalone SRXs — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*

Figure 8 on page 13 shows a test bed for Dual MX Series Routers and ECMP CHASH. Here you can observe also the dual links used between each SRX Series Firewall and the MX Series Router. In addition, you can see the virtual link for SRX’s sessions synchronization crossing the aggregate

interfaces on a specific VLAN. This prevents us from using an additional connection between the SRX Series Firewall themselves (they could be in a remote location).


*Figure 8: Test Bed – ECMP CHASH - Dual MX Series Routers, SRX MNHA Pairs — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*


### Supported Platforms

To review the software versions and platforms on which this JVD was validated by Juniper Networks, see the Validated Platforms and Software section in this document.


### Tested Optics

The Fiber optic transceivers used in that test bed are:

- QSFP-100GBASE-SR4: between MX304 and SRX4600s

- QSFP28-100G-AOC-3M: between MX304 and servers hosting vSRXs

This JVD has been validated with the fiber optics reference above. However, the technical validation is larger regarding hardware compatible optics. For more information, see the following references on Juniper’s Hardware Compatibility Tool.

- For SRX4600: https://apps.juniper.net/hct/product/?prd=SRX4600

- For MX304: https://apps.juniper.net/hct/product/?prd=MX304

- For MX10004: https://apps.juniper.net/hct/product/?prd=MX10004


### Test Bed Configuration

Test goals ensure that the Scale-Out environment matches all the required use cases that are exposed (with the four topologies for the various use cases).

Each test reiterates the same test cases among the four topologies by looking at less disturbance in traffic flows (keeping steady traffic) when actions or events happen. The general expectation is to have no or little effect on the traffic.

- Adding a new SRX Series Firewall to the service layer redistributes the traffic to get an even
distribution, no traffic disruption is expected for other traffic.

- Removing a SRX Series Firewall from the service layer redistributes traffic only for those associated
with this removed SRX Series Firewall.

- Having an SRX Series Firewall failover to its peer (MNHA case) and return to normal state does not
cause any traffic disruption. It also preserves firewall sessions.

- Having an MX Series Router failover (dual MX) does not cause any traffic disruption.

- Varying themes and failure scenarios cause no traffic disruption.

Individual tests of failure, failover, upgrades, and downgrades are used to show how the architecture behaves and verify its ability to react to failures, including resiliency of MX Series Routers and SRX Series Firewalls in various conditions. It shows consistency of the traffic distribution and its possibility to scale when adding new service nodes.


### Test Goals

Performance or scaling is tested with an idea of showing linearity in the process of SRX Series Firewall addition (standalone or MNHA pair) to the Scale-Out solution. Initial test is done with a single SRX Series Firewall pair to a maximum combination of traffic.

A second SRX Series Firewall pair is added to the first SRX series firewall pair to show that it is adding the same capacity as the first SRX firewall pair.

In this case, linearity is obvious when adding more SRX Series Firewalls pairs as the MX Series Router is agnostic to the number of sessions. While the amount of traffic stays within MX-PE throughput limits for every new MNHA pair, this adds a similar amount of performance to the scale-out complex.


### Test Non-Goals

Performance or scaling is not designed to test the maximum capacity of each SRX Series Firewall or of the full solution.

If there is a requirement to go to maximum capacity, then one could calculate it with an example. You can add any number of SRX Series Firewalls until the capacity of the router is reached (for example 3.2Tbps of MX Series Router forwarding capacity with redundant REs or 4.8Tbps with single RE switch is pretty high) or its maximum port capacity (for example, MX Series Router with 16 x 100GE links per line card, up to two cards with redundant REs or three line cards with single REs).

On the SRX Series Firewalls, maximum throughput depends on the traffic type as it is analyzing content
- the more content the more work it needs. For example, 200Gbps requires MX304 with two-line cards
at 3.2Tbps / 200Gbps = 16 SRX, or 3-line cards at 4.8Tbps or 200Gbps = 24 SRX. Consider the second MX Series Router and other SRX Series Firewalls, a second member of the pairs as a backup to be able to handle full load in case of large failure.

If only considering the number of available ports (without a distribution layer like QFX), this requires a MX304 with two-line cards at 3.2Tbps / 2 cards / 16 ports = 66 SRX ports, or three-line cards at 4.8Tbps / 2 cards / 16 ports = 100 SRX ports. All these are within theorical limits.

There is no preferred specification for the hypervisor hosting the vSRX, nor specific vSRX sizes (in vCPU/vRAM/vNIC quantity), simple vSRX is just enough for testing the features. Note that vSRX runs on many hypervisors including: ESXi, KVM, Microsoft for on-prem. Though vSRX can also be deployed in public clouds (AWS, Azure, and GCP), the purpose of the architecture is not to run with vSRX in those external clouds where it is questionable to consider the networking plumbing to get them connected.

No automation is mentioned in the document. However, it is indeed used to help build and test the solution with various use cases and tests. Automation is considered as a later addition to this JVD.


## Event Testing

SRX Series Firewall failure events:

- MX Series Router to SRX Series Firewall link failures

- SRX Series Firewalls reboot

- SRX Series Firewall power off

- Complete MNHA pair power off

MX Series Router failure events:

- Reboot MX Series Router

- Restart routing process

- Restart traffic-dird daemon

- Restart Network-monitor daemon

- Restart sdk-process

- GRES (Graceful REStart of routing daemon)

- ECMP/TLB next-hop addition or deletion (adding or deleting a new scale-out SRX MNHA pair]

- SRD based CLI switchover between MX Series Routers (ECMP)

Traffic recovery is validated post all failure scenarios. UDP traffic generated using IxNetwork for all the failure related test cases is used to measure the failover convergence time.


### Tested Traffic Profiles

Tested traffic profile is composed of multiple simultaneous flows showing the same for either each standalone SRX Series Firewall or each SRX MNHA pair in Active or Backup mode.


### Table 2: Tested Traffic Profiles

| CPS / MNHA-Pair | Throughput / MNHA-Pair | Traffic Type | File Size |
|---|---|---|---|
| N/A | 100 Gbps | TCP | 4k |
| N/A | 100 Gbps | UDP | IMIX |
| 100K | N/A | TCP | 1 byte |

- 255:11

- 511:4

- 1024:2

- 1518:39


### Test Bed Configuration

Contact your Juniper representative to obtain full archive of the test bed configuration used for this JVD.


## Solution Details


### Traffic Path in SFW Scale-Out Solution

The Scale-Out solution is based on BGP as dynamic routing protocol. It enables all the MX routers and SRX Series Firewalls to learn their surrounding networks. However, most importantly to exchange path information for the network traffic that needs to be sent from MX Series Router across each SRX Series Firewall to the next MX Series Router. This protocol enables exchange of network paths for the internal/ user subnets and the default/specific external network. When each SRX Series Firewall announces what it has learned from the other side, each with the same network cost, the load balancing can then use those routes for load balancing traffic across each SRX Series Firewall.


*Figure 9: Network BGP Announces — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*

Figure 10 on page 20 shows how traffic flows from an MX Series Router to multiple SRX Series Firewalls using ECMP load balancing method. You can see that SRX Series Firewalls are in a symmetric sandwich between the two MX Series Routers, whether those MX Series Router are a single physical node configured with two routing instances (more typical) or two physical MX Series Router nodes on each side. The routing principle remains the same as if two routing nodes are used, maintaining traffic flow distribution that is consistent in both directions.


*Figure 10: Generic Flow Distribution — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*

The MX Series Router on the left has a TRUST VR routing-instance used to forward traffic to each SRX Series Firewalls.

The MX Series Router on the right has the symmetric UNTRUST VR to receive traffic from each SRX Series Firewalls and forward it to the next hop toward the target resources. The routes on each side are announced through BGP to the next hop, making its path available on each MX Series Router instance through each SRX Series Firewalls (with same cost for load balancing to happen).

Routes are announced through BGP, each MX Series Router with their own BGP Autonomous System (AS) and peer with the SRX Series Firewalls on their two sides (TRUST and UNTRUST zones in a single routing instance). MX Series Router may peer with any other routers bringing connectivity to the clients and servers (here GW Router).

When the routes across each SRX Series Firewalls is known to have similar cost, then the Load Balancing method is used as explained below.

For SNAT use case, this is very similar to SFW. However, the NAT pools are exchanged on the right MX Series Router for the return traffics to flow back to the correct SRX Series Firewalls:


*Figure 11: Network BGP Announces with NAT Pools — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*


### Introduction to SRX Series Firewall Multi-Node High Availability

To begin with, refer to this extract from the public documentation on MNHA, https://www.juniper.net/ documentation/us/en/software/junos/high-availability/topics/topic-map/mnha-introduction.html

Juniper Networks® SRX Series Firewalls support a new solution, Multi-node High Availability (MNHA), to address high availability requirements for modern data centres. In this solution, both the control plane and the data plane of the participating devices (nodes) are active at the same time. Thus, the solution provides inter chassis resiliency.

The participating devices are either co-located or physically separated across geographical areas or other locations such as different rooms or buildings. Having nodes with high availability across geographical locations ensures resilient service. If a disaster affects one physical location, MNHA fails over to a node in another physical location, thereby ensuring continuity.

In MNHA, both SRX Series Firewalls have an active Control Plane and communicate their status over an inter chassis link (ICL) that can be either direct or routed across the network, allowing both to be separated in distance and keep synchronizing sessions and IKE security associations. Also, they do not share a common configuration, and this enable different IP settings on both SRX Series Firewalls. However, some commit sync mechanism that can be used for the elements of configuration that need to be same on both the platforms.

The SRX Series Firewalls use a SRG for the Data Plane that can be either Active or Backup (for SRG1 and above). An exception is the SRG group 0 (zero) that is always active on both SRX Series Firewalls. This group can be used natively by scale-out to load balance traffic across both SRX Series Firewalls at the same time. However, some interest exists for the other modes where it can be active or backup for SRG1 and backup or active for SRG2, which is like active SRG0. However, SRG2 can add some routing information (like BGP as-path-prepend) under certain conditions. SRG1/+ offers more health checking of its surrounding environment that can be leveraged to make a SRGn group active, backup, or ineligible.


*Figure 12: Multi Node High Availability General Architecture — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*

MNHA can select any mode from the following network modes:

- Default Gateway or L2 mode: It uses same network segment at L2 on different sides of the SRX
Series Firewalls (e.g. trust/untrust) and both SRX Series Firewalls share a common IP or MAC addresses on each network segment. It does not mean the SRX Series Firewallsis in switching mode, it does route between its interfaces. However, but shares the same broadcast domain on one side with the other SRX Series Firewalls, and same on the other side.

- Hybrid mode or mix of L2 and L3: This mode uses L2 and IP address on one side of the SRX Series
Firewalls (e.g. trust) and routing on the other side of the SRX Series Firewalls (e.g. untrust). On L3 side, both firewalls are on different subnets, and they share same subnet on the L2 side with a common VIP like 10.0.0.1/24.

- Routing mode or L3: This architecture is used for this JVD where each side of the SRX Series
Firewalls is using a different IP address. Even between the SRX Series Firewalls, there is no common IP subnet. and all communication with the rest of the network is done through routing. This mode is perfect for scale-out communication using BGP with the MX Series Router.


*Figure 13: Multi Node High Availability Network Modes — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*

Whether to use SRG0 active-active, or SRG1 active-backup (single one active at a time), or a combination of SRG1 active-backup and SRG2 backup


### Equal-cost Multipath /Consistent Hashing Load Balancing Overview

This feature relates to topology 1 (single MX Series Router, scale-out SRXs) and topology 2 (dual Active/ Passive MX and scale-out MNHA SRX Series Firewall pairs).


*Figure 14: Topologies 1 and 2 - ECMP CHASH — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*


### Equal-cost Multipath /Consistent Hashing (CHASH) in MX Series Router

Equal-cost multipath (ECMP) is a network routing strategy that allows traffic of the same session, or traffic with the same source and destination — to transmit across multiple paths of equal cost. It is a mechanism that provides load balancing of traffic and increases bandwidth by fully utilizing the unused bandwidth on links to the same destination.

When forwarding a packet, the routing technology decides the next hop path to use. In deciding the path, the device takes into account the packet header fields that identify a flow. When ECMP is used, next hop paths of equal cost are identified based on routing metric calculations and hash algorithms. That is, routes of equal cost have the same preference and metric values, and the same cost to the network. The ECMP process identifies a set of routers, each of which is a legitimate cost of next hop towards the destination. The identified routes are called an ECMP set. An ECMP set is formed when the routing table contains multiple next hop addresses for the same destination with equal cost (routes of equal cost have the same preference and metric values). If there is an ECMP set for the active route, Junos OS uses a hash algorithm to choose one of the next hop addresses in the ECMP set to install in the forwarding table. You can configure Junos OS so that multiple next hop entries in an ECMP set are installed in the forwarding table. On Juniper Networks devices, per-packet load balancing can be performed to spread traffic across multiple paths between routing devices.

Example of learned routes and forwarding table for the same destination (assuming traffic target is within 100.64.1.0/24 and SRX Series Firewalls BGP peers are 10.1.1.0, 10.1.1.8, and 10.1.1.16):


```console
  jcluser@mx-01> show route 100.64.1.0/24
trust-vr.inet.0: 30 destinations, 33 routes (30 active, 0 holddown, 0 hidden) + = Active Route, - = Last Active, * = Both 100.64.1.0/24        *[BGP/170] 4d 04:52:53, MED 10, localpref 100 AS path: 000 64500 I, validation-state: unverified to 10.1.1.0 via ae1.0 ## learning routes from peer SRX1
                      > to 10.1.1.8 via ae2.0 ## learning routes from peer SRX2
to 10.1.1.16 via ae3.0 ## learning routes from peer SRX3 jcluser@mx-0> show route forwarding-table destination 100.64.1.0/24 table trust-vr Routing table: trust-vr.inet Internet: Destination        Type RtRef Next hop           Type Index     NhRef Netif 100.64.1.0/24        user     0                     ulst 1048580      2 10.1.1.0            ucst     801      4 ae1.0 ## path to SRX1 10.1.1.8            ucst     798      5 ae2.0 ## path to SRX2 10.1.1.16           ucst     799      5 ae3.0 ## path to SRX3


With scale-out architecture where stateful security devices are connected, maintaining symmetricity of the flows in the security devices is the primary objective. The symmetricity means traffic from a subscriber (user) and to the subscriber must always reach the same server (which maintains the subscriber state). To reach the same server, the traffic must be hashed onto the same link towards that server for traffic in both directions.

A subscriber is identified by the source IP address in the upstream direction (client to server) and by the destination IP address in the downstream direction (server to client). The MX Series Routers do symmetric hashing i.e. for a given (sip, dip) tuple, same hash is calculated irrespective of the direction of the flow i.e. even if sip and dip are swapped. However, the requirement is that all flows from a subscriber reach the same SRX Series Firewall, so you need to hash only source IP address (and not destination IP address) in one direction and vice versa in the reverse direction.

By default, when a failure occurs in one or more paths, the hashing algorithm recalculates the next hop for all paths, typically resulting in the redistribution of all flows. Consistent load balancing enables you to override this behavior so that only flows for inactive links are redirected. All existing active flows are maintained without disruption. In such an environment, the redistribution of all flows when a link fails potentially results in significant traffic loss or a loss of service to an SRX Series Firewall whose links remain active. However, consistent load balancing maintains all active links and remaps only those flows affected by one or more link failures. This feature ensures that flows connected to links that remain active continue uninterrupted.



This feature applies to topologies where members of an ECMP group are external BGP neighbors in a single-hop BGP session. Consistent load balancing does not apply when you add a new ECMP path or modify an existing path in any way. New SRX add design is implemented recently where you can add SRX Series Firewalls gracefully with an intent of equal redistribution from each active SRX series firewall, hence causing minimal impact to the existing ECMP flows. For example, if there are four active SRX Series Firewalls carrying 25% of total flows on each link and the fifth SRX Series Firewall (previously unseen) is added, 5% of flows from each existing SRX Series Firewall moves to the new SRX series firewall. Hence making 20% of flow redistribution from existing 4 SRX Series Firewalls to new one.

The following information shares details for each step of route exchange between MX Series Router and SRXs, traffic flows, for each use case.




```


### ECMP/CHASH in Topology 1 (Single MX Series Router, Scale-Out SRXs) for SFW


*Figure 15: Topology 1 - ECMP CHASH - SFW Use Case — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*

- SRX Series Firewalls are deployed in a standalone scaled out devices to single MX Series Router.

- Links between MX Series Routers and all SRX Series Firewalls are configured with two eBGP
sessions. One for TRUST and one for UNTRUST.

- The Load balancing policy with source-hash for route 0/0 is configured in the forwarding table.

- The Load balancing policy with destination-hash for client prefix routes (users) is configured in the
forwarding table.

- The default 0/0 route is received by all the SRX Series Firewalls on UNTRUST side and advertised
using eBGP to MX Series Router on the TRUST side. The MX Series Router imports this route on the TRUST instance using load balancing CHASH policy.

- Client prefix route is received by all the SRX Series Firewalls on TRUST side and advertised using
eBGP to MX Series Router on the UNTRUST side. The MX Series Router imports this route on the UNTRUST instance using load balancing CHASH policy.

- The MX Series Router on the TRUST side has all the ECMP routes for 0/0 route.

- The MX Series Router on the UNTRUST side has all the ECMP routes for the client prefix routes.

- Forward traffic flow from client to server reaches MX Series Router on TRUST instance and hits 0/0
route and takes any one ECMP next-hop to SRX Series Firewall based on the calculated source IP based hash value.

- The SRX Series Firewalls creates an SFW flow session and routes the packet to MX Series Router on
the UNTRUST direction towards the server.

- Reverse traffic flow from server to client reaches MX Series Router on UNTRUST instance and hits
client prefix route and takes the same ECMP next hop based on the calculated destination IP based hash value.

- Since the five tuples of the SFW sessions do not change, calculated hash value remains the same and
takes the same ECMP next hop/SRX Series Firewalls on the forward and reverse flow. This makes sure symmetricity is maintained in the SRX Series Firewalls.

- When any SRX Series Firewall goes down, CHASH on the MX Series Router ensures that the
sessions on the other SRX Series Firewalls are not disturbed and only sessions on the down SRX Series Firewalls are redistributed.


### ECMP/CHASH in Topology 1 (Single MX Series Router, scale-out SRXs) for Source NAT


*Figure 16: Topology 1 – ECMP CHASH – NAT Use Case — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*

- The SRX Series Firewalls are deployed in a standalone scaled out devices to a single MX Series
Router.

- Links between the MX Series Router and SRX Series Firewalls are configured with two eBGP
sessions. One for TRUST and one for UNTRUST.

- Unique NAT pool IP address ranges are allocated per SRX Series Firewalls.

- The load balancing policy with source-hash for route 0/0 is configured in the forwarding table.

- 0/0 route is received by the SRX Series Firewalls on the Untrust side and is advertised using eBGP to
MX Series Router on the TRUST side. The MX Series Router imports this route on the TRUST instance using load balancing CHASH policy.

- Client prefix route is received by the SRX Series Firewalls on the TRUST side and NAT pool route
prefix is advertised using eBGP to MX Series Router on the UNTRUST side.

- The MX Series Router on the TRUST side has an ECMP route for 0/0 route.

- The MX Series Router on the UNTRUST side has a unique route for the NAT pool route prefix.

- The forward traffic flow from client to server reaches the MX Series Router on TRUST instance and
hits 0/0 route. It takes any one ECMP next-hop to SRX Series Firewalls based on the calculated source IP based hash value.

- The SRX Series Firewalls creates an NAT flow session and routes the packet to MX Series Router on
the UNTRUST direction towards the server.

- Reverse traffic flow from server to client reaches MX Series Router on UNTRUST instance and hits
unique NAT pool prefix route and takes the same SRX Series Firewalls where forward flow is anchored. This makes sure symmetricity is maintained in the SRX Series Firewalls.

- When any SRX Series Firewall goes down, CHASH on the MX Series Router ensures that the
sessions on the other SRX Series Firewalls are not disturbed and only sessions on the down SRX Series Firewalls are redistributed.


### ECMP/CHASH in Topology 2 (Dual MX Series Router, SRX MNHA Pairs) for SFW


*Figure 17: Topology 2 - ECMP CHASH - SFW Use Case — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*

- A session where SRX Series Firewalls are deployed in pair with MNHA syncs both ways depending
on where the traffic is received.

- The MX Series Router pair is configured with SRD redundancy for user management of the MX
Series Routers pair.

- The MX Series Router pair monitors the links towards TRUST or INTERNET GW router and links
between MX Series Router to SRX Series Firewall. If any of these links fails, SRD triggers automatic switch over to other MX Series Routers. It can also failover when MX304-1 completely goes down.

- The MX Series Routers have 4x100G interface connected to the SRX4600 devices as an AE bundle
and contain three VLANs (trust, untrust, and HA management).

- MX304-1 remains a primary ECMP path and MX304-2 remains standby ECMP path.

- SRD is used for MX Series Router redundancy and controls the MX Series Router master ship state
transition. It also installs a signal route on the master MX Series Router which is used for route advertisement with preference.

MX304-1 master advertises routes as it is, whereas MX304-2 standby advertises routes with as- path-prepend.

- Interfaces on MX304-1 towards SRX Series Firewall and MX304-2 towards SRX Series Firewall need
to be provisioned using similar interface numbering with similar I/O card. This helps in maintaining the same unilist next-hop ordering on both the MX304-1 and MX304-2 routers. RPD decides unilist next-hop ordering based on the interface ifl index number (Ascending order of interface ifl numbers).

- As unilist next-hop ordering is same in both the MX Series Routers, it does not cause any issue with
hash (source or destination) post any MX Series Router switchover.

- In case a failure is detected by an active MX Series Router (SRD), the failover to the other MX device
implies that all traffic may reach this second MX Series Router (it takes the ownership of the SRX Series Firewalls and announces routes to itself). It also implies that traffic to the SRX Series Firewalls connected to MX304-1 is sent to SRX Series Firewalls connected to MX304-2. This is a complete failover from the top architecture to the bottom one.

The following MX Series Router configuration shows how the SRD process monitors events to decide any release or acquisition of master ship. On the SRD process side, the relevant configuration contains:

event-options { redundancy-event 1_MSHIP_ACQUIRE_EVENT { } redundancy-event 1_MSHIP_RELEASE_EVENT {

MX peer } } services { redundancy-set { } } policy-options { redundancy-policy 1_ACQU_MSHIP_POL { } redundancy-policy 1_RELS_MSHIP_POL {

} }

On the routing side, the SRD configuration looks for the existence of specific route and then announces the default route conditionally:

interfaces { ae10 {

} } policy-options { condition 1_ROUTE_EXISTS { } policy-statement MX-to-MX-1_trust_export { vr } policy-statement MX-to-MX-1_untrust_export {

} } routing-instances { 1_TRUST_VR { } 1_UNTRUST_VR { GW } SRD { } }


### Traffic Load Balancer Overview

This feature relates to topology 3 (single MX Series Router, scale-out SRX MNHA pairs) and topology 4 (dual MX Series Router and scale-out SRX MNHA pairs).


*Figure 18: Topologies 3 and 4 - TLB — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*


### Traffic Load Balancer Service in MX Series Router

The Traffic Load Balancer (TLB) functionality provides a stateless translated or non-translated traffic load balancer, as an inline PFE service in the MX Series Routers. Load balancing in this context is a method where incoming transit traffic is distributed across configured servers that are in service. This is a stateless load balancer, as no state is created for any connection, and there are no scaling limitations. Throughput could be close to line rate. TLB has two modes of load balancing i.e., translated (L3) and non-translated Direct Server Return (DSRL3).

For the scale-out solution, the TLB mode non-translated Direct Server Return (L3) is used. As part of TLB configuration,there is a list of available SRX Series Firewalls addresses and the MX Series Router PFE programs a selector table based on this SRX Series Firewalls. TLB does a health check (ICMP usually however, it can do HTTP, UDP, and TCP checks) for each of the SRX Series Firewalls individually. TLB health check is done using MX Series Router routing engine. If health check pass for any of the SRX Series Firewalls, TLB installs a specific IP route or wild card IP address (TLB config option) route in the routing table with next-hop as composite next-hop. Composite next-hop in the PFE is programmed with all the available SRX Series Firewalls in the selector table. Filter based forwarding is used to push the "Client to Server" traffic to the TLB where it hits the TLB installed specific IP address route or wild card

IP address route to get the traffic sprayed across the available SRX Series Firewalls with source or destination hash. "Server to Client" is directly routed back to the client instead of going through the TLB.


*Figure 19: TLB Service in RE and PFE — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*


> **NOTE:** TLB has existed in the Junos and MX Series Router family for few years now (as early as Junos OS Release 16.1R6) and is used successfully on large server farms with around 20,000 servers. TLB is using the control part and the health check on MS-MPC service cards on MX240/480/960/MX2000 chassis before, data plane/PFE is already on the line cards. It is not running on the RE as it has been now implemented on MX304/MX10000 chassis. For more information see, https://www.juniper.net/documentation/us/en/software/junos/interfaces-next- gen-services/interfaces-adaptive-services/topics/concept/tdf-tlb-overview.html.


### Using TLB in the MX Series Router for the Scale-Out SRX Solution with SFW


*Figure 20: Topology 3 - Scale-Out SFW with TLB — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*

- All the SRX Series Firewalls are configured with BGP to establish an eBGP peering sessions with MX
Series Routers.

- The MX Series Routers are configured with TLB on the TRUST routing instance to do the load
balancing of data traffic coming from the client-side gateway router towards scaled out SRX Series Firewalls.

- All the scale-out SRX Series Firewalls connected to the MX Series Router are configured with unique
IP addresses (for example, loopback) which are used by MX Series Router TLB to do the health check and build up the selector table in the PFE. PFE uses this selector table to load balance the packet across the available next hops. This health check is reachable through BGP connection.

- Filter based forwarding based on source IP address match is used in the MX Series Router to push
SFW specific traffic to the TLB trust forwarding instance.

- TLB forwarding instance has a default route with next-hop as list of SRX Series Firewalls. TLB installs
this default route when its health check passes with at least one SRX Series Firewall.

- TLB does source-based-hash load balancing across all the available SRX next hop Series Firewalls.

- Load balanced SFW data sessions are anchored on any available SRX Series Firewalls and create SFW
flow. Then it’s routed to reach the server through MX Series Router over UNTRUST routing instance.

- For the return traffic coming from server to client direction on the MX Series Router UNTRUST
routing instance, another TLB instance is configured on MX Series Router UNTRUST routing instance to do the load balancing back to the same SRX Series Firewalls.

- Filter based forwarding of destination IP address match is used in the MX Series Router to push SFW
specific traffic to the TLB UNTRUST forwarding instance.

- TLB forwarding instance may have a default route with next-hop as list of SRX Series Firewalls. TLB
installs this default route when its health check passes with at least one SRX Series Firewall.

- TLB does destination-based-hash load balancing across all the available SRX next-hop Series
Firewalls.

- Load balanced SFW data sessions are load-balanced to the same SRX Series Firewalls on the return
direction and uses the same flow to reach the client through MX Series Router over TRUST routing instance.


### Using TLB in the MX Series Router for the scale-out SRX Solution with Source NAT


*Figure 21: Topology 3 - Scale-Out SNAT with TLB — see the [published PDF](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html).*

- All the scale-out SRX Series Firewalls connected to the MX Series Router are configured with BGP
connections.

- Each scaled out SRX Series Firewall needs to have a unique NAT pool range, and this must be
advertised towards the MX Series Router UNTRUST direction. (This is the main difference with SFW use case, as it needs to announce the NAT pools).

- The MX Series Router is configured with TLB on the TRUST routing instance to do the load balancing
of data traffic coming from the client-side gateway router towards scaled out SRX Series Firewalls.

- All the scale-out SRX series firewalls connected to the MX Series Router are configured with unique
IP address which is used by MX Series Router TLB to do the health check and build up the selector

table in the PFE. PFE uses this selector table to load balance the packet across the available next hops. This health check is reachable through BGP connection.

- Filter based forwarding where source IP address match is used in the MX Series Router to push the
NAT specific traffic to the TLB trust forwarding instance.

- TLB forwarding instance has a default route with next-hop as list of SRX Series Firewalls. TLB installs
this default route when its health check passes with at least one SRX Series Firewall.

- TLB does source-based-hash load balancing across all the available SRX next hop Series Firewall.

- Load balanced NAT data sessions are anchored on any available SRX Series Firewall and create an
NAT flow. Then it’s routed to reach the server through MX Series Router over UNTRUST routing instance.

- For the return traffic coming from server to client direction on the MX Series Router UNTRUST
routing instance, a unique NAT pool route is used to route the traffic to the same SRX Series Firewall.

- The SRX device uses the same NAT flow to process the return traffic and routes the packet towards
MX Series Router in the TRUST direction. The MX Series Router routes the packet back to the client.


## Solution Details — Configuration Examples

> **The full per-device configuration examples for ECMP/CHASH, for the Traffic
> Load Balancer (TLB), and the common configurations shared by both load-balancing
> methods are reproduced verbatim in the published PDF and are provided as
> ready-to-use device configurations in
> [`../configuration/conf`](../configuration/conf).** This section of the PDF
> contains the complete MX Series Router and SRX Series Firewall stanzas
> (interfaces, BGP, BFD, routing options, forwarding options, TLB service,
> security policies, and Source NAT pools/rules) for each validated topology.
> They are linked rather than duplicated here to keep this guide readable; the
> configurations in the repository are the authoritative, tested artifacts.

The PDF organizes the configuration examples as follows:

- **Configuration Examples for ECMP CHASH** — MX Series Router BGP/BFD, ECMP
  consistent-hashing forwarding options, and the SRX Series Firewall SFW and
  Source NAT configuration for Topologies 1 and 2 (single MX with standalone
  SRXs, and dual MX with SRD and SRX MNHA pairs).
- **Configuration Examples for TLB** — MX Series Router Traffic Load Balancer
  service (real servers, server groups, virtual services, health-check probes)
  plus the SRX SFW and Source NAT configuration for Topologies 3 and 4.
- **Common Configurations for ECMP CHASH and TLB** — the shared stanzas used by
  both load-balancing methods (system, management, interfaces, and the SRX
  security zones/policies and NAT that are independent of the MX load-balancing
  choice).

See [`../configuration/conf`](../configuration/conf) for the complete device
configurations.


## Results Summary and Analysis

All the test results are summarized in different documents detailing all aspects of the testing. This JVD shows that scale-out can leverage the use of important functions both on the MX Series Router and SRX Series Firewall for their respective target usage:

- The MX Series Router is used as a load balancer with different options, ECMP CHASH and TLB.

- The SRX Series Firewall is used as a security service with simple integration with the MX Series
Router.

- Both physical SRX Series Firewall and virtual SRX firewall are used the same way.

- Simple network integration using BGP and BFD helps in convergence time.

- Though no scale is tested, the simplicity of adding a new service node shows that this architecture
can help to scale in many directions (performances, scaling, and so on) by simply adding new service node without disturbing the global service.

ECMP consistent hashing has shown steady restoration times in milliseconds.

With TLB being used mainly on MX Series Router platforms, it also works with non-tested MX Series Router models, where TLB uses a control function on the RE (like MX304) or on a service card (for example, MS-MPC for MX240). TLB has been in Junos since Junos OS Release 18.1R1 when BGP

acquired multipath function. This connection with BGP offers a good solution for service providers who often use it internally and externally.

TLB use case works with restoration timers and shows flexibility in deployment options (aka single or dual MX Series Routers), as well as a better handling of SRX series firewalls in the MNHA cluster.

SRX Series Firewall features leveraged in this JVD focus on stateful firewall and SNAT however, did not get into higher layer security features. The fact that the scale-out architecture can handle standalone and SRX Series Firewalls clusters, using an even distribution among multiple SRX Series Firewalls without disturbing traffic, shows that the SRX layer 7 security service can easily be added to this usage.

Note that with ECMP, all the SRX Series Firewall need to be of the same model, whereas with TLB, it is not mandatory to have same devices, for example some SRX Series Firewalls in a SFW groups and other SRX Series Firewalls in a SNAT group. The number of groups is around 2,000 per MX Series Router and the number of SRX Series Firewall member is around 256.

The scale-out solution is considered as an alternative of the monolithic scale-up approach. It uses the chassis based SRX Series Firewall or security services on MX240/480/960 with MX-SPC3 service cards independently. However, nothing prevents such architectures to benefit from both to leverage possibilities to add new services and the power of those existing platforms. The upcoming smaller platforms like the MX304 and SRX4700 may help to create smaller footprint architectures.

On the management front, automation is used to build and test the solution with the various use cases and tests. In summary, scripting is used with Junos access using Netconf. Lots of scripting already exists in the field (or Juniper automation places like GitHub) using Ansible, Terraform, Python, PyEZ (Python Easy for Junos), etc. Some advanced users have scripted Junos, and API that are available to integrate with the existing management framework.

The Security Director (on-prem or cloud) has an important place for delivering common configuration to the security service layer (like security policies, address objects, NAT pools, etc.). This gives visibility to the security events and logs generated by each SRX Series Firewall.

Junos integration with BGP (peering between the MX Series Router and the SRX Series Firewall, including the right BFD timers) allows you to create a matching environment with Juniper solutions working seamlessly together. The redundancy of each router and security solution allows you to maintain steady traffic while providing addition of new capacities in a simple way. Similar configuration statements on box routes (MX Series Router) and security (SRX Series Firewall) provides a simple and seamless management of this solution.


## Recommendations

- Service Redundancy Daemon (SRD) - https://www.juniper.net/documentation/us/en/software/
junos/interfaces-adaptive-services/topics/topic-map/service-redundancy-daemon.html

- Equal-Cost Multi Path (ECMP) - https://www.juniper.net/documentation/us/en/software/junos/
interfaces-ethernet-switches/sampling-forwarding-monitoring/topics/concept/policy-per-packet- load-balancing-overview.html

- Load Balancing Using Source or Destination IP Only - https://www.juniper.net/
documentation/us/en/software/junos/routing-policy/topics/task/load-balancing-using-src-or-dst-ip- only-configuring.html

- ECMP Consistent Hashing - Consistent Load Balancing for ECMP Groups - https://www.juniper.net/
documentation/us/en/software/junos/interfaces-ethernet-switches/topics/topic-map/ understanding-ecmp-groups.html

- Traffic Load Balancing (TLB) - https://www.juniper.net/documentation/us/en/software/junos/
interfaces-next-gen-services/interfaces-adaptive-services/topics/concept/tdf-tlb-overview.html

- Junos Symmetrical Load Balancing - https://community.juniper.net/blogs/moshiko-nayman/
2024/06/19/junos-symmetrical-load-balancing

- Multi Node High Availability - https://www.juniper.net/documentation/us/en/software/junos/high-
availability/topics/topic-map/mnha-introduction.html

- Connected Security Distributed Services - https://www.juniper.net/documentation/us/en/software/
connected-security-distributed-services/csds-deploy/topics/concept/csds-overview.html

- Automation and Communities -

https://github.com/orgs/Juniper/repositories?type=all

https://community.juniper.net/home/techpost


## Sources

- Published JVD PDF: [Juniper Scale-Out Stateful Firewall and Source NAT for Enterprise — JVD](https://www.juniper.net/documentation/us/en/software/jvd/scale-out-sfw-snat-enterprise/index.html)
- Device configurations: [`../configuration/conf`](../configuration/conf)
- Solution overview: [solution-overview-enterprise.md](solution-overview-enterprise.md)
- Test report brief: [test-report-brief-enterprise.md](test-report-brief-enterprise.md)
