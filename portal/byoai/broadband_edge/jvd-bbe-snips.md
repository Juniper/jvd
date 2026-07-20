# JVD Metro Fabric and Broadband Edge snippet library

## evo/interfaces/ae-vlan-bridge-an.conf

```
/*
 * Topic:   AN access LAG with vlan-ccc subscriber units and EVPN ESI multihoming
 * Seen on:
 *   EVO: an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l
 *
 * Highlights:
 *  - Two LAG personalities live on each AN:
 *      * ae0 carries FXC bundles (PPPoE/IPoE FXC groups) and gets a
 *        SHARED ESI (00:15:15:15:00:00:00:15:15:15) at the LAG level
 *        with df-election-granularity per-esi + lacp-oos-on-ndf — the
 *        non-DF AN puts LACP out-of-sync so the SW only forwards on
 *        the DF link.
 *      * ae1 carries per-subscriber-group EVPN-VPWS units. Each
 *        unit (e.g. 1031) carries its OWN per-unit ESI
 *        (00:10:11:11:11:11:11:00:00:31) with `all-active` so two ANs
 *        can actively load-balance per-flow.
 *  - encapsulation flexible-ethernet-services + per-unit
 *    encapsulation vlan-ccc family ccc is the L2 VPN AC shape used
 *    by EVPN-VPWS (CCC = circuit cross-connect).
 *  - aggregated-ether-options system-id 00:00:00:00:0X:0X is
 *    overridden so both AN's LAG members appear to the SW as the
 *    same LAG endpoint (required for ESI multihoming to a non-EVPN
 *    aware switch).
 *  - mtu 9102 matches the JVD jumbo baseline.
 *
 * Pair with:
 *  - evo/services/evpn-vpws-an.conf
 *  - evo/services/evpn-vpws-fxc-an.conf
 *
 * Variables (example values from an1_acx7024):
 *   $LAG_FXC              e.g. ae0
 *   $LAG_PERSUB           e.g. ae1
 *   $FXC_ESI              e.g. 00:15:15:15:00:00:00:15:15:15
 *   $LACP_SYSID_FXC       e.g. 00:00:00:00:01:01
 *   $LACP_SYSID_PERSUB    e.g. 00:00:00:00:02:02
 *   $FXC_VLAN_UNIT        e.g. 1061
 *   $PERSUB_VLAN_UNIT     e.g. 1031
 *   $PERSUB_ESI_VALUE     e.g. 00:10:11:11:11:11:11:00:00:31
 */
interfaces {
    $LAG_FXC {
        flexible-vlan-tagging;
        mtu 9102;
        encapsulation flexible-ethernet-services;
        esi {
            $FXC_ESI;
            single-active;
            df-election-granularity {
                per-esi {
                    lacp-oos-on-ndf;
                }
            }
        }
        aggregated-ether-options {
            lacp {
                active;
                periodic fast;
                system-id $LACP_SYSID_FXC;
            }
        }
        unit $FXC_VLAN_UNIT {
            encapsulation vlan-ccc;
            vlan-id $FXC_VLAN_UNIT;
            family ccc;
        }
    }
    $LAG_PERSUB {
        flexible-vlan-tagging;
        mtu 9102;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            lacp {
                active;
                periodic fast;
                system-id $LACP_SYSID_PERSUB;
            }
        }
        unit $PERSUB_VLAN_UNIT {
            encapsulation vlan-ccc;
            vlan-id $PERSUB_VLAN_UNIT;
            esi {
                $PERSUB_ESI_VALUE;
                all-active;
            }
            family ccc;
        }
    }
}
```

## evo/interfaces/core-isis-mpls.conf

```
/*
 * Topic:   Core-facing interface for ISIS underlay (inet/iso/inet6/mpls, max-labels 16)
 * Seen on:
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 *
 * Highlights:
 *  - Same shape as the Junos sibling. ACX7000/PTX10004 EVO accepts
 *    family iso + family mpls maximum-labels 16 identically.
 *  - cr1's core-facing ports add `speed 100g` because the PTX10004
 *    et-0/0/0 etc. require explicit speed when used as 100G uplinks.
 *  - On the AGN/CR units carrying inter-area L2 traffic (cr1
 *    et-0/0/18, ae1) the family stack is the same; only the ISIS
 *    `level 2` knob changes (see isis-srmpls-tilfa.conf).
 *
 * Pair with:
 *  - evo/transport/isis-srmpls-tilfa.conf
 *  - evo/transport/mpls-segment-routing.conf
 *
 * Variables (example values from agn1_acx7100-32c, et-0/0/0):
 *   $CORE_PHYS         e.g. et-0/0/0
 *   $CORE_DESC         e.g. R5-AGN1-To-R1-AN2
 *   $CORE_V4           e.g. 10.10.15.2/24
 *   $CORE_V6           e.g. 2001:db8::10:10:15:1:2/120
 */
interfaces {
    $CORE_PHYS {
        description $CORE_DESC;
        unit 0 {
            family inet {
                address $CORE_V4;
            }
            family iso;
            family inet6 {
                address $CORE_V6;
            }
            family mpls {
                maximum-labels 16;
            }
        }
    }
}
```

## evo/policy/bgp-rr-export.conf

```
/*
 * Topic:   Route-reflector export policies (next-hop-self for core, transparent for clients)
 * Seen on:
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c cr1_ptx10004
 *
 * Highlights:
 *  - PL-AN-REGION holds the AN loopbacks (192.168.0.0..0.4) plus the
 *    BNG loopbacks (.7,.8) on cr1 — the prefix set treated as
 *    "client" loopbacks by the RRs.
 *  - PL-CORE differs per RR: agn1/agn2 use {.7,.8,.11} (BNGs + cr1),
 *    cr1 uses {.9,.10} (the second BNG cluster). The PL-CORE-listed
 *    prefixes are the ones whose next-hop the RR rewrites to itself
 *    via PS-BGP-RR-EXPORT — useful for hierarchical RR designs.
 *  - PS-BGP-RR-EXPORT: from PL-CORE; then next-hop self; accept.
 *    Applied on the upstream-facing RR group.
 *  - PS-CLIENT-RR-EXPORT: from PL-AN-REGION; then accept (NO next-hop
 *    rewrite). Applied on the downstream-client RR group so the
 *    actual PE-of-origin loopback survives reflection — required for
 *    chained-composite-next-hop on the receiving PEs.
 *
 * Pair with:
 *  - evo/transport/bgp-overlay-rr-fabric.conf
 *  - evo/transport/bgp-overlay-rr-core.conf
 *
 * Variables (example values from cr1_ptx10004):
 *   $PL_AN_REGION_LIST   e.g. 192.168.0.0..0.4 + 192.168.0.7..0.8
 *   $PL_CORE_LIST        e.g. 192.168.0.9 192.168.0.10
 */
policy-options {
    prefix-list PL-AN-REGION {
        $PL_AN_REGION_LIST;
    }
    prefix-list PL-CORE {
        $PL_CORE_LIST;
    }
    policy-statement PS-BGP-RR-EXPORT {
        term CORE-NHS {
            from {
                prefix-list PL-CORE;
            }
            then {
                next-hop self;
                accept;
            }
        }
    }
    policy-statement PS-CLIENT-RR-EXPORT {
        term LOOPBACKS {
            from {
                prefix-list PL-AN-REGION;
            }
            then accept;
        }
    }
}
```

## evo/policy/communities.conf

```
/*
 * Topic:   BBE community palette (subscriber, RADIUS, Internet)
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO:   cr1_ptx10004
 *
 * Highlights:
 *  - Identical to the Junos sibling — the EVO config carries the exact
 *    same six communities. Keeping them in sync across all PEs is
 *    mandatory because import/export policies match by literal
 *    target value, not by community name.
 *
 * Pair with:
 *  - evo/policy/vrf-internet-policies.conf
 *  - evo/policy/vrf-radius-policies.conf
 *  - evo/services/l3vpn-internet.conf
 *
 * Variables: (none)
 */
policy-options {
    community PPPOE_SUBS_COMM_1 members target:20000:1031;
    community PPPOE_SUBS_COMM_2 members target:20000:1032;
    community PS-DHCPSUBS-COMM members target:65000:1131;
    community PS-DHCPSUBS-COMM_2 members target:65000:1132;
    community PS-Internet-COMM members target:100:1;
    community PS-RADIUS-COMM members target:11111:1111;
}
```

## evo/policy/isis-export-prefix-segment.conf

```
/*
 * Topic:   ISIS export policy mapping each loopback to a unique SR prefix-segment
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO:   agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 *
 * Highlights:
 *  - Identical to the Junos sibling — EVO's policy syntax is unchanged
 *    for ISIS prefix-segment + node-segment.
 *  - Each EVO PE gets its own (last-octet)-based SID:
 *      an1=1000/4000  an2=1001/4001  an3=1002/4002  an4=1003/4003
 *      an5=1004/4004  agn1=1005/4005 agn2=1006/4006 cr1=1011/4011
 *  - On cr1, this policy is applied alongside `stop_leak`
 *    (see isis-srmpls-tilfa.conf `export [ PS-ISIS-EXPORT stop_leak ]`)
 *    to prevent L1 → L2 leakage at the area boundary.
 *
 * Pair with:
 *  - evo/transport/isis-srmpls-tilfa.conf
 *  - evo/transport/mpls-segment-routing.conf
 *
 * Variables (example values from agn1_acx7100-32c):
 *   $LOOPBACK_V4    e.g. 192.168.0.5
 *   $LOOPBACK_V6    e.g. 2001:db8::192:168:0:5
 *   $NODE_SID_V4    e.g. 1005
 *   $NODE_SID_V6    e.g. 4005
 */
policy-options {
    policy-statement PS-ISIS-EXPORT {
        term OOB-MGMT {
            from interface [ em0.0 fxp0.0 re0:mgmt-0.0 ];
            then reject;
        }
        term LOCAL-LOOPBACK-IPV4 {
            from {
                protocol direct;
                interface lo0.0;
                route-filter $LOOPBACK_V4/32 exact;
            }
            then {
                prefix-segment {
                    index $NODE_SID_V4;
                    node-segment;
                }
                accept;
            }
        }
        term LOCAL-LOOPBACK-IPV6 {
            from {
                protocol direct;
                interface lo0.0;
                route-filter $LOOPBACK_V6/128 exact;
            }
            then {
                prefix-segment {
                    index $NODE_SID_V6;
                    node-segment;
                }
                accept;
            }
        }
    }
}
```

## evo/policy/pplb.conf

```
/*
 * Topic:   Per-packet load-balance forwarding-table policy
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO:   agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 *
 * Highlights:
 *  - Identical to the Junos sibling. On EVO the same `load-balance
 *    per-packet` knob enables FIB-level ECMP installation; behaviour
 *    is per-flow hash, not literal per-packet.
 *
 * Pair with:
 *  - evo/transport/routing-options-pe.conf
 *
 * Variables: (none)
 */
policy-options {
    policy-statement PS-PPLB {
        then {
            load-balance per-packet;
            accept;
        }
    }
}
```

## evo/policy/vrf-internet-policies.conf

```
/*
 * Topic:   VRF_Internet import/export with default-route advertisement and v6 leak
 * Seen on:
 *   EVO: cr1_ptx10004
 *
 * Highlights:
 *  - VRF_Internet_export advertises ONLY the default route in both
 *    AFs (0.0.0.0/0 and ::/0) and rewrites next-hop to cr1's loopback
 *    so subscriber VRFs install a default toward cr1. Both terms tag
 *    with PS-Internet-COMM (target:100:1).
 *  - VRF_Internet_import accepts:
 *      * PS-Internet-COMM (Internet routes from peer Internet PEs),
 *      * PPPOE_SUBS_COMM_2 (PPPoE subscriber aggregates), and
 *      * PS-DHCPSUBS-COMM_2 (DHCP subscriber aggregates),
 *    so cr1 can route Internet → subscriber return traffic.
 *  - PS-V6-default leaks a v6 default route from VRF_Internet to the
 *    main IPv6 table, tagged PS-Internet-COMM, with cr1's IPv6
 *    loopback as next-hop. Used as a route-export under bgp.
 *  - stop_leak (term level 1; to level 2; reject) prevents L1 → L2
 *    redistribution at the L1/L2 area boundary on cr1 — applied
 *    alongside PS-ISIS-EXPORT (see isis-srmpls-tilfa.conf).
 *
 * Pair with:
 *  - evo/services/l3vpn-internet.conf
 *  - evo/policy/communities.conf
 *  - evo/transport/isis-srmpls-tilfa.conf
 *
 * Variables (example values from cr1_ptx10004):
 *   $LOOPBACK_V4   e.g. 192.168.0.11
 *   $LOOPBACK_V6   e.g. 2001:db8::192:168:0:b
 */
policy-options {
    policy-statement VRF_Internet_export {
        term 1 {
            from {
                route-filter 0.0.0.0/0 exact;
            }
            then {
                community add PS-Internet-COMM;
                next-hop $LOOPBACK_V4;
                accept;
            }
        }
        term 2 {
            from {
                route-filter ::/0 exact;
            }
            then {
                community add PS-Internet-COMM;
                next-hop $LOOPBACK_V6;
                accept;
            }
        }
    }
    policy-statement VRF_Internet_import {
        term 1 {
            from community PS-Internet-COMM;
            then accept;
        }
        term 2 {
            from community PPPOE_SUBS_COMM_2;
            then accept;
        }
        term 3 {
            from community PS-DHCPSUBS-COMM_2;
            then accept;
        }
    }
    policy-statement PS-V6-default {
        term 1 {
            from {
                instance VRF_Internet;
                route-filter ::/0 exact;
            }
            then {
                community add PS-Internet-COMM;
                next-hop $LOOPBACK_V6;
                accept;
            }
        }
        term 2 {
            then reject;
        }
    }
    policy-statement stop_leak {
        term 1 {
            from level 1;
            to level 2;
            then reject;
        }
    }
}
```

## evo/policy/vrf-radius-policies.conf

```
/*
 * Topic:   RADIUS VRF import/export policies (CR side, with subscriber-community accept)
 * Seen on:
 *   EVO: cr1_ptx10004
 *
 * Highlights:
 *  - PS-RADIUS-VRF-EXPORT (CR variant) is identical to the BNG's: tag
 *    direct routes with PS-RADIUS-COMM, next-hop self.
 *  - PS-RADIUS-VRF-IMPORT (CR variant) is WIDER than the BNG's — cr1
 *    accepts:
 *      * PS-RADIUS-COMM (other RADIUS-VRF participants), AND
 *      * PPPOE_SUBS_COMM_1 + PS-DHCPSUBS-COMM (subscriber direct
 *        routes from the BNGs).
 *    This lets the OSPF redistribution inside the VRF (PS-REDIS-OSPF)
 *    push subscriber routes toward the RADIUS server so the server
 *    can reach individual subscribers for accounting.
 *  - PS-REDIS-OSPF: from protocol bgp; then accept; — applied as the
 *    OSPF export inside the RADIUS VRF on cr1 (see l3vpn-radius.conf).
 *
 * Pair with:
 *  - evo/services/l3vpn-radius.conf
 *  - evo/policy/communities.conf
 *
 * Variables: (none)
 */
policy-options {
    policy-statement PS-RADIUS-VRF-EXPORT {
        term 1 {
            from protocol direct;
            then {
                community add PS-RADIUS-COMM;
                next-hop self;
                accept;
            }
        }
    }
    policy-statement PS-RADIUS-VRF-IMPORT {
        term 2 {
            from community [ PPPOE_SUBS_COMM_1 PS-DHCPSUBS-COMM ];
            then accept;
        }
        term 1 {
            from community PS-RADIUS-COMM;
            then accept;
        }
    }
    policy-statement PS-REDIS-OSPF {
        term 1 {
            from protocol bgp;
            then accept;
        }
    }
}
```

## evo/services/evpn-vpws-an.conf

