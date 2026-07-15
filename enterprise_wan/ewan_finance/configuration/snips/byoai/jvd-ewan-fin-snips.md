# JVD EWAN Finance snippet library

## evo/bootstrap/chassis-config.conf

```
/*
 * Topic:   Chassis hardware initialization — aggregated devices and FPC/PIC port speeds
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004 ap1_mx304 ap2_mx10004
 *   EVO:   p1_ptx10003-80c p2_ptx10001-36mr l2-l3_edge_acx7100
 *
 * Highlights:
 *  - aggregated-devices ethernet device-count reserves LAG interface namespace
 *  - Per-port speed and sub-port breakout configured at PIC level
 *  - dump-on-panic enables core dumps for hardware troubleshooting
 *
 * Pair with:
 *  - evo/interfaces/physical-p2p-mpls.conf  (interfaces bound to these ports)
 *  - evo/interfaces/lag-lacp.conf           (LAG interfaces using aggregated-devices)
 *
 * Variables (example values from p1_ptx10003-80c):
 *   $DEVICE_COUNT       e.g. 25
 *   $FPC_SLOT           e.g. 0
 *   $PIC_SLOT           e.g. 0
 *   $PORT_ID            e.g. 0
 *   $PORT_SPEED         e.g. 100g
 *   $BREAKOUT_PORT_ID   e.g. 2
 *   $BREAKOUT_SPEED     e.g. 10g
 *   $BREAKOUT_SUB_PORTS e.g. 4
 */

chassis {
    dump-on-panic;
    aggregated-devices {
        ethernet {
            device-count $DEVICE_COUNT;
        }
    }
    fpc $FPC_SLOT {
        pic $PIC_SLOT {
            port $PORT_ID {
                speed $PORT_SPEED;
            }
            port $BREAKOUT_PORT_ID {
                number-of-sub-ports $BREAKOUT_SUB_PORTS;
                speed $BREAKOUT_SPEED;
            }
        }
    }
}
```

## evo/cos/exp-classifiers-schedulers.conf

```
/*
 * Topic:   MPLS EXP-based QoS — classifiers, forwarding classes, schedulers, and rewrite rules
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004 ap1_mx304 ap2_mx10004
 *   EVO:   p1_ptx10003-80c p2_ptx10001-36mr
 *
 * Highlights:
 *  - 4 forwarding classes: FC-LLQ (strict-high, queue 2) for low-latency finance traffic,
 *    FC-HIGH (queue 1), CONTROL (queue 3), BEST-EFFORT (queue 0)
 *  - EXP classifier maps 3-bit MPLS EXP values to forwarding classes
 *  - EXP rewrite rule re-marks egress frames to preserve QoS across hops
 *  - scheduler-map applied per-interface with classifier + rewrite on each unit
 *  - FC-LLQ uses strict-high priority for deterministic low-latency forwarding
 *
 * Pair with:
 *  - evo/interfaces/physical-p2p-mpls.conf  (interfaces where CoS is applied)
 *  - evo/transport/mpls-interfaces.conf     (MPLS transport carrying marked traffic)
 *
 * Variables (example values from p1_ptx10003-80c):
 *   $INTERFACE_1     e.g. et-0/0/0
 *   $INTERFACE_2     e.g. et-0/0/1
 *   $INTERFACE_3     e.g. et-0/0/3
 *   $INTERFACE_4     e.g. et-0/0/4
 */

class-of-service {
    classifiers {
        exp EXP {
            forwarding-class FC-HIGH {
                loss-priority low code-points 001;
            }
            forwarding-class BEST-EFFORT {
                loss-priority low code-points 000;
            }
            forwarding-class FC-LLQ {
                loss-priority low code-points 010;
            }
            forwarding-class CONTROL {
                loss-priority low code-points 011;
            }
        }
    }
    forwarding-classes {
        class FC-HIGH queue-num 1;
        class BEST-EFFORT queue-num 0;
        class CONTROL queue-num 3;
        class FC-LLQ queue-num 2;
    }
    interfaces {
        $INTERFACE_1 {
            scheduler-map sched-map;
            unit 0 {
                classifiers {
                    exp EXP;
                }
                rewrite-rules {
                    exp EXP_REWRITE;
                }
            }
        }
        $INTERFACE_2 {
            scheduler-map sched-map;
            unit 0 {
                classifiers {
                    exp EXP;
                }
                rewrite-rules {
                    exp EXP_REWRITE;
                }
            }
        }
    }
    rewrite-rules {
        exp EXP_REWRITE {
            forwarding-class FC-HIGH {
                loss-priority low code-point 001;
            }
            forwarding-class BEST-EFFORT {
                loss-priority low code-point 000;
            }
            forwarding-class FC-LLQ {
                loss-priority low code-point 010;
            }
            forwarding-class CONTROL {
                loss-priority low code-point 011;
            }
        }
    }
    scheduler-maps {
        sched-map {
            forwarding-class BEST-EFFORT scheduler s0;
            forwarding-class FC-HIGH scheduler s1;
            forwarding-class FC-LLQ scheduler s2;
            forwarding-class CONTROL scheduler s3;
        }
    }
    schedulers {
        s0 {
            priority low;
        }
        s1 {
            priority low;
        }
        s2 {
            priority strict-high;
        }
        s3 {
            priority low;
        }
    }
}
```

## evo/interfaces/flexible-vlan-subinterface.conf

```
/*
 * Topic:   Flexible VLAN-tagged subinterfaces with per-unit addressing
 * Seen on:
 *   Junos: cr2_mx480
 *   EVO:   cr1_acx7100-48l
 *
 * Highlights:
 *  - Body is structurally identical to the Junos sibling
 *  - flexible-vlan-tagging + flexible-ethernet-services enables mixed encapsulation per-unit
 *  - Each unit carries a distinct VLAN-ID and IPv4 /30 or /24 address for PE-CE connectivity
 *  - Used for per-virtual-router PE-CE links on CR devices
 *  - Multiple units (13+) on a single physical interface to scale VPN instances
 *
 * Pair with:
 *  - evo/services/virtual-router-instance.conf  (VR instances bind these subinterfaces)
 *  - evo/oam/twamp-client.conf                  (TWAMP probes use these as source)
 *  - evo/interfaces/vlan-bridge-domain.conf     (VLAN bridge-domains on same interface)
 *
 * Variables (example values from cr1_acx7100-48l):
 *   $INTERFACE_NAME   e.g. et-0/0/47
 *   $DESCRIPTION      e.g. CR1_AP1
 *   $UNIT_ID          e.g. 1
 *   $VLAN_ID          e.g. 1
 *   $IPV4_ADDRESS     e.g. 10.101.48.2/30
 */

interfaces {
    $INTERFACE_NAME {
        description "$DESCRIPTION";
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        unit $UNIT_ID {
            vlan-id $VLAN_ID;
            family inet {
                address $IPV4_ADDRESS;
            }
        }
    }
}
```

## evo/interfaces/lag-lacp.conf

```
/*
 * Topic:   LAG with LACP active and vlan-bridge encapsulated units
 * Seen on:
 *   Junos: (none)
 *   EVO:   l2-l3_edge_acx7100
 *
 * Highlights:
 *  - Aggregated Ethernet with LACP active for link bundling to dual-homed WAN edges
 *  - flexible-vlan-tagging + flexible-ethernet-services for multi-VLAN trunk
 *  - Per-unit vlan-bridge encapsulation ties into vlans{} bridge-domain membership
 *  - MTU 1522 accommodates VLAN tag overhead
 *
 * Pair with:
 *  - evo/interfaces/vlan-bridge-domain.conf       (VLANs referencing ae0 units)
 *  - evo/bootstrap/chassis-config.conf            (aggregated-devices device-count)
 *
 * Variables (example values from l2-l3_edge_acx7100):
 *   $AE_NAME         e.g. ae0
 *   $DESCRIPTION     e.g. L2/L3 to WANEDGE1/2
 *   $MTU             e.g. 1522
 *   $VLAN_ID         e.g. 1
 */

interfaces {
    $AE_NAME {
        description "$DESCRIPTION";
        flexible-vlan-tagging;
        mtu $MTU;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            lacp {
                active;
            }
        }
        unit $VLAN_ID {
            encapsulation vlan-bridge;
            vlan-id $VLAN_ID;
        }
    }
}
```

## evo/interfaces/loopback-multi-af.conf

```
/*
 * Topic:   Loopback interface with IPv4, ISO, and IPv6 address families
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004 ap1_mx304 ap2_mx10004 cr2_mx480
 *   EVO:   p1_ptx10003-80c p2_ptx10001-36mr cr1_acx7100-48l l2-l3_edge_acx7100
 *
 * Highlights:
 *  - Primary/preferred IPv4 used as router-id and BGP local-address
 *  - ISO address required for OSPF/IS-IS CLNS adjacency
 *  - IPv6 primary enables dual-stack management and IPv6 BGP peering
 *  - 127.0.0.x addresses used for internal loopback functions
 *
 * Pair with:
 *  - evo/transport/ibgp-core-mesh.conf  (local-address sourced from lo0)
 *  - evo/transport/ospf-te-protection.conf  (lo0 passive interface in area 0)
 *
 * Variables (example values from p1_ptx10003-80c):
 *   $ROUTER_ID_ADDRESS   e.g. 10.200.50.13/32
 *   $MGMT_LOOPBACK       e.g. 10.255.163.148/32
 *   $ISO_ADDRESS         e.g. 47.0005.80ff.f800.0000.0108.0001.0102.5516.3148.00
 *   $IPV6_ADDRESS        e.g. 2001:db8::10:255:163:148/128
 */

interfaces {
    lo0 {
        unit 0 {
            family inet {
                address $ROUTER_ID_ADDRESS {
                    primary;
                    preferred;
                }
                address 127.0.0.1/32;
                address 127.0.0.64/32;
                address $MGMT_LOOPBACK {
                    primary;
                }
            }
            family iso {
                address $ISO_ADDRESS;
            }
            family inet6 {
                address $IPV6_ADDRESS {
                    primary;
                }
            }
        }
    }
}
```

## evo/interfaces/physical-p2p-mpls.conf

```
/*
 * Topic:   Core point-to-point interfaces with inet/ISO/MPLS families
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004 ap1_mx304 ap2_mx10004
 *   EVO:   p1_ptx10003-80c p2_ptx10001-36mr
 *
 * Highlights:
 *  - Multi-protocol family (inet + ISO + MPLS) on every core-facing link
 *  - ISO enables IS-IS/CLNS routing; MPLS enables label switching
 *  - /24 point-to-point addressing convention for inter-router links
 *
 * Pair with:
 *  - evo/cos/exp-classifiers-schedulers.conf
 *  - evo/transport/ospf-te-protection.conf  (OSPF runs over these interfaces)
 *  - evo/transport/mpls-interfaces.conf     (MPLS enabled on these interfaces)
 *  - evo/transport/rsvp-signaling.conf      (RSVP signaling on these interfaces)
 *  - evo/bootstrap/chassis-config.conf      (port speed defined at chassis level)
 *
 * Variables (example values from p1_ptx10003-80c):
 *   $INTERFACE_NAME   e.g. et-0/0/0
 *   $DESCRIPTION      e.g. Link to P1Node to WANEdge1
 *   $IPV4_ADDRESS     e.g. 10.101.23.2/24
 */

interfaces {
    $INTERFACE_NAME {
        description "$DESCRIPTION";
        unit 0 {
            family inet {
                address $IPV4_ADDRESS;
            }
            family iso;
            family mpls;
        }
    }
}
```

## evo/interfaces/vlan-bridge-domain.conf

```
/*
 * Topic:   Single-tag VLAN bridge-domains with interface membership binding
 * Seen on:
 *   Junos: (none)
 *   EVO:   l2-l3_edge_acx7100
 *
 * Highlights:
 *  - Each VLAN defined with explicit vlan-id and interface membership
 *  - Interfaces bound to VLANs via their vlan-bridge encapsulated units
 *  - Dual-homed: ae0 (LAG to WAN edges) + et-0/0/47 (local access port)
 *  - Simple L2-only switching — no IRB, no routing, no STP in this config
 *
 * Pair with:
 *  - evo/interfaces/lag-lacp.conf                   (ae0 LAG carrying these VLANs)
 *  - evo/interfaces/flexible-vlan-subinterface.conf  (interface vlan-bridge units)
 *
 * Variables (example values from l2-l3_edge_acx7100):
 *   $VLAN_NAME         e.g. vlan1
 *   $VLAN_ID           e.g. 1
 *   $LAG_UNIT          e.g. ae0.1
 *   $ACCESS_UNIT       e.g. et-0/0/47.1
 */

vlans {
    $VLAN_NAME {
        vlan-id $VLAN_ID;
        interface $LAG_UNIT;
        interface $ACCESS_UNIT;
    }
}
```

