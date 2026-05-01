# Snippet variable glossary

All `.conf` files under `junos/` and `evo/` are templates: identifiers
that vary between deployments are written as `$VAR`. Render with the
same `snips_render.py` tool used elsewhere in the JVD repo.

Constants left as literals on purpose:
- Apply-group / policy / community names (PS-ISIS-EXPORT, PS-PPLB,
  PS-RADIUS-COMM, etc.) — they ARE the abstraction.
- Forwarding-class names, scheduler-map names — JVD-wide.
- Pool / dynamic-profile names (`pppv4-pool`, `auto-stacked-pwht`,
  `prod-dhcp-base`, …) — wired by the BNG runtime by name.
- All `$junos-*` placeholders inside dynamic-profiles — runtime-resolved
  by smg-service, NOT user-templatable.

## Identity / topology

| Variable | Meaning | Example | Used in |
|---|---|---|---|
| `$ROUTER_ID` | Device router-id (== lo0.0 IPv4) | `192.168.0.7` | transport/* |
| `$LOCAL_AS` | iBGP / overlay AS | `65001` | transport/* |
| `$LOOPBACK_V4` | This PE's lo0.0 IPv4 | `192.168.0.7` | transport/*, policy/* |
| `$LOOPBACK_V6` | This PE's lo0.0 IPv6 | `2001:db8::192:168:0:7` | policy/* |
| `$NODE_SID_V4` | ISIS-SR IPv4 node-segment index (1000+lastoctet in this JVD) | `1007` | policy/isis-export-prefix-segment.conf |
| `$NODE_SID_V6` | ISIS-SR IPv6 node-segment index (4000+lastoctet) | `4007` | policy/isis-export-prefix-segment.conf |
| `$SRGB_START` / `$SRGB_END` | MPLS SRGB label range | `800000` / `890000` | transport/mpls-segment-routing.conf |

## Neighbours / route reflectors

| Variable | Meaning | Example | Used in |
|---|---|---|---|
| `$RR_AGN1_V4` / `$RR_AGN2_V4` | Fabric (AGN) RR loopbacks | `192.168.0.5` / `192.168.0.6` | transport/bgp-overlay-* |
| `$RR_CR_V4` | Core (CR) RR loopback | `192.168.0.11` | transport/bgp-overlay-pe-bng.conf |
| `$AN1_V4`..`$AN5_V4` | Access-node loopbacks (RR clients) | `192.168.0.0`..`192.168.0.4` | transport/bgp-overlay-rr-fabric.conf |
| `$BNG1_V4`..`$BNG4_V4` | BNG loopbacks (RR clients) | `192.168.0.7`..`192.168.0.10` | transport/bgp-overlay-rr-* |
| `$AGN1_V4` / `$AGN2_V4` | Aggregation-node loopbacks (cr1 view) | `192.168.0.5` / `192.168.0.6` | transport/bgp-overlay-rr-core.conf |
| `$CR_V4` | Core RR loopback (AGN view) | `192.168.0.11` | transport/bgp-overlay-rr-fabric.conf |
| `$CE_PEER_V4` / `$CE_PEER_V6` | Internet eBGP peer addresses | `10.11.110.2` / `2001:db8::11:11:110:2` | services/l3vpn-internet.conf |
| `$CE_AS_V4` / `$CE_AS_V6` | Internet eBGP peer AS numbers | `200` / `300` | services/l3vpn-internet.conf |

## Interfaces (underlay)

| Variable | Meaning | Example | Used in |
|---|---|---|---|
| `$CORE_INTF` | Core-facing IS-IS unit | `et-0/0/2.0` | transport/isis-srmpls-tilfa.conf |
| `$CORE_PHYS` | Core-facing physical interface | `et-0/0/2` | interfaces/core-isis-mpls.conf |
| `$CORE_DESC` | JVD-style link description | `R7-BNG1-To-R6-AGN2` | interfaces/core-isis-mpls.conf |
| `$CORE_V4` / `$CORE_V6` | Underlay link addresses | `10.10.67.2/24` / `2001:db8::10:10:67:1:2/120` | interfaces/core-isis-mpls.conf |
| `$ISIS_LEVEL` | ISIS level on this interface | `1` (or `2` on cr1's L2 links) | transport/isis-srmpls-tilfa.conf |
| `$L2_KNOB` | `level 2` mode | `disable` (or `wide-metrics-only` on cr1) | transport/isis-srmpls-tilfa.conf |
| `$EXPORT_POLICY` | ISIS export policy reference | `PS-ISIS-EXPORT` (or `[ PS-ISIS-EXPORT stop_leak ]` on cr1) | transport/isis-srmpls-tilfa.conf |
| `$V6_VRF_RIB` | VRF v6 rib leaked into inet6.0 | `PPPOE_SUBS_1.inet6.0` | transport/routing-options-pe.conf |

## Interfaces (subscriber & access)

| Variable | Meaning | Example | Used in |
|---|---|---|---|
| `$PS_DEV` | Pseudowire-headend ifd | `ps0`, `ps11` | interfaces/ps-pseudowire-* |
| `$PS_AC` | psN.0 attachment-circuit unit | `ps1.0`, `ps11.0`, `ps31.0` | services/evpn-vpws-*-bng.conf |
| `$ANCHOR_LT` | logical-tunnel anchor | `lt-0/0/0` | interfaces/ps-pseudowire-* |
| `$DYN_PROFILE` | Dynamic-profile invoked by auto-configure | `auto-stacked-pwht`, `auto-stacked-pwht_dhcp` | interfaces/ps-pseudowire-* |
| `$ESI_VALUE` | Per-ps ESI for EVPN multihoming | `00:10:12:12:12:12:12:00:00:31` | interfaces/ps-pseudowire-* |
| `$DF_PREFERENCE` | df-election-type preference value | `1000` (preferred) / `995` (backup) | interfaces/ps-pseudowire-* |
| `$STATIC_MAC` | Override MAC on ps interface (DHCP) | `aa:aa:aa:bb:bb:bb` | interfaces/ps-pseudowire-dhcp-ipoe.conf |
| `$MTU` | ps interface MTU | `2022` | interfaces/ps-pseudowire-* |
| `$AC_INTF` | AN-side EVPN-VPWS attachment-circuit unit | `ae1.1041` | services/evpn-vpws-an.conf |
| `$AC1` / `$AC2` | FXC bundle members on the AN | `ae0.1061` / `ae0.1062` | services/evpn-vpws-fxc-an.conf |
| `$LAG`, `$LAG_FXC`, `$LAG_PERSUB` | Aggregated-Ethernet device names | `ae0`, `ae1` | interfaces/ae-vlan-bridge-* |
| `$LAG_VLAN_UNIT` / `$LAG_VLAN_ID` | per-subscriber VLAN unit/id | `1031` / `1031` | interfaces/ae-vlan-bridge-fxc-sw.conf |
| `$CPE_PORT` | sw1/sw2 CPE-facing breakout port | `xe-0/0/0:3` | interfaces/ae-vlan-bridge-fxc-sw.conf |
| `$BD_NAME` | sw1/sw2 bridge-domain name | `bd_group_1031` | interfaces/ae-vlan-bridge-fxc-sw.conf |
| `$FXC_VLAN_UNIT` | AN FXC LAG unit/vlan | `1061` | interfaces/ae-vlan-bridge-an.conf |
| `$PERSUB_VLAN_UNIT` | AN per-subscriber LAG unit/vlan | `1031` | interfaces/ae-vlan-bridge-an.conf |
| `$FXC_ESI` | Shared LAG-level ESI for FXC | `00:15:15:15:00:00:00:15:15:15` | interfaces/ae-vlan-bridge-an.conf, services/evpn-vpws-fxc-an.conf |
| `$PERSUB_ESI_VALUE` | Per-unit ESI for per-subscriber EVPN-VPWS | `00:10:11:11:11:11:11:00:00:31` | interfaces/ae-vlan-bridge-an.conf |
| `$LACP_SYSID_FXC` / `$LACP_SYSID_PERSUB` | LACP system-id overrides on AN LAGs | `00:00:00:00:01:01` / `00:00:00:00:02:02` | interfaces/ae-vlan-bridge-an.conf |

## Services (EVPN-VPWS / L3VPN)

| Variable | Meaning | Example | Used in |
|---|---|---|---|
| `$INSTANCE_NAME` | routing-instance name | `METRO_BBE_EVPN_VPWS_PPPoE_GROUP_1` | services/evpn-vpws-* |
| `$VRF_NAME` | L3VPN routing-instance name | `PPPOE_SUBS_1`, `dhcp-subs` | services/l3vpn-* |
| `$RD_LOOPBACK_V4` | Loopback used as RD-prefix | `192.168.107.107` (BNG-side), `100.100.100.100` (AN-side) | services/* |
| `$RD_ID` | RD tail integer | `1031` | services/* |
| `$RT_AS` / `$RT_ID` | Route-target AS:ID pair | `60000`:`1031` | services/evpn-vpws-* |
| `$VPWS_LOCAL_ID` / `$VPWS_REMOTE_ID` | EVPN-VPWS service-id pair | `21` / `1` | services/evpn-vpws-* |
| `$SVC_LOCAL` / `$SVC_REMOTE` | FXC group service-id pair | `5001` / `6001` | services/evpn-vpws-fxc-an.conf |
| `$LO_UNIT` | VRF loopback unit | `lo0.1`, `lo0.7`, `lo0.11`, `lo0.313` | services/l3vpn-* |
| `$VRF_IMPORT_POL` / `$VRF_EXPORT_POL` | Per-VRF import/export policy refs | `PS-PPPOE-SUBS-1-VRF-IMPORT` / `-EXPORT` | services/l3vpn-* |
| `$V4_AGGREGATE` / `$V6_AGGREGATE` | Subscriber-pool aggregate prefixes | `10.25.0.0/16` / `fc00:25:140::/48` | services/l3vpn-pppoe-subs.conf |
| `$V4_POOL` / `$V6_POOL` | DHCP pool names | `dhcp_v4_pool` / `dhcp_v6_pool` | services/l3vpn-dhcp-subs.conf |
| `$V4_NETWORK` | DHCP v4 pool network | `10.42.0.0/16` | services/l3vpn-dhcp-subs.conf |
| `$V4_RANGE_LOW` / `$V4_RANGE_HIGH` | DHCP v4 lease range | `10.42.0.2` / `10.42.255.254` | services/l3vpn-dhcp-subs.conf |
| `$V4_GATEWAY` | DHCP server-identifier + router option | `10.42.0.1` | services/l3vpn-dhcp-subs.conf |
| `$V6_PREFIX` | DHCPv6 pool prefix | `fc00:125:140::/64` | services/l3vpn-dhcp-subs.conf |
| `$V6_RANGE_LOW` / `$V6_RANGE_HIGH` | DHCPv6 range | `fc00:125:140::2/128` / `fc00:125:140::ffff/128` | services/l3vpn-dhcp-subs.conf |
| `$LEASE_TIME` | dhcp-attributes maximum-lease-time (s) | `600` | services/l3vpn-dhcp-subs.conf |
| `$V6_RIB` | rib for IPv6 aggregate inside VRF | `PPPOE_SUBS_1.inet6.0` | services/l3vpn-pppoe-subs.conf |
| `$V4_POOL_NETWORK` / `$V6_POOL_PREFIX` | PPPoE pool prefixes | `10.25.0.0/16` / `fc00:25:140::/48` | services/l3vpn-pppoe-subs.conf, subscriber-management/address-assignment-pools.conf |
| `$AUTH_PROFILE` | RADIUS access-profile reference | `vlan-auth-access1` | interfaces/ps-pseudowire-*, services/l3vpn-dhcp-subs.conf |
| `$RADIUS_INTF` | RADIUS-VRF interface on cr1 | `et-0/0/20:0.0` | services/l3vpn-radius.conf |
| `$CE_INTF` | VRF_Internet eBGP interface | `et-0/0/26:1.0` | services/l3vpn-internet.conf |

## Chassis / boot / subscriber-management

| Variable | Meaning | Example | Used in |
|---|---|---|---|
| `$PS_DEVICE_COUNT` | chassis pseudowire-service device-count | `100` | bootstrap/chassis-bng.conf |
| `$TS_FPC` / `$TS_PIC` / `$TS_BW` | tunnel-services FPC/PIC/bandwidth | `0` / `0` / `100g` | bootstrap/chassis-bng.conf |
| `$NAS_ID` | RADIUS NAS-Identifier | `R7-BNG1` | subscriber-management/access-profile-radius.conf |
| `$RADIUS_SERVER_V4` | RADIUS server address | `10.189.189.2` | subscriber-management/* |
| `$RADIUS_PORT` | RADIUS server UDP port | `1812` | subscriber-management/radius-server.conf |
| `$RADIUS_SECRET` / `$RADIUS_SECRET_AUTH` / `$RADIUS_SECRET_ACCT` | Encrypted RADIUS secrets | `$9$...` (Junos type-9) | subscriber-management/* |
| `$RADIUS_SOURCE_V4` | RADIUS source-address (in RADIUS VRF) | `192.168.17.17` | subscriber-management/* |
| `$AUTOCONF_BW` / `$AUTOCONF_BURST` | ddos-protection autoconf rate-limits | `20000` / `20000` | subscriber-management/system-services-subscriber-mgmt.conf |
| `$PPPOE_PADSE_BW` / `$PPPOE_PADSE_BURST` | ddos-protection PPPoE PADSE rate-limits | `2000` / `100` | subscriber-management/system-services-subscriber-mgmt.conf |
| `$USER_PASS` | dynamic-profile RADIUS password | `joshua` | interfaces/ps-pseudowire-*, services/l3vpn-dhcp-subs.conf, subscriber-management/dp-auto-stacked-* |
| `$USER_PREFIX` | dynamic-profile username prefix | `pwht_pppoe`, `pwht_dhcp` | (same as `$USER_PASS`) |
| `$DOMAIN_NAME` | dynamic-profile username domain | `jnpr.net` | (same as `$USER_PASS`) |
| `$RA_MIN` / `$RA_MAX` | router-advertisement intervals | `30` / `60` | subscriber-management/dp-auto-stacked-pwht-dhcp.conf |
| `$VRF_LO_UNIT` | dhcp-subs VRF loopback unit | `lo0.313` | subscriber-management/dp-prod-dhcp-base.conf, dp-autosense-ipdemux.conf |

## Policy

| Variable | Meaning | Example | Used in |
|---|---|---|---|
| `$PL_AN_REGION_LIST` | Prefix-list of AN+BNG client loopbacks | `192.168.0.0..0.4 192.168.0.7 192.168.0.8` | policy/bgp-rr-export.conf |
| `$PL_CORE_LIST` | Prefix-list of CORE loopbacks (per RR view) | `192.168.0.7 .8 .11` (AGN view); `192.168.0.9 .10` (cr1 view) | policy/bgp-rr-export.conf |
