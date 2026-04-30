# JVD MEBS snippet library

## evo/apply-groups/gr-bgp-bcp.conf

```
/*
 * Topic:   BGP best-current-practice timers (EVO)
 * Seen on:
 *   Junos: an1_mx204 (and other Junos PEs)
 *   EVO:   ma1-1_acx7024 (and other EVO PEs)
 *
 * Highlights:
 *  - Identical to junos/apply-groups/gr-bgp-bcp.conf.
 *  - path-selection external-router-id breaks ties between iBGP-learned
 *    paths consistently across the fabric.
 *  - precision-timers — sub-second BGP keepalive scheduling
 *    (ties into 1s hold-time below).
 *  - hold-time 10 — aggressive BGP liveness; combined with BFD this
 *    keeps service withdrawal under a second.
 *  - bgp-error-tolerance — drop bad updates instead of resetting the
 *    session (RFC 7606-style treat-as-withdraw).
 *  - tcp-mss 4096 — avoid fragmentation of long EVPN/L3VPN updates.
 *
 * Pair with:
 *  - junos/apply-groups/gr-bgp-bcp.conf
 *  - evo/transport/bgp-overlay.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    GR-BGP-BCP {
        protocols {
            bgp {
                path-selection external-router-id;
                precision-timers;
                hold-time 10;
                bgp-error-tolerance;
                tcp-mss 4096;
            }
        }
    }
}
```

## evo/apply-groups/gr-core-intf.conf

```
/*
 * Topic:   Core-facing interface baseline (EVO)
 * Seen on:
 *   Junos: an1_mx204 (and other Junos PEs)
 *   EVO:   ma1-1_acx7024 (and other EVO PEs)
 *
 * Highlights:
 *  - Identical structure to junos/apply-groups/gr-core-intf.conf.
 *  - 9192-byte L2 MTU + 9106 inet/iso + 9170 mpls — leaves room for
 *    14 MPLS labels (SR-MPLS deep label stacks for TI-LFA + flex-algo +
 *    transport-class + service label).
 *  - Family mpls maximum-labels 14 — required for SR-MPLS / Flex-Algo
 *    TI-LFA backup paths that may push 6+ labels.
 *  - hold-time up 2000 down 0 — short up-damp on core links (give IGP
 *    a moment to come back) but no down-damp (let BFD/IGP withdraw).
 *
 * Pair with:
 *  - junos/apply-groups/gr-core-intf.conf
 *  - evo/transport/isis-srmpls-tilfa.conf
 *  - evo/transport/mpls-segment-routing.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    GR-CORE-INTF {
        interfaces {
            <*> {
                description "********GR-CORE-INTF-SETTINGS-APPLIED ********";
                traps;
                mtu 9192;
                hold-time up 2000 down 0;
                unit <*> {
                    traps;
                    family inet {
                        mtu 9106;
                    }
                    family iso {
                        mtu 9106;
                    }
                    family mpls {
                        mtu 9170;
                        maximum-labels 14;
                    }
                }
            }
            <ae*> {
                aggregated-ether-options {
                    lacp {
                        active;
                        hold-time up 2;
                    }
                }
            }
        }
    }
}
```

## evo/apply-groups/gr-edge-intf-mh.conf

```
/*
 * Topic:   Customer-facing interface baseline — multihomed variant (EVO)
 * Seen on:
 *   Junos: an1_mx204 (and other Junos ANs that multihome to AGs)
 *   EVO:   ma1-1_acx7024 ma1-2_acx7024 (and other EVO MH ANs)
 *
 * Highlights:
 *  - Same as GR-EDGE-INTF but WITHOUT hold-time. Multihomed bundles
 *    rely on EVPN ESI / EVPN-MH convergence (fast DF election +
 *    aliasing) for sub-second failover, so port-level damping would
 *    only delay convergence.
 *  - Pair this group with a parent ae* unit that has esi { all-active }
 *    — see evo/interfaces/lag-esi-multihoming.conf
 *
 * Pair with:
 *  - junos/apply-groups/gr-edge-intf-mh.conf
 *  - evo/interfaces/lag-esi-multihoming.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    GR-EDGE-INTF-MH {
        interfaces {
            <*> {
                description ********GR-EDGE-INTF-Multihomed-SETTINGS-APPLIED-ADD-DESCRIPTION********;
                traps;
                flexible-vlan-tagging;
                mtu 9102;
                encapsulation flexible-ethernet-services;
            }
        }
    }
}
```

## evo/apply-groups/gr-edge-intf.conf

```
/*
 * Topic:   Customer-facing interface baseline (EVO)
 * Seen on:
 *   Junos: an1_mx204 (and other Junos ANs)
 *   EVO:   ma1-1_acx7024 (and other EVO ANs)
 *
 * Highlights:
 *  - Identical structure to junos/apply-groups/gr-edge-intf.conf
 *    on Junos OS — Junos and Junos Evolved share this BCP unchanged.
 *  - flexible-vlan-tagging + flexible-ethernet-services so the same
 *    physical port can carry vlan-bridge, vlan-ccc and family-ccc units
 *    side-by-side (mixed L2 services on one UNI).
 *  - hold-time up 180000 down 0 → 3-min damp on link UP, immediate down
 *    (so transient flaps don't reattach customer ACs into a half-built
 *    EVPN/L2VPN service).
 *  - LACP active w/ hold-time up 2 for AE bundles.
 *  - Optics low-light alarms tied to link-down for fast convergence.
 *
 * Pair with:
 *  - junos/apply-groups/gr-edge-intf.conf (Junos counterpart)
 *  - evo/apply-groups/gr-edge-intf-mh.conf (multihomed variant)
 *  - evo/apply-groups/gr-lag-member.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    GR-EDGE-INTF {
        interfaces {
            <*> {
                description ********GR-EDGE-INTF-SETTINGS-APPLIED-ADD-DESCRIPTION********;
                traps;
                flexible-vlan-tagging;
                mtu 9102;
                hold-time up 180000 down 0;
                encapsulation flexible-ethernet-services;
            }
            <ae*> {
                aggregated-ether-options {
                    lacp {
                        active;
                        hold-time up 2;
                    }
                }
            }
            "<[egx][te]-*>" {
                optics-options {
                    alarm low-light-alarm {
                        link-down;
                    }
                    warning low-light-warning {
                        syslog;
                    }
                }
            }
        }
    }
}
```

## evo/apply-groups/gr-fatpw-label.conf

```
/*
 * Apply-group: GR-FATPW-LABEL
 * Seen on:
 *   Junos: ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Wildcard-matched flow-label config injected into every routing-instance
 * of a given naming pattern. Demonstrates how a single template covers
 * each Junos PW/L2VPN/EVPN flavour with the correct knob:
 *
 *   <l2vpn_*>            BGP L2VPN          flow-label-{transmit,receive}
 *   <vpls_*>             BGP-VPLS           flow-label-{transmit,receive}
 *   <evpn_group_80_*>    EVPN-ELAN          flow-label + flow-label-static
 *   <evpn_group_10_*>    EVPN-VPWS          flow-label-{transmit,receive}-static
 *   <EVPN_VPWS_PORT_*>   port-based EVPN-VPWS  flow-label-{transmit,receive}-static
 *   L2VPN_PORT_BASED     port-based L2VPN   flow-label-{transmit,receive}
 *   <EVPN_ELAN_PORT_*>   port-based EVPN-ELAN  flow-label + flow-label-static
 *
 * Pair with:
 *  - junos/apply-groups/gr-fatpw-label.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    GR-FATPW-LABEL {
        /* EVPN-VPWS will use static label EVPN-ELAN will use both */
        routing-instances {
            <l2vpn_*> {
                protocols {
                    l2vpn {
                        flow-label-transmit;
                        flow-label-receive;
                    }
                }
            }
            <vpls_*> {
                protocols {
                    vpls {
                        flow-label-transmit;
                        flow-label-receive;
                    }
                }
            }
            <evpn_group_80_*> {
                protocols {
                    evpn {
                        flow-label;
                        flow-label-static;
                    }
                }
            }
            <evpn_group_10_*> {
                protocols {
                    evpn {
                        flow-label-transmit-static;
                        flow-label-receive-static;
                    }
                }
            }
            <EVPN_VPWS_PORT_*> {
                protocols {
                    evpn {
                        flow-label-transmit-static;
                        flow-label-receive-static;
                    }
                }
            }
            L2VPN_PORT_BASED {
                protocols {
                    l2vpn {
                        flow-label-transmit;
                        flow-label-receive;
                    }
                }
            }
            <EVPN_ELAN_PORT_*> {
                protocols {
                    evpn {
                        flow-label;
                        flow-label-static;
                    }
                }
            }
        }
    }
}
```

## evo/apply-groups/gr-fatpw-lb.conf

```
/*
 * Apply-group: GR-FATPW-LB
 * Seen on:
 *   Junos: ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Enables Flow-Aware Transport (FAT) pseudowire load-balancing
 * at the forwarding-options level. The companion GR-FATPW-LABEL
 * group enables flow-label transmit/receive on each VPN/PW type.
 *
 * Apply globally:
 *   set apply-groups GR-FATPW-LB
 *
 * Pair with:
 *  - junos/apply-groups/gr-fatpw-lb.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    GR-FATPW-LB {
        forwarding-options {
            load-balance-label-capability;
        }
    }
}
```

## evo/apply-groups/gr-isis-bcp.conf

```
/*
 * Topic:   ISIS best-current-practice timers (EVO)
 * Seen on:
 *   Junos: an1_mx204 (and other Junos PEs)
 *   EVO:   ma1-1_acx7024 (and other EVO PEs)
 *
 * Highlights:
 *  - Identical to junos/apply-groups/gr-isis-bcp.conf.
 *  - max-hello-size 9106 on ae*/et* lets ISIS hellos use the full
 *    jumbo MTU (verifies path MTU before the protocol commits).
 *  - lsp-interval 10 (ms) — fast LSP flooding on point-to-point links.
 *  - SPF: delay 50 ms / holddown 2000 ms / rapid-runs 5 → fast
 *    initial reaction with a backoff window, the textbook BCP.
 *  - overload bit timeout 300s + advertise-high-metrics → router
 *    comes up "drained" so traffic doesn't shift onto it before BGP
 *    converges.
 *
 * Pair with:
 *  - junos/apply-groups/gr-isis-bcp.conf
 *  - evo/transport/isis-srmpls-tilfa.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    GR-ISIS-BCP {
        protocols {
            isis {
                interface <ae*> {
                    max-hello-size 9106;
                    lsp-interval 10;
                }
                interface <et-*> {
                    max-hello-size 9106;
                    lsp-interval 10;
                }
                spf-options {
                    delay 50;
                    holddown 2000;
                    rapid-runs 5;
                }
                overload {
                    timeout 300;
                    advertise-high-metrics;
                }
            }
        }
    }
}
```

## evo/apply-groups/gr-isis-bfd.conf

```
/*
 * Apply-group: GR-ISIS-BFD
 * Seen on:
 *   Junos: (all Junos)
 *   EVO:   (all EVO)
 *
 * Aggressive BFD overlay applied to every ISIS interface. Used in
 * combination with GR-ISIS-BCP via:
 *
 *   set protocols isis apply-groups [ GR-ISIS-BCP GR-ISIS-BFD ]
 *
 * 50 ms x 3 multiplier with no-adaptation gives ≈150 ms link-failure
 * detection that drives TI-LFA fast reroute.
 *
 * Pair with:
 *  - junos/apply-groups/gr-isis-bfd.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    GR-ISIS-BFD {
        protocols {
            isis {
                interface <ae*> {
                    family inet {
                        bfd-liveness-detection {
                            minimum-interval 50;
                            multiplier 3;
                            no-adaptation;
                        }
                    }
                }
                interface <et*> {
                    family inet {
                        bfd-liveness-detection {
                            minimum-interval 50;
                            multiplier 3;
                            no-adaptation;
                        }
                    }
                }
            }
        }
    }
}
```

## evo/apply-groups/gr-l2ckt-hs.conf

```
/*
 * Apply-group: GR-L2CKT-HS
 * Seen on:
 *   Junos: (none in JVD)
 *   EVO:   an3_acx7100-48l
 *
 * Adds hot-standby (active/standby) protection knobs to every L2Circuit
 * pseudowire. Combined with backup-neighbor under each PW, this delivers
 * sub-second redundancy when the primary remote PE fails.
 *
 *   pseudowire-status-tlv: hot-standby-vc-on  → keep VC down on standby
 *   switchover-delay 0                          → switch immediately
 *
 * Pair with:
 *  - junos/apply-groups/gr-l2ckt-hs.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    GR-L2CKT-HS {
        protocols {
            l2circuit {
                neighbor <*> {
                    interface <*> {
                        pseudowire-status-tlv {
                            hot-standby-vc-on;
                        }
                        switchover-delay 0;
                    }
                }
            }
        }
    }
}
```

## evo/apply-groups/gr-l3vpn.conf

```
/*
 * Apply-group: GR-L3VPN
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Wildcard L3VPN VRF baseline applied to every routing-instance whose
 * name matches METRO_*. Provides:
 *  - vpn-unequal-cost multipath (load-share over PEs with unequal IGP cost)
 *  - protect core (TI-LFA-friendly nexthop protection)
 *  - vrf-table-label (single label per VRF for label-switched data plane)
 *
 * Pair with:
 *  - junos/apply-groups/gr-l3vpn.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    GR-L3VPN {
        routing-instances {
            <METRO_*> {
                instance-type vrf;
                routing-options {
                    multipath {
                        vpn-unequal-cost;
                    }
                    protect core;
                }
                vrf-table-label;
            }
        }
    }
}
```

## evo/apply-groups/gr-lag-member.conf

```
/*
 * Apply-groups: LAG-MEMBER variants
 * Seen on:
 *   Junos: (all Junos w/ LAG)
 *   EVO:   (all EVO w/ LAG)
 *
 * Templated knobs for individual physical members of a LAG bundle:
 *
 *   GR-EDGE-INTF-LAG-MEMBER       members of a single-homed edge LAG
 *   GR-EDGE-INTF-LAG-MEMBER-MH    members of a multi-homed (ESI) edge LAG
 *   GR-CORE-INTF-LAG-MEMBER       members of a core-facing LAG
 *
 * The bundle itself (ae*) carries GR-EDGE-INTF[-MH] / GR-CORE-INTF;
 * each member port (et-*) carries the matching -LAG-MEMBER variant.
 *
 * Apply with:
 *   set interfaces et-0/0/N apply-groups GR-EDGE-INTF-LAG-MEMBER
 *
 * Pair with:
 *  - junos/apply-groups/gr-lag-member.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    GR-EDGE-INTF-LAG-MEMBER {
        interfaces {
            <*> {
                traps;
                hold-time up 180000 down 0;
                optics-options {
                    alarm low-light-alarm {
                        link-down;
                    }
                    warning low-light-warning {
                        syslog;
                    }
                }
            }
        }
    }
    GR-EDGE-INTF-LAG-MEMBER-MH {
        interfaces {
            <*> {
                traps;
                hold-time up 180000 down 0;
                optics-options {
                    alarm low-light-alarm {
                        link-down;
                    }
                    warning low-light-warning {
                        syslog;
                    }
                }
            }
        }
    }
    GR-CORE-INTF-LAG-MEMBER {
        interfaces {
            <*> {
                description "********GR-CORE-INTF-LAG-MEMBERS-SETTINGS-APPLIED ********";
                traps;
                hold-time up 2000 down 0;
                optics-options {
                    alarm low-light-alarm {
                        link-down;
                    }
                    warning low-light-warning {
                        syslog;
                    }
                }
            }
        }
    }
}
```

## evo/cos/forwarding-classes.conf

```
/*
 * Topic:   6-class forwarding-classes (EVO)
 * Seen on:
 *   Junos: an1_mx204 (and other Junos PEs)
 *   EVO:   ma1-1_acx7024 (and other EVO PEs)
 *
 * Highlights:
 *  - Identical 6-class queue model as junos/cos/forwarding-classes.conf
 *    so that DSCP / EXP / 802.1p classification translates cleanly
 *    end-to-end across mixed Junos+EVO fabrics.
 *  - Queue numbers 0–5 mapped to: BEST-EFFORT(0), MEDIUM(1), REALTIME(2),
 *    SIG-OAM(3), CONTROL(4), BUSINESS(5).
 *  - DSCP / EXP / 802.1p classifiers produce the same forwarding-class
 *    on both OS families (key for transparent CoS across multi-vendor
 *    pseudowires).
 *
 * Pair with:
 *  - junos/cos/forwarding-classes.conf
 *  - evo/cos/schedulers.conf
 *
 * Variables: none. All values here are JVD-wide constants
 *            (queue numbers, class names, scheduler weights,
 *            community names, policer rates) — same on every PE.
 */
class-of-service {
    classifiers {
        dscp DSCP {
            forwarding-class BEST-EFFORT {
                loss-priority high code-points be;
                loss-priority low code-points [ cs1 af11 af12 af13 ];
            }
            forwarding-class BUSINESS {
                loss-priority low code-points [ cs4 af41 af42 af43 ];
            }
            forwarding-class CONTROL {
                loss-priority low code-points [ cs6 cs7 ];
            }
            forwarding-class MEDIUM {
                loss-priority high code-points [ cs2 af21 af22 af23 ];
            }
            forwarding-class REALTIME {
                loss-priority low code-points [ cs5 ef ];
            }
            forwarding-class SIG-OAM {
                loss-priority low code-points [ cs3 af31 af32 af33 ];
            }
        }
        exp EXP {
            forwarding-class BEST-EFFORT {
                loss-priority high code-points 000;
                loss-priority low code-points 001;
            }
            forwarding-class BUSINESS {
                loss-priority low code-points 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-points [ 110 111 ];
            }
            forwarding-class MEDIUM {
                loss-priority high code-points 010;
            }
            forwarding-class REALTIME {
                loss-priority low code-points 101;
            }
            forwarding-class SIG-OAM {
                loss-priority low code-points 011;
            }
        }
        ieee-802.1 8021P {
            forwarding-class BEST-EFFORT {
                loss-priority high code-points 000;
                loss-priority low code-points 001;
            }
            forwarding-class BUSINESS {
                loss-priority low code-points 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-points [ 110 111 ];
            }
            forwarding-class MEDIUM {
                loss-priority high code-points 010;
            }
            forwarding-class REALTIME {
                loss-priority low code-points 101;
            }
            forwarding-class SIG-OAM {
                loss-priority low code-points 011;
            }
        }
    }
    forwarding-classes {
        class BEST-EFFORT queue-num 0;
        class BUSINESS queue-num 5;
        class CONTROL queue-num 4;
        class MEDIUM queue-num 1;
        class REALTIME queue-num 2;
        class SIG-OAM queue-num 3;
    }
}
```

