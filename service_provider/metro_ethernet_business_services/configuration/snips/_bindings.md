# Snippet instance counts and bindings

Every `.conf` under `junos/` and `evo/` is a template. This file records,
for each snippet and each validated device, **how many instances of that
snippet the device carries** and **what values each instance binds** to
the snippet's variables.

An **instance** is one occurrence in the device configuration that the
snippet body reproduces exactly. An instance is identified by the
configuration it occupies, not by its variable values: two instances that
happen to bind the same values are still two instances, and a snippet with
no variables is counted the same way as any other.

A device appears here if and only if it appears in that snippet's
`Seen on:` header. Devices carrying no instance are not listed; their
count is zero.

## Equivalent bindings

Some snippets select several interchangeable sibling objects through
positional variables — four attachment-circuit units as `$UNIT_A`…`$UNIT_D`,
two route reflectors as `$RR1_V4` and `$RR2_V4`. The configuration does not
say which sibling is which, so one instance can be read under several
equally valid bindings.

Each instance therefore records one **representative** binding and how many
equally valid bindings it stands for. The representative is chosen
deterministically (the lexically smallest) and is **not** a claim that the
source distinguishes that ordering. `equivalentBindings: 1` is the ordinary
unambiguous case.

Ambiguity never inflates a count: an instance with 24 equivalent bindings
still counts as one instance.

The machine-readable form is `_bindings.json`; the tables below are a
reading aid generated from it.

| | |
|---|---|
| Snippets | 292 |
| Devices | 20 |
| Snippet/device pairs with at least one instance | 1886 |
| Instances counted | 237,080 |
| Valid bindings those instances stand for | 344,803 |
| Snippets with an ambiguous instance | 32 |

## Instances per snippet

