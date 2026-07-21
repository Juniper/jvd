# Scale-Out Stateful Firewall & NAT (CSDS ScaleOut) — Datasheet

> JVD slug: `so-fwnat` · Track: Security / Connected Security Distributed Services
> (CSDS) · **Datasheet** — a dry, scannable quick-reference. Ground truth is the
> published JVD documentation on juniper.net and the companion docs in this folder.

MX Series routers act as **stateless load balancers** distributing traffic across a
scaled-out farm of SRX/vSRX firewalls performing **stateful firewall (SFW)** and
**carrier-grade / source NAT (NAPT44)**. One technical architecture (CSDS ScaleOut)
is validated for **two deployment focuses** — Enterprise (Source NAT) and Service
Provider (CGNAT) — sharing the same platforms, load-balancing methods, and
configurations.

## At a glance

| | |
|---|---|
| JVD / slug | Scale-Out Stateful Firewall & NAT (CSDS ScaleOut) / `so-fwnat` |
| Track | Security — Connected Security Distributed Services (CSDS) |
| Architecture | Scale-out: MX forwarding/load-balancer layer + SRX/vSRX security-service layer (SFW + NAT) |
| Load balancing | ECMP with Consistent Hashing (CHASH); RE-based Traffic Load Balancer (TLB, Direct Server Return / L3) |
| Transport / control | eBGP + BFD (timers as low as 100 ms); IPv4 and IPv6 dual-stack |
| Security service | Stateful firewall + Source NAT / CGNAT via **NAPT44** (RFC 6598 CGN space, address-pooling paired) |
| High availability | SRX Multinode High Availability (MNHA), Routing/L3 mode; MX SRD (ECMP) or BGP (TLB); dual-MX |
| Deployment focuses | Enterprise (`-ent-01-01`, Source NAT) and Service Provider (`-sp`, CGNAT) |
| Validation | Junos OS Release 23.4R2 (see juniper.net for the current matrix) |
| Min. validated software | **Junos OS Release 23.4R2** (MX304 + SRX4600/vSRX); symmetric `enhanced-hash-key` for dual-MX from 24.2 |

> **NAT scope:** the validation covers **NAPT44** only. NAT64, deterministic NAT
> (DetNAT), port-block allocation (PBA), and DS-Lite are explicit non-goals of both
> JVDs. (The device configs include NAT64 stanzas; only NAPT44 is validated.)

## Deployment Focus: Enterprise vs Service Provider

The same CSDS ScaleOut architecture is validated and published as two JVDs. The
technical design, platforms, and configurations are common; the framing and NAT
use case differ.

| | Enterprise (`-ent-01-01`) | Service Provider (`-sp`) |
|---|---|---|
| Positioning | Enterprises / managed security providers, data-centre & campus edge | SP / mobile multiservice edge, subscriber Internet edge |
| NAT use case | **Source NAT (SNAT)** — enterprise egress translation | **CGNAT (NAPT44)** — carrier-grade subscriber translation |
| MX routing instances | Trust / Untrust (Internal / Internet) | Access / Internet |
| Security features in scope | Stateful firewall + Source NAT | Stateful firewall + CGNAT |
| Source document | `jvd-mse-cgnat-offbox-ent-01-01` | `jvd-offbox-cgnat-01-01-sp` |
| Publish date | 2025-05-29 | 2025-05-29 |

> Note: both variants list SRX4600 and vSRX as validated service-layer platforms and
> both translate into RFC 6598 CGN space (`100.64.0.0/10`) with a unique NAT pool per
> SRX / MNHA pair; the difference above is positioning and NAT framing.

## Device roles

| Role | What it does in the network |
|---|---|
| Forwarding / Load Balancer | MX distributes flows across the SRX/vSRX farm (ECMP CHASH or TLB), peers via eBGP+BFD, maintains flow symmetry |
| Security Service (SFW/NAT) | SRX/vSRX performs stateful firewalling and Source NAT / CGNAT (NAPT44), one unique NAT pool per node |
| Gateway / Emulator | Emulates client access and Internet-side gateway for the validated topology |

## Featured platforms

| Role | Device(s) | Min. validated software |
|---|---|---|
| Forwarding / Load Balancer | MX304 | Junos OS Release 23.4R2 |
| Security Service (SFW/NAT) | SRX4600, vSRX | Junos OS Release 23.4R2 |

Regression re-validates on newer releases; see juniper.net for the current
validated set.

## Protocols

- **Underlay / transport:** eBGP (per-instance autonomous systems), BFD (≈100 ms),
  ECMP, multipath; two routing instances (Trust/Access + Untrust/Internet).
