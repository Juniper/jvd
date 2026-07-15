# JVD SRv6 Core Edge snippet library

## evo/apply-groups/gr-bgp.conf

```
/*
 * Topic:   Wildcard apply-group: iBGP + eBGP overlay defaults
 *          (Evolved-OS variant — adds an EBGP wildcard).
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (see snips/junos/apply-groups/gr-bgp.conf — only iBGP)
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - Includes the iBGP `<GR-IBGP-*>` block matching the Junos sibling
 *    AND a second `<GR-EBGP-*>` wildcard for eBGP sessions (used at
 *    BR border routers for inter-AS Option C).
 *  - eBGP variant adds `bfd-liveness-detection` (50/3/no-adaptation) on
 *    top of TCP-AO + multipath + tcp-mss.
 *  - In Junos the eBGP defaults are inlined per-group rather than via
 *    an apply-group wildcard — that's the only structural difference.
 *
 * Pair with:
 *  - evo/transport/bgp-overlay-rr-client.conf
 *  - evo/transport/inter-as-option-c.conf
 *  - evo/transport/bgp-overlay-rr.conf
 *
 * Variables: (none — pattern is fixed; peer addresses live in
 *             instantiating routing-instance / protocol stanza)
 */
GR-BGP {
    protocols {
        bgp {
            group <GR-IBGP-*> {
                type internal;
                authentication-algorithm ao;
                authentication-key-chain KC-BGP;
                multipath;
                tcp-mss 4096;
            }
            group <GR-EBGP-*> {
                type external;
                authentication-algorithm ao;
                authentication-key-chain KC-EBGP;
                multipath;
                tcp-mss 4096;
                bfd-liveness-detection {
                    minimum-interval 50;
                    multiplier 3;
                    no-adaptation;
                }
            }
        }
    }
}
```

## evo/apply-groups/gr-core-intf-ipv6.conf

```
/*
 * Topic:   Wildcard apply-group: standard core IPv6 interface settings.
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: br2_mx304 cr1_mx10004 cr2_mx2010 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - Body is byte-identical to the Junos sibling EXCEPT one line:
 *      Junos: `mtu 9106;`        (active under family iso/inet6)
 *      EVO:   `inactive: mtu 9106;`
 *    EVO PTX line cards already enforce the L3 MTU from the L2 setting,
 *    so explicit family-MTU is left disabled by default — toggle if the
 *    deployment needs an override.
 *  - All other knobs (jumbo L2 MTU, BFD-on-LACP, optics-options) match
 *    exactly.
 *
 * Pair with:
 *  - evo/transport/isis-srv6-flex-algo.conf
 *  - evo/transport/bfd-isis.conf
 *  - evo/apply-groups/gr-isis-ipv6.conf
 *  - evo/interfaces/core-ae-link.conf
 *  - evo/oam/bfd-defaults.conf
 *  - evo/interfaces/pe-ce-direct.conf
 *
 * Variables (example values from br1_ptx10002-36qdd):
 *   $JUMBO_L2_MTU       e.g. 9192
 *   $JUMBO_L3_MTU       e.g. 9106
 *   $LACP_BFD_INTERVAL  e.g. 50
 *   $LACP_BFD_MULT      e.g. 3
 */
GR-CORE-INTF-IPV6 {
    interfaces {
        <*> {
            description ********GR-CORE-INTF-SETTINGS-APPLIED-ADD-DESCRIPTION********;
            traps;
            mtu $JUMBO_L2_MTU;
            hold-time up 2000 down 0;
            unit 0 {
                traps;
                family iso {
                    inactive: mtu $JUMBO_L3_MTU;
                }
                family inet6 {
                    inactive: mtu $JUMBO_L3_MTU;
                }
            }
        }
        <ae*> {
            aggregated-ether-options {
                bfd-liveness-detection {
                    version automatic;
                    minimum-interval $LACP_BFD_INTERVAL;
                    multiplier $LACP_BFD_MULT;
                    no-adaptation;
                }
                lacp {
                    active;
                    hold-time up 2;
                }
            }
        }
        "<[egx][te]-*>" {
            optics-options {
                alarm low-light-alarm {
                    link-down;
                }
                warning low-light-warning {
                    syslog;
                }
            }
        }
    }
}
```

## evo/apply-groups/gr-isis-ipv6.conf

```
/*
 * Topic:   Wildcard apply-group: per-interface IS-IS L2 settings for
 *          SRv6 µSID — adjacency-SIDs per Flex-Algo, TI-LFA node
 *          protection, ASLA delay/TE metric, dynamic delay measurement.
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: br2_mx304 cr1_mx10004 cr2_mx2010 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - Body is byte-identical to the Junos sibling. Junos and EVO use the
 *    same syntax for IS-IS srv6-adjacency-segment, ASLA attribute-group,
 *    and dynamic delay-measurement.
 *  - `<*e*>` wildcard targets all ethernet IFLs; level 1 disabled
 *    (single-area L2 design).
 *  - One `srv6-adjacency-segment` block per Flex-Algo locator
 *    (FA-0 / FA-128 / FA-129) — gives unprotected µA SIDs that
 *    TI-LFA uses for backup paths.
 *  - `post-convergence-lfa { node-protection cost 16777214; }` enables
 *    TI-LFA node protection with a high tiebreaker cost so the primary
 *    path always wins when both are available.
 *  - `attribute-group LA-FA` advertises both delay and TE metrics in
 *    the IS-IS Application-Specific Link Attribute (ASLA) TLV scoped
 *    to `flex-algorithm`.
 *  - Built-in delay measurement (`probe-interval 1` / `probe-count 10`)
 *    feeds the FA-128 delay-metric advertisements every 30 s.
 *  - `inactive: hello-authentication-key-chain KC-ISIS;` keeps the
 *    knob present but disabled — toggle when key-chain is provisioned.
 *
 * Pair with:
 *  - evo/oam/twamp-light.conf
 *  - evo/transport/ti-lfa-mla.conf
 *  - evo/apply-groups/gr-core-intf-ipv6.conf  (provides family iso/inet6)
 *  - evo/apply-groups/gr-srv6.conf            (defines locator µSID flavors)
 *  - evo/transport/isis-srv6-flex-algo.conf   (instantiates this group)
 *  - evo/transport/bfd-isis.conf              (per-AFI BFD on the same IFLs)
 *
 * Variables (example values from edge1_mx480):
 *   $LOC_FA_0           e.g. SL-FA-000
 *   $LOC_FA_128         e.g. SL-FA-128
 *   $LOC_FA_129         e.g. SL-FA-129
 *   $TE_METRIC          e.g. 1000
 *   $DELAY_METRIC       e.g. 1000
 *   $DELAY_PROBE_INT    e.g. 1
 *   $DELAY_PROBE_COUNT  e.g. 10
 *   $DELAY_ADV_THRESH   e.g. 100
 *   $DELAY_ADV_INTERVAL e.g. 30
 *   $JUMBO_HELLO_SIZE   e.g. 9106
 *   $BFD_MIN_INT        e.g. 50
 *   $BFD_MULT           e.g. 3
 */

GR-ISIS-IPV6 {
    protocols {
        isis {
            interface <*e*> {
                level 1 disable;
                level 2 {
                    srv6-adjacency-segment {
                        unprotected {
                            locator $LOC_FA_0 {
                                micro-adjacency-sid;
                            }
                            locator $LOC_FA_128 {
                                micro-adjacency-sid;
                            }
                            locator $LOC_FA_129 {
                                micro-adjacency-sid;
                            }
                        }
                    }
                    post-convergence-lfa {
                        node-protection cost 16777214;
                    }
                    application-specific {
                        attribute-group LA-FA {
                            advertise-delay-metric;
                            te-metric $TE_METRIC;
                            application {
                                flex-algorithm;
                            }
                        }
                    }
                    inactive: hello-authentication-key-chain KC-ISIS;
                }
                delay-metric $DELAY_METRIC;
                delay-measurement {
                    probe-interval $DELAY_PROBE_INT;
                    probe-count $DELAY_PROBE_COUNT;
                    advertisement {
                        periodic {
                            threshold $DELAY_ADV_THRESH;
                            interval $DELAY_ADV_INTERVAL;
                        }
                    }
                }
                hello-padding strict;
                inactive: max-hello-size $JUMBO_HELLO_SIZE;
                point-to-point;
            }
            interface "<[egx][te]-*>" {
                family inet6 {
                    bfd-liveness-detection {
                        minimum-interval $BFD_MIN_INT;
                        multiplier $BFD_MULT;
                        no-adaptation;
                    }
                }
            }
            interface lo0.0 {
                level 1 disable;
                passive;
            }
        }
    }
}
```

## evo/apply-groups/gr-l3vpn.conf

```
/*
 * Topic:   Wildcard apply-group: L3VPN routing-instance defaults
 *          (Evolved-OS variant — IDENTICAL to Junos sibling).
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (see snips/junos/apply-groups/gr-l3vpn.conf)
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - Body is byte-identical to the Junos sibling.
 *
 * Pair with:
 *  - evo/services/l3vpn-srv6-vrf.conf
 *
 * Variables: (none — pattern is fixed)
 */
GR-L3VPN {
    routing-instances {
        <*> {
            instance-type vrf;
            routing-options {
                multipath {
                    vpn-unequal-cost;
                }
            }
            vrf-table-label;
        }
    }
}
```

## evo/apply-groups/gr-srv6.conf

```
/*
 * Topic:   Wildcard apply-group: SRv6 µSID locator default flavors
 *          (Evolved-OS variant — IDENTICAL to Junos sibling).
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (see snips/junos/apply-groups/gr-srv6.conf)
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - Body is byte-identical to the Junos sibling.
 *
 * Pair with:
 *  - evo/transport/isis-srv6-flex-algo.conf
 *  - evo/apply-groups/gr-isis-ipv6.conf
 *
 * Variables: (none — pattern is fixed)
 */
GR-SRV6 {
    routing-options {
        source-packet-routing {
            srv6 {
                locator <SL-*> {
                    micro-sid {
                        flavor {
                            psp;
                            usp;
                            usd;
                        }
                    }
                }
            }
        }
    }
}
```

## evo/interfaces/core-ae-link.conf

```
/*
 * Topic:   Core AE link template — flexible-vlan-tagging trunk
 *          between PE/CR/BR with per-VLAN IS-IS-bearing units.
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: br2_mx304 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - On PTX10002, member-link options use `et-options { 802.3ad ae<n>; }`
 *    instead of MX's `gigether-options { 802.3ad ae<n>; }`.
 *  - `apply-groups GR-CORE-INTF-IPV6` provides the AE bundle's BFD,
 *    LACP timers, jumbo MTU; this snippet only adds the per-AE
 *    `aggregated-ether-options { minimum-links 1; }` and the
 *    per-VLAN `unit` blocks that carry `family iso` + `family inet6`.
 *  - One `unit <vlan>` per neighbor; jumbo MTU 9106 from the apply-
 *    group propagates to each unit's family-MTU.
 *  - `description CORE-TO-<peer>` is required convention for telemetry
 *    correlation.
 *  - Member links go in the physical `xe-*` / `et-*` interface
 *    stanza with `gigether-options { 802.3ad ae<n>; }`.
 *
 * Pair with:
 *  - evo/apply-groups/gr-core-intf-ipv6.conf  (BFD, LACP, MTU)
 *  - evo/transport/isis-srv6-flex-algo.conf   (lists this IFL)
 *
 * Variables (example values):
 *   $AE_NUMBER          e.g. 0
 *   $PEER_HOSTNAME      e.g. CR1
 *   $UNIT               e.g. 10
 *   $VLAN               e.g. 10
 *   $LOCAL_V6           e.g. 2001:db8:bad:cafe:48:56::1/127
 *   $MEMBER_PORT_LIST   e.g. xe-2/0/0 xe-2/0/1
 */

interfaces {
    $MEMBER_PORT_LIST {
        gigether-options {
            802.3ad ae$AE_NUMBER;
        }
    }
    ae$AE_NUMBER {
        description CORE-TO-$PEER_HOSTNAME;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            minimum-links 1;
        }
        unit $UNIT {
            description TO-$PEER_HOSTNAME-VLAN-$VLAN;
            vlan-id $VLAN;
            family iso;
            family inet6 {
                address $LOCAL_V6;
            }
        }
    }
}
```

## evo/interfaces/cpe-attachment.conf

```
/*
 * Topic:   CPE attachment — flexible-vlan trunk with per-service units
 *          (L3VPN sub-IFL, EVPN-VPWS AC w/ ESI, IRB AC).
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *
 * Highlights:
 *  - Body is byte-identical to the Junos sibling.
 *  - Single `flexible-vlan-tagging` + `encapsulation
 *    flexible-ethernet-services` IFL hosts every service type:
 *      • Plain L3 sub-IFL (`vlan-id` + `family inet`/`inet6`)
 *      • EVPN-VPWS AC (`encapsulation vlan-ccc` + `esi { ...; <mode> }`)
 *      • EVPN bridge AC (`encapsulation vlan-bridge` + `family bridge`)
 *  - For multi-homed CEs, two PEs share the same `esi { <esi>;
 *    all-active|single-active }` value on their respective AC units.
 *  - ESI byte 9 byte encodes the local PE; bytes 10 encodes the
 *    service ID — per JVD convention.
 *
 * Pair with:
 *  - evo/services/evpn-vpws-srv6.conf  (consumes the AC unit)
 *  - evo/interfaces/pe-ce-direct.conf    (consumes the L3 sub-IFL)
 *  - evo/interfaces/pe-ce-irb.conf       (consumes the bridge AC)
 *
 * Variables (example values from mse2_mx304):
 *   $PHYS_IFL          e.g. ae2
 *   $L3_UNIT           e.g. 10
 *   $L3_VLAN           e.g. 10
 *   $L3_V6             e.g. 2020:0:0:1::1/126
 *   $VPWS_UNIT         e.g. 1001
 *   $VPWS_VLAN         e.g. 1001
 *   $ESI_BYTES         e.g. 00:11:11:11:11:11:11:11:18:d1
 *   $ESI_MODE          e.g. single-active   (or all-active)
 *   $BRIDGE_UNIT       e.g. 601
 *   $BRIDGE_VLAN       e.g. 601
 */

interfaces {
    $PHYS_IFL {
        description TO-CPE;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;

        /* Plain L3VPN sub-IFL */
        unit $L3_UNIT {
            vlan-id $L3_VLAN;
            family iso;
            family inet6 {
                address $L3_V6;
            }
        }

        /* EVPN-VPWS attachment circuit */
        unit $VPWS_UNIT {
            description EVPN-VPWS-AC;
            encapsulation vlan-ccc;
            vlan-id $VPWS_VLAN;
            esi {
                $ESI_BYTES;
                $ESI_MODE;
            }
        }

        /* EVPN bridge AC for IRB-stitched L3VPN */
        unit $BRIDGE_UNIT {
            encapsulation vlan-bridge;
            vlan-id $BRIDGE_VLAN;
            family bridge;
        }
    }
}
```

## evo/interfaces/pe-ce-direct.conf

```
/*
 * Topic:   PE-CE direct (sub-)interface attachment — IFL on physical
 *          interface placed inside an L3VPN VRF.
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - On PTX10002 the physical IFL is typically `et-0/0/<port>` (400G/100G
 *    optics) instead of MX's `xe-`/`ae-` naming.
 *  - One sub-IFL per VRF, dot1q-tagged via `vlan-id $VLAN`; family
 *    inet + inet6 carry both AFIs across the same PE-CE link.
 *  - `family iso { mtu $JUMBO_L3_MTU; }` is omitted on PE-CE units
 *    (no IS-IS toward the customer).
 *  - The matching loopback unit (`lo0.<unit>`) gives the VRF a
 *    routable router-id and a stable inet/inet6 address for BGP
 *    `local-address`.
 *
 * Pair with:
 *  - evo/interfaces/cpe-attachment.conf
 *  - evo/interfaces/pe-ce-irb.conf
 *  - evo/services/l3vpn-srv6-vrf.conf     (consumes this IFL)
 *  - evo/apply-groups/gr-core-intf-ipv6.conf (suppressed by `<*>`
 *      pattern but the platform-side defaults still apply)
 *
 * JVD service mapping:
 *   (no instances found in topology registry)
 *
 * Variables (example values from mse1_mx480):
 *   $PHYS_IFL          e.g. xe-2/0/2
 *   $VRF_UNIT          e.g. 501
 *   $VLAN              e.g. 501
 *   $PE_CE_V4_LOCAL    e.g. 13.1.8.1/30
 *   $PE_CE_V6_LOCAL    e.g. 2013:1:8::1/126
 *   $LOOPBACK_V4       e.g. 195.168.8.1/32
 *   $LOOPBACK_V6       e.g. 2195:168:8::1/128
 */

interfaces {
    $PHYS_IFL {
        vlan-tagging;
        unit $VRF_UNIT {
            vlan-id $VLAN;
            family inet {
                address $PE_CE_V4_LOCAL;
            }
            family inet6 {
                address $PE_CE_V6_LOCAL;
            }
        }
    }
    lo0 {
        unit $VRF_UNIT {
            family inet {
                address $LOOPBACK_V4;
            }
            family inet6 {
                address $LOOPBACK_V6;
            }
        }
    }
}
```

## evo/interfaces/pe-ce-irb.conf

```
/*
 * Topic:   PE-CE attachment via IRB — bridge-domain on the AC stitched
 *          to an IRB unit placed inside the L3VPN VRF.
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: edge1_mx480 edge2_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - Body is byte-identical to the Junos sibling.
 *  - The customer-facing IFL uses `encapsulation flexible-ethernet-services`
 *    with the per-VLAN `unit` carrying `family bridge`; the L3 SVI
 *    lives on `irb.<unit>` and is placed in the VRF.
 *  - `bridge-domains BD-<id> { vlan-id <id>; routing-interface irb.<id>; }`
 *    binds the AC unit to the IRB.
 *  - The IRB's `family inet`/`inet6` provides the gateway address for
 *    CE hosts.
 *  - Used when a CPE bridges multiple physical ports into one VLAN
 *    that needs a single L3 gateway in the L3VPN.
 *
 * Pair with:
 *  - evo/interfaces/cpe-attachment.conf
 *  - evo/services/l3vpn-srv6-vrf.conf     (places irb.X in VRF)
 *  - evo/interfaces/pe-ce-direct.conf       (alternative w/o bridging)
 *
 * JVD service mapping:
 *   (no instances found in topology registry)
 *
 * Variables (example values from mse1_mx480):
 *   $PHYS_IFL        e.g. xe-2/0/3
 *   $BD_UNIT         e.g. 601
 *   $VLAN            e.g. 601
 *   $IRB_V4          e.g. 10.104.8.1/30
 *   $IRB_V6          e.g. 2010:104:8::1/126
 */

interfaces {
    $PHYS_IFL {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        unit $BD_UNIT {
            encapsulation vlan-bridge;
            vlan-id $VLAN;
            family bridge;
        }
    }
    irb {
        unit $BD_UNIT {
            family inet {
                address $IRB_V4;
            }
            family inet6 {
                address $IRB_V6;
            }
        }
    }
}
bridge-domains {
    BD-$BD_UNIT {
        vlan-id $VLAN;
        routing-interface irb.$BD_UNIT;
    }
}
```

## evo/oam/bfd-defaults.conf

