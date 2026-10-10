# EWAN Finance BYOAI — Full Query Menu

The always-current catalog of generation asks for the Enterprise WAN for Finance & Stock Exchange JVD. Replace `N` with any count (e.g. `Generate 3 …`). Every service renders on the devices it is validated on, in the `minimum` form: the service construct only, on a device that already runs its prerequisites (attachment interfaces, VRF loopback units, export policies and the iBGP mesh).

## Services — multicast market data (NG-MVPN)

- `Generate N NG-MVPN sender VRFs on wanedge1` — SPT-only sender site with hot-root standby and the local anycast RP, attached through the EVPN IRB
- `Generate N NG-MVPN receiver VRFs on ap1` — SPT-only receiver toward both customer routers with a static RP

## Services — unicast order entry (L3VPN)

- `Generate N L3VPN VRFs on wanedge1` — eBGP to the customer over the EVPN IRB
- `Generate N L3VPN VRFs on ap1` — eBGP to both customer routers

## Services — Layer 2 redundancy (EVPN)

- `Generate N EVPN virtual switches on wanedge1` — one bridge domain on a single-active ESI unit with an IRB

## Services — customer router (virtual router)

- `Generate N multicast virtual routers on cr1` — eBGP to both access points with MED steering and PIM sparse mode
- `Generate N unicast virtual routers on cr2` — eBGP to both access points with MED steering

## Audit / explain

- `Which snippets are validated on p1?`
- `What does an NG-MVPN sender VRF need on wanedge2?`
- `Explain SPT-only NG-MVPN with hot-root standby in this JVD`
- `Explain the single-active ESI between the WAN edges and the L2/L3 edge`
- `What does this library not cover?`

---

Don't see what you need? Describe it and the assistant will tell you whether the Enterprise WAN for Finance & Stock Exchange JVD covers it.
