# JVD AI/ML Multi-Tenancy Backend (EVPN-VXLAN GPU fabric) snippet library

## evo/bootstrap/chassis-buffer-monitor.conf

```
/*
 * Topic:   FPC traffic-manager buffer-monitor for AI/RoCE fabric visibility
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 *
 * Highlights:
 *  - Enables per-FPC buffer-occupancy telemetry on QFX5240 — required to
 *    observe PFC pause headroom and ECN marking thresholds in real time
 *  - Necessary for RoCEv2 lossless fabric tuning; pairs with the CoS
 *    shared-buffer / lossless-headroom partition definitions
 *  - Single-FPC pizza-box; replicate the `fpc N` block per slot on chassis
 *
 * Pair with:
 *  - evo/cos/rdma-rocev2-lossless.conf  (the buffer partitions being monitored)
 */
chassis {
    fpc 0 {
        traffic-manager {
            buffer-monitor-enable;
        }
    }
}
```

## evo/bootstrap/security-grpc-cert.conf

```
/*
 * Topic:   Local TLS certificate for the gRPC extension-service listener
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 *
 * Highlights:
 *  - Holds the `aos_grpc` cert/key pair referenced by the gRPC SSL stanza
 *  - The actual key material is masked as "secret" ## SECRET-DATA — the
 *    template only carries the structure; supply real PEM at deploy time
 *  - Cert name is fixed (`aos_grpc`) because the system extension-service
 *    block references it by literal name
 *
 * Pair with:
 *  - evo/bootstrap/system-grpc-netconf.conf  (consumer of this certificate)
 *
 * Variables (example values from leaf1_qfx5240-64od):
 *   $GRPC_CERT_PEM   e.g. (PEM-encoded cert+key blob, masked at runtime)
 */
security {
    certificates {
        local {
            aos_grpc {
                "$GRPC_CERT_PEM"; ## SECRET-DATA
            }
        }
    }
}
```

## evo/bootstrap/system-grpc-netconf.conf

```
/*
 * Topic:   System base — netconf/SSH, gRPC extension-service over TLS, mgmt instance
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 *
 * Highlights:
 *  - gRPC request-response listener on port 32767 with TLS, anchored to
 *    the dedicated mgmt_junos routing-instance — keeps Apstra / streaming
 *    telemetry off the in-band fabric
 *  - `management-instance` puts the management ethernet in mgmt_junos so
 *    OOB and in-band have separate route tables (no leakage)
 *  - ddos-protection `resolve aggregate disable-fpc` prevents PFC pause
 *    storms from reaching the RE during heavy GPU-fabric incast
 *  - Pairs with security/certificates for the `aos_grpc` local-cert
 *
 * Pair with:
 *  - evo/bootstrap/security-grpc-cert.conf  (provides the local-certificate)
 *
 * Variables (example values from leaf1_qfx5240-64od):
 *   $HOSTNAME      e.g. GPU-R1-L1
 *   $GRPC_PORT     e.g. 32767
 */
system {
    host-name $HOSTNAME;
    services {
        netconf {
            ssh;
        }
        extension-service {
            request-response {
                grpc {
                    ssl {
                        port $GRPC_PORT;
                        local-certificate aos_grpc;
                    }
                    routing-instance mgmt_junos;
                }
            }
        }
    }
    management-instance;
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

## evo/cos/rdma-rocev2-lossless.conf

```
/*
 * Topic:   RoCEv2 lossless CoS — DSCP classifier, PFC, ECN, lossless buffers, schedulers
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 *
 * Highlights:
 *  - Two forwarding-classes carry the GPU traffic:
 *      NO-LOSS  (queue 4, lossless, PFC priority 3, ECN-marked via WRED)
 *      CNP      (queue 3, strict-high, 5% rate cap — for RoCEv2 Congestion
 *               Notification Packets so they bypass the very congestion
 *               they're reporting)
 *  - DSCP classifier `mydscp` maps DSCP 011010 (CS3 = 26) -> NO-LOSS
 *    and DSCP 110000 (CS6 = 48) -> CNP, matching standard RoCEv2 marking
 *  - Drop profile dp1 starts marking ECN at 55% buffer fill, 100% at 90%
 *    — the classic RoCEv2 ECN profile recommended by NVIDIA / DCQCN
 *  - shared-buffer ingress: 66% lossless + 24% lossless-headroom (the
 *    PFC pause headroom) + 10% lossy. egress: 66% lossless + 10% lossy.
 *    The headroom is sized for cable length + PFC reaction time on a
 *    single-tier fabric; revisit for multi-tier or longer cabling.
 *  - dedicated-buffer ingress 15% / egress 30% — per-port reservation
 *    that isolates one congested port from starving its neighbors
 *  - `pfc-watchdog` auto-restores a queue stuck in PFC-paused state
 *  - The `interfaces et-* unit *` wildcard applies the classifier and
 *    scheduler-map to every et-* port automatically — no per-port repetition
 *
 * Pair with:
 *  - evo/bootstrap/chassis-buffer-monitor.conf  (telemetry for these buffers)
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
    drop-profiles {
        dp1 {
            interpolate {
                fill-level [ 55 90 ];
                drop-probability [ 0 100 ];
            }
        }
    }
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
    dedicated-buffer {
        ingress {
            percent 15;
        }
        egress {
            percent 30;
        }
    }
    forwarding-classes {
        class CNP queue-num 3;
        class NO-LOSS queue-num 4 no-loss pfc-priority 3;
    }
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
    scheduler-maps {
        sm1 {
            forwarding-class CNP scheduler s2-cnp;
            forwarding-class NO-LOSS scheduler s1;
        }
    }
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

## evo/interfaces/fabric-p2p-400g-breakout.conf

```
/*
 * Topic:   400G breakout to 2x sub-ports for fabric P2P /31 links (MTU 9216/9170)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 *
 * Highlights:
 *  - Two-step pattern: parent port declares `number-of-sub-ports 2` +
 *    `speed 400g`, then each `:N` sub-port carries the actual L3 config
 *  - Physical MTU 9216 / IP MTU 9170 — leaves 46B headroom for VXLAN +
 *    underlay encap so encapsulated 9000B tenant frames don't fragment
 *  - /31 numbering on every spine<->leaf link; underlay is pure IPv4
 *    eBGP unnumbered-style with explicit local-address per session
 *  - No `family inet6` on fabric links (IPv6 is tenant-side only)
 *
 * Pair with:
 *  - evo/transport/bgp-ebgp-fabric-underlay.conf  (consumes these /31s as BGP local-addresses)
 *
 * Variables (example values from leaf1_qfx5240-64od et-0/0/0):
 *   $PHY_PORT      e.g. et-0/0/0
 *   $PEER_HOST     e.g. spine1
 *   $PEER_PORT_A   e.g. et-0/0/0:0
 *   $PEER_PORT_B   e.g. et-0/0/0:1
 *   $LOCAL_V4_A    e.g. 10.0.2.177/31
 *   $LOCAL_V4_B    e.g. 10.0.2.131/31
 */
interfaces {
    $PHY_PORT {
        description "Breakout $PHY_PORT";
        number-of-sub-ports 2;
        speed 400g;
    }
    ${PHY_PORT}:0 {
        description facing_$PEER_HOST:$PEER_PORT_A;
        mtu 9216;
        unit 0 {
            family inet {
                mtu 9170;
                address $LOCAL_V4_A;
            }
        }
    }
    ${PHY_PORT}:1 {
        description facing_$PEER_HOST:$PEER_PORT_B;
        mtu 9216;
        unit 0 {
            family inet {
                mtu 9170;
                address $LOCAL_V4_B;
            }
        }
    }
}
```

## evo/interfaces/irb-tenant-gateway.conf

```
/*
 * Topic:   IRB anycast gateway per tenant — MTU 9000, shared virtual MAC
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 *
 * Highlights:
 *  - One IRB unit per tenant subnet; the SAME virtual MAC (00:1c:73:00:00:01)
 *    is configured on every leaf so any leaf can answer ARP for the tenant
 *    gateway (anycast-gateway pattern, no VRRP needed)
 *  - IRB MTU 9000 (jumbo) sized for AI/ML payloads; underlying physical
 *    interfaces use MTU 9216 to leave headroom for VXLAN encapsulation
 *  - Each unit's family inet address is the tenant subnet's gateway IP
 *  - Unit numbers are globally meaningful — pick a per-tenant unit-number
 *    convention and stick to it across the fabric
 *
 * Pair with:
 *  - evo/services/evpn-vrf-ip-prefix-routes.conf  (VRFs that bind these IRB units)
 *  - evo/interfaces/loopback-leaf.conf  (companion lo0 units per VRF)
 *
 * Variables (example values from leaf1_qfx5240-64od irb.2 / tenant-1):
 *   $IRB_UNIT          e.g. 2
 *   $TENANT_GW_V4      e.g. 10.200.0.1/24
 *   $ANYCAST_MAC       e.g. 00:1c:73:00:00:01
 */
