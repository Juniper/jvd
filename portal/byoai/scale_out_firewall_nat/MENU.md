# Scale-Out Firewall and NAT BYOAI — Full Query Menu

The always-current catalog of generation asks for the Scale-Out Firewall and NAT JVD. Every service renders on the devices it is validated on, in the `minimum` form.

## Services — SRX security

- `Generate Source NAT (NAPT44 and NAT64 pools) and NAT64 destination NAT on srx1a, srx1b, srx2a and srx2b` — validated on srx1a, srx1b, srx2a and srx2b
- `Generate Trust-to-untrust security policies for the SFW and NAT source prefixes on srx1a, srx1b, srx2a and srx2b` — validated on srx1a, srx1b, srx2a and srx2b

## Services — SRX Multinode High Availability

- `Generate SRX Multinode High Availability (routing mode) with SRG 0, a BFD monitor and an install-on-failure signal route on srx1a, srx1b, srx2a and srx2b` — validated on srx1a, srx1b, srx2a and srx2b
- `Generate SRX MNHA-VR inter-chassis link routing with eBGP and BFD to the MX on srx1a, srx1b, srx2a and srx2b` — validated on srx1a, srx1b, srx2a and srx2b

## Services — scale-out routing

- `Generate SRX VR-1 scale-out routing with NAT pool discard routes and IPv4 and IPv6 eBGP to the MX trust and untrust instances on srx1a, srx1b, srx2a and srx2b` — validated on srx1a, srx1b, srx2a and srx2b
- `Generate MX TRUST_VR scale-out routing with eBGP multipath to every SRX node and eBGP to the trust gateway on mx1` — validated on mx1
- `Generate MX UNTRUST_VR scale-out routing with eBGP multipath to every SRX node and eBGP to the untrust gateway on mx1` — validated on mx1

## Services — MX Traffic Load Balancer

- `Generate MX TLB instance tlb_sfw_trust (IPv4, direct server return, source-IP hash) on mx1` — validated on mx1
- `Generate MX TLB instance tlb_sfw_untrust (IPv4, direct server return, destination-IP hash) on mx1` — validated on mx1
- `Generate MX TLB instance ipv6_tlb_sfw_trust (IPv6, direct server return, source-IP hash) on mx1` — validated on mx1
- `Generate MX TLB instance ipv6_tlb_sfw_untrust (IPv6, direct server return, destination-IP hash) on mx1` — validated on mx1
- `Generate MX gateway-facing unit with filter-based forwarding into the TLB trust forwarding instance on mx1` — validated on mx1
- `Generate MX gateway-facing unit with filter-based forwarding into the TLB untrust forwarding instance on mx1` — validated on mx1

## Services — MX inter-chassis link routing

- `Generate MX MNHA-VR with eBGP to the inter-chassis link unit of every SRX node on mx1` — validated on mx1

## Audit / explain

- `Which snippets are validated on srx1a?`
- `What does source NAT need on srx2a?`
- `Explain how the MNHA signal route changes the AS path the SRX advertises`
- `Explain the TLB direct-server-return load balancing and its health checks`
- `Compare the Enterprise (source NAT) and Service Provider (CGNAT) variants`
- `What does this library not cover?`

---

Don't see what you need? Describe it and the assistant will tell you whether the Scale-Out Firewall and NAT JVD covers it.
