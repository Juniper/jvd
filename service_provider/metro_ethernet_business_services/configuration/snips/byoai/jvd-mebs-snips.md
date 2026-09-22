# JVD MEBS snippet library

## evo/class-of-service/classifiers/cl-6class.conf

```
/*
 * Topic:   DSCP / EXP / 802.1p classifiers for the 6-class model
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Three ingress classifiers — dscp DSCP, exp EXP and ieee-802.1 8021P —
 *    resolving their code-points into the same six forwarding-classes.
 *  - Loss priority is set alongside the code-points: BEST-EFFORT and MEDIUM
 *    carry a high-loss-priority code-point, the rest are low.
 *
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-6queue-model.conf
 *
 * Variables: none. Classifier names, class names and code-points are JVD-wide
 *            constants, identical on every device in the design.
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
}
```

## evo/class-of-service/forwarding-classes/fc-6queue-model.conf

```
/*
 * Topic:   6-class forwarding-classes
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Queue numbers 0–5 mapped to: BEST-EFFORT(0), MEDIUM(1), REALTIME(2),
 *    SIG-OAM(3), CONTROL(4), BUSINESS(5).
 *  - This snip defines the class names; the classifiers and scheduler-maps that
 *    reference them are separate snips.
 *
 * Pair with:
 *  - evo/class-of-service/scheduler-maps/sm-6class-mapping.conf
 *
 * Variables: none. Class names and queue numbers are JVD-wide constants,
 *            identical on every device in the design.
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

## evo/class-of-service/interfaces/ifd-scheduler-map.conf

```
/*
 * Topic:   Interface scheduler-map application
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Binds the 5G_SCHEDULER scheduler-map to one interface, so the queues
 *    it names apply to everything the interface transmits.
 *
 * Pair with:
 *  - evo/class-of-service/scheduler-maps/sm-6class-mapping.conf
 *
 * Variables:
 *   $COS_INTF   e.g. ae71
 */
class-of-service {
    interfaces {
        $COS_INTF {
            scheduler-map 5G_SCHEDULER;
        }
    }
}
```

## evo/class-of-service/interfaces/ifl-dscp-classifier-rewrite.conf

```
/*
 * Topic:   Per-unit DSCP classifier and rewrite application
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - Ingress DSCP classifier and egress DSCP rewrite rule applied to one
 *    logical unit.
 *
 * Pair with:
 *  - evo/class-of-service/classifiers/cl-6class.conf
 *  - evo/class-of-service/rewrite-rules/rr-6class-marking.conf
 *
 * Variables:
 *   $COS_INTF    e.g. xe-0/0/15:0
 *   $UNIT        e.g. 2001
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                classifiers {
                    dscp DSCP;
                }
                rewrite-rules {
                    dscp DSCP-REWRITE;
                }
            }
        }
    }
}
```

## evo/class-of-service/interfaces/ifl-exp-classifier-rewrite.conf

```
/*
 * Topic:   Per-unit EXP classifier and rewrite application
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Ingress MPLS EXP classifier and egress EXP rewrite rule applied to one
 *    logical unit.
 *
 * Pair with:
 *  - evo/class-of-service/classifiers/cl-6class.conf
 *  - evo/class-of-service/rewrite-rules/rr-6class-marking.conf
 *
 * Variables:
 *   $COS_INTF    e.g. ae71
 *   $UNIT        e.g. 0
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                classifiers {
                    exp EXP;
                }
                rewrite-rules {
                    exp EXP-REWRITE;
                }
            }
        }
    }
}
```

## evo/class-of-service/interfaces/ifl-forwarding-class-ieee8021p-rewrite.conf

```
/*
 * Topic:   Per-unit fixed forwarding class and 802.1p rewrite application
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Assigns every packet arriving on the logical unit to one forwarding
 *    class, rather than classifying per packet, and applies the egress
 *    802.1p rewrite rule.
 *
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-6queue-model.conf
 *  - evo/class-of-service/rewrite-rules/rr-6class-marking.conf
 *
 * Variables:
 *   $COS_INTF          e.g. ae11
 *   $UNIT              e.g. 2400
 *   $FORWARDING_CLASS  e.g. REALTIME
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                forwarding-class $FORWARDING_CLASS;
                rewrite-rules {
                    ieee-802.1 8021P-REWRITE;
                }
            }
        }
    }
}
```

## evo/class-of-service/interfaces/ifl-ieee8021p-classifier-rewrite.conf

```
/*
 * Topic:   Per-unit 802.1p classifier and rewrite application
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 ma4_mx204 ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Ingress 802.1p classifier and egress 802.1p rewrite rule applied to one
 *    logical unit.
 *
 * Pair with:
 *  - evo/class-of-service/classifiers/cl-6class.conf
 *  - evo/class-of-service/rewrite-rules/rr-6class-marking.conf
 *
 * Variables:
 *   $COS_INTF    e.g. ae11
 *   $UNIT        e.g. 702
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                classifiers {
                    ieee-802.1 8021P;
                }
                rewrite-rules {
                    ieee-802.1 8021P-REWRITE;
                }
            }
        }
    }
}
```

## evo/class-of-service/interfaces/ifl-ieee8021p-classifier.conf

```
/*
 * Topic:   Per-unit 802.1p classifier application
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg2_acx7509
 *
 * Highlights:
 *  - Ingress 802.1p classifier applied to one logical unit.
 *
 * Pair with:
 *  - evo/class-of-service/classifiers/cl-6class.conf
 *
 * Variables:
 *   $COS_INTF    e.g. ae12
 *   $UNIT        e.g. 700
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                classifiers {
                    ieee-802.1 8021P;
                }
            }
        }
    }
}
```

## evo/class-of-service/rewrite-rules/rr-6class-marking.conf

```
/*
 * Topic:   DSCP, EXP and IEEE-802.1p rewrite rules for the six-class model
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Three rewrite rules, one per marking: DSCP-REWRITE for IP, EXP-REWRITE for
 *    MPLS and 8021P-REWRITE for tagged Ethernet.
 *  - EXP-REWRITE and 8021P-REWRITE carry identical code-points.
 *  - BEST-EFFORT and MEDIUM are the only classes with a high-loss-priority
 *    code-point; the remaining four carry one code-point each.
 *  - The six forwarding-class names re-marked here are defined in a separate
 *    snip; this one maps them onto code-points and nothing else.
 *
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-6queue-model.conf
 *
 * Variables: none. Rule names, class names and code-points are JVD-wide
 *            constants, identical on every device in the design.
 */
class-of-service {
    rewrite-rules {
        dscp DSCP-REWRITE {
            forwarding-class BEST-EFFORT {
                loss-priority high code-point be;
                loss-priority low code-point cs1;
            }
            forwarding-class BUSINESS {
                loss-priority low code-point cs5;
            }
            forwarding-class CONTROL {
                loss-priority low code-point cs6;
            }
            forwarding-class MEDIUM {
                loss-priority high code-point cs2;
            }
            forwarding-class REALTIME {
                loss-priority low code-point ef;
            }
            forwarding-class SIG-OAM {
                loss-priority low code-point cs3;
            }
        }
        exp EXP-REWRITE {
            forwarding-class BEST-EFFORT {
                loss-priority high code-point 000;
                loss-priority low code-point 001;
            }
            forwarding-class BUSINESS {
                loss-priority low code-point 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-point 111;
            }
            forwarding-class MEDIUM {
                loss-priority high code-point 010;
            }
            forwarding-class REALTIME {
                loss-priority low code-point 101;
            }
            forwarding-class SIG-OAM {
                loss-priority low code-point 011;
            }
        }
        ieee-802.1 8021P-REWRITE {
            forwarding-class BEST-EFFORT {
                loss-priority high code-point 000;
                loss-priority low code-point 001;
            }
            forwarding-class BUSINESS {
                loss-priority low code-point 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-point 111;
            }
            forwarding-class MEDIUM {
                loss-priority high code-point 010;
            }
            forwarding-class REALTIME {
                loss-priority low code-point 101;
            }
            forwarding-class SIG-OAM {
                loss-priority low code-point 011;
            }
        }
    }
}
```

## evo/class-of-service/scheduler-maps/sm-6class-mapping.conf

```
/*
 * Topic:   Scheduler-map pairing the six forwarding-classes with their schedulers
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - One scheduler-map, 5G_SCHEDULER, that pairs each of the six
 *    forwarding-classes with its scheduler.
 *  - Both the forwarding-class names and the scheduler names used here are
 *    defined in separate snips.
 *
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-6queue-model.conf
 *  - evo/class-of-service/schedulers/sc-2-priority-model.conf
 *
 * Variables: none. The scheduler-map name, class names and scheduler names are
 *            JVD-wide constants, identical on every device in the design.
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
}
```

## evo/class-of-service/schedulers/sc-2-priority-model.conf

```
/*
 * Topic:   CoS schedulers for the 6-class model, shaping-rate form
 * Seen on:
 *   Junos: an2_acx5448 an4_acx710
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Six schedulers consumed by the 5G_SCHEDULER scheduler-map.
 *  - Two scheduling priority levels: REALTIME is strict-high, the other five
 *    classes are low. CONTROL and SIG-OAM are small low-priority queues,
 *    BUSINESS and MEDIUM take 20% each, BEST-EFFORT gets the remainder.
 *  - REALTIME-SC is rated with shaping-rate percent 40; the other five use
 *    transmit-rate.
 *
 * Variables: none. Scheduler names, priorities, rates and buffer sizes are
 *            JVD-wide constants, identical on every device in the design.
 */
