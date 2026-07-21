# Test Report Brief — Scale-Out IPsec Solution for Mobile Service Providers

> Faithful markdown conversion of the published Juniper Validated Design
> **Test Report Brief: Scale-Out IPsec Solution for Mobile Service Providers**
> (`test-report-brief-MSE-SCALEOUT-IPSEC-SP-01-01`, V1.0). The PDF on juniper.net
> is the source of truth.
>
> **Tested-platform note:** the Mobile SP test plan validates IPsec with **SRX4600**
> and MX304 (MX doing RE-TLB load balancing). The Enterprise variant validates the
> same architecture with **vSRX** — see
> [test-report-brief-enterprise.md](test-report-brief-enterprise.md).

## Introduction

Firewall solutions are trending toward a smaller footprint, higher power
efficiency, and high scale/throughput. The CSDS fabric combines Juniper forwarding
devices with the service-plane capabilities of SRX/vSRX Series Firewalls, placing
service-card capability outside the forwarding chassis and connecting to the
forwarding layer directly or via an optional distribution layer. It segregates
forwarding and service planes into multiple groups, eliminating a single point of
failure.

CSDS leverages existing MX Series Router features (eBGP, BFD, ECMP CHASH, SRD, TLB)
as a forwarding plane and existing SRX Series Firewall features (CGNAT, IPsec,
stateful firewall, MNHA) as a service plane.

**This JVD test plan includes IPsec with SRX4600 and MX304 platforms, where the MX
Series Router performs RE-TLB based load balancing.** Other JVD test plans in the
series cover CGNAT/SFW (with SRX4600 or vSRX) and IPsec with vSRX and MX304.

## CSDS Solution Matrix

### Table 1: CSDS Solution Matrix

| MX Load-Balancer Component | MX Redundancy | Security Features | SRX/vSRX in MNHA Mode | SRX/vSRX in Standalone Mode |
|---|---|---|---|---|
| ECMP/CHASH | Single MX Series Router | CGNAT/NGFW | No | Yes |
| ECMP/CHASH | Single MX Series Router | IPsec | No | Yes |
| ECMP/CHASH | Dual MX Series Router (SRD) | CGNAT/NGFW | Yes | No |
| ECMP/CHASH | Dual MX Series Router (SRD) | IPsec | No | No |
| Traffic-Load-Balancer (TLB) | Single MX Series Router | CGNAT/NGFW | Yes | Yes |
| Traffic-Load-Balancer (TLB) | Single MX Series Router | IPsec | Yes | Yes |
| Traffic-Load-Balancer (TLB) | Dual MX Series Router | CGNAT/NGFW | Yes | Yes |
| Traffic-Load-Balancer (TLB) | Dual MX Series Router | IPsec | Yes | Yes |

> The SP CSDS solution matrix spans both CGNAT/NGFW and IPsec security features;
> this JVD validates the **IPsec** rows. CGNAT/NGFW is covered by companion CSDS
> JVDs.

## Test Topology

- **Topology 1 (TLB):** Single MX with scaled-out SRX MNHA pairs.
- **Topology 2 (TLB):** Dual MX with scaled-out SRX MNHA pairs.

## Platforms Tested

### Table 2: Platforms Tested Details

| Role | Platform | Junos OS Release |
|---|---|---|
| EDGE | MX304 | 23.4R2 |
| EDGE | SRX4600 | 23.4R2 |

**Version qualification history:** This JVD has been qualified in Junos OS Release
23.4R2.

## Scale and Performance Data

### Table 3: Scale Details

| Platform | Tunnel Count / MNHA Pair | Session Count / MNHA Pair | Traffic Type |
|---|---|---|---|
| SRX4600 | 1000 | 10000 | UDP |

Performance: SRX4600, 1000 tunnels/MNHA-pair, **40 Gbps** throughput/MNHA-pair,
CPU ≈ **90%**. Packet size is a security-gateway Internet mix, ~700-byte average.

### Table 4: Packet Size Weight

| Packet Size | Weight |
|---|---|
| 64 | 8 |
| 127 | 36 |
| 255 | 11 |
| 511 | 4 |
| 1024 | 2 |
| 1518 | 39 |

## Event Testing

**SRX Series Firewalls failure events:** MX-to-SRX link failures; SRX reboot; SRX
power off; complete MNHA pair power off; restart IKED; restart SUB/PUB broker
process.

**MX Series Router failure events:** reboot MX; restart routing process; restart
traffic-dird daemon; restart Network-monitor daemon; restart sdk-process; GRES;
TLB next-hop addition/deletion (adding/deleting a scale-out SRX MNHA pair).

Traffic recovery is validated after all failure scenarios. UDP traffic is generated
using IXnetwork for all failure-related test cases to measure failover convergence
time.

### Table 5: Tested Traffic Profiles

| Platform | Tunnel Count / MNHA Pair | Session Count / MNHA Pair | Traffic Type |
|---|---|---|---|
| SRX4600 | 1000 | 10000 | UDP |

## Sources

- Published JVD: *Scale-Out IPsec Solution for Mobile Service Providers — JVD Test
  Report Brief* (`test-report-brief-MSE-SCALEOUT-IPSEC-SP-01-01`), juniper.net
  validated designs.
- Companion docs in this folder: [design-guide-mobile-sp.md](design-guide-mobile-sp.md),
  [solution-overview-mobile-sp.md](solution-overview-mobile-sp.md),
  [datasheet.md](datasheet.md).
- Configurations: [../configuration/conf](../configuration/conf).
