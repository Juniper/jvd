# Snippet variable glossary

All `.conf` files under `junos/` are templates: identifiers that vary between deployments are written as `$VAR`.
Render a snippet by substituting each placeholder with your deployment's value. The placeholders each snippet uses
are listed in its `Variables:` header and in the glossary below. Variable names and meanings follow the shared JVD
snippet vocabulary. Numbered variables (`_1`, `_2`, …) form an ordered set; the numbers carry no other meaning.

Values left literal on purpose: the names of the security objects that other configuration references by name
(security zones, the global address-book entries, which embed their prefix, the ESP application, the IKE and IPsec
proposals, policies, gateways and VPNs, security policies, the TLB instance, group, real services and virtual service,
the network-monitoring profiles, the service-sets, the firewall filter and its counters); the prefix-list names; the
routing-instance names `MNHA-VR`, `TRUST_VR`, `UNTRUST_VR`, `client` and `srx-tproxy-fi`; BGP group names; the IKE
anycast address `10.100.0.1`, the responder and initiator identities, the IKE initiator local addresses and the
IPsec traffic selectors; the MNHA signal routes `192.168.255.0` and `192.168.255.1`, the activeness priorities and the
AS-path prepend lengths that set the preference between the two nodes of an MNHA pair; the IKE, IPsec and data
prefixes of the design; the BFD, liveness, DPD and health-check timers; the port speeds and port counts; the TLB
instance interface `lo0.1`, the MNHA node loopback `lo0.0`, the AMS units the service-sets name and the st0 units the
VPNs bind; `unit 0`, and the loopback `lo0`. Credentials (pre-shared keys, passwords, RADIUS secrets, the SNMP
community) are variables whose example is a placeholder: supply your own.

## System, chassis and SNMP

| Variable | What it is | Example value |
|---|---|---|
| `$AE_DEVICE_COUNT` | Number of aggregated Ethernet devices the chassis creates (`aggregated-devices ethernet device-count`). | `16` |
| `$DOMAIN_SEARCH_1` | **new** Domain in the system DNS search list (`system domain-search`). Numbered `_1`, `_2`, … in source order. | `englab.juniper.net` |
| `$DOMAIN_SEARCH_2` | **new** Domain in the system DNS search list (`system domain-search`). Numbered `_1`, `_2`, … in source order. | `spglab.juniper.net` |
| `$DOMAIN_SEARCH_3` | **new** Domain in the system DNS search list (`system domain-search`). Numbered `_1`, `_2`, … in source order. | `dcbg.juniper.net` |
| `$DOMAIN_SEARCH_4` | **new** Domain in the system DNS search list (`system domain-search`). Numbered `_1`, `_2`, … in source order. | `juniper.net` |
| `$DOMAIN_SEARCH_5` | **new** Domain in the system DNS search list (`system domain-search`). Numbered `_1`, `_2`, … in source order. | `jnpr.net` |
| `$ENCRYPTED_PASSWORD` | Encrypted (hashed) login password; secret, supplied by the operator (the published value is sanitized). | `"<ENCRYPTED_PASSWORD>"` |
| `$FPC_SLOT` | FPC slot number. | `0` |
| `$GROUP_A` | First configuration-group name of an ordered `apply-groups` list. | `global` |
| `$GROUP_B` | Second configuration-group name of an ordered `apply-groups` list. | `re0` |
| `$GROUP_C` | Third configuration-group name of an ordered `apply-groups` list. | `re1` |
| `$LOGIN_UID_1` | Numeric user ID (`uid`) of the login account with the same number. | `928` |
| `$LOGIN_USER_1` | Name of a local login account; `_1`, `_2` order the accounts. | `regress` |
| `$NAME_SERVER_V4_1` | **new** IPv4 address of a DNS name server (`system name-server`). Numbered `_1`, `_2`, … in source order. | `10.92.236.2` |
| `$NAME_SERVER_V4_2` | **new** IPv4 address of a DNS name server (`system name-server`). Numbered `_1`, `_2`, … in source order. | `10.102.152.11` |
| `$RADIUS_SECRET_1` | RADIUS shared secret. Numbered `_1`, `_2`, … in source order. | `"<RADIUS_SECRET>"` |
| `$RADIUS_SECRET_2` | RADIUS shared secret. Numbered `_1`, `_2`, … in source order. | `"<RADIUS_SECRET>"` |
| `$RADIUS_SERVER_V4_1` | IPv4 address of a RADIUS server. Numbered `_1`, `_2`, … in source order. | `192.168.69.162` |
| `$RADIUS_SERVER_V4_2` | IPv4 address of a RADIUS server. Numbered `_1`, `_2`, … in source order. | `192.168.64.10` |
| `$SNMP_COMMUNITY` | SNMP community name (`snmp community`); a credential, supplied by the operator. | `<SNMP_COMMUNITY>` |
| `$SNMP_TRAP_TARGET_V4` | IPv4 address of an SNMP trap target (`snmp trap-group <name> targets`). | `10.204.243.205` |
| `$TIME_ZONE` | System time zone (IANA time-zone name). | `America/Los_Angeles` |

