# EWAN-ACE BYOAI — Full Query Menu

The always-current catalog of generation asks for the Enterprise WAN Advanced Core Edge JVD. Replace `N` with any count (e.g. `Generate 3 …`). All services render on the chosen device pair with the chosen form tier (`minimum` / `with-overlay` / `as-deployed`).

## Services — L2 point-to-point (E-Line)

- `Generate N EVPN-VPWS services` — MEF E-Line, per-AC vpws-service-id pair, control-word enabled
- `Generate N EVPN-FXC vlan-aware services` — Flexible Cross-Connect, 2+ VLANs per instance under one RD/RT

## Services — L2 multipoint (E-LAN)

- `Generate N EVPN-ELAN instances` — Junos MX: instance-type evpn; EVO ACX: mac-vrf vlan-bundle
- `Generate N EVPN-ELAN with IRB` — L2 bridge domain + integrated IRB gateway (pairs the Type-5 VRF)

## Services — L3 (IP-VRF / Type-5)

- `Generate N EVPN Type-5 VRFs` — ip-prefix routes, advertise direct-nexthop, binds an IRB
- `Generate N EVPN-ELAN with L3 (Type-2 + Type-5)` — full L2+L3 integrated service

## Add a feature to a device

- `Add CoS to <device>` — 8-class classifier + forwarding-class-map + EXP rewrite
- `Add OAM/CFM to a service` — 802.1ag CFM maintenance domain + SLA iterator
- `Add stateless firewall filters to <device>` — L3/L4 match + next-ip/next-interface/count
- `Add BGP FlowSpec DDoS mitigation to <device>` — family inet flow enablement
- `Add per-packet load balancing to <device>` — pplb ECMP + hash keys

## Greenfield / turn-up

- `Build a new WAN-edge turn-up for an ACX7100-48L` — full as-deployed baseline
- `Bootstrap a new MX304 PE end-to-end` — chassis + underlay + overlay + a sample service

## Transport / underlay

- `Generate the OSPF + Segment Routing + TI-LFA underlay for <device>`
- `Generate LDP/SR coexistence config` — SR Mapping Server (P routers) + sr-mapping-client (EVO edges)
- `Generate iBGP EVPN overlay to the route reflectors`
- `Generate static MPLS LSPs`

## Audit / explain

- `Which snips are EVO-only vs Junos-only?`
- `Compare EVPN-ELAN vlan-based (Junos) vs vlan-bundle (EVO)`
- `Explain SR + LDP coexistence via SR Mapping Server`
- `Explain the all-active multihoming / ESI design`

---

Don't see what you need? Describe it and the assistant will tell you whether the EWAN-ACE JVD covers it.
