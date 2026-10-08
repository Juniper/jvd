# BBE BYOAI — Full Query Menu

The always-current catalog of generation asks for the Metro Fabric Broadband Edge JVD. Replace `N` with any count (e.g. `Generate 3 …`). Every service renders on the devices it is validated on, in the `minimum` form: the service construct only, on a device that already runs its prerequisites (attachment interfaces, BGP overlay, and for a BNG the subscriber-management baseline).

## Services — pseudowire transport (access node ↔ BNG)

- `Generate N EVPN-VPWS pseudowires on an1 and bng1` — the access-node end (vlan-ccc unit on the access aggregate) and the BNG end (pseudowire-subscriber unit 0)
- `Generate N EVPN-VPWS flexible cross-connect groups on an1` — two vlan-ccc units bundled under one FXC group with a single-active ESI

## Services — subscriber termination (BNG)

- `Generate N PPPoE pseudowire-headend interfaces on bng1` — pseudowire-subscriber device with stacked-VLAN auto-configuration for PPPoE
- `Generate N DHCP/IPoE pseudowire-headend interfaces on bng1` — pseudowire-subscriber device with stacked-VLAN auto-configuration for DHCP/IPoE

## Services — L3 VRFs

- `Generate the Internet VRF on cr1` — default-route origination and eBGP to the upstream CE
- `Generate the RADIUS VRF on bng1 or cr1` — BNG loopback form or core-router OSPF form

## Audit / explain

- `Which snippets are validated on bng3?`
- `What does a PPPoE pseudowire-headend interface need on bng1?`
- `Explain the EVPN-VPWS pseudowire headend termination between access node and BNG`
- `Explain Stateless Rapid Reconnect BNG redundancy`
- `What does this library not cover?`

---

Don't see what you need? Describe it and the assistant will tell you whether the Metro Fabric Broadband Edge JVD covers it.
