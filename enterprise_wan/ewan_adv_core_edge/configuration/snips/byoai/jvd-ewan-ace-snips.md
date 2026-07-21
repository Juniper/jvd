# JVD EWAN Advanced Core Edge snippet library

## evo/bootstrap/chassis-network-services.conf

```
/*
 * Topic:   Chassis network-services and aggregated-device count (platform bootstrap)
 * Seen on:
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - aggregated-devices ethernet device-count sets max ae interfaces (must precede ae config)
 *  - network-services enhanced-ip is REQUIRED on EVO for EVPN/MPLS service support
 *  - Without enhanced-ip, EVO defaults to ethernet mode (L2 only, no MPLS/VPN services)
 *  - This is the key EVO-specific bootstrap difference vs Junos MX platforms
 *  - Changing network-services requires a reboot — configure before deploying services
 *
 * Pair with:
 *  - evo/interfaces/lag-flexible-services.conf    (ae interfaces that need device-count)
 *  - evo/transport/mpls-lsp.conf                  (MPLS services needing enhanced-ip)
 *
 * Variables:
 *   $DEVICE_COUNT       e.g. 25
 */

chassis {
    aggregated-devices {
        ethernet {
            device-count $DEVICE_COUNT;
        }
    }
    network-services enhanced-ip;
}
```

## evo/cos/classifier-dscp-exp-8021p.conf

```
/*
 * Topic:   Multi-field BA classifiers (DSCP, MPLS EXP, 802.1p → 8-class forwarding)
 * Seen on:
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - Identical 8-class model as Junos: BEST-EFFORT, LOW, MEDIUM, SIG-OAM, BUSINESS, REALTIME, NETWORK, CONTROL
 *  - DSCP classifier for CE-facing access interfaces
 *  - EXP classifier for core-facing MPLS interfaces
 *  - 802.1p (ieee-802.1) classifier for VLAN-tagged service AC units
 *  - EVO uses the same class-of-service hierarchy as Junos — no syntax differences here
 *
 * Pair with:
 *  - evo/cos/forwarding-class-map.conf   (queue-num mapping these classifiers feed into)
 *  - evo/cos/rewrite-rules-exp.conf      (EXP rewrite on egress core interfaces)
 *
 * Variables:
 *   (none — classifier names and mappings are static in this JVD)
 */

class-of-service {
    classifiers {
        dscp DSCP {
            forwarding-class BEST-EFFORT {
                loss-priority low code-points be;
            }
            forwarding-class BUSINESS {
                loss-priority low code-points [ cs4 af41 ];
            }
            forwarding-class CONTROL {
                loss-priority low code-points cs7;
            }
            forwarding-class LOW {
                loss-priority low code-points [ cs1 af11 ];
            }
            forwarding-class MEDIUM {
                loss-priority high code-points [ cs2 af21 ];
            }
            forwarding-class NETWORK {
                loss-priority low code-points cs6;
            }
            forwarding-class REALTIME {
                loss-priority low code-points [ cs5 ef ];
            }
            forwarding-class SIG-OAM {
                loss-priority low code-points [ cs3 af31 ];
            }
        }
        exp EXP {
            forwarding-class BEST-EFFORT {
                loss-priority high code-points 000;
            }
            forwarding-class BUSINESS {
                loss-priority high code-points 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-points 111;
            }
            forwarding-class LOW {
                loss-priority low code-points 001;
            }
            forwarding-class MEDIUM {
                loss-priority high code-points 010;
            }
            forwarding-class NETWORK {
                loss-priority low code-points 110;
            }
            forwarding-class REALTIME {
                loss-priority low code-points 101;
            }
            forwarding-class SIG-OAM {
                loss-priority high code-points 011;
            }
        }
        ieee-802.1 8021P {
            forwarding-class BEST-EFFORT {
                loss-priority high code-points 000;
            }
            forwarding-class BUSINESS {
                loss-priority high code-points 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-points 111;
            }
            forwarding-class LOW {
                loss-priority low code-points 001;
            }
            forwarding-class MEDIUM {
                loss-priority high code-points 010;
            }
            forwarding-class NETWORK {
                loss-priority low code-points 110;
            }
            forwarding-class REALTIME {
                loss-priority low code-points 101;
            }
            forwarding-class SIG-OAM {
                loss-priority high code-points 011;
            }
        }
    }
}
```

## evo/cos/forwarding-class-map.conf

```
/*
 * Topic:   Forwarding-class to queue-number mapping (8-class CoS model)
 * Seen on:
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - Identical 8-class mapping as Junos — same queue-num assignments
 *  - drop-profiles dp1/dp2 implement WRED for congestion management
 *  - dp1: conservative (fill 40→50, drop 0→70%) — for important traffic overflow
 *  - dp2: aggressive (fill 10→30, drop 0→30%) — for best-effort early discard
 *
 * Pair with:
 *  - evo/cos/classifier-dscp-exp-8021p.conf  (classifiers that feed these queues)
 *  - evo/cos/rewrite-rules-exp.conf          (marking on egress)
 *
 * Variables:
 *   (none — queue mapping is static in this JVD)
 */

class-of-service {
    drop-profiles {
        dp1 {
            fill-level 40 drop-probability 0;
            fill-level 50 drop-probability 70;
        }
        dp2 {
            fill-level 10 drop-probability 0;
            fill-level 30 drop-probability 30;
        }
    }
    forwarding-classes {
        class BEST-EFFORT queue-num 0;
        class BUSINESS queue-num 4;
        class CONTROL queue-num 7;
        class LOW queue-num 1;
        class MEDIUM queue-num 2;
        class NETWORK queue-num 6;
        class REALTIME queue-num 5;
        class SIG-OAM queue-num 3;
    }
}
```

## evo/cos/rewrite-rules-exp.conf

```
/*
 * Topic:   EXP rewrite rule and per-interface CoS binding (core egress marking)
 * Seen on:
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - Same interface CoS binding model as Junos
 *  - EXP rewrite applied to core-facing interfaces
 *  - 802.1p classifiers applied to access-facing interface units
 *  - EVO interface naming uses et-0/0/X format (same as Junos MX/PTX)
 *
 * Pair with:
 *  - evo/cos/classifier-dscp-exp-8021p.conf  (classifiers referenced in bindings)
 *  - evo/interfaces/physical-uplink-mpls.conf (core interfaces these rewrites apply to)
 *  - evo/cos/forwarding-class-map.conf
 *
 * Variables:
 *   $CORE_INTF          e.g. et-0/0/0
 *   $ACCESS_INTF        e.g. et-0/0/2
 *   $UNIT               e.g. 0
 *   $REWRITE_NAME       e.g. EXP-REWRITE
 *   $CLASSIFIER_NAME    e.g. EXP / 8021P
 */

class-of-service {
    interfaces {
        $CORE_INTF {
            unit 0 {
                classifiers {
                    exp $CLASSIFIER_NAME;
                }
                rewrite-rules {
                    exp $REWRITE_NAME;
                }
            }
        }
        $ACCESS_INTF {
            unit $UNIT {
                classifiers {
                    ieee-802.1 8021P;
                }
            }
        }
    }
}
```

## evo/ddos-mitigation/flowspec-routes.conf

```
/*
 * Topic:   BGP FlowSpec enablement for dynamic DDoS mitigation
 * Seen on:
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - Same enablement model as Junos — family inet flow in iBGP group
 *  - Allows RFC 5575 FlowSpec route reception from RR/controller
 *  - Dynamic firewall filter installation in hardware (no CLI config required)
 *  - Real-time DDoS mitigation via match-and-drop/rate-limit actions
 *
 * Pair with:
 *  - evo/transport/bgp-ibgp-evpn.conf         (BGP group with family inet flow enabled)
 *  - evo/firewall/filter-ipv4-stateless.conf   (static equivalent for manual PBR)
 *
 * Variables:
 *   (none — enablement is via BGP family; routes are dynamically injected)
 */

/* FlowSpec is enabled in the BGP group: */

protocols {
    bgp {
        group ibgp {
            family inet {
                unicast;
                flow;   /* ← This enables FlowSpec route reception */
            }
        }
    }
}

/* FlowSpec routes are injected by an external controller or RR peer.
 * Verify with: show route table inetflow.0
 */
```

## evo/firewall/filter-ipv4-stateless.conf

```
/*
 * Topic:   IPv4 stateless firewall filter (PBR with next-ip/next-interface)
 * Seen on:
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - Same stateless filter syntax as Junos — identical match/action semantics
 *  - Matches on L3/L4 fields (src/dst address, src/dst port, protocol)
 *  - next-ip and next-interface actions for policy-based routing
 *  - count action for per-filter hit statistics
 *
 * Pair with:
 *  - evo/ddos-mitigation/flowspec-routes.conf  (dynamic version via BGP FlowSpec)
 *
 * Variables:
 *   $FILTER_NAME        e.g. filter_ip_dport1
 *   $PROTOCOL           e.g. tcp
 *   $MATCH_FIELD        e.g. destination-port 80 / source-address 222.222.2.100/32
 *   $DST_PORT           e.g. 80
 *   $NEXT_HOP           e.g. 192.168.56.2/32
 *   $NEXT_INTF          e.g. et-0/0/1
 */

firewall {
    family inet {
        filter $FILTER_NAME {
            term 1 {
                from {
                    protocol $PROTOCOL;
                    destination-port $DST_PORT;
                }
                then {
                    count $FILTER_NAME;
                    next-ip $NEXT_HOP;
                }
            }
        }
    }
}
```

## evo/interfaces/irb-gateway.conf

```
/*
 * Topic:   IRB gateway interface (per-VRF L3 address for EVPN Type-5 routing)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - Body is byte-identical to the Junos sibling
 *  - IRB unit provides the default gateway for one mac-vrf VLAN (vlan-based service-type)
 *  - Referenced via l3-interface in the mac-vrf vlans stanza (vs routing-interface on Junos)
 *
 * Pair with:
 *  - evo/services/evpn-elan-vlan-based-irb.conf (mac-vrf with l3-interface irb.$UNIT)
 *  - evo/services/evpn-vrf-ip-prefix.conf   (VRF binding interface irb.$UNIT)
 *
 * Variables (example values from wanedge3_acx7509):
 *   $UNIT               e.g. 476
 *   $IPV4_ADDRESS       e.g. 100.100.76.1/24
 */

interfaces {
    irb {
        unit $UNIT {
            family inet {
                address $IPV4_ADDRESS;
            }
        }
    }
}
```

## evo/interfaces/lag-flexible-services.conf

```
/*
 * Topic:   LAG with flexible VLAN services (multi-service bundle for VPWS/ELAN ACs)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - EVO version omits link-protection and fast-failover (not supported on ACX7509 LACP in 23.4R2)
 *  - flexible-vlan-tagging + encapsulation flexible-ethernet-services same as Junos
 *  - LACP system-id must match the multi-homing peer PE's system-id for ESI to function
 *  - Member links use ether-options { 802.3ad ae0; } (vs gigether-options on Junos MX)
 *
 * Pair with:
 *  - evo/interfaces/vlan-ccc-esi.conf    (per-unit VPWS AC config on this LAG)
 *  - evo/interfaces/vlan-bridge.conf     (per-unit ELAN AC config on this LAG)
 *  - evo/services/evpn-vpws-vlan-based.conf     (VPWS instances binding vlan-ccc units)
 *  - evo/services/evpn-fxc-vlan-aware.conf      (FXC instances referencing ae0.* units)
 *  - evo/services/evpn-elan-vlan-bundle.conf    (ELAN instances binding vlan-bridge units)
 *  - evo/services/evpn-elan-vlan-based-irb.conf (ELAN+IRB instances binding vlan-bridge units)
 *  - evo/bootstrap/chassis-network-services.conf
 *  - evo/transport/forwarding-options-hash.conf
 *
 * Variables (example values from wanedge3_acx7509):
 *   $LAG_INTF           e.g. ae0
 *   $DESCRIPTION        e.g. PE3 to CE2
 *   $LACP_SYSTEM_ID     e.g. 00:00:00:00:01:01
 */

interfaces {
    $LAG_INTF {
        description "$DESCRIPTION";
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

## evo/interfaces/loopback.conf

```
/*
 * Topic:   Loopback interface (router-id, BGP source, MPLS label binding)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - Body is byte-identical to the Junos sibling
 *  - /32 loopback is the SR node-segment target (OSPF advertises prefix-SID for this address)
 *  - Used as BGP local-address, OSPF router-id, and LDP transport address
 *
 * Pair with:
 *  - evo/transport/ospf-sr-lfa.conf     (lo0.0 as passive OSPF interface)
 *  - evo/transport/bgp-ibgp-evpn.conf   (lo0.0 IP as BGP local-address)
 *
 * Variables (example values from wanedge3_acx7509):
 *   $LOOPBACK_V4        e.g. 4.4.4.4/32
 */

