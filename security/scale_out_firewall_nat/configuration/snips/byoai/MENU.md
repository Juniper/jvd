# Scale-Out Stateful Firewall & NAT BYOAI — Full Query Menu

The always-current catalog of generation asks for the Scale-Out Stateful Firewall & NAT (CSDS ScaleOut) JVD. Components render on the chosen device(s) with the chosen form tier (`minimum` / `with-bgp` / `as-deployed`). Every device is Junos (MX304 + SRX4600). The tested NAT feature is source-NAT **NAPT44** (RFC6598 100.64/10); NAT64 is off-design.

## MX load balancer

- `Generate the MX TLB load balancer` — RE-based Traffic Load Balancer (Direct Server Return) + health-check profiles + FBF redirect + forwarding instances + north-side AC
- `Add the scale-out BGP planes to the MX` — TRUST/UNTRUST/MNHA VRFs with per-plane eBGP to the SRX farm + export policies + NAPT44 pool advertisement
- `Bootstrap the MX load balancer end-to-end` — full `as-deployed` MX-LB (TLB + BGP planes + interfaces + symmetric hash)

## SRX Stateful Firewall / NAT gateway

- `Generate the SRX SFW/NAT gateway` — source-NAT NAPT44 (RFC6598, address-pooling paired) + stateful-firewall policies + scale-out zones + health-check loopbacks
- `Add SRX MNHA` — Multinode High Availability: chassis SRG0 (BFD monitor + install-on-failure signal-route) + active/backup signal-route export policies
- `Add the scale-out BGP peering to the SRX` — SRX-to-MX per-plane eBGP + MNHA-VR ICL + signal-route-gated export policies
- `Bootstrap an SRX4600 SFW/NAT gateway end-to-end` — full `as-deployed` SRX (NAT + SFW + zones + BGP + MNHA + interfaces + management)

## Gateway emulator (test harness)

- `Generate the gateway emulator` — north-side TRUST/UNTRUST VRFs with static client/server routes + default + eBGP to the MX

## Add a feature to a device

- `Add filter-based forwarding redirect to the MX`
- `Add symmetric enhanced-hash-key to the MX` (for dual-MX)
- `Add the TLB health-check profiles to the MX`
- `Add the NAPT44 pool advertisement to the MX`
- `Add the SRX management bootstrap` (web-management port 8088 answers the TLB TCP health-check)
- `Add NAT64 to the SRX` (off-design / non-goal — flagged in Notes)

## Audit / explain

- `Which snips belong to the MX load balancer vs the SRX gateway?`
- `Explain source-NAT NAPT44 with address-pooling paired and why the pool is unique per MNHA pair`
- `Explain ECMP CHASH vs RE-based TLB in Direct Server Return mode`
- `Explain SRX MNHA (Routing/L3 mode) and the active/backup signal-route design`
- `Explain the Enterprise (Source NAT) vs Service Provider (CGNAT) framing of this JVD`

---

Don't see what you need? Describe it and the assistant will tell you whether the Scale-Out Stateful Firewall & NAT JVD covers it.
