# JVD AI/ML Multitenancy Backend snippet library

## evo/chassis/fpc-traffic-manager-buffer-monitor.conf

```
/*
 * Topic: Traffic-manager buffer monitoring on an FPC
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
 *   $FPC_SLOT  e.g. 0
 */
chassis {
    fpc $FPC_SLOT {
        traffic-manager {
            buffer-monitor-enable;
        }
    }
}
```

## evo/class-of-service/classifiers/cl-dscp-cnp-no-loss.conf

```
/*
 * Topic: DSCP classifier for the CNP and NO-LOSS forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-cnp-no-loss.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    classifiers {
        dscp mydscp {
            forwarding-class CNP {
                loss-priority low code-points 110000;
            }
            forwarding-class NO-LOSS {
                loss-priority low code-points 011010;
            }
        }
    }
}
```

## evo/class-of-service/congestion-notification-profile/cnp-pfc-watchdog.conf

```
/*
 * Topic: Congestion notification profile: PFC watchdog, PFC on the lossless DSCP code point, and IEEE 802.1p flow control on queue 4
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    congestion-notification-profile {
        cnp {
            pfc-watchdog;
            input {
                dscp {
                    code-point 011010 {
                        pfc;
                    }
                }
            }
            output {
                ieee-802.1 {
                    code-point 011 {
                        flow-control-queue 4;
                    }
                }
            }
        }
    }
}
```

## evo/class-of-service/dedicated-buffer.conf

```
/*
 * Topic: Dedicated buffer: 15 percent ingress, 30 percent egress
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    dedicated-buffer {
        ingress {
            percent 15;
        }
        egress {
            percent 30;
        }
    }
}
```

## evo/class-of-service/drop-profiles/dp-interpolate-55-90.conf

```
/*
 * Topic: Drop profile whose drop probability rises from 0 to 100 percent between 55 and 90 percent buffer fill
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    drop-profiles {
        dp1 {
            interpolate {
                fill-level [ 55 90 ];
                drop-probability [ 0 100 ];
            }
        }
    }
}
```

## evo/class-of-service/forwarding-classes/fc-cnp-no-loss.conf

```
/*
 * Topic: Forwarding classes CNP (queue 3) and NO-LOSS (queue 4, lossless, PFC priority 3)
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    forwarding-classes {
        class CNP queue-num 3;
        class NO-LOSS queue-num 4 no-loss pfc-priority 3;
    }
}
```

## evo/class-of-service/interfaces/ifd-all-et-cnp-scheduler-map-dscp-classifier.conf

```
/*
 * Topic: CoS on every et- interface: congestion notification profile, scheduler map and DSCP classifier on every unit
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with:
 *  - evo/class-of-service/classifiers/cl-dscp-cnp-no-loss.conf
 *  - evo/class-of-service/scheduler-maps/sm-cnp-no-loss.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    interfaces {
        et-* {
            congestion-notification-profile cnp;
            scheduler-map sm1;
            unit * {
                classifiers {
                    dscp mydscp;
                }
            }
        }
    }
}
```

## evo/class-of-service/scheduler-maps/sm-cnp-no-loss.conf

```
/*
 * Topic: Scheduler map for the CNP and NO-LOSS forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-cnp-no-loss.conf
 *  - evo/class-of-service/schedulers/schedulers-ecn-strict-high.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    scheduler-maps {
        sm1 {
            forwarding-class CNP scheduler s2-cnp;
            forwarding-class NO-LOSS scheduler s1;
        }
    }
}
```

## evo/class-of-service/schedulers/schedulers-ecn-strict-high.conf

```
/*
 * Topic: Schedulers: explicit congestion notification with a drop profile for lossless traffic, strict-high priority at 5 percent for CNP
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    schedulers {
        s1 {
            drop-profile-map loss-priority any protocol any drop-profile dp1;
            explicit-congestion-notification;
        }
        s2-cnp {
            transmit-rate percent 5;
            priority strict-high;
        }
    }
}
```

## evo/class-of-service/shared-buffer-lossless-lossy.conf

```
/*
 * Topic: Shared buffer partitions for lossless, lossless-headroom and lossy traffic
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    shared-buffer {
        ingress {
            buffer-partition lossless {
                percent 66;
                dynamic-threshold 10;
            }
            buffer-partition lossless-headroom {
                percent 24;
            }
            buffer-partition lossy {
                percent 10;
            }
        }
        egress {
            buffer-partition lossless {
                percent 66;
            }
            buffer-partition lossy {
                percent 10;
            }
        }
    }
}
```

## evo/forwarding-options/enhanced-hash-key-ecmp-dlb-flowlet.conf

```
/*
 * Topic: ECMP dynamic load balancing in flowlet mode for IPv4 and IPv6, with reassignment thresholds and a sampling rate
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    enhanced-hash-key {
        ecmp-dlb {
            flowlet {
                inactivity-interval 128;
                flowset-table-size 2048;
                reassignment {
                    prob-threshold 3;
                    quality-delta 6;
                }
            }
            ether-type {
                ipv4;
                ipv6;
            }
            sampling-rate 1000000;
        }
    }
}
```

## evo/forwarding-options/hash-key-inet-layer-3-layer-4.conf

```
/*
 * Topic: Load-balancing hash key for IPv4 traffic: Layer 3 and Layer 4 fields
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
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
    }
}
```

## evo/interfaces/ifd-breakout-description-400g.conf

```
/*
 * Topic: Port broken out into 400-Gbps sub-ports, with a description
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 13
 *   leaf2_qfx5240-64od 13
 *   leaf3_qfx5240-64od 13
 *   leaf4_qfx5240-64od 13
 *   spine1_qfx5240-64od 4
 *   spine2_qfx5240-64od 4
 *   spine3_qfx5240-64od 4
 *   spine4_qfx5240-64od 4
 *   total 68
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
 *   $IFD                 e.g. et-0/0/0
 *   $DESCRIPTION         e.g. "Breakout et-0/0/0"
 *   $BREAKOUT_SUB_PORTS  e.g. 2
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        number-of-sub-ports $BREAKOUT_SUB_PORTS;
        speed 400g;
    }
}
```

## evo/interfaces/ifd-description-mtu-9192.conf

```
/*
 * Topic: Access port with a description and a 9192-byte MTU
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 2
 *   leaf2_qfx5240-64od 2
 *   leaf3_qfx5240-64od 2
 *   leaf4_qfx5240-64od 2
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
 *   $AC_INTF      e.g. et-0/0/41:0
 *   $DESCRIPTION  e.g. to.ixiaaresone
 */
interfaces {
    $AC_INTF {
        description $DESCRIPTION;
        mtu 9192;
    }
}
```

## evo/interfaces/ifd-description-mtu-9216.conf

```
/*
 * Topic: Physical interface with a description and a 9216-byte MTU
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 16
 *   leaf2_qfx5240-64od 16
 *   leaf3_qfx5240-64od 16
 *   leaf4_qfx5240-64od 16
 *   spine1_qfx5240-64od 8
 *   spine2_qfx5240-64od 8
 *   spine3_qfx5240-64od 8
 *   spine4_qfx5240-64od 8
 *   total 96
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
 *   $IFD          e.g. et-0/0/12:0
 *   $DESCRIPTION  e.g. "VRF tenant-1 to H100-01"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        mtu 9216;
    }
}
```

## evo/interfaces/ifl-core-inet-mtu-9170.conf

