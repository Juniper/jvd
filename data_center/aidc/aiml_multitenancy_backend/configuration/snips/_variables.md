# Snippet variable glossary

All `.conf` files under `evo/` are templates: identifiers that vary between deployments are written
as `$VAR`. Render a snippet by substituting each placeholder with your deployment's value. The placeholders each
snippet uses are listed in its `Variables:` header and in the glossary below. Variable names and meanings follow
the shared JVD snippet vocabulary. Numbered variables (`_1`, `_2`, …) form an ordered set; the numbers carry no
other meaning.

Values left literal on purpose: the communities `FROM_SPINE_FABRIC_TIER` (`0:15`) and `FROM_SPINE_EVPN_TIER`
(`0:14`), which the tier policies reference by name; the class-of-service model (forwarding classes `CNP` and
`NO-LOSS`, classifier `mydscp`, schedulers `s1` and `s2-cnp`, scheduler map `sm1`, drop profile `dp1`, congestion
notification profile `cnp`, buffer partitions and code points) and its binding on every `et-*` interface; the MTUs
(`9216`, `9192`, `9170`, `9000`), the BFD timers, the breakout and port speeds, the router-advertisement intervals,
the hash and dynamic load-balancing parameters, the route-target ID `1`, the gRPC routing instance `mgmt_junos`,
`unit 0`, and the loopback `lo0`.

## System

