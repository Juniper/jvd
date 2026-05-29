# BYOAI menu — what the Metro EBS JVD assistant can do

This is the catalog of asks the assistant supports. Pick a line and
paste it into your AI chat (or describe what you want in your own
words — the assistant will tell you whether the Metro EBS JVD
covers it).

## Services

Replace `N` with any count (e.g. `Generate 3 EVPN-VPWS services`).

### L2VPN / E-Line

- `Generate N EVPN-VPWS services` — MEF E-Line, per-AC `vpws-service-id`
- `Generate N port-based EVPN-VPWS services` — full-port UNI on unit 0
- `Generate N EVPN-FXC services` — Flexible Cross-Connect, vlan-unaware; N UNIs bundled under one `evpn-vpws` + FXC group
- `Generate N Kompella L2VPN pseudowires` — `instance-type l2vpn`, RFC 4761 P2P
- `Generate N L2Circuit hot-standby pseudowires` — `backup-neighbor … hot-standby` (EVO)
- `Generate N L2Circuit floating pseudowires` — static-label PW landing on a `ps<N>` pseudowire-subscriber anchor (Junos head-end + EVO vlan-ccc tail)
- `Generate N L2Circuit local-switching cross-connects` — port-to-port hairpin on a single PE (EVO; MEF E-Access hand-off)

### L2VPN / E-LAN + E-Tree

- `Generate N EVPN-ELAN instances` — MEF E-LAN (EVO `mac-vrf`, Junos MX `instance-type evpn` vlan-based)
- `Generate N port-based EVPN-ELAN instances` — `service-type vlan-bundle`, single full-port UNI
- `Generate N BGP-VPLS instances` — `virtual-switch` + `site` / `site-identifier`; both OS
- `Generate N LDP-VPLS instances` — `virtual-switch` + `vpls-id` + `neighbor`; EVO only in this JVD
- `Generate N EVPN E-Tree services` — MEF E-Tree (root/leaf isolation); Junos PEs

### L2 + L3 IRB

- `Generate N EVPN-ELAN with IRB` — Type-2 only; L2 + anycast GW (EVO mac-vrf, Junos virtual-switch)
- `Generate N EVPN-ELAN with L3 (Type-2 + Type-5)` — adds VRF + `ip-prefix-routes` on the same `irb.<N>`; JVD default
- `Generate N slim L3VPN anchor VRFs` — IRB-anchor VRF paired with a MAC-VRF, no explicit `ip-prefix-routes` block (host /32s ride RT-2)

### L3VPN

- `Generate N L3VPN VRFs with PE-CE eBGP` — `as-override`; both OS
- `Generate N L3VPN VRFs with PE-CE OSPF` — area 0 `interface-type p2p`; both OS

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
