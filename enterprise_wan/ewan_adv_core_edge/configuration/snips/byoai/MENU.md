# Enterprise WAN Advanced Core and Edge Services BYOAI — Full Query Menu

The always-current catalog of generation asks for the Enterprise WAN Advanced Core and Edge Services JVD. Replace `N` with any count (e.g. `Generate 3 …`). Every service renders on the devices it is validated on, in the `minimum` form: the service construct only, on a device that already runs its prerequisites (attachment units, BGP overlay and transport).

## Services — E-Line

- `Generate N EVPN-VPWS services on wanedge1 and wanedge3` — one attachment circuit per instance, control word, local and remote VPWS service identifiers
- `Generate N EVPN flexible cross-connect services on wanedge2 and wanedge4` — VLAN-aware, two attachment circuits per instance

## Services — E-LAN

- `Generate N EVPN-ELAN services with two attachment circuits on wanedge1 and wanedge3` — Junos EVPN instance, EVO VLAN-bundle MAC-VRF
- `Generate N EVPN-ELAN services with one attachment circuit on wanedge2 and wanedge4` — Junos EVPN instance, EVO VLAN-based MAC-VRF
- `Generate N EVPN-ELAN services with an IRB gateway on wanedge1 and wanedge4` — IRB unit as the layer 3 gateway

## Services — L3VPN

- `Generate N EVPN Type 5 VRFs on wanedge3 and wanedge4` — IP-prefix routes with MPLS encapsulation, `vrf-target` route targets

## Audit / explain

- `Which snippets are validated on wanedge2?`
- `What does an EVPN-VPWS service need on wanedge4?`
- `Explain the EVPN-VPWS and flexible cross-connect services in this JVD`
- `Explain post-convergence LFA and the SR mapping server in the OSPF core`
- `What does this library not cover?`

---

Don't see what you need? Describe it and the assistant will tell you whether the Enterprise WAN Advanced Core and Edge Services JVD covers it.
