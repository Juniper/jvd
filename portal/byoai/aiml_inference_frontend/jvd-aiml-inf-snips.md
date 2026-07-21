# JVD AI Data Center Frontend Fabric for Inference snippet library

## evo/bootstrap/security-grpc-cert.conf

```
/*
 * Topic:   Local TLS certificate for the gRPC extension-service listener
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 *
 * Highlights:
 *  - Holds the `aos_grpc` cert/key pair referenced by the gRPC SSL stanza
 *  - The actual key material is masked ## SECRET-DATA — the template carries
 *    only the structure; supply real PEM at deploy time (Apstra installs it)
 *  - Cert name is fixed (`aos_grpc`) because the system extension-service
 *    block references it by literal name
 *
 * Pair with:
 *  - evo/bootstrap/system-grpc-apstra.conf  (consumer of this certificate)
 *
 * Variables (example values from leaf3_qfx5130-32cd):
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

## evo/bootstrap/system-grpc-apstra.conf

```
/*
 * Topic:   System base — host-name, mgmt instance, gRPC extension-service over TLS
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 *
 * Highlights:
 *  - gRPC request-response listener over TLS, anchored to the dedicated
 *    `mgmt_junos` routing-instance — keeps Apstra / streaming telemetry off
 *    the in-band fabric
 *  - `management-instance` puts the management ethernet in mgmt_junos so OOB
 *    and in-band have separate route tables (no leakage)
 *  - The gRPC listener port differs per device (32767 on spines, 32769/32770
 *    on leafs in the captured set) — supply per-device via $GRPC_PORT
 *  - The `aos_grpc` local-certificate is provided by the companion security
 *    snip
 *
 * Pair with:
 *  - evo/bootstrap/security-grpc-cert.conf  (provides the aos_grpc local-certificate)
 *  - evo/oam/l2-learning-telemetry.conf  (rides this gRPC channel, leaf-only)
 *
 * Variables (example values from leaf3_qfx5130-32cd):
 *   $HOSTNAME    e.g. leaf3
 *   $GRPC_PORT   e.g. 32769
 */
system {
    host-name $HOSTNAME;
    management-instance;
    services {
        extension-service {
            request-response {
                grpc {
                    routing-instance mgmt_junos;
                    ssl {
                        port $GRPC_PORT;
                        local-certificate aos_grpc;
                    }
                }
            }
        }
    }
}
```

## evo/interfaces/fabric-p2p-links.conf

```
/*
 * Topic:   Fabric P2P /31 links — leaf 400G breakout sub-ports + spine direct ports
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 *
 * Highlights:
 *  - Physical MTU 9216 / IP MTU 9170 on every leaf<->spine link — jumbo
 *    sized for AI inference payloads (the IRB carries MTU 9000 client frames)
 *  - LEAF variant: the 400G uplink ports are broken out (`number-of-sub-ports
 *    2` + `speed 400g`), and each `:N` sub-port carries a /31 to one spine —
 *    a leaf reaches both spines over 2x400G sub-ports
 *  - SPINE variant: ports face leafs directly (no breakout) with a /31 each
 *  - /31 numbering throughout; underlay is pure IPv4 eBGP with an explicit
 *    local-address per session — no family inet6 on fabric links
 *
 * Pair with:
 *  - evo/transport/bgp-ebgp-fabric-underlay.conf  (consumes these /31s as BGP local-address)
 *
 * Variables (example values from leaf3_qfx5130-32cd et-0/0/24 / spine1_qfx5220-32cd et-0/0/0):
 *   $PHY_PORT      e.g. et-0/0/24   (leaf breakout parent) or et-0/0/0 (spine)
 *   $PEER_HOST     e.g. frontend-spine-1   (or frontend-leaf1 on the spine side)
 *   $PEER_PORT_A   e.g. et-0/0/4
 *   $PEER_PORT_B   e.g. et-0/0/5
 *   $PEER_PORT     e.g. et-0/0/0   (spine variant, single link)
 *   $LOCAL_V4_A    e.g. 10.0.5.33/31
 *   $LOCAL_V4_B    e.g. 10.0.5.35/31
 *   $LOCAL_V4      e.g. 10.0.5.0/31   (spine variant)
 */

/* --- LEAF variant (400G breakout parent + two /31 sub-ports to spines) --- */
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

