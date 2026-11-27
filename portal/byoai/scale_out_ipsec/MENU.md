# Scale-Out IPsec BYOAI — Full Query Menu

The always-current catalog of generation asks for the Scale-Out IPsec JVD. Every service renders on the devices it is validated on, in the `minimum` form.

## Services — SRX IKE and IPsec

- `Generate IKEv2 AutoVPN responder on the SRX IKE anycast address, with the MNHA inter-chassis link IKE gateway on srx1a, srx1b, srx2a and srx2b` — validated on srx1a, srx1b, srx2a and srx2b
- `Generate IPsec AutoVPN on st0.1 with ARI traffic selectors, and the MNHA inter-chassis link encryption VPN on srx1a, srx1b, srx2a and srx2b` — validated on srx1a, srx1b, srx2a and srx2b

## Services — SRX security policies

- `Generate Intra-zone security policies for IPsec data, the MNHA inter-chassis link and ESP to the trust zone on srx1a, srx1b, srx2a and srx2b` — validated on srx1a, srx1b, srx2a and srx2b

## Services — SRX Multinode High Availability

- `Generate SRX MNHA with an encrypted inter-chassis link and IPsec SRG 1, preferred node (preemption, activeness priority 200) on srx1a and srx2a` — validated on srx1a and srx2a
- `Generate SRX MNHA with an encrypted inter-chassis link and IPsec SRG 1, backup node (activeness priority 1) on srx1b and srx2b` — validated on srx1b and srx2b
- `Generate SRX MNHA-VR inter-chassis link routing with eBGP and BFD to the MX on srx1a, srx1b, srx2a and srx2b` — validated on srx1a, srx1b, srx2a and srx2b

## Services — scale-out routing

- `Generate SRX eBGP group SRX-to-MX_TRUST with BFD toward the MX trust instance on srx1a, srx1b, srx2a and srx2b` — validated on srx1a, srx1b, srx2a and srx2b
- `Generate SRX eBGP group SRX-to-MX_UNTRUST with BFD toward the MX untrust instance on srx1a, srx1b, srx2a and srx2b` — validated on srx1a, srx1b, srx2a and srx2b
- `Generate MX TRUST_VR scale-out routing with eBGP to every SRX node and to the trust-side gateway on mx1` — validated on mx1
- `Generate MX UNTRUST_VR scale-out routing with eBGP to every SRX node and to the untrust-side gateway on mx1` — validated on mx1

## Services — MX inter-chassis link routing

- `Generate MX MNHA-VR with eBGP to the inter-chassis link unit of every SRX node on mx1` — validated on mx1

## Services — MX Traffic Load Balancer

- `Generate MX TLB instance ipsec_lb (direct server return to the SRX MNHA pairs, source-IP hash) on mx1` — validated on mx1
- `Generate MX gateway-facing unit with filter-based forwarding of IKE and IPsec traffic into the TLB forwarding instance on mx1` — validated on mx1

## Services — IPsec initiator gateway

- `Generate MX IKEv2 initiator with five gateways to the SRX IKE anycast address on ipsec_initiator_gateway` — validated on ipsec_initiator_gateway
- `Generate MX IPsec initiator with five route-based VPNs established immediately on ipsec_initiator_gateway` — validated on ipsec_initiator_gateway

## Audit / explain

- `Which snippets are validated on srx1a?`
- `What does the IPsec AutoVPN need on srx2a?`
- `Explain how the MNHA signal routes change the AS path of the ARI routes`
- `Explain the TLB direct-server-return load balancing of the IKE anycast address and its health checks`
- `Compare the Enterprise and Mobile Service Provider variants`
- `What does this library not cover?`

---

Don't see what you need? Describe it and the assistant will tell you whether the Scale-Out IPsec JVD covers it.
