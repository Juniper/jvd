# EWAN Core & Edge BYOAI — Full Query Menu

The always-current catalog of generation asks for the Enterprise WAN Core & Edge JVD. Replace `N` with any count (e.g. `Generate 3 …`). All services render on the chosen device pair with the chosen form tier (`minimum` / `with-overlay` / `as-deployed`).

## Services — L3VPN

- `Generate N L3VPN services with VRRP` — eBGP PE-CE, vrf-target, vrf-table-label
- `Generate N L3VPN Hub-and-Spoke spoke VRFs` — asymmetric import/export with community-based RT selection

## Services — VPLS (L2 multipoint)

- `Generate N VPLS instances` — LDP-signaled virtual-switch with FAT pseudowire (Junos: bridge-domains; EVO: vlans)

## Services — L2CKT (L2 point-to-point)

- `Generate N L2CKT pseudowires` — Ethernet-VLAN encap, hot-standby backup PE, control-word

## Services — NGMVPN (Multicast VPN)

- `Generate N NGMVPN instances` — MVPN + PIM + OSPF CE + ldp-p2mp provider tunnel
- `Generate NGMVPN Hub-and-Spoke pair` — Hub_Adv + Spokes_Adv VRFs with asymmetric policies (EVO only)

## Add a feature to a device

- `Add CoS to <device>` — 8-class DSCP + 802.1p classifiers + forwarding-classes
- `Add ECMP hash-key to <device>` — MPLS label + multiservice ECMP + entropy-label
- `Add PIM to <device>` — sparse-mode with static RP (PE) or local RP (P-router)
- `Add LFA convergence to <device>` — OSPF remote-backup + per-prefix + node-link-protection

## Greenfield / turn-up

- `Build a new WAN-edge turn-up for an ACX7509` — full as-deployed baseline (EVO)
- `Bootstrap a new MX304 PE end-to-end` — chassis + underlay + overlay + a sample service
- `Build a P-router / Route Reflector config for a PTX10003` — core transport + BGP RR

## Transport / underlay

- `Generate the OSPF + LDP + LFA underlay for <device>`
- `Generate MPLS LSPs with entropy-label`
- `Generate iBGP overlay to the route reflectors`
- `Generate PIM for NGMVPN provider tunnels`

## Audit / explain

- `Which snips are EVO-only vs Junos-only?`
- `Compare VPLS bridge-domains (Junos) vs vlans (EVO)`
- `Explain the Hub-and-Spoke NGMVPN topology`
- `Explain the hot-standby L2CKT failover design`
- `Explain the LFA convergence strategy`

---

Don't see what you need? Describe it and the assistant will tell you whether the EWAN Core & Edge JVD covers it.
