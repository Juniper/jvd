# JVD Scale-Out IPsec (CSDS ScaleOut) snippet library

## junos/applications/application-esp.conf

```
/*
 * Topic: Custom application ESP (IP protocol esp)
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
 * Variables: none
 */
applications {
    application ESP protocol esp;
}
```

## junos/chassis/aggregated-devices-ethernet.conf

```
/*
 * Topic: Aggregated Ethernet device-count for the chassis
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304 mx1_mx304 srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   mx1_mx304 1
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $AE_DEVICE_COUNT  e.g. 16
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
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ipsec_initiator_gateway_mx304):
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

## junos/chassis/fpc-power-off.conf

```
/*
 * Topic: Powered-off line card slot
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 2
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $FPC_SLOT  e.g. 1
 */
chassis {
    fpc $FPC_SLOT {
        power off;
    }
}
```

## junos/chassis/high-availability-mnha-icl-encryption-srg-1-ipsec-activeness-probe-preemption-priority-200.conf

```
/*
 * Topic: SRX Multinode High Availability (routing mode) with an encrypted inter-chassis link and IPsec SRG 1 (activeness probe, BFD monitor, signal routes), preemption and activeness priority 200
 * Seen on:
 *   Junos: srx1a_srx4600 srx2a_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx2a_srx4600 1
 *   total 2
 * Highlights:
 *   - The nodes reach each other from lo0.0 in MNHA-VR (BFD liveness detection); `vpn-profile L3HA_IPSEC_VPN` encrypts the inter-chassis link with the `ha-link-encryption` IPsec VPN.
 *   - SRG 1 (`managed-services ipsec`) owns the IKE anycast prefix in prefix-list ike_lo0; the active node installs signal route 192.168.255.0 and the backup node 192.168.255.1 in MNHA-VR, which the export policies' `if-route-exists` conditions test.
 *   - Preemption with activeness priority 200 makes this node active for SRG 1 whenever it is healthy.
 * Pair with:
 *  - junos/interfaces/ifl-loopback-inet-primary.conf
 *  - junos/policy-options/prefix-list/prefix-list-ike-lo0.conf
 *  - junos/routing-instances/virtual-router/ri-mnha-vr-ebgp-icl-bfd.conf
 *  - junos/security/ipsec-autovpn-st0-1-mnha-icl-link-encryption-aes-256-gcm.conf
 *
 * Peers with: n/a
 * Variables (example values from srx1a_srx4600):
 *   $MNHA_LOCAL_ID        e.g. 1
 *   $LOOPBACK_V4          e.g. 192.168.0.1
 *   $MNHA_PEER_ID         e.g. 2
 *   $MNHA_PEER_V4         e.g. 192.168.0.2
 *   $MNHA_PROBE_DST_V4    e.g. 10.1.1.1
 *   $MNHA_PROBE_SRC_V4    e.g. 192.168.10.1
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
            vpn-profile L3HA_IPSEC_VPN;
            liveness-detection {
                minimum-interval 1000;
                multiplier 3;
            }
        }
        services-redundancy-group 0 {
            peer-id {
                $MNHA_PEER_ID;
            }
        }
        services-redundancy-group 1 {
            peer-id {
                $MNHA_PEER_ID;
            }
            activeness-probe {
                dest-ip {
                    $MNHA_PROBE_DST_V4;
                    src-ip $MNHA_PROBE_SRC_V4;
                }
            }
            monitor {
                bfd-liveliness $MNHA_MONITOR_DST_V4 {
                    src-ip $MNHA_MONITOR_SRC_V4;
                    session-type singlehop;
                    interface $IFL;
                }
            }
            active-signal-route {
                192.168.255.0;
                routing-instance MNHA-VR;
            }
            backup-signal-route {
                192.168.255.1;
                routing-instance MNHA-VR;
            }
            prefix-list ike_lo0;
            managed-services ipsec;
            preemption;
            activeness-priority 200;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$IFL`): required, for each reference; `interfaces/ifl-vlan-inet`

## junos/chassis/high-availability-mnha-icl-encryption-srg-1-ipsec-activeness-probe-priority-1.conf

```
/*
 * Topic: SRX Multinode High Availability (routing mode) with an encrypted inter-chassis link and IPsec SRG 1 (activeness probe, BFD monitor, signal routes), activeness priority 1
 * Seen on:
 *   Junos: srx1b_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1b_srx4600 1
 *   srx2b_srx4600 1
 *   total 2
 * Highlights:
 *   - The nodes reach each other from lo0.0 in MNHA-VR (BFD liveness detection); `vpn-profile L3HA_IPSEC_VPN` encrypts the inter-chassis link with the `ha-link-encryption` IPsec VPN.
 *   - SRG 1 (`managed-services ipsec`) owns the IKE anycast prefix in prefix-list ike_lo0; the active node installs signal route 192.168.255.0 and the backup node 192.168.255.1 in MNHA-VR, which the export policies' `if-route-exists` conditions test.
 * Pair with:
 *  - junos/interfaces/ifl-loopback-inet-primary.conf
 *  - junos/policy-options/prefix-list/prefix-list-ike-lo0.conf
 *  - junos/routing-instances/virtual-router/ri-mnha-vr-ebgp-icl-bfd.conf
 *  - junos/security/ipsec-autovpn-st0-1-mnha-icl-link-encryption-aes-256-gcm.conf
 *
 * Peers with: n/a
 * Variables (example values from srx1b_srx4600):
 *   $MNHA_LOCAL_ID        e.g. 2
 *   $LOOPBACK_V4          e.g. 192.168.0.2
 *   $MNHA_PEER_ID         e.g. 1
 *   $MNHA_PEER_V4         e.g. 192.168.0.1
 *   $MNHA_PROBE_DST_V4    e.g. 10.1.2.1
 *   $MNHA_PROBE_SRC_V4    e.g. 192.168.10.1
 *   $MNHA_MONITOR_DST_V4  e.g. 10.1.2.1
 *   $MNHA_MONITOR_SRC_V4  e.g. 10.1.2.2
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
            vpn-profile L3HA_IPSEC_VPN;
            liveness-detection {
                minimum-interval 1000;
                multiplier 3;
            }
        }
        services-redundancy-group 0 {
            peer-id {
                $MNHA_PEER_ID;
            }
        }
        services-redundancy-group 1 {
            peer-id {
                $MNHA_PEER_ID;
            }
            activeness-probe {
                dest-ip {
                    $MNHA_PROBE_DST_V4;
                    src-ip $MNHA_PROBE_SRC_V4;
                }
            }
            monitor {
                bfd-liveliness $MNHA_MONITOR_DST_V4 {
                    src-ip $MNHA_MONITOR_SRC_V4;
                    session-type singlehop;
                    interface $IFL;
                }
            }
            active-signal-route {
                192.168.255.0;
                routing-instance MNHA-VR;
            }
            backup-signal-route {
                192.168.255.1;
                routing-instance MNHA-VR;
            }
            prefix-list ike_lo0;
            managed-services ipsec;
            activeness-priority 1;
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$IFL`): required, for each reference; `interfaces/ifl-vlan-inet`

## junos/chassis/network-services-enhanced-ip.conf

```
/*
 * Topic: Enhanced IP chassis network-services mode
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304 mx1_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
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

## junos/firewall/filter-ipsec-lb-ike-anycast-to-srx-tproxy-fi.conf

```
/*
 * Topic: Filter IPSEC_LB: counts, logs and sends traffic for the IKE anycast address 10.100.0.1/32 to forwarding instance srx-tproxy-fi; counts and accepts everything else
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with:
 *  - junos/routing-instances/forwarding/ri-srx-tproxy-fi.conf
 *
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $TERM_NAME_1  e.g. IPSEC
 *   $TERM_NAME_2  e.g. other_traffic
 */
