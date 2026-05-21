# Snip Variable Reference

Variables used across the `3stage_dc` snip library. Replace `$VARIABLE` placeholders
with site-specific values when adapting snips to a new deployment.

## Bootstrap / Platform

| Variable | Example | Used in |
|----------|---------|---------|
| `$AGGREGATED_COUNT` | `2` | chassis-port-config |
| `$PIC_SLOT` | `0` | chassis-port-config |
| `$PORT_GROUP` | `0` | chassis-port-config |
| `$SPEED` | `10g` | chassis-port-config, fabric-uplink (EVO) |
| `$CERT_NAME` | `certs` | grpc-certificate |
| `$CERT_DATA` | (base64 PEM) | grpc-certificate |

## Interfaces

| Variable | Example | Used in |
|----------|---------|---------|
| `$FABRIC_INTF` | `et-0/0/0` | fabric-uplink |
| `$UNIT` | `0` | fabric-uplink, irb-gateway, external-vlan-tagged |
| `$LOCAL_IP` | `10.0.0.1/31` | fabric-uplink |
| `$DESCRIPTION` | `facing_spine1` | fabric-uplink, irb-gateway |
| `$LO_UNIT` | `0`, `2`, `3` | loopback-multi-unit |
| `$LO_IPV4` | `192.168.255.4/32` | loopback-multi-unit |
| `$LO_IPV6` | `fdf6:ed70:1fac:f2d1::4/128` | loopback-multi-unit |
| `$IRB_UNIT` | `1400` | irb-gateway |
| `$IRB_IPV4` | `10.10.0.1/18` | irb-gateway |
| `$IRB_IPV6` | `2001:db8:dc1:10:a::1/90` | irb-gateway |
| `$ANYCAST_MAC` | `00:1c:73:00:00:01` | irb-gateway (Junos) |
| `$VLAN_ID` | `1400` | irb-gateway (EVO), vlan-vxlan-domain, trunk-access-port |
| `$VXLAN_VNI` | `11400` | vlan-vxlan-domain |
| `$LAG_NAME` | `ae1` | lag-esi-access |
| `$LAG_MEMBER` | `xe-0/0/1` | lag-esi-access |
| `$ESI_VALUE` | `00:01:01:01:01:01:01:01:01:01` | lag-esi-access |
| `$LACP_SYSTEM_ID` | `01:01:01:01:01:01` | lag-esi-access |
| `$FLEX_INTF` | `et-0/0/8:0` | external-vlan-tagged |
| `$VLAN_RANGE` | `299-399` | external-vlan-tagged |

## Transport / Routing

| Variable | Example | Used in |
|----------|---------|---------|
| `$ROUTER_ID` | `192.168.255.4` | forwarding-table-ecmp |
| `$AS_NUMBER` | `64515` | forwarding-table-ecmp |
| `$PEER_IP` | `10.0.0.0` | bgp-underlay-fabric |
| `$LOCAL_ADDR` | `10.0.0.1` | bgp-underlay-fabric |
| `$PEER_AS` | `64512` | bgp-underlay-fabric, bgp-evpn-overlay |
| `$PEER_LOOPBACK` | `192.168.255.0` | bgp-evpn-overlay |
| `$LOCAL_LOOPBACK` | `192.168.255.4` | bgp-evpn-overlay |
| `$VTEP_SHARED_TUNNEL` | `default` | evpn-vxlan-shared-tunnels |

## Policy

| Variable | Example | Used in |
|----------|---------|---------|
| `$VRF_NAME` | `blue` | pod-network-export, bgp-aos-export-policy, external-route-import/export, route-filter-lists, community-definitions |
| `$VRF_COMMUNITY_V4` | `BLUE_COMMUNITY_V4` | pod-network-export |
| `$VRF_COMMUNITY_V6` | `BLUE_COMMUNITY_V6` | pod-network-export |
| `$VRF_COMM_V4` | `BLUE_COMMUNITY_V4` | community-definitions |
| `$VRF_MEMBERS_V4` | `[ 3:20007 21003:26000 ]` | community-definitions |
| `$VRF_MEMBERS_V6` | `[ 3:20008 21003:26000 ]` | community-definitions |
| `$VRF_ID` | `21003` | community-definitions |
| `$EXT_PEER_NAME` | `external_router` | external-route-import/export, route-filter-lists |
| `$IMPORT_COMMUNITY` | `RoutesFromExt-blue-external_router` | external-route-import |
| `$IMPORT_COMM_V6` | `RoutesFromExtV6-blue-external_router` | external-route-import |
| `$PREFIX/$LEN` | `10.10.0.0/18 upto /32` | route-filter-lists |

## Services

| Variable | Example | Used in |
|----------|---------|---------|
| `$VNI` | `20002` | vrf-evpn-ip-prefix |
| `$RD` | `192.168.255.2:3` | vrf-evpn-ip-prefix, mac-vrf-evpn-vxlan |
| `$VRF_TARGET` | `target:20002:1` | vrf-evpn-ip-prefix |
| `$DHCP_SERVER` | `10.10.0.200` | vrf-evpn-ip-prefix |
| `$EXT_NEIGHBOR_V4` | `10.200.0.5` | vrf-evpn-ip-prefix |
| `$EXT_LOCAL_V4` | `10.200.0.4` | vrf-evpn-ip-prefix |
| `$EXT_NEIGHBOR_V6` | `2001:db8:dc1:10:200::5` | vrf-evpn-ip-prefix |
| `$EXT_LOCAL_V6` | `2001:db8:dc1:10:200::4` | vrf-evpn-ip-prefix |
| `$EXT_PEER_AS` | `65000` | vrf-evpn-ip-prefix |
| `$WAN_INTERFACE` | `et-0/0/8:0.399` | vrf-evpn-ip-prefix |
| `$INSTANCE_NAME` | `evpn-1` | mac-vrf-evpn-vxlan |
| `$VNI_TARGET` | `target:10400:1` | mac-vrf-evpn-vxlan |
| `$GLOBAL_VRF_TARGET` | `target:100:100` | mac-vrf-evpn-vxlan |
| `$VTEP_SOURCE` | `lo0.0` | mac-vrf-evpn-vxlan |
| `$VLAN_NAME` | `vn1400` | mac-vrf-evpn-vxlan |
| `$VLAN_DESC` | `blue_all_1400` | mac-vrf-evpn-vxlan |
| `$AUTO_RECOVERY_TIME` | `9` | mac-vrf-evpn-vxlan |
| `$ACCESS_INTERFACE` | `ae1.0` | mac-vrf-evpn-vxlan |

## OAM

| Variable | Example | Used in |
|----------|---------|---------|
| `$SOURCE_IP` | `10.48.9.240` | sflow-telemetry |
| `$COLLECTOR_IP` | `10.87.84.51` | sflow-telemetry |
| `$COLLECTOR_PORT` | `9995` | sflow-telemetry |
| `$INTERFACE` | `et-0/0/2.0` | sflow-telemetry, ipv6-router-advertisement |
