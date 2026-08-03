# Variables Reference — EWAN Core & Edge Snip Library

All templated variables used across snips in this library.

| Variable | Meaning | Typical example | Used in |
|---|---|---|---|
| `$AC_INTF` | Attachment-circuit (access) interface | `ae1`, `xe-0/0/15:1` | services/* |
| `$AE_DEVICE_COUNT` | Chassis aggregated-device pre-allocation | `25` | bootstrap/chassis |
| `$AE_INTF` | Aggregated Ethernet interface name | `ae2` | interfaces/* |
| `$BACKUP_NEIGHBOR` | L2CKT hot-standby backup PE loopback | `192.168.0.16` | services/l2ckt-pseudowire |
| `$BD_NAME` | Bridge-domain name (Junos VPLS) | `BDVPLS1` | services/vpls-virtual-switch (junos) |
| `$BGP_GROUP` | BGP group name within VRF | `mcast_1` | services/ngmvpn-vrf |
| `$BGP_NEIGHBOR` | BGP neighbor within VRF | `10.11.11.1` | services/ngmvpn-vrf |
| `$CE_GROUP` | CE-facing BGP group name | `CE1`, `CE2` | services/l3vpn-* |
| `$CE_INTF` | CE-facing physical interface | `et-1/0/10` | services/ngmvpn-vrf |
| `$CE_NEIGHBOR` | CE device BGP neighbor address | `10.45.0.7` | services/l3vpn-* |
| `$CE_PEER_AS` | CE autonomous system number | `64510`, `64520` | services/l3vpn-*, services/ngmvpn-* |
| `$CE_UNIT` | CE interface unit number | `1` | services/ngmvpn-vrf |
| `$CLUSTER_ID` | BGP Route Reflector cluster-id | `1.1.1.8` | transport/bgp-ibgp-rr |
| `$CORE_INTF_1` | Core-facing interface (first) | `ae2.0`, `et-0/0/6.0` | transport/* |
| `$CORE_INTF_2` | Core-facing interface (second) | `et-0/0/2.0` | transport/* |
| `$CORE_INTF_3` | Core-facing interface (third) | `et-0/0/3.0` | transport/mpls-* |
| `$DESCRIPTION` | Interface description | `Link1 from WAN Edge1 to P1 Node` | interfaces/* |
| `$HUB_COMMUNITY` | Hub community name (policy ref) | `hub_1` | policy/hub-spoke-import-export |
| `$HUB_COMMUNITY_NAME` | Hub community definition name | `hub_1` | policy/hub-spoke-community |
| `$HUB_POLICY_NAME` | Hub import policy-statement name | `hub_1` | policy/hub-spoke-import-export |
| `$HUB_RT` | Hub route-target community value | `target:65535:1` | policy/hub-spoke-community |
| `$LACP_SYSTEM_ID` | LACP system-id for MC-LAG | `00:00:22:00:00:01` | interfaces/ae-lag-access |
| `$LOCAL_ADDRESS` | Local address for BGP/interface | `10.10.0.12`, `10.10.12.1/24` | transport/*, services/* |
| `$LOCAL_AS` | Local autonomous system number | `64512` | transport/bgp-* |
| `$LOOPBACK` | Loopback interface | `lo0.0` | transport/* |
| `$LOOPBACK_UNIT` | Loopback unit for per-VRF PIM/OSPF | `1` | services/ngmvpn-vrf |
| `$LSP_NAME` | RSVP-TE LSP name | `lsp_to_pe3` | transport/mpls-lsp |
| `$LSP_TO` | LSP destination (remote PE loopback) | `192.168.0.14` | transport/mpls-lsp |
| `$MCAST_GROUP` | Multicast group range | `227.1.1.1/32` | services/ngmvpn-vrf |
| `$PE_NEIGHBOR` | Remote PE loopback (L2CKT neighbor) | `192.168.0.14` | services/l2ckt-pseudowire |
| `$PE_NEIGHBOR_1`..`4` | PE client neighbors (on RR) | `2.2.2.2` | transport/bgp-ibgp-rr |
| `$PE_PEER_AS` | PE autonomous system (iBGP within VRF) | `64512` | services/ngmvpn-vrf |
| `$RD` | Route-distinguisher | `10.10.0.12:3002` | services/* |
| `$ROUTER_ID` | Per-VRF router-id | `10.10.0.12` | services/l3vpn-vrf-vrrp |
| `$RP_ADDRESS` | PIM Rendezvous Point address | `192.168.0.17`, `1.1.1.8` | transport/pim-* |
| `$RR_NEIGHBOR_1` | Route Reflector neighbor (first) | `192.168.0.17` | transport/bgp-ibgp-rr-client |
| `$RR_NEIGHBOR_2` | Route Reflector neighbor (second) | `192.168.0.11` | transport/bgp-ibgp-rr-client |
| `$SITE_ID` | VPLS site-identifier (numeric) | `1001` | services/vpls-virtual-switch |
| `$SITE_NAME` | VPLS site name | `101` | services/vpls-virtual-switch |
| `$SPOKE_COMMUNITY` | Spoke community name (policy ref) | `spoke_1` | policy/hub-spoke-import-export |
| `$SPOKE_COMMUNITY_NAME` | Spoke community definition name | `spoke_1` | policy/hub-spoke-community |
| `$SPOKE_POLICY_NAME` | Spoke export policy-statement name | `spoke_1` | policy/hub-spoke-import-export |
| `$SPOKE_RT` | Spoke route-target community value | `target:65535:2` | policy/hub-spoke-community |
| `$UNIT` | Interface unit number | `3002`, `1501` | services/* |
| `$VC_ID` | L2CKT virtual-circuit-id | `1501` | services/l2ckt-pseudowire |
| `$VLAN` | VLAN ID | `1` | services/vpls-virtual-switch |
| `$VLAN_NAME` | VLAN name (EVO vlans syntax) | `VPLS1` | services/vpls-virtual-switch (evo) |
| `$VPLS_ID` | VPLS instance identifier | `1` | services/vpls-virtual-switch |
| `$VRF_EXPORT` | VRF export policy name | `spoke_1`, `hub_1` | services/l3vpn-vrf-spoke, ngmvpn-spoke-adv |
| `$VRF_IMPORT` | VRF import policy name | `hub_1`, `spoke_1` | services/l3vpn-vrf-spoke, ngmvpn-hub-adv |
| `$VRF_NAME` | Routing-instance name | `l3vpn_vrrp_3001_3002` | services/* |
| `$VRF_TARGET` | VRF target community value | `64510:3002` | services/* |
