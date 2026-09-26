# Snippet variable glossary

All `.conf` files under `junos/` and `evo/` are templates: identifiers
that vary between deployments are written as `$VAR` (or `${VAR}` only
when the placeholder is glued to an adjacent letter or digit and the
boundary would otherwise be ambiguous).

Render a snippet by substituting each `$VAR` / `${VAR}` placeholder with your
deployment's value. The placeholders each snippet uses are listed in its
`Variables:` header and in the glossary below.

The variables fall into a few groups.

## Identity / topology

| Variable               | What it is                                                                           | Example value                |
|------------------------|--------------------------------------------------------------------------------------|------------------------------|
| `$AS_CUST`             | Customer-facing eBGP AS used by PE-CE BGP and as-override.                           | `64514`                      |
| `$LOOPBACK_V4`         | This PE's lo0 IPv4 (used as RD-prefix and BGP next-hop).                             | `1.1.0.17`                   |
| `$LOOPBACK_ANYCAST_V4` | Shared anycast lo0 IPv4 owned by more than one node.                                 | `1.1.10.10`                  |
| `$LOOPBACK_SR_V4`      | SR non-zero lo0 IPv4 carrying an SR prefix-SID.                                      | `1.1.10.6`                   |
| `$LOOPBACK_SR_V6`      | SR non-zero lo0 IPv6 carrying an SR prefix-SID.                                      | `2001::1:1:10:0`             |
| `$LOOPBACK_V6`         | This PE's lo0 IPv6.                                                                  | `2001:db8::17`               |
| `$ROUTER_ID`           | router-id (usually equal to `$LOOPBACK_V4`).                                          | `1.1.0.17`                   |
| `$NODE_SID_V4`         | ISIS source-packet-routing IPv4 node-segment index.                                  | `17`                         |
| `$NODE_SID_V6`         | ISIS source-packet-routing IPv6 node-segment index.                                  | `117`                        |
| `$LOOPBACK_SUPERNET`   | IPv4 aggregate that contains the deployment's loopback `/32` addresses (loopback route-leak match). | `1.1.0.0/16` |
| `$LOOPBACK_V4_PFX`     | This node's lo0 IPv4 written with its `/32` prefix length (address form). | `1.1.0.17/32` |
| `$LOOPBACK_V6_PFX`     | This node's lo0 IPv6 written with its `/128` prefix length. | `2001::1:1:0:11/128` |
| `$ISIS_NET`            | ISIS NET (area + system-id) configured on lo0. | `49.0001.0010.0100.0017.00` |
| `$CORE_LINK_SUPERNET`  | IPv4 aggregate that contains the deployment's core point-to-point `/30` links. | `10.10.0.0/24` |
| `$SR_INDEX`            | Prefix-segment index a loopback export policy assigns to the node's lo0 route. | `900` |
| `$SR_INDEX_ALGO128`    | Prefix-segment index the same policy assigns under flex-algo 128. | `500` |
| `$SR_INDEX_ALGO129`    | Prefix-segment index the same policy assigns under flex-algo 129. | `600` |
| `$SR_INDEX_V4` / `$SR_INDEX_V6` | Prefix-segment indices assigned to the SR non-zero IPv4 / IPv6 loopbacks. | `200` / `300` |
| `$PREFIX`              | Prefix a route-filter matches where the prefix itself is what the policy selects. | `0.0.0.0/32` |

## Transport Interface Parameters

| Variable | What it is | Example value |
|---|---|---|
| `$TE_METRIC` | IS-IS interface ASLA traffic-engineering metric, independent of its IGP and delay metrics. | `10` |
| `$DELAY_METRIC` | IS-IS interface delay metric; not a protocol timer. | `5` |
| `$ISIS_METRIC` | IS-IS interface metric within the literal level hierarchy. | `25` |
| `$ADMIN_GROUP` | One scalar MPLS administrative-group name referenced by an IS-IS interface ASLA block; not a BGP colour community or a list. | `blue` |

