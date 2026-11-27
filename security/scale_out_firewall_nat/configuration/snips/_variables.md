# Snippet variable glossary

All `.conf` files under `junos/` are templates: identifiers that vary between deployments are written as `$VAR`.
Render a snippet by substituting each placeholder with your deployment's value. The placeholders each snippet uses
are listed in its `Variables:` header and in the glossary below. Variable names and meanings follow the shared JVD
snippet vocabulary. Numbered variables (`_1`, `_2`, …) form an ordered set; the numbers carry no other meaning.

Values left literal on purpose: the names of the security objects that other configuration references by name
(security zones, the global address-book entries, which embed their prefix, NAT pools, rule sets and rules, security
policies, services-redundancy group 0 and its monitor object, the TLB instances, groups, real services and virtual
services, the network-monitoring profiles, the firewall filters and their counters); the routing-instance names
`MNHA-VR`, `VR-1`, `TRUST_VR`, `UNTRUST_VR`, `srx_mnha_group_tlb-trust_fi` and `srx_mnha_group_tlb-untrust_fi`; BGP
group names, except the SRX VR-1 groups, which differ between devices; the AS-path prepend lengths that set the
preference between the two nodes of an MNHA pair; the signal route `192.168.255.0`; the SFW, NAT and NAT64 design
prefixes; the BFD, liveness and health-check timers; the port speeds and port counts; the TLB instance interface
`lo0.0`, the MNHA node loopback `lo0.0` and the health-check sources `lo0.1` and `lo0.2`; `unit 0`, and the loopback
`lo0`.

## System, chassis and SNMP

| Variable | What it is | Example value |
|---|---|---|
| `$AE_DEVICE_COUNT` | Number of aggregated Ethernet devices the chassis creates (`aggregated-devices ethernet device-count`). | `50` |
| `$FPC_SLOT` | FPC slot number. | `0` |
| `$GROUP_A` | First configuration-group name of an ordered `apply-groups` list. | `global` |
| `$GROUP_B` | Second configuration-group name of an ordered `apply-groups` list. | `re0` |
| `$GROUP_C` | Third configuration-group name of an ordered `apply-groups` list. | `re1` |
| `$SNMP_COMMUNITY` | **new** SNMP community name (`snmp community`); a credential, supplied by the operator. | `<SNMP_COMMUNITY>` |
| `$SNMP_TRAP_TARGET_V4` | **new** IPv4 address of an SNMP trap target (`snmp trap-group <name> targets`). | `10.204.243.205` |

## Multinode High Availability

| Variable | What it is | Example value |
|---|---|---|
| `$LOOPBACK_V4` | Primary per-node IPv4 loopback address. | `192.168.0.1` |
| `$MNHA_LOCAL_ID` | **new** Local node identifier of an SRX Multinode High Availability (MNHA) node (`chassis high-availability local-id`). | `1` |
| `$MNHA_MONITOR_DST_V4` | **new** Destination IPv4 address of the BFD liveliness monitor of an MNHA services-redundancy group monitor object (`bfd-liveliness destination-ip`). | `10.1.1.1` |
| `$MNHA_MONITOR_SRC_V4` | **new** Source IPv4 address of the BFD liveliness monitor of an MNHA services-redundancy group monitor object (`destination-ip <addr> src-ip`). | `10.1.1.2` |
| `$MNHA_PEER_ID` | **new** Node identifier of the MNHA peer node (`chassis high-availability peer-id`), also named by the services-redundancy group `peer-id`. | `2` |
| `$MNHA_PEER_V4` | **new** Loopback IPv4 address of the MNHA peer node (`chassis high-availability peer-id <n> peer-ip`). | `192.168.0.2` |

## NAT and load balancing