interfaces {
    lo0 {
        unit 0 {
            family inet {
                address $LOOPBACK_V4;
            }
            family mpls;
        }
    }
}
```

## evo/interfaces/physical-uplink-mpls.conf

```
/*
 * Topic:   Physical core uplink with MPLS and IPv4 (WAN backbone interface)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - Body is structurally identical to the Junos sibling (direct port variant)
 *  - EVO WAN edges use et-* interfaces directly (no LAG on core links in this topology)
 *  - P routers (PTX) also use direct et-* or ae interfaces for core mesh
 *  - speed 100g may be explicitly set on EVO platforms (not present on Junos MX)
 *
 * Pair with:
 *  - evo/transport/ospf-sr-lfa.conf          (OSPF config referencing these interfaces)
 *  - evo/transport/mpls-lsp.conf             (MPLS enablement on these interfaces)
 *  - evo/transport/ldp-sr-coexistence.conf   (LDP also enabled on these interfaces)
 *  - evo/cos/rewrite-rules-exp.conf
 *
 * Variables (example values from wanedge3_acx7509):
 *   $INTF               e.g. et-1/0/0
 *   $DESCRIPTION        e.g. WANEdge3 to P1
 *   $IPV4_ADDRESS       e.g. 192.168.34.2/24
 */

interfaces {
    $INTF {
        description "$DESCRIPTION";
        unit 0 {
            family inet {
                address $IPV4_ADDRESS;
            }
            family mpls;
        }
    }
}
```

## evo/interfaces/vlan-bridge.conf

```
/*
 * Topic:   ELAN attachment-circuit (vlan-bridge encapsulation)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - encapsulation vlan-bridge carries L2 multipoint ELAN traffic
 *  - No ESI needed — bridging semantics don't require per-unit multi-homing
 *    (the parent LAG ESI handles it at the bundle level)
 *  - No family statement — bridging is implied by the encapsulation
 *  - Scale: ~1000 vlan-bridge units per ae0 in this JVD
 *
 * Pair with:
 *  - evo/interfaces/lag-flexible-services.conf  (the parent ae interface)
 *  - evo/services/evpn-elan-vlan-bundle.conf    (ELAN instances binding these units)
 *  - evo/services/evpn-elan-vlan-based-irb.conf (ELAN+IRB instances binding these units)
 *
 * Variables (example values from wanedge3_acx7509):
 *   $LAG_INTF           e.g. ae0
 *   $UNIT               e.g. 2001
 *   $VLAN_ID            e.g. 2001
 */

interfaces {
    $LAG_INTF {
        unit $UNIT {
            encapsulation vlan-bridge;
            vlan-id $VLAN_ID;
        }
    }
}
```

## evo/interfaces/vlan-ccc-esi.conf

```
/*
 * Topic:   VPWS attachment-circuit (vlan-ccc with ESI all-active multi-homing)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - encapsulation vlan-ccc carries point-to-point VPWS traffic
 *  - ESI with all-active enables per-flow multi-homing across PE pairs
 *  - ESI is a 10-byte identifier — must be identical on both multi-homed PEs
 *  - family ccc is required for circuit cross-connect semantics
 *  - Scale: ~1500 vlan-ccc units per ae0 in this JVD
 *
 * Pair with:
 *  - evo/interfaces/lag-flexible-services.conf  (the parent ae interface)
 *  - evo/services/evpn-vpws-vlan-based.conf     (instances binding these vlan-ccc units)
 *  - evo/services/evpn-fxc-vlan-aware.conf      (FXC instances binding these units)
 *  - evo/oam/cfm-maintenance-domain.conf
 *
 * Variables (example values from wanedge3_acx7509):
 *   $LAG_INTF           e.g. ae0
 *   $UNIT               e.g. 1
 *   $VLAN_ID            e.g. 1
 *   $ESI                e.g. 00:34:34:34:34:34:34:34:11:01
 */

interfaces {
    $LAG_INTF {
        unit $UNIT {
            encapsulation vlan-ccc;
            vlan-id $VLAN_ID;
            esi {
                $ESI;
                all-active;
            }
            family ccc;
        }
    }
}
```

## evo/oam/cfm-maintenance-domain.conf

```
/*
 * Topic:   CFM maintenance domain with continuity-check MEP (802.1ag OAM)
 * Seen on:
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - Same 802.1ag CFM syntax and semantics as Junos
 *  - Level 3 maintenance-domain for PE-to-PE monitoring
 *  - Continuity-check at 1s interval (failure detect ~3.5s)
 *  - MEP direction "up" monitors MPLS/EVPN path toward remote PE
 *  - auto-discovery for automatic remote-MEP detection
 *
 * Pair with:
 *  - evo/oam/cfm-sla-iterator.conf           (performance measurement on these MEPs)
 *  - evo/interfaces/vlan-ccc-esi.conf        (AC interfaces referenced by MEPs)
 *
 * Variables:
 *   $MD_NAME            e.g. m-d301
 *   $MD_LEVEL           e.g. 3
 *   $MA_NAME            e.g. m-a301
 *   $MEP_ID             e.g. 1
 *   $MEP_INTF           e.g. et-0/0/2.301
 *   $CC_INTERVAL        e.g. 1s
 */

protocols {
    oam {
        ethernet {
            connectivity-fault-management {
                maintenance-domain $MD_NAME {
                    level $MD_LEVEL;
                    name-format character-string;
                    maintenance-association $MA_NAME {
                        short-name-format character-string;
                        continuity-check {
                            interval $CC_INTERVAL;
                        }
                        mep $MEP_ID {
                            interface $MEP_INTF;
                            direction up;
                            auto-discovery;
                        }
                    }
                }
            }
        }
    }
}
```

## evo/oam/cfm-sla-iterator.conf

```
/*
 * Topic:   CFM enhanced SLA iterator (two-way delay and synthetic loss measurement)
 * Seen on:
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - Same enhanced-sla-iterator model as Junos
 *  - Hardware-timestamped performance measurement
 *  - two-way-delay profile for round-trip latency measurement
 *  - slm (Synthetic Loss Measurement) for non-intrusive frame loss detection
 *  - measurement-interval sets the reporting/aggregation window
 *
 * Pair with:
 *  - evo/oam/cfm-maintenance-domain.conf   (MEPs these measurements run against)
 *
 * Variables:
 *   $PROFILE_DELAY      e.g. i1
 *   $PROFILE_SLM        e.g. i2
 *   $INTERVAL           e.g. 5
 */

protocols {
    oam {
        ethernet {
            connectivity-fault-management {
                performance-monitoring {
                    enhanced-sla-iterator;
                    measurement-interval $INTERVAL;
                    sla-iterator-profiles {
                        $PROFILE_DELAY {
                            measurement-type two-way-delay;
                        }
                        $PROFILE_SLM {
                            measurement-type slm;
                        }
                    }
                }
            }
        }
    }
}
```

## evo/policy/per-packet-load-balance.conf

```
/*
 * Topic:   Per-packet load-balance and BGP redistribution policies
 * Seen on:
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - Same policy-options syntax as Junos — no EVO-specific differences
 *  - pplb enables per-flow ECMP; Term 1 specifically handles family evpn
 *  - send-direct redistributes connected routes into BGP (loopback reachability)
 *  - bgp-to-ospf redistributes BGP→OSPF for multi-area designs
 *  - Applied via routing-options forwarding-table export pplb
 *
 * Pair with:
 *  - evo/transport/bgp-ibgp-evpn.conf           (BGP sessions using send-direct export)
 *  - evo/transport/forwarding-options-hash.conf  (hash-key that pplb distributes across)
 *
 * Variables:
 *   (none — policy names and logic are static in this JVD)
 */

policy-options {
    policy-statement pplb {
        term 1 {
            from family evpn;
            then {
                load-balance per-packet;
                accept;
            }
        }
        then {
            load-balance per-packet;
            accept;
        }
    }
    policy-statement send-direct {
        term 1 {
            from protocol direct;
            then accept;
        }
    }
    policy-statement bgp-to-ospf {
        from protocol bgp;
        then accept;
    }
}

/* Applied in routing-options: */

routing-options {
    forwarding-table {
        export pplb;
    }
}
```

## evo/services/evpn-elan-vlan-based-irb.conf

```
/*
 * Topic:   EVPN-ELAN vlan-based with IRB gateway (L2+L3 integrated)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - EVO uses instance-type mac-vrf with service-type vlan-based
 *  - Each VLAN gets explicit vlan-id + l3-interface for IRB routing
 *  - encapsulation mpls explicitly sets EVPN/MPLS data-plane
 *  - default-gateway do-not-advertise suppresses Type-5 default from this instance
 *  - no-control-word is explicit on EVO
 *  - The IRB interface is associated with a VRF instance for ip-prefix-route advertisement
 *  - Scale: ~600 vlan-based ELAN instances per WAN edge in this JVD
 *
 * Pair with:
 *  - evo/services/evpn-vrf-ip-prefix.conf  (the L3 VRF binding irb.$UNIT)
 *  - evo/interfaces/irb-gateway.conf       (IRB unit config)
 *  - evo/interfaces/vlan-bridge.conf       (the vlan-bridge AC units)
 *  - evo/interfaces/lag-flexible-services.conf  (the parent ae interface)
 *
 * JVD service mapping:
 *   1225 instances across 2 EVO WAN-edge devices
 *     wanedge3_acx7509: 600
 *     wanedge4_acx7100-48l: 625
 *   Examples: elan_group_95_476, elan_group_95_478, elan_group_95_480
 *
 * Variables (example values from wanedge3_acx7509):
 *   $INSTANCE_NAME      e.g. elan_group_95_476
 *   $AC_INTF_1          e.g. ae0.476
 *   $VLAN_NAME          e.g. svbased_476
 *   $VLAN_ID            e.g. 476
 *   $IRB_UNIT           e.g. irb.476
 *   $RD                 e.g. 44.44.44.44:476
 *   $RT                 e.g. target:62525:476
 */

routing-instances {
    $INSTANCE_NAME {
        instance-type mac-vrf;
        protocols {
            evpn {
                encapsulation mpls;
                default-gateway do-not-advertise;
                no-control-word;
            }
        }
        service-type vlan-based;
        route-distinguisher $RD;
        vrf-target $RT;
        vlans {
            $VLAN_NAME {
                vlan-id $VLAN_ID;
                interface $AC_INTF_1;
                l3-interface $IRB_UNIT;
            }
        }
    }
}
```

## evo/services/evpn-elan-vlan-bundle.conf

```
/*
 * Topic:   EVPN-ELAN vlan-bundle (L2 multipoint, no IRB)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - EVO uses instance-type mac-vrf (Junos MX uses instance-type evpn)
 *  - service-type vlan-bundle: multiple ACs grouped under a single vlans stanza
 *  - Pure L2 switching — no IRB, no per-VLAN L3 gateway
 *  - no-control-word is explicit on EVO
 *  - Scale: ~600 vlan-bundle ELAN instances per WAN edge in this JVD
 *
 * Pair with:
 *  - evo/interfaces/vlan-bridge.conf       (the vlan-bridge AC units)
 *  - evo/interfaces/lag-flexible-services.conf  (the parent ae interface)
 *
 * JVD service mapping:
 *   1200 instances across 2 EVO WAN-edge devices
 *     wanedge3_acx7509: 600
 *     wanedge4_acx7100-48l: 600
 *   Examples: elan_group_500_2001, elan_group_500_2003, elan_group_500_2005
 *
 * Variables (example values from wanedge3_acx7509):
 *   $INSTANCE_NAME      e.g. elan_group_500_2001
 *   $AC_INTF_1          e.g. ae0.2001
 *   $AC_INTF_2          e.g. ae0.2002
 *   $VLAN_NAME          e.g. mvbundle_2001
 *   $RD                 e.g. 44.44.44.44:2001
 *   $RT                 e.g. target:62525:2001
 */

