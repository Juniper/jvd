# Snippet variable glossary

All `.conf` files under `junos/` and `evo/` are templates: identifiers that vary between deployments are written
as `$VAR`. Render a snippet by substituting each placeholder with your deployment's value. The placeholders each
snippet uses are listed in its `Variables:` header and in the glossary below. Variable names and meanings follow
the shared JVD snippet vocabulary. Lettered and numbered
variables (`_A`…`_E`, `_1`, `_2`, …) form an ordered set; the letters and numbers carry no other meaning.

Values left literal on purpose: names other configuration refers to by a single fixed spelling (the policies
`send-direct`, `send-ospf`, `bgp-to-ospf`, `nexthop` and `advertise-loop`; classifiers, rewrite rules,
forwarding classes and drop profiles; the BGP group `ibgp`; the flow-route names), and design constants such as BFD
intervals, the CFM level and intervals, the SRGB and the LACP settings.

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `64512` |
| `$LOOPBACK_V4` | Primary per-node IPv4 loopback address. | `4.4.4.4` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on a loopback unit (`lo0.0` or a per-VRF `lo0.<n>`). | `3.3.3.3/32` |
| `$NODE_SID_INDEX` | Segment routing node SID index of this router (`node-segment ipv4-index`). | `103` |
| `$PE1_V4` | IPv4 loopback of a route-reflector client (WAN edge PE); `PE1`…`PE4` order the clients. | `2.2.2.2` |
| `$PE2_V4` | IPv4 loopback of a second route-reflector client. | `4.4.4.4` |
| `$PE3_V4` | IPv4 loopback of a third route-reflector client. | `5.5.5.5` |
| `$PE4_V4` | IPv4 loopback of a fourth route-reflector client. | `7.7.7.7` |
| `$ROUTER_ID` | Complete router identifier in IPv4 dotted-decimal form. | `4.4.4.4` |
| `$RR1_V4` | IPv4 loopback of a BGP route reflector this node peers with; `RR1`, `RR2` order the reflectors. | `3.3.3.3` |
| `$RR2_V4` | IPv4 loopback of a second BGP route reflector. | `6.6.6.6` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address on a routed attachment-circuit unit. | `56.1.1.1/24` |
| `$AC_ADDR_V6` | IPv6 address on a routed attachment-circuit unit. | `5500::2/64` |
| `$AC_IFL` | Full logical attachment-circuit interface identifier, including its unit. | `et-0/0/2.301` |
| `$AC_IFL_A` | First attachment logical interface (with unit) of a set; `_A`…`_E` order the members. | `ae0.2001` |
| `$AC_IFL_B` | Second attachment logical interface (with unit) of a set. | `ae0.2002` |
| `$AE_BUNDLE` | Aggregated-Ethernet bundle a member link joins (`802.3ad`). | `ae0` |
| `$AE_DEVICE_COUNT` | Number of aggregated-Ethernet devices the chassis allocates. | `25` |
| `$CORE_INTF` | Core-facing LAG unit used for ISIS+MPLS underlay. | `et-0/0/0` |
| `$CORE_INTF_1` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/0.0` |
| `$CORE_INTF_2` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/1.0` |
| `$CORE_INTF_3` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/2.0` |
| `$CORE_INTF_4` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-0/0/9.0` |
| `$CORE_PHYS` | Parent of the core LAG. | `et-0/0/53` |
| `$CORE_PHYS_1` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/0` |
| `$CORE_PHYS_2` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/1` |
| `$CORE_PHYS_3` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/2` |
| `$CORE_PHYS_4` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/1` |
| `$CORE_V4_ADDR` | Core interface IPv4 address. | `192.168.91.2/24` |
| `$CORE_V6_ADDR` | Core interface IPv6 address. | `4400::4/68` |
| `$COS_INTF` | Interface to which the class-of-service configuration is applied, physical or aggregated and independent of topology role. | `irb` |
| `$DESCRIPTION` | Free-text interface `description`. | `"PE4 to CE2"` |
| `$FPC_SLOT` | FPC slot for a complete source-measured hardware profile. | `1` |
| `$IFD` | Interface-device identifier, excluding a logical unit. | `ae0` |
| `$IRB_ADDR` | IPv4 address configured on an `irb` unit. | `65.65.1.1/24` |
| `$IRB_UNIT` | irb.X unit number for IRB integration. | `irb.1851` |
| `$LACP_SYS_ID` | LACP system-id on a multihomed LAG. | `00:00:00:00:01:01` |
| `$MTU` | Interface MTU in bytes. | `1522` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `1851` |
| `$VLAN` | A single VLAN identifier. | `1` |
| `$VLAN_BD` | bridge-domain or mac-vrf vlan-id. | `1851` |
| `$VLAN_NAME` | Name of a `vlans` definition (a VLAN set or range) referenced by trunk members and bundle instances. | `VPWS1` |

## Services

