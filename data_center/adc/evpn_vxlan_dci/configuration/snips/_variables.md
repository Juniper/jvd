# Snippet variable glossary

All `.conf` files under `junos/` and `evo/` are templates: identifiers that vary between deployments are written
as `$VAR`. Render a snippet by substituting each placeholder with your deployment's value. The placeholders each
snippet uses are listed in its `Variables:` header and in the glossary below. Variable names and meanings follow
the shared JVD snippet vocabulary. Numbered variables (`_1`, `_2`, …) form an ordered set; the numbers carry no
other meaning.

Values left literal on purpose: the tier communities `FROM_SPINE_FABRIC_TIER`, `FROM_SPINE_EVPN_TIER`,
`FROM_SUPERSPINE_FABRIC_TIER`, `FROM_SUPERSPINE_EVPN_TIER` and `FABRIC_COMMUNITIES` and the communities
`EVPN_GW_OUT` and `NO_ADVERTISE`, which the policies reference by name; the route targets (`vrf-target`) of the
MAC-VRFs, the VRFs and the EVPN interconnects, which each form carries as validated; the tenant prefixes in the
route-filter lists; the Routing Engine protection objects (filter `cpp-filter-v1`, policer `police-5mbps` and the
prefix lists `bgp-sources`, `ntp-sources`, `snmp-sources` and `ssh-sources`); the MTUs, the BFD timers, the port
speeds, the prefix-length ranges, the router-advertisement settings, the load-balancing parameters, the
management instance `mgmt_junos`, `unit 0`, and the loopback `lo0`.

## System

| Variable | What it is | Example value |
|---|---|---|
| `$FPC_SLOT` | FPC slot number. | `0` |
| `$GRPC_PORT` | TCP port of the gRPC request-response extension service over SSL. | `32767` |
| `$HOST_NAME` | System host name. | `dc1-borderleaf-001-leaf1` |
| `$LOCAL_CERT` | Name of a local certificate (`security certificates local`), as defined and as referenced by `local-certificate`. | `aos_grpc` |
| `$LOCAL_CERT_KEY` | PEM private key and certificate of a local certificate; secret, supplied by the operator. | `"<LOCAL_CERT_KEY>"` |
| `$PIC_PORT` | **new** Port number on a PIC whose speed a chassis statement sets (`chassis fpc <n> pic <n> port <n>`). | `51` |

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `64514` |
| `$LOOPBACK_V4` | Primary per-node IPv4 loopback address. | `192.168.255.2` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on a loopback unit. | `192.168.252.8/32` |
| `$LOOPBACK_V6_PFX` | IPv6 address with prefix length on a loopback unit. | `fdf6:ed70:1fac:f2d4::1002/128` |
| `$ROUTER_ID` | Complete router identifier in IPv4 dotted-decimal form. | `192.168.255.2` |

## MAC-VRFs and VLANs