```
/*
 * Topic:   Default BFD timers and detection profile — the canonical
 *          values used across BFDv6 / BFD-on-LACP / BFD-on-BGP in
 *          this JVD.
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: cr1_mx10004 cr2_mx2010 br2_mx304 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - Body is byte-identical to the Junos sibling.
 *  - `minimum-interval 50 multiplier 3` -> ~150 ms detect; the JVD's
 *    standard for core links.
 *  - `no-adaptation` prevents Junos from auto-relaxing timers under
 *    perceived congestion (we want strict detection).
 *  - The same triplet shows up in three places:
 *      • Per-IFL IS-IS BFD (transport/bfd-isis.conf)
 *      • BFD-on-LACP under <ae*> (apply-groups/gr-core-intf-ipv6.conf)
 *      • Optional BGP `bfd-liveness-detection` block (peer level)
 *
 * Pair with:
 *  - evo/transport/bfd-isis.conf
 *  - evo/apply-groups/gr-core-intf-ipv6.conf
 *
 * Variables (example values from edge1_mx480):
 *   $BFD_MIN_INT  e.g. 50
 *   $BFD_MULT     e.g. 3
 */

/*
 * Reference defaults snippet — drop into any block that takes a
 * `bfd-liveness-detection { ... }` stanza (BGP neighbor, IS-IS family,
 * static route, AE bundle, etc.).
 */
bfd-liveness-detection {
    minimum-interval $BFD_MIN_INT;
    multiplier $BFD_MULT;
    no-adaptation;
}
```

## evo/oam/twamp-light.conf

```
/*
 * Topic:   TWAMP-Light responder — receive-only TWAMP-Light server for
 *          on-demand link/path delay measurements.
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: br2_mx304 cr1_mx10004 cr2_mx2010 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - Body is byte-identical to the Junos sibling.
 *  - `services rpm twamp server { authentication-mode none; light; }`
 *    enables the TWAMP-Light responder (UDP, no control session
 *    setup) — used by the IS-IS dynamic delay-measurement on remote
 *    nodes and by external SLA probes.
 *  - `authentication-mode none` is appropriate inside a trusted core
 *    domain; switch to `hmac-sha-256` when crossing administrative
 *    boundaries.
 *  - No client/sender stanza — measurement is unidirectional from any
 *    sender that knows this responder's loopback.
 *
 * Pair with:
 *  - evo/apply-groups/gr-isis-ipv6.conf       (consumes results
 *      via `delay-measurement` on each IFL)
 *
 * Variables: (none — pattern is fixed)
 */

services {
    rpm {
        twamp {
            server {
                authentication-mode none;
                light;
            }
        }
    }
}
```

## evo/policy/srv6-redistribution-policy.conf

```
/*
 * Topic:   SRv6 redistribution / load-balance policies (Evolved-OS —
 *          adds the inter-AS BR's import/export policies that the
 *          Junos sibling does not need).
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (see snips/junos/policy/srv6-redistribution-policy.conf for
 *          PS-LOAD-BALANCE, which is identical here)
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - PS-LOAD-BALANCE is identical to Junos.
 *  - PS-IBGP-SRV6-IMP filters which SRv6 service routes the BR
 *    accepts from the in-domain RR overlay before considering them
 *    for inter-AS leak (apply on the iBGP RR session — see
 *    snips/evo/transport/bgp-overlay-rr-client.conf).
 *  - PS-EBGP-IMP / PS-EBGP-NHS / PS-EBGP-SRV6-EXP shape what crosses
 *    the inter-AS Option C eBGP session (PS-EBGP-NHS is "next-hop-self"
 *    which becomes critical when re-originating across the boundary).
 *  - Bodies of the per-policy terms vary by deployment — the snippet
 *    below shows the canonical structure with placeholders.
 *
 * Pair with:
 *  - evo/transport/inter-as-option-c.conf
 *  - evo/transport/bgp-overlay-rr-client.conf
 *  - evo/transport/srv6-locator-summarization.conf
 *  - evo/transport/bgp-overlay-rr.conf
 *  - evo/transport/isis-srv6-flex-algo.conf
 *
 * Variables (example placeholders):
 *   $LOCAL_AS         e.g. 65001
 *   $LOCAL_BR_V6      e.g. 2001:db8:beef::3660:36
 */
policy-options {
    /* Identical to Junos sibling */
    policy-statement PS-LOAD-BALANCE {
        then { load-balance per-packet; }
    }

    /* Inbound filter on iBGP RR session: accept SRv6 service routes only */
    policy-statement PS-IBGP-SRV6-IMP {
        term TR-ACCEPT-SRV6 {
            from community RT-SRV6;
            then accept;
        }
        term TR-DEFAULT-REJECT {
            then reject;
        }
    }

    /* Inbound on inter-AS eBGP session */
    policy-statement PS-EBGP-IMP {
        term TR-ACCEPT-SRV6-VPN {
            from community RT-SRV6;
            then accept;
        }
    }

    /* Outbound: rewrite next-hop to local BR loopback */
    policy-statement PS-EBGP-NHS {
        then {
            next-hop $LOCAL_BR_V6;
        }
    }

    /* Outbound: which prefix families to advertise across inter-AS */
    policy-statement PS-EBGP-SRV6-EXP {
        term TR-VPN {
            from community RT-SRV6;
            then accept;
        }
        term TR-LOC {
            from {
                protocol isis;
                route-filter 5f00::/16 prefix-length-range /24-/48;
            }
            then accept;
        }
    }

    community RT-SRV6 members target:$LOCAL_AS:*;
}
```

## evo/policy/vpn-import-export-rt.conf

```
/*
 * Topic:   VRF route-target import/export policy + RT-SRV6 community
 *          scoping — used by RRs to filter L3VPN routes to the
 *          SRv6-only set.
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: cr1_mx10004 cr2_mx2010 br2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - Body is byte-identical to the Junos sibling.
 *  - `community RT-SRV6 members target:$LOCAL_AS:*` matches every
 *    extended-community in the SRv6 RT range; combined with
 *    `term TR-L3VPN-SRV6 { from rib bgp.l3vpn.0; community RT-SRV6;
 *    then accept; }` it accepts only SRv6 L3VPN routes for re-
 *    advertisement.
 *  - `term TR-L3VPN-MPLS { from rib bgp.l3vpn.0; then reject; }` drops
 *    legacy MPLS L3VPN routes that the BR may also see.
 *  - Per-VRF `vrf-target target:$LOCAL_AS:$VPN_ID` lives in the VRF
 *    stanza (see l3vpn-srv6-vrf.conf) — symmetric import/export.
 *
 * Pair with:
 *  - evo/transport/bgp-overlay-rr.conf       (applies PS-VPN-SRV6)
 *  - evo/services/l3vpn-srv6-vrf.conf        (defines per-VRF RTs)
 *
 * Variables (example values from cr1_mx10004):
 *   $LOCAL_AS         e.g. 65001
 */

policy-options {
    policy-statement PS-VPN-SRV6 {
        term TR-L3VPN-SRV6 {
            from {
                rib bgp.l3vpn.0;
                community RT-SRV6;
            }
            then accept;
        }
        term TR-L3VPN-MPLS {
            from rib bgp.l3vpn.0;
            then reject;
        }
    }
    community RT-SRV6 members target:$LOCAL_AS:*;
}
```

## evo/services/l3vpn-srv6-vrf.conf

```
/*
 * Topic:   L3VPN routing-instance over SRv6 — per-Flex-Algo VRF with
 *          PE-CE eBGP and µDT46 SID for end-to-end IPv4+IPv6 carriage.
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: br2_mx304 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - Body is byte-identical to the Junos sibling.
 *  - `apply-groups GR-L3VPN` pulls in `instance-type vrf`,
 *    `vpn-unequal-cost` multipath, and `vrf-table-label`.
 *  - `source-packet-routing { srv6 { locator $LOC { micro-dt46-sid; } } }`
 *    binds this VRF's service SID to the chosen Flex-Algo locator —
 *    swap `$LOC` between SL-FA-000 / SL-FA-128 / SL-FA-129 to pick the
 *    transport class (default / delay / TE).
 *  - `vrf-target target:$AS:$VPN_ID` sets both import and export RTs;
 *    matched by the RR's RTC filter.
 *  - PE-CE eBGP carries both `family inet` and `family inet6` (single
 *    session, both AFIs); `as-override` is enabled when the same
 *    customer ASN is reused at multiple sites.
 *  - `route-distinguisher $RD_SEED:$VPN_ID` follows the convention
 *    "<PE-loopback-decimal>:<service-id>".
 *  - VRF can carry a directly-attached `interface xe-X/Y/Z.<unit>`
 *    (PE-CE direct routing) or an `interface irb.<unit>` for an EVPN
 *    bridge-domain stitched to L3 (see pe-ce-irb.conf).
 *
 * Pair with:
 *  - evo/services/evpn-vpws-srv6.conf
 *  - evo/transport/bgp-overlay-rr-client.conf
 *  - evo/apply-groups/gr-l3vpn.conf           (provides defaults)
 *  - evo/interfaces/pe-ce-direct.conf           (xe-*.<unit> attachment)
 *  - evo/interfaces/pe-ce-irb.conf              (IRB attachment)
 *  - evo/policy/vpn-import-export-rt.conf     (RT-SRV6, RT scoping)
 *  - evo/transport/bgp-transport-class.conf   (color->FA binding)
 *
 * JVD service mapping:
 *   12 instances total (high 1 / med 11 / low 0)
 *   On devices: br1_ptx10002-36qdd (12), br2_mx304 (12), edge1_mx480 (12), edge2_mx480 (12), edge3_mx480 (12), mse1_mx480 (12), +1 more
 *   Example: L3VPN-DYN-FA000-1 (RD 100.0.0.36:501, RT target:65001:501)
 *     br1_ptx10002-36qdd  et-0/0/12:2.501
 *     br2_mx304  xe-0/0/3:0.501
 *     edge1_mx480  et-0/0/14.501
 *     edge2_mx480  xe-1/0/2.501
 *     (+3 more endpoints)
 *
 * Variables (example values from mse1_mx480):
 *   $VRF_NAME          e.g. L3VPN-DYN-FA000-1
 *   $LOC               e.g. SL-FA-000  (FA-128 for delay, FA-129 for TE)
 *   $VRF_ROUTER_ID     e.g. 195.168.8.1
 *   $RD_SEED           e.g. 200.0.0.60
 *   $VPN_ID            e.g. 501
 *   $RT_AS             e.g. 65001  (route-target AS — may differ from local-as)
 *   $LOCAL_AS          e.g. 65000
 *   $CE_AS             e.g. 65003
 *   $PE_CE_LOCAL_V4    e.g. 13.1.8.1
 *   $PE_CE_NEIGHBOR_V4 e.g. 13.1.8.2
 *   $ATTACH_IFL        e.g. xe-2/0/2.501
 *   $LOOPBACK_IFL      e.g. lo0.501
 */

routing-instances {
    $VRF_NAME {
        apply-groups GR-L3VPN;
        routing-options {
            router-id $VRF_ROUTER_ID;
            protect core;
        }
        protocols {
            bgp {
                group TO-CE {
                    type external;
                    local-address $PE_CE_LOCAL_V4;
                    family inet { any; }
                    family inet6 { any; }
                    peer-as $CE_AS;
                    local-as $LOCAL_AS;
                    as-override;
                    neighbor $PE_CE_NEIGHBOR_V4;
                }
                source-packet-routing {
                    srv6 {
                        locator $LOC {
                            micro-dt46-sid;
                        }
                    }
                }
            }
        }
        interface $ATTACH_IFL;
        interface $LOOPBACK_IFL;
        route-distinguisher $RD_SEED:$VPN_ID;
        vrf-target target:$RT_AS:$VPN_ID;
    }
}
```

## evo/transport/bfd-isis.conf

```
/*
 * Topic:   Per-IFL BFDv6 configuration for IS-IS adjacencies — fast
 *          convergence on core links.
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - Body is byte-identical to the Junos sibling.
 *  - BFD is enabled per AFI under each IS-IS interface (here `family inet6`)
 *    rather than as a global protocol — fits the JVD's IPv6-only
 *    underlay.
 *  - `minimum-interval 50` + `multiplier 3` gives ~150 ms detection;
 *    `no-adaptation` keeps timers fixed regardless of negotiated rate.
 *  - On AE bundles BFD-on-LACP runs in addition (see `gr-core-intf-ipv6`):
 *    member-level BFD catches single-link failures inside the bundle.
 *
 * Pair with:
 *  - evo/oam/bfd-defaults.conf
 *  - evo/apply-groups/gr-isis-ipv6.conf       (provides this snippet)
 *  - evo/apply-groups/gr-core-intf-ipv6.conf  (BFD-over-LACP on AE)
 *
 * Variables (example values from edge1_mx480):
 *   $BFD_MIN_INT  e.g. 50
 *   $BFD_MULT     e.g. 3
 */

protocols {
    isis {
        interface "<[egx][te]-*>" {
            family inet6 {
                bfd-liveness-detection {
                    minimum-interval $BFD_MIN_INT;
                    multiplier $BFD_MULT;
                    no-adaptation;
                }
            }
        }
    }
}
```

## evo/transport/bgp-overlay-rr-client.conf

```
/*
 * Topic:   PE-side iBGP overlay configuration toward route-reflectors
 *          for SRv6 service signaling — single peer-group with all
 *          relevant SAFIs and a default per-VRF service locator.
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - Multi-AFI peer-group `GR-IBGP-TO-RR-SRV6` body is identical to the
 *    Junos sibling. Border Router role MAY add an `import PS-IBGP-SRV6-IMP`
 *    policy on the RR session (filters which SRv6 service routes are
 *    accepted from the overlay before considering them for inter-AS leak).
 *    On a pure PE the import policy is omitted.
 *  - Single `group GR-IBGP-TO-RR-SRV6` with two `neighbor` blocks (one
 *    per RR) — picks up TCP-AO / multipath / tcp-mss from `apply-groups
 *    GR-BGP`.
 *  - All multi-AFI families enabled with `advertise-srv6-service` /
 *    `accept-srv6-service`; `extended-nexthop` allows v4 prefixes to
 *    resolve via v6 nexthops over the SRv6 underlay.
 *  - PE does NOT set `cluster` (only RRs do).
 *  - `family route-target { nexthop-resolution { no-resolution; } }`
 *    enables RTC client side; PE will only receive VPN routes
 *    matching its imported route-targets.
 *  - `source-packet-routing { srv6 { locator $LOC micro-dt46-sid; } }`
 *    is the PE-default service-SID flavor (per-VRF DT46 — supports
 *    both v4 and v6 inside the VPN). Per-VRF `routing-instances`
 *    can override (e.g. some VRFs use micro-dt6-sid only).
 *
 * Pair with:
 *  - evo/policy/srv6-redistribution-policy.conf
 *  - evo/services/evpn-vpws-srv6.conf
 *  - evo/apply-groups/gr-bgp.conf            (TCP-AO, multipath, MSS)
 *  - evo/transport/bgp-overlay-rr.conf       (RR-side counterpart)
 *  - evo/services/l3vpn-srv6-vrf.conf        (per-VRF locator overrides)
 *
 * Variables (example values from edge1_mx480):
 *   $PE_LOCAL_V6        e.g. 2001:db8:bad:cafe::1006:48
 *   $RR1_V6             e.g. 2001:db8:bad:cafe::1000:31
 *   $RR2_V6             e.g. 2001:db8:bad:cafe::1000:56
 *   $DEFAULT_SVC_LOC    e.g. SL-FA-000
 */

protocols {
    bgp {
        apply-groups GR-BGP;
        path-selection external-router-id;
        advertise-from-main-vpn-tables;
        vpn-apply-export;
        group GR-IBGP-TO-RR-SRV6 {
            local-address $PE_LOCAL_V6;
            family inet {
                unicast {
                    extended-nexthop;
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet-vpn {
                unicast {
                    extended-nexthop;
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet6 {
                unicast {
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet6-vpn {
                unicast {
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family evpn {
                signaling {
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family route-target {
                nexthop-resolution { no-resolution; }
            }
            neighbor $RR1_V6 {
                description RR1;
            }
            neighbor $RR2_V6 {
                description RR2;
            }
        }
        source-packet-routing {
            srv6 {
                locator $DEFAULT_SVC_LOC {
                    micro-dt46-sid;
                }
            }
        }
        precision-timers;
        advertise-inactive;
        log-updown;
        bgp-error-tolerance;
        multipath {
            list-nexthop;
        }
        rfc8950-compliant;
    }
}
```

## evo/transport/bgp-overlay-rr.conf

```
/*
 * Topic:   iBGP overlay route-reflector configuration — multi-AFI SRv6
 *          service signaling (inet/inet-vpn, inet6/inet6-vpn, evpn,
 *          route-target) with `advertise-srv6-service` /
 *          `accept-srv6-service` enabled per family.
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - BR1 in this JVD is not deployed as an RR; this snippet documents the
 *    EVO-equivalent shape so a PTX/EVO RR deployment can drop it in.
 *    Body is byte-identical to the Junos sibling.
 *  - One `bgp { group GR-IBGP-* }` per role: RR<->RR mesh, RR-clients
 *    in the local AS, ASBR sessions toward the BR border routers.
 *  - `advertise-srv6-service` + `accept-srv6-service` per AFI is the
 *    SRv6 BGP signaling toggle (RFC 9252 SRv6 Service TLV).
 *  - `nexthop-resolution { no-resolution; }` skips per-prefix BGP NH
 *    resolution because resolution is handled via the SRv6 µSID stack
 *    install in inet.3.
 *  - `extended-nexthop` allows v4 routes with v6 nexthops (key for
 *    SRv6 underlay carrying v4 services).
 *  - `family route-target { advertise-default; }` enables RTC so the
 *    RR only sends VPN routes a client cares about.
 *  - `path-selection external-router-id` + `advertise-from-main-vpn-tables`
 *    + `vpn-apply-export` are the canonical RR-side L3VPN flags.
 *  - `cluster $RR_CLUSTER_ID` is the RR signature on client groups
 *    (omit for RR-RR mesh).
 *  - For ASBR-side, `family route-target { external-paths 3; }` and
 *    `export PS-VPN-SRV6` filters L3VPN.0 to SRv6-only routes
 *    (drops legacy MPLS L3VPN paths).
 *
 * Pair with:
 *  - evo/policy/vpn-import-export-rt.conf
 *  - evo/apply-groups/gr-bgp.conf            (TCP-AO, multipath, MSS)
 *  - evo/policy/vpn-import-export-rt.conf         (PS-VPN-SRV6, RT-SRV6)
 *  - evo/policy/srv6-redistribution-policy.conf       (PS-LOAD-BALANCE)
 *  - evo/transport/bgp-overlay-rr-client.conf (PE-side counterpart)
 *
 * Variables (example values from cr1_mx10004):
 *   $RR_LOCAL_V6           e.g. 2001:db8:bad:cafe::1000:56
 *   $RR_PEER_V6            e.g. 2001:db8:bad:cafe::1000:31
 *   $RR_CLUSTER_ID         e.g. 100.0.0.56
 *   $CLIENT_NEIGHBOR_LIST  e.g. one neighbor block per RR client
 *   $ASBR_NEIGHBOR_LIST    e.g. one neighbor block per BR (peer ASBR)
 */

protocols {
    bgp {
        apply-groups GR-BGP;
        path-selection external-router-id;
        advertise-from-main-vpn-tables;
        vpn-apply-export;

        /* RR<->RR full mesh */
        group GR-IBGP-RRS-SRV6 {
            local-address $RR_LOCAL_V6;
            family inet {
                unicast {
                    nexthop-resolution { no-resolution; }
                    extended-nexthop;
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet-vpn {
                unicast {
                    nexthop-resolution { no-resolution; }
                    extended-nexthop;
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet6 {
                unicast {
                    nexthop-resolution { no-resolution; }
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet6-vpn {
                unicast {
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family evpn {
                signaling {
                    nexthop-resolution { no-resolution; }
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family route-target {
                advertise-default;
                nexthop-resolution { no-resolution; }
            }
            export PS-VPN-SRV6;
            neighbor $RR_PEER_V6 {
                description PEER-RR;
            }
        }

        /* RR clients (PEs / Edges / MSEs) */
        group GR-IBGP-RR-CLIENTS-SRV6 {
            local-address $RR_LOCAL_V6;
            family inet {
                unicast {
                    nexthop-resolution { no-resolution; }
                    extended-nexthop;
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet-vpn {
                unicast {
                    nexthop-resolution { no-resolution; }
                    extended-nexthop;
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet6 {
                unicast {
                    nexthop-resolution { no-resolution; }
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet6-vpn {
                unicast {
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family evpn {
                signaling {
                    nexthop-resolution { no-resolution; }
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family route-target {
                advertise-default;
                nexthop-resolution { no-resolution; }
            }
            cluster $RR_CLUSTER_ID;
            $CLIENT_NEIGHBOR_LIST;
        }

        /* ASBR (BR<->RR) sessions for inter-AS Option C */
        group GR-IBGP-ASBR-SRV6 {
            local-address $RR_LOCAL_V6;
            family inet {
                unicast {
                    nexthop-resolution { no-resolution; }
                    extended-nexthop;
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet-vpn {
                unicast {
                    nexthop-resolution { no-resolution; }
                    extended-nexthop;
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet6 {
                unicast {
                    nexthop-resolution { no-resolution; }
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet6-vpn {
                unicast {
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family evpn {
                signaling {
                    nexthop-resolution { no-resolution; }
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family route-target {
                external-paths 3;
                nexthop-resolution { no-resolution; }
            }
            export PS-VPN-SRV6;
            cluster $RR_CLUSTER_ID;
            $ASBR_NEIGHBOR_LIST;
        }

        precision-timers;
        advertise-inactive;
        log-updown;
        bgp-error-tolerance;
        multipath {
            list-nexthop;
        }
        rfc8950-compliant;
        defaults {
            ebgp {
                no-policy {
                    receive reject-always;
                    advertise reject-always;
                }
            }
        }
    }
}
```