interfaces {
    irb {
        mtu 9216;
        unit $IRB_UNIT {
            family inet {
                mtu 9000;
                address $TENANT_GW_V4;
            }
            mac $ANYCAST_MAC;
        }
    }
}
```

## evo/interfaces/loopback-leaf.conf

```
/*
 * Topic:   Leaf loopback — primary unit (underlay/overlay) + per-VRF units
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 *
 * Highlights:
 *  - unit 0 is the device's underlay router-id and the EVPN overlay
 *    eBGP local-address — single loopback drives both planes
 *  - Each tenant VRF gets its own lo0.N unit, bound into the VRF's
 *    interface list so the EVPN type-5 (ip-prefix-routes) RIB has a
 *    next-hop anchor
 *  - Dual-stack v4 + v6 on every unit; v6 ULA range fdf6:ed70:1fac:f2d2::/64
 *  - The unit-number-to-VRF mapping must match the IRB unit-number
 *    convention (see irb-tenant-gateway snip)
 *
 * Pair with:
 *  - evo/interfaces/irb-tenant-gateway.conf  (per-tenant IRB units)
 *  - evo/services/evpn-vrf-ip-prefix-routes.conf  (VRFs reference these lo0.N units)
 *  - evo/transport/bgp-ebgp-evpn-overlay.conf  (uses lo0.0 as local-address)
 *
 * Variables (example values from leaf1_qfx5240-64od):
 *   $LO0_V4            e.g. 10.0.1.9/32
 *   $LO0_V6            e.g. fdf6:ed70:1fac:f2d2::1007/128
 *   $TENANT_UNIT       e.g. 2
 *   $TENANT_LO_V4      e.g. 192.168.11.4/32
 *   $TENANT_LO_V6      e.g. fdf6:ed70:1fac:f2d2::1010/128
 */
interfaces {
    lo0 {
        unit 0 {
            family inet {
                address $LO0_V4;
            }
            family inet6 {
                address $LO0_V6;
            }
        }
        unit $TENANT_UNIT {
            family inet {
                address $TENANT_LO_V4;
            }
            family inet6 {
                address $TENANT_LO_V6;
            }
        }
    }
}
```

## evo/interfaces/loopback-spine.conf

```
/*
 * Topic:   Spine loopback — single unit serving both underlay router-id and EVPN overlay
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 *
 * Highlights:
 *  - Spines have NO tenant VRFs (pure underlay + EVPN route-relay), so a
 *    single lo0.0 covers both the underlay router-id and the eBGP-EVPN
 *    overlay local-address
 *  - Dual-stack v4 + v6 (v6 ULA fdf6:ed70:1fac:f2d2::/64) — v6 is reserved
 *    for future overlay AFs; underlay BGP today is v4-only
 *
 * Pair with:
 *  - evo/transport/bgp-ebgp-evpn-overlay.conf  (uses lo0.0 as local-address)
 *  - evo/transport/routing-options-ecmp-frr.conf  (router-id derived from lo0.0)
 *
 * Variables (example values from spine1_qfx5240-64od):
 *   $LO0_V4    e.g. 10.0.0.8/32
 *   $LO0_V6    e.g. fdf6:ed70:1fac:f2d2::1000/128
 */
interfaces {
    lo0 {
        unit 0 {
            family inet {
                address $LO0_V4;
            }
            family inet6 {
                address $LO0_V6;
            }
        }
    }
}
```

## evo/interfaces/tenant-gpu-server-link.conf

```
/*
 * Topic:   Per-tenant GPU-server-facing 400G sub-port with dual-stack /31
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 *
 * Highlights:
 *  - Each GPU host attaches via 400G breakout sub-ports; each sub-port is
 *    bound to exactly ONE tenant VRF (clean per-tenant isolation, no
 *    sub-interfaces / VLANs needed)
 *  - Description carries the tenant tag (`VRF tenant-N to <host>`) so
 *    Apstra / operators can audit tenant-to-port mapping by `show interfaces`
 *  - Dual-stack: family inet with /31 + family inet6 (RAs handle v6 GUA
 *    via the router-advertisement snip)
 *  - MTU 9216 phy / 9170 inet — same as fabric P2P so VXLAN-encapsulated
 *    9000B host frames pass without fragmentation across the entire path
 *
 * Pair with:
 *  - evo/services/evpn-vrf-ip-prefix-routes.conf  (the VRF that owns this interface)
 *  - evo/transport/router-advertisement.conf  (IPv6 GUA delivery)
 *
 * Variables (example values from leaf1_qfx5240-64od et-0/0/12:0):
 *   $AC_INTF       e.g. et-0/0/12:0
 *   $TENANT_NAME   e.g. tenant-1
 *   $GPU_HOST      e.g. H100-01
 *   $LOCAL_V4      e.g. 10.200.0.11/31
 */
interfaces {
    $AC_INTF {
        description "VRF $TENANT_NAME to $GPU_HOST";
        mtu 9216;
        unit 0 {
            family inet {
                mtu 9170;
                address $LOCAL_V4;
            }
            family inet6;
        }
    }
}
```

## evo/oam/l2-learning-telemetry.conf

```
/*
 * Topic:   L2-learning telemetry — stream remote MAC entries via gRPC
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 *
 * Highlights:
 *  - Enables export of remotely-learned MAC entries (i.e. EVPN-imported
 *    MACs from other leafs) via the streaming-telemetry channel
 *  - Without this, only locally-learned MACs are visible in the gRPC
 *    MAC-table feed, which makes EVPN MAC-mobility debugging blind
 *  - Leaf-only — spines don't terminate EVPN MAC entries in this design
 *
 * Pair with:
 *  - evo/bootstrap/system-grpc-netconf.conf  (the gRPC channel that carries this telemetry)
 */
protocols {
    l2-learning {
        telemetry {
            enable-remote-entries;
        }
    }
}
```

## evo/oam/lldp-interface-all.conf

```
/*
 * Topic:   LLDP enabled on all interfaces with descriptive port-id reporting
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 *
 * Highlights:
 *  - `port-id-subtype interface-name` makes the advertised LLDP port-id
 *    match the actual Junos interface name (e.g. `et-0/0/0:0`) instead
 *    of an opaque ifIndex — much friendlier for Apstra / NMS topology
 *    discovery
 *  - `port-description-type interface-description` propagates the local
 *    interface description over LLDP, so neighbor `show lldp neighbors`
 *    surfaces things like "facing_spine1:et-0/0/0:0"
 *  - `neighbour-port-info-display port-id` (note British spelling) makes
 *    `show lldp neighbors` show the remote port-id instead of the remote
 *    description — useful when remote descriptions are stale
 *  - `interface all` covers every physical port; no need to enumerate
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

## evo/oam/rstp-disable.conf

```
/*
 * Topic:   RSTP disabled on spine — pure L3 device, no L2 loop protection needed
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 *
 * Highlights:
 *  - Spines in this AI/ML CLOS are pure L3 (no IRB, no bridge-domain,
 *    no VLAN tagging) — RSTP would just emit BPDUs no one needs
 *  - Explicitly disabling (vs leaving default) silences the BPDU TX on
 *    every port and avoids wasted CPU on STP timers
 *  - Leafs do NOT include this stanza — they have IRBs and the default
 *    RSTP behavior is benign there since IRB ports aren't trunked
 */
