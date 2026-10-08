# Snippet variable glossary

All `.conf` files under `junos/` and `evo/` are templates: identifiers that vary
between deployments are written as `$VAR`. Render a snippet by substituting each
placeholder with your deployment's value. The placeholders each snippet uses are
listed in its `Variables:` header and in the glossary below. Variable names and
meanings follow the shared JVD snippet vocabulary; entries marked **new** were
introduced by this JVD. Numbered variables (`_1`, `_2`, …) form an ordered set;
the numbers carry no other meaning.

Values left literal on purpose: names other configuration refers to (dynamic
profiles, access profiles, address pools, routing instances, policies,
communities, filters, BGP groups) and JVD-wide constants such as the SRGB range.
The `$junos-*` placeholders inside `dynamic-profiles` are resolved at runtime by
the BNG subscriber-management daemons; they are not user variables and must be
left as-is in any rendered configuration.

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `65001` |
| `$ASN_CUSTOMER_V4` | **new** Customer-facing BGP peer AS of the IPv4 neighbor. | `200` |
| `$ASN_CUSTOMER_V6` | **new** Customer-facing BGP peer AS of the IPv6 neighbor. | `300` |
| `$ISIS_NET` | ISIS NET (area + system-id) configured on lo0. | `49.0000.0010.0100.0005.00` |
| `$LOOPBACK_ALT_V4_PFX` | Additional lo0 IPv4 `/32` configured on one node besides its design and management loopbacks. | `172.17.17.7/32` |
| `$LOOPBACK_V4` | Primary per-node IPv4 loopback address. | `192.168.0.5` |
| `$LOOPBACK_V4_PFX` | This node's lo0 IPv4 written with its `/32` prefix length (address form). | `192.168.0.5/32` |
| `$LOOPBACK_V6` | This PE's lo0 IPv6. | `2001:db8::192:168:0:5` |
| `$LOOPBACK_V6_PFX` | This node's lo0 IPv6 written with its `/128` prefix length. | `2001:db8::192:168:0:5/128` |
| `$ROUTER_ID` | Complete router identifier in IPv4 dotted-decimal form. | `192.168.0.5` |
| `$RR1_V4` | IPv4 loopback of a BGP route reflector this node peers with; `RR1`–`RR3` order the reflectors. | `192.168.0.5` |
| `$RR2_V4` | IPv4 loopback of a second BGP route reflector. | `192.168.0.6` |
| `$RR3_V4` | **new** IPv4 loopback of the third BGP route reflector a client peers with. | `192.168.0.11` |
| `$SR_INDEX_V4` | Segment-routing node index attached to the IPv4 loopback prefix (`prefix-segment index`). | `1005` |
| `$SR_INDEX_V6` | Segment-routing node index attached to the IPv6 loopback prefix (`prefix-segment index`). | `4005` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address on a routed attachment-circuit unit. | `10.11.110.1/24` |
| `$AC_ADDR_V6` | IPv6 address on a routed attachment-circuit unit. | `2001:db8::11:11:110:1/120` |
| `$AC_IFL` | Full logical attachment-circuit interface identifier, including its unit. | `ae1.1031` |
| `$AE_BUNDLE` | Aggregated-Ethernet bundle a member link joins (`802.3ad`). | `ae1` |
| `$AE_DEVICE_COUNT` | Number of aggregated-Ethernet devices the chassis allocates. | `25` |
| `$ANCHOR_PIC` | Anchor tunnel PIC (`lt-`) hosting the pseudowire-subscriber device. | `lt-0/0/0` |
| `$BREAKOUT_SUB_PORTS` | Number of breakout sub-ports | `4` |
| `$CORE_INTF` | Core-facing interface: the IS-IS logical unit, or a physical member of a core aggregated bundle. | `et-0/0/29` |
| `$CORE_V4_ADDR` | Core interface IPv4 address. | `10.10.115.1/24` |
| `$CORE_V6_ADDR` | Core interface IPv6 address. | `2001:db8::10:10:115:1:1/120` |
| `$DESCRIPTION` | Free-text interface `description`. | `R0-AN1-To-R12-SW1` |
| `$FPC_SLOT` | FPC slot for a complete source-measured hardware profile. | `0` |
| `$IFD` | Interface-device identifier, excluding a logical unit. | `ae0` |
| `$LACP_SYS_ID` | LACP system-id on a multihomed LAG. | `00:00:00:00:01:01` |
| `$PIC_SLOT` | PIC slot within an FPC. | `0` |
| `$STATIC_MAC` | **new** Static MAC address configured on an interface device. | `aa:aa:aa:bb:bb:bb` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `0` |
| `$UNIT_A` | First of the logical units bundled under one flexible cross-connect group. | `1065` |
| `$UNIT_B` | Second of the logical units bundled under one flexible cross-connect group. | `1066` |
| `$VLAN` | A single VLAN identifier. | `1002` |

## Services (EVPN-VPWS, VRFs)

