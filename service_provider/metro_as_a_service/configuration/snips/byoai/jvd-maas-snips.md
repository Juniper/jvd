# JVD Metro-as-a-Service snippet library

## evo/apply-groups/mef-forwarding-profile.conf

```
/*
 * Topic:   Apply-group: mef forwarding profile (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MA3 (ACX7100-48L), AN3 (ACX7100-48L), MA1.2 (ACX7024), MEG1 (ACX7100-32C), MEG2 (ACX7509), MEG1 (ACX7509), MA1.1 (ACX7024)
 *
 * Highlights:
 *   - Enables MEF forwarding profile system-wide
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * Variables:
 *   (none)
 */
system {
    packet-forwarding-options {
        mef-forwarding-profile;
    }
}
```

## evo/cos/classifiers.conf

```
/*
 * Topic:   Class-of-service: classifiers (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MA3 (ACX7100-48L), AN3 (ACX7100-48L), MA1.2 (ACX7024), MEG1 (ACX7100-32C), MEG2 (ACX7509), MEG1 (ACX7509), MA1.1 (ACX7024)
 *
 * Highlights:
 *   - Forwarding-class definitions / classifier mapping
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * Variables:
 *   (none)
 */
classifiers {
    dscp CL-DSCP {
        import default;
        forwarding-class FC-SIGNALING {
            loss-priority low code-points cs6;
            loss-priority high code-points cs5;
        }
        forwarding-class FC-LLQ {
            loss-priority low code-points [ cs4 af41 ];
            loss-priority medium-high code-points af42;
            loss-priority high code-points af43;
        }
        forwarding-class FC-REALTIME {
            loss-priority low code-points ef;
        }
        forwarding-class FC-HIGH {
            loss-priority low code-points [ cs3 af31 ];
            loss-priority medium-high code-points af32;
            loss-priority high code-points af33;
        }
        forwarding-class FC-CONTROL {
            loss-priority low code-points cs7;
        }
        forwarding-class FC-MEDIUM {
            loss-priority low code-points [ cs2 af21 ];
            loss-priority medium-high code-points af22;
            loss-priority high code-points af23;
        }
        forwarding-class FC-LOW {
            loss-priority low code-points [ cs1 af11 ];
            loss-priority medium-high code-points af12;
            loss-priority high code-points af13;
        }
        forwarding-class FC-BEST-EFFORT {
            loss-priority high code-points be;
        }
    }
    dscp-ipv6 CL-DSCP-IPV6 {
        import default;
        forwarding-class FC-SIGNALING {
            loss-priority low code-points cs6;
            loss-priority high code-points cs5;
        }
        forwarding-class FC-LLQ {
            loss-priority low code-points [ cs4 af41 ];
            loss-priority medium-high code-points af42;
            loss-priority high code-points af43;
        }
        forwarding-class FC-REALTIME {
            loss-priority low code-points ef;
        }
        forwarding-class FC-HIGH {
            loss-priority low code-points [ cs3 af31 ];
            loss-priority medium-high code-points af32;
            loss-priority high code-points af33;
        }
        forwarding-class FC-CONTROL {
            loss-priority low code-points cs7;
        }
        forwarding-class FC-MEDIUM {
            loss-priority low code-points [ cs2 af21 ];
            loss-priority medium-high code-points af22;
            loss-priority high code-points af23;
        }
        forwarding-class FC-LOW {
            loss-priority low code-points [ cs1 af11 ];
            loss-priority medium-high code-points af12;
            loss-priority high code-points af13;
        }
        forwarding-class FC-BEST-EFFORT {
            loss-priority high code-points be;
        }
    }
    exp CL-MPLS {
        import default;
        forwarding-class FC-SIGNALING {
            loss-priority low code-points 110;
        }
        forwarding-class FC-LLQ {
            loss-priority low code-points 100;
        }
        forwarding-class FC-REALTIME {
            loss-priority low code-points 101;
        }
        forwarding-class FC-HIGH {
            loss-priority low code-points 011;
        }
        forwarding-class FC-CONTROL {
            loss-priority low code-points 111;
        }
        forwarding-class FC-MEDIUM {
            loss-priority low code-points 010;
        }
        forwarding-class FC-LOW {
            loss-priority low code-points 001;
        }
        forwarding-class FC-BEST-EFFORT {
            loss-priority low code-points 000;
        }
    }
    ieee-802.1 CL-8021P {
        forwarding-class FC-HIGH {
            loss-priority low code-points [ 101 100 ];
        }
        forwarding-class FC-MEDIUM {
            loss-priority low code-points [ 011 010 ];
        }
        forwarding-class FC-LOW {
            loss-priority low code-points [ 001 000 ];
        }
    }
}
```

## evo/cos/cos-binding-ieee8021p.conf

```
/*
 * Topic:   Class-of-service: cos binding ieee8021p (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MA3 (ACX7100-48L), AN3 (ACX7100-48L), MA1.2 (ACX7024), MEG1 (ACX7100-32C), MEG2 (ACX7509), MEG1 (ACX7509), MA1.1 (ACX7024)
 *
 * Highlights:
 *   - L2 CE-facing CoS binding (classify + rewrite IEEE 802.1p)
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/forwarding-classes.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/cos/scheduler-map.conf
 *   - evo/cos/schedulers.conf
 *
 * Variables:
 *   (none)
 */
interfaces {
    $AC_INTF {
        scheduler-map SM-5G-SCHEDULER;
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

```

## evo/cos/cos-binding-mpls.conf

```
/*
 * Topic:   Class-of-service: cos binding mpls (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MA3 (ACX7100-48L), AN3 (ACX7100-48L), MA1.2 (ACX7024), MEG1 (ACX7100-32C), MEG2 (ACX7509), MEG1 (ACX7509), MA1.1 (ACX7024)
 *
 * Highlights:
 *   - MPLS core-facing CoS binding (classify + rewrite EXP)
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/forwarding-classes.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/cos/scheduler-map.conf
 *   - evo/cos/schedulers.conf
 *
 * Variables:
 *   (none)
 */
interfaces {
    $AC_INTF {
        scheduler-map SM-5G-SCHEDULER;
        unit $UNIT {
            classifiers {
                exp CL-MPLS;
            }
            rewrite-rules {
                exp RR-MPLS;
            }
        }
    }
}

```

## evo/cos/forwarding-classes.conf

```
/*
 * Topic:   Class-of-service: forwarding classes (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MA3 (ACX7100-48L), AN3 (ACX7100-48L), MA1.2 (ACX7024), MEG1 (ACX7100-32C), MEG2 (ACX7509), MEG1 (ACX7509), MA1.1 (ACX7024)
 *
 * Highlights:
 *   - Forwarding-class definitions / classifier mapping
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * Variables:
 *   (none)
 */
forwarding-classes {
    class FC-SIGNALING queue-num 7;
    class FC-LLQ queue-num 6;
    class FC-REALTIME queue-num 5;
    class FC-HIGH queue-num 4;
    class FC-CONTROL queue-num 3;
    class FC-MEDIUM queue-num 2;
    class FC-LOW queue-num 1;
    class FC-BEST-EFFORT queue-num 0;
}
```

## evo/cos/rewrite-rules.conf

```
/*
 * Topic:   Class-of-service: rewrite rules (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MA3 (ACX7100-48L), AN3 (ACX7100-48L), MA1.2 (ACX7024), MEG1 (ACX7100-32C), MEG2 (ACX7509), MEG1 (ACX7509), MA1.1 (ACX7024)
 *
 * Highlights:
 *   - Forwarding-class definitions / classifier mapping
 *   - Rewrite-rules for egress marking
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * Variables:
 *   (none)
 */
rewrite-rules {
    dscp RR-DSCP {
        forwarding-class FC-SIGNALING {
            loss-priority low code-point cs6;
            loss-priority high code-point cs5;
        }
        forwarding-class FC-LLQ {
            loss-priority low code-point af41;
            loss-priority medium-high code-point af42;
            loss-priority high code-point af43;
        }
        forwarding-class FC-REALTIME {
            loss-priority low code-point ef;
            loss-priority high code-point ef;
        }
        forwarding-class FC-HIGH {
            loss-priority low code-point af31;
            loss-priority medium-high code-point af32;
            loss-priority high code-point af33;
        }
        forwarding-class FC-CONTROL {
            loss-priority low code-point cs7;
            loss-priority high code-point cs7;
        }
        forwarding-class FC-MEDIUM {
            loss-priority low code-point af21;
            loss-priority medium-high code-point af22;
            loss-priority high code-point af23;
        }
        forwarding-class FC-LOW {
            loss-priority low code-point af11;
            loss-priority medium-high code-point af12;
            loss-priority high code-point af13;
        }
        forwarding-class FC-BEST-EFFORT {
            loss-priority low code-point be;
            loss-priority high code-point be;
        }
    }
    dscp-ipv6 RR-DSCP-IPV6 {
        forwarding-class FC-SIGNALING {
            loss-priority low code-point cs6;
            loss-priority high code-point cs5;
        }
        forwarding-class FC-LLQ {
            loss-priority low code-point af41;
            loss-priority medium-high code-point af42;
            loss-priority high code-point af43;
        }
        forwarding-class FC-REALTIME {
            loss-priority low code-point ef;
            loss-priority high code-point ef;
        }
        forwarding-class FC-HIGH {
            loss-priority low code-point af31;
            loss-priority medium-high code-point af32;
            loss-priority high code-point af33;
        }
        forwarding-class FC-CONTROL {
            loss-priority low code-point cs7;
            loss-priority high code-point cs7;
        }
        forwarding-class FC-MEDIUM {
            loss-priority low code-point af21;
            loss-priority medium-high code-point af22;
            loss-priority high code-point af23;
        }
        forwarding-class FC-LOW {
            loss-priority low code-point af11;
            loss-priority medium-high code-point af12;
            loss-priority high code-point af13;
        }
        forwarding-class FC-BEST-EFFORT {
            loss-priority low code-point be;
            loss-priority high code-point be;
        }
    }
    exp RR-MPLS {
        forwarding-class FC-SIGNALING {
            loss-priority low code-point 110;
            loss-priority high code-point 110;
        }
        forwarding-class FC-LLQ {
            loss-priority low code-point 100;
            loss-priority medium-high code-point 100;
            loss-priority high code-point 100;
        }
        forwarding-class FC-REALTIME {
            loss-priority low code-point 101;
            loss-priority high code-point 101;
        }
        forwarding-class FC-HIGH {
            loss-priority low code-point 011;
            loss-priority medium-high code-point 011;
            loss-priority high code-point 011;
        }
        forwarding-class FC-CONTROL {
            loss-priority low code-point 111;
            loss-priority high code-point 111;
        }
        forwarding-class FC-MEDIUM {
            loss-priority low code-point 010;
            loss-priority medium-high code-point 010;
            loss-priority high code-point 010;
        }
        forwarding-class FC-LOW {
            loss-priority low code-point 001;
            loss-priority medium-high code-point 001;
            loss-priority high code-point 001;
        }
        forwarding-class FC-BEST-EFFORT {
            loss-priority low code-point 000;
            loss-priority high code-point 000;
        }
    }
    ieee-802.1 RR-8021P {
        forwarding-class FC-HIGH {
            loss-priority low code-point 100;
        }
        forwarding-class FC-MEDIUM {
            loss-priority low code-point 010;
        }
        forwarding-class FC-LOW {
            loss-priority low code-point 000;
        }
    }
}
```

## evo/cos/scheduler-map.conf

```
/*
 * Topic:   Class-of-service: scheduler map (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MA3 (ACX7100-48L), AN3 (ACX7100-48L), MA1.2 (ACX7024), MEG1 (ACX7100-32C), MEG2 (ACX7509), MEG1 (ACX7509), MA1.1 (ACX7024)
 *
 * Highlights:
 *   - Scheduler-map binding queues to schedulers
 *   - Forwarding-class definitions / classifier mapping
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * Variables:
 *   (none)
 */
scheduler-maps {
    SM-5G-SCHEDULER {
        forwarding-class FC-SIGNALING scheduler SC-SIGNALING;
        forwarding-class FC-LLQ scheduler SC-LLQ;
        forwarding-class FC-REALTIME scheduler SC-REALTIME;
        forwarding-class FC-HIGH scheduler SC-HIGH;
        forwarding-class FC-CONTROL scheduler SC-CONTROL;
        forwarding-class FC-MEDIUM scheduler SC-MEDIUM;
        forwarding-class FC-LOW scheduler SC-LOW;
        forwarding-class FC-BEST-EFFORT scheduler SC-BEST-EFFORT;
    }
}
```

## evo/cos/schedulers.conf

```
/*
 * Topic:   Class-of-service: schedulers (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MA3 (ACX7100-48L), AN3 (ACX7100-48L), MA1.2 (ACX7024), MEG1 (ACX7100-32C), MEG2 (ACX7509), MEG1 (ACX7509), MA1.1 (ACX7024)
 *
 * Highlights:
 *   - Per-queue scheduler shaping / buffer / priority
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * Variables:
 *   (none)
 */
schedulers {
    SC-SIGNALING {
        shaping-rate percent 5;
        buffer-size percent 5;
        priority strict-high;
    }
    SC-LLQ {
        shaping-rate percent 40;
        buffer-size percent 10;
        priority low-latency;
    }
    SC-REALTIME {
        shaping-rate percent 30;
        buffer-size percent 20;
        priority medium-high;
    }
    SC-HIGH {
        transmit-rate percent 40;
        buffer-size percent 30;
        priority low;
    }
    SC-CONTROL {
        shaping-rate percent 5;
        buffer-size percent 5;
        priority high;
    }
    SC-MEDIUM {
        transmit-rate percent 30;
        buffer-size percent 20;
        priority low;
    }
    SC-LOW {
        transmit-rate percent 20;
        buffer-size percent 10;
        priority low;
    }
    SC-BEST-EFFORT {
        transmit-rate {
            remainder;
        }
        buffer-size {
            remainder;
        }
        priority low;
    }
}
```

## evo/firewall/filter-ccc-color-blind-l2cp.conf

```
/*
 * Topic:   Firewall: filter ccc color blind l2cp (MEF E-Line / EPL)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L), MA1.1 (ACX7024)
 *
 * Highlights:
 *   - family ccc filter (L2 L2CP/PCP handling for CCC)
 *   - Two-rate three-color marker (TrTCM, RFC 2698)
 *   - Color-blind policer (ignores ingress loss-priority)
 *   - Discards L2CP/BPDU destination-mac frames
 *   - Discards 802.1p priority 6/7 (reserved for network control)
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   Junos: MA5 (MX204)
 *
 * Variables:
 *   $FILTER_NAME  e.g. f_port_based_fam_ccc
 */
firewall {
    family ccc {
        filter $FILTER_NAME {
            interface-specific;
            term discard-l2cp {
                from {
                    destination-mac-address {
                        01:80:c2:00:00:07/48;
                        01:80:c2:00:00:0e/48;
                        01:80:c2:00:00:20/48;
                        01:80:c2:00:00:21/48;
                        01:80:c2:00:00:22/48;
                        01:80:c2:00:00:23/48;
                        01:80:c2:00:00:2a/48;
                        01:80:c2:00:00:2d/48;
                        01:80:c2:00:00:2e/48;
                        01:80:c2:00:00:2f/48;
                        01:80:c2:00:00:2b/48;
                        01:80:c2:00:00:24/48;
                        01:80:c2:00:00:25/48;
                        01:80:c2:00:00:26/48;
                        01:80:c2:00:00:27/48;
                        01:80:c2:00:00:28/48;
                        01:80:c2:00:00:29/48;
                        01:80:c2:00:00:2c/48;
                    }
                }
                then {
                    count l2cp_discard;
                    discard;
                }
            }
            term discard_pcp {
                from {
                    learn-vlan-1p-priority [ 6 7 ];
                }
                then {
                    count discard_pcp6_7;
                    discard;
                }
            }
            term high_class {
                from {
                    learn-vlan-1p-priority [ 5 4 ];
                }
                then {
                    three-color-policer {
                        two-rate high_policer;
                    }
                    count high_class;
                }
            }
            term medium_class {
                from {
                    learn-vlan-1p-priority [ 3 2 ];
                }
                then {
                    three-color-policer {
                        two-rate medium_policer;
                    }
                    count class_medium;
                }
            }
            term low_class {
                from {
                    learn-vlan-1p-priority [ 0 1 ];
                }
                then {
                    three-color-policer {
                        two-rate low_policer;
                    }
                    count class_low;
                }
            }
            term default {
                then {
                    three-color-policer {
                        two-rate low_policer;
                    }
                    count default;
                }
            }
        }
    }
    three-color-policer high_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 3500000000;
            peak-burst-size 35125;
        }
    }
    three-color-policer low_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 22k;
            committed-burst-size 125;
            peak-information-rate 3500000000;
            peak-burst-size 35k;
        }
    }
    three-color-policer medium_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 7g;
            peak-burst-size 70k;
        }
    }
}
```

## evo/firewall/filter-ccc-color-blind-v2.conf

```
/*
 * Topic:   Firewall: filter ccc color blind (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MA1.1 (ACX7024), AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - family ccc filter (L2 L2CP/PCP handling for CCC)
 *   - Two-rate three-color marker (TrTCM, RFC 2698)
 *   - Color-blind policer (ignores ingress loss-priority)
 *   - Discards 802.1p priority 6/7 (reserved for network control)
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   Evo: MEG1 (ACX7100-32C), MEG2 (ACX7509), MA1.2 (ACX7024)
 *   Junos: MSE1 (MX304), AN1 (MX204), AN2 (ACX5448), AN4 (ACX710), MA5 (MX204)
 *
 * Variables:
 *   $FILTER_NAME  e.g. f_vlan-based_fam_ccc
 */
firewall {
    family ccc {
        filter $FILTER_NAME {
            interface-specific;
            term discard_pcp {
                from {
                    learn-vlan-1p-priority [ 6 7 ];
                }
                then {
                    count discard_pcp6_7;
                    discard;
                }
            }
            term high_class {
                from {
                    learn-vlan-1p-priority [ 5 4 ];
                }
                then {
                    three-color-policer {
                        two-rate high_policer;
                    }
                    count high_class;
                }
            }
            term medium_class {
                from {
                    learn-vlan-1p-priority [ 3 2 ];
                }
                then {
                    three-color-policer {
                        two-rate medium_policer;
                    }
                    count class_medium;
                }
            }
            term low_class {
                from {
                    learn-vlan-1p-priority [ 0 1 ];
                }
                then {
                    three-color-policer {
                        two-rate low_policer;
                    }
                    count class_low;
                }
            }
            term default {
                then {
                    three-color-policer {
                        two-rate low_policer;
                    }
                    count default;
                }
            }
        }
    }
    three-color-policer high_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 3500000000;
            peak-burst-size 35125;
        }
    }
    three-color-policer low_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 22k;
            committed-burst-size 125;
            peak-information-rate 3500000000;
            peak-burst-size 35k;
        }
    }
    three-color-policer medium_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 7g;
            peak-burst-size 70k;
        }
    }
}
```

## evo/firewall/filter-ccc-color-blind.conf

```
/*
 * Topic:   Firewall: filter ccc color blind (MEF E-Access, E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MA3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG2 (ACX7509), MA1.2 (ACX7024)
 *
 * Highlights:
 *   - family ccc filter (L2 L2CP/PCP handling for CCC)
 *   - Two-rate three-color marker (TrTCM, RFC 2698)
 *   - Color-blind policer (ignores ingress loss-priority)
 *   - Discards 802.1p priority 6/7 (reserved for network control)
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   Evo: MA1.1 (ACX7024), AN3 (ACX7100-48L)
 *   Junos: MA5 (MX204), AN1 (MX204), AN2 (ACX5448), MSE1 (MX304), MSE2 (MX304)
 *
 * Variables:
 *   $FILTER_NAME  e.g. f_vlan-based_fam_ccc
 */
firewall {
    family ccc {
        filter $FILTER_NAME {
            interface-specific;
            term discard_pcp {
                from {
                    learn-vlan-1p-priority [ 6 7 ];
                }
                then {
                    count discard_pcp6_7;
                    discard;
                }
            }
            term high_class {
                from {
                    learn-vlan-1p-priority [ 5 4 ];
                }
                then {
                    three-color-policer {
                        two-rate high_policer;
                    }
                    count high_class;
                }
            }
            term medium_class {
                from {
                    learn-vlan-1p-priority [ 3 2 ];
                }
                then {
                    three-color-policer {
                        two-rate medium_policer;
                    }
                    count class_medium;
                }
            }
            term low_class {
                from {
                    learn-vlan-1p-priority [ 0 1 ];
                }
                then {
                    three-color-policer {
                        two-rate low_policer;
                    }
                    count class_low;
                }
            }
            term default {
                then {
                    three-color-policer {
                        two-rate high_policer;
                    }
                    count default;
                }
            }
        }
    }
    three-color-policer high_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 3500000000;
            peak-burst-size 35125;
        }
    }
    three-color-policer low_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 22k;
            committed-burst-size 125;
            peak-information-rate 3500000000;
            peak-burst-size 35k;
        }
    }
    three-color-policer medium_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 7g;
            peak-burst-size 70k;
        }
    }
}
```

## evo/firewall/filter-eswitch-color-blind-l2cp.conf

```
/*
 * Topic:   Firewall: filter eswitch color blind l2cp (MEF E-LAN / EP-LAN)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L), MA1.2 (ACX7024)
 *
 * Highlights:
 *   - family ethernet-switching filter (Junos/ACX L2 switching path)
 *   - Two-rate three-color marker (TrTCM, RFC 2698)
 *   - Color-blind policer (ignores ingress loss-priority)
 *   - Discards L2CP/BPDU destination-mac frames
 *   - Discards 802.1p priority 6/7 (reserved for network control)
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   Junos: MA5 (MX204)
 *
 * Variables:
 *   $FILTER_NAME  e.g. f_epl_bridge
 */
firewall {
    family ethernet-switching {
        filter $FILTER_NAME {
            interface-specific;
            term discard-l2cp {
                from {
                    destination-mac-address {
                        01:80:c2:00:00:07/48;
                        01:80:c2:00:00:0e/48;
                        01:80:c2:00:00:20/48;
                        01:80:c2:00:00:21/48;
                        01:80:c2:00:00:22/48;
                        01:80:c2:00:00:23/48;
                        01:80:c2:00:00:2a/48;
                        01:80:c2:00:00:2d/48;
                        01:80:c2:00:00:2e/48;
                        01:80:c2:00:00:2f/48;
                        01:80:c2:00:00:2b/48;
                        01:80:c2:00:00:24/48;
                        01:80:c2:00:00:25/48;
                        01:80:c2:00:00:26/48;
                        01:80:c2:00:00:27/48;
                        01:80:c2:00:00:28/48;
                        01:80:c2:00:00:29/48;
                        01:80:c2:00:00:2c/48;
                    }
                }
                then {
                    discard;
                    count l2cp_discard;
                }
            }
            term discard_pcp {
                from {
                    learn-vlan-1p-priority [ 6 7 ];
                }
                then {
                    discard;
                    count discard_pcp6_7;
                }
            }
            term high_class {
                from {
                    learn-vlan-1p-priority [ 5 4 ];
                }
                then {
                    count high_class;
                    three-color-policer {
                        two-rate high_policer;
                    }
                }
            }
            term medium_class {
                from {
                    learn-vlan-1p-priority [ 3 2 ];
                }
                then {
                    count class_medium;
                    three-color-policer {
                        two-rate medium_policer;
                    }
                }
            }
            term low_class {
                from {
                    learn-vlan-1p-priority [ 0 1 ];
                }
                then {
                    count class_low;
                    three-color-policer {
                        two-rate low_policer;
                    }
                }
            }
            term default {
                then {
                    count default;
                    three-color-policer {
                        two-rate low_policer;
                    }
                }
            }
        }
    }
    three-color-policer high_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 3500000000;
            peak-burst-size 35125;
        }
    }
    three-color-policer low_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 22k;
            committed-burst-size 125;
            peak-information-rate 3500000000;
            peak-burst-size 35k;
        }
    }
    three-color-policer medium_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 7g;
            peak-burst-size 70k;
        }
    }
}
```

## evo/firewall/filter-eswitch-color-blind-v2.conf

```
/*
 * Topic:   Firewall: filter eswitch color blind (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L), MA1.2 (ACX7024)
 *
 * Highlights:
 *   - family ethernet-switching filter (Junos/ACX L2 switching path)
 *   - Two-rate three-color marker (TrTCM, RFC 2698)
 *   - Color-blind policer (ignores ingress loss-priority)
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   Evo: MEG1 (ACX7100-32C), MEG2 (ACX7509), MEG1 (ACX7509), MA1.1 (ACX7024)
 *   Junos: MSE1 (MX304), AN1 (MX204), AN2 (ACX5448)
 *
 * Variables:
 *   $FILTER_NAME  e.g. f_elan-evpn
 */
firewall {
    family ethernet-switching {
        filter $FILTER_NAME {
            interface-specific;
            term high_class {
                from {
                    learn-vlan-1p-priority [ 5 4 ];
                }
                then {
                    count high_class;
                    three-color-policer {
                        two-rate high_policer;
                    }
                }
            }
            term medium_class {
                from {
                    learn-vlan-1p-priority [ 3 2 ];
                }
                then {
                    count class_medium;
                    three-color-policer {
                        two-rate medium_policer;
                    }
                }
            }
            term low_class {
                from {
                    learn-vlan-1p-priority [ 0 1 ];
                }
                then {
                    count class_low;
                    three-color-policer {
                        two-rate low_policer;
                    }
                }
            }
            term default {
                then {
                    count default;
                    three-color-policer {
                        two-rate high_policer;
                    }
                }
            }
        }
    }
    three-color-policer high_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 3500000000;
            peak-burst-size 35125;
        }
    }
    three-color-policer low_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 22k;
            committed-burst-size 125;
            peak-information-rate 3500000000;
            peak-burst-size 35k;
        }
    }
    three-color-policer medium_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 7g;
            peak-burst-size 70k;
        }
    }
}
```

## evo/firewall/filter-eswitch-color-blind.conf

