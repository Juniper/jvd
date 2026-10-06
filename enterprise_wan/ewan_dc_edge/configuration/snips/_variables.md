# Snippet variable glossary

All `.conf` files under `junos/` and `evo/` are templates: identifiers that vary
between deployments are written as `$VAR`. Render a snippet by substituting each
placeholder with your deployment's value. The placeholders each snippet uses are
listed in its `Variables:` header and in the glossary below. Variable names and
meanings follow the shared JVD snippet vocabulary (see the Metro Ethernet
Business Services glossary); entries marked **new** were introduced by this JVD.

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `65000` |
| `$LOOPBACK_V4` | This node's lo0 IPv4 (used as RD prefix, BGP local-address and VTEP source). | `1.1.1.5` |
| `$LOOPBACK_V4_PFX` | This node's lo0 IPv4 written with its `/32` prefix length (address form). | `1.1.1.6/32` |
| `$ROUTER_ID` | router-id (equal to `$LOOPBACK_V4`). | `1.1.1.10` |
| `$LOOPBACK_V6_PFX` | This node's lo0 IPv6 written with its `/128` prefix length. | `abcd::10:255:23:228/128` |
| `$LOOPBACK_MGMT_V4_PFX` | **new** Management-network lo0 IPv4 `/32` configured alongside the design loopback. | `10.255.152.8/32` |
| `$LOOPBACK_ALT_V4_PFX` | **new** Additional lo0 IPv4 `/32` configured on one node besides its design and management loopbacks. | `111.1.1.1/32` |
| `$ISO_NET` | **new** ISO network entity title on lo0 `family iso`. | `47.0005.80ff.f800.0000.0108.0001.0102.5502.3228.00` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$IFD` | Interface device a construct configures or attaches to, independent of its type or topology role — physical or aggregated. | `xe-0/1/4` |
| `$UNIT` | Logical-unit identifier — the `unit <n>` a construct configures. | `1402` |
| `$UNIT_A` … `$UNIT_E` | Ordered logical units of the five tagged routed test sub-interfaces listed in an OSPF area. | `3901` … `3905` |
| `$VLAN` | VLAN id on a tagged unit. | `1402` |
| `$VLAN_LIST` | VLAN range admitted by a `vlan-id-list` unit or defined by a named VLAN set. | `701-780` |
| `$VLAN_NAME` | **new** Name of a `vlans` definition (a VLAN set or range) referenced by trunk members and bundle instances. | `VLANS-701-780` |
| `$AC_INTF` | Customer-facing attachment-circuit unit (with VLAN id when tagged). | `xe-0/1/4.1403` |
| `$AC_ADDR_V4` | IPv4 address on a routed attachment-circuit unit. | `101.1.1.1/24` |
| `$CORE_PHYS` | Core-facing physical interface carrying `unit 0`. | `et-0/0/0` |
| `$CORE_PHYS_1` … `$CORE_PHYS_4` | Ordered core-facing physical interfaces named in one protocol stanza (`<phys>.0`). | `et-0/0/48` |
| `$CORE_INTF_1` … `$CORE_INTF_4` | Ordered core-facing logical interfaces named in one OSPF area. | `et-1/1/1.0` |
| `$CORE_V4_ADDR` | Core interface IPv4 address. | `10.0.16.1/30` |
| `$CORE_DESC` | Interface description naming the far end. | `"To dc-edge2"` |
| `$AE_BUNDLE` | Aggregated-Ethernet bundle a member link joins (`802.3ad`). | `ae0` |
| `$LACP_SYS_ID` | LACP system-id on a multihomed LAG; identical on both leaves of the same ESI-LAG. | `00:00:00:33:33:33` |
| `$ESI` | 10-byte Ethernet segment identifier (EVPN multihoming). | `00:33:33:33:33:33:33:33:33:33` |
| `$DF_PREFERENCE` | **new** Designated-forwarder election preference value on an all-active ESI (`df-election-type preference value`); higher wins. | `100` |
| `$IRB_UNIT` | irb.X unit number for IRB integration. | `1402` |
| `$IRB_ADDR` | IPv4 address configured on an `irb` unit that carries the virtual gateway. | `10.0.101.1/24` |
| `$IRB_ADDR_2` | **new** Second, plain IPv4 address on the same `irb` unit (no virtual gateway). | `10.2.81.1/24` |
| `$VGA` | EVPN virtual-gateway address shared by the IRB's redundancy group. | `10.0.101.254` |
| `$VG_MAC` | MAC address bound to the IPv4 virtual gateway. | `00:00:5e:00:00:04` |

## Chassis

| Variable | What it is | Example value |
|---|---|---|
| `$AE_DEVICE_COUNT` | Number of aggregated-Ethernet devices the chassis allocates. | `100` |
| `$FPC_SLOT` | FPC slot for a complete source-measured hardware profile. | `0` |
| `$PIC` / `$PORT` | **new** PIC and port index of a single channelised port. | `0` / `50` |

## Services

| Variable | What it is | Example value |
|---|---|---|
| `$INSTANCE_NAME` | The service-instance name. | `Interconnect_Instance1402` |
| `$RD_SUB_ASSIGNED` | Route-distinguisher Assigned Number subfield of the instance's own RD (`$LOOPBACK_V4:$RD_SUB_ASSIGNED`). | `7000` |
| `$RT_AS` | Route-target Administrator subfield of the instance's own `vrf-target`; service-scoped, not the node's AS. | `100` |
| `$RT_ID` | Route-target Assigned Number (the tail) of the instance's own `vrf-target`. | `1402` |
| `$RD_SUB_INTERCONNECT` | **new** Assigned Number subfield of the RD inside `protocols evpn interconnect` (`$LOOPBACK_V4:$RD_SUB_INTERCONNECT`); must differ from `$RD_SUB_ASSIGNED`. | `1402` |
| `$RT_AS_INTERCONNECT` | **new** Administrator subfield of the `vrf-target` inside `protocols evpn interconnect` — the EVPN-MPLS (WAN-side) route target. | `1402` |
| `$RT_ID_INTERCONNECT` | **new** Assigned Number of the interconnect `vrf-target`. | `1402` |
| `$VNI` | **new** VXLAN network identifier bound to the instance (`extended-vni-list` / `vxlan vni`). | `1402` |
| `$BD_NAME` | MAC-VRF bridge (VLAN) name. | `EP-TYPE-2-VLAN-1402` |

The `_INTERCONNECT` variables are the same kinds of value as `$RT_AS` /
`$RT_ID` / `$RD_SUB_ASSIGNED`. A body may carry both sets only when it contains a
`protocols evpn interconnect { … }` block: the plain set is the fabric-side
(EVPN-VXLAN) identity and the `_INTERCONNECT` set is the WAN-side (EVPN-MPLS)
identity of the same instance. Outside an interconnect block the `_INTERCONNECT`
names are not used.

## Policy

| Variable | What it is | Example value |
|---|---|---|
| `$POLICY_NAME` | Policy-statement name where the name is the object the body defines. | `lo0` |
| `$PPLB_NAME` | Per-packet load-balance policy name. | `load-balance` |

## Literal values

Values that are JVD-wide constants are left literal because they are what the
JVD documents: BGP group names, the AS numbers and BFD timers inside the
per-device BGP forms (which are complete as-deployed bodies, as in the Metro
Ethernet Business Services library), the `lo0.0` loopback unit, the `fxp0`
management port, `vtep-source-interface lo0.0`, and the VXLAN resource profile
numbers under `forwarding-options vxlan-routing`.