## IKE and IPsec

| Variable | What it is | Example value |
|---|---|---|
| `$IKE_PSK` | **new** Pre-shared key of an IKE policy (`security ike policy <name> pre-shared-key ascii-text`); a credential, supplied by the operator. | `"<IKE_PSK>"` |
| `$IKE_PSK_1` | **new** Pre-shared key of an IKE policy (`security ike policy <name> pre-shared-key ascii-text`); a credential, supplied by the operator. Numbered `_1`, `_2`, … in source order. | `"<IKE_PSK>"` |
| `$IKE_PSK_2` | **new** Pre-shared key of an IKE policy (`security ike policy <name> pre-shared-key ascii-text`); a credential, supplied by the operator. Numbered `_1`, `_2`, … in source order. | `"<IKE_PSK>"` |

## Multinode High Availability

| Variable | What it is | Example value |
|---|---|---|
| `$LOOPBACK_V4` | Primary per-node IPv4 loopback address. | `192.168.0.1` |
| `$MNHA_LOCAL_ID` | Local node identifier of an SRX Multinode High Availability (MNHA) node (`chassis high-availability local-id`). | `1` |
| `$MNHA_MONITOR_DST_V4` | Destination IPv4 address of the BFD liveliness monitor of an MNHA services-redundancy group monitor object (`bfd-liveliness destination-ip`). | `10.1.1.1` |
| `$MNHA_MONITOR_SRC_V4` | Source IPv4 address of the BFD liveliness monitor of an MNHA services-redundancy group monitor object (`destination-ip <addr> src-ip`). | `10.1.1.2` |
| `$MNHA_PEER_ID` | Node identifier of the MNHA peer node (`chassis high-availability peer-id`), also named by the services-redundancy group `peer-id`. | `2` |
| `$MNHA_PEER_V4` | Loopback IPv4 address of the MNHA peer node (`chassis high-availability peer-id <n> peer-ip`). | `192.168.0.2` |
| `$MNHA_PROBE_DST_V4` | **new** Destination IPv4 address of the activeness probe of an MNHA services-redundancy group (`activeness-probe dest-ip`). | `10.1.1.1` |
| `$MNHA_PROBE_SRC_V4` | **new** Source IPv4 address of the activeness probe of an MNHA services-redundancy group (`activeness-probe dest-ip <addr> src-ip`). | `192.168.10.1` |

## Load balancing

| Variable | What it is | Example value |
|---|---|---|
| `$REAL_SERVICE_V4_1` | IPv4 address of a Traffic Load Balancer real service (`services traffic-load-balance instance <name> real-service <name> address`). Numbered `_1`, `_2`, … in source order. | `192.168.10.1` |
| `$REAL_SERVICE_V4_2` | IPv4 address of a Traffic Load Balancer real service (`services traffic-load-balance instance <name> real-service <name> address`). Numbered `_1`, `_2`, … in source order. | `192.168.10.2` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address with prefix length on an attachment (access-facing) Layer 3 unit. | `90.1.1.2/30` |
| `$AE_BUNDLE` | Aggregated Ethernet interface (`ae<n>`), as configured and as its member ports name it (`802.3ad`). | `ae10` |
| `$AMS_MEMBER_IFD_1` | **new** Member service interface of an aggregated multiservices (AMS) interface (`interfaces ams<n> load-balancing-options member-interface`). Numbered `_1`, `_2`, … in source order. | `mams-3/0/0` |
| `$AMS_MEMBER_IFD_2` | **new** Member service interface of an aggregated multiservices (AMS) interface (`interfaces ams<n> load-balancing-options member-interface`). Numbered `_1`, `_2`, … in source order. | `mams-3/1/0` |
| `$DESCRIPTION_1` | Free-text `description` of an interface, unit or BGP neighbor. Numbered `_1`, `_2`, … in source order. | `"to SRX1A"` |
| `$DESCRIPTION_2` | Free-text `description` of an interface, unit or BGP neighbor. Numbered `_1`, `_2`, … in source order. | `"to SRX1B"` |
| `$DESCRIPTION_3` | Free-text `description` of an interface, unit or BGP neighbor. Numbered `_1`, `_2`, … in source order. | `"to SRX2A"` |
| `$DESCRIPTION_4` | Free-text `description` of an interface, unit or BGP neighbor. Numbered `_1`, `_2`, … in source order. | `"to SRX2B"` |
| `$IFD` | Interface-device identifier, excluding a logical unit. | `ae10` |
| `$IFL` | Logical interface identifier, including its unit (here the trust-side unit an MNHA BFD liveliness monitor uses). | `ae1.0` |
| `$IFL_1` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `et-0/1/2.0` |
| `$IFL_10` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `st0.4` |
| `$IFL_11` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `st0.5` |
| `$IFL_2` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `ams1.1` |
| `$IFL_3` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `ams1.2` |
| `$IFL_4` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `ams1.3` |
| `$IFL_5` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `ams1.4` |
| `$IFL_6` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `ams1.5` |
| `$IFL_7` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `st0.1` |
| `$IFL_8` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `st0.2` |
| `$IFL_9` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `st0.3` |
| `$LOOPBACK_ALT_V4_PFX` | Additional lo0 IPv4 address with prefix length, besides the primary (design) and management loopbacks. | `192.168.10.1/32` |
| `$LOOPBACK_IFL` | Loopback logical interface (`lo0.<unit>`) listed in a routing instance. | `lo0.1` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on a loopback unit. | `192.168.0.1/32` |
| `$LOOPBACK_V4_PFX_1` | IPv4 address with prefix length on a loopback unit. Numbered `_1`, `_2`, … in source order. | `10.200.0.1/32` |
| `$LOOPBACK_V4_PFX_2` | IPv4 address with prefix length on a loopback unit. Numbered `_1`, `_2`, … in source order. | `10.200.0.2/32` |
| `$LOOPBACK_V4_PFX_3` | IPv4 address with prefix length on a loopback unit. Numbered `_1`, `_2`, … in source order. | `10.200.0.3/32` |
| `$LOOPBACK_V4_PFX_4` | IPv4 address with prefix length on a loopback unit. Numbered `_1`, `_2`, … in source order. | `10.200.0.4/32` |
| `$LOOPBACK_V4_PFX_5` | IPv4 address with prefix length on a loopback unit. Numbered `_1`, `_2`, … in source order. | `10.200.0.5/32` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `1` |
| `$VLAN` | A single VLAN identifier. | `40` |