## evo/transport/bgp-transport-class.conf

```
/*
 * Topic:   Per-VRF transport-class definitions — maps service color
 *          values to Flex-Algo transport classes.
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: cr1_mx10004 cr2_mx2010 br2_mx304 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - Body is byte-identical to the Junos sibling.
 *  - Each `name TC-<n> { color <n>; }` defines a transport class keyed
 *    by BGP color community; `auto-create` lets new colors map without
 *    explicit per-color stanzas.
 *  - `flex-algorithm <n> { use-transport-class { inet3-install; } }`
 *    installs the FA-derived SRv6 path into inet.3 so the transport
 *    class can resolve service nexthops over it.
 *  - This is what binds a VPN's color community to a specific
 *    Flex-Algo path (e.g. color 128 -> FA-128 delay-optimized path).
 *
 * Pair with:
 *  - evo/transport/isis-srv6-flex-algo.conf  (defines FAs 128/129)
 *  - evo/services/l3vpn-srv6-vrf.conf        (consumes the TC binding)
 *
 * Variables (example values from cr1_mx10004):
 *   $TC_NAME_LIST        e.g. TC-128 TC-129 TC-131 TC-132 TC-133
 *   $COLOR_LIST          e.g. 128 129 131 132 133
 */

routing-options {
    transport-class {
        auto-create;
        name TC-128 { color 128; }
        name TC-129 { color 129; }
        name TC-131 { color 131; }
        name TC-132 { color 132; }
        name TC-133 { color 133; }
    }
    flex-algorithm 131 {
        use-transport-class {
            inet3-install;
        }
    }
    flex-algorithm 132 {
        use-transport-class {
            inet3-install;
        }
    }
    flex-algorithm 133 {
        use-transport-class {
            inet3-install;
        }
    }
}
```

## evo/transport/inter-as-option-c.conf

```
/*
 * Topic:   Inter-AS Option C between Border Routers (Evolved-OS
 *          variant) — eBGP between BR pairs in different domains
 *          carrying SRv6 service routes. Picks up `<GR-EBGP-*>`
 *          wildcard defaults from `apply-groups GR-BGP`.
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (see snips/junos/transport/inter-as-option-c.conf — minor
 *          syntax differences listed below)
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - eBGP multihop session — `multihop { ttl 255; no-nexthop-change; }`
 *    keeps the original BGP nexthop end-to-end so the SRv6 transport
 *    SID stack survives the AS boundary.
 *  - `family inet6 { unicast { protection; } }` enables fast-reroute
 *    for IPv6 unicast routes used to resolve the eBGP nexthop.
 *  - `advertise-prefix-sid` / `accept-prefix-sid` exchange the
 *    SR Prefix-SID extended community needed for SRv6 service
 *    resolution across domains.
 *  - Group name `GR-EBGP-AS<remote-as>-SRV6` follows the JVD
 *    convention so the wildcard `<GR-EBGP-*>` apply-group catches it.
 *  - `local-address` is set per-neighbor (PTX/EVO supports per-neighbor
 *    local-address; on Junos this lives at the group level).
 *
 * Pair with:
 *  - evo/apply-groups/gr-bgp.conf            (provides EBGP defaults)
 *  - evo/transport/srv6-locator-summarization.conf
 *  - evo/policy/srv6-redistribution-policy.conf
 *
 * Variables (example values from br1_ptx10002-36qdd):
 *   $REMOTE_AS                e.g. 65000
 *   $REMOTE_BR_V6_LOOPBACK    e.g. 2001:db8:beef::3660:60
 *   $LOCAL_BR_V6_LOOPBACK     e.g. 2001:db8:beef::3660:36
 *   $REMOTE_PEER_DESCRIPTION  e.g. PEER-MSE1
 *   $EBGP_EXPORT_POLICY_LIST  e.g. [ PS-EBGP-NHS PS-EBGP-SRV6-EXP ]
 *   $EBGP_IMPORT_POLICY       e.g. PS-EBGP-IMP
 */
protocols {
    bgp {
        group GR-EBGP-AS$REMOTE_AS-SRV6 {
            multihop {
                ttl 255;
                no-nexthop-change;
            }
            import $EBGP_IMPORT_POLICY;
            family inet-vpn {
                unicast {
                    extended-nexthop;
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet6 {
                unicast {
                    protection;
                }
            }
            family inet6-vpn {
                unicast {
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family evpn {
                signaling {
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family route-target {
                nexthop-resolution { no-resolution; }
            }
            export $EBGP_EXPORT_POLICY_LIST;
            peer-as $REMOTE_AS;
            neighbor $REMOTE_BR_V6_LOOPBACK {
                description $REMOTE_PEER_DESCRIPTION;
                local-address $LOCAL_BR_V6_LOOPBACK;
            }
            advertise-prefix-sid;
            accept-prefix-sid;
        }
    }
}
```

## evo/transport/isis-srv6-flex-algo.conf

```
/*
 * Topic:   IS-IS L2 instantiation for SRv6 µSID transport — per-device
 *          NET, locator advertisement, Flex-Algo participation,
 *          TI-LFA backup-SPF, traffic-engineering for SR-TE tunnels.
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - Body is byte-identical to the Junos sibling. PTX/EVO IS-IS
 *    instantiation matches Junos exactly: same `routing-options { flex-
 *    algorithm ... source-packet-routing { srv6 { block ... locator ... }
 *    } }` and `protocols isis { ... }` shape.
 *  - Note: on br1_ptx10002-36qdd, FA-131's `use-transport-class { inactive:
 *    inet3-install; }` is disabled (lab-only) but the structural pattern
 *    is the same.
 *  - `apply-groups GR-ISIS-IPV6` pulls the per-interface SRv6 adjacency
 *    SIDs, ASLA attributes, delay-measurement, and TI-LFA defaults.
 *  - `flex-algorithm [ 128 129 131 132 133 ]` opts this node into all
 *    the Flex-Algos used as transport classes; `no-strict-spf` allows
 *    nodes without the FA to be traversed when no FA path exists.
 *  - `srv6 { locator $LOC micro-node-sid; }` advertises one µN SID per
 *    Flex-Algo locator.
 *  - `wide-metrics-only` + `purge-originator empty` are the IS-IS L2
 *    cleanup defaults; `topologies ipv6-unicast` enables the explicit
 *    IPv6 topology for non-congruent IPv4/IPv6 deployments.
 *  - `backup-spf-options { use-post-convergence-lfa; use-source-packet-routing; }`
 *    pairs with the per-IFL TI-LFA in GR-ISIS-IPV6 and biases backup
 *    paths toward SRv6.
 *  - `traffic-engineering { l3-unicast-topology; tunnel-source-protocol spring-te; }`
 *    feeds the IS-IS topology DB to SR-TE for future SRv6-TE work.
 *  - `overload { advertise-high-metrics; }` keeps high metrics during
 *    boot/restart so traffic drains before re-attracting it.
 *  - `net 49.<region>.0000.0000.<node>.00` follows the addressing
 *    scheme: AS/Region encoded after `49.`, node ID at the end.
 *
 * Pair with:
 *  - evo/policy/srv6-redistribution-policy.conf
 *  - evo/interfaces/core-ae-link.conf
 *  - evo/transport/bgp-transport-class.conf
 *  - evo/transport/ti-lfa-mla.conf
 *  - evo/apply-groups/gr-isis-ipv6.conf       (per-IFL SRv6 + TI-LFA)
 *  - evo/apply-groups/gr-srv6.conf            (locator µSID flavors)
 *  - evo/apply-groups/gr-core-intf-ipv6.conf  (family iso/inet6, MTUs)
 *  - evo/transport/srv6-locator-summarization.conf  (CR-only redistribution)
 *
 * Variables (example values from cr1_mx10004):
 *   $ISIS_IFL_LIST       e.g. xe-0/0/0:0.0 xe-0/0/0:1.0 ...
 *   $LOC_FA_0            e.g. SL-FA-000
 *   $LOC_FA_128          e.g. SL-FA-128
 *   $LOC_FA_129          e.g. SL-FA-129
 *   $FA_LIST             e.g. [ 128 129 ]            (PEs)
 *                          or  [ 128 129 131 132 133 ] (RRs/ASBRs)
 *   $REF_BANDWIDTH       e.g. 1000g
 *   $JUMBO_HELLO_SIZE    e.g. 9106
 *   $ISIS_NET            e.g. 49.1000.0000.0000.0056.00
 *   $OVERLOAD_TIMEOUT    e.g. 60
 *
 * Per-device routing-options for SRv6 locators / blocks lives below
 * (one block + one locator per Flex-Algo + one block + locator per
 * service if non-shared service locators are needed):
 *
 *   $LOC_BLOCK_FA_0      e.g. SB-FA-000
 *   $LOC_BLOCK_PREFIX_0  e.g. 5f00:1::/32
 *   $LOC_PREFIX_0        e.g. 5f00:1:56::/48
 *   $LOC_BLOCK_FA_128    e.g. SB-FA-128
 *   $LOC_BLOCK_PREFIX_128 e.g. 5f00:a1::/32
 *   $LOC_PREFIX_128      e.g. 5f00:a1:56::/48
 *   $LOC_BLOCK_FA_129    e.g. SB-FA-129
 *   $LOC_BLOCK_PREFIX_129 e.g. 5f00:b1::/32
 *   $LOC_PREFIX_129      e.g. 5f00:b1:56::/48
 *   $LOCAL_USID_LIMIT    e.g. 2000
 *   $ROUTER_ID           e.g. 100.0.0.56
 *   $RD_ID               e.g. 100.0.0.56  (used as RD seed)
 *   $LOCAL_AS            e.g. 65001
 *   $IPV6_ROUTER_ID      e.g. 2001:db8:bad:cafe::1000:56
 */

routing-options {
    flex-algorithm 128 {
        definition {
            metric-type delay-metric;
        }
        use-transport-class {
            inet3-install;
        }
    }
    flex-algorithm 129 {
        definition {
            metric-type te-metric;
        }
        use-transport-class {
            inet3-install;
        }
    }
    source-packet-routing {
        srv6 {
            apply-groups GR-SRV6;
            block $LOC_BLOCK_FA_0 {
                $LOC_BLOCK_PREFIX_0;
                local-micro-sid {
                    maximum-static-sids $LOCAL_USID_LIMIT;
                }
            }
            block $LOC_BLOCK_FA_128 {
                $LOC_BLOCK_PREFIX_128;
                local-micro-sid {
                    maximum-static-sids $LOCAL_USID_LIMIT;
                }
            }
            block $LOC_BLOCK_FA_129 {
                $LOC_BLOCK_PREFIX_129;
                local-micro-sid {
                    maximum-static-sids $LOCAL_USID_LIMIT;
                }
            }
            locator $LOC_FA_0 {
                $LOC_PREFIX_0;
                micro-sid {
                    block-name $LOC_BLOCK_FA_0;
                }
            }
            locator $LOC_FA_128 {
                algorithm 128;
                $LOC_PREFIX_128;
                micro-sid {
                    block-name $LOC_BLOCK_FA_128;
                }
            }
            locator $LOC_FA_129 {
                algorithm 129;
                $LOC_PREFIX_129;
                micro-sid {
                    block-name $LOC_BLOCK_FA_129;
                }
            }
        }
    }
    route-distinguisher-id $RD_ID;
    rib inet.3 {
        protect core;
    }
    resolution {
        preserve-nexthop-hierarchy;
    }
    router-id $ROUTER_ID;
    autonomous-system $LOCAL_AS;
    ipv6-router-id $IPV6_ROUTER_ID;
    protect core;
    forwarding-table {
        srv6-chain-merge;
        export PS-LOAD-BALANCE;
    }
}
protocols {
    isis {
        apply-groups GR-ISIS-IPV6;
        /* Repeat one `interface <ifl>;` per core IFL */
        interface $ISIS_IFL_LIST;
        interface lo0.0 {
            passive;
        }
        source-packet-routing {
            flex-algorithm $FA_LIST;
            no-strict-spf;
            srv6 {
                locator $LOC_FA_0 micro-node-sid;
                locator $LOC_FA_128 micro-node-sid;
                locator $LOC_FA_129 micro-node-sid;
            }
        }
        level 1 disable;
        level 2 {
            purge-originator empty;
            wide-metrics-only;
        }
        backup-spf-options {
            use-post-convergence-lfa maximum-backup-paths 2;
            use-source-packet-routing;
        }
        traffic-engineering {
            l3-unicast-topology;
            tunnel-source-protocol {
                spring-te;
            }
            advertisement always;
        }
        reference-bandwidth $REF_BANDWIDTH;
        max-hello-size $JUMBO_HELLO_SIZE;
        suppress-attached-bit;
        no-external-export {
            protocol bgp;
            protocol ospf;
            protocol static;
        }
        topologies ipv6-unicast;
        overload {
            timeout $OVERLOAD_TIMEOUT;
            advertise-high-metrics;
            internal-prefixes;
            external-prefixes;
        }
        net $ISIS_NET;
    }
}
```

## evo/transport/srv6-locator-summarization.conf

```
/*
 * Topic:   SRv6 locator redistribution / summarization at AS boundary —
 *          policy + IS-IS export pattern that lets domain-internal
 *          locators be summarized into the inter-AS BGP table.
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: br2_mx304 cr1_mx10004 cr2_mx2010
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - Body is byte-identical to the Junos sibling. The companion policy
 *    bodies (PS-EBGP-IMP / PS-EBGP-NHS / PS-EBGP-SRV6-EXP / PS-IBGP-SRV6-IMP)
 *    are spelled out in evo/policy/srv6-redistribution-policy.conf.
 *  - At a Border Router, `protocols isis { export PS-SRV6-LOC-EXPORT; }`
 *    leaks the local domain's per-Flex-Algo locator prefixes into BGP
 *    so the far AS can resolve service nexthops via SRv6.
 *  - `policy-options policy-statement PS-SRV6-LOC-EXPORT` filters by
 *    locator block (matched on `from route-filter`) and applies a
 *    summary or per-locator advertisement depending on the inter-AS
 *    design (per the JVD's "strict vs cascade" transport-class
 *    resolution choice).
 *  - At a CR (intra-AS), the same pattern is used to redistribute
 *    summarized far-domain locators learned from the BR back into
 *    IS-IS so internal routers can resolve them with a single LSP entry.
 *
 * Pair with:
 *  - evo/transport/inter-as-option-c.conf        (eBGP carrying these)
 *  - evo/transport/isis-srv6-flex-algo.conf      (locator definitions)
 *  - evo/policy/srv6-redistribution-policy.conf         (the policy bodies)
 *
 * Variables (example values):
 *   $SUMMARY_PREFIX_FA_0   e.g. 5f00:1::/24
 *   $SUMMARY_PREFIX_FA_128 e.g. 5f00:a1::/24
 *   $SUMMARY_PREFIX_FA_129 e.g. 5f00:b1::/24
 */

protocols {
    isis {
        export PS-SRV6-LOC-EXPORT;
    }
    bgp {
        group GR-IBGP-ASBR-SRV6 {
            export PS-SRV6-LOC-EXPORT;
        }
    }
}
policy-options {
    policy-statement PS-SRV6-LOC-EXPORT {
        term TR-SUM-FA-0 {
            from {
                route-filter $SUMMARY_PREFIX_FA_0 exact;
            }
            then accept;
        }
        term TR-SUM-FA-128 {
            from {
                route-filter $SUMMARY_PREFIX_FA_128 exact;
            }
            then accept;
        }
        term TR-SUM-FA-129 {
            from {
                route-filter $SUMMARY_PREFIX_FA_129 exact;
            }
            then accept;
        }
    }
}
```

## evo/transport/ti-lfa-mla.conf

```
/*
 * Topic:   TI-LFA + Micro-Loop Avoidance (MLA) under IS-IS for SRv6
 *          µSID — node and link protection backups computed via SR.
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: cr1_mx10004 cr2_mx2010 br2_mx304 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - Body is byte-identical to the Junos sibling.
 *  - `backup-spf-options { use-post-convergence-lfa; use-source-packet-routing; }`
 *    enables TI-LFA (computes a backup SR path that mirrors the
 *    post-convergence path, avoiding micro-loops by sending the failed
 *    PE the same SID list the network will use after convergence).
 *  - `maximum-backup-paths 2` keeps two backup paths in FIB for
 *    parallel link/node failures.
 *  - The per-IFL `post-convergence-lfa { node-protection cost ... }`
 *    in GR-ISIS-IPV6 elects node protection over link protection when
 *    both are available.
 *  - MLA (micro-loop avoidance) lives under `spf-options` in this JVD
 *    — kept as `inactive:` placeholder ready to enable if the network
 *    sees micro-loop incidents.
 *
 * Pair with:
 *  - evo/apply-groups/gr-isis-ipv6.conf      (per-IFL post-convergence-lfa)
 *  - evo/transport/isis-srv6-flex-algo.conf  (instantiation)
 *
 * Variables (example values from cr1_mx10004):
 *   $MAX_BACKUP_PATHS  e.g. 2
 *   $MLA_DELAY         e.g. 500
 */

protocols {
    isis {
        backup-spf-options {
            use-post-convergence-lfa maximum-backup-paths $MAX_BACKUP_PATHS;
            use-source-packet-routing;
        }
        inactive: spf-options {
            microloop-avoidance {
                post-convergence-path {
                    delay $MLA_DELAY;
                }
            }
            delay 50;
            holddown 2000;
            rapid-runs 5;
        }
    }
}
```

