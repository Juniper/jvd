# JVD Scale-Out Stateful Firewall & NAT (CSDS ScaleOut) snippet library

## junos/bootstrap/srx-system-services.conf

```
/*
 * Topic:   SRX management bootstrap: netconf/ssh + web-management on the TLB health-check port
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - web-management http port $WEB_PORT (8088) is exactly the port the MX TLB tcp-profile health-checks — keep them in sync.
 *  - netconf ssh + ssh root-login allow are lab-management conveniences.
 *  - aggregated-devices device-count sizes the ae pool for the scale-out bundles.
 *
 * Pair with:
 *  - junos/load-balancing/network-monitoring-profiles.conf — the TCP health-check that probes port 8088
 *
 * Variables:
 *   $WEB_PORT  e.g. 8088
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
                port $WEB_PORT;
            }
        }
    }
    ports {
        console log-out-on-disconnect;
    }
}
chassis {
    aggregated-devices {
        ethernet {
            device-count 50;
        }
    }
}
```

## junos/firewall/mx-fbf-tlb-redirect.conf

```
/*
 * Topic:   MX filter-based forwarding: redirect SFW/NAT traffic into the TLB forwarding instances (v4 + v6)
 * Seen on:
 *   Junos: mx1_mx304
 *
 * Highlights:
 *  - MX_TLB_LB_TRUST matches the client/server source prefixes on the trust AC and lands them in the trust forwarding instance.
 *  - MX_TLB_LB_UNTRUST matches the same prefixes as destinations on the untrust AC and lands them in the untrust forwarding instance.
 *  - IPv6 filters (IPv6_MX_TLB_LB_*) do the same for the NAT64 v6 client/server prefixes.
 *  - per-term counters give NAPT44 / SFW44 / NAT64 traffic visibility; all other traffic is accepted normally.
 *  - Applied as input filters on the ae10 north-side AC sub-units (unit 41 trust, unit 81 untrust).
 *
 * Pair with:
 *  - junos/transport/mx-forwarding-instance-tlb.conf — the forwarding instances these filters target
 *  - junos/interfaces/mx-ae-uni-flexible.conf — the ae10 sub-units where these filters are applied
 *  - junos/load-balancing/tlb-sfw-dsr.conf — TLB sprays the redirected traffic across the SRX
 *
 * Variables:
 *   $SFW_CLIENT_PFX  e.g. 172.80.0.0/12
 *   $SFW_CLIENT_V6   e.g. 2001:db8:172:80::/96
 *   $SFW_SERVER_PFX  e.g. 172.160.0.0/12
 *   $SFW_SERVER_V6   e.g. 2001:db8:172:160::/96
 *   $TRUST_FI        e.g. srx_mnha_group_tlb-trust_fi
 *   $UNTRUST_FI      e.g. srx_mnha_group_tlb-untrust_fi
 */
firewall {
    family inet {
        filter MX_TLB_LB_TRUST {
            term NAPT44_tlb_traffic {
                from {
                    source-address {
                        $SFW_CLIENT_PFX;
                    }
                }
                then {
                    count NAPT44_tlb_forward_traffic;
                    routing-instance $TRUST_FI;
                }
            }
            term SFW44_tlb_traffic {
                from {
                    source-address {
                        $SFW_SERVER_PFX;
                    }
                }
                then {
                    count SFW44_tlb_forward_traffic;
                    routing-instance $TRUST_FI;
                }
            }
            term other_traffic {
                then {
                    count other_traffic;
                    accept;
                }
            }
        }
        filter MX_TLB_LB_UNTRUST {
            term NAPT44_tlb_traffic {
                from {
                    destination-address {
                        $SFW_CLIENT_PFX;
                    }
                }
                then {
                    count SFW44_tlb_return_traffic;
                    routing-instance $UNTRUST_FI;
                }
            }
            term SFW44_tlb_traffic {
                from {
                    destination-address {
                        $SFW_SERVER_PFX;
                    }
                }
                then {
                    count SFW44_tlb_return_traffic;
                    routing-instance $UNTRUST_FI;
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
    family inet6 {
        filter IPv6_MX_TLB_LB_TRUST {
            term NAT64_tlb_traffic_traffic {
                from {
                    source-address {
                        $SFW_CLIENT_V6;
                        $SFW_SERVER_V6;
                    }
                }
                then {
                    count SFW44_tlb_forward_traffic;
                    routing-instance $TRUST_FI;
                }
            }
            term other_traffic {
                then {
                    count other_traffic;
                    accept;
                }
            }
        }
        filter IPv6_MX_TLB_LB_UNTRUST {
            term NAT64_tlb_traffic_traffic {
                from {
                    destination-address {
                        $SFW_CLIENT_V6;
                        $SFW_SERVER_V6;
                    }
                }
                then {
                    count SFW66_tlb_return_traffic;
                    routing-instance $UNTRUST_FI;
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

## junos/high-availability/srx-mnha-chassis-srg.conf

```
/*
 * Topic:   SRX Multinode High Availability (MNHA) chassis config — SRG0 with BFD monitor + install-on-failure route
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - local-id/peer-id define the two MNHA nodes; the ICL runs over lo0.0 inside the MNHA-VR (routing/L3 mode).
 *  - SRG0 is the always-on services-redundancy-group; a BFD-liveliness monitor-object on the TRUST interface drives failover.
 *  - install-on-failure-route injects the signal-route ($SIG_ROUTE) into MNHA-VR.inet.0 when the node loses activeness — this is what the export policies test.
 *  - Node identity is swapped between the pair members (local-id 1/peer-id 2 on the A node, 2/1 on the B node).
 *
 * Pair with:
 *  - junos/high-availability/srx-signal-route-export-policies.conf — consumes the $SIG_ROUTE this SRG installs
 *  - junos/transport/srx-bgp-to-mx-scaleout.conf — MNHA-VR carries the ICL eBGP + the signal-route table
 *  - junos/interfaces/srx-lo0-hc-loopbacks.conf — lo0.0 hosts the MNHA node ID / ICL endpoint
 *
 * Variables:
 *   $LOCAL_IP   e.g. 192.168.0.1
 *   $MON_DEST   e.g. 10.1.1.1
 *   $MON_INT    e.g. ae1.0
 *   $MON_SRC    e.g. 10.1.1.2
 *   $PEER_IP    e.g. 192.168.0.2
 *   $SIG_ROUTE  e.g. 192.168.255.0
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
            liveness-detection {
                minimum-interval 300;
                minimum-receive-interval 300;
                multiplier 3;
            }
        }
        services-redundancy-group 0 {
            peer-id {
                2;
            }
            monitor {
                monitor-object trust {
                    object-threshold 300;
                    bfd-liveliness {
                        threshold 300;
                        destination-ip $MON_DEST {
                            src-ip $MON_SRC;
                            routing-instance VR-1;
                            session-type singlehop;
                            interface $MON_INT;
                            weight 300;
                        }
                    }
                }
                srg-threshold 300;
            }
            install-on-failure-route {
                $SIG_ROUTE;
                routing-instance MNHA-VR;
            }
        }
    }
}
```

## junos/high-availability/srx-signal-route-export-policies.conf

```
/*
 * Topic:   SRX active/backup route-signalling policies (as-path-prepend gated on the MNHA signal-route)
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - condition srg_sig_route_exist tests for the MNHA signal-route (192.168.255.0/32) in MNHA-VR.inet.0 — present == this node is on backup.
 *  - On the ACTIVE node the NAPT pool / health-check routes are advertised cleanly; on BACKUP they get a triple as-path-prepend so the peer MX de-prefers them.
 *  - trust_export_policy handles the loopback health-check source; untrust_export_policy handles the NAPT44 + NAT64 pool prefixes.
 *  - mnha_ip re-advertises the node loopback with next-hop self across the ICL.
 *
 * Pair with:
 *  - junos/high-availability/srx-mnha-chassis-srg.conf — installs the signal-route these conditions test
 *  - junos/transport/srx-bgp-to-mx-scaleout.conf — the VR-1 / MNHA-VR BGP groups apply these exports
 *  - junos/nat/srx-source-nat-napt44.conf — origin of the NAPT pool prefix advertised here
 *  - junos/interfaces/srx-lo0-hc-loopbacks.conf — the lo0 health-check loopbacks these policies advertise
 *
 * Variables:
 *   $HC_SRC            e.g. 192.168.10.1
 *   $MNHA_NODE         e.g. 192.168.0.1
 *   $NAPT_PREFIX       e.g. 100.64.1.0/24
 *   $NAT64_SRC_PREFIX  e.g. 100.64.2.0/24
 *   $SIG_ROUTE         e.g. 192.168.255.0
 *   $SRX_AS            e.g. 65000
 */