routing-instances {
    $INSTANCE_NAME {
        instance-type mac-vrf;
        protocols {
            evpn {
                no-control-word;
            }
        }
        service-type vlan-bundle;
        route-distinguisher $RD;
        vrf-target $RT;
        vlans {
            $VLAN_NAME {
                interface $AC_INTF_1;
                interface $AC_INTF_2;
            }
        }
    }
}
```

## evo/services/evpn-fxc-vlan-aware.conf

```
/*
 * Topic:   EVPN FXC vlan-aware (Flexible Cross-Connect, multi-AC)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - Multi-homed VPWS carrying 2+ VLANs per instance via flexible-cross-connect-vlan-aware
 *  - Each AC interface gets its own vpws-service-id pair (local/remote must be swapped on the far end)
 *  - All ACs share a single RD and RT; the service-id disambiguates circuits within the instance
 *  - Scale: ~500 FXC instances per WAN edge in this JVD
 *
 * Pair with:
 *  - evo/interfaces/lag-flexible-services.conf  (the ae0 bundle carrying these ACs)
 *  - evo/interfaces/vlan-ccc-esi.conf           (per-AC unit config on ae0)
 *
 * JVD service mapping:
 *   1800 instances across 4 WAN-edge devices
 *     wanedge1_mx304: 1500
 *     wanedge2_mx10004: 1500
 *     wanedge3_acx7509: 1500
 *     wanedge4_acx7100-48l: 1500
 *   Examples: vfxc_group_40_1001, vfxc_group_40_1003, vfxc_group_40_1005
 *
 * Variables (example values from wanedge3_acx7509):
 *   $INSTANCE_NAME      e.g. vfxc_group_40_1001
 *   $AC_INTF_1          e.g. ae0.1001
 *   $AC_INTF_2          e.g. ae0.1002
 *   $LOCAL_ID_1         e.g. 1
 *   $REMOTE_ID_1        e.g. 2
 *   $LOCAL_ID_2         e.g. 11
 *   $REMOTE_ID_2        e.g. 21
 *   $RD                 e.g. 44.44.44.44:1001
 *   $RT                 e.g. target:65000:1001
 */

routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_INTF_1 {
                    vpws-service-id {
                        local $LOCAL_ID_1;
                        remote $REMOTE_ID_1;
                    }
                }
                interface $AC_INTF_2 {
                    vpws-service-id {
                        local $LOCAL_ID_2;
                        remote $REMOTE_ID_2;
                    }
                }
                flexible-cross-connect-vlan-aware;
            }
        }
        interface $AC_INTF_1;
        interface $AC_INTF_2;
        route-distinguisher $RD;
        vrf-target $RT;
    }
}
```

## evo/services/evpn-vpws-vlan-based.conf

```
/*
 * Topic:   EVPN-VPWS vlan-based point-to-point pseudowire (single AC, control-word)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - Single AC interface, one vpws-service-id pair, control-word enabled
 *  - control-word ensures correct sequencing and prevents fat-pipe reordering issues
 *  - local/remote IDs must be mirror-swapped on the PE peer (local 30 ↔ remote 20)
 *  - Scale: ~1000 VPWS instances per WAN edge in this JVD
 *
 * Pair with:
 *  - evo/interfaces/vlan-ccc-esi.conf        (the per-unit AC config on the LAG interface)
 *  - evo/interfaces/lag-flexible-services.conf (the parent ae interface)
 *
 * JVD service mapping:
 *   1800 instances across 4 WAN-edge devices
 *     wanedge1_mx304: 1500
 *     wanedge2_mx10004: 1500
 *     wanedge3_acx7509: 1500
 *     wanedge4_acx7100-48l: 1500
 *   Examples: vfxc_group_40_1001, vfxc_group_40_1003, vfxc_group_40_1005
 *
 * Variables (example values from wanedge3_acx7509):
 *   $INSTANCE_NAME      e.g. vpws_group_23_1
 *   $AC_INTF            e.g. et-0/0/2.1
 *   $LOCAL_ID           e.g. 30
 *   $REMOTE_ID          e.g. 20
 *   $RD                 e.g. 4.4.4.4:231
 *   $RT                 e.g. target:63535:231
 */

routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_INTF {
                    vpws-service-id {
                        local $LOCAL_ID;
                        remote $REMOTE_ID;
                    }
                }
                control-word;
            }
        }
        interface $AC_INTF;
        route-distinguisher $RD;
        vrf-target $RT;
    }
}
```

## evo/services/evpn-vrf-ip-prefix.conf

```
/*
 * Topic:   EVPN IP-prefix route VRF (L3 VPN with EVPN Type-5 advertisement)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - Body is byte-identical to the Junos sibling
 *  - L3 VRF that advertises connected IRB subnets as EVPN Type-5 ip-prefix routes
 *  - advertise direct-nexthop enables direct PE-to-PE forwarding (no recursive resolution)
 *  - encapsulation mpls sets the data-plane encap for inter-PE traffic
 *  - vrf-table-label allocates a per-VRF MPLS label for ingress lookup
 *  - Scale: ~350 VRF instances per WAN edge in this JVD
 *
 * Pair with:
 *  - evo/services/evpn-elan-vlan-based-irb.conf (the bridge domain whose IRB feeds this VRF)
 *  - evo/interfaces/irb-gateway.conf      (IRB unit addressing)
 *
 * JVD service mapping:
 *   350 instances across 4 WAN-edge devices
 *     wanedge1_mx304: 350
 *     wanedge2_mx10004: 325
 *     wanedge3_acx7509: 325
 *     wanedge4_acx7100-48l: 350
 *   Examples: evpn_100, evpn_101, evpn_102
 *
 * Variables (example values from wanedge3_acx7509):
 *   $INSTANCE_NAME      e.g. evpn_1851
 *   $ROUTER_ID          e.g. 4.4.4.4
 *   $IRB_UNIT           e.g. irb.1851
 *   $RD                 e.g. 63434:1851
 *   $RT                 e.g. target:60555:1851
 */

routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            router-id $ROUTER_ID;
        }
        protocols {
            evpn {
                ip-prefix-routes {
                    advertise direct-nexthop;
                    encapsulation mpls;
                }
            }
        }
        interface $IRB_UNIT;
        route-distinguisher $RD;
        vrf-target $RT;
        vrf-table-label;
    }
}
```

## evo/transport/bgp-ibgp-evpn.conf

```
/*
 * Topic:   iBGP overlay with EVPN signaling (route-reflector client config)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - EVO places multipath outside the group block (vs Junos which has it inside)
 *  - family route-target enables RT-constrain (RFC 4684) — not present on Junos PEs in this JVD
 *  - No advertise-external knob (EVO peers only with RRs, not external)
 *  - No top-level family inet { unicast { loops 2; } } — EVO omits this
 *  - P routers (RRs) add cluster and graceful-restart; PE config shown here
 *
 * Pair with:
 *  - evo/policy/per-packet-load-balance.conf  (the pplb policy applied via forwarding-table export)
 *  - evo/transport/ospf-sr-lfa.conf           (the IGP underlay these sessions ride over)
 *  - evo/ddos-mitigation/flowspec-routes.conf
 *  - evo/interfaces/loopback.conf
 *
 * Variables (example values from wanedge3_acx7509):
 *   $LOCAL_ADDRESS      e.g. 4.4.4.4
 *   $LOCAL_AS           e.g. 64512
 *   $RR_PEER_1          e.g. 3.3.3.3
 *   $RR_PEER_2          e.g. 6.6.6.6
 */

protocols {
    bgp {
        group ibgp {
            type internal;
            local-address $LOCAL_ADDRESS;
            family inet {
                unicast;
                flow;
            }
            family evpn {
                signaling;
            }
            family route-target;
            export send-direct;
            local-as $LOCAL_AS;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor $RR_PEER_1;
            neighbor $RR_PEER_2;
        }
        multipath;
    }
}
```

## evo/transport/forwarding-options-hash.conf

```
/*
 * Topic:   Forwarding hash-key configuration for ECMP and LAG load distribution
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - EVO version adds family mpls with all-labels + payload ip for deep MPLS hash inspection
 *  - all-labels hashes across the full label stack (not just top label) for better SR/LDP ECMP
 *  - payload ip peeks past the MPLS stack into the IP header for per-flow distribution
 *  - inet/inet6/multiservice families are identical to the Junos sibling
 *  - Essential for LDP/SR coexistence where label stacks can be 3+ deep
 *
 * Pair with:
 *  - evo/interfaces/lag-flexible-services.conf  (the LAG benefiting from this hash)
 *  - evo/transport/ospf-sr-lfa.conf             (ECMP paths this hash distributes across)
 *  - evo/transport/ldp-sr-coexistence.conf      (deep label stacks from LDP+SR stitching)
 *  - evo/policy/per-packet-load-balance.conf
 *
 * Variables:
 *   (none — this stanza is static)
 */

forwarding-options {
    hash-key {
        family inet {
            layer-3;
            layer-4;
        }
        family inet6 {
            layer-3;
            layer-4;
        }
        family mpls {
            all-labels;
            payload {
                ip;
            }
        }
        family multiservice {
            source-mac;
            destination-mac;
        }
    }
}
```

## evo/transport/ldp-sr-coexistence.conf

```
/*
 * Topic:   LDP with SR coexistence (sr-mapping-client + ldp-synchronization)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - LDP runs alongside Segment Routing on the same interfaces for interop with legacy nodes
 *  - sr-mapping-client (on P routers) tells LDP to consume prefix-SID mappings from the SR mapping server
 *  - OSPF interfaces have ldp-synchronization to hold traffic until LDP adjacency is up
 *  - This enables seamless SR/LDP stitching: LDP-only nodes can reach SR-only nodes via the P router
 *  - WAN edge EVO nodes run LDP on all core interfaces; Junos WAN edges do NOT run LDP (SR-only)
 *
 * Pair with:
 *  - evo/transport/ospf-sr-lfa.conf       (OSPF with ldp-synchronization per interface)
 *  - evo/transport/sr-mapping-server.conf  (mapping-server-entry on P routers)
 *  - evo/interfaces/physical-uplink-mpls.conf
 *  - evo/transport/forwarding-options-hash.conf
 *  - evo/transport/mpls-lsp.conf
 *
 * Variables (example values from wanedge3_acx7509):
 *   $CORE_INTF_1         e.g. et-1/0/0.0
 *   $CORE_INTF_2         e.g. et-1/0/1.0
 *   $CORE_INTF_3         e.g. et-1/0/2.0
 */

protocols {
    ldp {
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
        interface $CORE_INTF_3;
        interface lo0.0;
    }
}

/* P routers additionally enable sr-mapping-client: */

protocols {
    ldp {
        interface $CORE_INTF_1;
        interface lo0.0;
        sr-mapping-client;
    }
}
```

## evo/transport/mpls-lsp.conf

```
/*
 * Topic:   MPLS label-switched paths and interface enablement
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - Body is structurally identical to the Junos sibling
 *  - EVO nodes list all core-facing interfaces (no LAG aggregation on P routers)
 *  - LSP targets are the Junos PE loopbacks (cross-OS peering over same MPLS core)
 *  - traffic-engineering enables TE-DB for CSPF even with SR forwarding
 *
 * Pair with:
 *  - evo/transport/ospf-sr-lfa.conf          (IGP providing the label stack)
 *  - evo/transport/ldp-sr-coexistence.conf   (LDP runs on same interfaces for interop)
 *  - evo/bootstrap/chassis-network-services.conf
 *  - evo/interfaces/physical-uplink-mpls.conf
 *
 * Variables (example values from wanedge3_acx7509):
 *   $LSP_NAME_1          e.g. lsp_to_pe1
 *   $LSP_DEST_1          e.g. 2.2.2.2
 *   $LSP_NAME_2          e.g. lsp_to_pe2
 *   $LSP_DEST_2          e.g. 5.5.5.5
 *   $CORE_INTF_1         e.g. et-1/0/0.0
 *   $CORE_INTF_2         e.g. et-1/0/1.0
 *   $CORE_INTF_3         e.g. et-1/0/2.0
 */

protocols {
    mpls {
        traffic-engineering;
        label-switched-path $LSP_NAME_1 {
            to $LSP_DEST_1;
        }
        label-switched-path $LSP_NAME_2 {
            to $LSP_DEST_2;
        }
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
        interface $CORE_INTF_3;
        interface lo0.0;
    }
}
```

## evo/transport/ospf-sr-lfa.conf

```
/*
 * Topic:   OSPF with Segment Routing and TI-LFA (post-convergence node protection)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - Body is structurally identical to the Junos sibling
 *  - P routers additionally carry mapping-server + ldp-stitching (see ldp-sr-coexistence.conf)
 *  - install-prefix-sid-for-best-route present on P routers to install SIDs in FIB
 *  - Same SRGB (16000 base, 8000 range) must be consistent domain-wide
 *
 * Pair with:
 *  - evo/transport/ldp-sr-coexistence.conf      (LDP stitching knobs on P routers)
 *  - evo/transport/sr-mapping-server.conf       (prefix-to-SID database)
 *  - evo/transport/bgp-ibgp-evpn.conf           (iBGP sessions using this IGP's loopbacks)
 *  - evo/interfaces/loopback.conf
 *  - evo/interfaces/physical-uplink-mpls.conf
 *  - evo/transport/forwarding-options-hash.conf
 *  - evo/transport/mpls-lsp.conf
 *
 * Variables (example values from p1_ptx10003):
 *   $NODE_SEGMENT_INDEX e.g. 103
 *   $SRGB_START         e.g. 16000
 *   $SRGB_RANGE         e.g. 8000
 *   $CORE_INTF_1        e.g. ae2.0
 *   $CORE_INTF_2        e.g. et-1/0/5.0
 *   $CORE_INTF_3        e.g. et-1/0/1.0
 *   $MAPPING_SERVER_NAME e.g. ospf-mapping-server
 */