## Routing instances and eBGP

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `65000` |
| `$ASN_CUSTOMER` | Customer-facing BGP peer autonomous-system number. | `65200` |
| `$ASN_CUSTOMER_1` | Customer-facing BGP peer AS, one of an ordered set. | `65001` |
| `$ASN_CUSTOMER_2` | Customer-facing BGP peer autonomous-system number. Numbered `_1`, `_2`, … in source order. | `65002` |
| `$ASN_LOCAL` | BGP `local-as` of a routing instance where it differs from the instance's `autonomous-system`. | `65300` |
| `$BGP_EXPORT_POL` | Policy-statement name applied as a BGP `export`. | `ari_export_untrust` |
| `$BGP_EXPORT_POL_1` | Policy-statement name applied as the `export` of a BGP group; `_1`, `_2`, … number the distinct policies of one instance in source order. | `MX1-to-SRX_trust_export` |
| `$BGP_EXPORT_POL_2` | Policy-statement name applied as the `export` of a BGP group; `_1`, `_2`, … number the distinct policies of one instance in source order. | `default_export` |
| `$CE_PEER_V4` | IPv4 address of a VRF eBGP neighbor on the customer or external side. | `10.1.1.1` |
| `$CE_PEER_V4_1` | IPv4 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.1.2` |
| `$CE_PEER_V4_2` | IPv4 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.2.2` |
| `$CE_PEER_V4_3` | IPv4 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.3.2` |
| `$CE_PEER_V4_4` | IPv4 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.4.2` |
| `$CE_PEER_V4_5` | IPv4 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `172.16.1.2` |
| `$NEXT_HOP_V4` | IPv4 next-hop address of a static route (`route <prefix> next-hop`). | `172.16.8.1` |
| `$PE_LOCAL_V4` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. | `10.1.1.2` |
| `$PE_LOCAL_V4_1` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.1.1` |
| `$PE_LOCAL_V4_2` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.2.1` |
| `$PE_LOCAL_V4_3` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.3.1` |
| `$PE_LOCAL_V4_4` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.4.1` |

## Policy

| Variable | What it is | Example value |
|---|---|---|
| `$CONDITION_NAME` | Name of a routing-policy condition (`policy-options condition`), as defined and as a policy term references it. | `active_route_exists` |
| `$CONDITION_NAME_1` | Name of a routing-policy condition as a policy term references it; `_1`, `_2`, … in term order. | `active_route_exists` |
| `$CONDITION_NAME_2` | Name of a routing-policy condition as a policy term references it; `_1`, `_2`, … in term order. | `backup_route_exists` |
| `$POLICY_NAME` | Name of a routing policy-statement where no role-specific name (BGP export or import, VRF import or export, load balancing) applies. | `mnha-mx-to-srx-export` |
| `$PPLB_NAME` | Name of the per-packet load-balancing policy exported to the forwarding table. | `ECMP_POLICY-LB` |
| `$PREFIX` | IPv4 or IPv6 prefix in a route filter or route-filter list. | `192.168.10.251/32` |
| `$ROUTE_FILTER_LIST` | Name of a route-filter list, as defined and as a policy references it. | `ari_route_rt_list` |
| `$TERM_NAME` | Name of a policy-statement or firewall filter term. | `t1` |
| `$TERM_NAME_1` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `IPSEC` |
| `$TERM_NAME_2` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `other_traffic` |
| `$TERM_NAME_3` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `3` |
| `$TERM_NAME_4` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `default` |
