# EWAN DC Edge BYOAI — Full Query Menu

The always-current catalog of generation asks for the Enterprise Data Center Edge JVD. Replace `N` with any count (e.g. `Generate 3 …`). Every service renders on the devices it is validated on, at the chosen form tier (`minimum` / `self-contained` / `as-deployed`; `with-overlay` is an alias for `self-contained`).

## Services — EVPN-VXLAN to EVPN-MPLS interconnect (DC edge)

- `Generate N VLAN-based interconnect instances with IRB on dc-edge1 and dc-edge2` — EVPN-VXLAN instance with `protocols evpn interconnect` (EVPN-MPLS), all-active interconnect ESI, IRB virtual gateway
- `Generate N VLAN-bundle interconnect instances on dc-edge1 and dc-edge2` — VLAN-bundle EVPN-VXLAN instance with `protocols evpn interconnect`, no IRB

## Services — EVPN-VXLAN MAC-VRF (DC leaf)

- `Generate N VLAN-based MAC-VRF instances on leaf1 and leaf2` — VXLAN MAC-VRF on an ESI-LAG attachment
- `Generate N VLAN-bundle MAC-VRF instances on leaf1 and leaf2` — VXLAN MAC-VRF VLAN bundle on an ESI-LAG

## Services — EVPN-MPLS ELAN (WAN edge)

- `Generate N VLAN-based EVPN instances with IRB on wan-edge1` — `routing-interface` IRB (MX204)
- `Generate N VLAN-based EVPN instances with IRB on wan-edge2` — `l3-interface` IRB (ACX5448-M)
- `Generate N VLAN-bundle EVPN instances on wan-edge1 or wan-edge2`
- `Generate a VLAN-bundle EVPN instance with no-gateway-community on wan-edge2`

## Add a feature to a device

- `Add per-packet load balancing to <device>` — forwarding-table export policy (DC edge, spine, leaf, WAN edge, P)
- `Add OSPF loop-free alternates to <device>` — DC edge, WAN edge and p1
- `Add EVPN-VXLAN shared tunnels to a leaf`
- `Add the EVPN multihoming firewall profile to wan-edge2`

## Greenfield / turn-up

- `Build the as-deployed baseline for <device>` — every snippet validated on that device except its service instances (any of the 12 devices)

## Audit / explain

- `Which snippets are validated on dc-edge1?`
- `What does a VLAN-based interconnect instance need on dc-edge2?`
- `Explain the EVPN-VXLAN to EVPN-MPLS interconnect at the DC edge`
- `Compare the routing-interface and l3-interface IRB forms on the WAN edges`
- `What does this library not cover?`

---

Don't see what you need? Describe it and the assistant will tell you whether the Enterprise Data Center Edge JVD covers it.
