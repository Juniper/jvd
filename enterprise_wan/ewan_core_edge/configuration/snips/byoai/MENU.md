# Enterprise WAN Core and Edge BYOAI — Full Query Menu

The always-current catalog of generation asks for the Enterprise WAN Core and Edge JVD. Replace `N` with any count (e.g. `Generate 3 …`). Every service renders on the devices it is validated on, in the `minimum` form: the service construct only, on a device that already runs its prerequisites (attachment units, BGP overlay and transport).

## Services — L3VPN

- `Generate N L3VPN VRFs with VRRP on wanedge1 and wanedge2` — eBGP to the CE through the VRRP virtual address, `vrf-target` route targets
- `Generate N hub-and-spoke spoke VRFs on wanedge1` — eBGP with `as-override`, import/export through the hub and spoke communities
- `Generate N hub VRF pairs on wanedge3` — one VRF advertising hub routes to the spokes, one receiving spoke routes

## Services — Layer 2

- `Generate N BGP-VPLS instances on wanedge1, wanedge3 and wanedge4` — virtual switch with one VLAN
- `Generate N Layer 2 circuits on wanedge1` — hot-standby pseudowire toward two remote WAN edges
- `Generate N Layer 2 circuits on wanedge3` — single pseudowire toward one remote WAN edge
- `Generate N local-switching cross-connects on ce1` — two local units switched without a remote PE

## Services — multicast

- `Generate N NG-MVPN VRFs on wanedge1 and wanedge3` — VRF building block with LDP point-to-multipoint provider tunnels and one selective tunnel; wanedge3 is the PIM RP. Access units, global PIM/LDP and MVPN BGP signaling are prerequisites you supply

## Audit / explain

- `Which snippets are validated on wanedge4?`
- `What does an L3VPN VRF with VRRP need on wanedge2?`
- `Explain the hub-and-spoke L3VPN model in this JVD`
- `Explain LFA and BFD in the OSPF core`
- `What does this library not cover?`

---

Don't see what you need? Describe it and the assistant will tell you whether the Enterprise WAN Core and Edge JVD covers it.
