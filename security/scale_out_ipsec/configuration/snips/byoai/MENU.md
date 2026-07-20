# Scale-Out IPsec BYOAI — Full Query Menu

The always-current catalog of generation asks for the Scale-Out IPsec (CSDS ScaleOut) JVD. Components render on the chosen device(s) with the chosen form tier (`minimum` / `with-bgp` / `as-deployed`). Every device is Junos (MX304 + SRX4600).

## MX load balancer

- `Generate the MX TLB load balancer` — RE-based Traffic Load Balancer (Direct Server Return) + health-check profiles + FBF redirect + forwarding instance
- `Add the scale-out BGP planes to the MX` — TRUST/UNTRUST/MNHA VRFs with per-plane eBGP to the SRX farm + export policies
- `Bootstrap the MX load balancer end-to-end` — full `as-deployed` MX-LB (TLB + BGP planes + interfaces + symmetric hash)

## SRX IPsec Security Gateway

- `Generate the SRX IPsec Security Gateway` — responder-only auto-VPN IKE gateway + IPsec VPN (AES-256-GCM) + zones + policies + tunnels + anycast loopback
- `Add SRX MNHA` — Multinode High Availability: chassis SRG + HA-link-encryption + active/backup signal policies
- `Add the scale-out BGP peering to the SRX` — SRX-to-MX per-plane eBGP + MNHA-VR ICL + ARI/loopback export policies
- `Bootstrap an SRX4600 gateway end-to-end` — full `as-deployed` SRX (gateway + BGP + MNHA + interfaces)

## MX IPsec initiator (test source)

- `Generate the MX IPsec initiator` — AMS service-set + per-tunnel IKE gateways/VPNs toward the SRX anycast VIP + AMS/lo0/st0 interfaces

## Add a feature to a device

- `Add filter-based forwarding IPsec redirect to the MX`
- `Add symmetric enhanced-hash-key to the MX` (for dual-MX)
- `Add the TLB health-check profiles to the MX`

## Audit / explain

- `Which snips belong to the MX load balancer vs the SRX gateway?`
- `Explain the anycast IKE endpoint and how responder-only auto-VPN scales`
- `Explain ECMP CHASH vs RE-based TLB`
- `Explain SRX MNHA Routing/L3 mode and the active/backup signal-route design`
- `Explain Auto Route Injection (ARI) and return-path symmetry`

---

Don't see what you need? Describe it and the assistant will tell you whether the Scale-Out IPsec JVD covers it.