protocols {
    ospf {
        backup-spf-options {
            use-post-convergence-lfa {
                maximum-labels 8;
                maximum-backup-paths 5;
            }
            use-source-packet-routing;
        }
        traffic-engineering;
        source-packet-routing {
            node-segment ipv4-index $NODE_SEGMENT_INDEX;
            srgb start-label $SRGB_START index-range $SRGB_RANGE;
            mapping-server $MAPPING_SERVER_NAME;
            install-prefix-sid-for-best-route;
            ldp-stitching;
        }
        area 0.0.0.0 {
            interface $CORE_INTF_1 {
                interface-type p2p;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                post-convergence-lfa {
                    node-protection;
                }
                ipv4-adjacency-segment {
                    protected dynamic;
                }
            }
            interface $CORE_INTF_2 {
                interface-type p2p;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                post-convergence-lfa {
                    node-protection;
                }
                ipv4-adjacency-segment {
                    protected dynamic;
                }
            }
            interface lo0.0 {
                passive;
            }
        }
    }
}
```

## evo/transport/sr-mapping-server.conf

```
/*
 * Topic:   SR prefix-SID mapping server (LDP-to-SR stitching on P routers)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - Mapping server advertises prefix-SID bindings for LDP-only nodes into the SR domain
 *  - prefix-segment-range maps a contiguous prefix block to a contiguous SID index range
 *  - install-prefix-sid-for-best-route installs mapped SIDs into the forwarding table
 *  - ldp-stitching enables seamless label swap between LDP and SR label spaces
 *  - Only P routers (route-reflectors) run the mapping server; PEs consume via sr-mapping-client in LDP
 *  - This enables a gradual SR migration: add SR nodes without breaking LDP-only forwarding
 *
 * Pair with:
 *  - evo/transport/ldp-sr-coexistence.conf  (LDP with sr-mapping-client on the consumer side)
 *  - evo/transport/ospf-sr-lfa.conf         (OSPF SR config referencing mapping-server name)
 *
 * Variables (example values from p1_ptx10003):
 *   $MAPPING_NAME        e.g. ospf-mapping-server
 *   $RANGE_NAME          e.g. ldp-lo1
 *   $START_PREFIX         e.g. 4.4.4.4/32
 *   $START_INDEX          e.g. 1000
 *   $SIZE                 e.g. 10
 */

routing-options {
    source-packet-routing {
        mapping-server-entry $MAPPING_NAME {
            prefix-segment-range $RANGE_NAME {
                start-prefix $START_PREFIX;
                start-index $START_INDEX;
                size $SIZE;
            }
        }
    }
}

/* Reference in OSPF source-packet-routing (same device): */

protocols {
    ospf {
        source-packet-routing {
            mapping-server $MAPPING_NAME;
            install-prefix-sid-for-best-route;
            ldp-stitching;
        }
    }
}
```

## junos/bootstrap/chassis-network-services.conf

```
/*
 * Topic:   Chassis network-services and aggregated-device count (platform bootstrap)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - aggregated-devices ethernet device-count sets the maximum number of ae interfaces
 *  - Must be configured before any ae interface can be created (platform pre-requisite)
 *  - network-services enhanced-ip (EVO only) enables the enhanced-IP forwarding mode
 *  - enhanced-ip required for EVPN/MPLS services on EVO platforms (vs default ethernet mode)
 *  - Junos MX platforms use per-FPC pic-mode flexible-ethernet-services instead (not shown here)
 *
 * Variables (example values from wanedge3_acx7509):
 *   $DEVICE_COUNT       e.g. 25
 */

/* EVO variant (includes network-services enhanced-ip): */

chassis {
    aggregated-devices {
        ethernet {
            device-count $DEVICE_COUNT;
        }
    }
    network-services enhanced-ip;
}

/* Junos variant (no network-services line needed): */

chassis {
    aggregated-devices {
        ethernet {
            device-count $DEVICE_COUNT;
        }
    }
}
```

## junos/cos/classifier-dscp-exp-8021p.conf

```
/*
 * Topic:   Multi-field BA classifiers (DSCP, MPLS EXP, 802.1p → 8-class forwarding)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - 8 forwarding classes: BEST-EFFORT, LOW, MEDIUM, SIG-OAM, BUSINESS, REALTIME, NETWORK, CONTROL
 *  - DSCP classifier used on customer-facing access interfaces (ingress from CE)
 *  - EXP classifier used on core-facing MPLS interfaces (trust MPLS marking from peer PE)
 *  - 802.1p (ieee-802.1) classifier used on VLAN-tagged service AC units
 *  - loss-priority high on some code-points triggers WRED (drop-profile dp2) earlier under congestion
 *
 * Pair with:
 *  - junos/cos/forwarding-class-map.conf  (the queue-num mapping these classifiers feed into)
 *  - junos/cos/rewrite-rules-exp.conf     (EXP rewrite on egress core interfaces)
 *
 * Variables:
 *   (none — classifier names and mappings are static in this JVD)
 */

class-of-service {
    classifiers {
        dscp DSCP {
            forwarding-class BEST-EFFORT {
                loss-priority low code-points be;
            }
            forwarding-class BUSINESS {
                loss-priority low code-points [ cs4 af41 ];
            }
            forwarding-class CONTROL {
                loss-priority low code-points cs7;
            }
            forwarding-class LOW {
                loss-priority low code-points [ cs1 af11 ];
            }
            forwarding-class MEDIUM {
                loss-priority high code-points [ cs2 af21 ];
            }
            forwarding-class NETWORK {
                loss-priority low code-points cs6;
            }
            forwarding-class REALTIME {
                loss-priority low code-points [ cs5 ef ];
            }
            forwarding-class SIG-OAM {
                loss-priority low code-points [ cs3 af31 ];
            }
        }
        exp EXP {
            forwarding-class BEST-EFFORT {
                loss-priority high code-points 000;
            }
            forwarding-class BUSINESS {
                loss-priority high code-points 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-points 111;
            }
            forwarding-class LOW {
                loss-priority low code-points 001;
            }
            forwarding-class MEDIUM {
                loss-priority high code-points 010;
            }
            forwarding-class NETWORK {
                loss-priority low code-points 110;
            }
            forwarding-class REALTIME {
                loss-priority low code-points 101;
            }
            forwarding-class SIG-OAM {
                loss-priority high code-points 011;
            }
        }
        ieee-802.1 8021P {
            forwarding-class BEST-EFFORT {
                loss-priority high code-points 000;
            }
            forwarding-class BUSINESS {
                loss-priority high code-points 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-points 111;
            }
            forwarding-class LOW {
                loss-priority low code-points 001;
            }
            forwarding-class MEDIUM {
                loss-priority high code-points 010;
            }
            forwarding-class NETWORK {
                loss-priority low code-points 110;
            }
            forwarding-class REALTIME {
                loss-priority low code-points 101;
            }
            forwarding-class SIG-OAM {
                loss-priority high code-points 011;
            }
        }
    }
}
```

## junos/cos/forwarding-class-map.conf

```
/*
 * Topic:   Forwarding-class to queue-number mapping (8-class CoS model)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - Maps 8 named forwarding classes to hardware queue numbers 0-7
 *  - CONTROL (q7) and NETWORK (q6) are typically strict-priority (not shown here)
 *  - REALTIME (q5) is usually strict-priority or low-latency for voice/video
 *  - BEST-EFFORT (q0) gets remaining bandwidth after priority queues are served
 *  - drop-profiles dp1/dp2 implement WRED at different aggressiveness for congestion management
 *
 * Pair with:
 *  - junos/cos/classifier-dscp-exp-8021p.conf  (classifiers that feed these queues)
 *  - junos/cos/rewrite-rules-exp.conf          (marking on egress)
 *
 * Variables:
 *   (none — queue mapping is static in this JVD)
 */

class-of-service {
    drop-profiles {
        dp1 {
            fill-level 40 drop-probability 0;
            fill-level 50 drop-probability 70;
        }
        dp2 {
            fill-level 10 drop-probability 0;
            fill-level 30 drop-probability 30;
        }
    }
    forwarding-classes {
        class BEST-EFFORT queue-num 0;
        class BUSINESS queue-num 4;
        class CONTROL queue-num 7;
        class LOW queue-num 1;
        class MEDIUM queue-num 2;
        class NETWORK queue-num 6;
        class REALTIME queue-num 5;
        class SIG-OAM queue-num 3;
    }
}
```

## junos/cos/rewrite-rules-exp.conf

```
/*
 * Topic:   EXP rewrite rule and per-interface CoS binding (core egress marking)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - EXP rewrite marks MPLS packets on core egress with the correct EXP value per queue
 *  - Applied to core-facing interfaces (et-*, ae2) so peer P/PE routers trust the marking
 *  - Access-facing interfaces (xe-*, ae0) get 802.1p classifiers on ingress instead
 *  - Interface-level CoS binding ties classifier (ingress) and rewrite (egress) to specific units
 *
 * Pair with:
 *  - junos/cos/classifier-dscp-exp-8021p.conf  (the classifiers referenced in interface bindings)
 *  - junos/interfaces/physical-uplink-mpls.conf (the core interfaces these rewrites apply to)
 *  - junos/cos/forwarding-class-map.conf
 *
 * Variables (example values from wanedge1_mx304):
 *   $CORE_INTF          e.g. et-0/0/1
 *   $ACCESS_INTF        e.g. xe-0/0/9:0
 *   $UNIT               e.g. 0
 *   $REWRITE_NAME       e.g. EXP-REWRITE
 *   $CLASSIFIER_NAME    e.g. EXP / 8021P
 */

class-of-service {
    interfaces {
        $CORE_INTF {
            unit 0 {
                classifiers {
                    exp $CLASSIFIER_NAME;
                }
                rewrite-rules {
                    exp $REWRITE_NAME;
                }
            }
        }
        $ACCESS_INTF {
            unit $UNIT {
                classifiers {
                    ieee-802.1 8021P;
                }
            }
        }
    }
}
```

## junos/ddos-mitigation/flowspec-routes.conf

```
/*
 * Topic:   BGP FlowSpec enablement for dynamic DDoS mitigation
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - Enabled via family inet { flow; } in the iBGP group configuration
 *  - Allows a controller/RR to inject RFC 5575 FlowSpec routes dynamically
 *  - FlowSpec routes install firewall filters in hardware without CLI configuration
 *  - Provides real-time DDoS mitigation by matching and dropping/rate-limiting attack traffic
 *  - The static firewall filters (filter-ipv4-stateless) are the manual equivalent
 *  - No static flowspec-routes are configured; all injection is via BGP from the RR
 *
 * Pair with:
 *  - junos/transport/bgp-ibgp-evpn.conf         (BGP group with family inet flow enabled)
 *  - junos/firewall/filter-ipv4-stateless.conf   (static equivalent for manual PBR)
 *
 * Variables:
 *   (none — enablement is via BGP family; routes are dynamically injected)
 */

/* FlowSpec is enabled in the BGP group: */

protocols {
    bgp {
        group ibgp {
            family inet {
                unicast;
                flow;   /* ← This enables FlowSpec route reception */
            }
        }
    }
}

/* FlowSpec routes are injected by an external controller or RR peer.
 * When received, they automatically install as:
 *   - firewall filter terms matching the flow-spec NLRI fields
 *   - actions per the extended-community (rate-limit, discard, redirect, mark)
 *
 * Verify with: show route table inetflow.0
 */
