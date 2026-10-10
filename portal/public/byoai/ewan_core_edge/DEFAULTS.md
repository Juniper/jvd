# DEFAULTS — Enterprise WAN Core and Edge

Lab auto-fill values for the Enterprise WAN Core and Edge JVD. Every value is measured from the published device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks auto-fill; otherwise ask. Variable meanings are in [`_variables.md`](../_variables.md).

## Device inventory

| Role | Device | Platform | OS | `$LOOPBACK_V4` / router-id | `$ASN` |
|------|--------|----------|----|----------------------------|--------|
| WAN Edge (PE) | wanedge1_mx304 | MX304 | Junos | 10.10.0.12 | 64512 |
| WAN Edge (PE) | wanedge2_mx10008 | MX10008 | Junos | 192.168.0.15 | 64512 |
| WAN Edge (PE) | wanedge3_acx7509 | ACX7509 | EVO | 192.168.0.14 | 64512 |
| WAN Edge (PE) | wanedge4_acx7100-48l | ACX7100-48L | EVO | 192.168.0.16 | 64512 |
| Core / P Router | p1_ptx10003 | PTX10003 | EVO | 1.1.1.8 | 64512 |
| Core / P Router | p2_ptx10001-36mr | PTX10001-36MR | EVO | 6.6.6.6 | 64512 |
| L2/L3 Edge (CE) | ce1_acx7100-48l | ACX7100-48L | EVO | — | — |
| L2/L3 Edge (CE) | ce2_mx480 | MX480 | Junos | — | 64520 |

## BGP overlay

| Device | BGP form | Peers |
|--------|----------|-------|
| wanedge1, wanedge3 | `{junos,evo}/protocols/bgp-overlay-pe-labeled-unicast.conf` | 192.168.0.17, 192.168.0.11 |
| wanedge2 | `junos/protocols/bgp-overlay-pe.conf` | 192.168.0.17, 192.168.0.11 |
| wanedge4 | `evo/protocols/bgp-overlay-pe-local-as.conf` | 192.168.0.17, 192.168.0.11 |
| p1, p2 | not modelled | route-reflector peering toward 2.2.2.2, 4.4.4.4, 5.5.5.5, 7.7.7.7 does not correspond to this JVD's WAN edges |

## Service examples (measured instances)

| Service form | Device | Example values |
|--------------|--------|----------------|
| L3VPN with VRRP | wanedge1 / wanedge2 | `l3vpn_vrrp_3001_3001`, `$AC_IFL` xe-0/0/15:1.3001 / xe-3/1/12.3001, `$BGP_GROUP` CE1, `$CE_PEER_V4` 10.45.0.3, `$PE_LOCAL_V4` 10.45.0.4 (the VRRP virtual address), `$ASN_CUSTOMER` 64510, `vrf-target` 64510:3001, RD `<loopback>:3001`; unit priority 250 on wanedge1, 150 on wanedge2 |
| L3VPN with VRRP | wanedge3 / wanedge4 | `l3vpn_vrrp_3001_3001`, `$AC_IFL` et-1/0/12.3001 / et-0/0/51:0.3001, `$BGP_GROUP` CE2, `$CE_PEER_V4` 10.75.0.3, `$PE_LOCAL_V4` 10.75.0.4, `$ASN_CUSTOMER` 64520, `vrf-target` 64510:3001 |
| L3VPN hub-and-spoke, spoke | wanedge1 / wanedge2 | `l3vpn_Spoke_1_1` / `l3vpn_Spoke_2_1`, `$AC_IFL` xe-0/0/15:0.4001 / xe-3/1/10.4001, `$BGP_GROUP` v4spirent, `$CE_PEER_V4` 10.40.0.1 / 10.50.0.1, `$ASN_CUSTOMER` 64510, `$IMPORT_POL` hub_1, `$EXPORT_POL` spoke_1, RD `<loopback>:4001` |
| L3VPN hub-and-spoke, hub | wanedge3 | advertise: `Hub_Adv_To_Spokes_1001` on et-1/0/12.2001, import `spoke_1`, export `null`; receive: `Spokes_Adv_To_Hub_1001` on et-1/0/12.1001, import `null`, export `hub_1`; `$BGP_GROUP` CE2, `$ASN_CUSTOMER` 64520 |
| BGP-VPLS | wanedge1 / wanedge3 / wanedge4 | `vpls_group_101_<n>`, `$AC_IFL` ae1.<n>, `$VLAN` <n>, `$VC_ID` <n>, `$VPLS_SITE` 101 / 103 / 104, `$VPLS_SITE_ID` 1001 / 1003 / 1004, RD 2222 / 4444 / 7777 : `10<n>`-style, `vrf-target` 64512:<RD assigned> |
| Layer 2 circuit, hot standby | wanedge1 / wanedge2 | `$AC_IFL` ae1.1501 / ae1.1001, `$VC_ID` = unit, `$PRIMARY_LOOPBACK` 192.168.0.14, `$BACKUP_LOOPBACK` 192.168.0.16 |
| Layer 2 circuit | wanedge3 / wanedge4 | `$AC_IFL` ae1.1001, `$VC_ID` 1001, `$REMOTE_PE_V4` 192.168.0.15 |
| NG-MVPN | wanedge1–wanedge4 | `vpn-mcast_<n>`, `$AC_IFL` <access port>.<n>, lo0 unit <n>, `$LOOPBACK_VRF_V4` 10.11.11.<n> / 10.22.22.<n> / 10.33.33.<n> / 10.44.44.<n>, `$PIM_RP_V4` 10.33.33.<n> (wanedge3 is the RP), `$MCAST_GROUP_V4_PFX` 227.1.1.<n>/32, `$MCAST_SOURCE_V4_PFX` 124.1.<n>.1/32, `vrf-target` 1:<n> |
| Local switching | ce1 / ce2 | `$AC_IFL_A` ae1.1501 / et-2/1/4:0.1, `$AC_IFL_B` et-0/0/44.1501 / xe-2/0/0:0.1 |

## Numbering conventions (hold on every measured instance)

| Service form | Convention |
|--------------|------------|
| L3VPN (all forms) | RD administrator = the WAN edge loopback (`$LOOPBACK_V4`); the VRRP VRF router-id is the same loopback. |
| BGP-VPLS | `$RT_ID` = `$RD_SUB_ASSIGNED`; `$RD_SUB_ADMIN` is fixed per device (2222, 4444, 7777) and is not the loopback. |
| NG-MVPN | RD administrator = the VRF loopback `lo0.<n>` address; the PIM group range equals the selective-tunnel group. |

For `N` services, auto-fill increments the per-service number from the example's starting value and keeps the conventions above. Keep the two WAN edges of a service consistent: same instance name and route target; for VRRP the same virtual address with different priorities.