/* --- SPINE variant (direct /31 port facing a leaf) --- */
interfaces {
    $PHY_PORT {
        description facing_$PEER_HOST:$PEER_PORT;
        mtu 9216;
        unit 0 {
            family inet {
                mtu 9170;
                address $LOCAL_V4;
            }
        }
    }
}
```

## evo/interfaces/irb-cluster-gateway.conf

```
/*
 * Topic:   IRB L3 gateway for the frontend cluster VLAN — MTU 9000
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd
 *
 * Highlights:
 *  - Leaf-only — the routed gateway for the attached frontend cluster VLAN;
 *    the IRB unit number matches the VLAN's l3-interface (see
 *    frontend-cluster-vlan snip)
 *  - IRB MTU 9000 (jumbo) sized for inference payloads; the parent `irb`
 *    interface carries MTU 9216 to leave headroom
 *  - family inet /24 gateway address — the direct route is redistributed into
 *    BGP by AllPodNetworks so client subnets are reachable across the fabric
 *  - No anycast MAC / VRRP in this frontend design — each leaf owns its own
 *    cluster subnet (one VLAN per leaf: vn3..vn6)
 *
 * Pair with:
 *  - evo/services/frontend-cluster-vlan.conf  (the VLAN whose l3-interface is irb.N)
 *  - evo/interfaces/server-access-trunk.conf  (access port trunked into the VLAN)
 *  - evo/policy/allpodnetworks-direct-redistribution.conf  (redistributes this direct route)
 *
 * Variables (example values from leaf3_qfx5130-32cd irb.5):
 *   $IRB_UNIT   e.g. 5
 *   $GW_V4      e.g. 10.10.5.254/24
 */
interfaces {
    irb {
        mtu 9216;
        unit $IRB_UNIT {
            family inet {
                mtu 9000;
                address $GW_V4;
            }
        }
    }
}
```

## evo/interfaces/loopback.conf

```
/*
 * Topic:   Loopback lo0.0 — underlay router-id / eBGP anchor
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 *
 * Highlights:
 *  - Single lo0.0 IPv4 /32 per device — it supplies the `router-id` in
 *    routing-options and is reachable across the fabric via the redistributed
 *    direct route
 *  - Leaf loopbacks are drawn from 10.0.4.0/24, spine loopbacks from
 *    10.0.3.0/24 in the validated topology
 *  - No per-VRF lo0 units in this frontend design (contrast the
 *    multitenancy-backend JVD, which adds lo0.N per tenant)
 *
 * Pair with:
 *  - evo/transport/routing-options-ecmp-frr.conf  (router-id references this address)
 *
 * Variables (example values from leaf3_qfx5130-32cd):
 *   $LO0_V4   e.g. 10.0.4.4/32
 */
interfaces {
    lo0 {
        unit 0 {
            family inet {
                address $LO0_V4;
            }
        }
    }
}
```

## evo/interfaces/server-access-trunk.conf

```
/*
 * Topic:   Server/client access port — jumbo trunk into the frontend cluster VLAN
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd
 *
 * Highlights:
 *  - Leaf-only — the downstream port to an AMD MI300X GPU server (leaf3/4)
 *    or a Lambda Scaler host running Envoy / GenAI-Perf (leaf1/2)
 *  - Trunk mode with `native-vlan-id` so untagged host traffic lands in the
 *    frontend cluster VLAN; `vlan members` binds the port to that VLAN
 *  - Physical MTU 9216 keeps jumbo inference frames off the fragmentation
 *    path end-to-end
 *  - The description mirrors the attached endpoint (e.g. to.mi300-01) — one
 *    access port per leaf in this topology
 *
 * Pair with:
 *  - evo/services/frontend-cluster-vlan.conf  (the VLAN this port trunks)
 *  - evo/interfaces/irb-cluster-gateway.conf  (L3 gateway for that VLAN)
 *  - evo/oam/rstp-fabric.conf  (RSTP edge / BPDU-guard on this access port)
 *
 * Variables (example values from leaf3_qfx5130-32cd et-0/0/0):
 *   $PHY_PORT      e.g. et-0/0/0
 *   $PEER_DESC     e.g. to.mi300-01
 *   $NATIVE_VLAN   e.g. 5
 *   $VLAN_NAME     e.g. vn5
 */