protocols {
    rstp {
        disable;
    }
}
```

## evo/policy/allpodnetworks-direct-redistribution.conf

```
/*
 * Topic:   AllPodNetworks — direct-route redistribution into BGP with community tagging
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 *
 * Highlights:
 *  - Redistributes locally-attached IPv4 + IPv6 direct routes into BGP
 *    and stamps them with the appropriate "default direct" community
 *    so downstream pods can identify their origin
 *  - Implicit-deny term at the bottom (term -100 reject) — prevents
 *    accidental leakage of any other route family
 *  - The companion `BGP-AOS-Policy` umbrella policy chains this one
 *    first, then accepts everything else from `protocol bgp` (spine)
 *    or only EVPN-derived /32-/32 + /128-/128 host routes (leaf)
 *  - Leafs use the same skeleton but extend it with per-tenant
 *    variants (see evo/policy/tenant-community-export.conf)
 *
 * Pair with:
 *  - evo/policy/community-definitions.conf  (DEFAULT_DIRECT_V4 / V6)
 *  - evo/policy/tenant-community-export.conf  (per-tenant variants)
 *  - evo/transport/bgp-ebgp-fabric-underlay.conf  (consumes BGP-AOS-Policy)
 */

/* --- SPINE variant (simpler — accepts all bgp-learned routes downstream) --- */
policy-options {
    policy-statement AllPodNetworks {
        term AllPodNetworks-10 {
            from {
                family inet;
                protocol direct;
            }
            then {
                community add DEFAULT_DIRECT_V4;
                accept;
            }
        }
        term AllPodNetworks-20 {
            from {
                family inet6;
                protocol direct;
            }
            then {
                community add DEFAULT_DIRECT_V6;
                accept;
            }
        }
        term AllPodNetworks-100 {
            then reject;
        }
    }
    policy-statement BGP-AOS-Policy {
        term BGP-AOS-Policy-10 {
            from policy AllPodNetworks;
            then accept;
        }
        term BGP-AOS-Policy-20 {
            from protocol bgp;
            then accept;
        }
        term BGP-AOS-Policy-100 {
            then reject;
        }
    }
}

/* --- LEAF variant (only re-advertises host routes derived from EVPN) --- */
policy-options {
    policy-statement AllPodNetworks {
        term AllPodNetworks-10 {
            from {
                family inet;
                protocol direct;
            }
            then {
                community add DEFAULT_DIRECT_V4;
                accept;
            }
        }
        term AllPodNetworks-20 {
            from {
                family inet6;
                protocol direct;
            }
            then {
                community add DEFAULT_DIRECT_V6;
                accept;
            }
        }
        term AllPodNetworks-100 {
            then reject;
        }
    }
    policy-statement BGP-AOS-Policy {
        term BGP-AOS-Policy-10 {
            from policy AllPodNetworks;
            then accept;
        }
        term BGP-AOS-Policy-50 {
            from {
                protocol evpn;
                route-filter 0.0.0.0/0 prefix-length-range /32-/32;
            }
            then accept;
        }
        term BGP-AOS-Policy-60 {
            from {
                protocol evpn;
                route-filter 0::0/0 prefix-length-range /128-/128;
            }
            then accept;
        }
        term BGP-AOS-Policy-100 {
            then reject;
        }
    }
}
```

## evo/policy/clos-loop-prevention.conf

```
/*
 * Topic:   eBGP CLOS loop-prevention — spine tags outbound, leaf rejects tagged inbound
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 *
 * Highlights:
 *  - Standard 3-stage CLOS loop-prevention without relying on AS-path filtering
 *  - Spine stamps FROM_SPINE_*_TIER community on all routes sent to leafs
 *  - Leaf rejects any route carrying that stamp when exporting back to spines
 *  - Two parallel planes: one for fabric (inet unicast) and one for EVPN overlay
 *  - There's also a separate EVPN_EXPORT policy (leaf-only) that's a simple
 *    "accept all" stub — chained after LEAF_TO_SPINE_EVPN_OUT in the leaf's
 *    EVPN export so future filtering can be added without restructuring
 *  - Deploy the SPINE variant on spines, the LEAF variant on leafs — both
 *    sides reference the same community values
 *
 * Pair with:
 *  - evo/policy/community-definitions.conf  (FROM_SPINE_EVPN_TIER / FROM_SPINE_FABRIC_TIER)
 *  - evo/transport/bgp-ebgp-fabric-underlay.conf  (consumer of LEAF_TO_SPINE_FABRIC_OUT / SPINE_TO_LEAF_FABRIC_OUT)
 *  - evo/transport/bgp-ebgp-evpn-overlay.conf   (consumer of LEAF_TO_SPINE_EVPN_OUT / SPINE_TO_LEAF_EVPN_OUT)
 */

/* --- SPINE variant (deploy on spine-role devices) --- */
policy-options {
    policy-statement SPINE_TO_LEAF_FABRIC_OUT {
        term SPINE_TO_LEAF_FABRIC_OUT-10 {
            then {
                community add FROM_SPINE_FABRIC_TIER;
                accept;
            }
        }
    }
    policy-statement SPINE_TO_LEAF_EVPN_OUT {
        term SPINE_TO_LEAF_EVPN_OUT-10 {
            then {
                community add FROM_SPINE_EVPN_TIER;
                accept;
            }
        }
    }
}

/* --- LEAF variant (deploy on leaf-role devices) --- */
policy-options {
    policy-statement LEAF_TO_SPINE_FABRIC_OUT {
        term LEAF_TO_SPINE_FABRIC_OUT-10 {
            from {
                protocol bgp;
                community FROM_SPINE_FABRIC_TIER;
            }
            then reject;
        }
        term LEAF_TO_SPINE_FABRIC_OUT-20 {
            then accept;
        }
    }
    policy-statement LEAF_TO_SPINE_EVPN_OUT {
        term LEAF_TO_SPINE_EVPN_OUT-10 {
            from {
                protocol bgp;
                community FROM_SPINE_EVPN_TIER;
            }
            then reject;
        }
        term LEAF_TO_SPINE_EVPN_OUT-20 {
            then accept;
        }
    }
    policy-statement EVPN_EXPORT {
        term EVPN_EXPORT-4095 {
            then accept;
        }
    }
}
```

## evo/policy/community-definitions.conf

```
/*
 * Topic:   BGP community definitions — tier markers, default redistribution, per-tenant
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 *
 * Highlights:
 *  - FROM_SPINE_*_TIER (0:14, 0:15) = CLOS loop-prevention markers stamped
 *    by spines and rejected by leafs (see clos-loop-prevention snip)
 *  - DEFAULT_DIRECT_V4/V6 = identifies locally-redistributed direct
 *    routes; the high-order tag (1:* on spines, 5:* on leafs) encodes
 *    the tier, the low-order tag is the family selector + a fabric ID
 *  - TENANT-N_COMMUNITY_V4/V6 = per-tenant VRF marker carried on EVPN
 *    type-5 routes; pairs with the per-tenant export policies
 *  - NON-TENANT_COMMUNITY_V4/V6 = shared / infrastructure routes that
 *    need cross-tenant visibility
 *  - Tier prefix differs by role: spines use `1:20007` / `1:20008`,
 *    leafs use `5:20007` / `5:20008` for the same DEFAULT_DIRECT_V4/V6
 *  - All other communities are identical between leaf and spine — keep
 *    only the tier-specific DEFAULT_DIRECT lines per role
 *
 * Pair with:
 *  - evo/policy/clos-loop-prevention.conf  (consumer of FROM_SPINE_*_TIER)
 *  - evo/policy/allpodnetworks-direct-redistribution.conf  (consumer of DEFAULT_DIRECT_V4/V6)
 *  - evo/policy/tenant-community-export.conf  (consumer of TENANT-N_*)
 *
 * Variables (example values from leaf1_qfx5240-64od / spine1_qfx5240-64od):
 *   $LOCAL_TIER_TAG    e.g. 5  (leaf) or 1 (spine)
 *   $TENANT_INDEX      e.g. 21002:26000  (per-tenant low-order tag)
 */
