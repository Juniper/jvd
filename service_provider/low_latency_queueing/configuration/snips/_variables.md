# Snippet variable glossary

All `.conf` files under `junos/` and `evo/` are templates: identifiers that vary between deployments are written
as `$VAR`. Render a snippet by substituting each placeholder with your deployment's value. The placeholders each
snippet uses are listed in its `Variables:` header and in the glossary below. Variable names and meanings follow
the shared JVD snippet vocabulary. Lettered and numbered
variables (`_A`…`_E`, `_1`, `_2`, …) form an ordered set; the letters and numbers carry no other meaning.

Values left literal on purpose: the class-of-service names (forwarding classes `FC-*`, schedulers `SC-*`, the
scheduler map `SM-5G-SCHEDULER`, classifiers `CL-*` and rewrite rules `RR-*`), the routing policy, community, prefix-list
and RIB-group names other configuration references by name, the IS-IS SRGB and levels, the CFM level and timers,
the VPLS `site-range 65534` and `label-block-size 4`, `mtu 9190`, `maximum-labels 5`, the LACP settings, `unit 0` and
the loopback `lo0.0`, and the per-endpoint MAC lists of the multifield filters.

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `63535` |
| `$ASN_CUSTOMER` | Customer-facing BGP peer autonomous-system number. | `64518` |
| `$ASN_INTER_AS` | Autonomous-system number of the inter-AS eBGP peers (the other AS of the design). | `63536` |
| `$IBGP_PEER_V4` | IPv4 address of an internal BGP neighbor. | `192.168.1.4` |
| `$IBGP_PEER_V4_1` | IPv4 loopback of an internal BGP neighbor; `_1`, `_2` order the neighbors. | `192.168.1.3` |
| `$IBGP_PEER_V4_2` | IPv4 loopback of an internal BGP neighbor; `_1`, `_2` order the neighbors. | `192.168.1.4` |
| `$IBGP_PEER_V4_3` | IPv4 loopback of an internal BGP neighbor; `_1`, `_2` order the neighbors. | `192.168.1.2` |
| `$LOOPBACK_ALT_V4_PFX` | Secondary IPv4 address with prefix length on loopback unit 0 (`192.168.10.x` in this JVD). | `192.168.10.3/32` |
| `$LOOPBACK_ALT_V6_PFX` | Secondary IPv6 address with prefix length on loopback unit 0. | `2001:db8::1:1:10:3/128` |
| `$LOOPBACK_ANYCAST_V4` | Secondary IPv4 loopback address, written with `/32` in the body (sag in this JVD; distinct per router, not shared). | `192.168.10.11` |
| `$LOOPBACK_SR_V4` | Segment Routing non-zero IPv4 loopback address. | `192.168.10.3` |
| `$LOOPBACK_SR_V6` | Secondary IPv6 loopback address, written with `/128` in the body. | `2001:db8::1:1:10:3` |
| `$LOOPBACK_V4` | Primary per-node IPv4 loopback address. | `192.168.1.4` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on a loopback unit (`lo0.0` or a per-VRF `lo0.<n>`). | `192.168.1.3/32` |
| `$LOOPBACK_V6_PFX` | This node's lo0 IPv6 written with its `/128` prefix length. | `2001:db8::1:1:0:3/128` |
| `$ROUTER_ID` | Complete router identifier in IPv4 dotted-decimal form. | `192.168.1.3` |
| `$RR1_V4` | IPv4 loopback of a BGP route reflector this node peers with; `RR1`, `RR2` order the reflectors. | `192.168.1.9` |
| `$RR2_V4` | IPv4 loopback of a second BGP route reflector. | `192.168.1.10` |