```
/*
 * Topic:   EVPN-VPWS routing-instance for per-subscriber-group pseudowires (AN side)
 * Seen on:
 *   EVO: an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l
 *
 * Highlights:
 *  - The AN side anchors each EVPN-VPWS on a single ae unit per group
 *    (`ae1.1041` for IPoE group 1, `ae1.1031` for PPPoE group 1, etc.)
 *    that lives on the access LAG toward sw1/sw2 (see
 *    interfaces/ae-vlan-bridge-an.conf).
 *  - vpws-service-id local/remote is reversed relative to the BNG: AN
 *    `local 11` matches BNG `remote 11`, AN `remote 31` matches BNG
 *    `local 31`. (PPPoE local 1-10 / remote 21-30; IPoE local 11-20 /
 *    remote 31-40.)
 *  - Each AN advertises its OWN loopback (192.168.0.0..0.4) as the
 *    RD-prefix — so the same RD-tail :1041 from every AN looks like
 *    distinct routes (one per AN) in the EVPN namespace, and the BNG
 *    picks the right pseudowire per remote.
 *  - Same vrf-target target:60000:104x as the matching BNG instance,
 *    keyed by subscriber-group ID.
 *
 * Pair with:
 *  - evo/transport/bgp-overlay-pe-an.conf
 *  - evo/interfaces/ae-vlan-bridge-an.conf
 *  - evo/transport/routing-options-pe.conf
 *
 *
 * JVD service mapping:
 *   20 instances total (high 20 / med 0 / low 0)
 *   On devices: bng1_mx304 (20), bng2_mx204 (20), bng3_mx10004 (20), bng4_mx480 (20), an1_acx7024 (10), an2_acx7100-48l (10), +3 more
 *   Example:  (RD 100.100.100.100:1041, RT target:60000:1041)
 *     an1_acx7024  ae1.1041 00:10:11:11:11:11:11:00:00:31 A-A
 *     an2_acx7100-48l  ae1.1041 00:10:11:11:11:11:11:00:00:31 A-A
 *     bng1_mx304  ps11.0
 *     bng2_mx204  ps11.0
 *     (+2 more endpoints)
 *
 * Variables (example values from an1_acx7024, METRO_BBE_EVPN_VPWS_IPoE_GROUP_1):
 *   $INSTANCE_NAME         e.g. METRO_BBE_EVPN_VPWS_IPoE_GROUP_1
 *   $AC_INTF               e.g. ae1.1041
 *   $VPWS_LOCAL_ID         e.g. 11
 *   $VPWS_REMOTE_ID        e.g. 31
 *   $RD_LOOPBACK_V4        e.g. 100.100.100.100
 *   $RD_ID                 e.g. 1041
 *   $RT_AS                 e.g. 60000
 *   $RT_ID                 e.g. 1041
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_INTF {
                    vpws-service-id {
                        local $VPWS_LOCAL_ID;
                        remote $VPWS_REMOTE_ID;
                    }
                }
            }
        }
        interface $AC_INTF;
        route-distinguisher $RD_LOOPBACK_V4:$RD_ID;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## evo/services/evpn-vpws-fxc-an.conf

```
/*
 * Topic:   EVPN-VPWS Flexible Cross-Connect (FXC) routing-instance, AN side
 * Seen on:
 *   EVO: an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l
 *
 * Highlights:
 *  - flexible-cross-connect-vlan-unaware tells EVPN to put MULTIPLE
 *    AC interface units (e.g. ae0.1061 + ae0.1062 for PPPoE FXC group 1
 *    or ae0.1065 + ae0.1066 for IPoE FXC group 1) into ONE pseudowire
 *    without requiring matching VLAN tags on each side. The BNG side
 *    delivers them all on a single ps interface.
 *  - label-allocation per-instance ensures the FXC group has its own
 *    EVPN label rather than per-AC labels, which is required by the
 *    vlan-unaware FXC model.
 *  - The `group fxc { esi { ... } }` declares a Type-0 ESI shared by
 *    all ACs in this FXC bundle. Single ESI 00:15:15:15:00:00:00:15:15:15
 *    is reused across FXC groups in this JVD because each group has
 *    its own service-id; if the JVD did multi-homed FXC, ESI would be
 *    distinct per group.
 *  - service-id local/remote (e.g. 5001/6001) maps to BNG vpws-service-id
 *    `local 6001 remote 5001`.
 *
 * Pair with:
 *  - evo/transport/bgp-overlay-pe-an.conf
 *  - evo/interfaces/ae-vlan-bridge-an.conf
 *
 *
 * JVD service mapping:
 *   4 instances total (high 4 / med 0 / low 0)
 *   On devices: bng1_mx304 (4), bng2_mx204 (4), bng3_mx10004 (4), bng4_mx480 (4), an1_acx7024 (2), an2_acx7100-48l (2), +3 more
 *   Example:  (RD 100.100.100.100:3001, RT target:60000:3001)
 *     an1_acx7024  ae0.1065 00:15:15:15:00:00:00:15:15:15 S-A
 *     an2_acx7100-48l  ae0.1065 00:15:15:15:00:00:00:15:15:15 S-A
 *     bng1_mx304  ps32.0
 *     bng2_mx204  ps32.0
 *     (+2 more endpoints)
 *
 * Variables (example values from an1_acx7024, METRO_BBE_EVPN_FXC_PPPoE-GROUP_1):
 *   $INSTANCE_NAME         e.g. METRO_BBE_EVPN_FXC_PPPoE-GROUP_1
 *   $FXC_ESI               e.g. 00:15:15:15:00:00:00:15:15:15
 *   $AC1                   e.g. ae0.1061
 *   $AC2                   e.g. ae0.1062
 *   $SVC_LOCAL             e.g. 5001
 *   $SVC_REMOTE            e.g. 6001
 *   $RD_LOOPBACK_V4        e.g. 100.100.100.100
 *   $RD_ID                 e.g. 2001
 *   $RT_AS                 e.g. 60000
 *   $RT_ID                 e.g. 2001
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                label-allocation per-instance;
                flexible-cross-connect-vlan-unaware;
                group fxc {
                    esi {
                        $FXC_ESI;
                    }
                    interface $AC1;
                    interface $AC2;
                    service-id {
                        local $SVC_LOCAL;
                        remote $SVC_REMOTE;
                    }
                }
            }
        }
        interface $AC1;
        interface $AC2;
        route-distinguisher $RD_LOOPBACK_V4:$RD_ID;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## evo/services/l3vpn-internet.conf

```
/*
 * Topic:   Internet L3VPN VRF on cr1 (eBGP to upstream CE, default-route discard)
 * Seen on:
 *   EVO: cr1_ptx10004
 *
 * Highlights:
 *  - VRF_Internet is the single Internet egress for the BBE solution.
 *    A pair of eBGP sessions (group CE1) face an upstream CE: v4 to
 *    AS 200 on 10.11.110.2, v6 to AS 300 on 2001:db8::11:11:110:2.
 *    They run on the same interface (et-0/0/26:1.0) — IPv4 and IPv6
 *    eBGP sessions are independent.
 *  - accept-remote-nexthop on the eBGP group is required because the
 *    CE may advertise BGP next-hops that are not the BGP peer
 *    (transit upstream).
 *  - Static routes 0.0.0.0/0 discard and ::/0 discard sit in the VRF
 *    so even when the CE session is down, the BNGs still see a
 *    default to drop traffic locally rather than blackhole through
 *    the IGP.
 *  - VRF_Internet_export advertises 0/0 and ::/0 with community
 *    PS-Internet-COMM (target:100:1) and rewrites next-hop to cr1's
 *    own loopback so subscriber VRFs (PPPOE_SUBS_1, dhcp-subs) install
 *    a default toward cr1.
 *  - VRF_Internet_import accepts PS-Internet-COMM (other Internet PEs),
 *    PPPOE_SUBS_COMM_2 (PPPoE subscriber aggregates) and
 *    PS-DHCPSUBS-COMM_2 (DHCP subscriber aggregates) so cr1 routes
 *    return-traffic from the Internet back into subscriber VRFs.
 *
 * Pair with:
 *  - evo/policy/vrf-internet-policies.conf
 *  - evo/policy/communities.conf
 *  - evo/transport/bgp-overlay-rr-core.conf
 *
 *
 * JVD service mapping:
 *   1 instances total (high 1 / med 0 / low 0)
 *   On devices: cr1_ptx10004 (1)
 *   Example:  (RD 192.168.0.11:1, RT )
 *     cr1_ptx10004  et-0/0/26:1.0
 *
 * Variables (example values from cr1_ptx10004):
 *   $CE_INTF          e.g. et-0/0/26:1.0
 *   $RD_LOOPBACK_V4   e.g. 192.168.0.11
 *   $RD_ID            e.g. 1
 *   $CE_PEER_V4       e.g. 10.11.110.2
 *   $CE_PEER_V6       e.g. 2001:db8::11:11:110:2
 *   $CE_AS_V4         e.g. 200
 *   $CE_AS_V6         e.g. 300
 */
routing-instances {
    VRF_Internet {
        instance-type vrf;
        routing-options {
            rib VRF_Internet.inet6.0 {
                static {
                    route ::/0 discard;
                }
            }
            static {
                route 0.0.0.0/0 discard;
            }
        }
        protocols {
            bgp {
                group CE1 {
                    type external;
                    accept-remote-nexthop;
                    family inet {
                        unicast;
                    }
                    neighbor $CE_PEER_V4 {
                        family inet {
                            unicast;
                        }
                        peer-as $CE_AS_V4;
                    }
                    neighbor $CE_PEER_V6 {
                        family inet6 {
                            unicast;
                        }
                        peer-as $CE_AS_V6;
                    }
                }
            }
        }
        interface $CE_INTF;
        route-distinguisher $RD_LOOPBACK_V4:$RD_ID;
        vrf-import VRF_Internet_import;
        vrf-export VRF_Internet_export;
        vrf-table-label;
    }
}
```

## evo/services/l3vpn-radius.conf

```
/*
 * Topic:   RADIUS L3VPN VRF (CR-side, runs OSPF to RADIUS server)
 * Seen on:
 *   EVO: cr1_ptx10004
 *
 * Highlights:
 *  - cr1 is the RADIUS-VRF anchor — the RADIUS server is on a directly
 *    connected interface (et-0/0/20:0.0, 10.189.189.0/24).
 *  - Inside the VRF, OSPF area 0 redistributes BGP-learned routes from
 *    the BNGs (PS-REDIS-OSPF: from protocol bgp; then accept) so the
 *    server reaches subscriber networks for accounting.
 *  - PS-RADIUS-VRF-IMPORT accepts both PS-RADIUS-COMM (server reach
 *    from BNGs) and the subscriber communities (PPPOE_SUBS_COMM_1,
 *    PS-DHCPSUBS-COMM) so the local OSPF area sees those prefixes
 *    advertised by other PEs.
 *  - vrf-target target:11111:111 in addition to vrf-import/export
 *    is a "both" pattern — the import/export policies handle the
 *    extra community matching.
 *  - vrf-table-label, single eBGP peer absent (this VRF carries no
 *    eBGP — only OSPF + iBGP from BNGs).
 *
 * Pair with:
 *  - evo/policy/vrf-radius-policies.conf
 *
 *
 * JVD service mapping:
 *   1 instances total (high 1 / med 0 / low 0)
 *   On devices: bng1_mx304 (1), bng2_mx204 (1), bng3_mx10004 (1), bng4_mx480 (1), cr1_ptx10004 (1)
 *   Example:  (RD 192.168.117.117:1117, RT target:11111:111)
 *     bng1_mx304  
 *     bng2_mx204  
 *     bng3_mx10004  
 *     bng4_mx480  
 *     (+1 more endpoints)
 *
 * Variables (example values from cr1_ptx10004):
 *   $RADIUS_INTF      e.g. et-0/0/20:0.0
 *   $LO_UNIT          e.g. lo0.11
 *   $RD_LOOPBACK_V4   e.g. 111.111.111.111
 *   $RD_ID            e.g. 1111
 *   $RT_AS            e.g. 11111
 *   $RT_ID            e.g. 111
 */
routing-instances {
    RADIUS {
        instance-type vrf;
        protocols {
            ospf {
                area 0.0.0.0 {
                    interface $RADIUS_INTF;
                }
                export PS-REDIS-OSPF;
            }
        }
        interface $RADIUS_INTF;
        interface $LO_UNIT;
        route-distinguisher $RD_LOOPBACK_V4:$RD_ID;
        vrf-import PS-RADIUS-VRF-IMPORT;
        vrf-export PS-RADIUS-VRF-EXPORT;
        vrf-target target:$RT_AS:$RT_ID;
        vrf-table-label;
    }
}
```

## evo/transport/bgp-overlay-pe-an.conf

```
/*
 * Topic:   iBGP overlay from access-PE (AN) to fabric route reflectors
 * Seen on:
 *   EVO: an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l
 *
 * Highlights:
 *  - AN devices are EVPN-VPWS PEs facing the subscriber-side of each
 *    pseudowire. They peer ONLY with the two fabric RRs (agn1, agn2)
 *    in group GR-IBGP-AN — they never talk to cr1 or to each other.
 *  - inet/inet6 labeled-unicast resolve into inet.3/inet6.3 so EVPN
 *    Type-1/Type-2 next-hops resolve over SR-MPLS. No `resolve-vpn`
 *    here because the AN does not run inet-vpn / inet6-vpn AFs (no
 *    L3VPN service is anchored on the AN).
 *  - family evpn signaling is the only service AF the AN needs.
 *  - BFD 100ms x 3 matches the rest of the overlay mesh.
 *
 * Pair with:
 *  - evo/services/evpn-vpws-an.conf
 *  - evo/services/evpn-vpws-fxc-an.conf
 *  - evo/transport/bgp-overlay-rr-fabric.conf
 *  - evo/transport/routing-options-pe.conf
 *
 * Variables (example values from an1_acx7024):
 *   $LOOPBACK_V4   e.g. 192.168.0.0
 *   $RR_AGN1_V4    e.g. 192.168.0.5
 *   $RR_AGN2_V4    e.g. 192.168.0.6
 */
protocols {
    bgp {
        group GR-IBGP-AN {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
                    rib {
                        inet.3;
                    }
                }
            }
            family inet6 {
                labeled-unicast {
                    rib {
                        inet6.3;
                    }
                }
            }
            family evpn {
                signaling;
            }
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor $RR_AGN1_V4;
            neighbor $RR_AGN2_V4;
        }
    }
}
```

## evo/transport/bgp-overlay-rr-core.conf

```
/*
 * Topic:   Core (CR) route-reflector with VPN AFs and accept-remote-nexthop
 * Seen on:
 *   EVO: cr1_ptx10004
 *
 * Highlights:
 *  - cr1 is BOTH a transit RR and a service-PE — it hosts VRF_Internet
 *    (eBGP to Internet CE) and the RADIUS VRF, and reflects EVPN+L3VPN
 *    routes between the AGN cluster and the BNG cluster.
 *  - GR-IBGP-CORE-RR clients are the AGN/BNG mesh (.5/.6/.7/.8). The
 *    cluster id matches cr1's own loopback. Export PS-BGP-RR-EXPORT
 *    rewrites the next-hop to cr1 only for prefixes in PL-CORE (the
 *    BNG loopbacks .9/.10) — so reflected routes from a BNG appear to
 *    the rest of the mesh as if they came from cr1.
 *  - GR-IBGP-CR is the second cluster toward the .9/.10 BNG region.
 *    Export PS-CLIENT-RR-EXPORT advertises the AN/BNG loopbacks
 *    (PL-AN-REGION) without rewriting next-hop, preserving the actual
 *    PE for service-route resolution.
 *  - accept-remote-nexthop is required for L3VPN BGP-LU resolution
 *    when the BGP next-hop is not directly the BGP peer.
 *  - Carries inet-vpn + inet6-vpn (for VRF_Internet, RADIUS) plus the
 *    usual labeled-unicast + evpn AFs.
 *  - BFD 100ms x 3.
 *
 * Pair with:
 *  - evo/policy/bgp-rr-export.conf
 *  - evo/services/l3vpn-internet.conf
 *  - evo/transport/bgp-overlay-rr-fabric.conf
 *
 * Variables (example values from cr1_ptx10004):
 *   $LOOPBACK_V4   e.g. 192.168.0.11
 *   $AGN1_V4       e.g. 192.168.0.5
 *   $AGN2_V4       e.g. 192.168.0.6
 *   $BNG1_V4       e.g. 192.168.0.7
 *   $BNG2_V4       e.g. 192.168.0.8
 *   $BNG3_V4       e.g. 192.168.0.9
 *   $BNG4_V4       e.g. 192.168.0.10
 */
protocols {
    bgp {
        advertise-from-main-vpn-tables;
        vpn-apply-export;
        group GR-IBGP-CORE-RR {
            type internal;
            accept-remote-nexthop;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
                    rib {
                        inet.3;
                    }
                }
            }
            family inet-vpn {
                unicast;
            }
            family inet6 {
                labeled-unicast {
                    rib {
                        inet6.3;
                    }
                }
            }
            family inet6-vpn {
                unicast;
            }
            family evpn {
                signaling;
            }
            export PS-BGP-RR-EXPORT;
            cluster $LOOPBACK_V4;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor $AGN1_V4;
            neighbor $AGN2_V4;
            neighbor $BNG1_V4;
            neighbor $BNG2_V4;
        }
        group GR-IBGP-CR {
            type internal;
            accept-remote-nexthop;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
                    rib {
                        inet.3;
                    }
                }
            }
            family inet-vpn {
                unicast;
            }
            family inet6 {
                labeled-unicast {
                    rib {
                        inet6.3;
                    }
                }
            }
            family inet6-vpn {
                unicast;
            }
            family evpn {
                signaling;
            }
            export PS-CLIENT-RR-EXPORT;
            cluster $LOOPBACK_V4;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor $BNG3_V4;
            neighbor $BNG4_V4;
        }
    }
}
```

## evo/transport/bgp-overlay-rr-fabric.conf

```
/*
 * Topic:   Fabric (AGN) route-reflector with downstream AN clients and upstream CR peer
 * Seen on:
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c
 *
 * Highlights:
 *  - The AGN devices reflect between two clusters: the access fabric
 *    (group GR-IBGP-FABRIC-RR with all AN loopbacks as clients) and
 *    the core (group GR-IBGP-CR with the BNGs and cr1 as clients).
 *    Both clusters use the AGN's own loopback as cluster-id — that's
 *    the simplest topology where the AGN is the only RR for both
 *    sides and there is no inter-RR mesh.
 *  - advertise-from-main-vpn-tables is required so the AGN can reflect
 *    EVPN/VPN routes it learned from one cluster to the other without
 *    being itself a service PE.
 *  - vpn-apply-export at the bgp { } level scopes the per-group export
 *    policies (none configured here, but the knob is needed for any
 *    future per-neighbour VPN policy).
 *  - inet/inet6 labeled-unicast resolve into inet.3/inet6.3 so service
 *    next-hops the AGN reflects can transit the SR-MPLS underlay
 *    without needing native MPLS labels in the IGP.
 *  - family evpn signaling is the workhorse AF for subscriber EVPN-VPWS.
 *  - On agn1, additionally inet/inet6 labeled-unicast carries the BGP-LU
 *    paths between AN and BNG so the loopbacks transit even across
 *    inter-AGN failures.
 *  - BFD 100ms x 3.
 *
 * Pair with:
 *  - evo/transport/bgp-overlay-pe-an.conf
 *  - evo/transport/bgp-overlay-rr-core.conf
 *  - evo/policy/bgp-rr-export.conf
 *
 * Variables (example values from agn1_acx7100-32c):
 *   $LOOPBACK_V4         e.g. 192.168.0.5
 *   $AN1_V4              e.g. 192.168.0.0
 *   $AN2_V4              e.g. 192.168.0.1
 *   $AN3_V4              e.g. 192.168.0.2
 *   $AN4_V4              e.g. 192.168.0.3
 *   $AN5_V4              e.g. 192.168.0.4
 *   $BNG1_V4             e.g. 192.168.0.7
 *   $BNG2_V4             e.g. 192.168.0.8
 *   $CR_V4               e.g. 192.168.0.11
 */
protocols {
    bgp {
        advertise-from-main-vpn-tables;
        vpn-apply-export;
        group GR-IBGP-FABRIC-RR {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
                    rib {
                        inet.3;
                    }
                }
            }
            family inet6 {
                labeled-unicast {
                    rib {
                        inet6.3;
                    }
                }
            }
            family evpn {
                signaling;
            }
            cluster $LOOPBACK_V4;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor $AN1_V4;
            neighbor $AN2_V4;
            neighbor $AN3_V4;
            neighbor $AN4_V4;
            neighbor $AN5_V4;
        }
        group GR-IBGP-CR {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
                    rib {
                        inet.3;
                    }
                }
            }
            family inet6 {
                labeled-unicast {
                    rib {
                        inet6.3;
                    }
                }
            }
            family evpn {
                signaling;
            }
            cluster $LOOPBACK_V4;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor $BNG1_V4;
            neighbor $BNG2_V4;
            neighbor $CR_V4;
        }
    }
}
```

## evo/transport/isis-srmpls-tilfa.conf

```
/*
 * Topic:   ISIS L1 with SR-MPLS, TI-LFA node-protection, and microloop avoidance
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO:   agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 *
 * Highlights:
 *  - Configuration is byte-identical to the Junos sibling: ACX7000/PTX
 *    EVO accepts the same ISIS+SR-MPLS hierarchy as MX Junos in this
 *    JVD. Only the platform underneath differs.
 *  - cr1 is the L1/L2 boundary node; everywhere else `level 2 disable`
 *    keeps the IS-IS database compact.
 *  - post-convergence-lfa with cost 16777214 makes node-protecting
 *    backups computed during TI-LFA the LAST resort, so primary paths
 *    are always preferred when both exist.
 *  - source-packet-routing explicit-null relies on the SRGB carved by
 *    `protocols mpls label-range srgb-label-range 800000 890000` (see
 *    mpls-segment-routing.conf).
 *  - On EVO ACX7100 the same BFD 100ms x 3 + no-adaptation profile is
 *    used as on Junos.
 *
 * Pair with:
 *  - evo/transport/mpls-segment-routing.conf
 *  - evo/policy/isis-export-prefix-segment.conf
 *  - evo/interfaces/core-isis-mpls.conf
 *  - evo/policy/vrf-internet-policies.conf
 *
 * Variables (example values from agn1_acx7100-32c):
 *   $CORE_INTF        e.g. et-0/0/0.0
 *   $ISIS_LEVEL       e.g. 1            (use 2 on inter-area links: cr1 et-0/0/18, ae1)
 *   $L2_KNOB          e.g. disable      (use `wide-metrics-only` on cr1)
 *   $EXPORT_POLICY    e.g. PS-ISIS-EXPORT  (use `[ PS-ISIS-EXPORT stop_leak ]` on cr1)
 */
