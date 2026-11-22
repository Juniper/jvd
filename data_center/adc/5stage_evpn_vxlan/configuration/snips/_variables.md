# Snippet variable glossary

All `.conf` files under `junos/` and `evo/` are templates: identifiers that vary between deployments are written
as `$VAR`. Render a snippet by substituting each placeholder with your deployment's value. The placeholders each
snippet uses are listed in its `Variables:` header and in the glossary below. Variable names and meanings follow
the shared JVD snippet vocabulary. Numbered variables (`_1`, `_2`, …) form an ordered set; the numbers carry no
other meaning.

Values left literal on purpose: the tier communities `FROM_SPINE_FABRIC_TIER`, `FROM_SPINE_EVPN_TIER`,
`FROM_SUPERSPINE_FABRIC_TIER`, `FROM_SUPERSPINE_EVPN_TIER` and `FABRIC_COMMUNITIES`, which the tier policies
reference by name; the Routing Engine protection objects (filter `cpp-filter-v1`, policer `police-5mbps`, filter
`ALLOWED_FROM_HOST` and the prefix lists `bgp-sources`, `ntp-sources`, `snmp-sources` and `ssh-sources`); the
class-of-service model (forwarding classes, DSCP classifiers, rewrite rule `rw1`, schedulers, scheduler map `sm1`,
drop profiles, congestion notification profile `cnp`, buffer partitions and code points); the storm-control
profile `profile1`; the MTUs, the BFD timers, the port speeds and breakouts, the router-advertisement intervals,
the hash and dynamic load-balancing parameters, the management instance `mgmt_junos`, `unit 0`, and the loopback
`lo0`.

## System

| Variable | What it is | Example value |
|---|---|---|
| `$FPC_SLOT` | FPC slot number. | `0` |
| `$GRPC_PORT` | TCP port of the gRPC request-response extension service over SSL. | `32767` |
| `$HOST_NAME` | System host name. | `leaf003-001-1` |
| `$LOCAL_CERT` | Name of a local certificate (`security certificates local`), as defined and as referenced by `local-certificate`. | `aos_grpc` |
| `$TS_FPC` | FPC slot that hosts tunnel services. | `0` |
| `$TS_PIC` | PIC slot that hosts tunnel services. | `0` |

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `64708` |
| `$LOOPBACK_V4` | Primary per-node IPv4 loopback address. | `192.168.252.12` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on a loopback unit. | `192.168.252.12/32` |
| `$LOOPBACK_V6_PFX` | IPv6 address with prefix length on a loopback unit. | `fdf6:ed70:1fac:f2d1::100c/128` |
| `$ROUTER_ID` | Complete router identifier in IPv4 dotted-decimal form. | `192.168.252.12` |

## MAC-VRFs and VLANs

