# JVD Scale-Out IPsec (CSDS ScaleOut) snippet library

## junos/firewall/fbf-ipsec-lb-redirect.conf

```
/*
 * Topic:   Filter-based forwarding: redirect IPsec (to the IKE VIP) into the TLB tproxy instance
 * Seen on:
 *   Junos: mx1_mx304
 *
 * Highlights:
 *  - Matches traffic destined to the shared IKE anycast VIP and lands it in the forwarding instance $TPROXY_VRF.
 *  - count + log terms give per-class visibility; all other traffic is accepted normally.
 *  - Applied as an input filter on the UNTRUST-facing AC sub-unit.
 *
 * Pair with:
 *  - junos/transport/forwarding-instance-tproxy.conf — target of the routing-instance action
 *  - junos/interfaces/mx-ae-fbf-uni.conf — where this filter is applied as input
 *  - junos/load-balancing/tlb-ipsec-dsr.conf — TLB anchors the VIP this filter steers to
 *
 * Variables:
 *   $TLB_VIP     e.g. 10.100.0.1
 *   $TPROXY_VRF  e.g. srx-tproxy-fi
 */
firewall {
    family inet {
        filter IPSEC_LB {
            term IPSEC {
                from {
                    destination-address {
                        $TLB_VIP/32;
                    }
                }
                then {
                    count ipsec_tlb_traffic;
                    log;
                    routing-instance $TPROXY_VRF;
                }
            }
            term other_traffic {
                then {
                    count other_traffic;
                    accept;
                }
            }
        }
    }
}
```

## junos/high-availability/mnha-chassis-srg.conf

```
/*
 * Topic:   SRX Multinode High Availability (MNHA) chassis config — SRG0 active/active + SRG1 active/backup
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - local-id/peer-id define the two MNHA nodes; ICL runs over lo0.0 inside the MNHA-VR (routing/L3 mode).
 *  - vpn-profile references the HA-link-encryption VPN so ICL signalling is itself IPsec-protected.
 *  - SRG0 is always active on both nodes; SRG1 is active/backup with activeness-probe + BFD monitor.
 *  - active/backup signal-routes (192.168.255.0/.1) drive the export policies that (de)prefer the ARI/loopback routes.
 *  - managed-services ipsec + preemption + activeness-priority pick the active node deterministically.
 *
 * Pair with:
 *  - junos/high-availability/mnha-ha-link-encryption.conf — the vpn-profile referenced here
 *  - junos/high-availability/mnha-signal-route-policies.conf — consumes the signal-routes
 *  - junos/transport/bgp-srx-to-mx-scaleout.conf — MNHA-VR carries the ICL eBGP
 *  - junos/interfaces/srx-lo0-ike-anycast.conf — ICL peer-id runs over lo0.0
 *
 * Variables:
 *   $ACT_SIG      e.g. 192.168.255.0
 *   $BKP_SIG      e.g. 192.168.255.1
 *   $LOCAL_IP     e.g. 192.168.0.1
 *   $MONITOR_SRC  e.g. 10.1.1.2
 *   $MON_INT      e.g. ae1.0
 *   $PEER_IP      e.g. 192.168.0.2
 *   $PRIO         e.g. 200
 *   $PROBE_DEST   e.g. 10.1.1.1
 *   $PROBE_SRC    e.g. 192.168.10.1
 */
chassis {
    high-availability {
        local-id {
            1;
            local-ip $LOCAL_IP;
        }
        peer-id 2 {
            peer-ip $PEER_IP;
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
                2;
            }
        }
        services-redundancy-group 1 {
            peer-id {
                2;
            }
            activeness-probe {
                dest-ip {
                    $PROBE_DEST;
                    src-ip $PROBE_SRC;
                }
            }
            monitor {
                bfd-liveliness $PROBE_DEST {
                    src-ip $MONITOR_SRC;
                    session-type singlehop;
                    interface $MON_INT;
                }
            }
            active-signal-route {
                $ACT_SIG;
                routing-instance MNHA-VR;
            }
            backup-signal-route {
                $BKP_SIG;
                routing-instance MNHA-VR;
            }
            prefix-list ike_lo0;
            managed-services ipsec;
            preemption;
            activeness-priority $PRIO;
        }
    }
}
```

## junos/high-availability/mnha-ha-link-encryption.conf

```
/*
 * Topic:   MNHA inter-chassis-link encryption VPN (L3HA) protecting session/SA sync between nodes
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - ha-link-encryption wraps the MNHA ICL in its own IPsec tunnel (separate proposals/policies/gateway).
 *  - Referenced as vpn-profile L3HA_IPSEC_VPN from chassis high-availability peer-id.
 *  - Uses stronger DH group14 + sha-256 for the control-plane link; ESP AES-256-GCM for payload.
 *
 * Pair with:
 *  - junos/high-availability/mnha-chassis-srg.conf — references this VPN as vpn-profile
 *
 * Variables:
 *   $L3HA_PSK  e.g. <ascii-text-psk>
 */
security {
    ike {
        proposal L3HA_IKE_PROP {
            description l3ha_link_encr_tunnel;
            authentication-method pre-shared-keys;
            dh-group group14;
            authentication-algorithm sha-256;
            encryption-algorithm aes-256-cbc;
            lifetime-seconds 3600;
        }
        policy L3HA_IKE_POL {
            description l3ha_link_encr_tunnel;
            proposals L3HA_IKE_PROP;
            pre-shared-key ascii-text "$L3HA_PSK"; ## SECRET-DATA
        }
        gateway L3HA_IKE_GW {
            ike-policy L3HA_IKE_POL;
            version v2-only;
        }
    }
    ipsec {
        proposal L3HA_IPSEC_PROP {
            description l3ha_link_encr_tunnel;
            protocol esp;
            encryption-algorithm aes-256-gcm;
            lifetime-seconds 3600;
        }
        policy L3HA_IPSEC_POL {
            description l3ha_link_encr_tunnel;
            proposals L3HA_IPSEC_PROP;
        }
        vpn L3HA_IPSEC_VPN {
            ha-link-encryption;
            ike {
                gateway L3HA_IKE_GW;
                ipsec-policy L3HA_IPSEC_POL;
            }
        }
    }
}
```

## junos/high-availability/mnha-signal-route-policies.conf

