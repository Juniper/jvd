# JVD Low Latency QoS Design for 5G snippet library

## evo/chassis/aggregated-devices-ethernet.conf

```
/*
 * Topic: Aggregated Ethernet device-count for the chassis
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 7
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
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

## evo/chassis/network-services-enhanced-ip.conf

```
/*
 * Topic: Enhanced IP chassis network-services mode
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
chassis {
  network-services enhanced-ip;
}
```

## evo/class-of-service/classifiers/cl-dscp-dscp-ipv6-exp-ieee8021p.conf

```
/*
 * Topic: DSCP, DSCP IPv6, MPLS EXP and IEEE 802.1p behavior aggregate classifiers for the eight forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 7
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-8class-model.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    classifiers {
        dscp CL-DSCP {
            import default;
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-points be;
            }
            forwarding-class FC-CONTROL {
                loss-priority low code-points cs7;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-points af33;
                loss-priority low code-points [ cs3 af31 ];
                loss-priority medium-high code-points af32;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-points af43;
                loss-priority low code-points [ cs4 af41 ];
                loss-priority medium-high code-points af42;
            }
            forwarding-class FC-LOW {
                loss-priority high code-points af13;
                loss-priority low code-points [ cs1 af11 ];
                loss-priority medium-high code-points af12;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-points af23;
                loss-priority low code-points [ cs2 af21 ];
                loss-priority medium-high code-points af22;
            }
            forwarding-class FC-REALTIME {
                loss-priority low code-points ef;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-points cs5;
                loss-priority low code-points cs6;
            }
        }
        dscp-ipv6 CL-DSCP-IPV6 {
            import default;
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-points be;
            }
            forwarding-class FC-CONTROL {
                loss-priority low code-points cs7;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-points af33;
                loss-priority low code-points [ cs3 af31 ];
                loss-priority medium-high code-points af32;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-points af43;
                loss-priority low code-points [ cs4 af41 ];
                loss-priority medium-high code-points af42;
            }
            forwarding-class FC-LOW {
                loss-priority high code-points af13;
                loss-priority low code-points [ cs1 af11 ];
                loss-priority medium-high code-points af12;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-points af23;
                loss-priority low code-points [ cs2 af21 ];
                loss-priority medium-high code-points af22;
            }
            forwarding-class FC-REALTIME {
                loss-priority low code-points ef;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-points cs5;
                loss-priority low code-points cs6;
            }
        }
        exp CL-MPLS {
            import default;
            forwarding-class FC-BEST-EFFORT {
                loss-priority low code-points 000;
            }
            forwarding-class FC-CONTROL {
                loss-priority low code-points 111;
            }
            forwarding-class FC-HIGH {
                loss-priority low code-points 011;
            }
            forwarding-class FC-LLQ {
                loss-priority low code-points 100;
            }
            forwarding-class FC-LOW {
                loss-priority low code-points 001;
            }
            forwarding-class FC-MEDIUM {
                loss-priority low code-points 010;
            }
            forwarding-class FC-REALTIME {
                loss-priority low code-points 101;
            }
            forwarding-class FC-SIGNALING {
                loss-priority low code-points 110;
            }
        }
        ieee-802.1 CL-8021P {
            import default;
            forwarding-class FC-BEST-EFFORT {
                loss-priority low code-points 000;
            }
            forwarding-class FC-CONTROL {
                loss-priority low code-points 111;
            }
            forwarding-class FC-HIGH {
                loss-priority low code-points 011;
            }
            forwarding-class FC-LLQ {
                loss-priority low code-points 100;
            }
            forwarding-class FC-LOW {
                loss-priority low code-points 001;
            }
            forwarding-class FC-MEDIUM {
                loss-priority low code-points 010;
            }
            forwarding-class FC-REALTIME {
                loss-priority low code-points 101;
            }
            forwarding-class FC-SIGNALING {
                loss-priority low code-points 110;
            }
        }
    }
}
```

## evo/class-of-service/forwarding-classes/fc-8class-model.conf

```
/*
 * Topic: Eight forwarding classes mapped to queues 0 to 7, aligned with the O-RAN multiple priority queues
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 7
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    forwarding-classes {
        class FC-BEST-EFFORT queue-num 0;
        class FC-CONTROL queue-num 3;
        class FC-HIGH queue-num 4;
        class FC-LLQ queue-num 6;
        class FC-LOW queue-num 1;
        class FC-MEDIUM queue-num 2;
        class FC-REALTIME queue-num 5;
        class FC-SIGNALING queue-num 7;
    }
}
```

## evo/class-of-service/interfaces/ifd-scheduler-map.conf

```
/*
 * Topic: Scheduler map on an interface
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 8
 *   ag1_2_acx7100-32c 8
 *   an1_acx7100-48l 3
 *   an3_acx7100-48l 4
 *   an4_acx7024 4
 *   cr1_ptx10001-36mr 4
 *   cr2_ptx10001-36mr 4
 *   total 35
 * Pair with:
 *  - evo/class-of-service/scheduler-maps/sm-5g-scheduler.conf
 *
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $COS_INTF  e.g. ae19
 */
class-of-service {
    interfaces {
        $COS_INTF {
            scheduler-map SM-5G-SCHEDULER;
        }
    }
}
```

## evo/class-of-service/interfaces/ifl-dscp-classifier-rewrite.conf

```
/*
 * Topic: DSCP classifier and rewrite rule on a logical unit
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an4_acx7024
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an4_acx7024 1
 *   total 3
 * Pair with:
 *  - evo/class-of-service/classifiers/cl-dscp-dscp-ipv6-exp-ieee8021p.conf
 *
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $COS_INTF  e.g. et-1/0/7
 *   $UNIT      e.g. 3801
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                classifiers {
                    dscp CL-DSCP;
                }
                rewrite-rules {
                    dscp RR-DSCP;
                }
            }
        }
    }
}
```

## evo/class-of-service/interfaces/ifl-dscp-dscp-ipv6-classifier-rewrite.conf

```
/*
 * Topic: DSCP and DSCP IPv6 classifiers and rewrite rules on a logical unit
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   ag1_1_acx7509 266
 *   ag1_2_acx7100-32c 266
 *   an1_acx7100-48l 100
 *   an3_acx7100-48l 100
 *   an4_acx7024 100
 *   total 832
 * Pair with:
 *  - evo/class-of-service/classifiers/cl-dscp-dscp-ipv6-exp-ieee8021p.conf
 *
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $COS_INTF  e.g. et-1/0/1
 *   $UNIT      e.g. 1
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                classifiers {
                    dscp CL-DSCP;
                    dscp-ipv6 CL-DSCP-IPV6;
                }
                rewrite-rules {
                    dscp RR-DSCP;
                    dscp-ipv6 RR-DSCP-IPV6;
                }
            }
        }
    }
}
```

## evo/class-of-service/interfaces/ifl-forwarding-class-high-ieee8021p-rewrite.conf

```
/*
 * Topic: Fixed classification to FC-HIGH with an IEEE 802.1p rewrite rule on a logical unit
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   an1_acx7100-48l 100
 *   an3_acx7100-48l 100
 *   an4_acx7024 50
 *   total 250
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-8class-model.conf
 *
 * Peers with: n/a
 * Variables (example values from an1_acx7100-48l):
 *   $COS_INTF  e.g. et-0/0/2
 *   $UNIT      e.g. 1301
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                forwarding-class FC-HIGH;
                rewrite-rules {
                    ieee-802.1 RR-8021P;
                }
            }
        }
    }
}
```

## evo/class-of-service/interfaces/ifl-forwarding-class-llq-ieee8021p-rewrite.conf

```
/*
 * Topic: Fixed classification to FC-LLQ with an IEEE 802.1p rewrite rule on a logical unit
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   ag1_1_acx7509 150
 *   ag1_2_acx7100-32c 150
 *   an1_acx7100-48l 100
 *   an3_acx7100-48l 100
 *   an4_acx7024 100
 *   total 600
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-8class-model.conf
 *
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $COS_INTF  e.g. et-1/0/1
 *   $UNIT      e.g. 3501
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                forwarding-class FC-LLQ;
                rewrite-rules {
                    ieee-802.1 RR-8021P;
                }
            }
        }
    }
}
```

## evo/class-of-service/interfaces/ifl-forwarding-class-low-ieee8021p-rewrite.conf

```
/*
 * Topic: Fixed classification to FC-LOW with an IEEE 802.1p rewrite rule on a logical unit
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   an1_acx7100-48l 50
 *   an3_acx7100-48l 50
 *   an4_acx7024 25
 *   total 125
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-8class-model.conf
 *
 * Peers with: n/a
 * Variables (example values from an1_acx7100-48l):
 *   $COS_INTF  e.g. et-0/0/2
 *   $UNIT      e.g. 1451
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                forwarding-class FC-LOW;
                rewrite-rules {
                    ieee-802.1 RR-8021P;
                }
            }
        }
    }
}
```

## evo/class-of-service/interfaces/ifl-forwarding-class-medium-ieee8021p-rewrite.conf

```
/*
 * Topic: Fixed classification to FC-MEDIUM with an IEEE 802.1p rewrite rule on a logical unit
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   an1_acx7100-48l 50
 *   an3_acx7100-48l 50
 *   an4_acx7024 25
 *   total 125
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-8class-model.conf
 *
 * Peers with: n/a
 * Variables (example values from an1_acx7100-48l):
 *   $COS_INTF  e.g. et-0/0/2
 *   $UNIT      e.g. 1401
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                forwarding-class FC-MEDIUM;
                rewrite-rules {
                    ieee-802.1 RR-8021P;
                }
            }
        }
    }
}
```

## evo/class-of-service/interfaces/ifl-ieee8021p-classifier-rewrite.conf

```
/*
 * Topic: IEEE 802.1p classifier and rewrite rule on a logical unit
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   ag1_1_acx7509 200
 *   ag1_2_acx7100-32c 150
 *   an1_acx7100-48l 450
 *   an3_acx7100-48l 450
 *   an4_acx7024 500
 *   total 1750
 * Pair with:
 *  - evo/class-of-service/classifiers/cl-dscp-dscp-ipv6-exp-ieee8021p.conf
 *
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $COS_INTF  e.g. ae26
 *   $UNIT      e.g. 1501
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                classifiers {
                    ieee-802.1 CL-8021P;
                }
                rewrite-rules {
                    ieee-802.1 RR-8021P;
                }
            }
        }
    }
}
```

## evo/class-of-service/interfaces/ifl-unit-0-exp-classifier-rewrite.conf

```
/*
 * Topic: MPLS EXP classifier and rewrite rule on unit 0 of a core interface
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 5
 *   ag1_2_acx7100-32c 6
 *   an1_acx7100-48l 2
 *   an3_acx7100-48l 2
 *   an4_acx7024 2
 *   cr1_ptx10001-36mr 4
 *   cr2_ptx10001-36mr 4
 *   total 25
 * Pair with:
 *  - evo/class-of-service/classifiers/cl-dscp-dscp-ipv6-exp-ieee8021p.conf
 *
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $COS_INTF  e.g. ae19
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit 0 {
                classifiers {
                    exp CL-MPLS;
                }
                rewrite-rules {
                    exp RR-MPLS;
                }
            }
        }
    }
}
```

## evo/class-of-service/interfaces/irb-forwarding-class-realtime-dscp-dscp-ipv6-rewrite.conf

```
/*
 * Topic: Fixed classification to FC-REALTIME with DSCP and DSCP IPv6 rewrite rules on a logical unit
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 166
 *   ag1_2_acx7100-32c 166
 *   total 332
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-8class-model.conf
 *
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $UNIT  e.g. 101
 */
class-of-service {
    interfaces {
        irb {
            unit $UNIT {
                forwarding-class FC-REALTIME;
                rewrite-rules {
                    dscp RR-DSCP;
                    dscp-ipv6 RR-DSCP-IPV6;
                }
            }
        }
    }
}
```

## evo/class-of-service/rewrite-rules/rr-dscp-dscp-ipv6-exp-ieee8021p.conf

```
/*
 * Topic: DSCP, DSCP IPv6, MPLS EXP and IEEE 802.1p rewrite rules for the eight forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 7
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-8class-model.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    rewrite-rules {
        dscp RR-DSCP {
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-point be;
                loss-priority low code-point be;
            }
            forwarding-class FC-CONTROL {
                loss-priority high code-point cs7;
                loss-priority low code-point cs7;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-point af33;
                loss-priority low code-point af31;
                loss-priority medium-high code-point af32;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-point af43;
                loss-priority low code-point af41;
                loss-priority medium-high code-point af42;
            }
            forwarding-class FC-LOW {
                loss-priority high code-point af13;
                loss-priority low code-point af11;
                loss-priority medium-high code-point af12;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-point af23;
                loss-priority low code-point af21;
                loss-priority medium-high code-point af22;
            }
            forwarding-class FC-REALTIME {
                loss-priority high code-point ef;
                loss-priority low code-point ef;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-point cs5;
                loss-priority low code-point cs6;
            }
        }
        dscp-ipv6 RR-DSCP-IPV6 {
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-point be;
                loss-priority low code-point be;
            }
            forwarding-class FC-CONTROL {
                loss-priority high code-point cs7;
                loss-priority low code-point cs7;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-point af33;
                loss-priority low code-point af31;
                loss-priority medium-high code-point af32;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-point af43;
                loss-priority low code-point af41;
                loss-priority medium-high code-point af42;
            }
            forwarding-class FC-LOW {
                loss-priority high code-point af13;
                loss-priority low code-point af11;
                loss-priority medium-high code-point af12;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-point af23;
                loss-priority low code-point af21;
                loss-priority medium-high code-point af22;
            }
            forwarding-class FC-REALTIME {
                loss-priority high code-point ef;
                loss-priority low code-point ef;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-point cs5;
                loss-priority low code-point cs6;
            }
        }
        exp RR-MPLS {
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-point 000;
                loss-priority low code-point 000;
            }
            forwarding-class FC-CONTROL {
                loss-priority high code-point 111;
                loss-priority low code-point 111;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-point 011;
                loss-priority low code-point 011;
                loss-priority medium-high code-point 011;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-point 100;
                loss-priority low code-point 100;
                loss-priority medium-high code-point 100;
            }
            forwarding-class FC-LOW {
                loss-priority high code-point 001;
                loss-priority low code-point 001;
                loss-priority medium-high code-point 001;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-point 010;
                loss-priority low code-point 010;
                loss-priority medium-high code-point 010;
            }
            forwarding-class FC-REALTIME {
                loss-priority high code-point 101;
                loss-priority low code-point 101;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-point 110;
                loss-priority low code-point 110;
            }
        }
        ieee-802.1 RR-8021P {
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-point 000;
                loss-priority low code-point 000;
            }
            forwarding-class FC-CONTROL {
                loss-priority high code-point 111;
                loss-priority low code-point 111;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-point 011;
                loss-priority low code-point 011;
                loss-priority medium-high code-point 011;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-point 100;
                loss-priority low code-point 100;
                loss-priority medium-high code-point 100;
            }
            forwarding-class FC-LOW {
                loss-priority high code-point 001;
                loss-priority low code-point 001;
                loss-priority medium-high code-point 001;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-point 010;
                loss-priority low code-point 010;
                loss-priority medium-high code-point 010;
            }
            forwarding-class FC-REALTIME {
                loss-priority high code-point 101;
                loss-priority low code-point 101;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-point 110;
                loss-priority low code-point 110;
            }
        }
    }
}
```

## evo/class-of-service/scheduler-maps/sm-5g-scheduler.conf

```
/*
 * Topic: Scheduler map SM-5G-SCHEDULER binding the eight forwarding classes to their schedulers
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 7
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-8class-model.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    scheduler-maps {
        SM-5G-SCHEDULER {
            forwarding-class FC-BEST-EFFORT scheduler SC-BEST-EFFORT;
            forwarding-class FC-CONTROL scheduler SC-CONTROL;
            forwarding-class FC-HIGH scheduler SC-HIGH;
            forwarding-class FC-LLQ scheduler SC-LLQ;
            forwarding-class FC-LOW scheduler SC-LOW;
            forwarding-class FC-MEDIUM scheduler SC-MEDIUM;
            forwarding-class FC-REALTIME scheduler SC-REALTIME;
            forwarding-class FC-SIGNALING scheduler SC-SIGNALING;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `scheduler` (`SC-BEST-EFFORT`, `SC-CONTROL`, `SC-HIGH`, `SC-LLQ`, `SC-LOW`, `SC-MEDIUM`, `SC-REALTIME`, `SC-SIGNALING`): required, for each reference; one of `class-of-service/schedulers/schedulers-8class-llq-low-latency`, `class-of-service/schedulers/schedulers-8class-llq-strict-high`

## evo/class-of-service/schedulers/schedulers-8class-llq-low-latency.conf

```
/*
 * Topic: Schedulers for the eight forwarding classes: SC-LLQ shaped at priority low-latency, SC-SIGNALING strict-high, SC-REALTIME medium-high
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    schedulers {
        SC-BEST-EFFORT {
            transmit-rate {
                remainder;
            }
            buffer-size {
                remainder;
            }
            priority low;
        }
        SC-CONTROL {
            shaping-rate percent 5;
            buffer-size percent 5;
            priority high;
        }
        SC-HIGH {
            transmit-rate percent 40;
            buffer-size percent 30;
            priority low;
        }
        SC-LLQ {
            shaping-rate percent 40;
            buffer-size percent 10;
            priority low-latency;
        }
        SC-LOW {
            transmit-rate percent 20;
            priority low;
        }
        SC-MEDIUM {
            transmit-rate percent 30;
            buffer-size percent 20;
            priority low;
        }
        SC-REALTIME {
            shaping-rate percent 30;
            buffer-size percent 20;
            priority medium-high;
        }
        SC-SIGNALING {
            shaping-rate percent 5;
            buffer-size percent 5;
            priority strict-high;
        }
    }
}
```

## evo/class-of-service/schedulers/schedulers-8class-llq-strict-high.conf

```
/*
 * Topic: Schedulers for the eight forwarding classes: SC-LLQ shaped at priority strict-high, SC-SIGNALING high, SC-REALTIME medium-high
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    schedulers {
        SC-BEST-EFFORT {
            transmit-rate {
                remainder;
            }
            buffer-size {
                remainder;
            }
            priority low;
        }
        SC-CONTROL {
            shaping-rate percent 5;
            buffer-size percent 5;
            priority high;
        }
        SC-HIGH {
            transmit-rate percent 40;
            buffer-size percent 30;
            priority low;
        }
        SC-LLQ {
            shaping-rate percent 40;
            buffer-size percent 10;
            priority strict-high;
        }
        SC-LOW {
            transmit-rate percent 20;
            priority low;
        }
        SC-MEDIUM {
            transmit-rate percent 30;
            buffer-size percent 20;
            priority low;
        }
        SC-REALTIME {
            shaping-rate percent 30;
            buffer-size percent 20;
            priority medium-high;
        }
        SC-SIGNALING {
            shaping-rate percent 5;
            buffer-size percent 5;
            priority high;
        }
    }
}
```

## evo/firewall/filter-ccc-mf-evpn-vpws-mh-an1.conf

```
/*
 * Topic: Multifield family ccc filter on AN1: 802.1p and source and destination MAC terms to forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7100-48l
 * Count:
 *   an1_acx7100-48l 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
firewall {
    family ccc {
        filter FF-MF-EVPN-VPWS-MH {
            interface-specific;
            term 1 {
                from {
                    learn-vlan-1p-priority 3;
                }
                then forwarding-class FC-HIGH;
            }
            term 2 {
                from {
                    learn-vlan-1p-priority 7;
                }
                then forwarding-class FC-BEST-EFFORT;
            }
            term 3 {
                from {
                    source-mac-address {
                        00:0c:0d:00:00:01/48;
                        00:0c:0d:00:00:02/48;
                        00:0c:0d:00:00:03/48;
                        00:0c:0d:00:00:04/48;
                        00:0c:0d:00:00:05/48;
                        00:0c:0d:00:00:06/48;
                        00:0c:0d:00:00:07/48;
                        00:0c:0d:00:00:08/48;
                        00:0c:0d:00:00:09/48;
                        00:0c:0d:00:00:0a/48;
                        00:0c:0d:00:00:0b/48;
                        00:0c:0d:00:00:0c/48;
                        00:0c:0d:00:00:0d/48;
                        00:0c:0d:00:00:0e/48;
                        00:0c:0d:00:00:0f/48;
                        00:0c:0d:00:00:10/48;
                    }
                }
                then forwarding-class FC-LLQ;
            }
            term 4 {
                from {
                    source-mac-address {
                        00:0c:0e:00:00:01/48;
                        00:0c:0e:00:00:02/48;
                        00:0c:0e:00:00:03/48;
                        00:0c:0e:00:00:04/48;
                        00:0c:0e:00:00:05/48;
                        00:0c:0e:00:00:06/48;
                        00:0c:0e:00:00:07/48;
                        00:0c:0e:00:00:08/48;
                        00:0c:0e:00:00:09/48;
                        00:0c:0e:00:00:0a/48;
                        00:0c:0e:00:00:0b/48;
                        00:0c:0e:00:00:0c/48;
                        00:0c:0e:00:00:0d/48;
                        00:0c:0e:00:00:0e/48;
                        00:0c:0e:00:00:0f/48;
                        00:0c:0e:00:00:10/48;
                    }
                }
                then forwarding-class FC-SIGNALING;
            }
            term 5 {
                from {
                    source-mac-address {
                        00:0c:0f:00:00:01/48;
                        00:0c:0f:00:00:02/48;
                        00:0c:0f:00:00:03/48;
                        00:0c:0f:00:00:04/48;
                        00:0c:0f:00:00:05/48;
                        00:0c:0f:00:00:06/48;
                        00:0c:0f:00:00:07/48;
                        00:0c:0f:00:00:08/48;
                        00:0c:0f:00:00:09/48;
                        00:0c:0f:00:00:0a/48;
                        00:0c:0f:00:00:0b/48;
                        00:0c:0f:00:00:0c/48;
                        00:0c:0f:00:00:0d/48;
                        00:0c:0f:00:00:0e/48;
                        00:0c:0f:00:00:0f/48;
                        00:0c:0f:00:00:10/48;
                    }
                }
                then forwarding-class FC-CONTROL;
            }
            term 6 {
                from {
                    destination-mac-address {
                        00:0c:22:00:00:01/48;
                        00:0c:22:00:00:02/48;
                        00:0c:22:00:00:03/48;
                        00:0c:22:00:00:04/48;
                        00:0c:22:00:00:05/48;
                        00:0c:22:00:00:06/48;
                        00:0c:22:00:00:07/48;
                        00:0c:22:00:00:08/48;
                        00:0c:22:00:00:09/48;
                        00:0c:22:00:00:0a/48;
                        00:0c:22:00:00:0b/48;
                        00:0c:22:00:00:0c/48;
                        00:0c:22:00:00:0d/48;
                        00:0c:22:00:00:0e/48;
                        00:0c:22:00:00:0f/48;
                        00:0c:22:00:00:10/48;
                    }
                }
                then forwarding-class FC-REALTIME;
            }
        }
    }
}
```

## evo/firewall/filter-ccc-mf-evpn-vpws-mh-an3.conf

```
/*
 * Topic: Multifield family ccc filter on AN3: 802.1p and source and destination MAC terms to forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: an3_acx7100-48l
 * Count:
 *   an3_acx7100-48l 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
firewall {
    family ccc {
        filter FF-MF-EVPN-VPWS-MH {
            interface-specific;
            term 1 {
                from {
                    learn-vlan-1p-priority 3;
                }
                then forwarding-class FC-HIGH;
            }
            term 2 {
                from {
                    learn-vlan-1p-priority 7;
                }
                then forwarding-class FC-BEST-EFFORT;
            }
            term 3 {
                from {
                    source-mac-address {
                        00:0c:01:00:00:01/48;
                        00:0c:01:00:00:02/48;
                        00:0c:01:00:00:03/48;
                        00:0c:01:00:00:04/48;
                        00:0c:01:00:00:05/48;
                        00:0c:01:00:00:06/48;
                        00:0c:01:00:00:07/48;
                        00:0c:01:00:00:08/48;
                        00:0c:01:00:00:09/48;
                        00:0c:01:00:00:0a/48;
                        00:0c:01:00:00:0b/48;
                        00:0c:01:00:00:0c/48;
                        00:0c:01:00:00:0d/48;
                        00:0c:01:00:00:0e/48;
                        00:0c:01:00:00:0f/48;
                        00:0c:01:00:00:10/48;
                    }
                }
                then forwarding-class FC-LLQ;
            }
            term 4 {
                from {
                    source-mac-address {
                        00:0c:02:00:00:01/48;
                        00:0c:02:00:00:02/48;
                        00:0c:02:00:00:03/48;
                        00:0c:02:00:00:04/48;
                        00:0c:02:00:00:05/48;
                        00:0c:02:00:00:06/48;
                        00:0c:02:00:00:07/48;
                        00:0c:02:00:00:08/48;
                        00:0c:02:00:00:09/48;
                        00:0c:02:00:00:0a/48;
                        00:0c:02:00:00:0b/48;
                        00:0c:02:00:00:0c/48;
                        00:0c:02:00:00:0d/48;
                        00:0c:02:00:00:0e/48;
                        00:0c:02:00:00:0f/48;
                        00:0c:02:00:00:10/48;
                    }
                }
                then forwarding-class FC-SIGNALING;
            }
            term 5 {
                from {
                    source-mac-address {
                        00:0c:03:00:00:01/48;
                        00:0c:03:00:00:02/48;
                        00:0c:03:00:00:03/48;
                        00:0c:03:00:00:04/48;
                        00:0c:03:00:00:05/48;
                        00:0c:03:00:00:06/48;
                        00:0c:03:00:00:07/48;
                        00:0c:03:00:00:08/48;
                        00:0c:03:00:00:09/48;
                        00:0c:03:00:00:0a/48;
                        00:0c:03:00:00:0b/48;
                        00:0c:03:00:00:0c/48;
                        00:0c:03:00:00:0d/48;
                        00:0c:03:00:00:0e/48;
                        00:0c:03:00:00:0f/48;
                        00:0c:03:00:00:10/48;
                    }
                }
                then forwarding-class FC-CONTROL;
            }
            term 6 {
                from {
                    destination-mac-address {
                        00:0c:16:00:00:01/48;
                        00:0c:16:00:00:02/48;
                        00:0c:16:00:00:03/48;
                        00:0c:16:00:00:04/48;
                        00:0c:16:00:00:05/48;
                        00:0c:16:00:00:06/48;
                        00:0c:16:00:00:07/48;
                        00:0c:16:00:00:08/48;
                        00:0c:16:00:00:09/48;
                        00:0c:16:00:00:0a/48;
                        00:0c:16:00:00:0b/48;
                        00:0c:16:00:00:0c/48;
                        00:0c:16:00:00:0d/48;
                        00:0c:16:00:00:0e/48;
                        00:0c:16:00:00:0f/48;
                        00:0c:16:00:00:10/48;
                    }
                }
                then forwarding-class FC-REALTIME;
            }
        }
    }
}
```

## evo/firewall/filter-ccc-mf-evpn-vpws-mh-an4.conf

```
/*
 * Topic: Multifield family ccc filter on AN4: 802.1p and source and destination MAC terms to forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: an4_acx7024
 * Count:
 *   an4_acx7024 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
firewall {
    family ccc {
        filter FF-MF-EVPN-VPWS-MH {
            interface-specific;
            term 1 {
                from {
                    learn-vlan-1p-priority 3;
                }
                then forwarding-class FC-HIGH;
            }
            term 2 {
                from {
                    learn-vlan-1p-priority 7;
                }
                then forwarding-class FC-BEST-EFFORT;
            }
            term 3 {
                from {
                    source-mac-address {
                        00:0c:07:00:00:01/48;
                        00:0c:07:00:00:02/48;
                        00:0c:07:00:00:03/48;
                        00:0c:07:00:00:04/48;
                        00:0c:07:00:00:05/48;
                        00:0c:07:00:00:06/48;
                        00:0c:07:00:00:07/48;
                        00:0c:07:00:00:08/48;
                        00:0c:07:00:00:09/48;
                        00:0c:07:00:00:0a/48;
                        00:0c:07:00:00:0b/48;
                        00:0c:07:00:00:0c/48;
                        00:0c:07:00:00:0d/48;
                        00:0c:07:00:00:0e/48;
                        00:0c:07:00:00:0f/48;
                        00:0c:07:00:00:10/48;
                    }
                }
                then forwarding-class FC-LLQ;
            }
            term 4 {
                from {
                    source-mac-address {
                        00:0c:08:00:00:01/48;
                        00:0c:08:00:00:02/48;
                        00:0c:08:00:00:03/48;
                        00:0c:08:00:00:04/48;
                        00:0c:08:00:00:05/48;
                        00:0c:08:00:00:06/48;
                        00:0c:08:00:00:07/48;
                        00:0c:08:00:00:08/48;
                        00:0c:08:00:00:09/48;
                        00:0c:08:00:00:0a/48;
                        00:0c:08:00:00:0b/48;
                        00:0c:08:00:00:0c/48;
                        00:0c:08:00:00:0d/48;
                        00:0c:08:00:00:0e/48;
                        00:0c:08:00:00:0f/48;
                        00:0c:08:00:00:10/48;
                    }
                }
                then forwarding-class FC-SIGNALING;
            }
            term 5 {
                from {
                    source-mac-address {
                        00:0c:09:00:00:01/48;
                        00:0c:09:00:00:02/48;
                        00:0c:09:00:00:03/48;
                        00:0c:09:00:00:04/48;
                        00:0c:09:00:00:05/48;
                        00:0c:09:00:00:06/48;
                        00:0c:09:00:00:07/48;
                        00:0c:09:00:00:08/48;
                        00:0c:09:00:00:09/48;
                        00:0c:09:00:00:0a/48;
                        00:0c:09:00:00:0b/48;
                        00:0c:09:00:00:0c/48;
                        00:0c:09:00:00:0d/48;
                        00:0c:09:00:00:0e/48;
                        00:0c:09:00:00:0f/48;
                        00:0c:09:00:00:10/48;
                    }
                }
                then forwarding-class FC-CONTROL;
            }
            term 6 {
                from {
                    destination-mac-address {
                        00:0c:1c:00:00:01/48;
                        00:0c:1c:00:00:02/48;
                        00:0c:1c:00:00:03/48;
                        00:0c:1c:00:00:04/48;
                        00:0c:1c:00:00:05/48;
                        00:0c:1c:00:00:06/48;
                        00:0c:1c:00:00:07/48;
                        00:0c:1c:00:00:08/48;
                        00:0c:1c:00:00:09/48;
                        00:0c:1c:00:00:0a/48;
                        00:0c:1c:00:00:0b/48;
                        00:0c:1c:00:00:0c/48;
                        00:0c:1c:00:00:0d/48;
                        00:0c:1c:00:00:0e/48;
                        00:0c:1c:00:00:0f/48;
                        00:0c:1c:00:00:10/48;
                    }
                }
                then forwarding-class FC-REALTIME;
            }
        }
    }
}
```

## evo/firewall/filter-ccc-mf-evpn-vpws-mh-to-an1.conf

```
/*
 * Topic: Multifield family ccc filter toward AN1: 802.1p and source and destination MAC terms to forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
firewall {
    family ccc {
        filter FF-MF-EVPN-VPWS-MH-TO-AN1 {
            interface-specific;
            term 1 {
                from {
                    learn-vlan-1p-priority 3;
                }
                then forwarding-class FC-HIGH;
            }
            term 2 {
                from {
                    learn-vlan-1p-priority 7;
                }
                then forwarding-class FC-BEST-EFFORT;
            }
            term 3 {
                from {
                    source-mac-address {
                        00:0c:13:00:00:01/48;
                        00:0c:13:00:00:02/48;
                        00:0c:13:00:00:03/48;
                        00:0c:13:00:00:04/48;
                        00:0c:13:00:00:05/48;
                        00:0c:13:00:00:06/48;
                        00:0c:13:00:00:07/48;
                        00:0c:13:00:00:08/48;
                        00:0c:13:00:00:09/48;
                        00:0c:13:00:00:0a/48;
                        00:0c:13:00:00:0b/48;
                        00:0c:13:00:00:0c/48;
                        00:0c:13:00:00:0d/48;
                        00:0c:13:00:00:0e/48;
                        00:0c:13:00:00:0f/48;
                        00:0c:13:00:00:10/48;
                    }
                }
                then forwarding-class FC-LLQ;
            }
            term 4 {
                from {
                    source-mac-address {
                        00:0c:14:00:00:01/48;
                        00:0c:14:00:00:02/48;
                        00:0c:14:00:00:03/48;
                        00:0c:14:00:00:04/48;
                        00:0c:14:00:00:05/48;
                        00:0c:14:00:00:06/48;
                        00:0c:14:00:00:07/48;
                        00:0c:14:00:00:08/48;
                        00:0c:14:00:00:09/48;
                        00:0c:14:00:00:0a/48;
                        00:0c:14:00:00:0b/48;
                        00:0c:14:00:00:0c/48;
                        00:0c:14:00:00:0d/48;
                        00:0c:14:00:00:0e/48;
                        00:0c:14:00:00:0f/48;
                        00:0c:14:00:00:10/48;
                    }
                }
                then forwarding-class FC-SIGNALING;
            }
            term 5 {
                from {
                    source-mac-address {
                        00:0c:15:00:00:01/48;
                        00:0c:15:00:00:02/48;
                        00:0c:15:00:00:03/48;
                        00:0c:15:00:00:04/48;
                        00:0c:15:00:00:05/48;
                        00:0c:15:00:00:06/48;
                        00:0c:15:00:00:07/48;
                        00:0c:15:00:00:08/48;
                        00:0c:15:00:00:09/48;
                        00:0c:15:00:00:0a/48;
                        00:0c:15:00:00:0b/48;
                        00:0c:15:00:00:0c/48;
                        00:0c:15:00:00:0d/48;
                        00:0c:15:00:00:0e/48;
                        00:0c:15:00:00:0f/48;
                        00:0c:15:00:00:10/48;
                    }
                }
                then forwarding-class FC-CONTROL;
            }
            term 6 {
                from {
                    destination-mac-address {
                        00:0c:04:00:00:01/48;
                        00:0c:04:00:00:02/48;
                        00:0c:04:00:00:03/48;
                        00:0c:04:00:00:04/48;
                        00:0c:04:00:00:05/48;
                        00:0c:04:00:00:06/48;
                        00:0c:04:00:00:07/48;
                        00:0c:04:00:00:08/48;
                        00:0c:04:00:00:09/48;
                        00:0c:04:00:00:0a/48;
                        00:0c:04:00:00:0b/48;
                        00:0c:04:00:00:0c/48;
                        00:0c:04:00:00:0d/48;
                        00:0c:04:00:00:0e/48;
                        00:0c:04:00:00:0f/48;
                        00:0c:04:00:00:10/48;
                    }
                }
                then forwarding-class FC-REALTIME;
            }
        }
    }
}
```

## evo/firewall/filter-ccc-mf-evpn-vpws-mh-to-an3.conf

```
/*
 * Topic: Multifield family ccc filter toward AN3: 802.1p and source and destination MAC terms to forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
firewall {
    family ccc {
        filter FF-MF-EVPN-VPWS-MH-TO-AN3 {
            interface-specific;
            term 1 {
                from {
                    learn-vlan-1p-priority 3;
                }
                then forwarding-class FC-HIGH;
            }
            term 2 {
                from {
                    learn-vlan-1p-priority 7;
                }
                then forwarding-class FC-BEST-EFFORT;
            }
            term 3 {
                from {
                    source-mac-address {
                        00:0c:1f:00:00:01/48;
                        00:0c:1f:00:00:02/48;
                        00:0c:1f:00:00:03/48;
                        00:0c:1f:00:00:04/48;
                        00:0c:1f:00:00:05/48;
                        00:0c:1f:00:00:06/48;
                        00:0c:1f:00:00:07/48;
                        00:0c:1f:00:00:08/48;
                        00:0c:1f:00:00:09/48;
                        00:0c:1f:00:00:0a/48;
                        00:0c:1f:00:00:0b/48;
                        00:0c:1f:00:00:0c/48;
                        00:0c:1f:00:00:0d/48;
                        00:0c:1f:00:00:0e/48;
                        00:0c:1f:00:00:0f/48;
                        00:0c:1f:00:00:10/48;
                    }
                }
                then forwarding-class FC-LLQ;
            }
            term 4 {
                from {
                    source-mac-address {
                        00:0c:20:00:00:01/48;
                        00:0c:20:00:00:02/48;
                        00:0c:20:00:00:03/48;
                        00:0c:20:00:00:04/48;
                        00:0c:20:00:00:05/48;
                        00:0c:20:00:00:06/48;
                        00:0c:20:00:00:07/48;
                        00:0c:20:00:00:08/48;
                        00:0c:20:00:00:09/48;
                        00:0c:20:00:00:0a/48;
                        00:0c:20:00:00:0b/48;
                        00:0c:20:00:00:0c/48;
                        00:0c:20:00:00:0d/48;
                        00:0c:20:00:00:0e/48;
                        00:0c:20:00:00:0f/48;
                        00:0c:20:00:00:10/48;
                    }
                }
                then forwarding-class FC-SIGNALING;
            }
            term 5 {
                from {
                    source-mac-address {
                        00:0c:21:00:00:01/48;
                        00:0c:21:00:00:02/48;
                        00:0c:21:00:00:03/48;
                        00:0c:21:00:00:04/48;
                        00:0c:21:00:00:05/48;
                        00:0c:21:00:00:06/48;
                        00:0c:21:00:00:07/48;
                        00:0c:21:00:00:08/48;
                        00:0c:21:00:00:09/48;
                        00:0c:21:00:00:0a/48;
                        00:0c:21:00:00:0b/48;
                        00:0c:21:00:00:0c/48;
                        00:0c:21:00:00:0d/48;
                        00:0c:21:00:00:0e/48;
                        00:0c:21:00:00:0f/48;
                        00:0c:21:00:00:10/48;
                    }
                }
                then forwarding-class FC-CONTROL;
            }
            term 6 {
                from {
                    destination-mac-address {
                        00:0c:10:00:00:01/48;
                        00:0c:10:00:00:02/48;
                        00:0c:10:00:00:03/48;
                        00:0c:10:00:00:04/48;
                        00:0c:10:00:00:05/48;
                        00:0c:10:00:00:06/48;
                        00:0c:10:00:00:07/48;
                        00:0c:10:00:00:08/48;
                        00:0c:10:00:00:09/48;
                        00:0c:10:00:00:0a/48;
                        00:0c:10:00:00:0b/48;
                        00:0c:10:00:00:0c/48;
                        00:0c:10:00:00:0d/48;
                        00:0c:10:00:00:0e/48;
                        00:0c:10:00:00:0f/48;
                        00:0c:10:00:00:10/48;
                    }
                }
                then forwarding-class FC-REALTIME;
            }
        }
    }
}
```

## evo/firewall/filter-ccc-mf-evpn-vpws-mh-to-an4.conf

```
/*
 * Topic: Multifield family ccc filter toward AN4: 802.1p and source and destination MAC terms to forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
firewall {
    family ccc {
        filter FF-MF-EVPN-VPWS-MH-TO-AN4 {
            interface-specific;
            term 1 {
                from {
                    learn-vlan-1p-priority 3;
                }
                then forwarding-class FC-HIGH;
            }
            term 2 {
                from {
                    learn-vlan-1p-priority 7;
                }
                then forwarding-class FC-BEST-EFFORT;
            }
            term 3 {
                from {
                    source-mac-address {
                        00:0c:19:00:00:01/48;
                        00:0c:19:00:00:02/48;
                        00:0c:19:00:00:03/48;
                        00:0c:19:00:00:04/48;
                        00:0c:19:00:00:05/48;
                        00:0c:19:00:00:06/48;
                        00:0c:19:00:00:07/48;
                        00:0c:19:00:00:08/48;
                        00:0c:19:00:00:09/48;
                        00:0c:19:00:00:0a/48;
                        00:0c:19:00:00:0b/48;
                        00:0c:19:00:00:0c/48;
                        00:0c:19:00:00:0d/48;
                        00:0c:19:00:00:0e/48;
                        00:0c:19:00:00:0f/48;
                        00:0c:19:00:00:10/48;
                    }
                }
                then forwarding-class FC-LLQ;
            }
            term 4 {
                from {
                    source-mac-address {
                        00:0c:1a:00:00:01/48;
                        00:0c:1a:00:00:02/48;
                        00:0c:1a:00:00:03/48;
                        00:0c:1a:00:00:04/48;
                        00:0c:1a:00:00:05/48;
                        00:0c:1a:00:00:06/48;
                        00:0c:1a:00:00:07/48;
                        00:0c:1a:00:00:08/48;
                        00:0c:1a:00:00:09/48;
                        00:0c:1a:00:00:0a/48;
                        00:0c:1a:00:00:0b/48;
                        00:0c:1a:00:00:0c/48;
                        00:0c:1a:00:00:0d/48;
                        00:0c:1a:00:00:0e/48;
                        00:0c:1a:00:00:0f/48;
                        00:0c:1a:00:00:10/48;
                    }
                }
                then forwarding-class FC-SIGNALING;
            }
            term 5 {
                from {
                    source-mac-address {
                        00:0c:1b:00:00:01/48;
                        00:0c:1b:00:00:02/48;
                        00:0c:1b:00:00:03/48;
                        00:0c:1b:00:00:04/48;
                        00:0c:1b:00:00:05/48;
                        00:0c:1b:00:00:06/48;
                        00:0c:1b:00:00:07/48;
                        00:0c:1b:00:00:08/48;
                        00:0c:1b:00:00:09/48;
                        00:0c:1b:00:00:0a/48;
                        00:0c:1b:00:00:0b/48;
                        00:0c:1b:00:00:0c/48;
                        00:0c:1b:00:00:0d/48;
                        00:0c:1b:00:00:0e/48;
                        00:0c:1b:00:00:0f/48;
                        00:0c:1b:00:00:10/48;
                    }
                }
                then forwarding-class FC-CONTROL;
            }
            term 6 {
                from {
                    destination-mac-address {
                        00:0c:0a:00:00:01/48;
                        00:0c:0a:00:00:02/48;
                        00:0c:0a:00:00:03/48;
                        00:0c:0a:00:00:04/48;
                        00:0c:0a:00:00:05/48;
                        00:0c:0a:00:00:06/48;
                        00:0c:0a:00:00:07/48;
                        00:0c:0a:00:00:08/48;
                        00:0c:0a:00:00:09/48;
                        00:0c:0a:00:00:0a/48;
                        00:0c:0a:00:00:0b/48;
                        00:0c:0a:00:00:0c/48;
                        00:0c:0a:00:00:0d/48;
                        00:0c:0a:00:00:0e/48;
                        00:0c:0a:00:00:0f/48;
                        00:0c:0a:00:00:10/48;
                    }
                }
                then forwarding-class FC-REALTIME;
            }
        }
    }
}
```

## evo/firewall/filter-inet-mfc-dscp-forwarding-class.conf

```
/*
 * Topic: Interface-specific IPv4 multifield filter mapping DSCP code points to forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 2
 *   ag1_2_acx7100-32c 2
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $INPUT_FILTER_V4  e.g. FF-MFC-IPV4-L3VPN-BD-IRB
 */