| Variable | What it is | Example value |
|---|---|---|
| `$BD_NAME_1` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn400` |
| `$BD_NAME_10` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn409` |
| `$BD_NAME_11` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn430` |
| `$BD_NAME_12` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn431` |
| `$BD_NAME_13` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn432` |
| `$BD_NAME_14` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn433` |
| `$BD_NAME_15` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn434` |
| `$BD_NAME_16` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn435` |
| `$BD_NAME_17` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn436` |
| `$BD_NAME_18` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn437` |
| `$BD_NAME_19` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn438` |
| `$BD_NAME_2` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn401` |
| `$BD_NAME_20` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn439` |
| `$BD_NAME_21` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1400` |
| `$BD_NAME_22` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1401` |
| `$BD_NAME_23` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1402` |
| `$BD_NAME_24` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1403` |
| `$BD_NAME_25` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1404` |
| `$BD_NAME_26` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1405` |
| `$BD_NAME_27` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1406` |
| `$BD_NAME_28` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1407` |
| `$BD_NAME_29` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1408` |
| `$BD_NAME_3` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn402` |
| `$BD_NAME_30` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1409` |
| `$BD_NAME_31` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1430` |
| `$BD_NAME_32` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1431` |
| `$BD_NAME_33` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1432` |
| `$BD_NAME_34` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1433` |
| `$BD_NAME_35` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1434` |
| `$BD_NAME_36` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1435` |
| `$BD_NAME_37` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1436` |
| `$BD_NAME_38` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1437` |
| `$BD_NAME_39` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1438` |
| `$BD_NAME_4` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn403` |
| `$BD_NAME_40` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1439` |
| `$BD_NAME_41` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn3100` |
| `$BD_NAME_42` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn3101` |
| `$BD_NAME_43` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn3102` |
| `$BD_NAME_44` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn3103` |
| `$BD_NAME_45` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn3104` |
| `$BD_NAME_46` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn3105` |
| `$BD_NAME_47` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn3106` |
| `$BD_NAME_48` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn3107` |
| `$BD_NAME_49` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn3108` |
| `$BD_NAME_5` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn404` |
| `$BD_NAME_50` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn3109` |
| `$BD_NAME_51` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn439` |
| `$BD_NAME_6` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn405` |
| `$BD_NAME_7` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn406` |
| `$BD_NAME_8` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn407` |
| `$BD_NAME_9` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn408` |
| `$VLAN_BD_1` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1400` |
| `$VLAN_BD_10` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1409` |
| `$VLAN_BD_11` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1430` |
| `$VLAN_BD_12` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1431` |
| `$VLAN_BD_13` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1432` |
| `$VLAN_BD_14` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1433` |
| `$VLAN_BD_15` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1434` |
| `$VLAN_BD_16` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1435` |
| `$VLAN_BD_17` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1436` |
| `$VLAN_BD_18` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1437` |
| `$VLAN_BD_19` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1438` |
| `$VLAN_BD_2` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1401` |
| `$VLAN_BD_20` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1439` |
| `$VLAN_BD_21` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3100` |
| `$VLAN_BD_22` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3101` |
| `$VLAN_BD_23` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3102` |
| `$VLAN_BD_24` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3103` |
| `$VLAN_BD_25` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3104` |
| `$VLAN_BD_26` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3105` |
| `$VLAN_BD_27` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3106` |
| `$VLAN_BD_28` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3107` |
| `$VLAN_BD_29` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3108` |
| `$VLAN_BD_3` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1402` |
| `$VLAN_BD_30` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3109` |
| `$VLAN_BD_31` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3500` |
| `$VLAN_BD_32` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `400` |
| `$VLAN_BD_33` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `401` |
| `$VLAN_BD_34` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `402` |
| `$VLAN_BD_35` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `403` |
| `$VLAN_BD_36` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `404` |
| `$VLAN_BD_37` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `405` |
| `$VLAN_BD_38` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `406` |
| `$VLAN_BD_39` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `407` |
| `$VLAN_BD_4` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1403` |
| `$VLAN_BD_40` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `408` |
| `$VLAN_BD_41` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `409` |
| `$VLAN_BD_42` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `430` |
| `$VLAN_BD_43` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `431` |
| `$VLAN_BD_44` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `432` |
| `$VLAN_BD_45` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `433` |
| `$VLAN_BD_46` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `434` |
| `$VLAN_BD_47` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `435` |
| `$VLAN_BD_48` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `436` |
| `$VLAN_BD_49` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `437` |
| `$VLAN_BD_5` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1404` |
| `$VLAN_BD_50` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `438` |
| `$VLAN_BD_51` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `439` |
| `$VLAN_BD_6` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1405` |
| `$VLAN_BD_7` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1406` |
| `$VLAN_BD_8` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1407` |
| `$VLAN_BD_9` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1408` |
| `$VNI` | VXLAN network identifier (VNI) of a VLAN, bridge domain or EVPN Type 5 routing instance. | `20004` |
| `$VNI_1` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10400` |
| `$VNI_10` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10409` |
| `$VNI_11` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10430` |
| `$VNI_12` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10431` |
| `$VNI_13` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10432` |
| `$VNI_14` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10433` |
| `$VNI_15` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10434` |
| `$VNI_16` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10435` |
| `$VNI_17` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10436` |
| `$VNI_18` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10437` |
| `$VNI_19` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10438` |
| `$VNI_2` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10401` |
| `$VNI_20` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10439` |
| `$VNI_21` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11400` |
| `$VNI_22` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11401` |
| `$VNI_23` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11402` |
| `$VNI_24` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11403` |
| `$VNI_25` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11404` |
| `$VNI_26` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11405` |
| `$VNI_27` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11406` |
| `$VNI_28` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11407` |
| `$VNI_29` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11408` |
| `$VNI_3` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10402` |
| `$VNI_30` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11409` |
| `$VNI_31` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11430` |
| `$VNI_32` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11431` |
| `$VNI_33` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11432` |
| `$VNI_34` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11433` |
| `$VNI_35` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11434` |
| `$VNI_36` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11435` |
| `$VNI_37` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11436` |
| `$VNI_38` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11437` |
| `$VNI_39` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11438` |
| `$VNI_4` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10403` |
| `$VNI_40` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11439` |
| `$VNI_41` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `13100` |
| `$VNI_42` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `13101` |
| `$VNI_43` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `13102` |
| `$VNI_44` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `13103` |
| `$VNI_45` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `13104` |
| `$VNI_46` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `13105` |
| `$VNI_47` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `13106` |
| `$VNI_48` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `13107` |
| `$VNI_49` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `13108` |
| `$VNI_5` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10404` |
| `$VNI_50` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `13109` |
| `$VNI_51` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `35000` |
| `$VNI_6` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10405` |
| `$VNI_7` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10406` |
| `$VNI_8` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10407` |
| `$VNI_9` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10408` |