protocols {
    isis {
        interface $CORE_INTF {
            level $ISIS_LEVEL {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
            }
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
        interface lo0.0 {
            passive;
        }
        source-packet-routing explicit-null;
        level 1 wide-metrics-only;
        level 2 $L2_KNOB;
        spf-options {
            microloop-avoidance {
                post-convergence-path {
                    delay 5000;
                }
            }
            multipath {
                weighted one-hop;
            }
        }
        backup-spf-options {
            use-post-convergence-lfa maximum-labels 5;
            use-source-packet-routing;
        }
        traffic-engineering {
            l3-unicast-topology;
            advertisement always;
        }
        export $EXPORT_POLICY;
    }
}
```

## evo/transport/mpls-segment-routing.conf

```
/*
 * Topic:   MPLS SRGB and IPv6 tunneling for SR-MPLS
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO:   agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 *
 * Highlights:
 *  - Same SRGB (800000-890000) is configured network-wide so SR
 *    node-segment indices map to identical labels on every node — a
 *    requirement for SR-MPLS without a controller assigning labels.
 *  - ipv6-tunneling enables 6PE so IPv6 service routes can resolve
 *    over the IPv4 SR-MPLS LSPs (no separate v6 underlay needed).
 *  - On EVO ACX7100/PTX10004 nothing else under `protocols mpls` is
 *    needed — SR-MPLS forwarding is driven by ISIS, and per-interface
 *    `family mpls maximum-labels 16` lives in the interface stanza.
 *
 * Pair with:
 *  - evo/transport/isis-srmpls-tilfa.conf
 *  - evo/interfaces/core-isis-mpls.conf
 *  - evo/policy/isis-export-prefix-segment.conf
 *
 * Variables (example values from agn1_acx7100-32c):
 *   $SRGB_START   e.g. 800000
 *   $SRGB_END     e.g. 890000
 */
protocols {
    mpls {
        label-range {
            srgb-label-range $SRGB_START $SRGB_END;
        }
        ipv6-tunneling;
    }
}
```

## evo/transport/routing-options-pe.conf

```
/*
 * Topic:   PE routing-options (router-id, AS, chained-composite-next-hop)
 * Seen on:
 *   EVO: an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l
 *
 * Highlights:
 *  - chained-composite-next-hop ingress evpn is the FIB-scaling knob
 *    that matters most on the AN: each AN terminates dozens of EVPN-
 *    VPWS instances toward the same BNG, and CCNH lets them share a
 *    single composite NH per remote PE.
 *  - No rib-groups are needed on the AN because no L3VPN sits on it;
 *    PPPoE/DHCP subscriber routes live only on the BNG.
 *  - export PS-PPLB enables per-packet load-balance.
 *  - Nothing platform-specific to EVO here — same shape as Junos
 *    minus the rib-groups stanza.
 *
 * Pair with:
 *  - evo/policy/pplb.conf
 *  - evo/services/evpn-vpws-an.conf
 *  - evo/transport/bgp-overlay-pe-an.conf
 *
 * Variables (example values from an1_acx7024):
 *   $ROUTER_ID    e.g. 192.168.0.0
 *   $LOCAL_AS     e.g. 65001
 */
routing-options {
    router-id $ROUTER_ID;
    autonomous-system $LOCAL_AS;
    forwarding-table {
        export PS-PPLB;
        chained-composite-next-hop {
            ingress {
                evpn;
            }
        }
    }
}
```

## junos/bootstrap/chassis-bng.conf

```
/*
 * Topic:   BNG chassis knobs (ECMP, GRES, pseudowire-service, tunnel-services)
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - maximum-ecmp 128 raises the FIB ECMP fan-out from the 16 default,
 *    needed because each subscriber session can resolve over many
 *    equal-cost label-switched paths to the core.
 *  - graceful-switchover keeps subscriber state across RE failover on
 *    chassis with redundant REs (mx304/mx10004/mx480). Omit on mx204.
 *  - pseudowire-service device-count sizes the pool of `ps` (pseudowire-
 *    headend) interfaces — one per subscriber-aggregation point. Must be
 *    >= the highest psN.x unit number used by interfaces and routing-
 *    instances. 100 is the JVD value.
 *  - tunnel-services on fpc/pic carves bandwidth for the lt-/ts- service
 *    interfaces that the ps-headend anchors to (`anchor-point lt-0/0/0`
 *    in the ps interface stanzas).
 *
 * Pair with:
 *  - junos/subscriber-management/system-services-subscriber-mgmt.conf
 *  - junos/interfaces/ps-pseudowire-pppoe.conf
 *  - junos/interfaces/ps-pseudowire-dhcp-ipoe.conf
 *  - junos/transport/routing-options-pe.conf
 *
 * Variables (example values from bng1_mx304):
 *   $PS_DEVICE_COUNT  e.g. 100
 *   $TS_FPC           e.g. 0
 *   $TS_PIC           e.g. 0
 *   $TS_BW            e.g. 100g
 */
chassis {
    maximum-ecmp 128;
    redundancy {
        graceful-switchover;
    }
    pseudowire-service {
        device-count $PS_DEVICE_COUNT;
    }
    fpc $TS_FPC {
        pic $TS_PIC {
            tunnel-services {
                bandwidth $TS_BW;
            }
        }
    }
}
```

## junos/firewall/rpf-pass-dhcp.conf

```
/*
 * Topic:   uRPF fail-filters for DHCP/DHCPv6 (and DF-bit clear)
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - rpf-pass-dhcp / rpf-pass-dhcpv6 are NOT plain firewall filters —
 *    they're applied via `family inet { rpf-check fail-filter ...; }`
 *    on the DHCP demux interfaces (see dp-prod-dhcp-base.conf). The
 *    uRPF check normally drops packets whose source-address has no
 *    matching FIB route; this filter lets DHCP through anyway by
 *    matching the well-known broadcast destinations:
 *      * 255.255.255.255/32 + UDP/67 (DHCPDISCOVER)
 *      * ffff::ffff/128 + UDP/dhcp (DHCPv6 SOLICIT)
 *  - default term is `discard` — anything else that fails uRPF is
 *    dropped.
 *  - clear-df-bit is applied on output of pp0/PPPoE-DT sessions
 *    (see dp-prod-pppoe-dt-base.conf) so the BNG can fragment IPv4
 *    packets that exceed the PPPoE MTU rather than ICMP-back.
 *
 * Pair with:
 *  - junos/subscriber-management/dp-prod-dhcp-base.conf
 *  - junos/subscriber-management/dp-prod-pppoe-dt-base.conf
 *
 * Variables: (none — well-known DHCP/DHCPv6 addresses are fixed)
 */
firewall {
    family inet {
        filter clear-df-bit {
            interface-specific;
            term 1 {
                then {
                    accept;
                    dont-fragment clear;
                }
            }
        }
        filter rpf-pass-dhcp {
            term allow-dhcp {
                from {
                    destination-address {
                        255.255.255.255/32;
                    }
                    destination-port dhcp;
                }
                then accept;
            }
            term default {
                then {
                    discard;
                }
            }
        }
    }
    family inet6 {
        filter rpf-pass-dhcpv6 {
            term allow-dhcpv6 {
                from {
                    destination-address {
                        ffff::ffff/128;
                    }
                    destination-port dhcp;
                }
                then accept;
            }
            term default {
                then discard;
            }
        }
    }
}
```

## junos/interfaces/ae-vlan-bridge-fxc-sw.conf

```
/*
 * Topic:   QFX access switch LAG with vlan-bridge units (towards AN)
 * Seen on:
 *   Junos: sw1_qfx5120-32c sw2_qfx5210-64c
 *
 * Highlights:
 *  - sw1/sw2 sit between the access node (AN) and the simulated CPE.
 *    Their job is pure L2 — bridge per-subscriber VLAN tags between
 *    the CPE-facing breakout ports (xe-0/0/0:N) and the LAG to the AN
 *    (ae0 PPPoE-FXC pool, ae1 IPoE/PPPoE per-subscriber pool).
 *  - flexible-vlan-tagging + flexible-ethernet-services lets each
 *    unit declare its own encapsulation; vlan-bridge is the L2-only
 *    unit type used by `vlans { bd_group_xxx { interface ... }}`
 *    (each `vlans` block is a single-interface bridge-domain).
 *  - mtu 9102 matches the rest of the JVD's jumbo-frame baseline,
 *    needed because EVPN-VPWS adds MPLS encap downstream.
 *  - LAG uses LACP active periodic fast — no system-id override is
 *    needed here (the system-id override lives on the AN side as part
 *    of EVPN single-active multihoming).
 *
 * Pair with:
 *
 * Variables (example values from sw1_qfx5120-32c, ae1.1031):
 *   $LAG                  e.g. ae1
 *   $LAG_VLAN_UNIT        e.g. 1031
 *   $LAG_VLAN_ID          e.g. 1031
 *   $CPE_PORT             e.g. xe-0/0/0:3
 *   $BD_NAME              e.g. bd_group_1031
 */
interfaces {
    $LAG {
        flexible-vlan-tagging;
        mtu 9102;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            lacp {
                active;
                periodic fast;
            }
        }
        unit $LAG_VLAN_UNIT {
            encapsulation vlan-bridge;
            vlan-id $LAG_VLAN_ID;
        }
    }
    $CPE_PORT {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        unit $LAG_VLAN_UNIT {
            encapsulation vlan-bridge;
            vlan-id $LAG_VLAN_ID;
        }
    }
}
vlans {
    $BD_NAME {
        vlan-id $LAG_VLAN_ID;
        interface $CPE_PORT.$LAG_VLAN_UNIT;
        interface $LAG.$LAG_VLAN_UNIT;
    }
}
```

## junos/interfaces/core-isis-mpls.conf

```
/*
 * Topic:   Core-facing interface for ISIS underlay (inet/iso/inet6/mpls, max-labels 16)
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - Every PE-to-AGN/CR underlay link carries the same family stack:
 *    inet (IGP next-hops), iso (IS-IS adjacency), inet6 (v6 IGP +
 *    6PE), mpls (label switching).
 *  - family mpls maximum-labels 16 raises the per-interface egress
 *    label-stack depth from the 3-label default. Required for SR-MPLS
 *    TI-LFA repair stacks (which can be up to 5 labels per
 *    backup-spf-options use-post-convergence-lfa maximum-labels 5)
 *    PLUS service labels and explicit-null.
 *  - description follows the JVD template "Rx-LOCAL-To-Ry-NEIGHBOR"
 *    so the topology can be re-derived from the configuration alone.
 *  - On bng3 / cr1 the same link template adds `speed 100g` because
 *    those platforms expose multi-rate ports.
 *
 * Pair with:
 *  - junos/transport/isis-srmpls-tilfa.conf
 *  - junos/transport/mpls-segment-routing.conf
 *
 * Variables (example values from bng1_mx304, et-0/0/2):
 *   $CORE_PHYS         e.g. et-0/0/2
 *   $CORE_DESC         e.g. R7-BNG1-To-R6-AGN2
 *   $CORE_V4           e.g. 10.10.67.2/24
 *   $CORE_V6           e.g. 2001:db8::10:10:67:1:2/120
 */
interfaces {
    $CORE_PHYS {
        description $CORE_DESC;
        unit 0 {
            family inet {
                address $CORE_V4;
            }
            family iso;
            family inet6 {
                address $CORE_V6;
            }
            family mpls {
                maximum-labels 16;
            }
        }
    }
}
```

## junos/interfaces/ps-pseudowire-dhcp-ipoe.conf

```
/*
 * Topic:   Pseudowire-headend (ps) interface for DHCP/IPoE subscriber sessions
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - Same anchor-point + flexible-vlan-tagging + ESI + ethernet-ccc
 *    pattern as the PPPoE variant. The differences are:
 *      * dynamic-profile auto-stacked-pwht_dhcp (DHCP-flavoured),
 *      * accept any (instead of pppoe-specific),
 *      * authentication packet-types any (RADIUS triggered by any
 *        first-packet, not specifically PPPoE PADI),
 *      * a static MAC override (mac aa:aa:aa:bb:bb:bb) so DHCP
 *        offer/reply use a deterministic source MAC across redundancy
 *        peers.
 *  - df-election-type preference value lets the same logical service
 *    be active on a master/slave BNG pair (1000 = preferred, 995 =
 *    backup).
 *
 * Pair with:
 *  - junos/services/evpn-vpws-ipoe-bng.conf
 *  - junos/services/evpn-vpws-fxc-bng.conf
 *  - junos/subscriber-management/dp-auto-stacked-pwht-dhcp.conf
 *  - junos/subscriber-management/access-profile-radius.conf
 *  - junos/bootstrap/chassis-bng.conf
 *  - junos/subscriber-management/system-services-subscriber-mgmt.conf
 *
 * Variables (example values from bng1_mx304, ps11):
 *   $PS_DEV               e.g. ps11
 *   $ANCHOR_LT            e.g. lt-0/0/0
 *   $DYN_PROFILE          e.g. auto-stacked-pwht_dhcp
 *   $USER_PASS            e.g. joshua
 *   $DOMAIN_NAME          e.g. jnpr.net
 *   $USER_PREFIX          e.g. pwht_dhcp
 *   $AUTH_PROFILE         e.g. vlan-auth-access1
 *   $MTU                  e.g. 2022
 *   $ESI_VALUE            e.g. 00:10:12:12:12:12:12:00:00:41
 *   $DF_PREFERENCE        e.g. 1000
 *   $STATIC_MAC           e.g. aa:aa:aa:bb:bb:bb
 */
interfaces {
    $PS_DEV {
        anchor-point {
            $ANCHOR_LT;
        }
        flexible-vlan-tagging;
        auto-configure {
            stacked-vlan-ranges {
                dynamic-profile $DYN_PROFILE {
                    accept any;
                    ranges {
                        any,any;
                    }
                }
                authentication {
                    packet-types any;
                    password $USER_PASS;
                    username-include {
                        domain-name $DOMAIN_NAME;
                        user-prefix $USER_PREFIX;
                    }
                }
                access-profile $AUTH_PROFILE;
            }
            remove-when-no-subscribers;
        }
        mtu $MTU;
        esi {
            $ESI_VALUE;
            single-active;
            df-election-type {
                preference {
                    value $DF_PREFERENCE;
                }
            }
        }
        mac $STATIC_MAC;
        no-gratuitous-arp-request;
        unit 0 {
            encapsulation ethernet-ccc;
        }
    }
}
```

## junos/interfaces/ps-pseudowire-pppoe.conf

```
/*
 * Topic:   Pseudowire-headend (ps) interface for PPPoE subscriber sessions
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - psN.0 is the BNG-side termination of an EVPN-VPWS pseudowire
 *    coming from an AN. unit 0 is `encapsulation ethernet-ccc` so the
 *    EVPN-VPWS instance treats it as a raw L2 AC.
 *  - anchor-point lt-0/0/0 binds the ps device to a logical-tunnel
 *    pair on the FPC carved by `chassis fpc 0 pic 0 tunnel-services`.
 *  - auto-configure stacked-vlan-ranges defines what arriving frames
 *    look like AND what dynamic-profile to spawn for each. ranges
 *    `any,any` means "any outer tag, any inner tag" — the per-VLAN
 *    PPPoE clients are auto-detected and the auto-stacked-pwht
 *    profile (see dp-auto-stacked-pwht-pppoe.conf) materializes a
 *    demux unit per session.
 *  - authentication packet-types [ pppoe any ] tells PPPoE-client to
 *    use PADI/PADR-derived attributes for RADIUS lookups; user-prefix
 *    "pwht_pppoe" + domain-name jnpr.net build the username sent to
 *    RADIUS.
 *  - access-profile vlan-auth-access1 points at the RADIUS server
 *    (see radius-server.conf).
 *  - esi { ... single-active; df-election-type preference ... }
 *    enables EVPN multihoming: the same ESI is configured on both
 *    BNGs serving the same subscriber group, single-active forces
 *    one BNG to be the DF, and df-election-type preference value
 *    1000/995 lets you pick the master.
 *  - mtu 2022 covers PPPoE (8 bytes) over a 2014-byte payload plus
 *    headers.
 *
 * Pair with:
 *  - junos/services/evpn-vpws-pppoe-bng.conf
 *  - junos/subscriber-management/dp-auto-stacked-pwht-pppoe.conf
 *  - junos/subscriber-management/access-profile-radius.conf
 *  - junos/bootstrap/chassis-bng.conf
 *  - junos/subscriber-management/system-services-subscriber-mgmt.conf
 *
 * Variables (example values from bng1_mx304, ps0):
 *   $PS_DEV               e.g. ps0
 *   $ANCHOR_LT            e.g. lt-0/0/0
 *   $DYN_PROFILE          e.g. auto-stacked-pwht
 *   $USER_PASS            e.g. joshua
 *   $DOMAIN_NAME          e.g. jnpr.net
 *   $USER_PREFIX          e.g. pwht_pppoe
 *   $AUTH_PROFILE         e.g. vlan-auth-access1
 *   $MTU                  e.g. 2022
 *   $ESI_VALUE            e.g. 00:10:12:12:12:12:12:00:00:31
 *   $DF_PREFERENCE        e.g. 1000
 */
interfaces {
    $PS_DEV {
        anchor-point {
            $ANCHOR_LT;
        }
        flexible-vlan-tagging;
        auto-configure {
            stacked-vlan-ranges {
                dynamic-profile $DYN_PROFILE {
                    accept [ pppoe inet inet6 ];
                    ranges {
                        any,any;
                    }
                }
                authentication {
                    packet-types [ pppoe any ];
                    password $USER_PASS;
                    username-include {
                        domain-name $DOMAIN_NAME;
                        user-prefix $USER_PREFIX;
                    }
                }
                access-profile $AUTH_PROFILE;
            }
            remove-when-no-subscribers;
        }
        mtu $MTU;
        esi {
            $ESI_VALUE;
            single-active;
            df-election-type {
                preference {
                    value $DF_PREFERENCE;
                }
            }
        }
        no-gratuitous-arp-request;
        unit 0 {
            encapsulation ethernet-ccc;
        }
    }
}
```

## junos/policy/communities.conf

```
/*
 * Topic:   BBE community palette (subscriber, RADIUS, Internet)
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO:   cr1_ptx10004
 *
 * Highlights:
 *  - PPPOE_SUBS_COMM_1 (target:20000:1031) tags PPPoE direct-connected
 *    routes inside the PPPOE_SUBS_1 VRF (radius-side reachable).
 *  - PPPOE_SUBS_COMM_2 (target:20000:1032) tags PPPoE aggregate routes
 *    that should leak to VRF_Internet.
 *  - PS-DHCPSUBS-COMM (target:65000:1131) and PS-DHCPSUBS-COMM_2
 *    (target:65000:1132) play the same role for the dhcp-subs VRF.
 *  - PS-Internet-COMM (target:100:1) marks the default route exported
 *    by VRF_Internet on cr1 toward the BNG VRFs.
 *  - PS-RADIUS-COMM (target:11111:1111) marks routes leaking into and
 *    out of the RADIUS VRF.
 *  - The AS-numbers (20000, 65000, 100, 11111) are arbitrary palette
 *    choices used JVD-wide as a documentation device — they do NOT
 *    belong to a peer AS.
 *
 * Pair with:
 *  - junos/policy/subscriber-vrf-policies.conf
 *  - junos/policy/vrf-radius-policies.conf
 *
 * Variables: (none — community names and target values are JVD-wide constants)
 */
policy-options {
    community PPPOE_SUBS_COMM_1 members target:20000:1031;
    community PPPOE_SUBS_COMM_2 members target:20000:1032;
    community PS-DHCPSUBS-COMM members target:65000:1131;
    community PS-DHCPSUBS-COMM_2 members target:65000:1132;
    community PS-Internet-COMM members target:100:1;
    community PS-RADIUS-COMM members target:11111:1111;
}
```

## junos/policy/isis-export-prefix-segment.conf

```
/*
 * Topic:   ISIS export policy mapping each loopback to a unique SR prefix-segment
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO:   agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 *
 * Highlights:
 *  - PS-ISIS-EXPORT does three things in three terms:
 *      1) OOB-MGMT: explicitly reject management interfaces (em0, fxp0,
 *         re0:mgmt-0) to keep them out of IS-IS even if the PE
 *         accidentally has lo0 unit on the wrong interface.
 *      2) LOCAL-LOOPBACK-IPV4: advertise THIS PE's lo0 IPv4 with a
 *         per-PE prefix-segment index (1000+lastOctet of loopback) and
 *         node-segment flag — that's how the SR-MPLS network learns
 *         which label maps to this PE.
 *      3) LOCAL-LOOPBACK-IPV6: same, with index 4000+lastOctet for v6.
 *  - Index allocation in this JVD: $NODE_SID_V4 = 1000 + last octet,
 *    $NODE_SID_V6 = 4000 + last octet. Both must be inside the SRGB
 *    (800000..890000 → indices 0..89999, JVD uses < 100).
 *
 * Pair with:
 *  - junos/transport/isis-srmpls-tilfa.conf
 *  - junos/transport/mpls-segment-routing.conf
 *
 * Variables (example values from bng1_mx304):
 *   $LOOPBACK_V4    e.g. 192.168.0.7
 *   $LOOPBACK_V6    e.g. 2001:db8::192:168:0:7
 *   $NODE_SID_V4    e.g. 1007
 *   $NODE_SID_V6    e.g. 4007
 */