## evo/oam/lldp-discovery.conf

```
/*
 * Topic:   LLDP protocol enabled on all interfaces for neighbor discovery
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004 ap1_mx304 ap2_mx10004 cr2_mx480
 *   EVO:   p1_ptx10003-80c p2_ptx10001-36mr cr1_acx7100-48l l2-l3_edge_acx7100
 *
 * Highlights:
 *  - "interface all" enables LLDP on every physical port
 *  - Essential for topology discovery and cable verification
 *  - No per-interface filtering or hold-time tuning in this JVD
 *
 * Variables (example values from p1_ptx10003-80c):
 *   (no variables — static config)
 */

protocols {
    lldp {
        interface all;
    }
}
```

## evo/oam/twamp-client.conf

```
/*
 * Topic:   TWAMP client with per-virtual-router control connections and test sessions
 * Seen on:
 *   Junos: cr2_mx480
 *   EVO:   cr1_acx7100-48l
 *
 * Highlights:
 *  - Body is structurally identical to the Junos sibling
 *  - TWAMP client (RFC 5357) probes AP reflectors for per-VRF latency/jitter measurement
 *  - One control-connection per VR targeting each AP server (dual-homed: AP1 + AP2)
 *  - routing-instance scoping ensures probes originate from the correct VRF
 *  - probe-count 100 at probe-interval 1s for continuous 100-second measurement cycles
 *  - test-count 0 means infinite test iterations (continuous monitoring)
 *
 * Pair with:
 *  - evo/services/virtual-router-instance.conf      (VR instances where probes originate)
 *  - evo/interfaces/flexible-vlan-subinterface.conf (PE-CE links carrying probes)
 *
 * Variables (example values from cr1_acx7100-48l):
 *   $CONNECTION_NAME     e.g. CR14_1
 *   $DEST_PORT           e.g. 862
 *   $ROUTING_INSTANCE    e.g. VIRTUAL-ROUTER-V1
 *   $TARGET_ADDRESS      e.g. 10.101.48.1
 *   $TEST_SESSION_NAME   e.g. T14_1
 *   $PROBE_COUNT         e.g. 100
 *   $PROBE_INTERVAL      e.g. 1
 */

services {
    rpm {
        twamp {
            client {
                control-connection $CONNECTION_NAME {
                    control-type managed;
                    destination-port $DEST_PORT;
                    routing-instance $ROUTING_INSTANCE;
                    target-address $TARGET_ADDRESS;
                    test-count 0;
                    test-session $TEST_SESSION_NAME {
                        target-address $TARGET_ADDRESS;
                        probe-count $PROBE_COUNT;
                        probe-interval $PROBE_INTERVAL;
                    }
                }
            }
        }
    }
}
```

## evo/policy/protocol-redistribution.conf

```
/*
 * Topic:   Routing policy statements for BGP/OSPF/direct protocol redistribution
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004 ap1_mx304 ap2_mx10004
 *   EVO:   p1_ptx10003-80c p2_ptx10001-36mr
 *
 * Highlights:
 *  - PS-ADV_DIRECT: redistributes directly-connected routes into BGP
 *  - PS-BGP-TO-OSPF: leaks BGP-learned routes into OSPF (for CE reachability)
 *  - PS-send-ospf: exports OSPF routes into BGP for VPN distribution
 *  - Simple accept-all policies — no route-filtering or manipulation
 *
 * Pair with:
 *  - evo/policy/route-filter-med.conf
 *  - evo/transport/ibgp-core-mesh.conf  (export policies referenced in BGP group)
 *
 * Variables (example values from p1_ptx10003-80c):
 *   $DIRECT_POLICY_NAME   e.g. PS-ADV_DIRECT
 *   $BGP_TO_OSPF_NAME     e.g. PS-BGP-TO-OSPF
 *   $OSPF_TO_BGP_NAME     e.g. PS-send-ospf
 */

policy-options {
    policy-statement $DIRECT_POLICY_NAME {
        from protocol direct;
        then accept;
    }
    policy-statement $BGP_TO_OSPF_NAME {
        from protocol bgp;
        then accept;
    }
    policy-statement $OSPF_TO_BGP_NAME {
        from protocol ospf;
        then accept;
    }
}
```

## evo/policy/route-filter-med.conf

```
/*
 * Topic:   Route-filter-based MED metric assignment for BGP export
 * Seen on:
 *   Junos: cr2_mx480
 *   EVO:   cr1_acx7100-48l
 *
 * Highlights:
 *  - Body is structurally identical to the Junos sibling
 *  - PS-med-10: assigns MED 10 to specific infrastructure prefix (preferred path)
 *  - PS-med-30: assigns MED 30 to all other prefixes (less-preferred backup)
 *  - Used as export policy in virtual-router BGP groups to influence AP path selection
 *
 * Pair with:
 *  - evo/services/virtual-router-instance.conf  (BGP group references these as export)
 *  - evo/policy/protocol-redistribution.conf    (other policies in same policy-options)
 *
 * Variables (example values from cr1_acx7100-48l):
 *   $MED_LOW_NAME       e.g. PS-med-10
 *   $MED_LOW_PREFIX     e.g. 10.101.0.0/16
 *   $MED_LOW_VALUE      e.g. 10
 *   $MED_HIGH_NAME      e.g. PS-med-30
 *   $MED_HIGH_VALUE     e.g. 30
 */

policy-options {
    policy-statement $MED_LOW_NAME {
        from {
            route-filter $MED_LOW_PREFIX exact;
        }
        then {
            metric $MED_LOW_VALUE;
            accept;
        }
    }
    policy-statement $MED_HIGH_NAME {
        from {
            route-filter 0.0.0.0/0 longer;
        }
        then {
            metric $MED_HIGH_VALUE;
            accept;
        }
    }
}
```

## evo/services/virtual-router-instance.conf

```
/*
 * Topic:   Virtual-router instance with BGP, PIM sparse-mode, and multicast RP
 * Seen on:
 *   Junos: cr2_mx480
 *   EVO:   cr1_acx7100-48l
 *
 * Highlights:
 *  - Body is structurally identical to the Junos sibling
 *  - instance-type virtual-router: full routing table isolation without MPLS VPN signaling
 *  - eBGP group "AP" peers to both AP nodes with MED export policy for path preference
 *  - iBGP group "IXIA" for traffic-generator peering within the VR
 *  - PIM sparse-mode with static RP pointing to AP node's loopback (multicast receiver side)
 *  - Each VR gets unique multicast group-ranges matching the MVPN sender's PIM RP config
 *
 * Pair with:
 *  - evo/interfaces/flexible-vlan-subinterface.conf (PE-CE interfaces bound to VR)
 *  - evo/oam/twamp-client.conf                     (TWAMP probes originate per-VR)
 *  - evo/policy/route-filter-med.conf              (MED export policies referenced)
 *
 * JVD service mapping:
 *   13 instances total (high 10 / med 0 / low 3)
 *   On devices: cr1_acx7100-48l (13), cr2_mx480 (13)
 *   Example: VIRTUAL-ROUTER-V1 (RD —, RT —)
 *     cr1_acx7100-48l  et-0/0/42.1
 *     cr2_mx480  xe-3/0/6.1
 *
 * Variables (example values from cr1_acx7100-48l):
 *   $VR_NAME             e.g. VIRTUAL-ROUTER-V1
 *   $AP_PEER_AS          e.g. 64512
 *   $AP_NEIGHBOR_1       e.g. 10.101.48.1
 *   $AP_NEIGHBOR_2       e.g. 10.101.78.1
 *   $EXPORT_POLICIES     e.g. [ med-10 med-30 ]
 *   $IXIA_PEER_AS        e.g. 64520
 *   $IXIA_NEIGHBOR       e.g. 10.101.81.2
 *   $RP_ADDRESS          e.g. 10.10.47.101
 *   $MCAST_GROUP_RANGE   e.g. 225.0.0.0/22
 *   $IFACE_AP1           e.g. et-0/0/42.1
 *   $IFACE_AP2           e.g. et-0/0/48.1
 *   $IFACE_TG            e.g. et-0/0/49.1
 */

routing-instances {
    $VR_NAME {
        instance-type virtual-router;
        protocols {
            bgp {
                group AP {
                    type external;
                    export $EXPORT_POLICIES;
                    peer-as $AP_PEER_AS;
                    neighbor $AP_NEIGHBOR_1;
                    neighbor $AP_NEIGHBOR_2;
                }
                group IXIA {
                    type internal;
                    peer-as $IXIA_PEER_AS;
                    neighbor $IXIA_NEIGHBOR;
                }
            }
            pim {
                rp {
                    static {
                        address $RP_ADDRESS {
                            group-ranges {
                                $MCAST_GROUP_RANGE;
                            }
                        }
                    }
                }
                interface $IFACE_AP1 {
                    mode sparse;
                }
                interface $IFACE_AP2 {
                    mode sparse;
                }
                interface $IFACE_TG {
                    mode sparse;
                }
            }
        }
        interface $IFACE_TG;
        interface $IFACE_AP1;
        interface $IFACE_AP2;
    }
}
```

## evo/transport/ibgp-core-mesh.conf

```
/*
 * Topic:   iBGP full-mesh with inet-vpn, EVPN, and inet-mvpn address families
 * Seen on:
 *   Junos: (none)
 *   EVO:   p1_ptx10003-80c p2_ptx10001-36mr
 *
 * Highlights:
 *  - family inet-vpn unicast + any for L3VPN route exchange
 *  - family evpn signaling for EVPN Type-1 through Type-5
 *  - family inet-mvpn signaling for NG-MVPN (multicast VPN) control plane
 *  - family route-target enables RT-constrain to limit VPN route distribution
 *  - BFD at 100ms × 3 for sub-second peer failure detection
 *  - All peers in a single iBGP group (full mesh, no route-reflectors)
 *
 * Pair with:
 *  - evo/interfaces/loopback-multi-af.conf
 *  - evo/transport/ospf-te-protection.conf   (IGP underlay for iBGP next-hops)
 *  - evo/transport/mpls-interfaces.conf      (label transport for VPN families)
 *  - evo/policy/protocol-redistribution.conf (export policies referenced in group)
 *
 * Variables (example values from p1_ptx10003-80c):
 *   $LOCAL_ADDRESS   e.g. 10.200.50.13
 *   $LOCAL_AS        e.g. 64512
 *   $EXPORT_POLICY   e.g. [ PS-send-ospf PS-BGP-TO-OSPF ]
 *   $NEIGHBOR_1      e.g. 10.200.50.15
 *   $NEIGHBOR_2      e.g. 10.200.50.14
 *   $NEIGHBOR_3      e.g. 10.200.50.12
 *   $NEIGHBOR_4      e.g. 10.200.50.11
 *   $NEIGHBOR_5      e.g. 10.200.50.16
 */

protocols {
    bgp {
        group IBGP {
            type internal;
            local-address $LOCAL_ADDRESS;
            family inet {
                unicast;
            }
            family inet-vpn {
                unicast;
                any;
            }
            family evpn {
                signaling;
            }
            family inet-mvpn {
                signaling;
            }
            family route-target;
            export $EXPORT_POLICY;
            local-as $LOCAL_AS;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor $NEIGHBOR_1;
            neighbor $NEIGHBOR_2;
            neighbor $NEIGHBOR_3;
            neighbor $NEIGHBOR_4;
            neighbor $NEIGHBOR_5;
        }
    }
}
```

## evo/transport/mpls-interfaces.conf

```
/*
 * Topic:   MPLS protocol enablement on core and loopback interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO:   p1_ptx10003-80c p2_ptx10001-36mr
 *
 * Highlights:
 *  - MPLS enabled on every core-facing interface for label switching
 *  - lo0.0 included to support targeted LDP sessions and LSP origination
 *  - Combined with RSVP-TE for traffic-engineered label-switched paths
 *
 * Pair with:
 *  - evo/cos/exp-classifiers-schedulers.conf
 *  - evo/transport/ospf-te-protection.conf
 *  - evo/transport/rsvp-signaling.conf       (RSVP signals LSPs over these interfaces)
 *  - evo/transport/ibgp-core-mesh.conf       (BGP VPN families ride over MPLS)
 *  - evo/interfaces/physical-p2p-mpls.conf   (family mpls configured on interfaces)
 *
 * Variables (example values from p1_ptx10003-80c):
 *   $CORE_IFACE_1   e.g. et-0/0/0.0
 *   $CORE_IFACE_2   e.g. et-0/0/3.0
 *   $CORE_IFACE_3   e.g. et-0/0/1.0
 *   $CORE_IFACE_4   e.g. et-0/0/4.0
 */

protocols {
    mpls {
        interface $CORE_IFACE_1;
        interface $CORE_IFACE_2;
        interface $CORE_IFACE_3;
        interface $CORE_IFACE_4;
        interface lo0.0;
    }
}
```