class-of-service {
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
 *   Junos: an2_acx5448 an4_acx710 ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
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
 *  - evo/interfaces/ifl-vlan-ccc-vlan-map-filter.conf  (per-unit input filter ref)
 *  - evo/interfaces/ifl-vlan-ccc-vlan-map-filter-ccc.conf  (per-unit input filter ref)
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

## evo/groups/gr-bgp-bcp-an3.conf

```
/*
 * Topic:   Apply-group GR-BGP-BCP (an3, EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - As-deployed GR-BGP-BCP apply-group form specific to an3_acx7100-48l.
 *
 * Pair with: none
 *
 * Variables: none
 */
groups {
    GR-BGP-BCP {
        protocols {
            bgp {
                path-selection external-router-id;
                precision-timers;
                hold-time 10;
                bgp-error-tolerance;
                multipath;
                tcp-mss 4096;
            }
        }
    }
}
```

## evo/groups/gr-bgp-bcp.conf

```
/*
 * Topic:   BGP best-current-practice timers (EVO)
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Identical to junos/groups/gr-bgp-bcp.conf.
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
 * Pair with: none
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

## evo/groups/gr-core-intf.conf

```
/*
 * Topic:   Core-facing interface baseline (EVO)
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Identical structure to junos/groups/gr-core-intf.conf.
 *  - 9192-byte L2 MTU + 9106 inet/iso + 9170 mpls — leaves room for
 *    14 MPLS labels (SR-MPLS deep label stacks for TI-LFA + flex-algo +
 *    transport-class + service label).
 *  - Family mpls maximum-labels 14 — required for SR-MPLS / Flex-Algo
 *    TI-LFA backup paths that may push 6+ labels.
 *  - hold-time up 2000 down 0 — short up-damp on core links (give IGP
 *    a moment to come back) but no down-damp (let BFD/IGP withdraw).
 *
 * Pair with:
 *  - evo/protocols/mpls-segment-routing.conf
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

## evo/groups/gr-edge-intf-mh.conf

```
/*
 * Topic:   Customer-facing interface baseline — multihomed variant (EVO)
 * Seen on:
 *   Junos: an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c ma3_acx7100-48l mdr1_acx7509
 *
 * Highlights:
 *  - Same as GR-EDGE-INTF but WITHOUT a port-restoration delay
 *    (`hold-time up`). Multihomed bundles rely on EVPN ESI / EVPN-MH
 *    convergence (fast DF election + aliasing) for sub-second
 *    failover, so port-level damping on the bring-up direction would
 *    only delay convergence. `hold-time down 0` stays to keep
 *    failure detection immediate.
 *  - LACP `hold-time up 180` (vs 2 sec in GR-EDGE-INTF) lets the ESI
 *    peer aggregate before this PE starts forwarding, avoiding
 *    micro-loops during bundle bring-up.
 *  - Pair this group with a parent ae* unit that has esi { all-active }
 *
 * Pair with:
 *  - evo/groups/gr-edge-intf.conf
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
                hold-time down 0;
                encapsulation flexible-ethernet-services;
            }
            <ae*> {
                aggregated-ether-options {
                    lacp {
                        hold-time up 180;
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

## evo/groups/gr-edge-intf.conf

```
/*
 * Topic:   Customer-facing interface baseline
 * Seen on:
 *   Junos: an2_acx5448 an4_acx710
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Identical structure to junos/groups/gr-edge-intf.conf
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
 *  - evo/groups/gr-edge-intf-mh.conf
 *  - evo/groups/gr-lag-member.conf
 *  - evo/routing-instances/vpls/ri-bgp-vpls-export.conf
 *  - evo/routing-instances/evpn-vpws/ri-evpn-fxc-3-uni-export.conf
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

## evo/groups/gr-fatpw-label.conf

```
/*
 * Apply-group: GR-FATPW-LABEL
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 * Highlights:
 *  - Wildcard-matched flow-label config injected into every routing-instance
 *    of a given naming pattern. Demonstrates how a single template covers
 *    each Junos PW/L2VPN/EVPN flavour with the correct knob:
 *  - <l2vpn_*>            BGP L2VPN          flow-label-{transmit,receive}
 *    <vpls_*>             BGP-VPLS           flow-label-{transmit,receive}
 *    <evpn_group_80_*>    EVPN-ELAN          flow-label + flow-label-static
 *    <evpn_group_10_*>    EVPN-VPWS          flow-label-{transmit,receive}-static
 *    <EVPN_VPWS_PORT_*>   port-based EVPN-VPWS  flow-label-{transmit,receive}-static
 *    L2VPN_PORT_BASED     port-based L2VPN   flow-label-{transmit,receive}
 *    <EVPN_ELAN_PORT_*>   port-based EVPN-ELAN  flow-label + flow-label-static
 *
 * Pair with:
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

## evo/groups/gr-fatpw-lb.conf

```
/*
 * Apply-group: GR-FATPW-LB
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 * Highlights:
 *  - Enables Flow-Aware Transport (FAT) pseudowire load-balancing
 *    at the forwarding-options level. The companion GR-FATPW-LABEL
 *    group enables flow-label transmit/receive on each VPN/PW type.
 *  - Apply globally:
 *    set apply-groups GR-FATPW-LB
 *
 * Pair with:
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

## evo/groups/gr-isis-bcp.conf

```
/*
 * Topic:   ISIS best-current-practice timers (EVO)
 * Seen on:
 *   Junos: ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Identical to junos/groups/gr-isis-bcp.conf.
 *  - max-hello-size 9106 on ae*/et* lets ISIS hellos use the full
 *    jumbo MTU (verifies path MTU before the protocol commits).
 *  - lsp-interval 10 (ms) — fast LSP flooding on point-to-point links.
 *  - SPF: delay 50 ms / holddown 2000 ms / rapid-runs 5 → fast
 *    initial reaction with a backoff window, the textbook BCP.
 *  - overload bit timeout 300s + advertise-high-metrics → router
 *    comes up "drained" so traffic doesn't shift onto it before BGP
 *    converges. Omitted on ag1-1/ag1-2 aggregation switches (they
 *    don't run BGP and have no reason to drain).
 *
 * Pair with:
 *  - evo/protocols/isis-srmpls-tilfa.conf
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

## evo/groups/gr-isis-bfd.conf

```
/*
 * Apply-group: GR-ISIS-BFD
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 * Highlights:
 *  - Aggressive BFD overlay applied to every ISIS interface, combined with
 *    GR-ISIS-BCP via `set protocols isis apply-groups [ GR-ISIS-BCP
 *    GR-ISIS-BFD ]`.
 *  - 50 ms x 3 multiplier with no-adaptation gives ≈150 ms link-failure
 *    detection that drives TI-LFA fast reroute.
 *
 * Pair with:
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

## evo/groups/gr-l2ckt-hs.conf

```
/*
 * Apply-group: GR-L2CKT-HS
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 * Highlights:
 *  - Adds hot-standby (active/standby) protection knobs to every L2Circuit
 *    pseudowire. Combined with backup-neighbor under each PW, this delivers
 *    sub-second redundancy when the primary remote PE fails.
 *  - pseudowire-status-tlv: hot-standby-vc-on  → keep VC down on standby
 *    switchover-delay 0                          → switch immediately
 *
 * Pair with:
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

## evo/groups/gr-l3vpn.conf

```
/*
 * Apply-group: GR-L3VPN
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 * Highlights:
 *  - Wildcard L3VPN VRF baseline applied to every routing-instance whose
 *    name matches METRO_*. Provides:
 *  - vpn-unequal-cost multipath (load-share over PEs with unequal IGP cost)
 *  - protect core (TI-LFA-friendly nexthop protection)
 *  - vrf-table-label (single label per VRF for label-switched data plane)
 *
 * Pair with:
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

## evo/groups/gr-lag-member.conf

```
/*
 * Apply-groups: LAG-MEMBER variants
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Highlights:
 *  - Templated knobs for individual physical members of a LAG bundle:
 *  - GR-EDGE-INTF-LAG-MEMBER       members of a single-homed edge LAG
 *    GR-EDGE-INTF-LAG-MEMBER-MH    members of a multi-homed (ESI) edge LAG
 *    GR-CORE-INTF-LAG-MEMBER       members of a core-facing LAG
 *  - The bundle itself (ae*) carries GR-EDGE-INTF[-MH] / GR-CORE-INTF;
 *    each member port (et-*) carries the matching -LAG-MEMBER variant.
 *  - Apply with:
 *    set interfaces et-0/0/N apply-groups GR-EDGE-INTF-LAG-MEMBER
 *
 * Pair with:
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

## evo/interfaces/core-isis-mpls.conf

```
/*
 * Topic:   Core-facing LAG carrying inet/iso/inet6/mpls (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma1-1_acx7024
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
 *  - evo/groups/gr-core-intf.conf
 *  - evo/protocols/isis-srmpls-tilfa.conf
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

## evo/interfaces/ifd-ae-lacp-fast.conf

```
/*
 * Topic:   Aggregated-Ethernet edge bundle with fast-periodic LACP and minimum-links
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - The bundle itself: LACP active with an explicit system-id, one
 *    minimum link, and fast periodic transmission.
 *  - flexible-vlan-tagging with flexible-ethernet-services encapsulation, so
 *    the bundle can carry logical interfaces of mixed encapsulation.
 *  - Port-level description, MTU and edge defaults come from the applied
 *    group rather than from this body.
 *
 * Variables (example values from an1_mx204):
 *   $IFD           e.g. ae11
 *   $LACP_SYS_ID   e.g. 00:00:00:00:00:01
 */
interfaces {
    $IFD {
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
    }
}
```

## evo/interfaces/ifd-ae-lacp.conf

```
/*
 * Topic:   Aggregated-Ethernet edge bundle with LACP active and a shared system-id
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   ma1-1_acx7024 ma1-2_acx7024
 *
 * Highlights:
 *  - The bundle itself: LACP active with an explicit system-id and nothing
 *    else under aggregated-ether-options — no minimum-links and no fast
 *    periodic transmission.
 *  - flexible-vlan-tagging with flexible-ethernet-services encapsulation, so
 *    the bundle can carry logical interfaces of mixed encapsulation.
 *  - Port-level description, MTU and edge defaults come from the applied
 *    group rather than from this body.
 *
 * Variables (example values from ma1-1_acx7024):
 *   $IFD           e.g. ae12
 *   $LACP_SYS_ID   e.g. 00:00:00:00:00:01
 */
interfaces {
    $IFD {
        apply-groups GR-EDGE-INTF-MH;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            lacp {
                active;
                system-id $LACP_SYS_ID;
            }
        }
    }
}
```

## evo/interfaces/ifl-vlan-bridge-esi.conf

```
/*
 * Topic:   Bridged logical interface with EVPN ESI multihoming
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - vlan-bridge logical interface carrying one VLAN into a bridged service.
 *  - Per-interface ESI with all-active redundancy; the value is shared with
 *    the peer PE of the same Ethernet Segment, and designated-forwarder
 *    election is left at its default.
 *
 * Variables (example values from an1_mx204):
 *   $IFD    e.g. ae11
 *   $UNIT   e.g. 701
 *   $VLAN   e.g. 701
 *   $ESI    e.g. 00:70:11:11:11:11:11:00:00:02
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-bridge;
            vlan-id $VLAN;
            esi {
                $ESI;
                all-active;
            }
        }
    }
}
```

## evo/interfaces/ifl-vlan-bridge-vlan-list-esi.conf

```
/*
 * Topic:   Bridged VLAN-range logical interface with EVPN ESI multihoming
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - vlan-bridge logical interface admitting a range of VLANs rather than a
 *    single vlan-id, so one interface serves several customer VLANs.
 *  - Per-interface ESI with all-active redundancy; the value is shared with
 *    the peer PE of the same Ethernet Segment.
 *
 * Variables (example values from meg1_acx7100-32c):
 *   $IFD         e.g. ae66
 *   $UNIT        e.g. 1000
 *   $VLAN_LIST   e.g. 1000-1001
 *   $ESI         e.g. 00:81:10:10:10:10:10:00:00:01
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-bridge;
            vlan-id-list $VLAN_LIST;
            esi {
                $ESI;
                all-active;
            }
        }
    }
}
```

## evo/interfaces/ifl-vlan-bridge-vlan-map.conf

```
/*
 * Topic:   Bridged attachment circuit with VLAN normalization (vlan-bridge, push/pop)
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - vlan-bridge attachment circuit with input push / output pop VLAN mapping.
 *  - Used for EVPN-ELAN attachment circuits in this JVD.
 *  - Decouples customer VLAN IDs from service-internal VLAN IDs at the SP edge.
 *
 * Variables (example values from an3_acx7100-48l et-0/0/0 unit 400):
 *   $IFD         e.g. et-0/0/0
 *   $UNIT        e.g. 400
 *   $VLAN        e.g. 400
 *   $INPUT_VID   e.g. 3500
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-bridge;
            vlan-id $VLAN;
            input-vlan-map {
                push;
                vlan-id $INPUT_VID;
            }
            output-vlan-map pop;
        }
    }
}
```

## evo/interfaces/ifl-vlan-ccc-dual-tag-esi.conf

```
/*
 * Topic:   Double-tagged cross-connect logical interface with EVPN ESI multihoming
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - vlan-ccc logical interface matched on an outer and an inner VLAN tag,
 *    so the customer's Q-in-Q pair is carried end to end unchanged.
 *  - Per-interface ESI with all-active redundancy; the value is shared with
 *    the peer PE of the same Ethernet Segment.
 *
 * Variables (example values from ma1-1_acx7024):
 *   $IFD          e.g. ae12
 *   $UNIT         e.g. 225
 *   $VLAN_OUTER   e.g. 225
 *   $VLAN_INNER   e.g. 2250
 *   $ESI          e.g. 00:10:11:11:50:12:03:19:00:00
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-ccc;
            vlan-tags outer $VLAN_OUTER inner $VLAN_INNER;
            esi {
                $ESI;
                all-active;
            }
        }
    }
}
```

## evo/interfaces/ifl-vlan-ccc-esi.conf

```
/*
 * Topic:   Single-tagged cross-connect logical interface with EVPN ESI multihoming
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - vlan-ccc logical interface carrying one VLAN, with no VLAN rewriting:
 *    the customer tag is presented to the cross-connect unchanged.
 *  - Per-interface ESI with all-active redundancy; the value is shared with
 *    the peer PE of the same Ethernet Segment.
 *
 * Variables (example values from an1_mx204):
 *   $IFD    e.g. ae11
 *   $UNIT   e.g. 101
 *   $VLAN   e.g. 101
 *   $ESI    e.g. 00:10:11:11:11:11:01:00:00:00
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-ccc;
            vlan-id $VLAN;
            esi {
                $ESI;
                all-active;
            }
        }
    }
}
```

## evo/interfaces/ifl-vlan-ccc-vlan-map-esi.conf

```
/*
 * Topic:   Cross-connect logical interface with VLAN normalization and EVPN ESI multihoming
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - vlan-ccc logical interface with an input push and an output pop, which
 *    decouples the customer VLAN id from the service-internal one.
 *  - Per-interface ESI with all-active redundancy; the value is shared with
 *    the peer PE of the same Ethernet Segment.
 *
 * Variables (example values from an1_mx204):
 *   $IFD         e.g. ae11
 *   $UNIT        e.g. 2400
 *   $VLAN        e.g. 2400
 *   $INPUT_VID   e.g. 3800
 *   $ESI         e.g. 00:10:11:11:30:11:01:00:00:00
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-ccc;
            vlan-id $VLAN;
            input-vlan-map {
                push;
                vlan-id $INPUT_VID;
            }
            output-vlan-map pop;
            esi {
                $ESI;
                all-active;
            }
        }
    }
}
```

## evo/interfaces/ifl-vlan-ccc-vlan-map-filter-ccc.conf

```
/*
 * Topic:   Rate-limited CCC attachment circuit with VLAN normalization and family ccc
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - vlan-ccc attachment circuit with input push / output pop VLAN mapping,
 *    carrying an explicit family ccc on the unit.
 *  - Ingress filter applies the UNI rate limit; 50MB_filter and its policer are
 *    defined in evo/firewall/policers.conf.
 *  - Decouples customer VLAN IDs from service-internal VLAN IDs at the SP edge.
 *
 * Pair with:
 *  - evo/firewall/policers.conf
 *
 * Variables (example values from an3_acx7100-48l et-0/0/0 unit 3000):
 *   $IFD         e.g. et-0/0/0
 *   $UNIT        e.g. 3000
 *   $VLAN        e.g. 3000
 *   $INPUT_VID   e.g. 1000
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-ccc;
            vlan-id $VLAN;
            input-vlan-map {
                push;
                vlan-id $INPUT_VID;
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

## evo/interfaces/ifl-vlan-ccc-vlan-map-filter.conf

```
/*
 * Topic:   Rate-limited attachment circuit with VLAN normalization (vlan-ccc, push/pop)
 * Seen on:
 *   Junos: an4_acx710 ma5_mx204
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - vlan-ccc attachment circuit with input push / output pop VLAN mapping.
 *  - Ingress filter applies the UNI rate limit; 50MB_filter and its policer are
 *    defined in evo/firewall/policers.conf.
 *  - Decouples customer VLAN IDs from service-internal VLAN IDs at the SP edge.
 *
 * Pair with:
 *  - evo/firewall/policers.conf
 *
 * Variables (example values from an3_acx7100-48l et-0/0/0 unit 2800):
 *   $IFD         e.g. et-0/0/0
 *   $UNIT        e.g. 2800
 *   $VLAN        e.g. 2800
 *   $INPUT_VID   e.g. 3200
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-ccc;
            vlan-id $VLAN;
            input-vlan-map {
                push;
                vlan-id $INPUT_VID;
            }
            output-vlan-map pop;
            filter {
                input 50MB_filter;
            }
        }
    }
}
```

## evo/interfaces/ifl-vlan-ccc-vlan-map-list-tpid.conf

```
/*
 * Topic:   QinQ VLAN-range attachment circuit with S-VLAN push and 802.1ad TPID
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma3_acx7100-48l
 *
 * Highlights:
 *  - vlan-ccc attachment circuit matching a contiguous customer VLAN range with
 *    vlan-id-list.
 *  - input-vlan-map pushes an outer service tag with tag-protocol-id 0x88a8
 *    (802.1ad), producing a QinQ-stacked frame toward the core; output-vlan-map
 *    pop removes it on egress.
 *  - The TPID is set on the vlan-map itself, not via an ether-options
 *    ethernet-switch-profile on the parent interface.
 *
 * Variables (example values from ma3_acx7100-48l et-0/0/5 unit 1000):
 *   $IFD         e.g. et-0/0/5
 *   $UNIT        e.g. 1000
 *   $VLAN_LIST   e.g. 1000-1099
 *   $INPUT_VID   e.g. 4000
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-ccc;
            vlan-id-list $VLAN_LIST;
            input-vlan-map {
                push;
                tag-protocol-id 0x88a8;
                vlan-id $INPUT_VID;
            }
            output-vlan-map pop;
        }
    }
}
```

## evo/interfaces/ifl-vlan-ccc-vlan-map-list.conf

```
/*
 * Topic:   CCC VLAN-range attachment circuit with VLAN normalization (vlan-ccc, push/pop)
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - vlan-ccc attachment circuit matching a contiguous customer VLAN range with
 *    vlan-id-list.
 *  - input push / output pop maps the whole range to one service-internal VLAN.
 *
 * Variables (example values from an3_acx7100-48l et-0/0/0 unit 800):
 *   $IFD         e.g. et-0/0/0
 *   $UNIT        e.g. 800
 *   $VLAN_LIST   e.g. 800-809
 *   $INPUT_VID   e.g. 4090
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-ccc;
            vlan-id-list $VLAN_LIST;
            input-vlan-map {
                push;
                vlan-id $INPUT_VID;
            }
            output-vlan-map pop;
        }
    }
}
```

## evo/interfaces/ifl-vlan-ccc-vlan-map.conf

```
/*
 * Topic:   Attachment circuit with VLAN normalization (vlan-ccc, push/pop)
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - vlan-ccc attachment circuit with input push / output pop VLAN mapping.
 *  - Single-homed and unfiltered: the base CCC attachment-circuit form.
 *  - Decouples customer VLAN IDs from service-internal VLAN IDs at the SP edge.
 *
 * Variables (example values from an3_acx7100-48l et-0/0/50 unit 3000):
 *   $IFD         e.g. et-0/0/50
 *   $UNIT        e.g. 3000
 *   $VLAN        e.g. 3000
 *   $INPUT_VID   e.g. 1000
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-ccc;
            vlan-id $VLAN;
            input-vlan-map {
                push;
                vlan-id $INPUT_VID;
            }
            output-vlan-map pop;
        }
    }
}
```

## evo/policy-options/community/cm-access-fabric.conf

```
/*
 * Topic:   BGP community CM-ACCESS-FABRIC
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Marks a prefix as belonging to the access fabric. Carried on the
 *    fabric community administrator, so it is comparable across regions.
 *
 * Pair with: none
 *
 * Variables:
 *   $FABRIC_COMMUNITY_AS    e.g. 63535
 */
policy-options {
    community CM-ACCESS-FABRIC members $FABRIC_COMMUNITY_AS:2;
}
```

## evo/policy-options/community/cm-inet-backup.conf

```
/*
 * Topic:   BGP community CM-INET-BACKUP
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Route target marking the backup Internet path.
 *
 * Pair with: none
 *
 * Variables:
 *   $RING_COMMUNITY_AS      e.g. 63536
 */
policy-options {
    community CM-INET-BACKUP members target:$RING_COMMUNITY_AS:99999;
}
```

## evo/policy-options/community/cm-inet-default.conf

```
/*
 * Topic:   BGP community CM-INET-DEFAULT
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Route target carried by the Internet default routes, matched by the
 *    per-service L3VPN import policies to pull a default into a customer
 *    VRF.
 *
 * Pair with: none
 *
 * Variables:
 *   $RING_COMMUNITY_AS      e.g. 63536
 */
policy-options {
    community CM-INET-DEFAULT members target:$RING_COMMUNITY_AS:11111;
}
```

## evo/policy-options/community/cm-inet-primary.conf

```
/*
 * Topic:   BGP community CM-INET-PRIMARY
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Route target marking the primary Internet path. One of the three
 *    Internet helper targets, which differ only in their assigned number.
 *
 * Pair with: none
 *
 * Variables:
 *   $RING_COMMUNITY_AS      e.g. 63536
 */
policy-options {
    community CM-INET-PRIMARY members target:$RING_COMMUNITY_AS:00000;
}
```

## evo/policy-options/community/cm-l3vpn-bgpv4.conf

```
/*
 * Topic:   Per-VRF L3VPN route-target community (METRO_BGPv4_L3VPN_<id>).
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - One community per L3VPN service: name METRO_BGPv4_L3VPN_$L3VPN_ID with a
 *    matching route-target target:$RT_AS:$L3VPN_ID. The service id is the
 *    same in the name and the RT tail.
 *  - $RT_AS is the L3VPN's originating-domain AS and varies per VRF (a
 *    node may carry both its own and imported VRFs), so it is a service-instance
 *    variable, not a device-wide one.
 *  - Referenced by l3vpn-bgp and l3vpn-export-import.
 *
 * Pair with: none
 *
 * Variables:
 *   $L3VPN_ID      e.g. 1001
 *   $RT_AS         e.g. 63536
 */
policy-options {
    community METRO_BGPv4_L3VPN_${L3VPN_ID} members target:$RT_AS:$L3VPN_ID;
}
```

## evo/policy-options/community/cm-l3vpn-bgpv6.conf

```
/*
 * Topic:   Per-service IPv6 L3VPN route-target community
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - One community per IPv6 L3VPN service. The service id appears both in
 *    the community name and as the route-target tail, and that holds for
 *    every one of the 3,400 instances, so the tail is expressed as a
 *    derivative of the same id rather than as a free value.
 *
 * Pair with: none
 *
 * Variables:
 *   $L3VPN_ID      e.g. 2201
 *   $RT_AS         e.g. 63535
 */
policy-options {
    community METRO_BGPv6_L3VPN_${L3VPN_ID} members target:$RT_AS:$L3VPN_ID;
}
```

## evo/policy-options/community/cm-l3vpn-pub.conf

```
/*
 * Topic:   BGP community CM-L3VPN-PUB
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Route target tagging the public L3VPN prefixes an export policy
 *    chooses to advertise beyond the customer VRF.
 *
 * Pair with: none
 *
 * Variables:
 *   $RING_COMMUNITY_AS      e.g. 63536
 */
policy-options {
    community CM-L3VPN-PUB members target:$RING_COMMUNITY_AS:22222;
}
```

## evo/policy-options/community/cm-l3vpn.conf

```
/*
 * Topic:   Per-service L3VPN route-target community
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - One community per L3VPN service, without the address-family qualifier
 *    the BGPv4 and BGPv6 families carry in their names.
 *    The route-target tail is a free value, not a derivative of the service
 *    id: 250 of the 3,650 instances use a tail that differs from the id, and
 *    those 250 are the only instances on meg1 and meg2. Deriving the tail
 *    would cost two whole devices of coverage.
 *
 * Pair with: none
 *
 * Variables:
 *   $L3VPN_ID      e.g. 2001
 *   $RT_AS         e.g. 63535
 *   $RT_ID         e.g. 2001
 */
policy-options {
    community METRO_L3VPN_${L3VPN_ID} members target:$RT_AS:$RT_ID;
}
```

## evo/policy-options/community/cm-loopback.conf

```
/*
 * Topic:   CM-LOOPBACK community definition (tags local loopbacks for RIB leak).
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - CM-LOOPBACK tags local lo0 /32s; imported by PS-LOCAL-LOOPBACK
 *    (see policy-options/policy-statement/loopback-rib-leak.conf).
 *  - The community value is role-dependent (the administrator follows the
 *    node's regional AS), so it is carried whole in $LOOPBACK_COMMUNITY.
 *
 * Pair with: none
 *
 * Variables:
 *   $LOOPBACK_COMMUNITY   e.g. 63535:10000
 */
policy-options {
    community CM-LOOPBACK members $LOOPBACK_COMMUNITY;
}
```

## evo/policy-options/community/cm-metro-fabric.conf

```
/*
 * Topic:   BGP community CM-METRO-FABRIC
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Marks a prefix as belonging to the metro fabric, the peer tag to
 *    CM-ACCESS-FABRIC on the same fabric administrator.
 *
 * Pair with: none
 *
 * Variables:
 *   $FABRIC_COMMUNITY_AS    e.g. 63535
 */
policy-options {
    community CM-METRO-FABRIC members $FABRIC_COMMUNITY_AS:1;
}
```

## evo/policy-options/community/cm-metro-ring.conf

```
/*
 * Topic:   BGP community CM-METRO-RING
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Ring-region topology tag on the metro ring community administrator,
 *    which differs from the fabric administrator used by the fabric tags.
 *
 * Pair with: none
 *
 * Variables:
 *   $RING_COMMUNITY_AS      e.g. 63536
 */
policy-options {
    community CM-METRO-RING members $RING_COMMUNITY_AS:20;
}
```

## evo/policy-options/community/cm-no-advertise.conf

```
/*
 * Topic:   BGP community CM-NO-ADVERTISE
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - The well-known no-advertise community. Unlike every other community
 *    here it takes no administrator, so it carries no variable.
 *
 * Pair with: none
 *
 * Variables: none. The community value is a JVD-wide constant.
 */
policy-options {
    community CM-NO-ADVERTISE members no-advertise;
}
```

## evo/policy-options/community/cm-region-edge.conf

```
/*
 * Topic:   BGP community CM-REGION-EDGE
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Ring-region topology tag identifying the region edge.
 *
 * Pair with: none
 *
 * Variables:
 *   $RING_COMMUNITY_AS      e.g. 63536
 */
policy-options {
    community CM-REGION-EDGE members $RING_COMMUNITY_AS:30;
}
```

## evo/policy-options/community/cm-regional-border.conf

```
/*
 * Topic:   BGP community CM-REGIONAL-BORDER
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Marks a prefix originated at a regional border, so border routers
 *    can be told apart from fabric interior nodes in export policy.
 *
 * Pair with: none
 *
 * Variables:
 *   $FABRIC_COMMUNITY_AS    e.g. 63535
 */
policy-options {
    community CM-REGIONAL-BORDER members $FABRIC_COMMUNITY_AS:3;
}
```

## evo/policy-options/community/cm-service-edge.conf

```
/*
 * Topic:   BGP community CM-SERVICE-EDGE
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Ring-region topology tag identifying the service edge, where
 *    customer-facing services attach.
 *
 * Pair with: none
 *
 * Variables:
 *   $RING_COMMUNITY_AS      e.g. 63536
 */
policy-options {
    community CM-SERVICE-EDGE members $RING_COMMUNITY_AS:10;
}
```

## evo/policy-options/community/cm-service-rt.conf

```
/*
 * Topic:   Per-service route-target community
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 ma4_mx204 ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - One community per service instance, named from the instance itself with
 *    an `_RT` suffix. The suffix is part of the object's identity: it is what
 *    separates these definitions from every other community in the design.
 *  - The route-target tail is a free value rather than a derivative of the
 *    instance name, and the administrator is service-scoped rather than the
 *    node's own AS, so all three fields are parameterized independently.
 *  - One form covers every L2 service family here: evpn_group, vpls_group and
 *    l2vpn_group instances all take this exact shape.
 *
 * Pair with: none
 *
 * Variables (example values from an1_mx204):
 *   $INSTANCE_NAME   e.g. evpn_group_90_700
 *   $RT_AS           e.g. 63535
 *   $RT_ID           e.g. 7000
 */
policy-options {
    community ${INSTANCE_NAME}_RT members target:$RT_AS:$RT_ID;
}
```

## evo/policy-options/community/cm-tc-4000-gold.conf

```
/*
 * Topic:   BGP community CM-TC-4000-GOLD
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - As-deployed CM-TC-4000-GOLD community definition.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    community CM-TC-4000-GOLD members transport-target:0:4000;
}
```

## evo/policy-options/community/cm-tc-6000-bronze.conf

```
/*
 * Topic:   BGP community CM-TC-6000-BRONZE
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - As-deployed CM-TC-6000-BRONZE community definition.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    community CM-TC-6000-BRONZE members transport-target:0:6000;
}
```

## evo/policy-options/community/cm-tc-map2bronze.conf

```
/*
 * Topic:   Transport-class colour community bronze
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 ma4_mx204 ma5_mx204 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Transport Class color community for the bronze class (`color:0:6000`).
 *
 * Pair with: none
 *
 * Variables:
 *   $COLOR_COMMUNITY   e.g. map2bronze
 */
policy-options {
    community $COLOR_COMMUNITY members color:0:6000;
}
```

## evo/policy-options/community/cm-tc-map2gold.conf

```
/*
 * Topic:   Transport-class colour community gold
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Transport Class color community for the gold class (`color:0:4000`).
 *
 * Pair with: none
 *
 * Variables:
 *   $COLOR_COMMUNITY   e.g. map2gold
 */
policy-options {
    community $COLOR_COMMUNITY members color:0:4000;
}
```

## evo/policy-options/policy-statement/l3vpn-export-import.conf

```
/*
 * Topic:   L3VPN per-VRF export/import policies
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
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
 *
 * Pair with:
 *  - evo/policy-options/community/cm-inet-default.conf
 *  - evo/policy-options/community/cm-l3vpn-pub.conf
 *  - evo/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy.conf
 *  - evo/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf
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

## evo/policy-options/policy-statement/loopback-rib-leak.conf

```
/*
 * Topic:   Loopback RIB-leak policies (PS-LOCAL-LOOPBACK / PS-REMOTE-LOOPBACKS) imported by the loopback RIB groups.
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - PS-LOCAL-LOOPBACK accepts local lo0 /32s from the JVD loopback supernet
 *    and tags them CM-LOOPBACK; imported into RG-LOCAL-LOOPBACK.
 *  - PS-REMOTE-LOOPBACKS accepts BGP-learned loopbacks and tags them
 *    CM-NO-ADVERTISE; imported into RG-REMOTE-LOOPBACKS.
 *  - Both policies end with an explicit `term REJECT`.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-no-advertise.conf
 *  - evo/policy-options/community/cm-loopback.conf
 *
 * Variables:
 *   $LOOPBACK_SUPERNET   e.g. 1.1.0.0/16
 */
policy-options {
    policy-statement PS-LOCAL-LOOPBACK {
        term LOCAL-LOOPBACK {
            from {
                protocol direct;
                interface lo0.0;
                route-filter $LOOPBACK_SUPERNET prefix-length-range /32-/32;
            }
            then {
                community add CM-LOOPBACK;
                accept;
            }
        }
        term REJECT {
            then reject;
        }
    }
    policy-statement PS-REMOTE-LOOPBACKS {
        term ALL-LOOPBACKS {
            from protocol bgp;
            then {
                community add CM-NO-ADVERTISE;
                accept;
            }
        }
        term REJECT {
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/nhs1-ma1-1.conf

```
/*
 * Topic:   BGP policy nhs1
 * Seen on:
 *   Junos: ma4_mx204 ma5_mx204
 *   EVO:   ma1-1_acx7024 ma1-2_acx7024
 *
 * Highlights:
 *  - As-deployed nhs1 routing policy.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    policy-statement nhs1 {
        term 2 {
            from {
                family evpn;
                protocol bgp;
            }
            then accept;
        }
        term 3 {
            then {
                next-hop self;
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/nhs1-ma3.conf

```
/*
 * Topic:   BGP policy nhs1 (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma3_acx7100-48l
 *
 * Highlights:
 *  - As-deployed nhs1 routing policy.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-metro-ring.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement nhs1 {
        term ORIGIN {
            then {
                community add CM-METRO-RING;
                next term;
            }
        }
        term 2 {
            from {
                family evpn;
                protocol bgp;
            }
            then accept;
        }
        term 3 {
            then {
                next-hop self;
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/per-packet-load-balance.conf

```
/*
 * Topic:   Per-packet load-balance policy (pplb) — exported to the forwarding table so ECMP paths are used per-flow.
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Single unconditional term: `load-balance per-packet; accept;`.
 *  - Applied via `routing-options forwarding-table export $PPLB_NAME`
 *    (routing-options/forwarding-table.conf). The policy name is `pplb` on most
 *    nodes and `PS-PPLB` on some EVO nodes.
 *
 * Pair with: none
 *
 * Variables:
 *   $PPLB_NAME   e.g. pplb
 */
policy-options {
    policy-statement $PPLB_NAME {
        then {
            load-balance per-packet;
            accept;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-as63536-import.conf

```
/*
 * Topic:   BGP policy PS-AS63536-IMPORT (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - As-deployed PS-AS63536-IMPORT routing policy.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-service-edge.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-AS63536-IMPORT {
        term METRO-RING {
            from community CM-SERVICE-EDGE;
            then accept;
        }
        term REJECT {
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-bgp-export-ring-cr1.conf

```
/*
 * Topic:   BGP policy PS-BGP-EXPORT-RING (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr1_ptx10001-36mr
 *
 * Highlights:
 *  - As-deployed PS-BGP-EXPORT-RING routing policy.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-access-fabric.conf
 *  - evo/policy-options/community/cm-regional-border.conf
 *  - evo/policy-options/community/cm-service-edge.conf
 *  - evo/policy-options/prefix-list/pl-border-nodes.conf
 *  - evo/policy-options/prefix-list/pl-metro-ring.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-BGP-EXPORT-RING {
        term LOOP_PREVENT {
            from community [ CM-ACCESS-FABRIC CM-REGIONAL-BORDER ];
            then reject;
        }
        inactive: term BGP-CT {
            from {
                rib bgp.transport.3;
                community [ CM-REGIONAL-BORDER CM-ACCESS-FABRIC ];
            }
            then reject;
        }
        term FROM-MSE {
            from {
                community CM-SERVICE-EDGE;
                prefix-list PL-METRO-RING;
            }
            then {
                next-hop self;
                accept;
            }
        }
        term BORDER-LOOPBACKS {
            from {
                prefix-list PL-BORDER-NODES;
            }
            then {
                community add CM-REGIONAL-BORDER;
                accept;
            }
        }
        term REJECT {
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-bgp-export-ring-cr2.conf

```
/*
 * Topic:   BGP policy PS-BGP-EXPORT-RING (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr2_ptx10001-36mr
 *
 * Highlights:
 *  - As-deployed PS-BGP-EXPORT-RING routing policy.
 *
 * Pair with:
 *  - evo/policy-options/prefix-list/border-nodes.conf
 *  - evo/policy-options/community/cm-access-fabric.conf
 *  - evo/policy-options/community/cm-regional-border.conf
 *  - evo/policy-options/community/cm-service-edge.conf
 *  - evo/policy-options/prefix-list/pl-metro-ring.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-BGP-EXPORT-RING {
        term LOOP_PREVENT {
            from community [ CM-ACCESS-FABRIC CM-REGIONAL-BORDER ];
            then reject;
        }
        term FROM-MSE {
            from {
                community CM-SERVICE-EDGE;
                prefix-list PL-METRO-RING;
            }
            then {
                next-hop self;
                accept;
            }
        }
        term BORDER-LOOPBACKS {
            from {
                prefix-list BORDER-NODES;
            }
            then {
                community add CM-REGIONAL-BORDER;
                accept;
            }
        }
        term REJECT {
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-bgp-export.conf

```
/*
 * Topic:   BGP policy PS-BGP-EXPORT
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - As-deployed PS-BGP-EXPORT routing policy.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-access-fabric.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-BGP-EXPORT {
        term ORIGIN {
            then {
                community add CM-ACCESS-FABRIC;
                next term;
            }
        }
        term EVPN-NO-NHS {
            from {
                family evpn;
                protocol bgp;
            }
            then accept;
        }
        term LOOPBACK {
            from protocol [ direct bgp ];
            then {
                next-hop self;
                accept;
            }
        }
        term LU {
            from rib inet.3;
            then reject;
        }
        term CT {
            from rib bgp.transport.3;
            then reject;
        }
        term ACCEPT-NHS {
            then {
                next-hop self;
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-bgp-mse-export.conf

```
/*
 * Topic:   BGP policy PS-BGP-MSE-EXPORT
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509
 *
 * Highlights:
 *  - As-deployed PS-BGP-MSE-EXPORT routing policy.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-tc-4000-gold.conf
 *  - evo/policy-options/community/cm-tc-6000-bronze.conf
 *  - evo/policy-options/community/cm-access-fabric.conf
 *  - evo/policy-options/community/cm-metro-fabric.conf
 *  - evo/policy-options/community/cm-metro-ring.conf
 *  - evo/policy-options/community/cm-service-edge.conf
 *  - evo/policy-options/prefix-list/pl-an-region.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-BGP-MSE-EXPORT {
        term LOOP-PREVENT {
            from community [ CM-SERVICE-EDGE CM-ACCESS-FABRIC CM-METRO-FABRIC ];
            then reject;
        }
        inactive: term FROM-METRO-RING {
            from {
                community CM-METRO-RING;
                prefix-list PL-AN-REGION;
            }
            then {
                next-hop self;
                accept;
            }
        }
        inactive: term LOOPBACK {
            from {
                prefix-list PL-AN-REGION;
            }
            then {
                inactive: community add CM-METRO-RING;
                accept;
            }
        }
        term BGP-CT {
            from {
                protocol [ direct bgp ];
                rib bgp.transport.3;
                community [ CM-TC-4000-GOLD CM-TC-6000-BRONZE ];
            }
            then {
                community add CM-METRO-RING;
                next-hop self;
                accept;
            }
        }
        term BGP-LU {
            from {
                rib inet.3;
                prefix-list PL-AN-REGION;
            }
            then {
                community add CM-METRO-RING;
                next-hop self;
                accept;
            }
        }
        term BGP-CTv6 {
            from {
                protocol [ direct bgp ];
                rib bgp.transport-inet6.3;
                community [ CM-TC-4000-GOLD CM-TC-6000-BRONZE ];
            }
            then {
                community add CM-METRO-RING;
                next-hop self;
                accept;
            }
        }
        term BGP-LUv6 {
            from {
                rib inet6.3;
                community CM-METRO-RING;
                prefix-list PL-AN-REGION;
            }
            then {
                next-hop self;
                accept;
            }
        }
        term REJECT {
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-bgp-rr-export.conf

```
/*
 * Topic:   BGP policy PS-BGP-RR-EXPORT (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - As-deployed PS-BGP-RR-EXPORT routing policy.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-metro-ring.conf
 *  - evo/policy-options/community/cm-regional-border.conf
 *  - evo/policy-options/community/cm-service-edge.conf
 *  - evo/policy-options/prefix-list/pl-core.conf
 *  - evo/policy-options/prefix-list/pl-fabric.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-BGP-RR-EXPORT {
        term CORE-NHS {
            from {
                protocol bgp;
                prefix-list PL-CORE;
            }
            then {
                next-hop self;
                accept;
            }
        }
        term AS63536 {
            from {
                protocol bgp;
                community [ CM-METRO-RING CM-REGIONAL-BORDER CM-SERVICE-EDGE ];
            }
            then accept;
        }
        term FABRIC {
            from {
                prefix-list PL-FABRIC;
            }
            then reject;
        }
        term LU {
            from rib inet.3;
            then reject;
        }
        term CT {
            from rib bgp.transport.3;
            then reject;
        }
        term ACCEPT {
            then accept;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-bgp-transport-export.conf

```
/*
 * Topic:   BGP policy PS-BGP-TRANSPORT-EXPORT
 * Seen on:
 *   Junos: ma4_mx204 ma5_mx204
 *   EVO:   ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l
 *
 * Highlights:
 *  - As-deployed PS-BGP-TRANSPORT-EXPORT routing policy.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-metro-ring.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-BGP-TRANSPORT-EXPORT {
        term ORIGIN {
            then {
                community add CM-METRO-RING;
                next term;
            }
        }
        term LOOPBACK {
            from protocol [ direct bgp ];
            then {
                next-hop self;
                accept;
            }
        }
        term LU {
            from rib inet.3;
            then reject;
        }
        term CT {
            from rib bgp.transport.3;
            then reject;
        }
        term ACCEPT-NHS {
            then {
                next-hop self;
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-cr-import.conf

```
/*
 * Topic:   BGP policy PS-CR-IMPORT (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - As-deployed PS-CR-IMPORT routing policy.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-CR-IMPORT {
        term SET-LP {
            then {
                local-preference 90;
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-ebgp-mse-export.conf

```
/*
 * Topic:   BGP policy PS-EBGP-MSE-EXPORT (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - As-deployed PS-EBGP-MSE-EXPORT routing policy.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-metro-fabric.conf
 *  - evo/policy-options/community/cm-metro-ring.conf
 *  - evo/policy-options/community/cm-service-edge.conf
 *  - evo/policy-options/prefix-list/pl-core-nodes.conf
 *  - evo/policy-options/prefix-list/pl-metro-fabric.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-EBGP-MSE-EXPORT {
        term LOOP-PREVENT {
            from community [ CM-SERVICE-EDGE CM-METRO-RING ];
            then reject;
        }
        term LOOPBACK {
            from {
                protocol [ bgp direct ];
                prefix-list PL-CORE-NODES;
                prefix-list PL-METRO-FABRIC;
            }
            then {
                community add CM-METRO-FABRIC;
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-export-l2-color.conf

```
/*
 * Topic:   Per-service L2 vrf-export policy — service RT plus transport-colour community
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 ma4_mx204 ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - The single export-policy structure shared by every L2 service family in
 *    this JVD: instance-type evpn, evpn-vpws, mac-vrf, virtual-switch, vpls and
 *    l2vpn all bind this exact shape. Only the two variables move.
 *  - The policy is named after the routing instance it serves, so the consuming
 *    instance body reads `vrf-export $INSTANCE_NAME;` with no separate policy
 *    name to track.
 *  - `term a` stamps two communities on everything the instance originates:
 *    the per-service route target `${INSTANCE_NAME}_RT`, and a transport-colour
 *    community that steers the service onto a coloured transport class.
 *  - `term b` rejects everything else — the instance advertises only what this
 *    policy explicitly accepts.
 *  - $COLOR_COMMUNITY is the only tier discriminator. Gold and bronze services
 *    differ solely in this binding (`map2gold` / `map2bronze`), so there is no
 *    separate gold or bronze form. The tier lives in the community, not in the
 *    policy structure.
 *  - The colour community itself (`map2gold members color:0:4000`,
 *    `map2bronze members color:0:6000`) and the per-service `${INSTANCE_NAME}_RT`
 *    community are defined under policy-options community; neither definition is
 *    modelled in this library yet.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from meg1_acx7100-32c / evpn_group_80_1000):
 *   $INSTANCE_NAME     e.g. evpn_group_80_1000
 *                      (the routing instance this policy serves; the policy and
 *                       the `${INSTANCE_NAME}_RT` community are both named from it)
 *   $COLOR_COMMUNITY   e.g. map2bronze
 *                      (transport-colour community; map2gold on gold services)
 */
policy-options {
    policy-statement $INSTANCE_NAME {
        term a {
            then {
                community add ${INSTANCE_NAME}_RT;
                community add $COLOR_COMMUNITY;
                accept;
            }
        }
        term b {
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-export-l3vpn-public.conf

```
/*
 * Topic:   L3VPN vrf-export policy — tag and advertise the customer public prefixes
 * Seen on:
 *   Junos: mse1_mx304
 *   EVO:   an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - The export half of the EVPN-IRB L3VPN service (the METRO_L3VPN_40xx
 *    family). One term matches the four customer public aggregates and tags
 *    each accepted route with two communities.
 *  - `CM-L3VPN-PUB` marks the route as a public L3VPN prefix for the fabric;
 *    `$INSTANCE_NAME` is the per-VRF community that the matching
 *    PS-${INSTANCE_NAME}-IMPORT policy looks for on the remote PE.
 *  - There is no `term tag-default`: this VRF exports only the four tagged
 *    aggregates, never a default route. The broader L3VPN families on an3 and
 *    ma3 do carry a default-tagging term — see
 *    evo/policy-options/policy-statement/l3vpn-export-import.conf.
 *  - mse2 runs a superset of this policy that additionally re-tags EVPN
 *    Type-5 NLRI; that form is
 *    junos/policy-options/policy-statement/ps-export-l3vpn-nlri-rt5-public.conf.
 *  - The route-filter prefixes are per-VRF customer aggregates, all matched
 *    `orlonger` so the customer's more-specifics are carried too.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-l3vpn-pub.conf
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from an3_acx7100-48l / METRO_L3VPN_4000):
 *   $INSTANCE_NAME   e.g. METRO_L3VPN_4000
 *                    (the routing instance; the policy is PS-${INSTANCE_NAME}-EXPORT
 *                     and the tagged community carries the same name)
 *   $CE_PREFIX_1     e.g. 40.2.0.0/16
 *   $CE_PREFIX_2     e.g. 41.2.0.0/16
 *   $CE_PREFIX_3     e.g. 43.2.0.0/16
 *   $CE_PREFIX_4     e.g. 44.2.0.0/16
 */
policy-options {
    policy-statement PS-${INSTANCE_NAME}-EXPORT {
        term tag-public-routes {
            from {
                route-filter $CE_PREFIX_1 orlonger;
                route-filter $CE_PREFIX_2 orlonger;
                route-filter $CE_PREFIX_3 orlonger;
                route-filter $CE_PREFIX_4 orlonger;
            }
            then {
                community add CM-L3VPN-PUB;
                community add $INSTANCE_NAME;
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-ibgp-cr-export-cr1.conf

```
/*
 * Topic:   BGP policy PS-IBGP-CR-EXPORT (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - As-deployed PS-IBGP-CR-EXPORT routing policy.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-access-fabric.conf
 *  - evo/policy-options/community/cm-service-edge.conf
 *  - evo/policy-options/community/cm-loopback.conf
 *  - evo/policy-options/prefix-list/pl-metro-ring.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-IBGP-CR-EXPORT {
        term LOOPBACK {
            from {
                protocol direct;
                interface lo0.0;
            }
            then {
                community add CM-LOOPBACK;
                next-hop self;
                accept;
            }
        }
        term METRO-RING {
            from {
                community CM-SERVICE-EDGE;
                prefix-list PL-METRO-RING;
            }
            then {
                inactive: next-hop self;
                accept;
            }
        }
        term METRO-FABRIC {
            from community CM-ACCESS-FABRIC;
            then accept;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-ibgp-cr-export-meg1.conf

```
/*
 * Topic:   BGP policy PS-IBGP-CR-EXPORT (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - As-deployed PS-IBGP-CR-EXPORT routing policy.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-tc-4000-gold.conf
 *  - evo/policy-options/community/cm-tc-6000-bronze.conf
 *  - evo/policy-options/community/cm-access-fabric.conf
 *  - evo/policy-options/community/cm-regional-border.conf
 *  - evo/policy-options/community/cm-service-edge.conf
 *  - evo/policy-options/prefix-list/pl-an-nodes.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-IBGP-CR-EXPORT {
        term LOOP_PREVENT {
            from community [ CM-SERVICE-EDGE CM-REGIONAL-BORDER ];
            then reject;
        }
        inactive: term LOOPBACK {
            from {
                protocol direct;
                interface lo0.0;
            }
            then {
                community add CM-ACCESS-FABRIC;
                next-hop self;
                accept;
            }
        }
        term BGP-CT {
            from {
                protocol [ direct bgp ];
                rib bgp.transport.3;
                community [ CM-TC-4000-GOLD CM-TC-6000-BRONZE ];
            }
            then {
                community add CM-ACCESS-FABRIC;
                next-hop self;
                accept;
            }
        }
        term BGP-LU {
            from {
                rib inet.3;
                prefix-list PL-AN-NODES;
            }
            then {
                community add CM-ACCESS-FABRIC;
                next-hop self;
                accept;
            }
        }
        term BGP-CTv6 {
            from {
                protocol [ direct bgp ];
                rib bgp.transport-inet6.3;
                community [ CM-TC-4000-GOLD CM-TC-6000-BRONZE ];
            }
            then {
                community add CM-ACCESS-FABRIC;
                next-hop self;
                accept;
            }
        }
        term BGP-LUv6 {
            from {
                rib inet6.3;
                community CM-ACCESS-FABRIC;
                prefix-list PL-AN-NODES;
            }
            then {
                next-hop self;
                accept;
            }
        }
        term REJECT {
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-ibgp-mdr-export.conf

```
/*
 * Topic:   BGP policy PS-IBGP-MDR-EXPORT
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509
 *
 * Highlights:
 *  - As-deployed PS-IBGP-MDR-EXPORT routing policy.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-metro-fabric.conf
 *  - evo/policy-options/community/cm-metro-ring.conf
 *  - evo/policy-options/community/cm-loopback.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-IBGP-MDR-EXPORT {
        term LOOPBACK {
            from {
                protocol direct;
                interface lo0.0;
            }
            then {
                community add CM-LOOPBACK;
                community add CM-METRO-RING;
                next-hop self;
                accept;
            }
        }
        term METRO-FABRIC {
            from community CM-METRO-FABRIC;
            then {
                next-hop self;
                accept;
            }
        }
        term METRO-RING {
            from community CM-METRO-RING;
            then accept;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-ibgp-rr-export.conf

```
/*
 * Topic:   BGP policy PS-IBGP-RR-EXPORT
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509
 *
 * Highlights:
 *  - As-deployed PS-IBGP-RR-EXPORT routing policy.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-access-fabric.conf
 *  - evo/policy-options/community/cm-metro-fabric.conf
 *  - evo/policy-options/prefix-list/pl-an-region.conf
 *  - evo/policy-options/prefix-list/pl-mse.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-IBGP-RR-EXPORT {
        term MSE-NHS {
            from {
                protocol bgp;
                prefix-list PL-MSE;
            }
            then {
                next-hop self;
                accept;
            }
        }
        term AS63535 {
            from {
                protocol bgp;
                community [ CM-ACCESS-FABRIC CM-METRO-FABRIC ];
            }
            then {
                next-hop self;
                accept;
            }
        }
        term RING {
            from {
                prefix-list PL-AN-REGION;
            }
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-import-bgp-lo0-filter.conf

```
/*
 * Topic:   BGP import policy IMPORT-BGP (LOOPBACK reject) with the LOOPBACK prefix-list it matches
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `term 1` drops routes matching `prefix-list LOOPBACK`; `term 2` accepts
 *    everything else.
 *  - The prefix-list carries the node's primary loopback and its SR non-zero
 *    loopback address, so the policy and the list it matches are one unit.
 *
 * Pair with: none
 *
 * Variables (example values from meg1_acx7100-32c):
 *   $LOOPBACK_V4     e.g. 1.1.0.6
 *   $LOOPBACK_SR_V4  e.g. 1.1.10.6
 */
policy-options {
    prefix-list LOOPBACK {
        $LOOPBACK_V4/32;
        $LOOPBACK_SR_V4/32;
    }
    policy-statement IMPORT-BGP {
        term 1 {
            from {
                prefix-list LOOPBACK;
            }
            then reject;
        }
        term 2 {
            then accept;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-import-l3vpn.conf

```
/*
 * Topic:   L3VPN vrf-import policy — accept the per-VRF community only
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - The import half of the EVPN-IRB L3VPN service (the METRO_L3VPN_40xx
 *    family). A single term accepts routes carrying the VRF's own community
 *    and nothing else.
 *  - Deliberately slim: no `term INTERNET` accepting CM-INET-DEFAULT. These
 *    VRFs are EVPN Type-5 gateways for a paired E-LAN, not Internet-attached
 *    customer VRFs, so no Internet default is imported. The broader L3VPN
 *    families on an3 and ma3 use the two-term form in
 *    evo/policy-options/policy-statement/l3vpn-export-import.conf instead.
 *  - The policy name, the community it matches and the routing instance all
 *    derive from one identity stem: instance METRO_L3VPN_4000 binds
 *    `vrf-import PS-METRO_L3VPN_4000-IMPORT;`, which matches community
 *    METRO_L3VPN_4000.
 *  - The per-VRF community itself is defined under policy-options community
 *    (`community METRO_L3VPN_4000 members target:61535:13000;`).
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from an3_acx7100-48l / METRO_L3VPN_4000):
 *   $INSTANCE_NAME   e.g. METRO_L3VPN_4000
 *                    (the routing instance; the policy is PS-${INSTANCE_NAME}-IMPORT
 *                     and the matched community carries the same name)
 */
policy-options {
    policy-statement PS-${INSTANCE_NAME}-IMPORT {
        term L3VPN-CUST {
            from community $INSTANCE_NAME;
            then accept;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-metro-fabric-import.conf

```
/*
 * Topic:   BGP policy PS-METRO-FABRIC-IMPORT (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - As-deployed PS-METRO-FABRIC-IMPORT routing policy.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-access-fabric.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-METRO-FABRIC-IMPORT {
        term ACCESS-FABRIC {
            from community CM-ACCESS-FABRIC;
            then accept;
        }
        term REJECT {
            then reject;
        }
    }
}
```

## evo/policy-options/prefix-list/border-nodes.conf

```
/*
 * Topic:   Prefix-list BORDER-NODES (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr2_ptx10001-36mr
 *
 * Highlights:
 *  - As-deployed BORDER-NODES prefix-list.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    prefix-list BORDER-NODES {
        1.1.0.8/32;
        1.1.0.9/32;
        1.1.0.10/32;
        1.1.0.11/32;
    }
}
```

## evo/policy-options/prefix-list/pl-an-nodes.conf

```
/*
 * Topic:   Prefix-list PL-AN-NODES (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - As-deployed PL-AN-NODES prefix-list.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    prefix-list PL-AN-NODES {
        1.1.0.0/32;
        1.1.0.1/32;
        1.1.0.2/32;
        1.1.0.3/32;
        1.1.0.6/32;
        1.1.0.7/32;
    }
}
```

## evo/policy-options/prefix-list/pl-an-region.conf

```
/*
 * Topic:   Prefix-list PL-AN-REGION
 * Seen on:
 *   Junos: mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   mdr1_acx7509
 *
 * Highlights:
 *  - As-deployed PL-AN-REGION prefix-list.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    prefix-list PL-AN-REGION {
        1.1.0.12/32;
        1.1.0.13/32;
        1.1.0.14/32;
        1.1.0.15/32;
        1.1.0.16/32;
        1.1.0.17/32;
        1.1.0.18/32;
        1.1.0.19/32;
    }
}
```

## evo/policy-options/prefix-list/pl-border-nodes.conf

```
/*
 * Topic:   Prefix-list PL-BORDER-NODES (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr1_ptx10001-36mr
 *
 * Highlights:
 *  - As-deployed PL-BORDER-NODES prefix-list.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    prefix-list PL-BORDER-NODES {
        1.1.0.8/32;
        1.1.0.9/32;
        1.1.0.10/32;
        1.1.0.11/32;
    }
}
```

## evo/policy-options/prefix-list/pl-core-nodes.conf

```
/*
 * Topic:   Prefix-list PL-CORE-NODES (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - As-deployed PL-CORE-NODES prefix-list.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    prefix-list PL-CORE-NODES {
        1.1.0.8/32;
        1.1.0.9/32;
    }
}
```

## evo/policy-options/prefix-list/pl-core.conf

```
/*
 * Topic:   Prefix-list PL-CORE (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - As-deployed PL-CORE prefix-list.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    prefix-list PL-CORE {
        1.1.0.8/32;
        1.1.0.9/32;
    }
}
```

## evo/policy-options/prefix-list/pl-fabric.conf

```
/*
 * Topic:   Prefix-list PL-FABRIC (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - As-deployed PL-FABRIC prefix-list.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    prefix-list PL-FABRIC {
        1.1.0.0/32;
        1.1.0.1/32;
        1.1.0.2/32;
        1.1.0.3/32;
        1.1.0.4/32;
        1.1.0.5/32;
        1.1.0.6/32;
        1.1.0.7/32;
    }
}
```

## evo/policy-options/prefix-list/pl-metro-fabric.conf

```
/*
 * Topic:   Prefix-list PL-METRO-FABRIC (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - As-deployed PL-METRO-FABRIC prefix-list.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    prefix-list PL-METRO-FABRIC {
        1.1.0.0/32;
        1.1.0.1/32;
        1.1.0.2/32;
        1.1.0.3/32;
        1.1.0.4/32;
        1.1.0.5/32;
        1.1.0.6/32;
        1.1.0.7/32;
    }
}
```

## evo/policy-options/prefix-list/pl-metro-ring.conf

```
/*
 * Topic:   Prefix-list PL-METRO-RING (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - As-deployed PL-METRO-RING prefix-list.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    prefix-list PL-METRO-RING {
        1.1.0.10/32;
        1.1.0.11/32;
        1.1.0.12/32;
        1.1.0.13/32;
        1.1.0.14/32;
        1.1.0.15/32;
        1.1.0.16/32;
        1.1.0.17/32;
        1.1.0.18/32;
        1.1.0.19/32;
    }
}
```

## evo/policy-options/prefix-list/pl-mse.conf

```
/*
 * Topic:   Prefix-list PL-MSE
 * Seen on:
 *   Junos: mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   mdr1_acx7509
 *
 * Highlights:
 *  - As-deployed PL-MSE prefix-list.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    prefix-list PL-MSE {
        1.1.0.10/32;
        1.1.0.11/32;
        1.1.10.10/32;
    }
}
```

## evo/protocols/bgp-overlay-an3.conf

```
/*
 * Topic:   Complete deployed BGP form for an3_acx7100-48l (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 * Variant group: mebs-bgp-overlay
 *   Provides: evpn, l2vpn, inet-vpn, inet6-vpn, labeled-unicast
 *
 * Highlights:
 *  - Complete deployed BGP control-plane form for an3_acx7100-48l.
 *
 * Pair with:
 *  - evo/groups/gr-bgp-bcp-an3.conf
 *  - evo/policy-options/policy-statement/ps-bgp-export.conf
 *  - evo/routing-options/rib-groups.conf
 *
 * Variables: none
 */
protocols {
    bgp {
        apply-groups GR-BGP-BCP;
        advertise-from-main-vpn-tables;
        vpn-apply-export;
        group GR-IBGP-MEG-RR {
            type internal;
            local-address 1.1.0.2;
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
            neighbor 1.1.0.6 {
                description "MEG1 - rtme-acx7100-32c-d";
            }
            neighbor 1.1.0.7 {
                description "MEG2 - rtme-acx7509-01";
            }
        }
        log-updown;
        graceful-restart;
        multipath;
    }
}
```

## evo/protocols/bgp-overlay-cr1.conf

```
/*
 * Topic:   Complete deployed BGP form for cr1_ptx10001-36mr (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr1_ptx10001-36mr
 * Variant group: mebs-bgp-overlay
 *   Provides: labeled-unicast
 *
 * Highlights:
 *  - Complete deployed BGP control-plane form for cr1_ptx10001-36mr.
 *
 * Pair with:
 *  - evo/groups/gr-bgp-bcp.conf
 *  - evo/policy-options/policy-statement/ps-as63536-import.conf
 *  - evo/policy-options/policy-statement/ps-bgp-export-ring-cr1.conf
 *  - evo/policy-options/policy-statement/ps-cr-import.conf
 *  - evo/policy-options/policy-statement/ps-ebgp-mse-export.conf
 *  - evo/policy-options/policy-statement/ps-ibgp-cr-export-cr1.conf
 *  - evo/policy-options/policy-statement/ps-metro-fabric-import.conf
 *  - evo/routing-options/rib-groups.conf
 *
 * Variables: none
 */
protocols {
    bgp {
        apply-groups GR-BGP-BCP;
        group GR-IBGP-MEG-RR {
            type internal;
            local-address 1.1.0.8;
            inactive: import PS-METRO-FABRIC-IMPORT;
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
            export PS-BGP-EXPORT-RING;
            inactive: cluster 1.1.0.8;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.6;
            neighbor 1.1.0.7;
        }
        group GR-EBGP-MSE1-TP {
            type external;
            import PS-AS63536-IMPORT;
            family inet {
                labeled-unicast {
                    rib-group RG-REMOTE-LOOPBACKS;
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                    per-prefix-label;
                    rib {
                        inet.3;
                    }
                    explicit-null connected-only;
                    protection;
                }
                transport {
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                    protection;
                }
            }
            family inet6 {
                labeled-unicast {
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                    per-prefix-label;
                    rib {
                        inet6.3;
                    }
                    protection;
                }
                transport {
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                    protection;
                }
            }
            export PS-EBGP-MSE-EXPORT;
            peer-as 63536;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 10.10.0.38;
        }
        group GR-IBGP-CR {
            type internal;
            local-address 1.1.0.8;
            import PS-CR-IMPORT;
            family inet {
                labeled-unicast {
                    rib-group RG-REMOTE-LOOPBACKS;
                    add-path {
                        receive;
                        send {
                            path-count 2;
                            multipath;
                        }
                    }
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
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
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
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
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                }
            }
            export PS-IBGP-CR-EXPORT;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.9 {
                description "CR2 neighbor";
            }
        }
        log-updown;
        graceful-restart;
        multipath;
    }
}
```

## evo/protocols/bgp-overlay-cr2.conf

```
/*
 * Topic:   Complete deployed BGP form for cr2_ptx10001-36mr (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr2_ptx10001-36mr
 * Variant group: mebs-bgp-overlay
 *   Provides: labeled-unicast
 *
 * Highlights:
 *  - Complete deployed BGP control-plane form for cr2_ptx10001-36mr.
 *
 * Pair with:
 *  - evo/groups/gr-bgp-bcp.conf
 *  - evo/policy-options/policy-statement/ps-as63536-import.conf
 *  - evo/policy-options/policy-statement/ps-bgp-export-ring-cr2.conf
 *  - evo/policy-options/policy-statement/ps-cr-import.conf
 *  - evo/policy-options/policy-statement/ps-ebgp-mse-export.conf
 *  - evo/policy-options/policy-statement/ps-ibgp-cr-export-cr1.conf
 *  - evo/policy-options/policy-statement/ps-metro-fabric-import.conf
 *  - evo/routing-options/rib-groups.conf
 *
 * Variables: none
 */
protocols {
    bgp {
        apply-groups GR-BGP-BCP;
        group GR-IBGP-MEG-RR {
            type internal;
            local-address 1.1.0.9;
            inactive: import PS-METRO-FABRIC-IMPORT;
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
            export PS-BGP-EXPORT-RING;
            inactive: cluster 1.1.0.9;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.6;
            neighbor 1.1.0.7;
        }
        group GR-EBGP-MSE2-TP {
            type external;
            import PS-AS63536-IMPORT;
            family inet {
                labeled-unicast {
                    rib-group RG-REMOTE-LOOPBACKS;
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                    per-prefix-label;
                    rib {
                        inet.3;
                    }
                    explicit-null connected-only;
                    protection;
                }
                transport {
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                    protection;
                }
            }
            family inet6 {
                labeled-unicast {
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                    per-prefix-label;
                    rib {
                        inet6.3;
                    }
                    protection;
                }
                transport {
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                    protection;
                }
            }
            export PS-EBGP-MSE-EXPORT;
            peer-as 63536;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 10.10.0.46;
        }
        group GR-IBGP-CR {
            type internal;
            local-address 1.1.0.9;
            import PS-CR-IMPORT;
            family inet {
                labeled-unicast {
                    rib-group RG-REMOTE-LOOPBACKS;
                    add-path {
                        receive;
                        send {
                            path-count 2;
                            multipath;
                        }
                    }
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
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
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
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
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                }
            }
            export PS-IBGP-CR-EXPORT;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.8 {
                description "CR1 neighbor";
            }
        }
        log-updown;
        graceful-restart;
        multipath;
    }
}
```

## evo/protocols/bgp-overlay-ma3.conf

```
/*
 * Topic:   Complete deployed BGP form for ma3_acx7100-48l (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma3_acx7100-48l
 * Variant group: mebs-bgp-overlay
 *   Provides: evpn, l2vpn, inet-vpn, inet6-vpn, labeled-unicast
 *
 * Highlights:
 *  - Complete deployed BGP control-plane form for ma3_acx7100-48l.
 *
 * Pair with:
 *  - evo/groups/gr-bgp-bcp.conf
 *  - evo/policy-options/policy-statement/nhs1-ma3.conf
 *  - evo/policy-options/policy-statement/ps-bgp-transport-export.conf
 *  - evo/routing-options/rib-groups.conf
 *
 * Variables: none
 */
protocols {
    bgp {
        apply-groups GR-BGP-BCP;
        advertise-from-main-vpn-tables;
        vpn-apply-export;
        group GR-IBGP-MDR {
            type internal;
            local-address 1.1.0.15;
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
            neighbor 1.1.0.12;
            neighbor 1.1.0.13;
        }
        group mpbgp_ma_rr-client {
            type internal;
            local-address 1.1.0.15;
            family inet-vpn {
                unicast;
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
            export nhs1;
            bfd-liveness-detection {
                minimum-interval 200;
                multiplier 3;
            }
            neighbor 1.1.0.10;
            neighbor 1.1.0.11;
        }
        log-updown;
        graceful-restart;
        multipath;
    }
}
```

## evo/protocols/bgp-overlay-mdr1.conf

```
/*
 * Topic:   Complete deployed BGP form for mdr1_acx7509 (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   mdr1_acx7509
 * Variant group: mebs-bgp-overlay
 *   Provides: labeled-unicast
 *
 * Highlights:
 *  - Complete deployed BGP control-plane form for mdr1_acx7509.
 *
 * Pair with:
 *  - evo/groups/gr-bgp-bcp.conf
 *  - evo/policy-options/policy-statement/ps-bgp-mse-export.conf
 *  - evo/policy-options/policy-statement/ps-ibgp-mdr-export.conf
 *  - evo/policy-options/policy-statement/ps-ibgp-rr-export.conf
 *  - evo/routing-options/rib-groups.conf
 *
 * Variables: none
 */
protocols {
    bgp {
        apply-groups GR-BGP-BCP;
        advertise-from-main-vpn-tables;
        vpn-apply-export;
        group GR-IBGP-RING-RR {
            type internal;
            local-address 1.1.0.12;
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
            export PS-IBGP-RR-EXPORT;
            cluster 1.1.0.12;
            no-client-reflect;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.17 {
                description "MA1.1 rtme-acx7024-04";
            }
            neighbor 1.1.0.18 {
                description "MA1.2 rtme-acx7024-01";
            }
            neighbor 1.1.0.19 {
                description "MA5 rtme-mx-59";
            }
            neighbor 1.1.0.15 {
                description "MA3 rtme-acx-48l-07";
            }
            neighbor 1.1.0.16 {
                description "MA4 rtme-mx204-10";
            }
        }
        group GR-IBGP-MSE {
            type internal;
            local-address 1.1.0.12;
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
            export PS-BGP-MSE-EXPORT;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.10;
            neighbor 1.1.0.11;
        }
        group GR-IBGP-MDR {
            type internal;
            local-address 1.1.0.12;
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
                    }
                }
            }
            export PS-IBGP-MDR-EXPORT;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.13;
        }
    }
}
```

## evo/protocols/bgp-overlay-meg1.conf

```
/*
 * Topic:   Complete deployed BGP form for meg1_acx7100-32c
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg1_acx7100-32c
 * Variant group: mebs-bgp-overlay
 *   Provides: evpn, l2vpn, inet-vpn, inet6-vpn, labeled-unicast
 *
 * Highlights:
 *  - Complete deployed BGP control-plane form for meg1_acx7100-32c.
 *
 * Pair with:
 *  - evo/groups/gr-bgp-bcp.conf
 *  - evo/policy-options/policy-statement/ps-import-bgp-lo0-filter.conf
 *  - evo/policy-options/policy-statement/ps-bgp-rr-export.conf
 *  - evo/policy-options/policy-statement/ps-ibgp-cr-export-meg1.conf
 *  - evo/routing-options/rib-groups.conf
 *
 * Variables: none
 */
protocols {
    bgp {
        apply-groups GR-BGP-BCP;
        advertise-from-main-vpn-tables;
        vpn-apply-export;
        group GR-IBGP-FABRIC-RR {
            type internal;
            local-address 1.1.0.6;
            import IMPORT-BGP;
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
            export PS-BGP-RR-EXPORT;
            cluster 1.1.0.6;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.0 {
                description "AN1 - rtme-mx-45";
            }
            neighbor 1.1.0.1 {
                description "AN2 - rtme-acx17";
            }
            neighbor 1.1.0.2 {
                description "AN3 - rtme-acx-48l-05";
            }
            neighbor 1.1.0.3 {
                description "AN4 - rtme-acx710-h";
            }
        }
        group GR-IBGP-CR {
            type internal;
            local-address 1.1.0.6;
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
            export PS-IBGP-CR-EXPORT;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.8;
            neighbor 1.1.0.9;
        }
        group ibgp_meg {
            type internal;
            local-address 1.1.0.6;
            family l2vpn {
                signaling;
            }
            family evpn {
                signaling;
            }
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.7;
        }
        group ebgp_mse_mpbgp {
            type external;
            multihop {
                no-nexthop-change;
            }
            local-address 1.1.0.6;
            family inet-vpn {
                unicast;
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
                external-paths 4;
                nexthop-resolution {
                    no-resolution;
                }
            }
            peer-as 63536;
            multipath;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.10;
            neighbor 1.1.0.11;
        }
        log-updown;
        graceful-restart;
        multipath;
    }
}
```

## evo/protocols/bgp-overlay-meg2.conf

```
/*
 * Topic:   Complete deployed BGP form for meg2_acx7509
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg2_acx7509
 * Variant group: mebs-bgp-overlay
 *   Provides: evpn, l2vpn, inet-vpn, inet6-vpn, labeled-unicast
 *
 * Highlights:
 *  - Complete deployed BGP control-plane form for meg2_acx7509.
 *
 * Pair with:
 *  - evo/groups/gr-bgp-bcp.conf
 *  - evo/policy-options/policy-statement/ps-import-bgp-lo0-filter.conf
 *  - evo/policy-options/policy-statement/ps-bgp-rr-export.conf
 *  - evo/policy-options/policy-statement/ps-ibgp-cr-export-meg1.conf
 *  - evo/routing-options/rib-groups.conf
 *
 * Variables: none
 */
protocols {
    bgp {
        apply-groups GR-BGP-BCP;
        advertise-from-main-vpn-tables;
        vpn-apply-export;
        group GR-IBGP-FABRIC-RR {
            type internal;
            local-address 1.1.0.7;
            import IMPORT-BGP;
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
            export PS-BGP-RR-EXPORT;
            cluster 1.1.0.7;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.0;
            neighbor 1.1.0.1;
            neighbor 1.1.0.2;
            neighbor 1.1.0.3;
        }
        group GR-IBGP-CR {
            type internal;
            local-address 1.1.0.7;
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
            export PS-IBGP-CR-EXPORT;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.8;
            neighbor 1.1.0.9;
        }
        group ibgp_meg {
            type internal;
            local-address 1.1.0.7;
            family l2vpn {
                signaling;
            }
            family evpn {
                signaling;
            }
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.6;
        }
        group ebgp_mse_mpbgp {
            type external;
            multihop {
                no-nexthop-change;
            }
            local-address 1.1.0.7;
            family inet-vpn {
                unicast;
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
                external-paths 4;
                nexthop-resolution {
                    no-resolution;
                }
            }
            peer-as 63536;
            local-as 63535;
            multipath;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.10;
            neighbor 1.1.0.11;
        }
        log-updown;
        graceful-restart;
        multipath;
    }
}
```

## evo/protocols/bgp-overlay.conf

```
/*
 * Topic:   iBGP overlay sessions to RR (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma1-1_acx7024 ma1-2_acx7024
 * Variant group: mebs-bgp-overlay
 *   Provides: evpn, l2vpn, inet-vpn, labeled-unicast
 *
 * Highlights:
 *  - Complete deployed iBGP overlay form for ma1-1_acx7024 / ma1-2_acx7024
 *    (transport + service groups). This is a role-specific as-deployed form,
 *    not a universal per-service prerequisite — a MEF service activates
 *    only its own signaling AF.
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
 *  - evo/groups/gr-bgp-bcp.conf
 *  - evo/routing-options/rib-groups.conf
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

## evo/protocols/isis-srmpls-tilfa.conf

```
/*
 * Topic:   ISIS underlay with SR-MPLS, TI-LFA and Flex-Algo
 * Seen on:
 *   Junos: ma2_mx204 ma4_mx204 ma5_mx204
 *   EVO:   ma1-1_acx7024
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
 *  - evo/protocols/mpls-segment-routing.conf
 *  - evo/groups/gr-isis-bcp.conf
 *  - evo/groups/gr-core-intf.conf
 *  - evo/interfaces/core-isis-mpls.conf
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

## evo/protocols/l2circuit-hsb-hub-color-ignore-encap.conf

```
/*
 * Topic:   L2circuit hot-standby hub with transport-colour community and encapsulation-mismatch tolerance (MEF E-Line / EVPL)
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - LDP-signalled L2Circuit PW to a primary neighbour with a backup-neighbour
 *    carrying hot-standby, so the standby PW is held up for immediate
 *    switchover (switchover-delay 0 arrives from GR-L2CKT-HS).
 *  - The virtual-circuit-id pair identifies the two PW endpoints (3001/4001).
 *  - ignore-encapsulation-mismatch and ignore-mtu-mismatch both relax the
 *    signalled checks, so the PW comes up across an encapsulation or MTU
 *    difference between the two endpoints.
 *  - flow-label-transmit and flow-label-receive give FAT-PW ECMP load
 *    balancing; control-word and encapsulation-type ethernet-vlan complete
 *    the pseudowire.
 *  - The transport-colour community is set on both the primary and the backup
 *    neighbour, so either PW follows the same coloured BGP-CT underlay.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-tc-map2gold.conf
 *  - evo/groups/gr-l2ckt-hs.conf
 *  - evo/groups/gr-fatpw-lb.conf
 *  - evo/interfaces/ifl-vlan-ccc-vlan-map-filter-ccc.conf
 *
 * Variables (example values from an3_acx7100-48l):
 *   $AC_INTF          e.g. et-0/0/0
 *   $UNIT             e.g. 3001
 *   $PRIMARY_LOOPBACK e.g. 1.1.0.6
 *   $BACKUP_LOOPBACK  e.g. 1.1.0.7
 *   $VC_ID_PRIMARY    e.g. 3001
 *   $VC_ID_BACKUP     e.g. 4001
 */
protocols {
    l2circuit {
        neighbor $PRIMARY_LOOPBACK {
            interface $AC_INTF.$UNIT {
                virtual-circuit-id $VC_ID_PRIMARY;
                control-word;
                flow-label-transmit;
                flow-label-receive;
                community CM-TC-MAP2GOLD;
                encapsulation-type ethernet-vlan;
                ignore-encapsulation-mismatch;
                ignore-mtu-mismatch;
                pseudowire-status-tlv;
                backup-neighbor $BACKUP_LOOPBACK {
                    virtual-circuit-id $VC_ID_BACKUP;
                    community CM-TC-MAP2GOLD;
                    hot-standby;
                }
            }
        }
    }
}
```

## evo/protocols/l2circuit-hsb-hub-color.conf

```
/*
 * Topic:   L2circuit hot-standby hub with transport-colour community (MEF E-Line / EVPL)
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - LDP-signalled L2Circuit PW to a primary neighbour with a backup-neighbour
 *    carrying hot-standby, so the standby PW is held up for immediate
 *    switchover (switchover-delay 0 arrives from GR-L2CKT-HS).
 *  - The virtual-circuit-id pair identifies the two PW endpoints (3000/4000).
 *  - flow-label-transmit and flow-label-receive give FAT-PW ECMP load
 *    balancing; control-word, encapsulation-type ethernet-vlan and
 *    ignore-mtu-mismatch complete the pseudowire.
 *  - The transport-colour community is set on both the primary and the backup
 *    neighbour, so either PW follows the same coloured BGP-CT underlay.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-tc-map2gold.conf
 *  - evo/groups/gr-l2ckt-hs.conf
 *  - evo/groups/gr-fatpw-lb.conf
 *  - evo/interfaces/ifl-vlan-ccc-vlan-map-filter-ccc.conf
 *
 * Variables (example values from an3_acx7100-48l):
 *   $AC_INTF          e.g. et-0/0/0
 *   $UNIT             e.g. 3000
 *   $PRIMARY_LOOPBACK e.g. 1.1.0.6
 *   $BACKUP_LOOPBACK  e.g. 1.1.0.7
 *   $VC_ID_PRIMARY    e.g. 3000
 *   $VC_ID_BACKUP     e.g. 4000
 */
protocols {
    l2circuit {
        neighbor $PRIMARY_LOOPBACK {
            interface $AC_INTF.$UNIT {
                virtual-circuit-id $VC_ID_PRIMARY;
                control-word;
                flow-label-transmit;
                flow-label-receive;
                community CM-TC-MAP2GOLD;
                encapsulation-type ethernet-vlan;
                ignore-mtu-mismatch;
                pseudowire-status-tlv;
                backup-neighbor $BACKUP_LOOPBACK {
                    virtual-circuit-id $VC_ID_BACKUP;
                    community CM-TC-MAP2GOLD;
                    hot-standby;
                }
            }
        }
    }
}
```

## evo/protocols/l2circuit-hsb-hub-ignore-encap.conf

```
/*
 * Topic:   L2circuit hot-standby hub with encapsulation-mismatch tolerance (MEF E-Line / EVPL)
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - LDP-signalled L2Circuit PW to a primary neighbour with a backup-neighbour
 *    carrying hot-standby, so the standby PW is held up for immediate
 *    switchover (switchover-delay 0 arrives from GR-L2CKT-HS).
 *  - The virtual-circuit-id pair identifies the two PW endpoints (3500/4500).
 *  - ignore-encapsulation-mismatch and ignore-mtu-mismatch both relax the
 *    signalled checks, so the PW comes up across an encapsulation or MTU
 *    difference between the two endpoints.
 *  - flow-label-transmit and flow-label-receive give FAT-PW ECMP load
 *    balancing; control-word and encapsulation-type ethernet-vlan complete
 *    the pseudowire.
 *
 * Pair with:
 *  - evo/groups/gr-l2ckt-hs.conf
 *  - evo/groups/gr-fatpw-lb.conf
 *  - evo/interfaces/ifl-vlan-ccc-vlan-map-filter-ccc.conf
 *
 * Variables (example values from an3_acx7100-48l):
 *   $AC_INTF          e.g. et-0/0/0
 *   $UNIT             e.g. 3500
 *   $PRIMARY_LOOPBACK e.g. 1.1.0.6
 *   $BACKUP_LOOPBACK  e.g. 1.1.0.7
 *   $VC_ID_PRIMARY    e.g. 3500
 *   $VC_ID_BACKUP     e.g. 4500
 */
protocols {
    l2circuit {
        neighbor $PRIMARY_LOOPBACK {
            interface $AC_INTF.$UNIT {
                virtual-circuit-id $VC_ID_PRIMARY;
                control-word;
                flow-label-transmit;
                flow-label-receive;
                encapsulation-type ethernet-vlan;
                ignore-encapsulation-mismatch;
                ignore-mtu-mismatch;
                pseudowire-status-tlv;
                backup-neighbor $BACKUP_LOOPBACK {
                    virtual-circuit-id $VC_ID_BACKUP;
                    hot-standby;
                }
            }
        }
    }
}
```

## evo/protocols/l2circuit-hsb-pe-color.conf

```
/*
 * Topic:   L2circuit hot-standby — Backup / standby PE (hot-standby-vc-on, MEF E-Line / EVPL)
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg2_acx7509
 *
 * Highlights:
 *  - Backup (standby) PE endpoint of a hot-standby L2Circuit. It targets the
 *    Hub's loopback ($HUB_LOOPBACK) and signals hot-standby-vc-on so the Hub
 *    keeps this standby PW hot for sub-second switchover. The pseudowire-status-tlv
 *    carries hot-standby-vc-on inline on this device. The Primary/active PE of
 *    the same service leaves pseudowire-status-tlv bare — see
 *    l2circuit-hsb-pe-primary-color.conf.
 *  - control-word, flow-label-{transmit,receive} (FAT-PW ECMP),
 *    encapsulation-type ethernet-vlan, ignore-encapsulation-mismatch,
 *    ignore-mtu-mismatch.
 *  - Per-PW transport-class community (map2gold) lets the PW follow a
 *    specific BGP-CT colour underlay.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-tc-map2gold.conf
 *  - evo/groups/gr-l2ckt-hs.conf (hot-standby-vc-on knob)
 *  - evo/groups/gr-fatpw-lb.conf (forwarding-options)
 *
 * JVD service mapping:
 *   2000 instances total (high 2000 / med 0 / low 0)
 *   On devices: an3_acx7100-48l (2000), meg1_acx7100-32c (1000), meg2_acx7509 (1000)
 *   Example: l2ckt-vc3000 (RD —, RT —)
 *     meg1_acx7100-32c  et-0/0/26:3.3000  ->  an3_acx7100-48l (hub 1.1.0.2)
 *
 * Variables (example values from meg1_acx7100-32c):
 *   $AC_INTF       e.g. et-0/0/26:3
 *   $UNIT          e.g. 3000
 *   $HUB_LOOPBACK  e.g. 1.1.0.2
 *   $VC_ID         e.g. 3000
 */
protocols {
    l2circuit {
        neighbor $HUB_LOOPBACK {
            interface $AC_INTF.$UNIT {
                virtual-circuit-id $VC_ID;
                control-word;
                flow-label-transmit;
                flow-label-receive;
                community map2gold;
                encapsulation-type ethernet-vlan;
                ignore-encapsulation-mismatch;
                ignore-mtu-mismatch;
                pseudowire-status-tlv {
                    hot-standby-vc-on;
                }
            }
        }
    }
}
```

## evo/protocols/l2circuit-hsb-pe-primary-color.conf

```
/*
 * Topic:   L2circuit hot-standby — Primary / active PE (bare pseudowire-status-tlv, MEF E-Line / EVPL)
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg1_acx7100-32c
 *
 * Highlights:
 *  - Primary (active) PE endpoint of a hot-standby L2Circuit. It targets
 *    the Hub's loopback ($HUB_LOOPBACK) and carries the active VC. Unlike
 *    the Backup/standby PE it does NOT signal hot-standby-vc-on — the
 *    pseudowire-status-tlv leaf is left bare. See l2circuit-hsb-pe-color.conf
 *    for the Backup/standby PE form (which adds hot-standby-vc-on).
 *  - control-word, flow-label-{transmit,receive} (FAT-PW ECMP),
 *    encapsulation-type ethernet-vlan, ignore-encapsulation-mismatch,
 *    ignore-mtu-mismatch.
 *  - Per-PW transport-class community (map2gold) lets the PW follow a
 *    specific BGP-CT colour underlay.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-tc-map2gold.conf
 *  - evo/groups/gr-fatpw-lb.conf (forwarding-options)
 *
 * JVD service mapping:
 *   2000 instances total (high 2000 / med 0 / low 0)
 *   On devices: an3_acx7100-48l (2000), meg1_acx7100-32c (1000), meg2_acx7509 (1000)
 *   Example: l2ckt-vc3000 (RD —, RT —)
 *     meg1_acx7100-32c  et-0/0/26:3.3000  ->  an3_acx7100-48l (hub 1.1.0.2)
 *
 * Variables (example values from meg1_acx7100-32c):
 *   $AC_INTF       e.g. et-0/0/26:3
 *   $UNIT          e.g. 3000
 *   $HUB_LOOPBACK  e.g. 1.1.0.2
 *   $VC_ID         e.g. 3000
 */
protocols {
    l2circuit {
        neighbor $HUB_LOOPBACK {
            interface $AC_INTF.$UNIT {
                virtual-circuit-id $VC_ID;
                control-word;
                flow-label-transmit;
                flow-label-receive;
                community map2gold;
                encapsulation-type ethernet-vlan;
                ignore-encapsulation-mismatch;
                ignore-mtu-mismatch;
                pseudowire-status-tlv;
            }
        }
    }
}
```

## evo/protocols/l2circuit-hsb-pe-primary.conf

```
/*
 * Topic:   L2circuit hot-standby PE with bare pseudowire-status-tlv (MEF E-Line / EVPL)
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg1_acx7100-32c
 *
 * Highlights:
 *  - PE endpoint of a hot-standby L2Circuit, targeting the hub's loopback.
 *  - pseudowire-status-tlv is present as a bare leaf, so PW status is
 *    signalled without the hot-standby-vc-on knob.
 *  - ignore-encapsulation-mismatch and ignore-mtu-mismatch both relax the
 *    signalled checks, so the PW comes up across an encapsulation or MTU
 *    difference between the two endpoints.
 *  - flow-label-transmit and flow-label-receive give FAT-PW ECMP load
 *    balancing; control-word and encapsulation-type ethernet-vlan complete
 *    the pseudowire.
 *
 * Pair with:
 *  - evo/groups/gr-fatpw-lb.conf
 *
 * Variables (example values from meg1_acx7100-32c):
 *   $AC_INTF       e.g. et-0/0/26:3
 *   $UNIT          e.g. 3500
 *   $HUB_LOOPBACK  e.g. 1.1.0.2
 *   $VC_ID         e.g. 3500
 */
protocols {
    l2circuit {
        neighbor $HUB_LOOPBACK {
            interface $AC_INTF.$UNIT {
                virtual-circuit-id $VC_ID;
                control-word;
                flow-label-transmit;
                flow-label-receive;
                encapsulation-type ethernet-vlan;
                ignore-encapsulation-mismatch;
                ignore-mtu-mismatch;
                pseudowire-status-tlv;
            }
        }
    }
}
```

## evo/protocols/l2circuit-hsb-pe.conf

```
/*
 * Topic:   L2circuit hot-standby PE signalling hot-standby-vc-on (MEF E-Line / EVPL)
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg2_acx7509
 *
 * Highlights:
 *  - PE endpoint of a hot-standby L2Circuit, targeting the hub's loopback.
 *  - pseudowire-status-tlv carries hot-standby-vc-on, so the hub keeps this
 *    PW hot and can switch to it without re-signalling.
 *  - ignore-encapsulation-mismatch and ignore-mtu-mismatch both relax the
 *    signalled checks, so the PW comes up across an encapsulation or MTU
 *    difference between the two endpoints.
 *  - flow-label-transmit and flow-label-receive give FAT-PW ECMP load
 *    balancing; control-word and encapsulation-type ethernet-vlan complete
 *    the pseudowire.
 *
 * Pair with:
 *  - evo/groups/gr-l2ckt-hs.conf
 *  - evo/groups/gr-fatpw-lb.conf
 *
 * Variables (example values from meg2_acx7509):
 *   $AC_INTF       e.g. et-2/0/2
 *   $UNIT          e.g. 3500
 *   $HUB_LOOPBACK  e.g. 1.1.0.2
 *   $VC_ID         e.g. 4500
 */
protocols {
    l2circuit {
        neighbor $HUB_LOOPBACK {
            interface $AC_INTF.$UNIT {
                virtual-circuit-id $VC_ID;
                control-word;
                flow-label-transmit;
                flow-label-receive;
                encapsulation-type ethernet-vlan;
                ignore-encapsulation-mismatch;
                ignore-mtu-mismatch;
                pseudowire-status-tlv {
                    hot-standby-vc-on;
                }
            }
        }
    }
}
```

## evo/protocols/l2circuit-lsw.conf

```
/*
 * Topic:   L2Circuit local-switching (port-to-port cross-connect on a single PE; MEF E-Access hand-off pattern) (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma3_acx7100-48l
 *
 * Highlights:
 *  - `l2circuit local-switching { interface AC1 { end-interface AC2 } }`
 *    cross-connects two ATTACHMENT-CIRCUIT units on the SAME PE —
 *    no PW signalling, no neighbor, no MPLS underlay involved. The
 *    PE simply forwards frames between the two ACs at the L2 layer.
 *  - Used in MEF E-Access scenarios where one customer-facing port
 *    hands off to an upstream partner-network port on the same PE
 *    (the PE acts as a stitching point inside the metro).
 *  - `ignore-mtu-mismatch` lets the two ACs run with different MTU
 *    configs without rejecting the cross-connect at commit.
 *  - Both AC units are VLAN-tagged CCC interfaces (encapsulation
 *    vlan-ccc; see evo/interfaces/edge-vlan-norm.conf for the AC
 *    shape).
 *  - Scale here is "one local-switching interface block per service"
 *    (e.g. et-0/0/5.3000 <-> et-0/0/51.4010 is one E-Access flow).
 *
 * Pair with:
 *  - evo/interfaces/ifl-vlan-ccc-vlan-map-list-tpid.conf
 *
 * JVD service mapping:
 *   10 instances total (high 10 / med 0 / low 0)
 *   On devices: ma3_acx7100-48l (10)
 *   Example: l2ckt-lsw-ma3_acx7100-48l-et-0/0/5.3000 (RD —, RT —)
 *     ma3_acx7100-48l  et-0/0/5.3000
 *
 * Variables (example values from ma3_acx7100-48l):
 *   $AC_INTF_1    e.g. et-0/0/5
 *   $UNIT_1       e.g. 3000
 *   $AC_INTF_2    e.g. et-0/0/51
 *   $UNIT_2       e.g. 4010
 */
protocols {
    l2circuit {
        local-switching {
            interface $AC_INTF_1.$UNIT_1 {
                end-interface {
                    interface $AC_INTF_2.$UNIT_2;
                }
                ignore-mtu-mismatch;
            }
        }
    }
}
```

## evo/protocols/mpls-segment-routing.conf

```
/*
 * Topic:   MPLS / segment-routing chassis-wide knobs (EVO)
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
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
 *  - evo/protocols/isis-srmpls-tilfa.conf
 *  - evo/groups/gr-core-intf.conf
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

## evo/protocols/oam-cfm-perf-mon.conf

```
/*
 * Topic:   Ethernet OAM CFM with hardware-assisted SLA performance monitoring
 * Seen on:
 *   Junos: an4_acx710 ma5_mx204
 *   EVO:   an3_acx7100-48l ma1-2_acx7024
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

## evo/routing-instances/apply-groups/gr-fatpw-label.conf

```
/*
 * Topic:   Apply GR-FATPW-LABEL at the routing-instances hierarchy level
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   ma1-1_acx7024 ma1-2_acx7024
 *
 * Highlights:
 *  - The application statement that makes apply-group GR-FATPW-LABEL take
 *    effect. A group definition is inert on its own; the behaviour arrives only
 *    when the group is applied, and the hierarchy level at which it is applied
 *    decides what it can match.
 *  - Applied at `routing-instances`, so the group's L2 wildcards
 *    (`<evpn_group_80_*>`, `<evpn_group_10_*>`, `<vpls_*>`, `<l2vpn_*>`,
 *    `<EVPN_VPWS_PORT_*>`, `<EVPN_ELAN_PORT_*>`, `L2VPN_PORT_BASED`) can match
 *    the service instances beneath it and inject the FAT-PW flow-label knobs.
 *  - GR-FATPW-LABEL never matches an L3VPN VRF: its wildcards and the
 *    `<METRO_*>` names GR-L3VPN matches are disjoint, and no instance carries
 *    both.
 *  - This is the bare single-group serialization. Three EVO devices apply this
 *    group inside a bracketed list together with GR-L3VPN — see
 *    evo/routing-instances/apply-groups/gr-l3vpn-fatpw-label.conf. mse1, mse2
 *    and ma1-2 additionally apply it at the top level, which is a different
 *    hierarchy point and a different statement.
 *
 * Pair with:
 *  - evo/groups/gr-fatpw-label.conf
 *
 * Variables: none
 */
routing-instances {
    apply-groups GR-FATPW-LABEL;
}
```

## evo/routing-instances/apply-groups/gr-l3vpn-fatpw-label.conf

```
/*
 * Topic:   Apply GR-L3VPN and GR-FATPW-LABEL as one bracketed list at routing-instances
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - The observed site serialization on the three EVO nodes that apply both
 *    groups at the `routing-instances` hierarchy level. Junos renders the two
 *    applications as a single bracketed statement; this snip reproduces that
 *    statement exactly.
 *  - The bracket is a serialization fact, NOT a coupling. GR-L3VPN matches
 *    `<METRO_*>` L3VPN VRFs; GR-FATPW-LABEL matches the EVPN, EVPN-VPWS,
 *    MAC-VRF, VPLS and L2VPN service names. The two name sets are disjoint, no
 *    instance is matched by both, and neither group references the other.
 *    Seven of the ten devices that apply either group apply only one of them.
 *  - Because the two applications are independent, a consuming construct
 *    depends on the group whose behaviour it actually receives — an L3VPN VRF
 *    on GR-L3VPN, an L2 service on GR-FATPW-LABEL — never on both because they
 *    happen to share this statement.
 *  - The bare single-group serializations are
 *    evo/routing-instances/apply-groups/gr-l3vpn.conf and
 *    evo/routing-instances/apply-groups/gr-fatpw-label.conf.
 *
 * Pair with:
 *  - evo/groups/gr-l3vpn.conf
 *  - evo/groups/gr-fatpw-label.conf
 *
 * Variables: none
 */
routing-instances {
    apply-groups [ GR-L3VPN GR-FATPW-LABEL ];
}
```

## evo/routing-instances/apply-groups/gr-l3vpn.conf

```
/*
 * Topic:   Apply GR-L3VPN at the routing-instances hierarchy level
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   ma3_acx7100-48l
 *
 * Highlights:
 *  - The application statement that makes apply-group GR-L3VPN take effect. A
 *    group definition is inert on its own; the behaviour arrives only when the
 *    group is applied, and the hierarchy level at which it is applied decides
 *    what it can match.
 *  - Applied at `routing-instances`, so GR-L3VPN's `<METRO_*>` wildcard can
 *    match the VRFs beneath it and inject `instance-type vrf`,
 *    `routing-options multipath vpn-unequal-cost`, `routing-options protect
 *    core` and `vrf-table-label`.
 *  - This is the bare single-group serialization. Three EVO devices apply the
 *    same group inside a bracketed list together with GR-FATPW-LABEL — see
 *    evo/routing-instances/apply-groups/gr-l3vpn-fatpw-label.conf. The list is
 *    a serialization choice at that hierarchy point; the two groups are
 *    independent and neither requires the other.
 *  - Every device that applies GR-L3VPN also defines it, and every device that
 *    defines it applies it.
 *
 * Pair with:
 *  - evo/groups/gr-l3vpn.conf
 *
 * Variables: none
 */
routing-instances {
    apply-groups GR-L3VPN;
}
```

## evo/routing-instances/evpn-elan/ri-evpn-elan-irb.conf

```
/*
 * Topic:   EVPN-ELAN with mac-vrf and IRB integration
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
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
 *  - evo/routing-instances/l3vpn/ri-l3vpn-irb.conf
 *  - evo/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy.conf
 *
 * JVD service mapping:
 *   50 instances total (high 50 / med 0 / low 0)
 *   On devices: an3_acx7100-48l (50), meg1_acx7100-32c (50), meg2_acx7509 (50), mse1_mx304 (50), mse2_mx304 (50)
 *   Example: evpn_group_60_4000 (RD 1.1.0.2:14000, RT target:61535:14000)
 *     an3_acx7100-48l  et-0/0/50.2000
 *     meg1_acx7100-32c  ae66.4000 00:10:11:11:50:12:01:00:00:00 A-A
 *     meg2_acx7509  ae66.4000 00:10:11:11:50:12:01:00:00:00 A-A
 *     mse1_mx304  xe-0/0/3:1.3000
 *     (+1 more endpoints)
 *
 * Variables (example values from an3_acx7100-48l):
 *   $INSTANCE_NAME   e.g. evpn_group_60_4000
 *   $BD_NAME         e.g. V4000
 *   $AC_INTF         e.g. et-0/0/50.2000
 *   $IRB_UNIT        e.g. irb.4000
 *   $VLAN_BD         e.g. 4000
 *   $LOOPBACK_V4     e.g. 1.1.0.2
 *   $RD_SUB_ASSIGNED e.g. 14000
 *   $RT_ID           e.g. 14000
 *   $RT_AS           e.g. 61535
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
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
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

## evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf

```
/*
 * Topic:   EVPN-ELAN via mac-vrf routing-instance (MEF E-LAN)
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `instance-type mac-vrf` holds one or more vlan-based bridge-domains, each
 *    MAC-learned per-EVI in EVPN.
 *  - service-type vlan-based — one VLAN per EVI (Type-1 service in
 *    RFC 7432 parlance).
 *  - encapsulation mpls — runs over SR-MPLS transport.
 *  - no-control-word avoids inserting a 4-byte CW (interop with
 *    legacy receivers; full ELAN service still works).
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *  - evo/interfaces/ifl-vlan-bridge-esi.conf
 *  - evo/policy-options/policy-statement/ps-export-l2-color.conf
 *
 * JVD service mapping:
 *   175 instances total (high 175 / med 0 / low 0)
 *   On devices: meg1_acx7100-32c (175), meg2_acx7509 (175), an3_acx7100-48l (150), an1_mx204 (100), an2_acx5448 (100), ma1-1_acx7024 (100), +3 more
 *   Example: evpn_group_60_4000 (RD 1.1.0.2:14000, RT target:61535:14000)
 *     an3_acx7100-48l  et-0/0/50.2000
 *     meg1_acx7100-32c  ae66.4000 00:10:11:11:50:12:01:00:00:00 A-A
 *     meg2_acx7509  ae66.4000 00:10:11:11:50:12:01:00:00:00 A-A
 *     mse1_mx304  xe-0/0/3:1.3000
 *     (+1 more endpoints)
 *
 * Variables (example values from ma1-1_acx7024):
 *   $INSTANCE_NAME   e.g. evpn_group_90_700
 *                    (the vrf-export policy is named after the instance)
 *   $BD_NAME         e.g. BD_evpn_group_90_700
 *   $AC_INTF         e.g. ae12.700
 *   $VLAN_BD         e.g. 700
 *   $LOOPBACK_V4     e.g. 1.1.0.17
 *   $RD_SUB_ASSIGNED e.g. 7000
 *   $RT_ID           e.g. 7000
 *   $RT_AS           e.g. 63535
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
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$RT_AS:$RT_ID;
        vlans {
            $BD_NAME {
                vlan-id $VLAN_BD;
                interface $AC_INTF;
            }
        }
    }
}
```

## evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle-export.conf

```
/*
 * Topic:   VLAN-bundle EVPN E-LAN — selected customer VLANs share one MAC-VRF
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - EVPN E-LAN where selected customer VLANs share one MAC-VRF /
 *    bridge table.
 *  - The AC is VLAN-scoped using `vlan-bridge` with `vlan-id` (one VLAN)
 *    or `vlan-id-list` (several VLANs) on a `flexible-vlan-tagging` UNI.
 *  - `service-type vlan-bundle` describes the shared EVI/bridge-table
 *    model; the AC configuration — not the service-type — determines
 *    whether the service is whole-port or VLAN-scoped.
 *  - `protocols evpn { encapsulation mpls; }` plus a `vrf-export` policy are
 *    the discriminators against the port-based form in
 *    evo/routing-instances/evpn-elan/ri-evpn-port-based.conf, which carries a bare
 *    `evpn;` leaf and route-target membership only.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *  - evo/policy-options/policy-statement/ps-export-l2-color.conf
 *
 * JVD service mapping:
 *   VLAN-scoped bundle EVIs (vlan-bridge, vlan-id / vlan-id-list) across the EVO metro edge.
 *   On devices: an3_acx7100-48l, meg1_acx7100-32c, meg2_acx7509
 *   Example: evpn_group_80_1000 (RD 1.1.0.2:8000, RT target:63535:8000)
 *     an3_acx7100-48l  et-0/0/50.1000  (vlan-bridge, vlan-id-list 1000-1001)
 *     an3_acx7100-48l  et-0/0/50.1399  (vlan-bridge, vlan-id 1399) *
 * Variables (example values from an3_acx7100-48l / evpn_group_80_1000):
 *   $INSTANCE_NAME    e.g. evpn_group_80_1000
 *   $BD_NAME          e.g. BD_evpn_group_80_1000
 *   $AC_INTF          e.g. et-0/0/50.1000   (VLAN-scoped: vlan-id or vlan-id-list on the unit)
 *   $LOOPBACK_V4      e.g. 1.1.0.2
 *   $RD_SUB_ASSIGNED  e.g. 8000
 *   $RT_AS            e.g. 63535
 *   $RT_ID            e.g. 8000
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type mac-vrf;
        protocols {
            evpn {
                encapsulation mpls;
            }
        }
        service-type vlan-bundle;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$RT_AS:$RT_ID;
        vlans {
            $BD_NAME {
                interface $AC_INTF;
            }
        }
    }
}
```

## evo/routing-instances/evpn-elan/ri-evpn-port-based.conf

```
/*
 * Topic:   Port-based EVPN E-LAN — whole-UNI attachment circuit (mac-vrf + service-type vlan-bundle, EVO ACX)
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l ma1-2_acx7024
 *
 * Highlights:
 *  - EVPN E-LAN where the entire UNI is the attachment circuit — all
 *    customer frames on the port ride one MAC-VRF bridge table.
 *  - The UNI uses `encapsulation ethernet-bridge` with `unit 0`, so the
 *    whole port (not a selected VLAN) is bound into the
 *    `service-type vlan-bundle` EVI.
 *  - `instance-type mac-vrf` + `service-type vlan-bundle`; the BD binds
 *    the whole-UNI logical unit (`interface $AC_INTF`, unit 0).
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * JVD service mapping:
 *   Whole-UNI (ethernet-bridge, unit 0) form — the EVPN_ELAN_PORT_BASED service.
 *   On devices: an3_acx7100-48l, ma1-2_acx7024
 *   Example: EVPN_ELAN_PORT_BASED (RD 1.1.0.2:5565, RT target:63535:6565)
 *     an3_acx7100-48l  et-0/0/11.0   (et-0/0/11 encapsulation ethernet-bridge)
 *     ma1-2_acx7024    et-0/0/8.0    (et-0/0/8 encapsulation ethernet-bridge)
 *
 * Variables (example values from an3_acx7100-48l / EVPN_ELAN_PORT_BASED):
 *   $INSTANCE_NAME    e.g. EVPN_ELAN_PORT_BASED
 *   $BD_NAME          e.g. v-2
 *   $AC_INTF          e.g. et-0/0/11.0   (whole-UNI unit 0)
 *   $LOOPBACK_V4      e.g. 1.1.0.2
 *   $RD_SUB_ASSIGNED  e.g. 5565
 *   $RT_AS            e.g. 63535
 *   $RT_ID            e.g. 6565
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type mac-vrf;
        protocols {
            evpn;
        }
        service-type vlan-bundle;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
        vlans {
            $BD_NAME {
                interface $AC_INTF;
            }
        }
    }
}
```

## evo/routing-instances/evpn-vpws/ri-evpn-fxc-3-uni-export.conf

```
/*
 * Topic:   EVPN FXC (Flexible Cross-Connect, VLAN-unaware) — three AC UNIs in one service-id, with vrf-export
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - EVPN-VPWS Flexible Cross-Connect on the ACX/EVO PE: `evpn-vpws` +
 *    FXC group {} + service-id pair. No Junos device runs this arity, so this
 *    form has no cross-OS counterpart.
 *  - Exactly three UNIs, all on the same physical UNI. The four-UNI forms are
 *    evo/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni-export.conf and
 *    evo/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni.conf; UNI count is part of
 *    the instance body, so each arity is its own form.
 *  - `vrf-export` binds the per-service export policy on top of the direct
 *    route target; the target-only arity-4 sibling omits it.
 *  - service-id local/remote integers are swapped relative to the
 *    Junos PE (the pair forms one bidirectional EVPN-VPWS PW).
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *  - evo/groups/gr-edge-intf.conf
 *  - evo/policy-options/policy-statement/ps-export-l2-color.conf
 *
 * JVD service mapping:
 *   23 instances on an3_acx7100-48l.
 *   Example: evpn_group_40_1 (RD 1.1.0.2:401, RT target:63535:401)
 *     an3_acx7100-48l  et-0/0/0.800 / .1800 / .2300
 *
 * Variables (example values from an3_acx7100-48l / evpn_group_40_1):
 *   $INSTANCE_NAME    e.g. evpn_group_40_1
 *   $AC_INTF          e.g. et-0/0/0
 *   $UNIT_A           e.g. 800
 *   $UNIT_B           e.g. 1800
 *   $UNIT_C           e.g. 2300
 *   $SVC_ID_LOCAL     e.g. 1
 *   $SVC_ID_REMOTE    e.g. 2
 *   $LOOPBACK_V4      e.g. 1.1.0.2
 *   $RD_SUB_ASSIGNED  e.g. 401
 *   $RT_AS            e.g. 63535
 *   $RT_ID            e.g. 401
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                flexible-cross-connect-vlan-unaware;
                group fxc {
                    interface $AC_INTF.$UNIT_A;
                    interface $AC_INTF.$UNIT_B;
                    interface $AC_INTF.$UNIT_C;
                    service-id {
                        local $SVC_ID_LOCAL;
                        remote $SVC_ID_REMOTE;
                    }
                }
            }
        }
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## evo/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni-export.conf

```
/*
 * Topic:   EVPN FXC (Flexible Cross-Connect, VLAN-unaware) — four AC UNIs in one service-id, with vrf-export
 * Seen on:
 *   Junos: mse1_mx304
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - Identical body to junos/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni-export.conf;
 *    the EVO side rides under the same `evpn-vpws` + FXC group {} +
 *    service-id pair, just on the ACX/EVO PE.
 *  - Four UNIs, all on the same physical UNI. This is the dominant FXC arity
 *    in the JVD. The three-UNI form is
 *    evo/routing-instances/evpn-vpws/ri-evpn-fxc-3-uni-export.conf; UNI count is
 *    part of the instance body, so each arity is its own form.
 *  - `vrf-export` binds the per-service export policy on top of the direct
 *    route target. The otherwise identical target-only form is
 *    evo/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni.conf.
 *  - service-id local/remote integers are swapped relative to the Junos PE
 *    (the pair forms one bidirectional EVPN-VPWS PW).
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *  - evo/groups/gr-edge-intf.conf
 *  - evo/policy-options/policy-statement/ps-export-l2-color.conf
 *
 * JVD service mapping:
 *   219 instances on an3_acx7100-48l, 240 on mse1_mx304.
 *   Example: evpn_group_40_100 (RD 1.1.0.2:500, RT target:63535:500)
 *     an3_acx7100-48l  et-0/0/0.1899 / .2399 / .998 / .999
 *
 * Variables (example values from an3_acx7100-48l / evpn_group_40_100):
 *   $INSTANCE_NAME    e.g. evpn_group_40_100
 *   $AC_INTF          e.g. et-0/0/0
 *   $UNIT_A           e.g. 1899
 *   $UNIT_B           e.g. 2399
 *   $UNIT_C           e.g. 998
 *   $UNIT_D           e.g. 999
 *   $SVC_ID_LOCAL     e.g. 1
 *   $SVC_ID_REMOTE    e.g. 2
 *   $LOOPBACK_V4      e.g. 1.1.0.2
 *   $RD_SUB_ASSIGNED  e.g. 500
 *   $RT_AS            e.g. 63535
 *   $RT_ID            e.g. 500
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                flexible-cross-connect-vlan-unaware;
                group fxc {
                    interface $AC_INTF.$UNIT_A;
                    interface $AC_INTF.$UNIT_B;
                    interface $AC_INTF.$UNIT_C;
                    interface $AC_INTF.$UNIT_D;
                    service-id {
                        local $SVC_ID_LOCAL;
                        remote $SVC_ID_REMOTE;
                    }
                }
            }
        }
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## evo/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni.conf

```
/*
 * Topic:   EVPN FXC (Flexible Cross-Connect, VLAN-unaware) — four AC UNIs in one service-id, route target only
 * Seen on:
 *   Junos: mse1_mx304
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - Identical body to junos/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni.conf;
 *    the EVO side rides under the same `evpn-vpws` + FXC group {} +
 *    service-id pair, just on the ACX/EVO PE.
 *  - Route control is DIRECT route-target membership only — there is no
 *    `vrf-export`, so the service carries no per-service export policy and no
 *    transport-colour community. Under the library's route-control grammar
 *    the target-only form takes no suffix; the policy-bearing sibling is
 *    evo/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni-export.conf.
 *  - Four UNIs, all on the same physical UNI. UNI count is part of the
 *    instance body, so each arity is its own form.
 *  - service-id local/remote integers are swapped relative to the Junos PE
 *    (the pair forms one bidirectional EVPN-VPWS PW).
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *  - evo/groups/gr-edge-intf.conf
 *
 * JVD service mapping:
 *   250 instances on an3_acx7100-48l, 250 on mse1_mx304.
 *   Example: evpn_group_40_251 (RD 1.1.0.2:651, RT target:63535:651)
 *     an3_acx7100-48l  et-0/0/0.2050 / .2550 / .1300 / .1301
 *
 * Variables (example values from an3_acx7100-48l / evpn_group_40_251):
 *   $INSTANCE_NAME    e.g. evpn_group_40_251
 *   $AC_INTF          e.g. et-0/0/0
 *   $UNIT_A           e.g. 2050
 *   $UNIT_B           e.g. 2550
 *   $UNIT_C           e.g. 1300
 *   $UNIT_D           e.g. 1301
 *   $SVC_ID_LOCAL     e.g. 1
 *   $SVC_ID_REMOTE    e.g. 2
 *   $LOOPBACK_V4      e.g. 1.1.0.2
 *   $RD_SUB_ASSIGNED  e.g. 651
 *   $RT_AS            e.g. 63535
 *   $RT_ID            e.g. 651
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                flexible-cross-connect-vlan-unaware;
                group fxc {
                    interface $AC_INTF.$UNIT_A;
                    interface $AC_INTF.$UNIT_B;
                    interface $AC_INTF.$UNIT_C;
                    interface $AC_INTF.$UNIT_D;
                    service-id {
                        local $SVC_ID_LOCAL;
                        remote $SVC_ID_REMOTE;
                    }
                }
            }
        }
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## evo/routing-instances/evpn-vpws/ri-evpn-vpws-export.conf

```
/*
 * Topic:   EVPN-VPWS routing-instance with a per-instance vrf-export policy
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `instance-type evpn-vpws` with a single attachment circuit carrying a
 *    `vpws-service-id` local/remote pair — the EVPN-VPWS service identifier
 *    exchanged through EVPN Type-1 routes.
 *  - `vrf-export $INSTANCE_NAME` names a policy-statement that carries the
 *    same name as the instance, so the instance exports through an explicit
 *    per-service policy in addition to `vrf-target`.
 *  - `$AC_INTF` binds the whole logical interface here (for example
 *    `et-0/0/50.3000`), matching the sibling form that omits the export
 *    policy.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *  - evo/policy-options/policy-statement/ps-export-l2-color.conf
 *
 * Variables (example values from an3_acx7100-48l / evpn_group_10_3000):
 *   $INSTANCE_NAME        e.g. evpn_group_10_3000
 *   $AC_INTF              e.g. et-0/0/50.3000
 *   $LOOPBACK_V4          e.g. 1.1.0.2
 *   $RD_SUB_ASSIGNED      e.g. 3000
 *   $RT_AS                e.g. 63535
 *   $RT_ID                e.g. 3000
 *   $VPWS_SVC_ID_LOCAL    e.g. 1
 *   $VPWS_SVC_ID_REMOTE   e.g. 2
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
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf

```
/*
 * Topic:   EVPN-VPWS routing-instance (MEF E-Line)
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Same syntax as junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf — instance-type
 *    evpn-vpws + per-AC vpws-service-id local/remote pair. EVO and
 *    Junos use byte-identical config for EVPN-VPWS.
 *  - This snippet shows the ma1-1 _multi-homed_ end of the same E-Line
 *    that an1_mx204 carries on the Junos side: AC = ae12.2400, carrying an
 *    ESI for all-active multihoming.
 *  - vrf-target is the per-instance route-target — together with the
 *    matching service-id pair on the remote PE this stitches the
 *    pseudowire end-to-end via EVPN Type-1 routes.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * JVD service mapping:
 *   1661 instances total (high 1661 / med 0 / low 0)
 *   On devices: an3_acx7100-48l (1601), meg1_acx7100-32c (1050), meg2_acx7509 (1050), ma1-1_acx7024 (451), ma1-2_acx7024 (450), an1_mx204 (400), +3 more
 *   Example: EVPN_VPWS_PORT_BASED (RD 1.1.0.2:5500, RT target:63535:5500)
 *     an3_acx7100-48l  et-0/0/7.0
 *     ma1-1_acx7024  et-0/0/6.0
 *
 * Variables (example values from ma1-1_acx7024):
 *   $INSTANCE_NAME       e.g. evpn_group_30_2400
 *   $AC_INTF             e.g. ae12.2400
 *   $LOOPBACK_V4         e.g. 1.1.0.17
 *   $RD_SUB_ASSIGNED     e.g. 2400
 *   $RT_ID               e.g. 2400
 *   $RT_AS               e.g. 63535
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
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## evo/routing-instances/l2vpn/ri-l2vpn-kompella.conf

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
 *  - evo/groups/gr-fatpw-label.conf (matches L2VPN_PORT_BASED)
 *
 * JVD service mapping:
 *   201 instances total (high 102 / med 99 / low 0)
 *   On devices: an3_acx7100-48l (201), ma5_mx204 (201)
 *   Example: L2VPN_PORT_BASED (RD 63535:6500, RT target:63535:6500)
 *     an3_acx7100-48l  et-0/0/8.0
 *     ma5_mx204  xe-0/1/2.0
 *
 * Variables (example values from an3_acx7100-48l):
 *   $INSTANCE_NAME           e.g. L2VPN_PORT_BASED
 *   $L2VPN_SITE              e.g. r2
 *   $L2VPN_LOCAL_SITE_ID     e.g. 1102
 *   $L2VPN_REMOTE_SITE_ID    e.g. 1119
 *   $AC_INTF                 e.g. et-0/0/8.0
 *   $RD                      e.g. 63535:6500
 *   $RT                      e.g. 63535:6500
 */
routing-instances {
    $INSTANCE_NAME {
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

## evo/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy.conf

```
/*
 * Topic:   L3VPN VRF with PE-CE eBGP and as-override
 * Seen on:
 *   Junos: ma4_mx204
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - `instance-type vrf` with `protocols bgp group v4Ixia` carrying
 *    `peer-as <CUST_ASN>` and `as-override` as the PE-CE protocol.
 *  - `routing-options router-id;` is the only routing-options child; the
 *    per-VRF RT-import policies do the route control on these EVO ACX PEs.
 *  - The per-VRF policy names differ across the devices this form covers: ma3
 *    and ma4 bind `${INSTANCE_NAME}-IMPORT` / `-EXPORT` while an3 binds the
 *    `PS-`-prefixed spelling, so the binding is parameterized as $IMPORT_POL /
 *    $EXPORT_POL. The policies themselves are in
 *    evo/policy-options/policy-statement/l3vpn-export-import.conf.
 *
 * Pair with:
 *  - evo/policy-options/policy-statement/l3vpn-export-import.conf
 *  - variant:mebs-bgp-overlay families=inet-vpn
 *  - evo/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf
 *
 * JVD service mapping:
 *   200 instances total (high 200 / med 0 / low 0)
 *   On devices: an3_acx7100-48l (200), ma3_acx7100-48l (200), mse1_mx304 (200), mse2_mx304 (200)
 *   Example: METRO_BGPv4_L3VPN_2101 (RD 63535:2101, RT —)
 *     an3_acx7100-48l  et-0/0/4.2101
 *     ma3_acx7100-48l  et-0/0/5.2101
 *     mse1_mx304  et-0/0/5.2101
 *     mse2_mx304  xe-0/0/15:0.2101
 *
 * Variables (example values from ma3_acx7100-48l / METRO_BGPv4_L3VPN_2101):
 *   $INSTANCE_NAME    e.g. METRO_BGPv4_L3VPN_2101
 *   $ROUTER_ID        e.g. 1.1.0.15
 *   $AC_INTF          e.g. et-0/0/5.2101
 *   $CE_PEER_V4       e.g. 115.2.0.2
 *   $PE_LOCAL_V4      e.g. 115.2.0.1
 *   $AS_CUST          e.g. 64514
 *   $RD               e.g. 63536:2101
 *   $IMPORT_POL       e.g. METRO_BGPv4_L3VPN_2101-IMPORT
 *                     (PS-METRO_BGPv4_L3VPN_2101-IMPORT on an3_acx7100-48l)
 *   $EXPORT_POL       e.g. METRO_BGPv4_L3VPN_2101-EXPORT
 *                     (PS-METRO_BGPv4_L3VPN_2101-EXPORT on an3_acx7100-48l)
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
        vrf-import $IMPORT_POL;
        vrf-export $EXPORT_POL;
        vrf-table-label;
    }
}
```

## evo/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy-rt.conf

```
/*
 * Topic:   L3VPN VRF with EVPN Type-5, policy-controlled RT plus a direct vrf-target
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - The metro-edge gateway variant of the EVPN-IRB L3VPN service. Body is
 *    identical to evo/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy.conf
 *    except for one added statement: `vrf-target target:$RT_AS:$RT_ID;`.
 *  - That is the `-rt` element of the name: route control is BOTH the
 *    import/export policy pair AND a direct route target. The two metro-edge
 *    gateways need the direct RT because they also exchange these routes
 *    outside the policy-tagged path; the access and service-edge nodes
 *    (an3, mse1) carry policy only.
 *  - `advertise direct-nexthop encapsulation mpls` — emit Type-5 routes with
 *    the local PE as direct next-hop, MPLS-encapsulated over the SR-MPLS
 *    underlay.
 *  - vrf-table-label — per-VRF aggregate label so the egress PE can do an L3
 *    lookup on the inner header (standard IRB pattern).
 *  - The instance name is the identity stem for the whole service: instance
 *    METRO_L3VPN_4000 binds PS-METRO_L3VPN_4000-IMPORT and
 *    PS-METRO_L3VPN_4000-EXPORT, which match and stamp community
 *    METRO_L3VPN_4000.
 *  - `multipath { vpn-unequal-cost; }`, `protect core` and `vrf-table-label`
 *    are also injected into every `<METRO_*>` VRF by apply-group GR-L3VPN.
 *
 * Pair with:
 *  - evo/routing-instances/evpn-elan/ri-evpn-elan-irb.conf
 *  - evo/groups/gr-l3vpn.conf
 *  - evo/policy-options/policy-statement/ps-import-l3vpn.conf
 *  - evo/policy-options/policy-statement/ps-export-l3vpn-public.conf
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from meg1_acx7100-32c / METRO_L3VPN_4000):
 *   $INSTANCE_NAME    e.g. METRO_L3VPN_4000
 *                     (the import/export policies are named
 *                      PS-${INSTANCE_NAME}-IMPORT / -EXPORT)
 *   $ROUTER_ID        e.g. 1.1.0.6
 *   $IRB_UNIT         e.g. 4000   (selects irb.<unit>)
 *   $RD               e.g. 61000:13000
 *   $RT_AS            e.g. 61535
 *   $RT_ID            e.g. 13000
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
        interface irb.$IRB_UNIT;
        route-distinguisher $RD;
        vrf-import PS-${INSTANCE_NAME}-IMPORT;
        vrf-export PS-${INSTANCE_NAME}-EXPORT;
        vrf-target target:$RT_AS:$RT_ID;
        vrf-table-label;
    }
}
```

## evo/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy.conf

```
/*
 * Topic:   L3VPN VRF with EVPN Type-5 (IP-prefix routes), policy-controlled RT
 * Seen on:
 *   Junos: mse1_mx304
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - This snip is the L3 (RT-5) HALF of the JVD's EVPN-IRB pattern.
 *    In this JVD, Type-5 is ALWAYS paired with a matching EVPN-ELAN
 *    MAC-VRF (`ri-evpn-elan-irb.conf`) on the same `irb.<N>`,
 *    so the EVI advertises both RT-2 (MAC+IP from learned hosts via
 *    the MAC-VRF) and RT-5 (the IRB subnet, silent-host /32s, and
 *    any VRF static/learned prefixes via this VRF). "Pure" RT-5
 *    (VRF only, no MAC-VRF) is not deployed here.
 *  - The VRF's `interface irb.<N>` ties this VRF to the matching
 *    EVPN-ELAN MAC-VRF (`evo/routing-instances/evpn-elan/ri-evpn-elan-irb.conf`)
 *    whose `l3-interface` is the same `irb.<N>`.
 *  - `advertise direct-nexthop encapsulation mpls` — emit Type-5
 *    routes with the local PE as direct next-hop, MPLS-encapsulated
 *    over the SR-MPLS underlay.
 *  - vrf-table-label — per-VRF aggregate label so the egress PE
 *    can do an L3 lookup on the inner header.
 *  - vrf-import / vrf-export point at the per-VRF policies
 *    PS-${INSTANCE_NAME}-IMPORT / -EXPORT. Route control is by POLICY
 *    only — there is no `vrf-target`, which is what the `vrf-policy`
 *    element of the name records. meg1 and meg2 run the sibling form
 *    that adds a direct RT
 *    (evo/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy-rt.conf);
 *    mse2 runs the form that also points its default into the Internet
 *    VRF
 *    (junos/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy-next-table.conf).
 *  - The instance name is the identity stem for the whole service:
 *    instance METRO_L3VPN_4000 binds PS-METRO_L3VPN_4000-IMPORT and
 *    PS-METRO_L3VPN_4000-EXPORT, which match and stamp community
 *    METRO_L3VPN_4000.
 *  - `multipath { vpn-unequal-cost; }`, `protect core` and
 *    `vrf-table-label` are also injected into every `<METRO_*>` VRF by
 *    apply-group GR-L3VPN, which both devices apply at the
 *    routing-instances hierarchy level.
 *
 * Pair with:
 *  - evo/routing-instances/evpn-elan/ri-evpn-elan-irb.conf
 *  - evo/groups/gr-l3vpn.conf
 *  - evo/policy-options/policy-statement/ps-import-l3vpn.conf
 *  - evo/policy-options/policy-statement/ps-export-l3vpn-public.conf
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * JVD service mapping:
 *   50 instances total (high 50 / med 0 / low 0)
 *   On devices: an3_acx7100-48l (50), meg1_acx7100-32c (50), meg2_acx7509 (50), mse1_mx304 (50), mse2_mx304 (50)
 *   Example: METRO_L3VPN_4000 (RD 63000:13000, RT target:61535:13000)
 *     an3_acx7100-48l
 *     meg1_acx7100-32c
 *     meg2_acx7509
 *     mse1_mx304
 *     (+1 more endpoints)
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
        vrf-import PS-${INSTANCE_NAME}-IMPORT;
        vrf-export PS-${INSTANCE_NAME}-EXPORT;
        vrf-table-label;
    }
}
```

## evo/routing-instances/l3vpn/ri-l3vpn-irb.conf

```
/*
 * Topic:   L3VPN with IRB
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - The L3 half of the EVPN-IRB pair: the VRF terminates the IRB and performs
 *    egress L3 lookups for MAC-routed traffic, while the paired EVPN instance
 *    advertises the host /32s and the IRB subnet as RT-2 MAC+IP routes.
 *  - `vrf-target` applies the route target directly, so no import or export
 *    policy is involved.
 *  - `vrf-table-label` is the only other VPN plumbing; routing-options carries
 *    just `router-id`.
 *
 * Pair with:
 *  - evo/routing-instances/evpn-elan/ri-evpn-elan-irb.conf
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * JVD service mapping:
 *   75 instances total (high 75 / med 0 / low 0)
 *   On devices: an3_acx7100-48l (75), meg1_acx7100-32c (75), meg2_acx7509 (75), mse1_mx304 (75), mse2_mx304 (75)
 *   Example: METRO_L3VPN_4000 (RD 63000:13000, RT target:61535:13000)
 *     an3_acx7100-48l
 *     meg1_acx7100-32c
 *     meg2_acx7509
 *     mse1_mx304
 *     (+1 more endpoints)
 *
 * Variables (example values from an3_acx7100-48l / METRO_L3VPN_4050):
 *   $INSTANCE_NAME    e.g. METRO_L3VPN_4050
 *   $ROUTER_ID        e.g. 1.1.0.2
 *   $IRB_UNIT         e.g. 4050   (selects irb.<unit>)
 *   $RD               e.g. 64400:15000
 *   $RT_AS            e.g. 51535
 *   $RT_ID            e.g. 15000
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            router-id $ROUTER_ID;
        }
        interface irb.$IRB_UNIT;
        route-distinguisher $RD;
        vrf-target target:$RT_AS:$RT_ID;
        vrf-table-label;
    }
}
```

## evo/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf

```
/*
 * Topic:   L3VPN VRF with PE-CE OSPF
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - `instance-type vrf` with `protocols ospf area 0.0.0.0 interface <AC>
 *    { interface-type p2p; }` as the PE-CE protocol.
 *  - `routing-options router-id; auto-export;` — auto-export leaks routes
 *    between the VRFs that share a route target on the device.
 *  - `vrf-import / vrf-export` point at the per-VRF policies in
 *    evo/policy-options/policy-statement/l3vpn-export-import.conf. The EVO ANs
 *    use a `PS-` prefix on the policy names (e.g. `PS-METRO_L3VPN_2001-IMPORT`),
 *    which is the per-service namespace convention on the AN/MEG roles.
 *
 * Pair with:
 *  - evo/policy-options/policy-statement/l3vpn-export-import.conf
 *  - variant:mebs-bgp-overlay families=inet-vpn
 *  - evo/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy.conf
 *
 * JVD service mapping:
 *   100 instances total (high 100 / med 0 / low 0)
 *   On devices: an3_acx7100-48l (100), ma3_acx7100-48l (100), mse1_mx304 (100), mse2_mx304 (100)
 *   Example: METRO_L3VPN_2001 (RD 63535:2001, RT —)
 *     an3_acx7100-48l  et-0/0/4.2001
 *     ma3_acx7100-48l  et-0/0/5.2001
 *     mse1_mx304  et-0/0/5.2001
 *     mse2_mx304  xe-0/0/15:0.2001
 *
 * Variables (example values from an3_acx7100-48l / METRO_L3VPN_2001):
 *   $INSTANCE_NAME    e.g. METRO_L3VPN_2001
 *   $ROUTER_ID        e.g. 1.1.0.2
 *   $AC_INTF          e.g. et-0/0/4.2001
 *   $RD               e.g. 63535:2001
 *   $IMPORT_POL       e.g. PS-METRO_L3VPN_2001-IMPORT
 *   $EXPORT_POL       e.g. PS-METRO_L3VPN_2001-EXPORT
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            router-id $ROUTER_ID;
            auto-export;
        }
        protocols {
            ospf {
                area 0.0.0.0 {
                    interface $AC_INTF {
                        interface-type p2p;
                    }
                }
            }
        }
        interface $AC_INTF;
        route-distinguisher $RD;
        vrf-import $IMPORT_POL;
        vrf-export $EXPORT_POL;
        vrf-table-label;
    }
}
```

## evo/routing-instances/l3vpn/ri-l3vpn-unequal-cost.conf

```
/*
 * Topic:   L3VPN VRF on a routed AC sub-interface with explicit vpn-unequal-cost multipath
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - An L3VPN VRF attached through a routed attachment-circuit sub-interface
 *    (`et-0/0/50.<unit>`, unit == the instance's numeric suffix) rather than
 *    through an IRB. There is no `protocols evpn` block: this VRF is not an
 *    EVPN Type-5 gateway.
 *  - Route control is DIRECT route-target membership — `vrf-target` only, no
 *    `vrf-import` and no `vrf-export`. That is the ordinary form, so the name
 *    carries no route-control suffix, and the snip has no policy dependency.
 *  - `multipath { vpn-unequal-cost; }` is stated explicitly in the instance
 *    body. Other `<METRO_*>` VRFs inherit the same knob from apply-group
 *    GR-L3VPN; here it is configured inline, which is what makes this a
 *    distinct literal form even though the resulting behaviour matches.
 *  - vrf-table-label — per-VRF aggregate label for egress L3 lookup.
 *  - Covers the METRO_L3VPN_4050–4074 range on an3. The METRO_L3VPN_4000–4049
 *    range on the same device is the EVPN Type-5 form
 *    (evo/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy.conf).
 *
 * Pair with:
 *  - evo/groups/gr-l3vpn.conf
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from an3_acx7100-48l / METRO_L3VPN_4050):
 *   $INSTANCE_NAME    e.g. METRO_L3VPN_4050
 *   $ROUTER_ID        e.g. 1.1.0.2
 *   $AC_INTF          e.g. et-0/0/50.4050  (routed AC sub-interface)
 *   $RD               e.g. 64000:15000
 *   $RT_AS            e.g. 51535
 *   $RT_ID            e.g. 15000
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            router-id $ROUTER_ID;
            multipath {
                vpn-unequal-cost;
            }
        }
        interface $AC_INTF;
        route-distinguisher $RD;
        vrf-target target:$RT_AS:$RT_ID;
        vrf-table-label;
    }
}
```

## evo/routing-instances/vpls/ri-bgp-vpls-export.conf

```
/*
 * Topic:   BGP-VPLS (RFC 4761 Kompella-signaled VPLS) on EVO ACX
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `instance-type virtual-switch` + `protocols vpls site <r-name>
 *    { site-identifier <N>; }` is the Kompella-VPLS signature
 *    (site identifiers are how PEs compute the VPLS full-mesh).
 *  - `service-type single` — single broadcast domain (one VLAN);
 *    `site-range 10; label-block-size 8;` reserve a contiguous
 *    label block for the site so all 8 remote sites share one
 *    per-site PW set.
 *  - `vlans { <BD_NAME> { interface <AC>; } }` is the EVO/ACX
 *    bridge-domain shape (no per-BD `vlan-id` because the
 *    parent interface unit carries the customer VLAN; the BD
 *    inherits it via `flexible-vlan-tagging`).
 *  - `no-tunnel-services` keeps the VPLS encapsulation/
 *    de-encapsulation in software/silicon directly (no
 *    tunnel-services PIC required).
 *  - `vrf-export $INSTANCE_NAME; vrf-target target:$RT_AS:$RT_ID;`
 *    — the export policy is the per-service colour policy in
 *    evo/policy-options/policy-statement/ps-export-l2-color.conf, which adds
 *    the per-EVI export community.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=l2vpn
 *  - evo/groups/gr-edge-intf.conf
 *  - evo/policy-options/policy-statement/ps-export-l2-color.conf
 *
 * JVD service mapping:
 *   400 instances total (high 400 / med 0 / low 0)
 *   On devices: an3_acx7100-48l (300), ma5_mx204 (300), ma1-2_acx7024 (200), meg1_acx7100-32c (200), meg2_acx7509 (99)
 *   Example: vpls_group_102_400 (RD 63535:1093000, RT target:63535:1093000)
 *     an3_acx7100-48l  et-0/0/0.400
 *     ma5_mx204  xe-0/1/4.400
 *     meg1_acx7100-32c  et-0/0/26:0.400
 *
 * Variables (example values from ma1-2_acx7024 / vpls_group_103_600):
 *   $INSTANCE_NAME    e.g. vpls_group_103_600
 *   $L2VPN_SITE       e.g. r18
 *   $SITE_ID          e.g. 5
 *   $RD               e.g. 63535:2193200
 *   $RT_AS            e.g. 63535
 *   $RT_ID            e.g. 1093200
 *   $BD_NAME          e.g. vlan600
 *   $AC_INTF          e.g. et-0/0/14.600
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-switch;
        protocols {
            vpls {
                site $L2VPN_SITE {
                    site-identifier $SITE_ID;
                }
                service-type single;
                site-range 10;
                label-block-size 8;
                no-tunnel-services;
            }
        }
        route-distinguisher $RD;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$RT_AS:$RT_ID;
        vlans {
            $BD_NAME {
                interface $AC_INTF;
            }
        }
    }
}
```

## evo/routing-instances/vpls/ri-ldp-vpls.conf

```
/*
 * Topic:   LDP-VPLS (virtual-switch with vpls-id)
 * Seen on:
 *   Junos: (none)
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
 *
 * Pair with:
 *
 * JVD service mapping:
 *   2 instances total (high 1 / med 1 / low 0)
 *   On devices: an3_acx7100-48l (2)
 *   Example: KB-VPLS-EPL (RD —, RT —)
 *     an3_acx7100-48l  et-0/0/53.0
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

## evo/routing-options/flex-algorithm.conf

```
/*
 * Topic:   Flex-Algo definitions — FA 128 (delay-optimised) and FA 129 (TE-metric), each bound to a transport class by colour.
 * Seen on:
 *   Junos: mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - FA 128: delay-metric SPF, includes admin-group `green`, colour 4000.
 *  - FA 129: te-metric SPF, includes admin-group `blue`, colour 6000.
 *  - This is the Flex-Algo DEFINITION carried by the FAD-advertiser nodes
 *    (metro-core); other transport nodes carry only the slim reference
 *    (`colour` + `use-transport-class`) without the definition.
 *  - `use-flex-algorithm-prefix-metric` + `use-transport-class` install the
 *    FA-derived path so a service's colour community resolves over it.
 *  - The `green`/`blue` admin-groups are defined in transport/mpls-segment-
 *    routing.conf; ISIS advertises participation in protocols/isis-srmpls-tilfa.conf.
 *
 * Pair with:
 *  - evo/routing-options/transport-class.conf    (maps colour 4000/6000 to gold/bronze)
 *  - evo/protocols/mpls-segment-routing.conf (defines admin-groups green/blue)
 *  - evo/protocols/isis-srmpls-tilfa.conf  (ISIS carries flex-algorithm [128 129])
 *
 * Variables: none. FA numbers, metric types, admin-group colours, and the
 *            colour values are the JVD-wide abstraction and are left literal.
 */
routing-options {
    flex-algorithm 128 {
        definition {
            metric-type delay-metric;
            spf;
            use-flex-algorithm-prefix-metric;
            priority 0;
            admin-group include-any green;
        }
        color 4000;
        use-transport-class;
    }
    flex-algorithm 129 {
        definition {
            metric-type te-metric;
            spf;
            use-flex-algorithm-prefix-metric;
            priority 0;
            admin-group include-any blue;
        }
        color 6000;
        use-transport-class;
    }
}
```

## evo/routing-options/forwarding-table.conf

```
/*
 * Topic:   Forwarding-table export — per-packet load-balance applied to the forwarding table (minimal EVO form).
 * Seen on:
 *   Junos: ma2_mx204 mdr2_mx10003
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c cr1_ptx10001-36mr cr2_ptx10001-36mr ma3_acx7100-48l mdr1_acx7509
 *
 * Highlights:
 *  - This is the minimal EVO form (`export $PPLB_NAME` only). The forwarding-
 *    table stanza is strongly role-dependent: other EVO nodes add a
 *    `chained-composite-next-hop ingress { l2vpn l2ckt evpn l3vpn }` block
 *    (see the Junos PE variant), and an3/meg1 carry that block too. A full
 *    role-variant model is a post-extraction follow-up.
 *  - `export $PPLB_NAME` applies the per-packet load-balance policy to the
 *    forwarding table (ECMP across equal-cost paths). The policy name is
 *    `pplb` on most nodes and `PS-PPLB` on ag1-1/ag1-2.
 *
 * Pair with:
 *  - evo/policy-options/policy-statement/per-packet-load-balance.conf  (defines the pplb policy)
 *
 * Variables:
 *   $PPLB_NAME   e.g. pplb
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
    }
}
```

## evo/routing-options/rib-groups.conf

```
/*
 * Topic:   RIB groups — leak local and remote loopbacks so coloured service next-hops resolve.
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204 mdr2_mx10003
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - RG-LOCAL-LOOPBACK imports lo0 routes into inet.0/inet.3 using
 *    PS-LOCAL-LOOPBACK. (Unlike the Junos MSE variant, EVO nodes do not
 *    import the per-colour transport-class RIBs into this group.)
 *  - RG-REMOTE-LOOPBACKS leaks BGP-learned remote loopbacks across
 *    inet.3/inet.0/inet6.3 using PS-REMOTE-LOOPBACKS.
 *
 * Pair with:
 *  - evo/routing-options/transport-class.conf   (defines the colour transport classes)
 *  - evo/policy-options/policy-statement/loopback-rib-leak.conf    (defines PS-LOCAL-LOOPBACK / PS-REMOTE-LOOPBACKS)
 *
 * Variables: none. RIB-group names, RIB names, and import-policy names are
 *            the JVD-wide abstraction and are left literal.
 */
routing-options {
    rib-groups {
        RG-LOCAL-LOOPBACK {
            import-rib [ inet.0 inet.3 ];
            import-policy PS-LOCAL-LOOPBACK;
        }
        RG-REMOTE-LOOPBACKS {
            import-rib [ inet.3 inet.0 inet6.3 ];
            import-policy PS-REMOTE-LOOPBACKS;
        }
    }
}
```

## evo/routing-options/transport-class.conf

```
/*
 * Topic:   Transport-class definitions — bind BGP colour communities to Flex-Algo transport classes for colour-based (SR) forwarding.
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 ma4_mx204 ma5_mx204 mdr2_mx10003
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Two transport classes: `gold` (colour 4000) and `bronze` (colour 6000).
 *    `auto-create` lets additional colours map without an explicit stanza.
 *  - Each class's `tunnel-egress end-point` is the local transport loopback
 *    the colour-tagged path terminates on.
 *  - Colour 4000 resolves over Flex-Algo 128 (delay), colour 6000 over
 *    Flex-Algo 129 (TE) — see routing-options/flex-algorithm.conf.
 *  - Core PEs anchoring a shared egress add a second anycast `end-point`
 *    under the bronze class (see the Junos MSE variant).
 *
 * Pair with:
 *  - evo/routing-options/flex-algorithm.conf
 *
 * Variables (example values from ma1-1_acx7024):
 *   $TC_EGRESS   e.g. 1.1.0.17   (this node's transport-class egress loopback)
 */
routing-options {
    transport-class {
        auto-create;
        name gold {
            color 4000;
            tunnel-egress {
                end-point $TC_EGRESS;
            }
        }
        name bronze {
            color 6000;
            tunnel-egress {
                end-point $TC_EGRESS;
            }
        }
    }
}
```

## junos/class-of-service/classifiers/cl-6class.conf

```
/*
 * Topic:   DSCP / EXP / 802.1p classifiers for the 6-class model
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Three ingress classifiers — dscp DSCP, exp EXP and ieee-802.1 8021P —
 *    resolving their code-points into the same six forwarding-classes.
 *  - Loss priority is set alongside the code-points: BEST-EFFORT and MEDIUM
 *    carry a high-loss-priority code-point, the rest are low.
 *
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-6queue-model.conf
 *
 * Variables: none. Classifier names, class names and code-points are JVD-wide
 *            constants, identical on every device in the design.
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
}
```

## junos/class-of-service/forwarding-classes/fc-6queue-model.conf

```
/*
 * Topic:   CoS forwarding-classes (queue model)
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Highlights:
 *  - 6-class model used across the Metro EBS CoS design:
 *    queue 0  BEST-EFFORT
 *    queue 1  MEDIUM
 *    queue 2  REALTIME
 *    queue 3  SIG-OAM
 *    queue 4  CONTROL
 *    queue 5  BUSINESS
 *  - The matching scheduler-map and per-class scheduler definitions are in
 *    junos/class-of-service/scheduler-maps/sm-6class-mapping.conf and
 *    junos/class-of-service/schedulers/sc-2-priority-model.conf.
 *
 * Pair with:
 *
 * Variables: none. Class names and queue numbers are JVD-wide constants,
 *            identical on every device in the design.
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

## junos/class-of-service/interfaces/ifd-scheduler-map-shaping.conf

```
/*
 * Topic:   Interface scheduler-map application with a shaping rate
 * Seen on:
 *   Junos: mse1_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - Binds the 5G_SCHEDULER scheduler-map to one interface and shapes the
 *    interface to 10g.
 *
 * Pair with:
 *  - junos/class-of-service/scheduler-maps/sm-6class-mapping.conf
 *
 * Variables:
 *   $COS_INTF   e.g. et-0/0/5
 */
class-of-service {
    interfaces {
        $COS_INTF {
            scheduler-map 5G_SCHEDULER;
            shaping-rate 10g;
        }
    }
}
```

## junos/class-of-service/interfaces/ifd-scheduler-map.conf

```
/*
 * Topic:   Interface scheduler-map application
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Binds the 5G_SCHEDULER scheduler-map to one interface, so the queues
 *    it names apply to everything the interface transmits.
 *
 * Pair with:
 *  - junos/class-of-service/scheduler-maps/sm-6class-mapping.conf
 *
 * Variables:
 *   $COS_INTF   e.g. ae71
 */
class-of-service {
    interfaces {
        $COS_INTF {
            scheduler-map 5G_SCHEDULER;
        }
    }
}
```

## junos/class-of-service/interfaces/ifl-dscp-classifier-rewrite.conf

```
/*
 * Topic:   Per-unit DSCP classifier and rewrite application
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - Ingress DSCP classifier and egress DSCP rewrite rule applied to one
 *    logical unit.
 *
 * Pair with:
 *  - junos/class-of-service/classifiers/cl-6class.conf
 *  - junos/class-of-service/rewrite-rules/rr-6class-marking.conf
 *
 * Variables:
 *   $COS_INTF    e.g. xe-0/0/15:0
 *   $UNIT        e.g. 2001
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                classifiers {
                    dscp DSCP;
                }
                rewrite-rules {
                    dscp DSCP-REWRITE;
                }
            }
        }
    }
}
```

## junos/class-of-service/interfaces/ifl-exp-classifier-rewrite.conf

```
/*
 * Topic:   Per-unit EXP classifier and rewrite application
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Ingress MPLS EXP classifier and egress EXP rewrite rule applied to one
 *    logical unit.
 *
 * Pair with:
 *  - junos/class-of-service/classifiers/cl-6class.conf
 *  - junos/class-of-service/rewrite-rules/rr-6class-marking.conf
 *
 * Variables:
 *   $COS_INTF    e.g. ae71
 *   $UNIT        e.g. 0
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                classifiers {
                    exp EXP;
                }
                rewrite-rules {
                    exp EXP-REWRITE;
                }
            }
        }
    }
}
```

## junos/class-of-service/interfaces/ifl-forwarding-class-ieee8021p-rewrite.conf

```
/*
 * Topic:   Per-unit fixed forwarding class and 802.1p rewrite application
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Assigns every packet arriving on the logical unit to one forwarding
 *    class, rather than classifying per packet, and applies the egress
 *    802.1p rewrite rule.
 *
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-6queue-model.conf
 *  - junos/class-of-service/rewrite-rules/rr-6class-marking.conf
 *
 * Variables:
 *   $COS_INTF          e.g. ae11
 *   $UNIT              e.g. 2400
 *   $FORWARDING_CLASS  e.g. REALTIME
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                forwarding-class $FORWARDING_CLASS;
                rewrite-rules {
                    ieee-802.1 8021P-REWRITE;
                }
            }
        }
    }
}
```

## junos/class-of-service/interfaces/ifl-ieee8021p-classifier-rewrite.conf

```
/*
 * Topic:   Per-unit 802.1p classifier and rewrite application
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 ma4_mx204 ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Ingress 802.1p classifier and egress 802.1p rewrite rule applied to one
 *    logical unit.
 *
 * Pair with:
 *  - junos/class-of-service/classifiers/cl-6class.conf
 *  - junos/class-of-service/rewrite-rules/rr-6class-marking.conf
 *
 * Variables:
 *   $COS_INTF    e.g. ae11
 *   $UNIT        e.g. 702
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                classifiers {
                    ieee-802.1 8021P;
                }
                rewrite-rules {
                    ieee-802.1 8021P-REWRITE;
                }
            }
        }
    }
}
```

## junos/class-of-service/rewrite-rules/rr-6class-marking.conf

```
/*
 * Topic:   DSCP, EXP and IEEE-802.1p rewrite rules for the six-class model
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Three rewrite rules, one per marking: DSCP-REWRITE for IP, EXP-REWRITE for
 *    MPLS and 8021P-REWRITE for tagged Ethernet.
 *  - EXP-REWRITE and 8021P-REWRITE carry identical code-points.
 *  - BEST-EFFORT and MEDIUM are the only classes with a high-loss-priority
 *    code-point; the remaining four carry one code-point each.
 *  - The six forwarding-class names re-marked here are defined in a separate
 *    snip; this one maps them onto code-points and nothing else.
 *
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-6queue-model.conf
 *
 * Variables: none. Rule names, class names and code-points are JVD-wide
 *            constants, identical on every device in the design.
 */
class-of-service {
    rewrite-rules {
        dscp DSCP-REWRITE {
            forwarding-class BEST-EFFORT {
                loss-priority high code-point be;
                loss-priority low code-point cs1;
            }
            forwarding-class BUSINESS {
                loss-priority low code-point cs5;
            }
            forwarding-class CONTROL {
                loss-priority low code-point cs6;
            }
            forwarding-class MEDIUM {
                loss-priority high code-point cs2;
            }
            forwarding-class REALTIME {
                loss-priority low code-point ef;
            }
            forwarding-class SIG-OAM {
                loss-priority low code-point cs3;
            }
        }
        exp EXP-REWRITE {
            forwarding-class BEST-EFFORT {
                loss-priority high code-point 000;
                loss-priority low code-point 001;
            }
            forwarding-class BUSINESS {
                loss-priority low code-point 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-point 111;
            }
            forwarding-class MEDIUM {
                loss-priority high code-point 010;
            }
            forwarding-class REALTIME {
                loss-priority low code-point 101;
            }
            forwarding-class SIG-OAM {
                loss-priority low code-point 011;
            }
        }
        ieee-802.1 8021P-REWRITE {
            forwarding-class BEST-EFFORT {
                loss-priority high code-point 000;
                loss-priority low code-point 001;
            }
            forwarding-class BUSINESS {
                loss-priority low code-point 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-point 111;
            }
            forwarding-class MEDIUM {
                loss-priority high code-point 010;
            }
            forwarding-class REALTIME {
                loss-priority low code-point 101;
            }
            forwarding-class SIG-OAM {
                loss-priority low code-point 011;
            }
        }
    }
}
```

## junos/class-of-service/scheduler-maps/sm-6class-mapping.conf

```
/*
 * Topic:   Scheduler-map pairing the six forwarding-classes with their schedulers
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - One scheduler-map, 5G_SCHEDULER, that pairs each of the six
 *    forwarding-classes with its scheduler.
 *  - Both the forwarding-class names and the scheduler names used here are
 *    defined in separate snips.
 *
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-6queue-model.conf
 *  - junos/class-of-service/schedulers/sc-2-priority-model.conf
 *
 * Variables: none. The scheduler-map name, class names and scheduler names are
 *            JVD-wide constants, identical on every device in the design.
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
}
```

## junos/class-of-service/schedulers/sc-2-priority-model.conf

```
/*
 * Topic:   CoS schedulers for the 6-class model, transmit-rate form
 * Seen on:
 *   Junos: an1_mx204 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - Six schedulers consumed by the 5G_SCHEDULER scheduler-map:
 *
 *      class         priority      transmit-rate     buffer-size
 *      ----------    -----------   --------------    ------------
 *      REALTIME      strict-high   40%               30%
 *      BUSINESS      low           20%               20%
 *      MEDIUM        low           20%               20%
 *      CONTROL       low            5%                2%
 *      SIG-OAM       low            5%                2%
 *      BEST-EFFORT   low           remainder         remainder
 *
 *  - Two scheduling priority levels: REALTIME is strict-high, the other five
 *    classes are low.
 *
 * Variables: none. Scheduler names, priorities, rates and buffer sizes are
 *            JVD-wide constants, identical on every device in the design.
 */
class-of-service {
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
 *   Junos: an1_mx204
 *   EVO:   (none)
 *
 * Two reusable rate-limit policers (5 Mbps and 50 Mbps) and an
 * interface-specific family-any filter that drops traffic
 * exceeding 50 Mbps. Apply with:
 *
 *   set interfaces <ifd> unit <unit> family any filter input 50MB_filter
 *
 * Pair with:
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

## junos/groups/bgp-bcp-ma5.conf

```
/*
 * Topic:   Apply-group BGP-BCP (ma5, Junos)
 * Seen on:
 *   Junos: ma4_mx204 ma5_mx204
 *   EVO:   (none)
 *
 * Highlights:
 *  - As-deployed BGP-BCP apply-group specific to ma5_mx204.
 *
 * Pair with: none
 *
 * Variables: none
 */
groups {
    BGP-BCP {
        protocols {
            bgp {
                precision-timers;
                bgp-error-tolerance;
                tcp-mss 4096;
            }
        }
    }
}
```

## junos/groups/gr-bgp-bcp.conf

```
/*
 * Apply-group: GR-BGP-BCP
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Highlights:
 *  - Best-current-practice BGP knobs:
 *  - external-router-id path-selection
 *  - precision-timers + low hold-time for fast convergence
 *  - bgp-error-tolerance to keep sessions up on minor update errors
 *  - tcp-mss aligned with jumbo MTU
 *
 * Pair with:
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

## junos/groups/gr-core-intf.conf

```
/*
 * Apply-group: GR-CORE-INTF
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Highlights:
 *  - Templated baseline for core/underlay-facing interfaces:
 *  - jumbo MTU at the physical layer (9192)
 *  - per-family MTU override under each unit (inet/iso/mpls)
 *  - mpls family with maximum-labels 14 (SR-MPLS / TI-LFA stacks)
 *  - LACP active for aggregated members
 *
 * Pair with:
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

## junos/groups/gr-edge-intf-mh.conf

```
/*
 * Apply-group: GR-EDGE-INTF-MH
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Pair with:
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

## junos/groups/gr-edge-intf.conf

```
/*
 * Apply-group: GR-EDGE-INTF
 * Seen on:
 *   Junos: an1_mx204 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   (none)
 * Highlights:
 *  - Templated baseline for customer-facing (edge) interfaces.
 *    Applied to physical and aggregated-ethernet interfaces to set
 *    common properties (description marker, MTU, flex-vlan tagging,
 *    flex-ethernet-services encapsulation, optics alarm/warning).
 *  - Apply with:   set interfaces et-0/0/0 apply-groups GR-EDGE-INTF
 *
 * Pair with:
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

## junos/groups/gr-fatpw-label.conf

```
/*
 * Topic:   Per-instance FAT-PW flow-label knob
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   (none)
 *
 * Highlights:
 *  - Junos uses wildcard routing-instance names (<l2vpn_*>, <vpls_*>,
 *    plus the singleton L2VPN_PORT_BASED) to enable
 *    flow-label-transmit / flow-label-receive on every L2VPN and VPLS
 *    instance via apply-groups inheritance.
 *  - EVO equivalent (evo/groups/gr-fatpw-label.conf) targets the
 *    EVPN_VPWS_PORT_* wildcard and uses
 *    flow-label-transmit-static / flow-label-receive-static under
 *    `protocols evpn` (EVPN family, not l2vpn/vpls). Both achieve the
 *    same end goal of FAT-label-aware pseudowires.
 *  - Apply this group at the device level alongside GR-FATPW-LB.
 *
 * Pair with:
 *  - junos/groups/gr-fatpw-lb.conf
 *  - junos/routing-instances/vpls/ri-bgp-vpls-export.conf
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

## junos/groups/gr-fatpw-lb.conf

```
/*
 * Topic:   FAT-PW load-balancing capability (Junos)
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Identical to evo/groups/gr-fatpw-lb.conf — Junos and
 *    Junos Evolved share the same FAT-PW config.
 *  - load-balance-label-capability under forwarding-options enables
 *    the PE to push and to honour Flow-Aware Transport (FAT) labels
 *    on pseudowires. Per-flow ECMP across the SR-MPLS core for
 *    L2VPN / VPLS / EVPN-VPWS pseudowires that would otherwise be
 *    label-stack-stuck on a single LSP.
 *  - Pair this group with GR-FATPW-LABEL (per-instance flow-label
 *    knob) — see junos/groups/gr-fatpw-label.conf.
 *
 * Pair with:
 *  - junos/groups/gr-fatpw-label.conf
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

## junos/groups/gr-isis-bcp.conf

```
/*
 * Apply-group: GR-ISIS-BCP
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710
 *   EVO:   (none)
 * Highlights:
 *  - Best-current-practice ISIS knobs applied to the protocols { isis }
 *    stanza. Tunes hello sizes for jumbo links, SPF timers, and
 *    overload-on-startup behaviour for graceful insertion.
 *
 * Pair with:
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

## junos/groups/gr-l3vpn.conf

```
/*
 * Topic:   L3VPN VRF apply-group baseline
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Identical to evo/groups/gr-l3vpn.conf — Junos and EVO
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
 *  - junos/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy-auto-export.conf
 *  - junos/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf
 *  - junos/policy-options/policy-statement/l3vpn-export-import.conf
 *  - junos/routing-instances/l3vpn/ri-l3vpn-irb.conf
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

## junos/groups/gr-lag-member.conf

```
/*
 * Topic:   LAG-member templates: edge SH/MH and core (Junos)
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
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
 *  - Identical to evo/groups/gr-lag-member.conf.
 *
 * Pair with:
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

## junos/interfaces/core-isis-mpls.conf

```
/*
 * Topic:   Core-facing LAG (ISIS + MPLS underlay attachment)
 * Seen on:
 *   Junos: an1_mx204 ma2_mx204
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-2_acx7024 mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Highlights:
 *  - A core-facing aggregated-ethernet bundle to the upstream AG (AG1.1).
 *    Carries the SR-MPLS underlay: family inet/iso/mpls plus IPv6 for 6PE.
 *  - Common core knobs (jumbo MTU 9192, per-family MTU overrides,
 *    mpls maximum-labels 14, LACP) come from apply-groups GR-CORE-INTF
 *    (see groups/gr-core-intf).
 *
 * Pair with:
 *  - junos/groups/gr-core-intf.conf
 *  - junos/groups/gr-lag-member.conf
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

## junos/interfaces/ethernet-bridge.conf

```
/*
 * Topic:   Flexible-Ethernet-Services UNI with per-unit encapsulation vlan-bridge (EVPN-ELAN access)
 * Seen on:
 *   Junos: ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - Parent physical (or aggregated) interface configured for
 *    flexible-vlan-tagging + encapsulation flexible-ethernet-services
 *    so each unit can carry a different encapsulation flavour.
 *  - Per-unit `encapsulation vlan-bridge` + `vlan-id <N>` exposes
 *    the unit as a `family bridge` UNI, ready to be referenced from
 *    a routing-instance of type virtual-switch (EVPN-ELAN).
 *  - apply-groups GR-EDGE-INTF supplies the common knobs
 *    (mtu, no-auto-negotiation, gigether-options, etc.) shared
 *    across all edge interfaces.
 *
 * Pair with:
 *  - junos/groups/gr-edge-intf.conf
 *  - junos/routing-instances/evpn-etree/ri-evpn-etree-export.conf
 *  - junos/groups/gr-edge-intf.conf
 *
 * Variables (example values from mse1_mx304 xe-0/0/3:1):
 *   $UNI_INTF     e.g. xe-0/0/3:1
 *   $UNIT         e.g. 3000
 *   $VLAN         e.g. 3000
 */
interfaces {
    $UNI_INTF {
        apply-groups GR-EDGE-INTF;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        unit $UNIT {
            encapsulation vlan-bridge;
            vlan-id $VLAN;
        }
    }
}
```

## junos/interfaces/ifd-ae-lacp-fast-disabled.conf

```
/*
 * Topic:   Administratively disabled aggregated-Ethernet edge bundle with fast-periodic LACP
 * Seen on:
 *   Junos: an2_acx5448
 *   EVO:   (none)
 *
 * Highlights:
 *  - The bundle carries `disable`, so the aggregate is held down while its
 *    configuration stays in place.
 *  - LACP active with an explicit system-id, one minimum link, and fast
 *    periodic transmission.
 *  - flexible-vlan-tagging with flexible-ethernet-services encapsulation, so
 *    the bundle can carry logical interfaces of mixed encapsulation.
 *
 * Pair with:
 *  - junos/groups/gr-edge-intf-mh.conf
 *
 * Variables (example values from an2_acx5448):
 *   $IFD           e.g. ae11
 *   $LACP_SYS_ID   e.g. 00:00:00:00:00:01
 */
interfaces {
    $IFD {
        apply-groups GR-EDGE-INTF-MH;
        disable;
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
    }
}
```

## junos/interfaces/ifd-ae-lacp-fast.conf

```
/*
 * Topic:   Aggregated-Ethernet edge bundle with fast-periodic LACP and minimum-links
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - The bundle itself: LACP active with an explicit system-id, one
 *    minimum link, and fast periodic transmission.
 *  - flexible-vlan-tagging with flexible-ethernet-services encapsulation, so
 *    the bundle can carry logical interfaces of mixed encapsulation.
 *  - Port-level description, MTU and edge defaults come from the applied
 *    group rather than from this body.
 *
 * Pair with:
 *  - junos/groups/gr-edge-intf-mh.conf
 *
 * Variables (example values from an1_mx204):
 *   $IFD           e.g. ae11
 *   $LACP_SYS_ID   e.g. 00:00:00:00:00:01
 */
interfaces {
    $IFD {
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
    }
}
```

## junos/interfaces/ifd-ae-lacp.conf

```
/*
 * Topic:   Aggregated-Ethernet edge bundle with LACP active and a shared system-id
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   ma1-1_acx7024 ma1-2_acx7024
 *
 * Highlights:
 *  - The bundle itself: LACP active with an explicit system-id and nothing
 *    else under aggregated-ether-options — no minimum-links and no fast
 *    periodic transmission.
 *  - flexible-vlan-tagging with flexible-ethernet-services encapsulation, so
 *    the bundle can carry logical interfaces of mixed encapsulation.
 *  - Port-level description, MTU and edge defaults come from the applied
 *    group rather than from this body.
 *
 * Pair with:
 *  - junos/groups/gr-edge-intf-mh.conf
 *
 * Variables (example values from ma1-1_acx7024):
 *   $IFD           e.g. ae12
 *   $LACP_SYS_ID   e.g. 00:00:00:00:00:01
 */
interfaces {
    $IFD {
        apply-groups GR-EDGE-INTF-MH;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            lacp {
                active;
                system-id $LACP_SYS_ID;
            }
        }
    }
}
```

## junos/interfaces/ifd-ps-transport.conf

```
/*
 * Topic:   Pseudowire-subscriber device with its anchor PIC and transport logical interface
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - A `ps` device terminates an access-side pseudowire inside the router,
 *    consuming no hardware port; anchor-point names the tunnelling lt- PIC
 *    that loops traffic between the pseudowire and the local service.
 *  - vlan-tagging with flexible-ethernet-services encapsulation lets the
 *    device carry logical interfaces of mixed encapsulation.
 *  - Unit 0 is the transport logical interface of a pseudowire-subscriber
 *    device: it carries ethernet-ccc encapsulation and is the pseudowire
 *    landing point that the l2circuit stanza references as `ps<N>.0`.
 *
 * Pair with:
 *  - junos/protocols/l2circuit-floating-pw.conf
 *
 * Variables (example values from mse1_mx304):
 *   $PS_INTF      e.g. ps0
 *   $ANCHOR_PIC   e.g. lt-0/0/0
 */
interfaces {
    $PS_INTF {
        anchor-point {
            $ANCHOR_PIC;
        }
        vlan-tagging;
        encapsulation flexible-ethernet-services;
        unit 0 {
            encapsulation ethernet-ccc;
        }
    }
}
```

## junos/interfaces/ifl-vlan-bridge-esi-df-preference.conf

```
/*
 * Topic:   Bridged logical interface with EVPN ESI and preference-based DF election
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448
 *   EVO:   (none)
 *
 * Highlights:
 *  - vlan-bridge logical interface carrying one VLAN into a bridged service.
 *  - Per-interface ESI with all-active redundancy; the value is shared with
 *    the peer PE of the same Ethernet Segment.
 *  - df-election-type preference replaces the default election, so the
 *    designated forwarder for this segment follows a configured preference
 *    rather than the service-carving default.
 *
 * Variables (example values from an1_mx204):
 *   $IFD    e.g. ae11
 *   $UNIT   e.g. 700
 *   $VLAN   e.g. 700
 *   $ESI    e.g. 00:70:11:11:11:11:11:00:00:01
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-bridge;
            vlan-id $VLAN;
            esi {
                $ESI;
                all-active;
                df-election-type {
                    preference;
                }
            }
        }
    }
}
```

## junos/interfaces/ifl-vlan-bridge-esi-etree-root.conf

```
/*
 * Topic:   Bridged logical interface with EVPN ESI and the E-Tree root AC role
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - vlan-bridge logical interface carrying one VLAN into a bridged service.
 *  - Per-interface ESI with all-active redundancy; the value is shared with
 *    the peer PE of the same Ethernet Segment.
 *  - etree-ac-role root marks this attachment circuit as an E-Tree root, so
 *    it may reach both root and leaf attachment circuits.
 *
 * Variables (example values from mse1_mx304):
 *   $IFD    e.g. ae10
 *   $UNIT   e.g. 2000
 *   $VLAN   e.g. 2000
 *   $ESI    e.g. 00:10:11:11:11:80:01:00:00:01
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-bridge;
            vlan-id $VLAN;
            esi {
                $ESI;
                all-active;
            }
            etree-ac-role root;
        }
    }
}
```

## junos/interfaces/ifl-vlan-bridge-esi.conf

```
/*
 * Topic:   Bridged logical interface with EVPN ESI multihoming
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - vlan-bridge logical interface carrying one VLAN into a bridged service.
 *  - Per-interface ESI with all-active redundancy; the value is shared with
 *    the peer PE of the same Ethernet Segment, and designated-forwarder
 *    election is left at its default.
 *
 * Variables (example values from an1_mx204):
 *   $IFD    e.g. ae11
 *   $UNIT   e.g. 701
 *   $VLAN   e.g. 701
 *   $ESI    e.g. 00:70:11:11:11:11:11:00:00:02
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-bridge;
            vlan-id $VLAN;
            esi {
                $ESI;
                all-active;
            }
        }
    }
}
```

## junos/interfaces/ifl-vlan-bridge-vlan-map-list.conf

```
/*
 * Topic:   Bridged VLAN-range attachment circuit with VLAN normalization (vlan-bridge, push/pop)
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   (none)
 *
 * Highlights:
 *  - vlan-bridge attachment circuit matching a contiguous customer VLAN range
 *    with vlan-id-list.
 *  - input push / output pop maps the whole range to one service-internal VLAN.
 *
 * Variables (example values from ma5_mx204 xe-0/1/4 unit 1000):
 *   $IFD         e.g. xe-0/1/4
 *   $UNIT        e.g. 1000
 *   $VLAN_LIST   e.g. 1000-1099
 *   $INPUT_VID   e.g. 4000
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-bridge;
            vlan-id-list $VLAN_LIST;
            input-vlan-map {
                push;
                vlan-id $INPUT_VID;
            }
            output-vlan-map pop;
        }
    }
}
```

## junos/interfaces/ifl-vlan-ccc-esi.conf

```
/*
 * Topic:   Single-tagged cross-connect logical interface with EVPN ESI multihoming
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - vlan-ccc logical interface carrying one VLAN, with no VLAN rewriting:
 *    the customer tag is presented to the cross-connect unchanged.
 *  - Per-interface ESI with all-active redundancy; the value is shared with
 *    the peer PE of the same Ethernet Segment.
 *
 * Variables (example values from an1_mx204):
 *   $IFD    e.g. ae11
 *   $UNIT   e.g. 101
 *   $VLAN   e.g. 101
 *   $ESI    e.g. 00:10:11:11:11:11:01:00:00:00
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-ccc;
            vlan-id $VLAN;
            esi {
                $ESI;
                all-active;
            }
        }
    }
}
```

## junos/interfaces/ifl-vlan-ccc-vlan-map-esi.conf

```
/*
 * Topic:   Cross-connect logical interface with VLAN normalization and EVPN ESI multihoming
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - vlan-ccc logical interface with an input push and an output pop, which
 *    decouples the customer VLAN id from the service-internal one.
 *  - Per-interface ESI with all-active redundancy; the value is shared with
 *    the peer PE of the same Ethernet Segment.
 *
 * Variables (example values from an1_mx204):
 *   $IFD         e.g. ae11
 *   $UNIT        e.g. 2400
 *   $VLAN        e.g. 2400
 *   $INPUT_VID   e.g. 3800
 *   $ESI         e.g. 00:10:11:11:30:11:01:00:00:00
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-ccc;
            vlan-id $VLAN;
            input-vlan-map {
                push;
                vlan-id $INPUT_VID;
            }
            output-vlan-map pop;
            esi {
                $ESI;
                all-active;
            }
        }
    }
}
```

## junos/interfaces/ifl-vlan-ccc-vlan-map-filter.conf

```
/*
 * Topic:   Rate-limited attachment circuit with VLAN normalization (vlan-ccc, push/pop)
 * Seen on:
 *   Junos: an4_acx710 ma5_mx204
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - vlan-ccc attachment circuit with input push / output pop VLAN mapping.
 *  - Ingress filter applies the UNI rate limit; 50MB_filter and its policer are
 *    defined in junos/firewall/policers.conf.
 *  - Decouples customer VLAN IDs from service-internal VLAN IDs at the SP edge.
 *
 * Pair with:
 *  - junos/firewall/policers.conf
 *
 * Variables (example values from an4_acx710):
 *   $IFD         e.g. xe-0/1/4
 *   $UNIT        e.g. 2800
 *   $VLAN        e.g. 2800
 *   $INPUT_VID   e.g. 3200
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-ccc;
            vlan-id $VLAN;
            input-vlan-map {
                push;
                vlan-id $INPUT_VID;
            }
            output-vlan-map pop;
            filter {
                input 50MB_filter;
            }
        }
    }
}
```

## junos/interfaces/ifl-vlan-vpls-vlan-map.conf

```
/*
 * Topic:   VPLS attachment circuit with VLAN normalization (vlan-vpls, push/pop)
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   (none)
 *
 * Highlights:
 *  - vlan-vpls attachment circuit with input push / output pop VLAN mapping.
 *  - Decouples customer VLAN IDs from service-internal VLAN IDs at the SP edge.
 *
 * Variables (example values from ma5_mx204 xe-0/1/4 unit 400):
 *   $IFD         e.g. xe-0/1/4
 *   $UNIT        e.g. 400
 *   $VLAN        e.g. 400
 *   $INPUT_VID   e.g. 3500
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-vpls;
            vlan-id $VLAN;
            input-vlan-map {
                push;
                vlan-id $INPUT_VID;
            }
            output-vlan-map pop;
        }
    }
}
```

## junos/policy-options/community/cm-access-fabric.conf

```
/*
 * Topic:   BGP community CM-ACCESS-FABRIC
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Marks a prefix as belonging to the access fabric. Carried on the
 *    fabric community administrator, so it is comparable across regions.
 *
 * Pair with: none
 *
 * Variables:
 *   $FABRIC_COMMUNITY_AS    e.g. 63535
 */
policy-options {
    community CM-ACCESS-FABRIC members $FABRIC_COMMUNITY_AS:2;
}
```

## junos/policy-options/community/cm-inet-backup.conf

```
/*
 * Topic:   BGP community CM-INET-BACKUP
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Route target marking the backup Internet path.
 *
 * Pair with: none
 *
 * Variables:
 *   $RING_COMMUNITY_AS      e.g. 63536
 */
policy-options {
    community CM-INET-BACKUP members target:$RING_COMMUNITY_AS:99999;
}
```

## junos/policy-options/community/cm-inet-default.conf

```
/*
 * Topic:   BGP community CM-INET-DEFAULT
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Route target carried by the Internet default routes, matched by the
 *    per-service L3VPN import policies to pull a default into a customer
 *    VRF.
 *
 * Pair with: none
 *
 * Variables:
 *   $RING_COMMUNITY_AS      e.g. 63536
 */
policy-options {
    community CM-INET-DEFAULT members target:$RING_COMMUNITY_AS:11111;
}
```

## junos/policy-options/community/cm-inet-primary.conf

```
/*
 * Topic:   BGP community CM-INET-PRIMARY
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Route target marking the primary Internet path. One of the three
 *    Internet helper targets, which differ only in their assigned number.
 *
 * Pair with: none
 *
 * Variables:
 *   $RING_COMMUNITY_AS      e.g. 63536
 */
policy-options {
    community CM-INET-PRIMARY members target:$RING_COMMUNITY_AS:00000;
}
```

## junos/policy-options/community/cm-l3vpn-bgpv4.conf

```
/*
 * Topic:   Per-VRF L3VPN route-target community (METRO_BGPv4_L3VPN_<id>).
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - One community per L3VPN service: name METRO_BGPv4_L3VPN_$L3VPN_ID with a
 *    matching route-target target:$RT_AS:$L3VPN_ID. The service id is the
 *    same in the name and the RT tail.
 *  - $RT_AS is the L3VPN's originating-domain AS and varies per VRF (a
 *    node may carry both its own and imported VRFs), so it is a service-instance
 *    variable, not a device-wide one.
 *  - Referenced by l3vpn-bgp and l3vpn-export-import.
 *
 * Pair with: none
 *
 * Variables:
 *   $L3VPN_ID      e.g. 1001
 *   $RT_AS         e.g. 63536
 */
policy-options {
    community METRO_BGPv4_L3VPN_${L3VPN_ID} members target:$RT_AS:$L3VPN_ID;
}
```

## junos/policy-options/community/cm-l3vpn-bgpv6.conf

```
/*
 * Topic:   Per-service IPv6 L3VPN route-target community
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - One community per IPv6 L3VPN service. The service id appears both in
 *    the community name and as the route-target tail, and that holds for
 *    every one of the 3,400 instances, so the tail is expressed as a
 *    derivative of the same id rather than as a free value.
 *
 * Pair with: none
 *
 * Variables:
 *   $L3VPN_ID      e.g. 2201
 *   $RT_AS         e.g. 63535
 */
policy-options {
    community METRO_BGPv6_L3VPN_${L3VPN_ID} members target:$RT_AS:$L3VPN_ID;
}
```

## junos/policy-options/community/cm-l3vpn-pub.conf

```
/*
 * Topic:   BGP community CM-L3VPN-PUB
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Route target tagging the public L3VPN prefixes an export policy
 *    chooses to advertise beyond the customer VRF.
 *
 * Pair with: none
 *
 * Variables:
 *   $RING_COMMUNITY_AS      e.g. 63536
 */
policy-options {
    community CM-L3VPN-PUB members target:$RING_COMMUNITY_AS:22222;
}
```

## junos/policy-options/community/cm-l3vpn.conf

```
/*
 * Topic:   Per-service L3VPN route-target community
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - One community per L3VPN service, without the address-family qualifier
 *    the BGPv4 and BGPv6 families carry in their names.
 *    The route-target tail is a free value, not a derivative of the service
 *    id: 250 of the 3,650 instances use a tail that differs from the id, and
 *    those 250 are the only instances on meg1 and meg2. Deriving the tail
 *    would cost two whole devices of coverage.
 *
 * Pair with: none
 *
 * Variables:
 *   $L3VPN_ID      e.g. 2001
 *   $RT_AS         e.g. 63535
 *   $RT_ID         e.g. 2001
 */
policy-options {
    community METRO_L3VPN_${L3VPN_ID} members target:$RT_AS:$RT_ID;
}
```

## junos/policy-options/community/cm-loopback.conf

```
/*
 * Topic:   CM-LOOPBACK community definition (tags local loopbacks for RIB leak).
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - CM-LOOPBACK tags local lo0 /32s; imported by PS-LOCAL-LOOPBACK
 *    (see policy-options/policy-statement/loopback-rib-leak.conf).
 *  - The community value is role-dependent (the administrator follows the
 *    node's regional AS), so it is carried whole in $LOOPBACK_COMMUNITY.
 *
 * Pair with: none
 *
 * Variables:
 *   $LOOPBACK_COMMUNITY   e.g. 63535:10000
 */
policy-options {
    community CM-LOOPBACK members $LOOPBACK_COMMUNITY;
}
```

## junos/policy-options/community/cm-metro-fabric.conf

```
/*
 * Topic:   BGP community CM-METRO-FABRIC
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Marks a prefix as belonging to the metro fabric, the peer tag to
 *    CM-ACCESS-FABRIC on the same fabric administrator.
 *
 * Pair with: none
 *
 * Variables:
 *   $FABRIC_COMMUNITY_AS    e.g. 63535
 */
policy-options {
    community CM-METRO-FABRIC members $FABRIC_COMMUNITY_AS:1;
}
```

## junos/policy-options/community/cm-metro-ring.conf

```
/*
 * Topic:   BGP community CM-METRO-RING
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Ring-region topology tag on the metro ring community administrator,
 *    which differs from the fabric administrator used by the fabric tags.
 *
 * Pair with: none
 *
 * Variables:
 *   $RING_COMMUNITY_AS      e.g. 63536
 */
policy-options {
    community CM-METRO-RING members $RING_COMMUNITY_AS:20;
}
```

## junos/policy-options/community/cm-no-advertise.conf

```
/*
 * Topic:   BGP community CM-NO-ADVERTISE
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - The well-known no-advertise community. Unlike every other community
 *    here it takes no administrator, so it carries no variable.
 *
 * Pair with: none
 *
 * Variables: none. The community value is a JVD-wide constant.
 */
policy-options {
    community CM-NO-ADVERTISE members no-advertise;
}
```

## junos/policy-options/community/cm-region-edge.conf

```
/*
 * Topic:   BGP community CM-REGION-EDGE
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Ring-region topology tag identifying the region edge.
 *
 * Pair with: none
 *
 * Variables:
 *   $RING_COMMUNITY_AS      e.g. 63536
 */
policy-options {
    community CM-REGION-EDGE members $RING_COMMUNITY_AS:30;
}
```

## junos/policy-options/community/cm-regional-border.conf

```
/*
 * Topic:   BGP community CM-REGIONAL-BORDER
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Marks a prefix originated at a regional border, so border routers
 *    can be told apart from fabric interior nodes in export policy.
 *
 * Pair with: none
 *
 * Variables:
 *   $FABRIC_COMMUNITY_AS    e.g. 63535
 */
policy-options {
    community CM-REGIONAL-BORDER members $FABRIC_COMMUNITY_AS:3;
}
```

## junos/policy-options/community/cm-service-edge.conf

```
/*
 * Topic:   BGP community CM-SERVICE-EDGE
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Ring-region topology tag identifying the service edge, where
 *    customer-facing services attach.
 *
 * Pair with: none
 *
 * Variables:
 *   $RING_COMMUNITY_AS      e.g. 63536
 */
policy-options {
    community CM-SERVICE-EDGE members $RING_COMMUNITY_AS:10;
}
```

## junos/policy-options/community/cm-service-rt.conf

```
/*
 * Topic:   Per-service route-target community
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 ma4_mx204 ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - One community per service instance, named from the instance itself with
 *    an `_RT` suffix. The suffix is part of the object's identity: it is what
 *    separates these definitions from every other community in the design.
 *  - The route-target tail is a free value rather than a derivative of the
 *    instance name, and the administrator is service-scoped rather than the
 *    node's own AS, so all three fields are parameterized independently.
 *  - One form covers every L2 service family here: evpn_group, vpls_group and
 *    l2vpn_group instances all take this exact shape.
 *
 * Pair with: none
 *
 * Variables (example values from an1_mx204):
 *   $INSTANCE_NAME   e.g. evpn_group_90_700
 *   $RT_AS           e.g. 63535
 *   $RT_ID           e.g. 7000
 */
policy-options {
    community ${INSTANCE_NAME}_RT members target:$RT_AS:$RT_ID;
}
```

## junos/policy-options/community/cm-tc-4000-gold.conf

```
/*
 * Topic:   BGP community CM-TC-4000-GOLD
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - As-deployed CM-TC-4000-GOLD community definition.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    community CM-TC-4000-GOLD members transport-target:0:4000;
}
```

## junos/policy-options/community/cm-tc-6000-bronze.conf

```
/*
 * Topic:   BGP community CM-TC-6000-BRONZE
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - As-deployed CM-TC-6000-BRONZE community definition.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    community CM-TC-6000-BRONZE members transport-target:0:6000;
}
```

## junos/policy-options/community/cm-tc-map2bronze.conf

```
/*
 * Topic:   Transport-class colour community bronze
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 ma4_mx204 ma5_mx204 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Transport Class color community for the bronze class (`color:0:6000`).
 *
 * Pair with: none
 *
 * Variables:
 *   $COLOR_COMMUNITY   e.g. map2bronze
 */
policy-options {
    community $COLOR_COMMUNITY members color:0:6000;
}
```

## junos/policy-options/community/cm-tc-map2gold.conf

```
/*
 * Topic:   Transport-class colour community gold
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Transport Class color community for the gold class (`color:0:4000`).
 *
 * Pair with: none
 *
 * Variables:
 *   $COLOR_COMMUNITY   e.g. map2gold
 */
policy-options {
    community $COLOR_COMMUNITY members color:0:4000;
}
```

## junos/policy-options/policy-statement/l3vpn-export-import.conf

```
/*
 * Topic:   Per-VRF L3VPN export / import policies
 * Seen on:
 *   Junos: ma4_mx204
 *   EVO:   (none)
 *
 * Highlights:
 *  - Identical structure to evo/policy-options/policy-statement/l3vpn-export-import.conf —
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
 *  - junos/policy-options/community/cm-inet-default.conf
 *  - junos/policy-options/community/cm-l3vpn-pub.conf
 *  - junos/policy-options/community/cm-l3vpn-bgpv4.conf
 *  - junos/policy-options/community/cm-tc-map2gold.conf
 *  - junos/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy-auto-export.conf
 *  - junos/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf
 *  - junos/groups/gr-l3vpn.conf
 *
 * Variables (example values from ma4_mx204 / METRO_BGPv4_L3VPN_1001):
 *   $INSTANCE_NAME    e.g. METRO_BGPv4_L3VPN_1001
 *                     (the per-VRF community, the EXPORT and the
 *                     IMPORT policy all share this name; the
 *                     community is defined in
 *                     junos/policy-options/community/cm-l3vpn-bgpv4.conf)
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

## junos/policy-options/policy-statement/loopback-rib-leak.conf

```
/*
 * Topic:   Loopback RIB-leak policies (PS-LOCAL-LOOPBACK / PS-REMOTE-LOOPBACKS) imported by the loopback RIB groups.
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - PS-LOCAL-LOOPBACK accepts local lo0 /32s from the JVD loopback supernet
 *    and tags them CM-LOOPBACK; imported into RG-LOCAL-LOOPBACK.
 *  - PS-REMOTE-LOOPBACKS accepts BGP-learned loopbacks and tags them
 *    CM-NO-ADVERTISE; imported into RG-REMOTE-LOOPBACKS.
 *  - Both policies end with an explicit `term REJECT`.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-no-advertise.conf
 *  - junos/policy-options/community/cm-loopback.conf
 *
 * Variables:
 *   $LOOPBACK_SUPERNET   e.g. 1.1.0.0/16
 */
policy-options {
    policy-statement PS-LOCAL-LOOPBACK {
        term LOCAL-LOOPBACK {
            from {
                protocol direct;
                interface lo0.0;
                route-filter $LOOPBACK_SUPERNET prefix-length-range /32-/32;
            }
            then {
                community add CM-LOOPBACK;
                accept;
            }
        }
        term REJECT {
            then reject;
        }
    }
    policy-statement PS-REMOTE-LOOPBACKS {
        term ALL-LOOPBACKS {
            from protocol bgp;
            then {
                community add CM-NO-ADVERTISE;
                accept;
            }
        }
        term REJECT {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/nhs1.conf

```
/*
 * Topic:   BGP policy nhs1
 * Seen on:
 *   Junos: ma4_mx204 ma5_mx204
 *   EVO:   ma1-1_acx7024 ma1-2_acx7024
 *
 * Highlights:
 *  - As-deployed nhs1 routing policy.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    policy-statement nhs1 {
        term 2 {
            from {
                family evpn;
                protocol bgp;
            }
            then accept;
        }
        term 3 {
            then {
                next-hop self;
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/per-packet-load-balance.conf

```
/*
 * Topic:   Per-packet load-balance policy (pplb) — exported to the forwarding table so ECMP paths are used per-flow.
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Single unconditional term: `load-balance per-packet; accept;`.
 *  - Applied via `routing-options forwarding-table export $PPLB_NAME`
 *    (routing-options/forwarding-table.conf). The policy name is `pplb` on most
 *    nodes and `PS-PPLB` on some EVO nodes.
 *
 * Pair with: none
 *
 * Variables:
 *   $PPLB_NAME   e.g. pplb
 */
policy-options {
    policy-statement $PPLB_NAME {
        then {
            load-balance per-packet;
            accept;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-as63535-import.conf

```
/*
 * Topic:   BGP policy PS-AS63535-IMPORT (Junos)
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - As-deployed PS-AS63535-IMPORT routing policy.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-metro-fabric.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-AS63535-IMPORT {
        term metro-fabric {
            from community CM-METRO-FABRIC;
            then accept;
        }
        term reject {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-bgp-export.conf

```
/*
 * Topic:   BGP policy PS-BGP-EXPORT
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - As-deployed PS-BGP-EXPORT routing policy.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-access-fabric.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-BGP-EXPORT {
        term ORIGIN {
            then {
                community add CM-ACCESS-FABRIC;
                next term;
            }
        }
        term EVPN-NO-NHS {
            from {
                family evpn;
                protocol bgp;
            }
            then accept;
        }
        term LOOPBACK {
            from protocol [ direct bgp ];
            then {
                next-hop self;
                accept;
            }
        }
        term LU {
            from rib inet.3;
            then reject;
        }
        term CT {
            from rib bgp.transport.3;
            then reject;
        }
        term ACCEPT-NHS {
            then {
                next-hop self;
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-bgp-mse-export.conf

```
/*
 * Topic:   BGP policy PS-BGP-MSE-EXPORT
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509
 *
 * Highlights:
 *  - As-deployed PS-BGP-MSE-EXPORT routing policy.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-tc-4000-gold.conf
 *  - junos/policy-options/community/cm-tc-6000-bronze.conf
 *  - junos/policy-options/community/cm-access-fabric.conf
 *  - junos/policy-options/community/cm-metro-fabric.conf
 *  - junos/policy-options/community/cm-metro-ring.conf
 *  - junos/policy-options/community/cm-service-edge.conf
 *  - junos/policy-options/prefix-list/pl-an-region.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-BGP-MSE-EXPORT {
        term LOOP-PREVENT {
            from community [ CM-SERVICE-EDGE CM-ACCESS-FABRIC CM-METRO-FABRIC ];
            then reject;
        }
        inactive: term FROM-METRO-RING {
            from {
                community CM-METRO-RING;
                prefix-list PL-AN-REGION;
            }
            then {
                next-hop self;
                accept;
            }
        }
        inactive: term LOOPBACK {
            from {
                prefix-list PL-AN-REGION;
            }
            then {
                inactive: community add CM-METRO-RING;
                accept;
            }
        }
        term BGP-CT {
            from {
                protocol [ direct bgp ];
                rib bgp.transport.3;
                community [ CM-TC-4000-GOLD CM-TC-6000-BRONZE ];
            }
            then {
                community add CM-METRO-RING;
                next-hop self;
                accept;
            }
        }
        term BGP-LU {
            from {
                rib inet.3;
                prefix-list PL-AN-REGION;
            }
            then {
                community add CM-METRO-RING;
                next-hop self;
                accept;
            }
        }
        term BGP-CTv6 {
            from {
                protocol [ direct bgp ];
                rib bgp.transport-inet6.3;
                community [ CM-TC-4000-GOLD CM-TC-6000-BRONZE ];
            }
            then {
                community add CM-METRO-RING;
                next-hop self;
                accept;
            }
        }
        term BGP-LUv6 {
            from {
                rib inet6.3;
                community CM-METRO-RING;
                prefix-list PL-AN-REGION;
            }
            then {
                next-hop self;
                accept;
            }
        }
        term REJECT {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-bgp-transport-export.conf

```
/*
 * Topic:   BGP policy PS-BGP-TRANSPORT-EXPORT
 * Seen on:
 *   Junos: ma4_mx204 ma5_mx204
 *   EVO:   ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l
 *
 * Highlights:
 *  - As-deployed PS-BGP-TRANSPORT-EXPORT routing policy.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-metro-ring.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-BGP-TRANSPORT-EXPORT {
        term ORIGIN {
            then {
                community add CM-METRO-RING;
                next term;
            }
        }
        term LOOPBACK {
            from protocol [ direct bgp ];
            then {
                next-hop self;
                accept;
            }
        }
        term LU {
            from rib inet.3;
            then reject;
        }
        term CT {
            from rib bgp.transport.3;
            then reject;
        }
        term ACCEPT-NHS {
            then {
                next-hop self;
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-ebgp-cr-export.conf

```
/*
 * Topic:   BGP policy PS-EBGP-CR-EXPORT (Junos)
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - As-deployed PS-EBGP-CR-EXPORT routing policy.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-access-fabric.conf
 *  - junos/policy-options/community/cm-metro-fabric.conf
 *  - junos/policy-options/community/cm-metro-ring.conf
 *  - junos/policy-options/community/cm-service-edge.conf
 *  - junos/policy-options/prefix-list/pl-an-region.conf
 *  - junos/policy-options/prefix-list/pl-mse.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-EBGP-CR-EXPORT {
        term LOOP-PREVENT {
            from community [ CM-ACCESS-FABRIC CM-METRO-FABRIC ];
            then reject;
        }
        term RING-LOOPBACKS {
            from {
                community CM-METRO-RING;
                prefix-list PL-AN-REGION;
            }
            then {
                community add CM-SERVICE-EDGE;
                accept;
            }
        }
        term MSE-LOOPBACKS {
            from {
                prefix-list PL-MSE;
            }
            then {
                community add CM-SERVICE-EDGE;
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-export-l2-color.conf

```
/*
 * Topic:   Per-service L2 vrf-export policy — service RT plus transport-colour community
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 ma4_mx204 ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - The single export-policy structure shared by every L2 service family in
 *    this JVD: instance-type evpn, evpn-vpws, mac-vrf, virtual-switch, vpls and
 *    l2vpn all bind this exact shape. Only the two variables move.
 *  - The policy is named after the routing instance it serves, so the consuming
 *    instance body reads `vrf-export $INSTANCE_NAME;` with no separate policy
 *    name to track.
 *  - `term a` stamps two communities on everything the instance originates:
 *    the per-service route target `${INSTANCE_NAME}_RT`, and a transport-colour
 *    community that steers the service onto a coloured transport class.
 *  - `term b` rejects everything else — the instance advertises only what this
 *    policy explicitly accepts.
 *  - $COLOR_COMMUNITY is the only tier discriminator. Gold and bronze services
 *    differ solely in this binding (`map2gold` / `map2bronze`), so there is no
 *    separate gold or bronze form. The tier lives in the community, not in the
 *    policy structure.
 *  - The colour community itself (`map2gold members color:0:4000`,
 *    `map2bronze members color:0:6000`) and the per-service `${INSTANCE_NAME}_RT`
 *    community are defined under policy-options community; neither definition is
 *    modelled in this library yet.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from an1_mx204 / evpn_group_90_700):
 *   $INSTANCE_NAME     e.g. evpn_group_90_700
 *                      (the routing instance this policy serves; the policy and
 *                       the `${INSTANCE_NAME}_RT` community are both named from it)
 *   $COLOR_COMMUNITY   e.g. map2gold
 *                      (transport-colour community; map2bronze on bronze services)
 */
policy-options {
    policy-statement $INSTANCE_NAME {
        term a {
            then {
                community add ${INSTANCE_NAME}_RT;
                community add $COLOR_COMMUNITY;
                accept;
            }
        }
        term b {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-export-l3vpn-nlri-rt5-public.conf

```
/*
 * Topic:   L3VPN vrf-export policy — public prefixes plus an explicit EVPN Type-5 NLRI term
 * Seen on:
 *   Junos: mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - Superset of junos/policy-options/policy-statement/ps-export-l3vpn-public.conf:
 *    the same four-aggregate `term tag-public-routes`, plus a second term that
 *    matches EVPN NLRI route-type 5 directly.
 *  - `term EVPN-T5-ONLY` selects `family evpn` with `nlri-route-type 5` and
 *    re-tags those IP-prefix routes with the per-VRF community, so Type-5
 *    prefixes learned into the VRF carry the VPN community on re-advertisement
 *    even though they do not match the customer aggregates.
 *  - Only mse2 runs this form. mse2 is also the device whose VRFs point their
 *    default route into the Internet VRF
 *    (junos/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy-next-table.conf),
 *    so its VRFs carry EVPN Type-5 routes that did not originate locally.
 *  - `nlri-route-type` is the body-level discriminator that gives this form its
 *    name; every other L3VPN export policy in the JVD matches on route-filter
 *    prefixes alone.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-l3vpn-pub.conf
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from mse2_mx304 / METRO_L3VPN_4000):
 *   $INSTANCE_NAME   e.g. METRO_L3VPN_4000
 *                    (the routing instance; the policy is PS-${INSTANCE_NAME}-EXPORT
 *                     and the tagged community carries the same name)
 *   $CE_PREFIX_1     e.g. 43.2.0.0/16
 *   $CE_PREFIX_2     e.g. 44.2.0.0/16
 *   $CE_PREFIX_3     e.g. 40.2.0.0/16
 *   $CE_PREFIX_4     e.g. 41.2.0.0/16
 */
policy-options {
    policy-statement PS-${INSTANCE_NAME}-EXPORT {
        term tag-public-routes {
            from {
                route-filter $CE_PREFIX_1 orlonger;
                route-filter $CE_PREFIX_2 orlonger;
                route-filter $CE_PREFIX_3 orlonger;
                route-filter $CE_PREFIX_4 orlonger;
            }
            then {
                community add CM-L3VPN-PUB;
                community add $INSTANCE_NAME;
                accept;
            }
        }
        term EVPN-T5-ONLY {
            from {
                family evpn;
                nlri-route-type 5;
            }
            then {
                community add $INSTANCE_NAME;
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-export-l3vpn-public.conf

```
/*
 * Topic:   L3VPN vrf-export policy — tag and advertise the customer public prefixes
 * Seen on:
 *   Junos: mse1_mx304
 *   EVO:   an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - The export half of the EVPN-IRB L3VPN service (the METRO_L3VPN_40xx
 *    family). One term matches the four customer public aggregates and tags
 *    each accepted route with two communities.
 *  - `CM-L3VPN-PUB` marks the route as a public L3VPN prefix for the fabric;
 *    `$INSTANCE_NAME` is the per-VRF community that the matching
 *    PS-${INSTANCE_NAME}-IMPORT policy looks for on the remote PE.
 *  - There is no `term tag-default`: this VRF exports only the four tagged
 *    aggregates, never a default route. The broader L3VPN families on ma4 and
 *    an3 do carry a default-tagging term — see
 *    junos/policy-options/policy-statement/l3vpn-export-import.conf.
 *  - mse2 runs a superset of this policy that additionally re-tags EVPN
 *    Type-5 NLRI; that form is
 *    junos/policy-options/policy-statement/ps-export-l3vpn-nlri-rt5-public.conf.
 *  - The route-filter prefixes are per-VRF customer aggregates, all matched
 *    `orlonger` so the customer's more-specifics are carried too.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-l3vpn-pub.conf
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from mse1_mx304 / METRO_L3VPN_4000):
 *   $INSTANCE_NAME   e.g. METRO_L3VPN_4000
 *                    (the routing instance; the policy is PS-${INSTANCE_NAME}-EXPORT
 *                     and the tagged community carries the same name)
 *   $CE_PREFIX_1     e.g. 43.2.0.0/16
 *   $CE_PREFIX_2     e.g. 44.2.0.0/16
 *   $CE_PREFIX_3     e.g. 40.2.0.0/16
 *   $CE_PREFIX_4     e.g. 41.2.0.0/16
 */
policy-options {
    policy-statement PS-${INSTANCE_NAME}-EXPORT {
        term tag-public-routes {
            from {
                route-filter $CE_PREFIX_1 orlonger;
                route-filter $CE_PREFIX_2 orlonger;
                route-filter $CE_PREFIX_3 orlonger;
                route-filter $CE_PREFIX_4 orlonger;
            }
            then {
                community add CM-L3VPN-PUB;
                community add $INSTANCE_NAME;
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-ibgp-mdr-export-mdr2.conf

```
/*
 * Topic:   BGP policy PS-IBGP-MDR-EXPORT
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509
 *
 * Highlights:
 *  - As-deployed PS-IBGP-MDR-EXPORT routing policy.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-metro-fabric.conf
 *  - junos/policy-options/community/cm-metro-ring.conf
 *  - junos/policy-options/community/cm-loopback.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-IBGP-MDR-EXPORT {
        term LOOPBACK {
            from {
                protocol direct;
                interface lo0.0;
            }
            then {
                community add CM-LOOPBACK;
                community add CM-METRO-RING;
                next-hop self;
                accept;
            }
        }
        term METRO-FABRIC {
            from community CM-METRO-FABRIC;
            then {
                next-hop self;
                accept;
            }
        }
        term METRO-RING {
            from community CM-METRO-RING;
            then accept;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-ibgp-mdr-export-mse1.conf

```
/*
 * Topic:   BGP policy PS-IBGP-MDR-EXPORT (Junos)
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - As-deployed PS-IBGP-MDR-EXPORT routing policy.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-metro-fabric.conf
 *  - junos/policy-options/community/cm-metro-ring.conf
 *  - junos/policy-options/community/cm-region-edge.conf
 *  - junos/policy-options/prefix-list/pl-mse-primary.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-IBGP-MDR-EXPORT {
        term LOOP_PREVENT {
            from community [ CM-METRO-RING CM-REGION-EDGE ];
            then reject;
        }
        term FROM-METRO-FABRIC {
            from community CM-METRO-FABRIC;
            then {
                next-hop self;
                accept;
            }
        }
        term MSE-LOOPBACKS {
            from {
                prefix-list PL-MSE-PRIMARY;
            }
            then {
                community add CM-REGION-EDGE;
                accept;
            }
        }
        term FLOATING-PS-CONDITIONAL {
            from {
                route-filter 1.1.10.10/32 exact;
                condition Floating-PW-Condition;
            }
            then {
                community add CM-REGION-EDGE;
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-ibgp-mse-export.conf

```
/*
 * Topic:   BGP policy PS-IBGP-MSE-EXPORT (Junos)
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - As-deployed PS-IBGP-MSE-EXPORT routing policy.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-access-fabric.conf
 *  - junos/policy-options/community/cm-service-edge.conf
 *  - junos/policy-options/community/cm-loopback.conf
 *  - junos/policy-options/prefix-list/pl-an-region.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-IBGP-MSE-EXPORT {
        term LOOPBACK {
            from {
                protocol direct;
                interface lo0.0;
            }
            then {
                community add CM-LOOPBACK;
                next-hop self;
                accept;
            }
        }
        term AS63535-METRO-FABRIC {
            from community CM-ACCESS-FABRIC;
            then {
                next-hop self;
                accept;
            }
        }
        term AS63536-MSE {
            from community CM-SERVICE-EDGE;
            then accept;
        }
        term AS63536-LOOPBACKS {
            from {
                prefix-list PL-AN-REGION;
            }
            then accept;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-ibgp-rr-export.conf

```
/*
 * Topic:   BGP policy PS-IBGP-RR-EXPORT
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509
 *
 * Highlights:
 *  - As-deployed PS-IBGP-RR-EXPORT routing policy.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-access-fabric.conf
 *  - junos/policy-options/community/cm-metro-fabric.conf
 *  - junos/policy-options/prefix-list/pl-an-region.conf
 *  - junos/policy-options/prefix-list/pl-mse.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-IBGP-RR-EXPORT {
        term MSE-NHS {
            from {
                protocol bgp;
                prefix-list PL-MSE;
            }
            then {
                next-hop self;
                accept;
            }
        }
        term AS63535 {
            from {
                protocol bgp;
                community [ CM-ACCESS-FABRIC CM-METRO-FABRIC ];
            }
            then {
                next-hop self;
                accept;
            }
        }
        term RING {
            from {
                prefix-list PL-AN-REGION;
            }
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf

```
/*
 * Topic:   BGP import policy IMPORT-BGP (EVPN accept, LOOPBACK reject) with the LOOPBACK prefix-list it matches
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - `term EVPN` accepts BGP EVPN routes before any prefix match, so overlay
 *    routes are unaffected by the loopback filter that follows.
 *  - `term LOCAL-REJECT` drops routes matching `prefix-list LOOPBACK`;
 *    `term ACCEPT` passes everything else.
 *  - The prefix-list carries the node's primary loopback and the shared
 *    anycast loopback, so the policy and the list it matches are one unit.
 *
 * Pair with: none
 *
 * Variables (example values from mse1_mx304):
 *   $LOOPBACK_V4          e.g. 1.1.0.10
 *   $LOOPBACK_ANYCAST_V4  e.g. 1.1.10.10
 */
policy-options {
    prefix-list LOOPBACK {
        $LOOPBACK_V4/32;
        $LOOPBACK_ANYCAST_V4/32;
    }
    policy-statement IMPORT-BGP {
        term EVPN {
            from {
                family evpn;
                protocol bgp;
            }
            then accept;
        }
        term LOCAL-REJECT {
            from {
                prefix-list LOOPBACK;
            }
            then reject;
        }
        term ACCEPT {
            then accept;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-import-l3vpn.conf

```
/*
 * Topic:   L3VPN vrf-import policy — accept the per-VRF community only
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - The import half of the EVPN-IRB L3VPN service (the METRO_L3VPN_40xx
 *    family). A single term accepts routes carrying the VRF's own community
 *    and nothing else.
 *  - Deliberately slim: no `term INTERNET` accepting CM-INET-DEFAULT. These
 *    VRFs are EVPN Type-5 gateways for a paired E-LAN, not Internet-attached
 *    customer VRFs, so no Internet default is imported. The broader L3VPN
 *    families on ma4 and an3 use the two-term form in
 *    junos/policy-options/policy-statement/l3vpn-export-import.conf instead.
 *  - The policy name, the community it matches and the routing instance all
 *    derive from one identity stem: instance METRO_L3VPN_4000 binds
 *    `vrf-import PS-METRO_L3VPN_4000-IMPORT;`, which matches community
 *    METRO_L3VPN_4000.
 *  - The per-VRF community itself is defined under policy-options community
 *    (`community METRO_L3VPN_4000 members target:61535:13000;`).
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from mse1_mx304 / METRO_L3VPN_4000):
 *   $INSTANCE_NAME   e.g. METRO_L3VPN_4000
 *                    (the routing instance; the policy is PS-${INSTANCE_NAME}-IMPORT
 *                     and the matched community carries the same name)
 */
policy-options {
    policy-statement PS-${INSTANCE_NAME}-IMPORT {
        term L3VPN-CUST {
            from community $INSTANCE_NAME;
            then accept;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-inet-vrf-default.conf

```
/*
 * Topic:   Internet VRF default-route tagging policy
 * Seen on:
 *   Junos: mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - Exported from the Internet VRF so the locally originated default routes
 *    leave the instance carrying a community the customer VRFs match on.
 *  - Two terms, one per address family, because `from family inet6` is needed
 *    to reach the IPv6 default; the IPv4 term takes the family implicitly.
 *  - `protocol static` with `route-filter 0.0.0.0/0 exact` and `::/0 exact`
 *    selects only the discard defaults configured in the instance, not any
 *    learned prefix.
 *  - Both terms tag with `CM-INET-DEFAULT`, which the per-service L3VPN import
 *    policies match to pull a default route into a customer VRF.
 *  - The policy body is literal: one validated instance, and the name is not a
 *    derivative of the instance it serves.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-inet-default.conf
 */
policy-options {
    policy-statement INET-VRF-DEFAULT_1 {
        term ipv4 {
            from {
                protocol static;
                route-filter 0.0.0.0/0 exact;
            }
            then {
                community add CM-INET-DEFAULT;
                accept;
            }
        }
        term ipv6 {
            from {
                family inet6;
                protocol static;
                route-filter ::/0 exact;
            }
            then {
                community add CM-INET-DEFAULT;
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-mse-import.conf

```
/*
 * Topic:   BGP policy PS-MSE-IMPORT (Junos)
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - As-deployed PS-MSE-IMPORT routing policy.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-MSE-IMPORT {
        term SET-LP {
            then {
                local-preference 90;
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf

```
/*
 * Topic:   BGP policy PS-REMOTE-LOOPBACKS (services-edge PEs, Junos)
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - As-deployed PS-REMOTE-LOOPBACKS import policy for the services-edge PEs.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-no-advertise.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement PS-REMOTE-LOOPBACKS {
        term ALL-LOOPBACKS {
            from protocol bgp;
            then {
                community add CM-NO-ADVERTISE;
                accept;
            }
        }
        term REJECT {
            then reject;
        }
    }
}
```

## junos/policy-options/prefix-list/pl-an-region.conf

```
/*
 * Topic:   Prefix-list PL-AN-REGION
 * Seen on:
 *   Junos: mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   mdr1_acx7509
 *
 * Highlights:
 *  - As-deployed PL-AN-REGION prefix-list.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    prefix-list PL-AN-REGION {
        1.1.0.12/32;
        1.1.0.13/32;
        1.1.0.14/32;
        1.1.0.15/32;
        1.1.0.16/32;
        1.1.0.17/32;
        1.1.0.18/32;
        1.1.0.19/32;
    }
}
```

## junos/policy-options/prefix-list/pl-mse-primary.conf

```
/*
 * Topic:   Prefix-list PL-MSE-PRIMARY (Junos)
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - As-deployed PL-MSE-PRIMARY prefix-list.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    prefix-list PL-MSE-PRIMARY {
        1.1.0.10/32;
        1.1.0.11/32;
    }
}
```

## junos/policy-options/prefix-list/pl-mse.conf

```
/*
 * Topic:   Prefix-list PL-MSE
 * Seen on:
 *   Junos: mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   mdr1_acx7509
 *
 * Highlights:
 *  - As-deployed PL-MSE prefix-list.
 *
 * Pair with: none
 *
 * Variables: none
 */
policy-options {
    prefix-list PL-MSE {
        1.1.0.10/32;
        1.1.0.11/32;
        1.1.10.10/32;
    }
}
```

## junos/protocols/bgp-overlay-an4.conf

```
/*
 * Topic:   Complete deployed BGP form for an4_acx710 (Junos)
 * Seen on:
 *   Junos: an4_acx710
 *   EVO:   (none)
 * Variant group: mebs-bgp-overlay
 *   Provides: evpn, l2vpn, inet-vpn, inet6-vpn, labeled-unicast
 *
 * Highlights:
 *  - Complete deployed BGP control-plane form for an4_acx710.
 *
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-bgp-export.conf
 *  - junos/routing-options/rib-groups.conf
 *
 * Variables: none
 */
protocols {
    bgp {
        advertise-from-main-vpn-tables;
        vpn-apply-export;
        group GR-IBGP-MEG-RR {
            type internal;
            local-address 1.1.0.3;
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
            neighbor 1.1.0.6;
            neighbor 1.1.0.7;
        }
        log-updown;
        graceful-restart;
        multipath;
    }
}
```

## junos/protocols/bgp-overlay-ma4.conf

```
/*
 * Topic:   Complete deployed BGP form for ma4_mx204 (Junos)
 * Seen on:
 *   Junos: ma4_mx204
 *   EVO:   (none)
 * Variant group: mebs-bgp-overlay
 *   Provides: evpn, l2vpn, inet-vpn, inet6-vpn, labeled-unicast
 *
 * Highlights:
 *  - Complete deployed BGP control-plane form for ma4_mx204.
 *
 * Pair with:
 *  - junos/policy-options/policy-statement/nhs1.conf
 *  - junos/policy-options/policy-statement/ps-bgp-transport-export.conf
 *  - junos/routing-options/rib-groups.conf
 *
 * Variables: none
 */
protocols {
    bgp {
        apply-groups [ BGP-BCP GR-BGP-BCP ];
        vpn-apply-export;
        group GR-IBGP-MDR {
            type internal;
            local-address 1.1.0.16;
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
            neighbor 1.1.0.12;
            neighbor 1.1.0.13;
        }
        group ibgp_mse_mpbgp {
            type internal;
            local-address 1.1.0.16;
            family inet {
                labeled-unicast {
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                }
                transport {
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                }
            }
            family inet-vpn {
                unicast;
            }
            family inet6 {
                transport {
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
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
            export nhs1;
            bfd-liveness-detection {
                minimum-interval 200;
                multiplier 3;
            }
            neighbor 1.1.0.10;
            neighbor 1.1.0.11;
        }
        log-updown;
        graceful-restart;
        multipath;
    }
}
```

## junos/protocols/bgp-overlay-ma5.conf

```
/*
 * Topic:   Complete deployed BGP form for ma5_mx204 (Junos)
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   (none)
 * Variant group: mebs-bgp-overlay
 *   Provides: evpn, l2vpn, inet-vpn, labeled-unicast
 *
 * Highlights:
 *  - Complete deployed BGP control-plane form for ma5_mx204.
 *
 * Pair with:
 *  - junos/groups/bgp-bcp-ma5.conf
 *  - junos/policy-options/policy-statement/nhs1.conf
 *  - junos/policy-options/policy-statement/ps-bgp-transport-export.conf
 *  - junos/routing-options/rib-groups.conf
 *
 * Variables: none
 */
protocols {
    bgp {
        apply-groups BGP-BCP;
        advertise-from-main-vpn-tables;
        vpn-apply-export;
        group GR-IBGP-MDR {
            type internal;
            local-address 1.1.0.19;
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
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.12;
            neighbor 1.1.0.13;
        }
        group ibgp_mse_mpbgp {
            type internal;
            local-address 1.1.0.19;
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
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.10;
            neighbor 1.1.0.11;
        }
        log-updown;
        graceful-restart;
        multipath;
    }
}
```

## junos/protocols/bgp-overlay-mdr2.conf

```
/*
 * Topic:   Complete deployed BGP form for mdr2_mx10003 (Junos)
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   (none)
 * Variant group: mebs-bgp-overlay
 *   Provides: labeled-unicast
 *
 * Highlights:
 *  - Complete deployed BGP control-plane form for mdr2_mx10003.
 *
 * Pair with:
 *  - junos/groups/gr-bgp-bcp.conf
 *  - junos/policy-options/policy-statement/ps-bgp-mse-export.conf
 *  - junos/policy-options/policy-statement/ps-ibgp-mdr-export-mdr2.conf
 *  - junos/policy-options/policy-statement/ps-ibgp-rr-export.conf
 *  - junos/routing-options/rib-groups.conf
 *
 * Variables: none
 */
protocols {
    bgp {
        apply-groups GR-BGP-BCP;
        advertise-from-main-vpn-tables;
        vpn-apply-export;
        group GR-IBGP-RING-RR {
            type internal;
            local-address 1.1.0.13;
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
            export PS-IBGP-RR-EXPORT;
            cluster 1.1.0.13;
            no-client-reflect;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.17 {
                description "MA1.1 rtme-acx7024-04";
            }
            neighbor 1.1.0.18 {
                description "MA1.2 rtme-acx7024-01";
            }
            neighbor 1.1.0.19 {
                description "MA5 rtme-mx-59";
            }
            neighbor 1.1.0.15 {
                description "MA3 rtme-acx-48l-07";
            }
            neighbor 1.1.0.16 {
                description "MA4 rtme-mx204-10";
            }
        }
        group GR-IBGP-MSE {
            type internal;
            local-address 1.1.0.13;
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
            export PS-BGP-MSE-EXPORT;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.10;
            neighbor 1.1.0.11;
        }
        group GR-IBGP-MDR {
            type internal;
            local-address 1.1.0.13;
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
                    }
                }
            }
            export PS-IBGP-MDR-EXPORT;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.12;
        }
    }
}
```

## junos/protocols/bgp-overlay-mse1.conf

```
/*
 * Topic:   Complete deployed BGP form for mse1_mx304
 * Seen on:
 *   Junos: mse1_mx304
 *   EVO:   (none)
 * Variant group: mebs-bgp-overlay
 *   Provides: evpn, l2vpn, inet-vpn, inet6-vpn, labeled-unicast
 *
 * Highlights:
 *  - Complete deployed BGP control-plane form for mse1_mx304.
 *
 * Pair with:
 *  - junos/groups/gr-bgp-bcp.conf
 *  - junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf
 *  - junos/policy-options/policy-statement/ps-as63535-import.conf
 *  - junos/policy-options/policy-statement/ps-ebgp-cr-export.conf
 *  - junos/policy-options/policy-statement/ps-ibgp-mdr-export-mse1.conf
 *  - junos/policy-options/policy-statement/ps-ibgp-mse-export.conf
 *  - junos/policy-options/policy-statement/ps-mse-import.conf
 *  - junos/routing-options/rib-group-remote-loopbacks-mse.conf
 *
 * Variables: none
 */
protocols {
    bgp {
        apply-groups GR-BGP-BCP;
        advertise-from-main-vpn-tables;
        vpn-apply-export;
        group GR-EBGP-CR1-TP {
            type external;
            import PS-AS63535-IMPORT;
            family inet {
                labeled-unicast {
                    rib-group RG-REMOTE-LOOPBACKS;
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                    per-prefix-label;
                    rib {
                        inet.3;
                    }
                    explicit-null connected-only;
                    protection;
                }
                transport {
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                    protection;
                }
            }
            family inet6 {
                labeled-unicast {
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                    per-prefix-label;
                    rib {
                        inet6.3;
                    }
                    protection;
                }
                transport {
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                    protection;
                }
            }
            export PS-EBGP-CR-EXPORT;
            peer-as 63535;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 10.10.0.37;
        }
        group ebgp_meg_mpbgp {
            type external;
            multihop {
                no-nexthop-change;
            }
            local-address 1.1.0.10;
            family inet-vpn {
                unicast;
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
                external-paths 4;
                nexthop-resolution {
                    no-resolution;
                }
            }
            peer-as 63535;
            local-as 63536;
            multipath;
            bfd-liveness-detection {
                minimum-interval 200;
                multiplier 3;
            }
            neighbor 1.1.0.6;
            neighbor 1.1.0.7;
        }
        group GR-IBGP-MDR {
            type internal;
            local-address 1.1.0.10;
            import IMPORT-BGP;
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
            export PS-IBGP-MDR-EXPORT;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.12;
            neighbor 1.1.0.13;
        }
        group GR-IBGP-MSE {
            type internal;
            local-address 1.1.0.10;
            import PS-MSE-IMPORT;
            family inet {
                labeled-unicast {
                    rib-group RG-REMOTE-LOOPBACKS;
                    add-path {
                        receive;
                        send {
                            path-count 2;
                            multipath;
                        }
                    }
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                    rib {
                        inet.3;
                    }
                    explicit-null connected-only;
                }
                transport {
                    add-path {
                        receive;
                        send {
                            path-count 2;
                        }
                    }
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
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
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                }
            }
            family evpn {
                signaling {
                }
            }
            export PS-IBGP-MSE-EXPORT;
            neighbor 1.1.0.11;
        }
        group mpbgp-ma-rr {
            type internal;
            local-address 1.1.0.10;
            import IMPORT-BGP;
            family inet-vpn {
                unicast;
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
                advertise-default;
                nexthop-resolution {
                    no-resolution;
                }
            }
            
            cluster 1.1.0.10;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.17;
            neighbor 1.1.0.18;
            neighbor 1.1.0.19;
            neighbor 1.1.0.15;
            neighbor 1.1.0.16;
        }
        log-updown;
        graceful-restart;
        multipath;
    }
}
```

## junos/protocols/bgp-overlay-mse2.conf

```
/*
 * Topic:   Complete deployed BGP form for mse2_mx304
 * Seen on:
 *   Junos: mse2_mx304
 *   EVO:   (none)
 * Variant group: mebs-bgp-overlay
 *   Provides: evpn, l2vpn, inet-vpn, inet6-vpn, labeled-unicast
 *
 * Highlights:
 *  - Complete deployed BGP control-plane form for mse2_mx304.
 *
 * Pair with:
 *  - junos/groups/gr-bgp-bcp.conf
 *  - junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf
 *  - junos/policy-options/policy-statement/ps-as63535-import.conf
 *  - junos/policy-options/policy-statement/ps-ebgp-cr-export.conf
 *  - junos/policy-options/policy-statement/ps-ibgp-mdr-export-mse1.conf
 *  - junos/policy-options/policy-statement/ps-ibgp-mse-export.conf
 *  - junos/policy-options/policy-statement/ps-mse-import.conf
 *  - junos/routing-options/rib-group-remote-loopbacks-mse.conf
 *
 * Variables: none
 */
protocols {
    bgp {
        apply-groups GR-BGP-BCP;
        advertise-from-main-vpn-tables;
        vpn-apply-export;
        group GR-EBGP-CR2-TP {
            type external;
            import PS-AS63535-IMPORT;
            family inet {
                labeled-unicast {
                    rib-group RG-REMOTE-LOOPBACKS;
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                    per-prefix-label;
                    rib {
                        inet.3;
                    }
                    explicit-null connected-only;
                    protection;
                }
                transport {
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                    protection;
                }
            }
            family inet6 {
                labeled-unicast {
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                    per-prefix-label;
                    rib {
                        inet6.3;
                    }
                    protection;
                }
                transport {
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                    protection;
                }
            }
            export PS-EBGP-CR-EXPORT;
            peer-as 63535;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 10.10.0.45;
        }
        group ebgp_meg_mpbgp {
            type external;
            multihop {
                no-nexthop-change;
            }
            local-address 1.1.0.11;
            family inet-vpn {
                unicast;
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
                external-paths 4;
                nexthop-resolution {
                    no-resolution;
                }
            }
            peer-as 63535;
            local-as 63536;
            multipath;
            bfd-liveness-detection {
                minimum-interval 200;
                multiplier 3;
            }
            neighbor 1.1.0.6 {
                description "MEG1 - rtme-acx7100-32c-d";
            }
            neighbor 1.1.0.7 {
                description "MEG2 - rtme-acx7509-01";
            }
        }
        group GR-IBGP-MDR {
            type internal;
            local-address 1.1.0.11;
            import IMPORT-BGP;
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
            export PS-IBGP-MDR-EXPORT;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.12;
            neighbor 1.1.0.13;
        }
        group GR-IBGP-MSE {
            type internal;
            local-address 1.1.0.11;
            import PS-MSE-IMPORT;
            family inet {
                labeled-unicast {
                    rib-group RG-REMOTE-LOOPBACKS;
                    add-path {
                        receive;
                        send {
                            path-count 2;
                            multipath;
                        }
                    }
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                    rib {
                        inet.3;
                    }
                    explicit-null connected-only;
                }
                transport {
                    add-path {
                        receive;
                        send {
                            path-count 2;
                        }
                    }
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
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
                    nexthop-resolution {
                        preserve-nexthop-hierarchy;
                    }
                }
            }
            family evpn {
                signaling {
                }
            }
            export PS-IBGP-MSE-EXPORT;
            neighbor 1.1.0.10;
        }
        group mpbgp-ma-rr {
            type internal;
            local-address 1.1.0.11;
            import IMPORT-BGP;
            family inet-vpn {
                unicast;
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
                advertise-default;
                nexthop-resolution {
                    no-resolution;
                }
            }
            cluster 1.1.0.11;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 1.1.0.17;
            neighbor 1.1.0.18;
            neighbor 1.1.0.19;
            neighbor 1.1.0.15;
            neighbor 1.1.0.16;
        }
        log-updown;
        graceful-restart;
        multipath;
    }
}
```

## junos/protocols/bgp-overlay.conf

```
/*
 * Topic:   iBGP overlay session to route reflectors (multi-AF)
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448
 *   EVO:   (none)
 * Variant group: mebs-bgp-overlay
 *   Provides: evpn, l2vpn, inet-vpn, inet6-vpn, labeled-unicast
 *
 * Highlights:
 *  - Complete deployed iBGP overlay form for an1_mx204 / an2_acx5448 (all
 *    overlay AFs in one group). This is a role-specific as-deployed form,
 *    not a universal per-service prerequisite — a MEF service activates
 *    only its own signaling AF.
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
 *  - junos/groups/gr-bgp-bcp.conf
 *  - junos/routing-options/rib-groups.conf
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

## junos/protocols/isis-srmpls-tilfa.conf

```
/*
 * Topic:   ISIS underlay with SR-MPLS, TI-LFA, and Flex-Algo
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   (none)
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
 *  - junos/groups/gr-isis-bcp.conf
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

## junos/protocols/l2circuit-floating-pw-color.conf

```
/*
 * Topic:   Floating-PW L2Circuit on a pseudowire-subscriber interface, with transport-colour community
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - The PW lands on a pseudowire-subscriber interface (`ps<N>.0`) rather than
 *    a hardware attachment circuit, so the MX can float the PW into an EVPN
 *    service without dedicating a physical port to the customer. Unit 0 is
 *    intrinsic to that transport interface and stays literal.
 *  - `static { incoming-label / outgoing-label }` pins the PW label pair, so
 *    the pseudowire comes up without tLDP signalling between the two ends.
 *  - encapsulation-type ethernet-vlan carries the customer VLAN tag across
 *    the PW transparently.
 *  - The transport-colour community on the PW lets it follow a coloured
 *    BGP-CT underlay.
 *
 * Pair with:
 *  - junos/routing-instances/evpn-elan/ri-evpn-elan-irb.conf
 *  - junos/interfaces/ifd-ps-transport.conf
 *
 * Variables (example values from mse1_mx304):
 *   $REMOTE_PE_V4     e.g. 1.1.0.18
 *   $PS_INTF          e.g. ps0
 *   $LABEL_IN         e.g. 1000001
 *   $LABEL_OUT        e.g. 1000001
 *   $VC_ID            e.g. 1001
 *   $COLOR_COMMUNITY  e.g. map2gold
 */
protocols {
    l2circuit {
        neighbor $REMOTE_PE_V4 {
            interface $PS_INTF.0 {
                static {
                    incoming-label $LABEL_IN;
                    outgoing-label $LABEL_OUT;
                }
                virtual-circuit-id $VC_ID;
                community $COLOR_COMMUNITY;
                encapsulation-type ethernet-vlan;
            }
        }
    }
}
```

## junos/protocols/l2circuit-floating-pw.conf

```
/*
 * Topic:   Floating-PW L2Circuit on a pseudowire-subscriber interface
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - The PW lands on a pseudowire-subscriber interface (`ps<N>.0`) rather than
 *    a hardware attachment circuit, so the MX can float the PW into an EVPN
 *    service without dedicating a physical port to the customer. Unit 0 is
 *    intrinsic to that transport interface and stays literal.
 *  - `static { incoming-label / outgoing-label }` pins the PW label pair, so
 *    the pseudowire comes up without tLDP signalling between the two ends.
 *  - encapsulation-type ethernet-vlan carries the customer VLAN tag across
 *    the PW transparently.
 *
 * Pair with:
 *  - junos/routing-instances/evpn-elan/ri-evpn-elan-irb.conf
 *  - junos/interfaces/ifd-ps-transport.conf
 *
 * Variables (example values from mse1_mx304):
 *   $REMOTE_PE_V4    e.g. 1.1.0.18
 *   $PS_INTF         e.g. ps1
 *   $LABEL_IN        e.g. 1000002
 *   $LABEL_OUT       e.g. 1000002
 *   $VC_ID           e.g. 1010
 */
protocols {
    l2circuit {
        neighbor $REMOTE_PE_V4 {
            interface $PS_INTF.0 {
                static {
                    incoming-label $LABEL_IN;
                    outgoing-label $LABEL_OUT;
                }
                virtual-circuit-id $VC_ID;
                encapsulation-type ethernet-vlan;
            }
        }
    }
}
```

## junos/protocols/mpls-segment-routing.conf

```
/*
 * Topic:   MPLS / Segment Routing global config
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - admin-groups (blue/green/red) referenced by ISIS attribute-groups
 *    for color-aware path computation
 *  - SRGB label range 16000–24000 used by ISIS source-packet-routing
 *  - icmp-tunneling for traceroute through MPLS
 *  - ipv6-tunneling enables 6PE over the SR-MPLS underlay
 *
 * Pair with:
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

## junos/protocols/oam-cfm-perf-mon.conf

```
/*
 * Topic:   Y.1731 performance-monitoring (CFM) with HW timestamping
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   an3_acx7100-48l ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Identical structure to evo/protocols/oam-cfm-perf-mon.conf —
 *    Junos and Junos Evolved share the OAM CFM config language.
 *  - hardware-assisted-timestamping puts the Y.1731 DM/SLM packet
 *    timestamps in the PFE rather than the RE — required for
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

## junos/routing-instances/apply-groups/gr-fatpw-label.conf

```
/*
 * Topic:   Apply GR-FATPW-LABEL at the routing-instances hierarchy level
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   ma1-1_acx7024 ma1-2_acx7024
 *
 * Highlights:
 *  - The application statement that makes apply-group GR-FATPW-LABEL take
 *    effect. A group definition is inert on its own; the behaviour arrives only
 *    when the group is applied, and the hierarchy level at which it is applied
 *    decides what it can match.
 *  - Applied at `routing-instances`, so the group's L2 wildcards
 *    (`<evpn_group_80_*>`, `<evpn_group_10_*>`, `<vpls_*>`, `<l2vpn_*>`,
 *    `<EVPN_VPWS_PORT_*>`, `<EVPN_ELAN_PORT_*>`, `L2VPN_PORT_BASED`) can match
 *    the service instances beneath it and inject the FAT-PW flow-label knobs.
 *  - GR-FATPW-LABEL never matches an L3VPN VRF: its wildcards and the
 *    `<METRO_*>` names GR-L3VPN matches are disjoint, and no instance carries
 *    both.
 *  - This is the bare single-group serialization. Three EVO devices apply this
 *    group inside a bracketed list together with GR-L3VPN — see
 *    evo/routing-instances/apply-groups/gr-l3vpn-fatpw-label.conf. mse1, mse2
 *    and ma1-2 additionally apply it at the top level, which is a different
 *    hierarchy point and a different statement.
 *
 * Pair with:
 *  - junos/groups/gr-fatpw-label.conf
 *
 * Variables: none
 */
routing-instances {
    apply-groups GR-FATPW-LABEL;
}
```

## junos/routing-instances/apply-groups/gr-l3vpn.conf

```
/*
 * Topic:   Apply GR-L3VPN at the routing-instances hierarchy level
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   ma3_acx7100-48l
 *
 * Highlights:
 *  - The application statement that makes apply-group GR-L3VPN take effect. A
 *    group definition is inert on its own; the behaviour arrives only when the
 *    group is applied, and the hierarchy level at which it is applied decides
 *    what it can match.
 *  - Applied at `routing-instances`, so GR-L3VPN's `<METRO_*>` wildcard can
 *    match the VRFs beneath it and inject `instance-type vrf`,
 *    `routing-options multipath vpn-unequal-cost`, `routing-options protect
 *    core` and `vrf-table-label`.
 *  - This is the bare single-group serialization. Three EVO devices apply the
 *    same group inside a bracketed list together with GR-FATPW-LABEL — see
 *    evo/routing-instances/apply-groups/gr-l3vpn-fatpw-label.conf. The list is
 *    a serialization choice at that hierarchy point; the two groups are
 *    independent and neither requires the other.
 *  - Every device that applies GR-L3VPN also defines it, and every device that
 *    defines it applies it.
 *
 * Pair with:
 *  - junos/groups/gr-l3vpn.conf
 *
 * Variables: none
 */
routing-instances {
    apply-groups GR-L3VPN;
}
```

## junos/routing-instances/evpn-elan/ri-evpn-elan-irb.conf

```
/*
 * Topic:   EVPN-ELAN with `instance-type virtual-switch` + bridge-domains + IRB (the L2 half of the EVPN IRB pair, Junos MX)
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - `instance-type virtual-switch` with an inner `bridge-domains` block, and
 *    the IRB hand-off to L3 via `routing-interface irb.<N>` on the
 *    bridge-domain.
 *  - Paired with junos/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy.conf on the SAME `irb.<N>`:
 *    this snip carries MAC+IP (RT-2) and any silent-host /32s for the
 *    bridge-domain; the Type-5 VRF carries the IRB subnet (RT-5) and
 *    upstream prefixes.
 *  - `default-gateway do-not-advertise` — the IRB is the L3 default
 *    gateway, but the MAC-VRF / virtual-switch must NOT re-advertise
 *    it as a RT-2 (the matching MAC-VRF on EVO peers does the same).
 *  - `no-control-word` matches the remote PE behaviour.
 *  - encapsulation MPLS over SR-MPLS underlay (no VXLAN; metro-MPLS
 *    deployment).
 *  - Scale: one virtual-switch instance per VLAN/IRB pair (e.g.
 *    evpn_group_60_4000 → vlan-id 3000 → irb.4000).
 *
 * Pair with:
 *  - junos/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy.conf
 *  - junos/protocols/l2circuit-floating-pw.conf
 *  - junos/interfaces/ethernet-bridge.conf
 *  - junos/interfaces/ifd-ps-transport.conf
 *  - variant:mebs-bgp-overlay families=evpn
 *  - junos/routing-instances/l3vpn/ri-l3vpn-irb.conf
 *
 * JVD service mapping:
 *   50 instances total (high 50 / med 0 / low 0)
 *   On devices: an3_acx7100-48l (50), meg1_acx7100-32c (50), meg2_acx7509 (50), mse1_mx304 (50), mse2_mx304 (50)
 *   Example: evpn_group_60_4000 (RD 1.1.0.2:14000, RT target:61535:14000)
 *     an3_acx7100-48l  et-0/0/50.2000
 *     meg1_acx7100-32c  ae66.4000 00:10:11:11:50:12:01:00:00:00 A-A
 *     meg2_acx7509  ae66.4000 00:10:11:11:50:12:01:00:00:00 A-A
 *     mse1_mx304  xe-0/0/3:1.3000
 *     (+1 more endpoints)
 *
 * Variables (example values from mse1_mx304 / evpn_group_60_4000):
 *   $INSTANCE_NAME    e.g. evpn_group_60_4000
 *   $BD_NAME          e.g. BD_evpn_group_60_4000
 *   $AC_INTF          e.g. xe-0/0/3:1
 *   $UNIT             e.g. 3000   (the AC unit and the BD vlan-id)
 *   $VLAN             e.g. 3000
 *   $IRB_UNIT         e.g. 4000
 *   $LOOPBACK_V4      e.g. 1.1.0.10
 *   $RD_SUB_ASSIGNED  e.g. 14000
 *   $RT_AS            e.g. 61535
 *   $RT_ID            e.g. 14000
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
                vlan-id $VLAN;
                interface $AC_INTF.$UNIT;
                routing-interface irb.$IRB_UNIT;
            }
        }
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf

```
/*
 * Topic:   VLAN-based EVPN E-LAN with a vrf-export policy
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   (none)
 *
 * Highlights:
 *  - VLAN-based EVPN E-LAN, policy-export variant: the service
 *    VLAN is defined on the `vlan-bridge` attachment-circuit unit
 *    (ae11.<vlan>, one CE-VLAN per EVI). instance-type evpn on Junos MX.
 *  - encapsulation mpls (SR-MPLS underlay)
 *  - `vlan-id none` advertises Ethernet Tag ID 0; `no-normalization`
 *    preserves the AC VLAN rather than normalizing it to an EVI VLAN.
 *  - The discriminator against the plain base form
 *    (junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based.conf) is the
 *    presence of `vrf-export $INSTANCE_NAME;` alongside `vrf-target`.
 *    The export policy stamps the per-service RT community and a
 *    transport-colour community — see
 *    junos/policy-options/policy-statement/ps-export-l2-color.conf.
 *  - The name records the ROUTE-CONTROL mechanism, not the service tier.
 *    Every covered instance on an1 currently binds a gold-coloured policy,
 *    but the colour lives in the referenced policy's $COLOR_COMMUNITY, not
 *    in this instance body, so the tier is not part of this form's identity.
 *  - Source-validated one-instance variation: an1_mx204 /
 *    evpn_group_90_700 additionally carries `no-control-word` under
 *    protocols evpn. It is excluded from this reusable body because the
 *    other EVIs (701-749) do not carry it.
 *  - Attachment-circuit (ae11.701) has esi/all-active in interfaces
 *    snippet for active/active multihoming
 *  - For vlan-aware or vlan-bundle service-types on MX, use
 *    instance-type virtual-switch instead (see
 *    junos/routing-instances/evpn-elan/ri-evpn-elan-irb.conf for the
 *    virtual-switch + IRB shape).
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *  - junos/interfaces/ifl-vlan-bridge-esi.conf
 *  - junos/policy-options/policy-statement/ps-export-l2-color.conf
 *
 * JVD service mapping:
 *   50 instances total (high 50 / med 0 / low 0)
 *   On devices: an1_mx204 (50), an2_acx5448 (50), an3_acx7100-48l (50), ma1-1_acx7024 (50), ma1-2_acx7024 (50), meg1_acx7100-32c (50), +1 more
 *   Example: evpn_group_90_700 (RD 1.1.0.0:7000, RT target:63535:7000)
 *     an1_mx204  ae11.700 00:10:11:11:11:11:01:00:00:00 A-A
 *     an2_acx5448  ae11.700 00:10:11:11:11:11:01:00:00:00 A-A
 *     an3_acx7100-48l  ae11.700 00:10:11:11:11:11:01:00:00:00 A-A
 *     ma1-1_acx7024  ae12.700 00:10:11:11:50:12:03:00:00:00 A-A
 *     (+3 more endpoints)
 *
 * Variables (example values from an1_mx204):
 *   $INSTANCE_NAME   e.g. evpn_group_90_701
 *                    (the vrf-export policy is named after the instance)
 *   $AC_INTF         e.g. ae11.701
 *   $LOOPBACK_V4     e.g. 1.1.0.0
 *   $RD_SUB_ASSIGNED e.g. 7001
 *   $RT_ID           e.g. 7001
 *   $RT_AS           e.g. 63535
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn;
        protocols {
            evpn {
                encapsulation mpls;
            }
        }
        vlan-id none;
        no-normalization;
        interface $AC_INTF;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based.conf

```
/*
 * Topic:   VLAN-based EVPN E-LAN — plain / base form (instance-type evpn, Junos MX)
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448
 *   EVO:   (none)
 *
 * Highlights:
 *  - VLAN-based EVPN E-LAN: the service VLAN is defined on the
 *    `vlan-bridge` attachment-circuit unit (ae11.<vlan>), one CE-VLAN
 *    per EVI. instance-type evpn on Junos MX, no bridge-domains block.
 *  - `vlan-id none` advertises Ethernet Tag ID 0; `no-normalization`
 *    preserves the AC VLAN rather than normalizing it to an EVI VLAN.
 *  - encapsulation mpls over the SR-MPLS underlay.
 *  - This is the plain/base EVI shape shared by BOTH AA peers (AN1
 *    MX204 + AN2 ACX5448); it carries no egress colour steering. The
 *    gold colour overlay (an1 only, `vrf-export` + map2gold) is captured
 *    by junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf.
 *  - The two PEs of an AA-multihoming pair carry the same set of EVIs
 *    over the same ESI-bearing AE (ae11).
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *  - junos/interfaces/ifl-vlan-bridge-esi.conf
 *  - junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf
 *
 * JVD service mapping:
 *   50 instances total (high 50 / med 0 / low 0)
 *   On devices: an1_mx204 (50), an2_acx5448 (50), an3_acx7100-48l (50), ma1-1_acx7024 (50), ma1-2_acx7024 (50), meg1_acx7100-32c (50), +1 more
 *   Example: evpn_group_90_700 (RD 1.1.0.0:7000, RT target:63535:7000)
 *     an1_mx204  ae11.700 00:10:11:11:11:11:01:00:00:00 A-A
 *     an2_acx5448  ae11.700 00:10:11:11:11:11:01:00:00:00 A-A
 *     an3_acx7100-48l  ae11.700 00:10:11:11:11:11:01:00:00:00 A-A
 *     ma1-1_acx7024  ae12.700 00:10:11:11:50:12:03:00:00:00 A-A
 *     (+3 more endpoints)
 *
 * Variables (example values from an1_mx204 / evpn_group_90_700):
 *   $INSTANCE_NAME    e.g. evpn_group_90_700
 *   $AC_INTF          e.g. ae11
 *   $VLAN_UNIT        e.g. 700   (selects ae11.<unit>)
 *   $LOOPBACK_V4      e.g. 1.1.0.0
 *   $RD_SUB_ASSIGNED  e.g. 7000
 *   $RT_AS            e.g. 63535
 *   $RT_ID            e.g. 7000
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn;
        protocols {
            evpn {
                encapsulation mpls;
            }
        }
        vlan-id none;
        no-normalization;
        interface $AC_INTF.$VLAN_UNIT;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/routing-instances/evpn-etree/ri-evpn-etree-export.conf

```
/*
 * Topic:   EVPN E-Tree (root/leaf) E-LAN service
 * Seen on:
 *   Junos: ma4_mx204 ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - `instance-type evpn` with a single-VLAN body and the
 *    `evpn-etree` knob inside `protocols evpn` — that knob
 *    enables MEF 6.2 E-Tree (rooted-multipoint) semantics on
 *    top of the standard EVPN-ELAN service.
 *  - Root/leaf role is per-AC, configured on the customer-facing
 *    interface (not in this body); roots can talk to roots and
 *    leaves, leaves cannot talk to other leaves.
 *  - Per-instance scale: 1000 instances per PE on the MX, all
 *    sharing the same ESI-bearing AE bundle on the access side.
 *  - `vlan-id $VLAN` — single-VLAN-per-instance (not vlan-id none),
 *    which distinguishes this from the port-based / mac-vrf
 *    vlan-bundle shape.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *  - junos/interfaces/ethernet-bridge.conf
 *  - junos/policy-options/policy-statement/ps-export-l2-color.conf
 *
 * JVD service mapping:
 *   1050 instances total (high 1050 / med 0 / low 0)
 *   On devices: ma4_mx204 (1000), ma5_mx204 (1000), mse1_mx304 (1000), mse2_mx304 (1000), an3_acx7100-48l (51), meg1_acx7100-32c (51), +5 more
 *   Example: evpn_group_80_1 (RD 1.1.0.16:8001, RT target:63536:8001)
 *     ma4_mx204  xe-0/1/4.2000
 *     ma5_mx204  xe-0/1/4.2000
 *     mse1_mx304  ae10.2000 00:11:11:11:11:11:11:20:01:01 A-A
 *     mse2_mx304  ae10.2000 00:11:11:11:11:11:11:20:01:01 A-A
 *
 * Variables (example values from mse1_mx304 / evpn_group_80_1):
 *   $INSTANCE_NAME    e.g. evpn_group_80_1
 *   $AC_INTF          e.g. ae10
 *   $UNIT             e.g. 2000   (matches $VLAN)
 *   $VLAN             e.g. 2000
 *   $LOOPBACK_V4      e.g. 1.1.0.10
 *   $RD_SUB_ASSIGNED  e.g. 8001
 *   $RT_AS            e.g. 63536
 *   $RT_ID            e.g. 8001
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn;
        protocols {
            evpn {
                interface $AC_INTF.$UNIT;
                evpn-etree;
            }
        }
        vlan-id $VLAN;
        interface $AC_INTF.$UNIT;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/routing-instances/evpn-etree/ri-evpn-etree.conf

```
/*
 * Topic:   EVPN E-Tree (root/leaf) E-LAN service without a vrf-export policy
 * Seen on:
 *   Junos: ma4_mx204 ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - `instance-type evpn` with a single-VLAN body and the `evpn-etree` knob
 *    inside `protocols evpn`, enabling MEF 6.2 E-Tree (rooted-multipoint)
 *    semantics on top of the standard EVPN-ELAN service.
 *  - Route advertisement is governed solely by `vrf-target` — the instance
 *    carries no `vrf-export` statement, so no per-instance export
 *    policy-statement is referenced and none needs to exist for this
 *    instance to be complete.
 *  - Root/leaf role is per-AC, configured on the customer-facing interface
 *    (not in this body); roots reach roots and leaves, leaves cannot reach
 *    other leaves.
 *  - `vlan-id $VLAN` — single-VLAN-per-instance (not vlan-id none), which
 *    distinguishes this from the port-based / mac-vrf vlan-bundle shape.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *  - junos/interfaces/ethernet-bridge.conf
 *
 * Variables (example values from mse1_mx304 / evpn_group_80_1000):
 *   $INSTANCE_NAME    e.g. evpn_group_80_1000
 *   $AC_INTF          e.g. ae10
 *   $UNIT             e.g. 2999   (matches $VLAN)
 *   $VLAN             e.g. 2999
 *   $LOOPBACK_V4      e.g. 1.1.0.10
 *   $RD_SUB_ASSIGNED  e.g. 9000
 *   $RT_AS            e.g. 63536
 *   $RT_ID            e.g. 9000
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn;
        protocols {
            evpn {
                interface $AC_INTF.$UNIT;
                evpn-etree;
            }
        }
        vlan-id $VLAN;
        interface $AC_INTF.$UNIT;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni-export.conf

```
/*
 * Topic:   EVPN FXC (Flexible Cross-Connect, VLAN-unaware) — four AC UNIs in one service-id, with vrf-export
 * Seen on:
 *   Junos: mse1_mx304
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - `instance-type evpn-vpws` with the FXC knob
 *    `flexible-cross-connect-vlan-unaware` and a single `group fxc { ... }`
 *    block. Every `interface <ifd.unit>` line inside the group is a UNI
 *    bundled into the same service-id; the bundle is VLAN-unaware so the
 *    customer 802.1Q tags are preserved end-to-end.
 *  - Four UNIs, all on the same physical UNI. This is the dominant FXC arity
 *    in the JVD. The three-UNI form runs on the EVO access node only — see
 *    evo/routing-instances/evpn-vpws/ri-evpn-fxc-3-uni-export.conf; UNI count
 *    is part of the instance body, so each arity is its own form.
 *  - `vrf-export` binds the per-service export policy on top of the direct
 *    route target. The otherwise identical target-only form is
 *    junos/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni.conf.
 *  - `service-id { local <N>; remote <M>; }` defines the EVPN pseudowire
 *    endpoint pair — the local/remote integers are swapped on the peer PE.
 *  - No `vlan-id`, no `vrf-table-label`, no `interface` at the instance level
 *    (UNIs live entirely inside the FXC group).
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *  - junos/groups/gr-edge-intf.conf
 *  - junos/policy-options/policy-statement/ps-export-l2-color.conf
 *
 * JVD service mapping:
 *   240 instances on mse1_mx304, 219 on an3_acx7100-48l.
 *   Example: evpn_group_40_100 (RD 1.1.0.10:500, RT target:63535:500)
 *     mse1_mx304  et-0/0/4.1899 / .2399 / .998 / .999
 *
 * Variables (example values from mse1_mx304 / evpn_group_40_100):
 *   $INSTANCE_NAME    e.g. evpn_group_40_100
 *   $AC_INTF          e.g. et-0/0/4   (or aeNN for multihomed UNIs)
 *   $UNIT_A           e.g. 1899
 *   $UNIT_B           e.g. 2399
 *   $UNIT_C           e.g. 998
 *   $UNIT_D           e.g. 999
 *   $SVC_ID_LOCAL     e.g. 2
 *   $SVC_ID_REMOTE    e.g. 1
 *   $LOOPBACK_V4      e.g. 1.1.0.10
 *   $RD_SUB_ASSIGNED  e.g. 500
 *   $RT_AS            e.g. 63535
 *   $RT_ID            e.g. 500
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                flexible-cross-connect-vlan-unaware;
                group fxc {
                    interface $AC_INTF.$UNIT_A;
                    interface $AC_INTF.$UNIT_B;
                    interface $AC_INTF.$UNIT_C;
                    interface $AC_INTF.$UNIT_D;
                    service-id {
                        local $SVC_ID_LOCAL;
                        remote $SVC_ID_REMOTE;
                    }
                }
            }
        }
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni.conf

```
/*
 * Topic:   EVPN FXC (Flexible Cross-Connect, VLAN-unaware) — four AC UNIs in one service-id, route target only
 * Seen on:
 *   Junos: mse1_mx304
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - `instance-type evpn-vpws` with the FXC knob
 *    `flexible-cross-connect-vlan-unaware` and a single `group fxc { ... }`
 *    block. Every `interface <ifd.unit>` line inside the group is a UNI
 *    bundled into the same service-id; the bundle is VLAN-unaware so the
 *    customer 802.1Q tags are preserved end-to-end.
 *  - Route control is DIRECT route-target membership only — there is no
 *    `vrf-export`, so the service carries no per-service export policy and no
 *    transport-colour community. Under the library's route-control grammar
 *    the target-only form takes no suffix; the policy-bearing sibling is
 *    junos/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni-export.conf.
 *  - Four UNIs, all on the same physical UNI. UNI count is part of the
 *    instance body, so each arity is its own form.
 *  - `service-id { local <N>; remote <M>; }` defines the EVPN pseudowire
 *    endpoint pair — the local/remote integers are swapped on the peer PE.
 *  - No `vlan-id`, no `vrf-table-label`, no `interface` at the instance level
 *    (UNIs live entirely inside the FXC group).
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *  - junos/groups/gr-edge-intf.conf
 *
 * JVD service mapping:
 *   250 instances on mse1_mx304, 250 on an3_acx7100-48l.
 *   Example: evpn_group_40_251 (RD 1.1.0.10:651, RT target:63535:651)
 *     mse1_mx304  et-0/0/4.2050 / .2550 / .1300 / .1301
 *
 * Variables (example values from mse1_mx304 / evpn_group_40_251):
 *   $INSTANCE_NAME    e.g. evpn_group_40_251
 *   $AC_INTF          e.g. et-0/0/4   (or aeNN for multihomed UNIs)
 *   $UNIT_A           e.g. 2050
 *   $UNIT_B           e.g. 2550
 *   $UNIT_C           e.g. 1300
 *   $UNIT_D           e.g. 1301
 *   $SVC_ID_LOCAL     e.g. 2
 *   $SVC_ID_REMOTE    e.g. 1
 *   $LOOPBACK_V4      e.g. 1.1.0.10
 *   $RD_SUB_ASSIGNED  e.g. 651
 *   $RT_AS            e.g. 63535
 *   $RT_ID            e.g. 651
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                flexible-cross-connect-vlan-unaware;
                group fxc {
                    interface $AC_INTF.$UNIT_A;
                    interface $AC_INTF.$UNIT_B;
                    interface $AC_INTF.$UNIT_C;
                    interface $AC_INTF.$UNIT_D;
                    service-id {
                        local $SVC_ID_LOCAL;
                        remote $SVC_ID_REMOTE;
                    }
                }
            }
        }
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf

```
/*
 * Topic:   EVPN-VPWS routing-instance (MEF E-Line)
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - instance-type evpn-vpws
 *  - Single attachment-circuit (ae11.2400) with vpws-service-id local/remote
 *    pair (1 / 2) — the EVPN-VPWS service identifier exchanged via
 *    EVPN Type-1 routes
 *  - Per-instance route-distinguisher and vrf-target define the VPN scope
 *  - The matching attachment-circuit interface carries vlan-ccc
 *    encapsulation and an ESI for all-active multihoming
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *  - junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based.conf
 *
 * JVD service mapping:
 *   400 instances total (high 400 / med 0 / low 0)
 *   On devices: an1_mx204 (400), an2_acx5448 (400), an3_acx7100-48l (400), ma1-1_acx7024 (400), ma1-2_acx7024 (400)
 *   Example: evpn_group_30_2400 (RD 1.1.0.0:2400, RT target:63535:2400)
 *     an1_mx204  ae11.2400 00:10:11:11:11:11:01:00:00:00 A-A
 *     an2_acx5448  ae11.2400 00:10:11:11:11:11:01:00:00:00 A-A
 *     an3_acx7100-48l  ae11.2400 00:10:11:11:11:11:01:00:00:00 A-A
 *     ma1-1_acx7024  ae12.2400 00:10:11:11:50:12:03:00:00:00 A-A
 *     (+1 more endpoints)
 *
 * Variables (example values from an1_mx204):
 *   $INSTANCE_NAME       e.g. evpn_group_30_2400
 *   $AC_INTF             e.g. ae11.2400
 *   $LOOPBACK_V4         e.g. 1.1.0.0
 *   $RD_SUB_ASSIGNED     e.g. 2400
 *   $RT_ID               e.g. 2400
 *   $RT_AS               e.g. 63535
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
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/routing-instances/l2vpn/ri-l2vpn-kompella.conf

```
/*
 * Topic:   BGP-signalled (Kompella) L2VPN, port-based
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   (none)
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
 *  - junos/groups/gr-fatpw-label.conf
 *  - variant:mebs-bgp-overlay families=l2vpn
 *
 * JVD service mapping:
 *   201 instances total (high 102 / med 99 / low 0)
 *   On devices: an3_acx7100-48l (201), ma5_mx204 (201)
 *   Example: L2VPN_PORT_BASED (RD 63535:6500, RT target:63535:6500)
 *     an3_acx7100-48l  et-0/0/8.0
 *     ma5_mx204  xe-0/1/2.0
 *
 * Variables (example values from ma5_mx204):
 *   $INSTANCE_NAME           e.g. L2VPN_PORT_BASED
 *   $L2VPN_SITE              e.g. r19
 *   $L2VPN_LOCAL_SITE_ID     e.g. 1119
 *   $L2VPN_REMOTE_SITE_ID    e.g. 1102
 *   $AC_INTF                 e.g. xe-0/1/2.0
 *   $RD                      e.g. 60535:8500
 *   $RT                      e.g. 63535:6500
 */
routing-instances {
    apply-groups GR-FATPW-LABEL;
    $INSTANCE_NAME {
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

## junos/routing-instances/l3vpn/ri-internet-vrf-export.conf

```
/*
 * Topic:   Internet VRF with dual-stack PE-CE eBGP and discard defaults
 * Seen on:
 *   Junos: mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - `instance-type vrf` holding the Internet default for the metro: the
 *    instance originates `0.0.0.0/0` and `::/0` locally as discard routes
 *    rather than learning them, so the default exists even with no upstream.
 *  - The IPv6 default is placed in the instance's own inet6 table through
 *    `rib ${INSTANCE_NAME}.inet6.0`, because `routing-options static` in a VRF
 *    reaches the inet.0 table only.
 *  - Dual-stack PE-CE eBGP: `group v4Ixia` carries `family inet` and
 *    `group v6Ixia` carries `family inet6`, both with `any` and `as-override`
 *    against the same customer AS.
 *  - `auto-export` lets the customer VRFs on this PE pull the default from
 *    this instance locally, without it crossing the core.
 *  - `vrf-export` tags the defaults on the way out; `vrf-target import`
 *    provides import-only route-target membership, so the instance accepts
 *    customer routes without advertising its own target.
 *  - `vrf-table-label` gives one MPLS label for the whole instance.
 *
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-inet-vrf-default.conf
 *
 * Variables (example values from mse2_mx304):
 *   $INSTANCE_NAME    e.g. INTERNET-VRF
 *   $ROUTER_ID        e.g. 1.1.0.11
 *   $AC_INTF          e.g. xe-0/0/15:2.2001
 *   $CE_PEER_V4       e.g. 22.2.0.2
 *   $PE_LOCAL_V4      e.g. 22.2.0.1
 *   $CE_PEER_V6       e.g. 2001::22:2:0:2
 *   $PE_LOCAL_V6      e.g. 2001::22:2:0:1
 *   $AS_CUST          e.g. 64514
 *   $RD               e.g. 1.1.0.11:63536
 *   $EXPORT_POL       e.g. INET-VRF-DEFAULT_1
 *   $RT_AS            e.g. 63536
 *   $RT_ID            e.g. 22222
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            rib ${INSTANCE_NAME}.inet6.0 {
                static {
                    route ::/0 discard;
                }
            }
            router-id $ROUTER_ID;
            static {
                route 0.0.0.0/0 discard;
            }
            auto-export;
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
                group v6Ixia {
                    family inet6 {
                        any;
                    }
                    neighbor $CE_PEER_V6 {
                        local-address $PE_LOCAL_V6;
                        peer-as $AS_CUST;
                        as-override;
                    }
                }
            }
        }
        interface $AC_INTF;
        route-distinguisher $RD;
        vrf-export $EXPORT_POL;
        vrf-target import target:$RT_AS:$RT_ID;
        vrf-table-label;
    }
}
```

## junos/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy-auto-export.conf

```
/*
 * Topic:   L3VPN VRF with PE-CE eBGP and as-override
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - `instance-type vrf` carrying customer routes; PE-CE eBGP
 *    under `protocols bgp group v4Ixia` with `family inet { any; }`,
 *    `peer-as <CUST_ASN>`, and `as-override` so the customer's
 *    own ASN is rewritten out of AS_PATH on the return direction
 *    (textbook "hub-and-spoke per-customer ASN" workaround).
 *  - `routing-options router-id $ROUTER_ID; auto-export;` —
 *    auto-export pulls routes from sibling VRFs that share RT
 *    import targets (used by the MEBS "shared service" pattern).
 *  - `route-distinguisher $RD;` — an ASN-administrator RD; every
 *    instance of this shape on ma4_mx204 / mse1_mx304 / mse2_mx304
 *    uses administrator `63536`. Each PE assigns a different number
 *    to the same VRF (METRO_BGPv4_L3VPN_1001 is `63536:41001` /
 *    `63536:11001` / `63536:31001`), so an L3VPN prefix appears with
 *    a distinct RD per PE across multihomed sites.
 *  - `vrf-import / vrf-export` point at the per-VRF policies in
 *    junos/policy-options/policy-statement/l3vpn-export-import.conf (named
 *    `${INSTANCE_NAME}-IMPORT` / `-EXPORT`).
 *  - `vrf-table-label` enables one MPLS label per VRF (the common
 *    deployment vs per-prefix labels).
 *
 * Pair with:
 *  - junos/policy-options/policy-statement/l3vpn-export-import.conf
 *  - junos/policy-options/community/cm-l3vpn-bgpv4.conf
 *  - junos/groups/gr-l3vpn.conf
 *  - variant:mebs-bgp-overlay families=inet-vpn
 *  - junos/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf
 *
 * JVD service mapping:
 *   2200 instances total (high 2200 / med 0 / low 0)
 *   On devices: mse2_mx304 (2200), mse1_mx304 (2199), ma4_mx204 (1999), an3_acx7100-48l (200), ma3_acx7100-48l (200)
 *   Example: INTERNET-VRF (RD 1.1.0.11:63536, RT —)
 *     mse2_mx304  xe-0/0/15:2.2001
 *
 * Variables (example values from mse1_mx304 / METRO_BGPv4_L3VPN_1001):
 *   $INSTANCE_NAME    e.g. METRO_BGPv4_L3VPN_1001
 *   $ROUTER_ID        e.g. 1.1.0.10
 *   $AC_INTF          e.g. et-0/0/5.1001
 *   $CE_PEER_V4       e.g. 19.2.0.2
 *   $PE_LOCAL_V4      e.g. 19.2.0.1
 *   $AS_CUST          e.g. 64514
 *   $RD               e.g. 63536:11001
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            router-id $ROUTER_ID;
            auto-export;
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

## junos/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy-next-table.conf

```
/*
 * Topic:   L3VPN VRF with EVPN Type-5, policy-controlled RT plus a default into the Internet VRF
 * Seen on:
 *   Junos: mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - The Internet-attached form of the EVPN-IRB L3VPN service: routing-options
 *    carries `static { route 0.0.0.0/0 next-table INTERNET-VRF.inet.0; }`.
 *  - The VRF resolves its default by looking into the INTERNET-VRF table on the
 *    same device, which makes it a consumer of that Internet VRF.
 *  - The next-table target is literal. INTERNET-VRF is the only validated
 *    target in this JVD.
 *  - Because this device carries Type-5 routes that did not originate locally,
 *    its export policy is the superset form
 *    junos/policy-options/policy-statement/ps-export-l3vpn-nlri-rt5-public.conf,
 *    which re-tags `family evpn` / `nlri-route-type 5` routes as well as the
 *    customer aggregates.
 *  - The instance name is the identity stem for the whole service: instance
 *    METRO_L3VPN_4000 binds PS-METRO_L3VPN_4000-IMPORT and
 *    PS-METRO_L3VPN_4000-EXPORT, which match and stamp community
 *    METRO_L3VPN_4000.
 *  - `multipath { vpn-unequal-cost; }`, `protect core` and `vrf-table-label`
 *    are also injected into every `<METRO_*>` VRF by apply-group GR-L3VPN.
 *
 * Pair with:
 *  - junos/routing-instances/evpn-elan/ri-evpn-elan-irb.conf
 *  - junos/groups/gr-l3vpn.conf
 *  - junos/policy-options/policy-statement/ps-import-l3vpn.conf
 *  - junos/policy-options/policy-statement/ps-export-l3vpn-nlri-rt5-public.conf
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from mse2_mx304 / METRO_L3VPN_4000):
 *   $INSTANCE_NAME    e.g. METRO_L3VPN_4000
 *                     (the import/export policies are named
 *                      PS-${INSTANCE_NAME}-IMPORT / -EXPORT)
 *   $ROUTER_ID        e.g. 1.1.0.11
 *   $IRB_UNIT         e.g. 4000   (selects irb.<unit>)
 *   $RD               e.g. 63300:13000
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            router-id $ROUTER_ID;
            static {
                route 0.0.0.0/0 next-table INTERNET-VRF.inet.0;
            }
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
        vrf-import PS-${INSTANCE_NAME}-IMPORT;
        vrf-export PS-${INSTANCE_NAME}-EXPORT;
        vrf-table-label;
    }
}
```

## junos/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy.conf

```
/*
 * Topic:   L3VPN VRF with EVPN Type-5 (IP-prefix routes), policy-controlled RT
 * Seen on:
 *   Junos: mse1_mx304
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - This snip is the L3 (RT-5) HALF of the JVD's EVPN-IRB pattern.
 *    In this JVD, Type-5 is ALWAYS paired with a matching L2 EVPN
 *    instance on the same `irb.<N>` — on MX that L2 partner is
 *    `instance-type virtual-switch` (see
 *    junos/routing-instances/evpn-elan/ri-evpn-elan-irb.conf), and on EVO
 *    it is `instance-type mac-vrf` with `l3-interface irb.<N>`
 *    (see evo/routing-instances/evpn-elan/ri-evpn-elan-irb.conf). The EVI then
 *    advertises both RT-2 (MAC+IP from learned hosts via the L2
 *    instance) and RT-5 (the IRB subnet, silent-host /32s, and
 *    any VRF static/learned prefixes via this VRF). "Pure" RT-5
 *    (VRF only, no L2 instance) is not deployed here.
 *  - The VRF's `interface irb.<N>` ties this VRF to the matching
 *    L2 service (MAC-VRF on EVO, virtual-switch on Junos) whose
 *    `l3-interface` / `routing-interface` is the same `irb.<N>`.
 *  - `advertise direct-nexthop encapsulation mpls` — emit Type-5
 *    routes with the local PE as direct next-hop, MPLS-encapsulated
 *    over the SR-MPLS underlay (no VXLAN here — this is a
 *    metro-MPLS deployment).
 *  - vrf-table-label — per-VRF aggregate label so the egress PE
 *    can do an L3 lookup on the inner header (standard IRB pattern).
 *  - vrf-import / vrf-export point at the per-VRF policies
 *    PS-${INSTANCE_NAME}-IMPORT / -EXPORT. Route control is by POLICY
 *    only — there is no `vrf-target`, which is what the `vrf-policy`
 *    element of the name records. The sibling form that adds a direct
 *    RT is evo/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy-rt.conf;
 *    the form that also points its default into the Internet VRF is
 *    junos/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy-next-table.conf.
 *  - The instance name is the identity stem for the whole service:
 *    instance METRO_L3VPN_4000 binds PS-METRO_L3VPN_4000-IMPORT and
 *    PS-METRO_L3VPN_4000-EXPORT, which match and stamp community
 *    METRO_L3VPN_4000.
 *  - `multipath { vpn-unequal-cost; }`, `protect core` and
 *    `vrf-table-label` are also injected into every `<METRO_*>` VRF by
 *    apply-group GR-L3VPN, which both devices apply at the
 *    routing-instances hierarchy level.
 *
 * Pair with:
 *  - junos/routing-instances/evpn-elan/ri-evpn-elan-irb.conf
 *  - junos/groups/gr-l3vpn.conf
 *  - junos/policy-options/policy-statement/ps-import-l3vpn.conf
 *  - junos/policy-options/policy-statement/ps-export-l3vpn-public.conf
 *  - junos/routing-instances/l3vpn/ri-l3vpn-irb.conf
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * JVD service mapping:
 *   50 instances total (high 50 / med 0 / low 0)
 *   On devices: an3_acx7100-48l (50), meg1_acx7100-32c (50), meg2_acx7509 (50), mse1_mx304 (50), mse2_mx304 (50)
 *   Example: METRO_L3VPN_4000 (RD 63000:13000, RT target:61535:13000)
 *     an3_acx7100-48l
 *     meg1_acx7100-32c
 *     meg2_acx7509
 *     mse1_mx304
 *     (+1 more endpoints)
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
        vrf-import PS-${INSTANCE_NAME}-IMPORT;
        vrf-export PS-${INSTANCE_NAME}-EXPORT;
        vrf-table-label;
    }
}
```

## junos/routing-instances/l3vpn/ri-l3vpn-irb.conf

```
/*
 * Topic:   L3VPN with IRB
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - The L3 half of the EVPN-IRB pair: the VRF terminates the IRB and performs
 *    egress L3 lookups for MAC-routed traffic, while the paired EVPN instance
 *    advertises the host /32s and the IRB subnet as RT-2 MAC+IP routes.
 *  - `vrf-target` applies the route target directly, so no import or export
 *    policy is involved.
 *  - `vrf-table-label` is the only other VPN plumbing; routing-options carries
 *    just `router-id`, and `multipath { vpn-unequal-cost; }` is inherited from
 *    apply-group `GR-L3VPN` on Junos PEs.
 *  - Same service family as `ri-l3vpn-evpn-vrf-policy.conf`: this is
 *    the slim variant, that one is the explicit RT-5 variant.
 *
 * Pair with:
 *  - junos/routing-instances/evpn-elan/ri-evpn-elan-irb.conf
 *  - junos/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy.conf
 *  - junos/groups/gr-l3vpn.conf
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * JVD service mapping:
 *   75 instances total (high 75 / med 0 / low 0)
 *   On devices: an3_acx7100-48l (75), meg1_acx7100-32c (75), meg2_acx7509 (75), mse1_mx304 (75), mse2_mx304 (75)
 *   Example: METRO_L3VPN_4000 (RD 63000:13000, RT target:61535:13000)
 *     an3_acx7100-48l
 *     meg1_acx7100-32c
 *     meg2_acx7509
 *     mse1_mx304
 *     (+1 more endpoints)
 *
 * Variables (example values from mse1_mx304 / METRO_L3VPN_4050):
 *   $INSTANCE_NAME    e.g. METRO_L3VPN_4050
 *   $ROUTER_ID        e.g. 1.1.0.10
 *   $IRB_UNIT         e.g. 4050   (selects irb.<unit>)
 *   $RD               e.g. 64400:15000
 *   $RT_AS            e.g. 51535
 *   $RT_ID            e.g. 15000
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            router-id $ROUTER_ID;
        }
        interface irb.$IRB_UNIT;
        route-distinguisher $RD;
        vrf-target target:$RT_AS:$RT_ID;
        vrf-table-label;
    }
}
```

## junos/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf

```
/*
 * Topic:   L3VPN VRF with PE-CE OSPF
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   ma3_acx7100-48l
 *
 * Highlights:
 *  - `instance-type vrf` carrying customer routes; PE-CE OSPF
 *    under `protocols ospf area 0.0.0.0 interface <AC>` with
 *    `interface-type p2p` (no DR/BDR election on the PE-CE link).
 *  - `routing-options router-id $ROUTER_ID; auto-export;` —
 *    same shared-service infra as the BGP-peering sibling.
 *  - Customer's OSPF LSAs are translated to BGP-VPN routes via
 *    Junos's automatic per-instance OSPF↔BGP redistribution
 *    (no explicit policy needed for type-3 / external translation
 *    once `auto-export` is set in a shared-RT context).
 *  - `vrf-import / vrf-export` point at the per-VRF policies in
 *    junos/policy-options/policy-statement/l3vpn-export-import.conf (named
 *    `${INSTANCE_NAME}-IMPORT` / `-EXPORT`).
 *
 * Pair with:
 *  - junos/policy-options/policy-statement/l3vpn-export-import.conf
 *  - junos/groups/gr-l3vpn.conf
 *  - variant:mebs-bgp-overlay families=inet-vpn
 *  - junos/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy-auto-export.conf
 *
 * JVD service mapping:
 *   1100 instances total (high 1100 / med 0 / low 0)
 *   On devices: mse1_mx304 (1100), mse2_mx304 (1100), ma4_mx204 (1000), an3_acx7100-48l (100), ma3_acx7100-48l (100)
 *   Example: METRO_L3VPN_1 (RD 63536:41, RT —)
 *     ma4_mx204  xe-0/1/4.1
 *     mse1_mx304  et-0/0/5.1
 *     mse2_mx304  xe-0/0/15:0.1
 *
 * Variables (example values from mse1_mx304 / METRO_L3VPN_1):
 *   $INSTANCE_NAME    e.g. METRO_L3VPN_1
 *   $ROUTER_ID        e.g. 1.1.0.10
 *   $AC_INTF          e.g. et-0/0/5.1
 *   $RD               e.g. 63536:11
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            router-id $ROUTER_ID;
            auto-export;
        }
        protocols {
            ospf {
                area 0.0.0.0 {
                    interface $AC_INTF {
                        interface-type p2p;
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

## junos/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy.conf

```
/*
 * Topic:   L3VPN VRF with PE-CE OSPF, policy-controlled RT, no auto-export
 * Seen on:
 *   Junos: ma4_mx204
 *   EVO:   (none)
 *
 * Highlights:
 *  - PE-CE routing is OSPF: the VRF runs `area 0.0.0.0` with the attachment
 *    circuit as a point-to-point interface, so customer routes arrive as OSPF
 *    and leave as VPN-IPv4 via the export policy.
 *  - Route control is by POLICY only — `vrf-import` + `vrf-export`, no
 *    `vrf-target`, which is what the `vrf-policy` element of the name records.
 *  - No `auto-export`. That is the discriminator against
 *    junos/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf, which is otherwise the same
 *    body and carries `routing-options { auto-export; }`. Without it the VRF
 *    does not leak routes to other local VRFs; reachability between local
 *    instances comes only from the RT policy pair.
 *  - vrf-table-label — per-VRF aggregate label so the egress PE can do an L3
 *    lookup on the inner header.
 *  - The instance name is the identity stem: instance METRO_L3VPN_1 binds
 *    METRO_L3VPN_1-IMPORT and METRO_L3VPN_1-EXPORT.
 *  - `multipath { vpn-unequal-cost; }`, `protect core` and `vrf-table-label`
 *    are also injected into every `<METRO_*>` VRF by apply-group GR-L3VPN.
 *
 * Pair with:
 *  - junos/groups/gr-l3vpn.conf
 *  - junos/policy-options/policy-statement/l3vpn-export-import.conf
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * JVD service mapping:
 *   1000 instances on ma4_mx204.
 *   Example: METRO_L3VPN_1 (RD 63536:41)
 *     ma4_mx204  xe-0/1/4.1
 *
 * Variables (example values from ma4_mx204 / METRO_L3VPN_1):
 *   $INSTANCE_NAME   e.g. METRO_L3VPN_1
 *                    (the import/export policies are named
 *                     ${INSTANCE_NAME}-IMPORT / -EXPORT)
 *   $ROUTER_ID       e.g. 1.1.0.16
 *   $AC_INTF         e.g. xe-0/1/4.1
 *   $RD              e.g. 63536:41
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            router-id $ROUTER_ID;
        }
        protocols {
            ospf {
                area 0.0.0.0 {
                    interface $AC_INTF {
                        interface-type p2p;
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

## junos/routing-instances/vpls/ri-bgp-vpls-export.conf

```
/*
 * Topic:   BGP-VPLS (Kompella VPLS, RFC 4761) via virtual-switch
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   (none)
 *
 * Highlights:
 *  - instance-type virtual-switch with `protocols vpls` carrying
 *    `site $NAME { site-identifier $ID; }` — this site/site-id
 *    pair is what makes it BGP-VPLS rather than LDP-VPLS.
 *  - BGP NLRI exchange (family l2vpn signaling) replaces LDP
 *    targeted-session signalling; site-id / site-range /
 *    label-block-size on each PE compute the PE-to-PE pseudowire
 *    label blocks (RFC 4761 §3 math).
 *  - `instance-type virtual-switch` lets one routing-instance hold multiple
 *    bridge-domains, each with its own VLAN, for vlan-aware service
 *    multiplexing on MX.
 *  - bridge-options no-normalization — the AC keeps its customer
 *    VLAN tag rather than being re-tagged at the BD boundary
 *    (vlan-aware passthrough mode).
 *
 * Pair with:
 *  - junos/groups/gr-fatpw-label.conf
 *  - junos/policy-options/policy-statement/ps-export-l2-color.conf
 *  - variant:mebs-bgp-overlay families=l2vpn
 *
 * JVD service mapping:
 *   300 instances total (high 300 / med 0 / low 0)
 *   On devices: ma5_mx204 (300), an3_acx7100-48l (200), meg1_acx7100-32c (200), ma1-2_acx7024 (100)
 *   Example: vpls_group_102_400 (RD 63535:1093000, RT target:63535:1093000)
 *     an3_acx7100-48l  et-0/0/0.400
 *     ma5_mx204  xe-0/1/4.400
 *     meg1_acx7100-32c  et-0/0/26:0.400
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

## junos/routing-options/flex-algorithm.conf

```
/*
 * Topic:   Flex-Algo definitions — FA 128 (delay-optimised) and FA 129 (TE-metric), each bound to a transport class by colour.
 * Seen on:
 *   Junos: mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - FA 128: delay-metric SPF, includes admin-group `green`, colour 4000.
 *  - FA 129: te-metric SPF, includes admin-group `blue`, colour 6000.
 *  - This is the Flex-Algo DEFINITION carried by the FAD-advertiser nodes
 *    (metro-core / MSE); other transport nodes carry only the slim
 *    reference (`colour` + `use-transport-class`) without the definition.
 *  - `use-flex-algorithm-prefix-metric` + `use-transport-class` install the
 *    FA-derived path so a service's colour community resolves over it.
 *  - The `green`/`blue` admin-groups are defined in transport/mpls-segment-
 *    routing.conf; ISIS advertises participation in protocols/isis-srmpls-tilfa.conf.
 *
 * Pair with:
 *  - junos/routing-options/transport-class.conf    (maps colour 4000/6000 to gold/bronze)
 *  - junos/protocols/mpls-segment-routing.conf (defines admin-groups green/blue)
 *  - junos/protocols/isis-srmpls-tilfa.conf  (ISIS carries flex-algorithm [128 129])
 *
 * Variables: none. FA numbers, metric types, admin-group colours, and the
 *            colour values are the JVD-wide abstraction and are left literal.
 */
routing-options {
    flex-algorithm 128 {
        definition {
            metric-type delay-metric;
            spf;
            use-flex-algorithm-prefix-metric;
            priority 0;
            admin-group include-any green;
        }
        color 4000;
        use-transport-class;
    }
    flex-algorithm 129 {
        definition {
            metric-type te-metric;
            spf;
            use-flex-algorithm-prefix-metric;
            priority 0;
            admin-group include-any blue;
        }
        color 6000;
        use-transport-class;
    }
}
```

## junos/routing-options/forwarding-table.conf

```
/*
 * Topic:   Forwarding-table export + ECMP/next-hop behaviour — installs per-packet load balancing and chained composite next-hops.
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - This is the services-edge PE form (the richest variant). The
 *    forwarding-table stanza is strongly role-dependent across this JVD;
 *    other roles carry reduced subsets (e.g. mdr2_mx10003 carries only
 *    `export pplb`; access nodes omit dynamic-list-next-hop / ecmp-fast-
 *    reroute / evpn-egress-link-protection). A full role-variant model is
 *    a post-extraction follow-up.
 *  - `export $PPLB_NAME` applies the per-packet load-balance policy to the
 *    forwarding table (ECMP across equal-cost paths). The policy name is
 *    `pplb` on most nodes and `PS-PPLB` on some EVO nodes.
 *  - `ecmp-fast-reroute` + `evpn-egress-link-protection` for fast local repair.
 *  - `chained-composite-next-hop ingress` enables scalable next-hop sharing
 *    for l2vpn / l2ckt / evpn / l3vpn service families.
 *
 * Pair with:
 *  - junos/policy-options/policy-statement/per-packet-load-balance.conf  (defines the pplb policy)
 *
 * Variables:
 *   $PPLB_NAME   e.g. pplb
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
        dynamic-list-next-hop;
        evpn-egress-link-protection;
        ecmp-fast-reroute;
        chained-composite-next-hop {
            ingress {
                l2vpn;
                l2ckt;
                evpn;
                l3vpn;
            }
        }
    }
}
```

## junos/routing-options/rib-group-remote-loopbacks-mse.conf

```
/*
 * Topic:   RIB group RG-REMOTE-LOOPBACKS for remote loopback resolution
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - As-deployed RG-REMOTE-LOOPBACKS rib-group, carried by every PE that
 *    resolves remote loopbacks, on both OS families.
 *
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf
 *
 * Variables: none
 */
routing-options {
    rib-groups {
        RG-REMOTE-LOOPBACKS {
            import-rib [ inet.3 inet.0 inet6.3 ];
            import-policy PS-REMOTE-LOOPBACKS;
        }
    }
}
```

## junos/routing-options/rib-groups.conf

```
/*
 * Topic:   RIB groups — leak local and remote loopbacks so coloured service next-hops resolve.
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204 mdr2_mx10003
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - RG-LOCAL-LOOPBACK imports lo0 routes into inet.0/inet.3 using
 *    PS-LOCAL-LOOPBACK. This is the JVD-wide common form.
 *  - RG-REMOTE-LOOPBACKS leaks BGP-learned remote loopbacks across
 *    inet.3/inet.0/inet6.3 using PS-REMOTE-LOOPBACKS.
 *  - Role variant: the services-edge PE nodes (mse1_mx304, mse2_mx304) also
 *    import the per-colour transport-class RIBs (junos-rti-tc-4000/6000.inet.3)
 *    into RG-LOCAL-LOOPBACK; captured for a future PE-role snip.
 *
 * Pair with:
 *  - junos/routing-options/transport-class.conf   (defines the colour transport classes)
 *  - junos/policy-options/policy-statement/loopback-rib-leak.conf    (defines PS-LOCAL-LOOPBACK / PS-REMOTE-LOOPBACKS)
 *
 * Variables: none. RIB-group names, RIB names, and import-policy names are
 *            the JVD-wide abstraction and are left literal.
 */
routing-options {
    rib-groups {
        RG-LOCAL-LOOPBACK {
            import-rib [ inet.0 inet.3 ];
            import-policy PS-LOCAL-LOOPBACK;
        }
        RG-REMOTE-LOOPBACKS {
            import-rib [ inet.3 inet.0 inet6.3 ];
            import-policy PS-REMOTE-LOOPBACKS;
        }
    }
}
```

## junos/routing-options/transport-class.conf

```
/*
 * Topic:   Transport-class definitions — bind BGP colour communities to Flex-Algo transport classes for colour-based (SR) forwarding.
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 ma4_mx204 ma5_mx204 mdr2_mx10003
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Two transport classes: `gold` (colour 4000) and `bronze` (colour 6000).
 *    `auto-create` lets additional colours map without an explicit stanza.
 *  - Each class's `tunnel-egress end-point` is the local transport loopback
 *    the colour-tagged path terminates on. This is the JVD-wide common form.
 *  - Colour 4000 resolves over Flex-Algo 128 (delay), colour 6000 over
 *    Flex-Algo 129 (TE) — see routing-options/flex-algorithm.conf.
 *  - Role variant: the services-edge PE nodes (mse1_mx304, mse2_mx304) add a
 *    second anycast `end-point` under the bronze class to anchor a shared
 *    egress; captured for a future PE-role snip, not in this common form.
 *
 * Pair with:
 *  - junos/routing-options/flex-algorithm.conf
 *  - junos/protocols/isis-srmpls-tilfa.conf
 *
 * Variables (example values from ma4_mx204):
 *   $TC_EGRESS   e.g. 1.1.0.16   (this node's transport-class egress loopback)
 */
routing-options {
    transport-class {
        auto-create;
        name gold {
            color 4000;
            tunnel-egress {
                end-point $TC_EGRESS;
            }
        }
        name bronze {
            color 6000;
            tunnel-egress {
                end-point $TC_EGRESS;
            }
        }
    }
}
```

## _variables.md

# Snippet variable glossary

All `.conf` files under `junos/` and `evo/` are templates: identifiers
that vary between deployments are written as `$VAR` (or `${VAR}` only
when the placeholder is glued to an adjacent letter or digit and the
boundary would otherwise be ambiguous).

Render a snippet by substituting each `$VAR` / `${VAR}` placeholder with your
deployment's value. The placeholders each snippet uses are listed in its
`Variables:` header and in the glossary below.

The variables fall into a few groups.

## Identity / topology

| Variable               | What it is                                                                           | Example value                |
|------------------------|--------------------------------------------------------------------------------------|------------------------------|
| `$AS_CUST`             | Customer-facing eBGP AS used by PE-CE BGP and as-override.                           | `64514`                      |
| `$LOOPBACK_V4`         | This PE's lo0 IPv4 (used as RD-prefix and BGP next-hop).                             | `1.1.0.17`                   |
| `$LOOPBACK_ANYCAST_V4` | Shared anycast lo0 IPv4 owned by more than one node.                                 | `1.1.10.10`                  |
| `$LOOPBACK_SR_V4`      | SR non-zero lo0 IPv4 carrying an SR prefix-SID.                                      | `1.1.10.6`                   |
| `$LOOPBACK_V6`         | This PE's lo0 IPv6.                                                                  | `2001:db8::17`               |
| `$ROUTER_ID`           | router-id (usually equal to `$LOOPBACK_V4`).                                          | `1.1.0.17`                   |
| `$NODE_SID_V4`         | ISIS source-packet-routing IPv4 node-segment index.                                  | `17`                         |
| `$NODE_SID_V6`         | ISIS source-packet-routing IPv6 node-segment index.                                  | `117`                        |
| `$LOOPBACK_SUPERNET`   | IPv4 aggregate that contains the deployment's loopback `/32` addresses (loopback route-leak match). | `1.1.0.0/16` |
| `$LOOPBACK_V4_PFX`     | This node's lo0 IPv4 written with its `/32` prefix length (address form). | `1.1.0.17/32` |
| `$LOOPBACK_V6_PFX`     | This node's lo0 IPv6 written with its `/128` prefix length. | `2001::1:1:0:11/128` |
| `$ISIS_NET`            | ISIS NET (area + system-id) configured on lo0. | `49.0001.0010.0100.0017.00` |

## Neighbours / route reflectors

| Variable               | What it is                                                  | Example value |
|------------------------|-------------------------------------------------------------|---------------|
| `$RR1_V4` / `$RR2_V4`  | Route-reflector loopback IPv4 addresses for the iBGP overlay. | `1.1.0.99`    |
| `$REMOTE_PE_V4`        | Remote PE loopback used in static l2circuit / LDP-VPLS neighbour lines. | `1.1.0.18` |
| `$PRIMARY_LOOPBACK`    | Primary PE loopback targeted by an HSB l2circuit Hub (`l2circuit-hsb-hub`). | `1.1.0.6` |
| `$BACKUP_LOOPBACK`     | Backup PE loopback used in `backup-neighbor` for HSB l2circuit (`l2circuit-hsb-hub`). | `1.1.0.7` |
| `$HUB_LOOPBACK`        | Hub loopback the PE side of an HSB l2circuit points at (`l2circuit-hsb-pe`). | `1.1.0.2` |
| `$TRANSPORT_RR1_V4` / `$TRANSPORT_RR2_V4` | Transport-plane (coloured underlay) route-reflector loopbacks. | `1.1.0.12` |
| `$SVC_RR1_V4` / `$SVC_RR2_V4` | Service-plane (overlay / EVPN) route-reflector loopbacks. | `1.1.0.10` |
| `$TC_EGRESS`          | This node's transport-class egress endpoint loopback. | `1.1.0.17` |

## Interfaces

| Variable               | What it is                                                                       | Example value     |
|------------------------|----------------------------------------------------------------------------------|-------------------|
| `$AC_INTF`             | Customer-facing attachment-circuit unit (with VLAN id when tagged).               | `ae12.2400`       |
| `$AC_PHYS`             | The physical/parent interface the AC unit lives on.                              | `ae12`            |
| `$CORE_INTF`           | Core-facing LAG unit used for ISIS+MPLS underlay.                                | `ae71.0`          |
| `$CORE_PHYS`           | Parent of the core LAG.                                                          | `ae71`            |
| `$LAG_MEMBER`          | A child interface of the LAG (mostly used in member templates).                  | `et-0/0/0`        |
| `$UNIT`                | Logical-unit identifier — the `unit <n>` a construct configures, and the tail when an interface is written `<ifd>.<unit>`. | `3000`            |
| `$UNI_INTF`           | Customer UNI physical interface. | `xe-0/0/3:1` |
| `$AC_INTF_1` / `$AC_INTF_2` | The two attachment-circuit interfaces cross-connected by l2circuit local-switching. | `et-0/0/5` |
| `$PS_INTF`            | Pseudowire-subscriber logical interface. | `ps0` |
| `$ANCHOR_PIC`         | Anchor tunnel PIC (`lt-`) hosting the pseudowire-subscriber device. | `lt-0/0/0` |
| `$CORE_INTF_1` / `$CORE_INTF_2` | Per-core-neighbour core interface units (repeat the stanza per neighbour). | `ae71.0` |
| `$CORE_V4_ADDR` / `$CORE_V6_ADDR` | Core interface IPv4 / IPv6 address. | `10.10.1.121/30` |
| `$CORE_DESC`          | Core interface description. | `"to MA2 ... ae83"` |
| `$LO0_DESC`           | lo0 interface description. | `"MA1.1 Metro Ring Blue"` |
| `$LACP_SYS_ID`        | LACP system-id on a multihomed LAG. | `00:00:00:00:00:01` |
| `$VLAN`               | VLAN id on a tagged unit. | `3000` |
| `$VLAN_BRIDGE`        | vlan-id on a bridge (vlan-bridge) unit. | `300` |
| `$VLAN_UNIT`          | Selects `ae11.<unit>` on the shared edge LAG. | `700` |
| `$UNIT_BRIDGE` / `$UNIT_CCC` | Logical-unit numbers for the bridge / ccc encapsulation units. | `300` / `0` |
| `$IFD`                | Interface device a construct configures or attaches to, independent of its type or topology role — physical, aggregated or pseudowire-subscriber. | `ae11` |
| `$INT_DESC`           | Interface description; the scope is whichever interface the body configures. | `"evpn service IFL"` |
| `$INPUT_VID`          | VLAN id pushed by an `input-vlan-map` when the customer and service-internal VLAN ids differ. | `3800` |
| `$VLAN_LIST`          | VLAN range or list admitted by a `vlan-id-list` interface. | `1000-1001` |
| `$VLAN_OUTER` / `$VLAN_INNER` | Outer and inner tags of a double-tagged (`vlan-tags`) interface. | `225` / `2250` |
| `$COS_INTF`           | Interface to which the class-of-service configuration is applied, physical or aggregated and independent of topology role. | `ae11` |

## Service identifiers

| Variable                  | What it is                                                       | Example value |
|---------------------------|------------------------------------------------------------------|---------------|
| `$INSTANCE_NAME`          | The service-instance name (per-service, often encodes IDs).      | `evpn_group_30_2400` |
| `$RD_SUB_ASSIGNED`        | Route-distinguisher Assigned Number subfield (RD = `$LOOPBACK_V4:$RD_SUB_ASSIGNED`). | `2400`        |
| `$RT_AS`                  | Route-target Administrator subfield; service-scoped, not the node's own AS. | `63535`       |
| `$RT_ID`                  | Route-target Assigned Number (the tail), independent of the variable supplying the Administrator. | `2400`        |
| `$VPWS_SVC_ID_LOCAL`      | EVPN-VPWS local service-id.                                      | `2`           |
| `$VPWS_SVC_ID_REMOTE`     | EVPN-VPWS remote service-id.                                     | `1`           |
| `$VC_ID`                  | l2circuit / VPLS virtual-circuit-id (or `vpls-id`).              | `3000`        |
| `$VC_ID_PRIMARY`          | Primary virtual-circuit-id on an HSB l2circuit Hub.             | `3000`        |
| `$VC_ID_BACKUP`           | Backup-neighbor virtual-circuit-id for hot-standby.              | `4000`        |
| `$L2VPN_SITE`             | Kompella L2VPN site-name.                                        | `r2`          |
| `$L2VPN_LOCAL_SITE_ID`    | Kompella L2VPN site-identifier.                                  | `1102`        |
| `$L2VPN_REMOTE_SITE_ID`   | Kompella L2VPN remote-site-id.                                   | `1119`        |
| `$VLAN_CUST`              | Customer-side (untranslated) VLAN id.                            | `200`         |
| `$VLAN_SP`                | Service-internal (normalised) VLAN id.                           | `2400`        |
| `$VLAN_BD`                | bridge-domain or mac-vrf vlan-id.                                | `4000`        |
| `$ESI`                    | 10-byte ESI (for EVPN multihoming).                              | `00:11:22:33:44:55:66:77:88:01` |
| `$IRB_UNIT`               | irb.X unit number for IRB integration.                           | `4000`        |
| `$BD_NAME`               | bridge-domain / MAC-VRF bridge-domain name. | `V4000` |
| `$SITE_ID`               | Per-site identifier encoded into service instances. | `5` |
| `$SVC_ID_LOCAL` / `$SVC_ID_REMOTE` | FXC / VPWS local & remote service-ids. | `1` / `2` |
| `$UNIT_1` / `$UNIT_2`    | Logical-unit numbers for a two-AC service. | `3000` |
| `$UNIT_A` / `$UNIT_B` / `$UNIT_C` | Logical-unit numbers for a multi-AC service. | `800` |
| `$LABEL_IN` / `$LABEL_OUT` | Static MPLS in / out labels (floating pseudowire). | `1000001` |
| `$RD` / `$RT`            | Full route-distinguisher / route-target value (`AS:id`). | `63535:6500` |
| `$EXPORT_POL` / `$IMPORT_POL` | Per-VRF export / import policy names. | `PS-METRO_L3VPN_2001-EXPORT` |
| `$VRF_EXPORT_POL`        | vrf-export policy name on an EVPN Type-5 VRF. | `evpn_group_90_700` |
| `$CE_PEER_V4` / `$PE_LOCAL_V4` | PE-CE eBGP peer / local IPv4 addresses. | `115.2.0.2` / `115.2.0.1` |
| `$CE_PREFIX_1` / `$CE_PREFIX_2` / `$CE_PREFIX_3` | Customer prefixes matched by per-VRF import/export route-filters. | `13.2.0.0/16` |

## Class of Service

| Variable               | What it is                                                  | Example value |
|------------------------|-------------------------------------------------------------|---------------|
| `$FORWARDING_CLASS`    | Forwarding class a logical unit assigns every packet to. | `REALTIME` |

`$COS_INTF` is the other class-of-service variable; it is listed with the
interfaces above because its value is an interface identifier.

## OAM (CFM)

| Variable               | What it is                                                  | Example value |
|------------------------|-------------------------------------------------------------|---------------|
| `$MD_NAME`             | CFM maintenance-domain name. | `MD_63535` |
| `$MA_ID`               | CFM maintenance-association identifier. | `100` |
| `$MEP_LOCAL`           | Local MEP identifier. | `1002` |
| `$MEP_REMOTE`          | Remote MEP identifier (single-remote form). | `1003` |
| `$MEP_REMOTE_1` / `$MEP_REMOTE_2` | Remote MEP identifiers (multi-remote form). | `1002` / `1006` |

## BGP communities

| Variable               | What it is                                                  | Example value |
|------------------------|-------------------------------------------------------------|---------------|
| `$FABRIC_COMMUNITY_AS`  | **Deployment-scoped.** Administrator AS for fabric community values (fixed per deployment; not the device local AS). | `63535` |
| `$RING_COMMUNITY_AS`    | **Deployment-scoped.** Administrator AS for metro ring-region community values (fixed per deployment). | `63536` |
| `$L3VPN_ID`             | **Service-instance-scoped.** L3VPN service identifier; repeated (consistently bound) in the community name and RT tail. | `1001` |
| `$COLOR_COMMUNITY`      | **Service-instance-scoped.** Name of the community carrying the service transport-colour value. | `map2gold` |
| `$LOOPBACK_COMMUNITY`   | **Device/role-scoped.** Complete `CM-LOOPBACK` value; the administrator follows the node's regional role. | `63535:10000` |

## Group / policy names

Names that are part of the architectural model the JVD documents stay
**literal** — their meaning *is* the abstraction. A label that is proven to
vary across otherwise-identical deployed forms is parameterised instead (see
`$PPLB_NAME`). Kept literal:

- Apply groups: `GR-EDGE-INTF`, `GR-EDGE-INTF-MH`, `GR-CORE-INTF`,
  `GR-ISIS-BCP`, `GR-BGP-BCP`, `GR-FATPW-LB`, `GR-FATPW-LABEL`,
  `GR-L3VPN`, `GR-L2CKT-HS`, `GR-ISIS-BFD`, `GR-LAG-MEMBER`.
- Forwarding-classes, where they are the objects being defined:
  `BEST-EFFORT`, `MEDIUM`, `REALTIME`, `SIG-OAM`, `CONTROL`, `BUSINESS`.
  A body that only *references* a forwarding class uses `$FORWARDING_CLASS`
  when the class referenced varies across otherwise-identical forms.
- Schedulers / scheduler-maps, communities, and per-VRF
  import/export policies are referenced by their own filename
  in the `policy/` and `cos/` snip categories.

| Variable               | What it is                                                  | Example value |
|------------------------|-------------------------------------------------------------|---------------|
| `$PPLB_NAME`           | Per-packet load-balance policy name — a label proven to vary across otherwise-identical deployed forms. | `pplb` (also `PS-PPLB`) |

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
 *   $RD_SUB_ASSIGNED    e.g. 2400
 *   $RT_ID              e.g. 2400
 *   $RT_AS              e.g. 63535
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
| **`minimum`** | Brownfield change. PE already has working IGP/SR underlay AND the BGP overlay signalling the service needs. You just want the new service. | Service routing-instance + AC interface unit + per-VRF policy (L3VPN only). **Nothing else.** |
| **`with-overlay`** | Brownfield-ish. PE has working IGP/SR underlay but you also want to (re)assert the deployed BGP overlay. | `minimum` + the OS-native `transport/bgp-overlay.conf`, **subject to the coverage gate below**. |
| **`as-deployed`** | Greenfield turn-up, lab build, or "give me a working example end-to-end." Mirrors what the JVD validates. | Everything: service + AC + policy + BGP overlay + IGP/SR underlay + apply-group baselines + CoS + OAM + FAT-PW + BGP-CT — **subject to the coverage gate below**. |

> **Greenfield / bootstrap requests** (e.g. "build a new ACX7024 turn-up", "bootstrap a new MX304 PE end-to-end") are always treated as **`as-deployed`** regardless of the user's tier choice.

If the user picks `minimum` and the AI cannot tell whether the overlay activation for the needed address-family is already on the PE, it should call that out in the `Notes:` section ("assumed `family evpn signaling` already configured under `protocols bgp group …`").

### BGP-overlay coverage gate (canonical — every service section refers here)

`transport/bgp-overlay.conf` is **not** a universal per-service prerequisite. Each deployed
iBGP overlay is captured as an OS-native **member of the `mebs-bgp-overlay` variant group**:
the shared `transport/bgp-overlay.conf` still serves the devices listed in its own `Seen on:`,
while device- or role-specific forms use qualified filenames. Every overlay member declares,
via its `Provides:` line, exactly the overlay address-families that device's role runs
(`evpn`, `l2vpn`, `inet-vpn`, `inet6-vpn`, `labeled-unicast`).

Every service section states only its **required signalling family** and points here. Each
service consumer carries a single directed requirement `variant:mebs-bgp-overlay
families=<family>` in its `Pair with:`. The overlay form is **resolved deterministically per
device** — never enumerated by name:

> **Resolve** the overlay for a (target device, target OS, service family) as the **unique**
> member of `mebs-bgp-overlay` such that (a) the member is **native to the target OS**, (b) the
> target device is in that member's exact `Seen on:`, and (c) the member's `Provides:`
> **includes the service family** (all requested families, atomically).

Rules (a service section states only its signalling classification and points here):

1. **`with-overlay`** attaches the resolved overlay member **only when ALL of these hold**:
   (a) the **selected service applies to the target device** — the target is in that service
   snip's exact `Seen on:`; and (b) **exactly one** overlay member resolves per the rule above.
   **Fail closed:** if **zero** members resolve (no deployed overlay form for that device +
   family) or **more than one** resolves, the requested `with-overlay` (or `as-deployed`)
   overlay is **unavailable** — so **generate nothing for it**. You may then offer `minimum` as
   a **separate alternative the user must explicitly confirm**, making clear that `minimum` is
   local-service configuration only and does **not** provide the unavailable remote BGP
   signalling. An **inapplicable** service/device selection (target not in the service's
   `Seen on:`) is **rejected**, not downgraded. **Never** synthesize, generalise, substitute,
   or borrow the other OS form.
2. **The resolved member is always the target device's own role form.** Because the family is
   matched against each member's `Provides:`, a device is never given another role's overlay —
   a mismatched family simply yields zero resolutions and fails closed.
3. **LDP-signalled services never add a BGP overlay** (L2Circuit floating-pw / hot-standby /
   local-switching, LDP-VPLS) — they carry no `variant:` requirement and rely on targeted LDP.
4. **`as-deployed`** includes the BGP overlay under the **same resolution and fail-closed rule**
   as `with-overlay`. For a **BGP-signalled service** (one carrying a `variant:mebs-bgp-overlay`
   requirement), **zero** overlay resolutions means the requested `with-overlay` / `as-deployed`
   form is **unavailable** and **fails closed** — **generate nothing for it** (exactly as rule 1);
   do **not** silently omit the overlay and emit the rest of the baseline. Devices with **no
   top-level deployed BGP group in source** (e.g. **ag1-1_acx7100-32c, ag1-2_acx7100-32c,
   ma2_mx204**) have **no overlay member**, so any BGP-signalled service targeting them fails
   closed on this rule. For any device, do **not** claim a complete `as-deployed` form unless
   every other required form is also validated.

---

## EVPN-VPWS

**minimum** (just the service)
- `services/evpn-vpws.conf`
- `interfaces/lag-esi-multihoming.conf` + `interfaces/vlan-ccc-vlan-map-esi.conf` (multi-homed) **OR** `evo/interfaces/vlan-ccc-vlan-map.conf` (single-homed, EVO only)

**with-overlay** — Signalling: **EVPN** (`family evpn signaling`). BGP overlay **applies** — attach the OS-native `transport/bgp-overlay.conf` per the **BGP-overlay coverage gate** above. If no exact same-OS overlay form applies to the target, this mode is **unavailable** (fail closed) — see the gate.

**as-deployed** (= with-overlay +)
- `transport/isis-srmpls-tilfa.conf`
- `transport/mpls-segment-routing.conf`
- `apply-groups/gr-edge-intf-mh.conf` (or `gr-edge-intf.conf` if SH)
- `apply-groups/gr-core-intf.conf`
- `apply-groups/gr-isis-bcp.conf`
- `apply-groups/gr-bgp-bcp.conf`
- `apply-groups/gr-isis-bfd.conf` (EVO only — MX PEs configure BFD inline under `protocols isis interface`)
- `apply-groups/gr-lag-member.conf`
- `apply-groups/gr-fatpw-lb.conf`
- `apply-groups/gr-fatpw-label.conf`
- `policy/communities.conf` (BGP-CT color communities)
- `cos/forwarding-classes.conf`
- `cos/schedulers.conf`
- `oam/oam-cfm-perf-mon.conf`
- `firewall/policers.conf`

---

## L3VPN (PE-CE eBGP or PE-CE OSPF)

Two PE-CE protocol variants — pick the snip that matches what the
user asked for (default to eBGP if unspecified):

- **L3VPN with PE-CE eBGP** (`as-override`):
  - `services/l3vpn-bgp.conf` (Junos and EVO)
- **L3VPN with PE-CE OSPF** (area 0, `interface-type p2p`):
  - `services/l3vpn-ospf.conf` (Junos and EVO)

**minimum** (just the service + per-VRF policy)
- `services/l3vpn-bgp.conf` **or** `services/l3vpn-ospf.conf`
- `policy/l3vpn-export-import.conf`
- `policy/communities.conf` (only the per-VRF target community — NOT topology tags or BGP-CT colors)
- PE-CE AC unit: no snip in this library captures the L3VPN `family inet` attachment interface

**with-overlay** — Signalling: **inet-vpn** (`family inet-vpn unicast`). BGP overlay **applies** — attach the OS-native `transport/bgp-overlay.conf` per the **BGP-overlay coverage gate** above. If no exact same-OS overlay form applies to the target, this mode is **unavailable** (fail closed) — see the gate.

**as-deployed** (= with-overlay +)
- `transport/isis-srmpls-tilfa.conf`
- `transport/mpls-segment-routing.conf`
- `apply-groups/gr-l3vpn.conf`
- `apply-groups/gr-edge-intf.conf` (or `-mh.conf` if multi-homed CE)
- `apply-groups/gr-core-intf.conf`
- `apply-groups/gr-isis-bcp.conf`
- `apply-groups/gr-bgp-bcp.conf`
- `apply-groups/gr-isis-bfd.conf` (EVO only — MX PEs configure BFD inline under `protocols isis interface`)
- `apply-groups/gr-lag-member.conf`
- `cos/forwarding-classes.conf`
- `cos/schedulers.conf`
- `firewall/policers.conf`
- `policy/communities.conf` (full set incl. BGP-CT colors)

---

## EVPN-ELAN (vlan-based, irb, vlan-bundle, or port-based)

**minimum** (just the service)
- `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf` (EVO) **or**
  `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based.conf` (Junos MX) — or the
  `ri-evpn-elan-irb.conf` / `ri-evpn-elan-vlan-based-export.conf` variant, whichever flavor was requested
- `interfaces/lag-esi-multihoming.conf` (multi-homed) **OR** `evo/interfaces/vlan-bridge-vlan-map.conf` (single-homed, EVO only)

**with-overlay** — Signalling: **EVPN** (`family evpn signaling`). BGP overlay **applies** — attach the OS-native `transport/bgp-overlay.conf` per the **BGP-overlay coverage gate** above. If no exact same-OS overlay form applies to the target, this mode is **unavailable** (fail closed) — see the gate.

**as-deployed** (= with-overlay +)
- `transport/isis-srmpls-tilfa.conf`
- `transport/mpls-segment-routing.conf`
- `apply-groups/gr-edge-intf-mh.conf`
- `apply-groups/gr-core-intf.conf`
- `apply-groups/gr-isis-bcp.conf`
- `apply-groups/gr-bgp-bcp.conf`
- `apply-groups/gr-isis-bfd.conf` (EVO only — MX PEs configure BFD inline under `protocols isis interface`)
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
- L2 / RT-2 half (one of):
    - `evo/routing-instances/evpn-elan/ri-evpn-elan-irb.conf` (EVO — MAC-VRF with `l3-interface irb.<N>`)
    - `junos/routing-instances/evpn-elan/ri-evpn-elan-irb.conf` (Junos MX — virtual-switch with `routing-interface irb.<N>`)
- `routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy.conf` (the L3 / RT-5 half — VRF with `interface irb.<N>` and `protocols evpn ip-prefix-routes`)
- `policy/l3vpn-export-import.conf`
- `policy/communities.conf` (only the per-VRF target community)
- `evo/interfaces/vlan-bridge-vlan-map.conf` (the AC interface that lands in the MAC-VRF's bridge-domain — EVO only)

**with-overlay** — Signalling: **EVPN** (`family evpn signaling`). BGP overlay **applies** — attach the OS-native `transport/bgp-overlay.conf` per the **BGP-overlay coverage gate** above. If no exact same-OS overlay form applies to the target, this mode is **unavailable** (fail closed) — see the gate.

**as-deployed** (= with-overlay +)
- `transport/isis-srmpls-tilfa.conf`
- `transport/mpls-segment-routing.conf`
- `apply-groups/gr-l3vpn.conf`
- `apply-groups/gr-edge-intf-mh.conf`
- `apply-groups/gr-core-intf.conf`
- `apply-groups/gr-isis-bcp.conf`
- `apply-groups/gr-bgp-bcp.conf`
- `apply-groups/gr-isis-bfd.conf` (EVO only — MX PEs configure BFD inline under `protocols isis interface`)
- `apply-groups/gr-lag-member.conf`
- `cos/forwarding-classes.conf`
- `cos/schedulers.conf`
- `firewall/policers.conf`
- `policy/communities.conf` (full set)

---

## L2CIRCUIT (including hot-standby)

> **OS scope:** L2Circuit hot-standby with `backup-neighbor` is
> deployed only on EVO ACX PEs in this JVD. Junos MX PEs carry
> static L2Circuit pseudowires via `services/l2circuit-floating-pw.conf`
> instead — do NOT offer hot-standby as a Junos option here.

**minimum** (just the service)
- `evo/protocols/l2circuit-hsb-hub.conf` (Hub — EVO only)
- `evo/protocols/l2circuit-hsb-pe.conf` (Primary/Backup PE — EVO only)
- `evo/interfaces/vlan-ccc-vlan-map-filter-ccc.conf`

**with-overlay** — Signalling: **LDP** (targeted pseudowire, incl. hot-standby `backup-neighbor`). **No BGP overlay** — L2Circuit relies on targeted LDP, not BGP (see the **BGP-overlay coverage gate** above, rule 3).

**as-deployed** (= with-overlay +)
- `transport/isis-srmpls-tilfa.conf`
- `transport/mpls-segment-routing.conf`
- `apply-groups/gr-edge-intf.conf`
- `apply-groups/gr-core-intf.conf`
- `apply-groups/gr-isis-bcp.conf`
- `apply-groups/gr-bgp-bcp.conf`
- `apply-groups/gr-isis-bfd.conf` (EVO only — MX PEs configure BFD inline under `protocols isis interface`)
- `apply-groups/gr-l2ckt-hs.conf` (EVO only)
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
  - `junos/routing-instances/vpls/ri-bgp-vpls-export.conf` (Junos PEs only in this JVD).
  - Identifier: `instance-type virtual-switch` + `protocols vpls`
    with `site $NAME { site-identifier $ID; }` (no `vpls-id`).
- **LDP-VPLS** (multipoint VPLS via LDP targeted sessions, RFC 4762):
  - `evo/routing-instances/vpls/ri-ldp-vpls.conf` (EVO PEs only in this JVD).
  - Identifier: `instance-type virtual-switch` + `protocols vpls`
    with `vpls-id $ID` + `neighbor $REMOTE_PE` (no `site` block).
  - Note: LDP-VPLS-with-BGP-auto-discovery (`l2vpn-id` form) is
    NOT deployed in this JVD.

Tiers (apply to whichever of the three the user asked for):

- **minimum** = `services/<topic>.conf` + AC interface snip
- **with-overlay** — Signalling: **L2VPN** (`family l2vpn signaling`) for Kompella L2VPN and BGP-VPLS; **LDP** targeted sessions for LDP-VPLS. BGP overlay **applies to Kompella L2VPN and BGP-VPLS only** (LDP-VPLS adds none); attach it per the **BGP-overlay coverage gate** above.
- **as-deployed** = + transport underlay + full apply-group baseline
  + CoS + OAM + BGP-CT

---

## EVPN-FXC (Flexible Cross-Connect)

EVPN-FXC bundles multiple VLAN-tagged UNIs under a single
`evpn-vpws` routing-instance via an FXC collector group. Use this
when the customer hands off many service-delimited VLANs on the
same port and you want one PW per VLAN without one routing-instance
per VLAN.

**minimum** (just the service)
- `services/evpn-fxc.conf` (Junos and EVO — `instance-type evpn-vpws` with `flexible-cross-connect`)
- the per-VLAN AC units that join the FXC group come from the `junos/interfaces/vlan-ccc-vlan-map*.conf` forms; which form applies depends on the target device

**with-overlay** — Signalling: **EVPN** (`family evpn signaling`). BGP overlay **applies** — attach the OS-native `transport/bgp-overlay.conf` per the **BGP-overlay coverage gate** above. If no exact same-OS overlay form applies to the target, this mode is **unavailable** (fail closed) — see the gate.

**as-deployed** (= with-overlay +)
- same baseline as EVPN-VPWS above (transport + apply-groups + CoS + OAM + FAT-PW)

---

## EVPN E-Tree

MEF E-Tree (root / leaf isolation) on a Junos `mac-vrf` with
`etree-ac-role` on each UNI. Junos-only in this JVD.

**minimum** (just the service)
- `junos/routing-instances/evpn-etree/ri-evpn-etree-export.conf`
- `junos/interfaces/ethernet-bridge.conf` (E-Tree leaf/root UNI)

**with-overlay** — Signalling: **EVPN** (`family evpn signaling`). BGP overlay **applies** — attach the OS-native `transport/bgp-overlay.conf` per the **BGP-overlay coverage gate** above. If no exact same-OS overlay form applies to the target, this mode is **unavailable** (fail closed) — see the gate.

**as-deployed** (= with-overlay +)
- same baseline as EVPN-ELAN above

---

## L2Circuit floating pseudowire

Static-label L2Circuit pseudowire landing on a `ps<N>`
pseudowire-subscriber anchor (decouples the PW from a physical AC).

**minimum** (just the service)
- **L2Circuit floating pseudowire** (Junos MX `ps<N>` head; EVO ACX vlan-ccc tail):
  - `junos/protocols/l2circuit-floating-pw.conf` (Junos PEs)
  - the EVO ACX tail customer-facing AC unit comes from the `evo/interfaces/vlan-ccc-vlan-map*.conf` forms; which form applies depends on the target device
- `junos/interfaces/pseudowire-subscriber.conf` (the `ps<N>` anchor)

**with-overlay** — Signalling: **LDP** (static-label pseudowire). **No BGP overlay** — L2Circuit floating pseudowires ride targeted LDP, not BGP (see the **BGP-overlay coverage gate** above, rule 3).

**as-deployed** (= with-overlay +)
- same baseline as L2CIRCUIT above

---

## L2Circuit local-switching (cross-connect on one PE)

Port-to-port hairpin on a single PE via `end-interface`. EVO-only
in this JVD.

**minimum** (just the service)
- `evo/protocols/l2circuit-lsw.conf`
- `evo/interfaces/vlan-ccc-vlan-map-list-tpid.conf` (the et-0/0/5 side; the et-0/0/51 side uses `vlan-tags outer` and has no snip)

**with-overlay** — Signalling: **none** (single-PE local cross-connect). **No BGP overlay** — not applicable (see the **BGP-overlay coverage gate** above, rule 3).

**as-deployed** (= minimum +)
- transport underlay + edge apply-groups + CoS + OAM + firewall policers

---

## Slim L3VPN IRB-anchor VRF (host /32s ride RT-2)

A Type-5 anchor VRF that pairs with an EVPN-ELAN MAC-VRF for
L2 + L3 IRB services. No explicit `ip-prefix-routes` block —
host /32s are advertised via the MAC-VRF's RT-2. Use this instead
of `routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy.conf` when you do not need the VRF to
originate RT-5 prefix routes (only the IRB subnet matters and it
is carried by RT-2).

**minimum** (both halves of the service + per-VRF policy)
- L2 / RT-2 half (one of):
    - `evo/routing-instances/evpn-elan/ri-evpn-elan-irb.conf` (EVO)
    - `junos/routing-instances/evpn-elan/ri-evpn-elan-irb.conf` (Junos MX)
- `routing-instances/l3vpn/ri-l3vpn-irb-vrf-target.conf` (the slim anchor VRF — Junos and EVO)
- `policy/l3vpn-export-import.conf`
- `policy/communities.conf` (only the per-VRF target community)
- IRB-anchor AC unit: no snip in this library captures the L3VPN `family inet` attachment interface

**with-overlay** — Signalling: **EVPN** (`family evpn signaling`). BGP overlay **applies** — attach the OS-native `transport/bgp-overlay.conf` per the **BGP-overlay coverage gate** above. If no exact same-OS overlay form applies to the target, this mode is **unavailable** (fail closed) — see the gate.

**as-deployed** (= with-overlay +)
- same baseline as EVPN Type-5 above

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