```
/*
 * Topic:   Firewall: filter eswitch color blind (MEF E-LAN / EVP-LAN, E-Line / EVPL)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG2 (ACX7509), MEG1 (ACX7509), MA1.1 (ACX7024), MA1.2 (ACX7024)
 *
 * Highlights:
 *   - family ethernet-switching filter (Junos/ACX L2 switching path)
 *   - Two-rate three-color marker (TrTCM, RFC 2698)
 *   - Color-blind policer (ignores ingress loss-priority)
 *   - Discards 802.1p priority 6/7 (reserved for network control)
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   Junos: MSE1 (MX304), AN1 (MX204), AN2 (ACX5448), MA5 (MX204)
 *
 * Variables:
 *   $FILTER_NAME  e.g. f_elan-evpn
 */
firewall {
    family ethernet-switching {
        filter $FILTER_NAME {
            interface-specific;
            term discard_pcp {
                from {
                    learn-vlan-1p-priority [ 6 7 ];
                }
                then {
                    discard;
                    count discard_pcp6_7;
                }
            }
            term high_class {
                from {
                    learn-vlan-1p-priority [ 5 4 ];
                }
                then {
                    count high_class;
                    three-color-policer {
                        two-rate high_policer;
                    }
                }
            }
            term medium_class {
                from {
                    learn-vlan-1p-priority [ 3 2 ];
                }
                then {
                    count class_medium;
                    three-color-policer {
                        two-rate medium_policer;
                    }
                }
            }
            term low_class {
                from {
                    learn-vlan-1p-priority [ 0 1 ];
                }
                then {
                    count class_low;
                    three-color-policer {
                        two-rate low_policer;
                    }
                }
            }
            term default {
                then {
                    count default;
                    three-color-policer {
                        two-rate high_policer;
                    }
                }
            }
        }
    }
    three-color-policer high_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 3500000000;
            peak-burst-size 35125;
        }
    }
    three-color-policer low_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 22k;
            committed-burst-size 125;
            peak-information-rate 3500000000;
            peak-burst-size 35k;
        }
    }
    three-color-policer medium_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 7g;
            peak-burst-size 70k;
        }
    }
}
```

## evo/interfaces/ethernet-bridge-v2.conf

```
/*
 * Topic:   Interface: ethernet bridge (MEF E-LAN / EP-LAN)
 *
 * Seen on:
 *   Evo: MA1.2 (ACX7024)
 *
 * Highlights:
 *   - encapsulation ethernet-bridge
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-eswitch-color-blind-l2cp.conf
 *   - evo/services/evpn-elan-bundle-port-based.conf
 *
 * Variables:
 *   $AC_INTF  e.g. et-0/0/13
 *   $MTU      e.g. 9192
 *   $UNIT     e.g. 0
 */
$AC_INTF {
    mtu $MTU;
    encapsulation ethernet-bridge;
    unit $UNIT {
        family ethernet-switching {
            filter {
                input f_epl_bridge;
            }
        }
    }
}
```

## evo/interfaces/ethernet-bridge.conf

```
/*
 * Topic:   Interface: ethernet bridge (MEF E-LAN / EP-LAN)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L), MA1.2 (ACX7024)
 *
 * Highlights:
 *   - encapsulation ethernet-bridge
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-eswitch-color-blind-l2cp.conf
 *   - evo/services/evpn-elan-bundle-port-based.conf
 *
 * Variables:
 *   $AC_INTF  e.g. et-0/0/13
 *   $UNIT     e.g. 0
 */
$AC_INTF {
    encapsulation ethernet-bridge;
    unit $UNIT {
        family ethernet-switching {
            filter {
                input f_epl_bridge;
            }
        }
    }
}
```

## evo/interfaces/ethernet-ccc-v2.conf

```
/*
 * Topic:   Interface: ethernet ccc (MEF E-Line / EPL)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - encapsulation ethernet-ccc
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/services/l2vpn-kompella-port-based.conf
 *
 * Variables:
 *   $AC_INTF  e.g. et-0/0/13
 *   $UNIT     e.g. 0
 */
$AC_INTF {
    encapsulation ethernet-ccc;
    unit $UNIT {
        family ccc {
            filter {
                input f_eline-evpn-vpws;
            }
        }
    }
}
```

## evo/interfaces/ethernet-ccc.conf

```
/*
 * Topic:   Interface: ethernet ccc (MEF E-Line / EPL)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L), MA1.1 (ACX7024)
 *
 * Highlights:
 *   - encapsulation ethernet-ccc
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind-l2cp.conf
 *   - evo/services/evpn-vpws-port-based.conf
 *
 * Variables:
 *   $AC_INTF  e.g. et-0/0/13
 *   $UNIT     e.g. 0
 */
$AC_INTF {
    encapsulation ethernet-ccc;
    unit $UNIT {
        family ccc {
            filter {
                input f_port_based_fam_ccc;
            }
        }
    }
}
```

## evo/interfaces/irb-l3-vga.conf

```
/*
 * Topic:   Interface: irb l3 vga (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Evo: MEG1 (ACX7100-32C), MEG2 (ACX7509)
 *
 * Highlights:
 *   - IRB unit for L3 termination
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * Variables:
 *   $IP_ADDRESS  e.g. 198.51.100.2/27
 *   $UNIT        e.g. 4075
 *   $VG_ADDRESS  e.g. 198.51.100.1
 *   $VG_MAC      e.g. 00:01:33:44:11:11
 */
irb {
    unit $UNIT {
        virtual-gateway-accept-data;
        family inet {
            address $IP_ADDRESS {
                virtual-gateway-address $VG_ADDRESS;
            }
        }
        virtual-gateway-v4-mac $VG_MAC;
    }
}
```

## evo/interfaces/irb-l3.conf

```
/*
 * Topic:   Interface: irb l3 (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - IRB unit for L3 termination
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * Variables:
 *   $IP_ADDRESS  e.g. 203.0.113.1/27
 *   $MAC         e.g. 00:01:33:44:11:12
 *   $UNIT        e.g. 4075
 */
irb {
    unit $UNIT {
        family inet {
            address $IP_ADDRESS;
        }
        mac $MAC;
    }
}
```

## evo/interfaces/physical-mtu.conf

```
/*
 * Topic:   Interface: physical mtu (MEF E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - (no auto-generated highlights)
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind-l2cp.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/firewall/filter-eswitch-color-blind-l2cp.conf
 *   - evo/firewall/filter-eswitch-color-blind.conf
 *   - evo/services/bgp-vpls.conf
 *   - evo/services/evpn-elan-bundle-port-based.conf
 *   - evo/services/evpn-elan-type5.conf
 *   - evo/services/evpn-elan-vlan-bundle.conf
 *   - evo/services/evpn-fxc-vlan-unaware.conf
 *   - evo/services/evpn-vpws-port-based.conf
 *   - evo/services/evpn-vpws-vlan-based.conf
 *   - evo/services/l2circuit-hot-standby-primary.conf
 *   - evo/services/l2vpn-kompella-port-based.conf
 *   - evo/services/l2vpn-kompella-vlan-based.conf
 *
 * Variables:
 *   $AC_INTF  e.g. et-0/0/13
 *   $MTU      e.g. 9102
 */
$AC_INTF {
    mtu $MTU;
}
```

## evo/interfaces/vlan-bridge-bundle.conf

```
/*
 * Topic:   Interface: vlan bridge bundle (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - encapsulation flexible-ethernet-services
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-eswitch-color-blind.conf
 *   - evo/services/evpn-elan-vlan-bundle.conf
 *
 * Variables:
 *   $AC_INTF          e.g. et-0/0/13
 *   $UNIT             e.g. 4013
 *   $VLAN_LIST_END    e.g. 4014
 *   $VLAN_LIST_START  e.g. 4013
 */
$AC_INTF {
    flexible-vlan-tagging;
    encapsulation flexible-ethernet-services;
    unit $UNIT {
        encapsulation vlan-bridge;
        vlan-id-list $VLAN_LIST_START-$VLAN_LIST_END;
        family ethernet-switching {
            filter {
                input f_elan-evpn;
            }
        }
    }
}
```

## evo/interfaces/vlan-bridge-esi-bundle.conf

```
/*
 * Topic:   Interface: vlan bridge esi bundle (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Evo: MEG1 (ACX7100-32C), MEG2 (ACX7509)
 *
 * Highlights:
 *   - encapsulation vlan-bridge
 *   - ESI multihoming
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-eswitch-color-blind.conf
 *   - evo/services/evpn-elan-vlan-bundle.conf
 *
 * Variables:
 *   $AC_INTF          e.g. ae67
 *   $ESI_ID           e.g. 00:81:10:13:10:10:10:00:00:01
 *   $UNIT             e.g. 4013
 *   $VLAN_LIST_END    e.g. 4014
 *   $VLAN_LIST_START  e.g. 4013
 */
$AC_INTF {
    unit $UNIT {
        encapsulation vlan-bridge;
        vlan-id-list $VLAN_LIST_START-$VLAN_LIST_END;
        esi {
            $ESI_ID;
            all-active;
        }
        family ethernet-switching {
            filter {
                input f_elan-evpn;
            }
        }
    }
}
```

## evo/interfaces/vlan-bridge-esi.conf

```
/*
 * Topic:   Interface: vlan bridge esi (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Evo: MEG1 (ACX7100-32C), MEG2 (ACX7509), AN3 (ACX7100-48L), MEG1 (ACX7509), MA1.1 (ACX7024), MA1.2 (ACX7024)
 *
 * Highlights:
 *   - encapsulation vlan-bridge
 *   - ESI multihoming
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-eswitch-color-blind.conf
 *   - evo/services/evpn-elan-port-based.conf
 *   - evo/services/evpn-elan-type5.conf
 *
 * Variables:
 *   $AC_INTF  e.g. ae67
 *   $ESI_ID   e.g. 00:22:11:77:11:12:a1:00:00:01
 *   $UNIT     e.g. 4075
 *   $VLAN     e.g. 4075
 */
$AC_INTF {
    unit $UNIT {
        encapsulation vlan-bridge;
        vlan-id $VLAN;
        esi {
            $ESI_ID;
            all-active;
        }
        family ethernet-switching {
            filter {
                input f_elan-evpn;
            }
        }
    }
}
```

## evo/interfaces/vlan-bridge-v2.conf

```
/*
 * Topic:   Interface: vlan bridge (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MA1.2 (ACX7024)
 *
 * Highlights:
 *   - encapsulation flexible-ethernet-services
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-eswitch-color-blind.conf
 *   - evo/services/bgp-vpls-p2p.conf
 *
 * Variables:
 *   $AC_INTF  e.g. et-0/0/12
 *   $UNIT     e.g. 4005
 *   $VLAN     e.g. 4005
 */
$AC_INTF {
    vlan-tagging;
    encapsulation flexible-ethernet-services;
    unit $UNIT {
        encapsulation vlan-bridge;
        vlan-id $VLAN;
        family ethernet-switching {
            filter {
                input f_vlan_based_fam_bridge;
            }
        }
    }
}
```

## evo/interfaces/vlan-bridge-vlan-map-v2.conf

```
/*
 * Topic:   Interface: vlan bridge vlan map (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Evo: MEG2 (ACX7509), MA1.2 (ACX7024)
 *
 * Highlights:
 *   - encapsulation vlan-bridge
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-eswitch-color-blind.conf
 *   - evo/services/bgp-vpls.conf
 *
 * Variables:
 *   $AC_INTF    e.g. et-2/0/4
 *   $INPUT_VID  e.g. 3712
 *   $UNIT       e.g. 4012
 *   $VLAN       e.g. 4012
 */
$AC_INTF {
    unit $UNIT {
        encapsulation vlan-bridge;
        vlan-id $VLAN;
        input-vlan-map {
            push;
            vlan-id $INPUT_VID;
        }
        output-vlan-map pop;
        family ethernet-switching {
            filter {
                input f_elan-evpn;
            }
        }
    }
}
```

## evo/interfaces/vlan-bridge-vlan-map.conf

```
/*
 * Topic:   Interface: vlan bridge vlan map (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - encapsulation flexible-ethernet-services
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-eswitch-color-blind.conf
 *   - evo/services/bgp-vpls.conf
 *
 * Variables:
 *   $AC_INTF    e.g. et-0/0/13
 *   $INPUT_VID  e.g. 3712
 *   $UNIT       e.g. 4012
 *   $VLAN       e.g. 4012
 */
$AC_INTF {
    flexible-vlan-tagging;
    encapsulation flexible-ethernet-services;
    unit $UNIT {
        encapsulation vlan-bridge;
        vlan-id $VLAN;
        input-vlan-map {
            push;
            vlan-id $INPUT_VID;
        }
        output-vlan-map pop;
        family ethernet-switching {
            filter {
                input f_elan-evpn;
            }
        }
    }
}
```

## evo/interfaces/vlan-bridge.conf

```
/*
 * Topic:   Interface: vlan bridge (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - encapsulation flexible-ethernet-services
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-eswitch-color-blind.conf
 *   - evo/services/evpn-elan-type5.conf
 *
 * Variables:
 *   $AC_INTF  e.g. et-0/0/13
 *   $UNIT     e.g. 4075
 *   $VLAN     e.g. 4075
 */
$AC_INTF {
    flexible-vlan-tagging;
    encapsulation flexible-ethernet-services;
    unit $UNIT {
        encapsulation vlan-bridge;
        vlan-id $VLAN;
        family ethernet-switching {
            filter {
                input f_elan-evpn;
            }
        }
    }
}
```

## evo/interfaces/vlan-ccc-1-unit-list-push.conf

```
/*
 * Topic:   Interface: vlan ccc 1 unit vlan-id-list + S-VLAN push (MEF E-Line / EVPL) — EVPN-FXC member
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - encapsulation vlan-ccc
 *   - vlan-id-list range + input-vlan-map push (normalize to one S-VLAN)
 *
 * Pair with (same-device dependencies):
 *   - evo/services/evpn-fxc-vlan-unaware-1.conf
 *
 * Variables:
 *   $AC_INTF      e.g. et-0/0/0
 *   $FILTER_NAME  e.g. f_vlan_based_fam_bridge
 *   $SVLAN        e.g. 4090
 *   $UNIT         e.g. 800
 *   $VLAN_LIST    e.g. 800-809
 */
$AC_INTF {
    flexible-vlan-tagging;
    encapsulation flexible-ethernet-services;
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-id-list $VLAN_LIST;
        input-vlan-map {
            push;
            vlan-id $SVLAN;
        }
        output-vlan-map pop;
        family ccc {
            filter {
                input $FILTER_NAME;
            }
        }
    }
}
```

## evo/interfaces/vlan-ccc-1-unit-list.conf

```
/*
 * Topic:   Interface: vlan ccc 1 unit vlan-id-list (MEF E-Line / EVPL) — EVPN-FXC member
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - encapsulation vlan-ccc
 *   - vlan-id-list bundles a contiguous VLAN range on one UNI
 *
 * Pair with (same-device dependencies):
 *   - evo/services/evpn-fxc-vlan-unaware-1.conf
 *
 * Variables:
 *   $AC_INTF      e.g. et-0/0/0
 *   $FILTER_NAME  e.g. f_vlan_based_fam_bridge
 *   $UNIT         e.g. 800
 *   $VLAN_LIST    e.g. 800-809
 */
$AC_INTF {
    flexible-vlan-tagging;
    encapsulation flexible-ethernet-services;
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-id-list $VLAN_LIST;
        family ccc {
            filter {
                input $FILTER_NAME;
            }
        }
    }
}
```

## evo/interfaces/vlan-ccc-1-unit-qinq.conf

```
/*
 * Topic:   Interface: vlan ccc 1 unit QinQ (MEF E-Line / EVPL) — EVPN-FXC member
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - encapsulation vlan-ccc
 *   - vlan-tags outer/inner (S-VLAN + C-VLAN double tag) — one UNI per C-VLAN
 *
 * Pair with (same-device dependencies):
 *   - evo/services/evpn-fxc-vlan-unaware-1.conf
 *
 * Variables:
 *   $AC_INTF      e.g. et-0/0/0
 *   $FILTER_NAME  e.g. f_vlan_based_fam_bridge
 *   $SVLAN        e.g. 4090
 *   $UNIT         e.g. 800
 *   $VLAN         e.g. 800
 */
$AC_INTF {
    flexible-vlan-tagging;
    encapsulation flexible-ethernet-services;
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-tags outer $SVLAN inner $VLAN;
        family ccc {
            filter {
                input $FILTER_NAME;
            }
        }
    }
}
```

## evo/interfaces/vlan-ccc-1-unit.conf

```
/*
 * Topic:   Interface: vlan ccc 1 unit (MEF E-Line / EVPL) — EVPN-FXC member
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - encapsulation flexible-ethernet-services
 *   - One bundled VLAN UNI of a VLAN-unaware EVPN-FXC (repeat per UNI)
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/services/evpn-fxc-vlan-unaware-1.conf
 *
 * Variables:
 *   $AC_INTF      e.g. et-0/0/13
 *   $FILTER_NAME  e.g. f_vlan_based_fam_bridge
 *   $UNIT         e.g. 4007
 *   $VLAN         e.g. 4007
 */
$AC_INTF {
    flexible-vlan-tagging;
    encapsulation flexible-ethernet-services;
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-id $VLAN;
        family ccc {
            filter {
                input $FILTER_NAME;
            }
        }
    }
}
```

## evo/interfaces/vlan-ccc-2-units.conf

```
/*
 * Topic:   Interface: vlan ccc 2 units (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - encapsulation flexible-ethernet-services
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-eswitch-color-blind.conf
 *   - evo/services/evpn-fxc-vlan-unaware.conf
 *
 * Variables:
 *   $AC_INTF      e.g. et-0/0/13
 *   $FILTER_NAME  e.g. f_vlan_based_fam_bridge
 *   $UNIT_1       e.g. 4007
 *   $UNIT_2       e.g. 4008
 *   $VLAN_1       e.g. 4007
 *   $VLAN_2       e.g. 4008
 */
$AC_INTF {
    flexible-vlan-tagging;
    encapsulation flexible-ethernet-services;
    unit $UNIT_1 {
        encapsulation vlan-ccc;
        vlan-id $VLAN_1;
        family ccc {
            filter {
                input $FILTER_NAME;
            }
        }
    }
    unit $UNIT_2 {
        encapsulation vlan-ccc;
        vlan-id $VLAN_2;
        family ccc {
            filter {
                input $FILTER_NAME;
            }
        }
    }
}
```

## evo/interfaces/vlan-ccc-esi-1-unit.conf

```
/*
 * Topic:   Interface: vlan ccc esi 1 unit (MEF E-Line / EVPL) — EVPN-FXC member (aware, no vlan-map)
 *
 * Seen on:
 *   Evo: MEG1 (ACX7100-32C), MEG2 (ACX7509), MA1.1 (ACX7024), MA1.2 (ACX7024)
 *
 * Highlights:
 *   - encapsulation vlan-ccc
 *   - ESI multihoming (all-active); customer VLAN matched end-to-end (no S-VLAN map)
 *
 * Pair with (same-device dependencies):
 *   - evo/services/evpn-fxc-vlan-aware-1.conf
 *
 * Variables:
 *   $AC_INTF      e.g. ae67
 *   $ESI_ID       e.g. 00:10:44:11:50:12:02:00:00:00
 *   $FILTER_NAME  e.g. f_vlan-based_fam_ccc
 *   $UNIT         e.g. 4002
 *   $VLAN         e.g. 4002
 */
$AC_INTF {
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-id $VLAN;
        esi {
            $ESI_ID;
            all-active;
        }
        family ccc {
            filter {
                input $FILTER_NAME;
            }
        }
    }
}
```

## evo/interfaces/vlan-ccc-esi.conf

```
/*
 * Topic:   Interface: vlan ccc esi (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MEG1 (ACX7100-32C), MEG2 (ACX7509)
 *
 * Highlights:
 *   - encapsulation vlan-ccc
 *   - ESI multihoming
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/services/evpn-vpws-vlan-based.conf
 *
 * Variables:
 *   $AC_INTF  e.g. ae67
 *   $ESI_ID   e.g. 00:40:11:11:21:22:01:00:00:01
 *   $UNIT     e.g. 4000
 *   $VLAN     e.g. 4000
 */
$AC_INTF {
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-id $VLAN;
        esi {
            $ESI_ID;
            all-active;
        }
        family ccc {
            filter {
                input f_vlan-based_fam_ccc;
            }
        }
    }
}
```

## evo/interfaces/vlan-ccc-list.conf

```
/*
 * Topic:   Interface: vlan ccc list (MEF E-Line / PWHT access)
 *
 * Seen on:
 *   Evo: MA1.2 (ACX7024)
 *
 * Highlights:
 *   - encapsulation vlan-ccc
 *   - vlan-id-list — one attachment-circuit unit carries a VLAN range
 *
 * Pair with (same-device dependencies):
 *   - evo/services/l2circuit-floating-pw.conf
 *
 * Variables:
 *   $AC_INTF          e.g. et-0/0/14
 *   $UNIT             e.g. 300
 *   $VLAN_LIST_START  e.g. 300
 *   $VLAN_LIST_END    e.g. 309
 */
$AC_INTF {
    flexible-vlan-tagging;
    encapsulation flexible-ethernet-services;
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-id-list $VLAN_LIST_START-$VLAN_LIST_END;
    }
}
```

## evo/interfaces/vlan-ccc-qinq-stacked-qinq-tpid.conf

```
/*
 * Topic:   Interface: vlan ccc qinq stacked qinq tpid (MEF E-Access)
 *
 * Seen on:
 *   Evo: MA3 (ACX7100-48L)
 *
 * Highlights:
 *   - encapsulation vlan-ccc
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/cos-binding-mpls.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/services/evpn-vpws-lsw.conf
 *   - evo/services/l2circuit-lsw.conf
 *
 * Variables:
 *   $AC_INTF         e.g. et-0/0/51
 *   $MTU             e.g. 9102
 *   $OUTER_VID_TPID  e.g. 0x88a8.4082
 *   $UNIT            e.g. 4082
 */
$AC_INTF {
    mtu $MTU;
    ether-options {
        ethernet-switch-profile {
            tag-protocol-id [ 0x8100 0x88a8 ];
        }
    }
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-tags outer $OUTER_VID_TPID;
    }
}
```

## evo/interfaces/vlan-ccc-v2.conf

```
/*
 * Topic:   Interface: vlan ccc (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MA1.2 (ACX7024), AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - encapsulation flexible-ethernet-services
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/services/l2circuit-floating-pw.conf
 *   - evo/services/l2vpn-kompella-vlan-based.conf
 *
 * Variables:
 *   $AC_INTF  e.g. et-0/0/12
 *   $UNIT     e.g. 4004
 *   $VLAN     e.g. 4004
 */
$AC_INTF {
    flexible-vlan-tagging;
    encapsulation flexible-ethernet-services;
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-id $VLAN;
        family ccc {
            filter {
                input f_vlan-based_fam_ccc;
            }
        }
    }
}
```

## evo/interfaces/vlan-ccc-vlan-map-bundle-qinq-tpid.conf

```
/*
 * Topic:   Interface: vlan ccc vlan map bundle qinq tpid (MEF E-Access)
 *
 * Seen on:
 *   Evo: MA3 (ACX7100-48L)
 *
 * Highlights:
 *   - encapsulation flexible-ethernet-services
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/services/evpn-vpws-lsw.conf
 *   - evo/services/l2circuit-lsw.conf
 *
 * Variables:
 *   $AC_INTF          e.g. et-0/0/0
 *   $INPUT_VID        e.g. 4082
 *   $MTU              e.g. 9102
 *   $UNIT             e.g. 2500
 *   $VLAN_LIST_END    e.g. 2599
 *   $VLAN_LIST_START  e.g. 2500
 */
$AC_INTF {
    flexible-vlan-tagging;
    mtu $MTU;
    encapsulation flexible-ethernet-services;
    ether-options {
        ethernet-switch-profile {
            tag-protocol-id [ 0x8100 0x88a8 ];
        }
    }
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-id-list $VLAN_LIST_START-$VLAN_LIST_END;
        input-vlan-map {
            push;
            tag-protocol-id 0x88a8;
            vlan-id $INPUT_VID;
        }
        output-vlan-map pop;
        family ccc {
            filter {
                input f_vlan-based_fam_ccc;
            }
        }
    }
}
```

## evo/interfaces/vlan-ccc-vlan-map-esi-1-unit.conf

```
/*
 * Topic:   Interface: vlan ccc vlan map esi 1 unit (MEF E-Line / EVPL) — EVPN-FXC member
 *
 * Seen on:
 *   Evo: MEG1 (ACX7100-32C), MEG2 (ACX7509), MA1.1 (ACX7024), MA1.2 (ACX7024)
 *
 * Highlights:
 *   - encapsulation vlan-ccc
 *   - ESI multihoming (all-active)
 *   - One bundled VLAN UNI of a VLAN-aware EVPN-FXC (repeat per UNI)
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/services/evpn-fxc-vlan-aware-1.conf
 *
 * Variables:
 *   $AC_INTF      e.g. ae67
 *   $ESI_ID       e.g. 00:10:44:11:50:12:02:00:00:00
 *   $FILTER_NAME  e.g. f_vlan-based_fam_ccc
 *   $INPUT_VID    e.g. 3400
 *   $UNIT         e.g. 4002
 *   $VLAN         e.g. 4002
 */
$AC_INTF {
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-id $VLAN;
        input-vlan-map {
            push;
            vlan-id $INPUT_VID;
        }
        output-vlan-map pop;
        esi {
            $ESI_ID;
            all-active;
        }
        family ccc {
            filter {
                input $FILTER_NAME;
            }
        }
    }
}
```

## evo/interfaces/vlan-ccc-vlan-map-esi-2-units-v2.conf

