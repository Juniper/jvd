# JVD EWAN DC Edge snippet library

## evo/forwarding-options/l2circuit-control-passthrough.conf

```
/*
 * Topic: L2 circuit control-frame passthrough (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 1
 *   total 1
 * Highlights:
 *   - Allows Layer 2 control frames to pass transparently through pseudowires on the P router.
 * Pair with: none
 * Variables: none
 */
forwarding-options {
    l2circuit-control-passthrough;
}
```

## evo/groups/apply-global-one.conf

```
/*
 * Topic: Single-group application
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_acx7100-48l
 * Count:
 *   p1_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - Applies the `global` group only.
 * Pair with: none
 * Variables (example values from p1_acx7100-48l):
 *   $GROUP_A  e.g. global
 */
apply-groups $GROUP_A;
```

## evo/groups/apply-global-two.conf

```
/*
 * Topic: Ordered two-group application
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 1
 *   total 1
 * Highlights:
 *   - Applies two configuration groups; list order is preserved from source.
 * Pair with: none
 * Variables (example values from p2_ptx10001-36mr):
 *   $GROUP_A  e.g. global
 *   $GROUP_B  e.g. intSpeeds
 */
apply-groups [ $GROUP_A $GROUP_B ];
```

## evo/groups/gr-global-p1.conf

```
/*
 * Topic: Global configuration group: loopback and identity for p1
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_acx7100-48l
 * Count:
 *   p1_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - The `global` group carries this node's loopback (design `/32` marked primary and preferred), the router-id and `chassis dump-on-panic`. Configuration groups are one fragment, so the group is reproduced whole after the approved lab-management exclusions.
 *   - Additional lo0 addresses (`127.x`, management `10.255.x`, ISO, IPv6) are kept as configured in the validated lab.
 * Pair with: none
 * Variables (example values from p1_acx7100-48l):
 *   $LOOPBACK_MGMT_V4_PFX  e.g. 10.255.4.118/32
 *   $LOOPBACK_ALT_V4_PFX   e.g. 111.1.1.1/32
 *   $LOOPBACK_V4_PFX       e.g. 1.1.1.7/32
 *   $ISO_NET               e.g. 47.0005.80ff.f800.0000.0108.0001.0102.5500.4118.00
 *   $LOOPBACK_V6_PFX       e.g. abcd::10:255:4:118/128
 *   $ROUTER_ID             e.g. 1.1.1.7
 */
groups {
    global {
        chassis {
            dump-on-panic;
        }
        interfaces {
            lo0 {
                unit 0 {
                    family inet {
                        address 127.0.0.1/32;
                        address 127.0.0.64/32;
                        address $LOOPBACK_MGMT_V4_PFX {
                            primary;
                        }
                        address $LOOPBACK_ALT_V4_PFX;
                        address $LOOPBACK_V4_PFX {
                            primary;
                            preferred;
                        }
                    }
                    family iso {
                        address $ISO_NET;
                    }
                    family inet6 {
                        address $LOOPBACK_V6_PFX;
                    }
                }
            }
        }
        routing-options {
            router-id $ROUTER_ID;
        }
    }
}
```

## evo/groups/gr-global-p2.conf

```
/*
 * Topic: Global configuration group: loopback and identity for p2
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 1
 *   total 1
 * Highlights:
 *   - The `global` group carries this node's loopback (design `/32` marked primary and preferred) and `chassis dump-on-panic`. Configuration groups are one fragment, so the group is reproduced whole after the approved lab-management exclusions.
 *   - Additional lo0 addresses (`127.x`, management `10.255.x`, ISO, IPv6) are kept as configured in the validated lab.
 * Pair with: none
 * Variables (example values from p2_ptx10001-36mr):
 *   $LOOPBACK_V4_PFX  e.g. 1.1.1.8/32
 */
groups {
    global {
        chassis {
            dump-on-panic;
        }
        interfaces {
            lo0 {
                unit 0 {
                    family inet {
                        address 127.0.0.1/32;
                        address 127.0.0.64/32;
                        address $LOOPBACK_V4_PFX {
                            primary;
                            preferred;
                        }
                    }
                }
            }
        }
    }
}
```

## evo/groups/gr-intspeeds-4x100g.conf

```
/*
 * Topic: Configuration group pinning four PTX10001-36MR ports to 100G
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 1
 *   total 1
 * Highlights:
 *   - The `intSpeeds` group carries `speed 100g` for FPC 0 PIC 0 ports 0-3 (the four core links) and is applied with `apply-groups`; configuration groups are one fragment, so the group is reproduced whole.
 * Pair with: none
 * Variables: none
 */
groups {
    intSpeeds {
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
                    port 3 {
                        speed 100g;
                    }
                }
            }
        }
    }
}
```

## evo/interfaces/ifd-speed-100g-enable.conf

```
/*
 * Topic: Physical port explicitly enabled and pinned to 100G speed (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_acx7100-48l
 * Count:
 *   p1_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - One uplink carries an explicit `enable` alongside `speed 100g`; `enable` is the default state and changes nothing operationally.
 * Pair with: none
 * Variables (example values from p1_acx7100-48l / et-0/0/50):
 *   $IFD  e.g. et-0/0/50
 */
interfaces {
    $IFD {
        enable;
        speed 100g;
    }
}
```

## evo/interfaces/ifd-speed-100g.conf

```
/*
 * Topic: Physical port pinned to 100G speed (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_acx7100-48l
 * Count:
 *   p1_acx7100-48l 3
 *   total 3
 * Highlights:
 *   - `speed 100g` on the ACX7100-48L QSFP28 uplinks fixes the port speed instead of relying on optic auto-detection.
 * Pair with: none
 * Variables (example values from p1_acx7100-48l / et-0/0/48):
 *   $IFD  e.g. et-0/0/48
 */
interfaces {
    $IFD {
        speed 100g;
    }
}
```

## evo/interfaces/ifl-core-inet-mpls.conf

```
/*
 * Topic: Core-facing point-to-point link with IPv4 and MPLS families (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_acx7100-48l p2_ptx10001-36mr
 * Count:
 *   p1_acx7100-48l 4
 *   p2_ptx10001-36mr 4
 *   total 8
 * Highlights:
 *   - Untagged core link on the MPLS WAN P routers: `family inet` with a /30 and `family mpls` so LDP and OSPF can run on it.
 * Pair with: none
 * Variables (example values from p2_ptx10001-36mr / et-0/0/0):
 *   $CORE_PHYS     e.g. et-0/0/0
 *   $CORE_V4_ADDR  e.g. 10.0.11.1/30
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

## evo/policy-options/policy-statement/per-packet-load-balance.conf

```
/*
 * Topic: Per-packet (per-flow) load-balancing policy (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_acx7100-48l p2_ptx10001-36mr
 * Count:
 *   p1_acx7100-48l 1
 *   p2_ptx10001-36mr 1
 *   total 2
 * Highlights:
 *   - Applied as `forwarding-table export`, this installs all equal-cost next hops so ECMP is used across the MPLS transport.
 * Pair with: none
 * Variables (example values from p1_acx7100-48l):
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

## evo/protocols/ldp-interface-4-core-loopback.conf

```
/*
 * Topic: LDP on four named core links and the loopback (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_acx7100-48l
 * Count:
 *   p1_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - P-router form that enables LDP only on the four named core links and the loopback, without `interface all`.
 * Pair with: none
 * Variables (example values from p1_acx7100-48l):
 *   $CORE_PHYS_1  e.g. et-0/0/48
 *   $CORE_PHYS_2  e.g. et-0/0/49
 *   $CORE_PHYS_3  e.g. et-0/0/50
 *   $CORE_PHYS_4  e.g. et-0/0/51
 */
protocols {
    ldp {
        interface $CORE_PHYS_1.0;
        interface $CORE_PHYS_2.0;
        interface $CORE_PHYS_3.0;
        interface $CORE_PHYS_4.0;
        interface lo0.0;
    }
}
```

## evo/protocols/ldp-interface-all-loopback.conf

```
/*
 * Topic: LDP on all interfaces plus the loopback (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 1
 *   total 1
 * Highlights:
 *   - `interface all` enables LDP on every MPLS-capable interface; `lo0.0` is listed so the loopback is an LDP transport address and FEC.
 * Pair with: none
 * Variables: none
 */
protocols {
    ldp {
        interface all;
        interface lo0.0;
    }
}
```

## evo/protocols/ldp-interface-management-disable.conf

```
/*
 * Topic: LDP disabled on the management interface (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 1
 *   total 1
 * Highlights:
 *   - Excludes the management port from `interface all`; the per-interface block is its own fragment, so it sits alongside the all-interfaces form.
 * Pair with: none
 * Variables (example values from p2_ptx10001-36mr):
 *   $IFD  e.g. fxp0
 */
protocols {
    ldp {
        interface $IFD.0 {
            disable;
        }
    }
}
```

## evo/protocols/lldp-interface-all.conf

```
/*
 * Topic: LLDP on all interfaces (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 1
 *   total 1
 * Highlights:
 *   - Neighbour discovery on every interface.
 * Pair with: none
 * Variables: none
 */
protocols {
    lldp {
        interface all;
    }
}
```

## evo/protocols/mpls-interface-4-core-all.conf

```
/*
 * Topic: MPLS on four named core links plus all interfaces (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_acx7100-48l
 * Count:
 *   p1_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - P-router form naming the four core links and also setting `interface all`.
 * Pair with: none
 * Variables (example values from p1_acx7100-48l):
 *   $CORE_PHYS_1  e.g. et-0/0/49
 *   $CORE_PHYS_2  e.g. et-0/0/48
 *   $CORE_PHYS_3  e.g. et-0/0/50
 *   $CORE_PHYS_4  e.g. et-0/0/51
 */
protocols {
    mpls {
        interface $CORE_PHYS_1.0;
        interface $CORE_PHYS_2.0;
        interface $CORE_PHYS_3.0;
        interface $CORE_PHYS_4.0;
        interface all;
    }
}
```

## evo/protocols/mpls-interface-all.conf

```
/*
 * Topic: MPLS enabled on all interfaces (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 1
 *   total 1
 * Highlights:
 *   - `interface all` enables MPLS forwarding on every interface with `family mpls`.
 * Pair with: none
 * Variables: none
 */
protocols {
    mpls {
        interface all;
    }
}
```

## evo/protocols/mpls-interface-management-disable.conf

```
/*
 * Topic: MPLS disabled on the management interface (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 1
 *   total 1
 * Highlights:
 *   - Excludes the management port from `interface all`; the per-interface block is its own fragment, so it sits alongside the all-interfaces form.
 * Pair with: none
 * Variables (example values from p2_ptx10001-36mr):
 *   $IFD  e.g. fxp0
 */
protocols {
    mpls {
        interface $IFD.0 {
            disable;
        }
    }
}
```

## evo/protocols/ospf-area0-p1.conf

```
/*
 * Topic: OSPF area 0 as deployed on p1 (four LFA core links, passive loopback, management listed)
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_acx7100-48l
 * Count:
 *   p1_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - Four core links with `node-link-protection` and `ldp-synchronization`, passive loopback; the management port is listed as a plain member rather than disabled.
 * Pair with: none
 * Variables (example values from p1_acx7100-48l):
 *   $CORE_INTF_1  e.g. et-0/0/49.0
 *   $CORE_INTF_2  e.g. et-0/0/50.0
 *   $CORE_INTF_3  e.g. et-0/0/51.0
 *   $CORE_INTF_4  e.g. et-0/0/48.0
 */
protocols {
    ospf {
        area 0.0.0.0 {
            interface $CORE_INTF_1 {
                node-link-protection;
                ldp-synchronization;
            }
            interface $CORE_INTF_2 {
                node-link-protection;
                ldp-synchronization;
            }
            interface $CORE_INTF_3 {
                node-link-protection;
                ldp-synchronization;
            }
            interface $CORE_INTF_4 {
                node-link-protection;
                ldp-synchronization;
            }
            interface lo0.0 {
                passive;
            }
            interface fxp0.0;
        }
    }
}
```

## evo/protocols/ospf-area0-p2.conf

```
/*
 * Topic: OSPF area 0 as deployed on p2 (four plain core links, passive loopback, management disabled)
 * Seen on:
 *   Junos: (none)
 *   EVO: p2_ptx10001-36mr
 * Count:
 *   p2_ptx10001-36mr 1
 *   total 1
 * Highlights:
 *   - Four core links as plain area members (no LFA, no LDP synchronisation), passive loopback and the EVO management port `re0:mgmt-0.0` disabled.
 * Pair with: none
 * Variables (example values from p2_ptx10001-36mr):
 *   $CORE_INTF_1  e.g. et-0/0/3.0
 *   $CORE_INTF_2  e.g. et-0/0/2.0
 *   $CORE_INTF_3  e.g. et-0/0/1.0
 *   $CORE_INTF_4  e.g. et-0/0/0.0
 *   $IFD          e.g. re0:mgmt-0
 */
protocols {
    ospf {
        area 0.0.0.0 {
            interface $CORE_INTF_1;
            interface $CORE_INTF_2;
            interface $CORE_INTF_3;
            interface $CORE_INTF_4;
            interface lo0.0 {
                passive;
            }
            interface $IFD.0 {
                disable;
            }
        }
    }
}
```

## evo/protocols/ospf-backup-spf-options.conf

```
/*
 * Topic: OSPF loop-free-alternate backup computation options
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_acx7100-48l
 * Count:
 *   p1_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - `remote-backup-calculation` with `per-prefix-calculation all` and `node-link-degradation` lets OSPF compute remote LFA backups per prefix and prefer node-protecting paths when both link and node protection are possible.
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
    }
}
```

## evo/routing-options/forwarding-table-pplb.conf

```
/*
 * Topic: Forwarding-table per-packet load balancing (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_acx7100-48l p2_ptx10001-36mr
 * Count:
 *   p1_acx7100-48l 1
 *   p2_ptx10001-36mr 1
 *   total 2
 * Highlights:
 *   - P-router form: only the load-balance export policy.
 * Pair with:
 *  - evo/policy-options/policy-statement/per-packet-load-balance.conf
 * Variables (example values from p1_acx7100-48l):
 *   $PPLB_NAME  e.g. load-balance
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
    }
}
```

## evo/routing-options/router-id.conf

```
/*
 * Topic: Router ID
 * Seen on:
 *   Junos: (none)
 *   EVO: p1_acx7100-48l p2_ptx10001-36mr
 * Count:
 *   p1_acx7100-48l 1
 *   p2_ptx10001-36mr 1
 *   total 2
 * Highlights:
 *   - Explicit router-id equal to the loopback; on the other devices the same statement lives inside the `global` configuration group.
 * Pair with: none
 * Variables (example values from wan-edge1_mx204):
 *   $ROUTER_ID  e.g. 1.1.1.10
 */
routing-options {
    router-id $ROUTER_ID;
}
```

## junos/chassis/aggregated-devices-ethernet.conf

```
/*
 * Topic: Aggregated-Ethernet device count
 * Seen on:
 *   Junos: leaf1_qfx5120-48t leaf2_qfx5120-48t tor1_ex4200-48t tor2_ex4200-48t wan-edge1_mx204 wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48t 1
 *   leaf2_qfx5120-48t 1
 *   tor1_ex4200-48t 1
 *   tor2_ex4200-48t 1
 *   wan-edge1_mx204 1
 *   wan-edge2_acx5448-m 1
 *   total 6
 * Highlights:
 *   - Allocates the number of `ae` interfaces the chassis may create; must be at least the highest `aeN` configured.
 * Pair with: none
 * Variables (example values from leaf1_qfx5120-48t):
 *   $AE_DEVICE_COUNT  e.g. 100
 */