policy-options {
    policy-statement PS-ISIS-EXPORT {
        term OOB-MGMT {
            from interface [ em0.0 fxp0.0 re0:mgmt-0.0 ];
            then reject;
        }
        term LOCAL-LOOPBACK-IPV4 {
            from {
                protocol direct;
                interface lo0.0;
                route-filter $LOOPBACK_V4/32 exact;
            }
            then {
                prefix-segment {
                    index $NODE_SID_V4;
                    node-segment;
                }
                accept;
            }
        }
        term LOCAL-LOOPBACK-IPV6 {
            from {
                protocol direct;
                interface lo0.0;
                route-filter $LOOPBACK_V6/128 exact;
            }
            then {
                prefix-segment {
                    index $NODE_SID_V6;
                    node-segment;
                }
                accept;
            }
        }
    }
}
```

## junos/policy/pplb.conf

```
/*
 * Topic:   Per-packet load-balance forwarding-table policy
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO:   agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 *
 * Highlights:
 *  - PS-PPLB is applied as `forwarding-table { export PS-PPLB; }` (see
 *    routing-options-pe.conf). Despite the name "per-packet", in
 *    modern Junos/EVO this is per-flow load-balance across all
 *    equal-cost next-hops. Required for ECMP to actually program
 *    multiple next-hops in the FIB.
 *  - Without this policy, only the first ECMP next-hop is installed
 *    even though many are computed.
 *
 * Pair with:
 *  - junos/transport/routing-options-pe.conf
 *
 * Variables: (none)
 */
policy-options {
    policy-statement PS-PPLB {
        then {
            load-balance per-packet;
            accept;
        }
    }
}
```

## junos/policy/subscriber-vrf-policies.conf

```
/*
 * Topic:   PPPoE / DHCP subscriber VRF import/export and IPv6 leak policies
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - PS-PPPOE-SUBS-1-VRF-EXPORT advertises:
 *      * direct routes (PE-side glue) tagged PPPOE_SUBS_COMM_1, and
 *      * aggregate routes 10.25.0.0/16 + fc00:25:140::/48 tagged
 *        PPPOE_SUBS_COMM_2 — these are the subscriber-pool aggregates
 *        the rest of the network sees.
 *    next-hop self on every term so the BNG owns return-traffic.
 *  - PS-PPPOE-SUBS-1-VRF-IMPORT accepts PS-RADIUS-COMM (RADIUS server
 *    reach) and PS-Internet-COMM (default from cr1's VRF_Internet).
 *  - PS-PPPOE-SUBSv6 exports IPv6 subscriber prefixes from the VRF
 *    into the main inet6 table with the BNG's own loopback as next-
 *    hop — this is the BGP `export` referenced under the GR-IBGP-CR
 *    group (see bgp-overlay-pe-bng.conf).
 *  - dhcp-subs-vrf-export-pol / -import-pol mirror the same shape for
 *    the DHCP/IPoE VRF using PS-DHCPSUBS-COMM* and access-internal
 *    (DHCP-installed) routes instead of `protocol direct`.
 *  - PS-DHCP-SUBSv6 leaks dhcp-subs IPv6 access-internal routes into
 *    the main inet6 table (community-tagged + BNG-loopback NH).
 *
 * Pair with:
 *  - junos/services/l3vpn-pppoe-subs.conf
 *  - junos/services/l3vpn-dhcp-subs.conf
 *  - junos/transport/bgp-overlay-pe-bng.conf
 *  - junos/policy/communities.conf
 *
 * Variables (example values from bng1_mx304):
 *   $LOOPBACK_V6      e.g. 2001:db8::192:168:0:7
 */
policy-options {
    policy-statement PS-PPPOE-SUBS-1-VRF-EXPORT {
        term 1 {
            from protocol direct;
            then {
                community add PPPOE_SUBS_COMM_1;
                next-hop self;
                accept;
            }
        }
        term 2 {
            from {
                protocol aggregate;
                route-filter 10.25.0.0/16 exact;
            }
            then {
                community add PPPOE_SUBS_COMM_2;
                next-hop self;
                accept;
            }
        }
        term 3 {
            from {
                protocol aggregate;
                route-filter fc00:25:140::/48 exact;
            }
            then {
                community add PPPOE_SUBS_COMM_2;
                next-hop self;
                accept;
            }
        }
    }
    policy-statement PS-PPPOE-SUBS-1-VRF-IMPORT {
        term 1 {
            from community PS-RADIUS-COMM;
            then accept;
        }
        term 2 {
            from community PS-Internet-COMM;
            then accept;
        }
    }
    policy-statement PS-PPPOE-SUBSv6 {
        term 1 {
            from {
                instance PPPOE_SUBS_1;
                route-filter fc00:25:140::/48 exact;
            }
            then {
                community add PPPOE_SUBS_COMM_2;
                next-hop $LOOPBACK_V6;
                accept;
            }
        }
    }
    policy-statement dhcp-subs-vrf-export-pol {
        term 1 {
            from protocol direct;
            then {
                community add PS-DHCPSUBS-COMM;
                next-hop self;
                accept;
            }
        }
        term 2 {
            from protocol access-internal;
            then {
                community add PS-DHCPSUBS-COMM_2;
                next-hop self;
                accept;
            }
        }
    }
    policy-statement dhcp-subs-vrf-import-pol {
        term 1 {
            from community PS-RADIUS-COMM;
            then accept;
        }
        term 2 {
            from community PS-Internet-COMM;
            then accept;
        }
    }
    policy-statement PS-DHCP-SUBSv6 {
        term 1 {
            from {
                instance dhcp-subs;
                protocol access-internal;
            }
            then {
                community add PS-DHCPSUBS-COMM_2;
                next-hop $LOOPBACK_V6;
                accept;
            }
        }
    }
}
```

## junos/policy/vrf-radius-policies.conf

```
/*
 * Topic:   RADIUS VRF import/export policies (BNG side)
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - PS-RADIUS-VRF-EXPORT advertises BNG-side direct routes (the lo0
 *    inside the RADIUS VRF) tagged with PS-RADIUS-COMM and rewrites
 *    next-hop to self. That's how the RADIUS server (behind cr1)
 *    learns reachability to the BNG's RADIUS source-address.
 *  - PS-RADIUS-VRF-IMPORT accepts PS-RADIUS-COMM only — the BNG just
 *    needs to reach the server, not learn other client's prefixes.
 *  - The CR-side variant of this policy (vrf-radius-policies.conf
 *    under evo/) is wider because cr1 also accepts subscriber
 *    communities so the server can reach subscribers for accounting.
 *
 * Pair with:
 *  - junos/services/l3vpn-radius.conf
 *  - junos/subscriber-management/radius-server.conf
 *  - junos/policy/communities.conf
 *
 * Variables: (none)
 */
policy-options {
    policy-statement PS-RADIUS-VRF-EXPORT {
        term 1 {
            from protocol direct;
            then {
                community add PS-RADIUS-COMM;
                next-hop self;
                accept;
            }
        }
    }
    policy-statement PS-RADIUS-VRF-IMPORT {
        term 1 {
            from community PS-RADIUS-COMM;
            then accept;
        }
    }
}
```

## junos/services/evpn-vpws-fxc-bng.conf

```
/*
 * Topic:   EVPN-VPWS Flexible Cross-Connect (FXC) routing-instance, BNG side
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - FXC bundles many access-side VLANs into a SINGLE EVPN-VPWS
 *    pseudowire — instead of one instance per subscriber group, one
 *    instance carries an entire IPoE or PPPoE FXC group.
 *  - On the BNG (psN.0) the FXC instance still references just one ps
 *    interface; the multiplexing of customer VLANs happens on the AN
 *    side via `flexible-cross-connect-vlan-unaware` (see
 *    evpn-vpws-fxc-an.conf).
 *  - vpws-service-id uses the 6xxx range (local 6001/6002 for PPPoE/
 *    IPoE FXC group 1, 6005/6006 for group 2). Remotes 5001/5002 etc.
 *    match the AN.
 *  - RD uses :2xxx (PPPoE FXC) or :3xxx (IPoE FXC) tail to keep the
 *    namespace separate from the per-subscriber-group EVPN-VPWS RDs.
 *
 * Pair with:
 *  - junos/transport/bgp-overlay-pe-bng.conf
 *  - junos/interfaces/ps-pseudowire-dhcp-ipoe.conf
 *  - junos/services/l3vpn-dhcp-subs.conf
 *
 *
 * JVD service mapping:
 *   24 instances total (high 24 / med 0 / low 0)
 *   On devices: bng1_mx304 (24), bng2_mx204 (24), bng3_mx10004 (24), bng4_mx480 (24), an1_acx7024 (12), an2_acx7100-48l (12), +3 more
 *   Example:  (RD 100.100.100.100:3001, RT target:60000:3001)
 *     an1_acx7024  ae0.1065 00:15:15:15:00:00:00:15:15:15 S-A
 *     an2_acx7100-48l  ae0.1065 00:15:15:15:00:00:00:15:15:15 S-A
 *     bng1_mx304  ps32.0
 *     bng2_mx204  ps32.0
 *     (+2 more endpoints)
 *
 * Variables (example values from bng1_mx304, METRO_BBE_EVPN_FXC_PPPoE-GROUP_1):
 *   $INSTANCE_NAME         e.g. METRO_BBE_EVPN_FXC_PPPoE-GROUP_1
 *   $PS_AC                 e.g. ps31.0
 *   $VPWS_LOCAL_ID         e.g. 6001
 *   $VPWS_REMOTE_ID        e.g. 5001
 *   $RD_LOOPBACK_V4        e.g. 192.168.107.107
 *   $RD_ID                 e.g. 2001
 *   $RT_AS                 e.g. 60000
 *   $RT_ID                 e.g. 2001
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $PS_AC {
                    vpws-service-id {
                        local $VPWS_LOCAL_ID;
                        remote $VPWS_REMOTE_ID;
                    }
                }
            }
        }
        interface $PS_AC;
        route-distinguisher $RD_LOOPBACK_V4:$RD_ID;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/services/evpn-vpws-ipoe-bng.conf

```
/*
 * Topic:   EVPN-VPWS routing-instance for DHCP/IPoE pseudowire-headend (BNG side)
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - Identical shape to evpn-vpws-pppoe-bng.conf — only the
 *    vpws-service-id ranges and the underlying ps interface differ.
 *  - In this JVD the BNG IPoE side uses local IDs in 31-40 range
 *    (matching the IPoE pseudowire-headend pool ps11..ps20) and remote
 *    IDs in the 11-20 range (the AN's local for IPoE).
 *  - The matching `ps11..20` interface units are bound to the
 *    `dhcp-subs` VRF via the `prod-dhcp-base` dynamic-profile, so
 *    activated DHCP/IPoE sessions land in that VRF (not in the EVPN-
 *    VPWS routing-instance, which only carries the L2 pseudowire).
 *
 * Pair with:
 *  - junos/transport/bgp-overlay-pe-bng.conf
 *  - junos/interfaces/ps-pseudowire-dhcp-ipoe.conf
 *  - junos/services/l3vpn-dhcp-subs.conf
 *
 *
 * JVD service mapping:
 *   24 instances total (high 24 / med 0 / low 0)
 *   On devices: bng1_mx304 (24), bng2_mx204 (24), bng3_mx10004 (24), bng4_mx480 (24), an1_acx7024 (12), an2_acx7100-48l (12), +3 more
 *   Example:  (RD 100.100.100.100:3001, RT target:60000:3001)
 *     an1_acx7024  ae0.1065 00:15:15:15:00:00:00:15:15:15 S-A
 *     an2_acx7100-48l  ae0.1065 00:15:15:15:00:00:00:15:15:15 S-A
 *     bng1_mx304  ps32.0
 *     bng2_mx204  ps32.0
 *     (+2 more endpoints)
 *
 * Variables (example values from bng1_mx304, METRO_BBE_EVPN_VPWS_IPoE_GROUP_1):
 *   $INSTANCE_NAME         e.g. METRO_BBE_EVPN_VPWS_IPoE_GROUP_1
 *   $PS_AC                 e.g. ps11.0
 *   $VPWS_LOCAL_ID         e.g. 31
 *   $VPWS_REMOTE_ID        e.g. 11
 *   $RD_LOOPBACK_V4        e.g. 192.168.107.107
 *   $RD_ID                 e.g. 1041
 *   $RT_AS                 e.g. 60000
 *   $RT_ID                 e.g. 1041
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $PS_AC {
                    vpws-service-id {
                        local $VPWS_LOCAL_ID;
                        remote $VPWS_REMOTE_ID;
                    }
                }
            }
        }
        interface $PS_AC;
        route-distinguisher $RD_LOOPBACK_V4:$RD_ID;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/services/evpn-vpws-pppoe-bng.conf

```
/*
 * Topic:   EVPN-VPWS routing-instance for PPPoE pseudowire-headend (BNG side)
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - One routing-instance per subscriber group; the AC is a single
 *    pseudowire-headend (`ps`) interface unit 0 (encapsulation
 *    ethernet-ccc on the AC, see ps-pseudowire-pppoe.conf).
 *  - vpws-service-id local/remote pair is the EVPN Type-1 service
 *    identifier exchanged with the AN on the other end. The BNG's
 *    `local` matches the AN's `remote` and vice versa. In this JVD
 *    the BNG side uses local IDs in the 21-30 range (PPPoE) and
 *    remotes in the 1-10 range (matching AN local).
 *  - route-distinguisher uses the BNG's "subscriber" loopback
 *    (192.168.107.107 on bng1, NOT lo0.0) so the RD does not collide
 *    with the L3VPN RDs anchored on the device.
 *  - vrf-target target:60000:1031..1040 is the per-instance RT — only
 *    the matching AN imports it; AS 60000 is reserved for the EVPN-
 *    VPWS service plane.
 *
 * Pair with:
 *  - junos/transport/bgp-overlay-pe-bng.conf
 *  - junos/interfaces/ps-pseudowire-pppoe.conf
 *  - junos/subscriber-management/dp-auto-stacked-pwht-pppoe.conf
 *  - junos/services/l3vpn-pppoe-subs.conf
 *
 *
 * JVD service mapping:
 *   24 instances total (high 24 / med 0 / low 0)
 *   On devices: bng1_mx304 (24), bng2_mx204 (24), bng3_mx10004 (24), bng4_mx480 (24), an1_acx7024 (12), an2_acx7100-48l (12), +3 more
 *   Example:  (RD 100.100.100.100:3001, RT target:60000:3001)
 *     an1_acx7024  ae0.1065 00:15:15:15:00:00:00:15:15:15 S-A
 *     an2_acx7100-48l  ae0.1065 00:15:15:15:00:00:00:15:15:15 S-A
 *     bng1_mx304  ps32.0
 *     bng2_mx204  ps32.0
 *     (+2 more endpoints)
 *
 * Variables (example values from bng1_mx304, METRO_BBE_EVPN_VPWS_PPPoE_GROUP_1):
 *   $INSTANCE_NAME         e.g. METRO_BBE_EVPN_VPWS_PPPoE_GROUP_1
 *   $PS_AC            e.g. ps0.0
 *   $VPWS_LOCAL_ID         e.g. 21
 *   $VPWS_REMOTE_ID        e.g. 1
 *   $RD_LOOPBACK_V4        e.g. 192.168.107.107
 *   $RD_ID                 e.g. 1031
 *   $RT_AS                 e.g. 60000
 *   $RT_ID                 e.g. 1031
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $PS_AC {
                    vpws-service-id {
                        local $VPWS_LOCAL_ID;
                        remote $VPWS_REMOTE_ID;
                    }
                }
            }
        }
        interface $PS_AC;
        route-distinguisher $RD_LOOPBACK_V4:$RD_ID;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/services/l3vpn-dhcp-subs.conf

```
/*
 * Topic:   L3VPN VRF for DHCP/IPoE subscribers with embedded dhcp-local-server
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - The dhcp-subs VRF terminates BOTH DHCPv4 and DHCPv6 IPoE sessions
 *    arriving over the EVPN-VPWS pseudowires. Unlike the PPPoE VRF, it
 *    nests `system services dhcp-local-server` INSIDE the VRF — Junos
 *    requires the DHCP server config in the same routing-instance as
 *    the demux interfaces it serves.
 *  - dual-stack-group `dhcp-ds` correlates v4 and v6 leases by MAC
 *    (classification-key mac-address) and uses on-demand-address-
 *    allocation so addresses are only carved when a request arrives,
 *    not pre-reserved.
 *  - dynamic-profile prod-dhcp-base activates a demux0.x interface
 *    per session (see dp-prod-dhcp-base.conf).
 *  - dhcpv6 group uses authentication via RADIUS profile and references
 *    the prod-dhcp-base profile too — same client model, different AF.
 *  - server-duid-type duid_ll is the standard DUID format choice for
 *    the JVD.
 *  - aggregates 10.42.0.0/16 + 10.43.0.0/16 (v4) and fc00:125:140::/64
 *    + fc00:126:140::/64 (v6) are advertised; the discard static for
 *    10.43/.0.1/32 and fc00:126:140::/64 ensures the aggregate is
 *    always backed even with no active sessions.
 *  - vrf-import/export use community PS-DHCPSUBS-COMM (target:65000:1131)
 *    and PS-DHCPSUBS-COMM_2 (target:65000:1132); cr1 leaks them into
 *    VRF_Internet (see policy/vrf-internet-policies.conf).
 *
 * Pair with:
 *  - junos/services/evpn-vpws-ipoe-bng.conf
 *  - junos/services/evpn-vpws-fxc-bng.conf
 *  - junos/policy/subscriber-vrf-policies.conf
 *  - junos/subscriber-management/dp-prod-dhcp-base.conf
 *  - junos/subscriber-management/dp-autosense-ipdemux.conf
 *  - junos/subscriber-management/address-assignment-pools.conf
 *  - junos/subscriber-management/dp-auto-stacked-pwht-dhcp.conf
 *  - junos/transport/bgp-overlay-pe-bng.conf
 *
 *
 * JVD service mapping:
 *   1 instances total (high 1 / med 0 / low 0)
 *   On devices: bng1_mx304 (1), bng2_mx204 (1), bng3_mx10004 (1), bng4_mx480 (1)
 *   Example:  (RD 192.168.207.207:1046, RT )
 *     bng1_mx304  demux0.0
 *     bng2_mx204  demux0.0
 *     bng3_mx10004  demux0.0
 *     bng4_mx480  demux0.0
 *
 * Variables (example values from bng1_mx304):
 *   $VRF_NAME              e.g. dhcp-subs
 *   $V4_POOL               e.g. dhcp_v4_pool
 *   $V6_POOL               e.g. dhcp_v6_pool
 *   $V4_NETWORK            e.g. 10.42.0.0/16
 *   $V4_RANGE_LOW          e.g. 10.42.0.2
 *   $V4_RANGE_HIGH         e.g. 10.42.255.254
 *   $V4_GATEWAY            e.g. 10.42.0.1
 *   $V6_PREFIX             e.g. fc00:125:140::/64
 *   $V6_RANGE_LOW          e.g. fc00:125:140::2/128
 *   $V6_RANGE_HIGH         e.g. fc00:125:140::ffff/128
 *   $LO_UNIT               e.g. lo0.313
 *   $RD_LOOPBACK_V4        e.g. 192.168.207.207
 *   $RD_ID                 e.g. 1046
 *   $AUTH_PROFILE          e.g. vlan-auth-access1
 *   $DOMAIN_NAME           e.g. jnpr.net
 *   $USER_PASS             e.g. joshua
 *   $USER_PREFIX           e.g. pwht_dhcp
 *   $LEASE_TIME            e.g. 600
 */