```
/*
 * Topic:   Interface: vlan ccc vlan map esi 2 units (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MA1.1 (ACX7024), MA1.2 (ACX7024)
 *
 * Highlights:
 *   - encapsulation vlan-ccc
 *   - ESI multihoming
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/services/evpn-vpws-vlan-based.conf
 *
 * Variables:
 *   $AC_INTF    e.g. ae12
 *   $ESI_ID     e.g. 00:10:11:49:30:12:01:00:00:00
 *   $INPUT_VID  e.g. 4094
 *   $UNIT_1     e.g. 200
 *   $UNIT_2     e.g. 4009
 *   $VLAN       e.g. 4009
 */
$AC_INTF {
    unit $UNIT_1 {
        input-vlan-map vlan-id $VLAN;
    }
    unit $UNIT_2 {
        encapsulation vlan-ccc;
        vlan-id $VLAN;
        input-vlan-map {
            push;
            vlan-id $INPUT_VID;
        }
        output-vlan-map pop;
        esi {
            $ESI_ID;
            all-active;
        }
        family ccc {
            filter {
                input f_eline-evpn-vpws;
            }
        }
    }
}
```

## evo/interfaces/vlan-ccc-vlan-map-esi-2-units.conf

```
/*
 * Topic:   Interface: vlan ccc vlan map esi 2 units (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MEG1 (ACX7100-32C), MEG2 (ACX7509), MA1.1 (ACX7024), MA1.2 (ACX7024)
 *
 * Highlights:
 *   - encapsulation vlan-ccc
 *   - ESI multihoming
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/services/evpn-fxc-vlan-aware.conf
 *
 * Variables:
 *   $AC_INTF      e.g. ae67
 *   $ESI_ID_1     e.g. 00:10:44:11:50:12:02:00:00:00
 *   $ESI_ID_2     e.g. 00:10:44:11:50:12:01:00:00:00
 *   $INPUT_VID_1  e.g. 3400
 *   $INPUT_VID_2  e.g. 3000
 *   $UNIT_1       e.g. 4002
 *   $UNIT_2       e.g. 4001
 *   $VLAN_1       e.g. 4002
 *   $VLAN_2       e.g. 4001
 */
$AC_INTF {
    unit $UNIT_1 {
        encapsulation vlan-ccc;
        vlan-id $VLAN_1;
        input-vlan-map {
            push;
            vlan-id $INPUT_VID_1;
        }
        output-vlan-map pop;
        esi {
            $ESI_ID_1;
            all-active;
        }
        family ccc {
            filter {
                input f_vlan-based_fam_ccc;
            }
        }
    }
    unit $UNIT_2 {
        encapsulation vlan-ccc;
        vlan-id $VLAN_2;
        input-vlan-map {
            push;
            vlan-id $INPUT_VID_2;
        }
        output-vlan-map pop;
        esi {
            $ESI_ID_2;
            all-active;
        }
        family ccc {
            filter {
                input f_vlan-based_fam_ccc;
            }
        }
    }
}
```

## evo/interfaces/vlan-ccc-vlan-map-esi.conf

```
/*
 * Topic:   Interface: vlan ccc vlan map esi (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - encapsulation vlan-ccc
 *   - ESI multihoming
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/services/evpn-vpws-vlan-based.conf
 *
 * Variables:
 *   $AC_INTF    e.g. ae11
 *   $ESI_ID     e.g. 00:10:11:49:30:11:01:00:00:00
 *   $INPUT_VID  e.g. 4094
 *   $UNIT       e.g. 4009
 *   $VLAN       e.g. 4009
 */
$AC_INTF {
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-id $VLAN;
        input-vlan-map {
            push;
            vlan-id $INPUT_VID;
        }
        output-vlan-map pop;
        esi {
            $ESI_ID;
            all-active;
        }
        family ccc {
            filter {
                input f_eline-evpn-vpws;
            }
        }
    }
}
```

## evo/interfaces/vlan-ccc-vlan-map-v2.conf

```
/*
 * Topic:   Interface: vlan ccc vlan map (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MEG1 (ACX7100-32C)
 *
 * Highlights:
 *   - encapsulation flexible-ethernet-services
 *
 * Pair with (same-device dependencies):
 *   - evo/firewall/filter-ccc-color-blind.conf
 *
 * Variables:
 *   $AC_INTF    e.g. et-0/0/28:2
 *   $INPUT_VID  e.g. 1000
 *   $UNIT       e.g. 4006
 *   $VLAN       e.g. 4006
 */
interfaces {
    $AC_INTF {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        unit $UNIT {
            encapsulation vlan-ccc;
            vlan-id $VLAN;
            input-vlan-map {
                push;
                vlan-id $INPUT_VID;
            }
            output-vlan-map pop;
            family ccc {
                filter {
                    input f_vlan-based_fam_ccc;
                }
            }
        }
    }
}
```

## evo/interfaces/vlan-ccc-vlan-map.conf

```
/*
 * Topic:   Interface: vlan ccc vlan map (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L), MEG2 (ACX7509)
 *
 * Highlights:
 *   - encapsulation flexible-ethernet-services
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/services/evpn-vpws-vlan-based.conf
 *   - evo/services/l2circuit-hot-standby-backup.conf
 *   - evo/services/l2circuit-hot-standby-primary.conf
 *
 * Variables:
 *   $AC_INTF    e.g. et-0/0/13
 *   $INPUT_VID  e.g. 4080
 *   $UNIT       e.g. 4010
 *   $VLAN       e.g. 4010
 */
$AC_INTF {
    flexible-vlan-tagging;
    encapsulation flexible-ethernet-services;
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-id $VLAN;
        input-vlan-map {
            push;
            vlan-id $INPUT_VID;
        }
        output-vlan-map pop;
        family ccc {
            filter {
                input f_vlan-based_fam_ccc;
            }
        }
    }
}
```

## evo/interfaces/vlan-ccc.conf

```
/*
 * Topic:   Interface: vlan ccc (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - encapsulation vlan-ccc
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/services/evpn-vpws-vlan-based.conf
 *
 * Variables:
 *   $AC_INTF  e.g. et-0/0/13
 *   $UNIT     e.g. 4000
 *   $VLAN     e.g. 4000
 */
$AC_INTF {
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-id $VLAN;
        family ccc {
            filter {
                input f_vlan-based_fam_ccc;
            }
        }
    }
}
```

## evo/policy/communities-tc-color.conf

```
/*
 * Topic:   Policy: transport-class color communities (gold / bronze)
 *
 * Seen on:
 *   Evo: MA1.2 (ACX7024)
 *
 * Highlights:
 *   - Defines the BGP-CT color-mapping communities referenced by a colored
 *     l2circuit / VRF-export (color:0:4000 gold, color:0:6000 bronze)
 *
 * Pair with (same-device dependencies):
 *   - evo/services/l2circuit-floating-pw.conf
 *
 * Variables: none — JVD-wide constants.
 */
policy-options {
    community CM-TC-MAP2BRONZE members color:0:6000;
    community CM-TC-MAP2GOLD members color:0:4000;
}
```

## evo/policy/policy-l3vpn-import-export.conf

```
/*
 * Topic:   Policy: policy l3vpn import export (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG2 (ACX7509)
 *
 * Highlights:
 *   - Community-driven RT policy
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   Junos: MSE1 (MX304)
 *
 * Variables:
 *   $COMM_RT        e.g. 61535:13075
 *   $POLICY_NAME_1  e.g. PS-$VPN_RT_COMM-EXPORT
 *   $POLICY_NAME_2  e.g. PS-$VPN_RT_COMM-IMPORT
 *   $PUBLIC_PREFIX  e.g. 203.0.113.0/24
 *   $VPN_RT_COMM    e.g. METRO_L3VPN_4075
 */
policy-options {
    policy-statement $POLICY_NAME_1 {
        term tag-public-routes {
            from {
                route-filter $PUBLIC_PREFIX orlonger;
            }
            then {
                community add CM-L3VPN-PUB;
                community add $VPN_RT_COMM;
                accept;
            }
        }
    }
    policy-statement $POLICY_NAME_2 {
        term L3VPN-CUST {
            from community $VPN_RT_COMM;
            then accept;
        }
    }
    community $VPN_RT_COMM members target:$COMM_RT;
}
```

## evo/policy/policy-vpn-rt-export-bronze.conf

```
/*
 * Topic:   Policy: policy vpn rt export bronze (MEF E-LAN / EVP-LAN, E-Line / EVPL)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG2 (ACX7509), MA1.2 (ACX7024), MA1.1 (ACX7024)
 *
 * Highlights:
 *   - Community-driven RT policy
 *   - Defines + adds the bronze color-mapping community (color:0:6000)
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   (none — single-device snip)
 *
 * Variables:
 *   $COMM_RT      e.g. 63535:4013
 *   $POLICY_NAME  e.g. evpn_group_80_4013
 *   $VPN_RT_COMM  e.g. evpn_group_80_4013_RT
 */
policy-options {
    policy-statement $POLICY_NAME {
        term a {
            then {
                community add $VPN_RT_COMM;
                community add CM-TC-MAP2BRONZE;
                accept;
            }
        }
        term b {
            then reject;
        }
    }
    community $VPN_RT_COMM members target:$COMM_RT;
    community CM-TC-MAP2BRONZE members color:0:6000;
}
```

## evo/policy/policy-vpn-rt-export-gold.conf

```
/*
 * Topic:   Policy: policy vpn rt export gold (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG2 (ACX7509)
 *
 * Highlights:
 *   - Community-driven RT policy
 *   - Defines + adds the gold color-mapping community (color:0:4000)
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   (none — single-device snip)
 *
 * Variables:
 *   $COMM_RT      e.g. 63535:33300
 *   $POLICY_NAME  e.g. evpn_group_edge_4000
 *   $VPN_RT_COMM  e.g. evpn_group_edge_4000_RT
 */
policy-options {
    policy-statement $POLICY_NAME {
        term a {
            then {
                community add $VPN_RT_COMM;
                community add CM-TC-MAP2GOLD;
                accept;
            }
        }
        term b {
            then reject;
        }
    }
    community $VPN_RT_COMM members target:$COMM_RT;
    community CM-TC-MAP2GOLD members color:0:4000;
}
```

## evo/services/bgp-vpls-p2p.conf

```
/*
 * Topic:   Service instance: bgp vpls p2p (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MA1.2 (ACX7024)
 *
 * Highlights:
 *   - instance-type virtual-switch
 *   - RT-driven import/export
 *   - VPLS $SITE_ID is per-domain — use contiguous IDs across PEs (1,2,3,...)
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-eswitch-color-blind.conf
 *   - evo/interfaces/vlan-bridge.conf
 *
 * JVD service mapping:
 *   vpls_group_4005 (eline_evpl_vpls_fapm_ring_p2p.conf):
 *     PEs (Evo): MA1.2 (ACX7024)
 *     PEs (Junos): MA5 (MX204)
 *
 * Variables:
 *   $AC_INTF           e.g. et-0/0/12
 *   $INSTANCE_NAME     e.g. vpls_group_4005
 *   $LABEL_BLOCK_SIZE  e.g. 2
 *   $RD                e.g. 10.0.0.18:44444
 *   $SITE_ID           e.g. 5
 *   $SITE_NAME         e.g. r18
 *   $SITE_RANGE        e.g. 2
 *   $UNIT              e.g. 4005
 *   $VRF_TARGET        e.g. 64535:44444
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-switch;
        protocols {
            vpls {
                site $SITE_NAME {
                    site-identifier $SITE_ID;
                }
                service-type single;
                site-range $SITE_RANGE;
                label-block-size $LABEL_BLOCK_SIZE;
                no-tunnel-services;
            }
        }
        route-distinguisher $RD;
        vrf-target target:$VRF_TARGET;
        vlans {
            vlan4005 {
                interface $AC_INTF.$UNIT;
            }
        }
    }
}
```

## evo/services/bgp-vpls.conf

```
/*
 * Topic:   Service instance: bgp vpls (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L), MEG2 (ACX7509), MA1.2 (ACX7024)
 *
 * Highlights:
 *   - instance-type virtual-switch
 *   - RT-driven import/export
 *   - VPLS $SITE_ID is per-domain — use contiguous IDs across PEs (1,2,3,...)
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-eswitch-color-blind.conf
 *   - evo/interfaces/physical-mtu.conf
 *   - evo/interfaces/vlan-bridge-vlan-map.conf
 *
 * JVD service mapping:
 *   vpls_group_103_4012 (elan_evp-lan_vpls_e2e_ms.conf):
 *     PEs (Evo): AN3 (ACX7100-48L), MA1.2 (ACX7024), MEG2 (ACX7509)
 *
 * Variables:
 *   $AC_INTF           e.g. et-0/0/13
 *   $BD_NAME           e.g. vlan4012
 *   $INSTANCE_NAME     e.g. vpls_group_103_4012
 *   $LABEL_BLOCK_SIZE  e.g. 8
 *   $RD                e.g. 63535:1894012
 *   $SITE_ID           e.g. 1
 *   $SITE_NAME         e.g. r2
 *   $SITE_RANGE        e.g. 10
 *   $UNIT              e.g. 4012
 *   $VRF_TARGET        e.g. 63535:1094012
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-switch;
        protocols {
            vpls {
                site $SITE_NAME {
                    site-identifier $SITE_ID;
                }
                service-type single;
                site-range $SITE_RANGE;
                label-block-size $LABEL_BLOCK_SIZE;
                no-tunnel-services;
            }
        }
        route-distinguisher $RD;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$VRF_TARGET;
        vlans {
            $BD_NAME {
                interface $AC_INTF.$UNIT;
            }
        }
    }
}
```

## evo/services/evpn-elan-bundle-port-based-v2.conf

```
/*
 * Topic:   Service instance: evpn elan bundle port based (MEF E-LAN / EP-LAN)
 *
 * Seen on:
 *   Evo: MA1.2 (ACX7024)
 *
 * Highlights:
 *   - instance-type mac-vrf
 *   - no-control-word (matches remote PE)
 *   - RT-driven import/export
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-eswitch-color-blind-l2cp.conf
 *   - evo/interfaces/ethernet-bridge.conf
 *   - evo/services/evpn-elan-bundle-port-based.conf
 *
 * JVD service mapping:
 *   MEF_EVPN_ELAN_PORT_BASED (elan_ep-lan_evpn_elan.conf):
 *     PEs (Evo): AN3 (ACX7100-48L), MA1.2 (ACX7024)
 *     PEs (Junos): MA5 (MX204)
 *
 * Variables:
 *   $AC_INTF        e.g. et-0/0/13
 *   $INSTANCE_NAME  e.g. MEF_EVPN_ELAN_PORT_BASED
 *   $RD             e.g. 10.0.0.18:4014
 *   $UNIT           e.g. 0
 *   $VRF_TARGET     e.g. 63535:4014
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
        vrf-target target:$VRF_TARGET;
        vlans {
            v-2 {
                interface $AC_INTF.$UNIT;
            }
        }
    }
}
```

## evo/services/evpn-elan-bundle-port-based.conf

```
/*
 * Topic:   Service instance: evpn elan bundle port based (MEF E-LAN / EP-LAN)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L), MA1.2 (ACX7024)
 *
 * Highlights:
 *   - instance-type mac-vrf
 *   - RT-driven import/export
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-eswitch-color-blind-l2cp.conf
 *   - evo/interfaces/ethernet-bridge.conf
 *   - evo/interfaces/physical-mtu.conf
 *   - evo/services/evpn-elan-bundle-port-based.conf
 *
 * JVD service mapping:
 *   MEF_EVPN_ELAN_PORT_BASED (elan_ep-lan_evpn_elan.conf):
 *     PEs (Evo): AN3 (ACX7100-48L), MA1.2 (ACX7024)
 *     PEs (Junos): MA5 (MX204)
 *
 * Variables:
 *   $AC_INTF        e.g. et-0/0/13
 *   $INSTANCE_NAME  e.g. MEF_EVPN_ELAN_PORT_BASED
 *   $RD             e.g. 10.0.0.2:4014
 *   $UNIT           e.g. 0
 *   $VRF_TARGET     e.g. 63535:4014
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type mac-vrf;
        protocols {
            evpn;
        }
        service-type vlan-bundle;
        route-distinguisher $RD;
        vrf-target target:$VRF_TARGET;
        vlans {
            v-2 {
                interface $AC_INTF.$UNIT;
            }
        }
    }
}
```

## evo/services/evpn-elan-port-based.conf

```
/*
 * Topic:   Service instance: evpn elan port based (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG1 (ACX7509), MA1.1 (ACX7024), MA1.2 (ACX7024)
 *
 * Highlights:
 *   - instance-type mac-vrf, service-type vlan-bundle (whole-port UNI)
 *   - MPLS encapsulation, no-control-word (matches remote PE)
 *   - EVPN-ELAN multipoint (BGP auto-discovery; each PE self-contained)
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-eswitch-color-blind-l2cp.conf
 *   - evo/interfaces/ethernet-bridge.conf
 *
 * Variables:
 *   $AC_INTF        e.g. et-0/0/13
 *   $BD_NAME        e.g. v-2
 *   $INSTANCE_NAME  e.g. MEF_EVPN_ELAN_PORT_BASED
 *   $RD             e.g. 10.0.0.2:4014
 *   $UNIT           e.g. 0
 *   $VRF_TARGET     e.g. 63535:4014
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
        service-type vlan-bundle;
        route-distinguisher $RD;
        vrf-target target:$VRF_TARGET;
        vlans {
            $BD_NAME {
                interface $AC_INTF.$UNIT;
            }
        }
    }
}
```

## evo/services/evpn-elan-type5-v2.conf

```
/*
 * Topic:   Service instance: evpn elan type5 (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Evo: MEG1 (ACX7100-32C), MEG2 (ACX7509)
 *
 * Highlights:
 *   - instance-type mac-vrf
 *   - EVPN Type-5 IP-prefix routes (L3 over EVPN)
 *   - MPLS encapsulation (SR-MPLS or LDP underlay)
 *   - no-control-word (matches remote PE)
 *   - RT-driven import/export
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-eswitch-color-blind.conf
 *   - evo/interfaces/vlan-bridge-esi.conf
 *
 * JVD service mapping:
 *   METRO_L3VPN_4075 (elan_evp-lan_evpn-elan_type-5.conf):
 *     PEs (Evo): AN3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG2 (ACX7509)
 *     PEs (Junos): MSE1 (MX304)
 *   evpn_group_60_4075 (elan_evp-lan_evpn-elan_type-5.conf):
 *     PEs (Evo): AN3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG2 (ACX7509)
 *     PEs (Junos): MSE1 (MX304)
 *
 * Variables:
 *   $AC_INTF        e.g. ae67
 *   $INSTANCE_NAME  e.g. evpn_group_60_4075
 *   $IRB_UNIT       e.g. 4075
 *   $RD_1           e.g. 10.0.0.6:14075
 *   $RD_2           e.g. 61000:13075
 *   $ROUTER_ID      e.g. 10.0.0.6
 *   $UNIT           e.g. 4075
 *   $VLAN           e.g. 4075
 *   $VRF_TARGET_1   e.g. 61535:14075
 *   $VRF_TARGET_2   e.g. 61535:13075
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
        route-distinguisher $RD_1;
        vrf-target target:$VRF_TARGET_1;
        vlans {
            V4000 {
                vlan-id $VLAN;
                interface $AC_INTF.$UNIT;
                l3-interface irb.$IRB_UNIT;
            }
        }
    }
    METRO_L3VPN_4075 {
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
        route-distinguisher $RD_2;
        vrf-import PS-METRO_L3VPN_4075-IMPORT;
        vrf-export PS-METRO_L3VPN_4075-EXPORT;
        vrf-target target:$VRF_TARGET_2;
        vrf-table-label;
    }
}
```

## evo/services/evpn-elan-type5.conf

```
/*
 * Topic:   Service instance: evpn elan type5 (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - instance-type mac-vrf
 *   - EVPN Type-5 IP-prefix routes (L3 over EVPN)
 *   - MPLS encapsulation (SR-MPLS or LDP underlay)
 *   - no-control-word (matches remote PE)
 *   - RT-driven import/export
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-eswitch-color-blind.conf
 *   - evo/interfaces/physical-mtu.conf
 *   - evo/interfaces/vlan-bridge.conf
 *
 * JVD service mapping:
 *   METRO_L3VPN_4075 (elan_evp-lan_evpn-elan_type-5.conf):
 *     PEs (Evo): AN3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG2 (ACX7509)
 *     PEs (Junos): MSE1 (MX304)
 *   evpn_group_60_4075 (elan_evp-lan_evpn-elan_type-5.conf):
 *     PEs (Evo): AN3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG2 (ACX7509)
 *     PEs (Junos): MSE1 (MX304)
 *
 * Variables:
 *   $AC_INTF        e.g. et-0/0/13
 *   $INSTANCE_NAME  e.g. evpn_group_60_4075
 *   $IRB_UNIT       e.g. 4075
 *   $RD_1           e.g. 10.0.0.2:14075
 *   $RD_2           e.g. 63000:13075
 *   $ROUTER_ID      e.g. 10.0.0.2
 *   $UNIT           e.g. 4075
 *   $VLAN           e.g. 4075
 *   $VRF_TARGET     e.g. 61535:14075
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
        route-distinguisher $RD_1;
        vrf-target target:$VRF_TARGET;
        vlans {
            V4000 {
                vlan-id $VLAN;
                interface $AC_INTF.$UNIT;
                l3-interface irb.$IRB_UNIT;
            }
        }
    }
    METRO_L3VPN_4075 {
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
        route-distinguisher $RD_2;
        vrf-import PS-METRO_L3VPN_4075-IMPORT;
        vrf-export PS-METRO_L3VPN_4075-EXPORT;
        vrf-table-label;
    }
}
```

## evo/services/evpn-elan-vlan-based.conf

```
/*
 * Topic:   Service instance: evpn elan vlan based (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Evo: AN2 (ACX5448), AN3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG2 (ACX7509)
 *
 * Highlights:
 *   - instance-type mac-vrf, service-type vlan-based (one C-VLAN per bridge domain)
 *   - EVPN-ELAN multipoint (BGP auto-discovery; each PE self-contained)
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-eswitch-color-blind.conf
 *   - evo/interfaces/vlan-bridge.conf
 *   - evo/interfaces/vlan-bridge-esi.conf
 *
 * Variables:
 *   $AC_INTF        e.g. ae11
 *   $BD_NAME        e.g. BD_evpn_group_90_4011
 *   $INSTANCE_NAME  e.g. evpn_group_90_4011
 *   $RD             e.g. 10.0.0.1:64011
 *   $UNIT           e.g. 4011
 *   $VRF_TARGET     e.g. 63535:64011
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
        route-distinguisher $RD;
        vrf-target target:$VRF_TARGET;
        vlans {
            $BD_NAME {
                vlan-id none;
                interface $AC_INTF.$UNIT;
            }
        }
    }
}
```

## evo/services/evpn-elan-vlan-bundle.conf

```
/*
 * Topic:   Service instance: evpn elan vlan bundle (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG2 (ACX7509)
 *
 * Highlights:
 *   - instance-type mac-vrf
 *   - MPLS encapsulation (SR-MPLS or LDP underlay)
 *   - RT-driven import/export
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-eswitch-color-blind.conf
 *   - evo/interfaces/physical-mtu.conf
 *   - evo/interfaces/vlan-bridge-bundle.conf
 *   - evo/interfaces/vlan-bridge-esi-bundle.conf
 *
 * JVD service mapping:
 *   evpn_group_80_4013 (elan_evp-lan_evpn-elan_bundle.conf):
 *     PEs (Evo): AN3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG2 (ACX7509)
 *
 * Variables:
 *   $AC_INTF        e.g. et-0/0/13
 *   $BD_NAME        e.g. BD_evpn_group_80_4013
 *   $INSTANCE_NAME  e.g. evpn_group_80_4013
 *   $RD             e.g. 10.0.0.2:4013
 *   $UNIT           e.g. 4013
 *   $VRF_TARGET     e.g. 63535:4013
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
        route-distinguisher $RD;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$VRF_TARGET;
        vlans {
            $BD_NAME {
                interface $AC_INTF.$UNIT;
            }
        }
    }
}
```

## evo/services/evpn-fxc-vlan-aware-1.conf

```
/*
 * Topic:   Service instance: evpn fxc vlan aware 1 (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MEG1 (ACX7100-32C), MEG2 (ACX7509), MA1.1 (ACX7024), MA1.2 (ACX7024)
 *
 * Highlights:
 *   - instance-type evpn-vpws
 *   - flexible-cross-connect-vlan-aware attachment circuit (per-UNI service-id)
 *   - RT-driven import/export
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/interfaces/vlan-ccc-vlan-map-esi-1-unit.conf
 *
 * Variables:
 *   $AC_INTF        e.g. ae67
 *   $INSTANCE_NAME  e.g. evpn_vpws_fxc_aware
 *   $LOCAL_VID      e.g. 1
 *   $RD             e.g. 10.0.0.6:5501
 *   $REMOTE_VID     e.g. 2
 *   $UNIT           e.g. 4001
 *   $VRF_TARGET     e.g. 63536:55100
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_INTF.$UNIT {
                    vpws-service-id {
                        local $LOCAL_VID;
                        remote $REMOTE_VID;
                    }
                }
                flexible-cross-connect-vlan-aware;
            }
        }
        interface $AC_INTF.$UNIT;
        route-distinguisher $RD;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$VRF_TARGET;
    }
}
```

## evo/services/evpn-fxc-vlan-aware.conf