| Variable | What it is | Example value |
|---|---|---|
| `$NAT_POOL_V4_PFX_1` | **new** IPv4 prefix of a source-NAT pool (`security nat source pool <name> address`), as configured and as routed or advertised for return traffic. Numbered `_1`, `_2`, … in source order. | `100.64.1.0/24` |
| `$NAT_POOL_V4_PFX_2` | **new** IPv4 prefix of a source-NAT pool (`security nat source pool <name> address`), as configured and as routed or advertised for return traffic. Numbered `_1`, `_2`, … in source order. | `100.64.2.0/24` |
| `$REAL_SERVICE_V4_1` | **new** IPv4 address of a Traffic Load Balancer real service (`services traffic-load-balance instance <name> real-service <name> address`). Numbered `_1`, `_2`, … in source order. | `192.168.10.1` |
| `$REAL_SERVICE_V4_2` | **new** IPv4 address of a Traffic Load Balancer real service (`services traffic-load-balance instance <name> real-service <name> address`). Numbered `_1`, `_2`, … in source order. | `192.168.10.2` |
| `$REAL_SERVICE_V6_1` | **new** IPv6 address of a Traffic Load Balancer real service (`services traffic-load-balance instance <name> real-service <name> address`). Numbered `_1`, `_2`, … in source order. | `2001:db8:1:255::1` |
| `$REAL_SERVICE_V6_2` | **new** IPv6 address of a Traffic Load Balancer real service (`services traffic-load-balance instance <name> real-service <name> address`). Numbered `_1`, `_2`, … in source order. | `2001:db8:1:255::2` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address with prefix length on an attachment (access-facing) Layer 3 unit. | `100.3.3.2/24` |
| `$AC_ADDR_V6` | IPv6 address with prefix length on an attachment (access-facing) Layer 3 unit. | `100:3:3::2/124` |
| `$AE_BUNDLE` | Aggregated Ethernet interface (`ae<n>`), as configured and as its member ports name it (`802.3ad`). | `ae10` |
| `$DESCRIPTION` | Free-text `description` of an interface, unit or BGP neighbor. | `"TLB Health-Check Source IP Addresses for TRUST VR"` |
| `$IFD` | Interface-device identifier, excluding a logical unit. | `ae10` |
| `$IFL` | Logical interface identifier, including its unit (here the trust-side unit an MNHA BFD liveliness monitor uses). | `ae1.0` |
| `$IFL_1` | Logical interface (unit included) named in one routing instance or security-zone set; `_1`, `_2`, … in source order. | `ae1.100` |
| `$IFL_2` | Logical interface (unit included) named in one routing instance or security-zone set; `_1`, `_2`, … in source order. | `ae2.100` |
| `$IFL_3` | Logical interface (unit included) named in one routing instance or security-zone set; `_1`, `_2`, … in source order. | `ae3.100` |
| `$IFL_4` | Logical interface (unit included) named in one routing instance or security-zone set; `_1`, `_2`, … in source order. | `ae4.100` |
| `$IFL_5` | Logical interface (unit included) named in one routing instance or security-zone set; `_1`, `_2`, … in source order. | `ae10.41` |
| `$LOOPBACK_IFL` | Loopback logical interface (`lo0.<unit>`) listed in a routing instance. | `lo0.1` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on a loopback unit. | `192.168.10.251/32` |
| `$LOOPBACK_V6_PFX` | IPv6 address with prefix length on a loopback unit. | `2001:db8:1:255::251/128` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `1` |
| `$VLAN` | A single VLAN identifier. | `41` |