| Variable | What it is | Example value |
|---|---|---|
| `$AC_IFL_1` | Access-facing logical interface listed in a MAC-VRF (a server-facing port or an ESI-LAG unit); `_1`, `_2`, … number the instance's interfaces in source order. | `et-0/0/8:0.0` |
| `$AC_IFL_2` | Access-facing logical interface listed in a MAC-VRF (a server-facing port or an ESI-LAG unit); `_1`, `_2`, … number the instance's interfaces in source order. | `ae1.0` |
| `$AC_IFL_3` | Access-facing logical interface listed in a MAC-VRF (a server-facing port or an ESI-LAG unit); `_1`, `_2`, … number the instance's interfaces in source order. | `ae2.0` |
| `$BD_NAME_1` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2500` |
| `$BD_NAME_10` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2509` |
| `$BD_NAME_11` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn400` |
| `$BD_NAME_12` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn401` |
| `$BD_NAME_13` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn402` |
| `$BD_NAME_14` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn403` |
| `$BD_NAME_15` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn404` |
| `$BD_NAME_16` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn405` |
| `$BD_NAME_17` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn406` |
| `$BD_NAME_18` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn407` |
| `$BD_NAME_19` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn408` |
| `$BD_NAME_2` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2501` |
| `$BD_NAME_20` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn409` |
| `$BD_NAME_21` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2700` |
| `$BD_NAME_22` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2701` |
| `$BD_NAME_23` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2702` |
| `$BD_NAME_24` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2703` |
| `$BD_NAME_25` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2704` |
| `$BD_NAME_26` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2705` |
| `$BD_NAME_27` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2706` |
| `$BD_NAME_28` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2707` |
| `$BD_NAME_29` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2708` |
| `$BD_NAME_3` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2502` |
| `$BD_NAME_30` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2709` |
| `$BD_NAME_31` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn400` |
| `$BD_NAME_32` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn401` |
| `$BD_NAME_33` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn402` |
| `$BD_NAME_34` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn403` |
| `$BD_NAME_35` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn404` |
| `$BD_NAME_36` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn405` |
| `$BD_NAME_37` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn406` |
| `$BD_NAME_38` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn407` |
| `$BD_NAME_39` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn408` |
| `$BD_NAME_4` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2503` |
| `$BD_NAME_40` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn409` |
| `$BD_NAME_41` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn600` |
| `$BD_NAME_42` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn601` |
| `$BD_NAME_43` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn602` |
| `$BD_NAME_44` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn603` |
| `$BD_NAME_45` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn604` |
| `$BD_NAME_46` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn605` |
| `$BD_NAME_47` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn606` |
| `$BD_NAME_48` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn607` |
| `$BD_NAME_49` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn608` |
| `$BD_NAME_5` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2504` |
| `$BD_NAME_50` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn609` |
| `$BD_NAME_6` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2505` |
| `$BD_NAME_7` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2506` |
| `$BD_NAME_8` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2507` |
| `$BD_NAME_9` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2508` |
| `$VLAN_BD_1` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2500` |
| `$VLAN_BD_10` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2509` |
| `$VLAN_BD_11` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `400` |
| `$VLAN_BD_12` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `401` |
| `$VLAN_BD_13` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `402` |
| `$VLAN_BD_14` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `403` |
| `$VLAN_BD_15` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `404` |
| `$VLAN_BD_16` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `405` |
| `$VLAN_BD_17` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `406` |
| `$VLAN_BD_18` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `407` |
| `$VLAN_BD_19` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `408` |
| `$VLAN_BD_2` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2501` |
| `$VLAN_BD_20` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `409` |
| `$VLAN_BD_21` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2700` |
| `$VLAN_BD_22` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2701` |
| `$VLAN_BD_23` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2702` |
| `$VLAN_BD_24` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2703` |
| `$VLAN_BD_25` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2704` |
| `$VLAN_BD_26` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2705` |
| `$VLAN_BD_27` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2706` |
| `$VLAN_BD_28` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2707` |
| `$VLAN_BD_29` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2708` |
| `$VLAN_BD_3` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2502` |
| `$VLAN_BD_30` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2709` |
| `$VLAN_BD_31` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `400` |
| `$VLAN_BD_32` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `401` |
| `$VLAN_BD_33` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `402` |
| `$VLAN_BD_34` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `403` |
| `$VLAN_BD_35` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `404` |
| `$VLAN_BD_36` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `405` |
| `$VLAN_BD_37` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `406` |
| `$VLAN_BD_38` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `407` |
| `$VLAN_BD_39` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `408` |
| `$VLAN_BD_4` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2503` |
| `$VLAN_BD_40` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `409` |
| `$VLAN_BD_41` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `600` |
| `$VLAN_BD_42` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `601` |
| `$VLAN_BD_43` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `602` |
| `$VLAN_BD_44` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `603` |
| `$VLAN_BD_45` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `604` |
| `$VLAN_BD_46` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `605` |
| `$VLAN_BD_47` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `606` |
| `$VLAN_BD_48` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `607` |
| `$VLAN_BD_49` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `608` |
| `$VLAN_BD_5` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2504` |
| `$VLAN_BD_50` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `609` |
| `$VLAN_BD_6` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2505` |
| `$VLAN_BD_7` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2506` |
| `$VLAN_BD_8` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2507` |
| `$VLAN_BD_9` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2508` |
| `$VNI` | VXLAN network identifier (VNI) of a VLAN, bridge domain or EVPN Type 5 routing instance. | `20004` |
| `$VNI_1` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12500` |
| `$VNI_10` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12509` |
| `$VNI_11` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `41400` |
| `$VNI_12` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `41401` |
| `$VNI_13` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `41402` |
| `$VNI_14` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `41403` |
| `$VNI_15` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `41404` |
| `$VNI_16` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `41405` |
| `$VNI_17` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `41406` |
| `$VNI_18` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `41407` |
| `$VNI_19` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `41408` |
| `$VNI_2` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12501` |
| `$VNI_20` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `41409` |
| `$VNI_21` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11400` |
| `$VNI_22` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11401` |
| `$VNI_23` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11402` |
| `$VNI_24` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11403` |
| `$VNI_25` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11404` |
| `$VNI_26` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11405` |
| `$VNI_27` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11406` |
| `$VNI_28` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11407` |
| `$VNI_29` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11408` |
| `$VNI_3` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12502` |
| `$VNI_30` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11409` |
| `$VNI_31` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `41400` |
| `$VNI_32` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `41401` |
| `$VNI_33` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `41402` |
| `$VNI_34` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `41403` |
| `$VNI_35` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `41404` |
| `$VNI_36` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `41405` |
| `$VNI_37` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `41406` |
| `$VNI_38` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `41407` |
| `$VNI_39` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `41408` |
| `$VNI_4` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12503` |
| `$VNI_40` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `41409` |
| `$VNI_41` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11400` |
| `$VNI_42` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11401` |
| `$VNI_43` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11402` |
| `$VNI_44` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11403` |
| `$VNI_45` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11404` |
| `$VNI_46` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11405` |
| `$VNI_47` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11406` |
| `$VNI_48` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11407` |
| `$VNI_49` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11408` |
| `$VNI_5` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12504` |
| `$VNI_50` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11409` |
| `$VNI_51` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12700` |
| `$VNI_52` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12701` |
| `$VNI_53` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12702` |
| `$VNI_54` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12703` |
| `$VNI_55` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12704` |
| `$VNI_56` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12705` |
| `$VNI_57` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12706` |
| `$VNI_58` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12707` |
| `$VNI_59` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12708` |
| `$VNI_6` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12505` |
| `$VNI_60` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12709` |
| `$VNI_7` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12506` |
| `$VNI_8` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12507` |
| `$VNI_9` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12508` |