```

## junos/firewall/filter-ipv4-stateless.conf

```
/*
 * Topic:   IPv4 stateless firewall filter (PBR with next-ip/next-interface)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - Stateless filters match on L3/L4 fields (src/dst address, src/dst port, protocol)
 *  - Actions redirect traffic via next-ip (policy-based routing to specific next-hop)
 *  - Or next-interface (steer to a specific egress interface regardless of FIB)
 *  - count action provides per-filter hit statistics for monitoring/debugging
 *  - These filters are applied to interfaces for traffic steering / DDoS mitigation
 *
 * Pair with:
 *  - junos/ddos-mitigation/flowspec-routes.conf  (dynamic version via BGP FlowSpec)
 *
 * Variables (example values from wanedge1_mx304):
 *   $FILTER_NAME        e.g. filter_ip_dport1
 *   $PROTOCOL           e.g. tcp
 *   $MATCH_FIELD        e.g. destination-port 80 / source-address 222.222.2.100/32
 *   $DST_PORT           e.g. 80
 *   $NEXT_HOP           e.g. 192.168.56.2/32
 *   $NEXT_INTF          e.g. et-0/0/1
 */

firewall {
    family inet {
        filter $FILTER_NAME {
            term 1 {
                from {
                    protocol $PROTOCOL;
                    destination-port $DST_PORT;
                }
                then {
                    count $FILTER_NAME;
                    next-ip $NEXT_HOP;
                }
            }
        }
    }
}
```

## junos/interfaces/irb-gateway.conf

```
/*
 * Topic:   IRB gateway interface (per-VRF L3 address for EVPN Type-5 routing)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - Each IRB unit provides the default gateway for one bridge domain / MAC-VRF VLAN
 *  - Unit number typically matches the VLAN-ID and routing-instance index for traceability
 *  - Bound to both an EVPN ELAN instance (L2) and a VRF instance (L3 ip-prefix-routes)
 *  - Address is the anycast gateway or per-PE unique address depending on design
 *  - Scale: ~350 IRB units per WAN edge in this JVD (one per VRF)
 *
 * Pair with:
 *  - junos/services/evpn-elan-vlan-based-irb.conf  (ELAN instance referencing routing-interface irb.$UNIT)
 *  - junos/services/evpn-vrf-ip-prefix.conf (VRF instance referencing interface irb.$UNIT)
 *
 * Variables (example values from wanedge1_mx304):
 *   $UNIT               e.g. 100
 *   $IPV4_ADDRESS       e.g. 100.100.100.1/24
 */

interfaces {
    irb {
        unit $UNIT {
            family inet {
                address $IPV4_ADDRESS;
            }
        }
    }
}
```

## junos/interfaces/lag-flexible-services.conf

```
/*
 * Topic:   LAG with flexible VLAN services (multi-service bundle for VPWS/ELAN ACs)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - flexible-vlan-tagging + encapsulation flexible-ethernet-services allows mixed AC types per unit
 *  - Units can be vlan-ccc (VPWS), vlan-bridge (ELAN), or standard IP on the same ae interface
 *  - LACP active with fast periodic (1s) and fast-failover for sub-second link recovery
 *  - link-protection revertive provides automatic revert after member-link failure clears
 *  - system-id must match across multi-homed PEs sharing the same ESI for the LAG
 *  - Scale: ae0 carries ~2500+ units (VPWS + ELAN) in this JVD
 *
 * Pair with:
 *  - junos/interfaces/vlan-ccc-esi.conf    (per-unit VPWS AC config on this LAG)
 *  - junos/interfaces/vlan-bridge.conf     (per-unit ELAN AC config on this LAG)
 *  - junos/services/evpn-vpws-vlan-based.conf     (VPWS instances binding vlan-ccc units)
 *  - junos/services/evpn-fxc-vlan-aware.conf      (FXC instances referencing ae0.* units)
 *  - junos/services/evpn-elan-vlan-based.conf     (ELAN instances binding vlan-bridge units)
 *  - junos/services/evpn-elan-vlan-based-irb.conf (ELAN+IRB instances binding vlan-bridge units)
 *  - junos/transport/forwarding-options-hash.conf
 *
 * Variables (example values from wanedge1_mx304):
 *   $LAG_INTF           e.g. ae0
 *   $DESCRIPTION        e.g. PE1 to CE1
 *   $LACP_SYSTEM_ID     e.g. 00:00:00:01:01:01
 */

interfaces {
    $LAG_INTF {
        description "$DESCRIPTION";
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            lacp {
                active;
                periodic fast;
                fast-failover;
                link-protection {
                    revertive;
                }
                system-id $LACP_SYSTEM_ID;
            }
        }
    }
}
```

## junos/interfaces/loopback.conf

```
/*
 * Topic:   Loopback interface (router-id, BGP source, MPLS label binding)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - /32 address serves as router-id, OSPF passive interface, and BGP local-address
 *  - family mpls required for the loopback to be a valid MPLS endpoint (SR node-SID target)
 *  - lo0.0 appears in OSPF area 0 as passive, MPLS interface list, and LDP interface list
 *  - The loopback IP is used as the route-distinguisher prefix for all service instances
 *
 * Pair with:
 *  - junos/transport/ospf-sr-lfa.conf     (lo0.0 as passive OSPF interface)
 *  - junos/transport/bgp-ibgp-evpn.conf   (lo0.0 IP as BGP local-address)
 *
 * Variables (example values from wanedge1_mx304):
 *   $LOOPBACK_V4        e.g. 2.2.2.2/32
 */

interfaces {
    lo0 {
        unit 0 {
            family inet {
                address $LOOPBACK_V4;
            }
            family mpls;
        }
    }
}
```

## junos/interfaces/physical-uplink-mpls.conf

```
/*
 * Topic:   Physical core uplink with MPLS and IPv4 (WAN backbone interface)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - Core-facing interfaces carry both family inet (OSPF hello/routing) and family mpls (label switching)
 *  - May be a direct physical port (et-*) or a LAG (ae2) depending on topology
 *  - Point-to-point link addressing (/24 or /30) — no VLAN tagging on core links
 *  - These interfaces appear in OSPF area 0, MPLS interface list, and optionally LDP/RSVP
 *  - On Junos MX, member links use gigether-options { 802.3ad }; on EVO they use ether-options
 *
 * Pair with:
 *  - junos/transport/ospf-sr-lfa.conf  (OSPF config referencing these interfaces)
 *  - junos/transport/mpls-lsp.conf     (MPLS enablement on these interfaces)
 *  - junos/cos/rewrite-rules-exp.conf
 *
 * Variables (example values from wanedge1_mx304):
 *   $INTF               e.g. ae2 / et-0/0/1
 *   $DESCRIPTION        e.g. CE1 to PE1/2 / Link from WAN Edge1 to WAN Edge2
 *   $IPV4_ADDRESS       e.g. 192.168.12.1/24
 */

interfaces {
    $INTF {
        description "$DESCRIPTION";
        unit 0 {
            family inet {
                address $IPV4_ADDRESS;
            }
            family mpls;
        }
    }
}

/* LAG variant with LACP (ae2 on wanedge1): */

interfaces {
    $INTF {
        description "$DESCRIPTION";
        aggregated-ether-options {
            lacp {
                active;
                periodic fast;
            }
        }
        unit 0 {
            family inet {
                address $IPV4_ADDRESS;
            }
            family mpls;
        }
    }
}
```

## junos/interfaces/vlan-bridge.conf

```
/*
 * Topic:   ELAN attachment-circuit (vlan-bridge encapsulation)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - encapsulation vlan-bridge carries L2 multipoint ELAN traffic
 *  - No ESI needed — bridging semantics don't require per-unit multi-homing
 *    (the parent LAG ESI handles it at the bundle level)
 *  - No family statement — bridging is implied by the encapsulation
 *  - Scale: ~1000 vlan-bridge units per ae0 in this JVD
 *
 * Pair with:
 *  - junos/interfaces/lag-flexible-services.conf  (the parent ae interface)
 *  - junos/services/evpn-elan-vlan-based.conf     (ELAN instances binding these units)
 *  - junos/services/evpn-elan-vlan-based-irb.conf (ELAN+IRB instances binding these units)
 *
 * Variables (example values from wanedge1_mx304):
 *   $LAG_INTF           e.g. ae0
 *   $UNIT               e.g. 2001
 *   $VLAN_ID            e.g. 2001
 */

interfaces {
    $LAG_INTF {
        unit $UNIT {
            encapsulation vlan-bridge;
            vlan-id $VLAN_ID;
        }
    }
}
```

## junos/interfaces/vlan-ccc-esi.conf

```
/*
 * Topic:   VPWS attachment-circuit (vlan-ccc with ESI all-active multi-homing)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - encapsulation vlan-ccc carries point-to-point VPWS traffic
 *  - ESI with all-active enables per-flow multi-homing across PE pairs
 *  - ESI is a 10-byte identifier — must be identical on both multi-homed PEs
 *  - family ccc is required for circuit cross-connect semantics
 *  - Scale: ~1500 vlan-ccc units per ae0 in this JVD
 *
 * Pair with:
 *  - junos/interfaces/lag-flexible-services.conf  (the parent ae interface)
 *  - junos/services/evpn-vpws-vlan-based.conf     (instances binding these vlan-ccc units)
 *  - junos/services/evpn-fxc-vlan-aware.conf      (FXC instances binding these units)
 *  - junos/oam/cfm-maintenance-domain.conf
 *
 * Variables (example values from wanedge1_mx304):
 *   $LAG_INTF           e.g. ae0
 *   $UNIT               e.g. 1
 *   $VLAN_ID            e.g. 1
 *   $ESI                e.g. 00:12:12:12:12:12:12:12:11:01
 */

interfaces {
    $LAG_INTF {
        unit $UNIT {
            encapsulation vlan-ccc;
            vlan-id $VLAN_ID;
            esi {
                $ESI;
                all-active;
            }
            family ccc;
        }
    }
}
```

## junos/oam/cfm-maintenance-domain.conf

```
/*
 * Topic:   CFM maintenance domain with continuity-check MEP (802.1ag OAM)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - IEEE 802.1ag Connectivity Fault Management for per-service MPLS/EVPN path monitoring
 *  - Level 3 maintenance-domain — typical for provider-edge to provider-edge monitoring
 *  - Continuity-check at 1s interval detects forwarding failures within ~3.5s (3.5× interval)
 *  - MEP direction "up" monitors the MPLS/EVPN path toward the remote PE (not the local CE)
 *  - auto-discovery enables automatic remote-MEP detection without static peer configuration
 *  - Scale: one maintenance-domain per monitored service instance (hundreds in this JVD)
 *
 * Pair with:
 *  - junos/oam/cfm-sla-iterator.conf          (performance measurement on these MEPs)
 *  - junos/interfaces/vlan-ccc-esi.conf        (the AC interfaces referenced by MEPs)
 *
 * Variables (example values from wanedge1_mx304):
 *   $MD_NAME            e.g. m-d301
 *   $MD_LEVEL           e.g. 3
 *   $MA_NAME            e.g. m-a301
 *   $MEP_ID             e.g. 1
 *   $MEP_INTF           e.g. xe-0/0/9:0.301
 *   $CC_INTERVAL        e.g. 1s
 */

protocols {
    oam {
        ethernet {
            connectivity-fault-management {
                maintenance-domain $MD_NAME {
                    level $MD_LEVEL;
                    name-format character-string;
                    maintenance-association $MA_NAME {
                        short-name-format character-string;
                        continuity-check {
                            interval $CC_INTERVAL;
                        }
                        mep $MEP_ID {
                            interface $MEP_INTF;
                            direction up;
                            auto-discovery;
                        }
                    }
                }
            }
        }
    }
}
```

## junos/oam/cfm-sla-iterator.conf

```
/*
 * Topic:   CFM enhanced SLA iterator (two-way delay and synthetic loss measurement)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - enhanced-sla-iterator enables hardware-timestamped performance measurement
 *  - measurement-interval 5 (minutes) sets the reporting/aggregation window
 *  - two-way-delay profile measures round-trip latency between MEP pairs
 *  - slm (Synthetic Loss Measurement) profile detects frame loss without service disruption
 *  - Profiles are referenced by iterator configurations bound to specific MEPs (not shown)
 *  - Requires CFM maintenance-domains to be configured first
 *
 * Pair with:
 *  - junos/oam/cfm-maintenance-domain.conf  (the MEPs these measurements run against)
 *
 * Variables (example values from wanedge1_mx304):
 *   $PROFILE_DELAY      e.g. i1
 *   $PROFILE_SLM        e.g. i2
 *   $INTERVAL           e.g. 5
 */

