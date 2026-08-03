# JVD EWAN Core & Edge snippet library

## evo/bootstrap/chassis.conf

```
/*
 * Topic:   Chassis — aggregated-devices count and network-services enhanced-ip (EVO)
 * Seen on:
 *   EVO: p1_ptx10003 p2_ptx10001-36mr wanedge3_acx7509 wanedge4_acx7100-48l
 * Highlights:
 *   - aggregated-devices device-count 25 pre-allocates ae interface namespace
 *   - network-services enhanced-ip required on EVO for MPLS/VPN functionality
 *   - Must be set before enabling L3VPN/VPLS/L2CKT services
 * Pair with:
 * Variables:
 *   $AE_DEVICE_COUNT  e.g. 25
 */
chassis {
    aggregated-devices {
        ethernet {
            device-count $AE_DEVICE_COUNT;
        }
    }
    network-services enhanced-ip;
}
```

## evo/bootstrap/forwarding-options-hash.conf

```
/*
 * Topic:   Forwarding-options hash-key — MPLS and multiservice ECMP hashing
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 * Highlights:
 *   - Body is byte-identical to the Junos sibling
 *   - All 6 P and PE devices use this hash configuration
 * Pair with:
 *   - evo/transport/mpls-transit.conf — MPLS forwarding benefits from hash
 *   - evo/transport/ldp.conf — LDP LSPs use the MPLS hash-key
 * Variables:
 *   (none — hash configuration is invariant)
 */
forwarding-options {
    hash-key {
        family mpls {
            label-1;
            label-2;
            label-3;
        }
        family multiservice {
            source-mac;
            destination-mac;
        }
    }
    enhanced-hash-key {
        family mpls {
            no-payload;
        }
    }
    load-balance-label-capability;
}
```

## evo/interfaces/ae-lag-access.conf

```
/*
 * Topic:   Aggregated Ethernet LAG — access link with flexible-vlan-tagging (service-facing)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Highlights:
 *   - Body is byte-identical to the Junos sibling
 *   - Carries thousands of VLAN-tagged subinterfaces for services
 * Pair with:
 *   - evo/bootstrap/chassis.conf — pre-allocates ae device-count + enhanced-ip
 *   - evo/services/vpls-virtual-switch.conf — L2 units reference ae1.X
 *   - evo/services/l2ckt-pseudowire.conf — L2CKT units reference ae1.X
 * Variables:
 *   $AE_INTF        e.g. ae1
 *   $LACP_SYSTEM_ID e.g. 00:00:44:00:00:01
 */
interfaces {
    $AE_INTF {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            lacp {
                active;
                periodic fast;
                system-id $LACP_SYSTEM_ID;
            }
        }
    }
}
```

## evo/interfaces/ae-lag-core.conf

```
/*
 * Topic:   Aggregated Ethernet LAG — core link with LACP (P2P to P-router)
 * Seen on:
 *   EVO: wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 * Highlights:
 *   - Core-facing LAG with LACP active + periodic fast
 *   - wanedge3 uses direct interfaces (no core ae LAG on that device)
 * Pair with:
 *   - evo/bootstrap/chassis.conf — pre-allocates ae device-count + enhanced-ip
 *   - evo/transport/ospf-lfa.conf — OSPF runs on ae unit 0
 *   - evo/transport/ldp.conf — LDP runs on ae unit 0
 * Variables:
 *   $AE_INTF        e.g. ae2
 *   $DESCRIPTION    e.g. P1Node to WANEdge1
 *   $LOCAL_ADDRESS  e.g. 192.168.12.2/24
 */
interfaces {
    $AE_INTF {
        description "$DESCRIPTION";
        aggregated-ether-options {
            lacp {
                active;
                periodic fast;
            }
        }
        unit 0 {
            family inet {
                address $LOCAL_ADDRESS;
            }
            family mpls;
        }
    }
}
```

## evo/policy/bgp-to-ospf.conf

```
/*
 * Topic:   BGP-to-OSPF redistribution policy (for multicast VPN CE routing)
 * Seen on:
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Highlights:
 *   - Simple accept-all from protocol bgp; used as OSPF export in NGMVPN VRFs
 *   - Enables BGP-learned VPN routes to be redistributed into VRF-local OSPF
 *   - Also used as iBGP group export on PE devices for multicast signaling
 * Pair with:
 *   - evo/services/ngmvpn-vrf.conf — OSPF export references this policy
 * Variables:
 *   (none — policy is invariant across instances)
 */
policy-options {
    policy-statement bgp-to-ospf {
        from protocol bgp;
        then accept;
    }
}
```

## evo/policy/hub-spoke-community.conf

```
/*
 * Topic:   Hub-and-Spoke communities — RT community per spoke/hub group
 * Seen on:
 *   EVO: wanedge3_acx7509
 * Highlights:
 *   - Hub community carries routes FROM hub TO spokes (odd RT values)
 *   - Spoke community carries routes FROM spoke TO hub (even RT values)
 *   - Pattern: hub_N target:65535:<2N-1>, spoke_N target:65535:<2N>
 *   - 1000 hub + 1000 spoke communities validated at scale
 * Pair with:
 *   - evo/policy/hub-spoke-import-export.conf — references these communities
 *   - evo/services/ngmvpn-hub-adv.conf — vrf-import uses hub/spoke policies
 *   - evo/services/ngmvpn-spoke-adv.conf — vrf-export uses hub/spoke policies
 * Variables:
 *   $HUB_COMMUNITY_NAME    e.g. hub_1
 *   $HUB_RT                e.g. target:65535:1
 *   $SPOKE_COMMUNITY_NAME  e.g. spoke_1
 *   $SPOKE_RT              e.g. target:65535:2
 */
policy-options {
    community $HUB_COMMUNITY_NAME members $HUB_RT;
    community $SPOKE_COMMUNITY_NAME members $SPOKE_RT;
}
```

## evo/policy/hub-spoke-import-export.conf

```
/*
 * Topic:   Hub-and-Spoke import/export policies — hub imports spoke community, spoke imports hub
 * Seen on:
 *   EVO: wanedge3_acx7509
 * Highlights:
 *   - hub_N policy: accepts routes with spoke_N community (hub imports from spokes)
 *   - spoke_N policy: adds spoke_N community on export, accepts bgp+direct
 *   - Explicit reject term prevents route leaking between VRFs
 *   - Used by ngmvpn-hub-adv and ngmvpn-spoke-adv vrf-import/vrf-export
 * Pair with:
 *   - evo/policy/hub-spoke-community.conf — community definitions referenced here
 *   - evo/services/ngmvpn-hub-adv.conf — hub VRFs use spoke import
 *   - evo/services/ngmvpn-spoke-adv.conf — spoke VRFs use hub export
 * Variables:
 *   $HUB_POLICY_NAME     e.g. hub_1
 *   $HUB_COMMUNITY       e.g. hub_1
 *   $SPOKE_POLICY_NAME   e.g. spoke_1
 *   $SPOKE_COMMUNITY     e.g. spoke_1
 */
policy-options {
    policy-statement $HUB_POLICY_NAME {
        term a {
            from {
                protocol bgp;
                community $HUB_COMMUNITY;
            }
            then accept;
        }
        term b {
            then reject;
        }
    }
    policy-statement $SPOKE_POLICY_NAME {
        term a {
            from protocol [ bgp direct ];
            then {
                community add $SPOKE_COMMUNITY;
                accept;
            }
        }
        term b {
            then reject;
        }
    }
}
```

## evo/policy/redistribute-vpn.conf

```
/*
 * Topic:   Redistribute-VPN policy (export VPN routes to eBGP CE in hub-spoke)
 * Seen on:
 *   EVO: wanedge3_acx7509
 * Highlights:
 *   - Used by Hub_Adv_To_Spokes VRFs to export VPN routes toward CE
 *   - Accepts protocol bgp routes and rejects all else
 *   - Applied as BGP group export in the hub VRF's CE peering
 * Pair with:
 *   - evo/services/ngmvpn-hub-adv.conf — references this as BGP group export
 * Variables:
 *   (none — policy is invariant)
 */
policy-options {
    policy-statement redistribute-vpn {
        term a {
            from protocol bgp;
            then accept;
        }
        term b {
            then reject;
        }
    }
}
```

## evo/services/l2ckt-pseudowire.conf

