# Snippet variable glossary

All `.conf` files under `junos/` and `evo/` are templates: identifiers that vary between deployments are written
as `$VAR`. Render a snippet by substituting each placeholder with your deployment's value. The placeholders each
snippet uses are listed in its `Variables:` header and in the glossary below. Variable names and meanings follow
the shared JVD snippet vocabulary. Lettered and numbered
variables (`_A`…`_E`, `_1`, `_2`, …) form an ordered set; the letters and numbers carry no other meaning.

Values left literal on purpose: names other configuration refers to by a single fixed spelling (policies such as
`bgp-to-ospf`'s callers, `send-ospf`, `redistribute-vpn`, `null`, `default`; classifiers and rewrite rules), the
per-device protocol forms whose interface lists are reproduced as configured, and design constants such as
`vrrp-group 1`, BFD intervals and `revert-time 30`.

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `64512` |
| `$ASN_CUSTOMER` | Customer-facing BGP peer autonomous-system number. | `64520` |
| `$ASN_PROVIDER` | Provider (WAN) autonomous-system number of the eBGP neighbor, as configured on a CE. | `64512` |
| `$ISO_NET` | ISO network entity title on lo0 `family iso`. | `47.0005.80ff.f800.0000.0108.0001.0102.5502.0061.00` |
| `$LOOPBACK_ALT_V4_PFX` | Additional lo0 IPv4 `/32` configured on one node besides its design and management loopbacks. | `10.22.22.1/32` |
| `$LOOPBACK_V4` | Primary per-node IPv4 loopback address. | `192.168.0.14` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on a loopback unit (`lo0.0` or a per-VRF `lo0.<n>`). | `192.168.0.14/32` |
| `$LOOPBACK_V6_PFX` | This node's lo0 IPv6 written with its `/128` prefix length. | `abcd::10:255:20:61/128` |
| `$LOOPBACK_VRF_V4` | IPv4 address of a VRF's own loopback unit; used as the VRF route-distinguisher administrator and, on the RP, as the local RP address. | `10.33.33.10` |
| `$ROUTER_ID` | Complete router identifier in IPv4 dotted-decimal form. | `1.1.1.8` |
| `$RR1_V4` | IPv4 loopback of a BGP route reflector this node peers with; `RR1`, `RR2` order the reflectors. | `192.168.0.17` |
| `$RR2_V4` | IPv4 loopback of a second BGP route reflector. | `192.168.0.11` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address on a routed attachment-circuit unit. | `10.75.0.101/24` |
| `$AC_IFL` | Full logical attachment-circuit interface identifier, including its unit. | `ae1.1001` |
| `$AC_IFL_A` | First attachment logical interface (with unit) of a set; `_A`…`_E` order the members. | `ae1.1501` |
| `$AC_IFL_B` | Second attachment logical interface (with unit) of a set. | `et-0/0/44.1501` |
| `$AC_IFL_C` | Third attachment logical interface (with unit) of a set. | `et-0/0/44.3484` |
| `$AC_IFL_D` | Fourth attachment logical interface (with unit) of a set. | `et-0/0/44.3001` |
| `$AC_IFL_E` | Fifth attachment logical interface (with unit) of a set. | `xe-2/0/0:1.3001` |
| `$AE_BUNDLE` | Aggregated-Ethernet bundle a member link joins (`802.3ad`). | `ae1` |
| `$AE_DEVICE_COUNT` | Number of aggregated-Ethernet devices the chassis allocates. | `25` |
| `$BREAKOUT_SUB_PORTS` | Number of breakout sub-ports | `4` |
| `$CORE_INTF_1` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-0/0/50.0` |
| `$CORE_INTF_2` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-0/0/48.0` |
| `$CORE_INTF_3` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-0/0/51.0` |
| `$CORE_INTF_4` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-0/0/49.0` |
| `$CORE_INTF_5` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/1.0` |
| `$CORE_INTF_6` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/3.0` |
| `$CORE_INTF_7` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/4.0` |
| `$CORE_INTF_8` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `ae2.0` |
| `$CORE_PHYS` | Parent of the core LAG. | `et-0/0/48` |
| `$CORE_PHYS_1` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/0` |
| `$CORE_PHYS_2` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/1` |
| `$CORE_PHYS_3` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/4` |
| `$CORE_PHYS_4` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-0/0/51` |
| `$CORE_PHYS_5` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/1` |
| `$CORE_PHYS_6` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/3` |
| `$CORE_PHYS_7` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/4` |
| `$CORE_PHYS_8` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `ae2` |
| `$CORE_V4_ADDR` | Core interface IPv4 address. | `10.0.13.1/30` |
| `$DESCRIPTION` | Free-text interface `description`. | `"P1Node to WANEdge1"` |
| `$FPC_SLOT` | FPC slot for a complete source-measured hardware profile. | `1` |
| `$IFD` | Interface-device identifier, excluding a logical unit. | `ae2` |
| `$LACP_SYS_ID` | LACP system-id on a multihomed LAG. | `11:11:11:11:11:11` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `0` |
| `$VLAN` | A single VLAN identifier. | `1` |
| `$VLAN_NAME` | Name of a `vlans` definition (a VLAN set or range) referenced by trunk members and bundle instances. | `VPLS1` |
| `$VRRP_PRIORITY` | VRRP priority of this router in the group; the higher priority becomes master. | `250` |
| `$VRRP_VIP` | VRRP virtual (gateway) IPv4 address shared by the routers of a VRRP group. | `10.75.0.104` |

## Services

| Variable | What it is | Example value |
|---|---|---|
| `$BACKUP_LOOPBACK` | Backup PE loopback used in `backup-neighbor` for HSB l2circuit (`l2circuit-hsb-hub`). | `192.168.0.16` |
| `$BD_NAME` | bridge-domain / MAC-VRF bridge-domain name. | `BD4001` |
| `$BGP_GROUP` | Name of a BGP group (CE-facing group in a VRF, or a CE's group toward a WAN edge). | `CE2` |
| `$CE_PEER_V4` | IPv4 address of the external BGP peer (CE). | `10.70.0.1` |
| `$COS_INTF` | Interface to which the class-of-service configuration is applied, physical or aggregated and independent of topology role. | `xe-0/0/15:0` |
| `$EXPORT_POL` | VRF export policy name (`vrf-export`). | `null` |
| `$GROUP_A` | First configuration group named by `apply-groups`; group order matters. | `ZR_Wavelength` |
| `$GROUP_B` | Second configuration group named by `apply-groups`. | `REST_API` |
| `$IMPORT_POL` | VRF import policy name (`vrf-import`). | `spoke_1` |
| `$INSTANCE_NAME` | Identity stem of a service instance: the routing-instance name, or the shared name of a hub-and-spoke policy and its community. | `hub_1` |
| `$MCAST_GROUP_V4_PFX` | IPv4 multicast group prefix: the PIM RP group range and the selective provider-tunnel group. | `227.1.1.10/32` |
| `$MCAST_SOURCE_V4_PFX` | IPv4 multicast source prefix of a selective provider tunnel. | `124.1.10.1/32` |
| `$PE_LOCAL_V4` | Local IPv4 address of the PE side of a CE eBGP session (`local-address`). | `10.70.0.2` |
| `$PE_PEER_V4` | IPv4 address of the WAN-edge (PE) eBGP neighbor, as configured on a CE. | `70.70.0.2` |
| `$PIM_RP_V4` | IPv4 address of a static PIM rendezvous point. | `1.1.1.8` |
| `$PPLB_NAME` | Per-packet load-balance policy name — a label proven to vary across otherwise-identical deployed forms. | `pplb` |
| `$PRIMARY_LOOPBACK` | Primary PE loopback targeted by an HSB l2circuit Hub (`l2circuit-hsb-hub`). | `192.168.0.14` |
| `$RD_SUB_ADMIN` | Route Distinguisher Administrator subfield. | `4444` |
| `$RD_SUB_ASSIGNED` | Route Distinguisher Assigned Number subfield. | `2001` |
| `$REMOTE_PE_V4` | Remote PE loopback used in static l2circuit / LDP-VPLS neighbour lines. | `192.168.0.15` |
| `$RT_AS` | Route Target Administrator subfield. | `65535` |
| `$RT_ID` | Route Target Assigned Number subfield. | `1` |
| `$VC_ID` | Virtual-circuit identifier of a Layer 2 circuit, or the VPLS identifier (`vpls-id`). | `1001` |
| `$VPLS_SITE` | BGP-VPLS site name. | `103` |
| `$VPLS_SITE_ID` | BGP-VPLS site-identifier. | `1003` |