## evo/cos/schedulers.conf

```
/*
 * Topic:   Schedulers and scheduler-map for the 6-class model (EVO)
 * Seen on:
 *   Junos: an1_mx204 (and other Junos PEs)
 *   EVO:   ma1-1_acx7024 (and other EVO PEs)
 *
 * Highlights:
 *  - Same scheduler shape as junos/cos/schedulers.conf — REALTIME is
 *    strict-high (shaped to 40%), CONTROL/SIG-OAM small low-priority,
 *    BUSINESS/MEDIUM 20% each, BEST-EFFORT gets the remainder.
 *  - One scheduler-map (5G_SCHEDULER) attached to edge LAGs via
 *    `class-of-service interfaces ae* { scheduler-map 5G_SCHEDULER; }`.
 *  - shaping-rate vs transmit-rate: REALTIME uses shaping (cap), the
 *    rest use transmit-rate (guarantee).
 *
 * Pair with:
 *  - junos/cos/schedulers.conf
 *  - evo/cos/forwarding-classes.conf
 *
 * Variables: none. All values here are JVD-wide constants
 *            (queue numbers, class names, scheduler weights,
 *            community names, policer rates) — same on every PE.
 */
class-of-service {
    scheduler-maps {
        5G_SCHEDULER {
            forwarding-class BEST-EFFORT scheduler BEST-EFFORT-SC;
            forwarding-class BUSINESS scheduler BUSINESS-SC;
            forwarding-class CONTROL scheduler CONTROL-SC;
            forwarding-class MEDIUM scheduler MEDIUM-SC;
            forwarding-class REALTIME scheduler REALTIME-SC;
            forwarding-class SIG-OAM scheduler SIG-OAM-SC;
        }
    }
    schedulers {
        BEST-EFFORT-SC {
            transmit-rate {
                remainder;
            }
            buffer-size {
                remainder;
            }
            priority low;
        }
        BUSINESS-SC {
            transmit-rate percent 20;
            buffer-size percent 20;
            priority low;
        }
        CONTROL-SC {
            transmit-rate percent 5;
            buffer-size percent 2;
            priority low;
        }
        MEDIUM-SC {
            transmit-rate percent 20;
            buffer-size percent 20;
            priority low;
        }
        REALTIME-SC {
            shaping-rate percent 40;
            buffer-size percent 30;
            priority strict-high;
        }
        SIG-OAM-SC {
            transmit-rate percent 5;
            buffer-size percent 2;
            priority low;
        }
    }
}
```

## evo/firewall/policers.conf

```
/*
 * Topic:   Rate-limit policers (EVO)
 * Seen on:
 *   Junos: an1_mx204 (and other Junos ANs)
 *   EVO:   ma1-1_acx7024 (and other EVO ANs)
 *
 * Highlights:
 *  - Same 5 Mbps and 50 Mbps templates as junos/firewall/policers.conf —
 *    used at the UNI to enforce CIR per attachment-circuit unit
 *    (typical Metro EVPL/EVPLAN service tiering).
 *  - then discard — out-of-profile traffic is dropped, not marked
 *    (use a colored-marking variant if you want trTCM behaviour).
 *  - Note: ma1-1_acx7024 in this JVD does NOT carry a generic
 *    "any" filter; policers are referenced directly per-unit via
 *    `unit X { filter { input 50MB_filter; } }` where 50MB_filter
 *    lives on filter-equipped peers (e.g. an3_acx7100-48l). On EVO
 *    devices that need a filter, build it as a family-any filter
 *    referencing these policers — same pattern as Junos.
 *
 * Pair with:
 *  - junos/firewall/policers.conf
 *  - evo/interfaces/edge-vlan-normalization.conf  (per-unit input filter ref)
 *
 * Variables: none. All values here are JVD-wide constants
 *            (queue numbers, class names, scheduler weights,
 *            community names, policer rates) — same on every PE.
 */
firewall {
    policer 50mbps_policer {
        if-exceeding {
            bandwidth-limit 50m;
            burst-size-limit 2m;
        }
        then discard;
    }
    policer 5mbps_policer {
        if-exceeding {
            bandwidth-limit 5m;
            burst-size-limit 1m;
        }
        then discard;
    }
}
```

## evo/interfaces/core-isis-mpls.conf

```
/*
 * Topic:   Core-facing LAG carrying inet/iso/inet6/mpls (EVO)
 * Seen on:
 *   Junos: an1_mx204 (and other Junos PEs)
 *   EVO:   ma1-1_acx7024 (and all other EVO PEs)
 *
 * Highlights:
 *  - Same shape as junos/interfaces/core-isis-mpls.conf — one LAG per
 *    core neighbour, jumbo MTU 9192, single unit 0 with all four
 *    families needed for SR-MPLS underlay (inet, iso, inet6, mpls).
 *  - apply-groups GR-CORE-INTF inherits the per-family MTUs and
 *    `family mpls maximum-labels 14` (deep label stacks).
 *  - LACP periodic fast + minimum-links 1 — fast bundle health,
 *    bundle stays up on a single member (small fabric / lab).
 *  - lo0.0 below carries the loopback address used by ISIS/iBGP.
 *
 * Pair with:
 *  - junos/interfaces/core-isis-mpls.conf
 *  - evo/apply-groups/gr-core-intf.conf
 *  - evo/transport/isis-srmpls-tilfa.conf
 *
 * Variables (example values from ma1-1_acx7024):
 *   $CORE_PHYS         e.g. ae83
 *   $CORE_DESC         e.g. "to MA2 rtme-mx204-08 ae83"
 *   $CORE_V4_ADDR      e.g. 10.10.1.121/30
 *   $CORE_V6_ADDR      e.g. 2001::10:10:1:79/126
 *   $LO0_DESC          e.g. "MA1.1 Metro Ring Blue metro-a"
 *   $LOOPBACK_V4_PFX   e.g. 1.1.0.17/32
 *   $LOOPBACK_V6_PFX   e.g. 2001::1:1:0:11/128
 *   $ISIS_NET          e.g. 49.0001.0010.0100.0017.00
 */
interfaces {
    $CORE_PHYS {
        description $CORE_DESC;
        mtu 9192;
        aggregated-ether-options {
            minimum-links 1;
            lacp {
                active;
                periodic fast;
            }
        }
        unit 0 {
            apply-groups GR-CORE-INTF;
            family inet {
                address $CORE_V4_ADDR;
            }
            family iso;
            family inet6 {
                address $CORE_V6_ADDR;
            }
            family mpls;
        }
    }
    lo0 {
        description $LO0_DESC;
        unit 0 {
            family inet {
                address $LOOPBACK_V4_PFX {
                    primary;
                }
            }
            family iso {
                address $ISIS_NET;
            }
            family inet6 {
                address $LOOPBACK_V6_PFX {
                    primary;
                }
            }
        }
    }
}
```

## evo/interfaces/edge-vlan-normalization.conf

```
/*
 * Topic:   Edge port with VLAN normalization (push/pop) for L2 services
 * Seen on:
 *   Junos: —
 *   EVO:   an3_acx7100-48l (and similar on other EVO ANs)
 *
 * Highlights:
 *  - Single-homed customer-facing port (et-0/0/0) carrying a mix of
 *    EVPN-ELAN attachment-circuits (vlan-bridge encap) and L2Circuit
 *    attachment-circuits (vlan-ccc encap, family ccc).
 *  - input-vlan-map push / output-vlan-map pop  → VLAN normalization
 *    at the SP edge: the customer VLAN seen on the wire is rewritten
 *    to a service-internal VLAN before bridging / pseudowire encap.
 *  - Per-unit ingress filter (50MB_filter from firewall snippet) for
 *    rate-limiting at the UNI.
 *  - unit 3000 is the L2Circuit attachment shown in
 *    evo/services/l2circuit-hot-standby.conf
 *
 * Edge baseline knobs (description, MTU, flex-vlan tagging,
 * encapsulation, optics alarms) come from apply-groups GR-EDGE-INTF.
 *
 * Pair with:
 *  - junos/interfaces/edge-vlan-normalization.conf
 *
 * Variables (example values from an3_acx7100-48l):
 *   $AC_PHYS    e.g. et-0/0/0   (the parent port; the per-unit
 *                                blocks show the repeating pattern
 *                                for each AC)
 */
interfaces {
    $AC_PHYS {
        apply-groups GR-EDGE-INTF;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        unit 400 {
            encapsulation vlan-bridge;
            vlan-id 400;
            input-vlan-map {
                push;
                vlan-id 3500;
            }
            output-vlan-map pop;
        }
        unit 2800 {
            encapsulation vlan-ccc;
            vlan-id 2800;
            input-vlan-map {
                push;
                vlan-id 3200;
            }
            output-vlan-map pop;
            filter {
                input 50MB_filter;
            }
        }
        unit 3000 {
            encapsulation vlan-ccc;
            vlan-id 3000;
            input-vlan-map {
                push;
                vlan-id 1000;
            }
            output-vlan-map pop;
            filter {
                input 50MB_filter;
            }
            family ccc;
        }
    }
}
```

## evo/interfaces/lag-esi-multihoming.conf

```
/*
 * Topic:   Edge LAG with per-unit ESI for EVPN multihoming (EVO)
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - All-active EVPN multihoming via ESI-LAG: ae12 with LACP
 *    system-id 00:00:00:00:00:01 shared between this PE (ma1-1) and
 *    its multihoming peer (ma1-2). Customer CE sees one LAG.
 *  - input-vlan-map push / output-vlan-map pop translates the
 *    customer VLAN (200, 201, …) into a service-internal VLAN
 *    (2400, 2401, …) — same VLAN normalisation as
 *    evo/interfaces/edge-vlan-normalization.conf, applied per-AC.
 *  - Per-unit `esi { … all-active; }` enables EVPN aliasing and
 *    DF election across the two MH PEs. The 10-byte ESI is unique
 *    per AC so each EVPN-VPWS / EVPN-ELAN instance has its own
 *    Type-1 / Type-4 advertisements.
 *  - Encap vlan-ccc on each unit — these ACs feed EVPN-VPWS
 *    services (see evo/services/evpn-vpws.conf for the matching
 *    routing-instance with vpws-service-id).
 *  - apply-groups GR-EDGE-INTF-MH (no port-level hold-time → EVPN
 *    DF election handles convergence).
 *
 * Pair with:
 *  - junos/interfaces/lag-esi-multihoming.conf
 *  - evo/services/evpn-vpws.conf
 *  - evo/apply-groups/gr-edge-intf-mh.conf
 *
 * Variables (example values from ma1-1_acx7024):
 *   $AC_PHYS         e.g. ae12
 *   $LACP_SYS_ID     e.g. 00:00:00:00:00:01
 *                    (must be IDENTICAL on the multihoming peer)
 */
interfaces {
    $AC_PHYS {
        apply-groups GR-EDGE-INTF-MH;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            lacp {
                active;
                system-id $LACP_SYS_ID;
            }
        }
        unit 200 {
            encapsulation vlan-ccc;
            vlan-id 200;
            input-vlan-map {
                push;
                vlan-id 2400;
            }
            output-vlan-map pop;
            esi {
                00:10:11:11:50:12:03:00:00:00;
                all-active;
            }
        }
        unit 201 {
            encapsulation vlan-ccc;
            vlan-id 201;
            input-vlan-map {
                push;
                vlan-id 2401;
            }
            output-vlan-map pop;
            esi {
                00:10:11:11:50:12:03:01:00:00;
                all-active;
            }
        }
    }
}
```

## evo/oam/oam-cfm-perf-mon.conf

```
/*
 * Topic:   Ethernet OAM CFM with hardware-assisted SLA performance monitoring
 * Seen on:
 *   Junos: an4_acx710 ma5_mx204
 *   EVO:   an3_acx7100-48l ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - performance-monitoring with hardware-assisted-timestamping for
 *    accurate two-way delay (Y.1731 DM) measurements at line rate
 *  - SLA iterator profile 2WD-P3:
 *      measurement-type   two-way-delay
 *      cycle-time         1000 ms
 *      iteration-period   2000 ms
 *      calculation-weight delay 300 / delay-variation 300
 *  - One maintenance-domain (level 5) holds many maintenance-associations
 *    (one per service / VLAN unit). Continuity-check 1s with loss-threshold
 *    10 + hold-interval 1 detects PW liveness.
 *  - One representative maintenance-association is shown; the source file
 *    repeats this template for each service-bound subinterface.
 *
 * Apply on a per-unit basis: each MEP binds to a vlan-ccc subinterface
 * (e.g., et-0/0/0.2800) that is also the L2Circuit attachment-circuit.
 *
 * Pair with:
 *  - junos/oam/oam-cfm-perf-mon.conf
 *
 * Variables (example values from an3_acx7100-48l):
 *   $MD_NAME         e.g. MD_63535
 *   $MA_ID           e.g. 100
 *   $MEP_LOCAL       e.g. 1002
 *   $MEP_REMOTE      e.g. 1003
 *   $AC_INTF         e.g. et-0/0/0.2800
 */
protocols {
    oam {
        ethernet {
            connectivity-fault-management {
                performance-monitoring {
                    hardware-assisted-timestamping;
                    enhanced-sla-iterator;
                    measurement-interval 5;
                    sla-iterator-profiles {
                        2WD-P3 {
                            measurement-type two-way-delay;
                            cycle-time 1000;
                            iteration-period 2000;
                            calculation-weight {
                                delay 300;
                                delay-variation 300;
                            }
                        }
                    }
                }
                maintenance-domain $MD_NAME {
                    level 5;
                    name-format none;
                    maintenance-association $MA_ID {
                        short-name-format 2octet;
                        continuity-check {
                            interval 1s;
                            loss-threshold 10;
                            hold-interval 1;
                        }
                        mep $MEP_LOCAL {
                            interface $AC_INTF;
                            direction up;
                            remote-mep $MEP_REMOTE {
                                sla-iterator-profile 2WD-P3 {
                                    priority 1;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
```

## evo/policy/communities.conf

```
/*
 * Topic:   Communities — transport-class colors and L3VPN service tags
 * Seen on:
 *   Junos: (all Junos PEs)
 *   EVO:   (all EVO PEs)
 *
 * Two families of BGP extended-communities used throughout the
 * Metro EBS service portfolio:
 *
 * 1. Transport-class (BGP-CT) color communities
 *    color:0:NNNN — used to steer overlay routes (L3VPN, EVPN, L2VPN,
 *    L2Circuit) onto the correct underlay flex-algorithm / TC.
 *
 *      CM-TC-MAP2GOLD     color:0:4000   (priority / low-latency)
 *      CM-TC-MAP2BRONZE   color:0:6000   (best-effort)
 *
 *    Add via routing-policy:
 *      then community add CM-TC-MAP2GOLD;
 *
 * 2. L3VPN per-service route-targets and helper communities
 *    target:63535:NNNN identifies each METRO_BGPv4_L3VPN_NNNN VRF.
 *
 *      CM-INET-DEFAULT, CM-INET-PRIMARY, CM-INET-BACKUP — Internet
 *        default-route leak / primary / backup classification
 *      CM-L3VPN-PUB     — "public" address ranges within a VRF
 *      CM-LOOPBACK, CM-METRO-FABRIC, CM-ACCESS-FABRIC — topology tags
 *      CM-METRO-RING, CM-REGION-EDGE, CM-SERVICE-EDGE,
 *        CM-REGIONAL-BORDER — domain markers for inter-domain transit
 *      CM-NO-ADVERTISE  — built-in well-known to suppress propagation
 *
 * Pair with:
 *  - junos/policy/communities.conf
 *
 * Variables: none. All values here are JVD-wide constants
 *            (queue numbers, class names, scheduler weights,
 *            community names, policer rates) — same on every PE.
 */
policy-options {
    community CM-ACCESS-FABRIC members 63535:2;
    community CM-INET-BACKUP members target:63536:99999;
    community CM-INET-DEFAULT members target:63536:11111;
    community CM-INET-PRIMARY members target:63536:00000;
    community CM-L3VPN-PUB members target:63536:22222;
    community CM-LOOPBACK members 63535:10000;
    community CM-METRO-FABRIC members 63535:1;
    community CM-METRO-RING members 63536:20;
    community CM-NO-ADVERTISE members no-advertise;
    community CM-REGION-EDGE members 63536:30;
    community CM-REGIONAL-BORDER members 63535:3;
    community CM-SERVICE-EDGE members 63536:10;
    community CM-TC-MAP2BRONZE members color:0:6000;
    community CM-TC-MAP2GOLD members color:0:4000;
    community METRO_BGPv4_L3VPN_2101 members target:63535:2101;
    community METRO_BGPv4_L3VPN_2102 members target:63535:2102;
    /* ... per-VRF community continues for every METRO_BGPv4_L3VPN_NNNN ... */
}
```

## evo/policy/l3vpn-export-import.conf

```
/*
 * Topic:   L3VPN per-VRF export/import policies
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - One PS-…-EXPORT and one PS-…-IMPORT per L3VPN VRF — applied via
 *    vrf-export / vrf-import on the VRF (see services/l3vpn-vrf__…)
 *  - EXPORT tags every advertised prefix with the per-service RT
 *    community (METRO_BGPv4_L3VPN_2101) so other PEs can import it
 *  - EXPORT also tags any "public" customer ranges with CM-L3VPN-PUB
 *    so they can be selectively redistributed for Internet breakout
 *  - IMPORT accepts both the per-service RT and a default-route
 *    community CM-INET-DEFAULT (Internet default leaked into the VRF)
 *
 * The pattern repeats for every METRO_BGPv4_L3VPN_NNNN VRF; this
 * single example is enough to understand the per-service template.
 *
 * Pair with:
 *  - junos/policy/l3vpn-export-import.conf
 *
 * Variables (example values from an3_acx7100-48l / METRO_BGPv4_L3VPN_2101):
 *   $INSTANCE_NAME    e.g. METRO_BGPv4_L3VPN_2101
 *                     (the per-VRF community, the PS-…-EXPORT and
 *                     the PS-…-IMPORT policy all share this name)
 *   $CE_PREFIX_1      e.g. 13.2.0.0/16
 *   $CE_PREFIX_2      e.g. 16.2.0.0/16
 *   $CE_PREFIX_3      e.g. 15.2.0.0/16
 */
policy-options {
    policy-statement PS-${INSTANCE_NAME}-EXPORT {
        term tag-public-routes {
            from {
                route-filter $CE_PREFIX_1 orlonger;
                route-filter $CE_PREFIX_2 orlonger;
                route-filter $CE_PREFIX_3 orlonger;
            }
            then {
                community add CM-L3VPN-PUB;
                community add $INSTANCE_NAME;
                accept;
            }
        }
        term tag-default {
            then {
                community add $INSTANCE_NAME;
                accept;
            }
        }
    }
    policy-statement PS-${INSTANCE_NAME}-IMPORT {
        term L3VPN-CUST {
            from community $INSTANCE_NAME;
            then accept;
        }
        term INTERNET {
            from community CM-INET-DEFAULT;
            then accept;
        }
    }
}
```