```
/*
 * Topic:   MNHA active/backup route-signalling policies (ARI + loopback export gated on signal-route existence)
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - condition active_route_exists / backup_route_exists test for the MNHA signal-routes in MNHA-VR.inet.0.
 *  - On the active node ARI/loopback routes are advertised straight; on backup they are as-path-prepended (65000) to de-prefer.
 *  - A third term double-prepends as a catch-all so a split-brain still loses to the true active node.
 *  - prefix-lists pin the IKE anycast (ike_lo0), the TLB health-check source (active_probe_ip), and the MNHA loopback.
 *
 * Pair with:
 *  - junos/high-availability/mnha-chassis-srg.conf — sets the signal-routes these conditions test
 *  - junos/transport/bgp-srx-to-mx-scaleout.conf — BGP groups apply these export policies
 *  - junos/ipsec/srx-ipsec-vpn-aes256gcm.conf — source of the ari-ts routes
 *
 * Variables:
 *   $ACT_SIG   e.g. 192.168.255.0
 *   $BKP_SIG   e.g. 192.168.255.1
 *   $HC_SRC    e.g. 192.168.10.1
 *   $IKE_VIP   e.g. 10.100.0.1
 *   $MNHA_LO0  e.g. 192.168.0.1
 *   $SRX_AS    e.g. 65000
 */
policy-options {
    prefix-list active_probe_ip {
        $HC_SRC/32;
    }
    prefix-list ike_lo0 {
        $IKE_VIP/32;
    }
    prefix-list mnha_lo0 {
        $MNHA_LO0/32;
    }
    policy-statement ari_export_untrust {
        term 1 {
            from { protocol ari-ts; condition active_route_exists; }
            then accept;
        }
        term 2 {
            from { protocol ari-ts; condition backup_route_exists; }
            then { as-path-prepend $SRX_AS; accept; }
        }
        term 3 {
            from protocol ari-ts;
            then { as-path-prepend "$SRX_AS $SRX_AS"; accept; }
        }
        term default { then reject; }
    }
    policy-statement loopback_export_trust {
        term 1 {
            from { prefix-list active_probe_ip; condition active_route_exists; }
            then accept;
        }
        term 2 {
            from { prefix-list active_probe_ip; condition backup_route_exists; }
            then { as-path-prepend $SRX_AS; accept; }
        }
        term 3 {
            from { prefix-list active_probe_ip; }
            then { as-path-prepend "$SRX_AS $SRX_AS"; accept; }
        }
        term defualt { then reject; }
    }
    policy-statement mnha_ip {
        term 1 {
            from { route-filter $MNHA_LO0/32 exact; }
            then { next-hop self; accept; }
        }
        term 2 { then reject; }
    }
    condition active_route_exists {
        if-route-exists {
            address-family {
                inet {
                    $ACT_SIG/32;
                    table MNHA-VR.inet.0;
                }
            }
        }
    }
    condition backup_route_exists {
        if-route-exists {
            address-family {
                inet {
                    $BKP_SIG/32;
                    table MNHA-VR.inet.0;
                }
            }
        }
    }
}
```

## junos/interfaces/mx-ae-fbf-uni.conf

```
/*
 * Topic:   MX north-side AC (flexible-ethernet-services) with the IPsec FBF filter + TLB health-check loopback
 * Seen on:
 *   Junos: mx1_mx304
 *
 * Highlights:
 *  - ae10 uses flexible-vlan-tagging + flexible-ethernet-services to carry both TRUST (.40) and UNTRUST (.80) VLANs to the GW.
 *  - The IPSEC_LB filter is applied as input on the UNTRUST-facing unit to redirect IKE traffic into the tproxy instance.
 *  - lo0.1 hosts the TLB health-check source address used to probe the SRX real-services.
 *
 * Pair with:
 *  - junos/firewall/fbf-ipsec-lb-redirect.conf — the input filter applied here
 *  - junos/load-balancing/tlb-ipsec-dsr.conf — TLB uses lo0.1 as health-check source
 *
 * Variables:
 *   $HC_SRC           e.g. 192.168.10.251/32
 *   $TRUST_VLAN_IP    e.g. 172.16.1.1/30
 *   $UNI_AE           e.g. ae10
 *   $UNTRUST_VLAN_IP  e.g. 172.16.2.1/30
 */
interfaces {
    $UNI_AE {
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
        unit 40 {
            vlan-id 40;
            family inet {
                filter {
                    input IPSEC_LB;
                }
                address $TRUST_VLAN_IP;
            }
        }
        unit 80 {
            vlan-id 80;
            family inet {
                address $UNTRUST_VLAN_IP;
            }
        }
    }
    lo0 {
        unit 1 {
            family inet {
                address $HC_SRC;
            }
        }
    }
}
```

## junos/interfaces/mx-ae-scaleout-subunits.conf

```
/*
 * Topic:   MX aggregated-ethernet sub-units per plane (TRUST .0 / UNTRUST .1 / MNHA .100)
 * Seen on:
 *   Junos: mx1_mx304
 *
 * Highlights:
 *  - One physical AE per SRX/MNHA node; three vlan-tagged sub-units carve TRUST (.0), UNTRUST (.1), MNHA-ICL (.100).
 *  - mtu 9130 with LACP active/periodic-fast; minimum-links 1 keeps the bundle up on a single member.
 *  - /30 point-to-point addressing per plane per SRX neighbor.
 *
 * Pair with:
 *  - junos/transport/bgp-mx-vrf-scaleout.conf — the VRFs these sub-units are bound to
 *
 * Variables:
 *   $AE          e.g. ae1
 *   $MNHA_IP     e.g. 10.3.1.1/30
 *   $TRUST_IP    e.g. 10.1.1.1/30
 *   $UNTRUST_IP  e.g. 10.2.1.1/30
 */
interfaces {
    $AE {
        vlan-tagging;
        mtu 9130;
        aggregated-ether-options {
            minimum-links 1;
            lacp {
                active;
                periodic fast;
            }
        }
        unit 0 {
            vlan-id 1;
            family inet {
                address $TRUST_IP;
            }
        }
        unit 1 {
            vlan-id 2;
            family inet {
                address $UNTRUST_IP;
            }
        }
        unit 100 {
            vlan-id 100;
            family inet {
                address $MNHA_IP;
            }
        }
    }
}
```

## junos/interfaces/mx-initiator-ams-lo0-st0.conf

```
/*
 * Topic:   MX initiator interfaces: AMS member bundle, multi-address lo0 endpoints, and st0 tunnels
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *
 * Highlights:
 *  - ams1 aggregates mams- member interfaces with disable-hash on inside/outside service units.
 *  - lo0.0 hosts all initiator local-endpoints as separate /32 addresses (one per gateway).
 *  - st0.x are the route-based tunnel interfaces bound by the initiator IPsec VPNs.
 *
 * Pair with:
 *  - junos/ipsec/mx-ams-service-set.conf — service-sets that reference the AMS units
 *  - junos/ipsec/mx-ike-ipsec-initiator.conf — lo0/st0 endpoints of the initiator VPNs
 *
 * Variables:
 *   $AMS       e.g. ams1
 *   $LOCAL_EP  e.g. 10.200.0.1
 */
interfaces {
    $AMS {
        load-balancing-options {
            member-interface mams-3/0/0;
            member-interface mams-3/1/0;
            member-failure-options {
                drop-member-traffic {
                    rejoin-timeout 0;
                    enable-rejoin;
                }
            }
        }
        unit 1 {
            family inet;
            service-domain inside;
            load-balancing-options { disable-hash; }
        }
        unit 2001 {
            family inet;
            service-domain outside;
            load-balancing-options { disable-hash; }
        }
    }
    lo0 {
        unit 0 {
            family inet {
                address $LOCAL_EP/32;
                /* ... one /32 per initiator gateway ... */
            }
        }
    }
    st0 {
        unit 1 {
            family inet;
        }
    }
}
```

## junos/interfaces/srx-ae-scaleout-subunits.conf

```
/*
 * Topic:   SRX aggregated-ethernet sub-units per plane (TRUST .0 / UNTRUST .1 / MNHA .100)
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - Single AE to the MX with three vlan-tagged sub-units: TRUST (.0), UNTRUST (.1), MNHA-ICL (.100).
 *  - Mirrors the MX-side AE sub-unit scheme; /30 p2p per plane; mtu 9130, LACP active/periodic-fast.
 *
 * Pair with:
 *  - junos/transport/bgp-srx-to-mx-scaleout.conf — the eBGP groups over these sub-units
 *  - junos/security/srx-zones-scaleout.conf — sub-units bound to zones
 *
 * Variables:
 *   $AE          e.g. ae1
 *   $MNHA_IP     e.g. 10.3.1.2/30
 *   $TRUST_IP    e.g. 10.1.1.2/30
 *   $UNTRUST_IP  e.g. 10.2.1.2/30
 */
interfaces {
    $AE {
        vlan-tagging;
        mtu 9130;
        aggregated-ether-options {
            minimum-links 1;
            lacp {
                active;
                periodic fast;
            }
        }
        unit 0 {
            vlan-id 1;
            family inet {
                address $TRUST_IP;
            }
        }
        unit 1 {
            vlan-id 2;
            family inet {
                address $UNTRUST_IP;
            }
        }
        unit 100 {
            vlan-id 100;
            family inet {
                address $MNHA_IP;
            }
        }
    }
}
```