```
/*
 * Topic:   L2CKT pseudowire (protocols l2circuit)
 * Seen on:
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Highlights:
 *   - Point-to-point L2 circuit over MPLS (CCC encapsulation)
 *   - No hot-standby backup on EVO (Junos sibling adds backup-neighbor)
 *   - Validated on ACX7509 and ACX7100-48L EVO platforms
 * Pair with:
 *   - evo/transport/ldp.conf — targeted LDP session to remote PE
 * Variables:
 *   $PE_NEIGHBOR       e.g. 192.168.0.12
 *   $AC_INTF           e.g. ae1
 *   $UNIT              e.g. 1502
 *   $VC_ID             e.g. 1502
 */
l2circuit {
    neighbor $PE_NEIGHBOR {
        interface $AC_INTF.$UNIT {
            virtual-circuit-id $VC_ID;
            control-word;
            encapsulation-type ethernet-vlan;
            ignore-encapsulation-mismatch;
            ignore-mtu-mismatch;
            pseudowire-status-tlv;
            revert-time 30;
        }
    }
}
```

## evo/services/l3vpn-vrf-vrrp.conf

```
/*
 * Topic:   L3VPN VRF with VRRP — PE-CE eBGP peering, vrf-target, vrf-table-label
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Highlights:
 *   - Body is byte-identical to the Junos sibling
 *   - Validated on ACX7509 and ACX7100-48L (EVO platforms)
 *   - 513 instances validated at scale on each WAN Edge
 * Pair with:
 *   - evo/policy/bgp-to-ospf.conf — redistributes BGP into OSPF (if multicast VRF co-exists)
 * Variables:
 *   $VRF_NAME       e.g. l3vpn_vrrp_3001_3002
 *   $ROUTER_ID      e.g. 192.168.0.14
 *   $CE_GROUP       e.g. CE2
 *   $CE_NEIGHBOR    e.g. 10.75.0.7
 *   $LOCAL_ADDRESS  e.g. 10.75.0.8
 *   $CE_PEER_AS     e.g. 64520
 *   $AC_INTF        e.g. et-1/0/12
 *   $UNIT           e.g. 3002
 *   $RD             e.g. 192.168.0.14:3002
 *   $VRF_TARGET     e.g. 64510:3002
 */
$VRF_NAME {
    instance-type vrf;
    routing-options {
        router-id $ROUTER_ID;
    }
    protocols {
        bgp {
            group $CE_GROUP {
                type external;
                family inet {
                    any;
                }
                neighbor $CE_NEIGHBOR {
                    local-address $LOCAL_ADDRESS;
                    peer-as $CE_PEER_AS;
                }
            }
        }
    }
    interface $AC_INTF.$UNIT;
    route-distinguisher $RD;
    vrf-target target:$VRF_TARGET;
    vrf-table-label;
}
```

## evo/services/ngmvpn-hub-adv.conf

```
/*
 * Topic:   NGMVPN Hub-and-Spoke — Hub advertise-to-spokes VRF (vrf-import spoke, vrf-export null)
 * Seen on:
 *   EVO: wanedge3_acx7509
 * Highlights:
 *   - Hub side of hub-and-spoke NGMVPN — receives spoke routes via vrf-import
 *   - vrf-export null (hub does not re-export to other hubs)
 *   - eBGP CE peering with export redistribute-vpn policy
 *   - 1000 Hub_Adv instances on WAN Edge 3 (ACX7509)
 * Pair with:
 *   - evo/services/ngmvpn-spoke-adv.conf — corresponding spoke-side VRF
 *   - evo/policy/hub-spoke-import-export.conf — spoke_N import policy
 *   - evo/policy/redistribute-vpn.conf — export policy for CE redistribution
 * Variables:
 *   $VRF_NAME       e.g. Hub_Adv_To_Spokes_1001
 *   $CE_GROUP       e.g. CE2
 *   $CE_NEIGHBOR    e.g. 10.70.0.1
 *   $LOCAL_ADDRESS  e.g. 10.70.0.2
 *   $CE_PEER_AS     e.g. 64520
 *   $AC_INTF        e.g. et-1/0/12
 *   $UNIT           e.g. 2001
 *   $RD             e.g. 192.168.0.14:2001
 *   $VRF_IMPORT     e.g. spoke_1
 */
$VRF_NAME {
    instance-type vrf;
    protocols {
        bgp {
            group $CE_GROUP {
                type external;
                export redistribute-vpn;
                neighbor $CE_NEIGHBOR {
                    local-address $LOCAL_ADDRESS;
                    peer-as $CE_PEER_AS;
                }
            }
        }
    }
    interface $AC_INTF.$UNIT;
    route-distinguisher $RD;
    vrf-import $VRF_IMPORT;
    vrf-export null;
}
```

## evo/services/ngmvpn-spoke-adv.conf

```
/*
 * Topic:   NGMVPN Hub-and-Spoke — Spoke advertise-to-hub VRF (vrf-import null, vrf-export hub)
 * Seen on:
 *   EVO: wanedge3_acx7509
 * Highlights:
 *   - Spoke side of hub-and-spoke NGMVPN — exports routes with hub community
 *   - vrf-import null (spoke does not import from other spokes directly)
 *   - eBGP CE peering without export policy (CE routes only)
 *   - 1000 Spokes_Adv instances on WAN Edge 3 (ACX7509)
 * Pair with:
 *   - evo/services/ngmvpn-hub-adv.conf — corresponding hub-side VRF
 *   - evo/policy/hub-spoke-import-export.conf — hub_N export policy
 * Variables:
 *   $VRF_NAME       e.g. Spokes_Adv_To_Hub_1001
 *   $CE_GROUP       e.g. CE2
 *   $CE_NEIGHBOR    e.g. 10.65.0.1
 *   $LOCAL_ADDRESS  e.g. 10.65.0.2
 *   $CE_PEER_AS     e.g. 64520
 *   $AC_INTF        e.g. et-1/0/12
 *   $UNIT           e.g. 1001
 *   $RD             e.g. 192.168.0.14:1001
 *   $VRF_EXPORT     e.g. hub_1
 */
$VRF_NAME {
    instance-type vrf;
    protocols {
        bgp {
            group $CE_GROUP {
                type external;
                neighbor $CE_NEIGHBOR {
                    local-address $LOCAL_ADDRESS;
                    peer-as $CE_PEER_AS;
                }
            }
        }
    }
    interface $AC_INTF.$UNIT;
    route-distinguisher $RD;
    vrf-import null;
    vrf-export $VRF_EXPORT;
}
```

## evo/services/ngmvpn-vrf.conf

```
/*
 * Topic:   NGMVPN (Next-Generation Multicast VPN) — multicast VRF with MVPN, PIM, OSPF CE
 * Seen on:
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Highlights:
 *   - Instance-type vrf with protocols mvpn (draft-rosen NG-MVPN)
 *   - PIM sparse-mode with local RP + process-non-null-as-null-register
 *   - OSPF CE redistribution (bgp-to-ospf export policy)
 *   - provider-tunnel ldp-p2mp with selective per-group tunnels
 *   - 100 multicast VPN instances validated at scale
 * Pair with:
 *   - evo/transport/pim-sparse-rp.conf — global PIM for core multicast
 *   - evo/policy/bgp-to-ospf.conf — redistributes BGP into VRF OSPF
 * JVD service mapping:
 *   100 NGMVPN instances (vpn-mcast_1 through vpn-mcast_100) on 4 WAN Edge PEs
 * Variables:
 *   $VRF_NAME       e.g. vpn-mcast_10
 *   $LOOPBACK_UNIT  e.g. 10
 *   $CE_INTF        e.g. et-1/0/10
 *   $CE_UNIT        e.g. 10
 *   $RP_ADDRESS     e.g. 10.33.33.10
 *   $MCAST_GROUP    e.g. 227.1.1.10/32
 *   $MCAST_SOURCE   e.g. 124.1.10.1/32
 *   $RD             e.g. 10.33.33.10:10
 *   $VRF_TARGET     e.g. 1:10
 */
$VRF_NAME {
    instance-type vrf;
    protocols {
        mvpn;
        ospf {
            area 0.0.0.0 {
                interface lo0.$LOOPBACK_UNIT;
                interface $CE_INTF.$CE_UNIT;
            }
            export bgp-to-ospf;
        }
        pim {
            rp {
                local {
                    address $RP_ADDRESS;
                    group-ranges {
                        $MCAST_GROUP;
                    }
                    process-non-null-as-null-register;
                }
            }
            interface lo0.$LOOPBACK_UNIT {
                mode sparse;
                version 2;
            }
            interface $CE_INTF.$CE_UNIT {
                mode sparse;
                version 2;
            }
        }
    }
    interface $CE_INTF.$CE_UNIT;
    interface lo0.$LOOPBACK_UNIT;
    route-distinguisher $RD;
    vrf-target target:$VRF_TARGET;
    vrf-table-label;
    provider-tunnel {
        ldp-p2mp;
        selective {
            tunnel-limit 1;
            group $MCAST_GROUP {
                source $MCAST_SOURCE {
                    ldp-p2mp;
                }
            }
        }
    }
}
```

## evo/services/vpls-virtual-switch.conf