## Interfaces and optics

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address on a routed attachment-circuit unit. | `10.31.167.1/24` |
| `$AC_ADDR_V6` | IPv6 address on a routed attachment-circuit unit. | `2001:db8::1fa6:11/112` |
| `$AC_IFL` | Full logical attachment-circuit interface identifier, including its unit. | `ae26.517` |
| `$AC_IFL_A` | First attachment logical interface (with unit) of a set; `_A`…`_E` order the members. | `ae26.1000` |
| `$AC_IFL_B` | Second attachment logical interface (with unit) of a set. | `xe-0/0/6:2.1000` |
| `$AE_BUNDLE` | Aggregated-Ethernet bundle a member link joins (`802.3ad`). | `ae19` |
| `$AE_DEVICE_COUNT` | Number of aggregated-Ethernet devices the chassis allocates. | `25` |
| `$CORE_INTF` | Core-facing LAG unit used for ISIS+MPLS underlay. | `ae19.0` |
| `$CORE_INTF_1` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `ae19.0` |
| `$CORE_INTF_2` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `ae24.0` |
| `$CORE_INTF_3` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-0/0/49.0` |
| `$CORE_INTF_4` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-0/0/0.0` |
| `$CORE_INTF_5` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `ae5.0` |
| `$CORE_V4_ADDR` | Core interface IPv4 address. | `10.10.0.10/30` |
| `$CORE_V6_ADDR` | Core interface IPv6 address. | `2001:db8::10:10:0:b/126` |
| `$COS_INTF` | Interface to which the class-of-service configuration is applied, physical or aggregated and independent of topology role. | `ae19` |
| `$DESCRIPTION` | Free-text interface `description`. | `TO-DU` |
| `$FPC_SLOT` | FPC slot for a complete source-measured hardware profile. | `2` |
| `$IFD` | Interface-device identifier, excluding a logical unit. | `ae26` |
| `$IRB_IFL` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN or bridge domain, or a VRF member. | `irb.101` |
| `$IRB_MAC` | MAC address configured on an IRB unit (`mac`). | `00:00:00:00:00:a7` |
| `$IRB_UNIT` | irb.X unit number for IRB integration. | `517` |
| `$LACP_SYS_ID` | LACP system-id on a multihomed LAG. | `00:00:00:00:00:01` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `3801` |
| `$VLAN` | A single VLAN identifier. | `351` |
| `$VLAN_BD` | bridge-domain or mac-vrf vlan-id. | `101` |
| `$VLAN_NAME` | Name of a `vlans` definition (a VLAN set or range) referenced by trunk members and bundle instances. | `5G-MIDHAUL-L3VPN-BD-351` |

## Services

