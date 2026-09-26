# JVD MEBS snippet library

## evo/chassis/aggregated-devices-ethernet.conf

```
/*
 * Topic:   Aggregated Ethernet device-count for the chassis
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Reserves the aggregated Ethernet interface pool, so `ae0` through
 *    `ae<count-1>` can be configured on the node.
 *  - The count is a chassis-wide ceiling, not a count of bundles in use.
 *
 * Variables (example values from an1_mx204):
 *   $AE_DEVICE_COUNT   e.g. 25
 */
chassis {
    aggregated-devices {
        ethernet {
            device-count $AE_DEVICE_COUNT;
        }
    }
}
```

## evo/class-of-service/classifiers/cl-6class-exp-import-default.conf

```
/*
 * Topic:   Six-class DSCP, EXP and 802.1p classifiers with EXP default import
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - EXP imports the default classifier and explicitly maps code points
 *    to forwarding classes and loss priorities.
 *
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-6queue-model.conf
 *
 * Variables: none
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
            import default;
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
}```

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
 * Pair with: none
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

## evo/firewall/filter-family-any-50mb.conf

```
/*
 * Topic:   Protocol-independent 50 Mbps rate-limit filter
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma5_mx204
 *   EVO:   an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `family any` acts on the logical interface regardless of payload protocol,
 *    and `interface-specific` gives every bound interface its own counter and
 *    policer instance, so one subscriber's rate limit is independent of
 *    another's.
 *  - A single unconditional term whose only action is the policer, which makes
 *    the filter a pure bandwidth profile.
 *  - On an3_acx7100-48l the filter is bound as `filter { input 50MB_filter; }`
 *    on 1400 service units. On an2_acx5448 the definition is present with no
 *    binding, so the filter exists there as a prepared profile.
 *  - The named 50mbps_policer supplies the rate and burst limits; its
 *    required provider is selected for the target device.
 *
 * Pair with:
 *  - variant:mebs-rate-limit-policers capabilities=firewall:policers
 *
 * Variables: none. All values here are JVD-wide constants
 *            (policer names and rates) — same on every PE.
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
}
```

## evo/firewall/filter-family-any-policers.conf

```
/*
 * Topic:   Protocol-independent rate-limit filters binding the 50 Mbps and 5 Mbps policers
 * Seen on:
 *   Junos: an4_acx710 ma5_mx204
 *   EVO:   meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `family any` filters act on the logical interface regardless of payload
 *    protocol, so one filter rate-limits a mixed bridged and routed circuit.
 *  - `interface-specific` gives each bound interface its own counter and
 *    policer instance, so one subscriber's rate limit is independent of
 *    another's.
 *  - Each filter carries a single unconditional term whose only action is the
 *    policer, which makes the filter a pure bandwidth profile.
 *
 * Pair with:
 *  - evo/firewall/policers.conf
 *
 * Variables: none
 */
firewall {
    family any {
        filter 50MB_filter {
            interface-specific;
            term t1 {
                then policer 50mbps_policer;
            }
        }
        filter 5MB_filter {
            interface-specific;
            term t1 {
                then policer 5mbps_policer;
            }
        }
    }
}
```

## evo/firewall/filter-ipv6-router-access.conf

```
/*
 * Topic:   IPv6 router access filter
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1-1_acx7100-32c
 * Variables: none
 */
firewall {
  family inet6 {
    filter IPV6-ROUTER-ACCESS {
      interface-specific;
      term ALL-ELSE {
        then {
          count LAST;
          accept;
        }
      }
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
 * Variant group: mebs-rate-limit-policers
 *   Provides: firewall:policers
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
 * Pair with: none
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

## evo/forwarding-options/hash-key-mpls-all-labels-layer-3-payload.conf

```
/*
 * Topic:   hash-key
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 * Pair with: none
 * Variables: none
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
                ip {
                    layer-3-only;
                }
            }
        }
        family multiservice {
            source-mac;
            destination-mac;
        }
    }
}
```

## evo/forwarding-options/hash-key-mpls-all-labels.conf

```
/*
 * Topic:   Load-balance hash key across IPv4, IPv6, MPLS all-labels and Layer 2
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `family inet` and `family inet6` hash on both the Layer 3 header and the
 *    Layer 4 ports, so flows between one address pair still spread.
 *  - `family mpls all-labels` hashes the whole label stack and additionally
 *    looks past it at the IP payload, keeping transit LSP traffic balanced.
 *  - `family multiservice` adds the source and destination MAC, which is what
 *    spreads bridged traffic that carries no IP header.
 *
 * Variables: none
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

## evo/groups/gr-ae-interface-mtu.conf

```
/*
 * Topic:   AE-INTERFACE-MTU
 * Seen on:
 *   Junos: an1_mx204 an4_acx710 ma5_mx204
 *   EVO:   ma1-2_acx7024 meg2_acx7509
 * Pair with: none
 * Variables: none
 */