| Variable | What it is | Example value |
|---|---|---|
| `$AREA_IFL_A` | First interface (with unit) of an OSPF or OSPFv3 area in a scale form; `_A`, `_B` order the members. | `ae4.2801` |
| `$AREA_IFL_B` | Second interface (with unit) of an OSPF or OSPFv3 area in a scale form. | `et-0/0/1.2801` |
| `$BD_NAME` | bridge-domain / MAC-VRF bridge-domain name. | `mvbased_1851` |
| `$DST_PFX` | Destination IPv4 prefix matched by a firewall filter term. | `217.217.5.100/32` |
| `$DST_PORT` | TCP destination port matched by a firewall filter term. | `23` |
| `$ESI` | 10-byte ESI (for EVPN multihoming). | `00:25:25:25:25:25:25:25:11:01` |
| `$FILTER_NAME` | Firewall filter name; also its counter name. | `filter_ip_match_dest2` |
| `$FLOW_DSCP_SRC_PFX` | Source prefix matched, with DSCP 10, by the `descp_match` flow route. | `211.216.2.2/32` |
| `$FLOW_DST_PFX` | Destination prefix matched by the `dest_ip` BGP flow specification route. | `211.212.1.2/32` |
| `$FLOW_DST_PORT` | TCP destination port matched by the `proto_tcp_dest_port_match` flow route. | `23` |
| `$FLOW_ICMP_SRC_PFX` | Source prefix matched, with ICMP type 8 code 1, by the `icmp_match` flow route. | `211.215.2.2/32` |
| `$FLOW_SRC_PFX` | Source prefix matched by the `source_ip` BGP flow specification route. | `211.211.2.2/32` |
| `$FLOW_SRC_PORT` | TCP source port matched by the `proto_tcp_source_port_match` flow route. | `65074` |
| `$INPUT_FILTER` | Firewall filter name applied as `filter input`. | `filter_ip_match_dest1` |
| `$INSTANCE_NAME` | Identity stem of a service instance: the routing-instance name, or the shared name of a hub-and-spoke policy and its community. | `emh_group_400_1851` |
| `$LSP_NAME_A` | Name of an MPLS label-switched path; `_A`, `_B` order the paths of a form. | `lsp_to_pe1` |
| `$LSP_NAME_B` | Name of a second MPLS label-switched path. | `lsp_to_pe2` |
| `$LSP_TO_A` | Egress address (`to`) of the first label-switched path: a remote PE loopback. | `2.2.2.2` |
| `$LSP_TO_B` | Egress address (`to`) of the second label-switched path. | `5.5.5.5` |
| `$MA_ID` | CFM maintenance-association identifier. | `m-a301` |
| `$MD_NAME` | CFM maintenance-domain name. | `m-d301` |
| `$MEP_LOCAL` | Local MEP identifier. | `352` |
| `$NEXT_INTERFACE` | Interface (`next-interface`) to which a filter term forwards matching packets. | `et-1/0/2` |
| `$NEXT_IP` | Next-hop IPv4 address (`next-ip`) to which a filter term forwards matching packets. | `192.168.91.2/32` |
| `$OSPF_AREA` | OSPF or OSPFv3 area identifier (dotted decimal). | `0.0.0.1` |
| `$PPLB_NAME` | Per-packet load-balance policy name — a label proven to vary across otherwise-identical deployed forms. | `pplb` |
| `$RD_SUB_ADMIN` | Route Distinguisher Administrator subfield. | `44.44.44.44` |
| `$RD_SUB_ASSIGNED` | Route Distinguisher Assigned Number subfield. | `1851` |
| `$RT_AS` | Route Target Administrator subfield. | `60525` |
| `$RT_ID` | Route Target Assigned Number subfield. | `1851` |
| `$SLA_PROFILE_DELAY` | Name of the CFM SLA iterator profile that measures two-way delay. | `i1` |
| `$SLA_PROFILE_SLM` | Name of the CFM SLA iterator profile that measures synthetic loss (SLM). | `i2` |
| `$SRC_PFX` | Source IPv4 prefix matched by a firewall filter term. | `218.218.6.100/32` |
| `$SRC_PORT` | TCP source port matched by a firewall filter term. | `65001` |
| `$SVC_ID_LOCAL_A` | Local VPWS service identifier of the first attachment circuit of a flexible cross-connect. | `1` |
| `$SVC_ID_LOCAL_B` | Local VPWS service identifier of the second attachment circuit of a flexible cross-connect. | `11` |
| `$SVC_ID_REMOTE_A` | Remote VPWS service identifier of the first attachment circuit of a flexible cross-connect. | `2` |
| `$SVC_ID_REMOTE_B` | Remote VPWS service identifier of the second attachment circuit of a flexible cross-connect. | `21` |
| `$VGA` | EVPN virtual-gateway address shared by the IRB's redundancy group. | `45.45.1.3` |
| `$VG_MAC` | MAC address bound to the IPv4 virtual gateway. | `00:66:66:66:66:01` |
| `$VPWS_SVC_ID_LOCAL` | EVPN-VPWS local service-id. | `2` |
| `$VPWS_SVC_ID_REMOTE` | EVPN-VPWS remote service-id. | `1` |
