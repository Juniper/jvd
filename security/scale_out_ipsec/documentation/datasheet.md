# Scale-Out IPsec (CSDS ScaleOut) — Datasheet

> JVD slug: `so-ipsec` · Track: Security / Connected Security Distributed Services
> (CSDS) · **Datasheet** — a dry, scannable quick-reference. Ground truth is the
> published JVD documentation on juniper.net and the companion docs in this folder.

MX Series routers act as **stateless load balancers** distributing encrypted
tunnel traffic across a scaled-out farm of SRX/vSRX IPsec Security Gateways. One
technical architecture (CSDS ScaleOut) is validated for **two deployment focuses**
— Enterprise and Mobile Service Provider — sharing the same platforms,
load-balancing methods, and configurations.

## At a glance

| | |
|---|---|
| JVD / slug | Scale-Out IPsec (CSDS ScaleOut) / `so-ipsec` |
| Track | Security — Connected Security Distributed Services (CSDS) |
| Architecture | Scale-out: MX forwarding/load-balancer layer + SRX/vSRX IPsec service layer (+ optional QFX distribution layer) |
| Load balancing | ECMP with Consistent Hashing (CHASH); RE-based Traffic Load Balancer (TLB, Direct Server Return) |
| Transport / control | eBGP + BFD (timers as low as 100 ms); IPv4 and IPv6 dual-stack |
| Security service | IPsec Security Gateway (IKEv1/v2, ESP, AES-256-GCM), auto-VPN responder-only; inherent stateful firewall |
| High availability | SRX Multinode High Availability (MNHA), Routing/L3 mode; MX SRD; dual-MX |
| Deployment focuses | Enterprise (`-ENT-01-01`) and Mobile Service Provider (`-SP-01-01`) |
| Validation | Junos OS Release 23.4R2 (see juniper.net for the current matrix) |
| Min. validated software | **Junos OS Release 23.4R2** (RE-TLB base on MX304/MX10004); ECMP available from 23.2R2; MNHA from 22.3R1 |

## Deployment Focus: Enterprise vs Mobile Service Provider

The same CSDS ScaleOut architecture is validated and published as two JVDs. The
technical design, platforms, and configurations are common; the framing and the
tested service-plane platform differ.

| | Enterprise (`-ENT-01-01`) | Mobile Service Provider (`-SP-01-01`) |
|---|---|---|
| Positioning | Central offices, data centres, enterprises / managed security providers | SP multiservice edge WAN / metro, mobile edge (MSP) |
| Access-side sources | Remote sites / users (branch, DC) | eNodeB / gNodeB mobile access |
| MX routing instances | Internet / Internal (TRUST / UNTRUST) | Access / Internet |
| Tested service platform | **vSRX** + MX304 | **SRX4600** + MX304 |
| Security features in scope | IPsec | IPsec (CSDS matrix also spans CGNAT/NGFW, covered by companion JVDs) |
| Publish date | 2025-05-26 | 2025-05-23 |

> Note: both variants list SRX4600 and vSRX as validated service-layer platforms;
> the difference above is which platform each variant's **test report** exercised.

## Device roles

| Role | What it does in the network |
|---|---|
| Forwarding / Load Balancer | MX distributes IPsec flows across the SRX/vSRX farm (ECMP CHASH or TLB), peers via eBGP+BFD, maintains flow symmetry |
| IPsec Initiator Gateway | MX terminating/initiating IPsec on the initiator side of the test topology |
| Security Service (SECGW) | SRX/vSRX terminates IKE/IPsec (responder-only auto-VPN), performs stateful firewalling, injects ARI routes |
| Distribution (optional) | QFX aggregates many SRX/vSRX into bundled 400GE links (not part of this JVD) |

## Featured platforms

| Role | Device(s) | Min. validated software |
|---|---|---|
| Forwarding / Load Balancer | MX304 | Junos OS Release 23.4R2 |
| IPsec Initiator Gateway | MX304 | Junos OS Release 23.4R2 |
| Security Service | SRX4600, vSRX | Junos OS Release 23.4R2 |

Regression re-validates on newer releases; see juniper.net for the current
validated set.