chassis {
    aggregated-devices {
        ethernet {
            device-count $AE_DEVICE_COUNT;
        }
    }
}
```

## junos/chassis/fpc-mx10003-6x100g.conf

```
/*
 * Topic: MX10003 FPC profile with six 100G ports
 * Seen on:
 *   Junos: dc-edge2_mx10003
 *   EVO: (none)
 * Count:
 *   dc-edge2_mx10003 1
 *   total 1
 * Highlights:
 *   - PIC 0 is disabled with `number-of-ports 0`; PIC 1 runs ports 0-5 at 100G.
 * Pair with: none
 * Variables (example values from dc-edge2_mx10003):
 *   $FPC_SLOT  e.g. 1
 */
chassis {
    fpc $FPC_SLOT {
        pic 0 {
            number-of-ports 0;
        }
        pic 1 {
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
        }
    }
}
```

## junos/chassis/fpc-mx10003-8x100g-1x4x10g.conf

```
/*
 * Topic: MX10003 FPC profile with eight 100G ports and one port channelised to 4x10G
 * Seen on:
 *   Junos: dc-edge2_mx10003
 *   EVO: (none)
 * Count:
 *   dc-edge2_mx10003 1
 *   total 1
 * Highlights:
 *   - PIC 0 is disabled with `number-of-ports 0`; PIC 1 runs ports 0-7 at 100G and channelises port 11 into four 10G sub-ports (the `xe-0/1/11:N` interfaces).
 * Pair with: none
 * Variables (example values from dc-edge2_mx10003):
 *   $FPC_SLOT  e.g. 0
 */
chassis {
    fpc $FPC_SLOT {
        pic 0 {
            number-of-ports 0;
        }
        pic 1 {
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
            port 11 {
                number-of-sub-ports 4;
                speed 10g;
            }
        }
    }
}
```

## junos/chassis/fpc-mx204-3x100g-8x10g-sub-ports.conf

```
/*
 * Topic: MX204 FPC profile with three 100G and eight 10G ports, one sub-port each
 * Seen on:
 *   Junos: wan-edge1_mx204
 *   EVO: (none)
 * Count:
 *   wan-edge1_mx204 1
 *   total 1
 * Highlights:
 *   - Pins the MX204 port speeds: PIC 0 ports 0-2 at 100G and PIC 1 ports 0-7 at 10G, each with `number-of-sub-ports 1` so no port is channelised.
 * Pair with: none
 * Variables (example values from wan-edge1_mx204):
 *   $FPC_SLOT  e.g. 0
 */
chassis {
    fpc $FPC_SLOT {
        pic 0 {
            port 0 {
                number-of-sub-ports 1;
                speed 100g;
            }
            port 1 {
                number-of-sub-ports 1;
                speed 100g;
            }
            port 2 {
                number-of-sub-ports 1;
                speed 100g;
            }
        }
        pic 1 {
            port 0 {
                number-of-sub-ports 1;
                speed 10g;
            }
            port 1 {
                number-of-sub-ports 1;
                speed 10g;
            }
            port 2 {
                number-of-sub-ports 1;
                speed 10g;
            }
            port 3 {
                number-of-sub-ports 1;
                speed 10g;
            }
            port 4 {
                number-of-sub-ports 1;
                speed 10g;
            }
            port 5 {
                number-of-sub-ports 1;
                speed 10g;
            }
            port 6 {
                number-of-sub-ports 1;
                speed 10g;
            }
            port 7 {
                number-of-sub-ports 1;
                speed 10g;
            }
        }
    }
}
```

## junos/chassis/fpc-pic-port-channel-speed-10g.conf

```
/*
 * Topic: Port channelised to 4x10G
 * Seen on:
 *   Junos: leaf1_qfx5120-48t leaf2_qfx5120-48t spine1_qfx5200 spine2_qfx5200
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48t 1
 *   leaf2_qfx5120-48t 1
 *   spine1_qfx5200 1
 *   spine2_qfx5200 1
 *   total 4
 * Highlights:
 *   - `channel-speed 10g` splits one QSFP port into four 10G channels (`xe-N/N/N:0-3`), used for the leaf and spine fabric links.
 * Pair with: none
 * Variables (example values from leaf1_qfx5120-48t):
 *   $FPC_SLOT  e.g. 0
 *   $PIC       e.g. 0
 *   $PORT      e.g. 50
 */
chassis {
    fpc $FPC_SLOT {
        pic $PIC {
            port $PORT {
                channel-speed 10g;
            }
        }
    }
}
```

## junos/chassis/network-services-enhanced-ip.conf

```
/*
 * Topic: Chassis network-services enhanced-ip
 * Seen on:
 *   Junos: wan-edge1_mx204 wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   wan-edge1_mx204 1
 *   wan-edge2_acx5448-m 1
 *   total 2
 * Highlights:
 *   - Required MX/ACX forwarding mode for EVPN and the IRB/virtual-gateway features used on the WAN edge.
 * Pair with: none
 * Variables: none
 */
chassis {
    network-services enhanced-ip;
}
```

## junos/forwarding-options/evpn-vxlan-shared-tunnels.conf

```
/*
 * Topic: EVPN-VXLAN shared tunnels
 * Seen on:
 *   Junos: leaf1_qfx5120-48t leaf2_qfx5120-48t
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48t 1
 *   leaf2_qfx5120-48t 1
 *   total 2
 * Highlights:
 *   - Lets all MAC-VRFs on the leaf share one VXLAN tunnel per remote VTEP instead of one per VNI, which is what makes 1,500 MAC-VRF instances fit the QFX5120 tunnel table.
 * Pair with: none
 * Variables: none
 */
forwarding-options {
    evpn-vxlan {
        shared-tunnels;
    }
}
```

## junos/forwarding-options/vxlan-routing.conf

```
/*
 * Topic: VXLAN routing resource profile with overlay ECMP
 * Seen on:
 *   Junos: leaf1_qfx5120-48t leaf2_qfx5120-48t
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48t 1
 *   leaf2_qfx5120-48t 1
 *   total 2
 * Highlights:
 *   - Reserves next-hop and interface resources for routed VXLAN (IRB over VXLAN) and enables `overlay-ecmp` so routed traffic can use multiple remote VTEPs.
 * Pair with: none
 * Variables: none
 */
forwarding-options {
    vxlan-routing {
        next-hop 32768;
        interface-num 8192;
        overlay-ecmp;
    }
}
```

## junos/groups/apply-global-three.conf

```
/*
 * Topic: Ordered three-group application
 * Seen on:
 *   Junos: dc-edge1_mx480 dc-edge2_mx10003 leaf1_qfx5120-48t leaf2_qfx5120-48t spine2_qfx5200 tor1_ex4200-48t tor2_ex4200-48t wan-edge1_mx204 wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 1
 *   dc-edge2_mx10003 1
 *   leaf1_qfx5120-48t 1
 *   leaf2_qfx5120-48t 1
 *   spine2_qfx5200 1
 *   tor1_ex4200-48t 1
 *   tor2_ex4200-48t 1
 *   wan-edge1_mx204 1
 *   wan-edge2_acx5448-m 1
 *   total 9
 * Highlights:
 *   - Applies `global` and the routing-engine/member groups; list order is preserved from source.
 * Pair with: none
 * Variables (example values from dc-edge1_mx480):
 *   $GROUP_A  e.g. global
 *   $GROUP_B  e.g. re0
 *   $GROUP_C  e.g. re1
 */
apply-groups [ $GROUP_A $GROUP_B $GROUP_C ];
```

## junos/groups/apply-global-two.conf

```
/*
 * Topic: Ordered two-group application
 * Seen on:
 *   Junos: spine1_qfx5200
 *   EVO: (none)
 * Count:
 *   spine1_qfx5200 1
 *   total 1
 * Highlights:
 *   - Applies two configuration groups; list order is preserved from source.
 * Pair with: none
 * Variables (example values from spine1_qfx5200):
 *   $GROUP_A  e.g. global
 *   $GROUP_B  e.g. member0
 */
apply-groups [ $GROUP_A $GROUP_B ];
```

## junos/groups/gr-global-dc-edge1.conf

```
/*
 * Topic: Global configuration group: loopback and identity for dc-edge1
 * Seen on:
 *   Junos: dc-edge1_mx480
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 1
 *   total 1
 * Highlights:
 *   - The `global` group carries this node's loopback (design `/32` marked primary), the router-id and `chassis dump-on-panic`. Configuration groups are one fragment, so the group is reproduced whole after the approved lab-management exclusions.
 *   - Additional lo0 addresses (`127.x`, management `10.255.x`, ISO, IPv6) are kept as configured in the validated lab.
 * Pair with: none
 * Variables (example values from dc-edge1_mx480):
 *   $LOOPBACK_V4_PFX  e.g. 1.1.1.5/32
 *   $ISO_NET          e.g. 47.0005.80ff.f800.0000.0108.0001.0102.5502.3228.00
 *   $LOOPBACK_V6_PFX  e.g. abcd::10:255:23:228/128
 *   $ROUTER_ID        e.g. 1.1.1.5
 */
groups {
    global {
        chassis {
            dump-on-panic;
        }
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
        routing-options {
            router-id $ROUTER_ID;
        }
    }
}
```

## junos/groups/gr-global-dc-edge2.conf

```
/*
 * Topic: Global configuration group: loopback and identity for dc-edge2
 * Seen on:
 *   Junos: dc-edge2_mx10003
 *   EVO: (none)
 * Count:
 *   dc-edge2_mx10003 1
 *   total 1
 * Highlights:
 *   - The `global` group carries this node's loopback (design `/32` marked primary), the router-id and `chassis dump-on-panic`. Configuration groups are one fragment, so the group is reproduced whole after the approved lab-management exclusions.
 *   - Additional lo0 addresses (`127.x`, management `10.255.x`, ISO, IPv6) are kept as configured in the validated lab.
 * Pair with: none
 * Variables (example values from dc-edge2_mx10003):
 *   $LOOPBACK_V4_PFX  e.g. 1.1.1.6/32
 *   $LOOPBACK_V6_PFX  e.g. abcd::10:255:27:225/128
 *   $ROUTER_ID        e.g. 1.1.1.6
 */
groups {
    global {
        chassis {
            dump-on-panic;
        }
        interfaces {
            lo0 {
                unit 0 {
                    family inet {
                        address $LOOPBACK_V4_PFX {
                            primary;
                        }
                    }
                    family iso;
                    family inet6 {
                        address $LOOPBACK_V6_PFX {
                            primary;
                        }
                    }
                }
            }
        }
        routing-options {
            router-id $ROUTER_ID;
        }
    }
}
```

## junos/groups/gr-global-leaf1.conf

```
/*
 * Topic: Global configuration group: loopback and identity for leaf1
 * Seen on:
 *   Junos: leaf1_qfx5120-48t
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48t 1
 *   total 1
 * Highlights:
 *   - The `global` group carries this node's loopback (design `/32` marked primary), the router-id. Configuration groups are one fragment, so the group is reproduced whole after the approved lab-management exclusions.
 * Pair with: none
 * Variables (example values from leaf1_qfx5120-48t):
 *   $LOOPBACK_V4_PFX  e.g. 1.1.1.1/32
 *   $ROUTER_ID        e.g. 1.1.1.1
 */
groups {
    global {
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
        routing-options {
            router-id $ROUTER_ID;
        }
    }
}
```

## junos/groups/gr-global-leaf2.conf

```
/*
 * Topic: Global configuration group: loopback and identity for leaf2
 * Seen on:
 *   Junos: leaf2_qfx5120-48t
 *   EVO: (none)
 * Count:
 *   leaf2_qfx5120-48t 1
 *   total 1
 * Highlights:
 *   - The `global` group carries this node's loopback (design `/32` marked primary), the router-id. Configuration groups are one fragment, so the group is reproduced whole after the approved lab-management exclusions.
 *   - Additional lo0 addresses (`127.x`, management `10.255.x`, ISO, IPv6) are kept as configured in the validated lab.
 * Pair with: none
 * Variables (example values from leaf2_qfx5120-48t):
 *   $LOOPBACK_V4_PFX  e.g. 1.1.1.2/32
 *   $ROUTER_ID        e.g. 1.1.1.2
 */
groups {
    global {
        interfaces {
            lo0 {
                unit 0 {
                    family inet {
                        address 127.0.0.1/32;
                        address $LOOPBACK_V4_PFX {
                            primary;
                        }
                    }
                }
            }
        }
        routing-options {
            router-id $ROUTER_ID;
        }
    }
}
```

## junos/groups/gr-global-spine1.conf

```
/*
 * Topic: Global configuration group: loopback and identity for spine1
 * Seen on:
 *   Junos: spine1_qfx5200
 *   EVO: (none)
 * Count:
 *   spine1_qfx5200 1
 *   total 1
 * Highlights:
 *   - The `global` group carries this node's loopback (design `/32` marked primary), the router-id and `chassis dump-on-panic`. Configuration groups are one fragment, so the group is reproduced whole after the approved lab-management exclusions.
 *   - Additional lo0 addresses (`127.x`, management `10.255.x`, ISO, IPv6) are kept as configured in the validated lab.
 * Pair with: none
 * Variables (example values from spine1_qfx5200):
 *   $LOOPBACK_MGMT_V4_PFX  e.g. 10.255.7.232/32
 *   $LOOPBACK_V4_PFX       e.g. 1.1.1.3/32
 *   $ISO_NET               e.g. 47.0005.80ff.f800.0000.0108.0001.0102.5500.7232.00
 *   $LOOPBACK_V6_PFX       e.g. abcd::10:255:7:232/128
 *   $ROUTER_ID             e.g. 1.1.1.3
 */