## Data center interconnect

| Variable | What it is | Example value |
|---|---|---|
| `$ASN_DCI_PEER` | **new** AS number of the remote site's DCI gateway, for both the overlay and the link sessions. | `65105` |
| `$ASN_DCI_PEER_1` | **new** AS number of the remote site's DCI gateway, for both the overlay and the link sessions. Numbered `_1`, `_2`, … in source order. | `64800` |
| `$ASN_DCI_PEER_2` | **new** AS number of the remote site's DCI gateway, for both the overlay and the link sessions. Numbered `_1`, `_2`, … in source order. | `64801` |
| `$DCI_LINK_LOCAL_V4` | **new** `local-address` of this gateway on the inter-site link. | `172.17.10.1` |
| `$DCI_LINK_PEER_V4` | **new** IPv4 address of the remote site's DCI gateway on the inter-site link (default-instance eBGP neighbor). | `172.17.10.2` |
| `$DCI_PEER_V4` | **new** Loopback IPv4 address of a remote DCI gateway: the neighbor of the multihop DCI overlay eBGP session between the gateways of two data centers. | `192.168.254.2` |
| `$DCI_PEER_V4_1` | **new** Loopback IPv4 address of a remote DCI gateway: the neighbor of the multihop DCI overlay eBGP session between the gateways of two data centers. Numbered `_1`, `_2`, … in source order. | `192.168.253.0` |
| `$DCI_PEER_V4_2` | **new** Loopback IPv4 address of a remote DCI gateway: the neighbor of the multihop DCI overlay eBGP session between the gateways of two data centers. Numbered `_1`, `_2`, … in source order. | `192.168.253.1` |
| `$INTERCONNECT_PEER_GW_1` | **new** Loopback IPv4 address of a DCI gateway of the same data center that shares the EVPN interconnect (`evpn interconnect-multihoming-peer-gateways`). Numbered `_1`, `_2`, … in source order. | `192.168.255.2` |
| `$INTERCONNECT_PEER_GW_2` | **new** Loopback IPv4 address of a DCI gateway of the same data center that shares the EVPN interconnect (`evpn interconnect-multihoming-peer-gateways`). Numbered `_1`, `_2`, … in source order. | `192.168.255.3` |
| `$MACSEC_CA` | **new** Name of a MACsec connectivity association (`security macsec connectivity-association`). | `dc1-dc2-dci` |
| `$MACSEC_CAK` | **new** Connectivity association key (CAK) of a static-CAK MACsec connectivity association (`pre-shared-key cak`): a secret both ends of the link share. | `"<MACSEC_CAK>"` |
| `$MACSEC_CKN` | **new** Connectivity association key name (CKN) of a static-CAK MACsec connectivity association (`pre-shared-key ckn`): a hexadecimal string both ends of the link share. | `abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234` |
| `$MULTIHOP_TTL` | **new** Time to live of a multihop eBGP session (`multihop ttl`). | `2` |