## evo/transport/ospf-te-protection.conf

```
/*
 * Topic:   OSPF with traffic engineering, node-link-protection, and BFD
 * Seen on:
 *   Junos: (none)
 *   EVO:   p1_ptx10003-80c p2_ptx10001-36mr
 *
 * Highlights:
 *  - traffic-engineering enables OSPF-TE extensions (RFC 3630) for RSVP-TE CSPF
 *  - node-link-protection provides LFA backup for sub-50ms failover
 *  - BFD at 10ms × 3 for ultra-fast adjacency failure detection (finance/low-latency)
 *  - lo0.0 as passive ensures router-id reachability without forming adjacency
 *  - All interfaces in area 0.0.0.0 (single-area backbone)
 *
 * Pair with:
 *  - evo/interfaces/loopback-multi-af.conf
 *  - evo/transport/ibgp-core-mesh.conf
 *  - evo/transport/rsvp-signaling.conf       (RSVP uses OSPF-TE database for CSPF)
 *  - evo/transport/mpls-interfaces.conf      (MPLS co-exists on same interfaces)
 *  - evo/interfaces/physical-p2p-mpls.conf   (the physical interfaces referenced)
 *
 * Variables (example values from p1_ptx10003-80c):
 *   $CORE_IFACE_1   e.g. et-0/0/0.0
 *   $CORE_IFACE_2   e.g. et-0/0/3.0
 *   $CORE_IFACE_3   e.g. et-0/0/1.0
 *   $CORE_IFACE_4   e.g. et-0/0/4.0
 *   $BFD_INTERVAL   e.g. 10
 *   $BFD_MULTIPLIER e.g. 3
 */

protocols {
    ospf {
        traffic-engineering;
        area 0.0.0.0 {
            interface $CORE_IFACE_1 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval $BFD_INTERVAL;
                    multiplier $BFD_MULTIPLIER;
                }
            }
            interface $CORE_IFACE_2 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval $BFD_INTERVAL;
                    multiplier $BFD_MULTIPLIER;
                }
            }
            interface $CORE_IFACE_3 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval $BFD_INTERVAL;
                    multiplier $BFD_MULTIPLIER;
                }
            }
            interface $CORE_IFACE_4 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval $BFD_INTERVAL;
                    multiplier $BFD_MULTIPLIER;
                }
            }
            interface lo0.0 {
                passive;
            }
        }
    }
}
```

## evo/transport/rsvp-signaling.conf

```
/*
 * Topic:   RSVP-TE interface enablement for label-switched path signaling
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004 ap1_mx304 ap2_mx10004
 *   EVO:   p1_ptx10003-80c p2_ptx10001-36mr
 *
 * Highlights:
 *  - RSVP enabled on all core transport interfaces and loopback
 *  - Provides RSVP-TE signaling for traffic-engineered LSPs
 *  - Works with OSPF-TE CSPF to compute constrained shortest paths
 *  - lo0.0 included for targeted RSVP sessions (graceful restart, etc.)
 *
 * Pair with:
 *  - evo/transport/mpls-interfaces.conf      (MPLS forwarding on same interfaces)
 *  - evo/transport/ospf-te-protection.conf   (OSPF-TE provides path computation)
 *  - evo/interfaces/physical-p2p-mpls.conf   (physical interfaces referenced)
 *
 * Variables (example values from p1_ptx10003-80c):
 *   $CORE_IFACE_1   e.g. et-0/0/0.0
 *   $CORE_IFACE_2   e.g. et-0/0/3.0
 *   $CORE_IFACE_3   e.g. et-0/0/1.0
 *   $CORE_IFACE_4   e.g. et-0/0/4.0
 */

protocols {
    rsvp {
        interface lo0.0;
        interface $CORE_IFACE_1;
        interface $CORE_IFACE_2;
        interface $CORE_IFACE_3;
        interface $CORE_IFACE_4;
    }
}
```

## junos/bootstrap/chassis-config.conf

```
/*
 * Topic:   Chassis hardware initialization — aggregated devices, FPC/PIC port speeds, tunnel-services
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004 ap1_mx304 ap2_mx10004
 *   EVO:   p1_ptx10003-80c p2_ptx10001-36mr l2-l3_edge_acx7100
 *
 * Highlights:
 *  - aggregated-devices ethernet device-count reserves LAG interface namespace
 *  - tunnel-services bandwidth enables GRE/IP-IP tunnel encapsulation for MVPN
 *  - Per-port speed and sub-port breakout at PIC level
 *  - network-services enhanced-ip required for inet-mvpn and multicast forwarding
 *
 * Pair with:
 *  - junos/interfaces/physical-p2p-mpls.conf  (interfaces bound to these ports)
 *  - junos/interfaces/lag-esi-lacp.conf       (LAG interfaces using aggregated-devices)
 *  - junos/services/mvpn-instance.conf        (MVPN uses tunnel-services)
 *
 * Variables (example values from wanedge1_mx304):
 *   $DEVICE_COUNT       e.g. 25
 *   $FPC_SLOT           e.g. 0
 *   $PIC_SLOT           e.g. 0
 *   $TUNNEL_BW          e.g. 10g
 *   $PORT_ID            e.g. 0
 *   $PORT_SPEED         e.g. 100g
 *   $BREAKOUT_PORT_ID   e.g. 9
 *   $BREAKOUT_SPEED     e.g. 10g
 *   $BREAKOUT_SUB_PORTS e.g. 4
 */

chassis {
    dump-on-panic;
    aggregated-devices {
        ethernet {
            device-count $DEVICE_COUNT;
        }
    }
    fpc $FPC_SLOT {
        pic $PIC_SLOT {
            tunnel-services {
                bandwidth $TUNNEL_BW;
            }
            port $PORT_ID {
                speed $PORT_SPEED;
            }
            port $BREAKOUT_PORT_ID {
                number-of-sub-ports $BREAKOUT_SUB_PORTS;
                speed $BREAKOUT_SPEED;
            }
        }
    }
    network-services enhanced-ip;
}
```

## junos/cos/exp-classifiers-schedulers.conf

```
/*
 * Topic:   MPLS EXP-based QoS — classifiers, forwarding classes, schedulers, and rewrite rules
 * Seen on:
 *   Junos: ap1_mx304 wanedge1_mx304 wanedge2_mx10004
 *   EVO:   (none)
 *
 * Highlights:
 *  - 4 forwarding classes: FC-LLQ (strict-high, queue 2) for low-latency finance traffic,
 *    FC-HIGH (queue 1), CONTROL (queue 3), BEST-EFFORT (queue 0)
 *  - EXP classifier maps 3-bit MPLS EXP values to forwarding classes
 *  - EXP rewrite rule re-marks egress frames to preserve QoS across hops
 *  - scheduler-map applied per-interface with classifier + rewrite on each unit
 *  - FC-LLQ uses strict-high priority for deterministic low-latency forwarding
 *
 * Pair with:
 *  - junos/firewall/multicast-fwd-cache-filter.conf
 *  - junos/interfaces/physical-p2p-mpls.conf  (interfaces where CoS is applied)
 *  - junos/transport/mpls-lsp-p2mp.conf       (MPLS transport carrying marked traffic)
 *
 * Variables (example values from wanedge1_mx304):
 *   $INTERFACE_1     e.g. et-0/0/1
 *   $INTERFACE_2     e.g. et-0/0/3
 */

class-of-service {
    classifiers {
        exp EXP {
            forwarding-class FC-HIGH {
                loss-priority low code-points 001;
            }
            forwarding-class BEST-EFFORT {
                loss-priority low code-points 000;
            }
            forwarding-class FC-LLQ {
                loss-priority low code-points 010;
            }
            forwarding-class CONTROL {
                loss-priority low code-points 011;
            }
        }
    }
    forwarding-classes {
        class FC-HIGH queue-num 1;
        class BEST-EFFORT queue-num 0;
        class CONTROL queue-num 3;
        class FC-LLQ queue-num 2;
    }
    interfaces {
        $INTERFACE_1 {
            scheduler-map sched-map;
            unit 0 {
                classifiers {
                    exp EXP;
                }
                rewrite-rules {
                    exp EXP_REWRITE;
                }
            }
        }
        $INTERFACE_2 {
            scheduler-map sched-map;
            unit 0 {
                classifiers {
                    exp EXP;
                }
                rewrite-rules {
                    exp EXP_REWRITE;
                }
            }
        }
    }
    rewrite-rules {
        exp EXP_REWRITE {
            forwarding-class FC-HIGH {
                loss-priority low code-point 001;
            }
            forwarding-class BEST-EFFORT {
                loss-priority low code-point 000;
            }
            forwarding-class FC-LLQ {
                loss-priority low code-point 010;
            }
            forwarding-class CONTROL {
                loss-priority low code-point 011;
            }
        }
    }
    scheduler-maps {
        sched-map {
            forwarding-class BEST-EFFORT scheduler s0;
            forwarding-class FC-HIGH scheduler s1;
            forwarding-class FC-LLQ scheduler s2;
            forwarding-class CONTROL scheduler s3;
        }
    }
    schedulers {
        s0 {
            priority low;
        }
        s1 {
            priority low;
        }
        s2 {
            priority strict-high;
        }
        s3 {
            priority low;
        }
    }
}
```

## junos/firewall/multicast-fwd-cache-filter.conf

```
/*
 * Topic:   Multicast forwarding-cache filters with destination-based CoS marking
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   (none)
 *
 * Highlights:
 *  - interface-specific allows per-IRB filter counters and statistics
 *  - mfc-filter: classifies 225.0.0.0/16 multicast to FC-LLQ (strict-high) for stock exchange
 *  - mfc-filter1/2/3: classify unicast VRF traffic into FC-HIGH / BEST-EFFORT / CONTROL
 *  - Applied as input filter on IRB interfaces to mark at L3 ingress before MPLS encap
 *  - Ensures multicast stock-exchange data gets low-latency queue treatment end-to-end
 *
 * Pair with:
 *  - junos/multicast/forwarding-multicast-tuning.conf
 *  - junos/services/mvpn-instance.conf
 *  - junos/services/vrf-l3vpn.conf
 *  - junos/interfaces/irb-l3-gateway.conf      (filter applied on IRB input)
 *  - junos/cos/exp-classifiers-schedulers.conf  (forwarding classes referenced here)
 *
 * Variables (example values from wanedge1_mx304):
 *   $FILTER_NAME           e.g. mfc-filter
 *   $MCAST_DEST_PREFIX     e.g. 225.0.0.0/16
 *   $FORWARDING_CLASS      e.g. FC-LLQ
 *   $UNICAST_DEST_1        e.g. 10.8.21.2/32
 *   $UNICAST_DEST_2        e.g. 10.9.21.2/32
 *   $UNICAST_FWD_CLASS     e.g. FC-HIGH
 */

firewall {
    family inet {
        filter $FILTER_NAME {
            interface-specific;
            term stock_exch {
                from {
                    destination-address {
                        $MCAST_DEST_PREFIX;
                    }
                }
                then {
                    count c1;
                    loss-priority low;
                    forwarding-class $FORWARDING_CLASS;
                }
            }
            term accept-all-else {
                then accept;
            }
        }
    }
}
```

## junos/interfaces/flexible-vlan-subinterface.conf

```
/*
 * Topic:   Flexible VLAN-tagged subinterfaces with per-unit addressing
 * Seen on:
 *   Junos: cr2_mx480
 *   EVO:   cr1_acx7100-48l
 *
 * Highlights:
 *  - flexible-vlan-tagging + flexible-ethernet-services enables mixed encapsulation per-unit
 *  - Each unit carries a distinct VLAN-ID and IPv4 /30 or /24 address for PE-CE connectivity
 *  - Used for per-VRF / per-virtual-router PE-CE links on CR devices
 *  - Multiple units (13+) on a single physical interface to scale VPN instances
 *
 * Pair with:
 *  - junos/services/virtual-router-instance.conf  (VR instances bind these subinterfaces)
 *  - junos/oam/twamp-client.conf                  (TWAMP probes use these as source)
 *
 * Variables (example values from cr2_mx480):
 *   $INTERFACE_NAME   e.g. et-5/0/0
 *   $DESCRIPTION      e.g. CR2_AP1
 *   $UNIT_ID          e.g. 1
 *   $VLAN_ID          e.g. 1
 *   $IPV4_ADDRESS     e.g. 10.101.49.2/30
 */

interfaces {
    $INTERFACE_NAME {
        description "$DESCRIPTION";
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        unit $UNIT_ID {
            vlan-id $VLAN_ID;
            family inet {
                address $IPV4_ADDRESS;
            }
        }
    }
}
```

## junos/interfaces/irb-l3-gateway.conf