## junos/interfaces/srx-lo0-ike-anycast.conf

```
/*
 * Topic:   SRX loopbacks: MNHA node ID (lo0.0) + shared anycast IKE endpoint & TLB health-check (lo0.1)
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - lo0.0 carries the unique MNHA node IP (primary) inside the MNHA-VR / ICL zone.
 *  - lo0.1 carries BOTH the shared anycast IKE VIP ($IKE_VIP, identical on every SRX) and the unique TLB health-check IP ($HC_SRC).
 *  - The anycast VIP is what makes responder-only auto-VPN scale; the health-check IP is what TLB probes.
 *
 * Pair with:
 *  - junos/ipsec/srx-ike-gateway-avpn-responder.conf — external-interface lo0.1
 *  - junos/high-availability/mnha-chassis-srg.conf — ICL over lo0.0
 *
 * Variables:
 *   $HC_SRC        e.g. 192.168.10.1
 *   $IKE_VIP       e.g. 10.100.0.1
 *   $MNHA_NODE_IP  e.g. 192.168.0.1
 */
interfaces {
    lo0 {
        unit 0 {
            family inet {
                address $MNHA_NODE_IP/32 {
                    primary;
                }
            }
        }
        unit 1 {
            family inet {
                address $IKE_VIP/32;
                address $HC_SRC/32;
            }
        }
    }
}
```

## junos/interfaces/srx-st0-tunnels.conf

```
/*
 * Topic:   SRX secure tunnel (st0) units for the IPsec VPNs
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - One st0 unit per bound IPsec VPN; family inet only (route-based VPN).
 *  - st0 units live in the untrust zone and carry the decrypted post-ESP traffic.
 *
 * Pair with:
 *  - junos/ipsec/srx-ipsec-vpn-aes256gcm.conf — VPNs bound to these units
 *  - junos/security/srx-zones-scaleout.conf — st0 in the untrust zone
 *
 * Variables:
 *   (none)
 */
interfaces {
    st0 {
        unit 1 {
            family inet;
        }
        unit 2 {
            family inet;
        }
        unit 3 {
            family inet;
        }
    }
}
```

## junos/ipsec/mx-ams-service-set.conf

```
/*
 * Topic:   MX AMS (aggregated multiservices) service-sets binding the initiator IPsec VPNs
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *
 * Highlights:
 *  - next-hop-service service-sets pair an inside + outside AMS logical interface per IPsec VPN.
 *  - AMS bundle (ams1) load-balances across member mams- interfaces with drop-member-traffic/rejoin.
 *  - This is the MX Adaptive-Services form of IPsec (distinct from the SRX security-stanza IPsec).
 *
 * Pair with:
 *  - junos/ipsec/mx-ike-ipsec-initiator.conf — the ipsec-vpn referenced by each service-set
 *  - junos/interfaces/mx-initiator-ams-lo0-st0.conf — the AMS member/logical interfaces
 *
 * Variables:
 *   $AMS  e.g. ams1
 */
services {
    service-set IPSEC_TUN_1 {
        next-hop-service {
            inside-service-interface $AMS.1;
            outside-service-interface $AMS.2001;
        }
        ipsec-vpn TUN_1;
    }
    /* ... one service-set per tunnel (IPSEC_TUN_2..N) ... */
}
```

## junos/ipsec/mx-ike-ipsec-initiator.conf

```
/*
 * Topic:   MX-based IPsec INITIATOR: per-tunnel IKE gateways + IPsec VPNs toward the SRX anycast VIP
 * Seen on:
 *   Junos: ipsec_initiator_gateway_mx304
 *
 * Highlights:
 *  - Initiator side of the test harness: N gateways each initiate to the SAME SRX anycast VIP ($SRX_VIP) from a unique local-address.
 *  - establish-tunnels immediately brings tunnels up at commit (no traffic trigger) for deterministic testing.
 *  - Per-tunnel traffic-selectors (unique /32 client<->server) exercise ARI on the responder side.
 *  - remote-identity hostname matches the SRX group local-identity so all initiators land on the anycast group.
 *
 * Pair with:
 *  - junos/ipsec/mx-ams-service-set.conf — service-sets that carry these VPNs
 *  - junos/interfaces/mx-initiator-ams-lo0-st0.conf — AMS/lo0/st0 the initiator binds
 *
 * JVD peer devices (observed interop):
 *   Junos: srx1a_srx4600
 *
 * Variables:
 *   $INIT_ID    e.g. peer1.juniper.net
 *   $INIT_PSK   e.g. <ascii-text-psk>
 *   $LOCAL_EP   e.g. 10.200.0.1
 *   $REMOTE_ID  e.g. vsrx.juniper.net
 *   $SRX_VIP    e.g. 10.100.0.1
 *   $TS_LOCAL   e.g. 172.80.0.1/32
 *   $TS_REMOTE  e.g. 172.160.0.1/32
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
            pre-shared-key ascii-text "$INIT_PSK"; ## SECRET-DATA
        }
        gateway IKE_GW_1 {
            ike-policy IKE_POLICY;
            address $SRX_VIP;
            dead-peer-detection {
                probe-idle-tunnel;
                interval 10;
                threshold 3;
            }
            local-identity hostname $INIT_ID;
            remote-identity hostname $REMOTE_ID;
            external-interface lo0.0;
            local-address $LOCAL_EP;
            version v2-only;
        }
        /* ... one gateway per initiator (IKE_GW_2..N), each with a unique local-address ... */
    }
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
                local-ip $TS_LOCAL;
                remote-ip $TS_REMOTE;
            }
            establish-tunnels immediately;
        }
        /* ... one vpn per tunnel (TUN_2..N) ... */
        anti-replay-window-size 512;
    }
    flow {
        power-mode-ipsec;
    }
}
```

## junos/ipsec/srx-ike-gateway-avpn-responder.conf

```
/*
 * Topic:   SRX auto-VPN IKE gateway (responder-only, group-ike-id) on the shared anycast endpoint
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - Responder-only auto-VPN: a single dynamic gateway with group-ike-id serves ALL remote peers — the key to scaling out.
 *  - external-interface is the shared anycast loopback ($IKE_VIP); every SRX in the group listens on the same IP.
 *  - dynamic hostname wildcard (.juniper.net) + local-identity hostname authenticate the group; v2-only.
 *  - Dead Peer Detection (probe-idle-tunnel) reaps stale tunnels after a service-node failover/renegotiation.
 *  - pre-shared-key is templated ($IKE_PSK); PKI works identically but is not exercised here.
 *
 * Pair with:
 *  - junos/ipsec/srx-ipsec-vpn-aes256gcm.conf — the IPsec VPN that binds this gateway
 *  - junos/interfaces/srx-lo0-ike-anycast.conf — hosts the anycast IKE endpoint
 *  - junos/security/srx-zones-scaleout.conf — untrust zone permits IKE host-inbound
 *
 * JVD peer devices (observed interop):
 *   Junos: ipsec_initiator_gateway_mx304
 *
 * Variables:
 *   $IKE_HC_INT  e.g. lo0.1
 *   $IKE_PSK     e.g. <ascii-text-psk>
 *   $IKE_VIP     e.g. 10.100.0.1
 *   $LOCAL_ID    e.g. vsrx.juniper.net
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
            pre-shared-key ascii-text "$IKE_PSK"; ## SECRET-DATA
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
            local-identity hostname $LOCAL_ID;
            external-interface $IKE_HC_INT;
            local-address $IKE_VIP;
            version v2-only;
        }
    }
}
```

