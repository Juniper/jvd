# JVD Low Latency QoS for 5G (LLQ) snippet library

## evo/cos/classifier-dscp-ipv6.conf

```
/*
 * Topic:   DSCP-IPv6 classifier (CL-DSCP-IPV6) — ingress IPv6 packet-to-FC mapping
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - Identical classification logic to CL-DSCP but applied to IPv6 traffic
 *  - Required when inet6 traffic is classified separately from inet
 *  - Applied to L3 service interfaces alongside CL-DSCP
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/cos/cos-binding-l3-service.conf
 *  - evo/cos/forwarding-classes.conf
 *  - evo/cos/classifier-dscp.conf          (IPv4 counterpart)
 *  - evo/cos/rewrite-dscp-ipv6.conf        (egress IPv6 FC → DSCP marking)
 */

class-of-service {
    classifiers {
        dscp-ipv6 CL-DSCP-IPV6 {
            import default;
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-points be;
            }
            forwarding-class FC-CONTROL {
                loss-priority low code-points cs7;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-points af33;
                loss-priority low code-points [ cs3 af31 ];
                loss-priority medium-high code-points af32;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-points af43;
                loss-priority low code-points [ cs4 af41 ];
                loss-priority medium-high code-points af42;
            }
            forwarding-class FC-LOW {
                loss-priority high code-points af13;
                loss-priority low code-points [ cs1 af11 ];
                loss-priority medium-high code-points af12;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-points af23;
                loss-priority low code-points [ cs2 af21 ];
                loss-priority medium-high code-points af22;
            }
            forwarding-class FC-REALTIME {
                loss-priority low code-points ef;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-points cs5;
                loss-priority low code-points cs6;
            }
        }
    }
}
```

## evo/cos/classifier-dscp.conf

```
/*
 * Topic:   DSCP classifier (CL-DSCP) — ingress packet-to-FC mapping
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - AF per-hop behavior: AF4x → FC-LLQ, AF3x → FC-HIGH, AF2x → FC-MEDIUM,
 *    AF1x → FC-LOW, EF → FC-REALTIME, CS6/CS7 → FC-SIGNALING/CONTROL
 *  - 3-level loss-priority (low/medium-high/high) for AFxy drop-precedence
 *  - import default covers unmapped code-points → FC-BEST-EFFORT
 *  - Applied to L3 service interfaces via interface cos-binding
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/cos/classifier-dscp-ipv6.conf
 *  - evo/cos/cos-binding-l3-service.conf
 *  - evo/cos/forwarding-classes.conf
 *  - evo/cos/forwarding-classes.conf       (FC queue-num definitions)
 *  - evo/cos/rewrite-dscp.conf             (egress FC → DSCP marking)
 */

class-of-service {
    classifiers {
        dscp CL-DSCP {
            import default;
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-points be;
            }
            forwarding-class FC-CONTROL {
                loss-priority low code-points cs7;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-points af33;
                loss-priority low code-points [ cs3 af31 ];
                loss-priority medium-high code-points af32;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-points af43;
                loss-priority low code-points [ cs4 af41 ];
                loss-priority medium-high code-points af42;
            }
            forwarding-class FC-LOW {
                loss-priority high code-points af13;
                loss-priority low code-points [ cs1 af11 ];
                loss-priority medium-high code-points af12;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-points af23;
                loss-priority low code-points [ cs2 af21 ];
                loss-priority medium-high code-points af22;
            }
            forwarding-class FC-REALTIME {
                loss-priority low code-points ef;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-points cs5;
                loss-priority low code-points cs6;
            }
        }
    }
}
```

## evo/cos/classifier-exp.conf

```
/*
 * Topic:   MPLS EXP classifier (CL-MPLS) — ingress MPLS-to-FC mapping
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - Maps 3-bit MPLS EXP field to 8 forwarding classes
 *  - EXP 4 → FC-LLQ, EXP 5 → FC-REALTIME, EXP 6 → FC-SIGNALING
 *  - Applied on MPLS transport interfaces (ae units with family mpls)
 *  - All loss-priority = low (EXP has no drop-precedence encoding)
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/cos/cos-binding-transport.conf
 *  - evo/cos/forwarding-classes.conf
 *  - evo/cos/forwarding-classes.conf   (FC queue-num definitions)
 *  - evo/cos/rewrite-exp.conf          (egress FC → EXP marking)
 */

class-of-service {
    classifiers {
        exp CL-MPLS {
            import default;
            forwarding-class FC-BEST-EFFORT {
                loss-priority low code-points 000;
            }
            forwarding-class FC-CONTROL {
                loss-priority low code-points 111;
            }
            forwarding-class FC-HIGH {
                loss-priority low code-points 011;
            }
            forwarding-class FC-LLQ {
                loss-priority low code-points 100;
            }
            forwarding-class FC-LOW {
                loss-priority low code-points 001;
            }
            forwarding-class FC-MEDIUM {
                loss-priority low code-points 010;
            }
            forwarding-class FC-REALTIME {
                loss-priority low code-points 101;
            }
            forwarding-class FC-SIGNALING {
                loss-priority low code-points 110;
            }
        }
    }
}
```

## evo/cos/classifier-ieee-802.1.conf

```
/*
 * Topic:   802.1p classifier (CL-8021P) — ingress VLAN-tag-to-FC mapping
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - Maps 3-bit 802.1p PCP field to 8 forwarding classes
 *  - PCP 4 → FC-LLQ, PCP 5 → FC-REALTIME, PCP 6 → FC-SIGNALING
 *  - Applied on L2 access/trunk interfaces (EVPN-VPWS, ELAN)
 *  - All loss-priority = low (PCP has no drop-precedence encoding)
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/cos/cos-binding-l2-fronthaul.conf
 *  - evo/cos/forwarding-classes.conf
 *  - evo/cos/forwarding-classes.conf       (FC queue-num definitions)
 *  - evo/cos/rewrite-ieee-802.1.conf       (egress FC → PCP marking)
 */

class-of-service {
    classifiers {
        ieee-802.1 CL-8021P {
            import default;
            forwarding-class FC-BEST-EFFORT {
                loss-priority low code-points 000;
            }
            forwarding-class FC-CONTROL {
                loss-priority low code-points 111;
            }
            forwarding-class FC-HIGH {
                loss-priority low code-points 011;
            }
            forwarding-class FC-LLQ {
                loss-priority low code-points 100;
            }
            forwarding-class FC-LOW {
                loss-priority low code-points 001;
            }
            forwarding-class FC-MEDIUM {
                loss-priority low code-points 010;
            }
            forwarding-class FC-REALTIME {
                loss-priority low code-points 101;
            }
            forwarding-class FC-SIGNALING {
                loss-priority low code-points 110;
            }
        }
    }
}
```

## evo/cos/cos-binding-irb.conf

```
/*
 * Topic:   CoS interface binding — IRB with static FC-REALTIME + DSCP rewrite
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - Static forwarding-class FC-REALTIME for IRB units — guarantees strict
 *    priority queuing for routed traffic on EVPN-ELAN IRB interfaces
 *  - DSCP rewrite ensures L3-routed packets leaving the IRB carry correct
 *    DSCP marking (EF for realtime) into the L3VPN domain
 *  - Used on IRB units associated with EVPN-ELAN + IRB services where
 *    the bridge domain carries time-sensitive traffic
 *
 * Pair with:
 *  - evo/cos/forwarding-classes.conf
 *  - evo/cos/scheduler-map.conf
 *  - evo/firewall/filter-mfc-ipv4-l3vpn-irb.conf
 *  - evo/firewall/filter-mfc-ipv6-l3vpn-irb.conf
 *  - evo/services/l3vpn-irb.conf
 *  - evo/cos/forwarding-classes.conf   (FC-REALTIME definition)
 *  - evo/cos/rewrite-dscp.conf         (RR-DSCP definition)
 *  - evo/cos/rewrite-dscp-ipv6.conf    (RR-DSCP-IPV6 definition)
 */

class-of-service {
    interfaces {
        <interface> {
            scheduler-map SM-5G-SCHEDULER;
            unit <unit-number> {
                forwarding-class FC-REALTIME;
                rewrite-rules {
                    dscp RR-DSCP;
                    dscp-ipv6 RR-DSCP-IPV6;
                }
            }
        }
    }
}
```

## evo/cos/cos-binding-l2-fronthaul-static.conf

```
/*
 * Topic:   CoS interface binding — L2 fronthaul with static FC-LLQ (guaranteed low-latency)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - Static forwarding-class FC-LLQ forces ALL traffic on this unit into
 *    the low-latency queue regardless of packet marking
 *  - Paired with 802.1p rewrite so downstream L2 devices see correct PCP
 *  - Used on dedicated eCPRI fronthaul units where classification is
 *    unnecessary (all traffic is fronthaul by VLAN assignment)
 *  - The key differentiator from cos-binding-l2-fronthaul.conf: this
 *    variant bypasses classification entirely for deterministic queuing
 *
 * Pair with:
 *  - evo/cos/forwarding-classes.conf
 *  - evo/cos/scheduler-map.conf
 *  - evo/firewall/filter-mf-ecpri-fronthaul.conf
 *  - evo/services/evpn-vpws-vlan-based-mh.conf
 *  - evo/cos/forwarding-classes.conf    (FC-LLQ definition)
 *  - evo/cos/rewrite-ieee-802.1.conf   (RR-8021P definition)
 *  - evo/cos/schedulers-low-latency.conf (SC-LLQ with priority low-latency)
 */

class-of-service {
    interfaces {
        <interface> {
            scheduler-map SM-5G-SCHEDULER;
            unit <unit-number> {
                forwarding-class FC-LLQ;
                rewrite-rules {
                    ieee-802.1 RR-8021P;
                }
            }
        }
    }
}
```

## evo/cos/cos-binding-l2-fronthaul.conf

```
/*
 * Topic:   CoS interface binding — L2 fronthaul with 802.1p classification
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - Per-unit 802.1p PCP classification and rewrite (CL-8021P / RR-8021P)
 *  - Applied to EVPN-VPWS/ELAN L2 service units carrying eCPRI fronthaul
 *  - PCP bits classify directly into FC-LLQ (PCP 4) for low-latency queuing
 *  - No static FC — relies on dynamic 802.1p classification from DU tagging
 *  - Compare with cos-binding-l2-fronthaul-static.conf where FC is pinned
 *
 * Pair with:
 *  - evo/cos/scheduler-map.conf
 *  - evo/interfaces/lag-esi.conf
 *  - evo/oam/cfm-maintenance-domain.conf
 *  - evo/services/bgp-vpls-vsi.conf
 *  - evo/services/evpn-elan-vlan-based.conf
 *  - evo/cos/classifier-ieee-802.1.conf (CL-8021P definition)
 *  - evo/cos/rewrite-ieee-802.1.conf    (RR-8021P definition)
 */

class-of-service {
    interfaces {
        <interface> {
            scheduler-map SM-5G-SCHEDULER;
            unit <unit-number> {
                classifiers {
                    ieee-802.1 CL-8021P;
                }
                rewrite-rules {
                    ieee-802.1 RR-8021P;
                }
            }
        }
    }
}
```

## evo/cos/cos-binding-l3-service.conf

```
/*
 * Topic:   CoS interface binding — L3 service (DSCP classifier + rewrite per unit)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - Per-unit DSCP + DSCP-IPv6 classification and rewrite
 *  - No static forwarding-class — traffic is classified dynamically
 *  - Applied to L3VPN service units (inet/inet6 traffic)
 *  - Scheduler-map is applied at the interface level (not shown per-unit)
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/cos/scheduler-map.conf
 *  - evo/cos/classifier-dscp.conf      (CL-DSCP definition)
 *  - evo/cos/classifier-dscp-ipv6.conf (CL-DSCP-IPV6 definition)
 *  - evo/cos/rewrite-dscp.conf         (RR-DSCP definition)
 *  - evo/cos/rewrite-dscp-ipv6.conf    (RR-DSCP-IPV6 definition)
 */

class-of-service {
    interfaces {
        <interface> {
            scheduler-map SM-5G-SCHEDULER;
            unit <unit-number> {
                classifiers {
                    dscp CL-DSCP;
                    dscp-ipv6 CL-DSCP-IPV6;
                }
                rewrite-rules {
                    dscp RR-DSCP;
                    dscp-ipv6 RR-DSCP-IPV6;
                }
            }
        }
    }
}
```

## evo/cos/cos-binding-transport.conf

```
/*
 * Topic:   CoS interface binding — MPLS transport (EXP classifier + rewrite)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - Applies scheduler-map SM-5G-SCHEDULER at interface level
 *  - Classifies inbound MPLS traffic via EXP bits (CL-MPLS)
 *  - Rewrites outbound EXP bits (RR-MPLS) to preserve QoS marking
 *  - Applied on ae interface unit 0 (transport backbone links)
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/cos/classifier-exp.conf   (CL-MPLS definition)
 *  - evo/cos/rewrite-exp.conf      (RR-MPLS definition)
 *  - evo/cos/scheduler-map.conf    (SM-5G-SCHEDULER definition)
 */

class-of-service {
    interfaces {
        <ae-interface> {
            scheduler-map SM-5G-SCHEDULER;
            unit 0 {
                classifiers {
                    exp CL-MPLS;
                }
                rewrite-rules {
                    exp RR-MPLS;
                }
            }
        }
    }
}
```

## evo/cos/forwarding-classes.conf

```
/*
 * Topic:   8-class forwarding-class model (O-RAN multi-priority alignment)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - 8 forwarding classes aligned to O-RAN multi-priority queuing model
 *  - FC-LLQ (queue 6) is the low-latency queue for eCPRI/fronthaul
 *  - FC-REALTIME (queue 5) for strict priority real-time flows (PTP, sync)
 *  - FC-SIGNALING (queue 7) for control-plane signaling
 *  - Queue numbering is consistent across all platforms in this JVD
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/cos/classifier-dscp.conf
 *  - evo/cos/classifier-exp.conf
 *  - evo/cos/classifier-ieee-802.1.conf
 *  - evo/cos/cos-binding-irb.conf
 *  - evo/cos/cos-binding-l2-fronthaul-static.conf
 *  - evo/cos/rewrite-dscp.conf
 *  - evo/cos/rewrite-exp.conf
 *  - evo/cos/rewrite-ieee-802.1.conf
 *  - evo/cos/schedulers-low-latency.conf    (ACX: LLQ with priority low-latency)
 *  - evo/cos/schedulers-strict-high.conf    (PTX: LLQ with priority strict-high)
 *  - evo/cos/scheduler-map.conf             (FC → scheduler binding)
 */

class-of-service {
    forwarding-classes {
        class FC-BEST-EFFORT queue-num 0;
        class FC-CONTROL queue-num 3;
        class FC-HIGH queue-num 4;
        class FC-LLQ queue-num 6;
        class FC-LOW queue-num 1;
        class FC-MEDIUM queue-num 2;
        class FC-REALTIME queue-num 5;
        class FC-SIGNALING queue-num 7;
    }
}
```

## evo/cos/rewrite-dscp-ipv6.conf

