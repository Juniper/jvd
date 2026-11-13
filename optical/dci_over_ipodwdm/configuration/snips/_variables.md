# Snippet variable glossary

All `.conf` files under `junos/` and `evo/` are templates: identifiers that vary between deployments are written
as `$VAR`. Render a snippet by substituting each placeholder with your deployment's value. The placeholders each
snippet uses are listed in its `Variables:` header and in the glossary below. Variable names and meanings follow
the shared JVD snippet vocabulary. Lettered and numbered
variables (`_A`…`_E`, `_1`, `_2`, …) form an ordered set; the letters and numbers carry no other meaning.

Values left literal on purpose: design constants such as `class super-user`, the gRPC port `9339` and its
connection limit, the MX304 port speeds, `speed 100g`, `minimum-links 1` and the LACP settings, `maximum-labels 5`,
`maximum-ecmp 16`, the OSPF area `0.0.0.0` and the loopback `lo0.0`.

## System

| Variable | What it is | Example value |
|---|---|---|
| `$ENCRYPTED_PASSWORD` | Encrypted (hashed) login password; secret, supplied by the operator (the published value is sanitized). | `"$1$kPU..$w.4FGRAGanJ8U4Yq6sbj7."` |
| `$LOGIN_UID_1` | Numeric user ID (`uid`) of the login account with the same number. | `2002` |
| `$LOGIN_UID_2` | Numeric user ID (`uid`) of the login account with the same number. | `2003` |
| `$LOGIN_USER_1` | Name of a local login account; `_1`, `_2` order the accounts. | `gnmi_user` |
| `$LOGIN_USER_2` | Name of a local login account; `_1`, `_2` order the accounts. | `netconf_user` |
| `$NTP_SERVER` | IPv4 address of an NTP server. | `66.129.233.81` |
| `$TIME_ZONE` | System time zone (IANA time-zone name). | `America/Los_Angeles` |

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `65000` |
| `$ASN_CUSTOMER` | Customer-facing BGP peer autonomous-system number. | `65501` |
| `$IBGP_PEER_V4_1` | IPv4 loopback of an internal BGP neighbor; `_1`, `_2` order the neighbors. | `10.1.1.2` |
| `$IBGP_PEER_V4_2` | IPv4 loopback of an internal BGP neighbor; `_1`, `_2` order the neighbors. | `10.1.1.3` |
| `$LOOPBACK_V4` | Primary per-node IPv4 loopback address. | `10.1.1.1` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on a loopback unit (`lo0.0` or a per-VRF `lo0.<n>`). | `10.1.1.1/32` |
| `$ROUTER_ID` | Complete router identifier in IPv4 dotted-decimal form. | `10.1.1.1` |

## Interfaces and optics

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address on a routed attachment-circuit unit. | `10.10.1.1/30` |
| `$AC_IFL` | Full logical attachment-circuit interface identifier, including its unit. | `et-0/0/4.1` |
| `$AE_BUNDLE` | Aggregated-Ethernet bundle a member link joins (`802.3ad`). | `ae12` |
| `$AE_DEVICE_COUNT` | Number of aggregated-Ethernet devices the chassis allocates. | `10` |
| `$CORE_INTF_1` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `ae12.0` |
| `$CORE_INTF_2` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `ae13.0` |
| `$CORE_V4_ADDR` | Core interface IPv4 address. | `10.12.1.1/30` |
| `$FPC_SLOT` | FPC slot for a complete source-measured hardware profile. | `0` |
| `$IFD` | Interface-device identifier, excluding a logical unit. | `ae12` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `0` |
| `$VLAN` | A single VLAN identifier. | `1` |
| `$WAVELENGTH` | DWDM wavelength in nanometres of a coherent optic (`optics-options wavelength`); both ends of a link use the same value. | `1547.72` |

## Transport

| Variable | What it is | Example value |
|---|---|---|
| `$LSP_NAME_1` … `$LSP_NAME_200` | Name of an MPLS label-switched path; `_1`…`_200` order the paths of the form (the first 100 go to one peer, the next 100 to the other). | `lsp-r1-to-r21` … `lsp-r1-to-r3100` |
| `$LSP_TO_A` | Egress address (`to`) of the first group of label-switched paths: the loopback of one remote DCI router. | `10.1.1.2` |
| `$LSP_TO_B` | Egress address (`to`) of the second group of label-switched paths: the loopback of the other remote DCI router. | `10.1.1.3` |

## Services

| Variable | What it is | Example value |
|---|---|---|
| `$BGP_GROUP` | Name of a BGP group (CE-facing group in a VRF, or a CE's group toward a WAN edge). | `grp-iBGP` |
| `$CE_PEER_V4` | IPv4 address of the external BGP peer (CE). | `10.10.1.2` |
| `$INSTANCE_NAME` | Identity stem of a service instance: the routing-instance name, or the shared name of a hub-and-spoke policy and its community. | `L3VPN_DCI_RI_1` |
| `$PE_LOCAL_V4` | Local IPv4 address of the PE side of a CE eBGP session (`local-address`). | `10.10.1.1` |
| `$PPLB_NAME` | Per-packet load-balance policy name — a label proven to vary across otherwise-identical deployed forms. | `PPLB` |
| `$RD_SUB_ASSIGNED` | Route Distinguisher Assigned Number subfield. | `1` |
| `$RT_AS` | Route Target Administrator subfield. | `65000` |
| `$RT_ID` | Route Target Assigned Number subfield. | `1` |