```
/*
 * Topic: Unit 0 with an IPv4 address and a 9170-byte family MTU on a fabric link
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 8
 *   leaf2_qfx5240-64od 8
 *   leaf3_qfx5240-64od 8
 *   leaf4_qfx5240-64od 8
 *   spine1_qfx5240-64od 8
 *   spine2_qfx5240-64od 8
 *   spine3_qfx5240-64od 8
 *   spine4_qfx5240-64od 8
 *   total 64
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
 *   $CORE_PHYS     e.g. et-0/0/0:0
 *   $CORE_V4_ADDR  e.g. 10.0.2.177/31
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

## evo/interfaces/ifl-loopback-inet-inet6.conf

```
/*
 * Topic: Loopback unit with one IPv4 and one IPv6 address
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 5
 *   leaf2_qfx5240-64od 5
 *   leaf3_qfx5240-64od 5
 *   leaf4_qfx5240-64od 5
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 24
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
 *   $UNIT             e.g. 0
 *   $LOOPBACK_V4_PFX  e.g. 10.0.1.9/32
 *   $LOOPBACK_V6_PFX  e.g. fdf6:ed70:1fac:f2d2::1007/128
 */
interfaces {
    lo0 {
        unit $UNIT {
            family inet {
                address $LOOPBACK_V4_PFX;
            }
            family inet6 {
                address $LOOPBACK_V6_PFX;
            }
        }
    }
}
```

## evo/interfaces/ifl-unit-0-inet-inet6.conf

```
/*
 * Topic: Unit 0 with an IPv4 address and family inet6
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 2
 *   leaf2_qfx5240-64od 2
 *   leaf3_qfx5240-64od 2
 *   leaf4_qfx5240-64od 2
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
 *   $AC_INTF     e.g. et-0/0/41:0
 *   $AC_ADDR_V4  e.g. 10.200.101.1/24
 */