```
/*
 * Topic:   DSCP-IPv6 rewrite rule (RR-DSCP-IPV6) — egress FC-to-DSCP marking for IPv6
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - Identical marking logic to RR-DSCP but applied to IPv6 egress
 *  - Required when inet6 traffic is rewritten separately from inet
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/cos/cos-binding-irb.conf
 *  - evo/cos/cos-binding-l3-service.conf
 *  - evo/cos/forwarding-classes.conf
 *  - evo/cos/classifier-dscp-ipv6.conf (ingress counterpart)
 *  - evo/cos/rewrite-dscp.conf         (IPv4 counterpart)
 */

class-of-service {
    rewrite-rules {
        dscp-ipv6 RR-DSCP-IPV6 {
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-point be;
                loss-priority low code-point be;
            }
            forwarding-class FC-CONTROL {
                loss-priority high code-point cs7;
                loss-priority low code-point cs7;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-point af33;
                loss-priority low code-point af31;
                loss-priority medium-high code-point af32;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-point af43;
                loss-priority low code-point af41;
                loss-priority medium-high code-point af42;
            }
            forwarding-class FC-LOW {
                loss-priority high code-point af13;
                loss-priority low code-point af11;
                loss-priority medium-high code-point af12;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-point af23;
                loss-priority low code-point af21;
                loss-priority medium-high code-point af22;
            }
            forwarding-class FC-REALTIME {
                loss-priority high code-point ef;
                loss-priority low code-point ef;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-point cs5;
                loss-priority low code-point cs6;
            }
        }
    }
}
```

## evo/cos/rewrite-dscp.conf

```
/*
 * Topic:   DSCP rewrite rule (RR-DSCP) — egress FC-to-DSCP marking
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - Rewrites outgoing DSCP based on FC + loss-priority at egress
 *  - AF4x codes for FC-LLQ, EF for FC-REALTIME (matches classifier in reverse)
 *  - Applied on L3 service interface units via cos-binding
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/cos/cos-binding-irb.conf
 *  - evo/cos/cos-binding-l3-service.conf
 *  - evo/cos/forwarding-classes.conf
 *  - evo/cos/rewrite-dscp-ipv6.conf
 *  - evo/cos/classifier-dscp.conf      (ingress counterpart)
 *  - evo/cos/forwarding-classes.conf   (FC definitions)
 */

class-of-service {
    rewrite-rules {
        dscp RR-DSCP {
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-point be;
                loss-priority low code-point be;
            }
            forwarding-class FC-CONTROL {
                loss-priority high code-point cs7;
                loss-priority low code-point cs7;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-point af33;
                loss-priority low code-point af31;
                loss-priority medium-high code-point af32;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-point af43;
                loss-priority low code-point af41;
                loss-priority medium-high code-point af42;
            }
            forwarding-class FC-LOW {
                loss-priority high code-point af13;
                loss-priority low code-point af11;
                loss-priority medium-high code-point af12;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-point af23;
                loss-priority low code-point af21;
                loss-priority medium-high code-point af22;
            }
            forwarding-class FC-REALTIME {
                loss-priority high code-point ef;
                loss-priority low code-point ef;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-point cs5;
                loss-priority low code-point cs6;
            }
        }
    }
}
```

## evo/cos/rewrite-exp.conf

```
/*
 * Topic:   MPLS EXP rewrite rule (RR-MPLS) — egress FC-to-EXP marking
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - Rewrites outgoing MPLS EXP bits based on FC + loss-priority
 *  - EXP 4 ← FC-LLQ, EXP 5 ← FC-REALTIME, EXP 6 ← FC-SIGNALING
 *  - All loss-priority levels map to the same code-point per FC (3 bits
 *    cannot encode drop-precedence)
 *  - Applied on MPLS transport AE interfaces
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/cos/cos-binding-transport.conf
 *  - evo/cos/forwarding-classes.conf
 *  - evo/cos/classifier-exp.conf       (ingress counterpart)
 *  - evo/cos/forwarding-classes.conf   (FC definitions)
 */

class-of-service {
    rewrite-rules {
        exp RR-MPLS {
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-point 000;
                loss-priority low code-point 000;
            }
            forwarding-class FC-CONTROL {
                loss-priority high code-point 111;
                loss-priority low code-point 111;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-point 011;
                loss-priority low code-point 011;
                loss-priority medium-high code-point 011;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-point 100;
                loss-priority low code-point 100;
                loss-priority medium-high code-point 100;
            }
            forwarding-class FC-LOW {
                loss-priority high code-point 001;
                loss-priority low code-point 001;
                loss-priority medium-high code-point 001;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-point 010;
                loss-priority low code-point 010;
                loss-priority medium-high code-point 010;
            }
            forwarding-class FC-REALTIME {
                loss-priority high code-point 101;
                loss-priority low code-point 101;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-point 110;
                loss-priority low code-point 110;
            }
        }
    }
}
```

## evo/cos/rewrite-ieee-802.1.conf

```
/*
 * Topic:   802.1p rewrite rule (RR-8021P) — egress FC-to-PCP marking
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - Rewrites outgoing 802.1p PCP bits based on FC + loss-priority
 *  - PCP 4 ← FC-LLQ, PCP 5 ← FC-REALTIME, PCP 6 ← FC-SIGNALING
 *  - All loss-priority levels map to the same code-point per FC
 *  - Applied on L2 service interfaces (EVPN-VPWS access ports)
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/cos/cos-binding-l2-fronthaul-static.conf
 *  - evo/cos/cos-binding-l2-fronthaul.conf
 *  - evo/cos/forwarding-classes.conf
 *  - evo/cos/classifier-ieee-802.1.conf (ingress counterpart)
 *  - evo/cos/forwarding-classes.conf    (FC definitions)
 */

class-of-service {
    rewrite-rules {
        ieee-802.1 RR-8021P {
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-point 000;
                loss-priority low code-point 000;
            }
            forwarding-class FC-CONTROL {
                loss-priority high code-point 111;
                loss-priority low code-point 111;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-point 011;
                loss-priority low code-point 011;
                loss-priority medium-high code-point 011;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-point 100;
                loss-priority low code-point 100;
                loss-priority medium-high code-point 100;
            }
            forwarding-class FC-LOW {
                loss-priority high code-point 001;
                loss-priority low code-point 001;
                loss-priority medium-high code-point 001;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-point 010;
                loss-priority low code-point 010;
                loss-priority medium-high code-point 010;
            }
            forwarding-class FC-REALTIME {
                loss-priority high code-point 101;
                loss-priority low code-point 101;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-point 110;
                loss-priority low code-point 110;
            }
        }
    }
}
```

## evo/cos/scheduler-map.conf

```
/*
 * Topic:   Scheduler-map binding FCs to schedulers (SM-5G-SCHEDULER)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - Maps all 8 forwarding classes to their corresponding schedulers
 *  - Referenced by interface CoS bindings (scheduler-map SM-5G-SCHEDULER)
 *  - The scheduler-map itself is identical across all devices; the
 *    underlying scheduler behavior (low-latency vs strict-high) is
 *    determined by the scheduler definition, not the map
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/cos/cos-binding-transport.conf
 *  - evo/cos/forwarding-classes.conf
 *  - evo/cos/forwarding-classes.conf        (FC definitions)
 *  - evo/cos/schedulers-low-latency.conf    (ACX scheduler priorities)
 *  - evo/cos/schedulers-strict-high.conf    (PTX scheduler priorities)
 */

class-of-service {
    scheduler-maps {
        SM-5G-SCHEDULER {
            forwarding-class FC-BEST-EFFORT scheduler SC-BEST-EFFORT;
            forwarding-class FC-CONTROL scheduler SC-CONTROL;
            forwarding-class FC-HIGH scheduler SC-HIGH;
            forwarding-class FC-LLQ scheduler SC-LLQ;
            forwarding-class FC-LOW scheduler SC-LOW;
            forwarding-class FC-MEDIUM scheduler SC-MEDIUM;
            forwarding-class FC-REALTIME scheduler SC-REALTIME;
            forwarding-class FC-SIGNALING scheduler SC-SIGNALING;
        }
    }
}
```

## evo/cos/schedulers-low-latency.conf

```
/*
 * Topic:   Scheduler definitions with priority low-latency (ACX LLQ)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - SC-LLQ uses `priority low-latency` — the ACX-specific hardware LLQ
 *    scheduler that guarantees sub-10µs per-hop latency under congestion
 *  - SC-REALTIME uses `priority medium-high` (shaped strict priority)
 *  - SC-SIGNALING uses `priority strict-high` (highest strict priority
 *    after low-latency; protects control-plane even under LLQ load)
 *  - SC-HIGH/MEDIUM/LOW/BEST-EFFORT are WFQ with transmit-rate percentages
 *  - Compare with junos/cos/schedulers-strict-high.conf where LLQ falls
 *    back to strict-high (MX/PTX do not support priority low-latency)
 *
 * Pair with:
 *  - evo/cos/cos-binding-l2-fronthaul-static.conf
 *  - evo/firewall/filter-mf-ecpri-fronthaul.conf
 *  - evo/cos/forwarding-classes.conf   (FC definitions these schedulers serve)
 *  - evo/cos/scheduler-map.conf        (FC → scheduler binding)
 */

class-of-service {
    schedulers {
        SC-BEST-EFFORT {
            transmit-rate {
                remainder;
            }
            buffer-size {
                remainder;
            }
            priority low;
        }
        SC-CONTROL {
            shaping-rate percent 5;
            buffer-size percent 5;
            priority high;
        }
        SC-HIGH {
            transmit-rate percent 40;
            buffer-size percent 30;
            priority low;
        }
        SC-LLQ {
            shaping-rate percent 40;
            buffer-size percent 10;
            priority low-latency;
        }
        SC-LOW {
            transmit-rate percent 20;
            priority low;
        }
        SC-MEDIUM {
            transmit-rate percent 30;
            buffer-size percent 20;
            priority low;
        }
        SC-REALTIME {
            shaping-rate percent 30;
            buffer-size percent 20;
            priority medium-high;
        }
        SC-SIGNALING {
            shaping-rate percent 5;
            buffer-size percent 5;
            priority strict-high;
        }
    }
}
```

## evo/cos/schedulers-strict-high.conf

```
/*
 * Topic:   Scheduler definitions with priority strict-high (PTX core transit)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - SC-LLQ uses `priority strict-high` — PTX does not support the ACX
 *    `priority low-latency` hardware scheduler; strict-high is the
 *    highest available strict priority on this platform
 *  - SC-SIGNALING uses `priority high` (one tier below strict-high)
 *  - All other schedulers (rates, buffer-size) are identical to the
 *    ACX low-latency variant — only the priority keywords differ
 *  - Body is byte-identical to the Junos (MX) sibling
 *  - Core routers are transit-only; CoS preserves marking end-to-end
 *
 * Pair with:
 *  - evo/cos/forwarding-classes.conf   (FC definitions these schedulers serve)
 *  - evo/cos/scheduler-map.conf        (FC → scheduler binding)
 */

class-of-service {
    schedulers {
        SC-BEST-EFFORT {
            transmit-rate {
                remainder;
            }
            buffer-size {
                remainder;
            }
            priority low;
        }
        SC-CONTROL {
            shaping-rate percent 5;
            buffer-size percent 5;
            priority high;
        }
        SC-HIGH {
            transmit-rate percent 40;
            buffer-size percent 30;
            priority low;
        }
        SC-LLQ {
            shaping-rate percent 40;
            buffer-size percent 10;
            priority strict-high;
        }
        SC-LOW {
            transmit-rate percent 20;
            priority low;
        }
        SC-MEDIUM {
            transmit-rate percent 30;
            buffer-size percent 20;
            priority low;
        }
        SC-REALTIME {
            shaping-rate percent 30;
            buffer-size percent 20;
            priority medium-high;
        }
        SC-SIGNALING {
            shaping-rate percent 5;
            buffer-size percent 5;
            priority high;
        }
    }
}
```

## evo/firewall/filter-mf-ecpri-fronthaul.conf

```
/*
 * Topic:   Multi-field eCPRI filter — MAC-based FC classification for fronthaul (CCC)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 *
 * Highlights:
 *  - Family CCC (circuit cross-connect) filter for EVPN-VPWS fronthaul
 *  - Multi-field classification using MAC addresses to steer eCPRI flows:
 *    - learn-vlan-1p-priority 3 → FC-HIGH (management plane)
 *    - learn-vlan-1p-priority 7 → FC-BEST-EFFORT (low-priority sync)
 *    - source-mac <ecpri-user-plane> → FC-LLQ (fronthaul user-plane)
 *    - source-mac <ecpri-ctrl-plane> → FC-SIGNALING (eCPRI C-plane)
 *    - source-mac <ecpri-sync>       → FC-CONTROL (synchronization)
 *    - destination-mac <timing-sync> → FC-REALTIME (PTP/timing)
 *  - MAC addresses are lab-specific; replace with site MAC pools
 *  - interface-specific allows per-unit counters
 *  - AG variant names per-AN: FF-MF-EVPN-VPWS-MH-TO-AN{1,3,4}
 *  - AN variant name: FF-MF-EVPN-VPWS-MH (applied ingress on DU-facing ports)
 *
 * Pair with:
 *  - evo/cos/forwarding-classes.conf
 *  - evo/cos/cos-binding-l2-fronthaul-static.conf  (static FC-LLQ binding)
 *  - evo/cos/schedulers-low-latency.conf           (SC-LLQ low-latency)
 *  - evo/services/evpn-vpws-vlan-based-mh.conf     (EVPN-VPWS service)
 */

firewall {
    family ccc {
        filter <filter-name> {
            interface-specific;
            term 1 {
                from {
                    learn-vlan-1p-priority 3;
                }
                then forwarding-class FC-HIGH;
            }
            term 2 {
                from {
                    learn-vlan-1p-priority 7;
                }
                then forwarding-class FC-BEST-EFFORT;
            }
            term 3 {
                from {
                    source-mac-address {
                        <ecpri-user-plane-mac-1>/48;
                        <ecpri-user-plane-mac-2>/48;
                        /* ... additional eCPRI user-plane source MACs ... */
                    }
                }
                then forwarding-class FC-LLQ;
            }
            term 4 {
                from {
                    source-mac-address {
                        <ecpri-ctrl-plane-mac-1>/48;
                        <ecpri-ctrl-plane-mac-2>/48;
                        /* ... additional eCPRI control-plane source MACs ... */
                    }
                }
                then forwarding-class FC-SIGNALING;
            }
            term 5 {
                from {
                    source-mac-address {
                        <ecpri-sync-mac-1>/48;
                        <ecpri-sync-mac-2>/48;
                        /* ... additional eCPRI sync source MACs ... */
                    }
                }
                then forwarding-class FC-CONTROL;
            }
            term 6 {
                from {
                    destination-mac-address {
                        <timing-sync-mac-1>/48;
                        <timing-sync-mac-2>/48;
                        /* ... additional PTP/timing destination MACs ... */
                    }
                }
                then forwarding-class FC-REALTIME;
            }
        }
    }
}
```

## evo/firewall/filter-mfc-ipv4-l3vpn-irb.conf