```
/*
 * Topic:   IRB L3 gateway with multicast forwarding-cache filter and static MAC
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   (none)
 *
 * Highlights:
 *  - IRB provides L3 gateway for EVPN bridge-domains (routed multicast ingress)
 *  - Input filter (mfc-filter) classifies multicast traffic into QoS forwarding classes
 *  - Static MAC per unit ensures deterministic gateway MAC across EVPN active/standby
 *  - One IRB unit per MVPN instance / EVPN bridge-domain
 *
 * Pair with:
 *  - junos/interfaces/lag-esi-lacp.conf
 *  - junos/services/vrf-l3vpn.conf
 *  - junos/services/evpn-virtual-switch-esi.conf  (bridge-domain routing-interface irb.N)
 *  - junos/services/mvpn-instance.conf            (MVPN instance binds interface irb.N)
 *  - junos/firewall/multicast-fwd-cache-filter.conf (mfc-filter applied here)
 *
 * Variables (example values from wanedge1_mx304):
 *   $UNIT_ID        e.g. 1
 *   $FILTER_NAME    e.g. mfc-filter
 *   $IPV4_ADDRESS   e.g. 172.16.1.1/24
 *   $STATIC_MAC     e.g. 00:10:94:00:00:01
 */

interfaces {
    irb {
        unit $UNIT_ID {
            family inet {
                filter {
                    input $FILTER_NAME;
                }
                address $IPV4_ADDRESS;
            }
            mac $STATIC_MAC;
        }
    }
}
```

## junos/interfaces/lag-esi-lacp.conf

```
/*
 * Topic:   ESI-based LAG with LACP, single-active DF election, and vlan-bridge units
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   (none)
 *
 * Highlights:
 *  - Interface-level ESI with single-active redundancy for EVPN multihoming
 *  - df-election-granularity per-esi with lacp-oos-on-ndf takes non-DF link out-of-service
 *  - Per-unit ESI allows per-VLAN designated-forwarder assignment
 *  - LACP system-priority + system-id must match across ESI peers (wanedge1 + wanedge2)
 *  - vlan-bridge encapsulation on each unit ties into EVPN virtual-switch instances
 *
 * Pair with:
 *  - junos/services/evpn-virtual-switch-esi.conf  (EVPN instances reference ae0 units)
 *  - junos/interfaces/irb-l3-gateway.conf         (IRB interfaces for L3 gateway)
 *  - junos/bootstrap/chassis-config.conf          (aggregated-devices device-count)
 *
 * Variables (example values from wanedge1_mx304):
 *   $AE_NAME             e.g. ae0
 *   $DESCRIPTION         e.g. Link to WANEdge1 to L2/L3Edge AE
 *   $MTU                 e.g. 1522
 *   $ESI_ID              e.g. 00:11:11:11:11:11:12:12:12:12
 *   $DF_PREFERENCE       e.g. 150
 *   $LACP_PRIORITY       e.g. 100
 *   $LACP_SYSTEM_ID      e.g. 00:00:00:00:00:10
 *   $VLAN_ID             e.g. 1
 *   $UNIT_ESI            e.g. 00:01:71:81:11:12:a1:00:00:01
 *   $UNIT_DF_PREFERENCE  e.g. 150
 */

interfaces {
    $AE_NAME {
        description "$DESCRIPTION";
        flexible-vlan-tagging;
        mtu $MTU;
        encapsulation flexible-ethernet-services;
        esi {
            $ESI_ID;
            single-active;
            df-election-granularity {
                per-esi {
                    lacp-oos-on-ndf;
                }
            }
            df-election-type {
                preference {
                    value $DF_PREFERENCE;
                }
            }
        }
        aggregated-ether-options {
            lacp {
                active;
                system-priority $LACP_PRIORITY;
                system-id $LACP_SYSTEM_ID;
            }
        }
        unit $VLAN_ID {
            encapsulation vlan-bridge;
            vlan-id $VLAN_ID;
            esi {
                $UNIT_ESI;
                single-active;
                df-election-type {
                    preference {
                        value $UNIT_DF_PREFERENCE;
                    }
                }
            }
        }
    }
}
```

## junos/interfaces/loopback-multi-af.conf

```
/*
 * Topic:   Loopback interface with IPv4, ISO, and IPv6 address families
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004 ap1_mx304 ap2_mx10004 cr2_mx480
 *   EVO:   p1_ptx10003-80c p2_ptx10001-36mr cr1_acx7100-48l l2-l3_edge_acx7100
 *
 * Highlights:
 *  - Primary/preferred IPv4 used as router-id and BGP local-address
 *  - ISO address required for OSPF/IS-IS CLNS adjacency
 *  - IPv6 primary enables dual-stack management and IPv6 BGP peering
 *  - 127.0.0.x addresses used for internal loopback functions
 *
 * Pair with:
 *  - junos/transport/ibgp-core-mesh.conf       (local-address sourced from lo0)
 *  - junos/transport/ospf-te-protection.conf   (lo0 passive interface in area 0)
 *
 * Variables (example values from ap1_mx304):
 *   $ROUTER_ID_ADDRESS   e.g. 10.200.50.13/32
 *   $MGMT_LOOPBACK       e.g. 10.255.163.148/32
 *   $ISO_ADDRESS         e.g. 47.0005.80ff.f800.0000.0108.0001.0102.5516.3148.00
 *   $IPV6_ADDRESS        e.g. 2001:db8::10:255:163:148/128
 */

interfaces {
    lo0 {
        unit 0 {
            family inet {
                address $ROUTER_ID_ADDRESS {
                    primary;
                    preferred;
                }
                address 127.0.0.1/32;
                address 127.0.0.64/32;
                address $MGMT_LOOPBACK {
                    primary;
                }
            }
            family iso {
                address $ISO_ADDRESS;
            }
            family inet6 {
                address $IPV6_ADDRESS {
                    primary;
                }
            }
        }
    }
}
```

## junos/interfaces/physical-p2p-mpls.conf

```
/*
 * Topic:   Core point-to-point interfaces with inet/ISO/MPLS families
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004 ap1_mx304 ap2_mx10004
 *   EVO:   p1_ptx10003-80c p2_ptx10001-36mr
 *
 * Highlights:
 *  - Multi-protocol family (inet + ISO + MPLS) on every core-facing link
 *  - ISO enables IS-IS/CLNS routing; MPLS enables label switching
 *  - /24 point-to-point addressing convention for inter-router links
 *
 * Pair with:
 *  - junos/cos/exp-classifiers-schedulers.conf
 *  - junos/transport/ospf-te-protection.conf  (OSPF runs over these interfaces)
 *  - junos/transport/mpls-lsp-p2mp.conf       (MPLS LSPs traverse these interfaces)
 *  - junos/transport/rsvp-signaling.conf      (RSVP signaling on these interfaces)
 *  - junos/bootstrap/chassis-config.conf      (port speed defined at chassis level)
 *
 * Variables (example values from wanedge1_mx304):
 *   $INTERFACE_NAME   e.g. et-0/0/1
 *   $DESCRIPTION      e.g. Link to WANEdge1 to WANEdge2
 *   $IPV4_ADDRESS     e.g. 10.101.25.1/24
 */

interfaces {
    $INTERFACE_NAME {
        description "$DESCRIPTION";
        unit 0 {
            family inet {
                address $IPV4_ADDRESS;
            }
            family iso;
            family mpls;
        }
    }
}
```

## junos/multicast/forwarding-multicast-tuning.conf

```
/*
 * Topic:   Multicast forwarding-options tuning — resolve-rate and mismatch-rate
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004 ap1_mx304 ap2_mx10004
 *   EVO:   (none)
 *
 * Highlights:
 *  - resolve-rate 1000 pps: max rate for resolving new multicast (S,G) entries in the PFE
 *  - mismatch-rate 1000 pps: max rate for handling RPF mismatch packets to RE
 *  - Critical for finance/stock-exchange multicast to prevent PFE drops during burst joins
 *  - Default values (~100 pps) are insufficient for high-frequency multicast environments
 *
 * Pair with:
 *  - junos/services/mvpn-instance.conf              (MVPN drives multicast state creation)
 *  - junos/firewall/multicast-fwd-cache-filter.conf (CoS marking for multicast traffic)
 *
 * Variables (example values from wanedge1_mx304):
 *   $RESOLVE_RATE    e.g. 1000
 *   $MISMATCH_RATE   e.g. 1000
 */

forwarding-options {
    multicast {
        resolve-rate $RESOLVE_RATE;
        mismatch-rate $MISMATCH_RATE;
    }
}
```

## junos/oam/lldp-discovery.conf

```
/*
 * Topic:   LLDP protocol enabled on all interfaces for neighbor discovery
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004 ap1_mx304 ap2_mx10004 cr2_mx480
 *   EVO:   p1_ptx10003-80c p2_ptx10001-36mr cr1_acx7100-48l l2-l3_edge_acx7100
 *
 * Highlights:
 *  - "interface all" enables LLDP on every physical port
 *  - Essential for topology discovery and cable verification
 *  - No per-interface filtering or hold-time tuning in this JVD
 *
 * Variables (example values from wanedge1_mx304):
 *   (no variables — static config)
 */

protocols {
    lldp {
        interface all;
    }
}
```

## junos/oam/twamp-client.conf

```
/*
 * Topic:   TWAMP client with per-virtual-router control connections and test sessions
 * Seen on:
 *   Junos: cr2_mx480
 *   EVO:   cr1_acx7100-48l
 *
 * Highlights:
 *  - TWAMP client (RFC 5357) probes AP reflectors for per-VRF latency/jitter measurement
 *  - One control-connection per VR targeting each AP server (dual-homed: AP1 + AP2)
 *  - routing-instance scoping ensures probes originate from the correct VRF
 *  - probe-count 100 at probe-interval 1s for continuous 100-second measurement cycles
 *  - test-count 0 means infinite test iterations (continuous monitoring)
 *  - destination-port per connection matches server routing-instance-list port mapping
 *
 * Pair with:
 *  - junos/oam/twamp-server.conf                    (AP nodes run the reflector)
 *  - junos/services/virtual-router-instance.conf    (VR instances where probes originate)
 *  - junos/interfaces/flexible-vlan-subinterface.conf (PE-CE links carrying probes)
 *
 * Variables (example values from cr2_mx480):
 *   $CONNECTION_NAME     e.g. CR24_1
 *   $DEST_PORT           e.g. 862
 *   $ROUTING_INSTANCE    e.g. VIRTUAL-ROUTER-V1
 *   $TARGET_ADDRESS      e.g. 10.101.49.1
 *   $TEST_SESSION_NAME   e.g. T24_1
 *   $PROBE_COUNT         e.g. 100
 *   $PROBE_INTERVAL      e.g. 1
 */

services {
    rpm {
        twamp {
            client {
                control-connection $CONNECTION_NAME {
                    control-type managed;
                    destination-port $DEST_PORT;
                    routing-instance $ROUTING_INSTANCE;
                    target-address $TARGET_ADDRESS;
                    test-count 0;
                    test-session $TEST_SESSION_NAME {
                        target-address $TARGET_ADDRESS;
                        probe-count $PROBE_COUNT;
                        probe-interval $PROBE_INTERVAL;
                    }
                }
            }
        }
    }
}
```

## junos/oam/twamp-server.conf

```
/*
 * Topic:   TWAMP server with per-VRF port mappings and client authentication lists
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004
 *   EVO:   (none)
 *
 * Highlights:
 *  - TWAMP server (RFC 5357) provides reflector endpoints for latency/jitter measurement
 *  - routing-instance-list maps each MVPN/VRF to a unique port (862 + 49152-49163)
 *  - Per-client address lists (CR1_N, CR2_N) restrict which probers can connect
 *  - authentication-mode none for minimal overhead in controlled lab/DC environment
 *  - "light" mode enables lightweight TWAMP-Light without full control session
 *  - Port 1862 as global server port for non-VRF probes
 *
 * Pair with:
 *  - junos/oam/twamp-client.conf         (CR nodes probe this server)
 *  - junos/services/mvpn-instance.conf   (VRF instances whose latency is monitored)
 *
 * Variables (example values from ap1_mx304):
 *   $VRF_NAME_1          e.g. MVPN_INSTANCE1
 *   $VRF_PORT_1          e.g. 862
 *   $VRF_NAME_2          e.g. MVPN_INSTANCE2
 *   $VRF_PORT_2          e.g. 49152
 *   $GLOBAL_PORT         e.g. 1862
 *   $CLIENT_LIST_NAME    e.g. CR1_1
 *   $CLIENT_ADDRESS      e.g. 10.101.48.2/32
 */

services {
    rpm {
        twamp {
            server {
                routing-instance-list {
                    $VRF_NAME_1 {
                        port $VRF_PORT_1;
                    }
                    $VRF_NAME_2 {
                        port $VRF_PORT_2;
                    }
                }
                authentication-mode none;
                port $GLOBAL_PORT;
                client-list $CLIENT_LIST_NAME {
                    address {
                        $CLIENT_ADDRESS;
                    }
                }
                light;
            }
        }
    }
}
```