## evo/services/evpn-elan-mac-vrf-irb.conf

```
/*
 * Topic:   EVPN-ELAN with mac-vrf and IRB integration
 * Seen on:
 *   Junos: —
 *   EVO:   an3_acx7100-48l ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Same MEF E-LAN role as evpn-elan-mac-vrf__an1-mx204.conf, but using
 * the newer mac-vrf instance-type with vlan-based service-type and an
 * integrated routing & bridging (IRB) interface for the gateway.
 *
 * Highlights:
 *  - instance-type mac-vrf (preferred over instance-type evpn for
 *    multi-VLAN scaling and IRB integration)
 *  - service-type vlan-based  → one VLAN per mac-vrf
 *  - default-gateway do-not-advertise (suppress EVPN Type-2 for the
 *    IRB MAC; rely on Type-5 / IRB-anycast)
 *  - normalization (translate AC VLAN to internal VLAN before bridging)
 *  - vlan V4000 binds attachment-circuit et-0/0/50.2000 to vlan-id 4000
 *    and the matching irb.4000 unit for L2/L3 gateway service
 *
 * Pair with:
 *  - junos/services/evpn-elan-mac-vrf-irb.conf
 *
 * Variables (example values from an3_acx7100-48l):
 *   $INSTANCE_NAME   e.g. evpn_group_60_4000
 *   $BD_NAME         e.g. V4000
 *   $AC_INTF         e.g. et-0/0/50.2000
 *   $IRB_UNIT        e.g. irb.4000
 *   $VLAN_BD         e.g. 4000
 *   $LOOPBACK_V4     e.g. 1.1.0.2
 *   $RD_ID           e.g. 14000
 *   $RT_ID           e.g. 14000
 *   $AS_LOCAL        e.g. 61535
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type mac-vrf;
        protocols {
            evpn {
                encapsulation mpls;
                default-gateway do-not-advertise;
                normalization;
                no-control-word;
            }
        }
        service-type vlan-based;
        route-distinguisher $LOOPBACK_V4:$RD_ID;
        vrf-target target:$AS_LOCAL:$RT_ID;
        vlans {
            $BD_NAME {
                vlan-id $VLAN_BD;
                interface $AC_INTF;
                l3-interface $IRB_UNIT;
            }
        }
    }
}
```

## evo/services/evpn-elan-mac-vrf.conf

```
/*
 * Topic:   EVPN-ELAN via mac-vrf routing-instance (MEF E-LAN) — EVO
 * Seen on:
 *   Junos: (none — Junos MX in this JVD use instance-type virtual-switch
 *           with `protocols evpn`; see junos/services/evpn-elan-mac-vrf.conf
 *           for the closest Junos analogue and notes on the difference)
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - mac-vrf is the EVO/Junos-Evolved equivalent of the Junos MX
 *    `instance-type evpn` + `bridge-domains` model. One mac-vrf
 *    holds one or more vlan-based bridge-domains, each MAC-learned
 *    per-EVI in EVPN.
 *  - service-type vlan-based — one VLAN per EVI (Type-1 service in
 *    RFC 7432 parlance). Use vlan-aware or vlan-bundle for multi-VLAN
 *    EVIs (see evo/services/evpn-port-based.conf for vlan-bundle).
 *  - encapsulation mpls — runs over SR-MPLS transport. Switch to
 *    `encapsulation vxlan` for a VXLAN data-plane DC fabric.
 *  - no-control-word avoids inserting a 4-byte CW (interop with
 *    legacy receivers; full ELAN service still works).
 *
 * Pair with:
 *  - junos/services/evpn-elan-mac-vrf.conf  (Junos MX virtual-switch flavour)
 *  - evo/transport/bgp-overlay.conf (family evpn signaling)
 *  - evo/interfaces/lag-esi-multihoming.conf
 *
 * Variables (example values from ma1-1_acx7024):
 *   $INSTANCE_NAME   e.g. evpn_group_90_700
 *                    (the vrf-export policy is named after the instance)
 *   $BD_NAME         e.g. BD_evpn_group_90_700
 *   $AC_INTF         e.g. ae12.700
 *   $VLAN_BD         e.g. 700
 *   $LOOPBACK_V4     e.g. 1.1.0.17
 *   $RD_ID           e.g. 7000
 *   $RT_ID           e.g. 7000
 *   $AS_LOCAL        e.g. 63535
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type mac-vrf;
        protocols {
            evpn {
                encapsulation mpls;
                no-control-word;
            }
        }
        service-type vlan-based;
        interface $AC_INTF;
        route-distinguisher $LOOPBACK_V4:$RD_ID;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$AS_LOCAL:$RT_ID;
        vlans {
            $BD_NAME {
                vlan-id $VLAN_BD;
                interface $AC_INTF;
            }
        }
    }
}
```

## evo/services/evpn-port-based.conf

```
/*
 * Topic:   Port-based EVPN-VPWS and port-based EVPN-ELAN
 * Seen on:
 *   Junos: —
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *              EVPN_VPWS_PORT_BASED, EVPN_ELAN_PORT_BASED }
 *
 * Highlights:
 *  - Both instances attach a single physical port (et-0/0/7.0,
 *    et-0/0/11.0) — useful for true Ethernet Private Line (EPL) /
 *    Ethernet Private LAN (EP-LAN) services where the customer owns
 *    the entire UNI (no VLAN tagging at the SP edge).
 *
 *  - EVPN_VPWS_PORT_BASED:
 *      instance-type evpn-vpws + vpws-service-id local/remote pair
 *      (signalled via EVPN Type-1)
 *
 *  - EVPN_ELAN_PORT_BASED:
 *      instance-type mac-vrf with service-type vlan-bundle
 *      (multiple customer VLANs share one bridge-domain / one mac-vrf)
 *
 * Pair with evo/apply-groups/gr-fatpw-label.conf for the
 * matching flow-label knobs on these naming patterns.
 *
 * Pair with:
 *  - junos/services/evpn-port-based.conf
 *
 * Variables (example values from an3_acx7100-48l):
 *   $AC_INTF_VPWS         e.g. et-0/0/7.0
 *   $AC_INTF_ELAN         e.g. et-0/0/11.0
 *   $BD_NAME              e.g. v-2
 *   $LOOPBACK_V4          e.g. 1.1.0.2
 *   $RD_ID_VPWS           e.g. 5500
 *   $RT_ID_VPWS           e.g. 5500
 *   $RD_ID_ELAN           e.g. 5565
 *   $RT_ID_ELAN           e.g. 6565
 *   $AS_LOCAL             e.g. 63535
 *   $VPWS_SVC_ID_LOCAL    e.g. 1
 *   $VPWS_SVC_ID_REMOTE   e.g. 2
 */
routing-instances {
    EVPN_VPWS_PORT_BASED {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_INTF_VPWS {
                    vpws-service-id {
                        local $VPWS_SVC_ID_LOCAL;
                        remote $VPWS_SVC_ID_REMOTE;
                    }
                }
            }
        }
        interface $AC_INTF_VPWS;
        route-distinguisher $LOOPBACK_V4:$RD_ID_VPWS;
        vrf-target target:$AS_LOCAL:$RT_ID_VPWS;
    }
    EVPN_ELAN_PORT_BASED {
        instance-type mac-vrf;
        protocols {
            evpn;
        }
        service-type vlan-bundle;
        route-distinguisher $LOOPBACK_V4:$RD_ID_ELAN;
        vrf-target target:$AS_LOCAL:$RT_ID_ELAN;
        vlans {
            $BD_NAME {
                interface $AC_INTF_ELAN;
            }
        }
    }
}
```

## evo/services/evpn-type5.conf

```
/*
 * Topic:   L3VPN VRF with EVPN Type-5 (IP-prefix routes) (EVO)
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - This snip is the L3 (RT-5) HALF of the JVD's EVPN-IRB pattern.
 *    In this JVD, Type-5 is ALWAYS paired with a matching EVPN-ELAN
 *    MAC-VRF (`evpn-elan-mac-vrf-irb.conf`) on the same `irb.<N>`,
 *    so the EVI advertises both RT-2 (MAC+IP from learned hosts via
 *    the MAC-VRF) and RT-5 (the IRB subnet, silent-host /32s, and
 *    any VRF static/learned prefixes via this VRF). "Pure" RT-5
 *    (VRF only, no MAC-VRF) is not deployed here.
 *  - The VRF's `interface irb.<N>` ties this VRF to the matching
 *    EVPN-ELAN MAC-VRF (`evo/services/evpn-elan-mac-vrf-irb.conf`)
 *    whose `l3-interface` is the same `irb.<N>`.
 *  - `advertise direct-nexthop encapsulation mpls` — emit Type-5
 *    routes with the local PE as direct next-hop, MPLS-encapsulated
 *    over the SR-MPLS underlay.
 *  - vrf-table-label — per-VRF aggregate label so the egress PE
 *    can do an L3 lookup on the inner header.
 *  - vrf-import / vrf-export point at the per-VRF policies in
 *    evo/policy/l3vpn-export-import.conf.
 *
 * Pair with:
 *  - junos/services/evpn-type5.conf  (Junos end of the same VRF)
 *  - evo/services/evpn-elan-mac-vrf-irb.conf  (the L2 / IRB side
 *    that owns irb.<N> — this is the bridge-domain whose MACs and
 *    silent-host IPs the Type-5 route exposes to remote PEs)
 *  - evo/apply-groups/gr-l3vpn.conf
 *  - evo/policy/l3vpn-export-import.conf
 *  - evo/transport/bgp-overlay.conf  (family evpn signaling)
 *
 * Variables (example values from an3_acx7100-48l / METRO_L3VPN_4000):
 *   $INSTANCE_NAME    e.g. METRO_L3VPN_4000
 *                     (the import/export policies are named
 *                      PS-${INSTANCE_NAME}-IMPORT / -EXPORT)
 *   $ROUTER_ID        e.g. 1.1.0.2
 *   $IRB_UNIT         e.g. 4000   (selects irb.<unit>)
 *   $RD               e.g. 63000:13000
 */
routing-instances {
    apply-groups GR-L3VPN;
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
        interface irb.$IRB_UNIT;
        route-distinguisher $RD;
        vrf-import PS-$INSTANCE_NAME-IMPORT;
        vrf-export PS-$INSTANCE_NAME-EXPORT;
        vrf-table-label;
    }
}
```

## evo/services/evpn-vpws.conf

```
/*
 * Topic:   EVPN-VPWS routing-instance (MEF E-Line) — EVO
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 mse1_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Same syntax as junos/services/evpn-vpws.conf — instance-type
 *    evpn-vpws + per-AC vpws-service-id local/remote pair. EVO and
 *    Junos use byte-identical config for EVPN-VPWS.
 *  - This snippet shows the ma1-1 _multi-homed_ end of the same E-Line
 *    that an1_mx204 carries on the Junos side: AC = ae12.2400 with
 *    ESI in evo/interfaces/lag-esi-multihoming.conf.
 *  - vrf-target is the per-instance route-target — together with the
 *    matching service-id pair on the remote PE this stitches the
 *    pseudowire end-to-end via EVPN Type-1 routes.
 *
 * Pair with:
 *  - junos/services/evpn-vpws.conf (remote single-homed end)
 *  - evo/interfaces/lag-esi-multihoming.conf (the AC interface)
 *  - evo/transport/bgp-overlay.conf (family evpn signaling)
 *
 * Variables (example values from ma1-1_acx7024):
 *   $INSTANCE_NAME       e.g. evpn_group_30_2400
 *   $AC_INTF             e.g. ae12.2400
 *   $LOOPBACK_V4         e.g. 1.1.0.17
 *   $RD_ID               e.g. 2400
 *   $RT_ID               e.g. 2400
 *   $AS_LOCAL            e.g. 63535
 *   $VPWS_SVC_ID_LOCAL   e.g. 2
 *   $VPWS_SVC_ID_REMOTE  e.g. 1
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_INTF {
                    vpws-service-id {
                        local $VPWS_SVC_ID_LOCAL;
                        remote $VPWS_SVC_ID_REMOTE;
                    }
                }
            }
        }
        interface $AC_INTF;
        route-distinguisher $LOOPBACK_V4:$RD_ID;
        vrf-target target:$AS_LOCAL:$RT_ID;
    }
}
```

## evo/services/l2circuit-hot-standby.conf

```
/*
 * Topic:   L2Circuit pseudowire with backup-neighbor hot-standby
 * Seen on:
 *   Junos: (none in JVD)
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - Static (LDP-signalled) L2Circuit PWs to a primary neighbor
 *    (1.1.0.6) with a backup-neighbor (1.1.0.7) for hot-standby
 *    redundancy. On primary failure the standby PW is brought up
 *    immediately (switchover-delay 0 from GR-L2CKT-HS).
 *  - virtual-circuit-id pairs identify the PW endpoints (3000/4000,
 *    3001/4001, …)
 *  - flow-label-{transmit,receive} for FAT-PW ECMP load balancing
 *  - control-word, encapsulation-type ethernet-vlan, ignore-mtu-mismatch
 *  - Per-PW transport-class community (CM-TC-MAP2GOLD) lets the PW
 *    follow a specific BGP-CT colour underlay
 *
 * Pair with:
 *  - evo/apply-groups/gr-l2ckt-hs.conf (hot-standby knobs)
 *  - evo/apply-groups/gr-fatpw-lb.conf (forwarding-options)
 *  - evo/policy/communities.conf (CM-TC-MAP2GOLD definition)
 *  - junos/services/l2circuit-hot-standby.conf
 *
 * Variables (example values from an3_acx7100-48l):
 *   $REMOTE_PE_V4    e.g. 1.1.0.6
 *   $BACKUP_PE_V4    e.g. 1.1.0.7
 *   $AC_INTF         e.g. et-0/0/0.3000
 *   $VC_ID           e.g. 3000
 *   $VC_ID_BACKUP    e.g. 4000
 */
protocols {
    l2circuit {
        neighbor $REMOTE_PE_V4 {
            interface $AC_INTF {
                virtual-circuit-id $VC_ID;
                control-word;
                flow-label-transmit;
                flow-label-receive;
                community CM-TC-MAP2GOLD;
                encapsulation-type ethernet-vlan;
                ignore-mtu-mismatch;
                pseudowire-status-tlv;
                backup-neighbor $BACKUP_PE_V4 {
                    virtual-circuit-id $VC_ID_BACKUP;
                    community CM-TC-MAP2GOLD;
                    hot-standby;
                }
            }
        }
    }
}
```

## evo/services/l2vpn-kompella.conf

```
/*
 * Topic:   BGP-signalled L2VPN (Kompella) routing-instance, port-based
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - instance-type l2vpn  → BGP-signalled (Kompella) draft-Kompella PW
 *  - Single attachment-circuit (et-0/0/8.0) on the local site (1102),
 *    cross-connected to remote-site-id 1119 on a peer PE
 *  - encapsulation-type ethernet (port-based — entire interface is the AC)
 *  - no-control-word matches the remote PE
 *  - vrf-target establishes the BGP route-target community for the L2VPN
 *
 * Pair with:
 *  - junos/transport/bgp-overlay.conf (family l2vpn signaling)
 *  - evo/apply-groups/gr-fatpw-label.conf (matches L2VPN_PORT_BASED)
 *  - junos/services/l2vpn-kompella.conf
 *
 * Variables (example values from an3_acx7100-48l):
 *   $L2VPN_SITE              e.g. r2
 *   $L2VPN_LOCAL_SITE_ID     e.g. 1102
 *   $L2VPN_REMOTE_SITE_ID    e.g. 1119
 *   $AC_INTF                 e.g. et-0/0/8.0
 *   $RD                      e.g. 63535:6500
 *   $RT                      e.g. 63535:6500
 */
routing-instances {
    L2VPN_PORT_BASED {
        instance-type l2vpn;
        protocols {
            l2vpn {
                site $L2VPN_SITE {
                    interface $AC_INTF {
                        remote-site-id $L2VPN_REMOTE_SITE_ID;
                    }
                    site-identifier $L2VPN_LOCAL_SITE_ID;
                }
                encapsulation-type ethernet;
                no-control-word;
            }
        }
        interface $AC_INTF;
        route-distinguisher $RD;
        vrf-target target:$RT;
    }
}
```

## evo/services/l3vpn-vrf.conf

```
/*
 * Topic:   L3VPN routing-instance (vrf) with PE-CE BGP
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - instance-type vrf
 *  - PE-CE BGP session: eBGP (peer-as 64514 vs local 63535) with
 *    as-override so customer routes don't see the provider AS twice
 *  - Per-VRF route-distinguisher (63535:2101) keeps overlapping customer
 *    prefixes unique inside the BGP-VPN tables
 *  - Per-direction policies (PS-…-IMPORT / -EXPORT) — see
 *    evo/policy/l3vpn-export-import.conf for the policy text
 *  - vrf-table-label provided by apply-group GR-L3VPN
 *    (see evo/apply-groups/gr-l3vpn.conf)
 *
 * Pair with:
 *  - evo/apply-groups/gr-l3vpn.conf
 *  - evo/policy/l3vpn-export-import.conf
 *  - junos/transport/bgp-overlay.conf (family inet-vpn)
 *  - junos/services/l3vpn-vrf.conf
 *
 * Variables (example values from an3_acx7100-48l / instance METRO_BGPv4_L3VPN_2101):
 *   $INSTANCE_NAME    e.g. METRO_BGPv4_L3VPN_2101
 *                     (the import/export policies are named
 *                      PS-${INSTANCE_NAME}-IMPORT / -EXPORT)
 *   $ROUTER_ID        e.g. 1.1.0.2
 *   $AC_INTF          e.g. et-0/0/4.2101
 *   $CE_PEER_V4       e.g. 13.2.0.2
 *   $PE_LOCAL_V4      e.g. 13.2.0.1
 *   $AS_CUST          e.g. 64514
 *   $RD               e.g. 63535:2101
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            router-id $ROUTER_ID;
        }
        protocols {
            bgp {
                group v4Ixia {
                    family inet {
                        any;
                    }
                    neighbor $CE_PEER_V4 {
                        local-address $PE_LOCAL_V4;
                        peer-as $AS_CUST;
                        as-override;
                    }
                }
            }
        }
        interface $AC_INTF;
        route-distinguisher $RD;
        vrf-import PS-${INSTANCE_NAME}-IMPORT;
        vrf-export PS-${INSTANCE_NAME}-EXPORT;
        vrf-table-label;
    }
}
```