```
/*
 * Topic:   VPLS virtual-switch instance with LDP signaling (EVO vlans syntax)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Highlights:
 *   - instance-type virtual-switch with vlans (EVO syntax, not bridge-domains)
 *   - VPLS site-identifier for multi-homing site designation
 *   - no-tunnel-services (uses LDP instead of RSVP tunnel)
 *   - flow-label-transmit/receive for FAT pseudowire ECMP
 *   - 1000 instances validated at scale
 * Pair with:
 *   - evo/transport/ldp.conf — LDP signaling for VPLS pseudowires
 * Variables:
 *   $VRF_NAME       e.g. vpls_group_101_1
 *   $SITE_NAME      e.g. 103
 *   $SITE_ID        e.g. 1003
 *   $VPLS_ID        e.g. 1
 *   $VLAN_NAME      e.g. VPLS1
 *   $VLAN           e.g. 1
 *   $AC_INTF        e.g. ae1
 *   $UNIT           e.g. 1
 *   $RD             e.g. 4444:1011
 *   $VRF_TARGET     e.g. 64512:1011
 */
$VRF_NAME {
    instance-type virtual-switch;
    protocols {
        vpls {
            site $SITE_NAME {
                site-identifier $SITE_ID;
            }
            no-tunnel-services;
            vpls-id $VPLS_ID;
            flow-label-transmit;
            flow-label-receive;
        }
    }
    route-distinguisher $RD;
    vrf-target target:$VRF_TARGET;
    vlans {
        $VLAN_NAME {
            vlan-id $VLAN;
            interface $AC_INTF.$UNIT;
        }
    }
}
```

## evo/transport/bgp-ibgp-rr.conf

```
/*
 * Topic:   iBGP Route Reflector — inet-vpn, l2vpn families with cluster-id
 * Seen on:
 *   EVO: p1_ptx10003 p2_ptx10001-36mr
 * Highlights:
 *   - Route Reflector with cluster-id (cluster = RR loopback)
 *   - inet-vpn + l2vpn signaling + inet unicast (for labeled routes)
 *   - Reflects to all PE clients (wanedge1-4)
 *   - BFD liveness detection + graceful-restart + multipath
 *   - send-ospf export policy redistributes OSPF into BGP for VPN reachability
 * Pair with:
 *   - evo/transport/ospf-lfa.conf — IGP reachability to PE loopbacks
 *   - evo/transport/ldp.conf — label distribution
 * Variables:
 *   $LOCAL_ADDRESS  e.g. 1.1.1.8
 *   $CLUSTER_ID     e.g. 1.1.1.8
 *   $LOCAL_AS       e.g. 64512
 *   $PE_NEIGHBOR_1  e.g. 2.2.2.2
 *   $PE_NEIGHBOR_2  e.g. 4.4.4.4
 *   $PE_NEIGHBOR_3  e.g. 5.5.5.5
 *   $PE_NEIGHBOR_4  e.g. 7.7.7.7
 */
protocols {
    bgp {
        group ibgp {
            type internal;
            local-address $LOCAL_ADDRESS;
            family inet {
                any;
            }
            family inet-vpn {
                any;
            }
            family l2vpn {
                signaling;
            }
            export send-ospf;
            cluster $CLUSTER_ID;
            local-as $LOCAL_AS;
            graceful-restart;
            multipath;
            bfd-liveness-detection {
                minimum-interval 10;
                multiplier 3;
            }
            neighbor $PE_NEIGHBOR_1;
            neighbor $PE_NEIGHBOR_2;
            neighbor $PE_NEIGHBOR_3;
            neighbor $PE_NEIGHBOR_4;
        }
        advertise-peer-as;
    }
}
```

## evo/transport/ldp.conf

```
/*
 * Topic:   LDP with auto-targeted sessions and P2MP (multicast)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 * Highlights:
 *   - auto-targeted sessions with P2MP capability for multicast
 *   - All EVO P and PE devices run LDP
 * Pair with:
 *   - evo/transport/ospf-lfa.conf — IGP reachability for LDP sessions
 * Variables:
 *   $CORE_INTF_1    e.g. et-1/0/0.0
 *   $CORE_INTF_2    e.g. et-1/0/1.0
 *   $LOOPBACK       e.g. lo0.0
 */
protocols {
    ldp {
        auto-targeted-session {
            teardown-delay 90;
            maximum-sessions 100;
        }
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
        interface $LOOPBACK;
        p2mp;
    }
}
```

## evo/transport/mpls-transit.conf

```
/*
 * Topic:   MPLS interfaces (EVO P-routers — no LSPs, transit only)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO: p1_ptx10003 p2_ptx10001-36mr
 * Highlights:
 *   - P-routers enable MPLS on all core-facing interfaces (transit role)
 *   - No LSP head-end on P-routers — they are transit/RR only
 * Pair with:
 *   - evo/transport/ospf-lfa.conf — IGP provides topology for MPLS forwarding
 *   - evo/transport/ldp.conf — label distribution
 * Variables:
 *   $CORE_INTF_1    e.g. et-0/0/2.0
 *   $CORE_INTF_2    e.g. et-0/0/3.0
 *   $CORE_INTF_3    e.g. ae2.0
 */
protocols {
    mpls {
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
        interface $CORE_INTF_3;
    }
}
```

## evo/transport/ospf-lfa.conf

```
/*
 * Topic:   OSPF with Loop-Free Alternates (LFA) — remote-backup, per-prefix, node-link-degradation
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 * Highlights:
 *   - EVO uses passive on loopback (Junos leaves it bare)
 *   - All 4 EVO P/PE devices in the topology run OSPF LFA
 * Pair with:
 *   - evo/transport/ldp.conf — LDP runs on same interfaces
 * Variables:
 *   $LOOPBACK       e.g. lo0.0
 *   $CORE_INTF_1    e.g. et-1/0/0.0
 *   $CORE_INTF_2    e.g. et-1/0/1.0
 */
protocols {
    ospf {
        backup-spf-options {
            remote-backup-calculation;
            per-prefix-calculation all;
            node-link-degradation;
        }
        traffic-engineering;
        area 0.0.0.0 {
            interface $LOOPBACK {
                passive;
            }
            interface $CORE_INTF_1 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface $CORE_INTF_2 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
        }
    }
}
```

## evo/transport/pim-sparse-rp.conf

```
/*
 * Topic:   PIM sparse-mode — P-router as local RP for NGMVPN
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO: p1_ptx10003 wanedge3_acx7509 wanedge4_acx7100-48l
 * Highlights:
 *   - P1 acts as rendezvous point (local RP) for the multicast domain
 *   - process-non-null-as-null-register simplifies register handling
 *   - EVO PE devices use static RP pointing to P1 (same body as Junos)
 * Pair with:
 *   - evo/services/ngmvpn-vrf.conf — per-VRF PIM/MVPN
 *   - evo/transport/ospf-lfa.conf — RP reachability via IGP
 * Variables:
 *   $RP_ADDRESS     e.g. 1.1.1.8
 *   $CORE_INTF_1    e.g. et-1/0/4.0
 *   $LOOPBACK       e.g. lo0.0
 */
protocols {
    pim {
        rp {
            local {
                address $RP_ADDRESS;
                process-non-null-as-null-register;
            }
        }
        interface $CORE_INTF_1 {
            mode sparse;
        }
        interface $LOOPBACK {
            mode sparse;
        }
    }
}
```

## junos/bootstrap/chassis.conf

```
/*
 * Topic:   Chassis — aggregated-devices count (Junos)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008 ce2_mx480
 * Highlights:
 *   - aggregated-devices device-count 25 pre-allocates ae interface namespace
 *   - Junos MX does not require network-services enhanced-ip (unlike EVO)
 * Pair with:
 * Variables:
 *   $AE_DEVICE_COUNT  e.g. 25
 */
chassis {
    aggregated-devices {
        ethernet {
            device-count $AE_DEVICE_COUNT;
        }
    }
}
```

## junos/bootstrap/forwarding-options-hash.conf

```
/*
 * Topic:   Forwarding-options hash-key — MPLS and multiservice ECMP hashing
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 * Highlights:
 *   - MPLS hash-key uses label-1/2/3 for per-flow load-balancing across ECMP paths
 *   - Multiservice hash uses src+dst MAC for L2 service ECMP
 *   - enhanced-hash-key with no-payload (hash on labels only, not inner payload)
 *   - load-balance-label-capability enables entropy-label processing
 *   - Critical for achieving link utilization across parallel core paths
 * Pair with:
 *   - junos/transport/mpls-lsp.conf — entropy-label LSPs benefit from this hash config
 *   - junos/transport/ldp.conf — LDP LSPs use the MPLS hash-key
 * Variables:
 *   (none — hash configuration is invariant)
 */
forwarding-options {
    hash-key {
        family mpls {
            label-1;
            label-2;
            label-3;
        }
        family multiservice {
            source-mac;
            destination-mac;
        }
    }
    enhanced-hash-key {
        family mpls {
            no-payload;
        }
    }
    load-balance-label-capability;
}
```