protocols {
    oam {
        ethernet {
            connectivity-fault-management {
                performance-monitoring {
                    enhanced-sla-iterator;
                    measurement-interval $INTERVAL;
                    sla-iterator-profiles {
                        $PROFILE_DELAY {
                            measurement-type two-way-delay;
                        }
                        $PROFILE_SLM {
                            measurement-type slm;
                        }
                    }
                }
            }
        }
    }
}
```

## junos/policy/per-packet-load-balance.conf

```
/*
 * Topic:   Per-packet load-balance and BGP redistribution policies
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - pplb policy enables per-flow ECMP across equal-cost BGP/IGP paths
 *  - Applied via routing-options { forwarding-table { export pplb; } }
 *  - Term 1 specifically matches family evpn for EVPN multipath load-balancing
 *  - Default term applies per-packet to all other families (inet, mpls, etc.)
 *  - send-direct redistributes directly-connected routes into BGP for loopback reachability
 *  - bgp-to-ospf redistributes BGP routes into OSPF (used in multi-area designs)
 *
 * Pair with:
 *  - junos/transport/bgp-ibgp-evpn.conf           (BGP sessions using send-direct export)
 *  - junos/transport/forwarding-options-hash.conf  (hash-key that pplb distributes across)
 *
 * Variables:
 *   (none — policy names and logic are static in this JVD)
 */

policy-options {
    policy-statement pplb {
        term 1 {
            from family evpn;
            then {
                load-balance per-packet;
                accept;
            }
        }
        then {
            load-balance per-packet;
            accept;
        }
    }
    policy-statement send-direct {
        term 1 {
            from protocol direct;
            then accept;
        }
    }
    policy-statement bgp-to-ospf {
        from protocol bgp;
        then accept;
    }
}

/* Applied in routing-options: */

routing-options {
    forwarding-table {
        export pplb;
    }
}
```

## junos/services/evpn-elan-vlan-based-irb.conf

```
/*
 * Topic:   EVPN-ELAN vlan-based with IRB gateway (L2+L3 integrated)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   (none — EVO uses mac-vrf; see evo/services/evpn-elan-vlan-based-irb.conf)
 *
 * Highlights:
 *  - Junos-specific: uses instance-type evpn with routing-interface
 *  - no-normalization preserves original VLAN tags through the bridge domain
 *  - encapsulation mpls explicitly sets EVPN/MPLS data-plane (vs VXLAN)
 *  - default-gateway do-not-advertise suppresses Type-5 default from this instance
 *  - vlan-id none allows multiple VLANs or untagged frames into the same bridge domain
 *  - The IRB interface is associated with a VRF instance for ip-prefix-route advertisement
 *
 * Pair with:
 *  - junos/interfaces/vlan-bridge.conf        (the vlan-bridge AC units on this LAG)
 *  - junos/interfaces/lag-flexible-services.conf (the parent ae interface)
 *  - junos/services/evpn-vrf-ip-prefix.conf   (the L3 VRF that binds to irb.$UNIT)
 *  - junos/interfaces/irb-gateway.conf        (IRB unit with anycast or per-PE addressing)
 *
 * JVD service mapping:
 *   525 instances across 4 WAN-edge devices
 *     wanedge1_mx304: 350
 *     wanedge2_mx10004: 325
 *     wanedge3_acx7509: 325
 *     wanedge4_acx7100-48l: 325
 *   Examples: elan_group_65_1_100100, elan_group_65_1_100101, elan_group_65_1_100102
 *
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME      e.g. emh_group_400_1999
 *   $AC_INTF            e.g. ae0.1999
 *   $IRB_UNIT           e.g. irb.1999
 *   $VLAN_ID            e.g. none
 *   $RD                 e.g. 22.22.22.22:1999
 *   $RT                 e.g. target:60525:1999
 */

routing-instances {
    $INSTANCE_NAME {
        instance-type evpn;
        protocols {
            evpn {
                no-normalization;
                encapsulation mpls;
                default-gateway do-not-advertise;
            }
        }
        vlan-id $VLAN_ID;
        routing-interface $IRB_UNIT;
        interface $AC_INTF;
        route-distinguisher $RD;
        vrf-target $RT;
    }
}
```

## junos/services/evpn-elan-vlan-based.conf

```
/*
 * Topic:   EVPN-ELAN vlan-based (L2 multipoint, no IRB)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   (none — EVO uses mac-vrf; see evo/services/evpn-elan-vlan-bundle.conf)
 *
 * Highlights:
 *  - Junos-specific: uses instance-type evpn (EVO uses mac-vrf instead)
 *  - Minimal ELAN: just protocols { evpn; } — no encapsulation or gateway knobs needed
 *  - Multiple ACs per instance for multi-homing or multi-site bridging
 *  - No IRB interface — pure L2 switching across the MPLS/EVPN fabric
 *  - Scale: ~500 ELAN instances per WAN edge in this JVD
 *
 * Pair with:
 *  - junos/interfaces/vlan-bridge.conf         (per-unit vlan-bridge AC config)
 *  - junos/interfaces/lag-flexible-services.conf  (the parent ae interface)
 *
 * JVD service mapping:
 *   1925 instances across 4 WAN-edge devices
 *     wanedge1_mx304: 1225
 *     wanedge2_mx10004: 1200
 *     wanedge3_acx7509: 1200
 *     wanedge4_acx7100-48l: 1200
 *   Examples: elan_group_500_2001, elan_group_500_2003, elan_group_500_2005
 *
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME      e.g. elan_group_500_2001
 *   $AC_INTF_1          e.g. ae0.2001
 *   $AC_INTF_2          e.g. ae0.2002
 *   $RD                 e.g. 22.22.22.22:2001
 *   $RT                 e.g. target:62525:2001
 */

routing-instances {
    $INSTANCE_NAME {
        instance-type evpn;
        protocols {
            evpn;
        }
        interface $AC_INTF_1;
        interface $AC_INTF_2;
        route-distinguisher $RD;
        vrf-target $RT;
    }
}
```

## junos/services/evpn-fxc-vlan-aware.conf

```
/*
 * Topic:   EVPN FXC vlan-aware (Flexible Cross-Connect, multi-AC)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - Multi-homed VPWS carrying 2+ VLANs per instance via flexible-cross-connect-vlan-aware
 *  - Each AC interface gets its own vpws-service-id pair (local/remote must be swapped on the far end)
 *  - All ACs share a single RD and RT; the service-id disambiguates circuits within the instance
 *  - Scale: ~500 FXC instances per WAN edge in this JVD
 *
 * Pair with:
 *  - junos/interfaces/lag-flexible-services.conf  (the ae0 bundle carrying these ACs)
 *  - junos/interfaces/vlan-ccc-esi.conf           (per-AC unit config on ae0)
 *
 * JVD service mapping:
 *   1800 instances across 4 WAN-edge devices
 *     wanedge1_mx304: 1500
 *     wanedge2_mx10004: 1500
 *     wanedge3_acx7509: 1500
 *     wanedge4_acx7100-48l: 1500
 *   Examples: vfxc_group_40_1001, vfxc_group_40_1003, vfxc_group_40_1005
 *
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME      e.g. vfxc_group_40_1001
 *   $AC_INTF_1          e.g. ae0.1001
 *   $AC_INTF_2          e.g. ae0.1002
 *   $LOCAL_ID_1         e.g. 2
 *   $REMOTE_ID_1        e.g. 1
 *   $LOCAL_ID_2         e.g. 21
 *   $REMOTE_ID_2        e.g. 11
 *   $RD                 e.g. 22.22.22.22:1001
 *   $RT                 e.g. target:65000:1001
 */

routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_INTF_1 {
                    vpws-service-id {
                        local $LOCAL_ID_1;
                        remote $REMOTE_ID_1;
                    }
                }
                interface $AC_INTF_2 {
                    vpws-service-id {
                        local $LOCAL_ID_2;
                        remote $REMOTE_ID_2;
                    }
                }
                flexible-cross-connect-vlan-aware;
            }
        }
        interface $AC_INTF_1;
        interface $AC_INTF_2;
        route-distinguisher $RD;
        vrf-target $RT;
    }
}
```

## junos/services/evpn-vpws-vlan-based.conf

```
/*
 * Topic:   EVPN-VPWS vlan-based point-to-point pseudowire (single AC, control-word)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - Single AC interface, one vpws-service-id pair, control-word enabled
 *  - control-word ensures correct sequencing and prevents fat-pipe reordering issues
 *  - local/remote IDs must be mirror-swapped on the PE peer (local 10 ↔ remote 40)
 *  - Scale: ~1000 VPWS instances per WAN edge in this JVD
 *
 * Pair with:
 *  - junos/interfaces/vlan-ccc-esi.conf        (the per-unit AC config on the LAG interface)
 *  - junos/interfaces/lag-flexible-services.conf (the parent ae interface)
 *
 * JVD service mapping:
 *   1800 instances across 4 WAN-edge devices
 *     wanedge1_mx304: 1500
 *     wanedge2_mx10004: 1500
 *     wanedge3_acx7509: 1500
 *     wanedge4_acx7100-48l: 1500
 *   Examples: vfxc_group_40_1001, vfxc_group_40_1003, vfxc_group_40_1005
 *
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME      e.g. vpws_group_14_1
 *   $AC_INTF            e.g. xe-0/0/9:0.1
 *   $LOCAL_ID           e.g. 10
 *   $REMOTE_ID          e.g. 40
 *   $RD                 e.g. 2.2.2.2:141
 *   $RT                 e.g. target:63535:141
 */

routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_INTF {
                    vpws-service-id {
                        local $LOCAL_ID;
                        remote $REMOTE_ID;
                    }
                }
                control-word;
            }
        }
        interface $AC_INTF;
        route-distinguisher $RD;
        vrf-target $RT;
    }
}
```

## junos/services/evpn-vrf-ip-prefix.conf

```
/*
 * Topic:   EVPN IP-prefix route VRF (L3 VPN with EVPN Type-5 advertisement)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - L3 VRF that advertises connected IRB subnets as EVPN Type-5 ip-prefix routes
 *  - advertise direct-nexthop enables direct PE-to-PE forwarding (no recursive resolution)
 *  - encapsulation mpls sets the data-plane encap for inter-PE traffic
 *  - vrf-table-label allocates a per-VRF MPLS label for ingress lookup
 *  - Each VRF binds one IRB interface — the IRB lives in a corresponding ELAN bridge domain
 *  - Scale: ~350 VRF instances per WAN edge in this JVD
 *
 * Pair with:
 *  - junos/services/evpn-elan-vlan-based-irb.conf  (the bridge domain whose IRB feeds this VRF)
 *  - junos/interfaces/irb-gateway.conf      (IRB unit addressing)
 *
 * JVD service mapping:
 *   350 instances across 4 WAN-edge devices
 *     wanedge1_mx304: 350
 *     wanedge2_mx10004: 325
 *     wanedge3_acx7509: 325
 *     wanedge4_acx7100-48l: 350
 *   Examples: evpn_100, evpn_101, evpn_102
 *
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME      e.g. evpn_100
 *   $ROUTER_ID          e.g. 2.2.2.2
 *   $IRB_UNIT           e.g. irb.100
 *   $RD                 e.g. 60202:100
 *   $RT                 e.g. target:60303:100
 */

routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            router-id $ROUTER_ID;
        }
        protocols {
            evpn {
                ip-prefix-routes {
                    advertise direct-nexthop;
                    encapsulation mpls;
                }
            }
        }
        interface $IRB_UNIT;
        route-distinguisher $RD;
        vrf-target $RT;
        vrf-table-label;
    }
}
```

## junos/transport/bgp-ibgp-evpn.conf

```
/*
 * Topic:   iBGP overlay with EVPN signaling (route-reflector client config)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - Full-mesh iBGP to route-reflectors (3.3.3.3 / 6.6.6.6 are RRs in this JVD)
 *  - family evpn signaling enables EVPN Type-1 through Type-5 route exchange
 *  - family inet flow enables BGP FlowSpec for DDoS mitigation
 *  - advertise-external (Junos) allows external routes to be re-advertised to iBGP peers
 *  - BFD at 100ms × 3 for sub-second peer failure detection
 *  - multipath enables BGP multipath for ECMP across RRs
 *
 * Pair with:
 *  - junos/policy/per-packet-load-balance.conf  (the pplb policy applied via forwarding-table export)
 *  - junos/transport/ospf-sr-lfa.conf           (the IGP underlay these sessions ride over)
 *  - junos/ddos-mitigation/flowspec-routes.conf
 *  - junos/interfaces/loopback.conf
 *
 * Variables (example values from wanedge1_mx304):
 *   $LOCAL_ADDRESS      e.g. 2.2.2.2
 *   $LOCAL_AS           e.g. 64512
 *   $RR_PEER_1          e.g. 3.3.3.3
 *   $RR_PEER_2          e.g. 6.6.6.6
 */