For as-deployed reconstruction these values belong to a complete source occurrence
binding, together with its device and interface identity. Independently observed
values are not interchangeable defaults and do not establish arbitrary combinations.

## Neighbours / route reflectors

| Variable               | What it is                                                  | Example value |
|------------------------|-------------------------------------------------------------|---------------|
| `$RR1_V4` / `$RR2_V4`  | Route-reflector loopback IPv4 addresses for the iBGP overlay. | `1.1.0.99`    |
| `$REMOTE_PE_V4`        | Remote PE loopback used in static l2circuit / LDP-VPLS neighbour lines. | `1.1.0.18` |
| `$PRIMARY_LOOPBACK`    | Primary PE loopback targeted by an HSB l2circuit Hub (`l2circuit-hsb-hub`). | `1.1.0.6` |
| `$BACKUP_LOOPBACK`     | Backup PE loopback used in `backup-neighbor` for HSB l2circuit (`l2circuit-hsb-hub`). | `1.1.0.7` |
| `$HUB_LOOPBACK`        | Hub loopback the PE side of an HSB l2circuit points at (`l2circuit-hsb-pe`). | `1.1.0.2` |
| `$TRANSPORT_RR1_V4` / `$TRANSPORT_RR2_V4` | Transport-plane (coloured underlay) route-reflector loopbacks. | `1.1.0.12` |
| `$SVC_RR1_V4` / `$SVC_RR2_V4` | Service-plane (overlay / EVPN) route-reflector loopbacks. | `1.1.0.10` |
| `$TC_EGRESS`          | This node's transport-class egress endpoint loopback. | `1.1.0.17` |

## Interfaces

| Variable               | What it is                                                                       | Example value     |
|------------------------|----------------------------------------------------------------------------------|-------------------|
| `$AC_INTF`             | Customer-facing attachment-circuit unit (with VLAN id when tagged).               | `ae12.2400`       |
| `$CORE_INTF`           | Core-facing LAG unit used for ISIS+MPLS underlay.                                | `ae71.0`          |
| `$CORE_PHYS`           | Parent of the core LAG.                                                          | `ae71`            |
| `$AE_BUNDLE`           | Aggregated-Ethernet bundle a member link joins (`802.3ad`).                      | `ae73`            |
| `$AE_DEVICE_COUNT`     | Number of aggregated-Ethernet devices the chassis allocates.                     | `25`              |
| `$PS_DEVICE_COUNT`     | Allocated pseudowire-subscriber devices; greater than the configured device count and highest PS index. | `100` |
| `$TS_FPC` / `$TS_PIC`   | FPC and PIC indices providing tunnel services; must match the FPC/PIC in the subscriber anchor. | `0` / `0` |
| `$UNIT`                | Logical-unit identifier — the `unit <n>` a construct configures, and the tail when an interface is written `<ifd>.<unit>`. | `3000`            |
| `$UNI_INTF`           | Customer UNI physical interface. | `xe-0/0/3:1` |
| `$AC_INTF_1` / `$AC_INTF_2` | The two attachment-circuit interfaces cross-connected by l2circuit local-switching. | `et-0/0/5` |
| `$AC_INTF_A` / `$AC_INTF_B` | The two attachment-circuit units bound as the UNIs of a two-UNI service instance. | `ae12.200` / `ae12.250` |
| `$AC_ADDR_V4` / `$AC_ADDR_V6` | IPv4 / IPv6 address on a routed attachment-circuit unit. | `13.1.0.1/30` |
| `$IRB_ADDR`           | IPv4 address configured on an `irb` unit. | `40.2.2.3/24` |
| `$VGA`                | EVPN virtual-gateway address shared by the IRB's redundancy group. | `41.2.2.1` |
| `$VG_MAC`             | MAC address bound to the IPv4 virtual gateway. | `00:01:33:44:11:11` |
| `$PS_INTF`            | Pseudowire-subscriber logical interface. | `ps0` |
| `$ANCHOR_PIC`         | Anchor tunnel PIC (`lt-`) hosting the pseudowire-subscriber device. | `lt-0/0/0` |
| `$CORE_INTF_1` / `$CORE_INTF_2` | Per-core-neighbour core interface units (repeat the stanza per neighbour). | `ae71.0` |
| `$CORE_V4_ADDR` / `$CORE_V6_ADDR` | Core interface IPv4 / IPv6 address. | `10.10.1.121/30` |
| `$CORE_DESC`          | Core interface description. | `"to MA2 ... ae83"` |
| `$LO0_DESC`           | lo0 interface description. | `"MA1.1 Metro Ring Blue"` |
| `$LACP_SYS_ID`        | LACP system-id on a multihomed LAG. | `00:00:00:00:00:01` |
| `$VLAN`               | VLAN id on a tagged unit. | `3000` |
| `$VLAN_UNIT`          | Selects `ae11.<unit>` on the shared edge LAG. | `700` |
| `$IFD`                | Interface device a construct configures or attaches to, independent of its type or topology role — physical, aggregated or pseudowire-subscriber. | `ae11` |
| `$INPUT_VID`          | VLAN id pushed by an `input-vlan-map` when the customer and service-internal VLAN ids differ. | `3800` |
| `$VLAN_LIST`          | VLAN range or list admitted by a `vlan-id-list` interface. | `1000-1001` |
| `$VLAN_OUTER` / `$VLAN_INNER` | Outer and inner tags of a double-tagged (`vlan-tags`) interface. | `225` / `2250` |
| `$COS_INTF`           | Interface to which the class-of-service configuration is applied, physical or aggregated and independent of topology role. | `ae11` |