```
/*
 * Topic:   Service instance: evpn fxc vlan aware (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MEG1 (ACX7100-32C), MEG2 (ACX7509), MA1.1 (ACX7024), MA1.2 (ACX7024)
 *
 * Highlights:
 *   - instance-type evpn-vpws
 *   - EVPN-VPWS attachment-circuit with local/remote service-id
 *   - RT-driven import/export
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/interfaces/vlan-ccc-vlan-map-esi-2-units.conf
 *
 * JVD service mapping:
 *   evpn_vpws_fxc_aware (eline_evpl_evpn-fxc_aware_mh.conf):
 *     A-A Multihoming: MEG1 (ACX7100-32C), MEG2 (ACX7509)
 *     A-A Multihoming: MA1.1 (ACX7024), MA1.2 (ACX7024)
 *
 * Variables:
 *   $AC_INTF        e.g. ae67
 *   $INSTANCE_NAME  e.g. evpn_vpws_fxc_aware
 *   $LOCAL_VID      e.g. 1
 *   $RD             e.g. 10.0.0.6:5501
 *   $REMOTE_VID     e.g. 2
 *   $UNIT_1         e.g. 4001
 *   $UNIT_2         e.g. 4002
 *   $VRF_TARGET     e.g. 63536:55100
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_INTF.$UNIT_1 {
                    vpws-service-id {
                        local $LOCAL_VID;
                        remote $REMOTE_VID;
                    }
                }
                interface $AC_INTF.$UNIT_2 {
                    vpws-service-id {
                        local $LOCAL_VID;
                        remote $REMOTE_VID;
                    }
                }
                flexible-cross-connect-vlan-aware;
            }
        }
        interface $AC_INTF.$UNIT_1;
        interface $AC_INTF.$UNIT_2;
        route-distinguisher $RD;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$VRF_TARGET;
    }
}
```

## evo/services/evpn-fxc-vlan-unaware-1.conf

```
/*
 * Topic:   Service instance: evpn fxc vlan unaware 1 (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - instance-type evpn-vpws
 *   - flexible-cross-connect-vlan-unaware group (one member per bundled UNI)
 *   - RT-driven import/export
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/interfaces/vlan-ccc-1-unit.conf
 *
 * Variables:
 *   $AC_INTF        e.g. et-0/0/13
 *   $INSTANCE_NAME  e.g. evpn_group_4007
 *   $LOCAL_VID      e.g. 1
 *   $RD             e.g. 10.0.0.2:40001
 *   $REMOTE_VID     e.g. 2
 *   $UNIT           e.g. 4007
 *   $VRF_TARGET     e.g. 63535:40001
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                flexible-cross-connect-vlan-unaware;
                group fxc {
                    interface $AC_INTF.$UNIT;
                    service-id {
                        local $LOCAL_VID;
                        remote $REMOTE_VID;
                    }
                }
            }
        }
        route-distinguisher $RD;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$VRF_TARGET;
    }
}
```

## evo/services/evpn-fxc-vlan-unaware.conf

```
/*
 * Topic:   Service instance: evpn fxc vlan unaware (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - instance-type evpn-vpws
 *   - RT-driven import/export
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-eswitch-color-blind.conf
 *   - evo/interfaces/physical-mtu.conf
 *   - evo/interfaces/vlan-ccc-2-units.conf
 *
 * JVD service mapping:
 *   evpn_group_4007 (eline_evpl_evpn-fxc_unaware_sh.conf):
 *     PEs (Evo): AN3 (ACX7100-48L)
 *     PEs (Junos): MSE1 (MX304)
 *
 * Variables:
 *   $AC_INTF        e.g. et-0/0/13
 *   $INSTANCE_NAME  e.g. evpn_group_4007
 *   $RD             e.g. 10.0.0.2:40001
 *   $UNIT_1         e.g. 4007
 *   $UNIT_2         e.g. 4008
 *   $VRF_TARGET     e.g. 63535:40001
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                flexible-cross-connect-vlan-unaware;
                group fxc {
                    interface $AC_INTF.$UNIT_1;
                    interface $AC_INTF.$UNIT_2;
                    service-id {
                        local 1;
                        remote 2;
                    }
                }
            }
        }
        route-distinguisher $RD;
        vrf-target target:$VRF_TARGET;
    }
}
```

## evo/services/evpn-vpws-lsw.conf

```
/*
 * Topic:   Service instance: evpn vpws lsw (MEF E-Access)
 *
 * Seen on:
 *   Evo: MA3 (ACX7100-48L)
 *
 * Highlights:
 *   - instance-type evpn-vpws
 *   - EVPN-VPWS attachment-circuit with local/remote service-id
 *   - RT-driven import/export
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/cos-binding-mpls.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/interfaces/vlan-ccc-qinq-stacked-qinq-tpid.conf
 *   - evo/interfaces/vlan-ccc-vlan-map-bundle-qinq-tpid.conf
 *
 * JVD service mapping:
 *   lsw_evpn_vpws_group_90_4082 (eaccess_evpn-vpws_lsw.conf):
 *     PEs (Evo): MA3 (ACX7100-48L)
 *
 * Variables:
 *   $AC_INTF_1      e.g. et-0/0/0
 *   $AC_INTF_2      e.g. et-0/0/51
 *   $INSTANCE_NAME  e.g. lsw_evpn_vpws_group_90_4082
 *   $LOCAL_VID      e.g. 22
 *   $RD             e.g. 10.0.0.15:4082
 *   $REMOTE_VID     e.g. 11
 *   $UNIT_1         e.g. 2500
 *   $UNIT_2         e.g. 4082
 *   $VRF_TARGET     e.g. 63533:4082
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_INTF_1.$UNIT_1 {
                    vpws-service-id {
                        local $LOCAL_VID;
                        remote $REMOTE_VID;
                    }
                }
                interface $AC_INTF_2.$UNIT_2 {
                    vpws-service-id {
                        local $LOCAL_VID;
                        remote $REMOTE_VID;
                    }
                }
                control-word;
            }
        }
        interface $AC_INTF_1.$UNIT_1;
        interface $AC_INTF_2.$UNIT_2;
        route-distinguisher $RD;
        vrf-target target:$VRF_TARGET;
    }
}
```

## evo/services/evpn-vpws-port-based.conf

```
/*
 * Topic:   Service instance: evpn vpws port based (MEF E-Line / EPL)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L), MA1.1 (ACX7024)
 *
 * Highlights:
 *   - instance-type evpn-vpws
 *   - EVPN-VPWS attachment-circuit with local/remote service-id
 *   - RT-driven import/export
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind-l2cp.conf
 *   - evo/interfaces/ethernet-ccc.conf
 *   - evo/interfaces/physical-mtu.conf
 *
 * JVD service mapping:
 *   MEF_EVPN_VPWS_PORT_BASED (eline_epl_evpn_vpws.conf):
 *     PEs (Evo): AN3 (ACX7100-48L), MA1.1 (ACX7024)
 *
 * Variables:
 *   $AC_INTF        e.g. et-0/0/13
 *   $INSTANCE_NAME  e.g. MEF_EVPN_VPWS_PORT_BASED
 *   $LOCAL_VID      e.g. 1
 *   $RD             e.g. 10.0.0.2:55555
 *   $REMOTE_VID     e.g. 2
 *   $UNIT           e.g. 0
 *   $VRF_TARGET     e.g. 63535:55555
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_INTF.$UNIT {
                    vpws-service-id {
                        local $LOCAL_VID;
                        remote $REMOTE_VID;
                    }
                }
            }
        }
        interface $AC_INTF.$UNIT;
        route-distinguisher $RD;
        vrf-target target:$VRF_TARGET;
    }
}
```

## evo/services/evpn-vpws-vlan-based-v2.conf

```
/*
 * Topic:   Service instance: evpn vpws vlan based (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L), MA1.1 (ACX7024), MA1.2 (ACX7024)
 *
 * Highlights:
 *   - instance-type evpn-vpws
 *   - EVPN-VPWS attachment-circuit with local/remote service-id
 *   - RT-driven import/export
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/interfaces/physical-mtu.conf
 *   - evo/interfaces/vlan-ccc-vlan-map-esi-2-units.conf
 *   - evo/interfaces/vlan-ccc-vlan-map-esi.conf
 *   - evo/interfaces/vlan-ccc-vlan-map.conf
 *
 * JVD service mapping:
 *   evpn_group_30_4009 (eline_evpl_evpn_vpws_mh_e2e.conf):
 *     A-A Multihoming: AN1 (MX204), AN2 (ACX5448), AN3 (ACX7100-48L)
 *     A-A Multihoming: MA1.1 (ACX7024), MA1.2 (ACX7024)
 *   evpn_group_20_4010 (eline_evpl_evpn_vpws_sh_fabric.conf):
 *     PEs (Evo): AN3 (ACX7100-48L)
 *     PEs (Junos): AN4 (ACX710)
 *
 * Variables:
 *   $AC_INTF        e.g. ae11
 *   $INSTANCE_NAME  e.g. evpn_group_30_4009
 *   $LOCAL_VID      e.g. 1
 *   $RD             e.g. 10.0.0.2:4999
 *   $REMOTE_VID     e.g. 2
 *   $UNIT           e.g. 4009
 *   $VRF_TARGET     e.g. 63535:4999
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_INTF.$UNIT {
                    vpws-service-id {
                        local $LOCAL_VID;
                        remote $REMOTE_VID;
                    }
                }
            }
        }
        interface $AC_INTF.$UNIT;
        route-distinguisher $RD;
        vrf-target target:$VRF_TARGET;
    }
}
```

## evo/services/evpn-vpws-vlan-based.conf

```
/*
 * Topic:   Service instance: evpn vpws vlan based (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG2 (ACX7509)
 *
 * Highlights:
 *   - instance-type evpn-vpws
 *   - EVPN-VPWS attachment-circuit with local/remote service-id
 *   - RT-driven import/export
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/interfaces/physical-mtu.conf
 *   - evo/interfaces/vlan-ccc-esi.conf
 *   - evo/interfaces/vlan-ccc.conf
 *
 * JVD service mapping:
 *   evpn_group_edge_4000 (eline_evpl_evpn_vpws_edge.conf):
 *     A-A Multihoming: MEG1 (ACX7100-32C), MEG2 (ACX7509)
 *     PEs (Evo): AN3 (ACX7100-48L)
 *
 * Variables:
 *   $AC_INTF        e.g. et-0/0/13
 *   $INSTANCE_NAME  e.g. evpn_group_edge_4000
 *   $LOCAL_VID      e.g. 1
 *   $RD             e.g. 10.0.0.2:33300
 *   $REMOTE_VID     e.g. 2
 *   $UNIT           e.g. 4000
 *   $VRF_TARGET     e.g. 63535:33300
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_INTF.$UNIT {
                    vpws-service-id {
                        local $LOCAL_VID;
                        remote $REMOTE_VID;
                    }
                }
            }
        }
        interface $AC_INTF.$UNIT;
        route-distinguisher $RD;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$VRF_TARGET;
    }
}
```

## evo/services/l2circuit-floating-pw.conf

```
/*
 * Topic:   Service instance: l2circuit floating pw (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MA1.2 (ACX7024)
 *
 * Highlights:
 *   - Static targeted-LDP L2-circuit pseudowire (no routing-instance required)
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/interfaces/vlan-ccc.conf
 *
 * JVD service mapping:
 *   l2circuit (eline_evpl_floating_pw.conf):
 *     PEs (Junos): MSE1 (MX304), MSE2 (MX304)
 *   l2ckt-vc10120 (eline_evpl_floating_pw.conf):
 *     PEs (Evo): MA1.2 (ACX7024)
 *     PEs (Junos): MSE1 (MX304), MSE2 (MX304)
 *
 * Variables:
 *   $AC_INTF       e.g. et-0/0/12
 *   $COLOR_COMM    e.g. CM-TC-MAP2GOLD
 *   $PW_LABEL_IN   e.g. 1000022
 *   $PW_LABEL_OUT  e.g. 1000022
 *   $PW_NEIGHBOR   e.g. 1.1.10.10
 *   $UNIT          e.g. 4004
 *   $VC_ID         e.g. 10120
 */
protocols {
    l2circuit {
        neighbor $PW_NEIGHBOR {
            interface $AC_INTF.$UNIT {
                static {
                    incoming-label $PW_LABEL_IN;
                    outgoing-label $PW_LABEL_OUT;
                }
                virtual-circuit-id $VC_ID;
                community $COLOR_COMM;
                encapsulation-type ethernet-vlan;
            }
        }
    }
}
```

## evo/services/l2circuit-hot-standby-backup.conf

```
/*
 * Topic:   Service instance: l2circuit hot standby backup (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: MEG1 (ACX7100-32C), MEG2 (ACX7509)
 *
 * Highlights:
 *   - Static targeted-LDP L2-circuit pseudowire (no routing-instance required)
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/interfaces/vlan-ccc-vlan-map.conf
 *
 * JVD service mapping:
 *   l2ckt-vc2006 (eline_evpl_l2ckt_hsb.conf):
 *     PEs (Evo): AN3 (ACX7100-48L), MEG1 (ACX7100-32C)
 *   l2ckt-vc3333 (eline_evpl_l2ckt_hsb.conf):
 *     PEs (Evo): AN3 (ACX7100-48L), MEG2 (ACX7509)
 *
 * Variables:
 *   $AC_INTF  e.g. et-0/0/28:2
 *   $UNIT     e.g. 4006
 *   $VC_ID    e.g. 2006
 */
protocols {
    l2circuit {
        neighbor 10.0.0.2 {
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
```

## evo/services/l2circuit-hot-standby-primary.conf

```
/*
 * Topic:   Service instance: l2circuit hot standby primary (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - Static targeted-LDP L2-circuit pseudowire (no routing-instance required)
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/interfaces/physical-mtu.conf
 *   - evo/interfaces/vlan-ccc-vlan-map.conf
 *
 * JVD service mapping:
 *   l2ckt-vc2006 (eline_evpl_l2ckt_hsb.conf):
 *     PEs (Evo): AN3 (ACX7100-48L), MEG1 (ACX7100-32C)
 *   l2ckt-vc3333 (eline_evpl_l2ckt_hsb.conf):
 *     PEs (Evo): AN3 (ACX7100-48L), MEG2 (ACX7509)
 *
 * Variables:
 *   $AC_INTF  e.g. et-0/0/13
 *   $UNIT     e.g. 4006
 *   $VC_ID_1  e.g. 2006
 *   $VC_ID_2  e.g. 3333
 */
protocols {
    l2circuit {
        neighbor 10.0.0.6 {
            interface $AC_INTF.$UNIT {
                virtual-circuit-id $VC_ID_1;
                control-word;
                flow-label-transmit;
                flow-label-receive;
                encapsulation-type ethernet-vlan;
                ignore-mtu-mismatch;
                pseudowire-status-tlv;
                backup-neighbor 10.0.0.7 {
                    virtual-circuit-id $VC_ID_2;
                    hot-standby;
                }
            }
        }
    }
}
```

## evo/services/l2circuit-lsw.conf

```
/*
 * Topic:   Service instance: l2circuit lsw (MEF E-Access)
 *
 * Seen on:
 *   Evo: MA3 (ACX7100-48L)
 *
 * Highlights:
 *   - Static targeted-LDP L2-circuit pseudowire (no routing-instance required)
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/cos-binding-mpls.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/interfaces/vlan-ccc-qinq-stacked-qinq-tpid.conf
 *   - evo/interfaces/vlan-ccc-vlan-map-bundle-qinq-tpid.conf
 *
 * JVD service mapping:
 *   l2ckt (eaccess_l2ckt_lsw.conf):
 *     PEs (Evo): MA3 (ACX7100-48L)
 *
 * Variables:
 *   $AC_INTF_1  e.g. et-0/0/0
 *   $AC_INTF_2  e.g. et-0/0/51
 *   $UNIT_1     e.g. 2500
 *   $UNIT_2     e.g. 4082
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

## evo/services/l2vpn-kompella-port-based.conf

```
/*
 * Topic:   Service instance: l2vpn kompella port based (MEF E-Line / EPL)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - instance-type l2vpn
 *   - no-control-word (matches remote PE)
 *   - RT-driven import/export
 *   - VPLS $SITE_ID is per-domain — use contiguous IDs across PEs (1,2,3,...)
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/interfaces/ethernet-ccc.conf
 *   - evo/interfaces/physical-mtu.conf
 *
 * JVD service mapping:
 *   MEF_L2VPN_PORT_BASED (eline_epl_l2vpn.conf):
 *     PEs (Evo): AN3 (ACX7100-48L)
 *     PEs (Junos): MA5 (MX204)
 *
 * Variables:
 *   $AC_INTF         e.g. et-0/0/13
 *   $INSTANCE_NAME   e.g. MEF_L2VPN_PORT_BASED
 *   $RD              e.g. 63535:110000
 *   $REMOTE_SITE_ID  e.g. 1119
 *   $SITE_ID         e.g. 1102
 *   $UNIT            e.g. 0
 *   $VRF_TARGET      e.g. 63535:100000
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type l2vpn;
        protocols {
            l2vpn {
                site r19 {
                    interface $AC_INTF.$UNIT {
                        remote-site-id $REMOTE_SITE_ID;
                    }
                    site-identifier $SITE_ID;
                }
                encapsulation-type ethernet;
                no-control-word;
                flow-label-transmit;
                flow-label-receive;
            }
        }
        interface $AC_INTF.$UNIT;
        route-distinguisher $RD;
        vrf-target target:$VRF_TARGET;
    }
}
```

## evo/services/l2vpn-kompella-vlan-based.conf

```
/*
 * Topic:   Service instance: l2vpn kompella vlan based (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Evo: AN3 (ACX7100-48L)
 *
 * Highlights:
 *   - instance-type l2vpn
 *   - no-control-word (matches remote PE)
 *   - RT-driven import/export
 *   - VPLS $SITE_ID is per-domain — use contiguous IDs across PEs (1,2,3,...)
 *
 * Pair with (same-device dependencies):
 *   - evo/cos/classifiers.conf
 *   - evo/cos/cos-binding-ieee8021p.conf
 *   - evo/cos/rewrite-rules.conf
 *   - evo/firewall/filter-ccc-color-blind.conf
 *   - evo/interfaces/physical-mtu.conf
 *   - evo/interfaces/vlan-ccc.conf
 *
 * JVD service mapping:
 *   l2vpn_group_200 (eline_evpl_l2vpn_e2e.conf):
 *     PEs (Evo): AN3 (ACX7100-48L)
 *     PEs (Junos): MA5 (MX204)
 *
 * Variables:
 *   $AC_INTF         e.g. et-0/0/13
 *   $INSTANCE_NAME   e.g. l2vpn_group_200
 *   $RD              e.g. 63535:102000
 *   $REMOTE_SITE_ID  e.g. 1119
 *   $SITE_ID         e.g. 1102
 *   $UNIT            e.g. 200
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type l2vpn;
        protocols {
            l2vpn {
                site r2 {
                    interface $AC_INTF.$UNIT {
                        remote-site-id $REMOTE_SITE_ID;
                    }
                    site-identifier $SITE_ID;
                }
                encapsulation-type ethernet-vlan;
                no-control-word;
            }
        }
        interface $AC_INTF.$UNIT;
        route-distinguisher $RD;
        vrf-target target:$RD;
    }
}
```

## junos/apply-groups/mef-testing.conf

```
/*
 * Topic:   Apply-group: mef testing (MEF E-LAN / EVP-LAN, E-Line / EVPL)
 *
 * Seen on:
 *   Junos: AN2 (ACX5448)
 *
 * Highlights:
 *   - Lab/test apply-group — staging-only knobs (not for production rollout)
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * Variables:
 *   (none)
 */
system {
    packet-forwarding-options {
        firewall-profile {
            mef-profile;
        }
    }
}
```

## junos/cos/classifiers.conf

```
/*
 * Topic:   Class-of-service: classifiers (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL, E-Tree / EVP-Tree)
 *
 * Seen on:
 *   Junos: MA5 (MX204), MSE1 (MX304), AN1 (MX204), AN2 (ACX5448), AN4 (ACX710), MSE2 (MX304), MA4 (MX204)
 *
 * Highlights:
 *   - Forwarding-class definitions / classifier mapping
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * Variables:
 *   (none)
 */
classifiers {
    dscp CL-DSCP {
        import default;
        forwarding-class FC-SIGNALING {
            loss-priority low code-points cs6;
            loss-priority high code-points cs5;
        }
        forwarding-class FC-LLQ {
            loss-priority low code-points [ cs4 af41 ];
            loss-priority medium-high code-points af42;
            loss-priority high code-points af43;
        }
        forwarding-class FC-REALTIME {
            loss-priority low code-points ef;
        }
        forwarding-class FC-HIGH {
            loss-priority low code-points [ cs3 af31 ];
            loss-priority medium-high code-points af32;
            loss-priority high code-points af33;
        }
        forwarding-class FC-CONTROL {
            loss-priority low code-points cs7;
        }
        forwarding-class FC-MEDIUM {
            loss-priority low code-points [ cs2 af21 ];
            loss-priority medium-high code-points af22;
            loss-priority high code-points af23;
        }
        forwarding-class FC-LOW {
            loss-priority low code-points [ cs1 af11 ];
            loss-priority medium-high code-points af12;
            loss-priority high code-points af13;
        }
        forwarding-class FC-BEST-EFFORT {
            loss-priority high code-points be;
        }
    }
    dscp-ipv6 CL-DSCP-IPV6 {
        import default;
        forwarding-class FC-SIGNALING {
            loss-priority low code-points cs6;
            loss-priority high code-points cs5;
        }
        forwarding-class FC-LLQ {
            loss-priority low code-points [ cs4 af41 ];
            loss-priority medium-high code-points af42;
            loss-priority high code-points af43;
        }
        forwarding-class FC-REALTIME {
            loss-priority low code-points ef;
        }
        forwarding-class FC-HIGH {
            loss-priority low code-points [ cs3 af31 ];
            loss-priority medium-high code-points af32;
            loss-priority high code-points af33;
        }
        forwarding-class FC-CONTROL {
            loss-priority low code-points cs7;
        }
        forwarding-class FC-MEDIUM {
            loss-priority low code-points [ cs2 af21 ];
            loss-priority medium-high code-points af22;
            loss-priority high code-points af23;
        }
        forwarding-class FC-LOW {
            loss-priority low code-points [ cs1 af11 ];
            loss-priority medium-high code-points af12;
            loss-priority high code-points af13;
        }
        forwarding-class FC-BEST-EFFORT {
            loss-priority high code-points be;
        }
    }
    exp CL-MPLS {
        import default;
        forwarding-class FC-SIGNALING {
            loss-priority low code-points 110;
        }
        forwarding-class FC-LLQ {
            loss-priority low code-points 100;
        }
        forwarding-class FC-REALTIME {
            loss-priority low code-points 101;
        }
        forwarding-class FC-HIGH {
            loss-priority low code-points 011;
        }
        forwarding-class FC-CONTROL {
            loss-priority low code-points 111;
        }
        forwarding-class FC-MEDIUM {
            loss-priority low code-points 010;
        }
        forwarding-class FC-LOW {
            loss-priority low code-points 001;
        }
        forwarding-class FC-BEST-EFFORT {
            loss-priority low code-points 000;
        }
    }
    ieee-802.1 CL-8021P {
        forwarding-class FC-HIGH {
            loss-priority low code-points [ 101 100 ];
        }
        forwarding-class FC-MEDIUM {
            loss-priority low code-points [ 011 010 ];
        }
        forwarding-class FC-LOW {
            loss-priority low code-points [ 001 000 ];
        }
    }
}
```

## junos/cos/cos-binding-ieee8021p.conf

```
/*
 * Topic:   Class-of-service: cos binding ieee8021p (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL, E-Tree / EVP-Tree)
 *
 * Seen on:
 *   Junos: MA5 (MX204), MSE1 (MX304), AN1 (MX204), AN2 (ACX5448), AN4 (ACX710), MSE2 (MX304), MA4 (MX204)
 *
 * Highlights:
 *   - L2 CE-facing CoS binding (classify + rewrite IEEE 802.1p)
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/forwarding-classes.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/cos/scheduler-map.conf
 *   - junos/cos/schedulers.conf
 *   - junos/cos/schedulers-an1.conf  (AN1 only)
 *
 * Variables:
 *   (none)
 */
