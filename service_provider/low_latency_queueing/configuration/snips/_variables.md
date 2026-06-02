# Template Variables — LLQ Snip Library

Variables used in templatized snip bodies. Replace `<variable>` placeholders
with site-specific values when deploying.

## Interface & Unit Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `<ae-interface>` | Aggregated Ethernet interface name | `ae11`, `ae26` |
| `<interface>` | Any physical or logical interface | `et-1/0/1`, `ae26`, `xe-0/1/3:2` |
| `<unit-number>` | Logical unit on the interface | `0`, `101`, `901`, `2501` |

## Addressing & Identity

| Variable | Description | Example |
|----------|-------------|---------|
| `<router-id>` | Device router-id (usually primary loopback) | `192.168.1.3` |
| `<loopback-address>` | BGP local-address (loopback for iBGP) | `192.168.1.3` |
| `<peer-address>` | BGP neighbor address | `192.168.1.9` |
| `<secondary-loopback-v4>` | Additional loopback for SR advertisement | `192.168.10.3` |
| `<secondary-loopback-v6>` | IPv6 secondary loopback for SR | `2001:db8::1:1:10:3` |

## Segment Routing

| Variable | Description | Example |
|----------|-------------|---------|
| `<ipv4-sid-index>` | SR node-segment IPv4 index (unique per device) | `14` |
| `<ipv6-sid-index>` | SR node-segment IPv6 index | `114` |
| `<ipv4-secondary-sid-index>` | SR prefix-segment index for secondary loopback | `214` |
| `<ipv6-secondary-sid-index>` | SR prefix-segment index for secondary IPv6 loopback | `314` |

## Service Instance Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `<instance-name>` | Routing-instance name | `FRONTHAUL-EVPN-VPWS-MH-AN1-1` |
| `<description>` | Human-readable instance description | `L3VPN-IRB-ANYCAST-GATEWAY-MH-1` |
| `<rd-value>` | Route-distinguisher numeric suffix | `3401` |
| `<rd-index>` | RD index (for mac-vrf pattern) | `101` |
| `<rt-value>` | Route-target numeric suffix | `3401` |
| `<rt-index>` | RT index (for mac-vrf pattern) | `101` |
| `<asn>` | Autonomous system number | `63535` |
| `<local-id>` | VPWS local service-id | `1`, `2` |
| `<remote-id>` | VPWS remote service-id | `2`, `1` |

## VLAN & Bridge Domain

| Variable | Description | Example |
|----------|-------------|---------|
| `<vlan-id>` | 802.1Q VLAN identifier | `101`, `901`, `2501` |
| `<vlan-name>` | VLAN name in vlans stanza | `vlan201` |
| `<bridge-domain-name>` | Bridge-domain identifier | `BD_EVPN_ELAN_1501` |
| `<irb-unit>` | IRB interface unit number | `101`, `351` |

## LAG & Multi-Homing

| Variable | Description | Example |
|----------|-------------|---------|
| `<lacp-system-id>` | LACP system-id (shared across AG pair) | `00:00:00:00:00:01` |
| `<esi-value>` | EVPN ESI (10-byte, per-unit unique) | `00:51:11:11:11:11:11:00:00:01` |
| `<service-description>` | Per-unit description string | `FRONTHAUL-EVPN-VPWS-MH-AN1-1` |

## Firewall / MAC Classification

| Variable | Description | Example |
|----------|-------------|---------|
| `<filter-name>` | Firewall filter name | `FF-MFC-IPV4-L3VPN-BD-IRB` |
| `<ecpri-user-plane-mac-N>` | eCPRI user-plane source MAC | `00:0c:0d:00:00:01` |
| `<ecpri-ctrl-plane-mac-N>` | eCPRI control-plane source MAC | `00:0c:0e:00:00:01` |
| `<ecpri-sync-mac-N>` | eCPRI sync source MAC | `00:0c:0f:00:00:01` |
| `<timing-sync-mac-N>` | PTP/timing destination MAC | `00:0c:22:00:00:01` |

## OAM / CFM

| Variable | Description | Example |
|----------|-------------|---------|
| `<md-name>` | Maintenance domain name | `MD_63535` |
| `<level>` | CFM maintenance-domain level (0-7) | `5` |
| `<ma-id>` | Maintenance association identifier | `2501` |
| `<local-mep-id>` | Local MEP identifier | `1003` |
| `<remote-mep-id>` | Remote MEP identifier | `1001` |

## BGP Groups

| Variable | Description | Example |
|----------|-------------|---------|
| `<group-name>` | BGP group name | `ibgp_meg_rr`, `ibgp_cr` |
| `<site-name>` | BGP-VPLS site name | `r2`, `r11` |
| `<site-id>` | BGP-VPLS site-identifier | `1003`, `1011` |