firewall {
    family inet {
        filter $INPUT_FILTER_V4 {
            interface-specific;
            term fc-realtime {
                from {
                    dscp cs1;
                }
                then forwarding-class FC-REALTIME;
            }
            term fc-high {
                from {
                    dscp cs2;
                }
                then forwarding-class FC-HIGH;
            }
            term fc-medium {
                from {
                    dscp cs3;
                }
                then forwarding-class FC-MEDIUM;
            }
            term fc-low {
                from {
                    dscp cs4;
                }
                then forwarding-class FC-LOW;
            }
            term default {
                then accept;
            }
        }
    }
}
```

## evo/firewall/filter-inet6-mfc-traffic-class-forwarding-class.conf

```
/*
 * Topic: Interface-specific IPv6 multifield filter mapping traffic-class code points to forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 2
 *   ag1_2_acx7100-32c 2
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $INPUT_FILTER_V6  e.g. FF-MFC-IPV6-L3VPN-BD-IRB
 */
firewall {
    family inet6 {
        filter $INPUT_FILTER_V6 {
            interface-specific;
            term fc-realtime {
                from {
                    traffic-class cs1;
                }
                then forwarding-class FC-REALTIME;
            }
            term fc-high {
                from {
                    traffic-class cs2;
                }
                then forwarding-class FC-HIGH;
            }
            term fc-medium {
                from {
                    traffic-class cs3;
                }
                then forwarding-class FC-MEDIUM;
            }
            term fc-low {
                from {
                    traffic-class cs4;
                }
                then forwarding-class FC-LOW;
            }
            term default {
                then accept;
            }
        }
    }
}
```

## evo/forwarding-options/hash-key-inet-inet6-layer-3-4-mpls-all-labels-payload-ip.conf

```
/*
 * Topic: Hash key on Layer 3 and Layer 4 fields for IPv4 and IPv6, and on all MPLS labels plus the IP payload
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
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
    }
}
```

## evo/forwarding-options/hash-key-inet-inet6-layer-3-4-mpls-labels-1-3-payload.conf

```
/*
 * Topic: Hash key on Layer 3 and Layer 4 fields for IPv4 and IPv6, and on the first three MPLS labels plus the pseudowire and IP payload
 * Seen on:
 *   Junos: (none)
 *   EVO: cr2_ptx10001-36mr
 * Count:
 *   cr2_ptx10001-36mr 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
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
    }
}
```

## evo/forwarding-options/hash-key-mpls-all-labels.conf

```
/*
 * Topic: Load-balance hash key across IPv4, IPv6, MPLS all-labels and Layer 2
 * Seen on:
 *   Junos: (none)
 *   EVO: an4_acx7024
 * Count:
 *   an4_acx7024 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
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

## evo/interfaces/ifd-ae-description-flexible-lacp-fast-system-id.conf

```
/*
 * Topic: Aggregated Ethernet with flexible services, fast LACP and system ID
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   total 2
 * Pair with: none
 * Variables (example values from ag1_1_acx7509):
 *   $IFD          e.g. ae26
 *   $DESCRIPTION  e.g. TO-DU
 *   $LACP_SYS_ID  e.g. 00:00:00:00:00:01
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            lacp {
                active;
                periodic fast;
                system-id $LACP_SYS_ID;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `lag-member`: when the router's configuration has it, all related; one of `interfaces/ifd-lag-member-ether-speed-10g`, `interfaces/ifd-lag-member-ether`

## evo/interfaces/ifd-ae-description-mtu-lacp-fast.conf

```
/*
 * Topic: Aggregated Ethernet interface with a description, MTU and LACP active with fast periodic
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 5
 *   ag1_2_acx7100-32c 5
 *   an1_acx7100-48l 2
 *   an3_acx7100-48l 2
 *   an4_acx7024 2
 *   cr1_ptx10001-36mr 4
 *   cr2_ptx10001-36mr 4
 *   total 24
 * Pair with: none
 * Variables (example values from ag1_1_acx7509):
 *   $IFD          e.g. ae4
 *   $DESCRIPTION  e.g. To-AG1.2
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        mtu 9190;
        aggregated-ether-options {
            lacp {
                active;
                periodic fast;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `lag-member`: when the router's configuration has it, all related; one of `interfaces/ifd-lag-member-ether-100g`, `interfaces/ifd-lag-member-ether`

## evo/interfaces/ifd-breakout-4x10g.conf

```
/*
 * Topic: Four-subport 10G physical interface breakout
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_2_acx7100-32c
 * Count:
 *   ag1_2_acx7100-32c 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_2_acx7100-32c):
 *   $IFD  e.g. et-0/0/2
 */
interfaces {
  $IFD {
    number-of-sub-ports 4;
    speed 10g;
  }
}
```

## evo/interfaces/ifd-description-mtu.conf

```
/*
 * Topic: Port with a description and MTU
 * Seen on:
 *   Junos: (none)
 *   EVO: an4_acx7024
 * Count:
 *   an4_acx7024 2
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from an4_acx7024):
 *   $IFD          e.g. et-0/0/1
 *   $DESCRIPTION  e.g. To-AN1
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        mtu 9190;
    }
}
```

## evo/interfaces/ifd-description-speed-100g-mtu.conf

```
/*
 * Topic: 100GbE port with a description and MTU
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7100-48l an3_acx7100-48l
 * Count:
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from an1_acx7100-48l):
 *   $IFD  e.g. et-0/0/49
 */
interfaces {
    $IFD {
        description To-AN4;
        speed 100g;
        mtu 9190;
    }
}
```

## evo/interfaces/ifd-flexible-ethernet-services-description-speed-10g.conf

```
/*
 * Topic: 10G port with flexible services
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509
 * Count:
 *   ag1_1_acx7509 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $IFD          e.g. et-1/0/1
 *   $DESCRIPTION  e.g. To-RT3-L2-MIDHAUL-L2CKT-1000
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        flexible-vlan-tagging;
        speed 10g;
        encapsulation flexible-ethernet-services;
    }
}
```

## evo/interfaces/ifd-flexible-ethernet-services-description.conf

```
/*
 * Topic: Described port with flexible VLAN tagging and flexible Ethernet services
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_2_acx7100-32c):
 *   $IFD          e.g. et-0/0/2:0
 *   $DESCRIPTION  e.g. To-RT4-L2-MIDHAUL-L2CKT-1000
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
    }
}
```

## evo/interfaces/ifd-flexible-ethernet-services-speed-10g.conf

```
/*
 * Topic: 10GbE port with flexible VLAN tagging and flexible-ethernet-services encapsulation
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509
 * Count:
 *   ag1_1_acx7509 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $IFD  e.g. et-1/0/7
 */
interfaces {
    $IFD {
        flexible-vlan-tagging;
        speed 10g;
        encapsulation flexible-ethernet-services;
    }
}
```

## evo/interfaces/ifd-flexible-ethernet.conf

```
/*
 * Topic: Flexible VLAN tagging with flexible Ethernet services
 * Seen on:
 *   Junos: du_qfx5210 sag_mx304
 *   EVO: ag1_2_acx7100-32c an4_acx7024
 * Count:
 *   ag1_2_acx7100-32c 1
 *   an4_acx7024 1
 *   du_qfx5210 1
 *   sag_mx304 2
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_2_acx7100-32c):
 *   $IFD  e.g. et-0/0/2:3
 */
interfaces {
    $IFD {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
    }
}
```

## evo/interfaces/ifd-lag-member-ether-100g.conf

```
/*
 * Topic: 100G aggregated Ethernet member link through ether-options
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7100-48l an3_acx7100-48l
 * Count:
 *   an1_acx7100-48l 2
 *   an3_acx7100-48l 2
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from an1_acx7100-48l):
 *   $IFD        e.g. et-0/0/50
 *   $AE_BUNDLE  e.g. ae19
 */