protocols {
    bgp {
        family inet {
            unicast {
                loops 2;
            }
        }
        group ibgp {
            type internal;
            local-address $LOCAL_ADDRESS;
            advertise-external;
            family inet {
                unicast;
                flow;
            }
            family evpn {
                signaling;
            }
            export send-direct;
            local-as $LOCAL_AS;
            multipath;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor $RR_PEER_1;
            neighbor $RR_PEER_2;
        }
    }
}
```

## junos/transport/forwarding-options-hash.conf

```
/*
 * Topic:   Forwarding hash-key configuration for ECMP and LAG load distribution
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l
 *
 * Highlights:
 *  - Controls which header fields the forwarding plane uses for ECMP/LAG hashing
 *  - inet/inet6: layer-3 + layer-4 includes src/dst IP AND TCP/UDP ports for finer distribution
 *  - multiservice: source-mac + destination-mac for L2 frames without IP headers
 *  - Without this, default hash may only use L3 headers, causing polarization on LAG/ECMP
 *  - Critical for WAN edges carrying thousands of pseudowires over a small number of ECMP paths
 *
 * Pair with:
 *  - junos/interfaces/lag-flexible-services.conf  (the LAG benefiting from this hash)
 *  - junos/transport/ospf-sr-lfa.conf             (ECMP paths this hash distributes across)
 *  - junos/policy/per-packet-load-balance.conf
 *
 * Variables:
 *   (none — this stanza is static)
 */

forwarding-options {
    hash-key {
        family inet {
            layer-3;
            layer-4;
        }
        family inet6 {
            layer-3;
            layer-4;
        }
        family multiservice {
            source-mac;
            destination-mac;
        }
    }
}
```

## junos/transport/mpls-lsp.conf

```
/*
 * Topic:   MPLS label-switched paths (RSVP-less static LSP definitions)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   wanedge3_acx7509 wanedge4_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - traffic-engineering enables MPLS-TE database population from IGP
 *  - label-switched-path entries define egress PE targets for RSVP or SR-TE tunnels
 *  - In this JVD, LSPs are minimal (to destination only) — no explicit-path or bandwidth
 *  - All core-facing interfaces and lo0.0 must be MPLS-enabled
 *  - These LSPs serve as the transport tunnel for EVPN overlay traffic
 *
 * Pair with:
 *  - junos/transport/ospf-sr-lfa.conf    (the SR underlay that resolves these LSPs)
 *  - junos/transport/rsvp-te.conf        (RSVP signaling if used — wanedge2 only)
 *  - junos/interfaces/physical-uplink-mpls.conf
 *
 * Variables (example values from wanedge1_mx304):
 *   $LSP_NAME_1         e.g. lsp_to_pe3
 *   $LSP_DEST_1         e.g. 4.4.4.4
 *   $LSP_NAME_2         e.g. lsp_to_pe4
 *   $LSP_DEST_2         e.g. 7.7.7.7
 *   $CORE_INTF_1        e.g. ae2.0
 */

protocols {
    mpls {
        traffic-engineering;
        label-switched-path $LSP_NAME_1 {
            to $LSP_DEST_1;
        }
        label-switched-path $LSP_NAME_2 {
            to $LSP_DEST_2;
        }
        interface $CORE_INTF_1;
        interface lo0.0;
    }
}
```

## junos/transport/ospf-sr-lfa.conf

```
/*
 * Topic:   OSPF with Segment Routing and TI-LFA (post-convergence node protection)
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO:   p1_ptx10003 p2_ptx10001-36mr
 *
 * Highlights:
 *  - source-packet-routing enables OSPF Segment Routing with node-segment index allocation
 *  - SRGB 16000–24000 must be consistent across all SR-capable nodes in the domain
 *  - backup-spf-options with use-post-convergence-lfa enables TI-LFA (Topology-Independent LFA)
 *  - maximum-labels 8 allows up to 8 segment labels in the backup path (deep protection)
 *  - per-interface post-convergence-lfa { node-protection } activates node-protecting backup
 *  - ipv4-adjacency-segment { protected dynamic } assigns protected adj-SIDs for TE use
 *  - BFD at 10ms × 3 on core links for fast failure detection
 *
 * Pair with:
 *  - junos/transport/mpls-lsp.conf              (LSPs that ride over this SR underlay)
 *  - junos/transport/bgp-ibgp-evpn.conf         (iBGP sessions using this IGP's loopbacks)
 *  - junos/interfaces/loopback.conf
 *  - junos/interfaces/physical-uplink-mpls.conf
 *  - junos/transport/forwarding-options-hash.conf
 *  - junos/transport/rsvp-te.conf
 *
 * Variables (example values from wanedge1_mx304):
 *   $NODE_SEGMENT_INDEX e.g. 102
 *   $SRGB_START         e.g. 16000
 *   $SRGB_RANGE         e.g. 8000
 *   $CORE_INTF_1        e.g. ae2.0
 *   $CORE_INTF_2        e.g. et-0/0/1.0
 */

protocols {
    ospf {
        backup-spf-options {
            use-post-convergence-lfa {
                maximum-labels 8;
                maximum-backup-paths 5;
            }
            use-source-packet-routing;
        }
        traffic-engineering;
        source-packet-routing {
            node-segment ipv4-index $NODE_SEGMENT_INDEX;
            srgb start-label $SRGB_START index-range $SRGB_RANGE;
        }
        area 0.0.0.0 {
            interface $CORE_INTF_1 {
                interface-type p2p;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                post-convergence-lfa {
                    node-protection;
                }
                ipv4-adjacency-segment {
                    protected dynamic;
                }
            }
            interface $CORE_INTF_2 {
                interface-type p2p;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                post-convergence-lfa {
                    node-protection;
                }
                ipv4-adjacency-segment {
                    protected dynamic;
                }
            }
            interface lo0.0 {
                passive;
            }
        }
    }
}
```

## junos/transport/rsvp-te.conf

```
/*
 * Topic:   RSVP-TE interface enablement (signaled LSP protection)
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO:   (none)
 *
 * Highlights:
 *  - Only wanedge2 uses RSVP in this JVD; other PEs rely purely on SR for label distribution
 *  - "interface all" enables RSVP on every MPLS-capable interface (simple, broad enablement)
 *  - Combined with the mpls label-switched-path entries, provides RSVP-signaled backup paths
 *  - In mixed SR+RSVP deployments, RSVP LSPs can serve as explicit FRR bypass tunnels
 *
 * Pair with:
 *  - junos/transport/mpls-lsp.conf     (the LSPs that RSVP signals)
 *  - junos/transport/ospf-sr-lfa.conf  (SR coexists on the same OSPF domain)
 *
 * Variables:
 *   (none — this stanza is static)
 */

protocols {
    rsvp {
        interface all;
    }
}
```

## _variables.md

# Snip Variable Reference

Variables used across the `ewan_adv_core_edge` snip library. Replace `$VARIABLE` placeholders
with site-specific values when adapting snips to a new deployment.

## Interfaces

| Variable | Example | Used in |
|----------|---------|---------|
| `$CORE_INTF` | `et-0/0/1` | physical-uplink-mpls, rewrite-rules-exp |
| `$ACCESS_INTF` | `xe-0/0/9:0` | rewrite-rules-exp, vlan-ccc-esi |
| `$LAG_INTF` | `ae0` | lag-flexible-services |
| `$LAG_MEMBER` | `xe-0/0/9:0` | lag-flexible-services |
| `$UNIT` | `301` | vlan-ccc-esi, irb-gateway, rewrite-rules-exp |
| `$VLAN_ID` | `301` | vlan-ccc-esi, irb-gateway |
| `$LOOPBACK_IPV4` | `192.168.0.1/32` | loopback |
| `$LOOPBACK_IPV6` | `fd00::1/128` | loopback |
| `$IRB_IPV4` | `10.0.1.1/24` | irb-gateway |
| `$MTU` | `9192` | physical-uplink-mpls |

## Transport / Routing

| Variable | Example | Used in |
|----------|---------|---------|
| `$ROUTER_ID` | `192.168.0.1` | bgp-ibgp-evpn, ospf-sr-lfa |
| `$AS_NUMBER` | `65001` | bgp-ibgp-evpn |
| `$RR_PEER` | `192.168.0.100` | bgp-ibgp-evpn |
| `$AREA` | `0.0.0.0` | ospf-sr-lfa |
| `$SRGB_START` | `400000` | ospf-sr-lfa |
| `$SRGB_SIZE` | `4096` | ospf-sr-lfa |
| `$NODE_INDEX` | `1` | ospf-sr-lfa |
| `$LSP_NAME` | `to-wanedge2` | mpls-lsp |
| `$LSP_DESTINATION` | `192.168.0.2` | mpls-lsp |
| `$BW_MBPS` | `1000m` | rsvp-te |

## Services (EVPN / VPN)

| Variable | Example | Used in |
|----------|---------|---------|
| `$VPN_INSTANCE` | `vpws_group_14_1` | evpn-fxc-vlan-aware, evpn-vpws-vlan-based |
| `$RD` | `192.168.0.1:14001` | all services |
| `$RT_IMPORT` | `target:65001:14001` | all services |
| `$RT_EXPORT` | `target:65001:14001` | all services |
| `$LOCAL_ID` | `1` | evpn-fxc-vlan-aware, evpn-vpws-vlan-based |
| `$REMOTE_ID` | `2` | evpn-fxc-vlan-aware, evpn-vpws-vlan-based |
| `$FXC_INTF` | `lsi.*` | evpn-fxc-vlan-aware |
| `$ELAN_VNI` | `5001` | evpn-elan-vlan-based (if extended) |

## CoS / QoS

| Variable | Example | Used in |
|----------|---------|---------|
| `$REWRITE_NAME` | `EXP-REWRITE` | rewrite-rules-exp |
| `$CLASSIFIER_NAME` | `EXP` / `8021P` | rewrite-rules-exp |

## Firewall / Security

| Variable | Example | Used in |
|----------|---------|---------|
| `$FILTER_NAME` | `filter_ip_dport1` | filter-ipv4-stateless |
| `$PROTOCOL` | `tcp` | filter-ipv4-stateless |
| `$DST_PORT` | `80` | filter-ipv4-stateless |
| `$NEXT_HOP` | `192.168.56.2/32` | filter-ipv4-stateless |
| `$NEXT_INTF` | `et-0/0/1` | filter-ipv4-stateless |

## OAM (802.1ag CFM)

| Variable | Example | Used in |
|----------|---------|---------|
| `$MD_NAME` | `m-d301` | cfm-maintenance-domain |
| `$MD_LEVEL` | `3` | cfm-maintenance-domain |
| `$MA_NAME` | `m-a301` | cfm-maintenance-domain |
| `$MEP_ID` | `1` | cfm-maintenance-domain |
| `$MEP_INTF` | `xe-0/0/9:0.301` | cfm-maintenance-domain |
| `$CC_INTERVAL` | `1s` | cfm-maintenance-domain |
| `$PROFILE_DELAY` | `i1` | cfm-sla-iterator |
| `$PROFILE_SLM` | `i2` | cfm-sla-iterator |
| `$INTERVAL` | `5` | cfm-sla-iterator |

## Bootstrap / Platform

| Variable | Example | Used in |
|----------|---------|---------|
| `$DEVICE_COUNT` | `25` | chassis-network-services |

## byoai/TIERS.md

# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each service kind at each verbosity tier. It is bundled into [`jvd-ewan-ace-snips.md`](jvd-ewan-ace-snips.md) by `regenerate-bundle.sh`.

For each service kind, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. Use the OS-appropriate file under `junos/` or `evo/`.

---

## What the tiers mean

| Tier | Use when | What's included |
|---|---|---|
| **`minimum`** | Brownfield change. PE already has working OSPF/SR underlay AND iBGP EVPN overlay. You just want the new service. | Service routing-instance + AC interface unit(s) + parent LAG. **Nothing else.** |
| **`with-overlay`** | Brownfield-ish. PE has working underlay but you want to (re)assert the iBGP EVPN overlay activation. | `minimum` + `transport/bgp-ibgp-evpn.conf`. |
| **`as-deployed`** | Greenfield turn-up, lab build, or "give me a working example end-to-end." Mirrors what the JVD validates. | Everything: service + AC + overlay + OSPF/SR underlay + MPLS + LDP/SR coexistence + loopback + core uplink + hash + bootstrap + CoS + OAM + policy + firewall. |

> **Greenfield / bootstrap requests** (e.g. "build a new ACX7100-48L WAN-edge turn-up", "bootstrap a new MX304 PE end-to-end") are always treated as **`as-deployed`** regardless of the user's tier choice.

If the user picks `minimum` and the AI cannot tell whether the iBGP EVPN overlay is already on the PE, it should call that out in the `Notes:` section ("assumed `family evpn signaling` already active under `protocols bgp group RR-CLIENT`").

---

## Shared underlay (the `as-deployed` baseline for every service)

Every `as-deployed` service includes this common baseline. OS-select each file:

- `transport/bgp-ibgp-evpn.conf` — iBGP overlay to P1/P2 route reflectors (EVPN + inet flow families, BFD, multipath)
- `transport/ospf-sr-lfa.conf` — OSPF area 0 + Segment Routing + TI-LFA (WAN edges: Junos MX; P routers: EVO PTX)
- `transport/mpls-lsp.conf` — static MPLS LSPs with traffic-engineering
- `transport/forwarding-options-hash.conf` — ECMP/LAG hash keys
- `interfaces/loopback.conf` — /32 router-id + MPLS binding
- `interfaces/physical-uplink-mpls.conf` — core uplink (family inet + mpls, MTU 9192)
- `bootstrap/chassis-network-services.conf` — aggregated-devices count; **EVO also sets `network-services enhanced-ip` (REQUIRED for EVPN/MPLS)**
- `cos/classifier-dscp-exp-8021p.conf` + `cos/forwarding-class-map.conf` + `cos/rewrite-rules-exp.conf` — 8-class CoS
- `oam/cfm-maintenance-domain.conf` + `oam/cfm-sla-iterator.conf` — 802.1ag CFM + SLA
- `policy/per-packet-load-balance.conf` — pplb ECMP + send-direct
- `firewall/filter-ipv4-stateless.conf` — stateless L3/L4 filters
- `ddos-mitigation/flowspec-routes.conf` — BGP FlowSpec enablement

**OS-specific transport add-ons (as-deployed only):**
- EVO WAN edges (wanedge3/4) + P routers: `evo/transport/ldp-sr-coexistence.conf`
- P routers (p1/p2) only: `evo/transport/sr-mapping-server.conf`
- Junos wanedge2_mx10004 only: `junos/transport/rsvp-te.conf`

---

## EVPN-VPWS (vlan-based, MEF E-Line point-to-point)

**minimum** (just the service)
- `services/evpn-vpws-vlan-based.conf`
- `interfaces/vlan-ccc-esi.conf` (per-AC unit on the LAG)
- `interfaces/lag-flexible-services.conf` (parent ae0)

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-evpn.conf` (verify `family evpn signaling`)