## Routing instances and eBGP

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `65050` |
| `$ASN_CUSTOMER` | Customer-facing BGP peer autonomous-system number. | `65050` |
| `$ASN_CUSTOMER_1` | Customer-facing BGP peer AS, one of an ordered set. | `65001` |
| `$ASN_CUSTOMER_2` | Customer-facing BGP peer autonomous-system number. Numbered `_1`, `_2`, … in source order. | `65002` |
| `$ASN_LOCAL` | **new** BGP `local-as` of a routing instance where it differs from the instance's `autonomous-system`. | `65200` |
| `$BGP_EXPORT_POL` | Policy-statement name applied as a BGP `export`. | `ipv4_mx_trust-to-srx_trust_export` |
| `$BGP_EXPORT_POL_1` | Policy-statement name applied as the `export` of a BGP group; `_1`, `_2`, … number the distinct policies of one instance in source order. | `def_route_export` |
| `$BGP_EXPORT_POL_2` | Policy-statement name applied as the `export` of a BGP group; `_1`, `_2`, … number the distinct policies of one instance in source order. | `ipv4_mx_trust-to-srx_trust_export` |
| `$BGP_EXPORT_POL_3` | Policy-statement name applied as the `export` of a BGP group; `_1`, `_2`, … number the distinct policies of one instance in source order. | `ipv6_mx_trust-to-srx_trust_export` |
| `$BGP_EXPORT_POL_4` | Policy-statement name applied as the `export` of a BGP group; `_1`, `_2`, … number the distinct policies of one instance in source order. | `ipv6_def_route_export` |
| `$BGP_GROUP_1` | Name of a BGP peer group. Numbered `_1`, `_2`, … in source order. | `Vsrx-to-MX_TRUST` |
| `$BGP_GROUP_2` | Name of a BGP peer group. Numbered `_1`, `_2`, … in source order. | `Vsrx-to-MX_UNTRUST` |
| `$BGP_GROUP_3` | Name of a BGP peer group. Numbered `_1`, `_2`, … in source order. | `IPv6_Vsrx-to-MX_TRUST` |
| `$BGP_GROUP_4` | Name of a BGP peer group. Numbered `_1`, `_2`, … in source order. | `IPv6_Vsrx-to-MX_UNTRUST` |
| `$CE_PEER_V4` | IPv4 address of a VRF eBGP neighbor on the customer or external side. | `10.3.1.1` |
| `$CE_PEER_V4_1` | IPv4 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.1.2` |
| `$CE_PEER_V4_2` | IPv4 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.2.2` |
| `$CE_PEER_V4_3` | IPv4 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.3.2` |
| `$CE_PEER_V4_4` | IPv4 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.4.2` |
| `$CE_PEER_V4_5` | IPv4 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.1.2.2` |
| `$CE_PEER_V6` | IPv6 address of a VRF eBGP neighbor on the customer or external side. | `2001:db8:172:1:1::1` |
| `$CE_PEER_V6_1` | IPv6 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `2001:db8:1:1:3::2` |
| `$CE_PEER_V6_2` | IPv6 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `2001:db8:1:1:4::2` |
| `$CE_PEER_V6_3` | IPv6 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `2001:db8:1:1:1::2` |
| `$CE_PEER_V6_4` | IPv6 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `2001:db8:1:1:2::2` |
| `$CE_PEER_V6_5` | IPv6 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `2001:db8:172:1:1::2` |
| `$NEXT_HOP_V4` | IPv4 next-hop address of a static route (`route <prefix> next-hop`). | `172.16.8.1` |
| `$NEXT_HOP_V6` | IPv6 next-hop address of a static route (`route <prefix> next-hop`). | `2001:db8:172:16:8::1` |
| `$PE_LOCAL_V4` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. | `10.3.1.2` |
| `$PE_LOCAL_V4_1` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.1.1` |
| `$PE_LOCAL_V4_2` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.2.1` |
| `$PE_LOCAL_V4_3` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.3.1` |
| `$PE_LOCAL_V4_4` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.4.1` |

## Policy

| Variable | What it is | Example value |
|---|---|---|
| `$CONDITION_NAME` | Name of a routing-policy condition (`policy-options condition`), as defined and as a policy term references it. | `srg_sig_route_exist` |
| `$POLICY_NAME` | Name of a routing policy-statement where no role-specific name (BGP export or import, VRF import or export, load balancing) applies. | `pfe_lb_hash` |
| `$PPLB_NAME` | Name of a load-balancing policy (per-packet or per-flow), as exported to the forwarding table and as defined. | `ecmp_policy_lab` |
| `$PREFIX` | IPv4 or IPv6 prefix in a route filter or route-filter list. | `192.168.10.251/32` |
| `$ROUTE_FILTER_LIST` | Name of a route-filter list, as defined and as a policy references it. | `nat_pool_route_filter_list` |
| `$TERM_NAME` | Name of a policy-statement or firewall filter term. | `ALL-ELSE` |
| `$TERM_NAME_1` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `NAT64_tlb_traffic_traffic` |
| `$TERM_NAME_2` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `other_traffic` |
| `$TERM_NAME_3` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `other_traffic` |
| `$TERM_NAME_4` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `4` |
| `$TERM_NAME_5` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `5` |
| `$TERM_NAME_6` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `6` |
| `$TERM_NAME_7` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `7` |