## VRFs and the external gateway

| Variable | What it is | Example value |
|---|---|---|
| `$AC_IFL` | Full logical attachment-circuit interface identifier, including its unit. | `et-0/0/7.399` |
| `$AC_IFL_1` | Access-facing logical interface listed in a MAC-VRF or VRF (a server-facing port, an ESI-LAG unit, or the attachment toward the external gateway); `_1`, `_2`, … number the instance's interfaces in source order. | `et-0/0/5.0` |
| `$AC_IFL_2` | Access-facing logical interface listed in a MAC-VRF or VRF (a server-facing port, an ESI-LAG unit, or the attachment toward the external gateway); `_1`, `_2`, … number the instance's interfaces in source order. | `ae1.0` |
| `$AC_IFL_3` | Access-facing logical interface listed in a MAC-VRF or VRF (a server-facing port, an ESI-LAG unit, or the attachment toward the external gateway); `_1`, `_2`, … number the instance's interfaces in source order. | `ae1.0` |
| `$ASN_CUSTOMER` | Customer-facing BGP peer autonomous-system number. | `65000` |
| `$ASN_PROVIDER_1` | Provider autonomous-system number as seen from a CE: here a border leaf's AS; `_1`, `_2` number the distinct AS numbers of one group, in neighbor order. | `64708` |
| `$ASN_PROVIDER_2` | Provider autonomous-system number as seen from a CE: here a border leaf's AS; `_1`, `_2` number the distinct AS numbers of one group, in neighbor order. | `64709` |
| `$CE_PEER_V4` | IPv4 address of a VRF eBGP neighbor on the customer or external side. | `10.204.0.1` |
| `$CE_PEER_V6` | IPv6 address of a VRF eBGP neighbor on the customer or external side. | `2001:db8:dc4:10:204::5` |
| `$DHCP_RELAY_GROUP` | **new** Name of a DHCP relay group (`forwarding-options dhcp-relay group`) in a VRF; its interfaces relay DHCP to the server group. | `red` |
| `$INSTANCE_NAME` | Identity stem of a service instance. | `evpn-1` |
| `$IP_PREFIX_EXPORT_POL` | Name of the policy-statement a routing instance exports as EVPN Type 5 IP prefix routes (`ip-prefix-routes export`), as applied and as defined. | `BGP-AOS-Policy-blue` |
| `$LOOPBACK_IFL` | Loopback logical interface (`lo0.<unit>`) listed in a routing instance. | `lo0.5` |
| `$PE_LOCAL_V4` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. | `10.204.0.0` |
| `$PE_LOCAL_V6` | Local IPv6 address of the PE side of a CE eBGP session (`local-address`). | `2001:db8:dc4:10:204::4` |
| `$PE_PEER_V4_1` | IPv4 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.204.0.4` |
| `$PE_PEER_V4_10` | IPv4 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.204.0.18` |
| `$PE_PEER_V4_2` | IPv4 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.204.0.8` |
| `$PE_PEER_V4_3` | IPv4 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.204.0.0` |
| `$PE_PEER_V4_4` | IPv4 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.204.0.12` |
| `$PE_PEER_V4_5` | IPv4 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.204.0.16` |
| `$PE_PEER_V4_6` | IPv4 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.204.0.6` |
| `$PE_PEER_V4_7` | IPv4 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.204.0.10` |
| `$PE_PEER_V4_8` | IPv4 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.204.0.2` |
| `$PE_PEER_V4_9` | IPv4 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.204.0.14` |
| `$PE_PEER_V6_1` | IPv6 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `2001:db8:dc4:10:204::8` |
| `$PE_PEER_V6_10` | IPv6 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `2001:db8:dc4:10:204::e` |
| `$PE_PEER_V6_2` | IPv6 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `2001:db8:dc4:10:204::0` |
| `$PE_PEER_V6_3` | IPv6 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `2001:db8:dc4:10:204::4` |
| `$PE_PEER_V6_4` | IPv6 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `2001:db8:dc4:10:204::10` |
| `$PE_PEER_V6_5` | IPv6 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `2001:db8:dc4:10:204::c` |
| `$PE_PEER_V6_6` | IPv6 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `2001:db8:dc4:10:204::a` |
| `$PE_PEER_V6_7` | IPv6 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `2001:db8:dc4:10:204::2` |
| `$PE_PEER_V6_8` | IPv6 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `2001:db8:dc4:10:204::6` |
| `$PE_PEER_V6_9` | IPv6 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `2001:db8:dc4:10:204::12` |
| `$RD_SEED_AUTO` | Seed for automatic Route Distinguisher generation. | `100.100.100.100` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address with prefix length on an attachment (access-facing) Layer 3 unit. | `10.204.0.0/31` |
| `$AC_ADDR_V6` | IPv6 address with prefix length on an attachment (access-facing) Layer 3 unit. | `2001:db8:dc4:10:204::4/127` |
| `$AC_INTF` | Attachment (access-facing) physical interface. | `et-0/0/8:1` |
| `$AE_BUNDLE` | Aggregated Ethernet interface (`ae<n>`), as configured and as its member ports name it (`802.3ad`). | `ae1` |
| `$AE_DEVICE_COUNT` | Number of aggregated Ethernet devices the chassis creates (`aggregated-devices ethernet device-count`). | `1` |
| `$BREAKOUT_SUB_PORTS` | Number of sub-ports a channelized (breakout) port is split into (`number-of-sub-ports`). | `4` |
| `$CORE_INTF_1` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `xe-0/0/7:0.299` |
| `$CORE_INTF_2` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `xe-0/0/7:1.299` |
| `$CORE_PHYS` | Core- or fabric-facing interface (physical or aggregate) of a point-to-point transport link. | `et-0/0/48` |
| `$CORE_V4_ADDR` | IPv4 address with prefix length on a core- or fabric-facing point-to-point link. | `10.0.1.41/31` |
| `$CORE_V6_ADDR` | IPv6 address with prefix length on a core- or fabric-facing point-to-point link. | `fdf6:ed70:1fac:f2d4::29/127` |
| `$COS_INTF` | Interface that a class-of-service binding applies to (`class-of-service interfaces <name>`). | `et-0/0/2` |
| `$DESCRIPTION` | Free-text `description` of an interface, unit or BGP neighbor. | `to.sys003-001-002` |
| `$DESCRIPTION_1` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_spine003-001-1-evpn-overlay` |
| `$DESCRIPTION_10` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_all_1409` |
| `$DESCRIPTION_11` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_3_1430` |
| `$DESCRIPTION_12` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_3_1431` |
| `$DESCRIPTION_13` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_3_1432` |
| `$DESCRIPTION_14` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_3_1433` |
| `$DESCRIPTION_15` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_3_1434` |
| `$DESCRIPTION_16` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_3_1435` |
| `$DESCRIPTION_17` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_3_1436` |
| `$DESCRIPTION_18` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_3_1437` |
| `$DESCRIPTION_19` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_3_1438` |
| `$DESCRIPTION_2` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_spine003-001-2-evpn-overlay` |
| `$DESCRIPTION_20` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_3_1439` |
| `$DESCRIPTION_21` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `yellow_3100` |
| `$DESCRIPTION_22` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `yellow_3101` |
| `$DESCRIPTION_23` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `yellow_3102` |
| `$DESCRIPTION_24` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `yellow_3103` |
| `$DESCRIPTION_25` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `yellow_3104` |
| `$DESCRIPTION_26` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `yellow_3105` |
| `$DESCRIPTION_27` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `yellow_3106` |
| `$DESCRIPTION_28` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `yellow_3107` |
| `$DESCRIPTION_29` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `yellow_3108` |
| `$DESCRIPTION_3` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_sspine001-1-evpn-overlay` |
| `$DESCRIPTION_30` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `yellow_3109` |
| `$DESCRIPTION_31` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue-SBD` |
| `$DESCRIPTION_32` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_400` |
| `$DESCRIPTION_33` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_401` |
| `$DESCRIPTION_34` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_402` |
| `$DESCRIPTION_35` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_403` |
| `$DESCRIPTION_36` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_404` |
| `$DESCRIPTION_37` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_405` |
| `$DESCRIPTION_38` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_406` |
| `$DESCRIPTION_39` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_407` |
| `$DESCRIPTION_4` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_sspine001-2-evpn-overlay` |
| `$DESCRIPTION_40` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_408` |
| `$DESCRIPTION_41` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_409` |
| `$DESCRIPTION_42` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_3_430` |
| `$DESCRIPTION_43` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_3_431` |
| `$DESCRIPTION_44` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_3_432` |
| `$DESCRIPTION_45` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_3_433` |
| `$DESCRIPTION_46` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_3_434` |
| `$DESCRIPTION_47` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_3_435` |
| `$DESCRIPTION_48` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_3_436` |
| `$DESCRIPTION_49` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_3_437` |
| `$DESCRIPTION_5` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_spine003-001-1-evpn-overlay` |
| `$DESCRIPTION_50` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_3_438` |
| `$DESCRIPTION_51` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_3_439` |
| `$DESCRIPTION_6` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_spine003-001-2-evpn-overlay` |
| `$DESCRIPTION_7` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_all_1406` |
| `$DESCRIPTION_8` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_all_1407` |
| `$DESCRIPTION_9` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_all_1408` |
| `$ESI` | Ethernet segment identifier (10 octets) of a multihomed interface. | `00:02:00:00:00:00:03:00:00:03` |
| `$IFD` | Interface-device identifier, excluding a logical unit. | `et-0/0/8` |
| `$IFL` | Logical interface identifier, including its unit. | `et-0/0/48.0` |
| `$IRB_ADDR` | IPv4 address with prefix length on an IRB unit: the Layer 3 gateway of a VLAN or bridge domain. | `10.0.0.1/24` |
| `$IRB_ADDR_V6` | IPv6 address with prefix length on an IRB unit: the IPv6 gateway of a VLAN. | `2001:db8:dc4:10:00:00::1/96` |
| `$IRB_IFL_1` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1400` |
| `$IRB_IFL_10` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1409` |
| `$IRB_IFL_11` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1430` |
| `$IRB_IFL_12` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1431` |
| `$IRB_IFL_13` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1432` |
| `$IRB_IFL_14` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1433` |
| `$IRB_IFL_15` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1434` |
| `$IRB_IFL_16` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1435` |
| `$IRB_IFL_17` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1436` |
| `$IRB_IFL_18` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1437` |
| `$IRB_IFL_19` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1438` |
| `$IRB_IFL_2` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1401` |
| `$IRB_IFL_20` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1439` |
| `$IRB_IFL_21` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3100` |
| `$IRB_IFL_22` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3101` |
| `$IRB_IFL_23` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3102` |
| `$IRB_IFL_24` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3103` |
| `$IRB_IFL_25` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3104` |
| `$IRB_IFL_26` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3105` |
| `$IRB_IFL_27` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3106` |
| `$IRB_IFL_28` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3107` |
| `$IRB_IFL_29` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3108` |
| `$IRB_IFL_3` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1402` |
| `$IRB_IFL_30` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3109` |
| `$IRB_IFL_31` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3500` |
| `$IRB_IFL_32` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.400` |
| `$IRB_IFL_33` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.401` |
| `$IRB_IFL_34` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.402` |
| `$IRB_IFL_35` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.403` |
| `$IRB_IFL_36` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.404` |
| `$IRB_IFL_37` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.405` |
| `$IRB_IFL_38` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.406` |
| `$IRB_IFL_39` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.407` |
| `$IRB_IFL_4` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1403` |
| `$IRB_IFL_40` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.408` |
| `$IRB_IFL_41` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.409` |
| `$IRB_IFL_42` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.430` |
| `$IRB_IFL_43` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.431` |
| `$IRB_IFL_44` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.432` |
| `$IRB_IFL_45` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.433` |
| `$IRB_IFL_46` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.434` |
| `$IRB_IFL_47` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.435` |
| `$IRB_IFL_48` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.436` |
| `$IRB_IFL_49` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.437` |
| `$IRB_IFL_5` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1404` |
| `$IRB_IFL_50` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.438` |
| `$IRB_IFL_51` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.439` |
| `$IRB_IFL_6` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1405` |
| `$IRB_IFL_7` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1406` |
| `$IRB_IFL_8` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1407` |
| `$IRB_IFL_9` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1408` |
| `$IRB_MAC` | MAC address configured on an IRB unit (`mac`). | `00:1c:73:00:00:01` |
| `$IRB_UNIT` | IRB unit number. | `400` |
| `$LACP_SYS_ID` | LACP system ID of an aggregated Ethernet bundle, shared by the multihoming peers of an ESI-LAG. | `02:00:00:00:00:03` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `2` |