## evo/services/ldp-vpls.conf

```
/*
 * Topic:   LDP-VPLS (virtual-switch with vpls-id)
 * Seen on:
 *   Junos: (none in JVD)
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - instance-type virtual-switch  → multi-VLAN MAC learning domain
 *  - protocols vpls with vpls-id 30000 + neighbor → LDP-signalled VPLS
 *    (no BGP RT/RD on this instance because the remote PW is identified
 *    by vpls-id, not BGP route-target)
 *  - no-tunnel-services for ACX/MX hardware that does not require a
 *    tunnel PIC for VPLS
 *  - Single VLAN (EPL-v0) bridges the attachment-circuit et-0/0/53.0
 *    to all remote PEs in the VPLS domain
 *
 * For BGP-VPLS, replace `vpls-id`/`neighbor` with `site` / `route-target`
 * (see KB-VPLS-TEST in the source file for that variant).
 *
 * Pair with:
 *  - junos/services/bgp-vpls.conf  (BGP-VPLS sibling pattern, Junos only)
 *
 * Variables (example values from an3_acx7100-48l):
 *   $INSTANCE_NAME    e.g. KB-VPLS-EPL
 *   $BD_NAME          e.g. EPL-v0
 *   $AC_INTF          e.g. et-0/0/53.0
 *   $REMOTE_PE_V4     e.g. 1.1.0.19
 *   $VC_ID            e.g. 30000   (used here as vpls-id)
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-switch;
        protocols {
            vpls {
                neighbor $REMOTE_PE_V4;
                no-tunnel-services;
                vpls-id $VC_ID;
            }
        }
        vlans {
            $BD_NAME {
                interface $AC_INTF;
            }
        }
    }
}
```

## evo/transport/bgp-overlay.conf

```
/*
 * Topic:   iBGP overlay sessions to RR (EVO)
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   ma1-1_acx7024 (and all other EVO PEs)
 *
 * Highlights:
 *  - Two iBGP groups: one for inet/inet6 labeled-unicast (transport
 *    underlay, group GR-IBGP-MDR) and one for service AFs (group
 *    ibgp_mse_mpbgp: inet-vpn, l2vpn signaling, evpn signaling,
 *    route-target).
 *  - labeled-unicast with rib inet.3 + add-path send/receive
 *    (path-count 4) for ECMP across SR transport tunnels.
 *  - family route-target with nexthop-resolution no-resolution —
 *    standard RT-constrain optimisation.
 *  - BFD 200ms × 3 on the BGP session itself (in addition to ISIS BFD).
 *  - export PS-BGP-TRANSPORT-EXPORT advertises this PE's loopback
 *    into the transport AF.
 *  - vpn-apply-export + advertise-from-main-vpn-tables — required
 *    so per-VRF export policies see VPN routes correctly when this
 *    box is also a service PE.
 *
 * Pair with:
 *  - junos/transport/bgp-overlay.conf
 *  - evo/apply-groups/gr-bgp-bcp.conf
 *
 * Variables (example values from ma1-1_acx7024):
 *   $LOOPBACK_V4         e.g. 1.1.0.17
 *   $TRANSPORT_RR1_V4    e.g. 1.1.0.12
 *   $TRANSPORT_RR2_V4    e.g. 1.1.0.13
 *   $SVC_RR1_V4          e.g. 1.1.0.10
 *   $SVC_RR2_V4          e.g. 1.1.0.11
 */
protocols {
    bgp {
        apply-groups GR-BGP-BCP;
        advertise-from-main-vpn-tables;
        vpn-apply-export;
        group GR-IBGP-MDR {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
                    rib-group RG-REMOTE-LOOPBACKS;
                    rib {
                        inet.3;
                    }
                    explicit-null connected-only;
                }
                transport {
                    add-path {
                        receive;
                        send {
                            path-count 4;
                        }
                    }
                }
            }
            family inet6 {
                labeled-unicast {
                    rib {
                        inet6.3;
                    }
                }
                transport {
                    add-path {
                        receive;
                        send {
                            path-count 4;
                        }
                    }
                }
            }
            family route-target {
                nexthop-resolution {
                    no-resolution;
                }
            }
            export PS-BGP-TRANSPORT-EXPORT;
            bfd-liveness-detection {
                minimum-interval 200;
                multiplier 3;
            }
            neighbor $TRANSPORT_RR1_V4;
            neighbor $TRANSPORT_RR2_V4;
        }
        group ibgp_mse_mpbgp {
            type internal;
            local-address $LOOPBACK_V4;
            family inet-vpn {
                unicast;
            }
            family l2vpn {
                signaling;
            }
            family evpn {
                signaling;
            }
            family route-target {
                nexthop-resolution {
                    no-resolution;
                }
            }
            export nhs1;
            bfd-liveness-detection {
                minimum-interval 200;
                multiplier 3;
            }
            neighbor $SVC_RR1_V4;
            neighbor $SVC_RR2_V4;
        }
        log-updown;
        graceful-restart;
        multipath;
    }
}
```

## evo/transport/isis-srmpls-tilfa.conf

```
/*
 * Topic:   ISIS underlay with SR-MPLS, TI-LFA and Flex-Algo (EVO)
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ma1-1_acx7024 (and all other EVO PEs in the JVD)
 *
 * Highlights:
 *  - source-packet-routing (SR-MPLS) with per-router node-segment IDs
 *    (ipv4-index 17, ipv6-index 117 on this PE) into the global SRGB
 *    (16000–24000, set in protocols mpls).
 *  - flex-algorithm [ 128 129 ] — two custom topologies (here
 *    delay-optimised and color-constrained) advertised alongside the
 *    default 0/SPF.
 *  - strict-asla-based-flex-algorithm — only ASLA-tagged links
 *    participate in flex-algo computation (clean separation).
 *  - TI-LFA: post-convergence-lfa with node-protection on every core
 *    interface, plus backup-spf-options use-source-packet-routing
 *    so backup paths are computed via SR (label-stack push, no LDP).
 *  - microloop-avoidance with 5 s post-convergence delay.
 *  - BFD 100ms × 3 no-adaptation under family inet — sub-second
 *    failure detection that triggers TI-LFA.
 *
 * Pair with:
 *  - junos/transport/isis-srmpls-tilfa.conf
 *  - evo/transport/mpls-segment-routing.conf
 *  - evo/apply-groups/gr-isis-bcp.conf
 *
 * Variables (example values from ma1-1_acx7024):
 *   $CORE_INTF     e.g. ae83.0   (repeat the per-interface block
 *                                  for each additional core link)
 *   $NODE_SID_V4   e.g. 17
 *   $NODE_SID_V6   e.g. 117
 *   $ISIS_NET      e.g. 49.0001.0010.0100.0017.00
 */
protocols {
    isis {
        apply-groups GR-ISIS-BCP;
        interface $CORE_INTF {
            level 2 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 5;
                        admin-group [ green blue ];
                        application {
                            flex-algorithm;
                        }
                    }
                }
            }
            delay-metric 5;
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
        source-packet-routing {
            node-segment {
                ipv4-index $NODE_SID_V4;
                ipv6-index $NODE_SID_V6;
            }
            flex-algorithm [ 128 129 ];
            strict-asla-based-flex-algorithm;
            explicit-null;
            traffic-statistics {
                statistics-granularity per-interface;
            }
        }
        level 1 disable;
        level 2 wide-metrics-only;
        spf-options {
            microloop-avoidance {
                post-convergence-path {
                    delay 5000;
                }
            }
        }
        backup-spf-options {
            use-post-convergence-lfa maximum-labels 3;
            use-source-packet-routing;
        }
        traffic-engineering {
            advertisement {
                application-specific {
                    all-applications;
                }
            }
        }
        export PS-ISIS-EXPORT;
        net $ISIS_NET;
    }
}
```

## evo/transport/mpls-segment-routing.conf

```
/*
 * Topic:   MPLS / segment-routing chassis-wide knobs (EVO)
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ma1-1_acx7024 (and all other EVO PEs)
 *
 * Highlights:
 *  - admin-groups blue/green/red define link colours used by ISIS ASLA
 *    and by Flex-Algorithm constraint sets — same colour numbering as
 *    Junos to keep flex-algo deterministic across mixed fabrics.
 *  - srgb-label-range 16000 24000 — global SR label block (matches
 *    Junos PEs exactly so SR-MPLS labels are network-wide stable).
 *  - ipv6-tunneling — required for SR-MPLS IPv6 services over the
 *    same SR-MPLS plane.
 *  - icmp-tunneling preserves end-to-end traceroute through MPLS.
 *
 * Pair with:
 *  - junos/transport/mpls-segment-routing.conf
 *  - evo/transport/isis-srmpls-tilfa.conf
 *
 * Variables: none. All values here (admin-group numbers, SRGB range)
 * are JVD-wide constants — same on every PE.
 */
protocols {
    mpls {
        admin-groups {
            blue 1;
            green 2;
            red 3;
        }
        no-propagate-ttl;
        icmp-tunneling;
        label-range {
            srgb-label-range 16000 24000;
        }
        ipv6-tunneling;
    }
}
```

## junos/apply-groups/gr-bgp-bcp.conf

```
/*
 * Apply-group: GR-BGP-BCP
 * Seen on:
 *   Junos: an1_mx204 (and other Junos PEs)
 *   EVO:   (EVO PEs use GR-BGP-BCP too)
 *
 * Best-current-practice BGP knobs:
 *  - external-router-id path-selection
 *  - precision-timers + low hold-time for fast convergence
 *  - bgp-error-tolerance to keep sessions up on minor update errors
 *  - tcp-mss aligned with jumbo MTU
 *
 * Pair with:
 *  - evo/apply-groups/gr-bgp-bcp.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    GR-BGP-BCP {
        protocols {
            bgp {
                path-selection external-router-id;
                precision-timers;
                hold-time 10;
                bgp-error-tolerance;
                tcp-mss 4096;
            }
        }
    }
}
```

## junos/apply-groups/gr-core-intf.conf

```
/*
 * Apply-group: GR-CORE-INTF
 * Seen on:
 *   Junos: an1_mx204 (and other Junos PEs)
 *   EVO:   (EVO PEs use GR-CORE-INTF too)
 *
 * Templated baseline for core/underlay-facing interfaces:
 *  - jumbo MTU at the physical layer (9192)
 *  - per-family MTU override under each unit (inet/iso/mpls)
 *  - mpls family with maximum-labels 14 (SR-MPLS / TI-LFA stacks)
 *  - LACP active for aggregated members
 *
 * Pair with:
 *  - evo/apply-groups/gr-core-intf.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    GR-CORE-INTF {
        interfaces {
            <*> {
                description "********GR-CORE-INTF-SETTINGS-APPLIED ********";
                traps;
                mtu 9192;
                hold-time up 2000 down 0;
                unit <*> {
                    traps;
                    family inet {
                        mtu 9106;
                    }
                    family iso {
                        mtu 9106;
                    }
                    family mpls {
                        mtu 9170;
                        maximum-labels 14;
                    }
                }
            }
            <ae*> {
                aggregated-ether-options {
                    lacp {
                        active;
                        hold-time up 2;
                    }
                }
            }
        }
    }
}
```

## junos/apply-groups/gr-edge-intf-mh.conf

```
/*
 * Apply-group: GR-EDGE-INTF-MH
 * Seen on:
 *   Junos: an1_mx204 (and other Junos ANs)
 *   EVO:   (EVO uses GR-EDGE-INTF-MH too — see evo/apply-groups/)
 *
 * Variant of GR-EDGE-INTF for multi-homed edge interfaces (no
 * hold-time configured — managed via ESI/EVPN convergence instead).
 *
 * Pair with:
 *  - evo/apply-groups/gr-edge-intf-mh.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    GR-EDGE-INTF-MH {
        interfaces {
            <*> {
                description ********GR-EDGE-INTF-Multihomed-SETTINGS-APPLIED-ADD-DESCRIPTION********;
                traps;
                flexible-vlan-tagging;
                mtu 9102;
                encapsulation flexible-ethernet-services;
            }
        }
    }
}
```

## junos/apply-groups/gr-edge-intf.conf

```
/*
 * Apply-group: GR-EDGE-INTF
 * Seen on:
 *   Junos: an1_mx204 (and other Junos ANs)
 *   EVO:   (EVO uses GR-EDGE-INTF too — see evo/apply-groups/)
 *
 * Templated baseline for customer-facing (edge) interfaces.
 * Applied to physical and aggregated-ethernet interfaces to set
 * common properties (description marker, MTU, flex-vlan tagging,
 * flex-ethernet-services encapsulation, optics alarm/warning).
 *
 * Apply with:   set interfaces et-0/0/0 apply-groups GR-EDGE-INTF
 *
 * Pair with:
 *  - evo/apply-groups/gr-edge-intf.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    GR-EDGE-INTF {
        interfaces {
            <*> {
                description ********GR-EDGE-INTF-SETTINGS-APPLIED-ADD-DESCRIPTION********;
                traps;
                flexible-vlan-tagging;
                mtu 9102;
                hold-time up 180000 down 0;
                encapsulation flexible-ethernet-services;
            }
            <ae*> {
                aggregated-ether-options {
                    lacp {
                        active;
                        accept-data;
                        hold-time up 2;
                    }
                }
            }
            "<[egx][te]-*>" {
                optics-options {
                    alarm low-light-alarm {
                        link-down;
                    }
                    warning low-light-warning {
                        syslog;
                    }
                }
            }
        }
    }
}
```

## junos/apply-groups/gr-fatpw-label.conf

```
/*
 * Topic:   Per-instance FAT-PW flow-label knob (Junos)
 * Seen on:
 *   Junos: ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Junos uses wildcard routing-instance names (<l2vpn_*>, <vpls_*>,
 *    plus the singleton L2VPN_PORT_BASED) to enable
 *    flow-label-transmit / flow-label-receive on every L2VPN and VPLS
 *    instance via apply-groups inheritance.
 *  - EVO equivalent (evo/apply-groups/gr-fatpw-label.conf) targets the
 *    EVPN_VPWS_PORT_* wildcard and uses
 *    flow-label-transmit-static / flow-label-receive-static under
 *    `protocols evpn` (EVPN family, not l2vpn/vpls). Both achieve the
 *    same end goal of FAT-label-aware pseudowires.
 *  - Apply this group at the device level alongside GR-FATPW-LB.
 *
 * Pair with:
 *  - evo/apply-groups/gr-fatpw-label.conf
 *  - junos/apply-groups/gr-fatpw-lb.conf
 *  - junos/services/l2vpn-kompella.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    GR-FATPW-LABEL {
        routing-instances {
            <l2vpn_*> {
                protocols {
                    l2vpn {
                        flow-label-transmit;
                        flow-label-receive;
                    }
                }
            }
            <vpls_*> {
                protocols {
                    vpls {
                        flow-label-transmit;
                        flow-label-receive;
                    }
                }
            }
            L2VPN_PORT_BASED {
                protocols {
                    l2vpn {
                        flow-label-transmit;
                        flow-label-receive;
                    }
                }
            }
        }
    }
}
```

## junos/apply-groups/gr-fatpw-lb.conf

```
/*
 * Topic:   FAT-PW load-balancing capability (Junos)
 * Seen on:
 *   Junos: ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Identical to evo/apply-groups/gr-fatpw-lb.conf — Junos and
 *    Junos Evolved share the same FAT-PW config.
 *  - load-balance-label-capability under forwarding-options enables
 *    the PE to push and to honour Flow-Aware Transport (FAT) labels
 *    on pseudowires. Per-flow ECMP across the SR-MPLS core for
 *    L2VPN / VPLS / EVPN-VPWS pseudowires that would otherwise be
 *    label-stack-stuck on a single LSP.
 *  - Pair this group with GR-FATPW-LABEL (per-instance flow-label
 *    knob) — see junos/apply-groups/gr-fatpw-label.conf.
 *
 * Pair with:
 *  - evo/apply-groups/gr-fatpw-lb.conf
 *  - junos/apply-groups/gr-fatpw-label.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    GR-FATPW-LB {
        forwarding-options {
            load-balance-label-capability;
        }
    }
}
```

## junos/apply-groups/gr-isis-bcp.conf

```
/*
 * Apply-group: GR-ISIS-BCP
 * Seen on:
 *   Junos: an1_mx204 (and other Junos PEs)
 *   EVO:   (EVO PEs use GR-ISIS-BCP too)
 *
 * Best-current-practice ISIS knobs applied to the protocols { isis }
 * stanza. Tunes hello sizes for jumbo links, SPF timers, and
 * overload-on-startup behaviour for graceful insertion.
 *
 * Pair with:
 *  - evo/apply-groups/gr-isis-bcp.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    GR-ISIS-BCP {
        protocols {
            isis {
                interface <ae*> {
                    max-hello-size 9106;
                    lsp-interval 10;
                }
                interface <et-*> {
                    max-hello-size 9106;
                    lsp-interval 10;
                }
                spf-options {
                    delay 50;
                    holddown 2000;
                    rapid-runs 5;
                }
                overload {
                    timeout 300;
                }
            }
        }
    }
}
```

## junos/apply-groups/gr-isis-bfd.conf