## junos/ipsec/srx-ipsec-vpn-aes256gcm.conf

```
/*
 * Topic:   SRX IPsec VPN (ESP AES-256-GCM) bound to a secure tunnel with a wildcard traffic-selector
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - ESP with AES-256-GCM (AEAD) — the de-facto standard; single proposal keeps every tunnel identical.
 *  - traffic-selector local/remote 0.0.0.0/0 triggers Auto-Route-Injection (ARI) of the negotiated inner prefixes.
 *  - bind-interface st0.x tie the VPN to a secure tunnel unit; anti-replay-window-size 512 sized for reordering.
 *  - The ARI routes are what steer return traffic back to the SRX holding the SA.
 *
 * Pair with:
 *  - junos/ipsec/srx-ike-gateway-avpn-responder.conf — the IKE gateway this VPN references
 *  - junos/interfaces/srx-st0-tunnels.conf — the st0 unit bound here
 *  - junos/high-availability/mnha-signal-route-policies.conf — exports the ARI routes
 *
 * Variables:
 *   $ST_UNIT  e.g. st0.1
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
        vpn avpn_ipsec_vpn {
            bind-interface $ST_UNIT;
            ike {
                gateway avpn_ike_gw;
                ipsec-policy IPSEC_POLICY;
            }
            traffic-selector ts {
                local-ip 0.0.0.0/0;
                remote-ip 0.0.0.0/0;
            }
        }
        anti-replay-window-size 512;
    }
}
```

## junos/load-balancing/network-monitoring-profiles.conf

```
/*
 * Topic:   TLB health-check profiles (ICMP + TCP) for scale-out SRX liveness
 * Seen on:
 *   Junos: mx1_mx304
 *
 * Highlights:
 *  - ICMP profile is the default liveness check; TCP profile probes the SRX web-management port (8088).
 *  - probe-interval 1s with failure-retries 5 / recovery-retries 1 balances fast detection vs flap.
 *  - Referenced by the TLB group via network-monitoring-profile.
 *
 * Pair with:
 *  - junos/load-balancing/tlb-ipsec-dsr.conf — the TLB instance that references these profiles
 *
 * Variables:
 *   $TCP_PORT  e.g. 8088
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
                port $TCP_PORT;
            }
            probe-interval 1;
            failure-retries 5;
            recovery-retries 1;
        }
    }
}
```

## junos/load-balancing/tlb-ipsec-dsr.conf

```
/*
 * Topic:   RE-based Traffic Load Balancer (TLB) for scale-out IPsec, Direct Server Return mode
 * Seen on:
 *   Junos: mx1_mx304
 *
 * Highlights:
 *  - routing-engine-mode is REQUIRED on MX304/MX10000 (TLB control runs on the RE, not a service card).
 *  - Direct Server Return (DSR): only client->server traffic traverses TLB; server->client is routed directly.
 *  - source-ip hash keeps a subscriber's flows pinned to the same SRX/MNHA pair in both directions.
 *  - virtual-service address is the shared IKE anycast VIP; it lives in the forwarding instance $TPROXY_VRF.
 *  - real-service addresses are the per-MNHA-pair health-check/anchor IPs, reachable via the TLB client/server VRF.
 *
 * Pair with:
 *  - junos/load-balancing/network-monitoring-profiles.conf — TLB health-check profiles
 *  - junos/transport/forwarding-instance-tproxy.conf — VIP lives in this forwarding instance
 *  - junos/firewall/fbf-ipsec-lb-redirect.conf — steers IPsec traffic into the tproxy instance
 *  - junos/interfaces/mx-ae-fbf-uni.conf — lo0.1 provides the TLB health-check source
 *
 * Variables:
 *   $HC_INT      e.g. lo0.1
 *   $LB_VRF      e.g. TRUST_VR
 *   $REAL1       e.g. 192.168.10.1
 *   $REAL2       e.g. 192.168.10.2
 *   $TLB_VIP     e.g. 10.100.0.1
 *   $TPROXY_VRF  e.g. srx-tproxy-fi
 */
services {
    traffic-load-balance {
        routing-engine-mode;
        instance ipsec_lb {
            interface $HC_INT;
            client-vrf $LB_VRF;
            server-vrf $LB_VRF;
            group mnha_srx_group {
                real-services [ MNHA_SRX1 MNHA_SRX2 ];
                routing-instance $LB_VRF;
                network-monitoring-profile [ icmp-profile tcp-profile1 ];
            }
            real-service MNHA_SRX1 {
                address $REAL1;
            }
            real-service MNHA_SRX2 {
                address $REAL2;
            }
            virtual-service mnha_srx_vip {
                mode direct-server-return;
                address $TLB_VIP;
                routing-instance $TPROXY_VRF;
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

## junos/policy/mx-scaleout-export-policies.conf

```
/*
 * Topic:   MX export policies and route-filter-lists for scale-out (ARI, default, next-hop-self, per-packet LB)
 * Seen on:
 *   Junos: mx1_mx304
 *
 * Highlights:
 *  - ipsec_ari_route_export re-advertises the SRX Auto-Route-Injection (ARI) client prefixes north on UNTRUST.
 *  - untrust-to-trust-export / MX1-to-SRX_trust_export set next-hop self toward the SRX peers.
 *  - pplb (per-packet load balance) is applied via forwarding-table export to spread ECMP in the PFE.
 *  - route-filter-lists scope the ARI (client) and IKE-source prefixes advertised across the complex.
 *
 * Pair with:
 *  - junos/transport/bgp-mx-vrf-scaleout.conf — BGP groups that apply these policies
 *
 * Variables:
 *   $ARI_CLIENT_PFX  e.g. 172.80.0.0/16
 *   $HC_SRC          e.g. 192.168.10.251/32
 *   $IKE_SRC_PFX     e.g. 10.200.0.0/16
 */
policy-options {
    route-filter-list ari_route_rt_list {
        $ARI_CLIENT_PFX orlonger;
    }
    route-filter-list ike_source_endpoint_rt_list {
        $IKE_SRC_PFX orlonger;
    }
    policy-statement MX1-to-SRX_trust_export {
        term lb_hc_source_ip_export {
            from {
                protocol direct;
                route-filter $HC_SRC exact;
            }
            then accept;
        }
        term ike_source_endpoint_route_export {
            from {
                protocol bgp;
                route-filter-list ike_source_endpoint_rt_list;
            }
            then { next-hop self; accept; }
        }
        term reject { then reject; }
    }
    policy-statement default_export {
        term 1 {
            from {
                protocol static;
                route-filter 0.0.0.0/0 exact;
            }
            then { next-hop self; accept; }
        }
        term 2 { then reject; }
    }
    policy-statement ipsec_ari_route_export {
        term 1 {
            from {
                protocol bgp;
                route-filter-list ari_route_rt_list;
            }
            then { next-hop self; accept; }
        }
        term 3 { then reject; }
    }
    policy-statement mnha-mx-to-srx-export {
        term 1 { from protocol bgp; then { next-hop self; accept; } }
        term 2 { then reject; }
    }
    policy-statement pplb {
        term t1 { then { load-balance per-packet; accept; } }
    }
    policy-statement untrust-to-trust-export {
        term 1 { from protocol [ bgp static ]; then { next-hop self; accept; } }
        term 2 { then reject; }
    }
}
```

## junos/security/srx-policies-ipsec-data.conf

```
/*
 * Topic:   SRX security policies + address-book for scale-out IPsec data and MNHA ICL
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - IPSEC_DATA_C2S/S2C permit the decrypted client<->server prefixes intra-untrust-zone.
 *  - RE-ESP-BLOCK denies ESP to the RE (application ESP) while RE-ALLOW permits everything else intra-trust.
 *  - MNHA-ICL-ALLOW permits the MNHA loopback /24 for inter-chassis signalling.
 *  - address-book names encode the prefix for readability; applications ESP defines the custom ESP app.
 *
 * Pair with:
 *  - junos/security/srx-zones-scaleout.conf — the zones referenced by these policies
 *
 * Variables:
 *   $CLIENT_PFX   e.g. 172.80.0.0/16
 *   $IKE_SRC_PFX  e.g. 10.200.0.0/16
 *   $MNHA_PFX     e.g. 192.168.0.0/24
 *   $SERVER_PFX   e.g. 172.160.0.0/16
 */