```
/*
 * Topic:   Multi-field classifier — IPv4 DSCP-to-FC (L3VPN IRB ingress)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c
 *
 * Highlights:
 *  - Interface-specific filter applied on IRB units (input direction)
 *  - Overrides CoS classifier: forces FC based on DSCP for traffic
 *    entering the L3VPN from a bridged domain
 *  - cs1 → FC-REALTIME, cs2 → FC-HIGH, cs3 → FC-MEDIUM, cs4 → FC-LOW
 *  - Default term accepts unmatched traffic (uses CoS classifier instead)
 *  - Two named variants in the JVD: FF-MFC-IPV4-L3VPN-BD-IRB (bridged-domain
 *    IRB) and FF-MFC-IPV4-L3VPN-EVPN-IRB (EVPN IRB) — bodies identical
 *
 * Pair with:
 *  - evo/cos/forwarding-classes.conf
 *  - evo/firewall/filter-mfc-ipv6-l3vpn-irb.conf  (IPv6 counterpart)
 *  - evo/cos/cos-binding-irb.conf                  (CoS binding on IRB units)
 */

firewall {
    family inet {
        filter <filter-name> {
            interface-specific;
            term fc-realtime {
                from {
                    dscp cs1;
                }
                then forwarding-class FC-REALTIME;
            }
            term fc-high {
                from {
                    dscp cs2;
                }
                then forwarding-class FC-HIGH;
            }
            term fc-medium {
                from {
                    dscp cs3;
                }
                then forwarding-class FC-MEDIUM;
            }
            term fc-low {
                from {
                    dscp cs4;
                }
                then forwarding-class FC-LOW;
            }
            term default {
                then accept;
            }
        }
    }
}
```

## evo/firewall/filter-mfc-ipv6-l3vpn-irb.conf

```
/*
 * Topic:   Multi-field classifier — IPv6 traffic-class-to-FC (L3VPN IRB ingress)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c
 *
 * Highlights:
 *  - IPv6 counterpart of filter-mfc-ipv4-l3vpn-irb.conf
 *  - Uses `traffic-class` (IPv6 traffic class field) instead of `dscp`
 *  - Same FC assignment: cs1→REALTIME, cs2→HIGH, cs3→MEDIUM, cs4→LOW
 *  - Interface-specific, applied input on IRB units
 *  - Two named variants: FF-MFC-IPV6-L3VPN-BD-IRB / FF-MFC-IPV6-L3VPN-EVPN-IRB
 *
 * Pair with:
 *  - evo/cos/forwarding-classes.conf
 *  - evo/firewall/filter-mfc-ipv4-l3vpn-irb.conf  (IPv4 counterpart)
 *  - evo/cos/cos-binding-irb.conf                  (CoS binding on IRB units)
 */

firewall {
    family inet6 {
        filter <filter-name> {
            interface-specific;
            term fc-realtime {
                from {
                    traffic-class cs1;
                }
                then forwarding-class FC-REALTIME;
            }
            term fc-high {
                from {
                    traffic-class cs2;
                }
                then forwarding-class FC-HIGH;
            }
            term fc-medium {
                from {
                    traffic-class cs3;
                }
                then forwarding-class FC-MEDIUM;
            }
            term fc-low {
                from {
                    traffic-class cs4;
                }
                then forwarding-class FC-LOW;
            }
            term default {
                then accept;
            }
        }
    }
}
```

## evo/interfaces/lag-esi.conf

```
/*
 * Topic:   LAG interface with ESI for EVPN multi-homing
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 *
 * Highlights:
 *  - Aggregated Ethernet with flexible-vlan-tagging for multi-service
 *  - LACP active with fast periodic (1s) for sub-second LAG failover
 *  - system-id must match across AG pair for EVPN-MH ESI
 *  - Per-unit ESI with all-active for active-active multi-homing
 *  - vlan-ccc encapsulation for EVPN-VPWS units (L2 circuit)
 *  - vlan-bridge encapsulation for EVPN-ELAN units (bridged)
 *  - Each unit maps to one routing-instance (EVPN-VPWS or mac-vrf)
 *
 * Pair with:
 *  - evo/services/evpn-vpws-vlan-based-mh.conf (VPWS service)
 *  - evo/services/evpn-elan-vlan-based.conf    (ELAN service)
 *  - evo/services/l3vpn-irb.conf           (L3VPN hosting IRB)
 *  - evo/cos/cos-binding-l2-fronthaul.conf     (CoS per-unit)
 */

interfaces {
    <ae-interface> {
        description <description>;
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        aggregated-ether-options {
            lacp {
                active;
                periodic fast;
                system-id <lacp-system-id>;
            }
        }
        /* repeat per EVPN-VPWS service */
        unit <unit-number> {
            description <vpws-service-description>;
            encapsulation vlan-ccc;
            vlan-id <vlan-id>;
            esi {
                <esi-value>;
                all-active;
            }
            family ccc {
                filter {
                    input <firewall-filter>;
                }
            }
        }
        /* repeat per EVPN-ELAN / L3VPN-IRB service */
        unit <unit-number> {
            description <elan-service-description>;
            encapsulation vlan-bridge;
            vlan-id <vlan-id>;
            esi {
                <esi-value>;
                all-active;
            }
        }
    }
}
```

## evo/interfaces/vlan-bridge.conf

```
/*
 * Topic:   Service sub-interface with vlan-bridge encapsulation
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c
 *
 * Highlights:
 *  - Physical (non-LAG) interface for single-homed L2 services
 *  - flexible-vlan-tagging + flexible-ethernet-services: multi-encap parent
 *  - vlan-bridge encapsulation: unit is placed into a virtual-switch or mac-vrf
 *  - Used for BGP-VPLS midhaul circuits toward SAG
 *  - No ESI: directly connected (single-homed path)
 *  - speed 10g configured where port supports multi-rate
 *
 * Pair with:
 *  - evo/services/bgp-vpls-vsi.conf  (virtual-switch service)
 *  - evo/services/evpn-elan-vlan-based.conf     (mac-vrf ELAN)
 *  - evo/cos/cos-binding-l2-fronthaul.conf      (CoS per-unit)
 */

interfaces {
    <interface> {
        description <description>;
        flexible-vlan-tagging;
        speed 10g;
        encapsulation flexible-ethernet-services;
        /* repeat per BGP-VPLS / ELAN service */
        unit <unit-number> {
            description <service-description>;
            encapsulation vlan-bridge;
            vlan-id <vlan-id>;
        }
    }
}
```

## evo/interfaces/vlan-ccc.conf

```
/*
 * Topic:   Service sub-interface with vlan-ccc encapsulation
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c
 *
 * Highlights:
 *  - Physical (non-LAG) interface for single-homed EVPN-VPWS circuits
 *  - flexible-vlan-tagging + flexible-ethernet-services: multi-encap parent
 *  - vlan-ccc encapsulation: unit carries L2 circuit for EVPN-VPWS
 *  - family ccc enables circuit cross-connect forwarding
 *  - No ESI: directly connected (single-homed path)
 *  - speed 10g configured where port supports multi-rate
 *
 * Pair with:
 *  - evo/services/evpn-vpws-vlan-based-mh.conf      (VPWS service)
 *  - evo/cos/cos-binding-l2-fronthaul-static.conf   (static FC-LLQ)
 */

interfaces {
    <interface> {
        description <description>;
        flexible-vlan-tagging;
        speed 10g;
        encapsulation flexible-ethernet-services;
        /* repeat per EVPN-VPWS service */
        unit <unit-number> {
            description <service-description>;
            encapsulation vlan-ccc;
            vlan-id <vlan-id>;
            family ccc;
        }
    }
}
```

## evo/oam/cfm-maintenance-domain.conf

```
/*
 * Topic:   CFM maintenance-domain with continuity-check MEPs (802.1ag OAM)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 *
 * Highlights:
 *  - CFM (Connectivity Fault Management, IEEE 802.1ag) for L2 service monitoring
 *  - MD level 5 with 2-octet short-name format maintenance-associations
 *  - Continuity-check (CC): 1-second interval, loss-threshold 10 (10s detect)
 *  - MEP direction: up (monitors the VPLS/ELAN service path, not the link)
 *  - One maintenance-association per service (mapped to interface unit)
 *  - Enables proactive fault detection on midhaul BGP-VPLS circuits
 *
 * Pair with:
 *  - evo/services/bgp-vpls-vsi.conf (monitored service)
 *  - evo/cos/cos-binding-l2-fronthaul.conf     (CoS on monitored units)
 */

protocols {
    oam {
        ethernet {
            connectivity-fault-management {
                maintenance-domain <md-name> {
                    level <level>;
                    name-format none;
                    maintenance-association <ma-id> {
                        short-name-format 2octet;
                        continuity-check {
                            interval 1s;
                            loss-threshold 10;
                            hold-interval 1;
                        }
                        mep <local-mep-id> {
                            interface <interface>.<unit>;
                            direction up;
                            remote-mep <remote-mep-id>;
                        }
                    }
                }
            }
        }
    }
}
```

## evo/policy/allow-loopback.conf

```
/*
 * Topic:   ALLOW_LOOPBACK — rib-group import filter for labeled-unicast
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - Permits loopback routes (host routes /32) to be imported from inet.3 to inet.0
 *  - Used by rib-group inet3-to-inet0 in BGP labeled-unicast
 *  - Ensures MPLS next-hops resolve via the IGP for service overlays
 *  - orlonger matches /32 and any more-specific (effectively any host route)
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/transport/bgp-internal.conf   (rib-group referencing this policy)
 */

policy-options {
    policy-statement ALLOW_LOOPBACK {
        from {
            route-filter 0.0.0.0/32 orlonger;
        }
        then accept;
    }
}
```

## evo/policy/next-hop-self.conf

```
/*
 * Topic:   next-hop-self BGP export policy
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - Forces next-hop-self on all advertised BGP routes
 *  - Applied as export policy on iBGP groups (transport and service families)
 *  - Ensures remote peers can resolve next-hop via local IGP
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/transport/bgp-internal.conf   (iBGP group referencing this policy)
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

## evo/policy/pplb.conf

```
/*
 * Topic:   Per-packet load-balance policy (PPLB)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - Enables per-flow (per-packet) ECMP load-balancing in the forwarding table
 *  - Applied via routing-options forwarding-table export PPLB
 *  - Despite the name, modern Junos treats this as per-flow (5-tuple hash)
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/transport/load-balance-pplb.conf       (forwarding-table export)
 *  - evo/transport/forwarding-options-hash.conf  (hash-key tuning)
 */

policy-options {
    policy-statement PPLB {
        then {
            load-balance per-packet;
            accept;
        }
    }
}
```

## evo/policy/sr-nonzero-loopbacks.conf

```
/*
 * Topic:   SR non-zero loopback advertisement (IPv4 + IPv6 prefix-segment)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - Advertises additional loopback addresses (beyond lo0.0 primary) into
 *    IS-IS with SR prefix-segment indices
 *  - Allows anycast or per-service loopbacks to be SR-reachable
 *  - Exported via ISIS export policy (protocols isis export [... SR_NONZERO_...])
 *  - Index values are per-device; coordinate with SID allocation plan
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/transport/isis-global.conf    (ISIS export referencing these policies)
 */

policy-options {
    policy-statement SR_NONZERO_LOOPBACKS_V4 {
        term t1 {
            from {
                route-filter <secondary-loopback-v4>/32 exact;
            }
            then {
                prefix-segment {
                    index <ipv4-secondary-sid-index>;
                }
                accept;
            }
        }
    }
    policy-statement SR_NONZERO_LOOPBACKS_V6 {
        term t1 {
            from {
                family inet6;
                route-filter <secondary-loopback-v6>/128 exact;
            }
            then {
                prefix-segment {
                    index <ipv6-secondary-sid-index>;
                }
                accept;
            }
        }
    }
}
```

## evo/services/bgp-vpls-vsi.conf

```
/*
 * Topic:   BGP-VPLS virtual-switch with FAT pseudowire (midhaul L2)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 *
 * Highlights:
 *  - instance-type virtual-switch with BGP-VPLS signaling (RFC 4761)
 *  - FAT pseudowire via flow-label-transmit / flow-label-receive for
 *    entropy-based LAG/ECMP load-balancing on midhaul circuits
 *  - site / site-identifier for auto-discovery and split-horizon
 *  - site-range 65534, label-block-size 4 (capacity planning)
 *  - no-tunnel-services: uses inline MPLS (no tunnel PIC needed)
 *  - vlans stanza maps one VLAN per instance (vlan-based model)
 *  - Hundreds of instances: one per midhaul service to SAG
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/interfaces/vlan-bridge.conf         (vlan-bridge access units)
 *  - evo/oam/cfm-maintenance-domain.conf
 *  - evo/cos/cos-binding-l2-fronthaul.conf  (802.1p on access units)
 * JVD service mapping:
 *   (no instances found in topology registry)
 *
 */

routing-instances {
    <instance-name> {
        instance-type virtual-switch;
        protocols {
            vpls {
                site <site-name> {
                    site-identifier <site-id>;
                }
                site-range 65534;
                label-block-size 4;
                no-tunnel-services;
                flow-label-transmit;
                flow-label-receive;
            }
        }
        description <description>;
        route-distinguisher <router-id>:<rd-value>;
        vrf-target target:<asn>:<rt-value>;
        vlans {
            <vlan-name> {
                vlan-id <vlan-id>;
                interface <interface>.<unit>;
            }
        }
    }
}
```

## evo/services/evpn-elan-vlan-based.conf

```
/*
 * Topic:   EVPN-ELAN VLAN-based (mac-vrf, multi-homed fronthaul)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 *
 * Highlights:
 *  - mac-vrf instance with EVPN for multipoint L2 bridging
 *  - service-type vlan-based (one VLAN per bridge-domain, one BD per instance)
 *  - Used for fronthaul multipoint services where multiple DUs/O-RUs share a VLAN
 *  - Simple form: no IRB, no default-gateway — pure L2 bridging
 *  - vlans stanza maps VLAN-ID to interface attachment
 *
 * Pair with:
 *  - evo/interfaces/lag-esi.conf            (ESI LAG for MH)
 *  - evo/interfaces/vlan-bridge.conf        (non-LAG bridge units)
 *  - evo/services/l3vpn-irb.conf
 *  - evo/cos/cos-binding-l2-fronthaul.conf  (802.1p classification)
 * JVD service mapping:
 *   (no instances found in topology registry)
 *
 */

routing-instances {
    <instance-name> {
        instance-type mac-vrf;
        protocols {
            evpn;
        }
        service-type vlan-based;
        interface <interface>.<unit>;
        route-distinguisher <router-id>:<rd-value>;
        vrf-target target:<asn>:<rt-value>;
        vlans {
            <bridge-domain-name> {
                vlan-id <vlan-id>;
                interface <interface>.<unit>;
            }
        }
    }
}
```

## evo/services/evpn-fxc-vlan-aware.conf

```
/*
 * Topic:   EVPN-VPWS Flexible Cross-Connect (FXC, multi-homed)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 *
 * Highlights:
 *  - EVPN-VPWS with flexible-cross-connect-vlan-aware for multi-endpoint
 *    bundling (two VLANs cross-connected through the same VPWS instance)
 *  - Two interface/vpws-service-id pairs per instance: each sub-interface
 *    gets its own local/remote pseudowire ID within the same RD/RT
 *  - Used for eCPRI fronthaul where O-RU control-plane and user-plane
 *    VLANs are paired into a single VPWS FXC instance
 *  - Multi-homed: on ae26 LAG with ESI (AG pair)
 *  - Also present as single-homed (SH on et-1/0/1) for AN4
 *
 * Pair with:
 *  - evo/interfaces/lag-esi.conf                    (ESI LAG for MH)
 *  - evo/interfaces/vlan-ccc.conf                   (non-LAG CCC units)
 *  - evo/cos/cos-binding-l2-fronthaul-static.conf   (static FC-LLQ)
 *  - evo/firewall/filter-mf-ecpri-fronthaul.conf    (MAC-based FC filter)
 */