## Fabric underlay and overlay

| Variable | What it is | Example value |
|---|---|---|
| `$ASN_FABRIC_PEER` | Autonomous-system number of a fabric eBGP neighbor (another leaf or spine of an IP fabric). | `64703` |
| `$ASN_FABRIC_PEER_1` | Autonomous-system number of a fabric eBGP neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `64706` |
| `$ASN_FABRIC_PEER_2` | Autonomous-system number of a fabric eBGP neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `64707` |
| `$ASN_FABRIC_PEER_3` | Autonomous-system number of a fabric eBGP neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `64700` |
| `$BGP_GROUP` | Name of a BGP peer group. | `l3clos-l-evpn` |
| `$OVERLAY_PEER_V4_1` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `192.168.252.6` |
| `$OVERLAY_PEER_V4_2` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `192.168.252.7` |
| `$OVERLAY_PEER_V4_3` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `192.168.252.0` |
| `$OVERLAY_PEER_V4_4` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `192.168.252.1` |
| `$OVERLAY_PEER_V4_5` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `192.168.252.6` |
| `$OVERLAY_PEER_V4_6` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `192.168.252.7` |
| `$UNDERLAY_LOCAL_V4_1` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.1.41` |
| `$UNDERLAY_LOCAL_V4_2` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.1.45` |
| `$UNDERLAY_LOCAL_V4_3` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.1.8` |
| `$UNDERLAY_LOCAL_V4_4` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.1.10` |
| `$UNDERLAY_LOCAL_V4_5` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.1.17` |
| `$UNDERLAY_LOCAL_V4_6` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.1.21` |
| `$UNDERLAY_LOCAL_V6_1` | **new** Local IPv6 address (`local-address`) of the eBGP underlay session with the IPv6 neighbor of the same number. | `fdf6:ed70:1fac:f2d4::29` |
| `$UNDERLAY_LOCAL_V6_2` | Local IPv6 address (`local-address`) of the eBGP underlay session with the IPv6 neighbor of the same number. | `fdf6:ed70:1fac:f2d4::2d` |
| `$UNDERLAY_LOCAL_V6_3` | Local IPv6 address (`local-address`) of the eBGP underlay session with the IPv6 neighbor of the same number. | `fdf6:ed70:1fac:f2d4::8` |
| `$UNDERLAY_LOCAL_V6_4` | Local IPv6 address (`local-address`) of the eBGP underlay session with the IPv6 neighbor of the same number. | `fdf6:ed70:1fac:f2d4::a` |
| `$UNDERLAY_LOCAL_V6_5` | Local IPv6 address (`local-address`) of the eBGP underlay session with the IPv6 neighbor of the same number. | `fdf6:ed70:1fac:f2d4::11` |
| `$UNDERLAY_LOCAL_V6_6` | Local IPv6 address (`local-address`) of the eBGP underlay session with the IPv6 neighbor of the same number. | `fdf6:ed70:1fac:f2d4::15` |
| `$UNDERLAY_PEER_V4_1` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a fabric /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.40` |
| `$UNDERLAY_PEER_V4_2` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a fabric /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.44` |
| `$UNDERLAY_PEER_V4_3` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a fabric /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.9` |
| `$UNDERLAY_PEER_V4_4` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a fabric /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.11` |
| `$UNDERLAY_PEER_V4_5` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a fabric /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.16` |
| `$UNDERLAY_PEER_V4_6` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a fabric /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.20` |
| `$UNDERLAY_PEER_V6_1` | **new** IPv6 address of a directly connected eBGP underlay neighbor (the far end of a fabric link); `_1`, `_2`, … number the IPv6 neighbors of one group, in neighbor order. IPv6 member of the `$UNDERLAY_PEER_V4` family. | `fdf6:ed70:1fac:f2d4::28` |
| `$UNDERLAY_PEER_V6_2` | IPv6 address of a directly connected eBGP underlay neighbor (the far end of a fabric link); `_1`, `_2`, … number the IPv6 neighbors of one group, in neighbor order. IPv6 member of the `$UNDERLAY_PEER_V4` family. | `fdf6:ed70:1fac:f2d4::2c` |
| `$UNDERLAY_PEER_V6_3` | IPv6 address of a directly connected eBGP underlay neighbor (the far end of a fabric link); `_1`, `_2`, … number the IPv6 neighbors of one group, in neighbor order. IPv6 member of the `$UNDERLAY_PEER_V4` family. | `fdf6:ed70:1fac:f2d4::9` |
| `$UNDERLAY_PEER_V6_4` | IPv6 address of a directly connected eBGP underlay neighbor (the far end of a fabric link); `_1`, `_2`, … number the IPv6 neighbors of one group, in neighbor order. IPv6 member of the `$UNDERLAY_PEER_V4` family. | `fdf6:ed70:1fac:f2d4::b` |
| `$UNDERLAY_PEER_V6_5` | IPv6 address of a directly connected eBGP underlay neighbor (the far end of a fabric link); `_1`, `_2`, … number the IPv6 neighbors of one group, in neighbor order. IPv6 member of the `$UNDERLAY_PEER_V4` family. | `fdf6:ed70:1fac:f2d4::10` |
| `$UNDERLAY_PEER_V6_6` | IPv6 address of a directly connected eBGP underlay neighbor (the far end of a fabric link); `_1`, `_2`, … number the IPv6 neighbors of one group, in neighbor order. IPv6 member of the `$UNDERLAY_PEER_V4` family. | `fdf6:ed70:1fac:f2d4::14` |