security {
    address-book {
        global {
            address mnha_lo0_prefix_192.168.0.0/24 $MNHA_PFX;
            address ike_source_prefix_10.200.0.0/16 $IKE_SRC_PFX;
            address ipsec_data_client_prefix_172.80.0.0/16 $CLIENT_PFX;
            address ipsec_data_server_prefix_172.160.0.0/16 $SERVER_PFX;
        }
    }
    policies {
        from-zone vr-1_trust_zone to-zone vr-1_trust_zone {
            policy RE-ESP-BLOCK {
                match {
                    source-address any;
                    destination-address any;
                    application ESP;
                }
                then { deny; }
            }
            policy RE-ALLOW {
                match {
                    source-address any;
                    destination-address any;
                    application any;
                }
                then { permit; }
            }
        }
        from-zone trust_zone_mnha to-zone trust_zone_mnha {
            policy MNHA-ICL-ALLOW {
                match {
                    source-address mnha_lo0_prefix_192.168.0.0/24;
                    destination-address mnha_lo0_prefix_192.168.0.0/24;
                    application any;
                }
                then { permit; }
            }
        }
        from-zone vr-1_untrust_zone to-zone vr-1_untrust_zone {
            policy IPSEC_DATA_C2S_POLICY {
                match {
                    source-address ipsec_data_client_prefix_172.80.0.0/16;
                    destination-address ipsec_data_server_prefix_172.160.0.0/16;
                    application any;
                }
                then { permit; }
            }
            policy IPSEC_DATA_S2C_POLICY {
                match {
                    source-address ipsec_data_server_prefix_172.160.0.0/16;
                    destination-address ipsec_data_client_prefix_172.80.0.0/16;
                    application any;
                }
                then { permit; }
            }
        }
    }
}
applications {
    application ESP protocol esp;
}
```

## junos/security/srx-zones-scaleout.conf

```
/*
 * Topic:   SRX security zones for the scale-out planes (trust / untrust / MNHA-ICL)
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - vr-1_trust_zone (clear-text/inside) binds ae1.0 + the anycast loopback lo0.1.
 *  - vr-1_untrust_zone (IPsec/outside) binds st0.x + ae1.1; this is where IKE/ESP land.
 *  - trust_zone_mnha isolates the ICL (ae1.100 + lo0.0) for MNHA signalling.
 *  - host-inbound all system-services/protocols is a lab convenience — tighten for production.
 *
 * Pair with:
 *  - junos/security/srx-policies-ipsec-data.conf — policies between these zones
 *  - junos/interfaces/srx-ae-scaleout-subunits.conf — the sub-units bound to each zone
 *  - junos/ipsec/srx-ike-gateway-avpn-responder.conf — untrust zone terminates IKE
 *  - junos/interfaces/srx-st0-tunnels.conf — st0 units bound in the untrust zone
 *
 * Variables:
 *   (none)
 */
security {
    zones {
        security-zone vr-1_trust_zone {
            host-inbound-traffic {
                system-services { all; }
                protocols { all; }
            }
            interfaces {
                ae1.0;
                lo0.1;
            }
        }
        security-zone vr-1_untrust_zone {
            host-inbound-traffic {
                system-services { all; }
                protocols { all; }
            }
            interfaces {
                st0.1;
                ae1.1;
            }
        }
        security-zone trust_zone_mnha {
            host-inbound-traffic {
                system-services { all; }
                protocols { all; }
            }
            interfaces {
                ae1.100;
                lo0.0;
            }
        }
    }
}
```

## junos/transport/bgp-mx-vrf-scaleout.conf

```
/*
 * Topic:   MX scale-out VRFs (TRUST/UNTRUST/MNHA) with per-zone eBGP to the SRX farm
 * Seen on:
 *   Junos: mx1_mx304
 *
 * Highlights:
 *  - Three virtual-routers segregate planes: TRUST_VR (clear-text/inside), UNTRUST_VR (IPsec/outside), MNHA-VR (ICL signalling).
 *  - as-override on the TRUST MX-to-SRX group lets all SRX share the same local-as ($SRX_AS) while remaining distinct BGP peers.
 *  - multipath + BFD (300ms x3) across the SRX neighbors gives ECMP spray and sub-second failure detection.
 *  - Each SRX is a distinct neighbor on both TRUST and UNTRUST sub-interfaces; the GW router peers on the north side.
 *
 * Pair with:
 *  - junos/policy/mx-scaleout-export-policies.conf — the export policies referenced by these BGP groups
 *  - junos/interfaces/mx-ae-scaleout-subunits.conf — the ae sub-units bound to each VRF
 *  - junos/transport/forwarding-instance-tproxy.conf — the companion forwarding instance
 *
 * Variables:
 *   $GW_TRUST_AS    e.g. 65100
 *   $GW_UNTRUST_AS  e.g. 65300
 *   $MNHA_AS        e.g. 65050
 *   $MX_AS          e.g. 10000
 *   $SRX_AS         e.g. 65000
 *   $TRUST_AS       e.g. 65200
 *   $UNTRUST_AS     e.g. 65400
 */