policy-options {
    /* Tier markers — identical on every device in the fabric */
    community FROM_SPINE_EVPN_TIER members 0:14;
    community FROM_SPINE_FABRIC_TIER members 0:15;

    /* Direct-route redistribution — high-order tag differs per role */
    community DEFAULT_DIRECT_V4 members [ ${LOCAL_TIER_TAG}:20007 21001:26000 ];
    community DEFAULT_DIRECT_V6 members [ ${LOCAL_TIER_TAG}:20008 21001:26000 ];

    /* Per-tenant + non-tenant markers — leaf-only in this JVD */
    community NON-TENANT_COMMUNITY_V4 members [ 5:20007 21010:26000 ];
    community NON-TENANT_COMMUNITY_V6 members [ 5:20008 21010:26000 ];
    community TENANT-1_COMMUNITY_V4 members [ 5:20007 21002:26000 ];
    community TENANT-1_COMMUNITY_V6 members [ 5:20008 21002:26000 ];
    community TENANT-2_COMMUNITY_V4 members [ 5:20007 21003:26000 ];
    community TENANT-2_COMMUNITY_V6 members [ 5:20008 21003:26000 ];
    community TENANT-3_COMMUNITY_V4 members [ 5:20007 21004:26000 ];
    community TENANT-3_COMMUNITY_V6 members [ 5:20008 21004:26000 ];
    community TENANT-4_COMMUNITY_V4 members [ 5:20007 21005:26000 ];
    community TENANT-4_COMMUNITY_V6 members [ 5:20008 21005:26000 ];
}
```

## evo/policy/pfe-load-balance.conf

```
/*
 * Topic:   PFE per-packet load-balance policy (referenced by forwarding-table export)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 *
 * Highlights:
 *  - Tells the FIB to install per-packet load-balance next-hops — the
 *    actual hashing/DLB behavior is governed by forwarding-options
 *  - Without this policy, ECMP routes default to per-prefix load-balance
 *    (only one of the available next-hops is used per prefix)
 *  - Required by the DLB flowlet engine to even see all the parallel
 *    paths it can shift flows between
 *
 * Pair with:
 *  - evo/transport/routing-options-ecmp-frr.conf  (forwarding-table export PFE-LB)
 *  - evo/transport/ecmp-dlb-flowlet.conf  (the actual hashing behavior)
 */
policy-options {
    policy-statement PFE-LB {
        then {
            load-balance per-packet;
        }
    }
}
```

## evo/policy/tenant-community-export.conf

```
/*
 * Topic:   Per-tenant export policies — AllPodNetworks-tenant-N + BGP-AOS-Policy-tenant-N
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 *
 * Highlights:
 *  - One pair of policies per tenant VRF — they're referenced by the
 *    VRF's `evpn ip-prefix-routes export` statement (NOT by the global
 *    BGP underlay group)
 *  - Each tenant gets a unique community pair (V4/V6) — listed below as
 *    `non-tenant`, `tenant-1`, `tenant-2`, `tenant-3`, `tenant-4`. Add
 *    new tenants by cloning the block and incrementing the index.
 *  - The structure is identical across tenants — only the tenant tag
 *    in the policy name + the community name change. A future jinja
 *    template should fold these into a single per-tenant generator.
 *  - The `non-tenant` variant exists for shared / infrastructure
 *    routes that need to be visible across tenants (e.g. a shared
 *    storage VRF leaked into tenant-N via auto-export)
 *
 * Pair with:
 *  - evo/policy/community-definitions.conf  (TENANT-N_COMMUNITY_V4/V6, NON-TENANT_COMMUNITY_V4/V6)
 *  - evo/services/evpn-vrf-ip-prefix-routes.conf  (consumer of these per-tenant export policies)
 *
 * Variables (example values from leaf1_qfx5240-64od / tenant-1):
 *   $TENANT_TAG          e.g. tenant-1   (or "non-tenant")
 *   $TENANT_COMMUNITY_V4 e.g. TENANT-1_COMMUNITY_V4
 *   $TENANT_COMMUNITY_V6 e.g. TENANT-1_COMMUNITY_V6
 */
policy-options {
    policy-statement AllPodNetworks-$TENANT_TAG {
        term AllPodNetworks-${TENANT_TAG}-10 {
            from {
                family inet;
                protocol direct;
            }
            then {
                community add $TENANT_COMMUNITY_V4;
                accept;
            }
        }
        term AllPodNetworks-${TENANT_TAG}-20 {
            from {
                family inet6;
                protocol direct;
            }
            then {
                community add $TENANT_COMMUNITY_V6;
                accept;
            }
        }
        term AllPodNetworks-${TENANT_TAG}-100 {
            then reject;
        }
    }
    policy-statement BGP-AOS-Policy-$TENANT_TAG {
        term BGP-AOS-Policy-${TENANT_TAG}-10 {
            from policy AllPodNetworks-$TENANT_TAG;
            then accept;
        }
        term BGP-AOS-Policy-${TENANT_TAG}-50 {
            from {
                protocol evpn;
                route-filter 0.0.0.0/0 prefix-length-range /32-/32;
            }
            then {
                community add $TENANT_COMMUNITY_V4;
                accept;
            }
        }
        term BGP-AOS-Policy-${TENANT_TAG}-60 {
            from {
                protocol evpn;
                route-filter 0::0/0 prefix-length-range /128-/128;
            }
            then {
                community add $TENANT_COMMUNITY_V6;
                accept;
            }
        }
        term BGP-AOS-Policy-${TENANT_TAG}-100 {
            then reject;
        }
    }
}
```

## evo/services/evpn-vrf-ip-prefix-routes.conf

```
/*
 * Topic:   Per-tenant VRF with EVPN type-5 ip-prefix-routes (VXLAN encap)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 *
 * Highlights:
 *  - Pure L3 VXLAN-EVPN multi-tenancy — each tenant is a `vrf` with
 *    EVPN ip-prefix-routes (type-5) advertising the tenant's IPv4 +
 *    IPv6 reachability, encapsulated in VXLAN over the underlay
 *  - `advertise direct-nexthop` puts the originating leaf's lo0.0 in
 *    the EVPN route's NH (instead of an anycast VTEP) — pairs with
 *    multihop+no-nexthop-change on the spine BGP-EVPN group so the
 *    NH survives the relay
 *  - Per-tenant VNI: 20001/20002/20003/20004 = tenant-1..4. Pick a
 *    convention that maps cleanly to your downstream automation.
 *  - RD = `${LO0_V4}:${VNI}` — one tag per VRF per device, ensures
 *    EVPN type-5 RDs are globally unique without coordination
 *  - vrf-target = `target:${VNI}:1` — single RT per VRF, used as both
 *    import and export
 *  - Per-tenant rib `inet6.0 multipath` enables ECMP for v6, plus
 *    global multipath + auto-export for shared / non-tenant route leaks
 *  - The interface list MUST include each AC sub-port for that tenant
 *    plus the matching lo0.N unit (router-id anchor for EVPN)
 *
 * Pair with:
 *  - evo/policy/tenant-community-export.conf  (BGP-AOS-Policy-tenant-N)
 *  - evo/interfaces/tenant-gpu-server-link.conf  (the AC sub-ports listed here)
 *  - evo/interfaces/loopback-leaf.conf  (the lo0.N units listed here)
 *  - evo/interfaces/irb-tenant-gateway.conf  (companion anycast-gateway IRBs)
 *  - evo/transport/bgp-ebgp-evpn-overlay.conf  (carries these type-5 routes)
 *
 * Variables (example values from leaf1_qfx5240-64od / tenant-1):
 *   $TENANT_NAME    e.g. tenant-1
 *   $VNI            e.g. 20001
 *   $LO0_V4         e.g. 10.0.1.9
 *   $LO_UNIT        e.g. 2
 *   $AC_INTF_A      e.g. et-0/0/12:0
 *   $AC_INTF_B      e.g. et-0/0/16:0
 *   $TENANT_EXPORT_POLICY  e.g. BGP-AOS-Policy-tenant-1
 */