## junos/apply-groups/gr-bgp.conf

```
/*
 * Topic:   Wildcard apply-group: iBGP overlay group defaults for the
 *          SRv6 service plane (TCP-AO authentication, multipath,
 *          tcp-mss for IPv6 + jumbo links).
 * Seen on:
 *   Junos: br2_mx304 cr1_mx10004 cr2_mx2010 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - `<GR-IBGP-*>` matches every iBGP peer-group named GR-IBGP-*; the
 *    actual peer addresses live in the device-level instantiation.
 *  - `authentication-algorithm ao` + `authentication-key-chain KC-BGP`
 *    enables TCP-AO instead of legacy MD5.
 *  - `multipath` permits per-prefix ECMP to multiple PEs/RRs.
 *  - `tcp-mss 4096` matches the 9106-byte L3 MTU on the underlay
 *    (avoids fragmentation on long iBGP updates carrying many SIDs).
 *
 * Pair with:
 *  - junos/apply-groups/gr-isis-ipv6.conf       (transport + family iso)
 *  - junos/transport/bgp-overlay-rr.conf        (RR-side instantiation)
 *  - junos/transport/bgp-overlay-rr-client.conf (PE-side instantiation)
 *
 * Variables: (none — pattern is fixed; peer addresses live in the
 *             instantiating routing-instance)
 */
GR-BGP {
    protocols {
        bgp {
            group <GR-IBGP-*> {
                type internal;
                authentication-algorithm ao;
                authentication-key-chain KC-BGP;
                multipath;
                tcp-mss 4096;
            }
        }
    }
}
```

## junos/apply-groups/gr-core-intf-ipv6.conf

```
/*
 * Topic:   Wildcard apply-group: standard core IPv6 interface settings
 *          (MTU 9192/9106, 9k jumbo, BFD on AE, optics alarms)
 * Seen on:
 *   Junos: br2_mx304 cr1_mx10004 cr2_mx2010 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - `<*>` wildcard applies to every named interface; family iso + inet6
 *    only (this JVD has no IPv4 in the underlay).
 *  - L2 MTU 9192 with L3 family-MTU 9106 leaves 86 B for SRv6 µSID
 *    encapsulation overhead end-to-end.
 *  - `<ae*>` block adds BFD-on-LACP and short LACP hold-up so member
 *    flap doesn't hide a control-plane outage.
 *  - `<[egx][te]-*>` selects 1G/10G/100G/400G optical ports and turns
 *    on low-light alarm/warning.
 *
 * Pair with:
 *  - junos/apply-groups/gr-isis-ipv6.conf
 *  - junos/interfaces/core-ae-link.conf
 *  - junos/oam/bfd-defaults.conf
 *  - junos/interfaces/pe-ce-direct.conf
 *  - junos/transport/isis-srv6-flex-algo.conf  (consumes family inet6 + iso)
 *  - junos/transport/bfd-isis.conf             (per-IFL BFD)
 *
 * Variables (example values from edge1_mx480):
 *   $JUMBO_L2_MTU       e.g. 9192
 *   $JUMBO_L3_MTU       e.g. 9106
 *   $LACP_BFD_INTERVAL  e.g. 50
 *   $LACP_BFD_MULT      e.g. 3
 */
GR-CORE-INTF-IPV6 {
    interfaces {
        <*> {
            description ********GR-CORE-INTF-SETTINGS-APPLIED-ADD-DESCRIPTION********;
            traps;
            mtu $JUMBO_L2_MTU;
            hold-time up 2000 down 0;
            unit 0 {
                traps;
                family iso {
                    mtu $JUMBO_L3_MTU;
                }
                family inet6 {
                    mtu $JUMBO_L3_MTU;
                }
            }
        }
        <ae*> {
            aggregated-ether-options {
                bfd-liveness-detection {
                    version automatic;
                    minimum-interval $LACP_BFD_INTERVAL;
                    multiplier $LACP_BFD_MULT;
                    no-adaptation;
                }
                lacp {
                    active;
                    hold-time up 2;
                }
            }
        }
        "<[egx][te]-*>" {
            optics-options {
                alarm low-light-alarm {
                    link-down;
                }
                warning low-light-warning {
                    syslog;
                }
            }
        }
    }
}
```

## junos/apply-groups/gr-isis-ipv6.conf

```
/*
 * Topic:   Wildcard apply-group: per-interface IS-IS L2 settings for
 *          SRv6 µSID — adjacency-SIDs per Flex-Algo, TI-LFA node
 *          protection, ASLA delay/TE metric, dynamic delay measurement.
 * Seen on:
 *   Junos: br2_mx304 cr1_mx10004 cr2_mx2010 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - `<*e*>` wildcard targets all ethernet IFLs; level 1 disabled
 *    (single-area L2 design).
 *  - One `srv6-adjacency-segment` block per Flex-Algo locator
 *    (FA-0 / FA-128 / FA-129) — gives unprotected µA SIDs that
 *    TI-LFA uses for backup paths.
 *  - `post-convergence-lfa { node-protection cost 16777214; }` enables
 *    TI-LFA node protection with a high tiebreaker cost so the primary
 *    path always wins when both are available.
 *  - `attribute-group LA-FA` advertises both delay and TE metrics in
 *    the IS-IS Application-Specific Link Attribute (ASLA) TLV scoped
 *    to `flex-algorithm`.
 *  - Built-in delay measurement (`probe-interval 1` / `probe-count 10`)
 *    feeds the FA-128 delay-metric advertisements every 30 s.
 *  - `inactive: hello-authentication-key-chain KC-ISIS;` keeps the
 *    knob present but disabled — toggle when key-chain is provisioned.
 *
 * Pair with:
 *  - junos/apply-groups/gr-bgp.conf
 *  - junos/oam/twamp-light.conf
 *  - junos/transport/ti-lfa-mla.conf
 *  - junos/apply-groups/gr-core-intf-ipv6.conf  (provides family iso/inet6)
 *  - junos/apply-groups/gr-srv6.conf            (defines locator µSID flavors)
 *  - junos/transport/isis-srv6-flex-algo.conf   (instantiates this group)
 *  - junos/transport/bfd-isis.conf              (per-AFI BFD on the same IFLs)
 *
 * Variables (example values from edge1_mx480):
 *   $LOC_FA_0           e.g. SL-FA-000
 *   $LOC_FA_128         e.g. SL-FA-128
 *   $LOC_FA_129         e.g. SL-FA-129
 *   $TE_METRIC          e.g. 1000
 *   $DELAY_METRIC       e.g. 1000
 *   $DELAY_PROBE_INT    e.g. 1
 *   $DELAY_PROBE_COUNT  e.g. 10
 *   $DELAY_ADV_THRESH   e.g. 100
 *   $DELAY_ADV_INTERVAL e.g. 30
 *   $JUMBO_HELLO_SIZE   e.g. 9106
 *   $BFD_MIN_INT        e.g. 50
 *   $BFD_MULT           e.g. 3
 */
GR-ISIS-IPV6 {
    protocols {
        isis {
            interface <*e*> {
                level 1 disable;
                level 2 {
                    srv6-adjacency-segment {
                        unprotected {
                            locator $LOC_FA_0 {
                                micro-adjacency-sid;
                            }
                            locator $LOC_FA_128 {
                                micro-adjacency-sid;
                            }
                            locator $LOC_FA_129 {
                                micro-adjacency-sid;
                            }
                        }
                    }
                    post-convergence-lfa {
                        node-protection cost 16777214;
                    }
                    application-specific {
                        attribute-group LA-FA {
                            advertise-delay-metric;
                            te-metric $TE_METRIC;
                            application {
                                flex-algorithm;
                            }
                        }
                    }
                    inactive: hello-authentication-key-chain KC-ISIS;
                }
                delay-metric $DELAY_METRIC;
                delay-measurement {
                    probe-interval $DELAY_PROBE_INT;
                    probe-count $DELAY_PROBE_COUNT;
                    advertisement {
                        periodic {
                            threshold $DELAY_ADV_THRESH;
                            interval $DELAY_ADV_INTERVAL;
                        }
                    }
                }
                hello-padding strict;
                inactive: max-hello-size $JUMBO_HELLO_SIZE;
                point-to-point;
            }
            interface "<[egx][te]-*>" {
                family inet6 {
                    bfd-liveness-detection {
                        minimum-interval $BFD_MIN_INT;
                        multiplier $BFD_MULT;
                        no-adaptation;
                    }
                }
            }
            interface lo0.0 {
                level 1 disable;
                passive;
            }
        }
    }
}
```

## junos/apply-groups/gr-l3vpn.conf

```
/*
 * Topic:   Wildcard apply-group: L3VPN routing-instance defaults
 *          (instance-type vrf, vpn-unequal-cost multipath, table-label).
 * Seen on:
 *   Junos: br2_mx304 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - `<*>` matches every routing-instance defined under the device, so
 *    every VRF picks up these defaults without per-VRF restating.
 *  - `vpn-unequal-cost` lets BGP install unequal-cost multipath inside
 *    the VPN (key for SRv6 transport-class load distribution across
 *    diverse Flex-Algos).
 *  - `vrf-table-label` keeps the per-VRF MPLS-style label allocation
 *    convention even though the data plane is SRv6 (used by some
 *    EVPN Type-5 cases).
 *
 * Pair with:
 *  - junos/services/l3vpn-srv6-vrf.conf        (per-VRF instantiation)
 *  - junos/policy/vpn-import-export-rt.conf    (RT/RD policy)
 *
 * Variables: (none — pattern is fixed)
 */
GR-L3VPN {
    routing-instances {
        <*> {
            instance-type vrf;
            routing-options {
                multipath {
                    vpn-unequal-cost;
                }
            }
            vrf-table-label;
        }
    }
}
```

## junos/apply-groups/gr-srv6.conf

```
/*
 * Topic:   Wildcard apply-group: SRv6 µSID locator default flavors
 *          (PSP / USP / USD).
 * Seen on:
 *   Junos: br2_mx304 cr1_mx10004 cr2_mx2010 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - `<SL-*>` matches every locator named SL-* (the JVD's naming
 *    convention for "SID Locator").
 *  - `psp` (Penultimate Segment Pop), `usp` (Ultimate Segment Pop)
 *    and `usd` (Ultimate SID Decap) flavors are enabled for every
 *    locator so endpoint behavior is consistent across Flex-Algos.
 *  - Pairs with the per-locator `block SB-* { 5fXX:YY::/32; ... }`
 *    definitions in the device-level `routing-options` stanza.
 *
 * Pair with:
 *  - junos/transport/isis-srv6-flex-algo.conf  (locator + block defs)
 *  - junos/apply-groups/gr-isis-ipv6.conf      (advertises µN/µA SIDs)
 *
 * Variables: (none — pattern is fixed)
 */
GR-SRV6 {
    routing-options {
        source-packet-routing {
            srv6 {
                locator <SL-*> {
                    micro-sid {
                        flavor {
                            psp;
                            usp;
                            usd;
                        }
                    }
                }
            }
        }
    }
}
```

## junos/interfaces/core-ae-link.conf

```
/*
 * Topic:   Core AE link template — flexible-vlan-tagging trunk
 *          between PE/CR/BR with per-VLAN IS-IS-bearing units.
 * Seen on:
 *   Junos: br2_mx304 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - `apply-groups GR-CORE-INTF-IPV6` provides the AE bundle's BFD,
 *    LACP timers, jumbo MTU; this snippet only adds the per-AE
 *    `aggregated-ether-options { minimum-links 1; }` and the
 *    per-VLAN `unit` blocks that carry `family iso` + `family inet6`.
 *  - One `unit <vlan>` per neighbor; jumbo MTU 9106 from the apply-
 *    group propagates to each unit's family-MTU.
 *  - `description CORE-TO-<peer>` is required convention for telemetry
 *    correlation.
 *  - Member links go in the physical `xe-*` / `et-*` interface
 *    stanza with `gigether-options { 802.3ad ae<n>; }`.
 *
 * Pair with:
 *  - junos/apply-groups/gr-core-intf-ipv6.conf  (BFD, LACP, MTU)
 *  - junos/transport/isis-srv6-flex-algo.conf   (lists this IFL)
 *
 * Variables (example values):
 *   $AE_NUMBER          e.g. 0
 *   $PEER_HOSTNAME      e.g. CR1
 *   $UNIT               e.g. 10
 *   $VLAN               e.g. 10
 *   $LOCAL_V6           e.g. 2001:db8:bad:cafe:48:56::1/127
 *   $MEMBER_PORT_LIST   e.g. xe-2/0/0 xe-2/0/1
 */
interfaces {
    $MEMBER_PORT_LIST {
        gigether-options {
            802.3ad ae$AE_NUMBER;
        }
    }
    ae$AE_NUMBER {
        description CORE-TO-$PEER_HOSTNAME;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            minimum-links 1;
        }
        unit $UNIT {
            description TO-$PEER_HOSTNAME-VLAN-$VLAN;
            vlan-id $VLAN;
            family iso;
            family inet6 {
                address $LOCAL_V6;
            }
        }
    }
}
```

## junos/interfaces/cpe-attachment.conf

```
/*
 * Topic:   CPE attachment — flexible-vlan trunk with per-service units
 *          (L3VPN sub-IFL, EVPN-VPWS AC w/ ESI, IRB AC).
 * Seen on:
 *   Junos: edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *
 * Highlights:
 *  - Single `flexible-vlan-tagging` + `encapsulation
 *    flexible-ethernet-services` IFL hosts every service type:
 *      • Plain L3 sub-IFL (`vlan-id` + `family inet`/`inet6`)
 *      • EVPN-VPWS AC (`encapsulation vlan-ccc` + `esi { ...; <mode> }`)
 *      • EVPN bridge AC (`encapsulation vlan-bridge` + `family bridge`)
 *  - For multi-homed CEs, two PEs share the same `esi { <esi>;
 *    all-active|single-active }` value on their respective AC units.
 *  - ESI byte 9 byte encodes the local PE; bytes 10 encodes the
 *    service ID — per JVD convention.
 *
 * Pair with:
 *  - junos/services/evpn-vpws-srv6.conf  (consumes the AC unit)
 *  - junos/interfaces/pe-ce-direct.conf    (consumes the L3 sub-IFL)
 *  - junos/interfaces/pe-ce-irb.conf       (consumes the bridge AC)
 *
 * Variables (example values from mse2_mx304):
 *   $PHYS_IFL          e.g. ae2
 *   $L3_UNIT           e.g. 10
 *   $L3_VLAN           e.g. 10
 *   $L3_V6             e.g. 2020:0:0:1::1/126
 *   $VPWS_UNIT         e.g. 1001
 *   $VPWS_VLAN         e.g. 1001
 *   $ESI_BYTES         e.g. 00:11:11:11:11:11:11:11:18:d1
 *   $ESI_MODE          e.g. single-active   (or all-active)
 *   $BRIDGE_UNIT       e.g. 601
 *   $BRIDGE_VLAN       e.g. 601
 */
interfaces {
    $PHYS_IFL {
        description TO-CPE;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;

        /* Plain L3VPN sub-IFL */
        unit $L3_UNIT {
            vlan-id $L3_VLAN;
            family iso;
            family inet6 {
                address $L3_V6;
            }
        }

        /* EVPN-VPWS attachment circuit */
        unit $VPWS_UNIT {
            description EVPN-VPWS-AC;
            encapsulation vlan-ccc;
            vlan-id $VPWS_VLAN;
            esi {
                $ESI_BYTES;
                $ESI_MODE;
            }
        }

        /* EVPN bridge AC for IRB-stitched L3VPN */
        unit $BRIDGE_UNIT {
            encapsulation vlan-bridge;
            vlan-id $BRIDGE_VLAN;
            family bridge;
        }
    }
}
```

## junos/interfaces/pe-ce-direct.conf

```
/*
 * Topic:   PE-CE direct (sub-)interface attachment — IFL on physical
 *          interface placed inside an L3VPN VRF.
 * Seen on:
 *   Junos: edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - One sub-IFL per VRF, dot1q-tagged via `vlan-id $VLAN`; family
 *    inet + inet6 carry both AFIs across the same PE-CE link.
 *  - `family iso { mtu $JUMBO_L3_MTU; }` is omitted on PE-CE units
 *    (no IS-IS toward the customer).
 *  - The matching loopback unit (`lo0.<unit>`) gives the VRF a
 *    routable router-id and a stable inet/inet6 address for BGP
 *    `local-address`.
 *
 * Pair with:
 *  - junos/interfaces/cpe-attachment.conf
 *  - junos/interfaces/pe-ce-irb.conf
 *  - junos/services/l3vpn-srv6-vrf.conf     (consumes this IFL)
 *  - junos/apply-groups/gr-core-intf-ipv6.conf (suppressed by `<*>`
 *      pattern but the platform-side defaults still apply)
 *
 * JVD service mapping:
 *   (no instances found in topology registry)
 *
 * Variables (example values from mse1_mx480):
 *   $PHYS_IFL          e.g. xe-2/0/2
 *   $VRF_UNIT          e.g. 501
 *   $VLAN              e.g. 501
 *   $PE_CE_V4_LOCAL    e.g. 13.1.8.1/30
 *   $PE_CE_V6_LOCAL    e.g. 2013:1:8::1/126
 *   $LOOPBACK_V4       e.g. 195.168.8.1/32
 *   $LOOPBACK_V6       e.g. 2195:168:8::1/128
 */
interfaces {
    $PHYS_IFL {
        vlan-tagging;
        unit $VRF_UNIT {
            vlan-id $VLAN;
            family inet {
                address $PE_CE_V4_LOCAL;
            }
            family inet6 {
                address $PE_CE_V6_LOCAL;
            }
        }
    }
    lo0 {
        unit $VRF_UNIT {
            family inet {
                address $LOOPBACK_V4;
            }
            family inet6 {
                address $LOOPBACK_V6;
            }
        }
    }
}
```

## junos/interfaces/pe-ce-irb.conf

