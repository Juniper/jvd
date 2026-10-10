# JVD Enterprise WAN for Finance & Stock Exchange snippet library

## evo/chassis/aggregated-devices-ethernet.conf

```
/*
 * Topic: Aggregated-Ethernet device count
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_acx7100-48l l2-l3_edge_acx7100 p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   cr1_acx7100-48l 1
 *   l2-l3_edge_acx7100 1
 *   p1_ptx10003-80c 1
 *   p2_ptx10001-36mr 1
 *   total 4
 * Highlights:
 *  - Allocates the number of `ae` interfaces the chassis may create; it must cover the highest `aeN` configured.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from cr1_acx7100-48l):
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

## evo/chassis/dump-on-panic.conf

```
/*
 * Topic: Core dump on kernel panic
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_acx7100-48l l2-l3_edge_acx7100 p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   cr1_acx7100-48l 1
 *   l2-l3_edge_acx7100 1
 *   p1_ptx10003-80c 1
 *   p2_ptx10001-36mr 1
 *   total 4
 * Highlights:
 *  - Writes a kernel core dump when the system panics, preserving evidence for post-incident analysis.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
chassis {
    dump-on-panic;
}
```

## evo/chassis/fpc-ptx10003-5x100g-1x40g.conf

```
/*
 * Topic: PTX10003 FPC with five 100G ports and one 40G port
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003-80c
 * Count:
 *   p1_ptx10003-80c 1
 *   total 1
 * Highlights:
 *  - Sets per-port speeds on two PICs: five ports at 100G and one at 40G.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p1_ptx10003-80c):
 *   $FPC_SLOT   e.g. 1
 */
chassis {
    fpc $FPC_SLOT {
        pic 0 {
            port 0 {
                speed 100g;
            }
            port 1 {
                speed 40g;
            }
            port 5 {
                speed 100g;
            }
        }
        pic 1 {
            port 5 {
                speed 100g;
            }
            port 6 {
                speed 100g;
            }
            port 7 {
                speed 100g;
            }
        }
    }
}
```

## evo/chassis/fpc-ptx10003-6x100g-1x40g-3x4x10g.conf

```
/*
 * Topic: PTX10003 FPC with six 100G ports, one 40G port and three 4x10G ports
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003-80c
 * Count:
 *   p1_ptx10003-80c 1
 *   total 1
 * Highlights:
 *  - Sets per-port speeds on two PICs: six ports at 100G, one at 40G and three channelised into four 10G sub-ports.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p1_ptx10003-80c):
 *   $FPC_SLOT   e.g. 0
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
                number-of-sub-ports 4;
                speed 10g;
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
            port 8 {
                speed 100g;
            }
        }
        pic 1 {
            port 3 {
                speed 40g;
            }
            port 4 {
                number-of-sub-ports 4;
                speed 10g;
            }
            port 9 {
                number-of-sub-ports 4;
                speed 10g;
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
 *   EVO: cr1_acx7100-48l
 * Count:
 *   cr1_acx7100-48l 1
 *   total 1
 * Highlights:
 *  - Sets the chassis network-services mode to enhanced IP.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
chassis {
    network-services enhanced-ip;
}
```

## evo/class-of-service/classifiers/cl-exp-4class.conf

```
/*
 * Topic: EXP classifier for the four-class model
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   p1_ptx10003-80c 1
 *   p2_ptx10001-36mr 1
 *   total 2
 * Highlights:
 *  - Maps MPLS EXP code points 000-011 to BEST-EFFORT, FC-HIGH, FC-LLQ and CONTROL, all at low loss priority.
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-4queue-model.conf
 *
 * Peers with: n/a
 * Variables: none
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
}
```

## evo/class-of-service/forwarding-classes/fc-4queue-model.conf

```
/*
 * Topic: CoS forwarding classes (four-queue model)
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   p1_ptx10003-80c 1
 *   p2_ptx10001-36mr 1
 *   total 2
 * Highlights:
 *  - BEST-EFFORT, FC-HIGH, FC-LLQ and CONTROL on queues 0-3; FC-LLQ is the low-latency queue that carries the market-data multicast.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    forwarding-classes {
        class FC-HIGH queue-num 1;
        class BEST-EFFORT queue-num 0;
        class CONTROL queue-num 3;
        class FC-LLQ queue-num 2;
    }
}
```

## evo/class-of-service/interfaces/ifd-scheduler-map.conf

```
/*
 * Topic: Interface scheduler-map application
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   p1_ptx10003-80c 4
 *   p2_ptx10001-36mr 4
 *   total 8
 * Highlights:
 *  - Applies `sched-map` to the physical or aggregated interface, so its queues are scheduled by the four-class model.
 * Pair with:
 *  - evo/class-of-service/scheduler-maps/sm-4class-mapping.conf
 *
 * Peers with: n/a
 * Variables (example values from p1_ptx10003-80c):
 *   $COS_INTF   e.g. et-0/0/0
 */
class-of-service {
    interfaces {
        $COS_INTF {
            scheduler-map sched-map;
        }
    }
}
```

## evo/class-of-service/interfaces/ifl-exp-classifier-rewrite.conf

```
/*
 * Topic: Per-unit EXP classifier and rewrite application
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   p1_ptx10003-80c 4
 *   p2_ptx10001-36mr 4
 *   total 8
 * Highlights:
 *  - Classifies incoming MPLS traffic by EXP and rewrites EXP on egress for the unit, keeping the class across the core link.
 * Pair with:
 *  - evo/class-of-service/classifiers/cl-exp-4class.conf
 *  - evo/class-of-service/rewrite-rules/rr-exp-4class.conf
 *
 * Peers with: n/a
 * Variables (example values from p1_ptx10003-80c):
 *   $COS_INTF   e.g. et-0/0/0
 *   $UNIT       e.g. 0
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                classifiers {
                    exp EXP;
                }
                rewrite-rules {
                    exp EXP_REWRITE;
                }
            }
        }
    }
}
```

## evo/class-of-service/rewrite-rules/rr-exp-4class.conf

```
/*
 * Topic: EXP rewrite rule for the four-class model
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   p1_ptx10003-80c 1
 *   p2_ptx10001-36mr 1
 *   total 2
 * Highlights:
 *  - Marks each forwarding class with the same EXP code point the EXP classifier maps it from, so the class survives every MPLS hop.
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-4queue-model.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
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
}
```

## evo/class-of-service/scheduler-maps/sm-4class-mapping.conf

```
/*
 * Topic: Scheduler map for the four-class model
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   p1_ptx10003-80c 1
 *   p2_ptx10001-36mr 1
 *   total 2
 * Highlights:
 *  - Binds BEST-EFFORT, FC-HIGH, FC-LLQ and CONTROL to schedulers s0-s3.
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-4queue-model.conf
 *  - evo/class-of-service/schedulers/sc-4class-priority.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    scheduler-maps {
        sched-map {
            forwarding-class BEST-EFFORT scheduler s0;
            forwarding-class FC-HIGH scheduler s1;
            forwarding-class FC-LLQ scheduler s2;
            forwarding-class CONTROL scheduler s3;
        }
    }
}
```

## evo/class-of-service/schedulers/sc-4class-priority.conf

```
/*
 * Topic: Priority-only schedulers for the four-class model
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   p1_ptx10003-80c 1
 *   p2_ptx10001-36mr 1
 *   total 2
 * Highlights:
 *  - s2 (FC-LLQ) is strict-high priority and the other three schedulers are low priority, with no transmit or shaping rates.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
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

## evo/interfaces/ifd-ae-description-flexible-mtu-lacp.conf

```
/*
 * Topic: Described LACP aggregate with flexible VLAN tagging, MTU 1522 and flexible Ethernet services
 * Seen on:
 *   Junos: (none)
 *   EVO: l2-l3_edge_acx7100
 * Count:
 *   l2-l3_edge_acx7100 1
 *   total 1
 * Highlights:
 *  - One bundle with members toward both WAN edges, which present it a single-active Ethernet segment; LACP runs active.
 * Pair with: none
 * Variables (example values from l2-l3_edge_acx7100):
 *   $IFD           e.g. ae0
 *   $DESCRIPTION   e.g. "L2/L3 to WANEDGE1/2"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        flexible-vlan-tagging;
        mtu 1522;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            lacp {
                active;
            }
        }
    }
}
```

## evo/interfaces/ifd-breakout-10g.conf

```
/*
 * Topic: Port channelised into 10G sub-ports
 * Seen on:
 *   Junos: (none)
 *   EVO: l2-l3_edge_acx7100
 * Count:
 *   l2-l3_edge_acx7100 2
 *   total 2
 * Highlights:
 *  - `number-of-sub-ports` with `speed 10g` breaks the port out into 10G channels (`:0`-`:N` interfaces).
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from l2-l3_edge_acx7100):
 *   $IFD                  e.g. et-0/0/48
 *   $BREAKOUT_SUB_PORTS   e.g. 4
 */
interfaces {
    $IFD {
        number-of-sub-ports $BREAKOUT_SUB_PORTS;
        speed 10g;
    }
}
```

## evo/interfaces/ifd-description-100g.conf

```
/*
 * Topic: Described 100G interface device
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 4
 *   total 4
 * Highlights:
 *  - Describes the physical port and runs it at 100G; its logical units are configured separately.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p2_ptx10001-36mr):
 *   $IFD           e.g. et-0/2/11
 *   $DESCRIPTION   e.g. "P2_AP1"
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
 *   EVO: cr1_acx7100-48l
 * Count:
 *   cr1_acx7100-48l 2
 *   total 2
 * Highlights:
 *  - Runs the port at 100G and carries one routed VLAN unit per virtual router toward the access point.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from cr1_acx7100-48l):
 *   $IFD           e.g. et-0/0/49
 *   $DESCRIPTION   e.g. CR1_to_AP1
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

## evo/interfaces/ifd-description-flexible-speed-10g-mtu.conf

```
/*
 * Topic: Described 10G port with flexible VLAN tagging, MTU 1522 and flexible Ethernet services
 * Seen on:
 *   Junos: (none)
 *   EVO: l2-l3_edge_acx7100
 * Count:
 *   l2-l3_edge_acx7100 1
 *   total 1
 * Highlights:
 *  - MTU 1522 admits a full 1500-byte payload with one VLAN tag; each unit is a Layer 2 vlan-bridge attachment.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from l2-l3_edge_acx7100):
 *   $IFD           e.g. et-0/0/47
 *   $DESCRIPTION   e.g. "L2/L3 to TG-9/1"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        flexible-vlan-tagging;
        speed 10g;
        mtu 1522;
        encapsulation flexible-ethernet-services;
    }
}
```

## evo/interfaces/ifd-description.conf

```
/*
 * Topic: Physical interface description
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003-80c
 * Count:
 *   p1_ptx10003-80c 4
 *   total 4
 * Highlights:
 *  - Names the far end of the link; the logical units beneath it are separate fragments.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p1_ptx10003-80c):
 *   $IFD           e.g. et-0/0/3
 *   $DESCRIPTION   e.g. "Link to P1Node to AP1Node"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
    }
}
```

## evo/interfaces/ifd-flexible-ethernet-services-description.conf

```
/*
 * Topic: Physical port with a description, flexible VLAN tagging and flexible Ethernet services
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_acx7100-48l
 * Count:
 *   cr1_acx7100-48l 1
 *   total 1
 * Highlights:
 *  - `flexible-vlan-tagging` with `flexible-ethernet-services` lets each VLAN unit on the port carry its own family, one routed unit per VRF or virtual router.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from cr1_acx7100-48l):
 *   $IFD           e.g. et-0/0/42
 *   $DESCRIPTION   e.g. "CR1 to TG-9/2"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
    }
}
```

## evo/interfaces/ifd-lag-member-ether-description-speed-10g.conf

```
/*
 * Topic: Described 10G member link of an aggregated-Ethernet bundle
 * Seen on:
 *   Junos: (none)
 *   EVO: l2-l3_edge_acx7100
 * Count:
 *   l2-l3_edge_acx7100 1
 *   total 1
 * Highlights:
 *  - Runs the port at 10G and assigns it to its bundle with `ether-options 802.3ad`.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from l2-l3_edge_acx7100):
 *   $IFD           e.g. et-0/0/46
 *   $DESCRIPTION   e.g. "L2/L3 to Wanedge2"
 *   $AE_BUNDLE     e.g. ae0
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

## evo/interfaces/ifd-lag-member-ether-description.conf

```
/*
 * Topic: Described member link of an aggregated-Ethernet bundle
 * Seen on:
 *   Junos: (none)
 *   EVO: l2-l3_edge_acx7100
 * Count:
 *   l2-l3_edge_acx7100 1
 *   total 1
 * Highlights:
 *  - `ether-options 802.3ad` assigns the port to its bundle; every Layer 2 setting lives on the `ae` interface.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from l2-l3_edge_acx7100):
 *   $IFD           e.g. et-0/0/48:0
 *   $DESCRIPTION   e.g. "L2/L3 to Wanedge1"
 *   $AE_BUNDLE     e.g. ae0
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

## evo/interfaces/ifd-speed-100g.conf

```
/*
 * Topic: Interface device at 100G
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_acx7100-48l l2-l3_edge_acx7100 p2_ptx10001-36mr
 * Count:
 *   cr1_acx7100-48l 3
 *   l2-l3_edge_acx7100 2
 *   p2_ptx10001-36mr 11
 *   total 16
 * Highlights:
 *  - Sets the port speed to 100G.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from cr1_acx7100-48l):
 *   $IFD   e.g. et-0/0/50
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
 *   EVO: l2-l3_edge_acx7100
 * Count:
 *   l2-l3_edge_acx7100 1
 *   total 1
 * Highlights:
 *  - Sets the port speed to 10G.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from l2-l3_edge_acx7100):
 *   $IFD   e.g. et-0/0/45
 */
interfaces {
    $IFD {
        speed 10g;
    }
}
```

## evo/interfaces/ifd-speed-40g.conf

```
/*
 * Topic: Interface device at 40G
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_acx7100-48l
 * Count:
 *   cr1_acx7100-48l 1
 *   total 1
 * Highlights:
 *  - Sets the port speed to 40G.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from cr1_acx7100-48l):
 *   $IFD   e.g. et-0/0/52
 */
interfaces {
    $IFD {
        speed 40g;
    }
}
```

## evo/interfaces/ifl-core-inet-iso-mpls.conf

```
/*
 * Topic: Core logical interface with IPv4, ISO and MPLS
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   p1_ptx10003-80c 4
 *   p2_ptx10001-36mr 4
 *   total 8
 * Highlights:
 *  - Carries the OSPF/RSVP-TE underlay (IPv4) and MPLS-labelled traffic on the core link.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p1_ptx10003-80c):
 *   $IFD            e.g. et-0/0/0
 *   $UNIT           e.g. 0
 *   $CORE_V4_ADDR   e.g. 10.101.23.2/24
 */
interfaces {
    $IFD {
        unit $UNIT {
            family inet {
                address $CORE_V4_ADDR;
            }
            family iso;
            family mpls;
        }
    }
}
```

## evo/interfaces/ifl-description-vlan-inet.conf

```
/*
 * Topic: Described tagged routed unit with an IPv4 address
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_acx7100-48l
 * Count:
 *   cr1_acx7100-48l 1
 *   total 1
 * Highlights:
 *  - A VLAN sub-interface with its own description and IPv4 subnet.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from cr1_acx7100-48l):
 *   $IFD           e.g. et-0/0/42
 *   $UNIT          e.g. 100
 *   $DESCRIPTION   e.g. For_OSPF_route_Push
 *   $VLAN          e.g. 100
 *   $AC_ADDR_V4    e.g. 10.101.201.1/24
 */
interfaces {
    $IFD {
        unit $UNIT {
            description $DESCRIPTION;
            vlan-id $VLAN;
            family inet {
                address $AC_ADDR_V4;
            }
        }
    }
}
```

## evo/interfaces/ifl-loopback-localhost-127-64-mgmt-iso-inet6.conf

```
/*
 * Topic: Loopback with two localhost and management IPv4 addresses, ISO and IPv6
 * Seen on:
 *   Junos: (none)
 *   EVO: l2-l3_edge_acx7100
 * Count:
 *   l2-l3_edge_acx7100 1
 *   total 1
 * Highlights:
 *  - The management address is the primary IPv4 loopback and equals the router ID.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from l2-l3_edge_acx7100):
 *   $LOOPBACK_MGMT_V4_PFX   e.g. 10.255.163.58/32
 *   $ISO_NET                e.g. 47.0005.80ff.f800.0000.0108.0001.0102.5516.3058.00
 *   $LOOPBACK_V6_PFX        e.g. 2001:db8::10:255:163:58/128
 */