| Variable | What it is | Example value |
|---|---|---|
| `$FPC_SLOT` | FPC slot number. | `0` |
| `$GRPC_PORT` | TCP port of the gRPC request-response extension service over SSL. | `32767` |
| `$HOST_NAME` | System host name. | `GPU-R1-L1` |
| `$LOCAL_CERT` | Name of the local certificate (`security certificates local`) the gRPC SSL service presents (`local-certificate`). | `aos_grpc` |
| `$LOCAL_CERT_KEY` | PEM private key and certificate of the local certificate; secret, supplied by the operator (the published value is sanitized). | `"<LOCAL_CERT_KEY>"` |
| `$NEXT_HOP_V4` | IPv4 next hop of a static route: here the management network gateway. | `10.161.39.254` |

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number (`routing-options autonomous-system`). | `208` |
| `$LOOPBACK_V4` | Loopback IPv4 address of the local device: the overlay session `local-address`, and the administrator field of a VRF route distinguisher. | `10.0.0.8` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on a loopback unit (unit 0, or a tenant VRF's loopback unit). | `10.0.1.9/32` |
| `$LOOPBACK_V6_PFX` | IPv6 address with prefix length on a loopback unit. | `fdf6:ed70:1fac:f2d2::1007/128` |
| `$ROUTER_ID` | Router identifier in IPv4 dotted-decimal form. | `10.0.1.9` |

## Tenant VRFs

| Variable | What it is | Example value |
|---|---|---|
| `$AC_IFL` | Access-facing logical interface (`<interface>.<unit>`): here a GPU server link with IPv6 router advertisements. | `et-0/0/12:0.0` |
| `$AC_IFL_1` | Access-facing logical interface listed in a tenant VRF (a GPU server or tester link); `_1`, `_2`, … number the VRF's interfaces in source order. | `et-0/0/12:1.0` |
| `$AC_IFL_2` | Access-facing logical interface listed in a tenant VRF (a GPU server or tester link); `_1`, `_2`, … number the VRF's interfaces in source order. | `et-0/0/16:1.0` |
| `$AC_IFL_3` | Access-facing logical interface listed in a tenant VRF (a GPU server or tester link); `_1`, `_2`, … number the VRF's interfaces in source order. | `et-0/0/41:0.0` |
| `$AC_IFL_4` | Access-facing logical interface listed in a tenant VRF (a GPU server or tester link); `_1`, `_2`, … number the VRF's interfaces in source order. | `et-0/0/41:1.0` |
| `$INSTANCE_NAME` | Name of a tenant routing instance (VRF); also names its IPv6 routing table (`<instance>.inet6.0`). | `tenant-2` |
| `$IP_PREFIX_EXPORT_POL` | Policy-statement name exported as EVPN Type 5 IP prefix routes from a tenant VRF (in a policy form, the policy's own name). | `BGP-AOS-Policy-non-tenant` |
| `$LOOPBACK_IFL` | Loopback logical interface (`lo0.<unit>`) listed in a tenant VRF. | `lo0.3` |
| `$RD_SUB_ASSIGNED` | Assigned-number field of a VRF route distinguisher (`<loopback>:<number>`). | `2002` |
| `$RT_AS` | AS field of a VRF route target (`target:<AS>:1`). | `20002` |
| `$VNI` | VXLAN network identifier of a tenant VRF's EVPN Type 5 IP prefix routes. | `20002` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address with prefix length on an access-facing Layer 3 unit. | `10.200.101.1/24` |
| `$AC_INTF` | Access-facing physical interface (a GPU server or traffic-tester link). | `et-0/0/41:0` |
| `$BREAKOUT_SUB_PORTS` | Number of sub-ports a channelized (breakout) port is split into (`number-of-sub-ports`). | `2` |
| `$CORE_PHYS` | Fabric-facing physical interface of a point-to-point leaf-spine link. | `et-0/0/0:0` |
| `$CORE_V4_ADDR` | IPv4 address with prefix length (/31) on a leaf-spine fabric link. | `10.0.2.177/31` |
| `$DESCRIPTION` | Free-text interface or BGP neighbor `description`. | `"Breakout et-0/0/0"` |
| `$DESCRIPTION_1` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_gpu-r1-l1-evpn-overlay` |
| `$DESCRIPTION_2` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_gpu-r1-l2-evpn-overlay` |
| `$DESCRIPTION_3` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_gpu-r2-l1-evpn-overlay` |
| `$DESCRIPTION_4` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_gpu-r2-l2-evpn-overlay` |
| `$IFD` | Physical interface name (a breakout port or a port that carries no traffic in the design). | `et-0/0/0` |
| `$IRB_ADDR` | IPv4 gateway address with prefix length on an IRB unit. | `10.200.0.1/24` |
| `$IRB_MAC` | MAC address of an IRB unit. | `00:1c:73:00:00:01` |
| `$IRB_UNIT` | IRB unit number. | `2` |
| `$UNIT` | Logical unit number. | `0` |

## Fabric underlay and overlay

| Variable | What it is | Example value |
|---|---|---|
| `$ASN_FABRIC_PEER_1` | Autonomous-system number of a fabric eBGP neighbor (another leaf or spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `208` |
| `$ASN_FABRIC_PEER_2` | Autonomous-system number of a fabric eBGP neighbor (another leaf or spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `209` |
| `$ASN_FABRIC_PEER_3` | Autonomous-system number of a fabric eBGP neighbor (another leaf or spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `210` |
| `$ASN_FABRIC_PEER_4` | Autonomous-system number of a fabric eBGP neighbor (another leaf or spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `211` |
| `$BGP_GROUP` | Name of an eBGP group (the underlay group or the EVPN overlay group). | `l3clos-s-evpn` |
| `$OVERLAY_PEER_V4_1` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (another leaf or spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.9` |
| `$OVERLAY_PEER_V4_2` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (another leaf or spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.8` |
| `$OVERLAY_PEER_V4_3` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (another leaf or spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.10` |
| `$OVERLAY_PEER_V4_4` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (another leaf or spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.11` |
| `$UNDERLAY_LOCAL_V4_1` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.2.131` |
| `$UNDERLAY_LOCAL_V4_2` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.2.177` |
| `$UNDERLAY_LOCAL_V4_3` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.2.129` |
| `$UNDERLAY_LOCAL_V4_4` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.2.159` |
| `$UNDERLAY_LOCAL_V4_5` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.2.145` |
| `$UNDERLAY_LOCAL_V4_6` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.2.175` |
| `$UNDERLAY_LOCAL_V4_7` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.2.151` |
| `$UNDERLAY_LOCAL_V4_8` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.2.181` |
| `$UNDERLAY_PEER_V4_1` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.2.130` |
| `$UNDERLAY_PEER_V4_2` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.2.176` |
| `$UNDERLAY_PEER_V4_3` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.2.128` |
| `$UNDERLAY_PEER_V4_4` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.2.158` |
| `$UNDERLAY_PEER_V4_5` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.2.144` |
| `$UNDERLAY_PEER_V4_6` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.2.174` |
| `$UNDERLAY_PEER_V4_7` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.2.150` |
| `$UNDERLAY_PEER_V4_8` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.2.180` |

## Policy

| Variable | What it is | Example value |
|---|---|---|
| `$BGP_EXPORT_POL` | Policy-statement name applied as a BGP `export` (in a policy form, the policy's own name). | `EVPN_EXPORT` |
| `$BGP_EXPORT_POL_1` | Policy-statement name applied as a BGP `export`; `_1`, `_2` number the members of a policy chain (`export ( A && B )`), in evaluation order. | `LEAF_TO_SPINE_EVPN_OUT` |
| `$BGP_EXPORT_POL_2` | Policy-statement name applied as a BGP `export`; `_1`, `_2` number the members of a policy chain (`export ( A && B )`), in evaluation order. | `EVPN_EXPORT` |
| `$COMMUNITY_ADMIN_1` | Administrator field of a member of a two-member community; `_1`, `_2` number the members in order. | `5` |
| `$COMMUNITY_ADMIN_2` | Administrator field of a member of a two-member community; `_1`, `_2` number the members in order. | `21001` |
| `$COMMUNITY_ASSIGNED_1` | Assigned-number field of the first member of a two-member community. | `20007` |
| `$COMMUNITY_NAME` | Name of a BGP community: in a community form, its own name; in a policy, the community it adds (`community add`). | `DEFAULT_DIRECT_V4` |
| `$COMMUNITY_NAME_1` | Name of a BGP community that a policy adds to routes (`community add`); `_1`, `_2` number the communities of one policy, in term order. | `DEFAULT_DIRECT_V4` |
| `$COMMUNITY_NAME_2` | Name of a BGP community that a policy adds to routes (`community add`); `_1`, `_2` number the communities of one policy, in term order. | `DEFAULT_DIRECT_V6` |
| `$POLICY_NAME` | Name of a routing policy referenced by `from policy` in another policy (here the direct-route policies). | `AllPodNetworks` |
| `$PPLB_NAME` | Name of the per-packet load-balancing policy that the forwarding table exports. | `PFE-LB` |
| `$TERM_NAME` | Name of the single term of a policy-statement. | `EVPN_EXPORT-4095` |
| `$TERM_NAME_1` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `AllPodNetworks-10` |
| `$TERM_NAME_2` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `AllPodNetworks-20` |
| `$TERM_NAME_3` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `AllPodNetworks-100` |
| `$TERM_NAME_4` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `BGP-AOS-Policy-100` |