groups {
    global {
        chassis {
            dump-on-panic;
        }
        interfaces {
            lo0 {
                unit 0 {
                    family inet {
                        address $LOOPBACK_MGMT_V4_PFX;
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
        routing-options {
            router-id $ROUTER_ID;
        }
    }
}
```

## junos/groups/gr-global-spine2.conf

```
/*
 * Topic: Global configuration group: loopback and identity for spine2
 * Seen on:
 *   Junos: spine2_qfx5200
 *   EVO: (none)
 * Count:
 *   spine2_qfx5200 1
 *   total 1
 * Highlights:
 *   - The `global` group carries this node's loopback (design `/32` marked primary). Configuration groups are one fragment, so the group is reproduced whole after the approved lab-management exclusions.
 *   - Additional lo0 addresses (`127.x`, management `10.255.x`, ISO, IPv6) are kept as configured in the validated lab.
 * Pair with: none
 * Variables (example values from spine2_qfx5200):
 *   $LOOPBACK_V4_PFX  e.g. 1.1.1.4/32
 */
groups {
    global {
        interfaces {
            lo0 {
                unit 0 {
                    family inet {
                        address 127.0.0.1/32;
                        address $LOOPBACK_V4_PFX {
                            primary;
                        }
                    }
                }
            }
        }
    }
}
```

## junos/groups/gr-global-tor1.conf

```
/*
 * Topic: Global configuration group: loopback and identity for tor1
 * Seen on:
 *   Junos: tor1_ex4200-48t
 *   EVO: (none)
 * Count:
 *   tor1_ex4200-48t 1
 *   total 1
 * Highlights:
 *   - The `global` group carries this node's loopback; it has no design `/32`, only local addresses and `chassis dump-on-panic`. Configuration groups are one fragment, so the group is reproduced whole after the approved lab-management exclusions.
 *   - Additional lo0 addresses (`127.x`, management `10.255.x`, ISO, IPv6) are kept as configured in the validated lab.
 * Pair with: none
 * Variables (example values from tor1_ex4200-48t):
 *   $LOOPBACK_MGMT_V4_PFX  e.g. 10.255.152.18/32
 *   $ISO_NET               e.g. 47.0005.80ff.f800.0000.0108.0001.0102.5515.2018.00
 *   $LOOPBACK_V6_PFX       e.g. abcd::10:255:152:18/128
 */
groups {
    global {
        chassis {
            dump-on-panic;
        }
        interfaces {
            lo0 {
                unit 0 {
                    family inet {
                        address $LOOPBACK_MGMT_V4_PFX {
                            primary;
                        }
                        address 127.0.0.1/32;
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
    }
}
```

## junos/groups/gr-global-tor2.conf

```
/*
 * Topic: Global configuration group: loopback and identity for tor2
 * Seen on:
 *   Junos: tor2_ex4200-48t
 *   EVO: (none)
 * Count:
 *   tor2_ex4200-48t 1
 *   total 1
 * Highlights:
 *   - The `global` group carries this node's loopback; it has no design `/32`, only local addresses. Configuration groups are one fragment, so the group is reproduced whole after the approved lab-management exclusions.
 *   - Additional lo0 addresses (`127.x`, management `10.255.x`, ISO, IPv6) are kept as configured in the validated lab.
 * Pair with: none
 * Variables: none
 */
groups {
    global {
        interfaces {
            lo0 {
                unit 0 {
                    family inet {
                        address 127.0.0.1/32;
                    }
                }
            }
        }
    }
}
```

## junos/groups/gr-global-wan-edge1.conf

```
/*
 * Topic: Global configuration group: loopback and identity for wan-edge1
 * Seen on:
 *   Junos: wan-edge1_mx204
 *   EVO: (none)
 * Count:
 *   wan-edge1_mx204 1
 *   total 1
 * Highlights:
 *   - The `global` group carries this node's loopback (design `/32` marked primary and preferred), the router-id and `chassis dump-on-panic`. Configuration groups are one fragment, so the group is reproduced whole after the approved lab-management exclusions.
 *   - Additional lo0 addresses (`127.x`, management `10.255.x`, ISO, IPv6) are kept as configured in the validated lab.
 * Pair with: none
 * Variables (example values from wan-edge1_mx204):
 *   $LOOPBACK_MGMT_V4_PFX  e.g. 10.255.19.248/32
 *   $LOOPBACK_V4_PFX       e.g. 1.1.1.10/32
 *   $ISO_NET               e.g. 47.0005.80ff.f800.0000.0108.0001.0102.5501.9248.00
 *   $LOOPBACK_V6_PFX       e.g. abcd::10:255:19:248/128
 *   $ROUTER_ID             e.g. 1.1.1.10
 */
groups {
    global {
        chassis {
            dump-on-panic;
        }
        interfaces {
            lo0 {
                unit 0 {
                    family inet {
                        address $LOOPBACK_MGMT_V4_PFX {
                            primary;
                        }
                        address 127.0.0.1/32;
                        address $LOOPBACK_V4_PFX {
                            primary;
                            preferred;
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
        routing-options {
            router-id $ROUTER_ID;
        }
    }
}
```

## junos/groups/gr-global-wan-edge2.conf

```
/*
 * Topic: Global configuration group: loopback and identity for wan-edge2
 * Seen on:
 *   Junos: wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   wan-edge2_acx5448-m 1
 *   total 1
 * Highlights:
 *   - The `global` group carries this node's loopback (design `/32` marked primary and preferred), the router-id and `chassis dump-on-panic`. Configuration groups are one fragment, so the group is reproduced whole after the approved lab-management exclusions.
 *   - Additional lo0 addresses (`127.x`, management `10.255.x`, ISO, IPv6) are kept as configured in the validated lab.
 * Pair with: none
 * Variables (example values from wan-edge2_acx5448-m):
 *   $LOOPBACK_MGMT_V4_PFX  e.g. 10.255.152.33/32
 *   $LOOPBACK_V4_PFX       e.g. 1.1.1.9/32
 *   $ISO_NET               e.g. 47.0005.80ff.f800.0000.0108.0001.0102.5515.2033.00
 *   $LOOPBACK_V6_PFX       e.g. abcd::10:255:152:33/128
 *   $ROUTER_ID             e.g. 1.1.1.9
 */
groups {
    global {
        chassis {
            dump-on-panic;
        }
        interfaces {
            lo0 {
                unit 0 {
                    family inet {
                        address 127.0.0.1/32;
                        address $LOOPBACK_MGMT_V4_PFX {
                            primary;
                        }
                        address $LOOPBACK_V4_PFX {
                            primary;
                            preferred;
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
        routing-options {
            router-id $ROUTER_ID;
        }
    }
}
```

## junos/groups/gr-member0-empty.conf

```
/*
 * Topic: Empty member0 configuration group named by apply-groups
 * Seen on:
 *   Junos: spine1_qfx5200 tor1_ex4200-48t
 *   EVO: (none)
 * Count:
 *   spine1_qfx5200 1
 *   tor1_ex4200-48t 1
 *   total 2
 * Highlights:
 *   - Keeps the `member0` group that `apply-groups` names. Its only content (a host name) is excluded as lab management.
 * Pair with: none
 * Variables: none
 */
groups {
    member0 {
    }
}
```

## junos/groups/gr-member0-loopback.conf

```
/*
 * Topic: Virtual-chassis member0 group with a management loopback address
 * Seen on:
 *   Junos: leaf1_qfx5120-48t leaf2_qfx5120-48t spine2_qfx5200 tor2_ex4200-48t
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48t 1
 *   leaf2_qfx5120-48t 1
 *   spine2_qfx5200 1
 *   tor2_ex4200-48t 1
 *   total 4
 * Highlights:
 *   - `member0` applies only on virtual-chassis member 0; here it adds a management `10.255.x` address to lo0 unit 0.
 * Pair with: none
 * Variables (example values from leaf1_qfx5120-48t):
 *   $LOOPBACK_MGMT_V4_PFX  e.g. 10.255.152.8/32
 */
groups {
    member0 {
        interfaces {
            lo0 {
                unit 0 {
                    family inet {
                        address $LOOPBACK_MGMT_V4_PFX;
                    }
                }
            }
        }
    }
}
```

## junos/groups/gr-re0-empty.conf

```
/*
 * Topic: Empty re0 configuration group named by apply-groups
 * Seen on:
 *   Junos: dc-edge1_mx480 dc-edge2_mx10003 wan-edge1_mx204
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 1
 *   dc-edge2_mx10003 1
 *   wan-edge1_mx204 1
 *   total 3
 * Highlights:
 *   - Keeps the `re0` group that `apply-groups` names. Its only content (a host name) is excluded as lab management.
 * Pair with: none
 * Variables: none
 */
groups {
    re0 {
    }
}
```

## junos/groups/gr-re0-loopback.conf

```
/*
 * Topic: Routing-engine re0 group with a management loopback address
 * Seen on:
 *   Junos: wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   wan-edge2_acx5448-m 1
 *   total 1
 * Highlights:
 *   - `re0` applies only on routing engine 0; here it adds a management `10.255.x` address to lo0 unit 0. Its host name is excluded as lab management.
 * Pair with: none
 * Variables (example values from wan-edge2_acx5448-m):
 *   $LOOPBACK_MGMT_V4_PFX  e.g. 10.255.152.34/32
 */
groups {
    re0 {
        interfaces {
            lo0 {
                unit 0 {
                    family inet {
                        address $LOOPBACK_MGMT_V4_PFX;
                    }
                }
            }
        }
    }
}
```

## junos/groups/gr-re1-empty-block.conf

```
/*
 * Topic: Emptied re1 configuration group named by apply-groups
 * Seen on:
 *   Junos: dc-edge1_mx480 dc-edge2_mx10003
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 1
 *   dc-edge2_mx10003 1
 *   total 2
 * Highlights:
 *   - Keeps the `re1` group that `apply-groups` names; its only content (a host name) is excluded as lab management.
 * Pair with: none
 * Variables: none
 */
groups {
    re1 {
    }
}
```

## junos/groups/gr-re1-empty.conf

```
/*
 * Topic: Empty re1 configuration group named by apply-groups
 * Seen on:
 *   Junos: leaf1_qfx5120-48t leaf2_qfx5120-48t spine2_qfx5200 tor1_ex4200-48t tor2_ex4200-48t wan-edge1_mx204 wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48t 1
 *   leaf2_qfx5120-48t 1
 *   spine2_qfx5200 1
 *   tor1_ex4200-48t 1
 *   tor2_ex4200-48t 1
 *   wan-edge1_mx204 1
 *   wan-edge2_acx5448-m 1
 *   total 7
 * Highlights:
 *   - Keeps the `re1` group that `apply-groups` names. Declared empty in source.
 * Pair with: none
 * Variables: none
 */
groups {
    re1;
}
```

## junos/interfaces/ifd-ae-ethernet-bridge-lacp-esi.conf

```
/*
 * Topic: Port-based ESI-LAG toward the top-of-rack switch with ethernet-bridge encapsulation (DC leaf, bundle service)
 * Seen on:
 *   Junos: leaf1_qfx5120-48t leaf2_qfx5120-48t
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48t 16
 *   leaf2_qfx5120-48t 16
 *   total 32
 * Highlights:
 *   - `encapsulation ethernet-bridge` with a single `unit 0` makes the whole bundle one Layer 2 attachment, which the VLAN-bundle MAC-VRF owns as `aeN.0`.
 *   - All-active ESI and shared LACP `system-id` on both leaves present the bundle as one multihomed segment.
 * Pair with: none
 * Variables (example values from leaf1_qfx5120-48t / ae16):
 *   $IFD          e.g. ae16
 *   $ESI          e.g. 00:17:17:17:17:17:17:17:17:17
 *   $LACP_SYS_ID  e.g. 00:00:00:17:17:17
 */
interfaces {
    $IFD {
        encapsulation ethernet-bridge;
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
        unit 0;
    }
}
```

## junos/interfaces/ifd-ae-flexible-lacp-esi-df-preference.conf

```
/*
 * Topic: ESI-LAG toward the top-of-rack switch with preference-based designated-forwarder election (DC leaf)
 * Seen on:
 *   Junos: leaf1_qfx5120-48t leaf2_qfx5120-48t
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48t 1
 *   leaf2_qfx5120-48t 1
 *   total 2
 * Highlights:
 *   - `df-election-type preference` replaces the default modulus-based designated-forwarder election on this segment with an explicit preference; leaf1 configures 100 and leaf2 50, so leaf1 is the designated forwarder for BUM traffic while both links stay active.
 * Pair with: none
 * Variables (example values from leaf1_qfx5120-48t / ae0):
 *   $IFD            e.g. ae0
 *   $ESI            e.g. 00:01:01:01:01:01:01:01:01:01
 *   $LACP_SYS_ID    e.g. 00:00:00:01:01:01
 *   $DF_PREFERENCE  e.g. 100
 */
interfaces {
    $IFD {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        esi {
            $ESI;
            all-active;
            df-election-type {
                preference {
                    value $DF_PREFERENCE;
                }
            }
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

## junos/interfaces/ifd-ae-flexible-lacp-esi.conf

```
/*
 * Topic: ESI-LAG toward the top-of-rack switch, LACP active with per-VLAN attachment units (DC leaf)
 * Seen on:
 *   Junos: leaf1_qfx5120-48t leaf2_qfx5120-48t
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48t 30
 *   leaf2_qfx5120-48t 30
 *   total 60
 * Highlights:
 *   - The aggregated interface carries the EVPN Ethernet-segment identity: both leaves configure the same `esi` with `all-active`, so the top-of-rack switch sees one LAG while the fabric sees a multihomed segment.
 *   - `system-id` under LACP is identical on both leaves for the same bundle, which is what lets the downstream switch bundle links to two different leaves.
 *   - `flexible-vlan-tagging` / `flexible-ethernet-services` allow one vlan-bridge unit per customer VLAN on the bundle.
 * Pair with: none
 * Variables (example values from leaf1_qfx5120-48t / ae1):
 *   $IFD          e.g. ae1
 *   $ESI          e.g. 00:02:02:02:02:02:02:02:02:02
 *   $LACP_SYS_ID  e.g. 00:00:00:02:02:02
 */
interfaces {
    $IFD {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
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

## junos/interfaces/ifd-ae-flexible-lacp-fast-esi-min-links.conf

```
/*
 * Topic: ESI-LAG toward the top-of-rack switch, LACP active with fast periodic timers and minimum-links (DC leaf)
 * Seen on:
 *   Junos: leaf1_qfx5120-48t leaf2_qfx5120-48t
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48t 1
 *   leaf2_qfx5120-48t 1
 *   total 2
 * Highlights:
 *   - The one ESI-LAG per leaf that runs `periodic fast` LACP (1-second PDUs) and `minimum-links 1`, which keeps the bundle up as long as one member link is active.
 * Pair with: none
 * Variables (example values from leaf1_qfx5120-48t / ae33):
 *   $IFD          e.g. ae33
 *   $ESI          e.g. 00:33:33:33:33:33:33:33:33:33
 *   $LACP_SYS_ID  e.g. 00:00:00:33:33:33
 */
interfaces {
    $IFD {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        esi {
            $ESI;
            all-active;
        }
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

## junos/interfaces/ifd-ae-lacp-fast-trunk-vlan.conf

```
/*
 * Topic: Server-facing LAG trunk carrying one named VLAN set, LACP active with fast periodic timers (top-of-rack switch)
 * Seen on:
 *   Junos: tor2_ex4200-48t
 *   EVO: (none)
 * Count:
 *   tor2_ex4200-48t 15
 *   total 15
 * Highlights:
 *   - Same top-of-rack LAG trunk form with `periodic fast` LACP, matching the fast-LACP ESI-LAGs on the leaf side.
 * Pair with: none
 * Variables (example values from tor2_ex4200-48t / ae33):
 *   $IFD        e.g. ae33
 *   $VLAN_NAME  e.g. EP-TYPE-2-VLAN-1402-1488
 */
interfaces {
    $IFD {
        aggregated-ether-options {
            lacp {
                active;
                periodic fast;
            }
        }
        unit 0 {
            family ethernet-switching {
                port-mode trunk;
                vlan {
                    members $VLAN_NAME;
                }
            }
        }
    }
}
```

## junos/interfaces/ifd-ae-lacp-trunk-vlan.conf

```
/*
 * Topic: Server-facing LAG trunk carrying one named VLAN set, LACP active (top-of-rack switch)
 * Seen on:
 *   Junos: tor1_ex4200-48t tor2_ex4200-48t
 *   EVO: (none)
 * Count:
 *   tor1_ex4200-48t 23
 *   tor2_ex4200-48t 8
 *   total 31
 * Highlights:
 *   - The top-of-rack side of each leaf ESI-LAG: a plain LACP bundle whose single trunk unit admits one named VLAN (or VLAN range) definition.
 *   - The switch has no EVPN awareness; the two leaves present the same LACP system-id, so from here the bundle looks like one upstream device.
 * Pair with: none
 * Variables (example values from tor1_ex4200-48t / ae1):
 *   $IFD        e.g. ae1
 *   $VLAN_NAME  e.g. EP-TYPE-2-VLAN-42-81
 */
interfaces {
    $IFD {
        aggregated-ether-options {
            lacp {
                active;
            }
        }
        unit 0 {
            family ethernet-switching {
                port-mode trunk;
                vlan {
                    members $VLAN_NAME;
                }
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
 *   Junos: dc-edge1_mx480 dc-edge2_mx10003
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 2
 *   dc-edge2_mx10003 3
 *   total 5
 * Highlights:
 *   - Names the far end of a core link; the routed unit beneath it is its own fragment (`ifl-core-inet-mpls`).
 * Pair with: none
 * Variables (example values from dc-edge1_mx480 / et-1/1/1):
 *   $IFD        e.g. et-1/1/1
 *   $CORE_DESC  e.g. "To dc-edge2"
 */
interfaces {
    $IFD {
        description $CORE_DESC;
    }
}
```

## junos/interfaces/ifd-flexible-ethernet-services-description.conf

```
/*
 * Topic: Physical port with a description prepared for per-unit Layer 2 attachments (flexible VLAN tagging, flexible Ethernet services)
 * Seen on:
 *   Junos: wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   wan-edge2_acx5448-m 1
 *   total 1
 * Highlights:
 *   - Same flexible-ethernet-services port form as the MX WAN edge, carrying a `description` of the far end.
 * Pair with: none
 * Variables (example values from wan-edge2_acx5448-m / xe-0/0/2):
 *   $IFD        e.g. xe-0/0/2
 *   $CORE_DESC  e.g. "To l2l3-edge xe-2/1/0"
 */
interfaces {
    $IFD {
        description $CORE_DESC;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
    }
}
```

## junos/interfaces/ifd-flexible-ethernet-services.conf

```
/*
 * Topic: Physical port prepared for per-unit Layer 2 attachments (flexible VLAN tagging, flexible Ethernet services)
 * Seen on:
 *   Junos: dc-edge1_mx480 dc-edge2_mx10003 wan-edge1_mx204
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 1
 *   dc-edge2_mx10003 1
 *   wan-edge1_mx204 2
 *   total 4
 * Highlights:
 *   - `flexible-vlan-tagging` with `encapsulation flexible-ethernet-services` lets each unit on the port choose its own encapsulation, so routed, vlan-bridge and trunk units can share one physical interface.
 *   - On wan-edge1 one such port carries every service attachment unit; on the gateways the port carries the tagged routed test units.
 * Pair with: none
 * Variables (example values from wan-edge1_mx204 / xe-0/1/4):
 *   $IFD  e.g. xe-0/1/4
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
 *   Junos: leaf1_qfx5120-48t leaf2_qfx5120-48t tor1_ex4200-48t tor2_ex4200-48t
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48t 47
 *   leaf2_qfx5120-48t 46
 *   tor1_ex4200-48t 48
 *   tor2_ex4200-48t 48
 *   total 189
 * Highlights:
 *   - `ether-options 802.3ad` assigns the port to its bundle; every Layer 2 setting lives on the `ae` interface, not on the member.
 * Pair with: none
 * Variables (example values from leaf1_qfx5120-48t / xe-0/0/0):
 *   $IFD        e.g. xe-0/0/0
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

## junos/interfaces/ifl-bridge-trunk-vlan-list.conf

```
/*
 * Topic: Trunk attachment-circuit unit with family bridge and a VLAN list (VLAN-aware service, MX)
 * Seen on:
 *   Junos: wan-edge1_mx204
 *   EVO: (none)
 * Count:
 *   wan-edge1_mx204 36
 *   total 36
 * Highlights:
 *   - `family bridge interface-mode trunk` with `vlan-id-list` admits a set of customer VLANs on one unit for a VLAN-aware (virtual-switch) EVPN instance, which then maps each VLAN to its own bridge domain.
 * Pair with: none
 * Variables (example values from wan-edge1_mx204 / xe-0/1/4.2):
 *   $IFD        e.g. xe-0/1/4
 *   $UNIT       e.g. 2
 *   $VLAN_LIST  e.g. 2-21
 */
interfaces {
    $IFD {
        unit $UNIT {
            family bridge {
                interface-mode trunk;
                vlan-id-list $VLAN_LIST;
            }
        }
    }
}
```

## junos/interfaces/ifl-core-inet-mpls.conf

```
/*
 * Topic: Core-facing point-to-point link with IPv4 and MPLS families
 * Seen on:
 *   Junos: dc-edge1_mx480 dc-edge2_mx10003 wan-edge1_mx204 wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 3
 *   dc-edge2_mx10003 3
 *   wan-edge1_mx204 2
 *   wan-edge2_acx5448-m 2
 *   total 10
 * Highlights:
 *   - Untagged core link on the MPLS WAN side: `family inet` with a /30 and `family mpls` so LDP and OSPF can run on it.
 * Pair with: none
 * Variables (example values from wan-edge1_mx204 / et-0/0/0):
 *   $CORE_PHYS     e.g. et-0/0/0
 *   $CORE_V4_ADDR  e.g. 10.0.16.1/30
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

## junos/interfaces/ifl-core-inet.conf

```
/*
 * Topic: Fabric underlay point-to-point link with IPv4 only
 * Seen on:
 *   Junos: dc-edge1_mx480 dc-edge2_mx10003 leaf1_qfx5120-48t leaf2_qfx5120-48t spine1_qfx5200 spine2_qfx5200
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 2
 *   dc-edge2_mx10003 3
 *   leaf1_qfx5120-48t 2
 *   leaf2_qfx5120-48t 2
 *   spine1_qfx5200 5
 *   spine2_qfx5200 5
 *   total 19
 * Highlights:
 *   - IP-only /30 link of the EVPN-VXLAN fabric underlay (leaf-spine and spine-gateway); eBGP runs over it and no MPLS family is needed.
 * Pair with: none
 * Variables (example values from leaf1_qfx5120-48t / xe-0/0/50:0):
 *   $CORE_PHYS     e.g. xe-0/0/50:0
 *   $CORE_V4_ADDR  e.g. 10.0.1.2/30
 */
interfaces {
    $CORE_PHYS {
        unit 0 {
            family inet {
                address $CORE_V4_ADDR;
            }
        }
    }
}
```

## junos/interfaces/ifl-irb-virtual-gateway-no-accept-data.conf

```
/*
 * Topic: IRB unit with EVPN anycast virtual gateway without accept-data
 * Seen on:
 *   Junos: leaf1_qfx5120-48t wan-edge1_mx204
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48t 1
 *   wan-edge1_mx204 20
 *   total 21
 * Highlights:
 *   - Anycast-gateway IRB that omits `virtual-gateway-accept-data`; the PE forwards for the shared gateway address but does not answer traffic addressed to it.
 * Pair with: none
 * Variables (example values from wan-edge1_mx204 / irb.2):
 *   $UNIT      e.g. 2
 *   $IRB_ADDR  e.g. 10.0.101.10/24
 *   $VGA       e.g. 10.0.101.254
 *   $VG_MAC    e.g. 00:00:5e:00:00:04
 */
interfaces {
    irb {
        unit $UNIT {
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

## junos/interfaces/ifl-irb-virtual-gateway-preferred.conf

```
/*
 * Topic: IRB unit with EVPN anycast virtual gateway, accept-data and preferred source address
 * Seen on:
 *   Junos: dc-edge1_mx480 dc-edge2_mx10003 leaf1_qfx5120-48t leaf2_qfx5120-48t wan-edge1_mx204
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 51
 *   dc-edge2_mx10003 2
 *   leaf1_qfx5120-48t 50
 *   leaf2_qfx5120-48t 51
 *   wan-edge1_mx204 51
 *   total 205
 * Highlights:
 *   - Same anycast-gateway IRB as the base form, with `preferred` marking this address as the source the PE uses for locally originated traffic on the subnet.
 *   - Deployed on the 50 IRBs of the ERB (edge-routed bridging) tenant that spans leaves, gateways and the WAN edge.
 * Pair with: none
 * Variables (example values from dc-edge1_mx480 / irb.3501):
 *   $UNIT      e.g. 3501
 *   $IRB_ADDR  e.g. 59.0.2.3/24
 *   $VGA       e.g. 59.0.2.254
 *   $VG_MAC    e.g. 00:00:5e:00:00:04
 */
interfaces {
    irb {
        unit $UNIT {
            virtual-gateway-accept-data;
            family inet {
                address $IRB_ADDR {
                    preferred;
                    virtual-gateway-address $VGA;
                }
            }
            virtual-gateway-v4-mac $VG_MAC;
        }
    }
}
```

## junos/interfaces/ifl-irb-virtual-gateway-second-address.conf

```
/*
 * Topic: IRB unit with EVPN anycast virtual gateway plus a second, non-gateway address
 * Seen on:
 *   Junos: dc-edge2_mx10003
 *   EVO: (none)
 * Count:
 *   dc-edge2_mx10003 20
 *   total 20
 * Highlights:
 *   - Two addresses on one IRB unit: the first is a plain interface address, the second carries the anycast `virtual-gateway-address`.
 * Pair with: none
 * Variables (example values from dc-edge2_mx10003 / irb.422):
 *   $UNIT          e.g. 422
 *   $IRB_ADDR_2    e.g. 10.2.81.1/24
 *   $IRB_ADDR      e.g. 10.2.81.2/24
 *   $VGA           e.g. 10.2.81.254
 *   $VG_MAC        e.g. 00:00:5e:00:00:04
 */
interfaces {
    irb {
        unit $UNIT {
            virtual-gateway-accept-data;
            family inet {
                address $IRB_ADDR_2;
                address $IRB_ADDR {
                    virtual-gateway-address $VGA;
                }
            }
            virtual-gateway-v4-mac $VG_MAC;
        }
    }
}
```

## junos/interfaces/ifl-irb-virtual-gateway.conf

```
/*
 * Topic: IRB unit with EVPN anycast virtual gateway and accept-data
 * Seen on:
 *   Junos: dc-edge1_mx480 dc-edge2_mx10003 wan-edge1_mx204 wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 2140
 *   dc-edge2_mx10003 2130
 *   wan-edge1_mx204 1380
 *   wan-edge2_acx5448-m 751
 *   total 6401
 * Highlights:
 *   - Each PE owns a unique IRB address while `virtual-gateway-address` and `virtual-gateway-v4-mac` are the same on every PE, so hosts see one anycast gateway wherever they attach.
 *   - `virtual-gateway-accept-data` lets the PE answer traffic (ping, ARP) sent to the shared gateway address rather than only forwarding it.
 * Pair with: none
 * Variables (example values from dc-edge1_mx480 / irb.2):
 *   $UNIT      e.g. 2
 *   $IRB_ADDR  e.g. 10.0.101.1/24
 *   $VGA       e.g. 10.0.101.254
 *   $VG_MAC    e.g. 00:00:5e:00:00:04
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
 * Topic: Loopback unit with the node's IPv4 /32
 * Seen on:
 *   Junos: dc-edge2_mx10003 spine1_qfx5200 spine2_qfx5200
 *   EVO: (none)
 * Count:
 *   dc-edge2_mx10003 1
 *   spine1_qfx5200 1
 *   spine2_qfx5200 1
 *   total 3
 * Highlights:
 *   - Top-level `lo0.0` carrying the loopback used as router-id, BGP local-address and (on the gateways) VTEP source; on the other devices the same address is configured inside the `global` configuration group instead.
 * Pair with: none
 * Variables (example values from spine1_qfx5200 / lo0):
 *   $LOOPBACK_V4_PFX  e.g. 1.1.1.3/32
 */
interfaces {
    lo0 {
        unit 0 {
            family inet {
                address $LOOPBACK_V4_PFX;
            }
        }
    }
}
```

## junos/interfaces/ifl-vlan-bridge-ethernet-switching.conf

```
/*
 * Topic: Single-VLAN attachment-circuit unit with vlan-bridge encapsulation and family ethernet-switching
 * Seen on:
 *   Junos: leaf1_qfx5120-48t leaf2_qfx5120-48t
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48t 86
 *   leaf2_qfx5120-48t 87
 *   total 173
 * Highlights:
 *   - Same as the plain vlan-bridge unit but with `family ethernet-switching` added; deployed on the units of one ESI-LAG per leaf.
 * Pair with: none
 * Variables (example values from leaf1_qfx5120-48t / ae36.1664):
 *   $IFD   e.g. ae36
 *   $UNIT  e.g. 1664
 *   $VLAN  e.g. 1664
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-bridge;
            vlan-id $VLAN;
            family ethernet-switching;
        }
    }
}
```

## junos/interfaces/ifl-vlan-bridge-vlan-list-family-bridge.conf

```
/*
 * Topic: VLAN-range attachment-circuit unit with vlan-bridge encapsulation and family bridge (bundle service, MX)
 * Seen on:
 *   Junos: wan-edge1_mx204
 *   EVO: (none)
 * Count:
 *   wan-edge1_mx204 9
 *   total 9
 * Highlights:
 *   - MX form of the VLAN-range attachment: `vlan-id-list` admits the customer range and `family bridge` is declared explicitly on the unit.
 * Pair with: none
 * Variables (example values from wan-edge1_mx204 / xe-0/1/4.701):
 *   $IFD        e.g. xe-0/1/4
 *   $UNIT       e.g. 701
 *   $VLAN_LIST  e.g. 701-780
 */
interfaces {
    $IFD {
        unit $UNIT {
            encapsulation vlan-bridge;
            vlan-id-list $VLAN_LIST;
            family bridge;
        }
    }
}
```

## junos/interfaces/ifl-vlan-bridge-vlan-list.conf

```
/*
 * Topic: VLAN-range attachment-circuit unit with vlan-bridge encapsulation (bundle service)
 * Seen on:
 *   Junos: wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   wan-edge2_acx5448-m 7
 *   total 7
 * Highlights:
 *   - `vlan-id-list` admits a whole customer VLAN range on one unit, which a VLAN-bundle EVPN instance then carries under a single label.
 * Pair with: none
 * Variables (example values from wan-edge2_acx5448-m / xe-0/0/2.2103):
 *   $IFD        e.g. xe-0/0/2
 *   $UNIT       e.g. 2103
 *   $VLAN_LIST  e.g. 2103-2187
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

## junos/interfaces/ifl-vlan-bridge.conf

```
/*
 * Topic: Single-VLAN attachment-circuit unit with vlan-bridge encapsulation
 * Seen on:
 *   Junos: leaf1_qfx5120-48t leaf2_qfx5120-48t wan-edge1_mx204 wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48t 1365
 *   leaf2_qfx5120-48t 1364
 *   wan-edge1_mx204 701
 *   wan-edge2_acx5448-m 750
 *   total 4180
 * Highlights:
 *   - One unit per customer VLAN; `encapsulation vlan-bridge` makes the unit a Layer 2 attachment that a VLAN-based EVPN or MAC-VRF instance can own.
 *   - On the leaves the parent is the ESI-LAG toward the top-of-rack switch; on the WAN edges it is the 10G port toward the Layer 2/3 edge.
 * Pair with: none
 * Variables (example values from leaf1_qfx5120-48t / ae33.1402):
 *   $IFD   e.g. ae33
 *   $UNIT  e.g. 1402
 *   $VLAN  e.g. 1402
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

## junos/interfaces/ifl-vlan-inet.conf

```
/*
 * Topic: Tagged routed unit with an IPv4 address (VLAN sub-interface)
 * Seen on:
 *   Junos: dc-edge1_mx480 dc-edge2_mx10003
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 5
 *   dc-edge2_mx10003 5
 *   total 10
 * Highlights:
 *   - Five tagged Layer 3 sub-interfaces per gateway on the 10G test port; each carries one of the /24 subnets the underlay eBGP group admits with `allow` and that OSPF area 0 includes.
 * Pair with: none
 * Variables (example values from dc-edge1_mx480 / xe-5/3/7.3901):
 *   $IFD          e.g. xe-5/3/7
 *   $UNIT         e.g. 3901
 *   $VLAN         e.g. 3901
 *   $AC_ADDR_V4   e.g. 101.1.1.1/24
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

## junos/policy-options/policy-statement/per-packet-load-balance.conf

```
/*
 * Topic: Per-packet (per-flow) load-balancing policy
 * Seen on:
 *   Junos: dc-edge1_mx480 dc-edge2_mx10003 leaf1_qfx5120-48t leaf2_qfx5120-48t spine1_qfx5200 spine2_qfx5200 wan-edge1_mx204 wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 1
 *   dc-edge2_mx10003 1
 *   leaf1_qfx5120-48t 1
 *   leaf2_qfx5120-48t 1
 *   spine1_qfx5200 1
 *   spine2_qfx5200 1
 *   wan-edge1_mx204 1
 *   wan-edge2_acx5448-m 1
 *   total 8
 * Highlights:
 *   - Applied as `forwarding-table export`, this installs all equal-cost next hops so ECMP is used across the underlay and MPLS transport.
 * Pair with: none
 * Variables (example values from dc-edge1_mx480):
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

## junos/policy-options/policy-statement/ps-export-loopback.conf

```
/*
 * Topic: Export policy advertising directly connected /32 loopbacks
 * Seen on:
 *   Junos: dc-edge1_mx480 dc-edge2_mx10003 leaf1_qfx5120-48t leaf2_qfx5120-48t spine1_qfx5200 spine2_qfx5200
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 1
 *   dc-edge2_mx10003 1
 *   leaf1_qfx5120-48t 1
 *   leaf2_qfx5120-48t 1
 *   spine1_qfx5200 1
 *   spine2_qfx5200 1
 *   total 6
 * Highlights:
 *   - Used as the eBGP underlay export on every fabric node so each device's loopback is reachable for the VXLAN overlay and VTEP tunnels; matches only direct /32 IPv4 routes.
 * Pair with: none
 * Variables (example values from dc-edge1_mx480):
 *   $POLICY_NAME  e.g. lo0
 */
policy-options {
    policy-statement $POLICY_NAME {
        from {
            family inet;
            protocol direct;
            route-filter 0.0.0.0/0 prefix-length-range /32-/32;
        }
        then accept;
    }
}
```

## junos/policy-options/policy-statement/ps-export-ospf-area0.conf

```
/*
 * Topic: Export policy redistributing OSPF area 0 routes
 * Seen on:
 *   Junos: dc-edge1_mx480 dc-edge2_mx10003
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 1
 *   dc-edge2_mx10003 1
 *   total 2
 * Highlights:
 *   - Second export policy on the gateway underlay eBGP group: leaks the WAN-side OSPF area 0 routes (WAN PE loopbacks and core links) into the fabric underlay so leaves can reach the EVPN-MPLS PEs.
 * Pair with: none
 * Variables (example values from dc-edge1_mx480):
 *   $POLICY_NAME  e.g. policy_ospf_bgp
 */
policy-options {
    policy-statement $POLICY_NAME {
        term advertise {
            from {
                protocol ospf;
                area 0.0.0.0;
            }
            then accept;
        }
    }
}
```

## junos/protocols/bgp-dc-edge1.conf

```
/*
 * Topic: Complete deployed BGP form for dc-edge1_mx480
 * Seen on:
 *   Junos: dc-edge1_mx480
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 1
 *   total 1
 * Variant group: ewan-bgp-overlay
 *   Provides: evpn
 * Highlights:
 *   - Three BGP groups on the gateway: `EVPN-MPLS-IBGP` peers directly with both WAN-edge PEs for the EVPN-MPLS side of the interconnect (no route reflector on this plane; the two gateways do not peer with each other here).
 *   - `OVERLAY_VXLAN` makes the gateway the route reflector (`cluster 11.11.11.11`) for the fabric EVPN-VXLAN overlay, with the leaves and the other gateway as clients and 350 ms x3 BFD on the sessions.
 *   - `underlay` is the eBGP fabric underlay toward the spines; it exports the loopback and the OSPF-learned routes, and `allow` admits dynamic peers from the tagged test subnets.
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-export-loopback.conf
 *  - junos/policy-options/policy-statement/ps-export-ospf-area0.conf
 * Variables: none
 */
protocols {
    bgp {
        group EVPN-MPLS-IBGP {
            type internal;
            local-address 1.1.1.5;
            family evpn {
                signaling;
            }
            multipath;
            neighbor 1.1.1.10 {
                description WAN-EDGE1;
            }
            neighbor 1.1.1.9 {
                description WAN-EDGE2;
            }
        }
        group OVERLAY_VXLAN {
            type internal;
            local-address 1.1.1.5;
            family evpn {
                signaling;
            }
            cluster 11.11.11.11;
            multipath;
            bfd-liveness-detection {
                minimum-interval 350;
                multiplier 3;
            }
            neighbor 1.1.1.1;
            neighbor 1.1.1.6;
            neighbor 1.1.1.2;
        }
        group underlay {
            type external;
            export [ lo0 policy_ospf_bgp ];
            peer-as 65001;
            local-as 65003;
            multipath {
                multiple-as;
            }
            allow [ 101.1.1.0/24 102.1.1.0/24 103.1.1.0/24 104.1.1.0/24 105.1.1.0/24 ];
            neighbor 10.0.6.2 {
                description spine1;
                peer-as 65002;
            }
            neighbor 10.0.8.2 {
                description spine2;
                peer-as 65002;
            }
        }
    }
}
```

## junos/protocols/bgp-dc-edge2.conf

```
/*
 * Topic: Complete deployed BGP form for dc-edge2_mx10003
 * Seen on:
 *   Junos: dc-edge2_mx10003
 *   EVO: (none)
 * Count:
 *   dc-edge2_mx10003 1
 *   total 1
 * Variant group: ewan-bgp-overlay
 *   Provides: evpn
 * Highlights:
 *   - Same three-group form as dc-edge1 with this gateway's own loopback, `cluster 12.12.12.12` and its own fabric-underlay neighbours and `allow` subnets.
 *   - Each gateway is an independent route reflector for the VXLAN overlay; the leaves peer with both.
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-export-loopback.conf
 *  - junos/policy-options/policy-statement/ps-export-ospf-area0.conf
 * Variables: none
 */
protocols {
    bgp {
        group underlay {
            type external;
            export [ lo0 policy_ospf_bgp ];
            peer-as 65001;
            local-as 65003;
            multipath {
                multiple-as;
            }
            allow [ 202.1.1.0/24 203.1.1.0/24 204.1.1.0/24 205.1.1.0/24 206.1.1.0/24 ];
            neighbor 10.0.7.2 {
                description spine1;
                peer-as 65002;
            }
            neighbor 10.0.9.2 {
                description spine2;
                peer-as 65002;
            }
        }
        group OVERLAY_VXLAN {
            type internal;
            local-address 1.1.1.6;
            family evpn {
                signaling;
            }
            cluster 12.12.12.12;
            multipath;
            bfd-liveness-detection {
                minimum-interval 350;
                multiplier 3;
            }
            neighbor 1.1.1.1;
            neighbor 1.1.1.2;
            neighbor 1.1.1.5;
        }
        group EVPN-MPLS-IBGP {
            type internal;
            local-address 1.1.1.6;
            family evpn {
                signaling;
            }
            multipath;
            neighbor 1.1.1.10 {
                description WAN-EDGE1;
            }
            neighbor 1.1.1.9 {
                description WAN-EDGE2;
            }
        }
    }
}
```

## junos/protocols/bgp-leaf1.conf

```
/*
 * Topic: Complete deployed BGP form for leaf1_qfx5120-48t
 * Seen on:
 *   Junos: leaf1_qfx5120-48t
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48t 1
 *   total 1
 * Variant group: ewan-bgp-overlay
 *   Provides: evpn
 * Highlights:
 *   - Two groups on the leaf: eBGP `underlay-spine` toward both spines (export loopback, `multipath multiple-as`) and iBGP `OVERLAY_VXLAN` with `family evpn signaling` toward the two gateways acting as overlay route reflectors, with 350 ms x3 BFD.
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-export-loopback.conf
 * Variables: none
 */
protocols {
    bgp {
        group underlay-spine {
            type external;
            export lo0;
            local-as 65001;
            multipath {
                multiple-as;
            }
            neighbor 10.0.1.1 {
                description spine1;
                peer-as 65002;
            }
            neighbor 10.0.2.1 {
                description spine2;
                peer-as 65002;
            }
        }
        group OVERLAY_VXLAN {
            type internal;
            local-address 1.1.1.1;
            family evpn {
                signaling;
            }
            multipath;
            bfd-liveness-detection {
                minimum-interval 350;
                multiplier 3;
            }
            neighbor 1.1.1.5;
            neighbor 1.1.1.6;
        }
    }
}
```

## junos/protocols/bgp-leaf2.conf

```
/*
 * Topic: Complete deployed BGP form for leaf2_qfx5120-48t
 * Seen on:
 *   Junos: leaf2_qfx5120-48t
 *   EVO: (none)
 * Count:
 *   leaf2_qfx5120-48t 1
 *   total 1
 * Variant group: ewan-bgp-overlay
 *   Provides: evpn
 * Highlights:
 *   - Same two-group leaf form as leaf1 with this leaf's own loopback and underlay neighbour addresses.
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-export-loopback.conf
 * Variables: none
 */
protocols {
    bgp {
        group underlay-spine {
            type external;
            export lo0;
            local-as 65001;
            multipath {
                multiple-as;
            }
            neighbor 10.0.4.1 {
                description spine1;
                peer-as 65002;
            }
            neighbor 10.0.5.1 {
                description spine2;
                peer-as 65002;
            }
        }
        group OVERLAY_VXLAN {
            type internal;
            local-address 1.1.1.2;
            family evpn {
                signaling;
            }
            multipath;
            bfd-liveness-detection {
                minimum-interval 350;
                multiplier 3;
            }
            neighbor 1.1.1.5;
            neighbor 1.1.1.6;
        }
    }
}
```

## junos/protocols/bgp-spine1.conf

```
/*
 * Topic: Complete deployed BGP form for spine1_qfx5200
 * Seen on:
 *   Junos: spine1_qfx5200
 *   EVO: (none)
 * Count:
 *   spine1_qfx5200 1
 *   total 1
 * Highlights:
 *   - Pure underlay role: two eBGP groups, `underlay-dcwanedge` toward the gateways and `underlay-leaf` toward the leaves, both exporting the loopback with `multipath multiple-as`. The spine carries no EVPN address family.
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-export-loopback.conf
 * Variables: none
 */
protocols {
    bgp {
        group underlay-dcwanedge {
            type external;
            export lo0;
            local-as 65002;
            multipath {
                multiple-as;
            }
            neighbor 10.0.6.1 {
                description dcwanedge1;
                peer-as 65003;
            }
            neighbor 10.0.9.1 {
                description dcwanedge2;
                peer-as 65003;
            }
        }
        group underlay-leaf {
            type external;
            export lo0;
            local-as 65002;
            multipath {
                multiple-as;
            }
            neighbor 10.0.1.2 {
                description leaf1;
                peer-as 65001;
            }
            neighbor 10.0.4.2 {
                description leaf2;
                peer-as 65001;
            }
        }
    }
}
```

## junos/protocols/bgp-spine2.conf

```
/*
 * Topic: Complete deployed BGP form for spine2_qfx5200
 * Seen on:
 *   Junos: spine2_qfx5200
 *   EVO: (none)
 * Count:
 *   spine2_qfx5200 1
 *   total 1
 * Highlights:
 *   - Same underlay-only spine form as spine1 with this spine's own neighbour addresses.
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-export-loopback.conf
 * Variables: none
 */
protocols {
    bgp {
        group underlay-dcwanedge {
            type external;
            export lo0;
            local-as 65002;
            multipath {
                multiple-as;
            }
            neighbor 10.0.7.1 {
                description dcwanedge-2;
                peer-as 65003;
            }
            neighbor 10.0.8.1 {
                description dcwanedge-1;
                peer-as 65003;
            }
        }
        group underlay-leaf {
            type external;
            export lo0;
            local-as 65002;
            multipath {
                multiple-as;
            }
            neighbor 10.0.2.2 {
                description leaf1;
                peer-as 65001;
            }
            neighbor 10.0.5.2 {
                description leaf2;
                peer-as 65001;
            }
        }
    }
}
```

## junos/protocols/bgp-wan-edge1.conf

```
/*
 * Topic: Complete deployed BGP form for wan-edge1_mx204
 * Seen on:
 *   Junos: wan-edge1_mx204
 *   EVO: (none)
 * Count:
 *   wan-edge1_mx204 1
 *   total 1
 * Variant group: ewan-bgp-overlay
 *   Provides: evpn
 * Highlights:
 *   - Single iBGP group `EVPN-MPLS-IBGP` with `family evpn signaling` toward both DC gateways and the other WAN edge; `multipath` lets the PE use both gateways of the all-active interconnect pair.
 * Pair with: none
 * Variables: none
 */
protocols {
    bgp {
        group EVPN-MPLS-IBGP {
            type internal;
            local-address 1.1.1.10;
            family evpn {
                signaling;
            }
            multipath;
            neighbor 1.1.1.5 {
                description DC-WANEdge1;
            }
            neighbor 1.1.1.6 {
                description DC-WANEdge2;
            }
            neighbor 1.1.1.9 {
                description WAN-EDGE2;
            }
        }
    }
}
```

## junos/protocols/bgp-wan-edge2.conf

```
/*
 * Topic: Complete deployed BGP form for wan-edge2_acx5448-m
 * Seen on:
 *   Junos: wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   wan-edge2_acx5448-m 1
 *   total 1
 * Variant group: ewan-bgp-overlay
 *   Provides: evpn, l2vpn
 * Highlights:
 *   - Single iBGP group `EVPN-MPLS-IBGP` toward both DC gateways and the other WAN edge; this PE also signals `family l2vpn`, which the EVPN-VPWS instance does not need but the lab form carries.
 * Pair with: none
 * Variables: none
 */
protocols {
    bgp {
        group EVPN-MPLS-IBGP {
            type internal;
            local-address 1.1.1.9;
            family l2vpn {
                signaling;
            }
            family evpn {
                signaling;
            }
            multipath;
            neighbor 1.1.1.5 {
                description DC-WANEdge1;
            }
            neighbor 1.1.1.6 {
                description DC-WANEdge2;
            }
            neighbor 1.1.1.10 {
                description WAN-EDGE1;
            }
        }
    }
}
```

## junos/protocols/ldp-interface-2-core-all-loopback.conf

```
/*
 * Topic: LDP on two named core links, all interfaces and the loopback
 * Seen on:
 *   Junos: wan-edge1_mx204 wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   wan-edge1_mx204 1
 *   wan-edge2_acx5448-m 1
 *   total 2
 * Highlights:
 *   - WAN-edge form: the two core uplinks are named explicitly in addition to `interface all` (redundant but harmless) and the loopback.
 * Pair with: none
 * Variables (example values from wan-edge1_mx204):
 *   $CORE_PHYS_1  e.g. et-0/0/0
 *   $CORE_PHYS_2  e.g. et-0/0/1
 */
protocols {
    ldp {
        interface $CORE_PHYS_1.0;
        interface $CORE_PHYS_2.0;
        interface all;
        interface lo0.0;
    }
}
```

## junos/protocols/ldp-interface-3-core-all-loopback.conf

```
/*
 * Topic: LDP on three named core links, all interfaces and the loopback
 * Seen on:
 *   Junos: dc-edge2_mx10003
 *   EVO: (none)
 * Count:
 *   dc-edge2_mx10003 1
 *   total 1
 * Highlights:
 *   - Gateway form naming the three WAN-side core links in addition to `interface all` and the loopback.
 * Pair with: none
 * Variables (example values from dc-edge2_mx10003):
 *   $CORE_PHYS_1  e.g. et-1/1/0
 *   $CORE_PHYS_2  e.g. et-1/1/1
 *   $CORE_PHYS_3  e.g. et-1/1/4
 */
protocols {
    ldp {
        interface $CORE_PHYS_1.0;
        interface $CORE_PHYS_2.0;
        interface $CORE_PHYS_3.0;
        interface all;
        interface lo0.0;
    }
}
```

## junos/protocols/ldp-interface-all-loopback.conf

```
/*
 * Topic: LDP on all interfaces plus the loopback
 * Seen on:
 *   Junos: dc-edge1_mx480
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 1
 *   total 1
 * Highlights:
 *   - `interface all` enables LDP on every MPLS-capable interface; `lo0.0` is listed so the loopback is an LDP transport address and FEC.
 * Pair with: none
 * Variables: none
 */
protocols {
    ldp {
        interface all;
        interface lo0.0;
    }
}
```

## junos/protocols/lldp-interface-all-management.conf

```
/*
 * Topic: LLDP on all interfaces and the management port
 * Seen on:
 *   Junos: dc-edge1_mx480
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 1
 *   total 1
 * Highlights:
 *   - Neighbour discovery on every interface, with the out-of-band management port added explicitly.
 * Pair with: none
 * Variables (example values from dc-edge1_mx480):
 *   $IFD  e.g. fxp0
 */
protocols {
    lldp {
        interface all;
        interface $IFD;
    }
}
```

## junos/protocols/mpls-interface-2-core.conf

```
/*
 * Topic: MPLS on two named core links
 * Seen on:
 *   Junos: wan-edge1_mx204 wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   wan-edge1_mx204 1
 *   wan-edge2_acx5448-m 1
 *   total 2
 * Highlights:
 *   - WAN-edge form enabling MPLS only on the two core uplinks.
 * Pair with: none
 * Variables (example values from wan-edge1_mx204):
 *   $CORE_PHYS_1  e.g. et-0/0/0
 *   $CORE_PHYS_2  e.g. et-0/0/1
 */
protocols {
    mpls {
        interface $CORE_PHYS_1.0;
        interface $CORE_PHYS_2.0;
    }
}
```

## junos/protocols/mpls-interface-3-core.conf

```
/*
 * Topic: MPLS on three named core links
 * Seen on:
 *   Junos: dc-edge2_mx10003
 *   EVO: (none)
 * Count:
 *   dc-edge2_mx10003 1
 *   total 1
 * Highlights:
 *   - Gateway form enabling MPLS only on the three WAN-side core links.
 * Pair with: none
 * Variables (example values from dc-edge2_mx10003):
 *   $CORE_PHYS_1  e.g. et-1/1/4
 *   $CORE_PHYS_2  e.g. et-1/1/1
 *   $CORE_PHYS_3  e.g. et-1/1/0
 */
protocols {
    mpls {
        interface $CORE_PHYS_1.0;
        interface $CORE_PHYS_2.0;
        interface $CORE_PHYS_3.0;
    }
}
```

## junos/protocols/mpls-interface-all.conf

```
/*
 * Topic: MPLS enabled on all interfaces
 * Seen on:
 *   Junos: dc-edge1_mx480
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 1
 *   total 1
 * Highlights:
 *   - `interface all` enables MPLS forwarding on every interface with `family mpls`.
 * Pair with: none
 * Variables: none
 */
protocols {
    mpls {
        interface all;
    }
}
```

## junos/protocols/ospf-area0-dc-edge1.conf

```
/*
 * Topic: OSPF area 0 as deployed on dc-edge1 (LFA core links, passive loopback, management disabled, tagged test units)
 * Seen on:
 *   Junos: dc-edge1_mx480
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 1
 *   total 1
 * Highlights:
 *   - Three WAN-side core links run with `node-link-protection` and `ldp-synchronization`; the loopback is passive; the management port is disabled; five tagged routed test units are plain area members.
 *   - The OSPF area is one fragment: its interface list is device-specific, so this is the complete as-deployed form rather than a per-interface template.
 * Pair with: none
 * Variables (example values from dc-edge1_mx480):
 *   $CORE_INTF_1  e.g. et-1/1/3.0
 *   $CORE_INTF_2  e.g. et-1/1/2.0
 *   $CORE_INTF_3  e.g. et-1/1/1.0
 *   $IFD          e.g. xe-5/3/7
 *   $UNIT_A       e.g. 3901
 *   $UNIT_B       e.g. 3902
 *   $UNIT_C       e.g. 3903
 *   $UNIT_D       e.g. 3904
 *   $UNIT_E       e.g. 3905
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
                ldp-synchronization;
            }
            interface $CORE_INTF_2 {
                node-link-protection;
                ldp-synchronization;
            }
            interface $CORE_INTF_3 {
                node-link-protection;
                ldp-synchronization;
            }
            interface $IFD.$UNIT_A;
            interface $IFD.$UNIT_B;
            interface $IFD.$UNIT_C;
            interface $IFD.$UNIT_D;
            interface $IFD.$UNIT_E;
        }
    }
}
```

## junos/protocols/ospf-area0-dc-edge2.conf

```
/*
 * Topic: OSPF area 0 as deployed on dc-edge2 (LFA core links, passive loopback, tagged test units)
 * Seen on:
 *   Junos: dc-edge2_mx10003
 *   EVO: (none)
 * Count:
 *   dc-edge2_mx10003 1
 *   total 1
 * Highlights:
 *   - Same gateway form as dc-edge1 without the management-port `disable`.
 *   - The OSPF area is one fragment: its interface list is device-specific, so this is the complete as-deployed form rather than a per-interface template.
 * Pair with: none
 * Variables (example values from dc-edge2_mx10003):
 *   $CORE_INTF_1  e.g. et-1/1/1.0
 *   $CORE_INTF_2  e.g. et-1/1/0.0
 *   $CORE_INTF_3  e.g. et-1/1/4.0
 *   $IFD          e.g. xe-0/1/11:2
 *   $UNIT_A       e.g. 3906
 *   $UNIT_B       e.g. 3907
 *   $UNIT_C       e.g. 3908
 *   $UNIT_D       e.g. 3909
 *   $UNIT_E       e.g. 3910
 */
protocols {
    ospf {
        area 0.0.0.0 {
            interface $CORE_INTF_1 {
                node-link-protection;
                ldp-synchronization;
            }
            interface $CORE_INTF_2 {
                node-link-protection;
                ldp-synchronization;
            }
            interface $CORE_INTF_3 {
                node-link-protection;
                ldp-synchronization;
            }
            interface lo0.0 {
                passive;
            }
            interface $IFD.$UNIT_A;
            interface $IFD.$UNIT_B;
            interface $IFD.$UNIT_C;
            interface $IFD.$UNIT_D;
            interface $IFD.$UNIT_E;
        }
    }
}
```

## junos/protocols/ospf-area0-wan-edge1.conf

```
/*
 * Topic: OSPF area 0 as deployed on wan-edge1 (two LFA core links, passive loopback, management disabled)
 * Seen on:
 *   Junos: wan-edge1_mx204
 *   EVO: (none)
 * Count:
 *   wan-edge1_mx204 1
 *   total 1
 * Highlights:
 *   - Both core uplinks run `node-link-protection` and `ldp-synchronization`, the loopback is passive and the management port is excluded.
 *   - The OSPF area is one fragment reconstructed in source order; wan-edge2 carries the same statements in a different order and has its own form.
 * Pair with: none
 * Variables (example values from wan-edge1_mx204):
 *   $CORE_INTF_1  e.g. et-0/0/0.0
 *   $CORE_INTF_2  e.g. et-0/0/1.0
 */
protocols {
    ospf {
        area 0.0.0.0 {
            interface $CORE_INTF_1 {
                node-link-protection;
                ldp-synchronization;
            }
            interface $CORE_INTF_2 {
                node-link-protection;
                ldp-synchronization;
            }
            interface lo0.0 {
                passive;
            }
            interface fxp0.0 {
                disable;
            }
        }
    }
}
```

## junos/protocols/ospf-area0-wan-edge2.conf

```
/*
 * Topic: OSPF area 0 as deployed on wan-edge2 (passive loopback, two LFA core links, management disabled)
 * Seen on:
 *   Junos: wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   wan-edge2_acx5448-m 1
 *   total 1
 * Highlights:
 *   - Both core uplinks run `node-link-protection` and `ldp-synchronization`, the loopback is passive and the management port is excluded.
 *   - The OSPF area is one fragment reconstructed in source order; wan-edge1 carries the same statements in a different order and has its own form.
 * Pair with: none
 * Variables (example values from wan-edge2_acx5448-m):
 *   $CORE_INTF_1  e.g. et-0/1/0.0
 *   $CORE_INTF_2  e.g. et-0/1/1.0
 */
protocols {
    ospf {
        area 0.0.0.0 {
            interface lo0.0 {
                passive;
            }
            interface $CORE_INTF_1 {
                node-link-protection;
                ldp-synchronization;
            }
            interface $CORE_INTF_2 {
                node-link-protection;
                ldp-synchronization;
            }
            interface fxp0.0 {
                disable;
            }
        }
    }
}
```

## junos/protocols/ospf-backup-spf-options.conf

```
/*
 * Topic: OSPF loop-free-alternate backup computation options
 * Seen on:
 *   Junos: dc-edge1_mx480 dc-edge2_mx10003 wan-edge1_mx204 wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 1
 *   dc-edge2_mx10003 1
 *   wan-edge1_mx204 1
 *   wan-edge2_acx5448-m 1
 *   total 4
 * Highlights:
 *   - `remote-backup-calculation` with `per-prefix-calculation all` and `node-link-degradation` lets OSPF compute remote LFA backups per prefix and prefer node-protecting paths when both link and node protection are possible.
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
    }
}
```

## junos/routing-instances/evpn-elan/ri-evpn-elan-mac-vrf-vlan-based.conf

```
/*
 * Topic: EVPN-VXLAN ELAN, MAC-VRF VLAN-based service with one VLAN and one attachment circuit (DC leaf)
 * Seen on:
 *   Junos: leaf1_qfx5120-48t leaf2_qfx5120-48t
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48t 1451
 *   leaf2_qfx5120-48t 1451
 *   total 2902
 * Highlights:
 *   - `instance-type mac-vrf` with `service-type vlan-based` maps exactly one VLAN and one VNI to the EVPN instance; the VNI is listed in `extended-vni-list` and bound again under the VLAN.
 *   - `vlan-id none` on the bridge means the attachment unit's own VLAN tag is kept rather than normalised, so the leaf forwards the customer tag unchanged into the VXLAN tunnel.
 *   - The attachment is a unit of the ESI-LAG toward the top-of-rack switch; the ESI lives on the aggregated interface, not here.
 * Pair with:
 *  - variant:ewan-bgp-overlay families=evpn
 * Variables (example values from leaf1_qfx5120-48t / MACVRF-Instance1402):
 *   $INSTANCE_NAME    e.g. MACVRF-Instance1402
 *   $VNI              e.g. 1402
 *   $LOOPBACK_V4      e.g. 1.1.1.1
 *   $RD_SUB_ASSIGNED  e.g. 7000
 *   $RT_AS            e.g. 100
 *   $RT_ID            e.g. 1402
 *   $BD_NAME          e.g. EP-TYPE-2-VLAN-1402
 *   $AC_INTF          e.g. ae33.1402
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type mac-vrf;
        protocols {
            evpn {
                encapsulation vxlan;
                default-gateway no-gateway-community;
                extended-vni-list $VNI;
            }
        }
        vtep-source-interface lo0.0;
        service-type vlan-based;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
        vlans {
            $BD_NAME {
                vlan-id none;
                interface $AC_INTF;
                vxlan {
                    vni $VNI;
                }
            }
        }
    }
}
```

## junos/routing-instances/evpn-elan/ri-evpn-elan-mac-vrf-vlan-bundle.conf

```
/*
 * Topic: EVPN-VXLAN ELAN, MAC-VRF VLAN-bundle service with one VNI and one attachment circuit (DC leaf)
 * Seen on:
 *   Junos: leaf1_qfx5120-48t leaf2_qfx5120-48t
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48t 16
 *   leaf2_qfx5120-48t 15
 *   total 31
 * Highlights:
 *   - `service-type vlan-bundle` carries a whole VLAN range in one MAC-VRF and one VNI; the admitted range is defined on the attachment unit, not in the instance.
 *   - `default-gateway do-not-advertise` keeps the leaf from advertising a gateway MAC/IP for the bundle, which has no IRB.
 * Pair with:
 *  - variant:ewan-bgp-overlay families=evpn
 * Variables (example values from leaf1_qfx5120-48t / MACVRF-VBundle-Instance1):
 *   $INSTANCE_NAME    e.g. MACVRF-VBundle-Instance1
 *   $VNI              e.g. 701
 *   $LOOPBACK_V4      e.g. 1.1.1.2
 *   $RD_SUB_ASSIGNED  e.g. 6000
 *   $RT_AS            e.g. 100
 *   $RT_ID            e.g. 701
 *   $BD_NAME          e.g. VLANS-701-780
 *   $AC_INTF          e.g. ae16.0
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type mac-vrf;
        protocols {
            evpn {
                encapsulation vxlan;
                default-gateway do-not-advertise;
                extended-vni-list $VNI;
            }
        }
        vtep-source-interface lo0.0;
        service-type vlan-bundle;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
        vlans {
            $BD_NAME {
                interface $AC_INTF;
                vxlan {
                    vni $VNI;
                }
            }
        }
    }
}
```

## junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-irb.conf

```
/*
 * Topic: EVPN-MPLS ELAN, VLAN-based instance with IRB routing-interface (WAN edge PE, single-homed)
 * Seen on:
 *   Junos: wan-edge1_mx204
 *   EVO: (none)
 * Count:
 *   wan-edge1_mx204 700
 *   total 700
 * Highlights:
 *   - `vlan-id none` with the attachment unit listed under both `protocols evpn` and the instance; the IRB is attached with `routing-interface` (MX form).
 *   - `default-gateway no-gateway-community` suppresses the default-gateway extended community because the gateway MAC/IP is identical on every PE.
 * Pair with:
 *  - variant:ewan-bgp-overlay families=evpn
 * Variables (example values from wan-edge1_mx204 / EVPN_SH_VBased_1403):
 *   $INSTANCE_NAME    e.g. EVPN_SH_VBased_1403
 *   $AC_INTF          e.g. xe-0/1/4.1403
 *   $IRB_UNIT         e.g. 1403
 *   $LOOPBACK_V4      e.g. 1.1.1.10
 *   $RD_SUB_ASSIGNED  e.g. 1403
 *   $RT_AS            e.g. 1403
 *   $RT_ID            e.g. 1403
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn;
        protocols {
            evpn {
                interface $AC_INTF;
                default-gateway no-gateway-community;
            }
        }
        vlan-id none;
        routing-interface irb.$IRB_UNIT;
        interface $AC_INTF;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-l3-interface.conf

```
/*
 * Topic: EVPN-MPLS ELAN, VLAN-based instance with IRB l3-interface (WAN edge PE, single-homed, ACX form)
 * Seen on:
 *   Junos: wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   wan-edge2_acx5448-m 750
 *   total 750
 * Highlights:
 *   - Same VLAN-based EVPN instance as the MX WAN edge, but the ACX5448 attaches the IRB with `l3-interface` instead of `routing-interface`.
 *   - `default-gateway no-gateway-community` suppresses the default-gateway extended community because the gateway MAC/IP is identical on every PE.
 * Pair with:
 *  - variant:ewan-bgp-overlay families=evpn
 * Variables (example values from wan-edge2_acx5448-m / ACX_EVPN_SH_VBased_2704):
 *   $INSTANCE_NAME    e.g. ACX_EVPN_SH_VBased_2704
 *   $AC_INTF          e.g. xe-0/0/2.2704
 *   $IRB_UNIT         e.g. 2704
 *   $LOOPBACK_V4      e.g. 1.1.1.9
 *   $RD_SUB_ASSIGNED  e.g. 2704
 *   $RT_AS            e.g. 2704
 *   $RT_ID            e.g. 2704
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn;
        protocols {
            evpn {
                interface $AC_INTF;
                default-gateway no-gateway-community;
            }
        }
        vlan-id none;
        l3-interface irb.$IRB_UNIT;
        interface $AC_INTF;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle-no-gateway-community.conf

```
/*
 * Topic: EVPN-MPLS ELAN, VLAN-bundle instance with per-instance label allocation and no-gateway-community (WAN edge PE, single-homed)
 * Seen on:
 *   Junos: wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   wan-edge2_acx5448-m 1
 *   total 1
 * Highlights:
 *   - VLAN-bundle form that additionally sets `default-gateway no-gateway-community`; deployed on one bundle instance alongside the plain form.
 * Pair with:
 *  - variant:ewan-bgp-overlay families=evpn
 * Variables (example values from wan-edge2_acx5448-m / ACX_EVPN_SH_VBundle_VLAN2103-2187):
 *   $INSTANCE_NAME    e.g. ACX_EVPN_SH_VBundle_VLAN2103-2187
 *   $AC_INTF          e.g. xe-0/0/2.2103
 *   $LOOPBACK_V4      e.g. 1.1.1.9
 *   $RD_SUB_ASSIGNED  e.g. 2103
 *   $RT_AS            e.g. 2103
 *   $RT_ID            e.g. 2103
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn;
        protocols {
            evpn {
                default-gateway no-gateway-community;
                label-allocation per-instance;
            }
        }
        interface $AC_INTF;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle.conf

```
/*
 * Topic: EVPN-MPLS ELAN, VLAN-bundle instance with per-instance label allocation (WAN edge PE, single-homed)
 * Seen on:
 *   Junos: wan-edge1_mx204 wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   wan-edge1_mx204 9
 *   wan-edge2_acx5448-m 6
 *   total 15
 * Highlights:
 *   - One EVPN instance carries a whole VLAN range; the attachment unit admits the range with `vlan-id-list` and no normalisation is performed.
 *   - `label-allocation per-instance` assigns a single MPLS label to the instance rather than one per VLAN.
 * Pair with:
 *  - variant:ewan-bgp-overlay families=evpn
 * Variables (example values from wan-edge1_mx204 / EVPN_SH_VBundle_VLAN1021-1100):
 *   $INSTANCE_NAME    e.g. EVPN_SH_VBundle_VLAN1021-1100
 *   $AC_INTF          e.g. xe-0/1/4.1021
 *   $LOOPBACK_V4      e.g. 1.1.1.10
 *   $RD_SUB_ASSIGNED  e.g. 1021
 *   $RT_AS            e.g. 1021
 *   $RT_ID            e.g. 1021
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn;
        protocols {
            evpn {
                label-allocation per-instance;
            }
        }
        interface $AC_INTF;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/routing-instances/evpn-interconnect/ri-evpn-interconnect-vlan-based-irb.conf

```
/*
 * Topic: EVPN-VXLAN to EVPN-MPLS interconnect, VLAN-based instance with IRB (DC gateway, all-active pair)
 * Seen on:
 *   Junos: dc-edge1_mx480 dc-edge2_mx10003
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 1451
 *   dc-edge2_mx10003 1451
 *   total 2902
 * Highlights:
 *   - One `instance-type evpn` carries a VXLAN VNI toward the fabric and, through `protocols evpn interconnect`, an EVPN-MPLS instance toward the WAN; the `interconnect` block has its own route target and route distinguisher, so the instance holds two RT/RD pairs.
 *   - The interconnect ESI is identical on both gateways and `all-active`, which is what makes them one redundant gateway pair for the WAN-side PEs.
 *   - The IRB is attached with `routing-interface`; the fabric-side RD must differ from the interconnect RD.
 * Pair with:
 *  - variant:ewan-bgp-overlay families=evpn
 * Variables (example values from dc-edge1_mx480 / Interconnect_Instance1402):
 *   $INSTANCE_NAME        e.g. Interconnect_Instance1402
 *   $RT_AS_INTERCONNECT   e.g. 1402
 *   $RT_ID_INTERCONNECT   e.g. 1402
 *   $LOOPBACK_V4          e.g. 1.1.1.5
 *   $RD_SUB_INTERCONNECT  e.g. 1402
 *   $ESI                  e.g. 00:61:61:61:61:61:61:61:61:01
 *   $IRB_UNIT             e.g. 1402
 *   $VNI                  e.g. 1402
 *   $RD_SUB_ASSIGNED      e.g. 7000
 *   $RT_AS                e.g. 100
 *   $RT_ID                e.g. 1402
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn;
        protocols {
            evpn {
                encapsulation vxlan;
                default-gateway no-gateway-community;
                interconnect {
                    vrf-target target:$RT_AS_INTERCONNECT:$RT_ID_INTERCONNECT;
                    route-distinguisher $LOOPBACK_V4:$RD_SUB_INTERCONNECT;
                    esi {
                        $ESI;
                        all-active;
                    }
                    encapsulation mpls;
                }
            }
        }
        vtep-source-interface lo0.0;
        vlan-id none;
        routing-interface irb.$IRB_UNIT;
        vxlan {
            vni $VNI;
        }
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/routing-instances/evpn-interconnect/ri-evpn-interconnect-vlan-bundle.conf

```
/*
 * Topic: EVPN-VXLAN to EVPN-MPLS interconnect, VLAN-bundle instance (DC gateway, all-active pair)
 * Seen on:
 *   Junos: dc-edge1_mx480 dc-edge2_mx10003
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 16
 *   dc-edge2_mx10003 16
 *   total 32
 * Highlights:
 *   - Bundle form of the interconnect: no IRB and no `vlan-id`, so every VLAN in the bundle shares one VNI toward the fabric and one EVPN-MPLS instance toward the WAN.
 *   - `encapsulate-inner-vlan` / `decapsulate-accept-inner-vlan` keep the customer VLAN tag inside the VXLAN payload so the remote end can tell the bundled VLANs apart.
 *   - The interconnect ESI is identical on both gateways and `all-active`.
 * Pair with:
 *  - variant:ewan-bgp-overlay families=evpn
 * Variables (example values from dc-edge1_mx480 / Interconnect_VBundle_Instance1):
 *   $INSTANCE_NAME        e.g. Interconnect_VBundle_Instance1
 *   $RT_AS_INTERCONNECT   e.g. 701
 *   $RT_ID_INTERCONNECT   e.g. 701
 *   $LOOPBACK_V4          e.g. 1.1.1.5
 *   $RD_SUB_INTERCONNECT  e.g. 701
 *   $ESI                  e.g. 00:45:55:65:75:85:95:15:25:35
 *   $VNI                  e.g. 701
 *   $RD_SUB_ASSIGNED      e.g. 6000
 *   $RT_AS                e.g. 100
 *   $RT_ID                e.g. 701
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn;
        protocols {
            evpn {
                encapsulation vxlan;
                interconnect {
                    vrf-target target:$RT_AS_INTERCONNECT:$RT_ID_INTERCONNECT;
                    route-distinguisher $LOOPBACK_V4:$RD_SUB_INTERCONNECT;
                    esi {
                        $ESI;
                        all-active;
                    }
                    encapsulation mpls;
                }
            }
        }
        vtep-source-interface lo0.0;
        vxlan {
            vni $VNI;
            encapsulate-inner-vlan;
            decapsulate-accept-inner-vlan;
        }
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/routing-options/autonomous-system.conf

```
/*
 * Topic: Local autonomous-system number
 * Seen on:
 *   Junos: dc-edge1_mx480 dc-edge2_mx10003 leaf1_qfx5120-48t leaf2_qfx5120-48t spine1_qfx5200 wan-edge1_mx204 wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 1
 *   dc-edge2_mx10003 1
 *   leaf1_qfx5120-48t 1
 *   leaf2_qfx5120-48t 1
 *   spine1_qfx5200 1
 *   wan-edge1_mx204 1
 *   wan-edge2_acx5448-m 1
 *   total 7
 * Highlights:
 *   - One AS (65000) for the iBGP EVPN overlay on every fabric and WAN node; the eBGP underlay uses per-role `local-as` overrides inside the BGP groups instead.
 * Pair with: none
 * Variables (example values from dc-edge1_mx480):
 *   $ASN  e.g. 65000
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
 *   Junos: wan-edge1_mx204 wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   wan-edge1_mx204 1
 *   wan-edge2_acx5448-m 1
 *   total 2
 * Highlights:
 *   - WAN-edge form: load-balance export plus `chained-composite-next-hop ingress evpn` for EVPN-MPLS next-hop scaling; no `ecmp-fast-reroute`.
 * Pair with:
 *  - junos/policy-options/policy-statement/per-packet-load-balance.conf
 * Variables (example values from wan-edge1_mx204):
 *   $PPLB_NAME  e.g. load-balance
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

## junos/routing-options/forwarding-table-pplb-ecmp-fast-reroute-chained-nh-evpn.conf

```
/*
 * Topic: Forwarding-table per-packet load balancing, ECMP fast reroute and chained composite next hops for EVPN
 * Seen on:
 *   Junos: leaf1_qfx5120-48t leaf2_qfx5120-48t
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48t 1
 *   leaf2_qfx5120-48t 1
 *   total 2
 * Highlights:
 *   - Leaf form: load-balance export, `ecmp-fast-reroute`, and `chained-composite-next-hop ingress evpn`, which lets the leaf share one indirect next hop across many EVPN routes to the same remote VTEP and scale the overlay FIB.
 * Pair with:
 *  - junos/policy-options/policy-statement/per-packet-load-balance.conf
 * Variables (example values from leaf1_qfx5120-48t):
 *   $PPLB_NAME  e.g. load-balance
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

## junos/routing-options/forwarding-table-pplb-ecmp-fast-reroute.conf

```
/*
 * Topic: Forwarding-table per-packet load balancing with ECMP fast reroute
 * Seen on:
 *   Junos: dc-edge1_mx480 dc-edge2_mx10003 spine1_qfx5200 spine2_qfx5200
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 1
 *   dc-edge2_mx10003 1
 *   spine1_qfx5200 1
 *   spine2_qfx5200 1
 *   total 4
 * Highlights:
 *   - Exports the load-balance policy to the forwarding table and enables `ecmp-fast-reroute`, which pre-installs the remaining ECMP members so a failed path is bypassed in the PFE without waiting for the control plane.
 * Pair with:
 *  - junos/policy-options/policy-statement/per-packet-load-balance.conf
 * Variables (example values from dc-edge1_mx480):
 *   $PPLB_NAME  e.g. load-balance
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
        ecmp-fast-reroute;
    }
}
```

## junos/routing-options/resolution-preserve-nexthop-hierarchy.conf

```
/*
 * Topic: Preserve next-hop hierarchy during route resolution
 * Seen on:
 *   Junos: dc-edge1_mx480
 *   EVO: (none)
 * Count:
 *   dc-edge1_mx480 1
 *   total 1
 * Highlights:
 *   - Keeps the indirect next-hop hierarchy intact when resolving routes so that an underlay change updates one shared next hop instead of every dependent route.
 * Pair with: none
 * Variables: none
 */
routing-options {
    resolution {
        preserve-nexthop-hierarchy;
    }
}
```

## junos/routing-options/router-id.conf

```
/*
 * Topic: Router ID
 * Seen on:
 *   Junos: spine2_qfx5200 wan-edge1_mx204 wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   spine2_qfx5200 1
 *   wan-edge1_mx204 1
 *   wan-edge2_acx5448-m 1
 *   total 3
 * Highlights:
 *   - Explicit router-id equal to the loopback; on the other devices the same statement lives inside the `global` configuration group.
 * Pair with: none
 * Variables (example values from wan-edge1_mx204):
 *   $ROUTER_ID  e.g. 1.1.1.10
 */
routing-options {
    router-id $ROUTER_ID;
}
```

## junos/system/evpn-mh-firewall-profile.conf

```
/*
 * Topic: EVPN multihoming firewall profile
 * Seen on:
 *   Junos: wan-edge2_acx5448-m
 *   EVO: (none)
 * Count:
 *   wan-edge2_acx5448-m 1
 *   total 1
 * Highlights:
 *   - ACX5448 needs `evpn-mh-profile` for EVPN multihoming filters; the rest of this `system` stanza is excluded as lab management.
 * Pair with: none
 * Variables: none
 */
system {
    packet-forwarding-options {
        firewall-profile {
            evpn-mh-profile;
        }
    }
}
```

## junos/vlans/vlan-id-list.conf

```
/*
 * Topic: Named VLAN set defined as a vlan-id-list
 * Seen on:
 *   Junos: leaf1_qfx5120-48t leaf2_qfx5120-48t
 *   EVO: (none)
 * Count:
 *   leaf1_qfx5120-48t 9
 *   leaf2_qfx5120-48t 16
 *   total 25
 * Highlights:
 *   - Defines the VLAN range that a VLAN-bundle MAC-VRF bridge references by name; the leaf keeps the range as one bridge domain.
 * Pair with: none
 * Variables (example values from leaf1_qfx5120-48t):
 *   $VLAN_NAME  e.g. VLANS-1021-1100
 *   $VLAN_LIST  e.g. 1021-1100
 */
vlans {
    $VLAN_NAME {
        vlan-id-list $VLAN_LIST;
    }
}
```

## junos/vlans/vlan-range.conf

```
/*
 * Topic: Named VLAN range on the top-of-rack switch
 * Seen on:
 *   Junos: tor1_ex4200-48t tor2_ex4200-48t
 *   EVO: (none)
 * Count:
 *   tor1_ex4200-48t 25
 *   tor2_ex4200-48t 24
 *   total 49
 * Highlights:
 *   - EX4200 (Junos 15.1) form of a VLAN range definition, `vlan-range`, referenced by the LAG trunk members.
 * Pair with: none
 * Variables (example values from tor1_ex4200-48t):
 *   $VLAN_NAME  e.g. EP-TYPE-2-VLAN-122-161
 *   $VLAN_LIST  e.g. 122-161
 */
vlans {
    $VLAN_NAME {
        vlan-range $VLAN_LIST;
    }
}
```

## _variables.md

# Snippet variable glossary

All `.conf` files under `junos/` and `evo/` are templates: identifiers that vary
between deployments are written as `$VAR`. Render a snippet by substituting each
placeholder with your deployment's value. The placeholders each snippet uses are
listed in its `Variables:` header and in the glossary below. Variable names and
meanings follow the shared JVD snippet vocabulary (see the Metro Ethernet
Business Services glossary); entries marked **new** were introduced by this JVD.

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `65000` |
| `$LOOPBACK_V4` | This node's lo0 IPv4 (used as RD prefix, BGP local-address and VTEP source). | `1.1.1.5` |
| `$LOOPBACK_V4_PFX` | This node's lo0 IPv4 written with its `/32` prefix length (address form). | `1.1.1.6/32` |
| `$ROUTER_ID` | router-id (equal to `$LOOPBACK_V4`). | `1.1.1.10` |
| `$LOOPBACK_V6_PFX` | This node's lo0 IPv6 written with its `/128` prefix length. | `abcd::10:255:23:228/128` |
| `$LOOPBACK_MGMT_V4_PFX` | **new** Management-network lo0 IPv4 `/32` configured alongside the design loopback. | `10.255.152.8/32` |
| `$LOOPBACK_ALT_V4_PFX` | **new** Additional lo0 IPv4 `/32` configured on one node besides its design and management loopbacks. | `111.1.1.1/32` |
| `$ISO_NET` | **new** ISO network entity title on lo0 `family iso`. | `47.0005.80ff.f800.0000.0108.0001.0102.5502.3228.00` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$IFD` | Interface device a construct configures or attaches to, independent of its type or topology role — physical or aggregated. | `xe-0/1/4` |
| `$UNIT` | Logical-unit identifier — the `unit <n>` a construct configures. | `1402` |
| `$UNIT_A` … `$UNIT_E` | Ordered logical units of the five tagged routed test sub-interfaces listed in an OSPF area. | `3901` … `3905` |
| `$VLAN` | VLAN id on a tagged unit. | `1402` |
| `$VLAN_LIST` | VLAN range admitted by a `vlan-id-list` unit or defined by a named VLAN set. | `701-780` |
| `$VLAN_NAME` | **new** Name of a `vlans` definition (a VLAN set or range) referenced by trunk members and bundle instances. | `VLANS-701-780` |
| `$AC_INTF` | Customer-facing attachment-circuit unit (with VLAN id when tagged). | `xe-0/1/4.1403` |
| `$AC_ADDR_V4` | IPv4 address on a routed attachment-circuit unit. | `101.1.1.1/24` |
| `$CORE_PHYS` | Core-facing physical interface carrying `unit 0`. | `et-0/0/0` |
| `$CORE_PHYS_1` … `$CORE_PHYS_4` | Ordered core-facing physical interfaces named in one protocol stanza (`<phys>.0`). | `et-0/0/48` |
| `$CORE_INTF_1` … `$CORE_INTF_4` | Ordered core-facing logical interfaces named in one OSPF area. | `et-1/1/1.0` |
| `$CORE_V4_ADDR` | Core interface IPv4 address. | `10.0.16.1/30` |
| `$CORE_DESC` | Interface description naming the far end. | `"To dc-edge2"` |
| `$AE_BUNDLE` | Aggregated-Ethernet bundle a member link joins (`802.3ad`). | `ae0` |
| `$LACP_SYS_ID` | LACP system-id on a multihomed LAG; identical on both leaves of the same ESI-LAG. | `00:00:00:33:33:33` |
| `$ESI` | 10-byte Ethernet segment identifier (EVPN multihoming). | `00:33:33:33:33:33:33:33:33:33` |
| `$DF_PREFERENCE` | **new** Designated-forwarder election preference value on an all-active ESI (`df-election-type preference value`); higher wins. | `100` |
| `$IRB_UNIT` | irb.X unit number for IRB integration. | `1402` |
| `$IRB_ADDR` | IPv4 address configured on an `irb` unit that carries the virtual gateway. | `10.0.101.1/24` |
| `$IRB_ADDR_2` | **new** Second, plain IPv4 address on the same `irb` unit (no virtual gateway). | `10.2.81.1/24` |
| `$VGA` | EVPN virtual-gateway address shared by the IRB's redundancy group. | `10.0.101.254` |
| `$VG_MAC` | MAC address bound to the IPv4 virtual gateway. | `00:00:5e:00:00:04` |

## Chassis

| Variable | What it is | Example value |
|---|---|---|
| `$AE_DEVICE_COUNT` | Number of aggregated-Ethernet devices the chassis allocates. | `100` |
| `$FPC_SLOT` | FPC slot for a complete source-measured hardware profile. | `0` |
| `$PIC` / `$PORT` | **new** PIC and port index of a single channelised port. | `0` / `50` |

## Services

| Variable | What it is | Example value |
|---|---|---|
| `$INSTANCE_NAME` | The service-instance name. | `Interconnect_Instance1402` |
| `$RD_SUB_ASSIGNED` | Route-distinguisher Assigned Number subfield of the instance's own RD (`$LOOPBACK_V4:$RD_SUB_ASSIGNED`). | `7000` |
| `$RT_AS` | Route-target Administrator subfield of the instance's own `vrf-target`; service-scoped, not the node's AS. | `100` |
| `$RT_ID` | Route-target Assigned Number (the tail) of the instance's own `vrf-target`. | `1402` |
| `$RD_SUB_INTERCONNECT` | **new** Assigned Number subfield of the RD inside `protocols evpn interconnect` (`$LOOPBACK_V4:$RD_SUB_INTERCONNECT`); must differ from `$RD_SUB_ASSIGNED`. | `1402` |
| `$RT_AS_INTERCONNECT` | **new** Administrator subfield of the `vrf-target` inside `protocols evpn interconnect` — the EVPN-MPLS (WAN-side) route target. | `1402` |
| `$RT_ID_INTERCONNECT` | **new** Assigned Number of the interconnect `vrf-target`. | `1402` |
| `$VNI` | **new** VXLAN network identifier bound to the instance (`extended-vni-list` / `vxlan vni`). | `1402` |
| `$BD_NAME` | MAC-VRF bridge (VLAN) name. | `EP-TYPE-2-VLAN-1402` |

The `_INTERCONNECT` variables are the same kinds of value as `$RT_AS` /
`$RT_ID` / `$RD_SUB_ASSIGNED`. A body may carry both sets only when it contains a
`protocols evpn interconnect { … }` block: the plain set is the fabric-side
(EVPN-VXLAN) identity and the `_INTERCONNECT` set is the WAN-side (EVPN-MPLS)
identity of the same instance. Outside an interconnect block the `_INTERCONNECT`
names are not used.

## Policy

| Variable | What it is | Example value |
|---|---|---|
| `$POLICY_NAME` | Policy-statement name where the name is the object the body defines. | `lo0` |
| `$PPLB_NAME` | Per-packet load-balance policy name. | `load-balance` |

## Literal values

Values that are JVD-wide constants are left literal because they are what the
JVD documents: BGP group names, the AS numbers and BFD timers inside the
per-device BGP forms (which are complete as-deployed bodies, as in the Metro
Ethernet Business Services library), the `lo0.0` loopback unit, the `fxp0`
management port, `vtep-source-interface lo0.0`, and the VXLAN resource profile
numbers under `forwarding-options vxlan-routing`.

## byoai/TIERS.md

# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd enterprise_wan/ewan_dc_edge`. -->

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

## EVPN-VXLAN to EVPN-MPLS interconnect, VLAN-based with IRB

Family evpn-interconnect, form vlan-based-irb. OS mode Junos. Attachment: IRB unit named by routing-interface; the instance has no attachment interface.

### dc-edge1_mx480 (junos)

- `minimum`: `junos/routing-instances/evpn-interconnect/ri-evpn-interconnect-vlan-based-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: policy-statement:lo0
  - occurrence-selection-required: policy-statement:policy_ospf_bgp

### dc-edge2_mx10003 (junos)

- `minimum`: `junos/routing-instances/evpn-interconnect/ri-evpn-interconnect-vlan-based-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: policy-statement:lo0
  - occurrence-selection-required: policy-statement:policy_ospf_bgp

---

## EVPN-VXLAN to EVPN-MPLS interconnect, VLAN bundle

Family evpn-interconnect, form vlan-bundle. OS mode Junos. Attachment: none in the instance; the bundle shares one VNI toward the fabric.

### dc-edge1_mx480 (junos)

- `minimum`: `junos/routing-instances/evpn-interconnect/ri-evpn-interconnect-vlan-bundle.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-statement:lo0
  - occurrence-selection-required: policy-statement:policy_ospf_bgp

### dc-edge2_mx10003 (junos)

- `minimum`: `junos/routing-instances/evpn-interconnect/ri-evpn-interconnect-vlan-bundle.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-statement:lo0
  - occurrence-selection-required: policy-statement:policy_ospf_bgp

---

## Leaf MAC-VRF, VLAN-based

Family evpn-elan, form mac-vrf-vlan-based. OS mode Junos. Attachment: VLAN logical unit, on an ESI-LAG where the source uses one.

### leaf1_qfx5120-48t (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-mac-vrf-vlan-based.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:lo0

### leaf2_qfx5120-48t (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-mac-vrf-vlan-based.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:lo0

---

## Leaf MAC-VRF, VLAN bundle

Family evpn-elan, form mac-vrf-vlan-bundle. OS mode Junos. Attachment: ESI-LAG interface.

### leaf1_qfx5120-48t (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-mac-vrf-vlan-bundle.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:lo0

### leaf2_qfx5120-48t (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-mac-vrf-vlan-bundle.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:lo0

---

## WAN edge EVPN-MPLS, VLAN-based with IRB routing-interface

Family evpn-elan, form vlan-based-irb. OS mode Junos. Attachment: VLAN logical unit plus IRB unit named by routing-interface.

### wan-edge1_mx204 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: logical-interface:$AC_INTF

---

## WAN edge EVPN-MPLS, VLAN-based with IRB l3-interface

Family evpn-elan, form vlan-based-l3-interface. OS mode Junos. Attachment: VLAN logical unit plus IRB unit named by l3-interface.

### wan-edge2_acx5448-m (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-l3-interface.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: logical-interface:$AC_INTF

---

## WAN edge EVPN-MPLS, VLAN bundle

Family evpn-elan, form vlan-bundle. OS mode Junos. Attachment: VLAN-list logical unit.

### wan-edge1_mx204 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF

### wan-edge2_acx5448-m (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF

---

## WAN edge EVPN-MPLS, VLAN bundle with no-gateway-community

Family evpn-elan, form vlan-bundle-no-gateway-community. OS mode Junos. Attachment: VLAN-list logical unit.

### wan-edge2_acx5448-m (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle-no-gateway-community.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF

---

## byoai/DEFAULTS.md

# DEFAULTS — Enterprise Data Center Edge

Lab auto-fill values for the Enterprise Data Center Edge JVD. Every value is measured from the validated device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks auto-fill; otherwise ask. Variable meanings are in [`_variables.md`](../_variables.md).

## Device inventory

| Role | Device | Platform | OS | `$LOOPBACK_V4` / router-id | `$LOCAL_AS` |
|------|--------|----------|----|----------------------------|-------------|
| DC edge (EVPN-VXLAN ↔ EVPN-MPLS interconnect) | dc-edge1_mx480 | MX480 | Junos | 1.1.1.5 | 65000 |
| DC edge (interconnect) | dc-edge2_mx10003 | MX10003 | Junos | 1.1.1.6 | 65000 |
| WAN edge (EVPN-MPLS) | wan-edge1_mx204 | MX204 | Junos | 1.1.1.10 | 65000 |
| WAN edge (EVPN-MPLS) | wan-edge2_acx5448-m | ACX5448-M | Junos | 1.1.1.9 | 65000 |
| WAN core P | p1_acx7100-48l | ACX7100-48L | EVO | 1.1.1.7 | — |
| WAN core P | p2_ptx10001-36mr | PTX10001-36MR | EVO | 1.1.1.8 | — |
| DC spine | spine1_qfx5200 | QFX5200 | Junos | 1.1.1.3 | 65000 |
| DC spine | spine2_qfx5200 | QFX5200 | Junos | 1.1.1.4 | — |
| DC leaf (EVPN-VXLAN) | leaf1_qfx5120-48t | QFX5120-48T | Junos | 1.1.1.1 | 65000 |
| DC leaf (EVPN-VXLAN) | leaf2_qfx5120-48t | QFX5120-48T | Junos | 1.1.1.2 | 65000 |
| Top-of-rack access | tor1_ex4200-48t | EX4200-48T | Junos | — | — |
| Top-of-rack access | tor2_ex4200-48t | EX4200-48T | Junos | — | — |

"—" means the device configuration does not set that value. Do not invent one; ask the user if a requested snippet needs it.

## Service examples (first validated instance per device)

| Service form | Device | Example values |
|--------------|--------|----------------|
| Interconnect VLAN-based IRB | dc-edge1 / dc-edge2 | `Interconnect_Instance3226`, `$IRB_UNIT` 3226, `$VNI` 3226, `$RT_AS:$RT_ID` 100:3226, `$RD_SUB_ASSIGNED` 8223, interconnect RD/RT 3226 / 3226:3226, `$ESI` `00:61:01:00:11:22:03:04:05:06` |
| Interconnect VLAN bundle | dc-edge1 / dc-edge2 | `Interconnect_VBundle_Instance1`, `$VNI` 701, `$RT_AS:$RT_ID` 100:701, `$RD_SUB_ASSIGNED` 6000, interconnect RD/RT 701 / 701:701, `$ESI` `00:45:55:65:75:85:95:15:25:35` |
| Leaf MAC-VRF VLAN-based | leaf1 / leaf2 | `MACVRF-Instance1402`, `$BD_NAME` `EP-TYPE-2-VLAN-1402`, `$AC_INTF` ae33.1402, `$VNI` 1402, `$RT_AS:$RT_ID` 100:1402, `$RD_SUB_ASSIGNED` 7000 |
| Leaf MAC-VRF VLAN bundle | leaf1 / leaf2 | `MACVRF-VBundle-Instance1`, `$BD_NAME` `VLANS-701-780`, `$AC_INTF` ae16.0, `$VNI` 701, `$RT_AS:$RT_ID` 100:701, `$RD_SUB_ASSIGNED` 6000 (leaf1) / 6001 (leaf2) |
| WAN edge VLAN-based IRB | wan-edge1 | `EVPN_SH_VBased_1402`, `$AC_INTF` xe-0/1/4.1402, `$IRB_UNIT` 1402, RD sub / RT 1402 / 1402:1402 |
| WAN edge VLAN-based l3-interface | wan-edge2 | `ACX_EVPN_SH_VBased_2704`, `$AC_INTF` xe-0/0/2.2704, `$IRB_UNIT` 2704, RD sub / RT 2704 / 2704:2704 |
| WAN edge VLAN bundle | wan-edge1 / wan-edge2 | `EVPN_SH_VBundle_VLAN1021-1100` (xe-0/1/4.1021, 1021) / `ACX_EVPN_SH_VBundle_VLAN2188-2272` (xe-0/0/2.2188, 2188) |
| WAN edge VLAN bundle, no-gateway-community | wan-edge2 | `ACX_EVPN_SH_VBundle_VLAN2103-2187`, `$AC_INTF` xe-0/0/2.2103, RD sub / RT 2103 / 2103:2103 |

IRB virtual gateway: `$VG_MAC` is `00:00:5e:00:00:04` on every measured IRB unit; `$VGA` is the `.254` host of the IRB subnet, and each device takes its own host address in the same subnet (for example `irb.2` 10.0.101.1/24 on dc-edge1 and 10.0.101.2/24 on dc-edge2, gateway 10.0.101.254).

## Numbering conventions (hold on every measured instance)

| Service form | Convention |
|--------------|------------|
| Interconnect (both forms) | `$RT_AS` = 100. `$RT_ID` = `$VNI` = `$RD_SUB_INTERCONNECT` = `$RT_AS_INTERCONNECT` = `$RT_ID_INTERCONNECT`; the VLAN-based form also uses the same number for `$IRB_UNIT`. Both DC edges use the same values and the same `$ESI`; only `$LOOPBACK_V4` differs. |
| Leaf MAC-VRF (both forms) | `$RT_AS` = 100 and `$RT_ID` = `$VNI`. |
| WAN edge VLAN-based (IRB and l3-interface) | `$RD_SUB_ASSIGNED` = `$RT_AS` = `$RT_ID` = `$IRB_UNIT` = the unit number of `$AC_INTF`. |
| WAN edge VLAN bundle (both forms) | `$RD_SUB_ASSIGNED` = `$RT_AS` = `$RT_ID` = the unit number of `$AC_INTF`. |

For `N` services, auto-fill increments the per-service number from the example's starting value and keeps the conventions above. `$RD_SUB_ASSIGNED` on the interconnect and MAC-VRF forms is not tied to another variable in the source; ask, or keep the example value and state it in `Notes:`.

Route distinguishers use the device's own `$LOOPBACK_V4`. The validated leaf MAC-VRF VLAN-bundle instances carry the peer leaf's loopback in the RD; reproduce that only when the user asks for the as-deployed lab values.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into `jvd-ewan-dc-edge-snips.md` by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: minimum
# devices:
#   dc-edge1: { name: <hostname>, os: junos, loopback4: <addr> }
#   dc-edge2: { ... }
# services:
#   - { kind: <interconnect-vlan-based|interconnect-vlan-bundle|
#              macvrf-vlan-based|macvrf-vlan-bundle|
#              wan-vlan-based-irb|wan-vlan-based-l3-interface|
#              wan-vlan-bundle|wan-vlan-bundle-no-gateway-community>,
#       count: <int>,
#       start_id: <int>,
#       ac_intf: <ifd.unit>,
#       rt: <rt_as:rt_id>,
#       rd_sub: <int> }
# snips_used:
#   - junos/routing-instances/evpn-interconnect/ri-evpn-interconnect-vlan-based-irb.conf
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

- The prerequisites the device must already run: the snip's `Pair with:` entries (for `variant:ewan-bgp-overlay`, the device's `bgp-<device>.conf`) and the requirements TIERS.md lists under the Blocked entry for that device. Name them; do not render them.
- Inputs defaulted because the user did not provide them.
- Cross-device consistency the user must verify: the interconnect instances on dc-edge1 and dc-edge2 use the same instance name, `$ESI`, route targets and interconnect RD subfield; only the loopback differs. In the validated configurations every WAN edge instance's route target equals an interconnect route target (`$RT_AS_INTERCONNECT:$RT_ID_INTERCONNECT`) on the DC edges; keep them equal for the same service.
- For an interconnect instance: the `_INTERCONNECT` variables are the WAN-side (EVPN-MPLS) identity and the plain `$RT_AS` / `$RT_ID` / `$RD_SUB_ASSIGNED` are the data center (EVPN-VXLAN) identity of the same instance (see `_variables.md`).
- For wan-edge1 and wan-edge2: `chassis network-services enhanced-ip` (`junos/chassis/network-services-enhanced-ip.conf`) is the forwarding mode the validated WAN edges run for EVPN and the IRB / virtual-gateway features; confirm it is set before applying a service.
- For wan-edge2 (ACX5448-M): `junos/system/evpn-mh-firewall-profile.conf` is part of the validated baseline for EVPN multihoming.
- Anything that is by-pattern rather than validated on that exact device.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
