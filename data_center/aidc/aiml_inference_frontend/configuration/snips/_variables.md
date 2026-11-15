# Snippet variable glossary

All `.conf` files under `evo/` are templates: identifiers that vary between deployments are written
as `$VAR`. Render a snippet by substituting each placeholder with your deployment's value. The placeholders each
snippet uses are listed in its `Variables:` header and in the glossary below. Variable names and meanings follow
the shared JVD snippet vocabulary. Numbered variables (`_1`, `_2`, …) form an ordered set; the numbers carry no
other meaning.

Values left literal on purpose: the community `FROM_SPINE_FABRIC_TIER` and its value `0:15`, which both fabric
policies reference by name; the MTUs (`9216`, `9170`, `9000`), the BFD timers (1000 ms × 3), the breakout and port
speeds, the gRPC routing instance `mgmt_junos`, the route-tagging values `20007` and `21001:26000`, the RSTP bridge
priority `0`, `unit 0`, and the loopback `lo0`.

## System

| Variable | What it is | Example value |
|---|---|---|
| `$GRPC_PORT` | TCP port of the gRPC request-response extension service over SSL. | `32767` |
| `$HOST_NAME` | System host name. | `leaf1` |
| `$LOCAL_CERT` | Name of the local certificate (`security certificates local`) the gRPC SSL service presents (`local-certificate`). | `aos_grpc` |
| `$LOCAL_CERT_KEY` | PEM private key and certificate of the local certificate; secret, supplied by the operator (the published value is sanitized). | `"******"` |

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number (`routing-options autonomous-system`). | `4201032400` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on loopback unit 0. | `10.0.4.0/32` |
| `$ROUTER_ID` | Router identifier in IPv4 dotted-decimal form. | `10.0.4.0` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address with prefix length on an access-facing Layer 3 unit. | `10.10.1.29/31` |
| `$AC_INTF` | Access-facing physical interface (server, host or external attachment). | `et-0/0/28` |
| `$BREAKOUT_SUB_PORTS` | Number of sub-ports a channelized (breakout) port is split into (`number-of-sub-ports`). | `4` |
| `$CORE_PHYS` | Fabric-facing physical interface of a point-to-point leaf-spine link. | `et-0/0/0` |
| `$CORE_V4_ADDR` | IPv4 address with prefix length (/31) on a leaf-spine fabric link. | `10.0.5.1/31` |
| `$DESCRIPTION` | Free-text interface or BGP neighbor `description`. | `"Breakout et-0/0/8"` |
| `$DESCRIPTION_1` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_frontend-spine-1` |
| `$DESCRIPTION_2` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_frontend-spine-2` |
| `$DESCRIPTION_3` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_frontend-leaf3` |
| `$DESCRIPTION_4` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_frontend-leaf4` |
| `$IFD` | Physical interface name. | `et-0/0/8` |
| `$IRB_ADDR` | IPv4 gateway address with prefix length on an IRB unit. | `10.10.3.1/24` |
| `$IRB_IFL` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN. | `irb.3` |
| `$IRB_UNIT` | IRB unit number. | `3` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `0` |
| `$VLAN` | VLAN identifier: here the native VLAN of an access port (`native-vlan-id`). | `3` |
| `$VLAN_BD` | VLAN identifier (`vlan-id`) of a VLAN under `vlans`. | `3` |
| `$VLAN_NAME` | Name of a VLAN under `vlans`; also the member a trunk unit carries. | `vn3` |

## Fabric underlay

| Variable | What it is | Example value |
|---|---|---|
| `$ASN_FABRIC_PEER_1` | Autonomous-system number of a fabric eBGP neighbor (another leaf or spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `4201032300` |
| `$ASN_FABRIC_PEER_2` | Autonomous-system number of a fabric eBGP neighbor (another leaf or spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `4201032301` |
| `$ASN_FABRIC_PEER_3` | Autonomous-system number of a fabric eBGP neighbor (another leaf or spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `4201032406` |
| `$ASN_FABRIC_PEER_4` | Autonomous-system number of a fabric eBGP neighbor (another leaf or spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `4201032407` |
| `$BGP_GROUP` | Name of the eBGP underlay group. | `l3clos-l` |
| `$UNDERLAY_LOCAL_V4_1` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.5.1` |
| `$UNDERLAY_LOCAL_V4_2` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.5.3` |
| `$UNDERLAY_LOCAL_V4_3` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.5.11` |
| `$UNDERLAY_LOCAL_V4_4` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.5.9` |
| `$UNDERLAY_LOCAL_V4_5` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.5.32` |
| `$UNDERLAY_LOCAL_V4_6` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.5.34` |
| `$UNDERLAY_LOCAL_V4_7` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.5.36` |
| `$UNDERLAY_LOCAL_V4_8` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.5.38` |
| `$UNDERLAY_PEER_V4_1` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.5.0` |
| `$UNDERLAY_PEER_V4_2` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.5.2` |
| `$UNDERLAY_PEER_V4_3` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.5.10` |
| `$UNDERLAY_PEER_V4_4` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.5.8` |
| `$UNDERLAY_PEER_V4_5` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.5.33` |
| `$UNDERLAY_PEER_V4_6` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.5.35` |
| `$UNDERLAY_PEER_V4_7` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.5.37` |
| `$UNDERLAY_PEER_V4_8` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.5.39` |

## Policy

| Variable | What it is | Example value |
|---|---|---|
| `$BGP_EXPORT_POL` | Policy-statement name applied as a BGP `export` (in a policy form, the policy's own name). | `SPINE_TO_LEAF_FABRIC_OUT` |
| `$BGP_EXPORT_POL_1` | Policy-statement name applied as a BGP `export`; `_1`, `_2` number the members of a policy chain (`export ( A && B )`), in evaluation order. | `LEAF_TO_SPINE_FABRIC_OUT` |
| `$BGP_EXPORT_POL_2` | Policy-statement name applied as a BGP `export`; `_1`, `_2` number the members of a policy chain (`export ( A && B )`), in evaluation order. | `BGP-AOS-Policy` |
| `$COMMUNITY_ADMIN` | Administrator field of the first member of the route-tagging community; distinct per device in this JVD. | `3` |
| `$COMMUNITY_NAME` | Name of a BGP community that a policy adds to routes (`community add`). | `DEFAULT_DIRECT_V4` |
| `$POLICY_NAME` | Name of a routing policy referenced by `from policy` in another policy (here the direct-route policy). | `AllPodNetworks` |
| `$PPLB_NAME` | Name of the per-packet load-balancing policy that the forwarding table exports. | `PFE-LB` |
| `$TERM_NAME` | Name of the single term of a policy-statement. | `SPINE_TO_LEAF_FABRIC_OUT-10` |
| `$TERM_NAME_1` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `AllPodNetworks-10` |
| `$TERM_NAME_2` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `AllPodNetworks-100` |
| `$TERM_NAME_3` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `BGP-AOS-Policy-100` |
