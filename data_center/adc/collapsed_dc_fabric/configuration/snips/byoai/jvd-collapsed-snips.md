# JVD Collapsed Data Center Fabric snippet library

## junos/chassis/aggregated-devices-ethernet.conf

```
/*
 * Topic: Aggregated Ethernet device-count for the chassis
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $AE_DEVICE_COUNT  e.g. 1
 */
chassis {
    aggregated-devices {
        ethernet {
            device-count $AE_DEVICE_COUNT;
        }
    }
}
```

## junos/forwarding-options/evpn-vxlan-shared-tunnels.conf

```
/*
 * Topic: EVPN-VXLAN shared tunnels
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    evpn-vxlan {
        shared-tunnels;
    }
}
```

## junos/forwarding-options/vxlan-routing-next-hop-interface-num-overlay-ecmp.conf

```
/*
 * Topic: VXLAN routing with next-hop and interface-number allocations and overlay ECMP
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    vxlan-routing {
        next-hop 45056;
        interface-num 8192;
        overlay-ecmp;
    }
}
```

## junos/interfaces/ifd-ae-esi-all-active-lacp-system-id.conf

```
/*
 * Topic: Aggregated Ethernet interface for an ESI-LAG: all-active Ethernet segment, active LACP with a fixed system ID and a 9216-byte MTU
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Variables (example values from leaf1_qfx5120-48y):
 *   $AE_BUNDLE    e.g. ae1
 *   $DESCRIPTION  e.g. to.dc3-rack-001-sys001
 *   $ESI          e.g. 00:02:00:00:00:00:01:00:00:01
 *   $LACP_SYS_ID  e.g. 02:00:00:00:00:01
 */
interfaces {
    $AE_BUNDLE {
        description $DESCRIPTION;
        mtu 9216;
        esi {
            $ESI;
            all-active;
        }
        aggregated-ether-options {
            lacp {
                active;
                system-id $LACP_SYS_ID;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-hold-time-up-100000`

## junos/interfaces/ifd-description-mtu-9216.conf

```
/*
 * Topic: Physical interface with a description and a 9216-byte MTU
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 3
 *   leaf2_qfx5120-48y 3
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $IFD          e.g. et-0/0/48
 *   $DESCRIPTION  e.g. facing_dc3-rack-001-leaf2:et-0/0/48
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        mtu 9216;
    }
}
```

## junos/interfaces/ifd-flexible-vlan-tagging-native-vlan-1.conf

```
/*
 * Topic: Physical interface with a description, flexible VLAN tagging and native VLAN 1 for VLAN-tagged Layer 3 units
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $AC_INTF      e.g. xe-0/0/10
 *   $DESCRIPTION  e.g. to.dc3-rack-001-sys004
 */
interfaces {
    $AC_INTF {
        description $DESCRIPTION;
        flexible-vlan-tagging;
        native-vlan-id 1;
    }
}
```

## junos/interfaces/ifd-lag-member-hold-time-up-100000.conf

```
/*
 * Topic: Aggregated Ethernet member link with a description and a hold-up timer of 100000 ms
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $IFD          e.g. xe-0/0/16
 *   $DESCRIPTION  e.g. to.dc3-rack-001-sys001
 *   $AE_BUNDLE    e.g. ae1
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        hold-time up 100000 down 0;
        ether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## junos/interfaces/ifl-core-inet-mtu-9170.conf

```
/*
 * Topic: Unit 0 with an IPv4 address and a 9170-byte family MTU on a leaf-to-leaf link
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 2
 *   leaf2_qfx5120-48y 2
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $CORE_PHYS     e.g. et-0/0/48
 *   $CORE_V4_ADDR  e.g. 10.0.3.1/31
 */