## VRFs and the external router

| Variable | What it is | Example value |
|---|---|---|
| `$ASN_CUSTOMER` | Customer-facing BGP peer autonomous-system number. | `65000` |
| `$CE_PEER_V4` | IPv4 address of a VRF eBGP neighbor on the customer or external side. | `10.200.0.5` |
| `$CE_PEER_V6` | IPv6 address of a VRF eBGP neighbor on the customer or external side. | `2001:db8:dc1:10:200::5` |
| `$DHCP_RELAY_GROUP` | Name of a DHCP relay group (`forwarding-options dhcp-relay group`); its interfaces relay DHCP to the server group. | `blue` |
| `$DHCP_SERVER_V4` | **new** IPv4 address of a DHCP server in a DHCP relay server group (`forwarding-options dhcp-relay server-group`). | `192.168.36.100` |
| `$INSTANCE_NAME` | Identity stem of a service instance. | `EVPN_DCI_L2_TARGET` |
| `$IP_PREFIX_EXPORT_POL` | Name of the policy-statement a routing instance exports as EVPN Type 5 IP prefix routes (`ip-prefix-routes export`), as applied and as defined. | `BGP-AOS-Policy-blue` |
| `$LOOPBACK_IFL` | Loopback logical interface (`lo0.<unit>`) listed in a routing instance. | `lo0.4` |
| `$PE_LOCAL_V4` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. | `10.200.0.4` |
| `$PE_LOCAL_V6` | Local IPv6 address of the PE side of a CE eBGP session (`local-address`). | `2001:db8:dc1:10:200::4` |
| `$RT_AS` | Route Target Administrator subfield. | `65655L` |
| `$RT_ID` | Route Target Assigned Number subfield. | `1` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address with prefix length on an attachment (access-facing) Layer 3 unit. | `172.17.10.1/24` |
| `$AC_ADDR_V6` | IPv6 address with prefix length on an attachment (access-facing) Layer 3 unit. | `2001:db8:dc1:17:10::1/80` |
| `$AC_IFL` | Full logical attachment-circuit interface identifier, including its unit. | `et-0/0/12:2.3000` |
| `$AC_INTF` | Attachment (access-facing) physical interface. | `et-0/0/12:2` |
| `$AC_INTF_1` | Member port of an ESI-LAG access bundle; `_1`, `_2`, … number the members in source order. | `et-0/0/8:0` |
| `$AC_INTF_2` | Member port of an ESI-LAG access bundle; `_1`, `_2`, … number the members in source order. | `ae1` |
| `$AE_BUNDLE` | Aggregated Ethernet interface (`ae<n>`), as configured and as its member ports name it (`802.3ad`). | `ae1` |
| `$AE_DEVICE_COUNT` | Number of aggregated Ethernet devices the chassis creates (`aggregated-devices ethernet device-count`). | `1` |
| `$BREAKOUT_SUB_PORTS` | Number of sub-ports a channelized (breakout) port is split into (`number-of-sub-ports`). | `4` |
| `$CORE_INTF` | Core- or fabric-facing interface; numbered `_1`, `_2`, … it is a logical interface (with unit) in a per-device form, in source order. | `et-0/0/8:1` |
| `$CORE_PHYS` | Core- or fabric-facing interface (physical or aggregate) of a point-to-point transport link. | `et-0/0/2` |
| `$CORE_V4_ADDR` | IPv4 address with prefix length on a core- or fabric-facing point-to-point link. | `10.0.1.1/31` |
| `$CORE_V6_ADDR` | IPv6 address with prefix length on a core- or fabric-facing point-to-point link. | `fdf6:ed70:1fac:f2d1::1/127` |
| `$DESCRIPTION` | Free-text `description` of an interface, unit or BGP neighbor. | `to.sys003-001-003` |
| `$DESCRIPTION_1` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_dc3-bl1-evpn-gateway` |
| `$DESCRIPTION_10` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `green_2509` |
| `$DESCRIPTION_11` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_400` |
| `$DESCRIPTION_12` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_401` |
| `$DESCRIPTION_13` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_402` |
| `$DESCRIPTION_14` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_403` |
| `$DESCRIPTION_15` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_404` |
| `$DESCRIPTION_16` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_405` |
| `$DESCRIPTION_17` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_406` |
| `$DESCRIPTION_18` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_407` |
| `$DESCRIPTION_19` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_408` |
| `$DESCRIPTION_2` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_dc3-bl2-evpn-gateway` |
| `$DESCRIPTION_20` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_409` |
| `$DESCRIPTION_21` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `green_2700` |
| `$DESCRIPTION_22` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `green_2701` |
| `$DESCRIPTION_23` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `green_2702` |
| `$DESCRIPTION_24` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `green_2703` |
| `$DESCRIPTION_25` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `green_2704` |
| `$DESCRIPTION_26` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `green_2705` |
| `$DESCRIPTION_27` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `green_2706` |
| `$DESCRIPTION_28` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `green_2707` |
| `$DESCRIPTION_29` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `green_2708` |
| `$DESCRIPTION_3` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_sspine001-1-evpn-overlay` |
| `$DESCRIPTION_30` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `green_2709` |
| `$DESCRIPTION_31` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_400` |
| `$DESCRIPTION_32` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_401` |
| `$DESCRIPTION_33` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_402` |
| `$DESCRIPTION_34` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_403` |
| `$DESCRIPTION_35` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_404` |
| `$DESCRIPTION_36` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_405` |
| `$DESCRIPTION_37` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_406` |
| `$DESCRIPTION_38` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_407` |
| `$DESCRIPTION_39` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_408` |
| `$DESCRIPTION_4` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_sspine001-2-evpn-overlay` |
| `$DESCRIPTION_40` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_409` |
| `$DESCRIPTION_41` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_600` |
| `$DESCRIPTION_42` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_601` |
| `$DESCRIPTION_43` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_602` |
| `$DESCRIPTION_44` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_603` |
| `$DESCRIPTION_45` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_604` |
| `$DESCRIPTION_46` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_605` |
| `$DESCRIPTION_47` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_606` |
| `$DESCRIPTION_48` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_607` |
| `$DESCRIPTION_49` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_608` |
| `$DESCRIPTION_5` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_dc1-single-001-leaf1-evpn-overlay` |
| `$DESCRIPTION_50` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_609` |
| `$DESCRIPTION_6` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_spine003-001-2-evpn-overlay` |
| `$DESCRIPTION_7` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `green_2506` |
| `$DESCRIPTION_8` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `green_2507` |
| `$DESCRIPTION_9` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `green_2508` |
| `$ESI` | Ethernet segment identifier (10 octets) of a multihomed interface. | `00:08:00:00:00:00:03:00:00:03` |
| `$IFD` | Interface-device identifier, excluding a logical unit. | `et-0/0/12` |
| `$IRB_ADDR` | IPv4 address with prefix length on an IRB unit: the Layer 3 gateway of a VLAN or bridge domain. | `10.0.0.1/24` |
| `$IRB_ADDR_V6` | IPv6 address with prefix length on an IRB unit: the IPv6 gateway of a VLAN or bridge domain. | `2001:db8:dc1:10:00:00::1/96` |
| `$IRB_IFL_1` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2500` |
| `$IRB_IFL_10` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2509` |
| `$IRB_IFL_11` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.400` |
| `$IRB_IFL_12` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.401` |
| `$IRB_IFL_13` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.402` |
| `$IRB_IFL_14` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.403` |
| `$IRB_IFL_15` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.404` |
| `$IRB_IFL_16` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.405` |
| `$IRB_IFL_17` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.406` |
| `$IRB_IFL_18` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.407` |
| `$IRB_IFL_19` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.408` |
| `$IRB_IFL_2` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2501` |
| `$IRB_IFL_20` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.409` |
| `$IRB_IFL_21` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2700` |
| `$IRB_IFL_22` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2701` |
| `$IRB_IFL_23` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2702` |
| `$IRB_IFL_24` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2703` |
| `$IRB_IFL_25` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2704` |
| `$IRB_IFL_26` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2705` |
| `$IRB_IFL_27` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2706` |
| `$IRB_IFL_28` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2707` |
| `$IRB_IFL_29` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2708` |
| `$IRB_IFL_3` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2502` |
| `$IRB_IFL_30` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2709` |
| `$IRB_IFL_31` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.400` |
| `$IRB_IFL_32` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.401` |
| `$IRB_IFL_33` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.402` |
| `$IRB_IFL_34` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.403` |
| `$IRB_IFL_35` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.404` |
| `$IRB_IFL_36` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.405` |
| `$IRB_IFL_37` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.406` |
| `$IRB_IFL_38` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.407` |
| `$IRB_IFL_39` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.408` |
| `$IRB_IFL_4` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2503` |
| `$IRB_IFL_40` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.409` |
| `$IRB_IFL_41` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.600` |
| `$IRB_IFL_42` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.601` |
| `$IRB_IFL_43` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.602` |
| `$IRB_IFL_44` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.603` |
| `$IRB_IFL_45` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.604` |
| `$IRB_IFL_46` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.605` |
| `$IRB_IFL_47` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.606` |
| `$IRB_IFL_48` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.607` |
| `$IRB_IFL_49` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.608` |
| `$IRB_IFL_5` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2504` |
| `$IRB_IFL_50` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.609` |
| `$IRB_IFL_6` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2505` |
| `$IRB_IFL_7` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2506` |
| `$IRB_IFL_8` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2507` |
| `$IRB_IFL_9` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2508` |
| `$IRB_MAC` | MAC address configured on an IRB unit (`mac`). | `00:1c:73:00:00:01` |
| `$IRB_UNIT` | IRB unit number. | `400` |
| `$LACP_SYS_ID` | LACP system ID of an aggregated Ethernet bundle, shared by the multihoming peers of an ESI-LAG. | `08:00:00:00:00:03` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `3000` |