## junos/cos/classifiers-forwarding-classes.conf

```
/*
 * Topic:   Class-of-Service — DSCP and 802.1p classifiers, forwarding-classes, rewrite-rules
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 * Highlights:
 *   - 8 forwarding classes: be, be1, af, af1, ef, ef1, nc, nc1 (queues 0-7)
 *   - DSCP classifier "mydscp" maps 8 code-points with loss-priority differentiation
 *   - 802.1p classifier "dot1p" for L2 service ingress classification
 *   - Enables hierarchical QoS for mixed L2/L3 services at scale
 *   - Only configured on WAN Edge PEs (not P-routers)
 * Pair with:
 *   - junos/services/vpls-virtual-switch.conf — L2 services use dot1p classifier
 *   - junos/services/l3vpn-vrf-vrrp.conf — L3 services use DSCP classifier
 * Variables:
 *   (none — CoS profile is invariant across WAN Edge PEs)
 */
class-of-service {
    classifiers {
        dscp mydscp {
            forwarding-class af {
                loss-priority low code-points 000101;
            }
            forwarding-class af1 {
                loss-priority medium-low code-points 001101;
            }
            forwarding-class be {
                loss-priority low code-points 000001;
            }
            forwarding-class be1 {
                loss-priority medium-low code-points 001001;
            }
            forwarding-class ef {
                loss-priority low code-points 000011;
            }
            forwarding-class ef1 {
                loss-priority medium-low code-points 001011;
            }
            forwarding-class nc {
                loss-priority low code-points 000111;
            }
            forwarding-class nc1 {
                loss-priority medium-low code-points 001111;
            }
        }
        ieee-802.1 dot1p {
            forwarding-class af {
                loss-priority low code-points 010;
            }
            forwarding-class af1 {
                loss-priority low code-points 110;
            }
            forwarding-class be {
                loss-priority low code-points 000;
            }
            forwarding-class be1 {
                loss-priority low code-points 100;
            }
            forwarding-class ef {
                loss-priority high code-points 001;
            }
            forwarding-class ef1 {
                loss-priority high code-points 101;
            }
            forwarding-class nc {
                loss-priority high code-points 011;
            }
            forwarding-class nc1 {
                loss-priority high code-points 111;
            }
        }
    }
    forwarding-classes {
        class af queue-num 2;
        class af1 queue-num 6;
        class be queue-num 0;
        class be1 queue-num 4;
        class ef queue-num 1;
        class ef1 queue-num 5;
        class nc queue-num 3;
        class nc1 queue-num 7;
    }
}
```

## junos/interfaces/ae-lag-access.conf

```
/*
 * Topic:   Aggregated Ethernet LAG — access link with flexible-vlan-tagging (service-facing)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Highlights:
 *   - flexible-vlan-tagging + flexible-ethernet-services for per-unit encap selection
 *   - LACP active with system-id (MC-LAG identifier if dual-homed)
 *   - Carries thousands of VLAN-tagged subinterfaces for L2CKT/VPLS/L3VPN services
 *   - Each service unit uses vlan-bridge (L2) or vlan-ccc (L2CKT) or inet (L3VPN)
 * Pair with:
 *   - junos/bootstrap/chassis.conf — pre-allocates ae device-count
 *   - junos/services/vpls-virtual-switch.conf — L2 units reference ae1.X
 *   - junos/services/l2ckt-pseudowire.conf — L2CKT units reference ae1.X
 *   - junos/services/l3vpn-vrf-vrrp.conf — L3VPN interface references
 * Variables:
 *   $AE_INTF        e.g. ae1
 *   $LACP_SYSTEM_ID e.g. 00:00:22:00:00:01
 */
interfaces {
    $AE_INTF {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            lacp {
                active;
                periodic fast;
                system-id $LACP_SYSTEM_ID;
            }
        }
    }
}
```

## junos/interfaces/ae-lag-core.conf

```
/*
 * Topic:   Aggregated Ethernet LAG — core link with LACP (P2P to P-router)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 * Highlights:
 *   - LACP active with fast periodic (1s intervals)
 *   - Core-facing LAG carries family inet + family mpls (L3 + MPLS transport)
 *   - All PE-to-P links use ae2 as the core LAG in this topology
 * Pair with:
 *   - junos/bootstrap/chassis.conf — pre-allocates ae device-count
 *   - junos/transport/ospf-lfa.conf — OSPF runs on ae2.0
 *   - junos/transport/ldp.conf — LDP runs on ae2.0
 * Variables:
 *   $AE_INTF        e.g. ae2
 *   $DESCRIPTION    e.g. Link1 from WAN Edge1 to P1 Node
 *   $LOCAL_ADDRESS  e.g. 10.10.12.1/24
 */
interfaces {
    $AE_INTF {
        description "$DESCRIPTION";
        aggregated-ether-options {
            lacp {
                active;
                periodic fast;
            }
        }
        unit 0 {
            family inet {
                address $LOCAL_ADDRESS;
            }
            family mpls;
        }
    }
}
```

## junos/policy/bgp-to-ospf.conf

```
/*
 * Topic:   BGP-to-OSPF redistribution policy (for multicast VPN CE routing)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 * Highlights:
 *   - Simple accept-all from protocol bgp; used as OSPF export in NGMVPN VRFs
 *   - Enables BGP-learned VPN routes to be redistributed into VRF-local OSPF
 *   - Also used as iBGP group export on PE devices for multicast signaling
 * Pair with:
 *   - junos/services/ngmvpn-vrf.conf — OSPF export references this policy
 * Variables:
 *   (none — policy is invariant across instances)
 */
policy-options {
    policy-statement bgp-to-ospf {
        from protocol bgp;
        then accept;
    }
}
```

## junos/policy/hub-spoke-community.conf

```
/*
 * Topic:   Hub-and-Spoke communities — RT community per spoke/hub group
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 * Highlights:
 *   - Hub community carries routes FROM hub TO spokes (odd RT values)
 *   - Spoke community carries routes FROM spoke TO hub (even RT values)
 *   - Pattern: hub_N target:65535:<2N-1>, spoke_N target:65535:<2N>
 *   - 1000 hub + 1000 spoke communities validated at scale
 * Pair with:
 *   - junos/policy/hub-spoke-import-export.conf — references these communities
 *   - junos/services/l3vpn-vrf-spoke.conf — vrf-import/export uses hub/spoke policies
 * Variables:
 *   $HUB_COMMUNITY_NAME    e.g. hub_1
 *   $HUB_RT                e.g. target:65535:1
 *   $SPOKE_COMMUNITY_NAME  e.g. spoke_1
 *   $SPOKE_RT              e.g. target:65535:2
 */
policy-options {
    community $HUB_COMMUNITY_NAME members $HUB_RT;
    community $SPOKE_COMMUNITY_NAME members $SPOKE_RT;
}
```

## junos/policy/hub-spoke-import-export.conf

```
/*
 * Topic:   Hub-and-Spoke import/export policies — hub imports spoke community, spoke imports hub
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 * Highlights:
 *   - hub_N policy: accepts routes with spoke_N community (hub imports from spokes)
 *   - spoke_N policy: adds spoke_N community on export, accepts bgp+direct
 *   - Explicit reject term prevents route leaking between VRFs
 *   - Used by l3vpn-vrf-spoke vrf-import/vrf-export statements
 * Pair with:
 *   - junos/policy/hub-spoke-community.conf — community definitions referenced here
 *   - junos/services/l3vpn-vrf-spoke.conf — uses these as vrf-import/export
 * Variables:
 *   $HUB_POLICY_NAME     e.g. hub_1
 *   $HUB_COMMUNITY       e.g. hub_1
 *   $SPOKE_POLICY_NAME   e.g. spoke_1
 *   $SPOKE_COMMUNITY     e.g. spoke_1
 */
policy-options {
    policy-statement $HUB_POLICY_NAME {
        term a {
            from {
                protocol bgp;
                community $HUB_COMMUNITY;
            }
            then accept;
        }
        term b {
            then reject;
        }
    }
    policy-statement $SPOKE_POLICY_NAME {
        term a {
            from protocol [ bgp direct ];
            then {
                community add $SPOKE_COMMUNITY;
                accept;
            }
        }
        term b {
            then reject;
        }
    }
}
```

## junos/services/l2ckt-pseudowire.conf