routing-instances {
    $VRF_NAME {
        instance-type vrf;
        routing-options {
            rib $VRF_NAME.inet6.0 {
                static {
                    route fc00:126:140::/64 discard;
                }
                aggregate {
                    route fc00:125:140::/64;
                    route fc00:126:140::/64;
                }
            }
            static {
                route 10.43.0.1/32 discard;
            }
            aggregate {
                route 10.42.0.0/16;
                route 10.43.0.0/16;
            }
            auto-export;
        }
        system {
            services {
                dhcp-local-server {
                    dhcpv6 {
                        group dhcp6-ls {
                            authentication {
                                password $USER_PASS;
                                username-include {
                                    domain-name $DOMAIN_NAME;
                                    user-prefix $USER_PREFIX;
                                }
                            }
                            dynamic-profile prod-dhcp-base;
                            overrides {
                                delegated-pool $V6_POOL;
                                dual-stack dhcp-ds;
                            }
                            interface demux0.0;
                            interface demux0.1;
                            interface ps11.0;
                            interface ps12.0;
                            interface ps13.0;
                            interface ps14.0;
                            interface ps15.0;
                            interface ps16.0;
                            interface ps17.0;
                            interface ps18.0;
                            interface ps19.0;
                            interface ps20.0;
                            interface ps32.0;
                            interface ps36.0;
                        }
                        server-duid-type {
                            duid_ll;
                        }
                    }
                    pool-match-order {
                        ip-address-first;
                    }
                    group dhcp-ls {
                        overrides {
                            client-discover-match incoming-interface;
                            dual-stack dhcp-ds;
                        }
                        interface demux0.0;
                        interface demux0.1;
                        interface ps11.0;
                        interface ps12.0;
                        interface ps13.0;
                        interface ps14.0;
                        interface ps15.0;
                        interface ps16.0;
                        interface ps17.0;
                        interface ps18.0;
                        interface ps19.0;
                        interface ps20.0;
                        interface ps32.0;
                        interface ps36.0;
                    }
                    dual-stack-group dhcp-ds {
                        authentication {
                            password $USER_PASS;
                            username-include {
                                domain-name $DOMAIN_NAME;
                                user-prefix $USER_PREFIX;
                            }
                        }
                        dynamic-profile prod-dhcp-base;
                        on-demand-address-allocation;
                        classification-key {
                            mac-address;
                        }
                    }
                    no-stale-timer-refresh;
                    stale-timer 60;
                }
            }
        }
        access {
            address-assignment {
                high-utilization 80;
                abated-utilization 70;
                pool $V4_POOL {
                    family inet {
                        network $V4_NETWORK;
                        range range1 {
                            low $V4_RANGE_LOW;
                            high $V4_RANGE_HIGH;
                        }
                        dhcp-attributes {
                            maximum-lease-time $LEASE_TIME;
                            server-identifier $V4_GATEWAY;
                            router {
                                $V4_GATEWAY;
                            }
                        }
                    }
                }
                pool $V6_POOL {
                    family inet6 {
                        prefix $V6_PREFIX;
                        range rangev6 {
                            low $V6_RANGE_LOW;
                            high $V6_RANGE_HIGH;
                        }
                        dhcp-attributes {
                            maximum-lease-time $LEASE_TIME;
                        }
                    }
                }
            }
        }
        access-profile $AUTH_PROFILE;
        interface $LO_UNIT;
        route-distinguisher $RD_LOOPBACK_V4:$RD_ID;
        vrf-import dhcp-subs-vrf-import-pol;
        vrf-export dhcp-subs-vrf-export-pol;
        vrf-table-label;
    }
}
```

## junos/services/l3vpn-pppoe-subs.conf

```
/*
 * Topic:   L3VPN VRF for PPPoE subscriber pool (PPPOE_SUBS_1)
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - This is the L3 termination VRF for PPPoE sessions. The matching
 *    EVPN-VPWS instance carries L2 frames from the AN; the
 *    `prod-pppoe-dt-base` dynamic-profile binds activated pp0 units
 *    into THIS VRF when a session comes up.
 *  - aggregate routes 10.25.0.0/16 (v4) + fc00:25:140::/48 (v6) are
 *    advertised with vrf-export PS-PPPOE-SUBS-1-VRF-EXPORT (community
 *    PPPOE_SUBS_COMM_2 = target:20000:1032). cr1's VRF_Internet then
 *    imports them via VRF_Internet_import to grant Internet access.
 *  - access { address-assignment { pool ... } } at the VRF level
 *    re-declares the same pppv4-pool/pppv6-pool that exist globally,
 *    because the PPPoE auto-configure logic resolves pools in the
 *    routing-instance scope, not the global one.
 *  - rib-groups interface_routes (see routing-options-pe.conf) leaks
 *    PPPOE_SUBS_1.inet6.0 into inet6.0 so the global v6 routing table
 *    sees the subscriber prefixes.
 *  - vrf-table-label is required for inet/inet6 VPN with the EVPN/MPLS
 *    forwarding model (single VRF label vs per-prefix labels).
 *
 * Pair with:
 *  - junos/services/evpn-vpws-pppoe-bng.conf
 *  - junos/policy/subscriber-vrf-policies.conf
 *  - junos/subscriber-management/dp-prod-pppoe-dt-base.conf
 *  - junos/transport/routing-options-pe.conf
 *  - junos/subscriber-management/address-assignment-pools.conf
 *  - junos/subscriber-management/dp-auto-stacked-pwht-pppoe.conf
 *  - junos/transport/bgp-overlay-pe-bng.conf
 *
 *
 * JVD service mapping:
 *   1 instances total (high 1 / med 0 / low 0)
 *   On devices: bng1_mx304 (1), bng2_mx204 (1), bng3_mx10004 (1), bng4_mx480 (1)
 *   Example:  (RD 207.207.207.207:1031, RT )
 *     bng1_mx304  
 *     bng2_mx204  
 *     bng3_mx10004  
 *     bng4_mx480  
 *
 * Variables (example values from bng1_mx304):
 *   $VRF_NAME              e.g. PPPOE_SUBS_1
 *   $V6_RIB                e.g. PPPOE_SUBS_1.inet6.0
 *   $V6_AGGREGATE          e.g. fc00:25:140::/48
 *   $V4_AGGREGATE          e.g. 10.25.0.0/16
 *   $V4_POOL_NETWORK       e.g. 10.25.0.0/16
 *   $V6_POOL_PREFIX        e.g. fc00:25:140::/48
 *   $LO_UNIT               e.g. lo0.1
 *   $RD_LOOPBACK_V4        e.g. 207.207.207.207
 *   $RD_ID                 e.g. 1031
 *   $VRF_IMPORT_POL        e.g. PS-PPPOE-SUBS-1-VRF-IMPORT
 *   $VRF_EXPORT_POL        e.g. PS-PPPOE-SUBS-1-VRF-EXPORT
 */
routing-instances {
    $VRF_NAME {
        instance-type vrf;
        routing-options {
            rib $V6_RIB {
                aggregate {
                    route $V6_AGGREGATE;
                }
            }
            aggregate {
                route $V4_AGGREGATE;
            }
            auto-export;
        }
        access {
            address-assignment {
                neighbor-discovery-router-advertisement pppv6-pool;
                pool pppv4-pool {
                    family inet {
                        network $V4_POOL_NETWORK;
                    }
                }
                pool pppv6-pool {
                    family inet6 {
                        prefix $V6_POOL_PREFIX;
                        range ndra-range prefix-length 64;
                    }
                }
            }
        }
        interface $LO_UNIT;
        route-distinguisher $RD_LOOPBACK_V4:$RD_ID;
        vrf-import $VRF_IMPORT_POL;
        vrf-export $VRF_EXPORT_POL;
        vrf-table-label;
    }
}
```

## junos/services/l3vpn-radius.conf

```
/*
 * Topic:   RADIUS L3VPN VRF (BNG and CR view)
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO:   cr1_ptx10004
 *
 * Highlights:
 *  - The RADIUS server (10.189.189.2) lives behind cr1's
 *    et-0/0/20:0 interface. cr1 anchors the OSPF-area-0 inside the
 *    VRF so the server learns reachable interfaces without iBGP.
 *  - On the BNG, the RADIUS VRF is just a stub: a single lo0 unit, no
 *    interfaces, vrf-table-label. The `radius-server` stanza under
 *    `access {}` references `routing-instance RADIUS` so RADIUS UDP
 *    packets sourced by the BNG resolve in this VRF.
 *  - PS-RADIUS-COMM (target:11111:1111) is exported by both ends; the
 *    CR additionally accepts subscriber communities (PPPOE_SUBS_COMM_1
 *    + PS-DHCPSUBS-COMM) so the server can reach all subscribers for
 *    accounting (see policy/vrf-radius-policies.conf).
 *  - vrf-target target:11111:111 (CR) vs the per-end vrf-import/export
 *    on the BNG — the BNG uses the longer policy form because it also
 *    needs to leak Internet community.
 *
 * Pair with:
 *  - junos/policy/vrf-radius-policies.conf
 *  - junos/subscriber-management/radius-server.conf
 *
 *
 * JVD service mapping:
 *   3 instances total (high 3 / med 0 / low 0)
 *   On devices: bng1_mx304 (3), bng2_mx204 (3), bng3_mx10004 (3), bng4_mx480 (3), cr1_ptx10004 (1)
 *   Example:  (RD 207.207.207.207:1031, RT )
 *     bng1_mx304  
 *     bng2_mx204  
 *     bng3_mx10004  
 *     bng4_mx480  
 *
 * Variables (example values from bng1_mx304):
 *   $LO_UNIT          e.g. lo0.7
 *   $RD_LOOPBACK_V4   e.g. 192.168.117.117
 *   $RD_ID            e.g. 1117
 *   $VRF_IMPORT_POL   e.g. PS-RADIUS-VRF-IMPORT
 *   $VRF_EXPORT_POL   e.g. PS-RADIUS-VRF-EXPORT
 */
routing-instances {
    RADIUS {
        instance-type vrf;
        routing-options {
            auto-export;
        }
        interface $LO_UNIT;
        route-distinguisher $RD_LOOPBACK_V4:$RD_ID;
        vrf-import $VRF_IMPORT_POL;
        vrf-export $VRF_EXPORT_POL;
        vrf-table-label;
    }
}
```

## junos/subscriber-management/access-profile-radius.conf

```
/*
 * Topic:   Access profile vlan-auth-access1 (RADIUS NAS attributes for VLAN-stacked PPPoE/IPoE)
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - vlan-auth-access1 is the AAA profile referenced by every ps
 *    interface auto-configure block (ps-pseudowire-*.conf) and by the
 *    DHCP local-server (l3vpn-dhcp-subs.conf).
 *  - authentication-order radius forces RADIUS authentication.
 *  - NAS attributes are the heart of the BBE solution:
 *      * nas-identifier R7-BNG1 — operator-set string identifying the
 *        BNG to the AAA back-end.
 *      * nas-port-id-format agent-circuit-id — NAS-Port-Id carries
 *        the access-circuit identifier (Option 82 / DSL line ID).
 *      * nas-port-type ethernet virtual — type 5 (ethernet) for IPoE,
 *        virtual flag set for the pseudowire-headend.
 *      * calling-station-id-delimiter "@" + format
 *        agent-circuit-id + agent-remote-id — Calling-Station-Id is
 *        "circuit@remote" which the RADIUS profiler keys subscriber
 *        records on.
 *      * accounting-session-id-format decimal — Acct-Session-Id is a
 *        plain integer (vs hex), simpler for billing systems.
 *      * vlan-nas-port-stacked-format — encodes the outer/inner VLAN
 *        tags of the auto-stacked subscriber into the NAS-Port AVP.
 *      * client-authentication-algorithm + client-accounting-algorithm
 *        round-robin distributes load across multiple servers (the
 *        JVD has only one configured but the knob is applied).
 *  - exclude framed-ip-address access-request omits the IP from the
 *    Access-Request (sent in Acct-Start instead) — required pattern
 *    for many AAA back-ends.
 *  - profile no-auth + profile vlan-auth-access exist for non-AAA
 *    fallback patterns; they reuse the global pppv4-pool.
 *
 * Pair with:
 *  - junos/subscriber-management/radius-server.conf
 *  - junos/subscriber-management/address-assignment-pools.conf
 *  - junos/interfaces/ps-pseudowire-pppoe.conf
 *  - junos/interfaces/ps-pseudowire-dhcp-ipoe.conf
 *
 * Variables (example values from bng1_mx304):
 *   $NAS_ID             e.g. R7-BNG1
 *   $RADIUS_SERVER_V4   e.g. 10.189.189.2
 *   $RADIUS_SECRET_AUTH e.g. (Junos $9$-encrypted secret)
 *   $RADIUS_SECRET_ACCT e.g. (Junos $9$-encrypted secret)
 *   $RADIUS_SOURCE_V4   e.g. 192.168.17.17
 */
access {
    profile vlan-auth-access {
        authentication-order none;
        address-assignment {
            pool pppv4-pool;
        }
    }
    profile no-auth {
        authentication-order none;
    }
    profile vlan-auth-access1 {
        authentication-order radius;
        radius {
            authentication-server $RADIUS_SERVER_V4;
            options {
                nas-identifier $NAS_ID;
                nas-port-id-format {
                    agent-circuit-id;
                }
                nas-port-type {
                    ethernet virtual;
                }
                calling-station-id-delimiter "@";
                calling-station-id-format {
                    agent-circuit-id;
                    agent-remote-id;
                }
                accounting-session-id-format decimal;
                vlan-nas-port-stacked-format;
                client-authentication-algorithm round-robin;
                client-accounting-algorithm round-robin;
            }
            attributes {
                exclude {
                    framed-ip-address access-request;
                }
            }
        }
        radius-server {
            $RADIUS_SERVER_V4 {
                secret $RADIUS_SECRET_AUTH;
                timeout 10;
                retry 3;
                max-outstanding-requests 2000;
                source-address $RADIUS_SOURCE_V4;
                routing-instance RADIUS;
            }
        }
    }
    profile vlan-auth-access2 {
        authentication-order radius;
        radius {
            authentication-server $RADIUS_SERVER_V4;
        }
        radius-server {
            $RADIUS_SERVER_V4 {
                secret $RADIUS_SECRET_ACCT;
                timeout 10;
                retry 3;
                max-outstanding-requests 2000;
            }
        }
    }
}
```

## junos/subscriber-management/address-assignment-pools.conf

```
/*
 * Topic:   Global address-assignment pools (PPPoE v4 + v6 with NDRA)
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - These global pools (under top-level access {}) back the
 *    `pppv4-pool` / `pppv6-pool` referenced by profile vlan-auth-access
 *    AND are also re-declared inside the PPPOE_SUBS_1 VRF for VRF-
 *    scoped lookups (see l3vpn-pppoe-subs.conf).
 *  - neighbor-discovery-router-advertisement pppv6-pool wires the
 *    pool into NDRA so each session gets a /64 with on-link prefix
 *    advertised.
 *  - The IPv6 pool defines a single named range `ndra-range` with
 *    prefix-length 64 — this is the per-session prefix length the
 *    NDRA generator hands out from the /48.
 *  - The /16 v4 and /48 v6 are the same numeric ranges aggregated
 *    by routing-options inside the PPPOE_SUBS_1 VRF.
 *
 * Pair with:
 *  - junos/services/l3vpn-pppoe-subs.conf
 *  - junos/subscriber-management/access-profile-radius.conf
 *  - junos/services/l3vpn-dhcp-subs.conf
 *
 * Variables (example values from bng1_mx304):
 *   $V4_POOL_NETWORK  e.g. 10.25.0.0/16
 *   $V6_POOL_PREFIX   e.g. fc00:25:140::/48
 */
access {
    address-assignment {
        neighbor-discovery-router-advertisement pppv6-pool;
        pool pppv4-pool {
            family inet {
                network $V4_POOL_NETWORK;
            }
        }
        pool pppv6-pool {
            family inet6 {
                prefix $V6_POOL_PREFIX;
                range ndra-range prefix-length 64;
            }
        }
    }
}
```

## junos/subscriber-management/dp-auto-stacked-pwht-dhcp.conf

```
/*
 * Topic:   Dynamic-profile auto-stacked-pwht_dhcp (DHCP/IPoE pseudowire-headend session activation)
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - DHCP-flavoured sibling of auto-stacked-pwht. Invoked by ps11..20
 *    interfaces (ps-pseudowire-dhcp-ipoe.conf) on first packet from
 *    an IPoE/DHCP subscriber.
 *  - predefined-variable-defaults sets routing-instances dhcp-subs
 *    by default (instead of PPPOE_SUBS_1).
 *  - For each session it materializes:
 *      * a vlan-tagged demux subscriber unit on the ps interface,
 *      * family inet with auto-configure address-ranges referencing
 *        FOUR /16 networks (10.42-45.0.0/16) so the BNG can offer
 *        leases from any of them,
 *      * family inet6 with auto-configure prefix-ranges referencing
 *        FOUR /48 v6 prefixes,
 *      * router-advertisement on the new interface with managed +
 *        other-stateful (M+O bits set, "use DHCP for everything").
 *  - The address/prefix ranges all reference dynamic-profile
 *    prof_autosense_ipdemux for the actual demux unit (see
 *    dp-autosense-ipdemux.conf).
 *  - authentication uses pwht_dhcp + jnpr.net to build the username.
 *  - All $junos-* placeholders are runtime-resolved.
 *
 * Pair with:
 *  - junos/interfaces/ps-pseudowire-dhcp-ipoe.conf
 *  - junos/subscriber-management/dp-prod-dhcp-base.conf
 *  - junos/subscriber-management/dp-autosense-ipdemux.conf
 *  - junos/services/l3vpn-dhcp-subs.conf
 *
 * Variables:
 *   $USER_PASS         e.g. joshua
 *   $DOMAIN_NAME       e.g. jnpr.net
 *   $USER_PREFIX       e.g. pwht_dhcp
 *   $V4_NETS           e.g. 10.42.0.0/16, 10.43.0.0/16, 10.44.0.0/16, 10.45.0.0/16
 *   $V6_PREFIXES       e.g. fc00:125:140::/48, fc00:126:140::/48, fc00:127:140::/48, fc00:128:140::/48
 *   $RA_MIN            e.g. 30
 *   $RA_MAX            e.g. 60
 */
dynamic-profiles {
    auto-stacked-pwht_dhcp {
        predefined-variable-defaults {
            routing-instances dhcp-subs;
        }
        routing-instances {
            "$junos-routing-instance" {
                interface "$junos-interface-name";
            }
        }
        interfaces {
            "$junos-interface-ifd-name" {
                unit "$junos-interface-unit" {
                    no-traps;
                    proxy-arp unrestricted;
                    vlan-tags outer "$junos-stacked-vlan-id" inner "$junos-vlan-id";
                    demux-options {
                        underlying-interface "$junos-interface-ifd-name";
                    }
                    family inet {
                        mac-validate loose;
                        unnumbered-address "$junos-loopback-interface";
                        auto-configure {
                            address-ranges {
                                dynamic-profile prof_autosense_ipdemux {
                                    network 10.42.0.0/16;
                                    network 10.43.0.0/16;
                                    network 10.44.0.0/16;
                                    network 10.45.0.0/16;
                                }
                                authentication {
                                    password $USER_PASS;
                                    username-include {
                                        domain-name $DOMAIN_NAME;
                                        user-prefix $USER_PREFIX;
                                    }
                                }
                                session-timeout 600;
                            }
                        }
                    }
                    family inet6 {
                        unnumbered-address "$junos-loopback-interface";
                        auto-configure {
                            prefix-ranges {
                                dynamic-profile prof_autosense_ipdemux {
                                    prefix fc00:125:140::/48;
                                    prefix fc00:126:140::/48;
                                    prefix fc00:127:140::/48;
                                    prefix fc00:128:140::/48;
                                }
                                authentication {
                                    password $USER_PASS;
                                    username-include {
                                        domain-name $DOMAIN_NAME;
                                        user-prefix $USER_PREFIX;
                                    }
                                }
                                session-timeout 600;
                            }
                        }
                    }
                }
            }
        }
        protocols {
            router-advertisement {
                interface "$junos-interface-name" {
                    max-advertisement-interval $RA_MAX;
                    min-advertisement-interval $RA_MIN;
                    managed-configuration;
                    other-stateful-configuration;
                }
            }
        }
    }
}
```

## junos/subscriber-management/dp-auto-stacked-pwht-pppoe.conf

```
/*
 * Topic:   Dynamic-profile auto-stacked-pwht (PPPoE pseudowire-headend session activation)
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - This profile is invoked by `auto-configure stacked-vlan-ranges`
 *    on every ps0..9 interface (ps-pseudowire-pppoe.conf). Each new
 *    PPPoE session triggers a fresh instantiation, materializing:
 *      1) an interface-set per physical ifd holding the dynamic
 *         subscriber units (so per-port stats roll up cleanly),
 *      2) a stacked-vlan unit on the ps with mac-validate loose
 *         (accept any source MAC behind the customer CPE),
 *      3) a family pppoe with duplicate-protection +
 *         dynamic-profile prod-pppoe-dt-base (which spawns the actual
 *         pp0 session — see dp-prod-pppoe-dt-base.conf),
 *      4) routing-instances binding the new unit to PPPOE_SUBS_1 (the
 *         predefined-variable-default sets the VRF if RADIUS doesn't
 *         override).
 *  - actual-transit-statistics enables byte counters per session.
 *  - short-cycle-protection rate-limits PADI floods from a misbehaving
 *    client (lockout 5-60s).
 *  - $junos-* placeholders are filled at session-up by the BNG
 *    runtime — they are NOT user variables.
 *
 * Pair with:
 *  - junos/interfaces/ps-pseudowire-pppoe.conf
 *  - junos/subscriber-management/dp-prod-pppoe-dt-base.conf
 *  - junos/services/l3vpn-pppoe-subs.conf
 *  - junos/services/evpn-vpws-pppoe-bng.conf
 *
 * Variables: (none — all $junos-* variables are runtime-resolved by smg-service)
 */