The PS transport and service-unit templates use `$PS_INTF` as the device name
(`ps0`), with transport unit `0` literal. Repeat the service template per nonzero
`$UNIT`; `$UNIT` and `$VLAN` are separate inputs. Use the same PS device and anchor
for its transport and service units. Unit and device values must also be within
the target platform and release limits; the archived values are examples, not
those limits. The existing routing-instance template uses `$PS_INTF` for a full
service interface (`ps0.300`); supply that complete attachment there.

## Service identifiers

| Variable                  | What it is                                                       | Example value |
|---------------------------|------------------------------------------------------------------|---------------|
| `$INSTANCE_NAME`          | The service-instance name (per-service, often encodes IDs).      | `evpn_group_30_2400` |
| `$RD_SUB_ASSIGNED`        | Route-distinguisher Assigned Number subfield (RD = `$LOOPBACK_V4:$RD_SUB_ASSIGNED`). | `2400`        |
| `$RT_AS`                  | Route-target Administrator subfield; service-scoped, not the node's own AS. | `63535`       |
| `$RT_ID`                  | Route-target Assigned Number (the tail), independent of the variable supplying the Administrator. | `2400`        |
| `$VPWS_SVC_ID_LOCAL`      | EVPN-VPWS local service-id.                                      | `2`           |
| `$VPWS_SVC_ID_REMOTE`     | EVPN-VPWS remote service-id.                                     | `1`           |
| `$VC_ID`                  | l2circuit / VPLS virtual-circuit-id (or `vpls-id`).              | `3000`        |
| `$VC_ID_PRIMARY`          | Primary virtual-circuit-id on an HSB l2circuit Hub.             | `3000`        |
| `$VC_ID_BACKUP`           | Backup-neighbor virtual-circuit-id for hot-standby.              | `4000`        |
| `$L2VPN_SITE`             | Kompella L2VPN site-name.                                        | `r2`          |
| `$L2VPN_LOCAL_SITE_ID`    | Kompella L2VPN site-identifier.                                  | `1102`        |
| `$L2VPN_REMOTE_SITE_ID`   | Kompella L2VPN remote-site-id.                                   | `1119`        |
| `$VPLS_SITE`              | BGP-VPLS site name.                                              | `r2`          |
| `$VPLS_SITE_ID`           | BGP-VPLS site-identifier.                                        | `1`           |
| `$SITE_RANGE`             | Highest site-identifier a BGP-VPLS instance accepts (`site-range`). | `10`       |
| `$LABEL_BLOCK_SIZE`       | Size of the label block a BGP-VPLS site advertises.              | `8`           |
| `$VLAN_BD`                | bridge-domain or mac-vrf vlan-id.                                | `4000`        |
| `$ESI`                    | 10-byte ESI (for EVPN multihoming).                              | `00:11:22:33:44:55:66:77:88:01` |
| `$IRB_UNIT`               | irb.X unit number for IRB integration.                           | `4000`        |
| `$BD_NAME`               | bridge-domain / MAC-VRF bridge-domain name. | `V4000` |
| `$SITE_ID`               | Per-site identifier encoded into service instances. | `5` |
| `$SVC_ID_LOCAL` / `$SVC_ID_REMOTE` | FXC / VPWS local & remote service-ids. | `1` / `2` |
| `$SVC_ID_LOCAL_A` / `$SVC_ID_REMOTE_A` | Local & remote service-ids of the first UNI in a two-UNI FXC / VPWS instance. | `2` / `1` |
| `$SVC_ID_LOCAL_B` / `$SVC_ID_REMOTE_B` | Local & remote service-ids of the second UNI in the same instance. | `11` / `22` |
| `$UNIT_1` / `$UNIT_2`    | Logical-unit numbers for a two-AC service. | `3000` |
| `$UNIT_A` / `$UNIT_B` / `$UNIT_C` / `$UNIT_D` | Logical-unit numbers for a multi-AC service. | `800` |
| `$LABEL_IN` / `$LABEL_OUT` | Static MPLS in / out labels (floating pseudowire). | `1000001` |
| `$RD` / `$RT`            | Full route-distinguisher / route-target value (`AS:id`). | `63535:6500` |
| `$EXPORT_POL` / `$IMPORT_POL` | Per-VRF export / import policy names. | `PS-METRO_L3VPN_2001-EXPORT` |
| `$CE_PEER_V4` / `$PE_LOCAL_V4` | PE-CE eBGP peer / local IPv4 addresses. | `115.2.0.2` / `115.2.0.1` |
| `$CE_PEER_V6` / `$PE_LOCAL_V6` | PE-CE eBGP peer / local IPv6 addresses. | `2001:0:0:0:13:3:0:2` / `2001:0:0:0:13:3:0:1` |
| `$CE_PREFIX_1` / `$CE_PREFIX_2` / `$CE_PREFIX_3` / `$CE_PREFIX_4` | Customer prefixes matched by per-VRF import/export route-filters. | `13.2.0.0/16` |