## junos/policy/protocol-redistribution.conf

```
/*
 * Topic:   Routing policy statements for BGP/OSPF/direct protocol redistribution
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004 ap1_mx304 ap2_mx10004
 *   EVO:   p1_ptx10003-80c p2_ptx10001-36mr
 *
 * Highlights:
 *  - PS-ADV_DIRECT: redistributes directly-connected routes into BGP
 *  - PS-BGP-TO-OSPF: leaks BGP-learned routes into OSPF (for CE reachability)
 *  - PS-send-ospf: exports OSPF routes into BGP for VPN distribution
 *  - Simple accept-all policies — no route-filtering or manipulation
 *
 * Pair with:
 *  - junos/policy/route-filter-med.conf
 *  - junos/transport/ibgp-core-mesh.conf  (export policies referenced in BGP group)
 *
 * Variables (example values from wanedge1_mx304):
 *   $DIRECT_POLICY_NAME   e.g. PS-ADV_DIRECT
 *   $BGP_TO_OSPF_NAME     e.g. PS-BGP-TO-OSPF
 *   $OSPF_TO_BGP_NAME     e.g. PS-send-ospf
 */

policy-options {
    policy-statement $DIRECT_POLICY_NAME {
        from protocol direct;
        then accept;
    }
    policy-statement $BGP_TO_OSPF_NAME {
        from protocol bgp;
        then accept;
    }
    policy-statement $OSPF_TO_BGP_NAME {
        from protocol ospf;
        then accept;
    }
}
```

## junos/policy/route-filter-med.conf

```
/*
 * Topic:   Route-filter-based MED metric assignment for BGP export
 * Seen on:
 *   Junos: cr2_mx480
 *   EVO:   cr1_acx7100-48l
 *
 * Highlights:
 *  - PS-med-10: assigns MED 10 to specific infrastructure prefix (preferred path)
 *  - PS-med-30: assigns MED 30 to all other prefixes (less-preferred backup)
 *  - Used as export policy in virtual-router BGP groups to influence AP path selection
 *  - route-filter with "exact" match for precise prefix control
 *
 * Pair with:
 *  - junos/services/virtual-router-instance.conf  (BGP group references these as export)
 *  - junos/policy/protocol-redistribution.conf    (other policies in same policy-options)
 *
 * Variables (example values from cr2_mx480):
 *   $MED_LOW_NAME       e.g. PS-med-10
 *   $MED_LOW_PREFIX     e.g. 10.101.0.0/16
 *   $MED_LOW_VALUE      e.g. 10
 *   $MED_HIGH_NAME      e.g. PS-med-30
 *   $MED_HIGH_VALUE     e.g. 30
 */

policy-options {
    policy-statement $MED_LOW_NAME {
        from {
            route-filter $MED_LOW_PREFIX exact;
        }
        then {
            metric $MED_LOW_VALUE;
            accept;
        }
    }
    policy-statement $MED_HIGH_NAME {
        from {
            route-filter 0.0.0.0/0 longer;
        }
        then {
            metric $MED_HIGH_VALUE;
            accept;
        }
    }
}
```

## junos/services/evpn-virtual-switch-esi.conf

```
/*
 * Topic:   EVPN virtual-switch instance with MPLS encapsulation and bridge-domain
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   (none)
 *
 * Highlights:
 *  - instance-type virtual-switch: provides per-tenant MAC/VLAN isolation
 *  - EVPN with MPLS encapsulation for Type-2 MAC/IP and Type-3 IM route exchange
 *  - default-gateway do-not-advertise: suppresses gateway MAC advertisement (anycast not used)
 *  - no-control-word: omits 4-byte control word for compatibility with older MPLS nodes
 *  - bridge-domain binds ESI LAG unit + IRB routing-interface for integrated routing/bridging
 *  - One virtual-switch instance per VLAN/service (EVPN_ESI_LAG1 through LAG23)
 *
 * Pair with:
 *  - junos/interfaces/lag-esi-lacp.conf     (ae0 units referenced in bridge-domains)
 *  - junos/interfaces/irb-l3-gateway.conf   (IRB routing-interface for L3 gateway)
 *  - junos/services/mvpn-instance.conf      (MVPN uses same IRB for multicast ingress)
 *
 * JVD service mapping:
 *   13 instances total (high 13 / med 0 / low 0)
 *   On devices: wanedge1_mx304 (13), wanedge2_mx10004 (13)
 *   Example: EVPN_ESI_LAG1 (RD 10.200.50.12:1, RT target:61535:1)
 *     wanedge1_mx304  ae0.1 00:11:11:11:11:11:12:12:12:12 S-A
 *     wanedge2_mx10004  ae0.1 00:11:11:11:11:11:12:12:12:12 S-A
 *
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME         e.g. EVPN_ESI_LAG1
 *   $BD_NAME               e.g. BD_EVPN_GROUP1
 *   $VLAN_ID               e.g. 1
 *   $AE_UNIT               e.g. ae0.1
 *   $IRB_UNIT              e.g. irb.1
 *   $ROUTE_DISTINGUISHER   e.g. 10.200.50.12:1
 *   $VRF_TARGET            e.g. target:61535:1
 */

routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-switch;
        protocols {
            evpn {
                encapsulation mpls;
                default-gateway do-not-advertise;
                no-control-word;
            }
        }
        bridge-domains {
            $BD_NAME {
                vlan-id $VLAN_ID;
                interface $AE_UNIT;
                routing-interface $IRB_UNIT;
            }
        }
        route-distinguisher $ROUTE_DISTINGUISHER;
        vrf-target $VRF_TARGET;
    }
}
```

## junos/services/mvpn-instance.conf

```
/*
 * Topic:   NG-MVPN VRF instance with PIM, OSPF, BGP, and RSVP-TE provider-tunnel
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   (none)
 *
 * Highlights:
 *  - instance-type vrf with mvpn protocol for NG-MVPN (RFC 6513/6514)
 *  - mvpn-mode spt-only: shortest-path-tree only (no shared-tree), optimal for finance
 *  - hot-root-standby with source-tree: pre-builds backup multicast tree for fast failover
 *  - min-rate 3m + revert-delay 5: traffic threshold and holdoff for standby activation
 *  - sender-based-rpf: validates multicast source via BGP MVPN routes (not RPF on IGP)
 *  - PIM local RP with per-instance multicast group-ranges (225.0.x.0/22 per VRF)
 *  - provider-tunnel rsvp-te with default-template: uses P2MP LSP for multicast transport
 *  - Per-VRF OSPF for CE route distribution + BGP eBGP for traffic-generator peering
 *
 * Pair with:
 *  - junos/bootstrap/chassis-config.conf
 *  - junos/oam/twamp-server.conf
 *  - junos/services/evpn-virtual-switch-esi.conf
 *  - junos/transport/mpls-lsp-p2mp.conf               (P2MP template referenced)
 *  - junos/interfaces/irb-l3-gateway.conf             (IRB interface bound to this VRF)
 *  - junos/multicast/forwarding-multicast-tuning.conf (multicast PFE rate-limiting)
 *  - junos/firewall/multicast-fwd-cache-filter.conf   (CoS marking on multicast ingress)
 *
 * JVD service mapping:
 *   10 instances total (high 10 / med 0 / low 0)
 *   On devices: ap1_mx304 (10), ap2_mx10004 (10), wanedge1_mx304 (10), wanedge2_mx10004 (10)
 *   Example: MVPN_INSTANCE1 (RD 10.200.50.14:61, RT target:64512:11)
 *     ap1_mx304  et-0/0/6.1
 *     ap2_mx10004  et-0/0/2.1
 *     wanedge1_mx304
 *     wanedge2_mx10004
 *
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME       e.g. MVPN_INSTANCE1
 *   $CE_LOCAL_ADDRESS    e.g. 172.16.1.1
 *   $CE_NEIGHBOR         e.g. 172.16.1.2
 *   $CE_PEER_AS          e.g. 64513
 *   $MVPN_RT_IMPORT      e.g. target:64512:101
 *   $MVPN_RT_EXPORT      e.g. target:64512:101
 *   $RP_ADDRESS          e.g. 10.10.47.101
 *   $MCAST_GROUP_RANGE   e.g. 225.0.0.0/22
 *   $IRB_UNIT            e.g. irb.1
 *   $LO_UNIT             e.g. lo0.1
 *   $ROUTE_DISTINGUISHER e.g. 10.200.50.12:61
 *   $VRF_TARGET          e.g. target:64512:11
 */

routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        protocols {
            bgp {
                group custA_TGN {
                    type external;
                    local-address $CE_LOCAL_ADDRESS;
                    export PS-ADV_DIRECT;
                    neighbor $CE_NEIGHBOR {
                        peer-as $CE_PEER_AS;
                    }
                }
            }
            mvpn {
                sender-site;
                mvpn-mode {
                    spt-only;
                }
                route-target {
                    import-target {
                        target $MVPN_RT_IMPORT;
                    }
                    export-target {
                        target $MVPN_RT_EXPORT;
                    }
                }
                sender-based-rpf;
                hot-root-standby {
                    source-tree;
                    min-rate {
                        rate 3m;
                        revert-delay 5;
                    }
                }
            }
            ospf {
                area 0.0.0.0 {
                    interface $LO_UNIT;
                }
                export PS-send-ospf;
            }
            pim {
                join-prune-timeout 420;
                rp {
                    local {
                        address $RP_ADDRESS;
                        group-ranges {
                            $MCAST_GROUP_RANGE;
                        }
                    }
                }
                interface $IRB_UNIT;
                interface $LO_UNIT;
            }
        }
        interface $IRB_UNIT;
        interface $LO_UNIT;
        route-distinguisher $ROUTE_DISTINGUISHER;
        vrf-target $VRF_TARGET;
        vrf-table-label;
        provider-tunnel {
            rsvp-te {
                label-switched-path-template {
                    default-template;
                }
            }
        }
    }
}
```

## junos/services/virtual-router-instance.conf

```
/*
 * Topic:   Virtual-router instance with BGP, PIM sparse-mode, and multicast RP
 * Seen on:
 *   Junos: cr2_mx480
 *   EVO:   cr1_acx7100-48l
 *
 * Highlights:
 *  - instance-type virtual-router: full routing table isolation without MPLS VPN signaling
 *  - eBGP group "AP" peers to both AP nodes with MED export policy for path preference
 *  - iBGP group "IXIA" for traffic-generator peering within the VR
 *  - PIM sparse-mode with static RP pointing to AP node's loopback (multicast receiver side)
 *  - Each VR gets unique multicast group-ranges matching the MVPN sender's PIM RP config
 *  - VRFs V21/V22/V23 omit PIM (unicast-only traffic classes)
 *
 * Pair with:
 *  - junos/interfaces/flexible-vlan-subinterface.conf (PE-CE interfaces bound to VR)
 *  - junos/oam/twamp-client.conf                     (TWAMP probes originate per-VR)
 *  - junos/policy/route-filter-med.conf              (MED export policies referenced)
 *
 * JVD service mapping:
 *   13 instances total (high 10 / med 0 / low 3)
 *   On devices: cr1_acx7100-48l (13), cr2_mx480 (13)
 *   Example: VIRTUAL-ROUTER-V1 (RD —, RT —)
 *     cr1_acx7100-48l  et-0/0/42.1
 *     cr2_mx480  xe-3/0/6.1
 *
 * Variables (example values from cr2_mx480):
 *   $VR_NAME             e.g. VIRTUAL-ROUTER-V1
 *   $AP_PEER_AS          e.g. 64512
 *   $AP_NEIGHBOR_1       e.g. 10.101.49.1
 *   $AP_NEIGHBOR_2       e.g. 10.101.79.1
 *   $EXPORT_POLICIES     e.g. [ med-10 med-30 ]
 *   $IXIA_PEER_AS        e.g. 64521
 *   $IXIA_NEIGHBOR       e.g. 10.101.91.2
 *   $RP_ADDRESS          e.g. 10.10.47.101
 *   $MCAST_GROUP_RANGE   e.g. 225.0.0.0/22
 *   $IFACE_AP1           e.g. et-5/0/0.1
 *   $IFACE_AP2           e.g. et-5/0/1.1
 *   $IFACE_TG            e.g. xe-3/0/6.1
 */

routing-instances {
    $VR_NAME {
        instance-type virtual-router;
        protocols {
            bgp {
                group AP {
                    type external;
                    export $EXPORT_POLICIES;
                    peer-as $AP_PEER_AS;
                    neighbor $AP_NEIGHBOR_1;
                    neighbor $AP_NEIGHBOR_2;
                }
                group IXIA {
                    type internal;
                    peer-as $IXIA_PEER_AS;
                    neighbor $IXIA_NEIGHBOR;
                }
            }
            pim {
                rp {
                    static {
                        address $RP_ADDRESS {
                            group-ranges {
                                $MCAST_GROUP_RANGE;
                            }
                        }
                    }
                }
                interface $IFACE_AP1 {
                    mode sparse;
                }
                interface $IFACE_AP2 {
                    mode sparse;
                }
                interface $IFACE_TG {
                    mode sparse;
                }
            }
        }
        interface $IFACE_TG;
        interface $IFACE_AP1;
        interface $IFACE_AP2;
    }
}
```

