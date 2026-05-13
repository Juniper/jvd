# BYOAI menu — what the Metro EBS JVD assistant can do

This is the catalog of asks the assistant supports. Pick a line and
paste it into your AI chat (or describe what you want in your own
words — the assistant will tell you whether the Metro EBS JVD
covers it).

## Services

Replace `N` with any count (e.g. `Generate 3 EVPN-VPWS services`).

- `Generate N EVPN-VPWS services` — MEF E-Line
- `Generate N L3VPN VRFs`
- `Generate N EVPN-ELAN instances` — MEF E-LAN, mac-vrf
- `Generate N EVPN-ELAN with IRB` — Type-2 only; L2 + anycast GW
- `Generate N EVPN-ELAN with L3 (Type-2 + Type-5)` — adds VRF + ip-prefix-routes on same `irb.<N>`; JVD default
- `Generate N L2Circuit hot-standby pseudowires`
- `Generate N Kompella L2VPN pseudowires` — `instance-type l2vpn`, RFC 4761 P2P
- `Generate N BGP-VPLS instances` — `virtual-switch` + `site`/`site-identifier`; Junos PEs
- `Generate N LDP-VPLS instances` — `virtual-switch` + `vpls-id` + `neighbor`; EVO only in this JVD
- `Generate N port-based EVPN services` — port-mode VPWS / ELAN

## Add a feature to a device

- `Add CoS to <device>`
- `Add OAM/CFM perf-mon to a service`
- `Add firewall policers to UNI on <device>`

## Greenfield / turn-up

- `Build a new access-node turn-up for an ACX7024`
- `Bootstrap a new MX304 PE end-to-end`

## Audit / explain

- `Which snips use vlan-ccc vs vlan-bridge?`
- `Diff the EVO and Junos schedulers`
- `Compare EVO vs JUNOS VPN services`
- `Explain Seamless MPLS deployment` — 5-IGP-domain underlay + BGP-LU stitching across MDR ABRs
