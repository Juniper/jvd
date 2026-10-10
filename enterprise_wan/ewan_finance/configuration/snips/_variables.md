# Snippet variable glossary

All `.conf` files under `junos/` and `evo/` are templates: identifiers that vary
between deployments are written as `$VAR`. Render a snippet by substituting each
placeholder with your deployment's value. The placeholders each snippet uses are
listed in its `Variables:` header and in the glossary below. Variable names and
meanings follow the shared JVD snippet vocabulary; entries marked **new** were
introduced by this JVD. Numbered variables (`_1`, `_2`, …) form an ordered set;
the numbers carry no other meaning.

Values left literal on purpose: class-of-service object names (`EXP`, `EXP_REWRITE`,
`sched-map`, `s0`–`s3`, forwarding classes), firewall filter and term names, BGP group
names, the `P2MP` LSP template, scheduler rates, BFD timers and the multicast
rate limits. The TWAMP forms are complete deployed test plans and carry no variables.

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `64512` |
| `$ASN_CUSTOMER` | Customer-facing BGP peer autonomous-system number. | `64513` |
| `$ASN_CUSTOMER_1` | **new** Customer-facing BGP peer AS of the first customer router (`_1`/`_2` follow the BGP groups). | `64520` |
| `$ASN_CUSTOMER_2` | **new** Customer-facing BGP peer AS of the second customer router. | `64521` |
| `$ASN_PROVIDER` | **new** Provider (WAN) autonomous-system number of the eBGP neighbor, as configured on a CE. | `64512` |
| `$ISO_NET` | ISO network entity title on lo0 `family iso`. | `47.0005.80ff.f800.0000.0108.0001.0102.5516.3058.00` |
| `$LOOPBACK_ANYCAST_V4` | Shared anycast IPv4 loopback address. | `10.10.47.101` |
| `$LOOPBACK_MGMT_V4_PFX` | Management-network lo0 IPv4 `/32` configured alongside the design loopback. | `10.255.163.58/32` |
| `$LOOPBACK_V4` | Primary per-node IPv4 loopback address. | `10.200.50.13` |
| `$LOOPBACK_V4_PFX` | This node's lo0 IPv4 written with its `/32` prefix length (address form). | `10.200.50.9/32` |
| `$LOOPBACK_V6_PFX` | This node's lo0 IPv6 written with its `/128` prefix length. | `2001:db8::10:255:163:58/128` |
| `$ROUTER_ID` | Complete router identifier in IPv4 dotted-decimal form. | `10.200.50.9` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address on a routed attachment-circuit unit. | `10.101.201.1/24` |
| `$AC_IFL` | Full logical attachment-circuit interface identifier, including its unit. | `ae0.1` |
| `$AC_IFL_A` | **new** First attachment logical interface (with unit) of a set; `_A`…`_E` order the members. | `ae0.1` |
| `$AC_IFL_B` | **new** Second attachment logical interface (with unit) of a set. | `et-0/0/47.1` |
| `$AE_BUNDLE` | Aggregated-Ethernet bundle a member link joins (`802.3ad`). | `ae0` |
| `$AE_DEVICE_COUNT` | Number of aggregated-Ethernet devices the chassis allocates. | `25` |
| `$BREAKOUT_SUB_PORTS` | Number of breakout sub-ports | `4` |
| `$CORE_INTF_1` | Ordered core-facing logical interfaces named in one protocol stanza (`_1`–`_4` follow configuration order). | `et-0/0/0.0` |
| `$CORE_INTF_2` | Ordered core-facing logical interfaces named in one protocol stanza (`_1`–`_4` follow configuration order). | `et-0/0/3.0` |
| `$CORE_INTF_3` | Ordered core-facing logical interfaces named in one protocol stanza (`_1`–`_4` follow configuration order). | `et-0/0/1.0` |
| `$CORE_INTF_4` | Ordered core-facing logical interfaces named in one protocol stanza (`_1`–`_4` follow configuration order). | `et-0/0/4.0` |
| `$CORE_V4_ADDR` | Core interface IPv4 address. | `10.101.23.2/24` |
| `$COS_INTF` | Interface to which the class-of-service configuration is applied, physical or aggregated and independent of topology role. | `et-0/0/0` |
| `$DESCRIPTION` | Free-text interface `description`. | `"L2/L3 to WANEDGE1/2"` |
| `$DF_PREFERENCE` | Designated-forwarder election preference value of an Ethernet segment (`df-election-type preference value`); higher wins. | `150` |
| `$ESI` | 10-byte Ethernet segment identifier (EVPN multihoming). | `00:11:11:11:11:11:12:12:12:12` |
| `$IFD` | Interface-device identifier, excluding a logical unit. | `ae0` |
| `$IFL` | **new** A logical interface (unit included) named in a protocol or instance stanza. | `et-0/0/11.100` |
| `$IFL_1` | **new** First logical interface (unit included) of an ordered set named in one instance. | `et-0/0/42.1` |
| `$IFL_2` | **new** Second logical interface of the same ordered set. | `et-0/0/48.1` |
| `$IFL_3` | **new** Third logical interface of the same ordered set. | `et-0/0/49.1` |
| `$INPUT_FILTER` | **new** Firewall filter applied as `filter input` on a logical interface. | `mfc-filter` |
| `$IRB_ADDR` | IPv4 address configured on an `irb` unit. | `172.16.1.1/24` |
| `$IRB_UNIT` | irb.X unit number for IRB integration. | `1` |
| `$LACP_SYS_ID` | LACP system-id on a multihomed LAG; identical on every device attached to the same Ethernet segment. | `00:00:00:00:00:10` |
| `$STATIC_MAC` | Static MAC address configured on an interface (here an IRB unit). | `00:10:94:00:00:01` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `0` |
| `$VLAN` | A single VLAN identifier. | `100` |
| `$VLAN_NAME` | Name of a `vlans` definition. | `vlan1` |