## Fabric underlay and overlay

| Variable | What it is | Example value |
|---|---|---|
| `$ASN_FABRIC_PEER` | Autonomous-system number of a fabric eBGP neighbor (another leaf or spine of an IP fabric). | `64706` |
| `$ASN_FABRIC_PEER_1` | Autonomous-system number of a fabric eBGP neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `64512` |
| `$ASN_FABRIC_PEER_2` | Autonomous-system number of a fabric eBGP neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `64513` |
| `$ASN_FABRIC_PEER_3` | Autonomous-system number of a fabric eBGP neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `64701` |
| `$ASN_FABRIC_PEER_4` | Autonomous-system number of a fabric eBGP neighbor (another leaf or spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `64517` |
| `$ASN_FABRIC_PEER_5` | Autonomous-system number of a fabric eBGP neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `64518` |
| `$BGP_GROUP` | Name of a BGP peer group. | `l3rtr` |
| `$OVERLAY_PEER_V4` | Loopback IPv4 address of an eBGP EVPN overlay neighbor in an IP fabric (another leaf or spine). | `192.168.253.1` |
| `$OVERLAY_PEER_V4_1` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `192.168.255.0` |
| `$OVERLAY_PEER_V4_2` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `192.168.255.1` |
| `$OVERLAY_PEER_V4_3` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `192.168.252.12` |
| `$OVERLAY_PEER_V4_4` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `192.168.252.13` |
| `$OVERLAY_PEER_V4_5` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `192.168.255.6` |
| `$OVERLAY_PEER_V4_6` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `192.168.252.5` |
| `$UNDERLAY_LOCAL_V4_1` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.1.1` |
| `$UNDERLAY_LOCAL_V4_2` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.1.11` |
| `$UNDERLAY_LOCAL_V4_3` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.4.16` |
| `$UNDERLAY_LOCAL_V4_4` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.4.18` |
| `$UNDERLAY_LOCAL_V4_5` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.1.8` |
| `$UNDERLAY_LOCAL_V4_6` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.4.21` |
| `$UNDERLAY_LOCAL_V6_1` | Local IPv6 address (`local-address`) of the eBGP underlay session with the IPv6 neighbor of the same number. | `fdf6:ed70:1fac:f2d1::1` |
| `$UNDERLAY_LOCAL_V6_2` | Local IPv6 address (`local-address`) of the eBGP underlay session with the IPv6 neighbor of the same number. | `fdf6:ed70:1fac:f2d1::b` |
| `$UNDERLAY_LOCAL_V6_3` | Local IPv6 address (`local-address`) of the eBGP underlay session with the IPv6 neighbor of the same number. | `fdf6:ed70:1fac:f2d4::28` |
| `$UNDERLAY_LOCAL_V6_4` | Local IPv6 address (`local-address`) of the eBGP underlay session with the IPv6 neighbor of the same number. | `fdf6:ed70:1fac:f2d4::2a` |
| `$UNDERLAY_LOCAL_V6_5` | Local IPv6 address (`local-address`) of the eBGP underlay session with the IPv6 neighbor of the same number. | `fdf6:ed70:1fac:f2d1::8` |
| `$UNDERLAY_LOCAL_V6_6` | Local IPv6 address (`local-address`) of the eBGP underlay session with the IPv6 neighbor of the same number. | `fdf6:ed70:1fac:f2d4::2d` |
| `$UNDERLAY_PEER_V4_1` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.0` |
| `$UNDERLAY_PEER_V4_2` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.10` |
| `$UNDERLAY_PEER_V4_3` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a fabric /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.4.17` |
| `$UNDERLAY_PEER_V4_4` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a fabric /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.4.19` |
| `$UNDERLAY_PEER_V4_5` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a fabric /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.9` |
| `$UNDERLAY_PEER_V4_6` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a fabric /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.4.20` |
| `$UNDERLAY_PEER_V6_1` | IPv6 address of a directly connected eBGP underlay neighbor (the far end of a fabric link); `_1`, `_2`, … number the IPv6 neighbors of one group, in neighbor order. IPv6 member of the `$UNDERLAY_PEER_V4` family. | `fdf6:ed70:1fac:f2d1::` |
| `$UNDERLAY_PEER_V6_2` | IPv6 address of a directly connected eBGP underlay neighbor (the far end of a fabric link); `_1`, `_2`, … number the IPv6 neighbors of one group, in neighbor order. IPv6 member of the `$UNDERLAY_PEER_V4` family. | `fdf6:ed70:1fac:f2d1::a` |
| `$UNDERLAY_PEER_V6_3` | IPv6 address of a directly connected eBGP underlay neighbor (the far end of a fabric link); `_1`, `_2`, … number the IPv6 neighbors of one group, in neighbor order. IPv6 member of the `$UNDERLAY_PEER_V4` family. | `fdf6:ed70:1fac:f2d4::29` |
| `$UNDERLAY_PEER_V6_4` | IPv6 address of a directly connected eBGP underlay neighbor (the far end of a fabric link); `_1`, `_2`, … number the IPv6 neighbors of one group, in neighbor order. IPv6 member of the `$UNDERLAY_PEER_V4` family. | `fdf6:ed70:1fac:f2d4::2b` |
| `$UNDERLAY_PEER_V6_5` | IPv6 address of a directly connected eBGP underlay neighbor (the far end of a fabric link); `_1`, `_2`, … number the IPv6 neighbors of one group, in neighbor order. IPv6 member of the `$UNDERLAY_PEER_V4` family. | `fdf6:ed70:1fac:f2d1::9` |
| `$UNDERLAY_PEER_V6_6` | IPv6 address of a directly connected eBGP underlay neighbor (the far end of a fabric link); `_1`, `_2`, … number the IPv6 neighbors of one group, in neighbor order. IPv6 member of the `$UNDERLAY_PEER_V4` family. | `fdf6:ed70:1fac:f2d4::2c` |

## Policy

| Variable | What it is | Example value |
|---|---|---|
| `$BGP_EXPORT_POL` | Policy-statement name applied as a BGP `export`. | `EVPN_EXPORT` |
| `$BGP_EXPORT_POL_1` | Policy-statement name applied as a BGP `export`; `_1`, `_2` number the members of a policy chain (`export ( A && B )`), in evaluation order. | `EVPN_GW_OUT` |
| `$BGP_EXPORT_POL_2` | Policy-statement name applied as a BGP `export`; `_1`, `_2` number the members of a policy chain (`export ( A && B )`), in evaluation order. | `EVPN_EXPORT` |
| `$BGP_EXPORT_POL_3` | Policy-statement name applied as a BGP `export`; `_1`, `_2` number the members of a policy chain (`export ( A && B )`), in evaluation order. | `SPINE_TO_SUPERSPINE_FABRIC_OUT` |
| `$BGP_IMPORT_POL` | Policy-statement name applied as a BGP `import`, as applied and as defined. | `EVPN_GW_IN` |
| `$COMMUNITY_ADMIN_1` | Administrator field of a member of a two-member community; `_1`, `_2` number the members in order. | `3` |
| `$COMMUNITY_ADMIN_2` | Administrator field of a member of a two-member community; `_1`, `_2` number the members in order. | `21000` |
| `$COMMUNITY_ASSIGNED_1` | Assigned-number field of the first member of a two-member community. | `20001` |
| `$COMMUNITY_NAME` | Name of a BGP community that a policy adds to routes, where the name differs between instances. | `EVPN_GW_IN` |
| `$COMMUNITY_NAME_1` | Name of a BGP community that a policy adds to routes (`community add`); `_1`, `_2` number the communities of one policy, in term order. | `BLUE_COMMUNITY_V4` |
| `$COMMUNITY_NAME_2` | Name of a BGP community that a policy adds to routes (`community add`); `_1`, `_2` number the communities of one policy, in term order. | `BLUE_COMMUNITY_V6` |
| `$MTU` | Interface MTU in bytes. | `9000` |
| `$POLICY_NAME` | Name of a routing policy-statement where no role-specific name (BGP export or import, VRF import or export, load balancing) applies. | `AllPodNetworks-blue` |
| `$PPLB_NAME` | Name of the per-packet load-balancing policy exported to the forwarding table. | `PFE-LB` |
| `$PREFIX` | IPv4 or IPv6 prefix in a route filter or route-filter list. | `192.168.255.2/32` |
| `$PREFIX_1` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `192.168.253.0/32` |
| `$PREFIX_2` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `192.168.253.1/32` |
| `$PREFIX_3` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `192.168.255.6/32` |
| `$PREFIX_4` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `10.4.8.0/23` |
| `$PREFIX_5` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `192.168.14.2/31` |
| `$PREFIX_6` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `192.168.14.7/32` |
| `$PREFIX_7` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `192.168.14.8/32` |
| `$ROUTE_FILTER_LIST` | Name of a route-filter list, as defined and as a policy references it. | `RoutesFromExt-default-DCI1` |
| `$ROUTE_FILTER_LIST_1` | Name of a route-filter list, as defined and as a policy references it. Numbered `_1`, `_2`, … in source order. | `EVPN_DCI_L3_IN-blue-blue-DCI` |
| `$ROUTE_FILTER_LIST_2` | Name of a route-filter list, as defined and as a policy references it. Numbered `_1`, `_2`, … in source order. | `EVPN_DCI_L3_INV6-blue-blue-DCI` |
| `$ROUTE_FILTER_LIST_3` | Name of a route-filter list, as defined and as a policy references it. Numbered `_1`, `_2`, … in source order. | `EVPN_DCI_L3_IN-red-red-DCI` |
| `$ROUTE_FILTER_LIST_4` | Name of a route-filter list, as defined and as a policy references it. Numbered `_1`, `_2`, … in source order. | `EVPN_DCI_L3_INV6-red-red-DCI` |
| `$ROUTE_FILTER_LIST_5` | Name of a route-filter list, as defined and as a policy references it. Numbered `_1`, `_2`, … in source order. | `EVPN_DCI_L3_IN-green-green-DCI` |
| `$ROUTE_FILTER_LIST_6` | Name of a route-filter list, as defined and as a policy references it. Numbered `_1`, `_2`, … in source order. | `EVPN_DCI_L3_INV6-green-green-DCI` |
| `$TERM_NAME` | Name of a policy-statement term. | `EVPN_EXPORT-4095` |
| `$TERM_NAME_1` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `ssh` |
| `$TERM_NAME_10` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `ospf` |
| `$TERM_NAME_11` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `fetch` |
| `$TERM_NAME_12` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `discard-rest` |
| `$TERM_NAME_2` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `icmp` |
| `$TERM_NAME_3` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `bgp` |
| `$TERM_NAME_4` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `dns` |
| `$TERM_NAME_5` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `ntp` |
| `$TERM_NAME_6` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `dhcp` |
| `$TERM_NAME_7` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `netconf` |
| `$TERM_NAME_8` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `bfd` |
| `$TERM_NAME_9` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `snmp` |
| `$VLAN` | A single VLAN identifier. | `3000` |
