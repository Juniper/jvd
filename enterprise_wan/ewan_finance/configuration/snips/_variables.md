# Variables Glossary

All `$VARIABLE` placeholders used across the ewan_finance snip library.
Replace these with site-specific values when deploying.

## Identifiers & Addressing

| Variable | Description | Example |
|----------|-------------|---------|
| `$LOCAL_ADDRESS` | BGP local-address (router-id loopback) | `10.200.50.12` |
| `$LOCAL_AS` | BGP autonomous system number | `64512` |
| `$ROUTER_ID_ADDRESS` | Primary loopback IPv4 with /32 mask | `10.200.50.13/32` |
| `$MGMT_LOOPBACK` | Management loopback address | `10.255.163.148/32` |
| `$ISO_ADDRESS` | IS-IS/CLNS NET address on lo0 | `47.0005.80ff.f800.0000.0108.0001.0102.5516.3148.00` |
| `$IPV6_ADDRESS` | Primary IPv6 loopback address | `2001:db8::10:255:163:148/128` |
| `$IPV4_ADDRESS` | Interface IPv4 address with mask | `10.101.23.2/24` |
| `$ROUTE_DISTINGUISHER` | BGP route-distinguisher (router-id:id) | `10.200.50.12:61` |
| `$VRF_TARGET` | VPN route-target community | `target:64512:11` |

## Interfaces & LAG

| Variable | Description | Example |
|----------|-------------|---------|
| `$INTERFACE_NAME` | Physical interface name | `et-0/0/0` |
| `$AE_NAME` | Aggregated Ethernet (LAG) name | `ae0` |
| `$DESCRIPTION` | Interface description string | `Link to P1Node to WANEdge1` |
| `$MTU` | Interface MTU value | `1522` |
| `$CORE_IFACE_1` .. `$CORE_IFACE_4` | Core transport interface.unit | `et-0/0/1.0` |
| `$UNIT_ID` | Logical interface unit number | `1` |
| `$VLAN_ID` | 802.1Q VLAN identifier | `1` |

## LAG / ESI

| Variable | Description | Example |
|----------|-------------|---------|
| `$ESI_ID` | Ethernet Segment Identifier (10 bytes) | `00:11:11:11:11:11:12:12:12:12` |
| `$DF_PREFERENCE` | Designated-forwarder election preference | `150` |
| `$LACP_PRIORITY` | LACP system priority | `100` |
| `$LACP_SYSTEM_ID` | LACP system-id (must match across ESI peers) | `00:00:00:00:00:10` |
| `$UNIT_ESI` | Per-unit ESI for per-VLAN DF election | `00:01:71:81:11:12:a1:00:00:01` |
| `$UNIT_DF_PREFERENCE` | Per-unit DF preference value | `150` |

## IRB

| Variable | Description | Example |
|----------|-------------|---------|
| `$FILTER_NAME` | Firewall filter applied on IRB input | `mfc-filter` |
| `$STATIC_MAC` | Static MAC for deterministic gateway | `00:10:94:00:00:01` |

## Chassis

| Variable | Description | Example |
|----------|-------------|---------|
| `$DEVICE_COUNT` | Aggregated Ethernet device-count | `25` |
| `$FPC_SLOT` | FPC slot number | `0` |
| `$PIC_SLOT` | PIC slot number | `0` |
| `$TUNNEL_BW` | Tunnel-services bandwidth | `10g` |
| `$PORT_ID` | Physical port number | `0` |
| `$PORT_SPEED` | Port speed setting | `100g` |
| `$BREAKOUT_PORT_ID` | Port to be broken out | `9` |
| `$BREAKOUT_SPEED` | Per-lane speed after breakout | `10g` |
| `$BREAKOUT_SUB_PORTS` | Number of breakout sub-ports | `4` |

## BGP Peers

| Variable | Description | Example |
|----------|-------------|---------|
| `$NEIGHBOR_1` .. `$NEIGHBOR_5` | iBGP peer addresses | `10.200.50.13` |
| `$EXPORT_POLICY` | BGP group export policy list | `[ PS-send-ospf PS-BGP-TO-OSPF ]` |
| `$CE_NEIGHBOR` | CE/TG BGP peer address | `172.16.1.2` |
| `$CE_PEER_AS` | CE/TG peer autonomous system | `64513` |
| `$AP_PEER_AS` | AP router peer AS (for CR VRs) | `64512` |
| `$AP_NEIGHBOR_1` | AP1 peer address in virtual-router | `10.101.49.1` |
| `$AP_NEIGHBOR_2` | AP2 peer address in virtual-router | `10.101.79.1` |
| `$IXIA_PEER_AS` | Traffic generator peer AS | `64521` |
| `$IXIA_NEIGHBOR` | Traffic generator peer address | `10.101.91.2` |

## MPLS / RSVP

| Variable | Description | Example |
|----------|-------------|---------|
| `$P2MP_LSP_NAME` | P2MP LSP template name | `P2MP` |
| `$LSP_NAME_1` .. `$LSP_NAME_3` | Named unicast LSP | `lsp_to_AP1` |
| `$LSP_DEST_1` .. `$LSP_DEST_3` | LSP destination (peer loopback) | `10.200.50.14` |

## OSPF / BFD

| Variable | Description | Example |
|----------|-------------|---------|
| `$BFD_INTERVAL` | BFD minimum-interval (ms) | `10` |
| `$BFD_MULTIPLIER` | BFD detect-multiplier | `3` |