policy-options {
    policy-statement trust_export_policy {
        term 1 {
            from {
                protocol direct;
                route-filter $HC_SRC/32 exact;
                condition srg_sig_route_exist;
            }
            then {
                as-path-prepend "$SRX_AS $SRX_AS $SRX_AS";
                next-hop self;
                accept;
            }
        }
        term 2 {
            from {
                protocol direct;
                route-filter $HC_SRC/32 exact;
            }
            then {
                as-path-prepend $SRX_AS;
                next-hop self;
                accept;
            }
        }
        term 3 {
            then reject;
        }
    }
    policy-statement untrust_export_policy {
        term 1 {
            from {
                protocol static;
                route-filter $NAPT_PREFIX exact;
                condition srg_sig_route_exist;
            }
            then {
                as-path-prepend "$SRX_AS $SRX_AS $SRX_AS";
                next-hop self;
                accept;
            }
        }
        term 2 {
            from {
                protocol static;
                route-filter $NAPT_PREFIX exact;
            }
            then {
                as-path-prepend $SRX_AS;
                next-hop self;
                accept;
            }
        }
        term 3 {
            from {
                protocol static;
                route-filter $NAT64_SRC_PREFIX exact;
                condition srg_sig_route_exist;
            }
            then {
                as-path-prepend "$SRX_AS $SRX_AS $SRX_AS";
                next-hop self;
                accept;
            }
        }
        term 4 {
            from {
                protocol static;
                route-filter $NAT64_SRC_PREFIX exact;
            }
            then {
                as-path-prepend $SRX_AS;
                next-hop self;
                accept;
            }
        }
        term 5 {
            from {
                protocol direct;
                route-filter $HC_SRC/32 exact;
                condition srg_sig_route_exist;
            }
            then {
                as-path-prepend "$SRX_AS $SRX_AS $SRX_AS";
                next-hop self;
                accept;
            }
        }
        term 6 {
            from {
                protocol direct;
                route-filter $HC_SRC/32 exact;
            }
            then {
                as-path-prepend $SRX_AS;
                next-hop self;
                accept;
            }
        }
        term 7 {
            then reject;
        }
    }
    policy-statement mnha_ip {
        term 1 {
            from {
                route-filter $MNHA_NODE/32 exact;
            }
            then {
                next-hop self;
                accept;
            }
        }
        term 2 {
            then reject;
        }
    }
    condition srg_sig_route_exist {
        if-route-exists {
            $SIG_ROUTE/32;
            table MNHA-VR.inet.0;
        }
    }
}
```

## junos/interfaces/mx-ae-scaleout-subunits.conf

```
/*
 * Topic:   MX aggregated-ethernet sub-units per plane (TRUST .0 / UNTRUST .1 / MNHA .100), v4 + v6
 * Seen on:
 *   Junos: mx1_mx304
 *
 * Highlights:
 *  - One physical AE per SRX/MNHA node (ae1..ae4); three vlan-tagged sub-units carve TRUST (.0), UNTRUST (.1), MNHA-ICL (.100).
 *  - Dual-stack: trust/untrust sub-units carry both inet /30 and inet6 /126 point-to-point addresses.
 *  - LACP active/periodic-fast with minimum-links 1 keeps the bundle up on a single member.
 *
 * Pair with:
 *  - junos/transport/mx-bgp-vrf-scaleout.conf — the VRFs these sub-units are bound to
 *  - junos/interfaces/srx-ae-scaleout-subunits.conf — the SRX side of the same point-to-point links
 *
 * Variables:
 *   $AE           e.g. ae1
 *   $MNHA_IP      e.g. 10.3.1.1/30
 *   $TRUST_IP     e.g. 10.1.1.1/30
 *   $TRUST_IP6    e.g. 2001:db8:1:1:1::1/126
 *   $UNTRUST_IP   e.g. 10.2.1.1/30
 *   $UNTRUST_IP6  e.g. 2001:db8:1:2:1::1/126
 */