interfaces {
    $IFD {
        speed 100g;
        ether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## evo/interfaces/ifd-lag-member-ether-speed-10g.conf

```
/*
 * Topic: 10GbE port as a LAG member
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509
 * Count:
 *   ag1_1_acx7509 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $IFD        e.g. et-1/0/0
 *   $AE_BUNDLE  e.g. ae26
 */
interfaces {
    $IFD {
        speed 10g;
        ether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## evo/interfaces/ifd-lag-member-ether.conf

```
/*
 * Topic: Core aggregate member interface
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 5
 *   ag1_2_acx7100-32c 7
 *   an4_acx7024 2
 *   cr1_ptx10001-36mr 7
 *   cr2_ptx10001-36mr 7
 *   total 28
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $IFD        e.g. et-5/0/1
 *   $AE_BUNDLE  e.g. ae19
 */
interfaces {
    $IFD {
        ether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## evo/interfaces/ifd-speed-100g.conf

```
/*
 * Topic: Port speed 100G
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7100-48l an3_acx7100-48l
 * Count:
 *   an1_acx7100-48l 2
 *   an3_acx7100-48l 3
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from an1_acx7100-48l):
 *   $IFD  e.g. et-0/0/51
 */
interfaces {
    $IFD {
        speed 100g;
    }
}
```

## evo/interfaces/ifd-speed-10g.conf

```
/*
 * Topic: Interface device at 10G
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 6
 *   ag1_2_acx7100-32c 1
 *   total 7
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $IFD  e.g. et-1/0/2
 */
interfaces {
    $IFD {
        speed 10g;
    }
}
```

## evo/interfaces/ifd-unused.conf

```
/*
 * Topic: Unused physical port
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_2_acx7100-32c
 * Count:
 *   ag1_2_acx7100-32c 2
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_2_acx7100-32c):
 *   $IFD  e.g. et-0/0/3
 */
interfaces {
    $IFD {
        unused;
    }
}
```

## evo/interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-5.conf

```
/*
 * Topic: Core logical interface
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 5
 *   ag1_2_acx7100-32c 5
 *   an1_acx7100-48l 3
 *   an3_acx7100-48l 3
 *   an4_acx7024 4
 *   cr1_ptx10001-36mr 4
 *   cr2_ptx10001-36mr 4
 *   total 28
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $IFD           e.g. ae22
 *   $UNIT          e.g. 0
 *   $CORE_V4_ADDR  e.g. 10.10.0.10/30
 *   $CORE_V6_ADDR  e.g. 2001:db8::10:10:0:b/126
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-ae-description-mtu-lacp-fast`, `interfaces/ifd-description-mtu`, `interfaces/ifd-description-speed-100g-mtu`
- `lag-member`: when the router's configuration has it, all related; one of `interfaces/ifd-lag-member-ether-100g`, `interfaces/ifd-lag-member-ether`

## evo/interfaces/ifl-irb-inet-inet6-static-arp-ndp-mac-filter.conf

```
/*
 * Topic: IRB unit with IPv4 and IPv6 input filters, addresses, a static ARP and NDP entry, and a fixed MAC address
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 84
 *   ag1_2_acx7100-32c 84
 *   total 168
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $IRB_UNIT         e.g. 517
 *   $DESCRIPTION      e.g. 5G-MIDHAUL-L3VPN-BD-IRB-167
 *   $INPUT_FILTER_V4  e.g. FF-MFC-IPV4-L3VPN-BD-IRB
 *   $AC_ADDR_V4       e.g. 10.31.167.1/24
 *   $STATIC_ARP_V4    e.g. 10.31.167.2
 *   $AC_IFL           e.g. ae26.517
 *   $STATIC_MAC       e.g. 00:99:00:00:00:a7
 *   $INPUT_FILTER_V6  e.g. FF-MFC-IPV6-L3VPN-BD-IRB
 *   $AC_ADDR_V6       e.g. 2001:db8::1fa6:11/112
 *   $STATIC_NDP_V6    e.g. 2001:db8::1fa6:12
 *   $IRB_MAC          e.g. 00:00:00:00:00:a7
 */
interfaces {
    irb {
        unit $IRB_UNIT {
            description $DESCRIPTION;
            family inet {
                filter {
                    input $INPUT_FILTER_V4;
                }
                address $AC_ADDR_V4 {
                    arp $STATIC_ARP_V4 l2-interface $AC_IFL mac $STATIC_MAC;
                }
            }
            family inet6 {
                filter {
                    input $INPUT_FILTER_V6;
                }
                address $AC_ADDR_V6 {
                    ndp $STATIC_NDP_V6 l2-interface $AC_IFL mac $STATIC_MAC;
                }
            }
            mac $IRB_MAC;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `filter` (`$INPUT_FILTER_V4`, `$INPUT_FILTER_V6`): required, for each reference; one of `firewall/filter-inet-mfc-dscp-forwarding-class`, `firewall/filter-inet6-mfc-traffic-class-forwarding-class`

## evo/interfaces/ifl-irb-inet-inet6-static-arp-ndp-mac.conf

```
/*
 * Topic: IRB unit with IPv4 and IPv6 addresses, a static ARP and NDP entry, and a fixed MAC address
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 166
 *   ag1_2_acx7100-32c 166
 *   total 332
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $IRB_UNIT       e.g. 351
 *   $DESCRIPTION    e.g. 5G-MIDHAUL-L3VPN-BD-IRB-1
 *   $AC_ADDR_V4     e.g. 10.31.1.1/24
 *   $STATIC_ARP_V4  e.g. 10.31.1.2
 *   $AC_IFL         e.g. ae26.351
 *   $STATIC_MAC     e.g. 00:99:00:00:00:01
 *   $AC_ADDR_V6     e.g. 2001:db8::1f00:11/112
 *   $STATIC_NDP_V6  e.g. 2001:db8::1f00:12
 *   $IRB_MAC        e.g. 00:00:00:00:00:01
 */
interfaces {
    irb {
        unit $IRB_UNIT {
            description $DESCRIPTION;
            family inet {
                address $AC_ADDR_V4 {
                    arp $STATIC_ARP_V4 l2-interface $AC_IFL mac $STATIC_MAC;
                }
            }
            family inet6 {
                address $AC_ADDR_V6 {
                    ndp $STATIC_NDP_V6 l2-interface $AC_IFL mac $STATIC_MAC;
                }
            }
            mac $IRB_MAC;
        }
    }
}
```

## evo/interfaces/ifl-irb-inet-inet6-virtual-gateway-filter.conf

```
/*
 * Topic: IRB unit with IPv4 and IPv6 input filters, addresses and virtual gateway addresses
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 84
 *   ag1_2_acx7100-32c 84
 *   total 168
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $IRB_UNIT         e.g. 267
 *   $DESCRIPTION      e.g. 5G-MIDHAUL-L3VPN-EVPN-IRB-167
 *   $INPUT_FILTER_V4  e.g. FF-MFC-IPV4-L3VPN-EVPN-IRB
 *   $AC_ADDR_V4       e.g. 10.21.167.3/24
 *   $VGA              e.g. 10.21.167.1
 *   $INPUT_FILTER_V6  e.g. FF-MFC-IPV6-L3VPN-EVPN-IRB
 *   $AC_ADDR_V6       e.g. 2001:db8::15a6:13/112
 *   $VGA_V6           e.g. 2001:db8::15a6:11
 */
interfaces {
    irb {
        unit $IRB_UNIT {
            description $DESCRIPTION;
            family inet {
                filter {
                    input $INPUT_FILTER_V4;
                }
                address $AC_ADDR_V4 {
                    virtual-gateway-address $VGA;
                }
            }
            family inet6 {
                filter {
                    input $INPUT_FILTER_V6;
                }
                address $AC_ADDR_V6 {
                    virtual-gateway-address $VGA_V6;
                }
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `filter` (`$INPUT_FILTER_V4`, `$INPUT_FILTER_V6`): required, for each reference; one of `firewall/filter-inet-mfc-dscp-forwarding-class`, `firewall/filter-inet6-mfc-traffic-class-forwarding-class`

## evo/interfaces/ifl-irb-inet-inet6-virtual-gateway.conf

```
/*
 * Topic: IRB unit with IPv4 and IPv6 addresses and virtual gateway addresses
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 166
 *   ag1_2_acx7100-32c 166
 *   total 332
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $IRB_UNIT     e.g. 101
 *   $DESCRIPTION  e.g. 5G-MIDHAUL-L3VPN-EVPN-IRB-1
 *   $AC_ADDR_V4   e.g. 10.21.1.3/24
 *   $VGA          e.g. 10.21.1.1
 *   $AC_ADDR_V6   e.g. 2001:db8::1500:13/112
 *   $VGA_V6       e.g. 2001:db8::1500:11
 */
interfaces {
    irb {
        unit $IRB_UNIT {
            description $DESCRIPTION;
            family inet {
                address $AC_ADDR_V4 {
                    virtual-gateway-address $VGA;
                }
            }
            family inet6 {
                address $AC_ADDR_V6 {
                    virtual-gateway-address $VGA_V6;
                }
            }
        }
    }
}
```

## evo/interfaces/ifl-loopback-primary-secondary-iso-inet6-mpls.conf

```
/*
 * Topic: Loopback unit 0 with primary and secondary IPv4 addresses, an ISO address, primary and secondary IPv6 addresses, and family mpls
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 7
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $LOOPBACK_V4_PFX      e.g. 192.168.1.3/32
 *   $LOOPBACK_ALT_V4_PFX  e.g. 192.168.10.3/32
 *   $ISIS_NET             e.g. 49.1022.1001.0000.0008.00
 *   $LOOPBACK_V6_PFX      e.g. 2001:db8::1:1:0:3/128
 *   $LOOPBACK_ALT_V6_PFX  e.g. 2001:db8::1:1:10:3/128
 */
interfaces {
    lo0 {
        unit 0 {
            family inet {
                address $LOOPBACK_V4_PFX {
                    primary;
                }
                address $LOOPBACK_ALT_V4_PFX;
            }
            family iso {
                address $ISIS_NET;
            }
            family inet6 {
                address $LOOPBACK_V6_PFX {
                    primary;
                }
                address $LOOPBACK_ALT_V6_PFX;
            }
            family mpls;
        }
    }
}
```

## evo/interfaces/ifl-vlan-bridge-description.conf

```
/*
 * Topic: VLAN unit with vlan-bridge encapsulation and a description
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   ag1_1_acx7509 750
 *   ag1_2_acx7100-32c 750
 *   an1_acx7100-48l 450
 *   an3_acx7100-48l 450
 *   an4_acx7024 150
 *   total 2550
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $IFD          e.g. ae26
 *   $UNIT         e.g. 351
 *   $DESCRIPTION  e.g. 5G-MIDHAUL-L3VPN-BD-IRB-1
 *   $VLAN         e.g. 351
 */
interfaces {
    $IFD {
        unit $UNIT {
            description $DESCRIPTION;
            encapsulation vlan-bridge;
            vlan-id $VLAN;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-ae-description-flexible-lacp-fast-system-id`, `interfaces/ifd-flexible-ethernet-services-description-speed-10g`, `interfaces/ifd-flexible-ethernet-services-description`
- `lag-member`: when the router's configuration has it, all related; one of `interfaces/ifd-lag-member-ether-speed-10g`, `interfaces/ifd-lag-member-ether`

## evo/interfaces/ifl-vlan-bridge-esi-all-active.conf

```
/*
 * Topic: VLAN unit with vlan-bridge encapsulation and an all-active ESI
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 300
 *   ag1_2_acx7100-32c 300
 *   total 600
 * Pair with: none
 * Peers with:
 *   [ag1_1_acx7509] <-> [ag1_2_acx7100-32c]
 * Variables (example values from ag1_1_acx7509):
 *   $IFD          e.g. ae26
 *   $UNIT         e.g. 1501
 *   $DESCRIPTION  e.g. 5G-FRONTHAUL-EVPN-ELAN-MH-1
 *   $VLAN         e.g. 1501
 *   $ESI          e.g. 00:88:11:11:11:11:11:00:00:00
 */
interfaces {
    $IFD {
        unit $UNIT {
            description $DESCRIPTION;
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-ae-description-flexible-lacp-fast-system-id`
- `lag-member`: when the router's configuration has it, all related; one of `interfaces/ifd-lag-member-ether-speed-10g`, `interfaces/ifd-lag-member-ether`

## evo/interfaces/ifl-vlan-ccc-description.conf

```
/*
 * Topic: VLAN unit with vlan-ccc encapsulation and a description
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   ag1_1_acx7509 250
 *   ag1_2_acx7100-32c 150
 *   an1_acx7100-48l 100
 *   an3_acx7100-48l 100
 *   an4_acx7024 500
 *   total 1100
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $IFD          e.g. et-1/0/1
 *   $UNIT         e.g. 2501
 *   $DESCRIPTION  e.g. 5G-FRONTHAUL-EVPN-FXC-SH-TO-AN4-1
 *   $VLAN         e.g. 2501
 */
interfaces {
    $IFD {
        unit $UNIT {
            description $DESCRIPTION;
            encapsulation vlan-ccc;
            vlan-id $VLAN;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-flexible-ethernet-services-description-speed-10g`, `interfaces/ifd-flexible-ethernet-services-description`

## evo/interfaces/ifl-vlan-ccc-esi-all-active-filter.conf

```
/*
 * Topic: VLAN unit with vlan-ccc encapsulation, an all-active ESI and a family ccc input filter
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 300
 *   ag1_2_acx7100-32c 300
 *   total 600
 * Pair with: none
 * Peers with:
 *   [ag1_1_acx7509] <-> [ag1_2_acx7100-32c]
 * Variables (example values from ag1_1_acx7509):
 *   $IFD           e.g. ae26
 *   $UNIT          e.g. 901
 *   $DESCRIPTION   e.g. FRONTHAUL-EVPN-VPWS-MH-AN1-1
 *   $VLAN          e.g. 901
 *   $ESI           e.g. 00:33:11:11:11:11:11:00:00:00
 *   $INPUT_FILTER  e.g. FF-MF-EVPN-VPWS-MH-TO-AN1
 */
interfaces {
    $IFD {
        unit $UNIT {
            description $DESCRIPTION;
            encapsulation vlan-ccc;
            vlan-id $VLAN;
            esi {
                $ESI;
                all-active;
            }
            family ccc {
                filter {
                    input $INPUT_FILTER;
                }
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-ae-description-flexible-lacp-fast-system-id`
- `lag-member`: when the router's configuration has it, all related; one of `interfaces/ifd-lag-member-ether-speed-10g`, `interfaces/ifd-lag-member-ether`
- `filter` (`$INPUT_FILTER`): required, for each reference; one of `firewall/filter-ccc-mf-evpn-vpws-mh-to-an1`, `firewall/filter-ccc-mf-evpn-vpws-mh-to-an3`, `firewall/filter-ccc-mf-evpn-vpws-mh-to-an4`

## evo/interfaces/ifl-vlan-ccc-esi-all-active.conf

```
/*
 * Topic: VLAN unit with vlan-ccc encapsulation and an all-active ESI
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 300
 *   ag1_2_acx7100-32c 300
 *   total 600
 * Pair with: none
 * Peers with:
 *   [ag1_1_acx7509] <-> [ag1_2_acx7100-32c]
 * Variables (example values from ag1_1_acx7509):
 *   $IFD          e.g. ae26
 *   $UNIT         e.g. 2601
 *   $DESCRIPTION  e.g. 5G-FRONTHAUL-EVPN-FXC-MH-1
 *   $VLAN         e.g. 2601
 *   $ESI          e.g. 00:44:11:11:11:11:11:00:00:00
 */
interfaces {
    $IFD {
        unit $UNIT {
            description $DESCRIPTION;
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-ae-description-flexible-lacp-fast-system-id`
- `lag-member`: when the router's configuration has it, all related; one of `interfaces/ifd-lag-member-ether-speed-10g`, `interfaces/ifd-lag-member-ether`

## evo/interfaces/ifl-vlan-ccc-family-ccc.conf

```
/*
 * Topic: Single-tagged cross-connect logical interface
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   ag1_1_acx7509 1000
 *   ag1_2_acx7100-32c 1000
 *   an1_acx7100-48l 200
 *   an3_acx7100-48l 200
 *   an4_acx7024 100
 *   total 2500
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $IFD   e.g. et-1/0/1
 *   $UNIT  e.g. 1501
 *   $VLAN  e.g. 1501
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-ccc;
            vlan-id $VLAN;
            family ccc;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-flexible-ethernet-services-description-speed-10g`, `interfaces/ifd-flexible-ethernet-services-description`

## evo/interfaces/ifl-vlan-ccc-filter.conf

```
/*
 * Topic: VLAN unit with vlan-ccc encapsulation and a family ccc input filter
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   an1_acx7100-48l 100
 *   an3_acx7100-48l 100
 *   an4_acx7024 100
 *   total 300
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from an1_acx7100-48l):
 *   $IFD           e.g. et-0/0/2
 *   $UNIT          e.g. 1101
 *   $DESCRIPTION   e.g. FRONTHAUL-EVPN-VPWS-MH-1
 *   $VLAN          e.g. 1101
 *   $INPUT_FILTER  e.g. FF-MF-EVPN-VPWS-MH
 */
interfaces {
    $IFD {
        unit $UNIT {
            description $DESCRIPTION;
            encapsulation vlan-ccc;
            vlan-id $VLAN;
            family ccc {
                filter {
                    input $INPUT_FILTER;
                }
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-flexible-ethernet-services-description`
- `filter` (`$INPUT_FILTER`): required, for each reference; one of `firewall/filter-ccc-mf-evpn-vpws-mh-an1`, `firewall/filter-ccc-mf-evpn-vpws-mh-an3`, `firewall/filter-ccc-mf-evpn-vpws-mh-an4`

## evo/interfaces/ifl-vlan-inet-inet6-description.conf

```
/*
 * Topic: VLAN unit with a description and IPv4 and IPv6 addresses
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   ag1_1_acx7509 100
 *   ag1_2_acx7100-32c 100
 *   an1_acx7100-48l 100
 *   an3_acx7100-48l 100
 *   an4_acx7024 100
 *   total 500
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $IFD          e.g. et-1/0/1
 *   $UNIT         e.g. 1
 *   $DESCRIPTION  e.g. To-RT3-L3-MBH-AND-5G-FRONTHAUL-L3VPN-1
 *   $VLAN         e.g. 1
 *   $AC_ADDR_V4   e.g. 10.16.7.205/30
 *   $AC_ADDR_V6   e.g. 2001:db8::16:1:7:7cd/112
 */
interfaces {
    $IFD {
        unit $UNIT {
            description $DESCRIPTION;
            vlan-id $VLAN;
            family inet {
                address $AC_ADDR_V4;
            }
            family inet6 {
                address $AC_ADDR_V6;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-flexible-ethernet-services-description-speed-10g`, `interfaces/ifd-flexible-ethernet-services-description`

## evo/interfaces/ifl-vlan-inet.conf

```
/*
 * Topic: Single-tagged routed logical interface carrying an IPv4 customer address
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an4_acx7024
 * Count:
 *   ag1_1_acx7509 2
 *   ag1_2_acx7100-32c 2
 *   an4_acx7024 2
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $IFD         e.g. et-1/0/1
 *   $UNIT        e.g. 3801
 *   $VLAN        e.g. 3801
 *   $AC_ADDR_V4  e.g. 10.92.1.1/24
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-flexible-ethernet-services-description-speed-10g`, `interfaces/ifd-flexible-ethernet-services-description`, `interfaces/ifd-flexible-ethernet-services-speed-10g`, `interfaces/ifd-flexible-ethernet`

## evo/policy-options/community/community-fronthaul.conf

```
/*
 * Topic: FRONTHAUL community
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    community FRONTHAUL members 65535:200;
}
```

## evo/policy-options/community/community-service-edge.conf

```
/*
 * Topic: SERVICE-EDGE community
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    community SERVICE-EDGE members 63536:100;
}
```

## evo/policy-options/community/community-xhaul.conf

```
/*
 * Topic: xHAUL community
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    community xHAUL members 65535:100;
}
```

## evo/policy-options/policy-statement/per-packet-load-balance.conf

```
/*
 * Topic: Per-packet load-balance policy (pplb) — exported to the forwarding table so ECMP paths are used per-flow.
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 7
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $PPLB_NAME  e.g. PPLB
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

## evo/policy-options/policy-statement/ps-as-in-sag-allow.conf

```
/*
 * Topic: Inter-AS import policy accepting only SERVICE-EDGE routes
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 2
 * Pair with:
 *  - evo/policy-options/community/community-service-edge.conf
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement as63536-in {
        term SAG-ALLOW {
            from community SERVICE-EDGE;
            then accept;
        }
        term reject {
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-as-out-loop-prevent.conf

```
/*
 * Topic: Inter-AS export policy rejecting FRONTHAUL routes and setting next-hop self on SERVICE-EDGE routes
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 2
 * Pair with:
 *  - evo/policy-options/community/community-fronthaul.conf
 *  - evo/policy-options/community/community-service-edge.conf
 *  - evo/policy-options/community/community-xhaul.conf
 *  - evo/policy-options/prefix-list/prefix-list-mbh-region.conf
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement as3536-out {
        term LOOP_PREVENT {
            from community FRONTHAUL;
            then reject;
        }
        term FROM-SAG {
            from community SERVICE-EDGE;
            then {
                next-hop self;
                accept;
            }
        }
        term loopbacks {
            from {
                prefix-list MBH-REGION;
            }
            then {
                community add xHAUL;
                accept;
            }
        }
        term REJECT {
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-bgp-export-reject-inet3.conf

```
/*
 * Topic: BGP export policy rejecting routes from inet.3
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement bgp-export {
        term 1 {
            from rib inet.3;
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-do-not-readvertise-evpn-routes.conf

```
/*
 * Topic: Policy rejecting BGP-learned EVPN routes
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement DO-NOT-READVERTISE-EVPN-ROUTES {
        term 1 {
            from {
                family evpn;
                protocol bgp;
            }
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-loc-pref.conf

```
/*
 * Topic: Policy setting local preference 200
 * Seen on:
 *   Junos: (none)
 *   EVO: an4_acx7024
 * Count:
 *   an4_acx7024 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement LOC-PREF {
        term 1 {
            then {
                local-preference 200;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-loopback-allow.conf

```
/*
 * Topic: Single-term policy accepting a prefix and its more-specifics
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 7
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $POLICY_NAME  e.g. ALLOW_LOOPBACK
 *   $PREFIX       e.g. 0.0.0.0/32
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

## evo/policy-options/policy-statement/ps-next-hop-self.conf

```
/*
 * Topic: Next-hop-self acceptance policy
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
  policy-statement next-hop-self {
    then {
      next-hop self;
      accept;
    }
  }
}
```

## evo/policy-options/policy-statement/ps-nhs-commu-out-load-balance-per-packet.conf

```
/*
 * Topic: Next-hop-self policy with per-packet load balancing that adds the FRONTHAUL community and accepts BGP EVPN routes unchanged
 * Seen on:
 *   Junos: (none)
 *   EVO: an3_acx7100-48l
 * Count:
 *   an3_acx7100-48l 1
 *   total 1
 * Pair with:
 *  - evo/policy-options/community/community-fronthaul.conf
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement nhs_commu_out {
        term SET-REGION {
            then {
                community add FRONTHAUL;
                next term;
            }
        }
        term term2 {
            from {
                family evpn;
                protocol bgp;
            }
            then accept;
        }
        term nhs {
            then {
                next-hop self;
                load-balance per-packet;
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-nhs-commu-out.conf

```
/*
 * Topic: Next-hop-self policy that adds the FRONTHAUL community and accepts BGP EVPN routes unchanged
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7100-48l an4_acx7024
 * Count:
 *   an1_acx7100-48l 1
 *   an4_acx7024 1
 *   total 2
 * Pair with:
 *  - evo/policy-options/community/community-fronthaul.conf
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement nhs_commu_out {
        term SET-REGION {
            then {
                community add FRONTHAUL;
                next term;
            }
        }
        term term2 {
            from {
                family evpn;
                protocol bgp;
            }
            then accept;
        }
        term nhs {
            then {
                next-hop self;
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-nhs-evpn-accept.conf

```
/*
 * Topic: Next-hop-self policy that accepts BGP EVPN routes unchanged
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement nhs {
        term 1 {
            from {
                family evpn;
                protocol bgp;
            }
            then accept;
        }
        term nhs {
            then {
                next-hop self;
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-ospf-summary-reject.conf

```
/*
 * Topic: Policy accepting one prefix and longer, rejecting everything else
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $PREFIX  e.g. 192.168.1.5/32
 */
policy-options {
    policy-statement ospf_summary_reject {
        term t1 {
            from {
                route-filter $PREFIX orlonger;
            }
            then accept;
        }
        term t2 {
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-sr-nonzero-loopback-v4.conf

```
/*
 * Topic: Policy SR_NONZERO_LOOPBACKS_V4 attaching a prefix segment to the IPv4 SR loopback
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 7
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $LOOPBACK_SR_V4  e.g. 192.168.10.3
 *   $SR_INDEX_V4     e.g. 208
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
 * Topic: Policy SR_NONZERO_LOOPBACKS_V6 attaching a prefix segment to the IPv6 SR loopback
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 7
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $LOOPBACK_SR_V6  e.g. 2001:db8::1:1:10:3
 *   $SR_INDEX_V6     e.g. 308
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

## evo/policy-options/prefix-list/prefix-list-mbh-region.conf

```
/*
 * Topic: MBH-REGION prefix list of three loopback addresses
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    prefix-list MBH-REGION {
        192.168.1.9/32;
        192.168.1.10/32;
        192.168.1.11/32;
    }
}
```

## evo/protocols/bgp-advertise-from-main-vpn-tables-log-updown-multipath.conf

```
/*
 * Topic: BGP global settings: advertise-from-main-vpn-tables, log-updown and multipath
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509
 * Count:
 *   ag1_1_acx7509 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
protocols {
    bgp {
        advertise-from-main-vpn-tables;
        log-updown;
        multipath;
    }
}
```

## evo/protocols/bgp-advertise-from-main-vpn-tables-vpn-apply-export-log-updown-multipath.conf

```
/*
 * Topic: BGP global settings: advertise-from-main-vpn-tables, vpn-apply-export, log-updown and multipath
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_2_acx7100-32c
 * Count:
 *   ag1_2_acx7100-32c 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
protocols {
    bgp {
        advertise-from-main-vpn-tables;
        vpn-apply-export;
        log-updown;
        multipath;
    }
}
```

## evo/protocols/bgp-family-inet-unicast-log-updown-multipath.conf

```
/*
 * Topic: BGP global settings: family inet unicast, log-updown and multipath
 * Seen on:
 *   Junos: (none)
 *   EVO: cr2_ptx10001-36mr
 * Count:
 *   cr2_ptx10001-36mr 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
protocols {
    bgp {
        family inet {
            unicast;
        }
        log-updown;
        multipath;
    }
}
```

## evo/protocols/bgp-group-ebgp-lu-route-target-import-export-1-peer.conf

```
/*
 * Topic: eBGP group with one peer for labeled unicast and route-target families, import as63536-in, export next-hop-self and bgp-export
 * Seen on:
 *   Junos: (none)
 *   EVO: cr2_ptx10001-36mr
 * Count:
 *   cr2_ptx10001-36mr 1
 *   total 1
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-as-in-sag-allow.conf
 *  - evo/policy-options/policy-statement/ps-bgp-export-reject-inet3.conf
 *  - evo/policy-options/policy-statement/ps-next-hop-self.conf
 *  - evo/routing-options/rib-groups-inet3-to-inet0-inet6-3.conf
 *
 * Peers with:
 *   [cr2_ptx10001-36mr] <-> [sag_mx304]
 * Variables (example values from cr2_ptx10001-36mr):
 *   $BGP_GROUP         e.g. ebgp_sag
 *   $ASN_INTER_AS      e.g. 63536
 *   $INTER_AS_PEER_V4  e.g. 10.10.0.54
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type external;
            import as63536-in;
            family inet {
                labeled-unicast {
                    rib-group inet3-to-inet0;
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
            family route-target;
            export [ next-hop-self bgp-export ];
            peer-as $ASN_INTER_AS;
            neighbor $INTER_AS_PEER_V4;
        }
    }
}
```

## evo/protocols/bgp-group-ebgp-multihop-lu-route-target-import-export-1-peer.conf

```
/*
 * Topic: Multihop eBGP group with one peer for labeled unicast and route-target families, import as63536-in, export next-hop-self and bgp-export
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10001-36mr
 * Count:
 *   cr1_ptx10001-36mr 1
 *   total 1
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-as-in-sag-allow.conf
 *  - evo/policy-options/policy-statement/ps-bgp-export-reject-inet3.conf
 *  - evo/policy-options/policy-statement/ps-next-hop-self.conf
 *  - evo/routing-options/rib-groups-inet3-to-inet0-inet6-3.conf
 *
 * Variables (example values from cr1_ptx10001-36mr):
 *   $BGP_GROUP         e.g. ebgp_sag
 *   $ASN_INTER_AS      e.g. 63536
 *   $INTER_AS_PEER_V4  e.g. 10.10.0.50
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type external;
            multihop;
            import as63536-in;
            family inet {
                labeled-unicast {
                    rib-group inet3-to-inet0;
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
            family route-target;
            export [ next-hop-self bgp-export ];
            peer-as $ASN_INTER_AS;
            neighbor $INTER_AS_PEER_V4;
        }
    }
}
```

## evo/protocols/bgp-group-ebgp-multihop-vpn-evpn-1-peer.conf

```
/*
 * Topic: Multihop eBGP group (no-nexthop-change) with one peer for VPN, L2VPN, EVPN and route-target families, exporting nhs
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_2_acx7100-32c
 * Count:
 *   ag1_2_acx7100-32c 1
 *   total 1
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-nhs-evpn-accept.conf
 *
 * Variables (example values from ag1_2_acx7100-32c):
 *   $BGP_GROUP         e.g. ebgp_sag_mpbgp
 *   $LOOPBACK_V4       e.g. 192.168.1.4
 *   $ASN_INTER_AS      e.g. 63536
 *   $INTER_AS_PEER_V4  e.g. 192.168.1.11
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type external;
            multihop {
                no-nexthop-change;
            }
            local-address $LOOPBACK_V4;
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
            family route-target;
            export nhs;
            peer-as $ASN_INTER_AS;
            neighbor $INTER_AS_PEER_V4;
        }
    }
}
```

## evo/protocols/bgp-group-ebgp-multihop-vpn-evpn-vpn-apply-export-1-peer.conf

```
/*
 * Topic: Multihop eBGP group (no-nexthop-change) with one peer for VPN, L2VPN, EVPN and route-target families, exporting nhs, with vpn-apply-export
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509
 * Count:
 *   ag1_1_acx7509 1
 *   total 1
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-nhs-evpn-accept.conf
 *
 * Variables (example values from ag1_1_acx7509):
 *   $BGP_GROUP         e.g. ebgp_sag_mpbgp
 *   $LOOPBACK_V4       e.g. 192.168.1.3
 *   $ASN_INTER_AS      e.g. 63536
 *   $INTER_AS_PEER_V4  e.g. 192.168.1.11
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type external;
            multihop {
                no-nexthop-change;
            }
            local-address $LOOPBACK_V4;
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
            family route-target;
            export nhs;
            peer-as $ASN_INTER_AS;
            neighbor $INTER_AS_PEER_V4;
            vpn-apply-export;
        }
    }
}
```

## evo/protocols/bgp-group-ibgp-evpn-route-target-1-peer.conf

```
/*
 * Topic: iBGP group with one peer for EVPN and route-target families
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   total 2
 * Pair with: none
 * Peers with:
 *   [ag1_1_acx7509] <-> [ag1_2_acx7100-32c]
 * Variables (example values from ag1_1_acx7509):
 *   $BGP_GROUP     e.g. ibgp_pag
 *   $LOOPBACK_V4   e.g. 192.168.1.3
 *   $IBGP_PEER_V4  e.g. 192.168.1.4
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type internal;
            local-address $LOOPBACK_V4;
            family evpn {
                signaling;
            }
            family route-target;
            neighbor $IBGP_PEER_V4;
        }
    }
}
```

## evo/protocols/bgp-group-ibgp-lu-export-next-hop-self-1-peer.conf

```
/*
 * Topic: iBGP group with one peer for IPv4 and IPv6 labeled unicast, exporting next-hop-self
 * Seen on:
 *   Junos: (none)
 *   EVO: cr2_ptx10001-36mr
 * Count:
 *   cr2_ptx10001-36mr 1
 *   total 1
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-next-hop-self.conf
 *  - evo/routing-options/rib-groups-inet3-to-inet0-inet6-3.conf
 *
 * Peers with:
 *   [cr1_ptx10001-36mr] <-> [cr2_ptx10001-36mr]
 * Variables (example values from cr2_ptx10001-36mr):
 *   $BGP_GROUP     e.g. ibgp_cr
 *   $LOOPBACK_V4   e.g. 192.168.1.10
 *   $IBGP_PEER_V4  e.g. 192.168.1.9
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
                    rib-group inet3-to-inet0;
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
            export next-hop-self;
            neighbor $IBGP_PEER_V4;
        }
    }
}
```

## evo/protocols/bgp-group-ibgp-lu-export-next-hop-self-2-peers.conf

```
/*
 * Topic: iBGP group with two peers for IPv4 and IPv6 labeled unicast, exporting next-hop-self
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   total 2
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-next-hop-self.conf
 *
 * Peers with:
 *   [ag1_1_acx7509] <-> [cr1_ptx10001-36mr]
 *   [ag1_1_acx7509] <-> [cr2_ptx10001-36mr]
 *   [ag1_2_acx7100-32c] <-> [cr1_ptx10001-36mr]
 *   [ag1_2_acx7100-32c] <-> [cr2_ptx10001-36mr]
 * Variables (example values from ag1_1_acx7509):
 *   $BGP_GROUP    e.g. ibgp_meg
 *   $LOOPBACK_V4  e.g. 192.168.1.3
 *   $RR1_V4       e.g. 192.168.1.9
 *   $RR2_V4       e.g. 192.168.1.10
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
                    rib-group inet3-to-inet0;
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
            export next-hop-self;
            neighbor $RR1_V4;
            neighbor $RR2_V4;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `rib-group` (`inet3-to-inet0`): required, for each reference; one of `routing-options/rib-groups-inet3-to-inet0-inet6-3`, `routing-options/rib-groups-inet3-to-inet0`

## evo/protocols/bgp-group-ibgp-lu-inet-unicast-export-next-hop-self-1-peer.conf

```
/*
 * Topic: iBGP group with one peer for IPv4 labeled unicast and unicast and IPv6 labeled unicast, exporting next-hop-self
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10001-36mr
 * Count:
 *   cr1_ptx10001-36mr 1
 *   total 1
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-next-hop-self.conf
 *  - evo/routing-options/rib-groups-inet3-to-inet0-inet6-3.conf
 *
 * Peers with:
 *   [cr1_ptx10001-36mr] <-> [cr2_ptx10001-36mr]
 * Variables (example values from cr1_ptx10001-36mr):
 *   $BGP_GROUP     e.g. ibgp_cr
 *   $LOOPBACK_V4   e.g. 192.168.1.9
 *   $IBGP_PEER_V4  e.g. 192.168.1.10
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
                    rib-group inet3-to-inet0;
                    rib {
                        inet.3;
                    }
                }
                unicast;
            }
            family inet6 {
                labeled-unicast {
                    rib {
                        inet6.3;
                    }
                }
            }
            export next-hop-self;
            neighbor $IBGP_PEER_V4;
        }
    }
}
```

## evo/protocols/bgp-group-ibgp-lu-vpn-evpn-export-nhs-commu-out-2-peers.conf

```
/*
 * Topic: iBGP group with two peers for labeled unicast, VPN, L2VPN, EVPN and route-target families, exporting nhs_commu_out
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   total 3
 * Pair with:
 *  - evo/routing-options/rib-groups-inet3-to-inet0.conf
 *
 * Peers with:
 *   [ag1_1_acx7509] <-> [an1_acx7100-48l]
 *   [ag1_1_acx7509] <-> [an3_acx7100-48l]
 *   [ag1_1_acx7509] <-> [an4_acx7024]
 *   [ag1_2_acx7100-32c] <-> [an1_acx7100-48l]
 *   [ag1_2_acx7100-32c] <-> [an3_acx7100-48l]
 *   [ag1_2_acx7100-32c] <-> [an4_acx7024]
 * Variables (example values from an1_acx7100-48l):
 *   $BGP_GROUP    e.g. ibgp_pag
 *   $LOOPBACK_V4  e.g. 192.168.1.1
 *   $RR1_V4       e.g. 192.168.1.3
 *   $RR2_V4       e.g. 192.168.1.4
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
                    rib-group inet3-to-inet0;
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
            family l2vpn {
                signaling;
            }
            family evpn {
                signaling;
            }
            family route-target;
            export nhs_commu_out;
            neighbor $RR1_V4;
            neighbor $RR2_V4;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`nhs_commu_out`): required, for each reference; one of `policy-options/policy-statement/ps-nhs-commu-out-load-balance-per-packet`, `policy-options/policy-statement/ps-nhs-commu-out`

## evo/protocols/bgp-group-ibgp-rr-lu-export-as-out-2-peers.conf

```
/*
 * Topic: iBGP route-reflector group with two peers for IPv4 and IPv6 labeled unicast, exporting as3536-out
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 2
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-as-out-loop-prevent.conf
 *  - evo/routing-options/rib-groups-inet3-to-inet0-inet6-3.conf
 *
 * Peers with:
 *   [ag1_1_acx7509] <-> [cr1_ptx10001-36mr]
 *   [ag1_1_acx7509] <-> [cr2_ptx10001-36mr]
 *   [ag1_2_acx7100-32c] <-> [cr1_ptx10001-36mr]
 *   [ag1_2_acx7100-32c] <-> [cr2_ptx10001-36mr]
 * Variables (example values from cr1_ptx10001-36mr):
 *   $BGP_GROUP       e.g. ibgp_meg_rr
 *   $LOOPBACK_V4     e.g. 192.168.1.9
 *   $CLUSTER_ID      e.g. 192.168.1.9
 *   $IBGP_PEER_V4_1  e.g. 192.168.1.3
 *   $IBGP_PEER_V4_2  e.g. 192.168.1.4
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
                    rib-group inet3-to-inet0;
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
            export as3536-out;
            cluster $CLUSTER_ID;
            neighbor $IBGP_PEER_V4_1;
            neighbor $IBGP_PEER_V4_2;
        }
    }
}
```

## evo/protocols/bgp-group-ibgp-rr-lu-vpn-evpn-3-peers.conf

```
/*
 * Topic: iBGP route-reflector group with three peers for labeled unicast, VPN, L2VPN, EVPN and route-target families, exporting nhs
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_2_acx7100-32c
 * Count:
 *   ag1_2_acx7100-32c 1
 *   total 1
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-nhs-evpn-accept.conf
 *  - evo/routing-options/rib-groups-inet3-to-inet0-inet6-3.conf
 *
 * Peers with:
 *   [ag1_2_acx7100-32c] <-> [an1_acx7100-48l]
 *   [ag1_2_acx7100-32c] <-> [an3_acx7100-48l]
 *   [ag1_2_acx7100-32c] <-> [an4_acx7024]
 * Variables (example values from ag1_2_acx7100-32c):
 *   $BGP_GROUP       e.g. ibgp_pag_rr
 *   $LOOPBACK_V4     e.g. 192.168.1.4
 *   $CLUSTER_ID      e.g. 192.168.1.4
 *   $IBGP_PEER_V4_1  e.g. 192.168.1.0
 *   $IBGP_PEER_V4_2  e.g. 192.168.1.1
 *   $IBGP_PEER_V4_3  e.g. 192.168.1.2
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
                    rib-group inet3-to-inet0;
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
            family l2vpn {
                signaling;
            }
            family evpn {
                signaling;
            }
            family route-target;
            export nhs;
            cluster $CLUSTER_ID;
            neighbor $IBGP_PEER_V4_1;
            neighbor $IBGP_PEER_V4_2;
            neighbor $IBGP_PEER_V4_3;
        }
    }
}
```

## evo/protocols/bgp-group-ibgp-rr-lu-vpn-evpn-vpn-apply-export-3-peers.conf

```
/*
 * Topic: iBGP route-reflector group with three peers for labeled unicast, VPN, L2VPN, EVPN and route-target families, exporting nhs, with vpn-apply-export
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509
 * Count:
 *   ag1_1_acx7509 1
 *   total 1
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-nhs-evpn-accept.conf
 *  - evo/routing-options/rib-groups-inet3-to-inet0.conf
 *
 * Peers with:
 *   [ag1_1_acx7509] <-> [an1_acx7100-48l]
 *   [ag1_1_acx7509] <-> [an3_acx7100-48l]
 *   [ag1_1_acx7509] <-> [an4_acx7024]
 * Variables (example values from ag1_1_acx7509):
 *   $BGP_GROUP       e.g. ibgp_pag_rr
 *   $LOOPBACK_V4     e.g. 192.168.1.3
 *   $CLUSTER_ID      e.g. 192.168.1.3
 *   $IBGP_PEER_V4_1  e.g. 192.168.1.0
 *   $IBGP_PEER_V4_2  e.g. 192.168.1.1
 *   $IBGP_PEER_V4_3  e.g. 192.168.1.2
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
                    rib-group inet3-to-inet0;
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
            family l2vpn {
                signaling;
            }
            family evpn {
                signaling;
            }
            family route-target;
            export nhs;
            cluster $CLUSTER_ID;
            neighbor $IBGP_PEER_V4_1;
            neighbor $IBGP_PEER_V4_2;
            neighbor $IBGP_PEER_V4_3;
            vpn-apply-export;
        }
    }
}
```

## evo/protocols/bgp-log-updown-multipath.conf

```
/*
 * Topic: BGP global settings: log-updown and multipath
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr
 * Count:
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   cr1_ptx10001-36mr 1
 *   total 4
 * Pair with: none
 * Variables: none
 */
protocols {
    bgp {
        log-updown;
        multipath;
    }
}
```

## evo/protocols/isis-ignore-attached-bit.conf

```
/*
 * Topic: IS-IS ignores the attached bit
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 4
 * Pair with: none
 * Variables: none
 */
protocols {
    isis {
        ignore-attached-bit;
    }
}
```

## evo/protocols/isis-interface-l1-node-protection-l2-disable-p2p-bfd.conf

```
/*
 * Topic: IS-IS point-to-point core interface at Level 1 only, with node-protecting post-convergence LFA, metric 10 and BFD
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 3
 *   ag1_2_acx7100-32c 3
 *   total 6
 * Pair with: none
 * Variables (example values from ag1_1_acx7509):
 *   $CORE_INTF  e.g. ae19.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                metric 10;
            }
            level 2 disable;
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$CORE_INTF`): required, for each reference; `interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-5`

## evo/protocols/isis-interface-l1-node-protection-p2p-bfd.conf

```
/*
 * Topic: IS-IS point-to-point core interface at Level 1 with node-protecting post-convergence LFA, metric 10 and BFD
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   an1_acx7100-48l 2
 *   an3_acx7100-48l 3
 *   an4_acx7024 4
 *   total 9
 * Pair with: none
 * Variables (example values from an1_acx7100-48l):
 *   $CORE_INTF  e.g. ae19.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                metric 10;
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
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$CORE_INTF`): required, for each reference; `interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-5`

## evo/protocols/isis-interface-l2-node-protection-l1-disable-p2p-bfd.conf

```
/*
 * Topic: IS-IS point-to-point core interface at Level 2 only, with node-protecting post-convergence LFA, metric 10 and BFD
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   cr1_ptx10001-36mr 3
 *   cr2_ptx10001-36mr 3
 *   total 8
 * Pair with: none
 * Variables (example values from ag1_1_acx7509):
 *   $CORE_INTF  e.g. ae5.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 2 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                metric 10;
            }
            level 1 disable;
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$CORE_INTF`): required, for each reference; `interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-5`

## evo/protocols/isis-interface-l2-node-protection-p2p-bfd.conf

```
/*
 * Topic: IS-IS point-to-point core interface at Level 2 with node-protecting post-convergence LFA, metric 10 and BFD
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   total 2
 * Pair with: none
 * Variables (example values from ag1_1_acx7509):
 *   $CORE_INTF  e.g. ae4.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 2 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                metric 10;
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
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$CORE_INTF`): required, for each reference; `interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-5`

## evo/protocols/isis-interface-p2p-bfd.conf

```
/*
 * Topic: IS-IS point-to-point core interface with BFD
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7100-48l
 * Count:
 *   an1_acx7100-48l 1
 *   total 1
 * Pair with: none
 * Variables (example values from an1_acx7100-48l):
 *   $CORE_INTF  e.g. et-0/0/49.0
 */
protocols {
    isis {
        interface $CORE_INTF {
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$CORE_INTF`): required, for each reference; `interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-5`

## evo/protocols/isis-level-1-wide-metrics-only.conf

```
/*
 * Topic: IS-IS Level 1 with wide metrics only
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
protocols {
    isis {
        level 1 wide-metrics-only;
    }
}
```

## evo/protocols/isis-level-2-disable.conf

```
/*
 * Topic: IS-IS Level 2 disabled
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   total 3
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
protocols {
    isis {
        level 2 disable;
    }
}
```

## evo/protocols/isis-level-2-wide-metrics-only.conf

```
/*
 * Topic: IS-IS Level 2 with wide metrics only
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
protocols {
    isis {
        level 2 wide-metrics-only;
    }
}
```

## evo/protocols/isis-loopback-passive.conf

```
/*
 * Topic: IS-IS logical interface
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 7
 * Pair with:
 *  - evo/interfaces/ifl-loopback-primary-secondary-iso-inet6-mpls.conf
 *
 * Peers with: n/a
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

## evo/protocols/isis-sr-node-segment-spf-ti-lfa-export.conf

```
/*
 * Topic: IS-IS segment routing (SRGB, node SIDs, explicit null), SPF timers, TI-LFA backup and loopback export
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 7
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-sr-nonzero-loopback-v4.conf
 *  - evo/policy-options/policy-statement/ps-sr-nonzero-loopback-v6.conf
 *
 * Variables (example values from ag1_1_acx7509):
 *   $SR_INDEX_V4  e.g. 8
 *   $SR_INDEX_V6  e.g. 108
 */
protocols {
    isis {
        source-packet-routing {
            srgb start-label 16000 index-range 80000;
            node-segment {
                ipv4-index $SR_INDEX_V4;
                ipv6-index $SR_INDEX_V6;
            }
            explicit-null;
        }
        spf-options {
            delay 100;
            rapid-runs 5;
        }
        backup-spf-options {
            use-post-convergence-lfa maximum-labels 5;
            use-source-packet-routing;
        }
        export [ SR_NONZERO_LOOPBACKS_V4 SR_NONZERO_LOOPBACKS_V6 ];
    }
}
```

## evo/protocols/l2-learning-global-mac-table-aging-time.conf

```
/*
 * Topic: Global MAC table aging time
 * Seen on:
 *   Junos: (none)
 *   EVO: an4_acx7024
 * Count:
 *   an4_acx7024 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
protocols {
    l2-learning {
        global-mac-table-aging-time 10000;
    }
}
```

## evo/protocols/l2circuit-control-word-flow-label-static.conf

```
/*
 * Topic: Layer 2 circuit to a remote PE with control word, static flow-label transmit and receive, and pseudowire status TLV
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 1000
 *   ag1_2_acx7100-32c 1000
 *   total 2000
 * Pair with: none
 * Peers with:
 *   [ag1_1_acx7509] <-> [sag_mx304]
 *   [ag1_2_acx7100-32c] <-> [sag_mx304]
 * Variables (example values from ag1_1_acx7509):
 *   $REMOTE_PE_V4  e.g. 192.168.1.11
 *   $AC_IFL        e.g. et-1/0/1.1501
 *   $VC_ID         e.g. 1501
 */
protocols {
    l2circuit {
        neighbor $REMOTE_PE_V4 {
            interface $AC_IFL {
                virtual-circuit-id $VC_ID;
                control-word;
                flow-label-transmit-static;
                flow-label-receive-static;
                encapsulation-type ethernet-vlan;
                ignore-mtu-mismatch;
                pseudowire-status-tlv;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`): required, for each reference; `interfaces/ifl-vlan-ccc-family-ccc`

## evo/protocols/l2circuit-control-word.conf

```
/*
 * Topic: Layer 2 circuit to a remote PE with control word and pseudowire status TLV
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   an1_acx7100-48l 200
 *   an3_acx7100-48l 200
 *   an4_acx7024 100
 *   total 500
 * Pair with: none
 * Peers with:
 *   [an1_acx7100-48l] <-> [sag_mx304]
 *   [an3_acx7100-48l] <-> [sag_mx304]
 *   [an4_acx7024] <-> [sag_mx304]
 * Variables (example values from an1_acx7100-48l):
 *   $REMOTE_PE_V4  e.g. 192.168.1.11
 *   $AC_IFL        e.g. et-0/0/2.1301
 *   $VC_ID         e.g. 1301
 */
protocols {
    l2circuit {
        neighbor $REMOTE_PE_V4 {
            interface $AC_IFL {
                virtual-circuit-id $VC_ID;
                control-word;
                encapsulation-type ethernet-vlan;
                ignore-mtu-mismatch;
                pseudowire-status-tlv;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`): required, for each reference; `interfaces/ifl-vlan-ccc-family-ccc`

## evo/protocols/ldp-loopback.conf

```
/*
 * Topic: LDP loopback interface
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   total 5
 * Pair with:
 *  - evo/interfaces/ifl-loopback-primary-secondary-iso-inet6-mpls.conf
 *
 * Peers with: n/a
 * Variables: none
 */
protocols {
  ldp {
    interface lo0.0;
  }
}
```

## evo/protocols/mpls-pccd-ipv6-tunneling-loopback-3-core.conf

```
/*
 * Topic: MPLS with a PCEP external controller, log-updown, no-propagate-ttl, ICMP and IPv6 tunneling, on the loopback and three core interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7100-48l an3_acx7100-48l
 * Count:
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   total 2
 * Pair with: none
 * Variables (example values from an1_acx7100-48l):
 *   $CORE_INTF_1  e.g. ae19.0
 *   $CORE_INTF_2  e.g. ae24.0
 *   $CORE_INTF_3  e.g. et-0/0/49.0
 */
protocols {
    mpls {
        lsp-external-controller pccd;
        log-updown {
            syslog;
            trap;
        }
        no-propagate-ttl;
        icmp-tunneling;
        optimize-timer 180;
        ipv6-tunneling;
        interface lo0.0;
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
        interface $CORE_INTF_3;
    }
}
```

## evo/protocols/mpls-pccd-ipv6-tunneling-loopback-4-core.conf

```
/*
 * Topic: MPLS with a PCEP external controller, log-updown, no-propagate-ttl, ICMP and IPv6 tunneling, on the loopback and four core interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   an4_acx7024 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 3
 * Pair with: none
 * Variables (example values from an4_acx7024):
 *   $CORE_INTF_1  e.g. ae22.0
 *   $CORE_INTF_2  e.g. ae25.0
 *   $CORE_INTF_3  e.g. et-0/0/1.0
 *   $CORE_INTF_4  e.g. et-0/0/0.0
 */
protocols {
    mpls {
        lsp-external-controller pccd;
        log-updown {
            syslog;
            trap;
        }
        no-propagate-ttl;
        icmp-tunneling;
        optimize-timer 180;
        ipv6-tunneling;
        interface lo0.0;
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
        interface $CORE_INTF_3;
        interface $CORE_INTF_4;
    }
}
```

## evo/protocols/mpls-pccd-ipv6-tunneling-loopback-5-core.conf

```
/*
 * Topic: MPLS with a PCEP external controller, log-updown, no-propagate-ttl, ICMP and IPv6 tunneling, on the loopback and five core interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   total 2
 * Pair with: none
 * Variables (example values from ag1_1_acx7509):
 *   $CORE_INTF_1  e.g. ae19.0
 *   $CORE_INTF_2  e.g. ae22.0
 *   $CORE_INTF_3  e.g. ae23.0
 *   $CORE_INTF_4  e.g. ae4.0
 *   $CORE_INTF_5  e.g. ae5.0
 */
protocols {
    mpls {
        lsp-external-controller pccd;
        log-updown {
            syslog;
            trap;
        }
        no-propagate-ttl;
        icmp-tunneling;
        optimize-timer 180;
        ipv6-tunneling;
        interface lo0.0;
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
        interface $CORE_INTF_3;
        interface $CORE_INTF_4;
        interface $CORE_INTF_5;
    }
}
```

## evo/protocols/oam-cfm-maintenance-association-up-mep-cc-1s.conf

```
/*
 * Topic: Ethernet CFM maintenance association with an up MEP on a logical interface, a remote MEP and 1-second continuity checks
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   ag1_1_acx7509 200
 *   ag1_2_acx7100-32c 150
 *   an1_acx7100-48l 550
 *   an3_acx7100-48l 550
 *   an4_acx7024 450
 *   total 1900
 * Pair with: none
 * Peers with:
 *   [ag1_1_acx7509] <-> [an1_acx7100-48l]
 *   [ag1_1_acx7509] <-> [an3_acx7100-48l]
 *   [ag1_1_acx7509] <-> [an4_acx7024]
 *   [ag1_2_acx7100-32c] <-> [an1_acx7100-48l]
 *   [ag1_2_acx7100-32c] <-> [an3_acx7100-48l]
 *   [ag1_2_acx7100-32c] <-> [an4_acx7024]
 *   [an1_acx7100-48l] <-> [sag_mx304]
 *   [an3_acx7100-48l] <-> [sag_mx304]
 *   [an4_acx7024] <-> [sag_mx304]
 * Variables (example values from ag1_1_acx7509):
 *   $MD_NAME     e.g. MD_63535
 *   $MA_ID       e.g. 2501
 *   $MEP_LOCAL   e.g. 1003
 *   $AC_IFL      e.g. et-1/0/1.2501
 *   $MEP_REMOTE  e.g. 1001
 */
protocols {
    oam {
        ethernet {
            connectivity-fault-management {
                maintenance-domain $MD_NAME {
                    maintenance-association $MA_ID {
                        short-name-format 2octet;
                        continuity-check {
                            interval 1s;
                            loss-threshold 10;
                            hold-interval 1;
                        }
                        mep $MEP_LOCAL {
                            interface $AC_IFL;
                            direction up;
                            remote-mep $MEP_REMOTE;
                        }
                    }
                }
            }
        }
    }
}
```

## evo/protocols/oam-cfm-maintenance-domain-level-5.conf

```
/*
 * Topic: Ethernet CFM maintenance domain at level 5 with name-format none
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   total 5
 * Pair with: none
 * Variables (example values from ag1_1_acx7509):
 *   $MD_NAME  e.g. MD_63535
 */
protocols {
    oam {
        ethernet {
            connectivity-fault-management {
                maintenance-domain $MD_NAME {
                    level 5;
                    name-format none;
                }
            }
        }
    }
}
```

## evo/routing-instances/evpn-elan/ri-evpn-mac-vrf-vlan-based-irb-no-gateway-community.conf

```
/*
 * Topic: EVPN MAC-VRF instance, VLAN-based service, with an IRB interface and default-gateway no-gateway-community
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 250
 *   ag1_2_acx7100-32c 250
 *   total 500
 * Pair with: none
 * Variables (example values from ag1_1_acx7509):
 *   $INSTANCE_NAME    e.g. 5G-MIDHAUL-EVPN-L3VPN-IRB-1
 *   $AC_IFL           e.g. ae26.101
 *   $RD_SUB_ASSIGNED  e.g. 101
 *   $RT_ID            e.g. 101
 *   $BD_NAME          e.g. BD_EVPN_101
 *   $VLAN_BD          e.g. 101
 *   $IRB_IFL          e.g. irb.101
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type mac-vrf;
        protocols {
            evpn {
                default-gateway no-gateway-community;
            }
        }
        service-type vlan-based;
        interface $AC_IFL;
        route-distinguisher 101:$RD_SUB_ASSIGNED;
        vrf-target target:101:$RT_ID;
        vlans {
            $BD_NAME {
                vlan-id $VLAN_BD;
                interface $AC_IFL;
                l3-interface $IRB_IFL;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`, `$IRB_IFL`): required, for each reference; one of `interfaces/ifl-irb-inet-inet6-virtual-gateway-filter`, `interfaces/ifl-irb-inet-inet6-virtual-gateway`, `interfaces/ifl-vlan-bridge-esi-all-active`

## evo/routing-instances/evpn-elan/ri-evpn-mac-vrf-vlan-based.conf

```
/*
 * Topic: EVPN MAC-VRF instance, VLAN-based service, with one VLAN and one attachment circuit
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an4_acx7024
 * Count:
 *   ag1_1_acx7509 50
 *   ag1_2_acx7100-32c 50
 *   an4_acx7024 50
 *   total 150
 * Pair with: none
 * Variables (example values from ag1_1_acx7509):
 *   $INSTANCE_NAME    e.g. 5G-FRONTHAUL-EVPN-ELAN-MH-1
 *   $AC_IFL           e.g. ae26.1501
 *   $LOOPBACK_V4      e.g. 192.168.1.3
 *   $RD_SUB_ASSIGNED  e.g. 3901
 *   $RT_ID            e.g. 3901
 *   $BD_NAME          e.g. BD_EVPN_ELAN_1501
 *   $VLAN_BD          e.g. 1501
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type mac-vrf;
        protocols {
            evpn;
        }
        service-type vlan-based;
        interface $AC_IFL;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:63535:$RT_ID;
        vlans {
            $BD_NAME {
                vlan-id $VLAN_BD;
                interface $AC_IFL;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`): required, for each reference; one of `interfaces/ifl-vlan-bridge-description`, `interfaces/ifl-vlan-bridge-esi-all-active`

## evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf

```
/*
 * Topic: VLAN-aware EVPN-VPWS instance cross-connecting two attachment circuits
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an4_acx7024
 * Count:
 *   ag1_1_acx7509 200
 *   ag1_2_acx7100-32c 150
 *   an4_acx7024 100
 *   total 450
 * Pair with: none
 * Peers with:
 *   [ag1_1_acx7509] <-> [sag_mx304]
 *   [ag1_2_acx7100-32c] <-> [sag_mx304]
 *   [an4_acx7024] <-> [ag1_1_acx7509, ag1_2_acx7100-32c]
 * Variables (example values from ag1_1_acx7509):
 *   $INSTANCE_NAME    e.g. 5G-FRONTHAUL-EVPN-FXC-MH-1
 *   $AC_INTF_A        e.g. ae26.2601
 *   $SVC_ID_LOCAL_A   e.g. 2
 *   $SVC_ID_REMOTE_A  e.g. 1
 *   $AC_INTF_B        e.g. ae26.2651
 *   $SVC_ID_LOCAL_B   e.g. 102
 *   $SVC_ID_REMOTE_B  e.g. 101
 *   $LOOPBACK_V4      e.g. 192.168.1.3
 *   $RD_SUB_ASSIGNED  e.g. 3751
 *   $RT_AS            e.g. 63535
 *   $RT_ID            e.g. 3751
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_INTF_A`, `$AC_INTF_B`): required, for each reference; one of `interfaces/ifl-vlan-ccc-description`, `interfaces/ifl-vlan-ccc-esi-all-active`

## evo/routing-instances/evpn-vpws/ri-evpn-vpws-flow-label-static.conf

```
/*
 * Topic: EVPN-VPWS instance with static flow-label transmit and receive
 * Seen on:
 *   Junos: (none)
 *   EVO: an4_acx7024
 * Count:
 *   an4_acx7024 200
 *   total 200
 * Pair with: none
 * Peers with:
 *   [an4_acx7024] <-> [sag_mx304]
 * Variables (example values from an4_acx7024):
 *   $INSTANCE_NAME       e.g. MBH-EVPN-VPWS-SH-TO-SAG-1
 *   $AC_IFL              e.g. et-0/0/4.501
 *   $VPWS_SVC_ID_LOCAL   e.g. 1
 *   $VPWS_SVC_ID_REMOTE  e.g. 2
 *   $LOOPBACK_V4         e.g. 192.168.1.0
 *   $RD_SUB_ASSIGNED     e.g. 3951
 *   $RT_ID               e.g. 3951
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_IFL {
                    vpws-service-id {
                        local $VPWS_SVC_ID_LOCAL;
                        remote $VPWS_SVC_ID_REMOTE;
                    }
                }
                flow-label-transmit-static;
                flow-label-receive-static;
            }
        }
        interface $AC_IFL;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:63535:$RT_ID;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`): required, for each reference; `interfaces/ifl-vlan-ccc-description`

## evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf

```
/*
 * Topic: EVPN-VPWS routing-instance (MEF E-Line)
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   ag1_1_acx7509 450
 *   ag1_2_acx7100-32c 450
 *   an1_acx7100-48l 200
 *   an3_acx7100-48l 200
 *   an4_acx7024 200
 *   total 1500
 * Pair with: none
 * Peers with:
 *   [an1_acx7100-48l] <-> [ag1_1_acx7509, ag1_2_acx7100-32c]
 *   [an3_acx7100-48l] <-> [ag1_1_acx7509, ag1_2_acx7100-32c]
 *   [an4_acx7024] <-> [ag1_1_acx7509, ag1_2_acx7100-32c]
 * Variables (example values from ag1_1_acx7509):
 *   $INSTANCE_NAME       e.g. FRONTHAUL-EVPN-VPWS-MH-AN1-100
 *   $AC_INTF             e.g. ae26.1000
 *   $VPWS_SVC_ID_LOCAL   e.g. 200
 *   $VPWS_SVC_ID_REMOTE  e.g. 199
 *   $LOOPBACK_V4         e.g. 192.168.1.3
 *   $RD_SUB_ASSIGNED     e.g. 3500
 *   $RT_AS               e.g. 63535
 *   $RT_ID               e.g. 3500
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_INTF`): required, for each reference; one of `interfaces/ifl-vlan-ccc-description`, `interfaces/ifl-vlan-ccc-esi-all-active-filter`, `interfaces/ifl-vlan-ccc-filter`

## evo/routing-instances/l3vpn/ri-l3vpn-ebgp-v4-v6-as-override.conf

```
/*
 * Topic: L3VPN VRF with IPv4 and IPv6 eBGP sessions to the CE using as-override, and vrf-table-label
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   ag1_1_acx7509 100
 *   ag1_2_acx7100-32c 100
 *   an1_acx7100-48l 100
 *   an3_acx7100-48l 100
 *   an4_acx7024 100
 *   total 500
 * Pair with: none
 * Variables (example values from ag1_1_acx7509):
 *   $INSTANCE_NAME    e.g. MBH-L3VPN-1
 *   $BGP_GROUP_V4     e.g. v4ixia
 *   $CE_PEER_V4       e.g. 10.16.7.206
 *   $PE_LOCAL_V4      e.g. 10.16.7.205
 *   $ASN_CUSTOMER     e.g. 64518
 *   $BGP_GROUP_V6     e.g. v6ixia
 *   $CE_PEER_V6       e.g. 2001:db8::16:1:7:7cf
 *   $PE_LOCAL_V6      e.g. 2001:db8::16:1:7:7cd
 *   $DESCRIPTION      e.g. L3-MBH-AND-5G-FRONTHAUL-L3VPN-1
 *   $AC_IFL           e.g. et-1/0/1.1
 *   $LOOPBACK_V4      e.g. 192.168.1.3
 *   $RD_SUB_ASSIGNED  e.g. 1
 *   $RT_ID            e.g. 1
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        protocols {
            bgp {
                group $BGP_GROUP_V4 {
                    type external;
                    family inet {
                        any;
                    }
                    neighbor $CE_PEER_V4 {
                        local-address $PE_LOCAL_V4;
                        peer-as $ASN_CUSTOMER;
                        as-override;
                    }
                }
                group $BGP_GROUP_V6 {
                    type external;
                    family inet6 {
                        any;
                    }
                    neighbor $CE_PEER_V6 {
                        local-address $PE_LOCAL_V6;
                        peer-as $ASN_CUSTOMER;
                        as-override;
                    }
                }
            }
        }
        description $DESCRIPTION;
        interface $AC_IFL;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:63535:$RT_ID;
        vrf-table-label;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`): required, for each reference; `interfaces/ifl-vlan-inet-inet6-description`

## evo/routing-instances/l3vpn/ri-l3vpn-irb-router-id-vrf-table-label.conf

```
/*
 * Topic: L3VPN VRF with one IRB interface, a router ID and vrf-table-label
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 500
 *   ag1_2_acx7100-32c 500
 *   total 1000
 * Pair with: none
 * Variables (example values from ag1_1_acx7509):
 *   $INSTANCE_NAME    e.g. 5G-MIDHAUL-L3VPN-EVPN-IRB-1
 *   $ROUTER_ID        e.g. 192.168.1.3
 *   $DESCRIPTION      e.g. 5G-MIDHAUL-EVPN-IRB-ANYCAST-GW-L3VPN-MH-1
 *   $IRB_IFL          e.g. irb.101
 *   $LOOPBACK_V4      e.g. 192.168.1.3
 *   $RD_SUB_ASSIGNED  e.g. 5000
 *   $RT_ID            e.g. 5000
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            router-id $ROUTER_ID;
        }
        description $DESCRIPTION;
        interface $IRB_IFL;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:63535:$RT_ID;
        vrf-table-label;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `irb-service`: required, all related; one of 9 providers listed in MANIFEST.json
- `logical-interface` (`$IRB_IFL`): required, for each reference; one of `interfaces/ifl-irb-inet-inet6-static-arp-ndp-mac-filter`, `interfaces/ifl-irb-inet-inet6-static-arp-ndp-mac`, `interfaces/ifl-irb-inet-inet6-virtual-gateway-filter`, `interfaces/ifl-irb-inet-inet6-virtual-gateway`

## evo/routing-instances/vpls/ri-bgp-vpls-virtual-switch-flow-label.conf

```
/*
 * Topic: BGP-signalled VPLS virtual switch with flow-label transmit and receive (FAT pseudowire) and one VLAN
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   ag1_1_acx7509 500
 *   ag1_2_acx7100-32c 500
 *   an1_acx7100-48l 450
 *   an3_acx7100-48l 450
 *   an4_acx7024 100
 *   total 2000
 * Pair with: none
 * Variables (example values from ag1_1_acx7509):
 *   $INSTANCE_NAME    e.g. L2-MIDHAUL-BGP-VPLS-TO-SAG-1
 *   $VPLS_SITE        e.g. r2
 *   $VPLS_SITE_ID     e.g. 1003
 *   $DESCRIPTION      e.g. Midhaul-BGP-VPLS-HSR-to-SAG-with-FAT-PW-1
 *   $LOOPBACK_V4      e.g. 192.168.1.3
 *   $RD_SUB_ASSIGNED  e.g. 1101
 *   $RT_ID            e.g. 1101
 *   $BD_NAME          e.g. vlan201
 *   $VLAN_BD          e.g. 201
 *   $AC_IFL           e.g. et-1/0/1.201
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-switch;
        protocols {
            vpls {
                site $VPLS_SITE {
                    site-identifier $VPLS_SITE_ID;
                }
                site-range 65534;
                label-block-size 4;
                no-tunnel-services;
                flow-label-transmit;
                flow-label-receive;
            }
        }
        description $DESCRIPTION;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:63535:$RT_ID;
        vlans {
            $BD_NAME {
                vlan-id $VLAN_BD;
                interface $AC_IFL;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`): required, for each reference; `interfaces/ifl-vlan-bridge-description`

## evo/routing-options/auto-bandwidth-template.conf

```
/*
 * Topic: Auto-bandwidth template with adjust interval, threshold, statistics interval and subscription
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 7
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    auto-bandwidth {
        template {
            auto_bw_temp1 {
                adjust-interval 900;
                adjust-threshold 50;
                statistic-collection-interval 60;
                auto-bandwidth-subscription 100;
            }
        }
    }
}
```

## evo/routing-options/autonomous-system.conf

```
/*
 * Topic: Device autonomous-system number
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 7
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $ASN  e.g. 63535
 */
routing-options {
  autonomous-system $ASN;
}
```

## evo/routing-options/forwarding-table-pplb-chained-nh-evpn-l3vpn.conf

```
/*
 * Topic: Forwarding-table load-balance export with chained composite next hops for EVPN and L3VPN
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $PPLB_NAME  e.g. PPLB
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$PPLB_NAME`): required, for each reference; `policy-options/policy-statement/per-packet-load-balance`

## evo/routing-options/forwarding-table-pplb-chained-nh-l2ckt-evpn-l3vpn.conf

```
/*
 * Topic: Forwarding-table load-balance export with chained composite next hops for L2 circuit, EVPN and L3VPN
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10001-36mr
 * Count:
 *   cr1_ptx10001-36mr 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from cr1_ptx10001-36mr):
 *   $PPLB_NAME  e.g. PPLB
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
        chained-composite-next-hop {
            ingress {
                l2ckt;
                evpn;
                l3vpn;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$PPLB_NAME`): required, for each reference; `policy-options/policy-statement/per-packet-load-balance`

## evo/routing-options/forwarding-table-pplb-chained-nh-l3vpn.conf

```
/*
 * Topic: Forwarding-table load-balance export with chained composite next hops for L3VPN
 * Seen on:
 *   Junos: (none)
 *   EVO: cr2_ptx10001-36mr
 * Count:
 *   cr2_ptx10001-36mr 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from cr2_ptx10001-36mr):
 *   $PPLB_NAME  e.g. PPLB
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
        chained-composite-next-hop {
            ingress {
                l3vpn;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$PPLB_NAME`): required, for each reference; `policy-options/policy-statement/per-packet-load-balance`

## evo/routing-options/no-multi-topology-routing.conf

```
/*
 * Topic: Multi-topology routing disabled
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    no-multi-topology-routing;
}
```

## evo/routing-options/rib-groups-inet3-to-inet0-inet6-3.conf

```
/*
 * Topic: RIB group copying inet.3 routes into inet.0 and inet6.3 through ALLOW_LOOPBACK
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_2_acx7100-32c cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_2_acx7100-32c 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 3
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-loopback-allow.conf
 *
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    rib-groups {
        inet3-to-inet0 {
            import-rib [ inet.3 inet.0 inet6.3 ];
            import-policy ALLOW_LOOPBACK;
        }
    }
}
```

## evo/routing-options/rib-groups-inet3-to-inet0.conf

```
/*
 * Topic: RIB group copying inet.3 routes into inet.0 through ALLOW_LOOPBACK
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 an1_acx7100-48l an3_acx7100-48l an4_acx7024
 * Count:
 *   ag1_1_acx7509 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   total 4
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-loopback-allow.conf
 *
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    rib-groups {
        inet3-to-inet0 {
            import-rib [ inet.3 inet.0 ];
            import-policy ALLOW_LOOPBACK;
        }
    }
}
```

## evo/routing-options/router-id.conf

```
/*
 * Topic: Transport router identity
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 * Count:
 *   ag1_1_acx7509 1
 *   ag1_2_acx7100-32c 1
 *   an1_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7024 1
 *   cr1_ptx10001-36mr 1
 *   cr2_ptx10001-36mr 1
 *   total 7
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag1_1_acx7509):
 *   $ROUTER_ID  e.g. 192.168.1.3
 */
routing-options {
    router-id $ROUTER_ID;
}
```

## evo/vlans/vlan-interface-l3-interface.conf

```
/*
 * Topic: VLAN with one member interface and an IRB Layer 3 interface
 * Seen on:
 *   Junos: (none)
 *   EVO: ag1_1_acx7509 ag1_2_acx7100-32c
 * Count:
 *   ag1_1_acx7509 250
 *   ag1_2_acx7100-32c 250
 *   total 500
 * Pair with: none
 * Variables (example values from ag1_1_acx7509):
 *   $VLAN_NAME  e.g. 5G-MIDHAUL-L3VPN-BD-351
 *   $VLAN_BD    e.g. 351
 *   $AC_IFL     e.g. ae26.351
 *   $IRB_IFL    e.g. irb.351
 */
vlans {
    $VLAN_NAME {
        vlan-id $VLAN_BD;
        interface $AC_IFL;
        l3-interface $IRB_IFL;
    }
}
```

## junos/bridge-domains/bridge-domain-irb.conf

```
/*
 * Topic: Bridge domain with one VLAN, one attachment circuit and an IRB routed interface
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 250
 *   total 250
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from sag_mx304):
 *   $BD_NAME   e.g. 5G-MIDHAUL-L3VPN-BD-351
 *   $VLAN      e.g. 351
 *   $AC_INTF   e.g. xe-0/1/3:2.351
 *   $IRB_UNIT  e.g. 351
 */
bridge-domains {
    $BD_NAME {
        vlan-id $VLAN;
        interface $AC_INTF;
        routing-interface irb.$IRB_UNIT;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_INTF`, `irb.$IRB_UNIT`): required, for each reference; one of `interfaces/ifl-irb-inet-inet6-description`, `interfaces/ifl-irb-inet-inet6-filter-description`, `interfaces/ifl-vlan-bridge-description`

## junos/chassis/aggregated-devices-ethernet.conf

```
/*
 * Topic: Aggregated Ethernet device-count for the chassis
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 du_qfx5210 sag_mx304
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   du_qfx5210 1
 *   sag_mx304 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag2_1_mx204):
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

## junos/chassis/fpc-mx204-port-speeds-100g-10g.conf

```
/*
 * Topic: MX204 port speeds: 100GbE on PIC 0 and 10GbE on PIC 1
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
chassis {
    fpc 0 {
        pic 0 {
            port 0 {
                speed 100g;
            }
            port 1 {
                speed 100g;
            }
            port 2 {
                speed 100g;
            }
        }
        pic 1 {
            port 0 {
                speed 10g;
            }
            port 2 {
                speed 10g;
            }
            port 4 {
                speed 10g;
            }
            port 6 {
                speed 10g;
            }
        }
    }
}
```

## junos/chassis/fpc-mx480-pic-0-1-ports-100g.conf

```
/*
 * Topic: MX480 FPC with two 100GbE ports on each of PIC 0 and PIC 1
 * Seen on:
 *   Junos: ag3_1_mx480 ag3_2_mx480
 *   EVO: (none)
 * Count:
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
chassis {
    fpc 5 {
        pic 0 {
            port 2 {
                speed 100g;
            }
            port 5 {
                speed 100g;
            }
        }
        pic 1 {
            port 2 {
                speed 100g;
            }
            port 5 {
                speed 100g;
            }
        }
    }
}
```

## junos/chassis/fpc-mx480-pic-0-ports-100g.conf

```
/*
 * Topic: MX480 FPC with two 100GbE ports on PIC 0
 * Seen on:
 *   Junos: ag3_1_mx480 ag3_2_mx480
 *   EVO: (none)
 * Count:
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag3_1_mx480):
 *   $FPC_SLOT  e.g. 2
 */
chassis {
    fpc $FPC_SLOT {
        pic 0 {
            port 2 {
                speed 100g;
            }
            port 5 {
                speed 100g;
            }
        }
    }
}
```

## junos/chassis/fpc-qfx5210-channel-speed-10g.conf

```
/*
 * Topic: QFX5210 ports channelized to 10GbE
 * Seen on:
 *   Junos: du_qfx5210
 *   EVO: (none)
 * Count:
 *   du_qfx5210 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
chassis {
    fpc 0 {
        pic 0 {
            port 6 {
                channel-speed 10g;
            }
            port 8 {
                channel-speed 10g;
            }
        }
    }
}
```

## junos/chassis/fpc-tunnel-services-pic-ports-4x10g.conf

```
/*
 * Topic: FPC with tunnel services on one PIC and two ports split into four 10GbE sub-ports on another
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from sag_mx304):
 *   $FPC_SLOT  e.g. 0
 *   $TS_PIC    e.g. 0
 *   $PIC_SLOT  e.g. 1
 */
chassis {
    fpc $FPC_SLOT {
        pic $TS_PIC {
            tunnel-services;
        }
        pic $PIC_SLOT {
            port 1 {
                number-of-sub-ports 4;
                speed 10g;
            }
            port 3 {
                number-of-sub-ports 4;
                speed 10g;
            }
        }
    }
}
```

## junos/chassis/network-services-enhanced-ip.conf

```
/*
 * Topic: Enhanced IP chassis network-services mode
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   sag_mx304 1
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
chassis {
  network-services enhanced-ip;
}
```

## junos/class-of-service/classifiers/cl-dscp-dscp-ipv6-exp-ieee8021p.conf

```
/*
 * Topic: DSCP, DSCP IPv6, MPLS EXP and IEEE 802.1p behavior aggregate classifiers for the eight forwarding classes
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   sag_mx304 1
 *   total 5
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-8class-model.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    classifiers {
        dscp CL-DSCP {
            import default;
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-points be;
            }
            forwarding-class FC-CONTROL {
                loss-priority low code-points cs7;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-points af33;
                loss-priority low code-points [ cs3 af31 ];
                loss-priority medium-high code-points af32;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-points af43;
                loss-priority low code-points [ cs4 af41 ];
                loss-priority medium-high code-points af42;
            }
            forwarding-class FC-LOW {
                loss-priority high code-points af13;
                loss-priority low code-points [ cs1 af11 ];
                loss-priority medium-high code-points af12;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-points af23;
                loss-priority low code-points [ cs2 af21 ];
                loss-priority medium-high code-points af22;
            }
            forwarding-class FC-REALTIME {
                loss-priority low code-points ef;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-points cs5;
                loss-priority low code-points cs6;
            }
        }
        dscp-ipv6 CL-DSCP-IPV6 {
            import default;
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-points be;
            }
            forwarding-class FC-CONTROL {
                loss-priority low code-points cs7;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-points af33;
                loss-priority low code-points [ cs3 af31 ];
                loss-priority medium-high code-points af32;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-points af43;
                loss-priority low code-points [ cs4 af41 ];
                loss-priority medium-high code-points af42;
            }
            forwarding-class FC-LOW {
                loss-priority high code-points af13;
                loss-priority low code-points [ cs1 af11 ];
                loss-priority medium-high code-points af12;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-points af23;
                loss-priority low code-points [ cs2 af21 ];
                loss-priority medium-high code-points af22;
            }
            forwarding-class FC-REALTIME {
                loss-priority low code-points ef;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-points cs5;
                loss-priority low code-points cs6;
            }
        }
        exp CL-MPLS {
            import default;
            forwarding-class FC-BEST-EFFORT {
                loss-priority low code-points 000;
            }
            forwarding-class FC-CONTROL {
                loss-priority low code-points 111;
            }
            forwarding-class FC-HIGH {
                loss-priority low code-points 011;
            }
            forwarding-class FC-LLQ {
                loss-priority low code-points 100;
            }
            forwarding-class FC-LOW {
                loss-priority low code-points 001;
            }
            forwarding-class FC-MEDIUM {
                loss-priority low code-points 010;
            }
            forwarding-class FC-REALTIME {
                loss-priority low code-points 101;
            }
            forwarding-class FC-SIGNALING {
                loss-priority low code-points 110;
            }
        }
        ieee-802.1 CL-8021P {
            import default;
            forwarding-class FC-BEST-EFFORT {
                loss-priority low code-points 000;
            }
            forwarding-class FC-CONTROL {
                loss-priority low code-points 111;
            }
            forwarding-class FC-HIGH {
                loss-priority low code-points 011;
            }
            forwarding-class FC-LLQ {
                loss-priority low code-points 100;
            }
            forwarding-class FC-LOW {
                loss-priority low code-points 001;
            }
            forwarding-class FC-MEDIUM {
                loss-priority low code-points 010;
            }
            forwarding-class FC-REALTIME {
                loss-priority low code-points 101;
            }
            forwarding-class FC-SIGNALING {
                loss-priority low code-points 110;
            }
        }
    }
}
```

## junos/class-of-service/forwarding-classes/fc-8class-model.conf

```
/*
 * Topic: Eight forwarding classes mapped to queues 0 to 7, aligned with the O-RAN multiple priority queues
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   sag_mx304 1
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    forwarding-classes {
        class FC-BEST-EFFORT queue-num 0;
        class FC-CONTROL queue-num 3;
        class FC-HIGH queue-num 4;
        class FC-LLQ queue-num 6;
        class FC-LOW queue-num 1;
        class FC-MEDIUM queue-num 2;
        class FC-REALTIME queue-num 5;
        class FC-SIGNALING queue-num 7;
    }
}
```

## junos/class-of-service/interfaces/ifd-scheduler-map.conf

```
/*
 * Topic: Scheduler map on an interface
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 3
 *   ag2_2_mx204 3
 *   ag3_1_mx480 3
 *   ag3_2_mx480 3
 *   sag_mx304 5
 *   total 17
 * Pair with:
 *  - junos/class-of-service/scheduler-maps/sm-5g-scheduler.conf
 *
 * Peers with: n/a
 * Variables (example values from ag2_1_mx204):
 *   $COS_INTF  e.g. ae5
 */
class-of-service {
    interfaces {
        $COS_INTF {
            scheduler-map SM-5G-SCHEDULER;
        }
    }
}
```

## junos/class-of-service/interfaces/ifl-dscp-dscp-ipv6-classifier-rewrite.conf

```
/*
 * Topic: DSCP and DSCP IPv6 classifiers and rewrite rules on a logical unit
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 266
 *   total 266
 * Pair with:
 *  - junos/class-of-service/classifiers/cl-dscp-dscp-ipv6-exp-ieee8021p.conf
 *
 * Peers with: n/a
 * Variables (example values from sag_mx304):
 *   $COS_INTF  e.g. irb
 *   $UNIT      e.g. 184
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                classifiers {
                    dscp CL-DSCP;
                    dscp-ipv6 CL-DSCP-IPV6;
                }
                rewrite-rules {
                    dscp RR-DSCP;
                    dscp-ipv6 RR-DSCP-IPV6;
                }
            }
        }
    }
}
```

## junos/class-of-service/interfaces/ifl-forwarding-class-high-ieee8021p-rewrite.conf

```
/*
 * Topic: Fixed classification to FC-HIGH with an IEEE 802.1p rewrite rule on a logical unit
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 250
 *   total 250
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-8class-model.conf
 *
 * Peers with: n/a
 * Variables (example values from sag_mx304):
 *   $COS_INTF  e.g. xe-0/1/3:2
 *   $UNIT      e.g. 1001
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                forwarding-class FC-HIGH;
                rewrite-rules {
                    ieee-802.1 RR-8021P;
                }
            }
        }
    }
}
```

## junos/class-of-service/interfaces/ifl-forwarding-class-low-ieee8021p-rewrite.conf

```
/*
 * Topic: Fixed classification to FC-LOW with an IEEE 802.1p rewrite rule on a logical unit
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 125
 *   total 125
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-8class-model.conf
 *
 * Peers with: n/a
 * Variables (example values from sag_mx304):
 *   $COS_INTF  e.g. xe-0/1/3:2
 *   $UNIT      e.g. 1151
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                forwarding-class FC-LOW;
                rewrite-rules {
                    ieee-802.1 RR-8021P;
                }
            }
        }
    }
}
```

## junos/class-of-service/interfaces/ifl-forwarding-class-medium-ieee8021p-rewrite.conf

```
/*
 * Topic: Fixed classification to FC-MEDIUM with an IEEE 802.1p rewrite rule on a logical unit
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 125
 *   total 125
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-8class-model.conf
 *
 * Peers with: n/a
 * Variables (example values from sag_mx304):
 *   $COS_INTF  e.g. xe-0/1/3:2
 *   $UNIT      e.g. 1101
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                forwarding-class FC-MEDIUM;
                rewrite-rules {
                    ieee-802.1 RR-8021P;
                }
            }
        }
    }
}
```

## junos/class-of-service/interfaces/ifl-ieee8021p-classifier-rewrite.conf

```
/*
 * Topic: IEEE 802.1p classifier and rewrite rule on a logical unit
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1200
 *   total 1200
 * Pair with:
 *  - junos/class-of-service/classifiers/cl-dscp-dscp-ipv6-exp-ieee8021p.conf
 *
 * Peers with: n/a
 * Variables (example values from sag_mx304):
 *   $COS_INTF  e.g. xe-0/1/3:0
 *   $UNIT      e.g. 101
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                classifiers {
                    ieee-802.1 CL-8021P;
                }
                rewrite-rules {
                    ieee-802.1 RR-8021P;
                }
            }
        }
    }
}
```

## junos/class-of-service/interfaces/ifl-unit-0-exp-classifier-rewrite.conf

```
/*
 * Topic: MPLS EXP classifier and rewrite rule on unit 0 of a core interface
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 3
 *   ag2_2_mx204 3
 *   ag3_1_mx480 6
 *   ag3_2_mx480 3
 *   sag_mx304 2
 *   total 17
 * Pair with:
 *  - junos/class-of-service/classifiers/cl-dscp-dscp-ipv6-exp-ieee8021p.conf
 *
 * Peers with: n/a
 * Variables (example values from ag2_1_mx204):
 *   $COS_INTF  e.g. ae5
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit 0 {
                classifiers {
                    exp CL-MPLS;
                }
                rewrite-rules {
                    exp RR-MPLS;
                }
            }
        }
    }
}
```

## junos/class-of-service/interfaces/irb-forwarding-class-realtime-dscp-dscp-ipv6-rewrite.conf

```
/*
 * Topic: Fixed classification to FC-REALTIME with DSCP and DSCP IPv6 rewrite rules on a logical unit
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 166
 *   total 166
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-8class-model.conf
 *
 * Peers with: n/a
 * Variables (example values from sag_mx304):
 *   $UNIT  e.g. 101
 */
class-of-service {
    interfaces {
        irb {
            unit $UNIT {
                forwarding-class FC-REALTIME;
                rewrite-rules {
                    dscp RR-DSCP;
                    dscp-ipv6 RR-DSCP-IPV6;
                }
            }
        }
    }
}
```

## junos/class-of-service/rewrite-rules/rr-dscp-dscp-ipv6-exp-ieee8021p.conf

```
/*
 * Topic: DSCP, DSCP IPv6, MPLS EXP and IEEE 802.1p rewrite rules for the eight forwarding classes
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   sag_mx304 1
 *   total 5
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-8class-model.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    rewrite-rules {
        dscp RR-DSCP {
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-point be;
                loss-priority low code-point be;
            }
            forwarding-class FC-CONTROL {
                loss-priority high code-point cs7;
                loss-priority low code-point cs7;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-point af33;
                loss-priority low code-point af31;
                loss-priority medium-high code-point af32;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-point af43;
                loss-priority low code-point af41;
                loss-priority medium-high code-point af42;
            }
            forwarding-class FC-LOW {
                loss-priority high code-point af13;
                loss-priority low code-point af11;
                loss-priority medium-high code-point af12;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-point af23;
                loss-priority low code-point af21;
                loss-priority medium-high code-point af22;
            }
            forwarding-class FC-REALTIME {
                loss-priority high code-point ef;
                loss-priority low code-point ef;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-point cs5;
                loss-priority low code-point cs6;
            }
        }
        dscp-ipv6 RR-DSCP-IPV6 {
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-point be;
                loss-priority low code-point be;
            }
            forwarding-class FC-CONTROL {
                loss-priority high code-point cs7;
                loss-priority low code-point cs7;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-point af33;
                loss-priority low code-point af31;
                loss-priority medium-high code-point af32;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-point af43;
                loss-priority low code-point af41;
                loss-priority medium-high code-point af42;
            }
            forwarding-class FC-LOW {
                loss-priority high code-point af13;
                loss-priority low code-point af11;
                loss-priority medium-high code-point af12;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-point af23;
                loss-priority low code-point af21;
                loss-priority medium-high code-point af22;
            }
            forwarding-class FC-REALTIME {
                loss-priority high code-point ef;
                loss-priority low code-point ef;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-point cs5;
                loss-priority low code-point cs6;
            }
        }
        exp RR-MPLS {
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-point 000;
                loss-priority low code-point 000;
            }
            forwarding-class FC-CONTROL {
                loss-priority high code-point 111;
                loss-priority low code-point 111;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-point 011;
                loss-priority low code-point 011;
                loss-priority medium-high code-point 011;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-point 100;
                loss-priority low code-point 100;
                loss-priority medium-high code-point 100;
            }
            forwarding-class FC-LOW {
                loss-priority high code-point 001;
                loss-priority low code-point 001;
                loss-priority medium-high code-point 001;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-point 010;
                loss-priority low code-point 010;
                loss-priority medium-high code-point 010;
            }
            forwarding-class FC-REALTIME {
                loss-priority high code-point 101;
                loss-priority low code-point 101;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-point 110;
                loss-priority low code-point 110;
            }
        }
        ieee-802.1 RR-8021P {
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-point 000;
                loss-priority low code-point 000;
            }
            forwarding-class FC-CONTROL {
                loss-priority high code-point 111;
                loss-priority low code-point 111;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-point 011;
                loss-priority low code-point 011;
                loss-priority medium-high code-point 011;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-point 100;
                loss-priority low code-point 100;
                loss-priority medium-high code-point 100;
            }
            forwarding-class FC-LOW {
                loss-priority high code-point 001;
                loss-priority low code-point 001;
                loss-priority medium-high code-point 001;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-point 010;
                loss-priority low code-point 010;
                loss-priority medium-high code-point 010;
            }
            forwarding-class FC-REALTIME {
                loss-priority high code-point 101;
                loss-priority low code-point 101;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-point 110;
                loss-priority low code-point 110;
            }
        }
    }
}
```

## junos/class-of-service/scheduler-maps/sm-5g-scheduler.conf

```
/*
 * Topic: Scheduler map SM-5G-SCHEDULER binding the eight forwarding classes to their schedulers
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   sag_mx304 1
 *   total 5
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-8class-model.conf
 *  - junos/class-of-service/schedulers/schedulers-8class-llq-strict-high.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    scheduler-maps {
        SM-5G-SCHEDULER {
            forwarding-class FC-BEST-EFFORT scheduler SC-BEST-EFFORT;
            forwarding-class FC-CONTROL scheduler SC-CONTROL;
            forwarding-class FC-HIGH scheduler SC-HIGH;
            forwarding-class FC-LLQ scheduler SC-LLQ;
            forwarding-class FC-LOW scheduler SC-LOW;
            forwarding-class FC-MEDIUM scheduler SC-MEDIUM;
            forwarding-class FC-REALTIME scheduler SC-REALTIME;
            forwarding-class FC-SIGNALING scheduler SC-SIGNALING;
        }
    }
}
```

## junos/class-of-service/schedulers/schedulers-8class-llq-strict-high.conf

```
/*
 * Topic: Schedulers for the eight forwarding classes: SC-LLQ shaped at priority strict-high, SC-SIGNALING high, SC-REALTIME medium-high
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   sag_mx304 1
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    schedulers {
        SC-BEST-EFFORT {
            transmit-rate {
                remainder;
            }
            buffer-size {
                remainder;
            }
            priority low;
        }
        SC-CONTROL {
            shaping-rate percent 5;
            buffer-size percent 5;
            priority high;
        }
        SC-HIGH {
            transmit-rate percent 40;
            buffer-size percent 30;
            priority low;
        }
        SC-LLQ {
            shaping-rate percent 40;
            buffer-size percent 10;
            priority strict-high;
        }
        SC-LOW {
            transmit-rate percent 20;
            priority low;
        }
        SC-MEDIUM {
            transmit-rate percent 30;
            buffer-size percent 20;
            priority low;
        }
        SC-REALTIME {
            shaping-rate percent 30;
            buffer-size percent 20;
            priority medium-high;
        }
        SC-SIGNALING {
            shaping-rate percent 5;
            buffer-size percent 5;
            priority high;
        }
    }
}
```

## junos/firewall/filter-inet-mfc-dscp-forwarding-class.conf

```
/*
 * Topic: Interface-specific IPv4 multifield filter mapping DSCP code points to forwarding classes
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 2
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from sag_mx304):
 *   $INPUT_FILTER_V4  e.g. FF-MFC-IPV4-L3VPN-BD-IRB
 */
firewall {
    family inet {
        filter $INPUT_FILTER_V4 {
            interface-specific;
            term fc-realtime {
                from {
                    dscp cs1;
                }
                then forwarding-class FC-REALTIME;
            }
            term fc-high {
                from {
                    dscp cs2;
                }
                then forwarding-class FC-HIGH;
            }
            term fc-medium {
                from {
                    dscp cs3;
                }
                then forwarding-class FC-MEDIUM;
            }
            term fc-low {
                from {
                    dscp cs4;
                }
                then forwarding-class FC-LOW;
            }
            term default {
                then accept;
            }
        }
    }
}
```

## junos/firewall/filter-inet6-mfc-traffic-class-forwarding-class.conf

```
/*
 * Topic: Interface-specific IPv6 multifield filter mapping traffic-class code points to forwarding classes
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 2
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from sag_mx304):
 *   $INPUT_FILTER_V6  e.g. FF-MFC-IPV6-L3VPN-BD-IRB
 */
firewall {
    family inet6 {
        filter $INPUT_FILTER_V6 {
            interface-specific;
            term fc-realtime {
                from {
                    traffic-class cs1;
                }
                then forwarding-class FC-REALTIME;
            }
            term fc-high {
                from {
                    traffic-class cs2;
                }
                then forwarding-class FC-HIGH;
            }
            term fc-medium {
                from {
                    traffic-class cs3;
                }
                then forwarding-class FC-MEDIUM;
            }
            term fc-low {
                from {
                    traffic-class cs4;
                }
                then forwarding-class FC-LOW;
            }
            term default {
                then accept;
            }
        }
    }
}
```

## junos/forwarding-options/hash-key-inet-inet6-layer-3-4-mpls-labels-1-3-payload.conf

```
/*
 * Topic: Hash key on Layer 3 and Layer 4 fields for IPv4 and IPv6, and on the first three MPLS labels plus the pseudowire and IP payload
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
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
    }
}
```

## junos/forwarding-options/load-balance-label-capability.conf

```
/*
 * Topic: Label load-balancing capability
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    load-balance-label-capability;
}
```

## junos/interfaces/ifd-ae-description-mtu-lacp-fast.conf

```
/*
 * Topic: Aggregated Ethernet interface with a description, MTU and LACP active with fast periodic
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 3
 *   ag2_2_mx204 3
 *   ag3_1_mx480 3
 *   ag3_2_mx480 3
 *   sag_mx304 2
 *   total 14
 * Pair with: none
 * Variables (example values from ag2_1_mx204):
 *   $IFD          e.g. ae5
 *   $DESCRIPTION  e.g. To-AG1.1
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        mtu 9190;
        aggregated-ether-options {
            lacp {
                active;
                periodic fast;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-gigether`

## junos/interfaces/ifd-ae-flexible-lacp-fast.conf

```
/*
 * Topic: Flexible-services aggregated Ethernet bundle with active fast LACP
 * Seen on:
 *   Junos: du_qfx5210
 *   EVO: (none)
 * Count:
 *   du_qfx5210 1
 *   total 1
 * Pair with: none
 * Variables (example values from du_qfx5210):
 *   $IFD  e.g. ae26
 */
interfaces {
    $IFD {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            lacp {
                active;
                periodic fast;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-ether`

## junos/interfaces/ifd-flexible-ethernet-services-description.conf

```
/*
 * Topic: Described port with flexible VLAN tagging and flexible Ethernet services
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from sag_mx304):
 *   $IFD          e.g. xe-0/1/3:2
 *   $DESCRIPTION  e.g. To-RT5-L2-MBH-L2CKT-TO-AN3-200
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
    }
}
```

## junos/interfaces/ifd-flexible-ethernet-services.conf

```
/*
 * Topic: Port with flexible VLAN tagging and flexible Ethernet services
 * Seen on:
 *   Junos: du_qfx5210 sag_mx304
 *   EVO: ag1_2_acx7100-32c an4_acx7024
 * Count:
 *   ag1_2_acx7100-32c 1
 *   an4_acx7024 1
 *   du_qfx5210 1
 *   sag_mx304 2
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from du_qfx5210):
 *   $IFD  e.g. xe-0/0/6:2
 */
interfaces {
    $IFD {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
    }
}
```

## junos/interfaces/ifd-lag-member-ether.conf

```
/*
 * Topic: Physical member link of an aggregated-Ethernet bundle
 * Seen on:
 *   Junos: du_qfx5210
 *   EVO: (none)
 * Count:
 *   du_qfx5210 2
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from du_qfx5210):
 *   $IFD        e.g. xe-0/0/6:0
 *   $AE_BUNDLE  e.g. ae26
 */
interfaces {
    $IFD {
        ether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## junos/interfaces/ifd-lag-member-gigether.conf

```
/*
 * Topic: Aggregated Ethernet member link through gigether-options
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 3
 *   ag2_2_mx204 3
 *   ag3_1_mx480 5
 *   ag3_2_mx480 4
 *   sag_mx304 2
 *   total 17
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag2_1_mx204):
 *   $IFD        e.g. et-0/0/0
 *   $AE_BUNDLE  e.g. ae5
 */
interfaces {
    $IFD {
        gigether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## junos/interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-5-no-v6-address.conf

```
/*
 * Topic: Core link unit 0 with an IPv4 address, family iso, family inet6 without an address, and MPLS with five labels
 * Seen on:
 *   Junos: ag2_2_mx204
 *   EVO: (none)
 * Count:
 *   ag2_2_mx204 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag2_2_mx204):
 *   $IFD           e.g. ae7
 *   $CORE_V4_ADDR  e.g. 10.10.0.18/30
 */
interfaces {
    $IFD {
        unit 0 {
            family inet {
                address $CORE_V4_ADDR;
            }
            family iso;
            family inet6;
            family mpls {
                maximum-labels 5;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-ae-description-mtu-lacp-fast`
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-gigether`

## junos/interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-5.conf

```
/*
 * Topic: Core logical interface
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 3
 *   ag2_2_mx204 2
 *   ag3_1_mx480 3
 *   ag3_2_mx480 3
 *   sag_mx304 2
 *   total 13
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag2_1_mx204):
 *   $IFD           e.g. ae7
 *   $UNIT          e.g. 0
 *   $CORE_V4_ADDR  e.g. 10.10.0.17/30
 *   $CORE_V6_ADDR  e.g. 2001:db8::10:10:0:11/126
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-ae-description-mtu-lacp-fast`
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-gigether`

## junos/interfaces/ifl-irb-inet-inet6-description.conf

```
/*
 * Topic: IRB unit with a description and IPv4 and IPv6 addresses
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 332
 *   total 332
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from sag_mx304):
 *   $IRB_UNIT     e.g. 101
 *   $DESCRIPTION  e.g. TO-5G-MIDHAUL-L3VPN-IRB-EVPN-1
 *   $AC_ADDR_V4   e.g. 10.22.1.1/24
 *   $AC_ADDR_V6   e.g. 2001:db8::1600:11/112
 */
interfaces {
    irb {
        unit $IRB_UNIT {
            description $DESCRIPTION;
            family inet {
                address $AC_ADDR_V4;
            }
            family inet6 {
                address $AC_ADDR_V6;
            }
        }
    }
}
```

## junos/interfaces/ifl-irb-inet-inet6-filter-description.conf

```
/*
 * Topic: IRB unit with a description, IPv4 and IPv6 input filters and addresses
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 168
 *   total 168
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from sag_mx304):
 *   $IRB_UNIT         e.g. 267
 *   $DESCRIPTION      e.g. TO-5G-MIDHAUL-L3VPN-IRB-EVPN-167
 *   $INPUT_FILTER_V4  e.g. FF-MFC-IPV4-L3VPN-EVPN-IRB
 *   $AC_ADDR_V4       e.g. 10.22.167.1/24
 *   $INPUT_FILTER_V6  e.g. FF-MFC-IPV6-L3VPN-EVPN-IRB
 *   $AC_ADDR_V6       e.g. 2001:db8::16a6:11/112
 */
interfaces {
    irb {
        unit $IRB_UNIT {
            description $DESCRIPTION;
            family inet {
                filter {
                    input $INPUT_FILTER_V4;
                }
                address $AC_ADDR_V4;
            }
            family inet6 {
                filter {
                    input $INPUT_FILTER_V6;
                }
                address $AC_ADDR_V6;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `filter` (`$INPUT_FILTER_V4`, `$INPUT_FILTER_V6`): required, for each reference; one of `firewall/filter-inet-mfc-dscp-forwarding-class`, `firewall/filter-inet6-mfc-traffic-class-forwarding-class`

## junos/interfaces/ifl-loopback-primary-iso-anycast-v4-sr-v6.conf

```
/*
 * Topic: Loopback logical interface
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from sag_mx304):
 *   $UNIT                 e.g. 0
 *   $LOOPBACK_V4_PFX      e.g. 192.168.1.11/32
 *   $LOOPBACK_ANYCAST_V4  e.g. 192.168.10.11
 *   $ISIS_NET             e.g. 49.1022.1001.0000.0015.00
 *   $LOOPBACK_V6_PFX      e.g. 2001:db8::1:1:0:11/128
 *   $LOOPBACK_SR_V6       e.g. 2001:db8::1:1:10:11
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

## junos/interfaces/ifl-loopback-primary-secondary-iso-inet6-mpls.conf

```
/*
 * Topic: Loopback unit 0 with primary and secondary IPv4 addresses, an ISO address, primary and secondary IPv6 addresses, and family mpls
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag2_1_mx204):
 *   $LOOPBACK_V4_PFX      e.g. 192.168.1.5/32
 *   $LOOPBACK_ALT_V4_PFX  e.g. 192.168.10.5/32
 *   $ISIS_NET             e.g. 49.1022.1001.0000.0010.00
 *   $LOOPBACK_V6_PFX      e.g. 2001:db8::1:1:0:5/128
 *   $LOOPBACK_ALT_V6_PFX  e.g. 2001:db8::1:1:10:5/128
 */
interfaces {
    lo0 {
        unit 0 {
            family inet {
                address $LOOPBACK_V4_PFX {
                    primary;
                }
                address $LOOPBACK_ALT_V4_PFX;
            }
            family iso {
                address $ISIS_NET;
            }
            family inet6 {
                address $LOOPBACK_V6_PFX {
                    primary;
                }
                address $LOOPBACK_ALT_V6_PFX;
            }
            family mpls;
        }
    }
}
```

## junos/interfaces/ifl-vlan-bridge-description.conf

```
/*
 * Topic: VLAN unit with vlan-bridge encapsulation and a description
 * Seen on:
 *   Junos: du_qfx5210 sag_mx304
 *   EVO: (none)
 * Count:
 *   du_qfx5210 2300
 *   sag_mx304 2500
 *   total 4800
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from du_qfx5210):
 *   $IFD          e.g. ae26
 *   $UNIT         e.g. 2601
 *   $DESCRIPTION  e.g. 5G-FRONTHAUL-EVPN-FXC-MH-1
 *   $VLAN         e.g. 2601
 */
interfaces {
    $IFD {
        unit $UNIT {
            description $DESCRIPTION;
            encapsulation vlan-bridge;
            vlan-id $VLAN;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-ae-flexible-lacp-fast`, `interfaces/ifd-flexible-ethernet-services-description`, `interfaces/ifd-flexible-ethernet-services`
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-ether`

## junos/interfaces/ifl-vlan-ccc-description.conf

```
/*
 * Topic: VLAN unit with vlan-ccc encapsulation and a description
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 400
 *   total 400
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from sag_mx304):
 *   $IFD          e.g. xe-0/1/3:3
 *   $UNIT         e.g. 501
 *   $DESCRIPTION  e.g. L2-MBH-EVPN-VPWS-SH-TO-AN4-501
 *   $VLAN         e.g. 501
 */
interfaces {
    $IFD {
        unit $UNIT {
            description $DESCRIPTION;
            encapsulation vlan-ccc;
            vlan-id $VLAN;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-flexible-ethernet-services`

## junos/interfaces/ifl-vlan-ccc-family-ccc.conf

```
/*
 * Topic: VLAN-tagged circuit cross-connect unit with family ccc
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 2500
 *   total 2500
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from sag_mx304):
 *   $IFD   e.g. xe-0/1/3:2
 *   $UNIT  e.g. 1001
 *   $VLAN  e.g. 1001
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-ccc;
            vlan-id $VLAN;
            family ccc;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-flexible-ethernet-services-description`

## junos/interfaces/ifl-vlan-inet-inet6-description.conf

```
/*
 * Topic: VLAN unit with a description and IPv4 and IPv6 addresses
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 100
 *   total 100
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from sag_mx304):
 *   $IFD          e.g. xe-0/1/3:2
 *   $UNIT         e.g. 1
 *   $DESCRIPTION  e.g. To-RT5-L3-MBH-AND-5G-FRONTHAUL-L3VPN-1
 *   $VLAN         e.g. 1
 *   $AC_ADDR_V4   e.g. 10.18.7.205/30
 *   $AC_ADDR_V6   e.g. 2001:db8::18:1:7:7cd/112
 */
interfaces {
    $IFD {
        unit $UNIT {
            description $DESCRIPTION;
            vlan-id $VLAN;
            family inet {
                address $AC_ADDR_V4;
            }
            family inet6 {
                address $AC_ADDR_V6;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-flexible-ethernet-services-description`

## junos/policy-options/community/community-service-edge.conf

```
/*
 * Topic: SERVICE-EDGE community
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    community SERVICE-EDGE members 63536:100;
}
```

## junos/policy-options/policy-statement/per-packet-load-balance.conf

```
/*
 * Topic: Per-packet load-balance policy (pplb) — exported to the forwarding table so ECMP paths are used per-flow.
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   sag_mx304 1
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag2_1_mx204):
 *   $PPLB_NAME  e.g. PPLB
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

## junos/policy-options/policy-statement/ps-as-out-set-region-service-edge.conf

```
/*
 * Topic: Inter-AS export policy adding the SERVICE-EDGE community
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with:
 *  - junos/policy-options/community/community-service-edge.conf
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement as3536-out {
        term SET-REGION {
            then {
                community add SERVICE-EDGE;
                next policy;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-bgp-export-accept-inet3.conf

```
/*
 * Topic: BGP export policy accepting routes from inet.3 and rejecting the rest
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement bgp-export {
        term 1 {
            from rib inet.3;
            then accept;
        }
        term 2 {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-bgp-import-neighbors.conf

```
/*
 * Topic: BGP import policy accepting routes from two neighbors
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement bgp-import {
        term 1 {
            from neighbor [ 10.10.0.49 10.10.0.53 ];
            then accept;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-loopback-allow.conf

```
/*
 * Topic: Single-term policy accepting a prefix and its more-specifics
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from sag_mx304):
 *   $POLICY_NAME  e.g. ALLOW_LOOPBACK
 *   $PREFIX       e.g. 0.0.0.0/32
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

## junos/policy-options/policy-statement/ps-next-hop-self.conf

```
/*
 * Topic: Next-hop-self acceptance policy
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
  policy-statement next-hop-self {
    then {
      next-hop self;
      accept;
    }
  }
}
```

## junos/policy-options/policy-statement/ps-ospf-summary-reject.conf

```
/*
 * Topic: Policy accepting one prefix and longer, rejecting everything else
 * Seen on:
 *   Junos: ag3_1_mx480 ag3_2_mx480
 *   EVO: (none)
 * Count:
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag3_1_mx480):
 *   $PREFIX  e.g. 192.168.1.9/32
 */
policy-options {
    policy-statement ospf_summary_reject {
        term t1 {
            from {
                route-filter $PREFIX orlonger;
            }
            then accept;
        }
        term t2 {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-sr-nonzero-loopback-v4.conf

```
/*
 * Topic: Policy SR_NONZERO_LOOPBACKS_V4 attaching a prefix segment to the IPv4 SR loopback
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag2_1_mx204):
 *   $LOOPBACK_SR_V4  e.g. 192.168.10.5
 *   $SR_INDEX_V4     e.g. 210
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
 * Topic: Policy SR_NONZERO_LOOPBACKS_V6 attaching a prefix segment to the IPv6 SR loopback
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag2_1_mx204):
 *   $LOOPBACK_SR_V6  e.g. 2001:db8::1:1:10:3
 *   $SR_INDEX_V6     e.g. 310
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

## junos/protocols/bgp-group-ebgp-lu-import-bgp-import-export-as-out-2-peers.conf

```
/*
 * Topic: eBGP group with two peers for IPv4 and IPv6 labeled unicast, import bgp-import, export as3536-out and bgp-export
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-as-out-set-region-service-edge.conf
 *  - junos/policy-options/policy-statement/ps-bgp-export-accept-inet3.conf
 *  - junos/policy-options/policy-statement/ps-bgp-import-neighbors.conf
 *  - junos/routing-options/rib-groups-inet3-to-inet0-inet6-3.conf
 *
 * Variables (example values from sag_mx304):
 *   $BGP_GROUP           e.g. ebgp_sag
 *   $ASN_INTER_AS        e.g. 63535
 *   $INTER_AS_PEER_V4_1  e.g. 10.10.0.49
 *   $INTER_AS_PEER_V4_2  e.g. 10.10.0.53
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type external;
            import bgp-import;
            family inet {
                labeled-unicast {
                    rib-group inet3-to-inet0;
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
            export [ as3536-out bgp-export ];
            peer-as $ASN_INTER_AS;
            neighbor $INTER_AS_PEER_V4_1;
            neighbor $INTER_AS_PEER_V4_2;
        }
    }
}
```

## junos/protocols/bgp-group-ebgp-multihop-lu-vpn-evpn-rt-external-paths-2-peers.conf

```
/*
 * Topic: Multihop eBGP group with two peers for labeled unicast, VPN, L2VPN, EVPN and route-target (external-paths 2) families, exporting next-hop-self
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-next-hop-self.conf
 *  - junos/routing-options/rib-groups-inet3-to-inet0-inet6-3.conf
 *
 * Variables (example values from sag_mx304):
 *   $BGP_GROUP           e.g. ebgp_pag_mpbgp
 *   $ASN_INTER_AS        e.g. 63535
 *   $INTER_AS_PEER_V4_1  e.g. 192.168.1.3
 *   $INTER_AS_PEER_V4_2  e.g. 192.168.1.4
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type external;
            multihop;
            family inet {
                labeled-unicast {
                    rib-group inet3-to-inet0;
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
            family l2vpn {
                signaling;
            }
            family evpn {
                signaling;
            }
            family route-target {
                external-paths 2;
            }
            export next-hop-self;
            peer-as $ASN_INTER_AS;
            neighbor $INTER_AS_PEER_V4_1;
            neighbor $INTER_AS_PEER_V4_2;
        }
    }
}
```

## junos/protocols/bgp-vpn-apply-export-log-updown-multipath.conf

```
/*
 * Topic: BGP global settings: vpn-apply-export, log-updown and multipath
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
protocols {
    bgp {
        vpn-apply-export;
        log-updown;
        multipath;
    }
}
```

## junos/protocols/isis-ignore-attached-bit.conf

```
/*
 * Topic: IS-IS ignores the attached bit
 * Seen on:
 *   Junos: ag2_1_mx204 ag3_1_mx480 ag3_2_mx480
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   total 3
 * Pair with: none
 * Variables: none
 */
protocols {
    isis {
        ignore-attached-bit;
    }
}
```

## junos/protocols/isis-interface-l2-node-protection-l1-disable-p2p-bfd.conf

```
/*
 * Topic: IS-IS point-to-point core interface at Level 2 only, with node-protecting post-convergence LFA, metric 10 and BFD
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 3
 *   ag2_2_mx204 3
 *   ag3_1_mx480 3
 *   ag3_2_mx480 3
 *   total 12
 * Pair with: none
 * Variables (example values from ag2_1_mx204):
 *   $CORE_INTF  e.g. ae5.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 2 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                metric 10;
            }
            level 1 disable;
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$CORE_INTF`): required, for each reference; one of `interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-5-no-v6-address`, `interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-5`

## junos/protocols/isis-level-1-disable.conf

```
/*
 * Topic: IS-IS Level 1 disabled
 * Seen on:
 *   Junos: ag2_1_mx204
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
protocols {
    isis {
        level 1 disable;
    }
}
```

## junos/protocols/isis-level-2-wide-metrics-only.conf

```
/*
 * Topic: IS-IS Level 2 with wide metrics only
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
protocols {
    isis {
        level 2 wide-metrics-only;
    }
}
```

## junos/protocols/isis-loopback-passive.conf

```
/*
 * Topic: IS-IS logical interface
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   total 4
 * Pair with:
 *  - junos/interfaces/ifl-loopback-primary-secondary-iso-inet6-mpls.conf
 *
 * Peers with: n/a
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

## junos/protocols/isis-sr-node-segment-spf-ti-lfa-export.conf

```
/*
 * Topic: IS-IS segment routing (SRGB, node SIDs, explicit null), SPF timers, TI-LFA backup and loopback export
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   total 4
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-sr-nonzero-loopback-v4.conf
 *  - junos/policy-options/policy-statement/ps-sr-nonzero-loopback-v6.conf
 *
 * Variables (example values from ag2_1_mx204):
 *   $SR_INDEX_V4  e.g. 10
 *   $SR_INDEX_V6  e.g. 110
 */
protocols {
    isis {
        source-packet-routing {
            srgb start-label 16000 index-range 80000;
            node-segment {
                ipv4-index $SR_INDEX_V4;
                ipv6-index $SR_INDEX_V6;
            }
            explicit-null;
        }
        spf-options {
            delay 100;
            rapid-runs 5;
        }
        backup-spf-options {
            use-post-convergence-lfa maximum-labels 5;
            use-source-packet-routing;
        }
        export [ SR_NONZERO_LOOPBACKS_V4 SR_NONZERO_LOOPBACKS_V6 ];
    }
}
```

## junos/protocols/l2circuit-control-word-flow-label-static.conf

```
/*
 * Topic: Layer 2 circuit to a remote PE with control word, static flow-label transmit and receive, and pseudowire status TLV
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 2000
 *   total 2000
 * Pair with: none
 * Peers with:
 *   [ag1_1_acx7509] <-> [sag_mx304]
 *   [ag1_2_acx7100-32c] <-> [sag_mx304]
 * Variables (example values from sag_mx304):
 *   $REMOTE_PE_V4  e.g. 192.168.1.3
 *   $AC_IFL        e.g. xe-0/1/3:2.1501
 *   $VC_ID         e.g. 1501
 */
protocols {
    l2circuit {
        neighbor $REMOTE_PE_V4 {
            interface $AC_IFL {
                virtual-circuit-id $VC_ID;
                control-word;
                flow-label-transmit-static;
                flow-label-receive-static;
                encapsulation-type ethernet-vlan;
                ignore-mtu-mismatch;
                pseudowire-status-tlv;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`): required, for each reference; `interfaces/ifl-vlan-ccc-family-ccc`

## junos/protocols/l2circuit-control-word.conf

```
/*
 * Topic: Layer 2 circuit to a remote PE with control word and pseudowire status TLV
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 500
 *   total 500
 * Pair with: none
 * Peers with:
 *   [an1_acx7100-48l] <-> [sag_mx304]
 *   [an3_acx7100-48l] <-> [sag_mx304]
 *   [an4_acx7024] <-> [sag_mx304]
 * Variables (example values from sag_mx304):
 *   $REMOTE_PE_V4  e.g. 192.168.1.2
 *   $AC_IFL        e.g. xe-0/1/3:2.1001
 *   $VC_ID         e.g. 1001
 */
protocols {
    l2circuit {
        neighbor $REMOTE_PE_V4 {
            interface $AC_IFL {
                virtual-circuit-id $VC_ID;
                control-word;
                encapsulation-type ethernet-vlan;
                ignore-mtu-mismatch;
                pseudowire-status-tlv;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`): required, for each reference; `interfaces/ifl-vlan-ccc-family-ccc`

## junos/protocols/ldp-loopback.conf

```
/*
 * Topic: LDP loopback interface
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with:
 *  - junos/interfaces/ifl-loopback-primary-iso-anycast-v4-sr-v6.conf
 *
 * Peers with: n/a
 * Variables: none
 */
protocols {
  ldp {
    interface lo0.0;
  }
}
```

## junos/protocols/mpls-pccd-ipv6-tunneling-loopback-2-core.conf

```
/*
 * Topic: MPLS with a PCEP external controller, log-updown, no-propagate-ttl, ICMP and IPv6 tunneling, on the loopback and two core interfaces
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with: none
 * Variables (example values from sag_mx304):
 *   $CORE_INTF_1  e.g. ae16.0
 *   $CORE_INTF_2  e.g. ae17.0
 */
protocols {
    mpls {
        lsp-external-controller pccd;
        log-updown {
            syslog;
            trap;
        }
        no-propagate-ttl;
        icmp-tunneling;
        optimize-timer 180;
        ipv6-tunneling;
        interface lo0.0;
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
    }
}
```

## junos/protocols/mpls-pccd-ipv6-tunneling-loopback-3-core.conf

```
/*
 * Topic: MPLS with a PCEP external controller, log-updown, no-propagate-ttl, ICMP and IPv6 tunneling, on the loopback and three core interfaces
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   total 4
 * Pair with: none
 * Variables (example values from ag2_1_mx204):
 *   $CORE_INTF_1  e.g. ae5.0
 *   $CORE_INTF_2  e.g. ae7.0
 *   $CORE_INTF_3  e.g. ae8.0
 */
protocols {
    mpls {
        lsp-external-controller pccd;
        log-updown {
            syslog;
            trap;
        }
        no-propagate-ttl;
        icmp-tunneling;
        optimize-timer 180;
        ipv6-tunneling;
        interface lo0.0;
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
        interface $CORE_INTF_3;
    }
}
```

## junos/protocols/oam-cfm-maintenance-association-up-mep-cc-1s.conf

```
/*
 * Topic: Ethernet CFM maintenance association with an up MEP on a logical interface, a remote MEP and 1-second continuity checks
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1200
 *   total 1200
 * Pair with: none
 * Peers with:
 *   [an1_acx7100-48l] <-> [sag_mx304]
 *   [an3_acx7100-48l] <-> [sag_mx304]
 *   [an4_acx7024] <-> [sag_mx304]
 * Variables (example values from sag_mx304):
 *   $MD_NAME     e.g. MD_63535
 *   $MA_ID       e.g. 101
 *   $MEP_LOCAL   e.g. 1016
 *   $AC_IFL      e.g. xe-0/1/3:0.101
 *   $MEP_REMOTE  e.g. 1001
 */
protocols {
    oam {
        ethernet {
            connectivity-fault-management {
                maintenance-domain $MD_NAME {
                    maintenance-association $MA_ID {
                        short-name-format 2octet;
                        continuity-check {
                            interval 1s;
                            loss-threshold 10;
                            hold-interval 1;
                        }
                        mep $MEP_LOCAL {
                            interface $AC_IFL;
                            direction up;
                            remote-mep $MEP_REMOTE;
                        }
                    }
                }
            }
        }
    }
}
```

## junos/protocols/oam-cfm-maintenance-domain-level-5.conf

```
/*
 * Topic: Ethernet CFM maintenance domain at level 5 with name-format none
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with: none
 * Variables (example values from sag_mx304):
 *   $MD_NAME  e.g. MD_63535
 */
protocols {
    oam {
        ethernet {
            connectivity-fault-management {
                maintenance-domain $MD_NAME {
                    level 5;
                    name-format none;
                }
            }
        }
    }
}
```

## junos/routing-instances/evpn-elan/ri-evpn-mac-vrf-vlan-based-irb-no-gateway-community.conf

```
/*
 * Topic: EVPN MAC-VRF instance, VLAN-based service, with an IRB interface and default-gateway no-gateway-community
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 250
 *   total 250
 * Pair with: none
 * Variables (example values from sag_mx304):
 *   $INSTANCE_NAME    e.g. 5G-MIDHAUL-EVPN-L3VPN-IRB-1
 *   $BD_NAME          e.g. BD_EVPN_101
 *   $VLAN_BD          e.g. 101
 *   $AC_IFL           e.g. xe-0/1/3:2.101
 *   $IRB_IFL          e.g. irb.101
 *   $RD_SUB_ASSIGNED  e.g. 101
 *   $RT_ID            e.g. 101
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type mac-vrf;
        protocols {
            evpn {
                default-gateway no-gateway-community;
            }
        }
        bridge-domains {
            $BD_NAME {
                vlan-id $VLAN_BD;
                interface $AC_IFL;
                routing-interface $IRB_IFL;
            }
        }
        service-type vlan-based;
        interface $AC_IFL;
        route-distinguisher 101:$RD_SUB_ASSIGNED;
        vrf-target target:101:$RT_ID;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`, `$IRB_IFL`): required, for each reference; one of `interfaces/ifl-irb-inet-inet6-description`, `interfaces/ifl-irb-inet-inet6-filter-description`, `interfaces/ifl-vlan-bridge-description`

## junos/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf

```
/*
 * Topic: VLAN-aware EVPN-VPWS instance cross-connecting two attachment circuits
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 100
 *   total 100
 * Pair with: none
 * Peers with:
 *   [sag_mx304] <-> [ag1_1_acx7509, ag1_2_acx7100-32c]
 * Variables (example values from sag_mx304):
 *   $INSTANCE_NAME    e.g. MIDHUAL-EVPN-FXC-MH-1
 *   $AC_INTF_A        e.g. xe-0/1/3:3.2701
 *   $SVC_ID_LOCAL_A   e.g. 1
 *   $SVC_ID_REMOTE_A  e.g. 2
 *   $AC_INTF_B        e.g. xe-0/1/3:3.2801
 *   $SVC_ID_LOCAL_B   e.g. 101
 *   $SVC_ID_REMOTE_B  e.g. 102
 *   $LOOPBACK_V4      e.g. 192.168.1.11
 *   $RD_SUB_ASSIGNED  e.g. 3801
 *   $RT_AS            e.g. 63535
 *   $RT_ID            e.g. 3801
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_INTF_A`, `$AC_INTF_B`): required, for each reference; `interfaces/ifl-vlan-ccc-description`

## junos/routing-instances/evpn-vpws/ri-evpn-vpws-flow-label-static.conf

```
/*
 * Topic: EVPN-VPWS instance with static flow-label transmit and receive
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 200
 *   total 200
 * Pair with: none
 * Peers with:
 *   [an4_acx7024] <-> [sag_mx304]
 * Variables (example values from sag_mx304):
 *   $INSTANCE_NAME       e.g. MBH-EVPN-VPWS-SH-TO-AN4-1
 *   $AC_IFL              e.g. xe-0/1/3:3.501
 *   $VPWS_SVC_ID_LOCAL   e.g. 2
 *   $VPWS_SVC_ID_REMOTE  e.g. 1
 *   $LOOPBACK_V4         e.g. 192.168.1.11
 *   $RD_SUB_ASSIGNED     e.g. 3951
 *   $RT_ID               e.g. 3951
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_IFL {
                    vpws-service-id {
                        local $VPWS_SVC_ID_LOCAL;
                        remote $VPWS_SVC_ID_REMOTE;
                    }
                }
                flow-label-transmit-static;
                flow-label-receive-static;
            }
        }
        interface $AC_IFL;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:63535:$RT_ID;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`): required, for each reference; `interfaces/ifl-vlan-ccc-description`

## junos/routing-instances/l3vpn/ri-l3vpn-ebgp-v4-v6-as-override.conf

```
/*
 * Topic: L3VPN VRF with IPv4 and IPv6 eBGP sessions to the CE using as-override, and vrf-table-label
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 100
 *   total 100
 * Pair with: none
 * Variables (example values from sag_mx304):
 *   $INSTANCE_NAME    e.g. MBH-L3VPN-1
 *   $BGP_GROUP_V4     e.g. v4ixia
 *   $CE_PEER_V4       e.g. 10.18.7.206
 *   $PE_LOCAL_V4      e.g. 10.18.7.205
 *   $ASN_CUSTOMER     e.g. 64516
 *   $BGP_GROUP_V6     e.g. v6ixia
 *   $CE_PEER_V6       e.g. 2001:db8::18:1:7:7cf
 *   $PE_LOCAL_V6      e.g. 2001:db8::18:1:7:7cd
 *   $DESCRIPTION      e.g. L3-MBH-AND-5G-FRONTHAUL-L3VPN-1
 *   $AC_IFL           e.g. xe-0/1/3:2.1
 *   $LOOPBACK_V4      e.g. 192.168.1.11
 *   $RD_SUB_ASSIGNED  e.g. 1
 *   $RT_ID            e.g. 1
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        protocols {
            bgp {
                group $BGP_GROUP_V4 {
                    type external;
                    family inet {
                        any;
                    }
                    neighbor $CE_PEER_V4 {
                        local-address $PE_LOCAL_V4;
                        peer-as $ASN_CUSTOMER;
                        as-override;
                    }
                }
                group $BGP_GROUP_V6 {
                    type external;
                    family inet6 {
                        any;
                    }
                    neighbor $CE_PEER_V6 {
                        local-address $PE_LOCAL_V6;
                        peer-as $ASN_CUSTOMER;
                        as-override;
                    }
                }
            }
        }
        description $DESCRIPTION;
        interface $AC_IFL;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:63535:$RT_ID;
        vrf-table-label;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`): required, for each reference; `interfaces/ifl-vlan-inet-inet6-description`

## junos/routing-instances/l3vpn/ri-l3vpn-irb-router-id-vrf-table-label.conf

```
/*
 * Topic: L3VPN VRF with one IRB interface, a router ID and vrf-table-label
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 500
 *   total 500
 * Pair with: none
 * Variables (example values from sag_mx304):
 *   $INSTANCE_NAME    e.g. 5G-MIDHAUL-L3VPN-EVPN-IRB-1
 *   $ROUTER_ID        e.g. 192.168.1.11
 *   $DESCRIPTION      e.g. 5G-MIDHAUL-EVPN-IRB-ANYCAST-GW-L3VPN-MH-1
 *   $IRB_IFL          e.g. irb.101
 *   $LOOPBACK_V4      e.g. 192.168.1.11
 *   $RD_SUB_ASSIGNED  e.g. 5000
 *   $RT_ID            e.g. 5000
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            router-id $ROUTER_ID;
        }
        description $DESCRIPTION;
        interface $IRB_IFL;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:63535:$RT_ID;
        vrf-table-label;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `irb-service`: required, all related; one of `bridge-domains/bridge-domain-irb`, `routing-instances/evpn-elan/ri-evpn-mac-vrf-vlan-based-irb-no-gateway-community`, `routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni`, `routing-instances/evpn-vpws/ri-evpn-vpws-flow-label-static`, `routing-instances/l3vpn/ri-l3vpn-ebgp-v4-v6-as-override`, `routing-instances/l3vpn/ri-l3vpn-irb-router-id-vrf-table-label`, `routing-instances/vpls/ri-bgp-vpls-virtual-switch-flow-label`
- `logical-interface` (`$IRB_IFL`): required, for each reference; one of `interfaces/ifl-irb-inet-inet6-description`, `interfaces/ifl-irb-inet-inet6-filter-description`

## junos/routing-instances/vpls/ri-bgp-vpls-virtual-switch-flow-label.conf

```
/*
 * Topic: BGP-signalled VPLS virtual switch with flow-label transmit and receive (FAT pseudowire) and one bridge domain
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 2000
 *   total 2000
 * Pair with: none
 * Variables (example values from sag_mx304):
 *   $INSTANCE_NAME    e.g. L2-MIDHAUL-BGP-VPLS-TO-AG1-2-300
 *   $VPLS_SITE        e.g. r2
 *   $VPLS_SITE_ID     e.g. 1011
 *   $DESCRIPTION      e.g. Midhaul-BGP-VPLS-HSR-to-AG1-2-with-FAT-PW-300
 *   $BD_NAME          e.g. vlan1000
 *   $VLAN_BD          e.g. 1000
 *   $AC_IFL           e.g. xe-0/1/3:0.1000
 *   $LOOPBACK_V4      e.g. 192.168.1.11
 *   $RD_SUB_ASSIGNED  e.g. 1900
 *   $RT_ID            e.g. 1900
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-switch;
        protocols {
            vpls {
                site $VPLS_SITE {
                    site-identifier $VPLS_SITE_ID;
                }
                site-range 65534;
                label-block-size 4;
                no-tunnel-services;
                flow-label-transmit;
                flow-label-receive;
            }
        }
        description $DESCRIPTION;
        bridge-domains {
            $BD_NAME {
                vlan-id $VLAN_BD;
                interface $AC_IFL;
            }
        }
        interface $AC_IFL;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:63535:$RT_ID;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`): required, for each reference; `interfaces/ifl-vlan-bridge-description`

## junos/routing-options/auto-bandwidth-template.conf

```
/*
 * Topic: Auto-bandwidth template with adjust interval, threshold, statistics interval and subscription
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    auto-bandwidth {
        template {
            auto_bw_temp1 {
                adjust-interval 900;
                adjust-threshold 50;
                statistic-collection-interval 60;
                auto-bandwidth-subscription 100;
            }
        }
    }
}
```

## junos/routing-options/autonomous-system.conf

```
/*
 * Topic: Device autonomous-system number
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   sag_mx304 1
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag2_1_mx204):
 *   $ASN  e.g. 63535
 */
routing-options {
  autonomous-system $ASN;
}
```

## junos/routing-options/forwarding-table-pplb-chained-nh-evpn.conf

```
/*
 * Topic: Forwarding-table per-packet load balancing with chained composite next hops for EVPN
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag2_1_mx204):
 *   $PPLB_NAME  e.g. PPLB
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
        chained-composite-next-hop {
            ingress {
                evpn;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$PPLB_NAME`): required, for each reference; `policy-options/policy-statement/per-packet-load-balance`

## junos/routing-options/forwarding-table-pplb-chained-nh-l2ckt-evpn-l3vpn.conf

```
/*
 * Topic: Forwarding-table load-balance export with chained composite next hops for L2 circuit, EVPN and L3VPN
 * Seen on:
 *   Junos: ag3_1_mx480 ag3_2_mx480
 *   EVO: (none)
 * Count:
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag3_1_mx480):
 *   $PPLB_NAME  e.g. PPLB
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
        chained-composite-next-hop {
            ingress {
                l2ckt;
                evpn;
                l3vpn;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$PPLB_NAME`): required, for each reference; `policy-options/policy-statement/per-packet-load-balance`

## junos/routing-options/forwarding-table-pplb-ecmp-fast-reroute-chained-nh-l2ckt-evpn-l3vpn.conf

```
/*
 * Topic: Forwarding-table load-balance export with ECMP fast reroute and chained composite next hops for L2 circuit, EVPN and L3VPN
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from sag_mx304):
 *   $PPLB_NAME  e.g. PPLB
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
        ecmp-fast-reroute;
        chained-composite-next-hop {
            ingress {
                l2ckt;
                evpn;
                l3vpn;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$PPLB_NAME`): required, for each reference; `policy-options/policy-statement/per-packet-load-balance`

## junos/routing-options/interface-routes-rib-group-inet.conf

```
/*
 * Topic: Interface routes added to the from-inet0-to-inet3 RIB group
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with:
 *  - junos/routing-options/rib-groups-from-inet0-to-inet3.conf
 *
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    interface-routes {
        rib-group inet from-inet0-to-inet3;
    }
}
```

## junos/routing-options/no-multi-topology-routing.conf

```
/*
 * Topic: Multi-topology routing disabled
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    no-multi-topology-routing;
}
```

## junos/routing-options/rib-groups-from-inet0-to-inet3.conf

```
/*
 * Topic: RIB group copying inet.0 routes into inet.3
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    rib-groups {
        from-inet0-to-inet3 {
            import-rib [ inet.3 inet.0 ];
        }
    }
}
```

## junos/routing-options/rib-groups-inet3-to-inet0-inet6-3.conf

```
/*
 * Topic: RIB group copying inet.3 routes into inet.0 and inet6.3 through ALLOW_LOOPBACK
 * Seen on:
 *   Junos: sag_mx304
 *   EVO: (none)
 * Count:
 *   sag_mx304 1
 *   total 1
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-loopback-allow.conf
 *
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    rib-groups {
        inet3-to-inet0 {
            import-rib [ inet.3 inet.0 inet6.3 ];
            import-policy ALLOW_LOOPBACK;
        }
    }
}
```

## junos/routing-options/router-id.conf

```
/*
 * Topic: Transport router identity
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO: (none)
 * Count:
 *   ag2_1_mx204 1
 *   ag2_2_mx204 1
 *   ag3_1_mx480 1
 *   ag3_2_mx480 1
 *   sag_mx304 1
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ag2_1_mx204):
 *   $ROUTER_ID  e.g. 192.168.1.5
 */
routing-options {
    router-id $ROUTER_ID;
}
```

## junos/vlans/vlan-2-interfaces.conf

```
/*
 * Topic: VLAN with two member interfaces
 * Seen on:
 *   Junos: du_qfx5210
 *   EVO: (none)
 * Count:
 *   du_qfx5210 1150
 *   total 1150
 * Pair with: none
 * Variables (example values from du_qfx5210):
 *   $VLAN_NAME  e.g. BD_FRONTHAUL_EVPN_VPWS_MH_1000
 *   $VLAN_BD    e.g. 1000
 *   $AC_IFL_A   e.g. ae26.1000
 *   $AC_IFL_B   e.g. xe-0/0/6:2.1000
 */
vlans {
    $VLAN_NAME {
        vlan-id $VLAN_BD;
        interface $AC_IFL_A;
        interface $AC_IFL_B;
    }
}
```

## _variables.md

# Snippet variable glossary

All `.conf` files under `junos/` and `evo/` are templates: identifiers that vary between deployments are written
as `$VAR`. Render a snippet by substituting each placeholder with your deployment's value. The placeholders each
snippet uses are listed in its `Variables:` header and in the glossary below. Variable names and meanings follow
the shared JVD snippet vocabulary. Lettered and numbered
variables (`_A`…`_E`, `_1`, `_2`, …) form an ordered set; the letters and numbers carry no other meaning.

Values left literal on purpose: the class-of-service names (forwarding classes `FC-*`, schedulers `SC-*`, the
scheduler map `SM-5G-SCHEDULER`, classifiers `CL-*` and rewrite rules `RR-*`), the routing policy, community, prefix-list
and RIB-group names other configuration references by name, the IS-IS SRGB and levels, the CFM level and timers,
the VPLS `site-range 65534` and `label-block-size 4`, `mtu 9190`, `maximum-labels 5`, the LACP settings, `unit 0` and
the loopback `lo0.0`, and the per-endpoint MAC lists of the multifield filters.

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `63535` |
| `$ASN_CUSTOMER` | Customer-facing BGP peer autonomous-system number. | `64518` |
| `$ASN_INTER_AS` | Autonomous-system number of the inter-AS eBGP peers (the other AS of the design). | `63536` |
| `$IBGP_PEER_V4` | IPv4 address of an internal BGP neighbor. | `192.168.1.4` |
| `$IBGP_PEER_V4_1` | IPv4 loopback of an internal BGP neighbor; `_1`, `_2` order the neighbors. | `192.168.1.3` |
| `$IBGP_PEER_V4_2` | IPv4 loopback of an internal BGP neighbor; `_1`, `_2` order the neighbors. | `192.168.1.4` |
| `$IBGP_PEER_V4_3` | IPv4 loopback of an internal BGP neighbor; `_1`, `_2` order the neighbors. | `192.168.1.2` |
| `$LOOPBACK_ALT_V4_PFX` | Secondary IPv4 address with prefix length on loopback unit 0 (`192.168.10.x` in this JVD). | `192.168.10.3/32` |
| `$LOOPBACK_ALT_V6_PFX` | Secondary IPv6 address with prefix length on loopback unit 0. | `2001:db8::1:1:10:3/128` |
| `$LOOPBACK_ANYCAST_V4` | Secondary IPv4 loopback address, written with `/32` in the body (sag in this JVD; distinct per router, not shared). | `192.168.10.11` |
| `$LOOPBACK_SR_V4` | Segment Routing non-zero IPv4 loopback address. | `192.168.10.3` |
| `$LOOPBACK_SR_V6` | Secondary IPv6 loopback address, written with `/128` in the body. | `2001:db8::1:1:10:3` |
| `$LOOPBACK_V4` | Primary per-node IPv4 loopback address. | `192.168.1.4` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on a loopback unit (`lo0.0` or a per-VRF `lo0.<n>`). | `192.168.1.3/32` |
| `$LOOPBACK_V6_PFX` | This node's lo0 IPv6 written with its `/128` prefix length. | `2001:db8::1:1:0:3/128` |
| `$ROUTER_ID` | Complete router identifier in IPv4 dotted-decimal form. | `192.168.1.3` |
| `$RR1_V4` | IPv4 loopback of a BGP route reflector this node peers with; `RR1`, `RR2` order the reflectors. | `192.168.1.9` |
| `$RR2_V4` | IPv4 loopback of a second BGP route reflector. | `192.168.1.10` |

## Interfaces and optics

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address on a routed attachment-circuit unit. | `10.31.167.1/24` |
| `$AC_ADDR_V6` | IPv6 address on a routed attachment-circuit unit. | `2001:db8::1fa6:11/112` |
| `$AC_IFL` | Full logical attachment-circuit interface identifier, including its unit. | `ae26.517` |
| `$AC_IFL_A` | First attachment logical interface (with unit) of a set; `_A`…`_E` order the members. | `ae26.1000` |
| `$AC_IFL_B` | Second attachment logical interface (with unit) of a set. | `xe-0/0/6:2.1000` |
| `$AE_BUNDLE` | Aggregated-Ethernet bundle a member link joins (`802.3ad`). | `ae19` |
| `$AE_DEVICE_COUNT` | Number of aggregated-Ethernet devices the chassis allocates. | `25` |
| `$CORE_INTF` | Core-facing LAG unit used for ISIS+MPLS underlay. | `ae19.0` |
| `$CORE_INTF_1` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `ae19.0` |
| `$CORE_INTF_2` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `ae24.0` |
| `$CORE_INTF_3` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-0/0/49.0` |
| `$CORE_INTF_4` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-0/0/0.0` |
| `$CORE_INTF_5` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `ae5.0` |
| `$CORE_V4_ADDR` | Core interface IPv4 address. | `10.10.0.10/30` |
| `$CORE_V6_ADDR` | Core interface IPv6 address. | `2001:db8::10:10:0:b/126` |
| `$COS_INTF` | Interface to which the class-of-service configuration is applied, physical or aggregated and independent of topology role. | `ae19` |
| `$DESCRIPTION` | Free-text interface `description`. | `TO-DU` |
| `$FPC_SLOT` | FPC slot for a complete source-measured hardware profile. | `2` |
| `$IFD` | Interface-device identifier, excluding a logical unit. | `ae26` |
| `$IRB_IFL` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN or bridge domain, or a VRF member. | `irb.101` |
| `$IRB_MAC` | MAC address configured on an IRB unit (`mac`). | `00:00:00:00:00:a7` |
| `$IRB_UNIT` | irb.X unit number for IRB integration. | `517` |
| `$LACP_SYS_ID` | LACP system-id on a multihomed LAG. | `00:00:00:00:00:01` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `3801` |
| `$VLAN` | A single VLAN identifier. | `351` |
| `$VLAN_BD` | bridge-domain or mac-vrf vlan-id. | `101` |
| `$VLAN_NAME` | Name of a `vlans` definition (a VLAN set or range) referenced by trunk members and bundle instances. | `5G-MIDHAUL-L3VPN-BD-351` |

## Services

| Variable | What it is | Example value |
|---|---|---|
| `$AC_INTF` | Customer-facing attachment-circuit unit (with VLAN id when tagged). | `ae26.1000` |
| `$AC_INTF_A` | First attachment logical interface (with unit) of a flexible cross-connect instance. | `ae26.2601` |
| `$AC_INTF_B` | Second attachment logical interface (with unit) of a flexible cross-connect instance. | `ae26.2651` |
| `$BD_NAME` | bridge-domain / MAC-VRF bridge-domain name. | `BD_EVPN_101` |
| `$BGP_GROUP` | Name of a BGP group (CE-facing group in a VRF, or a CE's group toward a WAN edge). | `ebgp_sag` |
| `$BGP_GROUP_V4` | Name of the IPv4 eBGP group toward the CE in a VRF. | `v4ixia` |
| `$BGP_GROUP_V6` | Name of the IPv6 eBGP group toward the CE in a VRF. | `v6ixia` |
| `$CE_PEER_V4` | IPv4 address of the external BGP peer (CE). | `10.16.7.206` |
| `$CE_PEER_V6` | IPv6 address of the external BGP peer (CE). | `2001:db8::16:1:7:7cf` |
| `$CLUSTER_ID` | Route-reflector cluster identifier (`cluster`) of an iBGP group. | `192.168.1.9` |
| `$ESI` | 10-byte ESI (for EVPN multihoming). | `00:88:11:11:11:11:11:00:00:00` |
| `$INPUT_FILTER` | Firewall filter name applied as `filter input`. | `FF-MF-EVPN-VPWS-MH-TO-AN1` |
| `$INPUT_FILTER_V4` | Name of an IPv4 firewall filter: defines the filter and applies it as an input filter. | `FF-MFC-IPV4-L3VPN-BD-IRB` |
| `$INPUT_FILTER_V6` | Name of an IPv6 firewall filter: defines the filter and applies it as an input filter. | `FF-MFC-IPV6-L3VPN-BD-IRB` |
| `$INSTANCE_NAME` | Identity stem of a service instance: the routing-instance name, or the shared name of a hub-and-spoke policy and its community. | `5G-MIDHAUL-EVPN-L3VPN-IRB-1` |
| `$INTER_AS_PEER_V4` | IPv4 address of an inter-AS eBGP neighbor in the other autonomous system of the design (Option B or C): a link address or a loopback for multihop sessions. | `10.10.0.54` |
| `$INTER_AS_PEER_V4_1` | IPv4 address of an inter-AS eBGP neighbor; `_1`, `_2` order the neighbors of one group. | `10.10.0.49` |
| `$INTER_AS_PEER_V4_2` | IPv4 address of an inter-AS eBGP neighbor; `_1`, `_2` order the neighbors of one group. | `10.10.0.53` |
| `$ISIS_NET` | ISIS NET (area + system-id) configured on lo0. | `49.1022.1001.0000.0008.00` |
| `$MA_ID` | CFM maintenance-association identifier. | `2501` |
| `$MD_NAME` | CFM maintenance-domain name. | `MD_63535` |
| `$MEP_LOCAL` | Local MEP identifier. | `1003` |
| `$MEP_REMOTE` | Remote MEP identifier (single-remote form). | `1001` |
| `$PE_LOCAL_V4` | Local IPv4 address of the PE side of a CE eBGP session (`local-address`). | `10.16.7.205` |
| `$PE_LOCAL_V6` | Local IPv6 address of the PE side of a CE eBGP session (`local-address`). | `2001:db8::16:1:7:7cd` |
| `$PIC_SLOT` | PIC slot within an FPC. | `1` |
| `$POLICY_NAME` | Name of a routing policy whose body is shared by several differently named policies. | `ALLOW_LOOPBACK` |
| `$PPLB_NAME` | Per-packet load-balance policy name — a label proven to vary across otherwise-identical deployed forms. | `PPLB` |
| `$PREFIX` | Prefix a route-filter matches where the prefix itself is what the policy selects. | `0.0.0.0/32` |
| `$RD_SUB_ASSIGNED` | Route Distinguisher Assigned Number subfield. | `101` |
| `$REMOTE_PE_V4` | Remote PE loopback used in static l2circuit / LDP-VPLS neighbour lines. | `192.168.1.11` |
| `$RT_AS` | Route Target Administrator subfield. | `63535` |
| `$RT_ID` | Route Target Assigned Number subfield. | `101` |
| `$SR_INDEX_V4` | Segment-routing node index attached to the IPv4 loopback prefix (`prefix-segment index`). | `208` |
| `$SR_INDEX_V6` | Segment-routing node index attached to the IPv6 loopback prefix (`prefix-segment index`). | `308` |
| `$STATIC_ARP_V4` | IPv4 address of a static ARP entry on an IRB unit. | `10.31.167.2` |
| `$STATIC_MAC` | Static MAC address configured on an interface device. | `00:99:00:00:00:a7` |
| `$STATIC_NDP_V6` | IPv6 address of a static NDP entry on an IRB unit. | `2001:db8::1fa6:12` |
| `$SVC_ID_LOCAL_A` | Local VPWS service identifier of the first attachment circuit of a flexible cross-connect. | `2` |
| `$SVC_ID_LOCAL_B` | Local VPWS service identifier of the second attachment circuit of a flexible cross-connect. | `102` |
| `$SVC_ID_REMOTE_A` | Remote VPWS service identifier of the first attachment circuit of a flexible cross-connect. | `1` |
| `$SVC_ID_REMOTE_B` | Remote VPWS service identifier of the second attachment circuit of a flexible cross-connect. | `101` |
| `$TS_PIC` | PIC slot that hosts tunnel services. | `0` |
| `$VC_ID` | Virtual-circuit identifier of a Layer 2 circuit, or the VPLS identifier (`vpls-id`). | `1501` |
| `$VGA` | EVPN virtual-gateway address shared by the IRB's redundancy group. | `10.21.167.1` |
| `$VGA_V6` | IPv6 virtual gateway address shared by the routers of an anycast IRB gateway. | `2001:db8::15a6:11` |
| `$VPLS_SITE` | BGP-VPLS site name. | `r2` |
| `$VPLS_SITE_ID` | BGP-VPLS site-identifier. | `1003` |
| `$VPWS_SVC_ID_LOCAL` | EVPN-VPWS local service-id. | `1` |
| `$VPWS_SVC_ID_REMOTE` | EVPN-VPWS remote service-id. | `2` |

## byoai/TIERS.md

> **Tier qualification for this JVD.** Only `minimum` is qualified and selectable.
> The `self-contained` and `as-deployed` entries below are blocked: each service's
> attachment unit is a required selection the library cannot make. They are not
> selectable: never offer or render them.

# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd service_provider/low_latency_queueing`. -->

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

## EVPN-VPWS point-to-point service

Family e-line, form evpn-vpws. OS mode EVO. Attachment: VLAN CCC unit toward the cell site or hub site attachment..

### ag1_1_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF

### ag1_2_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF

### an1_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF

### an4_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF

---

## EVPN-VPWS service with static flow labels (FAT pseudowire)

Family e-line, form evpn-vpws-flow-label-static. OS mode MIXED. Attachment: VLAN CCC unit toward the cell site or service edge attachment..

### an4_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws-flow-label-static.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### sag_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws-flow-label-static.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

---

## EVPN flexible cross-connect, VLAN-aware, two attachment circuits

Family e-line, form evpn-fxc-vlan-aware-2-uni. OS mode MIXED. Attachment: Two VLAN CCC units on the attachment port..

### ag1_1_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF_A
  - occurrence-selection-required: logical-interface:$AC_INTF_B

### ag1_2_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF_A
  - occurrence-selection-required: logical-interface:$AC_INTF_B

### an4_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF_A
  - occurrence-selection-required: logical-interface:$AC_INTF_B

### sag_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF_A
  - occurrence-selection-required: logical-interface:$AC_INTF_B

---

## Layer 2 circuit (LDP pseudowire) with control word

Family e-line, form l2circuit-control-word. OS mode MIXED. Attachment: VLAN CCC unit toward the attachment..

### an1_acx7100-48l (evo)

- `minimum`: `evo/protocols/l2circuit-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### an3_acx7100-48l (evo)

- `minimum`: `evo/protocols/l2circuit-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### an4_acx7024 (evo)

- `minimum`: `evo/protocols/l2circuit-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### sag_mx304 (junos)

- `minimum`: `junos/protocols/l2circuit-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

---

## Layer 2 circuit with control word and static flow labels (FAT pseudowire)

Family e-line, form l2circuit-control-word-flow-label-static. OS mode MIXED. Attachment: VLAN CCC unit toward the attachment..

### ag1_1_acx7509 (evo)

- `minimum`: `evo/protocols/l2circuit-control-word-flow-label-static.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### ag1_2_acx7100-32c (evo)

- `minimum`: `evo/protocols/l2circuit-control-word-flow-label-static.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### sag_mx304 (junos)

- `minimum`: `junos/protocols/l2circuit-control-word-flow-label-static.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

---

## EVPN-ELAN MAC-VRF, VLAN-based service

Family e-lan, form evpn-elan-vlan-based. OS mode EVO. Attachment: VLAN bridge unit on the attachment port..

### ag1_1_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-mac-vrf-vlan-based.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$AC_IFL

### ag1_2_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-mac-vrf-vlan-based.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$AC_IFL

### an4_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-mac-vrf-vlan-based.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$AC_IFL

---

## EVPN MAC-VRF, VLAN-based service, with an IRB interface

Family e-lan, form evpn-elan-vlan-based-irb. OS mode MIXED. Attachment: VLAN bridge unit on the attachment port and an IRB unit for the Layer 3 gateway..

### ag1_1_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-mac-vrf-vlan-based-irb-no-gateway-community.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$IRB_IFL

### ag1_2_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-mac-vrf-vlan-based-irb-no-gateway-community.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$IRB_IFL

### sag_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-mac-vrf-vlan-based-irb-no-gateway-community.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$IRB_IFL
  - occurrence-selection-required: logical-interface:$AC_IFL

---

## BGP-signalled VPLS with flow labels (FAT pseudowire)

Family e-lan, form bgp-vpls-flow-label. OS mode MIXED. Attachment: VLAN bridge unit on the attachment port..

### ag1_1_acx7509 (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-virtual-switch-flow-label.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### ag1_2_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-virtual-switch-flow-label.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### an1_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-virtual-switch-flow-label.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-virtual-switch-flow-label.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### an4_acx7024 (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-virtual-switch-flow-label.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### sag_mx304 (junos)

- `minimum`: `junos/routing-instances/vpls/ri-bgp-vpls-virtual-switch-flow-label.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$AC_IFL

---

## L3VPN VRF with an IRB interface

Family l3vpn, form l3vpn-irb. OS mode MIXED. Attachment: IRB unit that is the Layer 3 interface of a midhaul bridge domain..

### ag1_1_acx7509 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-irb-router-id-vrf-table-label.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_IFL

### ag1_2_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-irb-router-id-vrf-table-label.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_IFL

### sag_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-irb-router-id-vrf-table-label.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_IFL

---

## L3VPN VRF with IPv4 and IPv6 eBGP to the CE

Family l3vpn, form l3vpn-ebgp-v4-v6. OS mode MIXED. Attachment: Dual-stack VLAN unit toward the CE..

### ag1_1_acx7509 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-v4-v6-as-override.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### ag1_2_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-v4-v6-as-override.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### an1_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-v4-v6-as-override.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-v4-v6-as-override.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### an4_acx7024 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-v4-v6-as-override.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### sag_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-v4-v6-as-override.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

---

## byoai/DEFAULTS.md

# DEFAULTS — Low Latency QoS Design for 5G

Lab auto-fill values for the Low Latency QoS Design for 5G JVD. Every value is measured from the published device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks a device and service and asks for lab values; otherwise ask for the deployment values.

## Device inventory

| Role | Device | Platform | OS | Loopback / router-id | `$ASN` |
|------|--------|----------|----|----------------------|--------|
| Access Node / Cell Site Router (CSR) | an1_acx7100-48l | ACX7100-48L | EVO | 192.168.1.1 | 63535 |
| Access Node / Cell Site Router (CSR) | an3_acx7100-48l | ACX7100-48L | EVO | 192.168.1.2 | 63535 |
| Access Node / Cell Site Router (CSR) | an4_acx7024 | ACX7024 | EVO | 192.168.1.0 | 63535 |
| Aggregation: HSR and helper (AG) | ag1_1_acx7509 | ACX7509 | EVO | 192.168.1.3 | 63535 |
| Aggregation: HSR and helper (AG) | ag1_2_acx7100-32c | ACX7100-32C | EVO | 192.168.1.4 | 63535 |
| Aggregation: HSR and helper (AG) | ag2_1_mx204 | MX204 | Junos | 192.168.1.5 | 63535 |
| Aggregation: HSR and helper (AG) | ag2_2_mx204 | MX204 | Junos | 192.168.1.6 | 63535 |
| Aggregation: HSR and helper (AG) | ag3_1_mx480 | MX480 | Junos | 192.168.1.7 | 63535 |
| Aggregation: HSR and helper (AG) | ag3_2_mx480 | MX480 | Junos | 192.168.1.8 | 63535 |
| Core Router (CR) | cr1_ptx10001-36mr | PTX10001-36MR | EVO | 192.168.1.9 | 63535 |
| Core Router (CR) | cr2_ptx10001-36mr | PTX10001-36MR | EVO | 192.168.1.10 | 63535 |
| Services Aggregation Gateway (SAG) | sag_mx304 | MX304 | Junos | 192.168.1.11 | 63536 |
| O-DU Switch (DU) | du_qfx5210 | QFX5210 | Junos | — | — |

## Service examples (first measured instance per router)

| Service form | Device | Example values |
|--------------|--------|----------------|
| evpn-vpws | an1_acx7100-48l | `$AC_INTF` et-0/0/2.1101, `$INSTANCE_NAME` FRONTHAUL-EVPN-VPWS-MH-1, `$LOOPBACK_V4` 192.168.1.0, `$RD_SUB_ASSIGNED` 3601, `$RT_AS` 63535, `$RT_ID` 3601 |
| evpn-vpws | an3_acx7100-48l | `$AC_INTF` et-0/0/0.1000, `$INSTANCE_NAME` FRONTHAUL-EVPN-VPWS-MH-100, `$LOOPBACK_V4` 192.168.1.2, `$RD_SUB_ASSIGNED` 3500, `$RT_AS` 63535, `$RT_ID` 3500 |
| evpn-vpws | an4_acx7024 | `$AC_INTF` et-0/0/4.1001, `$INSTANCE_NAME` FRONTHAUL-EVPN-VPWS-MH-1, `$LOOPBACK_V4` 192.168.1.0, `$RD_SUB_ASSIGNED` 3501, `$RT_AS` 63535, `$RT_ID` 3501 |
| evpn-vpws | ag1_1_acx7509 | `$AC_INTF` ae26.1000, `$INSTANCE_NAME` FRONTHAUL-EVPN-VPWS-MH-AN1-100, `$LOOPBACK_V4` 192.168.1.3, `$RD_SUB_ASSIGNED` 3500, `$RT_AS` 63535, `$RT_ID` 3500 |
| evpn-vpws | ag1_2_acx7100-32c | `$AC_INTF` ae26.1000, `$INSTANCE_NAME` FRONTHAUL-EVPN-VPWS-MH-AN1-100, `$LOOPBACK_V4` 192.168.1.4, `$RD_SUB_ASSIGNED` 3500, `$RT_AS` 63535, `$RT_ID` 3500 |
| evpn-vpws-flow-label-static | an4_acx7024 | `$AC_IFL` et-0/0/4.501, `$INSTANCE_NAME` MBH-EVPN-VPWS-SH-TO-SAG-1, `$LOOPBACK_V4` 192.168.1.0, `$RD_SUB_ASSIGNED` 3951, `$RT_ID` 3951, `$VPWS_SVC_ID_LOCAL` 1 |
| evpn-vpws-flow-label-static | sag_mx304 | `$AC_IFL` xe-0/1/3:3.501, `$INSTANCE_NAME` MBH-EVPN-VPWS-SH-TO-AN4-1, `$LOOPBACK_V4` 192.168.1.11, `$RD_SUB_ASSIGNED` 3951, `$RT_ID` 3951, `$VPWS_SVC_ID_LOCAL` 2 |
| evpn-fxc-vlan-aware-2-uni | an4_acx7024 | `$AC_INTF_A` et-0/0/4.2501, `$AC_INTF_B` et-0/0/4.2551, `$INSTANCE_NAME` 5G-FRONTHAUL-EVPN-FXC-SH-AG1-1-1, `$LOOPBACK_V4` 192.168.1.0, `$RD_SUB_ASSIGNED` 3701, `$RT_AS` 63535 |
| evpn-fxc-vlan-aware-2-uni | ag1_1_acx7509 | `$AC_INTF_A` ae26.2601, `$AC_INTF_B` ae26.2651, `$INSTANCE_NAME` 5G-FRONTHAUL-EVPN-FXC-MH-1, `$LOOPBACK_V4` 192.168.1.3, `$RD_SUB_ASSIGNED` 3751, `$RT_AS` 63535 |
| evpn-fxc-vlan-aware-2-uni | ag1_2_acx7100-32c | `$AC_INTF_A` ae26.2601, `$AC_INTF_B` ae26.2651, `$INSTANCE_NAME` 5G-FRONTHAUL-EVPN-FXC-MH-1, `$LOOPBACK_V4` 192.168.1.4, `$RD_SUB_ASSIGNED` 3751, `$RT_AS` 63535 |
| evpn-fxc-vlan-aware-2-uni | sag_mx304 | `$AC_INTF_A` xe-0/1/3:3.2701, `$AC_INTF_B` xe-0/1/3:3.2801, `$INSTANCE_NAME` MIDHUAL-EVPN-FXC-MH-1, `$LOOPBACK_V4` 192.168.1.11, `$RD_SUB_ASSIGNED` 3801, `$RT_AS` 63535 |
| l2circuit-control-word | an1_acx7100-48l | `$AC_IFL` et-0/0/2.1301, `$REMOTE_PE_V4` 192.168.1.11, `$VC_ID` 1301 |
| l2circuit-control-word | an3_acx7100-48l | `$AC_IFL` et-0/0/0.1001, `$REMOTE_PE_V4` 192.168.1.11, `$VC_ID` 1001 |
| l2circuit-control-word | an4_acx7024 | `$AC_IFL` et-0/0/4.1201, `$REMOTE_PE_V4` 192.168.1.11, `$VC_ID` 1201 |
| l2circuit-control-word | sag_mx304 | `$AC_IFL` xe-0/1/3:2.1001, `$REMOTE_PE_V4` 192.168.1.2, `$VC_ID` 1001 |
| l2circuit-control-word-flow-label-static | ag1_1_acx7509 | `$AC_IFL` et-1/0/1.1501, `$REMOTE_PE_V4` 192.168.1.11, `$VC_ID` 1501 |
| l2circuit-control-word-flow-label-static | ag1_2_acx7100-32c | `$AC_IFL` et-0/0/2:0.2501, `$REMOTE_PE_V4` 192.168.1.11, `$VC_ID` 2501 |
| l2circuit-control-word-flow-label-static | sag_mx304 | `$AC_IFL` xe-0/1/3:2.1501, `$REMOTE_PE_V4` 192.168.1.3, `$VC_ID` 1501 |
| evpn-elan-vlan-based | an4_acx7024 | `$AC_IFL` et-0/0/4.1501, `$BD_NAME` BD_EVPN_ELAN_1501, `$INSTANCE_NAME` 5G-FRONTHAUL-EVPN-ELAN-MH-1, `$LOOPBACK_V4` 192.168.1.0, `$RD_SUB_ASSIGNED` 3901, `$RT_ID` 3901 |
| evpn-elan-vlan-based | ag1_1_acx7509 | `$AC_IFL` ae26.1501, `$BD_NAME` BD_EVPN_ELAN_1501, `$INSTANCE_NAME` 5G-FRONTHAUL-EVPN-ELAN-MH-1, `$LOOPBACK_V4` 192.168.1.3, `$RD_SUB_ASSIGNED` 3901, `$RT_ID` 3901 |
| evpn-elan-vlan-based | ag1_2_acx7100-32c | `$AC_IFL` ae26.1501, `$BD_NAME` BD_EVPN_ELAN_1501, `$INSTANCE_NAME` 5G-FRONTHAUL-EVPN-ELAN-MH-1, `$LOOPBACK_V4` 192.168.1.4, `$RD_SUB_ASSIGNED` 3901, `$RT_ID` 3901 |
| evpn-elan-vlan-based-irb | ag1_1_acx7509 | `$AC_IFL` ae26.101, `$BD_NAME` BD_EVPN_101, `$INSTANCE_NAME` 5G-MIDHAUL-EVPN-L3VPN-IRB-1, `$IRB_IFL` irb.101, `$RD_SUB_ASSIGNED` 101, `$RT_ID` 101 |
| evpn-elan-vlan-based-irb | ag1_2_acx7100-32c | `$AC_IFL` ae26.101, `$BD_NAME` BD_EVPN_101, `$INSTANCE_NAME` 5G-MIDHAUL-EVPN-L3VPN-IRB-1, `$IRB_IFL` irb.101, `$RD_SUB_ASSIGNED` 101, `$RT_ID` 101 |
| evpn-elan-vlan-based-irb | sag_mx304 | `$AC_IFL` xe-0/1/3:2.101, `$BD_NAME` BD_EVPN_101, `$INSTANCE_NAME` 5G-MIDHAUL-EVPN-L3VPN-IRB-1, `$IRB_IFL` irb.101, `$RD_SUB_ASSIGNED` 101, `$RT_ID` 101 |
| bgp-vpls-flow-label | an1_acx7100-48l | `$AC_IFL` et-0/0/2.1651, `$BD_NAME` vlan1651, `$INSTANCE_NAME` L2-MBH-BGP-VPLS-1, `$LOOPBACK_V4` 192.168.1.1, `$RD_SUB_ASSIGNED` 651, `$RT_ID` 651 |
| bgp-vpls-flow-label | an3_acx7100-48l | `$AC_IFL` et-0/0/0.1201, `$BD_NAME` vlan1201, `$INSTANCE_NAME` MBH-VPLS-RT1-RT6-1, `$LOOPBACK_V4` 192.168.1.2, `$RD_SUB_ASSIGNED` 101, `$RT_ID` 101 |
| bgp-vpls-flow-label | an4_acx7024 | `$AC_IFL` et-0/0/4.101, `$BD_NAME` vlan101, `$INSTANCE_NAME` L2-MBH-BGP-VPLS-1, `$LOOPBACK_V4` 192.168.1.0, `$RD_SUB_ASSIGNED` 551, `$RT_ID` 551 |
| bgp-vpls-flow-label | ag1_1_acx7509 | `$AC_IFL` et-1/0/1.201, `$BD_NAME` vlan201, `$INSTANCE_NAME` L2-MIDHAUL-BGP-VPLS-TO-SAG-1, `$LOOPBACK_V4` 192.168.1.3, `$RD_SUB_ASSIGNED` 1101, `$RT_ID` 1101 |
| bgp-vpls-flow-label | ag1_2_acx7100-32c | `$AC_IFL` et-0/0/2:0.1000, `$BD_NAME` vlan1000, `$INSTANCE_NAME` L2-MIDHAUL-BGP-VPLS-TO-SAG-300, `$LOOPBACK_V4` 192.168.1.4, `$RD_SUB_ASSIGNED` 1900, `$RT_ID` 1900 |
| bgp-vpls-flow-label | sag_mx304 | `$AC_IFL` xe-0/1/3:0.1000, `$BD_NAME` vlan1000, `$INSTANCE_NAME` L2-MIDHAUL-BGP-VPLS-TO-AG1-2-300, `$LOOPBACK_V4` 192.168.1.11, `$RD_SUB_ASSIGNED` 1900, `$RT_ID` 1900 |
| l3vpn-irb | ag1_1_acx7509 | `$INSTANCE_NAME` 5G-MIDHAUL-L3VPN-EVPN-IRB-1, `$IRB_IFL` irb.101, `$LOOPBACK_V4` 192.168.1.3, `$RD_SUB_ASSIGNED` 5000, `$ROUTER_ID` 192.168.1.3, `$RT_ID` 5000 |
| l3vpn-irb | ag1_2_acx7100-32c | `$INSTANCE_NAME` 5G-MIDHAUL-L3VPN-EVPN-IRB-1, `$IRB_IFL` irb.101, `$LOOPBACK_V4` 192.168.1.4, `$RD_SUB_ASSIGNED` 5000, `$ROUTER_ID` 192.168.1.4, `$RT_ID` 5000 |
| l3vpn-irb | sag_mx304 | `$INSTANCE_NAME` 5G-MIDHAUL-L3VPN-EVPN-IRB-1, `$IRB_IFL` irb.101, `$LOOPBACK_V4` 192.168.1.11, `$RD_SUB_ASSIGNED` 5000, `$ROUTER_ID` 192.168.1.11, `$RT_ID` 5000 |
| l3vpn-ebgp-v4-v6 | an1_acx7100-48l | `$AC_IFL` et-0/0/2.1, `$ASN_CUSTOMER` 64513, `$BGP_GROUP_V4` v4ixia, `$BGP_GROUP_V6` v6ixia, `$CE_PEER_V4` 10.14.7.206, `$CE_PEER_V6` 2001:db8::14:1:7:7cf |
| l3vpn-ebgp-v4-v6 | an3_acx7100-48l | `$AC_IFL` et-0/0/0.1, `$ASN_CUSTOMER` 64514, `$BGP_GROUP_V4` v4ixia, `$BGP_GROUP_V6` v6ixia, `$CE_PEER_V4` 10.15.7.206, `$CE_PEER_V6` 2001:db8::15:1:7:7cf |
| l3vpn-ebgp-v4-v6 | an4_acx7024 | `$AC_IFL` et-0/0/4.1, `$ASN_CUSTOMER` 64511, `$BGP_GROUP_V4` v4ixia, `$BGP_GROUP_V6` v6ixia, `$CE_PEER_V4` 10.11.7.206, `$CE_PEER_V6` 2001:db8::11:1:7:7cf |
| l3vpn-ebgp-v4-v6 | ag1_1_acx7509 | `$AC_IFL` et-1/0/1.1, `$ASN_CUSTOMER` 64518, `$BGP_GROUP_V4` v4ixia, `$BGP_GROUP_V6` v6ixia, `$CE_PEER_V4` 10.16.7.206, `$CE_PEER_V6` 2001:db8::16:1:7:7cf |
| l3vpn-ebgp-v4-v6 | ag1_2_acx7100-32c | `$AC_IFL` et-0/0/2:0.1, `$ASN_CUSTOMER` 64515, `$BGP_GROUP_V4` v4ixia, `$BGP_GROUP_V6` v6ixia, `$CE_PEER_V4` 10.17.7.206, `$CE_PEER_V6` 2001:db8::17:1:7:7cf |
| l3vpn-ebgp-v4-v6 | sag_mx304 | `$AC_IFL` xe-0/1/3:2.1, `$ASN_CUSTOMER` 64516, `$BGP_GROUP_V4` v4ixia, `$BGP_GROUP_V6` v6ixia, `$CE_PEER_V4` 10.18.7.206, `$CE_PEER_V6` 2001:db8::18:1:7:7cf |

Keep the routers of a service consistent: same instance name and route target; swap the local and remote VPWS service identifiers between the two ends of an EVPN-VPWS service.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into `jvd-llq-snips.md` by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: minimum
# devices:
#   an4: { name: <hostname>, os: evo, loopback4: <addr> }
#   sag: { name: <hostname>, os: junos, loopback4: <addr> }
# services:
#   - { kind: <evpn-vpws|evpn-vpws-flow-label-static|evpn-fxc-vlan-aware-2-uni|l2circuit-control-word|l2circuit-control-word-flow-label-static|evpn-elan-vlan-based|evpn-elan-vlan-based-irb|bgp-vpls-flow-label|l3vpn-irb|l3vpn-ebgp-v4-v6>,
#       count: <int>,
#       start_id: <int>,
#       ac_ifl: <ifd.unit>,
#       rt: <rt_as:rt_id>,
#       rd: <admin:assigned> }
# snips_used:
#   - junos/routing-instances/evpn-vpws/ri-evpn-vpws-flow-label-static.conf
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
- Cross-device consistency the user must verify: the routers of one service use the same instance name and route target; an EVPN-VPWS or flexible cross-connect service swaps the local and remote VPWS service identifiers between its two ends; an L2 circuit uses the same virtual-circuit ID at both ends.
- Anything that is by-pattern rather than validated on that exact device.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