## junos/services/vrf-l3vpn.conf

```
/*
 * Topic:   L3VPN VRF instance with external BGP peer (traffic-generator / CE device)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   (none)
 *
 * Highlights:
 *  - instance-type vrf for L3VPN isolation (non-multicast VRFs: VRF21/22/23)
 *  - eBGP peering to traffic-generator or CE device in each VRF
 *  - vrf-table-label enables per-VRF MPLS label for penultimate-hop popping
 *  - route-distinguisher unique per-PE per-VRF for BGP path distinction
 *  - vrf-target with shared RT allows route import/export between PE nodes
 *  - IRB interface provides the VRF's L3 gateway
 *
 * Pair with:
 *  - junos/interfaces/irb-l3-gateway.conf             (IRB bound to this VRF)
 *  - junos/firewall/multicast-fwd-cache-filter.conf   (filter on IRB for these VRFs)
 *  - junos/transport/ibgp-core-mesh.conf              (inet-vpn family carries VRF routes)
 *
 * JVD service mapping:
 *   13 instances total (high 13 / med 0 / low 0)
 *   On devices: ap1_mx304 (13), ap2_mx10004 (13), wanedge1_mx304 (13), wanedge2_mx10004 (13)
 *   Example: MVPN_INSTANCE1 (RD 10.200.50.14:61, RT target:64512:11)
 *     ap1_mx304  et-0/0/6.1
 *     ap2_mx10004  et-0/0/2.1
 *     wanedge1_mx304
 *     wanedge2_mx10004
 *
 * Variables (example values from wanedge1_mx304):
 *   $VRF_NAME             e.g. VRF21
 *   $LOCAL_ADDRESS        e.g. 172.16.21.1
 *   $EXPORT_POLICY        e.g. PS-ADV_DIRECT
 *   $CE_NEIGHBOR          e.g. 172.16.21.2
 *   $CE_PEER_AS           e.g. 64513
 *   $IRB_UNIT             e.g. irb.21
 *   $ROUTE_DISTINGUISHER  e.g. 10.200.50.12:221
 *   $VRF_TARGET           e.g. target:64512:21
 */

routing-instances {
    $VRF_NAME {
        instance-type vrf;
        protocols {
            bgp {
                group TGN_AF {
                    type external;
                    local-address $LOCAL_ADDRESS;
                    export $EXPORT_POLICY;
                    neighbor $CE_NEIGHBOR {
                        peer-as $CE_PEER_AS;
                    }
                }
            }
        }
        interface $IRB_UNIT;
        route-distinguisher $ROUTE_DISTINGUISHER;
        vrf-target $VRF_TARGET;
        vrf-table-label;
    }
}
```

## junos/transport/ibgp-core-mesh.conf

```
/*
 * Topic:   iBGP full-mesh with inet-vpn, EVPN, and inet-mvpn address families
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004 wanedge1_mx304 wanedge2_mx10004
 *   EVO:   (none)
 *
 * Highlights:
 *  - family inet-vpn unicast + any for L3VPN route exchange
 *  - family evpn signaling for EVPN Type-1 through Type-5
 *  - family inet-mvpn signaling for NG-MVPN (multicast VPN) control plane
 *  - family route-target enables RT-constrain to limit VPN route distribution
 *  - BFD at 100ms × 3 for sub-second peer failure detection
 *  - All peers in a single iBGP group (full mesh, no route-reflectors)
 *
 * Pair with:
 *  - junos/interfaces/loopback-multi-af.conf
 *  - junos/services/vrf-l3vpn.conf
 *  - junos/transport/ospf-te-protection.conf   (IGP underlay for iBGP next-hops)
 *  - junos/transport/mpls-lsp-p2mp.conf        (label transport for VPN families)
 *  - junos/policy/protocol-redistribution.conf (export policies referenced in group)
 *
 * Variables (example values from wanedge1_mx304):
 *   $LOCAL_ADDRESS   e.g. 10.200.50.12
 *   $LOCAL_AS        e.g. 64512
 *   $EXPORT_POLICY   e.g. [ PS-send-ospf PS-BGP-TO-OSPF ]
 *   $NEIGHBOR_1      e.g. 10.200.50.13
 *   $NEIGHBOR_2      e.g. 10.200.50.14
 *   $NEIGHBOR_3      e.g. 10.200.50.15
 *   $NEIGHBOR_4      e.g. 10.200.50.11
 *   $NEIGHBOR_5      e.g. 10.200.50.16
 */

protocols {
    bgp {
        group IBGP {
            type internal;
            local-address $LOCAL_ADDRESS;
            family inet {
                unicast;
            }
            family inet-vpn {
                unicast;
                any;
            }
            family evpn {
                signaling;
            }
            family inet-mvpn {
                signaling;
            }
            family route-target;
            export $EXPORT_POLICY;
            local-as $LOCAL_AS;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor $NEIGHBOR_1;
            neighbor $NEIGHBOR_2;
            neighbor $NEIGHBOR_3;
            neighbor $NEIGHBOR_4;
            neighbor $NEIGHBOR_5;
        }
    }
}
```

## junos/transport/mpls-lsp-p2mp.conf

```
/*
 * Topic:   MPLS LSPs with P2MP template and named point-to-point paths
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004 wanedge1_mx304 wanedge2_mx10004
 *   EVO:   (none)
 *
 * Highlights:
 *  - P2MP LSP template enables dynamic multipoint trees for NG-MVPN provider-tunnels
 *  - optimize-aggressive + optimize-timer 5 enables frequent CSPF reoptimization
 *  - link-protection on P2MP template provides FRR bypass tunnels
 *  - Named unicast LSPs (lsp_to_*) provide pre-established paths to PE/AP peers
 *  - retry-timer 5 for fast LSP re-establishment after failure
 *
 * Pair with:
 *  - junos/cos/exp-classifiers-schedulers.conf
 *  - junos/interfaces/physical-p2p-mpls.conf
 *  - junos/transport/ibgp-core-mesh.conf
 *  - junos/transport/rsvp-signaling.conf     (RSVP signals these LSPs)
 *  - junos/transport/ospf-te-protection.conf (CSPF uses OSPF-TE TED)
 *  - junos/services/mvpn-instance.conf       (MVPN uses P2MP provider-tunnel)
 *
 * Variables (example values from wanedge1_mx304):
 *   $P2MP_LSP_NAME     e.g. P2MP
 *   $LSP_NAME_1        e.g. lsp_to_AP1
 *   $LSP_DEST_1        e.g. 10.200.50.14
 *   $LSP_NAME_2        e.g. lsp_to_AP2
 *   $LSP_DEST_2        e.g. 10.200.50.16
 *   $LSP_NAME_3        e.g. lsp_to_PE2
 *   $LSP_DEST_3        e.g. 10.200.50.15
 *   $CORE_IFACE_1      e.g. et-0/0/1.0
 *   $CORE_IFACE_2      e.g. et-0/0/3.0
 */

protocols {
    mpls {
        optimize-aggressive;
        label-switched-path $P2MP_LSP_NAME {
            template;
            retry-timer 5;
            optimize-timer 5;
            link-protection;
            p2mp;
        }
        label-switched-path $LSP_NAME_1 {
            to $LSP_DEST_1;
        }
        label-switched-path $LSP_NAME_2 {
            to $LSP_DEST_2;
        }
        label-switched-path $LSP_NAME_3 {
            to $LSP_DEST_3;
        }
        interface $CORE_IFACE_1;
        interface $CORE_IFACE_2;
        interface lo0.0;
    }
}
```

## junos/transport/ospf-te-protection.conf

```
/*
 * Topic:   OSPF with traffic engineering, node-link-protection, and BFD
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004 wanedge1_mx304 wanedge2_mx10004
 *   EVO:   (none)
 *
 * Highlights:
 *  - traffic-engineering enables OSPF-TE extensions (RFC 3630) for RSVP-TE CSPF
 *  - node-link-protection provides LFA backup for sub-50ms failover
 *  - BFD at 10ms × 3 for ultra-fast adjacency failure detection (finance/low-latency)
 *  - lo0.0 as passive ensures router-id reachability without forming adjacency
 *  - All interfaces in area 0.0.0.0 (single-area backbone)
 *
 * Pair with:
 *  - junos/interfaces/loopback-multi-af.conf
 *  - junos/transport/ibgp-core-mesh.conf
 *  - junos/transport/rsvp-signaling.conf       (RSVP uses OSPF-TE database for CSPF)
 *  - junos/transport/mpls-lsp-p2mp.conf        (MPLS LSPs use CSPF paths)
 *  - junos/interfaces/physical-p2p-mpls.conf   (the physical interfaces referenced)
 *
 * Variables (example values from wanedge1_mx304):
 *   $CORE_IFACE_1   e.g. et-0/0/1.0
 *   $CORE_IFACE_2   e.g. et-0/0/3.0
 *   $BFD_INTERVAL   e.g. 10
 *   $BFD_MULTIPLIER e.g. 3
 */

protocols {
    ospf {
        traffic-engineering;
        area 0.0.0.0 {
            interface $CORE_IFACE_1 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval $BFD_INTERVAL;
                    multiplier $BFD_MULTIPLIER;
                }
            }
            interface $CORE_IFACE_2 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval $BFD_INTERVAL;
                    multiplier $BFD_MULTIPLIER;
                }
            }
            interface lo0.0 {
                passive;
            }
        }
    }
}
```

## junos/transport/rsvp-signaling.conf

```
/*
 * Topic:   RSVP-TE interface enablement for label-switched path signaling
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004 ap1_mx304 ap2_mx10004
 *   EVO:   p1_ptx10003-80c p2_ptx10001-36mr
 *
 * Highlights:
 *  - RSVP enabled on all core transport interfaces and loopback
 *  - Provides RSVP-TE signaling for traffic-engineered LSPs
 *  - Works with OSPF-TE CSPF to compute constrained shortest paths
 *  - lo0.0 included for targeted RSVP sessions (graceful restart, etc.)
 *
 * Pair with:
 *  - junos/transport/mpls-lsp-p2mp.conf        (MPLS LSPs signaled via RSVP)
 *  - junos/transport/ospf-te-protection.conf   (OSPF-TE provides path computation)
 *  - junos/interfaces/physical-p2p-mpls.conf   (physical interfaces referenced)
 *
 * Variables (example values from wanedge1_mx304):
 *   $CORE_IFACE_1   e.g. et-0/0/1.0
 *   $CORE_IFACE_2   e.g. et-0/0/3.0
 */

protocols {
    rsvp {
        interface lo0.0;
        interface $CORE_IFACE_1;
        interface $CORE_IFACE_2;
    }
}
```

## _variables.md

# Variables Glossary

All `$VARIABLE` placeholders used across the ewan_finance snip library.
Replace these with site-specific values when deploying.

## Identifiers & Addressing

| Variable | Description | Example |
|----------|-------------|---------|
| `$LOCAL_ADDRESS` | BGP local-address (router-id loopback) | `10.200.50.12` |
| `$LOCAL_AS` | BGP autonomous system number | `64512` |
| `$ROUTER_ID_ADDRESS` | Primary loopback IPv4 with /32 mask | `10.200.50.13/32` |
| `$MGMT_LOOPBACK` | Management loopback address | `10.255.163.148/32` |
| `$ISO_ADDRESS` | IS-IS/CLNS NET address on lo0 | `47.0005.80ff.f800.0000.0108.0001.0102.5516.3148.00` |
| `$IPV6_ADDRESS` | Primary IPv6 loopback address | `2001:db8::10:255:163:148/128` |
| `$IPV4_ADDRESS` | Interface IPv4 address with mask | `10.101.23.2/24` |
| `$ROUTE_DISTINGUISHER` | BGP route-distinguisher (router-id:id) | `10.200.50.12:61` |
| `$VRF_TARGET` | VPN route-target community | `target:64512:11` |

## Interfaces & LAG

| Variable | Description | Example |
|----------|-------------|---------|
| `$INTERFACE_NAME` | Physical interface name | `et-0/0/0` |
| `$AE_NAME` | Aggregated Ethernet (LAG) name | `ae0` |
| `$DESCRIPTION` | Interface description string | `Link to P1Node to WANEdge1` |
| `$MTU` | Interface MTU value | `1522` |
| `$CORE_IFACE_1` .. `$CORE_IFACE_4` | Core transport interface.unit | `et-0/0/1.0` |
| `$UNIT_ID` | Logical interface unit number | `1` |
| `$VLAN_ID` | 802.1Q VLAN identifier | `1` |

