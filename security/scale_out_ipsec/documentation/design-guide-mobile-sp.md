# Scale-Out IPsec Solution for Mobile Service Providers — Design Guide

> Faithful markdown conversion of the published Juniper Validated Design
> **Scale-Out IPsec Solution for Mobile Service Providers — JVD**
> (`MSE-SCALEOUT-IPSEC-SP-01-01`, published 2025-05-23). The PDF on juniper.net
> is the source of truth. Exhaustive per-device configurations are **linked** to
> [../configuration/conf](../configuration/conf) rather than reproduced in full;
> representative excerpts are included to illustrate each mechanism.
>
> This is the **Mobile Service Provider** framing of the shared CSDS ScaleOut
> architecture. The technical architecture, platforms, load-balancing methods, and
> validated topologies are common with the Enterprise variant; see
> [design-guide-enterprise.md](design-guide-enterprise.md) for the Enterprise
> framing.

## Table of Contents

- [About this Document](#about-this-document)
- [Solution Benefits](#solution-benefits)
- [Use Case and Reference Architecture](#use-case-and-reference-architecture)
- [Supported Platforms](#supported-platforms)
- [Test Objectives](#test-objectives)
- [Solution Architecture](#solution-architecture)
- [Results Summary and Analysis](#results-summary-and-analysis)
- [Documentation](#documentation)

## About this Document

This document explains a Juniper Validated Design (JVD) for the Scale-Out Security
Services solution, which you can deploy at the **SP multiservice edge WAN or metro
networks**. It validates the network services complex consisting of MX universal
services routers coupled with Juniper SRX/vSRX Series Firewalls delivering the
IPsec Security Gateway function in a variety of deployment scenarios.

### Table 1: Solution Platforms Summary

| Solution | Forwarding Layer | Service Layer |
|---|---|---|
| Scale-Out Security Services for Mobile SP | MX304 Universal Edge Router | SRX4600, vSRX |

## Solution Benefits

The Juniper Scale-Out Security Services solution is a common security services
complex featuring an IPsec Security Gateway (referred to as SECGW in code) for use
in a **Mobile Service Provider (MSP)** deployment. The security complex leverages
the scale-out network architecture and automation with tight integration between
routing and security services elements, represented by MX Series universal routers
and SRX Series Firewalls. This provides the best routing and security stacks for
optimal performance and total cost of ownership. The scale-out approach has an
advantage over scale-up and integrating security engines directly into the routing
domain, including:

- Highly scalable security gateway systems with respect to number of IPsec
  terminations and tunnel scale
- Pay-as-you-grow approach
- Flexibility to handle unpredictable traffic growth
- High availability with sub-second restoration for IPsec security associations
- Optimal operational preferences for a choice of physical or virtual nodes
- Improved time to market for security services on new platforms
- Flexible placement of security services in the network

![Juniper Scale-Out General Architecture](images/scaleout-ipsec-sp.png)

*Figure 1. Juniper Scale-Out general architecture at the SP provider edge.*

This solution is equally applicable to greenfield deployments or as a nested
solution on top of existing MX Series Routers in the centralized or distributed
mobile edge segment of SP networks, allowing flexibility in placement of services
across SP WAN infrastructure. This JVD focuses on the forwarding and security
services layers only.

### Security Services Layer

- IPsec security gateway terminating IPsec coming from eNodeBs/gNodeBs
- Stateful firewall (built into the SRX Series Firewalls)
- High availability function (using Multinode High Availability, MNHA)

### Forwarding Layer

- PE forwarding plane with virtual routing instances ("external" and "internal")
- Load balancing between multiple nodes of the service layer
- High availability function
- May optionally include a distribution forwarding layer

## Use Case and Reference Architecture

The Juniper Scale-Out Security Services architecture includes two main functional
blocks: the security services device (standalone vSRX VNF or SRX4600, or a
redundant pair of the same device), and the MX Series Routers as load-balancer
routers providing 100G or 400G interfaces to the servers hosting vSRXs or the
SRX4600s. Both access-side and Internet-side peering are enabled through dedicated
MX Series Router ports for high throughput.

![Scale-Out Solution Functional Blocks](images/CSDS-general.png)

*Figure 2. Scale-out solution functional blocks.*

With Trio 6 MX10004/10008 systems, capacity per slot is up to 9.6 Tbps; with the
compact MX304, up to 4.8 Tbps per system. An MX304 can provide up to 48 × 100G
interfaces; an LC9600 in a modular MX10000 up to 96 × 100G ports. An intermediate
distribution layer with two (or more) QFX-series switches can aggregate multiple
SRX/vSRX nodes into bundled 400GE links. vSRX runs on KVM or VMware (up to 32
cores, 64 GB memory; virtio or SR-IOV with smart NICs such as Mellanox ConnectX-6;
hardware acceleration via AES-NI for DH and RSA).

An external BGP (eBGP) protocol with BFD provides routing and control between the
network elements while implementing load balancing with two approaches:

- Equal-Cost Multipath (ECMP) load balancing with Consistent Hashing (CHASH)
- RE-based Traffic Load Balancer (TLB) function on MX Series Routers

Two routing instances — **Access and Internet** — are used on the MX Series Router
to peer with the corresponding network segments of the SP mobile network
infrastructure and the security node. BFD failure detection uses timers as low as
100 ms.

> To maintain a higher level of security (such as a Managed Security Gateway
> service, where injection of your routes into the security layer is not
> preferred), **static routes with BFD protection** are the preferred control and
> traffic-distribution method.

The Access-side traffic is load balanced between service nodes dynamically based on
ECMP with source IPv4/IPv6 CHASH — load balancing the IPsec flows toward the
security-gateway function on the mobile side. On the Internet side, the IP address
associated with the mobile device is learned within the IPsec negotiation and
advertised via eBGP so return traffic reaches the correct IPsec tunnel. ECMP CHASH
limits the blast radius of a single node failure.

![ECMP CHASH Based Network Architecture](images/scaleout-ipsec-sp.png)

*Figure 3. ECMP CHASH based network architecture.*

### Solution Deployment Scenarios

Figure 4 shows the main topologies covered in this JVD, combining standalone/dual
MX Series Router with standalone/MNHA pairs for SRX Series Firewalls, each on a
particular load-balancing mechanism (ECMP or TLB). For dual MX Series Router with
ECMP, this scenario is not retained in favor of TLB, which provides a better
solution using SRX High Availability (MNHA).

![Validated Topologies](images/ScaleOut-COMMON-architectures.png)

*Figure 4. Validated topologies (the four common CSDS ScaleOut architectures).*

- **ECMP CHASH** is simple to use and leverages standard protocols — a preferable
  option for some SP or enterprise operations departments, though limited in
  failover capabilities.
- **TLB** leverages services-level load balancing, offers better redundancy, and
  can be multiplied with different local groups — useful when combining different
  use cases on the same architecture, though it may not be backward compatible with
  older Junos OS releases.

### Table 2: Validated Features Combination

| Load-Balancing Method | Junos OS Release for MX | Number of MX Series Routers | Security Features | SRX Standalone | SRXs MNHA Cluster |
|---|---|---|---|---|---|
| ECMP with Consistent Hashing | 23.4R2 | Single MX Series Router | IPsec SECGW | Yes | No |
| Traffic Load Balancer (TLB) with Health Checking | 23.4R2 | Single MX Series Router | IPsec SECGW | Yes | Yes |
| Traffic Load Balancer (TLB) with Health Checking | 23.4R2 | Dual MX Series Router | IPsec SECGW | Yes | Yes |

Networking features deployed and validated: BGP dynamic routing; BFD fault
detection; session load balancing across multiple SRX (standalone or HA); ECMP
CHASH (from Junos OS Release 13.3R3); TLB on the MX Series Router (from Junos OS
Release 16.1R6); MX redundancy with TLB; SRX MNHA Active/Backup with session
synchronization; dual-stack IPv4/IPv6; IPsec (auto-VPN responder-only) with
AES-256-GCM; inherent stateful firewalling inside the tunnels.

Platforms per JVD: Routing/Load Balancer **MX304** (Junos OS Release 23.4R2);
Security Services **vSRX and SRX4600** (Junos OS Release 23.4R2).

#### Deployment Scenario 1 — ECMP CHASH — Single MX with Scaled-Out Standalone SRXs

Simplest, least redundant; resiliency at MX hardware level only. Service-node
failure redistributes flows to the remaining nodes; without session sync, affected
flows re-establish. **Pros:** simplicity, per-node scaling. **Cons:** no redundancy.

#### Deployment Scenario 2 — TLB — Single MX with Scaled-Out MNHA SRX Pairs

Redundancy for the SRX Series Firewalls (MNHA pairs) but not the MX Series Router.
**Pros:** SRX redundancy + scaling. **Cons:** no router redundancy (except dual RE).

#### Deployment Scenario 3 — TLB — Dual MX with Scaled-Out MNHA SRX Pairs

Most redundant for both MX and SRX, using all components at once. Failover covered
by BGP + BFD. **Pros:** full redundancy and scaling. **Cons:** more MX interfaces
(unless an optional distribution layer is added).

## Supported Platforms

### Test Optics

- QSFP-100GBASE-SR4: between MX304 and SRX4600s
- QSFP28-100G-AOC-3M: between MX304 and servers hosting vSRXs

Validation extends to all hardware-compatible optics (see the Juniper Hardware
Compatibility Tool for SRX4600, MX304, MX10004).

### vSRX Setup and Sizing

Functional validation only; server power and vSRX size are not material to the
tested features. For real-world performance, high-end servers with large vSRX
sizes (16 vCPU, 32 GB RAM) are proposed.

## Test Objectives

Validate the Scale-Out architecture across topologies (single/dual MX and multiple
SRX) using the two main load-balancing methods (ECMP CHASH and TLB) with high
availability, and demonstrate linear scaling as service nodes are added.

### Test Goals

Validate behavior under administrative events with little/no traffic effect:
adding/removing an SRX, SRX MNHA failover and return, and MX failover (dual MX).

### Test Non-Goals

Maximum scale/performance of individual elements; automated vSRX onboarding;
Security Director; L7 advanced security (App ID, IDP, URL filtering); non-AES-GCM
or initiator-mode IKE/IPsec; PKI (works the same but not exercised here).

### Event Testing

**SRX failure events:** MX-to-SRX link failures; SRX reboot; SRX power off;
complete MNHA pair power off; restart IKED; restart SUB/PUB broker process.

**MX failure events:** reboot MX; restart routing process; restart traffic-dird
daemon; restart Network-monitor daemon; restart sdk-process; GRES; TLB next-hop
addition/deletion.

Traffic recovery is validated after all failure scenarios. UDP traffic generated
using IXnetwork for all failure-related test cases measures failover convergence.

### Tested Traffic Profiles

| Platform | Tunnel Count / MNHA Pair | Session Count / MNHA Pair | Traffic Type |
|---|---|---|---|
| SRX4600 | 1000 | 10000 | UDP |

Throughput/MNHA-pair 40 Gbps at ~90% CPU. Packet size uses a security-gateway
Internet mix, ~700-byte average — weights 64:8, 127:36, 255:11, 511:4, 1024:2,
1518:39.

## Solution Architecture

### Traffic Path in the IPsec Scale-Out Solution

The scale-out solution uses BGP so all MX Series Routers and SRX Series Firewalls
exchange path information. Each SRX announces its own IKE/IPsec termination gateway
with the same network cost, allowing the load balancer to distribute across each
SRX. The MX on the Access/Internet side directs IPsec toward the SRX; return
traffic uses the unique inner IP address (Auto Route Injection, ARI) to reach the
correct SRX that holds the IPsec Security Association.

### SRX Series Firewalls Multinode High Availability (MNHA)

Both control and data planes of the participating nodes are active simultaneously,
providing inter-chassis resiliency. Nodes may be co-located or geographically
separated, communicating over an Inter-Chassis Link (ICL) and synchronizing
sessions and IKE SAs without a shared configuration. MNHA uses services redundancy
groups (SRGs): SRG0 is always active on both nodes (used natively by scale-out);
SRG1+ supports Active/Backup with health checking. This JVD uses the **Routing/L3
mode**, ideal for scale-out communication via BGP with the MX Series Router.

### ECMP Consistent Hashing (CHASH)

ECMP transmits flows across multiple equal-cost paths while maintaining symmetry
for stateful devices — traffic from a subscriber always traverses the same SRX in
both directions (symmetric hashing on source/destination IP). Consistent load
balancing redistributes only flows on inactive links; existing active flows are
undisturbed. Adding a new SRX moves an equal proportion of flows from each existing
node to the new one.

Representative MX source-hash policy on the Access/UNTRUST side toward the shared
IKE gateway address:

```junos
policy-options {
    prefix-list ipsec_sites_v4 { 172.16.255.0/24; }
    prefix-list IPsecGW_v4 { 172.16.1.1/32; }
    policy-statement pfe_lb_hash {
        term source_hash {
            from { prefix-list-filter IPsecGW_v4 exact; }
            then { load-balance source-ip-only; accept; }
        }
        term ALL-ELSE { then { load-balance per-packet; accept; } }
    }
}
routing-options { forwarding-table { export pfe_lb_hash; } }
```

### Traffic Load Balancer (TLB)

TLB provides stateless load balancing as an inline PFE service. For scale-out, the
non-translated Direct Server Return (L3) mode is used. The RE health-checks each
SRX and programs a PFE selector table; filter-based forwarding pushes client-to-
server traffic to the TLB instance while server-to-client is routed directly back.
On MX304/MX10000, TLB runs in **routing-engine-mode**.

Representative TLB service block:

```junos
services {
    traffic-load-balance {
        routing-engine-mode;
        instance ipsec_lb {
            interface lo0.0;
            client-vrf UNTRUST_VR;
            server-vrf UNTRUST_VR;
            group mnha_srx_group {
                real-services [ MNHA_SRX1 MNHA_SRX2 ];
                routing-instance UNTRUST_VR;
                health-check-interface-subunit 0;
                network-monitoring-profile icmp-profile;
            }
            real-service MNHA_SRX1 { address 172.16.0.101; }
            real-service MNHA_SRX2 { address 172.16.0.102; }
            virtual-service srx_untrust_vs {
                mode direct-server-return;
                address 172.16.1.1;
                routing-instance srx-tproxy-fi;
                group mnha_srx_group;
                load-balance-method { hash { hash-key { source-ip; } } }
            }
        }
        network-monitoring {
            profile icmp-profile { icmp; probe-interval 1; failure-retries 5; recovery-retries 1; }
        }
    }
}
```

Representative SRX IKE/IPsec (responder-only auto-VPN, AES-256-GCM), MNHA loopback
export, and ARI announcement are shown in the published guide. The complete
per-device configurations for this JVD (MX304 load balancer, MX304 IPsec initiator
gateway, and the SRX4600 cluster nodes) are in
[../configuration/conf](../configuration/conf) — see [../README.md](../README.md)
for the device/config map.

For dual MX topologies, both routers must compute the same hash value:

```junos
forwarding-options { enhanced-hash-key { symmetric; } }
```

> **Note:** These configurations also apply to IPv6.

## Results Summary and Analysis

The JVD shows scale-out leveraging both the MX Series Routers (load balancer with
ECMP CHASH and TLB) and the SRX Series Firewalls (IPsec security service). Both
physical (SRX4600) and virtual (vSRX) firewalls work the same way. BGP + BFD gives
fast convergence, and adding a service node is simple and non-disruptive.

- **ECMP CHASH** shows steady millisecond restoration; all SRX must be the same model.
- **TLB** does not require identical devices, supports ~2,000 groups per MX and
  ~256 SRX members, and offers more deployment flexibility and better MNHA handling.

SRX Series Firewalls act as terminating (not initiating) gateways — a single simple
IKE/IPsec entry serves all SRX in the group, which is what makes scaling out
practical. SRX always performs stateful firewalling in addition to IPsec.

## Documentation

Additional resources referenced by the published JVD include SRD, ECMP, Load
Balancing Using Source/Destination IP Only, ECMP Consistent Hashing, TLB, Junos OS
Symmetrical Load Balancing, MNHA, IKE and IPsec VPN Overview, and Connected
Security Distributed Services (CSDS).

## Sources

- Published JVD: *Scale-Out IPsec Solution for Mobile Service Providers — JVD*
  (`MSE-SCALEOUT-IPSEC-SP-01-01`, 2025-05-23), juniper.net validated designs.
- Companion docs in this folder: [solution-overview-mobile-sp.md](solution-overview-mobile-sp.md),
  [test-report-brief-mobile-sp.md](test-report-brief-mobile-sp.md),
  [datasheet.md](datasheet.md).
- Enterprise framing: [design-guide-enterprise.md](design-guide-enterprise.md).
- Configurations: [../configuration/conf](../configuration/conf).
- Connected Security Distributed Services (CSDS) deployment guide, juniper.net.
