# JVD Scale-Out Firewall and NAT snippet library

## junos/chassis/aggregated-devices-ethernet.conf

```
/*
 * Topic: Aggregated Ethernet device-count for the chassis
 * Seen on:
 *   Junos: gateway_emulator_mx304 mx1_mx304 srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   gateway_emulator_mx304 1
 *   mx1_mx304 1
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from gateway_emulator_mx304):
 *   $AE_DEVICE_COUNT  e.g. 50
 */
chassis {
    aggregated-devices {
        ethernet {
            device-count $AE_DEVICE_COUNT;
        }
    }
}
```

## junos/chassis/fpc-pic-0-1-pic-mode-100g-16-ports.conf

```
/*
 * Topic: FPC with PICs 0 and 1 in 100G mode, 16 ports each
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $FPC_SLOT  e.g. 0
 */
chassis {
    fpc $FPC_SLOT {
        pic 0 {
            pic-mode 100G;
            number-of-ports 16;
        }
        pic 1 {
            pic-mode 100G;
            number-of-ports 16;
        }
    }
}
```

## junos/chassis/fpc-pic-0-1-pic-mode-100g-2-ports.conf

```
/*
 * Topic: FPC with PICs 0 and 1 in 100G mode, two ports each
 * Seen on:
 *   Junos: gateway_emulator_mx304
 *   EVO: (none)
 * Count:
 *   gateway_emulator_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from gateway_emulator_mx304):
 *   $FPC_SLOT  e.g. 0
 */
chassis {
    fpc $FPC_SLOT {
        pic 0 {
            pic-mode 100G;
            number-of-ports 2;
        }
        pic 1 {
            pic-mode 100G;
            number-of-ports 2;
        }
    }
}
```

## junos/chassis/fpc-pic-0-ports-0-3-100g-pic-1-0-ports.conf

```
/*
 * Topic: FPC with ports 0 to 3 of PIC 0 at 100G and PIC 1 set to zero ports
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx1a_srx4600):
 *   $FPC_SLOT  e.g. 1
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
        pic 1 {
            number-of-ports 0;
        }
    }
}
```

## junos/chassis/high-availability-mnha-srg-0-bfd-monitor-install-on-failure-route.conf

```
/*
 * Topic: SRX Multinode High Availability (routing mode) with SRG 0, a BFD liveliness monitor and an install-on-failure signal route
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 4
 * Highlights:
 *   - The two nodes reach each other from lo0.0 in MNHA-VR (inter-chassis link with BFD liveness detection); SRG 0 is always active on both nodes.
 *   - The monitor object tracks the trust-side BFD session in VR-1; `install-on-failure-route` names the signal route that the export policies' `if-route-exists` condition tests in MNHA-VR.inet.0.
 * Pair with:
 *  - junos/interfaces/ifl-loopback-inet-primary.conf
 *  - junos/routing-instances/virtual-router/ri-mnha-vr-ebgp-icl-bfd.conf
 *  - junos/routing-instances/virtual-router/ri-vr-1-nat-pool-discard-ebgp-trust-untrust-inet-inet6.conf
 *
 * Peers with: n/a
 * Variables (example values from srx1a_srx4600):
 *   $MNHA_LOCAL_ID        e.g. 1
 *   $LOOPBACK_V4          e.g. 192.168.0.1
 *   $MNHA_PEER_ID         e.g. 2
 *   $MNHA_PEER_V4         e.g. 192.168.0.2
 *   $MNHA_MONITOR_DST_V4  e.g. 10.1.1.1
 *   $MNHA_MONITOR_SRC_V4  e.g. 10.1.1.2
 *   $IFL                  e.g. ae1.0
 */
chassis {
    high-availability {
        local-id {
            $MNHA_LOCAL_ID;
            local-ip $LOOPBACK_V4;
        }
        peer-id $MNHA_PEER_ID {
            peer-ip $MNHA_PEER_V4;
            interface lo0.0;
            routing-instance MNHA-VR;
            liveness-detection {
                minimum-interval 300;
                minimum-receive-interval 300;
                multiplier 3;
            }
        }
        services-redundancy-group 0 {
            peer-id {
                $MNHA_PEER_ID;
            }
            monitor {
                monitor-object trust {
                    object-threshold 300;
                    bfd-liveliness {
                        threshold 300;
                        destination-ip $MNHA_MONITOR_DST_V4 {
                            src-ip $MNHA_MONITOR_SRC_V4;
                            routing-instance VR-1;
                            session-type singlehop;
                            interface $IFL;
                            weight 300;
                        }
                    }
                }
                srg-threshold 300;
            }
            install-on-failure-route {
                192.168.255.0;
                routing-instance MNHA-VR;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$IFL`): required, for each reference; `interfaces/ifl-vlan-inet-inet6`

## junos/chassis/network-services-enhanced-ip.conf

```
/*
 * Topic: Enhanced IP chassis network-services mode
 * Seen on:
 *   Junos: gateway_emulator_mx304 mx1_mx304
 *   EVO: (none)
 * Count:
 *   gateway_emulator_mx304 1
 *   mx1_mx304 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
chassis {
  network-services enhanced-ip;
}
```

## junos/chassis/redundancy-graceful-switchover.conf

```
/*
 * Topic: Graceful Routing Engine switchover
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
chassis {
    redundancy {
        graceful-switchover;
    }
}
```

## junos/firewall/filter-ipv6-mx-tlb-lb-trust.conf

```
/*
 * Topic: IPv6 filter IPv6_MX_TLB_LB_TRUST: count and redirect the NAT64 and SFW66 source prefixes to the TLB trust forwarding instance, accept the rest
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with:
 *  - junos/routing-instances/forwarding/ri-srx-mnha-group-tlb-trust-fi.conf
 *
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $TERM_NAME_1  e.g. NAT64_tlb_traffic_traffic
 *   $TERM_NAME_2  e.g. other_traffic
 */
firewall {
    family inet6 {
        filter IPv6_MX_TLB_LB_TRUST {
            term $TERM_NAME_1 {
                from {
                    source-address {
                        2001:db8:172:80::/96;
                        2001:db8:172:160::/96;
                    }
                }
                then {
                    count SFW44_tlb_forward_traffic;
                    routing-instance srx_mnha_group_tlb-trust_fi;
                }
            }
            term $TERM_NAME_2 {
                then {
                    count other_traffic;
                    accept;
                }
            }
        }
    }
}
```

## junos/firewall/filter-ipv6-mx-tlb-lb-untrust.conf

```
/*
 * Topic: IPv6 filter IPv6_MX_TLB_LB_UNTRUST: count and redirect return traffic to the NAT64 and SFW66 prefixes to the TLB untrust forwarding instance, accept the rest
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with:
 *  - junos/routing-instances/forwarding/ri-srx-mnha-group-tlb-untrust-fi.conf
 *
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $TERM_NAME_1  e.g. NAT64_tlb_traffic_traffic
 *   $TERM_NAME_2  e.g. other_traffic
 */
firewall {
    family inet6 {
        filter IPv6_MX_TLB_LB_UNTRUST {
            term $TERM_NAME_1 {
                from {
                    destination-address {
                        2001:db8:172:80::/96;
                        2001:db8:172:160::/96;
                    }
                }
                then {
                    count SFW66_tlb_return_traffic;
                    routing-instance srx_mnha_group_tlb-untrust_fi;
                }
            }
            term $TERM_NAME_2 {
                then {
                    count other_traffic;
                    accept;
                }
            }
        }
    }
}
```

## junos/firewall/filter-mx-tlb-lb-trust.conf

```
/*
 * Topic: IPv4 filter MX_TLB_LB_TRUST: count and redirect the NAPT44 and SFW44 source prefixes to the TLB trust forwarding instance, accept the rest
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with:
 *  - junos/routing-instances/forwarding/ri-srx-mnha-group-tlb-trust-fi.conf
 *
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $TERM_NAME_1  e.g. NAPT44_tlb_traffic
 *   $TERM_NAME_2  e.g. SFW44_tlb_traffic
 *   $TERM_NAME_3  e.g. other_traffic
 */
firewall {
    family inet {
        filter MX_TLB_LB_TRUST {
            term $TERM_NAME_1 {
                from {
                    source-address {
                        172.80.0.0/12;
                    }
                }
                then {
                    count NAPT44_tlb_forward_traffic;
                    routing-instance srx_mnha_group_tlb-trust_fi;
                }
            }
            term $TERM_NAME_2 {
                from {
                    source-address {
                        172.160.0.0/12;
                    }
                }
                then {
                    count SFW44_tlb_forward_traffic;
                    routing-instance srx_mnha_group_tlb-trust_fi;
                }
            }
            term $TERM_NAME_3 {
                then {
                    count other_traffic;
                    accept;
                }
            }
        }
    }
}
```

## junos/firewall/filter-mx-tlb-lb-untrust.conf

```
/*
 * Topic: IPv4 filter MX_TLB_LB_UNTRUST: count and redirect return traffic to the NAPT44 and SFW44 prefixes to the TLB untrust forwarding instance, accept the rest
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with:
 *  - junos/routing-instances/forwarding/ri-srx-mnha-group-tlb-untrust-fi.conf
 *
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $TERM_NAME_1  e.g. NAPT44_tlb_traffic
 *   $TERM_NAME_2  e.g. SFW44_tlb_traffic
 *   $TERM_NAME_3  e.g. other_traffic
 */
firewall {
    family inet {
        filter MX_TLB_LB_UNTRUST {
            term $TERM_NAME_1 {
                from {
                    destination-address {
                        172.80.0.0/12;
                    }
                }
                then {
                    count SFW44_tlb_return_traffic;
                    routing-instance srx_mnha_group_tlb-untrust_fi;
                }
            }
            term $TERM_NAME_2 {
                from {
                    destination-address {
                        172.160.0.0/12;
                    }
                }
                then {
                    count SFW44_tlb_return_traffic;
                    routing-instance srx_mnha_group_tlb-untrust_fi;
                }
            }
            term $TERM_NAME_3 {
                then {
                    count other_traffic;
                    accept;
                }
            }
        }
    }
}
```

## junos/forwarding-options/enhanced-hash-key-symmetric.conf

```
/*
 * Topic: Symmetric enhanced hash key
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Highlights:
 *   - Symmetric hashing gives a flow and its reverse the same hash, so both directions of a subscriber flow take the same SRX.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
forwarding-options {
    enhanced-hash-key {
        symmetric;
    }
}
```

## junos/groups/apply-global-three.conf

```
/*
 * Topic: Ordered global three-group application
 * Seen on:
 *   Junos: gateway_emulator_mx304 mx1_mx304
 *   EVO: (none)
 * Count:
 *   gateway_emulator_mx304 1
 *   mx1_mx304 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from gateway_emulator_mx304):
 *   $GROUP_A  e.g. global
 *   $GROUP_B  e.g. re0
 *   $GROUP_C  e.g. re1
 */
apply-groups [ $GROUP_A $GROUP_B $GROUP_C ];
```

Not included (not defined in the validated source):
- `group` `global` on gateway_emulator_mx304
- `group` `re0` on gateway_emulator_mx304
- `group` `re1` on gateway_emulator_mx304
- `group` `global` on mx1_mx304
- `group` `re0` on mx1_mx304
- `group` `re1` on mx1_mx304
Report: https://github.com/Juniper/jvd/issues/new?template=jvd-content.yml&title=Missing%20source%3A%20scale_out_firewall_nat%2Fjunos%2Fgroups%2Fapply-global-three

## junos/groups/apply-global-two.conf

```
/*
 * Topic: Ordered global two-group application
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx1a_srx4600):
 *   $GROUP_A  e.g. global
 *   $GROUP_B  e.g. re0
 */
apply-groups [ $GROUP_A $GROUP_B ];
```

Not included (not defined in the validated source):
- `group` `global` on srx1a_srx4600
- `group` `re0` on srx1a_srx4600
- `group` `global` on srx1b_srx4600
- `group` `re0` on srx1b_srx4600
- `group` `global` on srx2a_srx4600
- `group` `re0` on srx2a_srx4600
- `group` `global` on srx2b_srx4600
- `group` `re0` on srx2b_srx4600
Report: https://github.com/Juniper/jvd/issues/new?template=jvd-content.yml&title=Missing%20source%3A%20scale_out_firewall_nat%2Fjunos%2Fgroups%2Fapply-global-two

## junos/interfaces/ifd-ae-flexible-vlan-tagging-flexible-ethernet-services-lacp-fast.conf

```
/*
 * Topic: Aggregated Ethernet interface with flexible VLAN tagging, flexible Ethernet services and fast active LACP
 * Seen on:
 *   Junos: gateway_emulator_mx304 mx1_mx304
 *   EVO: (none)
 * Count:
 *   gateway_emulator_mx304 1
 *   mx1_mx304 1
 *   total 2
 * Pair with: none
 * Variables (example values from gateway_emulator_mx304):
 *   $IFD  e.g. ae10
 */
interfaces {
    $IFD {
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-gigether`

## junos/interfaces/ifd-ae-vlan-tagging-lacp-fast.conf

```
/*
 * Topic: Aggregated Ethernet interface with VLAN tagging, one minimum link and fast active LACP
 * Seen on:
 *   Junos: mx1_mx304 srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   mx1_mx304 4
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 8
 * Pair with: none
 * Variables (example values from mx1_mx304):
 *   $IFD  e.g. ae1
 */
interfaces {
    $IFD {
        vlan-tagging;
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-gigether`

## junos/interfaces/ifd-lag-member-gigether.conf

```
/*
 * Topic: Aggregated Ethernet member link through gigether-options
 * Seen on:
 *   Junos: gateway_emulator_mx304 mx1_mx304 srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   gateway_emulator_mx304 2
 *   mx1_mx304 10
 *   srx1a_srx4600 2
 *   srx1b_srx4600 2
 *   srx2a_srx4600 2
 *   srx2b_srx4600 2
 *   total 20
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from gateway_emulator_mx304):
 *   $IFD        e.g. et-2/0/2
 *   $AE_BUNDLE  e.g. ae10
 */
interfaces {
    $IFD {
        gigether-options {
            802.3ad $AE_BUNDLE;
        }
    }
}
```

## junos/interfaces/ifd-mtu-9192.conf

```
/*
 * Topic: Physical interface with MTU 9192
 * Seen on:
 *   Junos: gateway_emulator_mx304
 *   EVO: (none)
 * Count:
 *   gateway_emulator_mx304 3
 *   total 3
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from gateway_emulator_mx304):
 *   $IFD  e.g. et-0/0/2
 */
interfaces {
    $IFD {
        mtu 9192;
    }
}
```

## junos/interfaces/ifl-loopback-description-inet-inet6.conf

```
/*
 * Topic: Loopback unit with a description and one IPv4 and one IPv6 address
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 2
 *   total 2
 * Highlights:
 *   - On the MX, lo0 units 1 and 2 are the TLB health-check sources named by `health-check-interface-subunit`.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $UNIT             e.g. 1
 *   $DESCRIPTION      e.g. "TLB Health-Check Source IP Addresses for TRUST VR"
 *   $LOOPBACK_V4_PFX  e.g. 192.168.10.251/32
 *   $LOOPBACK_V6_PFX  e.g. 2001:db8:1:255::251/128
 */
interfaces {
    lo0 {
        unit $UNIT {
            description $DESCRIPTION;
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

## junos/interfaces/ifl-loopback-inet-inet6.conf

```
/*
 * Topic: Loopback unit with one IPv4 and one IPv6 address
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx1a_srx4600):
 *   $UNIT             e.g. 1
 *   $LOOPBACK_V4_PFX  e.g. 192.168.10.1/32
 *   $LOOPBACK_V6_PFX  e.g. 2001:db8:1:255::1/128
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

## junos/interfaces/ifl-loopback-inet-primary.conf

```
/*
 * Topic: Primary IPv4 loopback address
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx1a_srx4600):
 *   $LOOPBACK_V4_PFX  e.g. 192.168.0.1/32
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

## junos/interfaces/ifl-unit-0-inet-inet6.conf

```
/*
 * Topic: Unit 0 with one IPv4 and one IPv6 address
 * Seen on:
 *   Junos: gateway_emulator_mx304
 *   EVO: (none)
 * Count:
 *   gateway_emulator_mx304 4
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from gateway_emulator_mx304):
 *   $IFD         e.g. et-4/0/0
 *   $AC_ADDR_V4  e.g. 100.3.3.2/24
 *   $AC_ADDR_V6  e.g. 100:3:3::2/124
 */