interfaces {
    $AC_INTF {
        scheduler-map SM-5G-SCHEDULER;
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

```

## junos/cos/cos-binding-mpls.conf

```
/*
 * Topic:   Class-of-service: cos binding mpls (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL, E-Tree / EVP-Tree)
 *
 * Seen on:
 *   Junos: MA5 (MX204), MSE1 (MX304), AN1 (MX204), AN2 (ACX5448), AN4 (ACX710), MSE2 (MX304), MA4 (MX204)
 *
 * Highlights:
 *   - MPLS core-facing CoS binding (classify + rewrite EXP)
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/forwarding-classes.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/cos/scheduler-map.conf
 *   - junos/cos/schedulers.conf
 *   - junos/cos/schedulers-an1.conf  (AN1 only)
 *
 * Variables:
 *   (none)
 */
interfaces {
    $AC_INTF {
        scheduler-map SM-5G-SCHEDULER;
        unit $UNIT {
            classifiers {
                exp CL-MPLS;
            }
            rewrite-rules {
                exp RR-MPLS;
            }
        }
    }
}

```

## junos/cos/forwarding-classes.conf

```
/*
 * Topic:   Class-of-service: forwarding classes (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL, E-Tree / EVP-Tree)
 *
 * Seen on:
 *   Junos: MA5 (MX204), MSE1 (MX304), AN1 (MX204), AN2 (ACX5448), AN4 (ACX710), MSE2 (MX304), MA4 (MX204)
 *
 * Highlights:
 *   - Forwarding-class definitions / classifier mapping
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * Variables:
 *   (none)
 */
forwarding-classes {
    class FC-SIGNALING queue-num 7;
    class FC-LLQ queue-num 6;
    class FC-REALTIME queue-num 5;
    class FC-HIGH queue-num 4;
    class FC-CONTROL queue-num 3;
    class FC-MEDIUM queue-num 2;
    class FC-LOW queue-num 1;
    class FC-BEST-EFFORT queue-num 0;
}
```

## junos/cos/rewrite-rules.conf

```
/*
 * Topic:   Class-of-service: rewrite rules (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL, E-Tree / EVP-Tree)
 *
 * Seen on:
 *   Junos: MA5 (MX204), MSE1 (MX304), AN1 (MX204), AN2 (ACX5448), AN4 (ACX710), MSE2 (MX304), MA4 (MX204)
 *
 * Highlights:
 *   - Forwarding-class definitions / classifier mapping
 *   - Rewrite-rules for egress marking
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * Variables:
 *   (none)
 */
rewrite-rules {
    dscp RR-DSCP {
        forwarding-class FC-SIGNALING {
            loss-priority low code-point cs6;
            loss-priority high code-point cs5;
        }
        forwarding-class FC-LLQ {
            loss-priority low code-point af41;
            loss-priority medium-high code-point af42;
            loss-priority high code-point af43;
        }
        forwarding-class FC-REALTIME {
            loss-priority low code-point ef;
            loss-priority high code-point ef;
        }
        forwarding-class FC-HIGH {
            loss-priority low code-point af31;
            loss-priority medium-high code-point af32;
            loss-priority high code-point af33;
        }
        forwarding-class FC-CONTROL {
            loss-priority low code-point cs7;
            loss-priority high code-point cs7;
        }
        forwarding-class FC-MEDIUM {
            loss-priority low code-point af21;
            loss-priority medium-high code-point af22;
            loss-priority high code-point af23;
        }
        forwarding-class FC-LOW {
            loss-priority low code-point af11;
            loss-priority medium-high code-point af12;
            loss-priority high code-point af13;
        }
        forwarding-class FC-BEST-EFFORT {
            loss-priority low code-point be;
            loss-priority high code-point be;
        }
    }
    dscp-ipv6 RR-DSCP-IPV6 {
        forwarding-class FC-SIGNALING {
            loss-priority low code-point cs6;
            loss-priority high code-point cs5;
        }
        forwarding-class FC-LLQ {
            loss-priority low code-point af41;
            loss-priority medium-high code-point af42;
            loss-priority high code-point af43;
        }
        forwarding-class FC-REALTIME {
            loss-priority low code-point ef;
            loss-priority high code-point ef;
        }
        forwarding-class FC-HIGH {
            loss-priority low code-point af31;
            loss-priority medium-high code-point af32;
            loss-priority high code-point af33;
        }
        forwarding-class FC-CONTROL {
            loss-priority low code-point cs7;
            loss-priority high code-point cs7;
        }
        forwarding-class FC-MEDIUM {
            loss-priority low code-point af21;
            loss-priority medium-high code-point af22;
            loss-priority high code-point af23;
        }
        forwarding-class FC-LOW {
            loss-priority low code-point af11;
            loss-priority medium-high code-point af12;
            loss-priority high code-point af13;
        }
        forwarding-class FC-BEST-EFFORT {
            loss-priority low code-point be;
            loss-priority high code-point be;
        }
    }
    exp RR-MPLS {
        forwarding-class FC-SIGNALING {
            loss-priority low code-point 110;
            loss-priority high code-point 110;
        }
        forwarding-class FC-LLQ {
            loss-priority low code-point 100;
            loss-priority medium-high code-point 100;
            loss-priority high code-point 100;
        }
        forwarding-class FC-REALTIME {
            loss-priority low code-point 101;
            loss-priority high code-point 101;
        }
        forwarding-class FC-HIGH {
            loss-priority low code-point 011;
            loss-priority medium-high code-point 011;
            loss-priority high code-point 011;
        }
        forwarding-class FC-CONTROL {
            loss-priority low code-point 111;
            loss-priority high code-point 111;
        }
        forwarding-class FC-MEDIUM {
            loss-priority low code-point 010;
            loss-priority medium-high code-point 010;
            loss-priority high code-point 010;
        }
        forwarding-class FC-LOW {
            loss-priority low code-point 001;
            loss-priority medium-high code-point 001;
            loss-priority high code-point 001;
        }
        forwarding-class FC-BEST-EFFORT {
            loss-priority low code-point 000;
            loss-priority high code-point 000;
        }
    }
    ieee-802.1 RR-8021P {
        forwarding-class FC-HIGH {
            loss-priority low code-point 100;
        }
        forwarding-class FC-MEDIUM {
            loss-priority low code-point 010;
        }
        forwarding-class FC-LOW {
            loss-priority low code-point 000;
        }
    }
}
```

## junos/cos/scheduler-map.conf

```
/*
 * Topic:   Class-of-service: scheduler map (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL, E-Tree / EVP-Tree)
 *
 * Seen on:
 *   Junos: MA5 (MX204), MSE1 (MX304), AN1 (MX204), AN2 (ACX5448), AN4 (ACX710), MSE2 (MX304), MA4 (MX204)
 *
 * Highlights:
 *   - Scheduler-map binding queues to schedulers
 *   - Forwarding-class definitions / classifier mapping
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * Variables:
 *   (none)
 */
scheduler-maps {
    SM-5G-SCHEDULER {
        forwarding-class FC-SIGNALING scheduler SC-SIGNALING;
        forwarding-class FC-LLQ scheduler SC-LLQ;
        forwarding-class FC-REALTIME scheduler SC-REALTIME;
        forwarding-class FC-HIGH scheduler SC-HIGH;
        forwarding-class FC-CONTROL scheduler SC-CONTROL;
        forwarding-class FC-MEDIUM scheduler SC-MEDIUM;
        forwarding-class FC-LOW scheduler SC-LOW;
        forwarding-class FC-BEST-EFFORT scheduler SC-BEST-EFFORT;
    }
}
```

## junos/cos/schedulers-an1.conf

```
/*
 * Topic:   Class-of-service: schedulers (AN1 variant — shaping-rate + low-priority SC-HIGH)
 *
 * Seen on:
 *   Junos: AN1 (MX204)
 *
 * Highlights:
 *   - Per-queue scheduler shaping / buffer / priority
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/scheduler-map.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/cos-binding-mpls.conf
 *
 * Variables:
 *   (none)
 */
schedulers {
    SC-SIGNALING {
        shaping-rate percent 5;
        buffer-size percent 5;
        priority high;
    }
    SC-LLQ {
        shaping-rate percent 40;
        buffer-size percent 10;
        priority strict-high;
    }
    SC-REALTIME {
        shaping-rate percent 30;
        buffer-size percent 20;
        priority medium-high;
    }
    SC-HIGH {
        transmit-rate percent 40;
        buffer-size percent 20;
        priority low;
    }
    SC-CONTROL {
        shaping-rate percent 5;
        buffer-size percent 5;
        priority high;
    }
    SC-MEDIUM {
        transmit-rate percent 30;
        buffer-size percent 10;
        priority low;
    }
    SC-LOW {
        transmit-rate percent 20;
        buffer-size percent 10;
        priority low;
    }
    SC-BEST-EFFORT {
        transmit-rate {
            remainder;
        }
        buffer-size {
            remainder;
        }
        priority low;
    }
}
```

## junos/cos/schedulers-legacy-acx.conf

```
/*
 * Topic:   Class-of-service: schedulers legacy acx (MEF E-LAN / EVP-LAN, E-Line / EVPL)
 *
 * Seen on:
 *   Junos: AN2 (ACX5448), AN4 (ACX710)
 *
 * Highlights:
 *   - Per-queue scheduler shaping / buffer / priority
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * Variables:
 *   (none)
 */
schedulers {
    SC-SIGNALING {
        shaping-rate percent 5;
        buffer-size percent 5;
        priority low;
    }
    SC-LLQ {
        shaping-rate percent 40;
        buffer-size percent 10;
        priority strict-high;
    }
    SC-REALTIME {
        shaping-rate percent 30;
        buffer-size percent 20;
        priority low;
    }
    SC-HIGH {
        transmit-rate percent 40;
        buffer-size percent 30;
        priority low;
    }
    SC-CONTROL {
        shaping-rate percent 5;
        buffer-size percent 5;
        priority low;
    }
    SC-MEDIUM {
        transmit-rate percent 30;
        buffer-size percent 20;
        priority low;
    }
    SC-LOW {
        transmit-rate percent 20;
        buffer-size percent 10;
        priority low;
    }
    SC-BEST-EFFORT {
        transmit-rate {
            remainder;
        }
        buffer-size {
            remainder;
        }
        priority low;
    }
}
```

## junos/cos/schedulers.conf

```
/*
 * Topic:   Class-of-service: schedulers (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL, E-Tree / EVP-Tree)
 *
 * Seen on:
 *   Junos: MA5 (MX204), MSE1 (MX304), MSE2 (MX304), MA4 (MX204)
 *
 * Highlights:
 *   - Per-queue scheduler shaping / buffer / priority
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * Variables:
 *   (none)
 */
schedulers {
    SC-SIGNALING {
        transmit-rate percent 5;
        buffer-size percent 5;
        priority high;
    }
    SC-LLQ {
        shaping-rate percent 40;
        buffer-size percent 10;
        priority strict-high;
    }
    SC-REALTIME {
        transmit-rate percent 15;
        buffer-size percent 20;
        priority medium-high;
    }
    SC-HIGH {
        transmit-rate percent 10;
        buffer-size percent 20;
        priority high;
    }
    SC-CONTROL {
        transmit-rate percent 5;
        buffer-size percent 5;
        priority high;
    }
    SC-MEDIUM {
        transmit-rate percent 10;
        buffer-size percent 10;
        priority low;
    }
    SC-LOW {
        transmit-rate percent 10;
        buffer-size percent 10;
        priority low;
    }
    SC-BEST-EFFORT {
        transmit-rate {
            remainder;
        }
        buffer-size {
            remainder;
        }
        priority low;
    }
}
```

## junos/firewall/filter-bridge-color-aware-cf0.conf

```
/*
 * Topic:   Firewall: filter bridge color aware cf0 (MEF E-Access)
 *
 * Seen on:
 *   Junos: MA5 (MX204)
 *
 * Highlights:
 *   - family bridge filter (MX L2 bridging path)
 *   - Two-rate three-color marker (TrTCM, RFC 2698)
 *   - Color-aware policer (honors ingress loss-priority)
 *   - Coupling-flag = 0 behavior (explicitly discards yellow / medium-high)
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   Evo: MA3 (ACX7100-48L)
 *
 * Variables:
 *   $FILTER_NAME  e.g. f-vlan_based_fam_bridge
 */
firewall {
    family bridge {
        filter $FILTER_NAME {
            interface-specific;
            term high_class_discard {
                from {
                    learn-vlan-1p-priority [ 6 7 ];
                }
                then {
                    count pcp_6_7;
                    discard;
                }
            }
            term high_class {
                from {
                    learn-vlan-1p-priority 4;
                }
                then {
                    count high_pcp4;
                    loss-priority high;
                    next term;
                }
            }
            term color-envelop {
                from {
                    learn-vlan-1p-priority [ 5 4 ];
                }
                then {
                    three-color-policer {
                        two-rate high_policer;
                    }
                    count color-envelop;
                }
            }
            term medium_class-3 {
                from {
                    learn-vlan-1p-priority 3;
                }
                then {
                    three-color-policer {
                        two-rate medium_policer;
                    }
                    count med-3;
                    accept;
                }
            }
            term medium_class-2 {
                from {
                    learn-vlan-1p-priority 2;
                }
                then {
                    three-color-policer {
                        two-rate medium_policer;
                    }
                    count med-2;
                    next term;
                }
            }
            term CF0-yellow {
                from {
                    loss-priority medium-high;
                    learn-vlan-1p-priority 2;
                }
                then {
                    count CFO-yellow;
                    discard;
                }
            }
            term low_class {
                from {
                    learn-vlan-1p-priority [ 0 1 ];
                }
                then {
                    three-color-policer {
                        two-rate low_policer;
                    }
                    count low_class;
                }
            }
            term deault {
                then count default_traffic;
            }
        }
    }
    three-color-policer high_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-aware;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 3500000000;
            peak-burst-size 35125;
        }
    }
    three-color-policer low_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-aware;
            committed-information-rate 22k;
            committed-burst-size 1500;
            peak-information-rate 3500000000;
            peak-burst-size 35k;
        }
    }
    three-color-policer medium_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-aware;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 7g;
            peak-burst-size 70k;
        }
    }
}
```

## junos/firewall/filter-bridge-color-aware-l2cp.conf

```
/*
 * Topic:   Firewall: filter bridge color aware l2cp (MEF E-LAN / EP-LAN)
 *
 * Seen on:
 *   Junos: MA5 (MX204)
 *
 * Highlights:
 *   - family bridge filter (MX L2 bridging path)
 *   - Two-rate three-color marker (TrTCM, RFC 2698)
 *   - Color-aware policer (honors ingress loss-priority)
 *   - Coupling-flag = 1 behavior (MX/ACX default; yellow re-uses green budget)
 *   - Discards L2CP/BPDU destination-mac frames
 *   - Discards 802.1p priority 6/7 (reserved for network control)
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   Evo: AN3 (ACX7100-48L), MA1.2 (ACX7024)
 *
 * Variables:
 *   $FILTER_NAME  e.g. f_port_based_fam_bridge
 */
firewall {
    family bridge {
        filter $FILTER_NAME {
            interface-specific;
            term discard-l2cp {
                from {
                    destination-mac-address {
                        01:80:c2:00:00:07/48;
                        01:80:c2:00:00:0e/48;
                        01:80:c2:00:00:20/48;
                        01:80:c2:00:00:21/48;
                        01:80:c2:00:00:22/48;
                        01:80:c2:00:00:23/48;
                        01:80:c2:00:00:2a/48;
                        01:80:c2:00:00:2d/48;
                        01:80:c2:00:00:2e/48;
                        01:80:c2:00:00:2f/48;
                        01:80:c2:00:00:2b/48;
                        01:80:c2:00:00:24/48;
                        01:80:c2:00:00:25/48;
                        01:80:c2:00:00:26/48;
                        01:80:c2:00:00:27/48;
                        01:80:c2:00:00:28/48;
                        01:80:c2:00:00:29/48;
                        01:80:c2:00:00:2c/48;
                    }
                }
                then {
                    count l2cp_discard;
                    discard;
                }
            }
            term discard_pcp {
                from {
                    learn-vlan-1p-priority [ 6 7 ];
                }
                then {
                    count discard_pcp6_7;
                    discard;
                }
            }
            term high_class {
                from {
                    learn-vlan-1p-priority [ 5 4 ];
                }
                then {
                    three-color-policer {
                        two-rate high_policer;
                    }
                    count high_class;
                }
            }
            term medium_class {
                from {
                    learn-vlan-1p-priority [ 3 2 ];
                }
                then {
                    three-color-policer {
                        two-rate medium_policer;
                    }
                    count class_medium;
                }
            }
            term low_class {
                from {
                    learn-vlan-1p-priority [ 0 1 ];
                }
                then {
                    three-color-policer {
                        two-rate low_policer;
                    }
                    count class_low;
                }
            }
            term default {
                then {
                    three-color-policer {
                        two-rate high_policer;
                    }
                    count default;
                }
            }
        }
    }
    three-color-policer high_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-aware;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 3500000000;
            peak-burst-size 35125;
        }
    }
    three-color-policer low_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-aware;
            committed-information-rate 22k;
            committed-burst-size 1500;
            peak-information-rate 3500000000;
            peak-burst-size 35k;
        }
    }
    three-color-policer medium_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-aware;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 7g;
            peak-burst-size 70k;
        }
    }
}
```

## junos/firewall/filter-bridge-color-aware.conf

```
/*
 * Topic:   Firewall: filter bridge color aware (MEF E-Line / EVPL, E-Tree / EVP-Tree)
 *
 * Seen on:
 *   Junos: MA5 (MX204)
 *
 * Highlights:
 *   - family bridge filter (MX L2 bridging path)
 *   - Two-rate three-color marker (TrTCM, RFC 2698)
 *   - Color-aware policer (honors ingress loss-priority)
 *   - Coupling-flag = 1 behavior (MX/ACX default; yellow re-uses green budget)
 *   - Discards 802.1p priority 6/7 (reserved for network control)
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   Evo: MA1.2 (ACX7024)
 *   Junos: MSE1 (MX304), MSE2 (MX304), MA4 (MX204)
 *
 * Variables:
 *   $FILTER_NAME  e.g. f_vlan_based_fam_bridge_1
 */
firewall {
    family bridge {
        filter $FILTER_NAME {
            interface-specific;
            term discard_pcp {
                from {
                    learn-vlan-1p-priority [ 6 7 ];
                }
                then {
                    count discard_pcp6_7;
                    discard;
                }
            }
            term high_class {
                from {
                    learn-vlan-1p-priority [ 5 4 ];
                }
                then {
                    three-color-policer {
                        two-rate high_policer;
                    }
                    count high_class;
                }
            }
            term medium_class {
                from {
                    learn-vlan-1p-priority [ 3 2 ];
                }
                then {
                    three-color-policer {
                        two-rate medium_policer;
                    }
                    count class_medium;
                }
            }
            term low_class {
                from {
                    learn-vlan-1p-priority [ 0 1 ];
                }
                then {
                    three-color-policer {
                        two-rate low_policer;
                    }
                    count class_low;
                }
            }
            term default {
                then {
                    three-color-policer {
                        two-rate high_policer;
                    }
                    count default;
                }
            }
        }
    }
    three-color-policer high_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-aware;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 3500000000;
            peak-burst-size 35125;
        }
    }
    three-color-policer low_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-aware;
            committed-information-rate 22k;
            committed-burst-size 1500;
            peak-information-rate 3500000000;
            peak-burst-size 35k;
        }
    }
    three-color-policer medium_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-aware;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 7g;
            peak-burst-size 70k;
        }
    }
}
```

## junos/firewall/filter-bridge-color-blind.conf

```
/*
 * Topic:   Firewall: filter bridge color blind (MEF E-LAN / EVP-LAN, E-Line / EVPL, E-Tree / EVP-Tree)
 *
 * Seen on:
 *   Junos: MSE1 (MX304), AN1 (MX204), MSE2 (MX304), MA4 (MX204)
 *
 * Highlights:
 *   - family bridge filter (MX L2 bridging path)
 *   - Two-rate three-color marker (TrTCM, RFC 2698)
 *   - Color-blind policer (ignores ingress loss-priority)
 *   - Discards 802.1p priority 6/7 (reserved for network control)
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   Evo: AN3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG2 (ACX7509), MEG1 (ACX7509), MA1.1 (ACX7024), MA1.2 (ACX7024)
 *   Junos: AN2 (ACX5448), MA5 (MX204)
 *
 * Variables:
 *   $FILTER_NAME  e.g. f_elan-evpn
 */
firewall {
    family bridge {
        filter $FILTER_NAME {
            interface-specific;
            term discard_pcp {
                from {
                    learn-vlan-1p-priority [ 6 7 ];
                }
                then {
                    count discard_pcp6_7;
                    discard;
                }
            }
            term high_class {
                from {
                    learn-vlan-1p-priority [ 5 4 ];
                }
                then {
                    three-color-policer {
                        two-rate high_policer;
                    }
                    count high_class;
                }
            }
            term medium_class {
                from {
                    learn-vlan-1p-priority [ 3 2 ];
                }
                then {
                    three-color-policer {
                        two-rate medium_policer;
                    }
                    count class_medium;
                }
            }
            term low_class {
                from {
                    learn-vlan-1p-priority [ 0 1 ];
                }
                then {
                    three-color-policer {
                        two-rate low_policer;
                    }
                    count class_low;
                }
            }
            term default {
                then {
                    three-color-policer {
                        two-rate high_policer;
                    }
                    count default;
                }
            }
        }
    }
    three-color-policer high_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 3500000000;
            peak-burst-size 35125;
        }
    }
    three-color-policer low_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 22k;
            committed-burst-size 1500;
            peak-information-rate 3500000000;
            peak-burst-size 35k;
        }
    }
    three-color-policer medium_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 7g;
            peak-burst-size 70k;
        }
    }
}
```

## junos/firewall/filter-ccc-color-aware-l2cp.conf

```
/*
 * Topic:   Firewall: filter ccc color aware l2cp (MEF E-Line / EPL)
 *
 * Seen on:
 *   Junos: MA5 (MX204)
 *
 * Highlights:
 *   - family ccc filter (L2 L2CP/PCP handling for CCC)
 *   - Two-rate three-color marker (TrTCM, RFC 2698)
 *   - Color-aware policer (honors ingress loss-priority)
 *   - Coupling-flag = 1 behavior (MX/ACX default; yellow re-uses green budget)
 *   - Discards L2CP/BPDU destination-mac frames
 *   - Discards 802.1p priority 6/7 (reserved for network control)
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   Evo: AN3 (ACX7100-48L)
 *
 * Variables:
 *   $FILTER_NAME  e.g. f_port_based_fam_ccc
 */
firewall {
    family ccc {
        filter $FILTER_NAME {
            interface-specific;
            term discard-l2cp {
                from {
                    destination-mac-address {
                        01:80:c2:00:00:07/48;
                        01:80:c2:00:00:0e/48;
                        01:80:c2:00:00:20/48;
                        01:80:c2:00:00:21/48;
                        01:80:c2:00:00:22/48;
                        01:80:c2:00:00:23/48;
                        01:80:c2:00:00:2a/48;
                        01:80:c2:00:00:2d/48;
                        01:80:c2:00:00:2e/48;
                        01:80:c2:00:00:2f/48;
                        01:80:c2:00:00:2b/48;
                        01:80:c2:00:00:24/48;
                        01:80:c2:00:00:25/48;
                        01:80:c2:00:00:26/48;
                        01:80:c2:00:00:27/48;
                        01:80:c2:00:00:28/48;
                        01:80:c2:00:00:29/48;
                        01:80:c2:00:00:2c/48;
                    }
                }
                then {
                    count l2cp_discard;
                    discard;
                }
            }
            term discard_pcp {
                from {
                    learn-vlan-1p-priority [ 6 7 ];
                }
                then {
                    count discard_pcp6_7;
                    discard;
                }
            }
            term high_class {
                from {
                    learn-vlan-1p-priority [ 5 4 ];
                }
                then {
                    three-color-policer {
                        two-rate high_policer;
                    }
                    count high_class;
                }
            }
            term medium_class {
                from {
                    learn-vlan-1p-priority [ 3 2 ];
                }
                then {
                    three-color-policer {
                        two-rate medium_policer;
                    }
                    count class_medium;
                }
            }
            term low_class {
                from {
                    learn-vlan-1p-priority [ 0 1 ];
                }
                then {
                    three-color-policer {
                        two-rate low_policer;
                    }
                    count class_low;
                }
            }
            term default {
                then {
                    three-color-policer {
                        two-rate low_policer;
                    }
                    count default;
                }
            }
        }
    }
    three-color-policer high_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-aware;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 3500000000;
            peak-burst-size 35125;
        }
    }
    three-color-policer low_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-aware;
            committed-information-rate 22k;
            committed-burst-size 1500;
            peak-information-rate 3500000000;
            peak-burst-size 35k;
        }
    }
    three-color-policer medium_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-aware;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 7g;
            peak-burst-size 70k;
        }
    }
}
```

## junos/firewall/filter-ccc-color-aware.conf

```
/*
 * Topic:   Firewall: filter ccc color aware (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Junos: MA5 (MX204)
 *
 * Highlights:
 *   - family ccc filter (L2 L2CP/PCP handling for CCC)
 *   - Two-rate three-color marker (TrTCM, RFC 2698)
 *   - Color-aware policer (honors ingress loss-priority)
 *   - Coupling-flag = 1 behavior (MX/ACX default; yellow re-uses green budget)
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   Evo: AN3 (ACX7100-48L)
 *
 * Variables:
 *   $FILTER_NAME  e.g. f_vlan-based_fam_ccc
 */
firewall {
    family ccc {
        filter $FILTER_NAME {
            interface-specific;
            term high_class {
                from {
                    learn-vlan-1p-priority [ 5 4 ];
                }
                then {
                    three-color-policer {
                        two-rate high_policer;
                    }
                    count high_class;
                }
            }
            term medium_class {
                from {
                    learn-vlan-1p-priority [ 3 2 ];
                }
                then {
                    three-color-policer {
                        two-rate medium_policer;
                    }
                    count class_medium;
                }
            }
            term low_class {
                from {
                    learn-vlan-1p-priority [ 0 1 ];
                }
                then {
                    three-color-policer {
                        two-rate low_policer;
                    }
                    count class_low;
                }
            }
            term default {
                then {
                    three-color-policer {
                        two-rate low_policer;
                    }
                    count default;
                }
            }
        }
    }
    three-color-policer high_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-aware;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 3500000000;
            peak-burst-size 35125;
        }
    }
    three-color-policer low_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-aware;
            committed-information-rate 22k;
            committed-burst-size 1500;
            peak-information-rate 3500000000;
            peak-burst-size 35k;
        }
    }
    three-color-policer medium_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-aware;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 7g;
            peak-burst-size 70k;
        }
    }
}
```

## junos/firewall/filter-ccc-color-blind-v2.conf

```
/*
 * Topic:   Firewall: filter ccc color blind (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Junos: AN2 (ACX5448)
 *
 * Highlights:
 *   - family ccc filter (L2 L2CP/PCP handling for CCC)
 *   - Two-rate three-color marker (TrTCM, RFC 2698)
 *   - Color-blind policer (ignores ingress loss-priority)
 *   - Discards 802.1p priority 6/7 (reserved for network control)
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   Evo: AN3 (ACX7100-48L), MA1.1 (ACX7024), MA1.2 (ACX7024)
 *   Junos: AN1 (MX204)
 *
 * Variables:
 *   $FILTER_NAME  e.g. f_eline-evpn-vpws
 */
firewall {
    family ccc {
        filter $FILTER_NAME {
            interface-specific;
            term discard_pcp {
                from {
                    learn-vlan-1p-priority [ 6 7 ];
                }
                then {
                    count discard_pcp6_7;
                    discard;
                }
            }
            term high_class {
                from {
                    learn-vlan-1p-priority [ 5 4 ];
                }
                then {
                    three-color-policer {
                        two-rate high_policer;
                    }
                    count high_class;
                }
            }
            term medium_class {
                from {
                    learn-vlan-1p-priority [ 3 2 ];
                }
                then {
                    three-color-policer {
                        two-rate medium_policer;
                    }
                    count class_medium;
                }
            }
            term low_class {
                from {
                    learn-vlan-1p-priority [ 0 1 ];
                }
                then {
                    three-color-policer {
                        two-rate low_policer;
                    }
                    count class_low;
                }
            }
            term default {
                then {
                    three-color-policer {
                        two-rate high_policer;
                    }
                    count default;
                }
            }
        }
    }
    three-color-policer high_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 10k;
            peak-information-rate 3500000000;
            peak-burst-size 10125;
        }
    }
    three-color-policer low_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 22k;
            committed-burst-size 125;
            peak-information-rate 3500000000;
            peak-burst-size 20k;
        }
    }
    three-color-policer medium_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 10k;
            peak-information-rate 7g;
            peak-burst-size 20k;
        }
    }
}
```

## junos/firewall/filter-ccc-color-blind-v3.conf

```
/*
 * Topic:   Firewall: filter ccc color blind (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Junos: AN4 (ACX710)
 *
 * Highlights:
 *   - family ccc filter (L2 L2CP/PCP handling for CCC)
 *   - Two-rate three-color marker (TrTCM, RFC 2698)
 *   - Color-blind policer (ignores ingress loss-priority)
 *   - Discards 802.1p priority 6/7 (reserved for network control)
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   Evo: AN3 (ACX7100-48L)
 *
 * Variables:
 *   $FILTER_NAME  e.g. f_vlan-based_fam_ccc
 */