## LAG / ESI

| Variable | Description | Example |
|----------|-------------|---------|
| `$ESI_ID` | Ethernet Segment Identifier (10 bytes) | `00:11:11:11:11:11:12:12:12:12` |
| `$DF_PREFERENCE` | Designated-forwarder election preference | `150` |
| `$LACP_PRIORITY` | LACP system priority | `100` |
| `$LACP_SYSTEM_ID` | LACP system-id (must match across ESI peers) | `00:00:00:00:00:10` |
| `$UNIT_ESI` | Per-unit ESI for per-VLAN DF election | `00:01:71:81:11:12:a1:00:00:01` |
| `$UNIT_DF_PREFERENCE` | Per-unit DF preference value | `150` |

## IRB

| Variable | Description | Example |
|----------|-------------|---------|
| `$FILTER_NAME` | Firewall filter applied on IRB input | `mfc-filter` |
| `$STATIC_MAC` | Static MAC for deterministic gateway | `00:10:94:00:00:01` |

## Chassis

| Variable | Description | Example |
|----------|-------------|---------|
| `$DEVICE_COUNT` | Aggregated Ethernet device-count | `25` |
| `$FPC_SLOT` | FPC slot number | `0` |
| `$PIC_SLOT` | PIC slot number | `0` |
| `$TUNNEL_BW` | Tunnel-services bandwidth | `10g` |
| `$PORT_ID` | Physical port number | `0` |
| `$PORT_SPEED` | Port speed setting | `100g` |
| `$BREAKOUT_PORT_ID` | Port to be broken out | `9` |
| `$BREAKOUT_SPEED` | Per-lane speed after breakout | `10g` |
| `$BREAKOUT_SUB_PORTS` | Number of breakout sub-ports | `4` |

## BGP Peers

| Variable | Description | Example |
|----------|-------------|---------|
| `$NEIGHBOR_1` .. `$NEIGHBOR_5` | iBGP peer addresses | `10.200.50.13` |
| `$EXPORT_POLICY` | BGP group export policy list | `[ PS-send-ospf PS-BGP-TO-OSPF ]` |
| `$CE_NEIGHBOR` | CE/TG BGP peer address | `172.16.1.2` |
| `$CE_PEER_AS` | CE/TG peer autonomous system | `64513` |
| `$AP_PEER_AS` | AP router peer AS (for CR VRs) | `64512` |
| `$AP_NEIGHBOR_1` | AP1 peer address in virtual-router | `10.101.49.1` |
| `$AP_NEIGHBOR_2` | AP2 peer address in virtual-router | `10.101.79.1` |
| `$IXIA_PEER_AS` | Traffic generator peer AS | `64521` |
| `$IXIA_NEIGHBOR` | Traffic generator peer address | `10.101.91.2` |

## MPLS / RSVP

| Variable | Description | Example |
|----------|-------------|---------|
| `$P2MP_LSP_NAME` | P2MP LSP template name | `P2MP` |
| `$LSP_NAME_1` .. `$LSP_NAME_3` | Named unicast LSP | `lsp_to_AP1` |
| `$LSP_DEST_1` .. `$LSP_DEST_3` | LSP destination (peer loopback) | `10.200.50.14` |

## OSPF / BFD

| Variable | Description | Example |
|----------|-------------|---------|
| `$BFD_INTERVAL` | BFD minimum-interval (ms) | `10` |
| `$BFD_MULTIPLIER` | BFD detect-multiplier | `3` |

## Policy

| Variable | Description | Example |
|----------|-------------|---------|
| `$DIRECT_POLICY_NAME` | Direct-route redistribution policy | `PS-ADV_DIRECT` |
| `$BGP_TO_OSPF_NAME` | BGP-to-OSPF leak policy | `PS-BGP-TO-OSPF` |
| `$OSPF_TO_BGP_NAME` | OSPF-to-BGP export policy | `PS-send-ospf` |
| `$MED_LOW_NAME` | Low-MED route-filter policy | `PS-med-10` |
| `$MED_LOW_PREFIX` | Route-filter prefix for low MED | `10.101.0.0/16` |
| `$MED_LOW_VALUE` | Low MED metric value | `10` |
| `$MED_HIGH_NAME` | High-MED catch-all policy | `PS-med-30` |
| `$MED_HIGH_VALUE` | High MED metric value | `30` |
| `$EXPORT_POLICIES` | VR BGP export policy list | `[ med-10 med-30 ]` |

## CoS

| Variable | Description | Example |
|----------|-------------|---------|
| `$INTERFACE_1` .. `$INTERFACE_4` | CoS-applied interfaces | `et-0/0/1` |

## Firewall

| Variable | Description | Example |
|----------|-------------|---------|
| `$MCAST_DEST_PREFIX` | Multicast destination prefix to match | `225.0.0.0/16` |
| `$FORWARDING_CLASS` | Target forwarding class for match | `FC-LLQ` |
| `$UNICAST_DEST_1` | Unicast destination for VRF filter | `10.8.21.2/32` |
| `$UNICAST_DEST_2` | Second unicast destination | `10.9.21.2/32` |
| `$UNICAST_FWD_CLASS` | Forwarding class for unicast match | `FC-HIGH` |

## Multicast / MVPN

| Variable | Description | Example |
|----------|-------------|---------|
| `$RESOLVE_RATE` | Multicast PFE resolve-rate (pps) | `1000` |
| `$MISMATCH_RATE` | RPF mismatch-rate (pps) | `1000` |
| `$INSTANCE_NAME` | MVPN/VRF routing-instance name | `MVPN_INSTANCE1` |
| `$CE_LOCAL_ADDRESS` | MVPN VRF local-address for CE peering | `172.16.1.1` |
| `$MVPN_RT_IMPORT` | MVPN route-target import | `target:64512:101` |
| `$MVPN_RT_EXPORT` | MVPN route-target export | `target:64512:101` |
| `$RP_ADDRESS` | PIM Rendezvous Point address | `10.10.47.101` |
| `$MCAST_GROUP_RANGE` | PIM multicast group-range prefix | `225.0.0.0/22` |
| `$IRB_UNIT` | IRB interface bound to MVPN | `irb.1` |
| `$LO_UNIT` | Loopback unit bound to MVPN | `lo0.1` |

## EVPN

| Variable | Description | Example |
|----------|-------------|---------|
| `$BD_NAME` | Bridge-domain name | `BD_EVPN_GROUP1` |
| `$AE_UNIT` | LAG unit in bridge-domain | `ae0.1` |
| `$IRB_UNIT` | Routing-interface in bridge-domain | `irb.1` |

## L3VPN / Virtual-Router

| Variable | Description | Example |
|----------|-------------|---------|
| `$VRF_NAME` | L3VPN VRF instance name | `VRF21` |
| `$VR_NAME` | Virtual-router instance name | `VIRTUAL-ROUTER-V1` |
| `$LOCAL_ADDRESS` | VRF eBGP local-address | `172.16.21.1` |
| `$IFACE_AP1` | AP1-facing interface in VR | `et-5/0/0.1` |
| `$IFACE_AP2` | AP2-facing interface in VR | `et-5/0/1.1` |
| `$IFACE_TG` | Traffic-generator interface in VR | `xe-3/0/6.1` |

## TWAMP / OAM

| Variable | Description | Example |
|----------|-------------|---------|
| `$VRF_NAME_1` | TWAMP server VRF name | `MVPN_INSTANCE1` |
| `$VRF_PORT_1` | TWAMP server port for VRF | `862` |
| `$GLOBAL_PORT` | TWAMP server global port | `1862` |
| `$CLIENT_LIST_NAME` | TWAMP client-list ACL name | `CR1_1` |
| `$CLIENT_ADDRESS` | TWAMP client source address | `10.101.48.2/32` |
| `$CONNECTION_NAME` | TWAMP client control-connection name | `CR24_1` |
| `$DEST_PORT` | TWAMP client destination port | `862` |
| `$ROUTING_INSTANCE` | TWAMP client routing-instance | `VIRTUAL-ROUTER-V1` |
| `$TARGET_ADDRESS` | TWAMP probe target (server) address | `10.101.49.1` |
| `$TEST_SESSION_NAME` | TWAMP test-session identifier | `T24_1` |
| `$PROBE_COUNT` | Probes per test-session iteration | `100` |
| `$PROBE_INTERVAL` | Probe interval in seconds | `1` |

## VLAN Bridge-Domain (L2 Edge)

| Variable | Description | Example |
|----------|-------------|---------|
| `$VLAN_NAME` | VLAN definition name | `vlan1` |
| `$LAG_UNIT` | LAG unit in VLAN membership | `ae0.1` |
| `$ACCESS_UNIT` | Access port unit in VLAN membership | `et-0/0/47.1` |

## byoai/TIERS.md

# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each service kind at each verbosity tier. It is bundled into [`jvd-ewan-fin-snips.md`](jvd-ewan-fin-snips.md) by `regenerate-bundle.sh`.

For each service kind, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. Use the OS-appropriate file under `junos/` or `evo/`.

---

## What the tiers mean

| Tier | Use when | What's included |
|---|---|---|
| **`minimum`** | Brownfield change. Node already has a working MPLS/RSVP-TE + OSPF underlay AND the iBGP core mesh. You just want the new service. | Service routing-instance + its attachment interface(s) + service-essential helpers (IRB, provider-tunnel, multicast tuning/filter). **Nothing else.** |
| **`with-overlay`** | Brownfield-ish. Node has the underlay but you want to (re)assert the iBGP core mesh that carries the service address family (inet-vpn / inet-mvpn / evpn). | `minimum` + `transport/ibgp-core-mesh.conf`. |
| **`as-deployed`** | Greenfield turn-up, lab build, or "give me a working example end-to-end." Mirrors what the JVD validates. | Everything: service + attachment + iBGP core mesh + OSPF-TE + RSVP + MPLS (P2MP/interfaces) + loopback + core p2p + chassis + CoS + LLDP + policy. |

> **Greenfield / bootstrap requests** (e.g. "build a new MX304 WAN-edge turn-up", "bootstrap a new ACX7100 core router") are always treated as **`as-deployed`** regardless of the user's tier choice.

If the user picks `minimum` and the AI cannot tell whether the iBGP core mesh already carries the needed family, it should call that out in the `Notes:` section.

---

## Shared underlay (the `as-deployed` baseline for every routing node)

Every `as-deployed` service includes this common baseline. OS-select each file (the MPLS forwarding snip differs: Junos folds LSPs into `mpls-lsp-p2mp`; EVO uses `mpls-interfaces`):

- `bootstrap/chassis-config.conf` — chassis hardware, aggregated-devices, FPC/PIC, tunnel-services
- `interfaces/physical-p2p-mpls.conf` — core P2P links (family inet + mpls)
- `interfaces/loopback-multi-af.conf` — lo0 router-id (v4 + v6 + ISO NET)
- `transport/ibgp-core-mesh.conf` — iBGP full mesh / route-reflection (inet-vpn, inet-mvpn, evpn families)
- `transport/ospf-te-protection.conf` — OSPF area + TE extensions + link protection + BFD
- `transport/rsvp-signaling.conf` — RSVP-TE signaling on core interfaces
- `transport/mpls-lsp-p2mp.conf` (Junos) / `transport/mpls-interfaces.conf` (EVO) — MPLS forwarding + LSPs
- `cos/exp-classifiers-schedulers.conf` — EXP classifiers, forwarding classes, schedulers
- `policy/protocol-redistribution.conf` — direct/BGP↔OSPF redistribution policies
- `oam/lldp-discovery.conf` — LLDP neighbor discovery

> The **L2/L3 edge** (`l2-l3_edge_acx7100`) is NOT a full routing node. It takes only `evo/bootstrap/chassis-config.conf` + `evo/interfaces/lag-lacp.conf` + `evo/interfaces/vlan-bridge-domain.conf` + `evo/oam/lldp-discovery.conf`.

---

## NG-MVPN (multicast VRF — SPT-only, RSVP-TE P2MP)  ·  Junos only

Runs on the WAN-edge / aggregation PEs (`wanedge1/2`, `ap1/2`).

**minimum** (just the service)
- `junos/services/mvpn-instance.conf`
- `junos/interfaces/irb-l3-gateway.conf` (IRB bound to the MVPN VRF)
- `junos/transport/mpls-lsp-p2mp.conf` (P2MP provider-tunnel template)
- `junos/multicast/forwarding-multicast-tuning.conf` (resolve/mismatch rate)
- `junos/firewall/multicast-fwd-cache-filter.conf` (multicast CoS marking)

**with-overlay** (= minimum +)
- `junos/transport/ibgp-core-mesh.conf` (carries `inet-mvpn` / MVPN NLRI, Type-5/7)

