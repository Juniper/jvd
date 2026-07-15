# EWAN-Finance BYOAI — Full Query Menu

The always-current catalog of generation asks for the Enterprise WAN for Finance & Stock Exchange JVD. Replace `N` with any count (e.g. `Generate 3 …`). All services render on the chosen device(s) with the chosen form tier (`minimum` / `with-overlay` / `as-deployed`).

## Services — multicast (market data)

- `Generate N NG-MVPN instances` — SPT-only multicast VRF, BGP Type-5/7, RSVP-TE P2MP provider tunnel (Junos WAN-edge/AP)
- `Add multicast forwarding tuning to <device>` — PFE resolve-rate / RPF-mismatch-rate
- `Add the multicast forwarding-cache filter to <device>` — multicast match + CoS forwarding-class marking

## Services — L2 (EVPN)

- `Generate N EVPN virtual-switch services` — Active/Standby, ESI multihoming, IRB gateway (Junos WAN-edge)

## Services — L3

- `Generate N L3VPN VRFs` — unicast VRF, eBGP PE-CE, IRB attachment (Junos WAN-edge/AP)
- `Generate N virtual-router instances` — CR PE-CE context: eBGP to AP + PIM-SM + MED steering (Junos cr2 or EVO cr1)

## Add a feature to a device

- `Add CoS to <device>` — EXP classifiers + forwarding classes + schedulers
- `Add TWAMP server to <device>` — Junos AP / WAN-edge SLA reflector
- `Add TWAMP client to <device>` — CR SLA probing
- `Add MED / redistribution policy to <device>` — route-filter MED + OSPF↔BGP leak policies

## Greenfield / turn-up

- `Build a new MX304 WAN-edge turn-up` — full as-deployed baseline + a sample service
- `Bootstrap a new ACX7100-48L core router end-to-end` — chassis + underlay + virtual-router
- `Build the L2/L3 edge (ACX7100) bridging config` — chassis + LAG + VLAN bridge-domain + LLDP

## Transport / underlay

- `Generate the OSPF-TE + RSVP-TE + MPLS underlay for <device>`
- `Generate the iBGP core mesh for <device>` — inet-vpn / inet-mvpn / evpn families
- `Generate the P2MP LSP provider-tunnel template`

## Audit / explain

- `Which snips are EVO-only vs Junos-only?`
- `Explain the NG-MVPN SPT-only design with RSVP-TE P2MP`
- `Explain the EVPN Active/Standby ESI multihoming design`
- `Explain the virtual-router MED-based path steering`

---

Don't see what you need? Describe it and the assistant will tell you whether the EWAN-Finance JVD covers it.