routing-instances {
    $TENANT_NAME {
        instance-type vrf;
        routing-options {
            rib ${TENANT_NAME}.inet6.0 {
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
                    export $TENANT_EXPORT_POLICY;
                }
            }
        }
        interface ${AC_INTF_A}.0;
        interface ${AC_INTF_B}.0;
        interface lo0.$LO_UNIT;
        route-distinguisher ${LO0_V4}:${VNI};
        vrf-target target:${VNI}:1;
    }
}
```

## evo/transport/bgp-ebgp-evpn-overlay.conf

```
/*
 * Topic:   eBGP EVPN overlay — loopback-to-loopback, multihop, signaling loops 2
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 *
 * Highlights:
 *  - eBGP EVPN overlay rides on top of the inet-unicast underlay; sessions
 *    are loopback-to-loopback (lo0.0) so they survive any single fabric
 *    link failure
 *  - `multihop ttl 1` + `no-nexthop-change` is the classic 3-stage CLOS
 *    pattern — spine relays EVPN routes between leafs without rewriting
 *    the BGP next-hop, so leaf<->leaf VTEP encapsulation works as if it
 *    were iBGP (despite being eBGP per-hop)
 *  - `family evpn signaling loops 2` allows the route to traverse two
 *    eBGP hops with the same AS in the path (needed because spines have
 *    distinct ASes but the EVPN MAC originator AS will appear twice)
 *  - BFD 3s for overlay (looser than 1s underlay — overlay is more
 *    tolerant since underlay BFD already catches link failures faster)
 *  - Spine variant has NO `EVPN_EXPORT` policy in the chain — just the
 *    loop-prevention community-stamping policy
 *  - Deploy LEAF or SPINE variant per role
 *
 * Pair with:
 *  - evo/transport/bgp-ebgp-fabric-underlay.conf  (companion underlay; this snip carries the shared bgp-level knobs)
 *  - evo/policy/clos-loop-prevention.conf  (LEAF_TO_SPINE_EVPN_OUT / SPINE_TO_LEAF_EVPN_OUT)
 *  - evo/interfaces/loopback-leaf.conf  /  evo/interfaces/loopback-spine.conf
 *  - evo/services/evpn-vrf-ip-prefix-routes.conf  (consumer of EVPN type-5 routes)
 *
 * Variables (example values from leaf1_qfx5240-64od / spine1_qfx5240-64od):
 *   $PEER_NAME      e.g. spine1   (or gpu-r1-l1 from the spine side)
 *   $PEER_LO_V4     e.g. 10.0.0.8
 *   $LOCAL_LO_V4    e.g. 10.0.1.9
 *   $PEER_AS        e.g. 108
 */

/* --- LEAF variant (deploy on leaf-role devices) --- */
protocols {
    bgp {
        group l3clos-l-evpn {
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
            neighbor $PEER_LO_V4 {
                description facing_${PEER_NAME}-evpn-overlay;
                local-address $LOCAL_LO_V4;
                family evpn {
                    signaling;
                }
                export ( LEAF_TO_SPINE_EVPN_OUT && EVPN_EXPORT );
                peer-as $PEER_AS;
            }
            vpn-apply-export;
        }
        log-updown;
        graceful-restart {
            dont-help-shared-fate-bfd-down;
        }
        multipath;
    }
}

/* --- SPINE variant (deploy on spine-role devices) --- */
protocols {
    bgp {
        group l3clos-s-evpn {
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
            neighbor $PEER_LO_V4 {
                description facing_${PEER_NAME}-evpn-overlay;
                local-address $LOCAL_LO_V4;
                family evpn {
                    signaling;
                }
                export ( SPINE_TO_LEAF_EVPN_OUT );
                peer-as $PEER_AS;
            }
            vpn-apply-export;
        }
        log-updown;
        graceful-restart {
            dont-help-shared-fate-bfd-down;
        }
        multipath;
    }
}
```

## evo/transport/bgp-ebgp-fabric-underlay.conf

```
/*
 * Topic:   eBGP fabric underlay — leaf<->spine /31 sessions, multipath, BFD 1s
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 *
 * Highlights:
 *  - Pure eBGP underlay — every device has a unique AS (leaf 208-211,
 *    spine 108-111). `multipath multiple-as` enables ECMP across the
 *    parallel paths to different spine ASes
 *  - One session PER /31 link (not per peer device) — gives the DLB
 *    flowlet engine maximum path diversity
 *  - BFD 1000ms x 3 — fast enough to trip before BGP holdtime, slow
 *    enough that PFC pause storms don't false-positive a peer down
 *  - `vpn-apply-export` is a no-op for inet underlay but kept here to
 *    match the EVPN-overlay group's structure (operational consistency)
 *  - Export chain: `LEAF_TO_SPINE_FABRIC_OUT && BGP-AOS-Policy` (leaf)
 *    or `SPINE_TO_LEAF_FABRIC_OUT && BGP-AOS-Policy` (spine) — the
 *    loop-prevention policy comes first, then the per-pod redistribution
 *  - Deploy the LEAF or SPINE variant per role
 *  - bgp-level knobs (`log-updown`, `graceful-restart
 *    dont-help-shared-fate-bfd-down`, `multipath`) are NOT repeated here
 *    — they live in the companion bgp-ebgp-evpn-overlay snip and apply
 *    to all BGP groups on the device. Always reassemble both snips.
 *
 * Pair with:
 *  - evo/transport/bgp-ebgp-evpn-overlay.conf  (companion overlay + shared bgp-level knobs)
 *  - evo/policy/clos-loop-prevention.conf  (LEAF_TO_SPINE_*  / SPINE_TO_LEAF_*)
 *  - evo/policy/allpodnetworks-direct-redistribution.conf  (BGP-AOS-Policy)
 *  - evo/interfaces/fabric-p2p-400g-breakout.conf  (the /31 links)
 *
 * Variables (example values from leaf1_qfx5240-64od / spine1_qfx5240-64od):
 *   $PEER_NAME       e.g. spine1   (or gpu-r1-l1 from the spine side)
 *   $PEER_V4         e.g. 10.0.2.130
 *   $LOCAL_V4        e.g. 10.0.2.131
 *   $PEER_AS         e.g. 108
 */

/* --- LEAF variant (deploy on leaf-role devices) --- */
protocols {
    bgp {
        group l3clos-l {
            type external;
            multipath {
                multiple-as;
            }
            bfd-liveness-detection {
                minimum-interval 1000;
                multiplier 3;
            }
            neighbor $PEER_V4 {
                description facing_$PEER_NAME;
                local-address $LOCAL_V4;
                family inet {
                    unicast;
                }
                export ( LEAF_TO_SPINE_FABRIC_OUT && BGP-AOS-Policy );
                peer-as $PEER_AS;
            }
            vpn-apply-export;
        }
    }
}

/* --- SPINE variant (deploy on spine-role devices) --- */
protocols {
    bgp {
        group l3clos-s {
            type external;
            multipath {
                multiple-as;
            }
            bfd-liveness-detection {
                minimum-interval 1000;
                multiplier 3;
            }
            neighbor $PEER_V4 {
                description facing_$PEER_NAME;
                local-address $LOCAL_V4;
                family inet {
                    unicast;
                }
                export ( SPINE_TO_LEAF_FABRIC_OUT && BGP-AOS-Policy );
                peer-as $PEER_AS;
            }
            vpn-apply-export;
        }
    }
}
```

## evo/transport/ecmp-dlb-flowlet.conf

```
/*
 * Topic:   ECMP DLB (Dynamic Load Balancing) flowlet — AI fabric load spreading
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 *
 * Highlights:
 *  - Flowlet-based DLB replaces classic 5-tuple ECMP — critical for
 *    AI/ML traffic where a few elephant RDMA flows would otherwise polarize
 *    one ECMP path and starve the others
 *  - `inactivity-interval 128` (microseconds) defines the gap that splits
 *    one flowlet from the next; reassignment triggers when path-quality
 *    delta exceeds 6 with probability threshold 3
 *  - Layer-3 + Layer-4 hashing on inet (port-aware, gives more entropy
 *    than L3-only hashing on a small number of GPU<->GPU flows)
 *  - sampling-rate 1000000 throttles the per-link quality probe rate
 *  - `flowset-table-size 2048` sizes the per-port DLB hardware table
 *
 * Pair with:
 *  - evo/transport/routing-options-ecmp-frr.conf  (forwarding-table export PFE-LB)
 */