## Policy

| Variable | What it is | Example value |
|---|---|---|
| `$BGP_EXPORT_POL` | Policy-statement name applied as a BGP `export`. | `EVPN_EXPORT` |
| `$BGP_EXPORT_POL_1` | Policy-statement name applied as a BGP `export`; `_1`, `_2` number the members of a policy chain (`export ( A && B )`), in evaluation order. | `LEAF_TO_SPINE_EVPN_OUT` |
| `$BGP_EXPORT_POL_2` | Policy-statement name applied as a BGP `export`; `_1`, `_2` number the members of a policy chain (`export ( A && B )`), in evaluation order. | `EVPN_EXPORT` |
| `$BGP_EXPORT_POL_3` | Policy-statement name applied as a BGP `export`; `_1`, `_2` number the members of a policy chain (`export ( A && B )`), in evaluation order. | `SPINE_TO_SUPERSPINE_FABRIC_OUT` |
| `$BGP_IMPORT_POL` | Policy-statement name applied as a BGP `import`, as applied and as defined. | `RoutesFromExt-blue-external_router` |
| `$COMMUNITY_ADMIN_1` | Administrator field of a member of a two-member community; `_1`, `_2` number the members in order. | `13` |
| `$COMMUNITY_ADMIN_2` | Administrator field of a member of a two-member community; `_1`, `_2` number the members in order. | `21001` |
| `$COMMUNITY_ASSIGNED_1` | Assigned-number field of the first member of a two-member community. | `20007` |
| `$COMMUNITY_NAME` | Name of a BGP community that a policy adds to routes, where the name differs between instances. | `DEFAULT_DIRECT_V4` |
| `$COMMUNITY_NAME_1` | Name of a BGP community that a policy adds to routes (`community add`); `_1`, `_2` number the communities of one policy, in term order. | `BLUE_COMMUNITY_V4` |
| `$COMMUNITY_NAME_2` | Name of a BGP community that a policy adds to routes (`community add`); `_1`, `_2` number the communities of one policy, in term order. | `BLUE_COMMUNITY_V6` |
| `$PIM_RP_V4` | IPv4 address of a PIM rendezvous point. | `100.100.100.100` |
| `$POLICY_NAME` | Name of a routing policy-statement where no role-specific name (BGP export or import, VRF import or export, load balancing) applies. | `AllPodNetworks-blue` |
| `$PPLB_NAME` | Name of the per-packet load-balancing policy exported to the forwarding table. | `PFE-LB` |
| `$PREFIX_1` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `10.0.0.0/19` |
| `$PREFIX_2` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `10.0.32.0/21` |
| `$PREFIX_3` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `192.168.14.0/31` |
| `$PREFIX_4` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `192.168.14.16/30` |
| `$PREFIX_5` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `fdf6:ed70:1fac:f2d4::200c/127` |
| `$ROUTE_FILTER_LIST` | Name of a route-filter list, as defined and as a policy references it. | `RoutesToExt-yellow-external_router` |
| `$ROUTE_FILTER_LIST_1` | Name of a route-filter list, as defined and as a policy references it. Numbered `_1`, `_2`, … in source order. | `RoutesFromExt-blue-external_router` |
| `$ROUTE_FILTER_LIST_2` | Name of a route-filter list, as defined and as a policy references it. Numbered `_1`, `_2`, … in source order. | `RoutesFromExtV6-blue-external_router` |
| `$TERM_NAME` | Name of a policy-statement term. | `EVPN_EXPORT-4095` |
| `$TERM_NAME_1` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `ssh` |
| `$TERM_NAME_10` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `ospf` |
| `$TERM_NAME_11` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `discard-rest` |
| `$TERM_NAME_2` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `icmp` |
| `$TERM_NAME_3` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `bgp` |
| `$TERM_NAME_4` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `dns` |
| `$TERM_NAME_5` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `ntp` |
| `$TERM_NAME_6` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `dhcp` |
| `$TERM_NAME_7` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `netconf` |
| `$TERM_NAME_8` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `bfd` |
| `$TERM_NAME_9` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `snmp` |
| `$VGA` | Virtual gateway address of an IRB unit (`virtual-gateway-address`), shared by the leaves that serve the VLAN. | `10.200.0.1` |
| `$VLAN` | A single VLAN identifier. | `399` |