dynamic-profiles {
    auto-stacked-pwht {
        predefined-variable-defaults {
            routing-instances PPPOE_SUBS_1;
        }
        routing-instances {
            "$junos-routing-instance" {
                interface "$junos-interface-name";
            }
        }
        interfaces {
            interface-set "$junos-phy-ifd-interface-set-name" {
                interface "$junos-interface-ifd-name" {
                    unit "$junos-interface-unit";
                }
            }
            "$junos-interface-ifd-name" {
                unit "$junos-interface-unit" {
                    actual-transit-statistics;
                    no-traps;
                    proxy-arp restricted;
                    vlan-tags outer "$junos-stacked-vlan-id" inner "$junos-vlan-id";
                    family inet {
                        mac-validate loose;
                        unnumbered-address lo0.0;
                    }
                    family inet6 {
                        unnumbered-address "$junos-loopback-interface";
                    }
                    family pppoe {
                        duplicate-protection;
                        dynamic-profile prod-pppoe-dt-base;
                        short-cycle-protection {
                            lockout-time-min 5;
                            lockout-time-max 60;
                        }
                    }
                }
            }
        }
    }
}
```

## junos/subscriber-management/dp-autosense-ipdemux.conf

```
/*
 * Topic:   Dynamic-profile prof_autosense_ipdemux (per-IP demux unit on demux0)
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - Invoked by the auto-configure address-ranges/prefix-ranges
 *    inside auto-stacked-pwht_dhcp when a subscriber's first packet
 *    is sensed (autosense). Spawns ONE demux0.x unit per detected
 *    IP/MAC pair.
 *  - Inside the routing-instance (predefined dhcp-subs) it installs
 *    an access-internal route for the auto-discovered subscriber IP
 *    (v4 and v6) with qualified-next-hop to the new demux unit —
 *    so return traffic resolves correctly.
 *  - On demux0 the new unit gets:
 *      * proxy-arp unrestricted (BNG answers ARP for any subscriber),
 *      * family inet/inet6 mac-validate loose,
 *      * unnumbered-address lo0.313 (the dhcp-subs VRF loopback).
 *
 * Pair with:
 *  - junos/subscriber-management/dp-auto-stacked-pwht-dhcp.conf
 *  - junos/services/l3vpn-dhcp-subs.conf
 *  - junos/subscriber-management/dp-prod-dhcp-base.conf
 *
 * Variables:
 *   $VRF_LO_UNIT  e.g. lo0.313  (the lo0 unit anchored in dhcp-subs)
 */
dynamic-profiles {
    prof_autosense_ipdemux {
        predefined-variable-defaults {
            routing-instances dhcp-subs;
        }
        routing-instances {
            "$junos-routing-instance" {
                interface "$junos-interface-name";
                routing-options {
                    rib inet6.0 {
                        access-internal {
                            route $junos-subscriber-ipv6-address {
                                qualified-next-hop "$junos-interface-name";
                            }
                        }
                    }
                    access-internal {
                        route $junos-subscriber-ip-address {
                            qualified-next-hop "$junos-interface-name";
                        }
                    }
                }
            }
        }
        interfaces {
            demux0 {
                unit "$junos-underlying-interface-unit" {
                    proxy-arp unrestricted;
                    family inet {
                        mac-validate loose;
                        unnumbered-address $VRF_LO_UNIT;
                    }
                    family inet6 {
                        unnumbered-address $VRF_LO_UNIT;
                    }
                }
            }
        }
    }
}
```

## junos/subscriber-management/dp-prod-dhcp-base.conf

```
/*
 * Topic:   Dynamic-profile prod-dhcp-base (DHCPv4 + DHCPv6 demux session base)
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - Bound to each new DHCP session by the dhcp-local-server config
 *    inside the dhcp-subs VRF (l3vpn-dhcp-subs.conf, group dhcp6-ls
 *    and dual-stack-group dhcp-ds).
 *  - Materializes a demux0 unit with:
 *      * actual-transit-statistics for per-session counters,
 *      * proxy-arp unrestricted,
 *      * demux-options underlying-interface bound to the session's ps,
 *      * family inet with rpf-check fail-filter rpf-pass-dhcp +
 *        demux-source $junos-subscriber-ip-address (so the FIB sees
 *        traffic from this exact source IP as legitimate),
 *      * family inet6 with rpf-check fail-filter rpf-pass-dhcpv6 +
 *        demux-source for v6,
 *      * unnumbered-address lo0.313 (the dhcp-subs VRF loopback).
 *  - routing-options access route adds framed-routes from RADIUS:
 *    `route $junos-framed-route-ip-address-prefix metric ...` is the
 *    session's downstream subnet, programmed only when present.
 *
 * Pair with:
 *  - junos/services/l3vpn-dhcp-subs.conf
 *  - junos/firewall/rpf-pass-dhcp.conf
 *  - junos/subscriber-management/dp-autosense-ipdemux.conf
 *  - junos/subscriber-management/dp-auto-stacked-pwht-dhcp.conf
 *
 * Variables:
 *   $VRF_LO_UNIT  e.g. lo0.313
 */
dynamic-profiles {
    prod-dhcp-base {
        predefined-variable-defaults {
            routing-instances dhcp-subs;
        }
        routing-instances {
            "$junos-routing-instance" {
                interface "$junos-interface-name";
                routing-options {
                    access {
                        route $junos-framed-route-ip-address-prefix metric "$junos-framed-route-cost";
                    }
                }
            }
        }
        interfaces {
            demux0 {
                unit "$junos-interface-unit" {
                    actual-transit-statistics;
                    proxy-arp unrestricted;
                    demux-options {
                        underlying-interface "$junos-underlying-interface";
                    }
                    family inet {
                        rpf-check fail-filter rpf-pass-dhcp;
                        demux-source {
                            $junos-subscriber-ip-address;
                        }
                        unnumbered-address $VRF_LO_UNIT;
                    }
                    family inet6 {
                        rpf-check fail-filter rpf-pass-dhcpv6;
                        demux-source {
                            "$junos-subscriber-ipv6-address";
                        }
                        unnumbered-address $VRF_LO_UNIT;
                    }
                }
            }
        }
    }
}
```

## junos/subscriber-management/dp-prod-pppoe-dt-base.conf

```
/*
 * Topic:   Dynamic-profile prod-pppoe-dt-base (per-session PPPoE pp0 unit)
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - Invoked by `family pppoe { dynamic-profile prod-pppoe-dt-base; }`
 *    inside auto-stacked-pwht (dp-auto-stacked-pwht-pppoe.conf) once
 *    a PPPoE session reaches LCP-up. Materializes a pp0.x unit with
 *    the PPPoE/PPP framing wired up.
 *  - ppp-options mru/mtu 1500 — standard PPP MTU, sized to fit
 *    inside the ps interface MTU 2022 with PPPoE/PPP overhead.
 *  - pppoe-options underlying-interface ties the pp0 to the demux
 *    unit on the ps that handed it the session.
 *  - keepalives interval 30 — LCP echo every 30s for liveness.
 *  - family inet rpf-check + clear-df-bit output filter (see
 *    rpf-pass-dhcp.conf for the filter definition).
 *  - unnumbered-address from RADIUS-supplied loopback per session
 *    (so addresses are RADIUS-attribute-driven, not config-driven).
 *  - protocols router-advertisement issues the per-session NDRA prefix
 *    that came from the IPv6 pool delegation.
 *  - predefined-variable-defaults sets routing-instances PPPOE_SUBS_1.
 *
 * Pair with:
 *  - junos/subscriber-management/dp-auto-stacked-pwht-pppoe.conf
 *  - junos/firewall/rpf-pass-dhcp.conf
 *  - junos/services/l3vpn-pppoe-subs.conf
 *
 * Variables: (none — all $junos-* are runtime-resolved)
 */
dynamic-profiles {
    prod-pppoe-dt-base {
        predefined-variable-defaults {
            routing-instances PPPOE_SUBS_1;
        }
        routing-instances {
            "$junos-routing-instance" {
                interface "$junos-interface-name";
            }
        }
        interfaces {
            pp0 {
                unit "$junos-interface-unit" {
                    actual-transit-statistics;
                    no-traps;
                    ppp-options {
                        mru 1500;
                        mtu 1500;
                    }
                    pppoe-options {
                        underlying-interface "$junos-underlying-interface";
                        server;
                    }
                    keepalives interval 30;
                    family inet {
                        rpf-check;
                        filter {
                            output clear-df-bit;
                        }
                        unnumbered-address "$junos-loopback-interface";
                    }
                    family inet6 {
                        unnumbered-address "$junos-loopback-interface";
                    }
                }
            }
        }
        protocols {
            router-advertisement {
                interface "$junos-interface-name" {
                    prefix $junos-ipv6-ndra-prefix;
                }
            }
        }
    }
}
```

## junos/subscriber-management/radius-server.conf

```
/*
 * Topic:   RADIUS server reachable through the RADIUS L3VPN
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - The RADIUS server lives behind cr1 (10.189.189.2). Source-address
 *    must be the BNG's loopback INSIDE the RADIUS VRF (192.168.17.17
 *    for bng1) so the reply path resolves through the VRF, not the
 *    main routing table.
 *  - routing-instance RADIUS pins the UDP transport to the VRF.
 *  - max-outstanding-requests 2000 + retry 3 are JVD-tuned for high
 *    BNG churn (fast reconnect bursts).
 *  - The two `radius-server` blocks (top-level and inside profile
 *    vlan-auth-access1) point at the same server with different
 *    secrets — one for non-AAA queries, one for the per-profile
 *    authentication. Keep them in sync.
 *
 * Pair with:
 *  - junos/services/l3vpn-radius.conf
 *  - junos/policy/vrf-radius-policies.conf
 *  - junos/subscriber-management/access-profile-radius.conf
 *
 * Variables (example values from bng1_mx304):
 *   $RADIUS_SERVER_V4   e.g. 10.189.189.2
 *   $RADIUS_PORT        e.g. 1812
 *   $RADIUS_SECRET      e.g. (Junos $9$-encrypted RADIUS secret)
 *   $RADIUS_SOURCE_V4   e.g. 192.168.17.17
 */
access {
    radius-server {
        $RADIUS_SERVER_V4 {
            port $RADIUS_PORT;
            secret $RADIUS_SECRET;
            timeout 10;
            retry 3;
            max-outstanding-requests 2000;
            source-address $RADIUS_SOURCE_V4;
            routing-instance RADIUS;
        }
    }
}
```

## junos/subscriber-management/system-services-subscriber-mgmt.conf

```
/*
 * Topic:   System services subscriber-management redundancy + ddos-protection autoconf/pppoe
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - subscriber-management { enable; } turns on the BNG personality.
 *  - subscriber-management redundancy declares the ps interfaces that
 *    participate in stateless rapid-reconnect (the BNG-pair model
 *    where a session can re-anchor on the partner BNG with a shared
 *    key per ps interface). One `interface psN.0 { shared-key ...; }`
 *    line per ps unit involved.
 *  - no-advertise-routes-on-backup keeps the standby BNG from
 *    advertising subscriber routes (avoids transient blackholes).
 *  - route-operation-interval 1 paces route programming during
 *    failover.
 *  - dynamic-profile-options versioning enables in-service updates of
 *    dynamic profiles without bouncing live sessions.
 *  - processes smg-service starts the subscriber-management gateway
 *    daemon.
 *  - ddos-protection limits autoconf and PPPoE PADSE rates to keep a
 *    misbehaving access circuit from filling the BNG control plane.
 *
 * Pair with:
 *  - junos/bootstrap/chassis-bng.conf
 *  - junos/interfaces/ps-pseudowire-pppoe.conf
 *  - junos/interfaces/ps-pseudowire-dhcp-ipoe.conf
 *
 * Variables (example values from bng1_mx304):
 *   $REDUNDANCY_PS_LIST   e.g. ps11.0..ps20.0   (one interface{} block each)
 *   $AUTOCONF_BW          e.g. 20000
 *   $AUTOCONF_BURST       e.g. 20000
 *   $PPPOE_PADSE_BW       e.g. 2000
 *   $PPPOE_PADSE_BURST    e.g. 100
 */
system {
    services {
        subscriber-management {
            enable;
            redundancy {
                interface ps11.0 {
                    shared-key ps11-key;
                }
                interface ps12.0 {
                    shared-key ps12-key;
                }
                interface ps13.0 {
                    shared-key ps13-key;
                }
                interface ps14.0 {
                    shared-key ps14-key;
                }
                interface ps15.0 {
                    shared-key ps15-key;
                }
                interface ps16.0 {
                    shared-key ps16-key;
                }
                interface ps17.0 {
                    shared-key ps17-key;
                }
                interface ps18.0 {
                    shared-key ps18-key;
                }
                interface ps19.0 {
                    shared-key ps19-key;
                }
                interface ps20.0 {
                    shared-key ps20-key;
                }
                no-advertise-routes-on-backup;
                route-operation-interval 1;
            }
        }
    }
    dynamic-profile-options {
        versioning;
    }
    processes {
        smg-service;
    }
    ddos-protection {
        protocols {
            autoconf {
                aggregate {
                    bandwidth $AUTOCONF_BW;
                    burst $AUTOCONF_BURST;
                }
            }
            pppoe {
                padse {
                    bandwidth $PPPOE_PADSE_BW;
                    burst $PPPOE_PADSE_BURST;
                }
            }
        }
    }
}
```

## junos/transport/bgp-overlay-pe-bng.conf

```
/*
 * Topic:   iBGP overlay from BNG PE to core route reflectors (multi-AF)
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - GR-IBGP-CR is the only overlay group on the BNG — it directly peers
 *    with the access RRs (agn1, agn2 = 192.168.0.5/.6) AND the core RR
 *    (cr1 = 192.168.0.11). The BNG is a leaf in the RR mesh, so it does
 *    not set `cluster` or `accept-remote-nexthop`.
 *  - inet labeled-unicast carries `resolve-vpn` so service routes
 *    learned via inet-vpn / inet6-vpn / evpn resolve over the SR-MPLS
 *    BGP-LU underlay rather than IGP next-hops. (The AGN/CR variants
 *    use `rib { inet.3 }` instead because they're transit reflectors.)
 *  - inet6 labeled-unicast resolves into inet6.3 (paired with
 *    `mpls ipv6-tunneling` for 6PE).
 *  - family evpn signaling is required for the EVPN-VPWS subscriber
 *    services (see services/evpn-vpws-*-bng.conf).
 *  - export [ PS-PPPOE-SUBSv6 PS-DHCP-SUBSv6 ] re-originates IPv6
 *    subscriber prefixes from the PPPOE_SUBS_1 / dhcp-subs VRFs into
 *    inet6 with the BNG's loopback as next-hop, so cr1 can leak them
 *    into VRF_Internet (see policy/subscriber-vrf-policies.conf).
 *  - vpn-apply-export at the bgp { } level is required so the export
 *    policies are applied on a per-neighbour basis for VPN AFs.
 *  - BFD 100ms x 3 for fast peer-down detection.
 *
 * Pair with:
 *  - junos/policy/subscriber-vrf-policies.conf
 *  - junos/services/l3vpn-pppoe-subs.conf
 *  - junos/services/l3vpn-dhcp-subs.conf
 *  - junos/services/evpn-vpws-pppoe-bng.conf
 *  - junos/services/evpn-vpws-fxc-bng.conf
 *  - junos/services/evpn-vpws-ipoe-bng.conf
 *
 * Variables (example values from bng1_mx304):
 *   $LOOPBACK_V4   e.g. 192.168.0.7
 *   $RR_AGN1_V4    e.g. 192.168.0.5
 *   $RR_AGN2_V4    e.g. 192.168.0.6
 *   $RR_CR_V4      e.g. 192.168.0.11
 */
protocols {
    bgp {
        vpn-apply-export;
        group GR-IBGP-CR {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
                    resolve-vpn;
                }
            }
            family inet-vpn {
                unicast;
            }
            family inet6 {
                labeled-unicast {
                    rib {
                        inet6.3;
                    }
                }
            }
            family inet6-vpn {
                unicast;
            }
            family evpn {
                signaling;
            }
            export [ PS-PPPOE-SUBSv6 PS-DHCP-SUBSv6 ];
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor $RR_AGN1_V4;
            neighbor $RR_AGN2_V4;
            neighbor $RR_CR_V4;
        }
    }
}
```

## junos/transport/isis-srmpls-tilfa.conf

```
/*
 * Topic:   ISIS L1 with SR-MPLS, TI-LFA node-protection, and microloop avoidance
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO:   agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 *
 * Highlights:
 *  - Single-area ISIS L1 is used end-to-end on access/aggregation/BNG;
 *    cr1 also runs L2 toward the core neighbour (et-0/0/18, ae1) and
 *    uses `level 2 wide-metrics-only` plus the stop_leak policy to
 *    contain L1 routes inside the metro. Other devices keep `level 2
 *    disable`.
 *  - Every transport interface enables post-convergence-lfa with a
 *    high node-protection cost (16777214) so TI-LFA primary paths win
 *    over node-protecting backups when both are available.
 *  - source-packet-routing explicit-null lights up SR-MPLS using the
 *    SRGB defined under `mpls label-range`. Loopback prefix-segments
 *    are advertised by PS-ISIS-EXPORT (see policy/isis-export-prefix-
 *    segment.conf).
 *  - microloop-avoidance with a 5s post-convergence delay holds the
 *    forwarding update until SPF settles network-wide.
 *  - backup-spf-options use-source-packet-routing tells ISIS to compute
 *    backups using SR labels (not LDP), and maximum-labels 5 caps the
 *    TI-LFA repair label stack depth.
 *  - traffic-engineering l3-unicast-topology + advertisement always
 *    populate the TED for SR/RSVP path computation.
 *
 * Pair with:
 *  - junos/transport/mpls-segment-routing.conf
 *  - junos/policy/isis-export-prefix-segment.conf
 *  - junos/interfaces/core-isis-mpls.conf
 *
 * Variables (example values from bng1_mx304):
 *   $CORE_INTF        e.g. et-0/0/2.0   (repeat the interface block per core link)
 *   $ISIS_LEVEL       e.g. 1            (use 2 on inter-area links such as cr1<->core)
 *   $L2_KNOB          e.g. disable      (use `wide-metrics-only` on cr1)
 *   $EXPORT_POLICY    e.g. PS-ISIS-EXPORT  (use `[ PS-ISIS-EXPORT stop_leak ]` on cr1)
 */