firewall {
    family ccc {
        filter $FILTER_NAME {
            interface-specific;
            term discard_pcp {
                from {
                    learn-vlan-1p-priority [ 6 7 ];
                }
                then {
                    count discard_pcp6_7;
                    discard;
                }
            }
            term high_class {
                from {
                    learn-vlan-1p-priority [ 5 4 ];
                }
                then {
                    three-color-policer {
                        two-rate high_policer;
                    }
                    count high_class;
                }
            }
            term medium_class {
                from {
                    learn-vlan-1p-priority [ 3 2 ];
                }
                then {
                    three-color-policer {
                        two-rate medium_policer;
                    }
                    count class_medium;
                }
            }
            term low_class {
                from {
                    learn-vlan-1p-priority [ 0 1 ];
                }
                then {
                    three-color-policer {
                        two-rate low_policer;
                    }
                    count class_low;
                }
            }
            term default {
                then {
                    three-color-policer {
                        two-rate high_policer;
                    }
                    count default;
                }
            }
        }
    }
    three-color-policer high_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 3500000000;
            peak-burst-size 35125;
        }
    }
    three-color-policer low_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 22k;
            committed-burst-size 125;
            peak-information-rate 3500000000;
            peak-burst-size 35k;
        }
    }
    three-color-policer medium_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 7g;
            peak-burst-size 70k;
        }
    }
}
```

## junos/firewall/filter-ccc-color-blind.conf

```
/*
 * Topic:   Firewall: filter ccc color blind (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Junos: MSE1 (MX304), AN1 (MX204)
 *
 * Highlights:
 *   - family ccc filter (L2 L2CP/PCP handling for CCC)
 *   - Two-rate three-color marker (TrTCM, RFC 2698)
 *   - Color-blind policer (ignores ingress loss-priority)
 *   - Discards 802.1p priority 6/7 (reserved for network control)
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   Evo: AN3 (ACX7100-48L), MA1.1 (ACX7024), MA1.2 (ACX7024)
 *   Junos: AN2 (ACX5448)
 *
 * Variables:
 *   $FILTER_NAME  e.g. f_vlan_based_fam_bridge
 */
firewall {
    family ccc {
        filter $FILTER_NAME {
            interface-specific;
            term discard_pcp {
                from {
                    learn-vlan-1p-priority [ 6 7 ];
                }
                then {
                    count discard_pcp6_7;
                    discard;
                }
            }
            term high_class {
                from {
                    learn-vlan-1p-priority [ 5 4 ];
                }
                then {
                    three-color-policer {
                        two-rate high_policer;
                    }
                    count high_class;
                }
            }
            term medium_class {
                from {
                    learn-vlan-1p-priority [ 3 2 ];
                }
                then {
                    three-color-policer {
                        two-rate medium_policer;
                    }
                    count class_medium;
                }
            }
            term low_class {
                from {
                    learn-vlan-1p-priority [ 0 1 ];
                }
                then {
                    three-color-policer {
                        two-rate low_policer;
                    }
                    count class_low;
                }
            }
            term default {
                then {
                    three-color-policer {
                        two-rate high_policer;
                    }
                    count default;
                }
            }
        }
    }
    three-color-policer high_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 3500000000;
            peak-burst-size 35125;
        }
    }
    three-color-policer low_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 22k;
            committed-burst-size 1500;
            peak-information-rate 3500000000;
            peak-burst-size 35k;
        }
    }
    three-color-policer medium_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 35k;
            peak-information-rate 7g;
            peak-burst-size 70k;
        }
    }
}
```

## junos/firewall/filter-eswitch-color-blind.conf

```
/*
 * Topic:   Firewall: filter eswitch color blind (MEF E-LAN / EVP-LAN, E-Line / EVPL)
 *
 * Seen on:
 *   Junos: AN2 (ACX5448)
 *
 * Highlights:
 *   - family ethernet-switching filter (Junos/ACX L2 switching path)
 *   - Two-rate three-color marker (TrTCM, RFC 2698)
 *   - Color-blind policer (ignores ingress loss-priority)
 *   - Discards 802.1p priority 6/7 (reserved for network control)
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   Evo: AN3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG1 (ACX7509), MA1.1 (ACX7024), MA1.2 (ACX7024)
 *   Junos: AN1 (MX204)
 *
 * Variables:
 *   $FILTER_NAME  e.g. f_elan-evpn
 */
firewall {
    family ethernet-switching {
        filter $FILTER_NAME {
            interface-specific;
            term discard_pcp {
                from {
                    learn-vlan-1p-priority [ 6 7 ];
                }
                then {
                    discard;
                    count discard_pcp6_7;
                }
            }
            term high_class {
                from {
                    learn-vlan-1p-priority [ 5 4 ];
                }
                then {
                    count high_class;
                    three-color-policer {
                        two-rate high_policer;
                    }
                }
            }
            term medium_class {
                from {
                    learn-vlan-1p-priority [ 3 2 ];
                }
                then {
                    count class_medium;
                    three-color-policer {
                        two-rate medium_policer;
                    }
                }
            }
            term low_class {
                from {
                    learn-vlan-1p-priority [ 0 1 ];
                }
                then {
                    count class_low;
                    three-color-policer {
                        two-rate low_policer;
                    }
                }
            }
            term default {
                then {
                    count default;
                    three-color-policer {
                        two-rate high_policer;
                    }
                }
            }
        }
    }
    three-color-policer high_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 10k;
            peak-information-rate 3500000000;
            peak-burst-size 10125;
        }
    }
    three-color-policer low_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 22k;
            committed-burst-size 125;
            peak-information-rate 3500000000;
            peak-burst-size 20k;
        }
    }
    three-color-policer medium_policer {
        action {
            loss-priority high then discard;
        }
        two-rate {
            color-blind;
            committed-information-rate 3500000000;
            committed-burst-size 10k;
            peak-information-rate 7g;
            peak-burst-size 20k;
        }
    }
}
```

## junos/interfaces/ethernet-bridge.conf

```
/*
 * Topic:   Interface: ethernet bridge (MEF E-LAN / EP-LAN)
 *
 * Seen on:
 *   Junos: MA5 (MX204)
 *
 * Highlights:
 *   - encapsulation ethernet-bridge
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/firewall/filter-bridge-color-aware-l2cp.conf
 *   - junos/services/evpn-elan.conf
 *
 * Variables:
 *   $AC_INTF  e.g. xe-0/1/0
 *   $MTU      e.g. 9192
 *   $UNIT     e.g. 0
 */
$AC_INTF {
    mtu $MTU;
    encapsulation ethernet-bridge;
    unit $UNIT {
        family bridge {
            filter {
                input f_port_based_fam_bridge;
            }
        }
    }
}
```

## junos/interfaces/ethernet-ccc.conf

```
/*
 * Topic:   Interface: ethernet ccc (MEF E-Line / EPL)
 *
 * Seen on:
 *   Junos: MA5 (MX204)
 *
 * Highlights:
 *   - encapsulation ethernet-ccc
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/firewall/filter-ccc-color-aware-l2cp.conf
 *   - junos/services/l2vpn-kompella-port-based.conf
 *
 * Variables:
 *   $AC_INTF  e.g. xe-0/1/0
 *   $UNIT     e.g. 0
 */
$AC_INTF {
    encapsulation ethernet-ccc;
    unit $UNIT {
        family ccc {
            filter {
                input f_port_based_fam_ccc;
            }
        }
    }
}
```

## junos/interfaces/irb-l3.conf

```
/*
 * Topic:   Interface: irb l3 (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Junos: MSE1 (MX304)
 *
 * Highlights:
 *   - IRB unit for L3 termination
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * Variables:
 *   $IP_ADDRESS  e.g. 192.0.2.1/27
 *   $UNIT        e.g. 4075
 */
irb {
    unit $UNIT {
        family inet {
            address $IP_ADDRESS;
        }
    }
}
```

## junos/interfaces/pseudowire-subscriber.conf

```
/*
 * Topic:   Interface: pseudowire subscriber (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Junos: MSE1 (MX304), MSE2 (MX304)
 *
 * Highlights:
 *   - encapsulation flexible-ethernet-services
 *   - ESI multihoming
 *
 * Pair with (same-device dependencies):
 *   - junos/services/evpn-elan-vlan-based-floating-pw.conf
 *   - junos/services/l2circuit-floating-pw.conf
 *
 * Variables:
 *   $PS_ANCHOR     e.g. lt-0/0/0
 *   $PS_SERVICE    e.g. 4004
 *   $PS_TRANSPORT  e.g. ps22
 *   $VESI_ID       e.g. 00:11:11:11:44:11:11:30:02:0a
 *   $VLAN          e.g. 4004
 */
$PS_TRANSPORT {
    anchor-point {
        $PS_ANCHOR;
    }
    vlan-tagging;
    encapsulation flexible-ethernet-services;
    unit 0 {
        encapsulation ethernet-ccc;
    }
    unit $PS_SERVICE {
        encapsulation vlan-bridge;
        vlan-id $VLAN;
        esi {
            $VESI_ID;
            all-active;
        }
    }
}
```

## junos/interfaces/vlan-bridge-esi-etree-root.conf

```
/*
 * Topic:   Interface: vlan bridge esi etree root (MEF E-Tree / EVP-Tree)
 *
 * Seen on:
 *   Junos: MSE1 (MX304), MSE2 (MX304)
 *
 * Highlights:
 *   - encapsulation vlan-bridge
 *   - ESI multihoming
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/cos-binding-mpls.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/services/evpn-etree-vlan-based.conf
 *
 * Variables:
 *   $AC_INTF  e.g. ae10
 *   $ESI_ID   e.g. 00:10:11:11:40:80:01:62:00:01
 *   $UNIT     e.g. 4080
 *   $VLAN     e.g. 4080
 */
$AC_INTF {
    unit $UNIT {
        encapsulation vlan-bridge;
        vlan-id $VLAN;
        esi {
            $ESI_ID;
            all-active;
        }
        family bridge {
            filter {
                input f_vlan_based_fam_bridge;
            }
        }
        etree-ac-role root;
    }
}
```

## junos/interfaces/vlan-bridge-esi-v2.conf

```
/*
 * Topic:   Interface: vlan bridge esi (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Junos: AN2 (ACX5448)
 *
 * Highlights:
 *   - encapsulation vlan-bridge
 *   - ESI multihoming
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/services/evpn-elan-port-based.conf
 *
 * Variables:
 *   $AC_INTF  e.g. ae11
 *   $ESI_ID   e.g. 00:70:11:40:11:11:11:00:00:64
 *   $UNIT     e.g. 4011
 *   $VLAN     e.g. 4011
 */
$AC_INTF {
    unit $UNIT {
        encapsulation vlan-bridge;
        vlan-id $VLAN;
        esi {
            $ESI_ID;
            all-active;
        }
    }
}
```

## junos/interfaces/vlan-bridge-esi-v3.conf

```
/*
 * Topic:   Interface: vlan bridge esi (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Junos: MSE1 (MX304), MSE2 (MX304)
 *
 * Highlights:
 *   - encapsulation vlan-bridge
 *   - ESI multihoming
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/cos-binding-mpls.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/services/evpn-elan-vlan-based-floating-pw.conf
 *
 * Variables:
 *   $AC_INTF  e.g. ae10
 *   $ESI_ID   e.g. 00:11:11:11:11:44:11:30:01:0a
 *   $UNIT     e.g. 4004
 *   $VLAN     e.g. 4004
 */
$AC_INTF {
    unit $UNIT {
        encapsulation vlan-bridge;
        vlan-id $VLAN;
        esi {
            $ESI_ID;
            all-active;
        }
        family bridge {
            filter {
                input f_vlan_based_fam_bridge;
            }
        }
    }
}
```

## junos/interfaces/vlan-bridge-esi.conf

```
/*
 * Topic:   Interface: vlan bridge esi (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Junos: AN1 (MX204)
 *
 * Highlights:
 *   - encapsulation vlan-bridge
 *   - ESI multihoming
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/services/evpn-elan-port-based.conf
 *
 * Variables:
 *   $AC_INTF  e.g. ae11
 *   $ESI_ID   e.g. 00:70:11:40:11:11:11:00:00:64
 *   $UNIT     e.g. 4011
 *   $VLAN     e.g. 4011
 */
$AC_INTF {
    unit $UNIT {
        encapsulation vlan-bridge;
        vlan-id $VLAN;
        esi {
            $ESI_ID;
            all-active;
        }
        family bridge {
            filter {
                input f_elan-evpn;
            }
        }
    }
}
```

## junos/interfaces/vlan-bridge-etree-leaf.conf

```
/*
 * Topic:   Interface: vlan bridge etree leaf (MEF E-Tree / EVP-Tree)
 *
 * Seen on:
 *   Junos: MA4 (MX204), MA5 (MX204)
 *
 * Highlights:
 *   - encapsulation flexible-ethernet-services
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/firewall/filter-bridge-color-aware.conf
 *   - junos/services/evpn-etree-vlan-based.conf
 *
 * Variables:
 *   $AC_INTF  e.g. xe-0/1/5
 *   $MTU      e.g. 9102
 *   $UNIT     e.g. 4080
 *   $VLAN     e.g. 4080
 */
$AC_INTF {
    flexible-vlan-tagging;
    mtu $MTU;
    encapsulation flexible-ethernet-services;
    unit $UNIT {
        encapsulation vlan-bridge;
        vlan-id $VLAN;
        family bridge {
            filter {
                input f_vlan_based_fam_bridge;
            }
        }
        etree-ac-role leaf;
    }
}
```

## junos/interfaces/vlan-bridge-etree-root.conf

```
/*
 * Topic:   Interface: vlan bridge etree root (MEF E-Tree / EVP-Tree)
 *
 * Seen on:
 *   Junos: MSE1 (MX304), MSE2 (MX304)   [single-homed variant of the MH root]
 *
 * Highlights:
 *   - encapsulation vlan-bridge
 *   - etree-ac-role root (single-homed — no ESI)
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/firewall/filter-bridge-color-blind.conf
 *   - junos/services/evpn-etree-vlan-based.conf
 *
 * Variables:
 *   $AC_INTF  e.g. ae10
 *   $UNIT     e.g. 4080
 *   $VLAN     e.g. 4080
 */
$AC_INTF {
    unit $UNIT {
        encapsulation vlan-bridge;
        vlan-id $VLAN;
        family bridge {
            filter {
                input f_vlan_based_fam_bridge;
            }
        }
        etree-ac-role root;
    }
}
```

## junos/interfaces/vlan-bridge-qinq-stacked-v2.conf

```
/*
 * Topic:   Interface: vlan bridge qinq stacked (MEF E-Access)
 *
 * Seen on:
 *   Junos: MA5 (MX204)
 *
 * Highlights:
 *   - encapsulation flexible-ethernet-services
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/firewall/filter-bridge-color-aware-cf0.conf
 *   - junos/services/bridge-domain-lsw.conf
 *
 * Variables:
 *   $AC_INTF         e.g. xe-0/1/0
 *   $MTU             e.g. 9102
 *   $OUTER_VID_TPID  e.g. 0x88a8.4082
 *   $UNIT            e.g. 4082
 */
$AC_INTF {
    flexible-vlan-tagging;
    mtu $MTU;
    encapsulation flexible-ethernet-services;
    gigether-options {
        ethernet-switch-profile {
            tag-protocol-id [ 0x8100 0x88A8 ];
        }
    }
    unit $UNIT {
        encapsulation vlan-bridge;
        vlan-tags outer $OUTER_VID_TPID;
        family bridge {
            filter {
                input f-vlan_based_fam_bridge;
            }
        }
    }
}
```

## junos/interfaces/vlan-bridge-qinq-stacked.conf

```
/*
 * Topic:   Interface: vlan bridge qinq stacked (MEF E-Access)
 *
 * Seen on:
 *   Junos: MA5 (MX204)
 *
 * Highlights:
 *   - encapsulation vlan-bridge
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/cos-binding-mpls.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/services/bridge-domain-lsw.conf
 *
 * Variables:
 *   $AC_INTF         e.g. et-0/0/2
 *   $MTU             e.g. 9102
 *   $OUTER_VID_TPID  e.g. 0x88a8.4082
 *   $UNIT            e.g. 4082
 */
$AC_INTF {
    mtu $MTU;
    gigether-options {
        ethernet-switch-profile {
            tag-protocol-id [ 0x8100 0x88A8 ];
        }
    }
    unit $UNIT {
        encapsulation vlan-bridge;
        vlan-tags outer $OUTER_VID_TPID;
    }
}
```

## junos/interfaces/vlan-bridge.conf

```
/*
 * Topic:   Interface: vlan bridge (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Junos: MA5 (MX204)
 *
 * Highlights:
 *   - encapsulation flexible-ethernet-services
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/firewall/filter-bridge-color-aware.conf
 *   - junos/services/bgp-vpls-p2p.conf
 *
 * Variables:
 *   $AC_INTF  e.g. xe-0/1/0
 *   $UNIT     e.g. 4005
 *   $VLAN     e.g. 4005
 */
$AC_INTF {
    vlan-tagging;
    encapsulation flexible-ethernet-services;
    unit $UNIT {
        encapsulation vlan-bridge;
        vlan-id $VLAN;
        family bridge {
            filter {
                input f_vlan_based_fam_bridge_1;
            }
        }
    }
}
```

## junos/interfaces/vlan-ccc-1-unit-list-push.conf

```
/*
 * Topic:   Interface: vlan ccc 1 unit vlan-id-list + S-VLAN push (MEF E-Line / EVPL) — EVPN-FXC member
 *
 * Seen on:
 *   Junos: MSE1 (MX304)
 *
 * Highlights:
 *   - encapsulation vlan-ccc
 *   - vlan-id-list range + input-vlan-map push (normalize to one S-VLAN)
 *
 * Pair with (same-device dependencies):
 *   - junos/services/evpn-fxc-vlan-unaware-1.conf
 *
 * Variables:
 *   $AC_INTF      e.g. et-1/0/3
 *   $FILTER_NAME  e.g. f_vlan_based_fam_bridge
 *   $SVLAN        e.g. 4090
 *   $UNIT         e.g. 800
 *   $VLAN_LIST    e.g. 800-809
 */
$AC_INTF {
    flexible-vlan-tagging;
    encapsulation flexible-ethernet-services;
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-id-list $VLAN_LIST;
        input-vlan-map {
            push;
            vlan-id $SVLAN;
        }
        output-vlan-map pop;
        family ccc {
            filter {
                input $FILTER_NAME;
            }
        }
    }
}
```

## junos/interfaces/vlan-ccc-1-unit-list.conf

```
/*
 * Topic:   Interface: vlan ccc 1 unit vlan-id-list (MEF E-Line / EVPL) — EVPN-FXC member
 *
 * Seen on:
 *   Junos: MSE1 (MX304)
 *
 * Highlights:
 *   - encapsulation vlan-ccc
 *   - vlan-id-list bundles a contiguous VLAN range on one UNI
 *
 * Pair with (same-device dependencies):
 *   - junos/services/evpn-fxc-vlan-unaware-1.conf
 *
 * Variables:
 *   $AC_INTF      e.g. et-1/0/3
 *   $FILTER_NAME  e.g. f_vlan_based_fam_bridge
 *   $UNIT         e.g. 800
 *   $VLAN_LIST    e.g. 800-809
 */
$AC_INTF {
    flexible-vlan-tagging;
    encapsulation flexible-ethernet-services;
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-id-list $VLAN_LIST;
        family ccc {
            filter {
                input $FILTER_NAME;
            }
        }
    }
}
```

## junos/interfaces/vlan-ccc-1-unit-qinq.conf

```
/*
 * Topic:   Interface: vlan ccc 1 unit QinQ (MEF E-Line / EVPL) — EVPN-FXC member
 *
 * Seen on:
 *   Junos: MSE1 (MX304)
 *
 * Highlights:
 *   - encapsulation vlan-ccc
 *   - vlan-tags outer/inner (S-VLAN + C-VLAN double tag) — one UNI per C-VLAN
 *   - remote-side break-out of a peer's vlan-id-list range
 *
 * Pair with (same-device dependencies):
 *   - junos/services/evpn-fxc-vlan-unaware-1.conf
 *
 * Variables:
 *   $AC_INTF      e.g. et-1/0/3
 *   $FILTER_NAME  e.g. f_vlan_based_fam_bridge
 *   $SVLAN        e.g. 4090
 *   $UNIT         e.g. 800
 *   $VLAN         e.g. 800
 */
$AC_INTF {
    flexible-vlan-tagging;
    encapsulation flexible-ethernet-services;
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-tags outer $SVLAN inner $VLAN;
        family ccc {
            filter {
                input $FILTER_NAME;
            }
        }
    }
}
```

## junos/interfaces/vlan-ccc-1-unit.conf

```
/*
 * Topic:   Interface: vlan ccc 1 unit (MEF E-Line / EVPL) — EVPN-FXC member
 *
 * Seen on:
 *   Junos: MSE1 (MX304)
 *
 * Highlights:
 *   - encapsulation flexible-ethernet-services
 *   - One bundled VLAN UNI of a VLAN-unaware EVPN-FXC (repeat per UNI)
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/firewall/filter-ccc-color-blind.conf
 *   - junos/services/evpn-fxc-vlan-unaware-1.conf
 *
 * Variables:
 *   $AC_INTF      e.g. et-1/0/3
 *   $FILTER_NAME  e.g. f_vlan_based_fam_bridge
 *   $UNIT         e.g. 4007
 *   $VLAN         e.g. 4007
 */
$AC_INTF {
    flexible-vlan-tagging;
    encapsulation flexible-ethernet-services;
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-id $VLAN;
        family ccc {
            filter {
                input $FILTER_NAME;
            }
        }
    }
}
```

## junos/interfaces/vlan-ccc-v2.conf

```
/*
 * Topic:   Interface: vlan ccc (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Junos: MA5 (MX204)
 *
 * Highlights:
 *   - encapsulation flexible-ethernet-services
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/firewall/filter-ccc-color-aware.conf
 *   - junos/services/l2vpn-kompella-vlan-based.conf
 *
 * Variables:
 *   $AC_INTF  e.g. xe-0/1/0
 *   $UNIT     e.g. 200
 *   $VLAN     e.g. 200
 */
$AC_INTF {
    flexible-vlan-tagging;
    encapsulation flexible-ethernet-services;
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-id $VLAN;
        family ccc {
            filter {
                input f_vlan-based_fam_ccc;
            }
        }
    }
}
```

## junos/interfaces/vlan-ccc-vlan-map-esi.conf

```
/*
 * Topic:   Interface: vlan ccc vlan map esi (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Junos: AN1 (MX204), AN2 (ACX5448)
 *
 * Highlights:
 *   - encapsulation vlan-ccc
 *   - ESI multihoming
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/firewall/filter-ccc-color-blind.conf
 *   - junos/services/evpn-vpws-vlan-based.conf
 *
 * Variables:
 *   $AC_INTF    e.g. ae11
 *   $ESI_ID     e.g. 00:10:11:49:30:11:01:00:00:00
 *   $INPUT_VID  e.g. 4094
 *   $UNIT       e.g. 4009
 *   $VLAN       e.g. 4009
 */
$AC_INTF {
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-id $VLAN;
        input-vlan-map {
            push;
            vlan-id $INPUT_VID;
        }
        output-vlan-map pop;
        esi {
            $ESI_ID;
            all-active;
        }
        family ccc {
            filter {
                input f_eline-evpn-vpws;
            }
        }
    }
}
```

## junos/interfaces/vlan-ccc-vlan-map.conf

```
/*
 * Topic:   Interface: vlan ccc vlan map (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Junos: AN4 (ACX710)
 *
 * Highlights:
 *   - encapsulation flexible-ethernet-services
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/services/evpn-vpws-vlan-based.conf
 *
 * Variables:
 *   $AC_INTF    e.g. xe-0/0/6
 *   $INPUT_VID  e.g. 4080
 *   $UNIT       e.g. 4010
 *   $VLAN       e.g. 4010
 */
$AC_INTF {
    flexible-vlan-tagging;
    encapsulation flexible-ethernet-services;
    unit $UNIT {
        encapsulation vlan-ccc;
        vlan-id $VLAN;
        input-vlan-map {
            push;
            vlan-id $INPUT_VID;
        }
        output-vlan-map pop;
        family ccc {
            filter {
                input f_vlan-based_fam_ccc;
            }
        }
    }
}
```

## junos/interfaces/vlan-ccc.conf

```
/*
 * Topic:   Interface: vlan ccc (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Junos: MSE1 (MX304)
 *
 * Highlights:
 *   - encapsulation flexible-ethernet-services
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * Variables:
 *   $AC_INTF  e.g. xe-0/0/13:2
 *   $UNIT_1   e.g. 4007
 *   $UNIT_2   e.g. 4008
 *   $VLAN_1   e.g. 4007
 *   $VLAN_2   e.g. 4008
 */