| Snippet | Devices | Instances | Variables |
|---|---:|---:|---|
| `evo/class-of-service/classifiers/cl-6class.conf` | 20 | 20 | _none_ |
| `evo/class-of-service/forwarding-classes/fc-6queue-model.conf` | 20 | 20 | _none_ |
| `evo/class-of-service/interfaces/ifd-scheduler-map.conf` | 20 | 110 | `$COS_INTF` |
| `evo/class-of-service/interfaces/ifl-dscp-classifier-rewrite.conf` | 5 | 1,799 | `$COS_INTF`, `$UNIT` |
| `evo/class-of-service/interfaces/ifl-exp-classifier-rewrite.conf` | 20 | 98 | `$COS_INTF`, `$UNIT` |
| `evo/class-of-service/interfaces/ifl-forwarding-class-ieee8021p-rewrite.conf` | 8 | 6,968 | `$COS_INTF`, `$FORWARDING_CLASS`, `$UNIT` |
| `evo/class-of-service/interfaces/ifl-ieee8021p-classifier-rewrite.conf` | 11 | 13,881 | `$COS_INTF`, `$UNIT` |
| `evo/class-of-service/interfaces/ifl-ieee8021p-classifier.conf` | 1 | 100 | `$COS_INTF`, `$UNIT` |
| `evo/class-of-service/rewrite-rules/rr-6class-marking.conf` | 20 | 20 | _none_ |
| `evo/class-of-service/scheduler-maps/sm-6class-mapping.conf` | 20 | 20 | _none_ |
| `evo/class-of-service/schedulers/sc-2-priority-model.conf` | 11 | 11 | _none_ |
| `evo/firewall/policers.conf` | 10 | 10 | _none_ |
| `evo/groups/gr-bgp-bcp-an3.conf` | 1 | 1 | _none_ |
| `evo/groups/gr-bgp-bcp.conf` | 19 | 19 | _none_ |
| `evo/groups/gr-core-intf.conf` | 20 | 20 | _none_ |
| `evo/groups/gr-edge-intf-mh.conf` | 9 | 9 | _none_ |
| `evo/groups/gr-edge-intf.conf` | 11 | 11 | _none_ |
| `evo/groups/gr-fatpw-label.conf` | 1 | 1 | _none_ |
| `evo/groups/gr-fatpw-lb.conf` | 10 | 10 | _none_ |
| `evo/groups/gr-isis-bcp.conf` | 15 | 15 | _none_ |
| `evo/groups/gr-isis-bfd.conf` | 1 | 1 | _none_ |
| `evo/groups/gr-l2ckt-hs.conf` | 3 | 3 | _none_ |
| `evo/groups/gr-l3vpn.conf` | 7 | 7 | _none_ |
| `evo/groups/gr-lag-member.conf` | 18 | 18 | _none_ |
| `evo/interfaces/core-isis-mpls.conf` | 1 | 2 | `$CORE_DESC`, `$CORE_PHYS`, `$CORE_V4_ADDR`, `$CORE_V6_ADDR`, `$ISIS_NET`, `$LO0_DESC`, `$LOOPBACK_V4_PFX`, `$LOOPBACK_V6_PFX` |
| `evo/interfaces/ifd-ae-lacp-fast.conf` | 4 | 6 | `$IFD`, `$LACP_SYS_ID` |
| `evo/interfaces/ifd-ae-lacp.conf` | 4 | 4 | `$IFD`, `$LACP_SYS_ID` |
| `evo/interfaces/ifl-irb-inet.conf` | 3 | 201 | `$IRB_ADDR`, `$UNIT` |
| `evo/interfaces/ifl-irb-virtual-gateway.conf` | 2 | 150 | `$IRB_ADDR`, `$UNIT`, `$VGA`, `$VG_MAC` |
| `evo/interfaces/ifl-vlan-bridge-esi.conf` | 9 | 1,963 | `$ESI`, `$IFD`, `$UNIT`, `$VLAN` |
| `evo/interfaces/ifl-vlan-bridge-vlan-list-esi.conf` | 2 | 62 | `$ESI`, `$IFD`, `$UNIT`, `$VLAN_LIST` |
| `evo/interfaces/ifl-vlan-bridge-vlan-map.conf` | 4 | 1,000 | `$IFD`, `$INPUT_VID`, `$UNIT`, `$VLAN` |
| `evo/interfaces/ifl-vlan-ccc-dual-tag-esi.conf` | 4 | 200 | `$ESI`, `$IFD`, `$UNIT`, `$VLAN_INNER`, `$VLAN_OUTER` |
| `evo/interfaces/ifl-vlan-ccc-esi.conf` | 3 | 3 | `$ESI`, `$IFD`, `$UNIT`, `$VLAN` |
| `evo/interfaces/ifl-vlan-ccc-vlan-map-esi.conf` | 7 | 4,200 | `$ESI`, `$IFD`, `$INPUT_VID`, `$UNIT`, `$VLAN` |
| `evo/interfaces/ifl-vlan-ccc-vlan-map-filter-ccc.conf` | 3 | 3,000 | `$IFD`, `$INPUT_VID`, `$UNIT`, `$VLAN` |
| `evo/interfaces/ifl-vlan-ccc-vlan-map-filter.conf` | 3 | 800 | `$IFD`, `$INPUT_VID`, `$UNIT`, `$VLAN` |
| `evo/interfaces/ifl-vlan-ccc-vlan-map-list-tpid.conf` | 1 | 20 | `$IFD`, `$INPUT_VID`, `$UNIT`, `$VLAN_LIST` |
| `evo/interfaces/ifl-vlan-ccc-vlan-map-list.conf` | 1 | 2 | `$IFD`, `$INPUT_VID`, `$UNIT`, `$VLAN_LIST` |
| `evo/interfaces/ifl-vlan-ccc-vlan-map.conf` | 1 | 1,000 | `$IFD`, `$INPUT_VID`, `$UNIT`, `$VLAN` |
| `evo/interfaces/ifl-vlan-ccc.conf` | 5 | 4,742 | `$IFD`, `$UNIT`, `$VLAN` |
| `evo/interfaces/ifl-vlan-inet.conf` | 5 | 6,822 | `$AC_ADDR_V4`, `$IFD`, `$UNIT`, `$VLAN` |
| `evo/interfaces/ifl-vlan-inet6.conf` | 5 | 3,400 | `$AC_ADDR_V6`, `$IFD`, `$UNIT`, `$VLAN` |
| `evo/policy-options/community/cm-access-fabric.conf` | 20 | 20 | `$FABRIC_COMMUNITY_AS` |
| `evo/policy-options/community/cm-inet-backup.conf` | 20 | 20 | `$RING_COMMUNITY_AS` |
| `evo/policy-options/community/cm-inet-default.conf` | 20 | 20 | `$RING_COMMUNITY_AS` |
| `evo/policy-options/community/cm-inet-primary.conf` | 20 | 20 | `$RING_COMMUNITY_AS` |
| `evo/policy-options/community/cm-l3vpn-bgpv4.conf` | 5 | 3,397 | `$L3VPN_ID`, `$RT_AS` |
| `evo/policy-options/community/cm-l3vpn-bgpv6.conf` | 5 | 3,400 | `$L3VPN_ID`, `$RT_AS` |
| `evo/policy-options/community/cm-l3vpn-pub.conf` | 20 | 20 | `$RING_COMMUNITY_AS` |
| `evo/policy-options/community/cm-l3vpn.conf` | 7 | 3,650 | `$L3VPN_ID`, `$RT_AS`, `$RT_ID` |
| `evo/policy-options/community/cm-loopback.conf` | 20 | 20 | `$LOOPBACK_COMMUNITY` |
| `evo/policy-options/community/cm-metro-fabric.conf` | 20 | 20 | `$FABRIC_COMMUNITY_AS` |
| `evo/policy-options/community/cm-metro-ring.conf` | 20 | 20 | `$RING_COMMUNITY_AS` |
| `evo/policy-options/community/cm-no-advertise.conf` | 20 | 20 | _none_ |
| `evo/policy-options/community/cm-region-edge.conf` | 20 | 20 | `$RING_COMMUNITY_AS` |
| `evo/policy-options/community/cm-regional-border.conf` | 20 | 20 | `$FABRIC_COMMUNITY_AS` |
| `evo/policy-options/community/cm-service-edge.conf` | 20 | 20 | `$RING_COMMUNITY_AS` |
| `evo/policy-options/community/cm-service-rt.conf` | 11 | 9,303 | `$INSTANCE_NAME`, `$RT_AS`, `$RT_ID` |
| `evo/policy-options/community/cm-tc-4000-gold.conf` | 4 | 4 | _none_ |
| `evo/policy-options/community/cm-tc-6000-bronze.conf` | 4 | 4 | _none_ |
| `evo/policy-options/community/cm-tc-map2bronze.conf` | 11 | 11 | `$COLOR_COMMUNITY` |
| `evo/policy-options/community/cm-tc-map2gold.conf` | 13 | 13 | `$COLOR_COMMUNITY` |
| `evo/policy-options/policy-statement/loopback-rib-leak.conf` | 16 | 16 | `$LOOPBACK_SUPERNET` |
| `evo/policy-options/policy-statement/nhs1-ma1-1.conf` | 4 | 4 | _none_ |
| `evo/policy-options/policy-statement/nhs1-ma3.conf` | 1 | 1 | _none_ |
| `evo/policy-options/policy-statement/per-packet-load-balance.conf` | 20 | 20 | `$PPLB_NAME` |
| `evo/policy-options/policy-statement/ps-as63536-import.conf` | 2 | 2 | _none_ |
| `evo/policy-options/policy-statement/ps-bgp-export-ring-cr1.conf` | 1 | 1 | _none_ |
| `evo/policy-options/policy-statement/ps-bgp-export-ring-cr2.conf` | 1 | 1 | _none_ |
| `evo/policy-options/policy-statement/ps-bgp-export.conf` | 4 | 4 | _none_ |
| `evo/policy-options/policy-statement/ps-bgp-mse-export.conf` | 2 | 2 | _none_ |
| `evo/policy-options/policy-statement/ps-bgp-rr-export.conf` | 2 | 2 | _none_ |
| `evo/policy-options/policy-statement/ps-bgp-transport-export.conf` | 5 | 5 | _none_ |
| `evo/policy-options/policy-statement/ps-cr-import.conf` | 2 | 2 | _none_ |
| `evo/policy-options/policy-statement/ps-ebgp-mse-export.conf` | 2 | 2 | _none_ |
| `evo/policy-options/policy-statement/ps-export-l2-color.conf` | 11 | 9,303 | `$COLOR_COMMUNITY`, `$INSTANCE_NAME` |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-2.conf` | 3 | 4,296 | `$CE_PREFIX_1`, `$CE_PREFIX_2`, `$EXPORT_POL`, `$INSTANCE_NAME` |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf` | 5 | 1,301 | `$CE_PREFIX_1`, `$CE_PREFIX_2`, `$CE_PREFIX_3`, `$EXPORT_POL`, `$INSTANCE_NAME` |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf` | 3 | 201 | `$CE_PREFIX_1`, `$CE_PREFIX_2`, `$CE_PREFIX_3`, `$CE_PREFIX_4`, `$EXPORT_POL`, `$INSTANCE_NAME` |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf` | 4 | 396 | `$CE_PREFIX_1`, `$CE_PREFIX_2`, `$EXPORT_POL`, `$INSTANCE_NAME` |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf` | 3 | 3 | `$CE_PREFIX_1`, `$CE_PREFIX_2`, `$CE_PREFIX_3`, `$CE_PREFIX_4`, `$EXPORT_POL`, `$INSTANCE_NAME` |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public.conf` | 4 | 200 | `$CE_PREFIX_1`, `$CE_PREFIX_2`, `$CE_PREFIX_3`, `$CE_PREFIX_4`, `$EXPORT_POL`, `$INSTANCE_NAME` |
| `evo/policy-options/policy-statement/ps-ibgp-cr-export-cr1.conf` | 2 | 2 | _none_ |
| `evo/policy-options/policy-statement/ps-ibgp-cr-export-meg1.conf` | 2 | 2 | _none_ |
| `evo/policy-options/policy-statement/ps-ibgp-mdr-export.conf` | 2 | 2 | _none_ |
| `evo/policy-options/policy-statement/ps-ibgp-rr-export.conf` | 2 | 2 | _none_ |
| `evo/policy-options/policy-statement/ps-import-bgp-lo0-filter.conf` | 3 | 3 | `$LOOPBACK_SR_V4`, `$LOOPBACK_V4` |
| `evo/policy-options/policy-statement/ps-import-l3vpn-internet.conf` | 5 | 10,197 | `$IMPORT_POL`, `$INSTANCE_NAME` |
| `evo/policy-options/policy-statement/ps-import-l3vpn.conf` | 5 | 250 | `$IMPORT_POL`, `$INSTANCE_NAME` |
| `evo/policy-options/policy-statement/ps-metro-fabric-import.conf` | 2 | 2 | _none_ |
| `evo/policy-options/prefix-list/border-nodes.conf` | 1 | 1 | _none_ |
| `evo/policy-options/prefix-list/pl-an-nodes.conf` | 2 | 2 | _none_ |
| `evo/policy-options/prefix-list/pl-an-region.conf` | 4 | 4 | _none_ |
| `evo/policy-options/prefix-list/pl-border-nodes.conf` | 1 | 1 | _none_ |
| `evo/policy-options/prefix-list/pl-core-nodes.conf` | 2 | 2 | _none_ |
| `evo/policy-options/prefix-list/pl-core.conf` | 2 | 2 | _none_ |
| `evo/policy-options/prefix-list/pl-fabric.conf` | 2 | 2 | _none_ |
| `evo/policy-options/prefix-list/pl-metro-fabric.conf` | 2 | 2 | _none_ |
| `evo/policy-options/prefix-list/pl-metro-ring.conf` | 2 | 2 | _none_ |
| `evo/policy-options/prefix-list/pl-mse.conf` | 4 | 4 | _none_ |
| `evo/protocols/bgp-overlay-an3.conf` | 1 | 1 | _none_ |
| `evo/protocols/bgp-overlay-cr1.conf` | 1 | 1 | _none_ |
| `evo/protocols/bgp-overlay-cr2.conf` | 1 | 1 | _none_ |
| `evo/protocols/bgp-overlay-ma3.conf` | 1 | 1 | _none_ |
| `evo/protocols/bgp-overlay-mdr1.conf` | 1 | 1 | _none_ |
| `evo/protocols/bgp-overlay-meg1.conf` | 1 | 1 | _none_ |
| `evo/protocols/bgp-overlay-meg2.conf` | 1 | 1 | _none_ |
| `evo/protocols/bgp-overlay.conf` | 2 | 2 | `$LOOPBACK_V4`, `$SVC_RR1_V4`, `$SVC_RR2_V4`, `$TRANSPORT_RR1_V4`, `$TRANSPORT_RR2_V4` |
| `evo/protocols/isis-srmpls-tilfa.conf` | 4 | 7 | `$CORE_INTF`, `$ISIS_NET`, `$NODE_SID_V4`, `$NODE_SID_V6` |
| `evo/protocols/l2circuit-hsb-hub-color-ignore-encap.conf` | 1 | 499 | `$AC_INTF`, `$BACKUP_LOOPBACK`, `$PRIMARY_LOOPBACK`, `$UNIT`, `$VC_ID_BACKUP`, `$VC_ID_PRIMARY` |
| `evo/protocols/l2circuit-hsb-hub-color.conf` | 1 | 1 | `$AC_INTF`, `$BACKUP_LOOPBACK`, `$PRIMARY_LOOPBACK`, `$UNIT`, `$VC_ID_BACKUP`, `$VC_ID_PRIMARY` |
| `evo/protocols/l2circuit-hsb-hub-ignore-encap.conf` | 1 | 500 | `$AC_INTF`, `$BACKUP_LOOPBACK`, `$PRIMARY_LOOPBACK`, `$UNIT`, `$VC_ID_BACKUP`, `$VC_ID_PRIMARY` |
| `evo/protocols/l2circuit-hsb-pe-color.conf` | 1 | 500 | `$AC_INTF`, `$HUB_LOOPBACK`, `$UNIT`, `$VC_ID` |
| `evo/protocols/l2circuit-hsb-pe-primary-color.conf` | 1 | 500 | `$AC_INTF`, `$HUB_LOOPBACK`, `$UNIT`, `$VC_ID` |
| `evo/protocols/l2circuit-hsb-pe-primary.conf` | 1 | 500 | `$AC_INTF`, `$HUB_LOOPBACK`, `$UNIT`, `$VC_ID` |
| `evo/protocols/l2circuit-hsb-pe.conf` | 1 | 500 | `$AC_INTF`, `$HUB_LOOPBACK`, `$UNIT`, `$VC_ID` |
| `evo/protocols/l2circuit-lsw.conf` | 1 | 10 | `$AC_INTF_1`, `$AC_INTF_2`, `$UNIT_1`, `$UNIT_2` |
| `evo/protocols/mpls-segment-routing.conf` | 18 | 18 | _none_ |
| `evo/protocols/oam-cfm-perf-mon.conf` | 4 | 1,000 | `$AC_INTF`, `$MA_ID`, `$MD_NAME`, `$MEP_LOCAL`, `$MEP_REMOTE` |
| `evo/routing-instances/apply-groups/gr-fatpw-label.conf` | 3 | 3 | _none_ |
| `evo/routing-instances/apply-groups/gr-l3vpn-fatpw-label.conf` | 3 | 3 | _none_ |
| `evo/routing-instances/apply-groups/gr-l3vpn.conf` | 4 | 4 | _none_ |
| `evo/routing-instances/evpn-elan/ri-evpn-elan-irb.conf` | 3 | 150 | `$AC_INTF`, `$BD_NAME`, `$INSTANCE_NAME`, `$IRB_UNIT`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID`, `$VLAN_BD` |
| `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf` | 5 | 247 | `$AC_INTF`, `$BD_NAME`, `$INSTANCE_NAME`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID`, `$VLAN_BD` |
| `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle-export.conf` | 3 | 93 | `$AC_INTF`, `$BD_NAME`, `$INSTANCE_NAME`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID` |
| `evo/routing-instances/evpn-elan/ri-evpn-port-based.conf` | 2 | 2 | `$AC_INTF`, `$BD_NAME`, `$INSTANCE_NAME`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID` |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-export.conf` | 2 | 16 | `$AC_INTF`, `$INSTANCE_NAME`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID`, `$SVC_ID_LOCAL`, `$SVC_ID_REMOTE`, `$UNIT_A`, `$UNIT_B` |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-3-uni-export.conf` | 1 | 23 | `$AC_INTF`, `$INSTANCE_NAME`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID`, `$SVC_ID_LOCAL`, `$SVC_ID_REMOTE`, `$UNIT_A`, `$UNIT_B`, `$UNIT_C` |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni-export.conf` | 2 | 459 | `$AC_INTF`, `$INSTANCE_NAME`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID`, `$SVC_ID_LOCAL`, `$SVC_ID_REMOTE`, `$UNIT_A`, `$UNIT_B`, `$UNIT_C`, `$UNIT_D` |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni.conf` | 2 | 500 | `$AC_INTF`, `$INSTANCE_NAME`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID`, `$SVC_ID_LOCAL`, `$SVC_ID_REMOTE`, `$UNIT_A`, `$UNIT_B`, `$UNIT_C`, `$UNIT_D` |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni-export.conf` | 4 | 100 | `$AC_INTF_A`, `$AC_INTF_B`, `$INSTANCE_NAME`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID`, `$SVC_ID_LOCAL_A`, `$SVC_ID_LOCAL_B`, `$SVC_ID_REMOTE_A`, `$SVC_ID_REMOTE_B` |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf` | 4 | 100 | `$AC_INTF_A`, `$AC_INTF_B`, `$INSTANCE_NAME`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID`, `$SVC_ID_LOCAL_A`, `$SVC_ID_LOCAL_B`, `$SVC_ID_REMOTE_A`, `$SVC_ID_REMOTE_B` |
| `evo/routing-instances/evpn-vpws/ri-evpn-vpws-export.conf` | 3 | 1,500 | `$AC_INTF`, `$INSTANCE_NAME`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID`, `$VPWS_SVC_ID_LOCAL`, `$VPWS_SVC_ID_REMOTE` |
| `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf` | 8 | 3,902 | `$AC_INTF`, `$INSTANCE_NAME`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID`, `$VPWS_SVC_ID_LOCAL`, `$VPWS_SVC_ID_REMOTE` |
| `evo/routing-instances/l2vpn/ri-l2vpn-kompella-vlan-control-word-export.conf` | 2 | 100 | `$AC_INTF`, `$INSTANCE_NAME`, `$L2VPN_LOCAL_SITE_ID`, `$L2VPN_REMOTE_SITE_ID`, `$L2VPN_SITE`, `$RD`, `$RT` |
| `evo/routing-instances/l2vpn/ri-l2vpn-kompella-vlan-control-word.conf` | 2 | 98 | `$AC_INTF`, `$INSTANCE_NAME`, `$L2VPN_LOCAL_SITE_ID`, `$L2VPN_REMOTE_SITE_ID`, `$L2VPN_SITE`, `$RD`, `$RT` |
| `evo/routing-instances/l2vpn/ri-l2vpn-kompella-vlan-export.conf` | 2 | 100 | `$AC_INTF`, `$INSTANCE_NAME`, `$L2VPN_LOCAL_SITE_ID`, `$L2VPN_REMOTE_SITE_ID`, `$L2VPN_SITE`, `$RD`, `$RT` |
| `evo/routing-instances/l2vpn/ri-l2vpn-kompella-vlan.conf` | 2 | 102 | `$AC_INTF`, `$INSTANCE_NAME`, `$L2VPN_LOCAL_SITE_ID`, `$L2VPN_REMOTE_SITE_ID`, `$L2VPN_SITE`, `$RD`, `$RT` |
| `evo/routing-instances/l2vpn/ri-l2vpn-kompella.conf` | 2 | 2 | `$AC_INTF`, `$INSTANCE_NAME`, `$L2VPN_LOCAL_SITE_ID`, `$L2VPN_REMOTE_SITE_ID`, `$L2VPN_SITE`, `$RD`, `$RT` |
| `evo/routing-instances/l3vpn/ri-l3vpn-bgp-v6-vrf-policy-auto-export.conf` | 4 | 3,300 | `$AC_INTF`, `$AS_CUST`, `$CE_PEER_V6`, `$EXPORT_POL`, `$IMPORT_POL`, `$INSTANCE_NAME`, `$PE_LOCAL_V6`, `$RD`, `$ROUTER_ID` |
| `evo/routing-instances/l3vpn/ri-l3vpn-bgp-v6-vrf-policy.conf` | 1 | 100 | `$AC_INTF`, `$AS_CUST`, `$CE_PEER_V6`, `$EXPORT_POL`, `$IMPORT_POL`, `$INSTANCE_NAME`, `$PE_LOCAL_V6`, `$RD`, `$ROUTER_ID` |
| `evo/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy.conf` | 3 | 1,199 | `$AC_INTF`, `$AS_CUST`, `$CE_PEER_V4`, `$EXPORT_POL`, `$IMPORT_POL`, `$INSTANCE_NAME`, `$PE_LOCAL_V4`, `$RD`, `$ROUTER_ID` |
| `evo/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy-rt.conf` | 2 | 100 | `$EXPORT_POL`, `$IMPORT_POL`, `$INSTANCE_NAME`, `$IRB_UNIT`, `$RD`, `$ROUTER_ID`, `$RT_AS`, `$RT_ID` |
| `evo/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy.conf` | 2 | 100 | `$EXPORT_POL`, `$IMPORT_POL`, `$INSTANCE_NAME`, `$IRB_UNIT`, `$RD`, `$ROUTER_ID` |
| `evo/routing-instances/l3vpn/ri-l3vpn-irb.conf` | 4 | 100 | `$INSTANCE_NAME`, `$IRB_UNIT`, `$RD`, `$ROUTER_ID`, `$RT_AS`, `$RT_ID` |
| `evo/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf` | 4 | 2,400 | `$AC_INTF`, `$EXPORT_POL`, `$IMPORT_POL`, `$INSTANCE_NAME`, `$RD`, `$ROUTER_ID` |
| `evo/routing-instances/l3vpn/ri-l3vpn-unequal-cost.conf` | 1 | 25 | `$AC_INTF`, `$INSTANCE_NAME`, `$RD`, `$ROUTER_ID`, `$RT_AS`, `$RT_ID` |
| `evo/routing-instances/vpls/ri-bgp-vpls-export.conf` | 4 | 397 | `$AC_INTF`, `$BD_NAME`, `$INSTANCE_NAME`, `$L2VPN_SITE`, `$RD`, `$RT_AS`, `$RT_ID`, `$SITE_ID` |
| `evo/routing-instances/vpls/ri-ldp-vpls.conf` | 1 | 1 | `$AC_INTF`, `$BD_NAME`, `$INSTANCE_NAME`, `$REMOTE_PE_V4`, `$VC_ID` |
| `evo/routing-options/flex-algorithm.conf` | 6 | 6 | _none_ |
| `evo/routing-options/forwarding-table.conf` | 8 | 8 | `$PPLB_NAME` |
| `evo/routing-options/rib-groups.conf` | 15 | 15 | _none_ |
| `evo/routing-options/transport-class.conf` | 14 | 14 | `$TC_EGRESS` |
| `junos/class-of-service/classifiers/cl-6class.conf` | 20 | 20 | _none_ |
| `junos/class-of-service/forwarding-classes/fc-6queue-model.conf` | 20 | 20 | _none_ |
| `junos/class-of-service/interfaces/ifd-scheduler-map-shaping.conf` | 1 | 1 | `$COS_INTF` |
| `junos/class-of-service/interfaces/ifd-scheduler-map.conf` | 20 | 110 | `$COS_INTF` |
| `junos/class-of-service/interfaces/ifl-dscp-classifier-rewrite.conf` | 5 | 1,799 | `$COS_INTF`, `$UNIT` |
| `junos/class-of-service/interfaces/ifl-exp-classifier-rewrite.conf` | 20 | 98 | `$COS_INTF`, `$UNIT` |
| `junos/class-of-service/interfaces/ifl-forwarding-class-ieee8021p-rewrite.conf` | 8 | 6,968 | `$COS_INTF`, `$FORWARDING_CLASS`, `$UNIT` |
| `junos/class-of-service/interfaces/ifl-ieee8021p-classifier-rewrite.conf` | 11 | 13,881 | `$COS_INTF`, `$UNIT` |
| `junos/class-of-service/rewrite-rules/rr-6class-marking.conf` | 20 | 20 | _none_ |
| `junos/class-of-service/scheduler-maps/sm-6class-mapping.conf` | 20 | 20 | _none_ |
| `junos/class-of-service/schedulers/sc-2-priority-model.conf` | 9 | 9 | _none_ |
| `junos/firewall/policers.conf` | 1 | 1 | _none_ |
| `junos/groups/bgp-bcp-ma5.conf` | 2 | 2 | _none_ |
| `junos/groups/gr-bgp-bcp.conf` | 19 | 19 | _none_ |
| `junos/groups/gr-core-intf.conf` | 20 | 20 | _none_ |
| `junos/groups/gr-edge-intf-mh.conf` | 9 | 9 | _none_ |
| `junos/groups/gr-edge-intf.conf` | 7 | 7 | _none_ |
| `junos/groups/gr-fatpw-label.conf` | 1 | 1 | _none_ |
| `junos/groups/gr-fatpw-lb.conf` | 10 | 10 | _none_ |
| `junos/groups/gr-isis-bcp.conf` | 3 | 3 | _none_ |
| `junos/groups/gr-l3vpn.conf` | 7 | 7 | _none_ |
| `junos/groups/gr-lag-member.conf` | 18 | 18 | _none_ |
| `junos/interfaces/core-isis-mpls.conf` | 11 | 28 | `$CORE_DESC`, `$CORE_PHYS`, `$CORE_V4_ADDR`, `$CORE_V6_ADDR` |
| `junos/interfaces/ethernet-bridge.conf` | 4 | 738 | `$UNIT`, `$UNI_INTF`, `$VLAN` |
| `junos/interfaces/ifd-ae-lacp-fast-disabled.conf` | 1 | 1 | `$IFD`, `$LACP_SYS_ID` |
| `junos/interfaces/ifd-ae-lacp-fast.conf` | 4 | 6 | `$IFD`, `$LACP_SYS_ID` |
| `junos/interfaces/ifd-ae-lacp.conf` | 4 | 4 | `$IFD`, `$LACP_SYS_ID` |
| `junos/interfaces/ifd-ps-transport.conf` | 2 | 40 | `$ANCHOR_PIC`, `$PS_INTF` |
| `junos/interfaces/ifl-irb-inet.conf` | 3 | 201 | `$IRB_ADDR`, `$UNIT` |
| `junos/interfaces/ifl-vlan-bridge-esi-df-preference.conf` | 2 | 2 | `$ESI`, `$IFD`, `$UNIT`, `$VLAN` |
| `junos/interfaces/ifl-vlan-bridge-esi-etree-root.conf` | 2 | 2,000 | `$ESI`, `$IFD`, `$UNIT`, `$VLAN` |
| `junos/interfaces/ifl-vlan-bridge-esi.conf` | 9 | 1,963 | `$ESI`, `$IFD`, `$UNIT`, `$VLAN` |
| `junos/interfaces/ifl-vlan-bridge-etree-leaf.conf` | 2 | 2,000 | `$IFD`, `$UNIT`, `$VLAN` |
| `junos/interfaces/ifl-vlan-bridge-vlan-map-list.conf` | 1 | 20 | `$IFD`, `$INPUT_VID`, `$UNIT`, `$VLAN_LIST` |
| `junos/interfaces/ifl-vlan-ccc-esi.conf` | 3 | 3 | `$ESI`, `$IFD`, `$UNIT`, `$VLAN` |
| `junos/interfaces/ifl-vlan-ccc-vlan-map-esi.conf` | 7 | 4,200 | `$ESI`, `$IFD`, `$INPUT_VID`, `$UNIT`, `$VLAN` |
| `junos/interfaces/ifl-vlan-ccc-vlan-map-filter.conf` | 3 | 800 | `$IFD`, `$INPUT_VID`, `$UNIT`, `$VLAN` |
| `junos/interfaces/ifl-vlan-ccc.conf` | 5 | 4,742 | `$IFD`, `$UNIT`, `$VLAN` |
| `junos/interfaces/ifl-vlan-inet.conf` | 5 | 6,822 | `$AC_ADDR_V4`, `$IFD`, `$UNIT`, `$VLAN` |
| `junos/interfaces/ifl-vlan-inet6.conf` | 5 | 3,400 | `$AC_ADDR_V6`, `$IFD`, `$UNIT`, `$VLAN` |
| `junos/interfaces/ifl-vlan-vpls-vlan-map.conf` | 1 | 200 | `$IFD`, `$INPUT_VID`, `$UNIT`, `$VLAN` |
| `junos/policy-options/community/cm-access-fabric.conf` | 20 | 20 | `$FABRIC_COMMUNITY_AS` |
| `junos/policy-options/community/cm-inet-backup.conf` | 20 | 20 | `$RING_COMMUNITY_AS` |
| `junos/policy-options/community/cm-inet-default.conf` | 20 | 20 | `$RING_COMMUNITY_AS` |
| `junos/policy-options/community/cm-inet-primary.conf` | 20 | 20 | `$RING_COMMUNITY_AS` |
| `junos/policy-options/community/cm-l3vpn-bgpv4.conf` | 5 | 3,397 | `$L3VPN_ID`, `$RT_AS` |
| `junos/policy-options/community/cm-l3vpn-bgpv6.conf` | 5 | 3,400 | `$L3VPN_ID`, `$RT_AS` |
| `junos/policy-options/community/cm-l3vpn-pub.conf` | 20 | 20 | `$RING_COMMUNITY_AS` |
| `junos/policy-options/community/cm-l3vpn.conf` | 7 | 3,650 | `$L3VPN_ID`, `$RT_AS`, `$RT_ID` |
| `junos/policy-options/community/cm-loopback.conf` | 20 | 20 | `$LOOPBACK_COMMUNITY` |
| `junos/policy-options/community/cm-metro-fabric.conf` | 20 | 20 | `$FABRIC_COMMUNITY_AS` |
| `junos/policy-options/community/cm-metro-ring.conf` | 20 | 20 | `$RING_COMMUNITY_AS` |
| `junos/policy-options/community/cm-no-advertise.conf` | 20 | 20 | _none_ |
| `junos/policy-options/community/cm-region-edge.conf` | 20 | 20 | `$RING_COMMUNITY_AS` |
| `junos/policy-options/community/cm-regional-border.conf` | 20 | 20 | `$FABRIC_COMMUNITY_AS` |
| `junos/policy-options/community/cm-service-edge.conf` | 20 | 20 | `$RING_COMMUNITY_AS` |
| `junos/policy-options/community/cm-service-rt.conf` | 11 | 9,303 | `$INSTANCE_NAME`, `$RT_AS`, `$RT_ID` |
| `junos/policy-options/community/cm-tc-4000-gold.conf` | 4 | 4 | _none_ |
| `junos/policy-options/community/cm-tc-6000-bronze.conf` | 4 | 4 | _none_ |
| `junos/policy-options/community/cm-tc-map2bronze.conf` | 11 | 11 | `$COLOR_COMMUNITY` |
| `junos/policy-options/community/cm-tc-map2gold.conf` | 13 | 13 | `$COLOR_COMMUNITY` |
| `junos/policy-options/policy-statement/loopback-rib-leak.conf` | 16 | 16 | `$LOOPBACK_SUPERNET` |
| `junos/policy-options/policy-statement/nhs1.conf` | 4 | 4 | _none_ |
| `junos/policy-options/policy-statement/per-packet-load-balance.conf` | 20 | 20 | `$PPLB_NAME` |
| `junos/policy-options/policy-statement/ps-as63535-import.conf` | 2 | 2 | _none_ |
| `junos/policy-options/policy-statement/ps-bgp-export.conf` | 4 | 4 | _none_ |
| `junos/policy-options/policy-statement/ps-bgp-mse-export.conf` | 2 | 2 | _none_ |
| `junos/policy-options/policy-statement/ps-bgp-transport-export.conf` | 5 | 5 | _none_ |
| `junos/policy-options/policy-statement/ps-ebgp-cr-export.conf` | 2 | 2 | _none_ |
| `junos/policy-options/policy-statement/ps-export-l2-color.conf` | 11 | 9,303 | `$COLOR_COMMUNITY`, `$INSTANCE_NAME` |
| `junos/policy-options/policy-statement/ps-export-l3vpn-nlri-rt5-public.conf` | 1 | 50 | `$CE_PREFIX_1`, `$CE_PREFIX_2`, `$CE_PREFIX_3`, `$CE_PREFIX_4`, `$EXPORT_POL`, `$INSTANCE_NAME` |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-2.conf` | 3 | 4,296 | `$CE_PREFIX_1`, `$CE_PREFIX_2`, `$EXPORT_POL`, `$INSTANCE_NAME` |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3-color.conf` | 1 | 999 | `$CE_PREFIX_1`, `$CE_PREFIX_2`, `$CE_PREFIX_3`, `$EXPORT_POL`, `$INSTANCE_NAME` |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf` | 5 | 1,301 | `$CE_PREFIX_1`, `$CE_PREFIX_2`, `$CE_PREFIX_3`, `$EXPORT_POL`, `$INSTANCE_NAME` |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf` | 3 | 201 | `$CE_PREFIX_1`, `$CE_PREFIX_2`, `$CE_PREFIX_3`, `$CE_PREFIX_4`, `$EXPORT_POL`, `$INSTANCE_NAME` |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf` | 4 | 396 | `$CE_PREFIX_1`, `$CE_PREFIX_2`, `$EXPORT_POL`, `$INSTANCE_NAME` |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-3.conf` | 3 | 3,000 | `$CE_PREFIX_1`, `$CE_PREFIX_2`, `$CE_PREFIX_3`, `$EXPORT_POL`, `$INSTANCE_NAME` |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf` | 3 | 3 | `$CE_PREFIX_1`, `$CE_PREFIX_2`, `$CE_PREFIX_3`, `$CE_PREFIX_4`, `$EXPORT_POL`, `$INSTANCE_NAME` |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-v6-default-route.conf` | 1 | 1 | `$CE_PREFIX_1`, `$CE_PREFIX_2`, `$CE_PREFIX_3`, `$EXPORT_POL`, `$INSTANCE_NAME` |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public.conf` | 4 | 200 | `$CE_PREFIX_1`, `$CE_PREFIX_2`, `$CE_PREFIX_3`, `$CE_PREFIX_4`, `$EXPORT_POL`, `$INSTANCE_NAME` |
| `junos/policy-options/policy-statement/ps-ibgp-mdr-export-mdr2.conf` | 2 | 2 | _none_ |
| `junos/policy-options/policy-statement/ps-ibgp-mdr-export-mse1.conf` | 2 | 2 | _none_ |
| `junos/policy-options/policy-statement/ps-ibgp-mse-export.conf` | 2 | 2 | _none_ |
| `junos/policy-options/policy-statement/ps-ibgp-rr-export.conf` | 2 | 2 | _none_ |
| `junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf` | 2 | 2 | `$LOOPBACK_ANYCAST_V4`, `$LOOPBACK_V4` |
| `junos/policy-options/policy-statement/ps-import-l3vpn-internet.conf` | 5 | 10,197 | `$IMPORT_POL`, `$INSTANCE_NAME` |
| `junos/policy-options/policy-statement/ps-import-l3vpn.conf` | 5 | 250 | `$IMPORT_POL`, `$INSTANCE_NAME` |
| `junos/policy-options/policy-statement/ps-inet-vrf-default.conf` | 1 | 1 | _none_ |
| `junos/policy-options/policy-statement/ps-mse-import.conf` | 2 | 2 | _none_ |
| `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf` | 18 | 18 | _none_ |
| `junos/policy-options/prefix-list/pl-an-region.conf` | 4 | 4 | _none_ |
| `junos/policy-options/prefix-list/pl-mse-primary.conf` | 2 | 2 | _none_ |
| `junos/policy-options/prefix-list/pl-mse.conf` | 4 | 4 | _none_ |
| `junos/protocols/bgp-overlay-an4.conf` | 1 | 1 | _none_ |
| `junos/protocols/bgp-overlay-ma4.conf` | 1 | 1 | _none_ |
| `junos/protocols/bgp-overlay-ma5.conf` | 1 | 1 | _none_ |
| `junos/protocols/bgp-overlay-mdr2.conf` | 1 | 1 | _none_ |
| `junos/protocols/bgp-overlay-mse1.conf` | 1 | 1 | _none_ |
| `junos/protocols/bgp-overlay-mse2.conf` | 1 | 1 | _none_ |
| `junos/protocols/bgp-overlay.conf` | 2 | 2 | `$LOOPBACK_V4`, `$RR1_V4`, `$RR2_V4` |
| `junos/protocols/isis-srmpls-tilfa.conf` | 1 | 1 | `$CORE_INTF_1`, `$CORE_INTF_2`, `$NODE_SID_V4`, `$NODE_SID_V6` |
| `junos/protocols/l2circuit-floating-pw-color.conf` | 2 | 11 | `$COLOR_COMMUNITY`, `$LABEL_IN`, `$LABEL_OUT`, `$PS_INTF`, `$REMOTE_PE_V4`, `$VC_ID` |
| `junos/protocols/l2circuit-floating-pw.conf` | 2 | 29 | `$LABEL_IN`, `$LABEL_OUT`, `$PS_INTF`, `$REMOTE_PE_V4`, `$VC_ID` |
| `junos/protocols/mpls-segment-routing.conf` | 18 | 18 | _none_ |
| `junos/protocols/oam-cfm-perf-mon.conf` | 5 | 900 | `$AC_INTF`, `$MA_ID`, `$MD_NAME`, `$MEP_LOCAL`, `$MEP_REMOTE_1`, `$MEP_REMOTE_2` |
| `junos/routing-instances/apply-groups/gr-fatpw-label.conf` | 3 | 3 | _none_ |
| `junos/routing-instances/apply-groups/gr-l3vpn.conf` | 4 | 4 | _none_ |
| `junos/routing-instances/evpn-elan/ri-evpn-elan-irb.conf` | 2 | 100 | `$AC_INTF`, `$BD_NAME`, `$INSTANCE_NAME`, `$IRB_UNIT`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID`, `$UNIT`, `$VLAN` |
| `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf` | 1 | 49 | `$AC_INTF`, `$INSTANCE_NAME`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID` |
| `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based.conf` | 2 | 150 | `$AC_INTF`, `$INSTANCE_NAME`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID`, `$VLAN_UNIT` |
| `junos/routing-instances/evpn-elan/ri-evpn-floating-pw.conf` | 2 | 220 | `$AC_INTF`, `$INSTANCE_NAME`, `$LOOPBACK_V4`, `$PS_INTF`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID`, `$VLAN` |
| `junos/routing-instances/evpn-etree/ri-evpn-etree-export.conf` | 4 | 2,000 | `$AC_INTF`, `$INSTANCE_NAME`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID`, `$UNIT`, `$VLAN` |
| `junos/routing-instances/evpn-etree/ri-evpn-etree.conf` | 4 | 2,000 | `$AC_INTF`, `$INSTANCE_NAME`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID`, `$UNIT`, `$VLAN` |
| `junos/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-export.conf` | 2 | 16 | `$AC_INTF`, `$INSTANCE_NAME`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID`, `$SVC_ID_LOCAL`, `$SVC_ID_REMOTE`, `$UNIT_A`, `$UNIT_B` |
| `junos/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni-export.conf` | 2 | 459 | `$AC_INTF`, `$INSTANCE_NAME`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID`, `$SVC_ID_LOCAL`, `$SVC_ID_REMOTE`, `$UNIT_A`, `$UNIT_B`, `$UNIT_C`, `$UNIT_D` |
| `junos/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni.conf` | 2 | 500 | `$AC_INTF`, `$INSTANCE_NAME`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID`, `$SVC_ID_LOCAL`, `$SVC_ID_REMOTE`, `$UNIT_A`, `$UNIT_B`, `$UNIT_C`, `$UNIT_D` |
| `junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf` | 8 | 3,902 | `$AC_INTF`, `$INSTANCE_NAME`, `$LOOPBACK_V4`, `$RD_SUB_ASSIGNED`, `$RT_AS`, `$RT_ID`, `$VPWS_SVC_ID_LOCAL`, `$VPWS_SVC_ID_REMOTE` |
| `junos/routing-instances/l2vpn/ri-l2vpn-kompella-vlan-control-word-export.conf` | 2 | 100 | `$AC_INTF`, `$INSTANCE_NAME`, `$L2VPN_LOCAL_SITE_ID`, `$L2VPN_REMOTE_SITE_ID`, `$L2VPN_SITE`, `$RD`, `$RT` |
| `junos/routing-instances/l2vpn/ri-l2vpn-kompella-vlan-control-word.conf` | 2 | 98 | `$AC_INTF`, `$INSTANCE_NAME`, `$L2VPN_LOCAL_SITE_ID`, `$L2VPN_REMOTE_SITE_ID`, `$L2VPN_SITE`, `$RD`, `$RT` |
| `junos/routing-instances/l2vpn/ri-l2vpn-kompella-vlan-export.conf` | 2 | 100 | `$AC_INTF`, `$INSTANCE_NAME`, `$L2VPN_LOCAL_SITE_ID`, `$L2VPN_REMOTE_SITE_ID`, `$L2VPN_SITE`, `$RD`, `$RT` |
| `junos/routing-instances/l2vpn/ri-l2vpn-kompella-vlan.conf` | 2 | 102 | `$AC_INTF`, `$INSTANCE_NAME`, `$L2VPN_LOCAL_SITE_ID`, `$L2VPN_REMOTE_SITE_ID`, `$L2VPN_SITE`, `$RD`, `$RT` |
| `junos/routing-instances/l2vpn/ri-l2vpn-kompella.conf` | 1 | 1 | `$AC_INTF`, `$INSTANCE_NAME`, `$L2VPN_LOCAL_SITE_ID`, `$L2VPN_REMOTE_SITE_ID`, `$L2VPN_SITE`, `$RD`, `$RT` |
| `junos/routing-instances/l3vpn/ri-internet-vrf-export.conf` | 1 | 1 | `$AC_INTF`, `$AS_CUST`, `$CE_PEER_V4`, `$CE_PEER_V6`, `$EXPORT_POL`, `$INSTANCE_NAME`, `$PE_LOCAL_V4`, `$PE_LOCAL_V6`, `$RD`, `$ROUTER_ID`, `$RT_AS`, `$RT_ID` |
| `junos/routing-instances/l3vpn/ri-l3vpn-bgp-v6-vrf-policy-auto-export.conf` | 4 | 3,300 | `$AC_INTF`, `$AS_CUST`, `$CE_PEER_V6`, `$EXPORT_POL`, `$IMPORT_POL`, `$INSTANCE_NAME`, `$PE_LOCAL_V6`, `$RD`, `$ROUTER_ID` |
| `junos/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy-auto-export.conf` | 2 | 2,198 | `$AC_INTF`, `$AS_CUST`, `$CE_PEER_V4`, `$EXPORT_POL`, `$IMPORT_POL`, `$INSTANCE_NAME`, `$PE_LOCAL_V4`, `$RD`, `$ROUTER_ID` |
| `junos/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy-next-table.conf` | 1 | 50 | `$EXPORT_POL`, `$IMPORT_POL`, `$INSTANCE_NAME`, `$IRB_UNIT`, `$RD`, `$ROUTER_ID` |
| `junos/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy.conf` | 2 | 100 | `$EXPORT_POL`, `$IMPORT_POL`, `$INSTANCE_NAME`, `$IRB_UNIT`, `$RD`, `$ROUTER_ID` |
| `junos/routing-instances/l3vpn/ri-l3vpn-irb.conf` | 4 | 100 | `$INSTANCE_NAME`, `$IRB_UNIT`, `$RD`, `$ROUTER_ID`, `$RT_AS`, `$RT_ID` |
| `junos/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf` | 4 | 2,400 | `$AC_INTF`, `$EXPORT_POL`, `$IMPORT_POL`, `$INSTANCE_NAME`, `$RD`, `$ROUTER_ID` |
| `junos/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy.conf` | 1 | 1,000 | `$AC_INTF`, `$EXPORT_POL`, `$IMPORT_POL`, `$INSTANCE_NAME`, `$RD`, `$ROUTER_ID` |
| `junos/routing-instances/vpls/ri-bgp-vpls-export.conf` | 1 | 50 | `$AC_INTF`, `$BD_NAME`, `$INSTANCE_NAME`, `$L2VPN_SITE`, `$RD`, `$RT`, `$SITE_ID`, `$VLAN_BD` |
| `junos/routing-instances/vpls/ri-bgp-vpls-site-range-export.conf` | 1 | 100 | `$AC_INTF`, `$INSTANCE_NAME`, `$LABEL_BLOCK_SIZE`, `$RD`, `$RT`, `$SITE_RANGE`, `$VPLS_SITE`, `$VPLS_SITE_ID` |
| `junos/routing-instances/vpls/ri-bgp-vpls-site-range.conf` | 1 | 100 | `$AC_INTF`, `$INSTANCE_NAME`, `$LABEL_BLOCK_SIZE`, `$RD`, `$RT`, `$SITE_RANGE`, `$VPLS_SITE`, `$VPLS_SITE_ID` |
| `junos/routing-options/flex-algorithm.conf` | 6 | 6 | _none_ |
| `junos/routing-options/forwarding-table.conf` | 2 | 2 | `$PPLB_NAME` |
| `junos/routing-options/rib-group-remote-loopbacks-mse.conf` | 17 | 17 | _none_ |
| `junos/routing-options/rib-groups.conf` | 15 | 15 | _none_ |
| `junos/routing-options/transport-class.conf` | 14 | 14 | `$TC_EGRESS` |