routing-instances {
    <instance-name> {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface <interface-a>.<unit-a> {
                    vpws-service-id {
                        local <local-id-a>;
                        remote <remote-id-a>;
                    }
                }
                interface <interface-b>.<unit-b> {
                    vpws-service-id {
                        local <local-id-b>;
                        remote <remote-id-b>;
                    }
                }
                flexible-cross-connect-vlan-aware;
            }
        }
        interface <interface-a>.<unit-a>;
        interface <interface-b>.<unit-b>;
        route-distinguisher <router-id>:<rd-value>;
        vrf-target target:<asn>:<rt-value>;
    }
}
```

## evo/services/evpn-vpws-vlan-based-mh.conf

```
/*
 * Topic:   EVPN-VPWS VLAN-based multi-homed (eCPRI fronthaul)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 *
 * Highlights:
 *  - Point-to-point EVPN-VPWS for dedicated eCPRI fronthaul circuits
 *  - Multi-homed: AN dual-homed to AG pair (ESI on the AG-facing LAG)
 *  - vpws-service-id local/remote identifies the pseudowire endpoints
 *  - Hundreds of instances per device (one per O-RU/antenna element)
 *  - No flow-label (not needed for point-to-point single-flow circuits)
 *  - Combined with static FC-LLQ CoS binding for guaranteed low-latency
 *
 * Pair with:
 *  - evo/interfaces/lag-esi.conf                    (ESI LAG for MH)
 *  - evo/interfaces/vlan-ccc.conf                   (non-LAG CCC units)
 *  - evo/cos/cos-binding-l2-fronthaul-static.conf   (static FC-LLQ)
 *  - evo/firewall/filter-mf-ecpri-fronthaul.conf    (MAC-based FC filter)
 * JVD service mapping:
 *   (no instances found in topology registry)
 *
 */

routing-instances {
    <instance-name> {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface <interface>.<unit> {
                    vpws-service-id {
                        local <local-id>;
                        remote <remote-id>;
                    }
                }
            }
        }
        interface <interface>.<unit>;
        route-distinguisher <router-id>:<rd-value>;
        vrf-target target:<asn>:<rt-value>;
    }
}
```

## evo/services/l3vpn-irb.conf

```
/*
 * Topic:   L3VPN VRF with IRB (anycast gateway, vrf-table-label)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024
 *
 * Highlights:
 *  - instance-type vrf for L3VPN routing
 *  - IRB interface provides routing for EVPN-ELAN bridge-domains
 *  - vrf-table-label allocates a single MPLS label for the VRF
 *    (simplifies PE-to-PE label allocation)
 *  - router-id set explicitly per-instance (required for multi-VRF ECMP)
 *  - Anycast gateway model: same IRB IP on multiple PEs for active-active
 *
 * Pair with:
 *  - evo/interfaces/lag-esi.conf            (vlan-bridge access units)
 *  - evo/services/evpn-elan-vlan-based.conf (mac-vrf bridging to this VRF)
 *  - evo/cos/cos-binding-irb.conf           (FC-REALTIME on IRB units)
 * JVD service mapping:
 *   (no instances found in topology registry)
 *
 */

routing-instances {
    <instance-name> {
        instance-type vrf;
        routing-options {
            router-id <router-id>;
        }
        description <description>;
        interface irb.<irb-unit>;
        route-distinguisher <router-id>:<rd-value>;
        vrf-target target:<asn>:<rt-value>;
        vrf-table-label;
    }
}
```

## evo/transport/bgp-internal.conf

```
/*
 * Topic:   BGP internal (iBGP) — labeled-unicast + route-reflector
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - iBGP with inet/inet6 labeled-unicast for inter-area MPLS connectivity
 *  - rib-group inet3-to-inet0 installs labeled routes into inet.0 (for next-hop resolution)
 *  - CR devices act as route-reflectors (cluster-id = own router-id)
 *  - log-updown + multipath enabled at group or global level
 *  - export next-hop-self on iBGP peering sessions
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/policy/next-hop-self.conf     (BGP export policy)
 *  - evo/policy/allow-loopback.conf    (rib-group import filter)
 *  - evo/transport/isis-global.conf    (underlay providing next-hop reachability)
 */