interfaces {
    $AC_INTF {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        unit $UNIT_1 {
            encapsulation vlan-ccc;
            vlan-id $VLAN_1;
            family ccc {
                filter {
                    input f_vlan_based_fam_bridge;
                }
            }
        }
        unit $UNIT_2 {
            encapsulation vlan-ccc;
            vlan-id $VLAN_2;
            family ccc {
                filter {
                    input f_vlan_based_fam_bridge;
                }
            }
        }
    }
}
```

## junos/policy/policy-l3vpn-import-export.conf

```
/*
 * Topic:   Policy: policy l3vpn import export (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Junos: MSE1 (MX304)
 *
 * Highlights:
 *   - Community-driven RT policy
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   Evo: AN3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG2 (ACX7509)
 *
 * Variables:
 *   $COMM_RT        e.g. 61535:13075
 *   $POLICY_NAME_1  e.g. PS-$VPN_RT_COMM-EXPORT
 *   $POLICY_NAME_2  e.g. PS-$VPN_RT_COMM-IMPORT
 *   $PUBLIC_PREFIX  e.g. 192.0.2.1/24
 *   $VPN_RT_COMM    e.g. METRO_L3VPN_4075
 */
policy-options {
    policy-statement $POLICY_NAME_1 {
        term tag-public-routes {
            from {
                route-filter $PUBLIC_PREFIX orlonger;
            }
            then {
                community add CM-L3VPN-PUB;
                community add $VPN_RT_COMM;
                accept;
            }
        }
    }
    policy-statement $POLICY_NAME_2 {
        term L3VPN-CUST {
            from community $VPN_RT_COMM;
            then accept;
        }
    }
    community $VPN_RT_COMM members target:$COMM_RT;
}
```

## junos/policy/policy-vpn-rt-export-gold.conf

```
/*
 * Topic:   Policy: policy vpn rt export gold (MEF E-Tree / EVP-Tree)
 *
 * Seen on:
 *   Junos: MSE1 (MX304), MSE2 (MX304), MA4 (MX204), MA5 (MX204)
 *
 * Highlights:
 *   - Community-driven RT policy
 *   - Defines + adds the gold color-mapping community (color:0:4000)
 *
 * Pair with (same-device dependencies):
 *   (none derived)
 *
 * JVD peer devices (observed interop):
 *   (none — single-device snip)
 *
 * Variables:
 *   $COMM_RT      e.g. 63536:4080
 *   $POLICY_NAME  e.g. evpn_group_80_4080
 *   $VPN_RT_COMM  e.g. evpn_group_80_4080_RT
 */
policy-options {
    policy-statement $POLICY_NAME {
        term a {
            then {
                community add $VPN_RT_COMM;
                community add CM-TC-MAP2GOLD;
                accept;
            }
        }
        term b {
            then reject;
        }
    }
    community $VPN_RT_COMM members target:$COMM_RT;
    community CM-TC-MAP2GOLD members color:0:4000;
}
```

## junos/services/bgp-vpls-p2p.conf

```
/*
 * Topic:   Service instance: bgp vpls p2p (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Junos: MA5 (MX204)
 *
 * Highlights:
 *   - instance-type virtual-switch
 *   - RT-driven import/export
 *   - VPLS $SITE_ID is per-domain — use contiguous IDs across PEs (1,2,3,...)
 *   - Local-switched (LSW) bridge-domain — no MPLS, used in E-Access hand-off scenarios
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/firewall/filter-bridge-color-aware.conf
 *   - junos/interfaces/vlan-bridge.conf
 *
 * JVD service mapping:
 *   vpls_group_4005 (eline_evpl_vpls_fapm_ring_p2p.conf):
 *     PEs (Evo): MA1.2 (ACX7024)
 *     PEs (Junos): MA5 (MX204)
 *
 * Variables:
 *   $AC_INTF           e.g. xe-0/1/0
 *   $INSTANCE_NAME     e.g. vpls_group_4005
 *   $LABEL_BLOCK_SIZE  e.g. 2
 *   $RD                e.g. 10.0.0.19:44444
 *   $SITE_ID           e.g. 3
 *   $SITE_NAME         e.g. r19
 *   $SITE_RANGE        e.g. 2
 *   $UNIT              e.g. 4005
 *   $VLAN              e.g. 4005
 *   $VRF_TARGET        e.g. 64535:44444
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-switch;
        protocols {
            vpls {
                site $SITE_NAME {
                    site-identifier $SITE_ID;
                }
                site-range $SITE_RANGE;
                label-block-size $LABEL_BLOCK_SIZE;
                no-tunnel-services;
            }
        }
        bridge-domains {
            vlan4005 {
                vlan-id $VLAN;
                interface $AC_INTF.$UNIT;
                bridge-options {
                    no-normalization;
                }
            }
        }
        route-distinguisher $RD;
        vrf-target target:$VRF_TARGET;
    }
}
```

## junos/services/bgp-vpls.conf

```
/*
 * Topic:   Service instance: bgp vpls (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Junos: MA5 (MX204)
 *
 * Highlights:
 *   - instance-type virtual-switch (MX bridge-domains + no-normalization)
 *   - BGP-VPLS multipoint; per-domain site-identifier + label-block-size
 *   - RT-driven import/export (colored vrf-export policy)
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/firewall/filter-bridge-color-blind.conf
 *   - junos/interfaces/vlan-bridge.conf
 *
 * Variables:
 *   $AC_INTF           e.g. xe-0/1/0
 *   $BD_NAME           e.g. vlan4012
 *   $INSTANCE_NAME     e.g. vpls_group_103_4012
 *   $LABEL_BLOCK_SIZE  e.g. 8
 *   $RD                e.g. 10.0.0.19:44012
 *   $SITE_ID           e.g. 4
 *   $SITE_NAME         e.g. r19
 *   $SITE_RANGE        e.g. 10
 *   $UNIT              e.g. 4012
 *   $VLAN              e.g. 4012
 *   $VRF_TARGET        e.g. 63535:1094012
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-switch;
        protocols {
            vpls {
                site $SITE_NAME {
                    site-identifier $SITE_ID;
                }
                site-range $SITE_RANGE;
                label-block-size $LABEL_BLOCK_SIZE;
                no-tunnel-services;
            }
        }
        bridge-domains {
            $BD_NAME {
                vlan-id $VLAN;
                interface $AC_INTF.$UNIT;
                bridge-options {
                    no-normalization;
                }
            }
        }
        route-distinguisher $RD;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$VRF_TARGET;
    }
}
```

## junos/services/bridge-domain-lsw.conf

```
/*
 * Topic:   Service instance: bridge domain lsw (MEF E-Access)
 *
 * Seen on:
 *   Junos: MA5 (MX204)
 *
 * Highlights:
 *   - Local-switched (LSW) bridge-domain — no MPLS, used in E-Access hand-off scenarios
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/cos-binding-mpls.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/firewall/filter-bridge-color-aware-cf0.conf
 *   - junos/interfaces/vlan-bridge-qinq-stacked.conf
 *
 * JVD service mapping:
 *   lsw_evpn_vpws_group_90_4082 (eaccess_evpn-vpws_lsw.conf):
 *     PEs (Evo): MA3 (ACX7100-48L)
 *   l2ckt (eaccess_l2ckt_lsw.conf):
 *     PEs (Evo): MA3 (ACX7100-48L)
 *
 * Variables:
 *   $AC_INTF_1  e.g. et-0/0/2
 *   $AC_INTF_2  e.g. xe-0/1/0
 *   $UNIT       e.g. 4082
 */
bridge-domains {
    bd_group_lsw_4082 {
        interface $AC_INTF_1.$UNIT;
        interface $AC_INTF_2.$UNIT;
    }
}
```

## junos/services/evpn-elan-port-based.conf

```
/*
 * Topic:   Service instance: evpn elan port based (MEF E-LAN / EP-LAN)
 *
 * Seen on:
 *   Junos: MA5 (MX204)
 *
 * Highlights:
 *   - instance-type evpn, direct whole-port interface (no vlans)
 *   - MPLS encapsulation, no-control-word (matches remote PE)
 *   - EVPN-ELAN multipoint (BGP auto-discovery; each PE self-contained)
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/firewall/filter-bridge-color-aware-l2cp.conf
 *   - junos/interfaces/ethernet-bridge.conf
 *
 * Variables:
 *   $AC_INTF        e.g. xe-0/1/0
 *   $INSTANCE_NAME  e.g. MEF_EVPN_ELAN_PORT_BASED
 *   $RD             e.g. 10.0.0.19:4014
 *   $UNIT           e.g. 0
 *   $VRF_TARGET     e.g. 63535:4014
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
        interface $AC_INTF.$UNIT;
        route-distinguisher $RD;
        vrf-target target:$VRF_TARGET;
    }
}
```

## junos/services/evpn-elan-type5.conf

```
/*
 * Topic:   Service instance: evpn elan type5 (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Junos: MSE1 (MX304)
 *
 * Highlights:
 *   - instance-type virtual-switch
 *   - EVPN Type-5 IP-prefix routes (L3 over EVPN)
 *   - MPLS encapsulation (SR-MPLS or LDP underlay)
 *   - no-control-word (matches remote PE)
 *   - RT-driven import/export
 *   - Local-switched (LSW) bridge-domain — no MPLS, used in E-Access hand-off scenarios
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *
 * JVD service mapping:
 *   METRO_L3VPN_4075 (elan_evp-lan_evpn-elan_type-5.conf):
 *     PEs (Evo): AN3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG2 (ACX7509)
 *     PEs (Junos): MSE1 (MX304)
 *   evpn_group_60_4075 (elan_evp-lan_evpn-elan_type-5.conf):
 *     PEs (Evo): AN3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG2 (ACX7509)
 *     PEs (Junos): MSE1 (MX304)
 *
 * Variables:
 *   $AC_INTF        e.g. xe-0/0/13:2
 *   $INSTANCE_NAME  e.g. evpn_group_60_4075
 *   $IRB_UNIT       e.g. 4075
 *   $RD_1           e.g. 10.0.0.10:14075
 *   $RD_2           e.g. 63200:13075
 *   $ROUTER_ID      e.g. 10.0.0.10
 *   $UNIT           e.g. 4075
 *   $VLAN           e.g. 4075
 *   $VRF_TARGET     e.g. 61535:14075
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-switch;
        protocols {
            evpn {
                encapsulation mpls;
                default-gateway do-not-advertise;
                extended-vlan-list 4075;
                no-control-word;
            }
        }
        bridge-domains {
            BD_evpn_group_60_4075 {
                vlan-id $VLAN;
                interface $AC_INTF.$UNIT;
                routing-interface irb.$IRB_UNIT;
            }
        }
        route-distinguisher $RD_1;
        vrf-target target:$VRF_TARGET;
    }
    METRO_L3VPN_4075 {
        instance-type vrf;
        routing-options {
            router-id $ROUTER_ID;
            auto-export;
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
        route-distinguisher $RD_2;
        vrf-import PS-METRO_L3VPN_4075-IMPORT;
        vrf-export PS-METRO_L3VPN_4075-EXPORT;
        vrf-table-label;
    }
}
```

## junos/services/evpn-elan-vlan-based-floating-pw.conf

```
/*
 * Topic:   Service instance: evpn elan vlan based floating pw (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Junos: MSE1 (MX304), MSE2 (MX304)
 *
 * Highlights:
 *   - instance-type evpn
 *   - RT-driven import/export
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/cos-binding-mpls.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/interfaces/pseudowire-subscriber.conf
 *   - junos/interfaces/vlan-bridge-esi.conf
 *   - junos/services/l2circuit-floating-pw.conf
 *
 * JVD service mapping:
 *   l2circuit (eline_evpl_floating_pw.conf):
 *     PEs (Junos): MSE1 (MX304), MSE2 (MX304)
 *   l2ckt-vc10120 (eline_evpl_floating_pw.conf):
 *     PEs (Evo): MA1.2 (ACX7024)
 *     PEs (Junos): MSE1 (MX304), MSE2 (MX304)
 *
 * Variables:
 *   $AC_INTF        e.g. ae10
 *   $PS_SERVICE     e.g. 4004
 *   $PS_TRANSPORT   e.g. ps22
 *   $RD             e.g. 10.0.0.10:40004
 *   $UNIT           e.g. 4004
 *   $VLAN           e.g. 4004
 *   $VRF_TARGET     e.g. 4004:4004
 */
routing-instances {
    $VLAN-evpn-floating-pw {
        instance-type evpn;
        protocols {
            evpn;
        }
        vlan-id $VLAN;
        interface $AC_INTF.$UNIT;
        interface $PS_TRANSPORT.$PS_SERVICE;
        route-distinguisher $RD;
        vrf-target target:$VRF_TARGET;
    }
}
```

## junos/services/evpn-elan-vlan-based.conf

```
/*
 * Topic:   Service instance: evpn elan vlan based (MEF E-LAN / EVP-LAN)
 *
 * Seen on:
 *   Junos: AN1 (MX204)
 *
 * Highlights:
 *   - instance-type evpn, vlan-id none + no-normalization (single C-VLAN, direct interface)
 *   - EVPN-ELAN multipoint (BGP auto-discovery; each PE self-contained)
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/firewall/filter-bridge-color-blind.conf
 *   - junos/interfaces/vlan-bridge.conf
 *   - junos/interfaces/vlan-bridge-esi.conf
 *
 * Variables:
 *   $AC_INTF        e.g. ae11
 *   $INSTANCE_NAME  e.g. evpn_group_90_4011
 *   $RD             e.g. 10.0.0.0:64011
 *   $UNIT           e.g. 4011
 *   $VRF_TARGET     e.g. 63535:64011
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
        interface $AC_INTF.$UNIT;
        route-distinguisher $RD;
        vrf-target target:$VRF_TARGET;
    }
}
```

## junos/services/evpn-elan.conf

```
/*
 * Topic:   Service instance: evpn elan (MEF E-LAN / EP-LAN)
 *
 * Seen on:
 *   Junos: MA5 (MX204)
 *
 * Highlights:
 *   - instance-type evpn
 *   - MPLS encapsulation (SR-MPLS or LDP underlay)
 *   - no-control-word (matches remote PE)
 *   - RT-driven import/export
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/firewall/filter-bridge-color-aware-l2cp.conf
 *   - junos/interfaces/ethernet-bridge.conf
 *
 * JVD service mapping:
 *   MEF_EVPN_ELAN_PORT_BASED (elan_ep-lan_evpn_elan.conf):
 *     PEs (Evo): AN3 (ACX7100-48L), MA1.2 (ACX7024)
 *     PEs (Junos): MA5 (MX204)
 *
 * Variables:
 *   $AC_INTF        e.g. xe-0/1/0
 *   $INSTANCE_NAME  e.g. MEF_EVPN_ELAN_PORT_BASED
 *   $RD             e.g. 10.0.0.19:4014
 *   $UNIT           e.g. 0
 *   $VRF_TARGET     e.g. 63535:4014
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
        interface $AC_INTF.$UNIT;
        route-distinguisher $RD;
        vrf-target target:$VRF_TARGET;
    }
}
```

## junos/services/evpn-etree-vlan-based.conf

```
/*
 * Topic:   Service instance: evpn etree vlan based (MEF E-Tree / EVP-Tree)
 *
 * Seen on:
 *   Junos: MSE1 (MX304), MSE2 (MX304), MA4 (MX204), MA5 (MX204)
 *
 * Highlights:
 *   - instance-type evpn
 *   - EVPN E-Tree (root/leaf segregation)
 *   - RT-driven import/export
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/cos-binding-mpls.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/firewall/filter-bridge-color-aware.conf
 *   - junos/interfaces/vlan-bridge-esi-etree-root.conf
 *   - junos/interfaces/vlan-bridge-etree-leaf.conf
 *
 * JVD service mapping:
 *   evpn_group_80_4080 (etree_evp-tree_evpn-etree.conf):
 *     A-A Multihoming: MSE1 (MX304), MSE2 (MX304)
 *     PEs (Junos): MA4 (MX204), MA5 (MX204)
 *
 * Variables:
 *   $AC_INTF        e.g. ae10
 *   $INSTANCE_NAME  e.g. evpn_group_80_4080
 *   $RD             e.g. 10.0.0.10:4080
 *   $UNIT           e.g. 4080
 *   $VLAN           e.g. 4080
 *   $VRF_TARGET     e.g. 63536:4080
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
        route-distinguisher $RD;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$VRF_TARGET;
    }
}
```

## junos/services/evpn-fxc-vlan-unaware-1.conf

```
/*
 * Topic:   Service instance: evpn fxc vlan unaware 1 (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Junos: MSE1 (MX304)
 *
 * Highlights:
 *   - instance-type evpn-vpws
 *   - flexible-cross-connect-vlan-unaware group (one member per bundled UNI)
 *   - service-id mirrors the peer PE (local/remote swap)
 *   - RT-driven import/export
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/firewall/filter-ccc-color-blind.conf
 *   - junos/interfaces/vlan-ccc-1-unit.conf
 *
 * Variables:
 *   $AC_INTF        e.g. et-1/0/3
 *   $INSTANCE_NAME  e.g. evpn_group_4007
 *   $LOCAL_VID      e.g. 2
 *   $RD             e.g. 10.0.0.10:40001
 *   $REMOTE_VID     e.g. 1
 *   $UNIT           e.g. 4007
 *   $VRF_TARGET     e.g. 63535:40001
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                flexible-cross-connect-vlan-unaware;
                group fxc {
                    interface $AC_INTF.$UNIT;
                    service-id {
                        local $LOCAL_VID;
                        remote $REMOTE_VID;
                    }
                }
            }
        }
        route-distinguisher $RD;
        vrf-export $INSTANCE_NAME;
        vrf-target target:$VRF_TARGET;
    }
}
```

## junos/services/evpn-fxc-vlan-unaware.conf

```
/*
 * Topic:   Service instance: evpn fxc vlan unaware (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Junos: MSE1 (MX304)
 *
 * Highlights:
 *   - instance-type evpn-vpws
 *   - RT-driven import/export
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *
 * JVD service mapping:
 *   evpn_group_4007 (eline_evpl_evpn-fxc_unaware_sh.conf):
 *     PEs (Evo): AN3 (ACX7100-48L)
 *     PEs (Junos): MSE1 (MX304)
 *
 * Variables:
 *   $AC_INTF        e.g. xe-0/0/13:2
 *   $INSTANCE_NAME  e.g. evpn_group_4007
 *   $RD             e.g. 10.0.0.10:40001
 *   $UNIT_1         e.g. 4007
 *   $UNIT_2         e.g. 4008
 *   $VRF_TARGET     e.g. 63535:40001
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                flexible-cross-connect-vlan-unaware;
                group fxc {
                    interface $AC_INTF.$UNIT_1;
                    interface $AC_INTF.$UNIT_2;
                    service-id {
                        local 2;
                        remote 1;
                    }
                }
            }
        }
        route-distinguisher $RD;
        vrf-target target:$VRF_TARGET;
    }
}
```

## junos/services/evpn-vpws-vlan-based.conf

```
/*
 * Topic:   Service instance: evpn vpws vlan based (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Junos: AN1 (MX204), AN2 (ACX5448), AN4 (ACX710)
 *
 * Highlights:
 *   - instance-type evpn-vpws
 *   - EVPN-VPWS attachment-circuit with local/remote service-id
 *   - RT-driven import/export
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/firewall/filter-ccc-color-blind.conf
 *   - junos/interfaces/vlan-ccc-vlan-map-esi.conf
 *   - junos/interfaces/vlan-ccc-vlan-map.conf
 *
 * JVD service mapping:
 *   evpn_group_30_4009 (eline_evpl_evpn_vpws_mh_e2e.conf):
 *     A-A Multihoming: AN1 (MX204), AN2 (ACX5448), AN3 (ACX7100-48L)
 *     A-A Multihoming: MA1.1 (ACX7024), MA1.2 (ACX7024)
 *   evpn_group_20_4010 (eline_evpl_evpn_vpws_sh_fabric.conf):
 *     PEs (Evo): AN3 (ACX7100-48L)
 *     PEs (Junos): AN4 (ACX710)
 *
 * Variables:
 *   $AC_INTF        e.g. ae11
 *   $INSTANCE_NAME  e.g. evpn_group_30_4009
 *   $LOCAL_VID      e.g. 1
 *   $RD             e.g. 10.0.0.0:4999
 *   $REMOTE_VID     e.g. 2
 *   $UNIT           e.g. 4009
 *   $VRF_TARGET     e.g. 63535:4999
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_INTF.$UNIT {
                    vpws-service-id {
                        local $LOCAL_VID;
                        remote $REMOTE_VID;
                    }
                }
            }
        }
        interface $AC_INTF.$UNIT;
        route-distinguisher $RD;
        vrf-target target:$VRF_TARGET;
    }
}
```

## junos/services/l2circuit-floating-pw.conf

```
/*
 * Topic:   Service instance: l2circuit floating pw (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Junos: MSE1 (MX304), MSE2 (MX304)
 *
 * Highlights:
 *   - Static targeted-LDP L2-circuit pseudowire (no routing-instance required)
 *
 * Pair with (same-device dependencies):
 *   - junos/interfaces/pseudowire-subscriber.conf
 *   - junos/services/evpn-elan-vlan-based-floating-pw.conf
 *
 * JVD service mapping:
 *   l2circuit (eline_evpl_floating_pw.conf):
 *     PEs (Junos): MSE1 (MX304), MSE2 (MX304)
 *   l2ckt-vc10120 (eline_evpl_floating_pw.conf):
 *     PEs (Evo): MA1.2 (ACX7024)
 *     PEs (Junos): MSE1 (MX304), MSE2 (MX304)
 *
 * Variables:
 *   $PS_TRANSPORT  e.g. ps22
 *   $PW_LABEL_IN   e.g. 1000022
 *   $PW_LABEL_OUT  e.g. 1000022
 *   $PW_NEIGHBOR   e.g. 10.0.0.18
 *   $VC_ID         e.g. 10120
 */