**as-deployed** (= with-overlay + the shared underlay baseline above)

---

## EVPN virtual-switch (Active/Standby, ESI multihoming)  ·  Junos only

Runs on the WAN-edge PEs (`wanedge1/2`).

**minimum** (just the service)
- `junos/services/evpn-virtual-switch-esi.conf`
- `junos/interfaces/lag-esi-lacp.conf` (ae0 with ESI + LACP, per-unit DF)
- `junos/interfaces/irb-l3-gateway.conf` (IRB gateway in the bridge domain)

**with-overlay** (= minimum +)
- `junos/transport/ibgp-core-mesh.conf` (carries `evpn` family)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## L3VPN VRF (unicast VRF, eBGP PE-CE)  ·  Junos only

Runs on the WAN-edge / aggregation PEs (`wanedge1/2`, `ap1/2`).

**minimum** (just the service)
- `junos/services/vrf-l3vpn.conf`
- `junos/interfaces/irb-l3-gateway.conf` (IRB the VRF binds)
- `junos/firewall/multicast-fwd-cache-filter.conf` (VRF CoS-marking filter)

**with-overlay** (= minimum +)
- `junos/transport/ibgp-core-mesh.conf` (carries `inet-vpn`)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## Virtual-router (CR PE-CE context — eBGP to AP, PIM-SM)  ·  Junos + EVO

Runs on the core routers (`cr1_acx7100-48l` = EVO, `cr2_mx480` = Junos).

**minimum** (just the service) — OS-select every file
- `services/virtual-router-instance.conf`
- `interfaces/flexible-vlan-subinterface.conf` (PE-CE subinterfaces)
- `policy/route-filter-med.conf` (MED export policies)
- `oam/twamp-client.conf` (SLA probing)
- **EVO only, additionally:** `evo/interfaces/vlan-bridge-domain.conf` + `evo/interfaces/lag-lacp.conf`

**with-overlay** (= minimum +)
- `transport/ibgp-core-mesh.conf` (CR global iBGP toward the RRs)
- `policy/protocol-redistribution.conf`

**as-deployed** (= with-overlay + shared underlay baseline)

---

## Add-a-feature requests (no full service)

When the user asks to add a supporting feature to an existing device, emit ONLY that snip set (OS-select):
- **CoS** → `cos/exp-classifiers-schedulers.conf`
- **TWAMP / OAM** → `oam/twamp-server.conf` (Junos AP/WAN-edge) and/or `oam/twamp-client.conf` (CR) + `oam/lldp-discovery.conf`
- **Multicast forwarding filter (CoS marking)** → `junos/firewall/multicast-fwd-cache-filter.conf`
- **Multicast PFE tuning** → `junos/multicast/forwarding-multicast-tuning.conf`
- **MED / redistribution policy** → `policy/route-filter-med.conf` + `policy/protocol-redistribution.conf`
- **L2/L3 edge bridging** → `evo/interfaces/vlan-bridge-domain.conf` + `evo/interfaces/lag-lacp.conf`

## byoai/DEFAULTS.md

# Auto-Fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default values the AI uses in `auto` mode (or when the user short-circuits with `all defaults` / `use defaults` / `skip`). It is bundled into [`jvd-ewan-fin-snips.md`](jvd-ewan-fin-snips.md) by `regenerate-bundle.sh`.

Use these values EXACTLY. Do not invent alternative defaults. Every value the AI auto-fills MUST be listed in the output's `Inputs used:` block so the user can rerun with edits.

Addresses below are the JVD lab's actual values (from each device `.conf`). Substitute site values when deploying.

---

## Device inventory (the JVD topology)

| Device | Platform | OS family | Role | Loopback (router-id) |
|--------|----------|-----------|------|----------------------|
| `wanedge1_mx304` | MX304 | Junos | WAN Edge PE — ESI LAG, EVPN, MVPN sender | `10.200.50.12` |
| `wanedge2_mx10004` | MX10004 | Junos | WAN Edge PE — ESI LAG, EVPN, MVPN sender | `10.200.50.15` |
| `ap1_mx304` | MX304 | Junos | Aggregation PE — TWAMP server, MVPN | `10.200.50.14` |
| `ap2_mx10004` | MX10004 | Junos | Aggregation PE — TWAMP server, MVPN | `10.200.50.16` |
| `cr1_acx7100-48l` | ACX7100-48L | **EVO** | Core Router — virtual-router, TWAMP client | `10.200.50.9` |
| `cr2_mx480` | MX480 | Junos | Core Router — virtual-router, TWAMP client | `10.200.50.18` |
| `p1_ptx10003-80c` | PTX10003-80C | **EVO** | P-router — MPLS/RSVP transit | `10.200.50.13` |
| `p2_ptx10001-36mr` | PTX10001-36MR | **EVO** | P-router — MPLS/RSVP transit | `10.200.50.11` |
| `l2-l3_edge_acx7100` | ACX7100 | **EVO** | L2/L3 Edge — VLAN bridge, LAG (no L3 overlay) | — |

**Device-choice shortcuts** (offered in the clarifying question):
- `WANEDGE` → `wanedge1_mx304` + `wanedge2_mx10004` (Junos; MVPN / EVPN / L3VPN senders)
- `AP` → `ap1_mx304` + `ap2_mx10004` (Junos; MVPN, TWAMP server)
- `CR` → `cr1_acx7100-48l` (EVO) + `cr2_mx480` (Junos) (virtual-router, TWAMP client)
- `P` → `p1_ptx10003-80c` + `p2_ptx10001-36mr` (EVO; MPLS transit only — no service instances)

The multicast finance overlay (NG-MVPN, EVPN A/S, L3VPN, IRB/ESI, firewall CoS marking, multicast tuning, TWAMP-server) is **Junos-exclusive** on the MX WAN-edge / AP nodes. EVO nodes (ACX/PTX) carry the shared underlay plus the **virtual-router** overlay and the L2/L3-edge bridging snips.

---

## Transport / underlay defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$LOCAL_AS` | `64512` | single iBGP core AS (wanedge / ap / p / cr global) |
| `$ROUTER_ID_ADDRESS` / `$LOCAL_ADDRESS` | = device loopback | per device (see table), `/32` |
| `$MGMT_LOOPBACK` | `10.255.163.<n>/32` | management lo0 unit |
| `$ISO_ADDRESS` | NET derived from loopback | `47.0005.80ff.f800.0000.0108.0001.<lo-as-nibbles>.00` |
| `$IPV6_ADDRESS` | `2001:db8::10:200:50:<n>/128` | v6 loopback |
| `$NEIGHBOR_1..5` | other core loopbacks | iBGP peers from the table |
| `$BFD_INTERVAL` / `$BFD_MULTIPLIER` | `10` / `3` | OSPF + RSVP BFD |
| `$MTU` | `1522` | core P2P (jumbo-capable links) |
| `$CORE_IFACE_1..4` | `et-0/0/<n>.0` | core transport interfaces |

**RSVP-TE / MPLS:** named unicast LSPs `lsp_to_<peer>` toward each core loopback (`$LSP_NAME_n` / `$LSP_DEST_n`); P2MP provider-tunnel template `$P2MP_LSP_NAME` = `P2MP`.

---

## LAG / interface defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$AE_NAME` | `ae0` | access-facing LAG (ESI on WAN-edge; plain LACP on L2/L3 edge) |
| `$INTERFACE_NAME` | `et-0/0/0` | first physical member |
| `$DEVICE_COUNT` | `25` | aggregated-devices ethernet device-count |
| `$LACP_SYSTEM_ID` | `00:00:00:00:00:10` | must match across ESI peers |
| `$VLAN_ID` | `1` | first service VLAN |
| `$UNIT_ID` | `1` | first logical unit |

---

## ESI (multi-homing) defaults — EVPN virtual-switch

- All-active / Active-Standby ESI on `ae0` for multi-homed CEs.
- `$ESI_ID` pattern: `00:11:11:11:11:11:12:12:12:12` — MUST match on both PEs of the multihomed pair.
- `$DF_PREFERENCE` `150`; per-unit ESI `$UNIT_ESI` for per-VLAN DF election.
- `$LACP_SYSTEM_ID` on the shared LAG MUST match on both PEs of the ESI.

---

## Service instance-name conventions

Each service kind uses a distinct instance-name + RD/RT namespace. Increment the trailing numeric per instance.

| Service | Instance name | RD (`<loopback>:<id>`) | RT | Start IDs |
|---------|---------------|------------------------|----|-----------|
| NG-MVPN | `MVPN_INSTANCE<n>` | `10.200.50.12:61` | `target:64512:101` (import=export) | instance `1`, RT `101` |
| EVPN virtual-switch | `EVPN_ESI_LAG<n>` / BD `BD_EVPN_GROUP<n>` | `10.200.50.12:1` | `target:61535:1` | group `1`, VLAN `1`, `ae0.1` |
| L3VPN VRF | `VRF<n>` | `10.200.50.12:2<n>` | `target:64512:<n>` | `VRF21`, RD `…:221`, RT `…:21`, `irb.21` |
| Virtual-router | `VIRTUAL-ROUTER-V<n>` | — (eBGP context) | — | AP peer AS `64512`; VR AS cr1 `64520` / cr2 `64521` |

---

## Multicast / MVPN defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$RP_ADDRESS` | `10.10.47.101` | PIM Rendezvous Point |
| `$MCAST_GROUP_RANGE` | `225.0.0.0/22` | PIM group-range (virtual-router); MVPN filter `225.0.0.0/16` |
| `$RESOLVE_RATE` / `$MISMATCH_RATE` | `1000` / `1000` | multicast PFE resolve / RPF-mismatch (pps) |
| `$IRB_UNIT` / `$LO_UNIT` | `irb.1` / `lo0.1` | bound to the MVPN instance |
| `$CE_PEER_AS` | `64513` | CE / traffic-generator AS |

---

## Policy (MED) defaults — virtual-router

| Variable | Default | Notes |
|----------|---------|-------|
| `$MED_LOW_NAME` / `$MED_LOW_VALUE` | `PS-med-10` / `10` | preferred path, prefix `$MED_LOW_PREFIX` `10.101.0.0/16` |
| `$MED_HIGH_NAME` / `$MED_HIGH_VALUE` | `PS-med-30` / `30` | catch-all backup path |
| `$EXPORT_POLICIES` | `[ med-10 med-30 ]` | VR BGP export list |
| `$OSPF_TO_BGP_NAME` / `$BGP_TO_OSPF_NAME` | `PS-send-ospf` / `PS-BGP-TO-OSPF` | redistribution leak policies |

---

## TWAMP / OAM defaults

- TWAMP **server** on Junos AP / WAN-edge: VRF port `$VRF_PORT_1` `862`, global port `$GLOBAL_PORT` `1862`.
- TWAMP **client** on CR: `$PROBE_COUNT` `100`, `$PROBE_INTERVAL` `1` s, target = server loopback.
- `$ROUTING_INSTANCE` for client = `VIRTUAL-ROUTER-V1`.

---

## CoS defaults

EXP-based classifiers + schedulers with a low-latency queue for market-data (`FC-LLQ`) and a high-priority unicast class (`FC-HIGH`). These forwarding-class names and queue numbers are JVD-wide constants — never parameterize them.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-ewan-fin-snips.md`](jvd-ewan-fin-snips.md) by `regenerate-bundle.sh`.

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
#   - { kind: <mvpn|evpn-virtual-switch|l3vpn-vrf|virtual-router>,
#       count: <int>,
#       instance_name: <name>,
#       rd: <loopback:id>,
#       rt: <target:...>,
#       esi_base: <hex>,          # for evpn-virtual-switch
#       mvpn_rt: <target:...>,    # for mvpn
#       rp: <addr>, group_range: <prefix> }   # for mvpn / virtual-router
# snips_used:
#   - junos/services/mvpn-instance.conf
#   - junos/interfaces/irb-l3-gateway.conf
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
- Cross-PE / cross-device consistency the user must verify:
  - EVPN **ESI values** and the LACP system-id MUST match on both PEs of a multihomed pair.
  - MVPN **route-targets** and the **P2MP provider-tunnel** must be consistent across the sender/receiver PEs.
  - L3VPN **route-targets** must match across the PEs that share the VRF.
  - virtual-router: the **eBGP AS toward the AP** (`64512`) is shared; the VR's own AS differs per CR (`cr1` = 64520, `cr2` = 64521).
- Anything by-pattern rather than validated on that exact device (e.g., a user-supplied hostname not in any snip's `Seen on:` list).
- MVPN / multicast turn-ups: remind that `bootstrap/chassis-config.conf` provisions **tunnel-services** (needed for multicast replication) and that `multicast/forwarding-multicast-tuning.conf` + `firewall/multicast-fwd-cache-filter.conf` are the resolve-rate / CoS-marking pair.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