protocols {
    bgp {
        group <group-name> {
            type internal;
            local-address <loopback-address>;
            family inet {
                labeled-unicast {
                    rib-group inet3-to-inet0;
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
            export next-hop-self;
            neighbor <peer-address>;
        }
        log-updown;
        multipath;
    }
}
```

## evo/transport/forwarding-options-hash.conf

```
/*
 * Topic:   Forwarding-options hash-key — ECMP/LAG hashing (L3+L4+MPLS)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr2_ptx10001-36mr
 *
 * Highlights:
 *  - inet/inet6: layer-3 + layer-4 hashing for fine-grained ECMP/LAG
 *  - MPLS: all-labels + payload ip — hashes entire label stack plus
 *    inner IP header for MPLS-encapsulated ECMP load-sharing
 *  - Critical for 5G xHaul where many EVPN-VPWS services share
 *    the same LAG members
 *
 * Pair with:
 *  - evo/transport/load-balance-pplb.conf
 *  - evo/transport/mpls-global.conf    (MPLS interface enablement)
 *  - evo/policy/pplb.conf              (per-packet load-balance policy)
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
    }
}
```

## evo/transport/isis-global.conf

```
/*
 * Topic:   IS-IS global — segment routing, SPF tuning, TI-LFA backup
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - Segment Routing: SRGB 16000 + 80000 range, node-segment with IPv4/IPv6 indices
 *  - explicit-null for penultimate-hop transparency (preserves QoS to egress)
 *  - Level 2 wide-metrics-only (required for TE and SR)
 *  - SPF delay 100ms with 5 rapid runs before dampening
 *  - Backup SPF: TI-LFA with up to 5 labels, uses source-packet-routing
 *  - Exports SR_NONZERO_LOOPBACKS_V4/V6 for multi-loopback SR advertisement
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/policy/sr-nonzero-loopbacks.conf
 *  - evo/transport/bgp-internal.conf
 *  - evo/transport/mpls-global.conf
 *  - evo/transport/isis-interface.conf         (per-interface config)
 *  - evo/policy/sr-nonzero-loopbacks.conf      (SR prefix-segment export)
 */

protocols {
    isis {
        interface lo0.0 {
            passive;
        }
        source-packet-routing {
            srgb start-label 16000 index-range 80000;
            node-segment {
                ipv4-index <ipv4-sid-index>;
                ipv6-index <ipv6-sid-index>;
            }
            explicit-null;
        }
        level 2 wide-metrics-only;
        spf-options {
            delay 100;
            rapid-runs 5;
        }
        backup-spf-options {
            use-post-convergence-lfa maximum-labels 5;
            use-source-packet-routing;
        }
        export [ SR_NONZERO_LOOPBACKS_V4 SR_NONZERO_LOOPBACKS_V6 ];
        ignore-attached-bit;
    }
}
```

## evo/transport/isis-interface.conf

```
/*
 * Topic:   IS-IS interface — level 2, TI-LFA, BFD, point-to-point
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - Level-2 only (level 1 disabled) — flat IS-IS domain
 *  - post-convergence-lfa with node-protection (TI-LFA)
 *  - BFD liveness-detection: 100ms minimum-interval × 3 multiplier = 300ms detect
 *  - Point-to-point on all inter-router links (no DIS election)
 *  - Metric 10 on all links (uniform cost for ECMP)
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/transport/isis-global.conf  (SR, spf-options, backup-spf-options)
 *  - evo/transport/mpls-global.conf  (MPLS interface enablement)
 */

protocols {
    isis {
        interface <ae-interface>.0 {
            level 2 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                metric 10;
            }
            level 1 disable;
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

## evo/transport/load-balance-pplb.conf

```
/*
 * Topic:   Forwarding-table load-balance + chained-composite-next-hop
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - export PPLB enables per-flow ECMP across equal-cost paths
 *  - chained-composite-next-hop for EVPN, L3VPN, and L2CKT services
 *    enables hierarchical next-hop chains (required for EVPN-VPWS MH)
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/policy/pplb.conf                     (PPLB policy definition)
 *  - evo/transport/forwarding-options-hash.conf (hash-key tuning)
 */

routing-options {
    forwarding-table {
        export PPLB;
        chained-composite-next-hop {
            ingress {
                l2ckt;
                evpn;
                l3vpn;
            }
        }
    }
}
```

## evo/transport/mpls-global.conf

```
/*
 * Topic:   MPLS global — PCE-controlled LSPs, TTL, ICMP tunneling, IPv6
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   ag1_1_acx7509 ag1_2_acx7100-32c an1_acx7100-48l an3_acx7100-48l an4_acx7024 cr1_ptx10001-36mr cr2_ptx10001-36mr
 *
 * Highlights:
 *  - lsp-external-controller pccd (NorthStar/Paragon PCE-initiated LSPs)
 *  - no-propagate-ttl hides MPLS core hops from traceroute
 *  - icmp-tunneling enables ICMP error reporting through MPLS tunnels
 *  - ipv6-tunneling for 6PE/6VPE over MPLS core
 *  - optimize-timer 180 seconds for CSPF re-optimization
 *  - Interface list is per-device (all inter-router AE interfaces + lo0)
 *  - Body is byte-identical to the Junos sibling
 *
 * Pair with:
 *  - evo/transport/forwarding-options-hash.conf
 *  - evo/transport/isis-interface.conf
 *  - evo/transport/isis-global.conf   (SR/ISIS underlay)
 */

protocols {
    mpls {
        lsp-external-controller pccd;
        log-updown {
            syslog;
            trap;
        }
        no-propagate-ttl;
        icmp-tunneling;
        optimize-timer 180;
        ipv6-tunneling;
        interface lo0.0;
        interface <ae-interface>.0;
    }
}
```

## junos/cos/classifier-dscp-ipv6.conf

```
/*
 * Topic:   DSCP-IPv6 classifier (CL-DSCP-IPV6) — ingress IPv6 packet-to-FC mapping
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - Identical classification logic to CL-DSCP but applied to IPv6 traffic
 *  - Required when inet6 traffic is classified separately from inet
 *  - Applied to L3 service interfaces alongside CL-DSCP
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/cos/cos-binding-l3-service.conf
 *  - junos/cos/forwarding-classes.conf
 *  - junos/cos/classifier-dscp.conf        (IPv4 counterpart)
 *  - junos/cos/rewrite-dscp-ipv6.conf      (egress IPv6 FC → DSCP marking)
 */

class-of-service {
    classifiers {
        dscp-ipv6 CL-DSCP-IPV6 {
            import default;
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-points be;
            }
            forwarding-class FC-CONTROL {
                loss-priority low code-points cs7;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-points af33;
                loss-priority low code-points [ cs3 af31 ];
                loss-priority medium-high code-points af32;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-points af43;
                loss-priority low code-points [ cs4 af41 ];
                loss-priority medium-high code-points af42;
            }
            forwarding-class FC-LOW {
                loss-priority high code-points af13;
                loss-priority low code-points [ cs1 af11 ];
                loss-priority medium-high code-points af12;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-points af23;
                loss-priority low code-points [ cs2 af21 ];
                loss-priority medium-high code-points af22;
            }
            forwarding-class FC-REALTIME {
                loss-priority low code-points ef;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-points cs5;
                loss-priority low code-points cs6;
            }
        }
    }
}
```

## junos/cos/classifier-dscp.conf

```
/*
 * Topic:   DSCP classifier (CL-DSCP) — ingress packet-to-FC mapping
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - AF per-hop behavior: AF4x → FC-LLQ, AF3x → FC-HIGH, AF2x → FC-MEDIUM,
 *    AF1x → FC-LOW, EF → FC-REALTIME, CS6/CS7 → FC-SIGNALING/CONTROL
 *  - 3-level loss-priority (low/medium-high/high) for AFxy drop-precedence
 *  - import default covers unmapped code-points → FC-BEST-EFFORT
 *  - Applied to L3 service interfaces via interface cos-binding
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/cos/classifier-dscp-ipv6.conf
 *  - junos/cos/cos-binding-l3-service.conf
 *  - junos/cos/forwarding-classes.conf
 *  - junos/cos/forwarding-classes.conf     (FC queue-num definitions)
 *  - junos/cos/rewrite-dscp.conf           (egress FC → DSCP marking)
 */

class-of-service {
    classifiers {
        dscp CL-DSCP {
            import default;
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-points be;
            }
            forwarding-class FC-CONTROL {
                loss-priority low code-points cs7;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-points af33;
                loss-priority low code-points [ cs3 af31 ];
                loss-priority medium-high code-points af32;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-points af43;
                loss-priority low code-points [ cs4 af41 ];
                loss-priority medium-high code-points af42;
            }
            forwarding-class FC-LOW {
                loss-priority high code-points af13;
                loss-priority low code-points [ cs1 af11 ];
                loss-priority medium-high code-points af12;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-points af23;
                loss-priority low code-points [ cs2 af21 ];
                loss-priority medium-high code-points af22;
            }
            forwarding-class FC-REALTIME {
                loss-priority low code-points ef;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-points cs5;
                loss-priority low code-points cs6;
            }
        }
    }
}
```

## junos/cos/classifier-exp.conf

```
/*
 * Topic:   MPLS EXP classifier (CL-MPLS) — ingress MPLS-to-FC mapping
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - Maps 3-bit MPLS EXP field to 8 forwarding classes
 *  - EXP 4 → FC-LLQ, EXP 5 → FC-REALTIME, EXP 6 → FC-SIGNALING
 *  - Applied on MPLS transport interfaces (ae units with family mpls)
 *  - All loss-priority = low (EXP has no drop-precedence encoding)
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/cos/cos-binding-transport.conf
 *  - junos/cos/forwarding-classes.conf
 *  - junos/cos/forwarding-classes.conf (FC queue-num definitions)
 *  - junos/cos/rewrite-exp.conf        (egress FC → EXP marking)
 */

class-of-service {
    classifiers {
        exp CL-MPLS {
            import default;
            forwarding-class FC-BEST-EFFORT {
                loss-priority low code-points 000;
            }
            forwarding-class FC-CONTROL {
                loss-priority low code-points 111;
            }
            forwarding-class FC-HIGH {
                loss-priority low code-points 011;
            }
            forwarding-class FC-LLQ {
                loss-priority low code-points 100;
            }
            forwarding-class FC-LOW {
                loss-priority low code-points 001;
            }
            forwarding-class FC-MEDIUM {
                loss-priority low code-points 010;
            }
            forwarding-class FC-REALTIME {
                loss-priority low code-points 101;
            }
            forwarding-class FC-SIGNALING {
                loss-priority low code-points 110;
            }
        }
    }
}
```

## junos/cos/classifier-ieee-802.1.conf

```
/*
 * Topic:   802.1p classifier (CL-8021P) — ingress VLAN-tag-to-FC mapping
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *
 * Highlights:
 *  - Maps 3-bit 802.1p PCP field to 8 forwarding classes
 *  - PCP 4 → FC-LLQ, PCP 5 → FC-REALTIME, PCP 6 → FC-SIGNALING
 *  - Applied on L2 access/trunk interfaces (EVPN-VPWS, ELAN)
 *  - All loss-priority = low (PCP has no drop-precedence encoding)
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/cos/forwarding-classes.conf     (FC queue-num definitions)
 *  - junos/cos/rewrite-ieee-802.1.conf     (egress FC → PCP marking)
 */

class-of-service {
    classifiers {
        ieee-802.1 CL-8021P {
            import default;
            forwarding-class FC-BEST-EFFORT {
                loss-priority low code-points 000;
            }
            forwarding-class FC-CONTROL {
                loss-priority low code-points 111;
            }
            forwarding-class FC-HIGH {
                loss-priority low code-points 011;
            }
            forwarding-class FC-LLQ {
                loss-priority low code-points 100;
            }
            forwarding-class FC-LOW {
                loss-priority low code-points 001;
            }
            forwarding-class FC-MEDIUM {
                loss-priority low code-points 010;
            }
            forwarding-class FC-REALTIME {
                loss-priority low code-points 101;
            }
            forwarding-class FC-SIGNALING {
                loss-priority low code-points 110;
            }
        }
    }
}
```

## junos/cos/cos-binding-l3-service.conf

```
/*
 * Topic:   CoS interface binding — L3 service (DSCP classifier + rewrite per unit)
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - Per-unit DSCP + DSCP-IPv6 classification and rewrite
 *  - No static forwarding-class — traffic is classified dynamically
 *  - Applied to L3VPN service units (inet/inet6 traffic)
 *  - Scheduler-map is applied at the interface level (not shown per-unit)
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/cos/scheduler-map.conf
 *  - junos/firewall/filter-mfc-ipv4-l3vpn-irb.conf
 *  - junos/firewall/filter-mfc-ipv6-l3vpn-irb.conf
 *  - junos/services/bgp-vpls-vsi.conf
 *  - junos/services/evpn-elan-vlan-based-irb.conf
 *  - junos/services/evpn-vpws-vlan-based-sh.conf
 *  - junos/services/l3vpn-irb.conf
 *  - junos/cos/classifier-dscp.conf      (CL-DSCP definition)
 *  - junos/cos/classifier-dscp-ipv6.conf (CL-DSCP-IPV6 definition)
 *  - junos/cos/rewrite-dscp.conf         (RR-DSCP definition)
 *  - junos/cos/rewrite-dscp-ipv6.conf    (RR-DSCP-IPV6 definition)
 */

class-of-service {
    interfaces {
        <interface> {
            scheduler-map SM-5G-SCHEDULER;
            unit <unit-number> {
                classifiers {
                    dscp CL-DSCP;
                    dscp-ipv6 CL-DSCP-IPV6;
                }
                rewrite-rules {
                    dscp RR-DSCP;
                    dscp-ipv6 RR-DSCP-IPV6;
                }
            }
        }
    }
}
```

## junos/cos/cos-binding-transport.conf

```
/*
 * Topic:   CoS interface binding — MPLS transport (EXP classifier + rewrite)
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *
 * Highlights:
 *  - Applies scheduler-map SM-5G-SCHEDULER at interface level
 *  - Classifies inbound MPLS traffic via EXP bits (CL-MPLS)
 *  - Rewrites outbound EXP bits (RR-MPLS) to preserve QoS marking
 *  - Applied on ae interface unit 0 (transport backbone links)
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/cos/classifier-exp.conf  (CL-MPLS definition)
 *  - junos/cos/rewrite-exp.conf     (RR-MPLS definition)
 *  - junos/cos/scheduler-map.conf   (SM-5G-SCHEDULER definition)
 */

class-of-service {
    interfaces {
        <ae-interface> {
            scheduler-map SM-5G-SCHEDULER;
            unit 0 {
                classifiers {
                    exp CL-MPLS;
                }
                rewrite-rules {
                    exp RR-MPLS;
                }
            }
        }
    }
}
```

## junos/cos/forwarding-classes.conf

```
/*
 * Topic:   8-class forwarding-class model (O-RAN multi-priority alignment)
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - 8 forwarding classes aligned to O-RAN multi-priority queuing model
 *  - FC-LLQ (queue 6) is the low-latency queue for eCPRI/fronthaul
 *  - FC-REALTIME (queue 5) for strict priority real-time flows (PTP, sync)
 *  - FC-SIGNALING (queue 7) for control-plane signaling
 *  - Queue numbering is consistent across all platforms in this JVD
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/cos/classifier-dscp.conf
 *  - junos/cos/classifier-exp.conf
 *  - junos/cos/classifier-ieee-802.1.conf
 *  - junos/cos/rewrite-dscp.conf
 *  - junos/cos/rewrite-exp.conf
 *  - junos/cos/rewrite-ieee-802.1.conf
 *  - junos/cos/schedulers-strict-high.conf  (MX: LLQ with priority strict-high)
 *  - junos/cos/scheduler-map.conf           (FC → scheduler binding)
 */

class-of-service {
    forwarding-classes {
        class FC-BEST-EFFORT queue-num 0;
        class FC-CONTROL queue-num 3;
        class FC-HIGH queue-num 4;
        class FC-LLQ queue-num 6;
        class FC-LOW queue-num 1;
        class FC-MEDIUM queue-num 2;
        class FC-REALTIME queue-num 5;
        class FC-SIGNALING queue-num 7;
    }
}
```

## junos/cos/rewrite-dscp-ipv6.conf

```
/*
 * Topic:   DSCP-IPv6 rewrite rule (RR-DSCP-IPV6) — egress FC-to-DSCP marking for IPv6
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - Identical marking logic to RR-DSCP but applied to IPv6 egress
 *  - Required when inet6 traffic is rewritten separately from inet
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/cos/cos-binding-l3-service.conf
 *  - junos/cos/forwarding-classes.conf
 *  - junos/cos/classifier-dscp-ipv6.conf (ingress counterpart)
 *  - junos/cos/rewrite-dscp.conf         (IPv4 counterpart)
 */

class-of-service {
    rewrite-rules {
        dscp-ipv6 RR-DSCP-IPV6 {
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-point be;
                loss-priority low code-point be;
            }
            forwarding-class FC-CONTROL {
                loss-priority high code-point cs7;
                loss-priority low code-point cs7;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-point af33;
                loss-priority low code-point af31;
                loss-priority medium-high code-point af32;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-point af43;
                loss-priority low code-point af41;
                loss-priority medium-high code-point af42;
            }
            forwarding-class FC-LOW {
                loss-priority high code-point af13;
                loss-priority low code-point af11;
                loss-priority medium-high code-point af12;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-point af23;
                loss-priority low code-point af21;
                loss-priority medium-high code-point af22;
            }
            forwarding-class FC-REALTIME {
                loss-priority high code-point ef;
                loss-priority low code-point ef;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-point cs5;
                loss-priority low code-point cs6;
            }
        }
    }
}
```

## junos/cos/rewrite-dscp.conf

```
/*
 * Topic:   DSCP rewrite rule (RR-DSCP) — egress FC-to-DSCP marking
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - Rewrites outgoing DSCP based on FC + loss-priority at egress
 *  - AF4x codes for FC-LLQ, EF for FC-REALTIME (matches classifier in reverse)
 *  - Applied on L3 service interface units via cos-binding
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/cos/cos-binding-l3-service.conf
 *  - junos/cos/forwarding-classes.conf
 *  - junos/cos/rewrite-dscp-ipv6.conf
 *  - junos/cos/classifier-dscp.conf    (ingress counterpart)
 *  - junos/cos/forwarding-classes.conf (FC definitions)
 */

class-of-service {
    rewrite-rules {
        dscp RR-DSCP {
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-point be;
                loss-priority low code-point be;
            }
            forwarding-class FC-CONTROL {
                loss-priority high code-point cs7;
                loss-priority low code-point cs7;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-point af33;
                loss-priority low code-point af31;
                loss-priority medium-high code-point af32;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-point af43;
                loss-priority low code-point af41;
                loss-priority medium-high code-point af42;
            }
            forwarding-class FC-LOW {
                loss-priority high code-point af13;
                loss-priority low code-point af11;
                loss-priority medium-high code-point af12;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-point af23;
                loss-priority low code-point af21;
                loss-priority medium-high code-point af22;
            }
            forwarding-class FC-REALTIME {
                loss-priority high code-point ef;
                loss-priority low code-point ef;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-point cs5;
                loss-priority low code-point cs6;
            }
        }
    }
}
```

## junos/cos/rewrite-exp.conf

```
/*
 * Topic:   MPLS EXP rewrite rule (RR-MPLS) — egress FC-to-EXP marking
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - Rewrites outgoing MPLS EXP bits based on FC + loss-priority
 *  - EXP 4 ← FC-LLQ, EXP 5 ← FC-REALTIME, EXP 6 ← FC-SIGNALING
 *  - All loss-priority levels map to the same code-point per FC (3 bits
 *    cannot encode drop-precedence)
 *  - Applied on MPLS transport AE interfaces
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/cos/cos-binding-transport.conf
 *  - junos/cos/forwarding-classes.conf
 *  - junos/cos/classifier-exp.conf     (ingress counterpart)
 *  - junos/cos/forwarding-classes.conf (FC definitions)
 */

class-of-service {
    rewrite-rules {
        exp RR-MPLS {
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-point 000;
                loss-priority low code-point 000;
            }
            forwarding-class FC-CONTROL {
                loss-priority high code-point 111;
                loss-priority low code-point 111;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-point 011;
                loss-priority low code-point 011;
                loss-priority medium-high code-point 011;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-point 100;
                loss-priority low code-point 100;
                loss-priority medium-high code-point 100;
            }
            forwarding-class FC-LOW {
                loss-priority high code-point 001;
                loss-priority low code-point 001;
                loss-priority medium-high code-point 001;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-point 010;
                loss-priority low code-point 010;
                loss-priority medium-high code-point 010;
            }
            forwarding-class FC-REALTIME {
                loss-priority high code-point 101;
                loss-priority low code-point 101;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-point 110;
                loss-priority low code-point 110;
            }
        }
    }
}
```

## junos/cos/rewrite-ieee-802.1.conf

```
/*
 * Topic:   802.1p rewrite rule (RR-8021P) — egress FC-to-PCP marking
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *
 * Highlights:
 *  - Rewrites outgoing 802.1p PCP bits based on FC + loss-priority
 *  - PCP 4 ← FC-LLQ, PCP 5 ← FC-REALTIME, PCP 6 ← FC-SIGNALING
 *  - All loss-priority levels map to the same code-point per FC
 *  - Applied on L2 service interfaces (EVPN-VPWS access ports)
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/cos/classifier-ieee-802.1.conf (ingress counterpart)
 *  - junos/cos/forwarding-classes.conf    (FC definitions)
 */

class-of-service {
    rewrite-rules {
        ieee-802.1 RR-8021P {
            forwarding-class FC-BEST-EFFORT {
                loss-priority high code-point 000;
                loss-priority low code-point 000;
            }
            forwarding-class FC-CONTROL {
                loss-priority high code-point 111;
                loss-priority low code-point 111;
            }
            forwarding-class FC-HIGH {
                loss-priority high code-point 011;
                loss-priority low code-point 011;
                loss-priority medium-high code-point 011;
            }
            forwarding-class FC-LLQ {
                loss-priority high code-point 100;
                loss-priority low code-point 100;
                loss-priority medium-high code-point 100;
            }
            forwarding-class FC-LOW {
                loss-priority high code-point 001;
                loss-priority low code-point 001;
                loss-priority medium-high code-point 001;
            }
            forwarding-class FC-MEDIUM {
                loss-priority high code-point 010;
                loss-priority low code-point 010;
                loss-priority medium-high code-point 010;
            }
            forwarding-class FC-REALTIME {
                loss-priority high code-point 101;
                loss-priority low code-point 101;
            }
            forwarding-class FC-SIGNALING {
                loss-priority high code-point 110;
                loss-priority low code-point 110;
            }
        }
    }
}
```

## junos/cos/scheduler-map.conf

```
/*
 * Topic:   Scheduler-map binding FCs to schedulers (SM-5G-SCHEDULER)
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - Maps all 8 forwarding classes to their corresponding schedulers
 *  - Referenced by interface CoS bindings (scheduler-map SM-5G-SCHEDULER)
 *  - The scheduler-map itself is identical across all devices; the
 *    underlying scheduler behavior (strict-high) is determined by the
 *    scheduler definition, not the map
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/cos/cos-binding-transport.conf
 *  - junos/cos/forwarding-classes.conf
 *  - junos/cos/forwarding-classes.conf      (FC definitions)
 *  - junos/cos/schedulers-strict-high.conf  (MX scheduler priorities)
 */

class-of-service {
    scheduler-maps {
        SM-5G-SCHEDULER {
            forwarding-class FC-BEST-EFFORT scheduler SC-BEST-EFFORT;
            forwarding-class FC-CONTROL scheduler SC-CONTROL;
            forwarding-class FC-HIGH scheduler SC-HIGH;
            forwarding-class FC-LLQ scheduler SC-LLQ;
            forwarding-class FC-LOW scheduler SC-LOW;
            forwarding-class FC-MEDIUM scheduler SC-MEDIUM;
            forwarding-class FC-REALTIME scheduler SC-REALTIME;
            forwarding-class FC-SIGNALING scheduler SC-SIGNALING;
        }
    }
}
```

## junos/cos/schedulers-strict-high.conf

```
/*
 * Topic:   Scheduler definitions with priority strict-high (MX fallback)
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *
 * Highlights:
 *  - SC-LLQ uses `priority strict-high` — MX does not support the ACX
 *    `priority low-latency` hardware scheduler; strict-high is the
 *    highest available strict priority on this platform
 *  - SC-SIGNALING uses `priority high` (one tier below strict-high)
 *  - All other schedulers (rates, buffer-size) are identical to the
 *    ACX low-latency variant — only the priority keywords differ
 *  - Body is byte-identical to the EVO (PTX) sibling
 *  - MX aggregation routers are transport-only or SAG role in this JVD
 *
 * Pair with:
 *  - junos/cos/forwarding-classes.conf  (FC definitions these schedulers serve)
 *  - junos/cos/scheduler-map.conf       (FC → scheduler binding)
 */

class-of-service {
    schedulers {
        SC-BEST-EFFORT {
            transmit-rate {
                remainder;
            }
            buffer-size {
                remainder;
            }
            priority low;
        }
        SC-CONTROL {
            shaping-rate percent 5;
            buffer-size percent 5;
            priority high;
        }
        SC-HIGH {
            transmit-rate percent 40;
            buffer-size percent 30;
            priority low;
        }
        SC-LLQ {
            shaping-rate percent 40;
            buffer-size percent 10;
            priority strict-high;
        }
        SC-LOW {
            transmit-rate percent 20;
            priority low;
        }
        SC-MEDIUM {
            transmit-rate percent 30;
            buffer-size percent 20;
            priority low;
        }
        SC-REALTIME {
            shaping-rate percent 30;
            buffer-size percent 20;
            priority medium-high;
        }
        SC-SIGNALING {
            shaping-rate percent 5;
            buffer-size percent 5;
            priority high;
        }
    }
}
```

## junos/firewall/filter-mfc-ipv4-l3vpn-irb.conf

```
/*
 * Topic:   Multi-field classifier — IPv4 DSCP-to-FC (L3VPN IRB ingress)
 * Seen on:
 *   Junos: sag_mx304
 *
 * Highlights:
 *  - Interface-specific filter applied on IRB units (input direction)
 *  - Overrides CoS classifier: forces FC based on DSCP for traffic
 *    entering the L3VPN from a bridged domain
 *  - cs1 → FC-REALTIME, cs2 → FC-HIGH, cs3 → FC-MEDIUM, cs4 → FC-LOW
 *  - Default term accepts unmatched traffic (uses CoS classifier instead)
 *  - Two named variants in the JVD: FF-MFC-IPV4-L3VPN-BD-IRB (bridged-domain
 *    IRB) and FF-MFC-IPV4-L3VPN-EVPN-IRB (EVPN IRB) — bodies identical
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/cos/forwarding-classes.conf
 *  - junos/services/evpn-elan-vlan-based-irb.conf
 *  - junos/services/l3vpn-irb.conf
 *  - junos/firewall/filter-mfc-ipv6-l3vpn-irb.conf  (IPv6 counterpart)
 *  - junos/cos/cos-binding-l3-service.conf           (CoS binding on L3 units)
 */

firewall {
    family inet {
        filter <filter-name> {
            interface-specific;
            term fc-realtime {
                from {
                    dscp cs1;
                }
                then forwarding-class FC-REALTIME;
            }
            term fc-high {
                from {
                    dscp cs2;
                }
                then forwarding-class FC-HIGH;
            }
            term fc-medium {
                from {
                    dscp cs3;
                }
                then forwarding-class FC-MEDIUM;
            }
            term fc-low {
                from {
                    dscp cs4;
                }
                then forwarding-class FC-LOW;
            }
            term default {
                then accept;
            }
        }
    }
}
```

## junos/firewall/filter-mfc-ipv6-l3vpn-irb.conf

```
/*
 * Topic:   Multi-field classifier — IPv6 traffic-class-to-FC (L3VPN IRB ingress)
 * Seen on:
 *   Junos: sag_mx304
 *
 * Highlights:
 *  - IPv6 counterpart of filter-mfc-ipv4-l3vpn-irb.conf
 *  - Uses `traffic-class` (IPv6 traffic class field) instead of `dscp`
 *  - Same FC assignment: cs1→REALTIME, cs2→HIGH, cs3→MEDIUM, cs4→LOW
 *  - Interface-specific, applied input on IRB units
 *  - Two named variants: FF-MFC-IPV6-L3VPN-BD-IRB / FF-MFC-IPV6-L3VPN-EVPN-IRB
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/cos/forwarding-classes.conf
 *  - junos/firewall/filter-mfc-ipv4-l3vpn-irb.conf  (IPv4 counterpart)
 *  - junos/cos/cos-binding-l3-service.conf           (CoS binding on L3 units)
 */

firewall {
    family inet6 {
        filter <filter-name> {
            interface-specific;
            term fc-realtime {
                from {
                    traffic-class cs1;
                }
                then forwarding-class FC-REALTIME;
            }
            term fc-high {
                from {
                    traffic-class cs2;
                }
                then forwarding-class FC-HIGH;
            }
            term fc-medium {
                from {
                    traffic-class cs3;
                }
                then forwarding-class FC-MEDIUM;
            }
            term fc-low {
                from {
                    traffic-class cs4;
                }
                then forwarding-class FC-LOW;
            }
            term default {
                then accept;
            }
        }
    }
}
```

## junos/interfaces/vlan-bridge.conf

```
/*
 * Topic:   Service sub-interface with vlan-bridge encapsulation
 * Seen on:
 *   Junos: sag_mx304
 *
 * Highlights:
 *  - Physical interface for single-homed L2/L3 services toward AN
 *  - flexible-vlan-tagging + flexible-ethernet-services: multi-encap parent
 *  - vlan-bridge encapsulation: unit is placed into virtual-switch or mac-vrf
 *  - Used for BGP-VPLS and EVPN-ELAN bridged services
 *  - No ESI: SAG is single-homed endpoint
 *  - Hundreds of units per interface (one per service instance)
 *
 * Pair with:
 *  - junos/services/bgp-vpls-vsi.conf    (virtual-switch service)
 *  - junos/services/evpn-elan-vlan-based-irb.conf   (mac-vrf ELAN)
 *  - junos/cos/cos-binding-l3-service.conf          (DSCP on service units)
 */

interfaces {
    <interface> {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        /* repeat per BGP-VPLS / ELAN service */
        unit <unit-number> {
            description <service-description>;
            encapsulation vlan-bridge;
            vlan-id <vlan-id>;
        }
    }
}
```

## junos/interfaces/vlan-ccc.conf

```
/*
 * Topic:   Service sub-interface with vlan-ccc encapsulation
 * Seen on:
 *   Junos: sag_mx304
 *
 * Highlights:
 *  - Physical interface for single-homed EVPN-VPWS circuits toward AN
 *  - flexible-vlan-tagging + flexible-ethernet-services: multi-encap parent
 *  - vlan-ccc encapsulation: unit carries L2 circuit for EVPN-VPWS
 *  - family ccc enables circuit cross-connect forwarding
 *  - No ESI: SAG is single-homed endpoint
 *  - Hundreds of units per interface (one per service instance)
 *
 * Pair with:
 *  - junos/services/evpn-vpws-vlan-based-sh.conf    (VPWS single-homed)
 *  - junos/cos/cos-binding-l3-service.conf          (DSCP on service units)
 */

interfaces {
    <interface> {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
        /* repeat per EVPN-VPWS service */
        unit <unit-number> {
            encapsulation vlan-ccc;
            vlan-id <vlan-id>;
            family ccc;
        }
    }
}
```

## junos/policy/allow-loopback.conf

```
/*
 * Topic:   ALLOW_LOOPBACK — rib-group import filter for labeled-unicast
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *
 * Highlights:
 *  - Permits loopback routes (host routes /32) to be imported from inet.3 to inet.0
 *  - Used by rib-group inet3-to-inet0 in BGP labeled-unicast
 *  - Ensures MPLS next-hops resolve via the IGP for service overlays
 *  - orlonger matches /32 and any more-specific (effectively any host route)
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/transport/bgp-internal.conf (rib-group referencing this policy)
 */

policy-options {
    policy-statement ALLOW_LOOPBACK {
        from {
            route-filter 0.0.0.0/32 orlonger;
        }
        then accept;
    }
}
```

## junos/policy/next-hop-self.conf

```
/*
 * Topic:   next-hop-self BGP export policy
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *
 * Highlights:
 *  - Forces next-hop-self on all advertised BGP routes
 *  - Applied as export policy on iBGP groups (transport and service families)
 *  - Ensures remote peers can resolve next-hop via local IGP
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/transport/bgp-internal.conf (iBGP group referencing this policy)
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

## junos/policy/pplb.conf

```
/*
 * Topic:   Per-packet load-balance policy (PPLB)
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *
 * Highlights:
 *  - Enables per-flow (per-packet) ECMP load-balancing in the forwarding table
 *  - Applied via routing-options forwarding-table export PPLB
 *  - Despite the name, modern Junos treats this as per-flow (5-tuple hash)
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/transport/load-balance-pplb.conf  (forwarding-table export)
 */

policy-options {
    policy-statement PPLB {
        then {
            load-balance per-packet;
            accept;
        }
    }
}
```

## junos/policy/sr-nonzero-loopbacks.conf

```
/*
 * Topic:   SR non-zero loopback advertisement (IPv4 + IPv6 prefix-segment)
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *
 * Highlights:
 *  - Advertises additional loopback addresses (beyond lo0.0 primary) into
 *    IS-IS with SR prefix-segment indices
 *  - Allows anycast or per-service loopbacks to be SR-reachable
 *  - Exported via ISIS export policy (protocols isis export [... SR_NONZERO_...])
 *  - Index values are per-device; coordinate with SID allocation plan
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/transport/isis-global.conf  (ISIS export referencing these policies)
 */

policy-options {
    policy-statement SR_NONZERO_LOOPBACKS_V4 {
        term t1 {
            from {
                route-filter <secondary-loopback-v4>/32 exact;
            }
            then {
                prefix-segment {
                    index <ipv4-secondary-sid-index>;
                }
                accept;
            }
        }
    }
    policy-statement SR_NONZERO_LOOPBACKS_V6 {
        term t1 {
            from {
                family inet6;
                route-filter <secondary-loopback-v6>/128 exact;
            }
            then {
                prefix-segment {
                    index <ipv6-secondary-sid-index>;
                }
                accept;
            }
        }
    }
}
```

## junos/services/bgp-vpls-vsi.conf

```
/*
 * Topic:   BGP-VPLS virtual-switch with FAT pseudowire (midhaul L2)
 * Seen on:
 *   Junos: sag_mx304
 *
 * Highlights:
 *  - instance-type virtual-switch with BGP-VPLS signaling (RFC 4761)
 *  - FAT pseudowire via flow-label-transmit / flow-label-receive for
 *    entropy-based LAG/ECMP load-balancing on midhaul circuits
 *  - site / site-identifier for auto-discovery and split-horizon
 *  - site-range 65534, label-block-size 4 (capacity planning)
 *  - no-tunnel-services: uses inline MPLS (no tunnel PIC needed)
 *  - bridge-domains stanza maps VLAN on Junos (vs vlans on EVO)
 *  - Body structure is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/interfaces/vlan-bridge.conf       (vlan-bridge access units)
 *  - junos/cos/cos-binding-l3-service.conf   (DSCP on service units)
 * JVD service mapping:
 *   (no instances found in topology registry)
 *
 */

routing-instances {
    <instance-name> {
        instance-type virtual-switch;
        protocols {
            vpls {
                site <site-name> {
                    site-identifier <site-id>;
                }
                site-range 65534;
                label-block-size 4;
                no-tunnel-services;
                flow-label-transmit;
                flow-label-receive;
            }
        }
        description <description>;
        bridge-domains {
            <vlan-name> {
                vlan-id <vlan-id>;
                interface <interface>.<unit>;
            }
        }
        interface <interface>.<unit>;
        route-distinguisher <router-id>:<rd-value>;
        vrf-target target:<asn>:<rt-value>;
    }
}
```

## junos/services/evpn-elan-vlan-based-irb.conf

```
/*
 * Topic:   EVPN-ELAN VLAN-based with IRB (mac-vrf, anycast gateway)
 * Seen on:
 *   Junos: sag_mx304
 *
 * Highlights:
 *  - mac-vrf instance with EVPN + IRB for integrated routing and bridging
 *  - default-gateway no-gateway-community: suppresses type-5 gateway
 *    community advertisement (used when IRB is local-only or with VRF)
 *  - bridge-domains with routing-interface irb.X links L2 to L3
 *  - The IRB interface is then placed into a VRF for L3VPN reachability
 *  - service-type vlan-based (one BD per instance)
 *
 * Pair with:
 *  - junos/interfaces/vlan-bridge.conf               (vlan-bridge access units)
 *  - junos/services/l3vpn-irb.conf              (L3VPN VRF hosting the IRB)
 *  - junos/cos/cos-binding-l3-service.conf          (DSCP on IRB units)
 *  - junos/firewall/filter-mfc-ipv4-l3vpn-irb.conf  (MFC on IRB input)
 * JVD service mapping:
 *   (no instances found in topology registry)
 *
 */

routing-instances {
    <instance-name> {
        instance-type mac-vrf;
        protocols {
            evpn {
                default-gateway no-gateway-community;
            }
        }
        bridge-domains {
            <bridge-domain-name> {
                vlan-id <vlan-id>;
                interface <interface>.<unit>;
                routing-interface irb.<irb-unit>;
            }
        }
        service-type vlan-based;
        interface <interface>.<unit>;
        route-distinguisher <rd-value>:<rd-index>;
        vrf-target target:<rt-value>:<rt-index>;
    }
}
```

## junos/services/evpn-fxc-vlan-aware.conf

```
/*
 * Topic:   EVPN-VPWS Flexible Cross-Connect (FXC, midhaul)
 * Seen on:
 *   Junos: sag_mx304
 *
 * Highlights:
 *  - EVPN-VPWS with flexible-cross-connect-vlan-aware for multi-endpoint
 *    bundling (two VLANs cross-connected through the same VPWS instance)
 *  - Two interface/vpws-service-id pairs per instance: each sub-interface
 *    gets its own local/remote pseudowire ID within the same RD/RT
 *  - Used for midhaul circuits where control-plane and user-plane VLANs
 *    are paired into a single VPWS FXC instance
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/interfaces/vlan-ccc.conf                 (vlan-ccc access units)
 *  - junos/cos/cos-binding-l3-service.conf          (DSCP on service units)
 */

routing-instances {
    <instance-name> {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface <interface-a>.<unit-a> {
                    vpws-service-id {
                        local <local-id-a>;
                        remote <remote-id-a>;
                    }
                }
                interface <interface-b>.<unit-b> {
                    vpws-service-id {
                        local <local-id-b>;
                        remote <remote-id-b>;
                    }
                }
                flexible-cross-connect-vlan-aware;
            }
        }
        interface <interface-a>.<unit-a>;
        interface <interface-b>.<unit-b>;
        route-distinguisher <router-id>:<rd-value>;
        vrf-target target:<asn>:<rt-value>;
    }
}
```

## junos/services/evpn-vpws-vlan-based-sh.conf

```
/*
 * Topic:   EVPN-VPWS VLAN-based single-homed (midhaul/backhaul)
 * Seen on:
 *   Junos: sag_mx304
 *
 * Highlights:
 *  - Point-to-point EVPN-VPWS for single-homed AN connections (AN4→SAG)
 *  - flow-label-transmit-static / flow-label-receive-static enables
 *    FAT pseudowire for LAG load-balancing without control-word negotiation
 *  - vpws-service-id local/remote identifies the pseudowire endpoints
 *  - Used where AN is single-homed (no ESI) directly to SAG
 *
 * Pair with:
 *  - junos/interfaces/vlan-ccc.conf          (vlan-ccc access units)
 *  - junos/cos/cos-binding-l3-service.conf   (DSCP binding on associated units)
 * JVD service mapping:
 *   (no instances found in topology registry)
 *
 */

routing-instances {
    <instance-name> {
        instance-type evpn-vpws;
        protocols {
            evpn {
                interface <interface>.<unit> {
                    vpws-service-id {
                        local <local-id>;
                        remote <remote-id>;
                    }
                }
                flow-label-transmit-static;
                flow-label-receive-static;
            }
        }
        interface <interface>.<unit>;
        route-distinguisher <router-id>:<rd-value>;
        vrf-target target:<asn>:<rt-value>;
    }
}
```

## junos/services/l3vpn-irb.conf

```
/*
 * Topic:   L3VPN VRF with IRB (anycast gateway, vrf-table-label)
 * Seen on:
 *   Junos: sag_mx304
 *
 * Highlights:
 *  - instance-type vrf for L3VPN routing
 *  - IRB interface provides routing for EVPN-ELAN bridge-domains
 *  - vrf-table-label allocates a single MPLS label for the VRF
 *    (simplifies PE-to-PE label allocation)
 *  - router-id set explicitly per-instance (required for multi-VRF ECMP)
 *  - On SAG, the mac-vrf ELAN provides L2 bridging with IRB linked to this VRF
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/interfaces/vlan-bridge.conf              (vlan-bridge access units)
 *  - junos/services/evpn-elan-vlan-based-irb.conf  (mac-vrf bridging to this VRF)
 *  - junos/cos/cos-binding-l3-service.conf         (DSCP on service units)
 *  - junos/firewall/filter-mfc-ipv4-l3vpn-irb.conf (MFC on IRB input)
 * JVD service mapping:
 *   (no instances found in topology registry)
 *
 */

routing-instances {
    <instance-name> {
        instance-type vrf;
        routing-options {
            router-id <router-id>;
        }
        description <description>;
        interface irb.<irb-unit>;
        route-distinguisher <router-id>:<rd-value>;
        vrf-target target:<asn>:<rt-value>;
        vrf-table-label;
    }
}
```

## junos/transport/bgp-internal.conf

```
/*
 * Topic:   BGP internal (iBGP) — labeled-unicast + route-reflector
 * Seen on:
 *   Junos: sag_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - iBGP with inet/inet6 labeled-unicast for inter-area MPLS connectivity
 *  - rib-group inet3-to-inet0 installs labeled routes into inet.0 (for next-hop resolution)
 *  - CR devices act as route-reflectors (cluster-id = own router-id)
 *  - log-updown + multipath enabled at group or global level
 *  - export next-hop-self on iBGP peering sessions
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/policy/next-hop-self.conf   (BGP export policy)
 *  - junos/policy/allow-loopback.conf  (rib-group import filter)
 *  - junos/transport/isis-global.conf  (underlay providing next-hop reachability)
 */

protocols {
    bgp {
        group <group-name> {
            type internal;
            local-address <loopback-address>;
            family inet {
                labeled-unicast {
                    rib-group inet3-to-inet0;
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
            export next-hop-self;
            neighbor <peer-address>;
        }
        log-updown;
        multipath;
    }
}
```

## junos/transport/isis-global.conf

```
/*
 * Topic:   IS-IS global — segment routing, SPF tuning, TI-LFA backup
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480
 *   EVO:   (none)
 *
 * Highlights:
 *  - Segment Routing: SRGB 16000 + 80000 range, node-segment with IPv4/IPv6 indices
 *  - explicit-null for penultimate-hop transparency (preserves QoS to egress)
 *  - Level 2 wide-metrics-only (required for TE and SR)
 *  - SPF delay 100ms with 5 rapid runs before dampening
 *  - Backup SPF: TI-LFA with up to 5 labels, uses source-packet-routing
 *  - Exports SR_NONZERO_LOOPBACKS_V4/V6 for multi-loopback SR advertisement
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/policy/sr-nonzero-loopbacks.conf
 *  - junos/transport/bgp-internal.conf
 *  - junos/transport/mpls-global.conf
 *  - junos/transport/isis-interface.conf       (per-interface config)
 *  - junos/policy/sr-nonzero-loopbacks.conf    (SR prefix-segment export)
 */

protocols {
    isis {
        interface lo0.0 {
            passive;
        }
        source-packet-routing {
            srgb start-label 16000 index-range 80000;
            node-segment {
                ipv4-index <ipv4-sid-index>;
                ipv6-index <ipv6-sid-index>;
            }
            explicit-null;
        }
        level 2 wide-metrics-only;
        spf-options {
            delay 100;
            rapid-runs 5;
        }
        backup-spf-options {
            use-post-convergence-lfa maximum-labels 5;
            use-source-packet-routing;
        }
        export [ SR_NONZERO_LOOPBACKS_V4 SR_NONZERO_LOOPBACKS_V6 ];
        ignore-attached-bit;
    }
}
```

## junos/transport/isis-interface.conf

```
/*
 * Topic:   IS-IS interface — level 2, TI-LFA, BFD, point-to-point
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480
 *   EVO:   (none)
 *
 * Highlights:
 *  - Level-2 only (level 1 disabled) — flat IS-IS domain
 *  - post-convergence-lfa with node-protection (TI-LFA)
 *  - BFD liveness-detection: 100ms minimum-interval × 3 multiplier = 300ms detect
 *  - Point-to-point on all inter-router links (no DIS election)
 *  - Metric 10 on all links (uniform cost for ECMP)
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/transport/isis-global.conf  (SR, spf-options, backup-spf-options)
 *  - junos/transport/mpls-global.conf  (MPLS interface enablement)
 */

protocols {
    isis {
        interface <ae-interface>.0 {
            level 2 {
                post-convergence-lfa {
                    node-protection cost 16777214;
                }
                metric 10;
            }
            level 1 disable;
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

## junos/transport/load-balance-pplb.conf

```
/*
 * Topic:   Forwarding-table load-balance + chained-composite-next-hop
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *
 * Highlights:
 *  - export PPLB enables per-flow ECMP across equal-cost paths
 *  - chained-composite-next-hop for EVPN, L3VPN, and L2CKT services
 *    enables hierarchical next-hop chains (required for EVPN-VPWS MH)
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/policy/pplb.conf                   (PPLB policy definition)
 */

routing-options {
    forwarding-table {
        export PPLB;
        chained-composite-next-hop {
            ingress {
                l2ckt;
                evpn;
                l3vpn;
            }
        }
    }
}
```

## junos/transport/mpls-global.conf

```
/*
 * Topic:   MPLS global — PCE-controlled LSPs, TTL, ICMP tunneling, IPv6
 * Seen on:
 *   Junos: ag2_1_mx204 ag2_2_mx204 ag3_1_mx480 ag3_2_mx480 sag_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - lsp-external-controller pccd (NorthStar/Paragon PCE-initiated LSPs)
 *  - no-propagate-ttl hides MPLS core hops from traceroute
 *  - icmp-tunneling enables ICMP error reporting through MPLS tunnels
 *  - ipv6-tunneling for 6PE/6VPE over MPLS core
 *  - optimize-timer 180 seconds for CSPF re-optimization
 *  - Interface list is per-device (all inter-router AE interfaces + lo0)
 *  - Body is byte-identical to the EVO sibling
 *
 * Pair with:
 *  - junos/transport/isis-interface.conf
 *  - junos/transport/isis-global.conf  (SR/ISIS underlay)
 */

protocols {
    mpls {
        lsp-external-controller pccd;
        log-updown {
            syslog;
            trap;
        }
        no-propagate-ttl;
        icmp-tunneling;
        optimize-timer 180;
        ipv6-tunneling;
        interface lo0.0;
        interface <ae-interface>.0;
    }
}
```

## _variables.md

# Template Variables — LLQ Snip Library

Variables used in templatized snip bodies. Replace `<variable>` placeholders
with site-specific values when deploying.

## Interface & Unit Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `<ae-interface>` | Aggregated Ethernet interface name | `ae11`, `ae26` |
| `<interface>` | Any physical or logical interface | `et-1/0/1`, `ae26`, `xe-0/1/3:2` |
| `<unit-number>` | Logical unit on the interface | `0`, `101`, `901`, `2501` |

## Addressing & Identity

| Variable | Description | Example |
|----------|-------------|---------|
| `<router-id>` | Device router-id (usually primary loopback) | `192.168.1.3` |
| `<loopback-address>` | BGP local-address (loopback for iBGP) | `192.168.1.3` |
| `<peer-address>` | BGP neighbor address | `192.168.1.9` |
| `<secondary-loopback-v4>` | Additional loopback for SR advertisement | `192.168.10.3` |
| `<secondary-loopback-v6>` | IPv6 secondary loopback for SR | `2001:db8::1:1:10:3` |

## Segment Routing

| Variable | Description | Example |
|----------|-------------|---------|
| `<ipv4-sid-index>` | SR node-segment IPv4 index (unique per device) | `14` |
| `<ipv6-sid-index>` | SR node-segment IPv6 index | `114` |
| `<ipv4-secondary-sid-index>` | SR prefix-segment index for secondary loopback | `214` |
| `<ipv6-secondary-sid-index>` | SR prefix-segment index for secondary IPv6 loopback | `314` |

## Service Instance Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `<instance-name>` | Routing-instance name | `FRONTHAUL-EVPN-VPWS-MH-AN1-1` |
| `<description>` | Human-readable instance description | `L3VPN-IRB-ANYCAST-GATEWAY-MH-1` |
| `<rd-value>` | Route-distinguisher numeric suffix | `3401` |
| `<rd-index>` | RD index (for mac-vrf pattern) | `101` |
| `<rt-value>` | Route-target numeric suffix | `3401` |
| `<rt-index>` | RT index (for mac-vrf pattern) | `101` |
| `<asn>` | Autonomous system number | `63535` |
| `<local-id>` | VPWS local service-id | `1`, `2` |
| `<remote-id>` | VPWS remote service-id | `2`, `1` |

## VLAN & Bridge Domain

| Variable | Description | Example |
|----------|-------------|---------|
| `<vlan-id>` | 802.1Q VLAN identifier | `101`, `901`, `2501` |
| `<vlan-name>` | VLAN name in vlans stanza | `vlan201` |
| `<bridge-domain-name>` | Bridge-domain identifier | `BD_EVPN_ELAN_1501` |
| `<irb-unit>` | IRB interface unit number | `101`, `351` |

## LAG & Multi-Homing

| Variable | Description | Example |
|----------|-------------|---------|
| `<lacp-system-id>` | LACP system-id (shared across AG pair) | `00:00:00:00:00:01` |
| `<esi-value>` | EVPN ESI (10-byte, per-unit unique) | `00:51:11:11:11:11:11:00:00:01` |
| `<service-description>` | Per-unit description string | `FRONTHAUL-EVPN-VPWS-MH-AN1-1` |

## Firewall / MAC Classification

| Variable | Description | Example |
|----------|-------------|---------|
| `<filter-name>` | Firewall filter name | `FF-MFC-IPV4-L3VPN-BD-IRB` |
| `<ecpri-user-plane-mac-N>` | eCPRI user-plane source MAC | `00:0c:0d:00:00:01` |
| `<ecpri-ctrl-plane-mac-N>` | eCPRI control-plane source MAC | `00:0c:0e:00:00:01` |
| `<ecpri-sync-mac-N>` | eCPRI sync source MAC | `00:0c:0f:00:00:01` |
| `<timing-sync-mac-N>` | PTP/timing destination MAC | `00:0c:22:00:00:01` |

## OAM / CFM

| Variable | Description | Example |
|----------|-------------|---------|
| `<md-name>` | Maintenance domain name | `MD_63535` |
| `<level>` | CFM maintenance-domain level (0-7) | `5` |
| `<ma-id>` | Maintenance association identifier | `2501` |
| `<local-mep-id>` | Local MEP identifier | `1003` |
| `<remote-mep-id>` | Remote MEP identifier | `1001` |

## BGP Groups

| Variable | Description | Example |
|----------|-------------|---------|
| `<group-name>` | BGP group name | `ibgp_meg_rr`, `ibgp_cr` |
| `<site-name>` | BGP-VPLS site name | `r2`, `r11` |
| `<site-id>` | BGP-VPLS site-identifier | `1003`, `1011` |

## byoai/TIERS.md

# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet
files to include for each service kind at each verbosity tier. It is bundled into
[`jvd-llq-snips.md`](jvd-llq-snips.md) by `regenerate-bundle.sh`.

For each service kind, the AI includes ONLY the snips listed for the chosen tier —
and ONLY those — unless the user explicitly asks for more. Use the OS-appropriate
file under `junos/` or `evo/` for the target device:

- **EVO** (ACX7024/7100/7509 access & aggregation, PTX10001-36MR core) → `evo/…`
- **Junos** (MX204/MX480 aggregation, MX304 SAG) → `junos/…`

This is a **5G xHaul Class-of-Service** JVD — CoS is not an afterthought, it is
the point. Every service's `as-deployed` tier therefore includes the full CoS
baseline. Fronthaul services (eCPRI) are the primary use of the low-latency queue
(FC-LLQ, queue 6) and, on ACX, the `schedulers-low-latency` scheduler.

---

## Shared underlay baseline (referenced by every `as-deployed`)

The SR-MPLS transport + policy + CoS every device needs end-to-end. Factor this
once; every service's `as-deployed` = its `with-overlay` set + this baseline.

**Transport**
- `transport/isis-global.conf` (IS-IS SR, SRGB, TI-LFA backup)
- `transport/isis-interface.conf` (level-2, TI-LFA, BFD, p2p)
- `transport/mpls-global.conf` (PCE LSPs, TTL, ICMP/IPv6 tunneling)
- `transport/bgp-internal.conf` (iBGP labeled-unicast + route-reflector)
- `transport/load-balance-pplb.conf` (chained-composite-next-hop)
- `transport/forwarding-options-hash.conf` (EVO only — L3+L4+MPLS hashing)

**Policy**
- `policy/allow-loopback.conf`, `policy/next-hop-self.conf`, `policy/pplb.conf`,
  `policy/sr-nonzero-loopbacks.conf`

**CoS baseline (transport marking)**
- `cos/forwarding-classes.conf` (8-class O-RAN model)
- `cos/classifier-exp.conf` + `cos/rewrite-exp.conf` (MPLS EXP core)
- `cos/scheduler-map.conf`
- `cos/schedulers-low-latency.conf` (EVO ACX — FC-LLQ = low-latency) **or**
  `cos/schedulers-strict-high.conf` (Junos MX + EVO PTX core — FC-LLQ = strict-high)
- `cos/cos-binding-transport.conf` (EXP classify + rewrite on core AE units)

---

## EVPN-VPWS (5G fronthaul eCPRI / L2 MBH point-to-point)

EVO = multi-homed (eCPRI fronthaul, ESI on the AG-facing LAG). Junos = single-homed
(midhaul/backhaul to SAG).

**minimum** (just the service)
- flavor: `evo/services/evpn-vpws-vlan-based-mh.conf` **or**
  `junos/services/evpn-vpws-vlan-based-sh.conf`
- `evo/interfaces/lag-esi.conf` (EVO — ESI LAG) **or**
  `junos/interfaces/vlan-ccc.conf` (Junos — vlan-ccc AC unit)
- `evo/interfaces/vlan-ccc.conf` (EVO AC unit) if not on the ESI LAG
- fronthaul CoS: `evo/cos/cos-binding-l2-fronthaul-static.conf` (static FC-LLQ) +
  `evo/firewall/filter-mf-ecpri-fronthaul.conf` (MAC-based eCPRI steering)

**with-overlay** (= minimum +)
- `transport/bgp-internal.conf` (assert iBGP family for EVPN)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## EVPN-FXC vlan-aware (Flexible Cross-Connect, fronthaul/midhaul)

**minimum**
- `services/evpn-fxc-vlan-aware.conf`
- `interfaces/vlan-ccc.conf` (+ `evo/interfaces/lag-esi.conf` for EVO multihoming)
- fronthaul CoS: `evo/cos/cos-binding-l2-fronthaul-static.conf` +
  `evo/firewall/filter-mf-ecpri-fronthaul.conf` (EVO)

**with-overlay** (= minimum + `transport/bgp-internal.conf`)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## EVPN-ELAN (multipoint L2 fronthaul)

EVO = `evpn-elan-vlan-based.conf` (mac-vrf, simple). Junos = `evpn-elan-vlan-based-irb.conf`
(mac-vrf + IRB — see the IRB service below).

**minimum**
- `evo/services/evpn-elan-vlan-based.conf`
- `interfaces/vlan-bridge.conf` (+ `evo/interfaces/lag-esi.conf` for multihoming)
- L2 CoS: `evo/cos/cos-binding-l2-fronthaul.conf` (802.1p classify)

**with-overlay** (= minimum + `transport/bgp-internal.conf`)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## EVPN-ELAN with IRB + L3VPN (integrated L2 + L3 midhaul)

The DU→SAG midhaul anycast-gateway pattern: bridge domain + IRB routed into an
L3VPN VRF.

**minimum**
- `services/evpn-elan-vlan-based-irb.conf` (Junos) **or**
  `evo/services/evpn-elan-vlan-based.conf` + `evo/cos/cos-binding-irb.conf` (EVO)
- `services/l3vpn-irb.conf` (the VRF that binds `irb.<unit>`)
- `interfaces/vlan-bridge.conf` (AC units)
- IRB CoS: `evo/cos/cos-binding-irb.conf` (static FC-REALTIME on IRB) (EVO)
- IRB firewall MF: `firewall/filter-mfc-ipv4-l3vpn-irb.conf` +
  `firewall/filter-mfc-ipv6-l3vpn-irb.conf`

**with-overlay** (= minimum + `transport/bgp-internal.conf`)

**as-deployed** (= with-overlay + shared underlay baseline + full L3 CoS:
`cos/classifier-dscp.conf`, `cos/classifier-dscp-ipv6.conf`,
`cos/rewrite-dscp.conf`, `cos/rewrite-dscp-ipv6.conf`,
`cos/cos-binding-l3-service.conf`)

---

## L3VPN with IRB (anycast gateway, standalone)

**minimum**
- `services/l3vpn-irb.conf`
- `interfaces/vlan-bridge.conf` (the AC/IRB attachment)
- `cos/cos-binding-l3-service.conf` (DSCP classify/rewrite per unit) +
  `firewall/filter-mfc-ipv4-l3vpn-irb.conf` + `firewall/filter-mfc-ipv6-l3vpn-irb.conf`

**with-overlay** (= minimum + `transport/bgp-internal.conf`)

**as-deployed** (= with-overlay + shared underlay baseline + full L3 CoS:
`cos/classifier-dscp*.conf`, `cos/rewrite-dscp*.conf`)

---

## BGP-VPLS (multipoint L2 MBH, RFC 4761)

**minimum**
- `services/bgp-vpls-vsi.conf`
- `interfaces/vlan-bridge.conf`
- L2 CoS: `evo/cos/cos-binding-l2-fronthaul.conf` (EVO)
- OAM (optional): `evo/oam/cfm-maintenance-domain.conf`

**with-overlay** (= minimum + `transport/bgp-internal.conf`)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## Add-a-feature requests (no full service)

When the user asks to add a supporting feature to an existing device, emit ONLY
that snip set (OS-appropriate):

- **CoS (full 8-class 5G model)** → `cos/forwarding-classes.conf` +
  `cos/scheduler-map.conf` + (`cos/schedulers-low-latency.conf` for EVO ACX /
  `cos/schedulers-strict-high.conf` for Junos MX + EVO PTX) + all classifiers
  (`cos/classifier-ieee-802.1.conf`, `cos/classifier-exp.conf`,
  `cos/classifier-dscp.conf`, `cos/classifier-dscp-ipv6.conf`) + all rewrites
  (`cos/rewrite-ieee-802.1.conf`, `cos/rewrite-exp.conf`, `cos/rewrite-dscp.conf`,
  `cos/rewrite-dscp-ipv6.conf`) + the relevant `cos/cos-binding-*.conf`
- **Low-latency fronthaul CoS binding** → `evo/cos/cos-binding-l2-fronthaul-static.conf`
  (static FC-LLQ) or `evo/cos/cos-binding-l2-fronthaul.conf` (802.1p) +
  `evo/cos/schedulers-low-latency.conf` + `evo/firewall/filter-mf-ecpri-fronthaul.conf`
- **OAM/CFM** → `evo/oam/cfm-maintenance-domain.conf`
- **Firewall / MF classification** → `firewall/filter-mfc-ipv4-l3vpn-irb.conf` +
  `firewall/filter-mfc-ipv6-l3vpn-irb.conf` (L3VPN IRB) or
  `evo/firewall/filter-mf-ecpri-fronthaul.conf` (eCPRI fronthaul)
- **Load-balancing** → `policy/pplb.conf` + `transport/load-balance-pplb.conf` +
  `evo/transport/forwarding-options-hash.conf` (EVO)

## byoai/DEFAULTS.md

# Auto-Fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD
lab-default values the AI uses in `auto` mode (or when the user short-circuits with
`all defaults` / `use defaults` / `skip`). It is bundled into
[`jvd-llq-snips.md`](jvd-llq-snips.md) by `regenerate-bundle.sh`.

Use these values EXACTLY. Do not invent alternative defaults. Every value the AI
auto-fills MUST be listed in the output's `Inputs used:` block so the user can
rerun with edits. All values below are taken from the JVD's own validated device
configs (`configuration/conf/*.conf`).

---

## Device inventory (the JVD topology)

| Device | OS family | Role | Loopback (router-id) | SR node index |
|--------|-----------|------|----------------------|---------------|
| `an4_acx7024` | EVO | Access / Cell Site Router (CSR) | `192.168.1.0` | 0 |
| `an1_acx7100-48l` | EVO | Access Node | `192.168.1.1` | 3 |
| `an3_acx7100-48l` | EVO | Access Node | `192.168.1.2` | 4 |
| `ag1_1_acx7509` | EVO | Aggregation / Hub Site Router (HSR) | `192.168.1.3` | 8 |
| `ag1_2_acx7100-32c` | EVO | Aggregation / HSR | `192.168.1.4` | 9 |
| `ag2_1_mx204` | Junos | Aggregation | `192.168.1.5` | 10 |
| `ag2_2_mx204` | Junos | Aggregation | `192.168.1.6` | 11 |
| `ag3_1_mx480` | Junos | Aggregation | `192.168.1.7` | 12 |
| `ag3_2_mx480` | Junos | Aggregation | `192.168.1.8` | 13 |
| `cr1_ptx10001-36mr` | EVO | Core / Route Reflector | `192.168.1.9` | 14 |
| `cr2_ptx10001-36mr` | EVO | Core / Route Reflector | `192.168.1.10` | 15 |
| `sag_mx304` | Junos | Services Aggregation Gateway (SAG) | `192.168.1.11` | — |

**Device-choice shortcuts** (offered in the clarifying question):
- `EVO` → `an4_acx7024` (CSR) + `ag1_1_acx7509` (HSR) — the primary eCPRI
  fronthaul pair, both LLQ-capable ACX
- `JUNOS` → `sag_mx304` (SAG) + `ag2_1_mx204` (aggregation)
- `MIXED` → `an4_acx7024` (EVO CSR) + `sag_mx304` (Junos SAG) — end-to-end
  fronthaul-to-services example

The two core routers (`cr1_ptx10001-36mr`, `cr2_ptx10001-36mr`) are the iBGP route
reflectors — services are NOT instantiated on them. On MX (`sag`, `ag2`, `ag3`)
and PTX core, FC-LLQ is realized with `priority strict-high`
(`cos/schedulers-strict-high.conf`); only ACX supports the hardware
`priority low-latency` scheduler (`cos/schedulers-low-latency.conf`).

---

## Transport / underlay defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `<asn>` / `$LOCAL_AS` | `63535` | primary xHaul AS (all devices except SAG far-AS) |
| `<sag-asn>` | `63536` | SAG / inter-AS Option-B peer AS |
| `<router-id>` / `<loopback-address>` | = device loopback | per device (see table) |
| IS-IS area | `49.1022.1001` | NET `49.1022.1001.0000.00<nn>.00`, `<nn>` per device |
| IS-IS level | `2` (agg/core), `1` (access AN → L1/L2 HSR) | Seamless MPLS domains |
| SRGB | start-label `16000`, index-range `80000` | domain-wide, consistent everywhere |
| `<ipv4-sid-index>` | per device (see table) | e.g. an4=0, ag1_1=8, cr1=14 |
| `<ipv6-sid-index>` | `100 + <ipv4-sid-index>` | IPv6 node-SID index |
| MTU (core) | `9192` | inter-router AE + lo0 |

---

## LAG / interface defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `<ae-interface>` | `ae26` (fronthaul ESI LAG, EVO) / `ae11` (transport) | per role |
| `<lacp-system-id>` | `00:00:00:00:00:01` | shared across the AG pair for EVPN ESI |
| `<interface>` (AC, single-homed) | `et-1/0/1` (EVO 10g) / `xe-0/1/3:2` (Junos) | first AC member |
| `<unit-number>` / `<vlan-id>` | start `101` (fronthaul) / `2501` (midhaul BD) | increment per instance |

---

## Service instance-name conventions

Each service kind uses a distinct instance-name prefix. Increment the trailing
numeric per instance.

| Service | Instance name pattern | Starting example | Unit / VLAN start |
|---------|----------------------|------------------|-------------------|
| EVPN-VPWS (fronthaul MH) | `FRONTHAUL-EVPN-VPWS-MH-AN1-<n>` | `FRONTHAUL-EVPN-VPWS-MH-AN1-1` | `101` |
| EVPN-VPWS (midhaul SH) | `MBH-EVPN-VPWS-SH-<n>` | `MBH-EVPN-VPWS-SH-1` | `901` |
| EVPN-FXC vlan-aware | `FRONTHAUL-EVPN-FXC-<n>` | `FRONTHAUL-EVPN-FXC-1` | `101` |
| EVPN-ELAN (fronthaul) | `FRONTHAUL-EVPN-ELAN-MH-<n>` | `FRONTHAUL-EVPN-ELAN-MH-1` | `1501` |
| EVPN-ELAN + IRB / L3VPN | `L3VPN-IRB-ANYCAST-GATEWAY-MH-<n>` | `L3VPN-IRB-ANYCAST-GATEWAY-MH-1` | IRB unit `351` |
| BGP-VPLS | `MBH-BGP-VPLS-<n>` | `MBH-BGP-VPLS-1` | `2501` |
| L3VPN-IRB | `L3VPN-IRB-<n>` | `L3VPN-IRB-1` | IRB unit `101` |

---

## Route-distinguisher / route-target defaults

| Variable | Rule | Example |
|----------|------|---------|
| `<rd-value>` | `<device-loopback>:<unit>` | `192.168.1.0:3401` |
| `<rt-value>` | `target:<asn>:<id>` | `target:63535:3401` |
| `<local-id>` / `<remote-id>` | VPWS service-id pair; symmetric across the two PEs | local `1`, remote `2` (swap on the far PE) |

**Cross-PE identifier rule:** route-targets, VPWS service-id pairs, ESI values, and
MAC-VRF / instance names MUST match on both PE halves of a service. Per-PE
identifiers (loopback, RD, AC interface name) differ.

---

## Multi-homing (ESI) defaults

- All-active ESI on the AG-facing fronthaul LAG (e.g. `ae26`) for dual-homed ANs.
- ESI value pattern: `00:51:11:11:11:11:11:00:00:<nn>` — the trailing octet is
  per-ESI; MUST match on both HSRs of the multi-homed pair.
- LACP system-id on the shared LAG MUST match on both HSRs of the ESI.

---

## IRB / L3 defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `<irb-unit>` | = the ELAN unit (e.g. `351`) | irb.<unit> |
| `<irb-ipv4>` | `100.100.<x>.1/24` | anycast gateway per bridge domain |
| `<bridge-domain-name>` | `BD_EVPN_ELAN_<vlan>` | e.g. `BD_EVPN_ELAN_1501` |

---

## CoS defaults (JVD-wide constants — never parameterize)

8-class O-RAN multi-priority model, do NOT renumber:

| Queue | Forwarding class | Priority (ACX / MX-PTX) |
|-------|------------------|-------------------------|
| 7 | FC-SIGNALING | strict-high / high |
| 6 | **FC-LLQ** | **low-latency (ACX) / strict-high (MX-PTX)** |
| 5 | FC-REALTIME | medium-high |
| 4 | FC-HIGH | low (WFQ) |
| 3 | FC-CONTROL | high |
| 2 | FC-MEDIUM | low (WFQ) |
| 1 | FC-LOW | low (WFQ) |
| 0 | FC-BEST-EFFORT | low (WFQ remainder) |

Classifier / rewrite names (`CL-MPLS`, `CL-8021P`, `CL-DSCP`, `CL-DSCP-IPV6`,
`RR-MPLS`, `RR-8021P`, `RR-DSCP`, `RR-DSCP-IPV6`), scheduler-map `SM-5G-SCHEDULER`,
and scheduler names (`SC-LLQ`, `SC-SIGNALING`, …) are JVD-wide constants — never
parameterize the class names, queue numbers, or these identifiers.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape
every generation must take. Bundled into [`jvd-llq-snips.md`](jvd-llq-snips.md) by
`regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked
or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum" or "with-overlay"
# devices:
#   pe1: { name: <hostname>, os: <junos|evo>, role: <csr|hsr|agg|core|sag>, loopback4: <addr> }
#   pe2: { ... }
# services:
#   - { kind: <evpn-vpws|evpn-fxc|evpn-elan|evpn-elan-irb|l3vpn-irb|bgp-vpls>,
#       count: <int>,
#       start_id: <int>,
#       start_vlan: <int>,
#       start_ac_unit: <int>,
#       rt: <target:...>,
#       esi_base: <hex>,         # for multihomed fronthaul services
#       irb_subnet: <prefix> }   # for evpn-elan-irb / l3vpn-irb
# snips_used:
#   - evo/services/evpn-vpws-vlan-based-mh.conf
#   - evo/cos/cos-binding-l2-fronthaul-static.conf
#   - ...
```

This block makes every generation reproducible — the user can paste it back to
regenerate the same output.

## 2. One fenced `text` block per device

Each device block starts with a `# device:` label and groups its snips with
`/* snips/<path> */` section comments:

```text
# device: <hostname>
/* snips/<path-to-snip>.conf */
<rendered config block>

/* snips/<path-to-next-snip>.conf */
<rendered config block>
```

Drop the leading C-style `/* … */` documentation header from each snip when
emitting. Keep one `/* snips/<path> */` line as the section comment.

## 3. `Notes:` section (always last)

Bullets covering:

- Snips intentionally omitted (and why).
- Inputs defaulted because the user did not provide them.
- Cross-PE consistency the user must verify (RTs, ESIs, VPWS service-id pairs,
  MAC-VRF / instance names).
- Anything that is by-pattern rather than validated on that exact device (e.g. a
  user-supplied hostname not in any snip's `Seen on:` list).
- **CoS priority realization:** on ACX (access/aggregation) FC-LLQ uses the
  hardware `priority low-latency` scheduler (`cos/schedulers-low-latency.conf`);
  on MX (SAG/aggregation) and PTX (core) FC-LLQ falls back to `priority
  strict-high` (`cos/schedulers-strict-high.conf`) — pick the file that matches
  the device family, and flag when a service spans both.
- **Fronthaul classification:** dedicated eCPRI units may use
  `cos-binding-l2-fronthaul-static.conf` (static FC-LLQ, no classifier) vs
  `cos-binding-l2-fronthaul.conf` (802.1p classification). MAC pools in
  `filter-mf-ecpri-fronthaul.conf` are lab-specific — remind the user to
  substitute site eCPRI/PTP MAC addresses.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say
exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