groups {
    AE-INTERFACE-MTU {
        interfaces {
            <ae*> {
                mtu 9192;
            }
        }
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

## evo/groups/gr-core-intf-lag-member.conf

```
/*
 * Topic:   GR-CORE-INTF-LAG-MEMBER
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Pair with: none
 * Variables: none
 */
groups {
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
 * Pair with: none
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
 * Variant group: mebs-edge-intf-mh
 *   Provides: gr:edge-intf-mh
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
 * Pair with: none
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
 * Variant group: mebs-edge-intf-form
 *   Provides: gr:edge-intf
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
 * Pair with: none
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

## evo/groups/gr-fatpw-label-elan-vpls-l2circuit.conf

```
/*
 * Topic:   Flow labels for port-based EVPN-ELAN, VPLS and L2Circuit
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma1-2_acx7024
 * Variant group: mebs-fatpw-label-form
 *   Provides: gr:fatpw-label
 * Pair with: none
 * Variables: none
 */
groups {
    GR-FATPW-LABEL {
        routing-instances {
            <EVPN_ELAN_PORT_*> {
                protocols {
                    evpn {
                        flow-label;
                        flow-label-static;
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
        }
        protocols {
            l2circuit {
                neighbor <*> {
                    interface <*> {
                        flow-label-transmit;
                        flow-label-receive;
                    }
                }
            }
        }
    }
}```

## evo/groups/gr-fatpw-label-etree-vpws-vpls.conf

```
/*
 * Topic:   Flow labels for EVPN E-Tree, EVPN-VPWS and VPLS
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg1_acx7100-32c meg2_acx7509
 * Variant group: mebs-fatpw-label-form
 *   Provides: gr:fatpw-label
 * Pair with: none
 * Variables: none
 */
groups {
    GR-FATPW-LABEL {
        routing-instances {
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
            <vpls_*> {
                protocols {
                    vpls {
                        flow-label-transmit;
                        flow-label-receive;
                    }
                }
            }
        }
    }
}```

## evo/groups/gr-fatpw-label-vpws-static.conf

```
/*
 * Topic:   Static flow labels for port-based EVPN-VPWS
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma1-1_acx7024
 * Variant group: mebs-fatpw-label-form
 *   Provides: gr:fatpw-label
 * Pair with: none
 * Variables: none
 */
groups {
    GR-FATPW-LABEL {
        routing-instances {
            <EVPN_VPWS_PORT_*> {
                protocols {
                    evpn {
                        flow-label-transmit-static;
                        flow-label-receive-static;
                    }
                }
            }
        }
    }
}```

## evo/groups/gr-fatpw-label.conf

```
/*
 * Apply-group: GR-FATPW-LABEL
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 *
 * Variant group: mebs-fatpw-label-form
 *   Provides: gr:fatpw-label
 *
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
 * Pair with: none
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

## evo/groups/gr-isis-interface-spf.conf

```
/*
 * Topic:   GR-ISIS-BCP
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c
 * Pair with: none
 * Variables: none
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
 * Pair with:
 *  - variant:mebs-edge-intf-mh capabilities=gr:edge-intf-mh
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
 * Pair with:
 *  - variant:mebs-edge-intf-mh capabilities=gr:edge-intf-mh
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

## evo/interfaces/ifd-core-aggregate-flexible-lacp-fast-mtu.conf

```
/*
 * Topic:   Core interface device
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509
 * Pair with:
 *  - evo/groups/gr-core-intf.conf
 * Variables:
 *   $CORE_DESC   e.g. "to AG2.2 rtme-mx-51 ae22"
 *   $IFD   e.g. ae22
 */
interfaces {
    $IFD {
        apply-groups GR-CORE-INTF;
        description $CORE_DESC;
        flexible-vlan-tagging;
        mtu 9192;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            minimum-links 1;
            lacp {
                active;
                periodic fast;
            }
        }
    }
}
```

## evo/interfaces/ifd-core-aggregate-flexible-lacp-fast.conf

```
/*
 * Topic:   Core interface device
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   ma3_acx7100-48l
 * Pair with:
 *  - evo/groups/gr-core-intf.conf
 * Variables:
 *   $CORE_DESC   e.g. "to MDR2 rtme-mx-51 ae55"
 *   $IFD   e.g. ae55
 */
interfaces {
    $IFD {
        apply-groups GR-CORE-INTF;
        description $CORE_DESC;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            minimum-links 1;
            lacp {
                active;
                periodic fast;
            }
        }
    }
}
```

## evo/interfaces/ifd-core-aggregate-lacp-fast-mtu.conf

```
/*
 * Topic:   Core interface device
 * Seen on:
 *   Junos: an1_mx204 an4_acx710 ma2_mx204
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-2_acx7024 mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Pair with:
 *  - evo/groups/gr-core-intf.conf
 * Variables:
 *   $CORE_DESC   e.g. "to AG1.1 rtme-acx7100-32c-a ae23"
 *   $IFD   e.g. ae23
 */
interfaces {
    $IFD {
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
    }
}
```

## evo/interfaces/ifd-core-aggregate-lacp-fast.conf

```
/*
 * Topic:   Core interface device
 * Seen on:
 *   Junos: an2_acx5448 ma4_mx204 mdr2_mx10003
 *   EVO:   ma3_acx7100-48l
 * Pair with:
 *  - evo/groups/gr-core-intf.conf
 * Variables:
 *   $CORE_DESC   e.g. "to AN1 rtme-mx-45 ae73"
 *   $IFD   e.g. ae73
 */
interfaces {
    $IFD {
        apply-groups GR-CORE-INTF;
        description $CORE_DESC;
        aggregated-ether-options {
            minimum-links 1;
            lacp {
                active;
                periodic fast;
            }
        }
    }
}
```

## evo/interfaces/ifd-core-flexible-100g-ether-tpid.conf

```
/*
 * Topic:   Core interface device
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma3_acx7100-48l
 * Pair with: none
 * Variables:
 *   $CORE_DESC   e.g. "to MA5 rtme-mx-59 et-0/0/2"
 *   $IFD   e.g. et-0/0/51
 */
interfaces {
    $IFD {
        description $CORE_DESC;
        traps;
        flexible-vlan-tagging;
        speed 100g;
        mtu 9192;
        hold-time up 2000 down 0;
        encapsulation flexible-ethernet-services;
        ether-options {
            ethernet-switch-profile {
                tag-protocol-id [ 0x8100 0x88a8 ];
            }
        }
    }
}
```

## evo/interfaces/ifd-core-group-100g-mtu.conf

```
/*
 * Topic:   Core interface device
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr1_ptx10001-36mr mdr1_acx7509
 * Pair with:
 *  - evo/groups/gr-core-intf.conf
 * Variables:
 *   $CORE_DESC   e.g. "to MSE1 rtme-mx304-02 rtme-mx304-02"
 *   $IFD   e.g. et-0/0/0
 */
interfaces {
    $IFD {
        apply-groups GR-CORE-INTF;
        description $CORE_DESC;
        speed 100g;
        mtu 9192;
    }
}
```

## evo/interfaces/ifd-core-group-mtu.conf

```
/*
 * Topic:   Core interface device
 * Seen on:
 *   Junos: ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c cr1_ptx10001-36mr cr2_ptx10001-36mr mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Pair with:
 *  - evo/groups/gr-core-intf.conf
 * Variables:
 *   $CORE_DESC   e.g. "to MEG1 rtme-acx7100-32c-d"
 *   $IFD   e.g. et-0/0/13
 */
interfaces {
    $IFD {
        apply-groups GR-CORE-INTF;
        description $CORE_DESC;
        mtu 9192;
    }
}
```

## evo/interfaces/ifd-core-lag-member-ether-100g.conf

```
/*
 * Topic:   Core aggregate member interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr1_ptx10001-36mr ma3_acx7100-48l
 * Pair with:
 *  - evo/groups/gr-core-intf-lag-member.conf
 * Variables:
 *   $AE_BUNDLE   e.g. ae11
 *   $IFD   e.g. et-0/0/1
 */
interfaces {
    $IFD {
        apply-groups GR-CORE-INTF-LAG-MEMBER;
        speed 100g;
        ether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## evo/interfaces/ifd-core-lag-member-ether-10g.conf

```
/*
 * Topic:   Core aggregate member interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   mdr1_acx7509
 * Pair with:
 *  - evo/groups/gr-core-intf-lag-member.conf
 * Variables:
 *   $AE_BUNDLE   e.g. ae22
 *   $IFD   e.g. et-0/0/9
 */
interfaces {
    $IFD {
        apply-groups GR-CORE-INTF-LAG-MEMBER;
        speed 10g;
        ether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## evo/interfaces/ifd-core-lag-member.conf

```
/*
 * Topic:   Physical member of a core-facing aggregated Ethernet bundle
 * Seen on:
 *   Junos: an2_acx5448 an4_acx710
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `ether-options 802.3ad` enslaves the physical port to a core-facing
 *    aggregated Ethernet bundle, so the port itself carries no addressing.
 *  - `apply-groups GR-CORE-INTF-LAG-MEMBER` supplies the knobs shared by every
 *    core LAG member.
 *
 * Pair with:
 *  - evo/groups/gr-core-intf-lag-member.conf
 *
 * Variables (example values from an2_acx5448):
 *   $CORE_INTF   e.g. et-0/1/1
 *   $AE_BUNDLE   e.g. ae73
 */
interfaces {
    $CORE_INTF {
        apply-groups GR-CORE-INTF-LAG-MEMBER;
        ether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## evo/interfaces/ifd-lag-member-ether.conf

```
/*
 * Topic:   Core aggregate member interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg2_acx7509
 * Pair with: none
 * Variables:
 *   $AE_BUNDLE   e.g. ae4
 *   $IFD   e.g. et-1/0/0
 */
interfaces {
    $IFD {
        ether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## evo/interfaces/ifd-loopback-description.conf

```
/*
 * Topic:   Loopback interface description
 * Seen on:
 *   Junos: an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Pair with: none
 * Variables:
 *   $LO0_DESC   e.g. "AG1.1 Aggregation Node Metro Fabric Spine"
 */
interfaces {
    lo0 {
        description $LO0_DESC;
    }
}
```

## evo/interfaces/ifl-core-description-inet-iso-inet6-mpls.conf

```
/*
 * Topic:   Core logical interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 * Pair with: none
 * Variables:
 *   $CORE_DESC   e.g. "to AG1.1 rtme-acx7100-32c-a ae23;"
 *   $CORE_V4_ADDR   e.g. 10.10.0.181/30
 *   $CORE_V6_ADDR   e.g. 2001::10:10:0:b5/126
 *   $IFD   e.g. ae23
 *   $UNIT   e.g. 0
 */
interfaces {
    $IFD {
        unit $UNIT {
            description $CORE_DESC;
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

## evo/interfaces/ifl-core-group-vlan-inet-iso-inet6-mpls.conf

```
/*
 * Topic:   Core logical interface
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   ma3_acx7100-48l
 * Pair with:
 *  - evo/groups/gr-core-intf.conf
 * Variables:
 *   $CORE_V4_ADDR   e.g. 10.10.2.153/30
 *   $CORE_V6_ADDR   e.g. 2001::10:10:2:99/126
 *   $IFD   e.g. et-0/0/51
 *   $UNIT   e.g. 1
 *   $VLAN   e.g. 1
 */
interfaces {
    $IFD {
        unit $UNIT {
            apply-groups GR-CORE-INTF;
            vlan-id $VLAN;
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

## evo/interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-5.conf

```
/*
 * Topic:   Core logical interface
 * Seen on:
 *   Junos: an4_acx710
 *   EVO:   ag1-1_acx7100-32c
 * Pair with: none
 * Variables:
 *   $CORE_V4_ADDR   e.g. 10.10.0.81/30
 *   $CORE_V6_ADDR   e.g. 2001::10:10:0:51/126
 *   $IFD   e.g. et-0/0/13
 *   $UNIT   e.g. 0
 */
interfaces {
    $IFD {
        unit $UNIT {
            family inet {
                address $CORE_V4_ADDR;
            }
            family iso;
            family inet6 {
                address $CORE_V6_ADDR;
            }
            family mpls {
                maximum-labels 5;
            }
        }
    }
}
```

## evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf

```
/*
 * Topic:   Core logical interface
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Pair with: none
 * Variables:
 *   $CORE_V4_ADDR   e.g. 10.10.0.113/30
 *   $CORE_V6_ADDR   e.g. 2001::10:10:0:71/126
 *   $IFD   e.g. et-0/0/14
 *   $UNIT   e.g. 0
 */
interfaces {
    $IFD {
        unit $UNIT {
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

## evo/interfaces/ifl-core-vlan-inet-iso-inet6-mpls.conf

```
/*
 * Topic:   Core logical interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma3_acx7100-48l mdr1_acx7509
 * Pair with: none
 * Variables:
 *   $CORE_V4_ADDR   e.g. 10.10.1.137/30
 *   $CORE_V6_ADDR   e.g. 2001::10:10:1:89/126
 *   $IFD   e.g. ae55
 *   $UNIT   e.g. 1
 *   $VLAN   e.g. 1
 */
interfaces {
    $IFD {
        unit $UNIT {
            vlan-id $VLAN;
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

## evo/interfaces/ifl-irb-inet.conf

```
/*
 * Topic:   IRB unit carrying a single IPv4 address
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l
 * Variant group: mebs-irb-form
 *   Provides: ifl:irb
 *
 * Highlights:
 *  - The routed interface of an EVPN bridge domain: the unit gives the bridge
 *    domain one IPv4 address on this node, so hosts in the domain reach the
 *    L3VPN through it.
 *  - The address is node-local, with no `virtual-gateway-address`, so the
 *    gateway is not shared with the other PEs in the EVPN.
 *
 * Variables (example values from an3_acx7100-48l):
 *   $UNIT        e.g. 4000
 *   $IRB_ADDR    e.g. 40.2.2.3/24
 */
interfaces {
    irb {
        unit $UNIT {
            family inet {
                address $IRB_ADDR;
            }
        }
    }
}
```

## evo/interfaces/ifl-irb-virtual-gateway.conf

```
/*
 * Topic:   IRB unit acting as an anycast default gateway with a virtual-gateway address
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg1_acx7100-32c meg2_acx7509
 * Variant group: mebs-irb-form
 *   Provides: ifl:irb
 *
 * Highlights:
 *  - The routed interface of an EVPN bridge domain. The unit holds the node's
 *    own address plus a `virtual-gateway-address`, so every PE in the EVPN
 *    presents the same gateway IP and a host keeps its default gateway
 *    wherever it attaches.
 *  - `virtual-gateway-v4-mac` fixes the MAC answered for that gateway address,
 *    so the gateway is identical on every participating node.
 *  - `virtual-gateway-accept-data` lets the node accept traffic addressed to
 *    the virtual gateway itself, not only forward through it.
 *
 * Variables (example values from meg1_acx7100-32c):
 *   $UNIT        e.g. 4000
 *   $IRB_ADDR    e.g. 41.2.2.3/24
 *   $VGA         e.g. 41.2.2.1
 *   $VG_MAC      e.g. 00:01:33:44:11:11
 */
interfaces {
    irb {
        unit $UNIT {
            virtual-gateway-accept-data;
            family inet {
                address $IRB_ADDR {
                    virtual-gateway-address $VGA;
                }
            }
            virtual-gateway-v4-mac $VG_MAC;
        }
    }
}
```

## evo/interfaces/ifl-loopback-primary-iso-filter.conf

```
/*
 * Topic:   Loopback logical interface with IPv6 access filter
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1-1_acx7100-32c
 * Variables:
 *   $ISIS_NET   e.g. 49.0000.0010.0100.0004.00
 *   $LOOPBACK_V4_PFX   e.g. 1.1.0.4/32
 *   $LOOPBACK_V6_PFX   e.g. 2001::1:1:0:4/128
 *   $UNIT   e.g. 0
 */
interfaces {
  lo0 {
    unit $UNIT {
      family inet {
        address $LOOPBACK_V4_PFX {
          primary;
        }
      }
      family iso {
        address $ISIS_NET;
      }
      family inet6 {
        filter {
          input IPV6-ROUTER-ACCESS;
        }
        address $LOOPBACK_V6_PFX {
          primary;
        }
      }
    }
  }
}
```

## evo/interfaces/ifl-loopback-primary-iso-mpls.conf

```
/*
 * Topic:   Loopback logical interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg1_acx7100-32c
 * Pair with: none
 * Variables:
 *   $ISIS_NET   e.g. 49.0000.0010.0100.0006.00
 *   $LOOPBACK_V4_PFX   e.g. 1.1.0.6/32
 *   $LOOPBACK_V6_PFX   e.g. 2001::1:1:0:6/128
 *   $UNIT   e.g. 0
 */
interfaces {
    lo0 {
        unit $UNIT {
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
            family mpls;
        }
    }
}
```

## evo/interfaces/ifl-loopback-primary-iso.conf

```
/*
 * Topic:   Loopback logical interface
 * Seen on:
 *   Junos: an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003
 *   EVO:   ag1-2_acx7100-32c cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg2_acx7509
 * Pair with: none
 * Variables:
 *   $ISIS_NET   e.g. 49.0000.0010.0100.0005.00
 *   $LOOPBACK_V4_PFX   e.g. 1.1.0.5/32
 *   $LOOPBACK_V6_PFX   e.g. 2001::1:1:0:5/128
 *   $UNIT   e.g. 0
 */
interfaces {
    lo0 {
        unit $UNIT {
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

## evo/interfaces/ifl-loopback-primary-preferred-iso.conf

```
/*
 * Topic:   Loopback logical interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 * Pair with: none
 * Variables:
 *   $ISIS_NET   e.g. 49.0000.0010.0100.0002.00
 *   $LOOPBACK_V4_PFX   e.g. 1.1.0.2/32
 *   $LOOPBACK_V6_PFX   e.g. 2001::1:1:0:2/128
 *   $UNIT   e.g. 0
 */
interfaces {
    lo0 {
        unit $UNIT {
            family inet {
                address $LOOPBACK_V4_PFX {
                    primary;
                    preferred;
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

## evo/interfaces/ifl-vlan-bridge-description-esi.conf

```
/*
 * Topic: Described bridge logical interface with all-active ESI
 * Seen on:
 *   Junos: (none)
 *   EVO: an3_acx7100-48l
 * Pair with:
 *  - evo/interfaces/ifd-ae-lacp-fast.conf
 * Variables:
 *   $IFD    e.g. ae11
 *   $UNIT   e.g. 700
 *   $VLAN   e.g. 700
 *   $ESI    e.g. 00:70:11:11:11:11:11:00:00:01
 */
interfaces {
    $IFD {
        unit $UNIT {
            description "evpn service IFL";
            encapsulation vlan-bridge;
            vlan-id $VLAN;
            esi {
                $ESI;
                all-active;
            }
        }
    }
}```

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

## evo/interfaces/ifl-vlan-bridge-vlan-list.conf

```
/*
 * Topic:   Bridged logical interface carrying a VLAN range
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - `encapsulation vlan-bridge` exposes the unit as a bridged UNI that a
 *    bridged service can reference.
 *  - `vlan-id-list` admits a contiguous range of customer VLANs on the one
 *    unit, so several VLANs share a single attachment circuit.
 *
 * Variables (example values from an3_acx7100-48l):
 *   $IFD         e.g. et-0/0/50
 *   $UNIT        e.g. 1000
 *   $VLAN_LIST   e.g. 1000-1001
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-bridge;
            vlan-id-list $VLAN_LIST;
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

## evo/interfaces/ifl-vlan-bridge.conf

```
/*
 * Topic: Bridged logical interface with a VLAN identifier
 * Seen on:
 *   Junos: ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO: an3_acx7100-48l ma1-2_acx7024
 * Variables:
 *   $IFD    e.g. et-0/0/14
 *   $UNIT   e.g. 849
 *   $VLAN   e.g. 849
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-bridge;
            vlan-id $VLAN;
        }
    }
}```

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

## evo/interfaces/ifl-vlan-ccc-outer-tag-tpid.conf

```
/*
 * Topic: Cross-connect logical interface with an 802.1ad outer VLAN tag
 * Seen on:
 *   Junos: (none)
 *   EVO: ma3_acx7100-48l
 * Pair with:
 *  - evo/interfaces/ifd-core-flexible-100g-ether-tpid.conf
 * Variables:
 *   $IFD          e.g. et-0/0/51
 *   $UNIT         e.g. 4010
 *   $VLAN_OUTER   e.g. 4010
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-ccc;
            vlan-tags outer 0x88a8.$VLAN_OUTER;
        }
    }
}```

## evo/interfaces/ifl-vlan-ccc-vlan-list.conf

```
/*
 * Topic:   Cross-connect logical interface carrying a VLAN range
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l ma1-2_acx7024
 *
 * Highlights:
 *  - `encapsulation vlan-ccc` exposes the unit as a cross-connect attachment
 *    circuit that a point-to-point service can reference.
 *  - `vlan-id-list` admits a contiguous range of customer VLANs on the one
 *    unit, so several VLANs share a single attachment circuit.
 *
 * Variables (example values from an3_acx7100-48l):
 *   $IFD         e.g. et-0/0/0
 *   $UNIT        e.g. 810
 *   $VLAN_LIST   e.g. 820-821
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-ccc;
            vlan-id-list $VLAN_LIST;
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
 *  - Ingress 50MB_filter applies the UNI rate limit through its required
 *    device-selected policer.
 *  - Decouples customer VLAN IDs from service-internal VLAN IDs at the SP edge.
 *
 * Pair with:
 *  - evo/firewall/filter-family-any-50mb.conf
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

## evo/interfaces/ifl-vlan-ccc.conf

```
/*
 * Topic:   Single-tagged cross-connect logical interface
 * Seen on:
 *   Junos: ma5_mx204 mse1_mx304
 *   EVO:   an3_acx7100-48l ma1-2_acx7024 ma3_acx7100-48l
 *
 * Highlights:
 *  - The Layer 2 attachment circuit of a point-to-point service: the unit is
 *    handed to a cross-connect rather than terminated in a routing family, so
 *    the customer frame is carried transparently.
 *  - One VLAN with no rewriting, so the customer tag reaches the cross-connect
 *    unchanged, and no `esi`, so the circuit is single-homed.
 *  - The unit index and the VLAN tag are independent values.
 *
 * Variables (example values from an3_acx7100-48l):
 *   $IFD     e.g. et-0/0/0
 *   $UNIT    e.g. 862
 *   $VLAN    e.g. 862
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-ccc;
            vlan-id $VLAN;
        }
    }
}
```

## evo/interfaces/ifl-vlan-inet.conf

```
/*
 * Topic:   Single-tagged routed logical interface carrying an IPv4 customer address
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - The routed attachment circuit of an L3VPN service: one VLAN presented to
 *    the PE and terminated in `family inet`, so customer traffic arrives as IP
 *    rather than as a cross-connect or bridge domain.
 *  - The address is the PE side of the PE-CE link; the customer holds the
 *    other host in the same subnet.
 *  - The unit carries no `esi`, no VLAN rewriting and no filter, so the tag is
 *    presented unchanged and the circuit is single-homed.
 *
 * Variables (example values from an3_acx7100-48l):
 *   $IFD           e.g. et-0/0/4
 *   $UNIT          e.g. 2001
 *   $VLAN          e.g. 2001
 *   $AC_ADDR_V4    e.g. 13.1.0.1/30
 */
interfaces {
    $IFD {
        unit $UNIT {
            vlan-id $VLAN;
            family inet {
                address $AC_ADDR_V4;
            }
        }
    }
}
```

## evo/interfaces/ifl-vlan-inet6.conf

```
/*
 * Topic:   Single-tagged routed logical interface carrying an IPv6 customer address
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - The routed attachment circuit of an IPv6 L3VPN service: one VLAN
 *    presented to the PE and terminated in `family inet6`.
 *  - The address is the PE side of the PE-CE link; the customer holds the
 *    other host in the same subnet.
 *  - The unit carries no `esi`, no VLAN rewriting and no filter, so the tag is
 *    presented unchanged and the circuit is single-homed.
 *
 * Variables (example values from an3_acx7100-48l):
 *   $IFD           e.g. et-0/0/4
 *   $UNIT          e.g. 2201
 *   $VLAN          e.g. 2201
 *   $AC_ADDR_V6    e.g. 2001:0:0:0:13:3:0:1/126
 */
interfaces {
    $IFD {
        unit $UNIT {
            vlan-id $VLAN;
            family inet6 {
                address $AC_ADDR_V6;
            }
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
 *  - Referenced by the per-VRF import and export policies and by the VRF
 *    that carries the service.
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

## evo/policy-options/policy-statement/ps-bgp-mse-export-backup.conf

```
/*
 * Topic:   BGP policy BACKUP-PS-BGP-MSE-EXPORT
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509
 *
 * Highlights:
 *  - `term LOOP-PREVENT` rejects anything already carrying CM-SERVICE-EDGE,
 *    CM-ACCESS-FABRIC or CM-METRO-FABRIC, so a route never re-enters the
 *    domain it came from.
 *  - `term FROM-METRO-RING` re-advertises CM-METRO-RING routes inside
 *    PL-AN-REGION with `next-hop self`.
 *  - `term LOOPBACK` tags the remaining PL-AN-REGION prefixes with
 *    CM-METRO-RING and accepts them.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-service-edge.conf
 *  - evo/policy-options/community/cm-access-fabric.conf
 *  - evo/policy-options/community/cm-metro-fabric.conf
 *  - evo/policy-options/community/cm-metro-ring.conf
 *  - evo/policy-options/prefix-list/pl-an-region.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement BACKUP-PS-BGP-MSE-EXPORT {
        term LOOP-PREVENT {
            from community [ CM-SERVICE-EDGE CM-ACCESS-FABRIC CM-METRO-FABRIC ];
            then reject;
        }
        term FROM-METRO-RING {
            from {
                community CM-METRO-RING;
                prefix-list PL-AN-REGION;
            }
            then {
                next-hop self;
                accept;
            }
        }
        term LOOPBACK {
            from {
                prefix-list PL-AN-REGION;
            }
            then {
                community add CM-METRO-RING;
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

## evo/policy-options/policy-statement/ps-export-isis-metro-a-ribs.conf

```
/*
 * Topic:   policy-statement export_isis_metro_a_ribs
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509
 * Pair with: none
 * Variables: none
 */
policy-options {
    policy-statement export_isis_metro_a_ribs {
        term tag-reject {
            from tag 333;
            then reject;
        }
        term 4000 {
            from {
                igp-instance metro-a;
                protocol l-isis;
                rib junos-rti-tc-4000.inet.3;
                level 2;
                inactive: route-filter 1.1.0.0/24 prefix-length-range /32-/32;
                route-filter 1.1.0.14/32 exact;
                route-filter 1.1.0.17/32 exact;
                route-filter 1.1.0.18/32 exact;
            }
            then {
                tag 333;
                tag2 4444;
                prefix-segment {
                    redistribute;
                }
                accept;
            }
        }
        term 6000 {
            from {
                igp-instance metro-a;
                protocol l-isis;
                rib junos-rti-tc-6000.inet.3;
                level 2;
                inactive: route-filter 1.1.0.0/24 prefix-length-range /32-/32;
                route-filter 1.1.0.14/32 exact;
                route-filter 1.1.0.17/32 exact;
                route-filter 1.1.0.18/32 exact;
            }
            then {
                tag 333;
                tag2 6666;
                prefix-segment {
                    redistribute;
                }
                accept;
            }
        }
        term 1 {
            from {
                igp-instance metro-a;
                protocol l-isis;
                rib inet.3;
                level 2;
                inactive: route-filter 1.1.0.0/24 prefix-length-range /32-/32;
                route-filter 1.1.0.14/32 exact;
                route-filter 1.1.0.17/32 exact;
                route-filter 1.1.0.18/32 exact;
            }
            then {
                tag 333;
                tag2 2222;
                prefix-segment {
                    redistribute;
                }
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-export-isis-metro-b-ribs.conf

```
/*
 * Topic:   policy-statement export_isis_metro_b_ribs
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509
 * Pair with: none
 * Variables: none
 */
policy-options {
    policy-statement export_isis_metro_b_ribs {
        term tag-reject {
            from tag 333;
            then reject;
        }
        term 4000 {
            from {
                igp-instance metro-b;
                protocol l-isis;
                rib junos-rti-tc-4000.inet.3;
                level 2;
                inactive: route-filter 1.1.0.0/24 prefix-length-range /32-/32;
                route-filter 1.1.0.16/32 exact;
                route-filter 1.1.0.19/32 exact;
            }
            then {
                tag 333;
                tag2 4444;
                prefix-segment {
                    redistribute;
                }
                accept;
            }
        }
        term 6000 {
            from {
                igp-instance metro-b;
                protocol l-isis;
                rib junos-rti-tc-6000.inet.3;
                level 2;
                inactive: route-filter 1.1.0.0/24 prefix-length-range /32-/32;
                route-filter 1.1.0.16/32 exact;
                route-filter 1.1.0.19/32 exact;
            }
            then {
                tag 333;
                tag2 6666;
                prefix-segment {
                    redistribute;
                }
                accept;
            }
        }
        term 1 {
            from {
                igp-instance metro-b;
                protocol l-isis;
                rib inet.3;
                level 2;
                inactive: route-filter 1.1.0.0/24 prefix-length-range /32-/32;
                route-filter 1.1.0.16/32 exact;
                route-filter 1.1.0.19/32 exact;
            }
            then {
                tag 333;
                tag2 2222;
                prefix-segment {
                    redistribute;
                }
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

## evo/policy-options/policy-statement/ps-export-l3vpn-public-default-2.conf

```
/*
 * Topic:   L3VPN vrf-export policy — tag two customer aggregates, then tag every remaining route
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - `term tag-public-routes` matches two customer aggregates `orlonger` and
 *    tags each accepted route with CM-L3VPN-PUB, which marks it as a public
 *    L3VPN prefix for the fabric, and with the VRF's own route-target
 *    community.
 *  - `term tag-default` catches everything the first term did not match and
 *    tags it with the VRF community alone, so the VRF is not limited to its
 *    declared aggregates.
 *  - The configured policy name varies per service; the VRF that uses the
 *    policy carries that exact literal in its `vrf-export` statement.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-l3vpn-pub.conf
 *
 * Variables (example values from an3_acx7100-48l / METRO_L3VPN_2002):
 *   $EXPORT_POL      e.g. PS-METRO_L3VPN_2002-EXPORT
 *                    (the configured policy name; the VRF's `vrf-export`
 *                     carries this exact literal)
 *   $INSTANCE_NAME   e.g. METRO_L3VPN_2002
 *   $CE_PREFIX_1     e.g. 13.1.0.0/16
 *   $CE_PREFIX_2     e.g. 15.1.0.0/16
 */
policy-options {
    policy-statement $EXPORT_POL {
        term tag-public-routes {
            from {
                route-filter $CE_PREFIX_1 orlonger;
                route-filter $CE_PREFIX_2 orlonger;
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
}
```

## evo/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf

```
/*
 * Topic:   L3VPN vrf-export policy — tag three customer aggregates, then tag every remaining route
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - `term tag-public-routes` matches three customer aggregates `orlonger` and
 *    tags each accepted route with CM-L3VPN-PUB, which marks it as a public
 *    L3VPN prefix for the fabric, and with the VRF's own route-target
 *    community.
 *  - `term tag-default` catches everything the first term did not match and
 *    tags it with the VRF community alone, so the VRF is not limited to its
 *    declared aggregates.
 *  - The configured policy name varies per service; the VRF that uses the
 *    policy carries that exact literal in its `vrf-export` statement.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-l3vpn-pub.conf
 *
 * Variables (example values from an3_acx7100-48l / METRO_BGPv4_L3VPN_2101):
 *   $EXPORT_POL      e.g. PS-METRO_BGPv4_L3VPN_2101-EXPORT
 *                    (the configured policy name; the VRF's `vrf-export`
 *                     carries this exact literal)
 *   $INSTANCE_NAME   e.g. METRO_BGPv4_L3VPN_2101
 *   $CE_PREFIX_1     e.g. 13.2.0.0/16
 *   $CE_PREFIX_2     e.g. 16.2.0.0/16
 *   $CE_PREFIX_3     e.g. 15.2.0.0/16
 */
policy-options {
    policy-statement $EXPORT_POL {
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
}
```

## evo/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf

```
/*
 * Topic:   L3VPN vrf-export policy — tag four customer aggregates, then tag every remaining route
 * Seen on:
 *   Junos: mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - `term tag-public-routes` matches four customer aggregates `orlonger` and
 *    tags each accepted route with CM-L3VPN-PUB, which marks it as a public
 *    L3VPN prefix for the fabric, and with the VRF's own route-target
 *    community.
 *  - `term tag-default` catches everything the first term did not match and
 *    tags it with the VRF community alone, so the VRF is not limited to its
 *    declared aggregates.
 *  - The configured policy name varies per service; the VRF that uses the
 *    policy carries that exact literal in its `vrf-export` statement.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-l3vpn-pub.conf
 *
 * Variables (example values from an3_acx7100-48l / METRO_L3VPN_2001):
 *   $EXPORT_POL      e.g. PS-METRO_L3VPN_2001-EXPORT
 *                    (the configured policy name; the VRF's `vrf-export`
 *                     carries this exact literal)
 *   $INSTANCE_NAME   e.g. METRO_L3VPN_2001
 *   $CE_PREFIX_1     e.g. 13.1.0.0/16
 *   $CE_PREFIX_2     e.g. 16.1.0.0/16
 *   $CE_PREFIX_3     e.g. 115.1.0.0/16
 *   $CE_PREFIX_4     e.g. 15.1.0.0/16
 */
policy-options {
    policy-statement $EXPORT_POL {
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
        term tag-default {
            then {
                community add $INSTANCE_NAME;
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf

```
/*
 * Topic:   IPv6 L3VPN vrf-export policy — tag two customer aggregates, then tag every remaining route
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - `term tag-public-routes` selects `family inet6` and matches two customer
 *    IPv6 aggregates `orlonger`, tagging each accepted route with
 *    CM-L3VPN-PUB, which marks it as a public L3VPN prefix for the fabric,
 *    and with the VRF's own route-target community.
 *  - `term tag-default` carries no `from`, so it catches everything the first
 *    term did not match and tags it with the VRF community alone.
 *  - The configured policy name varies per service; the VRF that uses the
 *    policy carries that exact literal in its `vrf-export` statement.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-l3vpn-pub.conf
 *
 * Variables (example values from an3_acx7100-48l / METRO_BGPv6_L3VPN_2202):
 *   $EXPORT_POL      e.g. PS-METRO_BGPv6_L3VPN_2202-EXPORT
 *                    (the configured policy name; the VRF's `vrf-export`
 *                     carries this exact literal)
 *   $INSTANCE_NAME   e.g. METRO_BGPv6_L3VPN_2202
 *   $CE_PREFIX_1     e.g. 2001::13:3:0:0/64
 *   $CE_PREFIX_2     e.g. 2001::16:3:0:0/64
 */
policy-options {
    policy-statement $EXPORT_POL {
        term tag-public-routes {
            from {
                family inet6;
                route-filter $CE_PREFIX_1 orlonger;
                route-filter $CE_PREFIX_2 orlonger;
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
}
```

## evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf

```
/*
 * Topic:   IPv6 L3VPN vrf-export policy — tag four customer aggregates, then tag every remaining route
 * Seen on:
 *   Junos: mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - `term tag-public-routes` selects `family inet6` and matches four customer
 *    IPv6 aggregates `orlonger`, tagging each accepted route with
 *    CM-L3VPN-PUB, which marks it as a public L3VPN prefix for the fabric,
 *    and with the VRF's own route-target community.
 *  - `term tag-default` carries no `from`, so it catches everything the first
 *    term did not match and tags it with the VRF community alone.
 *  - The configured policy name varies per service; the VRF that uses the
 *    policy carries that exact literal in its `vrf-export` statement.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-l3vpn-pub.conf
 *
 * Variables (example values from an3_acx7100-48l / METRO_BGPv6_L3VPN_2201):
 *   $EXPORT_POL      e.g. PS-METRO_BGPv6_L3VPN_2201-EXPORT
 *                    (the configured policy name; the VRF's `vrf-export`
 *                     carries this exact literal)
 *   $INSTANCE_NAME   e.g. METRO_BGPv6_L3VPN_2201
 *   $CE_PREFIX_1     e.g. 2001::13:3:0:0/64
 *   $CE_PREFIX_2     e.g. 2001::15:3:0:0/64
 *   $CE_PREFIX_3     e.g. 2001::16:3:0:0/64
 *   $CE_PREFIX_4     e.g. 2001::115:3:0:0/64
 */
policy-options {
    policy-statement $EXPORT_POL {
        term tag-public-routes {
            from {
                family inet6;
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
        term tag-default {
            then {
                community add $INSTANCE_NAME;
                accept;
            }
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
 *  - A single term matches four customer aggregates `orlonger`, so the
 *    customer's more-specifics are carried too, and tags each accepted route
 *    with CM-L3VPN-PUB and the VRF's own route-target community.
 *  - `CM-L3VPN-PUB` marks the route as a public L3VPN prefix for the fabric.
 *  - There is no `term tag-default`, so the VRF exports only the four tagged
 *    aggregates and never a default route.
 *  - The configured policy name varies per service; the VRF that uses the
 *    policy carries that exact literal in its `vrf-export` statement.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-l3vpn-pub.conf
 *  - evo/policy-options/community/cm-l3vpn.conf
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from an3_acx7100-48l / METRO_L3VPN_4000):
 *   $EXPORT_POL      e.g. PS-METRO_L3VPN_4000-EXPORT
 *                    (the configured policy name; the VRF's `vrf-export`
 *                     carries this exact literal)
 *   $INSTANCE_NAME   e.g. METRO_L3VPN_4000
 *   $CE_PREFIX_1     e.g. 40.2.0.0/16
 *   $CE_PREFIX_2     e.g. 41.2.0.0/16
 *   $CE_PREFIX_3     e.g. 43.2.0.0/16
 *   $CE_PREFIX_4     e.g. 44.2.0.0/16
 */
policy-options {
    policy-statement $EXPORT_POL {
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

## evo/policy-options/policy-statement/ps-import-l3vpn-internet.conf

```
/*
 * Topic:   L3VPN vrf-import policy — accept the per-VRF community and the shared Internet default
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - Two ordered terms. `L3VPN-CUST` accepts routes carrying the VRF's own
 *    route-target community. `INTERNET` accepts routes carrying
 *    CM-INET-DEFAULT, which pulls the shared Internet default into the VRF.
 *  - The configured policy name varies per service; the VRF that uses the
 *    policy carries that exact literal in its `vrf-import` statement.
 *  - The per-VRF community is defined under policy-options community and
 *    carries the routing instance's own name.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-inet-default.conf
 *
 * Variables (example values from an3_acx7100-48l / METRO_BGPv4_L3VPN_2101):
 *   $IMPORT_POL      e.g. PS-METRO_BGPv4_L3VPN_2101-IMPORT
 *                    (the configured policy name; the VRF's `vrf-import`
 *                     carries this exact literal)
 *   $INSTANCE_NAME   e.g. METRO_BGPv4_L3VPN_2101
 */
policy-options {
    policy-statement $IMPORT_POL {
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

## evo/policy-options/policy-statement/ps-import-l3vpn.conf

```
/*
 * Topic:   L3VPN vrf-import policy — accept the per-VRF community only
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - A single term accepts routes carrying the VRF's own route-target
 *    community and nothing else. There is no `term INTERNET`, so no shared
 *    Internet default is imported into the VRF.
 *  - The configured policy name varies per service; the VRF that uses the
 *    policy carries that exact literal in its `vrf-import` statement.
 *  - The per-VRF community is defined under policy-options community and
 *    carries the routing instance's own name.
 *
 * Pair with:
 *  - evo/policy-options/community/cm-l3vpn.conf
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from an3_acx7100-48l / METRO_L3VPN_4000):
 *   $IMPORT_POL      e.g. PS-METRO_L3VPN_4000-IMPORT
 *                    (the configured policy name; the VRF's `vrf-import`
 *                     carries this exact literal)
 *   $INSTANCE_NAME   e.g. METRO_L3VPN_4000
 */
policy-options {
    policy-statement $IMPORT_POL {
        term L3VPN-CUST {
            from community $INSTANCE_NAME;
            then accept;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-isis-export-core.conf

```
/*
 * Topic:   IS-IS export policy PS-ISIS-EXPORT carrying the node loopbacks, the core links and the core summary
 * Seen on:
 *   Junos: an1_mx204 an4_acx710
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `term OOB-MGMT` rejects anything learned on the out-of-band management
 *    interfaces before the loopback terms are reached.
 *  - `term LOCAL-LOOPBACK-IPV4` accepts the node's own lo0 /32, tags it 101 and
 *    attaches the node segment together with the flex-algorithm 128 and 129
 *    prefix segments, so the loopback is reachable on all three algorithms.
 *  - `term LOCAL-LOOPBACK-IPV6` accepts the matching IPv6 loopback with the
 *    same tag.
 *  - `term DIRECT-ROUTES-IPV4` accepts the connected /30s inside the core-link
 *    supernet, so the point-to-point links are carried in IS-IS.
 *  - `term CORE-SUMMARY` rejects the locally generated aggregate tagged 1000 or
 *    1001 with `tag2 0`, keeping the summary out of the flooded database.
 *  - `term REJECT` terminates the policy.
 *
 * Variables (example values from an1_mx204):
 *   $LOOPBACK_V4          e.g. 1.1.0.0
 *   $SR_INDEX_ALGO128     e.g. 500
 *   $SR_INDEX_ALGO129     e.g. 600
 *   $SR_INDEX             e.g. 900
 *   $LOOPBACK_V6          e.g. 2001::1:1:0:0
 *   $CORE_LINK_SUPERNET   e.g. 10.10.0.0/24
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
                tag 101;
                prefix-segment {
                    algorithm 128 index $SR_INDEX_ALGO128 node-segment;
                    algorithm 129 index $SR_INDEX_ALGO129 node-segment;
                    index $SR_INDEX;
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
                tag 101;
                accept;
            }
        }
        term DIRECT-ROUTES-IPV4 {
            from {
                protocol direct;
                route-filter $CORE_LINK_SUPERNET prefix-length-range /30-/30;
            }
            then accept;
        }
        term CORE-SUMMARY {
            from {
                protocol aggregate;
                tag [ 1000 1001 ];
                tag2 0;
            }
            then reject;
        }
        term REJECT {
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-isis-export-loopbacks.conf

```
/*
 * Topic:   IS-IS export policy PS-ISIS-EXPORT carrying the node loopbacks, ending after the loopback terms
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509
 *
 * Highlights:
 *  - `term OOB-MGMT` rejects anything learned on the out-of-band management
 *    interfaces before the loopback terms are reached.
 *  - `term LOCAL-LOOPBACK-IPV4` accepts the node's own lo0 /32, tags it 101 and
 *    attaches the node segment together with the flex-algorithm 128 and 129
 *    prefix segments, so the loopback is reachable on all three algorithms.
 *  - `term LOCAL-LOOPBACK-IPV6` accepts the matching IPv6 loopback with the
 *    same tag.
 *  - The policy ends after the loopback terms, so everything it does not match
 *    falls through to the IS-IS default action.
 *
 * Variables (example values from mdr2_mx10003):
 *   $LOOPBACK_V4        e.g. 1.1.0.13
 *   $SR_INDEX_ALGO128   e.g. 513
 *   $SR_INDEX_ALGO129   e.g. 613
 *   $SR_INDEX           e.g. 913
 *   $LOOPBACK_V6        e.g. 2001::1:1:0:d
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
                tag 101;
                prefix-segment {
                    algorithm 128 index $SR_INDEX_ALGO128 node-segment;
                    algorithm 129 index $SR_INDEX_ALGO129 node-segment;
                    index $SR_INDEX;
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
                tag 101;
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-isis-export.conf

```
/*
 * Topic:   IS-IS export policy PS-ISIS-EXPORT carrying the node loopbacks with their prefix segments
 * Seen on:
 *   Junos: an2_acx5448 ma2_mx204 ma4_mx204 ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l
 *
 * Highlights:
 *  - `term OOB-MGMT` rejects anything learned on the out-of-band management
 *    interfaces before the loopback terms are reached.
 *  - `term LOCAL-LOOPBACK-IPV4` accepts the node's own lo0 /32, tags it 101 and
 *    attaches the node segment together with the flex-algorithm 128 and 129
 *    prefix segments, so the loopback is reachable on all three algorithms.
 *  - `term LOCAL-LOOPBACK-IPV6` accepts the matching IPv6 loopback with the
 *    same tag.
 *  - `term REJECT` terminates the policy, so IS-IS advertises only the two
 *    loopbacks.
 *
 * Variables (example values from an2_acx5448):
 *   $LOOPBACK_V4        e.g. 1.1.0.1
 *   $SR_INDEX_ALGO128   e.g. 501
 *   $SR_INDEX_ALGO129   e.g. 601
 *   $SR_INDEX           e.g. 901
 *   $LOOPBACK_V6        e.g. 2001::1:1:0:1
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
                tag 101;
                prefix-segment {
                    algorithm 128 index $SR_INDEX_ALGO128 node-segment;
                    algorithm 129 index $SR_INDEX_ALGO129 node-segment;
                    index $SR_INDEX;
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
                tag 101;
                accept;
            }
        }
        term REJECT {
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-loopback-allow.conf

```
/*
 * Topic:   Single-term policy accepting a prefix and its more-specifics
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - One unnamed term matches the prefix `orlonger` and accepts it, so the
 *    prefix and every more-specific inside it pass.
 *  - The configured policy name is a value: a node may carry this same body
 *    under more than one name.
 *
 * Variables (example values from an1_mx204):
 *   $POLICY_NAME   e.g. ALLOW_LOOPBACK
 *                  (the configured policy name; configuration that references
 *                   the policy carries this exact literal)
 *   $PREFIX        e.g. 0.0.0.0/32
 */
policy-options {
    policy-statement $POLICY_NAME {
        from {
            route-filter $PREFIX orlonger;
        }
        then accept;
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

## evo/policy-options/policy-statement/ps-multipath.conf

```
/*
 * Topic:   Recursive multipath resolution policy
 * Seen on:
 *   Junos: an1_mx204 ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 * Pair with: none
 * Variables: none
 */
policy-options {
    policy-statement PS-MULTIPATH {
        term recursive-resolution {
            then multipath-resolve;
        }
    }
}```

## evo/policy-options/policy-statement/ps-prefix-sid.conf

```
/*
 * Topic:   Policy prefix-sid attaching the node and flex-algorithm prefix segments to the loopback
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - A single term matches the node's own loopback /32 `exact`.
 *  - `prefix-segment` assigns the node segment index and one prefix segment per
 *    flex-algorithm, so the loopback carries a prefix SID on algorithm 0, 128
 *    and 129.
 *
 * Variables (example values from an1_mx204):
 *   $LOOPBACK_V4        e.g. 1.1.0.0
 *   $SR_INDEX_ALGO128   e.g. 500
 *   $SR_INDEX_ALGO129   e.g. 600
 *   $SR_INDEX           e.g. 900
 */
policy-options {
    policy-statement prefix-sid {
        term 1 {
            from {
                route-filter $LOOPBACK_V4/32 exact;
            }
            then {
                prefix-segment {
                    algorithm 128 index $SR_INDEX_ALGO128 node-segment;
                    algorithm 129 index $SR_INDEX_ALGO129 node-segment;
                    index $SR_INDEX;
                    node-segment;
                }
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-sr-nonzero-loopback-v4.conf

```
/*
 * Topic:   Policy SR_NONZERO_LOOPBACKS_V4 attaching a prefix segment to the IPv4 SR loopback
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - A `/32 exact` route-filter selects the node's Segment Routing IPv4
 *    loopback, distinct from the primary loopback.
 *  - `prefix-segment index` assigns that address its own SR index and accepts
 *    it, so the SR loopback is advertised with a prefix SID of its own.
 *
 * Variables (example values from an1_mx204):
 *   $LOOPBACK_SR_V4   e.g. 1.1.10.0
 *   $SR_INDEX_V4      e.g. 200
 */
policy-options {
    policy-statement SR_NONZERO_LOOPBACKS_V4 {
        term t1 {
            from {
                route-filter $LOOPBACK_SR_V4/32 exact;
            }
            then {
                prefix-segment {
                    index $SR_INDEX_V4;
                }
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-sr-nonzero-loopback-v6.conf

```
/*
 * Topic:   Policy SR_NONZERO_LOOPBACKS_V6 attaching a prefix segment to the IPv6 SR loopback
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `from family inet6` with a `/128 exact` route-filter selects the node's
 *    Segment Routing IPv6 loopback, distinct from the primary loopback.
 *  - `prefix-segment index` assigns that address its own SR index and accepts
 *    it, so the SR loopback is advertised with a prefix SID of its own.
 *
 * Variables (example values from an1_mx204):
 *   $LOOPBACK_SR_V6   e.g. 2001::1:1:10:0
 *   $SR_INDEX_V6      e.g. 300
 */
policy-options {
    policy-statement SR_NONZERO_LOOPBACKS_V6 {
        term t1 {
            from {
                family inet6;
                route-filter $LOOPBACK_SR_V6/128 exact;
            }
            then {
                prefix-segment {
                    index $SR_INDEX_V6;
                }
                accept;
            }
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

## evo/protocols/esis-disable.conf

```
/*
 * Topic:   esis
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   meg1_acx7100-32c
 * Pair with: none
 * Variables: none
 */
protocols {
    esis {
        disable;
    }
}
```

## evo/protocols/isis-instance-intf-l2-bfd-mdr1.conf

```
/*
 * Topic:   IS-IS logical interface
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   ma3_acx7100-48l mdr1_acx7509
 * Variables:
 *   $CORE_INTF   e.g. ae82.1
 *   $DELAY_METRIC   e.g. 5
 *   $ISIS_INSTANCE   e.g. metro-a
 *   $TE_METRIC   e.g. 5
 */
protocols {
  isis-instance $ISIS_INSTANCE {
    interface $CORE_INTF {
      level 1 disable;
      level 2 {
        post-convergence-lfa {
          node-protection cost 16777214;
        }
        application-specific {
          attribute-group ASLA {
            advertise-delay-metric;
            te-metric $TE_METRIC;
            admin-group [ green blue ];
            application {
              flex-algorithm;
            }
          }
        }
      }
      delay-metric $DELAY_METRIC;
      point-to-point;
      family inet {
        bfd-liveness-detection {
          minimum-interval 100;
          multiplier 3;
          no-adaptation;
        }
      }
    }
  }
}
```

## evo/protocols/isis-instance-intf-l2-bfd.conf

```
/*
 * Topic:   IS-IS logical interface
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   ma3_acx7100-48l mdr1_acx7509
 * Variables:
 *   $ADMIN_GROUP_1   e.g. green
 *   $ADMIN_GROUP_2   e.g. blue
 *   $CORE_INTF   e.g. ae55.1
 *   $ISIS_INSTANCE   e.g. metro-a
 */
protocols {
  isis-instance $ISIS_INSTANCE {
    interface $CORE_INTF {
      level 2 {
        post-convergence-lfa {
          node-protection cost 16777214;
        }
        application-specific {
          attribute-group ASLA {
            advertise-delay-metric;
            te-metric 5;
            admin-group [ $ADMIN_GROUP_1 $ADMIN_GROUP_2 ];
            application {
              flex-algorithm;
            }
          }
        }
      }
      level 1 disable;
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
  }
}
```

## evo/protocols/isis-instance-intf-l2-metric-bfd.conf

```
/*
 * Topic:   IS-IS logical interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma3_acx7100-48l
 * Variables:
 *   $CORE_INTF   e.g. ae55.2
 *   $ISIS_INSTANCE   e.g. metro-b
 */
protocols {
  isis-instance $ISIS_INSTANCE {
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
        metric 15;
      }
      level 1 disable;
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
  }
}
```

## evo/protocols/isis-instance-l2-export.conf

```
/*
 * Topic:   IS-IS SR-MPLS process settings
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509
 * Variables:
 *   $EXPORT_POLICY   e.g. export_isis_metro_a_ribs
 *   $ISIS_INSTANCE   e.g. metro-b
 *   $ISIS_NET   e.g. 49.0002.0010.0100.0012.00
 *   $NODE_SID_V4   e.g. 12
 *   $NODE_SID_V6   e.g. 112
 */
protocols {
  isis-instance $ISIS_INSTANCE {
    apply-groups GR-ISIS-BCP;
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
    level 2 wide-metrics-only;
    level 1 disable;
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
    export [ PS-ISIS-EXPORT $EXPORT_POLICY ];
    net $ISIS_NET;
  }
}
```

## evo/protocols/isis-instance-l2-net.conf

```
/*
 * Topic:   IS-IS SR-MPLS process settings
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma3_acx7100-48l
 * Variables:
 *   $ISIS_INSTANCE   e.g. metro-a
 *   $ISIS_NET   e.g. 49.0001.0010.0100.0015.00
 *   $NODE_SID_V4   e.g. 15
 *   $NODE_SID_V6   e.g. 115
 */
protocols {
  isis-instance $ISIS_INSTANCE {
    apply-groups GR-ISIS-BCP;
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
    level 2 wide-metrics-only;
    level 1 disable;
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

## evo/protocols/isis-instance-loopback-passive.conf

```
/*
 * Topic:   IS-IS logical interface
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   ma3_acx7100-48l mdr1_acx7509
 * Variables:
 *   $ISIS_INSTANCE   e.g. metro-a
 */
protocols {
  isis-instance $ISIS_INSTANCE {
    interface lo0.0 {
      passive;
    }
  }
}
```

## evo/protocols/isis-interface-1-te-metric-10-admin-group-blue-delay-metric-10-bfd.conf

```
/*
 * Topic:   ISIS core interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1-1_acx7100-32c
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. et-0/0/14.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 10;
                        admin-group blue;
                        application {
                            flex-algorithm;
                        }
                    }
                }
            }
            delay-metric 10;
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
    }
}
```

## evo/protocols/isis-interface-1-te-metric-10-admin-group-green-delay-metric-10-bfd.conf

```
/*
 * Topic:   ISIS core interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1-1_acx7100-32c
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. et-0/0/34.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 10;
                        admin-group green;
                        application {
                            flex-algorithm;
                        }
                    }
                }
            }
            delay-metric 10;
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
    }
}
```

## evo/protocols/isis-interface-1-te-metric-110-admin-group-blue-metric-15-delay-metric-105-asla.conf

```
/*
 * Topic:   ISIS core interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 * Pair with:
 *  - evo/interfaces/ifl-core-description-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. ae23.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 110;
                        admin-group blue;
                        application {
                            flex-algorithm;
                        }
                    }
                }
                metric 15;
            }
            delay-metric 105;
            point-to-point;
        }
    }
}
```

## evo/protocols/isis-interface-1-te-metric-110-admin-group-blue-metric-25-delay-metric-105-asla.conf

```
/*
 * Topic:   ISIS core interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. ae26.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 110;
                        admin-group blue;
                        application {
                            flex-algorithm;
                        }
                    }
                }
                metric 25;
            }
            delay-metric 105;
            point-to-point;
        }
    }
}
```

## evo/protocols/isis-interface-1-te-metric-110-admin-group-green-blue-delay-metric-105-bfd.conf

```
/*
 * Topic:   ISIS core interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1-1_acx7100-32c
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. ae71.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 110;
                        admin-group [ green blue ];
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
    }
}
```

## evo/protocols/isis-interface-1-te-metric-110-admin-group-green-delay-metric-105-bfd.conf

```
/*
 * Topic:   ISIS core interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1-2_acx7100-32c
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. ae25.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 110;
                        admin-group green;
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
    }
}
```

## evo/protocols/isis-interface-1-te-metric-15-admin-group-blue-delay-metric-8-bfd.conf

```
/*
 * Topic:   ISIS core interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1-1_acx7100-32c
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-5.conf
 * Variables:
 *   $CORE_INTF   e.g. et-0/0/13.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 15;
                        admin-group blue;
                        application {
                            flex-algorithm;
                        }
                    }
                }
            }
            delay-metric 8;
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
    }
}
```

## evo/protocols/isis-interface-1-te-metric-15-admin-group-blue-green-delay-metric-10-bfd.conf

```
/*
 * Topic:   ISIS core interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1-2_acx7100-32c
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. et-0/0/32.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 15;
                        admin-group [ blue green ];
                        application {
                            flex-algorithm;
                        }
                    }
                }
            }
            delay-metric 10;
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
    }
}
```

## evo/protocols/isis-interface-1-te-metric-15-admin-group-green-delay-metric-8-bfd.conf

```
/*
 * Topic:   ISIS core interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. et-0/0/32.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 15;
                        admin-group green;
                        application {
                            flex-algorithm;
                        }
                    }
                }
            }
            delay-metric 8;
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
    }
}
```

## evo/protocols/isis-interface-2-1-disable-te-metric-10-admin-group-blue-green-delay-metric-10-bfd.conf

```
/*
 * Topic:   ISIS core interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   mdr1_acx7509 meg2_acx7509
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. et-1/0/4.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 2 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 10;
                        admin-group [ blue green ];
                        application {
                            flex-algorithm;
                        }
                    }
                }
            }
            level 1 disable;
            delay-metric 10;
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
    }
}
```

## evo/protocols/isis-interface-2-te-metric-10-admin-group-green-blue-delay-metric-10-bfd.conf

```
/*
 * Topic:   ISIS core interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr1_ptx10001-36mr
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. et-0/1/2.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 2 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 10;
                        admin-group [ green blue ];
                        application {
                            flex-algorithm;
                        }
                    }
                }
            }
            delay-metric 10;
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
    }
}
```

## evo/protocols/isis-interface-2-te-metric-5-admin-group-blue-green-delay-metric-5-bfd.conf

```
/*
 * Topic:   ISIS core interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma1-2_acx7024
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. ae84.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 2 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 5;
                        admin-group [ blue green ];
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
    }
}
```

## evo/protocols/isis-interface-2-te-metric-5-admin-group-blue-green-metric-15-delay-metric-5-bfd.conf

```
/*
 * Topic:   ISIS core interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma1-2_acx7024
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. ae88.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 2 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 5;
                        admin-group [ blue green ];
                        application {
                            flex-algorithm;
                        }
                    }
                }
                metric 15;
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
    }
}
```

## evo/protocols/isis-interface-2-te-metric-5-admin-group-green-blue-metric-15-delay-metric-5-bfd.conf

```
/*
 * Topic:   ISIS core interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma1-1_acx7024
 * Pair with:
 *  - evo/interfaces/core-isis-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. ae88.0
 */
protocols {
    isis {
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
                metric 15;
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
    }
}
```

## evo/protocols/isis-intf-l1-bfd-meg2.conf

```
/*
 * Topic:   ISIS interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg2_acx7509
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. et-1/0/14.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 40;
                        admin-group green;
                        application {
                            flex-algorithm;
                        }
                    }
                }
            }
            level 2 disable;
            delay-metric 8;
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
    }
}
```

## evo/protocols/isis-intf-l1-groups-bfd.conf

```
/*
 * Topic:   IS-IS logical interface
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c
 * Variables:
 *   $ADMIN_GROUP_1   e.g. green
 *   $ADMIN_GROUP_2   e.g. blue
 *   $CORE_INTF   e.g. ae71.0
 *   $DELAY_METRIC   e.g. 105
 *   $TE_METRIC   e.g. 110
 */
protocols {
  isis {
    interface $CORE_INTF {
      level 1 {
        post-convergence-lfa {
          node-protection cost 16777214;
        }
        application-specific {
          attribute-group ASLA {
            advertise-delay-metric;
            te-metric $TE_METRIC;
            admin-group [ $ADMIN_GROUP_1 $ADMIN_GROUP_2 ];
            application {
              flex-algorithm;
            }
          }
        }
      }
      delay-metric $DELAY_METRIC;
      point-to-point;
      family inet {
        bfd-liveness-detection {
          minimum-interval 100;
          multiplier 3;
          no-adaptation;
        }
      }
    }
  }
}
```

## evo/protocols/isis-intf-l1-groups-metric-bfd.conf

```
/*
 * Topic:   ISIS interface with administrative-group list
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg1_acx7100-32c
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. et-0/0/35.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 10;
                        admin-group [ green blue ];
                        application {
                            flex-algorithm;
                        }
                    }
                }
                metric 20;
            }
            level 2 disable;
            delay-metric 10;
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
    }
}
```

## evo/protocols/isis-intf-l1-metric-an3.conf

```
/*
 * Topic:   ISIS interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. ae24.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 110;
                        admin-group green;
                        application {
                            flex-algorithm;
                        }
                    }
                }
                metric 20;
            }
            delay-metric 105;
            inactive: delay-measurement;
            point-to-point;
        }
    }
}
```

## evo/protocols/isis-intf-l1-metric-bfd-ag1-1.conf

```
/*
 * Topic:   ISIS interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1-1_acx7100-32c
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. ae24.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 110;
                        admin-group green;
                        application {
                            flex-algorithm;
                        }
                    }
                }
                metric 20;
            }
            delay-metric 105;
            inactive: delay-measurement;
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
    }
}
```

## evo/protocols/isis-intf-l1-metric-bfd-meg1.conf

```
/*
 * Topic:   ISIS interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg1_acx7100-32c meg2_acx7509
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $ADMIN_GROUP   e.g. green
 *   $CORE_INTF   e.g. et-0/0/33.0
 *   $DELAY_METRIC   e.g. 8
 *   $ISIS_METRIC   e.g. 10
 *   $TE_METRIC   e.g. 10
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric $TE_METRIC;
                        admin-group $ADMIN_GROUP;
                        application {
                            flex-algorithm;
                        }
                    }
                }
                metric $ISIS_METRIC;
            }
            level 2 disable;
            delay-metric $DELAY_METRIC;
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
    }
}
```

## evo/protocols/isis-intf-l1-metric-bfd.conf

```
/*
 * Topic:   ISIS interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c meg1_acx7100-32c
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. ae23.0
 *   $DELAY_METRIC   e.g. 105
 *   $ISIS_METRIC   e.g. 15
 *   $TE_METRIC   e.g. 110
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric $TE_METRIC;
                        admin-group blue;
                        application {
                            flex-algorithm;
                        }
                    }
                }
                metric $ISIS_METRIC;
            }
            delay-metric $DELAY_METRIC;
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
    }
}
```

## evo/protocols/isis-intf-l1.conf

```
/*
 * Topic:   ISIS interface
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. ae25.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 110;
                        admin-group green;
                        application {
                            flex-algorithm;
                        }
                    }
                }
            }
            delay-metric 105;
            point-to-point;
        }
    }
}
```

## evo/protocols/isis-intf-l2-bfd-mdr1.conf

```
/*
 * Topic:   ISIS interface
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $ADMIN_GROUP   e.g. blue
 *   $CORE_INTF   e.g. et-1/0/3.0
 *   $DELAY_METRIC   e.g. 8
 *   $TE_METRIC   e.g. 25
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 2 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric $TE_METRIC;
                        admin-group $ADMIN_GROUP;
                        application {
                            flex-algorithm;
                        }
                    }
                }
            }
            level 1 disable;
            delay-metric $DELAY_METRIC;
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
    }
}
```

## evo/protocols/isis-intf-l2-bfd.conf

```
/*
 * Topic:   ISIS interface
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $ADMIN_GROUP   e.g. blue
 *   $CORE_INTF   e.g. et-0/0/6.0
 *   $DELAY_METRIC   e.g. 5
 *   $TE_METRIC   e.g. 40
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 2 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric $TE_METRIC;
                        admin-group $ADMIN_GROUP;
                        application {
                            flex-algorithm;
                        }
                    }
                }
            }
            delay-metric $DELAY_METRIC;
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
    }
}
```

## evo/protocols/isis-intf-l2-groups-bfd-mdr1.conf

```
/*
 * Topic:   IS-IS logical interface
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509 meg2_acx7509
 * Variables:
 *   $ADMIN_GROUP_1   e.g. blue
 *   $ADMIN_GROUP_2   e.g. green
 *   $CORE_INTF   e.g. et-1/0/4.0
 *   $TE_METRIC   e.g. 10
 */
protocols {
  isis {
    interface $CORE_INTF {
      level 2 {
        post-convergence-lfa {
          node-protection cost 16777214;
        }
        application-specific {
          attribute-group ASLA {
            advertise-delay-metric;
            te-metric $TE_METRIC;
            admin-group [ $ADMIN_GROUP_1 $ADMIN_GROUP_2 ];
            application {
              flex-algorithm;
            }
          }
        }
      }
      level 1 disable;
      delay-metric 10;
      point-to-point;
      family inet {
        bfd-liveness-detection {
          minimum-interval 100;
          multiplier 3;
          no-adaptation;
        }
      }
    }
  }
}
```

## evo/protocols/isis-loopback-passive.conf

```
/*
 * Topic:   IS-IS logical interface
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Variables: none
 */
protocols {
  isis {
    interface lo0.0 {
      passive;
    }
  }
}
```

## evo/protocols/isis-source-packet-routing-enable.conf

```
/*
 * Topic:   ISIS source-packet-routing
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma3_acx7100-48l
 * Pair with:
 *  - evo/groups/gr-isis-bcp.conf
 * Variables: none
 */
protocols {
    isis {
        apply-groups GR-ISIS-BCP;
        source-packet-routing;
    }
}
```

## evo/protocols/isis-srmpls-tilfa-l1-bfd-group-max-lsp-8000.conf

```
/*
 * Topic:   ISIS source-packet-routing
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l
 * Pair with:
 *  - evo/groups/gr-isis-bcp.conf
 *  - evo/groups/gr-isis-bfd.conf
 *  - evo/policy-options/policy-statement/ps-isis-export-core.conf
 * Variables:
 *   $NODE_SID_V4   e.g. 2
 *   $NODE_SID_V6   e.g. 102
 */
protocols {
    isis {
        apply-groups [ GR-ISIS-BCP GR-ISIS-BFD ];
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
            max-lsp-size 8000;
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
    }
}
```

## evo/protocols/isis-srmpls-tilfa-l1-l2.conf

```
/*
 * Topic:   ISIS source-packet-routing
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg1_acx7100-32c meg2_acx7509
 * Pair with:
 *  - evo/groups/gr-isis-bcp.conf
 *  - evo/policy-options/policy-statement/ps-isis-export-core.conf
 * Variables:
 *   $NODE_SID_V4   e.g. 6
 *   $NODE_SID_V6   e.g. 106
 */
protocols {
    isis {
        apply-groups GR-ISIS-BCP;
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
        level 1 wide-metrics-only;
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
    }
}
```

## evo/protocols/isis-srmpls-tilfa-l1-max-lsp-8000.conf

```
/*
 * Topic:   ISIS source-packet-routing
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c
 * Pair with:
 *  - evo/groups/gr-isis-interface-spf.conf
 *  - evo/policy-options/policy-statement/ps-isis-export-core.conf
 * Variables:
 *   $NODE_SID_V4   e.g. 4
 *   $NODE_SID_V6   e.g. 104
 */
protocols {
    isis {
        apply-groups GR-ISIS-BCP;
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
            max-lsp-size 8000;
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
    }
}
```

## evo/protocols/isis-srmpls-tilfa-l2-net-mdr1.conf

```
/*
 * Topic:   ISIS source-packet-routing
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509
 * Pair with:
 *  - evo/groups/gr-isis-bcp.conf
 *  - evo/policy-options/policy-statement/ps-isis-export-loopbacks.conf
 * Variables:
 *   $ISIS_NET   e.g. 49.0005.0010.0100.0012.00
 *   $NODE_SID_V4   e.g. 12
 *   $NODE_SID_V6   e.g. 112
 */
protocols {
    isis {
        apply-groups GR-ISIS-BCP;
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
        level 2 wide-metrics-only;
        level 1 disable;
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

## evo/protocols/isis-srmpls-tilfa-l2-net.conf

```
/*
 * Topic:   ISIS source-packet-routing
 * Seen on:
 *   Junos: ma2_mx204 ma4_mx204 ma5_mx204
 *   EVO:   ma1-1_acx7024 ma1-2_acx7024
 * Pair with:
 *  - evo/groups/gr-isis-bcp.conf
 *  - evo/policy-options/policy-statement/ps-isis-export.conf
 * Variables:
 *   $ISIS_NET   e.g. 49.0001.0010.0100.0018.00
 *   $NODE_SID_V4   e.g. 18
 *   $NODE_SID_V6   e.g. 118
 */
protocols {
    isis {
        apply-groups GR-ISIS-BCP;
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

## evo/protocols/isis-srmpls-tilfa-l2-sensor-stats.conf

```
/*
 * Topic:   ISIS source-packet-routing
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr2_ptx10001-36mr
 * Pair with:
 *  - evo/groups/gr-isis-bcp.conf
 *  - evo/policy-options/policy-statement/ps-isis-export.conf
 * Variables:
 *   $NODE_SID_V4   e.g. 9
 *   $NODE_SID_V6   e.g. 109
 */
protocols {
    isis {
        apply-groups GR-ISIS-BCP;
        source-packet-routing {
            node-segment {
                ipv4-index $NODE_SID_V4;
                ipv6-index $NODE_SID_V6;
            }
            flex-algorithm [ 128 129 ];
            strict-asla-based-flex-algorithm;
            explicit-null;
            sensor-based-stats {
                per-sid ingress egress;
            }
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
    }
}
```

## evo/protocols/isis-srmpls-tilfa-l2.conf

```
/*
 * Topic:   ISIS source-packet-routing
 * Seen on:
 *   Junos: ma2_mx204 ma4_mx204 ma5_mx204
 *   EVO:   cr1_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024
 * Pair with:
 *  - evo/groups/gr-isis-bcp.conf
 *  - evo/policy-options/policy-statement/ps-isis-export.conf
 * Variables:
 *   $NODE_SID_V4   e.g. 8
 *   $NODE_SID_V6   e.g. 108
 */
protocols {
    isis {
        apply-groups GR-ISIS-BCP;
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

## evo/protocols/ldp-loopback.conf

```
/*
 * Topic:   LDP loopback interface
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 * Variables: none
 */
protocols {
  ldp {
    interface lo0.0;
  }
}
```

## evo/protocols/mpls-controller-pccd.conf

```
/*
 * Topic:   MPLS controller and segment-routing settings
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr2_ptx10001-36mr
 * Pair with:
 *  - evo/protocols/pcep-pccd.conf
 * Variables: none
 */
protocols {
  mpls {
    lsp-external-controller pccd;
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

## evo/protocols/mpls-segment-routing.conf

```
/*
 * Topic:   MPLS segment-routing global configuration
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Variant group: mebs-mpls-admin-groups
 *   Provides: transport:mpls-admin-groups
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
 * Pair with: none
 *
 * Variables: none
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

## evo/protocols/oam-cfm-continuity-check.conf

```
/*
 * Topic:   CFM maintenance association whose configuration is its continuity check
 * Seen on:
 *   Junos: (none)
 *   EVO:   meg1_acx7100-32c
 *
 * Highlights:
 *  - One maintenance-association under the CFM maintenance-domain, carrying a
 *    continuity check and nothing else.
 *  - `interval 1s` sends a continuity-check message every second, so loss of
 *    the association is detected within a few seconds.
 *
 * Variables (example values from meg1_acx7100-32c):
 *   $MD_NAME   e.g. MD_63535
 *   $MA_ID     e.g. 12009
 */
protocols {
    oam {
        ethernet {
            connectivity-fault-management {
                maintenance-domain $MD_NAME {
                    maintenance-association $MA_ID {
                        continuity-check {
                            interval 1s;
                        }
                    }
                }
            }
        }
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

## evo/protocols/pcep-pccd.conf

```
/*
 * Topic:   Stateful PCEP controller
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr2_ptx10001-36mr
 * Variables: none
 */
protocols {
  pcep {
    disable-multipath-capability;
    pce pccd {
      destination-ipv4-address 10.83.151.45;
      destination-port 4189;
      pce-type active stateful;
      lsp-provisioning;
      p2mp-lsp-report-capability;
      p2mp-lsp-update-capability;
      p2mp-lsp-init-capability;
      lsp-cleanup-timer 10;
      spring-capability;
      delegation-cleanup-timeout 10;
    }
  }
}
```

## evo/protocols/sr-controller-pccd.conf

```
/*
 * Topic:   Segment-routing external controller
 * Seen on:
 *   Junos: (none)
 *   EVO:   cr2_ptx10001-36mr
 * Pair with:
 *  - evo/protocols/pcep-pccd.conf
 * Variables: none
 */
protocols {
  source-packet-routing {
    lsp-external-controller pccd;
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
 *  - variant:mebs-fatpw-label-form capabilities=gr:fatpw-label
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
 *  - variant:mebs-fatpw-label-form capabilities=gr:fatpw-label
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
 *  - variant:mebs-irb-form capabilities=ifl:irb
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

## evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle-2-uni-export.conf

```
/*
 * Topic:   EVPN-ELAN MAC-VRF, VLAN-bundle service with two attachment circuits and a VRF export policy
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `instance-type mac-vrf` with `service-type vlan-bundle` maps the whole
 *    bundle of VLANs on the bridge to one EVPN instance and one label.
 *  - `encapsulation mpls` carries the EVPN over the MPLS transport rather than
 *    over VXLAN.
 *  - `vrf-export` applies a per-service policy on top of the `vrf-target`
 *    community, so this instance can tag its routes beyond the plain target.
 *    The policy carries the instance name.
 *  - The bridge attaches two attachment circuits. They are interchangeable, so
 *    one deployed instance has two equivalent bindings of this body.
 *  - The route-distinguisher is built from this node's loopback, so each PE
 *    advertises the shared service under its own RD.
 *
 * Pair with: none
 *
 * Variables (example values from an3_acx7100-48l):
 *   $INSTANCE_NAME      e.g. evpn_group_80_1062
 *                       (also the configured vrf-export policy name)
 *   $LOOPBACK_V4        e.g. 1.1.0.2
 *   $RD_SUB_ASSIGNED    e.g. 8062
 *   $RT_AS              e.g. 63535
 *   $RT_ID              e.g. 8062
 *   $BD_NAME            e.g. BD_evpn_group_80_1062
 *   $AC_INTF_A          e.g. et-0/0/50.1062
 *   $AC_INTF_B          e.g. et-0/0/50.1063
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
                interface $AC_INTF_A;
                interface $AC_INTF_B;
            }
        }
    }
}
```

## evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle-2-uni.conf

```
/*
 * Topic:   EVPN-ELAN MAC-VRF, VLAN-bundle service with two attachment circuits
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `instance-type mac-vrf` with `service-type vlan-bundle` maps the whole
 *    bundle of VLANs on the bridge to one EVPN instance and one label.
 *  - `encapsulation mpls` carries the EVPN over the MPLS transport rather than
 *    over VXLAN.
 *  - The bridge attaches two attachment circuits. They are interchangeable, so
 *    one deployed instance has two equivalent bindings of this body.
 *  - The route-distinguisher is built from this node's loopback, so each PE
 *    advertises the shared service under its own RD.
 *
 * Pair with: none
 *
 * Variables (example values from an3_acx7100-48l):
 *   $INSTANCE_NAME      e.g. evpn_group_80_1200
 *   $LOOPBACK_V4        e.g. 1.1.0.2
 *   $RD_SUB_ASSIGNED    e.g. 8200
 *   $RT_AS              e.g. 63535
 *   $RT_ID              e.g. 8200
 *   $BD_NAME            e.g. evpn_group_80_BD_70
 *   $AC_INTF_A          e.g. et-0/0/50.1200
 *   $AC_INTF_B          e.g. et-0/0/50.1201
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
        vrf-target target:$RT_AS:$RT_ID;
        vlans {
            $BD_NAME {
                interface $AC_INTF_A;
                interface $AC_INTF_B;
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

## evo/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-export.conf

```
/*
 * Topic:   VLAN-unaware EVPN-VPWS flexible cross-connect bundling two logical interfaces
 * Seen on:
 *   Junos: mse1_mx304
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - `flexible-cross-connect-vlan-unaware` bundles the listed logical
 *    interfaces into one cross-connect without regard to their VLAN tags, so
 *    the group is carried as a single VPWS service.
 *  - The `fxc` group names two logical interfaces on the same port and one
 *    `service-id` pair, whose `local` and `remote` values match this group to
 *    its counterpart on the far-end PE.
 *  - `vrf-export` names a per-instance policy, so this instance controls which
 *    routes it advertises rather than relying on the route target alone.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from an3_acx7100-48l / evpn_group_40_10):
 *   $INSTANCE_NAME      e.g. evpn_group_40_10
 *   $AC_INTF            e.g. et-0/0/0
 *   $UNIT_A             e.g. 1809
 *   $UNIT_B             e.g. 2309
 *   $SVC_ID_LOCAL       e.g. 1
 *   $SVC_ID_REMOTE      e.g. 2
 *   $LOOPBACK_V4        e.g. 1.1.0.2
 *   $RD_SUB_ASSIGNED    e.g. 410
 *   $RT_AS              e.g. 63535
 *   $RT_ID              e.g. 410
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
 *  - variant:mebs-edge-intf-form capabilities=gr:edge-intf
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
 *  - variant:mebs-edge-intf-form capabilities=gr:edge-intf
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
 *  - variant:mebs-edge-intf-form capabilities=gr:edge-intf
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

## evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni-export.conf

```
/*
 * Topic:   VLAN-aware EVPN-VPWS instance cross-connecting two attachment circuits, with vrf-export
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `flexible-cross-connect-vlan-aware` keeps the customer VLAN significant,
 *    so each attachment circuit is cross-connected as its own VLAN-aware
 *    service rather than being bundled port-wide.
 *  - Each circuit carries its own `vpws-service-id`, whose `local` and
 *    `remote` values pair it with the matching circuit on the far-end PE.
 *  - `vrf-export` names a per-instance policy, so this instance controls which
 *    routes it advertises rather than relying on the route target alone.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from ma1-1_acx7024 / evpn_group_50_1):
 *   $INSTANCE_NAME      e.g. evpn_group_50_1
 *   $AC_INTF_A          e.g. ae12.200
 *   $AC_INTF_B          e.g. ae12.250
 *   $SVC_ID_LOCAL_A     e.g. 2
 *   $SVC_ID_REMOTE_A    e.g. 1
 *   $SVC_ID_LOCAL_B     e.g. 22
 *   $SVC_ID_REMOTE_B    e.g. 11
 *   $LOOPBACK_V4        e.g. 1.1.0.17
 *   $RD_SUB_ASSIGNED    e.g. 501
 *   $RT_AS              e.g. 63536
 *   $RT_ID              e.g. 50100
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_INTF_A {
                    vpws-service-id {
                        local $SVC_ID_LOCAL_A;
                        remote $SVC_ID_REMOTE_A;
                    }
                }
                interface $AC_INTF_B {
                    vpws-service-id {
                        local $SVC_ID_LOCAL_B;
                        remote $SVC_ID_REMOTE_B;
                    }
                }
                flexible-cross-connect-vlan-aware;
            }
        }
        interface $AC_INTF_A;
        interface $AC_INTF_B;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf

```
/*
 * Topic:   VLAN-aware EVPN-VPWS instance cross-connecting two attachment circuits
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `flexible-cross-connect-vlan-aware` keeps the customer VLAN significant,
 *    so each attachment circuit is cross-connected as its own VLAN-aware
 *    service rather than being bundled port-wide.
 *  - Each circuit carries its own `vpws-service-id`, whose `local` and
 *    `remote` values pair it with the matching circuit on the far-end PE.
 *  - Advertisement is governed by the route target alone; the instance has no
 *    per-instance export policy.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from ma1-1_acx7024 / evpn_group_50_26):
 *   $INSTANCE_NAME      e.g. evpn_group_50_26
 *   $AC_INTF_A          e.g. ae12.225
 *   $AC_INTF_B          e.g. ae12.275
 *   $SVC_ID_LOCAL_A     e.g. 2
 *   $SVC_ID_REMOTE_A    e.g. 1
 *   $SVC_ID_LOCAL_B     e.g. 22
 *   $SVC_ID_REMOTE_B    e.g. 11
 *   $LOOPBACK_V4        e.g. 1.1.0.17
 *   $RD_SUB_ASSIGNED    e.g. 526
 *   $RT_AS              e.g. 63536
 *   $RT_ID              e.g. 52600
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_INTF_A {
                    vpws-service-id {
                        local $SVC_ID_LOCAL_A;
                        remote $SVC_ID_REMOTE_A;
                    }
                }
                interface $AC_INTF_B {
                    vpws-service-id {
                        local $SVC_ID_LOCAL_B;
                        remote $SVC_ID_REMOTE_B;
                    }
                }
                flexible-cross-connect-vlan-aware;
            }
        }
        interface $AC_INTF_A;
        interface $AC_INTF_B;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## evo/routing-instances/evpn-vpws/ri-evpn-vpws-2-uni-control-word.conf

```
/*
 * Topic:   EVPN-VPWS instance cross-connecting two attachment circuits with a control word
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma3_acx7100-48l
 *
 * Highlights:
 *  - `instance-type evpn-vpws` signals a point-to-point pseudowire in EVPN
 *    rather than in LDP or BGP L2VPN.
 *  - Each attachment circuit carries its own `vpws-service-id`, and the local
 *    and remote identifiers are mirrored between the two circuits, which is
 *    what joins them into one cross-connect inside this node.
 *  - `control-word` inserts the control word so the far end can tell a
 *    pseudowire payload from an IP payload when hashing.
 *  - Both circuits are also bound at instance level. They are interchangeable,
 *    so one deployed instance has two equivalent bindings of this body.
 *  - The route-distinguisher is built from this node's loopback, so each PE
 *    advertises the shared service under its own RD.
 *
 * Pair with: none
 *
 * Variables (example values from ma3_acx7100-48l):
 *   $INSTANCE_NAME      e.g. lsw_evpn_vpws_group_90_1000
 *   $AC_INTF_A          e.g. et-0/0/5.1000
 *   $SVC_ID_LOCAL_A     e.g. 22
 *   $SVC_ID_REMOTE_A    e.g. 11
 *   $AC_INTF_B          e.g. et-0/0/51.4000
 *   $SVC_ID_LOCAL_B     e.g. 11
 *   $SVC_ID_REMOTE_B    e.g. 22
 *   $LOOPBACK_V4        e.g. 1.1.0.15
 *   $RD_SUB_ASSIGNED    e.g. 9000
 *   $RT_AS              e.g. 63536
 *   $RT_ID              e.g. 9900
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_INTF_A {
                    vpws-service-id {
                        local $SVC_ID_LOCAL_A;
                        remote $SVC_ID_REMOTE_A;
                    }
                }
                interface $AC_INTF_B {
                    vpws-service-id {
                        local $SVC_ID_LOCAL_B;
                        remote $SVC_ID_REMOTE_B;
                    }
                }
                control-word;
            }
        }
        interface $AC_INTF_A;
        interface $AC_INTF_B;
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

## evo/routing-instances/l2vpn/ri-l2vpn-kompella-vlan-control-word-export.conf

```
/*
 * Topic:   BGP L2VPN instance with VLAN-preserving encapsulation and a control word, with vrf-export
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - A BGP-signalled (Kompella) L2VPN: the named site carries this node's site
 *    identifier, and the attachment circuit inside it names the remote site it
 *    is cross-connected to, so the pseudowire is addressed by site rather than
 *    by neighbour.
 *  - `encapsulation-type ethernet-vlan` carries the customer VLAN tag across
 *    the pseudowire, so the tag is significant end to end.
 *  - `control-word` inserts the control word ahead of the customer frame, so
 *    transit routers do not mistake the payload for IP when hashing.
 *  - `vrf-export` names a per-instance policy, so this instance controls which
 *    routes it advertises rather than relying on the route target alone.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=l2vpn
 *
 * Variables (example values from an3_acx7100-48l / l2vpn_group_105_350):
 *   $INSTANCE_NAME           e.g. l2vpn_group_105_350
 *   $L2VPN_SITE              e.g. r2
 *   $L2VPN_LOCAL_SITE_ID     e.g. 1102
 *   $L2VPN_REMOTE_SITE_ID    e.g. 1119
 *   $AC_INTF                 e.g. et-0/0/50.350
 *   $RD                      e.g. 63535:1092150
 *   $RT                      e.g. 63535:1092150
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
                encapsulation-type ethernet-vlan;
                control-word;
            }
        }
        interface $AC_INTF;
        route-distinguisher $RD;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$RT;
    }
}
```

## evo/routing-instances/l2vpn/ri-l2vpn-kompella-vlan-control-word.conf

```
/*
 * Topic:   BGP L2VPN instance with VLAN-preserving encapsulation and a control word
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - A BGP-signalled (Kompella) L2VPN: the named site carries this node's site
 *    identifier, and the attachment circuit inside it names the remote site it
 *    is cross-connected to, so the pseudowire is addressed by site rather than
 *    by neighbour.
 *  - `encapsulation-type ethernet-vlan` carries the customer VLAN tag across
 *    the pseudowire, so the tag is significant end to end.
 *  - `control-word` inserts the control word ahead of the customer frame, so
 *    transit routers do not mistake the payload for IP when hashing.
 *  - Advertisement is governed by the route target alone; the instance has no
 *    per-instance export policy.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=l2vpn
 *
 * Variables (example values from an3_acx7100-48l / l2vpn_group_105_201):
 *   $INSTANCE_NAME           e.g. l2vpn_group_105_201
 *   $L2VPN_SITE              e.g. r2
 *   $L2VPN_LOCAL_SITE_ID     e.g. 1102
 *   $L2VPN_REMOTE_SITE_ID    e.g. 1119
 *   $AC_INTF                 e.g. et-0/0/50.201
 *   $RD                      e.g. 63535:1092001
 *   $RT                      e.g. 63535:1092001
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
                encapsulation-type ethernet-vlan;
                control-word;
            }
        }
        interface $AC_INTF;
        route-distinguisher $RD;
        vrf-target target:$RT;
    }
}
```

## evo/routing-instances/l2vpn/ri-l2vpn-kompella-vlan-export.conf

```
/*
 * Topic:   BGP L2VPN instance with VLAN-preserving encapsulation, with vrf-export
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - A BGP-signalled (Kompella) L2VPN: the named site carries this node's site
 *    identifier, and the attachment circuit inside it names the remote site it
 *    is cross-connected to, so the pseudowire is addressed by site rather than
 *    by neighbour.
 *  - `encapsulation-type ethernet-vlan` carries the customer VLAN tag across
 *    the pseudowire, so the tag is significant end to end.
 *  - `no-control-word` omits the control word, so no extra shim is inserted
 *    ahead of the customer frame.
 *  - `vrf-export` names a per-instance policy, so this instance controls which
 *    routes it advertises rather than relying on the route target alone.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=l2vpn
 *
 * Variables (example values from an3_acx7100-48l / l2vpn_group_105_300):
 *   $INSTANCE_NAME           e.g. l2vpn_group_105_300
 *   $L2VPN_SITE              e.g. r2
 *   $L2VPN_LOCAL_SITE_ID     e.g. 1102
 *   $L2VPN_REMOTE_SITE_ID    e.g. 1119
 *   $AC_INTF                 e.g. et-0/0/50.300
 *   $RD                      e.g. 63535:1092100
 *   $RT                      e.g. 63535:1092100
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
                encapsulation-type ethernet-vlan;
                no-control-word;
            }
        }
        interface $AC_INTF;
        route-distinguisher $RD;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$RT;
    }
}
```

## evo/routing-instances/l2vpn/ri-l2vpn-kompella-vlan.conf

```
/*
 * Topic:   BGP L2VPN instance with VLAN-preserving encapsulation
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - A BGP-signalled (Kompella) L2VPN: the named site carries this node's site
 *    identifier, and the attachment circuit inside it names the remote site it
 *    is cross-connected to, so the pseudowire is addressed by site rather than
 *    by neighbour.
 *  - `encapsulation-type ethernet-vlan` carries the customer VLAN tag across
 *    the pseudowire, so the tag is significant end to end.
 *  - `no-control-word` omits the control word, so no extra shim is inserted
 *    ahead of the customer frame.
 *  - Advertisement is governed by the route target alone; the instance has no
 *    per-instance export policy.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=l2vpn
 *
 * Variables (example values from an3_acx7100-48l / l2vpn_group_105_200):
 *   $INSTANCE_NAME           e.g. l2vpn_group_105_200
 *   $L2VPN_SITE              e.g. r2
 *   $L2VPN_LOCAL_SITE_ID     e.g. 1102
 *   $L2VPN_REMOTE_SITE_ID    e.g. 1119
 *   $AC_INTF                 e.g. et-0/0/50.200
 *   $RD                      e.g. 63535:1092000
 *   $RT                      e.g. 63535:1092000
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
                encapsulation-type ethernet-vlan;
                no-control-word;
            }
        }
        interface $AC_INTF;
        route-distinguisher $RD;
        vrf-target target:$RT;
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
 *  - variant:mebs-fatpw-label-form capabilities=gr:fatpw-label
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

## evo/routing-instances/l3vpn/ri-l3vpn-bgp-v6-vrf-policy-auto-export.conf

```
/*
 * Topic:   IPv6 L3VPN VRF with PE-CE eBGP and auto-export
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - `instance-type vrf` carrying customer IPv6 routes; PE-CE eBGP under
 *    `protocols bgp group v6Ixia` with `family inet6 { any; }`, `peer-as
 *    <CUST_ASN>` and `as-override`, so the customer's own ASN is rewritten
 *    out of AS_PATH on the return direction.
 *  - `routing-options router-id; auto-export;` — auto-export leaks routes to
 *    the sibling VRFs on the device that share an import route target.
 *  - `vrf-import / vrf-export` name the per-VRF import and export policies.
 *    The configured names vary per service, so both are bindings: an3 uses a
 *    `PS-` prefix while ma4, mse1 and mse2 do not.
 *  - `vrf-table-label` enables one MPLS label per VRF, so the egress PE does
 *    an L3 lookup on the inner header.
 *
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-import-l3vpn-internet.conf
 *
 * Variables (example values from an3_acx7100-48l / METRO_BGPv6_L3VPN_2201):
 *   $INSTANCE_NAME    e.g. METRO_BGPv6_L3VPN_2201
 *   $IMPORT_POL       e.g. PS-METRO_BGPv6_L3VPN_2201-IMPORT
 *   $EXPORT_POL       e.g. PS-METRO_BGPv6_L3VPN_2201-EXPORT
 *   $ROUTER_ID        e.g. 1.1.0.2
 *   $AC_INTF          e.g. et-0/0/4.2201
 *   $CE_PEER_V6       e.g. 2001:0:0:0:13:3:0:2
 *   $PE_LOCAL_V6      e.g. 2001:0:0:0:13:3:0:1
 *   $AS_CUST          e.g. 64514
 *   $RD               e.g. 63535:2201
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
        vrf-import $IMPORT_POL;
        vrf-export $EXPORT_POL;
        vrf-table-label;
    }
}
```

## evo/routing-instances/l3vpn/ri-l3vpn-bgp-v6-vrf-policy.conf

```
/*
 * Topic:   IPv6 L3VPN VRF with PE-CE eBGP and no auto-export
 * Seen on:
 *   Junos: (none)
 *   EVO:   ma3_acx7100-48l
 *
 * Highlights:
 *  - `instance-type vrf` carrying customer IPv6 routes; PE-CE eBGP under
 *    `protocols bgp group v6Ixia` with `family inet6 { any; }`, `peer-as
 *    <CUST_ASN>` and `as-override`.
 *  - `routing-options router-id;` is the only routing-options child. Without
 *    `auto-export` the VRF does not leak routes to the other local VRFs that
 *    share an import route target; reachability comes only from the policy
 *    pair.
 *  - `vrf-import / vrf-export` name the per-VRF import and export policies,
 *    whose configured names vary per service.
 *  - `vrf-table-label` enables one MPLS label per VRF, so the egress PE does
 *    an L3 lookup on the inner header.
 *
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-import-l3vpn-internet.conf
 *
 * Variables (example values from ma3_acx7100-48l / METRO_BGPv6_L3VPN_2201):
 *   $INSTANCE_NAME    e.g. METRO_BGPv6_L3VPN_2201
 *   $IMPORT_POL       e.g. METRO_BGPv6_L3VPN_2201-IMPORT
 *   $EXPORT_POL       e.g. METRO_BGPv6_L3VPN_2201-EXPORT
 *   $ROUTER_ID        e.g. 1.1.0.15
 *   $AC_INTF          e.g. et-0/0/5.2201
 *   $CE_PEER_V6       e.g. 2001:0:0:0:115:3:0:2
 *   $PE_LOCAL_V6      e.g. 2001:0:0:0:115:3:0:1
 *   $AS_CUST          e.g. 64514
 *   $RD               e.g. 63536:2201
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            router-id $ROUTER_ID;
        }
        protocols {
            bgp {
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
        vrf-import $IMPORT_POL;
        vrf-export $EXPORT_POL;
        vrf-table-label;
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
 *    $EXPORT_POL.
 *
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-import-l3vpn-internet.conf
 *  - variant:mebs-bgp-overlay families=inet-vpn
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
 *  - variant:mebs-irb-form capabilities=ifl:irb
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from meg1_acx7100-32c / METRO_L3VPN_4000):
 *   $INSTANCE_NAME    e.g. METRO_L3VPN_4000
 *   $IMPORT_POL       e.g. PS-METRO_L3VPN_4000-IMPORT
 *   $EXPORT_POL       e.g. PS-METRO_L3VPN_4000-EXPORT
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
        vrf-import $IMPORT_POL;
        vrf-export $EXPORT_POL;
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
 *  - evo/groups/gr-l3vpn.conf
 *  - evo/policy-options/policy-statement/ps-import-l3vpn.conf
 *  - evo/policy-options/policy-statement/ps-export-l3vpn-public.conf
 *  - variant:mebs-irb-form capabilities=ifl:irb
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
 *   $IMPORT_POL       e.g. PS-METRO_L3VPN_4000-IMPORT
 *   $EXPORT_POL       e.g. PS-METRO_L3VPN_4000-EXPORT
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
        vrf-import $IMPORT_POL;
        vrf-export $EXPORT_POL;
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
 *  - variant:mebs-irb-form capabilities=ifl:irb
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
 *  - `vrf-import / vrf-export` name the per-VRF import and export policies.
 *    The configured names vary per service, so both are bindings: the EVO ANs
 *    use a `PS-` prefix (e.g. `PS-METRO_L3VPN_2001-IMPORT`) while the other
 *    devices this form covers do not.
 *
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-import-l3vpn-internet.conf
 *  - variant:mebs-bgp-overlay families=inet-vpn
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
 *  - variant:mebs-edge-intf-form capabilities=gr:edge-intf
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

## evo/routing-instances/vpls/ri-bgp-vpls-vlan.conf

```
/*
 * Topic:   BGP-VPLS virtual-switch instance with a single-VLAN bridge
 * Seen on:
 *   Junos: (none)
 *   EVO:   an3_acx7100-48l ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `instance-type virtual-switch` carries the VPLS in a bridging instance, so
 *    the service is expressed as a VLAN rather than as a port-mode pseudowire.
 *  - `site` with `site-identifier` gives this PE its position in the BGP-VPLS
 *    mesh; `site-range` bounds how many sites the label block must cover and
 *    `label-block-size` sets how many labels each site advertises.
 *  - `service-type single` binds one VLAN to the instance.
 *  - `no-tunnel-services` builds the pseudowire without a tunnel-services PIC.
 *  - The `vlans` block names the bridge and attaches one attachment circuit.
 *
 * Pair with: none
 *
 * Variables (example values from an3_acx7100-48l):
 *   $INSTANCE_NAME      e.g. vpls_group_102_500
 *   $VPLS_SITE          e.g. r2
 *   $VPLS_SITE_ID       e.g. 1
 *   $SITE_RANGE         e.g. 10
 *   $LABEL_BLOCK_SIZE   e.g. 8
 *   $RD                 e.g. 63535:1093100
 *   $RT_AS              e.g. 63535
 *   $RT_ID              e.g. 1093100
 *   $BD_NAME            e.g. vlan500
 *   $AC_INTF            e.g. et-0/0/0.500
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-switch;
        protocols {
            vpls {
                site $VPLS_SITE {
                    site-identifier $VPLS_SITE_ID;
                }
                service-type single;
                site-range $SITE_RANGE;
                label-block-size $LABEL_BLOCK_SIZE;
                no-tunnel-services;
            }
        }
        route-distinguisher $RD;
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

## evo/routing-options/aggregate-discard-routes.conf

```
/*
 * Topic:   Tagged discard aggregates for the loopback and core-link supernets
 * Seen on:
 *   Junos: an1_mx204 an4_acx710
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Two locally generated aggregates summarize the loopback supernet and the
 *    core-link supernet; `discard` drops anything they attract that has no
 *    contributing route.
 *  - `tag 1000` and `tag 1001` with `tag2 0` mark them so IGP export policy can
 *    match the summaries by tag rather than by prefix.
 *  - `preference 14` keeps the aggregate below the contributing routes, so a
 *    more specific route always wins.
 *
 * Variables (example values from an1_mx204):
 *   $LOOPBACK_SUPERNET     e.g. 1.1.0.0/24
 *   $CORE_LINK_SUPERNET    e.g. 10.10.0.0/24
 */
routing-options {
    aggregate {
        route $LOOPBACK_SUPERNET {
            tag 1000;
            tag2 0;
            preference 14;
            discard;
        }
        route $CORE_LINK_SUPERNET {
            tag 1001;
            tag2 0;
            preference 14;
            discard;
        }
    }
}
```

## evo/routing-options/flex-algorithm-128-transport-class.conf

```
/*
 * Topic:   flex-algorithm 128
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l
 * Pair with: none
 * Variables: none
 */
routing-options {
    flex-algorithm 128 {
        color 4000;
        use-transport-class;
    }
}
```

## evo/routing-options/flex-algorithm-129-transport-class.conf

```
/*
 * Topic:   flex-algorithm 129
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l
 * Pair with: none
 * Variables: none
 */
routing-options {
    flex-algorithm 129 {
        color 6000;
        use-transport-class;
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
 *
 * Pair with:
 *  - variant:mebs-mpls-admin-groups capabilities=transport:mpls-admin-groups
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

## evo/routing-options/forwarding-table-pplb-chained-nh.conf

```
/*
 * Topic:   Forwarding table with per-packet load balancing and ingress chained composite next hops
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `export` applies the per-packet load-balancing policy to the forwarding
 *    table, which is what turns multiple equal-cost routes into multiple
 *    forwarding next hops.
 *  - `chained-composite-next-hop ingress` builds one shared next hop per
 *    service family, so L2VPN, L2 circuit, EVPN and L3VPN routes that share a
 *    transport tunnel also share forwarding state.
 *
 * Pair with:
 *  - evo/policy-options/policy-statement/per-packet-load-balance.conf
 *
 * Variables (example values from an1_mx204):
 *   $PPLB_NAME   e.g. pplb
 *                (the configured load-balancing policy name; the forwarding
 *                 table carries this exact literal)
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
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

## evo/routing-options/interface-routes-loopback.conf

```
/*
 * Topic:   Interface routes using the local loopback RIB group
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Variables: none
 */
routing-options {
  interface-routes {
    rib-group inet RG-LOCAL-LOOPBACK;
  }
}
```

## evo/routing-options/protect-core.conf

```
/*
 * Topic:   protect core
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Pair with: none
 * Variables: none
 */
routing-options {
    protect core;
}
```

## evo/routing-options/resolution-transport-class-l3vpn-rib-v6-first.conf

```
/*
 * Topic:   IPv6-first transport-class resolution with L3VPN multipath import
 * Seen on:
 *   Junos: mse1_mx304
 *   EVO:   an3_acx7100-48l
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-multipath.conf
 *  - variant:mebs-colour-transport capabilities=transport:colour-classes
 * Variables: none
 */
routing-options {
  resolution {
    rib bgp.l3vpn.0 {
      import PS-MULTIPATH;
    }
    scheme gold-to-bronze-v6 {
      resolution-ribs [ junos-rti-tc-4000.inet6.3 junos-rti-tc-6000.inet6.3 ];
      mapping-community color:0:4000;
    }
    scheme gold-to-bronze {
      resolution-ribs [ junos-rti-tc-4000.inet.3 junos-rti-tc-6000.inet.3 ];
      mapping-community color:0:4000;
    }
  }
}
```

## evo/routing-options/resolution-transport-class-l3vpn-rib.conf

```
/*
 * Topic:   Colour-mapped resolution schemes alongside an L3VPN RIB resolution import
 * Seen on:
 *   Junos: ma4_mx204 mse2_mx304
 *   EVO:   ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `rib bgp.l3vpn.0` applies PS-MULTIPATH during resolution, so VPN routes
 *    keep more than one usable next hop.
 *  - `scheme gold-to-bronze` resolves service next hops over the IPv4
 *    transport-class RIBs, gold first and bronze second, so a gold-coloured
 *    route falls back to bronze when the gold tunnel is gone.
 *  - `scheme gold-to-bronze-v6` does the same over the IPv6 transport-class
 *    RIBs.
 *  - Both schemes are selected by the same `color:0:4000` mapping community,
 *    so one colour on a route drives resolution in either address family.
 *
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-multipath.conf
 *  - variant:mebs-colour-transport capabilities=transport:colour-classes
 *
 * Variables: none
 */
routing-options {
    resolution {
        rib bgp.l3vpn.0 {
            import PS-MULTIPATH;
        }
        scheme gold-to-bronze {
            resolution-ribs [ junos-rti-tc-4000.inet.3 junos-rti-tc-6000.inet.3 ];
            mapping-community color:0:4000;
        }
        scheme gold-to-bronze-v6 {
            resolution-ribs [ junos-rti-tc-4000.inet6.3 junos-rti-tc-6000.inet6.3 ];
            mapping-community color:0:4000;
        }
    }
}
```

## evo/routing-options/resolution-transport-class.conf

```
/*
 * Topic:   Colour-mapped resolution schemes over the gold and bronze transport-class RIBs
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma5_mx204 mdr2_mx10003
 *   EVO:   cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 mdr1_acx7509
 *
 * Highlights:
 *  - `scheme gold-to-bronze` resolves service next hops over the IPv4
 *    transport-class RIBs, gold first and bronze second, so a gold-coloured
 *    route falls back to bronze when the gold tunnel is gone.
 *  - `scheme gold-to-bronze-v6` does the same over the IPv6 transport-class
 *    RIBs.
 *  - Both schemes are selected by the same `color:0:4000` mapping community,
 *    so one colour on a route drives resolution in either address family.
 *  - Both schemes require same-device transport-class definitions for gold
 *    (colour 4000) and bronze (colour 6000) to supply their resolution RIBs.
 *
 * Pair with:
 *  - variant:mebs-colour-transport capabilities=transport:colour-classes
 *
 * Variables: none
 */
routing-options {
    resolution {
        scheme gold-to-bronze {
            resolution-ribs [ junos-rti-tc-4000.inet.3 junos-rti-tc-6000.inet.3 ];
            mapping-community color:0:4000;
        }
        scheme gold-to-bronze-v6 {
            resolution-ribs [ junos-rti-tc-4000.inet6.3 junos-rti-tc-6000.inet6.3 ];
            mapping-community color:0:4000;
        }
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
 *  - evo/policy-options/policy-statement/loopback-rib-leak.conf
 *  - variant:mebs-colour-transport capabilities=transport:colour-classes
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

## evo/routing-options/rib-inet3-protect-core.conf

```
/*
 * Topic:   rib inet.3
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Pair with: none
 * Variables: none
 */
routing-options {
    rib inet.3 {
        protect core;
    }
}
```

## evo/routing-options/rib-inet6-protect-core.conf

```
/*
 * Topic:   rib inet6.0
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Pair with: none
 * Variables: none
 */
routing-options {
    rib inet6.0 {
        protect core;
    }
}
```

## evo/routing-options/router-id.conf

```
/*
 * Topic:   Transport router identity
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Pair with: none
 * Variables:
 *   $ROUTER_ID   e.g. 1.1.0.12
 */
routing-options {
    router-id $ROUTER_ID;
}```

## evo/routing-options/transport-class.conf

```
/*
 * Topic:   Gold and bronze transport classes with local tunnel egress
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 ma4_mx204 ma5_mx204 mdr2_mx10003
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Variant group: mebs-colour-transport
 *   Provides: transport:colour-classes
 *
 * Highlights:
 *  - Two transport classes: `gold` (colour 4000) and `bronze` (colour 6000).
 *    `auto-create` lets additional colours map without an explicit stanza.
 *  - Each class's `tunnel-egress end-point` is the local transport loopback
 *    the colour-tagged path terminates on.
 *
 * Pair with: none
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

## junos/apply-groups/gr-ae-interface-mtu.conf

```
/*
 * Topic:   Apply AE-INTERFACE-MTU at the configuration root
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   (none)
 *
 * Pair with:
 *  - junos/groups/gr-ae-interface-mtu.conf
 *
 * Variables: none
 */
apply-groups [ AE-INTERFACE-MTU ];```

## junos/bridge-domains/bridge-domain-irb.conf

```
/*
 * Topic:   Bridge domain with one VLAN, one attachment circuit and an IRB routed interface
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - `vlan-id` gives the domain a single normalized VLAN.
 *  - `interface` binds one bridged logical interface as the attachment circuit.
 *  - `routing-interface irb.<unit>` gives the domain its routed interface, so
 *    hosts in the bridge domain reach the routed network through the IRB.
 *
 * Pair with:
 *  - junos/interfaces/ethernet-bridge.conf
 *  - junos/interfaces/ifl-irb-inet.conf
 *
 * Variables (example values from mse1_mx304):
 *   $BD_NAME    e.g. BD_group_70_4050
 *   $VLAN       e.g. 4050
 *   $AC_INTF    e.g. xe-0/0/3:1.4050
 *   $IRB_UNIT   e.g. 4050
 */
bridge-domains {
    $BD_NAME {
        vlan-id $VLAN;
        interface $AC_INTF;
        routing-interface irb.$IRB_UNIT;
    }
}
```

## junos/bridge-domains/bridge-domain-local-switch.conf

```
/*
 * Topic:   Bridge domain locally switching two attachment circuits
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   (none)
 *
 * Highlights:
 *  - Two bridged logical interfaces are placed in one domain, so traffic is
 *    switched between them on this node alone.
 *  - The domain carries no normalized VLAN and no routed interface, so the two
 *    circuits are joined as they arrive.
 *  - The two `interface` statements are interchangeable, so one deployed
 *    domain has two equivalent bindings of this body.
 *
 * Variables (example values from ma5_mx204):
 *   $BD_NAME      e.g. bd_group_lsw_1000
 *   $AC_INTF_A    e.g. et-0/0/2.4000
 *   $AC_INTF_B    e.g. xe-0/1/4.1000
 */
bridge-domains {
    $BD_NAME {
        interface $AC_INTF_A;
        interface $AC_INTF_B;
    }
}
```

## junos/chassis/aggregated-devices-ethernet.conf

```
/*
 * Topic:   Aggregated Ethernet device-count for the chassis
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Reserves the aggregated Ethernet interface pool, so `ae0` through
 *    `ae<count-1>` can be configured on the node.
 *  - The count is a chassis-wide ceiling, not a count of bundles in use.
 *
 * Variables (example values from an1_mx204):
 *   $AE_DEVICE_COUNT   e.g. 25
 */
chassis {
    aggregated-devices {
        ethernet {
            device-count $AE_DEVICE_COUNT;
        }
    }
}
```

## junos/chassis/pseudowire-service.conf

```
/*
 * Topic: Pseudowire-subscriber device allocation
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO: (none)
 * Highlights:
 *  - device-count allocates pseudowire-subscriber devices, not service units.
 * Pair with: none
 * Variables:
 *   $PS_DEVICE_COUNT   e.g. 100
 */
chassis {
    pseudowire-service {
        device-count $PS_DEVICE_COUNT;
    }
}```

## junos/chassis/tunnel-services.conf

```
/*
 * Topic: Tunnel services on an FPC and PIC
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO: (none)
 * Pair with: none
 * Variables:
 *   $TS_FPC   e.g. 0
 *   $TS_PIC   e.g. 0
 */
chassis {
    fpc $TS_FPC {
        pic $TS_PIC {
            tunnel-services;
        }
    }
}```

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

## junos/firewall/filter-family-any-policers.conf

```
/*
 * Topic:   Protocol-independent rate-limit filters binding the 50 Mbps and 5 Mbps policers
 * Seen on:
 *   Junos: an4_acx710 ma5_mx204
 *   EVO:   meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `family any` filters act on the logical interface regardless of payload
 *    protocol, so one filter rate-limits a mixed bridged and routed circuit.
 *  - `interface-specific` gives each bound interface its own counter and
 *    policer instance, so one subscriber's rate limit is independent of
 *    another's.
 *  - Each filter carries a single unconditional term whose only action is the
 *    policer, which makes the filter a pure bandwidth profile.
 *
 * Pair with: none
 *
 * Variables: none
 */
firewall {
    family any {
        filter 50MB_filter {
            interface-specific;
            term t1 {
                then policer 50mbps_policer;
            }
        }
        filter 5MB_filter {
            interface-specific;
            term t1 {
                then policer 5mbps_policer;
            }
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
 * Variant group: mebs-rate-limit-policers
 *   Provides: firewall:policers
 *
 * Highlights:
 *  - Two reusable rate-limit policers (5 Mbps and 50 Mbps) and an
 *    interface-specific family-any filter that drops traffic
 *    exceeding 50 Mbps. Apply with:
 *    set interfaces <ifd> unit <unit> family any filter input 50MB_filter
 *  - The 50 Mbps policer here carries a 10 m burst, which is this device's
 *    form; every other PE uses the 2 m burst in evo/firewall/policers.conf.
 *
 * Pair with: none
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

## junos/forwarding-options/hash-key-mpls-label-stack.conf

```
/*
 * Topic:   Load-balance hash key with a three-label MPLS stack and pseudowire payload
 * Seen on:
 *   Junos: an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 mdr2_mx10003
 *   EVO:   (none)
 *
 * Highlights:
 *  - `family inet` and `family inet6` hash on both the Layer 3 header and the
 *    Layer 4 ports, so flows between one address pair still spread.
 *  - `family mpls` hashes the first three labels, which covers the transport,
 *    service and flow labels of a stacked LSP.
 *  - `payload ether-pseudowire` lets the hash reach the Ethernet header inside
 *    a pseudowire, and `port-data` adds both halves of the source and
 *    destination Layer 4 ports of an IP payload.
 *  - `family multiservice` adds the source and destination MAC, which is what
 *    spreads bridged traffic that carries no IP header.
 *
 * Variables: none
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
            label-1;
            label-2;
            label-3;
            payload {
                ether-pseudowire;
                ip {
                    port-data {
                        source-msb;
                        source-lsb;
                        destination-msb;
                        destination-lsb;
                    }
                }
            }
        }
        family multiservice {
            source-mac;
            destination-mac;
        }
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

## junos/groups/gr-ae-interface-mtu.conf

```
/*
 * Topic:   AE-INTERFACE-MTU
 * Seen on:
 *   Junos: an1_mx204 an4_acx710 ma5_mx204
 *   EVO:   ma1-2_acx7024 meg2_acx7509
 * Pair with: none
 * Variables: none
 */
groups {
    AE-INTERFACE-MTU {
        interfaces {
            <ae*> {
                mtu 9192;
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

## junos/groups/gr-core-intf-lag-member.conf

```
/*
 * Topic:   GR-CORE-INTF-LAG-MEMBER
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Pair with: none
 * Variables: none
 */
groups {
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
 * Variant group: mebs-edge-intf-mh
 *   Provides: gr:edge-intf-mh
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
 *   EVO:   cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Variant group: mebs-edge-intf-form
 *   Provides: gr:edge-intf
 *
 * Highlights:
 *  - Templated baseline for customer-facing (edge) interfaces.
 *    Applied to physical and aggregated-ethernet interfaces to set
 *    common properties (description marker, MTU, flex-vlan tagging,
 *    flex-ethernet-services encapsulation, optics alarm/warning).
 *  - Apply with:   set interfaces et-0/0/0 apply-groups GR-EDGE-INTF
 *
 * Pair with: none
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
 * Variant group: mebs-fatpw-label-form
 *   Provides: gr:fatpw-label
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
 * Pair with: none
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
 * Pair with: none
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
 * Pair with: none
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
 * Pair with: none
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
 *  - junos/interfaces/ifd-core-lag-member.conf
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
 * Topic:   VLAN-bridge logical interface with flexible Ethernet services
 * Seen on:
 *   Junos: ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - Flexible VLAN tagging and flexible Ethernet services are configured
 *    on the parent of the VLAN-bridge unit.
 *
 * Pair with:
 *  - variant:mebs-edge-intf-form capabilities=gr:edge-intf
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
 *  - variant:mebs-edge-intf-mh capabilities=gr:edge-intf-mh
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
 *  - variant:mebs-edge-intf-mh capabilities=gr:edge-intf-mh
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
 *  - variant:mebs-edge-intf-mh capabilities=gr:edge-intf-mh
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

## junos/interfaces/ifd-core-aggregate-flexible-lacp-fast-mtu.conf

```
/*
 * Topic:   Core interface device
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509
 * Pair with:
 *  - junos/groups/gr-core-intf.conf
 * Variables:
 *   $CORE_DESC   e.g. "to AG2.2 rtme-mx-51 ae22"
 *   $IFD   e.g. ae22
 */
interfaces {
    $IFD {
        apply-groups GR-CORE-INTF;
        description $CORE_DESC;
        flexible-vlan-tagging;
        mtu 9192;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            minimum-links 1;
            lacp {
                active;
                periodic fast;
            }
        }
    }
}
```

## junos/interfaces/ifd-core-aggregate-flexible-lacp-fast.conf

```
/*
 * Topic:   Core interface device
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   ma3_acx7100-48l
 * Pair with:
 *  - junos/groups/gr-core-intf.conf
 * Variables:
 *   $CORE_DESC   e.g. "to MDR2 rtme-mx-51 ae55"
 *   $IFD   e.g. ae55
 */
interfaces {
    $IFD {
        apply-groups GR-CORE-INTF;
        description $CORE_DESC;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            minimum-links 1;
            lacp {
                active;
                periodic fast;
            }
        }
    }
}
```

## junos/interfaces/ifd-core-aggregate-lacp-fast-mtu.conf

```
/*
 * Topic:   Core interface device
 * Seen on:
 *   Junos: an1_mx204 an4_acx710 ma2_mx204
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-2_acx7024 mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Pair with:
 *  - junos/groups/gr-core-intf.conf
 * Variables:
 *   $CORE_DESC   e.g. "to AG1.1 rtme-acx7100-32c-a ae23"
 *   $IFD   e.g. ae23
 */
interfaces {
    $IFD {
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
    }
}
```

## junos/interfaces/ifd-core-aggregate-lacp-fast.conf

```
/*
 * Topic:   Core interface device
 * Seen on:
 *   Junos: an2_acx5448 ma4_mx204 mdr2_mx10003
 *   EVO:   ma3_acx7100-48l
 * Pair with:
 *  - junos/groups/gr-core-intf.conf
 * Variables:
 *   $CORE_DESC   e.g. "to AN1 rtme-mx-45 ae73"
 *   $IFD   e.g. ae73
 */
interfaces {
    $IFD {
        apply-groups GR-CORE-INTF;
        description $CORE_DESC;
        aggregated-ether-options {
            minimum-links 1;
            lacp {
                active;
                periodic fast;
            }
        }
    }
}
```

## junos/interfaces/ifd-core-flexible-gigether-tpid.conf

```
/*
 * Topic:   Core interface device
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   (none)
 * Pair with: none
 * Variables:
 *   $CORE_DESC   e.g. "to MA3 rtme-acx-48l-07 et-0/0/51"
 *   $IFD   e.g. et-0/0/2
 */
interfaces {
    $IFD {
        description $CORE_DESC;
        traps;
        flexible-vlan-tagging;
        mtu 9192;
        hold-time up 2000 down 0;
        encapsulation flexible-ethernet-services;
        gigether-options {
            ethernet-switch-profile {
                tag-protocol-id [ 0x88a8 0x8100 ];
            }
        }
    }
}
```

## junos/interfaces/ifd-core-group-description.conf

```
/*
 * Topic:   Core interface device
 * Seen on:
 *   Junos: ma4_mx204
 *   EVO:   (none)
 * Pair with:
 *  - junos/groups/gr-core-intf.conf
 * Variables:
 *   $CORE_DESC   e.g. "to MA5 rtme-mx-59 et-0/0/0"
 *   $IFD   e.g. et-0/0/0
 */
interfaces {
    $IFD {
        apply-groups GR-CORE-INTF;
        description $CORE_DESC;
    }
}
```

## junos/interfaces/ifd-core-group-mtu.conf

```
/*
 * Topic:   Core interface device
 * Seen on:
 *   Junos: ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c cr1_ptx10001-36mr cr2_ptx10001-36mr mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Pair with:
 *  - junos/groups/gr-core-intf.conf
 * Variables:
 *   $CORE_DESC   e.g. "to MEG1 rtme-acx7100-32c-d"
 *   $IFD   e.g. et-0/0/13
 */
interfaces {
    $IFD {
        apply-groups GR-CORE-INTF;
        description $CORE_DESC;
        mtu 9192;
    }
}
```

## junos/interfaces/ifd-core-lag-member-gigether.conf

```
/*
 * Topic:   Core aggregate member interface
 * Seen on:
 *   Junos: an1_mx204 an4_acx710 ma2_mx204 ma4_mx204 mdr2_mx10003
 *   EVO:   (none)
 * Pair with:
 *  - junos/groups/gr-core-intf-lag-member.conf
 * Variables:
 *   $AE_BUNDLE   e.g. ae71
 *   $IFD   e.g. et-0/0/1
 */
interfaces {
    $IFD {
        apply-groups GR-CORE-INTF-LAG-MEMBER;
        gigether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## junos/interfaces/ifd-core-lag-member.conf

```
/*
 * Topic:   Physical member of a core-facing aggregated Ethernet bundle
 * Seen on:
 *   Junos: an2_acx5448 an4_acx710
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `ether-options 802.3ad` enslaves the physical port to a core-facing
 *    aggregated Ethernet bundle, so the port itself carries no addressing.
 *  - `apply-groups GR-CORE-INTF-LAG-MEMBER` supplies the knobs shared by every
 *    core LAG member.
 *
 * Pair with:
 *  - junos/groups/gr-core-intf-lag-member.conf
 *
 * Variables (example values from an2_acx5448):
 *   $CORE_INTF   e.g. et-0/1/1
 *   $AE_BUNDLE   e.g. ae73
 */
interfaces {
    $CORE_INTF {
        apply-groups GR-CORE-INTF-LAG-MEMBER;
        ether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## junos/interfaces/ifd-loopback-description.conf

```
/*
 * Topic:   Loopback interface description
 * Seen on:
 *   Junos: an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Pair with: none
 * Variables:
 *   $LO0_DESC   e.g. "AG1.1 Aggregation Node Metro Fabric Spine"
 */
interfaces {
    lo0 {
        description $LO0_DESC;
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
 *  - junos/chassis/pseudowire-service.conf
 *  - junos/chassis/tunnel-services.conf
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

## junos/interfaces/ifl-core-description-vlan-inet-iso-inet6-mpls.conf

```
/*
 * Topic:   Core logical interface
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   (none)
 * Pair with: none
 * Variables:
 *   $CORE_DESC   e.g. "to AG2.1 global"
 *   $CORE_V4_ADDR   e.g. 10.10.0.70/30
 *   $CORE_V6_ADDR   e.g. 2001::10:10:0:46/126
 *   $IFD   e.g. ae22
 *   $UNIT   e.g. 1
 *   $VLAN   e.g. 1
 */
interfaces {
    $IFD {
        unit $UNIT {
            description $CORE_DESC;
            vlan-id $VLAN;
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

## junos/interfaces/ifl-core-group-vlan-inet-iso-inet6-mpls.conf

```
/*
 * Topic:   Core logical interface
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   ma3_acx7100-48l
 * Pair with:
 *  - junos/groups/gr-core-intf.conf
 * Variables:
 *   $CORE_V4_ADDR   e.g. 10.10.2.153/30
 *   $CORE_V6_ADDR   e.g. 2001::10:10:2:99/126
 *   $IFD   e.g. et-0/0/51
 *   $UNIT   e.g. 1
 *   $VLAN   e.g. 1
 */
interfaces {
    $IFD {
        unit $UNIT {
            apply-groups GR-CORE-INTF;
            vlan-id $VLAN;
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

## junos/interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-5.conf

```
/*
 * Topic:   Core logical interface
 * Seen on:
 *   Junos: an4_acx710
 *   EVO:   ag1-1_acx7100-32c
 * Pair with: none
 * Variables:
 *   $CORE_V4_ADDR   e.g. 10.10.0.81/30
 *   $CORE_V6_ADDR   e.g. 2001::10:10:0:51/126
 *   $IFD   e.g. et-0/0/13
 *   $UNIT   e.g. 0
 */
interfaces {
    $IFD {
        unit $UNIT {
            family inet {
                address $CORE_V4_ADDR;
            }
            family iso;
            family inet6 {
                address $CORE_V6_ADDR;
            }
            family mpls {
                maximum-labels 5;
            }
        }
    }
}
```

## junos/interfaces/ifl-core-inet-iso-inet6-mpls.conf

```
/*
 * Topic:   Core logical interface
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Pair with: none
 * Variables:
 *   $CORE_V4_ADDR   e.g. 10.10.0.113/30
 *   $CORE_V6_ADDR   e.g. 2001::10:10:0:71/126
 *   $IFD   e.g. et-0/0/14
 *   $UNIT   e.g. 0
 */
interfaces {
    $IFD {
        unit $UNIT {
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

## junos/interfaces/ifl-irb-inet.conf

```
/*
 * Topic:   IRB unit carrying a single IPv4 address
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l
 * Variant group: mebs-irb-form
 *   Provides: ifl:irb
 *
 * Highlights:
 *  - The routed interface of an EVPN bridge domain: the unit gives the bridge
 *    domain one IPv4 address on this node, so hosts in the domain reach the
 *    L3VPN through it.
 *  - The address is node-local, with no `virtual-gateway-address`, so the
 *    gateway is not shared with the other PEs in the EVPN.
 *
 * Variables (example values from mse1_mx304):
 *   $UNIT        e.g. 4000
 *   $IRB_ADDR    e.g. 43.2.2.3/24
 */
interfaces {
    irb {
        unit $UNIT {
            family inet {
                address $IRB_ADDR;
            }
        }
    }
}
```

## junos/interfaces/ifl-loopback-description-primary-iso.conf

```
/*
 * Topic:   Loopback logical interface
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   (none)
 * Pair with: none
 * Variables:
 *   $ISIS_NET   e.g. 49.0000.0010.0100.0000.00
 *   $LO0_DESC   e.g. "AN1 Access Node Metro Fabric"
 *   $LOOPBACK_V4_PFX   e.g. 1.1.0.0/32
 *   $LOOPBACK_V6_PFX   e.g. 2001::1:1:0:0/128
 *   $UNIT   e.g. 0
 */
interfaces {
    lo0 {
        unit $UNIT {
            description $LO0_DESC;
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

## junos/interfaces/ifl-loopback-primary-iso-anycast-v4-sr-v6.conf

```
/*
 * Topic:   Loopback logical interface
 * Seen on:
 *   Junos: mse2_mx304
 *   EVO:   (none)
 * Pair with: none
 * Variables:
 *   $ISIS_NET   e.g. 49.0005.0010.0100.0011.00
 *   $LOOPBACK_ANYCAST_V4   e.g. 1.1.10.10
 *   $LOOPBACK_SR_V6   e.g. 2001::1:1:10:b
 *   $LOOPBACK_V4_PFX   e.g. 1.1.0.11/32
 *   $LOOPBACK_V6_PFX   e.g. 2001::1:1:0:b/128
 *   $UNIT   e.g. 0
 */
interfaces {
    lo0 {
        unit $UNIT {
            family inet {
                address $LOOPBACK_V4_PFX {
                    primary;
                }
                address $LOOPBACK_ANYCAST_V4/32;
            }
            family iso {
                address $ISIS_NET;
            }
            family inet6 {
                address $LOOPBACK_V6_PFX {
                    primary;
                }
                address $LOOPBACK_SR_V6/128;
            }
        }
    }
}
```

## junos/interfaces/ifl-loopback-primary-iso-sr-v6.conf

```
/*
 * Topic:   Loopback logical interface
 * Seen on:
 *   Junos: mse1_mx304
 *   EVO:   (none)
 * Pair with: none
 * Variables:
 *   $ISIS_NET   e.g. 49.0005.0010.0100.0010.00
 *   $LOOPBACK_SR_V6   e.g. 2001::1:1:10:a
 *   $LOOPBACK_V4_PFX   e.g. 1.1.0.10/32
 *   $LOOPBACK_V6_PFX   e.g. 2001::1:1:0:a/128
 *   $UNIT   e.g. 0
 */
interfaces {
    lo0 {
        unit $UNIT {
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
                address $LOOPBACK_SR_V6/128;
            }
        }
    }
}
```

## junos/interfaces/ifl-loopback-primary-iso.conf

```
/*
 * Topic:   Loopback logical interface
 * Seen on:
 *   Junos: an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003
 *   EVO:   ag1-2_acx7100-32c cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg2_acx7509
 * Pair with: none
 * Variables:
 *   $ISIS_NET   e.g. 49.0000.0010.0100.0005.00
 *   $LOOPBACK_V4_PFX   e.g. 1.1.0.5/32
 *   $LOOPBACK_V6_PFX   e.g. 2001::1:1:0:5/128
 *   $UNIT   e.g. 0
 */
interfaces {
    lo0 {
        unit $UNIT {
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

## junos/interfaces/ifl-ps-vlan-bridge-esi.conf

```
/*
 * Topic: Anchored pseudowire-subscriber service unit with all-active ESI
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO: (none)
 * Highlights:
 *  - Each nonzero service unit has an independent VLAN identifier and ESI.
 *  - The anchor identifies the FPC and PIC hosting the subscriber device.
 * Pair with:
 *  - junos/interfaces/ifd-ps-transport.conf
 *  - junos/chassis/pseudowire-service.conf
 *  - junos/chassis/tunnel-services.conf
 * Variables:
 *   $PS_INTF      e.g. ps0
 *   $ANCHOR_PIC   e.g. lt-0/0/0
 *   $UNIT         e.g. 301
 *   $VLAN         e.g. 301
 *   $ESI          e.g. 00:11:11:11:11:11:11:11:02:02
 */
interfaces {
    $PS_INTF {
        anchor-point {
            $ANCHOR_PIC;
        }
        unit $UNIT {
            encapsulation vlan-bridge;
            vlan-id $VLAN;
            esi {
                $ESI;
                all-active;
            }
        }
    }
}```

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

## junos/interfaces/ifl-vlan-bridge-etree-leaf.conf

```
/*
 * Topic:   Single-tagged bridged logical interface acting as an EVPN E-Tree leaf
 * Seen on:
 *   Junos: ma4_mx204 ma5_mx204
 *   EVO:   (none)
 *
 * Highlights:
 *  - The attachment circuit of an EVPN E-Tree service: the unit is bridged
 *    into the EVPN instance and `etree-ac-role leaf` marks it as a leaf, so
 *    the EVPN control plane blocks leaf-to-leaf forwarding and allows traffic
 *    only towards a root circuit.
 *  - One VLAN with no rewriting, so the customer tag is bridged unchanged, and
 *    no `esi`, so the circuit is single-homed.
 *
 * Variables (example values from ma4_mx204):
 *   $IFD     e.g. xe-0/1/4
 *   $UNIT    e.g. 2000
 *   $VLAN    e.g. 2000
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-bridge;
            vlan-id $VLAN;
            etree-ac-role leaf;
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

## junos/interfaces/ifl-vlan-bridge.conf

```
/*
 * Topic: Bridged logical interface with a VLAN identifier
 * Seen on:
 *   Junos: ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO: an3_acx7100-48l ma1-2_acx7024
 * Variables:
 *   $IFD    e.g. xe-0/1/4
 *   $UNIT   e.g. 849
 *   $VLAN   e.g. 849
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-bridge;
            vlan-id $VLAN;
        }
    }
}```

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
 *  - Ingress 50MB_filter applies the UNI rate limit through its required
 *    device-selected policer.
 *  - Decouples customer VLAN IDs from service-internal VLAN IDs at the SP edge.
 *
 * Pair with:
 *  - evo/firewall/filter-family-any-50mb.conf
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

## junos/interfaces/ifl-vlan-ccc.conf

```
/*
 * Topic:   Single-tagged cross-connect logical interface
 * Seen on:
 *   Junos: ma5_mx204 mse1_mx304
 *   EVO:   an3_acx7100-48l ma1-2_acx7024 ma3_acx7100-48l
 *
 * Highlights:
 *  - The Layer 2 attachment circuit of a point-to-point service: the unit is
 *    handed to a cross-connect rather than terminated in a routing family, so
 *    the customer frame is carried transparently.
 *  - One VLAN with no rewriting, so the customer tag reaches the cross-connect
 *    unchanged, and no `esi`, so the circuit is single-homed.
 *  - The unit index and the VLAN tag are independent values.
 *
 * Variables (example values from ma5_mx204):
 *   $IFD     e.g. et-0/0/2
 *   $UNIT    e.g. 600
 *   $VLAN    e.g. 600
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-ccc;
            vlan-id $VLAN;
        }
    }
}
```

## junos/interfaces/ifl-vlan-inet.conf

```
/*
 * Topic:   Single-tagged routed logical interface carrying an IPv4 customer address
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - The routed attachment circuit of an L3VPN service: one VLAN presented to
 *    the PE and terminated in `family inet`, so customer traffic arrives as IP
 *    rather than as a cross-connect or bridge domain.
 *  - The address is the PE side of the PE-CE link; the customer holds the
 *    other host in the same subnet.
 *  - The unit carries no `esi`, no VLAN rewriting and no filter, so the tag is
 *    presented unchanged and the circuit is single-homed.
 *
 * Variables (example values from ma4_mx204):
 *   $IFD           e.g. xe-0/1/4
 *   $UNIT          e.g. 1
 *   $VLAN          e.g. 1
 *   $AC_ADDR_V4    e.g. 17.1.0.1/30
 */
interfaces {
    $IFD {
        unit $UNIT {
            vlan-id $VLAN;
            family inet {
                address $AC_ADDR_V4;
            }
        }
    }
}
```

## junos/interfaces/ifl-vlan-inet6.conf

```
/*
 * Topic:   Single-tagged routed logical interface carrying an IPv6 customer address
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - The routed attachment circuit of an IPv6 L3VPN service: one VLAN
 *    presented to the PE and terminated in `family inet6`.
 *  - The address is the PE side of the PE-CE link; the customer holds the
 *    other host in the same subnet.
 *  - The unit carries no `esi`, no VLAN rewriting and no filter, so the tag is
 *    presented unchanged and the circuit is single-homed.
 *
 * Variables (example values from ma4_mx204):
 *   $IFD           e.g. xe-0/1/4
 *   $UNIT          e.g. 3001
 *   $VLAN          e.g. 3001
 *   $AC_ADDR_V6    e.g. 2001:0:0:0:17:3:0:1/126
 */
interfaces {
    $IFD {
        unit $UNIT {
            vlan-id $VLAN;
            family inet6 {
                address $AC_ADDR_V6;
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
 *  - Referenced by the per-VRF import and export policies and by the VRF
 *    that carries the service.
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

## junos/policy-options/condition/condition-floating-pw.conf

```
/*
 * Topic:   Floating-pseudowire route condition
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 * Variables:
 *   $CONDITION_NAME   e.g. Floating-PW-Condition
 *   $PS_INTF   e.g. ps0
 */
policy-options {
  condition $CONDITION_NAME {
    if-route-exists {
      address-family {
        ccc {
          $PS_INTF.0;
          table mpls.0;
        }
      }
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

## junos/policy-options/policy-statement/ps-bgp-mse-export-backup.conf

```
/*
 * Topic:   BGP policy BACKUP-PS-BGP-MSE-EXPORT
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509
 *
 * Highlights:
 *  - `term LOOP-PREVENT` rejects anything already carrying CM-SERVICE-EDGE,
 *    CM-ACCESS-FABRIC or CM-METRO-FABRIC, so a route never re-enters the
 *    domain it came from.
 *  - `term FROM-METRO-RING` re-advertises CM-METRO-RING routes inside
 *    PL-AN-REGION with `next-hop self`.
 *  - `term LOOPBACK` tags the remaining PL-AN-REGION prefixes with
 *    CM-METRO-RING and accepts them.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-service-edge.conf
 *  - junos/policy-options/community/cm-access-fabric.conf
 *  - junos/policy-options/community/cm-metro-fabric.conf
 *  - junos/policy-options/community/cm-metro-ring.conf
 *  - junos/policy-options/prefix-list/pl-an-region.conf
 *
 * Variables: none
 */
policy-options {
    policy-statement BACKUP-PS-BGP-MSE-EXPORT {
        term LOOP-PREVENT {
            from community [ CM-SERVICE-EDGE CM-ACCESS-FABRIC CM-METRO-FABRIC ];
            then reject;
        }
        term FROM-METRO-RING {
            from {
                community CM-METRO-RING;
                prefix-list PL-AN-REGION;
            }
            then {
                next-hop self;
                accept;
            }
        }
        term LOOPBACK {
            from {
                prefix-list PL-AN-REGION;
            }
            then {
                community add CM-METRO-RING;
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

## junos/policy-options/policy-statement/ps-export-isis-metro-a-ribs.conf

```
/*
 * Topic:   policy-statement export_isis_metro_a_ribs
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509
 * Pair with: none
 * Variables: none
 */
policy-options {
    policy-statement export_isis_metro_a_ribs {
        term tag-reject {
            from tag 333;
            then reject;
        }
        term 4000 {
            from {
                igp-instance metro-a;
                protocol l-isis;
                rib junos-rti-tc-4000.inet.3;
                level 2;
                inactive: route-filter 1.1.0.0/24 prefix-length-range /32-/32;
                route-filter 1.1.0.14/32 exact;
                route-filter 1.1.0.17/32 exact;
                route-filter 1.1.0.18/32 exact;
            }
            then {
                tag 333;
                tag2 4444;
                prefix-segment {
                    redistribute;
                }
                accept;
            }
        }
        term 6000 {
            from {
                igp-instance metro-a;
                protocol l-isis;
                rib junos-rti-tc-6000.inet.3;
                level 2;
                inactive: route-filter 1.1.0.0/24 prefix-length-range /32-/32;
                route-filter 1.1.0.14/32 exact;
                route-filter 1.1.0.17/32 exact;
                route-filter 1.1.0.18/32 exact;
            }
            then {
                tag 333;
                tag2 6666;
                prefix-segment {
                    redistribute;
                }
                accept;
            }
        }
        term 1 {
            from {
                igp-instance metro-a;
                protocol l-isis;
                rib inet.3;
                level 2;
                inactive: route-filter 1.1.0.0/24 prefix-length-range /32-/32;
                route-filter 1.1.0.14/32 exact;
                route-filter 1.1.0.17/32 exact;
                route-filter 1.1.0.18/32 exact;
            }
            then {
                tag 333;
                tag2 2222;
                prefix-segment {
                    redistribute;
                }
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-export-isis-metro-b-ribs.conf

```
/*
 * Topic:   policy-statement export_isis_metro_b_ribs
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509
 * Pair with: none
 * Variables: none
 */
policy-options {
    policy-statement export_isis_metro_b_ribs {
        term tag-reject {
            from tag 333;
            then reject;
        }
        term 4000 {
            from {
                igp-instance metro-b;
                protocol l-isis;
                rib junos-rti-tc-4000.inet.3;
                level 2;
                inactive: route-filter 1.1.0.0/24 prefix-length-range /32-/32;
                route-filter 1.1.0.16/32 exact;
                route-filter 1.1.0.19/32 exact;
            }
            then {
                tag 333;
                tag2 4444;
                prefix-segment {
                    redistribute;
                }
                accept;
            }
        }
        term 6000 {
            from {
                igp-instance metro-b;
                protocol l-isis;
                rib junos-rti-tc-6000.inet.3;
                level 2;
                inactive: route-filter 1.1.0.0/24 prefix-length-range /32-/32;
                route-filter 1.1.0.16/32 exact;
                route-filter 1.1.0.19/32 exact;
            }
            then {
                tag 333;
                tag2 6666;
                prefix-segment {
                    redistribute;
                }
                accept;
            }
        }
        term 1 {
            from {
                igp-instance metro-b;
                protocol l-isis;
                rib inet.3;
                level 2;
                inactive: route-filter 1.1.0.0/24 prefix-length-range /32-/32;
                route-filter 1.1.0.16/32 exact;
                route-filter 1.1.0.19/32 exact;
            }
            then {
                tag 333;
                tag2 2222;
                prefix-segment {
                    redistribute;
                }
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
 *  - `term tag-public-routes` matches four customer aggregates `orlonger` and
 *    tags each accepted route with CM-L3VPN-PUB and the VRF's own
 *    route-target community.
 *  - `term EVPN-T5-ONLY` selects `family evpn` with `nlri-route-type 5` and
 *    re-tags those IP-prefix routes with the per-VRF community, so Type-5
 *    prefixes learned into the VRF carry the VPN community on re-advertisement
 *    even though they do not match the customer aggregates.
 *  - `nlri-route-type` is the body-level discriminator for this form; the
 *    other L3VPN export policies match on route-filter prefixes alone.
 *  - The configured policy name varies per service; the VRF that uses the
 *    policy carries that exact literal in its `vrf-export` statement.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-l3vpn-pub.conf
 *  - junos/policy-options/community/cm-l3vpn.conf
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from mse2_mx304 / METRO_L3VPN_4000):
 *   $EXPORT_POL      e.g. PS-METRO_L3VPN_4000-EXPORT
 *                    (the configured policy name; the VRF's `vrf-export`
 *                     carries this exact literal)
 *   $INSTANCE_NAME   e.g. METRO_L3VPN_4000
 *   $CE_PREFIX_1     e.g. 43.2.0.0/16
 *   $CE_PREFIX_2     e.g. 44.2.0.0/16
 *   $CE_PREFIX_3     e.g. 40.2.0.0/16
 *   $CE_PREFIX_4     e.g. 41.2.0.0/16
 */
policy-options {
    policy-statement $EXPORT_POL {
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

## junos/policy-options/policy-statement/ps-export-l3vpn-public-default-2.conf

```
/*
 * Topic:   L3VPN vrf-export policy — tag two customer aggregates, then tag every remaining route
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - `term tag-public-routes` matches two customer aggregates `orlonger` and
 *    tags each accepted route with CM-L3VPN-PUB, which marks it as a public
 *    L3VPN prefix for the fabric, and with the VRF's own route-target
 *    community.
 *  - `term tag-default` catches everything the first term did not match and
 *    tags it with the VRF community alone, so the VRF is not limited to its
 *    declared aggregates.
 *  - The configured policy name varies per service; the VRF that uses the
 *    policy carries that exact literal in its `vrf-export` statement.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-l3vpn-pub.conf
 *
 * Variables (example values from mse1_mx304 / METRO_BGPv4_L3VPN_1001):
 *   $EXPORT_POL      e.g. METRO_BGPv4_L3VPN_1001-EXPORT
 *                    (the configured policy name; the VRF's `vrf-export`
 *                     carries this exact literal)
 *   $INSTANCE_NAME   e.g. METRO_BGPv4_L3VPN_1001
 *   $CE_PREFIX_1     e.g. 17.2.0.0/16
 *   $CE_PREFIX_2     e.g. 19.2.0.0/16
 */
policy-options {
    policy-statement $EXPORT_POL {
        term tag-public-routes {
            from {
                route-filter $CE_PREFIX_1 orlonger;
                route-filter $CE_PREFIX_2 orlonger;
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
}
```

## junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3-color.conf

```
/*
 * Topic:   L3VPN vrf-export policy — tag three customer aggregates and every remaining route with the gold transport colour
 * Seen on:
 *   Junos: ma4_mx204
 *   EVO:   (none)
 *
 * Highlights:
 *  - `term tag-public-routes` matches three customer aggregates `orlonger` and
 *    tags each accepted route with CM-L3VPN-PUB, the VRF's own route-target
 *    community, and CM-TC-MAP2GOLD.
 *  - CM-TC-MAP2GOLD is the BGP-CT colour community that steers the VRF's
 *    traffic onto the gold transport class, so both terms carry it and every
 *    route this VRF advertises is coloured.
 *  - `term tag-default` catches everything the first term did not match and
 *    tags it with the VRF community and the colour community.
 *  - The configured policy name varies per service; the VRF that uses the
 *    policy carries that exact literal in its `vrf-export` statement.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-l3vpn-pub.conf
 *  - junos/policy-options/community/cm-tc-map2gold.conf
 *
 * Variables (example values from ma4_mx204 / METRO_BGPv4_L3VPN_1001):
 *   $EXPORT_POL      e.g. METRO_BGPv4_L3VPN_1001-EXPORT
 *                    (the configured policy name; the VRF's `vrf-export`
 *                     carries this exact literal)
 *   $INSTANCE_NAME   e.g. METRO_BGPv4_L3VPN_1001
 *   $CE_PREFIX_1     e.g. 17.2.0.0/16
 *   $CE_PREFIX_2     e.g. 18.2.0.0/16
 *   $CE_PREFIX_3     e.g. 19.2.0.0/16
 */
policy-options {
    policy-statement $EXPORT_POL {
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
}
```

## junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf

```
/*
 * Topic:   L3VPN vrf-export policy — tag three customer aggregates, then tag every remaining route
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - `term tag-public-routes` matches three customer aggregates `orlonger` and
 *    tags each accepted route with CM-L3VPN-PUB, which marks it as a public
 *    L3VPN prefix for the fabric, and with the VRF's own route-target
 *    community.
 *  - `term tag-default` catches everything the first term did not match and
 *    tags it with the VRF community alone, so the VRF is not limited to its
 *    declared aggregates.
 *  - The configured policy name varies per service; the VRF that uses the
 *    policy carries that exact literal in its `vrf-export` statement.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-l3vpn-pub.conf
 *
 * Variables (example values from ma4_mx204 / METRO_L3VPN_1):
 *   $EXPORT_POL      e.g. METRO_L3VPN_1-EXPORT
 *                    (the configured policy name; the VRF's `vrf-export`
 *                     carries this exact literal)
 *   $INSTANCE_NAME   e.g. METRO_L3VPN_1
 *   $CE_PREFIX_1     e.g. 17.1.0.0/16
 *   $CE_PREFIX_2     e.g. 18.1.0.0/16
 *   $CE_PREFIX_3     e.g. 19.1.0.0/16
 */
policy-options {
    policy-statement $EXPORT_POL {
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
}
```

## junos/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf

```
/*
 * Topic:   L3VPN vrf-export policy — tag four customer aggregates, then tag every remaining route
 * Seen on:
 *   Junos: mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - `term tag-public-routes` matches four customer aggregates `orlonger` and
 *    tags each accepted route with CM-L3VPN-PUB, which marks it as a public
 *    L3VPN prefix for the fabric, and with the VRF's own route-target
 *    community.
 *  - `term tag-default` catches everything the first term did not match and
 *    tags it with the VRF community alone, so the VRF is not limited to its
 *    declared aggregates.
 *  - The configured policy name varies per service; the VRF that uses the
 *    policy carries that exact literal in its `vrf-export` statement.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-l3vpn-pub.conf
 *
 * Variables (example values from mse2_mx304 / METRO_L3VPN_2002):
 *   $EXPORT_POL      e.g. METRO_L3VPN_2002-EXPORT
 *                    (the configured policy name; the VRF's `vrf-export`
 *                     carries this exact literal)
 *   $INSTANCE_NAME   e.g. METRO_L3VPN_2002
 *   $CE_PREFIX_1     e.g. 13.2.0.0/16
 *   $CE_PREFIX_2     e.g. 16.2.0.0/16
 *   $CE_PREFIX_3     e.g. 13.1.0.0/16
 *   $CE_PREFIX_4     e.g. 16.1.0.0/16
 */
policy-options {
    policy-statement $EXPORT_POL {
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
        term tag-default {
            then {
                community add $INSTANCE_NAME;
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf

```
/*
 * Topic:   IPv6 L3VPN vrf-export policy — tag two customer aggregates, then tag every remaining route
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - `term tag-public-routes` selects `family inet6` and matches two customer
 *    IPv6 aggregates `orlonger`, tagging each accepted route with
 *    CM-L3VPN-PUB, which marks it as a public L3VPN prefix for the fabric,
 *    and with the VRF's own route-target community.
 *  - `term tag-default` carries no `from`, so it catches everything the first
 *    term did not match and tags it with the VRF community alone.
 *  - The configured policy name varies per service; the VRF that uses the
 *    policy carries that exact literal in its `vrf-export` statement.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-l3vpn-pub.conf
 *
 * Variables (example values from mse1_mx304 / METRO_BGPv6_L3VPN_2202):
 *   $EXPORT_POL      e.g. METRO_BGPv6_L3VPN_2202-EXPORT
 *                    (the configured policy name; the VRF's `vrf-export`
 *                     carries this exact literal)
 *   $INSTANCE_NAME   e.g. METRO_BGPv6_L3VPN_2202
 *   $CE_PREFIX_1     e.g. 2001::13:3:0:0/64
 *   $CE_PREFIX_2     e.g. 2001::16:3:0:0/64
 */
policy-options {
    policy-statement $EXPORT_POL {
        term tag-public-routes {
            from {
                family inet6;
                route-filter $CE_PREFIX_1 orlonger;
                route-filter $CE_PREFIX_2 orlonger;
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
}
```

## junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-3.conf

```
/*
 * Topic:   IPv6 L3VPN vrf-export policy — tag three customer aggregates, then tag every remaining route
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - `term tag-public-routes` selects `family inet6` and matches three
 *    customer IPv6 aggregates `orlonger`, tagging each accepted route with
 *    CM-L3VPN-PUB, which marks it as a public L3VPN prefix for the fabric,
 *    and with the VRF's own route-target community.
 *  - `term tag-default` carries no `from`, so it catches everything the first
 *    term did not match and tags it with the VRF community alone.
 *  - The configured policy name varies per service; the VRF that uses the
 *    policy carries that exact literal in its `vrf-export` statement.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-l3vpn-pub.conf
 *
 * Variables (example values from ma4_mx204 / METRO_BGPv6_L3VPN_3001):
 *   $EXPORT_POL      e.g. METRO_BGPv6_L3VPN_3001-EXPORT
 *                    (the configured policy name; the VRF's `vrf-export`
 *                     carries this exact literal)
 *   $INSTANCE_NAME   e.g. METRO_BGPv6_L3VPN_3001
 *   $CE_PREFIX_1     e.g. 2001::19:3:0:0/64
 *   $CE_PREFIX_2     e.g. 2001::17:3:0:0/126
 *   $CE_PREFIX_3     e.g. 2001::18:3:0:0/64
 */
policy-options {
    policy-statement $EXPORT_POL {
        term tag-public-routes {
            from {
                family inet6;
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
}
```

## junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf

```
/*
 * Topic:   IPv6 L3VPN vrf-export policy — tag four customer aggregates, then tag every remaining route
 * Seen on:
 *   Junos: mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - `term tag-public-routes` selects `family inet6` and matches four customer
 *    IPv6 aggregates `orlonger`, tagging each accepted route with
 *    CM-L3VPN-PUB, which marks it as a public L3VPN prefix for the fabric,
 *    and with the VRF's own route-target community.
 *  - `term tag-default` carries no `from`, so it catches everything the first
 *    term did not match and tags it with the VRF community alone.
 *  - The configured policy name varies per service; the VRF that uses the
 *    policy carries that exact literal in its `vrf-export` statement.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-l3vpn-pub.conf
 *
 * Variables (example values from mse2_mx304 / METRO_BGPv6_L3VPN_2201):
 *   $EXPORT_POL      e.g. METRO_BGPv6_L3VPN_2201-EXPORT
 *                    (the configured policy name; the VRF's `vrf-export`
 *                     carries this exact literal)
 *   $INSTANCE_NAME   e.g. METRO_BGPv6_L3VPN_2201
 *   $CE_PREFIX_1     e.g. 2001::13:3:0:0/64
 *   $CE_PREFIX_2     e.g. 2001::15:3:0:0/64
 *   $CE_PREFIX_3     e.g. 2001::16:3:0:0/64
 *   $CE_PREFIX_4     e.g. 2001::115:3:0:0/64
 */
policy-options {
    policy-statement $EXPORT_POL {
        term tag-public-routes {
            from {
                family inet6;
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
        term tag-default {
            then {
                community add $INSTANCE_NAME;
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-export-l3vpn-public-v6-default-route.conf

```
/*
 * Topic:   IPv6 L3VPN vrf-export policy — tag three customer aggregates and the IPv6 default route
 * Seen on:
 *   Junos: mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - `term tag-public-routes` selects `family inet6` and matches three
 *    customer IPv6 aggregates `orlonger` plus `::/0 exact`, so the VRF
 *    advertises the IPv6 default route to the remote PEs alongside the
 *    customer prefixes.
 *  - `::/0` is matched `exact`, not `orlonger`, so the default route is
 *    carried without widening the customer aggregates.
 *  - Accepted routes are tagged with CM-L3VPN-PUB and the VRF's own
 *    route-target community.
 *  - `term tag-default` carries no `from`, so it catches everything the first
 *    term did not match and tags it with the VRF community alone.
 *  - The configured policy name varies per service; the VRF that uses the
 *    policy carries that exact literal in its `vrf-export` statement.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-l3vpn-pub.conf
 *
 * Variables (example values from mse2_mx304 / METRO_BGPv6_L3VPN_3001):
 *   $EXPORT_POL      e.g. METRO_BGPv6_L3VPN_3001-EXPORT
 *                    (the configured policy name; the VRF's `vrf-export`
 *                     carries this exact literal)
 *   $INSTANCE_NAME   e.g. METRO_BGPv6_L3VPN_3001
 *   $CE_PREFIX_1     e.g. 2001::19:3:0:0/64
 *   $CE_PREFIX_2     e.g. 2001::17:3:0:0/126
 *   $CE_PREFIX_3     e.g. 2001::18:3:0:0/64
 */
policy-options {
    policy-statement $EXPORT_POL {
        term tag-public-routes {
            from {
                family inet6;
                route-filter $CE_PREFIX_1 orlonger;
                route-filter $CE_PREFIX_2 orlonger;
                route-filter $CE_PREFIX_3 orlonger;
                route-filter ::/0 exact;
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
 *  - A single term matches four customer aggregates `orlonger`, so the
 *    customer's more-specifics are carried too, and tags each accepted route
 *    with CM-L3VPN-PUB and the VRF's own route-target community.
 *  - `CM-L3VPN-PUB` marks the route as a public L3VPN prefix for the fabric.
 *  - There is no `term tag-default`, so the VRF exports only the four tagged
 *    aggregates and never a default route.
 *  - The configured policy name varies per service; the VRF that uses the
 *    policy carries that exact literal in its `vrf-export` statement.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-l3vpn-pub.conf
 *  - junos/policy-options/community/cm-l3vpn.conf
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from mse1_mx304 / METRO_L3VPN_4000):
 *   $EXPORT_POL      e.g. PS-METRO_L3VPN_4000-EXPORT
 *                    (the configured policy name; the VRF's `vrf-export`
 *                     carries this exact literal)
 *   $INSTANCE_NAME   e.g. METRO_L3VPN_4000
 *   $CE_PREFIX_1     e.g. 43.2.0.0/16
 *   $CE_PREFIX_2     e.g. 44.2.0.0/16
 *   $CE_PREFIX_3     e.g. 40.2.0.0/16
 *   $CE_PREFIX_4     e.g. 41.2.0.0/16
 */
policy-options {
    policy-statement $EXPORT_POL {
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

## junos/policy-options/policy-statement/ps-floating-pw-conditional.conf

```
/*
 * Topic:   Conditional floating-pseudowire prefix advertisement
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 * Variables:
 *   $CONDITION_NAME   e.g. Floating-PW-Condition
 *   $LOOPBACK_ANYCAST_V4   e.g. 1.1.10.10
 *   $POLICY_NAME   e.g. FLOAT-PW-CONDITIONAL
 *   $PREFIX_SID_INDEX   e.g. 210
 */
policy-options {
  policy-statement $POLICY_NAME {
    term ps-conditional {
      from {
        route-filter $LOOPBACK_ANYCAST_V4/32 exact;
        condition $CONDITION_NAME;
      }
      then {
        prefix-segment {
          index $PREFIX_SID_INDEX;
          node-segment;
        }
        accept;
      }
    }
    term reject-if-down {
      then reject;
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

## junos/policy-options/policy-statement/ps-import-l3vpn-internet.conf

```
/*
 * Topic:   L3VPN vrf-import policy — accept the per-VRF community and the shared Internet default
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
 *
 * Highlights:
 *  - Two ordered terms. `L3VPN-CUST` accepts routes carrying the VRF's own
 *    route-target community. `INTERNET` accepts routes carrying
 *    CM-INET-DEFAULT, which pulls the shared Internet default into the VRF.
 *  - The configured policy name varies per service; the VRF that uses the
 *    policy carries that exact literal in its `vrf-import` statement.
 *  - The per-VRF community is defined under policy-options community and
 *    carries the routing instance's own name.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-inet-default.conf
 *
 * Variables (example values from ma4_mx204 / METRO_BGPv4_L3VPN_1001):
 *   $IMPORT_POL      e.g. METRO_BGPv4_L3VPN_1001-IMPORT
 *                    (the configured policy name; the VRF's `vrf-import`
 *                     carries this exact literal)
 *   $INSTANCE_NAME   e.g. METRO_BGPv4_L3VPN_1001
 */
policy-options {
    policy-statement $IMPORT_POL {
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

## junos/policy-options/policy-statement/ps-import-l3vpn.conf

```
/*
 * Topic:   L3VPN vrf-import policy — accept the per-VRF community only
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - A single term accepts routes carrying the VRF's own route-target
 *    community and nothing else. There is no `term INTERNET`, so no shared
 *    Internet default is imported into the VRF.
 *  - The configured policy name varies per service; the VRF that uses the
 *    policy carries that exact literal in its `vrf-import` statement.
 *  - The per-VRF community is defined under policy-options community and
 *    carries the routing instance's own name.
 *
 * Pair with:
 *  - junos/policy-options/community/cm-l3vpn.conf
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from mse1_mx304 / METRO_L3VPN_4000):
 *   $IMPORT_POL      e.g. PS-METRO_L3VPN_4000-IMPORT
 *                    (the configured policy name; the VRF's `vrf-import`
 *                     carries this exact literal)
 *   $INSTANCE_NAME   e.g. METRO_L3VPN_4000
 */
policy-options {
    policy-statement $IMPORT_POL {
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

## junos/policy-options/policy-statement/ps-isis-export-core.conf

```
/*
 * Topic:   IS-IS export policy PS-ISIS-EXPORT carrying the node loopbacks, the core links and the core summary
 * Seen on:
 *   Junos: an1_mx204 an4_acx710
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `term OOB-MGMT` rejects anything learned on the out-of-band management
 *    interfaces before the loopback terms are reached.
 *  - `term LOCAL-LOOPBACK-IPV4` accepts the node's own lo0 /32, tags it 101 and
 *    attaches the node segment together with the flex-algorithm 128 and 129
 *    prefix segments, so the loopback is reachable on all three algorithms.
 *  - `term LOCAL-LOOPBACK-IPV6` accepts the matching IPv6 loopback with the
 *    same tag.
 *  - `term DIRECT-ROUTES-IPV4` accepts the connected /30s inside the core-link
 *    supernet, so the point-to-point links are carried in IS-IS.
 *  - `term CORE-SUMMARY` rejects the locally generated aggregate tagged 1000 or
 *    1001 with `tag2 0`, keeping the summary out of the flooded database.
 *  - `term REJECT` terminates the policy.
 *
 * Variables (example values from an1_mx204):
 *   $LOOPBACK_V4          e.g. 1.1.0.0
 *   $SR_INDEX_ALGO128     e.g. 500
 *   $SR_INDEX_ALGO129     e.g. 600
 *   $SR_INDEX             e.g. 900
 *   $LOOPBACK_V6          e.g. 2001::1:1:0:0
 *   $CORE_LINK_SUPERNET   e.g. 10.10.0.0/24
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
                tag 101;
                prefix-segment {
                    algorithm 128 index $SR_INDEX_ALGO128 node-segment;
                    algorithm 129 index $SR_INDEX_ALGO129 node-segment;
                    index $SR_INDEX;
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
                tag 101;
                accept;
            }
        }
        term DIRECT-ROUTES-IPV4 {
            from {
                protocol direct;
                route-filter $CORE_LINK_SUPERNET prefix-length-range /30-/30;
            }
            then accept;
        }
        term CORE-SUMMARY {
            from {
                protocol aggregate;
                tag [ 1000 1001 ];
                tag2 0;
            }
            then reject;
        }
        term REJECT {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-isis-export-loopbacks.conf

```
/*
 * Topic:   IS-IS export policy PS-ISIS-EXPORT carrying the node loopbacks, ending after the loopback terms
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509
 *
 * Highlights:
 *  - `term OOB-MGMT` rejects anything learned on the out-of-band management
 *    interfaces before the loopback terms are reached.
 *  - `term LOCAL-LOOPBACK-IPV4` accepts the node's own lo0 /32, tags it 101 and
 *    attaches the node segment together with the flex-algorithm 128 and 129
 *    prefix segments, so the loopback is reachable on all three algorithms.
 *  - `term LOCAL-LOOPBACK-IPV6` accepts the matching IPv6 loopback with the
 *    same tag.
 *  - The policy ends after the loopback terms, so everything it does not match
 *    falls through to the IS-IS default action.
 *
 * Variables (example values from mdr2_mx10003):
 *   $LOOPBACK_V4        e.g. 1.1.0.13
 *   $SR_INDEX_ALGO128   e.g. 513
 *   $SR_INDEX_ALGO129   e.g. 613
 *   $SR_INDEX           e.g. 913
 *   $LOOPBACK_V6        e.g. 2001::1:1:0:d
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
                tag 101;
                prefix-segment {
                    algorithm 128 index $SR_INDEX_ALGO128 node-segment;
                    algorithm 129 index $SR_INDEX_ALGO129 node-segment;
                    index $SR_INDEX;
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
                tag 101;
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-isis-export.conf

```
/*
 * Topic:   IS-IS export policy PS-ISIS-EXPORT carrying the node loopbacks with their prefix segments
 * Seen on:
 *   Junos: an2_acx5448 ma2_mx204 ma4_mx204 ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l
 *
 * Highlights:
 *  - `term OOB-MGMT` rejects anything learned on the out-of-band management
 *    interfaces before the loopback terms are reached.
 *  - `term LOCAL-LOOPBACK-IPV4` accepts the node's own lo0 /32, tags it 101 and
 *    attaches the node segment together with the flex-algorithm 128 and 129
 *    prefix segments, so the loopback is reachable on all three algorithms.
 *  - `term LOCAL-LOOPBACK-IPV6` accepts the matching IPv6 loopback with the
 *    same tag.
 *  - `term REJECT` terminates the policy, so IS-IS advertises only the two
 *    loopbacks.
 *
 * Variables (example values from an2_acx5448):
 *   $LOOPBACK_V4        e.g. 1.1.0.1
 *   $SR_INDEX_ALGO128   e.g. 501
 *   $SR_INDEX_ALGO129   e.g. 601
 *   $SR_INDEX           e.g. 901
 *   $LOOPBACK_V6        e.g. 2001::1:1:0:1
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
                tag 101;
                prefix-segment {
                    algorithm 128 index $SR_INDEX_ALGO128 node-segment;
                    algorithm 129 index $SR_INDEX_ALGO129 node-segment;
                    index $SR_INDEX;
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
                tag 101;
                accept;
            }
        }
        term REJECT {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-local-loopback-anycast.conf

```
/*
 * Topic:   policy-statement PS-LOCAL-LOOPBACK
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 * Pair with:
 *  - junos/policy-options/community/cm-loopback.conf
 * Variables: none
 */
policy-options {
    policy-statement PS-LOCAL-LOOPBACK {
        term LOCAL-LOOPBACK {
            from {
                protocol direct;
                interface lo0.0;
                route-filter 1.1.0.0/16 prefix-length-range /32-/32;
                route-filter 1.1.10.10/32 exact;
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
}
```

## junos/policy-options/policy-statement/ps-loopback-allow.conf

```
/*
 * Topic:   Single-term policy accepting a prefix and its more-specifics
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - One unnamed term matches the prefix `orlonger` and accepts it, so the
 *    prefix and every more-specific inside it pass.
 *  - The configured policy name is a value: a node may carry this same body
 *    under more than one name.
 *
 * Variables (example values from an1_mx204):
 *   $POLICY_NAME   e.g. ALLOW_LOOPBACK
 *                  (the configured policy name; configuration that references
 *                   the policy carries this exact literal)
 *   $PREFIX        e.g. 0.0.0.0/32
 */
policy-options {
    policy-statement $POLICY_NAME {
        from {
            route-filter $PREFIX orlonger;
        }
        then accept;
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

## junos/policy-options/policy-statement/ps-multipath.conf

```
/*
 * Topic:   Recursive multipath resolution policy
 * Seen on:
 *   Junos: an1_mx204 ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 * Pair with: none
 * Variables: none
 */
policy-options {
    policy-statement PS-MULTIPATH {
        term recursive-resolution {
            then multipath-resolve;
        }
    }
}```

## junos/policy-options/policy-statement/ps-prefix-sid.conf

```
/*
 * Topic:   Policy prefix-sid attaching the node and flex-algorithm prefix segments to the loopback
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - A single term matches the node's own loopback /32 `exact`.
 *  - `prefix-segment` assigns the node segment index and one prefix segment per
 *    flex-algorithm, so the loopback carries a prefix SID on algorithm 0, 128
 *    and 129.
 *
 * Variables (example values from an1_mx204):
 *   $LOOPBACK_V4        e.g. 1.1.0.0
 *   $SR_INDEX_ALGO128   e.g. 500
 *   $SR_INDEX_ALGO129   e.g. 600
 *   $SR_INDEX           e.g. 900
 */
policy-options {
    policy-statement prefix-sid {
        term 1 {
            from {
                route-filter $LOOPBACK_V4/32 exact;
            }
            then {
                prefix-segment {
                    algorithm 128 index $SR_INDEX_ALGO128 node-segment;
                    algorithm 129 index $SR_INDEX_ALGO129 node-segment;
                    index $SR_INDEX;
                    node-segment;
                }
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

## junos/policy-options/policy-statement/ps-sr-nonzero-loopback-v4.conf

```
/*
 * Topic:   Policy SR_NONZERO_LOOPBACKS_V4 attaching a prefix segment to the IPv4 SR loopback
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - A `/32 exact` route-filter selects the node's Segment Routing IPv4
 *    loopback, distinct from the primary loopback.
 *  - `prefix-segment index` assigns that address its own SR index and accepts
 *    it, so the SR loopback is advertised with a prefix SID of its own.
 *
 * Variables (example values from an1_mx204):
 *   $LOOPBACK_SR_V4   e.g. 1.1.10.0
 *   $SR_INDEX_V4      e.g. 200
 */
policy-options {
    policy-statement SR_NONZERO_LOOPBACKS_V4 {
        term t1 {
            from {
                route-filter $LOOPBACK_SR_V4/32 exact;
            }
            then {
                prefix-segment {
                    index $SR_INDEX_V4;
                }
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-sr-nonzero-loopback-v6.conf

```
/*
 * Topic:   Policy SR_NONZERO_LOOPBACKS_V6 attaching a prefix segment to the IPv6 SR loopback
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `from family inet6` with a `/128 exact` route-filter selects the node's
 *    Segment Routing IPv6 loopback, distinct from the primary loopback.
 *  - `prefix-segment index` assigns that address its own SR index and accepts
 *    it, so the SR loopback is advertised with a prefix SID of its own.
 *
 * Variables (example values from an1_mx204):
 *   $LOOPBACK_SR_V6   e.g. 2001::1:1:10:0
 *   $SR_INDEX_V6      e.g. 300
 */
policy-options {
    policy-statement SR_NONZERO_LOOPBACKS_V6 {
        term t1 {
            from {
                family inet6;
                route-filter $LOOPBACK_SR_V6/128 exact;
            }
            then {
                prefix-segment {
                    index $SR_INDEX_V6;
                }
                accept;
            }
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

## junos/protocols/esis-disable.conf

```
/*
 * Topic:   esis
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   meg1_acx7100-32c
 * Pair with: none
 * Variables: none
 */
protocols {
    esis {
        disable;
    }
}
```

## junos/protocols/isis-instance-intf-l2-bfd-mdr1.conf

```
/*
 * Topic:   IS-IS logical interface
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   ma3_acx7100-48l mdr1_acx7509
 * Variables:
 *   $CORE_INTF   e.g. ae82.1
 *   $DELAY_METRIC   e.g. 5
 *   $ISIS_INSTANCE   e.g. metro-a
 *   $TE_METRIC   e.g. 5
 */
protocols {
  isis-instance $ISIS_INSTANCE {
    interface $CORE_INTF {
      level 1 disable;
      level 2 {
        post-convergence-lfa {
          node-protection cost 16777214;
        }
        application-specific {
          attribute-group ASLA {
            advertise-delay-metric;
            te-metric $TE_METRIC;
            admin-group [ green blue ];
            application {
              flex-algorithm;
            }
          }
        }
      }
      delay-metric $DELAY_METRIC;
      point-to-point;
      family inet {
        bfd-liveness-detection {
          minimum-interval 100;
          multiplier 3;
          no-adaptation;
        }
      }
    }
  }
}
```

## junos/protocols/isis-instance-intf-l2-bfd.conf

```
/*
 * Topic:   IS-IS logical interface
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   ma3_acx7100-48l mdr1_acx7509
 * Variables:
 *   $ADMIN_GROUP_1   e.g. green
 *   $ADMIN_GROUP_2   e.g. blue
 *   $CORE_INTF   e.g. ae55.1
 *   $ISIS_INSTANCE   e.g. metro-a
 */
protocols {
  isis-instance $ISIS_INSTANCE {
    interface $CORE_INTF {
      level 2 {
        post-convergence-lfa {
          node-protection cost 16777214;
        }
        application-specific {
          attribute-group ASLA {
            advertise-delay-metric;
            te-metric 5;
            admin-group [ $ADMIN_GROUP_1 $ADMIN_GROUP_2 ];
            application {
              flex-algorithm;
            }
          }
        }
      }
      level 1 disable;
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
  }
}
```

## junos/protocols/isis-instance-l2-export.conf

```
/*
 * Topic:   IS-IS SR-MPLS process settings
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509
 * Variables:
 *   $EXPORT_POLICY   e.g. export_isis_metro_a_ribs
 *   $ISIS_INSTANCE   e.g. metro-b
 *   $ISIS_NET   e.g. 49.0002.0010.0100.0012.00
 *   $NODE_SID_V4   e.g. 12
 *   $NODE_SID_V6   e.g. 112
 */
protocols {
  isis-instance $ISIS_INSTANCE {
    apply-groups GR-ISIS-BCP;
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
    level 2 wide-metrics-only;
    level 1 disable;
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
    export [ PS-ISIS-EXPORT $EXPORT_POLICY ];
    net $ISIS_NET;
  }
}
```

## junos/protocols/isis-instance-loopback-passive.conf

```
/*
 * Topic:   IS-IS logical interface
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   ma3_acx7100-48l mdr1_acx7509
 * Variables:
 *   $ISIS_INSTANCE   e.g. metro-a
 */
protocols {
  isis-instance $ISIS_INSTANCE {
    interface lo0.0 {
      passive;
    }
  }
}
```

## junos/protocols/isis-interface-2-1-disable-te-metric-10-admin-group-green-blue-delay-metric-10-bfd.conf

```
/*
 * Topic:   ISIS core interface
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   (none)
 * Pair with:
 *  - junos/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. et-0/1/1.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 2 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 10;
                        admin-group [ green blue ];
                        application {
                            flex-algorithm;
                        }
                    }
                }
            }
            level 1 disable;
            delay-metric 10;
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
    }
}
```

## junos/protocols/isis-interface-2-te-metric-10-admin-group-blue-green-delay-metric-10-bfd.conf

```
/*
 * Topic:   ISIS core interface
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 * Pair with:
 *  - junos/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. et-0/0/11.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 2 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 10;
                        admin-group [ blue green ];
                        application {
                            flex-algorithm;
                        }
                    }
                }
            }
            delay-metric 10;
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
    }
}
```

## junos/protocols/isis-interface-2-te-metric-20-admin-group-blue-green-delay-metric-10-bfd.conf

```
/*
 * Topic:   ISIS core interface
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 * Pair with:
 *  - junos/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $CORE_INTF   e.g. et-0/0/9.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 2 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric 20;
                        admin-group [ blue green ];
                        application {
                            flex-algorithm;
                        }
                    }
                }
            }
            delay-metric 10;
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
    }
}
```

## junos/protocols/isis-intf-l1-groups-bfd.conf

```
/*
 * Topic:   IS-IS logical interface
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c
 * Variables:
 *   $ADMIN_GROUP_1   e.g. green
 *   $ADMIN_GROUP_2   e.g. blue
 *   $CORE_INTF   e.g. ae71.0
 *   $DELAY_METRIC   e.g. 105
 *   $TE_METRIC   e.g. 110
 */
protocols {
  isis {
    interface $CORE_INTF {
      level 1 {
        post-convergence-lfa {
          node-protection cost 16777214;
        }
        application-specific {
          attribute-group ASLA {
            advertise-delay-metric;
            te-metric $TE_METRIC;
            admin-group [ $ADMIN_GROUP_1 $ADMIN_GROUP_2 ];
            application {
              flex-algorithm;
            }
          }
        }
      }
      delay-metric $DELAY_METRIC;
      point-to-point;
      family inet {
        bfd-liveness-detection {
          minimum-interval 100;
          multiplier 3;
          no-adaptation;
        }
      }
    }
  }
}
```

## junos/protocols/isis-intf-l2-bfd-mdr1.conf

```
/*
 * Topic:   ISIS interface
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Pair with:
 *  - junos/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $ADMIN_GROUP   e.g. blue
 *   $CORE_INTF   e.g. et-1/0/3.0
 *   $DELAY_METRIC   e.g. 8
 *   $TE_METRIC   e.g. 25
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 2 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric $TE_METRIC;
                        admin-group $ADMIN_GROUP;
                        application {
                            flex-algorithm;
                        }
                    }
                }
            }
            level 1 disable;
            delay-metric $DELAY_METRIC;
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
    }
}
```

## junos/protocols/isis-intf-l2-bfd.conf

```
/*
 * Topic:   ISIS interface
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Pair with:
 *  - junos/interfaces/ifl-core-inet-iso-inet6-mpls.conf
 * Variables:
 *   $ADMIN_GROUP   e.g. blue
 *   $CORE_INTF   e.g. et-0/0/6.0
 *   $DELAY_METRIC   e.g. 5
 *   $TE_METRIC   e.g. 40
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 2 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                application-specific {
                    attribute-group ASLA {
                        advertise-delay-metric;
                        te-metric $TE_METRIC;
                        admin-group $ADMIN_GROUP;
                        application {
                            flex-algorithm;
                        }
                    }
                }
            }
            delay-metric $DELAY_METRIC;
            point-to-point;
            family inet {
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
    }
}
```

## junos/protocols/isis-intf-l2-groups-bfd-mdr1.conf

```
/*
 * Topic:   IS-IS logical interface
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509 meg2_acx7509
 * Variables:
 *   $ADMIN_GROUP_1   e.g. blue
 *   $ADMIN_GROUP_2   e.g. green
 *   $CORE_INTF   e.g. et-1/0/4.0
 *   $TE_METRIC   e.g. 10
 */
protocols {
  isis {
    interface $CORE_INTF {
      level 2 {
        post-convergence-lfa {
          node-protection cost 16777214;
        }
        application-specific {
          attribute-group ASLA {
            advertise-delay-metric;
            te-metric $TE_METRIC;
            admin-group [ $ADMIN_GROUP_1 $ADMIN_GROUP_2 ];
            application {
              flex-algorithm;
            }
          }
        }
      }
      level 1 disable;
      delay-metric 10;
      point-to-point;
      family inet {
        bfd-liveness-detection {
          minimum-interval 100;
          multiplier 3;
          no-adaptation;
        }
      }
    }
  }
}
```

## junos/protocols/isis-loopback-passive.conf

```
/*
 * Topic:   IS-IS logical interface
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Variables: none
 */
protocols {
  isis {
    interface lo0.0 {
      passive;
    }
  }
}
```

## junos/protocols/isis-srmpls-tilfa-l1.conf

```
/*
 * Topic:   IS-IS SR-MPLS process settings
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710
 *   EVO:   (none)
 * Variables:
 *   $NODE_SID_V4   e.g. 0
 *   $NODE_SID_V6   e.g. 100
 */
protocols {
  isis {
    apply-groups GR-ISIS-BCP;
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
  }
}
```

## junos/protocols/isis-srmpls-tilfa-l2-conditional.conf

```
/*
 * Topic:   IS-IS SR-MPLS process settings
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 * Variables:
 *   $ISIS_NET   e.g. 49.0005.0010.0100.0010.00
 *   $NODE_SID_V4   e.g. 10
 *   $NODE_SID_V6   e.g. 110
 */
protocols {
  isis {
    apply-groups GR-ISIS-BCP;
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
    export [ PS-ISIS-EXPORT FLOAT-PW-CONDITIONAL ];
    net $ISIS_NET;
  }
}
```

## junos/protocols/isis-srmpls-tilfa-l2-net-mdr1.conf

```
/*
 * Topic:   ISIS source-packet-routing
 * Seen on:
 *   Junos: mdr2_mx10003
 *   EVO:   mdr1_acx7509
 * Pair with:
 *  - evo/groups/gr-isis-bcp.conf
 *  - junos/policy-options/policy-statement/ps-isis-export-loopbacks.conf
 * Variables:
 *   $ISIS_NET   e.g. 49.0005.0010.0100.0012.00
 *   $NODE_SID_V4   e.g. 12
 *   $NODE_SID_V6   e.g. 112
 */
protocols {
    isis {
        apply-groups GR-ISIS-BCP;
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
        level 2 wide-metrics-only;
        level 1 disable;
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

## junos/protocols/isis-srmpls-tilfa-l2-net.conf

```
/*
 * Topic:   ISIS source-packet-routing
 * Seen on:
 *   Junos: ma2_mx204 ma4_mx204 ma5_mx204
 *   EVO:   ma1-1_acx7024 ma1-2_acx7024
 * Pair with:
 *  - evo/groups/gr-isis-bcp.conf
 *  - junos/policy-options/policy-statement/ps-isis-export.conf
 * Variables:
 *   $ISIS_NET   e.g. 49.0001.0010.0100.0018.00
 *   $NODE_SID_V4   e.g. 18
 *   $NODE_SID_V6   e.g. 118
 */
protocols {
    isis {
        apply-groups GR-ISIS-BCP;
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

## junos/protocols/isis-srmpls-tilfa-l2.conf

```
/*
 * Topic:   ISIS source-packet-routing
 * Seen on:
 *   Junos: ma2_mx204 ma4_mx204 ma5_mx204
 *   EVO:   cr1_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024
 * Pair with:
 *  - evo/groups/gr-isis-bcp.conf
 *  - junos/policy-options/policy-statement/ps-isis-export.conf
 * Variables:
 *   $NODE_SID_V4   e.g. 8
 *   $NODE_SID_V6   e.g. 108
 */
protocols {
    isis {
        apply-groups GR-ISIS-BCP;
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

## junos/protocols/ldp-loopback.conf

```
/*
 * Topic:   LDP loopback interface
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 * Variables: none
 */
protocols {
  ldp {
    interface lo0.0;
  }
}
```

## junos/protocols/mpls-segment-routing-loopback.conf

```
/*
 * Topic:   MPLS segment routing
 * Seen on:
 *   Junos: mse1_mx304
 *   EVO:   (none)
 * Variant group: mebs-mpls-admin-groups
 *   Provides: transport:mpls-admin-groups
 * Pair with:
 *  - junos/interfaces/ifl-loopback-primary-iso-sr-v6.conf
 * Variables: none
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
        interface lo0.0;
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
 * Variant group: mebs-mpls-admin-groups
 *   Provides: transport:mpls-admin-groups
 *
 * Highlights:
 *  - admin-groups (blue/green/red) referenced by ISIS attribute-groups
 *    for color-aware path computation
 *  - SRGB label range 16000–24000 used by ISIS source-packet-routing
 *  - icmp-tunneling for traceroute through MPLS
 *  - ipv6-tunneling enables 6PE over the SR-MPLS underlay
 *
 * Pair with: none
 *
 * Variables: none
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
 *  - variant:mebs-fatpw-label-form capabilities=gr:fatpw-label
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
 *  - junos/interfaces/ethernet-bridge.conf
 *  - variant:mebs-irb-form capabilities=ifl:irb
 *  - variant:mebs-bgp-overlay families=evpn
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

## junos/routing-instances/evpn-elan/ri-evpn-floating-pw.conf

```
/*
 * Topic:   EVPN instance binding an attachment circuit and a floating pseudowire interface
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - An EVPN instance carrying one VLAN, with two logical interfaces bound to
 *    it: the customer attachment circuit and a `ps` pseudowire interface, so
 *    the service reaches both a local access port and a pseudowire whose
 *    termination can move between nodes.
 *  - `protocols { evpn; }` carries no options: the instance takes the EVPN
 *    defaults and is steered entirely by its route target.
 *  - The route distinguisher is built from the node's own loopback, so each PE
 *    advertises the same service with a distinct RD.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from mse1_mx304 / 300-evpn-floating-pw):
 *   $INSTANCE_NAME     e.g. 300-evpn-floating-pw
 *   $VLAN              e.g. 300
 *   $AC_INTF           e.g. ae10.300
 *   $PS_INTF           e.g. ps0.300
 *   $LOOPBACK_V4       e.g. 1.1.0.10
 *   $RD_SUB_ASSIGNED   e.g. 300
 *   $RT_AS             e.g. 300
 *   $RT_ID             e.g. 300
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn;
        protocols {
            evpn;
        }
        vlan-id $VLAN;
        interface $AC_INTF;
        interface $PS_INTF;
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
 * Topic:   EVPN E-Tree routing instance
 * Seen on:
 *   Junos: ma4_mx204 ma5_mx204 mse1_mx304 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - `instance-type evpn` with a single-VLAN body and the `evpn-etree` knob
 *    inside `protocols evpn`, enabling MEF 6.2 E-Tree (rooted-multipoint)
 *    semantics on top of the standard EVPN-ELAN service.
 *  - Root/leaf role is per-AC, configured on the customer-facing interface
 *    (not in this body); roots reach roots and leaves, leaves cannot reach
 *    other leaves.
 *  - `vlan-id $VLAN` — single-VLAN-per-instance (not vlan-id none), which
 *    distinguishes this from the port-based / mac-vrf vlan-bundle shape.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
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

## junos/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-export.conf

```
/*
 * Topic:   VLAN-unaware EVPN-VPWS flexible cross-connect bundling two logical interfaces
 * Seen on:
 *   Junos: mse1_mx304
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - `flexible-cross-connect-vlan-unaware` bundles the listed logical
 *    interfaces into one cross-connect without regard to their VLAN tags, so
 *    the group is carried as a single VPWS service.
 *  - The `fxc` group names two logical interfaces on the same port and one
 *    `service-id` pair, whose `local` and `remote` values match this group to
 *    its counterpart on the far-end PE.
 *  - `vrf-export` names a per-instance policy, so this instance controls which
 *    routes it advertises rather than relying on the route target alone.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from mse1_mx304 / evpn_group_40_10):
 *   $INSTANCE_NAME      e.g. evpn_group_40_10
 *   $AC_INTF            e.g. et-0/0/4
 *   $UNIT_A             e.g. 1809
 *   $UNIT_B             e.g. 2309
 *   $SVC_ID_LOCAL       e.g. 2
 *   $SVC_ID_REMOTE      e.g. 1
 *   $LOOPBACK_V4        e.g. 1.1.0.10
 *   $RD_SUB_ASSIGNED    e.g. 410
 *   $RT_AS              e.g. 63535
 *   $RT_ID              e.g. 410
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
 *  - variant:mebs-edge-intf-form capabilities=gr:edge-intf
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
 *  - variant:mebs-edge-intf-form capabilities=gr:edge-intf
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

## junos/routing-instances/l2vpn/ri-l2vpn-kompella-vlan-control-word-export.conf

```
/*
 * Topic:   BGP L2VPN instance with VLAN-preserving encapsulation and a control word, with vrf-export
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - A BGP-signalled (Kompella) L2VPN: the named site carries this node's site
 *    identifier, and the attachment circuit inside it names the remote site it
 *    is cross-connected to, so the pseudowire is addressed by site rather than
 *    by neighbour.
 *  - `encapsulation-type ethernet-vlan` carries the customer VLAN tag across
 *    the pseudowire, so the tag is significant end to end.
 *  - `control-word` inserts the control word ahead of the customer frame, so
 *    transit routers do not mistake the payload for IP when hashing.
 *  - `vrf-export` names a per-instance policy, so this instance controls which
 *    routes it advertises rather than relying on the route target alone.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=l2vpn
 *
 * Variables (example values from ma5_mx204 / l2vpn_group_105_350):
 *   $INSTANCE_NAME           e.g. l2vpn_group_105_350
 *   $L2VPN_SITE              e.g. r19
 *   $L2VPN_LOCAL_SITE_ID     e.g. 1119
 *   $L2VPN_REMOTE_SITE_ID    e.g. 1102
 *   $AC_INTF                 e.g. xe-0/1/4.350
 *   $RD                      e.g. 63535:1192150
 *   $RT                      e.g. 63535:1092150
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
                encapsulation-type ethernet-vlan;
                control-word;
            }
        }
        interface $AC_INTF;
        route-distinguisher $RD;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$RT;
    }
}
```

## junos/routing-instances/l2vpn/ri-l2vpn-kompella-vlan-control-word.conf

```
/*
 * Topic:   BGP L2VPN instance with VLAN-preserving encapsulation and a control word
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - A BGP-signalled (Kompella) L2VPN: the named site carries this node's site
 *    identifier, and the attachment circuit inside it names the remote site it
 *    is cross-connected to, so the pseudowire is addressed by site rather than
 *    by neighbour.
 *  - `encapsulation-type ethernet-vlan` carries the customer VLAN tag across
 *    the pseudowire, so the tag is significant end to end.
 *  - `control-word` inserts the control word ahead of the customer frame, so
 *    transit routers do not mistake the payload for IP when hashing.
 *  - Advertisement is governed by the route target alone; the instance has no
 *    per-instance export policy.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=l2vpn
 *
 * Variables (example values from ma5_mx204 / l2vpn_group_105_201):
 *   $INSTANCE_NAME           e.g. l2vpn_group_105_201
 *   $L2VPN_SITE              e.g. r19
 *   $L2VPN_LOCAL_SITE_ID     e.g. 1119
 *   $L2VPN_REMOTE_SITE_ID    e.g. 1102
 *   $AC_INTF                 e.g. xe-0/1/4.201
 *   $RD                      e.g. 63535:1192001
 *   $RT                      e.g. 63535:1092001
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
                encapsulation-type ethernet-vlan;
                control-word;
            }
        }
        interface $AC_INTF;
        route-distinguisher $RD;
        vrf-target target:$RT;
    }
}
```

## junos/routing-instances/l2vpn/ri-l2vpn-kompella-vlan-export.conf

```
/*
 * Topic:   BGP L2VPN instance with VLAN-preserving encapsulation, with vrf-export
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - A BGP-signalled (Kompella) L2VPN: the named site carries this node's site
 *    identifier, and the attachment circuit inside it names the remote site it
 *    is cross-connected to, so the pseudowire is addressed by site rather than
 *    by neighbour.
 *  - `encapsulation-type ethernet-vlan` carries the customer VLAN tag across
 *    the pseudowire, so the tag is significant end to end.
 *  - `no-control-word` omits the control word, so no extra shim is inserted
 *    ahead of the customer frame.
 *  - `vrf-export` names a per-instance policy, so this instance controls which
 *    routes it advertises rather than relying on the route target alone.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=l2vpn
 *
 * Variables (example values from ma5_mx204 / l2vpn_group_105_300):
 *   $INSTANCE_NAME           e.g. l2vpn_group_105_300
 *   $L2VPN_SITE              e.g. r19
 *   $L2VPN_LOCAL_SITE_ID     e.g. 1119
 *   $L2VPN_REMOTE_SITE_ID    e.g. 1102
 *   $AC_INTF                 e.g. xe-0/1/4.300
 *   $RD                      e.g. 63535:1192100
 *   $RT                      e.g. 63535:1092100
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
                encapsulation-type ethernet-vlan;
                no-control-word;
            }
        }
        interface $AC_INTF;
        route-distinguisher $RD;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$RT;
    }
}
```

## junos/routing-instances/l2vpn/ri-l2vpn-kompella-vlan.conf

```
/*
 * Topic:   BGP L2VPN instance with VLAN-preserving encapsulation
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - A BGP-signalled (Kompella) L2VPN: the named site carries this node's site
 *    identifier, and the attachment circuit inside it names the remote site it
 *    is cross-connected to, so the pseudowire is addressed by site rather than
 *    by neighbour.
 *  - `encapsulation-type ethernet-vlan` carries the customer VLAN tag across
 *    the pseudowire, so the tag is significant end to end.
 *  - `no-control-word` omits the control word, so no extra shim is inserted
 *    ahead of the customer frame.
 *  - Advertisement is governed by the route target alone; the instance has no
 *    per-instance export policy.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=l2vpn
 *
 * Variables (example values from ma5_mx204 / l2vpn_group_105_200):
 *   $INSTANCE_NAME           e.g. l2vpn_group_105_200
 *   $L2VPN_SITE              e.g. r19
 *   $L2VPN_LOCAL_SITE_ID     e.g. 1119
 *   $L2VPN_REMOTE_SITE_ID    e.g. 1102
 *   $AC_INTF                 e.g. xe-0/1/4.200
 *   $RD                      e.g. 63535:1192000
 *   $RT                      e.g. 63535:1092000
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
                encapsulation-type ethernet-vlan;
                no-control-word;
            }
        }
        interface $AC_INTF;
        route-distinguisher $RD;
        vrf-target target:$RT;
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
 *  - variant:mebs-fatpw-label-form capabilities=gr:fatpw-label
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

## junos/routing-instances/l3vpn/ri-l3vpn-bgp-v6-vrf-policy-auto-export.conf

```
/*
 * Topic:   IPv6 L3VPN VRF with PE-CE eBGP and auto-export
 * Seen on:
 *   Junos: ma4_mx204 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l
 *
 * Highlights:
 *  - `instance-type vrf` carrying customer IPv6 routes; PE-CE eBGP under
 *    `protocols bgp group v6Ixia` with `family inet6 { any; }`, `peer-as
 *    <CUST_ASN>` and `as-override`, so the customer's own ASN is rewritten
 *    out of AS_PATH on the return direction.
 *  - `routing-options router-id; auto-export;` — auto-export leaks routes to
 *    the sibling VRFs on the device that share an import route target.
 *  - `vrf-import / vrf-export` name the per-VRF import and export policies.
 *    The configured names vary per service, so both are bindings: an3 uses a
 *    `PS-` prefix while ma4, mse1 and mse2 do not.
 *  - `vrf-table-label` enables one MPLS label per VRF, so the egress PE does
 *    an L3 lookup on the inner header.
 *
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-import-l3vpn-internet.conf
 *
 * Variables (example values from ma4_mx204 / METRO_BGPv6_L3VPN_3001):
 *   $INSTANCE_NAME    e.g. METRO_BGPv6_L3VPN_3001
 *   $IMPORT_POL       e.g. METRO_BGPv6_L3VPN_3001-IMPORT
 *   $EXPORT_POL       e.g. METRO_BGPv6_L3VPN_3001-EXPORT
 *   $ROUTER_ID        e.g. 1.1.0.16
 *   $AC_INTF          e.g. xe-0/1/4.3001
 *   $CE_PEER_V6       e.g. 2001:0:0:0:17:3:0:2
 *   $PE_LOCAL_V6      e.g. 2001:0:0:0:17:3:0:1
 *   $AS_CUST          e.g. 64514
 *   $RD               e.g. 63536:43001
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
        vrf-import $IMPORT_POL;
        vrf-export $EXPORT_POL;
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
 *  - `vrf-import / vrf-export` name the per-VRF import and export policies,
 *    `${INSTANCE_NAME}-IMPORT` and `${INSTANCE_NAME}-EXPORT`.
 *  - `vrf-table-label` enables one MPLS label per VRF (the common
 *    deployment vs per-prefix labels).
 *
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-import-l3vpn-internet.conf
 *  - junos/policy-options/community/cm-l3vpn-bgpv4.conf
 *  - junos/groups/gr-l3vpn.conf
 *  - variant:mebs-bgp-overlay families=inet-vpn
 *
 * JVD service mapping:
 *   2200 instances total (high 2200 / med 0 / low 0)
 *   On devices: mse2_mx304 (2200), mse1_mx304 (2199), ma4_mx204 (1999), an3_acx7100-48l (200), ma3_acx7100-48l (200)
 *   Example: INTERNET-VRF (RD 1.1.0.11:63536, RT —)
 *     mse2_mx304  xe-0/0/15:2.2001
 *
 * Variables (example values from mse1_mx304 / METRO_BGPv4_L3VPN_1001):
 *   $INSTANCE_NAME    e.g. METRO_BGPv4_L3VPN_1001
 *   $IMPORT_POL       e.g. METRO_BGPv4_L3VPN_1001-IMPORT
 *   $EXPORT_POL       e.g. METRO_BGPv4_L3VPN_1001-EXPORT
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
        vrf-import $IMPORT_POL;
        vrf-export $EXPORT_POL;
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
 *  - variant:mebs-irb-form capabilities=ifl:irb
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * Variables (example values from mse2_mx304 / METRO_L3VPN_4000):
 *   $INSTANCE_NAME    e.g. METRO_L3VPN_4000
 *   $IMPORT_POL       e.g. PS-METRO_L3VPN_4000-IMPORT
 *   $EXPORT_POL       e.g. PS-METRO_L3VPN_4000-EXPORT
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
        vrf-import $IMPORT_POL;
        vrf-export $EXPORT_POL;
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
 *  - junos/groups/gr-l3vpn.conf
 *  - junos/policy-options/policy-statement/ps-import-l3vpn.conf
 *  - junos/policy-options/policy-statement/ps-export-l3vpn-public.conf
 *  - variant:mebs-irb-form capabilities=ifl:irb
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
 *   $IMPORT_POL       e.g. PS-METRO_L3VPN_4000-IMPORT
 *   $EXPORT_POL       e.g. PS-METRO_L3VPN_4000-EXPORT
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
        vrf-import $IMPORT_POL;
        vrf-export $EXPORT_POL;
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
 *  - junos/groups/gr-l3vpn.conf
 *  - variant:mebs-irb-form capabilities=ifl:irb
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
 *   EVO:   an3_acx7100-48l ma3_acx7100-48l
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
 *  - `vrf-import / vrf-export` name the per-VRF import and export policies,
 *    `${INSTANCE_NAME}-IMPORT` and `${INSTANCE_NAME}-EXPORT`.
 *
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-import-l3vpn-internet.conf
 *  - junos/groups/gr-l3vpn.conf
 *  - variant:mebs-bgp-overlay families=inet-vpn
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
 *   $IMPORT_POL       e.g. METRO_L3VPN_1-IMPORT
 *   $EXPORT_POL       e.g. METRO_L3VPN_1-EXPORT
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
        vrf-import $IMPORT_POL;
        vrf-export $EXPORT_POL;
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
 *  - junos/policy-options/policy-statement/ps-import-l3vpn-internet.conf
 *  - junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf
 *  - variant:mebs-bgp-overlay families=evpn
 *
 * JVD service mapping:
 *   1000 instances on ma4_mx204.
 *   Example: METRO_L3VPN_1 (RD 63536:41)
 *     ma4_mx204  xe-0/1/4.1
 *
 * Variables (example values from ma4_mx204 / METRO_L3VPN_1):
 *   $INSTANCE_NAME   e.g. METRO_L3VPN_1
 *   $IMPORT_POL      e.g. METRO_L3VPN_1-IMPORT
 *   $EXPORT_POL      e.g. METRO_L3VPN_1-EXPORT
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
        vrf-import $IMPORT_POL;
        vrf-export $EXPORT_POL;
        vrf-table-label;
    }
}
```

## junos/routing-instances/vpls/ri-bgp-vpls-bridge-domain.conf

```
/*
 * Topic:   BGP-VPLS virtual-switch instance with a normalized bridge domain
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   (none)
 *
 * Highlights:
 *  - `instance-type virtual-switch` carries the VPLS in a bridging instance, so
 *    the service is expressed as a bridge domain rather than as a port-mode
 *    pseudowire.
 *  - `site` with `site-identifier` gives this PE its position in the BGP-VPLS
 *    mesh; `site-range` bounds how many sites the label block must cover and
 *    `label-block-size` sets how many labels each site advertises.
 *  - `no-tunnel-services` builds the pseudowire without a tunnel-services PIC.
 *  - The bridge domain pins its own `vlan-id` and takes one attachment
 *    circuit; `no-normalization` keeps the customer tag as it arrives instead
 *    of rewriting it to the domain VLAN.
 *
 * Pair with: none
 *
 * Variables (example values from ma5_mx204):
 *   $INSTANCE_NAME      e.g. vpls_group_108_850
 *   $VPLS_SITE          e.g. r19
 *   $VPLS_SITE_ID       e.g. 3
 *   $SITE_RANGE         e.g. 10
 *   $LABEL_BLOCK_SIZE   e.g. 8
 *   $BD_NAME            e.g. vlan850
 *   $VLAN               e.g. 850
 *   $AC_INTF            e.g. xe-0/1/4.850
 *   $RD                 e.g. 64535:81050
 *   $RT_AS              e.g. 64535
 *   $RT_ID              e.g. 1183050
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-switch;
        protocols {
            vpls {
                site $VPLS_SITE {
                    site-identifier $VPLS_SITE_ID;
                }
                site-range $SITE_RANGE;
                label-block-size $LABEL_BLOCK_SIZE;
                no-tunnel-services;
            }
        }
        bridge-domains {
            $BD_NAME {
                vlan-id $VLAN;
                interface $AC_INTF;
                bridge-options {
                    no-normalization;
                }
            }
        }
        route-distinguisher $RD;
        vrf-target target:$RT_AS:$RT_ID;
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

## junos/routing-instances/vpls/ri-bgp-vpls-site-range-export.conf

```
/*
 * Topic:   BGP VPLS instance with a sized site range and label block, with vrf-export
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   (none)
 *
 * Highlights:
 *  - A BGP-signalled VPLS instance: the named site carries a site identifier
 *    that the far-end PEs use to compute this node's position in the label
 *    block.
 *  - `site-range` caps how many sites the instance will accept and
 *    `label-block-size` fixes how many labels each site advertises, so the
 *    label arithmetic is deterministic across the mesh.
 *  - `no-tunnel-services` builds the VPLS mesh without a dedicated tunnel
 *    interface, so no tunnel-services PIC is required.
 *  - `vrf-export` names a per-instance policy, so this instance controls which
 *    routes it advertises rather than relying on the route target alone.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=l2vpn
 *
 * Variables (example values from ma5_mx204 / vpls_group_102_400):
 *   $INSTANCE_NAME      e.g. vpls_group_102_400
 *   $VPLS_SITE          e.g. r19
 *   $VPLS_SITE_ID       e.g. 3
 *   $SITE_RANGE         e.g. 10
 *   $LABEL_BLOCK_SIZE   e.g. 8
 *   $AC_INTF            e.g. xe-0/1/4.400
 *   $RD                 e.g. 63536:1093000
 *   $RT                 e.g. 63535:1093000
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vpls;
        protocols {
            vpls {
                site $VPLS_SITE {
                    site-identifier $VPLS_SITE_ID;
                }
                site-range $SITE_RANGE;
                label-block-size $LABEL_BLOCK_SIZE;
                no-tunnel-services;
            }
        }
        interface $AC_INTF;
        route-distinguisher $RD;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$RT;
    }
}
```

## junos/routing-instances/vpls/ri-bgp-vpls-site-range.conf

```
/*
 * Topic:   BGP VPLS instance with a sized site range and label block
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   (none)
 *
 * Highlights:
 *  - A BGP-signalled VPLS instance: the named site carries a site identifier
 *    that the far-end PEs use to compute this node's position in the label
 *    block.
 *  - `site-range` caps how many sites the instance will accept and
 *    `label-block-size` fixes how many labels each site advertises, so the
 *    label arithmetic is deterministic across the mesh.
 *  - `no-tunnel-services` builds the VPLS mesh without a dedicated tunnel
 *    interface, so no tunnel-services PIC is required.
 *  - Advertisement is governed by the route target alone; the instance has no
 *    per-instance export policy.
 *
 * Pair with:
 *  - variant:mebs-bgp-overlay families=l2vpn
 *
 * Variables (example values from ma5_mx204 / vpls_group_102_500):
 *   $INSTANCE_NAME      e.g. vpls_group_102_500
 *   $VPLS_SITE          e.g. r19
 *   $VPLS_SITE_ID       e.g. 3
 *   $SITE_RANGE         e.g. 10
 *   $LABEL_BLOCK_SIZE   e.g. 8
 *   $AC_INTF            e.g. xe-0/1/4.500
 *   $RD                 e.g. 63536:1093100
 *   $RT                 e.g. 63535:1093100
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vpls;
        protocols {
            vpls {
                site $VPLS_SITE {
                    site-identifier $VPLS_SITE_ID;
                }
                site-range $SITE_RANGE;
                label-block-size $LABEL_BLOCK_SIZE;
                no-tunnel-services;
            }
        }
        interface $AC_INTF;
        route-distinguisher $RD;
        vrf-target target:$RT;
    }
}
```

## junos/routing-options/aggregate-discard-routes.conf

```
/*
 * Topic:   Tagged discard aggregates for the loopback and core-link supernets
 * Seen on:
 *   Junos: an1_mx204 an4_acx710
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - Two locally generated aggregates summarize the loopback supernet and the
 *    core-link supernet; `discard` drops anything they attract that has no
 *    contributing route.
 *  - `tag 1000` and `tag 1001` with `tag2 0` mark them so IGP export policy can
 *    match the summaries by tag rather than by prefix.
 *  - `preference 14` keeps the aggregate below the contributing routes, so a
 *    more specific route always wins.
 *
 * Variables (example values from an1_mx204):
 *   $LOOPBACK_SUPERNET     e.g. 1.1.0.0/24
 *   $CORE_LINK_SUPERNET    e.g. 10.10.0.0/24
 */
routing-options {
    aggregate {
        route $LOOPBACK_SUPERNET {
            tag 1000;
            tag2 0;
            preference 14;
            discard;
        }
        route $CORE_LINK_SUPERNET {
            tag 1001;
            tag2 0;
            preference 14;
            discard;
        }
    }
}
```

## junos/routing-options/flex-algorithm-128-transport-class.conf

```
/*
 * Topic:   flex-algorithm 128
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l
 * Pair with: none
 * Variables: none
 */
routing-options {
    flex-algorithm 128 {
        color 4000;
        use-transport-class;
    }
}
```

## junos/routing-options/flex-algorithm-129-transport-class.conf

```
/*
 * Topic:   flex-algorithm 129
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l
 * Pair with: none
 * Variables: none
 */
routing-options {
    flex-algorithm 129 {
        color 6000;
        use-transport-class;
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
 *
 * Pair with:
 *  - variant:mebs-mpls-admin-groups capabilities=transport:mpls-admin-groups
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

## junos/routing-options/forwarding-table-pplb-chained-nh.conf

```
/*
 * Topic:   Forwarding table with per-packet load balancing and ingress chained composite next hops
 * Seen on:
 *   Junos: an1_mx204
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `export` applies the per-packet load-balancing policy to the forwarding
 *    table, which is what turns multiple equal-cost routes into multiple
 *    forwarding next hops.
 *  - `chained-composite-next-hop ingress` builds one shared next hop per
 *    service family, so L2VPN, L2 circuit, EVPN and L3VPN routes that share a
 *    transport tunnel also share forwarding state.
 *
 * Pair with:
 *  - junos/policy-options/policy-statement/per-packet-load-balance.conf
 *
 * Variables (example values from an1_mx204):
 *   $PPLB_NAME   e.g. pplb
 *                (the configured load-balancing policy name; the forwarding
 *                 table carries this exact literal)
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
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

## junos/routing-options/forwarding-table-pplb-ecmp-fast-reroute-l2vpn.conf

```
/*
 * Topic:   forwarding-table
 * Seen on:
 *   Junos: ma5_mx204
 *   EVO:   (none)
 * Pair with:
 *  - junos/policy-options/policy-statement/per-packet-load-balance.conf
 * Variables:
 *   $PPLB_NAME   e.g. pplb
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
        dynamic-list-next-hop;
        ecmp-fast-reroute;
        chained-composite-next-hop {
            ingress {
                l2vpn;
                evpn;
                l3vpn;
            }
        }
    }
}
```

## junos/routing-options/forwarding-table-pplb-ecmp-fast-reroute.conf

```
/*
 * Topic:   forwarding-table
 * Seen on:
 *   Junos: ma4_mx204
 *   EVO:   (none)
 * Pair with:
 *  - junos/policy-options/policy-statement/per-packet-load-balance.conf
 * Variables:
 *   $PPLB_NAME   e.g. pplb
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
        dynamic-list-next-hop;
        ecmp-fast-reroute;
        chained-composite-next-hop {
            ingress {
                evpn;
                l3vpn;
            }
        }
    }
}
```

## junos/routing-options/forwarding-table-pplb-evpn-l3vpn.conf

```
/*
 * Topic:   forwarding-table
 * Seen on:
 *   Junos: an2_acx5448 an4_acx710
 *   EVO:   (none)
 * Pair with:
 *  - junos/policy-options/policy-statement/per-packet-load-balance.conf
 * Variables:
 *   $PPLB_NAME   e.g. pplb
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
        chained-composite-next-hop {
            ingress {
                evpn;
                l3vpn;
            }
        }
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

## junos/routing-options/interface-routes-loopback.conf

```
/*
 * Topic:   Interface routes using the local loopback RIB group
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Variables: none
 */
routing-options {
  interface-routes {
    rib-group inet RG-LOCAL-LOOPBACK;
  }
}
```

## junos/routing-options/protect-core.conf

```
/*
 * Topic:   protect core
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Pair with: none
 * Variables: none
 */
routing-options {
    protect core;
}
```

## junos/routing-options/resolution-transport-class-l3vpn-rib-v6-first.conf

```
/*
 * Topic:   IPv6-first transport-class resolution with L3VPN multipath import
 * Seen on:
 *   Junos: mse1_mx304
 *   EVO:   an3_acx7100-48l
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-multipath.conf
 *  - variant:mebs-colour-transport capabilities=transport:colour-classes
 * Variables: none
 */
routing-options {
  resolution {
    rib bgp.l3vpn.0 {
      import PS-MULTIPATH;
    }
    scheme gold-to-bronze-v6 {
      resolution-ribs [ junos-rti-tc-4000.inet6.3 junos-rti-tc-6000.inet6.3 ];
      mapping-community color:0:4000;
    }
    scheme gold-to-bronze {
      resolution-ribs [ junos-rti-tc-4000.inet.3 junos-rti-tc-6000.inet.3 ];
      mapping-community color:0:4000;
    }
  }
}
```

## junos/routing-options/resolution-transport-class-l3vpn-rib.conf

```
/*
 * Topic:   Colour-mapped resolution schemes alongside an L3VPN RIB resolution import
 * Seen on:
 *   Junos: ma4_mx204 mse2_mx304
 *   EVO:   ma3_acx7100-48l meg1_acx7100-32c meg2_acx7509
 *
 * Highlights:
 *  - `rib bgp.l3vpn.0` applies PS-MULTIPATH during resolution, so VPN routes
 *    keep more than one usable next hop.
 *  - `scheme gold-to-bronze` resolves service next hops over the IPv4
 *    transport-class RIBs, gold first and bronze second, so a gold-coloured
 *    route falls back to bronze when the gold tunnel is gone.
 *  - `scheme gold-to-bronze-v6` does the same over the IPv6 transport-class
 *    RIBs.
 *  - Both schemes are selected by the same `color:0:4000` mapping community,
 *    so one colour on a route drives resolution in either address family.
 *
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-multipath.conf
 *  - variant:mebs-colour-transport capabilities=transport:colour-classes
 *
 * Variables: none
 */
routing-options {
    resolution {
        rib bgp.l3vpn.0 {
            import PS-MULTIPATH;
        }
        scheme gold-to-bronze {
            resolution-ribs [ junos-rti-tc-4000.inet.3 junos-rti-tc-6000.inet.3 ];
            mapping-community color:0:4000;
        }
        scheme gold-to-bronze-v6 {
            resolution-ribs [ junos-rti-tc-4000.inet6.3 junos-rti-tc-6000.inet6.3 ];
            mapping-community color:0:4000;
        }
    }
}
```

## junos/routing-options/resolution-transport-class.conf

```
/*
 * Topic:   Colour-mapped resolution schemes over the gold and bronze transport-class RIBs
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma5_mx204 mdr2_mx10003
 *   EVO:   cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 mdr1_acx7509
 *
 * Highlights:
 *  - `scheme gold-to-bronze` resolves service next hops over the IPv4
 *    transport-class RIBs, gold first and bronze second, so a gold-coloured
 *    route falls back to bronze when the gold tunnel is gone.
 *  - `scheme gold-to-bronze-v6` does the same over the IPv6 transport-class
 *    RIBs.
 *  - Both schemes are selected by the same `color:0:4000` mapping community,
 *    so one colour on a route drives resolution in either address family.
 *  - Both schemes require same-device transport-class definitions for gold
 *    (colour 4000) and bronze (colour 6000) to supply their resolution RIBs.
 *  - The required provider depends on the device:
 *    `junos/routing-options/transport-class-fallback-none.conf` on an4_acx710;
 *    `junos/routing-options/transport-class.conf` on the other listed Junos
 *    devices. These are alternatives, not cumulative prerequisites.
 *
 * Pair with:
 *  - variant:mebs-colour-transport capabilities=transport:colour-classes
 *
 * Variables: none
 */
routing-options {
    resolution {
        scheme gold-to-bronze {
            resolution-ribs [ junos-rti-tc-4000.inet.3 junos-rti-tc-6000.inet.3 ];
            mapping-community color:0:4000;
        }
        scheme gold-to-bronze-v6 {
            resolution-ribs [ junos-rti-tc-4000.inet6.3 junos-rti-tc-6000.inet6.3 ];
            mapping-community color:0:4000;
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

## junos/routing-options/rib-groups-local-loopback-transport-class.conf

```
/*
 * Topic:   rib-groups
 * Seen on:
 *   Junos: mse1_mx304 mse2_mx304
 *   EVO:   (none)
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-local-loopback-anycast.conf
 *  - junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf
 * Variables: none
 */
routing-options {
    rib-groups {
        RG-LOCAL-LOOPBACK {
            import-rib [ inet.0 inet.3 junos-rti-tc-4000.inet.3 junos-rti-tc-6000.inet.3 ];
            import-policy PS-LOCAL-LOOPBACK;
        }
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
 *  - junos/policy-options/policy-statement/loopback-rib-leak.conf
 *  - variant:mebs-colour-transport capabilities=transport:colour-classes
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

## junos/routing-options/rib-inet3-protect-core.conf

```
/*
 * Topic:   rib inet.3
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Pair with: none
 * Variables: none
 */
routing-options {
    rib inet.3 {
        protect core;
    }
}
```

## junos/routing-options/rib-inet6-protect-core.conf

```
/*
 * Topic:   rib inet6.0
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Pair with: none
 * Variables: none
 */
routing-options {
    rib inet6.0 {
        protect core;
    }
}
```

## junos/routing-options/router-id.conf

```
/*
 * Topic:   Transport router identity
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 an4_acx710 ma2_mx204 ma4_mx204 ma5_mx204 mdr2_mx10003 mse1_mx304 mse2_mx304
 *   EVO:   ag1-1_acx7100-32c ag1-2_acx7100-32c an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Pair with: none
 * Variables:
 *   $ROUTER_ID   e.g. 1.1.0.14
 */
routing-options {
    router-id $ROUTER_ID;
}```

## junos/routing-options/transport-class-fallback-none.conf

```
/*
 * Topic:   transport-class
 * Seen on:
 *   Junos: an4_acx710
 *   EVO:   (none)
 * Variant group: mebs-colour-transport
 *   Provides: transport:colour-classes
 * Pair with: none
 * Variables:
 *   $TC_EGRESS   e.g. 1.1.0.3
 */
routing-options {
    transport-class {
        auto-create;
        fallback {
            none;
        }
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

## junos/routing-options/transport-class-gold-bronze-anycast.conf

```
/*
 * Topic:   transport-class
 * Seen on:
 *   Junos: mse2_mx304
 *   EVO:   (none)
 * Variant group: mebs-colour-transport
 *   Provides: transport:colour-classes
 * Pair with: none
 * Variables:
 *   $LOOPBACK_ANYCAST_V4   e.g. 1.1.10.10
 *   $TC_EGRESS   e.g. 1.1.0.11
 */
routing-options {
    transport-class {
        auto-create;
        name gold {
            color 4000;
            tunnel-egress {
                end-point $TC_EGRESS;
                end-point $LOOPBACK_ANYCAST_V4;
            }
        }
        name bronze {
            color 6000;
            tunnel-egress {
                end-point $TC_EGRESS;
                end-point $LOOPBACK_ANYCAST_V4;
            }
        }
    }
}
```

## junos/routing-options/transport-class-gold-local-bronze-anycast.conf

```
/*
 * Topic:   transport-class
 * Seen on:
 *   Junos: mse1_mx304
 *   EVO:   (none)
 * Variant group: mebs-colour-transport
 *   Provides: transport:colour-classes
 * Pair with: none
 * Variables:
 *   $LOOPBACK_ANYCAST_V4   e.g. 1.1.10.10
 *   $TC_EGRESS   e.g. 1.1.0.10
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
                end-point $LOOPBACK_ANYCAST_V4;
            }
        }
    }
}
```

## junos/routing-options/transport-class.conf

```
/*
 * Topic:   Gold and bronze transport classes with local tunnel egress
 * Seen on:
 *   Junos: an1_mx204 an2_acx5448 ma4_mx204 ma5_mx204 mdr2_mx10003
 *   EVO:   an3_acx7100-48l cr1_ptx10001-36mr cr2_ptx10001-36mr ma1-1_acx7024 ma1-2_acx7024 ma3_acx7100-48l mdr1_acx7509 meg1_acx7100-32c meg2_acx7509
 * Variant group: mebs-colour-transport
 *   Provides: transport:colour-classes
 *
 * Highlights:
 *  - Two transport classes: `gold` (colour 4000) and `bronze` (colour 6000).
 *    `auto-create` lets additional colours map without an explicit stanza.
 *  - Each class's `tunnel-egress end-point` is the local transport loopback
 *    the colour-tagged path terminates on.
 *
 * Pair with: none
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
| `$LOOPBACK_SR_V6`      | SR non-zero lo0 IPv6 carrying an SR prefix-SID.                                      | `2001::1:1:10:0`             |
| `$LOOPBACK_V6`         | This PE's lo0 IPv6.                                                                  | `2001:db8::17`               |
| `$ROUTER_ID`           | router-id (usually equal to `$LOOPBACK_V4`).                                          | `1.1.0.17`                   |
| `$NODE_SID_V4`         | ISIS source-packet-routing IPv4 node-segment index.                                  | `17`                         |
| `$NODE_SID_V6`         | ISIS source-packet-routing IPv6 node-segment index.                                  | `117`                        |
| `$LOOPBACK_SUPERNET`   | IPv4 aggregate that contains the deployment's loopback `/32` addresses (loopback route-leak match). | `1.1.0.0/16` |
| `$LOOPBACK_V4_PFX`     | This node's lo0 IPv4 written with its `/32` prefix length (address form). | `1.1.0.17/32` |
| `$LOOPBACK_V6_PFX`     | This node's lo0 IPv6 written with its `/128` prefix length. | `2001::1:1:0:11/128` |
| `$ISIS_NET`            | ISIS NET (area + system-id) configured on lo0. | `49.0001.0010.0100.0017.00` |
| `$CORE_LINK_SUPERNET`  | IPv4 aggregate that contains the deployment's core point-to-point `/30` links. | `10.10.0.0/24` |
| `$SR_INDEX`            | Prefix-segment index a loopback export policy assigns to the node's lo0 route. | `900` |
| `$SR_INDEX_ALGO128`    | Prefix-segment index the same policy assigns under flex-algo 128. | `500` |
| `$SR_INDEX_ALGO129`    | Prefix-segment index the same policy assigns under flex-algo 129. | `600` |
| `$SR_INDEX_V4` / `$SR_INDEX_V6` | Prefix-segment indices assigned to the SR non-zero IPv4 / IPv6 loopbacks. | `200` / `300` |
| `$PREFIX`              | Prefix a route-filter matches where the prefix itself is what the policy selects. | `0.0.0.0/32` |

## Transport Interface Parameters

| Variable | What it is | Example value |
|---|---|---|
| `$TE_METRIC` | IS-IS interface ASLA traffic-engineering metric, independent of its IGP and delay metrics. | `10` |
| `$DELAY_METRIC` | IS-IS interface delay metric; not a protocol timer. | `5` |
| `$ISIS_METRIC` | IS-IS interface metric within the literal level hierarchy. | `25` |
| `$ADMIN_GROUP` | One scalar MPLS administrative-group name referenced by an IS-IS interface ASLA block; not a BGP colour community or a list. | `blue` |

For as-deployed reconstruction these values belong to a complete source occurrence
binding, together with its device and interface identity. Independently observed
values are not interchangeable defaults and do not establish arbitrary combinations.

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
| `$CORE_INTF`           | Core-facing LAG unit used for ISIS+MPLS underlay.                                | `ae71.0`          |
| `$CORE_PHYS`           | Parent of the core LAG.                                                          | `ae71`            |
| `$AE_BUNDLE`           | Aggregated-Ethernet bundle a member link joins (`802.3ad`).                      | `ae73`            |
| `$AE_DEVICE_COUNT`     | Number of aggregated-Ethernet devices the chassis allocates.                     | `25`              |
| `$PS_DEVICE_COUNT`     | Allocated pseudowire-subscriber devices; greater than the configured device count and highest PS index. | `100` |
| `$TS_FPC` / `$TS_PIC`   | FPC and PIC indices providing tunnel services; must match the FPC/PIC in the subscriber anchor. | `0` / `0` |
| `$UNIT`                | Logical-unit identifier — the `unit <n>` a construct configures, and the tail when an interface is written `<ifd>.<unit>`. | `3000`            |
| `$UNI_INTF`           | Customer UNI physical interface. | `xe-0/0/3:1` |
| `$AC_INTF_1` / `$AC_INTF_2` | The two attachment-circuit interfaces cross-connected by l2circuit local-switching. | `et-0/0/5` |
| `$AC_INTF_A` / `$AC_INTF_B` | The two attachment-circuit units bound as the UNIs of a two-UNI service instance. | `ae12.200` / `ae12.250` |
| `$AC_ADDR_V4` / `$AC_ADDR_V6` | IPv4 / IPv6 address on a routed attachment-circuit unit. | `13.1.0.1/30` |
| `$IRB_ADDR`           | IPv4 address configured on an `irb` unit. | `40.2.2.3/24` |
| `$VGA`                | EVPN virtual-gateway address shared by the IRB's redundancy group. | `41.2.2.1` |
| `$VG_MAC`             | MAC address bound to the IPv4 virtual gateway. | `00:01:33:44:11:11` |
| `$PS_INTF`            | Pseudowire-subscriber logical interface. | `ps0` |
| `$ANCHOR_PIC`         | Anchor tunnel PIC (`lt-`) hosting the pseudowire-subscriber device. | `lt-0/0/0` |
| `$CORE_INTF_1` / `$CORE_INTF_2` | Per-core-neighbour core interface units (repeat the stanza per neighbour). | `ae71.0` |
| `$CORE_V4_ADDR` / `$CORE_V6_ADDR` | Core interface IPv4 / IPv6 address. | `10.10.1.121/30` |
| `$CORE_DESC`          | Core interface description. | `"to MA2 ... ae83"` |
| `$LO0_DESC`           | lo0 interface description. | `"MA1.1 Metro Ring Blue"` |
| `$LACP_SYS_ID`        | LACP system-id on a multihomed LAG. | `00:00:00:00:00:01` |
| `$VLAN`               | VLAN id on a tagged unit. | `3000` |
| `$VLAN_UNIT`          | Selects `ae11.<unit>` on the shared edge LAG. | `700` |
| `$IFD`                | Interface device a construct configures or attaches to, independent of its type or topology role — physical, aggregated or pseudowire-subscriber. | `ae11` |
| `$INPUT_VID`          | VLAN id pushed by an `input-vlan-map` when the customer and service-internal VLAN ids differ. | `3800` |
| `$VLAN_LIST`          | VLAN range or list admitted by a `vlan-id-list` interface. | `1000-1001` |
| `$VLAN_OUTER` / `$VLAN_INNER` | Outer and inner tags of a double-tagged (`vlan-tags`) interface. | `225` / `2250` |
| `$COS_INTF`           | Interface to which the class-of-service configuration is applied, physical or aggregated and independent of topology role. | `ae11` |

The PS transport and service-unit templates use `$PS_INTF` as the device name
(`ps0`), with transport unit `0` literal. Repeat the service template per nonzero
`$UNIT`; `$UNIT` and `$VLAN` are separate inputs. Use the same PS device and anchor
for its transport and service units. Unit and device values must also be within
the target platform and release limits; the archived values are examples, not
those limits. The existing routing-instance template uses `$PS_INTF` for a full
service interface (`ps0.300`); supply that complete attachment there.

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
| `$VPLS_SITE`              | BGP-VPLS site name.                                              | `r2`          |
| `$VPLS_SITE_ID`           | BGP-VPLS site-identifier.                                        | `1`           |
| `$SITE_RANGE`             | Highest site-identifier a BGP-VPLS instance accepts (`site-range`). | `10`       |
| `$LABEL_BLOCK_SIZE`       | Size of the label block a BGP-VPLS site advertises.              | `8`           |
| `$VLAN_BD`                | bridge-domain or mac-vrf vlan-id.                                | `4000`        |
| `$ESI`                    | 10-byte ESI (for EVPN multihoming).                              | `00:11:22:33:44:55:66:77:88:01` |
| `$IRB_UNIT`               | irb.X unit number for IRB integration.                           | `4000`        |
| `$BD_NAME`               | bridge-domain / MAC-VRF bridge-domain name. | `V4000` |
| `$SITE_ID`               | Per-site identifier encoded into service instances. | `5` |
| `$SVC_ID_LOCAL` / `$SVC_ID_REMOTE` | FXC / VPWS local & remote service-ids. | `1` / `2` |
| `$SVC_ID_LOCAL_A` / `$SVC_ID_REMOTE_A` | Local & remote service-ids of the first UNI in a two-UNI FXC / VPWS instance. | `2` / `1` |
| `$SVC_ID_LOCAL_B` / `$SVC_ID_REMOTE_B` | Local & remote service-ids of the second UNI in the same instance. | `11` / `22` |
| `$UNIT_1` / `$UNIT_2`    | Logical-unit numbers for a two-AC service. | `3000` |
| `$UNIT_A` / `$UNIT_B` / `$UNIT_C` / `$UNIT_D` | Logical-unit numbers for a multi-AC service. | `800` |
| `$LABEL_IN` / `$LABEL_OUT` | Static MPLS in / out labels (floating pseudowire). | `1000001` |
| `$RD` / `$RT`            | Full route-distinguisher / route-target value (`AS:id`). | `63535:6500` |
| `$EXPORT_POL` / `$IMPORT_POL` | Per-VRF export / import policy names. | `PS-METRO_L3VPN_2001-EXPORT` |
| `$CE_PEER_V4` / `$PE_LOCAL_V4` | PE-CE eBGP peer / local IPv4 addresses. | `115.2.0.2` / `115.2.0.1` |
| `$CE_PEER_V6` / `$PE_LOCAL_V6` | PE-CE eBGP peer / local IPv6 addresses. | `2001:0:0:0:13:3:0:2` / `2001:0:0:0:13:3:0:1` |
| `$CE_PREFIX_1` / `$CE_PREFIX_2` / `$CE_PREFIX_3` / `$CE_PREFIX_4` | Customer prefixes matched by per-VRF import/export route-filters. | `13.2.0.0/16` |

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
| `$POLICY_NAME`         | Policy-statement name where the name is the object the body defines rather than part of the architectural model. | `ALLOW_LOOPBACK` |

## Header convention

### Occurrence-bound transport inputs

| Variable | Meaning | Source example |
|---|---|---|
| `$ISIS_INSTANCE` | Named IS-IS process, not a service routing instance. | `metro-a` |
| `$CONDITION_NAME` | Routing-policy condition definition and its reference. | `Floating-PW-Condition` |
| `$PREFIX_SID_INDEX` | Policy-applied prefix-segment index. | `210` |
| `$ADMIN_GROUP_1` / `$ADMIN_GROUP_2` | Ordered members of a two-member administrative-group list. | `blue` / `green` |
| `$EXPORT_POLICY` | IS-IS export-policy reference; reused from the Broadband Edge vocabulary. | `export_isis_metro_b_ribs` |

Source replay uses complete observed occurrence bindings. The floating-PW
conditional pattern may be instantiated per PS transport for a new deployment;
the source contains only the `ps0.0` worked condition. Policy and condition names,
watched transport, advertised prefix and SID index are correlated inputs, not
values to copy indiscriminately to every PS device. Bindings are local to each
snippet occurrence: legacy `$PS_INTF` may denote a PS device stem in a transport
snippet and a complete logical-interface name in a service snippet.

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

# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by portal/scripts/generate-tiers.mjs. Do not edit by hand: run `npm --prefix portal run tiers`. -->

This file tells the assistant which snippet files to include for each service
form at each tier. It is generated from the composition matrix, so every path
below resolves to a real snippet and every device listed is one the form is
validated on.

## What the tiers mean

| Tier | What it includes |
|---|---|
| `minimum` | Only the service construct. Assumes the PE already runs the underlay and the overlay the service needs. |
| `self-contained` | Everything the emitted configuration names, resolved recursively for the target device. |
| `as-deployed` | The self-contained set plus the validated baselines this JVD runs on that device. |
| `with-overlay` | Compatibility alias. For a BGP-signalled form it means `self-contained`, which already pulls in that device's overlay form. |

A tier never implies that a larger closure is a minimal protocol requirement.
If a form's overlay, variant or dependency cannot be resolved for the target
device, the request fails closed: say so and generate nothing for it.

## Required operator inputs

Some constructs are a choice, not a default. Ask for them; never preselect.

Each choice applies only to the service families listed against it. If
the requested service's family is not listed, never ask: either that
service's own tier entry already resolves the construct to a single
validated provider, in which case bind it silently, or the service does
not use the construct at all, in which case leave it out. Never add a
construct that the service's own tier entry does not name.

- **community:$COLOR_COMMUNITY** — applies to `e-line`, `e-lan`, `e-tree`, `e-access` only. Service tier, and the operator must state it. Gold is the more common binding but it is not a default: bronze is validated on an3_acx7100-48l, ma1-1_acx7024, ma1-2_acx7024, meg1_acx7100-32c and meg2_acx7509, and the two steer onto different transport classes.
- **policy-statement:$EXPORT_POL** — applies to `l3vpn` only. The export policy carries the customer prefixes, so the choice is a service parameter the operator must state: address family, how many CE prefixes the VRF advertises, and whether the routes are coloured. All forms are validated in the JVD and none is a default — ma4_mx204 alone splits 999 coloured v4 against 1000 v6.

---

## EVPN-VPWS services

Family e-line, form vlan-aware. OS mode MIXED. Attachment: vlan-ccc logical unit on a LAG or physical UNI.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp-an3.conf`, `evo/policy-options/community/cm-access-fabric.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/ps-bgp-export.conf`, `evo/protocols/bgp-overlay-an3.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### ma1-1_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-metro-ring.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/nhs1-ma1-1.conf`, `evo/policy-options/policy-statement/ps-bgp-transport-export.conf`, `evo/protocols/bgp-overlay.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### ma1-2_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-metro-ring.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/nhs1-ma1-1.conf`, `evo/policy-options/policy-statement/ps-bgp-transport-export.conf`, `evo/protocols/bgp-overlay.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### meg1_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp.conf`, `evo/policy-options/community/cm-access-fabric.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-metro-ring.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/community/cm-regional-border.conf`, `evo/policy-options/community/cm-service-edge.conf`, `evo/policy-options/community/cm-tc-4000-gold.conf`, `evo/policy-options/community/cm-tc-6000-bronze.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/ps-bgp-rr-export.conf`, `evo/policy-options/policy-statement/ps-ibgp-cr-export-meg1.conf`, `evo/policy-options/policy-statement/ps-import-bgp-lo0-filter.conf`, `evo/policy-options/prefix-list/pl-an-nodes.conf`, `evo/policy-options/prefix-list/pl-core.conf`, `evo/policy-options/prefix-list/pl-fabric.conf`, `evo/protocols/bgp-overlay-meg1.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### meg2_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp.conf`, `evo/policy-options/community/cm-access-fabric.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-metro-ring.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/community/cm-regional-border.conf`, `evo/policy-options/community/cm-service-edge.conf`, `evo/policy-options/community/cm-tc-4000-gold.conf`, `evo/policy-options/community/cm-tc-6000-bronze.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/ps-bgp-rr-export.conf`, `evo/policy-options/policy-statement/ps-ibgp-cr-export-meg1.conf`, `evo/policy-options/policy-statement/ps-import-bgp-lo0-filter.conf`, `evo/policy-options/prefix-list/pl-an-nodes.conf`, `evo/policy-options/prefix-list/pl-core.conf`, `evo/policy-options/prefix-list/pl-fabric.conf`, `evo/protocols/bgp-overlay-meg2.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### an1_mx204 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained`: the above plus `junos/groups/gr-bgp-bcp.conf`, `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/policy-statement/loopback-rib-leak.conf`, `junos/policy-options/policy-statement/ps-bgp-export.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/protocols/bgp-overlay.conf`, `junos/routing-options/rib-groups.conf`, `junos/routing-options/transport-class.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### an2_acx5448 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained`: the above plus `junos/groups/gr-bgp-bcp.conf`, `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/policy-statement/loopback-rib-leak.conf`, `junos/policy-options/policy-statement/ps-bgp-export.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/protocols/bgp-overlay.conf`, `junos/routing-options/rib-groups.conf`, `junos/routing-options/transport-class.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### an4_acx710 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained`: the above plus `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/policy-statement/loopback-rib-leak.conf`, `junos/policy-options/policy-statement/ps-bgp-export.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/protocols/bgp-overlay-an4.conf`, `junos/routing-options/rib-groups.conf`, `junos/routing-options/transport-class-fallback-none.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## port-based EVPN-VPWS services

**Not generatable.** MENU advertises a port-based form but no distinct entry snippet models it; TIERS reaches it only through an interface pattern, and a pattern may not count as supported.

---

## EVPN-FXC services

Family e-line, form flexible-cross-connect. OS mode MIXED. Attachment: N vlan-ccc UNIs bundled under one FXC group.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp-an3.conf`, `evo/groups/gr-edge-intf.conf`, `evo/policy-options/community/cm-access-fabric.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/ps-bgp-export.conf`, `evo/protocols/bgp-overlay-an3.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### mse1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni.conf`
- `self-contained`: the above plus `junos/groups/gr-bgp-bcp.conf`, `junos/groups/gr-edge-intf.conf`, `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-fabric.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/community/cm-region-edge.conf`, `junos/policy-options/community/cm-service-edge.conf`, `junos/policy-options/policy-statement/ps-as63535-import.conf`, `junos/policy-options/policy-statement/ps-ebgp-cr-export.conf`, `junos/policy-options/policy-statement/ps-ibgp-mdr-export-mse1.conf`, `junos/policy-options/policy-statement/ps-ibgp-mse-export.conf`, `junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf`, `junos/policy-options/policy-statement/ps-mse-import.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/policy-options/prefix-list/pl-an-region.conf`, `junos/policy-options/prefix-list/pl-mse-primary.conf`, `junos/policy-options/prefix-list/pl-mse.conf`, `junos/protocols/bgp-overlay-mse1.conf`, `junos/routing-options/rib-group-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## Kompella L2VPN pseudowires

Family e-line, form rfc4761. OS mode MIXED. Attachment: vlan-ccc logical unit.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l2vpn/ri-l2vpn-kompella.conf`
- `self-contained`: the above plus `evo/groups/gr-fatpw-label.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### ma5_mx204 (junos)

- `minimum`: `evo/routing-instances/l2vpn/ri-l2vpn-kompella.conf`
- `self-contained`: the above plus `junos/groups/gr-fatpw-label.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## L2Circuit hot-standby pseudowires

Family e-line, form hot-standby. OS mode EVO. Attachment: vlan-ccc logical unit.

### meg2_acx7509 (evo)

- `minimum`: `evo/protocols/l2circuit-hsb-pe.conf`
- `self-contained`: the above plus `evo/groups/gr-fatpw-lb.conf`, `evo/groups/gr-l2ckt-hs.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## L2Circuit floating pseudowires

Family e-line, form floating-pseudowire. OS mode MIXED. Attachment: static-label PW onto a ps<N> pseudowire-subscriber anchor.

### mse1_mx304 (junos)

- `minimum`: `junos/protocols/l2circuit-floating-pw.conf`
- `self-contained`: the above plus `junos/chassis/pseudowire-service.conf`, `junos/chassis/tunnel-services.conf`, `junos/interfaces/ifd-ps-transport.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### mse2_mx304 (junos)

- `minimum`: `junos/protocols/l2circuit-floating-pw.conf`
- `self-contained`: the above plus `junos/chassis/pseudowire-service.conf`, `junos/chassis/tunnel-services.conf`, `junos/interfaces/ifd-ps-transport.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## L2Circuit local-switching cross-connects

Family e-access, form local-switching. OS mode EVO. Attachment: two vlan-ccc UNIs on one PE.

### ma3_acx7100-48l (evo)

- `minimum`: `evo/protocols/l2circuit-lsw.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF_1.$UNIT_1
  - occurrence-selection-required: logical-interface:$AC_INTF_2.$UNIT_2

---

## EVPN-ELAN instances

Family e-lan, form vlan-based. OS mode MIXED. Attachment: vlan-bridge logical unit.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: logical-interface:$AC_INTF

### ma1-1_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: logical-interface:$AC_INTF

### ma1-2_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: logical-interface:$AC_INTF

### meg1_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: logical-interface:$AC_INTF

### meg2_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: logical-interface:$AC_INTF

### an1_mx204 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$VLAN_UNIT

### an2_acx5448 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$VLAN_UNIT

---

## port-based EVPN-ELAN instances

Family e-lan, form port-based. OS mode EVO. Attachment: single full-port UNI.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-port-based.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp-an3.conf`, `evo/policy-options/community/cm-access-fabric.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/ps-bgp-export.conf`, `evo/protocols/bgp-overlay-an3.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### ma1-2_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-port-based.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-metro-ring.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/nhs1-ma1-1.conf`, `evo/policy-options/policy-statement/ps-bgp-transport-export.conf`, `evo/protocols/bgp-overlay.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## BGP-VPLS instances

Family e-lan, form rfc4761-vpls. OS mode MIXED. Attachment: vlan-bridge logical unit.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-vlan.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### ma1-2_acx7024 (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-vlan.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### meg1_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-vlan.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### meg2_acx7509 (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-vlan.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### ma5_mx204 (junos)

- `minimum`: `junos/routing-instances/vpls/ri-bgp-vpls-site-range.conf`
- `self-contained`: the above plus `junos/groups/bgp-bcp-ma5.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/policy-statement/loopback-rib-leak.conf`, `junos/policy-options/policy-statement/nhs1.conf`, `junos/policy-options/policy-statement/ps-bgp-transport-export.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/protocols/bgp-overlay-ma5.conf`, `junos/routing-options/rib-groups.conf`, `junos/routing-options/transport-class.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## LDP-VPLS instances

Family e-lan, form rfc4762-vpls. OS mode EVO. Attachment: vlan-bridge logical unit.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/vpls/ri-ldp-vpls.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## EVPN E-Tree services

Family e-tree, form root-leaf. OS mode Junos. Attachment: vlan-bridge logical unit, root or leaf.

### ma4_mx204 (junos)

- `minimum`: `junos/routing-instances/evpn-etree/ri-evpn-etree.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT

### ma5_mx204 (junos)

- `minimum`: `junos/routing-instances/evpn-etree/ri-evpn-etree.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT

### mse1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-etree/ri-evpn-etree.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT

### mse2_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-etree/ri-evpn-etree.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT

---

## EVPN-ELAN with IRB

Family irb, form type2-only. OS mode MIXED. Attachment: vlan-bridge unit plus an irb unit.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: logical-interface:$IRB_UNIT

### meg1_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: logical-interface:$IRB_UNIT

### meg2_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: logical-interface:$IRB_UNIT

### mse1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-irb.conf`
- `self-contained`: the above plus `junos/groups/gr-bgp-bcp.conf`, `junos/groups/gr-edge-intf.conf`, `junos/interfaces/ethernet-bridge.conf`, `junos/interfaces/ifl-irb-inet.conf`, `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-fabric.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/community/cm-region-edge.conf`, `junos/policy-options/community/cm-service-edge.conf`, `junos/policy-options/policy-statement/ps-as63535-import.conf`, `junos/policy-options/policy-statement/ps-ebgp-cr-export.conf`, `junos/policy-options/policy-statement/ps-ibgp-mdr-export-mse1.conf`, `junos/policy-options/policy-statement/ps-ibgp-mse-export.conf`, `junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf`, `junos/policy-options/policy-statement/ps-mse-import.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/policy-options/prefix-list/pl-an-region.conf`, `junos/policy-options/prefix-list/pl-mse-primary.conf`, `junos/policy-options/prefix-list/pl-mse.conf`, `junos/protocols/bgp-overlay-mse1.conf`, `junos/routing-options/rib-group-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### mse2_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-irb.conf`
- `self-contained`: the above plus `junos/groups/gr-bgp-bcp.conf`, `junos/groups/gr-edge-intf.conf`, `junos/interfaces/ethernet-bridge.conf`, `junos/interfaces/ifl-irb-inet.conf`, `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-fabric.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/community/cm-region-edge.conf`, `junos/policy-options/community/cm-service-edge.conf`, `junos/policy-options/policy-statement/ps-as63535-import.conf`, `junos/policy-options/policy-statement/ps-ebgp-cr-export.conf`, `junos/policy-options/policy-statement/ps-ibgp-mdr-export-mse1.conf`, `junos/policy-options/policy-statement/ps-ibgp-mse-export.conf`, `junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf`, `junos/policy-options/policy-statement/ps-mse-import.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/policy-options/prefix-list/pl-an-region.conf`, `junos/policy-options/prefix-list/pl-mse-primary.conf`, `junos/policy-options/prefix-list/pl-mse.conf`, `junos/protocols/bgp-overlay-mse2.conf`, `junos/routing-options/rib-group-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## EVPN-ELAN with L3 (Type-2 + Type-5)

Family irb, form type2-plus-type5. OS mode MIXED. Attachment: irb unit shared with the EVPN-ELAN half.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp-an3.conf`, `evo/groups/gr-l3vpn.conf`, `evo/interfaces/ifl-irb-inet.conf`, `evo/policy-options/community/cm-access-fabric.conf`, `evo/policy-options/community/cm-l3vpn-pub.conf`, `evo/policy-options/community/cm-l3vpn.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/ps-bgp-export.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public.conf`, `evo/policy-options/policy-statement/ps-import-l3vpn.conf`, `evo/protocols/bgp-overlay-an3.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### mse1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy.conf`
- `self-contained`: the above plus `junos/groups/gr-bgp-bcp.conf`, `junos/groups/gr-l3vpn.conf`, `junos/interfaces/ifl-irb-inet.conf`, `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-l3vpn-pub.conf`, `junos/policy-options/community/cm-l3vpn.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-fabric.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/community/cm-region-edge.conf`, `junos/policy-options/community/cm-service-edge.conf`, `junos/policy-options/policy-statement/ps-as63535-import.conf`, `junos/policy-options/policy-statement/ps-ebgp-cr-export.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public.conf`, `junos/policy-options/policy-statement/ps-ibgp-mdr-export-mse1.conf`, `junos/policy-options/policy-statement/ps-ibgp-mse-export.conf`, `junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf`, `junos/policy-options/policy-statement/ps-import-l3vpn.conf`, `junos/policy-options/policy-statement/ps-mse-import.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/policy-options/prefix-list/pl-an-region.conf`, `junos/policy-options/prefix-list/pl-mse-primary.conf`, `junos/policy-options/prefix-list/pl-mse.conf`, `junos/protocols/bgp-overlay-mse1.conf`, `junos/routing-options/rib-group-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## slim L3VPN anchor VRFs

Family irb, form slim-anchor. OS mode MIXED. Attachment: irb unit anchored to a MAC-VRF.

### meg1_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-irb.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp.conf`, `evo/interfaces/ifl-irb-virtual-gateway.conf`, `evo/policy-options/community/cm-access-fabric.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-metro-ring.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/community/cm-regional-border.conf`, `evo/policy-options/community/cm-service-edge.conf`, `evo/policy-options/community/cm-tc-4000-gold.conf`, `evo/policy-options/community/cm-tc-6000-bronze.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/ps-bgp-rr-export.conf`, `evo/policy-options/policy-statement/ps-ibgp-cr-export-meg1.conf`, `evo/policy-options/policy-statement/ps-import-bgp-lo0-filter.conf`, `evo/policy-options/prefix-list/pl-an-nodes.conf`, `evo/policy-options/prefix-list/pl-core.conf`, `evo/policy-options/prefix-list/pl-fabric.conf`, `evo/protocols/bgp-overlay-meg1.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### meg2_acx7509 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-irb.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp.conf`, `evo/interfaces/ifl-irb-virtual-gateway.conf`, `evo/policy-options/community/cm-access-fabric.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-metro-ring.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/community/cm-regional-border.conf`, `evo/policy-options/community/cm-service-edge.conf`, `evo/policy-options/community/cm-tc-4000-gold.conf`, `evo/policy-options/community/cm-tc-6000-bronze.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/ps-bgp-rr-export.conf`, `evo/policy-options/policy-statement/ps-ibgp-cr-export-meg1.conf`, `evo/policy-options/policy-statement/ps-import-bgp-lo0-filter.conf`, `evo/policy-options/prefix-list/pl-an-nodes.conf`, `evo/policy-options/prefix-list/pl-core.conf`, `evo/policy-options/prefix-list/pl-fabric.conf`, `evo/protocols/bgp-overlay-meg2.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### mse1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-irb.conf`
- `self-contained`: the above plus `junos/groups/gr-bgp-bcp.conf`, `junos/groups/gr-l3vpn.conf`, `junos/interfaces/ifl-irb-inet.conf`, `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-fabric.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/community/cm-region-edge.conf`, `junos/policy-options/community/cm-service-edge.conf`, `junos/policy-options/policy-statement/ps-as63535-import.conf`, `junos/policy-options/policy-statement/ps-ebgp-cr-export.conf`, `junos/policy-options/policy-statement/ps-ibgp-mdr-export-mse1.conf`, `junos/policy-options/policy-statement/ps-ibgp-mse-export.conf`, `junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf`, `junos/policy-options/policy-statement/ps-mse-import.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/policy-options/prefix-list/pl-an-region.conf`, `junos/policy-options/prefix-list/pl-mse-primary.conf`, `junos/policy-options/prefix-list/pl-mse.conf`, `junos/protocols/bgp-overlay-mse1.conf`, `junos/routing-options/rib-group-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### mse2_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-irb.conf`
- `self-contained`: the above plus `junos/groups/gr-bgp-bcp.conf`, `junos/groups/gr-l3vpn.conf`, `junos/interfaces/ifl-irb-inet.conf`, `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-fabric.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/community/cm-region-edge.conf`, `junos/policy-options/community/cm-service-edge.conf`, `junos/policy-options/policy-statement/ps-as63535-import.conf`, `junos/policy-options/policy-statement/ps-ebgp-cr-export.conf`, `junos/policy-options/policy-statement/ps-ibgp-mdr-export-mse1.conf`, `junos/policy-options/policy-statement/ps-ibgp-mse-export.conf`, `junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf`, `junos/policy-options/policy-statement/ps-mse-import.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/policy-options/prefix-list/pl-an-region.conf`, `junos/policy-options/prefix-list/pl-mse-primary.conf`, `junos/policy-options/prefix-list/pl-mse.conf`, `junos/protocols/bgp-overlay-mse2.conf`, `junos/routing-options/rib-group-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## L3VPN VRFs with PE-CE eBGP

Family l3vpn, form pe-ce-ebgp. OS mode MIXED. Attachment: family inet logical unit toward the CE.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp-an3.conf`, `evo/policy-options/community/cm-access-fabric.conf`, `evo/policy-options/community/cm-inet-default.conf`, `evo/policy-options/community/cm-l3vpn.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/ps-bgp-export.conf`, `evo/policy-options/policy-statement/ps-import-l3vpn-internet.conf`, `evo/protocols/bgp-overlay-an3.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
  - ask for **policy-statement:$EXPORT_POL**, one of `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-2.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### ma3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp.conf`, `evo/policy-options/community/cm-inet-default.conf`, `evo/policy-options/community/cm-l3vpn.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-metro-ring.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/nhs1-ma3.conf`, `evo/policy-options/policy-statement/ps-bgp-transport-export.conf`, `evo/policy-options/policy-statement/ps-import-l3vpn-internet.conf`, `evo/protocols/bgp-overlay-ma3.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
  - ask for **policy-statement:$EXPORT_POL**, one of `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### ma4_mx204 (junos)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy.conf`
- `self-contained`: the above plus `junos/groups/bgp-bcp-ma5.conf`, `junos/groups/gr-bgp-bcp.conf`, `junos/policy-options/community/cm-inet-default.conf`, `junos/policy-options/community/cm-l3vpn.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/policy-statement/loopback-rib-leak.conf`, `junos/policy-options/policy-statement/nhs1.conf`, `junos/policy-options/policy-statement/ps-bgp-transport-export.conf`, `junos/policy-options/policy-statement/ps-import-l3vpn-internet.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/protocols/bgp-overlay-ma4.conf`, `junos/routing-options/rib-groups.conf`, `junos/routing-options/transport-class.conf`
  - ask for **policy-statement:$EXPORT_POL**, one of `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3-color.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-3.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### mse1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy-auto-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence

### mse2_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy-auto-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence

---

## L3VPN VRFs with PE-CE OSPF

Family l3vpn, form pe-ce-ospf. OS mode MIXED. Attachment: family inet logical unit toward the CE.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp-an3.conf`, `evo/policy-options/community/cm-access-fabric.conf`, `evo/policy-options/community/cm-inet-default.conf`, `evo/policy-options/community/cm-l3vpn.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/ps-bgp-export.conf`, `evo/policy-options/policy-statement/ps-import-l3vpn-internet.conf`, `evo/protocols/bgp-overlay-an3.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
  - ask for **policy-statement:$EXPORT_POL**, one of `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-2.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### ma3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp.conf`, `evo/policy-options/community/cm-inet-default.conf`, `evo/policy-options/community/cm-l3vpn.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-metro-ring.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/nhs1-ma3.conf`, `evo/policy-options/policy-statement/ps-bgp-transport-export.conf`, `evo/policy-options/policy-statement/ps-import-l3vpn-internet.conf`, `evo/protocols/bgp-overlay-ma3.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
  - ask for **policy-statement:$EXPORT_POL**, one of `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### ma4_mx204 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy.conf`
- `self-contained`: the above plus `junos/groups/bgp-bcp-ma5.conf`, `junos/groups/gr-bgp-bcp.conf`, `junos/groups/gr-l3vpn.conf`, `junos/policy-options/community/cm-inet-default.conf`, `junos/policy-options/community/cm-l3vpn-pub.conf`, `junos/policy-options/community/cm-l3vpn.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/policy-statement/loopback-rib-leak.conf`, `junos/policy-options/policy-statement/nhs1.conf`, `junos/policy-options/policy-statement/ps-bgp-transport-export.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf`, `junos/policy-options/policy-statement/ps-import-l3vpn-internet.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/protocols/bgp-overlay-ma4.conf`, `junos/routing-options/rib-groups.conf`, `junos/routing-options/transport-class.conf`
  - ask for **policy-statement:$EXPORT_POL**, one of `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3-color.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-3.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### mse1_mx304 (junos)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf`
- `self-contained`: the above plus `junos/groups/gr-bgp-bcp.conf`, `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-inet-default.conf`, `junos/policy-options/community/cm-l3vpn.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-fabric.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/community/cm-region-edge.conf`, `junos/policy-options/community/cm-service-edge.conf`, `junos/policy-options/policy-statement/ps-as63535-import.conf`, `junos/policy-options/policy-statement/ps-ebgp-cr-export.conf`, `junos/policy-options/policy-statement/ps-ibgp-mdr-export-mse1.conf`, `junos/policy-options/policy-statement/ps-ibgp-mse-export.conf`, `junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf`, `junos/policy-options/policy-statement/ps-import-l3vpn-internet.conf`, `junos/policy-options/policy-statement/ps-mse-import.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/policy-options/prefix-list/pl-an-region.conf`, `junos/policy-options/prefix-list/pl-mse-primary.conf`, `junos/policy-options/prefix-list/pl-mse.conf`, `junos/protocols/bgp-overlay-mse1.conf`, `junos/routing-options/rib-group-remote-loopbacks-mse.conf`
  - ask for **policy-statement:$EXPORT_POL**, one of `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-2.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-3.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### mse2_mx304 (junos)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf`
- `self-contained`: the above plus `junos/groups/gr-bgp-bcp.conf`, `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-inet-default.conf`, `junos/policy-options/community/cm-l3vpn.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-fabric.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/community/cm-region-edge.conf`, `junos/policy-options/community/cm-service-edge.conf`, `junos/policy-options/policy-statement/ps-as63535-import.conf`, `junos/policy-options/policy-statement/ps-ebgp-cr-export.conf`, `junos/policy-options/policy-statement/ps-ibgp-mdr-export-mse1.conf`, `junos/policy-options/policy-statement/ps-ibgp-mse-export.conf`, `junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf`, `junos/policy-options/policy-statement/ps-import-l3vpn-internet.conf`, `junos/policy-options/policy-statement/ps-mse-import.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/policy-options/prefix-list/pl-an-region.conf`, `junos/policy-options/prefix-list/pl-mse-primary.conf`, `junos/policy-options/prefix-list/pl-mse.conf`, `junos/protocols/bgp-overlay-mse2.conf`, `junos/routing-options/rib-group-remote-loopbacks-mse.conf`
  - ask for **policy-statement:$EXPORT_POL**, one of `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-2.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-3.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## byoai/DEFAULTS.md

# Auto-fill Defaults

This file is part of the [BYOAI](README.md) corpus. It defines the deterministic JVD lab-default values the AI uses when the user picks `auto` mode (or short-circuits with `all defaults` / `skip`). Bundled into [`jvd-mebs-snips.md`](jvd-mebs-snips.md) by `regenerate-bundle.sh`.

Every value comes from an IETF documentation range or a private/reserved range so the output is visibly safe to share.

This file decides how an **already applicable** variable is handled — defaulted, asked, or supplied per device. It does not establish applicability. A variable applies only when a snippet in the resolved closure for the requested form, devices and selected variant members declares it; an entry here for a variable outside that closure does not apply to the request.

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
- Route-Reflector: first PE in the device list — supplies `$RR1_V4`
- `$RR2_V4`: **ask**. The deployed overlay peers with a redundant RR pair and this
  JVD defines no rule for the second address. Do not synthesize one and do not
  reuse `$RR1_V4`. (With a single-device request neither RR is derivable — ask.)
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
- ESI: see **ESI** below (service id = `<S>`)

## EVPN-ELAN service (vlan V, sequential from 2001; skip 1, 1002–1005, 4094)

- Instance name: `EVPN_ELAN_<V>`
- EVI / VNI: `<V>`
- AC interface unit: `<V>`
- ESI: see **ESI** below (service id = `<V>`)

## ESI (every EVPN service with a multi-homed attachment circuit)

Applies wherever a snip consumes `$ESI` — EVPN-VPWS, EVPN-ELAN (vlan-based,
vlan-bundle, IRB, port-based), EVPN-FXC and EVPN E-Tree root UNIs alike.

- ESI: `00:11:22:33:44:55:66:<Sh>:<Sm>:<Sl>` where `<Sh>:<Sm>:<Sl>` are the three
  bytes of `(service id - base + 1)`, using that service's own base (`4001` for
  EVPN-VPWS, `2001` for EVPN-ELAN). Clearly synthetic.
- The same ESI value MUST appear on every PE sharing that attachment circuit;
  the bundle device carries no ESI, the logical interface does.

## L2Circuit

- `virtual-circuit-id`: `<V>`
- AC interface unit: `<V>`

## Service attachment inputs (ask — never auto-filled)

Physical attachment identity is deployment-specific: it is not derivable from the
snip library, the service id or the device name. In `auto` mode these are the
values that still require a question. Ask for all of the ones the selected snips
need in a single batch, then generate.

Never invent a port, PIC, bundle or LACP identity, and never answer a missing
value with the "cannot generate this from the snip library" refusal — that
sentence is reserved for a service or form the library does not contain.

| Variable | Ask for |
|---|---|
| `$IFD` | Parent interface / bundle carrying the UNI (e.g. `ae11`) |
| `$AC_INTF` | Attachment-circuit interface; `<ifd>.<unit>` where a unit applies |
| `$UNI_INTF` | Physical UNI port (port-based and E-Tree forms) |
| `$PS_INTF` | Pseudowire-subscriber anchor interface (floating PW) |
| `$ANCHOR_PIC` | PIC hosting that anchor (floating PW) |
| `$LACP_SYS_ID` | LACP system-id of the multi-homed bundle |
| `$INPUT_VID` | Customer-facing input VLAN, when it differs from the service VLAN |

Derivable, so do **not** ask: `$UNIT` and `$VLAN` follow the per-service rules
above once the user has given a service id or VLAN. `$INPUT_VID` equals that
VLAN only when the selected snip performs no VLAN translation — otherwise ask.

Any other physical attachment identifier with no rule in this file is
ask-required by default.

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