```
/*
 * Topic:   ISIS BFD apply-group (50 ms × 3, no-adaptation)
 * Seen on:
 *   Junos: (none in this JVD as a group — Junos PEs configure BFD
 *           inline per-interface under `protocols isis interface ...
 *           family inet { bfd-liveness-detection { ... } }`. See
 *           junos/transport/isis-srmpls-tilfa.conf for the inline
 *           pattern, which is functionally equivalent.)
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - On EVO (an3) the BFD timers are factored into a reusable
 *    apply-group `GR-ISIS-BFD` that gets applied to every ISIS
 *    interface. The Junos PEs in this JVD instead inline the same
 *    BFD config per-interface — the on-the-wire behaviour is identical
 *    (50 ms detection × 3 multiplier, no-adaptation).
 *  - To migrate Junos PEs to the same group-based pattern, lift the
 *    `family inet { bfd-liveness-detection { ... } }` block out of
 *    each interface and into a wildcard interface stanza inside a
 *    group named GR-ISIS-BFD, then `apply-groups GR-ISIS-BFD` under
 *    `protocols isis`.
 *  - Both styles are valid; this file documents the abstraction
 *    used on EVO and the Junos equivalent inline pattern.
 *
 * Pair with:
 *  - evo/apply-groups/gr-isis-bfd.conf
 *  - junos/transport/isis-srmpls-tilfa.conf  (inline BFD example)
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    /*
     * Reference shape — not deployed on Junos PEs in this JVD.
     * Inline BFD is used instead; see pair-with file above.
     */
    GR-ISIS-BFD {
        protocols {
            isis {
                interface <ae*> {
                    family inet {
                        bfd-liveness-detection {
                            minimum-interval 50;
                            multiplier 3;
                            no-adaptation;
                        }
                    }
                }
                interface <et-*> {
                    family inet {
                        bfd-liveness-detection {
                            minimum-interval 50;
                            multiplier 3;
                            no-adaptation;
                        }
                    }
                }
            }
        }
    }
}
```

## junos/apply-groups/gr-l2ckt-hs.conf

```
/*
 * Topic:   L2Circuit hot-standby apply-group
 * Seen on:
 *   Junos: (none in this JVD — Junos PEs use L2Circuit with static
 *           pseudowires but do not deploy the hot-standby /
 *           backup-neighbor pattern in the validated configs)
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - On EVO an3 the L2Circuit hot-standby knobs are factored into a
 *    reusable group; the equivalent on Junos PEs would be the same
 *    `pseudowire-status-tlv hot-standby-vc-on` and `switchover-delay 0`
 *    placed under `protocols l2circuit neighbor X interface ...`.
 *  - This file is included for symmetry with
 *    evo/apply-groups/gr-l2ckt-hs.conf and to flag that the
 *    hot-standby pattern is NOT validated on Junos PEs in this JVD —
 *    use it as a reference template if you adopt L2Circuit
 *    hot-standby on a Junos box.
 *
 * Pair with:
 *  - evo/apply-groups/gr-l2ckt-hs.conf
 *  - junos/services/l2circuit-hot-standby.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    /* Reference shape — not deployed on Junos PEs in this JVD. */
    GR-L2CKT-HS {
        protocols {
            l2circuit {
                neighbor <*> {
                    interface <*> {
                        pseudowire-status-tlv hot-standby-vc-on;
                        switchover-delay 0;
                    }
                }
            }
        }
    }
}
```

## junos/apply-groups/gr-l3vpn.conf

```
/*
 * Topic:   L3VPN VRF apply-group baseline (Junos)
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Identical to evo/apply-groups/gr-l3vpn.conf — Junos and EVO
 *    share this VRF baseline.
 *  - Wildcard `<METRO_*>` matches every L3VPN routing-instance whose
 *    name starts with METRO_ (the JVD's L3VPN naming convention),
 *    so per-VRF stanzas only need to set router-id, neighbour, RT
 *    and interface — the boilerplate below comes from the group.
 *  - vpn-unequal-cost — load-balance across BGP paths with different
 *    IGP cost (Anycast next-hops, multi-homed CEs).
 *  - protect core — enables IGP/SR fast-reroute protection inside the
 *    VRF on routes installed via the core RIB.
 *  - vrf-table-label — per-VRF aggregate label so MX/PTX-class PEs
 *    can do egress L3 lookup (required for IRB / firewall/NAT in VRF).
 *
 * Pair with:
 *  - evo/apply-groups/gr-l3vpn.conf
 *  - junos/services/l3vpn-vrf.conf
 *  - junos/policy/l3vpn-export-import.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    GR-L3VPN {
        routing-instances {
            <METRO_*> {
                instance-type vrf;
                routing-options {
                    multipath {
                        vpn-unequal-cost;
                    }
                    protect core;
                }
                vrf-table-label;
            }
        }
    }
}
```

## junos/apply-groups/gr-lag-member.conf

```
/*
 * Topic:   LAG-member templates: edge SH/MH and core (Junos)
 * Seen on:
 *   Junos: ma5_mx204 (and other Junos PEs with LAG)
 *   EVO:   ma1-1_acx7024 (and all other EVO PEs with LAG)
 *
 * Highlights:
 *  - Three apply-groups for the three roles a physical member port can
 *    play in this JVD: GR-EDGE-INTF-LAG-MEMBER (single-homed access),
 *    GR-EDGE-INTF-LAG-MEMBER-MH (multihomed access), and
 *    GR-CORE-INTF-LAG-MEMBER (core-facing).
 *  - All three set traps + optics low-light-alarm/warning so the
 *    member port itself raises link-down on optical failure
 *    (independent of LACP).
 *  - hold-time up 180000 down 0 on edge members (3-min damp on bring-up)
 *    vs hold-time up 2000 down 0 on core members (faster).
 *  - Identical to evo/apply-groups/gr-lag-member.conf.
 *
 * Pair with:
 *  - evo/apply-groups/gr-lag-member.conf
 *  - junos/interfaces/lag-esi-multihoming.conf
 *  - junos/interfaces/core-isis-mpls.conf
 *
 * Variables: none. Apply-groups in this JVD are entirely
 *            wildcard-driven (e.g. <ae*>, <METRO_*>) and carry
 *            only network-wide constants — there are no per-PE
 *            values to parameterise.
 */
groups {
    GR-EDGE-INTF-LAG-MEMBER {
        interfaces {
            <*> {
                traps;
                hold-time up 180000 down 0;
                optics-options {
                    alarm low-light-alarm {
                        link-down;
                    }
                    warning low-light-warning {
                        syslog;
                    }
                }
            }
        }
    }
    GR-EDGE-INTF-LAG-MEMBER-MH {
        interfaces {
            <*> {
                traps;
                hold-time up 180000 down 0;
                optics-options {
                    alarm low-light-alarm {
                        link-down;
                    }
                    warning low-light-warning {
                        syslog;
                    }
                }
            }
        }
    }
    GR-CORE-INTF-LAG-MEMBER {
        interfaces {
            <*> {
                description "********GR-CORE-INTF-LAG-MEMBERS-SETTINGS-APPLIED ********";
                traps;
                hold-time up 2000 down 0;
                optics-options {
                    alarm low-light-alarm {
                        link-down;
                    }
                    warning low-light-warning {
                        syslog;
                    }
                }
            }
        }
    }
}
```

## junos/cos/forwarding-classes.conf

```
/*
 * Topic:   CoS forwarding-classes (queue model)
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   (all EVO devices)
 *
 * 6-class model used across the Metro EBS CoS design:
 *   queue 0  BEST-EFFORT
 *   queue 1  MEDIUM
 *   queue 2  REALTIME
 *   queue 3  SIG-OAM
 *   queue 4  CONTROL
 *   queue 5  BUSINESS
 *
 * Pair with junos/cos/schedulers.conf for the matching
 * scheduler-map and per-class scheduler definitions.
 *
 * Pair with:
 *  - evo/cos/forwarding-classes.conf
 *
 * Variables: none. All values here are JVD-wide constants
 *            (queue numbers, class names, scheduler weights,
 *            community names, policer rates) — same on every PE.
 */
class-of-service {
    forwarding-classes {
        class BEST-EFFORT queue-num 0;
        class BUSINESS queue-num 5;
        class CONTROL queue-num 4;
        class MEDIUM queue-num 1;
        class REALTIME queue-num 2;
        class SIG-OAM queue-num 3;
    }
}
```

## junos/cos/schedulers.conf

```
/*
 * Topic:   CoS schedulers and scheduler-map
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   (all EVO devices)
 *
 * 6-class scheduler model used by the 5G_SCHEDULER scheduler-map:
 *
 *   class         priority      transmit-rate     buffer-size
 *   ----------    -----------   --------------    ------------
 *   REALTIME      strict-high   40%               30%
 *   BUSINESS      low           20%               20%
 *   MEDIUM        low           20%               20%
 *   CONTROL       low            5%                2%
 *   SIG-OAM       low            5%                2%
 *   BEST-EFFORT   low           remainder         remainder
 *
 * Pair with junos/cos/forwarding-classes.conf for queue mapping.
 * Bind to interfaces with:
 *   set class-of-service interfaces <name> scheduler-map 5G_SCHEDULER
 *
 * Pair with:
 *  - evo/cos/schedulers.conf
 *
 * Variables: none. All values here are JVD-wide constants
 *            (queue numbers, class names, scheduler weights,
 *            community names, policer rates) — same on every PE.
 */
class-of-service {
    scheduler-maps {
        5G_SCHEDULER {
            forwarding-class BEST-EFFORT scheduler BEST-EFFORT-SC;
            forwarding-class BUSINESS scheduler BUSINESS-SC;
            forwarding-class CONTROL scheduler CONTROL-SC;
            forwarding-class MEDIUM scheduler MEDIUM-SC;
            forwarding-class REALTIME scheduler REALTIME-SC;
            forwarding-class SIG-OAM scheduler SIG-OAM-SC;
        }
    }
    schedulers {
        BEST-EFFORT-SC {
            transmit-rate {
                remainder;
            }
            buffer-size {
                remainder;
            }
            priority low;
        }
        BUSINESS-SC {
            transmit-rate percent 20;
            buffer-size percent 20;
            priority low;
        }
        CONTROL-SC {
            transmit-rate percent 5;
            buffer-size percent 2;
            priority low;
        }
        MEDIUM-SC {
            transmit-rate percent 20;
            buffer-size percent 20;
            priority low;
        }
        REALTIME-SC {
            transmit-rate percent 40;
            buffer-size percent 30;
            priority strict-high;
        }
        SIG-OAM-SC {
            transmit-rate percent 5;
            buffer-size percent 2;
            priority low;
        }
    }
}
```

## junos/firewall/policers.conf

```
/*
 * Topic:   Firewall policers and rate-limit filter
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 ma4_mx204 ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Two reusable rate-limit policers (5 Mbps and 50 Mbps) and an
 * interface-specific family-any filter that drops traffic
 * exceeding 50 Mbps. Apply with:
 *
 *   set interfaces <ifd> unit <unit> family any filter input 50MB_filter
 *
 * Pair with:
 *  - evo/firewall/policers.conf
 *
 * Variables: none. All values here are JVD-wide constants
 *            (queue numbers, class names, scheduler weights,
 *            community names, policer rates) — same on every PE.
 */
firewall {
    family any {
        filter 50MB_filter {
            interface-specific;
            term t1 {
                then policer 50mbps_policer;
            }
        }
    }
    policer 50mbps_policer {
        if-exceeding {
            bandwidth-limit 50m;
            burst-size-limit 10m;
        }
        then discard;
    }
    policer 5mbps_policer {
        if-exceeding {
            bandwidth-limit 5m;
            burst-size-limit 1m;
        }
        then discard;
    }
}
```

## junos/interfaces/core-isis-mpls.conf

```
/*
 * Topic:   Core-facing LAG (ISIS + MPLS underlay attachment)
 * Seen on:
 *   Junos: (all Junos)
 *   EVO:   (all EVO)
 *
 * A core-facing aggregated-ethernet bundle to the upstream AG (AG1.1).
 * Carries the SR-MPLS underlay: family inet/iso/mpls plus IPv6 for 6PE.
 *
 * Common core knobs (jumbo MTU 9192, per-family MTU overrides,
 * mpls maximum-labels 14, LACP) come from apply-groups GR-CORE-INTF
 * (see apply-groups/gr-core-intf).
 *
 * Pair with:
 *  - evo/interfaces/core-isis-mpls.conf
 *
 * Variables (example values from an1_mx204):
 *   $CORE_PHYS         e.g. ae71
 *   $CORE_DESC         e.g. "to AG1.1 rtme-acx7100-32c-a ae71"
 *   $CORE_V4_ADDR      e.g. 10.10.0.197/30
 *   $CORE_V6_ADDR      e.g. 2001::10:10:0:c5/126
 */
interfaces {
    $CORE_PHYS {
        apply-groups GR-CORE-INTF;
        description $CORE_DESC;
        mtu 9192;
        aggregated-ether-options {
            minimum-links 1;
            lacp {
                active;
                periodic fast;
            }
        }
        unit 0 {
            family inet {
                address $CORE_V4_ADDR;
            }
            family iso;
            family inet6 {
                address $CORE_V6_ADDR;
            }
            family mpls;
        }
    }
}
```

## junos/interfaces/edge-vlan-normalization.conf

```
/*
 * Topic:   Edge port with VLAN normalization (push/pop)  (Junos)
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 ma4_mx204 ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Same vlan-map push/pop pattern as
 *    evo/interfaces/edge-vlan-normalization.conf — Junos and EVO use
 *    identical syntax.
 *  - Mixed unit types on one physical AE: vlan-bridge units (798, 799)
 *    feed EVPN-ELAN bridge-domains directly, while vlan-ccc units
 *    (2400, 2401, …) feed EVPN-VPWS instances.
 *  - input-vlan-map push / output-vlan-map pop normalises customer
 *    VLAN-IDs (2400, 2401, …) to service-internal VLAN-IDs (3800,
 *    3801, …) at the SP edge — keeps the customer's VLAN namespace
 *    decoupled from the SP's, and lets two customers reuse the same
 *    VLAN ID without conflict.
 *  - Per-unit `esi { ... all-active; }` enables EVPN multihoming
 *    on each AC; the matching parent ae* config (LACP system-id,
 *    flexible-vlan-tagging) is in junos/interfaces/lag-esi-multihoming.conf.
 *
 * Pair with:
 *  - evo/interfaces/edge-vlan-normalization.conf
 *  - junos/interfaces/lag-esi-multihoming.conf
 *  - junos/services/evpn-vpws.conf  (vlan-ccc units)
 *  - junos/services/evpn-elan-mac-vrf.conf  (vlan-bridge units)
 *
 * Variables (example values from an1_mx204):
 *   $AC_PHYS    e.g. ae11   (the parent AE; the per-unit blocks
 *                            below show the repeating pattern —
 *                            each AC has its own VLAN, ESI, and
 *                            push/pop map)
 */
interfaces {
    $AC_PHYS {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        unit 798 {
            encapsulation vlan-bridge;
            vlan-id 798;
            esi {
                00:70:11:11:11:11:11:00:00:63;
                all-active;
            }
        }
        unit 2400 {
            encapsulation vlan-ccc;
            vlan-id 2400;
            input-vlan-map {
                push;
                vlan-id 3800;
            }
            output-vlan-map pop;
            esi {
                00:10:11:11:30:11:01:00:00:00;
                all-active;
            }
        }
        unit 2401 {
            encapsulation vlan-ccc;
            vlan-id 2401;
            input-vlan-map {
                push;
                vlan-id 3801;
            }
            output-vlan-map pop;
            esi {
                00:10:11:11:30:11:01:01:00:00;
                all-active;
            }
        }
    }
}
```

## junos/interfaces/lag-esi-multihoming.conf

```
/*
 * Topic:   Edge LAG with EVPN ESI multihoming (active/active)
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * One aggregated-ethernet bundle (ae11) carrying multiple service units
 * with per-unit ESI for EVPN active/active multihoming. Three patterns:
 *
 *   - Unit 101 (vlan-ccc):     EVPN-VPWS attachment-circuit
 *   - Unit 700 (vlan-bridge):  EVPN-ELAN with df-election preference
 *   - Units 701..704:          EVPN-ELAN, default DF election
 *
 * Each unit has a unique ESI (last bytes encode the service-id),
 * all-active redundancy, and matching encapsulation for the
 * routing-instance type. LACP runs with a deterministic system-id so
 * both PEs in the multihome group present the same LAG identity to
 * the CE.
 *
 * Common edge knobs (description, MTU, flex-vlan, encap) come from
 * apply-groups GR-EDGE-INTF-MH (see apply-groups/gr-edge-intf-mh).
 *
 * Pair with:
 *  - evo/interfaces/lag-esi-multihoming.conf
 *
 * Variables (example values from an1_mx204):
 *   $AC_PHYS         e.g. ae11   (the multihomed AE)
 *   $LACP_SYS_ID     e.g. 00:00:00:00:00:01
 *                    (must be IDENTICAL on both PEs in the
 *                    multihome pair so the CE sees one LAG)
 */
interfaces {
    $AC_PHYS {
        apply-groups GR-EDGE-INTF-MH;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            minimum-links 1;
            lacp {
                active;
                periodic fast;
                system-id $LACP_SYS_ID;
            }
        }
        unit 101 {
            encapsulation vlan-ccc;
            vlan-id 101;
            esi {
                00:10:11:11:11:11:01:00:00:00;
                all-active;
            }
        }
        unit 700 {
            encapsulation vlan-bridge;
            vlan-id 700;
            esi {
                00:70:11:11:11:11:11:00:00:01;
                all-active;
                df-election-type {
                    preference;
                }
            }
        }
        unit 701 {
            encapsulation vlan-bridge;
            vlan-id 701;
            esi {
                00:70:11:11:11:11:11:00:00:02;
                all-active;
            }
        }
    }
}
```

## junos/oam/oam-cfm-perf-mon.conf

```
/*
 * Topic:   Y.1731 performance-monitoring (CFM) with HW timestamping
 * Seen on:
 *   Junos: an4_acx710 ma5_mx204
 *   EVO:   an3_acx7100-48l ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Identical structure to evo/oam/oam-cfm-perf-mon.conf —
 *    Junos and Junos Evolved share the OAM CFM config language.
 *  - hardware-assisted-timestamping puts the Y.1731 DM/SLM packet
 *    timestamps in the PFE/Trio rather than the RE — required for
 *    accurate sub-millisecond delay/loss measurements.
 *  - enhanced-sla-iterator + measurement-interval 5 → finer
 *    statistics granularity.
 *  - sla-iterator-profile 2WD-P3: two-way-delay measurements at
 *    1 s cycle / 2 s iteration, weighting delay and delay-variation
 *    equally — feeds Bin-and-percentile stats for SLA reporting.
 *  - One maintenance-domain MD_63535 at level 5 with one
 *    maintenance-association per attachment-circuit unit. Each
 *    MEP has remote-mep entries pointing at the far-end MEPs on
 *    the peer PEs (1002 and 1006 here).
 *
 * Pair with:
 *  - evo/oam/oam-cfm-perf-mon.conf
 *
 * Variables (example values from an4_acx710):
 *   $MD_NAME         e.g. MD_63535
 *   $MA_ID           e.g. 1100
 *   $MEP_LOCAL       e.g. 1019
 *   $MEP_REMOTE_1    e.g. 1002
 *   $MEP_REMOTE_2    e.g. 1006
 *   $AC_INTF         e.g. xe-0/1/4.400
 */
protocols {
    oam {
        ethernet {
            connectivity-fault-management {
                performance-monitoring {
                    hardware-assisted-timestamping;
                    enhanced-sla-iterator;
                    measurement-interval 5;
                    sla-iterator-profiles {
                        2WD-P3 {
                            measurement-type two-way-delay;
                            cycle-time 1000;
                            iteration-period 2000;
                            calculation-weight {
                                delay 300;
                                delay-variation 300;
                            }
                        }
                    }
                }
                maintenance-domain $MD_NAME {
                    level 5;
                    name-format none;
                    maintenance-association $MA_ID {
                        short-name-format 2octet;
                        continuity-check {
                            interval 1s;
                            loss-threshold 10;
                            hold-interval 1;
                        }
                        mep $MEP_LOCAL {
                            interface $AC_INTF;
                            direction up;
                            remote-mep $MEP_REMOTE_1 {
                                sla-iterator-profile 2WD-P3 {
                                    priority 1;
                                }
                            }
                            remote-mep $MEP_REMOTE_2 {
                                sla-iterator-profile 2WD-P3 {
                                    priority 1;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
```