interfaces {
    $PHY_PORT {
        description $PEER_DESC;
        native-vlan-id $NATIVE_VLAN;
        mtu 9216;
        unit 0 {
            family ethernet-switching {
                interface-mode trunk;
                vlan members $VLAN_NAME;
            }
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
 *   EVO:   leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd
 *
 * Highlights:
 *  - Leaf-only — leafs are the L2 edge (IRB + access trunks); spines are pure
 *    L3 and learn no MACs
 *  - `enable-remote-entries` exposes the full MAC table (including entries
 *    learned on other units) to the streaming-telemetry channel so Apstra /
 *    external collectors see complete forwarding state
 *  - Rides the same gRPC channel established by the system bootstrap snip
 *
 * Pair with:
 *  - evo/bootstrap/system-grpc-apstra.conf  (the gRPC channel that carries this telemetry)
 */
protocols {
    l2-learning {
        telemetry enable-remote-entries;
    }
}
```

## evo/oam/lldp-interface-all.conf

```
/*
 * Topic:   LLDP on all interfaces — neighbor discovery for fabric validation
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 *
 * Highlights:
 *  - `interface all` advertises LLDP on every port so Apstra can build and
 *    validate the cabling map against the intended topology
 *  - `port-id-subtype interface-name` + `port-description-type
 *    interface-description` make the neighbor tables human-readable (port
 *    names/descriptions instead of numeric IDs)
 *  - `neighbour-port-info-display port-id` shows the remote port-id in the
 *    neighbor output — the note the Apstra cabling checker keys on
 *
 * Pair with:
 *  - (none)
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

## evo/oam/rstp-fabric.conf

```
/*
 * Topic:   RSTP — leaf edge/BPDU-guard on access ports, disabled on spines
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 *
 * Highlights:
 *  - LEAF variant: `bridge-priority 0` makes each leaf the root for its own
 *    local bridge; `bpdu-block-on-edge` + `interface <access> edge` mark the
 *    server/client access port as an edge port so a host bringing up a link
 *    doesn't trigger a topology change (and any stray BPDU blocks the port)
 *  - SPINE variant: RSTP is explicitly `disable`d — spines are pure L3 with
 *    no bridge-domain, so BPDUs would be wasted CPU
 *  - Deploy the LEAF variant on leafs, the SPINE variant on spines
 *
 * Pair with:
 *  - evo/interfaces/server-access-trunk.conf  (the edge access port)
 *
 * Variables (example values from leaf3_qfx5130-32cd):
 *   $EDGE_PORT   e.g. et-0/0/0:0
 */

/* --- LEAF variant (deploy on leaf-role devices) --- */
protocols {
    rstp {
        bridge-priority 0;
        bpdu-block-on-edge;
        interface $EDGE_PORT {
            edge;
        }
    }
}

/* --- SPINE variant (deploy on spine-role devices) --- */
protocols {
    rstp {
        disable;
    }
}
```

## evo/policy/allpodnetworks-direct-redistribution.conf

```
/*
 * Topic:   AllPodNetworks — direct-route redistribution + BGP-AOS-Policy umbrella
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 *
 * Highlights:
 *  - AllPodNetworks redistributes locally-attached IPv4 direct routes into
 *    BGP and stamps them with DEFAULT_DIRECT_V4 so downstream devices can
 *    identify their origin; the trailing term-100 reject is an implicit-deny
 *  - BGP-AOS-Policy is the umbrella export chained on every session; it
 *    accepts AllPodNetworks output first, then differs by role:
 *      * SPINE also accepts everything from `protocol bgp` (term-20) so it
 *        relays leaf routes across the fabric
 *      * LEAF has no such term — a leaf does NOT re-advertise BGP-learned
 *        fabric routes back into the fabric (loop-prevention by policy)
 *  - IPv4-only redistribution — no family inet6 term in this frontend design
 *
 * Pair with:
 *  - evo/policy/community-definitions.conf  (DEFAULT_DIRECT_V4)
 *  - evo/transport/bgp-ebgp-fabric-underlay.conf  (consumes BGP-AOS-Policy)
 *  - evo/interfaces/irb-cluster-gateway.conf  (IRB direct route redistributed here)
 */

/* --- SPINE variant (term-20 relays BGP-learned routes downstream) --- */
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
        term AllPodNetworks-100 {
            then {
                reject;
            }
        }
    }
    policy-statement BGP-AOS-Policy {
        term BGP-AOS-Policy-10 {
            from {
                policy AllPodNetworks;
            }
            then {
                accept;
            }
        }
        term BGP-AOS-Policy-20 {
            from {
                protocol bgp;
            }
            then {
                accept;
            }
        }
        term BGP-AOS-Policy-100 {
            then {
                reject;
            }
        }
    }
}

/* --- LEAF variant (no term-20 — does not relay fabric BGP routes) --- */
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
        term AllPodNetworks-100 {
            then {
                reject;
            }
        }
    }
    policy-statement BGP-AOS-Policy {
        term BGP-AOS-Policy-10 {
            from {
                policy AllPodNetworks;
            }
            then {
                accept;
            }
        }
        term BGP-AOS-Policy-100 {
            then {
                reject;
            }
        }
    }
}
```

## evo/policy/clos-loop-prevention.conf

```
/*
 * Topic:   eBGP CLOS loop-prevention — spine tags outbound, leaf rejects tagged
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 *
 * Highlights:
 *  - Standard 3-stage CLOS loop-prevention without AS-path filtering
 *  - SPINE_TO_LEAF_FABRIC_OUT stamps FROM_SPINE_FABRIC_TIER on all routes a
 *    spine sends to leafs
 *  - LEAF_TO_SPINE_FABRIC_OUT rejects any route still carrying that stamp
 *    when a leaf exports back toward the spines (term-10), then accepts the
 *    rest (term-20)
 *  - Both policies are chained ahead of BGP-AOS-Policy in the eBGP export
 *    ( POLICY && BGP-AOS-Policy ) — deploy the SPINE variant on spines and
 *    the LEAF variant on leafs
 *
 * Pair with:
 *  - evo/policy/community-definitions.conf  (FROM_SPINE_FABRIC_TIER)
 *  - evo/transport/bgp-ebgp-fabric-underlay.conf  (consumer in the export chain)
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
}

/* --- LEAF variant (deploy on leaf-role devices) --- */
policy-options {
    policy-statement LEAF_TO_SPINE_FABRIC_OUT {
        term LEAF_TO_SPINE_FABRIC_OUT-10 {
            from {
                protocol bgp;
                community FROM_SPINE_FABRIC_TIER;
            }
            then {
                reject;
            }
        }
        term LEAF_TO_SPINE_FABRIC_OUT-20 {
            then {
                accept;
            }
        }
    }
}
```

## evo/policy/community-definitions.conf

```
/*
 * Topic:   BGP community definitions — tier marker + default direct redistribution
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 *
 * Highlights:
 *  - FROM_SPINE_FABRIC_TIER (0:15) = CLOS loop-prevention marker stamped by
 *    spines and rejected by leafs (see clos-loop-prevention snip)
 *  - DEFAULT_DIRECT_V4 identifies locally-redistributed direct routes; the
 *    high-order tag encodes the tier — leafs use `5:20007`, spines use
 *    `1:20007` for the same community, the low-order `21001:26000` is the
 *    shared fabric selector
 *  - This frontend fabric is IPv4-only — there is no DEFAULT_DIRECT_V6 and
 *    no per-tenant community (contrast the multitenancy-backend JVD)
 *
 * Pair with:
 *  - evo/policy/clos-loop-prevention.conf  (consumer of FROM_SPINE_FABRIC_TIER)
 *  - evo/policy/allpodnetworks-direct-redistribution.conf  (consumer of DEFAULT_DIRECT_V4)
 *
 * Variables (example values from leaf3_qfx5130-32cd / spine1_qfx5220-32cd):
 *   $LOCAL_TIER_TAG   e.g. 5   (leaf) or 1 (spine)
 */
