# LLQ BYOAI — Full Query Menu

The always-current catalog of generation asks for the **Low Latency QoS Design for
5G (LLQ)** JVD. Replace `N` with any count (e.g. `Generate 3 …`). All services
render on the chosen device pair with the chosen form tier (`minimum` /
`with-overlay` / `as-deployed`).

## Services — 5G fronthaul (eCPRI, L2 point-to-point)

- `Generate N EVPN-VPWS fronthaul services` — multi-homed eCPRI C/U-plane
  (EVO ESI LAG), static FC-LLQ, eCPRI MAC classification
- `Generate N EVPN-FXC vlan-aware services` — Flexible Cross-Connect, eCPRI
  control + user-plane VLANs bundled under one RD/RT

## Services — 5G fronthaul / midhaul (L2 multipoint + L2/L3)

- `Generate N EVPN-ELAN instances` — mac-vrf multipoint L2 for fronthaul (EVO),
  802.1p classification
- `Generate N EVPN-ELAN with IRB + L3VPN` — DU→SAG midhaul anycast gateway:
  bridge domain + IRB routed into an L3VPN VRF

## Services — MBH transport (L2 / L3)

- `Generate N BGP-VPLS instances` — RFC 4761 multipoint L2 MBH with FAT-PW
- `Generate N EVPN-VPWS single-homed services` — end-to-end L2 MBH to the SAG
- `Generate N L3VPN with IRB` — VRF anycast gateway, vrf-table-label, MF DSCP
  classification

## Add a feature to a device

- `Add the full 5G CoS to <device>` — 8-class O-RAN model: forwarding-classes +
  classifiers (802.1p/EXP/DSCP/DSCPv6) + rewrites + scheduler-map + schedulers
- `Add low-latency fronthaul CoS to <device>` — static FC-LLQ binding +
  low-latency scheduler + eCPRI MF filter (ACX)
- `Add OAM/CFM to a service` — 802.1ag maintenance domain + continuity-check MEPs
- `Add L3VPN IRB firewall classification to <device>` — IPv4/IPv6 DSCP→FC filters
- `Add per-packet load balancing to <device>` — pplb + chained-composite-next-hop
  + forwarding-options hash (EVO)

## Greenfield / turn-up

- `Build a new fronthaul CSR turn-up for an ACX7024` — full as-deployed baseline
- `Build a new HSR turn-up for an ACX7509` — full as-deployed baseline
- `Bootstrap a new MX304 SAG end-to-end` — underlay + overlay + a sample service

## Transport / underlay

- `Generate the IS-IS Segment Routing + TI-LFA underlay for <device>`
- `Generate the Seamless MPLS iBGP labeled-unicast overlay to the route reflectors`
- `Generate the MPLS + forwarding load-balance config for <device>`

## Audit / explain

- `Which snips are EVO-only vs Junos-only?`
- `Explain how FC-LLQ differs on ACX (low-latency) vs MX/PTX (strict-high)`
- `Compare EVPN-VPWS multi-homed (fronthaul) vs single-homed (midhaul)`
- `Explain the 8-queue O-RAN CoS model and the shaping-rate vs transmit-rate split`

---

Don't see what you need? Describe it and the assistant will tell you whether the
LLQ JVD covers it.
