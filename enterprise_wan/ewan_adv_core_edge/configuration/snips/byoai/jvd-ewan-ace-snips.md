# JVD Enterprise WAN Advanced Core and Edge Services snippet library

## evo/chassis/aggregated-devices-ethernet.conf

```
/*
 * Topic: Aggregated Ethernet device count
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l p1_ptx10003 p2_ptx10001-36mr wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 1
 *   p1_ptx10003 1
 *   p2_ptx10001-36mr 1
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 5
 * Highlights:
 *   - Pre-allocates the aggregated Ethernet interfaces the chassis may create.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce1_acx7100-48l):
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

## evo/chassis/fpc-ptx10003-port-speeds-100g-40g.conf

```
/*
 * Topic: PTX10003 line card port speeds
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003
 * Count:
 *   p1_ptx10003 1
 *   total 1
 * Highlights:
 *   - Sets 100G ports with one sub-port and one 40G port across two PICs.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p1_ptx10003):
 *   $FPC_SLOT  e.g. 1
 */
chassis {
    fpc $FPC_SLOT {
        pic 0 {
            port 0 {
                number-of-sub-ports 1;
                speed 100g;
            }
            port 1 {
                speed 40g;
            }
            port 5 {
                number-of-sub-ports 1;
                speed 100g;
            }
            port 8 {
                number-of-sub-ports 1;
                speed 100g;
            }
            port 9 {
                number-of-sub-ports 1;
                speed 100g;
            }
        }
        pic 1 {
            port 4 {
                number-of-sub-ports 1;
                speed 100g;
            }
            port 5 {
                number-of-sub-ports 1;
                speed 100g;
            }
            port 6 {
                number-of-sub-ports 1;
                speed 100g;
            }
            port 7 {
                number-of-sub-ports 1;
                speed 100g;
            }
            port 8 {
                number-of-sub-ports 1;
                speed 100g;
            }
            port 9 {
                number-of-sub-ports 1;
                speed 100g;
            }
        }
    }
}
```

## evo/chassis/network-services-enhanced-ip.conf

```
/*
 * Topic: Enhanced-IP network services mode
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003 p2_ptx10001-36mr wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   p1_ptx10003 1
 *   p2_ptx10001-36mr 1
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 4
 * Highlights:
 *   - Runs the chassis in enhanced-IP mode, required for the Trio and Express feature set used by the services.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
chassis {
    network-services enhanced-ip;
}
```

## evo/class-of-service/classifiers/cl-dscp-exp-ieee8021p-7class.conf

```
/*
 * Topic: DSCP, EXP and IEEE 802.1p classifiers for seven forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Highlights:
 *   - DSCP, EXP and 802.1p classifiers map code points to the seven forwarding classes and loss priorities.
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-7queue-model.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    classifiers {
        dscp DSCP {
            forwarding-class BEST-EFFORT {
                loss-priority low code-points [ af12 af13 ];
            }
            forwarding-class BUSINESS {
                loss-priority low code-points [ cs4 af41 af42 af43 ];
            }
            forwarding-class CONTROL {
                loss-priority low code-points [ cs6 cs7 ];
            }
            forwarding-class LOW {
                loss-priority low code-points [ cs1 af11 ];
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
            }
            forwarding-class BUSINESS {
                loss-priority high code-points 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-points [ 110 111 ];
            }
            forwarding-class LOW {
                loss-priority low code-points 001;
            }
            forwarding-class MEDIUM {
                loss-priority high code-points 010;
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
                loss-priority low code-points [ 110 111 ];
            }
            forwarding-class LOW {
                loss-priority low code-points 001;
            }
            forwarding-class MEDIUM {
                loss-priority high code-points 010;
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

## evo/class-of-service/classifiers/cl-dscp-exp-ieee8021p-8class.conf

```
/*
 * Topic: DSCP, EXP and IEEE 802.1p classifiers for eight forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - DSCP, two EXP (EXP and EXP_DSCP) and 802.1p classifiers map code points to the eight forwarding classes and loss priorities.
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-8queue-model.conf
 *
 * Peers with: n/a
 * Variables: none
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
        exp EXP_DSCP {
            forwarding-class BEST-EFFORT {
                loss-priority low code-points 000;
            }
            forwarding-class BUSINESS {
                loss-priority low code-points 100;
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
                loss-priority low code-points 011;
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

## evo/class-of-service/classifiers/cl-exp-8class.conf

```
/*
 * Topic: MPLS EXP classifier for eight forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003 p2_ptx10001-36mr
 * Count:
 *   p1_ptx10003 1
 *   p2_ptx10001-36mr 1
 *   total 2
 * Highlights:
 *   - Maps each EXP code point to a forwarding class and loss priority.
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-8queue-model.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    classifiers {
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
    }
}
```

## evo/class-of-service/drop-profiles/drop-profiles-fill-level.conf

```
/*
 * Topic: Two fill-level drop profiles
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - dp1 and dp2 set drop probability by queue fill level.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
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
}
```

## evo/class-of-service/forwarding-classes/fc-7queue-model.conf

```
/*
 * Topic: Seven forwarding classes on seven queues
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Highlights:
 *   - BEST-EFFORT, LOW, MEDIUM, SIG-OAM, BUSINESS, REALTIME and CONTROL each map to their own queue.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    forwarding-classes {
        class BEST-EFFORT queue-num 0;
        class BUSINESS queue-num 5;
        class CONTROL queue-num 4;
        class LOW queue-num 6;
        class MEDIUM queue-num 1;
        class REALTIME queue-num 2;
        class SIG-OAM queue-num 3;
    }
}
```

## evo/class-of-service/forwarding-classes/fc-8queue-model.conf

```
/*
 * Topic: Eight forwarding classes on eight queues
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003 p2_ptx10001-36mr wanedge4_acx7100-48l
 * Count:
 *   p1_ptx10003 1
 *   p2_ptx10001-36mr 1
 *   wanedge4_acx7100-48l 1
 *   total 3
 * Highlights:
 *   - BEST-EFFORT, LOW, MEDIUM, SIG-OAM, BUSINESS, REALTIME, NETWORK and CONTROL each map to their own queue.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
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

## evo/class-of-service/interfaces/ifl-dscp-classifier.conf

```
/*
 * Topic: DSCP classifier on a logical interface
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 325
 *   wanedge4_acx7100-48l 325
 *   total 650
 * Highlights:
 *   - Classifies incoming packets on the unit with the DSCP classifier.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $COS_INTF  e.g. irb
 *   $UNIT      e.g. 1851
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                classifiers {
                    dscp DSCP;
                }
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `classifier` (`DSCP`): required, for each reference; one of `class-of-service/classifiers/cl-dscp-exp-ieee8021p-7class`, `class-of-service/classifiers/cl-dscp-exp-ieee8021p-8class`

## evo/class-of-service/interfaces/ifl-exp-classifier-rewrite-ieee8021p-rewrite.conf

```
/*
 * Topic: EXP classifier with EXP and 802.1p rewrite on a logical interface
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 3
 *   wanedge4_acx7100-48l 3
 *   total 6
 * Highlights:
 *   - Classifies on EXP and rewrites both the EXP bits and 802.1p.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $COS_INTF  e.g. et-1/0/0
 *   $UNIT      e.g. 0
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
                    ieee-802.1 8021P-REWRITE;
                }
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `classifier` (`EXP`): required, for each reference; one of `class-of-service/classifiers/cl-dscp-exp-ieee8021p-7class`, `class-of-service/classifiers/cl-dscp-exp-ieee8021p-8class`

## evo/class-of-service/interfaces/ifl-exp-classifier-rewrite.conf

```
/*
 * Topic:   Per-unit EXP classifier and rewrite application
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003 p2_ptx10001-36mr
 * Count:
 *   p1_ptx10003 4
 *   p2_ptx10001-36mr 4
 *   total 8
 * Pair with:
 *  - evo/class-of-service/classifiers/cl-exp-8class.conf
 *
 * Peers with: n/a
 * Variables (example values from p1_ptx10003):
 *   $COS_INTF  e.g. ae2
 *   $UNIT      e.g. 0
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

## evo/class-of-service/interfaces/ifl-ieee8021p-classifier.conf

```
/*
 * Topic:   Per-unit 802.1p classifier application
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 2475
 *   wanedge4_acx7100-48l 2475
 *   total 4950
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $COS_INTF  e.g. ae0
 *   $UNIT      e.g. 1
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `classifier` (`8021P`): required, for each reference; one of `class-of-service/classifiers/cl-dscp-exp-ieee8021p-7class`, `class-of-service/classifiers/cl-dscp-exp-ieee8021p-8class`

## evo/class-of-service/rewrite-rules/rr-dscp-exp-ieee8021p-8class.conf

```
/*
 * Topic: DSCP, EXP and IEEE 802.1p rewrite rules for eight forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - Marks DSCP, EXP and 802.1p from forwarding class and loss priority.
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-8queue-model.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    rewrite-rules {
        dscp DSCP-REWRITE {
            forwarding-class BEST-EFFORT {
                loss-priority low code-point be;
            }
            forwarding-class BUSINESS {
                loss-priority low code-point cs4;
            }
            forwarding-class CONTROL {
                loss-priority low code-point cs7;
            }
            forwarding-class LOW {
                loss-priority low code-point cs1;
            }
            forwarding-class MEDIUM {
                loss-priority high code-point cs2;
            }
            forwarding-class NETWORK {
                loss-priority low code-point cs6;
            }
            forwarding-class REALTIME {
                loss-priority low code-point cs5;
            }
            forwarding-class SIG-OAM {
                loss-priority low code-point cs3;
            }
        }
        exp EXP-REWRITE {
            forwarding-class BEST-EFFORT {
                loss-priority high code-point 000;
            }
            forwarding-class BUSINESS {
                loss-priority high code-point 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-point 111;
            }
            forwarding-class LOW {
                loss-priority low code-point 001;
            }
            forwarding-class MEDIUM {
                loss-priority high code-point 010;
            }
            forwarding-class NETWORK {
                loss-priority high code-point 110;
            }
            forwarding-class REALTIME {
                loss-priority low code-point 101;
            }
            forwarding-class SIG-OAM {
                loss-priority high code-point 011;
            }
        }
        ieee-802.1 8021P-REWRITE {
            forwarding-class BEST-EFFORT {
                loss-priority high code-point 000;
            }
            forwarding-class BUSINESS {
                loss-priority high code-point 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-point 111;
            }
            forwarding-class LOW {
                loss-priority low code-point 001;
            }
            forwarding-class MEDIUM {
                loss-priority high code-point 010;
            }
            forwarding-class NETWORK {
                loss-priority high code-point 110;
            }
            forwarding-class REALTIME {
                loss-priority low code-point 101;
            }
            forwarding-class SIG-OAM {
                loss-priority high code-point 011;
            }
        }
    }
}
```

## evo/class-of-service/rewrite-rules/rr-exp-8class.conf

```
/*
 * Topic: MPLS EXP rewrite rule for eight forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003 p2_ptx10001-36mr
 * Count:
 *   p1_ptx10003 1
 *   p2_ptx10001-36mr 1
 *   total 2
 * Highlights:
 *   - Marks the EXP bits from forwarding class and loss priority.
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-8queue-model.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    rewrite-rules {
        exp EXP-REWRITE {
            forwarding-class BEST-EFFORT {
                loss-priority high code-point 000;
            }
            forwarding-class BUSINESS {
                loss-priority high code-point 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-point 111;
            }
            forwarding-class LOW {
                loss-priority low code-point 001;
            }
            forwarding-class MEDIUM {
                loss-priority high code-point 010;
            }
            forwarding-class NETWORK {
                loss-priority high code-point 110;
            }
            forwarding-class REALTIME {
                loss-priority low code-point 101;
            }
            forwarding-class SIG-OAM {
                loss-priority high code-point 011;
            }
        }
    }
}
```

## evo/class-of-service/rewrite-rules/rr-exp-ieee8021p-7class.conf

```
/*
 * Topic: EXP and IEEE 802.1p rewrite rules for seven forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Highlights:
 *   - Marks EXP and 802.1p from forwarding class and loss priority.
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-7queue-model.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    rewrite-rules {
        exp EXP-REWRITE {
            forwarding-class BEST-EFFORT {
                loss-priority high code-point 000;
            }
            forwarding-class BUSINESS {
                loss-priority high code-point 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-point 111;
            }
            forwarding-class LOW {
                loss-priority low code-point 001;
            }
            forwarding-class MEDIUM {
                loss-priority high code-point 010;
            }
            forwarding-class REALTIME {
                loss-priority low code-point 101;
            }
            forwarding-class SIG-OAM {
                loss-priority high code-point 011;
            }
        }
        ieee-802.1 8021P-REWRITE {
            forwarding-class BEST-EFFORT {
                loss-priority high code-point 000;
            }
            forwarding-class BUSINESS {
                loss-priority high code-point 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-point 111;
            }
            forwarding-class LOW {
                loss-priority low code-point 001;
            }
            forwarding-class MEDIUM {
                loss-priority high code-point 010;
            }
            forwarding-class REALTIME {
                loss-priority low code-point 101;
            }
            forwarding-class SIG-OAM {
                loss-priority high code-point 011;
            }
        }
    }
}
```

## evo/firewall/filter-interface-specific-destination-address-next-interface.conf

```
/*
 * Topic: Interface-specific filter-based forwarding on destination address to a next interface
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Interface-specific filter; counts matching packets and forwards them to a next interface.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $FILTER_NAME     e.g. filter_ip_match_dest2
 *   $DST_PFX         e.g. 217.217.5.100/32
 *   $NEXT_INTERFACE  e.g. et-1/0/2
 */
firewall {
    family inet {
        filter $FILTER_NAME {
            interface-specific;
            term 1 {
                from {
                    destination-address {
                        $DST_PFX;
                    }
                }
                then {
                    count $FILTER_NAME;
                    next-interface {
                        $NEXT_INTERFACE;
                    }
                }
            }
        }
    }
}
```

## evo/firewall/filter-interface-specific-destination-address-next-ip.conf

```
/*
 * Topic: Interface-specific filter-based forwarding on destination address to a next-hop IP address
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Interface-specific filter; counts matching packets and forwards them to a next-hop IP address.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $FILTER_NAME  e.g. filter_ip_match_dest1
 *   $DST_PFX      e.g. 217.217.1.100/32
 *   $NEXT_IP      e.g. 192.168.91.2/32
 */
firewall {
    family inet {
        filter $FILTER_NAME {
            interface-specific;
            term 1 {
                from {
                    destination-address {
                        $DST_PFX;
                    }
                }
                then {
                    count $FILTER_NAME;
                    next-ip $NEXT_IP;
                }
            }
        }
    }
}
```

## evo/firewall/filter-interface-specific-source-address-next-interface.conf

```
/*
 * Topic: Interface-specific filter-based forwarding on source address to a next interface
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Interface-specific filter; counts matching packets and forwards them to a next interface.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $FILTER_NAME     e.g. filter_ip_match_source2
 *   $SRC_PFX         e.g. 218.218.6.100/32
 *   $NEXT_INTERFACE  e.g. et-1/0/2
 */
firewall {
    family inet {
        filter $FILTER_NAME {
            interface-specific;
            term 1 {
                from {
                    source-address {
                        $SRC_PFX;
                    }
                }
                then {
                    count $FILTER_NAME;
                    next-interface {
                        $NEXT_INTERFACE;
                    }
                }
            }
        }
    }
}
```

## evo/firewall/filter-interface-specific-source-address-next-ip.conf

```
/*
 * Topic: Interface-specific filter-based forwarding on source address to a next-hop IP address
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Interface-specific filter; counts matching packets and forwards them to a next-hop IP address.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $FILTER_NAME  e.g. filter_ip_match_source1
 *   $SRC_PFX      e.g. 218.218.2.100/32
 *   $NEXT_IP      e.g. 192.168.91.2/32
 */
firewall {
    family inet {
        filter $FILTER_NAME {
            interface-specific;
            term 1 {
                from {
                    source-address {
                        $SRC_PFX;
                    }
                }
                then {
                    count $FILTER_NAME;
                    next-ip $NEXT_IP;
                }
            }
        }
    }
}
```

## evo/firewall/filter-interface-specific-tcp-destination-port-next-interface.conf

```
/*
 * Topic: Interface-specific filter-based forwarding on TCP destination port to a next interface
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Interface-specific filter; counts matching packets and forwards them to a next interface.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $FILTER_NAME     e.g. filter_ip_dport2
 *   $DST_PORT        e.g. 23
 *   $NEXT_INTERFACE  e.g. et-1/0/2
 */
firewall {
    family inet {
        filter $FILTER_NAME {
            interface-specific;
            term 1 {
                from {
                    protocol tcp;
                    destination-port $DST_PORT;
                }
                then {
                    count $FILTER_NAME;
                    next-interface {
                        $NEXT_INTERFACE;
                    }
                }
            }
        }
    }
}
```

## evo/firewall/filter-interface-specific-tcp-destination-port-next-ip.conf

```
/*
 * Topic: Interface-specific filter-based forwarding on TCP destination port to a next-hop IP address
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Interface-specific filter; counts matching packets and forwards them to a next-hop IP address.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $FILTER_NAME  e.g. filter_ip_dport1
 *   $DST_PORT     e.g. 80
 *   $NEXT_IP      e.g. 192.168.91.2/32
 */
firewall {
    family inet {
        filter $FILTER_NAME {
            interface-specific;
            term 1 {
                from {
                    protocol tcp;
                    destination-port $DST_PORT;
                }
                then {
                    count $FILTER_NAME;
                    next-ip $NEXT_IP;
                }
            }
        }
    }
}
```

## evo/firewall/filter-interface-specific-tcp-source-port-next-interface.conf

```
/*
 * Topic: Interface-specific filter-based forwarding on TCP source port to a next interface
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Interface-specific filter; counts matching packets and forwards them to a next interface.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $FILTER_NAME     e.g. filter_ip_sport2
 *   $SRC_PORT        e.g. 65001
 *   $NEXT_INTERFACE  e.g. et-1/0/2
 */
firewall {
    family inet {
        filter $FILTER_NAME {
            interface-specific;
            term 1 {
                from {
                    protocol tcp;
                    source-port $SRC_PORT;
                }
                then {
                    count $FILTER_NAME;
                    next-interface {
                        $NEXT_INTERFACE;
                    }
                }
            }
        }
    }
}
```

## evo/firewall/filter-interface-specific-tcp-source-port-next-ip.conf

```
/*
 * Topic: Interface-specific filter-based forwarding on TCP source port to a next-hop IP address
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Interface-specific filter; counts matching packets and forwards them to a next-hop IP address.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $FILTER_NAME  e.g. filter_ip_sport1
 *   $SRC_PORT     e.g. 65535
 *   $NEXT_IP      e.g. 192.168.91.2/32
 */