- **Load balancing:** ECMP Consistent Hashing (source/destination-IP symmetric
  hash); RE-based Traffic Load Balancer (TLB) in Direct Server Return / L3 mode with
  ICMP/HTTP/TCP health checks and filter-based forwarding; symmetric
  `enhanced-hash-key` for dual-MX.
- **Security services:** stateful firewall (zone policies); Source NAT / CGNAT via
  **NAPT44** with `address-pooling paired`, unique source-NAT pool per SRX/MNHA pair
  in RFC 6598 CGN space.
- **High availability:** SRX MNHA (SRG0 active/active, Routing/L3 mode, session
  synchronization); MX Service Redundancy Daemon (SRD) with ECMP, or BGP dynamic
  routing with TLB; GRES.
- **Routing policy:** consistent-hash / source-ip load-balance policies,
  next-hop-self export, symmetric enhanced-hash-key for dual-MX.

## Services & use cases

**Services**

| Service | What it delivers | Means of delivery |
|---|---|---|
| Stateful firewall | Stateful inspection of subscriber / enterprise traffic | SRX/vSRX farm behind MX load balancer |
| Source NAT / CGNAT | NAPT44 translation into RFC 6598 CGN space, paired pooling | SRX/vSRX (one unique pool per node) |
| Horizontal scale | Pay-as-you-grow capacity by adding SRX/vSRX nodes | ECMP CHASH or TLB across the service farm |
| Resiliency | Sub-second restoration of sessions | SRX MNHA + dual-MX + BFD |

**Intent-based use cases** — a use case = *SFW/NAT connectivity intent* × *load-balancing
method (ECMP CHASH / TLB)* × *MX redundancy (single / dual)* × *SRX resiliency
(standalone / MNHA)*. These axes compose the four validated deployment topologies
documented in the design guides and test reports.

## Scale (validated / reference)

| Metric | Value |
|---|---|
| Throughput per MNHA pair (baseline) | ~100 Gbps (TCP-4k / UDP-IMIX ~700 B) |
| Connections per second | 100K CPS (TCP 1-byte) at ~90% SRX CPU |
| Per-SRX4600 reference | 100K CPS / 200 Gbps / ~90% CPU |
| MX304 forwarding capacity | 3.2 Tbps (redundant RE) / 4.8 Tbps (single RE) |
| TLB scale | ~2,000 groups / ~256 members per MX |
| Scale-out example (200 Gbps/pair) | ~16 SRX (2 line cards) / ~24 SRX (3 line cards) |

Throughput/forwarding maxima are platform capabilities, not end-to-end scale-tested
figures; see the test-report briefs for the validated profiles.

## Design concepts

- **Forwarding layer** — MX as stateless load balancer, per-instance eBGP+BFD,
  flow symmetry.
- **Load balancing** — ECMP CHASH (consistent load balancing) vs TLB (Direct
  Server Return, health-checked, ~2,000 groups / ~256 members per MX).
- **Service layer** — SRX/vSRX stateful firewall + NAPT44 Source NAT / CGNAT,
  unique NAT pool per node, paired address pooling.
- **High availability** — MNHA Routing/L3 mode, SRG signalling, dual-MX with SRD.
- **Deployment topologies** — single/dual MX × standalone/MNHA SRX (four topologies:
  ECMP single, ECMP dual, TLB single, TLB dual).

## References

- **Validated Designs index:** https://www.juniper.net/documentation/validated-designs/
  · [Security JVDs](https://www.juniper.net/documentation/validated-designs/us/en/security/)
- **Connected Security Distributed Services (CSDS):** [Experience-First page](https://www.juniper.net/documentation/product/us/en/connected-security-distributed-services/)
  · [CSDS Deployment Guide](https://www.juniper.net/documentation/us/en/software/connected-security-distributed-services/csds-deploy/index.html)
  · [CSDS Release Notes](https://www.juniper.net/documentation/us/en/software/connected-security-distributed-services/csds-release-notes/index.html)
- **Portal:** https://juniper.github.io/jvd/portal/
- **Companion docs:** [design-guide-enterprise.md](design-guide-enterprise.md) ·
  [design-guide-service-provider.md](design-guide-service-provider.md) ·
  [solution-overview-enterprise.md](solution-overview-enterprise.md) ·
  [solution-overview-service-provider.md](solution-overview-service-provider.md) ·
  [test-report-brief-enterprise.md](test-report-brief-enterprise.md) ·
  [test-report-brief-service-provider.md](test-report-brief-service-provider.md)
- **Configurations / snips:** [../configuration/conf](../configuration/conf) ·
  [../configuration/snips](../configuration/snips)