## Snippets with equivalent bindings

Where one instance can be read under more than one binding.

| Snippet | Device | Instances | Bindings | Largest class |
|---|---|---:|---:|---:|
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-2.conf` | `an3_acx7100-48l` | 99 | 198 | 2 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-2.conf` | `mse1_mx304` | 2,099 | 4,198 | 2 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-2.conf` | `mse2_mx304` | 2,098 | 4,196 | 2 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf` | `an3_acx7100-48l` | 100 | 600 | 6 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf` | `ma3_acx7100-48l` | 99 | 594 | 6 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf` | `ma4_mx204` | 1,000 | 6,000 | 6 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf` | `mse1_mx304` | 100 | 600 | 6 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf` | `mse2_mx304` | 2 | 12 | 6 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf` | `an3_acx7100-48l` | 1 | 24 | 24 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf` | `ma3_acx7100-48l` | 101 | 2,424 | 24 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf` | `mse2_mx304` | 99 | 2,376 | 24 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf` | `an3_acx7100-48l` | 99 | 198 | 2 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf` | `ma3_acx7100-48l` | 99 | 198 | 2 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf` | `mse1_mx304` | 99 | 198 | 2 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf` | `mse2_mx304` | 99 | 198 | 2 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf` | `an3_acx7100-48l` | 1 | 24 | 24 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf` | `ma3_acx7100-48l` | 1 | 24 | 24 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf` | `mse2_mx304` | 1 | 24 | 24 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public.conf` | `an3_acx7100-48l` | 50 | 1,200 | 24 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public.conf` | `meg1_acx7100-32c` | 50 | 1,200 | 24 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public.conf` | `meg2_acx7509` | 50 | 1,200 | 24 |
| `evo/policy-options/policy-statement/ps-export-l3vpn-public.conf` | `mse1_mx304` | 50 | 1,200 | 24 |
| `evo/policy-options/policy-statement/ps-import-bgp-lo0-filter.conf` | `mdr2_mx10003` | 1 | 2 | 2 |
| `evo/policy-options/policy-statement/ps-import-bgp-lo0-filter.conf` | `meg1_acx7100-32c` | 1 | 2 | 2 |
| `evo/policy-options/policy-statement/ps-import-bgp-lo0-filter.conf` | `meg2_acx7509` | 1 | 2 | 2 |
| `evo/protocols/bgp-overlay.conf` | `ma1-1_acx7024` | 1 | 4 | 4 |
| `evo/protocols/bgp-overlay.conf` | `ma1-2_acx7024` | 1 | 4 | 4 |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-export.conf` | `an3_acx7100-48l` | 8 | 16 | 2 |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-export.conf` | `mse1_mx304` | 8 | 16 | 2 |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-3-uni-export.conf` | `an3_acx7100-48l` | 23 | 138 | 6 |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni-export.conf` | `an3_acx7100-48l` | 219 | 5,256 | 24 |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni-export.conf` | `mse1_mx304` | 240 | 5,760 | 24 |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni.conf` | `an3_acx7100-48l` | 250 | 6,000 | 24 |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni.conf` | `mse1_mx304` | 250 | 6,000 | 24 |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni-export.conf` | `ma1-1_acx7024` | 25 | 50 | 2 |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni-export.conf` | `ma1-2_acx7024` | 25 | 50 | 2 |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni-export.conf` | `meg1_acx7100-32c` | 25 | 50 | 2 |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni-export.conf` | `meg2_acx7509` | 25 | 50 | 2 |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf` | `ma1-1_acx7024` | 25 | 50 | 2 |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf` | `ma1-2_acx7024` | 25 | 50 | 2 |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf` | `meg1_acx7100-32c` | 25 | 50 | 2 |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf` | `meg2_acx7509` | 25 | 50 | 2 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-nlri-rt5-public.conf` | `mse2_mx304` | 50 | 1,200 | 24 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-2.conf` | `an3_acx7100-48l` | 99 | 198 | 2 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-2.conf` | `mse1_mx304` | 2,099 | 4,198 | 2 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-2.conf` | `mse2_mx304` | 2,098 | 4,196 | 2 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3-color.conf` | `ma4_mx204` | 999 | 5,994 | 6 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf` | `an3_acx7100-48l` | 100 | 600 | 6 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf` | `ma3_acx7100-48l` | 99 | 594 | 6 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf` | `ma4_mx204` | 1,000 | 6,000 | 6 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf` | `mse1_mx304` | 100 | 600 | 6 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf` | `mse2_mx304` | 2 | 12 | 6 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf` | `an3_acx7100-48l` | 1 | 24 | 24 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf` | `ma3_acx7100-48l` | 101 | 2,424 | 24 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf` | `mse2_mx304` | 99 | 2,376 | 24 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf` | `an3_acx7100-48l` | 99 | 198 | 2 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf` | `ma3_acx7100-48l` | 99 | 198 | 2 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf` | `mse1_mx304` | 99 | 198 | 2 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf` | `mse2_mx304` | 99 | 198 | 2 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-3.conf` | `ma4_mx204` | 1,000 | 6,000 | 6 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-3.conf` | `mse1_mx304` | 1,001 | 6,006 | 6 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-3.conf` | `mse2_mx304` | 999 | 5,994 | 6 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf` | `an3_acx7100-48l` | 1 | 24 | 24 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf` | `ma3_acx7100-48l` | 1 | 24 | 24 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf` | `mse2_mx304` | 1 | 24 | 24 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public-v6-default-route.conf` | `mse2_mx304` | 1 | 6 | 6 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public.conf` | `an3_acx7100-48l` | 50 | 1,200 | 24 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public.conf` | `meg1_acx7100-32c` | 50 | 1,200 | 24 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public.conf` | `meg2_acx7509` | 50 | 1,200 | 24 |
| `junos/policy-options/policy-statement/ps-export-l3vpn-public.conf` | `mse1_mx304` | 50 | 1,200 | 24 |
| `junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf` | `mse1_mx304` | 1 | 2 | 2 |
| `junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf` | `mse2_mx304` | 1 | 2 | 2 |
| `junos/protocols/bgp-overlay.conf` | `an1_mx204` | 1 | 2 | 2 |
| `junos/protocols/bgp-overlay.conf` | `an2_acx5448` | 1 | 2 | 2 |
| `junos/protocols/isis-srmpls-tilfa.conf` | `an1_mx204` | 1 | 2 | 2 |
| `junos/protocols/oam-cfm-perf-mon.conf` | `an3_acx7100-48l` | 300 | 600 | 2 |
| `junos/protocols/oam-cfm-perf-mon.conf` | `ma1-2_acx7024` | 100 | 200 | 2 |
| `junos/protocols/oam-cfm-perf-mon.conf` | `ma5_mx204` | 200 | 400 | 2 |
| `junos/protocols/oam-cfm-perf-mon.conf` | `meg1_acx7100-32c` | 200 | 400 | 2 |
| `junos/protocols/oam-cfm-perf-mon.conf` | `meg2_acx7509` | 100 | 200 | 2 |
| `junos/routing-instances/evpn-elan/ri-evpn-floating-pw.conf` | `mse1_mx304` | 110 | 220 | 2 |
| `junos/routing-instances/evpn-elan/ri-evpn-floating-pw.conf` | `mse2_mx304` | 110 | 220 | 2 |
| `junos/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-export.conf` | `an3_acx7100-48l` | 8 | 16 | 2 |
| `junos/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-export.conf` | `mse1_mx304` | 8 | 16 | 2 |
| `junos/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni-export.conf` | `an3_acx7100-48l` | 219 | 5,256 | 24 |
| `junos/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni-export.conf` | `mse1_mx304` | 240 | 5,760 | 24 |
| `junos/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni.conf` | `an3_acx7100-48l` | 250 | 6,000 | 24 |
| `junos/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni.conf` | `mse1_mx304` | 250 | 6,000 | 24 |

## Example instance per snippet

The first instance of each snippet, in the artifact's own ordering.

- `evo/class-of-service/interfaces/ifd-scheduler-map.conf` on `ag1-1_acx7100-32c` — `$COS_INTF` = `ae23`
- `evo/class-of-service/interfaces/ifl-dscp-classifier-rewrite.conf` on `an3_acx7100-48l` — `$COS_INTF` = `et-0/0/4`, `$UNIT` = `2001`
- `evo/class-of-service/interfaces/ifl-exp-classifier-rewrite.conf` on `ag1-1_acx7100-32c` — `$COS_INTF` = `ae23`, `$UNIT` = `0`
- `evo/class-of-service/interfaces/ifl-forwarding-class-ieee8021p-rewrite.conf` on `an1_mx204` — `$COS_INTF` = `ae11`, `$FORWARDING_CLASS` = `REALTIME`, `$UNIT` = `2400`
- `evo/class-of-service/interfaces/ifl-ieee8021p-classifier-rewrite.conf` on `an1_mx204` — `$COS_INTF` = `ae11`, `$UNIT` = `700`
- `evo/class-of-service/interfaces/ifl-ieee8021p-classifier.conf` on `meg2_acx7509` — `$COS_INTF` = `ae12`, `$UNIT` = `700`
- `evo/interfaces/core-isis-mpls.conf` on `ma1-1_acx7024` — `$CORE_DESC` = `"to MA1.1 rtme-acx7024-04 ae88"`, `$CORE_PHYS` = `ae88`, `$CORE_V4_ADDR` = `10.10.1.118/30`, `$CORE_V6_ADDR` = `2001::10:10:1:76/126`, `$ISIS_NET` = `49.0001.0010.0100.0017.00`, `$LO0_DESC` = `"MA1.1 Metro Ring Blue metro-a"`, `$LOOPBACK_V4_PFX` = `1.1.0.17/32`, `$LOOPBACK_V6_PFX` = `2001::1:1:0:11/128`
- `evo/interfaces/ifd-ae-lacp-fast.conf` on `an1_mx204` — `$IFD` = `ae11`, `$LACP_SYS_ID` = `00:00:00:00:00:01`
- `evo/interfaces/ifd-ae-lacp.conf` on `ma1-1_acx7024` — `$IFD` = `ae12`, `$LACP_SYS_ID` = `00:00:00:00:00:01`
- `evo/interfaces/ifl-irb-inet.conf` on `an3_acx7100-48l` — `$IRB_ADDR` = `172.16.255.1/30`, `$UNIT` = `5000`
- `evo/interfaces/ifl-irb-virtual-gateway.conf` on `meg1_acx7100-32c` — `$IRB_ADDR` = `41.2.10.3/24`, `$UNIT` = `4008`, `$VGA` = `41.2.10.1`, `$VG_MAC` = `00:01:33:44:11:11`
- `evo/interfaces/ifl-vlan-bridge-esi.conf` on `an1_mx204` — `$ESI` = `00:70:11:11:11:11:11:00:00:02`, `$IFD` = `ae11`, `$UNIT` = `701`, `$VLAN` = `701`
- `evo/interfaces/ifl-vlan-bridge-vlan-list-esi.conf` on `meg1_acx7100-32c` — `$ESI` = `00:81:10:10:10:10:10:00:00:01`, `$IFD` = `ae66`, `$UNIT` = `1000`, `$VLAN_LIST` = `1000-1001`
- `evo/interfaces/ifl-vlan-bridge-vlan-map.conf` on `an3_acx7100-48l` — `$IFD` = `et-0/0/0`, `$INPUT_VID` = `3500`, `$UNIT` = `400`, `$VLAN` = `400`
- `evo/interfaces/ifl-vlan-ccc-dual-tag-esi.conf` on `ma1-1_acx7024` — `$ESI` = `00:10:11:11:50:12:03:19:00:00`, `$IFD` = `ae12`, `$UNIT` = `225`, `$VLAN_INNER` = `2250`, `$VLAN_OUTER` = `225`
- `evo/interfaces/ifl-vlan-ccc-esi.conf` on `an1_mx204` — `$ESI` = `00:10:11:11:11:11:01:00:00:00`, `$IFD` = `ae11`, `$UNIT` = `101`, `$VLAN` = `101`
- `evo/interfaces/ifl-vlan-ccc-vlan-map-esi.conf` on `an1_mx204` — `$ESI` = `00:10:11:11:30:11:01:00:00:00`, `$IFD` = `ae11`, `$INPUT_VID` = `3800`, `$UNIT` = `2400`, `$VLAN` = `2400`
- `evo/interfaces/ifl-vlan-ccc-vlan-map-filter-ccc.conf` on `an3_acx7100-48l` — `$IFD` = `et-0/0/0`, `$INPUT_VID` = `1000`, `$UNIT` = `3000`, `$VLAN` = `3000`
- `evo/interfaces/ifl-vlan-ccc-vlan-map-filter.conf` on `an3_acx7100-48l` — `$IFD` = `et-0/0/0`, `$INPUT_VID` = `3200`, `$UNIT` = `2800`, `$VLAN` = `2800`
- `evo/interfaces/ifl-vlan-ccc-vlan-map-list-tpid.conf` on `ma3_acx7100-48l` — `$IFD` = `et-0/0/5`, `$INPUT_VID` = `4000`, `$UNIT` = `1000`, `$VLAN_LIST` = `1000-1099`
- `evo/interfaces/ifl-vlan-ccc-vlan-map-list.conf` on `an3_acx7100-48l` — `$IFD` = `et-0/0/0`, `$INPUT_VID` = `4090`, `$UNIT` = `800`, `$VLAN_LIST` = `800-809`
- `evo/interfaces/ifl-vlan-ccc-vlan-map.conf` on `an3_acx7100-48l` — `$IFD` = `et-0/0/50`, `$INPUT_VID` = `1000`, `$UNIT` = `3000`, `$VLAN` = `3000`
- `evo/interfaces/ifl-vlan-ccc.conf` on `an3_acx7100-48l` — `$IFD` = `et-0/0/0`, `$UNIT` = `1000`, `$VLAN` = `1000`
- `evo/interfaces/ifl-vlan-inet.conf` on `an3_acx7100-48l` — `$AC_ADDR_V4` = `13.1.0.1/30`, `$IFD` = `et-0/0/4`, `$UNIT` = `2001`, `$VLAN` = `2001`
- `evo/interfaces/ifl-vlan-inet6.conf` on `an3_acx7100-48l` — `$AC_ADDR_V6` = `2001:0:0:0:13:3:0:1/126`, `$IFD` = `et-0/0/4`, `$UNIT` = `2201`, `$VLAN` = `2201`
- `evo/policy-options/community/cm-access-fabric.conf` on `ag1-1_acx7100-32c` — `$FABRIC_COMMUNITY_AS` = `63535`
- `evo/policy-options/community/cm-inet-backup.conf` on `ag1-1_acx7100-32c` — `$RING_COMMUNITY_AS` = `63536`
- `evo/policy-options/community/cm-inet-default.conf` on `ag1-1_acx7100-32c` — `$RING_COMMUNITY_AS` = `63536`
- `evo/policy-options/community/cm-inet-primary.conf` on `ag1-1_acx7100-32c` — `$RING_COMMUNITY_AS` = `63536`
- `evo/policy-options/community/cm-l3vpn-bgpv4.conf` on `an3_acx7100-48l` — `$L3VPN_ID` = `2101`, `$RT_AS` = `63535`
- `evo/policy-options/community/cm-l3vpn-bgpv6.conf` on `an3_acx7100-48l` — `$L3VPN_ID` = `2201`, `$RT_AS` = `63535`
- `evo/policy-options/community/cm-l3vpn-pub.conf` on `ag1-1_acx7100-32c` — `$RING_COMMUNITY_AS` = `63536`
- `evo/policy-options/community/cm-l3vpn.conf` on `an3_acx7100-48l` — `$L3VPN_ID` = `2001`, `$RT_AS` = `63535`, `$RT_ID` = `2001`
- `evo/policy-options/community/cm-loopback.conf` on `ag1-1_acx7100-32c` — `$LOOPBACK_COMMUNITY` = `63535:10000`
- `evo/policy-options/community/cm-metro-fabric.conf` on `ag1-1_acx7100-32c` — `$FABRIC_COMMUNITY_AS` = `63535`
- `evo/policy-options/community/cm-metro-ring.conf` on `ag1-1_acx7100-32c` — `$RING_COMMUNITY_AS` = `63536`
- `evo/policy-options/community/cm-region-edge.conf` on `ag1-1_acx7100-32c` — `$RING_COMMUNITY_AS` = `63536`
- `evo/policy-options/community/cm-regional-border.conf` on `ag1-1_acx7100-32c` — `$FABRIC_COMMUNITY_AS` = `63535`
- `evo/policy-options/community/cm-service-edge.conf` on `ag1-1_acx7100-32c` — `$RING_COMMUNITY_AS` = `63536`
- `evo/policy-options/community/cm-service-rt.conf` on `an1_mx204` — `$INSTANCE_NAME` = `evpn_group_90_700`, `$RT_AS` = `63535`, `$RT_ID` = `7000`
- `evo/policy-options/community/cm-tc-map2bronze.conf` on `an1_mx204` — `$COLOR_COMMUNITY` = `map2bronze`
- `evo/policy-options/community/cm-tc-map2gold.conf` on `an1_mx204` — `$COLOR_COMMUNITY` = `map2gold`
- `evo/policy-options/policy-statement/loopback-rib-leak.conf` on `an1_mx204` — `$LOOPBACK_SUPERNET` = `1.1.0.0/16`
- `evo/policy-options/policy-statement/per-packet-load-balance.conf` on `ag1-1_acx7100-32c` — `$PPLB_NAME` = `PS-PPLB`
- `evo/policy-options/policy-statement/ps-export-l2-color.conf` on `an1_mx204` — `$COLOR_COMMUNITY` = `map2gold`, `$INSTANCE_NAME` = `evpn_group_90_700`
- `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-2.conf` on `an3_acx7100-48l` — `$CE_PREFIX_1` = `13.1.0.0/16`, `$CE_PREFIX_2` = `15.1.0.0/16`, `$EXPORT_POL` = `PS-METRO_L3VPN_2002-EXPORT`, `$INSTANCE_NAME` = `METRO_L3VPN_2002` _(1 of 2 equivalent bindings)_
- `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf` on `an3_acx7100-48l` — `$CE_PREFIX_1` = `13.2.0.0/16`, `$CE_PREFIX_2` = `15.2.0.0/16`, `$CE_PREFIX_3` = `16.2.0.0/16`, `$EXPORT_POL` = `PS-METRO_BGPv4_L3VPN_2101-EXPORT`, `$INSTANCE_NAME` = `METRO_BGPv4_L3VPN_2101` _(1 of 6 equivalent bindings)_
- `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf` on `an3_acx7100-48l` — `$CE_PREFIX_1` = `115.1.0.0/16`, `$CE_PREFIX_2` = `13.1.0.0/16`, `$CE_PREFIX_3` = `15.1.0.0/16`, `$CE_PREFIX_4` = `16.1.0.0/16`, `$EXPORT_POL` = `PS-METRO_L3VPN_2001-EXPORT`, `$INSTANCE_NAME` = `METRO_L3VPN_2001` _(1 of 24 equivalent bindings)_
- `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf` on `an3_acx7100-48l` — `$CE_PREFIX_1` = `2001::13:3:0:0/64`, `$CE_PREFIX_2` = `2001::16:3:0:0/64`, `$EXPORT_POL` = `PS-METRO_BGPv6_L3VPN_2202-EXPORT`, `$INSTANCE_NAME` = `METRO_BGPv6_L3VPN_2202` _(1 of 2 equivalent bindings)_
- `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf` on `an3_acx7100-48l` — `$CE_PREFIX_1` = `2001::115:3:0:0/64`, `$CE_PREFIX_2` = `2001::13:3:0:0/64`, `$CE_PREFIX_3` = `2001::15:3:0:0/64`, `$CE_PREFIX_4` = `2001::16:3:0:0/64`, `$EXPORT_POL` = `PS-METRO_BGPv6_L3VPN_2201-EXPORT`, `$INSTANCE_NAME` = `METRO_BGPv6_L3VPN_2201` _(1 of 24 equivalent bindings)_
- `evo/policy-options/policy-statement/ps-export-l3vpn-public.conf` on `an3_acx7100-48l` — `$CE_PREFIX_1` = `40.2.0.0/16`, `$CE_PREFIX_2` = `41.2.0.0/16`, `$CE_PREFIX_3` = `43.2.0.0/16`, `$CE_PREFIX_4` = `44.2.0.0/16`, `$EXPORT_POL` = `PS-METRO_L3VPN_4000-EXPORT`, `$INSTANCE_NAME` = `METRO_L3VPN_4000` _(1 of 24 equivalent bindings)_
- `evo/policy-options/policy-statement/ps-import-bgp-lo0-filter.conf` on `mdr2_mx10003` — `$LOOPBACK_SR_V4` = `1.1.0.13`, `$LOOPBACK_V4` = `1.1.10.13` _(1 of 2 equivalent bindings)_
- `evo/policy-options/policy-statement/ps-import-l3vpn-internet.conf` on `an3_acx7100-48l` — `$IMPORT_POL` = `PS-METRO_BGPv4_L3VPN_2101-IMPORT`, `$INSTANCE_NAME` = `METRO_BGPv4_L3VPN_2101`
- `evo/policy-options/policy-statement/ps-import-l3vpn.conf` on `an3_acx7100-48l` — `$IMPORT_POL` = `PS-METRO_L3VPN_4000-IMPORT`, `$INSTANCE_NAME` = `METRO_L3VPN_4000`
- `evo/protocols/bgp-overlay.conf` on `ma1-1_acx7024` — `$LOOPBACK_V4` = `1.1.0.17`, `$SVC_RR1_V4` = `1.1.0.10`, `$SVC_RR2_V4` = `1.1.0.11`, `$TRANSPORT_RR1_V4` = `1.1.0.12`, `$TRANSPORT_RR2_V4` = `1.1.0.13` _(1 of 4 equivalent bindings)_
- `evo/protocols/isis-srmpls-tilfa.conf` on `ma1-1_acx7024` — `$CORE_INTF` = `ae83.0`, `$ISIS_NET` = `49.0001.0010.0100.0017.00`, `$NODE_SID_V4` = `17`, `$NODE_SID_V6` = `117`
- `evo/protocols/l2circuit-hsb-hub-color-ignore-encap.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/0`, `$BACKUP_LOOPBACK` = `1.1.0.7`, `$PRIMARY_LOOPBACK` = `1.1.0.6`, `$UNIT` = `3001`, `$VC_ID_BACKUP` = `4001`, `$VC_ID_PRIMARY` = `3001`
- `evo/protocols/l2circuit-hsb-hub-color.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/0`, `$BACKUP_LOOPBACK` = `1.1.0.7`, `$PRIMARY_LOOPBACK` = `1.1.0.6`, `$UNIT` = `3000`, `$VC_ID_BACKUP` = `4000`, `$VC_ID_PRIMARY` = `3000`
- `evo/protocols/l2circuit-hsb-hub-ignore-encap.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/0`, `$BACKUP_LOOPBACK` = `1.1.0.7`, `$PRIMARY_LOOPBACK` = `1.1.0.6`, `$UNIT` = `3500`, `$VC_ID_BACKUP` = `4500`, `$VC_ID_PRIMARY` = `3500`
- `evo/protocols/l2circuit-hsb-pe-color.conf` on `meg2_acx7509` — `$AC_INTF` = `et-2/0/2`, `$HUB_LOOPBACK` = `1.1.0.2`, `$UNIT` = `3000`, `$VC_ID` = `4000`
- `evo/protocols/l2circuit-hsb-pe-primary-color.conf` on `meg1_acx7100-32c` — `$AC_INTF` = `et-0/0/26:3`, `$HUB_LOOPBACK` = `1.1.0.2`, `$UNIT` = `3000`, `$VC_ID` = `3000`
- `evo/protocols/l2circuit-hsb-pe-primary.conf` on `meg1_acx7100-32c` — `$AC_INTF` = `et-0/0/26:3`, `$HUB_LOOPBACK` = `1.1.0.2`, `$UNIT` = `3500`, `$VC_ID` = `3500`
- `evo/protocols/l2circuit-hsb-pe.conf` on `meg2_acx7509` — `$AC_INTF` = `et-2/0/2`, `$HUB_LOOPBACK` = `1.1.0.2`, `$UNIT` = `3500`, `$VC_ID` = `4500`
- `evo/protocols/l2circuit-lsw.conf` on `ma3_acx7100-48l` — `$AC_INTF_1` = `et-0/0/5`, `$AC_INTF_2` = `et-0/0/51`, `$UNIT_1` = `3000`, `$UNIT_2` = `4010`
- `evo/protocols/oam-cfm-perf-mon.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/0.2800`, `$MA_ID` = `100`, `$MD_NAME` = `MD_63535`, `$MEP_LOCAL` = `1002`, `$MEP_REMOTE` = `1003`
- `evo/routing-instances/evpn-elan/ri-evpn-elan-irb.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/50.2000`, `$BD_NAME` = `V4000`, `$INSTANCE_NAME` = `evpn_group_60_4000`, `$IRB_UNIT` = `irb.4000`, `$LOOPBACK_V4` = `1.1.0.2`, `$RD_SUB_ASSIGNED` = `14000`, `$RT_AS` = `61535`, `$RT_ID` = `14000`, `$VLAN_BD` = `4000`
- `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf` on `an3_acx7100-48l` — `$AC_INTF` = `ae11.700`, `$BD_NAME` = `BD_evpn_group_90_700`, `$INSTANCE_NAME` = `evpn_group_90_700`, `$LOOPBACK_V4` = `1.1.0.2`, `$RD_SUB_ASSIGNED` = `7000`, `$RT_AS` = `63535`, `$RT_ID` = `7000`, `$VLAN_BD` = `none`
- `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle-export.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/50.1000`, `$BD_NAME` = `BD_evpn_group_80_1000`, `$INSTANCE_NAME` = `evpn_group_80_1000`, `$LOOPBACK_V4` = `1.1.0.2`, `$RD_SUB_ASSIGNED` = `8000`, `$RT_AS` = `63535`, `$RT_ID` = `8000`
- `evo/routing-instances/evpn-elan/ri-evpn-port-based.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/11.0`, `$BD_NAME` = `v-2`, `$INSTANCE_NAME` = `EVPN_ELAN_PORT_BASED`, `$LOOPBACK_V4` = `1.1.0.2`, `$RD_SUB_ASSIGNED` = `5565`, `$RT_AS` = `63535`, `$RT_ID` = `6565`
- `evo/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-export.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/0`, `$INSTANCE_NAME` = `evpn_group_40_10`, `$LOOPBACK_V4` = `1.1.0.2`, `$RD_SUB_ASSIGNED` = `410`, `$RT_AS` = `63535`, `$RT_ID` = `410`, `$SVC_ID_LOCAL` = `1`, `$SVC_ID_REMOTE` = `2`, `$UNIT_A` = `1809`, `$UNIT_B` = `2309` _(1 of 2 equivalent bindings)_
- `evo/routing-instances/evpn-vpws/ri-evpn-fxc-3-uni-export.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/0`, `$INSTANCE_NAME` = `evpn_group_40_1`, `$LOOPBACK_V4` = `1.1.0.2`, `$RD_SUB_ASSIGNED` = `401`, `$RT_AS` = `63535`, `$RT_ID` = `401`, `$SVC_ID_LOCAL` = `1`, `$SVC_ID_REMOTE` = `2`, `$UNIT_A` = `1800`, `$UNIT_B` = `2300`, `$UNIT_C` = `800` _(1 of 6 equivalent bindings)_
- `evo/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni-export.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/0`, `$INSTANCE_NAME` = `evpn_group_40_100`, `$LOOPBACK_V4` = `1.1.0.2`, `$RD_SUB_ASSIGNED` = `500`, `$RT_AS` = `63535`, `$RT_ID` = `500`, `$SVC_ID_LOCAL` = `1`, `$SVC_ID_REMOTE` = `2`, `$UNIT_A` = `1899`, `$UNIT_B` = `2399`, `$UNIT_C` = `998`, `$UNIT_D` = `999` _(1 of 24 equivalent bindings)_
- `evo/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/0`, `$INSTANCE_NAME` = `evpn_group_40_251`, `$LOOPBACK_V4` = `1.1.0.2`, `$RD_SUB_ASSIGNED` = `651`, `$RT_AS` = `63535`, `$RT_ID` = `651`, `$SVC_ID_LOCAL` = `1`, `$SVC_ID_REMOTE` = `2`, `$UNIT_A` = `1300`, `$UNIT_B` = `1301`, `$UNIT_C` = `2050`, `$UNIT_D` = `2550` _(1 of 24 equivalent bindings)_
- `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni-export.conf` on `ma1-1_acx7024` — `$AC_INTF_A` = `ae12.200`, `$AC_INTF_B` = `ae12.250`, `$INSTANCE_NAME` = `evpn_group_50_1`, `$LOOPBACK_V4` = `1.1.0.17`, `$RD_SUB_ASSIGNED` = `501`, `$RT_AS` = `63536`, `$RT_ID` = `50100`, `$SVC_ID_LOCAL_A` = `2`, `$SVC_ID_LOCAL_B` = `22`, `$SVC_ID_REMOTE_A` = `1`, `$SVC_ID_REMOTE_B` = `11` _(1 of 2 equivalent bindings)_
- `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf` on `ma1-1_acx7024` — `$AC_INTF_A` = `ae12.225`, `$AC_INTF_B` = `ae12.275`, `$INSTANCE_NAME` = `evpn_group_50_26`, `$LOOPBACK_V4` = `1.1.0.17`, `$RD_SUB_ASSIGNED` = `526`, `$RT_AS` = `63536`, `$RT_ID` = `52600`, `$SVC_ID_LOCAL_A` = `2`, `$SVC_ID_LOCAL_B` = `22`, `$SVC_ID_REMOTE_A` = `1`, `$SVC_ID_REMOTE_B` = `11` _(1 of 2 equivalent bindings)_
- `evo/routing-instances/evpn-vpws/ri-evpn-vpws-export.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/50.3000`, `$INSTANCE_NAME` = `evpn_group_10_3000`, `$LOOPBACK_V4` = `1.1.0.2`, `$RD_SUB_ASSIGNED` = `3000`, `$RT_AS` = `63535`, `$RT_ID` = `3000`, `$VPWS_SVC_ID_LOCAL` = `1`, `$VPWS_SVC_ID_REMOTE` = `2`
- `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf` on `an1_mx204` — `$AC_INTF` = `ae11.2400`, `$INSTANCE_NAME` = `evpn_group_30_2400`, `$LOOPBACK_V4` = `1.1.0.0`, `$RD_SUB_ASSIGNED` = `2400`, `$RT_AS` = `63535`, `$RT_ID` = `2400`, `$VPWS_SVC_ID_LOCAL` = `1`, `$VPWS_SVC_ID_REMOTE` = `2`
- `evo/routing-instances/l2vpn/ri-l2vpn-kompella-vlan-control-word-export.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/50.350`, `$INSTANCE_NAME` = `l2vpn_group_105_350`, `$L2VPN_LOCAL_SITE_ID` = `1102`, `$L2VPN_REMOTE_SITE_ID` = `1119`, `$L2VPN_SITE` = `r2`, `$RD` = `63535:1092150`, `$RT` = `63535:1092150`
- `evo/routing-instances/l2vpn/ri-l2vpn-kompella-vlan-control-word.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/50.201`, `$INSTANCE_NAME` = `l2vpn_group_105_201`, `$L2VPN_LOCAL_SITE_ID` = `1102`, `$L2VPN_REMOTE_SITE_ID` = `1119`, `$L2VPN_SITE` = `r2`, `$RD` = `63535:1092001`, `$RT` = `63535:1092001`
- `evo/routing-instances/l2vpn/ri-l2vpn-kompella-vlan-export.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/50.300`, `$INSTANCE_NAME` = `l2vpn_group_105_300`, `$L2VPN_LOCAL_SITE_ID` = `1102`, `$L2VPN_REMOTE_SITE_ID` = `1119`, `$L2VPN_SITE` = `r2`, `$RD` = `63535:1092100`, `$RT` = `63535:1092100`
- `evo/routing-instances/l2vpn/ri-l2vpn-kompella-vlan.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/50.200`, `$INSTANCE_NAME` = `l2vpn_group_105_200`, `$L2VPN_LOCAL_SITE_ID` = `1102`, `$L2VPN_REMOTE_SITE_ID` = `1119`, `$L2VPN_SITE` = `r2`, `$RD` = `63535:1092000`, `$RT` = `63535:1092000`
- `evo/routing-instances/l2vpn/ri-l2vpn-kompella.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/8.0`, `$INSTANCE_NAME` = `L2VPN_PORT_BASED`, `$L2VPN_LOCAL_SITE_ID` = `1102`, `$L2VPN_REMOTE_SITE_ID` = `1119`, `$L2VPN_SITE` = `r2`, `$RD` = `63535:6500`, `$RT` = `63535:6500`
- `evo/routing-instances/l3vpn/ri-l3vpn-bgp-v6-vrf-policy-auto-export.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/4.2201`, `$AS_CUST` = `64514`, `$CE_PEER_V6` = `2001:0:0:0:13:3:0:2`, `$EXPORT_POL` = `PS-METRO_BGPv6_L3VPN_2201-EXPORT`, `$IMPORT_POL` = `PS-METRO_BGPv6_L3VPN_2201-IMPORT`, `$INSTANCE_NAME` = `METRO_BGPv6_L3VPN_2201`, `$PE_LOCAL_V6` = `2001:0:0:0:13:3:0:1`, `$RD` = `63535:2201`, `$ROUTER_ID` = `1.1.0.2`
- `evo/routing-instances/l3vpn/ri-l3vpn-bgp-v6-vrf-policy.conf` on `ma3_acx7100-48l` — `$AC_INTF` = `et-0/0/5.2201`, `$AS_CUST` = `64514`, `$CE_PEER_V6` = `2001:0:0:0:115:3:0:2`, `$EXPORT_POL` = `METRO_BGPv6_L3VPN_2201-EXPORT`, `$IMPORT_POL` = `METRO_BGPv6_L3VPN_2201-IMPORT`, `$INSTANCE_NAME` = `METRO_BGPv6_L3VPN_2201`, `$PE_LOCAL_V6` = `2001:0:0:0:115:3:0:1`, `$RD` = `63536:2201`, `$ROUTER_ID` = `1.1.0.15`
- `evo/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/4.2101`, `$AS_CUST` = `64514`, `$CE_PEER_V4` = `13.2.0.2`, `$EXPORT_POL` = `PS-METRO_BGPv4_L3VPN_2101-EXPORT`, `$IMPORT_POL` = `PS-METRO_BGPv4_L3VPN_2101-IMPORT`, `$INSTANCE_NAME` = `METRO_BGPv4_L3VPN_2101`, `$PE_LOCAL_V4` = `13.2.0.1`, `$RD` = `63535:2101`, `$ROUTER_ID` = `1.1.0.2`
- `evo/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy-rt.conf` on `meg1_acx7100-32c` — `$EXPORT_POL` = `PS-METRO_L3VPN_4000-EXPORT`, `$IMPORT_POL` = `PS-METRO_L3VPN_4000-IMPORT`, `$INSTANCE_NAME` = `METRO_L3VPN_4000`, `$IRB_UNIT` = `4000`, `$RD` = `61000:13000`, `$ROUTER_ID` = `1.1.0.6`, `$RT_AS` = `61535`, `$RT_ID` = `13000`
- `evo/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy.conf` on `an3_acx7100-48l` — `$EXPORT_POL` = `PS-METRO_L3VPN_4000-EXPORT`, `$IMPORT_POL` = `PS-METRO_L3VPN_4000-IMPORT`, `$INSTANCE_NAME` = `METRO_L3VPN_4000`, `$IRB_UNIT` = `4000`, `$RD` = `63000:13000`, `$ROUTER_ID` = `1.1.0.2`
- `evo/routing-instances/l3vpn/ri-l3vpn-irb.conf` on `meg1_acx7100-32c` — `$INSTANCE_NAME` = `METRO_L3VPN_4050`, `$IRB_UNIT` = `4050`, `$RD` = `64200:15000`, `$ROUTER_ID` = `1.1.0.6`, `$RT_AS` = `51535`, `$RT_ID` = `15000`
- `evo/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/4.2001`, `$EXPORT_POL` = `PS-METRO_L3VPN_2001-EXPORT`, `$IMPORT_POL` = `PS-METRO_L3VPN_2001-IMPORT`, `$INSTANCE_NAME` = `METRO_L3VPN_2001`, `$RD` = `63535:2001`, `$ROUTER_ID` = `1.1.0.2`
- `evo/routing-instances/l3vpn/ri-l3vpn-unequal-cost.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/50.4050`, `$INSTANCE_NAME` = `METRO_L3VPN_4050`, `$RD` = `64000:15000`, `$ROUTER_ID` = `1.1.0.2`, `$RT_AS` = `51535`, `$RT_ID` = `15000`
- `evo/routing-instances/vpls/ri-bgp-vpls-export.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/0.400`, `$BD_NAME` = `vlan400`, `$INSTANCE_NAME` = `vpls_group_102_400`, `$L2VPN_SITE` = `r2`, `$RD` = `63535:1093000`, `$RT_AS` = `63535`, `$RT_ID` = `1093000`, `$SITE_ID` = `1`
- `evo/routing-instances/vpls/ri-ldp-vpls.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/53.0`, `$BD_NAME` = `EPL-v0`, `$INSTANCE_NAME` = `KB-VPLS-EPL`, `$REMOTE_PE_V4` = `1.1.0.19`, `$VC_ID` = `30000`
- `evo/routing-options/forwarding-table.conf` on `ag1-1_acx7100-32c` — `$PPLB_NAME` = `PS-PPLB`
- `evo/routing-options/transport-class.conf` on `an1_mx204` — `$TC_EGRESS` = `1.1.0.0`
- `junos/class-of-service/interfaces/ifd-scheduler-map-shaping.conf` on `mse1_mx304` — `$COS_INTF` = `et-0/0/5`
- `junos/class-of-service/interfaces/ifd-scheduler-map.conf` on `ag1-1_acx7100-32c` — `$COS_INTF` = `ae23`
- `junos/class-of-service/interfaces/ifl-dscp-classifier-rewrite.conf` on `an3_acx7100-48l` — `$COS_INTF` = `et-0/0/4`, `$UNIT` = `2001`
- `junos/class-of-service/interfaces/ifl-exp-classifier-rewrite.conf` on `ag1-1_acx7100-32c` — `$COS_INTF` = `ae23`, `$UNIT` = `0`
- `junos/class-of-service/interfaces/ifl-forwarding-class-ieee8021p-rewrite.conf` on `an1_mx204` — `$COS_INTF` = `ae11`, `$FORWARDING_CLASS` = `REALTIME`, `$UNIT` = `2400`
- `junos/class-of-service/interfaces/ifl-ieee8021p-classifier-rewrite.conf` on `an1_mx204` — `$COS_INTF` = `ae11`, `$UNIT` = `700`
- `junos/interfaces/core-isis-mpls.conf` on `ag1-1_acx7100-32c` — `$CORE_DESC` = `"to AN1 rtme-mx-45 ae71"`, `$CORE_PHYS` = `ae71`, `$CORE_V4_ADDR` = `10.10.0.198/30`, `$CORE_V6_ADDR` = `2001::10:10:0:c6/126`
- `junos/interfaces/ethernet-bridge.conf` on `an3_acx7100-48l` — `$UNIT` = `1062`, `$UNI_INTF` = `et-0/0/50`, `$VLAN` = `1062`
- `junos/interfaces/ifd-ae-lacp-fast-disabled.conf` on `an2_acx5448` — `$IFD` = `ae11`, `$LACP_SYS_ID` = `00:00:00:00:00:01`
- `junos/interfaces/ifd-ae-lacp-fast.conf` on `an1_mx204` — `$IFD` = `ae11`, `$LACP_SYS_ID` = `00:00:00:00:00:01`
- `junos/interfaces/ifd-ae-lacp.conf` on `ma1-1_acx7024` — `$IFD` = `ae12`, `$LACP_SYS_ID` = `00:00:00:00:00:01`
- `junos/interfaces/ifd-ps-transport.conf` on `mse1_mx304` — `$ANCHOR_PIC` = `lt-0/0/0`, `$PS_INTF` = `ps0`
- `junos/interfaces/ifl-irb-inet.conf` on `an3_acx7100-48l` — `$IRB_ADDR` = `172.16.255.1/30`, `$UNIT` = `5000`
- `junos/interfaces/ifl-vlan-bridge-esi-df-preference.conf` on `an1_mx204` — `$ESI` = `00:70:11:11:11:11:11:00:00:01`, `$IFD` = `ae11`, `$UNIT` = `700`, `$VLAN` = `700`
- `junos/interfaces/ifl-vlan-bridge-esi-etree-root.conf` on `mse1_mx304` — `$ESI` = `00:10:11:11:11:80:01:00:00:01`, `$IFD` = `ae10`, `$UNIT` = `2000`, `$VLAN` = `2000`
- `junos/interfaces/ifl-vlan-bridge-esi.conf` on `an1_mx204` — `$ESI` = `00:70:11:11:11:11:11:00:00:02`, `$IFD` = `ae11`, `$UNIT` = `701`, `$VLAN` = `701`
- `junos/interfaces/ifl-vlan-bridge-etree-leaf.conf` on `ma4_mx204` — `$IFD` = `xe-0/1/4`, `$UNIT` = `2000`, `$VLAN` = `2000`
- `junos/interfaces/ifl-vlan-bridge-vlan-map-list.conf` on `ma5_mx204` — `$IFD` = `xe-0/1/4`, `$INPUT_VID` = `4000`, `$UNIT` = `1000`, `$VLAN_LIST` = `1000-1099`
- `junos/interfaces/ifl-vlan-ccc-esi.conf` on `an1_mx204` — `$ESI` = `00:10:11:11:11:11:01:00:00:00`, `$IFD` = `ae11`, `$UNIT` = `101`, `$VLAN` = `101`
- `junos/interfaces/ifl-vlan-ccc-vlan-map-esi.conf` on `an1_mx204` — `$ESI` = `00:10:11:11:30:11:01:00:00:00`, `$IFD` = `ae11`, `$INPUT_VID` = `3800`, `$UNIT` = `2400`, `$VLAN` = `2400`
- `junos/interfaces/ifl-vlan-ccc-vlan-map-filter.conf` on `an3_acx7100-48l` — `$IFD` = `et-0/0/0`, `$INPUT_VID` = `3200`, `$UNIT` = `2800`, `$VLAN` = `2800`
- `junos/interfaces/ifl-vlan-ccc.conf` on `an3_acx7100-48l` — `$IFD` = `et-0/0/0`, `$UNIT` = `1000`, `$VLAN` = `1000`
- `junos/interfaces/ifl-vlan-inet.conf` on `an3_acx7100-48l` — `$AC_ADDR_V4` = `13.1.0.1/30`, `$IFD` = `et-0/0/4`, `$UNIT` = `2001`, `$VLAN` = `2001`
- `junos/interfaces/ifl-vlan-inet6.conf` on `an3_acx7100-48l` — `$AC_ADDR_V6` = `2001:0:0:0:13:3:0:1/126`, `$IFD` = `et-0/0/4`, `$UNIT` = `2201`, `$VLAN` = `2201`
- `junos/interfaces/ifl-vlan-vpls-vlan-map.conf` on `ma5_mx204` — `$IFD` = `xe-0/1/4`, `$INPUT_VID` = `3500`, `$UNIT` = `400`, `$VLAN` = `400`
- `junos/policy-options/community/cm-access-fabric.conf` on `ag1-1_acx7100-32c` — `$FABRIC_COMMUNITY_AS` = `63535`
- `junos/policy-options/community/cm-inet-backup.conf` on `ag1-1_acx7100-32c` — `$RING_COMMUNITY_AS` = `63536`
- `junos/policy-options/community/cm-inet-default.conf` on `ag1-1_acx7100-32c` — `$RING_COMMUNITY_AS` = `63536`
- `junos/policy-options/community/cm-inet-primary.conf` on `ag1-1_acx7100-32c` — `$RING_COMMUNITY_AS` = `63536`
- `junos/policy-options/community/cm-l3vpn-bgpv4.conf` on `an3_acx7100-48l` — `$L3VPN_ID` = `2101`, `$RT_AS` = `63535`
- `junos/policy-options/community/cm-l3vpn-bgpv6.conf` on `an3_acx7100-48l` — `$L3VPN_ID` = `2201`, `$RT_AS` = `63535`
- `junos/policy-options/community/cm-l3vpn-pub.conf` on `ag1-1_acx7100-32c` — `$RING_COMMUNITY_AS` = `63536`
- `junos/policy-options/community/cm-l3vpn.conf` on `an3_acx7100-48l` — `$L3VPN_ID` = `2001`, `$RT_AS` = `63535`, `$RT_ID` = `2001`
- `junos/policy-options/community/cm-loopback.conf` on `ag1-1_acx7100-32c` — `$LOOPBACK_COMMUNITY` = `63535:10000`
- `junos/policy-options/community/cm-metro-fabric.conf` on `ag1-1_acx7100-32c` — `$FABRIC_COMMUNITY_AS` = `63535`
- `junos/policy-options/community/cm-metro-ring.conf` on `ag1-1_acx7100-32c` — `$RING_COMMUNITY_AS` = `63536`
- `junos/policy-options/community/cm-region-edge.conf` on `ag1-1_acx7100-32c` — `$RING_COMMUNITY_AS` = `63536`
- `junos/policy-options/community/cm-regional-border.conf` on `ag1-1_acx7100-32c` — `$FABRIC_COMMUNITY_AS` = `63535`
- `junos/policy-options/community/cm-service-edge.conf` on `ag1-1_acx7100-32c` — `$RING_COMMUNITY_AS` = `63536`
- `junos/policy-options/community/cm-service-rt.conf` on `an1_mx204` — `$INSTANCE_NAME` = `evpn_group_90_700`, `$RT_AS` = `63535`, `$RT_ID` = `7000`
- `junos/policy-options/community/cm-tc-map2bronze.conf` on `an1_mx204` — `$COLOR_COMMUNITY` = `map2bronze`
- `junos/policy-options/community/cm-tc-map2gold.conf` on `an1_mx204` — `$COLOR_COMMUNITY` = `map2gold`
- `junos/policy-options/policy-statement/loopback-rib-leak.conf` on `an1_mx204` — `$LOOPBACK_SUPERNET` = `1.1.0.0/16`
- `junos/policy-options/policy-statement/per-packet-load-balance.conf` on `ag1-1_acx7100-32c` — `$PPLB_NAME` = `PS-PPLB`
- `junos/policy-options/policy-statement/ps-export-l2-color.conf` on `an1_mx204` — `$COLOR_COMMUNITY` = `map2gold`, `$INSTANCE_NAME` = `evpn_group_90_700`
- `junos/policy-options/policy-statement/ps-export-l3vpn-nlri-rt5-public.conf` on `mse2_mx304` — `$CE_PREFIX_1` = `40.2.0.0/16`, `$CE_PREFIX_2` = `41.2.0.0/16`, `$CE_PREFIX_3` = `43.2.0.0/16`, `$CE_PREFIX_4` = `44.2.0.0/16`, `$EXPORT_POL` = `PS-METRO_L3VPN_4000-EXPORT`, `$INSTANCE_NAME` = `METRO_L3VPN_4000` _(1 of 24 equivalent bindings)_
- `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-2.conf` on `an3_acx7100-48l` — `$CE_PREFIX_1` = `13.1.0.0/16`, `$CE_PREFIX_2` = `15.1.0.0/16`, `$EXPORT_POL` = `PS-METRO_L3VPN_2002-EXPORT`, `$INSTANCE_NAME` = `METRO_L3VPN_2002` _(1 of 2 equivalent bindings)_
- `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3-color.conf` on `ma4_mx204` — `$CE_PREFIX_1` = `17.2.0.0/16`, `$CE_PREFIX_2` = `18.2.0.0/16`, `$CE_PREFIX_3` = `19.2.0.0/16`, `$EXPORT_POL` = `METRO_BGPv4_L3VPN_1001-EXPORT`, `$INSTANCE_NAME` = `METRO_BGPv4_L3VPN_1001` _(1 of 6 equivalent bindings)_
- `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf` on `an3_acx7100-48l` — `$CE_PREFIX_1` = `13.2.0.0/16`, `$CE_PREFIX_2` = `15.2.0.0/16`, `$CE_PREFIX_3` = `16.2.0.0/16`, `$EXPORT_POL` = `PS-METRO_BGPv4_L3VPN_2101-EXPORT`, `$INSTANCE_NAME` = `METRO_BGPv4_L3VPN_2101` _(1 of 6 equivalent bindings)_
- `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf` on `an3_acx7100-48l` — `$CE_PREFIX_1` = `115.1.0.0/16`, `$CE_PREFIX_2` = `13.1.0.0/16`, `$CE_PREFIX_3` = `15.1.0.0/16`, `$CE_PREFIX_4` = `16.1.0.0/16`, `$EXPORT_POL` = `PS-METRO_L3VPN_2001-EXPORT`, `$INSTANCE_NAME` = `METRO_L3VPN_2001` _(1 of 24 equivalent bindings)_
- `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf` on `an3_acx7100-48l` — `$CE_PREFIX_1` = `2001::13:3:0:0/64`, `$CE_PREFIX_2` = `2001::16:3:0:0/64`, `$EXPORT_POL` = `PS-METRO_BGPv6_L3VPN_2202-EXPORT`, `$INSTANCE_NAME` = `METRO_BGPv6_L3VPN_2202` _(1 of 2 equivalent bindings)_
- `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-3.conf` on `ma4_mx204` — `$CE_PREFIX_1` = `2001::17:3:0:0/126`, `$CE_PREFIX_2` = `2001::18:3:0:0/64`, `$CE_PREFIX_3` = `2001::19:3:0:0/64`, `$EXPORT_POL` = `METRO_BGPv6_L3VPN_3001-EXPORT`, `$INSTANCE_NAME` = `METRO_BGPv6_L3VPN_3001` _(1 of 6 equivalent bindings)_
- `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf` on `an3_acx7100-48l` — `$CE_PREFIX_1` = `2001::115:3:0:0/64`, `$CE_PREFIX_2` = `2001::13:3:0:0/64`, `$CE_PREFIX_3` = `2001::15:3:0:0/64`, `$CE_PREFIX_4` = `2001::16:3:0:0/64`, `$EXPORT_POL` = `PS-METRO_BGPv6_L3VPN_2201-EXPORT`, `$INSTANCE_NAME` = `METRO_BGPv6_L3VPN_2201` _(1 of 24 equivalent bindings)_
- `junos/policy-options/policy-statement/ps-export-l3vpn-public-v6-default-route.conf` on `mse2_mx304` — `$CE_PREFIX_1` = `2001::17:3:0:0/126`, `$CE_PREFIX_2` = `2001::18:3:0:0/64`, `$CE_PREFIX_3` = `2001::19:3:0:0/64`, `$EXPORT_POL` = `METRO_BGPv6_L3VPN_3001-EXPORT`, `$INSTANCE_NAME` = `METRO_BGPv6_L3VPN_3001` _(1 of 6 equivalent bindings)_
- `junos/policy-options/policy-statement/ps-export-l3vpn-public.conf` on `an3_acx7100-48l` — `$CE_PREFIX_1` = `40.2.0.0/16`, `$CE_PREFIX_2` = `41.2.0.0/16`, `$CE_PREFIX_3` = `43.2.0.0/16`, `$CE_PREFIX_4` = `44.2.0.0/16`, `$EXPORT_POL` = `PS-METRO_L3VPN_4000-EXPORT`, `$INSTANCE_NAME` = `METRO_L3VPN_4000` _(1 of 24 equivalent bindings)_
- `junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf` on `mse1_mx304` — `$LOOPBACK_ANYCAST_V4` = `1.1.0.10`, `$LOOPBACK_V4` = `1.1.10.10` _(1 of 2 equivalent bindings)_
- `junos/policy-options/policy-statement/ps-import-l3vpn-internet.conf` on `an3_acx7100-48l` — `$IMPORT_POL` = `PS-METRO_BGPv4_L3VPN_2101-IMPORT`, `$INSTANCE_NAME` = `METRO_BGPv4_L3VPN_2101`
- `junos/policy-options/policy-statement/ps-import-l3vpn.conf` on `an3_acx7100-48l` — `$IMPORT_POL` = `PS-METRO_L3VPN_4000-IMPORT`, `$INSTANCE_NAME` = `METRO_L3VPN_4000`
- `junos/protocols/bgp-overlay.conf` on `an1_mx204` — `$LOOPBACK_V4` = `1.1.0.0`, `$RR1_V4` = `1.1.0.6`, `$RR2_V4` = `1.1.0.7` _(1 of 2 equivalent bindings)_
- `junos/protocols/isis-srmpls-tilfa.conf` on `an1_mx204` — `$CORE_INTF_1` = `ae71.0`, `$CORE_INTF_2` = `ae72.0`, `$NODE_SID_V4` = `0`, `$NODE_SID_V6` = `100` _(1 of 2 equivalent bindings)_
- `junos/protocols/l2circuit-floating-pw-color.conf` on `mse1_mx304` — `$COLOR_COMMUNITY` = `map2gold`, `$LABEL_IN` = `1000001`, `$LABEL_OUT` = `1000001`, `$PS_INTF` = `ps0`, `$REMOTE_PE_V4` = `1.1.0.18`, `$VC_ID` = `1001`
- `junos/protocols/l2circuit-floating-pw.conf` on `mse1_mx304` — `$LABEL_IN` = `1000002`, `$LABEL_OUT` = `1000002`, `$PS_INTF` = `ps1`, `$REMOTE_PE_V4` = `1.1.0.18`, `$VC_ID` = `1010`
- `junos/protocols/oam-cfm-perf-mon.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/0.400`, `$MA_ID` = `1100`, `$MD_NAME` = `MD_63535`, `$MEP_LOCAL` = `1002`, `$MEP_REMOTE_1` = `1006`, `$MEP_REMOTE_2` = `1019` _(1 of 2 equivalent bindings)_
- `junos/routing-instances/evpn-elan/ri-evpn-elan-irb.conf` on `mse1_mx304` — `$AC_INTF` = `xe-0/0/3:1`, `$BD_NAME` = `BD_evpn_group_60_4000`, `$INSTANCE_NAME` = `evpn_group_60_4000`, `$IRB_UNIT` = `4000`, `$LOOPBACK_V4` = `1.1.0.10`, `$RD_SUB_ASSIGNED` = `14000`, `$RT_AS` = `61535`, `$RT_ID` = `14000`, `$UNIT` = `3000`, `$VLAN` = `3000`
- `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf` on `an1_mx204` — `$AC_INTF` = `ae11.701`, `$INSTANCE_NAME` = `evpn_group_90_701`, `$LOOPBACK_V4` = `1.1.0.0`, `$RD_SUB_ASSIGNED` = `7001`, `$RT_AS` = `63535`, `$RT_ID` = `7001`
- `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based.conf` on `an1_mx204` — `$AC_INTF` = `ae11`, `$INSTANCE_NAME` = `evpn_group_90_750`, `$LOOPBACK_V4` = `1.1.0.0`, `$RD_SUB_ASSIGNED` = `7050`, `$RT_AS` = `63535`, `$RT_ID` = `7050`, `$VLAN_UNIT` = `750`
- `junos/routing-instances/evpn-elan/ri-evpn-floating-pw.conf` on `mse1_mx304` — `$AC_INTF` = `ae10.300`, `$INSTANCE_NAME` = `300-evpn-floating-pw`, `$LOOPBACK_V4` = `1.1.0.10`, `$PS_INTF` = `ps0.300`, `$RD_SUB_ASSIGNED` = `300`, `$RT_AS` = `300`, `$RT_ID` = `300`, `$VLAN` = `300` _(1 of 2 equivalent bindings)_
- `junos/routing-instances/evpn-etree/ri-evpn-etree-export.conf` on `ma4_mx204` — `$AC_INTF` = `xe-0/1/4`, `$INSTANCE_NAME` = `evpn_group_80_1`, `$LOOPBACK_V4` = `1.1.0.16`, `$RD_SUB_ASSIGNED` = `8001`, `$RT_AS` = `63536`, `$RT_ID` = `8001`, `$UNIT` = `2000`, `$VLAN` = `2000`
- `junos/routing-instances/evpn-etree/ri-evpn-etree.conf` on `ma4_mx204` — `$AC_INTF` = `xe-0/1/4`, `$INSTANCE_NAME` = `evpn_group_80_1000`, `$LOOPBACK_V4` = `1.1.0.16`, `$RD_SUB_ASSIGNED` = `9000`, `$RT_AS` = `63536`, `$RT_ID` = `9000`, `$UNIT` = `2999`, `$VLAN` = `2999`
- `junos/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-export.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/0`, `$INSTANCE_NAME` = `evpn_group_40_10`, `$LOOPBACK_V4` = `1.1.0.2`, `$RD_SUB_ASSIGNED` = `410`, `$RT_AS` = `63535`, `$RT_ID` = `410`, `$SVC_ID_LOCAL` = `1`, `$SVC_ID_REMOTE` = `2`, `$UNIT_A` = `1809`, `$UNIT_B` = `2309` _(1 of 2 equivalent bindings)_
- `junos/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni-export.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/0`, `$INSTANCE_NAME` = `evpn_group_40_100`, `$LOOPBACK_V4` = `1.1.0.2`, `$RD_SUB_ASSIGNED` = `500`, `$RT_AS` = `63535`, `$RT_ID` = `500`, `$SVC_ID_LOCAL` = `1`, `$SVC_ID_REMOTE` = `2`, `$UNIT_A` = `1899`, `$UNIT_B` = `2399`, `$UNIT_C` = `998`, `$UNIT_D` = `999` _(1 of 24 equivalent bindings)_
- `junos/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/0`, `$INSTANCE_NAME` = `evpn_group_40_251`, `$LOOPBACK_V4` = `1.1.0.2`, `$RD_SUB_ASSIGNED` = `651`, `$RT_AS` = `63535`, `$RT_ID` = `651`, `$SVC_ID_LOCAL` = `1`, `$SVC_ID_REMOTE` = `2`, `$UNIT_A` = `1300`, `$UNIT_B` = `1301`, `$UNIT_C` = `2050`, `$UNIT_D` = `2550` _(1 of 24 equivalent bindings)_
- `junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf` on `an1_mx204` — `$AC_INTF` = `ae11.2400`, `$INSTANCE_NAME` = `evpn_group_30_2400`, `$LOOPBACK_V4` = `1.1.0.0`, `$RD_SUB_ASSIGNED` = `2400`, `$RT_AS` = `63535`, `$RT_ID` = `2400`, `$VPWS_SVC_ID_LOCAL` = `1`, `$VPWS_SVC_ID_REMOTE` = `2`
- `junos/routing-instances/l2vpn/ri-l2vpn-kompella-vlan-control-word-export.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/50.350`, `$INSTANCE_NAME` = `l2vpn_group_105_350`, `$L2VPN_LOCAL_SITE_ID` = `1102`, `$L2VPN_REMOTE_SITE_ID` = `1119`, `$L2VPN_SITE` = `r2`, `$RD` = `63535:1092150`, `$RT` = `63535:1092150`
- `junos/routing-instances/l2vpn/ri-l2vpn-kompella-vlan-control-word.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/50.201`, `$INSTANCE_NAME` = `l2vpn_group_105_201`, `$L2VPN_LOCAL_SITE_ID` = `1102`, `$L2VPN_REMOTE_SITE_ID` = `1119`, `$L2VPN_SITE` = `r2`, `$RD` = `63535:1092001`, `$RT` = `63535:1092001`
- `junos/routing-instances/l2vpn/ri-l2vpn-kompella-vlan-export.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/50.300`, `$INSTANCE_NAME` = `l2vpn_group_105_300`, `$L2VPN_LOCAL_SITE_ID` = `1102`, `$L2VPN_REMOTE_SITE_ID` = `1119`, `$L2VPN_SITE` = `r2`, `$RD` = `63535:1092100`, `$RT` = `63535:1092100`
- `junos/routing-instances/l2vpn/ri-l2vpn-kompella-vlan.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/50.200`, `$INSTANCE_NAME` = `l2vpn_group_105_200`, `$L2VPN_LOCAL_SITE_ID` = `1102`, `$L2VPN_REMOTE_SITE_ID` = `1119`, `$L2VPN_SITE` = `r2`, `$RD` = `63535:1092000`, `$RT` = `63535:1092000`
- `junos/routing-instances/l2vpn/ri-l2vpn-kompella.conf` on `ma5_mx204` — `$AC_INTF` = `xe-0/1/2.0`, `$INSTANCE_NAME` = `L2VPN_PORT_BASED`, `$L2VPN_LOCAL_SITE_ID` = `1119`, `$L2VPN_REMOTE_SITE_ID` = `1102`, `$L2VPN_SITE` = `r19`, `$RD` = `60535:8500`, `$RT` = `63535:6500`
- `junos/routing-instances/l3vpn/ri-internet-vrf-export.conf` on `mse2_mx304` — `$AC_INTF` = `xe-0/0/15:2.2001`, `$AS_CUST` = `64514`, `$CE_PEER_V4` = `22.2.0.2`, `$CE_PEER_V6` = `2001::22:2:0:2`, `$EXPORT_POL` = `INET-VRF-DEFAULT_1`, `$INSTANCE_NAME` = `INTERNET-VRF`, `$PE_LOCAL_V4` = `22.2.0.1`, `$PE_LOCAL_V6` = `2001::22:2:0:1`, `$RD` = `1.1.0.11:63536`, `$ROUTER_ID` = `1.1.0.11`, `$RT_AS` = `63536`, `$RT_ID` = `22222`
- `junos/routing-instances/l3vpn/ri-l3vpn-bgp-v6-vrf-policy-auto-export.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/4.2201`, `$AS_CUST` = `64514`, `$CE_PEER_V6` = `2001:0:0:0:13:3:0:2`, `$EXPORT_POL` = `PS-METRO_BGPv6_L3VPN_2201-EXPORT`, `$IMPORT_POL` = `PS-METRO_BGPv6_L3VPN_2201-IMPORT`, `$INSTANCE_NAME` = `METRO_BGPv6_L3VPN_2201`, `$PE_LOCAL_V6` = `2001:0:0:0:13:3:0:1`, `$RD` = `63535:2201`, `$ROUTER_ID` = `1.1.0.2`
- `junos/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy-auto-export.conf` on `mse1_mx304` — `$AC_INTF` = `et-0/0/5.1001`, `$AS_CUST` = `64514`, `$CE_PEER_V4` = `19.2.0.2`, `$EXPORT_POL` = `METRO_BGPv4_L3VPN_1001-EXPORT`, `$IMPORT_POL` = `METRO_BGPv4_L3VPN_1001-IMPORT`, `$INSTANCE_NAME` = `METRO_BGPv4_L3VPN_1001`, `$PE_LOCAL_V4` = `19.2.0.1`, `$RD` = `63536:11001`, `$ROUTER_ID` = `1.1.0.10`
- `junos/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy-next-table.conf` on `mse2_mx304` — `$EXPORT_POL` = `PS-METRO_L3VPN_4000-EXPORT`, `$IMPORT_POL` = `PS-METRO_L3VPN_4000-IMPORT`, `$INSTANCE_NAME` = `METRO_L3VPN_4000`, `$IRB_UNIT` = `4000`, `$RD` = `63300:13000`, `$ROUTER_ID` = `1.1.0.11`
- `junos/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy.conf` on `an3_acx7100-48l` — `$EXPORT_POL` = `PS-METRO_L3VPN_4000-EXPORT`, `$IMPORT_POL` = `PS-METRO_L3VPN_4000-IMPORT`, `$INSTANCE_NAME` = `METRO_L3VPN_4000`, `$IRB_UNIT` = `4000`, `$RD` = `63000:13000`, `$ROUTER_ID` = `1.1.0.2`
- `junos/routing-instances/l3vpn/ri-l3vpn-irb.conf` on `meg1_acx7100-32c` — `$INSTANCE_NAME` = `METRO_L3VPN_4050`, `$IRB_UNIT` = `4050`, `$RD` = `64200:15000`, `$ROUTER_ID` = `1.1.0.6`, `$RT_AS` = `51535`, `$RT_ID` = `15000`
- `junos/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf` on `an3_acx7100-48l` — `$AC_INTF` = `et-0/0/4.2001`, `$EXPORT_POL` = `PS-METRO_L3VPN_2001-EXPORT`, `$IMPORT_POL` = `PS-METRO_L3VPN_2001-IMPORT`, `$INSTANCE_NAME` = `METRO_L3VPN_2001`, `$RD` = `63535:2001`, `$ROUTER_ID` = `1.1.0.2`
- `junos/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy.conf` on `ma4_mx204` — `$AC_INTF` = `xe-0/1/4.1`, `$EXPORT_POL` = `METRO_L3VPN_1-EXPORT`, `$IMPORT_POL` = `METRO_L3VPN_1-IMPORT`, `$INSTANCE_NAME` = `METRO_L3VPN_1`, `$RD` = `63536:41`, `$ROUTER_ID` = `1.1.0.16`
- `junos/routing-instances/vpls/ri-bgp-vpls-export.conf` on `ma5_mx204` — `$AC_INTF` = `xe-0/1/4.800`, `$BD_NAME` = `vlan800`, `$INSTANCE_NAME` = `vpls_group_108_800`, `$L2VPN_SITE` = `r19`, `$RD` = `64535:81000`, `$RT` = `64535:1183000`, `$SITE_ID` = `3`, `$VLAN_BD` = `800`
- `junos/routing-instances/vpls/ri-bgp-vpls-site-range-export.conf` on `ma5_mx204` — `$AC_INTF` = `xe-0/1/4.400`, `$INSTANCE_NAME` = `vpls_group_102_400`, `$LABEL_BLOCK_SIZE` = `8`, `$RD` = `63536:1093000`, `$RT` = `63535:1093000`, `$SITE_RANGE` = `10`, `$VPLS_SITE` = `r19`, `$VPLS_SITE_ID` = `3`
- `junos/routing-instances/vpls/ri-bgp-vpls-site-range.conf` on `ma5_mx204` — `$AC_INTF` = `xe-0/1/4.500`, `$INSTANCE_NAME` = `vpls_group_102_500`, `$LABEL_BLOCK_SIZE` = `8`, `$RD` = `63536:1093100`, `$RT` = `63535:1093100`, `$SITE_RANGE` = `10`, `$VPLS_SITE` = `r19`, `$VPLS_SITE_ID` = `3`
- `junos/routing-options/forwarding-table.conf` on `mse1_mx304` — `$PPLB_NAME` = `pplb`
- `junos/routing-options/transport-class.conf` on `an1_mx204` — `$TC_EGRESS` = `1.1.0.0`