```
/*
 * Topic:   L2CKT pseudowire with hot-standby backup (protocols l2circuit)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 * Highlights:
 *   - Pseudowire with control-word and Ethernet-VLAN encapsulation
 *   - Hot-standby backup-neighbor for sub-50ms PW failover
 *   - revert-time 30s (revertive switchback after primary recovers)
 *   - ignore-encapsulation-mismatch + ignore-mtu-mismatch for interop flexibility
 *   - pseudowire-status-tlv for operational state signaling
 *   - ~500 L2CKTs per WAN Edge validated at scale
 * Pair with:
 *   - junos/transport/ldp.conf — targeted LDP session to remote PE
 *   - junos/transport/mpls-lsp.conf — MPLS transport
 * Variables:
 *   $PE_NEIGHBOR       e.g. 192.168.0.14
 *   $AC_INTF           e.g. ae1
 *   $UNIT              e.g. 1501
 *   $VC_ID             e.g. 1501
 *   $BACKUP_NEIGHBOR   e.g. 192.168.0.16
 */
l2circuit {
    neighbor $PE_NEIGHBOR {
        interface $AC_INTF.$UNIT {
            virtual-circuit-id $VC_ID;
            control-word;
            encapsulation-type ethernet-vlan;
            ignore-encapsulation-mismatch;
            ignore-mtu-mismatch;
            pseudowire-status-tlv;
            revert-time 30;
            backup-neighbor $BACKUP_NEIGHBOR {
                hot-standby;
            }
        }
    }
}
```

## junos/services/l3vpn-vrf-spoke.conf

```
/*
 * Topic:   L3VPN Hub-and-Spoke — Spoke VRF (vrf-import hub policy, vrf-export spoke community)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 * Highlights:
 *   - Hub-and-spoke L3VPN via asymmetric vrf-import/export policies
 *   - Spoke exports routes with spoke community; imports routes with hub community
 *   - as-override on CE peering (spoke sites share the same CE AS)
 *   - 1000 instances per WAN Edge validated at scale
 * Pair with:
 *   - junos/policy/hub-spoke-community.conf — hub/spoke RT communities
 *   - junos/policy/hub-spoke-import-export.conf — hub_N/spoke_N policy-statements
 *   - junos/transport/bgp-ibgp-rr-client.conf — carries inet-vpn routes to RR
 * Variables:
 *   $VRF_NAME       e.g. l3vpn_Spoke_1_1
 *   $CE_GROUP       e.g. v4spirent
 *   $CE_NEIGHBOR    e.g. 10.40.0.1
 *   $LOCAL_ADDRESS  e.g. 10.40.0.2
 *   $CE_PEER_AS     e.g. 64510
 *   $AC_INTF        e.g. xe-0/0/15:0
 *   $UNIT           e.g. 4001
 *   $RD             e.g. 10.10.0.12:4001
 *   $VRF_IMPORT     e.g. hub_1
 *   $VRF_EXPORT     e.g. spoke_1
 */
$VRF_NAME {
    instance-type vrf;
    protocols {
        bgp {
            group $CE_GROUP {
                type external;
                family inet {
                    any;
                }
                neighbor $CE_NEIGHBOR {
                    local-address $LOCAL_ADDRESS;
                    peer-as $CE_PEER_AS;
                    as-override;
                }
            }
        }
    }
    interface $AC_INTF.$UNIT;
    route-distinguisher $RD;
    vrf-import $VRF_IMPORT;
    vrf-export $VRF_EXPORT;
    vrf-table-label;
}
```

## junos/services/l3vpn-vrf-vrrp.conf

```
/*
 * Topic:   L3VPN VRF with VRRP — PE-CE eBGP peering, vrf-target, vrf-table-label
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 * Highlights:
 *   - Instance-type vrf with vrf-table-label (signal-based, no per-VRF MPLS interface)
 *   - eBGP PE-CE with inet unicast only (family inet any)
 *   - Single vrf-target (symmetric import/export via auto-derived RT)
 *   - router-id set per-VRF to PE loopback (standard but non-default)
 *   - 513 instances validated at scale on each WAN Edge
 * Pair with:
 *   - junos/transport/bgp-ibgp-rr-client.conf — carries inet-vpn routes to RR
 *   - junos/policy/bgp-to-ospf.conf — redistributes BGP into OSPF (if multicast VRF co-exists)
 * Variables:
 *   $VRF_NAME       e.g. l3vpn_vrrp_3001_3002
 *   $ROUTER_ID      e.g. 10.10.0.12
 *   $CE_GROUP       e.g. CE1
 *   $CE_NEIGHBOR    e.g. 10.45.0.7
 *   $LOCAL_ADDRESS  e.g. 10.45.0.8
 *   $CE_PEER_AS     e.g. 64510
 *   $AC_INTF        e.g. xe-0/0/15:1
 *   $UNIT           e.g. 3002
 *   $RD             e.g. 10.10.0.12:3002
 *   $VRF_TARGET     e.g. 64510:3002
 */
$VRF_NAME {
    instance-type vrf;
    routing-options {
        router-id $ROUTER_ID;
    }
    protocols {
        bgp {
            group $CE_GROUP {
                type external;
                family inet {
                    any;
                }
                neighbor $CE_NEIGHBOR {
                    local-address $LOCAL_ADDRESS;
                    peer-as $CE_PEER_AS;
                }
            }
        }
    }
    interface $AC_INTF.$UNIT;
    route-distinguisher $RD;
    vrf-target target:$VRF_TARGET;
    vrf-table-label;
}
```

## junos/services/ngmvpn-vrf.conf

```
/*
 * Topic:   NGMVPN (Next-Generation Multicast VPN) — multicast VRF with MVPN, PIM, OSPF CE
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 * Highlights:
 *   - Body is byte-identical to the EVO sibling
 *   - Instance-type vrf with protocols mvpn (draft-rosen NG-MVPN)
 *   - PIM sparse-mode with local group-ranges + static RP address
 *   - provider-tunnel ldp-p2mp with selective per-group tunnels
 *   - 100 multicast VPN instances validated at scale
 * Pair with:
 *   - junos/transport/bgp-ibgp-rr-client.conf — carries inet-vpn + mvpn routes
 *   - junos/transport/pim-sparse.conf — global PIM for core multicast
 *   - junos/policy/bgp-to-ospf.conf — redistributes BGP into VRF OSPF
 * Variables:
 *   $VRF_NAME       e.g. vpn-mcast_10
 *   $LOOPBACK_UNIT  e.g. 10
 *   $CE_INTF        e.g. xe-0/0/15:3
 *   $CE_UNIT        e.g. 10
 *   $RP_ADDRESS     e.g. 10.33.33.10
 *   $MCAST_GROUP    e.g. 227.1.1.10/32
 *   $MCAST_SOURCE   e.g. 124.1.10.1/32
 *   $RD             e.g. 10.11.11.10:10
 *   $VRF_TARGET     e.g. 1:10
 */
$VRF_NAME {
    instance-type vrf;
    protocols {
        mvpn;
        ospf {
            area 0.0.0.0 {
                interface lo0.$LOOPBACK_UNIT;
                interface $CE_INTF.$CE_UNIT;
            }
            export bgp-to-ospf;
        }
        pim {
            rp {
                local {
                    group-ranges {
                        $MCAST_GROUP;
                    }
                }
                static {
                    address $RP_ADDRESS;
                }
            }
            interface lo0.$LOOPBACK_UNIT {
                mode sparse;
                version 2;
            }
            interface $CE_INTF.$CE_UNIT {
                mode sparse;
                version 2;
            }
        }
    }
    interface $CE_INTF.$CE_UNIT;
    interface lo0.$LOOPBACK_UNIT;
    route-distinguisher $RD;
    vrf-target target:$VRF_TARGET;
    vrf-table-label;
    provider-tunnel {
        ldp-p2mp;
        selective {
            tunnel-limit 1;
            group $MCAST_GROUP {
                source $MCAST_SOURCE {
                    ldp-p2mp;
                }
            }
        }
    }
}
```

## junos/services/vpls-virtual-switch.conf

```
/*
 * Topic:   VPLS virtual-switch instance with LDP signaling (Junos bridge-domains)
 * Seen on:
 *   Junos: wanedge1_mx304
 * Highlights:
 *   - instance-type virtual-switch with bridge-domains (Junos syntax)
 *   - VPLS site-identifier for multi-homing site designation
 *   - no-tunnel-services (uses LDP instead of RSVP tunnel)
 *   - flow-label-transmit/receive for FAT pseudowire ECMP
 *   - 1000 instances validated at scale
 * Pair with:
 *   - junos/transport/ldp.conf — LDP signaling for VPLS pseudowires
 *   - junos/transport/mpls-lsp.conf — MPLS transport LSPs
 * Variables:
 *   $VRF_NAME       e.g. vpls_group_101_1
 *   $SITE_NAME      e.g. 101
 *   $SITE_ID        e.g. 1001
 *   $VPLS_ID        e.g. 1
 *   $BD_NAME        e.g. BDVPLS1
 *   $VLAN           e.g. 1
 *   $AC_INTF        e.g. ae1
 *   $UNIT           e.g. 1
 *   $RD             e.g. 2222:1011
 *   $VRF_TARGET     e.g. 64512:1011
 */
$VRF_NAME {
    instance-type virtual-switch;
    protocols {
        vpls {
            site $SITE_NAME {
                site-identifier $SITE_ID;
            }
            no-tunnel-services;
            vpls-id $VPLS_ID;
            flow-label-transmit;
            flow-label-receive;
        }
    }
    bridge-domains {
        $BD_NAME {
            vlan-id $VLAN;
            interface $AC_INTF.$UNIT;
        }
    }
    route-distinguisher $RD;
    vrf-target target:$VRF_TARGET;
}
```