## Class of Service

| Variable               | What it is                                                  | Example value |
|------------------------|-------------------------------------------------------------|---------------|
| `$FORWARDING_CLASS`    | Forwarding class a logical unit assigns every packet to. | `REALTIME` |

`$COS_INTF` is the other class-of-service variable; it is listed with the
interfaces above because its value is an interface identifier.

## OAM (CFM)

| Variable               | What it is                                                  | Example value |
|------------------------|-------------------------------------------------------------|---------------|
| `$MD_NAME`             | CFM maintenance-domain name. | `MD_63535` |
| `$MA_ID`               | CFM maintenance-association identifier. | `100` |
| `$MEP_LOCAL`           | Local MEP identifier. | `1002` |
| `$MEP_REMOTE`          | Remote MEP identifier (single-remote form). | `1003` |
| `$MEP_REMOTE_1` / `$MEP_REMOTE_2` | Remote MEP identifiers (multi-remote form). | `1002` / `1006` |

## BGP communities

| Variable               | What it is                                                  | Example value |
|------------------------|-------------------------------------------------------------|---------------|
| `$FABRIC_COMMUNITY_AS`  | **Deployment-scoped.** Administrator AS for fabric community values (fixed per deployment; not the device local AS). | `63535` |
| `$RING_COMMUNITY_AS`    | **Deployment-scoped.** Administrator AS for metro ring-region community values (fixed per deployment). | `63536` |
| `$L3VPN_ID`             | **Service-instance-scoped.** L3VPN service identifier; repeated (consistently bound) in the community name and RT tail. | `1001` |
| `$COLOR_COMMUNITY`      | **Service-instance-scoped.** Name of the community carrying the service transport-colour value. | `map2gold` |
| `$LOOPBACK_COMMUNITY`   | **Device/role-scoped.** Complete `CM-LOOPBACK` value; the administrator follows the node's regional role. | `63535:10000` |

