# DEFAULTS — Metro Fabric Broadband Edge

Lab auto-fill values for the Metro Fabric Broadband Edge JVD. Every value is measured from the validated device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks auto-fill; otherwise ask. Variable meanings are in [`_variables.md`](../_variables.md).

## Device inventory

| Role | Device | Platform | OS | `$LOOPBACK_V4` / router-id | `$ASN` |
|------|--------|----------|----|----------------------------|--------|
| Access node | an1_acx7024 | ACX7024 | EVO | 192.168.0.0 | 65001 |
| Access node | an2_acx7100-48l | ACX7100-48L | EVO | 192.168.0.1 | 65001 |
| Access node | an3_acx7100-48l | ACX7100-48L | EVO | 192.168.0.2 | 65001 |
| Access node | an4_acx7100-48l | ACX7100-48L | EVO | 192.168.0.3 | 65001 |
| Access node | an5_acx7100-48l | ACX7100-48L | EVO | 192.168.0.4 | 65001 |
| Aggregation node, route reflector | agn1_acx7100-32c | ACX7100-32C | EVO | 192.168.0.5 | 65001 |
| Aggregation node, route reflector | agn2_acx7100-32c | ACX7100-32C | EVO | 192.168.0.6 | 65001 |
| BNG | bng1_mx304 | MX304 | Junos | 192.168.0.7 | 65001 |
| BNG | bng2_mx204 | MX204 | Junos | 192.168.0.8 | 65001 |
| BNG | bng3_mx10004 | MX10004 | Junos | 192.168.0.9 | 65001 |
| BNG | bng4_mx480 | MX480 | Junos | 192.168.0.10 | 65001 |
| Core router, route reflector | cr1_ptx10004 | PTX10004 | EVO | 192.168.0.11 | 65001 |

IPv6 loopbacks are `2001:db8::192:168:0:<n>` with `<n>` the last IPv4 octet in hexadecimal; bng2 uses `2001:db8::192:1:0:8`. Segment-routing node indices are `1000 + n` (IPv4) and `4000 + n` (IPv6).

## BGP overlay route reflectors

| Device | BGP form | Route reflectors |
|--------|----------|------------------|
| an1–an5 | `evo/protocols/bgp-overlay-an.conf` | agn1 192.168.0.5, agn2 192.168.0.6 |
| bng1, bng2 | `junos/protocols/bgp-overlay-bng-three-rr.conf` | agn1, agn2, cr1 192.168.0.11 |
| bng3, bng4 | `junos/protocols/bgp-overlay-bng-core-rr.conf` | cr1 192.168.0.11 |
| agn1, agn2 | `evo/protocols/bgp-overlay-agn.conf` | reflect for an1–an5 (`GR-IBGP-FABRIC-RR`) and for bng1, bng2 and cr1 (`GR-IBGP-CR`) |
| cr1 | `evo/protocols/bgp-overlay-cr.conf` | reflects for agn1, agn2, bng1 and bng2 (`GR-IBGP-CORE-RR`) and for bng3 and bng4 (`GR-IBGP-CR`) |

## Service examples (first validated instance per device)

| Service form | Device | Example values |
|--------------|--------|----------------|
| EVPN-VPWS, access node end | an1 / an2 | `METRO_BBE_EVPN_VPWS_PPPoE_GROUP_1`, `$AC_IFL` ae1.1031, `$VPWS_SVC_ID_LOCAL` 1, `$VPWS_SVC_ID_REMOTE` 21, `$RT_AS:$RT_ID` 60000:1031, `$RD_SUB_ASSIGNED` 1031 |
| EVPN-VPWS, BNG end | bng1–bng4 | `METRO_BBE_EVPN_VPWS_PPPoE_GROUP_1`, `$AC_IFL` ps0.0, `$VPWS_SVC_ID_LOCAL` 21, `$VPWS_SVC_ID_REMOTE` 1, `$RT_AS:$RT_ID` 60000:1031, `$RD_SUB_ASSIGNED` 1031 |
| EVPN-VPWS flexible cross-connect | an1 / an2 | `METRO_BBE_EVPN_FXC_IPoE-GROUP_1`, `$IFD` ae0, `$UNIT_A` 1065, `$UNIT_B` 1066, `$SVC_ID_LOCAL` 5002, `$SVC_ID_REMOTE` 6002, `$ESI` `00:15:15:15:00:00:00:15:15:15`, `$RT_AS:$RT_ID` 60000:3001 |
| PPPoE pseudowire headend | bng1 | `$IFD` ps0, `$ANCHOR_PIC` lt-0/0/0, `$ESI` `00:10:12:12:12:12:12:00:00:31`, `$DF_PREFERENCE` 1000, `$USER_PREFIX` pwht_pppoe, `$DOMAIN_NAME` example.net |
| DHCP/IPoE pseudowire headend | bng1 | `$IFD` ps11, `$ANCHOR_PIC` lt-0/0/0, `$ESI` `00:10:12:12:12:12:12:00:00:41`, `$DF_PREFERENCE` 1000, `$STATIC_MAC` aa:aa:aa:bb:bb:bb, `$USER_PREFIX` pwht_dhcp |
| Internet VRF | cr1 | `$AC_IFL` et-0/0/26:1.0, `$CE_PEER_V4` 10.11.110.2 (`$ASN_CUSTOMER_V4` 200), `$CE_PEER_V6` 2001:db8::11:11:110:2 (`$ASN_CUSTOMER_V6` 300), RD 192.168.0.11:1 |
| RADIUS VRF | bng1 / cr1 | bng1: lo0 unit 7, RD 192.168.117.117:1117. cr1: `$AC_IFL` et-0/0/20:0.0, lo0 unit 11, RD 111.111.111.111:1111, `vrf-target` 11111:111 |

Per-BNG values for the headend: `$DF_PREFERENCE` is 1000 (bng1), 999 (bng2), 800 (bng3) and 700 (bng4); `$ANCHOR_PIC` is lt-2/0/0 on bng4 and lt-0/0/0 on the others. The BNGs share the RADIUS server 192.0.2.2.

## Numbering conventions (hold on every measured instance)

| Service form | Convention |
|--------------|------------|
| EVPN-VPWS (both ends) | `$RT_AS` = 60000 and `$RT_ID` = `$RD_SUB_ASSIGNED`. All four BNGs carry the same instance name and `ps<N>.0` attachment for a given pseudowire group. |
| EVPN-VPWS, access node end | The unit of `$AC_IFL` = `$RT_ID`; `$VPWS_SVC_ID_REMOTE` = `$VPWS_SVC_ID_LOCAL` + 20. The BNG end swaps the two service IDs. |
| EVPN-VPWS flexible cross-connect | `$RT_ID` = `$RD_SUB_ASSIGNED`; `$SVC_ID_REMOTE` = `$SVC_ID_LOCAL` + 1000; `$UNIT_B` = `$UNIT_A` + 1. |
| Route distinguishers | `$RD_SUB_ADMIN` is fixed per device and is not the loopback: an1–an5 use 100.100.100.100 … 104.104.104.104; bng1–bng4 use 192.168.107.107 … 192.168.110.110 for EVPN-VPWS. |

For `N` services, auto-fill increments the per-service number from the example's starting value and keeps the conventions above. Keep a pseudowire's access-node and BNG ends consistent: same instance name, route target and the swapped service-ID pair.