firewall {
    family inet {
        filter IPSEC_LB {
            term $TERM_NAME_1 {
                from {
                    destination-address {
                        10.100.0.1/32;
                    }
                }
                then {
                    count ipsec_tlb_traffic;
                    log;
                    routing-instance srx-tproxy-fi;
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
 *   - Symmetric hashing gives a flow and its reverse the same hash, so both directions of a flow take the same path through the scale-out services.
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
 *   Junos: mx1_mx304 srx1a_srx4600 srx1b_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2b_srx4600 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $GROUP_A  e.g. global
 *   $GROUP_B  e.g. re0
 *   $GROUP_C  e.g. re1
 */
apply-groups [ $GROUP_A $GROUP_B $GROUP_C ];
```

Not included (not defined in the validated source):
- `group` `global` on mx1_mx304
- `group` `re0` on mx1_mx304
- `group` `re1` on mx1_mx304
- `group` `global` on srx1a_srx4600
- `group` `re0` on srx1a_srx4600
- `group` `re1` on srx1a_srx4600
- `group` `global` on srx1b_srx4600
- `group` `re0` on srx1b_srx4600
- `group` `re1` on srx1b_srx4600
- `group` `global` on srx2b_srx4600
- `group` `re0` on srx2b_srx4600
- `group` `re1` on srx2b_srx4600
Report: https://github.com/Juniper/jvd/issues/new?template=jvd-content.yml&title=Missing%20source%3A%20scale_out_ipsec%2Fjunos%2Fgroups%2Fapply-global-three

## junos/groups/apply-global-two.conf

```
/*
 * Topic: Ordered global two-group application
 * Seen on:
 *   Junos: srx2a_srx4600
 *   EVO: (none)
 * Count:
 *   srx2a_srx4600 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx2a_srx4600):
 *   $GROUP_A  e.g. global
 *   $GROUP_B  e.g. re0
 */
apply-groups [ $GROUP_A $GROUP_B ];
```

Not included (not defined in the validated source):
- `group` `global` on srx2a_srx4600
- `group` `re0` on srx2a_srx4600
Report: https://github.com/Juniper/jvd/issues/new?template=jvd-content.yml&title=Missing%20source%3A%20scale_out_ipsec%2Fjunos%2Fgroups%2Fapply-global-two

## junos/interfaces/ifd-ae-flexible-vlan-tagging-mtu-9192-flexible-ethernet-services-lacp-fast.conf

```
/*
 * Topic: Aggregated Ethernet interface with flexible VLAN tagging, MTU 9192, flexible Ethernet services and fast active LACP
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304 mx1_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   mx1_mx304 1
 *   total 2
 * Pair with: none
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $IFD  e.g. ae10
 */
interfaces {
    $IFD {
        flexible-vlan-tagging;
        mtu 9192;
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

## junos/interfaces/ifd-ae-vlan-tagging-mtu-9130-lacp-fast.conf

```
/*
 * Topic: Aggregated Ethernet interface with VLAN tagging, MTU 9130, one minimum link and fast active LACP
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
        mtu 9130;
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

## junos/interfaces/ifd-ams-2-members-drop-member-traffic-rejoin.conf

```
/*
 * Topic: Aggregated multiservices (AMS) interface with two member service interfaces, dropping a failed member's traffic and rejoining it
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   total 1
 * Highlights:
 *   - The AMS bundle spreads the initiator gateway's IPsec service-sets across the two MS-MPC service interfaces.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $IFD               e.g. ams1
 *   $AMS_MEMBER_IFD_1  e.g. mams-3/0/0
 *   $AMS_MEMBER_IFD_2  e.g. mams-3/1/0
 */
interfaces {
    $IFD {
        load-balancing-options {
            member-interface $AMS_MEMBER_IFD_1;
            member-interface $AMS_MEMBER_IFD_2;
            member-failure-options {
                drop-member-traffic {
                    rejoin-timeout 0;
                    enable-rejoin;
                }
            }
        }
    }
}
```

## junos/interfaces/ifd-lag-member-gigether.conf

```
/*
 * Topic: Aggregated Ethernet member link through gigether-options
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304 mx1_mx304 srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 2
 *   mx1_mx304 10
 *   srx1a_srx4600 2
 *   srx1b_srx4600 2
 *   srx2a_srx4600 2
 *   srx2b_srx4600 2
 *   total 20
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ipsec_initiator_gateway_mx304):
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
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 2
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $IFD  e.g. et-0/1/2
 */
interfaces {
    $IFD {
        mtu 9192;
    }
}
```

## junos/interfaces/ifl-ams-inside-disable-hash.conf

```
/*
 * Topic: AMS unit in the inside service domain with hashing disabled
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 5
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $IFD   e.g. ams1
 *   $UNIT  e.g. 1
 */
interfaces {
    $IFD {
        unit $UNIT {
            family inet;
            service-domain inside;
            load-balancing-options {
                disable-hash;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-ams-2-members-drop-member-traffic-rejoin`

## junos/interfaces/ifl-ams-outside-disable-hash.conf

```
/*
 * Topic: AMS unit in the outside service domain with hashing disabled
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 5
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $IFD   e.g. ams1
 *   $UNIT  e.g. 2001
 */
interfaces {
    $IFD {
        unit $UNIT {
            family inet;
            service-domain outside;
            load-balancing-options {
                disable-hash;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-ams-2-members-drop-member-traffic-rejoin`

## junos/interfaces/ifl-loopback-inet-5-addresses.conf

```
/*
 * Topic: Loopback unit 0 with five IPv4 addresses
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   total 1
 * Highlights:
 *   - On the initiator gateway these are the local addresses of the five IKE gateways.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $LOOPBACK_V4_PFX_1  e.g. 10.200.0.1/32
 *   $LOOPBACK_V4_PFX_2  e.g. 10.200.0.2/32
 *   $LOOPBACK_V4_PFX_3  e.g. 10.200.0.3/32
 *   $LOOPBACK_V4_PFX_4  e.g. 10.200.0.4/32
 *   $LOOPBACK_V4_PFX_5  e.g. 10.200.0.5/32
 */
interfaces {
    lo0 {
        unit 0 {
            family inet {
                address $LOOPBACK_V4_PFX_1;
                address $LOOPBACK_V4_PFX_2;
                address $LOOPBACK_V4_PFX_3;
                address $LOOPBACK_V4_PFX_4;
                address $LOOPBACK_V4_PFX_5;
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

## junos/interfaces/ifl-loopback-inet-two-addresses.conf

```
/*
 * Topic: Loopback unit with two IPv4 addresses
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
 *   $UNIT                 e.g. 1
 *   $LOOPBACK_V4_PFX      e.g. 10.100.0.1/32
 *   $LOOPBACK_ALT_V4_PFX  e.g. 192.168.10.1/32
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
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $UNIT             e.g. 1
 *   $LOOPBACK_V4_PFX  e.g. 192.168.10.251/32
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

## junos/interfaces/ifl-unit-0-inet-address-inet6.conf

```
/*
 * Topic: Unit 0 with one IPv4 address and family inet6 without an address
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $IFD         e.g. et-2/1/0
 *   $AC_ADDR_V4  e.g. 90.1.1.2/30
 */
interfaces {
    $IFD {
        unit 0 {
            family inet {
                address $AC_ADDR_V4;
            }
            family inet6;
        }
    }
}
```

## junos/interfaces/ifl-unit-0-inet.conf

```
/*
 * Topic: Unit 0 with one IPv4 address
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 10
 *   total 10
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $IFD         e.g. et-2/1/1
 *   $AC_ADDR_V4  e.g. 100.1.1.2/24
 */
interfaces {
    $IFD {
        unit 0 {
            family inet {
                address $AC_ADDR_V4;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-mtu-9192`

## junos/interfaces/ifl-unit-inet.conf

```
/*
 * Topic: Logical unit with family inet and no address
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304 srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 5
 *   srx1a_srx4600 3
 *   srx1b_srx4600 3
 *   srx2a_srx4600 3
 *   srx2b_srx4600 3
 *   total 17
 * Highlights:
 *   - Here these are the st0 secure-tunnel units; the route-based IPsec VPNs bind st0.1 on the SRX nodes and st0.1 to st0.5 on the initiator gateway.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $IFD   e.g. st0
 *   $UNIT  e.g. 1
 */
interfaces {
    $IFD {
        unit $UNIT {
            family inet;
        }
    }
}
```

## junos/interfaces/ifl-vlan-inet-input-filter-ipsec-lb.conf

```
/*
 * Topic: VLAN unit with an IPv4 address and the IPSEC_LB input filter
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Highlights:
 *   - The input filter steers traffic for the IKE anycast address into the TLB forwarding instance srx-tproxy-fi (filter-based forwarding).
 * Pair with:
 *  - junos/firewall/filter-ipsec-lb-ike-anycast-to-srx-tproxy-fi.conf
 *
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $IFD         e.g. ae10
 *   $UNIT        e.g. 40
 *   $VLAN        e.g. 40
 *   $AC_ADDR_V4  e.g. 172.16.1.1/30
 */
interfaces {
    $IFD {
        unit $UNIT {
            vlan-id $VLAN;
            family inet {
                filter {
                    input IPSEC_LB;
                }
                address $AC_ADDR_V4;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-ae-flexible-vlan-tagging-mtu-9192-flexible-ethernet-services-lacp-fast`
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-gigether`

## junos/interfaces/ifl-vlan-inet.conf

```
/*
 * Topic: Single-tagged routed logical interface carrying an IPv4 customer address
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304 mx1_mx304 srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 2
 *   mx1_mx304 13
 *   srx1a_srx4600 3
 *   srx1b_srx4600 3
 *   srx2a_srx4600 3
 *   srx2b_srx4600 3
 *   total 27
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $IFD         e.g. ae10
 *   $UNIT        e.g. 40
 *   $VLAN        e.g. 40
 *   $AC_ADDR_V4  e.g. 172.16.1.2/30
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
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-ae-flexible-vlan-tagging-mtu-9192-flexible-ethernet-services-lacp-fast`, `interfaces/ifd-ae-vlan-tagging-mtu-9130-lacp-fast`
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-gigether`

## junos/policy-options/condition/condition-if-route-exists-mnha-vr-active-signal-route.conf

```
/*
 * Topic: Condition true while the MNHA active signal route 192.168.255.0/32 exists in MNHA-VR.inet.0
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 4
 * Pair with:
 *  - junos/routing-instances/virtual-router/ri-mnha-vr-ebgp-icl-bfd.conf
 *
 * Peers with: n/a
 * Variables (example values from srx1a_srx4600):
 *   $CONDITION_NAME  e.g. active_route_exists
 */
policy-options {
    condition $CONDITION_NAME {
        if-route-exists {
            address-family {
                inet {
                    192.168.255.0/32;
                    table MNHA-VR.inet.0;
                }
            }
        }
    }
}
```

## junos/policy-options/condition/condition-if-route-exists-mnha-vr-backup-signal-route.conf

```
/*
 * Topic: Condition true while the MNHA backup signal route 192.168.255.1/32 exists in MNHA-VR.inet.0
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 4
 * Pair with:
 *  - junos/routing-instances/virtual-router/ri-mnha-vr-ebgp-icl-bfd.conf
 *
 * Peers with: n/a
 * Variables (example values from srx1a_srx4600):
 *   $CONDITION_NAME  e.g. backup_route_exists
 */
policy-options {
    condition $CONDITION_NAME {
        if-route-exists {
            address-family {
                inet {
                    192.168.255.1/32;
                    table MNHA-VR.inet.0;
                }
            }
        }
    }
}
```

## junos/policy-options/policy-statement/per-packet-load-balance-no-term.conf

```
/*
 * Topic: Per-packet load-balancing policy without terms
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304 srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 5
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $PPLB_NAME  e.g. ECMP_POLICY-LB
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
 *   $PPLB_NAME  e.g. pplb
 *   $TERM_NAME  e.g. t1
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

## junos/policy-options/policy-statement/ps-ari-ts-signal-condition-as-path-prepend-1-or-2-reject.conf

```
/*
 * Topic: Policy exporting ARI traffic-selector routes unchanged while the active signal route exists, with one AS-path prepend while the backup signal route exists and with two otherwise; rejecting everything else
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
 *   - The prepend length follows the node's SRG 1 state, so the MX prefers the active node for the initiators' protected prefixes.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from srx1a_srx4600):
 *   $BGP_EXPORT_POL    e.g. ari_export_untrust
 *   $TERM_NAME_1       e.g. 1
 *   $CONDITION_NAME_1  e.g. active_route_exists
 *   $TERM_NAME_2       e.g. 2
 *   $CONDITION_NAME_2  e.g. backup_route_exists
 *   $TERM_NAME_3       e.g. 3
 *   $TERM_NAME_4       e.g. default
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                protocol ari-ts;
                condition $CONDITION_NAME_1;
            }
            then accept;
        }
        term $TERM_NAME_2 {
            from {
                protocol ari-ts;
                condition $CONDITION_NAME_2;
            }
            then {
                as-path-prepend 65000;
                accept;
            }
        }
        term $TERM_NAME_3 {
            from protocol ari-ts;
            then {
                as-path-prepend "65000 65000";
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
- `condition` (`$CONDITION_NAME_1`, `$CONDITION_NAME_2`): required, for each reference; one of `policy-options/condition/condition-if-route-exists-mnha-vr-active-signal-route`, `policy-options/condition/condition-if-route-exists-mnha-vr-backup-signal-route`

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

## junos/policy-options/policy-statement/ps-bgp-route-filter-list-next-hop-self-accept-reject.conf

```
/*
 * Topic: Policy accepting BGP routes in a route-filter list with next-hop self and rejecting everything else
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $BGP_EXPORT_POL     e.g. ipsec_ari_route_export
 *   $TERM_NAME_1        e.g. 1
 *   $ROUTE_FILTER_LIST  e.g. ari_route_rt_list
 *   $TERM_NAME_2        e.g. 3
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                protocol bgp;
                route-filter-list $ROUTE_FILTER_LIST;
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `route-filter-list` (`$ROUTE_FILTER_LIST`): required, for each reference; `policy-options/route-filter-list/rfl-inet-1-orlonger`

## junos/policy-options/policy-statement/ps-bgp-static-next-hop-self-accept-reject.conf

```
/*
 * Topic: Policy accepting BGP and static routes with next-hop self and rejecting everything else
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $BGP_EXPORT_POL  e.g. untrust-to-trust-export
 *   $TERM_NAME_1     e.g. 1
 *   $TERM_NAME_2     e.g. 2
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from protocol [ bgp static ];
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

## junos/policy-options/policy-statement/ps-direct-orlonger-accept-reject.conf

```
/*
 * Topic: Policy accepting direct routes within 10.200.0.0/16 (orlonger) and rejecting everything else
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $BGP_EXPORT_POL  e.g. client_to_server_export_mx1
 *   $TERM_NAME_1     e.g. 0
 *   $TERM_NAME_2     e.g. t1
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                protocol direct;
                route-filter 10.200.0.0/16 orlonger;
            }
            then accept;
        }
        term $TERM_NAME_2 {
            then reject;
        }
    }
}
```

## junos/policy-options/policy-statement/ps-direct-route-filter-accept-bgp-route-filter-list-next-hop-self-reject.conf

```
/*
 * Topic: Policy accepting one direct prefix (exact) and, with next-hop self, BGP routes in a route-filter list; rejecting everything else
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $BGP_EXPORT_POL     e.g. MX1-to-SRX_trust_export
 *   $TERM_NAME_1        e.g. lb_hc_source_ip_export
 *   $PREFIX             e.g. 192.168.10.251/32
 *   $TERM_NAME_2        e.g. ike_source_endpoint_route_export
 *   $ROUTE_FILTER_LIST  e.g. ike_source_endpoint_rt_list
 *   $TERM_NAME_3        e.g. reject
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
            from {
                protocol bgp;
                route-filter-list $ROUTE_FILTER_LIST;
            }
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

Needs (MANIFEST.json occurrence_requires; same OS):
- `route-filter-list` (`$ROUTE_FILTER_LIST`): required, for each reference; `policy-options/route-filter-list/rfl-inet-1-orlonger`

## junos/policy-options/policy-statement/ps-prefix-list-signal-condition-as-path-prepend-1-or-2-reject.conf

```
/*
 * Topic: Policy exporting a prefix list unchanged while the active signal route exists, with one AS-path prepend while the backup signal route exists and with two otherwise; rejecting everything else
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
 *   - Exports the node's activeness-probe address (prefix-list active_probe_ip) toward the MX trust side with the same SRG-state preference.
 * Pair with:
 *  - junos/policy-options/prefix-list/prefix-list-active-probe-ip.conf
 *
 * Peers with: n/a
 * Variables (example values from srx1a_srx4600):
 *   $BGP_EXPORT_POL    e.g. loopback_export_trust
 *   $TERM_NAME_1       e.g. 1
 *   $CONDITION_NAME_1  e.g. active_route_exists
 *   $TERM_NAME_2       e.g. 2
 *   $CONDITION_NAME_2  e.g. backup_route_exists
 *   $TERM_NAME_3       e.g. 3
 *   $TERM_NAME_4       e.g. defualt
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                prefix-list active_probe_ip;
                condition $CONDITION_NAME_1;
            }
            then accept;
        }
        term $TERM_NAME_2 {
            from {
                prefix-list active_probe_ip;
                condition $CONDITION_NAME_2;
            }
            then {
                as-path-prepend 65000;
                accept;
            }
        }
        term $TERM_NAME_3 {
            from {
                prefix-list active_probe_ip;
            }
            then {
                as-path-prepend "65000 65000";
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
- `condition` (`$CONDITION_NAME_1`, `$CONDITION_NAME_2`): required, for each reference; one of `policy-options/condition/condition-if-route-exists-mnha-vr-active-signal-route`, `policy-options/condition/condition-if-route-exists-mnha-vr-backup-signal-route`

## junos/policy-options/policy-statement/ps-route-filter-next-hop-self-accept-reject.conf

```
/*
 * Topic: Policy accepting one prefix with next-hop self and rejecting everything else
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

## junos/policy-options/policy-statement/ps-static-default-exact-next-hop-self-accept-reject.conf

```
/*
 * Topic: Policy accepting the static default route (exact) with next-hop self and rejecting everything else
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $BGP_EXPORT_POL  e.g. default_export
 *   $TERM_NAME_1     e.g. 1
 *   $TERM_NAME_2     e.g. 2
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                protocol static;
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

## junos/policy-options/policy-statement/ps-static-route-filter-exact-accept-reject.conf

```
/*
 * Topic: Policy accepting one static prefix (exact) and rejecting everything else
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $POLICY_NAME  e.g. server_to_client_export_mx1
 *   $TERM_NAME_1  e.g. t0
 *   $PREFIX       e.g. 172.160.0.0/16
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

## junos/policy-options/policy-statement/ps-static-server-and-default-exact-accept-reject.conf

```
/*
 * Topic: Policy accepting the static 172.160.0.0/16 and default routes (exact) and rejecting everything else
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $POLICY_NAME  e.g. server_to_client_export
 *   $TERM_NAME_1  e.g. t0
 *   $TERM_NAME_2  e.g. t1
 *   $TERM_NAME_3  e.g. t2
 */
policy-options {
    policy-statement $POLICY_NAME {
        term $TERM_NAME_1 {
            from {
                protocol static;
                route-filter 172.160.0.0/16 exact;
            }
            then accept;
        }
        term $TERM_NAME_2 {
            from {
                protocol static;
                route-filter 0.0.0.0/0 exact;
            }
            then accept;
        }
        term $TERM_NAME_3 {
            then reject;
        }
    }
}
```

## junos/policy-options/prefix-list/prefix-list-active-probe-ip.conf

```
/*
 * Topic: Prefix list active_probe_ip with one prefix (the MNHA pair's activeness-probe address)
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
 *   $PREFIX  e.g. 192.168.10.1/32
 */
policy-options {
    prefix-list active_probe_ip {
        $PREFIX;
    }
}
```

## junos/policy-options/prefix-list/prefix-list-ike-lo0.conf

```
/*
 * Topic: Prefix list ike_lo0 with the IKE anycast address 10.100.0.1/32
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
 * Variables: none
 */
policy-options {
    prefix-list ike_lo0 {
        10.100.0.1/32;
    }
}
```

## junos/policy-options/prefix-list/prefix-list-mnha-lo0.conf

```
/*
 * Topic: Prefix list mnha_lo0 with one prefix
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
 *   $PREFIX  e.g. 192.168.0.1/32
 */
policy-options {
    prefix-list mnha_lo0 {
        $PREFIX;
    }
}
```

## junos/policy-options/route-filter-list/rfl-inet-1-orlonger.conf

```
/*
 * Topic: Route-filter list with one IPv4 prefix (orlonger)
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 2
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $ROUTE_FILTER_LIST  e.g. ike_source_endpoint_rt_list
 *   $PREFIX             e.g. 10.200.0.0/16
 */
policy-options {
    route-filter-list $ROUTE_FILTER_LIST {
        $PREFIX orlonger;
    }
}
```

## junos/protocols/bgp-group-srx-to-mx-trust-ebgp-bfd.conf

```
/*
 * Topic: eBGP group SRX-to-MX_TRUST with one neighbor, a local AS and BFD
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
 *   $BGP_EXPORT_POL  e.g. loopback_export_trust
 *   $ASN             e.g. 65000
 *   $CE_PEER_V4      e.g. 10.1.1.1
 *   $PE_LOCAL_V4     e.g. 10.1.1.2
 *   $ASN_CUSTOMER    e.g. 65200
 */
protocols {
    bgp {
        group SRX-to-MX_TRUST {
            type external;
            export $BGP_EXPORT_POL;
            local-as $ASN;
            bfd-liveness-detection {
                minimum-interval 300;
                minimum-receive-interval 300;
                multiplier 3;
            }
            neighbor $CE_PEER_V4 {
                local-address $PE_LOCAL_V4;
                peer-as $ASN_CUSTOMER;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$BGP_EXPORT_POL`): required, for each reference; `policy-options/policy-statement/ps-prefix-list-signal-condition-as-path-prepend-1-or-2-reject`

## junos/protocols/bgp-group-srx-to-mx-untrust-ebgp-bfd.conf

```
/*
 * Topic: eBGP group SRX-to-MX_UNTRUST with one neighbor, a local AS and BFD
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
 *   $BGP_EXPORT_POL  e.g. ari_export_untrust
 *   $ASN             e.g. 65000
 *   $CE_PEER_V4      e.g. 10.2.1.1
 *   $PE_LOCAL_V4     e.g. 10.2.1.2
 *   $ASN_CUSTOMER    e.g. 65400
 */
protocols {
    bgp {
        group SRX-to-MX_UNTRUST {
            type external;
            export $BGP_EXPORT_POL;
            local-as $ASN;
            bfd-liveness-detection {
                minimum-interval 300;
                minimum-receive-interval 300;
                multiplier 3;
            }
            neighbor $CE_PEER_V4 {
                local-address $PE_LOCAL_V4;
                peer-as $ASN_CUSTOMER;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$BGP_EXPORT_POL`): required, for each reference; `policy-options/policy-statement/ps-ari-ts-signal-condition-as-path-prepend-1-or-2-reject`

## junos/protocols/bgp-multipath.conf

```
/*
 * Topic: BGP multipath
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
 * Variables: none
 */
protocols {
    bgp {
        multipath;
    }
}
```

## junos/protocols/lldp-port-id-interface-name-interface-all.conf

```
/*
 * Topic: LLDP on all interfaces with the interface name as port ID
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
 * Variables: none
 */
protocols {
    lldp {
        port-id-subtype interface-name;
        interface all;
    }
}
```

## junos/routing-instances/forwarding/ri-srx-tproxy-fi.conf

```
/*
 * Topic: Forwarding instance srx-tproxy-fi
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Highlights:
 *   - Target of the IPSEC_LB filter and routing instance of the TLB virtual service.
 * Pair with: none
 * Variables: none
 */
routing-instances {
    srx-tproxy-fi {
        instance-type forwarding;
    }
}
```

## junos/routing-instances/virtual-router/ri-client-static-next-hop-ams-inside-st0.conf

```
/*
 * Topic: client virtual router with a static route to the client prefix, the AMS inside units and the st0 tunnel units
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   total 1
 * Pair with: none
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $NEXT_HOP_V4  e.g. 172.16.8.1
 *   $IFL_1        e.g. et-0/1/2.0
 *   $IFL_2        e.g. ams1.1
 *   $IFL_3        e.g. ams1.2
 *   $IFL_4        e.g. ams1.3
 *   $IFL_5        e.g. ams1.4
 *   $IFL_6        e.g. ams1.5
 *   $IFL_7        e.g. st0.1
 *   $IFL_8        e.g. st0.2
 *   $IFL_9        e.g. st0.3
 *   $IFL_10       e.g. st0.4
 *   $IFL_11       e.g. st0.5
 */
routing-instances {
    client {
        instance-type virtual-router;
        routing-options {
            static {
                route 172.80.0.0/16 next-hop $NEXT_HOP_V4;
            }
        }
        interface $IFL_1;
        interface $IFL_2;
        interface $IFL_3;
        interface $IFL_4;
        interface $IFL_5;
        interface $IFL_6;
        interface $IFL_7;
        interface $IFL_8;
        interface $IFL_9;
        interface $IFL_10;
        interface $IFL_11;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$IFL_1`, `$IFL_2`, `$IFL_3`, `$IFL_4`, `$IFL_5`, `$IFL_6`, `$IFL_7`, `$IFL_8`, `$IFL_9`, `$IFL_10`, `$IFL_11`): required, for each reference; one of `interfaces/ifl-ams-inside-disable-hash`, `interfaces/ifl-unit-0-inet`, `interfaces/ifl-unit-inet`

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

## junos/routing-instances/virtual-router/ri-trust-vr-as-static-next-hop-ebgp-1-group.conf

```
/*
 * Topic: TRUST_VR virtual router with its own AS, a static route to the server prefix and one eBGP group with BFD
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   total 1
 * Pair with: none
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $ASN             e.g. 2500
 *   $NEXT_HOP_V4     e.g. 172.16.10.1
 *   $BGP_EXPORT_POL  e.g. server_to_client_export_mx1
 *   $ASN_CUSTOMER    e.g. 65400
 *   $ASN_LOCAL       e.g. 65300
 *   $CE_PEER_V4      e.g. 172.16.2.1
 *   $IFL_1           e.g. et-0/1/5.0
 *   $IFL_2           e.g. ae10.80
 */
routing-instances {
    TRUST_VR {
        instance-type virtual-router;
        routing-options {
            autonomous-system $ASN;
            static {
                route 172.160.0.0/16 next-hop $NEXT_HOP_V4;
            }
        }
        protocols {
            bgp {
                group Untrust_GW-to-MX2_Untrust {
                    type external;
                    export $BGP_EXPORT_POL;
                    peer-as $ASN_CUSTOMER;
                    local-as $ASN_LOCAL;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4;
                }
                multipath;
            }
        }
        interface $IFL_1;
        interface $IFL_2;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$IFL_1`, `$IFL_2`): required, for each reference; one of `interfaces/ifl-unit-0-inet`, `interfaces/ifl-vlan-inet`
- `policy-statement` (`$BGP_EXPORT_POL`): required, for each reference; `policy-options/policy-statement/ps-static-route-filter-exact-accept-reject`

## junos/routing-instances/virtual-router/ri-trust-vr-static-discard-default-ebgp-srx-4-neighbors-gateway.conf

```
/*
 * Topic: TRUST_VR virtual router with a static discard default route, an eBGP group to the four SRX nodes (as-override) and an eBGP group to the gateway, BFD on both
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with: none
 * Variables (example values from mx1_mx304):
 *   $BGP_EXPORT_POL_1  e.g. MX1-to-SRX_trust_export
 *   $ASN_CUSTOMER_1    e.g. 65000
 *   $ASN               e.g. 65200
 *   $CE_PEER_V4_1      e.g. 10.1.1.2
 *   $DESCRIPTION_1     e.g. "to SRX1A"
 *   $CE_PEER_V4_2      e.g. 10.1.2.2
 *   $DESCRIPTION_2     e.g. "to SRX1B"
 *   $CE_PEER_V4_3      e.g. 10.1.3.2
 *   $DESCRIPTION_3     e.g. "to SRX2A"
 *   $CE_PEER_V4_4      e.g. 10.1.4.2
 *   $DESCRIPTION_4     e.g. "to SRX2B"
 *   $BGP_EXPORT_POL_2  e.g. default_export
 *   $ASN_CUSTOMER_2    e.g. 65100
 *   $CE_PEER_V4_5      e.g. 172.16.1.2
 *   $IFL_1             e.g. ae1.0
 *   $IFL_2             e.g. ae2.0
 *   $IFL_3             e.g. ae3.0
 *   $IFL_4             e.g. ae4.0
 *   $IFL_5             e.g. ae10.40
 *   $LOOPBACK_IFL      e.g. lo0.1
 */
routing-instances {
    TRUST_VR {
        instance-type virtual-router;
        routing-options {
            static {
                route 0.0.0.0/0 discard;
            }
        }
        protocols {
            bgp {
                group MX1-to-SRX {
                    type external;
                    export $BGP_EXPORT_POL_1;
                    peer-as $ASN_CUSTOMER_1;
                    local-as $ASN;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    as-override;
                    neighbor $CE_PEER_V4_1 {
                        description $DESCRIPTION_1;
                    }
                    neighbor $CE_PEER_V4_2 {
                        description $DESCRIPTION_2;
                    }
                    neighbor $CE_PEER_V4_3 {
                        description $DESCRIPTION_3;
                    }
                    neighbor $CE_PEER_V4_4 {
                        description $DESCRIPTION_4;
                    }
                }
                group MX2-to-GW_Router {
                    type external;
                    export $BGP_EXPORT_POL_2;
                    peer-as $ASN_CUSTOMER_2;
                    local-as $ASN;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4_5;
                }
                multipath;
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
- `logical-interface` (`$IFL_1`, `$IFL_2`, `$IFL_3`, `$IFL_4`, `$IFL_5`, `$LOOPBACK_IFL`): required, for each reference; one of `interfaces/ifl-loopback-inet`, `interfaces/ifl-vlan-inet-input-filter-ipsec-lb`, `interfaces/ifl-vlan-inet`
- `policy-statement` (`$BGP_EXPORT_POL_1`, `$BGP_EXPORT_POL_2`): required, for each reference; one of `policy-options/policy-statement/ps-direct-route-filter-accept-bgp-route-filter-list-next-hop-self-reject`, `policy-options/policy-statement/ps-static-default-exact-next-hop-self-accept-reject`

## junos/routing-instances/virtual-router/ri-untrust-vr-as-ebgp-1-group-ams-outside-lo0.conf

```
/*
 * Topic: UNTRUST_VR virtual router with its own AS, one eBGP group with BFD, the AMS outside units and lo0.0
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   total 1
 * Pair with:
 *  - junos/interfaces/ifl-loopback-inet-5-addresses.conf
 *
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $ASN             e.g. 65100
 *   $BGP_EXPORT_POL  e.g. client_to_server_export_mx1
 *   $ASN_CUSTOMER    e.g. 65200
 *   $CE_PEER_V4      e.g. 172.16.1.1
 *   $IFL_1           e.g. ae10.40
 *   $IFL_2           e.g. ams1.2001
 *   $IFL_3           e.g. ams1.2002
 *   $IFL_4           e.g. ams1.2003
 *   $IFL_5           e.g. ams1.2004
 *   $IFL_6           e.g. ams1.2005
 */
routing-instances {
    UNTRUST_VR {
        instance-type virtual-router;
        routing-options {
            autonomous-system $ASN;
        }
        protocols {
            bgp {
                group trust_GW-to-MX2_trust {
                    type external;
                    export $BGP_EXPORT_POL;
                    peer-as $ASN_CUSTOMER;
                    local-as $ASN;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4;
                }
                multipath;
            }
        }
        interface $IFL_1;
        interface $IFL_2;
        interface $IFL_3;
        interface $IFL_4;
        interface $IFL_5;
        interface $IFL_6;
        interface lo0.0;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$IFL_1`, `$IFL_2`, `$IFL_3`, `$IFL_4`, `$IFL_5`, `$IFL_6`): required, for each reference; one of `interfaces/ifl-ams-outside-disable-hash`, `interfaces/ifl-vlan-inet`
- `policy-statement` (`$BGP_EXPORT_POL`): required, for each reference; `policy-options/policy-statement/ps-direct-orlonger-accept-reject`

## junos/routing-instances/virtual-router/ri-untrust-vr-ebgp-srx-4-neighbors-gateway.conf

```
/*
 * Topic: UNTRUST_VR virtual router with an eBGP group to the four SRX nodes and an eBGP group to the gateway, BFD on both
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Pair with: none
 * Variables (example values from mx1_mx304):
 *   $BGP_EXPORT_POL_1  e.g. untrust-to-trust-export
 *   $ASN_CUSTOMER_1    e.g. 65000
 *   $ASN               e.g. 65400
 *   $CE_PEER_V4_1      e.g. 10.2.1.2
 *   $DESCRIPTION_1     e.g. "to SRX1A"
 *   $CE_PEER_V4_2      e.g. 10.2.2.2
 *   $DESCRIPTION_2     e.g. "to SRX1B"
 *   $CE_PEER_V4_3      e.g. 10.2.3.2
 *   $DESCRIPTION_3     e.g. "to SRX2A"
 *   $CE_PEER_V4_4      e.g. 10.2.4.2
 *   $DESCRIPTION_4     e.g. "to SRX2B"
 *   $BGP_EXPORT_POL_2  e.g. ipsec_ari_route_export
 *   $ASN_CUSTOMER_2    e.g. 65300
 *   $CE_PEER_V4_5      e.g. 172.16.2.2
 *   $IFL_1             e.g. ae1.1
 *   $IFL_2             e.g. ae2.1
 *   $IFL_3             e.g. ae3.1
 *   $IFL_4             e.g. ae4.1
 *   $IFL_5             e.g. ae10.80
 */
routing-instances {
    UNTRUST_VR {
        instance-type virtual-router;
        protocols {
            bgp {
                group MX1-to-SRX {
                    type external;
                    export $BGP_EXPORT_POL_1;
                    peer-as $ASN_CUSTOMER_1;
                    local-as $ASN;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4_1 {
                        description $DESCRIPTION_1;
                    }
                    neighbor $CE_PEER_V4_2 {
                        description $DESCRIPTION_2;
                    }
                    neighbor $CE_PEER_V4_3 {
                        description $DESCRIPTION_3;
                    }
                    neighbor $CE_PEER_V4_4 {
                        description $DESCRIPTION_4;
                    }
                }
                group MX2-to-UNTRUST_GW_Router {
                    type external;
                    export $BGP_EXPORT_POL_2;
                    peer-as $ASN_CUSTOMER_2;
                    local-as $ASN;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor $CE_PEER_V4_5;
                }
            }
        }
        interface $IFL_1;
        interface $IFL_2;
        interface $IFL_3;
        interface $IFL_4;
        interface $IFL_5;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$IFL_1`, `$IFL_2`, `$IFL_3`, `$IFL_4`, `$IFL_5`): required, for each reference; `interfaces/ifl-vlan-inet`
- `policy-statement` (`$BGP_EXPORT_POL_1`, `$BGP_EXPORT_POL_2`): required, for each reference; one of `policy-options/policy-statement/ps-bgp-route-filter-list-next-hop-self-accept-reject`, `policy-options/policy-statement/ps-bgp-static-next-hop-self-accept-reject`

## junos/routing-options/autonomous-system.conf

```
/*
 * Topic: Device autonomous-system number
 * Seen on:
 *   Junos: mx1_mx304 srx1b_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   srx1b_srx4600 1
 *   srx2b_srx4600 1
 *   total 3
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from mx1_mx304):
 *   $ASN  e.g. 10000
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
 *   Junos: ipsec_initiator_gateway_mx304 mx1_mx304 srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   mx1_mx304 1
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $PPLB_NAME  e.g. ECMP_POLICY-LB
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$PPLB_NAME`): required, for each reference; one of `policy-options/policy-statement/per-packet-load-balance-no-term`, `policy-options/policy-statement/per-packet-load-balance-term-accept`

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

## junos/security/address-book-global-mnha-ike-ipsec-client-server.conf

```
/*
 * Topic: Global address book with the MNHA loopback, IKE source, IPsec client and IPsec server prefixes
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
 *   - Entry names embed their prefix; the security policies match these names.
 * Pair with: none
 * Variables: none
 */
security {
    address-book {
        global {
            address mnha_lo0_prefix_192.168.0.0/24 192.168.0.0/24;
            address ike_source_prefix_10.200.0.0/16 10.200.0.0/16;
            address ipsec_data_client_prefix_172.80.0.0/16 172.80.0.0/16;
            address ipsec_data_server_prefix_172.160.0.0/16 172.160.0.0/16;
        }
    }
}
```

## junos/security/distribution-profile-fat-core.conf

```
/*
 * Topic: Security distribution profile fat-core
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304 srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   srx1a_srx4600 1
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 5
 * Pair with: none
 * Variables: none
 */
security {
    distribution-profile {
        fat-core;
    }
}
```

## junos/security/flow-drop-flow-timeout-30.conf

```
/*
 * Topic: Drop-flow timeout of 30 seconds
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
 * Variables: none
 */
security {
    flow {
        drop-flow {
            timeout 30;
        }
    }
}
```

## junos/security/flow-power-mode-ipsec.conf

```
/*
 * Topic: Flow power mode for IPsec (power-mode-ipsec)
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
security {
    flow {
        power-mode-ipsec;
    }
}
```

## junos/security/ike-autovpn-responder-group-ike-id-mnha-icl.conf

```
/*
 * Topic: IKEv2 AutoVPN responder (dynamic hostname, group IKE ID) on the lo0.1 anycast address 10.100.0.1, and the MNHA inter-chassis link IKE gateway
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
 *   - All four SRX nodes carry the same responder identity (vsrx.juniper.net) and anycast local address, so whichever MNHA pair the MX TLB selects terminates the initiator on its active node.
 *   - L3HA_IKE_GW has no address of its own: MNHA uses it through the L3HA_IPSEC_VPN `ha-link-encryption` VPN for the inter-chassis link.
 * Pair with:
 *  - junos/interfaces/ifl-loopback-inet-two-addresses.conf
 *
 * Variables (example values from srx1a_srx4600):
 *   $IKE_PSK_1  e.g. "<IKE_PSK>"
 *   $IKE_PSK_2  e.g. "<IKE_PSK>"
 */
security {
    ike {
        proposal IKE_PROP {
            authentication-method pre-shared-keys;
            dh-group group2;
            authentication-algorithm sha1;
            encryption-algorithm aes-256-cbc;
            lifetime-seconds 3600;
        }
        proposal L3HA_IKE_PROP {
            description l3ha_link_encr_tunnel;
            authentication-method pre-shared-keys;
            dh-group group14;
            authentication-algorithm sha-256;
            encryption-algorithm aes-256-cbc;
            lifetime-seconds 3600;
        }
        policy IKE_POLICY {
            proposals IKE_PROP;
            pre-shared-key ascii-text $IKE_PSK_1;
        }
        policy L3HA_IKE_POL {
            description l3ha_link_encr_tunnel;
            proposals L3HA_IKE_PROP;
            pre-shared-key ascii-text $IKE_PSK_2;
        }
        gateway avpn_ike_gw {
            ike-policy IKE_POLICY;
            dynamic {
                hostname .juniper.net;
                ike-user-type group-ike-id;
            }
            dead-peer-detection {
                probe-idle-tunnel;
                interval 10;
                threshold 3;
            }
            local-identity hostname vsrx.juniper.net;
            external-interface lo0.1;
            local-address 10.100.0.1;
            version v2-only;
        }
        gateway L3HA_IKE_GW {
            ike-policy L3HA_IKE_POL;
            version v2-only;
        }
    }
}
```

## junos/security/ike-initiator-5-gateways-ikev2-pre-shared-key.conf

```
/*
 * Topic: IKEv2 initiator: one pre-shared-key policy and five gateways to the 10.100.0.1 responder, each with its own local address and hostname identity
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   total 1
 * Highlights:
 *   - Each gateway emulates one remote site (peer1 to peer5.juniper.net); all of them target the SRX IKE anycast address 10.100.0.1 that the MX TLB spreads across the SRX nodes.
 * Pair with:
 *  - junos/interfaces/ifl-loopback-inet-5-addresses.conf
 *
 * Variables (example values from ipsec_initiator_gateway_mx304):
 *   $IKE_PSK  e.g. "<IKE_PSK>"
 */
security {
    ike {
        proposal IKE_PROP {
            authentication-method pre-shared-keys;
            dh-group group2;
            authentication-algorithm sha1;
            encryption-algorithm aes-256-cbc;
            lifetime-seconds 3600;
        }
        policy IKE_POLICY {
            proposals IKE_PROP;
            pre-shared-key ascii-text $IKE_PSK;
        }
        gateway IKE_GW_1 {
            ike-policy IKE_POLICY;
            address 10.100.0.1;
            dead-peer-detection {
                probe-idle-tunnel;
                interval 10;
                threshold 3;
            }
            local-identity hostname peer1.juniper.net;
            remote-identity hostname vsrx.juniper.net;
            external-interface lo0.0;
            local-address 10.200.0.1;
            version v2-only;
        }
        gateway IKE_GW_2 {
            ike-policy IKE_POLICY;
            address 10.100.0.1;
            dead-peer-detection {
                probe-idle-tunnel;
                interval 10;
                threshold 3;
            }
            local-identity hostname peer2.juniper.net;
            remote-identity hostname vsrx.juniper.net;
            external-interface lo0.0;
            local-address 10.200.0.2;
            version v2-only;
        }
        gateway IKE_GW_3 {
            ike-policy IKE_POLICY;
            address 10.100.0.1;
            dead-peer-detection {
                probe-idle-tunnel;
                interval 10;
                threshold 3;
            }
            local-identity hostname peer3.juniper.net;
            remote-identity hostname vsrx.juniper.net;
            external-interface lo0.0;
            local-address 10.200.0.3;
            version v2-only;
        }
        gateway IKE_GW_4 {
            ike-policy IKE_POLICY;
            address 10.100.0.1;
            dead-peer-detection {
                probe-idle-tunnel;
                interval 10;
                threshold 3;
            }
            local-identity hostname peer4.juniper.net;
            remote-identity hostname vsrx.juniper.net;
            external-interface lo0.0;
            local-address 10.200.0.4;
            version v2-only;
        }
        gateway IKE_GW_5 {
            ike-policy IKE_POLICY;
            address 10.100.0.1;
            dead-peer-detection {
                probe-idle-tunnel;
                interval 10;
                threshold 3;
            }
            local-identity hostname peer5.juniper.net;
            remote-identity hostname vsrx.juniper.net;
            external-interface lo0.0;
            local-address 10.200.0.5;
            version v2-only;
        }
    }
}
```

## junos/security/ipsec-autovpn-st0-1-mnha-icl-link-encryption-aes-256-gcm.conf

```
/*
 * Topic: IPsec AutoVPN bound to st0.1 with a 0.0.0.0/0 traffic selector and the MNHA inter-chassis link encryption VPN, both AES-256-GCM
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
 *   - The `traffic-selector` installs auto route insertion (ARI) routes for the initiators' protected prefixes; the untrust export policy advertises them (`protocol ari-ts`).
 * Pair with:
 *  - junos/interfaces/ifl-unit-inet.conf
 *  - junos/security/ike-autovpn-responder-group-ike-id-mnha-icl.conf
 *
 * Variables: none
 */
security {
    ipsec {
        proposal IPSEC_PROP {
            protocol esp;
            encryption-algorithm aes-256-gcm;
            lifetime-seconds 3600;
        }
        proposal L3HA_IPSEC_PROP {
            description l3ha_link_encr_tunnel;
            protocol esp;
            encryption-algorithm aes-256-gcm;
            lifetime-seconds 3600;
        }
        policy IPSEC_POLICY {
            proposals IPSEC_PROP;
        }
        policy L3HA_IPSEC_POL {
            description l3ha_link_encr_tunnel;
            proposals L3HA_IPSEC_PROP;
        }
        vpn avpn_ipsec_vpn {
            bind-interface st0.1;
            ike {
                gateway avpn_ike_gw;
                ipsec-policy IPSEC_POLICY;
            }
            traffic-selector ts {
                local-ip 0.0.0.0/0;
                remote-ip 0.0.0.0/0;
            }
        }
        vpn L3HA_IPSEC_VPN {
            ha-link-encryption;
            ike {
                gateway L3HA_IKE_GW;
                ipsec-policy L3HA_IPSEC_POL;
            }
        }
        anti-replay-window-size 512;
    }
}
```

## junos/security/ipsec-initiator-5-vpns-aes-256-gcm-establish-immediately.conf

```
/*
 * Topic: IPsec initiator: five route-based VPNs on st0.1 to st0.5 with AES-256-GCM, one host traffic selector each, established immediately
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   total 1
 * Pair with:
 *  - junos/interfaces/ifl-unit-inet.conf
 *  - junos/security/ike-initiator-5-gateways-ikev2-pre-shared-key.conf
 *
 * Variables: none
 */
security {
    ipsec {
        proposal IPSEC_PROP {
            protocol esp;
            encryption-algorithm aes-256-gcm;
            lifetime-seconds 3600;
        }
        policy IPSEC_POLICY {
            proposals IPSEC_PROP;
        }
        vpn TUN_1 {
            bind-interface st0.1;
            ike {
                gateway IKE_GW_1;
                ipsec-policy IPSEC_POLICY;
            }
            traffic-selector ts1 {
                local-ip 172.80.0.1/32;
                remote-ip 172.160.0.1/32;
            }
            establish-tunnels immediately;
        }
        vpn TUN_2 {
            bind-interface st0.2;
            ike {
                gateway IKE_GW_2;
                ipsec-policy IPSEC_POLICY;
            }
            traffic-selector ts1 {
                local-ip 172.80.0.2/32;
                remote-ip 172.160.0.2/32;
            }
            establish-tunnels immediately;
        }
        vpn TUN_3 {
            bind-interface st0.3;
            ike {
                gateway IKE_GW_3;
                ipsec-policy IPSEC_POLICY;
            }
            traffic-selector ts1 {
                local-ip 172.80.0.3/32;
                remote-ip 172.160.0.3/32;
            }
            establish-tunnels immediately;
        }
        vpn TUN_4 {
            bind-interface st0.4;
            ike {
                gateway IKE_GW_4;
                ipsec-policy IPSEC_POLICY;
            }
            traffic-selector ts1 {
                local-ip 172.80.0.4/32;
                remote-ip 172.160.0.4/32;
            }
            establish-tunnels immediately;
        }
        vpn TUN_5 {
            bind-interface st0.5;
            ike {
                gateway IKE_GW_5;
                ipsec-policy IPSEC_POLICY;
            }
            traffic-selector ts1 {
                local-ip 172.80.0.5/32;
                remote-ip 172.160.0.5/32;
            }
            establish-tunnels immediately;
        }
        anti-replay-window-size 512;
    }
}
```

## junos/security/policies-intra-zone-esp-block-mnha-icl-ipsec-data.conf

```
/*
 * Topic: Intra-zone security policies: ESP denied and everything else permitted in the VR-1 trust zone, MNHA loopbacks permitted, IPsec client-server data permitted in the untrust zone
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
 *   - Each policy matches global address-book entries and the custom ESP application by name.
 * Pair with:
 *  - junos/applications/application-esp.conf
 *  - junos/security/address-book-global-mnha-ike-ipsec-client-server.conf
 *
 * Variables: none
 */
security {
    policies {
        from-zone vr-1_trust_zone to-zone vr-1_trust_zone {
            policy RE-ESP-BLOCK {
                match {
                    source-address any;
                    destination-address any;
                    application ESP;
                }
                then {
                    deny;
                }
            }
            policy RE-ALLOW {
                match {
                    source-address any;
                    destination-address any;
                    application any;
                }
                then {
                    permit;
                }
            }
        }
        from-zone trust_zone_mnha to-zone trust_zone_mnha {
            policy MNHA-ICL-ALLOW {
                match {
                    source-address mnha_lo0_prefix_192.168.0.0/24;
                    destination-address mnha_lo0_prefix_192.168.0.0/24;
                    application any;
                }
                then {
                    permit;
                }
            }
        }
        from-zone vr-1_untrust_zone to-zone vr-1_untrust_zone {
            policy IPSEC_DATA_C2S_POLICY {
                match {
                    source-address ipsec_data_client_prefix_172.80.0.0/16;
                    destination-address ipsec_data_server_prefix_172.160.0.0/16;
                    application any;
                }
                then {
                    permit;
                }
            }
            policy IPSEC_DATA_S2C_POLICY {
                match {
                    source-address ipsec_data_server_prefix_172.160.0.0/16;
                    destination-address ipsec_data_client_prefix_172.80.0.0/16;
                    application any;
                }
                then {
                    permit;
                }
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `security-zone` (`vr-1_trust_zone`, `trust_zone_mnha`, `vr-1_untrust_zone`): required, for each reference; one of `security/zones-vr-1-trust-any-service-untrust-st0-mnha`, `security/zones-vr-1-trust-untrust-st0-mnha`

## junos/security/zones-vr-1-trust-any-service-untrust-st0-mnha.conf

```
/*
 * Topic: VR-1 trust zone (lo0.1, any host-inbound service), untrust zone (st0.1) and MNHA zone (lo0.0), all host-inbound protocols
 * Seen on:
 *   Junos: srx1b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1b_srx4600 1
 *   total 1
 * Highlights:
 *   - The untrust zone holds the st0.1 AutoVPN tunnel; trust_zone_mnha holds lo0.0 and the MNHA-VR inter-chassis unit.
 * Pair with:
 *  - junos/interfaces/ifl-loopback-inet-primary.conf
 *  - junos/interfaces/ifl-loopback-inet-two-addresses.conf
 *  - junos/interfaces/ifl-unit-inet.conf
 *  - junos/interfaces/ifl-vlan-inet.conf
 *
 * Variables: none
 */
security {
    zones {
        security-zone vr-1_trust_zone {
            host-inbound-traffic {
                system-services {
                    any-service;
                }
                protocols {
                    all;
                }
            }
            interfaces {
                ae1.0;
                lo0.1;
            }
        }
        security-zone vr-1_untrust_zone {
            host-inbound-traffic {
                system-services {
                    all;
                }
                protocols {
                    all;
                }
            }
            interfaces {
                st0.1;
                ae1.1;
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
                ae1.100;
                lo0.0;
            }
        }
    }
}
```

## junos/security/zones-vr-1-trust-untrust-st0-mnha.conf

```
/*
 * Topic: VR-1 trust zone (lo0.1), untrust zone (st0.1) and MNHA zone (lo0.0), all host-inbound services and protocols
 * Seen on:
 *   Junos: srx1a_srx4600 srx2a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx2a_srx4600 1
 *   srx2b_srx4600 1
 *   total 3
 * Highlights:
 *   - The untrust zone holds the st0.1 AutoVPN tunnel; trust_zone_mnha holds lo0.0 and the MNHA-VR inter-chassis unit.
 * Pair with:
 *  - junos/interfaces/ifl-loopback-inet-primary.conf
 *  - junos/interfaces/ifl-loopback-inet-two-addresses.conf
 *  - junos/interfaces/ifl-unit-inet.conf
 *  - junos/interfaces/ifl-vlan-inet.conf
 *
 * Variables: none
 */
security {
    zones {
        security-zone vr-1_trust_zone {
            host-inbound-traffic {
                system-services {
                    all;
                }
                protocols {
                    all;
                }
            }
            interfaces {
                ae1.0;
                lo0.1;
            }
        }
        security-zone vr-1_untrust_zone {
            host-inbound-traffic {
                system-services {
                    all;
                }
                protocols {
                    all;
                }
            }
            interfaces {
                st0.1;
                ae1.1;
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
                ae1.100;
                lo0.0;
            }
        }
    }
}
```

## junos/services/application-identification.conf

```
/*
 * Topic: Application identification enabled
 * Seen on:
 *   Junos: srx2a_srx4600
 *   EVO: (none)
 * Count:
 *   srx2a_srx4600 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
services {
    application-identification;
}
```

## junos/services/network-monitoring-icmp-tcp-8088-profiles-5-failure-retries.conf

```
/*
 * Topic: Network-monitoring ICMP and TCP port 8088 health-check profiles with 1-second probes, 5 failure retries and 1 recovery retry
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
            failure-retries 5;
            recovery-retries 1;
        }
        profile tcp-profile1 {
            tcp {
                port 8088;
            }
            probe-interval 1;
            failure-retries 5;
            recovery-retries 1;
        }
    }
}
```

## junos/services/service-set-ipsec-tun-1.conf

```
/*
 * Topic: Next-hop service-set IPSEC_TUN_1 for IPsec VPN TUN_1 on AMS units ams1.1 (inside) and ams1.2001 (outside)
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   total 1
 * Pair with:
 *  - junos/interfaces/ifl-ams-inside-disable-hash.conf
 *  - junos/interfaces/ifl-ams-outside-disable-hash.conf
 *  - junos/security/ipsec-initiator-5-vpns-aes-256-gcm-establish-immediately.conf
 *
 * Variables: none
 */
services {
    service-set IPSEC_TUN_1 {
        next-hop-service {
            inside-service-interface ams1.1;
            outside-service-interface ams1.2001;
        }
        ipsec-vpn TUN_1;
    }
}
```

## junos/services/service-set-ipsec-tun-2.conf

```
/*
 * Topic: Next-hop service-set IPSEC_TUN_2 for IPsec VPN TUN_2 on AMS units ams1.2 (inside) and ams1.2002 (outside)
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   total 1
 * Pair with:
 *  - junos/interfaces/ifl-ams-inside-disable-hash.conf
 *  - junos/interfaces/ifl-ams-outside-disable-hash.conf
 *  - junos/security/ipsec-initiator-5-vpns-aes-256-gcm-establish-immediately.conf
 *
 * Variables: none
 */
services {
    service-set IPSEC_TUN_2 {
        next-hop-service {
            inside-service-interface ams1.2;
            outside-service-interface ams1.2002;
        }
        ipsec-vpn TUN_2;
    }
}
```

## junos/services/service-set-ipsec-tun-3.conf

```
/*
 * Topic: Next-hop service-set IPSEC_TUN_3 for IPsec VPN TUN_3 on AMS units ams1.3 (inside) and ams1.2003 (outside)
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   total 1
 * Pair with:
 *  - junos/interfaces/ifl-ams-inside-disable-hash.conf
 *  - junos/interfaces/ifl-ams-outside-disable-hash.conf
 *  - junos/security/ipsec-initiator-5-vpns-aes-256-gcm-establish-immediately.conf
 *
 * Variables: none
 */
services {
    service-set IPSEC_TUN_3 {
        next-hop-service {
            inside-service-interface ams1.3;
            outside-service-interface ams1.2003;
        }
        ipsec-vpn TUN_3;
    }
}
```

## junos/services/service-set-ipsec-tun-4.conf

```
/*
 * Topic: Next-hop service-set IPSEC_TUN_4 for IPsec VPN TUN_4 on AMS units ams1.4 (inside) and ams1.2004 (outside)
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   total 1
 * Pair with:
 *  - junos/interfaces/ifl-ams-inside-disable-hash.conf
 *  - junos/interfaces/ifl-ams-outside-disable-hash.conf
 *  - junos/security/ipsec-initiator-5-vpns-aes-256-gcm-establish-immediately.conf
 *
 * Variables: none
 */
services {
    service-set IPSEC_TUN_4 {
        next-hop-service {
            inside-service-interface ams1.4;
            outside-service-interface ams1.2004;
        }
        ipsec-vpn TUN_4;
    }
}
```

## junos/services/service-set-ipsec-tun-5.conf

```
/*
 * Topic: Next-hop service-set IPSEC_TUN_5 for IPsec VPN TUN_5 on AMS units ams1.5 (inside) and ams1.2005 (outside)
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *   EVO: (none)
 * Count:
 *   ipsec_initiator_gateway_mx304 1
 *   total 1
 * Pair with:
 *  - junos/interfaces/ifl-ams-inside-disable-hash.conf
 *  - junos/interfaces/ifl-ams-outside-disable-hash.conf
 *  - junos/security/ipsec-initiator-5-vpns-aes-256-gcm-establish-immediately.conf
 *
 * Variables: none
 */
services {
    service-set IPSEC_TUN_5 {
        next-hop-service {
            inside-service-interface ams1.5;
            outside-service-interface ams1.2005;
        }
        ipsec-vpn TUN_5;
    }
}
```

## junos/services/traffic-load-balance-instance-ipsec-lb.conf

```
/*
 * Topic: TLB instance ipsec_lb: direct-server-return virtual service for the IKE anycast address 10.100.0.1, hashing on source IP across two SRX real services
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Highlights:
 *   - Filter IPSEC_LB sends traffic for 10.100.0.1 into forwarding instance srx-tproxy-fi, where the virtual service spreads it across the two SRX MNHA pairs; the selected pair answers from the same anycast address (direct server return).
 *   - Each real service is one MNHA pair's activeness-probe address on lo0.1; the group health-checks it with the icmp-profile and tcp-profile1 network-monitoring profiles.
 * Pair with:
 *  - junos/interfaces/ifl-loopback-inet.conf
 *  - junos/routing-instances/forwarding/ri-srx-tproxy-fi.conf
 *  - junos/routing-instances/virtual-router/ri-trust-vr-static-discard-default-ebgp-srx-4-neighbors-gateway.conf
 *  - junos/services/network-monitoring-icmp-tcp-8088-profiles-5-failure-retries.conf
 *
 * Variables (example values from mx1_mx304):
 *   $REAL_SERVICE_V4_1  e.g. 192.168.10.1
 *   $REAL_SERVICE_V4_2  e.g. 192.168.10.2
 */
services {
    traffic-load-balance {
        instance ipsec_lb {
            interface lo0.1;
            client-vrf TRUST_VR;
            server-vrf TRUST_VR;
            group mnha_srx_group {
                real-services [ MNHA_SRX1 MNHA_SRX2 ];
                routing-instance TRUST_VR;
                network-monitoring-profile [ icmp-profile tcp-profile1 ];
            }
            real-service MNHA_SRX1 {
                address $REAL_SERVICE_V4_1;
            }
            real-service MNHA_SRX2 {
                address $REAL_SERVICE_V4_2;
            }
            virtual-service mnha_srx_vip {
                mode direct-server-return;
                address 10.100.0.1;
                routing-instance srx-tproxy-fi;
                group mnha_srx_group;
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
 *   Junos: srx1b_srx4600 srx2a_srx4600
 *   EVO: (none)
 * Count:
 *   srx1b_srx4600 1
 *   srx2a_srx4600 1
 *   total 2
 * Pair with: none
 * Variables (example values from srx1b_srx4600):
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

## junos/system/authentication-order-password-radius.conf

```
/*
 * Topic: Authentication order: local password, then RADIUS
 * Seen on:
 *   Junos: srx1a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx2b_srx4600 1
 *   total 2
 * Pair with: none
 * Variables: none
 */
system {
    authentication-order [ password radius ];
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

## junos/system/debugger-on-break.conf

```
/*
 * Topic: Kernel debugger entered on a console break
 * Seen on:
 *   Junos: srx1a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx2b_srx4600 1
 *   total 2
 * Pair with: none
 * Variables: none
 */
system {
    debugger-on-break;
}
```

## junos/system/debugger-on-panic.conf

```
/*
 * Topic: Kernel debugger entered on a panic instead of a reboot
 * Seen on:
 *   Junos: srx1a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx2b_srx4600 1
 *   total 2
 * Pair with: none
 * Variables: none
 */
system {
    debugger-on-panic;
}
```

## junos/system/domain-search-5-domains.conf

```
/*
 * Topic: DNS search list of five domains
 * Seen on:
 *   Junos: srx1a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx2b_srx4600 1
 *   total 2
 * Pair with: none
 * Variables (example values from srx1a_srx4600):
 *   $DOMAIN_SEARCH_1  e.g. englab.juniper.net
 *   $DOMAIN_SEARCH_2  e.g. spglab.juniper.net
 *   $DOMAIN_SEARCH_3  e.g. dcbg.juniper.net
 *   $DOMAIN_SEARCH_4  e.g. juniper.net
 *   $DOMAIN_SEARCH_5  e.g. jnpr.net
 */
system {
    domain-search [ $DOMAIN_SEARCH_1 $DOMAIN_SEARCH_2 $DOMAIN_SEARCH_3 $DOMAIN_SEARCH_4 $DOMAIN_SEARCH_5 ];
}
```

## junos/system/login-user-superuser-csh.conf

```
/*
 * Topic: One local login account in class superuser with the csh shell and an encrypted password
 * Seen on:
 *   Junos: srx1a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx2b_srx4600 1
 *   total 2
 * Pair with: none
 * Variables (example values from srx1a_srx4600):
 *   $LOGIN_USER_1        e.g. regress
 *   $LOGIN_UID_1         e.g. 928
 *   $ENCRYPTED_PASSWORD  e.g. "<ENCRYPTED_PASSWORD>"
 */
system {
    login {
        user $LOGIN_USER_1 {
            uid $LOGIN_UID_1;
            class superuser;
            shell csh;
            authentication {
                encrypted-password $ENCRYPTED_PASSWORD;
            }
        }
    }
}
```

## junos/system/name-server-2-servers.conf

```
/*
 * Topic: Two DNS name servers
 * Seen on:
 *   Junos: srx1a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx2b_srx4600 1
 *   total 2
 * Pair with: none
 * Variables (example values from srx1a_srx4600):
 *   $NAME_SERVER_V4_1  e.g. 10.92.236.2
 *   $NAME_SERVER_V4_2  e.g. 10.102.152.11
 */
system {
    name-server {
        $NAME_SERVER_V4_1;
        $NAME_SERVER_V4_2;
    }
}
```

## junos/system/ports-console-log-out.conf

```
/*
 * Topic: Console log-out on disconnect
 * Seen on:
 *   Junos: mx1_mx304 srx2a_srx4600
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   srx2a_srx4600 1
 *   total 2
 * Pair with: none
 * Variables: none
 */
system {
    ports {
        console log-out-on-disconnect;
    }
}
```

## junos/system/processes-net-monitord-enable.conf

```
/*
 * Topic: Network-monitoring process (net-monitord) enabled
 * Seen on:
 *   Junos: mx1_mx304
 *   EVO: (none)
 * Count:
 *   mx1_mx304 1
 *   total 1
 * Highlights:
 *   - net-monitord runs the `services network-monitoring` health-check profiles that the TLB group uses to probe the SRX real services.
 * Pair with: none
 * Variables: none
 */
system {
    processes {
        sdk-service {
        }
        net-monitord enable;
    }
}
```

## junos/system/radius-server-2-servers.conf

```
/*
 * Topic: Two RADIUS servers with their shared secrets
 * Seen on:
 *   Junos: srx1a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx2b_srx4600 1
 *   total 2
 * Pair with: none
 * Variables (example values from srx1a_srx4600):
 *   $RADIUS_SERVER_V4_1  e.g. 192.168.69.162
 *   $RADIUS_SECRET_1     e.g. "<RADIUS_SECRET>"
 *   $RADIUS_SERVER_V4_2  e.g. 192.168.64.10
 *   $RADIUS_SECRET_2     e.g. "<RADIUS_SECRET>"
 */
system {
    radius-server {
        $RADIUS_SERVER_V4_1 secret $RADIUS_SECRET_1;
        $RADIUS_SERVER_V4_2 secret $RADIUS_SECRET_2;
    }
}
```

## junos/system/root-authentication-encrypted-password.conf

```
/*
 * Topic: Root account authentication with an encrypted password
 * Seen on:
 *   Junos: srx1a_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   total 1
 * Pair with: none
 * Variables (example values from srx1a_srx4600):
 *   $ENCRYPTED_PASSWORD  e.g. "<ENCRYPTED_PASSWORD>"
 */
system {
    root-authentication {
        encrypted-password $ENCRYPTED_PASSWORD;
    }
}
```

## junos/system/services-netconf-ssh-ssh-ftp-telnet-web-management-http-8088.conf

```
/*
 * Topic: NETCONF over SSH, SSH, FTP, Telnet and HTTP web management on port 8088
 * Seen on:
 *   Junos: srx1a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx2b_srx4600 1
 *   total 2
 * Pair with: none
 * Variables: none
 */
system {
    services {
        netconf {
            ssh;
        }
        ssh;
        ftp;
        telnet;
        web-management {
            http {
                port 8088;
            }
        }
    }
}
```

## junos/system/services-netconf-ssh-ssh-max-sessions-64-web-management-http-8088.conf

```
/*
 * Topic: NETCONF over SSH, SSH with 64 sessions per connection and HTTP web management on port 8088
 * Seen on:
 *   Junos: srx1b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1b_srx4600 1
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
            max-sessions-per-connection 64;
        }
        web-management {
            http {
                port 8088;
            }
        }
    }
}
```

## junos/system/services-netconf-ssh-ssh-web-management-http-8088.conf

```
/*
 * Topic: NETCONF over SSH, SSH and HTTP web management on port 8088
 * Seen on:
 *   Junos: srx2a_srx4600
 *   EVO: (none)
 * Count:
 *   srx2a_srx4600 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
system {
    services {
        netconf {
            ssh;
        }
        ssh;
        web-management {
            http {
                port 8088;
            }
        }
    }
}
```

## junos/system/services-netconf-ssh.conf

```
/*
 * Topic: NETCONF over SSH service
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
    }
}
```

## junos/system/syslog-default-log-messages-interactive-commands-messages.conf

```
/*
 * Topic: Syslog files default-log-messages (commit, FRU, link and license events), interactive-commands and messages
 * Seen on:
 *   Junos: srx1b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1b_srx4600 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
system {
    syslog {
        file default-log-messages {
            any info;
            match "(requested 'commit' operation)|(requested 'commit synchronize' operation)|(copying configuration to juniper.save)|(commit complete)|ifAdminStatus|(FRU power)|(FRU removal)|(FRU insertion)|(link UP)|transitioned|Transferred|transfer-file|(license add)|(license delete)|(package -X update)|(package -X delete)|(FRU Online)|(FRU Offline)|(plugged in)|(unplugged)|_GRES";
            structured-data;
        }
        file interactive-commands {
            interactive-commands any;
        }
        file messages {
            any any;
            authorization info;
        }
    }
}
```

## junos/system/time-zone.conf

```
/*
 * Topic: System time zone
 * Seen on:
 *   Junos: srx1a_srx4600 srx2b_srx4600
 *   EVO: (none)
 * Count:
 *   srx1a_srx4600 1
 *   srx2b_srx4600 1
 *   total 2
 * Pair with: none
 * Variables (example values from srx1a_srx4600):
 *   $TIME_ZONE  e.g. America/Los_Angeles
 */
system {
    time-zone $TIME_ZONE;
}
```

## _variables.md

# Snippet variable glossary

All `.conf` files under `junos/` are templates: identifiers that vary between deployments are written as `$VAR`.
Render a snippet by substituting each placeholder with your deployment's value. The placeholders each snippet uses
are listed in its `Variables:` header and in the glossary below. Variable names and meanings follow the shared JVD
snippet vocabulary. Numbered variables (`_1`, `_2`, …) form an ordered set; the numbers carry no other meaning.

Values left literal on purpose: the names of the security objects that other configuration references by name
(security zones, the global address-book entries, which embed their prefix, the ESP application, the IKE and IPsec
proposals, policies, gateways and VPNs, security policies, the TLB instance, group, real services and virtual service,
the network-monitoring profiles, the service-sets, the firewall filter and its counters); the prefix-list names; the
routing-instance names `MNHA-VR`, `TRUST_VR`, `UNTRUST_VR`, `client` and `srx-tproxy-fi`; BGP group names; the IKE
anycast address `10.100.0.1`, the responder and initiator identities, the IKE initiator local addresses and the
IPsec traffic selectors; the MNHA signal routes `192.168.255.0` and `192.168.255.1`, the activeness priorities and the
AS-path prepend lengths that set the preference between the two nodes of an MNHA pair; the IKE, IPsec and data
prefixes of the design; the BFD, liveness, DPD and health-check timers; the port speeds and port counts; the TLB
instance interface `lo0.1`, the MNHA node loopback `lo0.0`, the AMS units the service-sets name and the st0 units the
VPNs bind; `unit 0`, and the loopback `lo0`. Credentials (pre-shared keys, passwords, RADIUS secrets, the SNMP
community) are variables whose example is a placeholder: supply your own.

## System, chassis and SNMP

| Variable | What it is | Example value |
|---|---|---|
| `$AE_DEVICE_COUNT` | Number of aggregated Ethernet devices the chassis creates (`aggregated-devices ethernet device-count`). | `16` |
| `$DOMAIN_SEARCH_1` | **new** Domain in the system DNS search list (`system domain-search`). Numbered `_1`, `_2`, … in source order. | `englab.juniper.net` |
| `$DOMAIN_SEARCH_2` | **new** Domain in the system DNS search list (`system domain-search`). Numbered `_1`, `_2`, … in source order. | `spglab.juniper.net` |
| `$DOMAIN_SEARCH_3` | **new** Domain in the system DNS search list (`system domain-search`). Numbered `_1`, `_2`, … in source order. | `dcbg.juniper.net` |
| `$DOMAIN_SEARCH_4` | **new** Domain in the system DNS search list (`system domain-search`). Numbered `_1`, `_2`, … in source order. | `juniper.net` |
| `$DOMAIN_SEARCH_5` | **new** Domain in the system DNS search list (`system domain-search`). Numbered `_1`, `_2`, … in source order. | `jnpr.net` |
| `$ENCRYPTED_PASSWORD` | Encrypted (hashed) login password; secret, supplied by the operator (the published value is sanitized). | `"<ENCRYPTED_PASSWORD>"` |
| `$FPC_SLOT` | FPC slot number. | `0` |
| `$GROUP_A` | First configuration-group name of an ordered `apply-groups` list. | `global` |
| `$GROUP_B` | Second configuration-group name of an ordered `apply-groups` list. | `re0` |
| `$GROUP_C` | Third configuration-group name of an ordered `apply-groups` list. | `re1` |
| `$LOGIN_UID_1` | Numeric user ID (`uid`) of the login account with the same number. | `928` |
| `$LOGIN_USER_1` | Name of a local login account; `_1`, `_2` order the accounts. | `regress` |
| `$NAME_SERVER_V4_1` | **new** IPv4 address of a DNS name server (`system name-server`). Numbered `_1`, `_2`, … in source order. | `10.92.236.2` |
| `$NAME_SERVER_V4_2` | **new** IPv4 address of a DNS name server (`system name-server`). Numbered `_1`, `_2`, … in source order. | `10.102.152.11` |
| `$RADIUS_SECRET_1` | RADIUS shared secret. Numbered `_1`, `_2`, … in source order. | `"<RADIUS_SECRET>"` |
| `$RADIUS_SECRET_2` | RADIUS shared secret. Numbered `_1`, `_2`, … in source order. | `"<RADIUS_SECRET>"` |
| `$RADIUS_SERVER_V4_1` | IPv4 address of a RADIUS server. Numbered `_1`, `_2`, … in source order. | `192.168.69.162` |
| `$RADIUS_SERVER_V4_2` | IPv4 address of a RADIUS server. Numbered `_1`, `_2`, … in source order. | `192.168.64.10` |
| `$SNMP_COMMUNITY` | SNMP community name (`snmp community`); a credential, supplied by the operator. | `<SNMP_COMMUNITY>` |
| `$SNMP_TRAP_TARGET_V4` | IPv4 address of an SNMP trap target (`snmp trap-group <name> targets`). | `10.204.243.205` |
| `$TIME_ZONE` | System time zone (IANA time-zone name). | `America/Los_Angeles` |

## IKE and IPsec

| Variable | What it is | Example value |
|---|---|---|
| `$IKE_PSK` | **new** Pre-shared key of an IKE policy (`security ike policy <name> pre-shared-key ascii-text`); a credential, supplied by the operator. | `"<IKE_PSK>"` |
| `$IKE_PSK_1` | **new** Pre-shared key of an IKE policy (`security ike policy <name> pre-shared-key ascii-text`); a credential, supplied by the operator. Numbered `_1`, `_2`, … in source order. | `"<IKE_PSK>"` |
| `$IKE_PSK_2` | **new** Pre-shared key of an IKE policy (`security ike policy <name> pre-shared-key ascii-text`); a credential, supplied by the operator. Numbered `_1`, `_2`, … in source order. | `"<IKE_PSK>"` |

## Multinode High Availability

| Variable | What it is | Example value |
|---|---|---|
| `$LOOPBACK_V4` | Primary per-node IPv4 loopback address. | `192.168.0.1` |
| `$MNHA_LOCAL_ID` | Local node identifier of an SRX Multinode High Availability (MNHA) node (`chassis high-availability local-id`). | `1` |
| `$MNHA_MONITOR_DST_V4` | Destination IPv4 address of the BFD liveliness monitor of an MNHA services-redundancy group monitor object (`bfd-liveliness destination-ip`). | `10.1.1.1` |
| `$MNHA_MONITOR_SRC_V4` | Source IPv4 address of the BFD liveliness monitor of an MNHA services-redundancy group monitor object (`destination-ip <addr> src-ip`). | `10.1.1.2` |
| `$MNHA_PEER_ID` | Node identifier of the MNHA peer node (`chassis high-availability peer-id`), also named by the services-redundancy group `peer-id`. | `2` |
| `$MNHA_PEER_V4` | Loopback IPv4 address of the MNHA peer node (`chassis high-availability peer-id <n> peer-ip`). | `192.168.0.2` |
| `$MNHA_PROBE_DST_V4` | **new** Destination IPv4 address of the activeness probe of an MNHA services-redundancy group (`activeness-probe dest-ip`). | `10.1.1.1` |
| `$MNHA_PROBE_SRC_V4` | **new** Source IPv4 address of the activeness probe of an MNHA services-redundancy group (`activeness-probe dest-ip <addr> src-ip`). | `192.168.10.1` |

## Load balancing

| Variable | What it is | Example value |
|---|---|---|
| `$REAL_SERVICE_V4_1` | IPv4 address of a Traffic Load Balancer real service (`services traffic-load-balance instance <name> real-service <name> address`). Numbered `_1`, `_2`, … in source order. | `192.168.10.1` |
| `$REAL_SERVICE_V4_2` | IPv4 address of a Traffic Load Balancer real service (`services traffic-load-balance instance <name> real-service <name> address`). Numbered `_1`, `_2`, … in source order. | `192.168.10.2` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address with prefix length on an attachment (access-facing) Layer 3 unit. | `90.1.1.2/30` |
| `$AE_BUNDLE` | Aggregated Ethernet interface (`ae<n>`), as configured and as its member ports name it (`802.3ad`). | `ae10` |
| `$AMS_MEMBER_IFD_1` | **new** Member service interface of an aggregated multiservices (AMS) interface (`interfaces ams<n> load-balancing-options member-interface`). Numbered `_1`, `_2`, … in source order. | `mams-3/0/0` |
| `$AMS_MEMBER_IFD_2` | **new** Member service interface of an aggregated multiservices (AMS) interface (`interfaces ams<n> load-balancing-options member-interface`). Numbered `_1`, `_2`, … in source order. | `mams-3/1/0` |
| `$DESCRIPTION_1` | Free-text `description` of an interface, unit or BGP neighbor. Numbered `_1`, `_2`, … in source order. | `"to SRX1A"` |
| `$DESCRIPTION_2` | Free-text `description` of an interface, unit or BGP neighbor. Numbered `_1`, `_2`, … in source order. | `"to SRX1B"` |
| `$DESCRIPTION_3` | Free-text `description` of an interface, unit or BGP neighbor. Numbered `_1`, `_2`, … in source order. | `"to SRX2A"` |
| `$DESCRIPTION_4` | Free-text `description` of an interface, unit or BGP neighbor. Numbered `_1`, `_2`, … in source order. | `"to SRX2B"` |
| `$IFD` | Interface-device identifier, excluding a logical unit. | `ae10` |
| `$IFL` | Logical interface identifier, including its unit (here the trust-side unit an MNHA BFD liveliness monitor uses). | `ae1.0` |
| `$IFL_1` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `et-0/1/2.0` |
| `$IFL_10` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `st0.4` |
| `$IFL_11` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `st0.5` |
| `$IFL_2` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `ams1.1` |
| `$IFL_3` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `ams1.2` |
| `$IFL_4` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `ams1.3` |
| `$IFL_5` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `ams1.4` |
| `$IFL_6` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `ams1.5` |
| `$IFL_7` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `st0.1` |
| `$IFL_8` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `st0.2` |
| `$IFL_9` | Logical interface (unit included) named in one routing instance; `_1`, `_2`, … in source order. | `st0.3` |
| `$LOOPBACK_ALT_V4_PFX` | Additional lo0 IPv4 address with prefix length, besides the primary (design) and management loopbacks. | `192.168.10.1/32` |
| `$LOOPBACK_IFL` | Loopback logical interface (`lo0.<unit>`) listed in a routing instance. | `lo0.1` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on a loopback unit. | `192.168.0.1/32` |
| `$LOOPBACK_V4_PFX_1` | IPv4 address with prefix length on a loopback unit. Numbered `_1`, `_2`, … in source order. | `10.200.0.1/32` |
| `$LOOPBACK_V4_PFX_2` | IPv4 address with prefix length on a loopback unit. Numbered `_1`, `_2`, … in source order. | `10.200.0.2/32` |
| `$LOOPBACK_V4_PFX_3` | IPv4 address with prefix length on a loopback unit. Numbered `_1`, `_2`, … in source order. | `10.200.0.3/32` |
| `$LOOPBACK_V4_PFX_4` | IPv4 address with prefix length on a loopback unit. Numbered `_1`, `_2`, … in source order. | `10.200.0.4/32` |
| `$LOOPBACK_V4_PFX_5` | IPv4 address with prefix length on a loopback unit. Numbered `_1`, `_2`, … in source order. | `10.200.0.5/32` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `1` |
| `$VLAN` | A single VLAN identifier. | `40` |

## Routing instances and eBGP

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `65000` |
| `$ASN_CUSTOMER` | Customer-facing BGP peer autonomous-system number. | `65200` |
| `$ASN_CUSTOMER_1` | Customer-facing BGP peer AS, one of an ordered set. | `65001` |
| `$ASN_CUSTOMER_2` | Customer-facing BGP peer autonomous-system number. Numbered `_1`, `_2`, … in source order. | `65002` |
| `$ASN_LOCAL` | BGP `local-as` of a routing instance where it differs from the instance's `autonomous-system`. | `65300` |
| `$BGP_EXPORT_POL` | Policy-statement name applied as a BGP `export`. | `ari_export_untrust` |
| `$BGP_EXPORT_POL_1` | Policy-statement name applied as the `export` of a BGP group; `_1`, `_2`, … number the distinct policies of one instance in source order. | `MX1-to-SRX_trust_export` |
| `$BGP_EXPORT_POL_2` | Policy-statement name applied as the `export` of a BGP group; `_1`, `_2`, … number the distinct policies of one instance in source order. | `default_export` |
| `$CE_PEER_V4` | IPv4 address of a VRF eBGP neighbor on the customer or external side. | `10.1.1.1` |
| `$CE_PEER_V4_1` | IPv4 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.1.2` |
| `$CE_PEER_V4_2` | IPv4 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.2.2` |
| `$CE_PEER_V4_3` | IPv4 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.3.2` |
| `$CE_PEER_V4_4` | IPv4 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.4.2` |
| `$CE_PEER_V4_5` | IPv4 address of a VRF eBGP neighbor on the customer or external side. Numbered `_1`, `_2`, … in source order. | `172.16.1.2` |
| `$NEXT_HOP_V4` | IPv4 next-hop address of a static route (`route <prefix> next-hop`). | `172.16.8.1` |
| `$PE_LOCAL_V4` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. | `10.1.1.2` |
| `$PE_LOCAL_V4_1` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.1.1` |
| `$PE_LOCAL_V4_2` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.2.1` |
| `$PE_LOCAL_V4_3` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.3.1` |
| `$PE_LOCAL_V4_4` | Local IPv4 address (`local-address`) of a VRF eBGP session toward the customer or external side. Numbered `_1`, `_2`, … in source order. | `10.3.4.1` |

## Policy

| Variable | What it is | Example value |
|---|---|---|
| `$CONDITION_NAME` | Name of a routing-policy condition (`policy-options condition`), as defined and as a policy term references it. | `active_route_exists` |
| `$CONDITION_NAME_1` | Name of a routing-policy condition as a policy term references it; `_1`, `_2`, … in term order. | `active_route_exists` |
| `$CONDITION_NAME_2` | Name of a routing-policy condition as a policy term references it; `_1`, `_2`, … in term order. | `backup_route_exists` |
| `$POLICY_NAME` | Name of a routing policy-statement where no role-specific name (BGP export or import, VRF import or export, load balancing) applies. | `mnha-mx-to-srx-export` |
| `$PPLB_NAME` | Name of the per-packet load-balancing policy exported to the forwarding table. | `ECMP_POLICY-LB` |
| `$PREFIX` | IPv4 or IPv6 prefix in a route filter or route-filter list. | `192.168.10.251/32` |
| `$ROUTE_FILTER_LIST` | Name of a route-filter list, as defined and as a policy references it. | `ari_route_rt_list` |
| `$TERM_NAME` | Name of a policy-statement or firewall filter term. | `t1` |
| `$TERM_NAME_1` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `IPSEC` |
| `$TERM_NAME_2` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `other_traffic` |
| `$TERM_NAME_3` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `3` |
| `$TERM_NAME_4` | Name of a policy-statement or firewall filter term; `_1`, `_2`, … number the terms in evaluation order. | `default` |

## byoai/TIERS.md

> **Tier qualification for this JVD.** Only `minimum` is qualified and selectable.
> The `self-contained` and `as-deployed` lists below are not yet qualified for this
> JVD. They are not selectable: never offer or render them.

# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd security/scale_out_ipsec`. -->

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

## IKEv2 AutoVPN responder on the SRX IKE anycast address, with the MNHA inter-chassis link IKE gateway

Family ipsec, form ike-autovpn-responder. OS mode Junos. Attachment: lo0.1, which carries the IKE anycast address 10.100.0.1 on every SRX node..

### srx1a_srx4600 (junos)

- `minimum`: `junos/security/ike-autovpn-responder-group-ike-id-mnha-icl.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-loopback-inet-two-addresses.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### srx1b_srx4600 (junos)

- `minimum`: `junos/security/ike-autovpn-responder-group-ike-id-mnha-icl.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-loopback-inet-two-addresses.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### srx2a_srx4600 (junos)

- `minimum`: `junos/security/ike-autovpn-responder-group-ike-id-mnha-icl.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-loopback-inet-two-addresses.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### srx2b_srx4600 (junos)

- `minimum`: `junos/security/ike-autovpn-responder-group-ike-id-mnha-icl.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-loopback-inet-two-addresses.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## IPsec AutoVPN on st0.1 with ARI traffic selectors, and the MNHA inter-chassis link encryption VPN on an SRX

Family ipsec, form ipsec-autovpn-st0. OS mode Junos. Attachment: The st0.1 secure-tunnel unit and the IKE gateways of the AutoVPN responder form..

### srx1a_srx4600 (junos)

- `minimum`: `junos/security/ipsec-autovpn-st0-1-mnha-icl-link-encryption-aes-256-gcm.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-loopback-inet-two-addresses.conf`, `junos/interfaces/ifl-unit-inet.conf`, `junos/security/ike-autovpn-responder-group-ike-id-mnha-icl.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### srx1b_srx4600 (junos)

- `minimum`: `junos/security/ipsec-autovpn-st0-1-mnha-icl-link-encryption-aes-256-gcm.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-loopback-inet-two-addresses.conf`, `junos/interfaces/ifl-unit-inet.conf`, `junos/security/ike-autovpn-responder-group-ike-id-mnha-icl.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### srx2a_srx4600 (junos)

- `minimum`: `junos/security/ipsec-autovpn-st0-1-mnha-icl-link-encryption-aes-256-gcm.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-loopback-inet-two-addresses.conf`, `junos/interfaces/ifl-unit-inet.conf`, `junos/security/ike-autovpn-responder-group-ike-id-mnha-icl.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### srx2b_srx4600 (junos)

- `minimum`: `junos/security/ipsec-autovpn-st0-1-mnha-icl-link-encryption-aes-256-gcm.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-loopback-inet-two-addresses.conf`, `junos/interfaces/ifl-unit-inet.conf`, `junos/security/ike-autovpn-responder-group-ike-id-mnha-icl.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## Intra-zone security policies for IPsec data, the MNHA inter-chassis link and ESP to the trust zone on an SRX

Family security-policy, form security-policies-ipsec-data. OS mode Junos. Attachment: The VR-1 trust, VR-1 untrust and MNHA security zones, the global address-book entries and the ESP application the policies name..

### srx1a_srx4600 (junos)

- `minimum`: `junos/security/policies-intra-zone-esp-block-mnha-icl-ipsec-data.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: security-zone:vr-1_trust_zone
  - occurrence-selection-required: security-zone:vr-1_trust_zone
  - occurrence-selection-required: security-zone:trust_zone_mnha
  - occurrence-selection-required: security-zone:trust_zone_mnha
  - occurrence-selection-required: security-zone:vr-1_untrust_zone
  - occurrence-selection-required: security-zone:vr-1_untrust_zone

### srx1b_srx4600 (junos)

- `minimum`: `junos/security/policies-intra-zone-esp-block-mnha-icl-ipsec-data.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: security-zone:vr-1_trust_zone
  - occurrence-selection-required: security-zone:vr-1_trust_zone
  - occurrence-selection-required: security-zone:trust_zone_mnha
  - occurrence-selection-required: security-zone:trust_zone_mnha
  - occurrence-selection-required: security-zone:vr-1_untrust_zone
  - occurrence-selection-required: security-zone:vr-1_untrust_zone

### srx2a_srx4600 (junos)

- `minimum`: `junos/security/policies-intra-zone-esp-block-mnha-icl-ipsec-data.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: security-zone:vr-1_trust_zone
  - occurrence-selection-required: security-zone:vr-1_trust_zone
  - occurrence-selection-required: security-zone:trust_zone_mnha
  - occurrence-selection-required: security-zone:trust_zone_mnha
  - occurrence-selection-required: security-zone:vr-1_untrust_zone
  - occurrence-selection-required: security-zone:vr-1_untrust_zone

### srx2b_srx4600 (junos)

- `minimum`: `junos/security/policies-intra-zone-esp-block-mnha-icl-ipsec-data.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: security-zone:vr-1_trust_zone
  - occurrence-selection-required: security-zone:vr-1_trust_zone
  - occurrence-selection-required: security-zone:trust_zone_mnha
  - occurrence-selection-required: security-zone:trust_zone_mnha
  - occurrence-selection-required: security-zone:vr-1_untrust_zone
  - occurrence-selection-required: security-zone:vr-1_untrust_zone

---

## SRX MNHA with an encrypted inter-chassis link and IPsec SRG 1, preferred node (preemption, activeness priority 200)

Family mnha, form mnha-srg-1-ipsec-preferred. OS mode Junos. Attachment: lo0.0 in MNHA-VR, the ike_lo0 prefix list, the L3HA_IPSEC_VPN inter-chassis link VPN and the trust-side unit that the BFD monitor uses..

### srx1a_srx4600 (junos)

- `minimum`: `junos/chassis/high-availability-mnha-icl-encryption-srg-1-ipsec-activeness-probe-preemption-priority-200.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx2a_srx4600 (junos)

- `minimum`: `junos/chassis/high-availability-mnha-icl-encryption-srg-1-ipsec-activeness-probe-preemption-priority-200.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

---

## SRX MNHA with an encrypted inter-chassis link and IPsec SRG 1, backup node (activeness priority 1)

Family mnha, form mnha-srg-1-ipsec-backup. OS mode Junos. Attachment: lo0.0 in MNHA-VR, the ike_lo0 prefix list, the L3HA_IPSEC_VPN inter-chassis link VPN and the trust-side unit that the BFD monitor uses..

### srx1b_srx4600 (junos)

- `minimum`: `junos/chassis/high-availability-mnha-icl-encryption-srg-1-ipsec-activeness-probe-priority-1.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx2b_srx4600 (junos)

- `minimum`: `junos/chassis/high-availability-mnha-icl-encryption-srg-1-ipsec-activeness-probe-priority-1.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL
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

## SRX eBGP group SRX-to-MX_TRUST with BFD toward the MX trust instance

Family scale-out-routing, form srx-bgp-to-mx-trust. OS mode Junos. Attachment: The MX-facing trust VLAN unit; the export policy advertises the activeness-probe address with the SRG-state AS-path preference..

### srx1a_srx4600 (junos)

- `minimum`: `junos/protocols/bgp-group-srx-to-mx-trust-ebgp-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx1b_srx4600 (junos)

- `minimum`: `junos/protocols/bgp-group-srx-to-mx-trust-ebgp-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx2a_srx4600 (junos)

- `minimum`: `junos/protocols/bgp-group-srx-to-mx-trust-ebgp-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx2b_srx4600 (junos)

- `minimum`: `junos/protocols/bgp-group-srx-to-mx-trust-ebgp-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

---

## SRX eBGP group SRX-to-MX_UNTRUST with BFD toward the MX untrust instance

Family scale-out-routing, form srx-bgp-to-mx-untrust. OS mode Junos. Attachment: The MX-facing untrust VLAN unit; the export policy advertises the ARI routes with the SRG-state AS-path preference..

### srx1a_srx4600 (junos)

- `minimum`: `junos/protocols/bgp-group-srx-to-mx-untrust-ebgp-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx1b_srx4600 (junos)

- `minimum`: `junos/protocols/bgp-group-srx-to-mx-untrust-ebgp-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx2a_srx4600 (junos)

- `minimum`: `junos/protocols/bgp-group-srx-to-mx-untrust-ebgp-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx2b_srx4600 (junos)

- `minimum`: `junos/protocols/bgp-group-srx-to-mx-untrust-ebgp-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

---

## MX TRUST_VR scale-out routing with eBGP to every SRX node and to the trust-side gateway

Family scale-out-routing, form mx-trust-vr-scale-out. OS mode Junos. Attachment: The SRX-facing trust VLAN units, the gateway-facing unit with the IPSEC_LB filter and lo0.1, the TLB instance interface..

### mx1_mx304 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-trust-vr-static-discard-default-ebgp-srx-4-neighbors-gateway.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_4
  - occurrence-selection-required: logical-interface:$IFL_5
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2

---

## MX UNTRUST_VR scale-out routing with eBGP to every SRX node and to the untrust-side gateway

Family scale-out-routing, form mx-untrust-vr-scale-out. OS mode Junos. Attachment: The SRX-facing untrust VLAN units and the gateway-facing unit..

### mx1_mx304 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-untrust-vr-ebgp-srx-4-neighbors-gateway.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_4
  - occurrence-selection-required: logical-interface:$IFL_5
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2

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

## MX TLB instance ipsec_lb (direct server return to the SRX MNHA pairs, source-IP hash)

Family tlb, form tlb-ipsec-lb. OS mode Junos. Attachment: lo0.1 as the instance interface, TRUST_VR, the network-monitoring profiles and forwarding instance srx-tproxy-fi, which the IPSEC_LB filter feeds..

### mx1_mx304 (junos)

- `minimum`: `junos/services/traffic-load-balance-instance-ipsec-lb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_4
  - occurrence-selection-required: logical-interface:$IFL_5
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2

---

## MX gateway-facing unit with filter-based forwarding of IKE and IPsec traffic into the TLB forwarding instance

Family tlb, form tlb-fbf-ipsec-lb. OS mode Junos. Attachment: The trust-gateway-facing VLAN unit of the aggregated Ethernet interface..

### mx1_mx304 (junos)

- `minimum`: `junos/interfaces/ifl-vlan-inet-input-filter-ipsec-lb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

---

## MX IKEv2 initiator with five gateways to the SRX IKE anycast address

Family ipsec, form ike-initiator-gateway. OS mode Junos. Attachment: lo0.0, which carries the five initiator addresses..

### ipsec_initiator_gateway_mx304 (junos)

- `minimum`: `junos/security/ike-initiator-5-gateways-ikev2-pre-shared-key.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-loopback-inet-5-addresses.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## MX IPsec initiator with five route-based VPNs established immediately

Family ipsec, form ipsec-initiator-vpns. OS mode Junos. Attachment: The st0.1 to st0.5 secure-tunnel units, the five IKE gateways and the next-hop service-sets IPSEC_TUN_1 to IPSEC_TUN_5 on the AMS interface..

### ipsec_initiator_gateway_mx304 (junos)

- `minimum`: `junos/security/ipsec-initiator-5-vpns-aes-256-gcm-establish-immediately.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-loopback-inet-5-addresses.conf`, `junos/interfaces/ifl-unit-inet.conf`, `junos/security/ike-initiator-5-gateways-ikev2-pre-shared-key.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## byoai/DEFAULTS.md

# DEFAULTS — Scale-Out IPsec

Lab auto-fill values for the Scale-Out IPsec JVD. Every value is measured from the published device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks a device and service and asks for lab values; otherwise ask for the deployment values. Credentials (pre-shared keys, passwords, RADIUS secrets, the SNMP community) are never auto-filled: ask the user, or emit the placeholder shown.

## Device inventory

| Role | Device | Platform | OS | Loopbacks | AS numbers (instance or group: local AS) |
|------|--------|----------|----|-----------|------------------------------------------|
| IPsec Initiator Gateway | ipsec_initiator_gateway_mx304 | MX304 | Junos | lo0.0 10.200.0.1/32, 10.200.0.2/32, 10.200.0.3/32, 10.200.0.4/32, 10.200.0.5/32 | TRUST_VR 65300 (instance AS 2500); UNTRUST_VR 65100 |
| Forwarding / Load Balancer | mx1_mx304 | MX304 | Junos | lo0.1 192.168.10.251/32 | MNHA-VR 65050; TRUST_VR 65200; UNTRUST_VR 65400; routing-options 10000 |
| Security Service (SECGW) | srx1a_srx4600 | SRX4600 | Junos | lo0.0 192.168.0.1/32; lo0.1 10.100.0.1/32, 192.168.10.1/32 | MNHA-VR 65001; default instance 65000 |
| Security Service (SECGW) | srx1b_srx4600 | SRX4600 | Junos | lo0.0 192.168.0.2/32; lo0.1 10.100.0.1/32, 192.168.10.1/32 | MNHA-VR 65002; default instance 65000; routing-options 69 |
| Security Service (SECGW) | srx2a_srx4600 | SRX4600 | Junos | lo0.0 192.168.0.3/32; lo0.1 10.100.0.1/32, 192.168.10.2/32 | MNHA-VR 65001; default instance 65000 |
| Security Service (SECGW) | srx2b_srx4600 | SRX4600 | Junos | lo0.0 192.168.0.4/32; lo0.1 10.100.0.1/32, 192.168.10.2/32 | MNHA-VR 65002; default instance 65000; routing-options 69 |

Every SRX node carries the IKE anycast address 10.100.0.1 on lo0.1. The two nodes of an MNHA pair share their second lo0.1 address (the pair's activeness-probe source and the MX TLB real service) and swap their MNHA local and peer IDs.

## MNHA pairs

| MNHA pair | Nodes | Probe and TLB real-service address (lo0.1) | Activeness-probe destination (preferred / backup) |
|-----------|-------|---------------------------------------------|---------------------------------------------------|
| 1 | srx1a_srx4600 (preferred, local ID 1) and srx1b_srx4600 (backup, local ID 2) | 192.168.10.1/32 | 10.1.1.1 / 10.1.2.1 |
| 2 | srx2a_srx4600 (preferred, local ID 1) and srx2b_srx4600 (backup, local ID 2) | 192.168.10.2/32 | 10.1.3.1 / 10.1.4.1 |

## First validated instance per service and device

| Service form | Device | Example values |
|--------------|--------|----------------|
| ike-autovpn-responder | srx1a_srx4600 | `$IKE_PSK_1` <IKE_PSK>, `$IKE_PSK_2` <IKE_PSK> |
| ike-autovpn-responder | srx1b_srx4600 | `$IKE_PSK_1` <IKE_PSK>, `$IKE_PSK_2` <IKE_PSK> |
| ike-autovpn-responder | srx2a_srx4600 | `$IKE_PSK_1` <IKE_PSK>, `$IKE_PSK_2` <IKE_PSK> |
| ike-autovpn-responder | srx2b_srx4600 | `$IKE_PSK_1` <IKE_PSK>, `$IKE_PSK_2` <IKE_PSK> |
| ipsec-autovpn-st0 | srx1a_srx4600 | (no variables: the snip is rendered as written) |
| ipsec-autovpn-st0 | srx1b_srx4600 | (no variables: the snip is rendered as written) |
| ipsec-autovpn-st0 | srx2a_srx4600 | (no variables: the snip is rendered as written) |
| ipsec-autovpn-st0 | srx2b_srx4600 | (no variables: the snip is rendered as written) |
| security-policies-ipsec-data | srx1a_srx4600 | (no variables: the snip is rendered as written) |
| security-policies-ipsec-data | srx1b_srx4600 | (no variables: the snip is rendered as written) |
| security-policies-ipsec-data | srx2a_srx4600 | (no variables: the snip is rendered as written) |
| security-policies-ipsec-data | srx2b_srx4600 | (no variables: the snip is rendered as written) |
| mnha-srg-1-ipsec-preferred | srx1a_srx4600 | `$IFL` ae1.0, `$LOOPBACK_V4` 192.168.0.1, `$MNHA_LOCAL_ID` 1, `$MNHA_MONITOR_DST_V4` 10.1.1.1, `$MNHA_MONITOR_SRC_V4` 10.1.1.2, `$MNHA_PEER_ID` 2 … |
| mnha-srg-1-ipsec-preferred | srx2a_srx4600 | `$IFL` ae1.0, `$LOOPBACK_V4` 192.168.0.3, `$MNHA_LOCAL_ID` 1, `$MNHA_MONITOR_DST_V4` 10.1.3.1, `$MNHA_MONITOR_SRC_V4` 10.1.3.2, `$MNHA_PEER_ID` 2 … |
| mnha-srg-1-ipsec-backup | srx1b_srx4600 | `$IFL` ae1.0, `$LOOPBACK_V4` 192.168.0.2, `$MNHA_LOCAL_ID` 2, `$MNHA_MONITOR_DST_V4` 10.1.2.1, `$MNHA_MONITOR_SRC_V4` 10.1.2.2, `$MNHA_PEER_ID` 1 … |
| mnha-srg-1-ipsec-backup | srx2b_srx4600 | `$IFL` ae1.0, `$LOOPBACK_V4` 192.168.0.4, `$MNHA_LOCAL_ID` 2, `$MNHA_MONITOR_DST_V4` 10.1.4.1, `$MNHA_MONITOR_SRC_V4` 10.1.4.2, `$MNHA_PEER_ID` 1 … |
| srx-mnha-vr-icl | srx1a_srx4600 | `$ASN` 65001, `$ASN_CUSTOMER` 65050, `$BGP_EXPORT_POL` mnha_ip, `$CE_PEER_V4` 10.3.1.1, `$IFL` ae1.100, `$PE_LOCAL_V4` 10.3.1.2 |
| srx-mnha-vr-icl | srx1b_srx4600 | `$ASN` 65002, `$ASN_CUSTOMER` 65050, `$BGP_EXPORT_POL` mnha_ip, `$CE_PEER_V4` 10.3.2.1, `$IFL` ae1.100, `$PE_LOCAL_V4` 10.3.2.2 |
| srx-mnha-vr-icl | srx2a_srx4600 | `$ASN` 65001, `$ASN_CUSTOMER` 65050, `$BGP_EXPORT_POL` mnha_ip, `$CE_PEER_V4` 10.3.3.1, `$IFL` ae1.100, `$PE_LOCAL_V4` 10.3.3.2 |
| srx-mnha-vr-icl | srx2b_srx4600 | `$ASN` 65002, `$ASN_CUSTOMER` 65050, `$BGP_EXPORT_POL` mnha_ip, `$CE_PEER_V4` 10.3.4.1, `$IFL` ae1.100, `$PE_LOCAL_V4` 10.3.4.2 |
| srx-bgp-to-mx-trust | srx1a_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER` 65200, `$BGP_EXPORT_POL` loopback_export_trust, `$CE_PEER_V4` 10.1.1.1, `$PE_LOCAL_V4` 10.1.1.2 |
| srx-bgp-to-mx-trust | srx1b_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER` 65200, `$BGP_EXPORT_POL` loopback_export_trust, `$CE_PEER_V4` 10.1.2.1, `$PE_LOCAL_V4` 10.1.2.2 |
| srx-bgp-to-mx-trust | srx2a_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER` 65200, `$BGP_EXPORT_POL` loopback_export_trust, `$CE_PEER_V4` 10.1.3.1, `$PE_LOCAL_V4` 10.1.3.2 |
| srx-bgp-to-mx-trust | srx2b_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER` 65200, `$BGP_EXPORT_POL` loopback_export_trust, `$CE_PEER_V4` 10.1.4.1, `$PE_LOCAL_V4` 10.1.4.2 |
| srx-bgp-to-mx-untrust | srx1a_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER` 65400, `$BGP_EXPORT_POL` ari_export_untrust, `$CE_PEER_V4` 10.2.1.1, `$PE_LOCAL_V4` 10.2.1.2 |
| srx-bgp-to-mx-untrust | srx1b_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER` 65400, `$BGP_EXPORT_POL` ari_export_untrust, `$CE_PEER_V4` 10.2.2.1, `$PE_LOCAL_V4` 10.2.2.2 |
| srx-bgp-to-mx-untrust | srx2a_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER` 65400, `$BGP_EXPORT_POL` ari_export_untrust, `$CE_PEER_V4` 10.2.3.1, `$PE_LOCAL_V4` 10.2.3.2 |
| srx-bgp-to-mx-untrust | srx2b_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER` 65400, `$BGP_EXPORT_POL` ari_export_untrust, `$CE_PEER_V4` 10.2.4.1, `$PE_LOCAL_V4` 10.2.4.2 |
| mx-trust-vr-scale-out | mx1_mx304 | `$ASN` 65200, `$ASN_CUSTOMER_1` 65000, `$ASN_CUSTOMER_2` 65100, `$BGP_EXPORT_POL_1` MX1-to-SRX_trust_export, `$BGP_EXPORT_POL_2` default_export, `$CE_PEER_V4_1` 10.1.1.2 … |
| mx-untrust-vr-scale-out | mx1_mx304 | `$ASN` 65400, `$ASN_CUSTOMER_1` 65000, `$ASN_CUSTOMER_2` 65300, `$BGP_EXPORT_POL_1` untrust-to-trust-export, `$BGP_EXPORT_POL_2` ipsec_ari_route_export, `$CE_PEER_V4_1` 10.2.1.2 … |
| mx-mnha-vr-icl | mx1_mx304 | `$ASN` 65050, `$ASN_CUSTOMER_1` 65001, `$ASN_CUSTOMER_2` 65002, `$BGP_EXPORT_POL` mnha-mx-to-srx-export, `$CE_PEER_V4_1` 10.3.1.2, `$CE_PEER_V4_2` 10.3.2.2 … |
| tlb-ipsec-lb | mx1_mx304 | `$REAL_SERVICE_V4_1` 192.168.10.1, `$REAL_SERVICE_V4_2` 192.168.10.2 |
| tlb-fbf-ipsec-lb | mx1_mx304 | `$AC_ADDR_V4` 172.16.1.1/30, `$IFD` ae10, `$UNIT` 40, `$VLAN` 40 |
| ike-initiator-gateway | ipsec_initiator_gateway_mx304 | `$IKE_PSK` <IKE_PSK> |
| ipsec-initiator-vpns | ipsec_initiator_gateway_mx304 | (no variables: the snip is rendered as written) |

The two nodes of an MNHA pair name each other: each node's `$MNHA_PEER_V4` is the other node's lo0.0 address and its `$MNHA_PEER_ID` the other node's `$MNHA_LOCAL_ID`. The MX TLB real services are the SRX pairs' shared lo0.1 probe addresses, and the MX eBGP neighbors are the SRX nodes' VLAN unit addresses.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into `jvd-so-ipsec-snips.md` by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: minimum
# devices:
#   srx1a: { name: <hostname>, os: junos, mnha_node: <preferred|backup>, loopback4: <lo0.0 addr> }
#   mx1: { name: <hostname>, os: junos }
# services:
#   - { kind: <ike-autovpn-responder|ipsec-autovpn-st0|security-policies-ipsec-data|mnha-srg-1-ipsec-preferred|mnha-srg-1-ipsec-backup|srx-mnha-vr-icl|srx-bgp-to-mx-trust|srx-bgp-to-mx-untrust|mx-trust-vr-scale-out|mx-untrust-vr-scale-out|mx-mnha-vr-icl|tlb-ipsec-lb|tlb-fbf-ipsec-lb|ike-initiator-gateway|ipsec-initiator-vpns>,
#       values: { <$VAR>: <value>, ... } }
# snips_used:
#   - junos/security/ike-autovpn-responder-group-ike-id-mnha-icl.conf
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
- What is not included: the snip's "Not included" references (the `global`, `re0` and `re1` configuration groups), with the Report link.
- Inputs defaulted because the user did not provide them; credentials are never defaulted.
- Cross-device consistency the user must verify: the two nodes of an MNHA pair name each other (peer ID and peer loopback), share the pair's lo0.1 probe address and keep the security object names identical; every SRX node keeps the same IKE anycast address, responder identity and pre-shared key the initiators use; the MX TLB real services are the SRX pairs' lo0.1 probe addresses; the MX and SRX eBGP neighbors and AS numbers match on each VLAN unit; the preferred and backup nodes keep their different activeness priorities.
- Anything that is by-pattern rather than validated on that exact device.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