interfaces {
    $AE {
        vlan-tagging;
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
            family inet6 {
                address $TRUST_IP6;
            }
        }
        unit 1 {
            vlan-id 2;
            family inet {
                address $UNTRUST_IP;
            }
            family inet6 {
                address $UNTRUST_IP6;
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

## junos/interfaces/mx-ae-uni-flexible.conf

```
/*
 * Topic:   MX north-side AC (flexible-ethernet-services) with the TLB FBF filters + health-check loopbacks
 * Seen on:
 *   Junos: mx1_mx304
 *
 * Highlights:
 *  - ae10 uses flexible-vlan-tagging + flexible-ethernet-services to carry TRUST (.41) and UNTRUST (.81) VLANs to the GW.
 *  - The MX_TLB_LB_* filters are applied as input on each sub-unit (v4 + v6) to redirect SFW/NAT traffic into the forwarding instances.
 *  - lo0.1 / lo0.2 host the TLB health-check source addresses for the TRUST / UNTRUST VRs respectively (v4 + v6).
 *
 * Pair with:
 *  - junos/firewall/mx-fbf-tlb-redirect.conf — the input filters applied here
 *  - junos/load-balancing/tlb-sfw-dsr.conf — TLB uses lo0.1/lo0.2 as health-check sources
 *  - junos/transport/gw-emulator-bgp.conf — the GW that terminates this north-side AC
 *  - junos/transport/mx-scaleout-export-policies.conf — export policies applied on this UNI's routing instance
 *
 * Variables:
 *   $HC_TRUST_SRC     e.g. 192.168.10.251/32
 *   $HC_TRUST_SRC6    e.g. 2001:db8:1:255::251/128
 *   $HC_UNTRUST_SRC   e.g. 192.168.10.252/32
 *   $HC_UNTRUST_SRC6  e.g. 2001:db8:1:255::252/128
 *   $TRUST_UNI_IP     e.g. 172.16.1.1/30
 *   $TRUST_UNI_IP6    e.g. 2001:db8:172:1:1::1/126
 *   $UNTRUST_UNI_IP   e.g. 172.16.2.1/30
 *   $UNTRUST_UNI_IP6  e.g. 2001:db8:172:2:1::1/126
 */
interfaces {
    ae10 {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            minimum-links 1;
            lacp {
                active;
                periodic fast;
            }
        }
        unit 41 {
            vlan-id 41;
            family inet {
                filter {
                    input MX_TLB_LB_TRUST;
                }
                address $TRUST_UNI_IP;
            }
            family inet6 {
                filter {
                    input IPv6_MX_TLB_LB_TRUST;
                }
                address $TRUST_UNI_IP6;
            }
        }
        unit 81 {
            vlan-id 81;
            family inet {
                filter {
                    input MX_TLB_LB_UNTRUST;
                }
                address $UNTRUST_UNI_IP;
            }
            family inet6 {
                filter {
                    input IPv6_MX_TLB_LB_UNTRUST;
                }
                address $UNTRUST_UNI_IP6;
            }
        }
    }
    lo0 {
        unit 1 {
            description "TLB Health-Check Source IP Addresses for TRUST VR";
            family inet {
                address $HC_TRUST_SRC;
            }
            family inet6 {
                address $HC_TRUST_SRC6;
            }
        }
        unit 2 {
            description "TLB Health-Check Source IP Addresses for UNTRUST VR";
            family inet {
                address $HC_UNTRUST_SRC;
            }
            family inet6 {
                address $HC_UNTRUST_SRC6;
            }
        }
    }
}
```

## junos/interfaces/srx-ae-scaleout-subunits.conf

```
/*
 * Topic:   SRX aggregated-ethernet sub-units per plane (TRUST .0 / UNTRUST .1 / MNHA .100), v4 + v6
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - Single AE to the MX with three vlan-tagged sub-units: TRUST (.0), UNTRUST (.1), MNHA-ICL (.100).
 *  - Two member et- ports per bundle; mirrors the MX-side AE sub-unit scheme (/30 v4 + /126 v6 per plane).
 *  - The AE base and member ports differ per node (ae1 on pair 1, ae2 on pair 2).
 *
 * Pair with:
 *  - junos/transport/srx-bgp-to-mx-scaleout.conf — the eBGP groups over these sub-units
 *  - junos/security/srx-zones-scaleout.conf — the sub-units bound to each zone
 *  - junos/interfaces/mx-ae-scaleout-subunits.conf — the MX side of the same links
 *
 * Variables:
 *   $AE           e.g. ae1
 *   $ETA          e.g. et-1/0/0
 *   $ETB          e.g. et-1/0/1
 *   $MNHA_IP      e.g. 10.3.1.2/30
 *   $TRUST_IP     e.g. 10.1.1.2/30
 *   $TRUST_IP6    e.g. 2001:db8:1:1:1::2/126
 *   $UNTRUST_IP   e.g. 10.2.1.2/30
 *   $UNTRUST_IP6  e.g. 2001:db8:1:2:1::2/126
 */
interfaces {
    $ETA {
        gigether-options {
            802.3ad $AE;
        }
    }
    $ETB {
        gigether-options {
            802.3ad $AE;
        }
    }
    $AE {
        vlan-tagging;
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
            family inet6 {
                address $TRUST_IP6;
            }
        }
        unit 1 {
            vlan-id 2;
            family inet {
                address $UNTRUST_IP;
            }
            family inet6 {
                address $UNTRUST_IP6;
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

## junos/interfaces/srx-lo0-hc-loopbacks.conf

```
/*
 * Topic:   SRX loopbacks: MNHA node ID (lo0.0) + shared TLB health-check / anchor address (lo0.1)
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - lo0.0 carries the unique MNHA node IP (primary) inside the MNHA-VR / ICL zone.
 *  - lo0.1 carries the TLB real-service / health-check address ($HC_SRC) plus its v6 counterpart — the same anchor on both nodes of a pair.
 *  - This is the address TLB probes and the one the trust/untrust export policies (de)prefer via as-path-prepend.
 *
 * Pair with:
 *  - junos/high-availability/srx-mnha-chassis-srg.conf — ICL runs over lo0.0
 *  - junos/high-availability/srx-signal-route-export-policies.conf — advertises the lo0.1 /32
 *  - junos/load-balancing/tlb-sfw-dsr.conf — TLB probes/anchors the lo0.1 address
 *
 * Variables:
 *   $HC_SRC     e.g. 192.168.10.1
 *   $HC_SRC6    e.g. 2001:db8:1:255::1
 *   $MNHA_NODE  e.g. 192.168.0.1
 */
interfaces {
    lo0 {
        unit 0 {
            family inet {
                address $MNHA_NODE/32 {
                    primary;
                }
            }
        }
        unit 1 {
            family inet {
                address $HC_SRC/32;
            }
            family inet6 {
                address $HC_SRC6/128;
            }
        }
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
 *  - ICMP profile is the default liveness check; the TCP profile probes the SRX web-management port ($TCP_PORT = 8088).
 *  - probe-interval 1s with failure-retries 1 / recovery-retries 1 gives the fastest possible detection for the lab.
 *  - Referenced by every TLB group via network-monitoring-profile [ icmp-profile tcp-profile ].
 *
 * Pair with:
 *  - junos/load-balancing/tlb-sfw-dsr.conf — the TLB instances that reference these profiles
 *  - junos/bootstrap/srx-system-services.conf — SRX web-management http port 8088 answers the TCP probe
 *
 * Variables:
 *   $TCP_PORT  e.g. 8088
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
                port $TCP_PORT;
            }
            probe-interval 1;
            failure-retries 1;
            recovery-retries 1;
        }
    }
}
```

## junos/load-balancing/tlb-sfw-dsr.conf

```
/*
 * Topic:   RE-based Traffic Load Balancer (TLB) for scale-out SFW/NAT, Direct Server Return mode
 * Seen on:
 *   Junos: mx1_mx304
 *
 * Highlights:
 *  - routing-engine-mode is REQUIRED on MX304/MX10000 — TLB control runs on the RE, not on a service card.
 *  - Direct Server Return (DSR): forward traffic is sprayed by TLB; the SRX returns directly, halving the balancer load.
 *  - TRUST instance hashes on source-ip, UNTRUST instance hashes on destination-ip — together they pin a subscriber's forward+return flows to the SAME SRX pair.
 *  - real-services are the shared per-pair anchor IPs ($REAL1/$REAL2); health-check-interface-subunit selects the lo0 unit whose address sources the probes.
 *  - virtual-service address 0.0.0.0 is a wildcard catch (steering is done by the FBF filters into the forwarding instances $TRUST_FI/$UNTRUST_FI).
 *  - Parallel IPv6 instances (ipv6_tlb_sfw_trust/untrust) exist with real-services 2001:db8:1:255::1/::2 — identical DSR structure.
 *
 * Pair with:
 *  - junos/load-balancing/network-monitoring-profiles.conf — TLB health-check profiles referenced by the groups
 *  - junos/transport/mx-forwarding-instance-tlb.conf — the forwarding instances the virtual-services live in
 *  - junos/firewall/mx-fbf-tlb-redirect.conf — steers SFW/NAT traffic into those forwarding instances
 *  - junos/interfaces/mx-ae-uni-flexible.conf — lo0.1/lo0.2 provide the TLB health-check sources
 *  - junos/interfaces/srx-lo0-hc-loopbacks.conf — the SRX lo0 targets the TLB health-checks
 *  - junos/transport/enhanced-hash-key-symmetric.conf — symmetric hashing for dual-MX flow affinity
 *
 * JVD peer devices (observed interop):
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Variables:
 *   $REAL1        e.g. 192.168.10.1
 *   $REAL2        e.g. 192.168.10.2
 *   $TRUST_FI     e.g. srx_mnha_group_tlb-trust_fi
 *   $TRUST_VRF    e.g. TRUST_VR
 *   $UNTRUST_FI   e.g. srx_mnha_group_tlb-untrust_fi
 *   $UNTRUST_VRF  e.g. UNTRUST_VR
 */
services {
    traffic-load-balance {
        routing-engine-mode;
        instance tlb_sfw_trust {
            interface lo0.0;
            client-vrf $TRUST_VRF;
            server-vrf $TRUST_VRF;
            group srx_trust_group {
                real-services [ MNHA_SRX1 MNHA_SRX2 ];
                routing-instance $TRUST_VRF;
                health-check-interface-subunit 1;
                network-monitoring-profile [ icmp-profile tcp-profile ];
            }
            real-service MNHA_SRX1 {
                address $REAL1;
            }
            real-service MNHA_SRX2 {
                address $REAL2;
            }
            virtual-service srx_trust_vs {
                mode direct-server-return;
                address 0.0.0.0;
                routing-instance $TRUST_FI;
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
        instance tlb_sfw_untrust {
            interface lo0.0;
            client-vrf $UNTRUST_VRF;
            server-vrf $UNTRUST_VRF;
            group srx_untrust_group {
                real-services [ UNTRUST_SRX1 UNTRUST_SRX2 ];
                routing-instance $UNTRUST_VRF;
                health-check-interface-subunit 2;
                network-monitoring-profile [ icmp-profile tcp-profile ];
            }
            real-service UNTRUST_SRX1 {
                address $REAL1;
            }
            real-service UNTRUST_SRX2 {
                address $REAL2;
            }
            virtual-service srx_untrust_vs {
                mode direct-server-return;
                address 0.0.0.0;
                routing-instance $UNTRUST_FI;
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

## junos/nat/mx-napt44-route-advertise.conf

```
/*
 * Topic:   MX route-filter-list + export term advertising the SRX NAPT44 pool prefixes north to the GW
 * Seen on:
 *   Junos: mx1_mx304
 *
 * Highlights:
 *  - route-filter-list nat_pool_route_filter_list enumerates every per-pair 100.64/24 NAPT pool (100.64.1-4.0/24).
 *  - ipv4_mx_untrust_to_gw_export leaks the SFW server prefix (static) + the NAPT pools (learned via BGP) toward the north GW.
 *  - This is what makes the translated CGN addresses reachable from the internet-facing side.
 *
 * Pair with:
 *  - junos/nat/srx-source-nat-napt44.conf — the pools these prefixes originate from
 *  - junos/transport/mx-bgp-vrf-scaleout.conf — UNTRUST_VR applies this export toward the GW
 *  - junos/transport/mx-scaleout-export-policies.conf — companion MX export policies
 *
 * JVD peer devices (observed interop):
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Variables:
 *   $NAPT_POOL_1     e.g. 100.64.1.0/24
 *   $NAPT_POOL_2     e.g. 100.64.2.0/24
 *   $NAPT_POOL_3     e.g. 100.64.3.0/24
 *   $NAPT_POOL_4     e.g. 100.64.4.0/24
 *   $SFW_SERVER_PFX  e.g. 172.160.0.0/12
 */
policy-options {
    route-filter-list nat_pool_route_filter_list {
        $NAPT_POOL_1 exact;
        $NAPT_POOL_2 exact;
        $NAPT_POOL_3 exact;
        $NAPT_POOL_4 exact;
    }
    policy-statement ipv4_mx_untrust_to_gw_export {
        term sfw4_prefix {
            from {
                protocol static;
                route-filter $SFW_SERVER_PFX exact;
            }
            then accept;
        }
        term napt44_prefix_list {
            from {
                protocol bgp;
                route-filter-list nat_pool_route_filter_list;
            }
            then accept;
        }
        term reject {
            then reject;
        }
    }
}
```

## junos/nat/srx-nat64.conf

```
/*
 * Topic:   SRX NAT64 (IPv6->IPv4) source + destination NAT translating v6 clients to a v4 server
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - Source side: IPv6 client prefix ($NAT64_CLIENT_V6) is translated into a v4 100.64/10 pool ($NAT64_SRC_PREFIX, address-pooling paired).
 *  - Destination side: a WKP-style v6 destination ($NAT64_DST_V6) is mapped to the real IPv4 server ($NAT64_DST_V4).
 *  - Both rules share the trust->untrust rule-set; the destination rule-set is trust-zone scoped.
 *  - NAT64 stanzas are PRESENT in the validated lab configs but the published design guides scope NAT64 as a non-goal (NAPT44 is the tested feature).
 *
 * Pair with:
 *  - junos/nat/srx-source-nat-napt44.conf — the companion NAPT44 source-NAT in the same rule-set
 *  - junos/security/srx-policies-sfw.conf — NAT64_POLICY permits the translated v6 flow
 *
 * Variables:
 *   $NAT64_CLIENT_V6   e.g. 2001:db8:172:80::/96
 *   $NAT64_DST_V4      e.g. 172.16.10.3/32
 *   $NAT64_DST_V6      e.g. 2001:db8:1::1/128
 *   $NAT64_SRC_POOL    e.g. nat_64_source_ipv4_pool
 *   $NAT64_SRC_PREFIX  e.g. 100.64.2.0/24
 *   $TRUST_ZONE        e.g. VR-1_trust_zone
 *   $UNTRUST_ZONE      e.g. VR-1_untrust_zone
 */
security {
    nat {
        source {
            pool $NAT64_SRC_POOL {
                address {
                    $NAT64_SRC_PREFIX;
                }
                address-pooling paired;
            }
            rule-set srx_nat_rule-set {
                from zone $TRUST_ZONE;
                to zone $UNTRUST_ZONE;
                rule srx_nat64_rule2 {
                    match {
                        source-address $NAT64_CLIENT_V6;
                        destination-address $NAT64_DST_V4;
                        application any;
                    }
                    then {
                        source-nat {
                            pool {
                                $NAT64_SRC_POOL;
                            }
                        }
                    }
                }
            }
        }
        destination {
            pool nat_64_dest_ipv4 {
                address $NAT64_DST_V4;
            }
            rule-set nat_64_dest_rule {
                from zone $TRUST_ZONE;
                rule d_rule-1 {
                    match {
                        destination-address $NAT64_DST_V6;
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

## junos/nat/srx-source-nat-napt44.conf

```
/*
 * Topic:   SRX source-NAT (NAPT44) into an RFC6598 100.64/10 pool with address-pooling paired
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - NAPT44: private client prefix ($SFW_CLIENT_PFX) is port-address-translated behind a shared carrier-grade (RFC6598) pool.
 *  - address-pooling paired guarantees a subscriber keeps the SAME translated address for all of its flows (endpoint-independent mapping).
 *  - The pool /24 is UNIQUE per MNHA pair (100.64.1.0/24 on pair 1, 100.64.3.0/24 on pair 2) so translations never collide across the farm.
 *  - rule-set is zone-scoped trust->untrust; the pool prefix is redistributed north as a static discard route + BGP advertisement.
 *
 * Pair with:
 *  - junos/nat/mx-napt44-route-advertise.conf — MX advertises the NAPT pool prefixes north
 *  - junos/transport/srx-bgp-to-mx-scaleout.conf — static discard + BGP export of the pool prefix
 *  - junos/security/srx-policies-sfw.conf — the SNAT_NAT_POLICY that permits this flow
 *  - junos/high-availability/srx-signal-route-export-policies.conf — active/backup advertisement of the pool
 *  - junos/nat/srx-nat64.conf — the companion NAT64 rule in the same rule-set
 *  - junos/security/srx-zones-scaleout.conf — the trust/untrust zones this NAT rule-set bridges
 *
 * Variables:
 *   $NAPT_POOL       e.g. srx_nat_pool1
 *   $NAPT_PREFIX     e.g. 100.64.1.0/24
 *   $SFW_CLIENT_PFX  e.g. 172.80.0.0/12
 *   $TRUST_ZONE      e.g. VR-1_trust_zone
 *   $UNTRUST_ZONE    e.g. VR-1_untrust_zone
 */
security {
    nat {
        source {
            pool $NAPT_POOL {
                address {
                    $NAPT_PREFIX;
                }
                address-pooling paired;
            }
            rule-set srx_nat_rule-set {
                from zone $TRUST_ZONE;
                to zone $UNTRUST_ZONE;
                rule srx_nat_rule1 {
                    match {
                        source-address $SFW_CLIENT_PFX;
                        destination-address 0.0.0.0/0;
                        application any;
                    }
                    then {
                        source-nat {
                            pool {
                                $NAPT_POOL;
                            }
                        }
                    }
                }
            }
        }
    }
}
```

## junos/security/srx-policies-sfw.conf

```
/*
 * Topic:   SRX stateful firewall policies + address-book for scale-out SFW/NAT (v4 + v6)
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - Global address-book entries name each SFW client/server prefix (v4 172.80/12 & 172.160/12, v6 2001:db8:172:80/160::/96).
 *  - SNAT_NAT_POLICY permits the pre-NAT client prefix; SFW44/SFW66 permit the server prefixes; NAT64_POLICY permits the v6 client.
 *  - default-policy permit-all is a lab convenience (all firewalling is expressed as explicit permit rules) — change to deny-all for production.
 *
 * Pair with:
 *  - junos/security/srx-zones-scaleout.conf — the zones referenced by these policies
 *  - junos/nat/srx-source-nat-napt44.conf — SNAT_NAT_POLICY permits the pre-NAT client
 *  - junos/nat/srx-nat64.conf — NAT64_POLICY permits the translated v6 flow
 *
 * Variables:
 *   $SFW_CLIENT_PFX  e.g. 172.80.0.0/12
 *   $SFW_CLIENT_V6   e.g. 2001:db8:172:80::/96
 *   $SFW_SERVER_PFX  e.g. 172.160.0.0/12
 *   $SFW_SERVER_V6   e.g. 2001:db8:172:160::/96
 */
security {
    address-book {
        global {
            address sfw_source_prefix_172.80.0.0/12 $SFW_CLIENT_PFX;
            address sfw_source_prefix_172.160.0.0/12 $SFW_SERVER_PFX;
            address sfw_source_prefix_2001:db8:172:160::/96 $SFW_SERVER_V6;
            address sfw_source_prefix_2001:db8:172:80::/96 $SFW_CLIENT_V6;
        }
    }
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

## junos/security/srx-zones-scaleout.conf

```
/*
 * Topic:   SRX security zones for the scale-out planes (trust / untrust / MNHA-ICL)
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - VR-1_trust_zone (inside / pre-NAT) binds the trust sub-unit ($AE.0) + the health-check loopback lo0.1.
 *  - VR-1_untrust_zone (outside / post-NAT) binds the untrust sub-unit ($AE.1); this is where translated traffic egresses.
 *  - trust_zone_mnha isolates the ICL (lo0.0 + $AE.100) for MNHA signalling.
 *  - host-inbound all system-services/protocols is a lab convenience — tighten for production.
 *
 * Pair with:
 *  - junos/security/srx-policies-sfw.conf — the policies between these zones
 *  - junos/interfaces/srx-ae-scaleout-subunits.conf — the sub-units bound to each zone
 *  - junos/nat/srx-source-nat-napt44.conf — the NAT rule-set is scoped by these zones
 *
 * Variables:
 *   $AE  e.g. ae1
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
                $AE.0;
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
                $AE.1;
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
                $AE.100;
            }
        }
    }
}
```

## junos/transport/enhanced-hash-key-symmetric.conf

```
/*
 * Topic:   Symmetric enhanced-hash-key so the MX computes identical forward/return hashes
 * Seen on:
 *   Junos: mx1_mx304
 *
 * Highlights:
 *  - symmetric hashing ensures a subscriber's forward and return flows resolve to the SAME SRX member of the ECMP set.
 *  - Without it the forward (source-ip) and return (destination-ip) directions could land on different SRX, breaking session symmetry.
 *
 * Pair with:
 *  - junos/load-balancing/tlb-sfw-dsr.conf — TLB relies on symmetric hashing for flow pinning
 *  - junos/transport/mx-bgp-vrf-scaleout.conf — the ECMP next-hops being hashed
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

## junos/transport/gw-emulator-bgp.conf

```
/*
 * Topic:   Gateway emulator: north-side TRUST/UNTRUST VRFs with static client/server routes + eBGP to the MX
 * Seen on:
 *   Junos: gateway_emulator_mx304
 *
 * Highlights:
 *  - The gateway emulator is the test harness north of the MX — it originates the client/server prefixes and default route.
 *  - TRUST_VR statically routes the SFW client+server prefixes to the emulated inside network and eBGPs them to the MX TRUST plane.
 *  - UNTRUST_VR statically discards a default and eBGPs it to the MX UNTRUST plane, emulating the internet-facing side.
 *  - Not a production device — it stands in for the customer CE / upstream router during validation.
 *
 * Pair with:
 *  - junos/interfaces/mx-ae-uni-flexible.conf — the MX north-side AC this emulator peers with
 *
 * JVD peer devices (observed interop):
 *   Junos: mx1_mx304
 *
 * Variables:
 *   $GW_TRUST_AS     e.g. 65100
 *   $GW_UNTRUST_AS   e.g. 65300
 *   $INSIDE_NH       e.g. 172.16.8.1
 *   $MX_TRUST_AS     e.g. 65200
 *   $MX_UNTRUST_AS   e.g. 65400
 *   $SFW_CLIENT_PFX  e.g. 172.80.0.0/12
 *   $SFW_SERVER_PFX  e.g. 172.160.0.0/12
 */
policy-options {
    policy-statement client_to_server_export_mx1 {
        term 1 {
            from {
                protocol static;
                route-filter $SFW_SERVER_PFX exact;
                route-filter $SFW_CLIENT_PFX orlonger;
            }
            then accept;
        }
        term 2 {
            then reject;
        }
    }
    policy-statement server_to_client_export_mx1 {
        term t1 {
            from {
                protocol static;
                route-filter 0.0.0.0/0 exact;
            }
            then accept;
        }
        term t2 {
            then reject;
        }
    }
}
routing-instances {
    TRUST_VR {
        instance-type virtual-router;
        routing-options {
            autonomous-system $GW_TRUST_AS;
            static {
                route $SFW_CLIENT_PFX next-hop $INSIDE_NH;
                route $SFW_SERVER_PFX next-hop $INSIDE_NH;
            }
        }
        protocols {
            bgp {
                group trust_GW-to-MX1_trust {
                    type external;
                    export client_to_server_export_mx1;
                    peer-as $MX_TRUST_AS;
                    local-as $GW_TRUST_AS;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor 172.16.1.1;
                }
                multipath;
            }
        }
        interface ae10.41;
    }
    UNTRUST_VR {
        instance-type virtual-router;
        routing-options {
            autonomous-system $GW_UNTRUST_AS;
            static {
                route 0.0.0.0/0 discard;
            }
        }
        protocols {
            bgp {
                group Untrust_GW-to-MX1_Untrust {
                    type external;
                    export server_to_client_export_mx1;
                    peer-as $MX_UNTRUST_AS;
                    local-as $GW_UNTRUST_AS;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor 172.16.2.1;
                }
                multipath;
            }
        }
        interface ae10.81;
    }
}
```

## junos/transport/mx-bgp-vrf-scaleout.conf

```
/*
 * Topic:   MX scale-out VRFs (TRUST_VR / UNTRUST_VR / MNHA-VR) with per-pair eBGP to the SRX farm and the GW
 * Seen on:
 *   Junos: mx1_mx304
 *
 * Highlights:
 *  - Three virtual-routers segregate planes: TRUST_VR (inside, as $TRUST_AS), UNTRUST_VR (outside, as $UNTRUST_AS), MNHA-VR (ICL, as $MNHA_AS).
 *  - Each SRX MNHA node is a distinct neighbor group (MX-to-MNHA-pair_1_A .. 2_B) with multipath for ECMP spray; a separate group peers the north GW.
 *  - MNHA-VR eBGP peers the A nodes as $SRX_MNHA_A_AS and the B nodes as $SRX_MNHA_B_AS over the ICL sub-units.
 *  - TRUST_VR/UNTRUST_VR each carry a static discard default (or server prefix) and an internal autonomous-system.
 *  - Parallel IPv6_MX-to-* groups (omitted here for brevity) mirror the v4 groups on the v6 sub-units.
 *
 * Pair with:
 *  - junos/transport/mx-scaleout-export-policies.conf — the export policies referenced by these groups
 *  - junos/transport/mx-forwarding-instance-tlb.conf — the companion TLB forwarding instances
 *  - junos/nat/mx-napt44-route-advertise.conf — UNTRUST_VR applies the NAPT advertise export
 *  - junos/interfaces/mx-ae-scaleout-subunits.conf — the ae sub-units bound to each VRF
 *  - junos/transport/enhanced-hash-key-symmetric.conf — symmetric hashing for dual-MX flow affinity
 *  - junos/transport/srx-bgp-to-mx-scaleout.conf — the SRX side of these eBGP sessions
 *
 * JVD peer devices (observed interop):
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600 gateway_emulator_mx304
 *
 * Variables:
 *   $GW_TRUST_AS    e.g. 65100
 *   $GW_UNTRUST_AS  e.g. 65300
 *   $MNHA_AS        e.g. 65050
 *   $SRX_AS         e.g. 65000
 *   $SRX_MNHA_A_AS  e.g. 65001
 *   $SRX_MNHA_B_AS  e.g. 65002
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
                    peer-as $SRX_MNHA_A_AS;
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
                    peer-as $SRX_MNHA_B_AS;
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
                    peer-as $SRX_MNHA_A_AS;
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
                    peer-as $SRX_MNHA_B_AS;
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
            rib TRUST_VR.inet6.0 {
                static {
                    route ::/0 discard;
                }
            }
            autonomous-system 1000;
            static {
                route 0.0.0.0/0 discard;
            }
        }
        protocols {
            bgp {
                group MX-to-TRUST_GW_Router {
                    type external;
                    export def_route_export;
                    peer-as $GW_TRUST_AS;
                    local-as $TRUST_AS;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor 172.16.1.2;
                }
                group MX-to-MNHA-pair_1_A {
                    type external;
                    export ipv4_mx_trust-to-srx_trust_export;
                    peer-as $SRX_AS;
                    local-as $TRUST_AS;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor 10.1.1.2;
                }
            }
        }
        interface ae1.0;
        interface ae2.0;
        interface ae3.0;
        interface ae4.0;
        interface ae10.41;
        interface lo0.1;
    }
    UNTRUST_VR {
        instance-type virtual-router;
        routing-options {
            rib UNTRUST_VR.inet6.0 {
                static {
                    route 2001:db8:172:160::/96 discard;
                }
            }
            autonomous-system 65400;
            static {
                route 172.160.0.0/12 discard;
            }
        }
        protocols {
            bgp {
                group MX-to-UNTRUST_GW_Router {
                    type external;
                    export ipv4_mx_untrust_to_gw_export;
                    peer-as $GW_UNTRUST_AS;
                    local-as $UNTRUST_AS;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor 172.16.2.2;
                }
                group MX-to-MNHA-pair_1_A {
                    type external;
                    export ipv4_mx_untrust-to-srx_untrust_export;
                    peer-as $SRX_AS;
                    local-as $UNTRUST_AS;
                    multipath;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor 10.2.1.2;
                }
            }
        }
        interface ae1.1;
        interface ae2.1;
        interface ae3.1;
        interface ae4.1;
        interface ae10.81;
        interface lo0.2;
    }
    srx_mnha_group_tlb-trust_fi {
        instance-type forwarding;
    }
    srx_mnha_group_tlb-untrust_fi {
        instance-type forwarding;
    }
}
routing-options {
    nonstop-routing;
    forwarding-table {
        export pfe_lb_hash;
    }
}
```

## junos/transport/mx-forwarding-instance-tlb.conf

```
/*
 * Topic:   MX forwarding routing-instances that anchor the TLB virtual-services (trust + untrust)
 * Seen on:
 *   Junos: mx1_mx304
 *
 * Highlights:
 *  - instance-type forwarding — no interfaces of their own; they hold the TLB composite next-hops.
 *  - The FBF filters steer SFW/NAT traffic into these instances; TLB then sprays it across the SRX group.
 *
 * Pair with:
 *  - junos/load-balancing/tlb-sfw-dsr.conf — TLB virtual-service routing-instance targets
 *  - junos/firewall/mx-fbf-tlb-redirect.conf — FBF redirect targets
 *  - junos/transport/mx-bgp-vrf-scaleout.conf — companion scale-out VRFs on the MX
 *
 * Variables:
 *   (none)
 */
routing-instances {
    srx_mnha_group_tlb-trust_fi {
        instance-type forwarding;
    }
    srx_mnha_group_tlb-untrust_fi {
        instance-type forwarding;
    }
}
```

## junos/transport/mx-scaleout-export-policies.conf

```
/*
 * Topic:   MX export policies for scale-out (default, client, per-plane next-hop-self, per-packet LB)
 * Seen on:
 *   Junos: mx1_mx304
 *
 * Highlights:
 *  - def_route_export / ipv6_def_route_export leak the static default toward the SRX trust plane.
 *  - ipv4_mx_trust-to-srx_trust_export and ...untrust... accept the health-check loopback (direct) and re-advertise BGP with next-hop self.
 *  - client_route_export advertises the SFW client prefix; mnha-mx-to-srx-export sets next-hop self on the ICL plane.
 *  - pfe_lb_hash (per-packet) is applied via forwarding-table export to spread ECMP in the PFE.
 *
 * Pair with:
 *  - junos/transport/mx-bgp-vrf-scaleout.conf — the BGP groups that apply these policies
 *  - junos/nat/mx-napt44-route-advertise.conf — the companion untrust->GW NAPT export
 *  - junos/interfaces/mx-ae-uni-flexible.conf — lo0.1/lo0.2 originate the health-check /32s
 *
 * Variables:
 *   $HC_TRUST_SRC    e.g. 192.168.10.251/32
 *   $HC_UNTRUST_SRC  e.g. 192.168.10.252/32
 *   $SFW_CLIENT_PFX  e.g. 172.80.0.0/12
 */
policy-options {
    policy-statement client_route_export {
        term 1 {
            from {
                protocol static;
                route-filter $SFW_CLIENT_PFX exact;
            }
            then accept;
        }
        term 2 {
            then reject;
        }
    }
    policy-statement def_route_export {
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
    policy-statement ipv4_mx_trust-to-srx_trust_export {
        term 1 {
            from {
                protocol direct;
                route-filter $HC_TRUST_SRC exact;
            }
            then accept;
        }
        term 2 {
            from protocol bgp;
            then {
                next-hop self;
                accept;
            }
        }
        term 3 {
            then reject;
        }
    }
    policy-statement ipv4_mx_untrust-to-srx_untrust_export {
        term 1 {
            from {
                protocol direct;
                route-filter $HC_UNTRUST_SRC exact;
            }
            then accept;
        }
        term 2 {
            from protocol bgp;
            then {
                next-hop self;
                accept;
            }
        }
        term 3 {
            then reject;
        }
    }
    policy-statement mnha-mx-to-srx-export {
        term 1 {
            from protocol bgp;
            then {
                next-hop self;
                accept;
            }
        }
        term 2 {
            then reject;
        }
    }
    policy-statement pfe_lb_hash {
        term ALL-ELSE {
            then {
                load-balance per-packet;
                accept;
            }
        }
    }
}
```

## junos/transport/srx-bgp-to-mx-scaleout.conf

```
/*
 * Topic:   SRX eBGP to the MX load balancer per plane (VR-1 trust/untrust v4+v6) + MNHA-VR ICL peering
 * Seen on:
 *   Junos: srx1a_srx4600 srx1b_srx4600 srx2a_srx4600 srx2b_srx4600
 *
 * Highlights:
 *  - VR-1 carries four eBGP groups to the MX: v4/v6 x trust/untrust, each exporting the matching signal-route-gated policy.
 *  - All SRX share local-as $SRX_AS; the MX side uses as-override so every SRX peers as a distinct neighbor while keeping one AS.
 *  - MNHA-VR runs a separate eBGP (local-as $SRX_MNHA_AS) over the ICL sub-unit for the signalling plane.
 *  - The NAPT/NAT64 pool prefixes are injected as static discard routes in VR-1 and advertised by the export policies.
 *  - forwarding-table export ecmp_policy_lab spreads flows in the PFE; BFD 300ms x3 everywhere for sub-second detection.
 *
 * Pair with:
 *  - junos/transport/mx-bgp-vrf-scaleout.conf — the MX side of these eBGP sessions
 *  - junos/high-availability/srx-signal-route-export-policies.conf — the export policies applied here
 *  - junos/interfaces/srx-ae-scaleout-subunits.conf — the sub-units these groups peer over
 *  - junos/high-availability/srx-mnha-chassis-srg.conf — MNHA-VR carries the ICL eBGP
 *  - junos/nat/srx-source-nat-napt44.conf — the NAPT pool prefixes advertised by these groups
 *
 * JVD peer devices (observed interop):
 *   Junos: mx1_mx304
 *
 * Variables:
 *   $MX_MNHA_AS        e.g. 65050
 *   $MX_TRUST_AS       e.g. 65200
 *   $MX_UNTRUST_AS     e.g. 65400
 *   $NAPT_PREFIX       e.g. 100.64.1.0/24
 *   $NAT64_SRC_PREFIX  e.g. 100.64.2.0/24
 *   $SRX_AS            e.g. 65000
 *   $SRX_MNHA_AS       e.g. 65001
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
                    local-as $SRX_MNHA_AS;
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
    VR-1 {
        instance-type virtual-router;
        routing-options {
            static {
                route $NAPT_PREFIX discard;
                route $NAT64_SRC_PREFIX discard;
            }
        }
        protocols {
            bgp {
                group Vsrx-to-MX_TRUST {
                    type external;
                    export trust_export_policy;
                    local-as $SRX_AS;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor 10.1.1.1 {
                        peer-as $MX_TRUST_AS;
                    }
                }
                group Vsrx-to-MX_UNTRUST {
                    type external;
                    export untrust_export_policy;
                    local-as $SRX_AS;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor 10.2.1.1 {
                        peer-as $MX_UNTRUST_AS;
                    }
                }
                group IPv6_Vsrx-to-MX_TRUST {
                    type external;
                    export ipv6_trust_export_policy;
                    local-as $SRX_AS;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor 2001:db8:1:1:1::1 {
                        peer-as $MX_TRUST_AS;
                    }
                }
                group IPv6_Vsrx-to-MX_UNTRUST {
                    type external;
                    export ipv6_untrust_export_policy;
                    local-as $SRX_AS;
                    bfd-liveness-detection {
                        minimum-interval 300;
                        minimum-receive-interval 300;
                        multiplier 3;
                    }
                    neighbor 2001:db8:1:2:1::1 {
                        peer-as $MX_UNTRUST_AS;
                    }
                }
                multipath;
            }
        }
        interface ae1.0;
        interface ae1.1;
        interface lo0.1;
    }
}
routing-options {
    forwarding-table {
        export ecmp_policy_lab;
    }
}
```

## _variables.md

# Snippet variable glossary

All `.conf` files under `junos/` are **templates**: identifiers that vary between
deployments are written as `$VAR`. This JVD's validated lab configs contain **no
secret material** (no `## SECRET-DATA`, PSKs, or encrypted passwords), so there are
no secret placeholders to supply.

Render with:

    ~/git-scripts/snips_render.py <snip>.conf <vars.json>  > rendered.conf

Example values are drawn from the validated lab configs under configuration/conf/
(the SRX examples use `srx1a_srx4600`, the MX examples use `mx1_mx304`, the gateway
examples use `gateway_emulator_mx304`).

## Autonomous systems

| Variable | What it is | Example |
|---|---|---|
| `$SRX_AS` | SRX VR-1 local-as (shared across the scale-out farm) | `65000` |
| `$SRX_MNHA_AS` | SRX MNHA-VR local-as (ICL eBGP) | `65001` |
| `$SRX_MNHA_A_AS` / `$SRX_MNHA_B_AS` | MNHA A-node / B-node AS as seen from the MX | `65001` / `65002` |
| `$MX_TRUST_AS` / `$TRUST_AS` | MX TRUST_VR local-as | `65200` |
| `$MX_UNTRUST_AS` / `$UNTRUST_AS` | MX UNTRUST_VR local-as | `65400` |
| `$MX_MNHA_AS` / `$MNHA_AS` | MX MNHA-VR local-as (ICL eBGP) | `65050` |
| `$GW_TRUST_AS` / `$GW_UNTRUST_AS` | North-side gateway-emulator peer AS | `65100` / `65300` |

## NAT pools & prefixes (CGN / NAPT44 / NAT64)

| Variable | What it is | Example |
|---|---|---|
| `$NAPT_POOL` | SRX source-NAT (NAPT44) pool name | `srx_nat_pool1` |
| `$NAPT_PREFIX` | Per-pair RFC6598 NAPT44 pool /24 | `100.64.1.0/24` |
| `$NAPT_POOL_1` … `$NAPT_POOL_4` | The four per-pair NAPT pools (MX route-filter-list) | `100.64.1.0/24` … `100.64.4.0/24` |
| `$NAT64_SRC_POOL` | SRX NAT64 source-NAT pool name | `nat_64_source_ipv4_pool` |
| `$NAT64_SRC_PREFIX` | NAT64 source v4 pool /24 | `100.64.2.0/24` |
| `$NAT64_CLIENT_V6` | NAT64 IPv6 client prefix | `2001:db8:172:80::/96` |
| `$NAT64_DST_V4` / `$NAT64_DST_V6` | NAT64 real v4 server / mapped v6 destination | `172.16.10.3/32` / `2001:db8:1::1/128` |

## Stateful-firewall (SFW) prefixes

| Variable | What it is | Example |
|---|---|---|
| `$SFW_CLIENT_PFX` / `$SFW_SERVER_PFX` | SFW pre-NAT client / server v4 prefix | `172.80.0.0/12` / `172.160.0.0/12` |
| `$SFW_CLIENT_V6` / `$SFW_SERVER_V6` | SFW client / server v6 prefix | `2001:db8:172:80::/96` / `2001:db8:172:160::/96` |
| `$INSIDE_NH` | Gateway-emulator inside next-hop for the client/server routes | `172.16.8.1` |

## Load balancer (TLB) & forwarding instances

| Variable | What it is | Example |
|---|---|---|
| `$TRUST_VRF` / `$UNTRUST_VRF` | TLB client/server VRFs | `TRUST_VR` / `UNTRUST_VR` |
| `$TRUST_FI` / `$UNTRUST_FI` | Forwarding instances holding the TLB virtual-services | `srx_mnha_group_tlb-trust_fi` / `srx_mnha_group_tlb-untrust_fi` |
| `$REAL1` / `$REAL2` | Per-pair TLB real-service (health-check / anchor) IPs | `192.168.10.1` / `192.168.10.2` |
| `$TCP_PORT` / `$WEB_PORT` | TCP health-check probe port = SRX web-management port | `8088` |

## MNHA & route signalling

| Variable | What it is | Example |
|---|---|---|
| `$LOCAL_IP` / `$PEER_IP` | MNHA local / peer node IP | `192.168.0.1` / `192.168.0.2` |
| `$MNHA_NODE` | MNHA node loopback /32 (re-advertised over the ICL) | `192.168.0.1` |
| `$MON_DEST` / `$MON_SRC` | SRG0 BFD monitor destination / source IP | `10.1.1.1` / `10.1.1.2` |
| `$MON_INT` | SRG0 BFD monitor interface | `ae1.0` |
| `$SIG_ROUTE` | MNHA signal-route installed on failure / tested by the condition | `192.168.255.0` |
| `$HC_SRC` / `$HC_SRC6` | SRX TLB health-check / anchor address (lo0.1) v4 / v6 | `192.168.10.1` / `2001:db8:1:255::1` |

## Interfaces & addressing

| Variable | What it is | Example |
|---|---|---|
| `$AE` | Aggregated-ethernet bundle to the MX | `ae1` |
| `$ETA` / `$ETB` | SRX member et- ports of the bundle | `et-1/0/0` / `et-1/0/1` |
| `$TRUST_IP` / `$UNTRUST_IP` / `$MNHA_IP` | Per-plane /30 point-to-point address (v4) | `10.1.1.1/30` |
| `$TRUST_IP6` / `$UNTRUST_IP6` | Per-plane /126 point-to-point address (v6) | `2001:db8:1:1:1::1/126` |
| `$TRUST_UNI_IP` / `$UNTRUST_UNI_IP` | MX north-side AC per-VLAN address (v4) | `172.16.1.1/30` / `172.16.2.1/30` |
| `$TRUST_UNI_IP6` / `$UNTRUST_UNI_IP6` | MX north-side AC per-VLAN address (v6) | `2001:db8:172:1:1::1/126` |
| `$HC_TRUST_SRC` / `$HC_UNTRUST_SRC` | MX TLB health-check source (lo0.1 / lo0.2) v4 | `192.168.10.251/32` / `192.168.10.252/32` |
| `$HC_TRUST_SRC6` / `$HC_UNTRUST_SRC6` | MX TLB health-check source (lo0.1 / lo0.2) v6 | `2001:db8:1:255::251/128` / `2001:db8:1:255::252/128` |

## Zones

| Variable | What it is | Example |
|---|---|---|
| `$TRUST_ZONE` / `$UNTRUST_ZONE` | SRX NAT rule-set from/to zones | `VR-1_trust_zone` / `VR-1_untrust_zone` |

## byoai/TIERS.md

# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each device role at each verbosity tier. It is bundled into [`jvd-so-fwnat-snips.md`](jvd-so-fwnat-snips.md) by `regenerate-bundle.sh`.

For each role, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. Every device in this JVD is **Junos** (MX304 + SRX4600); there is no `evo/` tree.

---

## What the tiers mean

| Tier | Use when | What's included |
|---|---|---|
| **`minimum`** | Brownfield change. Device already has its scale-out BGP planes and interfaces. You just want the component. | The component's snips + its mandatory `Pair with:` snips. **No BGP/interfaces baseline.** |
| **`with-bgp`** | Brownfield-ish. Interfaces are up but you want to (re)assert the device's scale-out eBGP peering + export policies. | `minimum` + the role's scale-out BGP plane snip(s) + export policies + AE sub-units. |
| **`as-deployed`** | Greenfield turn-up, lab build, or "give me a working end-to-end example." Mirrors what the JVD validates. | Everything for the role: component + BGP planes + interfaces, plus (SRX) MNHA chassis + signal policies + management bootstrap, and (MX-LB) the symmetric enhanced-hash-key. |

> **Greenfield / bootstrap requests** are always treated as **`as-deployed`**.

> **NAT scope:** the tested feature is source-NAT **NAPT44** (RFC6598 100.64/10, address-pooling paired). NAT64 is present in the lab configs but is a **non-goal** in the published design — it is NOT included in any default tier. Add it only via the explicit "Add NAT64" feature (see below), and flag it as off-design in Notes.

---

## MX load balancer (`MX-LB`)

The MX304 stateless load balancer (`mx1_mx304`) — RE-based Traffic Load Balancer in Direct Server Return mode.

- **`minimum`**
  - `junos/load-balancing/tlb-sfw-dsr.conf`
  - `junos/load-balancing/network-monitoring-profiles.conf`
  - `junos/transport/mx-forwarding-instance-tlb.conf`
  - `junos/firewall/mx-fbf-tlb-redirect.conf`
  - `junos/interfaces/mx-ae-uni-flexible.conf`
- **`with-bgp`** — `minimum` +
  - `junos/transport/mx-bgp-vrf-scaleout.conf`
  - `junos/transport/mx-scaleout-export-policies.conf`
  - `junos/nat/mx-napt44-route-advertise.conf`
  - `junos/interfaces/mx-ae-scaleout-subunits.conf`
- **`as-deployed`** — `with-bgp` +
  - `junos/transport/enhanced-hash-key-symmetric.conf` (required for dual-MX)

## SRX Stateful Firewall / NAT gateway (`SRX`)

An SRX4600 SFW + source-NAT (NAPT44) security gateway (`srx1a` … `srx2b`).

- **`minimum`**
  - `junos/nat/srx-source-nat-napt44.conf`
  - `junos/security/srx-zones-scaleout.conf`
  - `junos/security/srx-policies-sfw.conf`
  - `junos/interfaces/srx-lo0-hc-loopbacks.conf`
- **`with-bgp`** — `minimum` +
  - `junos/transport/srx-bgp-to-mx-scaleout.conf`
  - `junos/high-availability/srx-signal-route-export-policies.conf`
  - `junos/interfaces/srx-ae-scaleout-subunits.conf`
- **`as-deployed`** — `with-bgp` + full MNHA + management:
  - `junos/high-availability/srx-mnha-chassis-srg.conf`
  - `junos/bootstrap/srx-system-services.conf`

## SRX Multinode High Availability (`srx-mnha` — add-on)

Add MNHA to an existing SRX gateway. Always emit both together.

- **`minimum`** (== `as-deployed`)
  - `junos/high-availability/srx-mnha-chassis-srg.conf`
  - `junos/high-availability/srx-signal-route-export-policies.conf`

## Gateway emulator (`GW` — test harness)

The `gateway_emulator_mx304` north-side test router that originates the client/server prefixes and default route.

- **`minimum`** (== `as-deployed`)
  - `junos/transport/gw-emulator-bgp.conf`

## Add a feature

Single-purpose additions to an existing device.

- **Scale-out BGP plane** — MX: `junos/transport/mx-bgp-vrf-scaleout.conf` + `junos/transport/mx-scaleout-export-policies.conf` + `junos/nat/mx-napt44-route-advertise.conf`; SRX: `junos/transport/srx-bgp-to-mx-scaleout.conf` + `junos/high-availability/srx-signal-route-export-policies.conf`
- **Filter-based forwarding redirect (MX)** — `junos/firewall/mx-fbf-tlb-redirect.conf` + `junos/transport/mx-forwarding-instance-tlb.conf`
- **Symmetric hashing (dual-MX)** — `junos/transport/enhanced-hash-key-symmetric.conf`
- **TLB health-check profiles** — `junos/load-balancing/network-monitoring-profiles.conf`
- **NAPT44 pool advertisement (MX)** — `junos/nat/mx-napt44-route-advertise.conf`
- **SRX management bootstrap** — `junos/bootstrap/srx-system-services.conf` (web-management port 8088 answers the TLB TCP health-check)
- **NAT64 (off-design / non-goal)** — `junos/nat/srx-nat64.conf` (present in lab configs; NOT part of the validated NAPT44 design — flag in Notes)

## byoai/DEFAULTS.md

# Auto-fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default value for every `$VAR`, so `auto` mode (and the `all defaults` / `use defaults` / `skip` short-circuits) can generate without an interview. Values are drawn from the validated configs in `../conf/`. Bundled into [`jvd-so-fwnat-snips.md`](jvd-so-fwnat-snips.md) by `regenerate-bundle.sh`.

## Device selection shortcuts

| Shortcut | Device(s) | Role |
|---|---|---|
| `MX-LB` | `mx1_mx304` | MX304 stateless load balancer (TLB / DSR) |
| `SRX` | `srx1a` (+ `srx1b` as the MNHA peer) | SRX4600 SFW + source-NAT (NAPT44) gateway |
| `GW` | `gateway_emulator_mx304` | MX304 north-side test harness (client/server emulator) |

The SRX farm is two MNHA pairs: `srx1a`+`srx1b`, `srx2a`+`srx2b`.

## Load balancer & health-check anchors

| Variable | Default |
|---|---|
| `$REAL1` / `$REAL2` | `192.168.10.1` / `192.168.10.2` (per-pair anchor / health-check IPs) |
| `$TRUST_VRF` / `$UNTRUST_VRF` | `TRUST_VR` / `UNTRUST_VR` |
| `$TRUST_FI` / `$UNTRUST_FI` | `srx_mnha_group_tlb-trust_fi` / `srx_mnha_group_tlb-untrust_fi` |
| `$HC_SRC` / `$HC_SRC6` | `192.168.10.1` / `2001:db8:1:255::1` (SRX lo0.1 anchor) |
| `$HC_TRUST_SRC` / `$HC_UNTRUST_SRC` | `192.168.10.251/32` / `192.168.10.252/32` (MX lo0.1 / lo0.2 probe sources) |
| `$HC_TRUST_SRC6` / `$HC_UNTRUST_SRC6` | `2001:db8:1:255::251/128` / `2001:db8:1:255::252/128` |
| `$TCP_PORT` / `$WEB_PORT` | `8088` (TLB TCP probe = SRX web-management port — keep in sync) |

## Autonomous systems

| Variable | Default |
|---|---|
| `$TRUST_AS` / `$UNTRUST_AS` / `$MNHA_AS` (MX side) | `65200` / `65400` / `65050` |
| `$MX_TRUST_AS` / `$MX_UNTRUST_AS` / `$MX_MNHA_AS` (SRX view) | `65200` / `65400` / `65050` |
| `$SRX_AS` | `65000` (shared across the SRX farm; MX uses `as-override`) |
| `$SRX_MNHA_AS` | `65001` (MNHA-VR ICL local-as) |
| `$SRX_MNHA_A_AS` / `$SRX_MNHA_B_AS` | `65001` / `65002` (A/B node AS as seen by the MX) |
| `$GW_TRUST_AS` / `$GW_UNTRUST_AS` | `65100` / `65300` |

## Per-plane addressing (per SRX/MNHA node, /30 v4 + /126 v6)

| Plane | Sub-unit | MX side | SRX side |
|---|---|---|---|
| TRUST | `.0` | `10.1.1.1/30` · `2001:db8:1:1:1::1/126` | `10.1.1.2/30` · `2001:db8:1:1:1::2/126` |
| UNTRUST | `.1` | `10.2.1.1/30` · `2001:db8:1:2:1::1/126` | `10.2.1.2/30` · `2001:db8:1:2:1::2/126` |
| MNHA-ICL | `.100` | `10.3.1.1/30` | `10.3.1.2/30` |

North-side AC (MX `ae10`, flexible-ethernet-services): TRUST unit `.41` = `172.16.1.1/30`, UNTRUST unit `.81` = `172.16.2.1/30` (v6 `2001:db8:172:1:1::1/126` / `2001:db8:172:2:1::1/126`).

## NAT — source-NAT NAPT44 (the tested feature)

| Variable | Default |
|---|---|
| `$NAPT_POOL` | `srx_nat_pool1` (SRX source-NAT pool name) |
| `$NAPT_PREFIX` | `100.64.1.0/24` (pair 1) · `100.64.3.0/24` (pair 2) — **unique per MNHA pair** |
| `$NAPT_POOL_1` … `$NAPT_POOL_4` | `100.64.1.0/24` … `100.64.4.0/24` (MX route-filter-list) |
| pooling | `address-pooling paired` (endpoint-independent mapping) |

## Stateful-firewall prefixes

| Variable | Default |
|---|---|
| `$SFW_CLIENT_PFX` / `$SFW_SERVER_PFX` | `172.80.0.0/12` / `172.160.0.0/12` |
| `$SFW_CLIENT_V6` / `$SFW_SERVER_V6` | `2001:db8:172:80::/96` / `2001:db8:172:160::/96` |
| `$INSIDE_NH` | `172.16.8.1` (GW-emulator inside next-hop) |

## Zones

| Variable | Default |
|---|---|
| `$TRUST_ZONE` / `$UNTRUST_ZONE` | `VR-1_trust_zone` / `VR-1_untrust_zone` (MNHA-ICL zone: `trust_zone_mnha`) |

## SRX identity / MNHA signalling

| Variable | Default |
|---|---|
| `$LOCAL_IP` / `$MNHA_NODE` | `192.168.0.1` (srx*a); `192.168.0.2` (srx*b) |
| `$PEER_IP` | `192.168.0.2` (peer of srx*a) |
| `$SIG_ROUTE` | `192.168.255.0` (install-on-failure signal-route tested by the export conditions) |
| `$MON_DEST` / `$MON_SRC` | `10.1.1.1` / `10.1.1.2` (SRG0 BFD monitor dest / src) |
| `$MON_INT` | `ae1.0` |

## Interfaces

| Variable | Default |
|---|---|
| `$AE` | `ae1` (pair 1) · `ae2` (pair 2) — to the MX |
| `$ETA` / `$ETB` | `et-1/0/0` / `et-1/0/1` (SRX member ports) |
| BFD | 300 ms × 3 (sub-second detection); LACP active periodic-fast, minimum-links 1 |

## NAT64 (off-design / non-goal — never auto-included)

Present in the lab configs but scoped as a non-goal by the published design guides. Only rendered on an explicit "Add NAT64" request. Defaults: `$NAT64_SRC_POOL` = `nat_64_source_ipv4_pool`, `$NAT64_SRC_PREFIX` = `100.64.2.0/24`, `$NAT64_CLIENT_V6` = `2001:db8:172:80::/96`, `$NAT64_DST_V4` = `172.16.10.3/32`, `$NAT64_DST_V6` = `2001:db8:1::1/128`.

## Secrets

This JVD's validated lab configs contain **no secret material** (no `## SECRET-DATA`, PSKs, or encrypted passwords), so there are no secret placeholders to supply.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-so-fwnat-snips.md`](jvd-so-fwnat-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum" or "with-bgp"
# devices:
#   - { name: <hostname>, os: junos, role: <MX-LB|SRX|GW> }
# component:
#   kind: <mx-load-balancer|srx-sfw-nat|srx-mnha|gw-emulator|add-feature>
#   nat: { type: napt44, pool: srx_nat_pool1, prefix: 100.64.1.0/24, pooling: paired }
#   as: { srx: 65000, trust: 65200, untrust: 65400, mnha: 65050 }
#   planes: { trust: 10.1.1.x/30, untrust: 10.2.1.x/30, mnha: 10.3.1.x/30 }
# snips_used:
#   - junos/load-balancing/tlb-sfw-dsr.conf
#   - junos/firewall/mx-fbf-tlb-redirect.conf
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

For an end-to-end scale-out example, emit the **MX load-balancer** and the **SRX SFW/NAT gateway** as separate device blocks. Drop the leading C-style `/* … */` documentation header from each snip when emitting. Keep one `/* snips/<path> */` line as the section comment.

## 3. `Notes:` section (always last)

Bullets covering:

- Snips intentionally omitted (and why).
- Inputs defaulted because the user did not provide them.
- Cross-device consistency the user must verify: per-plane /30s match between the MX and SRX sides; the SRX share one local-as (`$SRX_AS`) while the MX side uses `as-override`; the TLB TCP health-check port matches the SRX `web-management http` port (8088); the MNHA signal-route (`$SIG_ROUTE`) matches on both nodes; the health-check anchor (`$HC_SRC`, SRX lo0.1) is the same on both nodes of a pair.
- NAT: the source-NAT NAPT44 pool `$NAPT_PREFIX` is **unique per MNHA pair** (100.64.1.0/24 on pair 1, 100.64.3.0/24 on pair 2) so translations never collide; `address-pooling paired` must stay set for endpoint-independent mapping.
- Prerequisites: for **SRX**, MNHA needs `chassis high-availability` (SRG0 + BFD monitor + install-on-failure signal-route) plus the active/backup signal-route export policies. For **MX-LB**, RE-based TLB needs `services traffic-load-balance routing-engine-mode` on MX304/MX10000 (already in `tlb-sfw-dsr.conf`).
- **NAT64 is a non-goal.** If NAT64 was requested and emitted, state clearly it is present in the lab configs but OUTSIDE the validated NAPT44 design.
- Anything that is by-pattern rather than validated on that exact device (e.g. a user-supplied hostname not in any snip's `Seen on:` list).

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