protocols {
    isis {
        interface $CORE_INTF {
            level $ISIS_LEVEL {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
            }
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
        interface lo0.0 {
            passive;
        }
        source-packet-routing explicit-null;
        level 1 wide-metrics-only;
        level 2 $L2_KNOB;
        spf-options {
            microloop-avoidance {
                post-convergence-path {
                    delay 5000;
                }
            }
            multipath {
                weighted one-hop;
            }
        }
        backup-spf-options {
            use-post-convergence-lfa maximum-labels 5;
            use-source-packet-routing;
        }
        traffic-engineering {
            l3-unicast-topology;
            advertisement always;
        }
        export $EXPORT_POLICY;
    }
}
```

## junos/transport/mpls-segment-routing.conf

```
/*
 * Topic:   MPLS SRGB and IPv6 tunneling for SR-MPLS
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO:   agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 *
 * Highlights:
 *  - srgb-label-range 800000 890000 reserves 90,000 labels for ISIS-SR
 *    node-segments. The PS-ISIS-EXPORT policy assigns per-loopback
 *    prefix-segment indices that fall inside this range (e.g. 1007 for
 *    bng1's IPv4 lo0, 4007 for the v6 lo0).
 *  - ipv6-tunneling enables 6PE-style IPv6 transport over the IPv4
 *    SR-MPLS underlay so `family inet6 labeled-unicast` BGP routes can
 *    resolve in inet6.3.
 *  - No `protocols mpls interface ...` list is needed — SR-MPLS forwarding
 *    is driven entirely by ISIS source-packet-routing on each transport
 *    interface (see core-isis-mpls.conf for `family mpls maximum-labels 16`).
 *
 * Pair with:
 *  - junos/transport/isis-srmpls-tilfa.conf
 *  - junos/interfaces/core-isis-mpls.conf
 *  - junos/policy/isis-export-prefix-segment.conf
 *
 * Variables (example values from bng1_mx304):
 *   $SRGB_START   e.g. 800000
 *   $SRGB_END     e.g. 890000
 */
protocols {
    mpls {
        label-range {
            srgb-label-range $SRGB_START $SRGB_END;
        }
        ipv6-tunneling;
    }
}
```

## junos/transport/routing-options-pe.conf

```
/*
 * Topic:   PE routing-options (router-id, AS, chained-composite-next-hop, rib-groups)
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *
 * Highlights:
 *  - chained-composite-next-hop ingress evpn collapses the EVPN egress
 *    label stack into a single composite next-hop entry per remote PE,
 *    cutting hardware FIB entries dramatically when many EVPN-VPWS
 *    services share the same MPLS path.
 *  - rib-groups interface_routes leaks IPv6 interface routes from the
 *    PPPOE_SUBS_1 VRF rib into inet6.0 so the BNG's main-table v6
 *    forwarding sees them — required because PPPoEv6 sessions auto-
 *    create access-internal routes inside the VRF.
 *  - nonstop-routing keeps the BGP/IS-IS state on standby RE in sync
 *    for graceful-switchover (chassis-bng.conf).
 *  - export PS-PPLB enables per-packet load-balance on the FIB.
 *
 * Pair with:
 *  - junos/policy/pplb.conf
 *  - junos/services/l3vpn-pppoe-subs.conf
 *  - junos/bootstrap/chassis-bng.conf
 *
 * Variables (example values from bng1_mx304):
 *   $ROUTER_ID    e.g. 192.168.0.7
 *   $LOCAL_AS     e.g. 65001
 *   $V6_VRF_RIB   e.g. PPPOE_SUBS_1.inet6.0
 */
routing-options {
    router-id $ROUTER_ID;
    autonomous-system $LOCAL_AS;
    rib-groups {
        interface_routes {
            import-rib [ $V6_VRF_RIB inet6.0 ];
        }
    }
    nonstop-routing;
    forwarding-table {
        export PS-PPLB;
        chained-composite-next-hop {
            ingress {
                evpn;
            }
        }
    }
}
```

## _variables.md

# Snippet variable glossary

All `.conf` files under `junos/` and `evo/` are templates: identifiers
that vary between deployments are written as `$VAR`. Render with the
same `snips_render.py` tool used elsewhere in the JVD repo.

Constants left as literals on purpose:
- Apply-group / policy / community names (PS-ISIS-EXPORT, PS-PPLB,
  PS-RADIUS-COMM, etc.) — they ARE the abstraction.
- Forwarding-class names, scheduler-map names — JVD-wide.
- Pool / dynamic-profile names (`pppv4-pool`, `auto-stacked-pwht`,
  `prod-dhcp-base`, …) — wired by the BNG runtime by name.
- All `$junos-*` placeholders inside dynamic-profiles — runtime-resolved
  by smg-service, NOT user-templatable.

## Identity / topology

| Variable | Meaning | Example | Used in |
|---|---|---|---|
| `$ROUTER_ID` | Device router-id (== lo0.0 IPv4) | `192.168.0.7` | transport/* |
| `$LOCAL_AS` | iBGP / overlay AS | `65001` | transport/* |
| `$LOOPBACK_V4` | This PE's lo0.0 IPv4 | `192.168.0.7` | transport/*, policy/* |
| `$LOOPBACK_V6` | This PE's lo0.0 IPv6 | `2001:db8::192:168:0:7` | policy/* |
| `$NODE_SID_V4` | ISIS-SR IPv4 node-segment index (1000+lastoctet in this JVD) | `1007` | policy/isis-export-prefix-segment.conf |
| `$NODE_SID_V6` | ISIS-SR IPv6 node-segment index (4000+lastoctet) | `4007` | policy/isis-export-prefix-segment.conf |
| `$SRGB_START` / `$SRGB_END` | MPLS SRGB label range | `800000` / `890000` | transport/mpls-segment-routing.conf |

## Neighbours / route reflectors

| Variable | Meaning | Example | Used in |
|---|---|---|---|
| `$RR_AGN1_V4` / `$RR_AGN2_V4` | Fabric (AGN) RR loopbacks | `192.168.0.5` / `192.168.0.6` | transport/bgp-overlay-* |
| `$RR_CR_V4` | Core (CR) RR loopback | `192.168.0.11` | transport/bgp-overlay-pe-bng.conf |
| `$AN1_V4`..`$AN5_V4` | Access-node loopbacks (RR clients) | `192.168.0.0`..`192.168.0.4` | transport/bgp-overlay-rr-fabric.conf |
| `$BNG1_V4`..`$BNG4_V4` | BNG loopbacks (RR clients) | `192.168.0.7`..`192.168.0.10` | transport/bgp-overlay-rr-* |
| `$AGN1_V4` / `$AGN2_V4` | Aggregation-node loopbacks (cr1 view) | `192.168.0.5` / `192.168.0.6` | transport/bgp-overlay-rr-core.conf |
| `$CR_V4` | Core RR loopback (AGN view) | `192.168.0.11` | transport/bgp-overlay-rr-fabric.conf |
| `$CE_PEER_V4` / `$CE_PEER_V6` | Internet eBGP peer addresses | `10.11.110.2` / `2001:db8::11:11:110:2` | services/l3vpn-internet.conf |
| `$CE_AS_V4` / `$CE_AS_V6` | Internet eBGP peer AS numbers | `200` / `300` | services/l3vpn-internet.conf |

## Interfaces (underlay)

| Variable | Meaning | Example | Used in |
|---|---|---|---|
| `$CORE_INTF` | Core-facing IS-IS unit | `et-0/0/2.0` | transport/isis-srmpls-tilfa.conf |
| `$CORE_PHYS` | Core-facing physical interface | `et-0/0/2` | interfaces/core-isis-mpls.conf |
| `$CORE_DESC` | JVD-style link description | `R7-BNG1-To-R6-AGN2` | interfaces/core-isis-mpls.conf |
| `$CORE_V4` / `$CORE_V6` | Underlay link addresses | `10.10.67.2/24` / `2001:db8::10:10:67:1:2/120` | interfaces/core-isis-mpls.conf |
| `$ISIS_LEVEL` | ISIS level on this interface | `1` (or `2` on cr1's L2 links) | transport/isis-srmpls-tilfa.conf |
| `$L2_KNOB` | `level 2` mode | `disable` (or `wide-metrics-only` on cr1) | transport/isis-srmpls-tilfa.conf |
| `$EXPORT_POLICY` | ISIS export policy reference | `PS-ISIS-EXPORT` (or `[ PS-ISIS-EXPORT stop_leak ]` on cr1) | transport/isis-srmpls-tilfa.conf |
| `$V6_VRF_RIB` | VRF v6 rib leaked into inet6.0 | `PPPOE_SUBS_1.inet6.0` | transport/routing-options-pe.conf |

## Interfaces (subscriber & access)

| Variable | Meaning | Example | Used in |
|---|---|---|---|
| `$PS_DEV` | Pseudowire-headend ifd | `ps0`, `ps11` | interfaces/ps-pseudowire-* |
| `$PS_AC` | psN.0 attachment-circuit unit | `ps1.0`, `ps11.0`, `ps31.0` | services/evpn-vpws-*-bng.conf |
| `$ANCHOR_LT` | logical-tunnel anchor | `lt-0/0/0` | interfaces/ps-pseudowire-* |
| `$DYN_PROFILE` | Dynamic-profile invoked by auto-configure | `auto-stacked-pwht`, `auto-stacked-pwht_dhcp` | interfaces/ps-pseudowire-* |
| `$ESI_VALUE` | Per-ps ESI for EVPN multihoming | `00:10:12:12:12:12:12:00:00:31` | interfaces/ps-pseudowire-* |
| `$DF_PREFERENCE` | df-election-type preference value | `1000` (preferred) / `995` (backup) | interfaces/ps-pseudowire-* |
| `$STATIC_MAC` | Override MAC on ps interface (DHCP) | `aa:aa:aa:bb:bb:bb` | interfaces/ps-pseudowire-dhcp-ipoe.conf |
| `$MTU` | ps interface MTU | `2022` | interfaces/ps-pseudowire-* |
| `$AC_INTF` | AN-side EVPN-VPWS attachment-circuit unit | `ae1.1041` | services/evpn-vpws-an.conf |
| `$AC1` / `$AC2` | FXC bundle members on the AN | `ae0.1061` / `ae0.1062` | services/evpn-vpws-fxc-an.conf |
| `$LAG`, `$LAG_FXC`, `$LAG_PERSUB` | Aggregated-Ethernet device names | `ae0`, `ae1` | interfaces/ae-vlan-bridge-* |
| `$LAG_VLAN_UNIT` / `$LAG_VLAN_ID` | per-subscriber VLAN unit/id | `1031` / `1031` | interfaces/ae-vlan-bridge-fxc-sw.conf |
| `$CPE_PORT` | sw1/sw2 CPE-facing breakout port | `xe-0/0/0:3` | interfaces/ae-vlan-bridge-fxc-sw.conf |
| `$BD_NAME` | sw1/sw2 bridge-domain name | `bd_group_1031` | interfaces/ae-vlan-bridge-fxc-sw.conf |
| `$FXC_VLAN_UNIT` | AN FXC LAG unit/vlan | `1061` | interfaces/ae-vlan-bridge-an.conf |
| `$PERSUB_VLAN_UNIT` | AN per-subscriber LAG unit/vlan | `1031` | interfaces/ae-vlan-bridge-an.conf |
| `$FXC_ESI` | Shared LAG-level ESI for FXC | `00:15:15:15:00:00:00:15:15:15` | interfaces/ae-vlan-bridge-an.conf, services/evpn-vpws-fxc-an.conf |
| `$PERSUB_ESI_VALUE` | Per-unit ESI for per-subscriber EVPN-VPWS | `00:10:11:11:11:11:11:00:00:31` | interfaces/ae-vlan-bridge-an.conf |
| `$LACP_SYSID_FXC` / `$LACP_SYSID_PERSUB` | LACP system-id overrides on AN LAGs | `00:00:00:00:01:01` / `00:00:00:00:02:02` | interfaces/ae-vlan-bridge-an.conf |

## Services (EVPN-VPWS / L3VPN)

| Variable | Meaning | Example | Used in |
|---|---|---|---|
| `$INSTANCE_NAME` | routing-instance name | `METRO_BBE_EVPN_VPWS_PPPoE_GROUP_1` | services/evpn-vpws-* |
| `$VRF_NAME` | L3VPN routing-instance name | `PPPOE_SUBS_1`, `dhcp-subs` | services/l3vpn-* |
| `$RD_LOOPBACK_V4` | Loopback used as RD-prefix | `192.168.107.107` (BNG-side), `100.100.100.100` (AN-side) | services/* |
| `$RD_ID` | RD tail integer | `1031` | services/* |
| `$RT_AS` / `$RT_ID` | Route-target AS:ID pair | `60000`:`1031` | services/evpn-vpws-* |
| `$VPWS_LOCAL_ID` / `$VPWS_REMOTE_ID` | EVPN-VPWS service-id pair | `21` / `1` | services/evpn-vpws-* |
| `$SVC_LOCAL` / `$SVC_REMOTE` | FXC group service-id pair | `5001` / `6001` | services/evpn-vpws-fxc-an.conf |
| `$LO_UNIT` | VRF loopback unit | `lo0.1`, `lo0.7`, `lo0.11`, `lo0.313` | services/l3vpn-* |
| `$VRF_IMPORT_POL` / `$VRF_EXPORT_POL` | Per-VRF import/export policy refs | `PS-PPPOE-SUBS-1-VRF-IMPORT` / `-EXPORT` | services/l3vpn-* |
| `$V4_AGGREGATE` / `$V6_AGGREGATE` | Subscriber-pool aggregate prefixes | `10.25.0.0/16` / `fc00:25:140::/48` | services/l3vpn-pppoe-subs.conf |
| `$V4_POOL` / `$V6_POOL` | DHCP pool names | `dhcp_v4_pool` / `dhcp_v6_pool` | services/l3vpn-dhcp-subs.conf |
| `$V4_NETWORK` | DHCP v4 pool network | `10.42.0.0/16` | services/l3vpn-dhcp-subs.conf |
| `$V4_RANGE_LOW` / `$V4_RANGE_HIGH` | DHCP v4 lease range | `10.42.0.2` / `10.42.255.254` | services/l3vpn-dhcp-subs.conf |
| `$V4_GATEWAY` | DHCP server-identifier + router option | `10.42.0.1` | services/l3vpn-dhcp-subs.conf |
| `$V6_PREFIX` | DHCPv6 pool prefix | `fc00:125:140::/64` | services/l3vpn-dhcp-subs.conf |
| `$V6_RANGE_LOW` / `$V6_RANGE_HIGH` | DHCPv6 range | `fc00:125:140::2/128` / `fc00:125:140::ffff/128` | services/l3vpn-dhcp-subs.conf |
| `$LEASE_TIME` | dhcp-attributes maximum-lease-time (s) | `600` | services/l3vpn-dhcp-subs.conf |
| `$V6_RIB` | rib for IPv6 aggregate inside VRF | `PPPOE_SUBS_1.inet6.0` | services/l3vpn-pppoe-subs.conf |
| `$V4_POOL_NETWORK` / `$V6_POOL_PREFIX` | PPPoE pool prefixes | `10.25.0.0/16` / `fc00:25:140::/48` | services/l3vpn-pppoe-subs.conf, subscriber-management/address-assignment-pools.conf |
| `$AUTH_PROFILE` | RADIUS access-profile reference | `vlan-auth-access1` | interfaces/ps-pseudowire-*, services/l3vpn-dhcp-subs.conf |
| `$RADIUS_INTF` | RADIUS-VRF interface on cr1 | `et-0/0/20:0.0` | services/l3vpn-radius.conf |
| `$CE_INTF` | VRF_Internet eBGP interface | `et-0/0/26:1.0` | services/l3vpn-internet.conf |

## Chassis / boot / subscriber-management

| Variable | Meaning | Example | Used in |
|---|---|---|---|
| `$PS_DEVICE_COUNT` | chassis pseudowire-service device-count | `100` | bootstrap/chassis-bng.conf |
| `$TS_FPC` / `$TS_PIC` / `$TS_BW` | tunnel-services FPC/PIC/bandwidth | `0` / `0` / `100g` | bootstrap/chassis-bng.conf |
| `$NAS_ID` | RADIUS NAS-Identifier | `R7-BNG1` | subscriber-management/access-profile-radius.conf |
| `$RADIUS_SERVER_V4` | RADIUS server address | `10.189.189.2` | subscriber-management/* |
| `$RADIUS_PORT` | RADIUS server UDP port | `1812` | subscriber-management/radius-server.conf |
| `$RADIUS_SECRET` / `$RADIUS_SECRET_AUTH` / `$RADIUS_SECRET_ACCT` | Encrypted RADIUS secrets | `$9$...` (Junos type-9) | subscriber-management/* |
| `$RADIUS_SOURCE_V4` | RADIUS source-address (in RADIUS VRF) | `192.168.17.17` | subscriber-management/* |
| `$AUTOCONF_BW` / `$AUTOCONF_BURST` | ddos-protection autoconf rate-limits | `20000` / `20000` | subscriber-management/system-services-subscriber-mgmt.conf |
| `$PPPOE_PADSE_BW` / `$PPPOE_PADSE_BURST` | ddos-protection PPPoE PADSE rate-limits | `2000` / `100` | subscriber-management/system-services-subscriber-mgmt.conf |
| `$USER_PASS` | dynamic-profile RADIUS password | `joshua` | interfaces/ps-pseudowire-*, services/l3vpn-dhcp-subs.conf, subscriber-management/dp-auto-stacked-* |
| `$USER_PREFIX` | dynamic-profile username prefix | `pwht_pppoe`, `pwht_dhcp` | (same as `$USER_PASS`) |
| `$DOMAIN_NAME` | dynamic-profile username domain | `jnpr.net` | (same as `$USER_PASS`) |
| `$RA_MIN` / `$RA_MAX` | router-advertisement intervals | `30` / `60` | subscriber-management/dp-auto-stacked-pwht-dhcp.conf |
| `$VRF_LO_UNIT` | dhcp-subs VRF loopback unit | `lo0.313` | subscriber-management/dp-prod-dhcp-base.conf, dp-autosense-ipdemux.conf |

## Policy

| Variable | Meaning | Example | Used in |
|---|---|---|---|
| `$PL_AN_REGION_LIST` | Prefix-list of AN+BNG client loopbacks | `192.168.0.0..0.4 192.168.0.7 192.168.0.8` | policy/bgp-rr-export.conf |
| `$PL_CORE_LIST` | Prefix-list of CORE loopbacks (per RR view) | `192.168.0.7 .8 .11` (AGN view); `192.168.0.9 .10` (cr1 view) | policy/bgp-rr-export.conf |

## byoai/TIERS.md

# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each service kind at each verbosity tier. It is bundled into [`jvd-bbe-snips.md`](jvd-bbe-snips.md) by `regenerate-bundle.sh`.

For each service kind, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. Use the OS-appropriate file: **AN/AGN/CR = `evo/`**, **BNG/switch = `junos/`**.

---

## What the tiers mean

| Tier | Use when | What's included |
|---|---|---|
| **`minimum`** | Brownfield change. Device already has working IS-IS/SR underlay AND its iBGP overlay. You just want the new service. | Service routing-instance + attachment-circuit interface + the service's mandatory `Pair with:` snips. **No transport/bootstrap.** |
| **`with-overlay`** | Brownfield-ish. Underlay is up but you want to (re)assert the device's iBGP overlay activation. | `minimum` + the role's overlay snip (`bgp-overlay-pe-an` / `bgp-overlay-pe-bng` / `bgp-overlay-rr-core`). |
| **`as-deployed`** | Greenfield turn-up, lab build, or "give me a working end-to-end example." Mirrors what the JVD validates. | Everything: service + AC + overlay + the role baseline (IS-IS/SR underlay, MPLS SRGB, policies, and — for BNGs — chassis + subscriber-management + RADIUS bootstrap). |

> **Greenfield / bootstrap requests** (e.g. "build a new ACX7024 AN turn-up", "bootstrap a new MX304 BNG end-to-end") are always treated as **`as-deployed`**.

If the user picks `minimum` and the AI cannot tell whether the iBGP overlay is already on the device, it should call that out in the `Notes:` section.

---

## Shared role baselines (the `as-deployed` foundation)

Every `as-deployed` service adds the baseline for the device's role. OS-select each file.

### AN / AGN / CR transport baseline (`evo/`)
- `transport/isis-srmpls-tilfa.conf` — IS-IS L1/L2 with SR-MPLS + TI-LFA node protection
- `transport/mpls-segment-routing.conf` — MPLS SRGB + IPv6 tunneling
- `transport/routing-options-pe.conf` — router-id, AS, chained-composite-next-hop
- `interfaces/core-isis-mpls.conf` — core-facing IS-IS/MPLS interface
- `policy/isis-export-prefix-segment.conf` — per-loopback SR prefix-segment
- `policy/pplb.conf` — per-packet load-balance
- overlay: `transport/bgp-overlay-pe-an.conf` (AN); `transport/bgp-overlay-rr-fabric.conf` + `policy/bgp-rr-export.conf` (AGN); `transport/bgp-overlay-rr-core.conf` + `policy/bgp-rr-export.conf` (CR)

### BNG bootstrap + transport baseline (`junos/`)
- `transport/isis-srmpls-tilfa.conf` + `transport/mpls-segment-routing.conf` + `transport/routing-options-pe.conf` + `interfaces/core-isis-mpls.conf` + `policy/isis-export-prefix-segment.conf` + `policy/pplb.conf`
- overlay: `transport/bgp-overlay-pe-bng.conf`
- `bootstrap/chassis-bng.conf` — ECMP, GRES, `pseudowire-service`, `tunnel-services` (**PWHT prerequisite**)
- `subscriber-management/system-services-subscriber-mgmt.conf` — subscriber-management redundancy + ddos-protection
- `subscriber-management/radius-server.conf` + `subscriber-management/access-profile-radius.conf` — RADIUS AAA
- `subscriber-management/address-assignment-pools.conf` — global subscriber pools
- `policy/communities.conf` + `policy/subscriber-vrf-policies.conf` — community palette + subscriber VRF policies

> **BNG prerequisite (flag in Notes for greenfield):** `chassis pseudowire-service device-count` + `tunnel-services` (from `bootstrap/chassis-bng.conf`) and `system services subscriber-management` MUST be present before any `ps` pseudowire-headend / dynamic-profile activates.

---

## EVPN-VPWS PPPoE — BNG side (subscriber PPPoE via PWHT)

**minimum** (just the service)
- `junos/services/evpn-vpws-pppoe-bng.conf`
- `junos/interfaces/ps-pseudowire-pppoe.conf` (the `ps` attachment circuit)
- `junos/subscriber-management/dp-auto-stacked-pwht-pppoe.conf` (session-activation dynamic-profile)
- `junos/subscriber-management/dp-prod-pppoe-dt-base.conf` (per-session pp0 dynamic-profile)
- `junos/services/l3vpn-pppoe-subs.conf` (subscriber VRF + pool)
- `junos/subscriber-management/address-assignment-pools.conf`
- `junos/policy/subscriber-vrf-policies.conf`

**with-overlay** (= minimum +)
- `junos/transport/bgp-overlay-pe-bng.conf`

**as-deployed** (= with-overlay + BNG bootstrap + transport baseline)

---

## EVPN-VPWS IPoE/DHCP — BNG side (subscriber DHCP/IPoE via PWHT)

**minimum** (just the service)
- `junos/services/evpn-vpws-ipoe-bng.conf`
- `junos/interfaces/ps-pseudowire-dhcp-ipoe.conf`
- `junos/subscriber-management/dp-auto-stacked-pwht-dhcp.conf`
- `junos/subscriber-management/dp-prod-dhcp-base.conf`
- `junos/subscriber-management/dp-autosense-ipdemux.conf`
- `junos/services/l3vpn-dhcp-subs.conf` (VRF + embedded `dhcp-local-server`)
- `junos/policy/subscriber-vrf-policies.conf`
- `junos/firewall/rpf-pass-dhcp.conf`

**with-overlay** (= minimum +)
- `junos/transport/bgp-overlay-pe-bng.conf`

**as-deployed** (= with-overlay + BNG bootstrap + transport baseline)

---

## EVPN-VPWS FXC — BNG side (Flexible Cross-Connect PWHT)

**minimum** (just the service)
- `junos/services/evpn-vpws-fxc-bng.conf`
- `junos/interfaces/ps-pseudowire-dhcp-ipoe.conf`
- `junos/services/l3vpn-dhcp-subs.conf`

**with-overlay** (= minimum +)
- `junos/transport/bgp-overlay-pe-bng.conf`

**as-deployed** (= with-overlay + BNG bootstrap + transport baseline)

---

## EVPN-VPWS — AN side (per-subscriber-group pseudowires)

**minimum** (just the service)
- `evo/services/evpn-vpws-an.conf`
- `evo/interfaces/ae-vlan-bridge-an.conf` (access LAG with vlan-ccc + ESI)

**with-overlay** (= minimum +)
- `evo/transport/bgp-overlay-pe-an.conf`

**as-deployed** (= with-overlay + AN transport baseline)

---

## EVPN-VPWS FXC — AN side (Flexible Cross-Connect)

**minimum** (just the service)
- `evo/services/evpn-vpws-fxc-an.conf`
- `evo/interfaces/ae-vlan-bridge-an.conf`

**with-overlay** (= minimum +)
- `evo/transport/bgp-overlay-pe-an.conf`

**as-deployed** (= with-overlay + AN transport baseline)

---

## L3VPN Internet — CR side

**minimum** (just the service)
- `evo/services/l3vpn-internet.conf` (Internet VRF, eBGP to upstream CE)
- `evo/policy/vrf-internet-policies.conf`
- `evo/policy/communities.conf`

**with-overlay** (= minimum +)
- `evo/transport/bgp-overlay-rr-core.conf`

**as-deployed** (= with-overlay + AN/AGN/CR transport baseline)

---

## L3VPN RADIUS — RADIUS reachability VRF

**minimum** (just the service)
- OS-select `junos/services/l3vpn-radius.conf` (BNG) or `evo/services/l3vpn-radius.conf` (CR)
- OS-select `junos/policy/vrf-radius-policies.conf` or `evo/policy/vrf-radius-policies.conf`
- `junos/subscriber-management/radius-server.conf` (BNG side)

**with-overlay** (= minimum +)
- `junos/transport/bgp-overlay-pe-bng.conf` (BNG) or `evo/transport/bgp-overlay-rr-core.conf` (CR)

**as-deployed** (= with-overlay + role baseline)

---

## Access switch LAG (QFX helper, toward AN)

**minimum**
- `junos/interfaces/ae-vlan-bridge-fxc-sw.conf`

*(The access switches are helper devices — no overlay/underlay baseline applies.)*

---

## Add-a-feature requests (no full service)

When the user asks to add a supporting feature to an existing device, emit ONLY that snip set (OS-select):
- **Underlay / IS-IS SR-MPLS** → `transport/isis-srmpls-tilfa.conf` + `transport/mpls-segment-routing.conf` + `interfaces/core-isis-mpls.conf` + `policy/isis-export-prefix-segment.conf`
- **iBGP overlay** → the role snip: `transport/bgp-overlay-pe-an.conf` (AN) / `transport/bgp-overlay-pe-bng.conf` (BNG) / `transport/bgp-overlay-rr-fabric.conf` (AGN) / `transport/bgp-overlay-rr-core.conf` (CR) + `policy/bgp-rr-export.conf` (RRs)
- **BNG bootstrap** → `junos/bootstrap/chassis-bng.conf` + `junos/subscriber-management/system-services-subscriber-mgmt.conf`
- **RADIUS AAA** → `junos/subscriber-management/radius-server.conf` + `junos/subscriber-management/access-profile-radius.conf`
- **Load-balancing** → `policy/pplb.conf` (+ `transport/routing-options-pe.conf` for the chained-composite-next-hop knob)
- **uRPF fail-filter (DHCP)** → `junos/firewall/rpf-pass-dhcp.conf`

## byoai/DEFAULTS.md

# Auto-Fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default values the AI uses in `auto` mode (or when the user short-circuits with `all defaults` / `use defaults` / `skip`). It is bundled into [`jvd-bbe-snips.md`](jvd-bbe-snips.md) by `regenerate-bundle.sh`.

Use these values EXACTLY. Do not invent alternative defaults. Every value the AI auto-fills MUST be listed in the output's `Inputs used:` block so the user can rerun with edits.

Addressing follows the JVD lab: `192.168.0.0/24` loopbacks, private AS, and documentation-range subscriber pools.

---

## Device inventory (the JVD topology)

| Device | OS family | Role | Loopback (lo0.0 / router-id) |
|--------|-----------|------|------------------------------|
| `an1_acx7024` | EVO | Access Node (AN) | `192.168.0.0` |
| `an2_acx7100-48l` | EVO | Access Node (AN) | `192.168.0.1` |
| `an3_acx7100-48l` | EVO | Access Node (AN) | `192.168.0.2` |
| `an4_acx7100-48l` | EVO | Access Node (AN) | `192.168.0.3` |
| `an5_acx7100-48l` | EVO | Access Node (AN) | `192.168.0.4` |
| `agn1_acx7100-32c` | EVO | Aggregation Node (AGN) / fabric RR | `192.168.0.5` |
| `agn2_acx7100-32c` | EVO | Aggregation Node (AGN) / fabric RR | `192.168.0.6` |
| `bng1_mx304` | Junos | BNG (Group A) | `192.168.0.7` |
| `bng2_mx204` | Junos | BNG (Group A) | `192.168.0.8` |
| `bng3_mx10004` | Junos | BNG (Group B) | `192.168.0.9` |
| `bng4_mx480` | Junos | BNG (Group B) | `192.168.0.10` |
| `cr1_ptx10004` | EVO | Core Router / core RR | `192.168.0.11` |
| `sw1_qfx5120-32c` | Junos | Access switch (helper) | — |
| `sw2_qfx5210-64c` | Junos | Access switch (helper) | — |

**Device-choice shortcuts** (offered in the clarifying question):
- `AN` → `an1_acx7024` + `an2_acx7100-48l` (EVO access pair)
- `BNG` → `bng1_mx304` + `bng2_mx204` (Junos BNG pair, Group A)
- `PAIR` → `an1_acx7024` (EVO AN) + `bng1_mx304` (Junos BNG) — the end-to-end EVPN-VPWS PWHT service pair
- `CR` → `cr1_ptx10004` (EVO core, for Internet / RADIUS VRF)

The AGNs (`agn1/2`) and CR (`cr1`) are the route reflectors — subscriber services are NOT instantiated on them (they carry transport + Internet/RADIUS VRFs only).

> **OS rule:** ANs / AGNs / CR are **EVO**; BNGs and access switches are **Junos**. All subscriber-management, dynamic-profile, `ps` pseudowire-headend, and BNG chassis snips are **Junos-only** (the BNGs are MX). An EVPN-VPWS service is end-to-end: generate the **AN half** (`evo/`) and the **BNG half** (`junos/`), keeping the shared identifiers matched (see cross-endpoint rule below).

---

## Transport / underlay defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$LOCAL_AS` | `65001` | single iBGP overlay AS, all devices |
| `$ROUTER_ID` / `$LOOPBACK_V4` | = device lo0.0 (see table) | per device |
| `$LOOPBACK_V6` | `2001:db8::192:168:0:<n>` | per device |
| `$RR_AGN1_V4` / `$RR_AGN2_V4` | `192.168.0.5` / `192.168.0.6` | fabric (AGN) route reflectors |
| `$RR_CR_V4` | `192.168.0.11` | core (CR) route reflector |
| `$SRGB_START` / `$SRGB_END` | `800000` / `890000` | MPLS SRGB, domain-wide |
| `$NODE_SID_V4` | `1000 + last octet of lo0` | e.g. bng1 (.7) → `1007` |
| `$NODE_SID_V6` | `4000 + last octet of lo0` | e.g. bng1 (.7) → `4007` |
| `$ISIS_LEVEL` | `1` (metro/access), `2` (cr1 core links) | per interface |
| `$MTU` (core / access LAG) | `9102` | underlay + AN access LAG |
| `$MTU` (ps interface) | `2022` | pseudowire-headend interface |

---

## LAG / interface defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$LAG` / `$LAG_PERSUB` | `ae1` | AN per-subscriber-group access LAG (toward sw) |
| `$LAG_FXC` | `ae0` | AN FXC access LAG |
| `$LACP_SYSID_PERSUB` / `$LACP_SYSID_FXC` | `00:00:00:00:02:02` / `00:00:00:00:01:01` | AN LACP system-id overrides |
| `$PS_DEV` | `ps0`, `ps11`, `ps31`, … | BNG pseudowire-headend ifd (one per subscriber group) |
| `$ANCHOR_LT` | `lt-0/0/0` | logical-tunnel anchor for the `ps` interface |

---

## Service identifiers (EVPN-VPWS PWHT)

Each subscriber group is a distinct EVPN-VPWS routing-instance terminated by PWHT.

| Variable | Rule / default | Example |
|----------|----------------|---------|
| `$INSTANCE_NAME` | `METRO_BBE_EVPN_VPWS_<PPPoE\|IPoE>_GROUP_<n>` | `METRO_BBE_EVPN_VPWS_PPPoE_GROUP_1` |
| Subscriber group id (`$RD_ID`) | PPPoE groups `1031–1040`, IPoE groups `1041–1050` | `1031` |
| `$RD_LOOPBACK_V4` (BNG side) | BNG "subscriber" loopback `192.168.10X.10X` (NOT lo0.0) | bng1 `192.168.107.107`, bng2 `108.108`, bng3 `109.109`, bng4 `110.110` |
| `$RD_LOOPBACK_V4` (AN side) | AN "subscriber" loopback `10X.10X.10X.10X` | an4 `103.103.103.103`, an5 `104.104.104.104` |
| `$RT_AS` : `$RT_ID` | `target:60000:<group-id>` — AS `60000` is the EVPN-VPWS service plane | `target:60000:1031` |
| `$VPWS_LOCAL_ID` / `$VPWS_REMOTE_ID` (PPPoE) | AN `local 1–10` / `remote 21–30`; BNG `local 21–30` / `remote 1–10` | AN `1`/`21`, BNG `21`/`1` |
| `$VPWS_LOCAL_ID` / `$VPWS_REMOTE_ID` (IPoE) | AN `local 11–20` / `remote 31–40`; BNG `local 31–40` / `remote 11–20` | AN `11`/`31`, BNG `31`/`11` |
| `$SVC_LOCAL` / `$SVC_REMOTE` (FXC group) | `5001` / `6001` | FXC bundle service-id pair |

**Cross-endpoint rule:** the route-target, the ESI value, and the VPWS service-id pair MUST match across the AN and BNG halves (AN `local` == BNG `remote`, and vice-versa). Per-device identifiers (loopback, RD, `ps`/`ae` unit) differ.

---

## ESI (multihoming) defaults

- **AN per-subscriber (all-active):** `00:10:11:11:11:11:11:00:00:<nn>` on the access LAG unit; the trailing octet is per-group.
- **AN FXC (shared, all-active):** `00:15:15:15:00:00:00:15:15:15` — one LAG-level ESI for the whole FXC bundle.
- **BNG `ps` (single-active):** `00:10:12:12:12:12:12:00:00:<nn>` with `df-election-type preference` — **1000** on the primary BNG, **995** on the backup BNG of the pair.

---

## L3VPN / subscriber-pool defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$VRF_NAME` | `PPPOE_SUBS_1` (PPPoE), `dhcp-subs` (DHCP/IPoE) | subscriber L3VPN VRF |
| `$LO_UNIT` | `lo0.1` (PPPoE), `lo0.313` (DHCP) | VRF loopback unit |
| `$V4_POOL_NETWORK` / `$V6_POOL_PREFIX` (PPPoE) | `10.25.0.0/16` / `fc00:25:140::/48` | address-assignment pool |
| `$V4_NETWORK` (DHCP) | `10.42.0.0/16` (range `.0.2`–`.255.254`, gw `.0.1`) | dhcp-local-server pool |
| `$V6_PREFIX` (DHCP) | `fc00:125:140::/64` | DHCPv6 pool |
| `$LEASE_TIME` | `600` | DHCP maximum-lease-time (s) |
| Dynamic-profile names | `auto-stacked-pwht` (PPPoE), `auto-stacked-pwht_dhcp` (DHCP), `prod-pppoe-dt-base`, `prod-dhcp-base`, `prof_autosense_ipdemux` | wired by name — leave literal |

---

## RADIUS / subscriber-management defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$AUTH_PROFILE` | `vlan-auth-access1` | AAA access-profile invoked by the `ps` auto-configure |
| `$RADIUS_SERVER_V4` | `10.189.189.2` | reached through the RADIUS L3VPN |
| `$RADIUS_PORT` | `1812` | RADIUS UDP port |
| `$RADIUS_SOURCE_V4` | `192.168.17.17` | RADIUS source-address (in RADIUS VRF) |
| `$NAS_ID` | = device short tag | e.g. `R7-BNG1` |
| `$USER_PREFIX` / `$USER_PASS` / `$DOMAIN_NAME` | `pwht_pppoe` or `pwht_dhcp` / `joshua` / `jnpr.net` | dynamic-profile username construction |
| `$PS_DEVICE_COUNT` | `100` | chassis `pseudowire-service device-count` |

> The `$junos-*` placeholders inside `dynamic-profiles` are **runtime-resolved by the BNG `smg-service` daemon** — they are NOT user variables. Leave them literal in rendered config.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-bbe-snips.md`](jvd-bbe-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum" or "with-overlay"
# devices:
#   an: { name: <hostname>, os: evo, loopback4: <addr> }
#   bng: { name: <hostname>, os: junos, loopback4: <addr>, rd_loopback4: <addr> }
# services:
#   - { kind: <evpn-vpws-pppoe|evpn-vpws-ipoe|evpn-vpws-fxc|evpn-vpws-an|evpn-vpws-fxc-an|l3vpn-internet|l3vpn-radius|access-switch>,
#       count: <int>,
#       group_id: <int>,          # subscriber-group id (RD/RT tail)
#       vpws_local: <int>,        # service-id pair (AN local == BNG remote)
#       vpws_remote: <int>,
#       rt: <target:60000:...>,
#       esi_base: <hex>,          # per-group ESI; df-preference for BNG ps
#       vrf: <PPPOE_SUBS_1|dhcp-subs> }
# snips_used:
#   - junos/services/evpn-vpws-pppoe-bng.conf
#   - evo/services/evpn-vpws-an.conf
#   - ...
```

This block makes every generation reproducible — the user can paste it back to regenerate the same output.

## 2. One fenced `text` block per device

Each device block starts with a `# device:` label and groups its snips with `/* snips/<path> */` section comments:

```text
# device: <hostname>
/* snips/<path-to-snip>.conf */
<rendered config block>

/* snips/<path-to-next-snip>.conf */
<rendered config block>
```

For an end-to-end EVPN-VPWS service, emit the **AN half** (`evo/`) and the **BNG half** (`junos/`) as separate device blocks. Drop the leading C-style `/* … */` documentation header from each snip when emitting. Keep one `/* snips/<path> */` line as the section comment. Leave `$junos-*` dynamic-profile placeholders literal (runtime-resolved by `smg-service`).

## 3. `Notes:` section (always last)

Bullets covering:

- Snips intentionally omitted (and why).
- Inputs defaulted because the user did not provide them.
- Cross-endpoint consistency the user must verify (route-target, ESI value, and the VPWS service-id pair — AN `local` == BNG `remote` and vice-versa).
- Anything that is by-pattern rather than validated on that exact device (e.g. a user-supplied hostname not in any snip's `Seen on:` list).
- For **BNG** devices: remind that `chassis pseudowire-service` + `tunnel-services` (from `bootstrap/chassis-bng.conf`) and `system services subscriber-management` are prerequisites for PWHT / dynamic-profile activation.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