## junos/policy/communities.conf

```
/*
 * Topic:   BGP communities — fabric tags, BGP-CT colors, L3VPN RTs (Junos)
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304 (and other Junos PEs)
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Identical to evo/policy/communities.conf — Junos and EVO use the
 *    same `community NAME members ...` syntax for standard, extended
 *    and color communities.
 *  - **Topology tags** (CM-METRO-FABRIC, CM-METRO-RING, CM-REGION-EDGE,
 *    CM-REGIONAL-BORDER, CM-SERVICE-EDGE, CM-ACCESS-FABRIC,
 *    CM-LOOPBACK) — standard communities used in transport-export
 *    policies to identify which part of the network a prefix came
 *    from (used for hierarchical RR / route filtering).
 *  - **BGP-CT color communities** (CM-TC-MAP2GOLD = color:0:4000,
 *    CM-TC-MAP2BRONZE = color:0:6000) — RFC 9012 color extended
 *    communities that map a service onto a transport-class /
 *    flex-algorithm. Setting CM-TC-MAP2GOLD on a service route causes
 *    its next-hop to resolve via the Gold transport plane (typically
 *    flex-algo 128, low-delay).
 *  - **L3VPN service RTs** (CM-INET-PRIMARY, CM-INET-DEFAULT,
 *    CM-INET-BACKUP, CM-L3VPN-PUB) — `target:` extended communities
 *    used by per-VRF policies in junos/policy/l3vpn-export-import.conf.
 *  - CM-NO-ADVERTISE — the well-known no-advertise community for
 *    leak-prevention.
 *
 * Pair with:
 *  - evo/policy/communities.conf
 *  - junos/policy/l3vpn-export-import.conf
 *  - junos/services/l3vpn-vrf.conf
 *
 * Variables: none. All values here are JVD-wide constants
 *            (queue numbers, class names, scheduler weights,
 *            community names, policer rates) — same on every PE.
 */
policy-options {
    community CM-ACCESS-FABRIC members 63535:2;
    community CM-INET-BACKUP members target:63536:99999;
    community CM-INET-DEFAULT members target:63536:11111;
    community CM-INET-PRIMARY members target:63536:00000;
    community CM-L3VPN-PUB members target:63536:22222;
    community CM-LOOPBACK members 63536:10000;
    community CM-METRO-FABRIC members 63535:1;
    community CM-METRO-RING members 63536:20;
    community CM-NO-ADVERTISE members no-advertise;
    community CM-REGION-EDGE members 63536:30;
    community CM-REGIONAL-BORDER members 63535:3;
    community CM-SERVICE-EDGE members 63536:10;
    community CM-TC-MAP2BRONZE members color:0:6000;
    community CM-TC-MAP2GOLD members color:0:4000;
    /* Per-VRF route-target communities (one per L3VPN service): */
    community METRO_BGPv4_L3VPN_1001 members target:63536:1001;
}
```

## junos/policy/l3vpn-export-import.conf

```
/*
 * Topic:   Per-VRF L3VPN export / import policies (Junos)
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Identical structure to evo/policy/l3vpn-export-import.conf —
 *    Junos and EVO share the same policy-options syntax for L3VPN.
 *  - EXPORT policy has two terms:
 *      tag-public-routes  → match customer public route-filters,
 *                           tag with both the per-VPN RT
 *                           (METRO_BGPv4_L3VPN_1001), the public
 *                           community (CM-L3VPN-PUB) and the BGP-CT
 *                           color community (CM-TC-MAP2GOLD).
 *      tag-default        → tag everything else with just the per-VPN
 *                           RT and color, then accept.
 *  - IMPORT policy:
 *      L3VPN-CUST  → accept routes carrying the per-VPN RT
 *                    (route-target community match).
 *      INTERNET    → optionally pull in the shared INTERNET default
 *                    via CM-INET-DEFAULT (managed Internet-in-VRF
 *                    feature).
 *  - Each VRF has its own pair of policies; the per-VPN RT community
 *    name matches the routing-instance name (DRY pattern).
 *
 * Pair with:
 *  - evo/policy/l3vpn-export-import.conf
 *  - junos/policy/communities.conf
 *  - junos/services/l3vpn-vrf.conf
 *
 * Variables (example values from ma4_mx204 / METRO_BGPv4_L3VPN_1001):
 *   $INSTANCE_NAME    e.g. METRO_BGPv4_L3VPN_1001
 *                     (the per-VRF community, the EXPORT and the
 *                     IMPORT policy all share this name; the
 *                     community is also defined in
 *                     junos/policy/communities.conf)
 *   $CE_PREFIX_1      e.g. 17.2.0.0/16
 *   $CE_PREFIX_2      e.g. 18.2.0.0/16
 *   $CE_PREFIX_3      e.g. 19.2.0.0/16
 */
policy-options {
    policy-statement ${INSTANCE_NAME}-EXPORT {
        term tag-public-routes {
            from {
                route-filter $CE_PREFIX_1 orlonger;
                route-filter $CE_PREFIX_2 orlonger;
                route-filter $CE_PREFIX_3 orlonger;
            }
            then {
                community add CM-L3VPN-PUB;
                community add $INSTANCE_NAME;
                community add CM-TC-MAP2GOLD;
                accept;
            }
        }
        term tag-default {
            then {
                community add $INSTANCE_NAME;
                community add CM-TC-MAP2GOLD;
                accept;
            }
        }
    }
    policy-statement ${INSTANCE_NAME}-IMPORT {
        term L3VPN-CUST {
            from community $INSTANCE_NAME;
            then accept;
        }
        term INTERNET {
            from community CM-INET-DEFAULT;
            then accept;
        }
    }
}
```

## junos/services/bgp-vpls.conf

```
/*
 * Topic:   BGP-VPLS (Kompella VPLS, RFC 4761) via virtual-switch
 * Seen on:
 *   Junos: ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   (none — EVO PEs in this JVD use LDP-VPLS instead;
 *           see evo/services/ldp-vpls.conf)
 *
 * Highlights:
 *  - instance-type virtual-switch with `protocols vpls` carrying
 *    `site $NAME { site-identifier $ID; }` — this site/site-id
 *    pair is what makes it BGP-VPLS rather than LDP-VPLS.
 *  - BGP NLRI exchange (family l2vpn signaling) replaces LDP
 *    targeted-session signalling; site-id / site-range /
 *    label-block-size on each PE compute the PE-to-PE pseudowire
 *    label blocks (RFC 4761 §3 math).
 *  - virtual-switch (vs. plain `instance-type vpls`) lets one
 *    routing-instance hold multiple bridge-domains, each with its
 *    own VLAN — useful for vlan-aware service multiplexing on MX.
 *  - bridge-options no-normalization — the AC keeps its customer
 *    VLAN tag rather than being re-tagged at the BD boundary
 *    (vlan-aware passthrough mode).
 *  - The JVD does NOT deploy LDP-VPLS on Junos PEs (no `vpls-id`
 *    + `neighbor` static config exists in any Junos conf/*.conf),
 *    nor does it deploy LDP-VPLS with BGP auto-discovery (no
 *    `l2vpn-id` form). For pure LDP-VPLS see the EVO snip.
 *
 * Pair with:
 *  - evo/services/ldp-vpls.conf  (LDP-VPLS sibling pattern, EVO only)
 *  - junos/apply-groups/gr-fatpw-label.conf  (vpls_* wildcard FAT-PW)
 *  - junos/transport/bgp-overlay.conf  (family l2vpn signaling)
 *
 * Variables (example values from ma5_mx204 / vpls_group_108_800):
 *   $INSTANCE_NAME      e.g. vpls_group_108_800
 *                       (the vrf-export policy is named after the instance)
 *   $L2VPN_SITE         e.g. r19
 *   $SITE_ID            e.g. 3
 *   $BD_NAME            e.g. vlan800
 *   $VLAN_BD            e.g. 800
 *   $AC_INTF            e.g. xe-0/1/4.800
 *   $RD                 e.g. 64535:81000
 *   $RT                 e.g. 64535:1183000
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-switch;
        protocols {
            vpls {
                site $L2VPN_SITE {
                    site-identifier $SITE_ID;
                }
                site-range 10;
                label-block-size 8;
                no-tunnel-services;
            }
        }
        bridge-domains {
            $BD_NAME {
                vlan-id $VLAN_BD;
                interface $AC_INTF;
                bridge-options {
                    no-normalization;
                }
            }
        }
        route-distinguisher $RD;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$RT;
    }
}
```

## junos/services/evpn-elan-mac-vrf-irb.conf

```
/*
 * Topic:   EVPN-ELAN with integrated IRB (Junos)
 * Seen on:
 *   Junos: (none in this JVD — the MX PEs in this validated set
 *           keep EVPN-ELAN bridging and L3 in separate instances;
 *           reference template only)
 *   EVO:   an3_acx7100-48l ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - EVO uses `instance-type mac-vrf` with `l3-interface irb.X` to
 *    integrate L2 (EVPN-ELAN) and L3 (anycast IRB) in one instance.
 *    See evo/services/evpn-elan-mac-vrf-irb.conf for the validated
 *    pattern.
 *  - On Junos MX the historically equivalent pattern is
 *    `instance-type virtual-switch` with `protocols evpn` and a
 *    bridge-domain whose `routing-interface irb.X` is in a separate
 *    L3VPN VRF — this is what the JVD's MX PEs do today (split
 *    instance model).
 *  - Reference shape below shows how a Junos MX could be migrated
 *    to a single mac-vrf-with-IRB instance type to match EVO. The
 *    JVD does not validate this on MX — keep the split model unless
 *    you have a reason to converge.
 *
 * Pair with:
 *  - evo/services/evpn-elan-mac-vrf-irb.conf
 *  - junos/services/evpn-elan-mac-vrf.conf
 *  - junos/services/l3vpn-vrf.conf
 *
 * Variables (illustrative — not deployed on Junos in this JVD):
 *   $INSTANCE_NAME   e.g. evpn_group_60_4000
 *   $BD_NAME         e.g. BD_evpn_group_60_4000
 *   $AC_INTF         e.g. ae12.4000
 *   $IRB_UNIT        e.g. irb.4000
 *   $VLAN_BD         e.g. 4000
 *   $LOOPBACK_V4     e.g. 1.1.0.10
 *   $RD_ID           e.g. 4000
 *   $RT_ID           e.g. 4000
 *   $AS_LOCAL        e.g. 63535
 */
routing-instances {
    /* Reference shape — not deployed on Junos PEs in this JVD. */
    $INSTANCE_NAME {
        instance-type mac-vrf;
        protocols {
            evpn {
                encapsulation mpls;
                no-control-word;
            }
        }
        service-type vlan-based;
        interface $AC_INTF;
        l3-interface $IRB_UNIT;
        route-distinguisher $LOOPBACK_V4:$RD_ID;
        vrf-target target:$AS_LOCAL:$RT_ID;
        vlans {
            $BD_NAME {
                vlan-id $VLAN_BD;
                interface $AC_INTF;
                l3-interface $IRB_UNIT;
            }
        }
    }
}
```

## junos/services/evpn-elan-mac-vrf.conf

```
/*
 * Topic:   EVPN-ELAN (mac-vrf) routing-instance (MEF E-LAN)
 * Seen on:
 *   Junos: —
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - instance-type evpn (mac-vrf style for EVPN-ELAN)
 *  - encapsulation mpls (SR-MPLS underlay)
 *  - vlan-id none + no-normalization → port-based bridging, no VLAN
 *    rewrite at egress; attachment-circuit drives the bridge domain
 *  - no-control-word: matches the remote PE behaviour
 *  - vrf-export references a per-service policy that adds the
 *    correct route-target community
 *  - Attachment-circuit (ae11.700) has esi/all-active in interfaces
 *    snippet for active/active multihoming
 *
 * Pair with:
 *  - junos/transport/bgp-overlay.conf (family evpn signaling)
 *  - junos/interfaces/lag-esi-multihoming.conf
 *  - evo/services/evpn-elan-mac-vrf.conf
 *
 * Variables (example values from an1_mx204):
 *   $INSTANCE_NAME   e.g. evpn_group_90_700
 *                    (the vrf-export policy is named after the instance)
 *   $AC_INTF         e.g. ae11.700
 *   $LOOPBACK_V4     e.g. 1.1.0.0
 *   $RD_ID           e.g. 7000
 *   $RT_ID           e.g. 7000
 *   $AS_LOCAL        e.g. 63535
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn;
        protocols {
            evpn {
                encapsulation mpls;
                no-control-word;
            }
        }
        vlan-id none;
        no-normalization;
        interface $AC_INTF;
        route-distinguisher $LOOPBACK_V4:$RD_ID;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$AS_LOCAL:$RT_ID;
    }
}
```

## junos/services/evpn-port-based.conf

```
/*
 * Topic:   Port-based EVPN-VPWS / EVPN-ELAN  (Junos)
 * Seen on:
 *   Junos: (none in this JVD — port-based EVPN attachments are
 *           EVO-only here; reference template only)
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - "Port-based" attachment means a non-tagged unit (unit 0,
 *    encapsulation ethernet-ccc) is the AC, and the routing-instance
 *    binds to the whole port — typical for EPL services where the
 *    customer-facing port carries one and only one service.
 *  - EVO uses `service-type vlan-bundle` on a mac-vrf for the EVPN-ELAN
 *    flavour (untagged frames + a bundle of VLANs go into one EVI),
 *    plus a plain EVPN-VPWS instance with vpws-service-id pair on
 *    the unit-0 AC for the EVPL flavour.
 *  - Junos syntax for the same pair is shown below as a reference.
 *    The JVD does NOT validate this on MX — Junos PEs in the JVD
 *    use VLAN-tagged (vlan-ccc) ACs everywhere.
 *
 * Pair with:
 *  - evo/services/evpn-port-based.conf
 *  - junos/services/evpn-vpws.conf  (vlan-tagged variant, validated)
 *
 * Variables (illustrative — not deployed on Junos in this JVD):
 *   $AC_INTF_VPWS         e.g. xe-0/1/2.0
 *   $AC_INTF_ELAN         e.g. xe-0/1/3.0
 *   $LOOPBACK_V4          e.g. 1.1.0.10
 *   $RD_ID_VPWS           e.g. 5500
 *   $RT_ID_VPWS           e.g. 5500
 *   $RD_ID_ELAN           e.g. 5600
 *   $RT_ID_ELAN           e.g. 5600
 *   $AS_LOCAL             e.g. 63535
 *   $VPWS_SVC_ID_LOCAL    e.g. 1
 *   $VPWS_SVC_ID_REMOTE   e.g. 2
 */
routing-instances {
    /* Reference shape — not deployed on Junos PEs in this JVD. */
    EVPN_VPWS_PORT_BASED {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_INTF_VPWS {
                    vpws-service-id {
                        local $VPWS_SVC_ID_LOCAL;
                        remote $VPWS_SVC_ID_REMOTE;
                    }
                }
            }
        }
        interface $AC_INTF_VPWS;
        route-distinguisher $LOOPBACK_V4:$RD_ID_VPWS;
        vrf-target target:$AS_LOCAL:$RT_ID_VPWS;
    }
    EVPN_ELAN_PORT_BASED {
        instance-type mac-vrf;
        protocols {
            evpn {
                encapsulation mpls;
                no-control-word;
            }
        }
        service-type vlan-bundle;
        interface $AC_INTF_ELAN;
        route-distinguisher $LOOPBACK_V4:$RD_ID_ELAN;
        vrf-target target:$AS_LOCAL:$RT_ID_ELAN;
    }
}
```

## junos/services/evpn-type5.conf

```
/*
 * Topic:   L3VPN VRF with EVPN Type-5 (IP-prefix routes) (Junos)
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - This snip is the L3 (RT-5) HALF of the JVD's EVPN-IRB pattern.
 *    In this JVD, Type-5 is ALWAYS paired with a matching EVPN-ELAN
 *    MAC-VRF (`evpn-elan-mac-vrf-irb.conf`) on the same `irb.<N>`,
 *    so the EVI advertises both RT-2 (MAC+IP from learned hosts via
 *    the MAC-VRF) and RT-5 (the IRB subnet, silent-host /32s, and
 *    any VRF static/learned prefixes via this VRF). "Pure" RT-5
 *    (VRF only, no MAC-VRF) is not deployed here.
 *  - The VRF's `interface irb.<N>` ties this VRF to the matching
 *    L2 service (MAC-VRF on EVO, virtual-switch on Junos) whose
 *    `l3-interface` / `routing-interface` is the same `irb.<N>`.
 *  - `advertise direct-nexthop encapsulation mpls` — emit Type-5
 *    routes with the local PE as direct next-hop, MPLS-encapsulated
 *    over the SR-MPLS underlay (no VXLAN here — this is a
 *    metro-MPLS deployment).
 *  - vrf-table-label — per-VRF aggregate label so the egress PE
 *    can do an L3 lookup on the inner header (standard IRB pattern).
 *  - vrf-import / vrf-export point at the per-VRF policies in
 *    junos/policy/l3vpn-export-import.conf — same shape as the
 *    PE-CE-eBGP L3VPN, just a different RT to keep the two
 *    families separate.
 *
 * Pair with:
 *  - evo/services/evpn-type5.conf  (EVO end of the same VRF)
 *  - For the L2 / IRB side that owns irb.<N>:
 *      evo/services/evpn-elan-mac-vrf-irb.conf  (EVO mate)
 *      Junos virtual-switch + bridge-domains + routing-interface
 *      (no dedicated snip yet — see deployed pattern in
 *       service_provider/.../conf/mse1_mx304.conf).
 *  - junos/apply-groups/gr-l3vpn.conf
 *  - junos/policy/l3vpn-export-import.conf
 *  - junos/transport/bgp-overlay.conf  (family evpn signaling)
 *
 * Variables (example values from mse1_mx304 / METRO_L3VPN_4000):
 *   $INSTANCE_NAME    e.g. METRO_L3VPN_4000
 *                     (the import/export policies are named
 *                      PS-${INSTANCE_NAME}-IMPORT / -EXPORT)
 *   $ROUTER_ID        e.g. 1.1.0.10
 *   $IRB_UNIT         e.g. 4000   (selects irb.<unit>)
 *   $RD               e.g. 63200:13000
 */
routing-instances {
    apply-groups GR-L3VPN;
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
        interface irb.$IRB_UNIT;
        route-distinguisher $RD;
        vrf-import PS-$INSTANCE_NAME-IMPORT;
        vrf-export PS-$INSTANCE_NAME-EXPORT;
        vrf-table-label;
    }
}
```

