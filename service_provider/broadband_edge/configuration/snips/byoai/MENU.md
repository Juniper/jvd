# BBE BYOAI — Full Query Menu

The always-current catalog of generation asks for the Metro Fabric and Broadband Edge JVD. Replace `N` with any count (e.g. `Generate 3 …`). Services render on the chosen device(s) with the chosen form tier (`minimum` / `with-overlay` / `as-deployed`).

## Services — subscriber termination (BNG side, PWHT)

- `Generate N EVPN-VPWS PPPoE services` — PPPoE subscribers over EVPN-VPWS PWHT into a BNG (ps interface + dynamic-profiles + subscriber VRF)
- `Generate N EVPN-VPWS IPoE services` — DHCP/IPoE subscribers over EVPN-VPWS PWHT into a BNG (autosense demux + dhcp-local-server VRF)
- `Generate N EVPN-VPWS FXC services (BNG)` — Flexible Cross-Connect PWHT termination on the BNG

## Services — access fabric (AN side)

- `Generate N EVPN-VPWS services (AN)` — per-subscriber-group pseudowires on an Access Node access LAG
- `Generate N EVPN-VPWS FXC services (AN)` — Flexible Cross-Connect multiplexing on an Access Node

## Services — L3 / infrastructure

- `Generate an L3VPN Internet VRF` — Internet access VRF on the core router (eBGP to upstream CE)
- `Generate an L3VPN RADIUS VRF` — RADIUS-reachability VRF (BNG or CR side)
- `Generate an access switch LAG` — QFX vlan-bridge LAG toward the Access Node

## Add a feature to a device

- `Add the IS-IS SR-MPLS underlay to <device>` — IS-IS L1/L2 + Segment Routing + TI-LFA + SR prefix-segments
- `Add the iBGP overlay to <device>` — role-appropriate PE / route-reflector overlay
- `Add BNG bootstrap to <device>` — chassis pseudowire-service + tunnel-services + subscriber-management
- `Add RADIUS AAA to <device>` — RADIUS server + access-profile
- `Add per-packet load balancing to <device>` — pplb + chained-composite-next-hop
- `Add the DHCP uRPF fail-filter to <device>`

## Greenfield / turn-up

- `Build a new Access Node turn-up for an ACX7024` — full as-deployed AN baseline + a sample EVPN-VPWS
- `Bootstrap a new MX304 BNG end-to-end` — chassis + subscriber-management + underlay + overlay + a sample PPPoE service

## Audit / explain

- `Which snips are EVO-only vs Junos-only?`
- `Explain the EVPN-VPWS PWHT service-id pairing between AN and BNG`
- `Explain Stateless Rapid Reconnect BNG redundancy`
- `Explain the ESI / DF-election design for BNG single-active vs AN all-active`

---

Don't see what you need? Describe it and the assistant will tell you whether the Metro Fabric and Broadband Edge JVD covers it.