## Protocols

- **Underlay / transport:** eBGP (per-instance autonomous systems), BFD (≈100 ms),
  ECMP, multipath.
- **Load balancing:** ECMP Consistent Hashing (source/destination-IP symmetric
  hash); RE-based Traffic Load Balancer (TLB) in Direct Server Return mode with
  ICMP/HTTP/TCP health checks and filter-based forwarding.
- **Security services:** IKEv1/v2, IPsec ESP (AES-256-GCM), auto-VPN responder-only,
  Dead Peer Detection, Auto Route Injection (ARI) traffic selectors; inherent
  stateful firewall.
- **High availability:** SRX MNHA (SRG0 active/active, SRG1+ active/backup, Routing/
  L3 mode, session + IKE SA synchronization); MX Service Redundancy Daemon (SRD);
  GRES.
- **Routing policy:** consistent-hash / source-ip-only load-balance policies,
  next-hop-self export, symmetric enhanced-hash-key for dual-MX.

## Services & use cases

**Services**

| Service | What it delivers | Means of delivery |
|---|---|---|
| IPsec Security Gateway | Scalable IKE/IPsec termination for remote sites/users or mobile access | SRX/vSRX farm behind MX load balancer |
| Stateful firewalling | Stateful inspection of tunnelled traffic | SRX/vSRX (inherent) |
| Horizontal scale | Pay-as-you-grow capacity by adding SRX/vSRX nodes | ECMP CHASH or TLB across the service farm |
| Resiliency | Sub-second restoration of sessions and IPsec SAs | SRX MNHA + dual-MX + BFD |

**Intent-based use cases** — a use case = *IPsec connectivity intent* × *load-balancing
method (ECMP CHASH / TLB)* × *MX redundancy (single / dual)* × *SRX resiliency
(standalone / MNHA)*. These axes compose the validated deployment scenarios
(Deployment Scenarios 1–3) documented in the design guides and test reports.

## Design concepts

- **Forwarding layer** — MX as stateless load balancer, per-instance eBGP+BFD,
  flow symmetry.
- **Load balancing** — ECMP CHASH (consistent load balancing) vs TLB (Direct
  Server Return, health-checked, ~2,000 groups / ~256 members per MX).
- **Service layer** — SRX/vSRX responder-only auto-VPN, shared anycast IKE gateway,
  ARI for return-path steering.
- **High availability** — MNHA Routing/L3 mode, SRG signalling, dual-MX with SRD.
- **Deployment scenarios** — single/dual MX × standalone/MNHA SRX (Scenarios 1–3).

## References

- **Juniper.net JVD pages:** [Scale-Out IPsec for Enterprises](https://www.juniper.net/documentation/us/en/software/jvd/jvd-scale-out-ipsec-solution-for-enterprises/index.html)
  · [Scale-Out IPsec for Mobile Service Providers](https://www.juniper.net/documentation/us/en/software/jvd/jvd-scale-out-IPsec-solution-for-mobile-service-providers/index.html)
- **Validated Designs index:** https://www.juniper.net/documentation/validated-designs/
- **Connected Security Distributed Services (CSDS):** [Experience-First page](https://www.juniper.net/documentation/product/us/en/connected-security-distributed-services/)
  · [CSDS Deployment Guide](https://www.juniper.net/documentation/us/en/software/connected-security-distributed-services/csds-deploy/index.html)
- **Portal:** https://juniper.github.io/jvd/portal/
- **Companion docs:** [design-guide-enterprise.md](design-guide-enterprise.md) ·
  [design-guide-mobile-sp.md](design-guide-mobile-sp.md) ·
  [solution-overview-enterprise.md](solution-overview-enterprise.md) ·
  [solution-overview-mobile-sp.md](solution-overview-mobile-sp.md) ·
  [test-report-brief-enterprise.md](test-report-brief-enterprise.md) ·
  [test-report-brief-mobile-sp.md](test-report-brief-mobile-sp.md)
- **Configurations / snips:** [../configuration/conf](../configuration/conf) ·
  [../configuration/snips](../configuration/snips)
