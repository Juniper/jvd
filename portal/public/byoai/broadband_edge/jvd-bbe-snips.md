# JVD Broadband Edge snippet library

## evo/chassis/aggregated-devices-ethernet.conf

```
/*
 * Topic: Aggregated Ethernet device-count for the chassis
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 * Count:
 *   agn1_acx7100-32c 1
 *   agn2_acx7100-32c 1
 *   an1_acx7024 1
 *   an2_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7100-48l 1
 *   an5_acx7100-48l 1
 *   cr1_ptx10004 1
 *   total 8
 * Highlights:
 *  - Reserves the aggregated Ethernet interface pool; the count is a chassis-wide ceiling, not a count of bundles in use.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from agn1_acx7100-32c):
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

## evo/forwarding-options/tunnels-udp.conf

```
/*
 * Topic: UDP tunnel decapsulation
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Highlights:
 *  - Enables UDP tunnel decapsulation in the forwarding plane.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    tunnels {
        udp;
    }
}
```

## evo/interfaces/ifd-ae-flexible-lacp-fast-mtu-esi-single-active.conf

```
/*
 * Topic: Access-facing aggregated Ethernet bundle with a single-active ESI and fast LACP
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l
 * Count:
 *   an1_acx7024 1
 *   an2_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7100-48l 1
 *   an5_acx7100-48l 1
 *   total 5
 * Highlights:
 *  - Flexible VLAN tagging and `flexible-ethernet-services` let the bundle carry per-VLAN cross-connect units.
 *  - Single-active ESI with per-ESI DF election; `lacp-oos-on-ndf` holds LACP out of service on the non-designated forwarder.
 *  - Fast-periodic LACP with an explicit system ID, so both access nodes of a multihomed pair present one LACP partner.
 * Pair with: none
 *
 * Variables (example values from an1_acx7024):
 *   $IFD          e.g. ae0
 *   $DESCRIPTION  e.g. R0-AN1-To-R12-SW1
 *   $ESI          e.g. 00:15:15:15:00:00:00:15:15:15
 *   $LACP_SYS_ID  e.g. 00:00:00:00:01:01
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        flexible-vlan-tagging;
        mtu 9102;
        encapsulation flexible-ethernet-services;
        esi {
            $ESI;
            single-active;
            df-election-granularity {
                per-esi {
                    lacp-oos-on-ndf;
                }
            }
        }
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

## evo/interfaces/ifd-ae-flexible-lacp-fast-mtu.conf

```
/*
 * Topic: Access-facing aggregated Ethernet bundle with flexible tagging and fast LACP
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l
 * Count:
 *   an1_acx7024 1
 *   an2_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7100-48l 1
 *   an5_acx7100-48l 1
 *   total 5
 * Highlights:
 *  - Flexible VLAN tagging and `flexible-ethernet-services` let the bundle carry per-VLAN cross-connect units.
 *  - Fast-periodic LACP with an explicit system ID, so both access nodes of a multihomed pair present one LACP partner.
 * Pair with: none
 *
 * Variables (example values from an1_acx7024):
 *   $IFD          e.g. ae1
 *   $DESCRIPTION  e.g. R0-AN1-To-R12-SW1
 *   $LACP_SYS_ID  e.g. 00:00:00:00:02:02
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        flexible-vlan-tagging;
        mtu 9102;
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

## evo/interfaces/ifd-breakout-10g.conf

```
/*
 * Topic: Port channelized into 10G sub-ports
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 2
 *   total 2
 * Highlights:
 *  - Breaks the port into sub-ports running at 10G.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from cr1_ptx10004):
 *   $IFD                 e.g. et-0/0/20
 *   $BREAKOUT_SUB_PORTS  e.g. 4
 */
interfaces {
    $IFD {
        number-of-sub-ports $BREAKOUT_SUB_PORTS;
        speed 10g;
    }
}
```

## evo/interfaces/ifd-core-aggregate-lacp.conf

```
/*
 * Topic: Core aggregated Ethernet bundle with active LACP
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Highlights:
 *  - Point-to-point core bundle; LACP runs in active mode at the default (slow) rate.
 * Pair with: none
 *
 * Variables (example values from cr1_ptx10004):
 *   $IFD          e.g. ae1
 *   $DESCRIPTION  e.g. R11-CR1-To-R10-BNG4
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        aggregated-ether-options {
            lacp {
                active;
            }
        }
    }
}
```

## evo/interfaces/ifd-core-aggregate-vlan-tagging-min-links-lacp.conf

```
/*
 * Topic: Core aggregated Ethernet bundle with VLAN tagging, minimum links and active LACP
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c
 * Count:
 *   agn1_acx7100-32c 1
 *   agn2_acx7100-32c 1
 *   total 2
 * Highlights:
 *  - `vlan-tagging` lets the bundle carry VLAN-tagged core units.
 *  - The bundle stays up only while at least two members are up.
 * Pair with: none
 *
 * Variables (example values from agn1_acx7100-32c):
 *   $IFD          e.g. ae0
 *   $DESCRIPTION  e.g. R5-AGN1-To-R6-AGN2
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        vlan-tagging;
        aggregated-ether-options {
            minimum-links 2;
            lacp {
                active;
            }
        }
    }
}
```

## evo/interfaces/ifd-core-lag-member-ether-description-100g.conf

```
/*
 * Topic: Described 100G physical member of a core aggregated Ethernet bundle
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Highlights:
 *  - Runs the port at 100G and joins it to the bundle through `ether-options 802.3ad`.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from cr1_ptx10004):
 *   $CORE_INTF    e.g. et-0/0/29
 *   $DESCRIPTION  e.g. R11-CR1-To-R10-BNG4-AE-MEMBER2
 *   $AE_BUNDLE    e.g. ae1
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

## evo/interfaces/ifd-core-lag-member-ether-description.conf

```
/*
 * Topic: Described physical member of a core aggregated Ethernet bundle
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Highlights:
 *  - Joins the port to the bundle through `ether-options 802.3ad`.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from cr1_ptx10004):
 *   $CORE_INTF    e.g. et-0/0/6
 *   $DESCRIPTION  e.g. R11-CR1-To-R10-BNG4-AE-MEMBER1
 *   $AE_BUNDLE    e.g. ae1
 */
