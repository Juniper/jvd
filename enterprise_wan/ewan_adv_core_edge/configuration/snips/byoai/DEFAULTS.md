# DEFAULTS — Enterprise WAN Advanced Core and Edge Services

Lab auto-fill values for the Enterprise WAN Advanced Core and Edge Services JVD. Every value is measured from the published device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks auto-fill; otherwise ask. Variable meanings are in [`_variables.md`](../_variables.md).

## Device inventory

| Role | Device | Platform | OS | `$LOOPBACK_V4` / router-id | `$ASN` |
|------|--------|----------|----|----------------------------|--------|
| WAN Edge (PE) | wanedge1_mx304 | MX304 | Junos | 2.2.2.2 | 64512 |
| WAN Edge (PE) | wanedge2_mx10004 | MX10004 | Junos | 5.5.5.5 | 64512 |
| WAN Edge (PE) | wanedge3_acx7509 | ACX7509 | EVO | 4.4.4.4 | 64512 |
| WAN Edge (PE) | wanedge4_acx7100-48l | ACX7100-48L | EVO | 7.7.7.7 | 64512 |
| Core / P router | p1_ptx10003 | PTX10003 | EVO | 3.3.3.3 | 64512 |
| Core / P router | p2_ptx10001-36mr | PTX10001-36MR | EVO | 6.6.6.6 | 64512 |
| L2-mode helper switch | ce1_acx7100-48l | ACX7100-48L | EVO | — | — |
| L2-mode helper switch | ce4_mx480 | MX480 | Junos | — | — |

## BGP overlay

| Device | BGP form | Peers |
|--------|----------|-------|
| wanedge1 | `junos/protocols/bgp-overlay-pe-advertise-external-flow-evpn-multipath.conf` | 3.3.3.3, 6.6.6.6 |
| wanedge2 | `junos/protocols/bgp-overlay-pe-flow-evpn-route-target-multipath.conf` | 3.3.3.3, 6.6.6.6 |
| wanedge3, wanedge4 | `evo/protocols/bgp-overlay-pe-flow-evpn-route-target.conf` | 3.3.3.3, 6.6.6.6 |
| p1 | `evo/protocols/bgp-overlay-rr-cluster-evpn.conf` | 2.2.2.2, 5.5.5.5, 4.4.4.4, 7.7.7.7 |
| p2 | `evo/protocols/bgp-overlay-rr-cluster-evpn-route-target-multipath.conf` | 2.2.2.2, 4.4.4.4, 5.5.5.5, 7.7.7.7 |

## Service examples (first measured instance)

| Service form | Device | Example values |
|--------------|--------|----------------|
| EVPN-VPWS | wanedge1–wanedge4 | `vpws_group_50_1`, `$AC_IFL` ae0.1, `$RD_SUB_ADMIN` 22.22.22.22 / 55.55.55.55 / 44.44.44.44 / 77.77.77.77, `$RD_SUB_ASSIGNED` 1, `vrf-target` 64512:1; `$VPWS_SVC_ID_LOCAL` / `$VPWS_SVC_ID_REMOTE` 1 / 2 on wanedge1 and wanedge2, 2 / 1 on wanedge3 and wanedge4 |
| EVPN flexible cross-connect | wanedge1–wanedge4 | `vfxc_group_40_1001`, `$AC_IFL_A` ae0.1001, `$AC_IFL_B` ae0.1002, `$RD_SUB_ASSIGNED` 1001, `vrf-target` 65000:1001; per-device RD administrator as for EVPN-VPWS |
| EVPN-ELAN, two attachment circuits | wanedge1–wanedge4 | `elan_group_500_2001`, `$AC_IFL_A` ae0.2001, `$AC_IFL_B` ae0.2002, `$RD_SUB_ASSIGNED` 2001, `vrf-target` 62525:2001; EVO `$BD_NAME` mvbundle_2001 |
| EVPN-ELAN, one attachment circuit | wanedge1–wanedge4 | `emh_group_200_1701`, `$AC_IFL` ae0.1701, `$RD_SUB_ASSIGNED` 1701, `vrf-target` 61515:1701; EVO `$BD_NAME` mvbased_1701, `$VLAN_BD` 1701 |
| EVPN-ELAN with an IRB gateway | wanedge1–wanedge4 | `emh_group_400_1851`, `$AC_IFL` ae0.1851, `$IRB_UNIT` irb.1851, `$RD_SUB_ASSIGNED` 1851, `vrf-target` 60525:1851; EVO `$BD_NAME` mvbased_1851, `$VLAN_BD` 1851 |
| EVPN Type 5 VRF | wanedge1, wanedge4 | `evpn_100`, `$IRB_UNIT` irb.100, `$ROUTER_ID` 2.2.2.2, RD 60202:100 (wanedge1) and 64545:100 (wanedge4), `vrf-target` 60303:100 |
| EVPN Type 5 VRF | wanedge2, wanedge3 | `evpn_1851`, `$IRB_UNIT` irb.1851, `$ROUTER_ID` 5.5.5.5 (wanedge2), 4.4.4.4 (wanedge3), RD 62323:1851 (wanedge2) and 63434:1851 (wanedge3), `vrf-target` 60555:1851 |

## Numbering conventions (hold on every measured instance)

| Service form | Convention |
|--------------|------------|
| All EVPN services | `$RT_ID` = `$RD_SUB_ASSIGNED`. |
| EVPN-VPWS, flexible cross-connect, EVPN-ELAN | `$RD_SUB_ADMIN` is the WAN edge loopback or its per-device address (22.22.22.22, 55.55.55.55, 44.44.44.44, 77.77.77.77), by service group. |
| EVPN Type 5 VRF | `$RD_SUB_ADMIN` is an AS number. |

For `N` services, auto-fill increments the per-service number from the example's starting value and keeps the conventions above. Keep the WAN edges of a service consistent: same instance name and route target; for EVPN-VPWS and flexible cross-connect, the two ends swap the local and remote VPWS service identifiers.