## Policy

| Variable | Description | Example |
|----------|-------------|---------|
| `$DIRECT_POLICY_NAME` | Direct-route redistribution policy | `PS-ADV_DIRECT` |
| `$BGP_TO_OSPF_NAME` | BGP-to-OSPF leak policy | `PS-BGP-TO-OSPF` |
| `$OSPF_TO_BGP_NAME` | OSPF-to-BGP export policy | `PS-send-ospf` |
| `$MED_LOW_NAME` | Low-MED route-filter policy | `PS-med-10` |
| `$MED_LOW_PREFIX` | Route-filter prefix for low MED | `10.101.0.0/16` |
| `$MED_LOW_VALUE` | Low MED metric value | `10` |
| `$MED_HIGH_NAME` | High-MED catch-all policy | `PS-med-30` |
| `$MED_HIGH_VALUE` | High MED metric value | `30` |
| `$EXPORT_POLICIES` | VR BGP export policy list | `[ med-10 med-30 ]` |

## CoS

| Variable | Description | Example |
|----------|-------------|---------|
| `$INTERFACE_1` .. `$INTERFACE_4` | CoS-applied interfaces | `et-0/0/1` |

## Firewall

| Variable | Description | Example |
|----------|-------------|---------|
| `$MCAST_DEST_PREFIX` | Multicast destination prefix to match | `225.0.0.0/16` |
| `$FORWARDING_CLASS` | Target forwarding class for match | `FC-LLQ` |
| `$UNICAST_DEST_1` | Unicast destination for VRF filter | `10.8.21.2/32` |
| `$UNICAST_DEST_2` | Second unicast destination | `10.9.21.2/32` |
| `$UNICAST_FWD_CLASS` | Forwarding class for unicast match | `FC-HIGH` |

## Multicast / MVPN

| Variable | Description | Example |
|----------|-------------|---------|
| `$RESOLVE_RATE` | Multicast PFE resolve-rate (pps) | `1000` |
| `$MISMATCH_RATE` | RPF mismatch-rate (pps) | `1000` |
| `$INSTANCE_NAME` | MVPN/VRF routing-instance name | `MVPN_INSTANCE1` |
| `$CE_LOCAL_ADDRESS` | MVPN VRF local-address for CE peering | `172.16.1.1` |
| `$MVPN_RT_IMPORT` | MVPN route-target import | `target:64512:101` |
| `$MVPN_RT_EXPORT` | MVPN route-target export | `target:64512:101` |
| `$RP_ADDRESS` | PIM Rendezvous Point address | `10.10.47.101` |
| `$MCAST_GROUP_RANGE` | PIM multicast group-range prefix | `225.0.0.0/22` |
| `$IRB_UNIT` | IRB interface bound to MVPN | `irb.1` |
| `$LO_UNIT` | Loopback unit bound to MVPN | `lo0.1` |

## EVPN

| Variable | Description | Example |
|----------|-------------|---------|
| `$BD_NAME` | Bridge-domain name | `BD_EVPN_GROUP1` |
| `$AE_UNIT` | LAG unit in bridge-domain | `ae0.1` |
| `$IRB_UNIT` | Routing-interface in bridge-domain | `irb.1` |

## L3VPN / Virtual-Router

| Variable | Description | Example |
|----------|-------------|---------|
| `$VRF_NAME` | L3VPN VRF instance name | `VRF21` |
| `$VR_NAME` | Virtual-router instance name | `VIRTUAL-ROUTER-V1` |
| `$LOCAL_ADDRESS` | VRF eBGP local-address | `172.16.21.1` |
| `$IFACE_AP1` | AP1-facing interface in VR | `et-5/0/0.1` |
| `$IFACE_AP2` | AP2-facing interface in VR | `et-5/0/1.1` |
| `$IFACE_TG` | Traffic-generator interface in VR | `xe-3/0/6.1` |

## TWAMP / OAM

| Variable | Description | Example |
|----------|-------------|---------|
| `$VRF_NAME_1` | TWAMP server VRF name | `MVPN_INSTANCE1` |
| `$VRF_PORT_1` | TWAMP server port for VRF | `862` |
| `$GLOBAL_PORT` | TWAMP server global port | `1862` |
| `$CLIENT_LIST_NAME` | TWAMP client-list ACL name | `CR1_1` |
| `$CLIENT_ADDRESS` | TWAMP client source address | `10.101.48.2/32` |
| `$CONNECTION_NAME` | TWAMP client control-connection name | `CR24_1` |
| `$DEST_PORT` | TWAMP client destination port | `862` |
| `$ROUTING_INSTANCE` | TWAMP client routing-instance | `VIRTUAL-ROUTER-V1` |
| `$TARGET_ADDRESS` | TWAMP probe target (server) address | `10.101.49.1` |
| `$TEST_SESSION_NAME` | TWAMP test-session identifier | `T24_1` |
| `$PROBE_COUNT` | Probes per test-session iteration | `100` |
| `$PROBE_INTERVAL` | Probe interval in seconds | `1` |

## VLAN Bridge-Domain (L2 Edge)

| Variable | Description | Example |
|----------|-------------|---------|
| `$VLAN_NAME` | VLAN definition name | `vlan1` |
| `$LAG_UNIT` | LAG unit in VLAN membership | `ae0.1` |
| `$ACCESS_UNIT` | Access port unit in VLAN membership | `et-0/0/47.1` |