policy-options {
    community DEFAULT_DIRECT_V4 members [ ${LOCAL_TIER_TAG}:20007 21001:26000 ];
    community FROM_SPINE_FABRIC_TIER members 0:15;
}
```

## evo/policy/pfe-load-balance.conf

```
/*
 * Topic:   PFE per-packet load-balance policy (referenced by forwarding-table export)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 *
 * Highlights:
 *  - Tells the FIB to install per-packet (per-flow) load-balance next-hops
 *    across all ECMP paths — without it, ECMP routes default to per-prefix
 *    load-balance and pin each prefix to a single next-hop
 *  - Required so inference request/response flows actually spread across the
 *    2x400G leaf<->spine links rather than polarizing onto one member
 *  - Applied via `forwarding-table export PFE-LB` in routing-options
 *
 * Pair with:
 *  - evo/transport/routing-options-ecmp-frr.conf  (forwarding-table export PFE-LB)
 */
policy-options {
    policy-statement PFE-LB {
        then {
            load-balance per-packet;
        }
    }
}
```

## evo/services/frontend-cluster-vlan.conf

```
/*
 * Topic:   Frontend cluster VLAN — L2 broadcast domain + L3 gateway binding
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd
 *
 * Highlights:
 *  - The "service" delivered by this frontend fabric: one cluster VLAN per
 *    leaf carrying inference client / GPU-server traffic (vn3..vn6, vlan-id
 *    3..6 in the validated topology)
 *  - `l3-interface irb.N` ties the VLAN to its IRB gateway; the unit number
 *    matches the IRB unit (see irb-cluster-gateway snip)
 *  - Endpoints attach via the server/client access trunk with this VLAN as
 *    the native VLAN (see server-access-trunk snip)
 *  - Pure local-bridging + routed gateway — no EVPN/VXLAN in this frontend
 *    design, so a VLAN does not stretch across leafs
 *
 * Pair with:
 *  - evo/interfaces/irb-cluster-gateway.conf  (the irb.N gateway for this VLAN)
 *  - evo/interfaces/server-access-trunk.conf  (access ports that trunk this VLAN)
 *
 * Variables (example values from leaf3_qfx5130-32cd vn5):
 *   $VLAN_NAME   e.g. vn5
 *   $VLAN_DESC   e.g. FrontEnd-Cluster-VN5
 *   $VLAN_ID     e.g. 5
 *   $IRB_UNIT    e.g. 5
 */
