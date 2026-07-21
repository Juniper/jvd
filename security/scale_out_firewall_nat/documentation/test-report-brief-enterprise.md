# Test Report Brief — Scale-Out Stateful Firewall and Source NAT for Enterprise

> Faithful markdown conversion of the published Juniper Validated Design
> **Test Report Brief: Scale-Out Stateful Firewall and Source NAT for Enterprise**
> (`test-report-brief-mse-cgnat-offbox-01-01`, V1.0). The PDF on juniper.net is
> the source of truth.
>
> **Tested-platform note:** the Enterprise test plan (TPI-128508) validates
> CGNAT/SFW with **vSRX** and MX304 (MX doing ECMP CHASH or RE-TLB load
> balancing). The Service Provider Edge variant covers the same architecture for
> the MSE/BBE edge — see
> [test-report-brief-service-provider.md](test-report-brief-service-provider.md).

## Introduction

Firewall solutions are trending toward a smaller footprint, higher power
efficiency, and high scale/throughput. Traditional firewall solutions use fixed
slots for specific purposes, are power-inefficient, and require pre-allocated rack
space until the device is used at maximum scale. A distributed firewall
architecture increases scalability and improves performance without adding
complexity or management overhead, providing a more robust and resilient security
solution maintained through a single pane of glass.

The Connected Security Distributed Services (CSDS) architecture combines the
available Juniper forwarding devices with the service-plane capabilities of
SRX/vSRX Series Firewalls or instances. The service-card capability is placed
outside the forwarding chassis and connects to the forwarding layer directly or
indirectly through the optional distribution layer. It segregates forwarding and
service planes into multiple groups, effectively eliminating a single point of
failure.

CSDS leverages existing MX Series Router features (eBGP, BFD, ECMP CHASH, SRD,
TLB) as a forwarding plane and various SRX Series Firewall security features
(CGNAT, IPsec, stateful firewall, MNHA) as a service plane.

This JVD test plan is scoped to the following JTMS test plan TPI:

- **TPI-128508** — CGNAT/SFW with vSRX and MX304 platforms (MX doing ECMP CHASH
  load balancing or RE-TLB based load balancing)

Other JTMS JVD test plans created for other features and platforms are:

- **TPI-128244** — CGNAT/SFW with SRX4600 and MX304 platforms (MX doing ECMP CHASH
  or RE-TLB based load balancing)
- **TPI-128507** — IPsec with SRX4600 and MX304 platforms (MX doing RE-TLB based
  load balancing)
- **TPI-129168** — IPsec with vSRX and MX304 platforms (MX doing RE-TLB based load
  balancing)

## CSDS Solution Matrix

### Table 1: CSDS Solution Matrix

| MX Load-Balancer Component | MX Redundancy | Security Features | SRX/vSRX in MNHA Mode | SRX/vSRX in Standalone Mode |
|---|---|---|---|---|
| ECMP CHASH | Single MX | CGNAT/NGFW | No | Yes |
| ECMP CHASH | Single MX | IPSEC | No | Yes |
| ECMP CHASH | Dual MX (SRD) | CGNAT/NGFW | Yes | No |
| ECMP CHASH | Dual MX (SRD) | IPSEC | No | No |
| Traffic Load Balancer (TLB) | Single MX | CGNAT/NGFW | Yes | Yes |
| Traffic Load Balancer (TLB) | Single MX | IPSEC | Yes | Yes |
| Traffic Load Balancer (TLB) | Dual MX | CGNAT/NGFW | Yes | Yes |
| Traffic Load Balancer (TLB) | Dual MX | IPSEC | Yes | Yes |

> This Enterprise JVD validates the **CGNAT/SFW** rows with vSRX and MX304. IPsec
> rows are covered by companion CSDS JVDs.

## Test Topology

Four deployment topologies are described:

- **Topology 1 (ECMP CHASH):** Single MX Series Router with scaled-out standalone
  SRXs. Simplest and least redundant; no MX backup and no session/IKE
  synchronization between firewalls. *Pros:* simplicity and scaling per
  individual SRX. *Cons:* no redundancy.
- **Topology 2 (ECMP CHASH):** Dual MX Series Routers (SRD) with scaled-out MNHA
  SRX pairs. Offers redundancy for the MX Routers and each SRX pair; SRG0
  (active/active) cluster mode with session synchronization. *Pros:* simple
  redundancy and scaling per SRX pair. *Cons:* half of the architecture is active
  at a time.
- **Topology 3 (TLB):** Single MX Series Router with scaled-out SRX MNHA pairs.
  Redundancy for the SRX Firewalls (optionally dual RE on the router). *Pros:*
  redundancy and scaling per SRX pair. *Cons:* no router redundancy (except dual
  RE).
- **Topology 4 (TLB):** Dual MX Series Routers with scaled-out SRX MNHA pairs.
  Full redundancy for both MX Routers and SRX pairs with all components active.
  *Pros:* full redundancy and scaling. *Cons:* none.

## Platforms Tested

### Table 2: Platforms Tested

| Name Convention | Supported Platform | OS |
|---|---|---|
| Forwarding Node | MX304 | Junos OS Release 23.4R2 |
| Service Node | SRX4600 | Junos OS Release 23.4R2 |
| Service Node | vSRX | Junos OS Release 23.4R2 (running on Linux-KVM) |

**Version qualification history:** This JVD has been qualified in Junos OS Release
23.4R2.

## Scale and Performance Data

### Table 3: Scale Numbers for the Devices Under Test (DUTs)

| Traffic Profile | Throughput/MNHA-Pair | Session Count/MNHA-Pair | Traffic Type | File Size | Session Type |
|---|---|---|---|---|---|
| 1 | 100 Gbps | 1,000,000 | UDP | IMIX | Long lived (PPS) |
| 2 | 100 Gbps | 1,000,000 | TCP | 4k | Long lived (PPS) |
| 3 | N/A | 100,000 | TCP | 1 byte | Short lived (CPS) |

A total of **2.1 million sessions** run with all three traffic profiles together.

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

## Event Testing

**SRX Series Firewall failure events tested:** MX-to-SRX link failures; SRX
reboot; SRX power off; complete MNHA pair power off.

**MX Series Router failure events tested:** reboot MX Series Router; restart
routing process; restart traffic-dird daemon; restart Network-monitor daemon;
restart sdk-process; GRES; TLB next-hop addition/deletion (adding/deleting a new
scaled-out SRX MNHA pair); SRD-based CLI switchover between MX Series Routers.

Traffic recovery is validated after all failure scenarios. With TCP traffic
profiles, Ixia retry is configured with [1 sec × 3] so that no resets are seen
during basic MNHA failovers; <1% resets can be seen during failure-event testing.
UDP traffic generated using IxNetwork for all failure-related test cases is used
to measure failover convergence time.

## Sources

- Published JVD: *Scale-Out Stateful Firewall and Source NAT for Enterprise — JVD
  Test Report Brief* (`test-report-brief-mse-cgnat-offbox-01-01`), juniper.net
  validated designs.
- Companion docs in this folder: [design-guide-enterprise.md](design-guide-enterprise.md),
  [solution-overview-enterprise.md](solution-overview-enterprise.md),
  [datasheet.md](datasheet.md).
- Configurations: [../configuration/conf](../configuration/conf).