## junos/services/evpn-vpws.conf

```
/*
 * Topic:   EVPN-VPWS routing-instance (MEF E-Line)
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 mse1_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - instance-type evpn-vpws
 *  - Single attachment-circuit (ae11.2400) with vpws-service-id local/remote
 *    pair (1 / 2) — the EVPN-VPWS service identifier exchanged via
 *    EVPN Type-1 routes
 *  - Per-instance route-distinguisher and vrf-target define the VPN scope
 *  - The matching attachment-circuit interface (vlan-ccc encap, ESI for
 *    multihoming) lives in junos/interfaces/lag-esi-multihoming.conf
 *
 * Pair with:
 *  - junos/transport/bgp-overlay.conf (family evpn signaling)
 *  - junos/interfaces/lag-esi-multihoming.conf
 *  - evo/services/evpn-vpws.conf
 *
 * Variables (example values from an1_mx204):
 *   $INSTANCE_NAME       e.g. evpn_group_30_2400
 *   $AC_INTF             e.g. ae11.2400
 *   $LOOPBACK_V4         e.g. 1.1.0.0
 *   $RD_ID               e.g. 2400
 *   $RT_ID               e.g. 2400
 *   $AS_LOCAL            e.g. 63535
 *   $VPWS_SVC_ID_LOCAL   e.g. 1
 *   $VPWS_SVC_ID_REMOTE  e.g. 2
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_INTF {
                    vpws-service-id {
                        local $VPWS_SVC_ID_LOCAL;
                        remote $VPWS_SVC_ID_REMOTE;
                    }
                }
            }
        }
        interface $AC_INTF;
        route-distinguisher $LOOPBACK_V4:$RD_ID;
        vrf-target target:$AS_LOCAL:$RT_ID;
    }
}
```

## junos/services/l2circuit-hot-standby.conf

```
/*
 * Topic:   L2Circuit with backup-neighbor (hot-standby pseudowire)
 * Seen on:
 *   Junos: (none in this JVD — Junos PEs use static-pseudowire
 *           L2Circuit without backup-neighbor; reference template only)
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - Junos PEs (mse1_mx304, mse2_mx304) DO carry L2Circuit, but use
 *    the static-pseudowire flavour (incoming/outgoing-label) without
 *    the hot-standby backup-neighbor option that an3 demonstrates.
 *  - Below is a reference shape for how the same hot-standby PW would
 *    look on Junos if you adopted the pattern: primary `neighbor X`
 *    with the AC interface, plus `backup-neighbor Y { hot-standby; }`
 *    so the PE pre-signals both PWs and switches over locally on
 *    primary failure (sub-second switchover, no LDP withdrawal wait).
 *  - For the actual EVO pattern with FAT-PW + community-mapping see
 *    evo/services/l2circuit-hot-standby.conf.
 *
 * Pair with:
 *  - evo/services/l2circuit-hot-standby.conf
 *  - junos/apply-groups/gr-l2ckt-hs.conf  (reference apply-group shape)
 *
 * Variables (illustrative — not deployed on Junos in this JVD):
 *   $REMOTE_PE_V4    e.g. 1.1.0.18
 *   $BACKUP_PE_V4    e.g. 1.1.0.19
 *   $AC_INTF         e.g. ae12.3000
 *   $VC_ID           e.g. 3000
 */
protocols {
    /* Reference shape — not deployed on Junos PEs in this JVD. */
    l2circuit {
        neighbor $REMOTE_PE_V4 {
            interface $AC_INTF {
                virtual-circuit-id $VC_ID;
                pseudowire-status-tlv hot-standby-vc-on;
                community CM-TC-MAP2GOLD;
                backup-neighbor $BACKUP_PE_V4 {
                    hot-standby;
                }
                ignore-encapsulation-mismatch;
            }
        }
    }
}
```

## junos/services/l2vpn-kompella.conf

```
/*
 * Topic:   BGP-signalled (Kompella) L2VPN, port-based (Junos)
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - instance-type l2vpn — Kompella-style, BGP-signalled pseudowire
 *    (RFC 4761). Compare to LDP-VPLS / EVPN-VPWS for two other ways
 *    to do the same job.
 *  - site r19 with site-identifier 1119 and remote-site-id 1102 —
 *    the BGP L2VPN NLRI uses these IDs to compute the local/remote
 *    label-block offsets (see RFC 4761 §3 for the math).
 *  - encapsulation-type ethernet — port-based (the entire AC interface
 *    is one VC, no VLAN demux). no-control-word for compatibility.
 *  - route-distinguisher / vrf-target tie this VPN scope across PEs.
 *  - The matching attachment-circuit is xe-0/1/2.0 (a port-mode unit,
 *    not vlan-tagged).
 *
 * Pair with:
 *  - evo/services/l2vpn-kompella.conf  (remote PE end)
 *  - junos/apply-groups/gr-fatpw-label.conf  (FAT-PW for L2VPN)
 *  - junos/transport/bgp-overlay.conf  (family l2vpn signaling)
 *
 * Variables (example values from ma5_mx204):
 *   $L2VPN_SITE              e.g. r19
 *   $L2VPN_LOCAL_SITE_ID     e.g. 1119
 *   $L2VPN_REMOTE_SITE_ID    e.g. 1102
 *   $AC_INTF                 e.g. xe-0/1/2.0
 *   $RD                      e.g. 60535:8500
 *   $RT                      e.g. 63535:6500
 */
routing-instances {
    apply-groups GR-FATPW-LABEL;
    L2VPN_PORT_BASED {
        instance-type l2vpn;
        protocols {
            l2vpn {
                site $L2VPN_SITE {
                    interface $AC_INTF {
                        remote-site-id $L2VPN_REMOTE_SITE_ID;
                    }
                    site-identifier $L2VPN_LOCAL_SITE_ID;
                }
                encapsulation-type ethernet;
                no-control-word;
            }
        }
        interface $AC_INTF;
        route-distinguisher $RD;
        vrf-target target:$RT;
    }
}
```

## junos/services/l3vpn-vrf.conf

```
/*
 * Topic:   L3VPN VRF with PE-CE eBGP and as-override (Junos)
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Identical instance shape to evo/services/l3vpn-vrf.conf — the
 *    GR-L3VPN apply-group fills in instance-type vrf, multipath
 *    vpn-unequal-cost, protect core, vrf-table-label so each VRF
 *    only needs to set router-id, peer, RD, RT and AC interface.
 *  - PE-CE eBGP under group v4Ixia: family inet any, peer-as 64514
 *    (the customer ASN), `as-override` so the PE rewrites the
 *    customer's own ASN out of AS_PATH on the return direction
 *    (textbook "hub-and-spoke per-customer ASN" workaround).
 *  - route-distinguisher 63536:41001 — RD scopes routes per-PE/VRF
 *    so an L3VPN prefix can appear with multiple RDs across MH PEs.
 *  - vrf-import / vrf-export point at the per-VRF policies in
 *    junos/policy/l3vpn-export-import.conf.
 *
 * Pair with:
 *  - evo/services/l3vpn-vrf.conf  (EVO end of the same VRF)
 *  - junos/apply-groups/gr-l3vpn.conf
 *  - junos/policy/l3vpn-export-import.conf
 *  - junos/transport/bgp-overlay.conf  (family inet-vpn signaling)
 *
 * Variables (example values from ma4_mx204 / instance METRO_BGPv4_L3VPN_1001):
 *   $INSTANCE_NAME    e.g. METRO_BGPv4_L3VPN_1001
 *                     (the import/export policies are named
 *                      ${INSTANCE_NAME}-IMPORT / -EXPORT)
 *   $ROUTER_ID        e.g. 1.1.0.16
 *   $AC_INTF          e.g. xe-0/1/4.1001
 *   $CE_PEER_V4       e.g. 17.2.0.2
 *   $PE_LOCAL_V4      e.g. 17.2.0.1
 *   $AS_CUST          e.g. 64514
 *   $RD               e.g. 63536:41001
 */
routing-instances {
    apply-groups GR-L3VPN;
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            router-id $ROUTER_ID;
        }
        protocols {
            bgp {
                group v4Ixia {
                    family inet {
                        any;
                    }
                    neighbor $CE_PEER_V4 {
                        local-address $PE_LOCAL_V4;
                        peer-as $AS_CUST;
                        as-override;
                    }
                }
            }
        }
        interface $AC_INTF;
        route-distinguisher $RD;
        vrf-import ${INSTANCE_NAME}-IMPORT;
        vrf-export ${INSTANCE_NAME}-EXPORT;
        vrf-table-label;
    }
}
```

## junos/transport/bgp-overlay.conf

```
/*
 * Topic:   iBGP overlay session to route reflectors (multi-AF)
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Single iBGP group GR-IBGP-MEG-RR carrying every overlay AF needed
 *    for the MEF service portfolio:
 *        inet labeled-unicast (BGP-LU underlay)   + add-path send/receive 4
 *        inet-vpn unicast                          (L3VPN IPv4)
 *        inet6 labeled-unicast                     + add-path send/receive 4
 *        inet6-vpn unicast                         (L3VPN IPv6)
 *        l2vpn signaling                           (BGP-VPLS / L2VPN)
 *        evpn signaling                            (EVPN-VPWS, EVPN-ELAN, EVPN-FXC, ETREE)
 *        route-target with no-resolution           (RTC for scaling RR filtering)
 *  - rib-group RG-REMOTE-LOOPBACKS leaks remote loopbacks into inet.3
 *    so service NHs resolve over labelled paths
 *  - BFD 100ms x 3 for fast session failure detection
 *  - graceful-restart + multipath
 *  - BCP knobs inherited from apply-groups GR-BGP-BCP
 *
 * Pair with:
 *  - evo/transport/bgp-overlay.conf
 *
 * Variables (example values from an1_mx204):
 *   $LOOPBACK_V4   e.g. 1.1.0.0
 *   $RR1_V4        e.g. 1.1.0.6
 *   $RR2_V4        e.g. 1.1.0.7
 */
protocols {
    bgp {
        apply-groups GR-BGP-BCP;
        advertise-from-main-vpn-tables;
        vpn-apply-export;
        group GR-IBGP-MEG-RR {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
                    rib-group RG-REMOTE-LOOPBACKS;
                    rib {
                        inet.3;
                    }
                    explicit-null connected-only;
                }
                transport {
                    add-path {
                        receive;
                        send {
                            path-count 4;
                        }
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
                transport {
                    add-path {
                        receive;
                        send {
                            path-count 4;
                        }
                    }
                }
            }
            family inet6-vpn {
                unicast;
            }
            family l2vpn {
                signaling;
            }
            family evpn {
                signaling;
            }
            family route-target {
                nexthop-resolution {
                    no-resolution;
                }
            }
            export PS-BGP-EXPORT;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor $RR1_V4;
            neighbor $RR2_V4;
        }
        log-updown;
        graceful-restart;
        multipath;
    }
}
```

## junos/transport/isis-srmpls-tilfa.conf

```
/*
 * Topic:   ISIS underlay with SR-MPLS, TI-LFA, and Flex-Algo
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - source-packet-routing (Segment Routing) with SRGB 16000-24000
 *    (set in the mpls stanza) and node-segment indices (v4=0, v6=100)
 *  - Flex-algorithm 128 / 129 with strict-asla-based selection
 *  - Per-interface ASLA attribute groups (te-metric, admin-group)
 *    advertised via traffic-engineering for color-aware paths
 *  - post-convergence-lfa with node-protection (TI-LFA)
 *  - microloop-avoidance with 5-second post-convergence delay
 *  - BFD on family inet (100ms x 3) for sub-50ms link-failure detection
 *  - Inherits BCP knobs from apply-groups GR-ISIS-BCP
 *
 * Pair with:
 *  - evo/transport/isis-srmpls-tilfa.conf
 *
 * Variables (example values from an1_mx204):
 *   $CORE_INTF_1   e.g. ae71.0   (one stanza per core neighbour;
 *   $CORE_INTF_2   e.g. ae72.0    repeat the per-interface block)
 *   $NODE_SID_V4   e.g. 0
 *   $NODE_SID_V6   e.g. 100
 */
protocols {
    isis {
        apply-groups GR-ISIS-BCP;
        interface $CORE_INTF_1 {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 110;
                        admin-group [ blue green ];
                        application {
                            flex-algorithm;
                        }
                    }
                }
            }
            delay-metric 105;
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
        interface $CORE_INTF_2 {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 110;
                        admin-group [ blue green ];
                        application {
                            flex-algorithm;
                        }
                    }
                }
            }
            delay-metric 105;
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
        source-packet-routing {
            node-segment {
                ipv4-index $NODE_SID_V4;
                ipv6-index $NODE_SID_V6;
            }
            flex-algorithm [ 128 129 ];
            strict-asla-based-flex-algorithm;
            explicit-null;
            traffic-statistics {
                statistics-granularity per-interface;
            }
        }
        level 1 {
            purge-originator empty;
            wide-metrics-only;
        }
        level 2 disable;
        spf-options {
            microloop-avoidance {
                post-convergence-path {
                    delay 5000;
                }
            }
        }
        backup-spf-options {
            use-post-convergence-lfa maximum-labels 3;
            use-source-packet-routing;
        }
        traffic-engineering {
            advertisement {
                application-specific {
                    all-applications;
                }
            }
        }
        export PS-ISIS-EXPORT;
        overload timeout 300;
    }
}
```

## junos/transport/mpls-segment-routing.conf

```
/*
 * Topic:   MPLS / Segment Routing global config
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - admin-groups (blue/green/red) referenced by ISIS attribute-groups
 *    for color-aware path computation
 *  - SRGB label range 16000–24000 used by ISIS source-packet-routing
 *  - icmp-tunneling for traceroute through MPLS
 *  - ipv6-tunneling enables 6PE over the SR-MPLS underlay
 *
 * Pair with:
 *  - evo/transport/mpls-segment-routing.conf
 *
 * Variables: none. All values here (admin-group numbers, SRGB range)
 * are JVD-wide constants — same on every PE.
 */
protocols {
    mpls {
        admin-groups {
            blue 1;
            green 2;
            red 3;
        }
        no-propagate-ttl;
        icmp-tunneling;
        label-range {
            srgb-label-range 16000 24000;
        }
        ipv6-tunneling;
    }
}
```

## _variables.md

# Snippet variable glossary

All `.conf` files under `junos/` and `evo/` are templates: identifiers
that vary between deployments are written as `$VAR` (or `${VAR}` only
when the placeholder is glued to an adjacent letter or digit and the
boundary would otherwise be ambiguous).

Render with:

    ~/git-scripts/snips_render.py <snip>.conf <vars.json>  > rendered.conf

The variables fall into a few groups.

## Identity / topology

| Variable               | What it is                                                                           | Example value                |
|------------------------|--------------------------------------------------------------------------------------|------------------------------|
| `$AS_LOCAL`            | This PE's iBGP / overlay AS (always `63535` in the JVD).                              | `63535`                      |
| `$AS_CUST`             | Customer-facing eBGP AS used by PE-CE BGP and as-override.                           | `64514`                      |
| `$LOOPBACK_V4`         | This PE's lo0 IPv4 (used as RD-prefix and BGP next-hop).                             | `1.1.0.17`                   |
| `$LOOPBACK_V6`         | This PE's lo0 IPv6.                                                                  | `2001:db8::17`               |
| `$ROUTER_ID`           | router-id (usually equal to `$LOOPBACK_V4`).                                          | `1.1.0.17`                   |
| `$NODE_SID_V4`         | ISIS source-packet-routing IPv4 node-segment index.                                  | `17`                         |
| `$NODE_SID_V6`         | ISIS source-packet-routing IPv6 node-segment index.                                  | `117`                        |

## Neighbours / route reflectors

| Variable               | What it is                                                  | Example value |
|------------------------|-------------------------------------------------------------|---------------|
| `$RR1_V4` / `$RR2_V4`  | Route-reflector loopback IPv4 addresses for the iBGP overlay. | `1.1.0.99`    |
| `$REMOTE_PE_V4`        | Remote PE loopback used in static l2circuit / LDP-VPLS neighbour lines. | `1.1.0.18` |
| `$BACKUP_PE_V4`        | Backup PE loopback used in `backup-neighbor` for hot-standby PWs. | `1.1.0.19` |

## Interfaces

| Variable               | What it is                                                                       | Example value     |
|------------------------|----------------------------------------------------------------------------------|-------------------|
| `$AC_INTF`             | Customer-facing attachment-circuit unit (with VLAN id when tagged).               | `ae12.2400`       |
| `$AC_PHYS`             | The physical/parent interface the AC unit lives on.                              | `ae12`            |
| `$CORE_INTF`           | Core-facing LAG unit used for ISIS+MPLS underlay.                                | `ae71.0`          |
| `$CORE_PHYS`           | Parent of the core LAG.                                                          | `ae71`            |
| `$LAG_MEMBER`          | A child interface of the LAG (mostly used in member templates).                  | `et-0/0/0`        |

## Service identifiers