forwarding-options {
    /* Load balancing policy label: AI-Core-Team-DLB */
    hash-key {
        family inet {
            layer-3;
            layer-4;
        }
    }
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

## evo/transport/router-advertisement.conf

```
/*
 * Topic:   IPv6 Router Advertisement on tenant GPU-server-facing interfaces
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od
 *
 * Highlights:
 *  - GPU hosts need IPv6 SLAAC for tenant traffic — the IRB anycast MAC
 *    handles v4 ARP, RAs handle v6 GUA delivery
 *  - Aggressive 10-30s RA cadence (vs default 200-600s) — ensures hosts
 *    pick up the gateway quickly after PXE/reboot
 *  - Apply this snip ONLY on the GPU-server-facing sub-ports — never on
 *    fabric P2P /31s (those don't have v6, and unsolicited RAs there
 *    would create spurious neighbor adjacencies)
 *  - Repeat the `interface $AC_INTF.0 { ... }` block once per
 *    tenant-server sub-port
 *
 * Pair with:
 *  - evo/interfaces/tenant-gpu-server-link.conf  (the interfaces being advertised on)
 *
 * Variables (example values from leaf1_qfx5240-64od):
 *   $AC_INTF       e.g. et-0/0/12:0
 */
protocols {
    router-advertisement {
        interface ${AC_INTF}.0 {
            max-advertisement-interval 30;
            min-advertisement-interval 10;
        }
    }
}
```

## evo/transport/routing-options-ecmp-frr.conf

```
/*
 * Topic:   Routing-options — router-id, AS, ECMP fast-reroute, chained-composite-NH
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5240-64od leaf2_qfx5240-64od leaf3_qfx5240-64od leaf4_qfx5240-64od spine1_qfx5240-64od spine2_qfx5240-64od spine3_qfx5240-64od spine4_qfx5240-64od
 *
 * Highlights:
 *  - `ecmp-fast-reroute` enables sub-second restoration on link failure
 *    by pre-computing backup next-hops in the FIB
 *  - `chained-composite-next-hop ingress evpn` is required on LEAF nodes
 *    so EVPN type-5 ip-prefix-routes resolve to a chained NH (inner VXLAN
 *    encap + outer IP NH) without RIB explosion. SPINE devices omit this
 *    block since they don't terminate EVPN encap.
 *  - `export PFE-LB` pushes per-packet load-balance into the FIB — pairs
 *    with the DLB flowlet config in forwarding-options
 *  - `graceful-restart` at the global level enables GR for all protocols
 *
 * Pair with:
 *  - evo/policy/pfe-load-balance.conf  (PFE-LB policy referenced here)
 *  - evo/transport/ecmp-dlb-flowlet.conf  (companion forwarding-options block)
 *
 * Variables (example values from leaf1_qfx5240-64od / spine1_qfx5240-64od):
 *   $ROUTER_ID    e.g. 10.0.1.9   (lo0.0 v4 address)
 *   $LOCAL_AS     e.g. 208        (leaf) or 108 (spine)
 */

/* --- LEAF variant (includes chained-composite-next-hop for EVPN) --- */
routing-options {
    router-id $ROUTER_ID;
    autonomous-system $LOCAL_AS;
    graceful-restart;
    forwarding-table {
        export PFE-LB;
        ecmp-fast-reroute;
        chained-composite-next-hop {
            ingress {
                evpn;
            }
        }
    }
}

/* --- SPINE variant (no chained-composite-next-hop — pure relay) --- */
routing-options {
    router-id $ROUTER_ID;
    autonomous-system $LOCAL_AS;
    graceful-restart;
    forwarding-table {
        export PFE-LB;
        ecmp-fast-reroute;
    }
}
```

## _variables.md

# Snip variable glossary

This file documents every `$VARIABLE` used in the templated snips under
`evo/`. Variables are alphabetical; the **Used in** column lists which
snip categories reference each one.

| Variable | Meaning | Typical example | Used in |
|---|---|---|---|
| `$AC_INTF` | Attachment-circuit (GPU-server-facing) sub-port | `et-0/0/12:0` | interfaces/, transport/ |
| `$AC_INTF_A` | First AC sub-port bound to a tenant VRF | `et-0/0/12:0` | services/ |
| `$AC_INTF_B` | Second AC sub-port bound to the same tenant VRF | `et-0/0/16:0` | services/ |
| `$ANYCAST_MAC` | Shared virtual MAC for IRB anycast gateway (same across all leafs) | `00:1c:73:00:00:01` | interfaces/ |
| `$GPU_HOST` | GPU server hostname carried in the AC interface description | `H100-01` | interfaces/ |
| `$GRPC_CERT_PEM` | PEM-encoded TLS cert/key for the gRPC listener (masked SECRET-DATA) | *(redacted)* | bootstrap/ |
| `$GRPC_PORT` | TCP port for the gRPC extension-service SSL listener | `32767` | bootstrap/ |
| `$HOSTNAME` | Device hostname | `GPU-R1-L1` | bootstrap/ |
| `$IRB_UNIT` | IRB logical unit number for a tenant subnet | `2` | interfaces/ |
| `$LO0_V4` | Primary loopback IPv4 (router-id + EVPN overlay local-address) | `10.0.1.9/32` (leaf), `10.0.0.8/32` (spine) | interfaces/, services/ |
| `$LO0_V6` | Primary loopback IPv6 | `fdf6:ed70:1fac:f2d2::1007/128` | interfaces/ |
| `$LOCAL_AS` | Per-device BGP autonomous system number | `208` (leaf), `108` (spine) | transport/ |
| `$LOCAL_LO_V4` | Local loopback v4 used as eBGP-EVPN local-address | `10.0.1.9` | transport/ |
| `$LOCAL_TIER_TAG` | Community high-order tag identifying the device's tier | `5` (leaf), `1` (spine) | policy/ |
| `$LOCAL_V4` | Local /31 v4 on a fabric or AC interface (full prefix) | `10.0.2.131/31` | interfaces/, transport/ |
| `$LOCAL_V4_A` | First /31 v4 on a fabric breakout sub-port | `10.0.2.177/31` | interfaces/ |
| `$LOCAL_V4_B` | Second /31 v4 on a fabric breakout sub-port | `10.0.2.131/31` | interfaces/ |
| `$LO_UNIT` | Per-tenant lo0 unit number bound to a VRF | `2` | services/ |
| `$PEER_AS` | Remote eBGP peer autonomous system number | `108` (leaf->spine), `208` (spine->leaf) | transport/ |
| `$PEER_HOST` | Remote device shortname (used in interface description) | `spine1` | interfaces/ |
| `$PEER_LO_V4` | Remote loopback v4 (eBGP-EVPN overlay neighbor) | `10.0.0.8` | transport/ |
| `$PEER_NAME` | Remote device shortname (used in BGP neighbor description) | `spine1`, `gpu-r1-l1` | transport/ |
| `$PEER_PORT_A` | Remote interface name for first sub-port (description) | `et-0/0/0:0` | interfaces/ |
| `$PEER_PORT_B` | Remote interface name for second sub-port (description) | `et-0/0/0:1` | interfaces/ |
| `$PEER_V4` | Remote /31 v4 (eBGP fabric underlay neighbor) | `10.0.2.130` | transport/ |
| `$PHY_PORT` | Parent physical port for breakout config | `et-0/0/0` | interfaces/ |
| `$ROUTER_ID` | Device router-id (matches lo0.0 v4 address) | `10.0.1.9` | transport/ |
| `$TENANT_COMMUNITY_V4` | Per-tenant IPv4 BGP community name | `TENANT-1_COMMUNITY_V4` | policy/ |
| `$TENANT_COMMUNITY_V6` | Per-tenant IPv6 BGP community name | `TENANT-1_COMMUNITY_V6` | policy/ |
| `$TENANT_EXPORT_POLICY` | Per-tenant EVPN ip-prefix-routes export policy name | `BGP-AOS-Policy-tenant-1` | services/ |
| `$TENANT_GW_V4` | Tenant subnet's gateway IPv4 address (anycast on IRB) | `10.200.0.1/24` | interfaces/ |
| `$TENANT_LO_V4` | Per-tenant lo0 IPv4 (router-id anchor for the VRF) | `192.168.11.4/32` | interfaces/ |
| `$TENANT_LO_V6` | Per-tenant lo0 IPv6 | `fdf6:ed70:1fac:f2d2::1010/128` | interfaces/ |
| `$TENANT_NAME` | Tenant VRF / routing-instance name | `tenant-1` | interfaces/, services/ |
| `$TENANT_TAG` | Tenant tag suffix used in per-tenant policy names | `tenant-1`, `non-tenant` | policy/ |
| `$TENANT_UNIT` | lo0 unit number for a tenant VRF | `2` | interfaces/ |
| `$VNI` | VXLAN network identifier for the tenant's EVPN type-5 routes | `20001` | services/ |

## Notes on the variable design

- **Tenant-axis variables** (`$TENANT_*`) all share the same suffix
  convention (`tenant-1` … `tenant-N` plus `non-tenant`). When generating
  configs from these snips for a new tenant, increment the suffix and
  pick a fresh `$VNI` / `$LO_UNIT` / `$IRB_UNIT` triplet.
- **Role-axis variables** (`$LOCAL_AS`, `$LOCAL_TIER_TAG`,
  `$ROUTER_ID`) determine whether a device is a leaf or spine. The
  combined snips (`bgp-ebgp-fabric-underlay`, `bgp-ebgp-evpn-overlay`,
  `routing-options-ecmp-frr`, `clos-loop-prevention`,
  `allpodnetworks-direct-redistribution`, `community-definitions`)
  carry both LEAF and SPINE variants — pick one variant per role.
- **Link-axis variables** (`$LOCAL_V4*`, `$PEER_V4`, `$PEER_LO_V4`,
  `$PEER_AS`, `$PEER_NAME`) repeat once per fabric link; the snips show
  a single neighbor block that should be cloned per link.

## byoai/TIERS.md

# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for the service at each verbosity tier. It is bundled into [`jvd-aiml-mtb-snips.md`](jvd-aiml-mtb-snips.md) by `regenerate-bundle.sh`.

For the chosen tier, the AI includes ONLY the snips listed — and ONLY those — unless the user explicitly asks for more. This JVD is **Junos Evolved (EVO) only** — every file is under `evo/`. All eight devices are QFX5240-64OD; snips carry LEAF and SPINE variants (pick the variant that matches the device role — see DEFAULTS.md).

The three tiers:

- **minimum** — just the per-tenant VRF service + its attachment interfaces + IRB gateway + per-tenant policy + loopback units. Assumes a working EVPN-VXLAN fabric (underlay + overlay + fabric policies) is already present.
- **with-overlay** — `minimum` + the EVPN overlay peering (`bgp-ebgp-evpn-overlay`) so the EVPN address family is re-asserted.
- **as-deployed** — full JVD fabric baseline: service + eBGP underlay + EVPN overlay + fabric policies + RoCEv2 lossless CoS + DLB/ECMP + 400G breakout + loopback + bootstrap + OAM. Best for a greenfield leaf turn-up or a complete working example.

---

## Shared fabric baseline (referenced by every `as-deployed`)

The pure-L3 eBGP Clos underlay + EVPN-VXLAN overlay that every leaf and spine builds on. Pick the LEAF or SPINE variant of each dual-variant snip to match the device role:

- `bootstrap/system-grpc-netconf.conf` — system base: netconf/SSH, gRPC extension-service, mgmt instance
- `bootstrap/security-grpc-cert.conf` — local TLS cert for the gRPC listener
- `bootstrap/chassis-buffer-monitor.conf` — FPC buffer-monitor for AI/RoCE visibility
- `cos/rdma-rocev2-lossless.conf` — RoCEv2 lossless CoS (DSCP classifier, PFC, ECN, lossless buffers, schedulers)
- `interfaces/fabric-p2p-400g-breakout.conf` — 400G breakout /31 fabric P2P links
- `interfaces/loopback-leaf.conf` (leaf) / `interfaces/loopback-spine.conf` (spine) — lo0 router-id / overlay / per-VRF units
- `transport/bgp-ebgp-fabric-underlay.conf` — eBGP leaf↔spine /31 underlay (multipath, BFD)
- `transport/bgp-ebgp-evpn-overlay.conf` — eBGP EVPN overlay (loopback-to-loopback, multihop)
- `transport/routing-options-ecmp-frr.conf` — router-id, AS, ECMP FRR, chained-composite-NH
- `transport/ecmp-dlb-flowlet.conf` — ECMP Dynamic Load Balancing (flowlet) for AI fabric spreading
- `policy/community-definitions.conf` — tier markers, default redistribution, per-tenant communities
- `policy/clos-loop-prevention.conf` — eBGP Clos loop-prevention (spine tags, leaf rejects)
- `policy/allpodnetworks-direct-redistribution.conf` — direct-route → BGP redistribution with community tagging
- `policy/pfe-load-balance.conf` — PFE per-packet load-balance policy
- `oam/lldp-interface-all.conf` — LLDP on all interfaces
- `oam/l2-learning-telemetry.conf` (leaf) — remote-MAC telemetry via gRPC
- `oam/rstp-disable.conf` (spine) — RSTP disabled (pure-L3 spine)

---

## evpn-vrf-ip-prefix-routes (per-tenant VRF, EVPN Type-5)  ·  EVO, leaves only

The one service in this JVD: a per-tenant routing-instance with EVPN Type-5 ip-prefix-routes (VXLAN encapsulation), one VRF per tenant (tenants 1–4, VNI 20001–20004). Runs on the leaves (`leaf1..4_qfx5240-64od`). GPU servers attach to per-tenant 400G sub-ports.

**minimum** (just the service)
- `evo/services/evpn-vrf-ip-prefix-routes.conf`
- `evo/interfaces/tenant-gpu-server-link.conf` (per-tenant GPU-server 400G AC sub-ports)
- `evo/interfaces/irb-tenant-gateway.conf` (per-tenant anycast IRB gateway, MTU 9000)
- `evo/interfaces/loopback-leaf.conf` (per-tenant lo0.N units for the RD)
- `evo/policy/tenant-community-export.conf` (`BGP-AOS-Policy-tenant-N` export)
- `evo/transport/router-advertisement.conf` (IPv6 RA / GUA on the tenant links)

**with-overlay** (= minimum +)
- `evo/transport/bgp-ebgp-evpn-overlay.conf` (carries the Type-5 routes)

**as-deployed** (= with-overlay + the shared fabric baseline above)

---

## Add-a-feature requests (no full service)

When the user asks to add a supporting feature to an existing device, emit ONLY that snip set:
- **RoCEv2 lossless CoS** → `evo/cos/rdma-rocev2-lossless.conf` + `evo/bootstrap/chassis-buffer-monitor.conf`
- **DLB / ECMP load-balancing** → `evo/transport/ecmp-dlb-flowlet.conf` + `evo/transport/routing-options-ecmp-frr.conf` + `evo/policy/pfe-load-balance.conf`
- **400G fabric breakout link** → `evo/interfaces/fabric-p2p-400g-breakout.conf`
- **GPU-server tenant link** → `evo/interfaces/tenant-gpu-server-link.conf` + `evo/transport/router-advertisement.conf`
- **LLDP** → `evo/oam/lldp-interface-all.conf`
- **L2-learning telemetry** → `evo/oam/l2-learning-telemetry.conf`
- **gRPC / telemetry base** → `evo/bootstrap/system-grpc-netconf.conf` + `evo/bootstrap/security-grpc-cert.conf`
- **Clos loop-prevention policy** → `evo/policy/clos-loop-prevention.conf` + `evo/policy/community-definitions.conf`

## byoai/DEFAULTS.md

# Auto-Fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default values the AI uses in `auto` mode (or when the user short-circuits with `all defaults` / `use defaults` / `skip`). It is bundled into [`jvd-aiml-mtb-snips.md`](jvd-aiml-mtb-snips.md) by `regenerate-bundle.sh`.

Use these values EXACTLY. Do not invent alternative defaults. Every value the AI auto-fills MUST be listed in the output's `Inputs used:` block so the user can rerun with edits.

Addresses below are the JVD lab's actual values (from each device `.conf`). Substitute site values when deploying. **This JVD is Junos Evolved (EVO) only.**

---

## Device inventory (the JVD topology — pure-L3 eBGP Clos)

| Device | Platform | OS | Role | Loopback (router-id) | BGP AS | Tier tag |
|--------|----------|----|------|----------------------|--------|----------|
| `spine1_qfx5240-64od` | QFX5240-64OD | EVO | Spine (pure L3, no services) | `10.0.0.8` | `108` | `1` |
| `spine2_qfx5240-64od` | QFX5240-64OD | EVO | Spine | `10.0.0.9` | `109` | `1` |
| `spine3_qfx5240-64od` | QFX5240-64OD | EVO | Spine | `10.0.0.10` | `110` | `1` |
| `spine4_qfx5240-64od` | QFX5240-64OD | EVO | Spine | `10.0.0.11` | `111` | `1` |
| `leaf1_qfx5240-64od` | QFX5240-64OD | EVO | Leaf (per-tenant VRF, GPU access) | `10.0.1.9` | `208` | `5` |
| `leaf2_qfx5240-64od` | QFX5240-64OD | EVO | Leaf | `10.0.1.10` | `209` | `5` |
| `leaf3_qfx5240-64od` | QFX5240-64OD | EVO | Leaf | `10.0.1.11` | `210` | `5` |
| `leaf4_qfx5240-64od` | QFX5240-64OD | EVO | Leaf | `10.0.1.12` | `211` | `5` |

> Every snip carries a **LEAF variant and a SPINE variant** — pick the one matching the target device's role. `$LOCAL_AS` / `$LOCAL_TIER_TAG` / `$ROUTER_ID` select the role. Spines are pure-L3 (underlay + EVPN overlay + policies, RSTP disabled, no services). Leaves add the per-tenant VRF, IRB anycast gateway, GPU-server links, and L2-learning telemetry.

**Device-choice shortcuts** (offered in the clarifying question):
- `LEAF` → `leaf1_qfx5240-64od` … `leaf4_qfx5240-64od` (EVO; per-tenant VRF + GPU access)
- `SPINE` → `spine1_qfx5240-64od` … `spine4_qfx5240-64od` (EVO; underlay + EVPN overlay only — no services)

---

## Fabric / underlay defaults (eBGP Clos)

| Variable | Default | Notes |
|----------|---------|-------|
| `$ROUTER_ID` / `$LO0_V4` | = device loopback | per device (see table), `/32` |
| `$LO0_V6` | `fdf6:ed70:1fac:f2d2::<n>/128` | lo0.0 v6 |
| `$LOCAL_AS` | spine `108`+; leaf `208`+ | eBGP Clos — every device has its own AS |
| `$PEER_AS` | leaf→spine `108`; spine→leaf `208` | remote peer AS |
| `$LOCAL_V4` / `$PEER_V4` | `10.0.2.<x>` /31 | fabric underlay p2p addressing |
| `$LOCAL_LO_V4` | = device loopback | eBGP-EVPN overlay local-address |
| `$PEER_LO_V4` | remote loopback | eBGP-EVPN overlay neighbor |
| `$LOCAL_TIER_TAG` | spine `1`; leaf `5` | community high-order tier marker |

---

## Interface / breakout defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$PHY_PORT` | `et-0/0/0` | parent physical port for breakout |
| `$AC_INTF` / `$AC_INTF_A` / `$AC_INTF_B` | `et-0/0/12:0` / `et-0/0/16:0` | GPU-server AC sub-ports |
| `$ANYCAST_MAC` | `00:1c:73:00:00:01` | shared IRB anycast MAC (identical on all leaves) |
| MTU (fabric) | `9216` / `9170` | jumbo fabric links |
| MTU (IRB / server) | `9000` | tenant IRB + GPU-server links |
| `$GPU_HOST` | `H100-01` | GPU server hostname in the AC description |

---

## Service — per-tenant VRF (`evpn-vrf-ip-prefix-routes`) defaults

Per-tenant axis: increment the suffix and pick a fresh `$VNI` / `$LO_UNIT` / `$IRB_UNIT` triplet per tenant.

| Variable | tenant-1 default | Notes |
|----------|------------------|-------|
| `$TENANT_NAME` / `$TENANT_TAG` | `tenant-1` | VRF / routing-instance name |
| `$VNI` | `20001` | tenant-1..4 = VNI 20001..20004 |
| `$LO_UNIT` / `$TENANT_UNIT` | `2` | per-tenant lo0 unit |
| `$IRB_UNIT` | `2` | per-tenant IRB unit |
| `$TENANT_LO_V4` | `192.168.11.4/32` | per-VRF router-id anchor |
| `$TENANT_GW_V4` | `10.200.0.1/24` | anycast IRB gateway |
| `$TENANT_EXPORT_POLICY` | `BGP-AOS-Policy-tenant-1` | EVPN ip-prefix-routes export |
| `$TENANT_COMMUNITY_V4` / `_V6` | `TENANT-1_COMMUNITY_V4` / `_V6` | per-tenant BGP communities |
| RD | `${LO0_V4}:${VNI}` | one tag per VRF per device |
| vrf-target | `target:${VNI}:1` | single RT per VRF |

---

## Policy / community defaults

- Tier communities: `FROM_SPINE_EVPN_TIER`, `FROM_SPINE_FABRIC_TIER` (loop-prevention); `DEFAULT_DIRECT_V4/V6` (redistribution) — JVD-wide constants, never parameterize.
- Clos loop-prevention filter names: `LEAF_TO_SPINE_*` / `SPINE_TO_LEAF_*` (`_FABRIC_OUT`, `_EVPN_OUT`).
- Per-tenant export policies: `AllPodNetworks-tenant-N` + `BGP-AOS-Policy-tenant-N`.

---

## CoS / RoCEv2 defaults

The RoCEv2 lossless CoS (DSCP classifier, PFC on the no-drop queue, ECN marking, lossless buffer partitions, schedulers) uses JVD-wide forwarding-class / queue names — **never parameterize** them. The `chassis-buffer-monitor` telemetry watches these same buffer partitions.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-aiml-mtb-snips.md`](jvd-aiml-mtb-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum" or "with-overlay"
# devices:
#   leaf1: { name: <hostname>, os: evo, role: <leaf|spine>, loopback4: <addr>, as: <asn>, tier_tag: <n> }
#   leaf2: { ... }
# services:
#   - { kind: evpn-vrf-ip-prefix-routes,
#       count: <int>,
#       tenant: <tenant-N>,
#       vni: <int>,
#       rd: <loopback:vni>,
#       rt: <target:vni:1>,
#       irb_unit: <int>,
#       lo_unit: <int>,
#       gateway: <addr>,
#       ac_interfaces: [ <sub-port>, ... ] }
# snips_used:
#   - evo/services/evpn-vrf-ip-prefix-routes.conf
#   - evo/interfaces/irb-tenant-gateway.conf
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

- Snips intentionally omitted (and why).
- Inputs defaulted because the user did not provide them.
- Role selection: whether each device used the LEAF or SPINE variant of the dual-variant snips.
- Cross-device consistency the user must verify:
  - The IRB **anycast MAC** (`$ANYCAST_MAC`) and per-tenant gateway addresses MUST be identical on every leaf that hosts the tenant subnet.
  - Per-tenant **VNI**, **route-distinguisher pattern** (`${LO0_V4}:${VNI}`), and **vrf-target** (`target:${VNI}:1`) must be consistent across the leaves that share the tenant.
  - The eBGP Clos **per-device AS** is unique; peer AS values must match the neighbor's local AS.
  - **RoCEv2 CoS** (forwarding-class / queue names, PFC/ECN settings) is a JVD-wide constant — identical on every fabric device.
- Anything by-pattern rather than validated on that exact device (e.g., a user-supplied hostname not in any snip's `Seen on:` list).
- AI-fabric reminders: RoCEv2 lossless CoS + `chassis-buffer-monitor` telemetry + `ecmp-dlb-flowlet` DLB are the AI/RoCE performance triad; the fabric and IRB/server MTUs differ (9216/9170 fabric, 9000 tenant).

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
