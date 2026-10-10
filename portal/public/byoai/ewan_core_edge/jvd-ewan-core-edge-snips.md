# JVD Enterprise WAN Core and Edge snippet library

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

## evo/chassis/fpc-acx7100-48l-4x100g.conf

```
/*
 * Topic: ACX7100-48L port 51 channelized into four 100G sub-ports
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
chassis {
    fpc 0 {
        pic 0 {
            port 51 {
                number-of-sub-ports 4;
                speed 100g;
            }
        }
    }
}
```

## evo/chassis/fpc-ptx10003-port-speeds.conf

```
/*
 * Topic: PTX10003 line card port speeds with 40G, 25G and 10G channelization
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003
 * Count:
 *   p1_ptx10003 1
 *   total 1
 * Highlights:
 *   - Port 1 is channelized into four 25G sub-ports and ports 5-9 into four 10G sub-ports.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
chassis {
    fpc 2 {
        pic 0 {
            port 0 {
                number-of-sub-ports 1;
                speed 40g;
            }
            port 1 {
                number-of-sub-ports 4;
                speed 25g;
            }
            port 2 {
                number-of-sub-ports 1;
                speed 40g;
            }
            port 3 {
                number-of-sub-ports 1;
                speed 40g;
            }
            port 4 {
                number-of-sub-ports 1;
                speed 40g;
            }
            port 5 {
                number-of-sub-ports 4;
                speed 10g;
            }
            port 6 {
                number-of-sub-ports 4;
                speed 10g;
            }
            port 7 {
                number-of-sub-ports 4;
                speed 10g;
            }
            port 8 {
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

## evo/class-of-service/classifiers/cl-exp-8class.conf

```
/*
 * Topic: MPLS EXP classifier for an eight-class model
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003
 * Count:
 *   p1_ptx10003 1
 *   total 1
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-8queue-model.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    classifiers {
        exp myexp {
            forwarding-class af {
                loss-priority low code-points 010;
            }
            forwarding-class af1 {
                loss-priority low code-points 110;
            }
            forwarding-class be {
                loss-priority low code-points 000;
            }
            forwarding-class be1 {
                loss-priority low code-points 100;
            }
            forwarding-class ef {
                loss-priority high code-points 001;
            }
            forwarding-class ef1 {
                loss-priority high code-points 101;
            }
            forwarding-class nc {
                loss-priority high code-points 011;
            }
            forwarding-class nc1 {
                loss-priority high code-points 111;
            }
        }
    }
}
```

## evo/class-of-service/forwarding-classes/fc-8queue-model.conf

```
/*
 * Topic: Eight forwarding classes mapped to eight queues
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003
 * Count:
 *   p1_ptx10003 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    forwarding-classes {
        class af queue-num 2;
        class af1 queue-num 6;
        class be queue-num 0;
        class be1 queue-num 4;
        class ef queue-num 1;
        class ef1 queue-num 5;
        class nc queue-num 3;
        class nc1 queue-num 7;
    }
}
```

## evo/class-of-service/rewrite-rules/rr-exp-8class.conf

```
/*
 * Topic: MPLS EXP rewrite rule for an eight-class model
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003
 * Count:
 *   p1_ptx10003 1
 *   total 1
 * Pair with:
 *  - evo/class-of-service/forwarding-classes/fc-8queue-model.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    rewrite-rules {
        exp myexp_rw {
            forwarding-class af {
                loss-priority low code-point 101;
            }
            forwarding-class af1 {
                loss-priority low code-point 001;
            }
            forwarding-class be {
                loss-priority low code-point 111;
            }
            forwarding-class be1 {
                loss-priority low code-point 011;
            }
            forwarding-class ef {
                loss-priority high code-point 110;
            }
            forwarding-class ef1 {
                loss-priority high code-point 010;
            }
            forwarding-class nc {
                loss-priority high code-point 100;
            }
            forwarding-class nc1 {
                loss-priority high code-point 000;
            }
        }
    }
}
```

## evo/forwarding-options/enhanced-hash-key-mpls-no-payload.conf

```
/*
 * Topic: Enhanced hash key for MPLS without payload hashing
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003
 * Count:
 *   p1_ptx10003 1
 *   total 1
 * Highlights:
 *   - MPLS load balancing hashes on labels only; `no-payload` keeps the inner packet out of the hash.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    enhanced-hash-key {
        family mpls {
            no-payload;
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
 *   EVO: ce1_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 1
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

## evo/forwarding-options/hash-key-mpls-three-labels.conf

```
/*
 * Topic: Hash key on the top three MPLS labels
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003
 * Count:
 *   p1_ptx10003 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    hash-key {
        family mpls {
            label-1;
            label-2;
            label-3;
        }
    }
}
```

## evo/forwarding-options/hash-key-seed-inet-mpls-multiservice.conf

```
/*
 * Topic: Hash key with a hash seed on IPv4 layer 3-4, all MPLS labels and Ethernet MACs
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Highlights:
 *   - `hash-seed` randomizes the hash per device so consecutive hops do not polarize onto the same links.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    hash-key {
        hash-seed;
        family inet {
            layer-3;
            layer-4;
        }
        family mpls {
            all-labels;
        }
        family multiservice {
            source-mac;
            destination-mac;
        }
    }
}
```

## evo/forwarding-options/hash-key-seed-mpls-payload-multiservice.conf

```
/*
 * Topic: Hash key with a hash seed on all MPLS labels with IP payload and Ethernet MACs
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - `hash-seed` randomizes the hash per device so consecutive hops do not polarize onto the same links.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    hash-key {
        hash-seed;
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

## evo/forwarding-options/load-balance-label-capability.conf

```
/*
 * Topic: Load-balance label capability
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Highlights:
 *   - Signals that the router can insert and process load-balance (entropy) labels.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    load-balance-label-capability;
}
```

## evo/groups/apply-global-two.conf

```
/*
 * Topic: Two configuration groups applied at the top level
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - Group order matters: an earlier group wins where two set the same statement.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge4_acx7100-48l):
 *   $GROUP_A  e.g. ZR_Wavelength
 *   $GROUP_B  e.g. REST_API
 */
apply-groups [ $GROUP_A $GROUP_B ];
```

## evo/groups/gr-zr-wavelength.conf

```
/*
 * Topic: Configuration group setting the optics wavelength on five ports
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - Applied through `apply-groups`, it tunes each listed port's optics to 1552.52 nm.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
groups {
    ZR_Wavelength {
        interfaces {
            et-0/0/49 {
                optics-options {
                    wavelength 1552.52;
                }
            }
            et-0/0/50 {
                optics-options {
                    wavelength 1552.52;
                }
            }
            et-0/0/51 {
                optics-options {
                    wavelength 1552.52;
                }
            }
            et-0/0/52 {
                optics-options {
                    wavelength 1552.52;
                }
            }
            et-0/0/53 {
                optics-options {
                    wavelength 1552.52;
                }
            }
        }
    }
}
```

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
 *   $DESCRIPTION  e.g. "P1Node to WANEdge1"
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

## evo/interfaces/ifd-ae-description-link-speed-mixed-lacp-fast.conf

```
/*
 * Topic: Described mixed-speed aggregated Ethernet bundle with active fast LACP
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr wanedge4_acx7100-48l
 * Count:
 *   p2_ptx10001-36mr 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - `link-speed mixed` lets members of different speeds join one bundle.
 * Pair with: none
 * Variables (example values from p2_ptx10001-36mr):
 *   $IFD          e.g. ae4
 *   $DESCRIPTION  e.g. "P2 Node to WANEdge4"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        aggregated-ether-options {
            link-speed mixed;
            lacp {
                active;
                periodic fast;
            }
        }
    }
}
```

## evo/interfaces/ifd-ae-disable-flexible-lacp-fast-system-id.conf

```
/*
 * Topic: Disabled flexible-services aggregated Ethernet bundle with fast LACP and a fixed system ID
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - The bundle is administratively disabled while its units stay configured.
 * Pair with: none
 * Variables (example values from wanedge4_acx7100-48l):
 *   $IFD          e.g. ae1
 *   $LACP_SYS_ID  e.g. 11:11:11:11:11:11
 */