```
/*
 * Topic:   PE-CE attachment via IRB — bridge-domain on the AC stitched
 *          to an IRB unit placed inside the L3VPN VRF.
 * Seen on:
 *   Junos: edge1_mx480 edge2_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - The customer-facing IFL uses `encapsulation flexible-ethernet-services`
 *    with the per-VLAN `unit` carrying `family bridge`; the L3 SVI
 *    lives on `irb.<unit>` and is placed in the VRF.
 *  - `bridge-domains BD-<id> { vlan-id <id>; routing-interface irb.<id>; }`
 *    binds the AC unit to the IRB.
 *  - The IRB's `family inet`/`inet6` provides the gateway address for
 *    CE hosts.
 *  - Used when a CPE bridges multiple physical ports into one VLAN
 *    that needs a single L3 gateway in the L3VPN.
 *
 * Pair with:
 *  - junos/interfaces/cpe-attachment.conf
 *  - junos/services/l3vpn-srv6-vrf.conf     (places irb.X in VRF)
 *  - junos/interfaces/pe-ce-direct.conf       (alternative w/o bridging)
 *
 * JVD service mapping:
 *   (no instances found in topology registry)
 *
 * Variables (example values from mse1_mx480):
 *   $PHYS_IFL        e.g. xe-2/0/3
 *   $BD_UNIT         e.g. 601
 *   $VLAN            e.g. 601
 *   $IRB_V4          e.g. 10.104.8.1/30
 *   $IRB_V6          e.g. 2010:104:8::1/126
 */
interfaces {
    $PHYS_IFL {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        unit $BD_UNIT {
            encapsulation vlan-bridge;
            vlan-id $VLAN;
            family bridge;
        }
    }
    irb {
        unit $BD_UNIT {
            family inet {
                address $IRB_V4;
            }
            family inet6 {
                address $IRB_V6;
            }
        }
    }
}
bridge-domains {
    BD-$BD_UNIT {
        vlan-id $VLAN;
        routing-interface irb.$BD_UNIT;
    }
}
```

## junos/oam/bfd-defaults.conf

```
/*
 * Topic:   Default BFD timers and detection profile — the canonical
 *          values used across BFDv6 / BFD-on-LACP / BFD-on-BGP in
 *          this JVD.
 * Seen on:
 *   Junos: cr1_mx10004 cr2_mx2010 br2_mx304 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - `minimum-interval 50 multiplier 3` -> ~150 ms detect; the JVD's
 *    standard for core links.
 *  - `no-adaptation` prevents Junos from auto-relaxing timers under
 *    perceived congestion (we want strict detection).
 *  - The same triplet shows up in three places:
 *      • Per-IFL IS-IS BFD (transport/bfd-isis.conf)
 *      • BFD-on-LACP under <ae*> (apply-groups/gr-core-intf-ipv6.conf)
 *      • Optional BGP `bfd-liveness-detection` block (peer level)
 *
 * Pair with:
 *  - junos/transport/bfd-isis.conf
 *  - junos/apply-groups/gr-core-intf-ipv6.conf
 *
 * Variables (example values from edge1_mx480):
 *   $BFD_MIN_INT  e.g. 50
 *   $BFD_MULT     e.g. 3
 */
/*
 * Reference defaults snippet — drop into any block that takes a
 * `bfd-liveness-detection { ... }` stanza (BGP neighbor, IS-IS family,
 * static route, AE bundle, etc.).
 */
bfd-liveness-detection {
    minimum-interval $BFD_MIN_INT;
    multiplier $BFD_MULT;
    no-adaptation;
}
```

## junos/oam/twamp-light.conf

```
/*
 * Topic:   TWAMP-Light responder — receive-only TWAMP-Light server for
 *          on-demand link/path delay measurements.
 * Seen on:
 *   Junos: br2_mx304 cr1_mx10004 cr2_mx2010 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - `services rpm twamp server { authentication-mode none; light; }`
 *    enables the TWAMP-Light responder (UDP, no control session
 *    setup) — used by the IS-IS dynamic delay-measurement on remote
 *    nodes and by external SLA probes.
 *  - `authentication-mode none` is appropriate inside a trusted core
 *    domain; switch to `hmac-sha-256` when crossing administrative
 *    boundaries.
 *  - No client/sender stanza — measurement is unidirectional from any
 *    sender that knows this responder's loopback.
 *
 * Pair with:
 *  - junos/apply-groups/gr-isis-ipv6.conf       (consumes results
 *      via `delay-measurement` on each IFL)
 *
 * Variables: (none — pattern is fixed)
 */
services {
    rpm {
        twamp {
            server {
                authentication-mode none;
                light;
            }
        }
    }
}
```

## junos/policy/srv6-redistribution-policy.conf

```
/*
 * Topic:   Per-packet load-balancing across SRv6 µSID equal-cost
 *          paths — applied as a forwarding-table export policy.
 * Seen on:
 *   Junos: br2_mx304 cr1_mx10004 cr2_mx2010 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - `policy-statement PS-LOAD-BALANCE { then { load-balance per-packet; } }`
 *    is the canonical "per-flow" load-balance policy (the term
 *    "per-packet" is a Junos misnomer — actual behavior is per-flow
 *    hash).
 *  - Applied via `routing-options { forwarding-table { export
 *    PS-LOAD-BALANCE; srv6-chain-merge; } }` (see
 *    isis-srv6-flex-algo.conf for the instantiation).
 *  - `srv6-chain-merge` collapses multi-segment SID lists into a
 *    single forwarding entry where possible — reduces FIB size on
 *    large topologies.
 *
 * Pair with:
 *  - junos/transport/bgp-overlay-rr.conf
 *  - junos/transport/inter-as-option-c.conf
 *  - junos/transport/srv6-locator-summarization.conf
 *  - junos/transport/isis-srv6-flex-algo.conf  (forwarding-table export)
 *
 * Variables: (none — pattern is fixed)
 */
policy-options {
    policy-statement PS-LOAD-BALANCE {
        then {
            load-balance per-packet;
        }
    }
}
```

## junos/policy/vpn-import-export-rt.conf

```
/*
 * Topic:   VRF route-target import/export policy + RT-SRV6 community
 *          scoping — used by RRs to filter L3VPN routes to the
 *          SRv6-only set.
 * Seen on:
 *   Junos: cr1_mx10004 cr2_mx2010 br2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - `community RT-SRV6 members target:$LOCAL_AS:*` matches every
 *    extended-community in the SRv6 RT range; combined with
 *    `term TR-L3VPN-SRV6 { from rib bgp.l3vpn.0; community RT-SRV6;
 *    then accept; }` it accepts only SRv6 L3VPN routes for re-
 *    advertisement.
 *  - `term TR-L3VPN-MPLS { from rib bgp.l3vpn.0; then reject; }` drops
 *    legacy MPLS L3VPN routes that the BR may also see.
 *  - Per-VRF `vrf-target target:$LOCAL_AS:$VPN_ID` lives in the VRF
 *    stanza (see l3vpn-srv6-vrf.conf) — symmetric import/export.
 *
 * Pair with:
 *  - junos/apply-groups/gr-l3vpn.conf
 *  - junos/transport/bgp-overlay-rr.conf       (applies PS-VPN-SRV6)
 *  - junos/services/l3vpn-srv6-vrf.conf        (defines per-VRF RTs)
 *
 * Variables (example values from cr1_mx10004):
 *   $LOCAL_AS         e.g. 65001
 */
policy-options {
    policy-statement PS-VPN-SRV6 {
        term TR-L3VPN-SRV6 {
            from {
                rib bgp.l3vpn.0;
                community RT-SRV6;
            }
            then accept;
        }
        term TR-L3VPN-MPLS {
            from rib bgp.l3vpn.0;
            then reject;
        }
    }
    community RT-SRV6 members target:$LOCAL_AS:*;
}
```

## junos/services/cpe-virtual-router.conf

```
/*
 * Topic:   CPE-side virtual-router — eBGP toward PE(s) for L3VPN
 *          service traffic forwarding.
 * Seen on:
 *   Junos: cpe2_mx240 cpe4_mx240
 *
 * Highlights:
 *  - `instance-type virtual-router` — lightweight L3 partitioning
 *    without VPN label/SID machinery (that lives on the PE side).
 *  - One or two eBGP groups toward upstream PEs; each group has
 *    `export EXPORT-TO-EBGP` to redistribute connected/static routes.
 *  - Dual-stack: `family inet { any; }` + `family inet6 { any; }`.
 *  - No `route-distinguisher` or `vrf-target` — this is not an MPLS/
 *    SRv6 VRF; it's plain IP routing confined to its own table.
 *  - Appears in two flavors:
 *      • Multi-homed (cpe2): 2 BGP groups (TO-AN2, TO-AN3) toward
 *        two edge PEs.
 *      • Single-homed EVPN-T5 variant (cpe2): 1 BGP group (TO-AN3)
 *        toward one PE — the PE originates EVPN Type-5 for these
 *        prefixes (see l3vpn-evpn-t5-srv6.conf).
 *  - cpe4 peers with MSE PEs (groups TO-MSE1, TO-MSE2).
 *
 * Pair with:
 *  - junos/services/l3vpn-srv6-vrf.conf       (PE-side VRF counterpart)
 *  - junos/services/l3vpn-evpn-t5-srv6.conf   (PE-side EVPN-T5 VRF)
 *  - junos/interfaces/cpe-attachment.conf     (physical trunk)
 *
 * JVD service mapping:
 *   1012 instances on cpe2_mx240, 12 on cpe4_mx240.
 *   Breakdown:
 *     VR-L3VPN-DYN-FA{000,128,129}-1         (3 × multi-homed, 2 BGP groups)
 *     VR-L3VPN-IRB-DYN-FA{000,128,129}-1     (3 × IRB variant)
 *     VR-L3VPN-IRB-STATIC-FA{000,128,129}-1  (3 × static SID)
 *     VR-L3VPN-STATIC-FA{000,128,129}-1      (3 × static SID)
 *     VR-L3VPN-EVPN-T5-SH-DYN-FA000-{1..1000} (1000 × single-homed)
 *   Example: VR-L3VPN-DYN-FA000-1
 *     cpe2_mx240: BGP to AN2 (13.1.2.1) + AN3 (13.1.3.1)
 *     cpe4_mx240: BGP to MSE1 (13.1.8.1) + MSE2 (13.1.9.1)
 *
 * Variables (example values from cpe4_mx240):
 *   $VR_NAME           e.g. VR-L3VPN-DYN-FA000-1
 *   $PE1_GROUP         e.g. TO-MSE1
 *   $PE1_LOCAL_ADDR    e.g. 13.1.8.2
 *   $PE1_PEER_AS       e.g. 65000
 *   $LOCAL_AS          e.g. 65003
 *   $PE1_NEIGHBOR      e.g. 13.1.8.1
 *   $PE2_GROUP         e.g. TO-MSE2  (omit for single-homed)
 *   $PE2_LOCAL_ADDR    e.g. 13.1.9.2
 *   $PE2_NEIGHBOR      e.g. 13.1.9.1
 *   $ATTACH_IFL_1      e.g. xe-1/0/8.501
 *   $ATTACH_IFL_2      e.g. xe-1/0/10.501
 */
routing-instances {
    $VR_NAME {
        instance-type virtual-router;
        protocols {
            bgp {
                group $PE1_GROUP {
                    local-address $PE1_LOCAL_ADDR;
                    family inet {
                        any;
                    }
                    family inet6 {
                        any;
                    }
                    export EXPORT-TO-EBGP;
                    peer-as $PE1_PEER_AS;
                    local-as $LOCAL_AS;
                    neighbor $PE1_NEIGHBOR;
                }
                /* Second group — omit for single-homed EVPN-T5 CPEs */
                group $PE2_GROUP {
                    local-address $PE2_LOCAL_ADDR;
                    family inet {
                        any;
                    }
                    family inet6 {
                        any;
                    }
                    export EXPORT-TO-EBGP;
                    peer-as $PE1_PEER_AS;
                    local-as $LOCAL_AS;
                    neighbor $PE2_NEIGHBOR;
                }
            }
        }
        interface $ATTACH_IFL_1;
        interface $ATTACH_IFL_2;
    }
}
```

## junos/services/evpn-vpws-srv6.conf

```
/*
 * Topic:   EVPN-VPWS over SRv6 — per-instance pseudowire with locator
 *          binding (single-active and all-active variants).
 * Seen on:
 *   Junos: edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - `instance-type evpn-vpws` + `protocols evpn { encapsulation srv6; }`
 *    is the SRv6-data-plane EVPN-VPWS shape (RFC-9747).
 *  - `vpws-service-id { local 1; remote 2; source-packet-routing { srv6
 *    locator $LOC; } }` advertises per-instance SIDs derived from the
 *    chosen Flex-Algo locator.
 *  - `interface aeX.<unit>` is the attachment circuit; the same AE
 *    supports many EVPN-VPWS PWs by `unit`/VLAN.
 *  - For all-active multi-homing, the AC's `unit` carries an `esi {
 *    <esi>; all-active; }` block; for single-active swap to
 *    `single-active`. (See snips/junos/interfaces/cpe-attachment.conf.)
 *  - `route-distinguisher $RD_SEED:$VPN_ID` and
 *    `vrf-target target:$LOCAL_AS:$VPN_ID` follow the same numbering
 *    scheme as L3VPN (offset 3000 in this JVD reserves the EVPN-VPWS
 *    range).
 *
 * Pair with:
 *  - junos/services/l3vpn-srv6-vrf.conf         (peer service shape)
 *  - junos/interfaces/cpe-attachment.conf       (ESI / AC config)
 *  - junos/transport/bgp-overlay-rr-client.conf (carries the routes)
 *
 * JVD service mapping:
 *   4000 instances total (high 4000 / med 0 / low 0)
 *   On devices: edge2_mx480 (4000), edge3_mx480 (4000), mse1_mx480 (4000), mse2_mx304 (4000), edge1_mx480 (3300)
 *   Example: EVPN-VPWS-AA-DYN-FA000-1 (RD 100.0.6.48:3001, RT target:65001:3001)
 *     edge1_mx480  ae2.1001 00:11:11:11:11:11:11:11:11:01 A-A
 *     edge2_mx480  ae2.1001 00:11:11:11:11:11:11:11:11:01 A-A
 *     edge3_mx480  ae2.1001 00:11:11:11:11:11:11:11:11:01 A-A
 *     mse1_mx480  ae2.1001 00:22:22:22:22:22:22:22:22:01 A-A
 *     (+1 more endpoints)
 *
 * Variables (example values from edge1_mx480):
 *   $VPWS_NAME         e.g. EVPN-VPWS-AA-DYN-FA000-1
 *   $AC_IFL            e.g. ae2.1001
 *   $LOC               e.g. SL-FA-000
 *   $LOCAL_VPWS_ID     e.g. 1
 *   $REMOTE_VPWS_ID    e.g. 2
 *   $RD_SEED           e.g. 100.0.6.48
 *   $VPN_ID            e.g. 3001
 *   $LOCAL_AS          e.g. 65001
 */
routing-instances {
    $VPWS_NAME {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface $AC_IFL {
                    vpws-service-id {
                        local $LOCAL_VPWS_ID;
                        remote $REMOTE_VPWS_ID;
                        source-packet-routing {
                            srv6 locator $LOC;
                        }
                    }
                }
                encapsulation srv6;
            }
        }
        interface $AC_IFL;
        route-distinguisher $RD_SEED:$VPN_ID;
        vrf-target target:$LOCAL_AS:$VPN_ID;
    }
}
```

## junos/services/l3vpn-evpn-t5-srv6.conf

```
/*
 * Topic:   L3VPN EVPN Type-5 (IP-prefix routes) over SRv6 — silent-host
 *          VRF using EVPN for PE-PE route distribution instead of BGP
 *          PE-CE sessions.
 * Seen on:
 *   Junos: edge1_mx480 edge2_mx480 edge3_mx480
 *
 * Highlights:
 *  - `apply-groups GR-L3VPN` pulls in `instance-type vrf`,
 *    `vpn-unequal-cost` multipath, and `vrf-table-label` — same as
 *    the PE-CE BGP L3VPN (l3vpn-srv6-vrf.conf).
 *  - Uses `protocols { evpn { ip-prefix-routes { ... } } }` instead of
 *    `protocols { bgp { group TO-CE ... } }` — no PE-CE eBGP session;
 *    prefixes are advertised as EVPN Type-5 routes.
 *  - `advertise direct-nexthop` enables direct PE nexthop (no recursive
 *    resolution through underlay).
 *  - `encapsulation srv6` signals SRv6 transport to remote PEs.
 *  - `source-packet-routing { srv6 { locator $LOC { micro-dt46-sid; } } }`
 *    binds the VRF SID to a Flex-Algo locator.
 *  - The CE-facing interface carries directly-connected prefixes that
 *    the PE originates as Type-5 routes into EVPN.
 *  - "SH" in the instance name = "Silent Host" — the CE side does not
 *    run a routing protocol; it simply uses the PE as default gateway.
 *
 * Pair with:
 *  - junos/services/l3vpn-srv6-vrf.conf       (PE-CE BGP alternative)
 *  - junos/services/cpe-virtual-router.conf   (CPE-side VR counterpart)
 *  - junos/interfaces/pe-ce-direct.conf       (CE-facing IFL)
 *  - junos/apply-groups/gr-l3vpn.conf         (provides defaults)
 *  - junos/transport/bgp-overlay-rr-client.conf
 *
 * JVD service mapping:
 *   1000 instances per PE (edge1/2/3), all on FA-000 locator.
 *   Example: L3VPN-EVPN-T5-SH-DYN-FA000-1
 *     edge1_mx480  et-0/0/14.1001, lo0.1001
 *     RD 100.0.6.48:1001, RT target:65001:1001
 *
 * Variables (example values from edge1_mx480):
 *   $VRF_NAME          e.g. L3VPN-EVPN-T5-SH-DYN-FA000-1
 *   $LOC               e.g. SL-FA-000
 *   $ATTACH_IFL        e.g. et-0/0/14.1001
 *   $LOOPBACK_IFL      e.g. lo0.1001
 *   $RD_SEED           e.g. 100.0.6.48
 *   $VPN_ID            e.g. 1001
 *   $RT_AS             e.g. 65001
 */
routing-instances {
    $VRF_NAME {
        apply-groups GR-L3VPN;
        protocols {
            evpn {
                ip-prefix-routes {
                    advertise direct-nexthop;
                    encapsulation srv6;
                    source-packet-routing {
                        srv6 {
                            locator $LOC {
                                micro-dt46-sid;
                            }
                        }
                    }
                }
            }
        }
        interface $ATTACH_IFL;
        interface $LOOPBACK_IFL;
        route-distinguisher $RD_SEED:$VPN_ID;
        vrf-target target:$RT_AS:$VPN_ID;
    }
}
```

## junos/services/l3vpn-srv6-vrf.conf