| Variable                  | What it is                                                       | Example value |
|---------------------------|------------------------------------------------------------------|---------------|
| `$INSTANCE_NAME`          | The routing-instance name (per-service, often encodes IDs).      | `evpn_group_30_2400` |
| `$RD_ID`                  | Route-distinguisher tail (RD = `$LOOPBACK_V4:$RD_ID`).            | `2400`        |
| `$RT_ID`                  | Route-target tail (RT = `target:$AS_LOCAL:$RT_ID`).               | `2400`        |
| `$VPWS_SVC_ID_LOCAL`      | EVPN-VPWS local service-id.                                      | `2`           |
| `$VPWS_SVC_ID_REMOTE`     | EVPN-VPWS remote service-id.                                     | `1`           |
| `$VC_ID`                  | l2circuit / VPLS virtual-circuit-id (or `vpls-id`).              | `3000`        |
| `$VC_ID_BACKUP`           | Backup-neighbor virtual-circuit-id for hot-standby.              | `4000`        |
| `$L2VPN_SITE`             | Kompella L2VPN site-name.                                        | `r2`          |
| `$L2VPN_LOCAL_SITE_ID`    | Kompella L2VPN site-identifier.                                  | `1102`        |
| `$L2VPN_REMOTE_SITE_ID`   | Kompella L2VPN remote-site-id.                                   | `1119`        |
| `$VLAN_CUST`              | Customer-side (untranslated) VLAN id.                            | `200`         |
| `$VLAN_SP`                | Service-internal (normalised) VLAN id.                           | `2400`        |
| `$VLAN_BD`                | bridge-domain or mac-vrf vlan-id.                                | `4000`        |
| `$ESI`                    | 10-byte ESI (for EVPN multihoming).                              | `00:11:22:33:44:55:66:77:88:01` |
| `$IRB_UNIT`               | irb.X unit number for IRB integration.                           | `4000`        |

## Group / policy names referenced (kept literal)

The following names are part of the architectural model the JVD
documents — they are NOT parameterised, because their meaning is
the abstraction:

- Apply groups: `GR-EDGE-INTF`, `GR-EDGE-INTF-MH`, `GR-CORE-INTF`,
  `GR-ISIS-BCP`, `GR-BGP-BCP`, `GR-FATPW-LB`, `GR-FATPW-LABEL`,
  `GR-L3VPN`, `GR-L2CKT-HS`, `GR-ISIS-BFD`, `GR-LAG-MEMBER`.
- Forwarding-classes: `BEST-EFFORT`, `MEDIUM`, `REALTIME`,
  `SIG-OAM`, `CONTROL`, `BUSINESS`.
- Schedulers / scheduler-maps, communities, and per-VRF
  import/export policies are referenced by their own filename
  in the `policy/` and `cos/` snip categories.

## Header convention

Every snip declares the variables it actually uses in a header
section. The renderer skips the leading `/* ... */` C-comment block
before substitution, so `$VAR` text inside the header survives
verbatim while the body is fully rendered:

```
 * Variables (example values from ma1-1_acx7024):
 *   $INSTANCE_NAME      e.g. evpn_group_30_2400
 *   $AC_INTF            e.g. ae12.2400
 *   $LOOPBACK_V4        e.g. 1.1.0.17
 *   $RD_ID              e.g. 2400
 *   $RT_ID              e.g. 2400
 *   $AS_LOCAL           e.g. 63535
 *   $VPWS_SVC_ID_LOCAL  e.g. 2
 *   $VPWS_SVC_ID_REMOTE e.g. 1
```

The example values mirror the source device the snip was extracted
from (so the snip remains a faithful documentation of a working
deployment).

## byoai/TIERS.md

# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each service kind at each verbosity tier. It is bundled into [`jvd-mebs-snips.md`](jvd-mebs-snips.md) by `regenerate-bundle.sh`.

For each service kind, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. Use the OS-appropriate file under `junos/` or `evo/`.

---

## What the tiers mean

| Tier | Use when | What's included |
|---|---|---|
| **`minimum`** | Brownfield change. PE already has working IGP/SR underlay AND BGP overlay (with `family evpn` and/or `family inet-vpn`). You just want the new service. | Service routing-instance + AC interface unit + per-VRF policy (L3VPN only). **Nothing else.** |
| **`with-overlay`** | Brownfield-ish. PE has working IGP/SR underlay but you want to (re)assert the BGP overlay activation for the right address-family. | `minimum` + `transport/bgp-overlay.conf`. |
| **`as-deployed`** | Greenfield turn-up, lab build, or "give me a working example end-to-end." Mirrors what the JVD validates. | Everything: service + AC + policy + BGP overlay + IGP/SR underlay + apply-group baselines + CoS + OAM + FAT-PW + BGP-CT. |

> **Greenfield / bootstrap requests** (e.g. "build a new ACX7024 turn-up", "bootstrap a new MX304 PE end-to-end") are always treated as **`as-deployed`** regardless of the user's tier choice.

If the user picks `minimum` and the AI cannot tell whether the overlay activation for the needed address-family is already on the PE, it should call that out in the `Notes:` section ("assumed `family evpn signaling` already configured under `protocols bgp group …`").

---

## EVPN-VPWS

**minimum** (just the service)
- `services/evpn-vpws.conf`
- `interfaces/lag-esi-multihoming.conf` (multi-homed) **OR** `interfaces/edge-vlan-normalization.conf` (single-homed)

**with-overlay** (= minimum +)
- `transport/bgp-overlay.conf` (verify `family evpn signaling`)

**as-deployed** (= with-overlay +)
- `transport/isis-srmpls-tilfa.conf`
- `transport/mpls-segment-routing.conf`
- `apply-groups/gr-edge-intf-mh.conf` (or `gr-edge-intf.conf` if SH)
- `apply-groups/gr-core-intf.conf`
- `apply-groups/gr-isis-bcp.conf`
- `apply-groups/gr-bgp-bcp.conf`
- `apply-groups/gr-isis-bfd.conf`
- `apply-groups/gr-lag-member.conf`
- `apply-groups/gr-fatpw-lb.conf`
- `apply-groups/gr-fatpw-label.conf`
- `policy/communities.conf` (BGP-CT color communities)
- `cos/forwarding-classes.conf`
- `cos/schedulers.conf`
- `oam/oam-cfm-perf-mon.conf`
- `firewall/policers.conf`

---

## L3VPN-VRF

**minimum** (just the service + per-VRF policy)
- `services/l3vpn-vrf.conf`
- `policy/l3vpn-export-import.conf`
- `policy/communities.conf` (only the per-VRF target community — NOT topology tags or BGP-CT colors)
- `interfaces/edge-vlan-normalization.conf` (PE-CE AC unit)

**with-overlay** (= minimum +)
- `transport/bgp-overlay.conf` (verify `family inet-vpn unicast`)

**as-deployed** (= with-overlay +)
- `transport/isis-srmpls-tilfa.conf`
- `transport/mpls-segment-routing.conf`
- `apply-groups/gr-l3vpn.conf`
- `apply-groups/gr-edge-intf.conf` (or `-mh.conf` if multi-homed CE)
- `apply-groups/gr-core-intf.conf`
- `apply-groups/gr-isis-bcp.conf`
- `apply-groups/gr-bgp-bcp.conf`
- `apply-groups/gr-isis-bfd.conf`
- `apply-groups/gr-lag-member.conf`
- `cos/forwarding-classes.conf`
- `cos/schedulers.conf`
- `firewall/policers.conf`
- `policy/communities.conf` (full set incl. BGP-CT colors)

---

## EVPN-ELAN (mac-vrf, mac-vrf-irb, or port-based)

**minimum** (just the service)
- `services/evpn-elan-mac-vrf.conf` (or `-irb.conf`, or `evpn-port-based.conf`, whichever flavor was requested)
- `interfaces/lag-esi-multihoming.conf` (multi-homed) **OR** `interfaces/edge-vlan-normalization.conf` (single-homed)

**with-overlay** (= minimum +)
- `transport/bgp-overlay.conf` (verify `family evpn signaling`)

**as-deployed** (= with-overlay +)
- `transport/isis-srmpls-tilfa.conf`
- `transport/mpls-segment-routing.conf`
- `apply-groups/gr-edge-intf-mh.conf`
- `apply-groups/gr-core-intf.conf`
- `apply-groups/gr-isis-bcp.conf`
- `apply-groups/gr-bgp-bcp.conf`
- `apply-groups/gr-isis-bfd.conf`
- `apply-groups/gr-lag-member.conf`
- `apply-groups/gr-fatpw-lb.conf`
- `apply-groups/gr-fatpw-label.conf`
- `policy/communities.conf`
- `cos/forwarding-classes.conf`
- `cos/schedulers.conf`
- `oam/oam-cfm-perf-mon.conf`
- `firewall/policers.conf`

---

## EVPN Type-5 / IP-prefix VRFs

In this JVD, EVPN Type-5 is ALWAYS deployed paired with an EVPN-ELAN-IRB on the same `irb.<N>`: the MAC-VRF advertises RT-2 (MAC+IP from learned hosts), and the VRF with `protocols evpn ip-prefix-routes` advertises RT-5 (the IRB subnet, silent-host /32s, and any VRF static/learned prefixes). "Pure" RT-5 (VRF only, no MAC-VRF) is not a deployed pattern here. Therefore EVERY tier below includes BOTH the L2 (ELAN-IRB) and L3 (Type-5 VRF) snips. The two instances must reference the same `irb.<N>`.

**minimum** (both halves of the service + per-VRF policy)
- `services/evpn-elan-mac-vrf-irb.conf`  (the L2 / RT-2 half — MAC-VRF with `l3-interface irb.<N>`)
- `services/evpn-type5.conf`              (the L3 / RT-5 half — VRF with `interface irb.<N>` and `protocols evpn ip-prefix-routes`)
- `policy/l3vpn-export-import.conf`
- `policy/communities.conf` (only the per-VRF target community)
- `interfaces/edge-vlan-normalization.conf` (the AC interface that lands in the MAC-VRF's bridge-domain)

**with-overlay** (= minimum +)
- `transport/bgp-overlay.conf` (verify `family evpn signaling`)

**as-deployed** (= with-overlay +)
- `transport/isis-srmpls-tilfa.conf`
- `transport/mpls-segment-routing.conf`
- `apply-groups/gr-l3vpn.conf`
- `apply-groups/gr-edge-intf-mh.conf`
- `apply-groups/gr-core-intf.conf`
- `apply-groups/gr-isis-bcp.conf`
- `apply-groups/gr-bgp-bcp.conf`
- `apply-groups/gr-isis-bfd.conf`
- `apply-groups/gr-lag-member.conf`
- `cos/forwarding-classes.conf`
- `cos/schedulers.conf`
- `firewall/policers.conf`
- `policy/communities.conf` (full set)

---

## L2CIRCUIT (including hot-standby)

**minimum** (just the service)
- `services/l2circuit-hot-standby.conf`
- `interfaces/edge-vlan-normalization.conf`

**with-overlay** (= minimum +)
- `transport/bgp-overlay.conf`

**as-deployed** (= with-overlay +)
- `transport/isis-srmpls-tilfa.conf`
- `transport/mpls-segment-routing.conf`
- `apply-groups/gr-edge-intf.conf`
- `apply-groups/gr-core-intf.conf`
- `apply-groups/gr-isis-bcp.conf`
- `apply-groups/gr-bgp-bcp.conf`
- `apply-groups/gr-isis-bfd.conf`
- `apply-groups/gr-l2ckt-hs.conf`
- `apply-groups/gr-fatpw-lb.conf`
- `apply-groups/gr-fatpw-label.conf`
- `policy/communities.conf`
- `cos/forwarding-classes.conf`
- `cos/schedulers.conf`
- `oam/oam-cfm-perf-mon.conf`
- `firewall/policers.conf`

---

## L2VPN family (Kompella L2VPN, BGP-VPLS, LDP-VPLS)

Three distinct services, all using the BGP `family l2vpn signaling`
overlay (Kompella L2VPN and BGP-VPLS) or LDP targeted sessions
(LDP-VPLS). Pick the right snip:

- **Kompella L2VPN** (point-to-point pseudowire, RFC 4761):
  - `services/l2vpn-kompella.conf` (Junos and EVO).
  - Identifier: `instance-type l2vpn` + `protocols l2vpn { site … }`
    with both `site-identifier` and `remote-site-id`.
- **BGP-VPLS** (multipoint VPLS via BGP NLRI, RFC 4761):
  - `junos/services/bgp-vpls.conf` (Junos PEs only in this JVD).
  - Identifier: `instance-type virtual-switch` + `protocols vpls`
    with `site $NAME { site-identifier $ID; }` (no `vpls-id`).
- **LDP-VPLS** (multipoint VPLS via LDP targeted sessions, RFC 4762):
  - `evo/services/ldp-vpls.conf` (EVO PEs only in this JVD).
  - Identifier: `instance-type virtual-switch` + `protocols vpls`
    with `vpls-id $ID` + `neighbor $REMOTE_PE` (no `site` block).
  - Note: LDP-VPLS-with-BGP-auto-discovery (`l2vpn-id` form) is
    NOT deployed in this JVD.

Tiers (apply to whichever of the three the user asked for):

- **minimum** = `services/<topic>.conf` + AC interface snip
- **with-overlay** = + `transport/bgp-overlay.conf` (verify
  `family l2vpn signaling` for Kompella L2VPN and BGP-VPLS;
  LDP-VPLS does not need this — it relies on LDP targeted sessions)
- **as-deployed** = + transport underlay + full apply-group baseline
  + CoS + OAM + BGP-CT

---

## Bootstrap / greenfield turn-up

Treat as **`as-deployed`** regardless of the user's tier choice — a greenfield turn-up is by definition the full baseline.

---

Always acknowledge the chosen tier in the `Inputs Used` block (`form: minimum` / `form: with-overlay` / `form: as-deployed`).

## byoai/DEFAULTS.md

# Auto-fill Defaults

This file is part of the [BYOAI](README.md) corpus. It defines the deterministic JVD lab-default values the AI uses when the user picks `auto` mode (or short-circuits with `all defaults` / `skip`). Bundled into [`jvd-mebs-snips.md`](jvd-mebs-snips.md) by `regenerate-bundle.sh`.

Every value comes from an IETF documentation range or a private/reserved range so the output is visibly safe to share.

## Address space

| Item | Value | Source |
|---|---|---|
| PE loopback v4 | `192.0.2.<pe-id>/32` | RFC 5737 (TEST-NET-1) |
| PE loopback v6 | `2001:db8:0::<pe-id>/128` | RFC 3849 |
| PE-PE core links | `198.51.100.<2*link-id>/31` | RFC 5737 (TEST-NET-2) |
| PE-CE links | `198.51.100.<128 + 2*site-id>/31` | RFC 5737 (TEST-NET-2) |
| Customer prefixes | `203.0.113.<seq>.0/24`, carve `/28` per VRF site | RFC 5737 (TEST-NET-3) |

## Autonomous systems

| Item | Value |
|---|---|
| PE iBGP AS | `65000` (RFC 6996 private 2-byte) |
| RD / RT namespace AS | `64512` (deliberately distinct from BGP AS so RD/RT are visibly different) |
| CE eBGP AS | `65001 + (vrf-id mod 1000)` |

## Routing / transport

- IGP: ISIS L2-only, area `49.0001`
- Route-Reflector: first PE in the device list
- SRGB: literal — keep as in `transport/mpls-segment-routing.conf`
- Admin groups: literal — keep as in `transport/mpls-segment-routing.conf`
- Flex-algo: `128` (gold), `129` (bronze) — literal

## L3VPN VRF (vrf-id N, sequential from 2001 unless overridden)

- Instance name: `METRO_BGPv4_L3VPN_<N>`
- Route distinguisher: `64512:<N>`
- Route target: `target:64512:<N>`
- RT community name: `METRO_BGPv4_L3VPN_<N>` (matches JVD snip pattern)
- AC interface unit: `<N>`

## EVPN-VPWS service (svc-id S, sequential from 4001)

- Instance name: `EVPN_VPWS_<S>`
- VPWS service-id: `<S>`
- AC interface unit: `<S>`
- ESI: `00:11:22:33:44:55:66:<Sh>:<Sm>:<Sl>` where `<Sh>:<Sm>:<Sl>` are the three bytes of `(S - 4001 + 1)`. Clearly synthetic.

## EVPN-ELAN service (vlan V, sequential from 2001; skip 1, 1002–1005, 4094)

- Instance name: `EVPN_ELAN_<V>`
- EVI / VNI: `<V>`
- AC interface unit: `<V>`

## L2Circuit

- `virtual-circuit-id`: `<V>`
- AC interface unit: `<V>`

## OAM (Y.1731 CFM)

- Maintenance domain: `MD_64512`
- Level: `5`
- MA name: `<V>` or `<S>`
- MEP local: `1000 + (PE index in the service)`
- MEP remote: `1000 + (other PE index)`
- SLA iterator profile: `2WD-P3` (literal — JVD constant)

## CoS / firewall

- `scheduler-map`: `5G_SCHEDULER` on every edge LAG (literal — JVD constant)
- Default UNI policer: `50mbps_policer` (literal — JVD constant)
- Forwarding-classes: 6-class model (literal — JVD constant)

## Device selection

- If the user names devices → use them verbatim and infer the OS family from the model code in the hostname.
- Else if `EVO`: `ma3_acx7100-48l` + `meg1_acx7100-32c`
- Else if `JUNOS`: `mse1_mx304` + `ma4_mx204`
- Else if `MIXED`: `mse1_mx304` (Junos) + `ma3_acx7100-48l` (EVO)
- Else: ask before continuing.

Valid device names are those that appear in any snip's `Seen on:` header. If the user supplies a name not in `Seen on:`, accept it but warn in the Notes that the generated config is by-pattern, not validated against that specific device.

## Scale

No hard cap on counts. If the user asks for >500 of any entity, emit a one-line "this will be a lot of output" warning in the Notes but still produce the full config.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-mebs-snips.md`](jvd-mebs-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum" or "with-overlay"
# devices:
#   pe1: { name: <hostname>, os: <junos|evo>,
#          loopback4: <addr>, loopback6: <addr> }
#   pe2: { ... }
# services:
#   - { kind: <l3vpn|evpn-vpws|evpn-elan|l2circuit>,
#       count: <int>,
#       start_id: <int>,
#       start_vlan: <int>,
#       start_ac_unit: <int>,
#       rt: <target:...>,        # for l3vpn
#       esi_base: <hex>,         # for evpn-vpws / evpn-elan multihomed
#       prefixes: [ ... ] }      # for l3vpn
# snips_used:
#   - junos/services/l3vpn-vrf.conf
#   - evo/services/l3vpn-vrf.conf
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
- Cross-PE consistency the user must verify (RTs, ESIs, pseudowire-id, MAC-VRF names).
- Anything that is by-pattern rather than validated on that exact device (e.g., user-supplied hostname not in any snip's `Seen on:` list).

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
