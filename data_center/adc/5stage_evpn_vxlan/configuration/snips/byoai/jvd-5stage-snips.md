# JVD 5-Stage EVPN-VXLAN Data Center snippet library

## evo/chassis/aggregated-devices-ethernet.conf

```
/*
 * Topic: Aggregated Ethernet device-count for the chassis
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $AE_DEVICE_COUNT  e.g. 1
 */
chassis {
    aggregated-devices {
        ethernet {
            device-count $AE_DEVICE_COUNT;
        }
    }
}
```

## evo/chassis/fpc-pic-0-4-ports-100g.conf

```
/*
 * Topic: Four PIC 0 ports set to 100 Gbps
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd
 * Count:
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from storage-spine1_qfx5220-32cd):
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
        }
    }
}
```

## evo/class-of-service/classifiers/cl-dscp-classifier-leaf.conf

```
/*
 * Topic: DSCP classifier dscp-classifier for the leaf forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 2
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-9-classes.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    classifiers {
        dscp dscp-classifier {
            forwarding-class fc0 {
                loss-priority low code-points 001010;
            }
            forwarding-class fc1 {
                loss-priority low code-points [ 000000 000001 000010 000011 000100 000101 000110 000111 001001 001011 001100 001101 001110 001111 010001 010011 010100 010101 010110 010111 011001 011011 011100 011101 011111 100001 100010 100011 100101 100110 100111 101001 101010 101011 101100 101101 101111 110001 110010 110011 110100 110101 110110 110111 111001 111010 111011 111100 111101 111110 111111 010010 100100 011110 100000 010000 101000 011000 ];
            }
            forwarding-class fc5 {
                loss-priority low code-points [ 001000 011010 ];
            }
            forwarding-class fc6 {
                loss-priority low code-points [ 101110 111000 ];
            }
            forwarding-class fc7 {
                loss-priority low code-points 110000;
            }
        }
    }
}
```

## evo/class-of-service/classifiers/cl-dscp-classifier-spine.conf

```
/*
 * Topic: DSCP classifier dscp-classifier for the spine and superspine forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 4
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-9-classes.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    classifiers {
        dscp dscp-classifier {
            forwarding-class fc0 {
                loss-priority low code-points 001010;
            }
            forwarding-class fc1 {
                loss-priority low code-points [ 000000 000001 000010 000011 000100 000101 000110 000111 001001 001011 001100 001101 001110 001111 010001 010011 010100 010101 010110 010111 011001 011011 011100 011101 011111 100001 100010 100011 100101 100110 100111 101001 101010 101011 101100 101101 101111 110001 110010 110011 110100 110101 110110 110111 111001 111010 111011 111100 111101 111110 111111 010010 100100 011110 ];
            }
            forwarding-class fc2 {
                loss-priority low code-points 100000;
            }
            forwarding-class fc3 {
                loss-priority low code-points [ 010000 101000 ];
            }
            forwarding-class fc4 {
                loss-priority low code-points 011000;
            }
            forwarding-class fc5 {
                loss-priority low code-points [ 001000 011010 ];
            }
            forwarding-class fc6 {
                loss-priority low code-points [ 101110 111000 ];
            }
            forwarding-class fc7 {
                loss-priority low code-points 110000;
            }
        }
    }
}
```

## evo/class-of-service/congestion-notification-profile/cnp-ieee-802-1-flow-control-queue-5.conf

```
/*
 * Topic: Congestion notification profile cnp: IEEE 802.1p code point 011 flow control on queue 5
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    congestion-notification-profile {
        cnp {
            output {
                ieee-802.1 {
                    code-point 011 {
                        flow-control-queue 5;
                    }
                }
            }
        }
    }
}
```

## evo/class-of-service/dedicated-buffer-profile-p1-egress.conf

```
/*
 * Topic: Dedicated buffer profile p1 for egress
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    dedicated-buffer-profile p1 {
        egress;
    }
}
```

## evo/class-of-service/drop-profiles/dp0-dp1.conf

```
/*
 * Topic: Drop profiles dp0 (0-20 percent fill) and dp1 (1-2 percent fill)
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    drop-profiles {
        dp0 {
            interpolate {
                fill-level [ 0 20 ];
                drop-probability [ 0 100 ];
            }
        }
        dp1 {
            interpolate {
                fill-level [ 1 2 ];
                drop-probability [ 0 100 ];
            }
        }
    }
}
```

## evo/class-of-service/forwarding-classes/fc-9-classes.conf

```
/*
 * Topic: Forwarding classes fc0 to fc7 on queues 0 to 7, and mcast-fc on queue 8
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    forwarding-classes {
        class fc0 queue-num 0;
        class fc1 queue-num 1;
        class fc2 queue-num 2;
        class fc3 queue-num 3;
        class fc4 queue-num 4;
        class fc5 queue-num 5;
        class fc6 queue-num 6;
        class fc7 queue-num 7;
        class mcast-fc queue-num 8;
    }
}
```

## evo/class-of-service/interfaces/ifd-cnp-scheduler-map-unit-0-dscp-classifier-rewrite.conf

```
/*
 * Topic: Interface with congestion notification profile cnp and scheduler map sm1, and the DSCP classifier and rewrite rule on unit 0
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   total 1
 * Pair with:
 *  - evo/class-of-service/classifiers/cl-dscp-classifier-leaf.conf
 *  - evo/class-of-service/scheduler-maps/sm1.conf
 *
 * Peers with: n/a
 * Variables (example values from storage-leaf1_qfx5130-32cd):
 *   $COS_INTF  e.g. et-0/0/2
 */
class-of-service {
    interfaces {
        $COS_INTF {
            congestion-notification-profile cnp;
            scheduler-map sm1;
            unit 0 {
                classifiers {
                    dscp dscp-classifier;
                }
                rewrite-rules {
                    dscp rw1;
                }
            }
        }
    }
}
```

## evo/class-of-service/interfaces/ifd-scheduler-map-unit-0-dscp-classifier-rewrite.conf

```
/*
 * Topic: Interface with scheduler map sm1, and the DSCP classifier and rewrite rule on unit 0
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 3
 *   storage-leaf2_qfx5130-32cd 2
 *   storage-spine1_qfx5220-32cd 34
 *   storage-spine2_qfx5220-32cd 34
 *   superspine1_qfx5230-64cd 66
 *   superspine2_qfx5230-64cd 66
 *   total 205
 * Pair with:
 *  - evo/class-of-service/scheduler-maps/sm1.conf
 *
 * Peers with: n/a
 * Variables (example values from storage-leaf1_qfx5130-32cd):
 *   $COS_INTF  e.g. et-0/0/0
 */
class-of-service {
    interfaces {
        $COS_INTF {
            scheduler-map sm1;
            unit 0 {
                classifiers {
                    dscp dscp-classifier;
                }
                rewrite-rules {
                    dscp rw1;
                }
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `classifier` (`dscp-classifier`): required, for each reference; one of `class-of-service/classifiers/cl-dscp-classifier-leaf`, `class-of-service/classifiers/cl-dscp-classifier-spine`

## evo/class-of-service/rewrite-rules/rw-dscp-rw1-leaf.conf

```
/*
 * Topic: DSCP rewrite rule rw1 for the leaf forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 6
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-9-classes.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    rewrite-rules {
        dscp rw1 {
            forwarding-class fc0 {
                loss-priority low code-point af11;
            }
            forwarding-class fc1 {
                loss-priority low code-point be;
            }
            forwarding-class fc5 {
                loss-priority low code-point cs1;
            }
            forwarding-class fc6 {
                loss-priority low code-point ef;
            }
            forwarding-class fc7 {
                loss-priority low code-point cs6;
            }
        }
    }
}
```

## evo/class-of-service/rewrite-rules/rw-dscp-rw1-spine.conf

```
/*
 * Topic: DSCP rewrite rule rw1 for the spine and superspine forwarding classes
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 4
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-9-classes.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    rewrite-rules {
        dscp rw1 {
            forwarding-class fc0 {
                loss-priority low code-point af11;
            }
            forwarding-class fc1 {
                loss-priority low code-point be;
            }
            forwarding-class fc2 {
                loss-priority low code-point cs4;
            }
            forwarding-class fc3 {
                loss-priority low code-point cs2;
            }
            forwarding-class fc4 {
                loss-priority low code-point cs3;
            }
            forwarding-class fc5 {
                loss-priority low code-point cs1;
            }
            forwarding-class fc6 {
                loss-priority low code-point ef;
            }
            forwarding-class fc7 {
                loss-priority low code-point cs6;
            }
        }
    }
}
```

## evo/class-of-service/scheduler-maps/sm1.conf

```
/*
 * Topic: Scheduler map sm1 binding fc0 to fc7 to schedulers s0 to s7
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 6
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-9-classes.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    scheduler-maps {
        sm1 {
            forwarding-class fc0 scheduler s0;
            forwarding-class fc1 scheduler s1;
            forwarding-class fc2 scheduler s2;
            forwarding-class fc3 scheduler s3;
            forwarding-class fc4 scheduler s4;
            forwarding-class fc5 scheduler s5;
            forwarding-class fc6 scheduler s6;
            forwarding-class fc7 scheduler s7;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `scheduler` (`s0`, `s1`, `s2`, `s3`, `s4`, `s5`, `s6`, `s7`): required, for each reference; one of `class-of-service/schedulers/schedulers-s0-s7-leaf`, `class-of-service/schedulers/schedulers-s0-s7-spine`

## evo/class-of-service/schedulers/schedulers-s0-s7-leaf.conf

```
/*
 * Topic: Leaf schedulers s0 to s7: transmit rates, buffer sizes, drop profiles and ECN
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    schedulers {
        s0 {
            transmit-rate percent 49;
            buffer-size percent 20;
            priority low;
            drop-profile-map loss-priority any protocol any drop-profile dp0;
            explicit-congestion-notification;
            buffer-dynamic-threshold 9;
        }
        s1 {
            transmit-rate percent 2;
            buffer-size percent 20;
            priority low;
            buffer-dynamic-threshold 7;
        }
        s2 {
            buffer-size percent 0;
        }
        s3 {
            buffer-size percent 0;
        }
        s4 {
            buffer-size percent 0;
        }
        s5 {
            transmit-rate percent 49;
            buffer-size percent 20;
            priority low;
            drop-profile-map loss-priority any protocol any drop-profile dp1;
            explicit-congestion-notification;
            buffer-dynamic-threshold 9;
        }
        s6 {
            shaping-rate 16g;
            buffer-size percent 20;
            priority strict-high;
            buffer-dynamic-threshold 7;
        }
        s7 {
            shaping-rate 8g;
            buffer-size percent 20;
            priority strict-high;
            buffer-dynamic-threshold 7;
        }
    }
}
```

## evo/class-of-service/schedulers/schedulers-s0-s7-spine.conf

```
/*
 * Topic: Spine and superspine schedulers s0 to s7: transmit rates, drop profiles and ECN
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    schedulers {
        s0 {
            transmit-rate percent 50;
            priority low;
            drop-profile-map loss-priority any protocol any drop-profile dp0;
            explicit-congestion-notification;
            buffer-dynamic-threshold 9;
        }
        s1 {
            transmit-rate percent 2;
            priority low;
        }
        s2 {
            transmit-rate percent 12;
            priority low;
            drop-profile-map loss-priority any protocol any drop-profile dp1;
            explicit-congestion-notification;
            buffer-dynamic-threshold 9;
        }
        s3 {
            transmit-rate percent 12;
            priority low;
            drop-profile-map loss-priority any protocol any drop-profile dp1;
            explicit-congestion-notification;
            buffer-dynamic-threshold 9;
        }
        s4 {
            transmit-rate percent 12;
            priority low;
            drop-profile-map loss-priority any protocol any drop-profile dp1;
            explicit-congestion-notification;
            buffer-dynamic-threshold 9;
        }
        s5 {
            transmit-rate percent 12;
            priority low;
            drop-profile-map loss-priority any protocol any drop-profile dp1;
            explicit-congestion-notification;
            buffer-dynamic-threshold 9;
        }
        s6 {
            shaping-rate 16g;
            priority strict-high;
            buffer-dynamic-threshold 7;
        }
        s7 {
            shaping-rate 8g;
            priority strict-high;
            buffer-dynamic-threshold 7;
        }
    }
}
```

## evo/class-of-service/shared-buffer-lossy.conf

```
/*
 * Topic: Shared buffer: all ingress and egress buffer in the lossy partitions
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    shared-buffer {
        ingress {
            percent 100;
            buffer-partition lossless {
                percent 0;
            }
            buffer-partition lossless-headroom {
                percent 0;
            }
            buffer-partition lossy {
                percent 100;
            }
        }
        egress {
            percent 100;
            buffer-partition lossless {
                percent 0;
            }
            buffer-partition lossy {
                percent 100;
            }
        }
    }
}
```

## evo/firewall/filter-cpp-filter-v1.conf

```
/*
 * Topic: cpp-filter-v1: the loopback control-plane protection filter: SSH, BGP, NTP and SNMP from their source prefix lists; policed ICMP; DNS, DHCP, NETCONF, BFD and OSPF; everything else discarded
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 8
 * Pair with:
 *  - evo/firewall/policer-police-5mbps.conf
 *
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $TERM_NAME_1   e.g. ssh
 *   $TERM_NAME_2   e.g. icmp
 *   $TERM_NAME_3   e.g. bgp
 *   $TERM_NAME_4   e.g. dns
 *   $TERM_NAME_5   e.g. ntp
 *   $TERM_NAME_6   e.g. dhcp
 *   $TERM_NAME_7   e.g. netconf
 *   $TERM_NAME_8   e.g. bfd
 *   $TERM_NAME_9   e.g. snmp
 *   $TERM_NAME_10  e.g. ospf
 *   $TERM_NAME_11  e.g. discard-rest
 */
firewall {
    filter cpp-filter-v1 {
        term $TERM_NAME_1 {
            from {
                source-prefix-list {
                    ssh-sources;
                }
                protocol tcp;
                port ssh;
            }
            then {
                count cpp-ssh-accept;
                accept;
            }
        }
        term $TERM_NAME_2 {
            from {
                protocol icmp;
                icmp-type [ echo-request echo-reply unreachable time-exceeded ];
            }
            then {
                policer police-5mbps;
                count cpp-icmp-accept;
            }
        }
        term $TERM_NAME_3 {
            from {
                source-prefix-list {
                    bgp-sources;
                }
                protocol tcp;
                port bgp;
            }
            then accept;
        }
        term $TERM_NAME_4 {
            from {
                protocol udp;
                source-port 53;
            }
            then {
                count cpp-dns-accept;
                accept;
            }
        }
        term $TERM_NAME_5 {
            from {
                source-prefix-list {
                    ntp-sources;
                }
                protocol udp;
                port ntp;
            }
            then {
                count cpp-ntp-accept;
                accept;
            }
        }
        term $TERM_NAME_6 {
            from {
                protocol udp;
                port dhcp;
            }
            then {
                count cpp-dhcp-accept;
                accept;
            }
        }
        term $TERM_NAME_7 {
            from {
                source-prefix-list {
                    ssh-sources;
                }
                protocol tcp;
                port 830;
            }
            then {
                count cpp-netconf-accept;
                accept;
            }
        }
        term $TERM_NAME_8 {
            from {
                protocol udp;
                port [ 1280 3784 4784 3785 ];
            }
            then {
                count cpp-bfd-accept;
                accept;
            }
        }
        term $TERM_NAME_9 {
            from {
                source-prefix-list {
                    snmp-sources;
                }
                port snmp;
            }
            then accept;
        }
        term $TERM_NAME_10 {
            from {
                protocol ospf;
            }
            then accept;
        }
        term $TERM_NAME_11 {
            then {
                count cpp-discard-rest;
                discard;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policer` (`police-5mbps`): required, for each reference; `firewall/policer-police-5mbps`

## evo/firewall/filter-ethernet-switching-allowed-from-host.conf

```
/*
 * Topic: ALLOWED_FROM_HOST: Ethernet-switching filter that discards IPv4 and IPv6 multicast-MAC frames from hosts and accepts the rest
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from storage-leaf1_qfx5130-32cd):
 *   $TERM_NAME_1  e.g. BLOCK_RFC1112
 *   $TERM_NAME_2  e.g. BLOCK_RFC2464
 *   $TERM_NAME_3  e.g. ALLOW_ALL
 */
firewall {
    family ethernet-switching {
        filter ALLOWED_FROM_HOST {
            term $TERM_NAME_1 {
                from {
                    destination-mac-address {
                        01:00:5e:00:00:00/25;
                    }
                }
                then discard;
            }
            term $TERM_NAME_2 {
                from {
                    destination-mac-address {
                        33:33:00:00:00:00/16;
                    }
                }
                then discard;
            }
            term $TERM_NAME_3 {
                then accept;
            }
        }
    }
}
```

## evo/firewall/policer-police-5mbps.conf

```
/*
 * Topic: police-5mbps: a 5-Mbps policer that discards excess traffic
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
firewall {
    policer police-5mbps {
        if-exceeding {
            bandwidth-limit 5m;
            burst-size-limit 5m;
        }
        then discard;
    }
}
```

## evo/forwarding-options/enhanced-hash-key-ecmp-dlb-flowlet.conf

```
/*
 * Topic: ECMP dynamic load balancing in flowlet mode, with inactivity interval and flowset table size
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    enhanced-hash-key {
        ecmp-dlb {
            flowlet {
                inactivity-interval 50;
                flowset-table-size 256;
            }
        }
    }
}
```

## evo/forwarding-options/multicast-replication-evpn-irb-enhanced-oism.conf

```
/*
 * Topic: EVPN multicast replication with enhanced OISM on IRB interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    multicast-replication {
        evpn {
            irb enhanced-oism;
        }
    }
}
```

## evo/forwarding-options/storm-control-profile1-all.conf

```
/*
 * Topic: Storm-control profile profile1 for all traffic at a fixed bandwidth level
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    storm-control-profiles profile1 {
        all {
            bandwidth-level 10000000;
        }
    }
}
```

## evo/forwarding-options/vxlan-tos-copy-filter.conf

```
/*
 * Topic: Copy the inner ToS to the VXLAN header
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    vxlan-tos-copy-filter;
}
```

## evo/interfaces/ifd-ae-esi-all-active-lacp-system-id.conf

```
/*
 * Topic: Aggregated Ethernet interface for an ESI-LAG: all-active Ethernet segment, active LACP with a fixed system ID and a 9216-byte MTU
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 4
 * Pair with: none
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $AE_BUNDLE    e.g. ae1
 *   $DESCRIPTION  e.g. to.sys003-001-002
 *   $ESI          e.g. 00:02:00:00:00:00:03:00:00:03
 *   $LACP_SYS_ID  e.g. 02:00:00:00:00:03
 */
interfaces {
    $AE_BUNDLE {
        description $DESCRIPTION;
        mtu 9216;
        esi {
            $ESI;
            all-active;
        }
        aggregated-ether-options {
            lacp {
                active;
                system-id $LACP_SYS_ID;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `lag-member`: when the router's configuration has it, all related; one of `interfaces/ifd-description-ae-member`, `interfaces/ifd-lag-member-ether-description-speed-10g`

## evo/interfaces/ifd-breakout-description-10g.conf

```
/*
 * Topic: Port broken out into 10-Gbps sub-ports, with a description
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from storage-leaf1_qfx5130-32cd):
 *   $IFD                 e.g. et-0/0/8
 *   $DESCRIPTION         e.g. "Breakout et-0/0/8"
 *   $BREAKOUT_SUB_PORTS  e.g. 4
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        number-of-sub-ports $BREAKOUT_SUB_PORTS;
        speed 10g;
    }
}
```

## evo/interfaces/ifd-description-ae-member.conf

```
/*
 * Topic: Access port with a description, a member of an aggregated Ethernet bundle
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from storage-leaf1_qfx5130-32cd):
 *   $AC_INTF      e.g. et-0/0/8:1
 *   $DESCRIPTION  e.g. to.sys002-001-003
 *   $AE_BUNDLE    e.g. ae1
 */
interfaces {
    $AC_INTF {
        description $DESCRIPTION;
        ether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## evo/interfaces/ifd-description-flexible-vlan-tagging-native-vlan-speed-10g.conf

```
/*
 * Topic: 10-Gbps access port with a description, flexible VLAN tagging and native VLAN 1
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $AC_INTF      e.g. et-0/0/7
 *   $DESCRIPTION  e.g. to.mx-external
 */
interfaces {
    $AC_INTF {
        description $DESCRIPTION;
        flexible-vlan-tagging;
        native-vlan-id 1;
        speed 10g;
    }
}
```

## evo/interfaces/ifd-description-mtu-9216.conf

```
/*
 * Topic: Physical interface with a description and a 9216-byte MTU
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 4
 *   storage-spine2_qfx5220-32cd 4
 *   total 10
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from storage-leaf1_qfx5130-32cd):
 *   $IFD          e.g. et-0/0/8:0
 *   $DESCRIPTION  e.g. to.sys002-001-002
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        mtu 9216;
    }
}
```

## evo/interfaces/ifd-description-speed-100g-mtu-9216.conf

```
/*
 * Topic: 100-Gbps fabric port with a description and a 9216-byte MTU
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 2
 *   services-leaf2_qfx5130-48c 2
 *   storage-leaf1_qfx5130-32cd 3
 *   storage-leaf2_qfx5130-32cd 2
 *   superspine1_qfx5230-64cd 6
 *   superspine2_qfx5230-64cd 6
 *   total 21
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $CORE_PHYS    e.g. et-0/0/48
 *   $DESCRIPTION  e.g. facing_spine003-001-1:et-0/0/4
 */
interfaces {
    $CORE_PHYS {
        description $DESCRIPTION;
        speed 100g;
        mtu 9216;
    }
}
```

## evo/interfaces/ifd-description-speed-10g-mtu-9216.conf

```
/*
 * Topic: 10-Gbps access port with a description and a 9216-byte MTU
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $AC_INTF      e.g. et-0/0/5
 *   $DESCRIPTION  e.g. to.sys003-001-001
 */
interfaces {
    $AC_INTF {
        description $DESCRIPTION;
        speed 10g;
        mtu 9216;
    }
}
```

## evo/interfaces/ifd-disable.conf

```
/*
 * Topic: Administratively disabled port
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 155
 *   storage-leaf2_qfx5130-32cd 155
 *   storage-spine1_qfx5220-32cd 192
 *   storage-spine2_qfx5220-32cd 192
 *   superspine1_qfx5230-64cd 256
 *   superspine2_qfx5230-64cd 256
 *   total 1206
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from storage-leaf1_qfx5130-32cd):
 *   $IFD  e.g. et-0/0/0:0
 */
interfaces {
    $IFD {
        disable;
    }
}
```

## evo/interfaces/ifd-lag-member-ether-description-speed-10g.conf

```
/*
 * Topic: Described 10G member link of an aggregated-Ethernet bundle
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $IFD          e.g. et-0/0/6
 *   $DESCRIPTION  e.g. to.sys003-001-002
 *   $AE_BUNDLE    e.g. ae1
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        speed 10g;
        ether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## evo/interfaces/ifl-core-inet-inet6-mtu-9170.conf

```
/*
 * Topic: Unit 0 with an IPv4 and an IPv6 address and a 9170-byte family MTU on a fabric link
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 2
 *   services-leaf2_qfx5130-48c 2
 *   storage-leaf1_qfx5130-32cd 2
 *   storage-leaf2_qfx5130-32cd 2
 *   storage-spine1_qfx5220-32cd 4
 *   storage-spine2_qfx5220-32cd 4
 *   superspine1_qfx5230-64cd 6
 *   superspine2_qfx5230-64cd 6
 *   total 28
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $CORE_PHYS     e.g. et-0/0/48
 *   $CORE_V4_ADDR  e.g. 10.0.1.41/31
 *   $CORE_V6_ADDR  e.g. fdf6:ed70:1fac:f2d4::29/127
 */
interfaces {
    $CORE_PHYS {
        unit 0 {
            family inet {
                mtu 9170;
                address $CORE_V4_ADDR;
            }
            family inet6 {
                mtu 9170;
                address $CORE_V6_ADDR;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-description-mtu-9216`, `interfaces/ifd-description-speed-100g-mtu-9216`

## evo/interfaces/ifl-ethernet-switching-trunk-vlans-filter-storm-control.conf

```
/*
 * Topic: Unit 0 as an Ethernet-switching trunk carrying the MAC-VRF VLANs, with the ALLOWED_FROM_HOST input filter and storm control
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   total 1
 * Pair with:
 *  - evo/firewall/filter-ethernet-switching-allowed-from-host.conf
 *
 * Peers with: n/a
 * Variables (example values from storage-leaf1_qfx5130-32cd):
 *   $AC_INTF     e.g. et-0/0/2
 *   $BD_NAME_1   e.g. vn400
 *   $BD_NAME_2   e.g. vn401
 *   $BD_NAME_3   e.g. vn402
 *   $BD_NAME_4   e.g. vn403
 *   $BD_NAME_5   e.g. vn404
 *   $BD_NAME_6   e.g. vn405
 *   $BD_NAME_7   e.g. vn406
 *   $BD_NAME_8   e.g. vn407
 *   $BD_NAME_9   e.g. vn408
 *   $BD_NAME_10  e.g. vn409
 */
interfaces {
    $AC_INTF {
        unit 0 {
            family ethernet-switching {
                interface-mode trunk;
                vlan {
                    members [ $BD_NAME_1 $BD_NAME_2 $BD_NAME_3 $BD_NAME_4 $BD_NAME_5 $BD_NAME_6 $BD_NAME_7 $BD_NAME_8 $BD_NAME_9 $BD_NAME_10 ];
                }
                filter {
                    input ALLOWED_FROM_HOST;
                }
                storm-control profile1;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-description-speed-100g-mtu-9216`

## evo/interfaces/ifl-ethernet-switching-trunk-vlans.conf

```
/*
 * Topic: Unit 0 as an Ethernet-switching trunk carrying the MAC-VRF VLANs
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 2
 *   services-leaf2_qfx5130-48c 2
 *   storage-leaf1_qfx5130-32cd 2
 *   storage-leaf2_qfx5130-32cd 2
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $AC_INTF     e.g. ae1
 *   $BD_NAME_1   e.g. vn400
 *   $BD_NAME_2   e.g. vn401
 *   $BD_NAME_3   e.g. vn402
 *   $BD_NAME_4   e.g. vn403
 *   $BD_NAME_5   e.g. vn404
 *   $BD_NAME_6   e.g. vn405
 *   $BD_NAME_7   e.g. vn406
 *   $BD_NAME_8   e.g. vn407
 *   $BD_NAME_9   e.g. vn408
 *   $BD_NAME_10  e.g. vn409
 *   $BD_NAME_11  e.g. vn430
 *   $BD_NAME_12  e.g. vn431
 *   $BD_NAME_13  e.g. vn432
 *   $BD_NAME_14  e.g. vn433
 *   $BD_NAME_15  e.g. vn434
 *   $BD_NAME_16  e.g. vn435
 *   $BD_NAME_17  e.g. vn436
 *   $BD_NAME_18  e.g. vn437
 *   $BD_NAME_19  e.g. vn438
 *   $BD_NAME_20  e.g. vn439
 *   $BD_NAME_21  e.g. vn1400
 *   $BD_NAME_22  e.g. vn1401
 *   $BD_NAME_23  e.g. vn1402
 *   $BD_NAME_24  e.g. vn1403
 *   $BD_NAME_25  e.g. vn1404
 *   $BD_NAME_26  e.g. vn1405
 *   $BD_NAME_27  e.g. vn1406
 *   $BD_NAME_28  e.g. vn1407
 *   $BD_NAME_29  e.g. vn1408
 *   $BD_NAME_30  e.g. vn1409
 *   $BD_NAME_31  e.g. vn1430
 *   $BD_NAME_32  e.g. vn1431
 *   $BD_NAME_33  e.g. vn1432
 *   $BD_NAME_34  e.g. vn1433
 *   $BD_NAME_35  e.g. vn1434
 *   $BD_NAME_36  e.g. vn1435
 *   $BD_NAME_37  e.g. vn1436
 *   $BD_NAME_38  e.g. vn1437
 *   $BD_NAME_39  e.g. vn1438
 *   $BD_NAME_40  e.g. vn1439
 *   $BD_NAME_41  e.g. vn3100
 *   $BD_NAME_42  e.g. vn3101
 *   $BD_NAME_43  e.g. vn3102
 *   $BD_NAME_44  e.g. vn3103
 *   $BD_NAME_45  e.g. vn3104
 *   $BD_NAME_46  e.g. vn3105
 *   $BD_NAME_47  e.g. vn3106
 *   $BD_NAME_48  e.g. vn3107
 *   $BD_NAME_49  e.g. vn3108
 *   $BD_NAME_50  e.g. vn3109
 */
interfaces {
    $AC_INTF {
        unit 0 {
            family ethernet-switching {
                interface-mode trunk;
                vlan {
                    members [ $BD_NAME_1 $BD_NAME_2 $BD_NAME_3 $BD_NAME_4 $BD_NAME_5 $BD_NAME_6 $BD_NAME_7 $BD_NAME_8 $BD_NAME_9 $BD_NAME_10 $BD_NAME_11 $BD_NAME_12 $BD_NAME_13 $BD_NAME_14 $BD_NAME_15 $BD_NAME_16 $BD_NAME_17 $BD_NAME_18 $BD_NAME_19 $BD_NAME_20 $BD_NAME_21 $BD_NAME_22 $BD_NAME_23 $BD_NAME_24 $BD_NAME_25 $BD_NAME_26 $BD_NAME_27 $BD_NAME_28 $BD_NAME_29 $BD_NAME_30 $BD_NAME_31 $BD_NAME_32 $BD_NAME_33 $BD_NAME_34 $BD_NAME_35 $BD_NAME_36 $BD_NAME_37 $BD_NAME_38 $BD_NAME_39 $BD_NAME_40 $BD_NAME_41 $BD_NAME_42 $BD_NAME_43 $BD_NAME_44 $BD_NAME_45 $BD_NAME_46 $BD_NAME_47 $BD_NAME_48 $BD_NAME_49 $BD_NAME_50 ];
                }
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-ae-esi-all-active-lacp-system-id`, `interfaces/ifd-description-mtu-9216`, `interfaces/ifd-description-speed-10g-mtu-9216`
- `lag-member`: when the router's configuration has it, all related; one of `interfaces/ifd-description-ae-member`, `interfaces/ifd-lag-member-ether-description-speed-10g`

## evo/interfaces/ifl-loopback-0-inet-filter-inet6.conf

```
/*
 * Topic: Loopback unit 0 with IPv4 and IPv6 addresses and the cpp-filter-v1 input filter
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 8
 * Pair with:
 *  - evo/firewall/filter-cpp-filter-v1.conf
 *
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $LOOPBACK_V4_PFX  e.g. 192.168.252.12/32
 *   $LOOPBACK_V6_PFX  e.g. fdf6:ed70:1fac:f2d1::100c/128
 */
interfaces {
    lo0 {
        unit 0 {
            family inet {
                filter {
                    input cpp-filter-v1;
                }
                address $LOOPBACK_V4_PFX;
            }
            family inet6 {
                address $LOOPBACK_V6_PFX;
            }
        }
    }
}
```

## evo/interfaces/ifl-loopback-inet-inet6.conf

```
/*
 * Topic: Loopback unit with one IPv4 and one IPv6 address
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 5
 *   services-leaf2_qfx5130-48c 5
 *   storage-leaf1_qfx5130-32cd 3
 *   storage-leaf2_qfx5130-32cd 3
 *   total 16
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $UNIT             e.g. 2
 *   $LOOPBACK_V4_PFX  e.g. 192.168.14.0/32
 *   $LOOPBACK_V6_PFX  e.g. fdf6:ed70:1fac:f2d4::2000/128
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

## evo/interfaces/ifl-unit-0-inet-no-address.conf

```
/*
 * Topic: Unit 0 with family inet and no address, on a port that carries no traffic in the design
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 53
 *   services-leaf2_qfx5130-48c 53
 *   storage-leaf1_qfx5130-32cd 76
 *   storage-leaf2_qfx5130-32cd 77
 *   storage-spine1_qfx5220-32cd 30
 *   storage-spine2_qfx5220-32cd 30
 *   superspine1_qfx5230-64cd 60
 *   superspine2_qfx5230-64cd 60
 *   total 439
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $IFD  e.g. et-0/0/0
 */
interfaces {
    $IFD {
        unit 0 {
            family inet;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-disable`

## evo/interfaces/ifl-vlan-inet-inet6-description.conf

```
/*
 * Topic: VLAN unit with a description and IPv4 and IPv6 addresses
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 5
 *   services-leaf2_qfx5130-48c 5
 *   total 10
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $IFD          e.g. et-0/0/7
 *   $UNIT         e.g. 399
 *   $DESCRIPTION  e.g. "VRF yellow to mx-external"
 *   $VLAN         e.g. 399
 *   $AC_ADDR_V4   e.g. 10.204.0.0/31
 *   $AC_ADDR_V6   e.g. 2001:db8:dc4:10:204::4/127
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
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-description-flexible-vlan-tagging-native-vlan-speed-10g`

## evo/interfaces/irb-inet-inet6-mtu-9000-mac-no-dhcp-flood.conf

```
/*
 * Topic: IRB unit with IPv4 and IPv6 gateway addresses, a 9000-byte family MTU, a MAC address and no DHCP flooding
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 2
 *   services-leaf2_qfx5130-48c 2
 *   storage-leaf1_qfx5130-32cd 2
 *   storage-leaf2_qfx5130-32cd 2
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $IRB_UNIT     e.g. 400
 *   $IRB_ADDR     e.g. 10.0.0.1/24
 *   $IRB_ADDR_V6  e.g. 2001:db8:dc4:10:00:00::1/96
 *   $IRB_MAC      e.g. 00:1c:73:00:00:01
 */
interfaces {
    irb {
        unit $IRB_UNIT {
            family inet {
                mtu 9000;
                address $IRB_ADDR;
            }
            family inet6 {
                mtu 9000;
                address $IRB_ADDR_V6;
            }
            mac $IRB_MAC;
            no-dhcp-flood;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/irb-mtu-9216`

## evo/interfaces/irb-inet-inet6-mtu-9000-mac.conf

```
/*
 * Topic: IRB unit with IPv4 and IPv6 gateway addresses, a 9000-byte family MTU and a MAC address
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 48
 *   services-leaf2_qfx5130-48c 48
 *   storage-leaf1_qfx5130-32cd 48
 *   storage-leaf2_qfx5130-32cd 48
 *   total 192
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $IRB_UNIT     e.g. 401
 *   $IRB_ADDR     e.g. 10.0.1.1/24
 *   $IRB_ADDR_V6  e.g. 2001:db8:dc4:10:00:01::1/96
 *   $IRB_MAC      e.g. 00:1c:73:00:00:01
 */
interfaces {
    irb {
        unit $IRB_UNIT {
            family inet {
                mtu 9000;
                address $IRB_ADDR;
            }
            family inet6 {
                mtu 9000;
                address $IRB_ADDR_V6;
            }
            mac $IRB_MAC;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/irb-mtu-9216`

## evo/interfaces/irb-inet-virtual-gateway-mtu-9000.conf

```
/*
 * Topic: IRB unit with an IPv4 address, a virtual gateway address and MAC, and virtual-gateway-accept-data
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $IRB_UNIT  e.g. 3500
 *   $IRB_ADDR  e.g. 10.200.0.6/24
 *   $VGA       e.g. 10.200.0.1
 */
interfaces {
    irb {
        unit $IRB_UNIT {
            virtual-gateway-accept-data;
            family inet {
                mtu 9000;
                address $IRB_ADDR {
                    virtual-gateway-address $VGA;
                }
            }
            virtual-gateway-v4-mac 00:1c:73:00:00:01;
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
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
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
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 22
 *   services-leaf2_qfx5130-48c 22
 *   storage-leaf1_qfx5130-32cd 8
 *   storage-leaf2_qfx5130-32cd 8
 *   storage-spine1_qfx5220-32cd 2
 *   storage-spine2_qfx5220-32cd 2
 *   superspine1_qfx5230-64cd 2
 *   superspine2_qfx5230-64cd 2
 *   total 68
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $COMMUNITY_NAME        e.g. DEFAULT_DIRECT_V4
 *   $COMMUNITY_ADMIN_1     e.g. 13
 *   $COMMUNITY_ASSIGNED_1  e.g. 20007
 *   $COMMUNITY_ADMIN_2     e.g. 21001
 */
policy-options {
    community $COMMUNITY_NAME members [ $COMMUNITY_ADMIN_1:$COMMUNITY_ASSIGNED_1 $COMMUNITY_ADMIN_2:26000 ];
}
```

## evo/policy-options/community/fabric-communities.conf

```
/*
 * Topic: FABRIC_COMMUNITIES: the tier and Apstra communities removed from routes sent to the external router
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    community FABRIC_COMMUNITIES members [ 0:12 0:13 0:14 0:15 .+:200.. 2....:260.. ];
}
```

## evo/policy-options/community/from-spine-evpn-tier.conf

```
/*
 * Topic: FROM_SPINE_EVPN_TIER: the community that marks routes advertised by the spine EVPN tier
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   total 6
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
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    community FROM_SPINE_FABRIC_TIER members 0:15;
}
```

## evo/policy-options/community/from-superspine-evpn-tier.conf

```
/*
 * Topic: FROM_SUPERSPINE_EVPN_TIER: the community that marks routes advertised by the superspine EVPN tier
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    community FROM_SUPERSPINE_EVPN_TIER members 0:12;
}
```

## evo/policy-options/community/from-superspine-fabric-tier.conf

```
/*
 * Topic: FROM_SUPERSPINE_FABRIC_TIER: the community that marks routes advertised by the superspine tier
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    community FROM_SUPERSPINE_FABRIC_TIER members 0:13;
}
```

## evo/policy-options/policy-statement/per-packet-load-balance-no-term.conf

```
/*
 * Topic: Per-packet load-balancing policy without terms
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
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

## evo/policy-options/policy-statement/ps-accept-all.conf

```
/*
 * Topic: Export policy with one term that accepts every route
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
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
 *   EVO: storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd
 * Count:
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   total 2
 * Pair with:
 *  - evo/policy-options/community/from-spine-evpn-tier.conf
 *
 * Peers with: n/a
 * Variables (example values from storage-spine1_qfx5220-32cd):
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
 *   EVO: storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd
 * Count:
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   total 2
 * Pair with:
 *  - evo/policy-options/community/from-spine-fabric-tier.conf
 *
 * Peers with: n/a
 * Variables (example values from storage-spine1_qfx5220-32cd):
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

## evo/policy-options/policy-statement/ps-add-from-superspine-evpn-tier-accept.conf

```
/*
 * Topic: Superspine EVPN export policy that tags every route FROM_SUPERSPINE_EVPN_TIER and accepts it
 * Seen on:
 *   Junos: (none)
 *   EVO: superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 2
 * Pair with:
 *  - evo/policy-options/community/from-superspine-evpn-tier.conf
 *
 * Peers with: n/a
 * Variables (example values from superspine1_qfx5230-64cd):
 *   $BGP_EXPORT_POL  e.g. SUPERSPINE_TO_SPINE_EVPN_OUT
 *   $TERM_NAME       e.g. SUPERSPINE_TO_SPINE_EVPN_OUT-10
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME {
            then {
                community add FROM_SUPERSPINE_EVPN_TIER;
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-add-from-superspine-tier-accept.conf

```
/*
 * Topic: Superspine export policy that tags every route FROM_SUPERSPINE_FABRIC_TIER and accepts it
 * Seen on:
 *   Junos: (none)
 *   EVO: superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 2
 * Pair with:
 *  - evo/policy-options/community/from-superspine-fabric-tier.conf
 *
 * Peers with: n/a
 * Variables (example values from superspine1_qfx5230-64cd):
 *   $BGP_EXPORT_POL  e.g. SUPERSPINE_TO_SPINE_FABRIC_OUT
 *   $TERM_NAME       e.g. SUPERSPINE_TO_SPINE_FABRIC_OUT-10
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME {
            then {
                community add FROM_SUPERSPINE_FABRIC_TIER;
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
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 6
 *   services-leaf2_qfx5130-48c 6
 *   storage-leaf1_qfx5130-32cd 4
 *   storage-leaf2_qfx5130-32cd 4
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 24
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $POLICY_NAME       e.g. AllPodNetworks-blue
 *   $TERM_NAME_1       e.g. AllPodNetworks-blue-10
 *   $COMMUNITY_NAME_1  e.g. BLUE_COMMUNITY_V4
 *   $TERM_NAME_2       e.g. AllPodNetworks-blue-20
 *   $COMMUNITY_NAME_2  e.g. BLUE_COMMUNITY_V6
 *   $TERM_NAME_3       e.g. AllPodNetworks-blue-100
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
 *   EVO: storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from storage-spine1_qfx5220-32cd):
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

## evo/policy-options/policy-statement/ps-from-policy-bgp-evpn-host-routes-accept-reject.conf

```
/*
 * Topic: Export policy that accepts the routes another policy accepts, BGP routes and EVPN IPv4 /32 and IPv6 /128 host routes, and rejects everything else
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $BGP_EXPORT_POL  e.g. BGP-AOS-Policy
 *   $TERM_NAME_1     e.g. BGP-AOS-Policy-10
 *   $POLICY_NAME     e.g. AllPodNetworks
 *   $TERM_NAME_2     e.g. BGP-AOS-Policy-20
 *   $TERM_NAME_3     e.g. BGP-AOS-Policy-50
 *   $TERM_NAME_4     e.g. BGP-AOS-Policy-60
 *   $TERM_NAME_5     e.g. BGP-AOS-Policy-100
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
            from {
                protocol evpn;
                route-filter 0.0.0.0/0 prefix-length-range /32-/32;
            }
            then accept;
        }
        term $TERM_NAME_4 {
            from {
                protocol evpn;
                route-filter 0::0/0 prefix-length-range /128-/128;
            }
            then accept;
        }
        term $TERM_NAME_5 {
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-from-policy-bgp-evpn-host-routes-community-add-reject.conf

```
/*
 * Topic: EVPN Type 5 export policy that accepts the routes another policy accepts and BGP routes, adds a community to EVPN IPv4 /32 and IPv6 /128 host routes, and rejects everything else
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 5
 *   services-leaf2_qfx5130-48c 5
 *   total 10
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $IP_PREFIX_EXPORT_POL  e.g. BGP-AOS-Policy-blue
 *   $TERM_NAME_1           e.g. BGP-AOS-Policy-blue-10
 *   $POLICY_NAME           e.g. AllPodNetworks-blue
 *   $TERM_NAME_2           e.g. BGP-AOS-Policy-blue-20
 *   $TERM_NAME_3           e.g. BGP-AOS-Policy-blue-50
 *   $COMMUNITY_NAME_1      e.g. BLUE_COMMUNITY_V4
 *   $TERM_NAME_4           e.g. BGP-AOS-Policy-blue-60
 *   $COMMUNITY_NAME_2      e.g. BLUE_COMMUNITY_V6
 *   $TERM_NAME_5           e.g. BGP-AOS-Policy-blue-100
 */
policy-options {
    policy-statement $IP_PREFIX_EXPORT_POL {
        term $TERM_NAME_1 {
            from policy $POLICY_NAME;
            then accept;
        }
        term $TERM_NAME_2 {
            from protocol bgp;
            then accept;
        }
        term $TERM_NAME_3 {
            from {
                protocol evpn;
                route-filter 0.0.0.0/0 prefix-length-range /32-/32;
            }
            then {
                community add $COMMUNITY_NAME_1;
                accept;
            }
        }
        term $TERM_NAME_4 {
            from {
                protocol evpn;
                route-filter 0::0/0 prefix-length-range /128-/128;
            }
            then {
                community add $COMMUNITY_NAME_2;
                accept;
            }
        }
        term $TERM_NAME_5 {
            then reject;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `community` (`$COMMUNITY_NAME_1`, `$COMMUNITY_NAME_2`): required, for each reference; `policy-options/community/community-2-members`

## evo/policy-options/policy-statement/ps-from-policy-evpn-host-routes-accept-reject.conf

```
/*
 * Topic: Export policy that accepts the routes another policy accepts and EVPN IPv4 /32 and IPv6 /128 host routes, and rejects everything else
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from storage-leaf1_qfx5130-32cd):
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
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 3
 *   storage-leaf2_qfx5130-32cd 3
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from storage-leaf1_qfx5130-32cd):
 *   $IP_PREFIX_EXPORT_POL  e.g. BGP-AOS-Policy-blue
 *   $TERM_NAME_1           e.g. BGP-AOS-Policy-blue-10
 *   $POLICY_NAME           e.g. AllPodNetworks-blue
 *   $TERM_NAME_2           e.g. BGP-AOS-Policy-blue-50
 *   $COMMUNITY_NAME_1      e.g. BLUE_COMMUNITY_V4
 *   $TERM_NAME_3           e.g. BGP-AOS-Policy-blue-60
 *   $COMMUNITY_NAME_2      e.g. BLUE_COMMUNITY_V6
 *   $TERM_NAME_4           e.g. BGP-AOS-Policy-blue-100
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
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 4
 * Pair with:
 *  - evo/policy-options/community/from-spine-evpn-tier.conf
 *
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
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
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 4
 * Pair with:
 *  - evo/policy-options/community/from-spine-fabric-tier.conf
 *
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
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

## evo/policy-options/policy-statement/ps-reject-bgp-from-superspine-evpn-tier-accept.conf

```
/*
 * Topic: Spine EVPN export policy toward the superspines that rejects BGP routes tagged FROM_SUPERSPINE_EVPN_TIER and accepts every other route
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd
 * Count:
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   total 2
 * Pair with:
 *  - evo/policy-options/community/from-superspine-evpn-tier.conf
 *
 * Peers with: n/a
 * Variables (example values from storage-spine1_qfx5220-32cd):
 *   $BGP_EXPORT_POL  e.g. SPINE_TO_SUPERSPINE_EVPN_OUT
 *   $TERM_NAME_1     e.g. SPINE_TO_SUPERSPINE_EVPN_OUT-10
 *   $TERM_NAME_2     e.g. SPINE_TO_SUPERSPINE_EVPN_OUT-20
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                protocol bgp;
                community FROM_SUPERSPINE_EVPN_TIER;
            }
            then reject;
        }
        term $TERM_NAME_2 {
            then accept;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-reject-bgp-from-superspine-tier-accept.conf

```
/*
 * Topic: Spine export policy toward the superspines that rejects BGP routes tagged FROM_SUPERSPINE_FABRIC_TIER and accepts every other route
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd
 * Count:
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   total 2
 * Pair with:
 *  - evo/policy-options/community/from-superspine-fabric-tier.conf
 *
 * Peers with: n/a
 * Variables (example values from storage-spine1_qfx5220-32cd):
 *   $BGP_EXPORT_POL  e.g. SPINE_TO_SUPERSPINE_FABRIC_OUT
 *   $TERM_NAME_1     e.g. SPINE_TO_SUPERSPINE_FABRIC_OUT-10
 *   $TERM_NAME_2     e.g. SPINE_TO_SUPERSPINE_FABRIC_OUT-20
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                protocol bgp;
                community FROM_SUPERSPINE_FABRIC_TIER;
            }
            then reject;
        }
        term $TERM_NAME_2 {
            then accept;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-route-filter-list-inet-inet6-community-add-reject.conf

```
/*
 * Topic: VRF import policy from the external router that accepts the IPv4 and IPv6 routes in two route-filter lists, each with a community added, and rejects everything else
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 5
 *   services-leaf2_qfx5130-48c 5
 *   total 10
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $BGP_IMPORT_POL       e.g. RoutesFromExt-blue-external_router
 *   $TERM_NAME_1          e.g. RoutesFromExt-blue-external_router-10
 *   $ROUTE_FILTER_LIST_1  e.g. RoutesFromExt-blue-external_router
 *   $COMMUNITY_NAME_1     e.g. RoutesFromExt-blue-external_router
 *   $TERM_NAME_2          e.g. RoutesFromExt-blue-external_router-20
 *   $ROUTE_FILTER_LIST_2  e.g. RoutesFromExtV6-blue-external_router
 *   $COMMUNITY_NAME_2     e.g. RoutesFromExtV6-blue-external_router
 *   $TERM_NAME_3          e.g. RoutesFromExt-blue-external_router-30
 *   $TERM_NAME_4          e.g. RoutesFromExt-blue-external_router-40
 */
policy-options {
    policy-statement $BGP_IMPORT_POL {
        term $TERM_NAME_1 {
            from {
                family inet;
                route-filter-list $ROUTE_FILTER_LIST_1;
            }
            then {
                community add $COMMUNITY_NAME_1;
                accept;
            }
        }
        term $TERM_NAME_2 {
            from {
                family inet6;
                route-filter-list $ROUTE_FILTER_LIST_2;
            }
            then {
                community add $COMMUNITY_NAME_2;
                accept;
            }
        }
        term $TERM_NAME_3 {
            from family inet;
            then reject;
        }
        term $TERM_NAME_4 {
            from family inet6;
            then reject;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `community` (`$COMMUNITY_NAME_1`, `$COMMUNITY_NAME_2`): required, for each reference; `policy-options/community/community-2-members`
- `route-filter-list` (`$ROUTE_FILTER_LIST_1`, `$ROUTE_FILTER_LIST_2`): required, for each reference; one of `policy-options/route-filter-list/rfl-inet-default-exact`, `policy-options/route-filter-list/rfl-inet6-default-exact`

## evo/policy-options/policy-statement/ps-route-filter-list-inet-inet6-community-delete-reject.conf

```
/*
 * Topic: VRF export policy toward the external router that accepts the IPv4 and IPv6 routes in two route-filter lists with the fabric communities removed, and rejects everything else
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 5
 *   services-leaf2_qfx5130-48c 5
 *   total 10
 * Pair with:
 *  - evo/policy-options/community/fabric-communities.conf
 *
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $BGP_EXPORT_POL       e.g. RoutesToExt-blue-external_router
 *   $TERM_NAME_1          e.g. RoutesToExt-blue-external_router-10
 *   $ROUTE_FILTER_LIST_1  e.g. RoutesToExt-blue-external_router
 *   $TERM_NAME_2          e.g. RoutesToExt-blue-external_router-20
 *   $ROUTE_FILTER_LIST_2  e.g. RoutesToExtV6-blue-external_router
 *   $TERM_NAME_3          e.g. RoutesToExt-blue-external_router-30
 *   $TERM_NAME_4          e.g. RoutesToExt-blue-external_router-40
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                family inet;
                route-filter-list $ROUTE_FILTER_LIST_1;
            }
            then {
                community delete FABRIC_COMMUNITIES;
                accept;
            }
        }
        term $TERM_NAME_2 {
            from {
                family inet6;
                route-filter-list $ROUTE_FILTER_LIST_2;
            }
            then {
                community delete FABRIC_COMMUNITIES;
                accept;
            }
        }
        term $TERM_NAME_3 {
            from family inet;
            then reject;
        }
        term $TERM_NAME_4 {
            from family inet6;
            then reject;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `route-filter-list` (`$ROUTE_FILTER_LIST_1`, `$ROUTE_FILTER_LIST_2`): required, for each reference; one of `policy-options/route-filter-list/rfl-inet-any-3-prefixes-upto-32`, `policy-options/route-filter-list/rfl-inet-any-4-prefixes-upto-32`, `policy-options/route-filter-list/rfl-inet-any-5-prefixes-upto-32`, `policy-options/route-filter-list/rfl-inet6-any-3-prefixes-upto-128`, `policy-options/route-filter-list/rfl-inet6-any-4-prefixes-upto-128`, `policy-options/route-filter-list/rfl-inet6-any-5-prefixes-upto-128`

## evo/policy-options/prefix-list/bgp-sources.conf

```
/*
 * Topic: bgp-sources: prefixes allowed to reach BGP on the loopback
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    prefix-list bgp-sources {
        10.0.0.0/8;
        192.0.0.0/8;
        2001::/24;
        fdf6::/24;
    }
}
```

## evo/policy-options/prefix-list/ntp-sources.conf

```
/*
 * Topic: ntp-sources: prefixes allowed to reach NTP on the loopback
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    prefix-list ntp-sources {
        10.0.0.0/8;
        172.0.0.0/8;
        192.0.0.0/8;
    }
}
```

## evo/policy-options/prefix-list/snmp-sources.conf

```
/*
 * Topic: snmp-sources: prefixes allowed to reach SNMP on the loopback
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    prefix-list snmp-sources {
        10.0.0.0/8;
        172.0.0.0/8;
        192.0.0.0/8;
    }
}
```

## evo/policy-options/prefix-list/ssh-sources.conf

```
/*
 * Topic: ssh-sources: prefixes allowed to reach SSH on the loopback
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    prefix-list ssh-sources {
        10.0.0.0/8;
        172.0.0.0/8;
        192.0.0.0/8;
    }
}
```

## evo/policy-options/route-filter-list/rfl-inet-any-3-prefixes-upto-32.conf

```
/*
 * Topic: Route-filter list with any IPv4 prefix and three tenant prefixes up to /32
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $ROUTE_FILTER_LIST  e.g. RoutesToExt-yellow-external_router
 */
policy-options {
    route-filter-list $ROUTE_FILTER_LIST {
        0.0.0.0/0 prefix-length-range /1-/32;
        10.31.0.0/21 upto /32;
        10.31.8.0/23 upto /32;
        192.168.14.2/31 upto /32;
    }
}
```

## evo/policy-options/route-filter-list/rfl-inet-any-4-prefixes-upto-32.conf

```
/*
 * Topic: Route-filter list with any IPv4 prefix and four tenant prefixes up to /32
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 3
 *   services-leaf2_qfx5130-48c 3
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $ROUTE_FILTER_LIST  e.g. RoutesToExt-red-external_router
 *   $PREFIX_1           e.g. 10.0.0.0/19
 *   $PREFIX_2           e.g. 10.0.32.0/21
 *   $PREFIX_3           e.g. 192.168.14.0/31
 *   $PREFIX_4           e.g. 192.168.14.16/30
 */
policy-options {
    route-filter-list $ROUTE_FILTER_LIST {
        0.0.0.0/0 prefix-length-range /1-/32;
        $PREFIX_1 upto /32;
        $PREFIX_2 upto /32;
        $PREFIX_3 upto /32;
        $PREFIX_4 upto /32;
    }
}
```

## evo/policy-options/route-filter-list/rfl-inet-any-5-prefixes-upto-32.conf

```
/*
 * Topic: Route-filter list with any IPv4 prefix and five tenant prefixes up to /32
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $ROUTE_FILTER_LIST  e.g. RoutesToExt-blue-external_router
 */
policy-options {
    route-filter-list $ROUTE_FILTER_LIST {
        0.0.0.0/0 prefix-length-range /1-/32;
        10.10.0.0/19 upto /32;
        10.10.32.0/21 upto /32;
        10.200.0.0/24 upto /32;
        192.168.14.4/31 upto /32;
        192.168.14.12/30 upto /32;
    }
}
```

## evo/policy-options/route-filter-list/rfl-inet-default-exact.conf

```
/*
 * Topic: Route-filter list with the IPv4 default route, exact
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 5
 *   services-leaf2_qfx5130-48c 5
 *   total 10
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $ROUTE_FILTER_LIST  e.g. RoutesFromExt-blue-external_router
 */
policy-options {
    route-filter-list $ROUTE_FILTER_LIST {
        0.0.0.0/0 exact;
    }
}
```

## evo/policy-options/route-filter-list/rfl-inet6-any-3-prefixes-upto-128.conf

```
/*
 * Topic: Route-filter list with any IPv6 prefix and three tenant prefixes up to /128
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $ROUTE_FILTER_LIST  e.g. RoutesToExtV6-yellow-external_router
 */
policy-options {
    route-filter-list $ROUTE_FILTER_LIST {
        ::/0 prefix-length-range /1-/128;
        2001:db8:dc4:10:1f::/93 upto /128;
        2001:db8:dc4:10:1f:8::/95 upto /128;
        fdf6:ed70:1fac:f2d4::2002/127 upto /128;
    }
}
```

## evo/policy-options/route-filter-list/rfl-inet6-any-4-prefixes-upto-128.conf

```
/*
 * Topic: Route-filter list with any IPv6 prefix and four tenant prefixes up to /128
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 2
 *   services-leaf2_qfx5130-48c 2
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $ROUTE_FILTER_LIST  e.g. RoutesToExtV6-green-external_router
 *   $PREFIX_1           e.g. 2001:db8:dc4:10:19::/93
 *   $PREFIX_2           e.g. 2001:db8:dc4:10:19:8::/95
 *   $PREFIX_3           e.g. fdf6:ed70:1fac:f2d4::2006/127
 *   $PREFIX_4           e.g. fdf6:ed70:1fac:f2d4::200e/127
 */
policy-options {
    route-filter-list $ROUTE_FILTER_LIST {
        ::/0 prefix-length-range /1-/128;
        $PREFIX_1 upto /128;
        $PREFIX_2 upto /128;
        $PREFIX_3 upto /128;
        $PREFIX_4 upto /128;
    }
}
```

## evo/policy-options/route-filter-list/rfl-inet6-any-5-prefixes-upto-128.conf

```
/*
 * Topic: Route-filter list with any IPv6 prefix and five tenant prefixes up to /128
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 2
 *   services-leaf2_qfx5130-48c 2
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $ROUTE_FILTER_LIST  e.g. RoutesToExtV6-red-external_router
 *   $PREFIX_1           e.g. 2001:db8:dc4:10::/91
 *   $PREFIX_2           e.g. 2001:db8:dc4:10:0:20::/93
 *   $PREFIX_3           e.g. fdf6:ed70:1fac:f2d4::2000/127
 *   $PREFIX_4           e.g. fdf6:ed70:1fac:f2d4::200a/127
 *   $PREFIX_5           e.g. fdf6:ed70:1fac:f2d4::200c/127
 */
policy-options {
    route-filter-list $ROUTE_FILTER_LIST {
        ::/0 prefix-length-range /1-/128;
        $PREFIX_1 upto /128;
        $PREFIX_2 upto /128;
        $PREFIX_3 upto /128;
        $PREFIX_4 upto /128;
        $PREFIX_5 upto /128;
    }
}
```

## evo/policy-options/route-filter-list/rfl-inet6-default-exact.conf

```
/*
 * Topic: Route-filter list with the IPv6 default route, exact
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 5
 *   services-leaf2_qfx5130-48c 5
 *   total 10
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $ROUTE_FILTER_LIST  e.g. RoutesFromExtV6-blue-external_router
 */
policy-options {
    route-filter-list $ROUTE_FILTER_LIST {
        0::0/0 exact;
    }
}
```

## evo/protocols/bgp-group-ebgp-evpn-overlay-2-peers-bfd-export-2-policies.conf

```
/*
 * Topic: Leaf eBGP EVPN overlay group with two spine loopback peers, BFD and a two-policy export chain
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 4
 * Pair with: none
 * Peers with:
 *   [services-leaf1_qfx5130-48c] <-> [services-spine1_qfx5210-64c]
 *   [services-leaf1_qfx5130-48c] <-> [services-spine2_qfx5210-64c]
 *   [services-leaf2_qfx5130-48c] <-> [services-spine1_qfx5210-64c]
 *   [services-leaf2_qfx5130-48c] <-> [services-spine2_qfx5210-64c]
 *   [storage-leaf1_qfx5130-32cd] <-> [storage-spine1_qfx5220-32cd]
 *   [storage-leaf1_qfx5130-32cd] <-> [storage-spine2_qfx5220-32cd]
 *   [storage-leaf2_qfx5130-32cd] <-> [storage-spine1_qfx5220-32cd]
 *   [storage-leaf2_qfx5130-32cd] <-> [storage-spine2_qfx5220-32cd]
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $BGP_GROUP          e.g. l3clos-l-evpn
 *   $OVERLAY_PEER_V4_1  e.g. 192.168.252.6
 *   $DESCRIPTION_1      e.g. facing_spine003-001-1-evpn-overlay
 *   $LOOPBACK_V4        e.g. 192.168.252.12
 *   $BGP_EXPORT_POL_1   e.g. LEAF_TO_SPINE_EVPN_OUT
 *   $BGP_EXPORT_POL_2   e.g. EVPN_EXPORT
 *   $ASN_FABRIC_PEER    e.g. 64703
 *   $OVERLAY_PEER_V4_2  e.g. 192.168.252.7
 *   $DESCRIPTION_2      e.g. facing_spine003-001-2-evpn-overlay
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
                peer-as $ASN_FABRIC_PEER;
            }
            neighbor $OVERLAY_PEER_V4_2 {
                description $DESCRIPTION_2;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER;
            }
            vpn-apply-export;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$BGP_EXPORT_POL_1`, `$BGP_EXPORT_POL_2`): required, for each reference; one of `policy-options/policy-statement/ps-accept-all`, `policy-options/policy-statement/ps-reject-bgp-from-spine-evpn-tier-accept`

## evo/protocols/bgp-group-ebgp-evpn-overlay-4-peers-bfd-export-1-policy.conf

```
/*
 * Topic: Spine eBGP EVPN overlay group with four loopback peers (two leaves and two superspines), BFD and one export policy per peer
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd
 * Count:
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   total 2
 * Pair with: none
 * Peers with:
 *   [storage-leaf1_qfx5130-32cd] <-> [storage-spine1_qfx5220-32cd]
 *   [storage-leaf1_qfx5130-32cd] <-> [storage-spine2_qfx5220-32cd]
 *   [storage-leaf2_qfx5130-32cd] <-> [storage-spine1_qfx5220-32cd]
 *   [storage-leaf2_qfx5130-32cd] <-> [storage-spine2_qfx5220-32cd]
 *   [storage-spine1_qfx5220-32cd] <-> [superspine1_qfx5230-64cd]
 *   [storage-spine1_qfx5220-32cd] <-> [superspine2_qfx5230-64cd]
 *   [storage-spine2_qfx5220-32cd] <-> [superspine1_qfx5230-64cd]
 *   [storage-spine2_qfx5220-32cd] <-> [superspine2_qfx5230-64cd]
 * Variables (example values from storage-spine1_qfx5220-32cd):
 *   $BGP_GROUP          e.g. l3clos-s-evpn
 *   $OVERLAY_PEER_V4_1  e.g. 192.168.252.10
 *   $DESCRIPTION_1      e.g. facing_leaf002-001-1-evpn-overlay
 *   $LOOPBACK_V4        e.g. 192.168.252.4
 *   $BGP_EXPORT_POL_1   e.g. SPINE_TO_LEAF_EVPN_OUT
 *   $ASN_FABRIC_PEER_1  e.g. 64706
 *   $OVERLAY_PEER_V4_2  e.g. 192.168.252.11
 *   $DESCRIPTION_2      e.g. facing_leaf002-001-2-evpn-overlay
 *   $ASN_FABRIC_PEER_2  e.g. 64707
 *   $OVERLAY_PEER_V4_3  e.g. 192.168.252.0
 *   $DESCRIPTION_3      e.g. facing_sspine001-1-evpn-overlay
 *   $BGP_EXPORT_POL_2   e.g. SPINE_TO_SUPERSPINE_EVPN_OUT
 *   $ASN_FABRIC_PEER_3  e.g. 64700
 *   $OVERLAY_PEER_V4_4  e.g. 192.168.252.1
 *   $DESCRIPTION_4      e.g. facing_sspine001-2-evpn-overlay
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
                export ( $BGP_EXPORT_POL_1 );
                peer-as $ASN_FABRIC_PEER_1;
            }
            neighbor $OVERLAY_PEER_V4_2 {
                description $DESCRIPTION_2;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL_1 );
                peer-as $ASN_FABRIC_PEER_2;
            }
            neighbor $OVERLAY_PEER_V4_3 {
                description $DESCRIPTION_3;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
            }
            neighbor $OVERLAY_PEER_V4_4 {
                description $DESCRIPTION_4;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
            }
            vpn-apply-export;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$BGP_EXPORT_POL_1`, `$BGP_EXPORT_POL_2`): required, for each reference; one of `policy-options/policy-statement/ps-add-from-spine-evpn-tier-accept`, `policy-options/policy-statement/ps-reject-bgp-from-superspine-evpn-tier-accept`

## evo/protocols/bgp-group-ebgp-evpn-overlay-6-peers-bfd-export-1-policy.conf

```
/*
 * Topic: Superspine eBGP EVPN overlay group with six spine loopback peers, BFD and one export policy
 * Seen on:
 *   Junos: (none)
 *   EVO: superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 2
 * Pair with: none
 * Peers with:
 *   [compute-spine1_qfx5210-64c] <-> [superspine1_qfx5230-64cd]
 *   [compute-spine1_qfx5210-64c] <-> [superspine2_qfx5230-64cd]
 *   [compute-spine2_qfx5210-64c] <-> [superspine1_qfx5230-64cd]
 *   [compute-spine2_qfx5210-64c] <-> [superspine2_qfx5230-64cd]
 *   [services-spine1_qfx5210-64c] <-> [superspine1_qfx5230-64cd]
 *   [services-spine1_qfx5210-64c] <-> [superspine2_qfx5230-64cd]
 *   [services-spine2_qfx5210-64c] <-> [superspine1_qfx5230-64cd]
 *   [services-spine2_qfx5210-64c] <-> [superspine2_qfx5230-64cd]
 *   [storage-spine1_qfx5220-32cd] <-> [superspine1_qfx5230-64cd]
 *   [storage-spine1_qfx5220-32cd] <-> [superspine2_qfx5230-64cd]
 *   [storage-spine2_qfx5220-32cd] <-> [superspine1_qfx5230-64cd]
 *   [storage-spine2_qfx5220-32cd] <-> [superspine2_qfx5230-64cd]
 * Variables (example values from superspine1_qfx5230-64cd):
 *   $BGP_GROUP          e.g. l3clos-s-evpn
 *   $OVERLAY_PEER_V4_1  e.g. 192.168.252.2
 *   $DESCRIPTION_1      e.g. facing_spine001-001-1-evpn-overlay
 *   $LOOPBACK_V4        e.g. 192.168.252.0
 *   $BGP_EXPORT_POL     e.g. SUPERSPINE_TO_SPINE_EVPN_OUT
 *   $ASN_FABRIC_PEER_1  e.g. 64701
 *   $OVERLAY_PEER_V4_2  e.g. 192.168.252.3
 *   $DESCRIPTION_2      e.g. facing_spine001-001-2-evpn-overlay
 *   $OVERLAY_PEER_V4_3  e.g. 192.168.252.4
 *   $DESCRIPTION_3      e.g. facing_spine002-001-1-evpn-overlay
 *   $ASN_FABRIC_PEER_2  e.g. 64702
 *   $OVERLAY_PEER_V4_4  e.g. 192.168.252.5
 *   $DESCRIPTION_4      e.g. facing_spine002-001-2-evpn-overlay
 *   $OVERLAY_PEER_V4_5  e.g. 192.168.252.6
 *   $DESCRIPTION_5      e.g. facing_spine003-001-1-evpn-overlay
 *   $ASN_FABRIC_PEER_3  e.g. 64703
 *   $OVERLAY_PEER_V4_6  e.g. 192.168.252.7
 *   $DESCRIPTION_6      e.g. facing_spine003-001-2-evpn-overlay
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
                peer-as $ASN_FABRIC_PEER_1;
            }
            neighbor $OVERLAY_PEER_V4_3 {
                description $DESCRIPTION_3;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL );
                peer-as $ASN_FABRIC_PEER_2;
            }
            neighbor $OVERLAY_PEER_V4_4 {
                description $DESCRIPTION_4;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL );
                peer-as $ASN_FABRIC_PEER_2;
            }
            neighbor $OVERLAY_PEER_V4_5 {
                description $DESCRIPTION_5;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL );
                peer-as $ASN_FABRIC_PEER_3;
            }
            neighbor $OVERLAY_PEER_V4_6 {
                description $DESCRIPTION_6;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL );
                peer-as $ASN_FABRIC_PEER_3;
            }
            vpn-apply-export;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$BGP_EXPORT_POL`): required, for each reference; `policy-options/policy-statement/ps-add-from-superspine-evpn-tier-accept`

## evo/protocols/bgp-group-ebgp-underlay-2-peers-dual-stack-bfd-export-2-policies.conf

```
/*
 * Topic: Leaf eBGP underlay group with two spine peers over IPv4 and IPv6, BFD and a two-policy export chain
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 4
 * Pair with: none
 * Peers with:
 *   [services-leaf1_qfx5130-48c] <-> [services-spine1_qfx5210-64c]
 *   [services-leaf1_qfx5130-48c] <-> [services-spine2_qfx5210-64c]
 *   [services-leaf2_qfx5130-48c] <-> [services-spine1_qfx5210-64c]
 *   [services-leaf2_qfx5130-48c] <-> [services-spine2_qfx5210-64c]
 *   [storage-leaf1_qfx5130-32cd] <-> [storage-spine1_qfx5220-32cd]
 *   [storage-leaf1_qfx5130-32cd] <-> [storage-spine2_qfx5220-32cd]
 *   [storage-leaf2_qfx5130-32cd] <-> [storage-spine1_qfx5220-32cd]
 *   [storage-leaf2_qfx5130-32cd] <-> [storage-spine2_qfx5220-32cd]
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $BGP_GROUP            e.g. l3clos-l
 *   $UNDERLAY_PEER_V6_1   e.g. fdf6:ed70:1fac:f2d4::28
 *   $DESCRIPTION_1        e.g. facing_spine003-001-1
 *   $UNDERLAY_LOCAL_V6_1  e.g. fdf6:ed70:1fac:f2d4::29
 *   $BGP_EXPORT_POL_1     e.g. LEAF_TO_SPINE_FABRIC_OUT
 *   $BGP_EXPORT_POL_2     e.g. BGP-AOS-Policy
 *   $ASN_FABRIC_PEER      e.g. 64703
 *   $UNDERLAY_PEER_V6_2   e.g. fdf6:ed70:1fac:f2d4::2c
 *   $DESCRIPTION_2        e.g. facing_spine003-001-2
 *   $UNDERLAY_LOCAL_V6_2  e.g. fdf6:ed70:1fac:f2d4::2d
 *   $UNDERLAY_PEER_V4_1   e.g. 10.0.1.40
 *   $UNDERLAY_LOCAL_V4_1  e.g. 10.0.1.41
 *   $UNDERLAY_PEER_V4_2   e.g. 10.0.1.44
 *   $UNDERLAY_LOCAL_V4_2  e.g. 10.0.1.45
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
            neighbor $UNDERLAY_PEER_V6_1 {
                description $DESCRIPTION_1;
                local-address $UNDERLAY_LOCAL_V6_1;
                family inet6 {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER;
            }
            neighbor $UNDERLAY_PEER_V6_2 {
                description $DESCRIPTION_2;
                local-address $UNDERLAY_LOCAL_V6_2;
                family inet6 {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER;
            }
            neighbor $UNDERLAY_PEER_V4_1 {
                description $DESCRIPTION_1;
                local-address $UNDERLAY_LOCAL_V4_1;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER;
            }
            neighbor $UNDERLAY_PEER_V4_2 {
                description $DESCRIPTION_2;
                local-address $UNDERLAY_LOCAL_V4_2;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER;
            }
            vpn-apply-export;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$BGP_EXPORT_POL_1`, `$BGP_EXPORT_POL_2`): required, for each reference; one of `policy-options/policy-statement/ps-from-policy-bgp-evpn-host-routes-accept-reject`, `policy-options/policy-statement/ps-from-policy-evpn-host-routes-accept-reject`, `policy-options/policy-statement/ps-reject-bgp-from-spine-tier-accept`

## evo/protocols/bgp-group-ebgp-underlay-4-peers-dual-stack-bfd-export-2-policies.conf

```
/*
 * Topic: Spine eBGP underlay group with four peers (two leaves and two superspines) over IPv4 and IPv6, BFD and two-policy export chains
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd
 * Count:
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   total 2
 * Pair with: none
 * Peers with:
 *   [storage-leaf1_qfx5130-32cd] <-> [storage-spine1_qfx5220-32cd]
 *   [storage-leaf1_qfx5130-32cd] <-> [storage-spine2_qfx5220-32cd]
 *   [storage-leaf2_qfx5130-32cd] <-> [storage-spine1_qfx5220-32cd]
 *   [storage-leaf2_qfx5130-32cd] <-> [storage-spine2_qfx5220-32cd]
 *   [storage-spine1_qfx5220-32cd] <-> [superspine1_qfx5230-64cd]
 *   [storage-spine1_qfx5220-32cd] <-> [superspine2_qfx5230-64cd]
 *   [storage-spine2_qfx5220-32cd] <-> [superspine1_qfx5230-64cd]
 *   [storage-spine2_qfx5220-32cd] <-> [superspine2_qfx5230-64cd]
 * Variables (example values from storage-spine1_qfx5220-32cd):
 *   $BGP_GROUP            e.g. l3clos-s
 *   $UNDERLAY_PEER_V6_1   e.g. fdf6:ed70:1fac:f2d4::21
 *   $DESCRIPTION_1        e.g. facing_leaf002-001-1
 *   $UNDERLAY_LOCAL_V6_1  e.g. fdf6:ed70:1fac:f2d4::20
 *   $BGP_EXPORT_POL_1     e.g. SPINE_TO_LEAF_FABRIC_OUT
 *   $BGP_EXPORT_POL_2     e.g. BGP-AOS-Policy
 *   $ASN_FABRIC_PEER_1    e.g. 64706
 *   $UNDERLAY_PEER_V6_2   e.g. fdf6:ed70:1fac:f2d4::23
 *   $DESCRIPTION_2        e.g. facing_leaf002-001-2
 *   $UNDERLAY_LOCAL_V6_2  e.g. fdf6:ed70:1fac:f2d4::22
 *   $ASN_FABRIC_PEER_2    e.g. 64707
 *   $UNDERLAY_PEER_V6_3   e.g. fdf6:ed70:1fac:f2d4::9
 *   $DESCRIPTION_3        e.g. facing_sspine001-1
 *   $UNDERLAY_LOCAL_V6_3  e.g. fdf6:ed70:1fac:f2d4::8
 *   $BGP_EXPORT_POL_3     e.g. SPINE_TO_SUPERSPINE_FABRIC_OUT
 *   $ASN_FABRIC_PEER_3    e.g. 64700
 *   $UNDERLAY_PEER_V6_4   e.g. fdf6:ed70:1fac:f2d4::b
 *   $DESCRIPTION_4        e.g. facing_sspine001-2
 *   $UNDERLAY_LOCAL_V6_4  e.g. fdf6:ed70:1fac:f2d4::a
 *   $UNDERLAY_PEER_V4_1   e.g. 10.0.1.33
 *   $UNDERLAY_LOCAL_V4_1  e.g. 10.0.1.32
 *   $UNDERLAY_PEER_V4_2   e.g. 10.0.1.35
 *   $UNDERLAY_LOCAL_V4_2  e.g. 10.0.1.34
 *   $UNDERLAY_PEER_V4_3   e.g. 10.0.1.9
 *   $UNDERLAY_LOCAL_V4_3  e.g. 10.0.1.8
 *   $UNDERLAY_PEER_V4_4   e.g. 10.0.1.11
 *   $UNDERLAY_LOCAL_V4_4  e.g. 10.0.1.10
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
            neighbor $UNDERLAY_PEER_V6_1 {
                description $DESCRIPTION_1;
                local-address $UNDERLAY_LOCAL_V6_1;
                family inet6 {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_1;
            }
            neighbor $UNDERLAY_PEER_V6_2 {
                description $DESCRIPTION_2;
                local-address $UNDERLAY_LOCAL_V6_2;
                family inet6 {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_2;
            }
            neighbor $UNDERLAY_PEER_V6_3 {
                description $DESCRIPTION_3;
                local-address $UNDERLAY_LOCAL_V6_3;
                family inet6 {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_3 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
            }
            neighbor $UNDERLAY_PEER_V6_4 {
                description $DESCRIPTION_4;
                local-address $UNDERLAY_LOCAL_V6_4;
                family inet6 {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_3 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
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
                description $DESCRIPTION_2;
                local-address $UNDERLAY_LOCAL_V4_2;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_2;
            }
            neighbor $UNDERLAY_PEER_V4_3 {
                description $DESCRIPTION_3;
                local-address $UNDERLAY_LOCAL_V4_3;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_3 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
            }
            neighbor $UNDERLAY_PEER_V4_4 {
                description $DESCRIPTION_4;
                local-address $UNDERLAY_LOCAL_V4_4;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_3 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
            }
            vpn-apply-export;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$BGP_EXPORT_POL_1`, `$BGP_EXPORT_POL_2`, `$BGP_EXPORT_POL_3`): required, for each reference; one of `policy-options/policy-statement/ps-add-from-spine-tier-accept`, `policy-options/policy-statement/ps-from-policy-bgp-accept-reject`, `policy-options/policy-statement/ps-reject-bgp-from-superspine-tier-accept`

## evo/protocols/bgp-group-ebgp-underlay-6-peers-dual-stack-bfd-export-2-policies.conf

```
/*
 * Topic: Superspine eBGP underlay group with six spine peers over IPv4 and IPv6, BFD and a two-policy export chain
 * Seen on:
 *   Junos: (none)
 *   EVO: superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 2
 * Pair with: none
 * Peers with:
 *   [compute-spine1_qfx5210-64c] <-> [superspine1_qfx5230-64cd]
 *   [compute-spine1_qfx5210-64c] <-> [superspine2_qfx5230-64cd]
 *   [compute-spine2_qfx5210-64c] <-> [superspine1_qfx5230-64cd]
 *   [compute-spine2_qfx5210-64c] <-> [superspine2_qfx5230-64cd]
 *   [services-spine1_qfx5210-64c] <-> [superspine1_qfx5230-64cd]
 *   [services-spine1_qfx5210-64c] <-> [superspine2_qfx5230-64cd]
 *   [services-spine2_qfx5210-64c] <-> [superspine1_qfx5230-64cd]
 *   [services-spine2_qfx5210-64c] <-> [superspine2_qfx5230-64cd]
 *   [storage-spine1_qfx5220-32cd] <-> [superspine1_qfx5230-64cd]
 *   [storage-spine1_qfx5220-32cd] <-> [superspine2_qfx5230-64cd]
 *   [storage-spine2_qfx5220-32cd] <-> [superspine1_qfx5230-64cd]
 *   [storage-spine2_qfx5220-32cd] <-> [superspine2_qfx5230-64cd]
 * Variables (example values from superspine1_qfx5230-64cd):
 *   $BGP_GROUP            e.g. l3clos-s
 *   $UNDERLAY_PEER_V6_1   e.g. fdf6:ed70:1fac:f2d4::
 *   $DESCRIPTION_1        e.g. facing_spine001-001-1
 *   $UNDERLAY_LOCAL_V6_1  e.g. fdf6:ed70:1fac:f2d4::1
 *   $BGP_EXPORT_POL_1     e.g. SUPERSPINE_TO_SPINE_FABRIC_OUT
 *   $BGP_EXPORT_POL_2     e.g. BGP-AOS-Policy
 *   $ASN_FABRIC_PEER_1    e.g. 64701
 *   $UNDERLAY_PEER_V6_2   e.g. fdf6:ed70:1fac:f2d4::4
 *   $DESCRIPTION_2        e.g. facing_spine001-001-2
 *   $UNDERLAY_LOCAL_V6_2  e.g. fdf6:ed70:1fac:f2d4::5
 *   $UNDERLAY_PEER_V6_3   e.g. fdf6:ed70:1fac:f2d4::8
 *   $DESCRIPTION_3        e.g. facing_spine002-001-1
 *   $UNDERLAY_LOCAL_V6_3  e.g. fdf6:ed70:1fac:f2d4::9
 *   $ASN_FABRIC_PEER_2    e.g. 64702
 *   $UNDERLAY_PEER_V6_4   e.g. fdf6:ed70:1fac:f2d4::c
 *   $DESCRIPTION_4        e.g. facing_spine002-001-2
 *   $UNDERLAY_LOCAL_V6_4  e.g. fdf6:ed70:1fac:f2d4::d
 *   $UNDERLAY_PEER_V6_5   e.g. fdf6:ed70:1fac:f2d4::10
 *   $DESCRIPTION_5        e.g. facing_spine003-001-1
 *   $UNDERLAY_LOCAL_V6_5  e.g. fdf6:ed70:1fac:f2d4::11
 *   $ASN_FABRIC_PEER_3    e.g. 64703
 *   $UNDERLAY_PEER_V6_6   e.g. fdf6:ed70:1fac:f2d4::14
 *   $DESCRIPTION_6        e.g. facing_spine003-001-2
 *   $UNDERLAY_LOCAL_V6_6  e.g. fdf6:ed70:1fac:f2d4::15
 *   $UNDERLAY_PEER_V4_1   e.g. 10.0.1.0
 *   $UNDERLAY_LOCAL_V4_1  e.g. 10.0.1.1
 *   $UNDERLAY_PEER_V4_2   e.g. 10.0.1.4
 *   $UNDERLAY_LOCAL_V4_2  e.g. 10.0.1.5
 *   $UNDERLAY_PEER_V4_3   e.g. 10.0.1.8
 *   $UNDERLAY_LOCAL_V4_3  e.g. 10.0.1.9
 *   $UNDERLAY_PEER_V4_4   e.g. 10.0.1.12
 *   $UNDERLAY_LOCAL_V4_4  e.g. 10.0.1.13
 *   $UNDERLAY_PEER_V4_5   e.g. 10.0.1.16
 *   $UNDERLAY_LOCAL_V4_5  e.g. 10.0.1.17
 *   $UNDERLAY_PEER_V4_6   e.g. 10.0.1.20
 *   $UNDERLAY_LOCAL_V4_6  e.g. 10.0.1.21
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
            neighbor $UNDERLAY_PEER_V6_1 {
                description $DESCRIPTION_1;
                local-address $UNDERLAY_LOCAL_V6_1;
                family inet6 {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_1;
            }
            neighbor $UNDERLAY_PEER_V6_2 {
                description $DESCRIPTION_2;
                local-address $UNDERLAY_LOCAL_V6_2;
                family inet6 {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_1;
            }
            neighbor $UNDERLAY_PEER_V6_3 {
                description $DESCRIPTION_3;
                local-address $UNDERLAY_LOCAL_V6_3;
                family inet6 {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_2;
            }
            neighbor $UNDERLAY_PEER_V6_4 {
                description $DESCRIPTION_4;
                local-address $UNDERLAY_LOCAL_V6_4;
                family inet6 {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_2;
            }
            neighbor $UNDERLAY_PEER_V6_5 {
                description $DESCRIPTION_5;
                local-address $UNDERLAY_LOCAL_V6_5;
                family inet6 {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
            }
            neighbor $UNDERLAY_PEER_V6_6 {
                description $DESCRIPTION_6;
                local-address $UNDERLAY_LOCAL_V6_6;
                family inet6 {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
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
                description $DESCRIPTION_2;
                local-address $UNDERLAY_LOCAL_V4_2;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_1;
            }
            neighbor $UNDERLAY_PEER_V4_3 {
                description $DESCRIPTION_3;
                local-address $UNDERLAY_LOCAL_V4_3;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_2;
            }
            neighbor $UNDERLAY_PEER_V4_4 {
                description $DESCRIPTION_4;
                local-address $UNDERLAY_LOCAL_V4_4;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_2;
            }
            neighbor $UNDERLAY_PEER_V4_5 {
                description $DESCRIPTION_5;
                local-address $UNDERLAY_LOCAL_V4_5;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
            }
            neighbor $UNDERLAY_PEER_V4_6 {
                description $DESCRIPTION_6;
                local-address $UNDERLAY_LOCAL_V4_6;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
            }
            vpn-apply-export;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$BGP_EXPORT_POL_1`, `$BGP_EXPORT_POL_2`): required, for each reference; one of `policy-options/policy-statement/ps-add-from-superspine-tier-accept`, `policy-options/policy-statement/ps-from-policy-bgp-accept-reject`

## evo/protocols/bgp-log-updown-graceful-restart-multipath.conf

```
/*
 * Topic: BGP global options: log-updown, graceful restart without helping on shared-fate BFD down, and multipath
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
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

## evo/protocols/igmp-interface-all.conf

```
/*
 * Topic: IGMP on all interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 4
 * Pair with: none
 * Variables: none
 */
protocols {
    igmp {
        interface all;
    }
}
```

## evo/protocols/l2-learning-telemetry-remote-entries.conf

```
/*
 * Topic: Layer 2 learning telemetry that includes remote entries
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
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
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
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
 * Topic: IPv6 router advertisements on one logical interface (a fabric link or an IRB unit), with 30-second maximum and 10-second minimum intervals
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 57
 *   services-leaf2_qfx5130-48c 57
 *   storage-leaf1_qfx5130-32cd 52
 *   storage-leaf2_qfx5130-32cd 52
 *   storage-spine1_qfx5220-32cd 4
 *   storage-spine2_qfx5220-32cd 4
 *   superspine1_qfx5230-64cd 6
 *   superspine2_qfx5230-64cd 6
 *   total 238
 * Pair with: none
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $IFL  e.g. et-0/0/48.0
 */
protocols {
    router-advertisement {
        interface $IFL {
            max-advertisement-interval 30;
            min-advertisement-interval 10;
        }
    }
}
```

## evo/protocols/rstp-bridge-priority-0-bpdu-block-on-edge.conf

```
/*
 * Topic: RSTP with bridge priority 0 and BPDU block on edge ports
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 4
 * Pair with: none
 * Variables: none
 */
protocols {
    rstp {
        bridge-priority 0;
        bpdu-block-on-edge;
    }
}
```

## evo/protocols/rstp-disable.conf

```
/*
 * Topic: RSTP disabled
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
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

## evo/protocols/rstp-interface-edge.conf

```
/*
 * Topic: RSTP edge port
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 2
 *   services-leaf2_qfx5130-48c 2
 *   storage-leaf1_qfx5130-32cd 3
 *   storage-leaf2_qfx5130-32cd 2
 *   total 9
 * Pair with: none
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $AC_INTF  e.g. ae1
 */
protocols {
    rstp {
        interface $AC_INTF {
            edge;
        }
    }
}
```

## evo/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-oism-2-ac.conf

```
/*
 * Topic: VLAN-aware EVPN-VXLAN MAC-VRF with 51 VLANs, IGMP snooping, OISM and two access interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   total 2
 * Pair with: none
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $INSTANCE_NAME   e.g. evpn-1
 *   $VNI_1           e.g. 10400
 *   $VNI_2           e.g. 10401
 *   $VNI_3           e.g. 10402
 *   $VNI_4           e.g. 10403
 *   $VNI_5           e.g. 10404
 *   $VNI_6           e.g. 10405
 *   $VNI_7           e.g. 10406
 *   $VNI_8           e.g. 10407
 *   $VNI_9           e.g. 10408
 *   $VNI_10          e.g. 10409
 *   $VNI_11          e.g. 10430
 *   $VNI_12          e.g. 10431
 *   $VNI_13          e.g. 10432
 *   $VNI_14          e.g. 10433
 *   $VNI_15          e.g. 10434
 *   $VNI_16          e.g. 10435
 *   $VNI_17          e.g. 10436
 *   $VNI_18          e.g. 10437
 *   $VNI_19          e.g. 10438
 *   $VNI_20          e.g. 10439
 *   $VNI_21          e.g. 11400
 *   $VNI_22          e.g. 11401
 *   $VNI_23          e.g. 11402
 *   $VNI_24          e.g. 11403
 *   $VNI_25          e.g. 11404
 *   $VNI_26          e.g. 11405
 *   $VNI_27          e.g. 11406
 *   $VNI_28          e.g. 11407
 *   $VNI_29          e.g. 11408
 *   $VNI_30          e.g. 11409
 *   $VNI_31          e.g. 11430
 *   $VNI_32          e.g. 11431
 *   $VNI_33          e.g. 11432
 *   $VNI_34          e.g. 11433
 *   $VNI_35          e.g. 11434
 *   $VNI_36          e.g. 11435
 *   $VNI_37          e.g. 11436
 *   $VNI_38          e.g. 11437
 *   $VNI_39          e.g. 11438
 *   $VNI_40          e.g. 11439
 *   $VNI_41          e.g. 13100
 *   $VNI_42          e.g. 13101
 *   $VNI_43          e.g. 13102
 *   $VNI_44          e.g. 13103
 *   $VNI_45          e.g. 13104
 *   $VNI_46          e.g. 13105
 *   $VNI_47          e.g. 13106
 *   $VNI_48          e.g. 13107
 *   $VNI_49          e.g. 13108
 *   $VNI_50          e.g. 13109
 *   $VNI_51          e.g. 35000
 *   $AC_IFL_1        e.g. et-0/0/5.0
 *   $AC_IFL_2        e.g. ae1.0
 *   $LOOPBACK_V4     e.g. 192.168.252.12
 *   $BD_NAME_1       e.g. vn1400
 *   $DESCRIPTION_1   e.g. blue_all_1400
 *   $VLAN_BD_1       e.g. 1400
 *   $IRB_IFL_1       e.g. irb.1400
 *   $BD_NAME_2       e.g. vn1401
 *   $DESCRIPTION_2   e.g. blue_all_1401
 *   $VLAN_BD_2       e.g. 1401
 *   $IRB_IFL_2       e.g. irb.1401
 *   $BD_NAME_3       e.g. vn1402
 *   $DESCRIPTION_3   e.g. blue_all_1402
 *   $VLAN_BD_3       e.g. 1402
 *   $IRB_IFL_3       e.g. irb.1402
 *   $BD_NAME_4       e.g. vn1403
 *   $DESCRIPTION_4   e.g. blue_all_1403
 *   $VLAN_BD_4       e.g. 1403
 *   $IRB_IFL_4       e.g. irb.1403
 *   $BD_NAME_5       e.g. vn1404
 *   $DESCRIPTION_5   e.g. blue_all_1404
 *   $VLAN_BD_5       e.g. 1404
 *   $IRB_IFL_5       e.g. irb.1404
 *   $BD_NAME_6       e.g. vn1405
 *   $DESCRIPTION_6   e.g. blue_all_1405
 *   $VLAN_BD_6       e.g. 1405
 *   $IRB_IFL_6       e.g. irb.1405
 *   $BD_NAME_7       e.g. vn1406
 *   $DESCRIPTION_7   e.g. blue_all_1406
 *   $VLAN_BD_7       e.g. 1406
 *   $IRB_IFL_7       e.g. irb.1406
 *   $BD_NAME_8       e.g. vn1407
 *   $DESCRIPTION_8   e.g. blue_all_1407
 *   $VLAN_BD_8       e.g. 1407
 *   $IRB_IFL_8       e.g. irb.1407
 *   $BD_NAME_9       e.g. vn1408
 *   $DESCRIPTION_9   e.g. blue_all_1408
 *   $VLAN_BD_9       e.g. 1408
 *   $IRB_IFL_9       e.g. irb.1408
 *   $BD_NAME_10      e.g. vn1409
 *   $DESCRIPTION_10  e.g. blue_all_1409
 *   $VLAN_BD_10      e.g. 1409
 *   $IRB_IFL_10      e.g. irb.1409
 *   $BD_NAME_11      e.g. vn1430
 *   $DESCRIPTION_11  e.g. blue_sub_3_1430
 *   $VLAN_BD_11      e.g. 1430
 *   $IRB_IFL_11      e.g. irb.1430
 *   $BD_NAME_12      e.g. vn1431
 *   $DESCRIPTION_12  e.g. blue_sub_3_1431
 *   $VLAN_BD_12      e.g. 1431
 *   $IRB_IFL_12      e.g. irb.1431
 *   $BD_NAME_13      e.g. vn1432
 *   $DESCRIPTION_13  e.g. blue_sub_3_1432
 *   $VLAN_BD_13      e.g. 1432
 *   $IRB_IFL_13      e.g. irb.1432
 *   $BD_NAME_14      e.g. vn1433
 *   $DESCRIPTION_14  e.g. blue_sub_3_1433
 *   $VLAN_BD_14      e.g. 1433
 *   $IRB_IFL_14      e.g. irb.1433
 *   $BD_NAME_15      e.g. vn1434
 *   $DESCRIPTION_15  e.g. blue_sub_3_1434
 *   $VLAN_BD_15      e.g. 1434
 *   $IRB_IFL_15      e.g. irb.1434
 *   $BD_NAME_16      e.g. vn1435
 *   $DESCRIPTION_16  e.g. blue_sub_3_1435
 *   $VLAN_BD_16      e.g. 1435
 *   $IRB_IFL_16      e.g. irb.1435
 *   $BD_NAME_17      e.g. vn1436
 *   $DESCRIPTION_17  e.g. blue_sub_3_1436
 *   $VLAN_BD_17      e.g. 1436
 *   $IRB_IFL_17      e.g. irb.1436
 *   $BD_NAME_18      e.g. vn1437
 *   $DESCRIPTION_18  e.g. blue_sub_3_1437
 *   $VLAN_BD_18      e.g. 1437
 *   $IRB_IFL_18      e.g. irb.1437
 *   $BD_NAME_19      e.g. vn1438
 *   $DESCRIPTION_19  e.g. blue_sub_3_1438
 *   $VLAN_BD_19      e.g. 1438
 *   $IRB_IFL_19      e.g. irb.1438
 *   $BD_NAME_20      e.g. vn1439
 *   $DESCRIPTION_20  e.g. blue_sub_3_1439
 *   $VLAN_BD_20      e.g. 1439
 *   $IRB_IFL_20      e.g. irb.1439
 *   $BD_NAME_21      e.g. vn3100
 *   $DESCRIPTION_21  e.g. yellow_3100
 *   $VLAN_BD_21      e.g. 3100
 *   $IRB_IFL_21      e.g. irb.3100
 *   $BD_NAME_22      e.g. vn3101
 *   $DESCRIPTION_22  e.g. yellow_3101
 *   $VLAN_BD_22      e.g. 3101
 *   $IRB_IFL_22      e.g. irb.3101
 *   $BD_NAME_23      e.g. vn3102
 *   $DESCRIPTION_23  e.g. yellow_3102
 *   $VLAN_BD_23      e.g. 3102
 *   $IRB_IFL_23      e.g. irb.3102
 *   $BD_NAME_24      e.g. vn3103
 *   $DESCRIPTION_24  e.g. yellow_3103
 *   $VLAN_BD_24      e.g. 3103
 *   $IRB_IFL_24      e.g. irb.3103
 *   $BD_NAME_25      e.g. vn3104
 *   $DESCRIPTION_25  e.g. yellow_3104
 *   $VLAN_BD_25      e.g. 3104
 *   $IRB_IFL_25      e.g. irb.3104
 *   $BD_NAME_26      e.g. vn3105
 *   $DESCRIPTION_26  e.g. yellow_3105
 *   $VLAN_BD_26      e.g. 3105
 *   $IRB_IFL_26      e.g. irb.3105
 *   $BD_NAME_27      e.g. vn3106
 *   $DESCRIPTION_27  e.g. yellow_3106
 *   $VLAN_BD_27      e.g. 3106
 *   $IRB_IFL_27      e.g. irb.3106
 *   $BD_NAME_28      e.g. vn3107
 *   $DESCRIPTION_28  e.g. yellow_3107
 *   $VLAN_BD_28      e.g. 3107
 *   $IRB_IFL_28      e.g. irb.3107
 *   $BD_NAME_29      e.g. vn3108
 *   $DESCRIPTION_29  e.g. yellow_3108
 *   $VLAN_BD_29      e.g. 3108
 *   $IRB_IFL_29      e.g. irb.3108
 *   $BD_NAME_30      e.g. vn3109
 *   $DESCRIPTION_30  e.g. yellow_3109
 *   $VLAN_BD_30      e.g. 3109
 *   $IRB_IFL_30      e.g. irb.3109
 *   $BD_NAME_31      e.g. vn3500
 *   $DESCRIPTION_31  e.g. blue-SBD
 *   $VLAN_BD_31      e.g. 3500
 *   $IRB_IFL_31      e.g. irb.3500
 *   $BD_NAME_32      e.g. vn400
 *   $DESCRIPTION_32  e.g. red_all_400
 *   $VLAN_BD_32      e.g. 400
 *   $IRB_IFL_32      e.g. irb.400
 *   $BD_NAME_33      e.g. vn401
 *   $DESCRIPTION_33  e.g. red_all_401
 *   $VLAN_BD_33      e.g. 401
 *   $IRB_IFL_33      e.g. irb.401
 *   $BD_NAME_34      e.g. vn402
 *   $DESCRIPTION_34  e.g. red_all_402
 *   $VLAN_BD_34      e.g. 402
 *   $IRB_IFL_34      e.g. irb.402
 *   $BD_NAME_35      e.g. vn403
 *   $DESCRIPTION_35  e.g. red_all_403
 *   $VLAN_BD_35      e.g. 403
 *   $IRB_IFL_35      e.g. irb.403
 *   $BD_NAME_36      e.g. vn404
 *   $DESCRIPTION_36  e.g. red_all_404
 *   $VLAN_BD_36      e.g. 404
 *   $IRB_IFL_36      e.g. irb.404
 *   $BD_NAME_37      e.g. vn405
 *   $DESCRIPTION_37  e.g. red_all_405
 *   $VLAN_BD_37      e.g. 405
 *   $IRB_IFL_37      e.g. irb.405
 *   $BD_NAME_38      e.g. vn406
 *   $DESCRIPTION_38  e.g. red_all_406
 *   $VLAN_BD_38      e.g. 406
 *   $IRB_IFL_38      e.g. irb.406
 *   $BD_NAME_39      e.g. vn407
 *   $DESCRIPTION_39  e.g. red_all_407
 *   $VLAN_BD_39      e.g. 407
 *   $IRB_IFL_39      e.g. irb.407
 *   $BD_NAME_40      e.g. vn408
 *   $DESCRIPTION_40  e.g. red_all_408
 *   $VLAN_BD_40      e.g. 408
 *   $IRB_IFL_40      e.g. irb.408
 *   $BD_NAME_41      e.g. vn409
 *   $DESCRIPTION_41  e.g. red_all_409
 *   $VLAN_BD_41      e.g. 409
 *   $IRB_IFL_41      e.g. irb.409
 *   $BD_NAME_42      e.g. vn430
 *   $DESCRIPTION_42  e.g. red_sub_3_430
 *   $VLAN_BD_42      e.g. 430
 *   $IRB_IFL_42      e.g. irb.430
 *   $BD_NAME_43      e.g. vn431
 *   $DESCRIPTION_43  e.g. red_sub_3_431
 *   $VLAN_BD_43      e.g. 431
 *   $IRB_IFL_43      e.g. irb.431
 *   $BD_NAME_44      e.g. vn432
 *   $DESCRIPTION_44  e.g. red_sub_3_432
 *   $VLAN_BD_44      e.g. 432
 *   $IRB_IFL_44      e.g. irb.432
 *   $BD_NAME_45      e.g. vn433
 *   $DESCRIPTION_45  e.g. red_sub_3_433
 *   $VLAN_BD_45      e.g. 433
 *   $IRB_IFL_45      e.g. irb.433
 *   $BD_NAME_46      e.g. vn434
 *   $DESCRIPTION_46  e.g. red_sub_3_434
 *   $VLAN_BD_46      e.g. 434
 *   $IRB_IFL_46      e.g. irb.434
 *   $BD_NAME_47      e.g. vn435
 *   $DESCRIPTION_47  e.g. red_sub_3_435
 *   $VLAN_BD_47      e.g. 435
 *   $IRB_IFL_47      e.g. irb.435
 *   $BD_NAME_48      e.g. vn436
 *   $DESCRIPTION_48  e.g. red_sub_3_436
 *   $VLAN_BD_48      e.g. 436
 *   $IRB_IFL_48      e.g. irb.436
 *   $BD_NAME_49      e.g. vn437
 *   $DESCRIPTION_49  e.g. red_sub_3_437
 *   $VLAN_BD_49      e.g. 437
 *   $IRB_IFL_49      e.g. irb.437
 *   $BD_NAME_50      e.g. vn438
 *   $DESCRIPTION_50  e.g. red_sub_3_438
 *   $VLAN_BD_50      e.g. 438
 *   $IRB_IFL_50      e.g. irb.438
 *   $BD_NAME_51      e.g. vn439
 *   $DESCRIPTION_51  e.g. red_sub_3_439
 *   $VLAN_BD_51      e.g. 439
 *   $IRB_IFL_51      e.g. irb.439
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type mac-vrf;
        protocols {
            igmp-snooping {
                vlan all;
            }
            evpn {
                encapsulation vxlan;
                default-gateway no-gateway-community;
                duplicate-mac-detection {
                    auto-recovery-time 9;
                }
                extended-vni-list all;
                vni-options {
                    vni $VNI_1 {
                        vrf-target target:10400:1;
                    }
                    vni $VNI_2 {
                        vrf-target target:10401:1;
                    }
                    vni $VNI_3 {
                        vrf-target target:10402:1;
                    }
                    vni $VNI_4 {
                        vrf-target target:10403:1;
                    }
                    vni $VNI_5 {
                        vrf-target target:10404:1;
                    }
                    vni $VNI_6 {
                        vrf-target target:10405:1;
                    }
                    vni $VNI_7 {
                        vrf-target target:10406:1;
                    }
                    vni $VNI_8 {
                        vrf-target target:10407:1;
                    }
                    vni $VNI_9 {
                        vrf-target target:10408:1;
                    }
                    vni $VNI_10 {
                        vrf-target target:10409:1;
                    }
                    vni $VNI_11 {
                        vrf-target target:10430:1;
                    }
                    vni $VNI_12 {
                        vrf-target target:10431:1;
                    }
                    vni $VNI_13 {
                        vrf-target target:10432:1;
                    }
                    vni $VNI_14 {
                        vrf-target target:10433:1;
                    }
                    vni $VNI_15 {
                        vrf-target target:10434:1;
                    }
                    vni $VNI_16 {
                        vrf-target target:10435:1;
                    }
                    vni $VNI_17 {
                        vrf-target target:10436:1;
                    }
                    vni $VNI_18 {
                        vrf-target target:10437:1;
                    }
                    vni $VNI_19 {
                        vrf-target target:10438:1;
                    }
                    vni $VNI_20 {
                        vrf-target target:10439:1;
                    }
                    vni $VNI_21 {
                        vrf-target target:11400:1;
                    }
                    vni $VNI_22 {
                        vrf-target target:11401:1;
                    }
                    vni $VNI_23 {
                        vrf-target target:11402:1;
                    }
                    vni $VNI_24 {
                        vrf-target target:11403:1;
                    }
                    vni $VNI_25 {
                        vrf-target target:11404:1;
                    }
                    vni $VNI_26 {
                        vrf-target target:11405:1;
                    }
                    vni $VNI_27 {
                        vrf-target target:11406:1;
                    }
                    vni $VNI_28 {
                        vrf-target target:11407:1;
                    }
                    vni $VNI_29 {
                        vrf-target target:11408:1;
                    }
                    vni $VNI_30 {
                        vrf-target target:11409:1;
                    }
                    vni $VNI_31 {
                        vrf-target target:11430:1;
                    }
                    vni $VNI_32 {
                        vrf-target target:11431:1;
                    }
                    vni $VNI_33 {
                        vrf-target target:11432:1;
                    }
                    vni $VNI_34 {
                        vrf-target target:11433:1;
                    }
                    vni $VNI_35 {
                        vrf-target target:11434:1;
                    }
                    vni $VNI_36 {
                        vrf-target target:11435:1;
                    }
                    vni $VNI_37 {
                        vrf-target target:11436:1;
                    }
                    vni $VNI_38 {
                        vrf-target target:11437:1;
                    }
                    vni $VNI_39 {
                        vrf-target target:11438:1;
                    }
                    vni $VNI_40 {
                        vrf-target target:11439:1;
                    }
                    vni $VNI_41 {
                        vrf-target target:13100:1;
                    }
                    vni $VNI_42 {
                        vrf-target target:13101:1;
                    }
                    vni $VNI_43 {
                        vrf-target target:13102:1;
                    }
                    vni $VNI_44 {
                        vrf-target target:13103:1;
                    }
                    vni $VNI_45 {
                        vrf-target target:13104:1;
                    }
                    vni $VNI_46 {
                        vrf-target target:13105:1;
                    }
                    vni $VNI_47 {
                        vrf-target target:13106:1;
                    }
                    vni $VNI_48 {
                        vrf-target target:13107:1;
                    }
                    vni $VNI_49 {
                        vrf-target target:13108:1;
                    }
                    vni $VNI_50 {
                        vrf-target target:13109:1;
                    }
                    vni $VNI_51 {
                        vrf-target target:35000:1;
                    }
                }
            }
        }
        vtep-source-interface lo0.0;
        service-type vlan-aware;
        interface $AC_IFL_1;
        interface $AC_IFL_2;
        route-distinguisher $LOOPBACK_V4:65534;
        vrf-target target:100:100;
        multicast-snooping-options {
            oism {
                conserve-mcast-routes-in-pfe;
            }
        }
        vlans {
            $BD_NAME_1 {
                description $DESCRIPTION_1;
                vlan-id $VLAN_BD_1;
                l3-interface $IRB_IFL_1;
                vxlan {
                    vni $VNI_21;
                }
            }
            $BD_NAME_2 {
                description $DESCRIPTION_2;
                vlan-id $VLAN_BD_2;
                l3-interface $IRB_IFL_2;
                vxlan {
                    vni $VNI_22;
                }
            }
            $BD_NAME_3 {
                description $DESCRIPTION_3;
                vlan-id $VLAN_BD_3;
                l3-interface $IRB_IFL_3;
                vxlan {
                    vni $VNI_23;
                }
            }
            $BD_NAME_4 {
                description $DESCRIPTION_4;
                vlan-id $VLAN_BD_4;
                l3-interface $IRB_IFL_4;
                vxlan {
                    vni $VNI_24;
                }
            }
            $BD_NAME_5 {
                description $DESCRIPTION_5;
                vlan-id $VLAN_BD_5;
                l3-interface $IRB_IFL_5;
                vxlan {
                    vni $VNI_25;
                }
            }
            $BD_NAME_6 {
                description $DESCRIPTION_6;
                vlan-id $VLAN_BD_6;
                l3-interface $IRB_IFL_6;
                vxlan {
                    vni $VNI_26;
                }
            }
            $BD_NAME_7 {
                description $DESCRIPTION_7;
                vlan-id $VLAN_BD_7;
                l3-interface $IRB_IFL_7;
                vxlan {
                    vni $VNI_27;
                }
            }
            $BD_NAME_8 {
                description $DESCRIPTION_8;
                vlan-id $VLAN_BD_8;
                l3-interface $IRB_IFL_8;
                vxlan {
                    vni $VNI_28;
                }
            }
            $BD_NAME_9 {
                description $DESCRIPTION_9;
                vlan-id $VLAN_BD_9;
                l3-interface $IRB_IFL_9;
                vxlan {
                    vni $VNI_29;
                }
            }
            $BD_NAME_10 {
                description $DESCRIPTION_10;
                vlan-id $VLAN_BD_10;
                l3-interface $IRB_IFL_10;
                vxlan {
                    vni $VNI_30;
                }
            }
            $BD_NAME_11 {
                description $DESCRIPTION_11;
                vlan-id $VLAN_BD_11;
                l3-interface $IRB_IFL_11;
                vxlan {
                    vni $VNI_31;
                }
            }
            $BD_NAME_12 {
                description $DESCRIPTION_12;
                vlan-id $VLAN_BD_12;
                l3-interface $IRB_IFL_12;
                vxlan {
                    vni $VNI_32;
                }
            }
            $BD_NAME_13 {
                description $DESCRIPTION_13;
                vlan-id $VLAN_BD_13;
                l3-interface $IRB_IFL_13;
                vxlan {
                    vni $VNI_33;
                }
            }
            $BD_NAME_14 {
                description $DESCRIPTION_14;
                vlan-id $VLAN_BD_14;
                l3-interface $IRB_IFL_14;
                vxlan {
                    vni $VNI_34;
                }
            }
            $BD_NAME_15 {
                description $DESCRIPTION_15;
                vlan-id $VLAN_BD_15;
                l3-interface $IRB_IFL_15;
                vxlan {
                    vni $VNI_35;
                }
            }
            $BD_NAME_16 {
                description $DESCRIPTION_16;
                vlan-id $VLAN_BD_16;
                l3-interface $IRB_IFL_16;
                vxlan {
                    vni $VNI_36;
                }
            }
            $BD_NAME_17 {
                description $DESCRIPTION_17;
                vlan-id $VLAN_BD_17;
                l3-interface $IRB_IFL_17;
                vxlan {
                    vni $VNI_37;
                }
            }
            $BD_NAME_18 {
                description $DESCRIPTION_18;
                vlan-id $VLAN_BD_18;
                l3-interface $IRB_IFL_18;
                vxlan {
                    vni $VNI_38;
                }
            }
            $BD_NAME_19 {
                description $DESCRIPTION_19;
                vlan-id $VLAN_BD_19;
                l3-interface $IRB_IFL_19;
                vxlan {
                    vni $VNI_39;
                }
            }
            $BD_NAME_20 {
                description $DESCRIPTION_20;
                vlan-id $VLAN_BD_20;
                l3-interface $IRB_IFL_20;
                vxlan {
                    vni $VNI_40;
                }
            }
            $BD_NAME_21 {
                description $DESCRIPTION_21;
                vlan-id $VLAN_BD_21;
                l3-interface $IRB_IFL_21;
                vxlan {
                    vni $VNI_41;
                }
            }
            $BD_NAME_22 {
                description $DESCRIPTION_22;
                vlan-id $VLAN_BD_22;
                l3-interface $IRB_IFL_22;
                vxlan {
                    vni $VNI_42;
                }
            }
            $BD_NAME_23 {
                description $DESCRIPTION_23;
                vlan-id $VLAN_BD_23;
                l3-interface $IRB_IFL_23;
                vxlan {
                    vni $VNI_43;
                }
            }
            $BD_NAME_24 {
                description $DESCRIPTION_24;
                vlan-id $VLAN_BD_24;
                l3-interface $IRB_IFL_24;
                vxlan {
                    vni $VNI_44;
                }
            }
            $BD_NAME_25 {
                description $DESCRIPTION_25;
                vlan-id $VLAN_BD_25;
                l3-interface $IRB_IFL_25;
                vxlan {
                    vni $VNI_45;
                }
            }
            $BD_NAME_26 {
                description $DESCRIPTION_26;
                vlan-id $VLAN_BD_26;
                l3-interface $IRB_IFL_26;
                vxlan {
                    vni $VNI_46;
                }
            }
            $BD_NAME_27 {
                description $DESCRIPTION_27;
                vlan-id $VLAN_BD_27;
                l3-interface $IRB_IFL_27;
                vxlan {
                    vni $VNI_47;
                }
            }
            $BD_NAME_28 {
                description $DESCRIPTION_28;
                vlan-id $VLAN_BD_28;
                l3-interface $IRB_IFL_28;
                vxlan {
                    vni $VNI_48;
                }
            }
            $BD_NAME_29 {
                description $DESCRIPTION_29;
                vlan-id $VLAN_BD_29;
                l3-interface $IRB_IFL_29;
                vxlan {
                    vni $VNI_49;
                }
            }
            $BD_NAME_30 {
                description $DESCRIPTION_30;
                vlan-id $VLAN_BD_30;
                l3-interface $IRB_IFL_30;
                vxlan {
                    vni $VNI_50;
                }
            }
            $BD_NAME_31 {
                description $DESCRIPTION_31;
                vlan-id $VLAN_BD_31;
                l3-interface $IRB_IFL_31;
                vxlan {
                    vni $VNI_51;
                }
            }
            $BD_NAME_32 {
                description $DESCRIPTION_32;
                vlan-id $VLAN_BD_32;
                l3-interface $IRB_IFL_32;
                vxlan {
                    vni $VNI_1;
                }
            }
            $BD_NAME_33 {
                description $DESCRIPTION_33;
                vlan-id $VLAN_BD_33;
                l3-interface $IRB_IFL_33;
                vxlan {
                    vni $VNI_2;
                }
            }
            $BD_NAME_34 {
                description $DESCRIPTION_34;
                vlan-id $VLAN_BD_34;
                l3-interface $IRB_IFL_34;
                vxlan {
                    vni $VNI_3;
                }
            }
            $BD_NAME_35 {
                description $DESCRIPTION_35;
                vlan-id $VLAN_BD_35;
                l3-interface $IRB_IFL_35;
                vxlan {
                    vni $VNI_4;
                }
            }
            $BD_NAME_36 {
                description $DESCRIPTION_36;
                vlan-id $VLAN_BD_36;
                l3-interface $IRB_IFL_36;
                vxlan {
                    vni $VNI_5;
                }
            }
            $BD_NAME_37 {
                description $DESCRIPTION_37;
                vlan-id $VLAN_BD_37;
                l3-interface $IRB_IFL_37;
                vxlan {
                    vni $VNI_6;
                }
            }
            $BD_NAME_38 {
                description $DESCRIPTION_38;
                vlan-id $VLAN_BD_38;
                l3-interface $IRB_IFL_38;
                vxlan {
                    vni $VNI_7;
                }
            }
            $BD_NAME_39 {
                description $DESCRIPTION_39;
                vlan-id $VLAN_BD_39;
                l3-interface $IRB_IFL_39;
                vxlan {
                    vni $VNI_8;
                }
            }
            $BD_NAME_40 {
                description $DESCRIPTION_40;
                vlan-id $VLAN_BD_40;
                l3-interface $IRB_IFL_40;
                vxlan {
                    vni $VNI_9;
                }
            }
            $BD_NAME_41 {
                description $DESCRIPTION_41;
                vlan-id $VLAN_BD_41;
                l3-interface $IRB_IFL_41;
                vxlan {
                    vni $VNI_10;
                }
            }
            $BD_NAME_42 {
                description $DESCRIPTION_42;
                vlan-id $VLAN_BD_42;
                l3-interface $IRB_IFL_42;
                vxlan {
                    vni $VNI_11;
                }
            }
            $BD_NAME_43 {
                description $DESCRIPTION_43;
                vlan-id $VLAN_BD_43;
                l3-interface $IRB_IFL_43;
                vxlan {
                    vni $VNI_12;
                }
            }
            $BD_NAME_44 {
                description $DESCRIPTION_44;
                vlan-id $VLAN_BD_44;
                l3-interface $IRB_IFL_44;
                vxlan {
                    vni $VNI_13;
                }
            }
            $BD_NAME_45 {
                description $DESCRIPTION_45;
                vlan-id $VLAN_BD_45;
                l3-interface $IRB_IFL_45;
                vxlan {
                    vni $VNI_14;
                }
            }
            $BD_NAME_46 {
                description $DESCRIPTION_46;
                vlan-id $VLAN_BD_46;
                l3-interface $IRB_IFL_46;
                vxlan {
                    vni $VNI_15;
                }
            }
            $BD_NAME_47 {
                description $DESCRIPTION_47;
                vlan-id $VLAN_BD_47;
                l3-interface $IRB_IFL_47;
                vxlan {
                    vni $VNI_16;
                }
            }
            $BD_NAME_48 {
                description $DESCRIPTION_48;
                vlan-id $VLAN_BD_48;
                l3-interface $IRB_IFL_48;
                vxlan {
                    vni $VNI_17;
                }
            }
            $BD_NAME_49 {
                description $DESCRIPTION_49;
                vlan-id $VLAN_BD_49;
                l3-interface $IRB_IFL_49;
                vxlan {
                    vni $VNI_18;
                }
            }
            $BD_NAME_50 {
                description $DESCRIPTION_50;
                vlan-id $VLAN_BD_50;
                l3-interface $IRB_IFL_50;
                vxlan {
                    vni $VNI_19;
                }
            }
            $BD_NAME_51 {
                description $DESCRIPTION_51;
                vlan-id $VLAN_BD_51;
                l3-interface $IRB_IFL_51;
                vxlan {
                    vni $VNI_20;
                }
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL_1`, `$AC_IFL_2`, `$IRB_IFL_1`, `$IRB_IFL_2`, `$IRB_IFL_3`, `$IRB_IFL_4`, `$IRB_IFL_5`, `$IRB_IFL_6`, `$IRB_IFL_7`, `$IRB_IFL_8`, `$IRB_IFL_9`, `$IRB_IFL_10`, `$IRB_IFL_11`, `$IRB_IFL_12`, `$IRB_IFL_13`, `$IRB_IFL_14`, `$IRB_IFL_15`, `$IRB_IFL_16`, `$IRB_IFL_17`, `$IRB_IFL_18`, `$IRB_IFL_19`, `$IRB_IFL_20`, `$IRB_IFL_21`, `$IRB_IFL_22`, `$IRB_IFL_23`, `$IRB_IFL_24`, `$IRB_IFL_25`, `$IRB_IFL_26`, `$IRB_IFL_27`, `$IRB_IFL_28`, `$IRB_IFL_29`, `$IRB_IFL_30`, `$IRB_IFL_31`, `$IRB_IFL_32`, `$IRB_IFL_33`, `$IRB_IFL_34`, `$IRB_IFL_35`, `$IRB_IFL_36`, `$IRB_IFL_37`, `$IRB_IFL_38`, `$IRB_IFL_39`, `$IRB_IFL_40`, `$IRB_IFL_41`, `$IRB_IFL_42`, `$IRB_IFL_43`, `$IRB_IFL_44`, `$IRB_IFL_45`, `$IRB_IFL_46`, `$IRB_IFL_47`, `$IRB_IFL_48`, `$IRB_IFL_49`, `$IRB_IFL_50`, `$IRB_IFL_51`): required, for each reference; one of `interfaces/ifl-ethernet-switching-trunk-vlans`, `interfaces/irb-inet-inet6-mtu-9000-mac-no-dhcp-flood`, `interfaces/irb-inet-inet6-mtu-9000-mac`, `interfaces/irb-inet-virtual-gateway-mtu-9000`

## evo/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-proxy-oism-2-ac.conf

```
/*
 * Topic: VLAN-aware EVPN-VXLAN MAC-VRF with 51 VLANs, IGMP snooping with proxy, OISM and two access interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf2_qfx5130-32cd
 * Count:
 *   storage-leaf2_qfx5130-32cd 1
 *   total 1
 * Pair with: none
 * Variables (example values from storage-leaf2_qfx5130-32cd):
 *   $INSTANCE_NAME   e.g. evpn-1
 *   $VNI_1           e.g. 10400
 *   $VNI_2           e.g. 10401
 *   $VNI_3           e.g. 10402
 *   $VNI_4           e.g. 10403
 *   $VNI_5           e.g. 10404
 *   $VNI_6           e.g. 10405
 *   $VNI_7           e.g. 10406
 *   $VNI_8           e.g. 10407
 *   $VNI_9           e.g. 10408
 *   $VNI_10          e.g. 10409
 *   $VNI_11          e.g. 10420
 *   $VNI_12          e.g. 10421
 *   $VNI_13          e.g. 10422
 *   $VNI_14          e.g. 10423
 *   $VNI_15          e.g. 10424
 *   $VNI_16          e.g. 10425
 *   $VNI_17          e.g. 10426
 *   $VNI_18          e.g. 10427
 *   $VNI_19          e.g. 10428
 *   $VNI_20          e.g. 10429
 *   $VNI_21          e.g. 11400
 *   $VNI_22          e.g. 11401
 *   $VNI_23          e.g. 11402
 *   $VNI_24          e.g. 11403
 *   $VNI_25          e.g. 11404
 *   $VNI_26          e.g. 11405
 *   $VNI_27          e.g. 11406
 *   $VNI_28          e.g. 11407
 *   $VNI_29          e.g. 11408
 *   $VNI_30          e.g. 11409
 *   $VNI_31          e.g. 11420
 *   $VNI_32          e.g. 11421
 *   $VNI_33          e.g. 11422
 *   $VNI_34          e.g. 11423
 *   $VNI_35          e.g. 11424
 *   $VNI_36          e.g. 11425
 *   $VNI_37          e.g. 11426
 *   $VNI_38          e.g. 11427
 *   $VNI_39          e.g. 11428
 *   $VNI_40          e.g. 11429
 *   $VNI_41          e.g. 12800
 *   $VNI_42          e.g. 12801
 *   $VNI_43          e.g. 12802
 *   $VNI_44          e.g. 12803
 *   $VNI_45          e.g. 12804
 *   $VNI_46          e.g. 12805
 *   $VNI_47          e.g. 12806
 *   $VNI_48          e.g. 12807
 *   $VNI_49          e.g. 12808
 *   $VNI_50          e.g. 12809
 *   $VNI_51          e.g. 35000
 *   $AC_IFL_1        e.g. et-0/0/8:1.0
 *   $AC_IFL_2        e.g. ae1.0
 *   $LOOPBACK_V4     e.g. 192.168.252.11
 *   $BD_NAME_1       e.g. vn1400
 *   $DESCRIPTION_1   e.g. blue_all_1400
 *   $VLAN_BD_1       e.g. 1400
 *   $IRB_IFL_1       e.g. irb.1400
 *   $BD_NAME_2       e.g. vn1401
 *   $DESCRIPTION_2   e.g. blue_all_1401
 *   $VLAN_BD_2       e.g. 1401
 *   $IRB_IFL_2       e.g. irb.1401
 *   $BD_NAME_3       e.g. vn1402
 *   $DESCRIPTION_3   e.g. blue_all_1402
 *   $VLAN_BD_3       e.g. 1402
 *   $IRB_IFL_3       e.g. irb.1402
 *   $BD_NAME_4       e.g. vn1403
 *   $DESCRIPTION_4   e.g. blue_all_1403
 *   $VLAN_BD_4       e.g. 1403
 *   $IRB_IFL_4       e.g. irb.1403
 *   $BD_NAME_5       e.g. vn1404
 *   $DESCRIPTION_5   e.g. blue_all_1404
 *   $VLAN_BD_5       e.g. 1404
 *   $IRB_IFL_5       e.g. irb.1404
 *   $BD_NAME_6       e.g. vn1405
 *   $DESCRIPTION_6   e.g. blue_all_1405
 *   $VLAN_BD_6       e.g. 1405
 *   $IRB_IFL_6       e.g. irb.1405
 *   $BD_NAME_7       e.g. vn1406
 *   $DESCRIPTION_7   e.g. blue_all_1406
 *   $VLAN_BD_7       e.g. 1406
 *   $IRB_IFL_7       e.g. irb.1406
 *   $BD_NAME_8       e.g. vn1407
 *   $DESCRIPTION_8   e.g. blue_all_1407
 *   $VLAN_BD_8       e.g. 1407
 *   $IRB_IFL_8       e.g. irb.1407
 *   $BD_NAME_9       e.g. vn1408
 *   $DESCRIPTION_9   e.g. blue_all_1408
 *   $VLAN_BD_9       e.g. 1408
 *   $IRB_IFL_9       e.g. irb.1408
 *   $BD_NAME_10      e.g. vn1409
 *   $DESCRIPTION_10  e.g. blue_all_1409
 *   $VLAN_BD_10      e.g. 1409
 *   $IRB_IFL_10      e.g. irb.1409
 *   $BD_NAME_11      e.g. vn1420
 *   $DESCRIPTION_11  e.g. blue_sub_2_1420
 *   $VLAN_BD_11      e.g. 1420
 *   $IRB_IFL_11      e.g. irb.1420
 *   $BD_NAME_12      e.g. vn1421
 *   $DESCRIPTION_12  e.g. blue_sub_2_1421
 *   $VLAN_BD_12      e.g. 1421
 *   $IRB_IFL_12      e.g. irb.1421
 *   $BD_NAME_13      e.g. vn1422
 *   $DESCRIPTION_13  e.g. blue_sub_2_1422
 *   $VLAN_BD_13      e.g. 1422
 *   $IRB_IFL_13      e.g. irb.1422
 *   $BD_NAME_14      e.g. vn1423
 *   $DESCRIPTION_14  e.g. blue_sub_2_1423
 *   $VLAN_BD_14      e.g. 1423
 *   $IRB_IFL_14      e.g. irb.1423
 *   $BD_NAME_15      e.g. vn1424
 *   $DESCRIPTION_15  e.g. blue_sub_2_1424
 *   $VLAN_BD_15      e.g. 1424
 *   $IRB_IFL_15      e.g. irb.1424
 *   $BD_NAME_16      e.g. vn1425
 *   $DESCRIPTION_16  e.g. blue_sub_2_1425
 *   $VLAN_BD_16      e.g. 1425
 *   $IRB_IFL_16      e.g. irb.1425
 *   $BD_NAME_17      e.g. vn1426
 *   $DESCRIPTION_17  e.g. blue_sub_2_1426
 *   $VLAN_BD_17      e.g. 1426
 *   $IRB_IFL_17      e.g. irb.1426
 *   $BD_NAME_18      e.g. vn1427
 *   $DESCRIPTION_18  e.g. blue_sub_2_1427
 *   $VLAN_BD_18      e.g. 1427
 *   $IRB_IFL_18      e.g. irb.1427
 *   $BD_NAME_19      e.g. vn1428
 *   $DESCRIPTION_19  e.g. blue_sub_2_1428
 *   $VLAN_BD_19      e.g. 1428
 *   $IRB_IFL_19      e.g. irb.1428
 *   $BD_NAME_20      e.g. vn1429
 *   $DESCRIPTION_20  e.g. blue_sub_2_1429
 *   $VLAN_BD_20      e.g. 1429
 *   $IRB_IFL_20      e.g. irb.1429
 *   $BD_NAME_21      e.g. vn2800
 *   $DESCRIPTION_21  e.g. purple_2800
 *   $VLAN_BD_21      e.g. 2800
 *   $IRB_IFL_21      e.g. irb.2800
 *   $BD_NAME_22      e.g. vn2801
 *   $DESCRIPTION_22  e.g. purple_2801
 *   $VLAN_BD_22      e.g. 2801
 *   $IRB_IFL_22      e.g. irb.2801
 *   $BD_NAME_23      e.g. vn2802
 *   $DESCRIPTION_23  e.g. purple_2802
 *   $VLAN_BD_23      e.g. 2802
 *   $IRB_IFL_23      e.g. irb.2802
 *   $BD_NAME_24      e.g. vn2803
 *   $DESCRIPTION_24  e.g. purple_2803
 *   $VLAN_BD_24      e.g. 2803
 *   $IRB_IFL_24      e.g. irb.2803
 *   $BD_NAME_25      e.g. vn2804
 *   $DESCRIPTION_25  e.g. purple_2804
 *   $VLAN_BD_25      e.g. 2804
 *   $IRB_IFL_25      e.g. irb.2804
 *   $BD_NAME_26      e.g. vn2805
 *   $DESCRIPTION_26  e.g. purple_2805
 *   $VLAN_BD_26      e.g. 2805
 *   $IRB_IFL_26      e.g. irb.2805
 *   $BD_NAME_27      e.g. vn2806
 *   $DESCRIPTION_27  e.g. purple_2806
 *   $VLAN_BD_27      e.g. 2806
 *   $IRB_IFL_27      e.g. irb.2806
 *   $BD_NAME_28      e.g. vn2807
 *   $DESCRIPTION_28  e.g. purple_2807
 *   $VLAN_BD_28      e.g. 2807
 *   $IRB_IFL_28      e.g. irb.2807
 *   $BD_NAME_29      e.g. vn2808
 *   $DESCRIPTION_29  e.g. purple_2808
 *   $VLAN_BD_29      e.g. 2808
 *   $IRB_IFL_29      e.g. irb.2808
 *   $BD_NAME_30      e.g. vn2809
 *   $DESCRIPTION_30  e.g. purple_2809
 *   $VLAN_BD_30      e.g. 2809
 *   $IRB_IFL_30      e.g. irb.2809
 *   $BD_NAME_31      e.g. vn3500
 *   $DESCRIPTION_31  e.g. blue-SBD
 *   $VLAN_BD_31      e.g. 3500
 *   $IRB_IFL_31      e.g. irb.3500
 *   $BD_NAME_32      e.g. vn400
 *   $DESCRIPTION_32  e.g. red_all_400
 *   $VLAN_BD_32      e.g. 400
 *   $IRB_IFL_32      e.g. irb.400
 *   $BD_NAME_33      e.g. vn401
 *   $DESCRIPTION_33  e.g. red_all_401
 *   $VLAN_BD_33      e.g. 401
 *   $IRB_IFL_33      e.g. irb.401
 *   $BD_NAME_34      e.g. vn402
 *   $DESCRIPTION_34  e.g. red_all_402
 *   $VLAN_BD_34      e.g. 402
 *   $IRB_IFL_34      e.g. irb.402
 *   $BD_NAME_35      e.g. vn403
 *   $DESCRIPTION_35  e.g. red_all_403
 *   $VLAN_BD_35      e.g. 403
 *   $IRB_IFL_35      e.g. irb.403
 *   $BD_NAME_36      e.g. vn404
 *   $DESCRIPTION_36  e.g. red_all_404
 *   $VLAN_BD_36      e.g. 404
 *   $IRB_IFL_36      e.g. irb.404
 *   $BD_NAME_37      e.g. vn405
 *   $DESCRIPTION_37  e.g. red_all_405
 *   $VLAN_BD_37      e.g. 405
 *   $IRB_IFL_37      e.g. irb.405
 *   $BD_NAME_38      e.g. vn406
 *   $DESCRIPTION_38  e.g. red_all_406
 *   $VLAN_BD_38      e.g. 406
 *   $IRB_IFL_38      e.g. irb.406
 *   $BD_NAME_39      e.g. vn407
 *   $DESCRIPTION_39  e.g. red_all_407
 *   $VLAN_BD_39      e.g. 407
 *   $IRB_IFL_39      e.g. irb.407
 *   $BD_NAME_40      e.g. vn408
 *   $DESCRIPTION_40  e.g. red_all_408
 *   $VLAN_BD_40      e.g. 408
 *   $IRB_IFL_40      e.g. irb.408
 *   $BD_NAME_41      e.g. vn409
 *   $DESCRIPTION_41  e.g. red_all_409
 *   $VLAN_BD_41      e.g. 409
 *   $IRB_IFL_41      e.g. irb.409
 *   $BD_NAME_42      e.g. vn420
 *   $DESCRIPTION_42  e.g. red_sub_2_420
 *   $VLAN_BD_42      e.g. 420
 *   $IRB_IFL_42      e.g. irb.420
 *   $BD_NAME_43      e.g. vn421
 *   $DESCRIPTION_43  e.g. red_sub_2_421
 *   $VLAN_BD_43      e.g. 421
 *   $IRB_IFL_43      e.g. irb.421
 *   $BD_NAME_44      e.g. vn422
 *   $DESCRIPTION_44  e.g. red_sub_2_422
 *   $VLAN_BD_44      e.g. 422
 *   $IRB_IFL_44      e.g. irb.422
 *   $BD_NAME_45      e.g. vn423
 *   $DESCRIPTION_45  e.g. red_sub_2_423
 *   $VLAN_BD_45      e.g. 423
 *   $IRB_IFL_45      e.g. irb.423
 *   $BD_NAME_46      e.g. vn424
 *   $DESCRIPTION_46  e.g. red_sub_2_424
 *   $VLAN_BD_46      e.g. 424
 *   $IRB_IFL_46      e.g. irb.424
 *   $BD_NAME_47      e.g. vn425
 *   $DESCRIPTION_47  e.g. red_sub_2_425
 *   $VLAN_BD_47      e.g. 425
 *   $IRB_IFL_47      e.g. irb.425
 *   $BD_NAME_48      e.g. vn426
 *   $DESCRIPTION_48  e.g. red_sub_2_426
 *   $VLAN_BD_48      e.g. 426
 *   $IRB_IFL_48      e.g. irb.426
 *   $BD_NAME_49      e.g. vn427
 *   $DESCRIPTION_49  e.g. red_sub_2_427
 *   $VLAN_BD_49      e.g. 427
 *   $IRB_IFL_49      e.g. irb.427
 *   $BD_NAME_50      e.g. vn428
 *   $DESCRIPTION_50  e.g. red_sub_2_428
 *   $VLAN_BD_50      e.g. 428
 *   $IRB_IFL_50      e.g. irb.428
 *   $BD_NAME_51      e.g. vn429
 *   $DESCRIPTION_51  e.g. red_sub_2_429
 *   $VLAN_BD_51      e.g. 429
 *   $IRB_IFL_51      e.g. irb.429
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type mac-vrf;
        protocols {
            igmp-snooping {
                vlan all {
                    proxy;
                }
            }
            evpn {
                encapsulation vxlan;
                default-gateway no-gateway-community;
                duplicate-mac-detection {
                    auto-recovery-time 9;
                }
                extended-vni-list all;
                vni-options {
                    vni $VNI_1 {
                        vrf-target target:10400:1;
                    }
                    vni $VNI_2 {
                        vrf-target target:10401:1;
                    }
                    vni $VNI_3 {
                        vrf-target target:10402:1;
                    }
                    vni $VNI_4 {
                        vrf-target target:10403:1;
                    }
                    vni $VNI_5 {
                        vrf-target target:10404:1;
                    }
                    vni $VNI_6 {
                        vrf-target target:10405:1;
                    }
                    vni $VNI_7 {
                        vrf-target target:10406:1;
                    }
                    vni $VNI_8 {
                        vrf-target target:10407:1;
                    }
                    vni $VNI_9 {
                        vrf-target target:10408:1;
                    }
                    vni $VNI_10 {
                        vrf-target target:10409:1;
                    }
                    vni $VNI_11 {
                        vrf-target target:10420:1;
                    }
                    vni $VNI_12 {
                        vrf-target target:10421:1;
                    }
                    vni $VNI_13 {
                        vrf-target target:10422:1;
                    }
                    vni $VNI_14 {
                        vrf-target target:10423:1;
                    }
                    vni $VNI_15 {
                        vrf-target target:10424:1;
                    }
                    vni $VNI_16 {
                        vrf-target target:10425:1;
                    }
                    vni $VNI_17 {
                        vrf-target target:10426:1;
                    }
                    vni $VNI_18 {
                        vrf-target target:10427:1;
                    }
                    vni $VNI_19 {
                        vrf-target target:10428:1;
                    }
                    vni $VNI_20 {
                        vrf-target target:10429:1;
                    }
                    vni $VNI_21 {
                        vrf-target target:11400:1;
                    }
                    vni $VNI_22 {
                        vrf-target target:11401:1;
                    }
                    vni $VNI_23 {
                        vrf-target target:11402:1;
                    }
                    vni $VNI_24 {
                        vrf-target target:11403:1;
                    }
                    vni $VNI_25 {
                        vrf-target target:11404:1;
                    }
                    vni $VNI_26 {
                        vrf-target target:11405:1;
                    }
                    vni $VNI_27 {
                        vrf-target target:11406:1;
                    }
                    vni $VNI_28 {
                        vrf-target target:11407:1;
                    }
                    vni $VNI_29 {
                        vrf-target target:11408:1;
                    }
                    vni $VNI_30 {
                        vrf-target target:11409:1;
                    }
                    vni $VNI_31 {
                        vrf-target target:11420:1;
                    }
                    vni $VNI_32 {
                        vrf-target target:11421:1;
                    }
                    vni $VNI_33 {
                        vrf-target target:11422:1;
                    }
                    vni $VNI_34 {
                        vrf-target target:11423:1;
                    }
                    vni $VNI_35 {
                        vrf-target target:11424:1;
                    }
                    vni $VNI_36 {
                        vrf-target target:11425:1;
                    }
                    vni $VNI_37 {
                        vrf-target target:11426:1;
                    }
                    vni $VNI_38 {
                        vrf-target target:11427:1;
                    }
                    vni $VNI_39 {
                        vrf-target target:11428:1;
                    }
                    vni $VNI_40 {
                        vrf-target target:11429:1;
                    }
                    vni $VNI_41 {
                        vrf-target target:12800:1;
                    }
                    vni $VNI_42 {
                        vrf-target target:12801:1;
                    }
                    vni $VNI_43 {
                        vrf-target target:12802:1;
                    }
                    vni $VNI_44 {
                        vrf-target target:12803:1;
                    }
                    vni $VNI_45 {
                        vrf-target target:12804:1;
                    }
                    vni $VNI_46 {
                        vrf-target target:12805:1;
                    }
                    vni $VNI_47 {
                        vrf-target target:12806:1;
                    }
                    vni $VNI_48 {
                        vrf-target target:12807:1;
                    }
                    vni $VNI_49 {
                        vrf-target target:12808:1;
                    }
                    vni $VNI_50 {
                        vrf-target target:12809:1;
                    }
                    vni $VNI_51 {
                        vrf-target target:35000:1;
                    }
                }
            }
        }
        vtep-source-interface lo0.0;
        service-type vlan-aware;
        interface $AC_IFL_1;
        interface $AC_IFL_2;
        route-distinguisher $LOOPBACK_V4:65534;
        vrf-target target:100:100;
        multicast-snooping-options {
            oism {
                conserve-mcast-routes-in-pfe;
            }
        }
        vlans {
            $BD_NAME_1 {
                description $DESCRIPTION_1;
                vlan-id $VLAN_BD_1;
                l3-interface $IRB_IFL_1;
                vxlan {
                    vni $VNI_21;
                }
            }
            $BD_NAME_2 {
                description $DESCRIPTION_2;
                vlan-id $VLAN_BD_2;
                l3-interface $IRB_IFL_2;
                vxlan {
                    vni $VNI_22;
                }
            }
            $BD_NAME_3 {
                description $DESCRIPTION_3;
                vlan-id $VLAN_BD_3;
                l3-interface $IRB_IFL_3;
                vxlan {
                    vni $VNI_23;
                }
            }
            $BD_NAME_4 {
                description $DESCRIPTION_4;
                vlan-id $VLAN_BD_4;
                l3-interface $IRB_IFL_4;
                vxlan {
                    vni $VNI_24;
                }
            }
            $BD_NAME_5 {
                description $DESCRIPTION_5;
                vlan-id $VLAN_BD_5;
                l3-interface $IRB_IFL_5;
                vxlan {
                    vni $VNI_25;
                }
            }
            $BD_NAME_6 {
                description $DESCRIPTION_6;
                vlan-id $VLAN_BD_6;
                l3-interface $IRB_IFL_6;
                vxlan {
                    vni $VNI_26;
                }
            }
            $BD_NAME_7 {
                description $DESCRIPTION_7;
                vlan-id $VLAN_BD_7;
                l3-interface $IRB_IFL_7;
                vxlan {
                    vni $VNI_27;
                }
            }
            $BD_NAME_8 {
                description $DESCRIPTION_8;
                vlan-id $VLAN_BD_8;
                l3-interface $IRB_IFL_8;
                vxlan {
                    vni $VNI_28;
                }
            }
            $BD_NAME_9 {
                description $DESCRIPTION_9;
                vlan-id $VLAN_BD_9;
                l3-interface $IRB_IFL_9;
                vxlan {
                    vni $VNI_29;
                }
            }
            $BD_NAME_10 {
                description $DESCRIPTION_10;
                vlan-id $VLAN_BD_10;
                l3-interface $IRB_IFL_10;
                vxlan {
                    vni $VNI_30;
                }
            }
            $BD_NAME_11 {
                description $DESCRIPTION_11;
                vlan-id $VLAN_BD_11;
                l3-interface $IRB_IFL_11;
                vxlan {
                    vni $VNI_31;
                }
            }
            $BD_NAME_12 {
                description $DESCRIPTION_12;
                vlan-id $VLAN_BD_12;
                l3-interface $IRB_IFL_12;
                vxlan {
                    vni $VNI_32;
                }
            }
            $BD_NAME_13 {
                description $DESCRIPTION_13;
                vlan-id $VLAN_BD_13;
                l3-interface $IRB_IFL_13;
                vxlan {
                    vni $VNI_33;
                }
            }
            $BD_NAME_14 {
                description $DESCRIPTION_14;
                vlan-id $VLAN_BD_14;
                l3-interface $IRB_IFL_14;
                vxlan {
                    vni $VNI_34;
                }
            }
            $BD_NAME_15 {
                description $DESCRIPTION_15;
                vlan-id $VLAN_BD_15;
                l3-interface $IRB_IFL_15;
                vxlan {
                    vni $VNI_35;
                }
            }
            $BD_NAME_16 {
                description $DESCRIPTION_16;
                vlan-id $VLAN_BD_16;
                l3-interface $IRB_IFL_16;
                vxlan {
                    vni $VNI_36;
                }
            }
            $BD_NAME_17 {
                description $DESCRIPTION_17;
                vlan-id $VLAN_BD_17;
                l3-interface $IRB_IFL_17;
                vxlan {
                    vni $VNI_37;
                }
            }
            $BD_NAME_18 {
                description $DESCRIPTION_18;
                vlan-id $VLAN_BD_18;
                l3-interface $IRB_IFL_18;
                vxlan {
                    vni $VNI_38;
                }
            }
            $BD_NAME_19 {
                description $DESCRIPTION_19;
                vlan-id $VLAN_BD_19;
                l3-interface $IRB_IFL_19;
                vxlan {
                    vni $VNI_39;
                }
            }
            $BD_NAME_20 {
                description $DESCRIPTION_20;
                vlan-id $VLAN_BD_20;
                l3-interface $IRB_IFL_20;
                vxlan {
                    vni $VNI_40;
                }
            }
            $BD_NAME_21 {
                description $DESCRIPTION_21;
                vlan-id $VLAN_BD_21;
                l3-interface $IRB_IFL_21;
                vxlan {
                    vni $VNI_41;
                }
            }
            $BD_NAME_22 {
                description $DESCRIPTION_22;
                vlan-id $VLAN_BD_22;
                l3-interface $IRB_IFL_22;
                vxlan {
                    vni $VNI_42;
                }
            }
            $BD_NAME_23 {
                description $DESCRIPTION_23;
                vlan-id $VLAN_BD_23;
                l3-interface $IRB_IFL_23;
                vxlan {
                    vni $VNI_43;
                }
            }
            $BD_NAME_24 {
                description $DESCRIPTION_24;
                vlan-id $VLAN_BD_24;
                l3-interface $IRB_IFL_24;
                vxlan {
                    vni $VNI_44;
                }
            }
            $BD_NAME_25 {
                description $DESCRIPTION_25;
                vlan-id $VLAN_BD_25;
                l3-interface $IRB_IFL_25;
                vxlan {
                    vni $VNI_45;
                }
            }
            $BD_NAME_26 {
                description $DESCRIPTION_26;
                vlan-id $VLAN_BD_26;
                l3-interface $IRB_IFL_26;
                vxlan {
                    vni $VNI_46;
                }
            }
            $BD_NAME_27 {
                description $DESCRIPTION_27;
                vlan-id $VLAN_BD_27;
                l3-interface $IRB_IFL_27;
                vxlan {
                    vni $VNI_47;
                }
            }
            $BD_NAME_28 {
                description $DESCRIPTION_28;
                vlan-id $VLAN_BD_28;
                l3-interface $IRB_IFL_28;
                vxlan {
                    vni $VNI_48;
                }
            }
            $BD_NAME_29 {
                description $DESCRIPTION_29;
                vlan-id $VLAN_BD_29;
                l3-interface $IRB_IFL_29;
                vxlan {
                    vni $VNI_49;
                }
            }
            $BD_NAME_30 {
                description $DESCRIPTION_30;
                vlan-id $VLAN_BD_30;
                l3-interface $IRB_IFL_30;
                vxlan {
                    vni $VNI_50;
                }
            }
            $BD_NAME_31 {
                description $DESCRIPTION_31;
                vlan-id $VLAN_BD_31;
                l3-interface $IRB_IFL_31;
                vxlan {
                    vni $VNI_51;
                }
            }
            $BD_NAME_32 {
                description $DESCRIPTION_32;
                vlan-id $VLAN_BD_32;
                l3-interface $IRB_IFL_32;
                vxlan {
                    vni $VNI_1;
                }
            }
            $BD_NAME_33 {
                description $DESCRIPTION_33;
                vlan-id $VLAN_BD_33;
                l3-interface $IRB_IFL_33;
                vxlan {
                    vni $VNI_2;
                }
            }
            $BD_NAME_34 {
                description $DESCRIPTION_34;
                vlan-id $VLAN_BD_34;
                l3-interface $IRB_IFL_34;
                vxlan {
                    vni $VNI_3;
                }
            }
            $BD_NAME_35 {
                description $DESCRIPTION_35;
                vlan-id $VLAN_BD_35;
                l3-interface $IRB_IFL_35;
                vxlan {
                    vni $VNI_4;
                }
            }
            $BD_NAME_36 {
                description $DESCRIPTION_36;
                vlan-id $VLAN_BD_36;
                l3-interface $IRB_IFL_36;
                vxlan {
                    vni $VNI_5;
                }
            }
            $BD_NAME_37 {
                description $DESCRIPTION_37;
                vlan-id $VLAN_BD_37;
                l3-interface $IRB_IFL_37;
                vxlan {
                    vni $VNI_6;
                }
            }
            $BD_NAME_38 {
                description $DESCRIPTION_38;
                vlan-id $VLAN_BD_38;
                l3-interface $IRB_IFL_38;
                vxlan {
                    vni $VNI_7;
                }
            }
            $BD_NAME_39 {
                description $DESCRIPTION_39;
                vlan-id $VLAN_BD_39;
                l3-interface $IRB_IFL_39;
                vxlan {
                    vni $VNI_8;
                }
            }
            $BD_NAME_40 {
                description $DESCRIPTION_40;
                vlan-id $VLAN_BD_40;
                l3-interface $IRB_IFL_40;
                vxlan {
                    vni $VNI_9;
                }
            }
            $BD_NAME_41 {
                description $DESCRIPTION_41;
                vlan-id $VLAN_BD_41;
                l3-interface $IRB_IFL_41;
                vxlan {
                    vni $VNI_10;
                }
            }
            $BD_NAME_42 {
                description $DESCRIPTION_42;
                vlan-id $VLAN_BD_42;
                l3-interface $IRB_IFL_42;
                vxlan {
                    vni $VNI_11;
                }
            }
            $BD_NAME_43 {
                description $DESCRIPTION_43;
                vlan-id $VLAN_BD_43;
                l3-interface $IRB_IFL_43;
                vxlan {
                    vni $VNI_12;
                }
            }
            $BD_NAME_44 {
                description $DESCRIPTION_44;
                vlan-id $VLAN_BD_44;
                l3-interface $IRB_IFL_44;
                vxlan {
                    vni $VNI_13;
                }
            }
            $BD_NAME_45 {
                description $DESCRIPTION_45;
                vlan-id $VLAN_BD_45;
                l3-interface $IRB_IFL_45;
                vxlan {
                    vni $VNI_14;
                }
            }
            $BD_NAME_46 {
                description $DESCRIPTION_46;
                vlan-id $VLAN_BD_46;
                l3-interface $IRB_IFL_46;
                vxlan {
                    vni $VNI_15;
                }
            }
            $BD_NAME_47 {
                description $DESCRIPTION_47;
                vlan-id $VLAN_BD_47;
                l3-interface $IRB_IFL_47;
                vxlan {
                    vni $VNI_16;
                }
            }
            $BD_NAME_48 {
                description $DESCRIPTION_48;
                vlan-id $VLAN_BD_48;
                l3-interface $IRB_IFL_48;
                vxlan {
                    vni $VNI_17;
                }
            }
            $BD_NAME_49 {
                description $DESCRIPTION_49;
                vlan-id $VLAN_BD_49;
                l3-interface $IRB_IFL_49;
                vxlan {
                    vni $VNI_18;
                }
            }
            $BD_NAME_50 {
                description $DESCRIPTION_50;
                vlan-id $VLAN_BD_50;
                l3-interface $IRB_IFL_50;
                vxlan {
                    vni $VNI_19;
                }
            }
            $BD_NAME_51 {
                description $DESCRIPTION_51;
                vlan-id $VLAN_BD_51;
                l3-interface $IRB_IFL_51;
                vxlan {
                    vni $VNI_20;
                }
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL_1`, `$AC_IFL_2`, `$IRB_IFL_1`, `$IRB_IFL_2`, `$IRB_IFL_3`, `$IRB_IFL_4`, `$IRB_IFL_5`, `$IRB_IFL_6`, `$IRB_IFL_7`, `$IRB_IFL_8`, `$IRB_IFL_9`, `$IRB_IFL_10`, `$IRB_IFL_11`, `$IRB_IFL_12`, `$IRB_IFL_13`, `$IRB_IFL_14`, `$IRB_IFL_15`, `$IRB_IFL_16`, `$IRB_IFL_17`, `$IRB_IFL_18`, `$IRB_IFL_19`, `$IRB_IFL_20`, `$IRB_IFL_21`, `$IRB_IFL_22`, `$IRB_IFL_23`, `$IRB_IFL_24`, `$IRB_IFL_25`, `$IRB_IFL_26`, `$IRB_IFL_27`, `$IRB_IFL_28`, `$IRB_IFL_29`, `$IRB_IFL_30`, `$IRB_IFL_31`, `$IRB_IFL_32`, `$IRB_IFL_33`, `$IRB_IFL_34`, `$IRB_IFL_35`, `$IRB_IFL_36`, `$IRB_IFL_37`, `$IRB_IFL_38`, `$IRB_IFL_39`, `$IRB_IFL_40`, `$IRB_IFL_41`, `$IRB_IFL_42`, `$IRB_IFL_43`, `$IRB_IFL_44`, `$IRB_IFL_45`, `$IRB_IFL_46`, `$IRB_IFL_47`, `$IRB_IFL_48`, `$IRB_IFL_49`, `$IRB_IFL_50`, `$IRB_IFL_51`): required, for each reference; one of `interfaces/ifl-ethernet-switching-trunk-vlans`, `interfaces/irb-inet-inet6-mtu-9000-mac-no-dhcp-flood`, `interfaces/irb-inet-inet6-mtu-9000-mac`, `interfaces/irb-inet-virtual-gateway-mtu-9000`

## evo/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-proxy-oism-3-ac.conf

```
/*
 * Topic: VLAN-aware EVPN-VXLAN MAC-VRF with 51 VLANs, IGMP snooping with proxy, OISM and three access interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   total 1
 * Pair with: none
 * Variables (example values from storage-leaf1_qfx5130-32cd):
 *   $INSTANCE_NAME   e.g. evpn-1
 *   $VNI_1           e.g. 10400
 *   $VNI_2           e.g. 10401
 *   $VNI_3           e.g. 10402
 *   $VNI_4           e.g. 10403
 *   $VNI_5           e.g. 10404
 *   $VNI_6           e.g. 10405
 *   $VNI_7           e.g. 10406
 *   $VNI_8           e.g. 10407
 *   $VNI_9           e.g. 10408
 *   $VNI_10          e.g. 10409
 *   $VNI_11          e.g. 10420
 *   $VNI_12          e.g. 10421
 *   $VNI_13          e.g. 10422
 *   $VNI_14          e.g. 10423
 *   $VNI_15          e.g. 10424
 *   $VNI_16          e.g. 10425
 *   $VNI_17          e.g. 10426
 *   $VNI_18          e.g. 10427
 *   $VNI_19          e.g. 10428
 *   $VNI_20          e.g. 10429
 *   $VNI_21          e.g. 11400
 *   $VNI_22          e.g. 11401
 *   $VNI_23          e.g. 11402
 *   $VNI_24          e.g. 11403
 *   $VNI_25          e.g. 11404
 *   $VNI_26          e.g. 11405
 *   $VNI_27          e.g. 11406
 *   $VNI_28          e.g. 11407
 *   $VNI_29          e.g. 11408
 *   $VNI_30          e.g. 11409
 *   $VNI_31          e.g. 11420
 *   $VNI_32          e.g. 11421
 *   $VNI_33          e.g. 11422
 *   $VNI_34          e.g. 11423
 *   $VNI_35          e.g. 11424
 *   $VNI_36          e.g. 11425
 *   $VNI_37          e.g. 11426
 *   $VNI_38          e.g. 11427
 *   $VNI_39          e.g. 11428
 *   $VNI_40          e.g. 11429
 *   $VNI_41          e.g. 12800
 *   $VNI_42          e.g. 12801
 *   $VNI_43          e.g. 12802
 *   $VNI_44          e.g. 12803
 *   $VNI_45          e.g. 12804
 *   $VNI_46          e.g. 12805
 *   $VNI_47          e.g. 12806
 *   $VNI_48          e.g. 12807
 *   $VNI_49          e.g. 12808
 *   $VNI_50          e.g. 12809
 *   $VNI_51          e.g. 35000
 *   $AC_IFL_1        e.g. et-0/0/2.0
 *   $AC_IFL_2        e.g. et-0/0/8:0.0
 *   $AC_IFL_3        e.g. ae1.0
 *   $LOOPBACK_V4     e.g. 192.168.252.10
 *   $BD_NAME_1       e.g. vn1400
 *   $DESCRIPTION_1   e.g. blue_all_1400
 *   $VLAN_BD_1       e.g. 1400
 *   $IRB_IFL_1       e.g. irb.1400
 *   $BD_NAME_2       e.g. vn1401
 *   $DESCRIPTION_2   e.g. blue_all_1401
 *   $VLAN_BD_2       e.g. 1401
 *   $IRB_IFL_2       e.g. irb.1401
 *   $BD_NAME_3       e.g. vn1402
 *   $DESCRIPTION_3   e.g. blue_all_1402
 *   $VLAN_BD_3       e.g. 1402
 *   $IRB_IFL_3       e.g. irb.1402
 *   $BD_NAME_4       e.g. vn1403
 *   $DESCRIPTION_4   e.g. blue_all_1403
 *   $VLAN_BD_4       e.g. 1403
 *   $IRB_IFL_4       e.g. irb.1403
 *   $BD_NAME_5       e.g. vn1404
 *   $DESCRIPTION_5   e.g. blue_all_1404
 *   $VLAN_BD_5       e.g. 1404
 *   $IRB_IFL_5       e.g. irb.1404
 *   $BD_NAME_6       e.g. vn1405
 *   $DESCRIPTION_6   e.g. blue_all_1405
 *   $VLAN_BD_6       e.g. 1405
 *   $IRB_IFL_6       e.g. irb.1405
 *   $BD_NAME_7       e.g. vn1406
 *   $DESCRIPTION_7   e.g. blue_all_1406
 *   $VLAN_BD_7       e.g. 1406
 *   $IRB_IFL_7       e.g. irb.1406
 *   $BD_NAME_8       e.g. vn1407
 *   $DESCRIPTION_8   e.g. blue_all_1407
 *   $VLAN_BD_8       e.g. 1407
 *   $IRB_IFL_8       e.g. irb.1407
 *   $BD_NAME_9       e.g. vn1408
 *   $DESCRIPTION_9   e.g. blue_all_1408
 *   $VLAN_BD_9       e.g. 1408
 *   $IRB_IFL_9       e.g. irb.1408
 *   $BD_NAME_10      e.g. vn1409
 *   $DESCRIPTION_10  e.g. blue_all_1409
 *   $VLAN_BD_10      e.g. 1409
 *   $IRB_IFL_10      e.g. irb.1409
 *   $BD_NAME_11      e.g. vn1420
 *   $DESCRIPTION_11  e.g. blue_sub_2_1420
 *   $VLAN_BD_11      e.g. 1420
 *   $IRB_IFL_11      e.g. irb.1420
 *   $BD_NAME_12      e.g. vn1421
 *   $DESCRIPTION_12  e.g. blue_sub_2_1421
 *   $VLAN_BD_12      e.g. 1421
 *   $IRB_IFL_12      e.g. irb.1421
 *   $BD_NAME_13      e.g. vn1422
 *   $DESCRIPTION_13  e.g. blue_sub_2_1422
 *   $VLAN_BD_13      e.g. 1422
 *   $IRB_IFL_13      e.g. irb.1422
 *   $BD_NAME_14      e.g. vn1423
 *   $DESCRIPTION_14  e.g. blue_sub_2_1423
 *   $VLAN_BD_14      e.g. 1423
 *   $IRB_IFL_14      e.g. irb.1423
 *   $BD_NAME_15      e.g. vn1424
 *   $DESCRIPTION_15  e.g. blue_sub_2_1424
 *   $VLAN_BD_15      e.g. 1424
 *   $IRB_IFL_15      e.g. irb.1424
 *   $BD_NAME_16      e.g. vn1425
 *   $DESCRIPTION_16  e.g. blue_sub_2_1425
 *   $VLAN_BD_16      e.g. 1425
 *   $IRB_IFL_16      e.g. irb.1425
 *   $BD_NAME_17      e.g. vn1426
 *   $DESCRIPTION_17  e.g. blue_sub_2_1426
 *   $VLAN_BD_17      e.g. 1426
 *   $IRB_IFL_17      e.g. irb.1426
 *   $BD_NAME_18      e.g. vn1427
 *   $DESCRIPTION_18  e.g. blue_sub_2_1427
 *   $VLAN_BD_18      e.g. 1427
 *   $IRB_IFL_18      e.g. irb.1427
 *   $BD_NAME_19      e.g. vn1428
 *   $DESCRIPTION_19  e.g. blue_sub_2_1428
 *   $VLAN_BD_19      e.g. 1428
 *   $IRB_IFL_19      e.g. irb.1428
 *   $BD_NAME_20      e.g. vn1429
 *   $DESCRIPTION_20  e.g. blue_sub_2_1429
 *   $VLAN_BD_20      e.g. 1429
 *   $IRB_IFL_20      e.g. irb.1429
 *   $BD_NAME_21      e.g. vn2800
 *   $DESCRIPTION_21  e.g. purple_2800
 *   $VLAN_BD_21      e.g. 2800
 *   $IRB_IFL_21      e.g. irb.2800
 *   $BD_NAME_22      e.g. vn2801
 *   $DESCRIPTION_22  e.g. purple_2801
 *   $VLAN_BD_22      e.g. 2801
 *   $IRB_IFL_22      e.g. irb.2801
 *   $BD_NAME_23      e.g. vn2802
 *   $DESCRIPTION_23  e.g. purple_2802
 *   $VLAN_BD_23      e.g. 2802
 *   $IRB_IFL_23      e.g. irb.2802
 *   $BD_NAME_24      e.g. vn2803
 *   $DESCRIPTION_24  e.g. purple_2803
 *   $VLAN_BD_24      e.g. 2803
 *   $IRB_IFL_24      e.g. irb.2803
 *   $BD_NAME_25      e.g. vn2804
 *   $DESCRIPTION_25  e.g. purple_2804
 *   $VLAN_BD_25      e.g. 2804
 *   $IRB_IFL_25      e.g. irb.2804
 *   $BD_NAME_26      e.g. vn2805
 *   $DESCRIPTION_26  e.g. purple_2805
 *   $VLAN_BD_26      e.g. 2805
 *   $IRB_IFL_26      e.g. irb.2805
 *   $BD_NAME_27      e.g. vn2806
 *   $DESCRIPTION_27  e.g. purple_2806
 *   $VLAN_BD_27      e.g. 2806
 *   $IRB_IFL_27      e.g. irb.2806
 *   $BD_NAME_28      e.g. vn2807
 *   $DESCRIPTION_28  e.g. purple_2807
 *   $VLAN_BD_28      e.g. 2807
 *   $IRB_IFL_28      e.g. irb.2807
 *   $BD_NAME_29      e.g. vn2808
 *   $DESCRIPTION_29  e.g. purple_2808
 *   $VLAN_BD_29      e.g. 2808
 *   $IRB_IFL_29      e.g. irb.2808
 *   $BD_NAME_30      e.g. vn2809
 *   $DESCRIPTION_30  e.g. purple_2809
 *   $VLAN_BD_30      e.g. 2809
 *   $IRB_IFL_30      e.g. irb.2809
 *   $BD_NAME_31      e.g. vn3500
 *   $DESCRIPTION_31  e.g. blue-SBD
 *   $VLAN_BD_31      e.g. 3500
 *   $IRB_IFL_31      e.g. irb.3500
 *   $BD_NAME_32      e.g. vn400
 *   $DESCRIPTION_32  e.g. red_all_400
 *   $VLAN_BD_32      e.g. 400
 *   $IRB_IFL_32      e.g. irb.400
 *   $BD_NAME_33      e.g. vn401
 *   $DESCRIPTION_33  e.g. red_all_401
 *   $VLAN_BD_33      e.g. 401
 *   $IRB_IFL_33      e.g. irb.401
 *   $BD_NAME_34      e.g. vn402
 *   $DESCRIPTION_34  e.g. red_all_402
 *   $VLAN_BD_34      e.g. 402
 *   $IRB_IFL_34      e.g. irb.402
 *   $BD_NAME_35      e.g. vn403
 *   $DESCRIPTION_35  e.g. red_all_403
 *   $VLAN_BD_35      e.g. 403
 *   $IRB_IFL_35      e.g. irb.403
 *   $BD_NAME_36      e.g. vn404
 *   $DESCRIPTION_36  e.g. red_all_404
 *   $VLAN_BD_36      e.g. 404
 *   $IRB_IFL_36      e.g. irb.404
 *   $BD_NAME_37      e.g. vn405
 *   $DESCRIPTION_37  e.g. red_all_405
 *   $VLAN_BD_37      e.g. 405
 *   $IRB_IFL_37      e.g. irb.405
 *   $BD_NAME_38      e.g. vn406
 *   $DESCRIPTION_38  e.g. red_all_406
 *   $VLAN_BD_38      e.g. 406
 *   $IRB_IFL_38      e.g. irb.406
 *   $BD_NAME_39      e.g. vn407
 *   $DESCRIPTION_39  e.g. red_all_407
 *   $VLAN_BD_39      e.g. 407
 *   $IRB_IFL_39      e.g. irb.407
 *   $BD_NAME_40      e.g. vn408
 *   $DESCRIPTION_40  e.g. red_all_408
 *   $VLAN_BD_40      e.g. 408
 *   $IRB_IFL_40      e.g. irb.408
 *   $BD_NAME_41      e.g. vn409
 *   $DESCRIPTION_41  e.g. red_all_409
 *   $VLAN_BD_41      e.g. 409
 *   $IRB_IFL_41      e.g. irb.409
 *   $BD_NAME_42      e.g. vn420
 *   $DESCRIPTION_42  e.g. red_sub_2_420
 *   $VLAN_BD_42      e.g. 420
 *   $IRB_IFL_42      e.g. irb.420
 *   $BD_NAME_43      e.g. vn421
 *   $DESCRIPTION_43  e.g. red_sub_2_421
 *   $VLAN_BD_43      e.g. 421
 *   $IRB_IFL_43      e.g. irb.421
 *   $BD_NAME_44      e.g. vn422
 *   $DESCRIPTION_44  e.g. red_sub_2_422
 *   $VLAN_BD_44      e.g. 422
 *   $IRB_IFL_44      e.g. irb.422
 *   $BD_NAME_45      e.g. vn423
 *   $DESCRIPTION_45  e.g. red_sub_2_423
 *   $VLAN_BD_45      e.g. 423
 *   $IRB_IFL_45      e.g. irb.423
 *   $BD_NAME_46      e.g. vn424
 *   $DESCRIPTION_46  e.g. red_sub_2_424
 *   $VLAN_BD_46      e.g. 424
 *   $IRB_IFL_46      e.g. irb.424
 *   $BD_NAME_47      e.g. vn425
 *   $DESCRIPTION_47  e.g. red_sub_2_425
 *   $VLAN_BD_47      e.g. 425
 *   $IRB_IFL_47      e.g. irb.425
 *   $BD_NAME_48      e.g. vn426
 *   $DESCRIPTION_48  e.g. red_sub_2_426
 *   $VLAN_BD_48      e.g. 426
 *   $IRB_IFL_48      e.g. irb.426
 *   $BD_NAME_49      e.g. vn427
 *   $DESCRIPTION_49  e.g. red_sub_2_427
 *   $VLAN_BD_49      e.g. 427
 *   $IRB_IFL_49      e.g. irb.427
 *   $BD_NAME_50      e.g. vn428
 *   $DESCRIPTION_50  e.g. red_sub_2_428
 *   $VLAN_BD_50      e.g. 428
 *   $IRB_IFL_50      e.g. irb.428
 *   $BD_NAME_51      e.g. vn429
 *   $DESCRIPTION_51  e.g. red_sub_2_429
 *   $VLAN_BD_51      e.g. 429
 *   $IRB_IFL_51      e.g. irb.429
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type mac-vrf;
        protocols {
            igmp-snooping {
                vlan all {
                    proxy;
                }
            }
            evpn {
                encapsulation vxlan;
                default-gateway no-gateway-community;
                duplicate-mac-detection {
                    auto-recovery-time 9;
                }
                extended-vni-list all;
                vni-options {
                    vni $VNI_1 {
                        vrf-target target:10400:1;
                    }
                    vni $VNI_2 {
                        vrf-target target:10401:1;
                    }
                    vni $VNI_3 {
                        vrf-target target:10402:1;
                    }
                    vni $VNI_4 {
                        vrf-target target:10403:1;
                    }
                    vni $VNI_5 {
                        vrf-target target:10404:1;
                    }
                    vni $VNI_6 {
                        vrf-target target:10405:1;
                    }
                    vni $VNI_7 {
                        vrf-target target:10406:1;
                    }
                    vni $VNI_8 {
                        vrf-target target:10407:1;
                    }
                    vni $VNI_9 {
                        vrf-target target:10408:1;
                    }
                    vni $VNI_10 {
                        vrf-target target:10409:1;
                    }
                    vni $VNI_11 {
                        vrf-target target:10420:1;
                    }
                    vni $VNI_12 {
                        vrf-target target:10421:1;
                    }
                    vni $VNI_13 {
                        vrf-target target:10422:1;
                    }
                    vni $VNI_14 {
                        vrf-target target:10423:1;
                    }
                    vni $VNI_15 {
                        vrf-target target:10424:1;
                    }
                    vni $VNI_16 {
                        vrf-target target:10425:1;
                    }
                    vni $VNI_17 {
                        vrf-target target:10426:1;
                    }
                    vni $VNI_18 {
                        vrf-target target:10427:1;
                    }
                    vni $VNI_19 {
                        vrf-target target:10428:1;
                    }
                    vni $VNI_20 {
                        vrf-target target:10429:1;
                    }
                    vni $VNI_21 {
                        vrf-target target:11400:1;
                    }
                    vni $VNI_22 {
                        vrf-target target:11401:1;
                    }
                    vni $VNI_23 {
                        vrf-target target:11402:1;
                    }
                    vni $VNI_24 {
                        vrf-target target:11403:1;
                    }
                    vni $VNI_25 {
                        vrf-target target:11404:1;
                    }
                    vni $VNI_26 {
                        vrf-target target:11405:1;
                    }
                    vni $VNI_27 {
                        vrf-target target:11406:1;
                    }
                    vni $VNI_28 {
                        vrf-target target:11407:1;
                    }
                    vni $VNI_29 {
                        vrf-target target:11408:1;
                    }
                    vni $VNI_30 {
                        vrf-target target:11409:1;
                    }
                    vni $VNI_31 {
                        vrf-target target:11420:1;
                    }
                    vni $VNI_32 {
                        vrf-target target:11421:1;
                    }
                    vni $VNI_33 {
                        vrf-target target:11422:1;
                    }
                    vni $VNI_34 {
                        vrf-target target:11423:1;
                    }
                    vni $VNI_35 {
                        vrf-target target:11424:1;
                    }
                    vni $VNI_36 {
                        vrf-target target:11425:1;
                    }
                    vni $VNI_37 {
                        vrf-target target:11426:1;
                    }
                    vni $VNI_38 {
                        vrf-target target:11427:1;
                    }
                    vni $VNI_39 {
                        vrf-target target:11428:1;
                    }
                    vni $VNI_40 {
                        vrf-target target:11429:1;
                    }
                    vni $VNI_41 {
                        vrf-target target:12800:1;
                    }
                    vni $VNI_42 {
                        vrf-target target:12801:1;
                    }
                    vni $VNI_43 {
                        vrf-target target:12802:1;
                    }
                    vni $VNI_44 {
                        vrf-target target:12803:1;
                    }
                    vni $VNI_45 {
                        vrf-target target:12804:1;
                    }
                    vni $VNI_46 {
                        vrf-target target:12805:1;
                    }
                    vni $VNI_47 {
                        vrf-target target:12806:1;
                    }
                    vni $VNI_48 {
                        vrf-target target:12807:1;
                    }
                    vni $VNI_49 {
                        vrf-target target:12808:1;
                    }
                    vni $VNI_50 {
                        vrf-target target:12809:1;
                    }
                    vni $VNI_51 {
                        vrf-target target:35000:1;
                    }
                }
            }
        }
        vtep-source-interface lo0.0;
        service-type vlan-aware;
        interface $AC_IFL_1;
        interface $AC_IFL_2;
        interface $AC_IFL_3;
        route-distinguisher $LOOPBACK_V4:65534;
        vrf-target target:100:100;
        multicast-snooping-options {
            oism {
                conserve-mcast-routes-in-pfe;
            }
        }
        vlans {
            $BD_NAME_1 {
                description $DESCRIPTION_1;
                vlan-id $VLAN_BD_1;
                l3-interface $IRB_IFL_1;
                vxlan {
                    vni $VNI_21;
                }
            }
            $BD_NAME_2 {
                description $DESCRIPTION_2;
                vlan-id $VLAN_BD_2;
                l3-interface $IRB_IFL_2;
                vxlan {
                    vni $VNI_22;
                }
            }
            $BD_NAME_3 {
                description $DESCRIPTION_3;
                vlan-id $VLAN_BD_3;
                l3-interface $IRB_IFL_3;
                vxlan {
                    vni $VNI_23;
                }
            }
            $BD_NAME_4 {
                description $DESCRIPTION_4;
                vlan-id $VLAN_BD_4;
                l3-interface $IRB_IFL_4;
                vxlan {
                    vni $VNI_24;
                }
            }
            $BD_NAME_5 {
                description $DESCRIPTION_5;
                vlan-id $VLAN_BD_5;
                l3-interface $IRB_IFL_5;
                vxlan {
                    vni $VNI_25;
                }
            }
            $BD_NAME_6 {
                description $DESCRIPTION_6;
                vlan-id $VLAN_BD_6;
                l3-interface $IRB_IFL_6;
                vxlan {
                    vni $VNI_26;
                }
            }
            $BD_NAME_7 {
                description $DESCRIPTION_7;
                vlan-id $VLAN_BD_7;
                l3-interface $IRB_IFL_7;
                vxlan {
                    vni $VNI_27;
                }
            }
            $BD_NAME_8 {
                description $DESCRIPTION_8;
                vlan-id $VLAN_BD_8;
                l3-interface $IRB_IFL_8;
                vxlan {
                    vni $VNI_28;
                }
            }
            $BD_NAME_9 {
                description $DESCRIPTION_9;
                vlan-id $VLAN_BD_9;
                l3-interface $IRB_IFL_9;
                vxlan {
                    vni $VNI_29;
                }
            }
            $BD_NAME_10 {
                description $DESCRIPTION_10;
                vlan-id $VLAN_BD_10;
                l3-interface $IRB_IFL_10;
                vxlan {
                    vni $VNI_30;
                }
            }
            $BD_NAME_11 {
                description $DESCRIPTION_11;
                vlan-id $VLAN_BD_11;
                l3-interface $IRB_IFL_11;
                vxlan {
                    vni $VNI_31;
                }
            }
            $BD_NAME_12 {
                description $DESCRIPTION_12;
                vlan-id $VLAN_BD_12;
                l3-interface $IRB_IFL_12;
                vxlan {
                    vni $VNI_32;
                }
            }
            $BD_NAME_13 {
                description $DESCRIPTION_13;
                vlan-id $VLAN_BD_13;
                l3-interface $IRB_IFL_13;
                vxlan {
                    vni $VNI_33;
                }
            }
            $BD_NAME_14 {
                description $DESCRIPTION_14;
                vlan-id $VLAN_BD_14;
                l3-interface $IRB_IFL_14;
                vxlan {
                    vni $VNI_34;
                }
            }
            $BD_NAME_15 {
                description $DESCRIPTION_15;
                vlan-id $VLAN_BD_15;
                l3-interface $IRB_IFL_15;
                vxlan {
                    vni $VNI_35;
                }
            }
            $BD_NAME_16 {
                description $DESCRIPTION_16;
                vlan-id $VLAN_BD_16;
                l3-interface $IRB_IFL_16;
                vxlan {
                    vni $VNI_36;
                }
            }
            $BD_NAME_17 {
                description $DESCRIPTION_17;
                vlan-id $VLAN_BD_17;
                l3-interface $IRB_IFL_17;
                vxlan {
                    vni $VNI_37;
                }
            }
            $BD_NAME_18 {
                description $DESCRIPTION_18;
                vlan-id $VLAN_BD_18;
                l3-interface $IRB_IFL_18;
                vxlan {
                    vni $VNI_38;
                }
            }
            $BD_NAME_19 {
                description $DESCRIPTION_19;
                vlan-id $VLAN_BD_19;
                l3-interface $IRB_IFL_19;
                vxlan {
                    vni $VNI_39;
                }
            }
            $BD_NAME_20 {
                description $DESCRIPTION_20;
                vlan-id $VLAN_BD_20;
                l3-interface $IRB_IFL_20;
                vxlan {
                    vni $VNI_40;
                }
            }
            $BD_NAME_21 {
                description $DESCRIPTION_21;
                vlan-id $VLAN_BD_21;
                l3-interface $IRB_IFL_21;
                vxlan {
                    vni $VNI_41;
                }
            }
            $BD_NAME_22 {
                description $DESCRIPTION_22;
                vlan-id $VLAN_BD_22;
                l3-interface $IRB_IFL_22;
                vxlan {
                    vni $VNI_42;
                }
            }
            $BD_NAME_23 {
                description $DESCRIPTION_23;
                vlan-id $VLAN_BD_23;
                l3-interface $IRB_IFL_23;
                vxlan {
                    vni $VNI_43;
                }
            }
            $BD_NAME_24 {
                description $DESCRIPTION_24;
                vlan-id $VLAN_BD_24;
                l3-interface $IRB_IFL_24;
                vxlan {
                    vni $VNI_44;
                }
            }
            $BD_NAME_25 {
                description $DESCRIPTION_25;
                vlan-id $VLAN_BD_25;
                l3-interface $IRB_IFL_25;
                vxlan {
                    vni $VNI_45;
                }
            }
            $BD_NAME_26 {
                description $DESCRIPTION_26;
                vlan-id $VLAN_BD_26;
                l3-interface $IRB_IFL_26;
                vxlan {
                    vni $VNI_46;
                }
            }
            $BD_NAME_27 {
                description $DESCRIPTION_27;
                vlan-id $VLAN_BD_27;
                l3-interface $IRB_IFL_27;
                vxlan {
                    vni $VNI_47;
                }
            }
            $BD_NAME_28 {
                description $DESCRIPTION_28;
                vlan-id $VLAN_BD_28;
                l3-interface $IRB_IFL_28;
                vxlan {
                    vni $VNI_48;
                }
            }
            $BD_NAME_29 {
                description $DESCRIPTION_29;
                vlan-id $VLAN_BD_29;
                l3-interface $IRB_IFL_29;
                vxlan {
                    vni $VNI_49;
                }
            }
            $BD_NAME_30 {
                description $DESCRIPTION_30;
                vlan-id $VLAN_BD_30;
                l3-interface $IRB_IFL_30;
                vxlan {
                    vni $VNI_50;
                }
            }
            $BD_NAME_31 {
                description $DESCRIPTION_31;
                vlan-id $VLAN_BD_31;
                l3-interface $IRB_IFL_31;
                vxlan {
                    vni $VNI_51;
                }
            }
            $BD_NAME_32 {
                description $DESCRIPTION_32;
                vlan-id $VLAN_BD_32;
                l3-interface $IRB_IFL_32;
                vxlan {
                    vni $VNI_1;
                }
            }
            $BD_NAME_33 {
                description $DESCRIPTION_33;
                vlan-id $VLAN_BD_33;
                l3-interface $IRB_IFL_33;
                vxlan {
                    vni $VNI_2;
                }
            }
            $BD_NAME_34 {
                description $DESCRIPTION_34;
                vlan-id $VLAN_BD_34;
                l3-interface $IRB_IFL_34;
                vxlan {
                    vni $VNI_3;
                }
            }
            $BD_NAME_35 {
                description $DESCRIPTION_35;
                vlan-id $VLAN_BD_35;
                l3-interface $IRB_IFL_35;
                vxlan {
                    vni $VNI_4;
                }
            }
            $BD_NAME_36 {
                description $DESCRIPTION_36;
                vlan-id $VLAN_BD_36;
                l3-interface $IRB_IFL_36;
                vxlan {
                    vni $VNI_5;
                }
            }
            $BD_NAME_37 {
                description $DESCRIPTION_37;
                vlan-id $VLAN_BD_37;
                l3-interface $IRB_IFL_37;
                vxlan {
                    vni $VNI_6;
                }
            }
            $BD_NAME_38 {
                description $DESCRIPTION_38;
                vlan-id $VLAN_BD_38;
                l3-interface $IRB_IFL_38;
                vxlan {
                    vni $VNI_7;
                }
            }
            $BD_NAME_39 {
                description $DESCRIPTION_39;
                vlan-id $VLAN_BD_39;
                l3-interface $IRB_IFL_39;
                vxlan {
                    vni $VNI_8;
                }
            }
            $BD_NAME_40 {
                description $DESCRIPTION_40;
                vlan-id $VLAN_BD_40;
                l3-interface $IRB_IFL_40;
                vxlan {
                    vni $VNI_9;
                }
            }
            $BD_NAME_41 {
                description $DESCRIPTION_41;
                vlan-id $VLAN_BD_41;
                l3-interface $IRB_IFL_41;
                vxlan {
                    vni $VNI_10;
                }
            }
            $BD_NAME_42 {
                description $DESCRIPTION_42;
                vlan-id $VLAN_BD_42;
                l3-interface $IRB_IFL_42;
                vxlan {
                    vni $VNI_11;
                }
            }
            $BD_NAME_43 {
                description $DESCRIPTION_43;
                vlan-id $VLAN_BD_43;
                l3-interface $IRB_IFL_43;
                vxlan {
                    vni $VNI_12;
                }
            }
            $BD_NAME_44 {
                description $DESCRIPTION_44;
                vlan-id $VLAN_BD_44;
                l3-interface $IRB_IFL_44;
                vxlan {
                    vni $VNI_13;
                }
            }
            $BD_NAME_45 {
                description $DESCRIPTION_45;
                vlan-id $VLAN_BD_45;
                l3-interface $IRB_IFL_45;
                vxlan {
                    vni $VNI_14;
                }
            }
            $BD_NAME_46 {
                description $DESCRIPTION_46;
                vlan-id $VLAN_BD_46;
                l3-interface $IRB_IFL_46;
                vxlan {
                    vni $VNI_15;
                }
            }
            $BD_NAME_47 {
                description $DESCRIPTION_47;
                vlan-id $VLAN_BD_47;
                l3-interface $IRB_IFL_47;
                vxlan {
                    vni $VNI_16;
                }
            }
            $BD_NAME_48 {
                description $DESCRIPTION_48;
                vlan-id $VLAN_BD_48;
                l3-interface $IRB_IFL_48;
                vxlan {
                    vni $VNI_17;
                }
            }
            $BD_NAME_49 {
                description $DESCRIPTION_49;
                vlan-id $VLAN_BD_49;
                l3-interface $IRB_IFL_49;
                vxlan {
                    vni $VNI_18;
                }
            }
            $BD_NAME_50 {
                description $DESCRIPTION_50;
                vlan-id $VLAN_BD_50;
                l3-interface $IRB_IFL_50;
                vxlan {
                    vni $VNI_19;
                }
            }
            $BD_NAME_51 {
                description $DESCRIPTION_51;
                vlan-id $VLAN_BD_51;
                l3-interface $IRB_IFL_51;
                vxlan {
                    vni $VNI_20;
                }
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL_1`, `$AC_IFL_2`, `$AC_IFL_3`, `$IRB_IFL_1`, `$IRB_IFL_2`, `$IRB_IFL_3`, `$IRB_IFL_4`, `$IRB_IFL_5`, `$IRB_IFL_6`, `$IRB_IFL_7`, `$IRB_IFL_8`, `$IRB_IFL_9`, `$IRB_IFL_10`, `$IRB_IFL_11`, `$IRB_IFL_12`, `$IRB_IFL_13`, `$IRB_IFL_14`, `$IRB_IFL_15`, `$IRB_IFL_16`, `$IRB_IFL_17`, `$IRB_IFL_18`, `$IRB_IFL_19`, `$IRB_IFL_20`, `$IRB_IFL_21`, `$IRB_IFL_22`, `$IRB_IFL_23`, `$IRB_IFL_24`, `$IRB_IFL_25`, `$IRB_IFL_26`, `$IRB_IFL_27`, `$IRB_IFL_28`, `$IRB_IFL_29`, `$IRB_IFL_30`, `$IRB_IFL_31`, `$IRB_IFL_32`, `$IRB_IFL_33`, `$IRB_IFL_34`, `$IRB_IFL_35`, `$IRB_IFL_36`, `$IRB_IFL_37`, `$IRB_IFL_38`, `$IRB_IFL_39`, `$IRB_IFL_40`, `$IRB_IFL_41`, `$IRB_IFL_42`, `$IRB_IFL_43`, `$IRB_IFL_44`, `$IRB_IFL_45`, `$IRB_IFL_46`, `$IRB_IFL_47`, `$IRB_IFL_48`, `$IRB_IFL_49`, `$IRB_IFL_50`, `$IRB_IFL_51`): required, for each reference; one of `interfaces/ifl-ethernet-switching-trunk-vlans-filter-storm-control`, `interfaces/ifl-ethernet-switching-trunk-vlans`, `interfaces/irb-inet-inet6-mtu-9000-mac-no-dhcp-flood`, `interfaces/irb-inet-inet6-mtu-9000-mac`, `interfaces/irb-inet-virtual-gateway-mtu-9000`

## evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-10-irb.conf

```
/*
 * Topic: EVPN Type 5 VRF with ten IRB units and a loopback unit
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 2
 * Pair with: none
 * Variables (example values from storage-leaf1_qfx5130-32cd):
 *   $INSTANCE_NAME         e.g. purple
 *   $VNI                   e.g. 20004
 *   $IP_PREFIX_EXPORT_POL  e.g. BGP-AOS-Policy-purple
 *   $IRB_IFL_1             e.g. irb.2800
 *   $IRB_IFL_2             e.g. irb.2801
 *   $IRB_IFL_3             e.g. irb.2802
 *   $IRB_IFL_4             e.g. irb.2803
 *   $IRB_IFL_5             e.g. irb.2804
 *   $IRB_IFL_6             e.g. irb.2805
 *   $IRB_IFL_7             e.g. irb.2806
 *   $IRB_IFL_8             e.g. irb.2807
 *   $IRB_IFL_9             e.g. irb.2808
 *   $IRB_IFL_10            e.g. irb.2809
 *   $LOOPBACK_IFL          e.g. lo0.5
 *   $LOOPBACK_V4           e.g. 192.168.252.10
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
        interface $IRB_IFL_1;
        interface $IRB_IFL_2;
        interface $IRB_IFL_3;
        interface $IRB_IFL_4;
        interface $IRB_IFL_5;
        interface $IRB_IFL_6;
        interface $IRB_IFL_7;
        interface $IRB_IFL_8;
        interface $IRB_IFL_9;
        interface $IRB_IFL_10;
        interface $LOOPBACK_IFL;
        route-distinguisher $LOOPBACK_V4:5;
        vrf-target target:20004:1;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `irb-service`: required, all related; one of 11 providers listed in MANIFEST.json
- `logical-interface` (`$IRB_IFL_1`, `$IRB_IFL_2`, `$IRB_IFL_3`, `$IRB_IFL_4`, `$IRB_IFL_5`, `$IRB_IFL_6`, `$IRB_IFL_7`, `$IRB_IFL_8`, `$IRB_IFL_9`, `$IRB_IFL_10`, `$LOOPBACK_IFL`): required, for each reference; one of `interfaces/ifl-loopback-inet-inet6`, `interfaces/irb-inet-inet6-mtu-9000-mac`
- `policy-statement` (`$IP_PREFIX_EXPORT_POL`): required, for each reference; `policy-options/policy-statement/ps-from-policy-evpn-host-routes-community-add-reject`

## evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb.conf

```
/*
 * Topic: EVPN Type 5 VRF with twenty IRB units, a loopback unit and DHCP relay
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 2
 * Pair with: none
 * Variables (example values from storage-leaf1_qfx5130-32cd):
 *   $INSTANCE_NAME         e.g. red
 *   $VNI                   e.g. 20001
 *   $IP_PREFIX_EXPORT_POL  e.g. BGP-AOS-Policy-red
 *   $DHCP_RELAY_GROUP      e.g. red
 *   $IRB_IFL_1             e.g. irb.400
 *   $LOOPBACK_IFL          e.g. lo0.2
 *   $IRB_IFL_2             e.g. irb.401
 *   $IRB_IFL_3             e.g. irb.402
 *   $IRB_IFL_4             e.g. irb.403
 *   $IRB_IFL_5             e.g. irb.404
 *   $IRB_IFL_6             e.g. irb.405
 *   $IRB_IFL_7             e.g. irb.406
 *   $IRB_IFL_8             e.g. irb.407
 *   $IRB_IFL_9             e.g. irb.408
 *   $IRB_IFL_10            e.g. irb.409
 *   $IRB_IFL_11            e.g. irb.420
 *   $IRB_IFL_12            e.g. irb.421
 *   $IRB_IFL_13            e.g. irb.422
 *   $IRB_IFL_14            e.g. irb.423
 *   $IRB_IFL_15            e.g. irb.424
 *   $IRB_IFL_16            e.g. irb.425
 *   $IRB_IFL_17            e.g. irb.426
 *   $IRB_IFL_18            e.g. irb.427
 *   $IRB_IFL_19            e.g. irb.428
 *   $IRB_IFL_20            e.g. irb.429
 *   $LOOPBACK_V4           e.g. 192.168.252.10
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
        forwarding-options {
            dhcp-relay {
                forward-only;
                server-group {
                    red {
                        192.168.37.100;
                    }
                }
                group $DHCP_RELAY_GROUP {
                    active-server-group red;
                    relay-option-82 {
                        server-id-override;
                    }
                    interface $IRB_IFL_1 {
                        overrides {
                            relay-source $LOOPBACK_IFL;
                        }
                    }
                }
            }
        }
        interface $IRB_IFL_1;
        interface $IRB_IFL_2;
        interface $IRB_IFL_3;
        interface $IRB_IFL_4;
        interface $IRB_IFL_5;
        interface $IRB_IFL_6;
        interface $IRB_IFL_7;
        interface $IRB_IFL_8;
        interface $IRB_IFL_9;
        interface $IRB_IFL_10;
        interface $IRB_IFL_11;
        interface $IRB_IFL_12;
        interface $IRB_IFL_13;
        interface $IRB_IFL_14;
        interface $IRB_IFL_15;
        interface $IRB_IFL_16;
        interface $IRB_IFL_17;
        interface $IRB_IFL_18;
        interface $IRB_IFL_19;
        interface $IRB_IFL_20;
        interface $LOOPBACK_IFL;
        route-distinguisher $LOOPBACK_V4:2;
        vrf-target target:20001:1;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `irb-service`: required, all related; one of 11 providers listed in MANIFEST.json
- `logical-interface` (`$IRB_IFL_1`, `$IRB_IFL_2`, `$IRB_IFL_3`, `$IRB_IFL_4`, `$IRB_IFL_5`, `$IRB_IFL_6`, `$IRB_IFL_7`, `$IRB_IFL_8`, `$IRB_IFL_9`, `$IRB_IFL_10`, `$IRB_IFL_11`, `$IRB_IFL_12`, `$IRB_IFL_13`, `$IRB_IFL_14`, `$IRB_IFL_15`, `$IRB_IFL_16`, `$IRB_IFL_17`, `$IRB_IFL_18`, `$IRB_IFL_19`, `$IRB_IFL_20`, `$LOOPBACK_IFL`): required, for each reference; one of `interfaces/ifl-loopback-inet-inet6`, `interfaces/irb-inet-inet6-mtu-9000-mac-no-dhcp-flood`, `interfaces/irb-inet-inet6-mtu-9000-mac`
- `policy-statement` (`$IP_PREFIX_EXPORT_POL`): required, for each reference; `policy-options/policy-statement/ps-from-policy-evpn-host-routes-community-add-reject`

## evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-10-irb.conf

```
/*
 * Topic: Border EVPN Type 5 VRF with eBGP (IPv4 and IPv6) to the external router and ten IRB units
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   total 2
 * Pair with: none
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $INSTANCE_NAME         e.g. yellow
 *   $BGP_GROUP             e.g. l3rtr
 *   $CE_PEER_V6            e.g. 2001:db8:dc4:10:204::5
 *   $DESCRIPTION           e.g. facing_mx-external
 *   $PE_LOCAL_V6           e.g. 2001:db8:dc4:10:204::4
 *   $BGP_IMPORT_POL        e.g. RoutesFromExt-yellow-external_router
 *   $BGP_EXPORT_POL        e.g. RoutesToExt-yellow-external_router
 *   $ASN_CUSTOMER          e.g. 65000
 *   $CE_PEER_V4            e.g. 10.204.0.1
 *   $PE_LOCAL_V4           e.g. 10.204.0.0
 *   $VNI                   e.g. 20005
 *   $IP_PREFIX_EXPORT_POL  e.g. BGP-AOS-Policy-yellow
 *   $AC_IFL                e.g. et-0/0/7.399
 *   $IRB_IFL_1             e.g. irb.3100
 *   $IRB_IFL_2             e.g. irb.3101
 *   $IRB_IFL_3             e.g. irb.3102
 *   $IRB_IFL_4             e.g. irb.3103
 *   $IRB_IFL_5             e.g. irb.3104
 *   $IRB_IFL_6             e.g. irb.3105
 *   $IRB_IFL_7             e.g. irb.3106
 *   $IRB_IFL_8             e.g. irb.3107
 *   $IRB_IFL_9             e.g. irb.3108
 *   $IRB_IFL_10            e.g. irb.3109
 *   $LOOPBACK_IFL          e.g. lo0.6
 *   $LOOPBACK_V4           e.g. 192.168.252.12
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
            bgp {
                group $BGP_GROUP {
                    type external;
                    multihop {
                        ttl 1;
                    }
                    family inet {
                        unicast {
                            loops 2;
                        }
                    }
                    family inet6 {
                        unicast {
                            loops 2;
                        }
                    }
                    multipath {
                        multiple-as;
                    }
                    neighbor $CE_PEER_V6 {
                        description $DESCRIPTION;
                        multihop {
                            ttl 2;
                        }
                        local-address $PE_LOCAL_V6;
                        import ( $BGP_IMPORT_POL );
                        family inet6 {
                            unicast;
                        }
                        export ( $BGP_EXPORT_POL );
                        peer-as $ASN_CUSTOMER;
                    }
                    neighbor $CE_PEER_V4 {
                        description $DESCRIPTION;
                        multihop {
                            ttl 2;
                        }
                        local-address $PE_LOCAL_V4;
                        import ( $BGP_IMPORT_POL );
                        family inet {
                            unicast;
                        }
                        export ( $BGP_EXPORT_POL );
                        peer-as $ASN_CUSTOMER;
                    }
                }
                graceful-restart {
                    dont-help-shared-fate-bfd-down;
                }
            }
            evpn {
                ip-prefix-routes {
                    advertise direct-nexthop;
                    encapsulation vxlan;
                    vni $VNI;
                    export $IP_PREFIX_EXPORT_POL;
                }
            }
        }
        interface $AC_IFL;
        interface $IRB_IFL_1;
        interface $IRB_IFL_2;
        interface $IRB_IFL_3;
        interface $IRB_IFL_4;
        interface $IRB_IFL_5;
        interface $IRB_IFL_6;
        interface $IRB_IFL_7;
        interface $IRB_IFL_8;
        interface $IRB_IFL_9;
        interface $IRB_IFL_10;
        interface $LOOPBACK_IFL;
        route-distinguisher $LOOPBACK_V4:6;
        vrf-target target:20005:1;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `irb-service`: required, all related; one of 11 providers listed in MANIFEST.json
- `logical-interface` (`$AC_IFL`, `$IRB_IFL_1`, `$IRB_IFL_2`, `$IRB_IFL_3`, `$IRB_IFL_4`, `$IRB_IFL_5`, `$IRB_IFL_6`, `$IRB_IFL_7`, `$IRB_IFL_8`, `$IRB_IFL_9`, `$IRB_IFL_10`, `$LOOPBACK_IFL`): required, for each reference; one of `interfaces/ifl-loopback-inet-inet6`, `interfaces/ifl-vlan-inet-inet6-description`, `interfaces/irb-inet-inet6-mtu-9000-mac`
- `policy-statement` (`$BGP_IMPORT_POL`, `$BGP_EXPORT_POL`, `$IP_PREFIX_EXPORT_POL`): required, for each reference; one of `policy-options/policy-statement/ps-from-policy-bgp-evpn-host-routes-community-add-reject`, `policy-options/policy-statement/ps-route-filter-list-inet-inet6-community-add-reject`, `policy-options/policy-statement/ps-route-filter-list-inet-inet6-community-delete-reject`

## evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay-20-irb.conf

```
/*
 * Topic: Border EVPN Type 5 VRF with eBGP (IPv4 and IPv6) to the external router, twenty IRB units and DHCP relay
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   total 2
 * Pair with: none
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $INSTANCE_NAME         e.g. red
 *   $BGP_GROUP             e.g. l3rtr
 *   $CE_PEER_V6            e.g. 2001:db8:dc4:10:204::9
 *   $DESCRIPTION           e.g. facing_mx-external
 *   $PE_LOCAL_V6           e.g. 2001:db8:dc4:10:204::8
 *   $BGP_IMPORT_POL        e.g. RoutesFromExt-red-external_router
 *   $BGP_EXPORT_POL        e.g. RoutesToExt-red-external_router
 *   $ASN_CUSTOMER          e.g. 65000
 *   $CE_PEER_V4            e.g. 10.204.0.5
 *   $PE_LOCAL_V4           e.g. 10.204.0.4
 *   $VNI                   e.g. 20001
 *   $IP_PREFIX_EXPORT_POL  e.g. BGP-AOS-Policy-red
 *   $DHCP_RELAY_GROUP      e.g. red
 *   $IRB_IFL_1             e.g. irb.400
 *   $LOOPBACK_IFL          e.g. lo0.2
 *   $AC_IFL                e.g. et-0/0/7.199
 *   $IRB_IFL_2             e.g. irb.401
 *   $IRB_IFL_3             e.g. irb.402
 *   $IRB_IFL_4             e.g. irb.403
 *   $IRB_IFL_5             e.g. irb.404
 *   $IRB_IFL_6             e.g. irb.405
 *   $IRB_IFL_7             e.g. irb.406
 *   $IRB_IFL_8             e.g. irb.407
 *   $IRB_IFL_9             e.g. irb.408
 *   $IRB_IFL_10            e.g. irb.409
 *   $IRB_IFL_11            e.g. irb.430
 *   $IRB_IFL_12            e.g. irb.431
 *   $IRB_IFL_13            e.g. irb.432
 *   $IRB_IFL_14            e.g. irb.433
 *   $IRB_IFL_15            e.g. irb.434
 *   $IRB_IFL_16            e.g. irb.435
 *   $IRB_IFL_17            e.g. irb.436
 *   $IRB_IFL_18            e.g. irb.437
 *   $IRB_IFL_19            e.g. irb.438
 *   $IRB_IFL_20            e.g. irb.439
 *   $LOOPBACK_V4           e.g. 192.168.252.12
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
            bgp {
                group $BGP_GROUP {
                    type external;
                    multihop {
                        ttl 1;
                    }
                    family inet {
                        unicast {
                            loops 2;
                        }
                    }
                    family inet6 {
                        unicast {
                            loops 2;
                        }
                    }
                    multipath {
                        multiple-as;
                    }
                    neighbor $CE_PEER_V6 {
                        description $DESCRIPTION;
                        multihop {
                            ttl 2;
                        }
                        local-address $PE_LOCAL_V6;
                        import ( $BGP_IMPORT_POL );
                        family inet6 {
                            unicast;
                        }
                        export ( $BGP_EXPORT_POL );
                        peer-as $ASN_CUSTOMER;
                    }
                    neighbor $CE_PEER_V4 {
                        description $DESCRIPTION;
                        multihop {
                            ttl 2;
                        }
                        local-address $PE_LOCAL_V4;
                        import ( $BGP_IMPORT_POL );
                        family inet {
                            unicast;
                        }
                        export ( $BGP_EXPORT_POL );
                        peer-as $ASN_CUSTOMER;
                    }
                }
                graceful-restart {
                    dont-help-shared-fate-bfd-down;
                }
            }
            evpn {
                ip-prefix-routes {
                    advertise direct-nexthop;
                    encapsulation vxlan;
                    vni $VNI;
                    export $IP_PREFIX_EXPORT_POL;
                }
            }
        }
        forwarding-options {
            dhcp-relay {
                forward-only;
                server-group {
                    red {
                        192.168.37.100;
                    }
                }
                group $DHCP_RELAY_GROUP {
                    active-server-group red;
                    relay-option-82 {
                        server-id-override;
                    }
                    interface $IRB_IFL_1 {
                        overrides {
                            relay-source $LOOPBACK_IFL;
                        }
                    }
                }
            }
        }
        interface $AC_IFL;
        interface $IRB_IFL_1;
        interface $IRB_IFL_2;
        interface $IRB_IFL_3;
        interface $IRB_IFL_4;
        interface $IRB_IFL_5;
        interface $IRB_IFL_6;
        interface $IRB_IFL_7;
        interface $IRB_IFL_8;
        interface $IRB_IFL_9;
        interface $IRB_IFL_10;
        interface $IRB_IFL_11;
        interface $IRB_IFL_12;
        interface $IRB_IFL_13;
        interface $IRB_IFL_14;
        interface $IRB_IFL_15;
        interface $IRB_IFL_16;
        interface $IRB_IFL_17;
        interface $IRB_IFL_18;
        interface $IRB_IFL_19;
        interface $IRB_IFL_20;
        interface $LOOPBACK_IFL;
        route-distinguisher $LOOPBACK_V4:2;
        vrf-target target:20001:1;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `irb-service`: required, all related; one of 11 providers listed in MANIFEST.json
- `logical-interface` (`$AC_IFL`, `$IRB_IFL_1`, `$IRB_IFL_2`, `$IRB_IFL_3`, `$IRB_IFL_4`, `$IRB_IFL_5`, `$IRB_IFL_6`, `$IRB_IFL_7`, `$IRB_IFL_8`, `$IRB_IFL_9`, `$IRB_IFL_10`, `$IRB_IFL_11`, `$IRB_IFL_12`, `$IRB_IFL_13`, `$IRB_IFL_14`, `$IRB_IFL_15`, `$IRB_IFL_16`, `$IRB_IFL_17`, `$IRB_IFL_18`, `$IRB_IFL_19`, `$IRB_IFL_20`, `$LOOPBACK_IFL`): required, for each reference; one of `interfaces/ifl-loopback-inet-inet6`, `interfaces/ifl-vlan-inet-inet6-description`, `interfaces/irb-inet-inet6-mtu-9000-mac-no-dhcp-flood`, `interfaces/irb-inet-inet6-mtu-9000-mac`
- `policy-statement` (`$BGP_IMPORT_POL`, `$BGP_EXPORT_POL`, `$IP_PREFIX_EXPORT_POL`): required, for each reference; one of `policy-options/policy-statement/ps-from-policy-bgp-evpn-host-routes-community-add-reject`, `policy-options/policy-statement/ps-route-filter-list-inet-inet6-community-add-reject`, `policy-options/policy-statement/ps-route-filter-list-inet-inet6-community-delete-reject`

## evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay.conf

```
/*
 * Topic: Border EVPN Type 5 VRF with eBGP (IPv4 and IPv6) to the external router and DHCP relay
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   total 2
 * Pair with: none
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $INSTANCE_NAME         e.g. green
 *   $BGP_GROUP             e.g. l3rtr
 *   $CE_PEER_V6            e.g. 2001:db8:dc4:10:204::11
 *   $DESCRIPTION           e.g. facing_mx-external
 *   $PE_LOCAL_V6           e.g. 2001:db8:dc4:10:204::10
 *   $BGP_IMPORT_POL        e.g. RoutesFromExt-green-external_router
 *   $BGP_EXPORT_POL        e.g. RoutesToExt-green-external_router
 *   $ASN_CUSTOMER          e.g. 65000
 *   $CE_PEER_V4            e.g. 10.204.0.13
 *   $PE_LOCAL_V4           e.g. 10.204.0.12
 *   $VNI                   e.g. 20003
 *   $IP_PREFIX_EXPORT_POL  e.g. BGP-AOS-Policy-green
 *   $DHCP_RELAY_GROUP      e.g. green
 *   $AC_IFL                e.g. et-0/0/7.499
 *   $LOOPBACK_IFL          e.g. lo0.4
 *   $LOOPBACK_V4           e.g. 192.168.252.12
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
            bgp {
                group $BGP_GROUP {
                    type external;
                    multihop {
                        ttl 1;
                    }
                    family inet {
                        unicast {
                            loops 2;
                        }
                    }
                    family inet6 {
                        unicast {
                            loops 2;
                        }
                    }
                    multipath {
                        multiple-as;
                    }
                    neighbor $CE_PEER_V6 {
                        description $DESCRIPTION;
                        multihop {
                            ttl 2;
                        }
                        local-address $PE_LOCAL_V6;
                        import ( $BGP_IMPORT_POL );
                        family inet6 {
                            unicast;
                        }
                        export ( $BGP_EXPORT_POL );
                        peer-as $ASN_CUSTOMER;
                    }
                    neighbor $CE_PEER_V4 {
                        description $DESCRIPTION;
                        multihop {
                            ttl 2;
                        }
                        local-address $PE_LOCAL_V4;
                        import ( $BGP_IMPORT_POL );
                        family inet {
                            unicast;
                        }
                        export ( $BGP_EXPORT_POL );
                        peer-as $ASN_CUSTOMER;
                    }
                }
                graceful-restart {
                    dont-help-shared-fate-bfd-down;
                }
            }
            evpn {
                ip-prefix-routes {
                    advertise direct-nexthop;
                    encapsulation vxlan;
                    vni $VNI;
                    export $IP_PREFIX_EXPORT_POL;
                }
            }
        }
        forwarding-options {
            dhcp-relay {
                forward-only;
                server-group {
                    green {
                        10.25.0.200;
                    }
                }
                group $DHCP_RELAY_GROUP {
                    active-server-group green;
                    relay-option-82 {
                        server-id-override;
                    }
                }
            }
        }
        interface $AC_IFL;
        interface $LOOPBACK_IFL;
        route-distinguisher $LOOPBACK_V4:4;
        vrf-target target:20003:1;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`, `$LOOPBACK_IFL`): required, for each reference; one of `interfaces/ifl-loopback-inet-inet6`, `interfaces/ifl-vlan-inet-inet6-description`
- `policy-statement` (`$BGP_IMPORT_POL`, `$BGP_EXPORT_POL`, `$IP_PREFIX_EXPORT_POL`): required, for each reference; one of `policy-options/policy-statement/ps-from-policy-bgp-evpn-host-routes-community-add-reject`, `policy-options/policy-statement/ps-route-filter-list-inet-inet6-community-add-reject`, `policy-options/policy-statement/ps-route-filter-list-inet-inet6-community-delete-reject`

## evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-ospf-pim-oism-dhcp-relay.conf

```
/*
 * Topic: Border EVPN Type 5 VRF with eBGP (IPv4 and IPv6) to the external router, OSPF and PIM, OISM, DHCP relay and static routes
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   total 2
 * Pair with: none
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $INSTANCE_NAME         e.g. blue
 *   $BGP_GROUP             e.g. l3rtr
 *   $CE_PEER_V6            e.g. 2001:db8:dc4:10:204::1
 *   $DESCRIPTION           e.g. facing_mx-external
 *   $PE_LOCAL_V6           e.g. 2001:db8:dc4:10:204::
 *   $BGP_IMPORT_POL        e.g. RoutesFromExt-blue-external_router
 *   $BGP_EXPORT_POL        e.g. RoutesToExt-blue-external_router
 *   $ASN_CUSTOMER          e.g. 65000
 *   $CE_PEER_V4            e.g. 10.204.0.9
 *   $PE_LOCAL_V4           e.g. 10.204.0.8
 *   $VNI                   e.g. 20002
 *   $IP_PREFIX_EXPORT_POL  e.g. BGP-AOS-Policy-blue
 *   $IRB_IFL_1             e.g. irb.3500
 *   $LOOPBACK_IFL          e.g. lo0.3
 *   $AC_IFL                e.g. et-0/0/7.299
 *   $AC_ADDR_V4            e.g. 100.100.100.100
 *   $IRB_IFL_2             e.g. irb.1400
 *   $IRB_IFL_3             e.g. irb.1401
 *   $DHCP_RELAY_GROUP      e.g. blue
 *   $IRB_IFL_4             e.g. irb.1402
 *   $IRB_IFL_5             e.g. irb.1403
 *   $IRB_IFL_6             e.g. irb.1404
 *   $IRB_IFL_7             e.g. irb.1405
 *   $IRB_IFL_8             e.g. irb.1406
 *   $IRB_IFL_9             e.g. irb.1407
 *   $IRB_IFL_10            e.g. irb.1408
 *   $IRB_IFL_11            e.g. irb.1409
 *   $IRB_IFL_12            e.g. irb.1430
 *   $IRB_IFL_13            e.g. irb.1431
 *   $IRB_IFL_14            e.g. irb.1432
 *   $IRB_IFL_15            e.g. irb.1433
 *   $IRB_IFL_16            e.g. irb.1434
 *   $IRB_IFL_17            e.g. irb.1435
 *   $IRB_IFL_18            e.g. irb.1436
 *   $IRB_IFL_19            e.g. irb.1437
 *   $IRB_IFL_20            e.g. irb.1438
 *   $IRB_IFL_21            e.g. irb.1439
 *   $LOOPBACK_V4           e.g. 192.168.252.12
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
            bgp {
                group $BGP_GROUP {
                    type external;
                    multihop {
                        ttl 1;
                    }
                    family inet {
                        unicast {
                            loops 2;
                        }
                    }
                    family inet6 {
                        unicast {
                            loops 2;
                        }
                    }
                    multipath {
                        multiple-as;
                    }
                    neighbor $CE_PEER_V6 {
                        description $DESCRIPTION;
                        multihop {
                            ttl 2;
                        }
                        local-address $PE_LOCAL_V6;
                        import ( $BGP_IMPORT_POL );
                        family inet6 {
                            unicast;
                        }
                        export ( $BGP_EXPORT_POL );
                        peer-as $ASN_CUSTOMER;
                    }
                    neighbor $CE_PEER_V4 {
                        description $DESCRIPTION;
                        multihop {
                            ttl 2;
                        }
                        local-address $PE_LOCAL_V4;
                        import ( $BGP_IMPORT_POL );
                        family inet {
                            unicast;
                        }
                        export ( $BGP_EXPORT_POL );
                        peer-as $ASN_CUSTOMER;
                    }
                }
                graceful-restart {
                    dont-help-shared-fate-bfd-down;
                }
            }
            evpn {
                ip-prefix-routes {
                    advertise direct-nexthop;
                    encapsulation vxlan;
                    vni $VNI;
                    export $IP_PREFIX_EXPORT_POL;
                }
                oism {
                    supplemental-bridge-domain-irb $IRB_IFL_1;
                    pim-evpn-gateway;
                }
            }
            ospf {
                area 0.0.0.0 {
                    interface $LOOPBACK_IFL;
                    interface $IRB_IFL_1;
                    interface all {
                        passive;
                    }
                    interface $AC_IFL;
                }
            }
            pim {
                rp {
                    static {
                        address $AC_ADDR_V4;
                    }
                }
                interface $IRB_IFL_2 {
                    distributed-dr;
                }
                interface $IRB_IFL_3 {
                    distributed-dr;
                }
                interface $IRB_IFL_1;
                interface $LOOPBACK_IFL;
                interface $AC_IFL;
            }
        }
        forwarding-options {
            dhcp-relay {
                forward-only;
                server-group {
                    blue {
                        10.10.0.200;
                    }
                }
                group $DHCP_RELAY_GROUP {
                    active-server-group blue;
                    relay-option-82 {
                        server-id-override;
                    }
                    interface $IRB_IFL_2 {
                        overrides {
                            relay-source $LOOPBACK_IFL;
                        }
                    }
                }
            }
        }
        interface $AC_IFL;
        interface $IRB_IFL_2;
        interface $IRB_IFL_3;
        interface $IRB_IFL_4;
        interface $IRB_IFL_5;
        interface $IRB_IFL_6;
        interface $IRB_IFL_7;
        interface $IRB_IFL_8;
        interface $IRB_IFL_9;
        interface $IRB_IFL_10;
        interface $IRB_IFL_11;
        interface $IRB_IFL_12;
        interface $IRB_IFL_13;
        interface $IRB_IFL_14;
        interface $IRB_IFL_15;
        interface $IRB_IFL_16;
        interface $IRB_IFL_17;
        interface $IRB_IFL_18;
        interface $IRB_IFL_19;
        interface $IRB_IFL_20;
        interface $IRB_IFL_21;
        interface $IRB_IFL_1;
        interface $LOOPBACK_IFL;
        route-distinguisher $LOOPBACK_V4:3;
        vrf-target target:20002:1;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `irb-service`: required, all related; one of 11 providers listed in MANIFEST.json
- `logical-interface` (`$AC_IFL`, `$IRB_IFL_2`, `$IRB_IFL_3`, `$IRB_IFL_4`, `$IRB_IFL_5`, `$IRB_IFL_6`, `$IRB_IFL_7`, `$IRB_IFL_8`, `$IRB_IFL_9`, `$IRB_IFL_10`, `$IRB_IFL_11`, `$IRB_IFL_12`, `$IRB_IFL_13`, `$IRB_IFL_14`, `$IRB_IFL_15`, `$IRB_IFL_16`, `$IRB_IFL_17`, `$IRB_IFL_18`, `$IRB_IFL_19`, `$IRB_IFL_20`, `$IRB_IFL_21`, `$IRB_IFL_1`, `$LOOPBACK_IFL`): required, for each reference; one of `interfaces/ifl-loopback-inet-inet6`, `interfaces/ifl-vlan-inet-inet6-description`, `interfaces/irb-inet-inet6-mtu-9000-mac-no-dhcp-flood`, `interfaces/irb-inet-inet6-mtu-9000-mac`, `interfaces/irb-inet-virtual-gateway-mtu-9000`
- `policy-statement` (`$BGP_IMPORT_POL`, `$BGP_EXPORT_POL`, `$IP_PREFIX_EXPORT_POL`): required, for each reference; one of `policy-options/policy-statement/ps-from-policy-bgp-evpn-host-routes-community-add-reject`, `policy-options/policy-statement/ps-route-filter-list-inet-inet6-community-add-reject`, `policy-options/policy-statement/ps-route-filter-list-inet-inet6-community-delete-reject`

## evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp.conf

```
/*
 * Topic: Border EVPN Type 5 VRF with eBGP (IPv4 and IPv6) to the external router
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   total 2
 * Pair with: none
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $INSTANCE_NAME         e.g. purple
 *   $BGP_GROUP             e.g. l3rtr
 *   $CE_PEER_V6            e.g. 2001:db8:dc4:10:204::d
 *   $DESCRIPTION           e.g. facing_mx-external
 *   $PE_LOCAL_V6           e.g. 2001:db8:dc4:10:204::c
 *   $BGP_IMPORT_POL        e.g. RoutesFromExt-purple-external_router
 *   $BGP_EXPORT_POL        e.g. RoutesToExt-purple-external_router
 *   $ASN_CUSTOMER          e.g. 65000
 *   $CE_PEER_V4            e.g. 10.204.0.17
 *   $PE_LOCAL_V4           e.g. 10.204.0.16
 *   $VNI                   e.g. 20004
 *   $IP_PREFIX_EXPORT_POL  e.g. BGP-AOS-Policy-purple
 *   $AC_IFL                e.g. et-0/0/7.599
 *   $LOOPBACK_IFL          e.g. lo0.5
 *   $LOOPBACK_V4           e.g. 192.168.252.12
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
            bgp {
                group $BGP_GROUP {
                    type external;
                    multihop {
                        ttl 1;
                    }
                    family inet {
                        unicast {
                            loops 2;
                        }
                    }
                    family inet6 {
                        unicast {
                            loops 2;
                        }
                    }
                    multipath {
                        multiple-as;
                    }
                    neighbor $CE_PEER_V6 {
                        description $DESCRIPTION;
                        multihop {
                            ttl 2;
                        }
                        local-address $PE_LOCAL_V6;
                        import ( $BGP_IMPORT_POL );
                        family inet6 {
                            unicast;
                        }
                        export ( $BGP_EXPORT_POL );
                        peer-as $ASN_CUSTOMER;
                    }
                    neighbor $CE_PEER_V4 {
                        description $DESCRIPTION;
                        multihop {
                            ttl 2;
                        }
                        local-address $PE_LOCAL_V4;
                        import ( $BGP_IMPORT_POL );
                        family inet {
                            unicast;
                        }
                        export ( $BGP_EXPORT_POL );
                        peer-as $ASN_CUSTOMER;
                    }
                }
                graceful-restart {
                    dont-help-shared-fate-bfd-down;
                }
            }
            evpn {
                ip-prefix-routes {
                    advertise direct-nexthop;
                    encapsulation vxlan;
                    vni $VNI;
                    export $IP_PREFIX_EXPORT_POL;
                }
            }
        }
        interface $AC_IFL;
        interface $LOOPBACK_IFL;
        route-distinguisher $LOOPBACK_V4:5;
        vrf-target target:20004:1;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`, `$LOOPBACK_IFL`): required, for each reference; one of `interfaces/ifl-loopback-inet-inet6`, `interfaces/ifl-vlan-inet-inet6-description`
- `policy-statement` (`$BGP_IMPORT_POL`, `$BGP_EXPORT_POL`, `$IP_PREFIX_EXPORT_POL`): required, for each reference; one of `policy-options/policy-statement/ps-from-policy-bgp-evpn-host-routes-community-add-reject`, `policy-options/policy-statement/ps-route-filter-list-inet-inet6-community-add-reject`, `policy-options/policy-statement/ps-route-filter-list-inet-inet6-community-delete-reject`

## evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ospf-pim-oism-dhcp-relay.conf

```
/*
 * Topic: EVPN Type 5 VRF with OSPF and PIM on its IRB and loopback units, OISM with a supplemental bridge domain, and DHCP relay
 * Seen on:
 *   Junos: (none)
 *   EVO: storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 2
 * Pair with: none
 * Variables (example values from storage-leaf1_qfx5130-32cd):
 *   $INSTANCE_NAME         e.g. blue
 *   $VNI                   e.g. 20002
 *   $IP_PREFIX_EXPORT_POL  e.g. BGP-AOS-Policy-blue
 *   $IRB_IFL_1             e.g. irb.3500
 *   $LOOPBACK_IFL          e.g. lo0.3
 *   $DHCP_RELAY_GROUP      e.g. blue
 *   $IRB_IFL_2             e.g. irb.1400
 *   $IRB_IFL_3             e.g. irb.1401
 *   $IRB_IFL_4             e.g. irb.1402
 *   $IRB_IFL_5             e.g. irb.1403
 *   $IRB_IFL_6             e.g. irb.1404
 *   $IRB_IFL_7             e.g. irb.1405
 *   $IRB_IFL_8             e.g. irb.1406
 *   $IRB_IFL_9             e.g. irb.1407
 *   $IRB_IFL_10            e.g. irb.1408
 *   $IRB_IFL_11            e.g. irb.1409
 *   $IRB_IFL_12            e.g. irb.1420
 *   $IRB_IFL_13            e.g. irb.1421
 *   $IRB_IFL_14            e.g. irb.1422
 *   $IRB_IFL_15            e.g. irb.1423
 *   $IRB_IFL_16            e.g. irb.1424
 *   $IRB_IFL_17            e.g. irb.1425
 *   $IRB_IFL_18            e.g. irb.1426
 *   $IRB_IFL_19            e.g. irb.1427
 *   $IRB_IFL_20            e.g. irb.1428
 *   $IRB_IFL_21            e.g. irb.1429
 *   $LOOPBACK_V4           e.g. 192.168.252.10
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
                oism {
                    supplemental-bridge-domain-irb $IRB_IFL_1;
                }
            }
            ospf {
                area 0.0.0.0 {
                    interface $LOOPBACK_IFL;
                    interface $IRB_IFL_1;
                    interface all {
                        passive;
                    }
                }
            }
            pim {
                passive;
                interface all;
                interface $IRB_IFL_1 {
                    accept-remote-source;
                }
            }
        }
        forwarding-options {
            dhcp-relay {
                forward-only;
                server-group {
                    blue {
                        10.10.0.200;
                    }
                }
                group $DHCP_RELAY_GROUP {
                    active-server-group blue;
                    relay-option-82 {
                        server-id-override;
                    }
                    interface $IRB_IFL_2 {
                        overrides {
                            relay-source $LOOPBACK_IFL;
                        }
                    }
                }
            }
        }
        interface $IRB_IFL_2;
        interface $IRB_IFL_3;
        interface $IRB_IFL_4;
        interface $IRB_IFL_5;
        interface $IRB_IFL_6;
        interface $IRB_IFL_7;
        interface $IRB_IFL_8;
        interface $IRB_IFL_9;
        interface $IRB_IFL_10;
        interface $IRB_IFL_11;
        interface $IRB_IFL_12;
        interface $IRB_IFL_13;
        interface $IRB_IFL_14;
        interface $IRB_IFL_15;
        interface $IRB_IFL_16;
        interface $IRB_IFL_17;
        interface $IRB_IFL_18;
        interface $IRB_IFL_19;
        interface $IRB_IFL_20;
        interface $IRB_IFL_21;
        interface $IRB_IFL_1;
        interface $LOOPBACK_IFL;
        route-distinguisher $LOOPBACK_V4:3;
        vrf-target target:20002:1;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `irb-service`: required, all related; one of 11 providers listed in MANIFEST.json
- `logical-interface` (`$IRB_IFL_2`, `$IRB_IFL_3`, `$IRB_IFL_4`, `$IRB_IFL_5`, `$IRB_IFL_6`, `$IRB_IFL_7`, `$IRB_IFL_8`, `$IRB_IFL_9`, `$IRB_IFL_10`, `$IRB_IFL_11`, `$IRB_IFL_12`, `$IRB_IFL_13`, `$IRB_IFL_14`, `$IRB_IFL_15`, `$IRB_IFL_16`, `$IRB_IFL_17`, `$IRB_IFL_18`, `$IRB_IFL_19`, `$IRB_IFL_20`, `$IRB_IFL_21`, `$IRB_IFL_1`, `$LOOPBACK_IFL`): required, for each reference; one of `interfaces/ifl-loopback-inet-inet6`, `interfaces/irb-inet-inet6-mtu-9000-mac-no-dhcp-flood`, `interfaces/irb-inet-inet6-mtu-9000-mac`, `interfaces/irb-inet-virtual-gateway-mtu-9000`
- `policy-statement` (`$IP_PREFIX_EXPORT_POL`): required, for each reference; `policy-options/policy-statement/ps-from-policy-evpn-host-routes-community-add-reject`

## evo/routing-options/autonomous-system.conf

```
/*
 * Topic: Device autonomous-system number
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $ASN  e.g. 64708
 */
routing-options {
  autonomous-system $ASN;
}
```

## evo/routing-options/forwarding-table-pplb-ecmp-fast-reroute-chained-nh-evpn.conf

```
/*
 * Topic: Forwarding-table export of the per-packet load-balancing policy, with ECMP fast reroute and ingress chained composite next hops for EVPN
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
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
 *   EVO: storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from storage-spine1_qfx5220-32cd):
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
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
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
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $ROUTER_ID  e.g. 192.168.252.12
 */
routing-options {
    router-id $ROUTER_ID;
}
```

## evo/system/extensions-aos-show-scripts.conf

```
/*
 * Topic: Extension-service application scripts that Apstra uses (show tech and show version), run as root
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 8
 * Pair with: none
 * Variables: none
 */
system {
    extensions {
        extension-service {
            application {
                file aos_show_tech_evo.py {
                    username root;
                }
                file aos_show_version_evo.py {
                    username root;
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
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 8
 * Pair with: none
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $HOST_NAME  e.g. leaf003-001-1
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
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 8
 * Pair with: none
 * Variables: none
 */
system {
    management-instance;
}
```

## evo/system/packet-forwarding-options-host-profile.conf

```
/*
 * Topic: Packet-forwarding host profile for the forwarding table
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   total 4
 * Pair with: none
 * Variables: none
 */
system {
    packet-forwarding-options {
        forwarding-profile {
            host-profile;
        }
    }
}
```

## evo/system/ports-console-log-out.conf

```
/*
 * Topic: Console log-out on disconnect
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 8
 * Pair with: none
 * Variables: none
 */
system {
    ports {
        console log-out-on-disconnect;
    }
}
```

## evo/system/services-netconf-ssh-root-login.conf

```
/*
 * Topic: NETCONF over SSH, and SSH with root login allowed
 * Seen on:
 *   Junos: (none)
 *   EVO: services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd storage-spine1_qfx5220-32cd storage-spine2_qfx5220-32cd superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 * Count:
 *   services-leaf1_qfx5130-48c 1
 *   services-leaf2_qfx5130-48c 1
 *   storage-leaf1_qfx5130-32cd 1
 *   storage-leaf2_qfx5130-32cd 1
 *   storage-spine1_qfx5220-32cd 1
 *   storage-spine2_qfx5220-32cd 1
 *   superspine1_qfx5230-64cd 1
 *   superspine2_qfx5230-64cd 1
 *   total 8
 * Pair with: none
 * Variables: none
 */
system {
    services {
        netconf {
            ssh;
        }
        ssh {
            root-login allow;
        }
    }
}
```

## junos/chassis/aggregated-devices-ethernet.conf

```
/*
 * Topic: Aggregated Ethernet device-count for the chassis
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $AE_DEVICE_COUNT  e.g. 1
 */
chassis {
    aggregated-devices {
        ethernet {
            device-count $AE_DEVICE_COUNT;
        }
    }
}
```

## junos/chassis/fpc-pic-0-2-ports-100g.conf

```
/*
 * Topic: Two PIC 0 ports set to 100 Gbps
 * Seen on:
 *   Junos: compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf2_qfx5120-48ym 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf2_qfx5120-48ym):
 *   $FPC_SLOT  e.g. 0
 */
chassis {
    fpc $FPC_SLOT {
        pic 0 {
            port 48 {
                speed 100g;
            }
            port 49 {
                speed 100g;
            }
        }
    }
}
```

## junos/chassis/fpc-pic-0-3-ports-100g.conf

```
/*
 * Topic: Three PIC 0 ports set to 100 Gbps
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $FPC_SLOT  e.g. 0
 */
chassis {
    fpc $FPC_SLOT {
        pic 0 {
            port 48 {
                speed 100g;
            }
            port 49 {
                speed 100g;
            }
            port 50 {
                speed 100g;
            }
        }
    }
}
```

## junos/chassis/fpc-pic-0-4-ports-100g.conf

```
/*
 * Topic: Four PIC 0 ports set to 100 Gbps
 * Seen on:
 *   Junos: compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-spine1_qfx5210-64c):
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
        }
    }
}
```

## junos/chassis/fpc-pic-0-tunnel-services-4-breakout-10g.conf

```
/*
 * Topic: PIC 0 with tunnel services and four ports broken out into four 10-Gbps sub-ports
 * Seen on:
 *   Junos: external-gw_mx
 *   EVO: (none)
 * Count:
 *   external-gw_mx 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from external-gw_mx):
 *   $FPC_SLOT  e.g. 0
 */
chassis {
    fpc $FPC_SLOT {
        pic 0 {
            tunnel-services;
            port 1 {
                number-of-sub-ports 4;
                speed 10g;
            }
            port 3 {
                number-of-sub-ports 4;
                speed 10g;
            }
            port 5 {
                number-of-sub-ports 4;
                speed 10g;
            }
            port 7 {
                number-of-sub-ports 4;
                speed 10g;
            }
        }
    }
}
```

## junos/chassis/tunnel-services.conf

```
/*
 * Topic: Tunnel services on an FPC and PIC
 * Seen on:
 *   Junos: external-gw_mx
 *   EVO: (none)
 * Count:
 *   external-gw_mx 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from external-gw_mx):
 *   $TS_FPC  e.g. 0
 *   $TS_PIC  e.g. 0
 */
chassis {
    fpc $TS_FPC {
        pic $TS_PIC {
            tunnel-services;
        }
    }
}
```

## junos/class-of-service/classifiers/cl-dscp-classifier-leaf.conf

```
/*
 * Topic: DSCP classifier dscp-classifier for the leaf forwarding classes
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-9-classes.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    classifiers {
        dscp dscp-classifier {
            forwarding-class fc0 {
                loss-priority low code-points 001010;
            }
            forwarding-class fc1 {
                loss-priority low code-points [ 000000 000001 000010 000011 000100 000101 000110 000111 001001 001011 001100 001101 001110 001111 010001 010011 010100 010101 010110 010111 011001 011011 011100 011101 011111 100001 100010 100011 100101 100110 100111 101001 101010 101011 101100 101101 101111 110001 110010 110011 110100 110101 110110 110111 111001 111010 111011 111100 111101 111110 111111 010010 100100 011110 100000 010000 101000 011000 ];
            }
            forwarding-class fc5 {
                loss-priority low code-points [ 001000 011010 ];
            }
            forwarding-class fc6 {
                loss-priority low code-points [ 101110 111000 ];
            }
            forwarding-class fc7 {
                loss-priority low code-points 110000;
            }
        }
    }
}
```

## junos/class-of-service/classifiers/cl-dscp-classifier-spine.conf

```
/*
 * Topic: DSCP classifier dscp-classifier for the spine and superspine forwarding classes
 * Seen on:
 *   Junos: compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 4
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-9-classes.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    classifiers {
        dscp dscp-classifier {
            forwarding-class fc0 {
                loss-priority low code-points 001010;
            }
            forwarding-class fc1 {
                loss-priority low code-points [ 000000 000001 000010 000011 000100 000101 000110 000111 001001 001011 001100 001101 001110 001111 010001 010011 010100 010101 010110 010111 011001 011011 011100 011101 011111 100001 100010 100011 100101 100110 100111 101001 101010 101011 101100 101101 101111 110001 110010 110011 110100 110101 110110 110111 111001 111010 111011 111100 111101 111110 111111 010010 100100 011110 ];
            }
            forwarding-class fc2 {
                loss-priority low code-points 100000;
            }
            forwarding-class fc3 {
                loss-priority low code-points [ 010000 101000 ];
            }
            forwarding-class fc4 {
                loss-priority low code-points 011000;
            }
            forwarding-class fc5 {
                loss-priority low code-points [ 001000 011010 ];
            }
            forwarding-class fc6 {
                loss-priority low code-points [ 101110 111000 ];
            }
            forwarding-class fc7 {
                loss-priority low code-points 110000;
            }
        }
    }
}
```

## junos/class-of-service/congestion-notification-profile/cnp-ieee-802-1-flow-control-queue-5.conf

```
/*
 * Topic: Congestion notification profile cnp: IEEE 802.1p code point 011 flow control on queue 5
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    congestion-notification-profile {
        cnp {
            output {
                ieee-802.1 {
                    code-point 011 {
                        flow-control-queue 5;
                    }
                }
            }
        }
    }
}
```

## junos/class-of-service/dedicated-buffer-profile-p1-egress.conf

```
/*
 * Topic: Dedicated buffer profile p1 for egress
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    dedicated-buffer-profile p1 {
        egress;
    }
}
```

## junos/class-of-service/drop-profiles/dp0-dp1.conf

```
/*
 * Topic: Drop profiles dp0 (0-20 percent fill) and dp1 (1-2 percent fill)
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    drop-profiles {
        dp0 {
            interpolate {
                fill-level [ 0 20 ];
                drop-probability [ 0 100 ];
            }
        }
        dp1 {
            interpolate {
                fill-level [ 1 2 ];
                drop-probability [ 0 100 ];
            }
        }
    }
}
```

## junos/class-of-service/forwarding-classes/fc-9-classes.conf

```
/*
 * Topic: Forwarding classes fc0 to fc7 on queues 0 to 7, and mcast-fc on queue 8
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    forwarding-classes {
        class fc0 queue-num 0;
        class fc1 queue-num 1;
        class fc2 queue-num 2;
        class fc3 queue-num 3;
        class fc4 queue-num 4;
        class fc5 queue-num 5;
        class fc6 queue-num 6;
        class fc7 queue-num 7;
        class mcast-fc queue-num 8;
    }
}
```

## junos/class-of-service/interfaces/ifd-scheduler-map-dscp-classifier-rewrite.conf

```
/*
 * Topic: Interface with scheduler map sm1, the DSCP classifier and the DSCP rewrite rule
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 2
 *   compute-leaf2_qfx5120-48ym 2
 *   compute-spine1_qfx5210-64c 34
 *   compute-spine2_qfx5210-64c 34
 *   services-spine1_qfx5210-64c 66
 *   services-spine2_qfx5210-64c 66
 *   total 204
 * Pair with:
 *  - junos/class-of-service/scheduler-maps/sm1.conf
 *
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $COS_INTF  e.g. et-0/0/48
 */
class-of-service {
    interfaces {
        $COS_INTF {
            scheduler-map sm1;
            classifiers {
                dscp dscp-classifier;
            }
            rewrite-rules {
                dscp rw1;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `classifier` (`dscp-classifier`): required, for each reference; one of `class-of-service/classifiers/cl-dscp-classifier-leaf`, `class-of-service/classifiers/cl-dscp-classifier-spine`

## junos/class-of-service/interfaces/ifd-scheduler-map-unit-0-dscp-classifier-rewrite.conf

```
/*
 * Topic: Interface with scheduler map sm1, and the DSCP classifier and rewrite rule on unit 0
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   total 1
 * Pair with:
 *  - junos/class-of-service/classifiers/cl-dscp-classifier-leaf.conf
 *  - junos/class-of-service/scheduler-maps/sm1.conf
 *
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $COS_INTF  e.g. et-0/0/50
 */
class-of-service {
    interfaces {
        $COS_INTF {
            scheduler-map sm1;
            unit 0 {
                classifiers {
                    dscp dscp-classifier;
                }
                rewrite-rules {
                    dscp rw1;
                }
            }
        }
    }
}
```

## junos/class-of-service/rewrite-rules/rw-dscp-rw1-leaf.conf

```
/*
 * Topic: DSCP rewrite rule rw1 for the leaf forwarding classes
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-9-classes.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    rewrite-rules {
        dscp rw1 {
            forwarding-class fc0 {
                loss-priority low code-point af11;
            }
            forwarding-class fc1 {
                loss-priority low code-point be;
            }
            forwarding-class fc5 {
                loss-priority low code-point cs1;
            }
            forwarding-class fc6 {
                loss-priority low code-point ef;
            }
            forwarding-class fc7 {
                loss-priority low code-point cs6;
            }
        }
    }
}
```

## junos/class-of-service/rewrite-rules/rw-dscp-rw1-spine.conf

```
/*
 * Topic: DSCP rewrite rule rw1 for the spine and superspine forwarding classes
 * Seen on:
 *   Junos: compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 4
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-9-classes.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    rewrite-rules {
        dscp rw1 {
            forwarding-class fc0 {
                loss-priority low code-point af11;
            }
            forwarding-class fc1 {
                loss-priority low code-point be;
            }
            forwarding-class fc2 {
                loss-priority low code-point cs4;
            }
            forwarding-class fc3 {
                loss-priority low code-point cs2;
            }
            forwarding-class fc4 {
                loss-priority low code-point cs3;
            }
            forwarding-class fc5 {
                loss-priority low code-point cs1;
            }
            forwarding-class fc6 {
                loss-priority low code-point ef;
            }
            forwarding-class fc7 {
                loss-priority low code-point cs6;
            }
        }
    }
}
```

## junos/class-of-service/scheduler-maps/sm1.conf

```
/*
 * Topic: Scheduler map sm1 binding fc0 to fc7 to schedulers s0 to s7
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-9-classes.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    scheduler-maps {
        sm1 {
            forwarding-class fc0 scheduler s0;
            forwarding-class fc1 scheduler s1;
            forwarding-class fc2 scheduler s2;
            forwarding-class fc3 scheduler s3;
            forwarding-class fc4 scheduler s4;
            forwarding-class fc5 scheduler s5;
            forwarding-class fc6 scheduler s6;
            forwarding-class fc7 scheduler s7;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `scheduler` (`s0`, `s1`, `s2`, `s3`, `s4`, `s5`, `s6`, `s7`): required, for each reference; one of `class-of-service/schedulers/schedulers-s0-s7-leaf`, `class-of-service/schedulers/schedulers-s0-s7-spine`

## junos/class-of-service/schedulers/schedulers-s0-s7-leaf.conf

```
/*
 * Topic: Leaf schedulers s0 to s7: transmit rates, buffer sizes, drop profiles and ECN
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    schedulers {
        s0 {
            transmit-rate percent 49;
            buffer-size percent 20;
            priority low;
            drop-profile-map loss-priority any protocol any drop-profile dp0;
            explicit-congestion-notification;
            buffer-dynamic-threshold 9;
        }
        s1 {
            transmit-rate percent 2;
            buffer-size percent 20;
            priority low;
            buffer-dynamic-threshold 7;
        }
        s2 {
            buffer-size percent 0;
        }
        s3 {
            buffer-size percent 0;
        }
        s4 {
            buffer-size percent 0;
        }
        s5 {
            transmit-rate percent 49;
            buffer-size percent 20;
            priority low;
            drop-profile-map loss-priority any protocol any drop-profile dp1;
            explicit-congestion-notification;
            buffer-dynamic-threshold 9;
        }
        s6 {
            shaping-rate 16g;
            buffer-size percent 20;
            priority strict-high;
            buffer-dynamic-threshold 7;
        }
        s7 {
            shaping-rate 8g;
            buffer-size percent 20;
            priority strict-high;
            buffer-dynamic-threshold 7;
        }
    }
}
```

## junos/class-of-service/schedulers/schedulers-s0-s7-spine.conf

```
/*
 * Topic: Spine and superspine schedulers s0 to s7: transmit rates, drop profiles and ECN
 * Seen on:
 *   Junos: compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    schedulers {
        s0 {
            transmit-rate percent 50;
            priority low;
            drop-profile-map loss-priority any protocol any drop-profile dp0;
            explicit-congestion-notification;
            buffer-dynamic-threshold 9;
        }
        s1 {
            transmit-rate percent 2;
            priority low;
        }
        s2 {
            transmit-rate percent 12;
            priority low;
            drop-profile-map loss-priority any protocol any drop-profile dp1;
            explicit-congestion-notification;
            buffer-dynamic-threshold 9;
        }
        s3 {
            transmit-rate percent 12;
            priority low;
            drop-profile-map loss-priority any protocol any drop-profile dp1;
            explicit-congestion-notification;
            buffer-dynamic-threshold 9;
        }
        s4 {
            transmit-rate percent 12;
            priority low;
            drop-profile-map loss-priority any protocol any drop-profile dp1;
            explicit-congestion-notification;
            buffer-dynamic-threshold 9;
        }
        s5 {
            transmit-rate percent 12;
            priority low;
            drop-profile-map loss-priority any protocol any drop-profile dp1;
            explicit-congestion-notification;
            buffer-dynamic-threshold 9;
        }
        s6 {
            shaping-rate 16g;
            priority strict-high;
            buffer-dynamic-threshold 7;
        }
        s7 {
            shaping-rate 8g;
            priority strict-high;
            buffer-dynamic-threshold 7;
        }
    }
}
```

## junos/class-of-service/shared-buffer-lossy-multicast.conf

```
/*
 * Topic: Shared buffer: all ingress and egress buffer in the lossy partitions, with an egress multicast partition
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    shared-buffer {
        ingress {
            percent 100;
            buffer-partition lossless {
                percent 0;
            }
            buffer-partition lossless-headroom {
                percent 0;
            }
            buffer-partition lossy {
                percent 100;
            }
        }
        egress {
            percent 100;
            buffer-partition lossless {
                percent 0;
            }
            buffer-partition lossy {
                percent 90;
            }
            buffer-partition multicast {
                percent 10;
            }
        }
    }
}
```

## junos/firewall/filter-cpp-filter-v1.conf

```
/*
 * Topic: cpp-filter-v1: the loopback control-plane protection filter: SSH, BGP, NTP and SNMP from their source prefix lists; policed ICMP; DNS, DHCP, NETCONF, BFD and OSPF; everything else discarded
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
 * Pair with:
 *  - junos/firewall/policer-police-5mbps.conf
 *
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $TERM_NAME_1   e.g. ssh
 *   $TERM_NAME_2   e.g. icmp
 *   $TERM_NAME_3   e.g. bgp
 *   $TERM_NAME_4   e.g. dns
 *   $TERM_NAME_5   e.g. ntp
 *   $TERM_NAME_6   e.g. dhcp
 *   $TERM_NAME_7   e.g. netconf
 *   $TERM_NAME_8   e.g. bfd
 *   $TERM_NAME_9   e.g. snmp
 *   $TERM_NAME_10  e.g. ospf
 *   $TERM_NAME_11  e.g. discard-rest
 */
firewall {
    filter cpp-filter-v1 {
        term $TERM_NAME_1 {
            from {
                source-prefix-list {
                    ssh-sources;
                }
                protocol tcp;
                port ssh;
            }
            then {
                count cpp-ssh-accept;
                accept;
            }
        }
        term $TERM_NAME_2 {
            from {
                protocol icmp;
                icmp-type [ echo-request echo-reply unreachable time-exceeded ];
            }
            then {
                policer police-5mbps;
                count cpp-icmp-accept;
            }
        }
        term $TERM_NAME_3 {
            from {
                source-prefix-list {
                    bgp-sources;
                }
                protocol tcp;
                port bgp;
            }
            then accept;
        }
        term $TERM_NAME_4 {
            from {
                protocol udp;
                source-port 53;
            }
            then {
                count cpp-dns-accept;
                accept;
            }
        }
        term $TERM_NAME_5 {
            from {
                source-prefix-list {
                    ntp-sources;
                }
                protocol udp;
                port ntp;
            }
            then {
                count cpp-ntp-accept;
                accept;
            }
        }
        term $TERM_NAME_6 {
            from {
                protocol udp;
                port dhcp;
            }
            then {
                count cpp-dhcp-accept;
                accept;
            }
        }
        term $TERM_NAME_7 {
            from {
                source-prefix-list {
                    ssh-sources;
                }
                protocol tcp;
                port 830;
            }
            then {
                count cpp-netconf-accept;
                accept;
            }
        }
        term $TERM_NAME_8 {
            from {
                protocol udp;
                port [ 1280 3784 4784 3785 ];
            }
            then {
                count cpp-bfd-accept;
                accept;
            }
        }
        term $TERM_NAME_9 {
            from {
                source-prefix-list {
                    snmp-sources;
                }
                port snmp;
            }
            then accept;
        }
        term $TERM_NAME_10 {
            from {
                protocol ospf;
            }
            then accept;
        }
        term $TERM_NAME_11 {
            then {
                count cpp-discard-rest;
                discard;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policer` (`police-5mbps`): required, for each reference; `firewall/policer-police-5mbps`

## junos/firewall/filter-ethernet-switching-allowed-from-host.conf

```
/*
 * Topic: ALLOWED_FROM_HOST: Ethernet-switching filter that discards IPv4 and IPv6 multicast-MAC frames from hosts and accepts the rest
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $TERM_NAME_1  e.g. BLOCK_RFC1112
 *   $TERM_NAME_2  e.g. BLOCK_RFC2464
 *   $TERM_NAME_3  e.g. ALLOW_ALL
 */
firewall {
    family ethernet-switching {
        filter ALLOWED_FROM_HOST {
            term $TERM_NAME_1 {
                from {
                    destination-mac-address {
                        01:00:5e:00:00:00/25;
                    }
                }
                then discard;
            }
            term $TERM_NAME_2 {
                from {
                    destination-mac-address {
                        33:33:00:00:00:00/16;
                    }
                }
                then discard;
            }
            term $TERM_NAME_3 {
                then accept;
            }
        }
    }
}
```

## junos/firewall/policer-police-5mbps.conf

```
/*
 * Topic: police-5mbps: a 5-Mbps policer that discards excess traffic
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
firewall {
    policer police-5mbps {
        if-exceeding {
            bandwidth-limit 5m;
            burst-size-limit 5m;
        }
        then discard;
    }
}
```

## junos/forwarding-options/enhanced-hash-key-ecmp-dlb-flowlet.conf

```
/*
 * Topic: ECMP dynamic load balancing in flowlet mode, with inactivity interval and flowset table size
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    enhanced-hash-key {
        ecmp-dlb {
            flowlet {
                inactivity-interval 50;
                flowset-table-size 256;
            }
        }
    }
}
```

## junos/forwarding-options/evpn-vxlan-shared-tunnels.conf

```
/*
 * Topic: EVPN-VXLAN shared tunnels
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    evpn-vxlan {
        shared-tunnels;
    }
}
```

## junos/forwarding-options/multicast-replication-evpn-irb-enhanced-oism.conf

```
/*
 * Topic: EVPN multicast replication with enhanced OISM on IRB interfaces
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    multicast-replication {
        evpn {
            irb enhanced-oism;
        }
    }
}
```

## junos/forwarding-options/storm-control-profile1-all.conf

```
/*
 * Topic: Storm-control profile profile1 for all traffic at a fixed bandwidth level
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    storm-control-profiles profile1 {
        all {
            bandwidth-level 10000000;
        }
    }
}
```

## junos/forwarding-options/vxlan-routing-next-hop-interface-num-overlay-ecmp.conf

```
/*
 * Topic: VXLAN routing with next-hop and interface-number allocations and overlay ECMP
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    vxlan-routing {
        next-hop 45056;
        interface-num 8192;
        overlay-ecmp;
    }
}
```

## junos/forwarding-options/vxlan-routing-overlay-ecmp.conf

```
/*
 * Topic: VXLAN routing with overlay ECMP
 * Seen on:
 *   Junos: compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    vxlan-routing {
        overlay-ecmp;
    }
}
```

## junos/forwarding-options/vxlan-tos-copy-filter.conf

```
/*
 * Topic: Copy the inner ToS to the VXLAN header
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    vxlan-tos-copy-filter;
}
```

## junos/interfaces/ifd-ae-esi-all-active-lacp-system-id.conf

```
/*
 * Topic: Aggregated Ethernet interface for an ESI-LAG: all-active Ethernet segment, active LACP with a fixed system ID and a 9216-byte MTU
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $AE_BUNDLE    e.g. ae1
 *   $DESCRIPTION  e.g. to.sys001-001-003
 *   $ESI          e.g. 00:02:00:00:00:00:01:00:00:01
 *   $LACP_SYS_ID  e.g. 02:00:00:00:00:01
 */
interfaces {
    $AE_BUNDLE {
        description $DESCRIPTION;
        mtu 9216;
        esi {
            $ESI;
            all-active;
        }
        aggregated-ether-options {
            lacp {
                active;
                system-id $LACP_SYS_ID;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-description-ae-member`

## junos/interfaces/ifd-description-ae-member.conf

```
/*
 * Topic: Access port with a description, a member of an aggregated Ethernet bundle
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $AC_INTF      e.g. xe-0/0/1
 *   $DESCRIPTION  e.g. to.sys001-001-003
 *   $AE_BUNDLE    e.g. ae1
 */
interfaces {
    $AC_INTF {
        description $DESCRIPTION;
        ether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## junos/interfaces/ifd-description-mtu-9216.conf

```
/*
 * Topic: Physical interface with a description and a 9216-byte MTU
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 4
 *   compute-leaf2_qfx5120-48ym 3
 *   compute-spine1_qfx5210-64c 4
 *   compute-spine2_qfx5210-64c 4
 *   services-spine1_qfx5210-64c 4
 *   services-spine2_qfx5210-64c 4
 *   total 23
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $IFD          e.g. et-0/0/48
 *   $DESCRIPTION  e.g. facing_spine001-001-1:et-0/0/2
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        mtu 9216;
    }
}
```

## junos/interfaces/ifd-disable.conf

```
/*
 * Topic: Administratively disabled port
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 160
 *   compute-leaf2_qfx5120-48ym 160
 *   compute-spine1_qfx5210-64c 250
 *   compute-spine2_qfx5210-64c 250
 *   services-spine1_qfx5210-64c 514
 *   services-spine2_qfx5210-64c 514
 *   total 1848
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $IFD  e.g. et-0/0/0
 */
interfaces {
    $IFD {
        disable;
    }
}
```

## junos/interfaces/ifd-vlan-tagging.conf

```
/*
 * Topic: Port with VLAN tagging
 * Seen on:
 *   Junos: external-gw_mx
 *   EVO: (none)
 * Count:
 *   external-gw_mx 3
 *   total 3
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from external-gw_mx):
 *   $AC_INTF  e.g. xe-0/0/3:1
 */
interfaces {
    $AC_INTF {
        vlan-tagging;
    }
}
```

## junos/interfaces/ifl-core-inet-inet6-mtu-9170.conf

```
/*
 * Topic: Unit 0 with an IPv4 and an IPv6 address and a 9170-byte family MTU on a fabric link
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 2
 *   compute-leaf2_qfx5120-48ym 2
 *   compute-spine1_qfx5210-64c 4
 *   compute-spine2_qfx5210-64c 4
 *   services-spine1_qfx5210-64c 4
 *   services-spine2_qfx5210-64c 4
 *   total 20
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $CORE_PHYS     e.g. et-0/0/48
 *   $CORE_V4_ADDR  e.g. 10.0.1.25/31
 *   $CORE_V6_ADDR  e.g. fdf6:ed70:1fac:f2d4::19/127
 */
interfaces {
    $CORE_PHYS {
        unit 0 {
            family inet {
                mtu 9170;
                address $CORE_V4_ADDR;
            }
            family inet6 {
                mtu 9170;
                address $CORE_V6_ADDR;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-description-mtu-9216`

## junos/interfaces/ifl-ethernet-switching-trunk-vlans-filter-storm-control.conf

```
/*
 * Topic: Unit 0 as an Ethernet-switching trunk carrying the MAC-VRF VLANs, with the ALLOWED_FROM_HOST input filter and storm control
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   total 1
 * Pair with:
 *  - junos/firewall/filter-ethernet-switching-allowed-from-host.conf
 *
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $AC_INTF     e.g. et-0/0/50
 *   $BD_NAME_1   e.g. vn400
 *   $BD_NAME_2   e.g. vn401
 *   $BD_NAME_3   e.g. vn402
 *   $BD_NAME_4   e.g. vn403
 *   $BD_NAME_5   e.g. vn404
 *   $BD_NAME_6   e.g. vn405
 *   $BD_NAME_7   e.g. vn406
 *   $BD_NAME_8   e.g. vn407
 *   $BD_NAME_9   e.g. vn408
 *   $BD_NAME_10  e.g. vn409
 */
interfaces {
    $AC_INTF {
        unit 0 {
            family ethernet-switching {
                interface-mode trunk;
                vlan {
                    members [ $BD_NAME_1 $BD_NAME_2 $BD_NAME_3 $BD_NAME_4 $BD_NAME_5 $BD_NAME_6 $BD_NAME_7 $BD_NAME_8 $BD_NAME_9 $BD_NAME_10 ];
                }
                filter {
                    input ALLOWED_FROM_HOST;
                }
                storm-control profile1;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-description-mtu-9216`

## junos/interfaces/ifl-ethernet-switching-trunk-vlans.conf

```
/*
 * Topic: Unit 0 as an Ethernet-switching trunk carrying the MAC-VRF VLANs
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 2
 *   compute-leaf2_qfx5120-48ym 2
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $AC_INTF     e.g. ae1
 *   $BD_NAME_1   e.g. vn400
 *   $BD_NAME_2   e.g. vn401
 *   $BD_NAME_3   e.g. vn402
 *   $BD_NAME_4   e.g. vn403
 *   $BD_NAME_5   e.g. vn404
 *   $BD_NAME_6   e.g. vn405
 *   $BD_NAME_7   e.g. vn406
 *   $BD_NAME_8   e.g. vn407
 *   $BD_NAME_9   e.g. vn408
 *   $BD_NAME_10  e.g. vn409
 *   $BD_NAME_11  e.g. vn410
 *   $BD_NAME_12  e.g. vn411
 *   $BD_NAME_13  e.g. vn412
 *   $BD_NAME_14  e.g. vn413
 *   $BD_NAME_15  e.g. vn414
 *   $BD_NAME_16  e.g. vn415
 *   $BD_NAME_17  e.g. vn416
 *   $BD_NAME_18  e.g. vn417
 *   $BD_NAME_19  e.g. vn418
 *   $BD_NAME_20  e.g. vn419
 *   $BD_NAME_21  e.g. vn1400
 *   $BD_NAME_22  e.g. vn1401
 *   $BD_NAME_23  e.g. vn1402
 *   $BD_NAME_24  e.g. vn1403
 *   $BD_NAME_25  e.g. vn1404
 *   $BD_NAME_26  e.g. vn1405
 *   $BD_NAME_27  e.g. vn1406
 *   $BD_NAME_28  e.g. vn1407
 *   $BD_NAME_29  e.g. vn1408
 *   $BD_NAME_30  e.g. vn1409
 *   $BD_NAME_31  e.g. vn1410
 *   $BD_NAME_32  e.g. vn1411
 *   $BD_NAME_33  e.g. vn1412
 *   $BD_NAME_34  e.g. vn1413
 *   $BD_NAME_35  e.g. vn1414
 *   $BD_NAME_36  e.g. vn1415
 *   $BD_NAME_37  e.g. vn1416
 *   $BD_NAME_38  e.g. vn1417
 *   $BD_NAME_39  e.g. vn1418
 *   $BD_NAME_40  e.g. vn1419
 *   $BD_NAME_41  e.g. vn2500
 *   $BD_NAME_42  e.g. vn2501
 *   $BD_NAME_43  e.g. vn2502
 *   $BD_NAME_44  e.g. vn2503
 *   $BD_NAME_45  e.g. vn2504
 *   $BD_NAME_46  e.g. vn2505
 *   $BD_NAME_47  e.g. vn2506
 *   $BD_NAME_48  e.g. vn2507
 *   $BD_NAME_49  e.g. vn2508
 *   $BD_NAME_50  e.g. vn2509
 */
interfaces {
    $AC_INTF {
        unit 0 {
            family ethernet-switching {
                interface-mode trunk;
                vlan {
                    members [ $BD_NAME_1 $BD_NAME_2 $BD_NAME_3 $BD_NAME_4 $BD_NAME_5 $BD_NAME_6 $BD_NAME_7 $BD_NAME_8 $BD_NAME_9 $BD_NAME_10 $BD_NAME_11 $BD_NAME_12 $BD_NAME_13 $BD_NAME_14 $BD_NAME_15 $BD_NAME_16 $BD_NAME_17 $BD_NAME_18 $BD_NAME_19 $BD_NAME_20 $BD_NAME_21 $BD_NAME_22 $BD_NAME_23 $BD_NAME_24 $BD_NAME_25 $BD_NAME_26 $BD_NAME_27 $BD_NAME_28 $BD_NAME_29 $BD_NAME_30 $BD_NAME_31 $BD_NAME_32 $BD_NAME_33 $BD_NAME_34 $BD_NAME_35 $BD_NAME_36 $BD_NAME_37 $BD_NAME_38 $BD_NAME_39 $BD_NAME_40 $BD_NAME_41 $BD_NAME_42 $BD_NAME_43 $BD_NAME_44 $BD_NAME_45 $BD_NAME_46 $BD_NAME_47 $BD_NAME_48 $BD_NAME_49 $BD_NAME_50 ];
                }
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-ae-esi-all-active-lacp-system-id`, `interfaces/ifd-description-mtu-9216`
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-description-ae-member`

## junos/interfaces/ifl-loopback-0-inet-filter-inet6.conf

```
/*
 * Topic: Loopback unit 0 with IPv4 and IPv6 addresses and the cpp-filter-v1 input filter
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
 * Pair with:
 *  - junos/firewall/filter-cpp-filter-v1.conf
 *
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $LOOPBACK_V4_PFX  e.g. 192.168.252.8/32
 *   $LOOPBACK_V6_PFX  e.g. fdf6:ed70:1fac:f2d1::1008/128
 */
interfaces {
    lo0 {
        unit 0 {
            family inet {
                filter {
                    input cpp-filter-v1;
                }
                address $LOOPBACK_V4_PFX;
            }
            family inet6 {
                address $LOOPBACK_V6_PFX;
            }
        }
    }
}
```

## junos/interfaces/ifl-loopback-inet-inet6.conf

```
/*
 * Topic: Loopback unit with one IPv4 and one IPv6 address
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym external-gw_mx
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 3
 *   compute-leaf2_qfx5120-48ym 3
 *   external-gw_mx 1
 *   total 7
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $UNIT             e.g. 4
 *   $LOOPBACK_V4_PFX  e.g. 192.168.14.10/32
 *   $LOOPBACK_V6_PFX  e.g. fdf6:ed70:1fac:f2d4::200e/128
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

## junos/interfaces/ifl-unit-0-inet-no-address.conf

```
/*
 * Topic: Unit 0 with family inet and no address
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 51
 *   compute-leaf2_qfx5120-48ym 52
 *   compute-spine1_qfx5210-64c 30
 *   compute-spine2_qfx5210-64c 30
 *   services-spine1_qfx5210-64c 62
 *   services-spine2_qfx5210-64c 62
 *   total 287
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $IFD  e.g. et-0/0/51
 */
interfaces {
    $IFD {
        unit 0 {
            family inet;
        }
    }
}
```

## junos/interfaces/ifl-vlan-inet-inet6.conf

```
/*
 * Topic: VLAN logical interface with IPv4 and IPv6 addresses
 * Seen on:
 *   Junos: external-gw_mx
 *   EVO: (none)
 * Count:
 *   external-gw_mx 11
 *   total 11
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from external-gw_mx):
 *   $IFD         e.g. xe-0/0/7:0
 *   $UNIT        e.g. 399
 *   $VLAN        e.g. 399
 *   $AC_ADDR_V4  e.g. 10.204.0.1/31
 *   $AC_ADDR_V6  e.g. 2001:db8:dc4:10:204::5/127
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
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-vlan-tagging`

## junos/interfaces/ifl-vlan-inet-no-address.conf

```
/*
 * Topic: VLAN-tagged unit 0 with family inet and no address
 * Seen on:
 *   Junos: external-gw_mx
 *   EVO: (none)
 * Count:
 *   external-gw_mx 2
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from external-gw_mx):
 *   $AC_INTF  e.g. xe-0/0/7:0
 *   $VLAN     e.g. 0
 */
interfaces {
    $AC_INTF {
        unit 0 {
            vlan-id $VLAN;
            family inet;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-vlan-tagging`

## junos/interfaces/irb-inet-inet6-mtu-9000-mac-no-dhcp-flood.conf

```
/*
 * Topic: IRB unit with IPv4 and IPv6 gateway addresses, a 9000-byte family MTU, a MAC address and no DHCP flooding
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 3
 *   compute-leaf2_qfx5120-48ym 3
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $IRB_UNIT     e.g. 400
 *   $IRB_ADDR     e.g. 10.0.0.1/24
 *   $IRB_ADDR_V6  e.g. 2001:db8:dc4:10:00:00::1/96
 *   $IRB_MAC      e.g. 00:1c:73:00:00:01
 */
interfaces {
    irb {
        unit $IRB_UNIT {
            family inet {
                mtu 9000;
                address $IRB_ADDR;
            }
            family inet6 {
                mtu 9000;
                address $IRB_ADDR_V6;
            }
            mac $IRB_MAC;
            no-dhcp-flood;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/irb-mtu-9216`

## junos/interfaces/irb-inet-inet6-mtu-9000-mac.conf

```
/*
 * Topic: IRB unit with IPv4 and IPv6 gateway addresses, a 9000-byte family MTU and a MAC address
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 47
 *   compute-leaf2_qfx5120-48ym 47
 *   total 94
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $IRB_UNIT     e.g. 401
 *   $IRB_ADDR     e.g. 10.0.1.1/24
 *   $IRB_ADDR_V6  e.g. 2001:db8:dc4:10:00:01::1/96
 *   $IRB_MAC      e.g. 00:1c:73:00:00:01
 */
interfaces {
    irb {
        unit $IRB_UNIT {
            family inet {
                mtu 9000;
                address $IRB_ADDR;
            }
            family inet6 {
                mtu 9000;
                address $IRB_ADDR_V6;
            }
            mac $IRB_MAC;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/irb-mtu-9216`

## junos/interfaces/irb-inet-virtual-gateway-mtu-9000.conf

```
/*
 * Topic: IRB unit with an IPv4 address, a virtual gateway address and MAC, and virtual-gateway-accept-data
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $IRB_UNIT  e.g. 3500
 *   $IRB_ADDR  e.g. 10.200.0.2/24
 *   $VGA       e.g. 10.200.0.1
 */
interfaces {
    irb {
        unit $IRB_UNIT {
            virtual-gateway-accept-data;
            family inet {
                mtu 9000;
                address $IRB_ADDR {
                    virtual-gateway-address $VGA;
                }
            }
            virtual-gateway-v4-mac 00:1c:73:00:00:01;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/irb-mtu-9216`

## junos/interfaces/irb-mtu-9216.conf

```
/*
 * Topic: IRB interface with a 9216-byte MTU
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
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

## junos/policy-options/community/community-2-members.conf

```
/*
 * Topic: Community with two standard members
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 8
 *   compute-leaf2_qfx5120-48ym 8
 *   compute-spine1_qfx5210-64c 2
 *   compute-spine2_qfx5210-64c 2
 *   services-spine1_qfx5210-64c 2
 *   services-spine2_qfx5210-64c 2
 *   total 24
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $COMMUNITY_NAME        e.g. DEFAULT_DIRECT_V4
 *   $COMMUNITY_ADMIN_1     e.g. 9
 *   $COMMUNITY_ASSIGNED_1  e.g. 20007
 *   $COMMUNITY_ADMIN_2     e.g. 21001
 */
policy-options {
    community $COMMUNITY_NAME members [ $COMMUNITY_ADMIN_1:$COMMUNITY_ASSIGNED_1 $COMMUNITY_ADMIN_2:26000 ];
}
```

## junos/policy-options/community/from-spine-evpn-tier.conf

```
/*
 * Topic: FROM_SPINE_EVPN_TIER: the community that marks routes advertised by the spine EVPN tier
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    community FROM_SPINE_EVPN_TIER members 0:14;
}
```

## junos/policy-options/community/from-spine-fabric-tier.conf

```
/*
 * Topic: FROM_SPINE_FABRIC_TIER: the community that marks routes advertised by the spine tier
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    community FROM_SPINE_FABRIC_TIER members 0:15;
}
```

## junos/policy-options/community/from-superspine-evpn-tier.conf

```
/*
 * Topic: FROM_SUPERSPINE_EVPN_TIER: the community that marks routes advertised by the superspine EVPN tier
 * Seen on:
 *   Junos: compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    community FROM_SUPERSPINE_EVPN_TIER members 0:12;
}
```

## junos/policy-options/community/from-superspine-fabric-tier.conf

```
/*
 * Topic: FROM_SUPERSPINE_FABRIC_TIER: the community that marks routes advertised by the superspine tier
 * Seen on:
 *   Junos: compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    community FROM_SUPERSPINE_FABRIC_TIER members 0:13;
}
```

## junos/policy-options/policy-statement/per-packet-load-balance-no-term.conf

```
/*
 * Topic: Per-packet load-balancing policy without terms
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
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

## junos/policy-options/policy-statement/ps-accept-all.conf

```
/*
 * Topic: Export policy with one term that accepts every route
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
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

## junos/policy-options/policy-statement/ps-add-from-spine-evpn-tier-accept.conf

```
/*
 * Topic: Spine EVPN export policy that tags every route FROM_SPINE_EVPN_TIER and accepts it
 * Seen on:
 *   Junos: compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 4
 * Pair with:
 *  - junos/policy-options/community/from-spine-evpn-tier.conf
 *
 * Peers with: n/a
 * Variables (example values from compute-spine1_qfx5210-64c):
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

## junos/policy-options/policy-statement/ps-add-from-spine-tier-accept.conf

```
/*
 * Topic: Spine export policy that tags every route FROM_SPINE_FABRIC_TIER and accepts it
 * Seen on:
 *   Junos: compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 4
 * Pair with:
 *  - junos/policy-options/community/from-spine-fabric-tier.conf
 *
 * Peers with: n/a
 * Variables (example values from compute-spine1_qfx5210-64c):
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

## junos/policy-options/policy-statement/ps-bgp-next-hop-self-accept-reject.conf

```
/*
 * Topic: Policy that accepts BGP routes with next-hop self and rejects everything else
 * Seen on:
 *   Junos: external-gw_mx
 *   EVO: (none)
 * Count:
 *   external-gw_mx 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from external-gw_mx):
 *   $POLICY_NAME  e.g. AllRoutes
 *   $TERM_NAME_1  e.g. 1
 *   $TERM_NAME_2  e.g. 2
 */
policy-options {
    policy-statement $POLICY_NAME {
        term $TERM_NAME_1 {
            from protocol bgp;
            then {
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_2 {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-direct-inet-inet6-community-add-reject.conf

```
/*
 * Topic: Policy that accepts direct IPv4 and IPv6 routes, each with a community added, and rejects everything else
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 4
 *   compute-leaf2_qfx5120-48ym 4
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 12
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $POLICY_NAME       e.g. AllPodNetworks-blue
 *   $TERM_NAME_1       e.g. AllPodNetworks-blue-10
 *   $COMMUNITY_NAME_1  e.g. BLUE_COMMUNITY_V4
 *   $TERM_NAME_2       e.g. AllPodNetworks-blue-20
 *   $COMMUNITY_NAME_2  e.g. BLUE_COMMUNITY_V6
 *   $TERM_NAME_3       e.g. AllPodNetworks-blue-100
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

## junos/policy-options/policy-statement/ps-from-policy-bgp-accept-reject.conf

```
/*
 * Topic: Policy that accepts the routes another policy accepts and BGP routes, and rejects everything else
 * Seen on:
 *   Junos: compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-spine1_qfx5210-64c):
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

## junos/policy-options/policy-statement/ps-from-policy-evpn-host-routes-accept-reject.conf

```
/*
 * Topic: Export policy that accepts the routes another policy accepts and EVPN IPv4 /32 and IPv6 /128 host routes, and rejects everything else
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
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

## junos/policy-options/policy-statement/ps-from-policy-evpn-host-routes-community-add-reject.conf

```
/*
 * Topic: EVPN Type 5 export policy that accepts the routes another policy accepts, adds a community to EVPN IPv4 /32 and IPv6 /128 host routes, and rejects everything else
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 3
 *   compute-leaf2_qfx5120-48ym 3
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $IP_PREFIX_EXPORT_POL  e.g. BGP-AOS-Policy-blue
 *   $TERM_NAME_1           e.g. BGP-AOS-Policy-blue-10
 *   $POLICY_NAME           e.g. AllPodNetworks-blue
 *   $TERM_NAME_2           e.g. BGP-AOS-Policy-blue-50
 *   $COMMUNITY_NAME_1      e.g. BLUE_COMMUNITY_V4
 *   $TERM_NAME_3           e.g. BGP-AOS-Policy-blue-60
 *   $COMMUNITY_NAME_2      e.g. BLUE_COMMUNITY_V6
 *   $TERM_NAME_4           e.g. BGP-AOS-Policy-blue-100
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

## junos/policy-options/policy-statement/ps-loopback-default-routes-accept.conf

```
/*
 * Topic: Export policy that accepts the loopback and the IPv4 and IPv6 default routes (static or BGP)
 * Seen on:
 *   Junos: external-gw_mx
 *   EVO: (none)
 * Count:
 *   external-gw_mx 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from external-gw_mx):
 *   $BGP_EXPORT_POL  e.g. RoutesToFabric
 *   $TERM_NAME_1     e.g. 1
 *   $TERM_NAME_2     e.g. 2
 *   $TERM_NAME_3     e.g. 3
 *   $TERM_NAME_4     e.g. 4
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from interface lo0.0;
            then accept;
        }
        term $TERM_NAME_2 {
            from {
                protocol [ static bgp ];
                route-filter 0.0.0.0/0 exact;
            }
            then accept;
        }
        term $TERM_NAME_3 {
            from {
                protocol [ static bgp ];
                rib inet6.0;
                route-filter ::/0 exact;
            }
            then accept;
        }
        term $TERM_NAME_4 {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-reject-bgp-from-spine-evpn-tier-accept.conf

```
/*
 * Topic: Leaf EVPN export policy that rejects BGP routes tagged FROM_SPINE_EVPN_TIER and accepts every other route
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with:
 *  - junos/policy-options/community/from-spine-evpn-tier.conf
 *
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
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

## junos/policy-options/policy-statement/ps-reject-bgp-from-spine-tier-accept.conf

```
/*
 * Topic: Leaf export policy that rejects BGP routes tagged FROM_SPINE_FABRIC_TIER and accepts every other route
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with:
 *  - junos/policy-options/community/from-spine-fabric-tier.conf
 *
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
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

## junos/policy-options/policy-statement/ps-reject-bgp-from-superspine-evpn-tier-accept.conf

```
/*
 * Topic: Spine EVPN export policy toward the superspines that rejects BGP routes tagged FROM_SUPERSPINE_EVPN_TIER and accepts every other route
 * Seen on:
 *   Junos: compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 4
 * Pair with:
 *  - junos/policy-options/community/from-superspine-evpn-tier.conf
 *
 * Peers with: n/a
 * Variables (example values from compute-spine1_qfx5210-64c):
 *   $BGP_EXPORT_POL  e.g. SPINE_TO_SUPERSPINE_EVPN_OUT
 *   $TERM_NAME_1     e.g. SPINE_TO_SUPERSPINE_EVPN_OUT-10
 *   $TERM_NAME_2     e.g. SPINE_TO_SUPERSPINE_EVPN_OUT-20
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                protocol bgp;
                community FROM_SUPERSPINE_EVPN_TIER;
            }
            then reject;
        }
        term $TERM_NAME_2 {
            then accept;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-reject-bgp-from-superspine-tier-accept.conf

```
/*
 * Topic: Spine export policy toward the superspines that rejects BGP routes tagged FROM_SUPERSPINE_FABRIC_TIER and accepts every other route
 * Seen on:
 *   Junos: compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 4
 * Pair with:
 *  - junos/policy-options/community/from-superspine-fabric-tier.conf
 *
 * Peers with: n/a
 * Variables (example values from compute-spine1_qfx5210-64c):
 *   $BGP_EXPORT_POL  e.g. SPINE_TO_SUPERSPINE_FABRIC_OUT
 *   $TERM_NAME_1     e.g. SPINE_TO_SUPERSPINE_FABRIC_OUT-10
 *   $TERM_NAME_2     e.g. SPINE_TO_SUPERSPINE_FABRIC_OUT-20
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                protocol bgp;
                community FROM_SUPERSPINE_FABRIC_TIER;
            }
            then reject;
        }
        term $TERM_NAME_2 {
            then accept;
        }
    }
}
```

## junos/policy-options/prefix-list/bgp-sources.conf

```
/*
 * Topic: bgp-sources: prefixes allowed to reach BGP on the loopback
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    prefix-list bgp-sources {
        10.0.0.0/8;
        192.0.0.0/8;
        2001::/24;
        fdf6::/24;
    }
}
```

## junos/policy-options/prefix-list/ntp-sources.conf

```
/*
 * Topic: ntp-sources: prefixes allowed to reach NTP on the loopback
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    prefix-list ntp-sources {
        10.0.0.0/8;
        172.0.0.0/8;
        192.0.0.0/8;
    }
}
```

## junos/policy-options/prefix-list/snmp-sources.conf

```
/*
 * Topic: snmp-sources: prefixes allowed to reach SNMP on the loopback
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    prefix-list snmp-sources {
        10.0.0.0/8;
        172.0.0.0/8;
        192.0.0.0/8;
    }
}
```

## junos/policy-options/prefix-list/ssh-sources.conf

```
/*
 * Topic: ssh-sources: prefixes allowed to reach SSH on the loopback
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    prefix-list ssh-sources {
        10.0.0.0/8;
        172.0.0.0/8;
        192.0.0.0/8;
    }
}
```

## junos/policy-options/route-filter-list/rfl-inet-inet6-default-exact.conf

```
/*
 * Topic: Route-filter list with the IPv4 and IPv6 default routes, exact
 * Seen on:
 *   Junos: external-gw_mx
 *   EVO: (none)
 * Count:
 *   external-gw_mx 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from external-gw_mx):
 *   $ROUTE_FILTER_LIST  e.g. RoutesToFabric
 */
policy-options {
    route-filter-list $ROUTE_FILTER_LIST {
        0.0.0.0/0 exact;
        ::/0 exact;
    }
}
```

## junos/protocols/bgp-group-ebgp-10-peers-dual-stack-export.conf

```
/*
 * Topic: External gateway eBGP group with ten fabric peers over IPv4 and IPv6, exporting one policy
 * Seen on:
 *   Junos: external-gw_mx
 *   EVO: (none)
 * Count:
 *   external-gw_mx 1
 *   total 1
 * Pair with: none
 * Variables (example values from external-gw_mx):
 *   $BGP_GROUP       e.g. fabric
 *   $PE_PEER_V4_1    e.g. 10.204.0.4
 *   $BGP_EXPORT_POL  e.g. RoutesToFabric
 *   $ASN_PROVIDER_1  e.g. 64708
 *   $PE_PEER_V6_1    e.g. 2001:db8:dc4:10:204::8
 *   $PE_PEER_V4_2    e.g. 10.204.0.8
 *   $PE_PEER_V6_2    e.g. 2001:db8:dc4:10:204::0
 *   $PE_PEER_V4_3    e.g. 10.204.0.0
 *   $PE_PEER_V6_3    e.g. 2001:db8:dc4:10:204::4
 *   $PE_PEER_V4_4    e.g. 10.204.0.12
 *   $PE_PEER_V6_4    e.g. 2001:db8:dc4:10:204::10
 *   $PE_PEER_V4_5    e.g. 10.204.0.16
 *   $PE_PEER_V6_5    e.g. 2001:db8:dc4:10:204::c
 *   $PE_PEER_V4_6    e.g. 10.204.0.6
 *   $ASN_PROVIDER_2  e.g. 64709
 *   $PE_PEER_V6_6    e.g. 2001:db8:dc4:10:204::a
 *   $PE_PEER_V4_7    e.g. 10.204.0.10
 *   $PE_PEER_V6_7    e.g. 2001:db8:dc4:10:204::2
 *   $PE_PEER_V4_8    e.g. 10.204.0.2
 *   $PE_PEER_V6_8    e.g. 2001:db8:dc4:10:204::6
 *   $PE_PEER_V4_9    e.g. 10.204.0.14
 *   $PE_PEER_V6_9    e.g. 2001:db8:dc4:10:204::12
 *   $PE_PEER_V4_10   e.g. 10.204.0.18
 *   $PE_PEER_V6_10   e.g. 2001:db8:dc4:10:204::e
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type external;
            multihop {
                ttl 1;
            }
            multipath {
                multiple-as;
            }
            neighbor $PE_PEER_V4_1 {
                export $BGP_EXPORT_POL;
                peer-as $ASN_PROVIDER_1;
            }
            neighbor $PE_PEER_V6_1 {
                export $BGP_EXPORT_POL;
                peer-as $ASN_PROVIDER_1;
            }
            neighbor $PE_PEER_V4_2 {
                export $BGP_EXPORT_POL;
                peer-as $ASN_PROVIDER_1;
            }
            neighbor $PE_PEER_V6_2 {
                export $BGP_EXPORT_POL;
                peer-as $ASN_PROVIDER_1;
            }
            neighbor $PE_PEER_V4_3 {
                export $BGP_EXPORT_POL;
                peer-as $ASN_PROVIDER_1;
            }
            neighbor $PE_PEER_V6_3 {
                export $BGP_EXPORT_POL;
                peer-as $ASN_PROVIDER_1;
            }
            neighbor $PE_PEER_V4_4 {
                export $BGP_EXPORT_POL;
                peer-as $ASN_PROVIDER_1;
            }
            neighbor $PE_PEER_V6_4 {
                export $BGP_EXPORT_POL;
                peer-as $ASN_PROVIDER_1;
            }
            neighbor $PE_PEER_V4_5 {
                export $BGP_EXPORT_POL;
                peer-as $ASN_PROVIDER_1;
            }
            neighbor $PE_PEER_V6_5 {
                export $BGP_EXPORT_POL;
                peer-as $ASN_PROVIDER_1;
            }
            neighbor $PE_PEER_V4_6 {
                export $BGP_EXPORT_POL;
                peer-as $ASN_PROVIDER_2;
            }
            neighbor $PE_PEER_V6_6 {
                export $BGP_EXPORT_POL;
                peer-as $ASN_PROVIDER_2;
            }
            neighbor $PE_PEER_V4_7 {
                export $BGP_EXPORT_POL;
                peer-as $ASN_PROVIDER_2;
            }
            neighbor $PE_PEER_V6_7 {
                export $BGP_EXPORT_POL;
                peer-as $ASN_PROVIDER_2;
            }
            neighbor $PE_PEER_V4_8 {
                export $BGP_EXPORT_POL;
                peer-as $ASN_PROVIDER_2;
            }
            neighbor $PE_PEER_V6_8 {
                export $BGP_EXPORT_POL;
                peer-as $ASN_PROVIDER_2;
            }
            neighbor $PE_PEER_V4_9 {
                export $BGP_EXPORT_POL;
                peer-as $ASN_PROVIDER_2;
            }
            neighbor $PE_PEER_V6_9 {
                export $BGP_EXPORT_POL;
                peer-as $ASN_PROVIDER_2;
            }
            neighbor $PE_PEER_V4_10 {
                export $BGP_EXPORT_POL;
                peer-as $ASN_PROVIDER_2;
            }
            neighbor $PE_PEER_V6_10 {
                export $BGP_EXPORT_POL;
                peer-as $ASN_PROVIDER_2;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$BGP_EXPORT_POL`): required, for each reference; `policy-options/policy-statement/ps-loopback-default-routes-accept`

## junos/protocols/bgp-group-ebgp-evpn-overlay-2-peers-bfd-export-2-policies.conf

```
/*
 * Topic: Leaf eBGP EVPN overlay group with two spine loopback peers, BFD and a two-policy export chain
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Peers with:
 *   [compute-leaf1_qfx5120-48ym] <-> [compute-spine1_qfx5210-64c]
 *   [compute-leaf1_qfx5120-48ym] <-> [compute-spine2_qfx5210-64c]
 *   [compute-leaf2_qfx5120-48ym] <-> [compute-spine1_qfx5210-64c]
 *   [compute-leaf2_qfx5120-48ym] <-> [compute-spine2_qfx5210-64c]
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $BGP_GROUP          e.g. l3clos-l-evpn
 *   $OVERLAY_PEER_V4_1  e.g. 192.168.252.2
 *   $DESCRIPTION_1      e.g. facing_spine001-001-1-evpn-overlay
 *   $LOOPBACK_V4        e.g. 192.168.252.8
 *   $BGP_EXPORT_POL_1   e.g. LEAF_TO_SPINE_EVPN_OUT
 *   $BGP_EXPORT_POL_2   e.g. EVPN_EXPORT
 *   $ASN_FABRIC_PEER    e.g. 64701
 *   $OVERLAY_PEER_V4_2  e.g. 192.168.252.3
 *   $DESCRIPTION_2      e.g. facing_spine001-001-2-evpn-overlay
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
                peer-as $ASN_FABRIC_PEER;
            }
            neighbor $OVERLAY_PEER_V4_2 {
                description $DESCRIPTION_2;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER;
            }
            vpn-apply-export;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$BGP_EXPORT_POL_1`, `$BGP_EXPORT_POL_2`): required, for each reference; one of `policy-options/policy-statement/ps-accept-all`, `policy-options/policy-statement/ps-reject-bgp-from-spine-evpn-tier-accept`

## junos/protocols/bgp-group-ebgp-evpn-overlay-4-peers-bfd-export-1-policy.conf

```
/*
 * Topic: Spine eBGP EVPN overlay group with four loopback peers (two leaves and two superspines), BFD and one export policy per peer
 * Seen on:
 *   Junos: compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 4
 * Pair with: none
 * Peers with:
 *   [compute-leaf1_qfx5120-48ym] <-> [compute-spine1_qfx5210-64c]
 *   [compute-leaf1_qfx5120-48ym] <-> [compute-spine2_qfx5210-64c]
 *   [compute-leaf2_qfx5120-48ym] <-> [compute-spine1_qfx5210-64c]
 *   [compute-leaf2_qfx5120-48ym] <-> [compute-spine2_qfx5210-64c]
 *   [compute-spine1_qfx5210-64c] <-> [superspine1_qfx5230-64cd]
 *   [compute-spine1_qfx5210-64c] <-> [superspine2_qfx5230-64cd]
 *   [compute-spine2_qfx5210-64c] <-> [superspine1_qfx5230-64cd]
 *   [compute-spine2_qfx5210-64c] <-> [superspine2_qfx5230-64cd]
 *   [services-leaf1_qfx5130-48c] <-> [services-spine1_qfx5210-64c]
 *   [services-leaf1_qfx5130-48c] <-> [services-spine2_qfx5210-64c]
 *   [services-leaf2_qfx5130-48c] <-> [services-spine1_qfx5210-64c]
 *   [services-leaf2_qfx5130-48c] <-> [services-spine2_qfx5210-64c]
 *   [services-spine1_qfx5210-64c] <-> [superspine1_qfx5230-64cd]
 *   [services-spine1_qfx5210-64c] <-> [superspine2_qfx5230-64cd]
 *   [services-spine2_qfx5210-64c] <-> [superspine1_qfx5230-64cd]
 *   [services-spine2_qfx5210-64c] <-> [superspine2_qfx5230-64cd]
 * Variables (example values from compute-spine1_qfx5210-64c):
 *   $BGP_GROUP          e.g. l3clos-s-evpn
 *   $OVERLAY_PEER_V4_1  e.g. 192.168.252.8
 *   $DESCRIPTION_1      e.g. facing_leaf001-001-1-evpn-overlay
 *   $LOOPBACK_V4        e.g. 192.168.252.2
 *   $BGP_EXPORT_POL_1   e.g. SPINE_TO_LEAF_EVPN_OUT
 *   $ASN_FABRIC_PEER_1  e.g. 64704
 *   $OVERLAY_PEER_V4_2  e.g. 192.168.252.9
 *   $DESCRIPTION_2      e.g. facing_leaf001-001-2-evpn-overlay
 *   $ASN_FABRIC_PEER_2  e.g. 64705
 *   $OVERLAY_PEER_V4_3  e.g. 192.168.252.0
 *   $DESCRIPTION_3      e.g. facing_sspine001-1-evpn-overlay
 *   $BGP_EXPORT_POL_2   e.g. SPINE_TO_SUPERSPINE_EVPN_OUT
 *   $ASN_FABRIC_PEER_3  e.g. 64700
 *   $OVERLAY_PEER_V4_4  e.g. 192.168.252.1
 *   $DESCRIPTION_4      e.g. facing_sspine001-2-evpn-overlay
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
                export ( $BGP_EXPORT_POL_1 );
                peer-as $ASN_FABRIC_PEER_1;
            }
            neighbor $OVERLAY_PEER_V4_2 {
                description $DESCRIPTION_2;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL_1 );
                peer-as $ASN_FABRIC_PEER_2;
            }
            neighbor $OVERLAY_PEER_V4_3 {
                description $DESCRIPTION_3;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
            }
            neighbor $OVERLAY_PEER_V4_4 {
                description $DESCRIPTION_4;
                local-address $LOOPBACK_V4;
                family evpn {
                    signaling;
                }
                export ( $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
            }
            vpn-apply-export;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$BGP_EXPORT_POL_1`, `$BGP_EXPORT_POL_2`): required, for each reference; one of `policy-options/policy-statement/ps-add-from-spine-evpn-tier-accept`, `policy-options/policy-statement/ps-reject-bgp-from-superspine-evpn-tier-accept`

## junos/protocols/bgp-group-ebgp-underlay-2-peers-dual-stack-bfd-export-2-policies.conf

```
/*
 * Topic: Leaf eBGP underlay group with two spine peers over IPv4 and IPv6, BFD and a two-policy export chain
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Peers with:
 *   [compute-leaf1_qfx5120-48ym] <-> [compute-spine1_qfx5210-64c]
 *   [compute-leaf1_qfx5120-48ym] <-> [compute-spine2_qfx5210-64c]
 *   [compute-leaf2_qfx5120-48ym] <-> [compute-spine1_qfx5210-64c]
 *   [compute-leaf2_qfx5120-48ym] <-> [compute-spine2_qfx5210-64c]
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $BGP_GROUP            e.g. l3clos-l
 *   $UNDERLAY_PEER_V6_1   e.g. fdf6:ed70:1fac:f2d4::18
 *   $DESCRIPTION_1        e.g. facing_spine001-001-1
 *   $UNDERLAY_LOCAL_V6_1  e.g. fdf6:ed70:1fac:f2d4::19
 *   $BGP_EXPORT_POL_1     e.g. LEAF_TO_SPINE_FABRIC_OUT
 *   $BGP_EXPORT_POL_2     e.g. BGP-AOS-Policy
 *   $ASN_FABRIC_PEER      e.g. 64701
 *   $UNDERLAY_PEER_V6_2   e.g. fdf6:ed70:1fac:f2d4::1c
 *   $DESCRIPTION_2        e.g. facing_spine001-001-2
 *   $UNDERLAY_LOCAL_V6_2  e.g. fdf6:ed70:1fac:f2d4::1d
 *   $UNDERLAY_PEER_V4_1   e.g. 10.0.1.24
 *   $UNDERLAY_LOCAL_V4_1  e.g. 10.0.1.25
 *   $UNDERLAY_PEER_V4_2   e.g. 10.0.1.28
 *   $UNDERLAY_LOCAL_V4_2  e.g. 10.0.1.29
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
            neighbor $UNDERLAY_PEER_V6_1 {
                description $DESCRIPTION_1;
                local-address $UNDERLAY_LOCAL_V6_1;
                family inet6 {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER;
            }
            neighbor $UNDERLAY_PEER_V6_2 {
                description $DESCRIPTION_2;
                local-address $UNDERLAY_LOCAL_V6_2;
                family inet6 {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER;
            }
            neighbor $UNDERLAY_PEER_V4_1 {
                description $DESCRIPTION_1;
                local-address $UNDERLAY_LOCAL_V4_1;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER;
            }
            neighbor $UNDERLAY_PEER_V4_2 {
                description $DESCRIPTION_2;
                local-address $UNDERLAY_LOCAL_V4_2;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER;
            }
            vpn-apply-export;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$BGP_EXPORT_POL_1`, `$BGP_EXPORT_POL_2`): required, for each reference; one of `policy-options/policy-statement/ps-from-policy-evpn-host-routes-accept-reject`, `policy-options/policy-statement/ps-reject-bgp-from-spine-tier-accept`

## junos/protocols/bgp-group-ebgp-underlay-4-peers-dual-stack-bfd-export-2-policies.conf

```
/*
 * Topic: Spine eBGP underlay group with four peers (two leaves and two superspines) over IPv4 and IPv6, BFD and two-policy export chains
 * Seen on:
 *   Junos: compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 4
 * Pair with: none
 * Peers with:
 *   [compute-leaf1_qfx5120-48ym] <-> [compute-spine1_qfx5210-64c]
 *   [compute-leaf1_qfx5120-48ym] <-> [compute-spine2_qfx5210-64c]
 *   [compute-leaf2_qfx5120-48ym] <-> [compute-spine1_qfx5210-64c]
 *   [compute-leaf2_qfx5120-48ym] <-> [compute-spine2_qfx5210-64c]
 *   [compute-spine1_qfx5210-64c] <-> [superspine1_qfx5230-64cd]
 *   [compute-spine1_qfx5210-64c] <-> [superspine2_qfx5230-64cd]
 *   [compute-spine2_qfx5210-64c] <-> [superspine1_qfx5230-64cd]
 *   [compute-spine2_qfx5210-64c] <-> [superspine2_qfx5230-64cd]
 *   [services-leaf1_qfx5130-48c] <-> [services-spine1_qfx5210-64c]
 *   [services-leaf1_qfx5130-48c] <-> [services-spine2_qfx5210-64c]
 *   [services-leaf2_qfx5130-48c] <-> [services-spine1_qfx5210-64c]
 *   [services-leaf2_qfx5130-48c] <-> [services-spine2_qfx5210-64c]
 *   [services-spine1_qfx5210-64c] <-> [superspine1_qfx5230-64cd]
 *   [services-spine1_qfx5210-64c] <-> [superspine2_qfx5230-64cd]
 *   [services-spine2_qfx5210-64c] <-> [superspine1_qfx5230-64cd]
 *   [services-spine2_qfx5210-64c] <-> [superspine2_qfx5230-64cd]
 * Variables (example values from compute-spine1_qfx5210-64c):
 *   $BGP_GROUP            e.g. l3clos-s
 *   $UNDERLAY_PEER_V6_1   e.g. fdf6:ed70:1fac:f2d4::19
 *   $DESCRIPTION_1        e.g. facing_leaf001-001-1
 *   $UNDERLAY_LOCAL_V6_1  e.g. fdf6:ed70:1fac:f2d4::18
 *   $BGP_EXPORT_POL_1     e.g. SPINE_TO_LEAF_FABRIC_OUT
 *   $BGP_EXPORT_POL_2     e.g. BGP-AOS-Policy
 *   $ASN_FABRIC_PEER_1    e.g. 64704
 *   $UNDERLAY_PEER_V6_2   e.g. fdf6:ed70:1fac:f2d4::1b
 *   $DESCRIPTION_2        e.g. facing_leaf001-001-2
 *   $UNDERLAY_LOCAL_V6_2  e.g. fdf6:ed70:1fac:f2d4::1a
 *   $ASN_FABRIC_PEER_2    e.g. 64705
 *   $UNDERLAY_PEER_V6_3   e.g. fdf6:ed70:1fac:f2d4::1
 *   $DESCRIPTION_3        e.g. facing_sspine001-1
 *   $UNDERLAY_LOCAL_V6_3  e.g. fdf6:ed70:1fac:f2d4::
 *   $BGP_EXPORT_POL_3     e.g. SPINE_TO_SUPERSPINE_FABRIC_OUT
 *   $ASN_FABRIC_PEER_3    e.g. 64700
 *   $UNDERLAY_PEER_V6_4   e.g. fdf6:ed70:1fac:f2d4::3
 *   $DESCRIPTION_4        e.g. facing_sspine001-2
 *   $UNDERLAY_LOCAL_V6_4  e.g. fdf6:ed70:1fac:f2d4::2
 *   $UNDERLAY_PEER_V4_1   e.g. 10.0.1.25
 *   $UNDERLAY_LOCAL_V4_1  e.g. 10.0.1.24
 *   $UNDERLAY_PEER_V4_2   e.g. 10.0.1.27
 *   $UNDERLAY_LOCAL_V4_2  e.g. 10.0.1.26
 *   $UNDERLAY_PEER_V4_3   e.g. 10.0.1.1
 *   $UNDERLAY_LOCAL_V4_3  e.g. 10.0.1.0
 *   $UNDERLAY_PEER_V4_4   e.g. 10.0.1.3
 *   $UNDERLAY_LOCAL_V4_4  e.g. 10.0.1.2
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
            neighbor $UNDERLAY_PEER_V6_1 {
                description $DESCRIPTION_1;
                local-address $UNDERLAY_LOCAL_V6_1;
                family inet6 {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_1;
            }
            neighbor $UNDERLAY_PEER_V6_2 {
                description $DESCRIPTION_2;
                local-address $UNDERLAY_LOCAL_V6_2;
                family inet6 {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_2;
            }
            neighbor $UNDERLAY_PEER_V6_3 {
                description $DESCRIPTION_3;
                local-address $UNDERLAY_LOCAL_V6_3;
                family inet6 {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_3 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
            }
            neighbor $UNDERLAY_PEER_V6_4 {
                description $DESCRIPTION_4;
                local-address $UNDERLAY_LOCAL_V6_4;
                family inet6 {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_3 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
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
                description $DESCRIPTION_2;
                local-address $UNDERLAY_LOCAL_V4_2;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_2;
            }
            neighbor $UNDERLAY_PEER_V4_3 {
                description $DESCRIPTION_3;
                local-address $UNDERLAY_LOCAL_V4_3;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_3 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
            }
            neighbor $UNDERLAY_PEER_V4_4 {
                description $DESCRIPTION_4;
                local-address $UNDERLAY_LOCAL_V4_4;
                family inet {
                    unicast;
                }
                export ( $BGP_EXPORT_POL_3 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
            }
            vpn-apply-export;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$BGP_EXPORT_POL_1`, `$BGP_EXPORT_POL_2`, `$BGP_EXPORT_POL_3`): required, for each reference; one of `policy-options/policy-statement/ps-add-from-spine-tier-accept`, `policy-options/policy-statement/ps-from-policy-bgp-accept-reject`, `policy-options/policy-statement/ps-reject-bgp-from-superspine-tier-accept`

## junos/protocols/bgp-log-updown-graceful-restart-multipath.conf

```
/*
 * Topic: BGP global options: log-updown, graceful restart without helping on shared-fate BFD down, and multipath
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
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

## junos/protocols/igmp-interface-all.conf

```
/*
 * Topic: IGMP on all interfaces
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym external-gw_mx
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   external-gw_mx 1
 *   total 3
 * Pair with: none
 * Variables: none
 */
protocols {
    igmp {
        interface all;
    }
}
```

## junos/protocols/l2-learning-telemetry-remote-entries.conf

```
/*
 * Topic: Layer 2 learning telemetry that includes remote entries
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
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

## junos/protocols/lldp-interface-all-port-id-interface-name.conf

```
/*
 * Topic: LLDP on all interfaces with the interface name as port ID and the interface description as port description
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
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

## junos/protocols/ospf-area-0-loopback-2-interfaces.conf

```
/*
 * Topic: OSPF area 0 on the loopback and two interfaces
 * Seen on:
 *   Junos: external-gw_mx
 *   EVO: (none)
 * Count:
 *   external-gw_mx 1
 *   total 1
 * Pair with: none
 * Variables (example values from external-gw_mx):
 *   $CORE_INTF_1  e.g. xe-0/0/7:0.299
 *   $CORE_INTF_2  e.g. xe-0/0/7:1.299
 */
protocols {
    ospf {
        area 0.0.0.0 {
            interface lo0.0;
            interface $CORE_INTF_1;
            interface $CORE_INTF_2;
        }
    }
}
```

## junos/protocols/pim-rp-local-interface-all.conf

```
/*
 * Topic: PIM with a local rendezvous point, on all interfaces
 * Seen on:
 *   Junos: external-gw_mx
 *   EVO: (none)
 * Count:
 *   external-gw_mx 1
 *   total 1
 * Pair with: none
 * Variables (example values from external-gw_mx):
 *   $PIM_RP_V4  e.g. 100.100.100.100
 */
protocols {
    pim {
        rp {
            local {
                address $PIM_RP_V4;
            }
        }
        interface all;
    }
}
```

## junos/protocols/router-advertisement-interface.conf

```
/*
 * Topic: IPv6 router advertisements on one logical interface (a fabric link or an IRB unit), with 30-second maximum and 10-second minimum intervals
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 52
 *   compute-leaf2_qfx5120-48ym 52
 *   compute-spine1_qfx5210-64c 4
 *   compute-spine2_qfx5210-64c 4
 *   services-spine1_qfx5210-64c 4
 *   services-spine2_qfx5210-64c 4
 *   total 120
 * Pair with: none
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $IFL  e.g. et-0/0/48.0
 */
protocols {
    router-advertisement {
        interface $IFL {
            max-advertisement-interval 30;
            min-advertisement-interval 10;
        }
    }
}
```

## junos/protocols/rstp-bridge-priority-0-bpdu-block-on-edge.conf

```
/*
 * Topic: RSTP with bridge priority 0 and BPDU block on edge ports
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Variables: none
 */
protocols {
    rstp {
        bridge-priority 0;
        bpdu-block-on-edge;
    }
}
```

## junos/protocols/rstp-disable.conf

```
/*
 * Topic: RSTP disabled
 * Seen on:
 *   Junos: compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
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

## junos/protocols/rstp-interface-edge.conf

```
/*
 * Topic: RSTP edge port
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 3
 *   compute-leaf2_qfx5120-48ym 2
 *   total 5
 * Pair with: none
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $AC_INTF  e.g. ae1
 */
protocols {
    rstp {
        interface $AC_INTF {
            edge;
        }
    }
}
```

## junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-proxy-2-ac.conf

```
/*
 * Topic: VLAN-aware EVPN-VXLAN MAC-VRF with 51 VLANs, IGMP snooping with proxy, and two access interfaces
 * Seen on:
 *   Junos: compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf2_qfx5120-48ym 1
 *   total 1
 * Pair with: none
 * Variables (example values from compute-leaf2_qfx5120-48ym):
 *   $INSTANCE_NAME   e.g. evpn-1
 *   $VNI_1           e.g. 10400
 *   $VNI_2           e.g. 10401
 *   $VNI_3           e.g. 10402
 *   $VNI_4           e.g. 10403
 *   $VNI_5           e.g. 10404
 *   $VNI_6           e.g. 10405
 *   $VNI_7           e.g. 10406
 *   $VNI_8           e.g. 10407
 *   $VNI_9           e.g. 10408
 *   $VNI_10          e.g. 10409
 *   $VNI_11          e.g. 10410
 *   $VNI_12          e.g. 10411
 *   $VNI_13          e.g. 10412
 *   $VNI_14          e.g. 10413
 *   $VNI_15          e.g. 10414
 *   $VNI_16          e.g. 10415
 *   $VNI_17          e.g. 10416
 *   $VNI_18          e.g. 10417
 *   $VNI_19          e.g. 10418
 *   $VNI_20          e.g. 10419
 *   $VNI_21          e.g. 11400
 *   $VNI_22          e.g. 11401
 *   $VNI_23          e.g. 11402
 *   $VNI_24          e.g. 11403
 *   $VNI_25          e.g. 11404
 *   $VNI_26          e.g. 11405
 *   $VNI_27          e.g. 11406
 *   $VNI_28          e.g. 11407
 *   $VNI_29          e.g. 11408
 *   $VNI_30          e.g. 11409
 *   $VNI_31          e.g. 11410
 *   $VNI_32          e.g. 11411
 *   $VNI_33          e.g. 11412
 *   $VNI_34          e.g. 11413
 *   $VNI_35          e.g. 11414
 *   $VNI_36          e.g. 11415
 *   $VNI_37          e.g. 11416
 *   $VNI_38          e.g. 11417
 *   $VNI_39          e.g. 11418
 *   $VNI_40          e.g. 11419
 *   $VNI_41          e.g. 12500
 *   $VNI_42          e.g. 12501
 *   $VNI_43          e.g. 12502
 *   $VNI_44          e.g. 12503
 *   $VNI_45          e.g. 12504
 *   $VNI_46          e.g. 12505
 *   $VNI_47          e.g. 12506
 *   $VNI_48          e.g. 12507
 *   $VNI_49          e.g. 12508
 *   $VNI_50          e.g. 12509
 *   $VNI_51          e.g. 35000
 *   $AC_IFL_1        e.g. xe-0/0/1.0
 *   $AC_IFL_2        e.g. ae1.0
 *   $LOOPBACK_V4     e.g. 192.168.252.9
 *   $BD_NAME_1       e.g. vn1400
 *   $DESCRIPTION_1   e.g. blue_all_1400
 *   $VLAN_BD_1       e.g. 1400
 *   $IRB_IFL_1       e.g. irb.1400
 *   $BD_NAME_2       e.g. vn1401
 *   $DESCRIPTION_2   e.g. blue_all_1401
 *   $VLAN_BD_2       e.g. 1401
 *   $IRB_IFL_2       e.g. irb.1401
 *   $BD_NAME_3       e.g. vn1402
 *   $DESCRIPTION_3   e.g. blue_all_1402
 *   $VLAN_BD_3       e.g. 1402
 *   $IRB_IFL_3       e.g. irb.1402
 *   $BD_NAME_4       e.g. vn1403
 *   $DESCRIPTION_4   e.g. blue_all_1403
 *   $VLAN_BD_4       e.g. 1403
 *   $IRB_IFL_4       e.g. irb.1403
 *   $BD_NAME_5       e.g. vn1404
 *   $DESCRIPTION_5   e.g. blue_all_1404
 *   $VLAN_BD_5       e.g. 1404
 *   $IRB_IFL_5       e.g. irb.1404
 *   $BD_NAME_6       e.g. vn1405
 *   $DESCRIPTION_6   e.g. blue_all_1405
 *   $VLAN_BD_6       e.g. 1405
 *   $IRB_IFL_6       e.g. irb.1405
 *   $BD_NAME_7       e.g. vn1406
 *   $DESCRIPTION_7   e.g. blue_all_1406
 *   $VLAN_BD_7       e.g. 1406
 *   $IRB_IFL_7       e.g. irb.1406
 *   $BD_NAME_8       e.g. vn1407
 *   $DESCRIPTION_8   e.g. blue_all_1407
 *   $VLAN_BD_8       e.g. 1407
 *   $IRB_IFL_8       e.g. irb.1407
 *   $BD_NAME_9       e.g. vn1408
 *   $DESCRIPTION_9   e.g. blue_all_1408
 *   $VLAN_BD_9       e.g. 1408
 *   $IRB_IFL_9       e.g. irb.1408
 *   $BD_NAME_10      e.g. vn1409
 *   $DESCRIPTION_10  e.g. blue_all_1409
 *   $VLAN_BD_10      e.g. 1409
 *   $IRB_IFL_10      e.g. irb.1409
 *   $BD_NAME_11      e.g. vn1410
 *   $DESCRIPTION_11  e.g. blue_sub_1_1410
 *   $VLAN_BD_11      e.g. 1410
 *   $IRB_IFL_11      e.g. irb.1410
 *   $BD_NAME_12      e.g. vn1411
 *   $DESCRIPTION_12  e.g. blue_sub_1_1411
 *   $VLAN_BD_12      e.g. 1411
 *   $IRB_IFL_12      e.g. irb.1411
 *   $BD_NAME_13      e.g. vn1412
 *   $DESCRIPTION_13  e.g. blue_sub_1_1412
 *   $VLAN_BD_13      e.g. 1412
 *   $IRB_IFL_13      e.g. irb.1412
 *   $BD_NAME_14      e.g. vn1413
 *   $DESCRIPTION_14  e.g. blue_sub_1_1413
 *   $VLAN_BD_14      e.g. 1413
 *   $IRB_IFL_14      e.g. irb.1413
 *   $BD_NAME_15      e.g. vn1414
 *   $DESCRIPTION_15  e.g. blue_sub_1_1414
 *   $VLAN_BD_15      e.g. 1414
 *   $IRB_IFL_15      e.g. irb.1414
 *   $BD_NAME_16      e.g. vn1415
 *   $DESCRIPTION_16  e.g. blue_sub_1_1415
 *   $VLAN_BD_16      e.g. 1415
 *   $IRB_IFL_16      e.g. irb.1415
 *   $BD_NAME_17      e.g. vn1416
 *   $DESCRIPTION_17  e.g. blue_sub_1_1416
 *   $VLAN_BD_17      e.g. 1416
 *   $IRB_IFL_17      e.g. irb.1416
 *   $BD_NAME_18      e.g. vn1417
 *   $DESCRIPTION_18  e.g. blue_sub_1_1417
 *   $VLAN_BD_18      e.g. 1417
 *   $IRB_IFL_18      e.g. irb.1417
 *   $BD_NAME_19      e.g. vn1418
 *   $DESCRIPTION_19  e.g. blue_sub_1_1418
 *   $VLAN_BD_19      e.g. 1418
 *   $IRB_IFL_19      e.g. irb.1418
 *   $BD_NAME_20      e.g. vn1419
 *   $DESCRIPTION_20  e.g. blue_sub_1_1419
 *   $VLAN_BD_20      e.g. 1419
 *   $IRB_IFL_20      e.g. irb.1419
 *   $BD_NAME_21      e.g. vn2500
 *   $DESCRIPTION_21  e.g. green_2500
 *   $VLAN_BD_21      e.g. 2500
 *   $IRB_IFL_21      e.g. irb.2500
 *   $BD_NAME_22      e.g. vn2501
 *   $DESCRIPTION_22  e.g. green_2501
 *   $VLAN_BD_22      e.g. 2501
 *   $IRB_IFL_22      e.g. irb.2501
 *   $BD_NAME_23      e.g. vn2502
 *   $DESCRIPTION_23  e.g. green_2502
 *   $VLAN_BD_23      e.g. 2502
 *   $IRB_IFL_23      e.g. irb.2502
 *   $BD_NAME_24      e.g. vn2503
 *   $DESCRIPTION_24  e.g. green_2503
 *   $VLAN_BD_24      e.g. 2503
 *   $IRB_IFL_24      e.g. irb.2503
 *   $BD_NAME_25      e.g. vn2504
 *   $DESCRIPTION_25  e.g. green_2504
 *   $VLAN_BD_25      e.g. 2504
 *   $IRB_IFL_25      e.g. irb.2504
 *   $BD_NAME_26      e.g. vn2505
 *   $DESCRIPTION_26  e.g. green_2505
 *   $VLAN_BD_26      e.g. 2505
 *   $IRB_IFL_26      e.g. irb.2505
 *   $BD_NAME_27      e.g. vn2506
 *   $DESCRIPTION_27  e.g. green_2506
 *   $VLAN_BD_27      e.g. 2506
 *   $IRB_IFL_27      e.g. irb.2506
 *   $BD_NAME_28      e.g. vn2507
 *   $DESCRIPTION_28  e.g. green_2507
 *   $VLAN_BD_28      e.g. 2507
 *   $IRB_IFL_28      e.g. irb.2507
 *   $BD_NAME_29      e.g. vn2508
 *   $DESCRIPTION_29  e.g. green_2508
 *   $VLAN_BD_29      e.g. 2508
 *   $IRB_IFL_29      e.g. irb.2508
 *   $BD_NAME_30      e.g. vn2509
 *   $DESCRIPTION_30  e.g. green_2509
 *   $VLAN_BD_30      e.g. 2509
 *   $IRB_IFL_30      e.g. irb.2509
 *   $BD_NAME_31      e.g. vn3500
 *   $DESCRIPTION_31  e.g. blue-SBD
 *   $VLAN_BD_31      e.g. 3500
 *   $IRB_IFL_31      e.g. irb.3500
 *   $BD_NAME_32      e.g. vn400
 *   $DESCRIPTION_32  e.g. red_all_400
 *   $VLAN_BD_32      e.g. 400
 *   $IRB_IFL_32      e.g. irb.400
 *   $BD_NAME_33      e.g. vn401
 *   $DESCRIPTION_33  e.g. red_all_401
 *   $VLAN_BD_33      e.g. 401
 *   $IRB_IFL_33      e.g. irb.401
 *   $BD_NAME_34      e.g. vn402
 *   $DESCRIPTION_34  e.g. red_all_402
 *   $VLAN_BD_34      e.g. 402
 *   $IRB_IFL_34      e.g. irb.402
 *   $BD_NAME_35      e.g. vn403
 *   $DESCRIPTION_35  e.g. red_all_403
 *   $VLAN_BD_35      e.g. 403
 *   $IRB_IFL_35      e.g. irb.403
 *   $BD_NAME_36      e.g. vn404
 *   $DESCRIPTION_36  e.g. red_all_404
 *   $VLAN_BD_36      e.g. 404
 *   $IRB_IFL_36      e.g. irb.404
 *   $BD_NAME_37      e.g. vn405
 *   $DESCRIPTION_37  e.g. red_all_405
 *   $VLAN_BD_37      e.g. 405
 *   $IRB_IFL_37      e.g. irb.405
 *   $BD_NAME_38      e.g. vn406
 *   $DESCRIPTION_38  e.g. red_all_406
 *   $VLAN_BD_38      e.g. 406
 *   $IRB_IFL_38      e.g. irb.406
 *   $BD_NAME_39      e.g. vn407
 *   $DESCRIPTION_39  e.g. red_all_407
 *   $VLAN_BD_39      e.g. 407
 *   $IRB_IFL_39      e.g. irb.407
 *   $BD_NAME_40      e.g. vn408
 *   $DESCRIPTION_40  e.g. red_all_408
 *   $VLAN_BD_40      e.g. 408
 *   $IRB_IFL_40      e.g. irb.408
 *   $BD_NAME_41      e.g. vn409
 *   $DESCRIPTION_41  e.g. red_all_409
 *   $VLAN_BD_41      e.g. 409
 *   $IRB_IFL_41      e.g. irb.409
 *   $BD_NAME_42      e.g. vn410
 *   $DESCRIPTION_42  e.g. red_sub_1_410
 *   $VLAN_BD_42      e.g. 410
 *   $IRB_IFL_42      e.g. irb.410
 *   $BD_NAME_43      e.g. vn411
 *   $DESCRIPTION_43  e.g. red_sub_1_411
 *   $VLAN_BD_43      e.g. 411
 *   $IRB_IFL_43      e.g. irb.411
 *   $BD_NAME_44      e.g. vn412
 *   $DESCRIPTION_44  e.g. red_sub_1_412
 *   $VLAN_BD_44      e.g. 412
 *   $IRB_IFL_44      e.g. irb.412
 *   $BD_NAME_45      e.g. vn413
 *   $DESCRIPTION_45  e.g. red_sub_1_413
 *   $VLAN_BD_45      e.g. 413
 *   $IRB_IFL_45      e.g. irb.413
 *   $BD_NAME_46      e.g. vn414
 *   $DESCRIPTION_46  e.g. red_sub_1_414
 *   $VLAN_BD_46      e.g. 414
 *   $IRB_IFL_46      e.g. irb.414
 *   $BD_NAME_47      e.g. vn415
 *   $DESCRIPTION_47  e.g. red_sub_1_415
 *   $VLAN_BD_47      e.g. 415
 *   $IRB_IFL_47      e.g. irb.415
 *   $BD_NAME_48      e.g. vn416
 *   $DESCRIPTION_48  e.g. red_sub_1_416
 *   $VLAN_BD_48      e.g. 416
 *   $IRB_IFL_48      e.g. irb.416
 *   $BD_NAME_49      e.g. vn417
 *   $DESCRIPTION_49  e.g. red_sub_1_417
 *   $VLAN_BD_49      e.g. 417
 *   $IRB_IFL_49      e.g. irb.417
 *   $BD_NAME_50      e.g. vn418
 *   $DESCRIPTION_50  e.g. red_sub_1_418
 *   $VLAN_BD_50      e.g. 418
 *   $IRB_IFL_50      e.g. irb.418
 *   $BD_NAME_51      e.g. vn419
 *   $DESCRIPTION_51  e.g. red_sub_1_419
 *   $VLAN_BD_51      e.g. 419
 *   $IRB_IFL_51      e.g. irb.419
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type mac-vrf;
        protocols {
            igmp-snooping {
                vlan all {
                    proxy;
                }
            }
            evpn {
                encapsulation vxlan;
                default-gateway no-gateway-community;
                duplicate-mac-detection {
                    auto-recovery-time 9;
                }
                extended-vni-list all;
                vni-options {
                    vni $VNI_1 {
                        vrf-target target:10400:1;
                    }
                    vni $VNI_2 {
                        vrf-target target:10401:1;
                    }
                    vni $VNI_3 {
                        vrf-target target:10402:1;
                    }
                    vni $VNI_4 {
                        vrf-target target:10403:1;
                    }
                    vni $VNI_5 {
                        vrf-target target:10404:1;
                    }
                    vni $VNI_6 {
                        vrf-target target:10405:1;
                    }
                    vni $VNI_7 {
                        vrf-target target:10406:1;
                    }
                    vni $VNI_8 {
                        vrf-target target:10407:1;
                    }
                    vni $VNI_9 {
                        vrf-target target:10408:1;
                    }
                    vni $VNI_10 {
                        vrf-target target:10409:1;
                    }
                    vni $VNI_11 {
                        vrf-target target:10410:1;
                    }
                    vni $VNI_12 {
                        vrf-target target:10411:1;
                    }
                    vni $VNI_13 {
                        vrf-target target:10412:1;
                    }
                    vni $VNI_14 {
                        vrf-target target:10413:1;
                    }
                    vni $VNI_15 {
                        vrf-target target:10414:1;
                    }
                    vni $VNI_16 {
                        vrf-target target:10415:1;
                    }
                    vni $VNI_17 {
                        vrf-target target:10416:1;
                    }
                    vni $VNI_18 {
                        vrf-target target:10417:1;
                    }
                    vni $VNI_19 {
                        vrf-target target:10418:1;
                    }
                    vni $VNI_20 {
                        vrf-target target:10419:1;
                    }
                    vni $VNI_21 {
                        vrf-target target:11400:1;
                    }
                    vni $VNI_22 {
                        vrf-target target:11401:1;
                    }
                    vni $VNI_23 {
                        vrf-target target:11402:1;
                    }
                    vni $VNI_24 {
                        vrf-target target:11403:1;
                    }
                    vni $VNI_25 {
                        vrf-target target:11404:1;
                    }
                    vni $VNI_26 {
                        vrf-target target:11405:1;
                    }
                    vni $VNI_27 {
                        vrf-target target:11406:1;
                    }
                    vni $VNI_28 {
                        vrf-target target:11407:1;
                    }
                    vni $VNI_29 {
                        vrf-target target:11408:1;
                    }
                    vni $VNI_30 {
                        vrf-target target:11409:1;
                    }
                    vni $VNI_31 {
                        vrf-target target:11410:1;
                    }
                    vni $VNI_32 {
                        vrf-target target:11411:1;
                    }
                    vni $VNI_33 {
                        vrf-target target:11412:1;
                    }
                    vni $VNI_34 {
                        vrf-target target:11413:1;
                    }
                    vni $VNI_35 {
                        vrf-target target:11414:1;
                    }
                    vni $VNI_36 {
                        vrf-target target:11415:1;
                    }
                    vni $VNI_37 {
                        vrf-target target:11416:1;
                    }
                    vni $VNI_38 {
                        vrf-target target:11417:1;
                    }
                    vni $VNI_39 {
                        vrf-target target:11418:1;
                    }
                    vni $VNI_40 {
                        vrf-target target:11419:1;
                    }
                    vni $VNI_41 {
                        vrf-target target:12500:1;
                    }
                    vni $VNI_42 {
                        vrf-target target:12501:1;
                    }
                    vni $VNI_43 {
                        vrf-target target:12502:1;
                    }
                    vni $VNI_44 {
                        vrf-target target:12503:1;
                    }
                    vni $VNI_45 {
                        vrf-target target:12504:1;
                    }
                    vni $VNI_46 {
                        vrf-target target:12505:1;
                    }
                    vni $VNI_47 {
                        vrf-target target:12506:1;
                    }
                    vni $VNI_48 {
                        vrf-target target:12507:1;
                    }
                    vni $VNI_49 {
                        vrf-target target:12508:1;
                    }
                    vni $VNI_50 {
                        vrf-target target:12509:1;
                    }
                    vni $VNI_51 {
                        vrf-target target:35000:1;
                    }
                }
            }
        }
        vtep-source-interface lo0.0;
        service-type vlan-aware;
        interface $AC_IFL_1;
        interface $AC_IFL_2;
        route-distinguisher $LOOPBACK_V4:65534;
        vrf-target target:100:100;
        vlans {
            $BD_NAME_1 {
                description $DESCRIPTION_1;
                vlan-id $VLAN_BD_1;
                l3-interface $IRB_IFL_1;
                vxlan {
                    vni $VNI_21;
                }
            }
            $BD_NAME_2 {
                description $DESCRIPTION_2;
                vlan-id $VLAN_BD_2;
                l3-interface $IRB_IFL_2;
                vxlan {
                    vni $VNI_22;
                }
            }
            $BD_NAME_3 {
                description $DESCRIPTION_3;
                vlan-id $VLAN_BD_3;
                l3-interface $IRB_IFL_3;
                vxlan {
                    vni $VNI_23;
                }
            }
            $BD_NAME_4 {
                description $DESCRIPTION_4;
                vlan-id $VLAN_BD_4;
                l3-interface $IRB_IFL_4;
                vxlan {
                    vni $VNI_24;
                }
            }
            $BD_NAME_5 {
                description $DESCRIPTION_5;
                vlan-id $VLAN_BD_5;
                l3-interface $IRB_IFL_5;
                vxlan {
                    vni $VNI_25;
                }
            }
            $BD_NAME_6 {
                description $DESCRIPTION_6;
                vlan-id $VLAN_BD_6;
                l3-interface $IRB_IFL_6;
                vxlan {
                    vni $VNI_26;
                }
            }
            $BD_NAME_7 {
                description $DESCRIPTION_7;
                vlan-id $VLAN_BD_7;
                l3-interface $IRB_IFL_7;
                vxlan {
                    vni $VNI_27;
                }
            }
            $BD_NAME_8 {
                description $DESCRIPTION_8;
                vlan-id $VLAN_BD_8;
                l3-interface $IRB_IFL_8;
                vxlan {
                    vni $VNI_28;
                }
            }
            $BD_NAME_9 {
                description $DESCRIPTION_9;
                vlan-id $VLAN_BD_9;
                l3-interface $IRB_IFL_9;
                vxlan {
                    vni $VNI_29;
                }
            }
            $BD_NAME_10 {
                description $DESCRIPTION_10;
                vlan-id $VLAN_BD_10;
                l3-interface $IRB_IFL_10;
                vxlan {
                    vni $VNI_30;
                }
            }
            $BD_NAME_11 {
                description $DESCRIPTION_11;
                vlan-id $VLAN_BD_11;
                l3-interface $IRB_IFL_11;
                vxlan {
                    vni $VNI_31;
                }
            }
            $BD_NAME_12 {
                description $DESCRIPTION_12;
                vlan-id $VLAN_BD_12;
                l3-interface $IRB_IFL_12;
                vxlan {
                    vni $VNI_32;
                }
            }
            $BD_NAME_13 {
                description $DESCRIPTION_13;
                vlan-id $VLAN_BD_13;
                l3-interface $IRB_IFL_13;
                vxlan {
                    vni $VNI_33;
                }
            }
            $BD_NAME_14 {
                description $DESCRIPTION_14;
                vlan-id $VLAN_BD_14;
                l3-interface $IRB_IFL_14;
                vxlan {
                    vni $VNI_34;
                }
            }
            $BD_NAME_15 {
                description $DESCRIPTION_15;
                vlan-id $VLAN_BD_15;
                l3-interface $IRB_IFL_15;
                vxlan {
                    vni $VNI_35;
                }
            }
            $BD_NAME_16 {
                description $DESCRIPTION_16;
                vlan-id $VLAN_BD_16;
                l3-interface $IRB_IFL_16;
                vxlan {
                    vni $VNI_36;
                }
            }
            $BD_NAME_17 {
                description $DESCRIPTION_17;
                vlan-id $VLAN_BD_17;
                l3-interface $IRB_IFL_17;
                vxlan {
                    vni $VNI_37;
                }
            }
            $BD_NAME_18 {
                description $DESCRIPTION_18;
                vlan-id $VLAN_BD_18;
                l3-interface $IRB_IFL_18;
                vxlan {
                    vni $VNI_38;
                }
            }
            $BD_NAME_19 {
                description $DESCRIPTION_19;
                vlan-id $VLAN_BD_19;
                l3-interface $IRB_IFL_19;
                vxlan {
                    vni $VNI_39;
                }
            }
            $BD_NAME_20 {
                description $DESCRIPTION_20;
                vlan-id $VLAN_BD_20;
                l3-interface $IRB_IFL_20;
                vxlan {
                    vni $VNI_40;
                }
            }
            $BD_NAME_21 {
                description $DESCRIPTION_21;
                vlan-id $VLAN_BD_21;
                l3-interface $IRB_IFL_21;
                vxlan {
                    vni $VNI_41;
                }
            }
            $BD_NAME_22 {
                description $DESCRIPTION_22;
                vlan-id $VLAN_BD_22;
                l3-interface $IRB_IFL_22;
                vxlan {
                    vni $VNI_42;
                }
            }
            $BD_NAME_23 {
                description $DESCRIPTION_23;
                vlan-id $VLAN_BD_23;
                l3-interface $IRB_IFL_23;
                vxlan {
                    vni $VNI_43;
                }
            }
            $BD_NAME_24 {
                description $DESCRIPTION_24;
                vlan-id $VLAN_BD_24;
                l3-interface $IRB_IFL_24;
                vxlan {
                    vni $VNI_44;
                }
            }
            $BD_NAME_25 {
                description $DESCRIPTION_25;
                vlan-id $VLAN_BD_25;
                l3-interface $IRB_IFL_25;
                vxlan {
                    vni $VNI_45;
                }
            }
            $BD_NAME_26 {
                description $DESCRIPTION_26;
                vlan-id $VLAN_BD_26;
                l3-interface $IRB_IFL_26;
                vxlan {
                    vni $VNI_46;
                }
            }
            $BD_NAME_27 {
                description $DESCRIPTION_27;
                vlan-id $VLAN_BD_27;
                l3-interface $IRB_IFL_27;
                vxlan {
                    vni $VNI_47;
                }
            }
            $BD_NAME_28 {
                description $DESCRIPTION_28;
                vlan-id $VLAN_BD_28;
                l3-interface $IRB_IFL_28;
                vxlan {
                    vni $VNI_48;
                }
            }
            $BD_NAME_29 {
                description $DESCRIPTION_29;
                vlan-id $VLAN_BD_29;
                l3-interface $IRB_IFL_29;
                vxlan {
                    vni $VNI_49;
                }
            }
            $BD_NAME_30 {
                description $DESCRIPTION_30;
                vlan-id $VLAN_BD_30;
                l3-interface $IRB_IFL_30;
                vxlan {
                    vni $VNI_50;
                }
            }
            $BD_NAME_31 {
                description $DESCRIPTION_31;
                vlan-id $VLAN_BD_31;
                l3-interface $IRB_IFL_31;
                vxlan {
                    vni $VNI_51;
                }
            }
            $BD_NAME_32 {
                description $DESCRIPTION_32;
                vlan-id $VLAN_BD_32;
                l3-interface $IRB_IFL_32;
                vxlan {
                    vni $VNI_1;
                }
            }
            $BD_NAME_33 {
                description $DESCRIPTION_33;
                vlan-id $VLAN_BD_33;
                l3-interface $IRB_IFL_33;
                vxlan {
                    vni $VNI_2;
                }
            }
            $BD_NAME_34 {
                description $DESCRIPTION_34;
                vlan-id $VLAN_BD_34;
                l3-interface $IRB_IFL_34;
                vxlan {
                    vni $VNI_3;
                }
            }
            $BD_NAME_35 {
                description $DESCRIPTION_35;
                vlan-id $VLAN_BD_35;
                l3-interface $IRB_IFL_35;
                vxlan {
                    vni $VNI_4;
                }
            }
            $BD_NAME_36 {
                description $DESCRIPTION_36;
                vlan-id $VLAN_BD_36;
                l3-interface $IRB_IFL_36;
                vxlan {
                    vni $VNI_5;
                }
            }
            $BD_NAME_37 {
                description $DESCRIPTION_37;
                vlan-id $VLAN_BD_37;
                l3-interface $IRB_IFL_37;
                vxlan {
                    vni $VNI_6;
                }
            }
            $BD_NAME_38 {
                description $DESCRIPTION_38;
                vlan-id $VLAN_BD_38;
                l3-interface $IRB_IFL_38;
                vxlan {
                    vni $VNI_7;
                }
            }
            $BD_NAME_39 {
                description $DESCRIPTION_39;
                vlan-id $VLAN_BD_39;
                l3-interface $IRB_IFL_39;
                vxlan {
                    vni $VNI_8;
                }
            }
            $BD_NAME_40 {
                description $DESCRIPTION_40;
                vlan-id $VLAN_BD_40;
                l3-interface $IRB_IFL_40;
                vxlan {
                    vni $VNI_9;
                }
            }
            $BD_NAME_41 {
                description $DESCRIPTION_41;
                vlan-id $VLAN_BD_41;
                l3-interface $IRB_IFL_41;
                vxlan {
                    vni $VNI_10;
                }
            }
            $BD_NAME_42 {
                description $DESCRIPTION_42;
                vlan-id $VLAN_BD_42;
                l3-interface $IRB_IFL_42;
                vxlan {
                    vni $VNI_11;
                }
            }
            $BD_NAME_43 {
                description $DESCRIPTION_43;
                vlan-id $VLAN_BD_43;
                l3-interface $IRB_IFL_43;
                vxlan {
                    vni $VNI_12;
                }
            }
            $BD_NAME_44 {
                description $DESCRIPTION_44;
                vlan-id $VLAN_BD_44;
                l3-interface $IRB_IFL_44;
                vxlan {
                    vni $VNI_13;
                }
            }
            $BD_NAME_45 {
                description $DESCRIPTION_45;
                vlan-id $VLAN_BD_45;
                l3-interface $IRB_IFL_45;
                vxlan {
                    vni $VNI_14;
                }
            }
            $BD_NAME_46 {
                description $DESCRIPTION_46;
                vlan-id $VLAN_BD_46;
                l3-interface $IRB_IFL_46;
                vxlan {
                    vni $VNI_15;
                }
            }
            $BD_NAME_47 {
                description $DESCRIPTION_47;
                vlan-id $VLAN_BD_47;
                l3-interface $IRB_IFL_47;
                vxlan {
                    vni $VNI_16;
                }
            }
            $BD_NAME_48 {
                description $DESCRIPTION_48;
                vlan-id $VLAN_BD_48;
                l3-interface $IRB_IFL_48;
                vxlan {
                    vni $VNI_17;
                }
            }
            $BD_NAME_49 {
                description $DESCRIPTION_49;
                vlan-id $VLAN_BD_49;
                l3-interface $IRB_IFL_49;
                vxlan {
                    vni $VNI_18;
                }
            }
            $BD_NAME_50 {
                description $DESCRIPTION_50;
                vlan-id $VLAN_BD_50;
                l3-interface $IRB_IFL_50;
                vxlan {
                    vni $VNI_19;
                }
            }
            $BD_NAME_51 {
                description $DESCRIPTION_51;
                vlan-id $VLAN_BD_51;
                l3-interface $IRB_IFL_51;
                vxlan {
                    vni $VNI_20;
                }
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL_1`, `$AC_IFL_2`, `$IRB_IFL_1`, `$IRB_IFL_2`, `$IRB_IFL_3`, `$IRB_IFL_4`, `$IRB_IFL_5`, `$IRB_IFL_6`, `$IRB_IFL_7`, `$IRB_IFL_8`, `$IRB_IFL_9`, `$IRB_IFL_10`, `$IRB_IFL_11`, `$IRB_IFL_12`, `$IRB_IFL_13`, `$IRB_IFL_14`, `$IRB_IFL_15`, `$IRB_IFL_16`, `$IRB_IFL_17`, `$IRB_IFL_18`, `$IRB_IFL_19`, `$IRB_IFL_20`, `$IRB_IFL_21`, `$IRB_IFL_22`, `$IRB_IFL_23`, `$IRB_IFL_24`, `$IRB_IFL_25`, `$IRB_IFL_26`, `$IRB_IFL_27`, `$IRB_IFL_28`, `$IRB_IFL_29`, `$IRB_IFL_30`, `$IRB_IFL_31`, `$IRB_IFL_32`, `$IRB_IFL_33`, `$IRB_IFL_34`, `$IRB_IFL_35`, `$IRB_IFL_36`, `$IRB_IFL_37`, `$IRB_IFL_38`, `$IRB_IFL_39`, `$IRB_IFL_40`, `$IRB_IFL_41`, `$IRB_IFL_42`, `$IRB_IFL_43`, `$IRB_IFL_44`, `$IRB_IFL_45`, `$IRB_IFL_46`, `$IRB_IFL_47`, `$IRB_IFL_48`, `$IRB_IFL_49`, `$IRB_IFL_50`, `$IRB_IFL_51`): required, for each reference; one of `interfaces/ifl-ethernet-switching-trunk-vlans`, `interfaces/irb-inet-inet6-mtu-9000-mac-no-dhcp-flood`, `interfaces/irb-inet-inet6-mtu-9000-mac`, `interfaces/irb-inet-virtual-gateway-mtu-9000`

## junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-proxy-3-ac.conf

```
/*
 * Topic: VLAN-aware EVPN-VXLAN MAC-VRF with 51 VLANs, IGMP snooping with proxy, and three access interfaces
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   total 1
 * Pair with: none
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $INSTANCE_NAME   e.g. evpn-1
 *   $VNI_1           e.g. 10400
 *   $VNI_2           e.g. 10401
 *   $VNI_3           e.g. 10402
 *   $VNI_4           e.g. 10403
 *   $VNI_5           e.g. 10404
 *   $VNI_6           e.g. 10405
 *   $VNI_7           e.g. 10406
 *   $VNI_8           e.g. 10407
 *   $VNI_9           e.g. 10408
 *   $VNI_10          e.g. 10409
 *   $VNI_11          e.g. 10410
 *   $VNI_12          e.g. 10411
 *   $VNI_13          e.g. 10412
 *   $VNI_14          e.g. 10413
 *   $VNI_15          e.g. 10414
 *   $VNI_16          e.g. 10415
 *   $VNI_17          e.g. 10416
 *   $VNI_18          e.g. 10417
 *   $VNI_19          e.g. 10418
 *   $VNI_20          e.g. 10419
 *   $VNI_21          e.g. 11400
 *   $VNI_22          e.g. 11401
 *   $VNI_23          e.g. 11402
 *   $VNI_24          e.g. 11403
 *   $VNI_25          e.g. 11404
 *   $VNI_26          e.g. 11405
 *   $VNI_27          e.g. 11406
 *   $VNI_28          e.g. 11407
 *   $VNI_29          e.g. 11408
 *   $VNI_30          e.g. 11409
 *   $VNI_31          e.g. 11410
 *   $VNI_32          e.g. 11411
 *   $VNI_33          e.g. 11412
 *   $VNI_34          e.g. 11413
 *   $VNI_35          e.g. 11414
 *   $VNI_36          e.g. 11415
 *   $VNI_37          e.g. 11416
 *   $VNI_38          e.g. 11417
 *   $VNI_39          e.g. 11418
 *   $VNI_40          e.g. 11419
 *   $VNI_41          e.g. 12500
 *   $VNI_42          e.g. 12501
 *   $VNI_43          e.g. 12502
 *   $VNI_44          e.g. 12503
 *   $VNI_45          e.g. 12504
 *   $VNI_46          e.g. 12505
 *   $VNI_47          e.g. 12506
 *   $VNI_48          e.g. 12507
 *   $VNI_49          e.g. 12508
 *   $VNI_50          e.g. 12509
 *   $VNI_51          e.g. 35000
 *   $AC_IFL_1        e.g. xe-0/0/0.0
 *   $AC_IFL_2        e.g. et-0/0/50.0
 *   $AC_IFL_3        e.g. ae1.0
 *   $LOOPBACK_V4     e.g. 192.168.252.8
 *   $BD_NAME_1       e.g. vn1400
 *   $DESCRIPTION_1   e.g. blue_all_1400
 *   $VLAN_BD_1       e.g. 1400
 *   $IRB_IFL_1       e.g. irb.1400
 *   $BD_NAME_2       e.g. vn1401
 *   $DESCRIPTION_2   e.g. blue_all_1401
 *   $VLAN_BD_2       e.g. 1401
 *   $IRB_IFL_2       e.g. irb.1401
 *   $BD_NAME_3       e.g. vn1402
 *   $DESCRIPTION_3   e.g. blue_all_1402
 *   $VLAN_BD_3       e.g. 1402
 *   $IRB_IFL_3       e.g. irb.1402
 *   $BD_NAME_4       e.g. vn1403
 *   $DESCRIPTION_4   e.g. blue_all_1403
 *   $VLAN_BD_4       e.g. 1403
 *   $IRB_IFL_4       e.g. irb.1403
 *   $BD_NAME_5       e.g. vn1404
 *   $DESCRIPTION_5   e.g. blue_all_1404
 *   $VLAN_BD_5       e.g. 1404
 *   $IRB_IFL_5       e.g. irb.1404
 *   $BD_NAME_6       e.g. vn1405
 *   $DESCRIPTION_6   e.g. blue_all_1405
 *   $VLAN_BD_6       e.g. 1405
 *   $IRB_IFL_6       e.g. irb.1405
 *   $BD_NAME_7       e.g. vn1406
 *   $DESCRIPTION_7   e.g. blue_all_1406
 *   $VLAN_BD_7       e.g. 1406
 *   $IRB_IFL_7       e.g. irb.1406
 *   $BD_NAME_8       e.g. vn1407
 *   $DESCRIPTION_8   e.g. blue_all_1407
 *   $VLAN_BD_8       e.g. 1407
 *   $IRB_IFL_8       e.g. irb.1407
 *   $BD_NAME_9       e.g. vn1408
 *   $DESCRIPTION_9   e.g. blue_all_1408
 *   $VLAN_BD_9       e.g. 1408
 *   $IRB_IFL_9       e.g. irb.1408
 *   $BD_NAME_10      e.g. vn1409
 *   $DESCRIPTION_10  e.g. blue_all_1409
 *   $VLAN_BD_10      e.g. 1409
 *   $IRB_IFL_10      e.g. irb.1409
 *   $BD_NAME_11      e.g. vn1410
 *   $DESCRIPTION_11  e.g. blue_sub_1_1410
 *   $VLAN_BD_11      e.g. 1410
 *   $IRB_IFL_11      e.g. irb.1410
 *   $BD_NAME_12      e.g. vn1411
 *   $DESCRIPTION_12  e.g. blue_sub_1_1411
 *   $VLAN_BD_12      e.g. 1411
 *   $IRB_IFL_12      e.g. irb.1411
 *   $BD_NAME_13      e.g. vn1412
 *   $DESCRIPTION_13  e.g. blue_sub_1_1412
 *   $VLAN_BD_13      e.g. 1412
 *   $IRB_IFL_13      e.g. irb.1412
 *   $BD_NAME_14      e.g. vn1413
 *   $DESCRIPTION_14  e.g. blue_sub_1_1413
 *   $VLAN_BD_14      e.g. 1413
 *   $IRB_IFL_14      e.g. irb.1413
 *   $BD_NAME_15      e.g. vn1414
 *   $DESCRIPTION_15  e.g. blue_sub_1_1414
 *   $VLAN_BD_15      e.g. 1414
 *   $IRB_IFL_15      e.g. irb.1414
 *   $BD_NAME_16      e.g. vn1415
 *   $DESCRIPTION_16  e.g. blue_sub_1_1415
 *   $VLAN_BD_16      e.g. 1415
 *   $IRB_IFL_16      e.g. irb.1415
 *   $BD_NAME_17      e.g. vn1416
 *   $DESCRIPTION_17  e.g. blue_sub_1_1416
 *   $VLAN_BD_17      e.g. 1416
 *   $IRB_IFL_17      e.g. irb.1416
 *   $BD_NAME_18      e.g. vn1417
 *   $DESCRIPTION_18  e.g. blue_sub_1_1417
 *   $VLAN_BD_18      e.g. 1417
 *   $IRB_IFL_18      e.g. irb.1417
 *   $BD_NAME_19      e.g. vn1418
 *   $DESCRIPTION_19  e.g. blue_sub_1_1418
 *   $VLAN_BD_19      e.g. 1418
 *   $IRB_IFL_19      e.g. irb.1418
 *   $BD_NAME_20      e.g. vn1419
 *   $DESCRIPTION_20  e.g. blue_sub_1_1419
 *   $VLAN_BD_20      e.g. 1419
 *   $IRB_IFL_20      e.g. irb.1419
 *   $BD_NAME_21      e.g. vn2500
 *   $DESCRIPTION_21  e.g. green_2500
 *   $VLAN_BD_21      e.g. 2500
 *   $IRB_IFL_21      e.g. irb.2500
 *   $BD_NAME_22      e.g. vn2501
 *   $DESCRIPTION_22  e.g. green_2501
 *   $VLAN_BD_22      e.g. 2501
 *   $IRB_IFL_22      e.g. irb.2501
 *   $BD_NAME_23      e.g. vn2502
 *   $DESCRIPTION_23  e.g. green_2502
 *   $VLAN_BD_23      e.g. 2502
 *   $IRB_IFL_23      e.g. irb.2502
 *   $BD_NAME_24      e.g. vn2503
 *   $DESCRIPTION_24  e.g. green_2503
 *   $VLAN_BD_24      e.g. 2503
 *   $IRB_IFL_24      e.g. irb.2503
 *   $BD_NAME_25      e.g. vn2504
 *   $DESCRIPTION_25  e.g. green_2504
 *   $VLAN_BD_25      e.g. 2504
 *   $IRB_IFL_25      e.g. irb.2504
 *   $BD_NAME_26      e.g. vn2505
 *   $DESCRIPTION_26  e.g. green_2505
 *   $VLAN_BD_26      e.g. 2505
 *   $IRB_IFL_26      e.g. irb.2505
 *   $BD_NAME_27      e.g. vn2506
 *   $DESCRIPTION_27  e.g. green_2506
 *   $VLAN_BD_27      e.g. 2506
 *   $IRB_IFL_27      e.g. irb.2506
 *   $BD_NAME_28      e.g. vn2507
 *   $DESCRIPTION_28  e.g. green_2507
 *   $VLAN_BD_28      e.g. 2507
 *   $IRB_IFL_28      e.g. irb.2507
 *   $BD_NAME_29      e.g. vn2508
 *   $DESCRIPTION_29  e.g. green_2508
 *   $VLAN_BD_29      e.g. 2508
 *   $IRB_IFL_29      e.g. irb.2508
 *   $BD_NAME_30      e.g. vn2509
 *   $DESCRIPTION_30  e.g. green_2509
 *   $VLAN_BD_30      e.g. 2509
 *   $IRB_IFL_30      e.g. irb.2509
 *   $BD_NAME_31      e.g. vn3500
 *   $DESCRIPTION_31  e.g. blue-SBD
 *   $VLAN_BD_31      e.g. 3500
 *   $IRB_IFL_31      e.g. irb.3500
 *   $BD_NAME_32      e.g. vn400
 *   $DESCRIPTION_32  e.g. red_all_400
 *   $VLAN_BD_32      e.g. 400
 *   $IRB_IFL_32      e.g. irb.400
 *   $BD_NAME_33      e.g. vn401
 *   $DESCRIPTION_33  e.g. red_all_401
 *   $VLAN_BD_33      e.g. 401
 *   $IRB_IFL_33      e.g. irb.401
 *   $BD_NAME_34      e.g. vn402
 *   $DESCRIPTION_34  e.g. red_all_402
 *   $VLAN_BD_34      e.g. 402
 *   $IRB_IFL_34      e.g. irb.402
 *   $BD_NAME_35      e.g. vn403
 *   $DESCRIPTION_35  e.g. red_all_403
 *   $VLAN_BD_35      e.g. 403
 *   $IRB_IFL_35      e.g. irb.403
 *   $BD_NAME_36      e.g. vn404
 *   $DESCRIPTION_36  e.g. red_all_404
 *   $VLAN_BD_36      e.g. 404
 *   $IRB_IFL_36      e.g. irb.404
 *   $BD_NAME_37      e.g. vn405
 *   $DESCRIPTION_37  e.g. red_all_405
 *   $VLAN_BD_37      e.g. 405
 *   $IRB_IFL_37      e.g. irb.405
 *   $BD_NAME_38      e.g. vn406
 *   $DESCRIPTION_38  e.g. red_all_406
 *   $VLAN_BD_38      e.g. 406
 *   $IRB_IFL_38      e.g. irb.406
 *   $BD_NAME_39      e.g. vn407
 *   $DESCRIPTION_39  e.g. red_all_407
 *   $VLAN_BD_39      e.g. 407
 *   $IRB_IFL_39      e.g. irb.407
 *   $BD_NAME_40      e.g. vn408
 *   $DESCRIPTION_40  e.g. red_all_408
 *   $VLAN_BD_40      e.g. 408
 *   $IRB_IFL_40      e.g. irb.408
 *   $BD_NAME_41      e.g. vn409
 *   $DESCRIPTION_41  e.g. red_all_409
 *   $VLAN_BD_41      e.g. 409
 *   $IRB_IFL_41      e.g. irb.409
 *   $BD_NAME_42      e.g. vn410
 *   $DESCRIPTION_42  e.g. red_sub_1_410
 *   $VLAN_BD_42      e.g. 410
 *   $IRB_IFL_42      e.g. irb.410
 *   $BD_NAME_43      e.g. vn411
 *   $DESCRIPTION_43  e.g. red_sub_1_411
 *   $VLAN_BD_43      e.g. 411
 *   $IRB_IFL_43      e.g. irb.411
 *   $BD_NAME_44      e.g. vn412
 *   $DESCRIPTION_44  e.g. red_sub_1_412
 *   $VLAN_BD_44      e.g. 412
 *   $IRB_IFL_44      e.g. irb.412
 *   $BD_NAME_45      e.g. vn413
 *   $DESCRIPTION_45  e.g. red_sub_1_413
 *   $VLAN_BD_45      e.g. 413
 *   $IRB_IFL_45      e.g. irb.413
 *   $BD_NAME_46      e.g. vn414
 *   $DESCRIPTION_46  e.g. red_sub_1_414
 *   $VLAN_BD_46      e.g. 414
 *   $IRB_IFL_46      e.g. irb.414
 *   $BD_NAME_47      e.g. vn415
 *   $DESCRIPTION_47  e.g. red_sub_1_415
 *   $VLAN_BD_47      e.g. 415
 *   $IRB_IFL_47      e.g. irb.415
 *   $BD_NAME_48      e.g. vn416
 *   $DESCRIPTION_48  e.g. red_sub_1_416
 *   $VLAN_BD_48      e.g. 416
 *   $IRB_IFL_48      e.g. irb.416
 *   $BD_NAME_49      e.g. vn417
 *   $DESCRIPTION_49  e.g. red_sub_1_417
 *   $VLAN_BD_49      e.g. 417
 *   $IRB_IFL_49      e.g. irb.417
 *   $BD_NAME_50      e.g. vn418
 *   $DESCRIPTION_50  e.g. red_sub_1_418
 *   $VLAN_BD_50      e.g. 418
 *   $IRB_IFL_50      e.g. irb.418
 *   $BD_NAME_51      e.g. vn419
 *   $DESCRIPTION_51  e.g. red_sub_1_419
 *   $VLAN_BD_51      e.g. 419
 *   $IRB_IFL_51      e.g. irb.419
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type mac-vrf;
        protocols {
            igmp-snooping {
                vlan all {
                    proxy;
                }
            }
            evpn {
                encapsulation vxlan;
                default-gateway no-gateway-community;
                duplicate-mac-detection {
                    auto-recovery-time 9;
                }
                extended-vni-list all;
                vni-options {
                    vni $VNI_1 {
                        vrf-target target:10400:1;
                    }
                    vni $VNI_2 {
                        vrf-target target:10401:1;
                    }
                    vni $VNI_3 {
                        vrf-target target:10402:1;
                    }
                    vni $VNI_4 {
                        vrf-target target:10403:1;
                    }
                    vni $VNI_5 {
                        vrf-target target:10404:1;
                    }
                    vni $VNI_6 {
                        vrf-target target:10405:1;
                    }
                    vni $VNI_7 {
                        vrf-target target:10406:1;
                    }
                    vni $VNI_8 {
                        vrf-target target:10407:1;
                    }
                    vni $VNI_9 {
                        vrf-target target:10408:1;
                    }
                    vni $VNI_10 {
                        vrf-target target:10409:1;
                    }
                    vni $VNI_11 {
                        vrf-target target:10410:1;
                    }
                    vni $VNI_12 {
                        vrf-target target:10411:1;
                    }
                    vni $VNI_13 {
                        vrf-target target:10412:1;
                    }
                    vni $VNI_14 {
                        vrf-target target:10413:1;
                    }
                    vni $VNI_15 {
                        vrf-target target:10414:1;
                    }
                    vni $VNI_16 {
                        vrf-target target:10415:1;
                    }
                    vni $VNI_17 {
                        vrf-target target:10416:1;
                    }
                    vni $VNI_18 {
                        vrf-target target:10417:1;
                    }
                    vni $VNI_19 {
                        vrf-target target:10418:1;
                    }
                    vni $VNI_20 {
                        vrf-target target:10419:1;
                    }
                    vni $VNI_21 {
                        vrf-target target:11400:1;
                    }
                    vni $VNI_22 {
                        vrf-target target:11401:1;
                    }
                    vni $VNI_23 {
                        vrf-target target:11402:1;
                    }
                    vni $VNI_24 {
                        vrf-target target:11403:1;
                    }
                    vni $VNI_25 {
                        vrf-target target:11404:1;
                    }
                    vni $VNI_26 {
                        vrf-target target:11405:1;
                    }
                    vni $VNI_27 {
                        vrf-target target:11406:1;
                    }
                    vni $VNI_28 {
                        vrf-target target:11407:1;
                    }
                    vni $VNI_29 {
                        vrf-target target:11408:1;
                    }
                    vni $VNI_30 {
                        vrf-target target:11409:1;
                    }
                    vni $VNI_31 {
                        vrf-target target:11410:1;
                    }
                    vni $VNI_32 {
                        vrf-target target:11411:1;
                    }
                    vni $VNI_33 {
                        vrf-target target:11412:1;
                    }
                    vni $VNI_34 {
                        vrf-target target:11413:1;
                    }
                    vni $VNI_35 {
                        vrf-target target:11414:1;
                    }
                    vni $VNI_36 {
                        vrf-target target:11415:1;
                    }
                    vni $VNI_37 {
                        vrf-target target:11416:1;
                    }
                    vni $VNI_38 {
                        vrf-target target:11417:1;
                    }
                    vni $VNI_39 {
                        vrf-target target:11418:1;
                    }
                    vni $VNI_40 {
                        vrf-target target:11419:1;
                    }
                    vni $VNI_41 {
                        vrf-target target:12500:1;
                    }
                    vni $VNI_42 {
                        vrf-target target:12501:1;
                    }
                    vni $VNI_43 {
                        vrf-target target:12502:1;
                    }
                    vni $VNI_44 {
                        vrf-target target:12503:1;
                    }
                    vni $VNI_45 {
                        vrf-target target:12504:1;
                    }
                    vni $VNI_46 {
                        vrf-target target:12505:1;
                    }
                    vni $VNI_47 {
                        vrf-target target:12506:1;
                    }
                    vni $VNI_48 {
                        vrf-target target:12507:1;
                    }
                    vni $VNI_49 {
                        vrf-target target:12508:1;
                    }
                    vni $VNI_50 {
                        vrf-target target:12509:1;
                    }
                    vni $VNI_51 {
                        vrf-target target:35000:1;
                    }
                }
            }
        }
        vtep-source-interface lo0.0;
        service-type vlan-aware;
        interface $AC_IFL_1;
        interface $AC_IFL_2;
        interface $AC_IFL_3;
        route-distinguisher $LOOPBACK_V4:65534;
        vrf-target target:100:100;
        vlans {
            $BD_NAME_1 {
                description $DESCRIPTION_1;
                vlan-id $VLAN_BD_1;
                l3-interface $IRB_IFL_1;
                vxlan {
                    vni $VNI_21;
                }
            }
            $BD_NAME_2 {
                description $DESCRIPTION_2;
                vlan-id $VLAN_BD_2;
                l3-interface $IRB_IFL_2;
                vxlan {
                    vni $VNI_22;
                }
            }
            $BD_NAME_3 {
                description $DESCRIPTION_3;
                vlan-id $VLAN_BD_3;
                l3-interface $IRB_IFL_3;
                vxlan {
                    vni $VNI_23;
                }
            }
            $BD_NAME_4 {
                description $DESCRIPTION_4;
                vlan-id $VLAN_BD_4;
                l3-interface $IRB_IFL_4;
                vxlan {
                    vni $VNI_24;
                }
            }
            $BD_NAME_5 {
                description $DESCRIPTION_5;
                vlan-id $VLAN_BD_5;
                l3-interface $IRB_IFL_5;
                vxlan {
                    vni $VNI_25;
                }
            }
            $BD_NAME_6 {
                description $DESCRIPTION_6;
                vlan-id $VLAN_BD_6;
                l3-interface $IRB_IFL_6;
                vxlan {
                    vni $VNI_26;
                }
            }
            $BD_NAME_7 {
                description $DESCRIPTION_7;
                vlan-id $VLAN_BD_7;
                l3-interface $IRB_IFL_7;
                vxlan {
                    vni $VNI_27;
                }
            }
            $BD_NAME_8 {
                description $DESCRIPTION_8;
                vlan-id $VLAN_BD_8;
                l3-interface $IRB_IFL_8;
                vxlan {
                    vni $VNI_28;
                }
            }
            $BD_NAME_9 {
                description $DESCRIPTION_9;
                vlan-id $VLAN_BD_9;
                l3-interface $IRB_IFL_9;
                vxlan {
                    vni $VNI_29;
                }
            }
            $BD_NAME_10 {
                description $DESCRIPTION_10;
                vlan-id $VLAN_BD_10;
                l3-interface $IRB_IFL_10;
                vxlan {
                    vni $VNI_30;
                }
            }
            $BD_NAME_11 {
                description $DESCRIPTION_11;
                vlan-id $VLAN_BD_11;
                l3-interface $IRB_IFL_11;
                vxlan {
                    vni $VNI_31;
                }
            }
            $BD_NAME_12 {
                description $DESCRIPTION_12;
                vlan-id $VLAN_BD_12;
                l3-interface $IRB_IFL_12;
                vxlan {
                    vni $VNI_32;
                }
            }
            $BD_NAME_13 {
                description $DESCRIPTION_13;
                vlan-id $VLAN_BD_13;
                l3-interface $IRB_IFL_13;
                vxlan {
                    vni $VNI_33;
                }
            }
            $BD_NAME_14 {
                description $DESCRIPTION_14;
                vlan-id $VLAN_BD_14;
                l3-interface $IRB_IFL_14;
                vxlan {
                    vni $VNI_34;
                }
            }
            $BD_NAME_15 {
                description $DESCRIPTION_15;
                vlan-id $VLAN_BD_15;
                l3-interface $IRB_IFL_15;
                vxlan {
                    vni $VNI_35;
                }
            }
            $BD_NAME_16 {
                description $DESCRIPTION_16;
                vlan-id $VLAN_BD_16;
                l3-interface $IRB_IFL_16;
                vxlan {
                    vni $VNI_36;
                }
            }
            $BD_NAME_17 {
                description $DESCRIPTION_17;
                vlan-id $VLAN_BD_17;
                l3-interface $IRB_IFL_17;
                vxlan {
                    vni $VNI_37;
                }
            }
            $BD_NAME_18 {
                description $DESCRIPTION_18;
                vlan-id $VLAN_BD_18;
                l3-interface $IRB_IFL_18;
                vxlan {
                    vni $VNI_38;
                }
            }
            $BD_NAME_19 {
                description $DESCRIPTION_19;
                vlan-id $VLAN_BD_19;
                l3-interface $IRB_IFL_19;
                vxlan {
                    vni $VNI_39;
                }
            }
            $BD_NAME_20 {
                description $DESCRIPTION_20;
                vlan-id $VLAN_BD_20;
                l3-interface $IRB_IFL_20;
                vxlan {
                    vni $VNI_40;
                }
            }
            $BD_NAME_21 {
                description $DESCRIPTION_21;
                vlan-id $VLAN_BD_21;
                l3-interface $IRB_IFL_21;
                vxlan {
                    vni $VNI_41;
                }
            }
            $BD_NAME_22 {
                description $DESCRIPTION_22;
                vlan-id $VLAN_BD_22;
                l3-interface $IRB_IFL_22;
                vxlan {
                    vni $VNI_42;
                }
            }
            $BD_NAME_23 {
                description $DESCRIPTION_23;
                vlan-id $VLAN_BD_23;
                l3-interface $IRB_IFL_23;
                vxlan {
                    vni $VNI_43;
                }
            }
            $BD_NAME_24 {
                description $DESCRIPTION_24;
                vlan-id $VLAN_BD_24;
                l3-interface $IRB_IFL_24;
                vxlan {
                    vni $VNI_44;
                }
            }
            $BD_NAME_25 {
                description $DESCRIPTION_25;
                vlan-id $VLAN_BD_25;
                l3-interface $IRB_IFL_25;
                vxlan {
                    vni $VNI_45;
                }
            }
            $BD_NAME_26 {
                description $DESCRIPTION_26;
                vlan-id $VLAN_BD_26;
                l3-interface $IRB_IFL_26;
                vxlan {
                    vni $VNI_46;
                }
            }
            $BD_NAME_27 {
                description $DESCRIPTION_27;
                vlan-id $VLAN_BD_27;
                l3-interface $IRB_IFL_27;
                vxlan {
                    vni $VNI_47;
                }
            }
            $BD_NAME_28 {
                description $DESCRIPTION_28;
                vlan-id $VLAN_BD_28;
                l3-interface $IRB_IFL_28;
                vxlan {
                    vni $VNI_48;
                }
            }
            $BD_NAME_29 {
                description $DESCRIPTION_29;
                vlan-id $VLAN_BD_29;
                l3-interface $IRB_IFL_29;
                vxlan {
                    vni $VNI_49;
                }
            }
            $BD_NAME_30 {
                description $DESCRIPTION_30;
                vlan-id $VLAN_BD_30;
                l3-interface $IRB_IFL_30;
                vxlan {
                    vni $VNI_50;
                }
            }
            $BD_NAME_31 {
                description $DESCRIPTION_31;
                vlan-id $VLAN_BD_31;
                l3-interface $IRB_IFL_31;
                vxlan {
                    vni $VNI_51;
                }
            }
            $BD_NAME_32 {
                description $DESCRIPTION_32;
                vlan-id $VLAN_BD_32;
                l3-interface $IRB_IFL_32;
                vxlan {
                    vni $VNI_1;
                }
            }
            $BD_NAME_33 {
                description $DESCRIPTION_33;
                vlan-id $VLAN_BD_33;
                l3-interface $IRB_IFL_33;
                vxlan {
                    vni $VNI_2;
                }
            }
            $BD_NAME_34 {
                description $DESCRIPTION_34;
                vlan-id $VLAN_BD_34;
                l3-interface $IRB_IFL_34;
                vxlan {
                    vni $VNI_3;
                }
            }
            $BD_NAME_35 {
                description $DESCRIPTION_35;
                vlan-id $VLAN_BD_35;
                l3-interface $IRB_IFL_35;
                vxlan {
                    vni $VNI_4;
                }
            }
            $BD_NAME_36 {
                description $DESCRIPTION_36;
                vlan-id $VLAN_BD_36;
                l3-interface $IRB_IFL_36;
                vxlan {
                    vni $VNI_5;
                }
            }
            $BD_NAME_37 {
                description $DESCRIPTION_37;
                vlan-id $VLAN_BD_37;
                l3-interface $IRB_IFL_37;
                vxlan {
                    vni $VNI_6;
                }
            }
            $BD_NAME_38 {
                description $DESCRIPTION_38;
                vlan-id $VLAN_BD_38;
                l3-interface $IRB_IFL_38;
                vxlan {
                    vni $VNI_7;
                }
            }
            $BD_NAME_39 {
                description $DESCRIPTION_39;
                vlan-id $VLAN_BD_39;
                l3-interface $IRB_IFL_39;
                vxlan {
                    vni $VNI_8;
                }
            }
            $BD_NAME_40 {
                description $DESCRIPTION_40;
                vlan-id $VLAN_BD_40;
                l3-interface $IRB_IFL_40;
                vxlan {
                    vni $VNI_9;
                }
            }
            $BD_NAME_41 {
                description $DESCRIPTION_41;
                vlan-id $VLAN_BD_41;
                l3-interface $IRB_IFL_41;
                vxlan {
                    vni $VNI_10;
                }
            }
            $BD_NAME_42 {
                description $DESCRIPTION_42;
                vlan-id $VLAN_BD_42;
                l3-interface $IRB_IFL_42;
                vxlan {
                    vni $VNI_11;
                }
            }
            $BD_NAME_43 {
                description $DESCRIPTION_43;
                vlan-id $VLAN_BD_43;
                l3-interface $IRB_IFL_43;
                vxlan {
                    vni $VNI_12;
                }
            }
            $BD_NAME_44 {
                description $DESCRIPTION_44;
                vlan-id $VLAN_BD_44;
                l3-interface $IRB_IFL_44;
                vxlan {
                    vni $VNI_13;
                }
            }
            $BD_NAME_45 {
                description $DESCRIPTION_45;
                vlan-id $VLAN_BD_45;
                l3-interface $IRB_IFL_45;
                vxlan {
                    vni $VNI_14;
                }
            }
            $BD_NAME_46 {
                description $DESCRIPTION_46;
                vlan-id $VLAN_BD_46;
                l3-interface $IRB_IFL_46;
                vxlan {
                    vni $VNI_15;
                }
            }
            $BD_NAME_47 {
                description $DESCRIPTION_47;
                vlan-id $VLAN_BD_47;
                l3-interface $IRB_IFL_47;
                vxlan {
                    vni $VNI_16;
                }
            }
            $BD_NAME_48 {
                description $DESCRIPTION_48;
                vlan-id $VLAN_BD_48;
                l3-interface $IRB_IFL_48;
                vxlan {
                    vni $VNI_17;
                }
            }
            $BD_NAME_49 {
                description $DESCRIPTION_49;
                vlan-id $VLAN_BD_49;
                l3-interface $IRB_IFL_49;
                vxlan {
                    vni $VNI_18;
                }
            }
            $BD_NAME_50 {
                description $DESCRIPTION_50;
                vlan-id $VLAN_BD_50;
                l3-interface $IRB_IFL_50;
                vxlan {
                    vni $VNI_19;
                }
            }
            $BD_NAME_51 {
                description $DESCRIPTION_51;
                vlan-id $VLAN_BD_51;
                l3-interface $IRB_IFL_51;
                vxlan {
                    vni $VNI_20;
                }
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL_1`, `$AC_IFL_2`, `$AC_IFL_3`, `$IRB_IFL_1`, `$IRB_IFL_2`, `$IRB_IFL_3`, `$IRB_IFL_4`, `$IRB_IFL_5`, `$IRB_IFL_6`, `$IRB_IFL_7`, `$IRB_IFL_8`, `$IRB_IFL_9`, `$IRB_IFL_10`, `$IRB_IFL_11`, `$IRB_IFL_12`, `$IRB_IFL_13`, `$IRB_IFL_14`, `$IRB_IFL_15`, `$IRB_IFL_16`, `$IRB_IFL_17`, `$IRB_IFL_18`, `$IRB_IFL_19`, `$IRB_IFL_20`, `$IRB_IFL_21`, `$IRB_IFL_22`, `$IRB_IFL_23`, `$IRB_IFL_24`, `$IRB_IFL_25`, `$IRB_IFL_26`, `$IRB_IFL_27`, `$IRB_IFL_28`, `$IRB_IFL_29`, `$IRB_IFL_30`, `$IRB_IFL_31`, `$IRB_IFL_32`, `$IRB_IFL_33`, `$IRB_IFL_34`, `$IRB_IFL_35`, `$IRB_IFL_36`, `$IRB_IFL_37`, `$IRB_IFL_38`, `$IRB_IFL_39`, `$IRB_IFL_40`, `$IRB_IFL_41`, `$IRB_IFL_42`, `$IRB_IFL_43`, `$IRB_IFL_44`, `$IRB_IFL_45`, `$IRB_IFL_46`, `$IRB_IFL_47`, `$IRB_IFL_48`, `$IRB_IFL_49`, `$IRB_IFL_50`, `$IRB_IFL_51`): required, for each reference; one of `interfaces/ifl-ethernet-switching-trunk-vlans-filter-storm-control`, `interfaces/ifl-ethernet-switching-trunk-vlans`, `interfaces/irb-inet-inet6-mtu-9000-mac-no-dhcp-flood`, `interfaces/irb-inet-inet6-mtu-9000-mac`, `interfaces/irb-inet-virtual-gateway-mtu-9000`

## junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-10-irb.conf

```
/*
 * Topic: EVPN Type 5 VRF with ten IRB units, a loopback unit and DHCP relay
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $INSTANCE_NAME         e.g. green
 *   $VNI                   e.g. 20003
 *   $IP_PREFIX_EXPORT_POL  e.g. BGP-AOS-Policy-green
 *   $DHCP_RELAY_GROUP      e.g. green
 *   $IRB_IFL_1             e.g. irb.2500
 *   $LOOPBACK_IFL          e.g. lo0.4
 *   $IRB_IFL_2             e.g. irb.2501
 *   $IRB_IFL_3             e.g. irb.2502
 *   $IRB_IFL_4             e.g. irb.2503
 *   $IRB_IFL_5             e.g. irb.2504
 *   $IRB_IFL_6             e.g. irb.2505
 *   $IRB_IFL_7             e.g. irb.2506
 *   $IRB_IFL_8             e.g. irb.2507
 *   $IRB_IFL_9             e.g. irb.2508
 *   $IRB_IFL_10            e.g. irb.2509
 *   $LOOPBACK_V4           e.g. 192.168.252.8
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
        forwarding-options {
            dhcp-relay {
                forward-only;
                server-group {
                    green {
                        10.25.0.200;
                    }
                }
                group $DHCP_RELAY_GROUP {
                    active-server-group green;
                    relay-option-82 {
                        server-id-override;
                    }
                    interface $IRB_IFL_1 {
                        overrides {
                            relay-source $LOOPBACK_IFL;
                        }
                    }
                }
            }
        }
        interface $IRB_IFL_1;
        interface $IRB_IFL_2;
        interface $IRB_IFL_3;
        interface $IRB_IFL_4;
        interface $IRB_IFL_5;
        interface $IRB_IFL_6;
        interface $IRB_IFL_7;
        interface $IRB_IFL_8;
        interface $IRB_IFL_9;
        interface $IRB_IFL_10;
        interface $LOOPBACK_IFL;
        route-distinguisher $LOOPBACK_V4:4;
        vrf-target target:20003:1;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `irb-service`: required, all related; one of `routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-proxy-2-ac`, `routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-proxy-3-ac`, `routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-10-irb`, `routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb`, `routing-instances/l3vpn/ri-vrf-evpn-type-5-ospf-pim-oism-dhcp-relay`
- `logical-interface` (`$IRB_IFL_1`, `$IRB_IFL_2`, `$IRB_IFL_3`, `$IRB_IFL_4`, `$IRB_IFL_5`, `$IRB_IFL_6`, `$IRB_IFL_7`, `$IRB_IFL_8`, `$IRB_IFL_9`, `$IRB_IFL_10`, `$LOOPBACK_IFL`): required, for each reference; one of `interfaces/ifl-loopback-inet-inet6`, `interfaces/irb-inet-inet6-mtu-9000-mac-no-dhcp-flood`, `interfaces/irb-inet-inet6-mtu-9000-mac`
- `policy-statement` (`$IP_PREFIX_EXPORT_POL`): required, for each reference; `policy-options/policy-statement/ps-from-policy-evpn-host-routes-community-add-reject`

## junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb.conf

```
/*
 * Topic: EVPN Type 5 VRF with twenty IRB units, a loopback unit and DHCP relay
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $INSTANCE_NAME         e.g. red
 *   $VNI                   e.g. 20001
 *   $IP_PREFIX_EXPORT_POL  e.g. BGP-AOS-Policy-red
 *   $DHCP_RELAY_GROUP      e.g. red
 *   $IRB_IFL_1             e.g. irb.400
 *   $LOOPBACK_IFL          e.g. lo0.2
 *   $IRB_IFL_2             e.g. irb.401
 *   $IRB_IFL_3             e.g. irb.402
 *   $IRB_IFL_4             e.g. irb.403
 *   $IRB_IFL_5             e.g. irb.404
 *   $IRB_IFL_6             e.g. irb.405
 *   $IRB_IFL_7             e.g. irb.406
 *   $IRB_IFL_8             e.g. irb.407
 *   $IRB_IFL_9             e.g. irb.408
 *   $IRB_IFL_10            e.g. irb.409
 *   $IRB_IFL_11            e.g. irb.410
 *   $IRB_IFL_12            e.g. irb.411
 *   $IRB_IFL_13            e.g. irb.412
 *   $IRB_IFL_14            e.g. irb.413
 *   $IRB_IFL_15            e.g. irb.414
 *   $IRB_IFL_16            e.g. irb.415
 *   $IRB_IFL_17            e.g. irb.416
 *   $IRB_IFL_18            e.g. irb.417
 *   $IRB_IFL_19            e.g. irb.418
 *   $IRB_IFL_20            e.g. irb.419
 *   $LOOPBACK_V4           e.g. 192.168.252.8
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
        forwarding-options {
            dhcp-relay {
                forward-only;
                server-group {
                    red {
                        192.168.37.100;
                    }
                }
                group $DHCP_RELAY_GROUP {
                    active-server-group red;
                    relay-option-82 {
                        server-id-override;
                    }
                    interface $IRB_IFL_1 {
                        overrides {
                            relay-source $LOOPBACK_IFL;
                        }
                    }
                }
            }
        }
        interface $IRB_IFL_1;
        interface $IRB_IFL_2;
        interface $IRB_IFL_3;
        interface $IRB_IFL_4;
        interface $IRB_IFL_5;
        interface $IRB_IFL_6;
        interface $IRB_IFL_7;
        interface $IRB_IFL_8;
        interface $IRB_IFL_9;
        interface $IRB_IFL_10;
        interface $IRB_IFL_11;
        interface $IRB_IFL_12;
        interface $IRB_IFL_13;
        interface $IRB_IFL_14;
        interface $IRB_IFL_15;
        interface $IRB_IFL_16;
        interface $IRB_IFL_17;
        interface $IRB_IFL_18;
        interface $IRB_IFL_19;
        interface $IRB_IFL_20;
        interface $LOOPBACK_IFL;
        route-distinguisher $LOOPBACK_V4:2;
        vrf-target target:20001:1;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `irb-service`: required, all related; one of `routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-proxy-2-ac`, `routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-proxy-3-ac`, `routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-10-irb`, `routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb`, `routing-instances/l3vpn/ri-vrf-evpn-type-5-ospf-pim-oism-dhcp-relay`
- `logical-interface` (`$IRB_IFL_1`, `$IRB_IFL_2`, `$IRB_IFL_3`, `$IRB_IFL_4`, `$IRB_IFL_5`, `$IRB_IFL_6`, `$IRB_IFL_7`, `$IRB_IFL_8`, `$IRB_IFL_9`, `$IRB_IFL_10`, `$IRB_IFL_11`, `$IRB_IFL_12`, `$IRB_IFL_13`, `$IRB_IFL_14`, `$IRB_IFL_15`, `$IRB_IFL_16`, `$IRB_IFL_17`, `$IRB_IFL_18`, `$IRB_IFL_19`, `$IRB_IFL_20`, `$LOOPBACK_IFL`): required, for each reference; one of `interfaces/ifl-loopback-inet-inet6`, `interfaces/irb-inet-inet6-mtu-9000-mac-no-dhcp-flood`, `interfaces/irb-inet-inet6-mtu-9000-mac`
- `policy-statement` (`$IP_PREFIX_EXPORT_POL`): required, for each reference; `policy-options/policy-statement/ps-from-policy-evpn-host-routes-community-add-reject`

## junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-ospf-pim-oism-dhcp-relay.conf

```
/*
 * Topic: EVPN Type 5 VRF with OSPF and PIM on its IRB and loopback units, OISM with a supplemental bridge domain, and DHCP relay
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $INSTANCE_NAME         e.g. blue
 *   $VNI                   e.g. 20002
 *   $IP_PREFIX_EXPORT_POL  e.g. BGP-AOS-Policy-blue
 *   $IRB_IFL_1             e.g. irb.3500
 *   $LOOPBACK_IFL          e.g. lo0.3
 *   $DHCP_RELAY_GROUP      e.g. blue
 *   $IRB_IFL_2             e.g. irb.1400
 *   $IRB_IFL_3             e.g. irb.1401
 *   $IRB_IFL_4             e.g. irb.1402
 *   $IRB_IFL_5             e.g. irb.1403
 *   $IRB_IFL_6             e.g. irb.1404
 *   $IRB_IFL_7             e.g. irb.1405
 *   $IRB_IFL_8             e.g. irb.1406
 *   $IRB_IFL_9             e.g. irb.1407
 *   $IRB_IFL_10            e.g. irb.1408
 *   $IRB_IFL_11            e.g. irb.1409
 *   $IRB_IFL_12            e.g. irb.1410
 *   $IRB_IFL_13            e.g. irb.1411
 *   $IRB_IFL_14            e.g. irb.1412
 *   $IRB_IFL_15            e.g. irb.1413
 *   $IRB_IFL_16            e.g. irb.1414
 *   $IRB_IFL_17            e.g. irb.1415
 *   $IRB_IFL_18            e.g. irb.1416
 *   $IRB_IFL_19            e.g. irb.1417
 *   $IRB_IFL_20            e.g. irb.1418
 *   $IRB_IFL_21            e.g. irb.1419
 *   $LOOPBACK_V4           e.g. 192.168.252.8
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
                oism {
                    supplemental-bridge-domain-irb $IRB_IFL_1;
                }
            }
            ospf {
                area 0.0.0.0 {
                    interface $LOOPBACK_IFL;
                    interface $IRB_IFL_1;
                    interface all {
                        passive;
                    }
                }
            }
            pim {
                passive;
                interface all;
                interface $IRB_IFL_1 {
                    accept-remote-source;
                }
            }
        }
        forwarding-options {
            dhcp-relay {
                forward-only;
                server-group {
                    blue {
                        10.10.0.200;
                    }
                }
                group $DHCP_RELAY_GROUP {
                    active-server-group blue;
                    relay-option-82 {
                        server-id-override;
                    }
                    interface $IRB_IFL_2 {
                        overrides {
                            relay-source $LOOPBACK_IFL;
                        }
                    }
                }
            }
        }
        interface $IRB_IFL_2;
        interface $IRB_IFL_3;
        interface $IRB_IFL_4;
        interface $IRB_IFL_5;
        interface $IRB_IFL_6;
        interface $IRB_IFL_7;
        interface $IRB_IFL_8;
        interface $IRB_IFL_9;
        interface $IRB_IFL_10;
        interface $IRB_IFL_11;
        interface $IRB_IFL_12;
        interface $IRB_IFL_13;
        interface $IRB_IFL_14;
        interface $IRB_IFL_15;
        interface $IRB_IFL_16;
        interface $IRB_IFL_17;
        interface $IRB_IFL_18;
        interface $IRB_IFL_19;
        interface $IRB_IFL_20;
        interface $IRB_IFL_21;
        interface $IRB_IFL_1;
        interface $LOOPBACK_IFL;
        route-distinguisher $LOOPBACK_V4:3;
        vrf-target target:20002:1;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `irb-service`: required, all related; one of `routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-proxy-2-ac`, `routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-proxy-3-ac`, `routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-10-irb`, `routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb`, `routing-instances/l3vpn/ri-vrf-evpn-type-5-ospf-pim-oism-dhcp-relay`
- `logical-interface` (`$IRB_IFL_2`, `$IRB_IFL_3`, `$IRB_IFL_4`, `$IRB_IFL_5`, `$IRB_IFL_6`, `$IRB_IFL_7`, `$IRB_IFL_8`, `$IRB_IFL_9`, `$IRB_IFL_10`, `$IRB_IFL_11`, `$IRB_IFL_12`, `$IRB_IFL_13`, `$IRB_IFL_14`, `$IRB_IFL_15`, `$IRB_IFL_16`, `$IRB_IFL_17`, `$IRB_IFL_18`, `$IRB_IFL_19`, `$IRB_IFL_20`, `$IRB_IFL_21`, `$IRB_IFL_1`, `$LOOPBACK_IFL`): required, for each reference; one of `interfaces/ifl-loopback-inet-inet6`, `interfaces/irb-inet-inet6-mtu-9000-mac-no-dhcp-flood`, `interfaces/irb-inet-inet6-mtu-9000-mac`, `interfaces/irb-inet-virtual-gateway-mtu-9000`
- `policy-statement` (`$IP_PREFIX_EXPORT_POL`): required, for each reference; `policy-options/policy-statement/ps-from-policy-evpn-host-routes-community-add-reject`

## junos/routing-options/autonomous-system.conf

```
/*
 * Topic: Device autonomous-system number
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c external-gw_mx services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   external-gw_mx 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 7
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $ASN  e.g. 64704
 */
routing-options {
  autonomous-system $ASN;
}
```

## junos/routing-options/forwarding-table-pplb-ecmp-fast-reroute-chained-nh-evpn.conf

```
/*
 * Topic: Forwarding-table export of the per-packet load-balancing policy, with ECMP fast reroute and ingress chained composite next hops for EVPN
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
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

## junos/routing-options/forwarding-table-pplb-ecmp-fast-reroute.conf

```
/*
 * Topic: Forwarding-table per-packet load balancing with ECMP fast reroute
 * Seen on:
 *   Junos: compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-spine1_qfx5210-64c):
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

## junos/routing-options/graceful-restart.conf

```
/*
 * Topic: Graceful restart
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    graceful-restart;
}
```

## junos/routing-options/rib-inet6-static-default-discard.conf

```
/*
 * Topic: IPv6 static default route to discard
 * Seen on:
 *   Junos: external-gw_mx
 *   EVO: (none)
 * Count:
 *   external-gw_mx 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    rib inet6.0 {
        static {
            route ::/0 discard;
        }
    }
}
```

## junos/routing-options/route-distinguisher-id.conf

```
/*
 * Topic: Automatic Route Distinguisher seed
 * Seen on:
 *   Junos: external-gw_mx
 *   EVO: (none)
 * Count:
 *   external-gw_mx 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from external-gw_mx):
 *   $RD_SEED_AUTO  e.g. 100.100.100.100
 */
routing-options {
    route-distinguisher-id $RD_SEED_AUTO;
}
```

## junos/routing-options/router-id.conf

```
/*
 * Topic: Transport router identity
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $ROUTER_ID  e.g. 192.168.252.8
 */
routing-options {
    router-id $ROUTER_ID;
}
```

## junos/routing-options/static-default-discard.conf

```
/*
 * Topic: Static default route to discard
 * Seen on:
 *   Junos: external-gw_mx
 *   EVO: (none)
 * Count:
 *   external-gw_mx 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    static {
        route 0.0.0.0/0 discard;
    }
}
```

## junos/system/host-name.conf

```
/*
 * Topic: System host name
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
 * Pair with: none
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $HOST_NAME  e.g. leaf001-001-1
 */
system {
    host-name $HOST_NAME;
}
```

## junos/system/management-instance.conf

```
/*
 * Topic: Dedicated management routing instance (mgmt_junos) for the management interface and services
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
 * Pair with: none
 * Variables: none
 */
system {
    management-instance;
}
```

## junos/system/ports-console-log-out.conf

```
/*
 * Topic: Console log-out on disconnect
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c external-gw_mx services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   external-gw_mx 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 7
 * Pair with: none
 * Variables: none
 */
system {
    ports {
        console log-out-on-disconnect;
    }
}
```

## junos/system/services-netconf-ssh-root-login-grpc-ssl-local-certificate-mgmt-junos.conf

```
/*
 * Topic: NETCONF and SSH with root login, and the gRPC request-response extension service over SSL in the management instance, using a local certificate
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym compute-spine1_qfx5210-64c compute-spine2_qfx5210-64c services-spine1_qfx5210-64c services-spine2_qfx5210-64c
 *   EVO: (none)
 * Count:
 *   compute-leaf1_qfx5120-48ym 1
 *   compute-leaf2_qfx5120-48ym 1
 *   compute-spine1_qfx5210-64c 1
 *   compute-spine2_qfx5210-64c 1
 *   services-spine1_qfx5210-64c 1
 *   services-spine2_qfx5210-64c 1
 *   total 6
 * Pair with: none
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $GRPC_PORT   e.g. 32767
 *   $LOCAL_CERT  e.g. aos_grpc
 */
system {
    services {
        netconf {
            ssh;
        }
        ssh {
            root-login allow;
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

All `.conf` files under `junos/` and `evo/` are templates: identifiers that vary between deployments are written
as `$VAR`. Render a snippet by substituting each placeholder with your deployment's value. The placeholders each
snippet uses are listed in its `Variables:` header and in the glossary below. Variable names and meanings follow
the shared JVD snippet vocabulary. Numbered variables (`_1`, `_2`, …) form an ordered set; the numbers carry no
other meaning.

Values left literal on purpose: the tier communities `FROM_SPINE_FABRIC_TIER`, `FROM_SPINE_EVPN_TIER`,
`FROM_SUPERSPINE_FABRIC_TIER`, `FROM_SUPERSPINE_EVPN_TIER` and `FABRIC_COMMUNITIES`, which the tier policies
reference by name; the Routing Engine protection objects (filter `cpp-filter-v1`, policer `police-5mbps`, filter
`ALLOWED_FROM_HOST` and the prefix lists `bgp-sources`, `ntp-sources`, `snmp-sources` and `ssh-sources`); the
class-of-service model (forwarding classes, DSCP classifiers, rewrite rule `rw1`, schedulers, scheduler map `sm1`,
drop profiles, congestion notification profile `cnp`, buffer partitions and code points); the storm-control
profile `profile1`; the MTUs, the BFD timers, the port speeds and breakouts, the router-advertisement intervals,
the hash and dynamic load-balancing parameters, the management instance `mgmt_junos`, `unit 0`, and the loopback
`lo0`.

## System

| Variable | What it is | Example value |
|---|---|---|
| `$FPC_SLOT` | FPC slot number. | `0` |
| `$GRPC_PORT` | TCP port of the gRPC request-response extension service over SSL. | `32767` |
| `$HOST_NAME` | System host name. | `leaf003-001-1` |
| `$LOCAL_CERT` | Name of a local certificate (`security certificates local`), as defined and as referenced by `local-certificate`. | `aos_grpc` |
| `$TS_FPC` | FPC slot that hosts tunnel services. | `0` |
| `$TS_PIC` | PIC slot that hosts tunnel services. | `0` |

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `64708` |
| `$LOOPBACK_V4` | Primary per-node IPv4 loopback address. | `192.168.252.12` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on a loopback unit. | `192.168.252.12/32` |
| `$LOOPBACK_V6_PFX` | IPv6 address with prefix length on a loopback unit. | `fdf6:ed70:1fac:f2d1::100c/128` |
| `$ROUTER_ID` | Complete router identifier in IPv4 dotted-decimal form. | `192.168.252.12` |

## MAC-VRFs and VLANs

| Variable | What it is | Example value |
|---|---|---|
| `$BD_NAME_1` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn400` |
| `$BD_NAME_10` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn409` |
| `$BD_NAME_11` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn430` |
| `$BD_NAME_12` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn431` |
| `$BD_NAME_13` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn432` |
| `$BD_NAME_14` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn433` |
| `$BD_NAME_15` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn434` |
| `$BD_NAME_16` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn435` |
| `$BD_NAME_17` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn436` |
| `$BD_NAME_18` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn437` |
| `$BD_NAME_19` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn438` |
| `$BD_NAME_2` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn401` |
| `$BD_NAME_20` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn439` |
| `$BD_NAME_21` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1400` |
| `$BD_NAME_22` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1401` |
| `$BD_NAME_23` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1402` |
| `$BD_NAME_24` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1403` |
| `$BD_NAME_25` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1404` |
| `$BD_NAME_26` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1405` |
| `$BD_NAME_27` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1406` |
| `$BD_NAME_28` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1407` |
| `$BD_NAME_29` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1408` |
| `$BD_NAME_3` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn402` |
| `$BD_NAME_30` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1409` |
| `$BD_NAME_31` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1430` |
| `$BD_NAME_32` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1431` |
| `$BD_NAME_33` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1432` |
| `$BD_NAME_34` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1433` |
| `$BD_NAME_35` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1434` |
| `$BD_NAME_36` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1435` |
| `$BD_NAME_37` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1436` |
| `$BD_NAME_38` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1437` |
| `$BD_NAME_39` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1438` |
| `$BD_NAME_4` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn403` |
| `$BD_NAME_40` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn1439` |
| `$BD_NAME_41` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn3100` |
| `$BD_NAME_42` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn3101` |
| `$BD_NAME_43` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn3102` |
| `$BD_NAME_44` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn3103` |
| `$BD_NAME_45` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn3104` |
| `$BD_NAME_46` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn3105` |
| `$BD_NAME_47` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn3106` |
| `$BD_NAME_48` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn3107` |
| `$BD_NAME_49` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn3108` |
| `$BD_NAME_5` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn404` |
| `$BD_NAME_50` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn3109` |
| `$BD_NAME_51` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn439` |
| `$BD_NAME_6` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn405` |
| `$BD_NAME_7` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn406` |
| `$BD_NAME_8` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn407` |
| `$BD_NAME_9` | Name of a VLAN in the MAC-VRF; `_1`, `_2`, … number the VLANs in source order (also the trunk members). | `vn408` |
| `$VLAN_BD_1` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1400` |
| `$VLAN_BD_10` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1409` |
| `$VLAN_BD_11` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1430` |
| `$VLAN_BD_12` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1431` |
| `$VLAN_BD_13` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1432` |
| `$VLAN_BD_14` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1433` |
| `$VLAN_BD_15` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1434` |
| `$VLAN_BD_16` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1435` |
| `$VLAN_BD_17` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1436` |
| `$VLAN_BD_18` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1437` |
| `$VLAN_BD_19` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1438` |
| `$VLAN_BD_2` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1401` |
| `$VLAN_BD_20` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1439` |
| `$VLAN_BD_21` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3100` |
| `$VLAN_BD_22` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3101` |
| `$VLAN_BD_23` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3102` |
| `$VLAN_BD_24` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3103` |
| `$VLAN_BD_25` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3104` |
| `$VLAN_BD_26` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3105` |
| `$VLAN_BD_27` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3106` |
| `$VLAN_BD_28` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3107` |
| `$VLAN_BD_29` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3108` |
| `$VLAN_BD_3` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1402` |
| `$VLAN_BD_30` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3109` |
| `$VLAN_BD_31` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `3500` |
| `$VLAN_BD_32` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `400` |
| `$VLAN_BD_33` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `401` |
| `$VLAN_BD_34` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `402` |
| `$VLAN_BD_35` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `403` |
| `$VLAN_BD_36` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `404` |
| `$VLAN_BD_37` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `405` |
| `$VLAN_BD_38` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `406` |
| `$VLAN_BD_39` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `407` |
| `$VLAN_BD_4` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1403` |
| `$VLAN_BD_40` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `408` |
| `$VLAN_BD_41` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `409` |
| `$VLAN_BD_42` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `430` |
| `$VLAN_BD_43` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `431` |
| `$VLAN_BD_44` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `432` |
| `$VLAN_BD_45` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `433` |
| `$VLAN_BD_46` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `434` |
| `$VLAN_BD_47` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `435` |
| `$VLAN_BD_48` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `436` |
| `$VLAN_BD_49` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `437` |
| `$VLAN_BD_5` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1404` |
| `$VLAN_BD_50` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `438` |
| `$VLAN_BD_51` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `439` |
| `$VLAN_BD_6` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1405` |
| `$VLAN_BD_7` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1406` |
| `$VLAN_BD_8` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1407` |
| `$VLAN_BD_9` | VLAN identifier (`vlan-id`) of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `1408` |
| `$VNI` | VXLAN network identifier (VNI) of a VLAN, bridge domain or EVPN Type 5 routing instance. | `20004` |
| `$VNI_1` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10400` |
| `$VNI_10` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10409` |
| `$VNI_11` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10430` |
| `$VNI_12` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10431` |
| `$VNI_13` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10432` |
| `$VNI_14` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10433` |
| `$VNI_15` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10434` |
| `$VNI_16` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10435` |
| `$VNI_17` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10436` |
| `$VNI_18` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10437` |
| `$VNI_19` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10438` |
| `$VNI_2` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10401` |
| `$VNI_20` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10439` |
| `$VNI_21` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11400` |
| `$VNI_22` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11401` |
| `$VNI_23` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11402` |
| `$VNI_24` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11403` |
| `$VNI_25` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11404` |
| `$VNI_26` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11405` |
| `$VNI_27` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11406` |
| `$VNI_28` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11407` |
| `$VNI_29` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11408` |
| `$VNI_3` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10402` |
| `$VNI_30` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11409` |
| `$VNI_31` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11430` |
| `$VNI_32` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11431` |
| `$VNI_33` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11432` |
| `$VNI_34` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11433` |
| `$VNI_35` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11434` |
| `$VNI_36` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11435` |
| `$VNI_37` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11436` |
| `$VNI_38` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11437` |
| `$VNI_39` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11438` |
| `$VNI_4` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10403` |
| `$VNI_40` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `11439` |
| `$VNI_41` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `13100` |
| `$VNI_42` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `13101` |
| `$VNI_43` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `13102` |
| `$VNI_44` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `13103` |
| `$VNI_45` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `13104` |
| `$VNI_46` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `13105` |
| `$VNI_47` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `13106` |
| `$VNI_48` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `13107` |
| `$VNI_49` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `13108` |
| `$VNI_5` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10404` |
| `$VNI_50` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `13109` |
| `$VNI_51` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `35000` |
| `$VNI_6` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10405` |
| `$VNI_7` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10406` |
| `$VNI_8` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10407` |
| `$VNI_9` | VXLAN network identifier of a MAC-VRF VLAN; numbered with its `BD_NAME`. | `10408` |

## VRFs and the external gateway

| Variable | What it is | Example value |
|---|---|---|
| `$AC_IFL` | Full logical attachment-circuit interface identifier, including its unit. | `et-0/0/7.399` |
| `$AC_IFL_1` | Access-facing logical interface listed in a MAC-VRF or VRF (a server-facing port, an ESI-LAG unit, or the attachment toward the external gateway); `_1`, `_2`, … number the instance's interfaces in source order. | `et-0/0/5.0` |
| `$AC_IFL_2` | Access-facing logical interface listed in a MAC-VRF or VRF (a server-facing port, an ESI-LAG unit, or the attachment toward the external gateway); `_1`, `_2`, … number the instance's interfaces in source order. | `ae1.0` |
| `$AC_IFL_3` | Access-facing logical interface listed in a MAC-VRF or VRF (a server-facing port, an ESI-LAG unit, or the attachment toward the external gateway); `_1`, `_2`, … number the instance's interfaces in source order. | `ae1.0` |
| `$ASN_CUSTOMER` | Customer-facing BGP peer autonomous-system number. | `65000` |
| `$ASN_PROVIDER_1` | Provider autonomous-system number as seen from a CE: here a border leaf's AS; `_1`, `_2` number the distinct AS numbers of one group, in neighbor order. | `64708` |
| `$ASN_PROVIDER_2` | Provider autonomous-system number as seen from a CE: here a border leaf's AS; `_1`, `_2` number the distinct AS numbers of one group, in neighbor order. | `64709` |
| `$CE_PEER_V4` | IPv4 address of a VRF eBGP neighbor on the customer or external side. | `10.204.0.1` |
| `$CE_PEER_V6` | IPv6 address of a VRF eBGP neighbor on the customer or external side. | `2001:db8:dc4:10:204::5` |
| `$DHCP_RELAY_GROUP` | **new** Name of a DHCP relay group (`forwarding-options dhcp-relay group`) in a VRF; its interfaces relay DHCP to the server group. | `red` |
| `$INSTANCE_NAME` | Identity stem of a service instance. | `evpn-1` |
| `$IP_PREFIX_EXPORT_POL` | Name of the policy-statement a routing instance exports as EVPN Type 5 IP prefix routes (`ip-prefix-routes export`), as applied and as defined. | `BGP-AOS-Policy-blue` |
| `$LOOPBACK_IFL` | Loopback logical interface (`lo0.<unit>`) listed in a routing instance. | `lo0.5` |
| `$PE_LOCAL_V4` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. | `10.204.0.0` |
| `$PE_LOCAL_V6` | Local IPv6 address of the PE side of a CE eBGP session (`local-address`). | `2001:db8:dc4:10:204::4` |
| `$PE_PEER_V4_1` | IPv4 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.204.0.4` |
| `$PE_PEER_V4_10` | IPv4 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.204.0.18` |
| `$PE_PEER_V4_2` | IPv4 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.204.0.8` |
| `$PE_PEER_V4_3` | IPv4 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.204.0.0` |
| `$PE_PEER_V4_4` | IPv4 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.204.0.12` |
| `$PE_PEER_V4_5` | IPv4 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.204.0.16` |
| `$PE_PEER_V4_6` | IPv4 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.204.0.6` |
| `$PE_PEER_V4_7` | IPv4 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.204.0.10` |
| `$PE_PEER_V4_8` | IPv4 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.204.0.2` |
| `$PE_PEER_V4_9` | IPv4 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.204.0.14` |
| `$PE_PEER_V6_1` | IPv6 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `2001:db8:dc4:10:204::8` |
| `$PE_PEER_V6_10` | IPv6 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `2001:db8:dc4:10:204::e` |
| `$PE_PEER_V6_2` | IPv6 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `2001:db8:dc4:10:204::0` |
| `$PE_PEER_V6_3` | IPv6 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `2001:db8:dc4:10:204::4` |
| `$PE_PEER_V6_4` | IPv6 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `2001:db8:dc4:10:204::10` |
| `$PE_PEER_V6_5` | IPv6 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `2001:db8:dc4:10:204::c` |
| `$PE_PEER_V6_6` | IPv6 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `2001:db8:dc4:10:204::a` |
| `$PE_PEER_V6_7` | IPv6 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `2001:db8:dc4:10:204::2` |
| `$PE_PEER_V6_8` | IPv6 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `2001:db8:dc4:10:204::6` |
| `$PE_PEER_V6_9` | IPv6 address of a provider PE eBGP neighbor, as configured on a CE: here a border leaf VRF address the external gateway peers with; `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `2001:db8:dc4:10:204::12` |
| `$RD_SEED_AUTO` | Seed for automatic Route Distinguisher generation. | `100.100.100.100` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address with prefix length on an attachment (access-facing) Layer 3 unit. | `10.204.0.0/31` |
| `$AC_ADDR_V6` | IPv6 address with prefix length on an attachment (access-facing) Layer 3 unit. | `2001:db8:dc4:10:204::4/127` |
| `$AC_INTF` | Attachment (access-facing) physical interface. | `et-0/0/8:1` |
| `$AE_BUNDLE` | Aggregated Ethernet interface (`ae<n>`), as configured and as its member ports name it (`802.3ad`). | `ae1` |
| `$AE_DEVICE_COUNT` | Number of aggregated Ethernet devices the chassis creates (`aggregated-devices ethernet device-count`). | `1` |
| `$BREAKOUT_SUB_PORTS` | Number of sub-ports a channelized (breakout) port is split into (`number-of-sub-ports`). | `4` |
| `$CORE_INTF_1` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `xe-0/0/7:0.299` |
| `$CORE_INTF_2` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `xe-0/0/7:1.299` |
| `$CORE_PHYS` | Core- or fabric-facing interface (physical or aggregate) of a point-to-point transport link. | `et-0/0/48` |
| `$CORE_V4_ADDR` | IPv4 address with prefix length on a core- or fabric-facing point-to-point link. | `10.0.1.41/31` |
| `$CORE_V6_ADDR` | IPv6 address with prefix length on a core- or fabric-facing point-to-point link. | `fdf6:ed70:1fac:f2d4::29/127` |
| `$COS_INTF` | Interface that a class-of-service binding applies to (`class-of-service interfaces <name>`). | `et-0/0/2` |
| `$DESCRIPTION` | Free-text `description` of an interface, unit or BGP neighbor. | `to.sys003-001-002` |
| `$DESCRIPTION_1` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_spine003-001-1-evpn-overlay` |
| `$DESCRIPTION_10` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_all_1409` |
| `$DESCRIPTION_11` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_3_1430` |
| `$DESCRIPTION_12` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_3_1431` |
| `$DESCRIPTION_13` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_3_1432` |
| `$DESCRIPTION_14` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_3_1433` |
| `$DESCRIPTION_15` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_3_1434` |
| `$DESCRIPTION_16` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_3_1435` |
| `$DESCRIPTION_17` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_3_1436` |
| `$DESCRIPTION_18` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_3_1437` |
| `$DESCRIPTION_19` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_3_1438` |
| `$DESCRIPTION_2` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_spine003-001-2-evpn-overlay` |
| `$DESCRIPTION_20` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_sub_3_1439` |
| `$DESCRIPTION_21` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `yellow_3100` |
| `$DESCRIPTION_22` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `yellow_3101` |
| `$DESCRIPTION_23` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `yellow_3102` |
| `$DESCRIPTION_24` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `yellow_3103` |
| `$DESCRIPTION_25` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `yellow_3104` |
| `$DESCRIPTION_26` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `yellow_3105` |
| `$DESCRIPTION_27` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `yellow_3106` |
| `$DESCRIPTION_28` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `yellow_3107` |
| `$DESCRIPTION_29` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `yellow_3108` |
| `$DESCRIPTION_3` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_sspine001-1-evpn-overlay` |
| `$DESCRIPTION_30` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `yellow_3109` |
| `$DESCRIPTION_31` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue-SBD` |
| `$DESCRIPTION_32` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_400` |
| `$DESCRIPTION_33` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_401` |
| `$DESCRIPTION_34` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_402` |
| `$DESCRIPTION_35` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_403` |
| `$DESCRIPTION_36` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_404` |
| `$DESCRIPTION_37` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_405` |
| `$DESCRIPTION_38` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_406` |
| `$DESCRIPTION_39` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_407` |
| `$DESCRIPTION_4` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_sspine001-2-evpn-overlay` |
| `$DESCRIPTION_40` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_408` |
| `$DESCRIPTION_41` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_all_409` |
| `$DESCRIPTION_42` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_3_430` |
| `$DESCRIPTION_43` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_3_431` |
| `$DESCRIPTION_44` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_3_432` |
| `$DESCRIPTION_45` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_3_433` |
| `$DESCRIPTION_46` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_3_434` |
| `$DESCRIPTION_47` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_3_435` |
| `$DESCRIPTION_48` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_3_436` |
| `$DESCRIPTION_49` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_3_437` |
| `$DESCRIPTION_5` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_spine003-001-1-evpn-overlay` |
| `$DESCRIPTION_50` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_3_438` |
| `$DESCRIPTION_51` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `red_sub_3_439` |
| `$DESCRIPTION_6` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_spine003-001-2-evpn-overlay` |
| `$DESCRIPTION_7` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_all_1406` |
| `$DESCRIPTION_8` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_all_1407` |
| `$DESCRIPTION_9` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `blue_all_1408` |
| `$ESI` | Ethernet segment identifier (10 octets) of a multihomed interface. | `00:02:00:00:00:00:03:00:00:03` |
| `$IFD` | Interface-device identifier, excluding a logical unit. | `et-0/0/8` |
| `$IFL` | Logical interface identifier, including its unit. | `et-0/0/48.0` |
| `$IRB_ADDR` | IPv4 address with prefix length on an IRB unit: the Layer 3 gateway of a VLAN or bridge domain. | `10.0.0.1/24` |
| `$IRB_ADDR_V6` | IPv6 address with prefix length on an IRB unit: the IPv6 gateway of a VLAN. | `2001:db8:dc4:10:00:00::1/96` |
| `$IRB_IFL_1` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1400` |
| `$IRB_IFL_10` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1409` |
| `$IRB_IFL_11` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1430` |
| `$IRB_IFL_12` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1431` |
| `$IRB_IFL_13` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1432` |
| `$IRB_IFL_14` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1433` |
| `$IRB_IFL_15` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1434` |
| `$IRB_IFL_16` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1435` |
| `$IRB_IFL_17` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1436` |
| `$IRB_IFL_18` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1437` |
| `$IRB_IFL_19` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1438` |
| `$IRB_IFL_2` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1401` |
| `$IRB_IFL_20` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1439` |
| `$IRB_IFL_21` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3100` |
| `$IRB_IFL_22` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3101` |
| `$IRB_IFL_23` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3102` |
| `$IRB_IFL_24` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3103` |
| `$IRB_IFL_25` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3104` |
| `$IRB_IFL_26` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3105` |
| `$IRB_IFL_27` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3106` |
| `$IRB_IFL_28` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3107` |
| `$IRB_IFL_29` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3108` |
| `$IRB_IFL_3` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1402` |
| `$IRB_IFL_30` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3109` |
| `$IRB_IFL_31` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.3500` |
| `$IRB_IFL_32` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.400` |
| `$IRB_IFL_33` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.401` |
| `$IRB_IFL_34` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.402` |
| `$IRB_IFL_35` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.403` |
| `$IRB_IFL_36` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.404` |
| `$IRB_IFL_37` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.405` |
| `$IRB_IFL_38` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.406` |
| `$IRB_IFL_39` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.407` |
| `$IRB_IFL_4` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1403` |
| `$IRB_IFL_40` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.408` |
| `$IRB_IFL_41` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.409` |
| `$IRB_IFL_42` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.430` |
| `$IRB_IFL_43` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.431` |
| `$IRB_IFL_44` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.432` |
| `$IRB_IFL_45` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.433` |
| `$IRB_IFL_46` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.434` |
| `$IRB_IFL_47` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.435` |
| `$IRB_IFL_48` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.436` |
| `$IRB_IFL_49` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.437` |
| `$IRB_IFL_5` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1404` |
| `$IRB_IFL_50` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.438` |
| `$IRB_IFL_51` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.439` |
| `$IRB_IFL_6` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1405` |
| `$IRB_IFL_7` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1406` |
| `$IRB_IFL_8` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1407` |
| `$IRB_IFL_9` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN, as the VLAN references it and as a Type 5 VRF lists it; numbered in source order. | `irb.1408` |
| `$IRB_MAC` | MAC address configured on an IRB unit (`mac`). | `00:1c:73:00:00:01` |
| `$IRB_UNIT` | IRB unit number. | `400` |
| `$LACP_SYS_ID` | LACP system ID of an aggregated Ethernet bundle, shared by the multihoming peers of an ESI-LAG. | `02:00:00:00:00:03` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `2` |

## Fabric underlay and overlay

| Variable | What it is | Example value |
|---|---|---|
| `$ASN_FABRIC_PEER` | Autonomous-system number of a fabric eBGP neighbor (another leaf or spine of an IP fabric). | `64703` |
| `$ASN_FABRIC_PEER_1` | Autonomous-system number of a fabric eBGP neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `64706` |
| `$ASN_FABRIC_PEER_2` | Autonomous-system number of a fabric eBGP neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `64707` |
| `$ASN_FABRIC_PEER_3` | Autonomous-system number of a fabric eBGP neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `64700` |
| `$BGP_GROUP` | Name of a BGP peer group. | `l3clos-l-evpn` |
| `$OVERLAY_PEER_V4_1` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `192.168.252.6` |
| `$OVERLAY_PEER_V4_2` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `192.168.252.7` |
| `$OVERLAY_PEER_V4_3` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `192.168.252.0` |
| `$OVERLAY_PEER_V4_4` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `192.168.252.1` |
| `$OVERLAY_PEER_V4_5` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `192.168.252.6` |
| `$OVERLAY_PEER_V4_6` | Loopback IPv4 address of an eBGP EVPN overlay neighbor (a leaf, spine or super spine); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `192.168.252.7` |
| `$UNDERLAY_LOCAL_V4_1` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.1.41` |
| `$UNDERLAY_LOCAL_V4_2` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.1.45` |
| `$UNDERLAY_LOCAL_V4_3` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.1.8` |
| `$UNDERLAY_LOCAL_V4_4` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.1.10` |
| `$UNDERLAY_LOCAL_V4_5` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.1.17` |
| `$UNDERLAY_LOCAL_V4_6` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.1.21` |
| `$UNDERLAY_LOCAL_V6_1` | **new** Local IPv6 address (`local-address`) of the eBGP underlay session with the IPv6 neighbor of the same number. | `fdf6:ed70:1fac:f2d4::29` |
| `$UNDERLAY_LOCAL_V6_2` | Local IPv6 address (`local-address`) of the eBGP underlay session with the IPv6 neighbor of the same number. | `fdf6:ed70:1fac:f2d4::2d` |
| `$UNDERLAY_LOCAL_V6_3` | Local IPv6 address (`local-address`) of the eBGP underlay session with the IPv6 neighbor of the same number. | `fdf6:ed70:1fac:f2d4::8` |
| `$UNDERLAY_LOCAL_V6_4` | Local IPv6 address (`local-address`) of the eBGP underlay session with the IPv6 neighbor of the same number. | `fdf6:ed70:1fac:f2d4::a` |
| `$UNDERLAY_LOCAL_V6_5` | Local IPv6 address (`local-address`) of the eBGP underlay session with the IPv6 neighbor of the same number. | `fdf6:ed70:1fac:f2d4::11` |
| `$UNDERLAY_LOCAL_V6_6` | Local IPv6 address (`local-address`) of the eBGP underlay session with the IPv6 neighbor of the same number. | `fdf6:ed70:1fac:f2d4::15` |
| `$UNDERLAY_PEER_V4_1` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a fabric /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.40` |
| `$UNDERLAY_PEER_V4_2` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a fabric /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.44` |
| `$UNDERLAY_PEER_V4_3` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a fabric /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.9` |
| `$UNDERLAY_PEER_V4_4` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a fabric /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.11` |
| `$UNDERLAY_PEER_V4_5` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a fabric /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.16` |
| `$UNDERLAY_PEER_V4_6` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a fabric /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.1.20` |
| `$UNDERLAY_PEER_V6_1` | **new** IPv6 address of a directly connected eBGP underlay neighbor (the far end of a fabric link); `_1`, `_2`, … number the IPv6 neighbors of one group, in neighbor order. IPv6 member of the `$UNDERLAY_PEER_V4` family. | `fdf6:ed70:1fac:f2d4::28` |
| `$UNDERLAY_PEER_V6_2` | IPv6 address of a directly connected eBGP underlay neighbor (the far end of a fabric link); `_1`, `_2`, … number the IPv6 neighbors of one group, in neighbor order. IPv6 member of the `$UNDERLAY_PEER_V4` family. | `fdf6:ed70:1fac:f2d4::2c` |
| `$UNDERLAY_PEER_V6_3` | IPv6 address of a directly connected eBGP underlay neighbor (the far end of a fabric link); `_1`, `_2`, … number the IPv6 neighbors of one group, in neighbor order. IPv6 member of the `$UNDERLAY_PEER_V4` family. | `fdf6:ed70:1fac:f2d4::9` |
| `$UNDERLAY_PEER_V6_4` | IPv6 address of a directly connected eBGP underlay neighbor (the far end of a fabric link); `_1`, `_2`, … number the IPv6 neighbors of one group, in neighbor order. IPv6 member of the `$UNDERLAY_PEER_V4` family. | `fdf6:ed70:1fac:f2d4::b` |
| `$UNDERLAY_PEER_V6_5` | IPv6 address of a directly connected eBGP underlay neighbor (the far end of a fabric link); `_1`, `_2`, … number the IPv6 neighbors of one group, in neighbor order. IPv6 member of the `$UNDERLAY_PEER_V4` family. | `fdf6:ed70:1fac:f2d4::10` |
| `$UNDERLAY_PEER_V6_6` | IPv6 address of a directly connected eBGP underlay neighbor (the far end of a fabric link); `_1`, `_2`, … number the IPv6 neighbors of one group, in neighbor order. IPv6 member of the `$UNDERLAY_PEER_V4` family. | `fdf6:ed70:1fac:f2d4::14` |

## Policy

| Variable | What it is | Example value |
|---|---|---|
| `$BGP_EXPORT_POL` | Policy-statement name applied as a BGP `export`. | `EVPN_EXPORT` |
| `$BGP_EXPORT_POL_1` | Policy-statement name applied as a BGP `export`; `_1`, `_2` number the members of a policy chain (`export ( A && B )`), in evaluation order. | `LEAF_TO_SPINE_EVPN_OUT` |
| `$BGP_EXPORT_POL_2` | Policy-statement name applied as a BGP `export`; `_1`, `_2` number the members of a policy chain (`export ( A && B )`), in evaluation order. | `EVPN_EXPORT` |
| `$BGP_EXPORT_POL_3` | Policy-statement name applied as a BGP `export`; `_1`, `_2` number the members of a policy chain (`export ( A && B )`), in evaluation order. | `SPINE_TO_SUPERSPINE_FABRIC_OUT` |
| `$BGP_IMPORT_POL` | Policy-statement name applied as a BGP `import`, as applied and as defined. | `RoutesFromExt-blue-external_router` |
| `$COMMUNITY_ADMIN_1` | Administrator field of a member of a two-member community; `_1`, `_2` number the members in order. | `13` |
| `$COMMUNITY_ADMIN_2` | Administrator field of a member of a two-member community; `_1`, `_2` number the members in order. | `21001` |
| `$COMMUNITY_ASSIGNED_1` | Assigned-number field of the first member of a two-member community. | `20007` |
| `$COMMUNITY_NAME` | Name of a BGP community that a policy adds to routes, where the name differs between instances. | `DEFAULT_DIRECT_V4` |
| `$COMMUNITY_NAME_1` | Name of a BGP community that a policy adds to routes (`community add`); `_1`, `_2` number the communities of one policy, in term order. | `BLUE_COMMUNITY_V4` |
| `$COMMUNITY_NAME_2` | Name of a BGP community that a policy adds to routes (`community add`); `_1`, `_2` number the communities of one policy, in term order. | `BLUE_COMMUNITY_V6` |
| `$PIM_RP_V4` | IPv4 address of a PIM rendezvous point. | `100.100.100.100` |
| `$POLICY_NAME` | Name of a routing policy-statement where no role-specific name (BGP export or import, VRF import or export, load balancing) applies. | `AllPodNetworks-blue` |
| `$PPLB_NAME` | Name of the per-packet load-balancing policy exported to the forwarding table. | `PFE-LB` |
| `$PREFIX_1` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `10.0.0.0/19` |
| `$PREFIX_2` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `10.0.32.0/21` |
| `$PREFIX_3` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `192.168.14.0/31` |
| `$PREFIX_4` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `192.168.14.16/30` |
| `$PREFIX_5` | Prefix of a route-filter list entry; `_1`, `_2`, … number the entries in source order. | `fdf6:ed70:1fac:f2d4::200c/127` |
| `$ROUTE_FILTER_LIST` | Name of a route-filter list, as defined and as a policy references it. | `RoutesToExt-yellow-external_router` |
| `$ROUTE_FILTER_LIST_1` | Name of a route-filter list, as defined and as a policy references it. Numbered `_1`, `_2`, … in source order. | `RoutesFromExt-blue-external_router` |
| `$ROUTE_FILTER_LIST_2` | Name of a route-filter list, as defined and as a policy references it. Numbered `_1`, `_2`, … in source order. | `RoutesFromExtV6-blue-external_router` |
| `$TERM_NAME` | Name of a policy-statement term. | `EVPN_EXPORT-4095` |
| `$TERM_NAME_1` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `ssh` |
| `$TERM_NAME_10` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `ospf` |
| `$TERM_NAME_11` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `discard-rest` |
| `$TERM_NAME_2` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `icmp` |
| `$TERM_NAME_3` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `bgp` |
| `$TERM_NAME_4` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `dns` |
| `$TERM_NAME_5` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `ntp` |
| `$TERM_NAME_6` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `dhcp` |
| `$TERM_NAME_7` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `netconf` |
| `$TERM_NAME_8` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `bfd` |
| `$TERM_NAME_9` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `snmp` |
| `$VGA` | Virtual gateway address of an IRB unit (`virtual-gateway-address`), shared by the leaves that serve the VLAN. | `10.200.0.1` |
| `$VLAN` | A single VLAN identifier. | `399` |

## byoai/TIERS.md

> **Tier qualification for this JVD.** Only `minimum` is qualified and selectable.
> The `self-contained` and `as-deployed` lists below are not yet qualified for this
> JVD. They are not selectable: never offer or render them.

# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd data_center/adc/5stage_evpn_vxlan`. -->

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

## EVPN-VXLAN MAC-VRF with 51 VLANs and IGMP snooping

Family e-lan, form evpn-mac-vrf-51-vlans-igmp-snooping. OS mode Junos. Attachment: Access units on the compute leaves (the ESI-LAG and single-homed server ports) and the VLANs' IRB units, which the Type 5 VRFs route..

### compute-leaf1_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-proxy-3-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$AC_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$IRB_IFL_21
  - occurrence-selection-required: logical-interface:$IRB_IFL_22
  - occurrence-selection-required: logical-interface:$IRB_IFL_23
  - occurrence-selection-required: logical-interface:$IRB_IFL_24
  - occurrence-selection-required: logical-interface:$IRB_IFL_25
  - occurrence-selection-required: logical-interface:$IRB_IFL_26
  - occurrence-selection-required: logical-interface:$IRB_IFL_27
  - occurrence-selection-required: logical-interface:$IRB_IFL_28
  - occurrence-selection-required: logical-interface:$IRB_IFL_29
  - occurrence-selection-required: logical-interface:$IRB_IFL_30
  - occurrence-selection-required: logical-interface:$IRB_IFL_31
  - occurrence-selection-required: logical-interface:$IRB_IFL_32
  - occurrence-selection-required: logical-interface:$IRB_IFL_33
  - occurrence-selection-required: logical-interface:$IRB_IFL_34
  - occurrence-selection-required: logical-interface:$IRB_IFL_35
  - occurrence-selection-required: logical-interface:$IRB_IFL_36
  - occurrence-selection-required: logical-interface:$IRB_IFL_37
  - occurrence-selection-required: logical-interface:$IRB_IFL_38
  - occurrence-selection-required: logical-interface:$IRB_IFL_39
  - occurrence-selection-required: logical-interface:$IRB_IFL_40
  - occurrence-selection-required: logical-interface:$IRB_IFL_41
  - occurrence-selection-required: logical-interface:$IRB_IFL_42
  - occurrence-selection-required: logical-interface:$IRB_IFL_43
  - occurrence-selection-required: logical-interface:$IRB_IFL_44
  - occurrence-selection-required: logical-interface:$IRB_IFL_45
  - occurrence-selection-required: logical-interface:$IRB_IFL_46
  - occurrence-selection-required: logical-interface:$IRB_IFL_47
  - occurrence-selection-required: logical-interface:$IRB_IFL_48
  - occurrence-selection-required: logical-interface:$IRB_IFL_49
  - occurrence-selection-required: logical-interface:$IRB_IFL_50
  - occurrence-selection-required: logical-interface:$IRB_IFL_51

### compute-leaf2_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-proxy-2-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$IRB_IFL_21
  - occurrence-selection-required: logical-interface:$IRB_IFL_22
  - occurrence-selection-required: logical-interface:$IRB_IFL_23
  - occurrence-selection-required: logical-interface:$IRB_IFL_24
  - occurrence-selection-required: logical-interface:$IRB_IFL_25
  - occurrence-selection-required: logical-interface:$IRB_IFL_26
  - occurrence-selection-required: logical-interface:$IRB_IFL_27
  - occurrence-selection-required: logical-interface:$IRB_IFL_28
  - occurrence-selection-required: logical-interface:$IRB_IFL_29
  - occurrence-selection-required: logical-interface:$IRB_IFL_30
  - occurrence-selection-required: logical-interface:$IRB_IFL_31
  - occurrence-selection-required: logical-interface:$IRB_IFL_32
  - occurrence-selection-required: logical-interface:$IRB_IFL_33
  - occurrence-selection-required: logical-interface:$IRB_IFL_34
  - occurrence-selection-required: logical-interface:$IRB_IFL_35
  - occurrence-selection-required: logical-interface:$IRB_IFL_36
  - occurrence-selection-required: logical-interface:$IRB_IFL_37
  - occurrence-selection-required: logical-interface:$IRB_IFL_38
  - occurrence-selection-required: logical-interface:$IRB_IFL_39
  - occurrence-selection-required: logical-interface:$IRB_IFL_40
  - occurrence-selection-required: logical-interface:$IRB_IFL_41
  - occurrence-selection-required: logical-interface:$IRB_IFL_42
  - occurrence-selection-required: logical-interface:$IRB_IFL_43
  - occurrence-selection-required: logical-interface:$IRB_IFL_44
  - occurrence-selection-required: logical-interface:$IRB_IFL_45
  - occurrence-selection-required: logical-interface:$IRB_IFL_46
  - occurrence-selection-required: logical-interface:$IRB_IFL_47
  - occurrence-selection-required: logical-interface:$IRB_IFL_48
  - occurrence-selection-required: logical-interface:$IRB_IFL_49
  - occurrence-selection-required: logical-interface:$IRB_IFL_50
  - occurrence-selection-required: logical-interface:$IRB_IFL_51

---

## EVPN-VXLAN MAC-VRF with 51 VLANs, IGMP snooping and OISM

Family e-lan, form evpn-mac-vrf-51-vlans-igmp-snooping-oism. OS mode EVO. Attachment: Access units on the storage and services leaves and the VLANs' IRB units, which the Type 5 VRFs route; OISM joins the VLANs to the VRFs' multicast..

### services-leaf1_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-oism-2-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$IRB_IFL_21
  - occurrence-selection-required: logical-interface:$IRB_IFL_22
  - occurrence-selection-required: logical-interface:$IRB_IFL_23
  - occurrence-selection-required: logical-interface:$IRB_IFL_24
  - occurrence-selection-required: logical-interface:$IRB_IFL_25
  - occurrence-selection-required: logical-interface:$IRB_IFL_26
  - occurrence-selection-required: logical-interface:$IRB_IFL_27
  - occurrence-selection-required: logical-interface:$IRB_IFL_28
  - occurrence-selection-required: logical-interface:$IRB_IFL_29
  - occurrence-selection-required: logical-interface:$IRB_IFL_30
  - occurrence-selection-required: logical-interface:$IRB_IFL_31
  - occurrence-selection-required: logical-interface:$IRB_IFL_32
  - occurrence-selection-required: logical-interface:$IRB_IFL_33
  - occurrence-selection-required: logical-interface:$IRB_IFL_34
  - occurrence-selection-required: logical-interface:$IRB_IFL_35
  - occurrence-selection-required: logical-interface:$IRB_IFL_36
  - occurrence-selection-required: logical-interface:$IRB_IFL_37
  - occurrence-selection-required: logical-interface:$IRB_IFL_38
  - occurrence-selection-required: logical-interface:$IRB_IFL_39
  - occurrence-selection-required: logical-interface:$IRB_IFL_40
  - occurrence-selection-required: logical-interface:$IRB_IFL_41
  - occurrence-selection-required: logical-interface:$IRB_IFL_42
  - occurrence-selection-required: logical-interface:$IRB_IFL_43
  - occurrence-selection-required: logical-interface:$IRB_IFL_44
  - occurrence-selection-required: logical-interface:$IRB_IFL_45
  - occurrence-selection-required: logical-interface:$IRB_IFL_46
  - occurrence-selection-required: logical-interface:$IRB_IFL_47
  - occurrence-selection-required: logical-interface:$IRB_IFL_48
  - occurrence-selection-required: logical-interface:$IRB_IFL_49
  - occurrence-selection-required: logical-interface:$IRB_IFL_50
  - occurrence-selection-required: logical-interface:$IRB_IFL_51

### services-leaf2_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-oism-2-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$IRB_IFL_21
  - occurrence-selection-required: logical-interface:$IRB_IFL_22
  - occurrence-selection-required: logical-interface:$IRB_IFL_23
  - occurrence-selection-required: logical-interface:$IRB_IFL_24
  - occurrence-selection-required: logical-interface:$IRB_IFL_25
  - occurrence-selection-required: logical-interface:$IRB_IFL_26
  - occurrence-selection-required: logical-interface:$IRB_IFL_27
  - occurrence-selection-required: logical-interface:$IRB_IFL_28
  - occurrence-selection-required: logical-interface:$IRB_IFL_29
  - occurrence-selection-required: logical-interface:$IRB_IFL_30
  - occurrence-selection-required: logical-interface:$IRB_IFL_31
  - occurrence-selection-required: logical-interface:$IRB_IFL_32
  - occurrence-selection-required: logical-interface:$IRB_IFL_33
  - occurrence-selection-required: logical-interface:$IRB_IFL_34
  - occurrence-selection-required: logical-interface:$IRB_IFL_35
  - occurrence-selection-required: logical-interface:$IRB_IFL_36
  - occurrence-selection-required: logical-interface:$IRB_IFL_37
  - occurrence-selection-required: logical-interface:$IRB_IFL_38
  - occurrence-selection-required: logical-interface:$IRB_IFL_39
  - occurrence-selection-required: logical-interface:$IRB_IFL_40
  - occurrence-selection-required: logical-interface:$IRB_IFL_41
  - occurrence-selection-required: logical-interface:$IRB_IFL_42
  - occurrence-selection-required: logical-interface:$IRB_IFL_43
  - occurrence-selection-required: logical-interface:$IRB_IFL_44
  - occurrence-selection-required: logical-interface:$IRB_IFL_45
  - occurrence-selection-required: logical-interface:$IRB_IFL_46
  - occurrence-selection-required: logical-interface:$IRB_IFL_47
  - occurrence-selection-required: logical-interface:$IRB_IFL_48
  - occurrence-selection-required: logical-interface:$IRB_IFL_49
  - occurrence-selection-required: logical-interface:$IRB_IFL_50
  - occurrence-selection-required: logical-interface:$IRB_IFL_51

### storage-leaf1_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-proxy-oism-3-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$AC_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$IRB_IFL_21
  - occurrence-selection-required: logical-interface:$IRB_IFL_22
  - occurrence-selection-required: logical-interface:$IRB_IFL_23
  - occurrence-selection-required: logical-interface:$IRB_IFL_24
  - occurrence-selection-required: logical-interface:$IRB_IFL_25
  - occurrence-selection-required: logical-interface:$IRB_IFL_26
  - occurrence-selection-required: logical-interface:$IRB_IFL_27
  - occurrence-selection-required: logical-interface:$IRB_IFL_28
  - occurrence-selection-required: logical-interface:$IRB_IFL_29
  - occurrence-selection-required: logical-interface:$IRB_IFL_30
  - occurrence-selection-required: logical-interface:$IRB_IFL_31
  - occurrence-selection-required: logical-interface:$IRB_IFL_32
  - occurrence-selection-required: logical-interface:$IRB_IFL_33
  - occurrence-selection-required: logical-interface:$IRB_IFL_34
  - occurrence-selection-required: logical-interface:$IRB_IFL_35
  - occurrence-selection-required: logical-interface:$IRB_IFL_36
  - occurrence-selection-required: logical-interface:$IRB_IFL_37
  - occurrence-selection-required: logical-interface:$IRB_IFL_38
  - occurrence-selection-required: logical-interface:$IRB_IFL_39
  - occurrence-selection-required: logical-interface:$IRB_IFL_40
  - occurrence-selection-required: logical-interface:$IRB_IFL_41
  - occurrence-selection-required: logical-interface:$IRB_IFL_42
  - occurrence-selection-required: logical-interface:$IRB_IFL_43
  - occurrence-selection-required: logical-interface:$IRB_IFL_44
  - occurrence-selection-required: logical-interface:$IRB_IFL_45
  - occurrence-selection-required: logical-interface:$IRB_IFL_46
  - occurrence-selection-required: logical-interface:$IRB_IFL_47
  - occurrence-selection-required: logical-interface:$IRB_IFL_48
  - occurrence-selection-required: logical-interface:$IRB_IFL_49
  - occurrence-selection-required: logical-interface:$IRB_IFL_50
  - occurrence-selection-required: logical-interface:$IRB_IFL_51

### storage-leaf2_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-proxy-oism-2-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$IRB_IFL_21
  - occurrence-selection-required: logical-interface:$IRB_IFL_22
  - occurrence-selection-required: logical-interface:$IRB_IFL_23
  - occurrence-selection-required: logical-interface:$IRB_IFL_24
  - occurrence-selection-required: logical-interface:$IRB_IFL_25
  - occurrence-selection-required: logical-interface:$IRB_IFL_26
  - occurrence-selection-required: logical-interface:$IRB_IFL_27
  - occurrence-selection-required: logical-interface:$IRB_IFL_28
  - occurrence-selection-required: logical-interface:$IRB_IFL_29
  - occurrence-selection-required: logical-interface:$IRB_IFL_30
  - occurrence-selection-required: logical-interface:$IRB_IFL_31
  - occurrence-selection-required: logical-interface:$IRB_IFL_32
  - occurrence-selection-required: logical-interface:$IRB_IFL_33
  - occurrence-selection-required: logical-interface:$IRB_IFL_34
  - occurrence-selection-required: logical-interface:$IRB_IFL_35
  - occurrence-selection-required: logical-interface:$IRB_IFL_36
  - occurrence-selection-required: logical-interface:$IRB_IFL_37
  - occurrence-selection-required: logical-interface:$IRB_IFL_38
  - occurrence-selection-required: logical-interface:$IRB_IFL_39
  - occurrence-selection-required: logical-interface:$IRB_IFL_40
  - occurrence-selection-required: logical-interface:$IRB_IFL_41
  - occurrence-selection-required: logical-interface:$IRB_IFL_42
  - occurrence-selection-required: logical-interface:$IRB_IFL_43
  - occurrence-selection-required: logical-interface:$IRB_IFL_44
  - occurrence-selection-required: logical-interface:$IRB_IFL_45
  - occurrence-selection-required: logical-interface:$IRB_IFL_46
  - occurrence-selection-required: logical-interface:$IRB_IFL_47
  - occurrence-selection-required: logical-interface:$IRB_IFL_48
  - occurrence-selection-required: logical-interface:$IRB_IFL_49
  - occurrence-selection-required: logical-interface:$IRB_IFL_50
  - occurrence-selection-required: logical-interface:$IRB_IFL_51

---

## EVPN Type 5 VRF with ten IRB units

Family l3vpn, form evpn-type5-vrf-10-irb. OS mode EVO. Attachment: IRB units of the MAC-VRF VLANs and the VRF loopback unit..

### storage-leaf1_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-10-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### storage-leaf2_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-10-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## EVPN Type 5 VRF with ten IRB units and DHCP relay

Family l3vpn, form evpn-type5-vrf-dhcp-relay-10-irb. OS mode Junos. Attachment: IRB units of the MAC-VRF VLANs and the VRF loopback unit, which DHCP relay uses as its source..

### compute-leaf1_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-10-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### compute-leaf2_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-10-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## EVPN Type 5 VRF with twenty IRB units and DHCP relay

Family l3vpn, form evpn-type5-vrf-dhcp-relay-20-irb. OS mode MIXED. Attachment: IRB units of the MAC-VRF VLANs and the VRF loopback unit, which DHCP relay uses as its source..

### storage-leaf1_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### storage-leaf2_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### compute-leaf1_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### compute-leaf2_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## EVPN Type 5 VRF with OSPF, PIM and OISM

Family l3vpn, form evpn-type5-vrf-ospf-pim-oism. OS mode MIXED. Attachment: IRB units of the MAC-VRF VLANs (one carries OSPF, PIM and the OISM supplemental bridge domain) and the VRF loopback unit..

### storage-leaf1_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ospf-pim-oism-dhcp-relay.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$IRB_IFL_21
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### storage-leaf2_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ospf-pim-oism-dhcp-relay.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$IRB_IFL_21
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### compute-leaf1_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-ospf-pim-oism-dhcp-relay.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$IRB_IFL_21
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### compute-leaf2_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-ospf-pim-oism-dhcp-relay.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$IRB_IFL_21
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## Border EVPN Type 5 VRF with eBGP to the external gateway

Family l3vpn, form border-evpn-type5-vrf-ebgp. OS mode EVO. Attachment: The services leaf's attachment unit toward the external gateway and the VRF loopback unit..

### services-leaf1_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### services-leaf2_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## Border EVPN Type 5 VRF with eBGP and ten IRB units

Family l3vpn, form border-evpn-type5-vrf-ebgp-10-irb. OS mode EVO. Attachment: The attachment unit toward the external gateway, the VLANs' IRB units and the VRF loopback unit..

### services-leaf1_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-10-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### services-leaf2_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-10-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## Border EVPN Type 5 VRF with eBGP and DHCP relay

Family l3vpn, form border-evpn-type5-vrf-ebgp-dhcp-relay. OS mode EVO. Attachment: The attachment unit toward the external gateway and the VRF loopback unit, which DHCP relay uses as its source..

### services-leaf1_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### services-leaf2_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## Border EVPN Type 5 VRF with eBGP, twenty IRB units and DHCP relay

Family l3vpn, form border-evpn-type5-vrf-ebgp-dhcp-relay-20-irb. OS mode EVO. Attachment: The attachment unit toward the external gateway, the VLANs' IRB units and the VRF loopback unit..

### services-leaf1_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay-20-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### services-leaf2_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay-20-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## Border EVPN Type 5 VRF with eBGP, OSPF, PIM and OISM

Family l3vpn, form border-evpn-type5-vrf-ebgp-ospf-pim-oism. OS mode EVO. Attachment: The attachment unit toward the external gateway, the VLANs' IRB units (one carries OSPF, PIM and the OISM supplemental bridge domain) and the VRF loopback unit..

### services-leaf1_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-ospf-pim-oism-dhcp-relay.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$IRB_IFL_21
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### services-leaf2_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-ospf-pim-oism-dhcp-relay.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$IRB_IFL_21
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## byoai/DEFAULTS.md

# DEFAULTS — 5-Stage EVPN-VXLAN Data Center

Lab auto-fill values for the 5-Stage EVPN-VXLAN Data Center JVD. Every value is measured from the published device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks a device and service and asks for lab values; otherwise ask for the deployment values.

## Device inventory

| Role | Device | Platform | OS | Loopback / router-id | `$ASN` |
|------|--------|----------|----|----------------------|--------|
| Super spine pair | superspine1_qfx5230-64cd | QFX5230-64CD | EVO | 192.168.252.0 | 64700 |
| Super spine pair | superspine2_qfx5230-64cd | QFX5230-64CD | EVO | 192.168.252.1 | 64700 |
| Compute POD spine | compute-spine1_qfx5210-64c | QFX5210-64C | Junos | 192.168.252.2 | 64701 |
| Compute POD spine | compute-spine2_qfx5210-64c | QFX5210-64C | Junos | 192.168.252.3 | 64701 |
| Compute POD leaf | compute-leaf1_qfx5120-48ym | QFX5120-48YM | Junos | 192.168.252.8 | 64704 |
| Compute POD leaf | compute-leaf2_qfx5120-48ym | QFX5120-48YM | Junos | 192.168.252.9 | 64705 |
| Storage POD spine | storage-spine1_qfx5220-32cd | QFX5220-32CD | EVO | 192.168.252.4 | 64702 |
| Storage POD spine | storage-spine2_qfx5220-32cd | QFX5220-32CD | EVO | 192.168.252.5 | 64702 |
| Storage POD leaf | storage-leaf1_qfx5130-32cd | QFX5130-32CD | EVO | 192.168.252.10 | 64706 |
| Storage POD leaf | storage-leaf2_qfx5130-32cd | QFX5130-32CD | EVO | 192.168.252.11 | 64707 |
| Services POD spine | services-spine1_qfx5210-64c | QFX5210-64C | Junos | 192.168.252.6 | 64703 |
| Services POD spine | services-spine2_qfx5210-64c | QFX5210-64C | Junos | 192.168.252.7 | 64703 |
| Services POD leaf (border) | services-leaf1_qfx5130-48c | QFX5130-48C | EVO | 192.168.252.12 | 64708 |
| Services POD leaf (border) | services-leaf2_qfx5130-48c | QFX5130-48C | EVO | 192.168.252.13 | 64709 |
| External gateway | external-gw_mx | MX | Junos | — | 65000 |

## Service examples (first measured instance per leaf)

| Service form | Device | Example values |
|--------------|--------|----------------|
| evpn-mac-vrf-51-vlans-igmp-snooping | compute-leaf1_qfx5120-48ym | `$AC_IFL_1` xe-0/0/0.0, `$AC_IFL_2` et-0/0/50.0, `$AC_IFL_3` ae1.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1410 |
| evpn-mac-vrf-51-vlans-igmp-snooping | compute-leaf2_qfx5120-48ym | `$AC_IFL_1` xe-0/0/1.0, `$AC_IFL_2` ae1.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1410, `$BD_NAME_12` vn1411 |
| evpn-mac-vrf-51-vlans-igmp-snooping-oism | storage-leaf1_qfx5130-32cd | `$AC_IFL_1` et-0/0/2.0, `$AC_IFL_2` et-0/0/8:0.0, `$AC_IFL_3` ae1.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1420 |
| evpn-mac-vrf-51-vlans-igmp-snooping-oism | storage-leaf2_qfx5130-32cd | `$AC_IFL_1` et-0/0/8:1.0, `$AC_IFL_2` ae1.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1420, `$BD_NAME_12` vn1421 |
| evpn-mac-vrf-51-vlans-igmp-snooping-oism | services-leaf1_qfx5130-48c | `$AC_IFL_1` et-0/0/5.0, `$AC_IFL_2` ae1.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1430, `$BD_NAME_12` vn1431 |
| evpn-mac-vrf-51-vlans-igmp-snooping-oism | services-leaf2_qfx5130-48c | `$AC_IFL_1` et-0/0/6.0, `$AC_IFL_2` ae1.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1430, `$BD_NAME_12` vn1431 |
| evpn-type5-vrf-10-irb | storage-leaf1_qfx5130-32cd | `$INSTANCE_NAME` purple, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-purple, `$IRB_IFL_1` irb.2800, `$IRB_IFL_10` irb.2809, `$IRB_IFL_2` irb.2801, `$IRB_IFL_3` irb.2802 |
| evpn-type5-vrf-10-irb | storage-leaf2_qfx5130-32cd | `$INSTANCE_NAME` purple, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-purple, `$IRB_IFL_1` irb.2800, `$IRB_IFL_10` irb.2809, `$IRB_IFL_2` irb.2801, `$IRB_IFL_3` irb.2802 |
| evpn-type5-vrf-dhcp-relay-10-irb | compute-leaf1_qfx5120-48ym | `$DHCP_RELAY_GROUP` green, `$INSTANCE_NAME` green, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-green, `$IRB_IFL_1` irb.2500, `$IRB_IFL_10` irb.2509, `$IRB_IFL_2` irb.2501 |
| evpn-type5-vrf-dhcp-relay-10-irb | compute-leaf2_qfx5120-48ym | `$DHCP_RELAY_GROUP` green, `$INSTANCE_NAME` green, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-green, `$IRB_IFL_1` irb.2500, `$IRB_IFL_10` irb.2509, `$IRB_IFL_2` irb.2501 |
| evpn-type5-vrf-dhcp-relay-20-irb | compute-leaf1_qfx5120-48ym | `$DHCP_RELAY_GROUP` red, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409, `$IRB_IFL_11` irb.410 |
| evpn-type5-vrf-dhcp-relay-20-irb | compute-leaf2_qfx5120-48ym | `$DHCP_RELAY_GROUP` red, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409, `$IRB_IFL_11` irb.410 |
| evpn-type5-vrf-dhcp-relay-20-irb | storage-leaf1_qfx5130-32cd | `$DHCP_RELAY_GROUP` red, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409, `$IRB_IFL_11` irb.420 |
| evpn-type5-vrf-dhcp-relay-20-irb | storage-leaf2_qfx5130-32cd | `$DHCP_RELAY_GROUP` red, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409, `$IRB_IFL_11` irb.420 |
| evpn-type5-vrf-ospf-pim-oism | compute-leaf1_qfx5120-48ym | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.3500, `$IRB_IFL_10` irb.1408, `$IRB_IFL_11` irb.1409 |
| evpn-type5-vrf-ospf-pim-oism | compute-leaf2_qfx5120-48ym | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.3500, `$IRB_IFL_10` irb.1408, `$IRB_IFL_11` irb.1409 |
| evpn-type5-vrf-ospf-pim-oism | storage-leaf1_qfx5130-32cd | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.3500, `$IRB_IFL_10` irb.1408, `$IRB_IFL_11` irb.1409 |
| evpn-type5-vrf-ospf-pim-oism | storage-leaf2_qfx5130-32cd | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.3500, `$IRB_IFL_10` irb.1408, `$IRB_IFL_11` irb.1409 |
| border-evpn-type5-vrf-ebgp | services-leaf1_qfx5130-48c | `$AC_IFL` et-0/0/7.599, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-purple-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-purple-external_router, `$CE_PEER_V4` 10.204.0.17 |
| border-evpn-type5-vrf-ebgp | services-leaf2_qfx5130-48c | `$AC_IFL` et-0/0/7.599, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-purple-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-purple-external_router, `$CE_PEER_V4` 10.204.0.19 |
| border-evpn-type5-vrf-ebgp-10-irb | services-leaf1_qfx5130-48c | `$AC_IFL` et-0/0/7.399, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-yellow-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-yellow-external_router, `$CE_PEER_V4` 10.204.0.1 |
| border-evpn-type5-vrf-ebgp-10-irb | services-leaf2_qfx5130-48c | `$AC_IFL` et-0/0/7.399, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-yellow-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-yellow-external_router, `$CE_PEER_V4` 10.204.0.3 |
| border-evpn-type5-vrf-ebgp-dhcp-relay | services-leaf1_qfx5130-48c | `$AC_IFL` et-0/0/7.499, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-green-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-green-external_router, `$CE_PEER_V4` 10.204.0.13 |
| border-evpn-type5-vrf-ebgp-dhcp-relay | services-leaf2_qfx5130-48c | `$AC_IFL` et-0/0/7.499, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-green-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-green-external_router, `$CE_PEER_V4` 10.204.0.15 |
| border-evpn-type5-vrf-ebgp-dhcp-relay-20-irb | services-leaf1_qfx5130-48c | `$AC_IFL` et-0/0/7.199, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-red-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-red-external_router, `$CE_PEER_V4` 10.204.0.5 |
| border-evpn-type5-vrf-ebgp-dhcp-relay-20-irb | services-leaf2_qfx5130-48c | `$AC_IFL` et-0/0/7.199, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-red-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-red-external_router, `$CE_PEER_V4` 10.204.0.7 |
| border-evpn-type5-vrf-ebgp-ospf-pim-oism | services-leaf1_qfx5130-48c | `$AC_ADDR_V4` 100.100.100.100, `$AC_IFL` et-0/0/7.299, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-blue-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-blue-external_router |
| border-evpn-type5-vrf-ebgp-ospf-pim-oism | services-leaf2_qfx5130-48c | `$AC_ADDR_V4` 100.100.100.100, `$AC_IFL` et-0/0/7.299, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-blue-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-blue-external_router |

A MAC-VRF or Type 5 VRF uses the same instance name, VNIs and route targets on every leaf that carries it; the route distinguisher starts with each leaf's own loopback.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into `jvd-5stage-snips.md` by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: minimum
# devices:
#   compute-leaf1: { name: <hostname>, os: junos, loopback4: <addr> }
#   storage-leaf1: { name: <hostname>, os: evo, loopback4: <addr> }
# services:
#   - { kind: <evpn-mac-vrf-51-vlans-igmp-snooping|evpn-mac-vrf-51-vlans-igmp-snooping-oism|evpn-type5-vrf-10-irb|evpn-type5-vrf-dhcp-relay-10-irb|evpn-type5-vrf-dhcp-relay-20-irb|evpn-type5-vrf-ospf-pim-oism|border-evpn-type5-vrf-ebgp|border-evpn-type5-vrf-ebgp-10-irb|border-evpn-type5-vrf-ebgp-dhcp-relay|border-evpn-type5-vrf-ebgp-dhcp-relay-20-irb|border-evpn-type5-vrf-ebgp-ospf-pim-oism>,
#       count: <int>,
#       start_id: <int>,
#       ac_ifl: <ifd.unit>,
#       rt: <rt_as:rt_id>,
#       rd: <admin:assigned> }
# snips_used:
#   - evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-10-irb.conf
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
- Cross-device consistency the user must verify: a MAC-VRF or Type 5 VRF uses the same instance name, VNIs and route targets on every leaf that carries it; each leaf's route distinguisher starts with that leaf's own loopback; the IRB units a VRF lists must exist in the leaf's MAC-VRF VLANs, and the VRF loopback unit must exist on the leaf.
- Anything that is by-pattern rather than validated on that exact device.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
