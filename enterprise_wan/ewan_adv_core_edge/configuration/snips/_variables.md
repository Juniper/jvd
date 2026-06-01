# Snip Variable Reference

Variables used across the `ewan_adv_core_edge` snip library. Replace `$VARIABLE` placeholders
with site-specific values when adapting snips to a new deployment.

## Interfaces

| Variable | Example | Used in |
|----------|---------|---------|
| `$CORE_INTF` | `et-0/0/1` | physical-uplink-mpls, rewrite-rules-exp |
| `$ACCESS_INTF` | `xe-0/0/9:0` | rewrite-rules-exp, vlan-ccc-esi |
| `$LAG_INTF` | `ae0` | lag-flexible-services |
| `$LAG_MEMBER` | `xe-0/0/9:0` | lag-flexible-services |
| `$UNIT` | `301` | vlan-ccc-esi, irb-gateway, rewrite-rules-exp |
| `$VLAN_ID` | `301` | vlan-ccc-esi, irb-gateway |
| `$LOOPBACK_IPV4` | `192.168.0.1/32` | loopback |
| `$LOOPBACK_IPV6` | `fd00::1/128` | loopback |
| `$IRB_IPV4` | `10.0.1.1/24` | irb-gateway |
| `$MTU` | `9192` | physical-uplink-mpls |

## Transport / Routing

| Variable | Example | Used in |
|----------|---------|---------|
| `$ROUTER_ID` | `192.168.0.1` | bgp-ibgp-evpn, ospf-sr-lfa |
| `$AS_NUMBER` | `65001` | bgp-ibgp-evpn |
| `$RR_PEER` | `192.168.0.100` | bgp-ibgp-evpn |
| `$AREA` | `0.0.0.0` | ospf-sr-lfa |
| `$SRGB_START` | `400000` | ospf-sr-lfa |
| `$SRGB_SIZE` | `4096` | ospf-sr-lfa |
| `$NODE_INDEX` | `1` | ospf-sr-lfa |
| `$LSP_NAME` | `to-wanedge2` | mpls-lsp |
| `$LSP_DESTINATION` | `192.168.0.2` | mpls-lsp |
| `$BW_MBPS` | `1000m` | rsvp-te |

## Services (EVPN / VPN)

| Variable | Example | Used in |
|----------|---------|---------|
| `$VPN_INSTANCE` | `vpws_group_14_1` | evpn-fxc-vlan-aware, evpn-vpws-vlan-based |
| `$RD` | `192.168.0.1:14001` | all services |
| `$RT_IMPORT` | `target:65001:14001` | all services |
| `$RT_EXPORT` | `target:65001:14001` | all services |
| `$LOCAL_ID` | `1` | evpn-fxc-vlan-aware, evpn-vpws-vlan-based |
| `$REMOTE_ID` | `2` | evpn-fxc-vlan-aware, evpn-vpws-vlan-based |
| `$FXC_INTF` | `lsi.*` | evpn-fxc-vlan-aware |
| `$ELAN_VNI` | `5001` | evpn-elan-vlan-based (if extended) |

## CoS / QoS

| Variable | Example | Used in |
|----------|---------|---------|
| `$REWRITE_NAME` | `EXP-REWRITE` | rewrite-rules-exp |
| `$CLASSIFIER_NAME` | `EXP` / `8021P` | rewrite-rules-exp |

## Firewall / Security

| Variable | Example | Used in |
|----------|---------|---------|
| `$FILTER_NAME` | `filter_ip_dport1` | filter-ipv4-stateless |
| `$PROTOCOL` | `tcp` | filter-ipv4-stateless |
| `$DST_PORT` | `80` | filter-ipv4-stateless |
| `$NEXT_HOP` | `192.168.56.2/32` | filter-ipv4-stateless |
| `$NEXT_INTF` | `et-0/0/1` | filter-ipv4-stateless |

## OAM (802.1ag CFM)

| Variable | Example | Used in |
|----------|---------|---------|
| `$MD_NAME` | `m-d301` | cfm-maintenance-domain |
| `$MD_LEVEL` | `3` | cfm-maintenance-domain |
| `$MA_NAME` | `m-a301` | cfm-maintenance-domain |
| `$MEP_ID` | `1` | cfm-maintenance-domain |
| `$MEP_INTF` | `xe-0/0/9:0.301` | cfm-maintenance-domain |
| `$CC_INTERVAL` | `1s` | cfm-maintenance-domain |
| `$PROFILE_DELAY` | `i1` | cfm-sla-iterator |
| `$PROFILE_SLM` | `i2` | cfm-sla-iterator |
| `$INTERVAL` | `5` | cfm-sla-iterator |

## Bootstrap / Platform

| Variable | Example | Used in |
|----------|---------|---------|
| `$DEVICE_COUNT` | `25` | chassis-network-services |