interfaces {
    $CORE_INTF {
        description $DESCRIPTION;
        ether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## evo/interfaces/ifd-description-100g.conf

```
/*
 * Topic: Described 100G interface device
 * Seen on:
 *   Junos: (none)
 *   EVO: an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 * Count:
 *   an2_acx7100-48l 2
 *   an3_acx7100-48l 2
 *   an4_acx7100-48l 2
 *   an5_acx7100-48l 2
 *   cr1_ptx10004 2
 *   total 10
 * Highlights:
 *  - Describes the physical port and runs it at 100G; its logical units are configured separately.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from an2_acx7100-48l):
 *   $IFD          e.g. et-0/0/48
 *   $DESCRIPTION  e.g. R1-AN2-To-R5-AGN1
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
 * Topic: Interface device description
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 cr1_ptx10004
 * Count:
 *   agn1_acx7100-32c 8
 *   agn2_acx7100-32c 8
 *   an1_acx7024 2
 *   cr1_ptx10004 5
 *   total 23
 * Highlights:
 *  - Describes the physical port; its logical units are configured separately.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from agn1_acx7100-32c):
 *   $IFD          e.g. et-0/0/2
 *   $DESCRIPTION  e.g. R5-AGN1-To-R0-AN1
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
    }
}
```

## evo/interfaces/ifd-lag-member-ether.conf

```
/*
 * Topic: Physical member of an aggregated Ethernet bundle
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l
 * Count:
 *   agn1_acx7100-32c 2
 *   agn2_acx7100-32c 2
 *   an1_acx7024 2
 *   an2_acx7100-48l 2
 *   an3_acx7100-48l 2
 *   an4_acx7100-48l 2
 *   an5_acx7100-48l 2
 *   total 14
 * Highlights:
 *  - Joins the port to the bundle through `ether-options 802.3ad`.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from an1_acx7024):
 *   $IFD        e.g. et-0/0/4
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

## evo/interfaces/ifd-speed-100g.conf

```
/*
 * Topic: Port speed 100G
 * Seen on:
 *   Junos: (none)
 *   EVO: an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 * Count:
 *   an2_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7100-48l 1
 *   an5_acx7100-48l 1
 *   cr1_ptx10004 1
 *   total 5
 * Highlights:
 *  - Sets the port to 100G.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from cr1_ptx10004):
 *   $IFD  e.g. et-0/0/4
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
 * Topic: Unused physical port
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Highlights:
 *  - Marks the port `unused`.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from cr1_ptx10004):
 *   $IFD  e.g. et-0/0/21
 */
interfaces {
    $IFD {
        unused;
    }
}
```

## evo/interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-16.conf

```
/*
 * Topic: Core logical interface
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 * Count:
 *   agn1_acx7100-32c 8
 *   agn2_acx7100-32c 8
 *   an1_acx7024 2
 *   an2_acx7100-48l 2
 *   an3_acx7100-48l 2
 *   an4_acx7100-48l 1
 *   an5_acx7100-48l 2
 *   cr1_ptx10004 6
 *   total 31
 * Highlights:
 *  - Carries IPv4, IS-IS, IPv6 and MPLS; `maximum-labels 16` allows deep segment-routing label stacks.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from agn1_acx7100-32c):
 *   $IFD           e.g. et-0/0/2
 *   $UNIT          e.g. 0
 *   $CORE_V4_ADDR  e.g. 10.10.115.1/24
 *   $CORE_V6_ADDR  e.g. 2001:db8::10:10:115:1:1/120
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
                maximum-labels 16;
            }
        }
    }
}
```

## evo/interfaces/ifl-core-inet-iso-inet6-noaddr-mpls-max-labels-16.conf

```
/*
 * Topic: Core logical interface without an IPv6 address
 * Seen on:
 *   Junos: (none)
 *   EVO: an4_acx7100-48l
 * Count:
 *   an4_acx7100-48l 1
 *   total 1
 * Highlights:
 *  - Carries IPv4, IS-IS and MPLS; `family inet6` is enabled without a configured address.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from an4_acx7100-48l):
 *   $IFD           e.g. et-0/0/48
 *   $UNIT          e.g. 0
 *   $CORE_V4_ADDR  e.g. 10.10.35.1/24
 */
interfaces {
    $IFD {
        unit $UNIT {
            family inet {
                address $CORE_V4_ADDR;
            }
            family iso;
            family inet6;
            family mpls {
                maximum-labels 16;
            }
        }
    }
}
```

## evo/interfaces/ifl-core-vlan-inet-iso-inet6-mpls.conf

```
/*
 * Topic: VLAN-tagged core logical interface
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c
 * Count:
 *   agn1_acx7100-32c 2
 *   agn2_acx7100-32c 2
 *   total 4
 * Highlights:
 *  - Carries IPv4, IS-IS, IPv6 and MPLS on one VLAN of a tagged bundle.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from agn1_acx7100-32c):
 *   $IFD           e.g. ae0
 *   $UNIT          e.g. 1
 *   $VLAN          e.g. 1002
 *   $CORE_V4_ADDR  e.g. 10.10.156.1/24
 *   $CORE_V6_ADDR  e.g. 2001:db8::10:10:156:1:1/120
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

## evo/interfaces/ifl-inet-inet6.conf

```
/*
 * Topic: Dual-stack logical interface
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 2
 *   total 2
 * Highlights:
 *  - Carries IPv4 and IPv6 toward an attached server or test port.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from cr1_ptx10004):
 *   $IFD         e.g. et-0/0/20:0
 *   $UNIT        e.g. 0
 *   $AC_ADDR_V4  e.g. 192.0.2.1/24
 *   $AC_ADDR_V6  e.g. 2001:db8::11:11:110:1/120
 */
interfaces {
    $IFD {
        unit $UNIT {
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

## evo/interfaces/ifl-loopback-primary-iso.conf

```
/*
 * Topic: Loopback logical interface
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 * Count:
 *   agn1_acx7100-32c 1
 *   agn2_acx7100-32c 1
 *   an1_acx7024 1
 *   an2_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7100-48l 1
 *   an5_acx7100-48l 1
 *   cr1_ptx10004 1
 *   total 8
 * Highlights:
 *  - Primary IPv4 and IPv6 loopback addresses plus the IS-IS NET.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from agn1_acx7100-32c):
 *   $UNIT             e.g. 0
 *   $LOOPBACK_V4_PFX  e.g. 192.168.0.5/32
 *   $ISIS_NET         e.g. 49.0000.0010.0100.0005.00
 *   $LOOPBACK_V6_PFX  e.g. 2001:db8::192:168:0:5/128
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

## evo/interfaces/ifl-loopback-primary.conf

```
/*
 * Topic: Loopback logical interface for a routing instance
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Highlights:
 *  - Primary IPv4 and IPv6 addresses on an additional loopback unit.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from cr1_ptx10004):
 *   $UNIT             e.g. 11
 *   $LOOPBACK_V4_PFX  e.g. 192.168.11.11/32
 *   $LOOPBACK_V6_PFX  e.g. 2001:db8::192:168:11:11/128
 */
interfaces {
    lo0 {
        unit $UNIT {
            family inet {
                address $LOOPBACK_V4_PFX {
                    primary;
                }
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

## evo/interfaces/ifl-vlan-ccc-esi-all-active-family-ccc.conf

```
/*
 * Topic: Single-tagged cross-connect logical interface with an all-active ESI
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l
 * Count:
 *   an1_acx7024 10
 *   an2_acx7100-48l 10
 *   an3_acx7100-48l 10
 *   an4_acx7100-48l 10
 *   an5_acx7100-48l 10
 *   total 50
 * Highlights:
 *  - One VLAN of the access bundle handed to an EVPN-VPWS or EVPN-FXC service as a cross-connect.
 *  - A per-unit all-active ESI multihomes the VLAN across both access nodes.
 * Pair with: none
 *
 * Peers with:
 *   [an1_acx7024] <-> [an2_acx7100-48l]
 *   [an3_acx7100-48l] <-> [an4_acx7100-48l]
 *   [an3_acx7100-48l] <-> [an5_acx7100-48l]
 *   [an4_acx7100-48l] <-> [an5_acx7100-48l]
 * Variables (example values from an1_acx7024):
 *   $IFD   e.g. ae1
 *   $UNIT  e.g. 1031
 *   $VLAN  e.g. 1031
 *   $ESI   e.g. 00:10:11:11:11:11:11:00:00:31
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

## evo/interfaces/ifl-vlan-ccc-family-ccc.conf

```
/*
 * Topic: Single-tagged cross-connect logical interface
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l
 * Count:
 *   an1_acx7024 4
 *   an2_acx7100-48l 4
 *   an3_acx7100-48l 4
 *   an4_acx7100-48l 4
 *   an5_acx7100-48l 4
 *   total 20
 * Highlights:
 *  - One VLAN of the access bundle handed to an EVPN-VPWS or EVPN-FXC service as a cross-connect.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from an1_acx7024):
 *   $IFD   e.g. ae0
 *   $UNIT  e.g. 1061
 *   $VLAN  e.g. 1061
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

## evo/policy-options/community/cm-pppoe-subs-comm-1.conf

```
/*
 * Topic: Route-target community PPPOE_SUBS_COMM_1 for PPPoE subscriber direct routes
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from cr1_ptx10004):
 *   $RT_AS  e.g. 20000
 *   $RT_ID  e.g. 1031
 */
policy-options {
    community PPPOE_SUBS_COMM_1 members target:$RT_AS:$RT_ID;
}
```

## evo/policy-options/community/cm-pppoe-subs-comm-2.conf

```
/*
 * Topic: Route-target community PPPOE_SUBS_COMM_2 for PPPoE subscriber aggregates
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from cr1_ptx10004):
 *   $RT_AS  e.g. 20000
 *   $RT_ID  e.g. 1032
 */
policy-options {
    community PPPOE_SUBS_COMM_2 members target:$RT_AS:$RT_ID;
}
```

## evo/policy-options/community/cm-ps-dhcpsubs-comm-2.conf

```
/*
 * Topic: Route-target community PS-DHCPSUBS-COMM_2 for DHCP subscriber access routes
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from cr1_ptx10004):
 *   $RT_AS  e.g. 65000
 *   $RT_ID  e.g. 1132
 */
policy-options {
    community PS-DHCPSUBS-COMM_2 members target:$RT_AS:$RT_ID;
}
```

## evo/policy-options/community/cm-ps-dhcpsubs-comm.conf

```
/*
 * Topic: Route-target community PS-DHCPSUBS-COMM for DHCP subscriber direct routes
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from cr1_ptx10004):
 *   $RT_AS  e.g. 65000
 *   $RT_ID  e.g. 1131
 */
policy-options {
    community PS-DHCPSUBS-COMM members target:$RT_AS:$RT_ID;
}
```

## evo/policy-options/community/cm-ps-internet-comm.conf

```
/*
 * Topic: Route-target community PS-Internet-COMM for Internet VRF routes
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from cr1_ptx10004):
 *   $RT_AS  e.g. 100
 *   $RT_ID  e.g. 1
 */
policy-options {
    community PS-Internet-COMM members target:$RT_AS:$RT_ID;
}
```

## evo/policy-options/community/cm-ps-radius-comm.conf

```
/*
 * Topic: Route-target community PS-RADIUS-COMM for RADIUS VRF routes
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from cr1_ptx10004):
 *   $RT_AS  e.g. 11111
 *   $RT_ID  e.g. 1111
 */
policy-options {
    community PS-RADIUS-COMM members target:$RT_AS:$RT_ID;
}
```

## evo/policy-options/policy-statement/ps-bgp-rr-export.conf

```
/*
 * Topic: Route-reflector export policy PS-BGP-RR-EXPORT with next-hop self for core loopbacks
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c cr1_ptx10004
 * Count:
 *   agn1_acx7100-32c 1
 *   agn2_acx7100-32c 1
 *   cr1_ptx10004 1
 *   total 3
 * Highlights:
 *  - Sets next-hop self on routes matching `PL-CORE`.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement PS-BGP-RR-EXPORT {
        term CORE-NHS {
            from {
                prefix-list PL-CORE;
            }
            then {
                next-hop self;
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-client-rr-export.conf

```
/*
 * Topic: Route-reflector client export policy PS-CLIENT-RR-EXPORT for access-region loopbacks
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c cr1_ptx10004
 * Count:
 *   agn1_acx7100-32c 1
 *   agn2_acx7100-32c 1
 *   cr1_ptx10004 1
 *   total 3
 * Highlights:
 *  - Accepts routes matching `PL-AN-REGION`.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement PS-CLIENT-RR-EXPORT {
        term LOOPBACKS {
            from {
                prefix-list PL-AN-REGION;
            }
            then accept;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-isis-export.conf

```
/*
 * Topic: IS-IS export policy PS-ISIS-EXPORT carrying the node loopbacks with their prefix segments
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 * Count:
 *   agn1_acx7100-32c 1
 *   agn2_acx7100-32c 1
 *   an1_acx7024 1
 *   an2_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7100-48l 1
 *   an5_acx7100-48l 1
 *   cr1_ptx10004 1
 *   total 8
 * Highlights:
 *  - `term OOB-MGMT` rejects routes on the out-of-band management interfaces.
 *  - The loopback terms accept the node's own IPv4 and IPv6 loopbacks and attach a node segment index to each.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from agn1_acx7100-32c):
 *   $LOOPBACK_V4  e.g. 192.168.0.5
 *   $SR_INDEX_V4  e.g. 1005
 *   $LOOPBACK_V6  e.g. 2001:db8::192:168:0:5
 *   $SR_INDEX_V6  e.g. 4005
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
                prefix-segment {
                    index $SR_INDEX_V4;
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
                prefix-segment {
                    index $SR_INDEX_V6;
                    node-segment;
                }
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-pplb.conf

```
/*
 * Topic: Per-packet load-balance policy PS-PPLB
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 * Count:
 *   agn1_acx7100-32c 1
 *   agn2_acx7100-32c 1
 *   an1_acx7024 1
 *   an2_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7100-48l 1
 *   an5_acx7100-48l 1
 *   cr1_ptx10004 1
 *   total 8
 * Highlights:
 *  - A single unconditional term; exported to the forwarding table.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement PS-PPLB {
        then {
            load-balance per-packet;
            accept;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-radius-vrf-export.conf

```
/*
 * Topic: VRF export policy PS-RADIUS-VRF-EXPORT
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Highlights:
 *  - Tags direct routes with `PS-RADIUS-COMM` and next-hop self.
 * Pair with:
 *  - evo/policy-options/community/cm-ps-radius-comm.conf
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement PS-RADIUS-VRF-EXPORT {
        term 1 {
            from protocol direct;
            then {
                community add PS-RADIUS-COMM;
                next-hop self;
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-radius-vrf-import-subscribers.conf

```
/*
 * Topic: VRF import policy PS-RADIUS-VRF-IMPORT that also imports the subscriber routes
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Highlights:
 *  - Imports routes tagged with the PPPoE and DHCP subscriber direct-route communities, plus routes tagged `PS-RADIUS-COMM`.
 * Pair with:
 *  - evo/policy-options/community/cm-pppoe-subs-comm-1.conf
 *  - evo/policy-options/community/cm-ps-dhcpsubs-comm.conf
 *  - evo/policy-options/community/cm-ps-radius-comm.conf
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement PS-RADIUS-VRF-IMPORT {
        term 2 {
            from community [ PPPOE_SUBS_COMM_1 PS-DHCPSUBS-COMM ];
            then accept;
        }
        term 1 {
            from community PS-RADIUS-COMM;
            then accept;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-redis-ospf.conf

```
/*
 * Topic: OSPF export policy PS-REDIS-OSPF redistributing BGP routes
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Highlights:
 *  - Accepts BGP routes for export into OSPF.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement PS-REDIS-OSPF {
        term 1 {
            from protocol bgp;
            then accept;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-v6-default.conf

```
/*
 * Topic: Export policy PS-V6-default for the Internet VRF IPv6 default route
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Highlights:
 *  - Exports `::/0` from VRF `VRF_Internet` with community `PS-Internet-COMM` and an explicit IPv6 next hop, and rejects everything else.
 * Pair with:
 *  - evo/policy-options/community/cm-ps-internet-comm.conf
 *  - evo/routing-instances/l3vpn/ri-vrf-internet.conf
 *
 * Peers with: n/a
 * Variables (example values from cr1_ptx10004):
 *   $NEXT_HOP_V6  e.g. 2001:db8::192:168:0:b
 */
policy-options {
    policy-statement PS-V6-default {
        term 1 {
            from {
                instance VRF_Internet;
                route-filter ::/0 exact;
            }
            then {
                community add PS-Internet-COMM;
                next-hop $NEXT_HOP_V6;
                accept;
            }
        }
        term 2 {
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/stop-leak.conf

```
/*
 * Topic: IS-IS policy stop_leak blocking level 1 to level 2 leaking
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Highlights:
 *  - Rejects level 1 routes from being exported into level 2.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement stop_leak {
        term 1 {
            from level 1;
            to level 2;
            then reject;
        }
    }
}
```

## evo/policy-options/policy-statement/vrf-internet-export.conf

```
/*
 * Topic: VRF export policy VRF_Internet_export for the IPv4 and IPv6 default routes
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Highlights:
 *  - Exports `0.0.0.0/0` and `::/0` with community `PS-Internet-COMM` and explicit next hops.
 * Pair with:
 *  - evo/policy-options/community/cm-ps-internet-comm.conf
 *
 * Peers with: n/a
 * Variables (example values from cr1_ptx10004):
 *   $NEXT_HOP_V4  e.g. 192.168.0.11
 *   $NEXT_HOP_V6  e.g. 2001:db8::192:168:0:b
 */
policy-options {
    policy-statement VRF_Internet_export {
        term 1 {
            from {
                route-filter 0.0.0.0/0 exact;
            }
            then {
                community add PS-Internet-COMM;
                next-hop $NEXT_HOP_V4;
                accept;
            }
        }
        term 2 {
            from {
                route-filter ::/0 exact;
            }
            then {
                community add PS-Internet-COMM;
                next-hop $NEXT_HOP_V6;
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/vrf-internet-import.conf

```
/*
 * Topic: VRF import policy VRF_Internet_import for the subscriber routes
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Highlights:
 *  - Imports Internet routes and the PPPoE and DHCP subscriber aggregates and access routes.
 * Pair with:
 *  - evo/policy-options/community/cm-pppoe-subs-comm-2.conf
 *  - evo/policy-options/community/cm-ps-dhcpsubs-comm-2.conf
 *  - evo/policy-options/community/cm-ps-internet-comm.conf
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement VRF_Internet_import {
        term 1 {
            from community PS-Internet-COMM;
            then accept;
        }
        term 2 {
            from community PPPOE_SUBS_COMM_2;
            then accept;
        }
        term 3 {
            from community PS-DHCPSUBS-COMM_2;
            then accept;
        }
    }
}
```

## evo/policy-options/prefix-list/pl-an-region-agn.conf

```
/*
 * Topic: Prefix-list PL-AN-REGION with the access-node loopbacks
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c
 * Count:
 *   agn1_acx7100-32c 1
 *   agn2_acx7100-32c 1
 *   total 2
 * Highlights:
 *  - As-deployed list of the five access-node loopbacks.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    prefix-list PL-AN-REGION {
        192.168.0.0/32;
        192.168.0.1/32;
        192.168.0.2/32;
        192.168.0.3/32;
        192.168.0.4/32;
    }
}
```

## evo/policy-options/prefix-list/pl-an-region-cr.conf

```
/*
 * Topic: Prefix-list PL-AN-REGION with the access-node and BNG1/BNG2 loopbacks
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Highlights:
 *  - As-deployed list of the five access-node loopbacks plus bng1 and bng2.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    prefix-list PL-AN-REGION {
        192.168.0.0/32;
        192.168.0.1/32;
        192.168.0.2/32;
        192.168.0.3/32;
        192.168.0.4/32;
        192.168.0.7/32;
        192.168.0.8/32;
    }
}
```

## evo/policy-options/prefix-list/pl-bng.conf

```
/*
 * Topic: Prefix-list PL-BNG with the BNG loopbacks
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Highlights:
 *  - As-deployed list of the four BNG loopbacks.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    prefix-list PL-BNG {
        192.168.0.7/32;
        192.168.0.8/32;
        192.168.0.9/32;
        192.168.0.10/32;
    }
}
```

## evo/policy-options/prefix-list/pl-core-agn.conf

```
/*
 * Topic: Prefix-list PL-CORE with the BNG1/BNG2 and core-router loopbacks
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c
 * Count:
 *   agn1_acx7100-32c 1
 *   agn2_acx7100-32c 1
 *   total 2
 * Highlights:
 *  - As-deployed list of bng1, bng2 and cr1 loopbacks.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    prefix-list PL-CORE {
        192.168.0.7/32;
        192.168.0.8/32;
        192.168.0.11/32;
    }
}
```

## evo/policy-options/prefix-list/pl-core-cr.conf

```
/*
 * Topic: Prefix-list PL-CORE with the BNG3/BNG4 loopbacks
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Highlights:
 *  - As-deployed list of bng3 and bng4 loopbacks.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    prefix-list PL-CORE {
        192.168.0.9/32;
        192.168.0.10/32;
    }
}
```

## evo/protocols/bgp-overlay-agn.conf

```
/*
 * Topic: iBGP route reflector for the access fabric and the core
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c
 * Count:
 *   agn1_acx7100-32c 1
 *   agn2_acx7100-32c 1
 *   total 2
 * Variant group: bbe-bgp-overlay
 *   Provides: evpn, labeled-unicast
 * Highlights:
 *  - Two client groups share the node's own loopback as cluster ID: `GR-IBGP-FABRIC-RR` for the access nodes and `GR-IBGP-CR` toward the BNGs and the core router.
 *  - `advertise-from-main-vpn-tables` and `vpn-apply-export` let the reflector advertise VPN routes from the main tables through export policy.
 *  - IPv4 and IPv6 labeled-unicast install BGP-LU transport routes in `inet.3` / `inet6.3` for the EVPN service next hops.
 *  - BFD (100 ms x 3) protects every session.
 * Pair with: none
 *
 * Peers with:
 *   [agn1_acx7100-32c] <-> [an1_acx7024]
 *   [agn1_acx7100-32c] <-> [an2_acx7100-48l]
 *   [agn1_acx7100-32c] <-> [an3_acx7100-48l]
 *   [agn1_acx7100-32c] <-> [an4_acx7100-48l]
 *   [agn1_acx7100-32c] <-> [an5_acx7100-48l]
 *   [agn1_acx7100-32c] <-> [bng1_mx304]
 *   [agn1_acx7100-32c] <-> [bng2_mx204]
 *   [agn1_acx7100-32c] <-> [cr1_ptx10004]
 *   [agn2_acx7100-32c] <-> [an1_acx7024]
 *   [agn2_acx7100-32c] <-> [an2_acx7100-48l]
 *   [agn2_acx7100-32c] <-> [an3_acx7100-48l]
 *   [agn2_acx7100-32c] <-> [an4_acx7100-48l]
 *   [agn2_acx7100-32c] <-> [an5_acx7100-48l]
 *   [agn2_acx7100-32c] <-> [bng1_mx304]
 *   [agn2_acx7100-32c] <-> [bng2_mx204]
 *   [agn2_acx7100-32c] <-> [cr1_ptx10004]
 * Variables (example values from agn1_acx7100-32c):
 *   $LOOPBACK_V4  e.g. 192.168.0.5
 */
protocols {
    bgp {
        advertise-from-main-vpn-tables;
        vpn-apply-export;
        group GR-IBGP-FABRIC-RR {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
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
            family evpn {
                signaling;
            }
            cluster $LOOPBACK_V4;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 192.168.0.0;
            neighbor 192.168.0.1;
            neighbor 192.168.0.2;
            neighbor 192.168.0.3;
            neighbor 192.168.0.4;
        }
        group GR-IBGP-CR {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
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
            family evpn {
                signaling;
            }
            cluster $LOOPBACK_V4;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 192.168.0.7;
            neighbor 192.168.0.8;
            neighbor 192.168.0.11;
        }
    }
}
```

## evo/protocols/bgp-overlay-an.conf

```
/*
 * Topic: iBGP overlay sessions from an access node to its route reflectors
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l
 * Count:
 *   an1_acx7024 1
 *   an2_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7100-48l 1
 *   an5_acx7100-48l 1
 *   total 5
 * Variant group: bbe-bgp-overlay
 *   Provides: evpn, labeled-unicast
 * Highlights:
 *  - IPv4 and IPv6 labeled-unicast install BGP-LU transport routes in `inet.3` / `inet6.3` for the EVPN service next hops.
 *  - EVPN signaling carries the EVPN-VPWS and FXC subscriber services.
 *  - BFD (100 ms x 3) protects every session.
 * Pair with: none
 *
 * Peers with:
 *   [agn1_acx7100-32c] <-> [an1_acx7024]
 *   [agn1_acx7100-32c] <-> [an2_acx7100-48l]
 *   [agn1_acx7100-32c] <-> [an3_acx7100-48l]
 *   [agn1_acx7100-32c] <-> [an4_acx7100-48l]
 *   [agn1_acx7100-32c] <-> [an5_acx7100-48l]
 *   [agn2_acx7100-32c] <-> [an1_acx7024]
 *   [agn2_acx7100-32c] <-> [an2_acx7100-48l]
 *   [agn2_acx7100-32c] <-> [an3_acx7100-48l]
 *   [agn2_acx7100-32c] <-> [an4_acx7100-48l]
 *   [agn2_acx7100-32c] <-> [an5_acx7100-48l]
 * Variables (example values from an1_acx7024):
 *   $LOOPBACK_V4  e.g. 192.168.0.0
 *   $RR1_V4       e.g. 192.168.0.5
 *   $RR2_V4       e.g. 192.168.0.6
 */
protocols {
    bgp {
        group GR-IBGP-AN {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
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
            family evpn {
                signaling;
            }
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

## evo/protocols/bgp-overlay-cr.conf

```
/*
 * Topic: iBGP core route reflector for the aggregation nodes and BNGs
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Variant group: bbe-bgp-overlay
 *   Provides: evpn, inet-vpn, inet6-vpn, labeled-unicast
 * Highlights:
 *  - `GR-IBGP-CORE-RR` reflects to the aggregation nodes and BNG pair 1 through `PS-BGP-RR-EXPORT`; `GR-IBGP-CR` reflects to BNG pair 2 through `PS-CLIENT-RR-EXPORT`.
 *  - `accept-remote-nexthop` keeps the advertised next hop of reflected routes; the node's own loopback is the cluster ID.
 *  - `advertise-from-main-vpn-tables` and `vpn-apply-export` let the reflector advertise VPN routes from the main tables through export policy.
 *  - BFD (100 ms x 3) protects every session.
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-bgp-rr-export.conf
 *  - evo/policy-options/policy-statement/ps-client-rr-export.conf
 *
 * Peers with:
 *   [agn1_acx7100-32c] <-> [cr1_ptx10004]
 *   [agn2_acx7100-32c] <-> [cr1_ptx10004]
 *   [bng1_mx304] <-> [cr1_ptx10004]
 *   [bng2_mx204] <-> [cr1_ptx10004]
 *   [bng3_mx10004] <-> [cr1_ptx10004]
 *   [bng4_mx480] <-> [cr1_ptx10004]
 * Variables (example values from cr1_ptx10004):
 *   $LOOPBACK_V4  e.g. 192.168.0.11
 */
protocols {
    bgp {
        advertise-from-main-vpn-tables;
        vpn-apply-export;
        group GR-IBGP-CORE-RR {
            type internal;
            accept-remote-nexthop;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
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
            family evpn {
                signaling;
            }
            export PS-BGP-RR-EXPORT;
            cluster $LOOPBACK_V4;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 192.168.0.5;
            neighbor 192.168.0.6;
            neighbor 192.168.0.7;
            neighbor 192.168.0.8;
        }
        group GR-IBGP-CR {
            type internal;
            accept-remote-nexthop;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
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
            family evpn {
                signaling;
            }
            export PS-CLIENT-RR-EXPORT;
            cluster $LOOPBACK_V4;
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor 192.168.0.9;
            neighbor 192.168.0.10;
        }
    }
}
```

## evo/protocols/isis-intf-l1-tilfa-bfd.conf

```
/*
 * Topic: IS-IS level 1 point-to-point core interface with TI-LFA node protection and BFD
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 * Count:
 *   agn1_acx7100-32c 10
 *   agn2_acx7100-32c 10
 *   an1_acx7024 2
 *   an2_acx7100-48l 2
 *   an3_acx7100-48l 2
 *   an4_acx7100-48l 2
 *   an5_acx7100-48l 2
 *   cr1_ptx10004 4
 *   total 34
 * Highlights:
 *  - `post-convergence-lfa node-protection` computes node-protecting TI-LFA backups on this link.
 *  - Point-to-point adjacency with BFD (100 ms x 3, no adaptation) for fast failure detection.
 * Pair with: none
 *
 * Variables (example values from agn1_acx7100-32c):
 *   $CORE_INTF  e.g. et-0/0/2.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
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

## evo/protocols/isis-intf-l2-tilfa-bfd.conf

```
/*
 * Topic: IS-IS level 2 point-to-point core interface with TI-LFA node protection and BFD
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 2
 *   total 2
 * Highlights:
 *  - `post-convergence-lfa node-protection` computes node-protecting TI-LFA backups on this link.
 *  - Point-to-point adjacency with BFD (100 ms x 3, no adaptation) for fast failure detection.
 * Pair with:
 *  - evo/interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-16.conf
 *
 * Variables (example values from cr1_ptx10004):
 *   $CORE_INTF  e.g. ae1.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 2 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
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

## evo/protocols/isis-loopback-passive.conf

```
/*
 * Topic: IS-IS passive loopback interface
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 * Count:
 *   agn1_acx7100-32c 1
 *   agn2_acx7100-32c 1
 *   an1_acx7024 1
 *   an2_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7100-48l 1
 *   an5_acx7100-48l 1
 *   cr1_ptx10004 1
 *   total 8
 * Highlights:
 *  - Advertises the lo0.0 loopback into IS-IS without forming adjacencies.
 * Pair with:
 *  - evo/interfaces/ifl-loopback-primary-iso.conf
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

## evo/protocols/isis-srmpls-tilfa-l1-l2.conf

```
/*
 * Topic: IS-IS level 1 and level 2 instance with SR-MPLS TI-LFA and two export policies
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Highlights:
 *  - Runs both levels with wide metrics, joining the level 1 access domain to the level 2 core.
 *  - Exports through `PS-ISIS-EXPORT` and `stop_leak` in order.
 *  - Segment-routing TI-LFA backups (`use-post-convergence-lfa`, `use-source-packet-routing`) with microloop avoidance after convergence.
 *  - `traffic-engineering l3-unicast-topology` exports the IS-IS topology for traffic engineering.
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-isis-export.conf
 *  - evo/policy-options/policy-statement/stop-leak.conf
 *
 * Variables: none
 */
protocols {
    isis {
        source-packet-routing explicit-null;
        level 1 wide-metrics-only;
        level 2 wide-metrics-only;
        spf-options {
            microloop-avoidance {
                post-convergence-path {
                    delay 5000;
                }
            }
            multipath {
                weighted one-hop;
            }
        }
        backup-spf-options {
            use-post-convergence-lfa maximum-labels 5;
            use-source-packet-routing;
        }
        traffic-engineering {
            l3-unicast-topology;
            advertisement always;
        }
        export [ PS-ISIS-EXPORT stop_leak ];
    }
}
```

## evo/protocols/isis-srmpls-tilfa-l1.conf

```
/*
 * Topic: IS-IS level 1 instance with SR-MPLS TI-LFA
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l
 * Count:
 *   agn1_acx7100-32c 1
 *   agn2_acx7100-32c 1
 *   an1_acx7024 1
 *   an2_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7100-48l 1
 *   an5_acx7100-48l 1
 *   total 7
 * Highlights:
 *  - Runs level 1 only (`level 2 disable`) with wide metrics.
 *  - Segment-routing TI-LFA backups (`use-post-convergence-lfa`, `use-source-packet-routing`) with microloop avoidance after convergence.
 *  - `traffic-engineering l3-unicast-topology` exports the IS-IS topology for traffic engineering.
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-isis-export.conf
 *
 * Variables: none
 */
protocols {
    isis {
        source-packet-routing explicit-null;
        level 1 wide-metrics-only;
        level 2 disable;
        spf-options {
            microloop-avoidance {
                post-convergence-path {
                    delay 5000;
                }
            }
            multipath {
                weighted one-hop;
            }
        }
        backup-spf-options {
            use-post-convergence-lfa maximum-labels 5;
            use-source-packet-routing;
        }
        traffic-engineering {
            l3-unicast-topology;
            advertisement always;
        }
        export PS-ISIS-EXPORT;
    }
}
```

## evo/protocols/lldp-interface-all.conf

```
/*
 * Topic: LLDP enabled on all interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: agn2_acx7100-32c cr1_ptx10004
 * Count:
 *   agn2_acx7100-32c 1
 *   cr1_ptx10004 1
 *   total 2
 * Pair with: none
 *
 * Variables: none
 */
protocols {
    lldp {
        interface all;
    }
}
```

## evo/protocols/mpls-srgb-ipv6-tunneling.conf

```
/*
 * Topic: MPLS segment-routing global block with IPv6 tunneling
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 * Count:
 *   agn1_acx7100-32c 1
 *   agn2_acx7100-32c 1
 *   an1_acx7024 1
 *   an2_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7100-48l 1
 *   an5_acx7100-48l 1
 *   cr1_ptx10004 1
 *   total 8
 * Highlights:
 *  - `srgb-label-range` reserves the domain-wide segment-routing global block (800000-890000).
 *  - `ipv6-tunneling` resolves IPv6 BGP next hops over the IPv4 MPLS transport.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
protocols {
    mpls {
        label-range {
            srgb-label-range 800000 890000;
        }
        ipv6-tunneling;
    }
}
```

## evo/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-esi.conf

```
/*
 * Topic: EVPN flexible cross-connect (VLAN-unaware) with two attachment units and a group ESI
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l
 * Count:
 *   an1_acx7024 2
 *   an2_acx7100-48l 2
 *   an3_acx7100-48l 2
 *   an4_acx7100-48l 2
 *   an5_acx7100-48l 2
 *   total 10
 * Highlights:
 *  - `flexible-cross-connect-vlan-unaware` carries both attachment units under one service-id pair, so one EVPN-VPWS service serves several access VLANs.
 *  - The group ESI multihomes the cross-connect group; `label-allocation per-instance` allocates one MPLS label for the instance.
 * Pair with:
 *  - evo/interfaces/ifl-vlan-ccc-family-ccc.conf
 *  - variant:bbe-bgp-overlay families=evpn
 *
 * Variables (example values from an1_acx7024 / METRO_BBE_EVPN_FXC_IPoE-GROUP_1):
 *   $INSTANCE_NAME    e.g. METRO_BBE_EVPN_FXC_IPoE-GROUP_1
 *   $ESI              e.g. 00:15:15:15:00:00:00:15:15:15
 *   $IFD              e.g. ae0
 *   $UNIT_A           e.g. 1065
 *   $UNIT_B           e.g. 1066
 *   $SVC_ID_LOCAL     e.g. 5002
 *   $SVC_ID_REMOTE    e.g. 6002
 *   $RD_SUB_ADMIN     e.g. 100.100.100.100
 *   $RD_SUB_ASSIGNED  e.g. 3001
 *   $RT_AS            e.g. 60000
 *   $RT_ID            e.g. 3001
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                label-allocation per-instance;
                flexible-cross-connect-vlan-unaware;
                group fxc {
                    esi {
                        $ESI;
                    }
                    interface $IFD.$UNIT_A;
                    interface $IFD.$UNIT_B;
                    service-id {
                        local $SVC_ID_LOCAL;
                        remote $SVC_ID_REMOTE;
                    }
                }
            }
        }
        interface $IFD.$UNIT_A;
        interface $IFD.$UNIT_B;
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf

```
/*
 * Topic: EVPN-VPWS routing instance with one attachment circuit
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l
 * Count:
 *   an1_acx7024 10
 *   an2_acx7100-48l 10
 *   an3_acx7100-48l 10
 *   an4_acx7100-48l 10
 *   an5_acx7100-48l 10
 *   total 50
 * Highlights:
 *  - One attachment circuit per instance, identified to the remote PE by the vpws-service-id local/remote pair.
 * Pair with:
 *  - evo/interfaces/ifl-vlan-ccc-esi-all-active-family-ccc.conf
 *  - variant:bbe-bgp-overlay families=evpn
 *
 * Peers with:
 *   [an1_acx7024] <-> [bng1_mx304, bng2_mx204, bng3_mx10004, bng4_mx480]
 *   [an2_acx7100-48l] <-> [bng1_mx304, bng2_mx204, bng3_mx10004, bng4_mx480]
 *   [an3_acx7100-48l] <-> [bng1_mx304, bng2_mx204, bng3_mx10004, bng4_mx480]
 *   [an4_acx7100-48l] <-> [bng1_mx304, bng2_mx204, bng3_mx10004, bng4_mx480]
 *   [an5_acx7100-48l] <-> [bng1_mx304, bng2_mx204, bng3_mx10004, bng4_mx480]
 * Variables (example values from an1_acx7024):
 *   $INSTANCE_NAME       e.g. METRO_BBE_EVPN_VPWS_IPoE_GROUP_1
 *   $AC_IFL              e.g. ae1.1031
 *   $VPWS_SVC_ID_LOCAL   e.g. 1
 *   $VPWS_SVC_ID_REMOTE  e.g. 21
 *   $RD_SUB_ADMIN        e.g. 100.100.100.100
 *   $RD_SUB_ASSIGNED     e.g. 1041
 *   $RT_AS               e.g. 60000
 *   $RT_ID               e.g. 1041
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
            }
        }
        interface $AC_IFL;
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## evo/routing-instances/l3vpn/ri-radius-server-ospf.conf

```
/*
 * Topic: RADIUS VRF attaching the RADIUS server with OSPF
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Highlights:
 *  - Runs OSPF area 0 toward the RADIUS server segment and redistributes BGP-learned routes into it through `PS-REDIS-OSPF`.
 *  - Imports and exports routes through `PS-RADIUS-VRF-IMPORT` and `PS-RADIUS-VRF-EXPORT`, with an additional `vrf-target`.
 * Pair with:
 *  - evo/interfaces/ifl-loopback-primary.conf
 *  - evo/policy-options/policy-statement/ps-radius-vrf-export.conf
 *  - evo/policy-options/policy-statement/ps-radius-vrf-import-subscribers.conf
 *  - evo/policy-options/policy-statement/ps-redis-ospf.conf
 *
 * Variables (example values from cr1_ptx10004):
 *   $AC_IFL           e.g. et-0/0/20:0.0
 *   $UNIT             e.g. 11
 *   $RD_SUB_ADMIN     e.g. 111.111.111.111
 *   $RD_SUB_ASSIGNED  e.g. 1111
 *   $RT_AS            e.g. 11111
 *   $RT_ID            e.g. 111
 */
routing-instances {
    RADIUS {
        instance-type vrf;
        protocols {
            ospf {
                area 0.0.0.0 {
                    interface $AC_IFL;
                }
                export PS-REDIS-OSPF;
            }
        }
        interface $AC_IFL;
        interface lo0.$UNIT;
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-import PS-RADIUS-VRF-IMPORT;
        vrf-export PS-RADIUS-VRF-EXPORT;
        vrf-target target:$RT_AS:$RT_ID;
        vrf-table-label;
    }
}
```

## evo/routing-instances/l3vpn/ri-vrf-internet.conf

```
/*
 * Topic: Internet VRF with default discard routes and eBGP to the upstream CE
 * Seen on:
 *   Junos: (none)
 *   EVO: cr1_ptx10004
 * Count:
 *   cr1_ptx10004 1
 *   total 1
 * Highlights:
 *  - Originates IPv4 and IPv6 default routes as `discard` for export to the subscriber VRFs.
 *  - eBGP group `CE1` peers with the upstream CE over IPv4 and IPv6, accepting the remote next hop.
 * Pair with:
 *  - evo/interfaces/ifl-inet-inet6.conf
 *  - evo/policy-options/policy-statement/vrf-internet-export.conf
 *  - evo/policy-options/policy-statement/vrf-internet-import.conf
 *
 * Variables (example values from cr1_ptx10004):
 *   $CE_PEER_V4        e.g. 10.11.110.2
 *   $ASN_CUSTOMER_V4   e.g. 200
 *   $CE_PEER_V6        e.g. 2001:db8::11:11:110:2
 *   $ASN_CUSTOMER_V6   e.g. 300
 *   $AC_IFL            e.g. et-0/0/26:1.0
 *   $RD_SUB_ADMIN      e.g. 192.168.0.11
 *   $RD_SUB_ASSIGNED   e.g. 1
 */
routing-instances {
    VRF_Internet {
        instance-type vrf;
        routing-options {
            rib VRF_Internet.inet6.0 {
                static {
                    route ::/0 discard;
                }
            }
            static {
                route 0.0.0.0/0 discard;
            }
        }
        protocols {
            bgp {
                group CE1 {
                    type external;
                    accept-remote-nexthop;
                    family inet {
                        unicast;
                    }
                    neighbor $CE_PEER_V4 {
                        family inet {
                            unicast;
                        }
                        peer-as $ASN_CUSTOMER_V4;
                    }
                    neighbor $CE_PEER_V6 {
                        family inet6 {
                            unicast;
                        }
                        peer-as $ASN_CUSTOMER_V6;
                    }
                }
            }
        }
        interface $AC_IFL;
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-import VRF_Internet_import;
        vrf-export VRF_Internet_export;
        vrf-table-label;
    }
}
```

## evo/routing-options/autonomous-system.conf

```
/*
 * Topic: Device autonomous-system number
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 * Count:
 *   agn1_acx7100-32c 1
 *   agn2_acx7100-32c 1
 *   an1_acx7024 1
 *   an2_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7100-48l 1
 *   an5_acx7100-48l 1
 *   cr1_ptx10004 1
 *   total 8
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from agn1_acx7100-32c):
 *   $ASN  e.g. 65001
 */
routing-options {
    autonomous-system $ASN;
}
```

## evo/routing-options/forwarding-table-pplb-chained-evpn.conf

```
/*
 * Topic: Forwarding table with per-packet load balancing and EVPN ingress chained composite next hops
 * Seen on:
 *   Junos: (none)
 *   EVO: an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l
 * Count:
 *   an1_acx7024 1
 *   an2_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7100-48l 1
 *   an5_acx7100-48l 1
 *   total 5
 * Highlights:
 *  - Exports `PS-PPLB` to the forwarding table, so equal-cost routes install as multiple forwarding next hops.
 *  - `chained-composite-next-hop ingress evpn` shares forwarding state among EVPN routes that use the same transport tunnel.
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-pplb.conf
 *
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    forwarding-table {
        export PS-PPLB;
        chained-composite-next-hop {
            ingress {
                evpn;
            }
        }
    }
}
```

## evo/routing-options/forwarding-table-pplb.conf

```
/*
 * Topic: Forwarding table with per-packet load balancing
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c cr1_ptx10004
 * Count:
 *   agn1_acx7100-32c 1
 *   agn2_acx7100-32c 1
 *   cr1_ptx10004 1
 *   total 3
 * Highlights:
 *  - Exports `PS-PPLB` to the forwarding table, so equal-cost routes install as multiple forwarding next hops.
 * Pair with:
 *  - evo/policy-options/policy-statement/ps-pplb.conf
 *
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    forwarding-table {
        export PS-PPLB;
    }
}
```

## evo/routing-options/router-id.conf

```
/*
 * Topic: Router ID
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 * Count:
 *   agn1_acx7100-32c 1
 *   agn2_acx7100-32c 1
 *   an1_acx7024 1
 *   an2_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7100-48l 1
 *   an5_acx7100-48l 1
 *   cr1_ptx10004 1
 *   total 8
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from agn1_acx7100-32c):
 *   $ROUTER_ID  e.g. 192.168.0.5
 */
routing-options {
    router-id $ROUTER_ID;
}
```

## evo/system/ports-console-log-out.conf

```
/*
 * Topic: Console log-out on disconnect
 * Seen on:
 *   Junos: (none)
 *   EVO: agn1_acx7100-32c agn2_acx7100-32c an1_acx7024 an2_acx7100-48l an3_acx7100-48l an4_acx7100-48l an5_acx7100-48l cr1_ptx10004
 * Count:
 *   agn1_acx7100-32c 1
 *   agn2_acx7100-32c 1
 *   an1_acx7024 1
 *   an2_acx7100-48l 1
 *   an3_acx7100-48l 1
 *   an4_acx7100-48l 1
 *   an5_acx7100-48l 1
 *   cr1_ptx10004 1
 *   total 8
 * Highlights:
 *  - Logs the console session out when the cable is disconnected.
 * Pair with: none
 *
 * Variables: none
 */
system {
    ports {
        console log-out-on-disconnect;
    }
}
```

## junos/access-profile/access-profile-vlan-auth-access1.conf

```
/*
 * Topic: Default access profile vlan-auth-access1
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Makes `vlan-auth-access1` the default access profile for subscribers outside a routing instance.
 * Pair with:
 *  - junos/access/profile-vlan-auth-access1.conf
 *
 * Variables: none
 */
access-profile vlan-auth-access1;
```

## junos/access/address-assignment-pppoe-pools.conf

```
/*
 * Topic: Global PPPoE IPv4 address pool and IPv6 router-advertisement pool
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Pool `pppv4-pool` assigns IPv4 addresses and `pppv6-pool` advertises /64 prefixes through router advertisements (`ndra-range`).
 * Pair with: none
 *
 * Variables (example values from bng1_mx304):
 *   $SUBSCRIBER_V4_PFX_1  e.g. 10.25.0.0/16
 *   $SUBSCRIBER_V6_PFX_1  e.g. fc00:25:140::/48
 */
access {
    address-assignment {
        neighbor-discovery-router-advertisement pppv6-pool;
        pool pppv4-pool {
            family inet {
                network $SUBSCRIBER_V4_PFX_1;
            }
        }
        pool pppv6-pool {
            family inet6 {
                prefix $SUBSCRIBER_V6_PFX_1;
                range ndra-range prefix-length 64;
            }
        }
    }
}
```

## junos/access/profile-no-auth.conf

```
/*
 * Topic: Access profile no-auth with authentication disabled
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - `authentication-order none` admits subscribers without any authentication.
 * Pair with: none
 *
 * Variables: none
 */
access {
    profile no-auth {
        authentication-order none;
    }
}
```

## junos/access/profile-vlan-auth-access.conf

```
/*
 * Topic: Access profile vlan-auth-access with no authentication and the PPPoE IPv4 pool
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - `authentication-order none` admits subscribers without RADIUS and assigns addresses from `pppv4-pool`.
 * Pair with:
 *  - junos/access/address-assignment-pppoe-pools.conf
 *
 * Variables: none
 */
access {
    profile vlan-auth-access {
        authentication-order none;
        address-assignment {
            pool pppv4-pool;
        }
    }
}
```

## junos/access/profile-vlan-auth-access1.conf

```
/*
 * Topic: Access profile vlan-auth-access1 with RADIUS authentication and subscriber line identification
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Builds NAS-Port-Id and Calling-Station-Id from the agent circuit ID and agent remote ID, and reports a stacked-VLAN NAS port.
 *  - Excludes Framed-IP-Address from Access-Request; balances authentication and accounting round-robin.
 *  - Profile-level RADIUS server sourced from the RADIUS loopback in routing instance `RADIUS`.
 * Pair with:
 *  - junos/routing-instances/l3vpn/ri-radius.conf
 *
 * Variables (example values from bng1_mx304):
 *   $RADIUS_SERVER_V4  e.g. 192.0.2.2
 *   $NAS_IDENTIFIER    e.g. R7-BNG1
 *   $RADIUS_SECRET     e.g. "<RADIUS_SECRET_VLAN_AUTH_ACCESS1>"
 *   $RADIUS_SOURCE_V4  e.g. 192.168.17.17
 */
access {
    profile vlan-auth-access1 {
        authentication-order radius;
        radius {
            authentication-server $RADIUS_SERVER_V4;
            options {
                nas-identifier $NAS_IDENTIFIER;
                nas-port-id-format {
                    agent-circuit-id;
                }
                nas-port-type {
                    ethernet virtual;
                }
                calling-station-id-delimiter "@";
                calling-station-id-format {
                    agent-circuit-id;
                    agent-remote-id;
                }
                accounting-session-id-format decimal;
                vlan-nas-port-stacked-format;
                client-authentication-algorithm round-robin;
                client-accounting-algorithm round-robin;
            }
            attributes {
                exclude {
                    framed-ip-address access-request;
                }
            }
        }
        radius-server {
            $RADIUS_SERVER_V4 {
                secret $RADIUS_SECRET;
                timeout 10;
                retry 3;
                max-outstanding-requests 2000;
                source-address $RADIUS_SOURCE_V4;
                routing-instance RADIUS;
            }
        }
    }
}
```

## junos/access/profile-vlan-auth-access2.conf

```
/*
 * Topic: Access profile vlan-auth-access2 with basic RADIUS authentication
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - RADIUS authentication against one server with default options.
 * Pair with: none
 *
 * Variables (example values from bng1_mx304):
 *   $RADIUS_SERVER_V4  e.g. 192.0.2.2
 *   $RADIUS_SECRET     e.g. "<RADIUS_SECRET_VLAN_AUTH_ACCESS2>"
 */
access {
    profile vlan-auth-access2 {
        authentication-order radius;
        radius {
            authentication-server $RADIUS_SERVER_V4;
        }
        radius-server {
            $RADIUS_SERVER_V4 {
                secret $RADIUS_SECRET;
                timeout 10;
                retry 3;
                max-outstanding-requests 2000;
            }
        }
    }
}
```

## junos/access/radius-server.conf

```
/*
 * Topic: Global RADIUS server reached through VRF RADIUS
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Authentication on UDP 1812 with a 10-second timeout, 3 retries and up to 2000 outstanding requests.
 *  - Sources requests from the BNG's RADIUS loopback address inside routing instance `RADIUS`.
 * Pair with:
 *  - junos/routing-instances/l3vpn/ri-radius.conf
 *
 * Variables (example values from bng1_mx304):
 *   $RADIUS_SERVER_V4  e.g. 192.0.2.2
 *   $RADIUS_SECRET     e.g. "<RADIUS_SECRET>"
 *   $RADIUS_SOURCE_V4  e.g. 192.168.17.17
 */
access {
    radius-server {
        $RADIUS_SERVER_V4 {
            port 1812;
            secret $RADIUS_SECRET;
            timeout 10;
            retry 3;
            max-outstanding-requests 2000;
            source-address $RADIUS_SOURCE_V4;
            routing-instance RADIUS;
        }
    }
}
```

## junos/chassis/aggregated-devices-ethernet.conf

```
/*
 * Topic: Aggregated Ethernet device-count for the chassis
 * Seen on:
 *   Junos: bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 2
 * Highlights:
 *  - Reserves the aggregated Ethernet interface pool; the count is a chassis-wide ceiling, not a count of bundles in use.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng3_mx10004):
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

## junos/chassis/fpc-mx10004-tunnel-100g-ports.conf

```
/*
 * Topic: MX10004 FPC with 100G tunnel services and 100G ports on PICs 2 to 5
 * Seen on:
 *   Junos: bng3_mx10004
 *   EVO: (none)
 * Count:
 *   bng3_mx10004 1
 *   total 1
 * Highlights:
 *  - Reserves 100G of PIC 0 bandwidth for tunnel services and runs the cabled ports on PICs 2 to 5 at 100G.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng3_mx10004):
 *   $FPC_SLOT  e.g. 0
 */
chassis {
    fpc $FPC_SLOT {
        pic 0 {
            tunnel-services {
                bandwidth 100g;
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
        }
        pic 4 {
            port 0 {
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

## junos/chassis/fpc-mx204-tunnel-100g-4x100g.conf

```
/*
 * Topic: MX204 FPC with 100G tunnel services, four 100G ports and PIC 1 disabled
 * Seen on:
 *   Junos: bng2_mx204
 *   EVO: (none)
 * Count:
 *   bng2_mx204 1
 *   total 1
 * Highlights:
 *  - Reserves 100G of PIC 0 bandwidth for tunnel services and runs its four ports at 100G.
 *  - `number-of-ports 0` disables PIC 1.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng2_mx204):
 *   $FPC_SLOT  e.g. 0
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
                speed 100g;
            }
        }
        pic 1 {
            number-of-ports 0;
        }
    }
}
```

## junos/chassis/fpc-mx480-tunnel-100g-2x100g-single-sub-port.conf

```
/*
 * Topic: MX480 FPC with 100G tunnel services and two 100G single-sub-port ports
 * Seen on:
 *   Junos: bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng4_mx480 1
 *   total 1
 * Highlights:
 *  - Reserves 100G of PIC 0 bandwidth for tunnel services and runs ports 2 and 5 at 100G as one sub-port each.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng4_mx480):
 *   $FPC_SLOT  e.g. 2
 */
chassis {
    fpc $FPC_SLOT {
        pic 0 {
            tunnel-services {
                bandwidth 100g;
            }
            port 2 {
                number-of-sub-ports 1;
                speed 100g;
            }
            port 5 {
                number-of-sub-ports 1;
                speed 100g;
            }
        }
    }
}
```

## junos/chassis/fpc-tunnel-services-100g.conf

```
/*
 * Topic: 100G tunnel services on a PIC
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 2
 *   bng4_mx480 3
 *   total 7
 * Highlights:
 *  - Reserves 100G of PIC bandwidth for tunnel services, which anchor the pseudowire-subscriber logical tunnels.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng1_mx304):
 *   $FPC_SLOT  e.g. 0
 *   $PIC_SLOT  e.g. 0
 */
chassis {
    fpc $FPC_SLOT {
        pic $PIC_SLOT {
            tunnel-services {
                bandwidth 100g;
            }
        }
    }
}
```

## junos/chassis/maximum-ecmp.conf

```
/*
 * Topic: Chassis maximum ECMP paths
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Raises the ECMP ceiling to 128 next hops.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
chassis {
    maximum-ecmp 128;
}
```

## junos/chassis/network-services-enhanced-ip.conf

```
/*
 * Topic: Enhanced IP chassis network-services mode
 * Seen on:
 *   Junos: bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng4_mx480 1
 *   total 1
 * Highlights:
 *  - Runs the chassis in enhanced IP mode.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
chassis {
    network-services enhanced-ip;
}
```

## junos/chassis/pseudowire-service.conf

```
/*
 * Topic: Pseudowire-subscriber device allocation
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - `device-count` allocates pseudowire-subscriber (`ps`) devices, not service units.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng1_mx304):
 *   $PS_DEVICE_COUNT  e.g. 100
 */
chassis {
    pseudowire-service {
        device-count $PS_DEVICE_COUNT;
    }
}
```

## junos/chassis/redundancy-graceful-switchover.conf

```
/*
 * Topic: Graceful Routing Engine switchover
 * Seen on:
 *   Junos: bng1_mx304 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 3
 * Highlights:
 *  - Enables GRES, which nonstop routing and subscriber state preservation require on dual-RE systems.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
chassis {
    redundancy {
        graceful-switchover;
    }
}
```

## junos/dynamic-profiles/auto-stacked-pwht.conf

```
/*
 * Topic: Dynamic profile auto-stacked-pwht for PPPoE sessions over pseudowire-headend stacked VLANs
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Creates the per-VLAN demux unit on the pseudowire-subscriber device and places it in the default routing instance `PPPOE_SUBS_1`.
 *  - `family pppoe` hands each session to dynamic profile `prod-pppoe-dt-base`, with duplicate and short-cycle protection.
 *  - The `interface-set` groups each subscriber unit under its physical pseudowire-subscriber device for hierarchical scheduling.
 * Pair with:
 *  - junos/dynamic-profiles/prod-pppoe-dt-base.conf
 *  - junos/routing-instances/l3vpn/ri-pppoe-subs.conf
 *
 * Variables: none
 */
dynamic-profiles {
    auto-stacked-pwht {
        predefined-variable-defaults {
            routing-instances PPPOE_SUBS_1;
        }
        routing-instances {
            "$junos-routing-instance" {
                interface "$junos-interface-name";
            }
        }
        interfaces {
            interface-set "$junos-phy-ifd-interface-set-name" {
                interface "$junos-interface-ifd-name" {
                    unit "$junos-interface-unit";
                }
            }
            "$junos-interface-ifd-name" {
                unit "$junos-interface-unit" {
                    actual-transit-statistics;
                    no-traps;
                    proxy-arp restricted;
                    vlan-tags outer "$junos-stacked-vlan-id" inner "$junos-vlan-id";
                    family inet {
                        mac-validate loose;
                        unnumbered-address lo0.0;
                    }
                    family inet6 {
                        unnumbered-address "$junos-loopback-interface";
                    }
                    family pppoe {
                        duplicate-protection;
                        dynamic-profile prod-pppoe-dt-base;
                        short-cycle-protection {
                            lockout-time-min 5;
                            lockout-time-max 60;
                        }
                    }
                }
            }
        }
    }
}
```

## junos/dynamic-profiles/auto-stacked-pwht_dhcp.conf

```
/*
 * Topic: Dynamic profile auto-stacked-pwht_dhcp for DHCP/IPoE subscribers over pseudowire-headend stacked VLANs
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Creates the per-VLAN demux unit on the pseudowire-subscriber device in default routing instance `dhcp-subs`, unnumbered to the subscriber loopback.
 *  - `auto-configure address-ranges` / `prefix-ranges` instantiate dynamic profile `prof_autosense_ipdemux` per subscriber address inside the listed IPv4 networks and IPv6 prefixes, with a 600-second session timeout.
 *  - Router advertisements set the managed and other-stateful flags so IPv6 hosts use DHCPv6.
 * Pair with:
 *  - junos/dynamic-profiles/prof_autosense_ipdemux.conf
 *
 * Variables (example values from bng1_mx304):
 *   $USER_PASS            e.g. "<USER_PASS>"
 *   $DOMAIN_NAME          e.g. example.net
 *   $USER_PREFIX          e.g. pwht_dhcp
 *   $SUBSCRIBER_V4_PFX_1  e.g. 10.42.0.0/16
 *   $SUBSCRIBER_V4_PFX_2  e.g. 10.43.0.0/16
 *   $SUBSCRIBER_V4_PFX_3  e.g. 10.44.0.0/16
 *   $SUBSCRIBER_V4_PFX_4  e.g. 10.45.0.0/16
 *   $SUBSCRIBER_V6_PFX_1  e.g. fc00:125:140::/48
 *   $SUBSCRIBER_V6_PFX_2  e.g. fc00:126:140::/48
 *   $SUBSCRIBER_V6_PFX_3  e.g. fc00:127:140::/48
 *   $SUBSCRIBER_V6_PFX_4  e.g. fc00:128:140::/48
 */
dynamic-profiles {
    auto-stacked-pwht_dhcp {
        predefined-variable-defaults {
            routing-instances dhcp-subs;
        }
        routing-instances {
            "$junos-routing-instance" {
                interface "$junos-interface-name";
            }
        }
        interfaces {
            "$junos-interface-ifd-name" {
                unit "$junos-interface-unit" {
                    no-traps;
                    proxy-arp unrestricted;
                    vlan-tags outer "$junos-stacked-vlan-id" inner "$junos-vlan-id";
                    demux-options {
                        underlying-interface "$junos-interface-ifd-name";
                    }
                    family inet {
                        mac-validate loose;
                        unnumbered-address "$junos-loopback-interface";
                        auto-configure {
                            address-ranges {
                                dynamic-profile prof_autosense_ipdemux {
                                    network $SUBSCRIBER_V4_PFX_1;
                                    network $SUBSCRIBER_V4_PFX_2;
                                    network $SUBSCRIBER_V4_PFX_3;
                                    network $SUBSCRIBER_V4_PFX_4;
                                }
                                authentication {
                                    password $USER_PASS;
                                    username-include {
                                        domain-name $DOMAIN_NAME;
                                        user-prefix $USER_PREFIX;
                                    }
                                }
                                session-timeout 600;
                            }
                        }
                    }
                    family inet6 {
                        unnumbered-address "$junos-loopback-interface";
                        auto-configure {
                            prefix-ranges {
                                dynamic-profile prof_autosense_ipdemux {
                                    prefix $SUBSCRIBER_V6_PFX_1;
                                    prefix $SUBSCRIBER_V6_PFX_2;
                                    prefix $SUBSCRIBER_V6_PFX_3;
                                    prefix $SUBSCRIBER_V6_PFX_4;
                                }
                                authentication {
                                    password $USER_PASS;
                                    username-include {
                                        domain-name $DOMAIN_NAME;
                                        user-prefix $USER_PREFIX;
                                    }
                                }
                                session-timeout 600;
                            }
                        }
                    }
                }
            }
        }
        protocols {
            router-advertisement {
                interface "$junos-interface-name" {
                    max-advertisement-interval 60;
                    min-advertisement-interval 30;
                    managed-configuration;
                    other-stateful-configuration;
                }
            }
        }
    }
}
```

## junos/dynamic-profiles/prod-dhcp-base.conf

```
/*
 * Topic: Dynamic profile prod-dhcp-base for DHCPv4/DHCPv6 subscriber demux sessions
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Creates a `demux0` unit per DHCP session with source-address demultiplexing, unnumbered to the subscriber VRF loopback unit.
 *  - RPF checking fails over to filters `rpf-pass-dhcp` / `rpf-pass-dhcpv6` so DHCP traffic is accepted before the address is bound.
 *  - Installs the RADIUS framed route with its framed-route cost as an access route.
 * Pair with:
 *  - junos/firewall/filter-rpf-pass-dhcp.conf
 *  - junos/firewall/filter-rpf-pass-dhcpv6.conf
 *
 * Variables (example values from bng1_mx304):
 *   $UNIT  e.g. 313
 */
dynamic-profiles {
    prod-dhcp-base {
        predefined-variable-defaults {
            routing-instances dhcp-subs;
        }
        routing-instances {
            "$junos-routing-instance" {
                interface "$junos-interface-name";
                routing-options {
                    access {
                        route $junos-framed-route-ip-address-prefix metric "$junos-framed-route-cost";
                    }
                }
            }
        }
        interfaces {
            demux0 {
                unit "$junos-interface-unit" {
                    actual-transit-statistics;
                    proxy-arp unrestricted;
                    demux-options {
                        underlying-interface "$junos-underlying-interface";
                    }
                    family inet {
                        rpf-check fail-filter rpf-pass-dhcp;
                        demux-source {
                            $junos-subscriber-ip-address;
                        }
                        unnumbered-address lo0.$UNIT;
                    }
                    family inet6 {
                        rpf-check fail-filter rpf-pass-dhcpv6;
                        demux-source {
                            "$junos-subscriber-ipv6-address";
                        }
                        unnumbered-address lo0.$UNIT;
                    }
                }
            }
        }
    }
}
```

## junos/dynamic-profiles/prod-pppoe-dt-base.conf

```
/*
 * Topic: Dynamic profile prod-pppoe-dt-base for per-session PPPoE pp0 units
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Creates a `pp0` unit per PPPoE session in routing instance `PPPOE_SUBS_1`, unnumbered to the loopback.
 *  - Applies output filter `clear-df-bit` and RPF checking, and advertises the session's IPv6 ND/RA prefix.
 * Pair with:
 *  - junos/firewall/filter-clear-df-bit.conf
 *  - junos/routing-instances/l3vpn/ri-pppoe-subs.conf
 *
 * Variables: none
 */
dynamic-profiles {
    prod-pppoe-dt-base {
        predefined-variable-defaults {
            routing-instances PPPOE_SUBS_1;
        }
        routing-instances {
            "$junos-routing-instance" {
                interface "$junos-interface-name";
            }
        }
        interfaces {
            pp0 {
                unit "$junos-interface-unit" {
                    actual-transit-statistics;
                    no-traps;
                    ppp-options {
                        mru 1500;
                        mtu 1500;
                    }
                    pppoe-options {
                        underlying-interface "$junos-underlying-interface";
                        server;
                    }
                    keepalives interval 30;
                    family inet {
                        rpf-check;
                        filter {
                            output clear-df-bit;
                        }
                        unnumbered-address "$junos-loopback-interface";
                    }
                    family inet6 {
                        unnumbered-address "$junos-loopback-interface";
                    }
                }
            }
        }
        protocols {
            router-advertisement {
                interface "$junos-interface-name" {
                    prefix $junos-ipv6-ndra-prefix;
                }
            }
        }
    }
}
```

## junos/dynamic-profiles/prof_autosense_ipdemux.conf

```
/*
 * Topic: Dynamic profile prof_autosense_ipdemux for per-subscriber IP demux units
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Creates a `demux0` unit per autosensed subscriber address, unnumbered to the subscriber VRF loopback unit.
 *  - Installs access-internal host routes for the subscriber IPv4 and IPv6 addresses in the subscriber routing instance.
 * Pair with: none
 *
 * Variables (example values from bng1_mx304):
 *   $UNIT  e.g. 313
 */
dynamic-profiles {
    prof_autosense_ipdemux {
        predefined-variable-defaults {
            routing-instances dhcp-subs;
        }
        routing-instances {
            "$junos-routing-instance" {
                interface "$junos-interface-name";
                routing-options {
                    rib inet6.0 {
                        access-internal {
                            route $junos-subscriber-ipv6-address {
                                qualified-next-hop "$junos-interface-name";
                            }
                        }
                    }
                    access-internal {
                        route $junos-subscriber-ip-address {
                            qualified-next-hop "$junos-interface-name";
                        }
                    }
                }
            }
        }
        interfaces {
            demux0 {
                unit "$junos-underlying-interface-unit" {
                    proxy-arp unrestricted;
                    family inet {
                        mac-validate loose;
                        unnumbered-address lo0.$UNIT;
                    }
                    family inet6 {
                        unnumbered-address lo0.$UNIT;
                    }
                }
            }
        }
    }
}
```

## junos/firewall/filter-clear-df-bit.conf

```
/*
 * Topic: Interface-specific IPv4 filter clear-df-bit that clears the Don't Fragment bit
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Accepts all traffic and clears the DF bit, so subscriber packets can be fragmented.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
firewall {
    family inet {
        filter clear-df-bit {
            interface-specific;
            term 1 {
                then {
                    accept;
                    dont-fragment clear;
                }
            }
        }
    }
}
```

## junos/firewall/filter-rpf-pass-dhcp.conf

```
/*
 * Topic: IPv4 RPF-fail filter rpf-pass-dhcp that passes DHCP broadcasts
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Lets limited-broadcast DHCP through when the RPF check fails and discards everything else.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
firewall {
    family inet {
        filter rpf-pass-dhcp {
            term allow-dhcp {
                from {
                    destination-address {
                        255.255.255.255/32;
                    }
                    destination-port dhcp;
                }
                then accept;
            }
            term default {
                then {
                    discard;
                }
            }
        }
    }
}
```

## junos/firewall/filter-rpf-pass-dhcpv6.conf

```
/*
 * Topic: IPv6 RPF-fail filter rpf-pass-dhcpv6 that passes DHCPv6
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Lets DHCPv6 through when the RPF check fails and discards everything else.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
firewall {
    family inet6 {
        filter rpf-pass-dhcpv6 {
            term allow-dhcpv6 {
                from {
                    destination-address {
                        ffff::ffff/128;
                    }
                    destination-port dhcp;
                }
                then accept;
            }
            term default {
                then discard;
            }
        }
    }
}
```

## junos/interfaces/ifd-core-aggregate-lacp.conf

```
/*
 * Topic: Core aggregated Ethernet bundle with active LACP
 * Seen on:
 *   Junos: bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng3_mx10004 1
 *   bng4_mx480 2
 *   total 3
 * Highlights:
 *  - Point-to-point core bundle; LACP runs in active mode at the default (slow) rate.
 * Pair with: none
 *
 * Variables (example values from bng3_mx10004):
 *   $IFD          e.g. ae0
 *   $DESCRIPTION  e.g. R9-BNG3-To-R10-BNG4
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        aggregated-ether-options {
            lacp {
                active;
            }
        }
    }
}
```

## junos/interfaces/ifd-core-lag-member-gigether-description.conf

```
/*
 * Topic: Described physical member of a core aggregated Ethernet bundle
 * Seen on:
 *   Junos: bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng3_mx10004 2
 *   bng4_mx480 4
 *   total 6
 * Highlights:
 *  - Joins the port to the bundle through `gigether-options 802.3ad`.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng3_mx10004):
 *   $CORE_INTF    e.g. et-0/4/0
 *   $DESCRIPTION  e.g. R9-BNG3-To-R10-BNG4-AE-MEMBER1
 *   $AE_BUNDLE    e.g. ae0
 */
interfaces {
    $CORE_INTF {
        description $DESCRIPTION;
        gigether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## junos/interfaces/ifd-description.conf

```
/*
 * Topic: Interface device description
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004
 *   EVO: (none)
 * Count:
 *   bng1_mx304 3
 *   bng2_mx204 3
 *   bng3_mx10004 1
 *   total 7
 * Highlights:
 *  - Describes the physical port; its logical units are configured separately.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng1_mx304):
 *   $IFD          e.g. et-0/0/2
 *   $DESCRIPTION  e.g. R7-BNG1-To-R5-AGN1
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
    }
}
```

## junos/interfaces/ifd-ps-pwht-dhcp.conf

```
/*
 * Topic: Pseudowire-headend subscriber interface with stacked-VLAN auto-configuration for DHCP/IPoE
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 12
 *   bng2_mx204 12
 *   bng3_mx10004 12
 *   bng4_mx480 12
 *   total 48
 * Highlights:
 *  - `auto-configure stacked-vlan-ranges` instantiates dynamic profile `auto-stacked-pwht_dhcp` for any outer/inner VLAN pair and authenticates the VLAN through access profile `vlan-auth-access1`.
 *  - A static `mac` gives the pseudowire-subscriber device a fixed MAC address.
 *  - The pseudowire-subscriber device terminates the access pseudowire on the BNG through its logical-tunnel anchor; unit 0 carries the pseudowire as `ethernet-ccc`.
 *  - Single-active ESI with a DF-election preference makes one BNG of the pair the designated forwarder for the subscriber pseudowire.
 * Pair with:
 *  - junos/access/profile-vlan-auth-access1.conf
 *  - junos/chassis/fpc-tunnel-services-100g.conf
 *  - junos/chassis/pseudowire-service.conf
 *  - junos/dynamic-profiles/auto-stacked-pwht_dhcp.conf
 *
 * Variables (example values from bng1_mx304 / ps11):
 *   $IFD            e.g. ps11
 *   $ANCHOR_PIC     e.g. lt-0/0/0
 *   $USER_PASS      e.g. "<USER_PASS>"
 *   $DOMAIN_NAME    e.g. example.net
 *   $USER_PREFIX    e.g. pwht_dhcp
 *   $ESI            e.g. 00:10:12:12:12:12:12:00:00:41
 *   $DF_PREFERENCE  e.g. 1000
 *   $STATIC_MAC     e.g. aa:aa:aa:bb:bb:bb
 */
interfaces {
    $IFD {
        anchor-point {
            $ANCHOR_PIC;
        }
        flexible-vlan-tagging;
        auto-configure {
            stacked-vlan-ranges {
                dynamic-profile auto-stacked-pwht_dhcp {
                    accept any;
                    ranges {
                        any,any;
                    }
                }
                authentication {
                    packet-types any;
                    password $USER_PASS;
                    username-include {
                        domain-name $DOMAIN_NAME;
                        user-prefix $USER_PREFIX;
                    }
                }
                access-profile vlan-auth-access1;
            }
            remove-when-no-subscribers;
        }
        mtu 2022;
        esi {
            $ESI;
            single-active;
            df-election-type {
                preference {
                    value $DF_PREFERENCE;
                }
            }
        }
        mac $STATIC_MAC;
        no-gratuitous-arp-request;
        unit 0 {
            encapsulation ethernet-ccc;
        }
    }
}
```

## junos/interfaces/ifd-ps-pwht-pppoe.conf

```
/*
 * Topic: Pseudowire-headend subscriber interface with stacked-VLAN auto-configuration for PPPoE
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 12
 *   bng2_mx204 12
 *   bng3_mx10004 12
 *   bng4_mx480 12
 *   total 48
 * Highlights:
 *  - `auto-configure stacked-vlan-ranges` instantiates dynamic profile `auto-stacked-pwht` for any outer/inner VLAN pair and authenticates the VLAN through access profile `vlan-auth-access1`.
 *  - The pseudowire-subscriber device terminates the access pseudowire on the BNG through its logical-tunnel anchor; unit 0 carries the pseudowire as `ethernet-ccc`.
 *  - Single-active ESI with a DF-election preference makes one BNG of the pair the designated forwarder for the subscriber pseudowire.
 * Pair with:
 *  - junos/access/profile-vlan-auth-access1.conf
 *  - junos/chassis/fpc-tunnel-services-100g.conf
 *  - junos/chassis/pseudowire-service.conf
 *  - junos/dynamic-profiles/auto-stacked-pwht.conf
 *
 * Peers with:
 *   [bng1_mx304] <-> [bng2_mx204]
 *   [bng1_mx304] <-> [bng3_mx10004]
 *   [bng1_mx304] <-> [bng4_mx480]
 *   [bng2_mx204] <-> [bng3_mx10004]
 *   [bng2_mx204] <-> [bng4_mx480]
 *   [bng3_mx10004] <-> [bng4_mx480]
 * Variables (example values from bng1_mx304 / ps0):
 *   $IFD            e.g. ps0
 *   $ANCHOR_PIC     e.g. lt-0/0/0
 *   $USER_PASS      e.g. "<USER_PASS>"
 *   $DOMAIN_NAME    e.g. example.net
 *   $USER_PREFIX    e.g. pwht_pppoe
 *   $ESI            e.g. 00:10:12:12:12:12:12:00:00:31
 *   $DF_PREFERENCE  e.g. 1000
 */
interfaces {
    $IFD {
        anchor-point {
            $ANCHOR_PIC;
        }
        flexible-vlan-tagging;
        auto-configure {
            stacked-vlan-ranges {
                dynamic-profile auto-stacked-pwht {
                    accept [ pppoe inet inet6 ];
                    ranges {
                        any,any;
                    }
                }
                authentication {
                    packet-types [ pppoe any ];
                    password $USER_PASS;
                    username-include {
                        domain-name $DOMAIN_NAME;
                        user-prefix $USER_PREFIX;
                    }
                }
                access-profile vlan-auth-access1;
            }
            remove-when-no-subscribers;
        }
        mtu 2022;
        esi {
            $ESI;
            single-active;
            df-election-type {
                preference {
                    value $DF_PREFERENCE;
                }
            }
        }
        no-gratuitous-arp-request;
        unit 0 {
            encapsulation ethernet-ccc;
        }
    }
}
```

## junos/interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-16.conf

```
/*
 * Topic: Core logical interface
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 3
 *   bng2_mx204 3
 *   bng3_mx10004 2
 *   bng4_mx480 2
 *   total 10
 * Highlights:
 *  - Carries IPv4, IS-IS, IPv6 and MPLS; `maximum-labels 16` allows deep segment-routing label stacks.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng1_mx304):
 *   $IFD           e.g. et-0/0/2
 *   $UNIT          e.g. 0
 *   $CORE_V4_ADDR  e.g. 10.10.117.1/24
 *   $CORE_V6_ADDR  e.g. 2001:db8::10:10:117:1:1/120
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
                maximum-labels 16;
            }
        }
    }
}
```

## junos/interfaces/ifl-loopback-description-primary-secondary.conf

```
/*
 * Topic: Described loopback logical interface with a secondary IPv4 address
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Primary IPv4 and IPv6 addresses plus a secondary IPv4 address on a loopback unit for a subscriber VRF.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng1_mx304):
 *   $UNIT                 e.g. 313
 *   $DESCRIPTION          e.g. "VRF:dhcp-subs Loopback"
 *   $LOOPBACK_V4_PFX      e.g. 10.42.0.1/32
 *   $LOOPBACK_ALT_V4_PFX  e.g. 172.17.17.7/32
 *   $LOOPBACK_V6_PFX      e.g. fc00:125:140::1/128
 */
interfaces {
    lo0 {
        unit $UNIT {
            description $DESCRIPTION;
            family inet {
                address $LOOPBACK_V4_PFX {
                    primary;
                }
                address $LOOPBACK_ALT_V4_PFX;
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

## junos/interfaces/ifl-loopback-primary-iso.conf

```
/*
 * Topic: Loopback logical interface
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Primary IPv4 and IPv6 loopback addresses plus the IS-IS NET.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng1_mx304):
 *   $UNIT             e.g. 0
 *   $LOOPBACK_V4_PFX  e.g. 192.168.0.7/32
 *   $ISIS_NET         e.g. 49.0000.0010.0100.0007.00
 *   $LOOPBACK_V6_PFX  e.g. 2001:db8::192:168:0:7/128
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

## junos/interfaces/ifl-loopback-primary.conf

```
/*
 * Topic: Loopback logical interface for a routing instance
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 2
 *   bng2_mx204 2
 *   bng3_mx10004 2
 *   bng4_mx480 2
 *   total 8
 * Highlights:
 *  - Primary IPv4 and IPv6 addresses on an additional loopback unit.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng1_mx304):
 *   $UNIT             e.g. 7
 *   $LOOPBACK_V4_PFX  e.g. 192.168.7.7/32
 *   $LOOPBACK_V6_PFX  e.g. 2001:db8::192:168:7:7/128
 */
interfaces {
    lo0 {
        unit $UNIT {
            family inet {
                address $LOOPBACK_V4_PFX {
                    primary;
                }
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

## junos/policy-options/community/cm-pppoe-subs-comm-1.conf

```
/*
 * Topic: Route-target community PPPOE_SUBS_COMM_1 for PPPoE subscriber direct routes
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng1_mx304):
 *   $RT_AS  e.g. 20000
 *   $RT_ID  e.g. 1031
 */
policy-options {
    community PPPOE_SUBS_COMM_1 members target:$RT_AS:$RT_ID;
}
```

## junos/policy-options/community/cm-pppoe-subs-comm-2.conf

```
/*
 * Topic: Route-target community PPPOE_SUBS_COMM_2 for PPPoE subscriber aggregates
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng1_mx304):
 *   $RT_AS  e.g. 20000
 *   $RT_ID  e.g. 1032
 */
policy-options {
    community PPPOE_SUBS_COMM_2 members target:$RT_AS:$RT_ID;
}
```

## junos/policy-options/community/cm-ps-dhcpsubs-comm-2.conf

```
/*
 * Topic: Route-target community PS-DHCPSUBS-COMM_2 for DHCP subscriber access routes
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng1_mx304):
 *   $RT_AS  e.g. 65000
 *   $RT_ID  e.g. 1132
 */
policy-options {
    community PS-DHCPSUBS-COMM_2 members target:$RT_AS:$RT_ID;
}
```

## junos/policy-options/community/cm-ps-dhcpsubs-comm.conf

```
/*
 * Topic: Route-target community PS-DHCPSUBS-COMM for DHCP subscriber direct routes
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng1_mx304):
 *   $RT_AS  e.g. 65000
 *   $RT_ID  e.g. 1131
 */
policy-options {
    community PS-DHCPSUBS-COMM members target:$RT_AS:$RT_ID;
}
```

## junos/policy-options/community/cm-ps-internet-comm.conf

```
/*
 * Topic: Route-target community PS-Internet-COMM for Internet VRF routes
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng1_mx304):
 *   $RT_AS  e.g. 100
 *   $RT_ID  e.g. 1
 */
policy-options {
    community PS-Internet-COMM members target:$RT_AS:$RT_ID;
}
```

## junos/policy-options/community/cm-ps-radius-comm.conf

```
/*
 * Topic: Route-target community PS-RADIUS-COMM for RADIUS VRF routes
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng1_mx304):
 *   $RT_AS  e.g. 11111
 *   $RT_ID  e.g. 1111
 */
policy-options {
    community PS-RADIUS-COMM members target:$RT_AS:$RT_ID;
}
```

## junos/policy-options/condition/condition-if-master.conf

```
/*
 * Topic: Route condition if-master tracking the active pseudowire-subscriber interface
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - True while the pseudowire-subscriber interface route exists in `mpls.0`, which marks the BNG as master for the pseudowire.
 * Pair with:
 *  - junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf
 *
 * Peers with: n/a
 * Variables (example values from bng1_mx304):
 *   $AC_IFL  e.g. ps16.0
 */
policy-options {
    condition if-master {
        if-route-exists {
            address-family {
                ccc {
                    $AC_IFL;
                    table mpls.0;
                }
            }
        }
    }
}
```

## junos/policy-options/policy-statement/dhcp-subs-vrf-export-pol.conf

```
/*
 * Topic: VRF export policy dhcp-subs-vrf-export-pol
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Tags direct routes with `PS-DHCPSUBS-COMM` and subscriber access-internal routes with `PS-DHCPSUBS-COMM_2`, all with next-hop self.
 * Pair with:
 *  - junos/policy-options/community/cm-ps-dhcpsubs-comm-2.conf
 *  - junos/policy-options/community/cm-ps-dhcpsubs-comm.conf
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement dhcp-subs-vrf-export-pol {
        term 1 {
            from protocol direct;
            then {
                community add PS-DHCPSUBS-COMM;
                next-hop self;
                accept;
            }
        }
        term 2 {
            from protocol access-internal;
            then {
                community add PS-DHCPSUBS-COMM_2;
                next-hop self;
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/dhcp-subs-vrf-import-pol.conf

```
/*
 * Topic: VRF import policy dhcp-subs-vrf-import-pol
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Imports the RADIUS and Internet routes into the DHCP subscriber VRF.
 * Pair with:
 *  - junos/policy-options/community/cm-ps-internet-comm.conf
 *  - junos/policy-options/community/cm-ps-radius-comm.conf
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement dhcp-subs-vrf-import-pol {
        term 1 {
            from community PS-RADIUS-COMM;
            then accept;
        }
        term 2 {
            from community PS-Internet-COMM;
            then accept;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-dhcp-subsv6.conf

```
/*
 * Topic: BGP export policy PS-DHCP-SUBSv6 for DHCPv6 subscriber routes
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Exports access-internal routes of VRF `dhcp-subs` with community `PS-DHCPSUBS-COMM_2` and an explicit IPv6 next hop.
 * Pair with:
 *  - junos/policy-options/community/cm-ps-dhcpsubs-comm-2.conf
 *
 * Peers with: n/a
 * Variables (example values from bng1_mx304):
 *   $NEXT_HOP_V6  e.g. 2001:db8::192:168:0:7
 */
policy-options {
    policy-statement PS-DHCP-SUBSv6 {
        term 1 {
            from {
                instance dhcp-subs;
                protocol access-internal;
            }
            then {
                community add PS-DHCPSUBS-COMM_2;
                next-hop $NEXT_HOP_V6;
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-isis-export.conf

```
/*
 * Topic: IS-IS export policy PS-ISIS-EXPORT carrying the node loopbacks with their prefix segments
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - `term OOB-MGMT` rejects routes on the out-of-band management interfaces.
 *  - The loopback terms accept the node's own IPv4 and IPv6 loopbacks and attach a node segment index to each.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng1_mx304):
 *   $LOOPBACK_V4  e.g. 192.168.0.7
 *   $SR_INDEX_V4  e.g. 1007
 *   $LOOPBACK_V6  e.g. 2001:db8::192:168:0:7
 *   $SR_INDEX_V6  e.g. 4007
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
                prefix-segment {
                    index $SR_INDEX_V4;
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
                prefix-segment {
                    index $SR_INDEX_V6;
                    node-segment;
                }
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-pplb.conf

```
/*
 * Topic: Per-packet load-balance policy PS-PPLB
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - A single unconditional term; exported to the forwarding table.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement PS-PPLB {
        then {
            load-balance per-packet;
            accept;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-pppoe-subs-1-vrf-export.conf

```
/*
 * Topic: VRF export policy PS-PPPOE-SUBS-1-VRF-EXPORT
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Tags direct routes with `PPPOE_SUBS_COMM_1` and the subscriber aggregates with `PPPOE_SUBS_COMM_2`, all with next-hop self.
 * Pair with:
 *  - junos/policy-options/community/cm-pppoe-subs-comm-1.conf
 *  - junos/policy-options/community/cm-pppoe-subs-comm-2.conf
 *
 * Peers with: n/a
 * Variables (example values from bng1_mx304):
 *   $SUBSCRIBER_V4_PFX_1  e.g. 10.25.0.0/16
 *   $SUBSCRIBER_V6_PFX_1  e.g. fc00:25:140::/48
 */
policy-options {
    policy-statement PS-PPPOE-SUBS-1-VRF-EXPORT {
        term 1 {
            from protocol direct;
            then {
                community add PPPOE_SUBS_COMM_1;
                next-hop self;
                accept;
            }
        }
        term 2 {
            from {
                protocol aggregate;
                route-filter $SUBSCRIBER_V4_PFX_1 exact;
            }
            then {
                community add PPPOE_SUBS_COMM_2;
                next-hop self;
                accept;
            }
        }
        term 3 {
            from {
                protocol aggregate;
                route-filter $SUBSCRIBER_V6_PFX_1 exact;
            }
            then {
                community add PPPOE_SUBS_COMM_2;
                next-hop self;
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-pppoe-subs-1-vrf-import.conf

```
/*
 * Topic: VRF import policy PS-PPPOE-SUBS-1-VRF-IMPORT
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Imports the RADIUS and Internet routes into the PPPoE subscriber VRF.
 * Pair with:
 *  - junos/policy-options/community/cm-ps-internet-comm.conf
 *  - junos/policy-options/community/cm-ps-radius-comm.conf
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement PS-PPPOE-SUBS-1-VRF-IMPORT {
        term 1 {
            from community PS-RADIUS-COMM;
            then accept;
        }
        term 2 {
            from community PS-Internet-COMM;
            then accept;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-pppoe-subsv6.conf

```
/*
 * Topic: BGP export policy PS-PPPOE-SUBSv6 for the PPPoE subscriber IPv6 prefix
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Exports the PPPoE subscriber IPv6 prefix of VRF `PPPOE_SUBS_1` with community `PPPOE_SUBS_COMM_2` and an explicit IPv6 next hop.
 * Pair with:
 *  - junos/policy-options/community/cm-pppoe-subs-comm-2.conf
 *  - junos/routing-instances/l3vpn/ri-pppoe-subs.conf
 *
 * Peers with: n/a
 * Variables (example values from bng1_mx304):
 *   $SUBSCRIBER_V6_PFX_1  e.g. fc00:25:140::/48
 *   $NEXT_HOP_V6          e.g. 2001:db8::192:168:0:7
 */
policy-options {
    policy-statement PS-PPPOE-SUBSv6 {
        term 1 {
            from {
                instance PPPOE_SUBS_1;
                route-filter $SUBSCRIBER_V6_PFX_1 exact;
            }
            then {
                community add PPPOE_SUBS_COMM_2;
                next-hop $NEXT_HOP_V6;
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-radius-vrf-export.conf

```
/*
 * Topic: VRF export policy PS-RADIUS-VRF-EXPORT
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Tags direct routes with `PS-RADIUS-COMM` and next-hop self.
 * Pair with:
 *  - junos/policy-options/community/cm-ps-radius-comm.conf
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement PS-RADIUS-VRF-EXPORT {
        term 1 {
            from protocol direct;
            then {
                community add PS-RADIUS-COMM;
                next-hop self;
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-radius-vrf-import.conf

```
/*
 * Topic: VRF import policy PS-RADIUS-VRF-IMPORT on a BNG
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Imports only routes tagged `PS-RADIUS-COMM`.
 * Pair with:
 *  - junos/policy-options/community/cm-ps-radius-comm.conf
 *
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    policy-statement PS-RADIUS-VRF-IMPORT {
        term 1 {
            from community PS-RADIUS-COMM;
            then accept;
        }
    }
}
```

## junos/protocols/bgp-overlay-bng-core-rr.conf

```
/*
 * Topic: iBGP overlay session from a BNG to the core route reflector
 * Seen on:
 *   Junos: bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 2
 * Variant group: bbe-bgp-overlay
 *   Provides: evpn, inet-vpn, inet6-vpn, labeled-unicast
 * Highlights:
 *  - `labeled-unicast resolve-vpn` resolves VPN next hops over BGP-LU, and the IPv4/IPv6 VPN families carry the subscriber VRF routes.
 *  - Exports subscriber IPv6 routes through `PS-PPPOE-SUBSv6` and `PS-DHCP-SUBSv6`.
 *  - BFD (100 ms x 3) protects every session.
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-dhcp-subsv6.conf
 *  - junos/policy-options/policy-statement/ps-pppoe-subsv6.conf
 *
 * Peers with:
 *   [bng3_mx10004] <-> [cr1_ptx10004]
 *   [bng4_mx480] <-> [cr1_ptx10004]
 * Variables (example values from bng3_mx10004):
 *   $LOOPBACK_V4  e.g. 192.168.0.9
 *   $RR1_V4       e.g. 192.168.0.11
 */
protocols {
    bgp {
        vpn-apply-export;
        group GR-IBGP-CR {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
                    resolve-vpn;
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
            family evpn {
                signaling;
            }
            export [ PS-PPPOE-SUBSv6 PS-DHCP-SUBSv6 ];
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor $RR1_V4;
        }
    }
}
```

## junos/protocols/bgp-overlay-bng-three-rr.conf

```
/*
 * Topic: iBGP overlay sessions from a BNG to three route reflectors
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   total 2
 * Variant group: bbe-bgp-overlay
 *   Provides: evpn, inet-vpn, inet6-vpn, labeled-unicast
 * Highlights:
 *  - `labeled-unicast resolve-vpn` resolves VPN next hops over BGP-LU, and the IPv4/IPv6 VPN families carry the subscriber VRF routes.
 *  - Exports subscriber IPv6 routes through `PS-PPPOE-SUBSv6` and `PS-DHCP-SUBSv6`.
 *  - BFD (100 ms x 3) protects every session.
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-dhcp-subsv6.conf
 *  - junos/policy-options/policy-statement/ps-pppoe-subsv6.conf
 *
 * Peers with:
 *   [agn1_acx7100-32c] <-> [bng1_mx304]
 *   [agn1_acx7100-32c] <-> [bng2_mx204]
 *   [agn2_acx7100-32c] <-> [bng1_mx304]
 *   [agn2_acx7100-32c] <-> [bng2_mx204]
 *   [bng1_mx304] <-> [cr1_ptx10004]
 *   [bng2_mx204] <-> [cr1_ptx10004]
 * Variables (example values from bng1_mx304):
 *   $LOOPBACK_V4  e.g. 192.168.0.7
 *   $RR1_V4       e.g. 192.168.0.5
 *   $RR2_V4       e.g. 192.168.0.6
 *   $RR3_V4       e.g. 192.168.0.11
 */
protocols {
    bgp {
        vpn-apply-export;
        group GR-IBGP-CR {
            type internal;
            local-address $LOOPBACK_V4;
            family inet {
                labeled-unicast {
                    resolve-vpn;
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
            family evpn {
                signaling;
            }
            export [ PS-PPPOE-SUBSv6 PS-DHCP-SUBSv6 ];
            bfd-liveness-detection {
                minimum-interval 100;
                multiplier 3;
            }
            neighbor $RR1_V4;
            neighbor $RR2_V4;
            neighbor $RR3_V4;
        }
    }
}
```

## junos/protocols/isis-intf-l1-tilfa-bfd.conf

```
/*
 * Topic: IS-IS level 1 point-to-point core interface with TI-LFA node protection and BFD
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204
 *   EVO: (none)
 * Count:
 *   bng1_mx304 3
 *   bng2_mx204 3
 *   total 6
 * Highlights:
 *  - `post-convergence-lfa node-protection` computes node-protecting TI-LFA backups on this link.
 *  - Point-to-point adjacency with BFD (100 ms x 3, no adaptation) for fast failure detection.
 * Pair with:
 *  - junos/interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-16.conf
 *
 * Variables (example values from bng1_mx304):
 *   $CORE_INTF  e.g. et-0/0/2.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 1 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
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

## junos/protocols/isis-intf-l2-tilfa-bfd.conf

```
/*
 * Topic: IS-IS level 2 point-to-point core interface with TI-LFA node protection and BFD
 * Seen on:
 *   Junos: bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng3_mx10004 2
 *   bng4_mx480 2
 *   total 4
 * Highlights:
 *  - `post-convergence-lfa node-protection` computes node-protecting TI-LFA backups on this link.
 *  - Point-to-point adjacency with BFD (100 ms x 3, no adaptation) for fast failure detection.
 * Pair with:
 *  - junos/interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-16.conf
 *
 * Variables (example values from bng3_mx10004):
 *   $CORE_INTF  e.g. ae0.0
 */
protocols {
    isis {
        interface $CORE_INTF {
            level 2 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
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

## junos/protocols/isis-loopback-passive.conf

```
/*
 * Topic: IS-IS passive loopback interface
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Advertises the lo0.0 loopback into IS-IS without forming adjacencies.
 * Pair with:
 *  - junos/interfaces/ifl-loopback-primary-iso.conf
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

## junos/protocols/isis-srmpls-tilfa-l1.conf

```
/*
 * Topic: IS-IS level 1 instance with SR-MPLS TI-LFA
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   total 2
 * Highlights:
 *  - Runs level 1 only (`level 2 disable`) with wide metrics.
 *  - Segment-routing TI-LFA backups (`use-post-convergence-lfa`, `use-source-packet-routing`) with microloop avoidance after convergence.
 *  - `traffic-engineering l3-unicast-topology` exports the IS-IS topology for traffic engineering.
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-isis-export.conf
 *
 * Variables: none
 */
protocols {
    isis {
        source-packet-routing explicit-null;
        level 1 wide-metrics-only;
        level 2 disable;
        spf-options {
            microloop-avoidance {
                post-convergence-path {
                    delay 5000;
                }
            }
            multipath {
                weighted one-hop;
            }
        }
        backup-spf-options {
            use-post-convergence-lfa maximum-labels 5;
            use-source-packet-routing;
        }
        traffic-engineering {
            l3-unicast-topology;
            advertisement always;
        }
        export PS-ISIS-EXPORT;
    }
}
```

## junos/protocols/isis-srmpls-tilfa-l2.conf

```
/*
 * Topic: IS-IS level 2 instance with SR-MPLS TI-LFA
 * Seen on:
 *   Junos: bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 2
 * Highlights:
 *  - Runs level 2 only (`level 1 disable`) with wide metrics.
 *  - Segment-routing TI-LFA backups (`use-post-convergence-lfa`, `use-source-packet-routing`) with microloop avoidance after convergence.
 *  - `traffic-engineering l3-unicast-topology` exports the IS-IS topology for traffic engineering.
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-isis-export.conf
 *
 * Variables: none
 */
protocols {
    isis {
        source-packet-routing explicit-null;
        level 2 wide-metrics-only;
        level 1 disable;
        spf-options {
            microloop-avoidance {
                post-convergence-path {
                    delay 5000;
                }
            }
            multipath {
                weighted one-hop;
            }
        }
        backup-spf-options {
            use-post-convergence-lfa maximum-labels 5;
            use-source-packet-routing;
        }
        traffic-engineering {
            l3-unicast-topology;
            advertisement always;
        }
        export PS-ISIS-EXPORT;
    }
}
```

## junos/protocols/mpls-srgb-ipv6-tunneling.conf

```
/*
 * Topic: MPLS segment-routing global block with IPv6 tunneling
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - `srgb-label-range` reserves the domain-wide segment-routing global block (800000-890000).
 *  - `ipv6-tunneling` resolves IPv6 BGP next hops over the IPv4 MPLS transport.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
protocols {
    mpls {
        label-range {
            srgb-label-range 800000 890000;
        }
        ipv6-tunneling;
    }
}
```

## junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf

```
/*
 * Topic: EVPN-VPWS routing instance with one attachment circuit
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 24
 *   bng2_mx204 24
 *   bng3_mx10004 24
 *   bng4_mx480 24
 *   total 96
 * Highlights:
 *  - One attachment circuit per instance, identified to the remote PE by the vpws-service-id local/remote pair.
 * Pair with:
 *  - variant:bbe-bgp-overlay families=evpn
 *
 * Variables (example values from bng1_mx304 / METRO_BBE_EVPN_VPWS_IPoE_GROUP_1):
 *   $INSTANCE_NAME       e.g. METRO_BBE_EVPN_VPWS_IPoE_GROUP_1
 *   $AC_IFL              e.g. ps11.0
 *   $VPWS_SVC_ID_LOCAL   e.g. 31
 *   $VPWS_SVC_ID_REMOTE  e.g. 11
 *   $RD_SUB_ADMIN        e.g. 192.168.107.107
 *   $RD_SUB_ASSIGNED     e.g. 1041
 *   $RT_AS               e.g. 60000
 *   $RT_ID               e.g. 1041
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
            }
        }
        interface $AC_IFL;
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
    }
}
```

## junos/routing-instances/l3vpn/ri-dhcp-subs-four-pools-three-v6-aggregates.conf

```
/*
 * Topic: DHCP subscriber VRF dhcp-subs with four BNG subscriber pools and three IPv6 aggregates
 * Seen on:
 *   Junos: bng3_mx10004
 *   EVO: (none)
 * Count:
 *   bng3_mx10004 1
 *   total 1
 * Highlights:
 *  - VRF for DHCP/IPoE subscribers: authenticates through access profile `vlan-auth-access1`, anchors on a dedicated loopback unit, and runs the DHCPv4/DHCPv6 local server.
 *  - Dual-stack group `dhcp-ds` binds the DHCPv4 and DHCPv6 sessions of one subscriber, classified by MAC address, through dynamic profile `prod-dhcp-base`.
 *  - Pools `dhcp_v4_pool` and `dhcp_v6_pool` serve this BNG's subscriber prefix; the VRF aggregates every BNG's subscriber prefix and installs the other BNGs' prefixes and gateways as discard routes.
 * Pair with:
 *  - junos/access/profile-vlan-auth-access1.conf
 *  - junos/dynamic-profiles/prod-dhcp-base.conf
 *  - junos/interfaces/ifl-loopback-description-primary-secondary.conf
 *  - junos/policy-options/policy-statement/dhcp-subs-vrf-export-pol.conf
 *  - junos/policy-options/policy-statement/dhcp-subs-vrf-import-pol.conf
 *
 * Variables (example values from bng3_mx10004):
 *   $SUBSCRIBER_V6_PFX_1       e.g. fc00:125:140::/64
 *   $SUBSCRIBER_V6_PFX_2       e.g. fc00:126:140::/64
 *   $SUBSCRIBER_V6_PFX_3       e.g. fc00:127:140::/64
 *   $SUBSCRIBER_V4_PFX_1       e.g. 10.42.0.0/16
 *   $SUBSCRIBER_V4_PFX_2       e.g. 10.43.0.0/16
 *   $SUBSCRIBER_V4_PFX_3       e.g. 10.44.0.0/16
 *   $SUBSCRIBER_V4_PFX_4       e.g. 10.45.0.0/16
 *   $PEER_SUBSCRIBER_V6_PFX_1  e.g. fc00:125:140::/64
 *   $PEER_SUBSCRIBER_V6_PFX_2  e.g. fc00:126:140::/64
 *   $PEER_SUBSCRIBER_V6_PFX_3  e.g. fc00:128:140::/64
 *   $PEER_SUBSCRIBER_V4_GW_1   e.g. 10.42.0.1
 *   $PEER_SUBSCRIBER_V4_GW_2   e.g. 10.43.0.1
 *   $PEER_SUBSCRIBER_V4_GW_3   e.g. 10.45.0.1
 *   $SUBSCRIBER_V4_POOL        e.g. 10.44.0.0/16
 *   $SUBSCRIBER_V4_GW          e.g. 10.44.0.1
 *   $SUBSCRIBER_V4_RANGE_LOW   e.g. 10.44.0.2
 *   $SUBSCRIBER_V4_RANGE_HIGH  e.g. 10.44.255.254
 *   $SUBSCRIBER_V6_POOL        e.g. fc00:127:140::/64
 *   $SUBSCRIBER_V6_RANGE_LOW   e.g. fc00:127:140::2/128
 *   $SUBSCRIBER_V6_RANGE_HIGH  e.g. fc00:127:140::ffff/128
 *   $USER_PASS                 e.g. "<USER_PASS>"
 *   $DOMAIN_NAME               e.g. example.net
 *   $USER_PREFIX               e.g. pwht_dhcp
 *   $UNIT                      e.g. 313
 *   $RD_SUB_ADMIN              e.g. 192.168.209.209
 *   $RD_SUB_ASSIGNED           e.g. 1046
 */
routing-instances {
    dhcp-subs {
        instance-type vrf;
        routing-options {
            rib dhcp-subs.inet6.0 {
                static {
                    route $PEER_SUBSCRIBER_V6_PFX_1 discard;
                    route $PEER_SUBSCRIBER_V6_PFX_2 discard;
                    route $PEER_SUBSCRIBER_V6_PFX_3 discard;
                }
                aggregate {
                    route $SUBSCRIBER_V6_PFX_1;
                    route $SUBSCRIBER_V6_PFX_2;
                    route $SUBSCRIBER_V6_PFX_3;
                }
            }
            static {
                route $PEER_SUBSCRIBER_V4_GW_1/32 discard;
                route $PEER_SUBSCRIBER_V4_GW_2/32 discard;
                route $PEER_SUBSCRIBER_V4_GW_3/32 discard;
            }
            aggregate {
                route $SUBSCRIBER_V4_PFX_1;
                route $SUBSCRIBER_V4_PFX_2;
                route $SUBSCRIBER_V4_PFX_3;
                route $SUBSCRIBER_V4_PFX_4;
            }
            auto-export;
        }
        system {
            services {
                dhcp-local-server {
                    dhcpv6 {
                        group dhcp6-ls {
                            authentication {
                                password $USER_PASS;
                                username-include {
                                    domain-name $DOMAIN_NAME;
                                    user-prefix $USER_PREFIX;
                                }
                            }
                            dynamic-profile prod-dhcp-base;
                            overrides {
                                delegated-pool dhcp_v6_pool;
                                dual-stack dhcp-ds;
                            }
                            interface demux0.0;
                            interface demux0.1;
                            interface ps11.0;
                            interface ps12.0;
                            interface ps13.0;
                            interface ps14.0;
                            interface ps15.0;
                            interface ps16.0;
                            interface ps17.0;
                            interface ps18.0;
                            interface ps19.0;
                            interface ps20.0;
                            interface ps32.0;
                            interface ps36.0;
                        }
                        server-duid-type {
                            duid_ll;
                        }
                    }
                    pool-match-order {
                        ip-address-first;
                    }
                    group dhcp-ls {
                        overrides {
                            client-discover-match incoming-interface;
                            dual-stack dhcp-ds;
                        }
                        interface demux0.0;
                        interface demux0.1;
                        interface ps11.0;
                        interface ps12.0;
                        interface ps13.0;
                        interface ps14.0;
                        interface ps15.0;
                        interface ps16.0;
                        interface ps17.0;
                        interface ps18.0;
                        interface ps19.0;
                        interface ps20.0;
                        interface ps32.0;
                        interface ps36.0;
                    }
                    dual-stack-group dhcp-ds {
                        authentication {
                            password $USER_PASS;
                            username-include {
                                domain-name $DOMAIN_NAME;
                                user-prefix $USER_PREFIX;
                            }
                        }
                        dynamic-profile prod-dhcp-base;
                        on-demand-address-allocation;
                        classification-key {
                            mac-address;
                        }
                    }
                    no-stale-timer-refresh;
                    stale-timer 60;
                }
            }
        }
        access {
            address-assignment {
                high-utilization 80;
                abated-utilization 70;
                pool dhcp_v4_pool {
                    family inet {
                        network $SUBSCRIBER_V4_POOL;
                        range range1 {
                            low $SUBSCRIBER_V4_RANGE_LOW;
                            high $SUBSCRIBER_V4_RANGE_HIGH;
                        }
                        dhcp-attributes {
                            maximum-lease-time 600;
                            server-identifier $SUBSCRIBER_V4_GW;
                            router {
                                $SUBSCRIBER_V4_GW;
                            }
                        }
                    }
                }
                pool dhcp_v6_pool {
                    family inet6 {
                        prefix $SUBSCRIBER_V6_POOL;
                        range rangev6 {
                            low $SUBSCRIBER_V6_RANGE_LOW;
                            high $SUBSCRIBER_V6_RANGE_HIGH;
                        }
                        dhcp-attributes {
                            maximum-lease-time 600;
                        }
                    }
                }
            }
        }
        access-profile vlan-auth-access1;
        interface lo0.$UNIT;
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-import dhcp-subs-vrf-import-pol;
        vrf-export dhcp-subs-vrf-export-pol;
        vrf-table-label;
    }
}
```

## junos/routing-instances/l3vpn/ri-dhcp-subs-four-pools.conf

```
/*
 * Topic: DHCP subscriber VRF dhcp-subs with four BNG subscriber pools
 * Seen on:
 *   Junos: bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng4_mx480 1
 *   total 1
 * Highlights:
 *  - VRF for DHCP/IPoE subscribers: authenticates through access profile `vlan-auth-access1`, anchors on a dedicated loopback unit, and runs the DHCPv4/DHCPv6 local server.
 *  - Dual-stack group `dhcp-ds` binds the DHCPv4 and DHCPv6 sessions of one subscriber, classified by MAC address, through dynamic profile `prod-dhcp-base`.
 *  - Pools `dhcp_v4_pool` and `dhcp_v6_pool` serve this BNG's subscriber prefix; the VRF aggregates every BNG's subscriber prefix and installs the other BNGs' prefixes and gateways as discard routes.
 * Pair with:
 *  - junos/access/profile-vlan-auth-access1.conf
 *  - junos/dynamic-profiles/prod-dhcp-base.conf
 *  - junos/interfaces/ifl-loopback-description-primary-secondary.conf
 *  - junos/policy-options/policy-statement/dhcp-subs-vrf-export-pol.conf
 *  - junos/policy-options/policy-statement/dhcp-subs-vrf-import-pol.conf
 *
 * Variables (example values from bng4_mx480):
 *   $SUBSCRIBER_V6_PFX_1       e.g. fc00:125:140::/64
 *   $SUBSCRIBER_V6_PFX_2       e.g. fc00:126:140::/64
 *   $SUBSCRIBER_V6_PFX_3       e.g. fc00:127:140::/64
 *   $SUBSCRIBER_V6_PFX_4       e.g. fc00:128:140::/64
 *   $SUBSCRIBER_V4_PFX_1       e.g. 10.42.0.0/16
 *   $SUBSCRIBER_V4_PFX_2       e.g. 10.43.0.0/16
 *   $SUBSCRIBER_V4_PFX_3       e.g. 10.44.0.0/16
 *   $SUBSCRIBER_V4_PFX_4       e.g. 10.45.0.0/16
 *   $PEER_SUBSCRIBER_V6_PFX_1  e.g. fc00:125:140::/64
 *   $PEER_SUBSCRIBER_V6_PFX_2  e.g. fc00:126:140::/64
 *   $PEER_SUBSCRIBER_V6_PFX_3  e.g. fc00:127:140::/64
 *   $PEER_SUBSCRIBER_V4_GW_1   e.g. 10.42.0.1
 *   $PEER_SUBSCRIBER_V4_GW_2   e.g. 10.43.0.1
 *   $PEER_SUBSCRIBER_V4_GW_3   e.g. 10.44.0.1
 *   $SUBSCRIBER_V4_POOL        e.g. 10.45.0.0/16
 *   $SUBSCRIBER_V4_GW          e.g. 10.45.0.1
 *   $SUBSCRIBER_V4_RANGE_LOW   e.g. 10.45.0.2
 *   $SUBSCRIBER_V4_RANGE_HIGH  e.g. 10.45.255.254
 *   $SUBSCRIBER_V6_POOL        e.g. fc00:128:140::/64
 *   $SUBSCRIBER_V6_RANGE_LOW   e.g. fc00:128:140::2/128
 *   $SUBSCRIBER_V6_RANGE_HIGH  e.g. fc00:128:140::ffff/128
 *   $USER_PASS                 e.g. "<USER_PASS>"
 *   $DOMAIN_NAME               e.g. example.net
 *   $USER_PREFIX               e.g. pwht_dhcp
 *   $UNIT                      e.g. 313
 *   $RD_SUB_ADMIN              e.g. 192.168.210.210
 *   $RD_SUB_ASSIGNED           e.g. 1046
 */
routing-instances {
    dhcp-subs {
        instance-type vrf;
        routing-options {
            rib dhcp-subs.inet6.0 {
                static {
                    route $PEER_SUBSCRIBER_V6_PFX_1 discard;
                    route $PEER_SUBSCRIBER_V6_PFX_2 discard;
                    route $PEER_SUBSCRIBER_V6_PFX_3 discard;
                }
                aggregate {
                    route $SUBSCRIBER_V6_PFX_1;
                    route $SUBSCRIBER_V6_PFX_2;
                    route $SUBSCRIBER_V6_PFX_3;
                    route $SUBSCRIBER_V6_PFX_4;
                }
            }
            static {
                route $PEER_SUBSCRIBER_V4_GW_1/32 discard;
                route $PEER_SUBSCRIBER_V4_GW_2/32 discard;
                route $PEER_SUBSCRIBER_V4_GW_3/32 discard;
            }
            aggregate {
                route $SUBSCRIBER_V4_PFX_1;
                route $SUBSCRIBER_V4_PFX_2;
                route $SUBSCRIBER_V4_PFX_3;
                route $SUBSCRIBER_V4_PFX_4;
            }
            auto-export;
        }
        system {
            services {
                dhcp-local-server {
                    dhcpv6 {
                        group dhcp6-ls {
                            authentication {
                                password $USER_PASS;
                                username-include {
                                    domain-name $DOMAIN_NAME;
                                    user-prefix $USER_PREFIX;
                                }
                            }
                            dynamic-profile prod-dhcp-base;
                            overrides {
                                delegated-pool dhcp_v6_pool;
                                dual-stack dhcp-ds;
                            }
                            interface demux0.0;
                            interface demux0.1;
                            interface ps11.0;
                            interface ps12.0;
                            interface ps13.0;
                            interface ps14.0;
                            interface ps15.0;
                            interface ps16.0;
                            interface ps17.0;
                            interface ps18.0;
                            interface ps19.0;
                            interface ps20.0;
                            interface ps32.0;
                            interface ps36.0;
                        }
                        server-duid-type {
                            duid_ll;
                        }
                    }
                    pool-match-order {
                        ip-address-first;
                    }
                    group dhcp-ls {
                        overrides {
                            client-discover-match incoming-interface;
                            dual-stack dhcp-ds;
                        }
                        interface demux0.0;
                        interface demux0.1;
                        interface ps11.0;
                        interface ps12.0;
                        interface ps13.0;
                        interface ps14.0;
                        interface ps15.0;
                        interface ps16.0;
                        interface ps17.0;
                        interface ps18.0;
                        interface ps19.0;
                        interface ps20.0;
                        interface ps32.0;
                        interface ps36.0;
                    }
                    dual-stack-group dhcp-ds {
                        authentication {
                            password $USER_PASS;
                            username-include {
                                domain-name $DOMAIN_NAME;
                                user-prefix $USER_PREFIX;
                            }
                        }
                        dynamic-profile prod-dhcp-base;
                        on-demand-address-allocation;
                        classification-key {
                            mac-address;
                        }
                    }
                    no-stale-timer-refresh;
                    stale-timer 60;
                }
            }
        }
        access {
            address-assignment {
                high-utilization 80;
                abated-utilization 70;
                pool dhcp_v4_pool {
                    family inet {
                        network $SUBSCRIBER_V4_POOL;
                        range range1 {
                            low $SUBSCRIBER_V4_RANGE_LOW;
                            high $SUBSCRIBER_V4_RANGE_HIGH;
                        }
                        dhcp-attributes {
                            maximum-lease-time 600;
                            server-identifier $SUBSCRIBER_V4_GW;
                            router {
                                $SUBSCRIBER_V4_GW;
                            }
                        }
                    }
                }
                pool dhcp_v6_pool {
                    family inet6 {
                        prefix $SUBSCRIBER_V6_POOL;
                        range rangev6 {
                            low $SUBSCRIBER_V6_RANGE_LOW;
                            high $SUBSCRIBER_V6_RANGE_HIGH;
                        }
                        dhcp-attributes {
                            maximum-lease-time 600;
                        }
                    }
                }
            }
        }
        access-profile vlan-auth-access1;
        interface lo0.$UNIT;
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-import dhcp-subs-vrf-import-pol;
        vrf-export dhcp-subs-vrf-export-pol;
        vrf-table-label;
    }
}
```

## junos/routing-instances/l3vpn/ri-dhcp-subs-two-pools.conf

```
/*
 * Topic: DHCP subscriber VRF dhcp-subs with two BNG subscriber pools
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   total 2
 * Highlights:
 *  - VRF for DHCP/IPoE subscribers: authenticates through access profile `vlan-auth-access1`, anchors on a dedicated loopback unit, and runs the DHCPv4/DHCPv6 local server.
 *  - Dual-stack group `dhcp-ds` binds the DHCPv4 and DHCPv6 sessions of one subscriber, classified by MAC address, through dynamic profile `prod-dhcp-base`.
 *  - Pools `dhcp_v4_pool` and `dhcp_v6_pool` serve this BNG's subscriber prefix; the VRF aggregates every BNG's subscriber prefix and installs the other BNGs' prefixes and gateways as discard routes.
 * Pair with:
 *  - junos/access/profile-vlan-auth-access1.conf
 *  - junos/dynamic-profiles/prod-dhcp-base.conf
 *  - junos/interfaces/ifl-loopback-description-primary-secondary.conf
 *  - junos/policy-options/policy-statement/dhcp-subs-vrf-export-pol.conf
 *  - junos/policy-options/policy-statement/dhcp-subs-vrf-import-pol.conf
 *
 * Variables (example values from bng1_mx304):
 *   $SUBSCRIBER_V6_PFX_1       e.g. fc00:125:140::/64
 *   $SUBSCRIBER_V6_PFX_2       e.g. fc00:126:140::/64
 *   $SUBSCRIBER_V4_PFX_1       e.g. 10.42.0.0/16
 *   $SUBSCRIBER_V4_PFX_2       e.g. 10.43.0.0/16
 *   $PEER_SUBSCRIBER_V6_PFX_1  e.g. fc00:126:140::/64
 *   $PEER_SUBSCRIBER_V4_GW_1   e.g. 10.43.0.1
 *   $SUBSCRIBER_V4_POOL        e.g. 10.42.0.0/16
 *   $SUBSCRIBER_V4_GW          e.g. 10.42.0.1
 *   $SUBSCRIBER_V4_RANGE_LOW   e.g. 10.42.0.2
 *   $SUBSCRIBER_V4_RANGE_HIGH  e.g. 10.42.255.254
 *   $SUBSCRIBER_V6_POOL        e.g. fc00:125:140::/64
 *   $SUBSCRIBER_V6_RANGE_LOW   e.g. fc00:125:140::2/128
 *   $SUBSCRIBER_V6_RANGE_HIGH  e.g. fc00:125:140::ffff/128
 *   $USER_PASS                 e.g. "<USER_PASS>"
 *   $DOMAIN_NAME               e.g. example.net
 *   $USER_PREFIX               e.g. pwht_dhcp
 *   $UNIT                      e.g. 313
 *   $RD_SUB_ADMIN              e.g. 192.168.207.207
 *   $RD_SUB_ASSIGNED           e.g. 1046
 */
routing-instances {
    dhcp-subs {
        instance-type vrf;
        routing-options {
            rib dhcp-subs.inet6.0 {
                static {
                    route $PEER_SUBSCRIBER_V6_PFX_1 discard;
                }
                aggregate {
                    route $SUBSCRIBER_V6_PFX_1;
                    route $SUBSCRIBER_V6_PFX_2;
                }
            }
            static {
                route $PEER_SUBSCRIBER_V4_GW_1/32 discard;
            }
            aggregate {
                route $SUBSCRIBER_V4_PFX_1;
                route $SUBSCRIBER_V4_PFX_2;
            }
            auto-export;
        }
        system {
            services {
                dhcp-local-server {
                    dhcpv6 {
                        group dhcp6-ls {
                            authentication {
                                password $USER_PASS;
                                username-include {
                                    domain-name $DOMAIN_NAME;
                                    user-prefix $USER_PREFIX;
                                }
                            }
                            dynamic-profile prod-dhcp-base;
                            overrides {
                                delegated-pool dhcp_v6_pool;
                                dual-stack dhcp-ds;
                            }
                            interface demux0.0;
                            interface demux0.1;
                            interface ps11.0;
                            interface ps12.0;
                            interface ps13.0;
                            interface ps14.0;
                            interface ps15.0;
                            interface ps16.0;
                            interface ps17.0;
                            interface ps18.0;
                            interface ps19.0;
                            interface ps20.0;
                            interface ps32.0;
                            interface ps36.0;
                        }
                        server-duid-type {
                            duid_ll;
                        }
                    }
                    pool-match-order {
                        ip-address-first;
                    }
                    group dhcp-ls {
                        overrides {
                            client-discover-match incoming-interface;
                            dual-stack dhcp-ds;
                        }
                        interface demux0.0;
                        interface demux0.1;
                        interface ps11.0;
                        interface ps12.0;
                        interface ps13.0;
                        interface ps14.0;
                        interface ps15.0;
                        interface ps16.0;
                        interface ps17.0;
                        interface ps18.0;
                        interface ps19.0;
                        interface ps20.0;
                        interface ps32.0;
                        interface ps36.0;
                    }
                    dual-stack-group dhcp-ds {
                        authentication {
                            password $USER_PASS;
                            username-include {
                                domain-name $DOMAIN_NAME;
                                user-prefix $USER_PREFIX;
                            }
                        }
                        dynamic-profile prod-dhcp-base;
                        on-demand-address-allocation;
                        classification-key {
                            mac-address;
                        }
                    }
                    no-stale-timer-refresh;
                    stale-timer 60;
                }
            }
        }
        access {
            address-assignment {
                high-utilization 80;
                abated-utilization 70;
                pool dhcp_v4_pool {
                    family inet {
                        network $SUBSCRIBER_V4_POOL;
                        range range1 {
                            low $SUBSCRIBER_V4_RANGE_LOW;
                            high $SUBSCRIBER_V4_RANGE_HIGH;
                        }
                        dhcp-attributes {
                            maximum-lease-time 600;
                            server-identifier $SUBSCRIBER_V4_GW;
                            router {
                                $SUBSCRIBER_V4_GW;
                            }
                        }
                    }
                }
                pool dhcp_v6_pool {
                    family inet6 {
                        prefix $SUBSCRIBER_V6_POOL;
                        range rangev6 {
                            low $SUBSCRIBER_V6_RANGE_LOW;
                            high $SUBSCRIBER_V6_RANGE_HIGH;
                        }
                        dhcp-attributes {
                            maximum-lease-time 600;
                        }
                    }
                }
            }
        }
        access-profile vlan-auth-access1;
        interface lo0.$UNIT;
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-import dhcp-subs-vrf-import-pol;
        vrf-export dhcp-subs-vrf-export-pol;
        vrf-table-label;
    }
}
```

## junos/routing-instances/l3vpn/ri-pppoe-subs.conf

```
/*
 * Topic: PPPoE subscriber VRF PPPOE_SUBS_1 with local address pools
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Pool `pppv4-pool` assigns IPv4 addresses and `pppv6-pool` advertises /64 prefixes through router advertisements (`ndra-range`); both are aggregated for export.
 *  - Imports and exports routes through `PS-PPPOE-SUBS-1-VRF-IMPORT` and `PS-PPPOE-SUBS-1-VRF-EXPORT`; `auto-export` leaks local routes between VRFs.
 * Pair with:
 *  - junos/interfaces/ifl-loopback-primary.conf
 *  - junos/policy-options/policy-statement/ps-pppoe-subs-1-vrf-export.conf
 *  - junos/policy-options/policy-statement/ps-pppoe-subs-1-vrf-import.conf
 *
 * Variables (example values from bng1_mx304):
 *   $SUBSCRIBER_V6_PFX_1  e.g. fc00:25:140::/48
 *   $SUBSCRIBER_V4_PFX_1  e.g. 10.25.0.0/16
 *   $UNIT                 e.g. 1
 *   $RD_SUB_ADMIN         e.g. 207.207.207.207
 *   $RD_SUB_ASSIGNED      e.g. 1031
 */
routing-instances {
    PPPOE_SUBS_1 {
        instance-type vrf;
        routing-options {
            rib PPPOE_SUBS_1.inet6.0 {
                aggregate {
                    route $SUBSCRIBER_V6_PFX_1;
                }
            }
            aggregate {
                route $SUBSCRIBER_V4_PFX_1;
            }
            auto-export;
        }
        access {
            address-assignment {
                neighbor-discovery-router-advertisement pppv6-pool;
                pool pppv4-pool {
                    family inet {
                        network $SUBSCRIBER_V4_PFX_1;
                    }
                }
                pool pppv6-pool {
                    family inet6 {
                        prefix $SUBSCRIBER_V6_PFX_1;
                        range ndra-range prefix-length 64;
                    }
                }
            }
        }
        interface lo0.$UNIT;
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-import PS-PPPOE-SUBS-1-VRF-IMPORT;
        vrf-export PS-PPPOE-SUBS-1-VRF-EXPORT;
        vrf-table-label;
    }
}
```

## junos/routing-instances/l3vpn/ri-radius.conf

```
/*
 * Topic: RADIUS VRF on a BNG reaching the RADIUS server through the core
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Sources RADIUS traffic from a dedicated loopback unit in VRF `RADIUS`.
 *  - Imports and exports routes through `PS-RADIUS-VRF-IMPORT` and `PS-RADIUS-VRF-EXPORT`.
 * Pair with:
 *  - junos/interfaces/ifl-loopback-primary.conf
 *  - junos/policy-options/policy-statement/ps-radius-vrf-export.conf
 *  - junos/policy-options/policy-statement/ps-radius-vrf-import.conf
 *
 * Variables (example values from bng1_mx304):
 *   $UNIT             e.g. 7
 *   $RD_SUB_ADMIN     e.g. 192.168.117.117
 *   $RD_SUB_ASSIGNED  e.g. 1117
 */
routing-instances {
    RADIUS {
        instance-type vrf;
        routing-options {
            auto-export;
        }
        interface lo0.$UNIT;
        route-distinguisher $RD_SUB_ADMIN:$RD_SUB_ASSIGNED;
        vrf-import PS-RADIUS-VRF-IMPORT;
        vrf-export PS-RADIUS-VRF-EXPORT;
        vrf-table-label;
    }
}
```

## junos/routing-options/autonomous-system.conf

```
/*
 * Topic: Device autonomous-system number
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng1_mx304):
 *   $ASN  e.g. 65001
 */
routing-options {
    autonomous-system $ASN;
}
```

## junos/routing-options/forwarding-table-pplb-chained-evpn.conf

```
/*
 * Topic: Forwarding table with per-packet load balancing and EVPN ingress chained composite next hops
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Exports `PS-PPLB` to the forwarding table, so equal-cost routes install as multiple forwarding next hops.
 *  - `chained-composite-next-hop ingress evpn` shares forwarding state among EVPN routes that use the same transport tunnel.
 * Pair with:
 *  - junos/policy-options/policy-statement/ps-pplb.conf
 *
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    forwarding-table {
        export PS-PPLB;
        chained-composite-next-hop {
            ingress {
                evpn;
            }
        }
    }
}
```

## junos/routing-options/nonstop-routing.conf

```
/*
 * Topic: Nonstop active routing
 * Seen on:
 *   Junos: bng1_mx304 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 3
 * Highlights:
 *  - Keeps routing protocol state across a Routing Engine switchover.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    nonstop-routing;
}
```

## junos/routing-options/rib-groups-interface-routes-pppoe-v6.conf

```
/*
 * Topic: RIB group interface_routes sharing IPv6 interface routes with VRF PPPOE_SUBS_1
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Imports IPv6 interface routes into both `PPPOE_SUBS_1.inet6.0` and `inet6.0`.
 * Pair with: none
 *
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    rib-groups {
        interface_routes {
            import-rib [ PPPOE_SUBS_1.inet6.0 inet6.0 ];
        }
    }
}
```

## junos/routing-options/router-id.conf

```
/*
 * Topic: Router ID
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Pair with: none
 *
 * Peers with: n/a
 * Variables (example values from bng1_mx304):
 *   $ROUTER_ID  e.g. 192.168.0.7
 */
routing-options {
    router-id $ROUTER_ID;
}
```

## junos/system/commit-synchronize.conf

```
/*
 * Topic: Commit synchronization between Routing Engines
 * Seen on:
 *   Junos: bng1_mx304 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 3
 * Highlights:
 *  - Every commit is applied to both Routing Engines.
 * Pair with: none
 *
 * Variables: none
 */
system {
    commit synchronize;
}
```

## junos/system/configuration-database-max-size.conf

```
/*
 * Topic: Configuration database size limit
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Raises the configuration database ceiling to 300 MB for large subscriber configurations.
 * Pair with: none
 *
 * Variables: none
 */
system {
    configuration-database {
        max-db-size 314572800;
    }
}
```

## junos/system/ddos-protection-subscriber.conf

```
/*
 * Topic: DDoS protection policers for subscriber control traffic
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Polices the autoconf aggregate at 20000 pps and PPPoE PADSE at 2000 pps with a burst of 100.
 * Pair with: none
 *
 * Variables: none
 */
system {
    ddos-protection {
        protocols {
            autoconf {
                aggregate {
                    bandwidth 20000;
                    burst 20000;
                }
            }
            pppoe {
                padse {
                    bandwidth 2000;
                    burst 100;
                }
            }
        }
    }
}
```

## junos/system/dynamic-profile-options-versioning.conf

```
/*
 * Topic: Dynamic profile versioning
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Lets dynamic profiles be modified while subscribers use an earlier version.
 * Pair with: none
 *
 * Variables: none
 */
system {
    dynamic-profile-options {
        versioning;
    }
}
```

## junos/system/ports-console-log-out.conf

```
/*
 * Topic: Console log-out on disconnect
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng4_mx480 1
 *   total 3
 * Highlights:
 *  - Logs the console session out when the cable is disconnected.
 * Pair with: none
 *
 * Variables: none
 */
system {
    ports {
        console log-out-on-disconnect;
    }
}
```

## junos/system/processes-smg-service.conf

```
/*
 * Topic: Session and service management process
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Enables `smg-service`, which applies services to subscriber sessions.
 * Pair with: none
 *
 * Variables: none
 */
system {
    processes {
        smg-service;
    }
}
```

## junos/system/subscriber-management-redundancy-interface.conf

```
/*
 * Topic: Subscriber redundancy interface with shared key
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 10
 *   bng2_mx204 10
 *   bng3_mx10004 10
 *   bng4_mx480 10
 *   total 40
 * Highlights:
 *  - One statement per pseudowire-subscriber interface protected by M:N subscriber redundancy; both BNGs of the pair use the same key.
 *  - Selects `subscriber-management enable` as the context the interface needs.
 * Pair with: none
 *
 * Variables (example values from bng1_mx304):
 *   $AC_IFL                 e.g. ps11.0
 *   $REDUNDANCY_SHARED_KEY  e.g. "<REDUNDANCY_SHARED_KEY_PS11>"
 */
system {
    services {
        subscriber-management {
            enable;
            redundancy {
                interface $AC_IFL {
                    shared-key $REDUNDANCY_SHARED_KEY;
                }
            }
        }
    }
}
```

## junos/system/subscriber-management-redundancy.conf

```
/*
 * Topic: Subscriber management with M:N subscriber redundancy
 * Seen on:
 *   Junos: bng1_mx304 bng2_mx204 bng3_mx10004 bng4_mx480
 *   EVO: (none)
 * Count:
 *   bng1_mx304 1
 *   bng2_mx204 1
 *   bng3_mx10004 1
 *   bng4_mx480 1
 *   total 4
 * Highlights:
 *  - Enables subscriber management and session redundancy between BNGs.
 *  - The backup BNG does not advertise subscriber routes (`no-advertise-routes-on-backup`); route operations run every second.
 * Pair with: none
 *
 * Variables: none
 */
system {
    services {
        subscriber-management {
            enable;
            redundancy {
                no-advertise-routes-on-backup;
                route-operation-interval 1;
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

Values left literal on purpose: names other configuration refers to (dynamic
profiles, access profiles, address pools, routing instances, policies,
communities, filters, BGP groups) and JVD-wide constants such as the SRGB range.
The `$junos-*` placeholders inside `dynamic-profiles` are resolved at runtime by
the BNG subscriber-management daemons; they are not user variables and must be
left as-is in any rendered configuration.

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `65001` |
| `$ASN_CUSTOMER_V4` | **new** Customer-facing BGP peer AS of the IPv4 neighbor. | `200` |
| `$ASN_CUSTOMER_V6` | **new** Customer-facing BGP peer AS of the IPv6 neighbor. | `300` |
| `$ISIS_NET` | ISIS NET (area + system-id) configured on lo0. | `49.0000.0010.0100.0005.00` |
| `$LOOPBACK_ALT_V4_PFX` | Additional lo0 IPv4 `/32` configured on one node besides its design and management loopbacks. | `172.17.17.7/32` |
| `$LOOPBACK_V4` | Primary per-node IPv4 loopback address. | `192.168.0.5` |
| `$LOOPBACK_V4_PFX` | This node's lo0 IPv4 written with its `/32` prefix length (address form). | `192.168.0.5/32` |
| `$LOOPBACK_V6` | This PE's lo0 IPv6. | `2001:db8::192:168:0:5` |
| `$LOOPBACK_V6_PFX` | This node's lo0 IPv6 written with its `/128` prefix length. | `2001:db8::192:168:0:5/128` |
| `$ROUTER_ID` | Complete router identifier in IPv4 dotted-decimal form. | `192.168.0.5` |
| `$RR1_V4` | IPv4 loopback of a BGP route reflector this node peers with; `RR1`–`RR3` order the reflectors. | `192.168.0.5` |
| `$RR2_V4` | IPv4 loopback of a second BGP route reflector. | `192.168.0.6` |
| `$RR3_V4` | **new** IPv4 loopback of the third BGP route reflector a client peers with. | `192.168.0.11` |
| `$SR_INDEX_V4` | Segment-routing node index attached to the IPv4 loopback prefix (`prefix-segment index`). | `1005` |
| `$SR_INDEX_V6` | Segment-routing node index attached to the IPv6 loopback prefix (`prefix-segment index`). | `4005` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address on a routed attachment-circuit unit. | `10.11.110.1/24` |
| `$AC_ADDR_V6` | IPv6 address on a routed attachment-circuit unit. | `2001:db8::11:11:110:1/120` |
| `$AC_IFL` | Full logical attachment-circuit interface identifier, including its unit. | `ae1.1031` |
| `$AE_BUNDLE` | Aggregated-Ethernet bundle a member link joins (`802.3ad`). | `ae1` |
| `$AE_DEVICE_COUNT` | Number of aggregated-Ethernet devices the chassis allocates. | `25` |
| `$ANCHOR_PIC` | Anchor tunnel PIC (`lt-`) hosting the pseudowire-subscriber device. | `lt-0/0/0` |
| `$BREAKOUT_SUB_PORTS` | Number of breakout sub-ports | `4` |
| `$CORE_INTF` | Core-facing interface: the IS-IS logical unit, or a physical member of a core aggregated bundle. | `et-0/0/29` |
| `$CORE_V4_ADDR` | Core interface IPv4 address. | `10.10.115.1/24` |
| `$CORE_V6_ADDR` | Core interface IPv6 address. | `2001:db8::10:10:115:1:1/120` |
| `$DESCRIPTION` | Free-text interface `description`. | `R0-AN1-To-R12-SW1` |
| `$FPC_SLOT` | FPC slot for a complete source-measured hardware profile. | `0` |
| `$IFD` | Interface-device identifier, excluding a logical unit. | `ae0` |
| `$LACP_SYS_ID` | LACP system-id on a multihomed LAG. | `00:00:00:00:01:01` |
| `$PIC_SLOT` | PIC slot within an FPC. | `0` |
| `$STATIC_MAC` | **new** Static MAC address configured on an interface device. | `aa:aa:aa:bb:bb:bb` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `0` |
| `$UNIT_A` | First of the logical units bundled under one flexible cross-connect group. | `1065` |
| `$UNIT_B` | Second of the logical units bundled under one flexible cross-connect group. | `1066` |
| `$VLAN` | A single VLAN identifier. | `1002` |

## Services (EVPN-VPWS, VRFs)

| Variable | What it is | Example value |
|---|---|---|
| `$CE_PEER_V4` | IPv4 address of the external BGP peer (CE). | `10.11.110.2` |
| `$CE_PEER_V6` | IPv6 address of the external BGP peer (CE). | `2001:db8::11:11:110:2` |
| `$DF_PREFERENCE` | Designated-forwarder election preference value on an all-active ESI (`df-election-type preference value`); higher wins. | `1000` |
| `$ESI` | 10-byte ESI (for EVPN multihoming). | `00:15:15:15:00:00:00:15:15:15` |
| `$INSTANCE_NAME` | Identity stem of a service instance. | `METRO_BBE_EVPN_FXC_IPoE-GROUP_1` |
| `$NEXT_HOP_V4` | **new** Explicit IPv4 next hop set by a routing policy. | `192.168.0.11` |
| `$NEXT_HOP_V6` | **new** Explicit IPv6 next hop set by a routing policy. | `2001:db8::192:168:0:b` |
| `$RD_SUB_ADMIN` | Route Distinguisher Administrator subfield. | `100.100.100.100` |
| `$RD_SUB_ASSIGNED` | Route Distinguisher Assigned Number subfield. | `3001` |
| `$RT_AS` | Route Target Administrator subfield. | `20000` |
| `$RT_ID` | Route Target Assigned Number subfield. | `1031` |
| `$SVC_ID_LOCAL` | EVPN-VPWS local service-id of a flexible cross-connect group. | `5002` |
| `$SVC_ID_REMOTE` | EVPN-VPWS remote service-id of a flexible cross-connect group. | `6002` |
| `$VPWS_SVC_ID_LOCAL` | EVPN-VPWS local service-id. | `1` |
| `$VPWS_SVC_ID_REMOTE` | EVPN-VPWS remote service-id. | `21` |

## Subscriber management (BNG)

| Variable | What it is | Example value |
|---|---|---|
| `$DOMAIN_NAME` | **new** Domain appended to a generated subscriber username. | `example.net` |
| `$NAS_IDENTIFIER` | **new** RADIUS NAS-Identifier string. | `R7-BNG1` |
| `$PEER_SUBSCRIBER_V4_GW_1` | **new** Another BNG's subscriber IPv4 gateway, one of an ordered set. | `10.42.0.1` |
| `$PEER_SUBSCRIBER_V4_GW_2` | **new** Another BNG's subscriber IPv4 gateway, one of an ordered set. | `10.43.0.1` |
| `$PEER_SUBSCRIBER_V4_GW_3` | **new** Another BNG's subscriber IPv4 gateway, one of an ordered set. | `10.45.0.1` |
| `$PEER_SUBSCRIBER_V6_PFX_1` | **new** Another BNG's subscriber IPv6 prefix, one of an ordered set. | `fc00:125:140::/64` |
| `$PEER_SUBSCRIBER_V6_PFX_2` | **new** Another BNG's subscriber IPv6 prefix, one of an ordered set. | `fc00:126:140::/64` |
| `$PEER_SUBSCRIBER_V6_PFX_3` | **new** Another BNG's subscriber IPv6 prefix, one of an ordered set. | `fc00:128:140::/64` |
| `$PS_DEVICE_COUNT` | Allocated pseudowire-subscriber devices; greater than the configured device count and highest PS index. | `100` |
| `$RADIUS_SECRET` | **new** RADIUS shared secret. | `"<RADIUS_SECRET_VLAN_AUTH_ACCESS1>"` |
| `$RADIUS_SERVER_V4` | **new** IPv4 address of a RADIUS server. | `192.0.2.2` |
| `$RADIUS_SOURCE_V4` | **new** IPv4 source address for RADIUS requests. | `192.168.17.17` |
| `$REDUNDANCY_SHARED_KEY` | **new** Subscriber-redundancy shared key. | `"<REDUNDANCY_SHARED_KEY_PS11>"` |
| `$SUBSCRIBER_V4_GW` | **new** Gateway address of this BNG's subscriber IPv4 pool. | `10.44.0.1` |
| `$SUBSCRIBER_V4_PFX_1` | **new** Subscriber IPv4 address prefix, one of an ordered set. | `10.25.0.0/16` |
| `$SUBSCRIBER_V4_PFX_2` | **new** Subscriber IPv4 address prefix, one of an ordered set. | `10.43.0.0/16` |
| `$SUBSCRIBER_V4_PFX_3` | **new** Subscriber IPv4 address prefix, one of an ordered set. | `10.44.0.0/16` |
| `$SUBSCRIBER_V4_PFX_4` | **new** Subscriber IPv4 address prefix, one of an ordered set. | `10.45.0.0/16` |
| `$SUBSCRIBER_V4_POOL` | **new** This BNG's DHCP subscriber IPv4 pool network. | `10.44.0.0/16` |
| `$SUBSCRIBER_V4_RANGE_HIGH` | **new** Last address of a subscriber IPv4 pool range. | `10.44.255.254` |
| `$SUBSCRIBER_V4_RANGE_LOW` | **new** First address of a subscriber IPv4 pool range. | `10.44.0.2` |
| `$SUBSCRIBER_V6_PFX_1` | **new** Subscriber IPv6 prefix, one of an ordered set. | `fc00:25:140::/48` |
| `$SUBSCRIBER_V6_PFX_2` | **new** Subscriber IPv6 prefix, one of an ordered set. | `fc00:126:140::/48` |
| `$SUBSCRIBER_V6_PFX_3` | **new** Subscriber IPv6 prefix, one of an ordered set. | `fc00:127:140::/48` |
| `$SUBSCRIBER_V6_PFX_4` | **new** Subscriber IPv6 prefix, one of an ordered set. | `fc00:128:140::/48` |
| `$SUBSCRIBER_V6_POOL` | **new** This BNG's DHCP subscriber IPv6 pool prefix. | `fc00:127:140::/64` |
| `$SUBSCRIBER_V6_RANGE_HIGH` | **new** Last address of a subscriber IPv6 pool range. | `fc00:127:140::ffff/128` |
| `$SUBSCRIBER_V6_RANGE_LOW` | **new** First address of a subscriber IPv6 pool range. | `fc00:127:140::2/128` |
| `$USER_PASS` | **new** Subscriber authentication password. | `"<USER_PASS>"` |
| `$USER_PREFIX` | **new** Prefix of a generated subscriber username. | `pwht_dhcp` |

## byoai/TIERS.md

# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd service_provider/broadband_edge`. -->

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

## EVPN-VPWS pseudowire between an access node and a BNG

Family e-line, form evpn-vpws. OS mode MIXED. Attachment: Access node: vlan-ccc unit on the access aggregate. BNG: unit 0 of a pseudowire-subscriber (ps) device..

### an1_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

### an2_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

### an4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

### an5_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

### bng1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBSv6
  - occurrence-selection-required: policy-statement:PS-DHCP-SUBSv6
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_1
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PS-DHCPSUBS-COMM_2
  - occurrence-selection-required: routing-instance:dhcp-subs

### bng2_mx204 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBSv6
  - occurrence-selection-required: policy-statement:PS-DHCP-SUBSv6
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_1
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PS-DHCPSUBS-COMM_2
  - occurrence-selection-required: routing-instance:dhcp-subs

### bng3_mx10004 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBSv6
  - occurrence-selection-required: policy-statement:PS-DHCP-SUBSv6
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_1
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PS-DHCPSUBS-COMM_2
  - occurrence-selection-required: routing-instance:dhcp-subs

### bng4_mx480 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBSv6
  - occurrence-selection-required: policy-statement:PS-DHCP-SUBSv6
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_1
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PS-DHCPSUBS-COMM_2
  - occurrence-selection-required: routing-instance:dhcp-subs

---

## EVPN-VPWS flexible cross-connect on an access node

Family e-line, form evpn-fxc. OS mode EVO. Attachment: Two vlan-ccc units bundled under one FXC group; the BNG end is an EVPN-VPWS instance..

### an1_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-esi.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_A
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_B
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_A
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_B
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

### an2_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-esi.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_A
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_B
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_A
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_B
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-esi.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_A
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_B
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_A
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_B
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

### an4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-esi.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_A
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_B
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_A
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_B
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

### an5_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-esi.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_A
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_B
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_A
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_B
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

---

## PPPoE subscriber termination on a pseudowire headend

Family bng-subscriber, form pwht-pppoe. OS mode Junos. Attachment: Pseudowire-subscriber device anchored on a tunnel PIC; unit 0 terminates the EVPN-VPWS pseudowire and stacked-VLAN auto-configuration creates the PPPoE sessions..

### bng1_mx304 (junos)

- `minimum`: `junos/interfaces/ifd-ps-pwht-pppoe.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: ps-device-capacity:source-occurrence
  - occurrence-selection-required: tunnel-pic:source-occurrence
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_1
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: filter:clear-df-bit
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

### bng2_mx204 (junos)

- `minimum`: `junos/interfaces/ifd-ps-pwht-pppoe.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: ps-device-capacity:source-occurrence
  - occurrence-selection-required: tunnel-pic:source-occurrence
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_1
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: filter:clear-df-bit
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

### bng3_mx10004 (junos)

- `minimum`: `junos/interfaces/ifd-ps-pwht-pppoe.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: ps-device-capacity:source-occurrence
  - occurrence-selection-required: tunnel-pic:source-occurrence
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_1
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: filter:clear-df-bit
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

### bng4_mx480 (junos)

- `minimum`: `junos/interfaces/ifd-ps-pwht-pppoe.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: ps-device-capacity:source-occurrence
  - occurrence-selection-required: tunnel-pic:source-occurrence
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_1
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: filter:clear-df-bit
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

---

## DHCP/IPoE subscriber termination on a pseudowire headend

Family bng-subscriber, form pwht-ipoe. OS mode Junos. Attachment: Pseudowire-subscriber device anchored on a tunnel PIC; unit 0 terminates the EVPN-VPWS pseudowire and stacked-VLAN auto-configuration creates the DHCP/IPoE sessions..

### bng1_mx304 (junos)

- `minimum`: `junos/interfaces/ifd-ps-pwht-dhcp.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: ps-device-capacity:source-occurrence
  - occurrence-selection-required: tunnel-pic:source-occurrence
  - occurrence-selection-required: routing-instance:dhcp-subs
  - occurrence-selection-required: routing-instance:dhcp-subs
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

### bng2_mx204 (junos)

- `minimum`: `junos/interfaces/ifd-ps-pwht-dhcp.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: ps-device-capacity:source-occurrence
  - occurrence-selection-required: tunnel-pic:source-occurrence
  - occurrence-selection-required: routing-instance:dhcp-subs
  - occurrence-selection-required: routing-instance:dhcp-subs
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

### bng3_mx10004 (junos)

- `minimum`: `junos/interfaces/ifd-ps-pwht-dhcp.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: ps-device-capacity:source-occurrence
  - occurrence-selection-required: tunnel-pic:source-occurrence
  - occurrence-selection-required: routing-instance:dhcp-subs
  - occurrence-selection-required: routing-instance:dhcp-subs
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

### bng4_mx480 (junos)

- `minimum`: `junos/interfaces/ifd-ps-pwht-dhcp.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: ps-device-capacity:source-occurrence
  - occurrence-selection-required: tunnel-pic:source-occurrence
  - occurrence-selection-required: routing-instance:dhcp-subs
  - occurrence-selection-required: routing-instance:dhcp-subs
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

---

## Internet VRF with eBGP to the upstream CE

Family l3vpn, form l3vpn-internet. OS mode EVO. Attachment: Dual-stack logical unit toward the upstream CE..

### cr1_ptx10004 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-internet.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: policy-statement:VRF_Internet_import
  - occurrence-selection-required: policy-statement:VRF_Internet_export
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PS-DHCPSUBS-COMM_2
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: interface-parent:source-occurrence

---

## RADIUS VRF

Family l3vpn, form l3vpn-radius. OS mode MIXED. Attachment: BNG: RADIUS loopback unit. Core router: dual-stack unit toward the RADIUS server, with OSPF..

### cr1_ptx10004 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-radius-server-ospf.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-REDIS-OSPF
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_1
  - occurrence-selection-required: community:PS-DHCPSUBS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

### bng1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-radius.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

### bng2_mx204 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-radius.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

### bng3_mx10004 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-radius.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

### bng4_mx480 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-radius.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

---

## byoai/DEFAULTS.md

# DEFAULTS — Metro Fabric Broadband Edge

Lab auto-fill values for the Metro Fabric Broadband Edge JVD. Every value is measured from the validated device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks auto-fill; otherwise ask. Variable meanings are in [`_variables.md`](../_variables.md).

## Device inventory

| Role | Device | Platform | OS | `$LOOPBACK_V4` / router-id | `$ASN` |
|------|--------|----------|----|----------------------------|--------|
| Access node | an1_acx7024 | ACX7024 | EVO | 192.168.0.0 | 65001 |
| Access node | an2_acx7100-48l | ACX7100-48L | EVO | 192.168.0.1 | 65001 |
| Access node | an3_acx7100-48l | ACX7100-48L | EVO | 192.168.0.2 | 65001 |
| Access node | an4_acx7100-48l | ACX7100-48L | EVO | 192.168.0.3 | 65001 |
| Access node | an5_acx7100-48l | ACX7100-48L | EVO | 192.168.0.4 | 65001 |
| Aggregation node, route reflector | agn1_acx7100-32c | ACX7100-32C | EVO | 192.168.0.5 | 65001 |
| Aggregation node, route reflector | agn2_acx7100-32c | ACX7100-32C | EVO | 192.168.0.6 | 65001 |
| BNG | bng1_mx304 | MX304 | Junos | 192.168.0.7 | 65001 |
| BNG | bng2_mx204 | MX204 | Junos | 192.168.0.8 | 65001 |
| BNG | bng3_mx10004 | MX10004 | Junos | 192.168.0.9 | 65001 |
| BNG | bng4_mx480 | MX480 | Junos | 192.168.0.10 | 65001 |
| Core router, route reflector | cr1_ptx10004 | PTX10004 | EVO | 192.168.0.11 | 65001 |

IPv6 loopbacks are `2001:db8::192:168:0:<n>` with `<n>` the last IPv4 octet in hexadecimal; bng2 uses `2001:db8::192:1:0:8`. Segment-routing node indices are `1000 + n` (IPv4) and `4000 + n` (IPv6).

## BGP overlay route reflectors

| Device | BGP form | Route reflectors |
|--------|----------|------------------|
| an1–an5 | `evo/protocols/bgp-overlay-an.conf` | agn1 192.168.0.5, agn2 192.168.0.6 |
| bng1, bng2 | `junos/protocols/bgp-overlay-bng-three-rr.conf` | agn1, agn2, cr1 192.168.0.11 |
| bng3, bng4 | `junos/protocols/bgp-overlay-bng-core-rr.conf` | cr1 192.168.0.11 |
| agn1, agn2 | `evo/protocols/bgp-overlay-agn.conf` | reflect for an1–an5 (`GR-IBGP-FABRIC-RR`) and for bng1, bng2 and cr1 (`GR-IBGP-CR`) |
| cr1 | `evo/protocols/bgp-overlay-cr.conf` | reflects for agn1, agn2, bng1 and bng2 (`GR-IBGP-CORE-RR`) and for bng3 and bng4 (`GR-IBGP-CR`) |

## Service examples (first validated instance per device)

| Service form | Device | Example values |
|--------------|--------|----------------|
| EVPN-VPWS, access node end | an1 / an2 | `METRO_BBE_EVPN_VPWS_PPPoE_GROUP_1`, `$AC_IFL` ae1.1031, `$VPWS_SVC_ID_LOCAL` 1, `$VPWS_SVC_ID_REMOTE` 21, `$RT_AS:$RT_ID` 60000:1031, `$RD_SUB_ASSIGNED` 1031 |
| EVPN-VPWS, BNG end | bng1–bng4 | `METRO_BBE_EVPN_VPWS_PPPoE_GROUP_1`, `$AC_IFL` ps0.0, `$VPWS_SVC_ID_LOCAL` 21, `$VPWS_SVC_ID_REMOTE` 1, `$RT_AS:$RT_ID` 60000:1031, `$RD_SUB_ASSIGNED` 1031 |
| EVPN-VPWS flexible cross-connect | an1 / an2 | `METRO_BBE_EVPN_FXC_IPoE-GROUP_1`, `$IFD` ae0, `$UNIT_A` 1065, `$UNIT_B` 1066, `$SVC_ID_LOCAL` 5002, `$SVC_ID_REMOTE` 6002, `$ESI` `00:15:15:15:00:00:00:15:15:15`, `$RT_AS:$RT_ID` 60000:3001 |
| PPPoE pseudowire headend | bng1 | `$IFD` ps0, `$ANCHOR_PIC` lt-0/0/0, `$ESI` `00:10:12:12:12:12:12:00:00:31`, `$DF_PREFERENCE` 1000, `$USER_PREFIX` pwht_pppoe, `$DOMAIN_NAME` example.net |
| DHCP/IPoE pseudowire headend | bng1 | `$IFD` ps11, `$ANCHOR_PIC` lt-0/0/0, `$ESI` `00:10:12:12:12:12:12:00:00:41`, `$DF_PREFERENCE` 1000, `$STATIC_MAC` aa:aa:aa:bb:bb:bb, `$USER_PREFIX` pwht_dhcp |
| Internet VRF | cr1 | `$AC_IFL` et-0/0/26:1.0, `$CE_PEER_V4` 10.11.110.2 (`$ASN_CUSTOMER_V4` 200), `$CE_PEER_V6` 2001:db8::11:11:110:2 (`$ASN_CUSTOMER_V6` 300), RD 192.168.0.11:1 |
| RADIUS VRF | bng1 / cr1 | bng1: lo0 unit 7, RD 192.168.117.117:1117. cr1: `$AC_IFL` et-0/0/20:0.0, lo0 unit 11, RD 111.111.111.111:1111, `vrf-target` 11111:111 |

Per-BNG values for the headend: `$DF_PREFERENCE` is 1000 (bng1), 999 (bng2), 800 (bng3) and 700 (bng4); `$ANCHOR_PIC` is lt-2/0/0 on bng4 and lt-0/0/0 on the others. The BNGs share the RADIUS server 192.0.2.2.

## Numbering conventions (hold on every measured instance)

| Service form | Convention |
|--------------|------------|
| EVPN-VPWS (both ends) | `$RT_AS` = 60000 and `$RT_ID` = `$RD_SUB_ASSIGNED`. All four BNGs carry the same instance name and `ps<N>.0` attachment for a given pseudowire group. |
| EVPN-VPWS, access node end | The unit of `$AC_IFL` = `$RT_ID`; `$VPWS_SVC_ID_REMOTE` = `$VPWS_SVC_ID_LOCAL` + 20. The BNG end swaps the two service IDs. |
| EVPN-VPWS flexible cross-connect | `$RT_ID` = `$RD_SUB_ASSIGNED`; `$SVC_ID_REMOTE` = `$SVC_ID_LOCAL` + 1000; `$UNIT_B` = `$UNIT_A` + 1. |
| Route distinguishers | `$RD_SUB_ADMIN` is fixed per device and is not the loopback: an1–an5 use 100.100.100.100 … 104.104.104.104; bng1–bng4 use 192.168.107.107 … 192.168.110.110 for EVPN-VPWS. |

For `N` services, auto-fill increments the per-service number from the example's starting value and keeps the conventions above. Keep a pseudowire's access-node and BNG ends consistent: same instance name, route target and the swapped service-ID pair.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into `jvd-bbe-snips.md` by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: minimum
# devices:
#   an1: { name: <hostname>, os: evo, loopback4: <addr> }
#   bng1: { name: <hostname>, os: junos, loopback4: <addr> }
# services:
#   - { kind: <evpn-vpws|evpn-fxc|pwht-pppoe|pwht-ipoe|l3vpn-internet|l3vpn-radius>,
#       count: <int>,
#       start_id: <int>,
#       ac_ifl: <ifd.unit>,
#       rt: <rt_as:rt_id>,
#       service_ids: <local/remote> }
# snips_used:
#   - evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf
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

- The prerequisites the device must already run: the snip's `Pair with:` entries (for `variant:bbe-bgp-overlay`, the BGP overlay form whose `Seen on:` lists the device) and the requirements TIERS.md lists under the Blocked entry for that device. Name them; do not render them.
- Inputs defaulted because the user did not provide them.
- Cross-device consistency the user must verify: the access-node and BNG ends of a pseudowire use the same instance name and route target, with the local and remote service IDs swapped; all four BNGs carry the same instance name and `ps<N>.0` attachment for a pseudowire group.
- For a pseudowire-headend interface: the `$junos-*` placeholders in the dynamic profiles it names are resolved at runtime and stay literal.
- Anything that is by-pattern rather than validated on that exact device.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