interfaces {
    $IFD {
        unit 0 {
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
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-mtu-9192`

## junos/interfaces/ifl-vlan-inet-inet6-input-filter-mx-tlb-lb-trust.conf

```
/*
 * Topic: VLAN unit with IPv4 and IPv6 addresses and the MX_TLB_LB_TRUST input filters
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Highlights:
 *   - The input filters steer the SFW and NAT client prefixes into the TLB trust forwarding instance (filter-based forwarding).
 * Pair with:
 *  - junos/firewall/filter-ipv6-mx-tlb-lb-trust.conf
 *  - junos/firewall/filter-mx-tlb-lb-trust.conf
 *
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $IFD         e.g. ae10
 *   $UNIT        e.g. 41
 *   $VLAN        e.g. 41
 *   $AC_ADDR_V4  e.g. 172.16.1.1/30
 *   $AC_ADDR_V6  e.g. 2001:db8:172:1:1::1/126
 */
interfaces {
    $IFD {
        unit $UNIT {
            vlan-id $VLAN;
            family inet {
                filter {
                    input MX_TLB_LB_TRUST;
                }
                address $AC_ADDR_V4;
            }
            family inet6 {
                filter {
                    input IPv6_MX_TLB_LB_TRUST;
                }
                address $AC_ADDR_V6;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-ae-flexible-vlan-tagging-flexible-ethernet-services-lacp-fast`
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-gigether`

## junos/interfaces/ifl-vlan-inet-inet6-input-filter-mx-tlb-lb-untrust.conf

```
/*
 * Topic: VLAN unit with IPv4 and IPv6 addresses and the MX_TLB_LB_UNTRUST input filters
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Highlights:
 *   - The input filters steer return traffic for the SFW and NAT client prefixes into the TLB untrust forwarding instance (filter-based forwarding).
 * Pair with:
 *  - junos/firewall/filter-ipv6-mx-tlb-lb-untrust.conf
 *  - junos/firewall/filter-mx-tlb-lb-untrust.conf
 *
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $IFD         e.g. ae10
 *   $UNIT        e.g. 81
 *   $VLAN        e.g. 81
 *   $AC_ADDR_V4  e.g. 172.16.2.1/30
 *   $AC_ADDR_V6  e.g. 2001:db8:172:2:1::1/126
 */
interfaces {
    $IFD {
        unit $UNIT {
            vlan-id $VLAN;
            family inet {
                filter {
                    input MX_TLB_LB_UNTRUST;
                }
                address $AC_ADDR_V4;
            }
            family inet6 {
                filter {
                    input IPv6_MX_TLB_LB_UNTRUST;
                }
                address $AC_ADDR_V6;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-ae-flexible-vlan-tagging-flexible-ethernet-services-lacp-fast`
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-gigether`

## junos/interfaces/ifl-vlan-inet-inet6.conf

```
/*
 * Topic: VLAN logical interface with IPv4 and IPv6 addresses
 * Seen on:
 *   Junos: gateway_emulator_mx304 mx1_mx304 srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   gateway_emulator_mx304 2
 *   mx1_mx304 8
 *   srx1a_srx4600 2
 *   srx1b_srx4600 2
 *   srx2a_srx4600 2
 *   srx2b_srx4600 2
 *   total 18
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from gateway_emulator_mx304):
 *   $IFD         e.g. ae10
 *   $UNIT        e.g. 41
 *   $VLAN        e.g. 41
 *   $AC_ADDR_V4  e.g. 172.16.1.2/30
 *   $AC_ADDR_V6  e.g. 2001:db8:172:1:1::2/126
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
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-ae-flexible-vlan-tagging-flexible-ethernet-services-lacp-fast`, `interfaces/ifd-ae-vlan-tagging-lacp-fast`
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-gigether`

## junos/interfaces/ifl-vlan-inet.conf

```
/*
 * Topic: Single-tagged routed logical interface carrying an IPv4 customer address
 * Seen on:
 *   Junos: mx1_mx304 srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   mx1_mx304 4
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 8
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $IFD         e.g. ae1
 *   $UNIT        e.g. 100
 *   $VLAN        e.g. 100
 *   $AC_ADDR_V4  e.g. 10.3.1.1/30
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
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-ae-vlan-tagging-lacp-fast`
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-gigether`

## junos/policy-options/condition/condition-if-route-exists-mnha-vr-signal-route.conf

```
/*
 * Topic: Policy condition true while the MNHA signal route exists in MNHA-VR.inet.0
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 4
 * Highlights:
 *   - The route is the `install-on-failure-route` of services-redundancy-group 0.
 * Pair with:
 *  - junos/routing-instances/virtual-router/ri-mnha-vr-ebgp-icl-bfd.conf
 *
 * Peers with: n/a
 * Variables (example values from srx1a_srx4600):
 *   $CONDITION_NAME  e.g. srg_sig_route_exist
 */
policy-options {
    condition $CONDITION_NAME {
        if-route-exists {
            192.168.255.0/32;
            table MNHA-VR.inet.0;
        }
    }
}
```

## junos/policy-options/policy-statement/per-flow-load-balance-term-accept.conf

```
/*
 * Topic: Per-flow load-balance policy in one term with accept
 * Seen on:
 *   Junos: srx1a_srx4600 srx2a_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx2a_srx4600 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx1a_srx4600):
 *   $POLICY_NAME  e.g. pfe_lb_hash
 *   $TERM_NAME    e.g. ALL-ELSE
 */
policy-options {
    policy-statement $POLICY_NAME {
        term $TERM_NAME {
            then {
                load-balance per-flow;
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/per-flow-load-balance.conf

```
/*
 * Topic: Per-flow load-balance policy
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx1a_srx4600):
 *   $PPLB_NAME  e.g. ecmp_policy_lab
 */
policy-options {
    policy-statement $PPLB_NAME {
        then {
            load-balance per-flow;
        }
    }
}
```

## junos/policy-options/policy-statement/per-packet-load-balance-no-term.conf

```
/*
 * Topic: Per-packet load-balancing policy without terms
 * Seen on:
 *   Junos: srx1b_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1b_srx4600 1
 *   srx2b_srx4600 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx1b_srx4600):
 *   $PPLB_NAME  e.g. ecmp_ploicy_lab
 */
policy-options {
    policy-statement $PPLB_NAME {
        then {
            load-balance per-packet;
        }
    }
}
```

## junos/policy-options/policy-statement/per-packet-load-balance-term-accept.conf

```
/*
 * Topic: Per-packet load-balance policy in one term with accept
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $PPLB_NAME  e.g. pfe_lb_hash
 *   $TERM_NAME  e.g. ALL-ELSE
 */
policy-options {
    policy-statement $PPLB_NAME {
        term $TERM_NAME {
            then {
                load-balance per-packet;
                accept;
            }
        }
    }
}
```

## junos/policy-options/policy-statement/ps-bgp-default-route-inet-next-hop-self-accept-reject.conf

```
/*
 * Topic: Policy accepting the BGP IPv4 default route with next-hop self and rejecting everything else
 * Seen on:
 *   Junos: srx1a_srx4600 srx2a_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx2a_srx4600 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx1a_srx4600):
 *   $POLICY_NAME  e.g. trust_export_policy_mx2
 *   $TERM_NAME_1  e.g. 1
 *   $TERM_NAME_2  e.g. 2
 */
policy-options {
    policy-statement $POLICY_NAME {
        term $TERM_NAME_1 {
            from {
                protocol bgp;
                route-filter 0.0.0.0/0 exact;
            }
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

## junos/policy-options/policy-statement/ps-bgp-default-route-inet6-next-hop-self-accept-reject.conf

```
/*
 * Topic: Policy accepting the BGP IPv6 default route with next-hop self and rejecting everything else
 * Seen on:
 *   Junos: srx1a_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx1a_srx4600):
 *   $POLICY_NAME  e.g. v6_trust_export_policy
 *   $TERM_NAME_1  e.g. 1
 *   $TERM_NAME_2  e.g. 2
 */
policy-options {
    policy-statement $POLICY_NAME {
        term $TERM_NAME_1 {
            from {
                protocol bgp;
                route-filter ::/0 exact;
            }
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

## junos/policy-options/policy-statement/ps-bgp-napt44-orlonger-accept-reject.conf

```
/*
 * Topic: Policy accepting BGP routes within the NAPT44 prefix and rejecting everything else
 * Seen on:
 *   Junos: srx2a_srx4600
 *   EVO: (none)
 * Count:
 *   srx2a_srx4600 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx2a_srx4600):
 *   $POLICY_NAME  e.g. untrust_export_policy_mx2
 *   $TERM_NAME_1  e.g. 1
 *   $TERM_NAME_2  e.g. 2
 */
policy-options {
    policy-statement $POLICY_NAME {
        term $TERM_NAME_1 {
            from {
                protocol bgp;
                route-filter 172.80.0.0/12 orlonger;
            }
            then accept;
        }
        term $TERM_NAME_2 {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-bgp-napt44-sfw44-orlonger-accept-reject.conf

```
/*
 * Topic: Policy accepting BGP routes within the NAPT44 and SFW44 prefixes and rejecting everything else
 * Seen on:
 *   Junos: srx1a_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx1a_srx4600):
 *   $POLICY_NAME  e.g. untrust_export_policy_mx2
 *   $TERM_NAME_1  e.g. 1
 *   $TERM_NAME_2  e.g. 2
 */
policy-options {
    policy-statement $POLICY_NAME {
        term $TERM_NAME_1 {
            from {
                protocol bgp;
                route-filter 172.80.0.0/12 orlonger;
                route-filter 172.160.0.0/12 orlonger;
            }
            then accept;
        }
        term $TERM_NAME_2 {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-bgp-next-hop-self-accept-reject.conf

```
/*
 * Topic: Policy that accepts BGP routes with next-hop self and rejects everything else
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $POLICY_NAME  e.g. mnha-mx-to-srx-export
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

## junos/policy-options/policy-statement/ps-bgp-sfw66-orlonger-next-hop-self-accept-reject.conf

```
/*
 * Topic: Policy accepting BGP routes within the SFW66 prefix with next-hop self and rejecting everything else
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx1a_srx4600):
 *   $POLICY_NAME  e.g. v6_untrust_export_policy
 *   $TERM_NAME_1  e.g. t1
 *   $TERM_NAME_2  e.g. t2
 */
policy-options {
    policy-statement $POLICY_NAME {
        term $TERM_NAME_1 {
            from {
                protocol bgp;
                route-filter 2001:db8:172:160::/96 orlonger;
            }
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

## junos/policy-options/policy-statement/ps-direct-route-filter-accept-bgp-next-hop-self-reject.conf

```
/*
 * Topic: Policy accepting one direct prefix and BGP routes with next-hop self, rejecting everything else
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 4
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $BGP_EXPORT_POL  e.g. ipv4_mx_trust-to-srx_trust_export
 *   $TERM_NAME_1     e.g. 1
 *   $PREFIX          e.g. 192.168.10.251/32
 *   $TERM_NAME_2     e.g. 2
 *   $TERM_NAME_3     e.g. 3
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                protocol direct;
                route-filter $PREFIX exact;
            }
            then accept;
        }
        term $TERM_NAME_2 {
            from protocol bgp;
            then {
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_3 {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-direct-route-filter-signal-condition-as-path-prepend-3-or-1-reject.conf

```
/*
 * Topic: Policy advertising one direct prefix with next-hop self, prepending the AS three times while the MNHA signal route exists and once otherwise
 * Seen on:
 *   Junos: srx1a_srx4600 srx2a_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 3
 *   srx2a_srx4600 3
 *   total 6
 * Highlights:
 *   - A longer AS path makes the MX prefer the other node while the signal route exists; the prepend lengths differ between the two nodes of an MNHA pair.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx1a_srx4600):
 *   $BGP_EXPORT_POL  e.g. ipv6_trust_export_policy
 *   $TERM_NAME_1     e.g. 1
 *   $PREFIX          e.g. 2001:db8:1:255::1/128
 *   $CONDITION_NAME  e.g. srg_sig_route_exist
 *   $TERM_NAME_2     e.g. 2
 *   $TERM_NAME_3     e.g. 3
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                protocol direct;
                route-filter $PREFIX exact;
                condition $CONDITION_NAME;
            }
            then {
                as-path-prepend "65000 65000 65000";
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_2 {
            from {
                protocol direct;
                route-filter $PREFIX exact;
            }
            then {
                as-path-prepend 65000;
                next-hop self;
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
- `condition` (`$CONDITION_NAME`): required, for each reference; `policy-options/condition/condition-if-route-exists-mnha-vr-signal-route`

## junos/policy-options/policy-statement/ps-direct-route-filter-signal-condition-as-path-prepend-4-or-2-reject.conf

```
/*
 * Topic: Policy advertising one direct prefix with next-hop self, prepending the AS four times while the MNHA signal route exists and twice otherwise
 * Seen on:
 *   Junos: srx1b_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1b_srx4600 3
 *   srx2b_srx4600 3
 *   total 6
 * Highlights:
 *   - A longer AS path makes the MX prefer the other node while the signal route exists; the prepend lengths differ between the two nodes of an MNHA pair.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx1b_srx4600):
 *   $BGP_EXPORT_POL  e.g. ipv6_trust_export_policy
 *   $TERM_NAME_1     e.g. 1
 *   $PREFIX          e.g. 2001:db8:1:255::1/128
 *   $CONDITION_NAME  e.g. srg_sig_route_exist
 *   $TERM_NAME_2     e.g. 2
 *   $TERM_NAME_3     e.g. 3
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                protocol direct;
                route-filter $PREFIX exact;
                condition $CONDITION_NAME;
            }
            then {
                as-path-prepend "65000 65000 65000 65000";
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_2 {
            from {
                protocol direct;
                route-filter $PREFIX exact;
            }
            then {
                as-path-prepend "65000 65000";
                next-hop self;
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
- `condition` (`$CONDITION_NAME`): required, for each reference; `policy-options/condition/condition-if-route-exists-mnha-vr-signal-route`

## junos/policy-options/policy-statement/ps-nat-pools-loopback-signal-condition-as-path-prepend-3-or-1-reject.conf

```
/*
 * Topic: Policy advertising the two NAT pool routes and one direct prefix with next-hop self, prepending the AS three times while the MNHA signal route exists and once otherwise
 * Seen on:
 *   Junos: srx1a_srx4600 srx2a_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx2a_srx4600 1
 *   total 2
 * Highlights:
 *   - Advertising the pool prefixes toward the MX untrust side brings return traffic to the SRX pair that owns the pool.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx1a_srx4600):
 *   $BGP_EXPORT_POL     e.g. untrust_export_policy
 *   $TERM_NAME_1        e.g. 1
 *   $NAT_POOL_V4_PFX_1  e.g. 100.64.1.0/24
 *   $CONDITION_NAME     e.g. srg_sig_route_exist
 *   $TERM_NAME_2        e.g. 2
 *   $TERM_NAME_3        e.g. 3
 *   $NAT_POOL_V4_PFX_2  e.g. 100.64.2.0/24
 *   $TERM_NAME_4        e.g. 4
 *   $TERM_NAME_5        e.g. 5
 *   $PREFIX             e.g. 192.168.10.1/32
 *   $TERM_NAME_6        e.g. 6
 *   $TERM_NAME_7        e.g. 7
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                protocol static;
                route-filter $NAT_POOL_V4_PFX_1 exact;
                condition $CONDITION_NAME;
            }
            then {
                as-path-prepend "65000 65000 65000";
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_2 {
            from {
                protocol static;
                route-filter $NAT_POOL_V4_PFX_1 exact;
            }
            then {
                as-path-prepend 65000;
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_3 {
            from {
                protocol static;
                route-filter $NAT_POOL_V4_PFX_2 exact;
                condition $CONDITION_NAME;
            }
            then {
                as-path-prepend "65000 65000 65000";
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_4 {
            from {
                protocol static;
                route-filter $NAT_POOL_V4_PFX_2 exact;
            }
            then {
                as-path-prepend 65000;
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_5 {
            from {
                protocol direct;
                route-filter $PREFIX exact;
                condition $CONDITION_NAME;
            }
            then {
                as-path-prepend "65000 65000 65000";
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_6 {
            from {
                protocol direct;
                route-filter $PREFIX exact;
            }
            then {
                as-path-prepend 65000;
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_7 {
            then reject;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `condition` (`$CONDITION_NAME`): required, for each reference; `policy-options/condition/condition-if-route-exists-mnha-vr-signal-route`

## junos/policy-options/policy-statement/ps-nat-pools-loopback-signal-condition-as-path-prepend-4-or-2-pool-2-signal-reject.conf

```
/*
 * Topic: Policy advertising the NAT pool routes and one direct prefix with AS-path prepends, rejecting the second pool route while the MNHA signal route exists
 * Seen on:
 *   Junos: srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx2b_srx4600 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx2b_srx4600):
 *   $BGP_EXPORT_POL     e.g. untrust_export_policy
 *   $TERM_NAME_1        e.g. 1
 *   $NAT_POOL_V4_PFX_1  e.g. 100.64.3.0/24
 *   $CONDITION_NAME     e.g. srg_sig_route_exist
 *   $TERM_NAME_2        e.g. 2
 *   $TERM_NAME_3        e.g. 3
 *   $NAT_POOL_V4_PFX_2  e.g. 100.64.4.0/24
 *   $TERM_NAME_4        e.g. 4
 *   $TERM_NAME_5        e.g. 5
 *   $PREFIX             e.g. 192.168.10.2/32
 *   $TERM_NAME_6        e.g. 6
 *   $TERM_NAME_7        e.g. 7
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                protocol static;
                route-filter $NAT_POOL_V4_PFX_1 exact;
                condition $CONDITION_NAME;
            }
            then {
                as-path-prepend "65000 65000 65000 65000";
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_2 {
            from {
                protocol static;
                route-filter $NAT_POOL_V4_PFX_1 exact;
            }
            then {
                as-path-prepend "65000 65000";
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_3 {
            from {
                protocol static;
                route-filter $NAT_POOL_V4_PFX_2 exact;
                condition $CONDITION_NAME;
            }
            then {
                as-path-prepend "65000 65000 65000 65000";
                next-hop self;
                reject;
            }
        }
        term $TERM_NAME_4 {
            from {
                protocol static;
                route-filter $NAT_POOL_V4_PFX_2 exact;
            }
            then {
                as-path-prepend "65000 65000";
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_5 {
            from {
                protocol direct;
                route-filter $PREFIX exact;
                condition $CONDITION_NAME;
            }
            then {
                as-path-prepend "65000 65000 65000 65000";
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_6 {
            from {
                protocol direct;
                route-filter $PREFIX exact;
            }
            then {
                as-path-prepend "65000 65000";
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_7 {
            then reject;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `condition` (`$CONDITION_NAME`): required, for each reference; `policy-options/condition/condition-if-route-exists-mnha-vr-signal-route`

## junos/policy-options/policy-statement/ps-nat-pools-loopback-signal-condition-as-path-prepend-4-or-2-reject.conf

```
/*
 * Topic: Policy advertising the two NAT pool routes and one direct prefix with next-hop self, prepending the AS four times while the MNHA signal route exists and twice otherwise
 * Seen on:
 *   Junos: srx1b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1b_srx4600 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx1b_srx4600):
 *   $BGP_EXPORT_POL     e.g. untrust_export_policy
 *   $TERM_NAME_1        e.g. 1
 *   $NAT_POOL_V4_PFX_1  e.g. 100.64.1.0/24
 *   $CONDITION_NAME     e.g. srg_sig_route_exist
 *   $TERM_NAME_2        e.g. 2
 *   $TERM_NAME_3        e.g. 3
 *   $NAT_POOL_V4_PFX_2  e.g. 100.64.2.0/24
 *   $TERM_NAME_4        e.g. 4
 *   $TERM_NAME_5        e.g. 5
 *   $PREFIX             e.g. 192.168.10.1/32
 *   $TERM_NAME_6        e.g. 6
 *   $TERM_NAME_7        e.g. 7
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                protocol static;
                route-filter $NAT_POOL_V4_PFX_1 exact;
                condition $CONDITION_NAME;
            }
            then {
                as-path-prepend "65000 65000 65000 65000";
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_2 {
            from {
                protocol static;
                route-filter $NAT_POOL_V4_PFX_1 exact;
            }
            then {
                as-path-prepend "65000 65000";
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_3 {
            from {
                protocol static;
                route-filter $NAT_POOL_V4_PFX_2 exact;
                condition $CONDITION_NAME;
            }
            then {
                as-path-prepend "65000 65000 65000 65000";
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_4 {
            from {
                protocol static;
                route-filter $NAT_POOL_V4_PFX_2 exact;
            }
            then {
                as-path-prepend "65000 65000";
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_5 {
            from {
                protocol direct;
                route-filter $PREFIX exact;
                condition $CONDITION_NAME;
            }
            then {
                as-path-prepend "65000 65000 65000 65000";
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_6 {
            from {
                protocol direct;
                route-filter $PREFIX exact;
            }
            then {
                as-path-prepend "65000 65000";
                next-hop self;
                accept;
            }
        }
        term $TERM_NAME_7 {
            then reject;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `condition` (`$CONDITION_NAME`): required, for each reference; `policy-options/condition/condition-if-route-exists-mnha-vr-signal-route`

## junos/policy-options/policy-statement/ps-route-filter-next-hop-self-accept-reject.conf

```
/*
 * Topic: Policy accepting one prefix with next-hop self and rejecting everything else
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx1b_srx4600 2
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx1a_srx4600):
 *   $POLICY_NAME  e.g. mnha_ip
 *   $TERM_NAME_1  e.g. 1
 *   $PREFIX       e.g. 192.168.0.1/32
 *   $TERM_NAME_2  e.g. 2
 */
policy-options {
    policy-statement $POLICY_NAME {
        term $TERM_NAME_1 {
            from {
                route-filter $PREFIX exact;
            }
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

## junos/policy-options/policy-statement/ps-static-nat64-sfw66-exact-accept-reject.conf

```
/*
 * Topic: Policy accepting the static NAT64 and SFW66 IPv6 prefixes (exact) and rejecting everything else
 * Seen on:
 *   Junos: gateway_emulator_mx304
 *   EVO: (none)
 * Count:
 *   gateway_emulator_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from gateway_emulator_mx304):
 *   $BGP_EXPORT_POL  e.g. ipv6_client_to_server_export_mx1
 *   $TERM_NAME_1     e.g. 1
 *   $TERM_NAME_2     e.g. 2
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                protocol static;
                route-filter 2001:db8:172:80::/96 exact;
                route-filter 2001:db8:172:160::/96 exact;
            }
            then accept;
        }
        term $TERM_NAME_2 {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-static-route-filter-exact-accept-reject.conf

```
/*
 * Topic: Policy accepting one static prefix (exact) and rejecting everything else
 * Seen on:
 *   Junos: gateway_emulator_mx304 mx1_mx304
 *   EVO: (none)
 * Count:
 *   gateway_emulator_mx304 2
 *   mx1_mx304 4
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from gateway_emulator_mx304):
 *   $POLICY_NAME  e.g. ipv6_server_to_client_export_mx1
 *   $TERM_NAME_1  e.g. t1
 *   $PREFIX       e.g. ::/0
 *   $TERM_NAME_2  e.g. t2
 */
policy-options {
    policy-statement $POLICY_NAME {
        term $TERM_NAME_1 {
            from {
                protocol static;
                route-filter $PREFIX exact;
            }
            then accept;
        }
        term $TERM_NAME_2 {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-static-sfw44-exact-bgp-route-filter-list-accept-reject.conf

```
/*
 * Topic: Policy accepting the static SFW44 prefix and BGP routes in a route-filter list, rejecting everything else
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $BGP_EXPORT_POL     e.g. ipv4_mx_untrust_to_gw_export
 *   $TERM_NAME_1        e.g. sfw4_prefix
 *   $TERM_NAME_2        e.g. napt44_prefix_list
 *   $ROUTE_FILTER_LIST  e.g. nat_pool_route_filter_list
 *   $TERM_NAME_3        e.g. reject
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                protocol static;
                route-filter 172.160.0.0/12 exact;
            }
            then accept;
        }
        term $TERM_NAME_2 {
            from {
                protocol bgp;
                route-filter-list $ROUTE_FILTER_LIST;
            }
            then accept;
        }
        term $TERM_NAME_3 {
            then reject;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `route-filter-list` (`$ROUTE_FILTER_LIST`): required, for each reference; `policy-options/route-filter-list/rfl-inet-4-exact`

## junos/policy-options/policy-statement/ps-static-sfw44-exact-napt44-orlonger-accept-reject.conf

```
/*
 * Topic: Policy accepting the static SFW44 prefix (exact) and NAPT44 prefix (orlonger) and rejecting everything else
 * Seen on:
 *   Junos: gateway_emulator_mx304
 *   EVO: (none)
 * Count:
 *   gateway_emulator_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from gateway_emulator_mx304):
 *   $BGP_EXPORT_POL  e.g. client_to_server_export_mx1
 *   $TERM_NAME_1     e.g. 1
 *   $TERM_NAME_2     e.g. 2
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                protocol static;
                route-filter 172.160.0.0/12 exact;
                route-filter 172.80.0.0/12 orlonger;
            }
            then accept;
        }
        term $TERM_NAME_2 {
            then reject;
        }
    }
}
```

## junos/policy-options/route-filter-list/rfl-inet-4-exact.conf

```
/*
 * Topic: Route-filter list of four IPv4 prefixes (exact)
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $ROUTE_FILTER_LIST  e.g. nat_pool_route_filter_list
 */
policy-options {
    route-filter-list $ROUTE_FILTER_LIST {
        100.64.1.0/24 exact;
        100.64.2.0/24 exact;
        100.64.3.0/24 exact;
        100.64.4.0/24 exact;
    }
}
```

## junos/routing-instances/forwarding/ri-srx-mnha-group-tlb-trust-fi.conf

```
/*
 * Topic: Forwarding instance srx_mnha_group_tlb-trust_fi for the TLB trust virtual services
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Highlights:
 *   - TLB installs the default route toward the healthy SRX real services here; the MX_TLB_LB_TRUST filters redirect traffic into it.
 * Pair with: none
 * Variables: none
 */
routing-instances {
    srx_mnha_group_tlb-trust_fi {
        instance-type forwarding;
    }
}
```

## junos/routing-instances/forwarding/ri-srx-mnha-group-tlb-untrust-fi.conf

```
/*
 * Topic: Forwarding instance srx_mnha_group_tlb-untrust_fi for the TLB untrust virtual services
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
routing-instances {
    srx_mnha_group_tlb-untrust_fi {
        instance-type forwarding;
    }
}
```

## junos/routing-instances/virtual-router/ri-mnha-vr-ebgp-4-icl-groups.conf

```
/*
 * Topic: MNHA-VR virtual router with one eBGP group per SRX node over the inter-chassis link units
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Highlights:
 *   - Carries the inter-chassis link sessions of both SRX pairs; the MX re-advertises the BGP routes it learns (each node's lo0.0 address) to the other nodes with next-hop self.
 * Pair with: none
 * Variables (example values from mx1_mx304):
 *   $BGP_EXPORT_POL  e.g. mnha-mx-to-srx-export
 *   $ASN_CUSTOMER_1  e.g. 65001
 *   $ASN             e.g. 65050
 *   $CE_PEER_V4_1    e.g. 10.3.1.2
 *   $PE_LOCAL_V4_1   e.g. 10.3.1.1
 *   $ASN_CUSTOMER_2  e.g. 65002
 *   $CE_PEER_V4_2    e.g. 10.3.2.2
 *   $PE_LOCAL_V4_2   e.g. 10.3.2.1
 *   $CE_PEER_V4_3    e.g. 10.3.3.2
 *   $PE_LOCAL_V4_3   e.g. 10.3.3.1
 *   $CE_PEER_V4_4    e.g. 10.3.4.2
 *   $PE_LOCAL_V4_4   e.g. 10.3.4.1
 *   $IFL_1           e.g. ae1.100
 *   $IFL_2           e.g. ae2.100
 *   $IFL_3           e.g. ae3.100
 *   $IFL_4           e.g. ae4.100
 */
routing-instances {
    MNHA-VR {
        instance-type virtual-router;
        protocols {
            bgp {
                group mnha_pair_1_A_icl_ebgp {
                    type external;
                    export $BGP_EXPORT_POL;
                    peer-as $ASN_CUSTOMER_1;
                    local-as $ASN;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4_1 {
                        local-address $PE_LOCAL_V4_1;
                    }
                }
                group mnha_pair_1_B_icl_ebgp {
                    type external;
                    export $BGP_EXPORT_POL;
                    peer-as $ASN_CUSTOMER_2;
                    local-as $ASN;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4_2 {
                        local-address $PE_LOCAL_V4_2;
                    }
                }
                group mnha_pair_2_A_icl_ebgp {
                    type external;
                    export $BGP_EXPORT_POL;
                    peer-as $ASN_CUSTOMER_1;
                    local-as $ASN;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4_3 {
                        local-address $PE_LOCAL_V4_3;
                    }
                }
                group mnha_pair_2_B_icl_ebgp {
                    type external;
                    export $BGP_EXPORT_POL;
                    peer-as $ASN_CUSTOMER_2;
                    local-as $ASN;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4_4 {
                        local-address $PE_LOCAL_V4_4;
                    }
                }
            }
        }
        interface $IFL_1;
        interface $IFL_2;
        interface $IFL_3;
        interface $IFL_4;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$IFL_1`, `$IFL_2`, `$IFL_3`, `$IFL_4`): required, for each reference; `interfaces/ifl-vlan-inet`
- `policy-statement` (`$BGP_EXPORT_POL`): required, for each reference; `policy-options/policy-statement/ps-bgp-next-hop-self-accept-reject`

## junos/routing-instances/virtual-router/ri-mnha-vr-ebgp-icl-bfd.conf

```
/*
 * Topic: MNHA-VR virtual router with an eBGP inter-chassis link session to the MX and the lo0.0 node address
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 4
 * Highlights:
 *   - MNHA peers reach each other's lo0.0 through this instance; the SRG signal route is installed in its inet.0 table.
 * Pair with:
 *  - junos/interfaces/ifl-loopback-inet-primary.conf
 *
 * Variables (example values from srx1a_srx4600):
 *   $BGP_EXPORT_POL  e.g. mnha_ip
 *   $ASN_CUSTOMER    e.g. 65050
 *   $ASN             e.g. 65001
 *   $CE_PEER_V4      e.g. 10.3.1.1
 *   $PE_LOCAL_V4     e.g. 10.3.1.2
 *   $IFL             e.g. ae1.100
 */
routing-instances {
    MNHA-VR {
        instance-type virtual-router;
        protocols {
            bgp {
                group mnha-ibgp {
                    type external;
                    export $BGP_EXPORT_POL;
                    peer-as $ASN_CUSTOMER;
                    local-as $ASN;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4 {
                        local-address $PE_LOCAL_V4;
                    }
                }
            }
        }
        interface $IFL;
        interface lo0.0;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$IFL`): required, for each reference; `interfaces/ifl-vlan-inet`
- `policy-statement` (`$BGP_EXPORT_POL`): required, for each reference; `policy-options/policy-statement/ps-route-filter-next-hop-self-accept-reject`

## junos/routing-instances/virtual-router/ri-trust-vr-static-discard-default-ebgp-10-groups.conf

```
/*
 * Topic: TRUST_VR virtual router with discard default routes, eBGP multipath groups to each SRX node and eBGP to the trust gateway
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Highlights:
 *   - Each SRX node is its own IPv4 and IPv6 eBGP group with multipath, so the MX load-balances across the SRX nodes.
 * Pair with: none
 * Variables (example values from mx1_mx304):
 *   $ASN               e.g. 1000
 *   $BGP_EXPORT_POL_1  e.g. def_route_export
 *   $ASN_CUSTOMER_1    e.g. 65100
 *   $ASN_LOCAL         e.g. 65200
 *   $CE_PEER_V4_1      e.g. 172.16.1.2
 *   $BGP_EXPORT_POL_2  e.g. ipv4_mx_trust-to-srx_trust_export
 *   $ASN_CUSTOMER_2    e.g. 65000
 *   $CE_PEER_V4_2      e.g. 10.1.3.2
 *   $CE_PEER_V4_3      e.g. 10.1.4.2
 *   $CE_PEER_V4_4      e.g. 10.1.1.2
 *   $CE_PEER_V4_5      e.g. 10.1.2.2
 *   $BGP_EXPORT_POL_3  e.g. ipv6_mx_trust-to-srx_trust_export
 *   $CE_PEER_V6_1      e.g. 2001:db8:1:1:3::2
 *   $CE_PEER_V6_2      e.g. 2001:db8:1:1:4::2
 *   $CE_PEER_V6_3      e.g. 2001:db8:1:1:1::2
 *   $CE_PEER_V6_4      e.g. 2001:db8:1:1:2::2
 *   $BGP_EXPORT_POL_4  e.g. ipv6_def_route_export
 *   $CE_PEER_V6_5      e.g. 2001:db8:172:1:1::2
 *   $IFL_1             e.g. ae1.0
 *   $IFL_2             e.g. ae2.0
 *   $IFL_3             e.g. ae3.0
 *   $IFL_4             e.g. ae4.0
 *   $IFL_5             e.g. ae10.41
 *   $LOOPBACK_IFL      e.g. lo0.1
 */
routing-instances {
    TRUST_VR {
        instance-type virtual-router;
        routing-options {
            rib TRUST_VR.inet6.0 {
                static {
                    route ::/0 discard;
                }
            }
            autonomous-system $ASN;
            static {
                route 0.0.0.0/0 discard;
            }
        }
        protocols {
            bgp {
                group MX-to-TRUST_GW_Router {
                    type external;
                    export $BGP_EXPORT_POL_1;
                    peer-as $ASN_CUSTOMER_1;
                    local-as $ASN_LOCAL;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4_1;
                }
                group MX-to-MNHA-pair_2_A {
                    type external;
                    export $BGP_EXPORT_POL_2;
                    peer-as $ASN_CUSTOMER_2;
                    local-as $ASN_LOCAL;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4_2;
                }
                group MX-to-MNHA-pair_2_B {
                    type external;
                    export $BGP_EXPORT_POL_2;
                    peer-as $ASN_CUSTOMER_2;
                    local-as $ASN_LOCAL;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4_3;
                }
                group MX-to-MNHA-pair_1_A {
                    type external;
                    export $BGP_EXPORT_POL_2;
                    peer-as $ASN_CUSTOMER_2;
                    local-as $ASN_LOCAL;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4_4;
                }
                group MX-to-MNHA-pair_1_B {
                    type external;
                    export $BGP_EXPORT_POL_2;
                    peer-as $ASN_CUSTOMER_2;
                    local-as $ASN_LOCAL;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4_5;
                }
                group IPv6_MX-to-MNHA-pair_2_A {
                    type external;
                    export $BGP_EXPORT_POL_3;
                    peer-as $ASN_CUSTOMER_2;
                    local-as $ASN_LOCAL;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V6_1;
                }
                group IPv6_MX-to-MNHA-pair_2_B {
                    type external;
                    export $BGP_EXPORT_POL_3;
                    peer-as $ASN_CUSTOMER_2;
                    local-as $ASN_LOCAL;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V6_2;
                }
                group IPv6_MX-to-MNHA-pair_1_A {
                    type external;
                    export $BGP_EXPORT_POL_3;
                    peer-as $ASN_CUSTOMER_2;
                    local-as $ASN_LOCAL;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V6_3;
                }
                group IPv6_MX-to-MNHA-pair_1_B {
                    type external;
                    export $BGP_EXPORT_POL_3;
                    peer-as $ASN_CUSTOMER_2;
                    local-as $ASN_LOCAL;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V6_4;
                }
                group IPv6_MX-to-TRUST_GW_Router {
                    type external;
                    export $BGP_EXPORT_POL_4;
                    peer-as $ASN_CUSTOMER_1;
                    local-as $ASN_LOCAL;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V6_5;
                }
            }
        }
        interface $IFL_1;
        interface $IFL_2;
        interface $IFL_3;
        interface $IFL_4;
        interface $IFL_5;
        interface $LOOPBACK_IFL;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$IFL_1`, `$IFL_2`, `$IFL_3`, `$IFL_4`, `$IFL_5`, `$LOOPBACK_IFL`): required, for each reference; one of `interfaces/ifl-loopback-description-inet-inet6`, `interfaces/ifl-vlan-inet-inet6-input-filter-mx-tlb-lb-trust`, `interfaces/ifl-vlan-inet-inet6`
- `policy-statement` (`$BGP_EXPORT_POL_1`, `$BGP_EXPORT_POL_2`, `$BGP_EXPORT_POL_3`, `$BGP_EXPORT_POL_4`): required, for each reference; one of `policy-options/policy-statement/ps-direct-route-filter-accept-bgp-next-hop-self-reject`, `policy-options/policy-statement/ps-static-route-filter-exact-accept-reject`

## junos/routing-instances/virtual-router/ri-trust-vr-static-next-hop-ebgp-inet-inet6.conf

```
/*
 * Topic: TRUST_VR virtual router with static client routes and IPv4 and IPv6 eBGP groups toward the MX
 * Seen on:
 *   Junos: gateway_emulator_mx304
 *   EVO: (none)
 * Count:
 *   gateway_emulator_mx304 1
 *   total 1
 * Pair with: none
 * Variables (example values from gateway_emulator_mx304):
 *   $NEXT_HOP_V6       e.g. 2001:db8:172:16:8::1
 *   $ASN               e.g. 65100
 *   $NEXT_HOP_V4       e.g. 172.16.8.1
 *   $BGP_EXPORT_POL_1  e.g. client_to_server_export_mx1
 *   $ASN_CUSTOMER      e.g. 65200
 *   $CE_PEER_V4        e.g. 172.16.1.1
 *   $BGP_EXPORT_POL_2  e.g. ipv6_client_to_server_export_mx1
 *   $CE_PEER_V6        e.g. 2001:db8:172:1:1::1
 *   $IFL_1             e.g. et-0/0/2.0
 *   $IFL_2             e.g. et-2/0/0.0
 *   $IFL_3             e.g. ae10.41
 */
routing-instances {
    TRUST_VR {
        instance-type virtual-router;
        routing-options {
            rib TRUST_VR.inet6.0 {
                static {
                    route 2001:db8:172:80::/96 next-hop $NEXT_HOP_V6;
                    route 2001:db8:172:160::/96 next-hop $NEXT_HOP_V6;
                }
            }
            autonomous-system $ASN;
            static {
                route 172.80.0.0/12 next-hop $NEXT_HOP_V4;
                route 172.160.0.0/12 next-hop $NEXT_HOP_V4;
            }
        }
        protocols {
            bgp {
                group trust_GW-to-MX1_trust {
                    type external;
                    export $BGP_EXPORT_POL_1;
                    peer-as $ASN_CUSTOMER;
                    local-as $ASN;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4;
                }
                group ipv6_trust_GW-to-MX1_trust {
                    type external;
                    export $BGP_EXPORT_POL_2;
                    peer-as $ASN_CUSTOMER;
                    local-as $ASN;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V6;
                }
                multipath;
            }
        }
        interface $IFL_1;
        interface $IFL_2;
        interface $IFL_3;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$IFL_1`, `$IFL_2`, `$IFL_3`): required, for each reference; one of `interfaces/ifl-unit-0-inet-inet6`, `interfaces/ifl-vlan-inet-inet6`
- `policy-statement` (`$BGP_EXPORT_POL_1`, `$BGP_EXPORT_POL_2`): required, for each reference; one of `policy-options/policy-statement/ps-static-nat64-sfw66-exact-accept-reject`, `policy-options/policy-statement/ps-static-sfw44-exact-napt44-orlonger-accept-reject`

## junos/routing-instances/virtual-router/ri-untrust-vr-static-discard-default-ebgp-inet-inet6.conf

```
/*
 * Topic: UNTRUST_VR virtual router with discard default routes and IPv4 and IPv6 eBGP groups toward the MX
 * Seen on:
 *   Junos: gateway_emulator_mx304
 *   EVO: (none)
 * Count:
 *   gateway_emulator_mx304 1
 *   total 1
 * Pair with: none
 * Variables (example values from gateway_emulator_mx304):
 *   $ASN               e.g. 65300
 *   $BGP_EXPORT_POL_1  e.g. server_to_client_export_mx1
 *   $ASN_CUSTOMER      e.g. 65400
 *   $CE_PEER_V4        e.g. 172.16.2.1
 *   $BGP_EXPORT_POL_2  e.g. ipv6_server_to_client_export_mx1
 *   $CE_PEER_V6        e.g. 2001:db8:172:2:1::1
 *   $IFL_1             e.g. et-0/0/5.0
 *   $IFL_2             e.g. et-4/0/0.0
 *   $IFL_3             e.g. ae10.81
 */
routing-instances {
    UNTRUST_VR {
        instance-type virtual-router;
        routing-options {
            rib UNTRUST_VR.inet6.0 {
                static {
                    route ::/0 discard;
                }
            }
            autonomous-system $ASN;
            static {
                route 0.0.0.0/0 discard;
            }
        }
        protocols {
            bgp {
                group Untrust_GW-to-MX1_Untrust {
                    type external;
                    export $BGP_EXPORT_POL_1;
                    peer-as $ASN_CUSTOMER;
                    local-as $ASN;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4;
                }
                group ipv6_trust_GW-to-MX1_untrust {
                    type external;
                    export $BGP_EXPORT_POL_2;
                    peer-as $ASN_CUSTOMER;
                    local-as $ASN;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V6;
                }
                multipath;
            }
        }
        interface $IFL_1;
        interface $IFL_2;
        interface $IFL_3;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$IFL_1`, `$IFL_2`, `$IFL_3`): required, for each reference; one of `interfaces/ifl-unit-0-inet-inet6`, `interfaces/ifl-vlan-inet-inet6`
- `policy-statement` (`$BGP_EXPORT_POL_1`, `$BGP_EXPORT_POL_2`): required, for each reference; `policy-options/policy-statement/ps-static-route-filter-exact-accept-reject`

## junos/routing-instances/virtual-router/ri-untrust-vr-static-discard-sfw-ebgp-10-groups.conf

```
/*
 * Topic: UNTRUST_VR virtual router with discard SFW routes, eBGP multipath groups to each SRX node and eBGP to the untrust gateway
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with: none
 * Variables (example values from mx1_mx304):
 *   $ASN               e.g. 65400
 *   $BGP_EXPORT_POL_1  e.g. ipv4_mx_untrust_to_gw_export
 *   $ASN_CUSTOMER_1    e.g. 65300
 *   $CE_PEER_V4_1      e.g. 172.16.2.2
 *   $BGP_EXPORT_POL_2  e.g. ipv4_mx_untrust-to-srx_untrust_export
 *   $ASN_CUSTOMER_2    e.g. 65000
 *   $CE_PEER_V4_2      e.g. 10.2.3.2
 *   $CE_PEER_V4_3      e.g. 10.2.4.2
 *   $CE_PEER_V4_4      e.g. 10.2.1.2
 *   $CE_PEER_V4_5      e.g. 10.2.2.2
 *   $BGP_EXPORT_POL_3  e.g. ipv6_mx_untrust-to-srx_untrust_export
 *   $CE_PEER_V6_1      e.g. 2001:db8:1:2:3::2
 *   $CE_PEER_V6_2      e.g. 2001:db8:1:2:4::2
 *   $CE_PEER_V6_3      e.g. 2001:db8:1:2:1::2
 *   $CE_PEER_V6_4      e.g. 2001:db8:1:2:2::2
 *   $BGP_EXPORT_POL_4  e.g. ipv6_mx_untrust_to_gw_export
 *   $CE_PEER_V6_5      e.g. 2001:db8:172:2:1::2
 *   $IFL_1             e.g. ae1.1
 *   $IFL_2             e.g. ae2.1
 *   $IFL_3             e.g. ae3.1
 *   $IFL_4             e.g. ae4.1
 *   $IFL_5             e.g. ae10.81
 *   $LOOPBACK_IFL      e.g. lo0.2
 */
routing-instances {
    UNTRUST_VR {
        instance-type virtual-router;
        routing-options {
            rib UNTRUST_VR.inet6.0 {
                static {
                    route 2001:db8:172:160::/96 discard;
                }
            }
            autonomous-system $ASN;
            static {
                route 172.160.0.0/12 discard;
            }
        }
        protocols {
            bgp {
                group MX-to-UNTRUST_GW_Router {
                    type external;
                    export $BGP_EXPORT_POL_1;
                    peer-as $ASN_CUSTOMER_1;
                    local-as $ASN;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4_1;
                }
                group MX-to-MNHA-pair_2_A {
                    type external;
                    export $BGP_EXPORT_POL_2;
                    peer-as $ASN_CUSTOMER_2;
                    local-as $ASN;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4_2;
                }
                group MX-to-MNHA-pair_2_B {
                    type external;
                    export $BGP_EXPORT_POL_2;
                    peer-as $ASN_CUSTOMER_2;
                    local-as $ASN;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4_3;
                }
                group MX-to-MNHA-pair_1_A {
                    type external;
                    export $BGP_EXPORT_POL_2;
                    peer-as $ASN_CUSTOMER_2;
                    local-as $ASN;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4_4;
                }
                group MX-to-MNHA-pair_1_B {
                    type external;
                    export $BGP_EXPORT_POL_2;
                    peer-as $ASN_CUSTOMER_2;
                    local-as $ASN;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4_5;
                }
                group IPv6_MX-to-MNHA-pair_2_A {
                    type external;
                    export $BGP_EXPORT_POL_3;
                    peer-as $ASN_CUSTOMER_2;
                    local-as $ASN;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V6_1;
                }
                group IPv6_MX-to-MNHA-pair_2_B {
                    type external;
                    export $BGP_EXPORT_POL_3;
                    peer-as $ASN_CUSTOMER_2;
                    local-as $ASN;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V6_2;
                }
                group IPv6_MX-to-MNHA-pair_1_A {
                    type external;
                    export $BGP_EXPORT_POL_3;
                    peer-as $ASN_CUSTOMER_2;
                    local-as $ASN;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V6_3;
                }
                group IPv6_MX-to-MNHA-pair_1_B {
                    type external;
                    export $BGP_EXPORT_POL_3;
                    peer-as $ASN_CUSTOMER_2;
                    local-as $ASN;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V6_4;
                }
                group IPv6_MX-to-UNTRUST_GW_Router {
                    type external;
                    export $BGP_EXPORT_POL_4;
                    peer-as $ASN_CUSTOMER_1;
                    local-as $ASN;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V6_5;
                }
            }
        }
        interface $IFL_1;
        interface $IFL_2;
        interface $IFL_3;
        interface $IFL_4;
        interface $IFL_5;
        interface $LOOPBACK_IFL;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$IFL_1`, `$IFL_2`, `$IFL_3`, `$IFL_4`, `$IFL_5`, `$LOOPBACK_IFL`): required, for each reference; one of `interfaces/ifl-loopback-description-inet-inet6`, `interfaces/ifl-vlan-inet-inet6-input-filter-mx-tlb-lb-untrust`, `interfaces/ifl-vlan-inet-inet6`
- `policy-statement` (`$BGP_EXPORT_POL_1`, `$BGP_EXPORT_POL_2`, `$BGP_EXPORT_POL_3`, `$BGP_EXPORT_POL_4`): required, for each reference; one of `policy-options/policy-statement/ps-direct-route-filter-accept-bgp-next-hop-self-reject`, `policy-options/policy-statement/ps-static-route-filter-exact-accept-reject`, `policy-options/policy-statement/ps-static-sfw44-exact-bgp-route-filter-list-accept-reject`

## junos/routing-instances/virtual-router/ri-vr-1-nat-pool-discard-ebgp-trust-untrust-inet-inet6.conf

```
/*
 * Topic: VR-1 virtual router with NAT pool discard routes and IPv4 and IPv6 eBGP groups to the MX trust and untrust instances
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 4
 * Pair with: none
 * Variables (example values from srx1a_srx4600):
 *   $NAT_POOL_V4_PFX_1  e.g. 100.64.1.0/24
 *   $NAT_POOL_V4_PFX_2  e.g. 100.64.2.0/24
 *   $BGP_GROUP_1        e.g. Vsrx-to-MX_TRUST
 *   $BGP_EXPORT_POL_1   e.g. trust_export_policy
 *   $ASN                e.g. 65000
 *   $CE_PEER_V4_1       e.g. 10.1.1.1
 *   $ASN_CUSTOMER_1     e.g. 65200
 *   $BGP_GROUP_2        e.g. Vsrx-to-MX_UNTRUST
 *   $BGP_EXPORT_POL_2   e.g. untrust_export_policy
 *   $CE_PEER_V4_2       e.g. 10.2.1.1
 *   $ASN_CUSTOMER_2     e.g. 65400
 *   $BGP_GROUP_3        e.g. IPv6_Vsrx-to-MX_TRUST
 *   $BGP_EXPORT_POL_3   e.g. ipv6_trust_export_policy
 *   $CE_PEER_V6_1       e.g. 2001:db8:1:1:1::1
 *   $BGP_GROUP_4        e.g. IPv6_Vsrx-to-MX_UNTRUST
 *   $BGP_EXPORT_POL_4   e.g. ipv6_untrust_export_policy
 *   $CE_PEER_V6_2       e.g. 2001:db8:1:2:1::1
 *   $IFL_1              e.g. ae1.0
 *   $IFL_2              e.g. ae1.1
 *   $LOOPBACK_IFL       e.g. lo0.1
 */
routing-instances {
    VR-1 {
        instance-type virtual-router;
        routing-options {
            static {
                route $NAT_POOL_V4_PFX_1 discard;
                route $NAT_POOL_V4_PFX_2 discard;
            }
        }
        protocols {
            bgp {
                group $BGP_GROUP_1 {
                    type external;
                    export $BGP_EXPORT_POL_1;
                    local-as $ASN;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4_1 {
                        peer-as $ASN_CUSTOMER_1;
                    }
                }
                group $BGP_GROUP_2 {
                    type external;
                    export $BGP_EXPORT_POL_2;
                    local-as $ASN;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4_2 {
                        peer-as $ASN_CUSTOMER_2;
                    }
                }
                group $BGP_GROUP_3 {
                    type external;
                    export $BGP_EXPORT_POL_3;
                    local-as $ASN;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V6_1 {
                        peer-as $ASN_CUSTOMER_1;
                    }
                }
                group $BGP_GROUP_4 {
                    type external;
                    export $BGP_EXPORT_POL_4;
                    local-as $ASN;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V6_2 {
                        peer-as $ASN_CUSTOMER_2;
                    }
                }
                multipath;
            }
        }
        interface $IFL_1;
        interface $IFL_2;
        interface $LOOPBACK_IFL;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$IFL_1`, `$IFL_2`, `$LOOPBACK_IFL`): required, for each reference; one of `interfaces/ifl-loopback-inet-inet6`, `interfaces/ifl-vlan-inet-inet6`
- `policy-statement` (`$BGP_EXPORT_POL_1`, `$BGP_EXPORT_POL_2`, `$BGP_EXPORT_POL_3`, `$BGP_EXPORT_POL_4`): required, for each reference; one of `policy-options/policy-statement/ps-direct-route-filter-signal-condition-as-path-prepend-3-or-1-reject`, `policy-options/policy-statement/ps-direct-route-filter-signal-condition-as-path-prepend-4-or-2-reject`, `policy-options/policy-statement/ps-nat-pools-loopback-signal-condition-as-path-prepend-3-or-1-reject`, `policy-options/policy-statement/ps-nat-pools-loopback-signal-condition-as-path-prepend-4-or-2-pool-2-signal-reject`, `policy-options/policy-statement/ps-nat-pools-loopback-signal-condition-as-path-prepend-4-or-2-reject`

## junos/routing-options/autonomous-system.conf

```
/*
 * Topic: Device autonomous-system number
 * Seen on:
 *   Junos: srx1b_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1b_srx4600 1
 *   srx2b_srx4600 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx1b_srx4600):
 *   $ASN  e.g. 69
 */
routing-options {
  autonomous-system $ASN;
}
```

## junos/routing-options/forwarding-table-export.conf

```
/*
 * Topic: Forwarding-table export — per-packet load-balance applied to the forwarding table (minimal EVO form).
 * Seen on:
 *   Junos: mx1_mx304 srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $PPLB_NAME  e.g. pfe_lb_hash
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$PPLB_NAME`): required, for each reference; one of `policy-options/policy-statement/per-flow-load-balance`, `policy-options/policy-statement/per-packet-load-balance-term-accept`

## junos/routing-options/nonstop-routing.conf

```
/*
 * Topic: Nonstop active routing
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    nonstop-routing;
}
```

## junos/security/address-book-global-napt44-sfw44-nat64-sfw66.conf

```
/*
 * Topic: Global address book with the NAPT44, SFW44, NAT64 and SFW66 source prefixes, in that order
 * Seen on:
 *   Junos: srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 2
 * Highlights:
 *   - Entry names embed their prefix; the security policies match these names.
 * Pair with: none
 * Variables: none
 */
security {
    address-book {
        global {
            address sfw_source_prefix_172.80.0.0/12 172.80.0.0/12;
            address sfw_source_prefix_172.160.0.0/12 172.160.0.0/12;
            address sfw_source_prefix_2001:db8:172:80::/96 2001:db8:172:80::/96;
            address sfw_source_prefix_2001:db8:172:160::/96 2001:db8:172:160::/96;
        }
    }
}
```

## junos/security/address-book-global-napt44-sfw44-sfw66-nat64.conf

```
/*
 * Topic: Global address book with the NAPT44, SFW44, SFW66 and NAT64 source prefixes, in that order
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   total 2
 * Highlights:
 *   - Entry names embed their prefix; the security policies match these names.
 * Pair with: none
 * Variables: none
 */
security {
    address-book {
        global {
            address sfw_source_prefix_172.80.0.0/12 172.80.0.0/12;
            address sfw_source_prefix_172.160.0.0/12 172.160.0.0/12;
            address sfw_source_prefix_2001:db8:172:160::/96 2001:db8:172:160::/96;
            address sfw_source_prefix_2001:db8:172:80::/96 2001:db8:172:80::/96;
        }
    }
}
```

## junos/security/alg-sip.conf

```
/*
 * Topic: SIP application layer gateway
 * Seen on:
 *   Junos: srx1b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1b_srx4600 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
security {
    alg {
        sip;
    }
}
```

## junos/security/nat-source-napt44-nat64-pools-destination-nat64.conf

```
/*
 * Topic: Source NAT (NAPT44 and NAT64 pools with paired address pooling) and NAT64 destination NAT from the VR-1 trust zone
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 4
 * Highlights:
 *   - Each SRX pair has its own pool prefixes; VR-1 originates them as discard routes and the untrust export policy advertises them, so return traffic reaches the SRX that holds the session.
 *   - NAT64: IPv6 clients reaching 2001:db8:1::1 are translated to the IPv4 server 172.16.10.3 and sourced from the NAT64 IPv4 pool.
 * Pair with:
 *  - junos/security/zones-vr-1-trust-untrust-mnha.conf
 *
 * Variables (example values from srx1a_srx4600):
 *   $NAT_POOL_V4_PFX_1  e.g. 100.64.1.0/24
 *   $NAT_POOL_V4_PFX_2  e.g. 100.64.2.0/24
 */
security {
    nat {
        source {
            pool srx_nat_pool1 {
                address {
                    $NAT_POOL_V4_PFX_1;
                }
                address-pooling paired;
            }
            pool nat_64_source_ipv4_pool {
                address {
                    $NAT_POOL_V4_PFX_2;
                }
                address-pooling paired;
            }
            rule-set srx_nat_rule-set {
                from zone VR-1_trust_zone;
                to zone VR-1_untrust_zone;
                rule srx_nat_rule1 {
                    match {
                        source-address 172.80.0.0/12;
                        destination-address 0.0.0.0/0;
                        application any;
                    }
                    then {
                        source-nat {
                            pool {
                                srx_nat_pool1;
                            }
                        }
                    }
                }
                rule srx_nat64_rule2 {
                    match {
                        source-address 2001:db8:172:80::/96;
                        destination-address 172.16.10.3/32;
                        application any;
                    }
                    then {
                        source-nat {
                            pool {
                                nat_64_source_ipv4_pool;
                            }
                        }
                    }
                }
            }
        }
        destination {
            pool nat_64_dest_ipv4 {
                address 172.16.10.3/32;
            }
            rule-set nat_64_dest_rule {
                from zone VR-1_trust_zone;
                rule d_rule-1 {
                    match {
                        destination-address 2001:db8:1::1/128;
                    }
                    then {
                        destination-nat {
                            pool {
                                nat_64_dest_ipv4;
                            }
                        }
                    }
                }
            }
        }
    }
}
```

## junos/security/policies-trust-to-untrust-permit-sfw-nat-default-permit-all.conf

```
/*
 * Topic: Trust-to-untrust security policies permitting the NAPT44, NAT64, SFW66 and SFW44 source prefixes, default policy permit-all
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 4
 * Highlights:
 *   - Each policy matches a global address-book entry by name.
 * Pair with:
 *  - junos/security/zones-vr-1-trust-untrust-mnha.conf
 *
 * Variables: none
 */
security {
    policies {
        from-zone VR-1_trust_zone to-zone VR-1_untrust_zone {
            policy SNAT_NAT_POLICY {
                match {
                    source-address sfw_source_prefix_172.80.0.0/12;
                    destination-address any;
                    application any;
                }
                then {
                    permit;
                }
            }
            policy NAT64_POLICY {
                match {
                    source-address sfw_source_prefix_2001:db8:172:80::/96;
                    destination-address any;
                    application any;
                }
                then {
                    permit;
                }
            }
            policy SFW66_POLICY {
                match {
                    source-address sfw_source_prefix_2001:db8:172:160::/96;
                    destination-address any;
                    application any;
                }
                then {
                    permit;
                }
            }
            policy SFW44_POLICY {
                match {
                    source-address sfw_source_prefix_172.160.0.0/12;
                    destination-address any;
                    application any;
                }
                then {
                    permit;
                }
            }
        }
        default-policy {
            permit-all;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `address-book-entry` (`sfw_source_prefix_172.80.0.0/12`, `sfw_source_prefix_2001:db8:172:80::/96`, `sfw_source_prefix_2001:db8:172:160::/96`, `sfw_source_prefix_172.160.0.0/12`): required, for each reference; one of `security/address-book-global-napt44-sfw44-nat64-sfw66`, `security/address-book-global-napt44-sfw44-sfw66-nat64`

## junos/security/zones-vr-1-trust-untrust-mnha.conf

```
/*
 * Topic: VR-1 trust and untrust security zones and the MNHA zone, all host-inbound services and protocols
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 4
 * Highlights:
 *   - trust_zone_mnha holds lo0.0 and the MNHA-VR inter-chassis unit; the VR-1 zones hold the MX-facing trust and untrust units.
 * Pair with:
 *  - junos/interfaces/ifl-loopback-inet-inet6.conf
 *  - junos/interfaces/ifl-loopback-inet-primary.conf
 *
 * Variables (example values from srx1a_srx4600):
 *   $IFL_1  e.g. ae1.0
 *   $IFL_2  e.g. ae1.1
 *   $IFL_3  e.g. ae1.100
 */
security {
    zones {
        security-zone VR-1_trust_zone {
            host-inbound-traffic {
                system-services {
                    all;
                }
                protocols {
                    all;
                }
            }
            interfaces {
                $IFL_1;
                lo0.1;
            }
        }
        security-zone VR-1_untrust_zone {
            host-inbound-traffic {
                system-services {
                    all;
                }
                protocols {
                    all;
                }
            }
            interfaces {
                $IFL_2;
            }
        }
        security-zone trust_zone_mnha {
            host-inbound-traffic {
                system-services {
                    all;
                }
                protocols {
                    all;
                }
            }
            interfaces {
                lo0.0;
                $IFL_3;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$IFL_1`, `$IFL_2`, `$IFL_3`): required, for each reference; one of `interfaces/ifl-vlan-inet-inet6`, `interfaces/ifl-vlan-inet`

## junos/services/network-monitoring-icmp-tcp-8088-profiles.conf

```
/*
 * Topic: Network-monitoring ICMP and TCP port 8088 health-check profiles with 1-second probes and single retries
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
services {
    network-monitoring {
        profile icmp-profile {
            icmp;
            probe-interval 1;
            failure-retries 1;
            recovery-retries 1;
        }
        profile tcp-profile {
            tcp {
                port 8088;
            }
            probe-interval 1;
            failure-retries 1;
            recovery-retries 1;
        }
    }
}
```

## junos/services/traffic-load-balance-instance-ipv6-tlb-sfw-trust.conf

```
/*
 * Topic: TLB instance ipv6_tlb_sfw_trust: IPv6 direct-server-return virtual service hashing on source IP across two SRX real services
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Highlights:
 *   - IPv6 counterpart of tlb_sfw_trust, sharing forwarding instance srx_mnha_group_tlb-trust_fi and the lo0 unit 1 health-check source.
 * Pair with:
 *  - junos/interfaces/ifl-loopback-description-inet-inet6.conf
 *  - junos/routing-instances/forwarding/ri-srx-mnha-group-tlb-trust-fi.conf
 *  - junos/routing-instances/virtual-router/ri-trust-vr-static-discard-default-ebgp-10-groups.conf
 *  - junos/services/network-monitoring-icmp-tcp-8088-profiles.conf
 *
 * Variables (example values from mx1_mx304):
 *   $REAL_SERVICE_V6_1  e.g. 2001:db8:1:255::1
 *   $REAL_SERVICE_V6_2  e.g. 2001:db8:1:255::2
 */
services {
    traffic-load-balance {
        instance ipv6_tlb_sfw_trust {
            interface lo0.0;
            client-vrf TRUST_VR;
            server-vrf TRUST_VR;
            group ipv6_trust_group {
                real-services [ IPv6_MNHA_SRX1 IPv6_MNHA_SRX2 ];
                routing-instance TRUST_VR;
                health-check-interface-subunit 1;
                network-monitoring-profile [ icmp-profile tcp-profile ];
            }
            real-service IPv6_MNHA_SRX1 {
                address $REAL_SERVICE_V6_1;
            }
            real-service IPv6_MNHA_SRX2 {
                address $REAL_SERVICE_V6_2;
            }
            virtual-service ipv6_srx_trust_vs {
                mode direct-server-return;
                address 0::0;
                routing-instance srx_mnha_group_tlb-trust_fi;
                group ipv6_trust_group;
                load-balance-method {
                    hash {
                        hash-key {
                            source-ip;
                        }
                    }
                }
            }
        }
    }
}
```

Not included (not defined in the validated source):
- `logical-interface` `lo0.0` on mx1_mx304
Report: https://github.com/Juniper/jvd/issues/new?template=jvd-content.yml&title=Missing%20source%3A%20scale_out_firewall_nat%2Fjunos%2Fservices%2Ftraffic-load-balance-instance-ipv6-tlb-sfw-trust

## junos/services/traffic-load-balance-instance-ipv6-tlb-sfw-untrust.conf

```
/*
 * Topic: TLB instance ipv6_tlb_sfw_untrust: IPv6 direct-server-return virtual service hashing on destination IP across two SRX real services
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Highlights:
 *   - IPv6 counterpart of tlb_sfw_untrust, sharing forwarding instance srx_mnha_group_tlb-untrust_fi and the lo0 unit 2 health-check source.
 * Pair with:
 *  - junos/interfaces/ifl-loopback-description-inet-inet6.conf
 *  - junos/routing-instances/forwarding/ri-srx-mnha-group-tlb-untrust-fi.conf
 *  - junos/routing-instances/virtual-router/ri-untrust-vr-static-discard-sfw-ebgp-10-groups.conf
 *  - junos/services/network-monitoring-icmp-tcp-8088-profiles.conf
 *
 * Variables (example values from mx1_mx304):
 *   $REAL_SERVICE_V6_1  e.g. 2001:db8:1:255::1
 *   $REAL_SERVICE_V6_2  e.g. 2001:db8:1:255::2
 */
services {
    traffic-load-balance {
        instance ipv6_tlb_sfw_untrust {
            interface lo0.0;
            client-vrf UNTRUST_VR;
            server-vrf UNTRUST_VR;
            group ipv6_untrust_group {
                real-services [ IPv6_UNTRUST_SRX1 IPv6_UNTRUST_SRX2 ];
                routing-instance UNTRUST_VR;
                health-check-interface-subunit 2;
                network-monitoring-profile [ icmp-profile tcp-profile ];
            }
            real-service IPv6_UNTRUST_SRX1 {
                address $REAL_SERVICE_V6_1;
            }
            real-service IPv6_UNTRUST_SRX2 {
                address $REAL_SERVICE_V6_2;
            }
            virtual-service ipv6_srx_untrust_vs {
                mode direct-server-return;
                address 0::0;
                routing-instance srx_mnha_group_tlb-untrust_fi;
                group ipv6_untrust_group;
                load-balance-method {
                    hash {
                        hash-key {
                            destination-ip;
                        }
                    }
                }
            }
        }
    }
}
```

Not included (not defined in the validated source):
- `logical-interface` `lo0.0` on mx1_mx304
Report: https://github.com/Juniper/jvd/issues/new?template=jvd-content.yml&title=Missing%20source%3A%20scale_out_firewall_nat%2Fjunos%2Fservices%2Ftraffic-load-balance-instance-ipv6-tlb-sfw-untrust

## junos/services/traffic-load-balance-instance-tlb-sfw-trust.conf

```
/*
 * Topic: TLB instance tlb_sfw_trust: direct-server-return virtual service hashing on source IP across two SRX real services
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Highlights:
 *   - Non-translated direct server return: the virtual service, reached through forwarding instance srx_mnha_group_tlb-trust_fi, sprays client-to-server traffic across the healthy SRX real services.
 *   - The group health-checks the real services from lo0 unit 1 (`health-check-interface-subunit 1`) with the icmp-profile and tcp-profile network-monitoring profiles.
 * Pair with:
 *  - junos/interfaces/ifl-loopback-description-inet-inet6.conf
 *  - junos/routing-instances/forwarding/ri-srx-mnha-group-tlb-trust-fi.conf
 *  - junos/routing-instances/virtual-router/ri-trust-vr-static-discard-default-ebgp-10-groups.conf
 *  - junos/services/network-monitoring-icmp-tcp-8088-profiles.conf
 *
 * Variables (example values from mx1_mx304):
 *   $REAL_SERVICE_V4_1  e.g. 192.168.10.1
 *   $REAL_SERVICE_V4_2  e.g. 192.168.10.2
 */
services {
    traffic-load-balance {
        instance tlb_sfw_trust {
            interface lo0.0;
            client-vrf TRUST_VR;
            server-vrf TRUST_VR;
            group srx_trust_group {
                real-services [ MNHA_SRX1 MNHA_SRX2 ];
                routing-instance TRUST_VR;
                health-check-interface-subunit 1;
                network-monitoring-profile [ icmp-profile tcp-profile ];
            }
            real-service MNHA_SRX1 {
                address $REAL_SERVICE_V4_1;
            }
            real-service MNHA_SRX2 {
                address $REAL_SERVICE_V4_2;
            }
            virtual-service srx_trust_vs {
                mode direct-server-return;
                address 0.0.0.0;
                routing-instance srx_mnha_group_tlb-trust_fi;
                group srx_trust_group;
                load-balance-method {
                    hash {
                        hash-key {
                            source-ip;
                        }
                    }
                }
            }
        }
    }
}
```

Not included (not defined in the validated source):
- `logical-interface` `lo0.0` on mx1_mx304
Report: https://github.com/Juniper/jvd/issues/new?template=jvd-content.yml&title=Missing%20source%3A%20scale_out_firewall_nat%2Fjunos%2Fservices%2Ftraffic-load-balance-instance-tlb-sfw-trust

## junos/services/traffic-load-balance-instance-tlb-sfw-untrust.conf

```
/*
 * Topic: TLB instance tlb_sfw_untrust: direct-server-return virtual service hashing on destination IP across two SRX real services
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Highlights:
 *   - Return traffic in UNTRUST_VR hashes on destination IP, so it reaches the SRX that the trust instance chose on source IP for the same subscriber.
 *   - The group health-checks the real services from lo0 unit 2 (`health-check-interface-subunit 2`).
 * Pair with:
 *  - junos/interfaces/ifl-loopback-description-inet-inet6.conf
 *  - junos/routing-instances/forwarding/ri-srx-mnha-group-tlb-untrust-fi.conf
 *  - junos/routing-instances/virtual-router/ri-untrust-vr-static-discard-sfw-ebgp-10-groups.conf
 *  - junos/services/network-monitoring-icmp-tcp-8088-profiles.conf
 *
 * Variables (example values from mx1_mx304):
 *   $REAL_SERVICE_V4_1  e.g. 192.168.10.1
 *   $REAL_SERVICE_V4_2  e.g. 192.168.10.2
 */
services {
    traffic-load-balance {
        instance tlb_sfw_untrust {
            interface lo0.0;
            client-vrf UNTRUST_VR;
            server-vrf UNTRUST_VR;
            group srx_untrust_group {
                real-services [ UNTRUST_SRX1 UNTRUST_SRX2 ];
                routing-instance UNTRUST_VR;
                health-check-interface-subunit 2;
                network-monitoring-profile [ icmp-profile tcp-profile ];
            }
            real-service UNTRUST_SRX1 {
                address $REAL_SERVICE_V4_1;
            }
            real-service UNTRUST_SRX2 {
                address $REAL_SERVICE_V4_2;
            }
            virtual-service srx_untrust_vs {
                mode direct-server-return;
                address 0.0.0.0;
                routing-instance srx_mnha_group_tlb-untrust_fi;
                group srx_untrust_group;
                load-balance-method {
                    hash {
                        hash-key {
                            destination-ip;
                        }
                    }
                }
            }
        }
    }
}
```

Not included (not defined in the validated source):
- `logical-interface` `lo0.0` on mx1_mx304
Report: https://github.com/Juniper/jvd/issues/new?template=jvd-content.yml&title=Missing%20source%3A%20scale_out_firewall_nat%2Fjunos%2Fservices%2Ftraffic-load-balance-instance-tlb-sfw-untrust

## junos/services/traffic-load-balance-routing-engine-mode.conf

```
/*
 * Topic: Traffic Load Balancer in routing-engine mode
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Highlights:
 *   - `routing-engine-mode` runs the TLB control plane and health checks on the Routing Engine instead of a services card.
 * Pair with: none
 * Variables: none
 */
services {
    traffic-load-balance {
        routing-engine-mode;
    }
}
```

## junos/snmp/community-read-only-all-clients.conf

```
/*
 * Topic: Read-only SNMP community open to all IPv4 and IPv6 clients
 * Seen on:
 *   Junos: gateway_emulator_mx304 mx1_mx304 srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   gateway_emulator_mx304 1
 *   mx1_mx304 1
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 6
 * Pair with: none
 * Variables (example values from gateway_emulator_mx304):
 *   $SNMP_COMMUNITY  e.g. <SNMP_COMMUNITY>
 */
snmp {
    community $SNMP_COMMUNITY {
        authorization read-only;
        clients {
            ::/0;
            0.0.0.0/0;
        }
    }
}
```

## junos/snmp/trap-group-space-one-target.conf

```
/*
 * Topic: SNMP trap group with one target
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 4
 * Pair with: none
 * Variables (example values from srx1a_srx4600):
 *   $SNMP_TRAP_TARGET_V4  e.g. 10.204.243.205
 */
snmp {
    trap-group space {
        targets {
            $SNMP_TRAP_TARGET_V4;
        }
    }
}
```

## junos/system/commit-synchronize.conf

```
/*
 * Topic: Commit synchronization between Routing Engines
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
system {
    commit synchronize;
}
```

## junos/system/ports-console-log-out.conf

```
/*
 * Topic: Console log-out on disconnect
 * Seen on:
 *   Junos: gateway_emulator_mx304 mx1_mx304 srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   gateway_emulator_mx304 1
 *   mx1_mx304 1
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 6
 * Pair with: none
 * Variables: none
 */
system {
    ports {
        console log-out-on-disconnect;
    }
}
```

## junos/system/processes-sdk-service-enable.conf

```
/*
 * Topic: SDK service process enabled
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
system {
    processes {
        sdk-service enable;
    }
}
```

## junos/system/services-netconf-ssh-root-login-allow.conf

```
/*
 * Topic: NETCONF over SSH and SSH service with root login allowed
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
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

## junos/system/services-netconf-ssh-web-management-http-8088.conf

```
/*
 * Topic: NETCONF over SSH, SSH with root login allowed and HTTP web management on port 8088
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 4
 * Highlights:
 *   - Port 8088 is also the TCP port of the MX TLB `tcp-profile` network-monitoring health check.
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
        web-management {
            http {
                port 8088;
            }
        }
    }
}
```

## junos/system/services-ssh-root-login-allow.conf

```
/*
 * Topic: SSH service with root login allowed
 * Seen on:
 *   Junos: gateway_emulator_mx304
 *   EVO: (none)
 * Count:
 *   gateway_emulator_mx304 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
system {
    services {
        ssh {
            root-login allow;
        }
    }
}
```

## _variables.md

# Snippet variable glossary

All `.conf` files under `junos/` are templates: identifiers that vary between deployments are written as `$VAR`.
Render a snippet by substituting each placeholder with your deployment's value. The placeholders each snippet uses
are listed in its `Variables:` header and in the glossary below. Variable names and meanings follow the shared JVD
snippet vocabulary. Numbered variables (`_1`, `_2`, …) form an ordered set; the numbers carry no other meaning.

Values left literal on purpose: the names of the security objects that other configuration references by name
(security zones, the global address-book entries, which embed their prefix, NAT pools, rule sets and rules, security
policies, services-redundancy group 0 and its monitor object, the TLB instances, groups, real services and virtual
services, the network-monitoring profiles, the firewall filters and their counters); the routing-instance names
`MNHA-VR`, `VR-1`, `TRUST_VR`, `UNTRUST_VR`, `srx_mnha_group_tlb-trust_fi` and `srx_mnha_group_tlb-untrust_fi`; BGP
group names, except the SRX VR-1 groups, which differ between devices; the AS-path prepend lengths that set the
preference between the two nodes of an MNHA pair; the signal route `192.168.255.0`; the SFW, NAT and NAT64 design
prefixes; the BFD, liveness and health-check timers; the port speeds and port counts; the TLB instance interface
`lo0.0`, the MNHA node loopback `lo0.0` and the health-check sources `lo0.1` and `lo0.2`; `unit 0`, and the loopback
`lo0`.

## System, chassis and SNMP

| Variable | What it is | Example value |
|---|---|---|
| `$AE_DEVICE_COUNT` | Number of aggregated Ethernet devices the chassis creates (`aggregated-devices ethernet device-count`). | `50` |
| `$FPC_SLOT` | FPC slot number. | `0` |
| `$GROUP_A` | First configuration-group name of an ordered `apply-groups` list. | `global` |
| `$GROUP_B` | Second configuration-group name of an ordered `apply-groups` list. | `re0` |
| `$GROUP_C` | Third configuration-group name of an ordered `apply-groups` list. | `re1` |
| `$SNMP_COMMUNITY` | **new** SNMP community name (`snmp community`); a credential, supplied by the operator. | `<SNMP_COMMUNITY>` |
| `$SNMP_TRAP_TARGET_V4` | **new** IPv4 address of an SNMP trap target (`snmp trap-group <name> targets`). | `10.204.243.205` |

## Multinode High Availability

| Variable | What it is | Example value |
|---|---|---|
| `$LOOPBACK_V4` | Primary per-node IPv4 loopback address. | `192.168.0.1` |
| `$MNHA_LOCAL_ID` | **new** Local node identifier of an SRX Multinode High Availability (MNHA) node (`chassis high-availability local-id`). | `1` |
| `$MNHA_MONITOR_DST_V4` | **new** Destination IPv4 address of the BFD liveliness monitor of an MNHA services-redundancy group monitor object (`bfd-liveliness destination-ip`). | `10.1.1.1` |
| `$MNHA_MONITOR_SRC_V4` | **new** Source IPv4 address of the BFD liveliness monitor of an MNHA services-redundancy group monitor object (`destination-ip <addr> src-ip`). | `10.1.1.2` |
| `$MNHA_PEER_ID` | **new** Node identifier of the MNHA peer node (`chassis high-availability peer-id`), also named by the services-redundancy group `peer-id`. | `2` |
| `$MNHA_PEER_V4` | **new** Loopback IPv4 address of the MNHA peer node (`chassis high-availability peer-id <n> peer-ip`). | `192.168.0.2` |

## NAT and load balancing

| Variable | What it is | Example value |
|---|---|---|
| `$NAT_POOL_V4_PFX_1` | **new** IPv4 prefix of a source-NAT pool (`security nat source pool <name> address`), as configured and as routed or advertised for return traffic. Numbered `_1`, `_2`, … in source order. | `100.64.1.0/24` |
| `$NAT_POOL_V4_PFX_2` | **new** IPv4 prefix of a source-NAT pool (`security nat source pool <name> address`), as configured and as routed or advertised for return traffic. Numbered `_1`, `_2`, … in source order. | `100.64.2.0/24` |
| `$REAL_SERVICE_V4_1` | **new** IPv4 address of a Traffic Load Balancer real service (`services traffic-load-balance instance <name> real-service <name> address`). Numbered `_1`, `_2`, … in source order. | `192.168.10.1` |
| `$REAL_SERVICE_V4_2` | **new** IPv4 address of a Traffic Load Balancer real service (`services traffic-load-balance instance <name> real-service <name> address`). Numbered `_1`, `_2`, … in source order. | `192.168.10.2` |
| `$REAL_SERVICE_V6_1` | **new** IPv6 address of a Traffic Load Balancer real service (`services traffic-load-balance instance <name> real-service <name> address`). Numbered `_1`, `_2`, … in source order. | `2001:db8:1:255::1` |
| `$REAL_SERVICE_V6_2` | **new** IPv6 address of a Traffic Load Balancer real service (`services traffic-load-balance instance <name> real-service <name> address`). Numbered `_1`, `_2`, … in source order. | `2001:db8:1:255::2` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address with prefix length on an attachment (access-facing) Layer 3 unit. | `100.3.3.2/24` |
| `$AC_ADDR_V6` | IPv6 address with prefix length on an attachment (access-facing) Layer 3 unit. | `100:3:3::2/124` |
| `$AE_BUNDLE` | Aggregated Ethernet interface (`ae<n>`), as configured and as its member ports name it (`802.3ad`). | `ae10` |
| `$DESCRIPTION` | Free-text `description` of an interface, unit or BGP neighbor. | `"TLB Health-Check Source IP Addresses for TRUST VR"` |
| `$IFD` | Interface-device identifier, excluding a logical unit. | `ae10` |
| `$IFL` | Logical interface identifier, including its unit (here the trust-side unit an MNHA BFD liveliness monitor uses). | `ae1.0` |
| `$IFL_1` | Logical interface (unit included) named in one routing instance or security-zone set; `_1`, `_2`, … in source order. | `ae1.100` |
| `$IFL_2` | Logical interface (unit included) named in one routing instance or security-zone set; `_1`, `_2`, … in source order. | `ae2.100` |
| `$IFL_3` | Logical interface (unit included) named in one routing instance or security-zone set; `_1`, `_2`, … in source order. | `ae3.100` |
| `$IFL_4` | Logical interface (unit included) named in one routing instance or security-zone set; `_1`, `_2`, … in source order. | `ae4.100` |
| `$IFL_5` | Logical interface (unit included) named in one routing instance or security-zone set; `_1`, `_2`, … in source order. | `ae10.41` |
| `$LOOPBACK_IFL` | Loopback logical interface (`lo0.<unit>`) listed in a routing instance. | `lo0.1` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on a loopback unit. | `192.168.10.251/32` |
| `$LOOPBACK_V6_PFX` | IPv6 address with prefix length on a loopback unit. | `2001:db8:1:255::251/128` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `1` |
| `$VLAN` | A single VLAN identifier. | `41` |

## Routing instances and eBGP

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `65050` |
| `$ASN_CUSTOMER` | Customer-facing BGP peer autonomous-system number. | `65050` |
| `$ASN_CUSTOMER_1` | Customer-facing BGP peer AS, one of an ordered set. | `65001` |
| `$ASN_CUSTOMER_2` | Customer-facing BGP peer autonomous-system number. Numbered `_1`, `_2`, … in source order. | `65002` |
| `$ASN_LOCAL` | **new** BGP `local-as` of a routing instance where it differs from the instance's `autonomous-system`. | `65200` |
| `$BGP_EXPORT_POL` | Policy-statement name applied as a BGP `export`. | `ipv4_mx_trust-to-srx_trust_export` |
| `$BGP_EXPORT_POL_1` | Policy-statement name applied as the `export` of a BGP group; `_1`, `_2`, … number the distinct policies of one instance in source order. | `def_route_export` |
| `$BGP_EXPORT_POL_2` | Policy-statement name applied as the `export` of a BGP group; `_1`, `_2`, … number the distinct policies of one instance in source order. | `ipv4_mx_trust-to-srx_trust_export` |
| `$BGP_EXPORT_POL_3` | Policy-statement name applied as the `export` of a BGP group; `_1`, `_2`, … number the distinct policies of one instance in source order. | `ipv6_mx_trust-to-srx_trust_export` |
| `$BGP_EXPORT_POL_4` | Policy-statement name applied as the `export` of a BGP group; `_1`, `_2`, … number the distinct policies of one instance in source order. | `ipv6_def_route_export` |
| `$BGP_GROUP_1` | Name of a BGP peer group. Numbered `_1`, `_2`, … in source order. | `Vsrx-to-MX_TRUST` |
| `$BGP_GROUP_2` | Name of a BGP peer group. Numbered `_1`, `_2`, … in source order. | `Vsrx-to-MX_UNTRUST` |
| `$BGP_GROUP_3` | Name of a BGP peer group. Numbered `_1`, `_2`, … in source order. | `IPv6_Vsrx-to-MX_TRUST` |
| `$BGP_GROUP_4` | Name of a BGP peer group. Numbered `_1`, `_2`, … in source order. | `IPv6_Vsrx-to-MX_UNTRUST` |
| `$CE_PEER_V4` | IPv4 address of a VRF eBGP neighbor on the customer or external side. | `10.3.1.1` |
| `$CE_PEER_V4_1` | IPv4 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.1.2` |
| `$CE_PEER_V4_2` | IPv4 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.2.2` |
| `$CE_PEER_V4_3` | IPv4 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.3.2` |
| `$CE_PEER_V4_4` | IPv4 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.4.2` |
| `$CE_PEER_V4_5` | IPv4 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.1.2.2` |
| `$CE_PEER_V6` | IPv6 address of a VRF eBGP neighbor on the customer or external side. | `2001:db8:172:1:1::1` |
| `$CE_PEER_V6_1` | IPv6 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `2001:db8:1:1:3::2` |
| `$CE_PEER_V6_2` | IPv6 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `2001:db8:1:1:4::2` |
| `$CE_PEER_V6_3` | IPv6 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `2001:db8:1:1:1::2` |
| `$CE_PEER_V6_4` | IPv6 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `2001:db8:1:1:2::2` |
| `$CE_PEER_V6_5` | IPv6 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `2001:db8:172:1:1::2` |
| `$NEXT_HOP_V4` | IPv4 next-hop address of a static route (`route <prefix> next-hop`). | `172.16.8.1` |
| `$NEXT_HOP_V6` | IPv6 next-hop address of a static route (`route <prefix> next-hop`). | `2001:db8:172:16:8::1` |
| `$PE_LOCAL_V4` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. | `10.3.1.2` |
| `$PE_LOCAL_V4_1` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.1.1` |
| `$PE_LOCAL_V4_2` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.2.1` |
| `$PE_LOCAL_V4_3` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.3.1` |
| `$PE_LOCAL_V4_4` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.4.1` |

## Policy

| Variable | What it is | Example value |
|---|---|---|
| `$CONDITION_NAME` | Name of a routing-policy condition (`policy-options condition`), as defined and as a policy term references it. | `srg_sig_route_exist` |
| `$POLICY_NAME` | Name of a routing policy-statement where no role-specific name (BGP export or import, VRF import or export, load balancing) applies. | `pfe_lb_hash` |
| `$PPLB_NAME` | Name of a load-balancing policy (per-packet or per-flow), as exported to the forwarding table and as defined. | `ecmp_policy_lab` |
| `$PREFIX` | IPv4 or IPv6 prefix in a route filter or route-filter list. | `192.168.10.251/32` |
| `$ROUTE_FILTER_LIST` | Name of a route-filter list, as defined and as a policy references it. | `nat_pool_route_filter_list` |
| `$TERM_NAME` | Name of a policy-statement or firewall filter term. | `ALL-ELSE` |
| `$TERM_NAME_1` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `NAT64_tlb_traffic_traffic` |
| `$TERM_NAME_2` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `other_traffic` |
| `$TERM_NAME_3` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `other_traffic` |
| `$TERM_NAME_4` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `4` |
| `$TERM_NAME_5` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `5` |
| `$TERM_NAME_6` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `6` |
| `$TERM_NAME_7` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `7` |

## byoai/TIERS.md

> **Tier qualification for this JVD.** Only `minimum` is qualified and selectable.
> The `self-contained` and `as-deployed` lists below are not yet qualified for this
> JVD. They are not selectable: never offer or render them.

# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd security/scale_out_firewall_nat`. -->

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

## Source NAT (NAPT44 and NAT64 pools) and NAT64 destination NAT on an SRX

Family nat, form source-nat-napt44-nat64. OS mode Junos. Attachment: The VR-1 trust and untrust security zones; VR-1 originates the pool prefixes as discard routes and its untrust export policy advertises them..

### srx1a_srx4600 (junos)

- `minimum`: `junos/security/nat-source-napt44-nat64-pools-destination-nat64.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:lo0.1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL_3

### srx1b_srx4600 (junos)

- `minimum`: `junos/security/nat-source-napt44-nat64-pools-destination-nat64.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:lo0.1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL_3

### srx2a_srx4600 (junos)

- `minimum`: `junos/security/nat-source-napt44-nat64-pools-destination-nat64.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:lo0.1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL_3

### srx2b_srx4600 (junos)

- `minimum`: `junos/security/nat-source-napt44-nat64-pools-destination-nat64.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:lo0.1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL_3

---

## Trust-to-untrust security policies for the SFW and NAT source prefixes on an SRX

Family security-policy, form security-policies-sfw-nat. OS mode Junos. Attachment: The VR-1 trust and untrust security zones and the global address-book entries the policies name..

### srx1a_srx4600 (junos)

- `minimum`: `junos/security/policies-trust-to-untrust-permit-sfw-nat-default-permit-all.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_172.80.0.0/12
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_2001:db8:172:80::/96
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_2001:db8:172:160::/96
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_172.160.0.0/12
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:lo0.1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL_3

### srx1b_srx4600 (junos)

- `minimum`: `junos/security/policies-trust-to-untrust-permit-sfw-nat-default-permit-all.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_172.80.0.0/12
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_2001:db8:172:80::/96
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_2001:db8:172:160::/96
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_172.160.0.0/12
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:lo0.1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL_3

### srx2a_srx4600 (junos)

- `minimum`: `junos/security/policies-trust-to-untrust-permit-sfw-nat-default-permit-all.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_172.80.0.0/12
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_2001:db8:172:80::/96
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_2001:db8:172:160::/96
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_172.160.0.0/12
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:lo0.1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL_3

### srx2b_srx4600 (junos)

- `minimum`: `junos/security/policies-trust-to-untrust-permit-sfw-nat-default-permit-all.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_172.80.0.0/12
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_2001:db8:172:80::/96
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_2001:db8:172:160::/96
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_172.160.0.0/12
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:lo0.1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL_3

---

## SRX Multinode High Availability (routing mode) with SRG 0, a BFD monitor and an install-on-failure signal route

Family mnha, form mnha-srg-0-signal-route. OS mode Junos. Attachment: lo0.0 in MNHA-VR (the inter-chassis link endpoint) and the trust-side VR-1 unit that the BFD liveliness monitor uses..

### srx1a_srx4600 (junos)

- `minimum`: `junos/chassis/high-availability-mnha-srg-0-bfd-monitor-install-on-failure-route.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx1b_srx4600 (junos)

- `minimum`: `junos/chassis/high-availability-mnha-srg-0-bfd-monitor-install-on-failure-route.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx2a_srx4600 (junos)

- `minimum`: `junos/chassis/high-availability-mnha-srg-0-bfd-monitor-install-on-failure-route.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx2b_srx4600 (junos)

- `minimum`: `junos/chassis/high-availability-mnha-srg-0-bfd-monitor-install-on-failure-route.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

---

## SRX MNHA-VR inter-chassis link routing with eBGP and BFD to the MX

Family mnha, form srx-mnha-vr-icl. OS mode Junos. Attachment: The inter-chassis link VLAN unit toward the MX and lo0.0..

### srx1a_srx4600 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-mnha-vr-ebgp-icl-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx1b_srx4600 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-mnha-vr-ebgp-icl-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx2a_srx4600 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-mnha-vr-ebgp-icl-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx2b_srx4600 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-mnha-vr-ebgp-icl-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

---

## SRX VR-1 scale-out routing with NAT pool discard routes and IPv4 and IPv6 eBGP to the MX trust and untrust instances

Family scale-out-routing, form srx-vr-1-scale-out. OS mode Junos. Attachment: The MX-facing trust and untrust VLAN units and lo0.1, the TLB real-service address..

### srx1a_srx4600 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-vr-1-nat-pool-discard-ebgp-trust-untrust-inet-inet6.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4

### srx1b_srx4600 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-vr-1-nat-pool-discard-ebgp-trust-untrust-inet-inet6.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4

### srx2a_srx4600 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-vr-1-nat-pool-discard-ebgp-trust-untrust-inet-inet6.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4

### srx2b_srx4600 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-vr-1-nat-pool-discard-ebgp-trust-untrust-inet-inet6.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4

---

## MX TRUST_VR scale-out routing with eBGP multipath to every SRX node and eBGP to the trust gateway

Family scale-out-routing, form mx-trust-vr-scale-out. OS mode Junos. Attachment: The SRX-facing trust VLAN units, the gateway-facing unit with the TLB trust filters and lo0.1, the TLB health-check source..

### mx1_mx304 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-trust-vr-static-discard-default-ebgp-10-groups.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_4
  - occurrence-selection-required: logical-interface:$IFL_5
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4

---

## MX UNTRUST_VR scale-out routing with eBGP multipath to every SRX node and eBGP to the untrust gateway

Family scale-out-routing, form mx-untrust-vr-scale-out. OS mode Junos. Attachment: The SRX-facing untrust VLAN units, the gateway-facing unit with the TLB untrust filters and lo0.2, the TLB health-check source..

### mx1_mx304 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-untrust-vr-static-discard-sfw-ebgp-10-groups.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_4
  - occurrence-selection-required: logical-interface:$IFL_5
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4

---

## MX MNHA-VR with eBGP to the inter-chassis link unit of every SRX node

Family mnha, form mx-mnha-vr-icl. OS mode Junos. Attachment: The inter-chassis link VLAN unit toward each SRX node..

### mx1_mx304 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-mnha-vr-ebgp-4-icl-groups.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_4
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

---

## MX TLB instance tlb_sfw_trust (IPv4, direct server return, source-IP hash)

Family tlb, form tlb-sfw-trust. OS mode Junos. Attachment: lo0.0 as the instance interface, lo0.1 as the health-check source and forwarding instance srx_mnha_group_tlb-trust_fi, which the MX_TLB_LB_TRUST filter feeds..

### mx1_mx304 (junos)

- `minimum`: `junos/services/traffic-load-balance-instance-tlb-sfw-trust.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_4
  - occurrence-selection-required: logical-interface:$IFL_5
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4

---

## MX TLB instance tlb_sfw_untrust (IPv4, direct server return, destination-IP hash)

Family tlb, form tlb-sfw-untrust. OS mode Junos. Attachment: lo0.0 as the instance interface, lo0.2 as the health-check source and forwarding instance srx_mnha_group_tlb-untrust_fi, which the MX_TLB_LB_UNTRUST filter feeds..

### mx1_mx304 (junos)

- `minimum`: `junos/services/traffic-load-balance-instance-tlb-sfw-untrust.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_4
  - occurrence-selection-required: logical-interface:$IFL_5
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4

---

## MX TLB instance ipv6_tlb_sfw_trust (IPv6, direct server return, source-IP hash)

Family tlb, form tlb-sfw-trust-ipv6. OS mode Junos. Attachment: lo0.0 as the instance interface, lo0.1 as the health-check source and forwarding instance srx_mnha_group_tlb-trust_fi, which the IPv6_MX_TLB_LB_TRUST filter feeds..

### mx1_mx304 (junos)

- `minimum`: `junos/services/traffic-load-balance-instance-ipv6-tlb-sfw-trust.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_4
  - occurrence-selection-required: logical-interface:$IFL_5
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4

---

## MX TLB instance ipv6_tlb_sfw_untrust (IPv6, direct server return, destination-IP hash)

Family tlb, form tlb-sfw-untrust-ipv6. OS mode Junos. Attachment: lo0.0 as the instance interface, lo0.2 as the health-check source and forwarding instance srx_mnha_group_tlb-untrust_fi, which the IPv6_MX_TLB_LB_UNTRUST filter feeds..

### mx1_mx304 (junos)

- `minimum`: `junos/services/traffic-load-balance-instance-ipv6-tlb-sfw-untrust.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_4
  - occurrence-selection-required: logical-interface:$IFL_5
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4

---

## MX gateway-facing unit with filter-based forwarding into the TLB trust forwarding instance

Family tlb, form tlb-fbf-trust. OS mode Junos. Attachment: The trust-gateway-facing VLAN unit of the aggregated Ethernet interface..

### mx1_mx304 (junos)

- `minimum`: `junos/interfaces/ifl-vlan-inet-inet6-input-filter-mx-tlb-lb-trust.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

---

## MX gateway-facing unit with filter-based forwarding into the TLB untrust forwarding instance

Family tlb, form tlb-fbf-untrust. OS mode Junos. Attachment: The untrust-gateway-facing VLAN unit of the aggregated Ethernet interface..

### mx1_mx304 (junos)

- `minimum`: `junos/interfaces/ifl-vlan-inet-inet6-input-filter-mx-tlb-lb-untrust.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

---

## byoai/DEFAULTS.md

# DEFAULTS — Scale-Out Firewall and NAT

Lab auto-fill values for the Scale-Out Firewall and NAT JVD. Every value is measured from the published device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks a device and service and asks for lab values; otherwise ask for the deployment values.

## Device inventory

| Role | Device | Platform | OS | Loopbacks | AS numbers (instance: local AS) |
|------|--------|----------|----|-----------|---------------------------------|
| Gateway / Emulator | gateway_emulator_mx304 | MX304 | Junos | — | TRUST_VR 65100; UNTRUST_VR 65300 |
| Forwarding / Load Balancer | mx1_mx304 | MX304 | Junos | lo0.1 192.168.10.251/32, 2001:db8:1:255::251/128; lo0.2 192.168.10.252/32, 2001:db8:1:255::252/128 | MNHA-VR 65050; TRUST_VR 65200 (instance AS 1000); UNTRUST_VR 65400 |
| Security Service (SFW/NAT) | srx1a_srx4600 | SRX4600 | Junos | lo0.0 192.168.0.1/32; lo0.1 192.168.10.1/32, 2001:db8:1:255::1/128 | MNHA-VR 65001; VR-1 65000 |
| Security Service (SFW/NAT) | srx1b_srx4600 | SRX4600 | Junos | lo0.0 192.168.0.2/32; lo0.1 192.168.10.1/32, 2001:db8:1:255::1/128 | MNHA-VR 65002; VR-1 65000 |
| Security Service (SFW/NAT) | srx2a_srx4600 | SRX4600 | Junos | lo0.0 192.168.0.3/32; lo0.1 192.168.10.2/32, 2001:db8:1:255::2/128 | MNHA-VR 65001; VR-1 65000 |
| Security Service (SFW/NAT) | srx2b_srx4600 | SRX4600 | Junos | lo0.0 192.168.0.4/32; lo0.1 192.168.10.2/32, 2001:db8:1:255::2/128 | MNHA-VR 65002; VR-1 65000 |

The two nodes of an MNHA pair share their lo0.1 address (the TLB real service of the pair) and swap their MNHA local and peer IDs; the A nodes (srx1a, srx2a) prepend the AS path less than the B nodes (srx1b, srx2b).

## NAT pools

| MNHA pair | Devices | NAPT44 pool (`$NAT_POOL_V4_PFX_1`) | NAT64 source pool (`$NAT_POOL_V4_PFX_2`) |
|-----------|---------|------------------------------------|------------------------------------------|
| 1 | srx1a_srx4600 and srx1b_srx4600 | 100.64.1.0/24 | 100.64.2.0/24 |
| 2 | srx2a_srx4600 and srx2b_srx4600 | 100.64.3.0/24 | 100.64.4.0/24 |

## First validated instance per service and device

| Service form | Device | Example values |
|--------------|--------|----------------|
| source-nat-napt44-nat64 | srx1a_srx4600 | `$NAT_POOL_V4_PFX_1` 100.64.1.0/24, `$NAT_POOL_V4_PFX_2` 100.64.2.0/24 |
| source-nat-napt44-nat64 | srx1b_srx4600 | `$NAT_POOL_V4_PFX_1` 100.64.1.0/24, `$NAT_POOL_V4_PFX_2` 100.64.2.0/24 |
| source-nat-napt44-nat64 | srx2a_srx4600 | `$NAT_POOL_V4_PFX_1` 100.64.3.0/24, `$NAT_POOL_V4_PFX_2` 100.64.4.0/24 |
| source-nat-napt44-nat64 | srx2b_srx4600 | `$NAT_POOL_V4_PFX_1` 100.64.3.0/24, `$NAT_POOL_V4_PFX_2` 100.64.4.0/24 |
| security-policies-sfw-nat | srx1a_srx4600 | (no variables: the snip is rendered as written) |
| security-policies-sfw-nat | srx1b_srx4600 | (no variables: the snip is rendered as written) |
| security-policies-sfw-nat | srx2a_srx4600 | (no variables: the snip is rendered as written) |
| security-policies-sfw-nat | srx2b_srx4600 | (no variables: the snip is rendered as written) |
| mnha-srg-0-signal-route | srx1a_srx4600 | `$IFL` ae1.0, `$LOOPBACK_V4` 192.168.0.1, `$MNHA_LOCAL_ID` 1, `$MNHA_MONITOR_DST_V4` 10.1.1.1, `$MNHA_MONITOR_SRC_V4` 10.1.1.2, `$MNHA_PEER_ID` 2 … |
| mnha-srg-0-signal-route | srx1b_srx4600 | `$IFL` ae1.0, `$LOOPBACK_V4` 192.168.0.2, `$MNHA_LOCAL_ID` 2, `$MNHA_MONITOR_DST_V4` 10.1.2.1, `$MNHA_MONITOR_SRC_V4` 10.1.2.2, `$MNHA_PEER_ID` 1 … |
| mnha-srg-0-signal-route | srx2a_srx4600 | `$IFL` ae2.0, `$LOOPBACK_V4` 192.168.0.3, `$MNHA_LOCAL_ID` 1, `$MNHA_MONITOR_DST_V4` 10.1.3.1, `$MNHA_MONITOR_SRC_V4` 10.1.3.2, `$MNHA_PEER_ID` 2 … |
| mnha-srg-0-signal-route | srx2b_srx4600 | `$IFL` ae2.0, `$LOOPBACK_V4` 192.168.0.4, `$MNHA_LOCAL_ID` 2, `$MNHA_MONITOR_DST_V4` 10.1.4.1, `$MNHA_MONITOR_SRC_V4` 10.1.4.2, `$MNHA_PEER_ID` 1 … |
| srx-mnha-vr-icl | srx1a_srx4600 | `$ASN` 65001, `$ASN_CUSTOMER` 65050, `$BGP_EXPORT_POL` mnha_ip, `$CE_PEER_V4` 10.3.1.1, `$IFL` ae1.100, `$PE_LOCAL_V4` 10.3.1.2 |
| srx-mnha-vr-icl | srx1b_srx4600 | `$ASN` 65002, `$ASN_CUSTOMER` 65050, `$BGP_EXPORT_POL` mnha_ip, `$CE_PEER_V4` 10.3.2.1, `$IFL` ae1.100, `$PE_LOCAL_V4` 10.3.2.2 |
| srx-mnha-vr-icl | srx2a_srx4600 | `$ASN` 65001, `$ASN_CUSTOMER` 65050, `$BGP_EXPORT_POL` mnha_ip, `$CE_PEER_V4` 10.3.3.1, `$IFL` ae2.100, `$PE_LOCAL_V4` 10.3.3.2 |
| srx-mnha-vr-icl | srx2b_srx4600 | `$ASN` 65002, `$ASN_CUSTOMER` 65050, `$BGP_EXPORT_POL` mnha_ip, `$CE_PEER_V4` 10.3.4.1, `$IFL` ae2.100, `$PE_LOCAL_V4` 10.3.4.2 |
| srx-vr-1-scale-out | srx1a_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER_1` 65200, `$ASN_CUSTOMER_2` 65400, `$BGP_EXPORT_POL_1` trust_export_policy, `$BGP_EXPORT_POL_2` untrust_export_policy, `$BGP_EXPORT_POL_3` ipv6_trust_export_policy … |
| srx-vr-1-scale-out | srx1b_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER_1` 65200, `$ASN_CUSTOMER_2` 65400, `$BGP_EXPORT_POL_1` trust_export_policy, `$BGP_EXPORT_POL_2` untrust_export_policy, `$BGP_EXPORT_POL_3` ipv6_trust_export_policy … |
| srx-vr-1-scale-out | srx2a_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER_1` 65200, `$ASN_CUSTOMER_2` 65400, `$BGP_EXPORT_POL_1` trust_export_policy, `$BGP_EXPORT_POL_2` untrust_export_policy, `$BGP_EXPORT_POL_3` ipv6_trust_export_policy … |
| srx-vr-1-scale-out | srx2b_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER_1` 65200, `$ASN_CUSTOMER_2` 65400, `$BGP_EXPORT_POL_1` trust_export_policy, `$BGP_EXPORT_POL_2` untrust_export_policy, `$BGP_EXPORT_POL_3` ipv6_trust_export_policy … |
| mx-trust-vr-scale-out | mx1_mx304 | `$ASN` 1000, `$ASN_CUSTOMER_1` 65100, `$ASN_CUSTOMER_2` 65000, `$ASN_LOCAL` 65200, `$BGP_EXPORT_POL_1` def_route_export, `$BGP_EXPORT_POL_2` ipv4_mx_trust-to-srx_trust_export … |
| mx-untrust-vr-scale-out | mx1_mx304 | `$ASN` 65400, `$ASN_CUSTOMER_1` 65300, `$ASN_CUSTOMER_2` 65000, `$BGP_EXPORT_POL_1` ipv4_mx_untrust_to_gw_export, `$BGP_EXPORT_POL_2` ipv4_mx_untrust-to-srx_untrust_export, `$BGP_EXPORT_POL_3` ipv6_mx_untrust-to-srx_untrust_export … |
| mx-mnha-vr-icl | mx1_mx304 | `$ASN` 65050, `$ASN_CUSTOMER_1` 65001, `$ASN_CUSTOMER_2` 65002, `$BGP_EXPORT_POL` mnha-mx-to-srx-export, `$CE_PEER_V4_1` 10.3.1.2, `$CE_PEER_V4_2` 10.3.2.2 … |
| tlb-sfw-trust | mx1_mx304 | `$REAL_SERVICE_V4_1` 192.168.10.1, `$REAL_SERVICE_V4_2` 192.168.10.2 |
| tlb-sfw-untrust | mx1_mx304 | `$REAL_SERVICE_V4_1` 192.168.10.1, `$REAL_SERVICE_V4_2` 192.168.10.2 |
| tlb-sfw-trust-ipv6 | mx1_mx304 | `$REAL_SERVICE_V6_1` 2001:db8:1:255::1, `$REAL_SERVICE_V6_2` 2001:db8:1:255::2 |
| tlb-sfw-untrust-ipv6 | mx1_mx304 | `$REAL_SERVICE_V6_1` 2001:db8:1:255::1, `$REAL_SERVICE_V6_2` 2001:db8:1:255::2 |
| tlb-fbf-trust | mx1_mx304 | `$AC_ADDR_V4` 172.16.1.1/30, `$AC_ADDR_V6` 2001:db8:172:1:1::1/126, `$IFD` ae10, `$UNIT` 41, `$VLAN` 41 |
| tlb-fbf-untrust | mx1_mx304 | `$AC_ADDR_V4` 172.16.2.1/30, `$AC_ADDR_V6` 2001:db8:172:2:1::1/126, `$IFD` ae10, `$UNIT` 81, `$VLAN` 81 |

The two nodes of an MNHA pair name each other: each node's `$MNHA_PEER_V4` is the other node's lo0.0 address and its `$MNHA_PEER_ID` the other node's `$MNHA_LOCAL_ID`. The MX TLB real services are the SRX pairs' lo0.1 addresses, and the MX eBGP neighbors are the SRX nodes' VLAN unit addresses.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into `jvd-so-fwnat-snips.md` by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: minimum
# devices:
#   srx1a: { name: <hostname>, os: junos, mnha_node: <A|B>, loopback4: <lo0.0 addr> }
#   mx1: { name: <hostname>, os: junos }
# services:
#   - { kind: <source-nat-napt44-nat64|security-policies-sfw-nat|mnha-srg-0-signal-route|srx-mnha-vr-icl|srx-vr-1-scale-out|mx-trust-vr-scale-out|mx-untrust-vr-scale-out|mx-mnha-vr-icl|tlb-sfw-trust|tlb-sfw-untrust|tlb-sfw-trust-ipv6|tlb-sfw-untrust-ipv6|tlb-fbf-trust|tlb-fbf-untrust>,
#       values: { <$VAR>: <value>, ... } }
# snips_used:
#   - junos/security/nat-source-napt44-nat64-pools-destination-nat64.conf
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
- What is not included: the snip's "Not included" references (the `global`, `re0` and `re1` configuration groups; `lo0.0` on the MX), with the Report link.
- Inputs defaulted because the user did not provide them.
- Cross-device consistency the user must verify: the two nodes of an MNHA pair name each other (peer ID and peer loopback) and keep the security object names identical; each MNHA pair has its own NAT pool prefixes, which its VR-1 discard routes and untrust export policy advertise; the MX TLB real services are the SRX pairs' lo0.1 addresses; the MX and SRX eBGP neighbors and AS numbers match on each VLAN unit; the A and B nodes keep their different AS-path prepend lengths.
- Anything that is by-pattern rather than validated on that exact device.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
