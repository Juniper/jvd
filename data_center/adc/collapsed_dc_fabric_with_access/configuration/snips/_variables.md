# Snippet variable glossary

All `.conf` files under `evo/` are templates: identifiers that vary between deployments are written
as `$VAR`. Render a snippet by substituting each placeholder with your deployment's value. The placeholders each
snippet uses are listed in its `Variables:` header and in the glossary below. Variable names and meanings follow
the shared JVD snippet vocabulary. Numbered variables (`_1`, `_2`, …) form an ordered set; the numbers carry no
other meaning.

Values left literal on purpose: the community `FABRIC_COMMUNITIES`, which a policy references by name; the MTUs,
the BFD timers, the LACP mode and timers, the EVPN encapsulation and multicast mode, the route-target ID, the gRPC
routing instance `mgmt_junos`, `unit 0`, and the loopback `lo0`.

## System

| Variable | What it is | Example value |
|---|---|---|
| `$AE_DEVICE_COUNT` | Number of aggregated Ethernet devices the chassis creates (`aggregated-devices ethernet device-count`). | `3` |
| `$HOST_NAME` | System host name. | `dc3-rack-001-access1` |
| `$LOCAL_CERT` | Name of the local certificate (`security certificates local`) the gRPC SSL service presents (`local-certificate`). | `aos_grpc` |
| `$LOCAL_CERT_KEY` | PEM private key and certificate of the local certificate; secret, supplied by the operator (the published value is sanitized). | `"<LOCAL_CERT_KEY>"` |

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number (`routing-options autonomous-system`). | `64802` |
| `$LOOPBACK_V4` | Loopback IPv4 address of the local device: the overlay session `local-address`, and the administrator field of a VRF route distinguisher. | `192.168.253.2` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on a loopback unit (unit 0, or a tenant VRF's loopback unit). | `192.168.253.2/32` |
| `$ROUTER_ID` | Router identifier in IPv4 dotted-decimal form. | `192.168.253.2` |

## Routing instances

| Variable | What it is | Example value |
|---|---|---|
| `$AC_IFL` | Access-facing logical interface (`<interface>.<unit>`): here a GPU server link with IPv6 router advertisements. | `xe-0/0/10.199` |
| `$AC_IFL_1` | Access-facing logical interface listed in a tenant VRF (a GPU server or tester link); `_1`, `_2`, … number the VRF's interfaces in source order. | `ae1.0` |
| `$AC_IFL_2` | Access-facing logical interface listed in a tenant VRF (a GPU server or tester link); `_1`, `_2`, … number the VRF's interfaces in source order. | `ae2.0` |
| `$AC_IFL_3` | Access-facing logical interface listed in a tenant VRF (a GPU server or tester link); `_1`, `_2`, … number the VRF's interfaces in source order. | `ae2.0` |
| `$ASN_CUSTOMER` | Autonomous-system number of a VRF's eBGP neighbor (the external router). | `65000` |
| `$BD_NAME_1` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1000` |
| `$BD_NAME_10` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1009` |
| `$BD_NAME_11` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1400` |
| `$BD_NAME_12` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1401` |
| `$BD_NAME_13` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1402` |
| `$BD_NAME_14` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1403` |
| `$BD_NAME_15` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1404` |
| `$BD_NAME_16` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1405` |
| `$BD_NAME_17` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1406` |
| `$BD_NAME_18` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1407` |
| `$BD_NAME_19` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1408` |
| `$BD_NAME_2` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1001` |
| `$BD_NAME_20` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1409` |
| `$BD_NAME_21` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2000` |
| `$BD_NAME_22` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2001` |
| `$BD_NAME_23` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2002` |
| `$BD_NAME_24` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2003` |
| `$BD_NAME_25` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2004` |
| `$BD_NAME_26` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2005` |
| `$BD_NAME_27` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2006` |
| `$BD_NAME_28` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2007` |
| `$BD_NAME_29` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2008` |
| `$BD_NAME_3` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1002` |
| `$BD_NAME_30` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn2009` |
| `$BD_NAME_31` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn400` |
| `$BD_NAME_32` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn401` |
| `$BD_NAME_33` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn402` |
| `$BD_NAME_34` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn403` |
| `$BD_NAME_35` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn404` |
| `$BD_NAME_36` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn405` |
| `$BD_NAME_37` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn406` |
| `$BD_NAME_38` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn407` |
| `$BD_NAME_39` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn408` |
| `$BD_NAME_4` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1003` |
| `$BD_NAME_40` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn409` |
| `$BD_NAME_5` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1004` |
| `$BD_NAME_6` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1005` |
| `$BD_NAME_7` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1006` |
| `$BD_NAME_8` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1007` |
| `$BD_NAME_9` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1008` |
| `$CE_PEER_V4` | IPv4 address of a VRF's eBGP neighbor (the external router). | `10.200.2.1` |
| `$INSTANCE_NAME` | Name of a tenant routing instance (VRF); also names its IPv6 routing table (`<instance>.inet6.0`). | `evpn-1` |
| `$IP_PREFIX_EXPORT_POL` | Policy-statement name exported as EVPN Type 5 IP prefix routes from a tenant VRF (in a policy form, the policy's own name). | `BGP-AOS-Policy-red` |
| `$IRB_IFL_1` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1000` |
| `$IRB_IFL_10` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1009` |
| `$IRB_IFL_11` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1400` |
| `$IRB_IFL_12` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1401` |
| `$IRB_IFL_13` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1402` |
| `$IRB_IFL_14` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1403` |
| `$IRB_IFL_15` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1404` |
| `$IRB_IFL_16` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1405` |
| `$IRB_IFL_17` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1406` |
| `$IRB_IFL_18` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1407` |
| `$IRB_IFL_19` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1408` |
| `$IRB_IFL_2` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1001` |
| `$IRB_IFL_20` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1409` |
| `$IRB_IFL_21` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2000` |
| `$IRB_IFL_22` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2001` |
| `$IRB_IFL_23` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2002` |
| `$IRB_IFL_24` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2003` |
| `$IRB_IFL_25` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2004` |
| `$IRB_IFL_26` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2005` |
| `$IRB_IFL_27` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2006` |
| `$IRB_IFL_28` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2007` |
| `$IRB_IFL_29` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2008` |
| `$IRB_IFL_3` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1002` |
| `$IRB_IFL_30` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.2009` |
| `$IRB_IFL_31` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.400` |
| `$IRB_IFL_32` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.401` |
| `$IRB_IFL_33` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.402` |
| `$IRB_IFL_34` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.403` |
| `$IRB_IFL_35` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.404` |
| `$IRB_IFL_36` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.405` |
| `$IRB_IFL_37` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.406` |
| `$IRB_IFL_38` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.407` |
| `$IRB_IFL_39` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.408` |
| `$IRB_IFL_4` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1003` |
| `$IRB_IFL_40` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.409` |
| `$IRB_IFL_5` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1004` |
| `$IRB_IFL_6` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1005` |
| `$IRB_IFL_7` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1006` |
| `$IRB_IFL_8` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1007` |
| `$IRB_IFL_9` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1008` |
| `$LOOPBACK_IFL` | Loopback logical interface (`lo0.<unit>`) listed in a tenant VRF. | `lo0.2` |
| `$PE_LOCAL_V4` | Local IPv4 address (`local-address`) of a VRF's eBGP session toward the external router. | `10.200.2.0` |
| `$RD_SUB_ASSIGNED` | Assigned-number field of a VRF route distinguisher (`<loopback>:<number>`). | `3100` |
| `$RT_AS` | AS field of a VRF route target (`target:<AS>:1`). | `13100` |
| `$VLAN_BD_1` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1000` |
| `$VLAN_BD_10` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1009` |
| `$VLAN_BD_11` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1400` |
| `$VLAN_BD_12` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1401` |
| `$VLAN_BD_13` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1402` |
| `$VLAN_BD_14` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1403` |
| `$VLAN_BD_15` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1404` |
| `$VLAN_BD_16` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1405` |
| `$VLAN_BD_17` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1406` |
| `$VLAN_BD_18` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1407` |
| `$VLAN_BD_19` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1408` |
| `$VLAN_BD_2` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1001` |
| `$VLAN_BD_20` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1409` |
| `$VLAN_BD_21` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2000` |
| `$VLAN_BD_22` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2001` |
| `$VLAN_BD_23` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2002` |
| `$VLAN_BD_24` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2003` |
| `$VLAN_BD_25` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2004` |
| `$VLAN_BD_26` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2005` |
| `$VLAN_BD_27` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2006` |
| `$VLAN_BD_28` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2007` |
| `$VLAN_BD_29` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2008` |
| `$VLAN_BD_3` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1002` |
| `$VLAN_BD_30` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `2009` |
| `$VLAN_BD_31` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `400` |
| `$VLAN_BD_32` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `401` |
| `$VLAN_BD_33` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `402` |
| `$VLAN_BD_34` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `403` |
| `$VLAN_BD_35` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `404` |
| `$VLAN_BD_36` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `405` |
| `$VLAN_BD_37` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `406` |
| `$VLAN_BD_38` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `407` |
| `$VLAN_BD_39` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `408` |
| `$VLAN_BD_4` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1003` |
| `$VLAN_BD_40` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `409` |
| `$VLAN_BD_5` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1004` |
| `$VLAN_BD_6` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1005` |
| `$VLAN_BD_7` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1006` |
| `$VLAN_BD_8` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1007` |
| `$VLAN_BD_9` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1008` |
| `$VNI` | VXLAN network identifier of a tenant VRF's EVPN Type 5 IP prefix routes. | `13100` |
| `$VNI_1` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10400` |
| `$VNI_10` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10409` |
| `$VNI_11` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11000` |
| `$VNI_12` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11001` |
| `$VNI_13` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11002` |
| `$VNI_14` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11003` |
| `$VNI_15` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11004` |
| `$VNI_16` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11005` |
| `$VNI_17` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11006` |
| `$VNI_18` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11007` |
| `$VNI_19` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11008` |
| `$VNI_2` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10401` |
| `$VNI_20` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11009` |
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
| `$VNI_31` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12000` |
| `$VNI_32` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12001` |
| `$VNI_33` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12002` |
| `$VNI_34` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12003` |
| `$VNI_35` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12004` |
| `$VNI_36` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12005` |
| `$VNI_37` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12006` |
| `$VNI_38` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12007` |
| `$VNI_39` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12008` |
| `$VNI_4` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10403` |
| `$VNI_40` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `12009` |
| `$VNI_5` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10404` |
| `$VNI_6` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10405` |
| `$VNI_7` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10406` |
| `$VNI_8` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10407` |
| `$VNI_9` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10408` |

## ESI-LAG access

| Variable | What it is | Example value |
|---|---|---|
| `$AE_BUNDLE` | Aggregated Ethernet interface (`ae<n>`) of an ESI-LAG access bundle; also the `802.3ad` bundle of its member ports. | `ae1` |
| `$ESI` | Ethernet segment identifier of an ESI-LAG bundle (10 octets). | `00:02:00:00:00:00:02:00:00:02` |
| `$LACP_SYS_ID` | LACP system ID of an ESI-LAG bundle, the same on both leaves. | `02:00:00:00:00:02` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address with prefix length on an access-facing Layer 3 unit. | `10.200.2.0/31` |
| `$AC_INTF` | Access-facing physical interface (a GPU server or traffic-tester link). | `xe-0/0/10` |
| `$CORE_PHYS` | Fabric-facing physical interface of a point-to-point leaf-spine link. | `ae3` |
| `$CORE_V4_ADDR` | IPv4 address with prefix length (/31) on a leaf-spine fabric link. | `10.0.3.5/31` |
| `$DESCRIPTION` | Free-text interface or BGP neighbor `description`. | `facing_dc3-rack-001-leaf-pair1` |
| `$DESCRIPTION_1` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_1_1000` |
| `$DESCRIPTION_10` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_1_1009` |
| `$DESCRIPTION_11` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_all_1400` |
| `$DESCRIPTION_12` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_all_1401` |
| `$DESCRIPTION_13` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_all_1402` |
| `$DESCRIPTION_14` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_all_1403` |
| `$DESCRIPTION_15` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_all_1404` |
| `$DESCRIPTION_16` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_all_1405` |
| `$DESCRIPTION_17` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_all_1406` |
| `$DESCRIPTION_18` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_all_1407` |
| `$DESCRIPTION_19` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_all_1408` |
| `$DESCRIPTION_2` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_1_1001` |
| `$DESCRIPTION_20` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_all_1409` |
| `$DESCRIPTION_21` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_1_2000` |
| `$DESCRIPTION_22` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_1_2001` |
| `$DESCRIPTION_23` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_1_2002` |
| `$DESCRIPTION_24` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_1_2003` |
| `$DESCRIPTION_25` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_1_2004` |
| `$DESCRIPTION_26` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_1_2005` |
| `$DESCRIPTION_27` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_1_2006` |
| `$DESCRIPTION_28` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_1_2007` |
| `$DESCRIPTION_29` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_1_2008` |
| `$DESCRIPTION_3` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_1_1002` |
| `$DESCRIPTION_30` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_1_2009` |
| `$DESCRIPTION_31` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_400` |
| `$DESCRIPTION_32` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_401` |
| `$DESCRIPTION_33` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_402` |
| `$DESCRIPTION_34` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_403` |
| `$DESCRIPTION_35` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_404` |
| `$DESCRIPTION_36` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_405` |
| `$DESCRIPTION_37` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_406` |
| `$DESCRIPTION_38` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_407` |
| `$DESCRIPTION_39` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_408` |
| `$DESCRIPTION_4` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_1_1003` |
| `$DESCRIPTION_40` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_409` |
| `$DESCRIPTION_5` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_1_1004` |
| `$DESCRIPTION_6` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_1_1005` |
| `$DESCRIPTION_7` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_1_1006` |
| `$DESCRIPTION_8` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_1_1007` |
| `$DESCRIPTION_9` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_1_1008` |
| `$IFD` | Physical interface name (a breakout port or a port that carries no traffic in the design). | `mge-0/0/46` |
| `$IRB_ADDR` | IPv4 gateway address with prefix length on an IRB unit. | `10.0.0.1/24` |
| `$IRB_MAC` | MAC address of an IRB unit. | `00:1c:73:00:00:01` |
| `$IRB_UNIT` | IRB unit number. | `400` |
| `$UNIT` | Logical unit number. | `0` |

## Fabric underlay and overlay

| Variable | What it is | Example value |
|---|---|---|
| `$ASN_FABRIC_PEER` | Autonomous-system number of the fabric eBGP neighbor (the other leaf). | `64803` |
| `$BGP_GROUP` | Name of an eBGP group (the underlay group, the EVPN overlay group, or a VRF's group toward the external router). | `l3clos-a-evpn` |
| `$OVERLAY_PEER_V4` | Loopback IPv4 address of the eBGP EVPN overlay neighbor (the other leaf). | `192.168.253.3` |
| `$UNDERLAY_LOCAL_V4` | Local IPv4 address (`local-address`) of an eBGP underlay session. | `10.0.3.5` |
| `$UNDERLAY_LOCAL_V4_1` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.3.1` |
| `$UNDERLAY_LOCAL_V4_2` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.3.3` |
| `$UNDERLAY_PEER_V4` | IPv4 address of a directly connected eBGP underlay neighbor in an IP fabric (the far end of a point-to-point link). | `10.0.3.4` |
| `$UNDERLAY_PEER_V4_1` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.3.0` |
| `$UNDERLAY_PEER_V4_2` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.3.2` |

## Policy

| Variable | What it is | Example value |
|---|---|---|
| `$BGP_EXPORT_POL` | Policy-statement name applied as a BGP `export` (in a policy form, the policy's own name). | `EVPN_EXPORT` |
| `$BGP_IMPORT_POL` | Policy-statement name applied as a BGP `import` (in a policy form, the policy's own name). | `RoutesFromExt-blue-external_router` |
| `$COMMUNITY_ADMIN_1` | Administrator field of a member of a two-member community; `_1`, `_2` number the members in order. | `1` |
| `$COMMUNITY_ADMIN_2` | Administrator field of a member of a two-member community; `_1`, `_2` number the members in order. | `21001` |
| `$COMMUNITY_ASSIGNED_1` | Assigned-number field of the first member of a two-member community. | `20007` |
| `$COMMUNITY_NAME` | Name of a BGP community: in a community form, its own name; in a policy, the community it adds (`community add`). | `DEFAULT_DIRECT_V4` |
| `$POLICY_NAME` | Name of a routing policy referenced by `from policy` in another policy (here the direct-route policies). | `AllPodNetworks` |
| `$PPLB_NAME` | Name of the per-packet load-balancing policy that the forwarding table exports. | `PFE-LB` |
| `$PREFIX_1` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `10.0.0.0/21` |
| `$PREFIX_2` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `10.0.8.0/23` |
| `$PREFIX_3` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `10.3.0.0/21` |
| `$PREFIX_4` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `10.3.8.0/23` |
| `$PREFIX_5` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `192.168.13.1/32` |
| `$PREFIX_6` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `192.168.13.3/32` |
| `$ROUTE_FILTER_LIST` | Name of a route-filter list, as defined and as a policy references it. | `RoutesFromExt-blue-external_router` |
| `$TERM_NAME` | Name of the single term of a policy-statement. | `EVPN_EXPORT-4095` |
| `$TERM_NAME_1` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `AllPodNetworks-10` |
| `$TERM_NAME_2` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `AllPodNetworks-100` |
| `$TERM_NAME_3` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `BGP-AOS-Policy-blue-100` |
| `$VLAN` | VLAN identifier: here the native VLAN of an access trunk (`native-vlan-id`). | `199` |