interfaces {
    lo0 {
        unit 0 {
            family inet {
                address 127.0.0.1/32;
                address 127.0.0.64/32;
                address $LOOPBACK_MGMT_V4_PFX {
                    primary;
                }
            }
            family iso {
                address $ISO_NET;
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

## evo/interfaces/ifl-loopback-primary-localhost-127-64-mgmt-iso-inet6.conf

```
/*
 * Topic: Loopback with primary, two localhost and management IPv4 addresses, ISO and IPv6
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_acx7100-48l p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   cr1_acx7100-48l 1
 *   p1_ptx10003-80c 1
 *   p2_ptx10001-36mr 1
 *   total 3
 * Highlights:
 *  - Carries the design loopback (primary, preferred, equal to the router ID), 127.0.0.1, 127.0.0.64 and the management loopback (primary), plus ISO and IPv6 addresses.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from cr1_acx7100-48l):
 *   $LOOPBACK_V4_PFX        e.g. 10.200.50.9/32
 *   $LOOPBACK_MGMT_V4_PFX   e.g. 10.255.165.85/32
 *   $ISO_NET                e.g. 47.0005.80ff.f800.0000.0108.0001.0102.5516.5085.00
 *   $LOOPBACK_V6_PFX        e.g. 2001:db8::10:255:165:85/128
 */
interfaces {
    lo0 {
        unit 0 {
            family inet {
                address $LOOPBACK_V4_PFX {
                    primary;
                    preferred;
                }
                address 127.0.0.1/32;
                address 127.0.0.64/32;
                address $LOOPBACK_MGMT_V4_PFX {
                    primary;
                }
            }
            family iso {
                address $ISO_NET;
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

## evo/interfaces/ifl-vlan-bridge.conf

```
/*
 * Topic: Single-VLAN Layer 2 unit with vlan-bridge encapsulation
 * Seen on:
 *   Junos: (none)
 *   EVO: l2-l3_edge_acx7100
 * Count:
 *   l2-l3_edge_acx7100 26
 *   total 26
 * Highlights:
 *  - One unit per VLAN; `encapsulation vlan-bridge` makes the unit a Layer 2 member of its VLAN.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from l2-l3_edge_acx7100):
 *   $IFD    e.g. ae0
 *   $UNIT   e.g. 1
 *   $VLAN   e.g. 1
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

## evo/interfaces/ifl-vlan-inet.conf

```
/*
 * Topic: Tagged routed unit with an IPv4 address (VLAN sub-interface)
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_acx7100-48l
 * Count:
 *   cr1_acx7100-48l 40
 *   total 40
 * Highlights:
 *  - One VLAN unit per VRF or virtual router on the PE-CE link; the unit belongs to that routing instance.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from cr1_acx7100-48l):
 *   $IFD          e.g. et-0/0/49
 *   $UNIT         e.g. 100
 *   $VLAN         e.g. 100
 *   $AC_ADDR_V4   e.g. 10.101.200.2/24
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

## evo/policy-options/policy-statement/ps-accept-bgp.conf

```
/*
 * Topic: Policy accepting BGP routes
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_acx7100-48l p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   cr1_acx7100-48l 1
 *   p1_ptx10003-80c 1
 *   p2_ptx10001-36mr 1
 *   total 3
 * Highlights:
 *  - Used as a protocol export to redistribute BGP-learned routes.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from cr1_acx7100-48l):
 *   $POLICY_NAME   e.g. PS-BGP-TO-OSPF
 */
policy-options {
    policy-statement $POLICY_NAME {
        from protocol bgp;
        then accept;
    }
}
```

## evo/policy-options/policy-statement/ps-accept-direct.conf

```
/*
 * Topic: Policy accepting directly connected routes
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_acx7100-48l p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   cr1_acx7100-48l 1
 *   p1_ptx10003-80c 1
 *   p2_ptx10001-36mr 1
 *   total 3
 * Highlights:
 *  - Applied as the `export` of the PE-CE eBGP groups in the VRFs.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from cr1_acx7100-48l):
 *   $POLICY_NAME   e.g. PS-ADV_DIRECT
 */
policy-options {
    policy-statement $POLICY_NAME {
        from protocol direct;
        then accept;
    }
}
```

## evo/policy-options/policy-statement/ps-accept-ospf.conf

```
/*
 * Topic: Policy accepting OSPF routes
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_acx7100-48l p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   cr1_acx7100-48l 1
 *   p1_ptx10003-80c 1
 *   p2_ptx10001-36mr 1
 *   total 3
 * Highlights:
 *  - Used as a protocol export to redistribute OSPF-learned routes.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from cr1_acx7100-48l):
 *   $POLICY_NAME   e.g. PS-send-ospf
 */
policy-options {
    policy-statement $POLICY_NAME {
        from protocol ospf;
        then accept;
    }
}
```

## evo/policy-options/policy-statement/ps-default-longer-metric-30.conf

```
/*
 * Topic: Policy setting metric 30 on every IPv4 route
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_acx7100-48l
 * Count:
 *   cr1_acx7100-48l 1
 *   total 1
 * Highlights:
 *  - As a BGP export it advertises all remaining routes with MED 30, the less preferred path in the MED-based steering design.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from cr1_acx7100-48l):
 *   $POLICY_NAME   e.g. PS-med-30
 */
policy-options {
    policy-statement $POLICY_NAME {
        from {
            route-filter 0.0.0.0/0 longer;
        }
        then {
            metric 30;
            accept;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-route-filter-exact-metric-10.conf

```
/*
 * Topic: Policy setting metric 10 on one exact prefix
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_acx7100-48l
 * Count:
 *   cr1_acx7100-48l 1
 *   total 1
 * Highlights:
 *  - As a BGP export it advertises the matched prefix with MED 10, the preferred path in the MED-based steering design.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from cr1_acx7100-48l):
 *   $POLICY_NAME   e.g. PS-med-10
 *   $PREFIX        e.g. 10.101.0.0/16
 */
policy-options {
    policy-statement $POLICY_NAME {
        from {
            route-filter $PREFIX exact;
        }
        then {
            metric 10;
            accept;
        }
    }
}
```

## evo/protocols/bgp-ibgp-full-mesh-5.conf

```
/*
 * Topic: iBGP group with five loopback neighbors for IPv4, L3VPN, EVPN and NG-MVPN
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   p1_ptx10003-80c 1
 *   p2_ptx10001-36mr 1
 *   total 2
 * Highlights:
 *  - One internal group carries IPv4 unicast, `inet-vpn` (unicast and any), EVPN signaling, `inet-mvpn` signaling for NG-MVPN Type-5/Type-7 routes and route-target constrained distribution.
 *  - BFD at 100 ms x 3 protects every session.
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-accept-bgp.conf
 *  - evo/policy-options/policy-statement/ps-accept-ospf.conf
 *
 * Peers with:
 *   [ap1_mx304] <-> [p1_ptx10003-80c]
 *   [ap1_mx304] <-> [p2_ptx10001-36mr]
 *   [ap2_mx10004] <-> [p1_ptx10003-80c]
 *   [ap2_mx10004] <-> [p2_ptx10001-36mr]
 *   [p1_ptx10003-80c] <-> [p2_ptx10001-36mr]
 *   [p1_ptx10003-80c] <-> [wanedge1_mx304]
 *   [p1_ptx10003-80c] <-> [wanedge2_mx10004]
 *   [p2_ptx10001-36mr] <-> [wanedge1_mx304]
 *   [p2_ptx10001-36mr] <-> [wanedge2_mx10004]
 * Variables (example values from p1_ptx10003-80c):
 *   $LOOPBACK_V4        e.g. 10.200.50.13
 *   $BGP_EXPORT_POL_1   e.g. PS-send-ospf
 *   $BGP_EXPORT_POL_2   e.g. PS-BGP-TO-OSPF
 *   $ASN                e.g. 64512
 *   $IBGP_PEER_V4_1     e.g. 10.200.50.15
 *   $IBGP_PEER_V4_2     e.g. 10.200.50.14
 *   $IBGP_PEER_V4_3     e.g. 10.200.50.12
 *   $IBGP_PEER_V4_4     e.g. 10.200.50.11
 *   $IBGP_PEER_V4_5     e.g. 10.200.50.16
 */
protocols {
    bgp {
        group IBGP {
            type internal;
            local-address $LOOPBACK_V4;
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
            export [ $BGP_EXPORT_POL_1 $BGP_EXPORT_POL_2 ];
            local-as $ASN;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor $IBGP_PEER_V4_1;
            neighbor $IBGP_PEER_V4_2;
            neighbor $IBGP_PEER_V4_3;
            neighbor $IBGP_PEER_V4_4;
            neighbor $IBGP_PEER_V4_5;
        }
    }
}
```

## evo/protocols/lldp-interface-all.conf

```
/*
 * Topic: LLDP on all interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_acx7100-48l l2-l3_edge_acx7100 p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   cr1_acx7100-48l 1
 *   l2-l3_edge_acx7100 1
 *   p1_ptx10003-80c 1
 *   p2_ptx10001-36mr 1
 *   total 4
 * Highlights:
 *  - Enables LLDP neighbor discovery on every interface.
 * Pair with: none
 * Variables: none
 */
protocols {
    lldp {
        interface all;
    }
}
```

## evo/protocols/mpls-interface-4-core-loopback.conf

```
/*
 * Topic: MPLS on four core interfaces and the loopback
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   p1_ptx10003-80c 1
 *   p2_ptx10001-36mr 1
 *   total 2
 * Highlights:
 *  - Transit-only MPLS: enables label switching on the core links with no locally originated LSPs.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p1_ptx10003-80c):
 *   $CORE_INTF_1   e.g. et-0/0/0.0
 *   $CORE_INTF_2   e.g. et-0/0/3.0
 *   $CORE_INTF_3   e.g. et-0/0/1.0
 *   $CORE_INTF_4   e.g. et-0/0/4.0
 */
protocols {
    mpls {
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
        interface $CORE_INTF_3;
        interface $CORE_INTF_4;
        interface lo0.0;
    }
}
```

## evo/protocols/ospf-area0-bfd-4-core.conf

```
/*
 * Topic: OSPF area 0 with four BFD core interfaces and a passive loopback
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 1
 *   total 1
 * Highlights:
 *  - BFD at 10 ms x 3 gives fast failure detection on every core link.
 * Pair with: none
 * Variables (example values from p2_ptx10001-36mr):
 *   $CORE_INTF_1   e.g. et-0/0/2.0
 *   $CORE_INTF_2   e.g. et-0/2/8.0
 *   $CORE_INTF_3   e.g. et-0/2/10.0
 *   $CORE_INTF_4   e.g. et-0/2/11.0
 */
protocols {
    ospf {
        area 0.0.0.0 {
            interface $CORE_INTF_1 {
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                }
            }
            interface $CORE_INTF_2 {
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                }
            }
            interface $CORE_INTF_3 {
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                }
            }
            interface $CORE_INTF_4 {
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                }
            }
            interface lo0.0 {
                passive;
            }
        }
    }
}
```

## evo/protocols/ospf-area0-node-link-protection-bfd-4-core.conf

```
/*
 * Topic: OSPF area 0 with four node-link-protected BFD core interfaces and a passive loopback
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003-80c
 * Count:
 *   p1_ptx10003-80c 1
 *   total 1
 * Highlights:
 *  - `node-link-protection` precomputes a loop-free alternate that avoids the neighbor node; BFD at 10 ms x 3 detects the failure.
 * Pair with: none
 * Variables (example values from p1_ptx10003-80c):
 *   $CORE_INTF_1   e.g. et-0/0/0.0
 *   $CORE_INTF_2   e.g. et-0/0/1.0
 *   $CORE_INTF_3   e.g. et-0/0/3.0
 *   $CORE_INTF_4   e.g. et-0/0/4.0
 */
protocols {
    ospf {
        area 0.0.0.0 {
            interface $CORE_INTF_1 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                }
            }
            interface $CORE_INTF_2 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                }
            }
            interface $CORE_INTF_3 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                }
            }
            interface $CORE_INTF_4 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                }
            }
            interface lo0.0 {
                passive;
            }
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
 *   EVO: p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   p1_ptx10003-80c 1
 *   p2_ptx10001-36mr 1
 *   total 2
 * Highlights:
 *  - Floods TE information so RSVP-TE can compute constrained paths for the LSPs.
 * Pair with: none
 * Variables: none
 */
protocols {
    ospf {
        traffic-engineering;
    }
}
```

## evo/protocols/rsvp-interface-loopback-4-core.conf

```
/*
 * Topic: RSVP on the loopback and four core interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   p1_ptx10003-80c 1
 *   p2_ptx10001-36mr 1
 *   total 2
 * Highlights:
 *  - RSVP signals the point-to-point and P2MP RSVP-TE LSPs on every core link; the loopback is included so it can terminate signaling.
 * Pair with: none
 * Variables (example values from p1_ptx10003-80c):
 *   $CORE_INTF_1   e.g. et-0/0/0.0
 *   $CORE_INTF_2   e.g. et-0/0/1.0
 *   $CORE_INTF_3   e.g. et-0/0/3.0
 *   $CORE_INTF_4   e.g. et-0/0/4.0
 */
protocols {
    rsvp {
        interface lo0.0;
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
        interface $CORE_INTF_3;
        interface $CORE_INTF_4;
    }
}
```

## evo/routing-instances/virtual-router/ri-virtual-router-ebgp-ibgp-pim-static-rp.conf

```
/*
 * Topic: Virtual router with eBGP to two access points, an iBGP host session and PIM sparse mode with a static RP
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_acx7100-48l
 * Count:
 *   cr1_acx7100-48l 10
 *   total 10
 * Highlights:
 *  - eBGP to both access points exports routes through the MED-setting policies (metric 10 for one prefix, 30 for every other route).
 *  - PIM sparse mode on all three interfaces joins the market-data groups toward the static rendezvous point.
 * Pair with:
 *  - evo/interfaces/ifl-vlan-inet.conf
 *  - evo/policy-options/policy-statement/ps-default-longer-metric-30.conf
 *  - evo/policy-options/policy-statement/ps-route-filter-exact-metric-10.conf
 *
 * Variables (example values from cr1_acx7100-48l):
 *   $INSTANCE_NAME        e.g. VIRTUAL-ROUTER-V1
 *   $BGP_EXPORT_POL_1     e.g. PS-med-10
 *   $BGP_EXPORT_POL_2     e.g. PS-med-30
 *   $ASN_PROVIDER         e.g. 64512
 *   $PE_PEER_V4_1         e.g. 10.101.48.1
 *   $PE_PEER_V4_2         e.g. 10.101.78.1
 *   $ASN                  e.g. 64520
 *   $IBGP_PEER_V4         e.g. 10.101.81.2
 *   $PIM_RP_V4            e.g. 10.10.47.101
 *   $MCAST_GROUP_V4_PFX   e.g. 225.0.0.0/22
 *   $IFL_1                e.g. et-0/0/42.1
 *   $IFL_2                e.g. et-0/0/48.1
 *   $IFL_3                e.g. et-0/0/49.1
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-router;
        protocols {
            bgp {
                group AP {
                    type external;
                    export [ $BGP_EXPORT_POL_1 $BGP_EXPORT_POL_2 ];
                    peer-as $ASN_PROVIDER;
                    neighbor $PE_PEER_V4_1;
                    neighbor $PE_PEER_V4_2;
                }
                group IXIA {
                    type internal;
                    peer-as $ASN;
                    neighbor $IBGP_PEER_V4;
                }
            }
            pim {
                rp {
                    static {
                        address $PIM_RP_V4 {
                            group-ranges {
                                $MCAST_GROUP_V4_PFX;
                            }
                        }
                    }
                }
                interface $IFL_1 {
                    mode sparse;
                }
                interface $IFL_2 {
                    mode sparse;
                }
                interface $IFL_3 {
                    mode sparse;
                }
            }
        }
        interface $IFL_1;
        interface $IFL_2;
        interface $IFL_3;
    }
}
```

## evo/routing-instances/virtual-router/ri-virtual-router-ebgp-ibgp.conf

```
/*
 * Topic: Virtual router with eBGP to two access points and an iBGP host session
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_acx7100-48l
 * Count:
 *   cr1_acx7100-48l 3
 *   total 3
 * Highlights:
 *  - Unicast customer routing context: eBGP to both access points through the MED-setting export policies and iBGP to the attached host.
 * Pair with:
 *  - evo/interfaces/ifl-vlan-inet.conf
 *  - evo/policy-options/policy-statement/ps-default-longer-metric-30.conf
 *  - evo/policy-options/policy-statement/ps-route-filter-exact-metric-10.conf
 *
 * Variables (example values from cr1_acx7100-48l):
 *   $INSTANCE_NAME      e.g. VIRTUAL-ROUTER-V21
 *   $BGP_EXPORT_POL_1   e.g. PS-med-10
 *   $BGP_EXPORT_POL_2   e.g. PS-med-30
 *   $ASN_PROVIDER       e.g. 64512
 *   $PE_PEER_V4_1       e.g. 10.101.48.41
 *   $PE_PEER_V4_2       e.g. 10.101.78.41
 *   $ASN                e.g. 64520
 *   $IBGP_PEER_V4       e.g. 10.8.21.2
 *   $IFL_1              e.g. et-0/0/42.21
 *   $IFL_2              e.g. et-0/0/48.21
 *   $IFL_3              e.g. et-0/0/49.21
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-router;
        protocols {
            bgp {
                group AP {
                    type external;
                    export [ $BGP_EXPORT_POL_1 $BGP_EXPORT_POL_2 ];
                    peer-as $ASN_PROVIDER;
                    neighbor $PE_PEER_V4_1;
                    neighbor $PE_PEER_V4_2;
                }
                group IXIA {
                    type internal;
                    peer-as $ASN;
                    neighbor $IBGP_PEER_V4;
                }
            }
        }
        interface $IFL_1;
        interface $IFL_2;
        interface $IFL_3;
    }
}
```

## evo/routing-instances/virtual-router/ri-virtual-router-ospf-2-intf.conf

```
/*
 * Topic: Virtual router running OSPF area 0 on two interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_acx7100-48l
 * Count:
 *   cr1_acx7100-48l 1
 *   total 1
 * Highlights:
 *  - A separate routing context that exchanges routes over OSPF on two tagged units.
 * Pair with:
 *  - evo/interfaces/ifl-description-vlan-inet.conf
 *  - evo/interfaces/ifl-vlan-inet.conf
 *
 * Variables (example values from cr1_acx7100-48l):
 *   $INSTANCE_NAME   e.g. VIRTUAL-ROUTER-V100
 *   $IFL_1           e.g. et-0/0/42.100
 *   $IFL_2           e.g. et-0/0/49.100
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-router;
        protocols {
            ospf {
                area 0.0.0.0 {
                    interface $IFL_1;
                    interface $IFL_2;
                }
            }
        }
        interface $IFL_1;
        interface $IFL_2;
    }
}
```

## evo/routing-options/autonomous-system.conf

```
/*
 * Topic: Autonomous system number
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_acx7100-48l p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   cr1_acx7100-48l 1
 *   p1_ptx10003-80c 1
 *   p2_ptx10001-36mr 1
 *   total 3
 * Highlights:
 *  - The provider core shares one AS; each customer router has its own AS for eBGP to the access points.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from cr1_acx7100-48l):
 *   $ASN   e.g. 64520
 */
routing-options {
    autonomous-system $ASN;
}
```

## evo/routing-options/router-id.conf

```
/*
 * Topic: Router ID
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_acx7100-48l l2-l3_edge_acx7100 p1_ptx10003-80c p2_ptx10001-36mr
 * Count:
 *   cr1_acx7100-48l 1
 *   l2-l3_edge_acx7100 1
 *   p1_ptx10003-80c 1
 *   p2_ptx10001-36mr 1
 *   total 4
 * Highlights:
 *  - Explicit router ID; on the PE, P and CR routers it equals the primary lo0 address.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from cr1_acx7100-48l):
 *   $ROUTER_ID   e.g. 10.200.50.9
 */
routing-options {
    router-id $ROUTER_ID;
}
```

## evo/services/monitoring-twamp-client-cr1.conf

```
/*
 * Topic: TWAMP client with 26 control connections across the virtual routers
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_acx7100-48l
 * Count:
 *   cr1_acx7100-48l 1
 *   total 1
 * Highlights:
 *  - One control connection per access point and virtual router; each runs a test session toward the access point to measure SLA (latency, loss, jitter).
 * Pair with: none
 * Variables: none
 */
services {
    monitoring {
        twamp {
            client {
                control-connection CR14_1 {
                    target 10.101.48.1;
                    destination-port 862;
                    routing-instance VIRTUAL-ROUTER-V1;
                    test-start auto;
                    test-interval 5;
                    test-session CR1_T1 {
                        target 10.101.48.1;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR17_1 {
                    target 10.101.78.1;
                    destination-port 862;
                    routing-instance VIRTUAL-ROUTER-V1;
                    test-start auto;
                    test-interval 5;
                    test-session CR17_1 {
                        target 10.101.78.1;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR14_2 {
                    target 10.101.48.5;
                    destination-port 49152;
                    routing-instance VIRTUAL-ROUTER-V2;
                    test-start auto;
                    test-interval 5;
                    test-session CR1_T2 {
                        target 10.101.48.5;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR17_2 {
                    target 10.101.78.5;
                    destination-port 49152;
                    routing-instance VIRTUAL-ROUTER-V2;
                    test-start auto;
                    test-interval 5;
                    test-session CR17_2 {
                        target 10.101.78.5;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR14_3 {
                    target 10.101.48.9;
                    destination-port 49153;
                    routing-instance VIRTUAL-ROUTER-V3;
                    test-start auto;
                    test-interval 5;
                    test-session CR1_T3 {
                        target 10.101.48.9;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR17_3 {
                    target 10.101.78.9;
                    destination-port 49153;
                    routing-instance VIRTUAL-ROUTER-V3;
                    test-start auto;
                    test-interval 5;
                    test-session CR17_3 {
                        target 10.101.78.9;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR14_4 {
                    target 10.101.48.13;
                    destination-port 49154;
                    routing-instance VIRTUAL-ROUTER-V4;
                    test-start auto;
                    test-interval 5;
                    test-session CR1_T4 {
                        target 10.101.48.13;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR17_4 {
                    target 10.101.78.13;
                    destination-port 49154;
                    routing-instance VIRTUAL-ROUTER-V4;
                    test-start auto;
                    test-interval 5;
                    test-session CR17_4 {
                        target 10.101.78.13;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR14_5 {
                    target 10.101.48.17;
                    destination-port 49155;
                    routing-instance VIRTUAL-ROUTER-V5;
                    test-start auto;
                    test-interval 5;
                    test-session CR1_T5 {
                        target 10.101.48.17;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR17_5 {
                    target 10.101.78.17;
                    destination-port 49155;
                    routing-instance VIRTUAL-ROUTER-V5;
                    test-start auto;
                    test-interval 5;
                    test-session CR17_5 {
                        target 10.101.78.17;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR14_6 {
                    target 10.101.48.21;
                    destination-port 49156;
                    routing-instance VIRTUAL-ROUTER-V6;
                    test-start auto;
                    test-interval 5;
                    test-session CR1_T6 {
                        target 10.101.48.21;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR17_6 {
                    target 10.101.78.21;
                    destination-port 49156;
                    routing-instance VIRTUAL-ROUTER-V6;
                    test-start auto;
                    test-interval 5;
                    test-session CR17_6 {
                        target 10.101.78.21;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR14_7 {
                    target 10.101.48.25;
                    destination-port 49157;
                    routing-instance VIRTUAL-ROUTER-V7;
                    test-start auto;
                    test-interval 5;
                    test-session CR1_T7 {
                        target 10.101.48.25;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR17_7 {
                    target 10.101.78.25;
                    destination-port 49157;
                    routing-instance VIRTUAL-ROUTER-V7;
                    test-start auto;
                    test-interval 5;
                    test-session CR17_7 {
                        target 10.101.78.25;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR14_8 {
                    target 10.101.48.29;
                    destination-port 49158;
                    routing-instance VIRTUAL-ROUTER-V8;
                    test-start auto;
                    test-interval 5;
                    test-session CR1_T8 {
                        target 10.101.48.29;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR17_8 {
                    target 10.101.78.29;
                    destination-port 49158;
                    routing-instance VIRTUAL-ROUTER-V8;
                    test-start auto;
                    test-interval 5;
                    test-session CR17_8 {
                        target 10.101.78.29;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR14_9 {
                    target 10.101.48.33;
                    destination-port 49159;
                    routing-instance VIRTUAL-ROUTER-V9;
                    test-start auto;
                    test-interval 5;
                    test-session CR1_T9 {
                        target 10.101.48.33;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR17_9 {
                    target 10.101.78.33;
                    destination-port 49159;
                    routing-instance VIRTUAL-ROUTER-V9;
                    test-start auto;
                    test-interval 5;
                    test-session CR17_9 {
                        target 10.101.78.33;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR14_10 {
                    target 10.101.48.37;
                    destination-port 49160;
                    routing-instance VIRTUAL-ROUTER-V10;
                    test-start auto;
                    test-interval 5;
                    test-session CR1_T1 {
                        target 10.101.48.37;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR17_10 {
                    target 10.101.78.37;
                    destination-port 49160;
                    routing-instance VIRTUAL-ROUTER-V10;
                    test-start auto;
                    test-interval 5;
                    test-session CR17_1 {
                        target 10.101.78.37;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR14_21 {
                    target 10.101.48.41;
                    destination-port 49161;
                    routing-instance VIRTUAL-ROUTER-V21;
                    test-start auto;
                    test-interval 5;
                    test-session CR1_T1 {
                        target 10.101.48.41;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR17_21 {
                    target 10.101.78.41;
                    destination-port 49161;
                    routing-instance VIRTUAL-ROUTER-V21;
                    test-start auto;
                    test-interval 5;
                    test-session CR17_1 {
                        target 10.101.78.41;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR14_22 {
                    target 10.101.48.45;
                    destination-port 49162;
                    routing-instance VIRTUAL-ROUTER-V22;
                    test-start auto;
                    test-interval 5;
                    test-session CR1_T1 {
                        target 10.101.48.45;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR17_22 {
                    target 10.101.78.45;
                    destination-port 49162;
                    routing-instance VIRTUAL-ROUTER-V22;
                    test-start auto;
                    test-interval 5;
                    test-session CR17_1 {
                        target 10.101.78.45;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR14_23 {
                    target 10.101.48.49;
                    destination-port 49163;
                    routing-instance VIRTUAL-ROUTER-V23;
                    test-start auto;
                    test-interval 5;
                    test-session CR1_T1 {
                        target 10.101.48.49;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
                control-connection CR17_23 {
                    target 10.101.78.49;
                    destination-port 49163;
                    routing-instance VIRTUAL-ROUTER-V23;
                    test-start auto;
                    test-interval 5;
                    test-session CR17_1 {
                        target 10.101.78.49;
                        probe-count 10;
                        probe-interval 1;
                    }
                }
            }
        }
    }
}
```

## evo/vlans/vlan-two-interfaces.conf

```
/*
 * Topic: VLAN with two member interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: l2-l3_edge_acx7100
 * Count:
 *   l2-l3_edge_acx7100 13
 *   total 13
 * Highlights:
 *  - Bridges one VLAN between the access port and the aggregate toward the WAN edges.
 * Pair with: none
 * Variables (example values from l2-l3_edge_acx7100):
 *   $VLAN_NAME   e.g. vlan1
 *   $VLAN        e.g. 1
 *   $AC_IFL_A    e.g. ae0.1
 *   $AC_IFL_B    e.g. et-0/0/47.1
 */
vlans {
    $VLAN_NAME {
        vlan-id $VLAN;
        interface $AC_IFL_A;
        interface $AC_IFL_B;
    }
}
```

## junos/chassis/aggregated-devices-ethernet.conf

```
/*
 * Topic: Aggregated-Ethernet device count
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004 cr2_mx480 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   ap2_mx10004 1
 *   cr2_mx480 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 5
 * Highlights:
 *  - Allocates the number of `ae` interfaces the chassis may create; it must cover the highest `aeN` configured.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ap1_mx304):
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

## junos/chassis/dump-on-panic.conf

```
/*
 * Topic: Core dump on kernel panic
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004 cr2_mx480 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   ap2_mx10004 1
 *   cr2_mx480 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 5
 * Highlights:
 *  - Writes a kernel core dump when the system panics, preserving evidence for post-incident analysis.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
chassis {
    dump-on-panic;
}
```

## junos/chassis/fpc-mx10004-3x100g.conf

```
/*
 * Topic: MX10004 FPC with three 100G ports on PICs 0 and 3
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 1
 *   total 1
 * Highlights:
 *  - Runs the two cabled PIC 0 ports and one PIC 3 port at 100G.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge2_mx10004):
 *   $FPC_SLOT   e.g. 3
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
        }
        pic 3 {
            port 0 {
                speed 100g;
            }
        }
    }
}
```

## junos/chassis/fpc-mx10004-tunnel-100g-13x100g-5x4x10g.conf

```
/*
 * Topic: MX10004 FPC with 100G tunnel services, thirteen 100G ports and five 4x10G ports across six PICs
 * Seen on:
 *   Junos: ap2_mx10004
 *   EVO: (none)
 * Count:
 *   ap2_mx10004 1
 *   total 1
 * Highlights:
 *  - Reserves 100G of PIC 0 bandwidth for tunnel services; the remaining cabled ports run at 100G or are channelised into four 10G sub-ports.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ap2_mx10004):
 *   $FPC_SLOT   e.g. 0
 */
chassis {
    fpc $FPC_SLOT {
        pic 0 {
            tunnel-services {
                bandwidth 100g;
            }
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
                number-of-sub-ports 4;
                speed 10g;
            }
        }
        pic 1 {
            port 0 {
                number-of-sub-ports 4;
                speed 10g;
            }
            port 1 {
                number-of-sub-ports 4;
                speed 10g;
            }
            port 2 {
                number-of-sub-ports 4;
                speed 10g;
            }
        }
        pic 2 {
            port 1 {
                speed 100g;
            }
        }
        pic 3 {
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
        pic 4 {
            port 0 {
                speed 100g;
            }
            port 1 {
                speed 100g;
            }
            port 2 {
                number-of-sub-ports 4;
                speed 10g;
            }
            port 3 {
                speed 100g;
            }
        }
        pic 5 {
            port 1 {
                speed 100g;
            }
            port 3 {
                speed 100g;
            }
        }
    }
}
```

## junos/chassis/fpc-mx304-tunnel-10g-11x100g-1x4x10g.conf

```
/*
 * Topic: MX304 FPC with 10G tunnel services, eleven 100G ports and one 4x10G port
 * Seen on:
 *   Junos: ap1_mx304
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   total 1
 * Highlights:
 *  - Reserves 10G of PIC 0 bandwidth for tunnel services, runs eleven ports at 100G and channelises port 15 into four 10G sub-ports.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ap1_mx304):
 *   $FPC_SLOT   e.g. 0
 */
chassis {
    fpc $FPC_SLOT {
        pic 0 {
            tunnel-services {
                bandwidth 10g;
            }
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
            port 10 {
                speed 100g;
            }
            port 11 {
                speed 100g;
            }
            port 12 {
                speed 100g;
            }
            port 15 {
                number-of-sub-ports 4;
                speed 10g;
            }
        }
    }
}
```

## junos/chassis/fpc-mx304-tunnel-10g-6x100g-3x4x10g.conf

```
/*
 * Topic: MX304 FPC with 10G tunnel services, six 100G ports and three 4x10G ports
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *  - Reserves 10G of PIC 0 bandwidth for tunnel services, runs six ports at 100G and channelises three ports into four 10G sub-ports each.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $FPC_SLOT   e.g. 0
 */
chassis {
    fpc $FPC_SLOT {
        pic 0 {
            tunnel-services {
                bandwidth 10g;
            }
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
            port 9 {
                number-of-sub-ports 4;
                speed 10g;
            }
            port 11 {
                number-of-sub-ports 4;
                speed 10g;
            }
            port 13 {
                number-of-sub-ports 4;
                speed 10g;
            }
        }
    }
}
```

## junos/chassis/fpc-tunnel-services-10g.conf

```
/*
 * Topic: 10G tunnel services on a PIC
 * Seen on:
 *   Junos: ap1_mx304 cr2_mx480 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   cr2_mx480 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 4
 * Highlights:
 *  - Reserves 10G of PIC bandwidth for tunnel services.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ap1_mx304):
 *   $FPC_SLOT   e.g. 0
 *   $PIC_SLOT   e.g. 0
 */
chassis {
    fpc $FPC_SLOT {
        pic $PIC_SLOT {
            tunnel-services {
                bandwidth 10g;
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
 *   Junos: ap1_mx304 ap2_mx10004 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   ap2_mx10004 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 4
 * Highlights:
 *  - Sets the chassis network-services mode to enhanced IP.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
chassis {
    network-services enhanced-ip;
}
```

## junos/class-of-service/classifiers/cl-exp-4class.conf

```
/*
 * Topic: EXP classifier for the four-class model
 * Seen on:
 *   Junos: ap1_mx304 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 3
 * Highlights:
 *  - Maps MPLS EXP code points 000-011 to BEST-EFFORT, FC-HIGH, FC-LLQ and CONTROL, all at low loss priority.
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-4queue-model.conf
 *
 * Peers with: n/a
 * Variables: none
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
}
```

## junos/class-of-service/forwarding-classes/fc-4queue-model.conf

```
/*
 * Topic: CoS forwarding classes (four-queue model)
 * Seen on:
 *   Junos: ap1_mx304 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 3
 * Highlights:
 *  - BEST-EFFORT, FC-HIGH, FC-LLQ and CONTROL on queues 0-3; FC-LLQ is the low-latency queue that carries the market-data multicast.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    forwarding-classes {
        class FC-HIGH queue-num 1;
        class BEST-EFFORT queue-num 0;
        class CONTROL queue-num 3;
        class FC-LLQ queue-num 2;
    }
}
```

## junos/class-of-service/interfaces/ifd-description-scheduler-map.conf

```
/*
 * Topic: Interface scheduler-map application with a description
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 1
 *   total 1
 * Highlights:
 *  - Applies `sched-map` to the interface and carries a description on the CoS interface entry.
 * Pair with:
 *  - junos/class-of-service/scheduler-maps/sm-4class-mapping.conf
 *
 * Peers with: n/a
 * Variables (example values from wanedge2_mx10004):
 *   $COS_INTF      e.g. et-3/3/0
 *   $DESCRIPTION   e.g. "Wanedge2_to_P2"
 */
class-of-service {
    interfaces {
        $COS_INTF {
            description $DESCRIPTION;
            scheduler-map sched-map;
        }
    }
}
```

## junos/class-of-service/interfaces/ifd-scheduler-map.conf

```
/*
 * Topic: Interface scheduler-map application
 * Seen on:
 *   Junos: ap1_mx304 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 5
 *   wanedge1_mx304 3
 *   wanedge2_mx10004 2
 *   total 10
 * Highlights:
 *  - Applies `sched-map` to the physical or aggregated interface, so its queues are scheduled by the four-class model.
 * Pair with:
 *  - junos/class-of-service/scheduler-maps/sm-4class-mapping.conf
 *
 * Peers with: n/a
 * Variables (example values from ap1_mx304):
 *   $COS_INTF   e.g. et-0/0/11
 */
class-of-service {
    interfaces {
        $COS_INTF {
            scheduler-map sched-map;
        }
    }
}
```

## junos/class-of-service/interfaces/ifl-exp-classifier-rewrite.conf

```
/*
 * Topic: Per-unit EXP classifier and rewrite application
 * Seen on:
 *   Junos: ap1_mx304 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 3
 *   wanedge1_mx304 2
 *   wanedge2_mx10004 2
 *   total 7
 * Highlights:
 *  - Classifies incoming MPLS traffic by EXP and rewrites EXP on egress for the unit, keeping the class across the core link.
 * Pair with:
 *  - junos/class-of-service/classifiers/cl-exp-4class.conf
 *  - junos/class-of-service/rewrite-rules/rr-exp-4class.conf
 *
 * Peers with: n/a
 * Variables (example values from ap1_mx304):
 *   $COS_INTF   e.g. et-0/0/3
 *   $UNIT       e.g. 0
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                classifiers {
                    exp EXP;
                }
                rewrite-rules {
                    exp EXP_REWRITE;
                }
            }
        }
    }
}
```

## junos/class-of-service/rewrite-rules/rr-exp-4class.conf

```
/*
 * Topic: EXP rewrite rule for the four-class model
 * Seen on:
 *   Junos: ap1_mx304 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 3
 * Highlights:
 *  - Marks each forwarding class with the same EXP code point the EXP classifier maps it from, so the class survives every MPLS hop.
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-4queue-model.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
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
}
```

## junos/class-of-service/scheduler-maps/sm-4class-mapping.conf

```
/*
 * Topic: Scheduler map for the four-class model
 * Seen on:
 *   Junos: ap1_mx304 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 3
 * Highlights:
 *  - Binds BEST-EFFORT, FC-HIGH, FC-LLQ and CONTROL to schedulers s0-s3.
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-4queue-model.conf
 *  - junos/class-of-service/schedulers/sc-4class-rates.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    scheduler-maps {
        sched-map {
            forwarding-class BEST-EFFORT scheduler s0;
            forwarding-class FC-HIGH scheduler s1;
            forwarding-class FC-LLQ scheduler s2;
            forwarding-class CONTROL scheduler s3;
        }
    }
}
```

## junos/class-of-service/schedulers/sc-4class-rates.conf

```
/*
 * Topic: Schedulers with transmit and shaping rates for the four-class model
 * Seen on:
 *   Junos: ap1_mx304 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 3
 * Highlights:
 *  - s2 (FC-LLQ) is strict-high priority; s1 and s3 are rate-limited and shaped; s0 (BEST-EFFORT) takes the remainder.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    schedulers {
        s0 {
            transmit-rate {
                remainder;
            }
            priority low;
        }
        s1 {
            transmit-rate percent 20;
            shaping-rate percent 20;
            priority low;
        }
        s2 {
            transmit-rate percent 40;
            priority strict-high;
        }
        s3 {
            transmit-rate percent 20;
            shaping-rate percent 20;
            priority low;
        }
    }
}
```

## junos/firewall/filter-mfc-filter-low-latency-class-count.conf

```
/*
 * Topic: Interface-specific filter classifying a multicast group range into FC-LLQ with a counter
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *  - Traffic to the market-data multicast groups is counted and placed in the low-latency FC-LLQ class at low loss priority; everything else is accepted unchanged.
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-4queue-model.conf
 *
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $MCAST_GROUP_V4_PFX   e.g. 225.0.0.0/16
 */
firewall {
    family inet {
        filter mfc-filter {
            interface-specific;
            term stock_exch {
                from {
                    destination-address {
                        $MCAST_GROUP_V4_PFX;
                    }
                }
                then {
                    count c1;
                    loss-priority low;
                    forwarding-class FC-LLQ;
                }
            }
            term accept-all-else {
                then accept;
            }
        }
    }
}
```

## junos/firewall/filter-mfc-filter-low-latency-class.conf

```
/*
 * Topic: Interface-specific filter classifying a multicast group range into FC-LLQ
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 1
 *   total 1
 * Highlights:
 *  - Traffic to the market-data multicast groups is placed in the low-latency FC-LLQ class at low loss priority; everything else is accepted unchanged.
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-4queue-model.conf
 *
 * Peers with: n/a
 * Variables (example values from wanedge2_mx10004):
 *   $MCAST_GROUP_V4_PFX   e.g. 225.0.0.0/16
 */
firewall {
    family inet {
        filter mfc-filter {
            interface-specific;
            term stock_exch {
                from {
                    destination-address {
                        $MCAST_GROUP_V4_PFX;
                    }
                }
                then {
                    loss-priority low;
                    forwarding-class FC-LLQ;
                }
            }
            term accept-all-else {
                then accept;
            }
        }
    }
}
```

## junos/firewall/filter-mfc-filter1-fc-high.conf

```
/*
 * Topic: Interface-specific filter classifying two destination hosts into FC-HIGH
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *  - Unicast traffic to the two listed hosts is placed in FC-HIGH at low loss priority; everything else is accepted unchanged.
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-4queue-model.conf
 *
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $MATCH_DEST_V4_PFX_1   e.g. 10.8.21.2/32
 *   $MATCH_DEST_V4_PFX_2   e.g. 10.9.21.2/32
 */
firewall {
    family inet {
        filter mfc-filter1 {
            interface-specific;
            term stock_exch {
                from {
                    destination-address {
                        $MATCH_DEST_V4_PFX_1;
                        $MATCH_DEST_V4_PFX_2;
                    }
                }
                then {
                    loss-priority low;
                    forwarding-class FC-HIGH;
                }
            }
            term accept-all-else {
                then accept;
            }
        }
    }
}
```

## junos/firewall/filter-mfc-filter2-best-effort.conf

```
/*
 * Topic: Interface-specific filter classifying two destination hosts into BEST-EFFORT
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *  - Unicast traffic to the two listed hosts is placed in BEST-EFFORT at low loss priority; everything else is accepted unchanged.
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-4queue-model.conf
 *
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $MATCH_DEST_V4_PFX_1   e.g. 10.8.22.2/32
 *   $MATCH_DEST_V4_PFX_2   e.g. 10.9.22.2/32
 */
firewall {
    family inet {
        filter mfc-filter2 {
            interface-specific;
            term stock_exch {
                from {
                    destination-address {
                        $MATCH_DEST_V4_PFX_1;
                        $MATCH_DEST_V4_PFX_2;
                    }
                }
                then {
                    loss-priority low;
                    forwarding-class BEST-EFFORT;
                }
            }
            term accept-all-else {
                then accept;
            }
        }
    }
}
```

## junos/firewall/filter-mfc-filter3-control.conf

```
/*
 * Topic: Interface-specific filter classifying two destination hosts into CONTROL
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *  - Unicast traffic to the two listed hosts is placed in CONTROL at low loss priority; everything else is accepted unchanged.
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-4queue-model.conf
 *
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $MATCH_DEST_V4_PFX_1   e.g. 10.8.23.2/32
 *   $MATCH_DEST_V4_PFX_2   e.g. 10.9.23.2/32
 */
firewall {
    family inet {
        filter mfc-filter3 {
            interface-specific;
            term stock_exch {
                from {
                    destination-address {
                        $MATCH_DEST_V4_PFX_1;
                        $MATCH_DEST_V4_PFX_2;
                    }
                }
                then {
                    loss-priority low;
                    forwarding-class CONTROL;
                }
            }
            term accept-all-else {
                then accept;
            }
        }
    }
}
```

## junos/forwarding-options/multicast-resolve-rate-mismatch-rate.conf

```
/*
 * Topic: Multicast resolve and RPF-mismatch rate limits
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *  - Sets the multicast forwarding-cache `resolve-rate` and `mismatch-rate` limits to 1000.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    multicast {
        resolve-rate 1000;
        mismatch-rate 1000;
    }
}
```

## junos/forwarding-options/multicast-resolve-rate.conf

```
/*
 * Topic: Multicast resolve rate limit
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   ap2_mx10004 1
 *   total 2
 * Highlights:
 *  - Sets the multicast forwarding-cache `resolve-rate` limit to 1000.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    multicast {
        resolve-rate 1000;
    }
}
```

## junos/interfaces/ifd-ae-description-flexible-mtu-esi-single-active-lacp.conf

```
/*
 * Topic: Described single-active ESI-LAG with flexible VLAN tagging, MTU 1522, per-ESI DF election and LACP
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *  - The Ethernet segment is single-active: `lacp-oos-on-ndf` holds the non-designated forwarder's LACP members out of service so the downstream switch sends only to the DF.
 *  - `df-election-type preference` makes the DF choice deterministic; both WAN edges share the `system-id` so the switch sees one LAG.
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $IFD             e.g. ae0
 *   $DESCRIPTION     e.g. "Link to WANEdge1 to L2/L3Edge AE"
 *   $ESI             e.g. 00:11:11:11:11:11:12:12:12:12
 *   $DF_PREFERENCE   e.g. 150
 *   $LACP_SYS_ID     e.g. 00:00:00:00:00:10
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        flexible-vlan-tagging;
        mtu 1522;
        encapsulation flexible-ethernet-services;
        esi {
            $ESI;
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
                system-priority 100;
                system-id $LACP_SYS_ID;
            }
        }
    }
}
```

## junos/interfaces/ifd-ae-flexible-mtu-esi-single-active-lacp.conf

```
/*
 * Topic: Single-active ESI-LAG with flexible VLAN tagging, MTU 1522, per-ESI DF election and LACP
 * Seen on:
 *   Junos: wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10004 1
 *   total 1
 * Highlights:
 *  - The Ethernet segment is single-active: `lacp-oos-on-ndf` holds the non-designated forwarder's LACP members out of service so the downstream switch sends only to the DF.
 *  - `df-election-type preference` makes the DF choice deterministic; both WAN edges share the `system-id` so the switch sees one LAG.
 * Pair with: none
 * Variables (example values from wanedge2_mx10004):
 *   $IFD             e.g. ae0
 *   $ESI             e.g. 00:11:11:11:11:11:12:12:12:12
 *   $DF_PREFERENCE   e.g. 100
 *   $LACP_SYS_ID     e.g. 00:00:00:00:00:10
 */
interfaces {
    $IFD {
        flexible-vlan-tagging;
        mtu 1522;
        encapsulation flexible-ethernet-services;
        esi {
            $ESI;
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
                system-priority 100;
                system-id $LACP_SYS_ID;
            }
        }
    }
}
```

## junos/interfaces/ifd-description.conf

```
/*
 * Topic: Physical interface description
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 2
 *   ap2_mx10004 3
 *   wanedge1_mx304 2
 *   wanedge2_mx10004 2
 *   total 9
 * Highlights:
 *  - Names the far end of the link; the logical units beneath it are separate fragments.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ap1_mx304):
 *   $IFD           e.g. et-0/0/5
 *   $DESCRIPTION   e.g. "AP1_AP2"
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
 * Topic: Physical port with a description, flexible VLAN tagging and flexible Ethernet services
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004 cr2_mx480
 *   EVO: (none)
 * Count:
 *   ap1_mx304 2
 *   ap2_mx10004 2
 *   cr2_mx480 3
 *   total 7
 * Highlights:
 *  - `flexible-vlan-tagging` with `flexible-ethernet-services` lets each VLAN unit on the port carry its own family, one routed unit per VRF or virtual router.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ap1_mx304):
 *   $IFD           e.g. et-0/0/11
 *   $DESCRIPTION   e.g. "AP1_CR1"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
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
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *  - `gigether-options 802.3ad` assigns the port to its bundle; every Layer 2 setting lives on the `ae` interface.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $IFD           e.g. xe-0/0/13:0
 *   $DESCRIPTION   e.g. "Link to WANEdge1 to L2/L3Edge"
 *   $AE_BUNDLE     e.g. ae0
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

## junos/interfaces/ifl-core-description-inet-iso-mpls.conf

```
/*
 * Topic: Described core logical interface with IPv4, ISO and MPLS
 * Seen on:
 *   Junos: ap1_mx304
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   total 1
 * Highlights:
 *  - Carries the OSPF/RSVP-TE underlay (IPv4) and MPLS-labelled traffic; the description names the far end.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ap1_mx304):
 *   $IFD            e.g. et-0/0/7
 *   $UNIT           e.g. 0
 *   $DESCRIPTION    e.g. "AP1_P2"
 *   $CORE_V4_ADDR   e.g. 10.101.46.1/24
 */
interfaces {
    $IFD {
        unit $UNIT {
            description $DESCRIPTION;
            family inet {
                address $CORE_V4_ADDR;
            }
            family iso;
            family mpls;
        }
    }
}
```

## junos/interfaces/ifl-core-inet-iso-mpls.conf

```
/*
 * Topic: Core logical interface with IPv4, ISO and MPLS
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 2
 *   ap2_mx10004 3
 *   wanedge1_mx304 2
 *   wanedge2_mx10004 2
 *   total 9
 * Highlights:
 *  - Carries the OSPF/RSVP-TE underlay (IPv4) and MPLS-labelled traffic on the core link.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ap1_mx304):
 *   $IFD            e.g. et-0/0/3
 *   $UNIT           e.g. 0
 *   $CORE_V4_ADDR   e.g. 10.101.34.2/24
 */
interfaces {
    $IFD {
        unit $UNIT {
            family inet {
                address $CORE_V4_ADDR;
            }
            family iso;
            family mpls;
        }
    }
}
```

## junos/interfaces/ifl-core-iso-mpls.conf

```
/*
 * Topic: Logical interface with ISO and MPLS families
 * Seen on:
 *   Junos: ap2_mx10004
 *   EVO: (none)
 * Count:
 *   ap2_mx10004 1
 *   total 1
 * Highlights:
 *  - Enables MPLS and ISO on the unit without an IPv4 address.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ap2_mx10004):
 *   $IFD    e.g. et-3/3/0
 *   $UNIT   e.g. 0
 */
interfaces {
    $IFD {
        unit $UNIT {
            family iso;
            family mpls;
        }
    }
}
```

## junos/interfaces/ifl-irb-filter-mac.conf

```
/*
 * Topic: IRB unit with an IPv4 address, an input filter and a static MAC
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 13
 *   wanedge2_mx10004 13
 *   total 26
 * Highlights:
 *  - Layer 3 gateway of the EVPN bridge domain inside the VRF; the input filter classifies the traffic into its forwarding class.
 *  - Both WAN edges configure the same address and MAC on the IRB, so the gateway is identical on whichever edge is designated forwarder.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $UNIT           e.g. 1
 *   $INPUT_FILTER   e.g. mfc-filter
 *   $IRB_ADDR       e.g. 172.16.1.1/24
 *   $STATIC_MAC     e.g. 00:10:94:00:00:01
 */
interfaces {
    irb {
        unit $UNIT {
            family inet {
                filter {
                    input $INPUT_FILTER;
                }
                address $IRB_ADDR;
            }
            mac $STATIC_MAC;
        }
    }
}
```

## junos/interfaces/ifl-loopback-anycast-inet.conf

```
/*
 * Topic: VRF loopback unit with an anycast IPv4 address and a node address
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 9
 *   wanedge2_mx10004 10
 *   total 19
 * Highlights:
 *  - Both WAN edges configure the first address on the same unit and use it as the local RP of the VRF; the second address differs per WAN edge.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $UNIT                  e.g. 1
 *   $LOOPBACK_ANYCAST_V4   e.g. 10.10.47.101
 *   $LOOPBACK_V4_PFX       e.g. 10.20.20.20/32
 */
interfaces {
    lo0 {
        unit $UNIT {
            family inet {
                address $LOOPBACK_ANYCAST_V4/32;
                address $LOOPBACK_V4_PFX;
            }
        }
    }
}
```

## junos/interfaces/ifl-loopback-inet.conf

```
/*
 * Topic: VRF loopback unit with one IPv4 address
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004 wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   ap1_mx304 10
 *   ap2_mx10004 10
 *   wanedge1_mx304 1
 *   total 21
 * Highlights:
 *  - The VRF names the unit in OSPF and PIM.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ap1_mx304):
 *   $UNIT              e.g. 1
 *   $LOOPBACK_V4_PFX   e.g. 10.10.4.101/32
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

## junos/interfaces/ifl-loopback-primary-localhost-mgmt-iso-inet6.conf

```
/*
 * Topic: Loopback with primary, localhost and management IPv4 addresses, ISO and IPv6
 * Seen on:
 *   Junos: ap1_mx304 cr2_mx480 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   cr2_mx480 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 4
 * Highlights:
 *  - Carries the design loopback (primary, preferred, equal to the router ID), 127.0.0.1 and the management loopback (primary), plus ISO and IPv6 addresses.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ap1_mx304):
 *   $LOOPBACK_V4_PFX        e.g. 10.200.50.14/32
 *   $LOOPBACK_MGMT_V4_PFX   e.g. 10.255.161.231/32
 *   $ISO_NET                e.g. 47.0005.80ff.f800.0000.0108.0001.0102.5516.1231.00
 *   $LOOPBACK_V6_PFX        e.g. 2001:db8::10:255:161:231/128
 */
interfaces {
    lo0 {
        unit 0 {
            family inet {
                address $LOOPBACK_V4_PFX {
                    primary;
                    preferred;
                }
                address 127.0.0.1/32;
                address $LOOPBACK_MGMT_V4_PFX {
                    primary;
                }
            }
            family iso {
                address $ISO_NET;
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

## junos/interfaces/ifl-loopback-primary-preferred.conf

```
/*
 * Topic: Loopback with one primary, preferred IPv4 address
 * Seen on:
 *   Junos: ap2_mx10004
 *   EVO: (none)
 * Count:
 *   ap2_mx10004 1
 *   total 1
 * Highlights:
 *  - The address equals the router ID and the iBGP local address.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ap2_mx10004):
 *   $LOOPBACK_V4_PFX   e.g. 10.200.50.16/32
 */
interfaces {
    lo0 {
        unit 0 {
            family inet {
                address $LOOPBACK_V4_PFX {
                    primary;
                    preferred;
                }
            }
        }
    }
}
```

## junos/interfaces/ifl-vlan-bridge-esi-single-active.conf

```
/*
 * Topic: Single-VLAN vlan-bridge unit with a single-active per-unit ESI and DF preference
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 13
 *   wanedge2_mx10004 13
 *   total 26
 * Highlights:
 *  - Each VLAN unit carries its own Ethernet segment, so DF election runs per VLAN between the two WAN edges.
 * Pair with: none
 * Peers with:
 *   [wanedge1_mx304] <-> [wanedge2_mx10004]
 * Variables (example values from wanedge1_mx304):
 *   $IFD             e.g. ae0
 *   $UNIT            e.g. 1
 *   $VLAN            e.g. 1
 *   $ESI             e.g. 00:01:71:81:11:12:a1:00:00:01
 *   $DF_PREFERENCE   e.g. 150
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-bridge;
            vlan-id $VLAN;
            esi {
                $ESI;
                single-active;
                df-election-type {
                    preference {
                        value $DF_PREFERENCE;
                    }
                }
            }
        }
    }
}
```

## junos/interfaces/ifl-vlan-inet.conf

```
/*
 * Topic: Tagged routed unit with an IPv4 address (VLAN sub-interface)
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004 cr2_mx480
 *   EVO: (none)
 * Count:
 *   ap1_mx304 27
 *   ap2_mx10004 26
 *   cr2_mx480 39
 *   total 92
 * Highlights:
 *  - One VLAN unit per VRF or virtual router on the PE-CE link; the unit belongs to that routing instance.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ap1_mx304):
 *   $IFD          e.g. et-0/0/11
 *   $UNIT         e.g. 100
 *   $VLAN         e.g. 100
 *   $AC_ADDR_V4   e.g. 10.101.200.1/24
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

## junos/policy-options/policy-statement/ps-accept-bgp.conf

```
/*
 * Topic: Policy accepting BGP routes
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004 cr2_mx480 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   ap2_mx10004 1
 *   cr2_mx480 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 5
 * Highlights:
 *  - Used as a protocol export to redistribute BGP-learned routes.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ap1_mx304):
 *   $POLICY_NAME   e.g. PS-BGP-TO-OSPF
 */
policy-options {
    policy-statement $POLICY_NAME {
        from protocol bgp;
        then accept;
    }
}
```

## junos/policy-options/policy-statement/ps-accept-direct.conf

```
/*
 * Topic: Policy accepting directly connected routes
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004 cr2_mx480 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   ap2_mx10004 1
 *   cr2_mx480 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 5
 * Highlights:
 *  - Applied as the `export` of the PE-CE eBGP groups in the VRFs.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ap1_mx304):
 *   $POLICY_NAME   e.g. PS-ADV_DIRECT
 */
policy-options {
    policy-statement $POLICY_NAME {
        from protocol direct;
        then accept;
    }
}
```

## junos/policy-options/policy-statement/ps-accept-ospf.conf

```
/*
 * Topic: Policy accepting OSPF routes
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004 cr2_mx480 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   ap2_mx10004 1
 *   cr2_mx480 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 5
 * Highlights:
 *  - Used as a protocol export to redistribute OSPF-learned routes.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ap1_mx304):
 *   $POLICY_NAME   e.g. PS-send-ospf
 */
policy-options {
    policy-statement $POLICY_NAME {
        from protocol ospf;
        then accept;
    }
}
```

## junos/policy-options/policy-statement/ps-default-longer-metric-30.conf

```
/*
 * Topic: Policy setting metric 30 on every IPv4 route
 * Seen on:
 *   Junos: cr2_mx480
 *   EVO: (none)
 * Count:
 *   cr2_mx480 1
 *   total 1
 * Highlights:
 *  - As a BGP export it advertises all remaining routes with MED 30, the less preferred path in the MED-based steering design.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from cr2_mx480):
 *   $POLICY_NAME   e.g. PS-med-30
 */
policy-options {
    policy-statement $POLICY_NAME {
        from {
            route-filter 0.0.0.0/0 longer;
        }
        then {
            metric 30;
            accept;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-route-filter-exact-metric-10.conf

```
/*
 * Topic: Policy setting metric 10 on one exact prefix
 * Seen on:
 *   Junos: cr2_mx480
 *   EVO: (none)
 * Count:
 *   cr2_mx480 1
 *   total 1
 * Highlights:
 *  - As a BGP export it advertises the matched prefix with MED 10, the preferred path in the MED-based steering design.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from cr2_mx480):
 *   $POLICY_NAME   e.g. PS-med-10
 *   $PREFIX        e.g. 10.101.0.0/16
 */
policy-options {
    policy-statement $POLICY_NAME {
        from {
            route-filter $PREFIX exact;
        }
        then {
            metric 10;
            accept;
        }
    }
}
```

## junos/protocols/bgp-ibgp-full-mesh-5.conf

```
/*
 * Topic: iBGP group with five loopback neighbors for IPv4, L3VPN, EVPN and NG-MVPN
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   ap2_mx10004 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 4
 * Highlights:
 *  - One internal group carries IPv4 unicast, `inet-vpn` (unicast and any), EVPN signaling, `inet-mvpn` signaling for NG-MVPN Type-5/Type-7 routes and route-target constrained distribution.
 *  - BFD at 100 ms x 3 protects every session.
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-accept-bgp.conf
 *  - junos/policy-options/policy-statement/ps-accept-ospf.conf
 *
 * Peers with:
 *   [ap1_mx304] <-> [ap2_mx10004]
 *   [ap1_mx304] <-> [p1_ptx10003-80c]
 *   [ap1_mx304] <-> [p2_ptx10001-36mr]
 *   [ap1_mx304] <-> [wanedge1_mx304]
 *   [ap1_mx304] <-> [wanedge2_mx10004]
 *   [ap2_mx10004] <-> [p1_ptx10003-80c]
 *   [ap2_mx10004] <-> [p2_ptx10001-36mr]
 *   [ap2_mx10004] <-> [wanedge1_mx304]
 *   [ap2_mx10004] <-> [wanedge2_mx10004]
 *   [p1_ptx10003-80c] <-> [wanedge1_mx304]
 *   [p1_ptx10003-80c] <-> [wanedge2_mx10004]
 *   [p2_ptx10001-36mr] <-> [wanedge1_mx304]
 *   [p2_ptx10001-36mr] <-> [wanedge2_mx10004]
 *   [wanedge1_mx304] <-> [wanedge2_mx10004]
 * Variables (example values from ap1_mx304):
 *   $LOOPBACK_V4        e.g. 10.200.50.14
 *   $BGP_EXPORT_POL_1   e.g. PS-send-ospf
 *   $BGP_EXPORT_POL_2   e.g. PS-BGP-TO-OSPF
 *   $ASN                e.g. 64512
 *   $IBGP_PEER_V4_1     e.g. 10.200.50.13
 *   $IBGP_PEER_V4_2     e.g. 10.200.50.11
 *   $IBGP_PEER_V4_3     e.g. 10.200.50.12
 *   $IBGP_PEER_V4_4     e.g. 10.200.50.15
 *   $IBGP_PEER_V4_5     e.g. 10.200.50.16
 */
protocols {
    bgp {
        group IBGP {
            type internal;
            local-address $LOOPBACK_V4;
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
            export [ $BGP_EXPORT_POL_1 $BGP_EXPORT_POL_2 ];
            local-as $ASN;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor $IBGP_PEER_V4_1;
            neighbor $IBGP_PEER_V4_2;
            neighbor $IBGP_PEER_V4_3;
            neighbor $IBGP_PEER_V4_4;
            neighbor $IBGP_PEER_V4_5;
        }
    }
}
```

## junos/protocols/lacp-ppm-inline.conf

```
/*
 * Topic: LACP periodic packet management in line
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *  - `ppm inline` runs LACP periodic packet management on the line card.
 * Pair with: none
 * Variables: none
 */
protocols {
    lacp {
        ppm inline;
    }
}
```

## junos/protocols/lldp-interface-all.conf

```
/*
 * Topic: LLDP on all interfaces
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004 cr2_mx480 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   ap2_mx10004 1
 *   cr2_mx480 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 5
 * Highlights:
 *  - Enables LLDP neighbor discovery on every interface.
 * Pair with: none
 * Variables: none
 */
protocols {
    lldp {
        interface all;
    }
}
```

## junos/protocols/mpls-3-lsp-loopback-3-core.conf

```
/*
 * Topic: MPLS with three RSVP-TE LSPs on the loopback and three core interfaces
 * Seen on:
 *   Junos: ap2_mx10004
 *   EVO: (none)
 * Count:
 *   ap2_mx10004 1
 *   total 1
 * Highlights:
 *  - One point-to-point RSVP-TE LSP to each remote PE carries unicast VPN traffic.
 * Pair with: none
 * Variables (example values from ap2_mx10004):
 *   $LSP_NAME_1    e.g. lsp_to_PE2
 *   $LSP_TO_V4_1   e.g. 10.200.50.15
 *   $LSP_NAME_2    e.g. lsp_to_PE1
 *   $LSP_TO_V4_2   e.g. 10.200.50.12
 *   $LSP_NAME_3    e.g. lsp_to_AP1
 *   $LSP_TO_V4_3   e.g. 10.200.50.14
 *   $CORE_INTF_1   e.g. et-0/0/0.0
 *   $CORE_INTF_2   e.g. et-0/0/1.0
 *   $CORE_INTF_3   e.g. et-3/3/0.0
 */
protocols {
    mpls {
        label-switched-path $LSP_NAME_1 {
            to $LSP_TO_V4_1;
        }
        label-switched-path $LSP_NAME_2 {
            to $LSP_TO_V4_2;
        }
        label-switched-path $LSP_NAME_3 {
            to $LSP_TO_V4_3;
        }
        interface lo0.0;
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
        interface $CORE_INTF_3;
    }
}
```

## junos/protocols/mpls-explicit-null-p2mp-template-3-lsp-3-core.conf

```
/*
 * Topic: MPLS with explicit null, a P2MP LSP template, three RSVP-TE LSPs and three core interfaces
 * Seen on:
 *   Junos: ap1_mx304
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   total 1
 * Highlights:
 *  - `explicit-null` advertises label 0 so the penultimate hop keeps the EXP bits up to this egress PE.
 *  - `P2MP` is a link-protected point-to-multipoint LSP template for the multicast provider tunnels; `optimize-aggressive` re-optimizes LSP paths using IGP metrics only.
 * Pair with: none
 * Variables (example values from ap1_mx304):
 *   $LSP_NAME_1    e.g. lsp_to_AP2
 *   $LSP_TO_V4_1   e.g. 10.200.50.16
 *   $LSP_NAME_2    e.g. lsp_to_PE2
 *   $LSP_TO_V4_2   e.g. 10.200.50.15
 *   $LSP_NAME_3    e.g. lsp_to_PE1
 *   $LSP_TO_V4_3   e.g. 10.200.50.12
 *   $CORE_INTF_1   e.g. et-0/0/3.0
 *   $CORE_INTF_2   e.g. et-0/0/5.0
 *   $CORE_INTF_3   e.g. et-0/0/7.0
 */
protocols {
    mpls {
        optimize-aggressive;
        explicit-null;
        label-switched-path P2MP {
            template;
            retry-timer 5;
            optimize-timer 5;
            link-protection;
            p2mp;
        }
        label-switched-path $LSP_NAME_1 {
            to $LSP_TO_V4_1;
        }
        label-switched-path $LSP_NAME_2 {
            to $LSP_TO_V4_2;
        }
        label-switched-path $LSP_NAME_3 {
            to $LSP_TO_V4_3;
        }
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
        interface $CORE_INTF_3;
        interface lo0.0;
    }
}
```

## junos/protocols/mpls-p2mp-template-3-lsp-2-core.conf

```
/*
 * Topic: MPLS with a P2MP LSP template, three RSVP-TE LSPs and two core interfaces
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *  - `P2MP` is a link-protected point-to-multipoint LSP template for the multicast provider tunnels; `optimize-aggressive` re-optimizes LSP paths using IGP metrics only.
 *  - One point-to-point RSVP-TE LSP to each remote PE carries unicast VPN traffic.
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $LSP_NAME_1    e.g. lsp_to_AP1
 *   $LSP_TO_V4_1   e.g. 10.200.50.14
 *   $LSP_NAME_2    e.g. lsp_to_AP2
 *   $LSP_TO_V4_2   e.g. 10.200.50.16
 *   $LSP_NAME_3    e.g. lsp_to_PE2
 *   $LSP_TO_V4_3   e.g. 10.200.50.15
 *   $CORE_INTF_1   e.g. et-0/0/1.0
 *   $CORE_INTF_2   e.g. et-0/0/3.0
 */
protocols {
    mpls {
        optimize-aggressive;
        label-switched-path P2MP {
            template;
            retry-timer 5;
            optimize-timer 5;
            link-protection;
            p2mp;
        }
        label-switched-path $LSP_NAME_1 {
            to $LSP_TO_V4_1;
        }
        label-switched-path $LSP_NAME_2 {
            to $LSP_TO_V4_2;
        }
        label-switched-path $LSP_NAME_3 {
            to $LSP_TO_V4_3;
        }
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
        interface lo0.0;
    }
}
```

## junos/protocols/ospf-area0-bfd-post-convergence-lfa-2-core.conf

```
/*
 * Topic: OSPF area 0 with a passive loopback and two BFD core interfaces with node-protecting post-convergence LFA
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *  - BFD at 10 ms x 3 detects the failure and `post-convergence-lfa node-protection` installs a node-protecting backup path.
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $CORE_INTF_1   e.g. et-0/0/1.0
 *   $CORE_INTF_2   e.g. et-0/0/3.0
 */
protocols {
    ospf {
        area 0.0.0.0 {
            interface lo0.0 {
                passive;
            }
            interface $CORE_INTF_1 {
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                }
                post-convergence-lfa {
                    node-protection;
                }
            }
            interface $CORE_INTF_2 {
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                }
                post-convergence-lfa {
                    node-protection;
                }
            }
        }
    }
}
```

## junos/protocols/ospf-area0-node-link-protection-bfd-3-core-default-intf.conf

```
/*
 * Topic: OSPF area 0 with three node-link-protected BFD core interfaces, a passive loopback and one default interface
 * Seen on:
 *   Junos: ap1_mx304
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   total 1
 * Highlights:
 *  - `node-link-protection` precomputes a loop-free alternate that avoids the neighbor node; BFD at 10 ms x 3 detects the failure.
 *  - The loopback is passive; the last interface runs OSPF with default settings.
 * Pair with: none
 * Variables (example values from ap1_mx304):
 *   $CORE_INTF_1   e.g. et-0/0/3.0
 *   $CORE_INTF_2   e.g. et-0/0/5.0
 *   $CORE_INTF_3   e.g. et-0/0/7.0
 *   $IFL           e.g. et-0/0/11.100
 */
protocols {
    ospf {
        area 0.0.0.0 {
            interface $CORE_INTF_1 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                }
            }
            interface $CORE_INTF_2 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                }
            }
            interface $CORE_INTF_3 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                }
            }
            interface lo0.0 {
                passive;
            }
            interface $IFL;
        }
    }
}
```

## junos/protocols/ospf-area0-node-link-protection-bfd-3-core.conf

```
/*
 * Topic: OSPF area 0 with three node-link-protected BFD core interfaces and a passive loopback
 * Seen on:
 *   Junos: ap2_mx10004
 *   EVO: (none)
 * Count:
 *   ap2_mx10004 1
 *   total 1
 * Highlights:
 *  - `node-link-protection` precomputes a loop-free alternate that avoids the neighbor node; BFD at 10 ms x 3 detects the failure.
 * Pair with: none
 * Variables (example values from ap2_mx10004):
 *   $CORE_INTF_1   e.g. et-0/0/0.0
 *   $CORE_INTF_2   e.g. et-0/0/1.0
 *   $CORE_INTF_3   e.g. et-0/3/3.0
 */
protocols {
    ospf {
        area 0.0.0.0 {
            interface $CORE_INTF_1 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                }
            }
            interface $CORE_INTF_2 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                }
            }
            interface $CORE_INTF_3 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                }
            }
            interface lo0.0 {
                passive;
            }
        }
    }
}
```

## junos/protocols/ospf-te-spring-post-convergence-lfa.conf

```
/*
 * Topic: OSPF traffic engineering with source packet routing and post-convergence LFA
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *  - `backup-spf-options` computes post-convergence (TI-LFA style) backup paths using source-packet-routing labels.
 * Pair with: none
 * Variables: none
 */
protocols {
    ospf {
        backup-spf-options {
            use-post-convergence-lfa;
            use-source-packet-routing;
        }
        traffic-engineering;
        source-packet-routing;
    }
}
```

## junos/protocols/ospf-traffic-engineering.conf

```
/*
 * Topic: OSPF traffic-engineering extensions
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   ap2_mx10004 1
 *   total 2
 * Highlights:
 *  - Floods TE information so RSVP-TE can compute constrained paths for the LSPs.
 * Pair with: none
 * Variables: none
 */
protocols {
    ospf {
        traffic-engineering;
    }
}
```

## junos/protocols/rsvp-interface-loopback-2-core.conf

```
/*
 * Topic: RSVP on the loopback and two core interfaces
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 2
 * Highlights:
 *  - RSVP signals the point-to-point and P2MP RSVP-TE LSPs on every core link; the loopback is included so it can terminate signaling.
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $CORE_INTF_1   e.g. et-0/0/1.0
 *   $CORE_INTF_2   e.g. et-0/0/3.0
 */
protocols {
    rsvp {
        interface lo0.0;
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
    }
}
```

## junos/protocols/rsvp-interface-loopback-3-core.conf

```
/*
 * Topic: RSVP on the loopback and three core interfaces
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   ap2_mx10004 1
 *   total 2
 * Highlights:
 *  - RSVP signals the point-to-point and P2MP RSVP-TE LSPs on every core link; the loopback is included so it can terminate signaling.
 * Pair with: none
 * Variables (example values from ap1_mx304):
 *   $CORE_INTF_1   e.g. et-0/0/3.0
 *   $CORE_INTF_2   e.g. et-0/0/5.0
 *   $CORE_INTF_3   e.g. et-0/0/7.0
 */
protocols {
    rsvp {
        interface lo0.0;
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
        interface $CORE_INTF_3;
    }
}
```

## junos/routing-instances/evpn-elan/ri-evpn-virtual-switch-irb.conf

```
/*
 * Topic: EVPN-MPLS virtual switch with one bridge domain, an attachment unit and an IRB
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 13
 *   wanedge2_mx10004 13
 *   total 26
 * Highlights:
 *  - The bridge domain attaches one single-active ESI unit of the aggregate toward the Layer 2 edge and routes through its IRB.
 *  - `default-gateway do-not-advertise` keeps the shared IRB MAC/IP out of EVPN, and `no-control-word` omits the MPLS control word.
 * Pair with:
 *  - junos/interfaces/ifl-irb-filter-mac.conf
 *  - junos/interfaces/ifl-vlan-bridge-esi-single-active.conf
 *  - junos/protocols/bgp-ibgp-full-mesh-5.conf
 *
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME     e.g. EVPN_ESI_LAG1
 *   $BD_NAME           e.g. BD_EVPN_GROUP1
 *   $VLAN              e.g. 1
 *   $AC_IFL            e.g. ae0.1
 *   $IRB_UNIT          e.g. 1
 *   $LOOPBACK_V4       e.g. 10.200.50.12
 *   $RD_SUB_ASSIGNED   e.g. 1
 *   $RT_AS             e.g. 61535
 *   $RT_ID             e.g. 1
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
                interface $AC_IFL;
                routing-interface irb.$IRB_UNIT;
            }
        }
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/routing-instances/l3vpn/ri-l3vpn-ebgp-2-ce.conf

```
/*
 * Topic: L3VPN VRF with eBGP sessions to two customer routers
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 3
 *   ap2_mx10004 3
 *   total 6
 * Highlights:
 *  - Unicast order-entry VRF toward both customer routers; `vrf-table-label` allows an IP lookup on egress.
 * Pair with:
 *  - junos/interfaces/ifl-vlan-inet.conf
 *  - junos/policy-options/policy-statement/ps-accept-direct.conf
 *  - junos/protocols/bgp-ibgp-full-mesh-5.conf
 *
 * Variables (example values from ap1_mx304):
 *   $INSTANCE_NAME     e.g. VRF21
 *   $PE_LOCAL_V4_1     e.g. 10.101.48.41
 *   $BGP_EXPORT_POL    e.g. PS-ADV_DIRECT
 *   $CE_PEER_V4_1      e.g. 10.101.48.42
 *   $ASN_CUSTOMER_1    e.g. 64520
 *   $PE_LOCAL_V4_2     e.g. 10.101.49.41
 *   $CE_PEER_V4_2      e.g. 10.101.49.42
 *   $ASN_CUSTOMER_2    e.g. 64521
 *   $AC_IFL_A          e.g. et-0/0/6.21
 *   $AC_IFL_B          e.g. et-0/0/11.21
 *   $LOOPBACK_V4       e.g. 10.200.50.14
 *   $RD_SUB_ASSIGNED   e.g. 221
 *   $RT_AS             e.g. 64512
 *   $RT_ID             e.g. 21
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        protocols {
            bgp {
                group TGN_AF_CR1 {
                    type external;
                    local-address $PE_LOCAL_V4_1;
                    export $BGP_EXPORT_POL;
                    neighbor $CE_PEER_V4_1 {
                        peer-as $ASN_CUSTOMER_1;
                    }
                }
                group TGN_AF_CR2 {
                    type external;
                    local-address $PE_LOCAL_V4_2;
                    export $BGP_EXPORT_POL;
                    neighbor $CE_PEER_V4_2 {
                        peer-as $ASN_CUSTOMER_2;
                    }
                }
            }
        }
        interface $AC_IFL_A;
        interface $AC_IFL_B;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
        vrf-table-label;
    }
}
```

## junos/routing-instances/l3vpn/ri-l3vpn-ebgp-irb.conf

```
/*
 * Topic: L3VPN VRF with one eBGP CE session on an IRB interface
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 3
 *   wanedge2_mx10004 3
 *   total 6
 * Highlights:
 *  - Unicast order-entry VRF: the IRB of the EVPN bridge domain is the CE-facing interface and `vrf-table-label` allows an IP lookup on egress.
 * Pair with:
 *  - junos/interfaces/ifl-irb-filter-mac.conf
 *  - junos/policy-options/policy-statement/ps-accept-direct.conf
 *  - junos/protocols/bgp-ibgp-full-mesh-5.conf
 *  - junos/routing-instances/evpn-elan/ri-evpn-virtual-switch-irb.conf
 *
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME     e.g. VRF21
 *   $PE_LOCAL_V4       e.g. 172.16.21.1
 *   $BGP_EXPORT_POL    e.g. PS-ADV_DIRECT
 *   $CE_PEER_V4        e.g. 172.16.21.2
 *   $ASN_CUSTOMER      e.g. 64513
 *   $IRB_UNIT          e.g. 21
 *   $LOOPBACK_V4       e.g. 10.200.50.12
 *   $RD_SUB_ASSIGNED   e.g. 221
 *   $RT_AS             e.g. 64512
 *   $RT_ID             e.g. 21
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        protocols {
            bgp {
                group TGN_AF {
                    type external;
                    local-address $PE_LOCAL_V4;
                    export $BGP_EXPORT_POL;
                    neighbor $CE_PEER_V4 {
                        peer-as $ASN_CUSTOMER;
                    }
                }
            }
        }
        interface irb.$IRB_UNIT;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
        vrf-table-label;
    }
}
```

## junos/routing-instances/l3vpn/ri-mvpn-spt-only-receiver-2-ce-loopback-second.conf

```
/*
 * Topic: NG-MVPN VRF in SPT-only mode with eBGP, OSPF and PIM toward two customer routers (loopback listed second)
 * Seen on:
 *   Junos: ap1_mx304
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   total 1
 * Highlights:
 *  - `mvpn-mode spt-only` runs NG-MVPN on source trees only; the VRF peers with both customer routers over eBGP, OSPF and PIM.
 *  - Multicast arrives over RSVP-TE P2MP provider tunnels built from the default LSP template.
 * Pair with:
 *  - junos/interfaces/ifl-loopback-inet.conf
 *  - junos/interfaces/ifl-vlan-inet.conf
 *  - junos/policy-options/policy-statement/ps-accept-direct.conf
 *  - junos/protocols/bgp-ibgp-full-mesh-5.conf
 *
 * Variables (example values from ap1_mx304):
 *   $INSTANCE_NAME        e.g. MVPN_INSTANCE1
 *   $PE_LOCAL_V4_1        e.g. 10.101.48.1
 *   $BGP_EXPORT_POL       e.g. PS-ADV_DIRECT
 *   $ASN_CUSTOMER_1       e.g. 64520
 *   $CE_PEER_V4_1         e.g. 10.101.48.2
 *   $PE_LOCAL_V4_2        e.g. 10.101.49.1
 *   $ASN_CUSTOMER_2       e.g. 64521
 *   $CE_PEER_V4_2         e.g. 10.101.49.2
 *   $RT_AS                e.g. 64512
 *   $MVPN_RT_ID           e.g. 101
 *   $AC_IFL_A             e.g. et-0/0/6.1
 *   $UNIT                 e.g. 1
 *   $AC_IFL_B             e.g. et-0/0/11.1
 *   $OSPF_EXPORT_POL      e.g. PS-send-ospf
 *   $PIM_RP_V4            e.g. 10.10.47.101
 *   $MCAST_GROUP_V4_PFX   e.g. 225.0.0.0/22
 *   $LOOPBACK_V4          e.g. 10.200.50.14
 *   $RD_SUB_ASSIGNED      e.g. 61
 *   $RT_ID                e.g. 11
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        protocols {
            bgp {
                group CR1_CE {
                    type external;
                    local-address $PE_LOCAL_V4_1;
                    export $BGP_EXPORT_POL;
                    peer-as $ASN_CUSTOMER_1;
                    neighbor $CE_PEER_V4_1 {
                        peer-as $ASN_CUSTOMER_1;
                    }
                }
                group CR2_CE {
                    type external;
                    local-address $PE_LOCAL_V4_2;
                    export $BGP_EXPORT_POL;
                    peer-as $ASN_CUSTOMER_2;
                    neighbor $CE_PEER_V4_2 {
                        peer-as $ASN_CUSTOMER_2;
                    }
                }
            }
            mvpn {
                mvpn-mode {
                    spt-only;
                }
                route-target {
                    import-target {
                        target target:$RT_AS:$MVPN_RT_ID;
                    }
                    export-target {
                        target target:$RT_AS:$MVPN_RT_ID;
                    }
                }
            }
            ospf {
                area 0.0.0.0 {
                    interface $AC_IFL_A;
                    interface lo0.$UNIT;
                    interface $AC_IFL_B;
                }
                export $OSPF_EXPORT_POL;
            }
            pim {
                join-prune-timeout 420;
                rp {
                    static {
                        address $PIM_RP_V4 {
                            group-ranges {
                                $MCAST_GROUP_V4_PFX;
                            }
                        }
                    }
                }
                interface $AC_IFL_A {
                    mode sparse;
                }
                interface lo0.$UNIT;
                interface $AC_IFL_B {
                    mode sparse;
                }
            }
        }
        interface $AC_IFL_A;
        interface $AC_IFL_B;
        interface lo0.$UNIT;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
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

## junos/routing-instances/l3vpn/ri-mvpn-spt-only-receiver-2-ce.conf

```
/*
 * Topic: NG-MVPN VRF in SPT-only mode with eBGP, OSPF and PIM toward two customer routers
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 9
 *   ap2_mx10004 10
 *   total 19
 * Highlights:
 *  - `mvpn-mode spt-only` runs NG-MVPN on source trees only; the VRF peers with both customer routers over eBGP, OSPF and PIM.
 *  - Multicast arrives over RSVP-TE P2MP provider tunnels built from the default LSP template.
 *  - PIM uses a static RP; the VRF loopback unit is in both OSPF and PIM.
 * Pair with:
 *  - junos/interfaces/ifl-loopback-inet.conf
 *  - junos/interfaces/ifl-vlan-inet.conf
 *  - junos/policy-options/policy-statement/ps-accept-direct.conf
 *  - junos/protocols/bgp-ibgp-full-mesh-5.conf
 *
 * Variables (example values from ap1_mx304):
 *   $INSTANCE_NAME        e.g. MVPN_INSTANCE10
 *   $PE_LOCAL_V4_1        e.g. 10.101.48.37
 *   $BGP_EXPORT_POL       e.g. PS-ADV_DIRECT
 *   $ASN_CUSTOMER_1       e.g. 64520
 *   $CE_PEER_V4_1         e.g. 10.101.48.38
 *   $PE_LOCAL_V4_2        e.g. 10.101.49.37
 *   $ASN_CUSTOMER_2       e.g. 64521
 *   $CE_PEER_V4_2         e.g. 10.101.49.38
 *   $RT_AS                e.g. 64512
 *   $MVPN_RT_ID           e.g. 110
 *   $UNIT                 e.g. 10
 *   $AC_IFL_A             e.g. et-0/0/6.10
 *   $AC_IFL_B             e.g. et-0/0/11.10
 *   $OSPF_EXPORT_POL      e.g. PS-send-ospf
 *   $PIM_RP_V4            e.g. 10.10.47.110
 *   $MCAST_GROUP_V4_PFX   e.g. 225.0.36.0/22
 *   $LOOPBACK_V4          e.g. 10.200.50.14
 *   $RD_SUB_ASSIGNED      e.g. 70
 *   $RT_ID                e.g. 20
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        protocols {
            bgp {
                group CR1_CE {
                    type external;
                    local-address $PE_LOCAL_V4_1;
                    export $BGP_EXPORT_POL;
                    peer-as $ASN_CUSTOMER_1;
                    neighbor $CE_PEER_V4_1 {
                        peer-as $ASN_CUSTOMER_1;
                    }
                }
                group CR2_CE {
                    type external;
                    local-address $PE_LOCAL_V4_2;
                    export $BGP_EXPORT_POL;
                    peer-as $ASN_CUSTOMER_2;
                    neighbor $CE_PEER_V4_2 {
                        peer-as $ASN_CUSTOMER_2;
                    }
                }
            }
            mvpn {
                mvpn-mode {
                    spt-only;
                }
                route-target {
                    import-target {
                        target target:$RT_AS:$MVPN_RT_ID;
                    }
                    export-target {
                        target target:$RT_AS:$MVPN_RT_ID;
                    }
                }
            }
            ospf {
                area 0.0.0.0 {
                    interface lo0.$UNIT;
                    interface $AC_IFL_A;
                    interface $AC_IFL_B;
                }
                export $OSPF_EXPORT_POL;
            }
            pim {
                join-prune-timeout 420;
                rp {
                    static {
                        address $PIM_RP_V4 {
                            group-ranges {
                                $MCAST_GROUP_V4_PFX;
                            }
                        }
                    }
                }
                interface lo0.$UNIT;
                interface $AC_IFL_A {
                    mode sparse;
                }
                interface $AC_IFL_B {
                    mode sparse;
                }
            }
        }
        interface $AC_IFL_A;
        interface $AC_IFL_B;
        interface lo0.$UNIT;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
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

## junos/routing-instances/l3vpn/ri-mvpn-spt-only-sender-hot-root-standby.conf

```
/*
 * Topic: NG-MVPN sender-site VRF in SPT-only mode with hot-root standby and a local RP
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 10
 *   wanedge2_mx10004 10
 *   total 20
 * Highlights:
 *  - `sender-site` with `sender-based-rpf` and `hot-root-standby` (`source-tree`, `min-rate` 3m, revert-delay 5) runs the two WAN edges as active and standby roots of each source tree.
 *  - The WAN edge is the local (anycast) rendezvous point for the market-data group range.
 * Pair with:
 *  - junos/interfaces/ifl-irb-filter-mac.conf
 *  - junos/policy-options/policy-statement/ps-accept-direct.conf
 *  - junos/policy-options/policy-statement/ps-accept-ospf.conf
 *  - junos/protocols/bgp-ibgp-full-mesh-5.conf
 *  - junos/routing-instances/evpn-elan/ri-evpn-virtual-switch-irb.conf
 *
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME        e.g. MVPN_INSTANCE1
 *   $PE_LOCAL_V4          e.g. 172.16.1.1
 *   $BGP_EXPORT_POL       e.g. PS-ADV_DIRECT
 *   $CE_PEER_V4           e.g. 172.16.1.2
 *   $ASN_CUSTOMER         e.g. 64513
 *   $RT_AS                e.g. 64512
 *   $MVPN_RT_ID           e.g. 101
 *   $UNIT                 e.g. 1
 *   $OSPF_EXPORT_POL      e.g. PS-send-ospf
 *   $PIM_RP_V4            e.g. 10.10.47.101
 *   $MCAST_GROUP_V4_PFX   e.g. 225.0.0.0/22
 *   $IRB_UNIT             e.g. 1
 *   $LOOPBACK_V4          e.g. 10.200.50.12
 *   $RD_SUB_ASSIGNED      e.g. 61
 *   $RT_ID                e.g. 11
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        protocols {
            bgp {
                group custA_TGN {
                    type external;
                    local-address $PE_LOCAL_V4;
                    export $BGP_EXPORT_POL;
                    neighbor $CE_PEER_V4 {
                        peer-as $ASN_CUSTOMER;
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
                        target target:$RT_AS:$MVPN_RT_ID;
                    }
                    export-target {
                        target target:$RT_AS:$MVPN_RT_ID;
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
                    interface lo0.$UNIT;
                }
                export $OSPF_EXPORT_POL;
            }
            pim {
                join-prune-timeout 420;
                rp {
                    local {
                        address $PIM_RP_V4;
                        group-ranges {
                            $MCAST_GROUP_V4_PFX;
                        }
                    }
                }
                interface irb.$IRB_UNIT;
                interface lo0.$UNIT;
            }
        }
        interface irb.$IRB_UNIT;
        interface lo0.$UNIT;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
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

## junos/routing-instances/virtual-router/ri-virtual-router-ebgp-ibgp-pim-static-rp-pim-last-intf-first.conf

```
/*
 * Topic: Virtual router with eBGP to two access points, an iBGP host session and PIM sparse mode with a static RP (instance interface list led by the last PIM interface)
 * Seen on:
 *   Junos: cr2_mx480
 *   EVO: (none)
 * Count:
 *   cr2_mx480 10
 *   total 10
 * Highlights:
 *  - eBGP to both access points exports routes through the MED-setting policies (metric 10 for one prefix, 30 for every other route).
 *  - PIM sparse mode on all three interfaces joins the market-data groups toward the static rendezvous point.
 * Pair with:
 *  - junos/interfaces/ifl-vlan-inet.conf
 *  - junos/policy-options/policy-statement/ps-default-longer-metric-30.conf
 *  - junos/policy-options/policy-statement/ps-route-filter-exact-metric-10.conf
 *
 * Variables (example values from cr2_mx480):
 *   $INSTANCE_NAME        e.g. VIRTUAL-ROUTER-V10
 *   $BGP_EXPORT_POL_1     e.g. PS-med-10
 *   $BGP_EXPORT_POL_2     e.g. PS-med-30
 *   $ASN_PROVIDER         e.g. 64512
 *   $PE_PEER_V4_1         e.g. 10.101.49.37
 *   $PE_PEER_V4_2         e.g. 10.101.79.37
 *   $ASN                  e.g. 64521
 *   $IBGP_PEER_V4         e.g. 10.101.100.2
 *   $PIM_RP_V4            e.g. 10.10.47.110
 *   $MCAST_GROUP_V4_PFX   e.g. 225.0.36.0/22
 *   $IFL_1                e.g. et-5/0/0.10
 *   $IFL_2                e.g. et-5/0/1.10
 *   $IFL_3                e.g. xe-3/0/6.10
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-router;
        protocols {
            bgp {
                group AP {
                    type external;
                    export [ $BGP_EXPORT_POL_1 $BGP_EXPORT_POL_2 ];
                    peer-as $ASN_PROVIDER;
                    neighbor $PE_PEER_V4_1;
                    neighbor $PE_PEER_V4_2;
                }
                group IXIA {
                    type internal;
                    peer-as $ASN;
                    neighbor $IBGP_PEER_V4;
                }
            }
            pim {
                rp {
                    static {
                        address $PIM_RP_V4 {
                            group-ranges {
                                $MCAST_GROUP_V4_PFX;
                            }
                        }
                    }
                }
                interface $IFL_1 {
                    mode sparse;
                }
                interface $IFL_2 {
                    mode sparse;
                }
                interface $IFL_3 {
                    mode sparse;
                }
            }
        }
        interface $IFL_3;
        interface $IFL_1;
        interface $IFL_2;
    }
}
```

## junos/routing-instances/virtual-router/ri-virtual-router-ebgp-ibgp.conf

```
/*
 * Topic: Virtual router with eBGP to two access points and an iBGP host session
 * Seen on:
 *   Junos: cr2_mx480
 *   EVO: (none)
 * Count:
 *   cr2_mx480 3
 *   total 3
 * Highlights:
 *  - Unicast customer routing context: eBGP to both access points through the MED-setting export policies and iBGP to the attached host.
 * Pair with:
 *  - junos/interfaces/ifl-vlan-inet.conf
 *  - junos/policy-options/policy-statement/ps-default-longer-metric-30.conf
 *  - junos/policy-options/policy-statement/ps-route-filter-exact-metric-10.conf
 *
 * Variables (example values from cr2_mx480):
 *   $INSTANCE_NAME      e.g. VIRTUAL-ROUTER-V21
 *   $BGP_EXPORT_POL_1   e.g. PS-med-10
 *   $BGP_EXPORT_POL_2   e.g. PS-med-30
 *   $ASN_PROVIDER       e.g. 64512
 *   $PE_PEER_V4_1       e.g. 10.101.49.41
 *   $PE_PEER_V4_2       e.g. 10.101.79.41
 *   $ASN                e.g. 64521
 *   $IBGP_PEER_V4       e.g. 10.9.21.2
 *   $IFL_1              e.g. xe-3/0/6.21
 *   $IFL_2              e.g. et-5/0/0.21
 *   $IFL_3              e.g. et-5/0/1.21
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-router;
        protocols {
            bgp {
                group AP {
                    type external;
                    export [ $BGP_EXPORT_POL_1 $BGP_EXPORT_POL_2 ];
                    peer-as $ASN_PROVIDER;
                    neighbor $PE_PEER_V4_1;
                    neighbor $PE_PEER_V4_2;
                }
                group IXIA {
                    type internal;
                    peer-as $ASN;
                    neighbor $IBGP_PEER_V4;
                }
            }
        }
        interface $IFL_1;
        interface $IFL_2;
        interface $IFL_3;
    }
}
```

## junos/routing-options/autonomous-system.conf

```
/*
 * Topic: Autonomous system number
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004 cr2_mx480 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   ap2_mx10004 1
 *   cr2_mx480 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 5
 * Highlights:
 *  - The provider core shares one AS; each customer router has its own AS for eBGP to the access points.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ap1_mx304):
 *   $ASN   e.g. 64512
 */
routing-options {
    autonomous-system $ASN;
}
```

## junos/routing-options/router-id.conf

```
/*
 * Topic: Router ID
 * Seen on:
 *   Junos: ap1_mx304 ap2_mx10004 cr2_mx480 wanedge1_mx304 wanedge2_mx10004
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   ap2_mx10004 1
 *   cr2_mx480 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10004 1
 *   total 5
 * Highlights:
 *  - Explicit router ID; on the PE, P and CR routers it equals the primary lo0 address.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ap1_mx304):
 *   $ROUTER_ID   e.g. 10.200.50.14
 */
routing-options {
    router-id $ROUTER_ID;
}
```

## junos/services/rpm-twamp-client-cr2.conf

```
/*
 * Topic: TWAMP client with 26 managed control connections across the virtual routers
 * Seen on:
 *   Junos: cr2_mx480
 *   EVO: (none)
 * Count:
 *   cr2_mx480 1
 *   total 1
 * Highlights:
 *  - One control connection per access point and virtual router; each runs a test session toward the access point to measure SLA (latency, loss, jitter).
 * Pair with: none
 * Variables: none
 */
services {
    rpm {
        twamp {
            client {
                control-connection CR24_1 {
                    control-type managed;
                    destination-port 862;
                    routing-instance VIRTUAL-ROUTER-V1;
                    target-address 10.101.49.1;
                    test-count 0;
                    test-session T24_1 {
                        target-address 10.101.49.1;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR27_1 {
                    control-type managed;
                    destination-port 862;
                    routing-instance VIRTUAL-ROUTER-V1;
                    target-address 10.101.79.1;
                    test-count 0;
                    test-session T27_1 {
                        target-address 10.101.79.1;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR24_2 {
                    control-type managed;
                    destination-port 49152;
                    routing-instance VIRTUAL-ROUTER-V2;
                    target-address 10.101.49.5;
                    test-count 0;
                    test-session T24_2 {
                        target-address 10.101.49.5;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR27_2 {
                    control-type managed;
                    destination-port 49152;
                    routing-instance VIRTUAL-ROUTER-V2;
                    target-address 10.101.79.5;
                    test-count 0;
                    test-session T27_2 {
                        target-address 10.101.79.5;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR24_3 {
                    control-type managed;
                    destination-port 49153;
                    routing-instance VIRTUAL-ROUTER-V3;
                    target-address 10.101.49.9;
                    test-count 0;
                    test-session T24_3 {
                        target-address 10.101.49.9;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR27_3 {
                    control-type managed;
                    destination-port 49153;
                    routing-instance VIRTUAL-ROUTER-V3;
                    target-address 10.101.79.9;
                    test-count 0;
                    test-session T27_3 {
                        target-address 10.101.79.9;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR24_4 {
                    control-type managed;
                    destination-port 49154;
                    routing-instance VIRTUAL-ROUTER-V4;
                    target-address 10.101.49.13;
                    test-count 0;
                    test-session T24_4 {
                        target-address 10.101.49.13;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR27_4 {
                    control-type managed;
                    destination-port 49154;
                    routing-instance VIRTUAL-ROUTER-V4;
                    target-address 10.101.79.13;
                    test-count 0;
                    test-session T27_4 {
                        target-address 10.101.79.13;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR24_5 {
                    control-type managed;
                    destination-port 49155;
                    routing-instance VIRTUAL-ROUTER-V5;
                    target-address 10.101.49.17;
                    test-count 0;
                    test-session T24_5 {
                        target-address 10.101.49.17;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR27_5 {
                    control-type managed;
                    destination-port 49155;
                    routing-instance VIRTUAL-ROUTER-V5;
                    target-address 10.101.79.17;
                    test-count 0;
                    test-session T27_5 {
                        target-address 10.101.79.17;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR24_6 {
                    control-type managed;
                    destination-port 49156;
                    routing-instance VIRTUAL-ROUTER-V6;
                    target-address 10.101.49.21;
                    test-count 0;
                    test-session T24_6 {
                        target-address 10.101.49.21;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR27_6 {
                    control-type managed;
                    destination-port 49156;
                    routing-instance VIRTUAL-ROUTER-V6;
                    target-address 10.101.79.21;
                    test-count 0;
                    test-session T27_6 {
                        target-address 10.101.79.21;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR24_7 {
                    control-type managed;
                    destination-port 49157;
                    routing-instance VIRTUAL-ROUTER-V7;
                    target-address 10.101.49.25;
                    test-count 0;
                    test-session T24_7 {
                        target-address 10.101.49.25;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR27_7 {
                    control-type managed;
                    destination-port 49157;
                    routing-instance VIRTUAL-ROUTER-V7;
                    target-address 10.101.79.25;
                    test-count 0;
                    test-session T27_7 {
                        target-address 10.101.79.25;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR24_8 {
                    control-type managed;
                    destination-port 49158;
                    routing-instance VIRTUAL-ROUTER-V8;
                    target-address 10.101.49.29;
                    test-count 0;
                    test-session T24_8 {
                        target-address 10.101.49.29;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR27_8 {
                    control-type managed;
                    destination-port 49158;
                    routing-instance VIRTUAL-ROUTER-V8;
                    target-address 10.101.79.29;
                    test-count 0;
                    test-session T27_8 {
                        target-address 10.101.79.29;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR24_9 {
                    control-type managed;
                    destination-port 49159;
                    routing-instance VIRTUAL-ROUTER-V9;
                    target-address 10.101.49.33;
                    test-count 0;
                    test-session T24_9 {
                        target-address 10.101.49.33;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR27_9 {
                    control-type managed;
                    destination-port 49159;
                    routing-instance VIRTUAL-ROUTER-V9;
                    target-address 10.101.79.33;
                    test-count 0;
                    test-session T27_9 {
                        target-address 10.101.79.33;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR24_10 {
                    control-type managed;
                    destination-port 49160;
                    routing-instance VIRTUAL-ROUTER-V10;
                    target-address 10.101.49.37;
                    test-count 0;
                    test-session T24_10 {
                        target-address 10.101.49.37;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR27_10 {
                    control-type managed;
                    destination-port 49160;
                    routing-instance VIRTUAL-ROUTER-V10;
                    target-address 10.101.79.37;
                    test-count 0;
                    test-session T27_10 {
                        target-address 10.101.79.37;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR24_21 {
                    control-type managed;
                    destination-port 49161;
                    routing-instance VIRTUAL-ROUTER-V21;
                    target-address 10.101.49.41;
                    test-count 0;
                    test-session T24_21 {
                        target-address 10.101.49.41;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR27_21 {
                    control-type managed;
                    destination-port 49161;
                    routing-instance VIRTUAL-ROUTER-V21;
                    target-address 10.101.79.41;
                    test-count 0;
                    test-session T27_21 {
                        target-address 10.101.79.41;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR24_22 {
                    control-type managed;
                    destination-port 49162;
                    routing-instance VIRTUAL-ROUTER-V22;
                    target-address 10.101.49.45;
                    test-count 0;
                    test-session T24_22 {
                        target-address 10.101.49.45;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR27_22 {
                    control-type managed;
                    destination-port 49162;
                    routing-instance VIRTUAL-ROUTER-V22;
                    target-address 10.101.79.45;
                    test-count 0;
                    test-session T27_22 {
                        target-address 10.101.79.45;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR24_23 {
                    control-type managed;
                    destination-port 49163;
                    routing-instance VIRTUAL-ROUTER-V23;
                    target-address 10.101.49.49;
                    test-count 0;
                    test-session T24_23 {
                        target-address 10.101.49.49;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
                control-connection CR27_23 {
                    control-type managed;
                    destination-port 49163;
                    routing-instance VIRTUAL-ROUTER-V23;
                    target-address 10.101.79.49;
                    test-count 0;
                    test-session T27_23 {
                        target-address 10.101.79.49;
                        probe-count 100;
                        probe-interval 1;
                    }
                }
            }
        }
    }
}
```

## junos/services/rpm-twamp-server-ap1.conf

```
/*
 * Topic: TWAMP server for 13 routing instances with client lists in 10.101.48.0/24 and 10.101.49.0/24
 * Seen on:
 *   Junos: ap1_mx304
 *   EVO: (none)
 * Count:
 *   ap1_mx304 1
 *   total 1
 * Highlights:
 *  - Listens per routing instance on its own port and admits only the listed customer-router addresses; `authentication-mode none` runs unauthenticated test sessions.
 * Pair with: none
 * Variables: none
 */
services {
    rpm {
        twamp {
            server {
                routing-instance-list {
                    MVPN_INSTANCE1 {
                        port 862;
                    }
                    MVPN_INSTANCE2 {
                        port 49152;
                    }
                    MVPN_INSTANCE3 {
                        port 49153;
                    }
                    MVPN_INSTANCE4 {
                        port 49154;
                    }
                    MVPN_INSTANCE5 {
                        port 49155;
                    }
                    MVPN_INSTANCE6 {
                        port 49156;
                    }
                    MVPN_INSTANCE7 {
                        port 49157;
                    }
                    MVPN_INSTANCE8 {
                        port 49158;
                    }
                    MVPN_INSTANCE9 {
                        port 49159;
                    }
                    MVPN_INSTANCE10 {
                        port 49160;
                    }
                    VRF21 {
                        port 49161;
                    }
                    VRF22 {
                        port 49162;
                    }
                    VRF23 {
                        port 49163;
                    }
                }
                authentication-mode none;
                port 1862;
                client-list CR1_1 {
                    address {
                        10.101.48.2/32;
                    }
                }
                client-list CR2_1 {
                    address {
                        10.101.49.2/32;
                    }
                }
                client-list CR1_2 {
                    address {
                        10.101.48.6/32;
                    }
                }
                client-list CR2_2 {
                    address {
                        10.101.49.6/32;
                    }
                }
                client-list CR1_3 {
                    address {
                        10.101.48.10/32;
                    }
                }
                client-list CR2_3 {
                    address {
                        10.101.49.10/32;
                    }
                }
                client-list CR1_4 {
                    address {
                        10.101.48.14/32;
                    }
                }
                client-list CR2_4 {
                    address {
                        10.101.49.14/32;
                    }
                }
                client-list CR1_5 {
                    address {
                        10.101.48.18/32;
                    }
                }
                client-list CR2_5 {
                    address {
                        10.101.49.18/32;
                    }
                }
                client-list CR1_6 {
                    address {
                        10.101.48.22/32;
                    }
                }
                client-list CR2_6 {
                    address {
                        10.101.49.22/32;
                    }
                }
                client-list CR1_7 {
                    address {
                        10.101.48.26/32;
                    }
                }
                client-list CR2_7 {
                    address {
                        10.101.49.26/32;
                    }
                }
                client-list CR1_8 {
                    address {
                        10.101.48.30/32;
                    }
                }
                client-list CR2_8 {
                    address {
                        10.101.49.30/32;
                    }
                }
                client-list CR1_9 {
                    address {
                        10.101.48.34/32;
                    }
                }
                client-list CR2_9 {
                    address {
                        10.101.49.34/32;
                    }
                }
                client-list CR1_10 {
                    address {
                        10.101.48.38/32;
                    }
                }
                client-list CR2_10 {
                    address {
                        10.101.49.38/32;
                    }
                }
                client-list CR1_21 {
                    address {
                        10.101.48.42/32;
                    }
                }
                client-list CR2_21 {
                    address {
                        10.101.49.42/32;
                    }
                }
                client-list CR1_22 {
                    address {
                        10.101.48.46/32;
                    }
                }
                client-list CR2_22 {
                    address {
                        10.101.49.46/32;
                    }
                }
                client-list CR1_23 {
                    address {
                        10.101.48.50/32;
                    }
                }
                client-list CR2_23 {
                    address {
                        10.101.49.50/32;
                    }
                }
                light;
            }
        }
    }
}
```

## junos/services/rpm-twamp-server-ap2.conf

```
/*
 * Topic: TWAMP server for 13 routing instances with client lists in 10.101.78.0/24 and 10.101.79.0/24
 * Seen on:
 *   Junos: ap2_mx10004
 *   EVO: (none)
 * Count:
 *   ap2_mx10004 1
 *   total 1
 * Highlights:
 *  - Listens per routing instance on its own port and admits only the listed customer-router addresses; `authentication-mode none` runs unauthenticated test sessions.
 * Pair with: none
 * Variables: none
 */
services {
    rpm {
        twamp {
            server {
                routing-instance-list {
                    MVPN_INSTANCE1 {
                        port 862;
                    }
                    MVPN_INSTANCE2 {
                        port 49152;
                    }
                    MVPN_INSTANCE3 {
                        port 49153;
                    }
                    MVPN_INSTANCE4 {
                        port 49154;
                    }
                    MVPN_INSTANCE5 {
                        port 49155;
                    }
                    MVPN_INSTANCE6 {
                        port 49156;
                    }
                    MVPN_INSTANCE7 {
                        port 49157;
                    }
                    MVPN_INSTANCE8 {
                        port 49158;
                    }
                    MVPN_INSTANCE9 {
                        port 49159;
                    }
                    MVPN_INSTANCE10 {
                        port 49160;
                    }
                    VRF21 {
                        port 49161;
                    }
                    VRF22 {
                        port 49162;
                    }
                    VRF23 {
                        port 49163;
                    }
                }
                authentication-mode none;
                port 1862;
                client-list CR1_1 {
                    address {
                        10.101.78.2/32;
                    }
                }
                client-list CR2_1 {
                    address {
                        10.101.79.2/32;
                    }
                }
                client-list CR1_2 {
                    address {
                        10.101.78.6/32;
                    }
                }
                client-list CR2_2 {
                    address {
                        10.101.79.6/32;
                    }
                }
                client-list CR1_3 {
                    address {
                        10.101.78.10/32;
                    }
                }
                client-list CR2_3 {
                    address {
                        10.101.79.10/32;
                    }
                }
                client-list CR1_4 {
                    address {
                        10.101.78.14/32;
                    }
                }
                client-list CR2_4 {
                    address {
                        10.101.79.14/32;
                    }
                }
                client-list CR1_5 {
                    address {
                        10.101.78.18/32;
                    }
                }
                client-list CR2_5 {
                    address {
                        10.101.79.18/32;
                    }
                }
                client-list CR1_6 {
                    address {
                        10.101.78.22/32;
                    }
                }
                client-list CR2_6 {
                    address {
                        10.101.79.22/32;
                    }
                }
                client-list CR1_7 {
                    address {
                        10.101.78.26/32;
                    }
                }
                client-list CR2_7 {
                    address {
                        10.101.79.26/32;
                    }
                }
                client-list CR1_8 {
                    address {
                        10.101.78.30/32;
                    }
                }
                client-list CR2_8 {
                    address {
                        10.101.79.30/32;
                    }
                }
                client-list CR1_9 {
                    address {
                        10.101.78.34/32;
                    }
                }
                client-list CR2_9 {
                    address {
                        10.101.79.34/32;
                    }
                }
                client-list CR1_10 {
                    address {
                        10.101.78.38/32;
                    }
                }
                client-list CR2_10 {
                    address {
                        10.101.79.38/32;
                    }
                }
                client-list CR1_21 {
                    address {
                        10.101.78.42/32;
                    }
                }
                client-list CR2_21 {
                    address {
                        10.101.79.42/32;
                    }
                }
                client-list CR1_22 {
                    address {
                        10.101.78.46/32;
                    }
                }
                client-list CR2_22 {
                    address {
                        10.101.79.46/32;
                    }
                }
                client-list CR1_23 {
                    address {
                        10.101.78.50/32;
                    }
                }
                client-list CR2_23 {
                    address {
                        10.101.79.50/32;
                    }
                }
                light;
            }
        }
    }
}
```

## _variables.md

# Snippet variable glossary

All `.conf` files under `junos/` and `evo/` are templates: identifiers that vary
between deployments are written as `$VAR`. Render a snippet by substituting each
placeholder with your deployment's value. The placeholders each snippet uses are
listed in its `Variables:` header and in the glossary below. Variable names and
meanings follow the shared JVD snippet vocabulary; entries marked **new** were
introduced by this JVD. Numbered variables (`_1`, `_2`, …) form an ordered set;
the numbers carry no other meaning.

Values left literal on purpose: class-of-service object names (`EXP`, `EXP_REWRITE`,
`sched-map`, `s0`–`s3`, forwarding classes), firewall filter and term names, BGP group
names, the `P2MP` LSP template, scheduler rates, BFD timers and the multicast
rate limits. The TWAMP forms are complete deployed test plans and carry no variables.

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `64512` |
| `$ASN_CUSTOMER` | Customer-facing BGP peer autonomous-system number. | `64513` |
| `$ASN_CUSTOMER_1` | **new** Customer-facing BGP peer AS of the first customer router (`_1`/`_2` follow the BGP groups). | `64520` |
| `$ASN_CUSTOMER_2` | **new** Customer-facing BGP peer AS of the second customer router. | `64521` |
| `$ASN_PROVIDER` | **new** Provider (WAN) autonomous-system number of the eBGP neighbor, as configured on a CE. | `64512` |
| `$ISO_NET` | ISO network entity title on lo0 `family iso`. | `47.0005.80ff.f800.0000.0108.0001.0102.5516.3058.00` |
| `$LOOPBACK_ANYCAST_V4` | Shared anycast IPv4 loopback address. | `10.10.47.101` |
| `$LOOPBACK_MGMT_V4_PFX` | Management-network lo0 IPv4 `/32` configured alongside the design loopback. | `10.255.163.58/32` |
| `$LOOPBACK_V4` | Primary per-node IPv4 loopback address. | `10.200.50.13` |
| `$LOOPBACK_V4_PFX` | This node's lo0 IPv4 written with its `/32` prefix length (address form). | `10.200.50.9/32` |
| `$LOOPBACK_V6_PFX` | This node's lo0 IPv6 written with its `/128` prefix length. | `2001:db8::10:255:163:58/128` |
| `$ROUTER_ID` | Complete router identifier in IPv4 dotted-decimal form. | `10.200.50.9` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address on a routed attachment-circuit unit. | `10.101.201.1/24` |
| `$AC_IFL` | Full logical attachment-circuit interface identifier, including its unit. | `ae0.1` |
| `$AC_IFL_A` | **new** First attachment logical interface (with unit) of a set; `_A`…`_E` order the members. | `ae0.1` |
| `$AC_IFL_B` | **new** Second attachment logical interface (with unit) of a set. | `et-0/0/47.1` |
| `$AE_BUNDLE` | Aggregated-Ethernet bundle a member link joins (`802.3ad`). | `ae0` |
| `$AE_DEVICE_COUNT` | Number of aggregated-Ethernet devices the chassis allocates. | `25` |
| `$BREAKOUT_SUB_PORTS` | Number of breakout sub-ports | `4` |
| `$CORE_INTF_1` | Ordered core-facing logical interfaces named in one protocol stanza (`_1`–`_4` follow configuration order). | `et-0/0/0.0` |
| `$CORE_INTF_2` | Ordered core-facing logical interfaces named in one protocol stanza (`_1`–`_4` follow configuration order). | `et-0/0/3.0` |
| `$CORE_INTF_3` | Ordered core-facing logical interfaces named in one protocol stanza (`_1`–`_4` follow configuration order). | `et-0/0/1.0` |
| `$CORE_INTF_4` | Ordered core-facing logical interfaces named in one protocol stanza (`_1`–`_4` follow configuration order). | `et-0/0/4.0` |
| `$CORE_V4_ADDR` | Core interface IPv4 address. | `10.101.23.2/24` |
| `$COS_INTF` | Interface to which the class-of-service configuration is applied, physical or aggregated and independent of topology role. | `et-0/0/0` |
| `$DESCRIPTION` | Free-text interface `description`. | `"L2/L3 to WANEDGE1/2"` |
| `$DF_PREFERENCE` | Designated-forwarder election preference value of an Ethernet segment (`df-election-type preference value`); higher wins. | `150` |
| `$ESI` | 10-byte Ethernet segment identifier (EVPN multihoming). | `00:11:11:11:11:11:12:12:12:12` |
| `$IFD` | Interface-device identifier, excluding a logical unit. | `ae0` |
| `$IFL` | **new** A logical interface (unit included) named in a protocol or instance stanza. | `et-0/0/11.100` |
| `$IFL_1` | **new** First logical interface (unit included) of an ordered set named in one instance. | `et-0/0/42.1` |
| `$IFL_2` | **new** Second logical interface of the same ordered set. | `et-0/0/48.1` |
| `$IFL_3` | **new** Third logical interface of the same ordered set. | `et-0/0/49.1` |
| `$INPUT_FILTER` | **new** Firewall filter applied as `filter input` on a logical interface. | `mfc-filter` |
| `$IRB_ADDR` | IPv4 address configured on an `irb` unit. | `172.16.1.1/24` |
| `$IRB_UNIT` | irb.X unit number for IRB integration. | `1` |
| `$LACP_SYS_ID` | LACP system-id on a multihomed LAG; identical on every device attached to the same Ethernet segment. | `00:00:00:00:00:10` |
| `$STATIC_MAC` | Static MAC address configured on an interface (here an IRB unit). | `00:10:94:00:00:01` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `0` |
| `$VLAN` | A single VLAN identifier. | `100` |
| `$VLAN_NAME` | Name of a `vlans` definition. | `vlan1` |

## Routing, BGP and policy

| Variable | What it is | Example value |
|---|---|---|
| `$BGP_EXPORT_POL` | **new** Name of the policy a BGP group applies with `export`. | `PS-ADV_DIRECT` |
| `$BGP_EXPORT_POL_1` | **new** First policy in a BGP group `export [ … ]` list; order is evaluation order. | `PS-send-ospf` |
| `$BGP_EXPORT_POL_2` | **new** Second policy in the same BGP `export` list. | `PS-BGP-TO-OSPF` |
| `$CE_PEER_V4` | IPv4 address of the external BGP peer (CE). | `172.16.21.2` |
| `$CE_PEER_V4_1` | **new** IPv4 address of the first customer-router eBGP neighbor. | `10.101.48.42` |
| `$CE_PEER_V4_2` | **new** IPv4 address of the second customer-router eBGP neighbor. | `10.101.49.42` |
| `$IBGP_PEER_V4` | **new** IPv4 address of the internal BGP neighbor of a routing instance. | `10.101.81.2` |
| `$IBGP_PEER_V4_1` | **new** Loopback of an internal BGP neighbor; `_1`–`_5` follow the neighbor order of the group. | `10.200.50.15` |
| `$IBGP_PEER_V4_2` | **new** Loopback of an internal BGP neighbor; `_1`–`_5` follow the neighbor order of the group. | `10.200.50.14` |
| `$IBGP_PEER_V4_3` | **new** Loopback of an internal BGP neighbor; `_1`–`_5` follow the neighbor order of the group. | `10.200.50.12` |
| `$IBGP_PEER_V4_4` | **new** Loopback of an internal BGP neighbor; `_1`–`_5` follow the neighbor order of the group. | `10.200.50.11` |
| `$IBGP_PEER_V4_5` | **new** Loopback of an internal BGP neighbor; `_1`–`_5` follow the neighbor order of the group. | `10.200.50.16` |
| `$LSP_NAME_1` | **new** Name of an RSVP-TE label-switched path; `_1`–`_3` follow configuration order. | `lsp_to_PE2` |
| `$LSP_NAME_2` | **new** Name of an RSVP-TE label-switched path; `_1`–`_3` follow configuration order. | `lsp_to_PE1` |
| `$LSP_NAME_3` | **new** Name of an RSVP-TE label-switched path; `_1`–`_3` follow configuration order. | `lsp_to_AP1` |
| `$LSP_TO_V4_1` | **new** Egress (`to`) loopback of the matching label-switched path. | `10.200.50.15` |
| `$LSP_TO_V4_2` | **new** Egress (`to`) loopback of the matching label-switched path. | `10.200.50.12` |
| `$LSP_TO_V4_3` | **new** Egress (`to`) loopback of the matching label-switched path. | `10.200.50.14` |
| `$MATCH_DEST_V4_PFX_1` | **new** Destination IPv4 prefix a firewall term matches; `_1`/`_2` follow term order. | `10.8.21.2/32` |
| `$MATCH_DEST_V4_PFX_2` | **new** Second destination IPv4 prefix in the same term. | `10.9.21.2/32` |
| `$OSPF_EXPORT_POL` | **new** Name of the policy OSPF applies with `export` inside a routing instance. | `PS-send-ospf` |
| `$PE_LOCAL_V4` | PE local IPv4 address of the PE-CE eBGP session (MEBS `$CE_PEER_V4` / `$PE_LOCAL_V4`). | `172.16.21.1` |
| `$PE_LOCAL_V4_1` | **new** PE local address of the eBGP session to the first customer router. | `10.101.48.41` |
| `$PE_LOCAL_V4_2` | **new** PE local address of the eBGP session to the second customer router. | `10.101.49.41` |
| `$PE_PEER_V4_1` | **new** IPv4 address of the first WAN-edge (PE) eBGP neighbor, as configured on a CE; `_1`/`_2` follow the neighbor order. | `10.101.48.1` |
| `$PE_PEER_V4_2` | **new** IPv4 address of the second PE eBGP neighbor in the same group. | `10.101.78.1` |
| `$POLICY_NAME` | Policy-statement name where the name is the object the body defines. | `PS-BGP-TO-OSPF` |
| `$PREFIX` | Prefix a route-filter matches where the prefix itself is what the policy selects. | `10.101.0.0/16` |

## Services and multicast

| Variable | What it is | Example value |
|---|---|---|
| `$BD_NAME` | Bridge-domain (VLAN) name inside an EVPN instance. | `BD_EVPN_GROUP1` |
| `$INSTANCE_NAME` | Identity stem of a service instance. | `VIRTUAL-ROUTER-V1` |
| `$MCAST_GROUP_V4_PFX` | **new** IPv4 multicast group prefix: a PIM RP group range, a selective provider-tunnel group or a filter destination. | `225.0.0.0/22` |
| `$MVPN_RT_ID` | **new** Route-target Assigned Number of the MVPN `route-target` import/export target (Administrator is `$RT_AS`). | `101` |
| `$PIM_RP_V4` | **new** IPv4 address of a PIM rendezvous point (static RP, or the local RP address on the RP itself). | `10.10.47.101` |
| `$RD_SUB_ASSIGNED` | Route Distinguisher Assigned Number subfield. | `1` |
| `$RT_AS` | Route Target Administrator subfield. | `61535` |
| `$RT_ID` | Route Target Assigned Number subfield. | `1` |

## Platform

| Variable | What it is | Example value |
|---|---|---|
| `$FPC_SLOT` | FPC slot for a complete source-measured hardware profile. | `1` |
| `$PIC_SLOT` | PIC slot within an FPC. | `0` |

## byoai/TIERS.md

# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd enterprise_wan/ewan_finance`. -->

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

## NG-MVPN sender-site VRF on a WAN edge (SPT-only, hot-root standby)

Family ng-mvpn, form spt-only-sender. OS mode Junos. Attachment: IRB unit of the EVPN virtual-switch bridge domain plus a VRF loopback unit.

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-mvpn-spt-only-sender-hot-root-standby.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$OSPF_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: filter:$INPUT_FILTER

### wanedge2_mx10004 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-mvpn-spt-only-sender-hot-root-standby.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$OSPF_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: filter:$INPUT_FILTER

---

## NG-MVPN receiver VRF on an access point toward two customer routers (SPT-only)

Family ng-mvpn, form spt-only-receiver. OS mode Junos. Attachment: Two tagged routed units, one toward each customer router, plus a VRF loopback unit.

### ap1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-mvpn-spt-only-receiver-2-ce.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$OSPF_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: interface-parent:source-occurrence

### ap2_mx10004 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-mvpn-spt-only-receiver-2-ce.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$OSPF_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: interface-parent:source-occurrence

---

## L3VPN order-entry VRF on a WAN edge (eBGP over IRB)

Family l3vpn, form ebgp-irb. OS mode Junos. Attachment: IRB unit of the EVPN virtual-switch bridge domain.

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: filter:$INPUT_FILTER

### wanedge2_mx10004 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: filter:$INPUT_FILTER

---

## L3VPN order-entry VRF on an access point toward two customer routers

Family l3vpn, form ebgp-2-ce. OS mode Junos. Attachment: Two tagged routed units, one toward each customer router.

### ap1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-2-ce.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: interface-parent:source-occurrence

### ap2_mx10004 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-2-ce.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: interface-parent:source-occurrence

---

## EVPN-MPLS virtual switch with single-active ESI and IRB on a WAN edge

Family e-lan, form evpn-virtual-switch-irb. OS mode Junos. Attachment: One vlan-bridge unit with a per-unit single-active ESI on the aggregate toward the Layer 2 edge, plus the IRB routing interface.

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-virtual-switch-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence
  - occurrence-selection-required: filter:$INPUT_FILTER

### wanedge2_mx10004 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-virtual-switch-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence
  - occurrence-selection-required: filter:$INPUT_FILTER

---

## Customer-router virtual router with eBGP to both access points and PIM sparse mode

Family virtual-router, form ebgp-ibgp-pim-static-rp. OS mode MIXED. Attachment: Three tagged routed units: one toward each access point and one toward the attached host.

### cr1_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/virtual-router/ri-virtual-router-ebgp-ibgp-pim-static-rp.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: interface-parent:source-occurrence

### cr2_mx480 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-virtual-router-ebgp-ibgp-pim-static-rp-pim-last-intf-first.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: interface-parent:source-occurrence

---

## Customer-router virtual router with eBGP to both access points (unicast)

Family virtual-router, form ebgp-ibgp. OS mode MIXED. Attachment: Three tagged routed units: one toward each access point and one toward the attached host.

### cr1_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/virtual-router/ri-virtual-router-ebgp-ibgp.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: interface-parent:source-occurrence

### cr2_mx480 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-virtual-router-ebgp-ibgp.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: interface-parent:source-occurrence

---

## byoai/DEFAULTS.md

# DEFAULTS — Enterprise WAN for Finance & Stock Exchange

Lab auto-fill values for the Enterprise WAN for Finance & Stock Exchange JVD. Every value is measured from the validated device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks auto-fill; otherwise ask. Variable meanings are in [`_variables.md`](../_variables.md).

## Device inventory

| Role | Device | Platform | OS | `$LOOPBACK_V4` / router-id | `$ASN` |
|------|--------|----------|----|----------------------------|--------|
| WAN Edge | wanedge1_mx304 | MX304 | Junos | 10.200.50.12 | 64512 |
| WAN Edge | wanedge2_mx10004 | MX10004 | Junos | 10.200.50.15 | 64512 |
| Access Point | ap1_mx304 | MX304 | Junos | 10.200.50.14 | 64512 |
| Access Point | ap2_mx10004 | MX10004 | Junos | 10.200.50.16 | 64512 |
| Provider (P) | p1_ptx10003-80c | PTX10003-80C | EVO | 10.200.50.13 | 64512 |
| Provider (P) | p2_ptx10001-36mr | PTX10001-36MR | EVO | 10.200.50.11 | 64512 |
| Customer Router | cr1_acx7100-48l | ACX7100-48L | EVO | 10.200.50.9 | 64520 |
| Customer Router | cr2_mx480 | MX480 | Junos | 10.200.50.18 | 64521 |
| L2/L3 Edge | l2-l3_edge_acx7100 | ACX7100 | EVO | 10.255.163.58 (router-id only) | — |

The six provider devices (WAN edges, access points, P routers) run one iBGP full mesh (`protocols/bgp-ibgp-full-mesh-5.conf`) between their loopbacks in AS 64512, over OSPF area 0 with RSVP-TE.

## Service examples (first validated instance per device)

| Service form | Device | Example values |
|--------------|--------|----------------|
| NG-MVPN sender VRF | wanedge1 / wanedge2 | `MVPN_INSTANCE1`, `irb.1`, `lo0.1`, `$PE_LOCAL_V4` 172.16.1.1, `$CE_PEER_V4` 172.16.1.2 (`$ASN_CUSTOMER` 64513), RP 10.10.47.101, group range 225.0.0.0/22, `vrf-target` 64512:11, MVPN target 64512:101, RD `<loopback>`:61 |
| NG-MVPN receiver VRF | ap1 | `MVPN_INSTANCE2`, `$AC_IFL_1` et-0/0/6.2, `$AC_IFL_2` et-0/0/11.2, `lo0.2`, CE peers 10.101.48.6 (AS 64520) and 10.101.49.6 (AS 64521), static RP 10.10.47.102, group range 225.0.4.0/22 |
| NG-MVPN receiver VRF | ap2 | `MVPN_INSTANCE1`, `$AC_IFL_1` et-0/0/2.1, `$AC_IFL_2` et-0/4/3.1, CE peers 10.101.78.2 (AS 64520) and 10.101.79.2 (AS 64521) |
| L3VPN VRF over IRB | wanedge1 / wanedge2 | `VRF21`, `irb.21`, `$PE_LOCAL_V4` 172.16.21.1, `$CE_PEER_V4` 172.16.21.2 (AS 64513), `vrf-target` 64512:21, RD `<loopback>`:221 |
| L3VPN VRF to two customer routers | ap1 | `VRF21`, et-0/0/6.21 and et-0/0/11.21, CE peers 10.101.48.42 (AS 64520) and 10.101.49.42 (AS 64521) |
| EVPN virtual switch | wanedge1 / wanedge2 | `EVPN_ESI_LAG1`, bridge domain `BD_EVPN_GROUP1`, VLAN 1, `$AC_IFL` ae0.1, `irb.1`, `vrf-target` 61535:1, RD `<loopback>`:1 |
| Virtual router (multicast) | cr1 | `VIRTUAL-ROUTER-V1`, et-0/0/42.1 / et-0/0/48.1 / et-0/0/49.1, eBGP to 10.101.48.1 and 10.101.78.1 (AS 64512), iBGP host 10.101.81.2, static RP 10.10.47.101, group range 225.0.0.0/22 |
| Virtual router (multicast) | cr2 | `VIRTUAL-ROUTER-V1`, et-5/0/0.1 / et-5/0/1.1 / xe-3/0/6.1, eBGP to 10.101.49.1 and 10.101.79.1 (AS 64512), iBGP host 10.101.91.2 |
| Virtual router (unicast) | cr1 / cr2 | `VIRTUAL-ROUTER-V21`, iBGP host 10.8.21.2 (cr1) / 10.9.21.2 (cr2) |

## Numbering conventions (hold on every measured instance)

- **NG-MVPN instance `n` (1–10)** on all four PEs: `MVPN_INSTANCE<n>`; `vrf-target` 64512:`10+n`; MVPN `route-target` 64512:`100+n`; RD `<loopback>`:`60+n`; RP 10.10.47.`100+n`; group range 225.0.`4(n-1)`.0/22; VRF loopback unit `n` and, on the WAN edges, IRB unit `n`.
- **L3VPN `VRF2x` (21–23)** on all four PEs: `vrf-target` 64512:`2x`; RD `<loopback>`:`22x`; IRB unit `2x` on the WAN edges.
- **EVPN virtual switch `EVPN_ESI_LAG<n>`** (1–10, 21–23) on both WAN edges: VLAN `n`, attachment `ae0.<n>`, `irb.<n>`, `vrf-target` 61535:`n`, RD `<loopback>`:`n`. Bridge domains are `BD_EVPN_GROUP<n>` for 1–10; instances 21–23 use the name `BD_EVPN_GROUP1`.
- **Customer-router virtual routers** `VIRTUAL-ROUTER-V<n>` use unit `n` on all three interfaces; the virtual routers with PIM (1–10) use RP 10.10.47.`100+n` and group range 225.0.`4(n-1)`.0/22.
- PE-CE links use one /30 per instance from 10.101.48.x (ap1–cr1), 10.101.49.x (ap1–cr2), 10.101.78.x (ap2–cr1) and 10.101.79.x (ap2–cr2); the access point holds the first host address.
- Both WAN edges configure the same IRB address and MAC for a given unit, and the same anycast RP address on the VRF loopback unit.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into `jvd-ewan-fin-snips.md` by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: minimum
# devices:
#   wanedge1: { name: <hostname>, os: junos, loopback4: <addr> }
#   ap1: { name: <hostname>, os: junos, loopback4: <addr> }
# services:
#   - { kind: <ng-mvpn-sender|ng-mvpn-receiver|l3vpn-irb|l3vpn-2-ce|evpn-virtual-switch|virtual-router-multicast|virtual-router-unicast>,
#       count: <int>,
#       start_id: <int>,
#       attachments: <ifl list>,
#       rt: <rt_as:rt_id>,
#       rd: <loopback:assigned> }
# snips_used:
#   - junos/routing-instances/l3vpn/ri-mvpn-spt-only-sender-hot-root-standby.conf
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

- The prerequisites the device must already run: the snip's `Pair with:` entries and the requirements TIERS.md lists under the Blocked entry for that device (attachment interfaces, IRB units, VRF loopback units, export policies, the iBGP mesh and the EVPN virtual switch that owns an IRB). Name them; do not render them.
- Inputs defaulted because the user did not provide them.
- Cross-device consistency the user must verify: an NG-MVPN instance uses the same route targets, MVPN target, RP and group range on both WAN edges and both access points; an EVPN virtual-switch instance and its IRB unit are identical on both WAN edges; a customer-router virtual router's eBGP neighbors are the access-point PE-CE addresses of the same instance.
- Anything that is by-pattern rather than validated on that exact device.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