interfaces {
    $IFD {
        disable;
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

## evo/interfaces/ifd-ae-flexible-lacp-fast-system-id.conf

```
/*
 * Topic: Flexible-services aggregated Ethernet bundle with fast LACP and a fixed system ID
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Highlights:
 *   - Flexible tagging and `flexible-ethernet-services` let the bundle carry bridged and cross-connect units.
 *   - An explicit LACP `system-id` presents a stable partner identity to the attached device.
 * Pair with: none
 * Variables (example values from wanedge3_acx7509):
 *   $IFD          e.g. ae1
 *   $LACP_SYS_ID  e.g. 11:11:11:11:11:11
 */
interfaces {
    $IFD {
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

## evo/interfaces/ifd-ae-flexible-lacp.conf

```
/*
 * Topic: Flexible-services aggregated Ethernet bundle with active LACP
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 1
 *   total 1
 * Pair with: none
 * Variables (example values from ce1_acx7100-48l):
 *   $IFD  e.g. ae1
 */
interfaces {
    $IFD {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            lacp {
                active;
            }
        }
    }
}
```

## evo/interfaces/ifd-breakout-100g.conf

```
/*
 * Topic: Port channelized into 100G sub-ports
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge4_acx7100-48l):
 *   $IFD                 e.g. et-0/0/51
 *   $BREAKOUT_SUB_PORTS  e.g. 4
 */
interfaces {
    $IFD {
        number-of-sub-ports $BREAKOUT_SUB_PORTS;
        speed 100g;
    }
}
```

## evo/interfaces/ifd-description-100g.conf

```
/*
 * Topic: Described 100G port
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 3
 *   wanedge4_acx7100-48l 2
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $IFD          e.g. et-1/0/0
 *   $DESCRIPTION  e.g. "WAN Edge3 to P1 node"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        speed 100g;
    }
}
```

## evo/interfaces/ifd-description.conf

```
/*
 * Topic: Interface description
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003 p2_ptx10001-36mr
 * Count:
 *   p1_ptx10003 3
 *   p2_ptx10001-36mr 3
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p1_ptx10003):
 *   $IFD          e.g. et-1/0/1
 *   $DESCRIPTION  e.g. "P1Node to P2Node"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
    }
}
```

## evo/interfaces/ifd-disable.conf

```
/*
 * Topic: Administratively disabled port
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003
 * Count:
 *   p1_ptx10003 2
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p1_ptx10003):
 *   $IFD  e.g. et-0/0/0
 */
interfaces {
    $IFD {
        disable;
    }
}
```

## evo/interfaces/ifd-flexible-ethernet-services-description.conf

```
/*
 * Topic: Described port with flexible VLAN tagging and flexible Ethernet services
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 3
 *   wanedge3_acx7509 2
 *   wanedge4_acx7100-48l 2
 *   total 7
 * Highlights:
 *   - Flexible tagging and `flexible-ethernet-services` let one port carry bridged, cross-connect and routed units side by side.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce1_acx7100-48l):
 *   $IFD          e.g. et-0/0/46
 *   $DESCRIPTION  e.g. "CE1 to PE1"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
    }
}
```

## evo/interfaces/ifd-flexible-ethernet-services.conf

```
/*
 * Topic: Port with flexible VLAN tagging and flexible Ethernet services
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l wanedge4_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 1
 *   wanedge4_acx7100-48l 2
 *   total 3
 * Highlights:
 *   - Flexible tagging and `flexible-ethernet-services` let one port carry bridged, cross-connect and routed units side by side.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce1_acx7100-48l):
 *   $IFD  e.g. et-0/0/44
 */
interfaces {
    $IFD {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
    }
}
```

## evo/interfaces/ifd-hierarchical-scheduler-flexible-ethernet-services.conf

```
/*
 * Topic: Hierarchical-scheduler port with flexible VLAN tagging and flexible Ethernet services
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Highlights:
 *   - `hierarchical-scheduler` enables per-unit traffic-control profiles beneath the port shaper.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $IFD  e.g. et-1/0/12
 */
interfaces {
    $IFD {
        hierarchical-scheduler;
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
 *   EVO: ce1_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 2
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce1_acx7100-48l):
 *   $IFD        e.g. et-0/0/42
 *   $AE_BUNDLE  e.g. ae1
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

## evo/interfaces/ifd-lag-member-ether.conf

```
/*
 * Topic: Aggregated Ethernet member link through ether-options
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $IFD        e.g. et-1/0/5
 *   $AE_BUNDLE  e.g. ae1
 */
interfaces {
    $IFD {
        ether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## evo/interfaces/ifd-lag-member-gigether-description-100g.conf

```
/*
 * Topic: Described 100G aggregated Ethernet member link through gigether-options
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 3
 *   total 3
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge4_acx7100-48l):
 *   $IFD          e.g. et-0/0/52
 *   $DESCRIPTION  e.g. "L2_WANEdeg4 to P2Node"
 *   $AE_BUNDLE    e.g. ae4
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        speed 100g;
        gigether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## evo/interfaces/ifd-lag-member-gigether-description.conf

```
/*
 * Topic: Described aggregated Ethernet member link through gigether-options
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003
 * Count:
 *   p1_ptx10003 2
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p1_ptx10003):
 *   $IFD          e.g. et-1/0/6
 *   $DESCRIPTION  e.g. "L2_P1Node to WANEdge1"
 *   $AE_BUNDLE    e.g. ae2
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

## evo/interfaces/ifd-lag-member-gigether.conf

```
/*
 * Topic: Aggregated Ethernet member link through gigether-options
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003 p2_ptx10001-36mr
 * Count:
 *   p1_ptx10003 1
 *   p2_ptx10001-36mr 2
 *   total 3
 * Highlights:
 *   - `gigether-options 802.3ad` assigns the port to its bundle; Layer 2 and Layer 3 settings live on the `ae` interface.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p1_ptx10003):
 *   $IFD        e.g. et-1/0/5
 *   $AE_BUNDLE  e.g. ae2
 */
interfaces {
    $IFD {
        gigether-options {
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
 *   EVO: ce1_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 4
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce1_acx7100-48l):
 *   $IFD  e.g. et-0/0/48
 */
interfaces {
    $IFD {
        speed 100g;
    }
}
```

## evo/interfaces/ifd-unused.conf

```
/*
 * Topic: Port marked unused
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Highlights:
 *   - `unused` keeps the port out of service and out of any bundle.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $IFD  e.g. et-1/0/9
 */
interfaces {
    $IFD {
        unused;
    }
}
```

## evo/interfaces/ifl-core-inet-mpls.conf

```
/*
 * Topic: Core-facing point-to-point link with IPv4 and MPLS families
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l p1_ptx10003 p2_ptx10001-36mr wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 4
 *   p1_ptx10003 8
 *   p2_ptx10001-36mr 4
 *   wanedge3_acx7509 3
 *   wanedge4_acx7100-48l 3
 *   total 22
 * Highlights:
 *   - Untagged core link: `family inet` for OSPF and `family mpls` for LDP-signalled transport.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce1_acx7100-48l):
 *   $CORE_PHYS     e.g. et-0/0/48
 *   $CORE_V4_ADDR  e.g. 10.0.13.1/30
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

## evo/interfaces/ifl-loopback-inet-primary.conf

```
/*
 * Topic: Primary IPv4 loopback address
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - `primary` makes this address the router's default source address.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $LOOPBACK_V4_PFX  e.g. 192.168.0.14/32
 */
interfaces {
    lo0 {
        unit 0 {
            family inet {
                address $LOOPBACK_V4_PFX {
                    primary;
                }
            }
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
 *   EVO: p2_ptx10001-36mr wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   p2_ptx10001-36mr 1
 *   wanedge3_acx7509 100
 *   wanedge4_acx7100-48l 100
 *   total 201
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p2_ptx10001-36mr):
 *   $UNIT             e.g. 0
 *   $LOOPBACK_V4_PFX  e.g. 6.6.6.6/32
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

## evo/interfaces/ifl-loopback-mpls.conf

```
/*
 * Topic: MPLS family on the primary loopback unit
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
interfaces {
    lo0 {
        unit 0 {
            family mpls;
        }
    }
}
```

## evo/interfaces/ifl-vlan-bridge.conf

```
/*
 * Topic: VLAN-tagged bridge unit
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 4538
 *   wanedge3_acx7509 1000
 *   wanedge4_acx7100-48l 1000
 *   total 6538
 * Highlights:
 *   - `encapsulation vlan-bridge` places the unit in a bridge domain or VLAN.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce1_acx7100-48l):
 *   $IFD   e.g. ae1
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

## evo/interfaces/ifl-vlan-ccc-family-ccc.conf

```
/*
 * Topic: VLAN-tagged circuit cross-connect unit with family ccc
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 3999
 *   wanedge4_acx7100-48l 4000
 *   total 7999
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $IFD   e.g. ae1
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

## evo/interfaces/ifl-vlan-ccc.conf

```
/*
 * Topic: VLAN-tagged circuit cross-connect unit
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 5000
 *   wanedge3_acx7509 1501
 *   wanedge4_acx7100-48l 1500
 *   total 8001
 * Highlights:
 *   - `encapsulation vlan-ccc` hands the VLAN to a Layer 2 circuit or local switch.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce1_acx7100-48l):
 *   $IFD   e.g. ae1
 *   $UNIT  e.g. 1501
 *   $VLAN  e.g. 1501
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

## evo/interfaces/ifl-vlan-inet-vrrp-accept-data.conf

```
/*
 * Topic: VLAN-tagged IPv4 unit with a VRRP group that accepts data
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 511
 *   wanedge4_acx7100-48l 512
 *   total 1023
 * Highlights:
 *   - VRRP group 1 shares the virtual gateway address between two WAN edges; the priority selects the master.
 *   - `accept-data` lets the master accept traffic addressed to the virtual address.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $IFD            e.g. et-1/0/12
 *   $UNIT           e.g. 3026
 *   $VLAN           e.g. 3026
 *   $AC_ADDR_V4     e.g. 10.75.0.101/24
 *   $VRRP_VIP       e.g. 10.75.0.104
 *   $VRRP_PRIORITY  e.g. 250
 */
interfaces {
    $IFD {
        unit $UNIT {
            vlan-id $VLAN;
            family inet {
                address $AC_ADDR_V4 {
                    vrrp-group 1 {
                        virtual-address $VRRP_VIP;
                        priority $VRRP_PRIORITY;
                        accept-data;
                    }
                }
            }
        }
    }
}
```

## evo/interfaces/ifl-vlan-inet-vrrp-preempt-accept-data.conf

```
/*
 * Topic: VLAN-tagged IPv4 unit with a preempting VRRP group that accepts data
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Highlights:
 *   - `preempt` returns mastership to the higher-priority router when it recovers.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $IFD            e.g. et-1/0/12
 *   $UNIT           e.g. 3001
 *   $VLAN           e.g. 3001
 *   $AC_ADDR_V4     e.g. 10.75.0.1/24
 *   $VRRP_VIP       e.g. 10.75.0.4
 *   $VRRP_PRIORITY  e.g. 250
 */
interfaces {
    $IFD {
        unit $UNIT {
            vlan-id $VLAN;
            family inet {
                address $AC_ADDR_V4 {
                    vrrp-group 1 {
                        virtual-address $VRRP_VIP;
                        priority $VRRP_PRIORITY;
                        preempt;
                        accept-data;
                    }
                }
            }
        }
    }
}
```

## evo/interfaces/ifl-vlan-inet.conf

```
/*
 * Topic: VLAN-tagged IPv4 unit
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 2620
 *   wanedge4_acx7100-48l 516
 *   total 3136
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $IFD         e.g. et-1/0/12
 *   $UNIT        e.g. 1067
 *   $VLAN        e.g. 1067
 *   $AC_ADDR_V4  e.g. 10.10.66.2/24
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

## evo/policy-options/community/cm-instance-target.conf

```
/*
 * Topic: Route-target community named after its hub-and-spoke instance
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 2000
 *   wanedge4_acx7100-48l 2
 *   total 2002
 * Highlights:
 *   - Hub and spoke communities carry different route-target values, so routes exported with one are imported only through the matching policy on the other side.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $INSTANCE_NAME  e.g. hub_1
 *   $RT_AS          e.g. 65535
 *   $RT_ID          e.g. 1
 */
policy-options {
    community $INSTANCE_NAME members target:$RT_AS:$RT_ID;
}
```

## evo/policy-options/policy-statement/per-packet-load-balance-accept.conf

```
/*
 * Topic: Per-packet load-balancing policy with an explicit accept
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003 wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   p1_ptx10003 1
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 3
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p1_ptx10003):
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

## evo/policy-options/policy-statement/per-packet-load-balance.conf

```
/*
 * Topic: Per-packet load-balancing policy
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l p1_ptx10003
 * Count:
 *   ce1_acx7100-48l 1
 *   p1_ptx10003 1
 *   total 2
 * Highlights:
 *   - Exported to the forwarding table so every equal-cost next hop is installed.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce1_acx7100-48l):
 *   $PPLB_NAME  e.g. load-balance
 */
policy-options {
    policy-statement $PPLB_NAME {
        term 1 {
            then {
                load-balance per-packet;
            }
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

## evo/policy-options/policy-statement/ps-el.conf

```
/*
 * Topic: Policy EL accepting routes that match prefix-list el-pe1, with a no-insert-el term
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement EL {
        term no-insert-el {
            from {
                prefix-list el-pe1;
            }
        }
        from {
            prefix-list el-pe1;
        }
        then accept;
    }
}
```

## evo/policy-options/policy-statement/ps-hub-spoke-export-bgp.conf

```
/*
 * Topic: Hub-and-spoke VRF export policy tagging BGP routes
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1000
 *   wanedge4_acx7100-48l 1
 *   total 1001
 * Highlights:
 *   - Adds the instance community to BGP-learned routes and rejects everything else.
 * Pair with:
 *  - evo/policy-options/community/cm-instance-target.conf
 *
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $INSTANCE_NAME  e.g. hub_1
 */
policy-options {
    policy-statement $INSTANCE_NAME {
        term a {
            from protocol bgp;
            then {
                community add $INSTANCE_NAME;
                accept;
            }
        }
        term b {
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-hub-spoke-import.conf

```
/*
 * Topic: Hub-and-spoke VRF import policy matching the instance community
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1000
 *   wanedge4_acx7100-48l 1
 *   total 1001
 * Highlights:
 *   - Accepts BGP routes tagged with the instance community and rejects everything else.
 * Pair with:
 *  - evo/policy-options/community/cm-instance-target.conf
 *
 * Peers with: n/a
 * Variables (example values from wanedge3_acx7509):
 *   $INSTANCE_NAME  e.g. spoke_1
 */
policy-options {
    policy-statement $INSTANCE_NAME {
        term a {
            from {
                protocol bgp;
                community $INSTANCE_NAME;
            }
            then accept;
        }
        term b {
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-next-hop-self.conf

```
/*
 * Topic: Policy next-hop-self setting next-hop self and accepting
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
    policy-statement next-hop-self {
        then {
            next-hop self;
            accept;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-nhs.conf

```
/*
 * Topic: Policy nhs setting next-hop self
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
    policy-statement nhs {
        then {
            next-hop self;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-null.conf

```
/*
 * Topic: Reject-all policy named null
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
    policy-statement null {
        then reject;
    }
}
```

## evo/policy-options/policy-statement/ps-redistribute-vpn.conf

```
/*
 * Topic: Policy accepting BGP routes and rejecting the rest
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
    policy-statement redistribute-vpn {
        term a {
            from protocol bgp;
            then accept;
        }
        term b {
            then reject;
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
 *   EVO: p1_ptx10003 p2_ptx10001-36mr wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   p1_ptx10003 1
 *   p2_ptx10001-36mr 1
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 4
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

## evo/policy-options/policy-statement/ps-send-static.conf

```
/*
 * Topic: Policy send-static accepting static routes
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
    policy-statement send-static {
        term 1 {
            from protocol static;
            then accept;
        }
    }
}
```

## evo/policy-options/prefix-list/pl-el-pe1.conf

```
/*
 * Topic: Prefix-list el-pe1 with one host route
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    prefix-list el-pe1 {
        192.168.0.12/32;
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

## evo/protocols/bgp-advertise-peer-as-local-as-graceful-restart.conf

```
/*
 * Topic: BGP advertise-peer-as with a local AS and graceful restart
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Pair with: none
 * Variables (example values from wanedge3_acx7509):
 *   $ASN  e.g. 64512
 */
protocols {
    bgp {
        advertise-peer-as;
        local-as $ASN;
        graceful-restart;
    }
}
```

## evo/protocols/bgp-group-bgp-mcast-1-wanedge3.conf

```
/*
 * Topic: iBGP group bgp_mcast_1 with inet, inet-vpn and inet-mvpn families and three neighbors
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Highlights:
 *   - `local-address 44.44.44.1` is not an address of this device.
 * Pair with: none
 * Variables: none
 */
protocols {
    bgp {
        group bgp_mcast_1 {
            type internal;
            local-address 44.44.44.1;
            family inet {
                unicast;
            }
            family inet-vpn {
                unicast;
            }
            family inet-mvpn {
                signaling;
            }
            local-as 64512;
            neighbor 10.33.33.1;
            neighbor 10.22.22.1;
            neighbor 10.11.11.1;
        }
    }
}
```

## evo/protocols/bgp-overlay-pe-labeled-unicast.conf

```
/*
 * Topic: WAN-edge iBGP overlay with labeled unicast, L3VPN, VPLS and route-target families
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Variant group: ewan-core-edge-bgp-overlay
 *   Provides: inet-vpn, l2vpn, labeled-unicast
 * Highlights:
 *   - iBGP to two route reflectors carries `inet-vpn` (L3VPN) and `l2vpn signaling` (BGP-VPLS); `family route-target` limits the VPN routes each reflector sends.
 *   - BFD at 10 ms x 3 detects a failed reflector session quickly.
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-bgp-to-ospf.conf
 *
 * Variables (example values from wanedge3_acx7509):
 *   $LOOPBACK_V4  e.g. 192.168.0.14
 *   $RR1_V4       e.g. 192.168.0.17
 *   $RR2_V4       e.g. 192.168.0.11
 */
protocols {
    bgp {
        group ibgp {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast;
            }
            family inet-vpn {
                any;
            }
            family l2vpn {
                signaling;
            }
            family route-target;
            export bgp-to-ospf;
            bfd-liveness-detection {
                minimum-interval 10;
                multiplier 3;
            }
            neighbor $RR1_V4;
            neighbor $RR2_V4;
        }
    }
}
```

## evo/protocols/bgp-overlay-pe-local-as.conf

```
/*
 * Topic: WAN-edge iBGP overlay with L3VPN, VPLS and route-target families and a group local AS
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 1
 *   total 1
 * Variant group: ewan-core-edge-bgp-overlay
 *   Provides: inet-vpn, l2vpn
 * Highlights:
 *   - iBGP to two route reflectors carries `inet-vpn` (L3VPN) and `l2vpn signaling` (BGP-VPLS); `family route-target` limits the VPN routes each reflector sends.
 *   - BFD at 10 ms x 3 detects a failed reflector session quickly.
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-bgp-to-ospf.conf
 *
 * Variables (example values from wanedge4_acx7100-48l):
 *   $LOOPBACK_V4  e.g. 192.168.0.16
 *   $ASN          e.g. 64512
 *   $RR1_V4       e.g. 192.168.0.17
 *   $RR2_V4       e.g. 192.168.0.11
 */
protocols {
    bgp {
        group ibgp {
            type internal;
            local-address $LOOPBACK_V4;
            family inet-vpn {
                any;
            }
            family l2vpn {
                signaling;
            }
            family route-target;
            export bgp-to-ospf;
            local-as $ASN;
            bfd-liveness-detection {
                minimum-interval 10;
                multiplier 3;
            }
            neighbor $RR1_V4;
            neighbor $RR2_V4;
        }
    }
}
```

## evo/protocols/l2-learning-global-mac-limit.conf

```
/*
 * Topic: Global MAC table limit of 700,000 entries
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Pair with: none
 * Variables: none
 */
protocols {
    l2-learning {
        global-mac-limit {
            700000;
        }
    }
}
```

## evo/protocols/l2circuit-ethernet-vlan-control-word.conf

```
/*
 * Topic: LDP-signalled Layer 2 circuit with control word and Ethernet VLAN encapsulation
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 4500
 *   wanedge4_acx7100-48l 4500
 *   total 9000
 * Highlights:
 *   - `pseudowire-status-tlv` signals attachment-circuit state to the remote PE; encapsulation and MTU mismatches are ignored so mixed platforms interoperate.
 * Pair with: none
 * Variables (example values from wanedge3_acx7509):
 *   $REMOTE_PE_V4  e.g. 192.168.0.15
 *   $AC_IFL        e.g. ae1.1001
 *   $VC_ID         e.g. 1001
 */
protocols {
    l2circuit {
        neighbor $REMOTE_PE_V4 {
            interface $AC_IFL {
                virtual-circuit-id $VC_ID;
                control-word;
                encapsulation-type ethernet-vlan;
                ignore-encapsulation-mismatch;
                ignore-mtu-mismatch;
                pseudowire-status-tlv;
                revert-time 30;
            }
        }
    }
}
```

## evo/protocols/l2circuit-local-switching.conf

```
/*
 * Topic: Locally switched Layer 2 circuit between two units
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 2500
 *   total 2500
 * Highlights:
 *   - Cross-connects two local units without a remote PE.
 * Pair with:
 *  - evo/interfaces/ifl-vlan-ccc.conf
 *
 * Peers with: n/a
 * Variables (example values from ce1_acx7100-48l):
 *   $AC_IFL_A  e.g. ae1.1501
 *   $AC_IFL_B  e.g. et-0/0/44.1501
 */
protocols {
    l2circuit {
        local-switching {
            interface $AC_IFL_A {
                end-interface {
                    interface $AC_IFL_B;
                }
            }
        }
    }
}
```

## evo/protocols/ldp-auto-targeted-3-core-loopback-p2mp.conf

```
/*
 * Topic: LDP with automatic targeted sessions on three core links and the loopback, and point-to-multipoint LSPs
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Highlights:
 *   - `p2mp` enables mLDP point-to-multipoint LSPs for the NG-MVPN provider tunnels.
 * Pair with: none
 * Variables (example values from wanedge3_acx7509):
 *   $CORE_PHYS_1  e.g. et-1/0/0
 *   $CORE_PHYS_2  e.g. et-1/0/1
 *   $CORE_PHYS_3  e.g. et-1/0/4
 */
protocols {
    ldp {
        auto-targeted-session {
            teardown-delay 90;
            maximum-sessions 100;
        }
        interface $CORE_PHYS_1.0;
        interface $CORE_PHYS_2.0;
        interface $CORE_PHYS_3.0;
        interface lo0.0;
        p2mp;
    }
}
```

## evo/protocols/ldp-auto-targeted-4-core-loopback.conf

```
/*
 * Topic: LDP with automatic targeted sessions on four core links and the loopback
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - `auto-targeted-session` brings up targeted LDP sessions on demand for remote-LFA tunnels, torn down 90 seconds after they are no longer needed.
 * Pair with: none
 * Variables (example values from ce1_acx7100-48l):
 *   $CORE_PHYS_1  e.g. et-0/0/48
 *   $CORE_PHYS_2  e.g. et-0/0/49
 *   $CORE_PHYS_3  e.g. et-0/0/50
 *   $CORE_PHYS_4  e.g. et-0/0/51
 */
protocols {
    ldp {
        auto-targeted-session {
            teardown-delay 90;
            maximum-sessions 100;
        }
        interface $CORE_PHYS_1.0;
        interface $CORE_PHYS_2.0;
        interface $CORE_PHYS_3.0;
        interface $CORE_PHYS_4.0;
        interface lo0.0;
    }
}
```

## evo/protocols/ldp-auto-targeted-8-core-loopback-p2mp.conf

```
/*
 * Topic: LDP with automatic targeted sessions on eight core links and the loopback, with point-to-multipoint LSPs
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003
 * Count:
 *   p1_ptx10003 1
 *   total 1
 * Highlights:
 *   - `auto-targeted-session` brings up targeted LDP sessions on demand for remote-LFA tunnels.
 *   - `p2mp` enables mLDP point-to-multipoint LSPs for the NG-MVPN provider tunnels.
 * Pair with: none
 * Variables (example values from p1_ptx10003):
 *   $CORE_PHYS_1  e.g. et-0/0/0
 *   $CORE_PHYS_2  e.g. et-0/0/1
 *   $CORE_PHYS_3  e.g. et-0/0/2
 *   $CORE_PHYS_4  e.g. et-0/0/3
 *   $CORE_PHYS_5  e.g. et-1/0/1
 *   $CORE_PHYS_6  e.g. et-1/0/3
 *   $CORE_PHYS_7  e.g. et-1/0/4
 *   $CORE_PHYS_8  e.g. ae2
 */
protocols {
    ldp {
        auto-targeted-session {
            teardown-delay 90;
            maximum-sessions 100;
        }
        interface $CORE_PHYS_1.0;
        interface $CORE_PHYS_2.0;
        interface $CORE_PHYS_3.0;
        interface $CORE_PHYS_4.0;
        interface $CORE_PHYS_5.0;
        interface $CORE_PHYS_6.0;
        interface $CORE_PHYS_7.0;
        interface $CORE_PHYS_8.0;
        interface lo0.0;
        p2mp;
    }
}
```

## evo/protocols/ldp-interface-3-core-loopback.conf

```
/*
 * Topic: LDP on three core links and the loopback
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 1
 *   total 1
 * Pair with: none
 * Variables (example values from p2_ptx10001-36mr):
 *   $CORE_PHYS_1  e.g. et-0/0/4
 *   $CORE_PHYS_2  e.g. et-0/0/6
 *   $CORE_PHYS_3  e.g. ae4
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

## evo/protocols/ldp-wanedge4.conf

```
/*
 * Topic: LDP with automatic targeted sessions on named links, all interfaces and the loopback, with point-to-multipoint LSPs
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - `p2mp` enables mLDP point-to-multipoint LSPs for the NG-MVPN provider tunnels.
 * Pair with: none
 * Variables: none
 */
protocols {
    ldp {
        auto-targeted-session {
            teardown-delay 90;
            maximum-sessions 100;
        }
        interface et-0/0/0.0;
        interface et-0/0/49.0;
        interface et-0/0/50.0;
        interface ae1.0;
        interface ae4.0;
        interface all;
        interface lo0.0;
        p2mp;
    }
}
```

## evo/protocols/mpls-interface-4-core.conf

```
/*
 * Topic: MPLS on four core links
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l p2_ptx10001-36mr
 * Count:
 *   ce1_acx7100-48l 1
 *   p2_ptx10001-36mr 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce1_acx7100-48l):
 *   $CORE_PHYS_1  e.g. et-0/0/50
 *   $CORE_PHYS_2  e.g. et-0/0/48
 *   $CORE_PHYS_3  e.g. et-0/0/51
 *   $CORE_PHYS_4  e.g. et-0/0/49
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

## evo/protocols/mpls-interface-8-core.conf

```
/*
 * Topic: MPLS on eight core links
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003
 * Count:
 *   p1_ptx10003 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from p1_ptx10003):
 *   $CORE_PHYS_1  e.g. et-0/0/1
 *   $CORE_PHYS_2  e.g. et-0/0/0
 *   $CORE_PHYS_3  e.g. et-0/0/2
 *   $CORE_PHYS_4  e.g. et-0/0/3
 *   $CORE_PHYS_5  e.g. ae2
 *   $CORE_PHYS_6  e.g. et-1/0/3
 *   $CORE_PHYS_7  e.g. et-1/0/4
 *   $CORE_PHYS_8  e.g. et-1/0/1
 */
protocols {
    mpls {
        interface $CORE_PHYS_1.0;
        interface $CORE_PHYS_2.0;
        interface $CORE_PHYS_3.0;
        interface $CORE_PHYS_4.0;
        interface $CORE_PHYS_5.0;
        interface $CORE_PHYS_6.0;
        interface $CORE_PHYS_7.0;
        interface $CORE_PHYS_8.0;
    }
}
```

## evo/protocols/mpls-wanedge3.conf

```
/*
 * Topic: MPLS on the core links and loopback with one entropy-label LSP
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
    mpls {
        label-switched-path lsp_to_pe1 {
            to 192.168.0.12;
            entropy-label;
        }
        interface et-1/0/1.0;
        interface et-1/0/0.0;
        interface et-1/0/4.0;
        interface lo0.0;
    }
}
```

## evo/protocols/mpls-wanedge4.conf

```
/*
 * Topic: MPLS on the core links with one LSP
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
    mpls {
        label-switched-path lsp_to_pe2 {
            to 192.168.0.15;
        }
        interface et-0/0/49.0;
        interface et-0/0/50.0;
        interface ae4.0;
    }
}
```

## evo/protocols/ospf-area0-ce1.conf

```
/*
 * Topic: OSPF area 0 with four protected core links and 100 ms BFD
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - Every core link runs `node-link-protection`, BFD and `ldp-synchronization`; the loopback is passive and the management port is excluded.
 * Pair with: none
 * Variables (example values from ce1_acx7100-48l):
 *   $CORE_INTF_1  e.g. et-0/0/50.0
 *   $CORE_INTF_2  e.g. et-0/0/48.0
 *   $CORE_INTF_3  e.g. et-0/0/51.0
 *   $CORE_INTF_4  e.g. et-0/0/49.0
 */
protocols {
    ospf {
        area 0.0.0.0 {
            interface lo0.0 {
                passive;
            }
            interface fxp0.0 {
                disable;
            }
            interface $CORE_INTF_1 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface $CORE_INTF_2 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface $CORE_INTF_3 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface $CORE_INTF_4 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 100;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
        }
    }
}
```

## evo/protocols/ospf-area0-p1.conf

```
/*
 * Topic: OSPF area 0 with eight protected core links and 10 ms BFD
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003
 * Count:
 *   p1_ptx10003 1
 *   total 1
 * Highlights:
 *   - Every core link runs `node-link-protection`, 10 ms BFD and `ldp-synchronization`; the loopback is passive and the management port is excluded.
 * Pair with: none
 * Variables (example values from p1_ptx10003):
 *   $CORE_INTF_1  e.g. et-0/0/1.0
 *   $CORE_INTF_2  e.g. et-0/0/0.0
 *   $CORE_INTF_3  e.g. et-0/0/2.0
 *   $CORE_INTF_4  e.g. et-0/0/3.0
 *   $CORE_INTF_5  e.g. et-1/0/1.0
 *   $CORE_INTF_6  e.g. et-1/0/3.0
 *   $CORE_INTF_7  e.g. et-1/0/4.0
 *   $CORE_INTF_8  e.g. ae2.0
 */
protocols {
    ospf {
        area 0.0.0.0 {
            interface lo0.0 {
                passive;
            }
            interface fxp0.0 {
                disable;
            }
            interface $CORE_INTF_1 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface $CORE_INTF_2 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface $CORE_INTF_3 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface $CORE_INTF_4 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface $CORE_INTF_5 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface $CORE_INTF_6 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface $CORE_INTF_7 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface $CORE_INTF_8 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
        }
    }
}
```

## evo/protocols/ospf-area0-p2.conf

```
/*
 * Topic: OSPF area 0 with four protected core links and 10 ms BFD
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 1
 *   total 1
 * Highlights:
 *   - Every core link runs `node-link-protection`, 10 ms BFD and `ldp-synchronization`; the loopback is passive and the management port is excluded.
 * Pair with: none
 * Variables (example values from p2_ptx10001-36mr):
 *   $CORE_INTF_1  e.g. et-0/0/5.0
 *   $CORE_INTF_2  e.g. et-0/0/4.0
 *   $CORE_INTF_3  e.g. et-0/0/6.0
 *   $CORE_INTF_4  e.g. ae4.0
 */
protocols {
    ospf {
        area 0.0.0.0 {
            interface lo0.0 {
                passive;
            }
            interface fxp0.0 {
                disable;
            }
            interface $CORE_INTF_1 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface $CORE_INTF_2 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface $CORE_INTF_3 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface $CORE_INTF_4 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
        }
    }
}
```

## evo/protocols/ospf-area0-wanedge3.conf

```
/*
 * Topic: OSPF area 0 with three protected core links and plain access-unit interfaces
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
        area 0.0.0.0 {
            interface et-1/0/0.0 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface et-1/0/1.0 {
                node-link-protection;
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
            interface et-1/0/4.0 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface et-1/0/12.4001;
            interface et-1/0/12.4002;
            interface et-1/0/12.4003;
            interface et-1/0/12.4004;
            interface et-1/0/12.4005;
            interface et-1/0/12.4006;
            interface et-1/0/12.4007;
            interface et-1/0/12.4008;
            interface et-1/0/12.4009;
            interface et-1/0/12.4010;
            interface et-1/0/12.4011;
            interface et-1/0/12.4012;
            interface et-1/0/12.4013;
            interface et-1/0/12.4014;
            interface et-1/0/12.4015;
            interface et-1/0/12.4016;
            interface et-1/0/12.4017;
            interface et-1/0/12.4018;
            interface et-1/0/12.4019;
            interface et-1/0/12.4020;
            interface et-1/0/12.4021;
            interface et-1/0/12.4022;
            interface et-1/0/12.4023;
            interface et-1/0/12.4024;
            interface et-1/0/12.4025;
            interface et-1/0/12.4026;
            interface et-1/0/12.4027;
            interface et-1/0/12.4028;
            interface et-1/0/12.4029;
            interface et-1/0/12.4030;
            interface et-1/0/12.4031;
            interface et-1/0/12.4032;
            interface et-1/0/12.4033;
            interface et-1/0/12.4034;
            interface et-1/0/12.4035;
            interface et-1/0/12.4036;
            interface et-1/0/12.4037;
            interface et-1/0/12.4038;
            interface et-1/0/12.4039;
            interface et-1/0/12.4040;
            interface et-1/0/12.4041;
            interface et-1/0/12.4042;
            interface et-1/0/12.4043;
            interface et-1/0/12.4044;
            interface et-1/0/12.4045;
            interface et-1/0/12.4046;
            interface et-1/0/12.4047;
            interface et-1/0/12.4048;
            interface et-1/0/12.4049;
            interface et-1/0/12.4050;
            interface fxp0.0 {
                disable;
            }
            interface em0.0 {
                disable;
            }
            interface et-1/0/8.1001;
            interface et-1/0/8.1002;
            interface et-1/0/8.1003;
            interface et-1/0/8.1004;
            interface et-1/0/8.1005;
            interface et-1/0/10.515;
            interface et-1/0/10.516;
            interface et-1/0/10.517;
            interface et-1/0/10.518;
            interface et-1/0/10.519;
            interface et-1/0/10.520;
            interface et-1/0/10.521;
            interface et-1/0/10.525;
            interface et-1/0/10.522;
            interface et-1/0/10.523;
            interface et-1/0/10.524;
        }
    }
}
```

## evo/protocols/ospf-area0-wanedge4.conf

```
/*
 * Topic: OSPF area 0 with protected core links and two access units
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
    ospf {
        area 0.0.0.0 {
            interface et-0/0/49.0 {
                node-link-protection;
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
            interface ae4.0 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface et-0/0/50.0 {
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface et-0/0/1.514;
            interface et-0/0/0.1001;
        }
    }
}
```

## evo/protocols/ospf-backup-spf-options-traffic-engineering.conf

```
/*
 * Topic: OSPF remote LFA backup options with traffic engineering
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
 *   - `remote-backup-calculation` with `per-prefix-calculation all` and `node-link-degradation` computes per-prefix remote LFA backups and prefers node protection.
 *   - `traffic-engineering` floods TE information for the LDP and RSVP control planes.
 * Pair with: none
 * Variables: none
 */
protocols {
    ospf {
        backup-spf-options {
            remote-backup-calculation;
            per-prefix-calculation all;
            node-link-degradation;
        }
        traffic-engineering;
    }
}
```

## evo/protocols/pim-interface-sparse.conf

```
/*
 * Topic: PIM sparse-mode interface
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003 wanedge3_acx7509
 * Count:
 *   p1_ptx10003 5
 *   wanedge3_acx7509 28
 *   total 33
 * Pair with: none
 * Variables (example values from p1_ptx10003):
 *   $IFD   e.g. ae2
 *   $UNIT  e.g. 0
 */
protocols {
    pim {
        interface $IFD.$UNIT {
            mode sparse;
        }
    }
}
```

## evo/protocols/pim-rp-local.conf

```
/*
 * Topic: Local PIM rendezvous point on the router loopback
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003
 * Count:
 *   p1_ptx10003 1
 *   total 1
 * Highlights:
 *   - `process-non-null-as-null-register` lets the RP handle data-carrying register messages as null registers.
 * Pair with: none
 * Variables (example values from p1_ptx10003):
 *   $PIM_RP_V4  e.g. 1.1.1.8
 */
protocols {
    pim {
        rp {
            local {
                address $PIM_RP_V4;
                process-non-null-as-null-register;
            }
        }
    }
}
```

## evo/protocols/pim-rp-static-interface.conf

```
/*
 * Topic: Static PIM rendezvous point with one PIM interface in the default mode
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Pair with: none
 * Variables (example values from wanedge3_acx7509):
 *   $PIM_RP_V4  e.g. 192.168.0.17
 *   $IFD        e.g. et-1/0/10
 *   $UNIT       e.g. 0
 */
protocols {
    pim {
        rp {
            static {
                address $PIM_RP_V4;
            }
        }
        interface $IFD.$UNIT;
    }
}
```

## evo/routing-instances/l3vpn/ri-l3vpn-ebgp-export-vrf-policy.conf

```
/*
 * Topic: L3VPN VRF with an exporting eBGP CE session and explicit import/export policies
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1000
 *   total 1000
 * Highlights:
 *   - The CE session exports through `redistribute-vpn`; VRF import and export use separate named policies.
 * Pair with:
 *  - evo/interfaces/ifl-vlan-inet.conf
 *  - evo/policy-options/community/cm-instance-target.conf
 *  - evo/policy-options/policy-statement/ps-redistribute-vpn.conf
 *  - variant:ewan-core-edge-bgp-overlay families=inet-vpn
 *
 * Variables (example values from wanedge3_acx7509):
 *   $INSTANCE_NAME    e.g. Hub_Adv_To_Spokes_1001
 *   $BGP_GROUP        e.g. CE2
 *   $CE_PEER_V4       e.g. 10.70.0.1
 *   $PE_LOCAL_V4      e.g. 10.70.0.2
 *   $ASN_CUSTOMER     e.g. 64520
 *   $AC_IFL           e.g. et-1/0/12.2001
 *   $LOOPBACK_V4      e.g. 192.168.0.14
 *   $RD_SUB_ASSIGNED  e.g. 2001
 *   $IMPORT_POL       e.g. spoke_1
 *   $EXPORT_POL       e.g. null
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        protocols {
            bgp {
                group $BGP_GROUP {
                    type external;
                    export redistribute-vpn;
                    neighbor $CE_PEER_V4 {
                        local-address $PE_LOCAL_V4;
                        peer-as $ASN_CUSTOMER;
                    }
                }
            }
        }
        interface $AC_IFL;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-import $IMPORT_POL;
        vrf-export $EXPORT_POL;
    }
}
```

## evo/routing-instances/l3vpn/ri-l3vpn-ebgp-router-id-vrf-target.conf

```
/*
 * Topic: L3VPN VRF with an eBGP CE session, a VRF router ID and a route target
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 512
 *   wanedge4_acx7100-48l 512
 *   total 1024
 * Highlights:
 *   - `vrf-table-label` gives the VRF one label for IP lookup on egress.
 * Pair with:
 *  - variant:ewan-core-edge-bgp-overlay families=inet-vpn
 *
 * Variables (example values from wanedge3_acx7509):
 *   $INSTANCE_NAME    e.g. l3vpn_vrrp_3001_3001
 *   $LOOPBACK_V4      e.g. 192.168.0.14
 *   $BGP_GROUP        e.g. CE2
 *   $CE_PEER_V4       e.g. 10.75.0.3
 *   $PE_LOCAL_V4      e.g. 10.75.0.4
 *   $ASN_CUSTOMER     e.g. 64520
 *   $AC_IFL           e.g. et-1/0/12.3001
 *   $RD_SUB_ASSIGNED  e.g. 3001
 *   $RT_AS            e.g. 64510
 *   $RT_ID            e.g. 3001
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            router-id $LOOPBACK_V4;
        }
        protocols {
            bgp {
                group $BGP_GROUP {
                    type external;
                    family inet {
                        any;
                    }
                    neighbor $CE_PEER_V4 {
                        local-address $PE_LOCAL_V4;
                        peer-as $ASN_CUSTOMER;
                    }
                }
            }
        }
        interface $AC_IFL;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
        vrf-table-label;
    }
}
```

## evo/routing-instances/l3vpn/ri-l3vpn-ebgp-vrf-policy.conf

```
/*
 * Topic: L3VPN VRF with an eBGP CE session and explicit import/export policies
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1000
 *   total 1000
 * Pair with:
 *  - evo/interfaces/ifl-vlan-inet.conf
 *  - evo/policy-options/community/cm-instance-target.conf
 *  - variant:ewan-core-edge-bgp-overlay families=inet-vpn
 *
 * Variables (example values from wanedge3_acx7509):
 *   $INSTANCE_NAME    e.g. Spokes_Adv_To_Hub_1001
 *   $BGP_GROUP        e.g. CE2
 *   $CE_PEER_V4       e.g. 10.65.0.1
 *   $PE_LOCAL_V4      e.g. 10.65.0.2
 *   $ASN_CUSTOMER     e.g. 64520
 *   $AC_IFL           e.g. et-1/0/12.1001
 *   $LOOPBACK_V4      e.g. 192.168.0.14
 *   $RD_SUB_ASSIGNED  e.g. 1001
 *   $IMPORT_POL       e.g. null
 *   $EXPORT_POL       e.g. hub_1
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        protocols {
            bgp {
                group $BGP_GROUP {
                    type external;
                    neighbor $CE_PEER_V4 {
                        local-address $PE_LOCAL_V4;
                        peer-as $ASN_CUSTOMER;
                    }
                }
            }
        }
        interface $AC_IFL;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-import $IMPORT_POL;
        vrf-export $EXPORT_POL;
    }
}
```

## evo/routing-instances/l3vpn/ri-l3vpn-mvpn-ibgp-rp-local-vpn-mcast-1.conf

```
/*
 * Topic: NG-MVPN VRF vpn-mcast_1 with a VRF iBGP session acting as PIM RP
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Highlights:
 *   - NG-MVPN VRF: `mvpn` signals multicast state over BGP, and `ldp-p2mp` provider tunnels carry it, with one selective tunnel for the configured source and group.
 *   - OSPF inside the VRF advertises the access subnet and VRF loopback toward the site; `bgp-to-ospf` redistributes remote VPN routes.
 * Pair with: none
 * Variables: none
 */
routing-instances {
    vpn-mcast_1 {
        instance-type vrf;
        protocols {
            bgp {
                group mcast_1 {
                    type internal;
                    peer-as 64512;
                    neighbor 10.11.11.1;
                }
            }
            mvpn;
            ospf {
                area 0.0.0.0 {
                    interface lo0.1;
                    interface et-1/0/10.1;
                }
                export bgp-to-ospf;
            }
            pim {
                rp {
                    local {
                        address 10.33.33.1;
                        group-ranges {
                            227.1.1.1/32;
                        }
                        process-non-null-as-null-register;
                    }
                }
                interface lo0.1;
                interface et-1/0/10.1 {
                    mode sparse;
                }
            }
        }
        interface et-1/0/10.1;
        interface lo0.1;
        route-distinguisher 10.33.33.1:1;
        vrf-target target:1:1;
        vrf-table-label;
        provider-tunnel {
            ldp-p2mp;
            selective {
                tunnel-limit 1;
                group 227.1.1.1/32 {
                    source 124.1.1.1/32 {
                        ldp-p2mp;
                    }
                }
            }
        }
    }
}
```

## evo/routing-instances/l3vpn/ri-l3vpn-mvpn-rp-local.conf

```
/*
 * Topic: NG-MVPN VRF acting as PIM RP for its group over LDP point-to-multipoint tunnels
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 99
 *   total 99
 * Highlights:
 *   - NG-MVPN VRF: `mvpn` signals multicast state over BGP, and `ldp-p2mp` provider tunnels carry it, with one selective tunnel for the configured source and group.
 *   - OSPF inside the VRF advertises the access subnet and VRF loopback toward the site; `bgp-to-ospf` redistributes remote VPN routes.
 *   - The VRF loopback is the local RP for the group and also the route-distinguisher administrator.
 * Pair with: none
 * Variables (example values from wanedge3_acx7509):
 *   $INSTANCE_NAME        e.g. vpn-mcast_10
 *   $UNIT                 e.g. 10
 *   $AC_IFL               e.g. et-1/0/10.10
 *   $LOOPBACK_VRF_V4      e.g. 10.33.33.10
 *   $MCAST_GROUP_V4_PFX   e.g. 227.1.1.10/32
 *   $RD_SUB_ASSIGNED      e.g. 10
 *   $RT_AS                e.g. 1
 *   $RT_ID                e.g. 10
 *   $MCAST_SOURCE_V4_PFX  e.g. 124.1.10.1/32
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        protocols {
            mvpn;
            ospf {
                area 0.0.0.0 {
                    interface lo0.$UNIT;
                    interface $AC_IFL;
                }
                export bgp-to-ospf;
            }
            pim {
                rp {
                    local {
                        address $LOOPBACK_VRF_V4;
                        group-ranges {
                            $MCAST_GROUP_V4_PFX;
                        }
                        process-non-null-as-null-register;
                    }
                }
                interface lo0.$UNIT {
                    mode sparse;
                    version 2;
                }
                interface $AC_IFL {
                    mode sparse;
                    version 2;
                }
            }
        }
        interface $AC_IFL;
        interface lo0.$UNIT;
        route-distinguisher $LOOPBACK_VRF_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
        vrf-table-label;
        provider-tunnel {
            ldp-p2mp;
            selective {
                tunnel-limit 1;
                group $MCAST_GROUP_V4_PFX {
                    source $MCAST_SOURCE_V4_PFX {
                        ldp-p2mp;
                    }
                }
            }
        }
    }
}
```

## evo/routing-instances/l3vpn/ri-l3vpn-mvpn-rp-static-group-range-null-register.conf

```
/*
 * Topic: NG-MVPN VRF with a static PIM RP, a local group range and null-register processing over LDP point-to-multipoint tunnels
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 99
 *   total 99
 * Highlights:
 *   - NG-MVPN VRF: `mvpn` signals multicast state over BGP, and `ldp-p2mp` provider tunnels carry it, with one selective tunnel for the configured source and group.
 *   - OSPF inside the VRF advertises the access subnet and VRF loopback toward the site; `bgp-to-ospf` redistributes remote VPN routes.
 * Pair with: none
 * Variables (example values from wanedge4_acx7100-48l):
 *   $INSTANCE_NAME        e.g. vpn-mcast_10
 *   $UNIT                 e.g. 10
 *   $AC_IFL               e.g. et-0/0/1.10
 *   $MCAST_GROUP_V4_PFX   e.g. 227.1.1.10/32
 *   $PIM_RP_V4            e.g. 10.33.33.10
 *   $LOOPBACK_VRF_V4      e.g. 10.44.44.10
 *   $RD_SUB_ASSIGNED      e.g. 10
 *   $RT_AS                e.g. 1
 *   $RT_ID                e.g. 10
 *   $MCAST_SOURCE_V4_PFX  e.g. 124.1.10.1/32
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        protocols {
            mvpn;
            ospf {
                area 0.0.0.0 {
                    interface lo0.$UNIT;
                    interface $AC_IFL;
                }
                export bgp-to-ospf;
            }
            pim {
                rp {
                    local {
                        group-ranges {
                            $MCAST_GROUP_V4_PFX;
                        }
                        process-non-null-as-null-register;
                    }
                    static {
                        address $PIM_RP_V4;
                    }
                }
                interface lo0.$UNIT {
                    mode sparse;
                    version 2;
                }
                interface $AC_IFL {
                    mode sparse;
                    version 2;
                }
            }
        }
        interface $AC_IFL;
        interface lo0.$UNIT;
        route-distinguisher $LOOPBACK_VRF_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
        vrf-table-label;
        provider-tunnel {
            ldp-p2mp;
            selective {
                tunnel-limit 1;
                group $MCAST_GROUP_V4_PFX {
                    source $MCAST_SOURCE_V4_PFX {
                        ldp-p2mp;
                    }
                }
            }
        }
    }
}
```

## evo/routing-instances/l3vpn/ri-l3vpn-mvpn-rp-static-null-register-vpn-mcast-1.conf

```
/*
 * Topic: NG-MVPN VRF vpn-mcast_1 with a static PIM RP and null-register processing
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge4_acx7100-48l
 * Count:
 *   wanedge4_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - NG-MVPN VRF: `mvpn` signals multicast state over BGP, and `ldp-p2mp` provider tunnels carry it, with one selective tunnel for the configured source and group.
 *   - OSPF inside the VRF advertises the access subnet and VRF loopback toward the site; `bgp-to-ospf` redistributes remote VPN routes.
 * Pair with: none
 * Variables: none
 */
routing-instances {
    vpn-mcast_1 {
        instance-type vrf;
        protocols {
            mvpn;
            ospf {
                area 0.0.0.0 {
                    interface lo0.1;
                    interface et-0/0/1.1;
                }
                export bgp-to-ospf;
            }
            pim {
                rp {
                    local {
                        process-non-null-as-null-register;
                    }
                    static {
                        address 10.33.33.1;
                    }
                }
                interface lo0.1 {
                    mode sparse;
                    version 2;
                }
                interface et-0/0/1.1 {
                    mode sparse;
                    version 2;
                }
            }
        }
        interface et-0/0/1.1;
        interface lo0.1;
        route-distinguisher 10.44.44.1:1;
        vrf-target target:1:1;
        vrf-table-label;
        provider-tunnel {
            ldp-p2mp;
            selective {
                tunnel-limit 1;
                group 227.1.1.1/32 {
                    source 124.1.1.1/32 {
                        ldp-p2mp;
                    }
                }
            }
        }
    }
}
```

## evo/routing-instances/vpls/ri-vpls-virtual-switch-vlans-flow-label.conf

```
/*
 * Topic: BGP-VPLS virtual switch with flow labels and one VLAN
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Highlights:
 *   - BGP-VPLS virtual switch: BGP auto-discovers the sites and signals pseudowires; `no-tunnel-services` builds the VPLS without a tunnel PIC.
 *   - `flow-label-transmit` and `flow-label-receive` add a flow label so transit routers can load-balance the pseudowires.
 * Pair with:
 *  - evo/interfaces/ifl-vlan-bridge.conf
 *  - variant:ewan-core-edge-bgp-overlay families=l2vpn
 *
 * Variables (example values from wanedge3_acx7509):
 *   $INSTANCE_NAME    e.g. vpls_group_101_1
 *   $VPLS_SITE        e.g. 103
 *   $VPLS_SITE_ID     e.g. 1003
 *   $VC_ID            e.g. 1
 *   $RD_SUB_ADMIN     e.g. 4444
 *   $RD_SUB_ASSIGNED  e.g. 1011
 *   $RT_AS            e.g. 64512
 *   $RT_ID            e.g. 1011
 *   $VLAN_NAME        e.g. VPLS1
 *   $VLAN             e.g. 1
 *   $AC_IFL           e.g. ae1.1
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-switch;
        protocols {
            vpls {
                site $VPLS_SITE {
                    site-identifier $VPLS_SITE_ID;
                }
                no-tunnel-services;
                vpls-id $VC_ID;
                flow-label-transmit;
                flow-label-receive;
            }
        }
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
        vlans {
            $VLAN_NAME {
                vlan-id $VLAN;
                interface $AC_IFL;
            }
        }
    }
}
```

## evo/routing-instances/vpls/ri-vpls-virtual-switch-vlans.conf

```
/*
 * Topic: BGP-VPLS virtual switch with one VLAN
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509 wanedge4_acx7100-48l
 * Count:
 *   wanedge3_acx7509 999
 *   wanedge4_acx7100-48l 1000
 *   total 1999
 * Highlights:
 *   - BGP-VPLS virtual switch: BGP auto-discovers the sites and signals pseudowires; `no-tunnel-services` builds the VPLS without a tunnel PIC.
 * Pair with:
 *  - evo/interfaces/ifl-vlan-bridge.conf
 *  - variant:ewan-core-edge-bgp-overlay families=l2vpn
 *
 * Variables (example values from wanedge3_acx7509):
 *   $INSTANCE_NAME    e.g. vpls_group_101_10
 *   $VPLS_SITE        e.g. 103
 *   $VPLS_SITE_ID     e.g. 1003
 *   $VC_ID            e.g. 10
 *   $RD_SUB_ADMIN     e.g. 4444
 *   $RD_SUB_ASSIGNED  e.g. 10110
 *   $RT_AS            e.g. 64512
 *   $RT_ID            e.g. 10110
 *   $VLAN_NAME        e.g. VPLS10
 *   $VLAN             e.g. 10
 *   $AC_IFL           e.g. ae1.10
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-switch;
        protocols {
            vpls {
                site $VPLS_SITE {
                    site-identifier $VPLS_SITE_ID;
                }
                no-tunnel-services;
                vpls-id $VC_ID;
            }
        }
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
        vlans {
            $VLAN_NAME {
                vlan-id $VLAN;
                interface $AC_IFL;
            }
        }
    }
}
```

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

## evo/routing-options/forwarding-table-chained-composite-l3vpn.conf

```
/*
 * Topic: Chained composite next hops for L3VPN ingress
 * Seen on:
 *   Junos: (none)
 *   EVO: wanedge3_acx7509
 * Count:
 *   wanedge3_acx7509 1
 *   total 1
 * Highlights:
 *   - Ingress L3VPN routes share chained composite next hops, shrinking forwarding-table state at VRF scale.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    forwarding-table {
        chained-composite-next-hop {
            ingress {
                l3vpn;
            }
        }
    }
}
```

## evo/routing-options/forwarding-table-pplb-load-balance-ecmp-fast-reroute.conf

```
/*
 * Topic: Forwarding-table load balancing through two policies with ECMP fast reroute
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_ptx10003
 * Count:
 *   p1_ptx10003 1
 *   total 1
 * Highlights:
 *   - `ecmp-fast-reroute` pre-installs the remaining ECMP members so a failed path is bypassed in the forwarding plane.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    forwarding-table {
        export [ pplb load-balance ];
        ecmp-fast-reroute;
    }
}
```

## evo/routing-options/forwarding-table-pplb.conf

```
/*
 * Topic: Forwarding-table per-packet load balancing
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l wanedge4_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 1
 *   wanedge4_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Exports the load-balance policy to the forwarding table so all equal-cost next hops are installed.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce1_acx7100-48l):
 *   $PPLB_NAME  e.g. load-balance
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
    }
}
```

## evo/routing-options/graceful-restart.conf

```
/*
 * Topic: Graceful restart
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
 *   $ROUTER_ID  e.g. 1.1.1.8
 */
routing-options {
    router-id $ROUTER_ID;
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
 *   ce1_acx7100-48l 1501
 *   total 1501
 * Highlights:
 *   - Bridges one VLAN across the listed units.
 * Pair with: none
 * Variables (example values from ce1_acx7100-48l):
 *   $VLAN_NAME  e.g. VLAN10
 *   $VLAN       e.g. 10
 *   $AC_IFL_A   e.g. ae1.10
 *   $AC_IFL_B   e.g. et-0/0/44.10
 */
vlans {
    $VLAN_NAME {
        vlan-id $VLAN;
        interface $AC_IFL_A;
        interface $AC_IFL_B;
    }
}
```

## evo/vlans/vlan-3-interfaces.conf

```
/*
 * Topic: VLAN with three units
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - Bridges one VLAN across the listed units.
 * Pair with: none
 * Variables (example values from ce1_acx7100-48l):
 *   $VLAN_NAME  e.g. VLAN3484
 *   $VLAN       e.g. 3484
 *   $AC_IFL_A   e.g. et-0/0/45.3484
 *   $AC_IFL_B   e.g. et-0/0/46.3484
 *   $AC_IFL_C   e.g. et-0/0/44.3484
 */
vlans {
    $VLAN_NAME {
        vlan-id $VLAN;
        interface $AC_IFL_A;
        interface $AC_IFL_B;
        interface $AC_IFL_C;
    }
}
```

## evo/vlans/vlan-4-interfaces.conf

```
/*
 * Topic: VLAN with four units
 * Seen on:
 *   Junos: (none)
 *   EVO: ce1_acx7100-48l
 * Count:
 *   ce1_acx7100-48l 511
 *   total 511
 * Highlights:
 *   - Bridges one VLAN across the listed units.
 * Pair with: none
 * Variables (example values from ce1_acx7100-48l):
 *   $VLAN_NAME  e.g. VLAN3001
 *   $VLAN       e.g. 3001
 *   $AC_IFL_A   e.g. et-0/0/45.3001
 *   $AC_IFL_B   e.g. et-0/0/46.3001
 *   $AC_IFL_C   e.g. et-0/0/43.3001
 *   $AC_IFL_D   e.g. et-0/0/44.3001
 */
vlans {
    $VLAN_NAME {
        vlan-id $VLAN;
        interface $AC_IFL_A;
        interface $AC_IFL_B;
        interface $AC_IFL_C;
        interface $AC_IFL_D;
    }
}
```

## junos/bridge-domains/bridge-domain-2-interfaces.conf

```
/*
 * Topic: Bridge domain with two units
 * Seen on:
 *   Junos: ce2_mx480
 *   EVO: (none)
 * Count:
 *   ce2_mx480 94
 *   total 94
 * Pair with:
 *  - junos/interfaces/ifl-vlan-bridge.conf
 *
 * Peers with: n/a
 * Variables (example values from ce2_mx480):
 *   $BD_NAME   e.g. BD4001
 *   $AC_IFL_A  e.g. et-2/0/2.4001
 *   $AC_IFL_B  e.g. xe-2/0/0:1.4001
 */
bridge-domains {
    $BD_NAME {
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
 *   Junos: ce2_mx480
 *   EVO: (none)
 * Count:
 *   ce2_mx480 3488
 *   total 3488
 * Highlights:
 *   - Bridges one VLAN across the listed units.
 * Pair with:
 *  - junos/interfaces/ifl-vlan-bridge.conf
 *
 * Peers with: n/a
 * Variables (example values from ce2_mx480):
 *   $BD_NAME   e.g. BD10
 *   $VLAN      e.g. 10
 *   $AC_IFL_A  e.g. ae1.10
 *   $AC_IFL_B  e.g. xe-2/0/0:1.10
 */
bridge-domains {
    $BD_NAME {
        vlan-id $VLAN;
        interface $AC_IFL_A;
        interface $AC_IFL_B;
    }
}
```

## junos/bridge-domains/bridge-domain-vlan-5-interfaces.conf

```
/*
 * Topic: VLAN bridge domain with five units
 * Seen on:
 *   Junos: ce2_mx480
 *   EVO: (none)
 * Count:
 *   ce2_mx480 512
 *   total 512
 * Highlights:
 *   - Bridges one VLAN across the listed units.
 * Pair with:
 *  - junos/interfaces/ifl-vlan-bridge.conf
 *
 * Peers with: n/a
 * Variables (example values from ce2_mx480):
 *   $BD_NAME   e.g. BD3001
 *   $VLAN      e.g. 3001
 *   $AC_IFL_A  e.g. et-2/1/4:0.3001
 *   $AC_IFL_B  e.g. xe-2/0/0:0.3001
 *   $AC_IFL_C  e.g. et-2/0/2.3001
 *   $AC_IFL_D  e.g. ae1.3001
 *   $AC_IFL_E  e.g. xe-2/0/0:1.3001
 */
bridge-domains {
    $BD_NAME {
        vlan-id $VLAN;
        interface $AC_IFL_A;
        interface $AC_IFL_B;
        interface $AC_IFL_C;
        interface $AC_IFL_D;
        interface $AC_IFL_E;
    }
}
```

## junos/bridge-domains/bridge-domain-vlan.conf

```
/*
 * Topic: VLAN bridge domain without units
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $BD_NAME  e.g. BD4051
 *   $VLAN     e.g. 4051
 */
bridge-domains {
    $BD_NAME {
        vlan-id $VLAN;
    }
}
```

## junos/chassis/aggregated-devices-ethernet.conf

```
/*
 * Topic: Aggregated Ethernet device count
 * Seen on:
 *   Junos: ce2_mx480 wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   ce2_mx480 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10008 1
 *   total 3
 * Highlights:
 *   - Pre-allocates the aggregated Ethernet interfaces the chassis may create.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce2_mx480):
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

## junos/chassis/fpc-mx10008-1g-10g-ports.conf

```
/*
 * Topic: MX10008 line card port speeds for 1G and 10G ports, powered on
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Highlights:
 *   - PIC 0 port 10 runs at 1G and PIC 1 ports 10-13 at 10G.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
chassis {
    fpc 3 {
        pic 0 {
            port 2 {
                number-of-sub-ports 1;
            }
            port 10 {
                speed 1G;
            }
        }
        pic 1 {
            port 10 {
                speed 10g;
            }
            port 11 {
                speed 10g;
            }
            port 12 {
                speed 10g;
            }
            port 13 {
                speed 10g;
            }
        }
        power on;
    }
}
```

## junos/chassis/fpc-mx10008-2x400g-4x10g.conf

```
/*
 * Topic: MX10008 line card with two 400G ports and a 4x10G breakout
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
chassis {
    fpc 4 {
        pic 0 {
            port 0 {
                speed 400g;
            }
            port 1 {
                speed 100g;
            }
            port 2 {
                number-of-sub-ports 4;
                speed 10g;
            }
        }
    }
}
```

## junos/chassis/fpc-mx10008-pic5-pic-mode-100g.conf

```
/*
 * Topic: MX10008 line card with PIC 5 in 100G mode, powered on
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Highlights:
 *   - `pic-mode 100G` sets every port of the PIC to 100G.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
chassis {
    fpc 0 {
        pic 5 {
            pic-mode 100G;
        }
        power on;
    }
}
```

## junos/chassis/fpc-mx304-4x100g-2x4x10g.conf

```
/*
 * Topic: MX304 line card port speeds with four 100G ports and two 4x10G breakouts
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - Ports 13 and 15 are channelized into four 10G sub-ports each.
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
            port 2 {
                speed 100g;
            }
            port 4 {
                speed 100g;
            }
            port 6 {
                speed 100g;
            }
            port 13 {
                number-of-sub-ports 4;
                speed 10g;
            }
            port 15 {
                number-of-sub-ports 4;
                speed 10g;
            }
        }
    }
}
```

## junos/chassis/fpc-mx480-4x10g-3x100g-4x100g.conf

```
/*
 * Topic: MX480 line card port speeds with 10G and 100G breakouts
 * Seen on:
 *   Junos: ce2_mx480
 *   EVO: (none)
 * Count:
 *   ce2_mx480 1
 *   total 1
 * Highlights:
 *   - Port 0 of PIC 0 is channelized into four 10G sub-ports and port 4 of PIC 1 into four 100G sub-ports.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
chassis {
    fpc 2 {
        pic 0 {
            port 0 {
                number-of-sub-ports 4;
                speed 10g;
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
        pic 1 {
            port 4 {
                number-of-sub-ports 4;
                speed 100g;
            }
        }
    }
}
```

## junos/chassis/fpc-power-off.conf

```
/*
 * Topic: Powered-off line card slot
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 2
 *   total 2
 * Highlights:
 *   - Keeps the line card in the slot powered down.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge2_mx10008):
 *   $FPC_SLOT  e.g. 1
 */
chassis {
    fpc $FPC_SLOT {
        power off;
    }
}
```

## junos/chassis/network-services-enhanced-ip.conf

```
/*
 * Topic: Enhanced-IP network services mode
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10008 1
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

## junos/class-of-service/classifiers/cl-dscp-ieee8021p-8class.conf

```
/*
 * Topic: DSCP and IEEE 802.1p classifiers for an eight-class model
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - Maps DSCP and 802.1p code points into eight forwarding classes, with medium-low loss priority for the second class of each pair.
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-8queue-model.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    classifiers {
        dscp mydscp {
            forwarding-class af {
                loss-priority low code-points 000101;
            }
            forwarding-class af1 {
                loss-priority medium-low code-points 001101;
            }
            forwarding-class be {
                loss-priority low code-points 000001;
            }
            forwarding-class be1 {
                loss-priority medium-low code-points 001001;
            }
            forwarding-class ef {
                loss-priority low code-points 000011;
            }
            forwarding-class ef1 {
                loss-priority medium-low code-points 001011;
            }
            forwarding-class nc {
                loss-priority low code-points 000111;
            }
            forwarding-class nc1 {
                loss-priority medium-low code-points 001111;
            }
        }
        ieee-802.1 dot1p {
            forwarding-class af {
                loss-priority low code-points 010;
            }
            forwarding-class af1 {
                loss-priority low code-points 110;
            }
            forwarding-class be {
                loss-priority low code-points 000;
            }
            forwarding-class be1 {
                loss-priority low code-points 100;
            }
            forwarding-class ef {
                loss-priority high code-points 001;
            }
            forwarding-class ef1 {
                loss-priority high code-points 101;
            }
            forwarding-class nc {
                loss-priority high code-points 011;
            }
            forwarding-class nc1 {
                loss-priority high code-points 111;
            }
        }
    }
}
```

## junos/class-of-service/forwarding-classes/fc-8queue-model.conf

```
/*
 * Topic: Eight forwarding classes mapped to eight queues
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    forwarding-classes {
        class af queue-num 2;
        class af1 queue-num 6;
        class be queue-num 0;
        class be1 queue-num 4;
        class ef queue-num 1;
        class ef1 queue-num 5;
        class nc queue-num 3;
        class nc1 queue-num 7;
    }
}
```

## junos/class-of-service/interfaces/ifl-ieee8021p-classifier.conf

```
/*
 * Topic: Unit with the IEEE 802.1p classifier
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Pair with:
 *  - junos/class-of-service/classifiers/cl-dscp-ieee8021p-8class.conf
 *
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $COS_INTF  e.g. xe-0/0/15:0
 *   $UNIT      e.g. 5501
 */
class-of-service {
    interfaces {
        $COS_INTF {
            unit $UNIT {
                classifiers {
                    ieee-802.1 dot1p;
                }
            }
        }
    }
}
```

## junos/class-of-service/rewrite-rules/rr-exp-8class.conf

```
/*
 * Topic: MPLS EXP rewrite rule for an eight-class model
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Pair with:
 *  - junos/class-of-service/forwarding-classes/fc-8queue-model.conf
 *
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    rewrite-rules {
        exp myexp_rw {
            forwarding-class af {
                loss-priority low code-point 101;
            }
            forwarding-class af1 {
                loss-priority low code-point 001;
            }
            forwarding-class be {
                loss-priority low code-point 111;
            }
            forwarding-class be1 {
                loss-priority low code-point 011;
            }
            forwarding-class ef {
                loss-priority high code-point 110;
            }
            forwarding-class ef1 {
                loss-priority high code-point 010;
            }
            forwarding-class nc {
                loss-priority high code-point 100;
            }
            forwarding-class nc1 {
                loss-priority high code-point 000;
            }
        }
    }
}
```

## junos/class-of-service/schedulers/sch-abc-ecn.conf

```
/*
 * Topic: Scheduler abc with explicit congestion notification
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
class-of-service {
    schedulers {
        abc {
            explicit-congestion-notification;
        }
    }
}
```

## junos/firewall/filter-vrrp-discard.conf

```
/*
 * Topic: Firewall filter vrrp discarding VRRP and AH packets sent to 224.0.0.18
 * Seen on:
 *   Junos: ce2_mx480
 *   EVO: (none)
 * Count:
 *   ce2_mx480 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
firewall {
    filter vrrp {
        term vrrp {
            from {
                destination-address {
                    224.0.0.18/32;
                }
                protocol [ vrrp ah ];
            }
            then {
                discard;
            }
        }
    }
}
```

## junos/forwarding-options/enhanced-hash-key-mpls-no-payload.conf

```
/*
 * Topic: Enhanced hash key for MPLS without payload hashing
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - MPLS load balancing hashes on labels only; `no-payload` keeps the inner packet out of the hash.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    enhanced-hash-key {
        family mpls {
            no-payload;
        }
    }
}
```

## junos/forwarding-options/hash-key-inet-layer-3-4.conf

```
/*
 * Topic: Hash key on IPv4 layer 3 and layer 4 fields
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
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
    }
}
```

## junos/forwarding-options/hash-key-mpls-three-labels-multiservice.conf

```
/*
 * Topic: Hash key on the top three MPLS labels and Ethernet MACs
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    hash-key {
        family mpls {
            label-1;
            label-2;
            label-3;
        }
        family multiservice {
            source-mac;
            destination-mac;
        }
    }
}
```

## junos/forwarding-options/load-balance-label-capability.conf

```
/*
 * Topic: Load-balance label capability
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - Signals that the router can insert and process load-balance (entropy) labels.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    load-balance-label-capability;
}
```

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
 *   $DESCRIPTION  e.g. "Link1 from WAN Edge1 to P1 Node"
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

## junos/interfaces/ifd-ae-disable-flexible-lacp-fast-system-id.conf

```
/*
 * Topic: Disabled flexible-services aggregated Ethernet bundle with fast LACP and a fixed system ID
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Highlights:
 *   - The bundle is administratively disabled while its units stay configured.
 * Pair with: none
 * Variables (example values from wanedge2_mx10008):
 *   $IFD          e.g. ae1
 *   $LACP_SYS_ID  e.g. 00:00:22:00:00:01
 */
interfaces {
    $IFD {
        disable;
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

## junos/interfaces/ifd-ae-flexible-lacp-fast-system-id.conf

```
/*
 * Topic: Flexible-services aggregated Ethernet bundle with fast LACP and a fixed system ID
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - Flexible tagging and `flexible-ethernet-services` let the bundle carry bridged and cross-connect units.
 *   - An explicit LACP `system-id` presents a stable partner identity to the attached device.
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $IFD          e.g. ae1
 *   $LACP_SYS_ID  e.g. 00:00:22:00:00:01
 */
interfaces {
    $IFD {
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

## junos/interfaces/ifd-ae-flexible-lacp-fast.conf

```
/*
 * Topic: Flexible-services aggregated Ethernet bundle with active fast LACP
 * Seen on:
 *   Junos: ce2_mx480
 *   EVO: (none)
 * Count:
 *   ce2_mx480 1
 *   total 1
 * Pair with: none
 * Variables (example values from ce2_mx480):
 *   $IFD  e.g. ae1
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

## junos/interfaces/ifd-description.conf

```
/*
 * Topic: Interface description
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10008 2
 *   total 3
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $IFD          e.g. et-0/0/6
 *   $DESCRIPTION  e.g. "Link from WANEdge1 to WANEdge2"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
    }
}
```

## junos/interfaces/ifd-disable.conf

```
/*
 * Topic: Administratively disabled port
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 3
 *   total 3
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $IFD  e.g. et-0/0/10
 */
interfaces {
    $IFD {
        disable;
    }
}
```

## junos/interfaces/ifd-flexible-ethernet-services-description-speed-10g.conf

```
/*
 * Topic: Described 10G port with flexible VLAN tagging and flexible Ethernet services
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Highlights:
 *   - Flexible tagging and `flexible-ethernet-services` let one port carry bridged, cross-connect and routed units side by side; the speed is fixed at 10G.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge2_mx10008):
 *   $IFD          e.g. xe-3/1/13
 *   $DESCRIPTION  e.g. "WANEdge1 to TG_5/15"
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

## junos/interfaces/ifd-flexible-ethernet-services-description.conf

```
/*
 * Topic: Described port with flexible VLAN tagging and flexible Ethernet services
 * Seen on:
 *   Junos: ce2_mx480 wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   ce2_mx480 4
 *   wanedge1_mx304 2
 *   wanedge2_mx10008 1
 *   total 7
 * Highlights:
 *   - Flexible tagging and `flexible-ethernet-services` let one port carry bridged, cross-connect and routed units side by side.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce2_mx480):
 *   $IFD          e.g. et-2/0/2
 *   $DESCRIPTION  e.g. "CE2 to PE3"
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
    }
}
```

## junos/interfaces/ifd-flexible-ethernet-services-speed-10g.conf

```
/*
 * Topic: 10G port with flexible VLAN tagging and flexible Ethernet services
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge2_mx10008):
 *   $IFD  e.g. xe-3/1/12
 */
interfaces {
    $IFD {
        flexible-vlan-tagging;
        speed 10g;
        encapsulation flexible-ethernet-services;
    }
}
```

## junos/interfaces/ifd-flexible-ethernet-services.conf

```
/*
 * Topic: Port with flexible VLAN tagging and flexible Ethernet services
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - Flexible tagging and `flexible-ethernet-services` let one port carry bridged, cross-connect and routed units side by side.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $IFD  e.g. xe-0/0/15:1
 */
interfaces {
    $IFD {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
    }
}
```

## junos/interfaces/ifd-lag-member-gigether-10g.conf

```
/*
 * Topic: 10G aggregated Ethernet member link through gigether-options
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge2_mx10008):
 *   $IFD        e.g. xe-3/1/11
 *   $AE_BUNDLE  e.g. ae1
 */
interfaces {
    $IFD {
        speed 10g;
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
 *   Junos: ce2_mx480 wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   ce2_mx480 2
 *   wanedge1_mx304 4
 *   total 6
 * Highlights:
 *   - `gigether-options 802.3ad` assigns the port to its bundle; Layer 2 and Layer 3 settings live on the `ae` interface.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce2_mx480):
 *   $IFD        e.g. et-2/0/1
 *   $AE_BUNDLE  e.g. ae1
 */
interfaces {
    $IFD {
        gigether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## junos/interfaces/ifd-speed-10g.conf

```
/*
 * Topic: 10G port speed
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 34
 *   total 34
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge2_mx10008):
 *   $IFD  e.g. xe-3/0/11
 */
interfaces {
    $IFD {
        speed 10g;
    }
}
```

## junos/interfaces/ifd-speed-1g.conf

```
/*
 * Topic: 1G port speed
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge2_mx10008):
 *   $IFD  e.g. xe-3/0/10
 */
interfaces {
    $IFD {
        speed 1g;
    }
}
```

## junos/interfaces/ifl-core-inet-mpls.conf

```
/*
 * Topic: Core-facing point-to-point link with IPv4 and MPLS families
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 2
 *   wanedge2_mx10008 2
 *   total 4
 * Highlights:
 *   - Untagged core link: `family inet` for OSPF and `family mpls` for LDP-signalled transport.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $CORE_PHYS     e.g. ae2
 *   $CORE_V4_ADDR  e.g. 10.10.12.1/24
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

## junos/interfaces/ifl-loopback-inet-primary-iso-inet6-primary.conf

```
/*
 * Topic: Primary IPv4 and IPv6 loopback addresses with an ISO address
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge2_mx10008):
 *   $LOOPBACK_V4_PFX  e.g. 192.168.0.15/32
 *   $ISO_NET          e.g. 47.0005.80ff.f800.0000.0108.0001.0102.5502.0061.00
 *   $LOOPBACK_V6_PFX  e.g. abcd::10:255:20:61/128
 */
interfaces {
    lo0 {
        unit 0 {
            family inet {
                address $LOOPBACK_V4_PFX {
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

## junos/interfaces/ifl-loopback-inet-primary.conf

```
/*
 * Topic: Primary IPv4 loopback address
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - `primary` makes this address the router's default source address.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $LOOPBACK_V4_PFX  e.g. 10.10.0.12/32
 */
interfaces {
    lo0 {
        unit 0 {
            family inet {
                address $LOOPBACK_V4_PFX {
                    primary;
                }
            }
        }
    }
}
```

## junos/interfaces/ifl-loopback-inet-two-addresses.conf

```
/*
 * Topic: Loopback unit with two IPv4 addresses
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge2_mx10008):
 *   $UNIT                 e.g. 1
 *   $LOOPBACK_V4_PFX      e.g. 10.55.55.55/32
 *   $LOOPBACK_ALT_V4_PFX  e.g. 10.22.22.1/32
 */
interfaces {
    lo0 {
        unit $UNIT {
            family inet {
                address $LOOPBACK_V4_PFX;
                address $LOOPBACK_ALT_V4_PFX;
            }
        }
    }
}
```

## junos/interfaces/ifl-loopback-inet.conf

```
/*
 * Topic: Loopback unit with one IPv4 address
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 100
 *   wanedge2_mx10008 100
 *   total 200
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $UNIT             e.g. 1
 *   $LOOPBACK_V4_PFX  e.g. 10.11.11.1/32
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

## junos/interfaces/ifl-vlan-bridge.conf

```
/*
 * Topic: VLAN-tagged bridge unit
 * Seen on:
 *   Junos: ce2_mx480 wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   ce2_mx480 9724
 *   wanedge1_mx304 1001
 *   total 10725
 * Highlights:
 *   - `encapsulation vlan-bridge` places the unit in a bridge domain or VLAN.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce2_mx480):
 *   $IFD   e.g. ae1
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

## junos/interfaces/ifl-vlan-ccc-family-ccc.conf

```
/*
 * Topic: VLAN-tagged circuit cross-connect unit with family ccc
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 2500
 *   wanedge2_mx10008 500
 *   total 3000
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $IFD   e.g. ae1
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

## junos/interfaces/ifl-vlan-ccc.conf

```
/*
 * Topic: VLAN-tagged circuit cross-connect unit
 * Seen on:
 *   Junos: ce2_mx480 wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   ce2_mx480 2000
 *   wanedge1_mx304 1500
 *   wanedge2_mx10008 1500
 *   total 5000
 * Highlights:
 *   - `encapsulation vlan-ccc` hands the VLAN to a Layer 2 circuit or local switch.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce2_mx480):
 *   $IFD   e.g. et-2/1/4:0
 *   $UNIT  e.g. 1
 *   $VLAN  e.g. 1
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

## junos/interfaces/ifl-vlan-inet-mpls.conf

```
/*
 * Topic: VLAN-tagged IPv4 unit with MPLS
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $IFD         e.g. xe-0/0/15:3
 *   $UNIT        e.g. 900
 *   $VLAN        e.g. 900
 *   $AC_ADDR_V4  e.g. 220.220.1.2/24
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

## junos/interfaces/ifl-vlan-inet-vrrp-accept-data.conf

```
/*
 * Topic: VLAN-tagged IPv4 unit with a VRRP group that accepts data
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 512
 *   wanedge2_mx10008 512
 *   total 1024
 * Highlights:
 *   - VRRP group 1 shares the virtual gateway address between two WAN edges; the priority selects the master.
 *   - `accept-data` lets the master accept traffic addressed to the virtual address.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $IFD            e.g. xe-0/0/15:1
 *   $UNIT           e.g. 3001
 *   $VLAN           e.g. 3001
 *   $AC_ADDR_V4     e.g. 10.45.0.1/24
 *   $VRRP_VIP       e.g. 10.45.0.4
 *   $VRRP_PRIORITY  e.g. 250
 */
interfaces {
    $IFD {
        unit $UNIT {
            vlan-id $VLAN;
            family inet {
                address $AC_ADDR_V4 {
                    vrrp-group 1 {
                        virtual-address $VRRP_VIP;
                        priority $VRRP_PRIORITY;
                        accept-data;
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
 * Topic: VLAN-tagged IPv4 unit
 * Seen on:
 *   Junos: ce2_mx480 wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   ce2_mx480 2000
 *   wanedge1_mx304 1718
 *   wanedge2_mx10008 1613
 *   total 5331
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce2_mx480):
 *   $IFD         e.g. et-2/0/2
 *   $UNIT        e.g. 1001
 *   $VLAN        e.g. 1001
 *   $AC_ADDR_V4  e.g. 65.65.0.1/24
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

## junos/policy-options/community/cm-instance-target.conf

```
/*
 * Topic: Route-target community named after its hub-and-spoke instance
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 2002
 *   wanedge2_mx10008 2002
 *   total 4004
 * Highlights:
 *   - Hub and spoke communities carry different route-target values, so routes exported with one are imported only through the matching policy on the other side.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME  e.g. hub_1
 *   $RT_AS          e.g. 65535
 *   $RT_ID          e.g. 1
 */
policy-options {
    community $INSTANCE_NAME members target:$RT_AS:$RT_ID;
}
```

## junos/policy-options/policy-statement/per-packet-load-balance-accept.conf

```
/*
 * Topic: Per-packet load-balancing policy with an explicit accept
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10008 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
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

## junos/policy-options/policy-statement/per-packet-load-balance.conf

```
/*
 * Topic: Per-packet load-balancing policy
 * Seen on:
 *   Junos: ce2_mx480 wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   ce2_mx480 1
 *   wanedge1_mx304 1
 *   wanedge2_mx10008 1
 *   total 3
 * Highlights:
 *   - Exported to the forwarding table so every equal-cost next hop is installed.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce2_mx480):
 *   $PPLB_NAME  e.g. load-balance
 */
policy-options {
    policy-statement $PPLB_NAME {
        term 1 {
            then {
                load-balance per-packet;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-bgp-to-ospf.conf

```
/*
 * Topic: Policy bgp-to-ospf accepting BGP routes
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10008 1
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

## junos/policy-options/policy-statement/ps-default-route.conf

```
/*
 * Topic: Policy accepting the static default route and rejecting the rest
 * Seen on:
 *   Junos: ce2_mx480
 *   EVO: (none)
 * Count:
 *   ce2_mx480 1
 *   total 1
 * Highlights:
 *   - Advertises only `0.0.0.0/0` learned from a static route.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement default {
        term 1 {
            from {
                protocol static;
                route-filter 0.0.0.0/0 exact;
            }
            then accept;
        }
        term 2 {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-el.conf

```
/*
 * Topic: Policy EL accepting routes that match prefix-list el-pe3, with a no-insert-el term
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement EL {
        term no-insert-el {
            from {
                prefix-list el-pe3;
            }
            then accept;
        }
        from {
            prefix-list el-pe3;
        }
        then accept;
    }
}
```

## junos/policy-options/policy-statement/ps-export-connected.conf

```
/*
 * Topic: Policy EXPORT_CONNECTED accepting BGP routes
 * Seen on:
 *   Junos: ce2_mx480
 *   EVO: (none)
 * Count:
 *   ce2_mx480 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement EXPORT_CONNECTED {
        from protocol bgp;
        then accept;
    }
}
```

## junos/policy-options/policy-statement/ps-hub-spoke-export-bgp-direct.conf

```
/*
 * Topic: Hub-and-spoke VRF export policy tagging BGP and direct routes
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1001
 *   wanedge2_mx10008 1000
 *   total 2001
 * Highlights:
 *   - Adds the instance community to BGP-learned and connected routes and rejects everything else.
 * Pair with:
 *  - junos/policy-options/community/cm-instance-target.conf
 *
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME  e.g. spoke_1
 */
policy-options {
    policy-statement $INSTANCE_NAME {
        term a {
            from protocol [ bgp direct ];
            then {
                community add $INSTANCE_NAME;
                accept;
            }
        }
        term b {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-hub-spoke-export-direct-bgp.conf

```
/*
 * Topic: Hub-and-spoke VRF export policy tagging direct and BGP routes
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Highlights:
 *   - Adds the instance community to connected and BGP-learned routes and rejects everything else.
 * Pair with:
 *  - junos/policy-options/community/cm-instance-target.conf
 *
 * Peers with: n/a
 * Variables (example values from wanedge2_mx10008):
 *   $INSTANCE_NAME  e.g. spoke_244
 */
policy-options {
    policy-statement $INSTANCE_NAME {
        term a {
            from protocol [ direct bgp ];
            then {
                community add $INSTANCE_NAME;
                accept;
            }
        }
        term b {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-hub-spoke-import.conf

```
/*
 * Topic: Hub-and-spoke VRF import policy matching the instance community
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1001
 *   wanedge2_mx10008 1001
 *   total 2002
 * Highlights:
 *   - Accepts BGP routes tagged with the instance community and rejects everything else.
 * Pair with:
 *  - junos/policy-options/community/cm-instance-target.conf
 *
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME  e.g. hub_1
 */
policy-options {
    policy-statement $INSTANCE_NAME {
        term a {
            from {
                protocol bgp;
                community $INSTANCE_NAME;
            }
            then accept;
        }
        term b {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-pplb-accept.conf

```
/*
 * Topic: Accept-all policy named pplb
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement pplb {
        then accept;
    }
}
```

## junos/policy-options/policy-statement/ps-send-ospf.conf

```
/*
 * Topic: Policy accepting OSPF routes
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10008 1
 *   total 2
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

## junos/policy-options/policy-statement/ps-send-static.conf

```
/*
 * Topic: Policy send-static accepting static routes
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement send-static {
        term 1 {
            from protocol static;
            then accept;
        }
    }
}
```

## junos/policy-options/prefix-list/pl-el-pe3.conf

```
/*
 * Topic: Prefix-list el-pe3 with one host route
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    prefix-list el-pe3 {
        192.168.0.14/32;
    }
}
```

## junos/protocols/bgp-advertise-peer-as-local-as-graceful-restart.conf

```
/*
 * Topic: BGP advertise-peer-as with a local AS and graceful restart
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $ASN  e.g. 64512
 */
protocols {
    bgp {
        advertise-peer-as;
        local-as $ASN;
        graceful-restart;
    }
}
```

## junos/protocols/bgp-advertise-peer-as.conf

```
/*
 * Topic: BGP advertise-peer-as
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Highlights:
 *   - Lets the router re-advertise routes back toward peers in the AS they were learned from.
 * Pair with: none
 * Variables: none
 */
protocols {
    bgp {
        advertise-peer-as;
    }
}
```

## junos/protocols/bgp-group-ebgp-export-connected.conf

```
/*
 * Topic: External BGP group exporting through the EXPORT_CONNECTED policy
 * Seen on:
 *   Junos: ce2_mx480
 *   EVO: (none)
 * Count:
 *   ce2_mx480 1000
 *   total 1000
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-export-connected.conf
 *
 * Variables (example values from ce2_mx480):
 *   $BGP_GROUP     e.g. hub_and_spoke_prefixes_out_2001
 *   $ASN_PROVIDER  e.g. 64512
 *   $PE_PEER_V4    e.g. 70.70.0.2
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type external;
            export EXPORT_CONNECTED;
            peer-as $ASN_PROVIDER;
            neighbor $PE_PEER_V4;
        }
    }
}
```

## junos/protocols/bgp-group-ebgp-export-default.conf

```
/*
 * Topic: External BGP group exporting through the default policy
 * Seen on:
 *   Junos: ce2_mx480
 *   EVO: (none)
 * Count:
 *   ce2_mx480 1000
 *   total 1000
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-default-route.conf
 *
 * Variables (example values from ce2_mx480):
 *   $BGP_GROUP     e.g. Spoke_prefixes_in_1001
 *   $ASN_PROVIDER  e.g. 64512
 *   $PE_PEER_V4    e.g. 65.65.0.2
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type external;
            export default;
            peer-as $ASN_PROVIDER;
            neighbor $PE_PEER_V4;
        }
    }
}
```

## junos/protocols/bgp-overlay-pe-labeled-unicast.conf

```
/*
 * Topic: WAN-edge iBGP overlay with labeled unicast, L3VPN, VPLS and route-target families
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Variant group: ewan-core-edge-bgp-overlay
 *   Provides: inet-vpn, l2vpn, labeled-unicast
 * Highlights:
 *   - iBGP to two route reflectors carries `inet-vpn` (L3VPN) and `l2vpn signaling` (BGP-VPLS); `family route-target` limits the VPN routes each reflector sends.
 *   - BFD at 10 ms x 3 detects a failed reflector session quickly.
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-bgp-to-ospf.conf
 *
 * Variables (example values from wanedge1_mx304):
 *   $LOOPBACK_V4  e.g. 10.10.0.12
 *   $RR1_V4       e.g. 192.168.0.17
 *   $RR2_V4       e.g. 192.168.0.11
 */
protocols {
    bgp {
        group ibgp {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast;
            }
            family inet-vpn {
                any;
            }
            family l2vpn {
                signaling;
            }
            family route-target;
            export bgp-to-ospf;
            bfd-liveness-detection {
                minimum-interval 10;
                multiplier 3;
            }
            neighbor $RR1_V4;
            neighbor $RR2_V4;
        }
    }
}
```

## junos/protocols/bgp-overlay-pe.conf

```
/*
 * Topic: WAN-edge iBGP overlay with L3VPN, VPLS and route-target families
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Variant group: ewan-core-edge-bgp-overlay
 *   Provides: inet-vpn, l2vpn
 * Highlights:
 *   - iBGP to two route reflectors carries `inet-vpn` (L3VPN) and `l2vpn signaling` (BGP-VPLS); `family route-target` limits the VPN routes each reflector sends.
 *   - BFD at 10 ms x 3 detects a failed reflector session quickly.
 * Pair with: none
 * Variables (example values from wanedge2_mx10008):
 *   $LOOPBACK_V4  e.g. 192.168.0.15
 *   $RR1_V4       e.g. 192.168.0.17
 *   $RR2_V4       e.g. 192.168.0.11
 */
protocols {
    bgp {
        group ibgp {
            type internal;
            local-address $LOOPBACK_V4;
            family inet-vpn {
                any;
            }
            family l2vpn {
                signaling;
            }
            family route-target;
            bfd-liveness-detection {
                minimum-interval 10;
                multiplier 3;
            }
            neighbor $RR1_V4;
            neighbor $RR2_V4;
        }
    }
}
```

## junos/protocols/l2-learning-global-mac-limit-statistics.conf

```
/*
 * Topic: Global MAC limit and MAC statistics
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
protocols {
    l2-learning {
        global-mac-limit;
        global-mac-statistics;
    }
}
```

## junos/protocols/l2circuit-hsb-control-word.conf

```
/*
 * Topic: Hot-standby Layer 2 circuit with control word
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 4
 *   total 4
 * Highlights:
 *   - A hot-standby backup pseudowire to a second PE takes over without re-signalling when the primary fails; `revert-time 30` returns traffic to the primary.
 * Pair with:
 *  - junos/interfaces/ifl-vlan-ccc-family-ccc.conf
 *
 * Variables (example values from wanedge1_mx304):
 *   $PRIMARY_LOOPBACK  e.g. 192.168.0.14
 *   $AC_IFL            e.g. ae1.2334
 *   $VC_ID             e.g. 2334
 *   $BACKUP_LOOPBACK   e.g. 192.168.0.16
 */
protocols {
    l2circuit {
        neighbor $PRIMARY_LOOPBACK {
            interface $AC_IFL {
                virtual-circuit-id $VC_ID;
                control-word;
                pseudowire-status-tlv;
                revert-time 30;
                backup-neighbor $BACKUP_LOOPBACK {
                    hot-standby;
                }
            }
        }
    }
}
```

## junos/protocols/l2circuit-hsb-ethernet-vlan-control-word.conf

```
/*
 * Topic: Hot-standby Layer 2 circuit with control word and Ethernet VLAN encapsulation
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 3991
 *   wanedge2_mx10008 500
 *   total 4491
 * Highlights:
 *   - A hot-standby backup pseudowire to a second PE takes over without re-signalling when the primary fails; `revert-time 30` returns traffic to the primary.
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $PRIMARY_LOOPBACK  e.g. 192.168.0.14
 *   $AC_IFL            e.g. ae1.1501
 *   $VC_ID             e.g. 1501
 *   $BACKUP_LOOPBACK   e.g. 192.168.0.16
 */
protocols {
    l2circuit {
        neighbor $PRIMARY_LOOPBACK {
            interface $AC_IFL {
                virtual-circuit-id $VC_ID;
                control-word;
                encapsulation-type ethernet-vlan;
                ignore-encapsulation-mismatch;
                ignore-mtu-mismatch;
                pseudowire-status-tlv;
                revert-time 30;
                backup-neighbor $BACKUP_LOOPBACK {
                    hot-standby;
                }
            }
        }
    }
}
```

## junos/protocols/l2circuit-hsb-ethernet-vlan.conf

```
/*
 * Topic: Hot-standby Layer 2 circuit with Ethernet VLAN encapsulation
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - A hot-standby backup pseudowire to a second PE takes over without re-signalling when the primary fails; `revert-time 30` returns traffic to the primary.
 * Pair with:
 *  - junos/interfaces/ifl-vlan-ccc-family-ccc.conf
 *
 * Variables (example values from wanedge1_mx304):
 *   $PRIMARY_LOOPBACK  e.g. 192.168.0.14
 *   $AC_IFL            e.g. ae1.2246
 *   $VC_ID             e.g. 2246
 *   $BACKUP_LOOPBACK   e.g. 192.168.0.16
 */
protocols {
    l2circuit {
        neighbor $PRIMARY_LOOPBACK {
            interface $AC_IFL {
                virtual-circuit-id $VC_ID;
                encapsulation-type ethernet-vlan;
                ignore-encapsulation-mismatch;
                ignore-mtu-mismatch;
                pseudowire-status-tlv;
                revert-time 30;
                backup-neighbor $BACKUP_LOOPBACK {
                    hot-standby;
                }
            }
        }
    }
}
```

## junos/protocols/l2circuit-hsb-ignore-mismatch.conf

```
/*
 * Topic: Hot-standby Layer 2 circuit ignoring encapsulation and MTU mismatches
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - A hot-standby backup pseudowire to a second PE takes over without re-signalling when the primary fails; `revert-time 30` returns traffic to the primary.
 * Pair with:
 *  - junos/interfaces/ifl-vlan-ccc-family-ccc.conf
 *
 * Variables (example values from wanedge1_mx304):
 *   $PRIMARY_LOOPBACK  e.g. 192.168.0.14
 *   $AC_IFL            e.g. ae1.2394
 *   $VC_ID             e.g. 2394
 *   $BACKUP_LOOPBACK   e.g. 192.168.0.16
 */
protocols {
    l2circuit {
        neighbor $PRIMARY_LOOPBACK {
            interface $AC_IFL {
                virtual-circuit-id $VC_ID;
                ignore-encapsulation-mismatch;
                ignore-mtu-mismatch;
                pseudowire-status-tlv;
                revert-time 30;
                backup-neighbor $BACKUP_LOOPBACK {
                    hot-standby;
                }
            }
        }
    }
}
```

## junos/protocols/l2circuit-hsb-ignore-mtu-mismatch.conf

```
/*
 * Topic: Hot-standby Layer 2 circuit ignoring MTU mismatches
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - A hot-standby backup pseudowire to a second PE takes over without re-signalling when the primary fails; `revert-time 30` returns traffic to the primary.
 * Pair with:
 *  - junos/interfaces/ifl-vlan-ccc-family-ccc.conf
 *
 * Variables (example values from wanedge1_mx304):
 *   $PRIMARY_LOOPBACK  e.g. 192.168.0.14
 *   $AC_IFL            e.g. ae1.2464
 *   $VC_ID             e.g. 2464
 *   $BACKUP_LOOPBACK   e.g. 192.168.0.16
 */
protocols {
    l2circuit {
        neighbor $PRIMARY_LOOPBACK {
            interface $AC_IFL {
                virtual-circuit-id $VC_ID;
                ignore-mtu-mismatch;
                pseudowire-status-tlv;
                revert-time 30;
                backup-neighbor $BACKUP_LOOPBACK {
                    hot-standby;
                }
            }
        }
    }
}
```

## junos/protocols/l2circuit-hsb.conf

```
/*
 * Topic: Hot-standby Layer 2 circuit
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 2
 *   total 2
 * Highlights:
 *   - A hot-standby backup pseudowire to a second PE takes over without re-signalling when the primary fails; `revert-time 30` returns traffic to the primary.
 * Pair with:
 *  - junos/interfaces/ifl-vlan-ccc-family-ccc.conf
 *
 * Variables (example values from wanedge1_mx304):
 *   $PRIMARY_LOOPBACK  e.g. 192.168.0.14
 *   $AC_IFL            e.g. ae1.2169
 *   $VC_ID             e.g. 2169
 *   $BACKUP_LOOPBACK   e.g. 192.168.0.16
 */
protocols {
    l2circuit {
        neighbor $PRIMARY_LOOPBACK {
            interface $AC_IFL {
                virtual-circuit-id $VC_ID;
                pseudowire-status-tlv;
                revert-time 30;
                backup-neighbor $BACKUP_LOOPBACK {
                    hot-standby;
                }
            }
        }
    }
}
```

## junos/protocols/l2circuit-local-switching-ethernet-vlan-ignore-mismatch.conf

```
/*
 * Topic: Local-switching cross-connect with ethernet-vlan encapsulation ignoring encapsulation and MTU mismatch
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Pair with: none
 * Variables (example values from wanedge2_mx10008):
 *   $AC_IFL_A  e.g. xe-3/0/2.101
 *   $AC_IFL_B  e.g. xe-3/0/2.102
 */
protocols {
    l2circuit {
        local-switching {
            interface $AC_IFL_A {
                end-interface {
                    interface $AC_IFL_B;
                }
                encapsulation-type ethernet-vlan;
                ignore-encapsulation-mismatch;
                ignore-mtu-mismatch;
            }
        }
    }
}
```

## junos/protocols/l2circuit-local-switching.conf

```
/*
 * Topic: Locally switched Layer 2 circuit between two units
 * Seen on:
 *   Junos: ce2_mx480
 *   EVO: (none)
 * Count:
 *   ce2_mx480 1000
 *   total 1000
 * Highlights:
 *   - Cross-connects two local units without a remote PE.
 * Pair with:
 *  - junos/interfaces/ifl-vlan-ccc.conf
 *
 * Peers with: n/a
 * Variables (example values from ce2_mx480):
 *   $AC_IFL_A  e.g. et-2/1/4:0.1
 *   $AC_IFL_B  e.g. xe-2/0/0:0.1
 */
protocols {
    l2circuit {
        local-switching {
            interface $AC_IFL_A {
                end-interface {
                    interface $AC_IFL_B;
                }
            }
        }
    }
}
```

## junos/protocols/ldp-auto-targeted-3-core-loopback-p2mp.conf

```
/*
 * Topic: LDP with automatic targeted sessions on three core links and the loopback, and point-to-multipoint LSPs
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Highlights:
 *   - `p2mp` enables mLDP point-to-multipoint LSPs for the NG-MVPN provider tunnels.
 * Pair with: none
 * Variables (example values from wanedge2_mx10008):
 *   $CORE_PHYS_1  e.g. et-0/5/0
 *   $CORE_PHYS_2  e.g. et-0/5/1
 *   $CORE_PHYS_3  e.g. ae1
 */
protocols {
    ldp {
        auto-targeted-session {
            teardown-delay 90;
            maximum-sessions 100;
        }
        interface $CORE_PHYS_1.0;
        interface $CORE_PHYS_2.0;
        interface $CORE_PHYS_3.0;
        interface lo0.0;
        p2mp;
    }
}
```

## junos/protocols/ldp-wanedge1.conf

```
/*
 * Topic: LDP with automatic targeted sessions on the core links and loopback and point-to-multipoint LSPs
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - `p2mp` enables mLDP point-to-multipoint LSPs for the NG-MVPN provider tunnels.
 * Pair with: none
 * Variables: none
 */
protocols {
    ldp {
        auto-targeted-session {
            teardown-delay 90;
            maximum-sessions 100;
        }
        interface et-0/0/6.0;
        interface xe-0/0/15:0.0;
        interface xe-0/0/15:3.900;
        interface ae2.0;
        interface lo0.0;
        p2mp;
    }
}
```

## junos/protocols/lldp-interface-all.conf

```
/*
 * Topic: LLDP on all interfaces
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
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
 *   Junos: ce2_mx480
 *   EVO: (none)
 * Count:
 *   ce2_mx480 1
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

## junos/protocols/mpls-wanedge1.conf

```
/*
 * Topic: MPLS on the core links with two entropy-label LSPs
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - Both label-switched paths request `entropy-label` so transit routers can hash on the inserted entropy label.
 * Pair with: none
 * Variables: none
 */
protocols {
    mpls {
        label-switched-path lsp_to_pe3 {
            to 192.168.0.14;
            entropy-label;
        }
        label-switched-path lsp_to_pe4 {
            to 192.168.0.16;
            entropy-label;
        }
        interface ae1.0;
        interface ae2.0;
        interface et-0/0/6.0;
        interface xe-0/0/15:3.900;
    }
}
```

## junos/protocols/mpls-wanedge2.conf

```
/*
 * Topic: MPLS on the core links with one LSP
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
protocols {
    mpls {
        label-switched-path lsp_to_pe4 {
            to 192.168.0.16;
        }
        interface et-0/5/0.0;
        interface et-0/5/1.0;
        interface ae1.0;
    }
}
```

## junos/protocols/ospf-area0-wanedge1.conf

```
/*
 * Topic: OSPF area 0 with one protected core bundle and plain access-unit interfaces
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - Only the core bundle runs `node-link-protection`, BFD and `ldp-synchronization`; every other interface, including the access units, is a plain OSPF interface.
 * Pair with: none
 * Variables: none
 */
protocols {
    ospf {
        area 0.0.0.0 {
            interface lo0.0;
            interface ae2.0 {
                node-link-protection;
                bfd-liveness-detection {
                    minimum-interval 10;
                    multiplier 3;
                    full-neighbors-only;
                }
                ldp-synchronization;
            }
            interface et-0/0/6.0;
            interface xe-0/0/15:3.4001;
            interface xe-0/0/15:3.4002;
            interface xe-0/0/15:3.4003;
            interface xe-0/0/15:3.4004;
            interface xe-0/0/15:3.4005;
            interface xe-0/0/15:3.4006;
            interface xe-0/0/15:3.4007;
            interface xe-0/0/15:3.4008;
            interface xe-0/0/15:3.4009;
            interface xe-0/0/15:3.4010;
            interface xe-0/0/15:3.4011;
            interface xe-0/0/15:3.4012;
            interface xe-0/0/15:3.4013;
            interface xe-0/0/15:3.4014;
            interface xe-0/0/15:3.4015;
            interface xe-0/0/15:3.4016;
            interface xe-0/0/15:3.4017;
            interface xe-0/0/15:3.4018;
            interface xe-0/0/15:3.4019;
            interface xe-0/0/15:3.4020;
            interface xe-0/0/15:3.4021;
            interface xe-0/0/15:3.4022;
            interface xe-0/0/15:3.4023;
            interface xe-0/0/15:3.4024;
            interface xe-0/0/15:3.4025;
            interface xe-0/0/15:3.4026;
            interface xe-0/0/15:3.4027;
            interface xe-0/0/15:3.4028;
            interface xe-0/0/15:3.4029;
            interface xe-0/0/15:3.4030;
            interface xe-0/0/15:3.4031;
            interface xe-0/0/15:3.4032;
            interface xe-0/0/15:3.4033;
            interface xe-0/0/15:3.4034;
            interface xe-0/0/15:3.4035;
            interface xe-0/0/15:3.4036;
            interface xe-0/0/15:3.4037;
            interface xe-0/0/15:3.4038;
            interface xe-0/0/15:3.4039;
            interface xe-0/0/15:3.4040;
            interface xe-0/0/15:3.4041;
            interface xe-0/0/15:3.4042;
            interface xe-0/0/15:3.4043;
            interface xe-0/0/15:3.4044;
            interface xe-0/0/15:3.4045;
            interface xe-0/0/15:3.4046;
            interface xe-0/0/15:3.4047;
            interface xe-0/0/15:3.4048;
            interface xe-0/0/15:3.4049;
            interface xe-0/0/15:3.4050;
            interface xe-0/0/15:3.1001;
            interface xe-0/0/15:3.900;
            interface xe-0/0/15:3.500;
            interface xe-0/0/15:3.501;
            interface xe-0/0/15:3.502;
            interface xe-0/0/15:3.503;
            interface xe-0/0/15:3.504;
            interface xe-0/0/15:3.505;
            interface xe-0/0/15:3.506;
            interface xe-0/0/15:3.507;
            interface xe-0/0/15:3.508;
            interface xe-0/0/15:3.509;
            interface xe-0/0/15:3.510;
            interface xe-0/0/15:3.511;
            interface xe-0/0/15:3.512;
            interface xe-0/0/15:3.513;
            interface xe-0/0/15:3.515;
            interface xe-0/0/15:3.516;
            interface xe-0/0/15:3.517;
            interface xe-0/0/15:3.518;
            interface xe-0/0/15:3.519;
            interface xe-0/0/15:3.520;
            interface xe-0/0/15:3.521;
            interface xe-0/0/15:3.525;
            interface xe-0/0/15:3.522;
            interface xe-0/0/15:3.523;
            interface xe-0/0/15:3.524;
            interface xe-0/0/15:1.4001;
        }
    }
}
```

## junos/protocols/ospf-area0-wanedge2.conf

```
/*
 * Topic: OSPF area 0 with one protected core link and plain access-unit interfaces
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
protocols {
    ospf {
        area 0.0.0.0 {
            interface et-0/5/0.0;
            interface et-0/5/1.0 {
                node-link-protection;
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
            interface xe-3/0/2.101;
            interface xe-3/0/2.102;
            interface xe-3/0/2.103;
            interface xe-3/0/2.104;
            interface xe-3/0/2.105;
            interface xe-3/0/2.106;
            interface xe-3/0/2.107;
            interface xe-3/0/2.108;
            interface xe-3/0/2.109;
            interface xe-3/0/2.110;
            interface xe-3/0/2.120;
        }
    }
}
```

## junos/protocols/ospf-backup-spf-options-traffic-engineering.conf

```
/*
 * Topic: OSPF remote LFA backup options with traffic engineering
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10008 1
 *   total 2
 * Highlights:
 *   - `remote-backup-calculation` with `per-prefix-calculation all` and `node-link-degradation` computes per-prefix remote LFA backups and prefers node protection.
 *   - `traffic-engineering` floods TE information for the LDP and RSVP control planes.
 * Pair with: none
 * Variables: none
 */
protocols {
    ospf {
        backup-spf-options {
            remote-backup-calculation;
            per-prefix-calculation all;
            node-link-degradation;
        }
        traffic-engineering;
    }
}
```

## junos/protocols/pim-interface-sparse.conf

```
/*
 * Topic: PIM sparse-mode interface
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 28
 *   total 28
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $IFD   e.g. ae2
 *   $UNIT  e.g. 0
 */
protocols {
    pim {
        interface $IFD.$UNIT {
            mode sparse;
        }
    }
}
```

## junos/protocols/pim-rp-static-interface.conf

```
/*
 * Topic: Static PIM rendezvous point with one PIM interface in the default mode
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $PIM_RP_V4  e.g. 192.168.0.17
 *   $IFD        e.g. xe-0/0/15:3
 *   $UNIT       e.g. 0
 */
protocols {
    pim {
        rp {
            static {
                address $PIM_RP_V4;
            }
        }
        interface $IFD.$UNIT;
    }
}
```

## junos/protocols/rsvp-interface-all.conf

```
/*
 * Topic: RSVP on all interfaces
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
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

## junos/routing-instances/l3vpn/ri-l3vpn-ebgp-as-override-vrf-policy.conf

```
/*
 * Topic: L3VPN VRF with an eBGP CE session using as-override and explicit import/export policies
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1000
 *   wanedge2_mx10008 1000
 *   total 2000
 * Highlights:
 *   - `as-override` replaces the CE AS in the path, so spoke sites that share one AS accept each other's routes.
 *   - Import and export policies select routes by the hub and spoke communities; `vrf-table-label` gives the VRF one label for IP lookup on egress.
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME    e.g. l3vpn_Spoke_1_1
 *   $BGP_GROUP        e.g. v4spirent
 *   $CE_PEER_V4       e.g. 10.40.0.1
 *   $PE_LOCAL_V4      e.g. 10.40.0.2
 *   $ASN_CUSTOMER     e.g. 64510
 *   $AC_IFL           e.g. xe-0/0/15:0.4001
 *   $LOOPBACK_V4      e.g. 10.10.0.12
 *   $RD_SUB_ASSIGNED  e.g. 4001
 *   $IMPORT_POL       e.g. hub_1
 *   $EXPORT_POL       e.g. spoke_1
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        protocols {
            bgp {
                group $BGP_GROUP {
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
            }
        }
        interface $AC_IFL;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-import $IMPORT_POL;
        vrf-export $EXPORT_POL;
        vrf-table-label;
    }
}
```

## junos/routing-instances/l3vpn/ri-l3vpn-ebgp-router-id-vrf-target.conf

```
/*
 * Topic: L3VPN VRF with an eBGP CE session, a VRF router ID and a route target
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 512
 *   wanedge2_mx10008 512
 *   total 1024
 * Highlights:
 *   - `vrf-table-label` gives the VRF one label for IP lookup on egress.
 * Pair with:
 *  - junos/interfaces/ifl-vlan-inet-vrrp-accept-data.conf
 *  - variant:ewan-core-edge-bgp-overlay families=inet-vpn
 *
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME    e.g. l3vpn_vrrp_3001_3001
 *   $LOOPBACK_V4      e.g. 10.10.0.12
 *   $BGP_GROUP        e.g. CE1
 *   $CE_PEER_V4       e.g. 10.45.0.3
 *   $PE_LOCAL_V4      e.g. 10.45.0.4
 *   $ASN_CUSTOMER     e.g. 64510
 *   $AC_IFL           e.g. xe-0/0/15:1.3001
 *   $RD_SUB_ASSIGNED  e.g. 3001
 *   $RT_AS            e.g. 64510
 *   $RT_ID            e.g. 3001
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        routing-options {
            router-id $LOOPBACK_V4;
        }
        protocols {
            bgp {
                group $BGP_GROUP {
                    type external;
                    family inet {
                        any;
                    }
                    neighbor $CE_PEER_V4 {
                        local-address $PE_LOCAL_V4;
                        peer-as $ASN_CUSTOMER;
                    }
                }
            }
        }
        interface $AC_IFL;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
        vrf-table-label;
    }
}
```

## junos/routing-instances/l3vpn/ri-l3vpn-mvpn-ibgp-rp-static-vpn-mcast-1.conf

```
/*
 * Topic: NG-MVPN VRF vpn-mcast_1 with a VRF iBGP session and a static PIM RP
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - NG-MVPN VRF: `mvpn` signals multicast state over BGP, and `ldp-p2mp` provider tunnels carry it, with one selective tunnel for the configured source and group.
 *   - OSPF inside the VRF advertises the access subnet and VRF loopback toward the site; `bgp-to-ospf` redistributes remote VPN routes.
 * Pair with: none
 * Variables: none
 */
routing-instances {
    vpn-mcast_1 {
        instance-type vrf;
        protocols {
            bgp {
                group mcast_1 {
                    type internal;
                    peer-as 64512;
                    neighbor 10.33.33.1;
                }
            }
            mvpn;
            ospf {
                area 0.0.0.0 {
                    interface lo0.1;
                    interface xe-0/0/15:3.1;
                }
                export bgp-to-ospf;
            }
            pim {
                rp {
                    static {
                        address 10.33.33.1;
                    }
                }
                interface lo0.1;
                interface xe-0/0/15:3.1 {
                    mode sparse;
                }
            }
        }
        interface xe-0/0/15:3.1;
        interface lo0.1;
        route-distinguisher 10.11.11.1:1;
        vrf-target target:1:1;
        vrf-table-label;
        provider-tunnel {
            ldp-p2mp;
            selective {
                tunnel-limit 1;
                group 227.1.1.1/32 {
                    source 124.1.1.1/32 {
                        ldp-p2mp;
                    }
                }
            }
        }
    }
}
```

## junos/routing-instances/l3vpn/ri-l3vpn-mvpn-rp-static-group-range.conf

```
/*
 * Topic: NG-MVPN VRF with a static PIM RP and a local group range over LDP point-to-multipoint tunnels
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 99
 *   wanedge2_mx10008 99
 *   total 198
 * Highlights:
 *   - NG-MVPN VRF: `mvpn` signals multicast state over BGP, and `ldp-p2mp` provider tunnels carry it, with one selective tunnel for the configured source and group.
 *   - OSPF inside the VRF advertises the access subnet and VRF loopback toward the site; `bgp-to-ospf` redistributes remote VPN routes.
 * Pair with: none
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME        e.g. vpn-mcast_10
 *   $UNIT                 e.g. 10
 *   $AC_IFL               e.g. xe-0/0/15:3.10
 *   $MCAST_GROUP_V4_PFX   e.g. 227.1.1.10/32
 *   $PIM_RP_V4            e.g. 10.33.33.10
 *   $LOOPBACK_VRF_V4      e.g. 10.11.11.10
 *   $RD_SUB_ASSIGNED      e.g. 10
 *   $RT_AS                e.g. 1
 *   $RT_ID                e.g. 10
 *   $MCAST_SOURCE_V4_PFX  e.g. 124.1.10.1/32
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        protocols {
            mvpn;
            ospf {
                area 0.0.0.0 {
                    interface lo0.$UNIT;
                    interface $AC_IFL;
                }
                export bgp-to-ospf;
            }
            pim {
                rp {
                    local {
                        group-ranges {
                            $MCAST_GROUP_V4_PFX;
                        }
                    }
                    static {
                        address $PIM_RP_V4;
                    }
                }
                interface lo0.$UNIT {
                    mode sparse;
                    version 2;
                }
                interface $AC_IFL {
                    mode sparse;
                    version 2;
                }
            }
        }
        interface $AC_IFL;
        interface lo0.$UNIT;
        route-distinguisher $LOOPBACK_VRF_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
        vrf-table-label;
        provider-tunnel {
            ldp-p2mp;
            selective {
                tunnel-limit 1;
                group $MCAST_GROUP_V4_PFX {
                    source $MCAST_SOURCE_V4_PFX {
                        ldp-p2mp;
                    }
                }
            }
        }
    }
}
```

## junos/routing-instances/l3vpn/ri-l3vpn-mvpn-rp-static-vpn-mcast-1.conf

```
/*
 * Topic: NG-MVPN VRF vpn-mcast_1 with a static PIM RP
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Highlights:
 *   - NG-MVPN VRF: `mvpn` signals multicast state over BGP, and `ldp-p2mp` provider tunnels carry it, with one selective tunnel for the configured source and group.
 *   - OSPF inside the VRF advertises the access subnet and VRF loopback toward the site; `bgp-to-ospf` redistributes remote VPN routes.
 * Pair with: none
 * Variables: none
 */
routing-instances {
    vpn-mcast_1 {
        instance-type vrf;
        protocols {
            mvpn;
            ospf {
                area 0.0.0.0 {
                    interface lo0.1;
                    interface xe-3/1/13.1;
                }
                export bgp-to-ospf;
            }
            pim {
                rp {
                    static {
                        address 10.33.33.1;
                    }
                }
                interface lo0.1 {
                    mode sparse;
                    version 2;
                }
                interface xe-3/1/13.1 {
                    mode sparse;
                    version 2;
                }
            }
        }
        interface xe-3/1/13.1;
        interface lo0.1;
        route-distinguisher 10.22.22.1:1;
        vrf-target target:1:1;
        vrf-table-label;
        provider-tunnel {
            ldp-p2mp;
            selective {
                tunnel-limit 1;
                group 227.1.1.1/32 {
                    source 124.1.1.1/32 {
                        ldp-p2mp;
                    }
                }
            }
        }
    }
}
```

## junos/routing-instances/ri-bgp-group-inet-any-wanedge2.conf

```
/*
 * Topic: Routing instance l3vpn_bg_5485 with only a BGP group for family inet any
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Highlights:
 *   - The instance has no `instance-type` and no interface.
 * Pair with: none
 * Variables: none
 */
routing-instances {
    l3vpn_bg_5485 {
        protocols {
            bgp {
                group v4spirent {
                    family inet {
                        any;
                    }
                }
            }
        }
    }
}
```

## junos/routing-instances/vpls/ri-vpls-virtual-switch-bridge-domain-flow-label.conf

```
/*
 * Topic: BGP-VPLS virtual switch with flow labels and one VLAN bridge domain
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - BGP-VPLS virtual switch: BGP auto-discovers the sites and signals pseudowires; `no-tunnel-services` builds the VPLS without a tunnel PIC.
 *   - `flow-label-transmit` and `flow-label-receive` add a flow label so transit routers can load-balance the pseudowires.
 * Pair with:
 *  - junos/interfaces/ifl-vlan-bridge.conf
 *  - variant:ewan-core-edge-bgp-overlay families=l2vpn
 *
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME    e.g. vpls_group_101_1
 *   $VPLS_SITE        e.g. 101
 *   $VPLS_SITE_ID     e.g. 1001
 *   $VC_ID            e.g. 1
 *   $BD_NAME          e.g. BDVPLS1
 *   $VLAN             e.g. 1
 *   $AC_IFL           e.g. ae1.1
 *   $RD_SUB_ADMIN     e.g. 2222
 *   $RD_SUB_ASSIGNED  e.g. 1011
 *   $RT_AS            e.g. 64512
 *   $RT_ID            e.g. 1011
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-switch;
        protocols {
            vpls {
                site $VPLS_SITE {
                    site-identifier $VPLS_SITE_ID;
                }
                no-tunnel-services;
                vpls-id $VC_ID;
                flow-label-transmit;
                flow-label-receive;
            }
        }
        bridge-domains {
            $BD_NAME {
                vlan-id $VLAN;
                interface $AC_IFL;
            }
        }
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/routing-instances/vpls/ri-vpls-virtual-switch-bridge-domain-interface.conf

```
/*
 * Topic: BGP-VPLS virtual switch with one VLAN bridge domain and its attachment unit also listed at instance level
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 2
 *   total 2
 * Highlights:
 *   - BGP-VPLS virtual switch: BGP auto-discovers the sites and signals pseudowires; `no-tunnel-services` builds the VPLS without a tunnel PIC.
 * Pair with:
 *  - junos/interfaces/ifl-vlan-bridge.conf
 *  - variant:ewan-core-edge-bgp-overlay families=l2vpn
 *
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME    e.g. vpls_group_101_2
 *   $VPLS_SITE        e.g. 101
 *   $VPLS_SITE_ID     e.g. 1001
 *   $VC_ID            e.g. 2
 *   $BD_NAME          e.g. BDVPLS2
 *   $VLAN             e.g. 2
 *   $AC_IFL           e.g. ae1.2
 *   $RD_SUB_ADMIN     e.g. 2222
 *   $RD_SUB_ASSIGNED  e.g. 1012
 *   $RT_AS            e.g. 64512
 *   $RT_ID            e.g. 1012
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-switch;
        protocols {
            vpls {
                site $VPLS_SITE {
                    site-identifier $VPLS_SITE_ID;
                }
                no-tunnel-services;
                vpls-id $VC_ID;
            }
        }
        bridge-domains {
            $BD_NAME {
                vlan-id $VLAN;
                interface $AC_IFL;
            }
        }
        interface $AC_IFL;
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/routing-instances/vpls/ri-vpls-virtual-switch-bridge-domain.conf

```
/*
 * Topic: BGP-VPLS virtual switch with one VLAN bridge domain
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 997
 *   total 997
 * Highlights:
 *   - BGP-VPLS virtual switch: BGP auto-discovers the sites and signals pseudowires; `no-tunnel-services` builds the VPLS without a tunnel PIC.
 * Pair with:
 *  - junos/interfaces/ifl-vlan-bridge.conf
 *  - variant:ewan-core-edge-bgp-overlay families=l2vpn
 *
 * Variables (example values from wanedge1_mx304):
 *   $INSTANCE_NAME    e.g. vpls_group_101_10
 *   $VPLS_SITE        e.g. 101
 *   $VPLS_SITE_ID     e.g. 1001
 *   $VC_ID            e.g. 10
 *   $BD_NAME          e.g. BDVPLS10
 *   $VLAN             e.g. 10
 *   $AC_IFL           e.g. ae1.10
 *   $RD_SUB_ADMIN     e.g. 2222
 *   $RD_SUB_ASSIGNED  e.g. 10110
 *   $RT_AS            e.g. 64512
 *   $RT_ID            e.g. 10110
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type virtual-switch;
        protocols {
            vpls {
                site $VPLS_SITE {
                    site-identifier $VPLS_SITE_ID;
                }
                no-tunnel-services;
                vpls-id $VC_ID;
            }
        }
        bridge-domains {
            $BD_NAME {
                vlan-id $VLAN;
                interface $AC_IFL;
            }
        }
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/routing-options/autonomous-system-loops.conf

```
/*
 * Topic: Autonomous system number allowing it twice in an AS path
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Highlights:
 *   - `loops 2` accepts routes whose AS path already contains the local AS once.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge2_mx10008):
 *   $ASN  e.g. 64512
 */
routing-options {
    autonomous-system {
        $ASN;
        loops 2;
    }
}
```

## junos/routing-options/autonomous-system.conf

```
/*
 * Topic: Autonomous system number
 * Seen on:
 *   Junos: ce2_mx480 wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   ce2_mx480 1
 *   wanedge1_mx304 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ce2_mx480):
 *   $ASN  e.g. 64520
 */
routing-options {
    autonomous-system $ASN;
}
```

## junos/routing-options/forwarding-table-chained-composite-l3vpn.conf

```
/*
 * Topic: Chained composite next hops for L3VPN ingress
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Highlights:
 *   - Ingress L3VPN routes share chained composite next hops, shrinking forwarding-table state at VRF scale.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    forwarding-table {
        chained-composite-next-hop {
            ingress {
                l3vpn;
            }
        }
    }
}
```

## junos/routing-options/forwarding-table-load-balance-pplb.conf

```
/*
 * Topic: Forwarding-table export of two load-balance policies
 * Seen on:
 *   Junos: wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge2_mx10008 1
 *   total 1
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-pplb-accept.conf
 *
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    forwarding-table {
        export [ load_balance pplb ];
    }
}
```

## junos/routing-options/forwarding-table-pplb.conf

```
/*
 * Topic: Forwarding-table per-packet load balancing
 * Seen on:
 *   Junos: ce2_mx480
 *   EVO: (none)
 * Count:
 *   ce2_mx480 1
 *   total 1
 * Highlights:
 *   - Exports the load-balance policy to the forwarding table so all equal-cost next hops are installed.
 * Pair with:
 *  - junos/policy-options/policy-statement/per-packet-load-balance.conf
 *
 * Peers with: n/a
 * Variables (example values from ce2_mx480):
 *   $PPLB_NAME  e.g. load-balance
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
    }
}
```

## junos/routing-options/graceful-restart.conf

```
/*
 * Topic: Graceful restart
 * Seen on:
 *   Junos: wanedge1_mx304
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    graceful-restart;
}
```

## junos/routing-options/router-id.conf

```
/*
 * Topic: Router ID
 * Seen on:
 *   Junos: wanedge1_mx304 wanedge2_mx10008
 *   EVO: (none)
 * Count:
 *   wanedge1_mx304 1
 *   wanedge2_mx10008 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from wanedge1_mx304):
 *   $ROUTER_ID  e.g. 10.10.0.12
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
 *   Junos: ce2_mx480
 *   EVO: (none)
 * Count:
 *   ce2_mx480 1
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

## _variables.md

# Snippet variable glossary

All `.conf` files under `junos/` and `evo/` are templates: identifiers that vary between deployments are written
as `$VAR`. Render a snippet by substituting each placeholder with your deployment's value. The placeholders each
snippet uses are listed in its `Variables:` header and in the glossary below. Variable names and meanings follow
the shared JVD snippet vocabulary; entries marked **new** were introduced by this JVD. Lettered and numbered
variables (`_A`…`_E`, `_1`, `_2`, …) form an ordered set; the letters and numbers carry no other meaning.

Values left literal on purpose: names other configuration refers to by a single fixed spelling (policies such as
`bgp-to-ospf`'s callers, `send-ospf`, `redistribute-vpn`, `null`, `default`; classifiers and rewrite rules), the
per-device protocol forms whose interface lists are reproduced as configured, and design constants such as
`vrrp-group 1`, BFD intervals and `revert-time 30`.

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `64512` |
| `$ASN_CUSTOMER` | Customer-facing BGP peer autonomous-system number. | `64520` |
| `$ASN_PROVIDER` | **new** Provider (WAN) autonomous-system number of the eBGP neighbor, as configured on a CE. | `64512` |
| `$ISO_NET` | ISO network entity title on lo0 `family iso`. | `47.0005.80ff.f800.0000.0108.0001.0102.5502.0061.00` |
| `$LOOPBACK_ALT_V4_PFX` | Additional lo0 IPv4 `/32` configured on one node besides its design and management loopbacks. | `10.22.22.1/32` |
| `$LOOPBACK_V4` | Primary per-node IPv4 loopback address. | `192.168.0.14` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on a loopback unit (`lo0.0` or a per-VRF `lo0.<n>`). | `192.168.0.14/32` |
| `$LOOPBACK_V6_PFX` | This node's lo0 IPv6 written with its `/128` prefix length. | `abcd::10:255:20:61/128` |
| `$LOOPBACK_VRF_V4` | **new** IPv4 address of a VRF's own loopback unit; used as the VRF route-distinguisher administrator and, on the RP, as the local RP address. | `10.33.33.10` |
| `$ROUTER_ID` | Complete router identifier in IPv4 dotted-decimal form. | `1.1.1.8` |
| `$RR1_V4` | IPv4 loopback of a BGP route reflector this node peers with; `RR1`, `RR2` order the reflectors. | `192.168.0.17` |
| `$RR2_V4` | IPv4 loopback of a second BGP route reflector. | `192.168.0.11` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address on a routed attachment-circuit unit. | `10.75.0.101/24` |
| `$AC_IFL` | Full logical attachment-circuit interface identifier, including its unit. | `ae1.1001` |
| `$AC_IFL_A` | First attachment logical interface (with unit) of a set; `_A`…`_E` order the members. | `ae1.1501` |
| `$AC_IFL_B` | Second attachment logical interface (with unit) of a set. | `et-0/0/44.1501` |
| `$AC_IFL_C` | Third attachment logical interface (with unit) of a set. | `et-0/0/44.3484` |
| `$AC_IFL_D` | Fourth attachment logical interface (with unit) of a set. | `et-0/0/44.3001` |
| `$AC_IFL_E` | Fifth attachment logical interface (with unit) of a set. | `xe-2/0/0:1.3001` |
| `$AE_BUNDLE` | Aggregated-Ethernet bundle a member link joins (`802.3ad`). | `ae1` |
| `$AE_DEVICE_COUNT` | Number of aggregated-Ethernet devices the chassis allocates. | `25` |
| `$BREAKOUT_SUB_PORTS` | Number of breakout sub-ports | `4` |
| `$CORE_INTF_1` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-0/0/50.0` |
| `$CORE_INTF_2` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-0/0/48.0` |
| `$CORE_INTF_3` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-0/0/51.0` |
| `$CORE_INTF_4` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-0/0/49.0` |
| `$CORE_INTF_5` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/1.0` |
| `$CORE_INTF_6` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/3.0` |
| `$CORE_INTF_7` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/4.0` |
| `$CORE_INTF_8` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `ae2.0` |
| `$CORE_PHYS` | Parent of the core LAG. | `et-0/0/48` |
| `$CORE_PHYS_1` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/0` |
| `$CORE_PHYS_2` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/1` |
| `$CORE_PHYS_3` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/4` |
| `$CORE_PHYS_4` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-0/0/51` |
| `$CORE_PHYS_5` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/1` |
| `$CORE_PHYS_6` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/3` |
| `$CORE_PHYS_7` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `et-1/0/4` |
| `$CORE_PHYS_8` | Core-facing physical or aggregate interface; `_1`, `_2`, … order the core links of a per-device form. | `ae2` |
| `$CORE_V4_ADDR` | Core interface IPv4 address. | `10.0.13.1/30` |
| `$DESCRIPTION` | Free-text interface `description`. | `"P1Node to WANEdge1"` |
| `$FPC_SLOT` | FPC slot for a complete source-measured hardware profile. | `1` |
| `$IFD` | Interface-device identifier, excluding a logical unit. | `ae2` |
| `$LACP_SYS_ID` | LACP system-id on a multihomed LAG. | `11:11:11:11:11:11` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `0` |
| `$VLAN` | A single VLAN identifier. | `1` |
| `$VLAN_NAME` | Name of a `vlans` definition (a VLAN set or range) referenced by trunk members and bundle instances. | `VPLS1` |
| `$VRRP_PRIORITY` | **new** VRRP priority of this router in the group; the higher priority becomes master. | `250` |
| `$VRRP_VIP` | **new** VRRP virtual (gateway) IPv4 address shared by the routers of a VRRP group. | `10.75.0.104` |

## Services

| Variable | What it is | Example value |
|---|---|---|
| `$BACKUP_LOOPBACK` | Backup PE loopback used in `backup-neighbor` for HSB l2circuit (`l2circuit-hsb-hub`). | `192.168.0.16` |
| `$BD_NAME` | bridge-domain / MAC-VRF bridge-domain name. | `BD4001` |
| `$BGP_GROUP` | **new** Name of a BGP group (CE-facing group in a VRF, or a CE's group toward a WAN edge). | `CE2` |
| `$CE_PEER_V4` | IPv4 address of the external BGP peer (CE). | `10.70.0.1` |
| `$COS_INTF` | Interface to which the class-of-service configuration is applied, physical or aggregated and independent of topology role. | `xe-0/0/15:0` |
| `$EXPORT_POL` | VRF export policy name (`vrf-export`). | `null` |
| `$GROUP_A` | First configuration group named by `apply-groups`; group order matters. | `ZR_Wavelength` |
| `$GROUP_B` | Second configuration group named by `apply-groups`. | `REST_API` |
| `$IMPORT_POL` | VRF import policy name (`vrf-import`). | `spoke_1` |
| `$INSTANCE_NAME` | Identity stem of a service instance: the routing-instance name, or the shared name of a hub-and-spoke policy and its community. | `hub_1` |
| `$MCAST_GROUP_V4_PFX` | **new** IPv4 multicast group prefix: the PIM RP group range and the selective provider-tunnel group. | `227.1.1.10/32` |
| `$MCAST_SOURCE_V4_PFX` | **new** IPv4 multicast source prefix of a selective provider tunnel. | `124.1.10.1/32` |
| `$PE_LOCAL_V4` | Local IPv4 address of the PE side of a CE eBGP session (`local-address`). | `10.70.0.2` |
| `$PE_PEER_V4` | **new** IPv4 address of the WAN-edge (PE) eBGP neighbor, as configured on a CE. | `70.70.0.2` |
| `$PIM_RP_V4` | **new** IPv4 address of a static PIM rendezvous point. | `1.1.1.8` |
| `$PPLB_NAME` | Per-packet load-balance policy name — a label proven to vary across otherwise-identical deployed forms. | `pplb` |
| `$PRIMARY_LOOPBACK` | Primary PE loopback targeted by an HSB l2circuit Hub (`l2circuit-hsb-hub`). | `192.168.0.14` |
| `$RD_SUB_ADMIN` | Route Distinguisher Administrator subfield. | `4444` |
| `$RD_SUB_ASSIGNED` | Route Distinguisher Assigned Number subfield. | `2001` |
| `$REMOTE_PE_V4` | Remote PE loopback used in static l2circuit / LDP-VPLS neighbour lines. | `192.168.0.15` |
| `$RT_AS` | Route Target Administrator subfield. | `65535` |
| `$RT_ID` | Route Target Assigned Number subfield. | `1` |
| `$VC_ID` | Virtual-circuit identifier of a Layer 2 circuit, or the VPLS identifier (`vpls-id`). | `1001` |
| `$VPLS_SITE` | BGP-VPLS site name. | `103` |
| `$VPLS_SITE_ID` | BGP-VPLS site-identifier. | `1003` |

## byoai/TIERS.md

# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd enterprise_wan/ewan_core_edge`. -->

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

## L3VPN hub-and-spoke spoke VRF with as-override

Family l3vpn, form hub-spoke-spoke. OS mode Junos. Attachment: VLAN-tagged IPv4 unit toward the spoke CE.

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-as-override-vrf-policy.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - reference-external: policy-statement:$IMPORT_POL
  - reference-external: policy-statement:$EXPORT_POL

### wanedge2_mx10008 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-as-override-vrf-policy.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - reference-external: policy-statement:$IMPORT_POL
  - reference-external: policy-statement:$EXPORT_POL

---

## L3VPN hub VRF advertising hub routes to the spokes

Family l3vpn, form hub-spoke-hub-export. OS mode EVO. Attachment: VLAN-tagged IPv4 unit toward the hub CE.

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-export-vrf-policy.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - reference-external: policy-statement:$IMPORT_POL
  - reference-external: policy-statement:$EXPORT_POL

---

## L3VPN hub VRF receiving spoke routes

Family l3vpn, form hub-spoke-hub-import. OS mode EVO. Attachment: VLAN-tagged IPv4 unit toward the hub CE.

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-vrf-policy.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - reference-external: policy-statement:$IMPORT_POL
  - reference-external: policy-statement:$EXPORT_POL

---

## L3VPN VRF with VRRP gateway redundancy and an eBGP CE session

Family l3vpn, form vrrp. OS mode MIXED. Attachment: VLAN-tagged IPv4 unit with a VRRP group.

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-router-id-vrf-target.conf`
- `self-contained`: the above plus `evo/policy-options/policy-statement/ps-bgp-to-ospf.conf`, `evo/protocols/bgp-overlay-pe-labeled-unicast.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### wanedge4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-router-id-vrf-target.conf`
- `self-contained`: the above plus `evo/policy-options/policy-statement/ps-bgp-to-ospf.conf`, `evo/protocols/bgp-overlay-pe-local-as.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-router-id-vrf-target.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-vlan-inet-vrrp-accept-data.conf`, `junos/policy-options/policy-statement/ps-bgp-to-ospf.conf`, `junos/protocols/bgp-overlay-pe-labeled-unicast.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### wanedge2_mx10008 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-router-id-vrf-target.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-vlan-inet-vrrp-accept-data.conf`, `junos/protocols/bgp-overlay-pe.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## BGP-VPLS virtual switch with one VLAN

Family vpls, form bgp-vpls-virtual-switch. OS mode MIXED. Attachment: VLAN bridge unit on the access bundle.

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/vpls/ri-vpls-virtual-switch-vlans.conf`
- `self-contained`: the above plus `evo/interfaces/ifl-vlan-bridge.conf`, `evo/policy-options/policy-statement/ps-bgp-to-ospf.conf`, `evo/protocols/bgp-overlay-pe-labeled-unicast.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### wanedge4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/vpls/ri-vpls-virtual-switch-vlans.conf`
- `self-contained`: the above plus `evo/interfaces/ifl-vlan-bridge.conf`, `evo/policy-options/policy-statement/ps-bgp-to-ospf.conf`, `evo/protocols/bgp-overlay-pe-local-as.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/vpls/ri-vpls-virtual-switch-bridge-domain.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-vlan-bridge.conf`, `junos/policy-options/policy-statement/ps-bgp-to-ospf.conf`, `junos/protocols/bgp-overlay-pe-labeled-unicast.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## BGP-VPLS virtual switch with flow labels

Family vpls, form bgp-vpls-virtual-switch-flow-label. OS mode MIXED. Attachment: VLAN bridge unit on the access bundle.

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/vpls/ri-vpls-virtual-switch-vlans-flow-label.conf`
- `self-contained`: the above plus `evo/interfaces/ifl-vlan-bridge.conf`, `evo/policy-options/policy-statement/ps-bgp-to-ospf.conf`, `evo/protocols/bgp-overlay-pe-labeled-unicast.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/vpls/ri-vpls-virtual-switch-bridge-domain-flow-label.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-vlan-bridge.conf`, `junos/policy-options/policy-statement/ps-bgp-to-ospf.conf`, `junos/protocols/bgp-overlay-pe-labeled-unicast.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## LDP Layer 2 circuit with a hot-standby backup pseudowire

Family l2circuit, form hot-standby. OS mode Junos. Attachment: VLAN circuit cross-connect unit.

### wanedge1_mx304 (junos)

- `minimum`: `junos/protocols/l2circuit-hsb-ethernet-vlan-control-word.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### wanedge2_mx10008 (junos)

- `minimum`: `junos/protocols/l2circuit-hsb-ethernet-vlan-control-word.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## LDP Layer 2 circuit

Family l2circuit, form single-homed. OS mode EVO. Attachment: VLAN circuit cross-connect unit.

### wanedge3_acx7509 (evo)

- `minimum`: `evo/protocols/l2circuit-ethernet-vlan-control-word.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### wanedge4_acx7100-48l (evo)

- `minimum`: `evo/protocols/l2circuit-ethernet-vlan-control-word.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## NG-MVPN VRF with a static RP over LDP point-to-multipoint tunnels

Family ngmvpn, form rp-static-group-range. OS mode Junos. Attachment: VLAN-tagged IPv4 unit and a VRF loopback unit.

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-mvpn-rp-static-group-range.conf`
- `self-contained`: the above plus `junos/policy-options/policy-statement/ps-bgp-to-ospf.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### wanedge2_mx10008 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-mvpn-rp-static-group-range.conf`
- `self-contained`: the above plus `junos/policy-options/policy-statement/ps-bgp-to-ospf.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## NG-MVPN VRF acting as the PIM RP over LDP point-to-multipoint tunnels

Family ngmvpn, form rp-local. OS mode EVO. Attachment: VLAN-tagged IPv4 unit and a VRF loopback unit.

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-mvpn-rp-local.conf`
- `self-contained`: the above plus `evo/policy-options/policy-statement/ps-bgp-to-ospf.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## NG-MVPN VRF with a static RP and null-register processing

Family ngmvpn, form rp-static-group-range-null-register. OS mode EVO. Attachment: VLAN-tagged IPv4 unit and a VRF loopback unit.

### wanedge4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-mvpn-rp-static-group-range-null-register.conf`
- `self-contained`: the above plus `evo/policy-options/policy-statement/ps-bgp-to-ospf.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## Local switching between two units on a CE

Family l2circuit, form local-switching. OS mode MIXED. Attachment: Two VLAN circuit cross-connect units on the same device.

### ce1_acx7100-48l (evo)

- `minimum`: `evo/protocols/l2circuit-local-switching.conf`
- `self-contained`: the above plus `evo/interfaces/ifl-vlan-ccc.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### ce2_mx480 (junos)

- `minimum`: `junos/protocols/l2circuit-local-switching.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-vlan-ccc.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## byoai/DEFAULTS.md

# DEFAULTS — Enterprise WAN Core and Edge

Lab auto-fill values for the Enterprise WAN Core and Edge JVD. Every value is measured from the published device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks auto-fill; otherwise ask. Variable meanings are in [`_variables.md`](../_variables.md).

## Device inventory

| Role | Device | Platform | OS | `$LOOPBACK_V4` / router-id | `$ASN` |
|------|--------|----------|----|----------------------------|--------|
| WAN Edge (PE) | wanedge1_mx304 | MX304 | Junos | 10.10.0.12 | 64512 |
| WAN Edge (PE) | wanedge2_mx10008 | MX10008 | Junos | 192.168.0.15 | 64512 |
| WAN Edge (PE) | wanedge3_acx7509 | ACX7509 | EVO | 192.168.0.14 | 64512 |
| WAN Edge (PE) | wanedge4_acx7100-48l | ACX7100-48L | EVO | 192.168.0.16 | 64512 |
| Core / P Router | p1_ptx10003 | PTX10003 | EVO | 1.1.1.8 | 64512 |
| Core / P Router | p2_ptx10001-36mr | PTX10001-36MR | EVO | 6.6.6.6 | 64512 |
| L2/L3 Edge (CE) | ce1_acx7100-48l | ACX7100-48L | EVO | — | — |
| L2/L3 Edge (CE) | ce2_mx480 | MX480 | Junos | — | 64520 |

## BGP overlay

| Device | BGP form | Peers |
|--------|----------|-------|
| wanedge1, wanedge3 | `{junos,evo}/protocols/bgp-overlay-pe-labeled-unicast.conf` | 192.168.0.17, 192.168.0.11 |
| wanedge2 | `junos/protocols/bgp-overlay-pe.conf` | 192.168.0.17, 192.168.0.11 |
| wanedge4 | `evo/protocols/bgp-overlay-pe-local-as.conf` | 192.168.0.17, 192.168.0.11 |
| p1, p2 | not modelled | route-reflector peering toward 2.2.2.2, 4.4.4.4, 5.5.5.5, 7.7.7.7 does not correspond to this JVD's WAN edges |

## Service examples (measured instances)

| Service form | Device | Example values |
|--------------|--------|----------------|
| L3VPN with VRRP | wanedge1 / wanedge2 | `l3vpn_vrrp_3001_3001`, `$AC_IFL` xe-0/0/15:1.3001 / xe-3/1/12.3001, `$BGP_GROUP` CE1, `$CE_PEER_V4` 10.45.0.3, `$PE_LOCAL_V4` 10.45.0.4 (the VRRP virtual address), `$ASN_CUSTOMER` 64510, `vrf-target` 64510:3001, RD `<loopback>:3001`; unit priority 250 on wanedge1, 150 on wanedge2 |
| L3VPN with VRRP | wanedge3 / wanedge4 | `l3vpn_vrrp_3001_3001`, `$AC_IFL` et-1/0/12.3001 / et-0/0/51:0.3001, `$BGP_GROUP` CE2, `$CE_PEER_V4` 10.75.0.3, `$PE_LOCAL_V4` 10.75.0.4, `$ASN_CUSTOMER` 64520, `vrf-target` 64510:3001 |
| L3VPN hub-and-spoke, spoke | wanedge1 / wanedge2 | `l3vpn_Spoke_1_1` / `l3vpn_Spoke_2_1`, `$AC_IFL` xe-0/0/15:0.4001 / xe-3/1/10.4001, `$BGP_GROUP` v4spirent, `$CE_PEER_V4` 10.40.0.1 / 10.50.0.1, `$ASN_CUSTOMER` 64510, `$IMPORT_POL` hub_1, `$EXPORT_POL` spoke_1, RD `<loopback>:4001` |
| L3VPN hub-and-spoke, hub | wanedge3 | advertise: `Hub_Adv_To_Spokes_1001` on et-1/0/12.2001, import `spoke_1`, export `null`; receive: `Spokes_Adv_To_Hub_1001` on et-1/0/12.1001, import `null`, export `hub_1`; `$BGP_GROUP` CE2, `$ASN_CUSTOMER` 64520 |
| BGP-VPLS | wanedge1 / wanedge3 / wanedge4 | `vpls_group_101_<n>`, `$AC_IFL` ae1.<n>, `$VLAN` <n>, `$VC_ID` <n>, `$VPLS_SITE` 101 / 103 / 104, `$VPLS_SITE_ID` 1001 / 1003 / 1004, RD 2222 / 4444 / 7777 : `10<n>`-style, `vrf-target` 64512:<RD assigned> |
| Layer 2 circuit, hot standby | wanedge1 / wanedge2 | `$AC_IFL` ae1.1501 / ae1.1001, `$VC_ID` = unit, `$PRIMARY_LOOPBACK` 192.168.0.14, `$BACKUP_LOOPBACK` 192.168.0.16 |
| Layer 2 circuit | wanedge3 / wanedge4 | `$AC_IFL` ae1.1001, `$VC_ID` 1001, `$REMOTE_PE_V4` 192.168.0.15 |
| NG-MVPN | wanedge1–wanedge4 | `vpn-mcast_<n>`, `$AC_IFL` <access port>.<n>, lo0 unit <n>, `$LOOPBACK_VRF_V4` 10.11.11.<n> / 10.22.22.<n> / 10.33.33.<n> / 10.44.44.<n>, `$PIM_RP_V4` 10.33.33.<n> (wanedge3 is the RP), `$MCAST_GROUP_V4_PFX` 227.1.1.<n>/32, `$MCAST_SOURCE_V4_PFX` 124.1.<n>.1/32, `vrf-target` 1:<n> |
| Local switching | ce1 / ce2 | `$AC_IFL_A` ae1.1501 / et-2/1/4:0.1, `$AC_IFL_B` et-0/0/44.1501 / xe-2/0/0:0.1 |

## Numbering conventions (hold on every measured instance)

| Service form | Convention |
|--------------|------------|
| L3VPN (all forms) | RD administrator = the WAN edge loopback (`$LOOPBACK_V4`); the VRRP VRF router-id is the same loopback. |
| BGP-VPLS | `$RT_ID` = `$RD_SUB_ASSIGNED`; `$RD_SUB_ADMIN` is fixed per device (2222, 4444, 7777) and is not the loopback. |
| NG-MVPN | RD administrator = the VRF loopback `lo0.<n>` address; the PIM group range equals the selective-tunnel group. |

For `N` services, auto-fill increments the per-service number from the example's starting value and keeps the conventions above. Keep the two WAN edges of a service consistent: same instance name and route target; for VRRP the same virtual address with different priorities.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into `jvd-ewan-core-edge-snips.md` by `regenerate-bundle.sh`.

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
#   - { kind: <l3vpn-vrrp|l3vpn-spoke|l3vpn-hub|bgp-vpls|l2circuit|ngmvpn|local-switching>,
#       count: <int>,
#       start_id: <int>,
#       ac_ifl: <ifd.unit>,
#       rt: <rt_as:rt_id>,
#       rd: <admin:assigned> }
# snips_used:
#   - junos/routing-instances/l3vpn/ri-l3vpn-ebgp-router-id-vrf-target.conf
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

- The prerequisites the device must already run: the snip's `Pair with:` entries (for `variant:ewan-core-edge-bgp-overlay`, the BGP overlay form whose `Seen on:` lists the device) and the requirements TIERS.md lists under the Blocked entry for that device. Name them; do not render them.
- Inputs defaulted because the user did not provide them.
- Cross-device consistency the user must verify: the WAN edges of one service use the same instance name and route target; VRRP peers share the virtual address and use different priorities; a Layer 2 circuit uses the same virtual-circuit ID on both ends.
- Anything that is by-pattern rather than validated on that exact device.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