| Variable | What it is | Example value |
|---|---|---|
| `$AC_INTF` | Customer-facing attachment-circuit unit (with VLAN id when tagged). | `ae26.1000` |
| `$AC_INTF_A` | First attachment logical interface (with unit) of a flexible cross-connect instance. | `ae26.2601` |
| `$AC_INTF_B` | Second attachment logical interface (with unit) of a flexible cross-connect instance. | `ae26.2651` |
| `$BD_NAME` | bridge-domain / MAC-VRF bridge-domain name. | `BD_EVPN_101` |
| `$BGP_GROUP` | Name of a BGP group (CE-facing group in a VRF, or a CE's group toward a WAN edge). | `ebgp_sag` |
| `$BGP_GROUP_V4` | Name of the IPv4 eBGP group toward the CE in a VRF. | `v4ixia` |
| `$BGP_GROUP_V6` | Name of the IPv6 eBGP group toward the CE in a VRF. | `v6ixia` |
| `$CE_PEER_V4` | IPv4 address of the external BGP peer (CE). | `10.16.7.206` |
| `$CE_PEER_V6` | IPv6 address of the external BGP peer (CE). | `2001:db8::16:1:7:7cf` |
| `$CLUSTER_ID` | Route-reflector cluster identifier (`cluster`) of an iBGP group. | `192.168.1.9` |
| `$ESI` | 10-byte ESI (for EVPN multihoming). | `00:88:11:11:11:11:11:00:00:00` |
| `$INPUT_FILTER` | Firewall filter name applied as `filter input`. | `FF-MF-EVPN-VPWS-MH-TO-AN1` |
| `$INPUT_FILTER_V4` | Name of an IPv4 firewall filter: defines the filter and applies it as an input filter. | `FF-MFC-IPV4-L3VPN-BD-IRB` |
| `$INPUT_FILTER_V6` | Name of an IPv6 firewall filter: defines the filter and applies it as an input filter. | `FF-MFC-IPV6-L3VPN-BD-IRB` |
| `$INSTANCE_NAME` | Identity stem of a service instance: the routing-instance name, or the shared name of a hub-and-spoke policy and its community. | `5G-MIDHAUL-EVPN-L3VPN-IRB-1` |
| `$INTER_AS_PEER_V4` | IPv4 address of an inter-AS eBGP neighbor in the other autonomous system of the design (Option B or C): a link address or a loopback for multihop sessions. | `10.10.0.54` |
| `$INTER_AS_PEER_V4_1` | IPv4 address of an inter-AS eBGP neighbor; `_1`, `_2` order the neighbors of one group. | `10.10.0.49` |
| `$INTER_AS_PEER_V4_2` | IPv4 address of an inter-AS eBGP neighbor; `_1`, `_2` order the neighbors of one group. | `10.10.0.53` |
| `$ISIS_NET` | ISIS NET (area + system-id) configured on lo0. | `49.1022.1001.0000.0008.00` |
| `$MA_ID` | CFM maintenance-association identifier. | `2501` |
| `$MD_NAME` | CFM maintenance-domain name. | `MD_63535` |
| `$MEP_LOCAL` | Local MEP identifier. | `1003` |
| `$MEP_REMOTE` | Remote MEP identifier (single-remote form). | `1001` |
| `$PE_LOCAL_V4` | Local IPv4 address of the PE side of a CE eBGP session (`local-address`). | `10.16.7.205` |
| `$PE_LOCAL_V6` | Local IPv6 address of the PE side of a CE eBGP session (`local-address`). | `2001:db8::16:1:7:7cd` |
| `$PIC_SLOT` | PIC slot within an FPC. | `1` |
| `$POLICY_NAME` | Name of a routing policy whose body is shared by several differently named policies. | `ALLOW_LOOPBACK` |
| `$PPLB_NAME` | Per-packet load-balance policy name — a label proven to vary across otherwise-identical deployed forms. | `PPLB` |
| `$PREFIX` | Prefix a route-filter matches where the prefix itself is what the policy selects. | `0.0.0.0/32` |
| `$RD_SUB_ASSIGNED` | Route Distinguisher Assigned Number subfield. | `101` |
| `$REMOTE_PE_V4` | Remote PE loopback used in static l2circuit / LDP-VPLS neighbour lines. | `192.168.1.11` |
| `$RT_AS` | Route Target Administrator subfield. | `63535` |
| `$RT_ID` | Route Target Assigned Number subfield. | `101` |
| `$SR_INDEX_V4` | Segment-routing node index attached to the IPv4 loopback prefix (`prefix-segment index`). | `208` |
| `$SR_INDEX_V6` | Segment-routing node index attached to the IPv6 loopback prefix (`prefix-segment index`). | `308` |
| `$STATIC_ARP_V4` | IPv4 address of a static ARP entry on an IRB unit. | `10.31.167.2` |
| `$STATIC_MAC` | Static MAC address configured on an interface device. | `00:99:00:00:00:a7` |
| `$STATIC_NDP_V6` | IPv6 address of a static NDP entry on an IRB unit. | `2001:db8::1fa6:12` |
| `$SVC_ID_LOCAL_A` | Local VPWS service identifier of the first attachment circuit of a flexible cross-connect. | `2` |
| `$SVC_ID_LOCAL_B` | Local VPWS service identifier of the second attachment circuit of a flexible cross-connect. | `102` |
| `$SVC_ID_REMOTE_A` | Remote VPWS service identifier of the first attachment circuit of a flexible cross-connect. | `1` |
| `$SVC_ID_REMOTE_B` | Remote VPWS service identifier of the second attachment circuit of a flexible cross-connect. | `101` |
| `$TS_PIC` | PIC slot that hosts tunnel services. | `0` |
| `$VC_ID` | Virtual-circuit identifier of a Layer 2 circuit, or the VPLS identifier (`vpls-id`). | `1501` |
| `$VGA` | EVPN virtual-gateway address shared by the IRB's redundancy group. | `10.21.167.1` |
| `$VGA_V6` | IPv6 virtual gateway address shared by the routers of an anycast IRB gateway. | `2001:db8::15a6:11` |
| `$VPLS_SITE` | BGP-VPLS site name. | `r2` |
| `$VPLS_SITE_ID` | BGP-VPLS site-identifier. | `1003` |
| `$VPWS_SVC_ID_LOCAL` | EVPN-VPWS local service-id. | `1` |
| `$VPWS_SVC_ID_REMOTE` | EVPN-VPWS remote service-id. | `2` |