## Group / policy names

Names that are part of the architectural model the JVD documents stay
**literal** — their meaning *is* the abstraction. A label that is proven to
vary across otherwise-identical deployed forms is parameterised instead (see
`$PPLB_NAME`). Kept literal:

- Apply groups: `GR-EDGE-INTF`, `GR-EDGE-INTF-MH`, `GR-CORE-INTF`,
  `GR-ISIS-BCP`, `GR-BGP-BCP`, `GR-FATPW-LB`, `GR-FATPW-LABEL`,
  `GR-L3VPN`, `GR-L2CKT-HS`, `GR-ISIS-BFD`, `GR-LAG-MEMBER`.
- Forwarding-classes, where they are the objects being defined:
  `BEST-EFFORT`, `MEDIUM`, `REALTIME`, `SIG-OAM`, `CONTROL`, `BUSINESS`.
  A body that only *references* a forwarding class uses `$FORWARDING_CLASS`
  when the class referenced varies across otherwise-identical forms.
- Schedulers / scheduler-maps, communities, and per-VRF
  import/export policies are referenced by their own filename
  in the `policy/` and `cos/` snip categories.

| Variable               | What it is                                                  | Example value |
|------------------------|-------------------------------------------------------------|---------------|
| `$PPLB_NAME`           | Per-packet load-balance policy name — a label proven to vary across otherwise-identical deployed forms. | `pplb` (also `PS-PPLB`) |
| `$POLICY_NAME`         | Policy-statement name where the name is the object the body defines rather than part of the architectural model. | `ALLOW_LOOPBACK` |

## Header convention

### Occurrence-bound transport inputs

| Variable | Meaning | Source example |
|---|---|---|
| `$ISIS_INSTANCE` | Named IS-IS process, not a service routing instance. | `metro-a` |
| `$CONDITION_NAME` | Routing-policy condition definition and its reference. | `Floating-PW-Condition` |
| `$PREFIX_SID_INDEX` | Policy-applied prefix-segment index. | `210` |
| `$ADMIN_GROUP_1` / `$ADMIN_GROUP_2` | Ordered members of a two-member administrative-group list. | `blue` / `green` |
| `$EXPORT_POLICY` | IS-IS export-policy reference; reused from the Broadband Edge vocabulary. | `export_isis_metro_b_ribs` |

Source replay uses complete observed occurrence bindings. The floating-PW
conditional pattern may be instantiated per PS transport for a new deployment;
the source contains only the `ps0.0` worked condition. Policy and condition names,
watched transport, advertised prefix and SID index are correlated inputs, not
values to copy indiscriminately to every PS device. Bindings are local to each
snippet occurrence: legacy `$PS_INTF` may denote a PS device stem in a transport
snippet and a complete logical-interface name in a service snippet.

Every snip declares the variables it actually uses in a header
section. The renderer skips the leading `/* ... */` C-comment block
before substitution, so `$VAR` text inside the header survives
verbatim while the body is fully rendered:

```
 * Variables (example values from ma1-1_acx7024):
 *   $INSTANCE_NAME      e.g. evpn_group_30_2400
 *   $AC_INTF            e.g. ae12.2400
 *   $LOOPBACK_V4        e.g. 1.1.0.17
 *   $RD_SUB_ASSIGNED    e.g. 2400
 *   $RT_ID              e.g. 2400
 *   $RT_AS              e.g. 63535
 *   $VPWS_SVC_ID_LOCAL  e.g. 2
 *   $VPWS_SVC_ID_REMOTE e.g. 1
```

The example values mirror the source device the snip was extracted
from (so the snip remains a faithful documentation of a working
deployment).