routing-instances {
    MNHA-VR {
        instance-type virtual-router;
        protocols {
            bgp {
                group mnha_pair_1_A_icl_ebgp {
                    type external;
                    export mnha-mx-to-srx-export;
                    peer-as 65001;
                    local-as $MNHA_AS;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor 10.3.1.2 {
                        local-address 10.3.1.1;
                    }
                }
                group mnha_pair_1_B_icl_ebgp {
                    type external;
                    export mnha-mx-to-srx-export;
                    peer-as 65002;
                    local-as $MNHA_AS;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor 10.3.2.2 {
                        local-address 10.3.2.1;
                    }
                }
                group mnha_pair_2_A_icl_ebgp {
                    type external;
                    export mnha-mx-to-srx-export;
                    peer-as 65001;
                    local-as $MNHA_AS;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor 10.3.3.2 {
                        local-address 10.3.3.1;
                    }
                }
                group mnha_pair_2_B_icl_ebgp {
                    type external;
                    export mnha-mx-to-srx-export;
                    peer-as 65002;
                    local-as $MNHA_AS;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor 10.3.4.2 {
                        local-address 10.3.4.1;
                    }
                }
            }
        }
        interface ae1.100;
        interface ae2.100;
        interface ae3.100;
        interface ae4.100;
    }
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
                    export MX1-to-SRX_trust_export;
                    peer-as $SRX_AS;
                    local-as $TRUST_AS;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    as-override;
                    neighbor 10.1.1.2 { description "to SRX1A"; }
                    neighbor 10.1.2.2 { description "to SRX1B"; }
                    neighbor 10.1.3.2 { description "to SRX2A"; }
                    neighbor 10.1.4.2 { description "to SRX2B"; }
                }
                group MX2-to-GW_Router {
                    type external;
                    export default_export;
                    peer-as $GW_TRUST_AS;
                    local-as $TRUST_AS;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor 172.16.1.2;
                }
                multipath;
            }
        }
        interface ae1.0;
        interface ae2.0;
        interface ae3.0;
        interface ae4.0;
        interface ae10.40;
        interface lo0.1;
    }
    UNTRUST_VR {
        instance-type virtual-router;
        protocols {
            bgp {
                group MX1-to-SRX {
                    type external;
                    export untrust-to-trust-export;
                    peer-as $SRX_AS;
                    local-as $UNTRUST_AS;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor 10.2.1.2 { description "to SRX1A"; }
                    neighbor 10.2.2.2 { description "to SRX1B"; }
                    neighbor 10.2.3.2 { description "to SRX2A"; }
                    neighbor 10.2.4.2 { description "to SRX2B"; }
                }
                group MX2-to-UNTRUST_GW_Router {
                    type external;
                    export ipsec_ari_route_export;
                    peer-as $GW_UNTRUST_AS;
                    local-as $UNTRUST_AS;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor 172.16.2.2;
                }
            }
        }
        interface ae1.1;
        interface ae2.1;
        interface ae3.1;
        interface ae4.1;
        interface ae10.80;
    }
}
routing-options {
    autonomous-system $MX_AS;
    nonstop-routing;
    forwarding-table {
        export pplb;
    }
}
```

## junos/transport/bgp-srx-to-mx-scaleout.conf

```
/*
 * Topic:   SRX eBGP to the MX load balancer per plane (TRUST/UNTRUST) + MNHA-VR ICL peering
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - Two master-instance eBGP groups: SRX-to-MX_TRUST (exports loopback_export_trust) and SRX-to-MX_UNTRUST (exports ari_export_untrust).
 *  - All SRX share local-as $SRX_AS; the MX as-override lets them peer as distinct neighbors.
 *  - MNHA-VR runs a separate eBGP (local-as $MNHA_AS) for the inter-chassis-link signalling plane.
 *  - forwarding-table export ecmp_policy_lab enables per-packet spray; BFD 300ms x3 everywhere.
 *
 * Pair with:
 *  - junos/high-availability/mnha-signal-route-policies.conf — export policies applied here
 *  - junos/interfaces/srx-ae-scaleout-subunits.conf — the sub-units these groups peer over
 *  - junos/high-availability/mnha-chassis-srg.conf — MNHA-VR carries the ICL eBGP
 *
 * JVD peer devices (observed interop):
 *   Junos: mx1_mx304
 *
 * Variables:
 *   $MNHA_AS        e.g. 65001
 *   $MX_MNHA_AS     e.g. 65050
 *   $MX_TRUST_AS    e.g. 65200
 *   $MX_UNTRUST_AS  e.g. 65400
 *   $SRX_AS         e.g. 65000
 */
routing-instances {
    MNHA-VR {
        instance-type virtual-router;
        protocols {
            bgp {
                group mnha-ibgp {
                    type external;
                    export mnha_ip;
                    peer-as $MX_MNHA_AS;
                    local-as $MNHA_AS;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor 10.3.1.1 {
                        local-address 10.3.1.2;
                    }
                }
            }
        }
        interface ae1.100;
        interface lo0.0;
    }
}
protocols {
    bgp {
        group SRX-to-MX_TRUST {
            type external;
            export loopback_export_trust;
            local-as $SRX_AS;
            bfd-liveness-detection {
                minimum-interval 300;
                minimum-receive-interval 300;
                multiplier 3;
            }
            neighbor 10.1.1.1 {
                local-address 10.1.1.2;
                peer-as $MX_TRUST_AS;
            }
        }
        group SRX-to-MX_UNTRUST {
            type external;
            export ari_export_untrust;
            local-as $SRX_AS;
            bfd-liveness-detection {
                minimum-interval 300;
                minimum-receive-interval 300;
                multiplier 3;
            }
            neighbor 10.2.1.1 {
                local-address 10.2.1.2;
                peer-as $MX_UNTRUST_AS;
            }
        }
        multipath;
    }
}
routing-options {
    forwarding-table {
        export ecmp_policy_lab;
    }
}
policy-options {
    policy-statement ecmp_policy_lab {
        then {
            load-balance per-packet;
        }
    }
}
```

## junos/transport/enhanced-hash-key-symmetric.conf

```
/*
 * Topic:   Symmetric enhanced-hash-key so dual-MX peers compute identical hashes
 * Seen on:
 *   Junos: mx1_mx304
 *
 * Highlights:
 *  - Required in the dual-MX topology: both MX must select the same next-hop for a given flow tuple.
 *  - Without symmetric hashing the two MX could pin the same subscriber to different SRX, breaking state symmetry.
 *
 * Pair with:
 *  (none derived)
 *
 * Variables:
 *   (none)
 */
forwarding-options {
    enhanced-hash-key {
        symmetric;
    }
}
```

## junos/transport/forwarding-instance-tproxy.conf

```
/*
 * Topic:   Forwarding routing-instance that anchors the TLB virtual-service (transparent proxy)
 * Seen on:
 *   Junos: mx1_mx304
 *
 * Highlights:
 *  - instance-type forwarding — no interfaces of its own; it holds the TLB VIP route programmed by TLB.
 *  - FBF steers IPsec traffic here; the TLB composite next-hop sprays it across the SRX group.
 *
 * Pair with:
 *  - junos/load-balancing/tlb-ipsec-dsr.conf — TLB virtual-service routing-instance
 *  - junos/firewall/fbf-ipsec-lb-redirect.conf — FBF redirect target
 *  - junos/transport/bgp-mx-vrf-scaleout.conf — companion scale-out VRFs on the MX
 *
 * Variables:
 *   $TPROXY_VRF  e.g. srx-tproxy-fi
 */
routing-instances {
    $TPROXY_VRF {
        instance-type forwarding;
    }
}
```

## _variables.md

# Snippet variable glossary

All `.conf` files under `junos/` are **templates**: identifiers that vary between
deployments are written as `$VAR`. Secrets (`## SECRET-DATA`) are replaced with
`$*_PSK` placeholders — supply your own encrypted values.

Render with:

    ~/git-scripts/snips_render.py <snip>.conf <vars.json>  > rendered.conf

Example values are drawn from the validated lab configs (see [`../conf/`](../conf/)).

## Autonomous systems

| Variable | What it is | Example |
|---|---|---|
| `$MX_AS` | MX global autonomous-system | `10000` |
| `$TRUST_AS` | MX TRUST_VR local-as (to SRX / GW) | `65200` |
| `$UNTRUST_AS` | MX UNTRUST_VR local-as (to SRX / GW) | `65400` |
| `$MNHA_AS` | MX MNHA-VR local-as (ICL eBGP) | `65050` |
| `$SRX_AS` | SRX local-as (shared across the scale-out farm) | `65000` |
| `$GW_TRUST_AS` / `$GW_UNTRUST_AS` | North-side GW router peer AS | `65100` / `65300` |
| `$MX_TRUST_AS` / `$MX_UNTRUST_AS` / `$MX_MNHA_AS` | MX peer AS as seen from the SRX | `65200` / `65400` / `65050` |

## Anycast endpoint & load-balancer

| Variable | What it is | Example |
|---|---|---|
| `$TLB_VIP` / `$IKE_VIP` / `$SRX_VIP` | Shared anycast IKE gateway VIP (TLB virtual-service) | `10.100.0.1` |
| `$REAL1` / `$REAL2` | Per-MNHA-pair TLB real-service (health-check/anchor) IP | `192.168.10.1` / `192.168.10.2` |
| `$LB_VRF` | TLB client/server VRF | `TRUST_VR` |
| `$TPROXY_VRF` | Forwarding instance holding the TLB VIP | `srx-tproxy-fi` |
| `$HC_INT` / `$IKE_HC_INT` | Loopback unit hosting the anycast/health-check IP | `lo0.1` |
| `$HC_SRC` | TLB health-check source IP on the SRX | `192.168.10.1` |
| `$TCP_PORT` | TCP health-check probe port (SRX web-management) | `8088` |

