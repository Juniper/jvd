# Test Report Brief — Scale-Out Stateful Firewall and CGNAT for SP Edge

> Faithful markdown conversion of the published Juniper Validated Design
> **Test Report Brief: Scale-Out Stateful Firewall and CGNAT for SP Edge**
> (`test-report-brief-mse-cgnat-offbox-01-01`, V1.0). The PDF on juniper.net is
> the source of truth.
>
> **Tested-platform note:** the Service Provider Edge test plan validates
> CGNAT/SFW with **SRX4600** and **vSRX** and MX304 for MSE/BBE deployments. The
> Enterprise variant covers the same architecture — see
> [test-report-brief-enterprise.md](test-report-brief-enterprise.md).

## Introduction

Firewall solutions are trending toward a smaller footprint, higher power
efficiency, and high scale/throughput. Traditional firewall solutions use fixed
slots for specific purposes, are power-inefficient, and require pre-allocated rack
space until the device is used at maximum scale. A distributed firewall
architecture increases scalability and improves performance without adding
complexity or management overhead, providing a more robust and resilient security
solution maintained through a single pane of glass.

The scale-out architecture combines the available Juniper forwarding devices with
the service-plane capabilities of SRX/vSRX Series Firewalls or instances. The
service-card capability is placed outside the forwarding chassis and connects to
the forwarding layer directly or indirectly through the optional distribution
layer. It segregates forwarding and service planes into multiple groups,
effectively eliminating a single point of failure.

CSDS leverages existing MX features (eBGP, BFD, ECMP with consistent hashing
[ECMP CHASH], SRD, and TLB) as a forwarding plane and various SRX Series Firewall
security features (CGNAT, stateful firewall, and MNHA) as a service plane.

## CSDS Solution Matrix

### Table 1: CSDS Solution Matrix

| MX Load-Balancer Component | MX Redundancy | Security Features | SRX/vSRX in MNHA Mode | SRX/vSRX in Standalone Mode |
|---|---|---|---|---|
| ECMP CHASH | Single MX | CGNAT/NGFW | No | Yes |
| ECMP CHASH | Dual MX (SRD) | CGNAT/NGFW | Yes | No |
| Traffic Load Balancer (TLB) | Single MX | CGNAT/NGFW | Yes | Yes |
| Traffic Load Balancer (TLB) | Dual MX | CGNAT/NGFW | Yes | Yes |

## Test Topology

Four deployment scenarios are described:

- **Deployment Scenario 1 (ECMP CHASH):** Single MX Router with scaled-out
  standalone SRXs. Resiliency at the MX (redundant RE, PSU) but no protection
  against MX-node failure; protection against service-node failure by
  redistributing flows, though with no session synchronization between firewalls
  (longer restoration for affected flows). *Pros:* simplicity and scaling per
  individual SRX. *Cons:* no redundancy.
- **Deployment Scenario 2 (ECMP CHASH):** Dual MX with scaled-out MNHA SRX pairs.
  Redundancy at both the MX routers and each SRX pair; SRD monitoring and SRG0
  cluster mode with session synchronization. *Pros:* simple redundancy and scaling
  per SRX pair. *Cons:* half of the architecture is active at a time.
- **Deployment Scenario 3 (TLB):** Single MX with scaled-out SRX MNHA pairs.
  Redundancy for the SRX Firewalls (optionally dual RE on the router). *Pros:*
  redundancy and scaling per SRX pair. *Cons:* no router redundancy (except dual
  RE).
- **Deployment Scenario 4 (TLB):** Dual MX with scaled-out SRX MNHA pairs. Most
  redundancy for both MX and SRX nodes with all components active. *Pros:* full
  redundancy and scaling. *Cons:* none.

## Platforms Tested

### Table 2: Platforms Tested

| Role | Platform | OS |
|---|---|---|
| EDGE | MX304 | 23.4R2 |
| EDGE | SRX4600 | 23.4R2 |
| EDGE | vSRX | 23.4R2 |

**Version qualification history:** This JVD has qualified in Junos OS Release
23.4R2.

## Scale and Performance Data

### Table 3: Scale Numbers for the Devices Under Test (DUTs)

| Platform | SRX Count | Services |
|---|---|---|
| SRX4600 | 1 | SFW/CGNAT |
| vSRX | 1 | SFW/CGNAT |

### Table 4: Performance Details

| Platform | CPS/MNHA-Pair | Throughput/MNHA-Pair | CPU/vSRX |
|---|---|---|---|
| SRX4600 | 100K CPS | 200 Gbps | 90% |

According to the performance details:

- **TCP 200G throughput** is generated using two million long-lived sessions with
  unique source IP addresses and source ports going to two destination HTTP
  servers.
- **TCP 100K connections per second** (100K TCP session create and delete
  happening at the same time with a 1-byte HTTP transaction per TCP session).

A `/8` source prefix is used for each of these traffic profiles, with routes
advertised between MX Series Routers and SRX Series Firewalls. Route scaling is
not tested as part of this JVD.

## High Level Features Tested

### Table 5: Tested Traffic Profiles

| Platform | SRX Count | Services | Traffic Type |
|---|---|---|---|
| SRX4600 | 1 | SFW/CGNAT | TCP |
| vSRX | 1 | SFW/CGNAT | TCP |

Packet size is an Internet mix (IMIX), an average packet size of ~700 bytes.

### Table 6: Packet Size Details

| Packet Size | Weight |
|---|---|
| 64 | 8 |
| 127 | 36 |
| 255 | 11 |
| 511 | 4 |
| 1024 | 2 |
| 1518 | 39 |

## Event Testing

**SRX Series Firewall failure events tested:** MX-to-SRX link failures; SRX
reboot; SRX power off; complete MNHA pair power off; restart SUB/PUB broker
process.

**MX Series Router failure events tested:** reboot MX Series Router; restart
routing process; restart traffic-dird daemon; restart Network-monitor daemon;
restart sdk-process; GRES; TLB next-hop addition/deletion (adding/deleting a new
scaled-out SRX MNHA pair); SRD-based CLI switchover between MX Series Routers.

Traffic recovery is validated after all failure scenarios.

## Sources

- Published JVD: *Scale-Out Stateful Firewall and CGNAT for SP Edge — JVD Test
  Report Brief* (`test-report-brief-mse-cgnat-offbox-01-01`), juniper.net
  validated designs.
- Companion docs in this folder: [design-guide-service-provider.md](design-guide-service-provider.md),
  [solution-overview-service-provider.md](solution-overview-service-provider.md),
  [datasheet.md](datasheet.md).
- Configurations: [../configuration/conf](../configuration/conf).