```
/*
 * Topic:   L3VPN routing-instance over SRv6 — per-Flex-Algo VRF with
 *          PE-CE eBGP and µDT46 SID for end-to-end IPv4+IPv6 carriage.
 * Seen on:
 *   Junos: br2_mx304 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - `apply-groups GR-L3VPN` pulls in `instance-type vrf`,
 *    `vpn-unequal-cost` multipath, and `vrf-table-label`.
 *  - `source-packet-routing { srv6 { locator $LOC { micro-dt46-sid; } } }`
 *    binds this VRF's service SID to the chosen Flex-Algo locator —
 *    swap `$LOC` between SL-FA-000 / SL-FA-128 / SL-FA-129 to pick the
 *    transport class (default / delay / TE).
 *  - `vrf-target target:$AS:$VPN_ID` sets both import and export RTs;
 *    matched by the RR's RTC filter.
 *  - PE-CE eBGP carries both `family inet` and `family inet6` (single
 *    session, both AFIs); `as-override` is enabled when the same
 *    customer ASN is reused at multiple sites.
 *  - `route-distinguisher $RD_SEED:$VPN_ID` follows the convention
 *    "<PE-loopback-decimal>:<service-id>".
 *  - VRF can carry a directly-attached `interface xe-X/Y/Z.<unit>`
 *    (PE-CE direct routing) or an `interface irb.<unit>` for an EVPN
 *    bridge-domain stitched to L3 (see pe-ce-irb.conf).
 *
 * Pair with:
 *  - junos/services/evpn-vpws-srv6.conf
 *  - junos/transport/bgp-overlay-rr-client.conf
 *  - junos/apply-groups/gr-l3vpn.conf           (provides defaults)
 *  - junos/interfaces/pe-ce-direct.conf           (xe-*.<unit> attachment)
 *  - junos/interfaces/pe-ce-irb.conf              (IRB attachment)
 *  - junos/policy/vpn-import-export-rt.conf     (RT-SRV6, RT scoping)
 *  - junos/transport/bgp-transport-class.conf   (color->FA binding)
 *
 * JVD service mapping:
 *   1012 instances total (high 1 / med 1011 / low 0)
 *   On devices: edge1_mx480 (1012), edge2_mx480 (1012), edge3_mx480 (1012), br1_ptx10002-36qdd (12), br2_mx304 (12), mse1_mx480 (12), +1 more
 *   Example: L3VPN-DYN-FA000-1 (RD 100.0.0.36:501, RT target:65001:501)
 *     br1_ptx10002-36qdd  et-0/0/12:2.501
 *     br2_mx304  xe-0/0/3:0.501
 *     edge1_mx480  et-0/0/14.501
 *     edge2_mx480  xe-1/0/2.501
 *     (+3 more endpoints)
 *
 * Variables (example values from mse1_mx480):
 *   $VRF_NAME          e.g. L3VPN-DYN-FA000-1
 *   $LOC               e.g. SL-FA-000  (FA-128 for delay, FA-129 for TE)
 *   $VRF_ROUTER_ID     e.g. 195.168.8.1
 *   $RD_SEED           e.g. 200.0.0.60
 *   $VPN_ID            e.g. 501
 *   $RT_AS             e.g. 65001  (route-target AS — may differ from local-as)
 *   $LOCAL_AS          e.g. 65000
 *   $CE_AS             e.g. 65003
 *   $PE_CE_LOCAL_V4    e.g. 13.1.8.1
 *   $PE_CE_NEIGHBOR_V4 e.g. 13.1.8.2
 *   $ATTACH_IFL        e.g. xe-2/0/2.501
 *   $LOOPBACK_IFL      e.g. lo0.501
 */
routing-instances {
    $VRF_NAME {
        apply-groups GR-L3VPN;
        routing-options {
            router-id $VRF_ROUTER_ID;
            protect core;
        }
        protocols {
            bgp {
                group TO-CE {
                    type external;
                    local-address $PE_CE_LOCAL_V4;
                    family inet { any; }
                    family inet6 { any; }
                    peer-as $CE_AS;
                    local-as $LOCAL_AS;
                    as-override;
                    neighbor $PE_CE_NEIGHBOR_V4;
                }
                source-packet-routing {
                    srv6 {
                        locator $LOC {
                            micro-dt46-sid;
                        }
                    }
                }
            }
        }
        interface $ATTACH_IFL;
        interface $LOOPBACK_IFL;
        route-distinguisher $RD_SEED:$VPN_ID;
        vrf-target target:$RT_AS:$VPN_ID;
    }
}
```

## junos/transport/bfd-isis.conf

```
/*
 * Topic:   Per-IFL BFDv6 configuration for IS-IS adjacencies — fast
 *          convergence on core links.
 * Seen on:
 *   Junos: br2_mx304 cr1_mx10004 cr2_mx2010 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - BFD is enabled per AFI under each IS-IS interface (here `family inet6`)
 *    rather than as a global protocol — fits the JVD's IPv6-only
 *    underlay.
 *  - `minimum-interval 50` + `multiplier 3` gives ~150 ms detection;
 *    `no-adaptation` keeps timers fixed regardless of negotiated rate.
 *  - On AE bundles BFD-on-LACP runs in addition (see `gr-core-intf-ipv6`):
 *    member-level BFD catches single-link failures inside the bundle.
 *
 * Pair with:
 *  - junos/oam/bfd-defaults.conf
 *  - junos/apply-groups/gr-isis-ipv6.conf       (provides this snippet)
 *  - junos/apply-groups/gr-core-intf-ipv6.conf  (BFD-over-LACP on AE)
 *
 * Variables (example values from edge1_mx480):
 *   $BFD_MIN_INT  e.g. 50
 *   $BFD_MULT     e.g. 3
 */
protocols {
    isis {
        interface "<[egx][te]-*>" {
            family inet6 {
                bfd-liveness-detection {
                    minimum-interval $BFD_MIN_INT;
                    multiplier $BFD_MULT;
                    no-adaptation;
                }
            }
        }
    }
}
```

## junos/transport/bgp-overlay-rr-client.conf

```
/*
 * Topic:   PE-side iBGP overlay configuration toward route-reflectors
 *          for SRv6 service signaling — single peer-group with all
 *          relevant SAFIs and a default per-VRF service locator.
 * Seen on:
 *   Junos: br2_mx304 cr1_mx10004 cr2_mx2010 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - Single `group GR-IBGP-TO-RR-SRV6` with two `neighbor` blocks (one
 *    per RR) — picks up TCP-AO / multipath / tcp-mss from `apply-groups
 *    GR-BGP`.
 *  - All multi-AFI families enabled with `advertise-srv6-service` /
 *    `accept-srv6-service`; `extended-nexthop` allows v4 prefixes to
 *    resolve via v6 nexthops over the SRv6 underlay.
 *  - PE does NOT set `cluster` (only RRs do).
 *  - `family route-target { nexthop-resolution { no-resolution; } }`
 *    enables RTC client side; PE will only receive VPN routes
 *    matching its imported route-targets.
 *  - `source-packet-routing { srv6 { locator $LOC micro-dt46-sid; } }`
 *    is the PE-default service-SID flavor (per-VRF DT46 — supports
 *    both v4 and v6 inside the VPN). Per-VRF `routing-instances`
 *    can override (e.g. some VRFs use micro-dt6-sid only).
 *
 * Pair with:
 *  - junos/services/evpn-vpws-srv6.conf
 *  - junos/apply-groups/gr-bgp.conf            (TCP-AO, multipath, MSS)
 *  - junos/transport/bgp-overlay-rr.conf       (RR-side counterpart)
 *  - junos/services/l3vpn-srv6-vrf.conf        (per-VRF locator overrides)
 *
 * Variables (example values from edge1_mx480):
 *   $PE_LOCAL_V6        e.g. 2001:db8:bad:cafe::1006:48
 *   $RR1_V6             e.g. 2001:db8:bad:cafe::1000:31
 *   $RR2_V6             e.g. 2001:db8:bad:cafe::1000:56
 *   $DEFAULT_SVC_LOC    e.g. SL-FA-000
 */
protocols {
    bgp {
        apply-groups GR-BGP;
        path-selection external-router-id;
        advertise-from-main-vpn-tables;
        vpn-apply-export;
        group GR-IBGP-TO-RR-SRV6 {
            local-address $PE_LOCAL_V6;
            family inet {
                unicast {
                    extended-nexthop;
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet-vpn {
                unicast {
                    extended-nexthop;
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet6 {
                unicast {
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet6-vpn {
                unicast {
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family evpn {
                signaling {
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family route-target {
                nexthop-resolution { no-resolution; }
            }
            neighbor $RR1_V6 {
                description RR1;
            }
            neighbor $RR2_V6 {
                description RR2;
            }
        }
        source-packet-routing {
            srv6 {
                locator $DEFAULT_SVC_LOC {
                    micro-dt46-sid;
                }
            }
        }
        precision-timers;
        advertise-inactive;
        log-updown;
        bgp-error-tolerance;
        multipath {
            list-nexthop;
        }
        rfc8950-compliant;
    }
}
```

## junos/transport/bgp-overlay-rr.conf

```
/*
 * Topic:   iBGP overlay route-reflector configuration — multi-AFI SRv6
 *          service signaling (inet/inet-vpn, inet6/inet6-vpn, evpn,
 *          route-target) with `advertise-srv6-service` /
 *          `accept-srv6-service` enabled per family.
 * Seen on:
 *   Junos: br2_mx304 cr1_mx10004 cr2_mx2010 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - One `bgp { group GR-IBGP-* }` per role: RR<->RR mesh, RR-clients
 *    in the local AS, ASBR sessions toward the BR border routers.
 *  - `advertise-srv6-service` + `accept-srv6-service` per AFI is the
 *    SRv6 BGP signaling toggle (RFC 9252 SRv6 Service TLV).
 *  - `nexthop-resolution { no-resolution; }` skips per-prefix BGP NH
 *    resolution because resolution is handled via the SRv6 µSID stack
 *    install in inet.3.
 *  - `extended-nexthop` allows v4 routes with v6 nexthops (key for
 *    SRv6 underlay carrying v4 services).
 *  - `family route-target { advertise-default; }` enables RTC so the
 *    RR only sends VPN routes a client cares about.
 *  - `path-selection external-router-id` + `advertise-from-main-vpn-tables`
 *    + `vpn-apply-export` are the canonical RR-side L3VPN flags.
 *  - `cluster $RR_CLUSTER_ID` is the RR signature on client groups
 *    (omit for RR-RR mesh).
 *  - For ASBR-side, `family route-target { external-paths 3; }` and
 *    `export PS-VPN-SRV6` filters L3VPN.0 to SRv6-only routes
 *    (drops legacy MPLS L3VPN paths).
 *
 * Pair with:
 *  - junos/policy/vpn-import-export-rt.conf
 *  - junos/transport/inter-as-option-c.conf
 *  - junos/apply-groups/gr-bgp.conf            (TCP-AO, multipath, MSS)
 *  - junos/policy/vpn-import-export-rt.conf         (PS-VPN-SRV6, RT-SRV6)
 *  - junos/policy/srv6-redistribution-policy.conf       (PS-LOAD-BALANCE)
 *  - junos/transport/bgp-overlay-rr-client.conf (PE-side counterpart)
 *
 * Variables (example values from cr1_mx10004):
 *   $RR_LOCAL_V6           e.g. 2001:db8:bad:cafe::1000:56
 *   $RR_PEER_V6            e.g. 2001:db8:bad:cafe::1000:31
 *   $RR_CLUSTER_ID         e.g. 100.0.0.56
 *   $CLIENT_NEIGHBOR_LIST  e.g. one neighbor block per RR client
 *   $ASBR_NEIGHBOR_LIST    e.g. one neighbor block per BR (peer ASBR)
 */
protocols {
    bgp {
        apply-groups GR-BGP;
        path-selection external-router-id;
        advertise-from-main-vpn-tables;
        vpn-apply-export;

        /* RR<->RR full mesh */
        group GR-IBGP-RRS-SRV6 {
            local-address $RR_LOCAL_V6;
            family inet {
                unicast {
                    nexthop-resolution { no-resolution; }
                    extended-nexthop;
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet-vpn {
                unicast {
                    nexthop-resolution { no-resolution; }
                    extended-nexthop;
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet6 {
                unicast {
                    nexthop-resolution { no-resolution; }
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet6-vpn {
                unicast {
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family evpn {
                signaling {
                    nexthop-resolution { no-resolution; }
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family route-target {
                advertise-default;
                nexthop-resolution { no-resolution; }
            }
            export PS-VPN-SRV6;
            neighbor $RR_PEER_V6 {
                description PEER-RR;
            }
        }

        /* RR clients (PEs / Edges / MSEs) */
        group GR-IBGP-RR-CLIENTS-SRV6 {
            local-address $RR_LOCAL_V6;
            family inet {
                unicast {
                    nexthop-resolution { no-resolution; }
                    extended-nexthop;
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet-vpn {
                unicast {
                    nexthop-resolution { no-resolution; }
                    extended-nexthop;
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet6 {
                unicast {
                    nexthop-resolution { no-resolution; }
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet6-vpn {
                unicast {
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family evpn {
                signaling {
                    nexthop-resolution { no-resolution; }
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family route-target {
                advertise-default;
                nexthop-resolution { no-resolution; }
            }
            cluster $RR_CLUSTER_ID;
            $CLIENT_NEIGHBOR_LIST;
        }

        /* ASBR (BR<->RR) sessions for inter-AS Option C */
        group GR-IBGP-ASBR-SRV6 {
            local-address $RR_LOCAL_V6;
            family inet {
                unicast {
                    nexthop-resolution { no-resolution; }
                    extended-nexthop;
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet-vpn {
                unicast {
                    nexthop-resolution { no-resolution; }
                    extended-nexthop;
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet6 {
                unicast {
                    nexthop-resolution { no-resolution; }
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet6-vpn {
                unicast {
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family evpn {
                signaling {
                    nexthop-resolution { no-resolution; }
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family route-target {
                external-paths 3;
                nexthop-resolution { no-resolution; }
            }
            export PS-VPN-SRV6;
            cluster $RR_CLUSTER_ID;
            $ASBR_NEIGHBOR_LIST;
        }

        precision-timers;
        advertise-inactive;
        log-updown;
        bgp-error-tolerance;
        multipath {
            list-nexthop;
        }
        rfc8950-compliant;
        defaults {
            ebgp {
                no-policy {
                    receive reject-always;
                    advertise reject-always;
                }
            }
        }
    }
}
```

## junos/transport/bgp-transport-class.conf

```
/*
 * Topic:   Per-VRF transport-class definitions — maps service color
 *          values to Flex-Algo transport classes.
 * Seen on:
 *   Junos: br2_mx304 cr1_mx10004 cr2_mx2010 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - Each `name TC-<n> { color <n>; }` defines a transport class keyed
 *    by BGP color community; `auto-create` lets new colors map without
 *    explicit per-color stanzas.
 *  - `flex-algorithm <n> { use-transport-class { inet3-install; } }`
 *    installs the FA-derived SRv6 path into inet.3 so the transport
 *    class can resolve service nexthops over it.
 *  - This is what binds a VPN's color community to a specific
 *    Flex-Algo path (e.g. color 128 -> FA-128 delay-optimized path).
 *
 * Pair with:
 *  - junos/transport/isis-srv6-flex-algo.conf  (defines FAs 128/129)
 *  - junos/services/l3vpn-srv6-vrf.conf        (consumes the TC binding)
 *
 * Variables (example values from cr1_mx10004):
 *   $TC_NAME_LIST        e.g. TC-128 TC-129 TC-131 TC-132 TC-133
 *   $COLOR_LIST          e.g. 128 129 131 132 133
 */
routing-options {
    transport-class {
        auto-create;
        name TC-128 { color 128; }
        name TC-129 { color 129; }
        name TC-131 { color 131; }
        name TC-132 { color 132; }
        name TC-133 { color 133; }
    }
    flex-algorithm 131 {
        use-transport-class {
            inet3-install;
        }
    }
    flex-algorithm 132 {
        use-transport-class {
            inet3-install;
        }
    }
    flex-algorithm 133 {
        use-transport-class {
            inet3-install;
        }
    }
}
```

## junos/transport/inter-as-option-c.conf

```
/*
 * Topic:   Inter-AS Option C between Border Routers — eBGP between
 *          BR pairs in different domains, carrying SRv6 service routes
 *          and SRv6 locator prefixes between domains.
 * Seen on:
 *   Junos: br2_mx304 cr1_mx10004 cr2_mx2010 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - eBGP `type external` session between BR1 (region 0) and BR2
 *    (region 1) carrying inet6 + inet6-vpn + inet-vpn + evpn families.
 *  - The remote BR's loopbacks plus the SRv6 locators are advertised
 *    so end-to-end IPv6 reachability works across the domain boundary;
 *    summarization policy keeps the AS-boundary table compact.
 *  - `family inet6 { unicast { advertise-srv6-service; accept-srv6-service; } }`
 *    is the SRv6 equivalent of "labeled-unicast" — carries SID
 *    information across the EBGP session.
 *  - `multihop ttl 5` lets the eBGP session run over the loopback even
 *    though there are intermediate hops.
 *  - `local-address` is the BR loopback in this AS; `neighbor` is the
 *    far BR's loopback.
 *
 * Pair with:
 *  - junos/transport/bgp-overlay-rr.conf       (BR<->RR ASBR session)
 *  - junos/transport/srv6-locator-summarization.conf
 *  - junos/policy/srv6-redistribution-policy.conf     (controls what crosses)
 *
 * Variables (example values from br2_mx304):
 *   $LOCAL_BR_V6_LOOPBACK  e.g. 2001:db8:bad:cafe::1000:18
 *   $REMOTE_BR_V6_LOOPBACK e.g. 2001:db8:bad:cafe::1000:36
 *   $LOCAL_AS              e.g. 65001
 *   $REMOTE_AS             e.g. 65000
 *   $EBGP_MULTIHOP_TTL     e.g. 5
 */
protocols {
    bgp {
        group GR-EBGP-INTER-AS-OPTION-C {
            type external;
            multihop ttl $EBGP_MULTIHOP_TTL;
            local-address $LOCAL_BR_V6_LOOPBACK;
            family inet {
                unicast {
                    extended-nexthop;
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet-vpn {
                unicast {
                    extended-nexthop;
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet6 {
                unicast {
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family inet6-vpn {
                unicast {
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            family evpn {
                signaling {
                    advertise-srv6-service;
                    accept-srv6-service;
                }
            }
            authentication-algorithm ao;
            authentication-key-chain KC-EBGP;
            export PS-INTER-AS-EXPORT;
            import PS-INTER-AS-IMPORT;
            peer-as $REMOTE_AS;
            local-as $LOCAL_AS;
            neighbor $REMOTE_BR_V6_LOOPBACK {
                description PEER-BR;
            }
        }
    }
}
```

## junos/transport/isis-srv6-flex-algo.conf