firewall {
    family inet {
        filter $FILTER_NAME {
            interface-specific;
            term 1 {
                from {
                    protocol tcp;
                    source-port $SRC_PORT;
                }
                then {
                    count $FILTER_NAME;
                    next-ip $NEXT_IP;
                }
            }
        }
    }
}
```

## evo/forwarding-options/hash-key-inet-inet6-layer-3-4-multiservice-mac.conf

```
/*
 * Topic: Load-balancing hash on layer 3 and 4 for IPv4 and IPv6, MAC addresses for multiservice
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003 p2_ptx10001-36mr
 * Count:
 *   p1_ptx10003 1
 *   p2_ptx10001-36mr 1
 *   total 2
 * Highlights:
 *   - IPv4 and IPv6 hash on layer 3 and layer 4 fields; multiservice hashes on source and destination MAC.
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
 * Topic: Hash key on IPv4/IPv6 layer 3-4, all MPLS labels with IP payload, and Ethernet MACs
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 1
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 3
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

## evo/interfaces/ifd-ae-description-flexible-lacp-fast-failover-system-id.conf

```
/*
 * Topic: Aggregated Ethernet with fast LACP, fast failover and system ID
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - LACP active with fast periodic and fast failover; the LACP system ID is set explicitly.
 * Pair with: none
 * Variables (example values from wanedge4_acx7100-48l):
 *   $IFD          e.g. ae0
 *   $DESCRIPTION  e.g. "PE4 to CE2"
 *   $LACP_SYS_ID  e.g. 00:00:00:00:01:01
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
                fast-failover;
                system-id $LACP_SYS_ID;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-ether-description`

## evo/interfaces/ifd-ae-description-flexible-lacp-fast-system-id.conf

```
/*
 * Topic: Aggregated Ethernet with flexible services, fast LACP and system ID
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Highlights:
 *   - LACP active with fast periodic; the LACP system ID is set explicitly.
 * Pair with: none
 * Variables (example values from wanedge3_acx7509):
 *   $IFD          e.g. ae0
 *   $DESCRIPTION  e.g. "PE3 to CE2"
 *   $LACP_SYS_ID  e.g. 00:00:00:00:01:01
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
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-core-lag-member-ether-description-100g`

## evo/interfaces/ifd-ae-description-flexible-lacp-fast.conf

```
/*
 * Topic: Aggregated Ethernet with flexible services and fast LACP
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l wanedge4_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Flexible VLAN tagging with flexible Ethernet services; LACP active with fast periodic.
 * Pair with: none
 * Variables (example values from ce1_acx7100-48l):
 *   $IFD          e.g. ae0
 *   $DESCRIPTION  e.g. "CE1 to PE1/2"
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
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `lag-member`: when the router's configuration has it, all related; one of `interfaces/ifd-core-lag-member-ether-description-100g`, `interfaces/ifd-lag-member-ether-100g`, `interfaces/ifd-lag-member-ether`

## evo/interfaces/ifd-ae-description-flexible-mtu-lacp-fast.conf

```
/*
 * Topic: Aggregated Ethernet with flexible services, MTU and fast LACP
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 1
 *   total 1
 * Highlights:
 *   - Flexible VLAN tagging with flexible Ethernet services and an explicit MTU; LACP active with fast periodic.
 * Pair with: none
 * Variables (example values from p2_ptx10001-36mr):
 *   $IFD          e.g. ae4
 *   $DESCRIPTION  e.g. "P2 Node to WANEdge4"
 *   $MTU          e.g. 1522
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        flexible-vlan-tagging;
        mtu $MTU;
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
- `lag-member`: when the router's configuration has it, all related; one of `interfaces/ifd-lag-member-ether-100g`, `interfaces/ifd-lag-member-ether`

## evo/interfaces/ifd-ae-description-lacp-fast.conf

```
/*
 * Topic: Described aggregated Ethernet bundle with active fast LACP
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003
 * Count:
 *   p1_ptx10003 1
 *   total 1
 * Highlights:
 *   - LACP runs active with fast periodic PDUs, so a failed member is detected in about three seconds.
 * Pair with: none
 * Variables (example values from p1_ptx10003):
 *   $IFD          e.g. ae2
 *   $DESCRIPTION  e.g. "PE1 to P1"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
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

## evo/interfaces/ifd-breakout-4x10g.conf

```
/*
 * Topic:   Four-subport 10G physical interface breakout
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 2
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce1_acx7100-48l):
 *   $IFD  e.g. et-0/0/24
 */
interfaces {
  $IFD {
    number-of-sub-ports 4;
    speed 10g;
  }
}
```

## evo/interfaces/ifd-core-lag-member-ether-description-100g.conf

```
/*
 * Topic: Described 100G physical member of a core aggregated Ethernet bundle
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 2
 *   wanedge4_acx7100-48l 2
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $CORE_INTF    e.g. et-0/0/0
 *   $DESCRIPTION  e.g. "L1_WANEdge3 to CE2"
 *   $AE_BUNDLE    e.g. ae0
 */