protocols {
    l2circuit {
        neighbor $PW_NEIGHBOR {
            interface $PS_TRANSPORT.0 {
                static {
                    incoming-label $PW_LABEL_IN;
                    outgoing-label $PW_LABEL_OUT;
                }
                virtual-circuit-id $VC_ID;
                encapsulation-type ethernet-vlan;
            }
        }
    }
}
```

## junos/services/l2vpn-kompella-port-based.conf

```
/*
 * Topic:   Service instance: l2vpn kompella port based (MEF E-Line / EPL)
 *
 * Seen on:
 *   Junos: MA5 (MX204)
 *
 * Highlights:
 *   - instance-type l2vpn
 *   - no-control-word (matches remote PE)
 *   - RT-driven import/export
 *   - VPLS $SITE_ID is per-domain — use contiguous IDs across PEs (1,2,3,...)
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/firewall/filter-ccc-color-aware-l2cp.conf
 *   - junos/interfaces/ethernet-ccc.conf
 *
 * JVD service mapping:
 *   MEF_L2VPN_PORT_BASED (eline_epl_l2vpn.conf):
 *     PEs (Evo): AN3 (ACX7100-48L)
 *     PEs (Junos): MA5 (MX204)
 *
 * Variables:
 *   $AC_INTF         e.g. xe-0/1/0
 *   $INSTANCE_NAME   e.g. MEF_L2VPN_PORT_BASED
 *   $RD              e.g. 63535:100000
 *   $REMOTE_SITE_ID  e.g. 1102
 *   $SITE_ID         e.g. 1119
 *   $UNIT            e.g. 0
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type l2vpn;
        protocols {
            l2vpn {
                site r19 {
                    interface $AC_INTF.$UNIT {
                        remote-site-id $REMOTE_SITE_ID;
                    }
                    site-identifier $SITE_ID;
                }
                encapsulation-type ethernet;
                no-control-word;
                flow-label-transmit;
                flow-label-receive;
            }
        }
        interface $AC_INTF.$UNIT;
        route-distinguisher $RD;
        vrf-target target:$RD;
    }
}
```

## junos/services/l2vpn-kompella-vlan-based.conf

```
/*
 * Topic:   Service instance: l2vpn kompella vlan based (MEF E-Line / EVPL)
 *
 * Seen on:
 *   Junos: MA5 (MX204)
 *
 * Highlights:
 *   - instance-type l2vpn
 *   - no-control-word (matches remote PE)
 *   - RT-driven import/export
 *   - VPLS $SITE_ID is per-domain — use contiguous IDs across PEs (1,2,3,...)
 *
 * Pair with (same-device dependencies):
 *   - junos/cos/classifiers.conf
 *   - junos/cos/cos-binding-ieee8021p.conf
 *   - junos/cos/rewrite-rules.conf
 *   - junos/firewall/filter-ccc-color-aware.conf
 *   - junos/interfaces/vlan-ccc.conf
 *
 * JVD service mapping:
 *   l2vpn_group_200 (eline_evpl_l2vpn_e2e.conf):
 *     PEs (Evo): AN3 (ACX7100-48L)
 *     PEs (Junos): MA5 (MX204)
 *
 * Variables:
 *   $AC_INTF         e.g. xe-0/1/0
 *   $INSTANCE_NAME   e.g. l2vpn_group_200
 *   $RD              e.g. 63535:112000
 *   $REMOTE_SITE_ID  e.g. 1102
 *   $SITE_ID         e.g. 1119
 *   $UNIT            e.g. 200
 *   $VRF_TARGET      e.g. 63535:102000
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type l2vpn;
        protocols {
            l2vpn {
                site r19 {
                    interface $AC_INTF.$UNIT {
                        remote-site-id $REMOTE_SITE_ID;
                    }
                    site-identifier $SITE_ID;
                }
                encapsulation-type ethernet-vlan;
                no-control-word;
            }
        }
        interface $AC_INTF.$UNIT;
        route-distinguisher $RD;
        vrf-target target:$VRF_TARGET;
    }
}
```

## _variables.md

# MaaS snip-library variables

Auto-generated. 49 unique variables across 112 snips.

Each `$VARIABLE` in a snip body is a placeholder that a deployer
substitutes per-instance. Examples below are taken from the source
JVD configs.

| Variable | Used in | Example |
|---|---|---|
| `$AC_INTF` | 65 snip(s) | `et-0/0/13` |
| `$AC_INTF_1` | 3 snip(s) | `et-0/0/0` |
| `$AC_INTF_2` | 3 snip(s) | `et-0/0/51` |
| `$COMM_RT` | 5 snip(s) | `61535:13075` |
| `$ESI_ID` | 11 snip(s) | `00:81:10:13:10:10:10:00:00:01` |
| `$ESI_ID_1` | 1 snip(s) | `00:10:44:11:50:12:02:00:00:00` |
| `$ESI_ID_2` | 1 snip(s) | `00:10:44:11:50:12:01:00:00:00` |
| `$FILTER_NAME` | 16 snip(s) | `f_port_based_fam_ccc` |
| `$INPUT_VID` | 9 snip(s) | `3712` |
| `$INPUT_VID_1` | 1 snip(s) | `3400` |
| `$INPUT_VID_2` | 1 snip(s) | `3000` |
| `$INSTANCE_NAME` | 26 snip(s) | `vpls_group_4005` |
| `$IP_ADDRESS` | 3 snip(s) | `198.51.100.2/27` |
| `$IRB_UNIT` | 3 snip(s) | `4075` |
| `$LABEL_BLOCK_SIZE` | 3 snip(s) | `2` |
| `$LOCAL_VID` | 6 snip(s) | `1` |
| `$MAC` | 1 snip(s) | `00:01:33:44:11:12` |
| `$MTU` | 8 snip(s) | `9192` |
| `$OUTER_VID_TPID` | 3 snip(s) | `0x88a8.4082` |
| `$POLICY_NAME` | 3 snip(s) | `evpn_group_80_4013` |
| `$POLICY_NAME_1` | 2 snip(s) | `PS-$VPN_RT_COMM-EXPORT` |
| `$POLICY_NAME_2` | 2 snip(s) | `PS-$VPN_RT_COMM-IMPORT` |
| `$PUBLIC_PREFIX` | 2 snip(s) | `203.0.113.0/24` |
| `$RD` | 23 snip(s) | `10.0.0.18:44444` |
| `$RD_1` | 3 snip(s) | `10.0.0.6:14075` |
| `$RD_2` | 3 snip(s) | `61000:13075` |
| `$REMOTE_SITE_ID` | 4 snip(s) | `1119` |
| `$REMOTE_VID` | 6 snip(s) | `2` |
| `$ROUTER_ID` | 3 snip(s) | `10.0.0.6` |
| `$SITE_ID` | 7 snip(s) | `5` |
| `$SITE_NAME` | 3 snip(s) | `r18` |
| `$SITE_RANGE` | 3 snip(s) | `2` |
| `$UNIT` | 61 snip(s) | `0` |
| `$UNIT_1` | 10 snip(s) | `4007` |
| `$UNIT_2` | 10 snip(s) | `4008` |
| `$VC_ID` | 3 snip(s) | `10120` |
| `$VC_ID_1` | 1 snip(s) | `2006` |
| `$VC_ID_2` | 1 snip(s) | `3333` |
| `$VG_ADDRESS` | 1 snip(s) | `198.51.100.1` |
| `$VG_MAC` | 1 snip(s) | `00:01:33:44:11:11` |
| `$VLAN` | 28 snip(s) | `4075` |
| `$VLAN_1` | 3 snip(s) | `4007` |
| `$VLAN_2` | 3 snip(s) | `4008` |
| `$VLAN_LIST_END` | 3 snip(s) | `4014` |
| `$VLAN_LIST_START` | 3 snip(s) | `4013` |
| `$VPN_RT_COMM` | 5 snip(s) | `METRO_L3VPN_4075` |
| `$VRF_TARGET` | 23 snip(s) | `64535:44444` |
| `$VRF_TARGET_1` | 1 snip(s) | `61535:14075` |
| `$VRF_TARGET_2` | 1 snip(s) | `61535:13075` |

## byoai/CATALOG.md

# Service Catalog — Metro-as-a-Service

This file is part of the [BYOAI](README.md) corpus. It is the
authoritative **funnel map**: for each path through the interview
(Service Profile → Multiplexing → Deployment → Attributes) it names the
exact service snip, attachment-circuit interface snip, and UNI firewall
filter to use, per OS. The AI reads this together with [`TIERS.md`](TIERS.md)
(which adds the CoS / apply-group snips for each verbosity tier) and
[`_variables.md`](../_variables.md). Bundled into
[`jvd-maas-snips.md`](jvd-maas-snips.md) by `regenerate-bundle.sh`.

**How to read a row:** pick the OS column that matches the target
device. `—` means that combination is not validated in this JVD on that
OS; if the user asked for it, say so and offer the validated OS. The
`{esi}` suffix on an interface snip means "use the `-esi` variant when
the service is multihomed, the plain variant when single-homed."

Filenames below are relative to `snips/` (prepend `junos/` or `evo/`
per the OS column, unless already shown).

---

## 1. E-LINE (point-to-point)

### 1a. EVPL (vlan-based)

| Deployment | Junos service | Junos interface | EVO service | EVO interface |
|---|---|---|---|---|
| `evpn-vpws` | `services/evpn-vpws-vlan-based.conf` | `interfaces/vlan-ccc-vlan-map{-esi}.conf` | `services/evpn-vpws-vlan-based.conf` | `interfaces/vlan-ccc{-esi}.conf` |
| `l2vpn-kompella` | `services/l2vpn-kompella-vlan-based.conf` | `interfaces/vlan-ccc.conf` | `services/l2vpn-kompella-vlan-based.conf` | `interfaces/vlan-ccc.conf` |
| `bgp-vpls-p2p` | `services/bgp-vpls-p2p.conf` | `interfaces/vlan-bridge.conf` | `services/bgp-vpls-p2p.conf` | `interfaces/vlan-bridge.conf` |
| `l2circuit` (floating PW) | `services/l2circuit-floating-pw.conf` + `interfaces/pseudowire-subscriber.conf` | `interfaces/vlan-ccc.conf` | `services/l2circuit-floating-pw.conf` | `interfaces/vlan-ccc.conf` |
| `l2circuit` (hot-standby) | — | — | `services/l2circuit-hot-standby-primary.conf` + `services/l2circuit-hot-standby-backup.conf` | `interfaces/vlan-ccc-vlan-map.conf` |
| `evpn-fxc` (vlan-unaware) | `services/evpn-fxc-vlan-unaware.conf` | `interfaces/vlan-ccc-vlan-map{-esi}.conf` | `services/evpn-fxc-vlan-unaware.conf` | `interfaces/vlan-ccc-2-units.conf` |
| `evpn-fxc` (vlan-aware) | — | — | `services/evpn-fxc-vlan-aware.conf` | `interfaces/vlan-ccc-vlan-map-esi-2-units.conf` |
| `evpn-floating-pw` | `services/evpn-elan-vlan-based-floating-pw.conf` + `services/l2circuit-floating-pw.conf` + `interfaces/pseudowire-subscriber.conf` | `interfaces/vlan-bridge-esi.conf` | — | — |

UNI firewall filter (EVPL):
- color-blind → Junos `firewall/filter-ccc-color-blind.conf` · EVO `firewall/filter-ccc-color-blind.conf`
- color-aware → Junos `firewall/filter-ccc-color-aware.conf` · EVO `—` (color-aware UNIs are Junos in this JVD)

### 1b. EPL (port-based)

| Deployment | Junos service | Junos interface | EVO service | EVO interface |
|---|---|---|---|---|
| `evpn-vpws` | — | — | `services/evpn-vpws-port-based.conf` | `interfaces/ethernet-ccc.conf` + `interfaces/physical-mtu.conf` |
| `l2vpn-kompella` | `services/l2vpn-kompella-port-based.conf` | `interfaces/ethernet-ccc.conf` | `services/l2vpn-kompella-port-based.conf` | `interfaces/ethernet-ccc.conf` + `interfaces/physical-mtu.conf` |

UNI firewall filter (EPL):
- color-aware → Junos `firewall/filter-ccc-color-aware-l2cp.conf`
- color-blind → EVO `firewall/filter-ccc-color-blind-l2cp.conf`

---

## 2. E-LAN (multipoint)

### 2a. EVP-LAN (vlan-based)

| Deployment | Junos service | Junos interface | EVO service | EVO interface |
|---|---|---|---|---|
| `evpn-elan` | `services/evpn-elan-port-based.conf` | `interfaces/vlan-bridge-esi.conf` | `services/evpn-elan-port-based.conf` | `interfaces/vlan-bridge-esi.conf` |
| `evpn-elan` (vlan-bundle) | — | — | `services/evpn-elan-vlan-bundle.conf` | `interfaces/vlan-bridge-bundle.conf` + `interfaces/vlan-bridge-esi-bundle.conf` |
| `evpn-elan-irb` (Type-5 / L3) | `services/evpn-elan-type5.conf` | `interfaces/vlan-bridge.conf` + `interfaces/irb-l3.conf` | `services/evpn-elan-type5.conf` | `interfaces/vlan-bridge.conf` + `interfaces/irb-l3.conf` |
| `bgp-vpls` | — | — | `services/bgp-vpls.conf` | `interfaces/vlan-bridge-vlan-map.conf` + `interfaces/physical-mtu.conf` |

UNI firewall filter (EVP-LAN): `firewall/filter-eswitch-color-blind.conf` (both OS).

### 2b. EP-LAN (port-based)

| Deployment | Junos service | Junos interface | EVO service | EVO interface |
|---|---|---|---|---|
| `evpn-elan` | `services/evpn-elan.conf` | `interfaces/ethernet-bridge.conf` | `services/evpn-elan-bundle-port-based.conf` | `interfaces/ethernet-bridge.conf` + `interfaces/physical-mtu.conf` |

UNI firewall filter (EP-LAN):
- Junos → `firewall/filter-bridge-color-aware-l2cp.conf`
- EVO → `firewall/filter-eswitch-color-blind-l2cp.conf`

---

## 3. E-TREE (rooted-multipoint)

| Deployment | Junos service | Junos interface (root / leaf) | EVO |
|---|---|---|---|
| `evpn-etree` | `services/evpn-etree-vlan-based.conf` | root: `interfaces/vlan-bridge-esi-etree-root.conf` · leaf: `interfaces/vlan-bridge-etree-leaf.conf` | — (Junos only) |

UNI firewall filter: `firewall/filter-bridge-color-aware.conf`.

E-Tree needs **both** a root UNI and a leaf UNI. Generate the root
interface snip on root-facing PEs and the leaf interface snip on
leaf-facing PEs; the service snip is the same on all.

---

## 4. ACCESS E-LINE (E-Access hand-off)

| Deployment | Junos service | Junos interface | EVO service | EVO interface |
|---|---|---|---|---|
| `evpn-vpws-lsw` | — | — | `services/evpn-vpws-lsw.conf` | `interfaces/vlan-ccc-qinq-stacked-qinq-tpid.conf` + `interfaces/vlan-ccc-vlan-map-bundle-qinq-tpid.conf` |
| `l2circuit-lsw` | — | — | `services/l2circuit-lsw.conf` | `interfaces/vlan-ccc-qinq-stacked-qinq-tpid.conf` + `interfaces/vlan-ccc-vlan-map-bundle-qinq-tpid.conf` |
| `bridge-domain-lsw` | `services/bridge-domain-lsw.conf` | `interfaces/vlan-bridge-qinq-stacked.conf` | — | — |

UNI firewall filter (E-Access):
- Junos `bridge-domain-lsw` → `firewall/filter-bridge-color-aware-cf0.conf`
- EVO LSW → `firewall/filter-ccc-color-blind.conf`

E-Access is inherently QinQ (customer C-VLAN stacked under an operator
S-VLAN). The `qinq` VLAN-manipulation attribute is implied — use the
QinQ interface variants above regardless of the VLAN-manip answer.

---

## Attribute → snip-variant rules

These override / refine the base rows above once the user answers STEP 4:

- **Homing**
  - `single-homed` → use the plain interface snip (no `-esi`).
  - `multihomed` (all-active ESI) → use the `-esi` interface variant
    where a row shows `{esi}`; if no `-esi` variant exists for that
    row, keep the plain snip and note that multihoming is not validated
    for this deployment in the JVD. Multihomed services share one
    `$ESI_ID` across both PEs (see DEFAULTS.md).

- **Color mode** — selects the firewall filter, as listed per section
  above. Color-aware UNIs are Junos-only in this JVD; if the user asks
  for color-aware on an EVO ACX7xxx, generate color-blind and note it.

- **CoS** — `no` → `minimum` tier (skip CoS + filter). `yes` →
  `with-cos` tier (add CoS binding + the color-mode filter). See TIERS.md.

- **VLAN manipulation** *(vlan-based E-Line/E-LAN only)*
  - `none` → base interface snip.
  - `vlan-map` → use the `-vlan-map` interface variant if the row has
    one (e.g. `vlan-ccc-vlan-map.conf`, `vlan-bridge-vlan-map.conf`).
  - `qinq` → use a `qinq-stacked` interface variant (Junos
    `vlan-bridge-qinq-stacked.conf`, EVO `vlan-ccc-qinq-stacked-qinq-tpid.conf`).

## `-v2` / `-v3` interface variants

Several interface snips have `-v2` / `-v3` siblings — these are real
validated variants (e.g. no-control-word, extra family filter, second
AC unit). Default to the base snip; only pick a `-vN` variant when the
user asks for that specific behavior or when generating a second AC on
the same service (`-2-units`).

## Reconciliation — always do this last

The rows above name the PRIMARY service + interface + filter for each
funnel path. Before you emit, open the chosen **service snip's own
`Pair with:` header** (the ground truth for that exact snip) and add any
listed snip that is not already in your set for the chosen tier. In
particular:

- **`evo/interfaces/physical-mtu.conf`** — most EVO services list this
  in `Pair with:` (it sets the 9192-byte port MTU needed for MPLS
  overhead). Include it for EVO services whenever their `Pair with:`
  lists it. Junos MX PEs set MTU inline, so there is no Junos equivalent.
- If the service snip's `Pair with:` names a CoS or firewall snip that
  differs from the row above (e.g. a `-l2cp` or `-cf0` filter variant),
  prefer the one in the header and note the substitution.

If a `Pair with:` entry is intentionally omitted for the chosen tier
(e.g. CoS snips at `minimum`), that's fine — just don't drop a required
interface/physical snip.

## byoai/TIERS.md

# Configuration Form Tiers — Metro-as-a-Service

This file is part of the [BYOAI](README.md) corpus. Once
[`CATALOG.md`](CATALOG.md) has resolved the funnel to a service snip +
attachment-circuit interface snip + UNI firewall filter, this file
tells the AI which **additional** snips to add for the chosen verbosity
tier. Bundled into [`jvd-maas-snips.md`](jvd-maas-snips.md) by
`regenerate-bundle.sh`.

Use the OS-appropriate file under `junos/` or `evo/`. Include ONLY the
snips for the chosen tier — and ONLY those — unless the user asks for more.

---

## What the tiers mean

| Tier | Chosen when | What's included |
|---|---|---|
| **`minimum`** | User answered CoS = `no`, or asked for "just the service". | Service routing-instance (from CATALOG) + attachment-circuit interface (from CATALOG). **Nothing else.** |
| **`with-cos`** | User answered CoS = `yes` (default for most asks). | `minimum` + CoS binding + the UNI firewall filter for the chosen color mode (from CATALOG). |
| **`as-deployed`** | Greenfield turn-up, "full example", "as deployed". | `with-cos` + forwarding-classes + schedulers + scheduler-map + the MEF apply-group baseline. Mirrors what the JVD validates end-to-end. |

> The base service always assumes the PE already has a working IGP/MPLS
> transport underlay and BGP overlay (`family evpn` / `family l2vpn`
> signaling). This JVD's snip library scopes the SERVICE layer; transport
> and overlay are JVD-wide constants, not per-service snips. If you are
> unsure the overlay address-family is active on the PE, say so in Notes.

---

## `minimum`

- Service snip(s) — from CATALOG.md for the resolved deployment.
- Attachment-circuit interface snip — from CATALOG.md (apply the
  homing / vlan-manipulation variant rules).

That's it. No CoS, no firewall filter, no apply-groups.

---

## `with-cos` (= `minimum` +)

Add the CoS binding set for the target OS:

- `cos/classifiers.conf`
- `cos/cos-binding-ieee8021p.conf`
- `cos/rewrite-rules.conf`
- `cos/cos-binding-mpls.conf` — **E-Access / LSW services only** (label-
  based hand-off). Skip for E-Line / E-LAN / E-Tree unless the pair-with
  header of the chosen service snip lists it.

Add the UNI firewall filter for the chosen color mode (from CATALOG.md):

- color-blind → `firewall/filter-*-color-blind*.conf`
- color-aware → `firewall/filter-*-color-aware*.conf` (Junos)

Pick the `-l2cp` filter variant for port-based (EPL / EP-LAN) services
and the `-cf0` variant for the Junos bridge-domain E-Access hand-off,
matching the pair-with header of the chosen service snip.

---

## `as-deployed` (= `with-cos` +)

Add the full JVD CoS + apply-group baseline:

- `cos/forwarding-classes.conf`
- `cos/schedulers.conf`
  - Junos: use `cos/schedulers.conf`; the AN1 access-node variant is
    `cos/schedulers-an1.conf`; legacy ACX5xxx is `cos/schedulers-legacy-acx.conf`.
- `cos/scheduler-map.conf`
- Apply-group baseline:
  - Junos → `apply-groups/mef-testing.conf`
  - EVO → `apply-groups/mef-forwarding-profile.conf`
- Routing policy (L3 / Type-5 and RT-export-tagged services only):
  - `policy/policy-l3vpn-import-export.conf` (EVPN-ELAN Type-5 / IRB)
  - `policy/policy-vpn-rt-export-gold.conf` or `-bronze.conf` (color /
    priority-tagged RT export, when the service snip references
    `vrf-export $POLICY_NAME`)

> **Greenfield / bootstrap** requests ("build a new access node",
> "full working example") are always treated as **`as-deployed`**
> regardless of the CoS answer.

---

## Quick reference — snips added per tier

```
minimum      = service + AC interface
with-cos     = minimum
             + cos/classifiers + cos/cos-binding-ieee8021p + cos/rewrite-rules
             [+ cos/cos-binding-mpls   (E-Access/LSW only)]
             + firewall/filter-<fam>-<colormode>[-l2cp|-cf0]
as-deployed  = with-cos
             + cos/forwarding-classes + cos/schedulers + cos/scheduler-map
             + apply-groups/mef-testing (Junos) | mef-forwarding-profile (EVO)
             [+ policy/*                (Type-5 / RT-export services)]
```

## byoai/DEFAULTS.md

# Auto-fill Defaults — Metro-as-a-Service

This file is part of the [BYOAI](README.md) corpus. It defines the
deterministic JVD lab-default values the AI uses when the user picks
`auto` mode (or short-circuits with `all defaults` / `skip`). Bundled
into [`jvd-maas-snips.md`](jvd-maas-snips.md) by `regenerate-bundle.sh`.

Every value comes from an IETF documentation range or a private/reserved
range so the output is visibly safe to share.

## Service identifiers (svc-id S, sequential from 4001)

MaaS instance names encode the MEF service group. Use this shape:

| Item | Value | Notes |
|---|---|---|
| Instance name | `<kind>_group_<S>` | e.g. `evpn_group_edge_4001`, `vpls_group_4001`, `evpn_group_80_4080` (E-Tree) |
| Route-distinguisher | `10.0.0.<pe-id>:<S>` | per-PE loopback-style RD; differs per PE |
| Route-target (`vrf-target`) | `63535:<S>` | shared across both PEs of the service |
| VLAN | `<S>` | e.g. `4001` |
| AC interface unit | `<S>` (vlan-based) or `0` (port-based) | |
| vpws-service-id | local `1`, remote `2` (mirror on the far PE) | EVPN-VPWS |
| Bandwidth-profile RT community | `METRO_L3VPN_<S>` | Type-5 / L3 services |

Sequence for N services: increment S by 1 each (`4001`, `4002`, …). The
E-Tree JVD example uses the `80` sub-group (`evpn_group_80_4080`); keep
that shape for E-Tree.

## Attachment circuits

| Item | Value | Source |
|---|---|---|
| AC interface (EVO) | `et-0/0/13` | from snip examples |
| AC interface (Junos MX) | `ae10` (LAG) or `xe-0/1/4` | from snip examples |
| Physical MTU | `9192` | JVD constant |
| Inner/customer VLAN (`$LOCAL_VID`/`$REMOTE_VID`) | `1` / `2` | VPWS service-id |
| VLAN-map translate (`$INPUT_VID`) | `<S>` | |

## ESI (multihomed / all-active)

- `$ESI_ID` = `00:81:10:<Sh>:<Sm>:<Sl>:10:10:10:01` where `<Sh>:<Sm>:<Sl>`
  encode the service-id — clearly synthetic. **The same ESI value is
  shared by both PEs** of a multihomed service; single-homed services
  omit ESI entirely.

## Addressing (Type-5 / IRB and LSW hand-off)

| Item | Value | Source |
|---|---|---|
| IRB / gateway address | `198.51.100.1/27` | RFC 5737 (TEST-NET-2) |
| Public customer prefix | `203.0.113.0/24` | RFC 5737 (TEST-NET-3) |
| Router-id | `10.0.0.<pe-id>` | loopback-style |
| Virtual-gateway address / MAC | `198.51.100.1` / `00:01:33:44:11:11` | from snip examples |

## Autonomous systems / RD-RT namespace

| Item | Value |
|---|---|
| RD/RT namespace AS | `63535` (2-byte, RFC 6996 private) |
| VC-id (`$VC_ID`, L2Circuit) | `<S>` |
| Kompella site-id / remote-site-id | `1` / `2` (mirror across PEs) |

## CoS / firewall (literal — JVD constants)

- Forwarding-classes: MaaS 8021p class model (literal — keep as in
  `cos/forwarding-classes.conf`).
- `scheduler-map`: keep the name as in `cos/scheduler-map.conf`.
- Filter names: `$FILTER_NAME` templates the `filter X { }` declaration.
  Default to `f_<service>_<colormode>` (e.g. `f_port_based_fam_ccc`) —
  keep whatever the chosen filter snip's example shows unless the user
  supplies a name.
- Apply-group names (`MEF-TESTING`, `MEF-FORWARDING-PROFILE`) are literal.

## Device selection

- If the user names devices → use them verbatim; infer OS from the
  platform code (MX/ACX5xxx/ACX710 = Junos; ACX7xxx = EVO).
- Else if `EVO`: `MA3 (ACX7100-48L)` + `MEG1 (ACX7100-32C)`
- Else if `JUNOS`: `MSE1 (MX304)` + `MA4 (MX204)`
- Else if `MIXED`: `MSE1 (MX304, Junos)` + `MA3 (ACX7100-48L, EVO)`
- Else: ask before continuing.

Devices observed in this JVD's snip `Seen on:` headers:

| OS | Devices (platform) |
|---|---|
| Junos | MSE1/MSE2 (MX304), AN1/MA4/MA5 (MX204), AN2 (ACX5448), AN4 (ACX710) |
| EVO | MA3/AN3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG2 (ACX7509), MA1.x (ACX7024) |

If the user supplies a device not in any `Seen on:` header, accept it
but warn in Notes that the config is by-pattern, not validated on that
specific device.

## Scale

No hard cap on counts. If the user asks for >500 of any entity, emit a
one-line "this will be a lot of output" warning in Notes but still
produce the full config.

## byoai/OUTPUT_FORMAT.md

# Output Format — Metro-as-a-Service

This file is part of the [BYOAI](README.md) corpus. It defines the exact
shape every generation must take. Bundled into
[`jvd-maas-snips.md`](jvd-maas-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every**
value picked or accepted, including the resolved funnel path:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: with-cos               # or "minimum" or "as-deployed"
# service:
#   profile: E-Line            # E-Line | E-LAN | E-Tree | Access E-Line
#   multiplexing: vlan-based   # vlan-based | port-based
#   deployment: evpn-vpws      # evpn-vpws | l2vpn-kompella | l2circuit | bgp-vpls | evpn-elan | evpn-etree | ...
#   attributes:
#     homing: multihomed       # single-homed | multihomed
#     color: color-blind       # color-blind | color-aware
#     cos: yes
#     vlan_manip: none         # none | vlan-map | qinq
#   count: 1
# devices:
#   pe1: { label: MSE1, platform: MX304, os: junos }
#   pe2: { label: MA3,  platform: ACX7100-48L, os: evo }
# values:
#   instance_name: evpn_group_edge_4001
#   rd: { pe1: 10.0.0.1:4001, pe2: 10.0.0.3:4001 }
#   vrf_target: target:63535:4001
#   vlan: 4001
#   ac_unit: 4001
#   esi_id: 00:81:10:40:01:01:10:10:10:01   # multihomed only
# snips_used:
#   - junos/services/evpn-vpws-vlan-based.conf
#   - junos/interfaces/vlan-ccc-vlan-map-esi.conf
#   - junos/cos/classifiers.conf
#   - ...
```

This block makes every generation reproducible — the user can paste it
back to regenerate the same output, or edit one value and rerun.

## 2. One fenced `text` block per device

Each device block starts with a `# device:` label and groups its snips
with `/* snips/<path> */` section comments:

```text
# device: MSE1 (MX304, Junos)
/* snips/junos/services/evpn-vpws-vlan-based.conf */
<rendered config block>

/* snips/junos/interfaces/vlan-ccc-vlan-map-esi.conf */
<rendered config block>
```

Drop the leading C-style `/* … */` documentation header from each snip
when emitting. Keep one `/* snips/<path> */` line as the section comment.

## 3. `Notes:` section (always last)

Bullets covering:

- Snips intentionally omitted (and why).
- Inputs defaulted because the user did not provide them.
- Cross-PE consistency the user must verify (route-targets, ESI values,
  vpws-service-id local/remote mirroring, instance names).
- Assumptions about transport underlay / BGP overlay activation on the
  PE (this JVD's snips scope the service layer, not the underlay).
- Anything by-pattern rather than validated on that exact device
  (e.g. a user-supplied device label not in any snip's `Seen on:` list),
  or a color-aware request downgraded to color-blind on EVO.

## Refusal

If the request cannot be fulfilled from the snip library, do not
apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