## Routing, BGP and policy

| Variable | What it is | Example value |
|---|---|---|
| `$BGP_EXPORT_POL` | **new** Name of the policy a BGP group applies with `export`. | `PS-ADV_DIRECT` |
| `$BGP_EXPORT_POL_1` | **new** First policy in a BGP group `export [ … ]` list; order is evaluation order. | `PS-send-ospf` |
| `$BGP_EXPORT_POL_2` | **new** Second policy in the same BGP `export` list. | `PS-BGP-TO-OSPF` |
| `$CE_PEER_V4` | IPv4 address of the external BGP peer (CE). | `172.16.21.2` |
| `$CE_PEER_V4_1` | **new** IPv4 address of the first customer-router eBGP neighbor. | `10.101.48.42` |
| `$CE_PEER_V4_2` | **new** IPv4 address of the second customer-router eBGP neighbor. | `10.101.49.42` |
| `$IBGP_PEER_V4` | **new** IPv4 address of the internal BGP neighbor of a routing instance. | `10.101.81.2` |
| `$IBGP_PEER_V4_1` | **new** Loopback of an internal BGP neighbor; `_1`–`_5` follow the neighbor order of the group. | `10.200.50.15` |
| `$IBGP_PEER_V4_2` | **new** Loopback of an internal BGP neighbor; `_1`–`_5` follow the neighbor order of the group. | `10.200.50.14` |
| `$IBGP_PEER_V4_3` | **new** Loopback of an internal BGP neighbor; `_1`–`_5` follow the neighbor order of the group. | `10.200.50.12` |
| `$IBGP_PEER_V4_4` | **new** Loopback of an internal BGP neighbor; `_1`–`_5` follow the neighbor order of the group. | `10.200.50.11` |
| `$IBGP_PEER_V4_5` | **new** Loopback of an internal BGP neighbor; `_1`–`_5` follow the neighbor order of the group. | `10.200.50.16` |
| `$LSP_NAME_1` | **new** Name of an RSVP-TE label-switched path; `_1`–`_3` follow configuration order. | `lsp_to_PE2` |
| `$LSP_NAME_2` | **new** Name of an RSVP-TE label-switched path; `_1`–`_3` follow configuration order. | `lsp_to_PE1` |
| `$LSP_NAME_3` | **new** Name of an RSVP-TE label-switched path; `_1`–`_3` follow configuration order. | `lsp_to_AP1` |
| `$LSP_TO_V4_1` | **new** Egress (`to`) loopback of the matching label-switched path. | `10.200.50.15` |
| `$LSP_TO_V4_2` | **new** Egress (`to`) loopback of the matching label-switched path. | `10.200.50.12` |
| `$LSP_TO_V4_3` | **new** Egress (`to`) loopback of the matching label-switched path. | `10.200.50.14` |
| `$MATCH_DEST_V4_PFX_1` | **new** Destination IPv4 prefix a firewall term matches; `_1`/`_2` follow term order. | `10.8.21.2/32` |
| `$MATCH_DEST_V4_PFX_2` | **new** Second destination IPv4 prefix in the same term. | `10.9.21.2/32` |
| `$OSPF_EXPORT_POL` | **new** Name of the policy OSPF applies with `export` inside a routing instance. | `PS-send-ospf` |
| `$PE_LOCAL_V4` | PE local IPv4 address of the PE-CE eBGP session (MEBS `$CE_PEER_V4` / `$PE_LOCAL_V4`). | `172.16.21.1` |
| `$PE_LOCAL_V4_1` | **new** PE local address of the eBGP session to the first customer router. | `10.101.48.41` |
| `$PE_LOCAL_V4_2` | **new** PE local address of the eBGP session to the second customer router. | `10.101.49.41` |
| `$PE_PEER_V4_1` | **new** IPv4 address of the first WAN-edge (PE) eBGP neighbor, as configured on a CE; `_1`/`_2` follow the neighbor order. | `10.101.48.1` |
| `$PE_PEER_V4_2` | **new** IPv4 address of the second PE eBGP neighbor in the same group. | `10.101.78.1` |
| `$POLICY_NAME` | Policy-statement name where the name is the object the body defines. | `PS-BGP-TO-OSPF` |
| `$PREFIX` | Prefix a route-filter matches where the prefix itself is what the policy selects. | `10.101.0.0/16` |