## junos/transport/bgp-ibgp-rr-client.conf

```
/*
 * Topic:   iBGP to Route Reflector — inet-vpn, l2vpn, route-target families with BFD
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 * Highlights:
 *   - iBGP PE-to-RR with inet labeled-unicast + inet-vpn + l2vpn signaling + route-target
 *   - route-target family enables RT-constrained route distribution (RTC/RFC 4684)
 *   - BFD liveness detection (10ms interval, multiplier 3) for fast failure detection
 *   - graceful-restart for hitless BGP restart
 *   - bgp-to-ospf export for multicast VPN OSPF redistribution
 * Pair with:
 *   - junos/transport/ospf-lfa.conf — IGP reachability to RR loopbacks
 *   - junos/transport/ldp.conf — label distribution for inet labeled-unicast
 *   - junos/policy/bgp-to-ospf.conf — export policy for multicast VPN OSPF redistribution
 * Variables:
 *   $LOCAL_ADDRESS  e.g. 10.10.0.12
 *   $RR_NEIGHBOR_1  e.g. 192.168.0.17
 *   $RR_NEIGHBOR_2  e.g. 192.168.0.11
 *   $LOCAL_AS       e.g. 64512
 */
protocols {
    bgp {
        group ibgp {
            type internal;
            local-address $LOCAL_ADDRESS;
            family inet {
                labeled-unicast;
            }
            family inet-vpn {
                any;
            }
            family l2vpn {
                signaling;
            }
            family route-target;
            export bgp-to-ospf;
            bfd-liveness-detection {
                minimum-interval 10;
                multiplier 3;
            }
            neighbor $RR_NEIGHBOR_1;
            neighbor $RR_NEIGHBOR_2;
        }
        advertise-peer-as;
        local-as $LOCAL_AS;
        graceful-restart;
    }
}
```

## junos/transport/ldp.conf

```
/*
 * Topic:   LDP with auto-targeted sessions and P2MP (multicast)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 * Highlights:
 *   - auto-targeted-session enables targeted LDP for l2circuit/VPLS pseudowires
 *   - teardown-delay 90s prevents session flap on brief outages
 *   - maximum-sessions 100 caps resource usage
 *   - p2mp enables LDP P2MP LSPs for NGMVPN provider tunnels
 *   - All 8 devices run LDP (7 in the split inventory)
 * Pair with:
 *   - junos/transport/ospf-lfa.conf — IGP reachability for LDP sessions
 *   - junos/transport/mpls-lsp.conf — MPLS forwarding
 *   - junos/services/l2ckt-pseudowire.conf — uses targeted LDP sessions
 *   - junos/services/vpls-virtual-switch.conf — uses LDP signaling
 * Variables:
 *   $CORE_INTF_1    e.g. et-0/0/6.0
 *   $CORE_INTF_2    e.g. ae2.0
 *   $LOOPBACK       e.g. lo0.0
 */
protocols {
    ldp {
        auto-targeted-session {
            teardown-delay 90;
            maximum-sessions 100;
        }
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
        interface $LOOPBACK;
        p2mp;
    }
}
```

## junos/transport/mpls-lsp.conf

```
/*
 * Topic:   MPLS LSPs with entropy-label (RSVP-TE)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 * Highlights:
 *   - RSVP-TE label-switched-paths to remote PEs
 *   - entropy-label enables per-flow ECMP at transit P-routers (RFC 6790)
 *   - Core and access interfaces enabled for MPLS forwarding
 * Pair with:
 *   - junos/transport/ospf-lfa.conf — CSPF path computation uses OSPF-TE
 *   - junos/transport/ldp.conf — co-exists for LDP-signaled services
 * Variables:
 *   $LSP_NAME       e.g. lsp_to_pe3
 *   $LSP_TO         e.g. 192.168.0.14
 *   $CORE_INTF_1    e.g. ae1.0
 *   $CORE_INTF_2    e.g. ae2.0
 *   $CORE_INTF_3    e.g. et-0/0/6.0
 */
protocols {
    mpls {
        label-switched-path $LSP_NAME {
            to $LSP_TO;
            entropy-label;
        }
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
        interface $CORE_INTF_3;
    }
}
```

## junos/transport/ospf-lfa.conf

```
/*
 * Topic:   OSPF with Loop-Free Alternates (LFA) — remote-backup, per-prefix, node-link-degradation
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 * Highlights:
 *   - backup-spf-options: remote-backup-calculation + per-prefix-calculation all + node-link-degradation
 *   - Provides sub-50ms IP/MPLS convergence via pre-computed backup next-hops
 *   - traffic-engineering enabled (required for RSVP LSPs and TE extensions)
 *   - BFD per-interface (10ms min-interval, multiplier 3, full-neighbors-only)
 *   - ldp-synchronization prevents traffic blackholing during LDP convergence
 *   - node-link-protection on all core interfaces
 * Pair with:
 *   - junos/transport/ldp.conf — LDP runs on same interfaces
 *   - junos/transport/mpls-lsp.conf — RSVP-TE uses OSPF TE extensions
 * Variables:
 *   $LOOPBACK       e.g. lo0.0
 *   $CORE_INTF_1    e.g. ae2.0
 *   $CORE_INTF_2    e.g. et-0/0/6.0
 */
protocols {
    ospf {
        backup-spf-options {
            remote-backup-calculation;
            per-prefix-calculation all;
            node-link-degradation;
        }
        traffic-engineering;
        area 0.0.0.0 {
            interface $LOOPBACK;
            interface $CORE_INTF_1 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface $CORE_INTF_2 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
        }
    }
}
```

## junos/transport/pim-sparse.conf

```
/*
 * Topic:   PIM sparse-mode — global multicast for NGMVPN provider tunnels
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 * Highlights:
 *   - Static RP or local RP depending on device role (PE=static, P=local)
 *   - PE uses static RP pointing to P1 (ptx10003) loopback
 *   - P1 acts as RP with local address + process-non-null-as-null-register
 *   - sparse-mode on core interfaces for PIM adjacency
 *   - Required for NGMVPN provider-tunnel ldp-p2mp operation
 * Pair with:
 *   - junos/services/ngmvpn-vrf.conf — per-VRF PIM/MVPN
 *   - junos/transport/ospf-lfa.conf — RP reachability via IGP
 * Variables:
 *   $RP_ADDRESS     e.g. 192.168.0.17
 *   $CORE_INTF_1    e.g. et-0/0/6.0
 *   $LOOPBACK       e.g. lo0.0
 */
protocols {
    pim {
        rp {
            static {
                address $RP_ADDRESS;
            }
        }
        interface $CORE_INTF_1 {
            mode sparse;
        }
        interface $LOOPBACK {
            mode sparse;
        }
    }
}
```

## _variables.md

# Variables Reference — EWAN Core & Edge Snip Library

All templated variables used across snips in this library.