interfaces {
    $AC_INTF {
        unit 0 {
            family inet {
                address $AC_ADDR_V4;
            }
            family inet6;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-description-mtu-9192`

## evo/interfaces/ifl-unit-0-inet-mtu-9170-inet6.conf

```
/*
 * Topic: Unit 0 with an IPv4 address and a 9170-byte family MTU, and family inet6, on a GPU server link
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 8
 *   leaf2_qfx5240-64od 8
 *   leaf3_qfx5240-64od 8
 *   leaf4_qfx5240-64od 8
 *   total 32
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
 *   $AC_INTF     e.g. et-0/0/12:0
 *   $AC_ADDR_V4  e.g. 10.200.0.11/31
 */
interfaces {
    $AC_INTF {
        unit 0 {
            family inet {
                mtu 9170;
                address $AC_ADDR_V4;
            }
            family inet6;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-description-mtu-9216`

## evo/interfaces/ifl-unit-0-inet-no-address.conf

```
/*
 * Topic: Unit 0 with family inet and no address, on a port that carries no traffic in the design
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 56
 *   leaf2_qfx5240-64od 56
 *   leaf3_qfx5240-64od 56
 *   leaf4_qfx5240-64od 56
 *   spine1_qfx5240-64od 74
 *   spine2_qfx5240-64od 74
 *   spine3_qfx5240-64od 74
 *   spine4_qfx5240-64od 74
 *   total 520
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
 *   $IFD  e.g. et-0/0/10
 */
interfaces {
    $IFD {
        unit 0 {
            family inet;
        }
    }
}
```

## evo/interfaces/irb-inet-mtu-9000-mac.conf

```
/*
 * Topic: IRB unit with an IPv4 gateway address, a 9000-byte family MTU and a MAC address
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 15
 *   leaf2_qfx5240-64od 14
 *   leaf3_qfx5240-64od 22
 *   leaf4_qfx5240-64od 22
 *   total 73
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
 *   $IRB_UNIT  e.g. 2
 *   $IRB_ADDR  e.g. 10.200.0.1/24
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/irb-mtu-9216`

## evo/interfaces/irb-mtu-9216.conf

```
/*
 * Topic: IRB interface with a 9216-byte MTU
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
interfaces {
    irb {
        mtu 9216;
    }
}
```

## evo/policy-options/community/community-2-members.conf

```
/*
 * Topic: Community with two standard members
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 12
 *   leaf2_qfx5240-64od 12
 *   leaf3_qfx5240-64od 12
 *   leaf4_qfx5240-64od 12
 *   spine1_qfx5240-64od 2
 *   spine2_qfx5240-64od 2
 *   spine3_qfx5240-64od 2
 *   spine4_qfx5240-64od 2
 *   total 56
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
 *   $COMMUNITY_NAME        e.g. DEFAULT_DIRECT_V4
 *   $COMMUNITY_ADMIN_1     e.g. 5
 *   $COMMUNITY_ASSIGNED_1  e.g. 20007
 *   $COMMUNITY_ADMIN_2     e.g. 21001
 */
policy-options {
    community $COMMUNITY_NAME members [ $COMMUNITY_ADMIN_1:$COMMUNITY_ASSIGNED_1 $COMMUNITY_ADMIN_2:26000 ];
}
```

## evo/policy-options/community/from-spine-evpn-tier.conf

```
/*
 * Topic: FROM_SPINE_EVPN_TIER: the community that marks routes advertised by the spine EVPN tier
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    community FROM_SPINE_EVPN_TIER members 0:14;
}
```

## evo/policy-options/community/from-spine-fabric-tier.conf

```
/*
 * Topic: FROM_SPINE_FABRIC_TIER: the community that marks routes advertised by the spine tier
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    community FROM_SPINE_FABRIC_TIER members 0:15;
}
```

## evo/policy-options/policy-statement/per-packet-load-balance-no-term.conf

```
/*
 * Topic: Per-packet load-balancing policy without terms
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
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

## evo/policy-options/policy-statement/ps-accept.conf

```
/*
 * Topic: Export policy with one term that accepts every route
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
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

## evo/policy-options/policy-statement/ps-add-from-spine-evpn-tier-accept.conf

```
/*
 * Topic: Spine EVPN export policy that tags every route FROM_SPINE_EVPN_TIER and accepts it
 * Seen on:
 *   Junos: (none)
 *   EVO: spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 4
 * Pair with:
 *  - evo/policy-options/community/from-spine-evpn-tier.conf
 *
 * Peers with: n/a
 * Variables (example values from spine1_qfx5240-64od):
 *   $BGP_EXPORT_POL  e.g. SPINE_TO_LEAF_EVPN_OUT
 *   $TERM_NAME       e.g. SPINE_TO_LEAF_EVPN_OUT-10
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME {
            then {
                community add FROM_SPINE_EVPN_TIER;
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-add-from-spine-tier-accept.conf

```
/*
 * Topic: Spine export policy that tags every route FROM_SPINE_FABRIC_TIER and accepts it
 * Seen on:
 *   Junos: (none)
 *   EVO: spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 4
 * Pair with:
 *  - evo/policy-options/community/from-spine-fabric-tier.conf
 *
 * Peers with: n/a
 * Variables (example values from spine1_qfx5240-64od):
 *   $BGP_EXPORT_POL  e.g. SPINE_TO_LEAF_FABRIC_OUT
 *   $TERM_NAME       e.g. SPINE_TO_LEAF_FABRIC_OUT-10
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME {
            then {
                community add FROM_SPINE_FABRIC_TIER;
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-direct-inet-inet6-community-add-reject.conf

```
/*
 * Topic: Policy that accepts direct IPv4 and IPv6 routes, each with a community added, and rejects everything else
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 6
 *   leaf2_qfx5240-64od 6
 *   leaf3_qfx5240-64od 6
 *   leaf4_qfx5240-64od 6
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 28
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
 *   $POLICY_NAME       e.g. AllPodNetworks
 *   $TERM_NAME_1       e.g. AllPodNetworks-10
 *   $COMMUNITY_NAME_1  e.g. DEFAULT_DIRECT_V4
 *   $TERM_NAME_2       e.g. AllPodNetworks-20
 *   $COMMUNITY_NAME_2  e.g. DEFAULT_DIRECT_V6
 *   $TERM_NAME_3       e.g. AllPodNetworks-100
 */
policy-options {
    policy-statement $POLICY_NAME {
        term $TERM_NAME_1 {
            from {
                family inet;
                protocol direct;
            }
            then {
                community add $COMMUNITY_NAME_1;
                accept;
            }
        }
        term $TERM_NAME_2 {
            from {
                family inet6;
                protocol direct;
            }
            then {
                community add $COMMUNITY_NAME_2;
                accept;
            }
        }
        term $TERM_NAME_3 {
            then reject;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `community` (`$COMMUNITY_NAME_1`, `$COMMUNITY_NAME_2`): required, for each reference; `policy-options/community/community-2-members`

## evo/policy-options/policy-statement/ps-from-policy-bgp-accept-reject.conf

```
/*
 * Topic: Export policy that accepts the routes another policy accepts and BGP routes, and rejects everything else
 * Seen on:
 *   Junos: (none)
 *   EVO: spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from spine1_qfx5240-64od):
 *   $BGP_EXPORT_POL  e.g. BGP-AOS-Policy
 *   $TERM_NAME_1     e.g. BGP-AOS-Policy-10
 *   $POLICY_NAME     e.g. AllPodNetworks
 *   $TERM_NAME_2     e.g. BGP-AOS-Policy-20
 *   $TERM_NAME_3     e.g. BGP-AOS-Policy-100
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

## evo/policy-options/policy-statement/ps-from-policy-evpn-host-routes-accept-reject.conf

```
/*
 * Topic: Export policy that accepts the routes another policy accepts and EVPN IPv4 /32 and IPv6 /128 host routes, and rejects everything else
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
 *   $BGP_EXPORT_POL  e.g. BGP-AOS-Policy
 *   $TERM_NAME_1     e.g. BGP-AOS-Policy-10
 *   $POLICY_NAME     e.g. AllPodNetworks
 *   $TERM_NAME_2     e.g. BGP-AOS-Policy-50
 *   $TERM_NAME_3     e.g. BGP-AOS-Policy-60
 *   $TERM_NAME_4     e.g. BGP-AOS-Policy-100
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from policy $POLICY_NAME;
            then accept;
        }
        term $TERM_NAME_2 {
            from {
                protocol evpn;
                route-filter 0.0.0.0/0 prefix-length-range /32-/32;
            }
            then accept;
        }
        term $TERM_NAME_3 {
            from {
                protocol evpn;
                route-filter 0::0/0 prefix-length-range /128-/128;
            }
            then accept;
        }
        term $TERM_NAME_4 {
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-from-policy-evpn-host-routes-community-add-reject.conf

```
/*
 * Topic: EVPN Type 5 export policy that accepts the routes another policy accepts, adds a community to EVPN IPv4 /32 and IPv6 /128 host routes, and rejects everything else
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 5
 *   leaf2_qfx5240-64od 5
 *   leaf3_qfx5240-64od 5
 *   leaf4_qfx5240-64od 5
 *   total 20
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
 *   $IP_PREFIX_EXPORT_POL  e.g. BGP-AOS-Policy-non-tenant
 *   $TERM_NAME_1           e.g. BGP-AOS-Policy-non-tenant-10
 *   $POLICY_NAME           e.g. AllPodNetworks-non-tenant
 *   $TERM_NAME_2           e.g. BGP-AOS-Policy-non-tenant-50
 *   $COMMUNITY_NAME_1      e.g. NON-TENANT_COMMUNITY_V4
 *   $TERM_NAME_3           e.g. BGP-AOS-Policy-non-tenant-60
 *   $COMMUNITY_NAME_2      e.g. NON-TENANT_COMMUNITY_V6
 *   $TERM_NAME_4           e.g. BGP-AOS-Policy-non-tenant-100
 */
policy-options {
    policy-statement $IP_PREFIX_EXPORT_POL {
        term $TERM_NAME_1 {
            from policy $POLICY_NAME;
            then accept;
        }
        term $TERM_NAME_2 {
            from {
                protocol evpn;
                route-filter 0.0.0.0/0 prefix-length-range /32-/32;
            }
            then {
                community add $COMMUNITY_NAME_1;
                accept;
            }
        }
        term $TERM_NAME_3 {
            from {
                protocol evpn;
                route-filter 0::0/0 prefix-length-range /128-/128;
            }
            then {
                community add $COMMUNITY_NAME_2;
                accept;
            }
        }
        term $TERM_NAME_4 {
            then reject;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `community` (`$COMMUNITY_NAME_1`, `$COMMUNITY_NAME_2`): required, for each reference; `policy-options/community/community-2-members`

## evo/policy-options/policy-statement/ps-reject-bgp-from-spine-evpn-tier-accept.conf

```
/*
 * Topic: Leaf EVPN export policy that rejects BGP routes tagged FROM_SPINE_EVPN_TIER and accepts every other route
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   total 4
 * Pair with:
 *  - evo/policy-options/community/from-spine-evpn-tier.conf
 *
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
 *   $BGP_EXPORT_POL  e.g. LEAF_TO_SPINE_EVPN_OUT
 *   $TERM_NAME_1     e.g. LEAF_TO_SPINE_EVPN_OUT-10
 *   $TERM_NAME_2     e.g. LEAF_TO_SPINE_EVPN_OUT-20
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                protocol bgp;
                community FROM_SPINE_EVPN_TIER;
            }
            then reject;
        }
        term $TERM_NAME_2 {
            then accept;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-reject-bgp-from-spine-tier-accept.conf

```
/*
 * Topic: Leaf export policy that rejects BGP routes tagged FROM_SPINE_FABRIC_TIER and accepts every other route
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   total 4
 * Pair with:
 *  - evo/policy-options/community/from-spine-fabric-tier.conf
 *
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
 *   $BGP_EXPORT_POL  e.g. LEAF_TO_SPINE_FABRIC_OUT
 *   $TERM_NAME_1     e.g. LEAF_TO_SPINE_FABRIC_OUT-10
 *   $TERM_NAME_2     e.g. LEAF_TO_SPINE_FABRIC_OUT-20
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                protocol bgp;
                community FROM_SPINE_FABRIC_TIER;
            }
            then reject;
        }
        term $TERM_NAME_2 {
            then accept;
        }
    }
}
```

## evo/protocols/bgp-group-ebgp-evpn-overlay-4-peers-bfd-export-1-policy.conf

```
/*
 * Topic: Spine eBGP EVPN overlay group with four leaf loopback peers, BFD and one export policy
 * Seen on:
 *   Junos: (none)
 *   EVO: spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 4
 * Pair with: none
 * Peers with:
 *   [leaf1_qfx5240-64od] <-> [spine1_qfx5240-64od]
 *   [leaf1_qfx5240-64od] <-> [spine2_qfx5240-64od]
 *   [leaf1_qfx5240-64od] <-> [spine3_qfx5240-64od]
 *   [leaf1_qfx5240-64od] <-> [spine4_qfx5240-64od]
 *   [leaf2_qfx5240-64od] <-> [spine1_qfx5240-64od]
 *   [leaf2_qfx5240-64od] <-> [spine2_qfx5240-64od]
 *   [leaf2_qfx5240-64od] <-> [spine3_qfx5240-64od]
 *   [leaf2_qfx5240-64od] <-> [spine4_qfx5240-64od]
 *   [leaf3_qfx5240-64od] <-> [spine1_qfx5240-64od]
 *   [leaf3_qfx5240-64od] <-> [spine2_qfx5240-64od]
 *   [leaf3_qfx5240-64od] <-> [spine3_qfx5240-64od]
 *   [leaf3_qfx5240-64od] <-> [spine4_qfx5240-64od]
 *   [leaf4_qfx5240-64od] <-> [spine1_qfx5240-64od]
 *   [leaf4_qfx5240-64od] <-> [spine2_qfx5240-64od]
 *   [leaf4_qfx5240-64od] <-> [spine3_qfx5240-64od]
 *   [leaf4_qfx5240-64od] <-> [spine4_qfx5240-64od]
 * Variables (example values from spine1_qfx5240-64od):
 *   $BGP_GROUP          e.g. l3clos-s-evpn
 *   $OVERLAY_PEER_V4_1  e.g. 10.0.1.9
 *   $DESCRIPTION_1      e.g. facing_gpu-r1-l1-evpn-overlay
 *   $LOOPBACK_V4        e.g. 10.0.0.8
 *   $BGP_EXPORT_POL     e.g. SPINE_TO_LEAF_EVPN_OUT
 *   $ASN_FABRIC_PEER_1  e.g. 208
 *   $OVERLAY_PEER_V4_2  e.g. 10.0.1.8
 *   $DESCRIPTION_2      e.g. facing_gpu-r1-l2-evpn-overlay
 *   $ASN_FABRIC_PEER_2  e.g. 209
 *   $OVERLAY_PEER_V4_3  e.g. 10.0.1.10
 *   $DESCRIPTION_3      e.g. facing_gpu-r2-l1-evpn-overlay
 *   $ASN_FABRIC_PEER_3  e.g. 210
 *   $OVERLAY_PEER_V4_4  e.g. 10.0.1.11
 *   $DESCRIPTION_4      e.g. facing_gpu-r2-l2-evpn-overlay
 *   $ASN_FABRIC_PEER_4  e.g. 211
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
            neighbor $OVERLAY_PEER_V4_1 {
                description $DESCRIPTION_1;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL );
                peer-as $ASN_FABRIC_PEER_1;
            }
            neighbor $OVERLAY_PEER_V4_2 {
                description $DESCRIPTION_2;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL );
                peer-as $ASN_FABRIC_PEER_2;
            }
            neighbor $OVERLAY_PEER_V4_3 {
                description $DESCRIPTION_3;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL );
                peer-as $ASN_FABRIC_PEER_3;
            }
            neighbor $OVERLAY_PEER_V4_4 {
                description $DESCRIPTION_4;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL );
                peer-as $ASN_FABRIC_PEER_4;
            }
            vpn-apply-export;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$BGP_EXPORT_POL`): required, for each reference; `policy-options/policy-statement/ps-add-from-spine-evpn-tier-accept`

## evo/protocols/bgp-group-ebgp-evpn-overlay-4-peers-bfd-export-2-policies.conf

```
/*
 * Topic: Leaf eBGP EVPN overlay group with four spine loopback peers, BFD and a two-policy export chain
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   total 4
 * Pair with: none
 * Peers with:
 *   [leaf1_qfx5240-64od] <-> [spine1_qfx5240-64od]
 *   [leaf1_qfx5240-64od] <-> [spine2_qfx5240-64od]
 *   [leaf1_qfx5240-64od] <-> [spine3_qfx5240-64od]
 *   [leaf1_qfx5240-64od] <-> [spine4_qfx5240-64od]
 *   [leaf2_qfx5240-64od] <-> [spine1_qfx5240-64od]
 *   [leaf2_qfx5240-64od] <-> [spine2_qfx5240-64od]
 *   [leaf2_qfx5240-64od] <-> [spine3_qfx5240-64od]
 *   [leaf2_qfx5240-64od] <-> [spine4_qfx5240-64od]
 *   [leaf3_qfx5240-64od] <-> [spine1_qfx5240-64od]
 *   [leaf3_qfx5240-64od] <-> [spine2_qfx5240-64od]
 *   [leaf3_qfx5240-64od] <-> [spine3_qfx5240-64od]
 *   [leaf3_qfx5240-64od] <-> [spine4_qfx5240-64od]
 *   [leaf4_qfx5240-64od] <-> [spine1_qfx5240-64od]
 *   [leaf4_qfx5240-64od] <-> [spine2_qfx5240-64od]
 *   [leaf4_qfx5240-64od] <-> [spine3_qfx5240-64od]
 *   [leaf4_qfx5240-64od] <-> [spine4_qfx5240-64od]
 * Variables (example values from leaf1_qfx5240-64od):
 *   $BGP_GROUP          e.g. l3clos-l-evpn
 *   $OVERLAY_PEER_V4_1  e.g. 10.0.0.8
 *   $DESCRIPTION_1      e.g. facing_spine1-evpn-overlay
 *   $LOOPBACK_V4        e.g. 10.0.1.9
 *   $BGP_EXPORT_POL_1   e.g. LEAF_TO_SPINE_EVPN_OUT
 *   $BGP_EXPORT_POL_2   e.g. EVPN_EXPORT
 *   $ASN_FABRIC_PEER_1  e.g. 108
 *   $OVERLAY_PEER_V4_2  e.g. 10.0.0.9
 *   $DESCRIPTION_2      e.g. facing_spine2-evpn-overlay
 *   $ASN_FABRIC_PEER_2  e.g. 109
 *   $OVERLAY_PEER_V4_3  e.g. 10.0.0.10
 *   $DESCRIPTION_3      e.g. facing_spine3-evpn-overlay
 *   $ASN_FABRIC_PEER_3  e.g. 110
 *   $OVERLAY_PEER_V4_4  e.g. 10.0.0.11
 *   $DESCRIPTION_4      e.g. facing_spine4-evpn-overlay
 *   $ASN_FABRIC_PEER_4  e.g. 111
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
            neighbor $OVERLAY_PEER_V4_1 {
                description $DESCRIPTION_1;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_1;
            }
            neighbor $OVERLAY_PEER_V4_2 {
                description $DESCRIPTION_2;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_2;
            }
            neighbor $OVERLAY_PEER_V4_3 {
                description $DESCRIPTION_3;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
            }
            neighbor $OVERLAY_PEER_V4_4 {
                description $DESCRIPTION_4;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_4;
            }
            vpn-apply-export;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$BGP_EXPORT_POL_1`, `$BGP_EXPORT_POL_2`): required, for each reference; one of `policy-options/policy-statement/ps-accept`, `policy-options/policy-statement/ps-reject-bgp-from-spine-evpn-tier-accept`

## evo/protocols/bgp-group-ebgp-underlay-8-peers-bfd-export-2-policies.conf

```
/*
 * Topic: eBGP underlay group with eight directly connected peers (two links to each of four peer devices), BFD and a two-policy export chain
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with: none
 * Peers with:
 *   [leaf1_qfx5240-64od] <-> [spine1_qfx5240-64od]
 *   [leaf1_qfx5240-64od] <-> [spine2_qfx5240-64od]
 *   [leaf1_qfx5240-64od] <-> [spine3_qfx5240-64od]
 *   [leaf1_qfx5240-64od] <-> [spine4_qfx5240-64od]
 *   [leaf2_qfx5240-64od] <-> [spine1_qfx5240-64od]
 *   [leaf2_qfx5240-64od] <-> [spine2_qfx5240-64od]
 *   [leaf2_qfx5240-64od] <-> [spine3_qfx5240-64od]
 *   [leaf2_qfx5240-64od] <-> [spine4_qfx5240-64od]
 *   [leaf3_qfx5240-64od] <-> [spine1_qfx5240-64od]
 *   [leaf3_qfx5240-64od] <-> [spine2_qfx5240-64od]
 *   [leaf3_qfx5240-64od] <-> [spine3_qfx5240-64od]
 *   [leaf3_qfx5240-64od] <-> [spine4_qfx5240-64od]
 *   [leaf4_qfx5240-64od] <-> [spine1_qfx5240-64od]
 *   [leaf4_qfx5240-64od] <-> [spine2_qfx5240-64od]
 *   [leaf4_qfx5240-64od] <-> [spine3_qfx5240-64od]
 *   [leaf4_qfx5240-64od] <-> [spine4_qfx5240-64od]
 * Variables (example values from leaf1_qfx5240-64od):
 *   $BGP_GROUP            e.g. l3clos-l
 *   $UNDERLAY_PEER_V4_1   e.g. 10.0.2.130
 *   $DESCRIPTION_1        e.g. facing_spine1
 *   $UNDERLAY_LOCAL_V4_1  e.g. 10.0.2.131
 *   $BGP_EXPORT_POL_1     e.g. LEAF_TO_SPINE_FABRIC_OUT
 *   $BGP_EXPORT_POL_2     e.g. BGP-AOS-Policy
 *   $ASN_FABRIC_PEER_1    e.g. 108
 *   $UNDERLAY_PEER_V4_2   e.g. 10.0.2.176
 *   $UNDERLAY_LOCAL_V4_2  e.g. 10.0.2.177
 *   $UNDERLAY_PEER_V4_3   e.g. 10.0.2.128
 *   $DESCRIPTION_2        e.g. facing_spine2
 *   $UNDERLAY_LOCAL_V4_3  e.g. 10.0.2.129
 *   $ASN_FABRIC_PEER_2    e.g. 109
 *   $UNDERLAY_PEER_V4_4   e.g. 10.0.2.158
 *   $UNDERLAY_LOCAL_V4_4  e.g. 10.0.2.159
 *   $UNDERLAY_PEER_V4_5   e.g. 10.0.2.144
 *   $DESCRIPTION_3        e.g. facing_spine3
 *   $UNDERLAY_LOCAL_V4_5  e.g. 10.0.2.145
 *   $ASN_FABRIC_PEER_3    e.g. 110
 *   $UNDERLAY_PEER_V4_6   e.g. 10.0.2.174
 *   $UNDERLAY_LOCAL_V4_6  e.g. 10.0.2.175
 *   $UNDERLAY_PEER_V4_7   e.g. 10.0.2.150
 *   $DESCRIPTION_4        e.g. facing_spine4
 *   $UNDERLAY_LOCAL_V4_7  e.g. 10.0.2.151
 *   $ASN_FABRIC_PEER_4    e.g. 111
 *   $UNDERLAY_PEER_V4_8   e.g. 10.0.2.180
 *   $UNDERLAY_LOCAL_V4_8  e.g. 10.0.2.181
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
                description $DESCRIPTION_1;
                local-address $UNDERLAY_LOCAL_V4_1;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_1;
            }
            neighbor $UNDERLAY_PEER_V4_2 {
                description $DESCRIPTION_1;
                local-address $UNDERLAY_LOCAL_V4_2;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_1;
            }
            neighbor $UNDERLAY_PEER_V4_3 {
                description $DESCRIPTION_2;
                local-address $UNDERLAY_LOCAL_V4_3;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_2;
            }
            neighbor $UNDERLAY_PEER_V4_4 {
                description $DESCRIPTION_2;
                local-address $UNDERLAY_LOCAL_V4_4;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_2;
            }
            neighbor $UNDERLAY_PEER_V4_5 {
                description $DESCRIPTION_3;
                local-address $UNDERLAY_LOCAL_V4_5;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
            }
            neighbor $UNDERLAY_PEER_V4_6 {
                description $DESCRIPTION_3;
                local-address $UNDERLAY_LOCAL_V4_6;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
            }
            neighbor $UNDERLAY_PEER_V4_7 {
                description $DESCRIPTION_4;
                local-address $UNDERLAY_LOCAL_V4_7;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_4;
            }
            neighbor $UNDERLAY_PEER_V4_8 {
                description $DESCRIPTION_4;
                local-address $UNDERLAY_LOCAL_V4_8;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_4;
            }
            vpn-apply-export;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$BGP_EXPORT_POL_1`, `$BGP_EXPORT_POL_2`): required, for each reference; one of `policy-options/policy-statement/ps-add-from-spine-tier-accept`, `policy-options/policy-statement/ps-from-policy-bgp-accept-reject`, `policy-options/policy-statement/ps-from-policy-evpn-host-routes-accept-reject`, `policy-options/policy-statement/ps-reject-bgp-from-spine-tier-accept`

## evo/protocols/bgp-log-updown-graceful-restart-multipath.conf

```
/*
 * Topic: BGP global options: log-updown, graceful restart without helping on shared-fate BFD down, and multipath
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
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

## evo/protocols/l2-learning-telemetry-enable-remote-entries.conf

```
/*
 * Topic: Layer 2 learning telemetry that includes remote entries
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   total 4
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

## evo/protocols/lldp-interface-all-port-id-interface-name.conf

```
/*
 * Topic: LLDP on all interfaces with the interface name as port ID and the interface description as port description
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
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

## evo/protocols/router-advertisement-interface.conf

```
/*
 * Topic: IPv6 router advertisements on one interface, with 30-second maximum and 10-second minimum intervals
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 8
 *   leaf2_qfx5240-64od 8
 *   leaf3_qfx5240-64od 8
 *   leaf4_qfx5240-64od 8
 *   total 32
 * Pair with: none
 * Variables (example values from leaf1_qfx5240-64od):
 *   $AC_IFL  e.g. et-0/0/12:0.0
 */
protocols {
    router-advertisement {
        interface $AC_IFL {
            max-advertisement-interval 30;
            min-advertisement-interval 10;
        }
    }
}
```

## evo/protocols/rstp-disable.conf

```
/*
 * Topic: RSTP disabled
 * Seen on:
 *   Junos: (none)
 *   EVO: spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 4
 * Pair with: none
 * Variables: none
 */
protocols {
    rstp {
        disable;
    }
}
```

## evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-2-ac.conf

```
/*
 * Topic: EVPN Type 5 VRF with two server links and a loopback unit
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 3
 *   leaf2_qfx5240-64od 3
 *   leaf3_qfx5240-64od 3
 *   leaf4_qfx5240-64od 3
 *   total 12
 * Pair with: none
 * Variables (example values from leaf1_qfx5240-64od):
 *   $INSTANCE_NAME         e.g. tenant-2
 *   $VNI                   e.g. 20002
 *   $IP_PREFIX_EXPORT_POL  e.g. BGP-AOS-Policy-tenant-2
 *   $AC_IFL_1              e.g. et-0/0/12:1.0
 *   $AC_IFL_2              e.g. et-0/0/16:1.0
 *   $LOOPBACK_IFL          e.g. lo0.3
 *   $LOOPBACK_V4           e.g. 10.0.1.9
 *   $RD_SUB_ASSIGNED       e.g. 2002
 *   $RT_AS                 e.g. 20002
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            rib $INSTANCE_NAME.inet6.0 {
                multipath;
            }
            graceful-restart;
            multipath;
            auto-export;
        }
        protocols {
            evpn {
                ip-prefix-routes {
                    advertise direct-nexthop;
                    encapsulation vxlan;
                    vni $VNI;
                    export $IP_PREFIX_EXPORT_POL;
                }
            }
        }
        interface $AC_IFL_1;
        interface $AC_IFL_2;
        interface $LOOPBACK_IFL;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:1;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL_1`, `$AC_IFL_2`, `$LOOPBACK_IFL`): required, for each reference; one of `interfaces/ifl-loopback-inet-inet6`, `interfaces/ifl-unit-0-inet-mtu-9170-inet6`
- `policy-statement` (`$IP_PREFIX_EXPORT_POL`): required, for each reference; `policy-options/policy-statement/ps-from-policy-evpn-host-routes-community-add-reject`

## evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-4-ac.conf

```
/*
 * Topic: EVPN Type 5 VRF with four server links and a loopback unit
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   total 4
 * Pair with: none
 * Variables (example values from leaf1_qfx5240-64od):
 *   $INSTANCE_NAME         e.g. tenant-1
 *   $VNI                   e.g. 20001
 *   $IP_PREFIX_EXPORT_POL  e.g. BGP-AOS-Policy-tenant-1
 *   $AC_IFL_1              e.g. et-0/0/12:0.0
 *   $AC_IFL_2              e.g. et-0/0/16:0.0
 *   $AC_IFL_3              e.g. et-0/0/41:0.0
 *   $AC_IFL_4              e.g. et-0/0/41:1.0
 *   $LOOPBACK_IFL          e.g. lo0.2
 *   $LOOPBACK_V4           e.g. 10.0.1.9
 *   $RD_SUB_ASSIGNED       e.g. 2001
 *   $RT_AS                 e.g. 20001
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            rib $INSTANCE_NAME.inet6.0 {
                multipath;
            }
            graceful-restart;
            multipath;
            auto-export;
        }
        protocols {
            evpn {
                ip-prefix-routes {
                    advertise direct-nexthop;
                    encapsulation vxlan;
                    vni $VNI;
                    export $IP_PREFIX_EXPORT_POL;
                }
            }
        }
        interface $AC_IFL_1;
        interface $AC_IFL_2;
        interface $AC_IFL_3;
        interface $AC_IFL_4;
        interface $LOOPBACK_IFL;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:1;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL_1`, `$AC_IFL_2`, `$AC_IFL_3`, `$AC_IFL_4`, `$LOOPBACK_IFL`): required, for each reference; one of `interfaces/ifl-loopback-inet-inet6`, `interfaces/ifl-unit-0-inet-inet6`, `interfaces/ifl-unit-0-inet-mtu-9170-inet6`
- `policy-statement` (`$IP_PREFIX_EXPORT_POL`): required, for each reference; `policy-options/policy-statement/ps-from-policy-evpn-host-routes-community-add-reject`

## evo/routing-instances/mgmt-junos-static-default-route.conf

```
/*
 * Topic: Management instance (mgmt_junos) static default route
 * Seen on:
 *   Junos: (none)
 *   EVO: spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from spine1_qfx5240-64od):
 *   $NEXT_HOP_V4  e.g. 10.161.39.254
 */
routing-instances {
    mgmt_junos {
        routing-options {
            static {
                route 0.0.0.0/0 next-hop $NEXT_HOP_V4;
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
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
 *   $ASN  e.g. 208
 */
routing-options {
  autonomous-system $ASN;
}
```

## evo/routing-options/forwarding-table-pplb-ecmp-fast-reroute-chained-composite-evpn.conf

```
/*
 * Topic: Forwarding-table export of the per-packet load-balancing policy, with ECMP fast reroute and ingress chained composite next hops for EVPN
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
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

## evo/routing-options/forwarding-table-pplb-ecmp-fast-reroute.conf

```
/*
 * Topic: Forwarding-table export of the per-packet load-balancing policy, with ECMP fast reroute
 * Seen on:
 *   Junos: (none)
 *   EVO: spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from spine1_qfx5240-64od):
 *   $PPLB_NAME  e.g. PFE-LB
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
        ecmp-fast-reroute;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$PPLB_NAME`): required, for each reference; `policy-options/policy-statement/per-packet-load-balance-no-term`

## evo/routing-options/graceful-restart.conf

```
/*
 * Topic: Graceful restart
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
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
 * Topic: Transport router identity
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5240-64od):
 *   $ROUTER_ID  e.g. 10.0.1.9
 */
routing-options {
    router-id $ROUTER_ID;
}
```

## evo/security/certificates-local.conf

```
/*
 * Topic: Local certificate and private key used by the gRPC SSL service
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with: none
 * Variables (example values from leaf1_qfx5240-64od):
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

## evo/system/ddos-protection-resolve-aggregate-disable-fpc.conf

```
/*
 * Topic: DDoS protection for resolve traffic: the aggregate policer is not enforced per FPC (disable-fpc)
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with: none
 * Variables: none
 */
system {
    ddos-protection {
        protocols {
            resolve {
                aggregate {
                    disable-fpc;
                }
            }
        }
    }
}
```

## evo/system/host-name.conf

```
/*
 * Topic: System host name
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with: none
 * Variables (example values from leaf1_qfx5240-64od):
 *   $HOST_NAME  e.g. GPU-R1-L1
 */
system {
    host-name $HOST_NAME;
}
```

## evo/system/management-instance.conf

```
/*
 * Topic: Dedicated management routing instance (mgmt_junos) for the management interface and services
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with: none
 * Variables: none
 */
system {
    management-instance;
}
```

## evo/system/services-netconf-ssh-grpc-ssl-local-certificate-mgmt-junos.conf

```
/*
 * Topic: NETCONF over SSH, and the gRPC request-response extension service over SSL in the management instance, using a local certificate
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 * Count:
 *   leaf1_qfx5240-64od 1
 *   leaf2_qfx5240-64od 1
 *   leaf3_qfx5240-64od 1
 *   leaf4_qfx5240-64od 1
 *   spine1_qfx5240-64od 1
 *   spine2_qfx5240-64od 1
 *   spine3_qfx5240-64od 1
 *   spine4_qfx5240-64od 1
 *   total 8
 * Pair with: none
 * Variables (example values from leaf1_qfx5240-64od):
 *   $GRPC_PORT   e.g. 32767
 *   $LOCAL_CERT  e.g. aos_grpc
 */
system {
    services {
        netconf {
            ssh;
        }
        extension-service {
            request-response {
                grpc {
                    ssl {
                        port $GRPC_PORT;
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

Values left literal on purpose: the communities `FROM_SPINE_FABRIC_TIER` (`0:15`) and `FROM_SPINE_EVPN_TIER`
(`0:14`), which the tier policies reference by name; the class-of-service model (forwarding classes `CNP` and
`NO-LOSS`, classifier `mydscp`, schedulers `s1` and `s2-cnp`, scheduler map `sm1`, drop profile `dp1`, congestion
notification profile `cnp`, buffer partitions and code points) and its binding on every `et-*` interface; the MTUs
(`9216`, `9192`, `9170`, `9000`), the BFD timers, the breakout and port speeds, the router-advertisement intervals,
the hash and dynamic load-balancing parameters, the route-target ID `1`, the gRPC routing instance `mgmt_junos`,
`unit 0`, and the loopback `lo0`.

## System

| Variable | What it is | Example value |
|---|---|---|
| `$FPC_SLOT` | FPC slot number. | `0` |
| `$GRPC_PORT` | TCP port of the gRPC request-response extension service over SSL. | `32767` |
| `$HOST_NAME` | System host name. | `GPU-R1-L1` |
| `$LOCAL_CERT` | Name of the local certificate (`security certificates local`) the gRPC SSL service presents (`local-certificate`). | `aos_grpc` |
| `$LOCAL_CERT_KEY` | PEM private key and certificate of the local certificate; secret, supplied by the operator (the published value is sanitized). | `"<LOCAL_CERT_KEY>"` |
| `$NEXT_HOP_V4` | IPv4 next hop of a static route: here the management network gateway. | `10.161.39.254` |

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number (`routing-options autonomous-system`). | `208` |
| `$LOOPBACK_V4` | Loopback IPv4 address of the local device: the overlay session `local-address`, and the administrator field of a VRF route distinguisher. | `10.0.0.8` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on a loopback unit (unit 0, or a tenant VRF's loopback unit). | `10.0.1.9/32` |
| `$LOOPBACK_V6_PFX` | IPv6 address with prefix length on a loopback unit. | `fdf6:ed70:1fac:f2d2::1007/128` |
| `$ROUTER_ID` | Router identifier in IPv4 dotted-decimal form. | `10.0.1.9` |

## Tenant VRFs

| Variable | What it is | Example value |
|---|---|---|
| `$AC_IFL` | Access-facing logical interface (`<interface>.<unit>`): here a GPU server link with IPv6 router advertisements. | `et-0/0/12:0.0` |
| `$AC_IFL_1` | Access-facing logical interface listed in a tenant VRF (a GPU server or tester link); `_1`, `_2`, … number the VRF's interfaces in source order. | `et-0/0/12:1.0` |
| `$AC_IFL_2` | Access-facing logical interface listed in a tenant VRF (a GPU server or tester link); `_1`, `_2`, … number the VRF's interfaces in source order. | `et-0/0/16:1.0` |
| `$AC_IFL_3` | Access-facing logical interface listed in a tenant VRF (a GPU server or tester link); `_1`, `_2`, … number the VRF's interfaces in source order. | `et-0/0/41:0.0` |
| `$AC_IFL_4` | Access-facing logical interface listed in a tenant VRF (a GPU server or tester link); `_1`, `_2`, … number the VRF's interfaces in source order. | `et-0/0/41:1.0` |
| `$INSTANCE_NAME` | Name of a tenant routing instance (VRF); also names its IPv6 routing table (`<instance>.inet6.0`). | `tenant-2` |
| `$IP_PREFIX_EXPORT_POL` | Policy-statement name exported as EVPN Type 5 IP prefix routes from a tenant VRF (in a policy form, the policy's own name). | `BGP-AOS-Policy-non-tenant` |
| `$LOOPBACK_IFL` | Loopback logical interface (`lo0.<unit>`) listed in a tenant VRF. | `lo0.3` |
| `$RD_SUB_ASSIGNED` | Assigned-number field of a VRF route distinguisher (`<loopback>:<number>`). | `2002` |
| `$RT_AS` | AS field of a VRF route target (`target:<AS>:1`). | `20002` |
| `$VNI` | VXLAN network identifier of a tenant VRF's EVPN Type 5 IP prefix routes. | `20002` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address with prefix length on an access-facing Layer 3 unit. | `10.200.101.1/24` |
| `$AC_INTF` | Access-facing physical interface (a GPU server or traffic-tester link). | `et-0/0/41:0` |
| `$BREAKOUT_SUB_PORTS` | Number of sub-ports a channelized (breakout) port is split into (`number-of-sub-ports`). | `2` |
| `$CORE_PHYS` | Fabric-facing physical interface of a point-to-point leaf-spine link. | `et-0/0/0:0` |
| `$CORE_V4_ADDR` | IPv4 address with prefix length (/31) on a leaf-spine fabric link. | `10.0.2.177/31` |
| `$DESCRIPTION` | Free-text interface or BGP neighbor `description`. | `"Breakout et-0/0/0"` |
| `$DESCRIPTION_1` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_gpu-r1-l1-evpn-overlay` |
| `$DESCRIPTION_2` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_gpu-r1-l2-evpn-overlay` |
| `$DESCRIPTION_3` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_gpu-r2-l1-evpn-overlay` |
| `$DESCRIPTION_4` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_gpu-r2-l2-evpn-overlay` |
| `$IFD` | Physical interface name (a breakout port or a port that carries no traffic in the design). | `et-0/0/0` |
| `$IRB_ADDR` | IPv4 gateway address with prefix length on an IRB unit. | `10.200.0.1/24` |
| `$IRB_MAC` | MAC address of an IRB unit. | `00:1c:73:00:00:01` |
| `$IRB_UNIT` | IRB unit number. | `2` |
| `$UNIT` | Logical unit number. | `0` |

## Fabric underlay and overlay

| Variable | What it is | Example value |
|---|---|---|
| `$ASN_FABRIC_PEER_1` | Autonomous-system number of a fabric eBGP neighbor (another leaf or spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `208` |
| `$ASN_FABRIC_PEER_2` | Autonomous-system number of a fabric eBGP neighbor (another leaf or spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `209` |
| `$ASN_FABRIC_PEER_3` | Autonomous-system number of a fabric eBGP neighbor (another leaf or spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `210` |
| `$ASN_FABRIC_PEER_4` | Autonomous-system number of a fabric eBGP neighbor (another leaf or spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `211` |
| `$BGP_GROUP` | Name of an eBGP group (the underlay group or the EVPN overlay group). | `l3clos-s-evpn` |
| `$OVERLAY_PEER_V4_1` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (another leaf or spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.9` |
| `$OVERLAY_PEER_V4_2` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (another leaf or spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.8` |
| `$OVERLAY_PEER_V4_3` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (another leaf or spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.10` |
| `$OVERLAY_PEER_V4_4` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (another leaf or spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.11` |
| `$UNDERLAY_LOCAL_V4_1` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.2.131` |
| `$UNDERLAY_LOCAL_V4_2` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.2.177` |
| `$UNDERLAY_LOCAL_V4_3` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.2.129` |
| `$UNDERLAY_LOCAL_V4_4` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.2.159` |
| `$UNDERLAY_LOCAL_V4_5` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.2.145` |
| `$UNDERLAY_LOCAL_V4_6` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.2.175` |
| `$UNDERLAY_LOCAL_V4_7` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.2.151` |
| `$UNDERLAY_LOCAL_V4_8` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.2.181` |
| `$UNDERLAY_PEER_V4_1` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.2.130` |
| `$UNDERLAY_PEER_V4_2` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.2.176` |
| `$UNDERLAY_PEER_V4_3` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.2.128` |
| `$UNDERLAY_PEER_V4_4` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.2.158` |
| `$UNDERLAY_PEER_V4_5` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.2.144` |
| `$UNDERLAY_PEER_V4_6` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.2.174` |
| `$UNDERLAY_PEER_V4_7` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.2.150` |
| `$UNDERLAY_PEER_V4_8` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.2.180` |

## Policy

| Variable | What it is | Example value |
|---|---|---|
| `$BGP_EXPORT_POL` | Policy-statement name applied as a BGP `export` (in a policy form, the policy's own name). | `EVPN_EXPORT` |
| `$BGP_EXPORT_POL_1` | Policy-statement name applied as a BGP `export`; `_1`, `_2` number the members of a policy chain (`export ( A && B )`), in evaluation order. | `LEAF_TO_SPINE_EVPN_OUT` |
| `$BGP_EXPORT_POL_2` | Policy-statement name applied as a BGP `export`; `_1`, `_2` number the members of a policy chain (`export ( A && B )`), in evaluation order. | `EVPN_EXPORT` |
| `$COMMUNITY_ADMIN_1` | Administrator field of a member of a two-member community; `_1`, `_2` number the members in order. | `5` |
| `$COMMUNITY_ADMIN_2` | Administrator field of a member of a two-member community; `_1`, `_2` number the members in order. | `21001` |
| `$COMMUNITY_ASSIGNED_1` | Assigned-number field of the first member of a two-member community. | `20007` |
| `$COMMUNITY_NAME` | Name of a BGP community: in a community form, its own name; in a policy, the community it adds (`community add`). | `DEFAULT_DIRECT_V4` |
| `$COMMUNITY_NAME_1` | Name of a BGP community that a policy adds to routes (`community add`); `_1`, `_2` number the communities of one policy, in term order. | `DEFAULT_DIRECT_V4` |
| `$COMMUNITY_NAME_2` | Name of a BGP community that a policy adds to routes (`community add`); `_1`, `_2` number the communities of one policy, in term order. | `DEFAULT_DIRECT_V6` |
| `$POLICY_NAME` | Name of a routing policy referenced by `from policy` in another policy (here the direct-route policies). | `AllPodNetworks` |
| `$PPLB_NAME` | Name of the per-packet load-balancing policy that the forwarding table exports. | `PFE-LB` |
| `$TERM_NAME` | Name of the single term of a policy-statement. | `EVPN_EXPORT-4095` |
| `$TERM_NAME_1` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `AllPodNetworks-10` |
| `$TERM_NAME_2` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `AllPodNetworks-20` |
| `$TERM_NAME_3` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `AllPodNetworks-100` |
| `$TERM_NAME_4` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `BGP-AOS-Policy-100` |

## byoai/TIERS.md

> **Tier qualification for this JVD.** Only `minimum` is qualified and selectable.
> The `self-contained` and `as-deployed` lists below are not yet qualified for this
> JVD. They are not selectable: never offer or render them.

# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd data_center/aidc/aiml_multitenancy_backend`. -->

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

## Tenant VRF with EVPN Type 5 routes and two GPU server links

Family l3vpn, form tenant-vrf-evpn-type5-2-links. OS mode EVO. Attachment: Server-facing units of the GPU rail links (an IPv4 /31 address with family inet6) and the tenant loopback unit, each listed in the VRF; the IRB and router-advertisement statements of the tenant are separate snippets..

### leaf1_qfx5240-64od (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-2-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### leaf2_qfx5240-64od (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-2-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### leaf3_qfx5240-64od (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-2-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### leaf4_qfx5240-64od (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-2-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## Tenant VRF with EVPN Type 5 routes and four GPU server links

Family l3vpn, form tenant-vrf-evpn-type5-4-links. OS mode EVO. Attachment: Server-facing units of the GPU rail links (an IPv4 /31 address with family inet6) and the tenant loopback unit, each listed in the VRF; the IRB and router-advertisement statements of the tenant are separate snippets..

### leaf1_qfx5240-64od (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-4-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$AC_IFL_3
  - occurrence-selection-required: logical-interface:$AC_IFL_4
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### leaf2_qfx5240-64od (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-4-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$AC_IFL_3
  - occurrence-selection-required: logical-interface:$AC_IFL_4
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### leaf3_qfx5240-64od (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-4-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$AC_IFL_3
  - occurrence-selection-required: logical-interface:$AC_IFL_4
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### leaf4_qfx5240-64od (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-4-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$AC_IFL_3
  - occurrence-selection-required: logical-interface:$AC_IFL_4
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## byoai/DEFAULTS.md

# DEFAULTS — AI/ML Multitenancy Backend

Lab auto-fill values for the AI/ML Multitenancy Backend JVD. Every value is measured from the published device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks a device and service and asks for lab values; otherwise ask for the deployment values.

## Device inventory

| Role | Device | Platform | OS | Loopback / router-id | `$ASN` |
|------|--------|----------|----|----------------------|--------|
| Leaf | leaf1_qfx5240-64od | QFX5240-64OD | EVO | 10.0.1.9 | 208 |
| Leaf | leaf2_qfx5240-64od | QFX5240-64OD | EVO | 10.0.1.8 | 209 |
| Leaf | leaf3_qfx5240-64od | QFX5240-64OD | EVO | 10.0.1.10 | 210 |
| Leaf | leaf4_qfx5240-64od | QFX5240-64OD | EVO | 10.0.1.11 | 211 |
| Spine | spine1_qfx5240-64od | QFX5240-64OD | EVO | 10.0.0.8 | 108 |
| Spine | spine2_qfx5240-64od | QFX5240-64OD | EVO | 10.0.0.9 | 109 |
| Spine | spine3_qfx5240-64od | QFX5240-64OD | EVO | 10.0.0.10 | 110 |
| Spine | spine4_qfx5240-64od | QFX5240-64OD | EVO | 10.0.0.11 | 111 |

## Service examples (first measured instance per leaf)

| Service form | Device | Example values |
|--------------|--------|----------------|
| tenant-vrf-evpn-type5-2-links | leaf1_qfx5240-64od | `$AC_IFL_1` et-0/0/12:1.0, `$AC_IFL_2` et-0/0/16:1.0, `$INSTANCE_NAME` tenant-2, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-tenant-2, `$LOOPBACK_IFL` lo0.3, `$LOOPBACK_V4` 10.0.1.9 |
| tenant-vrf-evpn-type5-2-links | leaf2_qfx5240-64od | `$AC_IFL_1` et-0/0/12:1.0, `$AC_IFL_2` et-0/0/16:1.0, `$INSTANCE_NAME` tenant-6, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-tenant-6, `$LOOPBACK_IFL` lo0.7, `$LOOPBACK_V4` 10.0.1.8 |
| tenant-vrf-evpn-type5-2-links | leaf3_qfx5240-64od | `$AC_IFL_1` et-0/0/12:1.0, `$AC_IFL_2` et-0/0/16:1.0, `$INSTANCE_NAME` tenant-2, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-tenant-2, `$LOOPBACK_IFL` lo0.3, `$LOOPBACK_V4` 10.0.1.10 |
| tenant-vrf-evpn-type5-2-links | leaf4_qfx5240-64od | `$AC_IFL_1` et-0/0/12:1.0, `$AC_IFL_2` et-0/0/16:1.0, `$INSTANCE_NAME` tenant-6, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-tenant-6, `$LOOPBACK_IFL` lo0.7, `$LOOPBACK_V4` 10.0.1.11 |
| tenant-vrf-evpn-type5-4-links | leaf1_qfx5240-64od | `$AC_IFL_1` et-0/0/12:0.0, `$AC_IFL_2` et-0/0/16:0.0, `$AC_IFL_3` et-0/0/41:0.0, `$AC_IFL_4` et-0/0/41:1.0, `$INSTANCE_NAME` tenant-1, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-tenant-1 |
| tenant-vrf-evpn-type5-4-links | leaf2_qfx5240-64od | `$AC_IFL_1` et-0/0/12:0.0, `$AC_IFL_2` et-0/0/16:0.0, `$AC_IFL_3` et-0/0/41:0.0, `$AC_IFL_4` et-0/0/41:1.0, `$INSTANCE_NAME` tenant-5, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-tenant-5 |
| tenant-vrf-evpn-type5-4-links | leaf3_qfx5240-64od | `$AC_IFL_1` et-0/0/12:0.0, `$AC_IFL_2` et-0/0/16:0.0, `$AC_IFL_3` et-0/0/41:0.0, `$AC_IFL_4` et-0/0/41:1.0, `$INSTANCE_NAME` tenant-1, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-tenant-1 |
| tenant-vrf-evpn-type5-4-links | leaf4_qfx5240-64od | `$AC_IFL_1` et-0/0/12:0.0, `$AC_IFL_2` et-0/0/16:0.0, `$AC_IFL_3` et-0/0/41:0.0, `$AC_IFL_4` et-0/0/41:1.0, `$INSTANCE_NAME` tenant-5, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-tenant-5 |

A tenant VRF uses the same instance name, VNI and route target on every leaf; the route distinguisher starts with each leaf's own loopback.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into `jvd-aiml-mtb-snips.md` by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: minimum
# devices:
#   leaf1: { name: <hostname>, os: evo, loopback4: <addr> }
#   leaf3: { name: <hostname>, os: evo, loopback4: <addr> }
# services:
#   - { kind: <tenant-vrf-evpn-type5-2-links|tenant-vrf-evpn-type5-4-links>,
#       count: <int>,
#       start_id: <int>,
#       ac_ifl: <ifd.unit>,
#       rt: <rt_as:rt_id>,
#       rd: <admin:assigned> }
# snips_used:
#   - evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-2-ac.conf
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
- Cross-device consistency the user must verify: a tenant VRF uses the same instance name, VNI and route target on every leaf; each leaf's route distinguisher starts with that leaf's own loopback, and the server-link units and the tenant loopback unit must exist on the leaf.
- Anything that is by-pattern rather than validated on that exact device.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
