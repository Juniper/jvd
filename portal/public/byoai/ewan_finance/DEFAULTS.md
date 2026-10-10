# DEFAULTS — Enterprise WAN for Finance & Stock Exchange

Lab auto-fill values for the Enterprise WAN for Finance & Stock Exchange JVD. Every value is measured from the validated device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks auto-fill; otherwise ask. Variable meanings are in [`_variables.md`](../_variables.md).

## Device inventory

| Role | Device | Platform | OS | `$LOOPBACK_V4` / router-id | `$ASN` |
|------|--------|----------|----|----------------------------|--------|
| WAN Edge | wanedge1_mx304 | MX304 | Junos | 10.200.50.12 | 64512 |
| WAN Edge | wanedge2_mx10004 | MX10004 | Junos | 10.200.50.15 | 64512 |
| Access Point | ap1_mx304 | MX304 | Junos | 10.200.50.14 | 64512 |
| Access Point | ap2_mx10004 | MX10004 | Junos | 10.200.50.16 | 64512 |
| Provider (P) | p1_ptx10003-80c | PTX10003-80C | EVO | 10.200.50.13 | 64512 |
| Provider (P) | p2_ptx10001-36mr | PTX10001-36MR | EVO | 10.200.50.11 | 64512 |
| Customer Router | cr1_acx7100-48l | ACX7100-48L | EVO | 10.200.50.9 | 64520 |
| Customer Router | cr2_mx480 | MX480 | Junos | 10.200.50.18 | 64521 |
| L2/L3 Edge | l2-l3_edge_acx7100 | ACX7100 | EVO | 10.255.163.58 (router-id only) | — |

The six provider devices (WAN edges, access points, P routers) run one iBGP full mesh (`protocols/bgp-ibgp-full-mesh-5.conf`) between their loopbacks in AS 64512, over OSPF area 0 with RSVP-TE.

## Service examples (first validated instance per device)

| Service form | Device | Example values |
|--------------|--------|----------------|
| NG-MVPN sender VRF | wanedge1 / wanedge2 | `MVPN_INSTANCE1`, `irb.1`, `lo0.1`, `$PE_LOCAL_V4` 172.16.1.1, `$CE_PEER_V4` 172.16.1.2 (`$ASN_CUSTOMER` 64513), RP 10.10.47.101, group range 225.0.0.0/22, `vrf-target` 64512:11, MVPN target 64512:101, RD `<loopback>`:61 |
| NG-MVPN receiver VRF | ap1 | `MVPN_INSTANCE2`, `$AC_IFL_1` et-0/0/6.2, `$AC_IFL_2` et-0/0/11.2, `lo0.2`, CE peers 10.101.48.6 (AS 64520) and 10.101.49.6 (AS 64521), static RP 10.10.47.102, group range 225.0.4.0/22 |
| NG-MVPN receiver VRF | ap2 | `MVPN_INSTANCE1`, `$AC_IFL_1` et-0/0/2.1, `$AC_IFL_2` et-0/4/3.1, CE peers 10.101.78.2 (AS 64520) and 10.101.79.2 (AS 64521) |
| L3VPN VRF over IRB | wanedge1 / wanedge2 | `VRF21`, `irb.21`, `$PE_LOCAL_V4` 172.16.21.1, `$CE_PEER_V4` 172.16.21.2 (AS 64513), `vrf-target` 64512:21, RD `<loopback>`:221 |
| L3VPN VRF to two customer routers | ap1 | `VRF21`, et-0/0/6.21 and et-0/0/11.21, CE peers 10.101.48.42 (AS 64520) and 10.101.49.42 (AS 64521) |
| EVPN virtual switch | wanedge1 / wanedge2 | `EVPN_ESI_LAG1`, bridge domain `BD_EVPN_GROUP1`, VLAN 1, `$AC_IFL` ae0.1, `irb.1`, `vrf-target` 61535:1, RD `<loopback>`:1 |
| Virtual router (multicast) | cr1 | `VIRTUAL-ROUTER-V1`, et-0/0/42.1 / et-0/0/48.1 / et-0/0/49.1, eBGP to 10.101.48.1 and 10.101.78.1 (AS 64512), iBGP host 10.101.81.2, static RP 10.10.47.101, group range 225.0.0.0/22 |
| Virtual router (multicast) | cr2 | `VIRTUAL-ROUTER-V1`, et-5/0/0.1 / et-5/0/1.1 / xe-3/0/6.1, eBGP to 10.101.49.1 and 10.101.79.1 (AS 64512), iBGP host 10.101.91.2 |
| Virtual router (unicast) | cr1 / cr2 | `VIRTUAL-ROUTER-V21`, iBGP host 10.8.21.2 (cr1) / 10.9.21.2 (cr2) |

## Numbering conventions (hold on every measured instance)

- **NG-MVPN instance `n` (1–10)** on all four PEs: `MVPN_INSTANCE<n>`; `vrf-target` 64512:`10+n`; MVPN `route-target` 64512:`100+n`; RD `<loopback>`:`60+n`; RP 10.10.47.`100+n`; group range 225.0.`4(n-1)`.0/22; VRF loopback unit `n` and, on the WAN edges, IRB unit `n`.
- **L3VPN `VRF2x` (21–23)** on all four PEs: `vrf-target` 64512:`2x`; RD `<loopback>`:`22x`; IRB unit `2x` on the WAN edges.
- **EVPN virtual switch `EVPN_ESI_LAG<n>`** (1–10, 21–23) on both WAN edges: VLAN `n`, attachment `ae0.<n>`, `irb.<n>`, `vrf-target` 61535:`n`, RD `<loopback>`:`n`. Bridge domains are `BD_EVPN_GROUP<n>` for 1–10; instances 21–23 use the name `BD_EVPN_GROUP1`.
- **Customer-router virtual routers** `VIRTUAL-ROUTER-V<n>` use unit `n` on all three interfaces; the virtual routers with PIM (1–10) use RP 10.10.47.`100+n` and group range 225.0.`4(n-1)`.0/22.
- PE-CE links use one /30 per instance from 10.101.48.x (ap1–cr1), 10.101.49.x (ap1–cr2), 10.101.78.x (ap2–cr1) and 10.101.79.x (ap2–cr2); the access point holds the first host address.
- Both WAN edges configure the same IRB address and MAC for a given unit, and the same anycast RP address on the VRF loopback unit.