## Services and multicast

| Variable | What it is | Example value |
|---|---|---|
| `$BD_NAME` | Bridge-domain (VLAN) name inside an EVPN instance. | `BD_EVPN_GROUP1` |
| `$INSTANCE_NAME` | Identity stem of a service instance. | `VIRTUAL-ROUTER-V1` |
| `$MCAST_GROUP_V4_PFX` | **new** IPv4 multicast group prefix: a PIM RP group range, a selective provider-tunnel group or a filter destination. | `225.0.0.0/22` |
| `$MVPN_RT_ID` | **new** Route-target Assigned Number of the MVPN `route-target` import/export target (Administrator is `$RT_AS`). | `101` |
| `$PIM_RP_V4` | **new** IPv4 address of a PIM rendezvous point (static RP, or the local RP address on the RP itself). | `10.10.47.101` |
| `$RD_SUB_ASSIGNED` | Route Distinguisher Assigned Number subfield. | `1` |
| `$RT_AS` | Route Target Administrator subfield. | `61535` |
| `$RT_ID` | Route Target Assigned Number subfield. | `1` |

## Platform

| Variable | What it is | Example value |
|---|---|---|
| `$FPC_SLOT` | FPC slot for a complete source-measured hardware profile. | `1` |
| `$PIC_SLOT` | PIC slot within an FPC. | `0` |