interfaces {
    $CORE_INTF {
        description $DESCRIPTION;
        speed 100g;
        ether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## evo/interfaces/ifd-description-100g.conf

```
/*
 * Topic: Described 100G port
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   p2_ptx10001-36mr 1
 *   wanedge3_acx7509 3
 *   wanedge4_acx7100-48l 1
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p2_ptx10001-36mr):
 *   $IFD          e.g. et-0/0/9
 *   $DESCRIPTION  e.g. "P2Node to WANEdge3"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        speed 100g;
    }
}
```

## evo/interfaces/ifd-description-flexible-speed-100g.conf

```
/*
 * Topic: Described 100G port with flexible VLAN tagging and flexible Ethernet services
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p2_ptx10001-36mr):
 *   $IFD          e.g. et-0/2/8
 *   $DESCRIPTION  e.g. "P2Node to WANEdge2"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        flexible-vlan-tagging;
        speed 100g;
        encapsulation flexible-ethernet-services;
    }
}
```

## evo/interfaces/ifd-description-speed-40g.conf

```
/*
 * Topic: 40G port with a description
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - Port speed set to 40G.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge4_acx7100-48l):
 *   $IFD          e.g. et-0/0/52
 *   $DESCRIPTION  e.g. "WAN Edeg4 to P1 node"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        speed 40g;
    }
}
```

## evo/interfaces/ifd-description.conf

```
/*
 * Topic: Interface description
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p2_ptx10001-36mr):
 *   $IFD          e.g. et-0/0/4
 *   $DESCRIPTION  e.g. "P2Node to P1Node"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
    }
}
```

## evo/interfaces/ifd-flexible-ethernet-services-description-speed-10g.conf

```
/*
 * Topic: 10G port with flexible services
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 2
 *   total 2
 * Highlights:
 *   - Flexible VLAN tagging with flexible Ethernet services at 10G.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $IFD          e.g. et-0/0/3
 *   $DESCRIPTION  e.g. "PE3 to TG Port 2"
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
 *   EVO: ce1_acx7100-48l wanedge4_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 2
 *   wanedge4_acx7100-48l 2
 *   total 4
 * Highlights:
 *   - Flexible tagging and `flexible-ethernet-services` let one port carry bridged, cross-connect and routed units side by side.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce1_acx7100-48l):
 *   $IFD          e.g. et-0/0/24:0
 *   $DESCRIPTION  e.g. "link1_CE1 to TG Port 1"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
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
 *   EVO: p2_ptx10001-36mr wanedge4_acx7100-48l
 * Count:
 *   p2_ptx10001-36mr 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p2_ptx10001-36mr):
 *   $IFD        e.g. et-0/0/1
 *   $AE_BUNDLE  e.g. ae4
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

## evo/interfaces/ifd-lag-member-ether-description.conf

```
/*
 * Topic: Described member link of an aggregated-Ethernet bundle
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 2
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge4_acx7100-48l):
 *   $IFD          e.g. et-0/0/4
 *   $DESCRIPTION  e.g. "PE4 to CE2"
 *   $AE_BUNDLE    e.g. ae0
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        ether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## evo/interfaces/ifd-lag-member-ether.conf

```
/*
 * Topic: Aggregated Ethernet member link through ether-options
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 * Count:
 *   ce1_acx7100-48l 4
 *   p1_ptx10003 3
 *   p2_ptx10001-36mr 2
 *   total 9
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce1_acx7100-48l):
 *   $IFD        e.g. et-0/0/4:0
 *   $AE_BUNDLE  e.g. ae0
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
 * Topic: 100G port speed
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p2_ptx10001-36mr):
 *   $IFD  e.g. et-0/0/2
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
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p2_ptx10001-36mr):
 *   $IFD  e.g. et-0/0/0
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
 * Topic: Port marked unused
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 3
 *   total 3
 * Highlights:
 *   - `unused` keeps the port out of service and out of any bundle.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce1_acx7100-48l):
 *   $IFD  e.g. et-0/0/25
 */
interfaces {
    $IFD {
        unused;
    }
}
```

## evo/interfaces/ifl-core-inet-inet6-mpls.conf

```
/*
 * Topic: Core unit with IPv4, IPv6 and MPLS
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - Core-facing unit 0 with dual-stack addressing and MPLS.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge4_acx7100-48l):
 *   $CORE_PHYS     e.g. et-0/0/53
 *   $CORE_V4_ADDR  e.g. 192.168.91.2/24
 *   $CORE_V6_ADDR  e.g. 4400::4/68
 */
interfaces {
    $CORE_PHYS {
        unit 0 {
            family inet {
                address $CORE_V4_ADDR;
            }
            family inet6 {
                address $CORE_V6_ADDR;
            }
            family mpls;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-description-100g`

## evo/interfaces/ifl-core-inet-mpls.conf

```
/*
 * Topic: Core-facing point-to-point link with IPv4 and MPLS families
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003 p2_ptx10001-36mr wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   p1_ptx10003 4
 *   p2_ptx10001-36mr 2
 *   wanedge3_acx7509 4
 *   wanedge4_acx7100-48l 2
 *   total 12
 * Highlights:
 *   - Untagged core link: `family inet` for OSPF and `family mpls` for LDP-signalled transport.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p1_ptx10003):
 *   $CORE_PHYS     e.g. ae2
 *   $CORE_V4_ADDR  e.g. 192.168.12.2/24
 */
interfaces {
    $CORE_PHYS {
        unit 0 {
            family inet {
                address $CORE_V4_ADDR;
            }
            family mpls;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-ae-description-lacp-fast`, `interfaces/ifd-description-100g`, `interfaces/ifd-description-speed-40g`, `interfaces/ifd-description`
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-ether`

## evo/interfaces/ifl-core-vlan-inet-inet6-mpls.conf

```
/*
 * Topic: Tagged core unit with IPv4, IPv6 and MPLS
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr wanedge4_acx7100-48l
 * Count:
 *   p2_ptx10001-36mr 2
 *   wanedge4_acx7100-48l 1
 *   total 3
 * Highlights:
 *   - Core-facing unit on a VLAN with dual-stack addressing and MPLS.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p2_ptx10001-36mr):
 *   $CORE_PHYS     e.g. ae4
 *   $VLAN          e.g. 1
 *   $CORE_V4_ADDR  e.g. 192.168.45.1/24
 *   $CORE_V6_ADDR  e.g. 6000::1/68
 */
interfaces {
    $CORE_PHYS {
        unit 0 {
            vlan-id $VLAN;
            family inet {
                address $CORE_V4_ADDR;
            }
            family inet6 {
                address $CORE_V6_ADDR;
            }
            family mpls;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-ae-description-flexible-lacp-fast`, `interfaces/ifd-ae-description-flexible-mtu-lacp-fast`, `interfaces/ifd-description-flexible-speed-100g`
- `lag-member`: when the router's configuration has it, all related; one of `interfaces/ifd-core-lag-member-ether-description-100g`, `interfaces/ifd-lag-member-ether-100g`, `interfaces/ifd-lag-member-ether`

## evo/interfaces/ifl-irb-inet.conf

```
/*
 * Topic:   IRB unit carrying a single IPv4 address
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 175
 *   wanedge4_acx7100-48l 200
 *   total 375
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $UNIT      e.g. 476
 *   $IRB_ADDR  e.g. 65.65.1.1/24
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
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 150
 *   wanedge4_acx7100-48l 150
 *   total 300
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $UNIT      e.g. 1851
 *   $IRB_ADDR  e.g. 45.45.1.1/24
 *   $VGA       e.g. 45.45.1.3
 *   $VG_MAC    e.g. 00:66:66:66:66:01
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

## evo/interfaces/ifl-loopback-inet.conf

```
/*
 * Topic: Loopback unit with one IPv4 address
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003 p2_ptx10001-36mr
 * Count:
 *   p1_ptx10003 1
 *   p2_ptx10001-36mr 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p1_ptx10003):
 *   $UNIT             e.g. 0
 *   $LOOPBACK_V4_PFX  e.g. 3.3.3.3/32
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

## evo/interfaces/ifl-vlan-bridge-esi.conf

```
/*
 * Topic:   Bridged logical interface with EVPN ESI multihoming
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 750
 *   wanedge4_acx7100-48l 750
 *   total 1500
 * Pair with: none
 * Peers with:
 *   [wanedge3_acx7509] <-> [wanedge4_acx7100-48l]
 * Variables (example values from wanedge3_acx7509):
 *   $IFD   e.g. ae0
 *   $UNIT  e.g. 1701
 *   $VLAN  e.g. 1701
 *   $ESI   e.g. 00:25:25:25:25:25:25:25:11:01
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-ae-description-flexible-lacp-fast-failover-system-id`, `interfaces/ifd-ae-description-flexible-lacp-fast-system-id`
- `lag-member`: when the router's configuration has it, all related; one of `interfaces/ifd-core-lag-member-ether-description-100g`, `interfaces/ifd-lag-member-ether-description`

## evo/interfaces/ifl-vlan-bridge.conf

```
/*
 * Topic: VLAN-tagged bridge unit
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 5004
 *   wanedge3_acx7509 1050
 *   wanedge4_acx7100-48l 1075
 *   total 7129
 * Highlights:
 *   - `encapsulation vlan-bridge` places the unit in a bridge domain or VLAN.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce1_acx7100-48l):
 *   $IFD   e.g. ae0
 *   $UNIT  e.g. 1
 *   $VLAN  e.g. 1
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-bridge;
            vlan-id $VLAN;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-ae-description-flexible-lacp-fast`, `interfaces/ifd-flexible-ethernet-services-description-speed-10g`, `interfaces/ifd-flexible-ethernet-services-description`
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-ether`

## evo/interfaces/ifl-vlan-ccc-esi-all-active-family-ccc.conf

```
/*
 * Topic: Single-tagged cross-connect logical interface with an all-active ESI
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1700
 *   wanedge4_acx7100-48l 1700
 *   total 3400
 * Pair with: none
 * Peers with:
 *   [wanedge3_acx7509] <-> [wanedge4_acx7100-48l]
 * Variables (example values from wanedge3_acx7509):
 *   $IFD   e.g. ae0
 *   $UNIT  e.g. 1
 *   $VLAN  e.g. 1
 *   $ESI   e.g. 00:34:34:34:34:34:34:34:11:01
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
            family ccc;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-ae-description-flexible-lacp-fast-failover-system-id`, `interfaces/ifd-ae-description-flexible-lacp-fast-system-id`
- `lag-member`: when the router's configuration has it, all related; one of `interfaces/ifd-core-lag-member-ether-description-100g`, `interfaces/ifd-lag-member-ether-description`

## evo/interfaces/ifl-vlan-ccc-family-ccc.conf

```
/*
 * Topic: VLAN-tagged circuit cross-connect unit with family ccc
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 300
 *   wanedge4_acx7100-48l 300
 *   total 600
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $IFD   e.g. et-0/0/2
 *   $UNIT  e.g. 1
 *   $VLAN  e.g. 1
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

## evo/interfaces/ifl-vlan-family-inet-inet6.conf

```
/*
 * Topic: VLAN unit with the IPv4 and IPv6 families enabled
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 100
 *   total 100
 * Highlights:
 *   - Both families are enabled on the unit without addresses.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p2_ptx10001-36mr):
 *   $IFD   e.g. ae4
 *   $UNIT  e.g. 1801
 *   $VLAN  e.g. 1801
 */
interfaces {
    $IFD {
        unit $UNIT {
            vlan-id $VLAN;
            family inet;
            family inet6;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-ae-description-flexible-mtu-lacp-fast`
- `lag-member`: when the router's configuration has it, all related; one of `interfaces/ifd-lag-member-ether-100g`, `interfaces/ifd-lag-member-ether`

## evo/interfaces/ifl-vlan-inet-family-inet6.conf

```
/*
 * Topic: VLAN unit with an IPv4 address and the IPv6 family enabled
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 100
 *   total 100
 * Highlights:
 *   - IPv4 is addressed; IPv6 is enabled without an address.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p2_ptx10001-36mr):
 *   $IFD         e.g. ae4
 *   $UNIT        e.g. 2801
 *   $VLAN        e.g. 2801
 *   $AC_ADDR_V4  e.g. 56.1.1.1/24
 */
interfaces {
    $IFD {
        unit $UNIT {
            vlan-id $VLAN;
            family inet {
                address $AC_ADDR_V4;
            }
            family inet6;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-ae-description-flexible-mtu-lacp-fast`
- `lag-member`: when the router's configuration has it, all related; one of `interfaces/ifd-lag-member-ether-100g`, `interfaces/ifd-lag-member-ether`

## evo/interfaces/ifl-vlan-inet-filter-input.conf

```
/*
 * Topic: IPv4 VLAN unit with an input firewall filter
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 8
 *   wanedge4_acx7100-48l 8
 *   total 16
 * Highlights:
 *   - Applies an input firewall filter to IPv4 traffic on the unit.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $IFD           e.g. et-0/0/3
 *   $UNIT          e.g. 3011
 *   $VLAN          e.g. 3011
 *   $INPUT_FILTER  e.g. filter_ip_match_dest1
 *   $AC_ADDR_V4    e.g. 218.218.1.1/24
 */
interfaces {
    $IFD {
        unit $UNIT {
            vlan-id $VLAN;
            family inet {
                filter {
                    input $INPUT_FILTER;
                }
                address $AC_ADDR_V4;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-flexible-ethernet-services-description-speed-10g`, `interfaces/ifd-flexible-ethernet-services-description`
- `filter` (`$INPUT_FILTER`): required, for each reference; one of `firewall/filter-interface-specific-destination-address-next-interface`, `firewall/filter-interface-specific-destination-address-next-ip`, `firewall/filter-interface-specific-source-address-next-interface`, `firewall/filter-interface-specific-source-address-next-ip`, `firewall/filter-interface-specific-tcp-destination-port-next-interface`, `firewall/filter-interface-specific-tcp-destination-port-next-ip`, `firewall/filter-interface-specific-tcp-source-port-next-interface`, `firewall/filter-interface-specific-tcp-source-port-next-ip`

## evo/interfaces/ifl-vlan-inet-inet6-rpf-check-loose.conf

```
/*
 * Topic: Dual-stack VLAN unit with loose unicast RPF
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 200
 *   total 200
 * Highlights:
 *   - Both address families run a loose-mode reverse-path forwarding check.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge4_acx7100-48l):
 *   $IFD         e.g. ae4
 *   $UNIT        e.g. 1801
 *   $VLAN        e.g. 1801
 *   $AC_ADDR_V4  e.g. 55.1.1.2/24
 *   $AC_ADDR_V6  e.g. 5500::2/64
 */
interfaces {
    $IFD {
        unit $UNIT {
            vlan-id $VLAN;
            family inet {
                rpf-check {
                    mode loose;
                }
                address $AC_ADDR_V4;
            }
            family inet6 {
                rpf-check {
                    mode loose;
                }
                address $AC_ADDR_V6;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-ae-description-flexible-lacp-fast`
- `lag-member`: when the router's configuration has it, all related; one of `interfaces/ifd-core-lag-member-ether-description-100g`, `interfaces/ifd-lag-member-ether-100g`

## evo/interfaces/ifl-vlan-inet-inet6.conf

```
/*
 * Topic: VLAN unit with IPv4 and IPv6 addresses
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr wanedge4_acx7100-48l
 * Count:
 *   p2_ptx10001-36mr 200
 *   wanedge4_acx7100-48l 200
 *   total 400
 * Highlights:
 *   - Dual-stack routed VLAN unit.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p2_ptx10001-36mr):
 *   $IFD         e.g. et-0/2/8
 *   $UNIT        e.g. 1801
 *   $VLAN        e.g. 1801
 *   $AC_ADDR_V4  e.g. 45.1.1.1/24
 *   $AC_ADDR_V6  e.g. 4500::1/64
 */
interfaces {
    $IFD {
        unit $UNIT {
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
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-description-flexible-speed-100g`, `interfaces/ifd-flexible-ethernet-services-description`

## evo/interfaces/ifl-vlan-inet.conf

```
/*
 * Topic: VLAN-tagged IPv4 unit
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 12
 *   wanedge4_acx7100-48l 12
 *   total 24
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $IFD         e.g. et-0/0/2
 *   $UNIT        e.g. 3000
 *   $VLAN        e.g. 3000
 *   $AC_ADDR_V4  e.g. 211.211.2.1/24
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
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-flexible-ethernet-services-description-speed-10g`, `interfaces/ifd-flexible-ethernet-services-description`

## evo/policy-options/policy-statement/per-packet-load-balance-accept.conf

```
/*
 * Topic: Per-packet load-balancing policy with an explicit accept
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 * Count:
 *   ce1_acx7100-48l 1
 *   p1_ptx10003 1
 *   p2_ptx10001-36mr 1
 *   total 3
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce1_acx7100-48l):
 *   $PPLB_NAME  e.g. pplb
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

## evo/policy-options/policy-statement/ps-bgp-to-ospf.conf

```
/*
 * Topic: Policy bgp-to-ospf accepting BGP routes
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement bgp-to-ospf {
        from protocol bgp;
        then accept;
    }
}
```

## evo/policy-options/policy-statement/ps-nexthop-bgp-next-hop-self.conf

```
/*
 * Topic: Next-hop-self for BGP routes
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003
 * Count:
 *   p1_ptx10003 1
 *   total 1
 * Highlights:
 *   - Rewrites the next hop to self for BGP-learned routes.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement nexthop {
        term 2 {
            from protocol bgp;
            then {
                next-hop self;
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-pplb-evpn-term.conf

```
/*
 * Topic: Per-packet load balancing with an EVPN term
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - The EVPN term sets per-packet load balancing; the final action load-balances per packet and accepts.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement pplb {
        term 1 {
            from family evpn;
            then {
                load-balance per-packet;
            }
        }
        then {
            load-balance per-packet;
            accept;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-send-direct.conf

```
/*
 * Topic: Export policy for directly connected routes
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Accepts direct routes; exported by the iBGP group.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement send-direct {
        term 1 {
            from protocol direct;
            then accept;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-send-ospf.conf

```
/*
 * Topic: Policy accepting OSPF routes
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003 p2_ptx10001-36mr wanedge4_acx7100-48l
 * Count:
 *   p1_ptx10003 1
 *   p2_ptx10001-36mr 1
 *   wanedge4_acx7100-48l 1
 *   total 3
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement send-ospf {
        term 2 {
            from protocol ospf;
            then accept;
        }
    }
}
```

## evo/protocols/bgp-advertise-peer-as-graceful-restart.conf

```
/*
 * Topic: BGP advertise-peer-as with graceful restart
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
protocols {
    bgp {
        advertise-peer-as;
        graceful-restart;
    }
}
```

## evo/protocols/bgp-advertise-peer-as.conf

```
/*
 * Topic: BGP advertise-peer-as
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003
 * Count:
 *   p1_ptx10003 1
 *   total 1
 * Highlights:
 *   - Advertises routes to peers in the AS they came from.
 * Pair with: none
 * Variables: none
 */
protocols {
    bgp {
        advertise-peer-as;
    }
}
```

## evo/protocols/bgp-multipath.conf

```
/*
 * Topic: BGP multipath
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Highlights:
 *   - Installs equal-cost BGP paths for load balancing.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
protocols {
    bgp {
        multipath;
    }
}
```

## evo/protocols/bgp-overlay-pe-flow-evpn-route-target.conf

```
/*
 * Topic: iBGP PE group for IPv4 with flow, EVPN and route-target
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Two route reflectors; flow specification, route-target filtering and BFD; exports direct routes.
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-send-direct.conf
 *
 * Peers with:
 *   [p1_ptx10003] <-> [wanedge3_acx7509]
 *   [p1_ptx10003] <-> [wanedge4_acx7100-48l]
 *   [p2_ptx10001-36mr] <-> [wanedge3_acx7509]
 *   [p2_ptx10001-36mr] <-> [wanedge4_acx7100-48l]
 * Variables (example values from wanedge3_acx7509):
 *   $LOOPBACK_V4  e.g. 4.4.4.4
 *   $ASN          e.g. 64512
 *   $RR1_V4       e.g. 3.3.3.3
 *   $RR2_V4       e.g. 6.6.6.6
 */
protocols {
    bgp {
        group ibgp {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                unicast;
                flow;
            }
            family evpn {
                signaling;
            }
            family route-target;
            export send-direct;
            local-as $ASN;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor $RR1_V4;
            neighbor $RR2_V4;
        }
    }
}
```

## evo/protocols/bgp-overlay-rr-cluster-evpn-route-target-multipath.conf

```
/*
 * Topic: iBGP route reflector for IPv4, EVPN and route-target
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 1
 *   total 1
 * Highlights:
 *   - Route reflector cluster with four PE clients; route-target filtering, multipath, graceful restart and BFD.
 * Pair with: none
 * Peers with:
 *   [p2_ptx10001-36mr] <-> [wanedge1_mx304]
 *   [p2_ptx10001-36mr] <-> [wanedge2_mx10004]
 *   [p2_ptx10001-36mr] <-> [wanedge3_acx7509]
 *   [p2_ptx10001-36mr] <-> [wanedge4_acx7100-48l]
 * Variables (example values from p2_ptx10001-36mr):
 *   $LOOPBACK_V4  e.g. 6.6.6.6
 *   $ASN          e.g. 64512
 *   $PE1_V4       e.g. 2.2.2.2
 *   $PE2_V4       e.g. 4.4.4.4
 *   $PE3_V4       e.g. 5.5.5.5
 *   $PE4_V4       e.g. 7.7.7.7
 */
protocols {
    bgp {
        group ibgp {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                unicast;
            }
            family evpn {
                signaling;
            }
            family route-target;
            cluster $LOOPBACK_V4;
            local-as $ASN;
            graceful-restart;
            multipath;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor $PE1_V4;
            neighbor $PE2_V4;
            neighbor $PE3_V4;
            neighbor $PE4_V4;
        }
    }
}
```

## evo/protocols/bgp-overlay-rr-cluster-evpn.conf

```
/*
 * Topic: iBGP route reflector for IPv4 and EVPN
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003
 * Count:
 *   p1_ptx10003 1
 *   total 1
 * Highlights:
 *   - Route reflector cluster with four PE clients; graceful restart and BFD.
 * Pair with: none
 * Peers with:
 *   [p1_ptx10003] <-> [wanedge1_mx304]
 *   [p1_ptx10003] <-> [wanedge2_mx10004]
 *   [p1_ptx10003] <-> [wanedge3_acx7509]
 *   [p1_ptx10003] <-> [wanedge4_acx7100-48l]
 * Variables (example values from p1_ptx10003):
 *   $LOOPBACK_V4  e.g. 3.3.3.3
 *   $ASN          e.g. 64512
 *   $PE1_V4       e.g. 2.2.2.2
 *   $PE2_V4       e.g. 5.5.5.5
 *   $PE3_V4       e.g. 4.4.4.4
 *   $PE4_V4       e.g. 7.7.7.7
 */
protocols {
    bgp {
        group ibgp {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                unicast;
            }
            family evpn {
                signaling;
            }
            cluster $LOOPBACK_V4;
            local-as $ASN;
            graceful-restart;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor $PE1_V4;
            neighbor $PE2_V4;
            neighbor $PE3_V4;
            neighbor $PE4_V4;
        }
    }
}
```

## evo/protocols/l2-learning-global-mac-limit.conf

```
/*
 * Topic: Global MAC learning limit
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - Caps the MAC addresses learned across the router.
 * Pair with: none
 * Variables: none
 */
protocols {
    l2-learning {
        global-mac-limit {
            155000;
        }
    }
}
```

## evo/protocols/ldp-interface-3-core-loopback.conf

```
/*
 * Topic: LDP on three core links and the loopback
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-mpls.conf
 *
 * Variables (example values from wanedge3_acx7509):
 *   $CORE_PHYS_1  e.g. et-1/0/0
 *   $CORE_PHYS_2  e.g. et-1/0/1
 *   $CORE_PHYS_3  e.g. et-1/0/2
 */
protocols {
    ldp {
        interface $CORE_PHYS_1.0;
        interface $CORE_PHYS_2.0;
        interface $CORE_PHYS_3.0;
        interface lo0.0;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$CORE_PHYS_1.0`, `$CORE_PHYS_2.0`, `$CORE_PHYS_3.0`): required, for each reference; `interfaces/ifl-core-inet-mpls`

## evo/protocols/ldp-interface-core-loopback-sr-mapping-client.conf

```
/*
 * Topic: LDP on one core interface and the loopback, segment routing mapping client
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003 p2_ptx10001-36mr wanedge4_acx7100-48l
 * Count:
 *   p1_ptx10003 1
 *   p2_ptx10001-36mr 1
 *   wanedge4_acx7100-48l 1
 *   total 3
 * Highlights:
 *   - LDP runs on one core interface and the loopback, with sr-mapping-client enabled.
 * Pair with: none
 * Variables (example values from p1_ptx10003):
 *   $CORE_INTF_1  e.g. et-1/0/0.0
 */
protocols {
    ldp {
        interface $CORE_INTF_1;
        interface lo0.0;
        sr-mapping-client;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$CORE_INTF_1`, `lo0.0`): required, for each reference; one of `interfaces/ifl-core-inet-inet6-mpls`, `interfaces/ifl-core-inet-mpls`, `interfaces/ifl-loopback-inet`

## evo/protocols/lldp-interface-all.conf

```
/*
 * Topic:   LLDP enabled on all interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l p1_ptx10003 p2_ptx10001-36mr wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 1
 *   p1_ptx10003 1
 *   p2_ptx10001-36mr 1
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 5
 * Pair with: none
 * Variables: none
 */
protocols {
    lldp {
        interface all;
    }
}
```

## evo/protocols/mpls-interface-4-core.conf

```
/*
 * Topic: MPLS on four core links
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003 p2_ptx10001-36mr
 * Count:
 *   p1_ptx10003 1
 *   p2_ptx10001-36mr 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p1_ptx10003):
 *   $CORE_PHYS_1  e.g. ae2
 *   $CORE_PHYS_2  e.g. et-1/0/5
 *   $CORE_PHYS_3  e.g. et-1/0/0
 *   $CORE_PHYS_4  e.g. et-1/0/1
 */
protocols {
    mpls {
        interface $CORE_PHYS_1.0;
        interface $CORE_PHYS_2.0;
        interface $CORE_PHYS_3.0;
        interface $CORE_PHYS_4.0;
    }
}
```

## evo/protocols/mpls-te-2-lsp-3-core.conf

```
/*
 * Topic: MPLS with traffic engineering, two LSPs and three core interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Two label-switched paths to remote PEs with traffic engineering; MPLS on three core interfaces and the loopback.
 * Pair with: none
 * Variables (example values from wanedge3_acx7509):
 *   $LSP_NAME_A   e.g. lsp_to_pe1
 *   $LSP_TO_A     e.g. 2.2.2.2
 *   $LSP_NAME_B   e.g. lsp_to_pe2
 *   $LSP_TO_B     e.g. 5.5.5.5
 *   $CORE_INTF_1  e.g. et-1/0/0.0
 *   $CORE_INTF_2  e.g. et-1/0/1.0
 *   $CORE_INTF_3  e.g. et-1/0/2.0
 */
protocols {
    mpls {
        traffic-engineering;
        label-switched-path $LSP_NAME_A {
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_B {
            to $LSP_TO_B;
        }
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
        interface $CORE_INTF_3;
        interface lo0.0;
    }
}
```

## evo/protocols/oam-cfm-mep-up-auto-discovery.conf

```
/*
 * Topic: CFM maintenance domain with an up MEP and automatic remote MEP discovery
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 175
 *   wanedge4_acx7100-48l 175
 *   total 350
 * Highlights:
 *   - Level 3 maintenance domain with one maintenance association per service and 1-second continuity checks.
 *   - The up MEP on the attachment circuit discovers its remote MEP automatically.
 * Pair with: none
 * Variables (example values from wanedge3_acx7509):
 *   $MD_NAME    e.g. m-d301
 *   $MA_ID      e.g. m-a301
 *   $MEP_LOCAL  e.g. 352
 *   $AC_IFL     e.g. et-0/0/2.301
 */
protocols {
    oam {
        ethernet {
            connectivity-fault-management {
                maintenance-domain $MD_NAME {
                    level 3;
                    name-format character-string;
                    maintenance-association $MA_ID {
                        short-name-format character-string;
                        continuity-check {
                            interval 1s;
                        }
                        mep $MEP_LOCAL {
                            interface $AC_IFL;
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

## evo/protocols/oam-cfm-perf-mon-two-way-delay-slm.conf

```
/*
 * Topic: CFM performance monitoring with two-way delay and synthetic loss iterator profiles
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Enhanced SLA iterator with measurement-interval 5.
 *   - One profile measures two-way delay, the other synthetic loss (SLM).
 * Pair with: none
 * Variables (example values from wanedge3_acx7509):
 *   $SLA_PROFILE_DELAY  e.g. i1
 *   $SLA_PROFILE_SLM    e.g. i2
 */
protocols {
    oam {
        ethernet {
            connectivity-fault-management {
                performance-monitoring {
                    enhanced-sla-iterator;
                    measurement-interval 5;
                    sla-iterator-profiles {
                        $SLA_PROFILE_DELAY {
                            measurement-type two-way-delay;
                        }
                        $SLA_PROFILE_SLM {
                            measurement-type slm;
                        }
                    }
                }
            }
        }
    }
}
```

## evo/protocols/ospf-area-2-interface-p2p.conf

```
/*
 * Topic: OSPF area with two interfaces, one point-to-point
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 100
 *   total 100
 * Highlights:
 *   - The second interface runs as point-to-point.
 * Pair with: none
 * Variables (example values from wanedge4_acx7100-48l):
 *   $OSPF_AREA   e.g. 0.0.0.1
 *   $AREA_IFL_A  e.g. ae4.2801
 *   $AREA_IFL_B  e.g. et-0/0/1.2801
 */
protocols {
    ospf {
        area $OSPF_AREA {
            interface $AREA_IFL_A;
            interface $AREA_IFL_B {
                interface-type p2p;
            }
        }
    }
}
```

## evo/protocols/ospf-area-2-interface.conf

```
/*
 * Topic: OSPF area with two interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 100
 *   total 100
 * Highlights:
 *   - Both interfaces use default settings.
 * Pair with: none
 * Variables (example values from p2_ptx10001-36mr):
 *   $OSPF_AREA   e.g. 0.0.0.1
 *   $AREA_IFL_A  e.g. et-0/2/8.2801
 *   $AREA_IFL_B  e.g. ae4.2801
 */
protocols {
    ospf {
        area $OSPF_AREA {
            interface $AREA_IFL_A;
            interface $AREA_IFL_B;
        }
    }
}
```

## evo/protocols/ospf-area0-2-p2p-1-ldp-sync-core-loopback.conf

```
/*
 * Topic: OSPF backbone area with two point-to-point and one LDP-synchronized core interface
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - Point-to-point core interfaces use BFD, post-convergence LFA with node protection and protected adjacency SIDs.
 *   - LDP-synchronized core interfaces use BFD.
 *   - The loopback is passive.
 * Pair with: none
 * Variables (example values from wanedge4_acx7100-48l):
 *   $CORE_INTF_1  e.g. et-0/0/52.0
 *   $CORE_INTF_2  e.g. ae4.0
 *   $CORE_INTF_3  e.g. et-0/0/53.0
 */
protocols {
    ospf {
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
            interface $CORE_INTF_3 {
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface lo0.0 {
                passive;
            }
        }
    }
}
```

## evo/protocols/ospf-area0-3-ldp-sync-core-loopback.conf

```
/*
 * Topic: OSPF backbone area with three LDP-synchronized core interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Highlights:
 *   - LDP-synchronized core interfaces use BFD.
 *   - The loopback is passive.
 * Pair with: none
 * Variables (example values from wanedge3_acx7509):
 *   $CORE_INTF_1  e.g. et-1/0/0.0
 *   $CORE_INTF_2  e.g. et-1/0/1.0
 *   $CORE_INTF_3  e.g. et-1/0/2.0
 */
protocols {
    ospf {
        area 0.0.0.0 {
            interface $CORE_INTF_1 {
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface $CORE_INTF_2 {
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface $CORE_INTF_3 {
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface lo0.0 {
                passive;
            }
        }
    }
}
```

## evo/protocols/ospf-area0-3-p2p-1-ldp-sync-core-loopback-mgmt-disable.conf

```
/*
 * Topic: OSPF backbone area with core interfaces and management interfaces disabled
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 1
 *   total 1
 * Highlights:
 *   - Point-to-point core interfaces use BFD, post-convergence LFA with node protection and protected adjacency SIDs.
 *   - LDP-synchronized core interfaces use BFD.
 *   - fxp0.0 and em0.0 are disabled in OSPF; the loopback is passive.
 * Pair with: none
 * Variables (example values from p2_ptx10001-36mr):
 *   $CORE_INTF_1  e.g. et-0/0/4.0
 *   $CORE_INTF_2  e.g. ae4.0
 *   $CORE_INTF_3  e.g. et-0/2/8.0
 *   $CORE_INTF_4  e.g. et-0/0/9.0
 */
protocols {
    ospf {
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
            interface $CORE_INTF_3 {
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
            interface $CORE_INTF_4 {
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface fxp0.0 {
                disable;
            }
            interface em0.0 {
                disable;
            }
            interface lo0.0 {
                passive;
            }
        }
    }
}
```

## evo/protocols/ospf-area0-3-p2p-1-ldp-sync-core-loopback.conf

```
/*
 * Topic: OSPF backbone area with three point-to-point and one LDP-synchronized core interface
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003
 * Count:
 *   p1_ptx10003 1
 *   total 1
 * Highlights:
 *   - Point-to-point core interfaces use BFD, post-convergence LFA with node protection and protected adjacency SIDs.
 *   - LDP-synchronized core interfaces use BFD.
 *   - The loopback is passive.
 * Pair with: none
 * Variables (example values from p1_ptx10003):
 *   $CORE_INTF_1  e.g. ae2.0
 *   $CORE_INTF_2  e.g. et-1/0/5.0
 *   $CORE_INTF_3  e.g. et-1/0/1.0
 *   $CORE_INTF_4  e.g. et-1/0/0.0
 */
protocols {
    ospf {
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
            interface $CORE_INTF_3 {
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
            interface $CORE_INTF_4 {
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface lo0.0 {
                passive;
            }
        }
    }
}
```

## evo/protocols/ospf-backup-spf-options-traffic-engineering-sr-mapping-server.conf

```
/*
 * Topic: OSPF post-convergence LFA, traffic engineering and segment routing with a mapping server
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003 p2_ptx10001-36mr wanedge4_acx7100-48l
 * Count:
 *   p1_ptx10003 1
 *   p2_ptx10001-36mr 1
 *   wanedge4_acx7100-48l 1
 *   total 3
 * Highlights:
 *   - Post-convergence LFA (up to 8 labels, 5 backup paths) computed over source packet routing.
 *   - Node SID index and SRGB from 16000; uses the ospf-mapping-server entry, installs prefix SIDs for the best route and enables ldp-stitching.
 * Pair with: none
 * Variables (example values from p1_ptx10003):
 *   $NODE_SID_INDEX  e.g. 103
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
            node-segment ipv4-index $NODE_SID_INDEX;
            srgb start-label 16000 index-range 8000;
            mapping-server ospf-mapping-server;
            install-prefix-sid-for-best-route;
            ldp-stitching;
        }
    }
}
```

## evo/protocols/ospf-traffic-engineering.conf

```
/*
 * Topic: OSPF traffic-engineering extensions
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
protocols {
    ospf {
        traffic-engineering;
    }
}
```

## evo/protocols/ospf3-area-1-interface.conf

```
/*
 * Topic: OSPFv3 area with one interface
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - One interface in the area with default settings.
 * Pair with: none
 * Variables (example values from wanedge4_acx7100-48l):
 *   $OSPF_AREA   e.g. 0.0.0.0
 *   $AREA_IFL_A  e.g. ae4.0
 */
protocols {
    ospf3 {
        area $OSPF_AREA {
            interface $AREA_IFL_A;
        }
    }
}
```

## evo/protocols/ospf3-area-2-interface-p2p.conf

```
/*
 * Topic: OSPFv3 area with two interfaces, one point-to-point
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 100
 *   total 100
 * Highlights:
 *   - The second interface runs as point-to-point.
 * Pair with: none
 * Variables (example values from wanedge4_acx7100-48l):
 *   $OSPF_AREA   e.g. 0.0.0.1
 *   $AREA_IFL_A  e.g. ae4.2801
 *   $AREA_IFL_B  e.g. et-0/0/1.2801
 */
protocols {
    ospf3 {
        area $OSPF_AREA {
            interface $AREA_IFL_A;
            interface $AREA_IFL_B {
                interface-type p2p;
            }
        }
    }
}
```

## evo/protocols/ospf3-area-2-interface.conf

```
/*
 * Topic: OSPFv3 area with two interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr wanedge3_acx7509
 * Count:
 *   p2_ptx10001-36mr 101
 *   wanedge3_acx7509 1
 *   total 102
 * Highlights:
 *   - Both interfaces use default settings.
 * Pair with: none
 * Variables (example values from p2_ptx10001-36mr):
 *   $OSPF_AREA   e.g. 0.0.0.0
 *   $AREA_IFL_A  e.g. et-0/2/8.0
 *   $AREA_IFL_B  e.g. ae4.0
 */
protocols {
    ospf3 {
        area $OSPF_AREA {
            interface $AREA_IFL_A;
            interface $AREA_IFL_B;
        }
    }
}
```

## evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-irb.conf

```
/*
 * Topic: EVPN-ELAN VLAN-based MAC-VRF with an IRB gateway
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 325
 *   wanedge4_acx7100-48l 350
 *   total 675
 * Highlights:
 *   - MAC-VRF in VLAN-based service mode with one attachment circuit and an IRB unit as the layer 3 interface.
 *   - default-gateway do-not-advertise stops the gateway MAC/IP advertisement; the control word is not used.
 * Pair with: none
 * Variables (example values from wanedge3_acx7509):
 *   $INSTANCE_NAME    e.g. emh_group_400_1851
 *   $RD_SUB_ADMIN     e.g. 44.44.44.44
 *   $RD_SUB_ASSIGNED  e.g. 1851
 *   $RT_AS            e.g. 60525
 *   $RT_ID            e.g. 1851
 *   $BD_NAME          e.g. mvbased_1851
 *   $VLAN_BD          e.g. 1851
 *   $AC_IFL           e.g. ae0.1851
 *   $IRB_UNIT         e.g. irb.1851
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
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
        vlans {
            $BD_NAME {
                vlan-id $VLAN_BD;
                interface $AC_IFL;
                l3-interface $IRB_UNIT;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`, `$IRB_UNIT`): required, for each reference; one of `interfaces/ifl-irb-inet`, `interfaces/ifl-irb-virtual-gateway`, `interfaces/ifl-vlan-bridge-esi`, `interfaces/ifl-vlan-bridge`

## evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-no-control-word.conf

```
/*
 * Topic: EVPN-ELAN VLAN-based MAC-VRF with one attachment circuit
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 275
 *   wanedge4_acx7100-48l 275
 *   total 550
 * Highlights:
 *   - MAC-VRF in VLAN-based service mode; the control word is not used (no-control-word).
 * Pair with: none
 * Variables (example values from wanedge3_acx7509):
 *   $INSTANCE_NAME    e.g. emh_group_200_1701
 *   $RD_SUB_ADMIN     e.g. 44.44.44.44
 *   $RD_SUB_ASSIGNED  e.g. 1701
 *   $RT_AS            e.g. 61515
 *   $RT_ID            e.g. 1701
 *   $BD_NAME          e.g. mvbased_1701
 *   $VLAN_BD          e.g. 1701
 *   $AC_IFL           e.g. ae0.1701
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type mac-vrf;
        protocols {
            evpn {
                no-control-word;
            }
        }
        service-type vlan-based;
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
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
- `logical-interface` (`$AC_IFL`): required, for each reference; one of `interfaces/ifl-vlan-bridge-esi`, `interfaces/ifl-vlan-bridge`

## evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle-2-uni-no-control-word.conf

```
/*
 * Topic: EVPN-ELAN VLAN-bundle MAC-VRF with two attachment circuits
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 600
 *   wanedge4_acx7100-48l 600
 *   total 1200
 * Highlights:
 *   - MAC-VRF in VLAN-bundle service mode; both attachment circuits join one bridge domain.
 *   - The control word is not used (no-control-word).
 * Pair with: none
 * Variables (example values from wanedge3_acx7509):
 *   $INSTANCE_NAME    e.g. elan_group_500_2001
 *   $RD_SUB_ADMIN     e.g. 44.44.44.44
 *   $RD_SUB_ASSIGNED  e.g. 2001
 *   $RT_AS            e.g. 62525
 *   $RT_ID            e.g. 2001
 *   $BD_NAME          e.g. mvbundle_2001
 *   $AC_IFL_A         e.g. ae0.2001
 *   $AC_IFL_B         e.g. ae0.2002
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
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
        vlans {
            $BD_NAME {
                interface $AC_IFL_A;
                interface $AC_IFL_B;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL_A`, `$AC_IFL_B`): required, for each reference; one of `interfaces/ifl-vlan-bridge-esi`, `interfaces/ifl-vlan-bridge`

## evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf

```
/*
 * Topic: EVPN flexible cross-connect, VLAN-aware, two attachment circuits
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 500
 *   wanedge4_acx7100-48l 500
 *   total 1000
 * Highlights:
 *   - Two attachment circuits share one EVPN-VPWS instance; each keeps its own VPWS service identifiers.
 * Pair with: none
 * Peers with:
 *   [wanedge3_acx7509] <-> [wanedge1_mx304, wanedge2_mx10004]
 *   [wanedge4_acx7100-48l] <-> [wanedge1_mx304, wanedge2_mx10004]
 * Variables (example values from wanedge3_acx7509):
 *   $INSTANCE_NAME    e.g. vfxc_group_40_1001
 *   $AC_IFL_A         e.g. ae0.1001
 *   $SVC_ID_LOCAL_A   e.g. 1
 *   $SVC_ID_REMOTE_A  e.g. 2
 *   $AC_IFL_B         e.g. ae0.1002
 *   $SVC_ID_LOCAL_B   e.g. 11
 *   $SVC_ID_REMOTE_B  e.g. 21
 *   $RD_SUB_ADMIN     e.g. 44.44.44.44
 *   $RD_SUB_ASSIGNED  e.g. 1001
 *   $RT_AS            e.g. 65000
 *   $RT_ID            e.g. 1001
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_IFL_A {
                    vpws-service-id {
                        local $SVC_ID_LOCAL_A;
                        remote $SVC_ID_REMOTE_A;
                    }
                }
                interface $AC_IFL_B {
                    vpws-service-id {
                        local $SVC_ID_LOCAL_B;
                        remote $SVC_ID_REMOTE_B;
                    }
                }
                flexible-cross-connect-vlan-aware;
            }
        }
        interface $AC_IFL_A;
        interface $AC_IFL_B;
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL_A`, `$AC_IFL_B`): required, for each reference; `interfaces/ifl-vlan-ccc-esi-all-active-family-ccc`

## evo/routing-instances/evpn-vpws/ri-evpn-vpws-control-word.conf

```
/*
 * Topic: EVPN-VPWS point-to-point service with control word
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1000
 *   wanedge4_acx7100-48l 1000
 *   total 2000
 * Highlights:
 *   - One attachment circuit per instance; the local and remote VPWS service identifiers pair it with the remote PE.
 *   - The control word is signaled for the pseudowire.
 * Pair with: none
 * Peers with:
 *   [wanedge3_acx7509] <-> [wanedge1_mx304, wanedge2_mx10004]
 *   [wanedge4_acx7100-48l] <-> [wanedge1_mx304, wanedge2_mx10004]
 * Variables (example values from wanedge3_acx7509):
 *   $INSTANCE_NAME       e.g. vpws_group_50_1
 *   $AC_IFL              e.g. ae0.1
 *   $VPWS_SVC_ID_LOCAL   e.g. 2
 *   $VPWS_SVC_ID_REMOTE  e.g. 1
 *   $RD_SUB_ADMIN        e.g. 44.44.44.44
 *   $RD_SUB_ASSIGNED     e.g. 1
 *   $RT_AS               e.g. 64512
 *   $RT_ID               e.g. 1
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
                control-word;
            }
        }
        interface $AC_IFL;
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`): required, for each reference; one of `interfaces/ifl-vlan-ccc-esi-all-active-family-ccc`, `interfaces/ifl-vlan-ccc-family-ccc`

## evo/routing-instances/l3vpn/ri-l3vpn-evpn-ip-prefix-vrf-target.conf

```
/*
 * Topic: EVPN Type 5 IP-prefix VRF with vrf-target
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 325
 *   wanedge4_acx7100-48l 350
 *   total 675
 * Highlights:
 *   - Advertises the VRF prefixes as EVPN Type 5 routes with MPLS encapsulation and direct next hop.
 *   - vrf-table-label gives the VRF one label; route targets come from vrf-target, without import or export policies.
 * Pair with: none
 * Variables (example values from wanedge3_acx7509):
 *   $INSTANCE_NAME    e.g. evpn_1851
 *   $ROUTER_ID        e.g. 4.4.4.4
 *   $IRB_UNIT         e.g. irb.1851
 *   $RD_SUB_ADMIN     e.g. 63434
 *   $RD_SUB_ASSIGNED  e.g. 1851
 *   $RT_AS            e.g. 60555
 *   $RT_ID            e.g. 1851
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
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
        vrf-table-label;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `irb-service`: required, all related; one of `routing-instances/evpn-elan/ri-evpn-elan-vlan-based-irb`, `routing-instances/evpn-elan/ri-evpn-elan-vlan-based-no-control-word`, `routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle-2-uni-no-control-word`, `routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni`, `routing-instances/evpn-vpws/ri-evpn-vpws-control-word`, `routing-instances/l3vpn/ri-l3vpn-evpn-ip-prefix-vrf-target`
- `logical-interface` (`$IRB_UNIT`): required, for each reference; one of `interfaces/ifl-irb-inet`, `interfaces/ifl-irb-virtual-gateway`

## evo/routing-options/autonomous-system.conf

```
/*
 * Topic: Autonomous system number
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003 p2_ptx10001-36mr wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   p1_ptx10003 1
 *   p2_ptx10001-36mr 1
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p1_ptx10003):
 *   $ASN  e.g. 64512
 */
routing-options {
    autonomous-system $ASN;
}
```

## evo/routing-options/flow-route-6-match-accept.conf

```
/*
 * Topic: BGP flow specification routes matching source, destination, ports, DSCP and ICMP
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Six flow routes, each with action accept, advertised with BGP family inet flow.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $FLOW_SRC_PFX       e.g. 211.211.2.2/32
 *   $FLOW_DST_PFX       e.g. 211.212.1.2/32
 *   $FLOW_SRC_PORT      e.g. 65074
 *   $FLOW_DST_PORT      e.g. 23
 *   $FLOW_DSCP_SRC_PFX  e.g. 211.216.2.2/32
 *   $FLOW_ICMP_SRC_PFX  e.g. 211.215.2.2/32
 */
routing-options {
    flow {
        route source_ip {
            match source $FLOW_SRC_PFX;
            then accept;
        }
        route dest_ip {
            match destination $FLOW_DST_PFX;
            then accept;
        }
        route proto_tcp_source_port_match {
            match {
                protocol tcp;
                source-port $FLOW_SRC_PORT;
            }
            then accept;
        }
        route proto_tcp_dest_port_match {
            match {
                protocol tcp;
                destination-port $FLOW_DST_PORT;
            }
            then accept;
        }
        route descp_match {
            match {
                dscp 10;
                source $FLOW_DSCP_SRC_PFX;
            }
            then accept;
        }
        route icmp_match {
            match {
                protocol icmp;
                source $FLOW_ICMP_SRC_PFX;
                icmp-code 1;
                icmp-type 8;
            }
            then accept;
        }
    }
}
```

## evo/routing-options/forwarding-table-pplb-chained-nh-evpn.conf

```
/*
 * Topic: Forwarding table with per-packet load balancing and EVPN chained composite next hops
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - Exports the pplb policy to the forwarding table and enables ingress chained composite next hops for EVPN.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge4_acx7100-48l):
 *   $PPLB_NAME  e.g. pplb
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
- `policy-statement` (`$PPLB_NAME`): required, for each reference; `policy-options/policy-statement/ps-pplb-evpn-term`

## evo/routing-options/forwarding-table-pplb-evpn-egress-link-protection.conf

```
/*
 * Topic: Forwarding table with per-packet load balancing and EVPN egress link protection
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Highlights:
 *   - Exports the pplb policy to the forwarding table and enables EVPN egress link protection.
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-pplb-evpn-term.conf
 *
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    forwarding-table {
        export pplb;
        evpn-egress-link-protection;
    }
}
```

## evo/routing-options/forwarding-table-pplb.conf

```
/*
 * Topic: Forwarding-table per-packet load balancing
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l p1_ptx10003 p2_ptx10001-36mr
 * Count:
 *   ce1_acx7100-48l 1
 *   p1_ptx10003 1
 *   p2_ptx10001-36mr 1
 *   total 3
 * Highlights:
 *   - Exports the load-balance policy to the forwarding table so all equal-cost next hops are installed.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce1_acx7100-48l):
 *   $PPLB_NAME  e.g. pplb
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$PPLB_NAME`): required, for each reference; `policy-options/policy-statement/per-packet-load-balance-accept`

## evo/routing-options/graceful-restart.conf

```
/*
 * Topic: Graceful restart
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    graceful-restart;
}
```

## evo/routing-options/router-id.conf

```
/*
 * Topic: Router ID
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003 p2_ptx10001-36mr wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   p1_ptx10003 1
 *   p2_ptx10001-36mr 1
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p1_ptx10003):
 *   $ROUTER_ID  e.g. 3.3.3.3
 */
routing-options {
    router-id $ROUTER_ID;
}
```

## evo/routing-options/source-packet-routing-mapping-server-entry.conf

```
/*
 * Topic: Segment routing mapping server entry for LDP prefixes
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003 p2_ptx10001-36mr wanedge4_acx7100-48l
 * Count:
 *   p1_ptx10003 1
 *   p2_ptx10001-36mr 1
 *   wanedge4_acx7100-48l 1
 *   total 3
 * Highlights:
 *   - Mapping server entry ospf-mapping-server assigns prefix SIDs to a prefix range (prefix-segment-range ldp-lo1).
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    source-packet-routing {
        mapping-server-entry ospf-mapping-server {
            prefix-segment-range ldp-lo1 {
                start-prefix 4.4.4.4/32;
                start-index 1000;
                size 10;
            }
        }
    }
}
```

## evo/vlans/vlan-2-interfaces.conf

```
/*
 * Topic: VLAN with two units
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 2500
 *   total 2500
 * Highlights:
 *   - Bridges one VLAN across the listed units.
 * Pair with: none
 * Variables (example values from ce1_acx7100-48l):
 *   $VLAN_NAME  e.g. VPWS1
 *   $VLAN       e.g. 1
 *   $AC_IFL_A   e.g. et-0/0/24:0.1
 *   $AC_IFL_B   e.g. ae0.1
 */
vlans {
    $VLAN_NAME {
        vlan-id $VLAN;
        interface $AC_IFL_A;
        interface $AC_IFL_B;
    }
}
```

## junos/bridge-domains/bridge-domain-vlan-2-interfaces.conf

```
/*
 * Topic: VLAN bridge domain with two units
 * Seen on:
 *   Junos: ce4_mx480
 *   EVO: (none)
 * Count:
 *   ce4_mx480 2500
 *   total 2500
 * Highlights:
 *   - Bridges one VLAN across the listed units.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from ce4_mx480):
 *   $BD_NAME   e.g. VPWS1
 *   $VLAN      e.g. 1
 *   $AC_IFL_A  e.g. xe-3/1/10.1
 *   $AC_IFL_B  e.g. ae0.1
 */
bridge-domains {
    $BD_NAME {
        vlan-id $VLAN;
        interface $AC_IFL_A;
        interface $AC_IFL_B;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL_A`, `$AC_IFL_B`): required, for each reference; `interfaces/ifl-vlan-bridge`

## junos/chassis/aggregated-devices-ethernet.conf

```
/*
 * Topic: Aggregated Ethernet device count
 * Seen on:
 *   Junos: ce4_mx480 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ce4_mx480 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 3
 * Highlights:
 *   - Pre-allocates the aggregated Ethernet interfaces the chassis may create.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce4_mx480):
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

## junos/chassis/fpc-mx10004-2-pic-100g.conf

```
/*
 * Topic: MX10004 line card port speeds
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 1
 *   total 1
 * Highlights:
 *   - Port 0 on two PICs runs at 100G.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge2_mx10004):
 *   $FPC_SLOT  e.g. 3
 */
chassis {
    fpc $FPC_SLOT {
        pic 0 {
            port 0 {
                speed 100g;
            }
        }
        pic 3 {
            port 0 {
                speed 100g;
            }
        }
    }
}
```

## junos/chassis/fpc-mx304-8x100g-2x4x10g.conf

```
/*
 * Topic: MX304 line card port speeds
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - Eight 100G ports and two ports channelized to four 10G sub-ports.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $FPC_SLOT  e.g. 0
 */
chassis {
    fpc $FPC_SLOT {
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
            port 3 {
                speed 100g;
            }
            port 4 {
                speed 100g;
            }
            port 5 {
                speed 100g;
            }
            port 6 {
                speed 100g;
            }
            port 7 {
                speed 100g;
            }
            port 9 {
                number-of-sub-ports 4;
                speed 10g;
            }
            port 11 {
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
 * Topic: Enhanced-IP network services mode
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *   - Runs the chassis in enhanced-IP mode, required for the Trio and Express feature set used by the services.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
chassis {
    network-services enhanced-ip;
}
```

## junos/class-of-service/classifiers/cl-dscp-exp-ieee8021p-7class-exp-be-001.conf

```
/*
 * Topic: DSCP, EXP and IEEE 802.1p classifiers for seven forwarding classes, EXP 001 to BEST-EFFORT
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 1
 *   total 1
 * Highlights:
 *   - DSCP, EXP and 802.1p classifiers for the seven forwarding classes.
 *   - The EXP classifier maps 001 to BEST-EFFORT (low loss priority) and 000 to LOW (high loss priority).
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-7queue-model.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    classifiers {
        dscp DSCP {
            forwarding-class BEST-EFFORT {
                loss-priority low code-points [ af12 af13 ];
            }
            forwarding-class BUSINESS {
                loss-priority low code-points [ cs4 af41 af42 af43 ];
            }
            forwarding-class CONTROL {
                loss-priority low code-points [ cs6 cs7 ];
            }
            forwarding-class LOW {
                loss-priority low code-points [ cs1 af11 ];
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
                loss-priority low code-points 001;
            }
            forwarding-class BUSINESS {
                loss-priority high code-points 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-points [ 110 111 ];
            }
            forwarding-class LOW {
                loss-priority high code-points 000;
            }
            forwarding-class MEDIUM {
                loss-priority high code-points 010;
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
                loss-priority low code-points [ 110 111 ];
            }
            forwarding-class LOW {
                loss-priority low code-points 001;
            }
            forwarding-class MEDIUM {
                loss-priority high code-points 010;
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

## junos/class-of-service/classifiers/cl-dscp-exp-ieee8021p-8class.conf

```
/*
 * Topic: DSCP, EXP and IEEE 802.1p classifiers for eight forwarding classes
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - DSCP, two EXP (EXP and EXP_DSCP) and 802.1p classifiers map code points to the eight forwarding classes and loss priorities.
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-8queue-model.conf
 *
 * Peers with: n/a
 * Variables: none
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
        exp EXP_DSCP {
            forwarding-class BEST-EFFORT {
                loss-priority low code-points 000;
            }
            forwarding-class BUSINESS {
                loss-priority low code-points 100;
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
                loss-priority low code-points 011;
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

## junos/class-of-service/drop-profiles/drop-profiles-fill-level.conf

```
/*
 * Topic: Two fill-level drop profiles
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - dp1 and dp2 set drop probability by queue fill level.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
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
}
```

## junos/class-of-service/forwarding-classes/fc-7queue-model.conf

```
/*
 * Topic: Seven forwarding classes on seven queues
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 1
 *   total 1
 * Highlights:
 *   - BEST-EFFORT, LOW, MEDIUM, SIG-OAM, BUSINESS, REALTIME and CONTROL each map to their own queue.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    forwarding-classes {
        class BEST-EFFORT queue-num 0;
        class BUSINESS queue-num 5;
        class CONTROL queue-num 4;
        class LOW queue-num 6;
        class MEDIUM queue-num 1;
        class REALTIME queue-num 2;
        class SIG-OAM queue-num 3;
    }
}
```

## junos/class-of-service/forwarding-classes/fc-8queue-model.conf

```
/*
 * Topic: Eight forwarding classes on eight queues
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - BEST-EFFORT, LOW, MEDIUM, SIG-OAM, BUSINESS, REALTIME, NETWORK and CONTROL each map to their own queue.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
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

## junos/class-of-service/interfaces/ifl-dscp-classifier.conf

```
/*
 * Topic: DSCP classifier on a logical interface
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 325
 *   wanedge2_mx10004 325
 *   total 650
 * Highlights:
 *   - Classifies incoming packets on the unit with the DSCP classifier.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $COS_INTF  e.g. irb
 *   $UNIT      e.g. 1851
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                classifiers {
                    dscp DSCP;
                }
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `classifier` (`DSCP`): required, for each reference; one of `class-of-service/classifiers/cl-dscp-exp-ieee8021p-7class-exp-be-001`, `class-of-service/classifiers/cl-dscp-exp-ieee8021p-8class`

## junos/class-of-service/interfaces/ifl-exp-classifier-rewrite-ieee8021p-rewrite.conf

```
/*
 * Topic: EXP classifier with EXP and 802.1p rewrite on a logical interface
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 1
 *   total 1
 * Highlights:
 *   - Classifies on EXP and rewrites both the EXP bits and 802.1p.
 * Pair with:
 *  - junos/class-of-service/classifiers/cl-dscp-exp-ieee8021p-7class-exp-be-001.conf
 *
 * Peers with: n/a
 * Variables (example values from wanedge2_mx10004):
 *   $COS_INTF  e.g. et-3/3/0
 *   $UNIT      e.g. 0
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
                    ieee-802.1 8021P-REWRITE;
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
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 2
 *   total 2
 * Pair with:
 *  - junos/class-of-service/classifiers/cl-dscp-exp-ieee8021p-8class.conf
 *
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $COS_INTF  e.g. ae2
 *   $UNIT      e.g. 0
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

## junos/class-of-service/interfaces/ifl-exp-classifier.conf

```
/*
 * Topic: EXP classifier on a logical interface
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 1
 *   total 1
 * Highlights:
 *   - Classifies incoming MPLS packets on the unit with the EXP classifier.
 * Pair with:
 *  - junos/class-of-service/classifiers/cl-dscp-exp-ieee8021p-7class-exp-be-001.conf
 *
 * Peers with: n/a
 * Variables (example values from wanedge2_mx10004):
 *   $COS_INTF  e.g. et-3/0/0
 *   $UNIT      e.g. 0
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                classifiers {
                    exp EXP;
                }
            }
        }
    }
}
```

## junos/class-of-service/interfaces/ifl-ieee8021p-classifier.conf

```
/*
 * Topic: IEEE 802.1p classifier on a logical interface
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 2475
 *   wanedge2_mx10004 2475
 *   total 4950
 * Highlights:
 *   - Classifies incoming frames on the unit with the 8021P classifier.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $COS_INTF  e.g. ae0
 *   $UNIT      e.g. 1
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `classifier` (`8021P`): required, for each reference; one of `class-of-service/classifiers/cl-dscp-exp-ieee8021p-7class-exp-be-001`, `class-of-service/classifiers/cl-dscp-exp-ieee8021p-8class`

## junos/class-of-service/rewrite-rules/rr-dscp-exp-ieee8021p-8class.conf

```
/*
 * Topic: DSCP, EXP and IEEE 802.1p rewrite rules for eight forwarding classes
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - Marks DSCP, EXP and 802.1p from forwarding class and loss priority.
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-8queue-model.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    rewrite-rules {
        dscp DSCP-REWRITE {
            forwarding-class BEST-EFFORT {
                loss-priority low code-point be;
            }
            forwarding-class BUSINESS {
                loss-priority low code-point cs4;
            }
            forwarding-class CONTROL {
                loss-priority low code-point cs7;
            }
            forwarding-class LOW {
                loss-priority low code-point cs1;
            }
            forwarding-class MEDIUM {
                loss-priority high code-point cs2;
            }
            forwarding-class NETWORK {
                loss-priority low code-point cs6;
            }
            forwarding-class REALTIME {
                loss-priority low code-point cs5;
            }
            forwarding-class SIG-OAM {
                loss-priority low code-point cs3;
            }
        }
        exp EXP-REWRITE {
            forwarding-class BEST-EFFORT {
                loss-priority high code-point 000;
            }
            forwarding-class BUSINESS {
                loss-priority high code-point 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-point 111;
            }
            forwarding-class LOW {
                loss-priority low code-point 001;
            }
            forwarding-class MEDIUM {
                loss-priority high code-point 010;
            }
            forwarding-class NETWORK {
                loss-priority high code-point 110;
            }
            forwarding-class REALTIME {
                loss-priority low code-point 101;
            }
            forwarding-class SIG-OAM {
                loss-priority high code-point 011;
            }
        }
        ieee-802.1 8021P-REWRITE {
            forwarding-class BEST-EFFORT {
                loss-priority high code-point 000;
            }
            forwarding-class BUSINESS {
                loss-priority high code-point 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-point 111;
            }
            forwarding-class LOW {
                loss-priority low code-point 001;
            }
            forwarding-class MEDIUM {
                loss-priority high code-point 010;
            }
            forwarding-class NETWORK {
                loss-priority high code-point 110;
            }
            forwarding-class REALTIME {
                loss-priority low code-point 101;
            }
            forwarding-class SIG-OAM {
                loss-priority high code-point 011;
            }
        }
    }
}
```

## junos/class-of-service/rewrite-rules/rr-exp-ieee8021p-7class.conf

```
/*
 * Topic: EXP and IEEE 802.1p rewrite rules for seven forwarding classes
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 1
 *   total 1
 * Highlights:
 *   - Marks EXP and 802.1p from forwarding class and loss priority.
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-7queue-model.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    rewrite-rules {
        exp EXP-REWRITE {
            forwarding-class BEST-EFFORT {
                loss-priority high code-point 000;
            }
            forwarding-class BUSINESS {
                loss-priority high code-point 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-point 111;
            }
            forwarding-class LOW {
                loss-priority low code-point 001;
            }
            forwarding-class MEDIUM {
                loss-priority high code-point 010;
            }
            forwarding-class REALTIME {
                loss-priority low code-point 101;
            }
            forwarding-class SIG-OAM {
                loss-priority high code-point 011;
            }
        }
        ieee-802.1 8021P-REWRITE {
            forwarding-class BEST-EFFORT {
                loss-priority high code-point 000;
            }
            forwarding-class BUSINESS {
                loss-priority high code-point 100;
            }
            forwarding-class CONTROL {
                loss-priority low code-point 111;
            }
            forwarding-class LOW {
                loss-priority low code-point 001;
            }
            forwarding-class MEDIUM {
                loss-priority high code-point 010;
            }
            forwarding-class REALTIME {
                loss-priority low code-point 101;
            }
            forwarding-class SIG-OAM {
                loss-priority high code-point 011;
            }
        }
    }
}
```

## junos/firewall/filter-destination-address-next-interface.conf

```
/*
 * Topic: Filter-based forwarding on destination address to a next interface
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *   - Counts matching packets and forwards them to a next interface.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $FILTER_NAME     e.g. filter_ip_match_dest2
 *   $DST_PFX         e.g. 223.223.5.100/32
 *   $NEXT_INTERFACE  e.g. et-0/0/1
 */
firewall {
    family inet {
        filter $FILTER_NAME {
            term 1 {
                from {
                    destination-address {
                        $DST_PFX;
                    }
                }
                then {
                    count $FILTER_NAME;
                    next-interface {
                        $NEXT_INTERFACE;
                    }
                }
            }
        }
    }
}
```

## junos/firewall/filter-destination-address-next-ip.conf

```
/*
 * Topic: Filter-based forwarding on destination address to a next-hop IP address
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *   - Counts matching packets and forwards them to a next-hop IP address.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $FILTER_NAME  e.g. filter_ip_match_dest1
 *   $DST_PFX      e.g. 223.223.1.100/32
 *   $NEXT_IP      e.g. 192.168.56.2/32
 */
firewall {
    family inet {
        filter $FILTER_NAME {
            term 1 {
                from {
                    destination-address {
                        $DST_PFX;
                    }
                }
                then {
                    count $FILTER_NAME;
                    next-ip $NEXT_IP;
                }
            }
        }
    }
}
```

## junos/firewall/filter-source-address-next-interface.conf

```
/*
 * Topic: Filter-based forwarding on source address to a next interface
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *   - Counts matching packets and forwards them to a next interface.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $FILTER_NAME     e.g. filter_ip_match_source2
 *   $SRC_PFX         e.g. 222.222.6.100/32
 *   $NEXT_INTERFACE  e.g. et-0/0/1
 */
firewall {
    family inet {
        filter $FILTER_NAME {
            term 1 {
                from {
                    source-address {
                        $SRC_PFX;
                    }
                }
                then {
                    count $FILTER_NAME;
                    next-interface {
                        $NEXT_INTERFACE;
                    }
                }
            }
        }
    }
}
```

## junos/firewall/filter-source-address-next-ip.conf

```
/*
 * Topic: Filter-based forwarding on source address to a next-hop IP address
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *   - Counts matching packets and forwards them to a next-hop IP address.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $FILTER_NAME  e.g. filter_ip_match_source1
 *   $SRC_PFX      e.g. 222.222.2.100/32
 *   $NEXT_IP      e.g. 192.168.56.2/32
 */
firewall {
    family inet {
        filter $FILTER_NAME {
            term 1 {
                from {
                    source-address {
                        $SRC_PFX;
                    }
                }
                then {
                    count $FILTER_NAME;
                    next-ip $NEXT_IP;
                }
            }
        }
    }
}
```

## junos/firewall/filter-tcp-destination-port-next-interface.conf

```
/*
 * Topic: Filter-based forwarding on TCP destination port to a next interface
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *   - Counts matching packets and forwards them to a next interface.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $FILTER_NAME     e.g. filter_ip_dport2
 *   $DST_PORT        e.g. 23
 *   $NEXT_INTERFACE  e.g. et-0/0/1
 */
firewall {
    family inet {
        filter $FILTER_NAME {
            term 1 {
                from {
                    protocol tcp;
                    destination-port $DST_PORT;
                }
                then {
                    count $FILTER_NAME;
                    next-interface {
                        $NEXT_INTERFACE;
                    }
                }
            }
        }
    }
}
```

## junos/firewall/filter-tcp-destination-port-next-ip.conf

```
/*
 * Topic: Filter-based forwarding on TCP destination port to a next-hop IP address
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *   - Counts matching packets and forwards them to a next-hop IP address.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $FILTER_NAME  e.g. filter_ip_dport1
 *   $DST_PORT     e.g. 80
 *   $NEXT_IP      e.g. 192.168.56.2/32
 */
firewall {
    family inet {
        filter $FILTER_NAME {
            term 1 {
                from {
                    protocol tcp;
                    destination-port $DST_PORT;
                }
                then {
                    count $FILTER_NAME;
                    next-ip $NEXT_IP;
                }
            }
        }
    }
}
```

## junos/firewall/filter-tcp-source-port-next-interface.conf

```
/*
 * Topic: Filter-based forwarding on TCP source port to a next interface
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *   - Counts matching packets and forwards them to a next interface.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $FILTER_NAME     e.g. filter_ip_sport2
 *   $SRC_PORT        e.g. 65001
 *   $NEXT_INTERFACE  e.g. et-0/0/1
 */
firewall {
    family inet {
        filter $FILTER_NAME {
            term 1 {
                from {
                    protocol tcp;
                    source-port $SRC_PORT;
                }
                then {
                    count $FILTER_NAME;
                    next-interface {
                        $NEXT_INTERFACE;
                    }
                }
            }
        }
    }
}
```

## junos/firewall/filter-tcp-source-port-next-ip.conf

```
/*
 * Topic: Filter-based forwarding on TCP source port to a next-hop IP address
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *   - Counts matching packets and forwards them to a next-hop IP address.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $FILTER_NAME  e.g. filter_ip_sport1
 *   $SRC_PORT     e.g. 65535
 *   $NEXT_IP      e.g. 192.168.56.2/32
 */
firewall {
    family inet {
        filter $FILTER_NAME {
            term 1 {
                from {
                    protocol tcp;
                    source-port $SRC_PORT;
                }
                then {
                    count $FILTER_NAME;
                    next-ip $NEXT_IP;
                }
            }
        }
    }
}
```

## junos/forwarding-options/hash-key-inet-inet6-layer-3-4-multiservice-mac.conf

```
/*
 * Topic: Load-balancing hash on layer 3 and 4 for IPv4 and IPv6, MAC addresses for multiservice
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *   - IPv4 and IPv6 hash on layer 3 and layer 4 fields; multiservice hashes on source and destination MAC.
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
        family multiservice {
            source-mac;
            destination-mac;
        }
    }
}
```

## junos/interfaces/ifd-ae-description-flexible-lacp-fast-failover-revertive-system-id.conf

```
/*
 * Topic: Aggregated Ethernet with fast LACP, fast failover, revertive link protection and system ID
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - LACP active with fast periodic, fast failover and revertive link protection; the LACP system ID is set explicitly.
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $IFD          e.g. ae0
 *   $DESCRIPTION  e.g. "PE1 to CE1"
 *   $LACP_SYS_ID  e.g. 00:00:00:01:01:01
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
                fast-failover;
                link-protection {
                    revertive;
                }
                system-id $LACP_SYS_ID;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-gigether`

## junos/interfaces/ifd-ae-description-flexible-lacp-fast-system-id.conf

```
/*
 * Topic: Aggregated Ethernet with flexible services, fast LACP and system ID
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 1
 *   total 1
 * Highlights:
 *   - LACP active with fast periodic; the LACP system ID is set explicitly.
 * Pair with: none
 * Variables (example values from wanedge2_mx10004):
 *   $IFD          e.g. ae0
 *   $DESCRIPTION  e.g. "PE2 to CE1"
 *   $LACP_SYS_ID  e.g. 00:00:00:01:01:01
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
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-gigether`

## junos/interfaces/ifd-ae-description-flexible-lacp-fast.conf

```
/*
 * Topic: Aggregated Ethernet with flexible services and fast LACP
 * Seen on:
 *   Junos: ce4_mx480
 *   EVO: (none)
 * Count:
 *   ce4_mx480 1
 *   total 1
 * Highlights:
 *   - Flexible VLAN tagging with flexible Ethernet services; LACP active with fast periodic.
 * Pair with: none
 * Variables (example values from ce4_mx480):
 *   $IFD          e.g. ae0
 *   $DESCRIPTION  e.g. "CE2 to PE3/4"
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
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `lag-member`: when the router's configuration has it, all related; one of `interfaces/ifd-lag-member-gigether-description`, `interfaces/ifd-lag-member-gigether`

## junos/interfaces/ifd-ae-description-lacp-fast.conf

```
/*
 * Topic: Described aggregated Ethernet bundle with active fast LACP
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - LACP runs active with fast periodic PDUs, so a failed member is detected in about three seconds.
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $IFD          e.g. ae2
 *   $DESCRIPTION  e.g. "CE1 to PE1/2"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
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

## junos/interfaces/ifd-description.conf

```
/*
 * Topic: Interface description
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $IFD          e.g. et-0/0/1
 *   $DESCRIPTION  e.g. "Link from WAN Edge1 to WAN Edge2"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
    }
}
```

## junos/interfaces/ifd-flexible-ethernet-services-description.conf

```
/*
 * Topic: Described port with flexible VLAN tagging and flexible Ethernet services
 * Seen on:
 *   Junos: ce4_mx480 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ce4_mx480 2
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 2
 *   total 5
 * Highlights:
 *   - Flexible tagging and `flexible-ethernet-services` let one port carry bridged, cross-connect and routed units side by side.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce4_mx480):
 *   $IFD          e.g. xe-3/1/10
 *   $DESCRIPTION  e.g. "link1_CE2 to TG_1/19"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
    }
}
```

## junos/interfaces/ifd-hierarchical-scheduler-flexible-ethernet-services-description.conf

```
/*
 * Topic: Port with hierarchical scheduling and flexible services
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *   - Hierarchical scheduler with flexible VLAN tagging and flexible Ethernet services.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $IFD          e.g. xe-0/0/9:0
 *   $DESCRIPTION  e.g. "PE1 to TG Port 1"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        hierarchical-scheduler;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
    }
}
```

## junos/interfaces/ifd-lag-member-gigether-description.conf

```
/*
 * Topic: Described member link of an aggregated-Ethernet bundle (gigether-options)
 * Seen on:
 *   Junos: ce4_mx480
 *   EVO: (none)
 * Count:
 *   ce4_mx480 2
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce4_mx480):
 *   $IFD          e.g. xe-3/0/4
 *   $DESCRIPTION  e.g. "Link1_CE2 to WANEdge3"
 *   $AE_BUNDLE    e.g. ae0
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        gigether-options {
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
 *   Junos: ce4_mx480 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ce4_mx480 2
 *   wanedge1_mx304 5
 *   wanedge2_mx10004 2
 *   total 9
 * Highlights:
 *   - `gigether-options 802.3ad` assigns the port to its bundle; Layer 2 and Layer 3 settings live on the `ae` interface.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce4_mx480):
 *   $IFD        e.g. xe-3/1/2
 *   $AE_BUNDLE  e.g. ae0
 */
interfaces {
    $IFD {
        gigether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## junos/interfaces/ifl-core-inet-mpls.conf

```
/*
 * Topic: Core-facing point-to-point link with IPv4 and MPLS families
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 3
 *   wanedge2_mx10004 2
 *   total 5
 * Highlights:
 *   - Untagged core link: `family inet` for OSPF and `family mpls` for LDP-signalled transport.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $CORE_PHYS     e.g. ae2
 *   $CORE_V4_ADDR  e.g. 192.168.12.1/24
 */
interfaces {
    $CORE_PHYS {
        unit 0 {
            family inet {
                address $CORE_V4_ADDR;
            }
            family mpls;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-ae-description-lacp-fast`, `interfaces/ifd-description`
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-gigether`

## junos/interfaces/ifl-irb-inet.conf

```
/*
 * Topic:   IRB unit carrying a single IPv4 address
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 200
 *   wanedge2_mx10004 175
 *   total 375
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $UNIT      e.g. 100
 *   $IRB_ADDR  e.g. 100.100.100.1/24
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

## junos/interfaces/ifl-irb-virtual-gateway.conf

```
/*
 * Topic: IRB unit with EVPN anycast virtual gateway and accept-data
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 150
 *   wanedge2_mx10004 150
 *   total 300
 * Highlights:
 *   - Each PE owns a unique IRB address while `virtual-gateway-address` and `virtual-gateway-v4-mac` are the same on every PE, so hosts see one anycast gateway wherever they attach.
 *   - `virtual-gateway-accept-data` lets the PE answer traffic (ping, ARP) sent to the shared gateway address rather than only forwarding it.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $UNIT      e.g. 1851
 *   $IRB_ADDR  e.g. 75.75.1.1/24
 *   $VGA       e.g. 75.75.1.3
 *   $VG_MAC    e.g. 00:66:66:66:66:02
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

## junos/interfaces/ifl-loopback-inet.conf

```
/*
 * Topic: Loopback unit with one IPv4 address
 * Seen on:
 *   Junos: ce4_mx480
 *   EVO: (none)
 * Count:
 *   ce4_mx480 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce4_mx480):
 *   $UNIT             e.g. 0
 *   $LOOPBACK_V4_PFX  e.g. 8.8.8.8/32
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

## junos/interfaces/ifl-vlan-bridge-esi.conf

```
/*
 * Topic:   Bridged logical interface with EVPN ESI multihoming
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 750
 *   wanedge2_mx10004 750
 *   total 1500
 * Pair with: none
 * Peers with:
 *   [wanedge1_mx304] <-> [wanedge2_mx10004]
 * Variables (example values from wanedge1_mx304):
 *   $IFD   e.g. ae0
 *   $UNIT  e.g. 1701
 *   $VLAN  e.g. 1701
 *   $ESI   e.g. 00:22:22:22:22:22:22:22:11:01
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-ae-description-flexible-lacp-fast-failover-revertive-system-id`, `interfaces/ifd-ae-description-flexible-lacp-fast-system-id`
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-gigether`

## junos/interfaces/ifl-vlan-bridge.conf

```
/*
 * Topic: VLAN-tagged bridge unit
 * Seen on:
 *   Junos: ce4_mx480 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ce4_mx480 5001
 *   wanedge1_mx304 1075
 *   wanedge2_mx10004 1052
 *   total 7128
 * Highlights:
 *   - `encapsulation vlan-bridge` places the unit in a bridge domain or VLAN.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce4_mx480):
 *   $IFD   e.g. ae0
 *   $UNIT  e.g. 1
 *   $VLAN  e.g. 1
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-bridge;
            vlan-id $VLAN;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-ae-description-flexible-lacp-fast`, `interfaces/ifd-flexible-ethernet-services-description`, `interfaces/ifd-hierarchical-scheduler-flexible-ethernet-services-description`
- `lag-member`: when the router's configuration has it, all related; one of `interfaces/ifd-lag-member-gigether-description`, `interfaces/ifd-lag-member-gigether`

## junos/interfaces/ifl-vlan-ccc-esi-all-active-family-ccc.conf

```
/*
 * Topic: VLAN CCC unit on an all-active Ethernet segment
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1700
 *   wanedge2_mx10004 1700
 *   total 3400
 * Highlights:
 *   - Attachment circuit unit for an EVPN-VPWS service, multihomed all-active on the given Ethernet segment identifier.
 * Pair with: none
 * Peers with:
 *   [wanedge1_mx304] <-> [wanedge2_mx10004]
 * Variables (example values from wanedge1_mx304):
 *   $IFD   e.g. ae0
 *   $UNIT  e.g. 1
 *   $VLAN  e.g. 1
 *   $ESI   e.g. 00:12:12:12:12:12:12:12:11:01
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
            family ccc;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-ae-description-flexible-lacp-fast-failover-revertive-system-id`, `interfaces/ifd-ae-description-flexible-lacp-fast-system-id`
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-gigether`

## junos/interfaces/ifl-vlan-ccc-family-ccc.conf

```
/*
 * Topic: VLAN-tagged circuit cross-connect unit with family ccc
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 300
 *   wanedge2_mx10004 300
 *   total 600
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $IFD   e.g. xe-0/0/9:0
 *   $UNIT  e.g. 1
 *   $VLAN  e.g. 1
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
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-hierarchical-scheduler-flexible-ethernet-services-description`

## junos/interfaces/ifl-vlan-inet-filter-input.conf

```
/*
 * Topic: IPv4 VLAN unit with an input firewall filter
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 8
 *   wanedge2_mx10004 8
 *   total 16
 * Highlights:
 *   - Applies an input firewall filter to IPv4 traffic on the unit.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $IFD           e.g. xe-0/0/9:1
 *   $UNIT          e.g. 3011
 *   $VLAN          e.g. 3011
 *   $INPUT_FILTER  e.g. filter_ip_match_dest1
 *   $AC_ADDR_V4    e.g. 222.222.1.1/24
 */
interfaces {
    $IFD {
        unit $UNIT {
            vlan-id $VLAN;
            family inet {
                filter {
                    input $INPUT_FILTER;
                }
                address $AC_ADDR_V4;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-flexible-ethernet-services-description`
- `filter` (`$INPUT_FILTER`): required, for each reference; one of `firewall/filter-destination-address-next-interface`, `firewall/filter-destination-address-next-ip`, `firewall/filter-source-address-next-interface`, `firewall/filter-source-address-next-ip`, `firewall/filter-tcp-destination-port-next-interface`, `firewall/filter-tcp-destination-port-next-ip`, `firewall/filter-tcp-source-port-next-interface`, `firewall/filter-tcp-source-port-next-ip`

## junos/interfaces/ifl-vlan-inet-inet6.conf

```
/*
 * Topic:   VLAN logical interface with IPv4 and IPv6 addresses
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 400
 *   total 400
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge2_mx10004):
 *   $IFD         e.g. xe-0/0/11
 *   $UNIT        e.g. 1801
 *   $VLAN        e.g. 1801
 *   $AC_ADDR_V4  e.g. 35.1.1.2/24
 *   $AC_ADDR_V6  e.g. 3500::2/64
 */
interfaces {
    $IFD {
        unit $UNIT {
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

## junos/interfaces/ifl-vlan-inet-mpls.conf

```
/*
 * Topic: VLAN-tagged IPv4 unit with MPLS
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge2_mx10004):
 *   $IFD         e.g. et-3/3/0
 *   $UNIT        e.g. 0
 *   $VLAN        e.g. 1
 *   $AC_ADDR_V4  e.g. 192.168.34.1/24
 */
interfaces {
    $IFD {
        unit $UNIT {
            vlan-id $VLAN;
            family inet {
                address $AC_ADDR_V4;
            }
            family mpls;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-flexible-ethernet-services-description`

## junos/interfaces/ifl-vlan-inet.conf

```
/*
 * Topic: VLAN-tagged IPv4 unit
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 12
 *   wanedge2_mx10004 12
 *   total 24
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $IFD         e.g. xe-0/0/9:0
 *   $UNIT        e.g. 3000
 *   $VLAN        e.g. 3000
 *   $AC_ADDR_V4  e.g. 200.200.1.1/24
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
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-flexible-ethernet-services-description`, `interfaces/ifd-hierarchical-scheduler-flexible-ethernet-services-description`

## junos/policy-options/policy-statement/per-packet-load-balance-accept.conf

```
/*
 * Topic: Per-packet load-balancing policy with an explicit accept
 * Seen on:
 *   Junos: ce4_mx480
 *   EVO: (none)
 * Count:
 *   ce4_mx480 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce4_mx480):
 *   $PPLB_NAME  e.g. pplb
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

## junos/policy-options/policy-statement/ps-advertise-loop-direct.conf

```
/*
 * Topic: Policy accepting direct routes (advertise-loop)
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 1
 *   total 1
 * Highlights:
 *   - Accepts directly connected routes.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement advertise-loop {
        term t1 {
            from protocol direct;
            then accept;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-bgp-to-ospf.conf

```
/*
 * Topic: Policy bgp-to-ospf accepting BGP routes
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement bgp-to-ospf {
        from protocol bgp;
        then accept;
    }
}
```

## junos/policy-options/policy-statement/ps-pplb-evpn-term-accept.conf

```
/*
 * Topic: Per-packet load balancing with an EVPN term
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *   - The EVPN term and the final action both load-balance per packet and accept.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
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
}
```

## junos/policy-options/policy-statement/ps-send-direct.conf

```
/*
 * Topic: Export policy for directly connected routes
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *   - Accepts direct routes; exported by the iBGP group.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement send-direct {
        term 1 {
            from protocol direct;
            then accept;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-send-ospf.conf

```
/*
 * Topic: Policy accepting OSPF routes
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement send-ospf {
        term 2 {
            from protocol ospf;
            then accept;
        }
    }
}
```

## junos/protocols/bgp-family-inet-unicast-loops.conf

```
/*
 * Topic: BGP IPv4 unicast AS-path loops
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - Allows the local AS to appear twice in the AS path.
 * Pair with: none
 * Variables: none
 */
protocols {
    bgp {
        family inet {
            unicast {
                loops 2;
            }
        }
    }
}
```

## junos/protocols/bgp-overlay-pe-advertise-external-flow-evpn-multipath.conf

```
/*
 * Topic: iBGP PE group for IPv4 with flow, and EVPN
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - Two route reflectors; advertise-external, flow specification, multipath and BFD; exports direct routes.
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-send-direct.conf
 *
 * Peers with:
 *   [p1_ptx10003] <-> [wanedge1_mx304]
 *   [p2_ptx10001-36mr] <-> [wanedge1_mx304]
 * Variables (example values from wanedge1_mx304):
 *   $LOOPBACK_V4  e.g. 2.2.2.2
 *   $ASN          e.g. 64512
 *   $RR1_V4       e.g. 3.3.3.3
 *   $RR2_V4       e.g. 6.6.6.6
 */
protocols {
    bgp {
        group ibgp {
            type internal;
            local-address $LOOPBACK_V4;
            advertise-external;
            family inet {
                unicast;
                flow;
            }
            family evpn {
                signaling;
            }
            export send-direct;
            local-as $ASN;
            multipath;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor $RR1_V4;
            neighbor $RR2_V4;
        }
    }
}
```

## junos/protocols/bgp-overlay-pe-flow-evpn-route-target-multipath.conf

```
/*
 * Topic: iBGP PE group for IPv4 with flow, EVPN and route-target
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 1
 *   total 1
 * Highlights:
 *   - Two route reflectors; flow specification, route-target filtering, multipath and BFD; exports direct routes.
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-send-direct.conf
 *
 * Peers with:
 *   [p1_ptx10003] <-> [wanedge2_mx10004]
 *   [p2_ptx10001-36mr] <-> [wanedge2_mx10004]
 * Variables (example values from wanedge2_mx10004):
 *   $LOOPBACK_V4  e.g. 5.5.5.5
 *   $ASN          e.g. 64512
 *   $RR1_V4       e.g. 3.3.3.3
 *   $RR2_V4       e.g. 6.6.6.6
 */
protocols {
    bgp {
        group ibgp {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                unicast;
                flow;
            }
            family evpn {
                signaling;
            }
            family route-target;
            export send-direct;
            local-as $ASN;
            multipath;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor $RR1_V4;
            neighbor $RR2_V4;
        }
    }
}
```

## junos/protocols/lldp-interface-all.conf

```
/*
 * Topic: LLDP on all interfaces
 * Seen on:
 *   Junos: ce4_mx480 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ce4_mx480 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 3
 * Pair with: none
 * Variables: none
 */
protocols {
    lldp {
        interface all;
    }
}
```

## junos/protocols/mpls-interface-all.conf

```
/*
 * Topic: MPLS on all interfaces
 * Seen on:
 *   Junos: ce4_mx480
 *   EVO: (none)
 * Count:
 *   ce4_mx480 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
protocols {
    mpls {
        interface all;
    }
}
```

## junos/protocols/mpls-te-2-lsp-1-core.conf

```
/*
 * Topic: MPLS with traffic engineering, two LSPs and one core interface
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - Two label-switched paths to remote PEs with traffic engineering; MPLS on one core interface and the loopback.
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $LSP_NAME_A   e.g. lsp_to_pe3
 *   $LSP_TO_A     e.g. 4.4.4.4
 *   $LSP_NAME_B   e.g. lsp_to_pe4
 *   $LSP_TO_B     e.g. 7.7.7.7
 *   $CORE_INTF_1  e.g. ae2.0
 */
protocols {
    mpls {
        traffic-engineering;
        label-switched-path $LSP_NAME_A {
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_B {
            to $LSP_TO_B;
        }
        interface $CORE_INTF_1;
        interface lo0.0;
    }
}
```

## junos/protocols/mpls-te-2-lsp-2-core.conf

```
/*
 * Topic: MPLS with traffic engineering, two LSPs and two core interfaces
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 1
 *   total 1
 * Highlights:
 *   - Two label-switched paths to remote PEs with traffic engineering; MPLS on two core interfaces and the loopback.
 * Pair with: none
 * Variables (example values from wanedge2_mx10004):
 *   $LSP_NAME_A   e.g. lsp_to_pe3
 *   $LSP_TO_A     e.g. 4.4.4.4
 *   $LSP_NAME_B   e.g. lsp_to_pe4
 *   $LSP_TO_B     e.g. 7.7.7.7
 *   $CORE_INTF_1  e.g. et-3/3/0.0
 *   $CORE_INTF_2  e.g. et-3/0/0.0
 */
protocols {
    mpls {
        traffic-engineering;
        label-switched-path $LSP_NAME_A {
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_B {
            to $LSP_TO_B;
        }
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
        interface lo0.0;
    }
}
```

## junos/protocols/oam-cfm-mep-up-auto-discovery.conf

```
/*
 * Topic: CFM maintenance domain with an up MEP and automatic remote MEP discovery
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 175
 *   wanedge2_mx10004 175
 *   total 350
 * Highlights:
 *   - Level 3 maintenance domain with one maintenance association per service and 1-second continuity checks.
 *   - The up MEP on the attachment circuit discovers its remote MEP automatically.
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $MD_NAME    e.g. m-d301
 *   $MA_ID      e.g. m-a301
 *   $MEP_LOCAL  e.g. 1
 *   $AC_IFL     e.g. xe-0/0/9:0.301
 */
protocols {
    oam {
        ethernet {
            connectivity-fault-management {
                maintenance-domain $MD_NAME {
                    level 3;
                    name-format character-string;
                    maintenance-association $MA_ID {
                        short-name-format character-string;
                        continuity-check {
                            interval 1s;
                        }
                        mep $MEP_LOCAL {
                            interface $AC_IFL;
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

## junos/protocols/oam-cfm-perf-mon-two-way-delay-slm.conf

```
/*
 * Topic: CFM performance monitoring with two-way delay and synthetic loss iterator profiles
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *   - Enhanced SLA iterator with measurement-interval 5.
 *   - One profile measures two-way delay, the other synthetic loss (SLM).
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $SLA_PROFILE_DELAY  e.g. i1
 *   $SLA_PROFILE_SLM    e.g. i2
 */
protocols {
    oam {
        ethernet {
            connectivity-fault-management {
                performance-monitoring {
                    enhanced-sla-iterator;
                    measurement-interval 5;
                    sla-iterator-profiles {
                        $SLA_PROFILE_DELAY {
                            measurement-type two-way-delay;
                        }
                        $SLA_PROFILE_SLM {
                            measurement-type slm;
                        }
                    }
                }
            }
        }
    }
}
```

## junos/protocols/ospf-area-2-interface-p2p.conf

```
/*
 * Topic: OSPF area with two interfaces, one point-to-point
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 100
 *   total 100
 * Highlights:
 *   - The second interface runs as point-to-point.
 * Pair with: none
 * Variables (example values from wanedge2_mx10004):
 *   $OSPF_AREA   e.g. 0.0.0.1
 *   $AREA_IFL_A  e.g. et-3/3/0.2801
 *   $AREA_IFL_B  e.g. xe-0/0/11.2801
 */
protocols {
    ospf {
        area $OSPF_AREA {
            interface $AREA_IFL_A;
            interface $AREA_IFL_B {
                interface-type p2p;
            }
        }
    }
}
```

## junos/protocols/ospf-area0-2-p2p-core-loopback.conf

```
/*
 * Topic: OSPF backbone area with two point-to-point core interfaces
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *   - Point-to-point core interfaces use BFD, post-convergence LFA with node protection and protected adjacency SIDs.
 *   - The loopback is passive.
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $CORE_INTF_1  e.g. ae2.0
 *   $CORE_INTF_2  e.g. et-0/0/1.0
 */
protocols {
    ospf {
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

## junos/protocols/ospf-backup-spf-options-traffic-engineering-sr.conf

```
/*
 * Topic: OSPF post-convergence LFA, traffic engineering and segment routing
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *   - Post-convergence LFA (up to 8 labels, 5 backup paths) computed over source packet routing.
 *   - Node SID index with an SRGB starting at label 16000.
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $NODE_SID_INDEX  e.g. 102
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
            node-segment ipv4-index $NODE_SID_INDEX;
            srgb start-label 16000 index-range 8000;
        }
    }
}
```

## junos/protocols/ospf3-area-1-interface.conf

```
/*
 * Topic: OSPFv3 area with one interface
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 1
 *   total 1
 * Highlights:
 *   - One interface in the area with default settings.
 * Pair with: none
 * Variables (example values from wanedge2_mx10004):
 *   $OSPF_AREA   e.g. 0.0.0.0
 *   $AREA_IFL_A  e.g. et-3/3/0.0
 */
protocols {
    ospf3 {
        area $OSPF_AREA {
            interface $AREA_IFL_A;
        }
    }
}
```

## junos/protocols/ospf3-area-2-interface-p2p.conf

```
/*
 * Topic: OSPFv3 area with two interfaces, one point-to-point
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 100
 *   total 100
 * Highlights:
 *   - The second interface runs as point-to-point.
 * Pair with: none
 * Variables (example values from wanedge2_mx10004):
 *   $OSPF_AREA   e.g. 0.0.0.1
 *   $AREA_IFL_A  e.g. et-3/3/0.2801
 *   $AREA_IFL_B  e.g. xe-0/0/11.2801
 */
protocols {
    ospf3 {
        area $OSPF_AREA {
            interface $AREA_IFL_A;
            interface $AREA_IFL_B {
                interface-type p2p;
            }
        }
    }
}
```

## junos/protocols/rsvp-interface-all.conf

```
/*
 * Topic: RSVP on all interfaces
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
protocols {
    rsvp {
        interface all;
    }
}
```

## junos/routing-instances/evpn-elan/ri-evpn-elan-2-uni.conf

```
/*
 * Topic: EVPN-ELAN instance with two attachment circuits
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 600
 *   wanedge2_mx10004 600
 *   total 1200
 * Highlights:
 *   - EVPN instance with default EVPN protocol settings; both attachment circuits join the one broadcast domain.
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME    e.g. elan_group_500_2001
 *   $AC_IFL_A         e.g. ae0.2001
 *   $AC_IFL_B         e.g. ae0.2002
 *   $RD_SUB_ADMIN     e.g. 22.22.22.22
 *   $RD_SUB_ASSIGNED  e.g. 2001
 *   $RT_AS            e.g. 62525
 *   $RT_ID            e.g. 2001
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn;
        protocols {
            evpn;
        }
        interface $AC_IFL_A;
        interface $AC_IFL_B;
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL_A`, `$AC_IFL_B`): required, for each reference; one of `interfaces/ifl-vlan-bridge-esi`, `interfaces/ifl-vlan-bridge`

## junos/routing-instances/evpn-elan/ri-evpn-elan-irb-no-normalization.conf

```
/*
 * Topic: EVPN-ELAN instance with an IRB gateway, no VLAN normalization
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 350
 *   wanedge2_mx10004 325
 *   total 675
 * Highlights:
 *   - The IRB unit is the routing interface; default-gateway do-not-advertise stops the gateway MAC/IP advertisement.
 *   - Sets vlan-id none together with EVPN no-normalization.
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME    e.g. emh_group_400_1851
 *   $IRB_UNIT         e.g. irb.1851
 *   $AC_IFL           e.g. ae0.1851
 *   $RD_SUB_ADMIN     e.g. 22.22.22.22
 *   $RD_SUB_ASSIGNED  e.g. 1851
 *   $RT_AS            e.g. 60525
 *   $RT_ID            e.g. 1851
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
        vlan-id none;
        routing-interface $IRB_UNIT;
        interface $AC_IFL;
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$IRB_UNIT`, `$AC_IFL`): required, for each reference; one of `interfaces/ifl-irb-inet`, `interfaces/ifl-irb-virtual-gateway`, `interfaces/ifl-vlan-bridge-esi`, `interfaces/ifl-vlan-bridge`

## junos/routing-instances/evpn-elan/ri-evpn-elan-no-normalization.conf

```
/*
 * Topic: EVPN-ELAN instance with one attachment circuit, no VLAN normalization
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 275
 *   wanedge2_mx10004 275
 *   total 550
 * Highlights:
 *   - Sets vlan-id none together with EVPN no-normalization.
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME    e.g. emh_group_200_1701
 *   $AC_IFL           e.g. ae0.1701
 *   $RD_SUB_ADMIN     e.g. 22.22.22.22
 *   $RD_SUB_ASSIGNED  e.g. 1701
 *   $RT_AS            e.g. 61515
 *   $RT_ID            e.g. 1701
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn;
        protocols {
            evpn {
                no-normalization;
            }
        }
        vlan-id none;
        interface $AC_IFL;
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`): required, for each reference; one of `interfaces/ifl-vlan-bridge-esi`, `interfaces/ifl-vlan-bridge`

## junos/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf

```
/*
 * Topic: EVPN flexible cross-connect, VLAN-aware, two attachment circuits
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 500
 *   wanedge2_mx10004 500
 *   total 1000
 * Highlights:
 *   - Two attachment circuits share one EVPN-VPWS instance; each keeps its own VPWS service identifiers.
 * Pair with: none
 * Peers with:
 *   [wanedge1_mx304] <-> [wanedge3_acx7509, wanedge4_acx7100-48l]
 *   [wanedge2_mx10004] <-> [wanedge3_acx7509, wanedge4_acx7100-48l]
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME    e.g. vfxc_group_40_1001
 *   $AC_IFL_A         e.g. ae0.1001
 *   $SVC_ID_LOCAL_A   e.g. 2
 *   $SVC_ID_REMOTE_A  e.g. 1
 *   $AC_IFL_B         e.g. ae0.1002
 *   $SVC_ID_LOCAL_B   e.g. 21
 *   $SVC_ID_REMOTE_B  e.g. 11
 *   $RD_SUB_ADMIN     e.g. 22.22.22.22
 *   $RD_SUB_ASSIGNED  e.g. 1001
 *   $RT_AS            e.g. 65000
 *   $RT_ID            e.g. 1001
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_IFL_A {
                    vpws-service-id {
                        local $SVC_ID_LOCAL_A;
                        remote $SVC_ID_REMOTE_A;
                    }
                }
                interface $AC_IFL_B {
                    vpws-service-id {
                        local $SVC_ID_LOCAL_B;
                        remote $SVC_ID_REMOTE_B;
                    }
                }
                flexible-cross-connect-vlan-aware;
            }
        }
        interface $AC_IFL_A;
        interface $AC_IFL_B;
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL_A`, `$AC_IFL_B`): required, for each reference; `interfaces/ifl-vlan-ccc-esi-all-active-family-ccc`

## junos/routing-instances/evpn-vpws/ri-evpn-vpws-control-word.conf

```
/*
 * Topic: EVPN-VPWS point-to-point service with control word
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1000
 *   wanedge2_mx10004 1000
 *   total 2000
 * Highlights:
 *   - One attachment circuit per instance; the local and remote VPWS service identifiers pair it with the remote PE.
 *   - The control word is signaled for the pseudowire.
 * Pair with: none
 * Peers with:
 *   [wanedge1_mx304] <-> [wanedge3_acx7509, wanedge4_acx7100-48l]
 *   [wanedge2_mx10004] <-> [wanedge3_acx7509, wanedge4_acx7100-48l]
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME       e.g. vpws_group_50_1
 *   $AC_IFL              e.g. ae0.1
 *   $VPWS_SVC_ID_LOCAL   e.g. 1
 *   $VPWS_SVC_ID_REMOTE  e.g. 2
 *   $RD_SUB_ADMIN        e.g. 22.22.22.22
 *   $RD_SUB_ASSIGNED     e.g. 1
 *   $RT_AS               e.g. 64512
 *   $RT_ID               e.g. 1
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
                control-word;
            }
        }
        interface $AC_IFL;
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`): required, for each reference; one of `interfaces/ifl-vlan-ccc-esi-all-active-family-ccc`, `interfaces/ifl-vlan-ccc-family-ccc`

## junos/routing-instances/l3vpn/ri-l3vpn-evpn-ip-prefix-vrf-target.conf

```
/*
 * Topic: EVPN Type 5 IP-prefix VRF with vrf-target
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 350
 *   wanedge2_mx10004 325
 *   total 675
 * Highlights:
 *   - Advertises the VRF prefixes as EVPN Type 5 routes with MPLS encapsulation and direct next hop.
 *   - vrf-table-label gives the VRF one label; route targets come from vrf-target, without import or export policies.
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME    e.g. evpn_100
 *   $ROUTER_ID        e.g. 2.2.2.2
 *   $IRB_UNIT         e.g. irb.100
 *   $RD_SUB_ADMIN     e.g. 60202
 *   $RD_SUB_ASSIGNED  e.g. 100
 *   $RT_AS            e.g. 60303
 *   $RT_ID            e.g. 100
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
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
        vrf-table-label;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `irb-service`: required, all related; one of `routing-instances/evpn-elan/ri-evpn-elan-2-uni`, `routing-instances/evpn-elan/ri-evpn-elan-irb-no-normalization`, `routing-instances/evpn-elan/ri-evpn-elan-no-normalization`, `routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni`, `routing-instances/evpn-vpws/ri-evpn-vpws-control-word`, `routing-instances/l3vpn/ri-l3vpn-evpn-ip-prefix-vrf-target`
- `logical-interface` (`$IRB_UNIT`): required, for each reference; one of `interfaces/ifl-irb-inet`, `interfaces/ifl-irb-virtual-gateway`

## junos/routing-options/autonomous-system.conf

```
/*
 * Topic: Autonomous system number
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $ASN  e.g. 64512
 */
routing-options {
    autonomous-system $ASN;
}
```

## junos/routing-options/flow-route-6-match-accept.conf

```
/*
 * Topic: BGP flow specification routes matching source, destination, ports, DSCP and ICMP
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *   - Six flow routes, each with action accept, advertised with BGP family inet flow.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $FLOW_SRC_PFX       e.g. 200.200.1.2/32
 *   $FLOW_DST_PFX       e.g. 200.201.2.2/32
 *   $FLOW_SRC_PORT      e.g. 65071
 *   $FLOW_DST_PORT      e.g. 80
 *   $FLOW_DSCP_SRC_PFX  e.g. 200.205.1.2/32
 *   $FLOW_ICMP_SRC_PFX  e.g. 200.204.1.2/32
 */
routing-options {
    flow {
        route source_ip {
            match source $FLOW_SRC_PFX;
            then accept;
        }
        route dest_ip {
            match destination $FLOW_DST_PFX;
            then accept;
        }
        route proto_tcp_source_port_match {
            match {
                protocol tcp;
                source-port $FLOW_SRC_PORT;
            }
            then accept;
        }
        route proto_tcp_dest_port_match {
            match {
                protocol tcp;
                destination-port $FLOW_DST_PORT;
            }
            then accept;
        }
        route descp_match {
            match {
                dscp 10;
                source $FLOW_DSCP_SRC_PFX;
            }
            then accept;
        }
        route icmp_match {
            match {
                protocol icmp;
                source $FLOW_ICMP_SRC_PFX;
                icmp-code 1;
                icmp-type 8;
            }
            then accept;
        }
    }
}
```

## junos/routing-options/forwarding-table-pplb-chained-nh-evpn.conf

```
/*
 * Topic: Forwarding-table per-packet load balancing with chained composite next hops for EVPN
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 1
 *   total 1
 * Highlights:
 *   - WAN-edge form: load-balance export plus `chained-composite-next-hop ingress evpn` for EVPN-MPLS next-hop scaling; no `ecmp-fast-reroute`.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge2_mx10004):
 *   $PPLB_NAME  e.g. pplb
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
- `policy-statement` (`$PPLB_NAME`): required, for each reference; `policy-options/policy-statement/ps-pplb-evpn-term-accept`

## junos/routing-options/forwarding-table-pplb.conf

```
/*
 * Topic: Forwarding-table per-packet load balancing
 * Seen on:
 *   Junos: ce4_mx480 wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   ce4_mx480 1
 *   wanedge1_mx304 1
 *   total 2
 * Highlights:
 *   - Exports the load-balance policy to the forwarding table so all equal-cost next hops are installed.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from ce4_mx480):
 *   $PPLB_NAME  e.g. pplb
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$PPLB_NAME`): required, for each reference; one of `policy-options/policy-statement/per-packet-load-balance-accept`, `policy-options/policy-statement/ps-pplb-evpn-term-accept`

## junos/routing-options/router-id.conf

```
/*
 * Topic: Router ID
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $ROUTER_ID  e.g. 2.2.2.2
 */
routing-options {
    router-id $ROUTER_ID;
}
```

## _variables.md

# Snippet variable glossary

All `.conf` files under `junos/` and `evo/` are templates: identifiers that vary between deployments are written
as `$VAR`. Render a snippet by substituting each placeholder with your deployment's value. The placeholders each
snippet uses are listed in its `Variables:` header and in the glossary below. Variable names and meanings follow
the shared JVD snippet vocabulary. Lettered and numbered
variables (`_A`…`_E`, `_1`, `_2`, …) form an ordered set; the letters and numbers carry no other meaning.

Values left literal on purpose: names other configuration refers to by a single fixed spelling (the policies
`send-direct`, `send-ospf`, `bgp-to-ospf`, `nexthop` and `advertise-loop`; classifiers, rewrite rules,
forwarding classes and drop profiles; the BGP group `ibgp`; the flow-route names), and design constants such as BFD
intervals, the CFM level and intervals, the SRGB and the LACP settings.

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `64512` |
| `$LOOPBACK_V4` | Primary per-node IPv4 loopback address. | `4.4.4.4` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on a loopback unit (`lo0.0` or a per-VRF `lo0.<n>`). | `3.3.3.3/32` |
| `$NODE_SID_INDEX` | Segment routing node SID index of this router (`node-segment ipv4-index`). | `103` |
| `$PE1_V4` | IPv4 loopback of a route-reflector client (WAN edge PE); `PE1`…`PE4` order the clients. | `2.2.2.2` |
| `$PE2_V4` | IPv4 loopback of a second route-reflector client. | `4.4.4.4` |
| `$PE3_V4` | IPv4 loopback of a third route-reflector client. | `5.5.5.5` |
| `$PE4_V4` | IPv4 loopback of a fourth route-reflector client. | `7.7.7.7` |
| `$ROUTER_ID` | Complete router identifier in IPv4 dotted-decimal form. | `4.4.4.4` |
| `$RR1_V4` | IPv4 loopback of a BGP route reflector this node peers with; `RR1`, `RR2` order the reflectors. | `3.3.3.3` |
| `$RR2_V4` | IPv4 loopback of a second BGP route reflector. | `6.6.6.6` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address on a routed attachment-circuit unit. | `56.1.1.1/24` |
| `$AC_ADDR_V6` | IPv6 address on a routed attachment-circuit unit. | `5500::2/64` |
| `$AC_IFL` | Full logical attachment-circuit interface identifier, including its unit. | `et-0/0/2.301` |
| `$AC_IFL_A` | First attachment logical interface (with unit) of a set; `_A`…`_E` order the members. | `ae0.2001` |
| `$AC_IFL_B` | Second attachment logical interface (with unit) of a set. | `ae0.2002` |
| `$AE_BUNDLE` | Aggregated-Ethernet bundle a member link joins (`802.3ad`). | `ae0` |
| `$AE_DEVICE_COUNT` | Number of aggregated-Ethernet devices the chassis allocates. | `25` |
| `$CORE_INTF` | Core-facing LAG unit used for ISIS+MPLS underlay. | `et-0/0/0` |
| `$CORE_INTF_1` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/0.0` |
| `$CORE_INTF_2` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/1.0` |
| `$CORE_INTF_3` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/2.0` |
| `$CORE_INTF_4` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-0/0/9.0` |
| `$CORE_PHYS` | Parent of the core LAG. | `et-0/0/53` |
| `$CORE_PHYS_1` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/0` |
| `$CORE_PHYS_2` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/1` |
| `$CORE_PHYS_3` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/2` |
| `$CORE_PHYS_4` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/1` |
| `$CORE_V4_ADDR` | Core interface IPv4 address. | `192.168.91.2/24` |
| `$CORE_V6_ADDR` | Core interface IPv6 address. | `4400::4/68` |
| `$COS_INTF` | Interface to which the class-of-service configuration is applied, physical or aggregated and independent of topology role. | `irb` |
| `$DESCRIPTION` | Free-text interface `description`. | `"PE4 to CE2"` |
| `$FPC_SLOT` | FPC slot for a complete source-measured hardware profile. | `1` |
| `$IFD` | Interface-device identifier, excluding a logical unit. | `ae0` |
| `$IRB_ADDR` | IPv4 address configured on an `irb` unit. | `65.65.1.1/24` |
| `$IRB_UNIT` | irb.X unit number for IRB integration. | `irb.1851` |
| `$LACP_SYS_ID` | LACP system-id on a multihomed LAG. | `00:00:00:00:01:01` |
| `$MTU` | Interface MTU in bytes. | `1522` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `1851` |
| `$VLAN` | A single VLAN identifier. | `1` |
| `$VLAN_BD` | bridge-domain or mac-vrf vlan-id. | `1851` |
| `$VLAN_NAME` | Name of a `vlans` definition (a VLAN set or range) referenced by trunk members and bundle instances. | `VPWS1` |

## Services

| Variable | What it is | Example value |
|---|---|---|
| `$AREA_IFL_A` | First interface (with unit) of an OSPF or OSPFv3 area in a scale form; `_A`, `_B` order the members. | `ae4.2801` |
| `$AREA_IFL_B` | Second interface (with unit) of an OSPF or OSPFv3 area in a scale form. | `et-0/0/1.2801` |
| `$BD_NAME` | bridge-domain / MAC-VRF bridge-domain name. | `mvbased_1851` |
| `$DST_PFX` | Destination IPv4 prefix matched by a firewall filter term. | `217.217.5.100/32` |
| `$DST_PORT` | TCP destination port matched by a firewall filter term. | `23` |
| `$ESI` | 10-byte ESI (for EVPN multihoming). | `00:25:25:25:25:25:25:25:11:01` |
| `$FILTER_NAME` | Firewall filter name; also its counter name. | `filter_ip_match_dest2` |
| `$FLOW_DSCP_SRC_PFX` | Source prefix matched, with DSCP 10, by the `descp_match` flow route. | `211.216.2.2/32` |
| `$FLOW_DST_PFX` | Destination prefix matched by the `dest_ip` BGP flow specification route. | `211.212.1.2/32` |
| `$FLOW_DST_PORT` | TCP destination port matched by the `proto_tcp_dest_port_match` flow route. | `23` |
| `$FLOW_ICMP_SRC_PFX` | Source prefix matched, with ICMP type 8 code 1, by the `icmp_match` flow route. | `211.215.2.2/32` |
| `$FLOW_SRC_PFX` | Source prefix matched by the `source_ip` BGP flow specification route. | `211.211.2.2/32` |
| `$FLOW_SRC_PORT` | TCP source port matched by the `proto_tcp_source_port_match` flow route. | `65074` |
| `$INPUT_FILTER` | Firewall filter name applied as `filter input`. | `filter_ip_match_dest1` |
| `$INSTANCE_NAME` | Identity stem of a service instance: the routing-instance name, or the shared name of a hub-and-spoke policy and its community. | `emh_group_400_1851` |
| `$LSP_NAME_A` | Name of an MPLS label-switched path; `_A`, `_B` order the paths of a form. | `lsp_to_pe1` |
| `$LSP_NAME_B` | Name of a second MPLS label-switched path. | `lsp_to_pe2` |
| `$LSP_TO_A` | Egress address (`to`) of the first label-switched path: a remote PE loopback. | `2.2.2.2` |
| `$LSP_TO_B` | Egress address (`to`) of the second label-switched path. | `5.5.5.5` |
| `$MA_ID` | CFM maintenance-association identifier. | `m-a301` |
| `$MD_NAME` | CFM maintenance-domain name. | `m-d301` |
| `$MEP_LOCAL` | Local MEP identifier. | `352` |
| `$NEXT_INTERFACE` | Interface (`next-interface`) to which a filter term forwards matching packets. | `et-1/0/2` |
| `$NEXT_IP` | Next-hop IPv4 address (`next-ip`) to which a filter term forwards matching packets. | `192.168.91.2/32` |
| `$OSPF_AREA` | OSPF or OSPFv3 area identifier (dotted decimal). | `0.0.0.1` |
| `$PPLB_NAME` | Per-packet load-balance policy name — a label proven to vary across otherwise-identical deployed forms. | `pplb` |
| `$RD_SUB_ADMIN` | Route Distinguisher Administrator subfield. | `44.44.44.44` |
| `$RD_SUB_ASSIGNED` | Route Distinguisher Assigned Number subfield. | `1851` |
| `$RT_AS` | Route Target Administrator subfield. | `60525` |
| `$RT_ID` | Route Target Assigned Number subfield. | `1851` |
| `$SLA_PROFILE_DELAY` | Name of the CFM SLA iterator profile that measures two-way delay. | `i1` |
| `$SLA_PROFILE_SLM` | Name of the CFM SLA iterator profile that measures synthetic loss (SLM). | `i2` |
| `$SRC_PFX` | Source IPv4 prefix matched by a firewall filter term. | `218.218.6.100/32` |
| `$SRC_PORT` | TCP source port matched by a firewall filter term. | `65001` |
| `$SVC_ID_LOCAL_A` | Local VPWS service identifier of the first attachment circuit of a flexible cross-connect. | `1` |
| `$SVC_ID_LOCAL_B` | Local VPWS service identifier of the second attachment circuit of a flexible cross-connect. | `11` |
| `$SVC_ID_REMOTE_A` | Remote VPWS service identifier of the first attachment circuit of a flexible cross-connect. | `2` |
| `$SVC_ID_REMOTE_B` | Remote VPWS service identifier of the second attachment circuit of a flexible cross-connect. | `21` |
| `$VGA` | EVPN virtual-gateway address shared by the IRB's redundancy group. | `45.45.1.3` |
| `$VG_MAC` | MAC address bound to the IPv4 virtual gateway. | `00:66:66:66:66:01` |
| `$VPWS_SVC_ID_LOCAL` | EVPN-VPWS local service-id. | `2` |
| `$VPWS_SVC_ID_REMOTE` | EVPN-VPWS remote service-id. | `1` |

## byoai/TIERS.md

> **Tier qualification for this JVD.** Only `minimum` is qualified and selectable.
> The `self-contained` and `as-deployed` lists below are not qualified (some
> interfaces the published configurations reference are not defined in them). They are
> not selectable: never offer or render them.

# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd enterprise_wan/ewan_adv_core_edge`. -->

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

## EVPN-VPWS point-to-point service with control word

Family e-line, form evpn-vpws-control-word. OS mode MIXED. Attachment: VLAN CCC unit on an all-active Ethernet segment aggregate toward the CE..

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### wanedge4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### wanedge2_mx10004 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

---

## EVPN flexible cross-connect, VLAN-aware, two attachment circuits

Family e-line, form evpn-fxc-vlan-aware-2-uni. OS mode MIXED. Attachment: Two VLAN CCC units on an all-active Ethernet segment aggregate toward the CE..

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B

### wanedge4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B

### wanedge2_mx10004 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B

---

## EVPN-ELAN with two attachment circuits

Family e-lan, form evpn-elan-2-uni. OS mode MIXED. Attachment: Two VLAN bridge units toward the CE; Junos uses an EVPN instance, EVO a VLAN-bundle MAC-VRF..

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle-2-uni-no-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B

### wanedge4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle-2-uni-no-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-2-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B

### wanedge2_mx10004 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-2-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B

---

## EVPN-ELAN with one attachment circuit

Family e-lan, form evpn-elan-1-uni. OS mode MIXED. Attachment: One VLAN bridge unit toward the CE; Junos uses an EVPN instance, EVO a VLAN-based MAC-VRF..

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-no-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### wanedge4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-no-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-no-normalization.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### wanedge2_mx10004 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-no-normalization.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

---

## EVPN-ELAN with an IRB gateway

Family e-lan, form evpn-elan-irb. OS mode MIXED. Attachment: One VLAN bridge unit toward the CE and an IRB unit as the layer 3 gateway..

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$IRB_UNIT

### wanedge4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$IRB_UNIT

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-irb-no-normalization.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IRB_UNIT
  - occurrence-selection-required: logical-interface:$AC_IFL

### wanedge2_mx10004 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-irb-no-normalization.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IRB_UNIT
  - occurrence-selection-required: logical-interface:$AC_IFL

---

## EVPN Type 5 IP-prefix VRF

Family l3vpn, form evpn-type5-vrf. OS mode MIXED. Attachment: IRB unit of an EVPN-ELAN service as the VRF interface..

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-evpn-ip-prefix-vrf-target.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_UNIT

### wanedge4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-evpn-ip-prefix-vrf-target.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_UNIT

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-evpn-ip-prefix-vrf-target.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_UNIT

### wanedge2_mx10004 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-evpn-ip-prefix-vrf-target.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_UNIT

---

## byoai/DEFAULTS.md

# DEFAULTS — Enterprise WAN Advanced Core and Edge Services

Lab auto-fill values for the Enterprise WAN Advanced Core and Edge Services JVD. Every value is measured from the published device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks auto-fill; otherwise ask. Variable meanings are in [`_variables.md`](../_variables.md).

## Device inventory

| Role | Device | Platform | OS | `$LOOPBACK_V4` / router-id | `$ASN` |
|------|--------|----------|----|----------------------------|--------|
| WAN Edge (PE) | wanedge1_mx304 | MX304 | Junos | 2.2.2.2 | 64512 |
| WAN Edge (PE) | wanedge2_mx10004 | MX10004 | Junos | 5.5.5.5 | 64512 |
| WAN Edge (PE) | wanedge3_acx7509 | ACX7509 | EVO | 4.4.4.4 | 64512 |
| WAN Edge (PE) | wanedge4_acx7100-48l | ACX7100-48L | EVO | 7.7.7.7 | 64512 |
| Core / P router | p1_ptx10003 | PTX10003 | EVO | 3.3.3.3 | 64512 |
| Core / P router | p2_ptx10001-36mr | PTX10001-36MR | EVO | 6.6.6.6 | 64512 |
| L2-mode helper switch | ce1_acx7100-48l | ACX7100-48L | EVO | — | — |
| L2-mode helper switch | ce4_mx480 | MX480 | Junos | — | — |

## BGP overlay

| Device | BGP form | Peers |
|--------|----------|-------|
| wanedge1 | `junos/protocols/bgp-overlay-pe-advertise-external-flow-evpn-multipath.conf` | 3.3.3.3, 6.6.6.6 |
| wanedge2 | `junos/protocols/bgp-overlay-pe-flow-evpn-route-target-multipath.conf` | 3.3.3.3, 6.6.6.6 |
| wanedge3, wanedge4 | `evo/protocols/bgp-overlay-pe-flow-evpn-route-target.conf` | 3.3.3.3, 6.6.6.6 |
| p1 | `evo/protocols/bgp-overlay-rr-cluster-evpn.conf` | 2.2.2.2, 5.5.5.5, 4.4.4.4, 7.7.7.7 |
| p2 | `evo/protocols/bgp-overlay-rr-cluster-evpn-route-target-multipath.conf` | 2.2.2.2, 4.4.4.4, 5.5.5.5, 7.7.7.7 |

## Service examples (first measured instance)

| Service form | Device | Example values |
|--------------|--------|----------------|
| EVPN-VPWS | wanedge1–wanedge4 | `vpws_group_50_1`, `$AC_IFL` ae0.1, `$RD_SUB_ADMIN` 22.22.22.22 / 55.55.55.55 / 44.44.44.44 / 77.77.77.77, `$RD_SUB_ASSIGNED` 1, `vrf-target` 64512:1; `$VPWS_SVC_ID_LOCAL` / `$VPWS_SVC_ID_REMOTE` 1 / 2 on wanedge1 and wanedge2, 2 / 1 on wanedge3 and wanedge4 |
| EVPN flexible cross-connect | wanedge1–wanedge4 | `vfxc_group_40_1001`, `$AC_IFL_A` ae0.1001, `$AC_IFL_B` ae0.1002, `$RD_SUB_ASSIGNED` 1001, `vrf-target` 65000:1001; per-device RD administrator as for EVPN-VPWS |
| EVPN-ELAN, two attachment circuits | wanedge1–wanedge4 | `elan_group_500_2001`, `$AC_IFL_A` ae0.2001, `$AC_IFL_B` ae0.2002, `$RD_SUB_ASSIGNED` 2001, `vrf-target` 62525:2001; EVO `$BD_NAME` mvbundle_2001 |
| EVPN-ELAN, one attachment circuit | wanedge1–wanedge4 | `emh_group_200_1701`, `$AC_IFL` ae0.1701, `$RD_SUB_ASSIGNED` 1701, `vrf-target` 61515:1701; EVO `$BD_NAME` mvbased_1701, `$VLAN_BD` 1701 |
| EVPN-ELAN with an IRB gateway | wanedge1–wanedge4 | `emh_group_400_1851`, `$AC_IFL` ae0.1851, `$IRB_UNIT` irb.1851, `$RD_SUB_ASSIGNED` 1851, `vrf-target` 60525:1851; EVO `$BD_NAME` mvbased_1851, `$VLAN_BD` 1851 |
| EVPN Type 5 VRF | wanedge1, wanedge4 | `evpn_100`, `$IRB_UNIT` irb.100, `$ROUTER_ID` 2.2.2.2, RD 60202:100 (wanedge1) and 64545:100 (wanedge4), `vrf-target` 60303:100 |
| EVPN Type 5 VRF | wanedge2, wanedge3 | `evpn_1851`, `$IRB_UNIT` irb.1851, `$ROUTER_ID` 5.5.5.5 (wanedge2), 4.4.4.4 (wanedge3), RD 62323:1851 (wanedge2) and 63434:1851 (wanedge3), `vrf-target` 60555:1851 |

## Numbering conventions (hold on every measured instance)

| Service form | Convention |
|--------------|------------|
| All EVPN services | `$RT_ID` = `$RD_SUB_ASSIGNED`. |
| EVPN-VPWS, flexible cross-connect, EVPN-ELAN | `$RD_SUB_ADMIN` is the WAN edge loopback or its per-device address (22.22.22.22, 55.55.55.55, 44.44.44.44, 77.77.77.77), by service group. |
| EVPN Type 5 VRF | `$RD_SUB_ADMIN` is an AS number. |

For `N` services, auto-fill increments the per-service number from the example's starting value and keeps the conventions above. Keep the WAN edges of a service consistent: same instance name and route target; for EVPN-VPWS and flexible cross-connect, the two ends swap the local and remote VPWS service identifiers.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into `jvd-ewan-ace-snips.md` by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: minimum
# devices:
#   wanedge1: { name: <hostname>, os: junos, loopback4: <addr> }
#   wanedge3: { name: <hostname>, os: evo, loopback4: <addr> }
# services:
#   - { kind: <evpn-vpws|evpn-fxc|evpn-elan-2-uni|evpn-elan-1-uni|evpn-elan-irb|evpn-type5>,
#       count: <int>,
#       start_id: <int>,
#       ac_ifl: <ifd.unit>,
#       rt: <rt_as:rt_id>,
#       rd: <admin:assigned> }
# snips_used:
#   - junos/routing-instances/evpn-vpws/ri-evpn-vpws-control-word.conf
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
- Cross-device consistency the user must verify: the WAN edges of one service use the same instance name and route target; an EVPN-VPWS or flexible cross-connect service swaps the local and remote VPWS service identifiers between its two ends.
- Anything that is by-pattern rather than validated on that exact device.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