```
/*
 * Topic:   IS-IS L2 instantiation for SRv6 µSID transport — per-device
 *          NET, locator advertisement, Flex-Algo participation,
 *          TI-LFA backup-SPF, traffic-engineering for SR-TE tunnels.
 * Seen on:
 *   Junos: br2_mx304 cr1_mx10004 cr2_mx2010 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - `apply-groups GR-ISIS-IPV6` pulls the per-interface SRv6 adjacency
 *    SIDs, ASLA attributes, delay-measurement, and TI-LFA defaults.
 *  - `flex-algorithm [ 128 129 131 132 133 ]` opts this node into all
 *    the Flex-Algos used as transport classes; `no-strict-spf` allows
 *    nodes without the FA to be traversed when no FA path exists.
 *  - `srv6 { locator $LOC micro-node-sid; }` advertises one µN SID per
 *    Flex-Algo locator.
 *  - `wide-metrics-only` + `purge-originator empty` are the IS-IS L2
 *    cleanup defaults; `topologies ipv6-unicast` enables the explicit
 *    IPv6 topology for non-congruent IPv4/IPv6 deployments.
 *  - `backup-spf-options { use-post-convergence-lfa; use-source-packet-routing; }`
 *    pairs with the per-IFL TI-LFA in GR-ISIS-IPV6 and biases backup
 *    paths toward SRv6.
 *  - `traffic-engineering { l3-unicast-topology; tunnel-source-protocol spring-te; }`
 *    feeds the IS-IS topology DB to SR-TE for future SRv6-TE work.
 *  - `overload { advertise-high-metrics; }` keeps high metrics during
 *    boot/restart so traffic drains before re-attracting it.
 *  - `net 49.<region>.0000.0000.<node>.00` follows the addressing
 *    scheme: AS/Region encoded after `49.`, node ID at the end.
 *
 * Pair with:
 *  - junos/interfaces/core-ae-link.conf
 *  - junos/policy/srv6-redistribution-policy.conf
 *  - junos/transport/bgp-transport-class.conf
 *  - junos/transport/ti-lfa-mla.conf
 *  - junos/apply-groups/gr-isis-ipv6.conf       (per-IFL SRv6 + TI-LFA)
 *  - junos/apply-groups/gr-srv6.conf            (locator µSID flavors)
 *  - junos/apply-groups/gr-core-intf-ipv6.conf  (family iso/inet6, MTUs)
 *  - junos/transport/srv6-locator-summarization.conf  (CR-only redistribution)
 *
 * Variables (example values from cr1_mx10004):
 *   $ISIS_IFL_LIST       e.g. xe-0/0/0:0.0 xe-0/0/0:1.0 ...
 *   $LOC_FA_0            e.g. SL-FA-000
 *   $LOC_FA_128          e.g. SL-FA-128
 *   $LOC_FA_129          e.g. SL-FA-129
 *   $FA_LIST             e.g. [ 128 129 ]            (PEs)
 *                          or  [ 128 129 131 132 133 ] (RRs/ASBRs)
 *   $REF_BANDWIDTH       e.g. 1000g
 *   $JUMBO_HELLO_SIZE    e.g. 9106
 *   $ISIS_NET            e.g. 49.1000.0000.0000.0056.00
 *   $OVERLOAD_TIMEOUT    e.g. 60
 *
 * Per-device routing-options for SRv6 locators / blocks lives below
 * (one block + one locator per Flex-Algo + one block + locator per
 * service if non-shared service locators are needed):
 *
 *   $LOC_BLOCK_FA_0      e.g. SB-FA-000
 *   $LOC_BLOCK_PREFIX_0  e.g. 5f00:1::/32
 *   $LOC_PREFIX_0        e.g. 5f00:1:56::/48
 *   $LOC_BLOCK_FA_128    e.g. SB-FA-128
 *   $LOC_BLOCK_PREFIX_128 e.g. 5f00:a1::/32
 *   $LOC_PREFIX_128      e.g. 5f00:a1:56::/48
 *   $LOC_BLOCK_FA_129    e.g. SB-FA-129
 *   $LOC_BLOCK_PREFIX_129 e.g. 5f00:b1::/32
 *   $LOC_PREFIX_129      e.g. 5f00:b1:56::/48
 *   $LOCAL_USID_LIMIT    e.g. 2000
 *   $ROUTER_ID           e.g. 100.0.0.56
 *   $RD_ID               e.g. 100.0.0.56  (used as RD seed)
 *   $LOCAL_AS            e.g. 65001
 *   $IPV6_ROUTER_ID      e.g. 2001:db8:bad:cafe::1000:56
 */
routing-options {
    flex-algorithm 128 {
        definition {
            metric-type delay-metric;
        }
        use-transport-class {
            inet3-install;
        }
    }
    flex-algorithm 129 {
        definition {
            metric-type te-metric;
        }
        use-transport-class {
            inet3-install;
        }
    }
    source-packet-routing {
        srv6 {
            apply-groups GR-SRV6;
            block $LOC_BLOCK_FA_0 {
                $LOC_BLOCK_PREFIX_0;
                local-micro-sid {
                    maximum-static-sids $LOCAL_USID_LIMIT;
                }
            }
            block $LOC_BLOCK_FA_128 {
                $LOC_BLOCK_PREFIX_128;
                local-micro-sid {
                    maximum-static-sids $LOCAL_USID_LIMIT;
                }
            }
            block $LOC_BLOCK_FA_129 {
                $LOC_BLOCK_PREFIX_129;
                local-micro-sid {
                    maximum-static-sids $LOCAL_USID_LIMIT;
                }
            }
            locator $LOC_FA_0 {
                $LOC_PREFIX_0;
                micro-sid {
                    block-name $LOC_BLOCK_FA_0;
                }
            }
            locator $LOC_FA_128 {
                algorithm 128;
                $LOC_PREFIX_128;
                micro-sid {
                    block-name $LOC_BLOCK_FA_128;
                }
            }
            locator $LOC_FA_129 {
                algorithm 129;
                $LOC_PREFIX_129;
                micro-sid {
                    block-name $LOC_BLOCK_FA_129;
                }
            }
        }
    }
    route-distinguisher-id $RD_ID;
    rib inet.3 {
        protect core;
    }
    resolution {
        preserve-nexthop-hierarchy;
    }
    router-id $ROUTER_ID;
    autonomous-system $LOCAL_AS;
    ipv6-router-id $IPV6_ROUTER_ID;
    protect core;
    forwarding-table {
        srv6-chain-merge;
        export PS-LOAD-BALANCE;
    }
}
protocols {
    isis {
        apply-groups GR-ISIS-IPV6;
        /* Repeat one `interface <ifl>;` per core IFL */
        interface $ISIS_IFL_LIST;
        interface lo0.0 {
            passive;
        }
        source-packet-routing {
            flex-algorithm $FA_LIST;
            no-strict-spf;
            srv6 {
                locator $LOC_FA_0 micro-node-sid;
                locator $LOC_FA_128 micro-node-sid;
                locator $LOC_FA_129 micro-node-sid;
            }
        }
        level 1 disable;
        level 2 {
            purge-originator empty;
            wide-metrics-only;
        }
        backup-spf-options {
            use-post-convergence-lfa maximum-backup-paths 2;
            use-source-packet-routing;
        }
        traffic-engineering {
            l3-unicast-topology;
            tunnel-source-protocol {
                spring-te;
            }
            advertisement always;
        }
        reference-bandwidth $REF_BANDWIDTH;
        max-hello-size $JUMBO_HELLO_SIZE;
        suppress-attached-bit;
        no-external-export {
            protocol bgp;
            protocol ospf;
            protocol static;
        }
        topologies ipv6-unicast;
        overload {
            timeout $OVERLOAD_TIMEOUT;
            advertise-high-metrics;
            internal-prefixes;
            external-prefixes;
        }
        net $ISIS_NET;
    }
}
```

## junos/transport/srv6-locator-summarization.conf

```
/*
 * Topic:   SRv6 locator redistribution / summarization at AS boundary —
 *          policy + IS-IS export pattern that lets domain-internal
 *          locators be summarized into the inter-AS BGP table.
 * Seen on:
 *   Junos: br2_mx304 cr1_mx10004 cr2_mx2010 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - At a Border Router, `protocols isis { export PS-SRV6-LOC-EXPORT; }`
 *    leaks the local domain's per-Flex-Algo locator prefixes into BGP
 *    so the far AS can resolve service nexthops via SRv6.
 *  - `policy-options policy-statement PS-SRV6-LOC-EXPORT` filters by
 *    locator block (matched on `from route-filter`) and applies a
 *    summary or per-locator advertisement depending on the inter-AS
 *    design (per the JVD's "strict vs cascade" transport-class
 *    resolution choice).
 *  - At a CR (intra-AS), the same pattern is used to redistribute
 *    summarized far-domain locators learned from the BR back into
 *    IS-IS so internal routers can resolve them with a single LSP entry.
 *
 * Pair with:
 *  - junos/transport/inter-as-option-c.conf        (eBGP carrying these)
 *  - junos/transport/isis-srv6-flex-algo.conf      (locator definitions)
 *  - junos/policy/srv6-redistribution-policy.conf         (the policy bodies)
 *
 * Variables (example values):
 *   $SUMMARY_PREFIX_FA_0   e.g. 5f00:1::/24
 *   $SUMMARY_PREFIX_FA_128 e.g. 5f00:a1::/24
 *   $SUMMARY_PREFIX_FA_129 e.g. 5f00:b1::/24
 */
protocols {
    isis {
        export PS-SRV6-LOC-EXPORT;
    }
    bgp {
        group GR-IBGP-ASBR-SRV6 {
            export PS-SRV6-LOC-EXPORT;
        }
    }
}
policy-options {
    policy-statement PS-SRV6-LOC-EXPORT {
        term TR-SUM-FA-0 {
            from {
                route-filter $SUMMARY_PREFIX_FA_0 exact;
            }
            then accept;
        }
        term TR-SUM-FA-128 {
            from {
                route-filter $SUMMARY_PREFIX_FA_128 exact;
            }
            then accept;
        }
        term TR-SUM-FA-129 {
            from {
                route-filter $SUMMARY_PREFIX_FA_129 exact;
            }
            then accept;
        }
    }
}
```

## junos/transport/ti-lfa-mla.conf

```
/*
 * Topic:   TI-LFA + Micro-Loop Avoidance (MLA) under IS-IS for SRv6
 *          µSID — node and link protection backups computed via SR.
 * Seen on:
 *   Junos: cr1_mx10004 cr2_mx2010 br2_mx304 edge1_mx480 edge2_mx480 edge3_mx480 mse1_mx480 mse2_mx304
 *   EVO:   br1_ptx10002-36qdd
 *
 * Highlights:
 *  - `backup-spf-options { use-post-convergence-lfa; use-source-packet-routing; }`
 *    enables TI-LFA (computes a backup SR path that mirrors the
 *    post-convergence path, avoiding micro-loops by sending the failed
 *    PE the same SID list the network will use after convergence).
 *  - `maximum-backup-paths 2` keeps two backup paths in FIB for
 *    parallel link/node failures.
 *  - The per-IFL `post-convergence-lfa { node-protection cost ... }`
 *    in GR-ISIS-IPV6 elects node protection over link protection when
 *    both are available.
 *  - MLA (micro-loop avoidance) lives under `spf-options` in this JVD
 *    — kept as `inactive:` placeholder ready to enable if the network
 *    sees micro-loop incidents.
 *
 * Pair with:
 *  - junos/apply-groups/gr-isis-ipv6.conf      (per-IFL post-convergence-lfa)
 *  - junos/transport/isis-srv6-flex-algo.conf  (instantiation)
 *
 * Variables (example values from cr1_mx10004):
 *   $MAX_BACKUP_PATHS  e.g. 2
 *   $MLA_DELAY         e.g. 500
 */
protocols {
    isis {
        backup-spf-options {
            use-post-convergence-lfa maximum-backup-paths $MAX_BACKUP_PATHS;
            use-source-packet-routing;
        }
        inactive: spf-options {
            microloop-avoidance {
                post-convergence-path {
                    delay $MLA_DELAY;
                }
            }
            delay 50;
            holddown 2000;
            rapid-runs 5;
        }
    }
}
```

## _variables.md

# SRv6 Core Edge JVD — Snip Variables Glossary

This file lists every `$VARIABLE` placeholder used in the `snips/` library
along with a brief description and a representative example value drawn from
the sanitized JVD configurations. Values are alphabetized.