## Endpoints & identities

| Variable | What it is | Example |
|---|---|---|
| `$LOCAL_ID` / `$REMOTE_ID` | IKE local/remote hostname identity | `vsrx.juniper.net` |
| `$LOCAL_EP` / `$SRX_VIP` | Initiator local-address / responder anycast | `10.200.0.1` / `10.100.0.1` |
| `$INIT_ID` | Per-tunnel initiator hostname identity | `peer1.juniper.net` |
| `$MNHA_NODE_IP` / `$LOCAL_IP` / `$PEER_IP` | MNHA node loopback / local / peer IPs | `192.168.0.1` / `192.168.0.2` |

## Prefixes & traffic selectors

| Variable | What it is | Example |
|---|---|---|
| `$ARI_CLIENT_PFX` / `$CLIENT_PFX` | IPsec client (ARI) prefix | `172.80.0.0/16` |
| `$SERVER_PFX` | IPsec server-side prefix | `172.160.0.0/16` |
| `$IKE_SRC_PFX` | IKE source-endpoint prefix | `10.200.0.0/16` |
| `$MNHA_PFX` / `$MNHA_LO0` | MNHA loopback prefix / node /32 | `192.168.0.0/24` / `192.168.0.1` |
| `$TS_LOCAL` / `$TS_REMOTE` | Per-tunnel traffic-selector local/remote | `172.80.0.1/32` / `172.160.0.1/32` |

## Interfaces

| Variable | What it is | Example |
|---|---|---|
| `$AE` / `$UNI_AE` | Aggregated-ethernet bundle to the SRX / north GW | `ae1` / `ae10` |
| `$TRUST_IP` / `$UNTRUST_IP` / `$MNHA_IP` | Per-plane /30 point-to-point address | `10.1.1.1/30` |
| `$TRUST_VLAN_IP` / `$UNTRUST_VLAN_IP` | North-side AC per-VLAN address | `172.16.1.1/30` |
| `$ST_UNIT` | Secure tunnel unit bound to the IPsec VPN | `st0.1` |
| `$AMS` | MX aggregated-multiservices bundle (initiator) | `ams1` |
| `$MON_INT` | MNHA activeness BFD monitor interface | `ae1.0` |

## MNHA signalling

| Variable | What it is | Example |
|---|---|---|
| `$ACT_SIG` / `$BKP_SIG` | MNHA active / backup signal-route | `192.168.255.0` / `192.168.255.1` |
| `$PROBE_DEST` / `$PROBE_SRC` | SRG activeness-probe dest / src | `10.1.1.1` / `192.168.10.1` |
| `$MONITOR_SRC` | SRG BFD monitor source IP | `10.1.1.2` |
| `$PRIO` | SRG activeness-priority | `200` |

## Secrets (supply your own)

| Variable | What it is |
|---|---|
| `$IKE_PSK` | SRX responder / MX initiator IKE pre-shared key |
| `$L3HA_PSK` | MNHA HA-link-encryption pre-shared key |
| `$INIT_PSK` | Initiator IKE pre-shared key |

## byoai/TIERS.md

# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each device role at each verbosity tier. It is bundled into [`jvd-so-ipsec-snips.md`](jvd-so-ipsec-snips.md) by `regenerate-bundle.sh`.

For each role, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. Every device in this JVD is **Junos** (MX304 + SRX4600); there is no `evo/` tree.

---

## What the tiers mean

| Tier | Use when | What's included |
|---|---|---|
| **`minimum`** | Brownfield change. Device already has its scale-out BGP planes and interfaces. You just want the component. | The component's snips + its mandatory `Pair with:` snips. **No BGP/interfaces baseline.** |
| **`with-bgp`** | Brownfield-ish. Interfaces are up but you want to (re)assert the device's scale-out eBGP peering + export policies. | `minimum` + the role's scale-out BGP plane snip(s) + export policies + AE sub-units. |
| **`as-deployed`** | Greenfield turn-up, lab build, or "give me a working end-to-end example." Mirrors what the JVD validates. | Everything for the role: component + BGP planes + interfaces, plus (SRX) MNHA chassis + HA-link-encryption + signal policies, and (MX-LB) the FBF filter + symmetric enhanced-hash-key. |

> **Greenfield / bootstrap requests** are always treated as **`as-deployed`**.

---

## MX load balancer (`MX-LB`)

The MX304 stateless load balancer (`mx1_mx304`).

- **`minimum`**
  - `junos/load-balancing/tlb-ipsec-dsr.conf`
  - `junos/load-balancing/network-monitoring-profiles.conf`
  - `junos/transport/forwarding-instance-tproxy.conf`
  - `junos/firewall/fbf-ipsec-lb-redirect.conf`
  - `junos/interfaces/mx-ae-fbf-uni.conf`
- **`with-bgp`** — `minimum` +
  - `junos/transport/bgp-mx-vrf-scaleout.conf`
  - `junos/policy/mx-scaleout-export-policies.conf`
  - `junos/interfaces/mx-ae-scaleout-subunits.conf`
- **`as-deployed`** — `with-bgp` +
  - `junos/transport/enhanced-hash-key-symmetric.conf` (required for dual-MX)

## SRX IPsec Security Gateway (`SRX`)

An SRX4600 responder-only IPsec Security Gateway (`srx1a` … `srx2b`).

- **`minimum`**
  - `junos/ipsec/srx-ike-gateway-avpn-responder.conf`
  - `junos/ipsec/srx-ipsec-vpn-aes256gcm.conf`
  - `junos/interfaces/srx-lo0-ike-anycast.conf`
  - `junos/interfaces/srx-st0-tunnels.conf`
  - `junos/security/srx-zones-scaleout.conf`
  - `junos/security/srx-policies-ipsec-data.conf`
- **`with-bgp`** — `minimum` +
  - `junos/transport/bgp-srx-to-mx-scaleout.conf`
  - `junos/high-availability/mnha-signal-route-policies.conf`
  - `junos/interfaces/srx-ae-scaleout-subunits.conf`
- **`as-deployed`** — `with-bgp` + full MNHA:
  - `junos/high-availability/mnha-chassis-srg.conf`
  - `junos/high-availability/mnha-ha-link-encryption.conf`

## SRX Multinode High Availability (`srx-mnha` — add-on)

Add MNHA to an existing SRX gateway. Always emit all three together.

- **`minimum`** (== `as-deployed`)
  - `junos/high-availability/mnha-chassis-srg.conf`
  - `junos/high-availability/mnha-ha-link-encryption.conf`
  - `junos/high-availability/mnha-signal-route-policies.conf`

## MX IPsec initiator (`MX-INIT`)

The MX304 AMS-based IPsec initiator / test traffic source (`ipsec_initiator_gateway_mx304`).

- **`minimum`** (== `as-deployed`)
  - `junos/ipsec/mx-ike-ipsec-initiator.conf`
  - `junos/ipsec/mx-ams-service-set.conf`
  - `junos/interfaces/mx-initiator-ams-lo0-st0.conf`

## Add a feature

Single-purpose additions to an existing device.