interfaces {
    $CORE_PHYS {
        unit 0 {
            family inet {
                mtu 9170;
                address $CORE_V4_ADDR;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-description-mtu-9216`

## junos/interfaces/ifl-ethernet-switching-trunk-40-vlans.conf

```
/*
 * Topic: Unit 0 as an Ethernet-switching trunk carrying 40 VLANs
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 2
 *   leaf2_qfx5120-48y 2
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $AC_INTF       e.g. ae1
 *   $BD_NAME_31   e.g. vn400
 *   $BD_NAME_32   e.g. vn401
 *   $BD_NAME_33   e.g. vn402
 *   $BD_NAME_34   e.g. vn403
 *   $BD_NAME_35   e.g. vn404
 *   $BD_NAME_36   e.g. vn405
 *   $BD_NAME_37   e.g. vn406
 *   $BD_NAME_38   e.g. vn407
 *   $BD_NAME_39   e.g. vn408
 *   $BD_NAME_40  e.g. vn409
 *   $BD_NAME_1  e.g. vn1000
 *   $BD_NAME_2  e.g. vn1001
 *   $BD_NAME_3  e.g. vn1002
 *   $BD_NAME_4  e.g. vn1003
 *   $BD_NAME_5  e.g. vn1004
 *   $BD_NAME_6  e.g. vn1005
 *   $BD_NAME_7  e.g. vn1006
 *   $BD_NAME_8  e.g. vn1007
 *   $BD_NAME_9  e.g. vn1008
 *   $BD_NAME_10  e.g. vn1009
 *   $BD_NAME_11  e.g. vn1400
 *   $BD_NAME_12  e.g. vn1401
 *   $BD_NAME_13  e.g. vn1402
 *   $BD_NAME_14  e.g. vn1403
 *   $BD_NAME_15  e.g. vn1404
 *   $BD_NAME_16  e.g. vn1405
 *   $BD_NAME_17  e.g. vn1406
 *   $BD_NAME_18  e.g. vn1407
 *   $BD_NAME_19  e.g. vn1408
 *   $BD_NAME_20  e.g. vn1409
 *   $BD_NAME_21  e.g. vn2000
 *   $BD_NAME_22  e.g. vn2001
 *   $BD_NAME_23  e.g. vn2002
 *   $BD_NAME_24  e.g. vn2003
 *   $BD_NAME_25  e.g. vn2004
 *   $BD_NAME_26  e.g. vn2005
 *   $BD_NAME_27  e.g. vn2006
 *   $BD_NAME_28  e.g. vn2007
 *   $BD_NAME_29  e.g. vn2008
 *   $BD_NAME_30  e.g. vn2009
 */
interfaces {
    $AC_INTF {
        unit 0 {
            family ethernet-switching {
                interface-mode trunk;
                vlan {
                    members [ $BD_NAME_31 $BD_NAME_32 $BD_NAME_33 $BD_NAME_34 $BD_NAME_35 $BD_NAME_36 $BD_NAME_37 $BD_NAME_38 $BD_NAME_39 $BD_NAME_40 $BD_NAME_1 $BD_NAME_2 $BD_NAME_3 $BD_NAME_4 $BD_NAME_5 $BD_NAME_6 $BD_NAME_7 $BD_NAME_8 $BD_NAME_9 $BD_NAME_10 $BD_NAME_11 $BD_NAME_12 $BD_NAME_13 $BD_NAME_14 $BD_NAME_15 $BD_NAME_16 $BD_NAME_17 $BD_NAME_18 $BD_NAME_19 $BD_NAME_20 $BD_NAME_21 $BD_NAME_22 $BD_NAME_23 $BD_NAME_24 $BD_NAME_25 $BD_NAME_26 $BD_NAME_27 $BD_NAME_28 $BD_NAME_29 $BD_NAME_30 ];
                }
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-ae-esi-all-active-lacp-system-id`, `interfaces/ifd-description-mtu-9216`
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-hold-time-up-100000`

## junos/interfaces/ifl-loopback-inet.conf

```
/*
 * Topic: Loopback unit with one IPv4 address
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 3
 *   leaf2_qfx5120-48y 3
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $UNIT             e.g. 2
 *   $LOOPBACK_V4_PFX  e.g. 192.168.13.2/32
 */
interfaces {
    lo0 {
        unit $UNIT {
            family inet {
                address $LOOPBACK_V4_PFX;
            }
        }
    }
}
```

## junos/interfaces/ifl-unit-0-inet-no-address.conf

```
/*
 * Topic: Unit 0 with family inet and no address
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 51
 *   leaf2_qfx5120-48y 51
 *   total 102
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $IFD  e.g. et-0/0/50
 */
interfaces {
    $IFD {
        unit 0 {
            family inet;
        }
    }
}
```

## junos/interfaces/ifl-vlan-inet.conf

```
/*
 * Topic: VLAN-tagged unit with a description and an IPv4 address
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 2
 *   leaf2_qfx5120-48y 2
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $AC_INTF      e.g. xe-0/0/10
 *   $UNIT         e.g. 199
 *   $DESCRIPTION  e.g. "VRF red to dc3_rack_001_sys004"
 *   $VLAN         e.g. 199
 *   $AC_ADDR_V4   e.g. 10.200.2.0/31
 */
interfaces {
    $AC_INTF {
        unit $UNIT {
            description $DESCRIPTION;
            vlan-id $VLAN;
            family inet {
                address $AC_ADDR_V4;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-flexible-vlan-tagging-native-vlan-1`

## junos/interfaces/irb-inet-mtu-9000-mac.conf

```
/*
 * Topic: IRB unit with an IPv4 gateway address, a 9000-byte family MTU and a configured MAC address
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 40
 *   leaf2_qfx5120-48y 40
 *   total 80
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $IRB_UNIT  e.g. 400
 *   $IRB_ADDR  e.g. 10.0.0.1/24
 *   $IRB_MAC   e.g. 00:1c:73:00:00:01
 */
interfaces {
    irb {
        unit $IRB_UNIT {
            family inet {
                mtu 9000;
                address $IRB_ADDR;
            }
            mac $IRB_MAC;
        }
    }
}
```

## junos/policy-options/community/community-2-members.conf

```
/*
 * Topic: Community with two standard members
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 5
 *   leaf2_qfx5120-48y 5
 *   total 10
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $COMMUNITY_NAME        e.g. DEFAULT_DIRECT_V4
 *   $COMMUNITY_ADMIN_1     e.g. 1
 *   $COMMUNITY_ASSIGNED_1  e.g. 20007
 *   $COMMUNITY_ADMIN_2     e.g. 21001
 */
policy-options {
    community $COMMUNITY_NAME members [ $COMMUNITY_ADMIN_1:$COMMUNITY_ASSIGNED_1 $COMMUNITY_ADMIN_2:26000 ];
}
```

## junos/policy-options/community/fabric-communities.conf

```
/*
 * Topic: FABRIC_COMMUNITIES: the fabric-internal communities that external export policies delete
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    community FABRIC_COMMUNITIES members [ 0:12 0:13 0:14 0:15 .+:200.. 2....:260.. ];
}
```

## junos/policy-options/policy-statement/per-packet-load-balance-no-term.conf

```
/*
 * Topic: Per-packet load-balancing policy without terms
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $PPLB_NAME  e.g. PFE-LB
 */
policy-options {
    policy-statement $PPLB_NAME {
        then {
            load-balance per-packet;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-accept-all.conf

```
/*
 * Topic: Policy with a single term that accepts everything
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $BGP_EXPORT_POL  e.g. EVPN_EXPORT
 *   $TERM_NAME       e.g. EVPN_EXPORT-4095
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME {
            then accept;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-direct-inet-community-add-reject.conf

```
/*
 * Topic: Policy that accepts direct IPv4 routes with a community added and rejects everything else
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 3
 *   leaf2_qfx5120-48y 3
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $POLICY_NAME     e.g. AllPodNetworks-blue
 *   $TERM_NAME_1     e.g. AllPodNetworks-blue-10
 *   $COMMUNITY_NAME  e.g. BLUE_COMMUNITY_V4
 *   $TERM_NAME_2     e.g. AllPodNetworks-blue-100
 */
policy-options {
    policy-statement $POLICY_NAME {
        term $TERM_NAME_1 {
            from {
                family inet;
                protocol direct;
            }
            then {
                community add $COMMUNITY_NAME;
                accept;
            }
        }
        term $TERM_NAME_2 {
            then reject;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `community` (`$COMMUNITY_NAME`): required, for each reference; `policy-options/community/community-2-members`

## junos/policy-options/policy-statement/ps-from-policy-bgp-accept-reject.conf

```
/*
 * Topic: Policy that accepts the routes another policy accepts and BGP routes, and rejects everything else
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 3
 *   leaf2_qfx5120-48y 3
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $BGP_EXPORT_POL  e.g. BGP-AOS-Policy-blue
 *   $TERM_NAME_1     e.g. BGP-AOS-Policy-blue-10
 *   $POLICY_NAME     e.g. AllPodNetworks-blue
 *   $TERM_NAME_2     e.g. BGP-AOS-Policy-blue-20
 *   $TERM_NAME_3     e.g. BGP-AOS-Policy-blue-100
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from policy $POLICY_NAME;
            then accept;
        }
        term $TERM_NAME_2 {
            from protocol bgp;
            then accept;
        }
        term $TERM_NAME_3 {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-route-filter-list-community-add-reject-inet.conf

```
/*
 * Topic: Import policy that accepts IPv4 routes in a route-filter list with a community added and rejects other IPv4 routes
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 2
 *   leaf2_qfx5120-48y 2
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $BGP_IMPORT_POL     e.g. RoutesFromExt-blue-external_router
 *   $TERM_NAME_1        e.g. RoutesFromExt-blue-external_router-10
 *   $ROUTE_FILTER_LIST  e.g. RoutesFromExt-blue-external_router
 *   $COMMUNITY_NAME     e.g. RoutesFromExt-blue-external_router
 *   $TERM_NAME_2        e.g. RoutesFromExt-blue-external_router-30
 */
policy-options {
    policy-statement $BGP_IMPORT_POL {
        term $TERM_NAME_1 {
            from {
                family inet;
                route-filter-list $ROUTE_FILTER_LIST;
            }
            then {
                community add $COMMUNITY_NAME;
                accept;
            }
        }
        term $TERM_NAME_2 {
            from family inet;
            then reject;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `community` (`$COMMUNITY_NAME`): required, for each reference; `policy-options/community/community-2-members`

## junos/policy-options/policy-statement/ps-route-filter-list-community-delete-reject-inet.conf

```
/*
 * Topic: Export policy that accepts IPv4 routes in a route-filter list with the fabric communities removed and rejects other IPv4 routes
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 2
 *   leaf2_qfx5120-48y 2
 *   total 4
 * Pair with:
 *  - junos/policy-options/community/fabric-communities.conf
 *
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $BGP_EXPORT_POL     e.g. RoutesToExt-blue-external_router
 *   $TERM_NAME_1        e.g. RoutesToExt-blue-external_router-10
 *   $ROUTE_FILTER_LIST  e.g. RoutesToExt-blue-external_router
 *   $TERM_NAME_2        e.g. RoutesToExt-blue-external_router-30
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                family inet;
                route-filter-list $ROUTE_FILTER_LIST;
            }
            then {
                community delete FABRIC_COMMUNITIES;
                accept;
            }
        }
        term $TERM_NAME_2 {
            from family inet;
            then reject;
        }
    }
}
```

## junos/policy-options/route-filter-list-4-upto-2-exact.conf

```
/*
 * Topic: Route-filter list with every non-default IPv4 prefix length, four prefixes up to /32 and two exact /32 prefixes
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 2
 *   leaf2_qfx5120-48y 2
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $ROUTE_FILTER_LIST  e.g. RoutesToExt-red-external_router
 *   $PREFIX_1           e.g. 10.0.0.0/21
 *   $PREFIX_2           e.g. 10.0.8.0/23
 *   $PREFIX_3           e.g. 10.3.0.0/21
 *   $PREFIX_4           e.g. 10.3.8.0/23
 *   $PREFIX_5           e.g. 192.168.13.0/32
 *   $PREFIX_6           e.g. 192.168.13.2/32
 */
policy-options {
    route-filter-list $ROUTE_FILTER_LIST {
        0.0.0.0/0 prefix-length-range /1-/32;
        $PREFIX_1 upto /32;
        $PREFIX_2 upto /32;
        $PREFIX_3 upto /32;
        $PREFIX_4 upto /32;
        $PREFIX_5 exact;
        $PREFIX_6 exact;
    }
}
```

## junos/policy-options/route-filter-list-default-route.conf

```
/*
 * Topic: Route-filter list that matches only the IPv4 default route
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 2
 *   leaf2_qfx5120-48y 2
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $ROUTE_FILTER_LIST  e.g. RoutesFromExt-blue-external_router
 */
policy-options {
    route-filter-list $ROUTE_FILTER_LIST {
        0.0.0.0/0 exact;
    }
}
```

## junos/protocols/bgp-group-ebgp-evpn-overlay-1-peer-bfd.conf

```
/*
 * Topic: eBGP EVPN overlay group to the peer loopback (multihop TTL 1, no next-hop change), BFD at 3000 ms and multiple-AS multipath
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Peers with:
 *   [leaf1_qfx5120-48y] <-> [leaf2_qfx5120-48y]
 * Variables (example values from leaf1_qfx5120-48y):
 *   $BGP_GROUP        e.g. l3clos-l-evpn
 *   $OVERLAY_PEER_V4  e.g. 192.168.253.1
 *   $DESCRIPTION      e.g. facing_dc3-rack-001-leaf2-evpn-overlay
 *   $LOOPBACK_V4      e.g. 192.168.253.0
 *   $BGP_EXPORT_POL   e.g. EVPN_EXPORT
 *   $ASN_FABRIC_PEER  e.g. 64801
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type external;
            multihop {
                ttl 1;
                no-nexthop-change;
            }
            family evpn {
                signaling {
                    loops 2;
                }
            }
            multipath {
                multiple-as;
            }
            bfd-liveness-detection {
                minimum-interval 3000;
                multiplier 3;
            }
            neighbor $OVERLAY_PEER_V4 {
                description $DESCRIPTION;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL );
                peer-as $ASN_FABRIC_PEER;
            }
            vpn-apply-export;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$BGP_EXPORT_POL`): required, for each reference; `policy-options/policy-statement/ps-accept-all`

## junos/protocols/bgp-group-ebgp-underlay-2-peers-bfd.conf

```
/*
 * Topic: eBGP underlay group with two directly connected peers, export policy, BFD at 1000 ms and multiple-AS multipath
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Peers with:
 *   [leaf1_qfx5120-48y] <-> [leaf2_qfx5120-48y]
 * Variables (example values from leaf1_qfx5120-48y):
 *   $BGP_GROUP            e.g. l3clos-l
 *   $UNDERLAY_PEER_V4_1   e.g. 10.0.3.0
 *   $DESCRIPTION          e.g. facing_dc3-rack-001-leaf2
 *   $UNDERLAY_LOCAL_V4_1  e.g. 10.0.3.1
 *   $BGP_EXPORT_POL       e.g. BGP-AOS-Policy
 *   $ASN_FABRIC_PEER      e.g. 64801
 *   $UNDERLAY_PEER_V4_2   e.g. 10.0.3.2
 *   $UNDERLAY_LOCAL_V4_2  e.g. 10.0.3.3
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type external;
            multipath {
                multiple-as;
            }
            bfd-liveness-detection {
                minimum-interval 1000;
                multiplier 3;
            }
            neighbor $UNDERLAY_PEER_V4_1 {
                description $DESCRIPTION;
                local-address $UNDERLAY_LOCAL_V4_1;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL );
                peer-as $ASN_FABRIC_PEER;
            }
            neighbor $UNDERLAY_PEER_V4_2 {
                description $DESCRIPTION;
                local-address $UNDERLAY_LOCAL_V4_2;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL );
                peer-as $ASN_FABRIC_PEER;
            }
            vpn-apply-export;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$BGP_EXPORT_POL`): required, for each reference; `policy-options/policy-statement/ps-from-policy-bgp-accept-reject`

## junos/protocols/bgp-log-updown-graceful-restart-multipath.conf

```
/*
 * Topic: BGP global options: log-updown, graceful restart without helping on shared-fate BFD down, and multipath
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Variables: none
 */
protocols {
    bgp {
        log-updown;
        graceful-restart {
            dont-help-shared-fate-bfd-down;
        }
        multipath;
    }
}
```

## junos/protocols/evpn-no-core-isolation.conf

```
/*
 * Topic: EVPN no-core-isolation setting
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Variables: none
 */
protocols {
    evpn {
        no-core-isolation;
    }
}
```

## junos/protocols/l2-learning-telemetry-remote-entries.conf

```
/*
 * Topic: Layer 2 learning telemetry that includes remote entries
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Variables: none
 */
protocols {
    l2-learning {
        telemetry {
            enable-remote-entries;
        }
    }
}
```

## junos/protocols/lldp-interface-all-port-id-interface-name.conf

```
/*
 * Topic: LLDP on all interfaces with the interface name as port ID and the interface description as port description
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Variables: none
 */
protocols {
    lldp {
        port-id-subtype interface-name;
        port-description-type interface-description;
        neighbour-port-info-display port-id;
        interface all;
    }
}
```

## junos/protocols/rstp-bridge-priority-0-2-edge-bpdu-block.conf

```
/*
 * Topic: RSTP with bridge priority 0, two edge interfaces and BPDU block on edge
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Variables (example values from leaf1_qfx5120-48y):
 *   $AC_INTF_1  e.g. xe-0/0/5
 *   $AC_INTF_2  e.g. ae1
 */
protocols {
    rstp {
        bridge-priority 0;
        interface $AC_INTF_1 {
            edge;
        }
        interface $AC_INTF_2 {
            edge;
        }
        bpdu-block-on-edge;
    }
}
```

## junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-vxlan-40-vlans.conf

```
/*
 * Topic: VLAN-aware MAC-VRF with VXLAN encapsulation, 40 VLANs with VNIs and IRB interfaces, per-VNI route targets and two access interfaces
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Variables (example values from leaf1_qfx5120-48y):
 *   $INSTANCE_NAME   e.g. evpn-1
 *   $VNI_1           e.g. 10400
 *   $VNI_2           e.g. 10401
 *   $VNI_3           e.g. 10402
 *   $VNI_4           e.g. 10403
 *   $VNI_5           e.g. 10404
 *   $VNI_6           e.g. 10405
 *   $VNI_7           e.g. 10406
 *   $VNI_8           e.g. 10407
 *   $VNI_9           e.g. 10408
 *   $VNI_10          e.g. 10409
 *   $VNI_11          e.g. 11000
 *   $VNI_12          e.g. 11001
 *   $VNI_13          e.g. 11002
 *   $VNI_14          e.g. 11003
 *   $VNI_15          e.g. 11004
 *   $VNI_16          e.g. 11005
 *   $VNI_17          e.g. 11006
 *   $VNI_18          e.g. 11007
 *   $VNI_19          e.g. 11008
 *   $VNI_20          e.g. 11009
 *   $VNI_21          e.g. 11400
 *   $VNI_22          e.g. 11401
 *   $VNI_23          e.g. 11402
 *   $VNI_24          e.g. 11403
 *   $VNI_25          e.g. 11404
 *   $VNI_26          e.g. 11405
 *   $VNI_27          e.g. 11406
 *   $VNI_28          e.g. 11407
 *   $VNI_29          e.g. 11408
 *   $VNI_30          e.g. 11409
 *   $VNI_31          e.g. 12000
 *   $VNI_32          e.g. 12001
 *   $VNI_33          e.g. 12002
 *   $VNI_34          e.g. 12003
 *   $VNI_35          e.g. 12004
 *   $VNI_36          e.g. 12005
 *   $VNI_37          e.g. 12006
 *   $VNI_38          e.g. 12007
 *   $VNI_39          e.g. 12008
 *   $VNI_40          e.g. 12009
 *   $AC_IFL_1        e.g. xe-0/0/5.0
 *   $AC_IFL_2        e.g. ae1.0
 *   $LOOPBACK_V4     e.g. 192.168.253.0
 *   $BD_NAME_1       e.g. vn1000
 *   $DESCRIPTION_1   e.g. red_sub_1_1000
 *   $VLAN_BD_1       e.g. 1000
 *   $IRB_IFL_1       e.g. irb.1000
 *   $BD_NAME_2       e.g. vn1001
 *   $DESCRIPTION_2   e.g. red_sub_1_1001
 *   $VLAN_BD_2       e.g. 1001
 *   $IRB_IFL_2       e.g. irb.1001
 *   $BD_NAME_3       e.g. vn1002
 *   $DESCRIPTION_3   e.g. red_sub_1_1002
 *   $VLAN_BD_3       e.g. 1002
 *   $IRB_IFL_3       e.g. irb.1002
 *   $BD_NAME_4       e.g. vn1003
 *   $DESCRIPTION_4   e.g. red_sub_1_1003
 *   $VLAN_BD_4       e.g. 1003
 *   $IRB_IFL_4       e.g. irb.1003
 *   $BD_NAME_5       e.g. vn1004
 *   $DESCRIPTION_5   e.g. red_sub_1_1004
 *   $VLAN_BD_5       e.g. 1004
 *   $IRB_IFL_5       e.g. irb.1004
 *   $BD_NAME_6       e.g. vn1005
 *   $DESCRIPTION_6   e.g. red_sub_1_1005
 *   $VLAN_BD_6       e.g. 1005
 *   $IRB_IFL_6       e.g. irb.1005
 *   $BD_NAME_7       e.g. vn1006
 *   $DESCRIPTION_7   e.g. red_sub_1_1006
 *   $VLAN_BD_7       e.g. 1006
 *   $IRB_IFL_7       e.g. irb.1006
 *   $BD_NAME_8       e.g. vn1007
 *   $DESCRIPTION_8   e.g. red_sub_1_1007
 *   $VLAN_BD_8       e.g. 1007
 *   $IRB_IFL_8       e.g. irb.1007
 *   $BD_NAME_9       e.g. vn1008
 *   $DESCRIPTION_9   e.g. red_sub_1_1008
 *   $VLAN_BD_9       e.g. 1008
 *   $IRB_IFL_9       e.g. irb.1008
 *   $BD_NAME_10      e.g. vn1009
 *   $DESCRIPTION_10  e.g. red_sub_1_1009
 *   $VLAN_BD_10      e.g. 1009
 *   $IRB_IFL_10      e.g. irb.1009
 *   $BD_NAME_11      e.g. vn1400
 *   $DESCRIPTION_11  e.g. blue_all_1400
 *   $VLAN_BD_11      e.g. 1400
 *   $IRB_IFL_11      e.g. irb.1400
 *   $BD_NAME_12      e.g. vn1401
 *   $DESCRIPTION_12  e.g. blue_all_1401
 *   $VLAN_BD_12      e.g. 1401
 *   $IRB_IFL_12      e.g. irb.1401
 *   $BD_NAME_13      e.g. vn1402
 *   $DESCRIPTION_13  e.g. blue_all_1402
 *   $VLAN_BD_13      e.g. 1402
 *   $IRB_IFL_13      e.g. irb.1402
 *   $BD_NAME_14      e.g. vn1403
 *   $DESCRIPTION_14  e.g. blue_all_1403
 *   $VLAN_BD_14      e.g. 1403
 *   $IRB_IFL_14      e.g. irb.1403
 *   $BD_NAME_15      e.g. vn1404
 *   $DESCRIPTION_15  e.g. blue_all_1404
 *   $VLAN_BD_15      e.g. 1404
 *   $IRB_IFL_15      e.g. irb.1404
 *   $BD_NAME_16      e.g. vn1405
 *   $DESCRIPTION_16  e.g. blue_all_1405
 *   $VLAN_BD_16      e.g. 1405
 *   $IRB_IFL_16      e.g. irb.1405
 *   $BD_NAME_17      e.g. vn1406
 *   $DESCRIPTION_17  e.g. blue_all_1406
 *   $VLAN_BD_17      e.g. 1406
 *   $IRB_IFL_17      e.g. irb.1406
 *   $BD_NAME_18      e.g. vn1407
 *   $DESCRIPTION_18  e.g. blue_all_1407
 *   $VLAN_BD_18      e.g. 1407
 *   $IRB_IFL_18      e.g. irb.1407
 *   $BD_NAME_19      e.g. vn1408
 *   $DESCRIPTION_19  e.g. blue_all_1408
 *   $VLAN_BD_19      e.g. 1408
 *   $IRB_IFL_19      e.g. irb.1408
 *   $BD_NAME_20      e.g. vn1409
 *   $DESCRIPTION_20  e.g. blue_all_1409
 *   $VLAN_BD_20      e.g. 1409
 *   $IRB_IFL_20      e.g. irb.1409
 *   $BD_NAME_21      e.g. vn2000
 *   $DESCRIPTION_21  e.g. blue_sub_1_2000
 *   $VLAN_BD_21      e.g. 2000
 *   $IRB_IFL_21      e.g. irb.2000
 *   $BD_NAME_22      e.g. vn2001
 *   $DESCRIPTION_22  e.g. blue_sub_1_2001
 *   $VLAN_BD_22      e.g. 2001
 *   $IRB_IFL_22      e.g. irb.2001
 *   $BD_NAME_23      e.g. vn2002
 *   $DESCRIPTION_23  e.g. blue_sub_1_2002
 *   $VLAN_BD_23      e.g. 2002
 *   $IRB_IFL_23      e.g. irb.2002
 *   $BD_NAME_24      e.g. vn2003
 *   $DESCRIPTION_24  e.g. blue_sub_1_2003
 *   $VLAN_BD_24      e.g. 2003
 *   $IRB_IFL_24      e.g. irb.2003
 *   $BD_NAME_25      e.g. vn2004
 *   $DESCRIPTION_25  e.g. blue_sub_1_2004
 *   $VLAN_BD_25      e.g. 2004
 *   $IRB_IFL_25      e.g. irb.2004
 *   $BD_NAME_26      e.g. vn2005
 *   $DESCRIPTION_26  e.g. blue_sub_1_2005
 *   $VLAN_BD_26      e.g. 2005
 *   $IRB_IFL_26      e.g. irb.2005
 *   $BD_NAME_27      e.g. vn2006
 *   $DESCRIPTION_27  e.g. blue_sub_1_2006
 *   $VLAN_BD_27      e.g. 2006
 *   $IRB_IFL_27      e.g. irb.2006
 *   $BD_NAME_28      e.g. vn2007
 *   $DESCRIPTION_28  e.g. blue_sub_1_2007
 *   $VLAN_BD_28      e.g. 2007
 *   $IRB_IFL_28      e.g. irb.2007
 *   $BD_NAME_29      e.g. vn2008
 *   $DESCRIPTION_29  e.g. blue_sub_1_2008
 *   $VLAN_BD_29      e.g. 2008
 *   $IRB_IFL_29      e.g. irb.2008
 *   $BD_NAME_30      e.g. vn2009
 *   $DESCRIPTION_30  e.g. blue_sub_1_2009
 *   $VLAN_BD_30      e.g. 2009
 *   $IRB_IFL_30      e.g. irb.2009
 *   $BD_NAME_31      e.g. vn400
 *   $DESCRIPTION_31  e.g. red_all_400
 *   $VLAN_BD_31      e.g. 400
 *   $IRB_IFL_31      e.g. irb.400
 *   $BD_NAME_32      e.g. vn401
 *   $DESCRIPTION_32  e.g. red_all_401
 *   $VLAN_BD_32      e.g. 401
 *   $IRB_IFL_32      e.g. irb.401
 *   $BD_NAME_33      e.g. vn402
 *   $DESCRIPTION_33  e.g. red_all_402
 *   $VLAN_BD_33      e.g. 402
 *   $IRB_IFL_33      e.g. irb.402
 *   $BD_NAME_34      e.g. vn403
 *   $DESCRIPTION_34  e.g. red_all_403
 *   $VLAN_BD_34      e.g. 403
 *   $IRB_IFL_34      e.g. irb.403
 *   $BD_NAME_35      e.g. vn404
 *   $DESCRIPTION_35  e.g. red_all_404
 *   $VLAN_BD_35      e.g. 404
 *   $IRB_IFL_35      e.g. irb.404
 *   $BD_NAME_36      e.g. vn405
 *   $DESCRIPTION_36  e.g. red_all_405
 *   $VLAN_BD_36      e.g. 405
 *   $IRB_IFL_36      e.g. irb.405
 *   $BD_NAME_37      e.g. vn406
 *   $DESCRIPTION_37  e.g. red_all_406
 *   $VLAN_BD_37      e.g. 406
 *   $IRB_IFL_37      e.g. irb.406
 *   $BD_NAME_38      e.g. vn407
 *   $DESCRIPTION_38  e.g. red_all_407
 *   $VLAN_BD_38      e.g. 407
 *   $IRB_IFL_38      e.g. irb.407
 *   $BD_NAME_39      e.g. vn408
 *   $DESCRIPTION_39  e.g. red_all_408
 *   $VLAN_BD_39      e.g. 408
 *   $IRB_IFL_39      e.g. irb.408
 *   $BD_NAME_40      e.g. vn409
 *   $DESCRIPTION_40  e.g. red_all_409
 *   $VLAN_BD_40      e.g. 409
 *   $IRB_IFL_40      e.g. irb.409
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type mac-vrf;
        protocols {
            evpn {
                encapsulation vxlan;
                default-gateway do-not-advertise;
                duplicate-mac-detection {
                    auto-recovery-time 9;
                }
                extended-vni-list all;
                vni-options {
                    vni $VNI_1 {
                        vrf-target target:10400:1;
                    }
                    vni $VNI_2 {
                        vrf-target target:10401:1;
                    }
                    vni $VNI_3 {
                        vrf-target target:10402:1;
                    }
                    vni $VNI_4 {
                        vrf-target target:10403:1;
                    }
                    vni $VNI_5 {
                        vrf-target target:10404:1;
                    }
                    vni $VNI_6 {
                        vrf-target target:10405:1;
                    }
                    vni $VNI_7 {
                        vrf-target target:10406:1;
                    }
                    vni $VNI_8 {
                        vrf-target target:10407:1;
                    }
                    vni $VNI_9 {
                        vrf-target target:10408:1;
                    }
                    vni $VNI_10 {
                        vrf-target target:10409:1;
                    }
                    vni $VNI_11 {
                        vrf-target target:11000:1;
                    }
                    vni $VNI_12 {
                        vrf-target target:11001:1;
                    }
                    vni $VNI_13 {
                        vrf-target target:11002:1;
                    }
                    vni $VNI_14 {
                        vrf-target target:11003:1;
                    }
                    vni $VNI_15 {
                        vrf-target target:11004:1;
                    }
                    vni $VNI_16 {
                        vrf-target target:11005:1;
                    }
                    vni $VNI_17 {
                        vrf-target target:11006:1;
                    }
                    vni $VNI_18 {
                        vrf-target target:11007:1;
                    }
                    vni $VNI_19 {
                        vrf-target target:11008:1;
                    }
                    vni $VNI_20 {
                        vrf-target target:11009:1;
                    }
                    vni $VNI_21 {
                        vrf-target target:11400:1;
                    }
                    vni $VNI_22 {
                        vrf-target target:11401:1;
                    }
                    vni $VNI_23 {
                        vrf-target target:11402:1;
                    }
                    vni $VNI_24 {
                        vrf-target target:11403:1;
                    }
                    vni $VNI_25 {
                        vrf-target target:11404:1;
                    }
                    vni $VNI_26 {
                        vrf-target target:11405:1;
                    }
                    vni $VNI_27 {
                        vrf-target target:11406:1;
                    }
                    vni $VNI_28 {
                        vrf-target target:11407:1;
                    }
                    vni $VNI_29 {
                        vrf-target target:11408:1;
                    }
                    vni $VNI_30 {
                        vrf-target target:11409:1;
                    }
                    vni $VNI_31 {
                        vrf-target target:12000:1;
                    }
                    vni $VNI_32 {
                        vrf-target target:12001:1;
                    }
                    vni $VNI_33 {
                        vrf-target target:12002:1;
                    }
                    vni $VNI_34 {
                        vrf-target target:12003:1;
                    }
                    vni $VNI_35 {
                        vrf-target target:12004:1;
                    }
                    vni $VNI_36 {
                        vrf-target target:12005:1;
                    }
                    vni $VNI_37 {
                        vrf-target target:12006:1;
                    }
                    vni $VNI_38 {
                        vrf-target target:12007:1;
                    }
                    vni $VNI_39 {
                        vrf-target target:12008:1;
                    }
                    vni $VNI_40 {
                        vrf-target target:12009:1;
                    }
                }
            }
        }
        vtep-source-interface lo0.0;
        service-type vlan-aware;
        interface $AC_IFL_1;
        interface $AC_IFL_2;
        route-distinguisher $LOOPBACK_V4:65534;
        vrf-target target:100:100;
        vlans {
            $BD_NAME_1 {
                description $DESCRIPTION_1;
                vlan-id $VLAN_BD_1;
                l3-interface $IRB_IFL_1;
                vxlan {
                    vni $VNI_11;
                }
            }
            $BD_NAME_2 {
                description $DESCRIPTION_2;
                vlan-id $VLAN_BD_2;
                l3-interface $IRB_IFL_2;
                vxlan {
                    vni $VNI_12;
                }
            }
            $BD_NAME_3 {
                description $DESCRIPTION_3;
                vlan-id $VLAN_BD_3;
                l3-interface $IRB_IFL_3;
                vxlan {
                    vni $VNI_13;
                }
            }
            $BD_NAME_4 {
                description $DESCRIPTION_4;
                vlan-id $VLAN_BD_4;
                l3-interface $IRB_IFL_4;
                vxlan {
                    vni $VNI_14;
                }
            }
            $BD_NAME_5 {
                description $DESCRIPTION_5;
                vlan-id $VLAN_BD_5;
                l3-interface $IRB_IFL_5;
                vxlan {
                    vni $VNI_15;
                }
            }
            $BD_NAME_6 {
                description $DESCRIPTION_6;
                vlan-id $VLAN_BD_6;
                l3-interface $IRB_IFL_6;
                vxlan {
                    vni $VNI_16;
                }
            }
            $BD_NAME_7 {
                description $DESCRIPTION_7;
                vlan-id $VLAN_BD_7;
                l3-interface $IRB_IFL_7;
                vxlan {
                    vni $VNI_17;
                }
            }
            $BD_NAME_8 {
                description $DESCRIPTION_8;
                vlan-id $VLAN_BD_8;
                l3-interface $IRB_IFL_8;
                vxlan {
                    vni $VNI_18;
                }
            }
            $BD_NAME_9 {
                description $DESCRIPTION_9;
                vlan-id $VLAN_BD_9;
                l3-interface $IRB_IFL_9;
                vxlan {
                    vni $VNI_19;
                }
            }
            $BD_NAME_10 {
                description $DESCRIPTION_10;
                vlan-id $VLAN_BD_10;
                l3-interface $IRB_IFL_10;
                vxlan {
                    vni $VNI_20;
                }
            }
            $BD_NAME_11 {
                description $DESCRIPTION_11;
                vlan-id $VLAN_BD_11;
                l3-interface $IRB_IFL_11;
                vxlan {
                    vni $VNI_21;
                }
            }
            $BD_NAME_12 {
                description $DESCRIPTION_12;
                vlan-id $VLAN_BD_12;
                l3-interface $IRB_IFL_12;
                vxlan {
                    vni $VNI_22;
                }
            }
            $BD_NAME_13 {
                description $DESCRIPTION_13;
                vlan-id $VLAN_BD_13;
                l3-interface $IRB_IFL_13;
                vxlan {
                    vni $VNI_23;
                }
            }
            $BD_NAME_14 {
                description $DESCRIPTION_14;
                vlan-id $VLAN_BD_14;
                l3-interface $IRB_IFL_14;
                vxlan {
                    vni $VNI_24;
                }
            }
            $BD_NAME_15 {
                description $DESCRIPTION_15;
                vlan-id $VLAN_BD_15;
                l3-interface $IRB_IFL_15;
                vxlan {
                    vni $VNI_25;
                }
            }
            $BD_NAME_16 {
                description $DESCRIPTION_16;
                vlan-id $VLAN_BD_16;
                l3-interface $IRB_IFL_16;
                vxlan {
                    vni $VNI_26;
                }
            }
            $BD_NAME_17 {
                description $DESCRIPTION_17;
                vlan-id $VLAN_BD_17;
                l3-interface $IRB_IFL_17;
                vxlan {
                    vni $VNI_27;
                }
            }
            $BD_NAME_18 {
                description $DESCRIPTION_18;
                vlan-id $VLAN_BD_18;
                l3-interface $IRB_IFL_18;
                vxlan {
                    vni $VNI_28;
                }
            }
            $BD_NAME_19 {
                description $DESCRIPTION_19;
                vlan-id $VLAN_BD_19;
                l3-interface $IRB_IFL_19;
                vxlan {
                    vni $VNI_29;
                }
            }
            $BD_NAME_20 {
                description $DESCRIPTION_20;
                vlan-id $VLAN_BD_20;
                l3-interface $IRB_IFL_20;
                vxlan {
                    vni $VNI_30;
                }
            }
            $BD_NAME_21 {
                description $DESCRIPTION_21;
                vlan-id $VLAN_BD_21;
                l3-interface $IRB_IFL_21;
                vxlan {
                    vni $VNI_31;
                }
            }
            $BD_NAME_22 {
                description $DESCRIPTION_22;
                vlan-id $VLAN_BD_22;
                l3-interface $IRB_IFL_22;
                vxlan {
                    vni $VNI_32;
                }
            }
            $BD_NAME_23 {
                description $DESCRIPTION_23;
                vlan-id $VLAN_BD_23;
                l3-interface $IRB_IFL_23;
                vxlan {
                    vni $VNI_33;
                }
            }
            $BD_NAME_24 {
                description $DESCRIPTION_24;
                vlan-id $VLAN_BD_24;
                l3-interface $IRB_IFL_24;
                vxlan {
                    vni $VNI_34;
                }
            }
            $BD_NAME_25 {
                description $DESCRIPTION_25;
                vlan-id $VLAN_BD_25;
                l3-interface $IRB_IFL_25;
                vxlan {
                    vni $VNI_35;
                }
            }
            $BD_NAME_26 {
                description $DESCRIPTION_26;
                vlan-id $VLAN_BD_26;
                l3-interface $IRB_IFL_26;
                vxlan {
                    vni $VNI_36;
                }
            }
            $BD_NAME_27 {
                description $DESCRIPTION_27;
                vlan-id $VLAN_BD_27;
                l3-interface $IRB_IFL_27;
                vxlan {
                    vni $VNI_37;
                }
            }
            $BD_NAME_28 {
                description $DESCRIPTION_28;
                vlan-id $VLAN_BD_28;
                l3-interface $IRB_IFL_28;
                vxlan {
                    vni $VNI_38;
                }
            }
            $BD_NAME_29 {
                description $DESCRIPTION_29;
                vlan-id $VLAN_BD_29;
                l3-interface $IRB_IFL_29;
                vxlan {
                    vni $VNI_39;
                }
            }
            $BD_NAME_30 {
                description $DESCRIPTION_30;
                vlan-id $VLAN_BD_30;
                l3-interface $IRB_IFL_30;
                vxlan {
                    vni $VNI_40;
                }
            }
            $BD_NAME_31 {
                description $DESCRIPTION_31;
                vlan-id $VLAN_BD_31;
                l3-interface $IRB_IFL_31;
                vxlan {
                    vni $VNI_1;
                }
            }
            $BD_NAME_32 {
                description $DESCRIPTION_32;
                vlan-id $VLAN_BD_32;
                l3-interface $IRB_IFL_32;
                vxlan {
                    vni $VNI_2;
                }
            }
            $BD_NAME_33 {
                description $DESCRIPTION_33;
                vlan-id $VLAN_BD_33;
                l3-interface $IRB_IFL_33;
                vxlan {
                    vni $VNI_3;
                }
            }
            $BD_NAME_34 {
                description $DESCRIPTION_34;
                vlan-id $VLAN_BD_34;
                l3-interface $IRB_IFL_34;
                vxlan {
                    vni $VNI_4;
                }
            }
            $BD_NAME_35 {
                description $DESCRIPTION_35;
                vlan-id $VLAN_BD_35;
                l3-interface $IRB_IFL_35;
                vxlan {
                    vni $VNI_5;
                }
            }
            $BD_NAME_36 {
                description $DESCRIPTION_36;
                vlan-id $VLAN_BD_36;
                l3-interface $IRB_IFL_36;
                vxlan {
                    vni $VNI_6;
                }
            }
            $BD_NAME_37 {
                description $DESCRIPTION_37;
                vlan-id $VLAN_BD_37;
                l3-interface $IRB_IFL_37;
                vxlan {
                    vni $VNI_7;
                }
            }
            $BD_NAME_38 {
                description $DESCRIPTION_38;
                vlan-id $VLAN_BD_38;
                l3-interface $IRB_IFL_38;
                vxlan {
                    vni $VNI_8;
                }
            }
            $BD_NAME_39 {
                description $DESCRIPTION_39;
                vlan-id $VLAN_BD_39;
                l3-interface $IRB_IFL_39;
                vxlan {
                    vni $VNI_9;
                }
            }
            $BD_NAME_40 {
                description $DESCRIPTION_40;
                vlan-id $VLAN_BD_40;
                l3-interface $IRB_IFL_40;
                vxlan {
                    vni $VNI_10;
                }
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL_1`, `$AC_IFL_2`, `$IRB_IFL_1`, `$IRB_IFL_2`, `$IRB_IFL_3`, `$IRB_IFL_4`, `$IRB_IFL_5`, `$IRB_IFL_6`, `$IRB_IFL_7`, `$IRB_IFL_8`, `$IRB_IFL_9`, `$IRB_IFL_10`, `$IRB_IFL_11`, `$IRB_IFL_12`, `$IRB_IFL_13`, `$IRB_IFL_14`, `$IRB_IFL_15`, `$IRB_IFL_16`, `$IRB_IFL_17`, `$IRB_IFL_18`, `$IRB_IFL_19`, `$IRB_IFL_20`, `$IRB_IFL_21`, `$IRB_IFL_22`, `$IRB_IFL_23`, `$IRB_IFL_24`, `$IRB_IFL_25`, `$IRB_IFL_26`, `$IRB_IFL_27`, `$IRB_IFL_28`, `$IRB_IFL_29`, `$IRB_IFL_30`, `$IRB_IFL_31`, `$IRB_IFL_32`, `$IRB_IFL_33`, `$IRB_IFL_34`, `$IRB_IFL_35`, `$IRB_IFL_36`, `$IRB_IFL_37`, `$IRB_IFL_38`, `$IRB_IFL_39`, `$IRB_IFL_40`): required, for each reference; one of `interfaces/ifl-ethernet-switching-trunk-40-vlans`, `interfaces/irb-inet-mtu-9000-mac`

## junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-20-irb.conf

```
/*
 * Topic: VRF with EVPN Type 5 IP prefix routes over VXLAN, an eBGP session to an external router, 20 IRB interfaces and a loopback unit
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 2
 *   leaf2_qfx5120-48y 2
 *   total 4
 * Pair with: none
 * Variables (example values from leaf1_qfx5120-48y):
 *   $INSTANCE_NAME         e.g. red
 *   $BGP_GROUP             e.g. l3rtr
 *   $CE_PEER_V4            e.g. 10.200.2.1
 *   $DESCRIPTION           e.g. facing_dc3-rack-001-sys004
 *   $PE_LOCAL_V4           e.g. 10.200.2.0
 *   $BGP_IMPORT_POL        e.g. RoutesFromExt-red-external_router
 *   $BGP_EXPORT_POL        e.g. RoutesToExt-red-external_router
 *   $ASN_CUSTOMER          e.g. 65000
 *   $VNI                   e.g. 13100
 *   $IP_PREFIX_EXPORT_POL  e.g. BGP-AOS-Policy-red
 *   $AC_IFL                e.g. xe-0/0/10.199
 *   $IRB_IFL_1             e.g. irb.400
 *   $IRB_IFL_2             e.g. irb.401
 *   $IRB_IFL_3             e.g. irb.402
 *   $IRB_IFL_4             e.g. irb.403
 *   $IRB_IFL_5             e.g. irb.404
 *   $IRB_IFL_6             e.g. irb.405
 *   $IRB_IFL_7             e.g. irb.406
 *   $IRB_IFL_8             e.g. irb.407
 *   $IRB_IFL_9             e.g. irb.408
 *   $IRB_IFL_10            e.g. irb.409
 *   $IRB_IFL_11            e.g. irb.1000
 *   $IRB_IFL_12            e.g. irb.1001
 *   $IRB_IFL_13            e.g. irb.1002
 *   $IRB_IFL_14            e.g. irb.1003
 *   $IRB_IFL_15            e.g. irb.1004
 *   $IRB_IFL_16            e.g. irb.1005
 *   $IRB_IFL_17            e.g. irb.1006
 *   $IRB_IFL_18            e.g. irb.1007
 *   $IRB_IFL_19            e.g. irb.1008
 *   $IRB_IFL_20            e.g. irb.1009
 *   $LOOPBACK_IFL          e.g. lo0.2
 *   $LOOPBACK_V4           e.g. 192.168.253.0
 *   $RD_SUB_ASSIGNED       e.g. 3100
 *   $RT_AS                 e.g. 13100
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            graceful-restart;
            multipath;
            auto-export;
        }
        protocols {
            bgp {
                group $BGP_GROUP {
                    type external;
                    multihop {
                        ttl 1;
                    }
                    family inet {
                        unicast {
                            loops 2;
                        }
                    }
                    multipath {
                        multiple-as;
                    }
                    neighbor $CE_PEER_V4 {
                        description $DESCRIPTION;
                        multihop {
                            ttl 2;
                        }
                        local-address $PE_LOCAL_V4;
                        import ( $BGP_IMPORT_POL );
                        family inet {
                            unicast;
                        }
                        export ( $BGP_EXPORT_POL );
                        peer-as $ASN_CUSTOMER;
                    }
                }
                graceful-restart {
                    dont-help-shared-fate-bfd-down;
                }
            }
            evpn {
                ip-prefix-routes {
                    advertise direct-nexthop;
                    encapsulation vxlan;
                    vni $VNI;
                    export $IP_PREFIX_EXPORT_POL;
                }
            }
        }
        interface $AC_IFL;
        interface $IRB_IFL_1;
        interface $IRB_IFL_2;
        interface $IRB_IFL_3;
        interface $IRB_IFL_4;
        interface $IRB_IFL_5;
        interface $IRB_IFL_6;
        interface $IRB_IFL_7;
        interface $IRB_IFL_8;
        interface $IRB_IFL_9;
        interface $IRB_IFL_10;
        interface $IRB_IFL_11;
        interface $IRB_IFL_12;
        interface $IRB_IFL_13;
        interface $IRB_IFL_14;
        interface $IRB_IFL_15;
        interface $IRB_IFL_16;
        interface $IRB_IFL_17;
        interface $IRB_IFL_18;
        interface $IRB_IFL_19;
        interface $IRB_IFL_20;
        interface $LOOPBACK_IFL;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:1;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `irb-service`: required, all related; one of `routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-vxlan-40-vlans`, `routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-20-irb`
- `logical-interface` (`$AC_IFL`, `$IRB_IFL_1`, `$IRB_IFL_2`, `$IRB_IFL_3`, `$IRB_IFL_4`, `$IRB_IFL_5`, `$IRB_IFL_6`, `$IRB_IFL_7`, `$IRB_IFL_8`, `$IRB_IFL_9`, `$IRB_IFL_10`, `$IRB_IFL_11`, `$IRB_IFL_12`, `$IRB_IFL_13`, `$IRB_IFL_14`, `$IRB_IFL_15`, `$IRB_IFL_16`, `$IRB_IFL_17`, `$IRB_IFL_18`, `$IRB_IFL_19`, `$IRB_IFL_20`, `$LOOPBACK_IFL`): required, for each reference; one of `interfaces/ifl-loopback-inet`, `interfaces/ifl-vlan-inet`, `interfaces/irb-inet-mtu-9000-mac`
- `policy-statement` (`$BGP_IMPORT_POL`, `$BGP_EXPORT_POL`, `$IP_PREFIX_EXPORT_POL`): required, for each reference; one of `policy-options/policy-statement/ps-from-policy-bgp-accept-reject`, `policy-options/policy-statement/ps-route-filter-list-community-add-reject-inet`, `policy-options/policy-statement/ps-route-filter-list-community-delete-reject-inet`

## junos/routing-options/autonomous-system.conf

```
/*
 * Topic: Device autonomous-system number
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $ASN  e.g. 64800
 */
routing-options {
  autonomous-system $ASN;
}
```

## junos/routing-options/forwarding-table-pplb-ecmp-fast-reroute-chained-nh-evpn.conf

```
/*
 * Topic: Forwarding-table per-packet load balancing, ECMP fast reroute and chained composite next hops for EVPN
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $PPLB_NAME  e.g. PFE-LB
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
        ecmp-fast-reroute;
        chained-composite-next-hop {
            ingress {
                evpn;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$PPLB_NAME`): required, for each reference; `policy-options/policy-statement/per-packet-load-balance-no-term`

## junos/routing-options/graceful-restart.conf

```
/*
 * Topic: Graceful restart
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    graceful-restart;
}
```

## junos/routing-options/router-id.conf

```
/*
 * Topic: Transport router identity
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5120-48y):
 *   $ROUTER_ID  e.g. 192.168.253.0
 */
routing-options {
    router-id $ROUTER_ID;
}
```

## junos/security/certificates-local.conf

```
/*
 * Topic: Local certificate and private key used by the gRPC SSL service
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Variables (example values from leaf1_qfx5120-48y):
 *   $LOCAL_CERT      e.g. aos_grpc
 *   $LOCAL_CERT_KEY  e.g. "<LOCAL_CERT_KEY>"
 */
security {
    certificates {
        local {
            $LOCAL_CERT {
                $LOCAL_CERT_KEY;
            }
        }
    }
}
```

## junos/system/host-name.conf

```
/*
 * Topic: System host name
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Variables (example values from leaf1_qfx5120-48y):
 *   $HOST_NAME  e.g. dc3-rack-001-leaf1
 */
system {
    host-name $HOST_NAME;
}
```

## junos/system/management-instance.conf

```
/*
 * Topic: Dedicated management routing instance (mgmt_junos) for the management interface and services
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Variables: none
 */
system {
    management-instance;
}
```

## junos/system/ports-console-log-out.conf

```
/*
 * Topic: Console log-out on disconnect
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Variables: none
 */
system {
    ports {
        console log-out-on-disconnect;
    }
}
```

## junos/system/services-netconf-ssh-grpc-ssl-local-certificate.conf

```
/*
 * Topic: NETCONF over SSH, SSH with root login, SFTP and a rate limit, and a gRPC extension service over SSL on port 32767 in the management instance
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48y 1
 *   leaf2_qfx5120-48y 1
 *   total 2
 * Pair with: none
 * Variables (example values from leaf1_qfx5120-48y):
 *   $LOCAL_CERT  e.g. aos_grpc
 */
system {
    services {
        netconf {
            ssh;
        }
        ssh {
            root-login allow;
            sftp-server;
            rate-limit 250;
        }
        extension-service {
            request-response {
                grpc {
                    ssl {
                        port 32767;
                        local-certificate $LOCAL_CERT;
                    }
                    routing-instance mgmt_junos;
                }
            }
        }
    }
}
```

## _variables.md

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
| `$AE_DEVICE_COUNT` | Number of aggregated Ethernet devices the chassis creates (`aggregated-devices ethernet device-count`). | `1` |
| `$HOST_NAME` | System host name. | `dc3-rack-001-leaf1` |
| `$LOCAL_CERT` | Name of the local certificate (`security certificates local`) the gRPC SSL service presents (`local-certificate`). | `aos_grpc` |
| `$LOCAL_CERT_KEY` | PEM private key and certificate of the local certificate; secret, supplied by the operator (the published value is sanitized). | `"<LOCAL_CERT_KEY>"` |

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number (`routing-options autonomous-system`). | `64800` |
| `$LOOPBACK_V4` | Loopback IPv4 address of the local device: the overlay session `local-address`, and the administrator field of a VRF route distinguisher. | `192.168.253.0` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on a loopback unit (unit 0, or a tenant VRF's loopback unit). | `192.168.13.2/32` |
| `$ROUTER_ID` | Router identifier in IPv4 dotted-decimal form. | `192.168.253.0` |

## Routing instances

| Variable | What it is | Example value |
|---|---|---|
| `$AC_IFL` | Access-facing logical interface (`<interface>.<unit>`): here a GPU server link with IPv6 router advertisements. | `xe-0/0/10.199` |
| `$AC_IFL_1` | Access-facing logical interface listed in a tenant VRF (a GPU server or tester link); `_1`, `_2`, … number the VRF's interfaces in source order. | `xe-0/0/5.0` |
| `$AC_IFL_2` | Access-facing logical interface listed in a tenant VRF (a GPU server or tester link); `_1`, `_2`, … number the VRF's interfaces in source order. | `ae1.0` |
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
| `$ESI` | Ethernet segment identifier of an ESI-LAG bundle (10 octets). | `00:02:00:00:00:00:01:00:00:01` |
| `$LACP_SYS_ID` | LACP system ID of an ESI-LAG bundle, the same on both leaves. | `02:00:00:00:00:01` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address with prefix length on an access-facing Layer 3 unit. | `10.200.2.0/31` |
| `$AC_INTF` | Access-facing physical interface (a GPU server or traffic-tester link). | `xe-0/0/10` |
| `$AC_INTF_1` | Member port of an ESI-LAG access bundle; `_1`, `_2`, … number the members in source order. | `xe-0/0/5` |
| `$AC_INTF_2` | Member port of an ESI-LAG access bundle; `_1`, `_2`, … number the members in source order. | `ae1` |
| `$CORE_PHYS` | Fabric-facing physical interface of a point-to-point leaf-spine link. | `et-0/0/48` |
| `$CORE_V4_ADDR` | IPv4 address with prefix length (/31) on a leaf-spine fabric link. | `10.0.3.1/31` |
| `$DESCRIPTION` | Free-text interface or BGP neighbor `description`. | `to.dc3-rack-001-sys001` |
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
| `$IFD` | Physical interface name (a breakout port or a port that carries no traffic in the design). | `et-0/0/48` |
| `$IRB_ADDR` | IPv4 gateway address with prefix length on an IRB unit. | `10.0.0.1/24` |
| `$IRB_MAC` | MAC address of an IRB unit. | `00:1c:73:00:00:01` |
| `$IRB_UNIT` | IRB unit number. | `400` |
| `$UNIT` | Logical unit number. | `2` |

## Fabric underlay and overlay

| Variable | What it is | Example value |
|---|---|---|
| `$ASN_FABRIC_PEER` | Autonomous-system number of the fabric eBGP neighbor (the other leaf). | `64801` |
| `$BGP_GROUP` | Name of an eBGP group (the underlay group, the EVPN overlay group, or a VRF's group toward the external router). | `l3clos-l-evpn` |
| `$OVERLAY_PEER_V4` | Loopback IPv4 address of the eBGP EVPN overlay neighbor (the other leaf). | `192.168.253.1` |
| `$UNDERLAY_LOCAL_V4_1` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.3.1` |
| `$UNDERLAY_LOCAL_V4_2` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.3.3` |
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
| `$POLICY_NAME` | Name of a routing policy referenced by `from policy` in another policy (here the direct-route policies). | `AllPodNetworks-blue` |
| `$PPLB_NAME` | Name of the per-packet load-balancing policy that the forwarding table exports. | `PFE-LB` |
| `$PREFIX_1` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `10.0.0.0/21` |
| `$PREFIX_2` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `10.0.8.0/23` |
| `$PREFIX_3` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `10.3.0.0/21` |
| `$PREFIX_4` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `10.3.8.0/23` |
| `$PREFIX_5` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `192.168.13.0/32` |
| `$PREFIX_6` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `192.168.13.2/32` |
| `$ROUTE_FILTER_LIST` | Name of a route-filter list, as defined and as a policy references it. | `RoutesFromExt-blue-external_router` |
| `$TERM_NAME` | Name of the single term of a policy-statement. | `EVPN_EXPORT-4095` |
| `$TERM_NAME_1` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `AllPodNetworks-blue-10` |
| `$TERM_NAME_2` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `AllPodNetworks-blue-100` |
| `$TERM_NAME_3` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `BGP-AOS-Policy-blue-100` |
| `$VLAN` | VLAN identifier: here the native VLAN of an access trunk (`native-vlan-id`). | `199` |

## byoai/TIERS.md

> **Tier qualification for this JVD.** Only `minimum` is qualified and selectable.
> The `self-contained` and `as-deployed` lists below are not yet qualified for this
> JVD. They are not selectable: never offer or render them.

# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd data_center/adc/collapsed_dc_fabric`. -->

This file tells the assistant which snippet files to include for each service
form at each tier. It is generated from the composition matrix, so every path
below resolves to a real snippet and every device listed is one the form is
validated on.

## What the tiers mean

| Tier | What it includes |
|---|---|
| `minimum` | Only the service construct. Assumes the device already runs the underlay and the overlay the service needs. |
| `self-contained` | Everything the emitted configuration names, resolved recursively for the target device. |
| `as-deployed` | The self-contained set plus the validated baselines this JVD runs on that device. |

A tier never implies that a larger closure is a minimal protocol requirement.
If a form's overlay, variant or dependency cannot be resolved for the target
device, the request fails closed: say so and generate nothing for it.

---

## EVPN-VXLAN MAC-VRF with 40 VLANs

Family e-lan, form evpn-mac-vrf-40-vlans. OS mode Junos. Attachment: Access trunk units (the ESI LAG toward the servers) and the VLANs' IRB units, which the Type 5 VRF routes..

### leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-vxlan-40-vlans.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$IRB_IFL_21
  - occurrence-selection-required: logical-interface:$IRB_IFL_22
  - occurrence-selection-required: logical-interface:$IRB_IFL_23
  - occurrence-selection-required: logical-interface:$IRB_IFL_24
  - occurrence-selection-required: logical-interface:$IRB_IFL_25
  - occurrence-selection-required: logical-interface:$IRB_IFL_26
  - occurrence-selection-required: logical-interface:$IRB_IFL_27
  - occurrence-selection-required: logical-interface:$IRB_IFL_28
  - occurrence-selection-required: logical-interface:$IRB_IFL_29
  - occurrence-selection-required: logical-interface:$IRB_IFL_30
  - occurrence-selection-required: logical-interface:$IRB_IFL_31
  - occurrence-selection-required: logical-interface:$IRB_IFL_32
  - occurrence-selection-required: logical-interface:$IRB_IFL_33
  - occurrence-selection-required: logical-interface:$IRB_IFL_34
  - occurrence-selection-required: logical-interface:$IRB_IFL_35
  - occurrence-selection-required: logical-interface:$IRB_IFL_36
  - occurrence-selection-required: logical-interface:$IRB_IFL_37
  - occurrence-selection-required: logical-interface:$IRB_IFL_38
  - occurrence-selection-required: logical-interface:$IRB_IFL_39
  - occurrence-selection-required: logical-interface:$IRB_IFL_40

### leaf2_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-vxlan-40-vlans.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$IRB_IFL_21
  - occurrence-selection-required: logical-interface:$IRB_IFL_22
  - occurrence-selection-required: logical-interface:$IRB_IFL_23
  - occurrence-selection-required: logical-interface:$IRB_IFL_24
  - occurrence-selection-required: logical-interface:$IRB_IFL_25
  - occurrence-selection-required: logical-interface:$IRB_IFL_26
  - occurrence-selection-required: logical-interface:$IRB_IFL_27
  - occurrence-selection-required: logical-interface:$IRB_IFL_28
  - occurrence-selection-required: logical-interface:$IRB_IFL_29
  - occurrence-selection-required: logical-interface:$IRB_IFL_30
  - occurrence-selection-required: logical-interface:$IRB_IFL_31
  - occurrence-selection-required: logical-interface:$IRB_IFL_32
  - occurrence-selection-required: logical-interface:$IRB_IFL_33
  - occurrence-selection-required: logical-interface:$IRB_IFL_34
  - occurrence-selection-required: logical-interface:$IRB_IFL_35
  - occurrence-selection-required: logical-interface:$IRB_IFL_36
  - occurrence-selection-required: logical-interface:$IRB_IFL_37
  - occurrence-selection-required: logical-interface:$IRB_IFL_38
  - occurrence-selection-required: logical-interface:$IRB_IFL_39
  - occurrence-selection-required: logical-interface:$IRB_IFL_40

---

## EVPN Type 5 VRF with eBGP to the external router

Family l3vpn, form evpn-type5-vrf-ebgp. OS mode Junos. Attachment: IRB units of the MAC-VRF VLANs, the VRF loopback unit, and the attachment unit toward the external router..

### leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-20-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### leaf2_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-20-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## byoai/DEFAULTS.md

# DEFAULTS — Collapsed Data Center Fabric

Lab auto-fill values for the Collapsed Data Center Fabric JVD. Every value is measured from the published device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks a device and service and asks for lab values; otherwise ask for the deployment values.

## Device inventory

| Role | Device | Platform | OS | Loopback / router-id | `$ASN` |
|------|--------|----------|----|----------------------|--------|
| Collapsed-spine leaf | leaf1_qfx5120-48y | QFX5120-48Y | Junos | 192.168.253.0 | 64800 |
| Collapsed-spine leaf | leaf2_qfx5120-48y | QFX5120-48Y | Junos | 192.168.253.1 | 64801 |

## Service examples (first measured instance per leaf)

| Service form | Device | Example values |
|--------------|--------|----------------|
| evpn-mac-vrf-40-vlans | leaf1_qfx5120-48y | `$AC_IFL_1` xe-0/0/5.0, `$AC_IFL_2` ae1.0, `$BD_NAME_1` vn1000, `$BD_NAME_10` vn1009, `$BD_NAME_11` vn1400, `$BD_NAME_12` vn1401 |
| evpn-mac-vrf-40-vlans | leaf2_qfx5120-48y | `$AC_IFL_1` xe-0/0/0.0, `$AC_IFL_2` ae1.0, `$BD_NAME_1` vn1000, `$BD_NAME_10` vn1009, `$BD_NAME_11` vn1400, `$BD_NAME_12` vn1401 |
| evpn-type5-vrf-ebgp | leaf1_qfx5120-48y | `$AC_IFL` xe-0/0/10.199, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-red-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-red-external_router, `$CE_PEER_V4` 10.200.2.1 |
| evpn-type5-vrf-ebgp | leaf2_qfx5120-48y | `$AC_IFL` xe-0/0/10.199, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-red-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-red-external_router, `$CE_PEER_V4` 10.200.2.3 |

The MAC-VRF and each Type 5 VRF use the same instance name, VNIs and route target on both leaves; the route distinguisher starts with each leaf's own loopback.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into `jvd-collapsed-snips.md` by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: minimum
# devices:
#   leaf1: { name: <hostname>, os: junos, loopback4: <addr> }
#   leaf2: { name: <hostname>, os: junos, loopback4: <addr> }
# services:
#   - { kind: <evpn-mac-vrf-40-vlans|evpn-type5-vrf-ebgp>,
#       count: <int>,
#       start_id: <int>,
#       ac_ifl: <ifd.unit>,
#       rt: <rt_as:rt_id>,
#       rd: <admin:assigned> }
# snips_used:
#   - junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-20-irb.conf
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

Drop the leading C-style `/* … */` documentation header from each snip when emitting. Keep one `/* snips/<path> */` line as the section comment.

## 3. `Notes:` section (always last)

Bullets covering:

- The prerequisites the device must already run: the snip's `Pair with:` entries, the applicable entries of its Needs list and the requirements TIERS.md lists under the Blocked entry for that device. Name them; do not render them.
- Inputs defaulted because the user did not provide them.
- Cross-device consistency the user must verify: the MAC-VRF and each Type 5 VRF use the same instance name, VNIs and route target on both leaves; each leaf's route distinguisher starts with its own loopback; the IRB units a VRF lists must exist in the MAC-VRF's VLANs.
- Anything that is by-pattern rather than validated on that exact device.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