| Variable | Meaning | Typical example | Used in |
|---|---|---|---|
| `$AC_INTF` | Attachment-circuit (access) interface | `ae1`, `xe-0/0/15:1` | services/* |
| `$AE_DEVICE_COUNT` | Chassis aggregated-device pre-allocation | `25` | bootstrap/chassis |
| `$AE_INTF` | Aggregated Ethernet interface name | `ae2` | interfaces/* |
| `$BACKUP_NEIGHBOR` | L2CKT hot-standby backup PE loopback | `192.168.0.16` | services/l2ckt-pseudowire |
| `$BD_NAME` | Bridge-domain name (Junos VPLS) | `BDVPLS1` | services/vpls-virtual-switch (junos) |
| `$BGP_GROUP` | BGP group name within VRF | `mcast_1` | services/ngmvpn-vrf |
| `$BGP_NEIGHBOR` | BGP neighbor within VRF | `10.11.11.1` | services/ngmvpn-vrf |
| `$CE_GROUP` | CE-facing BGP group name | `CE1`, `CE2` | services/l3vpn-* |
| `$CE_INTF` | CE-facing physical interface | `et-1/0/10` | services/ngmvpn-vrf |
| `$CE_NEIGHBOR` | CE device BGP neighbor address | `10.45.0.7` | services/l3vpn-* |
| `$CE_PEER_AS` | CE autonomous system number | `64510`, `64520` | services/l3vpn-*, services/ngmvpn-* |
| `$CE_UNIT` | CE interface unit number | `1` | services/ngmvpn-vrf |
| `$CLUSTER_ID` | BGP Route Reflector cluster-id | `1.1.1.8` | transport/bgp-ibgp-rr |
| `$CORE_INTF_1` | Core-facing interface (first) | `ae2.0`, `et-0/0/6.0` | transport/* |
| `$CORE_INTF_2` | Core-facing interface (second) | `et-0/0/2.0` | transport/* |
| `$CORE_INTF_3` | Core-facing interface (third) | `et-0/0/3.0` | transport/mpls-* |
| `$DESCRIPTION` | Interface description | `Link1 from WAN Edge1 to P1 Node` | interfaces/* |
| `$HUB_COMMUNITY` | Hub community name (policy ref) | `hub_1` | policy/hub-spoke-import-export |
| `$HUB_COMMUNITY_NAME` | Hub community definition name | `hub_1` | policy/hub-spoke-community |
| `$HUB_POLICY_NAME` | Hub import policy-statement name | `hub_1` | policy/hub-spoke-import-export |
| `$HUB_RT` | Hub route-target community value | `target:65535:1` | policy/hub-spoke-community |
| `$LACP_SYSTEM_ID` | LACP system-id for MC-LAG | `00:00:22:00:00:01` | interfaces/ae-lag-access |
| `$LOCAL_ADDRESS` | Local address for BGP/interface | `10.10.0.12`, `10.10.12.1/24` | transport/*, services/* |
| `$LOCAL_AS` | Local autonomous system number | `64512` | transport/bgp-* |
| `$LOOPBACK` | Loopback interface | `lo0.0` | transport/* |
| `$LOOPBACK_UNIT` | Loopback unit for per-VRF PIM/OSPF | `1` | services/ngmvpn-vrf |
| `$LSP_NAME` | RSVP-TE LSP name | `lsp_to_pe3` | transport/mpls-lsp |
| `$LSP_TO` | LSP destination (remote PE loopback) | `192.168.0.14` | transport/mpls-lsp |
| `$MCAST_GROUP` | Multicast group range | `227.1.1.1/32` | services/ngmvpn-vrf |
| `$PE_NEIGHBOR` | Remote PE loopback (L2CKT neighbor) | `192.168.0.14` | services/l2ckt-pseudowire |
| `$PE_NEIGHBOR_1`..`4` | PE client neighbors (on RR) | `2.2.2.2` | transport/bgp-ibgp-rr |
| `$PE_PEER_AS` | PE autonomous system (iBGP within VRF) | `64512` | services/ngmvpn-vrf |
| `$RD` | Route-distinguisher | `10.10.0.12:3002` | services/* |
| `$ROUTER_ID` | Per-VRF router-id | `10.10.0.12` | services/l3vpn-vrf-vrrp |
| `$RP_ADDRESS` | PIM Rendezvous Point address | `192.168.0.17`, `1.1.1.8` | transport/pim-* |
| `$RR_NEIGHBOR_1` | Route Reflector neighbor (first) | `192.168.0.17` | transport/bgp-ibgp-rr-client |
| `$RR_NEIGHBOR_2` | Route Reflector neighbor (second) | `192.168.0.11` | transport/bgp-ibgp-rr-client |
| `$SITE_ID` | VPLS site-identifier (numeric) | `1001` | services/vpls-virtual-switch |
| `$SITE_NAME` | VPLS site name | `101` | services/vpls-virtual-switch |
| `$SPOKE_COMMUNITY` | Spoke community name (policy ref) | `spoke_1` | policy/hub-spoke-import-export |
| `$SPOKE_COMMUNITY_NAME` | Spoke community definition name | `spoke_1` | policy/hub-spoke-community |
| `$SPOKE_POLICY_NAME` | Spoke export policy-statement name | `spoke_1` | policy/hub-spoke-import-export |
| `$SPOKE_RT` | Spoke route-target community value | `target:65535:2` | policy/hub-spoke-community |
| `$UNIT` | Interface unit number | `3002`, `1501` | services/* |
| `$VC_ID` | L2CKT virtual-circuit-id | `1501` | services/l2ckt-pseudowire |
| `$VLAN` | VLAN ID | `1` | services/vpls-virtual-switch |
| `$VLAN_NAME` | VLAN name (EVO vlans syntax) | `VPLS1` | services/vpls-virtual-switch (evo) |
| `$VPLS_ID` | VPLS instance identifier | `1` | services/vpls-virtual-switch |
| `$VRF_EXPORT` | VRF export policy name | `spoke_1`, `hub_1` | services/l3vpn-vrf-spoke, ngmvpn-spoke-adv |
| `$VRF_IMPORT` | VRF import policy name | `hub_1`, `spoke_1` | services/l3vpn-vrf-spoke, ngmvpn-hub-adv |
| `$VRF_NAME` | Routing-instance name | `l3vpn_vrrp_3001_3002` | services/* |
| `$VRF_TARGET` | VRF target community value | `64510:3002` | services/* |

## byoai/TIERS.md

# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each service kind at each verbosity tier. It is bundled into [`jvd-ewan-core-edge-snips.md`](jvd-ewan-core-edge-snips.md) by `regenerate-bundle.sh`.

For each service kind, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. Use the OS-appropriate file under `junos/` or `evo/`.

---

## What the tiers mean

| Tier | Use when | What's included |
|---|---|---|
| **`minimum`** | Brownfield change. PE already has working OSPF/LDP underlay AND iBGP. You just want the new service. | Service routing-instance + AC interface + parent LAG. **Nothing else.** |
| **`with-overlay`** | Brownfield-ish. PE has working underlay but you want to (re)assert the iBGP overlay families. | `minimum` + `transport/bgp-ibgp-rr-client.conf`. |
| **`as-deployed`** | Greenfield turn-up, lab build, or "give me a working example end-to-end." Mirrors what the JVD validates. | Everything: service + AC + overlay + OSPF/LDP underlay + MPLS LSPs + PIM + hash + bootstrap + CoS + policy. |

> **Greenfield / bootstrap requests** (e.g. "build a new ACX7509 WAN-edge turn-up", "bootstrap a new MX304 PE end-to-end") are always treated as **`as-deployed`** regardless of the user's tier choice.

If the user picks `minimum` and the AI cannot tell whether the iBGP overlay is already on the PE, it should call that out in the `Notes:` section ("assumed `family inet-vpn` and `family l2vpn signaling` already active under `protocols bgp group ibgp`").

---

## Shared underlay (the `as-deployed` baseline for every service)

Every `as-deployed` service includes this common baseline. OS-select each file:

- `transport/bgp-ibgp-rr-client.conf` (Junos) / `transport/bgp-ibgp-rr.conf` (EVO P-routers) — iBGP to RR with inet-vpn/l2vpn/route-target
- `transport/ospf-lfa.conf` — OSPF area 0 + LFA (remote-backup, per-prefix, node-link-degradation)
- `transport/ldp.conf` — LDP with auto-targeted-session + P2MP
- `transport/mpls-lsp.conf` (Junos WAN Edges) / `transport/mpls-transit.conf` (EVO P-routers) — MPLS LSPs / transit
- `transport/pim-sparse.conf` (Junos WAN Edges) / `transport/pim-sparse-rp.conf` (EVO P-routers) — PIM for NGMVPN
- `interfaces/ae-lag-core.conf` — core uplink LAG (family inet + mpls)
- `bootstrap/chassis.conf` — aggregated-devices count; **EVO also sets `network-services enhanced-ip` (REQUIRED for MPLS/VPN)**
- `bootstrap/forwarding-options-hash.conf` — ECMP/LAG hash keys (MPLS label + multiservice)
- `cos/classifiers-forwarding-classes.conf` — 8-class DSCP + 802.1p (Junos WAN Edges only)

---

## L3VPN with VRRP (instance-type vrf, eBGP CE, vrf-target)

**minimum** (just the service)
- `services/l3vpn-vrf-vrrp.conf`
- `interfaces/ae-lag-access.conf` (parent LAG for ACs)

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-rr-client.conf` (verify `family inet-vpn` active)

**as-deployed** (= with-overlay + the shared underlay baseline above)

---

## L3VPN Hub-and-Spoke (asymmetric vrf-import/export)

**minimum** (just the service)
- `services/l3vpn-vrf-spoke.conf`
- `policy/hub-spoke-community.conf` (RT community definitions)
- `policy/hub-spoke-import-export.conf` (hub_N / spoke_N policies)
- `interfaces/ae-lag-access.conf` (parent LAG)

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-rr-client.conf`

**as-deployed** (= with-overlay + shared underlay baseline)

---

## VPLS (virtual-switch, LDP-signaled)

Pick the OS-appropriate flavor:
- **Junos MX:** `junos/services/vpls-virtual-switch.conf` (bridge-domains syntax)
- **EVO ACX:** `evo/services/vpls-virtual-switch.conf` (vlans syntax)

**minimum** (just the service)
- the flavor above
- `interfaces/ae-lag-access.conf` (parent LAG for ACs)

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-rr-client.conf` (verify `family l2vpn signaling`)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## L2CKT (pseudowire with hot-standby backup)

**minimum** (just the service)
- `services/l2ckt-pseudowire.conf`
- `interfaces/ae-lag-access.conf` (parent LAG for ACs)

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-rr-client.conf`
- `transport/ldp.conf` (targeted LDP session to remote PE)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## NGMVPN (Next-Generation Multicast VPN)

**minimum** (just the multicast VRF)
- `services/ngmvpn-vrf.conf`
- `policy/bgp-to-ospf.conf` (OSPF export for CE redistribution)

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-rr-client.conf`
- `transport/pim-sparse.conf` (global PIM for provider tunnels)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## NGMVPN Hub-and-Spoke (EVO only — hub advertise + spoke advertise VRFs)

**minimum** (just the hub/spoke VRF pair)
- `services/ngmvpn-hub-adv.conf` (hub side)
- `services/ngmvpn-spoke-adv.conf` (spoke side)
- `policy/redistribute-vpn.conf` (hub CE export)
- `policy/hub-spoke-community.conf` + `policy/hub-spoke-import-export.conf`

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-rr-client.conf`

**as-deployed** (= with-overlay + shared underlay baseline)

---

## Add-a-feature requests (no full service)

When the user asks to add a supporting feature to an existing device, emit ONLY that snip set:
- **CoS** → `cos/classifiers-forwarding-classes.conf`
- **ECMP / load-balancing** → `bootstrap/forwarding-options-hash.conf`
- **PIM / multicast** → `transport/pim-sparse.conf` (PE) or `transport/pim-sparse-rp.conf` (P/RP)
- **LFA convergence** → `transport/ospf-lfa.conf`

## byoai/DEFAULTS.md

# Auto-Fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default values the AI uses in `auto` mode (or when the user short-circuits with `all defaults` / `use defaults` / `skip`). It is bundled into [`jvd-ewan-core-edge-snips.md`](jvd-ewan-core-edge-snips.md) by `regenerate-bundle.sh`.

Use these values EXACTLY. Do not invent alternative defaults. Every value the AI auto-fills MUST be listed in the output's `Inputs used:` block so the user can rerun with edits.

---

## Device inventory (the JVD topology)

| Device | OS family | Role | Loopback (router-id) |
|--------|-----------|------|----------------------|
| `wanedge1_mx304` | Junos | WAN Edge PE | `10.10.0.12` |
| `wanedge2_mx10008` | Junos | WAN Edge PE | `192.168.0.11` |
| `wanedge3_acx7509` | EVO | WAN Edge PE | `192.168.0.14` |
| `wanedge4_acx7100-48l` | EVO | WAN Edge PE | `192.168.0.16` |
| `p1_ptx10003` | EVO | Core P / Route Reflector | `1.1.1.8` |
| `p2_ptx10001-36mr` | EVO | Core P / Route Reflector | `192.168.0.17` |
| `ce1_acx7100-48l` | EVO | L2/L3 Edge (CE) | — |
| `ce2_mx480` | Junos | L2/L3 Edge (CE) | — |

**Device-choice shortcuts** (offered in the clarifying question):
- `EVO` → `wanedge3_acx7509` + `wanedge4_acx7100-48l`
- `JUNOS` → `wanedge1_mx304` + `wanedge2_mx10008`
- `MIXED` → `wanedge1_mx304` (Junos) + `wanedge3_acx7509` (EVO)

The two P routers (`p1_ptx10003`, `p2_ptx10001-36mr`) are the iBGP route reflectors — services are NOT instantiated on them. The two CE devices are customer-premises equipment — generate PE-side config only.

---

## Transport / underlay defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$LOCAL_AS` | `64512` | single iBGP AS, all devices |
| `$RR_NEIGHBOR_1` | `192.168.0.17` | p2_ptx10001-36mr loopback |
| `$RR_NEIGHBOR_2` | `192.168.0.11` | — (wanedge2 is also a neighbor on some devices) |
| `$ROUTER_ID` / `$LOCAL_ADDRESS` | = device loopback | per device (see table) |
| `$AREA` | `0.0.0.0` | OSPF single area |
| `$CE_PEER_AS` | `64510` (site 1) / `64520` (site 2) | CE AS numbers |
| `$RP_ADDRESS` | `1.1.1.8` (on PEs: static RP) | p1_ptx10003 loopback |
| `$MTU` | — | core uplinks (use platform default) |

---

## LAG / interface defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$AE_INTF` (core) | `ae2` | core-facing LAG to P-routers |
| `$AE_INTF` (access) | `ae1` | access-facing LAG for service ACs |
| `$LACP_SYSTEM_ID` | `00:00:22:00:00:01` (wanedge1) / `00:00:44:00:00:01` (wanedge3) | per-device |
| `$AE_DEVICE_COUNT` | `25` | aggregated-devices ethernet device-count |

---

## Service instance-name conventions

Each service kind uses a distinct instance-name prefix. Increment the trailing numeric per instance.

| Service | Instance name pattern | Starting example | Unit / VLAN start |
|---------|----------------------|------------------|-------------------|
| L3VPN VRRP | `l3vpn_vrrp_3001_<n>` | `l3vpn_vrrp_3001_3002` | unit `3002` |
| L3VPN Spoke | `l3vpn_Spoke_<site>_<n>` | `l3vpn_Spoke_1_1` | unit `4001` |
| VPLS | `vpls_group_101_<n>` | `vpls_group_101_1` | unit/VLAN `1` |
| L2CKT | — (no routing-instance) | — | unit `1501` |
| NGMVPN | `vpn-mcast_<n>` | `vpn-mcast_1` | lo0 unit `1` |
| NGMVPN Hub | `Hub_Adv_To_Spokes_<n>` | `Hub_Adv_To_Spokes_1001` | unit `2001` |
| NGMVPN Spoke | `Spokes_Adv_To_Hub_<n>` | `Spokes_Adv_To_Hub_1001` | unit `1001` |

---

## Route-distinguisher / route-target defaults

| Variable | Rule | Example |
|----------|------|---------|
| `$RD` | `<device-loopback>:<unit>` | `10.10.0.12:3002` (wanedge1) |
| `$VRF_TARGET` | `<CE_AS>:<unit>` for L3VPN | `64510:3002` |
| `$VRF_TARGET` (VPLS) | `64512:<RD-suffix>` | `64512:1011` |
| Hub/Spoke RT | `target:65535:<2N-1>` (hub) / `target:65535:<2N>` (spoke) | hub_1 = `target:65535:1`, spoke_1 = `target:65535:2` |
| NGMVPN | `<RP-address>:<id>` | `10.33.33.1:1` |

**Cross-PE consistency rule:** route-targets and VPLS-IDs MUST match across all PEs in the same service instance. Per-PE identifiers (loopback, RD, site-identifier, AC interface) differ.

---

## CoS defaults

8-class model: af(2), af1(6), be(0), be1(4), ef(1), ef1(5), nc(3), nc1(7). DSCP classifier "mydscp" + 802.1p "dot1p". These are JVD-wide constants — never parameterize the class names or queue numbers.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-ewan-core-edge-snips.md`](jvd-ewan-core-edge-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum" or "with-overlay"
# devices:
#   pe1: { name: <hostname>, os: <junos|evo>, loopback4: <addr> }
#   pe2: { ... }
# services:
#   - { kind: <l3vpn-vrrp|l3vpn-spoke|vpls|l2ckt|ngmvpn|ngmvpn-hub-spoke>,
#       count: <int>,
#       start_id: <int>,
#       start_unit: <int>,
#       vrf_target: <target:...>,
#       rd: <rd> }
# snips_used:
#   - junos/services/l3vpn-vrf-vrrp.conf
#   - evo/services/vpls-virtual-switch.conf
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

- Snips intentionally omitted (and why).
- Inputs defaulted because the user did not provide them.
- Cross-PE consistency the user must verify (RTs, VPLS-IDs, site-identifiers).
- Anything that is by-pattern rather than validated on that exact device.
- For EVO devices: remind that `network-services enhanced-ip` (from `bootstrap/chassis.conf`) is a prerequisite for MPLS/VPN and requires a reboot if not already set.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