| Variable | Description | Example value |
|---|---|---|
| `$AC_IFL` | EVPN-VPWS attachment-circuit IFL on the customer-facing AE | `ae2.1001` |
| `$AE_NUMBER` | Aggregated-Ethernet bundle number for a core link | `0` |
| `$ASBR_NEIGHBOR_LIST` | List of `neighbor <addr> { description <peer>; }` blocks for ASBR/BR peers | (per-deployment) |
| `$ATTACH_IFL` | Per-VRF customer-facing sub-IFL (typically `xe-X/Y/Z.<unit>`) | `xe-2/0/2.501` |
| `$BD_UNIT` | IRB / bridge-domain unit number (matches VLAN convention) | `601` |
| `$BFD_MIN_INT` | BFD minimum-interval in ms (per-IFL & LACP-side) | `50` |
| `$BFD_MULT` | BFD detection multiplier | `3` |
| `$BRIDGE_UNIT` | Bridge-domain attachment unit on the CPE-facing AE | `601` |
| `$BRIDGE_VLAN` | Bridge-domain VLAN-id | `601` |
| `$CE_AS` | Customer-edge BGP autonomous-system number | `65003` |
| `$CLIENT_NEIGHBOR_LIST` | RR's list of `neighbor <addr> { description <pe>; }` blocks | (per-deployment) |
| `$COLOR_LIST` | List of BGP colors used for transport-class binding | `128 129 131 132 133` |
| `$DEFAULT_SVC_LOC` | PE's default per-VRF service locator name | `SL-FA-000` |
| `$DELAY_ADV_INTERVAL` | Periodic delay-advertisement interval (s) | `30` |
| `$DELAY_ADV_THRESH` | Delay change threshold for advertisement (units of µs) | `100` |
| `$DELAY_METRIC` | IS-IS Flex-Algo 128 per-IFL delay metric value | `1000` |
| `$DELAY_PROBE_COUNT` | Per-IFL TWAMP-Light probe count per measurement window | `10` |
| `$DELAY_PROBE_INT` | Per-IFL TWAMP-Light probe interval (s) | `1` |
| `$EBGP_EXPORT_POLICY_LIST` | Inter-AS eBGP export policy chain | `[ PS-EBGP-NHS PS-EBGP-SRV6-EXP ]` |
| `$EBGP_IMPORT_POLICY` | Inter-AS eBGP import policy | `PS-EBGP-IMP` |
| `$EBGP_MULTIHOP_TTL` | Inter-AS Option-C eBGP multihop TTL | `5` |
| `$ESI_BYTES` | 10-byte ESI value (PE-ID in byte 9, service-ID in byte 10) | `00:11:11:11:11:11:11:11:18:d1` |
| `$ESI_MODE` | Multi-homing mode | `single-active` or `all-active` |
| `$FA_LIST` | List of Flex-Algo IDs this node participates in | `[ 128 129 ]` (PE) / `[ 128 129 131 132 133 ]` (RR/BR) |
| `$IBGP_IMPORT_POLICY` | Optional iBGP RR-session import policy on a BR | `PS-IBGP-SRV6-IMP` |
| `$IPV6_ROUTER_ID` | IPv6 router-id (typically lo0 v6 address) | `2001:db8:bad:cafe::1000:56` |
| `$IRB_V4` | IRB IPv4 gateway address/mask | `10.104.8.1/30` |
| `$IRB_V6` | IRB IPv6 gateway address/mask | `2010:104:8::1/126` |
| `$ISIS_IFL_LIST` | Space-separated list of IS-IS-bearing IFLs (one `interface` line each) | `xe-0/0/0:0.0 xe-0/0/0:1.0 ...` |
| `$ISIS_NET` | IS-IS NET address (49.<region>.<sysid>.00) | `49.1000.0000.0000.0056.00` |
| `$JUMBO_HELLO_SIZE` | IS-IS max-hello-size (bytes) | `9106` |
| `$JUMBO_L2_MTU` | Core L2 MTU (bytes) | `9192` |
| `$JUMBO_L3_MTU` | Family-level L3 MTU (bytes; L2 minus 86 for SRv6 µSID overhead) | `9106` |
| `$L3_UNIT` | Plain L3VPN sub-IFL unit on a CPE-facing AE | `10` |
| `$L3_V6` | Per-sub-IFL IPv6 address | `2020:0:0:1::1/126` |
| `$L3_VLAN` | Plain L3VPN sub-IFL VLAN-id | `10` |
| `$LACP_BFD_INTERVAL` | BFD-on-LACP minimum-interval (ms) | `50` |
| `$LACP_BFD_MULT` | BFD-on-LACP multiplier | `3` |
| `$LOC` | Per-VRF / per-service SRv6 locator name | `SL-FA-000` |
| `$LOC_BLOCK_FA_0` | Block name for Flex-Algo 0 (default IGP) | `SB-FA-000` |
| `$LOC_BLOCK_FA_128` | Block name for Flex-Algo 128 (delay) | `SB-FA-128` |
| `$LOC_BLOCK_FA_129` | Block name for Flex-Algo 129 (TE) | `SB-FA-129` |
| `$LOC_BLOCK_PREFIX_0` | µSID block /32 for FA-0 | `5f00:1::/32` |
| `$LOC_BLOCK_PREFIX_128` | µSID block /32 for FA-128 | `5f00:a1::/32` |
| `$LOC_BLOCK_PREFIX_129` | µSID block /32 for FA-129 | `5f00:b1::/32` |
| `$LOC_FA_0` | Locator name for Flex-Algo 0 | `SL-FA-000` |
| `$LOC_FA_128` | Locator name for Flex-Algo 128 | `SL-FA-128` |
| `$LOC_FA_129` | Locator name for Flex-Algo 129 | `SL-FA-129` |
| `$LOC_PREFIX_0` | Per-node /48 locator for FA-0 | `5f00:1:56::/48` |
| `$LOC_PREFIX_128` | Per-node /48 locator for FA-128 | `5f00:a1:56::/48` |
| `$LOC_PREFIX_129` | Per-node /48 locator for FA-129 | `5f00:b1:56::/48` |
| `$LOCAL_AS` | Local BGP autonomous-system number | `65001` |
| `$LOCAL_BR_V6_LOOPBACK` | Local Border-Router IPv6 loopback for inter-AS eBGP | `2001:db8:bad:cafe::1000:18` |
| `$LOCAL_USID_LIMIT` | `local-micro-sid maximum-static-sids` per block | `2000` |
| `$LOCAL_VPWS_ID` | EVPN-VPWS local service-id | `1` |
| `$LOOPBACK_IFL` | Per-VRF lo0 unit | `lo0.501` |
| `$LOOPBACK_V4` | Per-VRF lo0 IPv4 address/mask | `195.168.8.1/32` |
| `$LOOPBACK_V6` | Per-VRF lo0 IPv6 address/mask | `2195:168:8::1/128` |
| `$MAX_BACKUP_PATHS` | TI-LFA backup paths to install | `2` |
| `$MEMBER_PORT_LIST` | Space-separated physical IFLs that join the AE bundle | `xe-2/0/0 xe-2/0/1` |
| `$MLA_DELAY` | Micro-loop avoidance post-convergence delay (ms) | `500` |
| `$OVERLOAD_TIMEOUT` | IS-IS startup overload timer (s) | `60` |
| `$PE_CE_LOCAL_V4` | PE-CE local v4 address/mask | `13.1.8.1/30` |
| `$PE_CE_NEIGHBOR_V4` | PE-CE remote v4 address | `13.1.8.2` |
| `$PE_CE_V4_LOCAL` | PE-CE local v4 (with mask) | `13.1.8.1/30` |
| `$PE_CE_V6_LOCAL` | PE-CE local v6 (with mask) | `2013:1:8::1/126` |
| `$PE_LOCAL_V6` | PE's iBGP local-address (v6 loopback) | `2001:db8:bad:cafe::1006:48` |
| `$PEER_HOSTNAME` | Description token for AE description | `CR1` |
| `$PHYS_IFL` | Physical interface name for service attachment | `xe-2/0/2` (MX) / `et-0/0/3` (PTX) |
| `$RD_ID` | `route-distinguisher-id` seed (typically v4 lo0) | `100.0.0.56` |
| `$RD_SEED` | RD numeric prefix (typically v4 lo0) | `100.0.6.48` / `200.0.0.60` |
| `$REF_BANDWIDTH` | IS-IS reference bandwidth | `1000g` |
| `$REMOTE_AS` | Inter-AS remote autonomous-system | `65000` |
| `$REMOTE_BR_V6_LOOPBACK` | Remote BR's IPv6 loopback for inter-AS eBGP | `2001:db8:bad:cafe::1000:36` |
| `$REMOTE_PEER_DESCRIPTION` | Description token for far-AS peer | `PEER-MSE1` |
| `$REMOTE_VPWS_ID` | EVPN-VPWS remote service-id | `2` |
| `$ROUTER_ID` | v4 router-id (typically lo0 v4) | `100.0.0.56` |
| `$RR1_V6` | First RR's v6 loopback (PE-side neighbor) | `2001:db8:bad:cafe::1000:31` |
| `$RR2_V6` | Second RR's v6 loopback (PE-side neighbor) | `2001:db8:bad:cafe::1000:56` |
| `$RR_CLUSTER_ID` | RR cluster-id (typically RR's v4 lo0) | `100.0.0.56` |
| `$RR_LOCAL_V6` | RR's iBGP local-address (v6 loopback) | `2001:db8:bad:cafe::1000:56` |
| `$RR_PEER_V6` | Peer RR's v6 loopback (RR-mesh side) | `2001:db8:bad:cafe::1000:31` |
| `$SUMMARY_PREFIX_FA_0` | Inter-AS summary prefix for FA-0 locators | `5f00:1::/24` |
| `$SUMMARY_PREFIX_FA_128` | Inter-AS summary prefix for FA-128 locators | `5f00:a1::/24` |
| `$SUMMARY_PREFIX_FA_129` | Inter-AS summary prefix for FA-129 locators | `5f00:b1::/24` |
| `$TC_NAME_LIST` | Transport-class names | `TC-128 TC-129 TC-131 TC-132 TC-133` |
| `$TE_METRIC` | IS-IS Flex-Algo 129 ASLA TE metric value | `1000` |
| `$UNIT` | Per-VLAN AE sub-IFL unit number | `10` |
| `$VLAN` | Sub-IFL VLAN-id | `10` |
| `$VPN_ID` | Per-VRF service-id (used in RD/RT and unit numbering) | `501` |
| `$VPWS_NAME` | EVPN-VPWS routing-instance name | `EVPN-VPWS-AA-DYN-FA000-1` |
| `$VPWS_UNIT` | EVPN-VPWS AC unit on the CPE-facing AE | `1001` |
| `$VPWS_VLAN` | EVPN-VPWS AC VLAN-id | `1001` |
| `$VRF_NAME` | L3VPN routing-instance name | `L3VPN-DYN-FA000-1` |
| `$VRF_ROUTER_ID` | Per-VRF router-id | `195.168.8.1` |
| `$VRF_UNIT` | Per-VRF sub-IFL unit on the customer-facing IFL | `501` |

## byoai/TIERS.md

# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each service kind at each verbosity tier. It is bundled into [`jvd-srv6-snips.md`](jvd-srv6-snips.md) by `regenerate-bundle.sh`.

For each service kind, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. Use the OS-appropriate file under `junos/` or `evo/`.

---

## What the tiers mean

| Tier | Use when | What's included |
|---|---|---|
| **`minimum`** | Brownfield change. PE already has a working SRv6 IS-IS underlay AND the iBGP overlay (with `advertise-srv6-service` / `accept-srv6-service`). You just want the new service. | Service routing-instance + PE-CE (or CPE) attachment + the `gr-l3vpn` apply-group + the overlay client. **Nothing else.** |
| **`with-overlay`** | Brownfield-ish. PE has a working SRv6 underlay but you want to (re)assert the iBGP overlay activation for the SRv6 service families. | `minimum` + `transport/bgp-overlay-rr-client.conf`. |
| **`as-deployed`** | Greenfield turn-up, lab build, or "give me a working example end-to-end." Mirrors what the JVD validates. | Everything: service + attachment + overlay + the full SRv6 IS-IS/Flex-Algo underlay baseline + apply-groups + transport-class + policy + OAM. |

> **Greenfield / bootstrap requests** (e.g. "build a new MX480 PE turn-up", "bootstrap an SRv6 edge end-to-end") are always treated as **`as-deployed`** regardless of the user's tier choice.

If the user picks `minimum` and the AI cannot tell whether the SRv6 overlay families are already active on the PE, it should call that out in `Notes:` ("assumed `advertise-srv6-service` / `accept-srv6-service` already active under the iBGP-to-RR group").

---

## Shared SRv6 underlay baseline (the `as-deployed` foundation for every service)

Every `as-deployed` service includes this common SRv6 core baseline. OS-select each file (all are byte-identical across junos/ and evo/ except where noted):

**Transport / IGP:**
- `transport/isis-srv6-flex-algo.conf` — IS-IS L2 + SRv6 locators (SL-FA-000/128/129), Flex-Algos 128 (delay) / 129 (TE)
- `transport/bfd-isis.conf` — per-IFL BFD (50 ms × 3) under IS-IS inet6
- `transport/ti-lfa-mla.conf` — post-convergence TI-LFA backup paths
- `transport/bgp-overlay-rr-client.conf` — PE iBGP client to RRs (multi-AFI, `advertise/accept-srv6-service`, RFC 9252)
- `transport/bgp-transport-class.conf` — color ↔ Flex-Algo binding (inet.3 install)
- `transport/core-ae-link.conf` — core AE trunk with per-VLAN IS-IS units

**Apply-groups:**
- `apply-groups/gr-srv6.conf` — µSID flavors (PSP / USP / USD) for all `SL-*` locators
- `apply-groups/gr-bgp.conf` — TCP-AO auth, multipath, jumbo tcp-mss 4096
- `apply-groups/gr-isis-ipv6.conf` — per-IFL SRv6 adjacency SIDs + TI-LFA + ASLA delay/TE metrics
- `apply-groups/gr-core-intf-ipv6.conf` — L2 MTU 9192 / L3 MTU 9106, IPv6-only underlay, BFD-on-LACP
- `apply-groups/gr-l3vpn.conf` — `instance-type vrf`, `vpn-unequal-cost`, `vrf-table-label`

**Policy / OAM:**
- `policy/srv6-redistribution-policy.conf` — per-packet load-balance + `srv6-chain-merge`
- `oam/bfd-defaults.conf` + `oam/twamp-light.conf` — BFD timers + TWAMP-Light delay responder

**Route-reflector / border-router only:**
- `policy/vpn-import-export-rt.conf` — SRv6-only L3VPN route-target filter (RR/BR)
- `transport/bgp-overlay-rr.conf` — RR-side iBGP (only when generating for cr1/cr2/br nodes)

**Multi-domain (inter-AS) add:**
- `transport/inter-as-option-c.conf` — eBGP to remote-domain BR
- `transport/srv6-locator-summarization.conf` — locator export/import at the domain boundary

---

## L3VPN over SRv6 (`l3vpn-srv6-vrf`) — Junos + EVO

**minimum** (just the service)
- `services/l3vpn-srv6-vrf.conf`
- `interfaces/pe-ce-direct.conf` (dual-stack L3 sub-IFL) **OR** `interfaces/pe-ce-irb.conf` (BD + IRB gateway)
- `apply-groups/gr-l3vpn.conf`
- `transport/bgp-overlay-rr-client.conf`
- `policy/vpn-import-export-rt.conf` (per-VRF RT policy)

**with-overlay** (= minimum + re-assert)
- `transport/bgp-overlay-rr-client.conf` (verify `advertise/accept-srv6-service`)

**as-deployed** (= minimum + the shared SRv6 underlay baseline above)

---

## EVPN-VPWS over SRv6 (`evpn-vpws-srv6`) — Junos only

**minimum** (just the service)
- `services/evpn-vpws-srv6.conf`
- `interfaces/cpe-attachment.conf` (AC + ESI for multi-homing)
- `apply-groups/gr-l3vpn.conf`
- `transport/bgp-overlay-rr-client.conf`

**with-overlay** (= minimum +)
- `transport/bgp-overlay-rr-client.conf`

**as-deployed** (= minimum + shared SRv6 underlay baseline)

All-active or single-active multihoming via the ESI on `cpe-attachment`.

---

## L3VPN with EVPN Type-5 silent-host (`l3vpn-evpn-t5-srv6`) — Junos only

The PE originates EVPN Type-5 routes; the CE has no PE-CE eBGP (static default only). Pair with `cpe-virtual-router` on the CPE side.

**minimum** (just the service)
- `services/l3vpn-evpn-t5-srv6.conf`
- `interfaces/pe-ce-direct.conf`
- `apply-groups/gr-l3vpn.conf`
- `transport/bgp-overlay-rr-client.conf`

**with-overlay** (= minimum +)
- `transport/bgp-overlay-rr-client.conf`

**as-deployed** (= minimum + shared SRv6 underlay baseline)

---

## CPE virtual router (`cpe-virtual-router`) — Junos only

The lightweight CE-side counterpart to the L3VPN / EVPN-T5 services. `instance-type virtual-router`, no RD/RT.

**minimum**
- `services/cpe-virtual-router.conf`
- `interfaces/cpe-attachment.conf` (trunk toward the PE/MSE)

**as-deployed** (= minimum + the CPE's core interface baseline: `gr-core-intf-ipv6`, `gr-bgp`)

Generate the matching PE-side service (`l3vpn-srv6-vrf` or `l3vpn-evpn-t5-srv6`) on the PE when a full end-to-end example is requested.

---

## Add-a-feature / transport-only requests

- **SRv6 IS-IS + Flex-Algo underlay for a device** → `transport/isis-srv6-flex-algo.conf` + `apply-groups/gr-isis-ipv6.conf` + `apply-groups/gr-srv6.conf` + `transport/bfd-isis.conf` + `transport/ti-lfa-mla.conf`
- **iBGP SRv6 overlay** → `transport/bgp-overlay-rr.conf` (RR) or `transport/bgp-overlay-rr-client.conf` (PE) + `apply-groups/gr-bgp.conf`
- **Transport classes / color steering** → `transport/bgp-transport-class.conf`
- **Inter-AS (multi-domain)** → `transport/inter-as-option-c.conf` + `transport/srv6-locator-summarization.conf`
- **OAM / delay measurement** → `oam/twamp-light.conf` + `oam/bfd-defaults.conf`

## byoai/DEFAULTS.md

# Auto-Fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default values the AI uses in `auto` mode (or when the user short-circuits with `all defaults` / `use defaults` / `skip`). It is bundled into [`jvd-srv6-snips.md`](jvd-srv6-snips.md) by `regenerate-bundle.sh`.

Use these values EXACTLY. Do not invent alternative defaults. Every value the AI auto-fills MUST be listed in the output's `Inputs used:` block so the user can rerun with edits.

Addressing uses the JVD lab's documentation-style prefixes (`2001:db8:bad:cafe::/64` overlay, `5f00::/16` SRv6 µSID space).

---

## Device inventory (the JVD topology)

| Device | OS family | Role | Region |
|--------|-----------|------|--------|
| `edge1_mx480` | Junos | PE (edge) | 0 |
| `edge2_mx480` | Junos | PE (edge) | 0 |
| `edge3_mx480` | Junos | PE (edge) | 0 |
| `mse1_mx480` | Junos | Metro PE (MSE) | 0 |
| `mse2_mx304` | Junos | Metro PE (MSE) | 0 |
| `cr1_mx10004` | Junos | Core Router / Route Reflector | 0 |
| `cr2_mx2010` | Junos | Core Router / backup RR | 0 |
| `br2_mx304` | Junos | Border Router | 1 |
| `cpe2_mx240` | Junos | CPE (multi-homed) | — |
| `cpe4_mx240` | Junos | CPE (MSE-homed) | — |
| `br1_ptx10002-36qdd` | EVO | Border Router | 0 |

**Device-choice shortcuts:**
- `JUNOS` → `edge1_mx480` + `edge2_mx480`
- `EVO` → `br1_ptx10002-36qdd` (the only EVO device — **L3VPN only**; EVPN-VPWS / EVPN-T5 / CPE-VR are Junos-only)
- `MIXED` → `edge1_mx480` (Junos) + `br1_ptx10002-36qdd` (EVO)

RRs (`cr1_mx10004`, `cr2_mx2010`) reflect service routes — services are not instantiated on them.

---

## Transport / underlay defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$LOCAL_AS` | `65001` | primary domain AS |
| `$REMOTE_AS` | `65000` | far domain (multi-domain / inter-AS) |
| `$RR1_V6` | `2001:db8:bad:cafe::1000:31` | route reflector 1 loopback |
| `$RR2_V6` | `2001:db8:bad:cafe::1000:56` | route reflector 2 loopback |
| `$RR_CLUSTER_ID` | RR's v4 loopback | e.g. `100.0.0.56` |
| `$PE_LOCAL_V6` | per device | PE iBGP source (device v6 loopback) |
| `$ISIS_NET` | `49.<region>.0000.0000.<node>.00` | per-node NET (e.g. `49.1000.0000.0000.0056.00`) |
| `$JUMBO_L2_MTU` | `9192` | core L2 MTU |
| `$JUMBO_L3_MTU` | `9106` | L3 MTU (9192 − 86 B µSID overhead) |
| `$BFD_MIN_INT` / `$BFD_MULT` | `50` ms / `3` | ~150 ms detect |
| `$REF_BANDWIDTH` | `1000g` | IS-IS reference bandwidth |
| `$EBGP_MULTIHOP_TTL` | `5` | inter-AS BR-to-BR (multi-domain) |

---

## SRv6 locators (per Flex-Algo)

| Flex-Algo | Locator | Per-node prefix (`:56` example) | µSID block | Metric |
|-----------|---------|----------------------------------|------------|--------|
| FA-0 (default IGP) | `SL-FA-000` | `5f00:1:56::/48` | `5f00:1::/32` | IGP |
| FA-128 (delay) | `SL-FA-128` | `5f00:a1:56::/48` | `5f00:a1::/32` | delay (ASLA, dynamic probe) |
| FA-129 (TE) | `SL-FA-129` | `5f00:b1:56::/48` | `5f00:b1::/32` | TE metric |

`$FA_LIST`: PE = `[128 129]`; RR / BR = `[128 129 131 132 133]` (131-133 reserved for future service classes).

`$LOC` / `$DEFAULT_SVC_LOC` per service: default `SL-FA-000`; set to `SL-FA-128` (delay) or `SL-FA-129` (TE) for color-based service steering.

**Multi-domain summary prefixes** (advertised at the BR): FA-0 `5f00:1::/24`, FA-128 `5f00:a1::/24`, FA-129 `5f00:b1::/24`.

**Transport classes:** one per Flex-Algo — `TC-128`, `TC-129`, `TC-131`, `TC-132`, `TC-133`; colors `128 / 129 / 131 / 132 / 133` (auto-create, `use-transport-class { inet3-install; }`).

---

## Service instance-name / ID conventions

| Service | Instance name | VPN_ID seed | Locator | Notes |
|---------|---------------|-------------|---------|-------|
| L3VPN-SRv6 | `$VRF_NAME` | `501` / `1001` (increment) | `SL-FA-000` | RD `<PE-v4-loopback>:<VPN_ID>`; µDT46 dual-stack |
| EVPN-VPWS-SRv6 | `$VPWS_NAME` | VPN_ID + `3000` offset | `SL-FA-000` | ESI-based; single- or all-active |
| L3VPN-EVPN-T5 | `$VRF_NAME` | `1001` | `SL-FA-000` | silent-host; PE originates T5 |
| CPE virtual-router | per-group | — | — | no RD/RT; BGP groups toward PE/MSE |

`$RD_SEED` = the originating PE's v4 loopback (e.g. `100.0.0.56`, `200.0.0.60`). Route-targets follow `target:$LOCAL_AS:<VPN_ID>`. **Cross-PE rule:** RTs, VPWS service-ids, and ESI values MUST match on both PE halves; per-PE identifiers (loopback, RD, attachment IFL) differ.

---

## Interface / attachment defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$PHYS_IFL` | `ae2` (CPE) / `xe-2/0/2` (PE-CE) | attachment interface |
| `$AE_NUMBER` | `0` | core AE bundle |
| `$VRF_UNIT` / `$VLAN` | = VPN_ID | per-VRF sub-IFL |
| `$PE_CE_V4_LOCAL` / `$PE_CE_V6_LOCAL` | `13.1.8.1/30` / `2013:1:8::1/126` | PE-CE adjacency |
| `$LOOPBACK_V4` / `$LOOPBACK_V6` | `195.168.8.1/32` / `2195:168:8::1/128` | per-VRF loopback / router-id |
| `$IRB_V4` / `$IRB_V6` | `10.104.8.1/30` / `2010:104:8::1/126` | IRB gateway (pe-ce-irb) |

---

## ESI (EVPN-VPWS multihoming) defaults

- 10-byte ESI: `00:11:11:11:11:11:11:11:<PE-ID>:<svc-ID>` — byte 9 = PE-ID, byte 10 = service-ID.
- `$ESI_MODE`: `all-active` (default) or `single-active`. MUST match on both PEs of the multi-homed pair.

---

## Apply-group constants (never parameterize)

`gr-bgp` (TCP-AO key-chain `KC-BGP`), `gr-srv6` (µSID PSP/USP/USD), `gr-l3vpn` (`instance-type vrf` + `vpn-unequal-cost` + `vrf-table-label`), `gr-core-intf-ipv6` (MTU 9192/9106, IPv6-only), `gr-isis-ipv6` (per-FA adjacency SIDs) — these are JVD-wide design constants. Reference the groups; do not expand them inline unless the user asks.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-srv6-snips.md`](jvd-srv6-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum" or "with-overlay"
# devices:
#   pe1: { name: <hostname>, os: <junos|evo>, loopback6: <addr>, locator: <SL-FA-000|128|129> }
#   pe2: { ... }
# services:
#   - { kind: <l3vpn-srv6|evpn-vpws-srv6|l3vpn-evpn-t5-srv6|cpe-virtual-router>,
#       count: <int>,
#       vpn_id: <int>,
#       rd_seed: <pe-v4-loopback>,
#       rt: <target:AS:VPN_ID>,
#       locator: <SL-FA-000|128|129>,
#       esi: <hex>,              # for evpn-vpws-srv6
#       attachment: <pe-ce-direct|pe-ce-irb|cpe-attachment> }
# snips_used:
#   - junos/services/l3vpn-srv6-vrf.conf
#   - evo/services/l3vpn-srv6-vrf.conf
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

Drop the leading C-style `/* … */` doc header from each snip when emitting. Keep one `/* snips/<path> */` line as the section comment. Reference apply-groups via `apply-groups [ NAME ];` rather than expanding them inline, unless the user asks for flattened config.

## 3. `Notes:` section (always last)

Bullets covering:

- Snips intentionally omitted (and why).
- Inputs defaulted because the user did not provide them.
- Cross-PE consistency the user must verify (route-targets, VPWS service-ids, ESI values, SRv6 locators).
- Anything by-pattern rather than validated on that exact device (e.g. a user-supplied hostname not in any snip's `Seen on:` list).
- **EVO scope:** `br1_ptx10002-36qdd` is the only EVO device and runs **L3VPN-SRv6 only** — EVPN-VPWS, EVPN Type-5, and CPE virtual-router are Junos-only. Flag if the user asks for an EVPN service on EVO.
- **Overlay assumption:** for `minimum`, remind that `advertise-srv6-service` / `accept-srv6-service` must already be active on the PE's iBGP-to-RR group.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