**as-deployed** (= with-overlay + the shared underlay baseline above)

---

## EVPN-FXC vlan-aware (Flexible Cross-Connect, multi-AC)

**minimum** (just the service)
- `services/evpn-fxc-vlan-aware.conf`
- `interfaces/vlan-ccc-esi.conf` (one per bundled AC)
- `interfaces/lag-flexible-services.conf` (parent ae0)

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-evpn.conf`

**as-deployed** (= with-overlay + shared underlay baseline)

---

## EVPN-ELAN (L2 multipoint, no IRB)

Pick the OS-appropriate flavor:
- **Junos MX:** `junos/services/evpn-elan-vlan-based.conf` (instance-type evpn)
- **EVO ACX:** `evo/services/evpn-elan-vlan-bundle.conf` (mac-vrf, service-type vlan-bundle)

**minimum** (just the service)
- the flavor above
- `interfaces/vlan-bridge.conf` (per-AC vlan-bridge units)
- `interfaces/lag-flexible-services.conf` (parent ae0)

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-evpn.conf`

**as-deployed** (= with-overlay + shared underlay baseline)

---

## EVPN-ELAN with IRB (L2 + L3 integrated)

**minimum** (just the service)
- `services/evpn-elan-vlan-based-irb.conf` (Junos: instance-type evpn + routing-interface; EVO: mac-vrf + l3-interface)
- `services/evpn-vrf-ip-prefix.conf` (the L3 VRF that binds `irb.$UNIT` and advertises Type-5)
- `interfaces/vlan-bridge.conf` (AC units)
- `interfaces/irb-gateway.conf` (IRB unit addressing)
- `interfaces/lag-flexible-services.conf` (parent ae0)

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-evpn.conf` (verify `family evpn signaling`)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## EVPN Type-5 / L3 VRF (ip-prefix routes, standalone)

When the user wants just the L3 VRF (bound to an existing IRB):

**minimum**
- `services/evpn-vrf-ip-prefix.conf`
- `interfaces/irb-gateway.conf` (the IRB the VRF binds to)

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-evpn.conf` (verify `family evpn signaling`)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## Add-a-feature requests (no full service)

When the user asks to add a supporting feature to an existing device, emit ONLY that snip set:
- **CoS** → `cos/classifier-dscp-exp-8021p.conf` + `cos/forwarding-class-map.conf` + `cos/rewrite-rules-exp.conf`
- **OAM/CFM** → `oam/cfm-maintenance-domain.conf` + `oam/cfm-sla-iterator.conf`
- **Firewall / DDoS** → `firewall/filter-ipv4-stateless.conf` (+ `ddos-mitigation/flowspec-routes.conf` for dynamic FlowSpec)
- **Load-balancing** → `policy/per-packet-load-balance.conf` + `transport/forwarding-options-hash.conf`

## byoai/DEFAULTS.md

# Auto-Fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default values the AI uses in `auto` mode (or when the user short-circuits with `all defaults` / `use defaults` / `skip`). It is bundled into [`jvd-ewan-ace-snips.md`](jvd-ewan-ace-snips.md) by `regenerate-bundle.sh`.

Use these values EXACTLY. Do not invent alternative defaults. Every value the AI auto-fills MUST be listed in the output's `Inputs used:` block so the user can rerun with edits.

All addressing uses documentation-range prefixes (RFC 5737 / RFC 3849) or private ranges where the JVD lab used them.

---

## Device inventory (the JVD topology)

| Device | OS family | Role | Loopback (router-id) |
|--------|-----------|------|----------------------|
| `wanedge1_mx304` | Junos | WAN Edge PE | `2.2.2.2` |
| `wanedge2_mx10004` | Junos | WAN Edge PE (uses RSVP-TE) | `5.5.5.5` |
| `wanedge3_acx7509` | EVO | WAN Edge PE | `4.4.4.4` |
| `wanedge4_acx7100-48l` | EVO | WAN Edge PE | `7.7.7.7` |
| `p1_ptx10003` | EVO | Core P / Route Reflector | `3.3.3.3` |
| `p2_ptx10001-36mr` | EVO | Core P / Route Reflector | `6.6.6.6` |

**Device-choice shortcuts** (offered in the clarifying question):
- `EVO` → `wanedge3_acx7509` + `wanedge4_acx7100-48l`
- `JUNOS` → `wanedge1_mx304` + `wanedge2_mx10004`
- `MIXED` → `wanedge1_mx304` (Junos) + `wanedge3_acx7509` (EVO)

The two P routers (`p1_ptx10003`, `p2_ptx10001-36mr`) are the iBGP route reflectors — services are NOT instantiated on them.

---

## Transport / underlay defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$LOCAL_AS` | `64512` | single iBGP AS, all devices |
| `$RR_PEER_1` | `3.3.3.3` | p1_ptx10003 loopback |
| `$RR_PEER_2` | `6.6.6.6` | p2_ptx10001-36mr loopback |
| `$ROUTER_ID` / `$LOCAL_ADDRESS` | = device loopback | per device (see table) |
| `$AREA` | `0.0.0.0` | OSPF single area |
| `$SRGB_START` | `16000` | domain-wide, consistent everywhere |
| `$SRGB_SIZE` | `8000` | SRGB 16000–24000 |
| `$NODE_SEGMENT_INDEX` | per device | wanedge1=102, wanedge2=105, wanedge3=104, wanedge4=107, p1=103, p2=106 |
| `$MTU` | `9192` | core uplinks |
| `$CORE_INTF` | `et-0/0/1` | first core uplink |
| `$IPV4_ADDRESS` (core p2p) | `192.168.<a><b>.<n>/24` | `<a><b>` = sorted device pair, e.g. 192.168.12.1 on wanedge1↔wanedge2 |

---

## LAG / interface defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$LAG_INTF` | `ae0` | access-facing LAG for all service ACs |
| `$LAG_MEMBER` | `xe-0/0/9:0` (Junos) / `et-0/0/2` (EVO) | first member |
| `$LACP_SYSTEM_ID` | `00:00:00:01:01:01` (Junos) / `00:00:00:00:01:01` (EVO) | per-OS |
| `$DEVICE_COUNT` | `16` | aggregated-devices ethernet device-count |

---

## Service instance-name conventions

Each service kind uses a distinct instance-name prefix. Increment the trailing numeric per instance.

| Service | Instance name pattern | Starting example | Unit / VLAN start |
|---------|----------------------|------------------|-------------------|
| EVPN-VPWS | `vpws_group_14_<n>` | `vpws_group_14_1` | unit/VLAN `301` |
| EVPN-FXC vlan-aware | `vfxc_group_40_<n>` | `vfxc_group_40_1001` | unit/VLAN `1001` |
| EVPN-ELAN vlan-based (Junos) | `elan_group_500_<n>` | `elan_group_500_2001` | unit/VLAN `2001` |
| EVPN-ELAN vlan-bundle (EVO) | `elan_group_500_<n>` | `elan_group_500_2001` | unit/VLAN `2001` |
| EVPN-ELAN + IRB | `elan_group_65_1_<n>` | `elan_group_65_1_100100` | IRB unit `100100` |
| EVPN Type-5 VRF | `evpn_<n>` | `evpn_100` | — |

---

## Route-distinguisher / route-target defaults

| Variable | Rule | Example |
|----------|------|---------|
| `$RD` | `<device-loopback>:<unit>` | `2.2.2.2:1999` (wanedge1) |
| `$RT` | `target:<AS+offset>:<unit>` per service family | VPWS `target:60014:<id>`; ELAN `target:60525:<unit>`; Type-5 `target:60<vrf>:<vrf>` |
| `$LOCAL_ID` / `$REMOTE_ID` | VPWS service-id pair; symmetric across the two PEs | local `1`, remote `2` (swap on the far PE) |

**Cross-PE identifier rule:** route-targets, VPWS service-id pairs, and ESI values MUST match on both PE halves of a service. Per-PE identifiers (loopback, RD, AC interface name) differ.

---

## IRB / L3 defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$IRB_UNIT` | = the ELAN unit (e.g. `100100`) | irb.<unit> |
| `$IRB_IPV4` | `100.100.<x>.1/24` | anycast gateway per bridge domain |
| `$VLAN_ID` | `none` (IRB flavor) or = unit | `vlan-id none` allows multi/untagged into the BD |

---

## ESI (multi-homing) defaults

- All-active ESI on `ae0` for multi-homed CEs.
- ESI value pattern: `00:11:22:33:44:55:66:77:88:<nn>` — the trailing octet is per-ESI; MUST match on both PEs of the multi-homed pair.
- LACP system-id on the shared LAG MUST match on both PEs of the ESI.

---

## CoS defaults

8-class model (do not renumber): CONTROL(7), NETWORK(6), REALTIME(5), BUSINESS(4), SIG-OAM(3), MEDIUM(2), LOW(1), BEST-EFFORT(0). Drop-profiles `dp1`/`dp2` for WRED. These are JVD-wide constants — never parameterize the class names or queue numbers.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-ewan-ace-snips.md`](jvd-ewan-ace-snips.md) by `regenerate-bundle.sh`.

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
#   - { kind: <evpn-vpws|evpn-fxc|evpn-elan|evpn-elan-irb|evpn-type5>,
#       count: <int>,
#       start_id: <int>,
#       start_vlan: <int>,
#       start_ac_unit: <int>,
#       rt: <target:...>,
#       esi_base: <hex>,         # for multihomed services
#       irb_subnet: <prefix> }   # for evpn-elan-irb / evpn-type5
# snips_used:
#   - junos/services/evpn-vpws-vlan-based.conf
#   - evo/services/evpn-vpws-vlan-based.conf
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
- Cross-PE consistency the user must verify (RTs, ESIs, VPWS service-id pairs, MAC-VRF / instance names).
- Anything that is by-pattern rather than validated on that exact device (e.g., a user-supplied hostname not in any snip's `Seen on:` list).
- For EVO devices: remind that `network-services enhanced-ip` (from `bootstrap/chassis-network-services.conf`) is a prerequisite for EVPN/MPLS and requires a reboot if not already set.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