- **Scale-out BGP plane** — MX: `junos/transport/bgp-mx-vrf-scaleout.conf` + `junos/policy/mx-scaleout-export-policies.conf`; SRX: `junos/transport/bgp-srx-to-mx-scaleout.conf` + `junos/high-availability/mnha-signal-route-policies.conf`
- **Filter-based forwarding redirect (MX)** — `junos/firewall/fbf-ipsec-lb-redirect.conf` + `junos/transport/forwarding-instance-tproxy.conf`
- **Symmetric hashing (dual-MX)** — `junos/transport/enhanced-hash-key-symmetric.conf`
- **TLB health-check profiles** — `junos/load-balancing/network-monitoring-profiles.conf`

## byoai/DEFAULTS.md

# Auto-fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default value for every `$VAR`, so `auto` mode (and the `all defaults` / `use defaults` / `skip` short-circuits) can generate without an interview. Values are drawn from the validated configs in [`../../conf/`](../../conf/). Bundled into [`jvd-so-ipsec-snips.md`](jvd-so-ipsec-snips.md) by `regenerate-bundle.sh`.

## Device selection shortcuts

| Shortcut | Device(s) | Role |
|---|---|---|
| `MX-LB` | `mx1_mx304` | MX304 stateless load balancer (TLB) |
| `SRX` | `srx1a` (+ `srx1b` as the MNHA peer) | SRX4600 IPsec Security Gateway |
| `MX-INIT` | `ipsec_initiator_gateway_mx304` | MX304 AMS IPsec initiator (test source) |

The SRX farm is two MNHA pairs: `srx1a`+`srx1b`, `srx2a`+`srx2b`.

## Anycast endpoint & load balancer

| Variable | Default |
|---|---|
| `$TLB_VIP` / `$IKE_VIP` / `$SRX_VIP` | `10.100.0.1` (shared anycast IKE gateway) |
| `$REAL1` / `$REAL2` | `192.168.10.1` / `192.168.10.2` |
| `$LB_VRF` | `TRUST_VR` |
| `$TPROXY_VRF` | `srx-tproxy-fi` |
| `$HC_INT` / `$IKE_HC_INT` | `lo0.1` |
| `$HC_SRC` | `192.168.10.1` (SRX health-check IP); `192.168.10.251/32` (MX health-check source) |
| `$TCP_PORT` | `8088` |

## Autonomous systems

| Variable | Default |
|---|---|
| `$MX_AS` | `10000` |
| `$TRUST_AS` / `$UNTRUST_AS` / `$MNHA_AS` (MX side) | `65200` / `65400` / `65050` |
| `$SRX_AS` | `65000` (shared across the SRX farm) |
| `$MNHA_AS` (SRX MNHA-VR) | `65001` (pair 1) / `65002` (pair 2) |
| `$GW_TRUST_AS` / `$GW_UNTRUST_AS` | `65100` / `65300` |
| `$MX_TRUST_AS` / `$MX_UNTRUST_AS` / `$MX_MNHA_AS` (SRX view) | `65200` / `65400` / `65050` |

## Per-plane addressing (per SRX/MNHA node, /30 point-to-point)

| Plane | VLAN | MX side | SRX side |
|---|---|---|---|
| TRUST (unit .0) | 1 | `10.1.1.1/30` | `10.1.1.2/30` |
| UNTRUST (unit .1) | 2 | `10.2.1.1/30` | `10.2.1.2/30` |
| MNHA-ICL (unit .100) | 100 | `10.3.1.1/30` | `10.3.1.2/30` |

North-side AC (MX ae10): TRUST VLAN 40 = `172.16.1.1/30`, UNTRUST VLAN 80 = `172.16.2.1/30`.

## Prefixes

| Variable | Default |
|---|---|
| `$ARI_CLIENT_PFX` / `$CLIENT_PFX` | `172.80.0.0/16` |
| `$SERVER_PFX` | `172.160.0.0/16` |
| `$IKE_SRC_PFX` | `10.200.0.0/16` |
| `$MNHA_PFX` | `192.168.0.0/24` |

## SRX identity / MNHA

| Variable | Default |
|---|---|
| `$MNHA_NODE_IP` / `$LOCAL_IP` | `192.168.0.1` (srx*a); `192.168.0.2` (srx*b) |
| `$PEER_IP` | `192.168.0.2` (peer of srx*a) |
| `$ACT_SIG` / `$BKP_SIG` | `192.168.255.0` / `192.168.255.1` |
| `$PROBE_DEST` / `$PROBE_SRC` | `10.1.1.1` / `192.168.10.1` |
| `$MONITOR_SRC` / `$MON_INT` | `10.1.1.2` / `ae1.0` |
| `$PRIO` | `200` |
| `$LOCAL_ID` / `$REMOTE_ID` | `vsrx.juniper.net` |

## IKE / IPsec

| Variable | Default |
|---|---|
| Encryption | ESP **AES-256-GCM**, lifetime 3600 s, anti-replay-window 512 |
| IKE | v2-only, PSK, DPD probe-idle-tunnel (interval 10, threshold 3); auto-VPN group-ike-id (responder) |
| `$ST_UNIT` | `st0.1` |
| Interfaces | `$AE` = `ae1` (to SRX), `$UNI_AE` = `ae10` (north AC), `$AMS` = `ams1` (initiator) |

## Initiator (MX-INIT)

| Variable | Default |
|---|---|
| `$LOCAL_EP` | `10.200.0.1` (per-tunnel: `.1`, `.2`, … on lo0.0) |
| `$INIT_ID` | `peer1.juniper.net` (per-tunnel: peer1…peerN) |
| `$TS_LOCAL` / `$TS_REMOTE` | `172.80.0.1/32` / `172.160.0.1/32` (per-tunnel /32 pair) |

## Secrets (NEVER auto-filled with a real value)

`$IKE_PSK`, `$L3HA_PSK`, `$INIT_PSK` — emit a clearly-placeholder value (e.g. `"<set-your-psk>"`) and flag in Notes that the user must supply a real encrypted key.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-so-ipsec-snips.md`](jvd-so-ipsec-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum" or "with-bgp"
# devices:
#   - { name: <hostname>, os: junos, role: <MX-LB|SRX|MX-INIT> }
# component:
#   kind: <mx-load-balancer|srx-secgw|srx-mnha|mx-initiator|add-feature>
#   ike_vip: 10.100.0.1        # shared anycast IKE gateway
#   as: { mx: 10000, srx: 65000, trust: 65200, untrust: 65400, mnha: 65050 }
#   planes: { trust: 10.1.1.x/30, untrust: 10.2.1.x/30, mnha: 10.3.1.x/30 }
# snips_used:
#   - junos/load-balancing/tlb-ipsec-dsr.conf
#   - junos/firewall/fbf-ipsec-lb-redirect.conf
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

For an end-to-end scale-out example, emit the **MX load-balancer** and the **SRX gateway** as separate device blocks. Drop the leading C-style `/* … */` documentation header from each snip when emitting. Keep one `/* snips/<path> */` line as the section comment.

## 3. `Notes:` section (always last)

Bullets covering:

- Snips intentionally omitted (and why).
- Inputs defaulted because the user did not provide them.
- Cross-device consistency the user must verify: the anycast IKE VIP is IDENTICAL on every SRX and the TLB virtual-service; per-plane /30s match between the MX and SRX sides; the SRX share one local-as while the MX TRUST group uses `as-override`; MNHA signal-routes match.
- Secrets: `$IKE_PSK` / `$L3HA_PSK` / `$INIT_PSK` are placeholders — the user MUST supply real encrypted keys.
- Prerequisites: for **SRX** MNHA, `chassis high-availability` + the HA-link-encryption VPN + signal policies must be present. For **MX-LB**, RE-based TLB needs `services traffic-load-balance routing-engine-mode` on MX304/MX10000.
- Anything that is by-pattern rather than validated on that exact device (e.g. a user-supplied hostname not in any snip's `Seen on:` list).

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