vlans {
    $VLAN_NAME {
        description $VLAN_DESC;
        vlan-id $VLAN_ID;
        l3-interface irb.$IRB_UNIT;
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
 *   EVO:   leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 *
 * Highlights:
 *  - Pure eBGP IPv4 underlay — every device carries a unique AS and peers
 *    to its neighbors over the /31 point-to-point links (no loopback eBGP,
 *    no EVPN overlay in this frontend design — family inet unicast only)
 *  - `multipath multiple-as` at the group + device-level `multipath` enable
 *    ECMP across the parallel leaf<->spine links (2x400G per leaf per spine)
 *  - BFD 1s x3 gives sub-3s liveness; `graceful-restart
 *    dont-help-shared-fate-bfd-down` avoids a helper stall when BFD and BGP
 *    fail together on the same link
 *  - `vpn-apply-export` is carried from the Apstra template even though no
 *    VPN families are present — harmless, kept for fidelity
 *  - Deploy the LEAF variant (group l3clos-l) on leafs, the SPINE variant
 *    (group l3clos-s) on spines; the export policy chain differs by role
 *
 * Pair with:
 *  - evo/policy/clos-loop-prevention.conf  (LEAF_TO_SPINE_FABRIC_OUT / SPINE_TO_LEAF_FABRIC_OUT)
 *  - evo/policy/allpodnetworks-direct-redistribution.conf  (BGP-AOS-Policy)
 *  - evo/interfaces/fabric-p2p-links.conf  (the /31 links used as local-address)
 *  - evo/transport/routing-options-ecmp-frr.conf  (router-id + AS + PFE-LB export)
 *
 * Variables (example values from leaf3_qfx5130-32cd / spine1_qfx5220-32cd):
 *   $PEER_NAME    e.g. frontend-spine-1   (or frontend-leaf1 from the spine side)
 *   $PEER_V4      e.g. 10.0.5.32
 *   $LOCAL_V4     e.g. 10.0.5.33
 *   $PEER_AS      e.g. 4201032300
 */

/* --- LEAF variant (deploy on leaf-role devices) --- */
protocols {
    bgp {
        log-updown;
        multipath;
        group l3clos-l {
            type external;
            multipath multiple-as;
            vpn-apply-export;
            bfd-liveness-detection {
                minimum-interval 1000;
                multiplier 3;
            }
            neighbor $PEER_V4 {
                description facing_$PEER_NAME;
                local-address $LOCAL_V4;
                export ( LEAF_TO_SPINE_FABRIC_OUT && BGP-AOS-Policy );
                peer-as $PEER_AS;
                family inet {
                    unicast;
                }
            }
        }
        graceful-restart {
            dont-help-shared-fate-bfd-down;
        }
    }
}

/* --- SPINE variant (deploy on spine-role devices) --- */
protocols {
    bgp {
        log-updown;
        multipath;
        group l3clos-s {
            type external;
            multipath multiple-as;
            vpn-apply-export;
            bfd-liveness-detection {
                minimum-interval 1000;
                multiplier 3;
            }
            neighbor $PEER_V4 {
                description facing_$PEER_NAME;
                local-address $LOCAL_V4;
                export ( SPINE_TO_LEAF_FABRIC_OUT && BGP-AOS-Policy );
                peer-as $PEER_AS;
                family inet {
                    unicast;
                }
            }
        }
        graceful-restart {
            dont-help-shared-fate-bfd-down;
        }
    }
}
```

## evo/transport/routing-options-ecmp-frr.conf

```
/*
 * Topic:   Routing-options — router-id, local AS, ECMP fast-reroute, PFE-LB export
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 *
 * Highlights:
 *  - `ecmp-fast-reroute` pre-computes backup next-hops in the FIB for
 *    sub-second restoration when a leaf<->spine link fails
 *  - `export PFE-LB` pushes per-packet load-balance into the forwarding
 *    table so all parallel ECMP next-hops are actually used (the default
 *    is per-prefix, which pins each prefix to one next-hop)
 *  - `graceful-restart` at the global level enables GR for all protocols
 *  - Identical structure on leaf and spine — only $ROUTER_ID and $LOCAL_AS
 *    differ per device (no chained-composite-next-hop here since the
 *    frontend design carries no EVPN encapsulation)
 *
 * Pair with:
 *  - evo/policy/pfe-load-balance.conf  (the PFE-LB policy referenced here)
 *  - evo/transport/bgp-ebgp-fabric-underlay.conf  (the eBGP sessions this AS/router-id anchor)
 *  - evo/interfaces/loopback.conf  (lo0.0 supplies the router-id)
 *
 * Variables (example values from leaf3_qfx5130-32cd / spine1_qfx5220-32cd):
 *   $ROUTER_ID   e.g. 10.0.4.4   (lo0.0 v4 address)
 *   $LOCAL_AS    e.g. 4201032406
 */
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
| `$EDGE_PORT` | Access port marked as an RSTP edge port on a leaf | `et-0/0/0:0` | oam/ |
| `$GRPC_CERT_PEM` | PEM-encoded TLS cert/key for the gRPC listener (masked SECRET-DATA) | *(redacted)* | bootstrap/ |
| `$GRPC_PORT` | TCP port for the gRPC extension-service SSL listener | `32769` (leaf), `32767` (spine) | bootstrap/ |
| `$GW_V4` | Frontend cluster VLAN IRB gateway IPv4 (full prefix) | `10.10.5.254/24` | interfaces/ |
| `$HOSTNAME` | Device hostname | `leaf3` | bootstrap/ |
| `$IRB_UNIT` | IRB logical unit number for the frontend cluster VLAN | `5` | interfaces/, services/ |
| `$LO0_V4` | Loopback IPv4 (router-id / underlay anchor, full prefix) | `10.0.4.4/32` (leaf), `10.0.3.0/32` (spine) | interfaces/ |
| `$LOCAL_AS` | Per-device BGP autonomous system number | `4201032406` (leaf), `4201032300` (spine) | transport/ |
| `$LOCAL_TIER_TAG` | Community high-order tag identifying the device's tier | `5` (leaf), `1` (spine) | policy/ |
| `$LOCAL_V4` | Local /31 v4 on a spine fabric interface (full prefix) | `10.0.5.0/31` | interfaces/, transport/ |
| `$LOCAL_V4_A` | First /31 v4 on a leaf fabric breakout sub-port | `10.0.5.33/31` | interfaces/ |
| `$LOCAL_V4_B` | Second /31 v4 on a leaf fabric breakout sub-port | `10.0.5.35/31` | interfaces/ |
| `$NATIVE_VLAN` | Native VLAN ID on a server/client access trunk | `5` | interfaces/ |
| `$PEER_AS` | Remote eBGP peer autonomous system number | `4201032300` (leaf->spine), `4201032400` (spine->leaf) | transport/ |
| `$PEER_DESC` | Attached-endpoint description on an access port | `to.mi300-01` | interfaces/ |
| `$PEER_HOST` | Remote device shortname (used in interface description) | `frontend-spine-1` | interfaces/ |
| `$PEER_NAME` | Remote device shortname (used in BGP neighbor description) | `frontend-spine-1`, `frontend-leaf1` | transport/ |
| `$PEER_PORT` | Remote interface name on a spine direct link (description) | `et-0/0/0` | interfaces/ |
| `$PEER_PORT_A` | Remote interface name for first leaf sub-port (description) | `et-0/0/4` | interfaces/ |
| `$PEER_PORT_B` | Remote interface name for second leaf sub-port (description) | `et-0/0/5` | interfaces/ |
| `$PEER_V4` | Remote /31 v4 (eBGP fabric underlay neighbor) | `10.0.5.32` | transport/ |
| `$PHY_PORT` | Parent physical port (breakout parent, access port, or spine link) | `et-0/0/24`, `et-0/0/0` | interfaces/ |
| `$ROUTER_ID` | Device router-id (matches lo0.0 v4 address) | `10.0.4.4` | transport/ |
| `$VLAN_DESC` | Frontend cluster VLAN description | `FrontEnd-Cluster-VN5` | services/ |
| `$VLAN_ID` | Frontend cluster VLAN ID | `5` | services/ |
| `$VLAN_NAME` | Frontend cluster VLAN name | `vn5` | interfaces/, services/ |

## byoai/TIERS.md

# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for the service at each verbosity tier. It is bundled into [`jvd-aiml-inf-snips.md`](jvd-aiml-inf-snips.md) by `regenerate-bundle.sh`.

For the chosen tier, the AI includes ONLY the snips listed — and ONLY those — unless the user explicitly asks for more. This JVD is **Junos Evolved (EVO) only** — every file is under `evo/`. All snips carry a `Variant: Evolved-OS (EVO)` tag; five carry both a LEAF and a SPINE variant (pick the one matching the target role).

The "service" delivered by this frontend fabric is the **frontend cluster VLAN** (one L2 domain per leaf with an L3 IRB gateway, into which inference clients / Envoy hosts / GPU servers attach). Underlay transport and fabric policy are shared baseline.

---

## Shared fabric baseline (referenced by `as-deployed`)

Underlay + fabric policy + telemetry, common to every device:

- `evo/transport/bgp-ebgp-fabric-underlay.conf` *(LEAF or SPINE variant)*
- `evo/transport/routing-options-ecmp-frr.conf`
- `evo/interfaces/fabric-p2p-links.conf` *(LEAF breakout or SPINE direct variant)*
- `evo/interfaces/loopback.conf`
- `evo/policy/community-definitions.conf`
- `evo/policy/allpodnetworks-direct-redistribution.conf` *(LEAF or SPINE variant)*
- `evo/policy/clos-loop-prevention.conf` *(LEAF or SPINE variant)*
- `evo/policy/pfe-load-balance.conf`
- `evo/bootstrap/system-grpc-apstra.conf`
- `evo/bootstrap/security-grpc-cert.conf`
- `evo/oam/lldp-interface-all.conf`
- `evo/oam/rstp-fabric.conf` *(LEAF or SPINE variant)*
- `evo/oam/l2-learning-telemetry.conf` *(leaf-only)*

---

## Service — frontend cluster VLAN (leaf-side)

The user-facing "service": attach an inference client / Envoy host / GPU server
to a cluster VLAN with an L3 gateway on a leaf.

### `minimum`
Just the leaf-side access + VLAN + gateway. Assumes a working eBGP fabric
(underlay + policies) is already present. Best for brownfield adds.

- `evo/services/frontend-cluster-vlan.conf`
- `evo/interfaces/irb-cluster-gateway.conf`
- `evo/interfaces/server-access-trunk.conf`

### `with-transport`
`minimum` + the eBGP fabric underlay so the leaf actually reaches the fabric.
Best when you're not sure the underlay is present on this leaf.

- everything in `minimum`, plus:
- `evo/transport/bgp-ebgp-fabric-underlay.conf` *(LEAF variant)*
- `evo/transport/routing-options-ecmp-frr.conf`
- `evo/interfaces/fabric-p2p-links.conf` *(LEAF variant)*
- `evo/interfaces/loopback.conf`
- `evo/policy/community-definitions.conf`
- `evo/policy/allpodnetworks-direct-redistribution.conf` *(LEAF variant)*
- `evo/policy/clos-loop-prevention.conf` *(LEAF variant)*
- `evo/policy/pfe-load-balance.conf`

### `as-deployed`
Full JVD fabric baseline: the service + the entire **shared fabric baseline**
above (underlay + policies + bootstrap + OAM). Best for a greenfield leaf
turn-up or a complete working example.

- the service snips (`minimum`), plus the full **shared fabric baseline**.

---

## Spine turn-up

A spine carries NO service instances (pure L3). A spine `as-deployed` is the
**shared fabric baseline** with the SPINE variants selected — no VLAN, no IRB,
no access trunk, no l2-learning telemetry.

---

## Add-a-feature (single snip on demand)

- `Add LLDP` → `evo/oam/lldp-interface-all.conf`
- `Add L2-learning telemetry` (leaf) → `evo/oam/l2-learning-telemetry.conf`
- `Add RSTP` → `evo/oam/rstp-fabric.conf` *(LEAF edge or SPINE disable variant)*
- `Add the gRPC / Apstra base` → `evo/bootstrap/system-grpc-apstra.conf` + `evo/bootstrap/security-grpc-cert.conf`
- `Add the fabric loop-prevention policies` → `evo/policy/clos-loop-prevention.conf` + `evo/policy/community-definitions.conf`
- `Add a fabric P2P link` → `evo/interfaces/fabric-p2p-links.conf`

## byoai/DEFAULTS.md

# Auto-fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default values the AI uses in `auto` mode (or when the user short-circuits with `all defaults` / `use defaults` / `skip`). Values are grounded in the snip headers (`Seen on:`, `Variables:`) — never invented. Bundled into [`jvd-aiml-inf-snips.md`](jvd-aiml-inf-snips.md) by `regenerate-bundle.sh`.

This JVD is **Junos Evolved (EVO) only**. The distinction is ROLE (leaf vs spine), selected by the per-device AS / router-id / tier-tag.

---

## Device inventory

| Device | Platform | OS | Role | Loopback (lo0.0) | AS |
|--------|----------|----|------|------------------|-----|
| `leaf1_qfx5130-32cd` | QFX5130-32CD | EVO | Leaf (client-facing — Lambda Scaler / GenAI-Perf) | `10.0.4.0/32` | `4201032400` |
| `leaf2_qfx5130-32cd` | QFX5130-32CD | EVO | Leaf (client-facing — Envoy) | `10.0.4.1/32` | `4201032401` |
| `leaf3_qfx5130-32cd` | QFX5130-32CD | EVO | Leaf (GPU-facing — AMD MI300X-01) | `10.0.4.4/32` | `4201032406` |
| `leaf4_qfx5130-32cd` | QFX5130-32CD | EVO | Leaf (GPU-facing — AMD MI300X-02) | `10.0.4.5/32` | `4201032407` |
| `spine1_qfx5220-32cd` | QFX5220-32CD | EVO | Spine | `10.0.3.0/32` | `4201032300` |
| `spine2_qfx5220-32cd` | QFX5220-32CD | EVO | Spine | `10.0.3.1/32` | `4201032301` |

Device-choice shortcuts:
- `LEAF` → `leaf1_qfx5130-32cd` … `leaf4_qfx5130-32cd`
- `SPINE` → `spine1_qfx5220-32cd`, `spine2_qfx5220-32cd`

> Loopback/AS values above are the captured lab values from the six validated
> device configs (leaf lo0 from `10.0.4.0/24`, spine lo0 from `10.0.3.0/24`).
> All values picked are echoed in the `Inputs used:` block so the user can
> override.

---

## Transport / underlay defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$LOCAL_AS` | spine `4201032300`+; leaf `4201032400`+ | eBGP Clos — every device has its own AS |
| `$PEER_AS` | the neighbor's own `$LOCAL_AS` | remote peer AS |
| `$LOCAL_V4` / `$PEER_V4` | `10.0.5.<x>` /31 | fabric underlay p2p addressing (10.0.5.0/24) |
| `$ROUTER_ID` | = device lo0.0 v4 | matches the loopback |
| `$LOCAL_TIER_TAG` | spine `1`; leaf `5` | community high-order tier marker |
| BFD | `1000` ms × `3` | fabric liveness |

---

## Interface / breakout defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$PHY_PORT` | leaf uplink `et-0/0/24` (breakout) · spine `et-0/0/0` | fabric port |
| `$PEER_PORT_A` / `$PEER_PORT_B` | `et-0/0/4` / `et-0/0/5` | remote sub-port descriptions |
| `$LOCAL_V4_A` / `$LOCAL_V4_B` | `10.0.5.33/31` / `10.0.5.35/31` | leaf breakout /31s |
| access `$PHY_PORT` | `et-0/0/0` | server/client access trunk |
| `$PEER_DESC` | `to.mi300-01` (or `to.envoy`, `to.genai-perf`) | attached endpoint |
| MTU (fabric) | `9216` / `9170` | jumbo fabric links |
| MTU (IRB) | `9000` | client/GPU gateway |

---

## Service — frontend cluster VLAN defaults

One cluster VLAN per leaf; increment per leaf.

| Variable | leaf3 default | Notes |
|----------|---------------|-------|
| `$VLAN_NAME` | `vn5` | per leaf: leaf1=`vn3`, leaf2=`vn4`, leaf3=`vn5`, leaf4=`vn6` |
| `$VLAN_ID` | `5` | matches the VLAN name suffix (3–6) |
| `$VLAN_DESC` | `FrontEnd-Cluster-VN5` | |
| `$IRB_UNIT` | `5` | matches the VLAN ID |
| `$GW_V4` | `10.10.5.254/24` | IRB gateway (per-leaf subnet 10.10.<vlan>.0/24) |
| `$NATIVE_VLAN` | `5` | native VLAN on the access trunk |

---

## Policy / community defaults

- Tier community `FROM_SPINE_FABRIC_TIER` (`0:15`) = CLOS loop-prevention marker (JVD-wide constant, never parameterize).
- `DEFAULT_DIRECT_V4` = direct-route redistribution; high-order tag is the tier (`5:20007` leaf, `1:20007` spine), low-order `21001:26000` shared.
- Clos loop-prevention filter names: `LEAF_TO_SPINE_FABRIC_OUT` / `SPINE_TO_LEAF_FABRIC_OUT`. Policy names `BGP-AOS-Policy`, `AllPodNetworks`, `PFE-LB` are JVD-wide constants.

---

## Bootstrap defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$HOSTNAME` | the device shortname (e.g. `leaf3`) | |
| `$GRPC_PORT` | leaf `32769`; spine `32767` | gRPC extension-service SSL listener |
| certificate name | `aos_grpc` | fixed literal — referenced by name |
| routing-instance | `mgmt_junos` | management instance (fixed literal) |

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-aiml-inf-snips.md`](jvd-aiml-inf-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum" or "with-transport"
# devices:
#   leaf3: { name: <hostname>, os: evo, role: <leaf|spine>, loopback4: <addr>, as: <asn>, tier_tag: <n> }
#   spine1: { ... }
# services:
#   - { kind: frontend-cluster-vlan,
#       count: <int>,
#       vlan_name: <vnN>,
#       vlan_id: <int>,
#       irb_unit: <int>,
#       gateway: <addr>,
#       access_interface: <port>,
#       peer_desc: <endpoint> }
# snips_used:
#   - evo/services/frontend-cluster-vlan.conf
#   - evo/interfaces/irb-cluster-gateway.conf
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

Drop the leading C-style `/* … */` documentation header from each snip when emitting. Keep one `/* snips/<path> */` line as the section comment. For a snip with LEAF and SPINE variants, emit ONLY the variant matching the device's role.

## 3. `Notes:` section (always last)

Bullets covering:

- Snips intentionally omitted (and why).
- Inputs defaulted because the user did not provide them.
- Role selection: whether each device used the LEAF or SPINE variant of the dual-variant snips.
- Cross-device consistency the user must verify:
  - The eBGP Clos **per-device AS** is unique; each session's peer-AS MUST equal the neighbor's own local AS.
  - Fabric /31 **link addressing** must be consistent on both ends of each leaf↔spine link.
  - The **fabric vs IRB MTU** differ: 9216/9170 on fabric links, 9000 on the IRB gateway.
- Anything by-pattern rather than validated on that exact device (e.g. a user-supplied hostname not in any snip's `Seen on:` list).
- Reminder: this frontend fabric is a pure IPv4 eBGP Clos — there is **no** EVPN/VXLAN overlay, no RoCE CoS, and a VLAN does not stretch across leafs.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