| Variable | What it is | Example value |
|---|---|---|
| `$CE_PEER_V4` | IPv4 address of the external BGP peer (CE). | `10.11.110.2` |
| `$CE_PEER_V6` | IPv6 address of the external BGP peer (CE). | `2001:db8::11:11:110:2` |
| `$DF_PREFERENCE` | Designated-forwarder election preference value on an all-active ESI (`df-election-type preference value`); higher wins. | `1000` |
| `$ESI` | 10-byte ESI (for EVPN multihoming). | `00:15:15:15:00:00:00:15:15:15` |
| `$INSTANCE_NAME` | Identity stem of a service instance. | `METRO_BBE_EVPN_FXC_IPoE-GROUP_1` |
| `$NEXT_HOP_V4` | **new** Explicit IPv4 next hop set by a routing policy. | `192.168.0.11` |
| `$NEXT_HOP_V6` | **new** Explicit IPv6 next hop set by a routing policy. | `2001:db8::192:168:0:b` |
| `$RD_SUB_ADMIN` | Route Distinguisher Administrator subfield. | `100.100.100.100` |
| `$RD_SUB_ASSIGNED` | Route Distinguisher Assigned Number subfield. | `3001` |
| `$RT_AS` | Route Target Administrator subfield. | `20000` |
| `$RT_ID` | Route Target Assigned Number subfield. | `1031` |
| `$SVC_ID_LOCAL` | EVPN-VPWS local service-id of a flexible cross-connect group. | `5002` |
| `$SVC_ID_REMOTE` | EVPN-VPWS remote service-id of a flexible cross-connect group. | `6002` |
| `$VPWS_SVC_ID_LOCAL` | EVPN-VPWS local service-id. | `1` |
| `$VPWS_SVC_ID_REMOTE` | EVPN-VPWS remote service-id. | `21` |

## Subscriber management (BNG)

| Variable | What it is | Example value |
|---|---|---|
| `$DOMAIN_NAME` | **new** Domain appended to a generated subscriber username. | `example.net` |
| `$NAS_IDENTIFIER` | **new** RADIUS NAS-Identifier string. | `R7-BNG1` |
| `$PEER_SUBSCRIBER_V4_GW_1` | **new** Another BNG's subscriber IPv4 gateway, one of an ordered set. | `10.42.0.1` |
| `$PEER_SUBSCRIBER_V4_GW_2` | **new** Another BNG's subscriber IPv4 gateway, one of an ordered set. | `10.43.0.1` |
| `$PEER_SUBSCRIBER_V4_GW_3` | **new** Another BNG's subscriber IPv4 gateway, one of an ordered set. | `10.45.0.1` |
| `$PEER_SUBSCRIBER_V6_PFX_1` | **new** Another BNG's subscriber IPv6 prefix, one of an ordered set. | `fc00:125:140::/64` |
| `$PEER_SUBSCRIBER_V6_PFX_2` | **new** Another BNG's subscriber IPv6 prefix, one of an ordered set. | `fc00:126:140::/64` |
| `$PEER_SUBSCRIBER_V6_PFX_3` | **new** Another BNG's subscriber IPv6 prefix, one of an ordered set. | `fc00:128:140::/64` |
| `$PS_DEVICE_COUNT` | Allocated pseudowire-subscriber devices; greater than the configured device count and highest PS index. | `100` |
| `$RADIUS_SECRET` | **new** RADIUS shared secret. | `"<RADIUS_SECRET_VLAN_AUTH_ACCESS1>"` |
| `$RADIUS_SERVER_V4` | **new** IPv4 address of a RADIUS server. | `192.0.2.2` |
| `$RADIUS_SOURCE_V4` | **new** IPv4 source address for RADIUS requests. | `192.168.17.17` |
| `$REDUNDANCY_SHARED_KEY` | **new** Subscriber-redundancy shared key. | `"<REDUNDANCY_SHARED_KEY_PS11>"` |
| `$SUBSCRIBER_V4_GW` | **new** Gateway address of this BNG's subscriber IPv4 pool. | `10.44.0.1` |
| `$SUBSCRIBER_V4_PFX_1` | **new** Subscriber IPv4 address prefix, one of an ordered set. | `10.25.0.0/16` |
| `$SUBSCRIBER_V4_PFX_2` | **new** Subscriber IPv4 address prefix, one of an ordered set. | `10.43.0.0/16` |
| `$SUBSCRIBER_V4_PFX_3` | **new** Subscriber IPv4 address prefix, one of an ordered set. | `10.44.0.0/16` |
| `$SUBSCRIBER_V4_PFX_4` | **new** Subscriber IPv4 address prefix, one of an ordered set. | `10.45.0.0/16` |
| `$SUBSCRIBER_V4_POOL` | **new** This BNG's DHCP subscriber IPv4 pool network. | `10.44.0.0/16` |
| `$SUBSCRIBER_V4_RANGE_HIGH` | **new** Last address of a subscriber IPv4 pool range. | `10.44.255.254` |
| `$SUBSCRIBER_V4_RANGE_LOW` | **new** First address of a subscriber IPv4 pool range. | `10.44.0.2` |
| `$SUBSCRIBER_V6_PFX_1` | **new** Subscriber IPv6 prefix, one of an ordered set. | `fc00:25:140::/48` |
| `$SUBSCRIBER_V6_PFX_2` | **new** Subscriber IPv6 prefix, one of an ordered set. | `fc00:126:140::/48` |
| `$SUBSCRIBER_V6_PFX_3` | **new** Subscriber IPv6 prefix, one of an ordered set. | `fc00:127:140::/48` |
| `$SUBSCRIBER_V6_PFX_4` | **new** Subscriber IPv6 prefix, one of an ordered set. | `fc00:128:140::/48` |
| `$SUBSCRIBER_V6_POOL` | **new** This BNG's DHCP subscriber IPv6 pool prefix. | `fc00:127:140::/64` |
| `$SUBSCRIBER_V6_RANGE_HIGH` | **new** Last address of a subscriber IPv6 pool range. | `fc00:127:140::ffff/128` |
| `$SUBSCRIBER_V6_RANGE_LOW` | **new** First address of a subscriber IPv6 pool range. | `fc00:127:140::2/128` |
| `$USER_PASS` | **new** Subscriber authentication password. | `"<USER_PASS>"` |
| `$USER_PREFIX` | **new** Prefix of a generated subscriber username. | `pwht_dhcp` |
